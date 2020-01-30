/**
 * bee 核心功能
 */

import {
  _,
} from './utils';
import config from './config';
import BeeData from './bee-data';
// import send from './bee-request';
import initSend from './bee-send';
// import initRequest from './bee-request';

const Bee = function () {
  // 初始化配置

  // 初始化数据
  this.beeData = new BeeData();

  // this.send = send;
  // initData
  config.domain = _.getTopDomain(window.document.domain);

  // 判断是否为首次访问
  this.isFirstVisit();
  this.isNewSession();

  if (config.autoPage) {
    this.sendPage();
  }
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
  const data = this.beeData.makePageData();
  this.send(data);
};

export default Bee;