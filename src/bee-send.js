/* eslint-disable no-param-reassign */
import config from './config';
import {
  _,
  console,
} from './utils';

const {
  sendBeacon,
} = window.navigator;
const protocol = window.document.location.protocol === 'https:' ? 'https://' : 'http://';

export default function initSend(Bee) {
  Bee.prototype.send = function (d, async = true) {
    let xhr = null;
    if (typeof XMLHttpRequest !== 'undefined') {
      xhr = new XMLHttpRequest();
    } else if (typeof ActiveXObject !== 'undefined') {
      // eslint-disable-next-line no-undef
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    // 跨域允许发送 cookie
    // xhr.withCredentials = true;
    xhr.open('POST', protocol + config.req, async);
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    xhr.setRequestHeader('Content-Type', 'text/plain');
    const data = _.checkRCFL(d);
    console.log('埋点上报数据：', '类型', data.t, '数据', data);
    xhr.send(JSON.stringify(data));
    this.beeData.updateCookieDate();
  };
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