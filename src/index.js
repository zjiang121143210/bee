import Bee from './bee-core';
import {
  console,
  _,
} from './utils';

function init() {
  if (window.bee.done) return;

  let _bee = null;
  const q = window.bee && window.bee.q ? window.bee.q.slice() : [];

  /**
   * 命令函数
   */
  window.bee = function (active, data, option) {
    let res = false;
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
  };
  // bee引入完成
  window.bee.done = true;
  window.bee.toString = () => 'Bee: bee() { [native code] }';

  /**
   * 处理队列
   */
  while (q.length > 0) {
    const a = q.shift();
    window.bee(...a);
  }
}

init();