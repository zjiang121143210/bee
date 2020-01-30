/**
 * 服务端交互模块
 * 用post请求主要是参照了GrowingIO，为了上报大量的数据，比如说曝光的xpath。
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

export default {
  send(d, async = true) {
    const xhr = new XMLHttpRequest();
    // 跨域允许发送 cookie
    xhr.withCredentials = true;
    xhr.open('POST', protocol + config.req, async);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    const data = _.checkRCFL(d);
    console.log('埋点上报数据：', '类型', data.t, '数据', data);
    xhr.send(JSON.stringify(data));
    this.beeData.updateCookieDate();
  },
  sendBean(d) {
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
  },
};

// // 用来处理数据上报
// const BeePost = function () {
//   this._init();
// }

// BeePost.prototype._init = function () {
//   this.url = protocol + config.req;
//   this.beacon = sendBeacon && sendBeacon instanceof Function ? true : false;
// }

// BeePost.prototype.send = function (data, type = 'xhr', async = true) {
//   if (type === 'beacon') {
//     this.sendBeacon(data);
//   } else {
//     this.sendXhr(data, async)
//   }
// }

// BeePost.prototype.sendXhr = function (data, async = true) {
//   const xhr = new XMLHttpRequest();
//   // 跨域允许发送 cookie
//   xhr.withCredentials = true;
//   xhr.open('POST', this.url, async);
//   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
//   logger({
//     content: ['埋点上报数据：', '类型', data.t, '数据', data]
//   });
//   d = utils.checkRCFL(data);
//   xhr.send(JSON.stringify(d));
//   BeeData.resetUD();
// }

// export default BeePost;