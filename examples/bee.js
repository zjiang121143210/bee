(function () {
  'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
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

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
      return;
    }

    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
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
     * id随机数位数
     * 默认 20
     */
    uidRandomNum: 20,

    /**
     * 业务id
     * 记录用户在当前业务（系统）中的id
     * 由用户提供，用来将流量数据与业务数据打通。
     * 为空则不采集
     */
    cid: '',
    debug: true,
    // 埋点域名
    domain: null,
    // 是否开启曝光采集
    imp: false,
    // 是否自动上报页面事件
    autoPage: false,
    req: 'jdqd.jd.com/poststring',
    test_req: 'daqlog.jd.com/httppost',
    // 会话过期时间，默认 30 分钟
    session_time: 1800000,
    // 用户唯一标识过期时间，默认 3 年
    user_time: 94608000000,
    // 事件枚举
    event: {
      visit: 'vst',
      page: 'page',
      // 页面
      click: 'clck',
      // 点击
      imp: 'imp',
      // 曝光
      cstm: 'cstm',
      // 自定义
      data: 'data' // 自定义数据

    }
  };

  var nativeIsArray = Array.isArray;
  var toString = Object.prototype.toString;
  var windowConsole = window.console;
  var windowNavigator = window.navigator;
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


  _.joinJson = function (target) {
    if (_.isUndefined(target)) return {};

    for (var _len = arguments.length, arg = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      arg[_key - 1] = arguments[_key];
    }

    return Object.assign.apply(Object, [target].concat(arg));
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

  _.validUid = function (id) {
    if (_.isVoid(id)) return false;
    var arr = id.split('-');
    if (arr.length !== 2 || arr[1].length !== config.uidRandomNum) return false;
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
      var android = /(android)/.exec(windowNavigator.userAgent.toLowerCase());
      os = _.isNull(android) ? platform[0] : 'android';
    } else {
      var _platform = _slicedToArray(platform, 1);

      os = _platform[0];
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
    var ua = navigator.userAgent.toLowerCase();
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

  var console = {
    log: function log() {
      if (!_.isUndefined(windowConsole) && windowConsole) {
        windowConsole.log.apply(windowConsole, arguments);
      }
    },
    error: function error() {
      if (!_.isUndefined(windowConsole) && windowConsole) {
        for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          arg[_key2] = arguments[_key2];
        }

        var args = ['Bee error:'].concat(arg);
        windowConsole.error.apply(windowConsole, _toConsumableArray(args));
      }
    }
  };

  var win = window;
  var winScreen = win.screen;
  var doc = win.document;
  var winNavigator = win.navigator;

  function getBrowserData() {
    var browserData = {};
    browserData.bw = win.innerHeight || '-';
    browserData.bh = win.innerWidth || '-';
    browserData.sr = winScreen ? "".concat(winScreen.width, "x").concat(winScreen.height) : '-';
    browserData.bl = winNavigator && winNavigator.language ? winNavigator.language : '-';
    browserData.so = _.getPlatform();

    var ua = _.analysisUA();

    browserData.bt = ua.name;
    browserData.bv = ua.version;
    return browserData;
  }

  var BeeData = function BeeData() {
    // 页面打开时间
    this.ptm = new Date().getTime();
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
    this.url = doc.URL;
    this.domain = doc.domain;
    this.re = document.referrer;
    this.ua = navigator && navigator.userAgent ? navigator.userAgent : '-';
  };
  /**
   * todo
   */


  BeeData.prototype._makeCommonData = function (type) {
    if (_.isVoid(_.getCookie('sid'))) {
      this.setSessionData();
    }

    var data = {
      b: _.getCookie('uid'),
      s: _.getCookie('sid'),
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
      ts: _.getCookie('ts')
    }; // 页面事件和访问事件没有ptm

    if (type !== config.event.visit && type !== config.event.page) {
      data.ptm = this.ptm;
    } // 浏览器信息


    var content = this.browser;

    var json = _.joinJson(data, content);

    return json;
  };

  BeeData.prototype.makePageData = function () {
    var data = {};
    data = this._makeCommonData(config.event.page);
    var content = {
      tl: doc.title
    };

    var json = _.joinJson(data, content);

    return json;
  };
  /**
   * 设置用户数据
   */


  BeeData.prototype.setUserData = function () {
    this.clearCookie();
    this.setUid();
    this.setFs();
  };

  BeeData.prototype.setUid = function () {
    return _.setCookie('uid', _.createId(config.uidRandomNum), config.user_time);
  };

  BeeData.prototype.setFs = function () {
    _.setCookie('fs', this.ptm, config.user_time);

    _.setCookie('ls', '-', config.user_time);
  };
  /**
   * 设置会话数据
   */


  BeeData.prototype.setSessionData = function () {
    this.setSt();
    this.setSq();
    this.setSid();
  }; // 设置会话时间


  BeeData.prototype.setSt = function () {
    var ls = _.getCookie('ts') || _.getCookie('fs') || 0;

    _.setCookie('ls', ls, config.user_time);

    _.setCookie('ts', this.ptm, config.user_time);
  };

  BeeData.prototype.setSq = function () {
    var sq = _.getCookie('sq');

    if (_.isNotVoid(sq)) {
      sq += 1;
    } else {
      sq = 1;
    }

    _.setCookie('sq', sq, config.user_time);

    return sq;
  };

  BeeData.prototype.setSq = function () {
    var sq = _.getCookie('sq');

    if (_.isNotVoid(sq)) {
      sq += 1;
    } else {
      sq = 1;
    }

    _.setCookie('sq', sq, config.user_time);

    return sq;
  };

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
      } // const xhr = new XMLHttpRequest();
      // 跨域允许发送 cookie
      // xhr.withCredentials = true;


      xhr.open('POST', protocol + config.req, async);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

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

  /**
   * bee 核心功能
   */

  var Bee = function Bee() {
    // 初始化配置
    // 初始化数据
    this.beeData = new BeeData(); // this.send = send;
    // initData

    config.domain = _.getTopDomain(window.document.domain); // 判断是否为首次访问

    this.isFirstVisit();
    this.isNewSession();
  };

  initSend(Bee);

  Bee.prototype.isFirstVisit = function () {
    if (!_.validUid(_.getCookie('uid'))) {
      this.beeData.setUserData();
    }
  };

  Bee.prototype.isNewSession = function () {
    if (_.isUndefined(_.getCookie('sid'))) {
      this.beeData.setSessionData();
    }
  };

  Bee.prototype._init = function () {
    // initData
    config.domain = document.domain;
  };

  Bee.prototype.sendPage = function () {
    var data = this.beeData.makePageData();
    this.send(data);
  };

  function init() {
    if (window.bee.done) return;
    var isInit = false;
    var _bee = null;
    var q = window.bee && window.bee.q ? window.bee.q.slice() : [];
    /**
     * 命令函数
     */

    window.bee = function (active, data, option) {
      if (!isInit) {
        if (active !== 'init') {
          console.error('【bee】：请初始化！');
        } else {
          _bee = new Bee(data, option);
          isInit = true;
        }

        return;
      }

      try {
        _bee[active](data, option);
      } catch (error) {
        console.error('【bee】：调用异常！');
      }
    };

    window.bee.done = true;
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
