/* eslint-disable no-useless-escape */
import config from './config';

const nativeIsArray = Array.isArray;
const {
  toString,
} = Object.prototype;
const windowConsole = window.console;
const windowNavigator = window.navigator;

const _ = {};

_.isUndefined = function (obj) {
  return obj === undefined;
};

_.isVoid = function (v) {
  return v === undefined || v === null || v === '';
};

_.isNull = function (v) {
  return v === null;
};

_.isNotVoid = function (v) {
  return !_.isVoid();
};

_.isDef = function (v) {
  return v !== undefined && v !== null;
};

_.isString = function (obj) {
  return toString.call(obj) === '[object String]';
};

_.isFunction = function (v) {
  return toString.call(v) === '[object Function]';
};

_.isArray = nativeIsArray || function (obj) {
  return toString.call(obj) === '[object Array]';
};

/**
 * 连接json
 */
_.joinJson = function (target, ...arg) {
  if (_.isUndefined(target)) return {};
  return Object.assign(target, ...arg);
};

_.checkRCFL = function (json) {
  const cleanJson = json;
  const value = '_ENTER_';
  Reflect.ownKeys(cleanJson).forEach((key) => {
    if (_.isString(cleanJson[key])) {
      cleanJson[key] = cleanJson[key].replace(/\\n\\r/g, value).replace(/\\r\\n/g, value).replace(/\\r/g, value).replace(/\\n/g, value)
        .replace(/\t/g, ' ')
        .replace(/\r/g, ' ')
        .replace(/\n/g, ' ');
    }
  });
  return cleanJson;
};

/**
 * 设置域名
 *
 */
_.getTopDomain = function (dm) {
  const fdIndex = dm.lastIndexOf('.');
  if (fdIndex === -1) {
    return dm;
  }
  const sdIndex = dm.substring(0, fdIndex).lastIndexOf('.');
  if (sdIndex > -1) {
    const mydm = dm.substring(sdIndex);
    if (mydm === '.com.cn') {
      const tfIndex = dm.substring(0, sdIndex).lastIndexOf('.');
      if (tfIndex > -1) {
        return dm.substring(tfIndex);
      }
      return `.${dm}`;
    }
    return mydm;
  }
  return `.${dm}`;
};

_.setCookie = function (name, value, MillsTime, hasPrefix = true) {
  const exp = new Date();
  const prefix = hasPrefix ? config.prefix : '';
  exp.setTime(exp.getTime() + MillsTime);
  const cookie = `${prefix}${name}=${encodeURI(value)};expires=${exp.toUTCString()};path=/;domain=${config.domain}`;
  document.cookie = cookie;
  return value;
};

_.getCookie = function (name, hasPrefix = true) {
  const prefix = hasPrefix ? config.prefix : '';
  let arr = '';
  const reg = new RegExp(`(^| )${prefix}${name}=([^;]*)(;|$)`);
  arr = document.cookie.match(reg);
  if (arr) {
    return unescape(arr[2]);
  }
  return null;
};

_.updateCookieDate = function (name, MillsTime, hasPrefix = true) {
  _.setCookie(name, _.getCookie(name, hasPrefix), MillsTime, hasPrefix);
};

_.validUid = function (id) {
  if (_.isVoid(id)) return false;
  const arr = id.split('-');
  if (arr.length !== 2 || arr[1].length !== config.uidRandomNum) return false;
  return true;
};

/**
 * 创建uid
 */
_.createId = function (n) {
  let num = '';
  for (; num.length < n;) {
    num += Math.random().toString(36).substr(2);
  }
  return (`${new Date().getTime().toString(36)}-${num.substr(0, n)}`).toLocaleUpperCase();
};

_.getPlatform = function () {
  const platform = /(win|android|linux|nokia|ipad|iphone|ipod|mac|sunos|solaris)/.exec(windowNavigator.platform.toLowerCase());
  let os = '';
  if (_.isVoid(platform)) {
    os = 'other';
  } else if (platform[0] === 'linux') {
    const android = /(android)/.exec(windowNavigator.userAgent.toLowerCase());
    os = _.isNull(android) ? platform[0] : 'android';
  } else {
    [os] = platform;
  }
  return os;
};

/**
 * UA 解析
 */
_.analysisUA = function () {
  const b = {
    name: 'other',
    version: '0',
  };
  const ua = navigator.userAgent.toLowerCase();
  const browserRegExp = {
    // 微信小程序
    miniprogram: /miniprogram/,
    // 微信公众号
    weixin: /micromessenger[|\/]([\w.]+)/,
    se360: /360se/,
    se360_2x: /qihu/,
    ie: /msie[ ]([\w.]+)/,
    firefox: /firefox[|\/]([\w.]+)/,
    chrome: /chrome[|\/]([\w.]+)/,
    safari: /version[|\/]([\w.]+)(\s\w.+)?\s?safari/,
    opera: /opera[|\/]([\w.]+)/,
  };
  Reflect.ownKeys(browserRegExp).forEach((key) => {
    const match = browserRegExp[key].exec(ua);
    if (match) {
      b.name = key;
      b.version = match[1] || '0';
    }
  });
  return b;
};


const console = {
  log(...arg) {
    if (config.debug && !_.isUndefined(windowConsole) && windowConsole) {
      windowConsole.log(...arg);
    }
  },
  error(...arg) {
    if (!_.isUndefined(windowConsole) && windowConsole) {
      const args = ['Bee error:'].concat(arg);
      windowConsole.error(...args);
    }
  },
};

export {
  _,
  console,
};