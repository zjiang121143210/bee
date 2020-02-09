/* eslint-disable no-param-reassign */
/**
 * bee 网络相关功能
 */
import config from './config';
import {
  _,
  console,
} from './utils';

const {
  sendBeacon,
} = window.navigator;
const protocol = window.document.location.protocol === 'https:' ? 'https://' : 'http://';

/**
 * 这里计划在浏览器支持的情况下全部改为 navigator。sendBeacon 上报，
 * 可能会通过函数柯理化实现
 */
export default function initSend(Bee) {
  /**
   * 普通上报事件
   */
  Bee.prototype.send = function (d, async = true) {
    let xhr = null;
    if (typeof XMLHttpRequest !== 'undefined') {
      xhr = new XMLHttpRequest();
    } else if (typeof ActiveXObject !== 'undefined') {
      // eslint-disable-next-line no-undef
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.open('POST', protocol + config.req, async);
    xhr.setRequestHeader('Content-Type', 'text/plain');
    const data = _.checkRCFL(d);
    console.log('埋点上报数据：', '类型', data.t, '数据', data);
    xhr.send(JSON.stringify(data));
    this.beeData.updateCookieDate();
  };
  /**
   * sendBeacon 上报
   */
  Bee.prototype.sendBean = function (d) {
    if (!_.isFunction(sendBeacon)) {
      return this.send(d, false);
    }
    const data = _.checkRCFL(d);
    const res = navigator.sendBeacon(protocol + config.req, JSON.stringify(data));
    if (res) {
      console.log('埋点上报数据(Beacon)：', '类型', data.t, '数据', data);
      this.beeData.updateCookieDate();
    } else {
      this.send(d, false);
    }
    return true;
  };
}