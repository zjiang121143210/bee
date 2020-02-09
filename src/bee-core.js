/**
 * bee 核心功能
 */

import {
  _,
  console,
} from './utils';
import config from './config';
import BeeData from './bee-data';
// import send from './bee-request';
import initSend from './bee-send';
import BeeImp from './bee-imp';

const win = window;
const doc = win.document;

/**
 * 初始化数据
 */
function setConfig(userConfig) {
  _.joinJson(config, userConfig);
  return config;
}

/**
 * 初始化元素监听
 */
function initElementListener(bee) {
  _.addListener('click', bee.onClick.bind(bee), true);
  // _.addListener('change', this.click.bind(this), true);
}

/**
 * 初始化曝光功能
 */
function initImp(bee) {
  // 曝光定时器
  let impTimer = null;
  bee.beeImp = new BeeImp(bee);

  // 曝光监听
  function impListener() {
    clearTimeout(impTimer);
    bee.beeImp.start();
    impTimer = setTimeout(() => {
      impListener();
    }, config.impInterval);
  }

  // 添加监听
  _.addListener('load', () => {
    impListener();
  }, true);
  _.addListener('scroll', impListener, true);
  _.addListener('click', impListener, true);
}

/**
 * 初始化单页应用监听
 */
function initSpaRouter(bee) {
  // 重写 history pushState 和 replaceState
  _.customHistory('pushState');
  _.customHistory('replaceState');

  // 注册单页面监听方法
  _.addListener('beeHistoryChange', bee.onRouteChange.bind(bee), false);
  _.addListener('hashchange', bee.onRouteChange.bind(bee), false);
}

const Bee = function (pid, userConfig) {
  // 初始化配置
  if (_.isDef(pid) && _.isString(pid)) {
    config.pid = pid;
  }
  if (_.isDef(userConfig) && _.isObject(userConfig)) {
    setConfig(userConfig);
  }
  // 初始化数据
  this.beeData = new BeeData();

  // initData
  config.domain = _.getTopDomain(window.document.domain);

  // 判断是否为首次访问
  this.isFirstVisit();
  this.isNewSession();

  if (config.autoPage) {
    this.sendPage();
  }

  // 初始化点击监听
  initElementListener(this);

  // 初始化曝光事件
  // if (config.imp && _.isM()) {
  if (config.imp) {
    initImp(this);
  }

  // 初始化单页应用路由监听
  if (config.spa) {
    initSpaRouter(this);
  }
};

/**
 * 挂载上报相关事件
 */
initSend(Bee);

/**
 * 用户首次访问初始化设置
 */
Bee.prototype.isFirstVisit = function () {
  if (!_.validUid(_.getCookie('uid'))) {
    this.beeData.setUserData();
  }
};

/**
 * 新会话设置
 */
Bee.prototype.isNewSession = function () {
  if (_.isUndefined(_.getCookie('sid'))) {
    this.beeData.setSessionData();
  }
};

/**
 * 设置配置数据，或获取配置信息
 * @param userConfig Object | String | undefined
 * 当 userConfig 为 undefined 时 返回 config
 * 当 userConfig 为  Object 时设置传入的配置， 返回 config
 * 当 userConfig 为 String 时返回对应的 config 或 undefined
 * @returns 对应的配置信息
 */
Bee.prototype.setConfig = function (userConfig) {
  if (_.isDef(userConfig)) {
    if (_.isObject(userConfig)) setConfig(userConfig);
    if (_.isString(userConfig)) return config[userConfig];
  }
  return config;
};

/**
 * 点击事件处理
 */
Bee.prototype.onClick = function (e) {
  const el = e.target;
  const targetData = _.getAttribute(el, config.clickTag, true);
  if (!targetData && config.clickList.indexOf(el.tagName.toLocaleLowerCase()) === -1) return false;
  if (_.isVoid(targetData) && !config.allClick) return false;
  const elInfo = _.getElementInfo(el);
  return this.sendClick(elInfo, targetData);
};


/**
 * 发送Page事件
 */
Bee.prototype.sendPage = function () {
  const data = this.beeData.makePageData();
  this.send(data);
};

/**
 * 发送点击事件
 */
Bee.prototype.sendClick = function (el, param) {
  const data = this.beeData.makeClickData(el, param);
  this.sendBean(data);
};

/**
 * 发送曝光事件
 */
Bee.prototype.sendImp = function (impList = []) {
  if (impList.length === 0) return;
  const data = this.beeData.makeImpData(impList);
  this.sendBean(data);
};

/**
 * 发送自定义事件
 * @param type 事件类型
 * @param param 事件数据
 */
Bee.prototype.sendCustom = function (type, param = {}) {
  if (_.isVoid(type) || !_.isString(type) || ['page', 'imp', 'clck'].indexOf(type) > -1) {
    console.error('自定义事件异常！');
    return false;
  }
  const data = this.beeData.makeCustomData(type, param);
  this.sendBean(data);
  return true;
};

/**
 * 单页应用路由变化处理
 */
Bee.prototype.onRouteChange = function (e) {
  // 前一个 url
  let newURL;
  let oldURL;
  if (e instanceof win.HashChangeEvent) {
    newURL = e.newURL;
    oldURL = e.oldURL;
  } else {
    newURL = e.detail && e.detail.newURL;
    oldURL = e.detail && e.detail.oldURL;
  }
  this.beeData.updateRoute(newURL, oldURL);
  // 在单页应用的情况下清空曝光列表
  if (this.beeImp) this.beeImp.clearImpList();
  this.sendPage();
};

/**
 * 用于外部调用的方法
 */
Bee.prototype.command = function (active, data, option = {}) {
  /**
   * 命令Map
   * 用来映射命令与方法
   */
  const commandMap = {
    page: 'sendPage',
    click: 'sendClick',
    event: 'sendCustom',
    imp: 'sendImp',
    config: 'setConfig',
  };
  let res = false;
  switch (active) {
    case 'page': {
      let url = doc.URL;
      if (_.isNotVoid(data) && _.isString(data)) {
        url = data;
      }
      this.beeData.updateRoute(url);
      this.sendPage();
      break;
    }
    /**
     * 曝光命令处理
     * 当 -> bee('imp') ，则触发一次曝光抓取 beeImp.start()
     * 当 -> bee('imp', object: any) 会将 object 整理为 array 并处触发this.sendImp
     */
    case 'imp': {
      if (config.imp && this.beeImp instanceof BeeImp) {
        if (_.isVoid(data)) {
          this.beeImp.start();
        } else {
          const list = _.isArray(data) ? data : [data];
          this.sendImp(list);
        }
      }
      break;
    }
    default: {
      if (_.hasOwn(commandMap, active)) {
        res = this[commandMap[active]](data, option);
      }
      break;
    }
  }
  return res;
};

export default Bee;