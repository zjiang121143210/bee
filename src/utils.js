/* eslint-disable no-useless-escape */
import config from './config';

const nativeIsArray = Array.isArray;
const {
  toString,
} = Object.prototype;
const win = window;
const doc = window.document;
const loc = win.location;
const windowConsole = win.console;
const windowNavigator = win.navigator;
const userAgent = windowNavigator.userAgent;

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
  return !_.isVoid(v);
};

_.isDef = function (v) {
  return v !== undefined && v !== null;
};

_.isString = function (obj) {
  return toString.call(obj) === '[object String]';
};

_.isObject = function (v) {
  return toString.call(v) === '[object Object]';
};

_.isFunction = function (v) {
  return toString.call(v) === '[object Function]';
};

_.isArray = nativeIsArray || function (obj) {
  return toString.call(obj) === '[object Array]';
};

const hasOwnProperty = Object.prototype.hasOwnProperty;
_.hasOwn = function (obj, key) {
  return hasOwnProperty.call(obj, key);
};

/**
 * 连接json
 */
_.joinJson = function (target, ...arg) {
  if (_.isUndefined(target)) return {};
  return Object.assign(target, ...arg);
};

/**
 * 更新目标json（target）
 */
_.updateFormJson = function (target, ...arg) {
  arg.forEach((json) => {
    if (!_.isObject(json)) return;
    Reflect.ownKeys(json).forEach((key) => {
      if (_.hasOwn(target, key)) {
        target[key] = json[key];
      }
    });
  });
  return target;
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

/**
 * 添加监听事件
 */
_.addListener = function (type, func, t) {
  if (document.all) {
    window.attachEvent(`on${type}`, func);
  } else {
    window.addEventListener(type, func, t);
  }
};

/**
 * 获取元素属性值
 * @param element 元素
 * @param attribute 属性名
 * @param deep 是否深度遍历获取
 * 因为某些情况下（使用ui库）无法在直接目标元素上添加 属性（可能添加在目标元素外层）的情况
 */
_.getAttribute = function (element, attribute, deep = false) {
  let attr = element.getAttribute(attribute) ? element.getAttribute(attribute) : '';
  while (!attr && deep) {
    element = element.parentNode;
    if (!element || element.nodeName === 'BODY' || element.nodeName === 'HTML' || element.nodeName === '#document') {
      break;
    }
    attr = element.getAttribute(attribute) ? element.getAttribute(attribute) : '';
  }
  return attr;
};

/**
 * 获取元素的信息
 * ev value
 * ex xpath
 * ei 元素index
 * eh href
 */
_.getElementInfo = function (el) {
  const eh = el.getAttribute('href') || el.getAttribute('src') || '';
  const ev = el.innerText || '';
  const ei = _.getElementIndex(el);
  const ex = _.getElementPath(el);

  return {
    ev,
    ex,
    ei,
    eh,
  };
};

/**
 * 获取元素的index
 */
_.getElementIndex = function (el) {
  let ix = 1;
  const child = el.parentNode.childNodes;
  if (!child || child.length === 0) {
    return ix;
  }
  for (let i = 0, l = child.length; i < l; i += 1) {
    if (child[i] === el) {
      ix = i + 1;
      break;
    }
  }
  return ix;
};

/*
 * 获取元素的xpath
 */
_.getElementPath = function (el) {
  if (!el || el === document.body) {
    return '';
  }
  const id = el.id ? `#${el.id}` : '';
  const className = el.className ? `.${el.className}` : '';
  const target = `/${el.tagName.toLowerCase()}${id}${className}`;
  return _.getElementPath(el.parentNode) + target;
};

/**
 * 判断 next href 是否改变
 */
_.isHrefChange = function (href, nextHref) {
  // 如果 nextHref 为空、不是字符串，或者与上一个 url 相同，则返回false
  if (!nextHref || typeof nextHref !== 'string' || nextHref === href) {
    return false;
  }

  // 去掉 # 和 ? 后面的参数
  href = href.replace(/\?.*$/, '').replace(/#.*$/, '');

  const _nextHref = nextHref.replace(/\?.*$/, '').replace(/#.*$/, '');

  return href !== _nextHref;
};

/**
 * 自定义事件
 * @param e
 * @param detail
 */
_.customEvent = function (e, detail) {
  let evt = null;

  if (win.CustomEvent) {
    evt = new CustomEvent(e, {
      detail,
    });
  } else {
    evt = doc.createEvent('HTMLEvents');
    evt.initEvent(e, false, true);
    evt.detail = detail;
  }

  win.dispatchEvent(evt);
};

/**
 * 重写 history 方法 pushState replaceState，加入监听函数
 * @param prop
 */
_.customHistory = function (prop) {
  const fun = win.history[prop];
  if (typeof fun === 'function') {
    win.history[prop] = (...args) => {
      let _href = args[2];
      if (!_href) {
        return false;
      }
      const {
        href,
      } = loc;
      if (!(/^((http|https):)?\/\//.test(_href))) {
        _href = this.getLocationOrigin() + (_href.indexOf('/') !== 0 ? `/${_href}` : _href);
      }
      const changed = this.hrefIsChange(href, _href);
      const val = fun.apply(win.history, args);
      if (changed) {
        this.customEvent('beeHistoryChange', {
          oldURL: href,
          newURL: _href,
        });
      }
      return val;
    };
    win.history[prop].toString = `Bee custom: ${prop}() { [native code] }`;
  }
};

/**
 * 严重uid是否合法
 */
_.validUid = function (id) {
  if (_.isVoid(id)) return false;
  const arr = id.split('-');
  if (arr.length !== 2 || arr[1].length !== config.uidNum) return false;
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
    const android = /(android)/.exec(userAgent.toLowerCase());
    os = _.isNull(android) ? platform[0] : 'android';
  } else {
    os = platform[0];
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
  const ua = userAgent.toLowerCase();
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

_.isM = function () {
  return /(iPhone|iPad|iPod|iOS|ios|Android|Mobile)/i.test(userAgent);
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