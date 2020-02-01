(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  /**
   * 配置项
   */
  var config = {
    // sdk版本
    v: '0.0.1',
    // 埋点前缀
    prefix: 'bee_',

    /**
     * 业务id
     * 记录用户在当前业务（系统）中的id
     * 由用户提供，用来将流量数据与业务数据打通。
     * 为空则不采集
     */
    cid: '',

    /**
     * 采集数据上报地址
     * 请开启CORS跨域
     */
    req: 'jdqd.jd.com/poststring',

    /**
     * 会话过期时间，默认 30 分钟
     * 若连续 30 分钟，未进行有效操作（上报），
     * 下次有效操作会识别为新的会话
     * 每次成功上报会更新有效时间
     */
    session_time: 1800000,

    /**
     * 用户唯一标识过期时间，默认 3 年
     * 用户信息有效时间
     * 每次成功上报会更新有效时间
     */
    user_time: 94608000000,

    /**
     * id随机数位数
     * 默认 20
     */
    uidNum: 20,

    /**
     * 调试模式
     * 默认关闭
     * 开启后会在控制台输出日志
     */
    debug: true,

    /**
     * coookie 写入域名
     * 默认会将cookie写入顶级域，方便不同子域共享
     * test.clew.fun   ->   clew.fun
     */
    domain: null,

    /**
     * 是否自动上报页面事件
     * 默认开启
     * 开启后在执行 bee('init') 后会自动上报一次 page 事件
     */
    autoPage: true,

    /**
     * 是否为单页应用
     * 默认关闭
     * 开启后会重写 history 相关方法
     */
    spa: false,

    /**
     * 点击抓取标记
     * 添加对应属性后会采集标签的点击事件
     * <button data-bee="btn1">
     */
    clickTag: 'data-bee',

    /**
     * 是否全量上报数据
     * 默认关闭
     * 关闭时，只采集添加了标记属性的标签
     * 打开后会采集 clickList 标签的点击事件
     */
    allClick: false,

    /**
     * 开启全量采集后，自动采集标签列表
     * 小写
     */
    clickList: ['a', 'button', 'svg', 'img'],

    /**
     * 是否开启曝光采集
     * 默认不开启
     */
    imp: false,

    /**
     * 曝光属性标记
     * 默认和点击事件标记相同，
     * 如有需要可以修改，互不影响
     */
    impTag: 'data-bee',

    /**
     * 曝光自动采集间隔
     * 默认4秒自动采集一次
     * 同时scroll、click事件也会触发一次采集
     */
    impInterval: 4000,
    // 事件枚举
    event: {
      // visit: 'vst',
      page: 'page',
      // 页面
      click: 'click',
      // 点击
      imp: 'imp',
      // 曝光
      cstm: 'event' // 自定义

    }
  };

  var nativeIsArray = Array.isArray;
  var toString = Object.prototype.toString;
  var win = window;
  var doc = window.document;
  var loc = win.location;
  var windowConsole = win.console;
  var windowNavigator = win.navigator;
  var userAgent = windowNavigator.userAgent;
  var _ = {};

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

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  _.hasOwn = function (obj, key) {
    return hasOwnProperty.call(obj, key);
  };
  /**
   * 连接json
   */


  _.joinJson = function (target) {
    if (_.isUndefined(target)) return {};

    for (var _len = arguments.length, arg = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      arg[_key - 1] = arguments[_key];
    }

    return Object.assign.apply(Object, [target].concat(arg));
  };
  /**
   * 更新目标json（target）
   */


  _.updateFormJson = function (target) {
    for (var _len2 = arguments.length, arg = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      arg[_key2 - 1] = arguments[_key2];
    }

    arg.forEach(function (json) {
      if (!_.isObject(json)) return;
      Reflect.ownKeys(json).forEach(function (key) {
        if (_.hasOwn(target, key)) {
          target[key] = json[key];
        }
      });
    });
    return target;
  };

  _.checkRCFL = function (json) {
    var cleanJson = json;
    var value = '_ENTER_';
    Reflect.ownKeys(cleanJson).forEach(function (key) {
      if (_.isString(cleanJson[key])) {
        cleanJson[key] = cleanJson[key].replace(/\\n\\r/g, value).replace(/\\r\\n/g, value).replace(/\\r/g, value).replace(/\\n/g, value).replace(/\t/g, ' ').replace(/\r/g, ' ').replace(/\n/g, ' ');
      }
    });
    return cleanJson;
  };
  /**
   * 设置域名
   *
   */


  _.getTopDomain = function (dm) {
    var fdIndex = dm.lastIndexOf('.');

    if (fdIndex === -1) {
      return dm;
    }

    var sdIndex = dm.substring(0, fdIndex).lastIndexOf('.');

    if (sdIndex > -1) {
      var mydm = dm.substring(sdIndex);

      if (mydm === '.com.cn') {
        var tfIndex = dm.substring(0, sdIndex).lastIndexOf('.');

        if (tfIndex > -1) {
          return dm.substring(tfIndex);
        }

        return ".".concat(dm);
      }

      return mydm;
    }

    return ".".concat(dm);
  };

  _.setCookie = function (name, value, MillsTime) {
    var hasPrefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var exp = new Date();
    var prefix = hasPrefix ? config.prefix : '';
    exp.setTime(exp.getTime() + MillsTime);
    var cookie = "".concat(prefix).concat(name, "=").concat(encodeURI(value), ";expires=").concat(exp.toUTCString(), ";path=/;domain=").concat(config.domain);
    document.cookie = cookie;
    return value;
  };

  _.getCookie = function (name) {
    var hasPrefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var prefix = hasPrefix ? config.prefix : '';
    var arr = '';
    var reg = new RegExp("(^| )".concat(prefix).concat(name, "=([^;]*)(;|$)"));
    arr = document.cookie.match(reg);

    if (arr) {
      return unescape(arr[2]);
    }

    return null;
  };

  _.updateCookieDate = function (name, MillsTime) {
    var hasPrefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _.setCookie(name, _.getCookie(name, hasPrefix), MillsTime, hasPrefix);
  };
  /**
   * 添加监听事件
   */


  _.addListener = function (type, func, t) {
    if (document.all) {
      window.attachEvent("on".concat(type), func);
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


  _.getAttribute = function (element, attribute) {
    var deep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var attr = element.getAttribute(attribute) ? element.getAttribute(attribute) : '';

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
    var eh = el.getAttribute('href') || el.getAttribute('src') || '';
    var ev = el.innerText || '';

    var ei = _.getElementIndex(el);

    var ex = _.getElementPath(el);

    return {
      ev: ev,
      ex: ex,
      ei: ei,
      eh: eh
    };
  };
  /**
   * 获取元素的index
   */


  _.getElementIndex = function (el) {
    var ix = 1;
    var child = el.parentNode.childNodes;

    if (!child || child.length === 0) {
      return ix;
    }

    for (var i = 0, l = child.length; i < l; i += 1) {
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

    var id = el.id ? "#".concat(el.id) : '';
    var className = el.className ? ".".concat(el.className) : '';
    var target = "/".concat(el.tagName.toLowerCase()).concat(id).concat(className);
    return _.getElementPath(el.parentNode) + target;
  };
  /**
   * 判断 next href 是否改变
   */


  _.isHrefChange = function (href, nextHref) {
    // 如果 nextHref 为空、不是字符串，或者与上一个 url 相同，则返回false
    if (!nextHref || typeof nextHref !== 'string' || nextHref === href) {
      return false;
    } // 去掉 # 和 ? 后面的参数


    href = href.replace(/\?.*$/, '').replace(/#.*$/, '');

    var _nextHref = nextHref.replace(/\?.*$/, '').replace(/#.*$/, '');

    return href !== _nextHref;
  };
  /**
   * 自定义事件
   * @param e
   * @param detail
   */


  _.customEvent = function (e, detail) {
    var evt = null;

    if (win.CustomEvent) {
      evt = new CustomEvent(e, {
        detail: detail
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
    var _this = this;

    var fun = win.history[prop];

    if (typeof fun === 'function') {
      win.history[prop] = function () {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        var _href = args[2];

        if (!_href) {
          return false;
        }

        var href = loc.href;

        if (!/^((http|https):)?\/\//.test(_href)) {
          _href = _this.getLocationOrigin() + (_href.indexOf('/') !== 0 ? "/".concat(_href) : _href);
        }

        var changed = _this.hrefIsChange(href, _href);

        var val = fun.apply(win.history, args);

        if (changed) {
          _this.customEvent('beeHistoryChange', {
            oldURL: href,
            newURL: _href
          });
        }

        return val;
      };

      win.history[prop].toString = "Bee custom: ".concat(prop, "() { [native code] }");
    }
  };
  /**
   * 严重uid是否合法
   */


  _.validUid = function (id) {
    if (_.isVoid(id)) return false;
    var arr = id.split('-');
    if (arr.length !== 2 || arr[1].length !== config.uidNum) return false;
    return true;
  };
  /**
   * 创建uid
   */


  _.createId = function (n) {
    var num = '';

    for (; num.length < n;) {
      num += Math.random().toString(36).substr(2);
    }

    return "".concat(new Date().getTime().toString(36), "-").concat(num.substr(0, n)).toLocaleUpperCase();
  };

  _.getPlatform = function () {
    var platform = /(win|android|linux|nokia|ipad|iphone|ipod|mac|sunos|solaris)/.exec(windowNavigator.platform.toLowerCase());
    var os = '';

    if (_.isVoid(platform)) {
      os = 'other';
    } else if (platform[0] === 'linux') {
      var android = /(android)/.exec(userAgent.toLowerCase());
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
    var b = {
      name: 'other',
      version: '0'
    };
    var ua = userAgent.toLowerCase();
    var browserRegExp = {
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
      opera: /opera[|\/]([\w.]+)/
    };
    Reflect.ownKeys(browserRegExp).forEach(function (key) {
      var match = browserRegExp[key].exec(ua);

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

  var console = {
    log: function log() {
      if (config.debug && !_.isUndefined(windowConsole) && windowConsole) {
        windowConsole.log.apply(windowConsole, arguments);
      }
    },
    error: function error() {
      if (!_.isUndefined(windowConsole) && windowConsole) {
        for (var _len4 = arguments.length, arg = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          arg[_key4] = arguments[_key4];
        }

        var args = ['Bee error:'].concat(arg);
        windowConsole.error.apply(windowConsole, _toConsumableArray(args));
      }
    }
  };

  var win$1 = window;
  var winScreen = win$1.screen;
  var doc$1 = win$1.document;
  var winNavigator = win$1.navigator;
  /**
   * 获取浏览器信息
   */

  function getBrowserData() {
    var browserData = {};
    browserData.bi = "".concat(win$1.innerWidth || '-', "x").concat(win$1.innerHeight || '-');
    browserData.sr = winScreen ? "".concat(winScreen.width || '-', "x").concat(winScreen.height || '-') : '-x-';
    browserData.bl = winNavigator && winNavigator.language ? winNavigator.language : '-';
    browserData.so = _.getPlatform();

    var ua = _.analysisUA();

    browserData.bt = ua.name;
    browserData.bv = ua.version;
    return browserData;
  }
  /**
   * 获取节点相关信息
   */


  function getElementInfo(item) {
    var info = {
      br: '',
      ev: '',
      ex: '',
      ei: 0,
      eh: ''
    };

    if (item instanceof HTMLElement) {
      // 为节点时
      info = _.getElementInfo(item);
      info.br = _.getAttribute(item, config.impTag, false);
    } else if (_.isString(item)) {
      // 字符串
      info.br = item;
    } else if (item instanceof Object) {
      info = _.updateFormJson(info, item);
    }

    return info;
  }
  /**
   * 辅助数据处理类
   * 用于组装数据、控制cookie
   */


  var BeeData = function BeeData() {
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
    this.url = doc$1.URL;
    this.domain = doc$1.domain;
    this.rf = doc$1.referrer;
    this.ua = navigator && navigator.userAgent ? navigator.userAgent : '-';
  };
  /**
   * 组装公共数据
   */


  BeeData.prototype._makeCommonData = function (type) {
    if (_.isVoid(_.getCookie('sid'))) {
      this.setSessionData();
    }

    var data = {
      /**
       * 主键
       */
      u: _.getCookie('uid'),
      s: _.getCookie('sid'),
      c: this.getCid(),
      p: config.pid,

      /**
       * bee相关
       */
      t: type,
      sdk: config.v,

      /**
       * 时间
       */
      tm: type === config.event.page ? this.ptm : "".concat(new Date().getTime()),
      fs: _.getCookie('fs'),
      ls: _.getCookie('ls'),
      ts: _.getCookie('ts'),
      vs: _.getCookie('sq'),

      /**
       * 浏览器相关
       */
      bt: this.browser.bt,
      bv: this.browser.bv,
      so: this.browser.so,
      sr: this.browser.sr,
      bi: this.browser.bi,
      bl: this.browser.bl,

      /**
       * 地址相关
       */
      d: this.domain,
      url: this.url,
      rf: this.rf
    }; // 页面事件和访问事件没有ptm

    if (type !== config.event.visit && type !== config.event.page) {
      data.ptm = this.ptm;
    }

    return data;
  };
  /**
   * 组装页面上报数据
   */


  BeeData.prototype.makePageData = function () {
    var data = {};
    data = this._makeCommonData(config.event.page);
    var content = {
      tl: doc$1.title || ''
    };

    var json = _.joinJson(data, content);

    return json;
  };
  /**
   * 组装点击上报数据
   */


  BeeData.prototype.makeClickData = function (elInfo, targetData) {
    var ev = elInfo.ev,
        ex = elInfo.ex,
        ei = elInfo.ei,
        eh = elInfo.eh;
    var data = {};
    data = this._makeCommonData(config.event.click);
    var content = {
      br: targetData,
      ev: ev,
      ex: ex,
      ei: ei,
      eh: eh
    };

    var json = _.joinJson(data, content);

    return json;
  };
  /**
   * 组装曝光上报数据
   */


  BeeData.prototype.makeImpData = function (impList) {
    var infoList = [];
    impList.forEach(function (el) {
      var info = getElementInfo(el);
      infoList.push(info);
    });

    var data = this._makeCommonData(config.event.imp);

    data.imp = infoList;
    return data;
  };
  /**
   * 组装自定义事件上报数据
   */


  BeeData.prototype.makeCustomData = function (type, param) {
    var paramString = _.isString(param) ? param : JSON.stringify(param);

    var data = this._makeCommonData(config.event.cstm);

    data.et = type;
    data.ep = paramString;
    return data;
  };
  /**
   * 更新页面相关数据
   * @param newURL 新的地址
   * @param oldURL 旧的地址
   */


  BeeData.prototype.updateRoute = function () {
    var newURL = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : doc$1.URL;
    var oldURL = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : doc$1.referrer;
    this.setPtm();
    this.url = newURL;
    this.rf = oldURL;
  };
  /**
   * 设置页面打开时间
   */


  BeeData.prototype.setPtm = function () {
    this.ptm = "".concat(new Date().getTime());
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
    var ls = _.getCookie('ts') || _.getCookie('fs') || 0;

    _.setCookie('ls', ls, config.user_time);

    _.setCookie('ts', this.ptm, config.user_time);
  };
  /**
   * 设置访序
   */


  BeeData.prototype.setSq = function () {
    var sq = _.getCookie('sq');

    if (_.isNotVoid(sq)) {
      sq = parseInt(sq, 10) + 1;
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
    return _.setCookie('sid', "".concat(_.getCookie('uid'), "-").concat(_.getCookie('sq')), config.session_time);
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

  /* eslint-disable no-param-reassign */
  var sendBeacon = window.navigator.sendBeacon;
  var protocol = window.document.location.protocol === 'https:' ? 'https://' : 'http://';
  function initSend(Bee) {
    Bee.prototype.send = function (d) {
      var async = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var xhr = null;

      if (typeof XMLHttpRequest !== 'undefined') {
        xhr = new XMLHttpRequest();
      } else if (typeof ActiveXObject !== 'undefined') {
        // eslint-disable-next-line no-undef
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      } // 跨域允许发送 cookie
      // xhr.withCredentials = true;


      xhr.open('POST', protocol + config.req, async); // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

      xhr.setRequestHeader('Content-Type', 'text/plain');

      var data = _.checkRCFL(d);

      console.log('埋点上报数据：', '类型', data.t, '数据', data);
      xhr.send(JSON.stringify(data));
      this.beeData.updateCookieDate();
    };

    Bee.prototype.sendBean = function (d) {
      if (!_.isFunction(sendBeacon)) {
        return this.send(d, false);
      }

      var data = _.checkRCFL(d);

      var res = navigator.sendBeacon(protocol + config.req, JSON.stringify(data));

      if (res) {
        console.log('埋点上报数据(Beacon)：', '类型', data.t, '数据', data);
        this.beeData.updateCookieDate();
      } else {
        this.send(d, false);
      }

      return true;
    };
  }

  var bodyElm = document.body || null;
  var docElm = document.documentElement || null;
  /**
   * 坑位（标签）曝光处理逻辑类
   */

  var BeeImp =
  /*#__PURE__*/
  function () {
    function BeeImp(bee) {
      _classCallCheck(this, BeeImp);

      // 曝光元素列表
      this.impNodeList = []; // 可见区域高度

      this.clientHeight = 0; // 滚动条据顶端高度

      this.docScrollTop = 0;
      this.docScrollHeight = 0; // Bee实例

      this.bee = bee;
    }
    /**
     * 启动曝光收集
     */


    _createClass(BeeImp, [{
      key: "start",
      value: function start() {
        this.getTargetList(bodyElm);
        this.scrollFunc();
      }
      /**
       * 发送曝光数据
       */

    }, {
      key: "sendImp",
      value: function sendImp(impList) {
        this.bee.sendImp(impList);
      }
      /**
       * 获取被曝光标签
       */

    }, {
      key: "scrollFunc",
      value: function scrollFunc() {
        var _this = this;

        var visibleTop = window.scrollY;

        _this.getClientHeight();

        _this.getScrollTop();

        _this.getScrollHeight();

        if (_this.docScrollTop === visibleTop && _this.impNodeList.length > 0) {
          var impList = [];

          for (var i = 0, len = _this.impNodeList.length; i < len; i += 1) {
            var obj = _this.impNodeList[i];

            if (parseInt(obj.node.offsetHeight, 10) < docElm.clientHeight) {
              var screenAvailWidth = window.screen.availWidth; // 元素上边距离页面上边的距离

              var rectTopVal = obj.node.getBoundingClientRect().top; // 元素右边距离页面左边的距离

              var rectRightVal = obj.node.getBoundingClientRect().right; // 元素下边距离页面上边的距离

              var rectBottomVal = obj.node.getBoundingClientRect().bottom; // 元素左边距离页面左边的距离

              var rectLeftVal = obj.node.getBoundingClientRect().left; // let objOffsetWidth = obj.node.offsetWidth

              if (rectTopVal <= _this.clientHeight && rectTopVal > 0 && rectRightVal > 0 && rectRightVal <= screenAvailWidth) {
                // 屏幕内的元素(包含元素上边露出一点&去除轮播图未出现部分)
                if (obj.node.attributes[config.impTag] && !obj.flag) {
                  obj.flag = true;
                  impList.push(obj.node);
                }
              } else if (-rectTopVal < obj.node.offsetHeight && rectTopVal < 0 && rectRightVal > 0 && rectRightVal <= screenAvailWidth) {
                // 元素下边露出一点(去除轮播图未出现部分)
                if (obj.node.attributes[config.impTag] && !obj.flag) {
                  obj.flag = true;
                  impList.push(obj.node);
                }
              } else if (rectTopVal <= _this.clientHeight && rectTopVal > 0 && rectBottomVal < window.screen.availHeight * 2 && rectLeftVal <= screenAvailWidth) {
                if (obj.node.attributes[config.impTag] && !obj.flag) {
                  obj.flag = true;
                  impList.push(obj.node);
                }
              }
            }
          }

          if (impList.length > 0) {
            _this.sendImp(impList);
          }
        }
      }
      /**
       * 获取全部需曝光标签
       */

    }, {
      key: "getTargetList",
      value: function getTargetList(node) {
        if (_.isDef(node.hasChildNodes)) {
          var subNodes = node.childNodes;

          for (var i = 0, len = subNodes.length; i < len; i += 1) {
            var subNode = subNodes.item(i);

            if (_.isDef(subNode.offsetTop) && _.isDef(subNode.offsetHeight)) {
              if (subNode.attributes[config.impTag] && subNode.style.display !== 'none') {
                var beeImpVal = subNode.attributes[config.impTag].nodeValue;

                if (!this.isContains(beeImpVal) && beeImpVal) {
                  this.impNodeList.push({
                    node: subNode,
                    beeImp: beeImpVal,
                    flag: false
                  });
                }
              }

              this.getTargetList(subNode);
            }
          }
        }
      }
      /**
       * 判断是否存在tag
       */

    }, {
      key: "isContains",
      value: function isContains(tagKey) {
        var i = this.impNodeList.length;

        while (i > 0) {
          if (this.impNodeList[i - 1].beeImp === tagKey) return true;
          i -= 1;
        }

        return false;
      }
      /**
       * 获取屏幕宽度
       */

    }, {
      key: "getClientWidth",
      value: function getClientWidth() {
        var clientWidth = 0;
        var bodyCW = bodyElm.clientWidth;
        var docCW = docElm.clientWidth;

        if (bodyCW && docCW) {
          clientWidth = bodyCW < docCW ? bodyCW : docCW;
        } else {
          clientWidth = bodyCW > docCW ? bodyCW : docCW;
        }

        this.getClientWidth = clientWidth;
      }
      /**
       * 获取屏幕高度
       */

    }, {
      key: "getClientHeight",
      value: function getClientHeight() {
        var clientHeight = 0;
        var bodyCH = bodyElm.clientHeight;
        var docCH = docElm.clientHeight;

        if (bodyCH && docCH) {
          clientHeight = bodyCH < docCH ? bodyCH : docCH;
        } else {
          clientHeight = bodyCH > docCH ? bodyCH : docCH;
        }

        this.clientHeight = clientHeight;
      }
      /**
       * 滚动条据顶端高度
       */

    }, {
      key: "getScrollTop",
      value: function getScrollTop() {
        var scrollTop = 0;

        if (docElm && docElm.scrollTop) {
          scrollTop = docElm.scrollTop;
        } else if (bodyElm) {
          scrollTop = bodyElm.scrollTop;
        }

        this.docScrollTop = scrollTop;
      }
      /**
       * 滚动条高度
       */

    }, {
      key: "getScrollHeight",
      value: function getScrollHeight() {
        this.docScrollHeight = Math.max(bodyElm.scrollHeight, docElm.scrollHeight);
      }
    }]);

    return BeeImp;
  }();

  /**
   * bee 核心功能
   */
  var win$2 = window;
  var doc$2 = win$2.document;
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
    _.addListener('click', bee.onClick.bind(bee), true); // _.addListener('change', this.click.bind(this), true);

  }
  /**
   * 初始化曝光功能
   */


  function initImp(bee) {
    // 曝光定时器
    var impTimer = null;
    bee.beeImp = new BeeImp(bee); // 曝光监听

    function impListener() {
      clearTimeout(impTimer);
      bee.beeImp.start();
      impTimer = setTimeout(function () {
        impListener();
      }, config.impInterval);
    } // 添加监听


    _.addListener('load', function () {
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

    _.customHistory('replaceState'); // 注册单页面监听方法


    _.addListener('beeHistoryChange', bee.onRouteChange.bind(bee), false);

    _.addListener('hashchange', bee.onRouteChange.bind(bee), false);
  }

  var Bee = function Bee(pid, userConfig) {
    // 初始化配置
    if (_.isDef(pid) && _.isString(pid)) {
      config.pid = pid;
    }

    if (_.isDef(userConfig) && _.isObject(userConfig)) {
      setConfig(userConfig);
    } // 初始化数据


    this.beeData = new BeeData(); // initData

    config.domain = _.getTopDomain(window.document.domain); // 判断是否为首次访问

    this.isFirstVisit();
    this.isNewSession();

    if (config.autoPage) {
      this.sendPage();
    } // 初始化点击监听


    initElementListener(this); // 初始化曝光事件
    // if (config.imp && _.isM()) {

    if (config.imp) {
      initImp(this);
    } // 初始化单页应用路由监听


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
    var el = e.target;

    var targetData = _.getAttribute(el, config.clickTag, true);

    if (!targetData && config.clickList.indexOf(el.tagName.toLocaleLowerCase()) === -1) return false;
    if (_.isVoid(targetData) && !config.allClick) return false;

    var elInfo = _.getElementInfo(el);

    return this.sendClick(elInfo, targetData);
  };
  /**
   * 发送Page事件
   */


  Bee.prototype.sendPage = function () {
    var data = this.beeData.makePageData();
    this.send(data);
  };
  /**
   * 发送点击事件
   */


  Bee.prototype.sendClick = function (el, param) {
    var data = this.beeData.makeClickData(el, param);
    this.sendBean(data);
  };
  /**
   * 发送曝光事件
   */


  Bee.prototype.sendImp = function () {
    var impList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    if (impList.length === 0) return;
    var data = this.beeData.makeImpData(impList);
    this.sendBean(data);
  };
  /**
   * 发送自定义事件
   * @param type 事件类型
   * @param param 事件数据
   */


  Bee.prototype.sendCustom = function (type) {
    var param = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (_.isVoid(type) || !_.isString(type) || ['page', 'imp', 'clck'].indexOf(type) > -1) {
      console.error('自定义事件异常！');
      return false;
    }

    var data = this.beeData.makeCustomData(type, param);
    this.sendBean(data);
    return true;
  };
  /**
   * 单页应用路由变化处理
   */


  Bee.prototype.onRouteChange = function (e) {
    // 前一个 url
    var newURL;
    var oldURL;

    if (e instanceof win$2.HashChangeEvent) {
      newURL = e.newURL;
      oldURL = e.oldURL;
    } else {
      newURL = e.detail && e.detail.newURL;
      oldURL = e.detail && e.detail.oldURL;
    }

    this.beeData.updateRoute(newURL, oldURL);
    this.sendPage();
  };
  /**
   * 用于外部调用的方法
   */


  Bee.prototype.command = function (active, data) {
    var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /**
     * 命令Map
     * 用来映射命令与方法
     */
    var commandMap = {
      page: 'sendPage',
      click: 'sendClick',
      event: 'sendCustom',
      imp: 'sendImp',
      config: 'setConfig'
    };
    var res = false;

    switch (active) {
      case 'page':
        {
          var url = doc$2.URL;

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

      case 'imp':
        {
          if (config.imp && this.beeImp instanceof BeeImp) {
            if (_.isVoid(data)) {
              this.beeImp.start();
            } else {
              var list = _.isArray(data) ? data : [data];
              this.sendImp(list);
            }
          }

          break;
        }

      default:
        {
          if (_.hasOwn(commandMap, active)) {
            res = this[commandMap[active]](data, option);
          }

          break;
        }
    }

    return res;
  };

  function init() {
    if (window.bee.done) return;
    var _bee = null;
    var q = window.bee && window.bee.q ? window.bee.q.slice() : [];
    /**
     * 命令函数
     */

    window.bee = function (active, data, option) {
      var res = false;

      if (_bee instanceof Bee) {
        try {
          res = _bee.command(active, data, option);
        } catch (e) {
          console.error('调用异常！');
        }
      } else if (active === 'init') {
        _bee = new Bee(data, option);
        res = true;
      } else {
        console.error('请初始化！');
      }

      return res;
    }; // bee引入完成


    window.bee.done = true;

    window.bee.toString = function () {
      return 'Bee: bee() { [native code] }';
    };
    /**
     * 处理队列
     */


    while (q.length > 0) {
      var _window;

      var a = q.shift();

      (_window = window).bee.apply(_window, _toConsumableArray(a));
    }
  }

  init();

}());
