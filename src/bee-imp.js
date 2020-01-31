import {
  _,
} from './utils';
import config from './config';

const bodyElm = document.body || null;
const docElm = document.documentElement || null;
/**
 * 坑位（标签）曝光处理逻辑类
 */
export default class BeeImp {
  constructor(bee) {
    // 曝光元素列表
    this.impNodeList = [];
    // 可见区域高度
    this.clientHeight = 0;
    // 滚动条据顶端高度
    this.docScrollTop = 0;
    this.docScrollHeight = 0;
    // Bee实例
    this.bee = bee;
  }

  /**
   * 启动曝光收集
   */
  start() {
    this.getTargetList(bodyElm);
    this.scrollFunc();
  }

  /**
   * 发送曝光数据
   */
  sendImp(impList) {
    this.bee.sendImp(impList);
  }

  /**
   * 获取被曝光标签
   */
  scrollFunc() {
    const _this = this;
    const visibleTop = window.scrollY;
    _this.getClientHeight();
    _this.getScrollTop();
    _this.getScrollHeight();
    if (_this.docScrollTop === visibleTop && _this.impNodeList.length > 0) {
      const impList = [];
      for (let i = 0, len = _this.impNodeList.length; i < len; i += 1) {
        const obj = _this.impNodeList[i];
        if (parseInt(obj.node.offsetHeight, 10) < docElm.clientHeight) {
          const screenAvailWidth = window.screen.availWidth;
          // 元素上边距离页面上边的距离
          const rectTopVal = obj.node.getBoundingClientRect().top;
          // 元素右边距离页面左边的距离
          const rectRightVal = obj.node.getBoundingClientRect().right;
          // 元素下边距离页面上边的距离
          const rectBottomVal = obj.node.getBoundingClientRect().bottom;
          // 元素左边距离页面左边的距离
          const rectLeftVal = obj.node.getBoundingClientRect().left;
          // let objOffsetWidth = obj.node.offsetWidth
          if (rectTopVal <= _this.clientHeight && rectTopVal > 0 && (rectRightVal > 0 && rectRightVal <= screenAvailWidth)) {
            // 屏幕内的元素(包含元素上边露出一点&去除轮播图未出现部分)
            if (obj.node.attributes[config.impTag] && !obj.flag) {
              obj.flag = true;
              impList.push(obj.node);
            }
          } else if (-rectTopVal < obj.node.offsetHeight && rectTopVal < 0 && (rectRightVal > 0 && rectRightVal <= screenAvailWidth)) {
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
  getTargetList(node) {
    if (_.isDef(node.hasChildNodes)) {
      const subNodes = node.childNodes;
      for (let i = 0, len = subNodes.length; i < len; i += 1) {
        const subNode = subNodes.item(i);
        if (_.isDef(subNode.offsetTop) && _.isDef(subNode.offsetHeight)) {
          if (subNode.attributes[config.impTag] && subNode.style.display !== 'none') {
            const beeImpVal = subNode.attributes[config.impTag].nodeValue;
            if (!this.isContains(beeImpVal) && beeImpVal) {
              this.impNodeList.push({
                node: subNode,
                beeImp: beeImpVal,
                flag: false,
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
  isContains(tagKey) {
    let i = this.impNodeList.length;
    while (i > 0) {
      if (this.impNodeList[i - 1].beeImp === tagKey) return true;
      i -= 1;
    }
    return false;
  }

  /**
   * 获取屏幕宽度
   */
  getClientWidth() {
    let clientWidth = 0;
    const bodyCW = bodyElm.clientWidth;
    const docCW = docElm.clientWidth;
    if (bodyCW && docCW) {
      clientWidth = (bodyCW < docCW) ? bodyCW : docCW;
    } else {
      clientWidth = (bodyCW > docCW) ? bodyCW : docCW;
    }
    this.getClientWidth = clientWidth;
  }

  /**
   * 获取屏幕高度
   */
  getClientHeight() {
    let clientHeight = 0;
    const bodyCH = bodyElm.clientHeight;
    const docCH = docElm.clientHeight;
    if (bodyCH && docCH) {
      clientHeight = (bodyCH < docCH) ? bodyCH : docCH;
    } else {
      clientHeight = (bodyCH > docCH) ? bodyCH : docCH;
    }
    this.clientHeight = clientHeight;
  }

  /**
   * 滚动条据顶端高度
   */
  getScrollTop() {
    let scrollTop = 0;
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
  getScrollHeight() {
    this.docScrollHeight = Math.max(bodyElm.scrollHeight, docElm.scrollHeight);
  }
}