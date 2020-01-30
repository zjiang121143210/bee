import Bee from './bee-core';
import {
  console,
} from './utils';

function init() {
  if (window.bee.done) return;

  let isInit = false;
  let _bee = null;
  const q = window.bee && window.bee.q ? window.bee.q.slice() : [];
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
    const a = q.shift();
    window.bee(...a);
  }
}

init();