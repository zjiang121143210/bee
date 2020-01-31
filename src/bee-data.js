import config from './config';
import {
  _,
} from './utils';

const win = window;
const winScreen = win.screen;
const doc = win.document;
const winNavigator = win.navigator;

/**
 * 获取浏览器信息
 */
function getBrowserData() {
  const browserData = {};
  browserData.bw = win.innerHeight || '-';
  browserData.bh = win.innerWidth || '-';
  browserData.sr = winScreen ? `${winScreen.width}x${winScreen.height}` : '-';
  browserData.bl = winNavigator && winNavigator.language ? winNavigator.language : '-';
  browserData.so = _.getPlatform();
  const ua = _.analysisUA();
  browserData.bt = ua.name;
  browserData.bv = ua.version;
  return browserData;
}

/**
 * 获取节点相关信息
 */
function getElementInfo(item) {
  let info = {
    idx: -1,
    xpa: '',
    cha: '',
    hr: '',
    td: '',
  };
  if (item instanceof HTMLElement) {
    // 为节点时
    info = _.getElementInfo(item);
    info.td = _.getAttribute(item, config.impTag, false);
  } else if (_.isString(item)) {
    // 字符串
    info.td = item;
  } else if (item instanceof Object) {
    info = _.updateFormJson(info, item);
  }
  return info;
}

/**
 * 辅助数据处理类
 * 用于组装数据、控制cookie
 */
const BeeData = function () {
  // 页面打开时间
  this.setPtm();
  /**
   * 初始化业务id
   */
  if (_.isVoid(config.cid)) {
    BeeData.prototype.getCid = function () {
      return '';
    };
  }
  /**
   * 初始化浏览器信息
   */
  this.browser = getBrowserData();
  this.os = _.getPlatform();
  this.url = doc.URL;
  this.domain = doc.domain;
  this.re = doc.referrer;
  this.ua = navigator && navigator.userAgent ? navigator.userAgent : '-';
};

/**
 * 组装公共数据
 */
BeeData.prototype._makeCommonData = function (type) {
  if (_.isVoid(_.getCookie('sid'))) {
    this.setSessionData();
  }
  const data = {
    b: _.getCookie('uid'),
    s: _.getCookie('sid'),
    p: config.pid,
    // 获取用户添加的业务id
    u: this.getCid(),
    sdk: config.v,
    ua: this.ua,
    d: this.domain,
    t: type,
    vis: _.getCookie('sq'),
    tm: new Date().getTime(),
    url: this.url,
    re: this.re,
    v: '',
    os: this.os,
    fs: _.getCookie('fs'),
    ls: _.getCookie('ls'),
    ts: _.getCookie('ts'),
  };
  // 页面事件和访问事件没有ptm
  if (type !== config.event.visit && type !== config.event.page) {
    data.ptm = this.ptm;
  }
  // 浏览器信息
  const content = this.browser;
  const json = _.joinJson(data, content);
  return json;
};

/**
 * 组装页面上报数据
 */
BeeData.prototype.makePageData = function () {
  let data = {};
  data = this._makeCommonData(config.event.page);
  const content = {
    tl: doc.title,
  };
  const json = _.joinJson(data, content);
  return json;
};

/**
 * 组装点击上报数据
 */
BeeData.prototype.makeClickData = function (elInfo, targetData) {
  const {
    idx,
    xpa,
    cha,
    hr,
  } = elInfo;
  let data = {};
  data = this._makeCommonData(config.event.click);
  const content = {
    cha,
    xpa,
    td: targetData,
    idx,
    hr,
  };

  const json = _.joinJson(data, content);
  return json;
};

/**
 * 组装曝光上报数据
 */
BeeData.prototype.makeImpData = function (impList) {
  const infoList = [];
  impList.forEach((el) => {
    const info = getElementInfo(el);
    infoList.push(info);
  });
  const data = this._makeCommonData(config.event.imp);
  data.imp = infoList;
  return data;
};

/**
 * 组装自定义事件上报数据
 */
BeeData.prototype.makeCustomData = function (type, param) {
  const paramString = _.isString(param) ? param : JSON.stringify(param);
  const data = this._makeCommonData(config.event.cstm);
  data.cus = paramString;
  data.cut = type;
  return data;
};

BeeData.prototype.updateRoute = function (newURL = doc.URL, oldURL = doc.referrer) {
  this.setPtm();
  this.url = newURL;
  this.re = oldURL;
};

/**
 * 设置页面打开时间
 */
BeeData.prototype.setPtm = function () {
  this.ptm = new Date().getTime();
};

/**
 * 设置用户数据
 */
BeeData.prototype.setUserData = function () {
  this.clearCookie();
  this.setUid();
  this.setFs();
};

/**
 * 设置uid
 * 用来表示用户（浏览器）
 */
BeeData.prototype.setUid = function () {
  return _.setCookie('uid', _.createId(config.uidNum), config.user_time);
};

/**
 * 设置首次访问时间数据
 * fs 首次访问时间
 * ls 上次访问时间(-)
 */
BeeData.prototype.setFs = function () {
  _.setCookie('fs', this.ptm, config.user_time);
  _.setCookie('ls', '-', config.user_time);
};

/**
 * 设置会话数据
 * 会话时间、会话次数（访次）、会话id
 */
BeeData.prototype.setSessionData = function () {
  this.setSt();
  this.setSq();
  this.setSid();
};

/**
 * 设置会话时间
 * fs 首次会话时间
 * ls 上次会话时间
 * ts 本次会话时间
 */
BeeData.prototype.setSt = function () {
  const ls = _.getCookie('ts') || _.getCookie('fs') || 0;
  _.setCookie('ls', ls, config.user_time);
  _.setCookie('ts', this.ptm, config.user_time);
};

/**
 * 设置访序
 */
BeeData.prototype.setSq = function () {
  let sq = _.getCookie('sq');
  if (_.isNotVoid(sq)) {
    sq += 1;
  } else {
    sq = 1;
  }
  _.setCookie('sq', sq, config.user_time);
  return sq;
};

/**
 * 设置会话id
 */
BeeData.prototype.setSid = function () {
  return _.setCookie('sid', `${_.getCookie('uid')}-${_.getCookie('sq')}`, config.session_time);
};

/**
 * 获取业务id
 */
BeeData.prototype.getCid = function () {
  return _.getCookie(config.cid, false);
};

/**
 * 刷新cookie时间
 */
BeeData.prototype.updateCookieDate = function () {
  _.updateCookieDate('sid', config.session_time);
  _.updateCookieDate('uid', config.user_time);
  _.updateCookieDate('sq', config.user_time);
  _.updateCookieDate('fs', config.user_time);
  _.updateCookieDate('ls', config.user_time);
  _.updateCookieDate('ts', config.user_time);
};

/**
 * 清空cookie
 */
BeeData.prototype.clearCookie = function () {
  _.updateCookieDate('sid', 0);
  _.updateCookieDate('uid', 0);
  _.updateCookieDate('sq', 0);
  _.updateCookieDate('fs', 0);
  _.updateCookieDate('ls', 0);
  _.updateCookieDate('ts', 0);
};

export default BeeData;