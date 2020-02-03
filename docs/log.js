const log = {
  /**
   * 用户唯一id
   * 采集系统自动生成，用来标识唯一用户（浏览器）
   * 有效期3年，每次上报向后延长有效期
   * 格式： 时间戳（36进制）-随机数（20位36进制）
   */
  u: 'JNOA2TWL-YPRUJ021J5H23932B7J5',
  /**
   * 会话id
   * 采集系统自动生成，用来标识用户的一次有效会话
   * 有效期30分钟，每次上报向后延长有效期
   * 格式： uid-当前访次
   */
  s: 'JNOA2TWL-YPRUJ021J5H23932B7J5-1',
  /**
   * 项目id
   * 用户传入，用来标识项目归属
   */
  p: 'test-projectId',
  /**
   * 业务id
   * 用户传入cookie中存储的位置，bee从中取值
   * 用来将流量数据与业务数据打通
   */
  c: 'clew',
  /**
   * 事件类型
   * bee根据当前上报类型自动赋值
   * page click imp event
   */
  t: 'page',
  /**
   * 客户端上报时间
   * bee自动计算
   */
  tm: '1540525689076',
  /**
   * sdk版本
   * bee自动计算
   */
  sdk: '0.0.1',
  /**
   * 当前域名
   * bee自动获取
   */
  d: 'clew.fun',
  /**
   * 浏览器语言
   * bee自动获取
   */
  l: 'zh-CN',
  /**
   * 浏览器类型
   * bee自动计算
   */
  bt: 'chrome',
  /**
   * 浏览器版本
   * bee自动计算
   */
  bv: '69.0.3497.100',
  /**
   * 操作系统
   * bee自动计算
   * win linux android ios
   */
  os: 'win',
  /**
   * 屏幕size
   * bee自动计算
   */
  sr: '1920x1080',
  /**
   * 窗口size
   * bee自动计算
   */
  bi: '938x508',
  /**
   * 首次访问时间
   * bee自动计算，并存入cookie
   */
  fs: '1540453228003',
  /**
   * 上次访问时间
   * bee自动计算，并存入cookie
   */
  ls: '1540464856115',
  /**
   * 本次访问时间
   * bee自动计算，并存入cookie
   */
  ts: '1540525689069',
  /**
   * 页面打开时间
   * bee自动计算
   */
  pt: '1540525689069',
  /**
   * 当前url
   * bee自动获取
   */
  url: 'clew.fun/index.html',
  /**
   * 来源url
   * bee自动获取
   */
  rf: 'clew.fun/index.html',
};

const page = {
  /**
   * 页面标题
   * bee自动获取
   */
  tl: 'Bee埋点测试',
};

const click = {
  /**
   * 坑位信息
   * 用户写入对应标签的 data-bee(可自由配置)中
   * 在触发了点击事件后 bee自动获取。
   * 用来标记当前坑位的信息，是一个非常重要的字段
   */
  br: 'btn1',
  /**
   * 标签内容
   * bee自动获取 ：el.innerText
   */
  ev: 'TestPage',
  /**
   * 标签xpath
   * bee自动获取
   */
  ex: '/div#app/div/button.el-button el-button--default/span',
  /**
   * 标签在同级标签中的index
   * bee自动获取
   */
  ei: 3,
  /**
   * 标签的资源信息
   * bee自动获取，href 或 src
   */
  eh: '',
};

const imp = {
  /**
   * 曝光坑位信息
   * 数组形式，一次上报多条坑位数据
   * 设计为数组主要是为了提高上报效率节省网络资源
   * 曝光事件存在 一次动作多个坑位触发的特点，合并上报更为合理。
   * 后期在数据清洗时可以整理成多条入库。
   */
  imp: [{
    /**
     * 标签内容
     * bee自动获取 ：el.innerText
     */
    ev: 'HomePage',
    /**
     * 标签xpath
     * bee自动获取
     */
    ex: '/div#app/div/button.el-button el-button--default is-disabled',
    /**
     * 标签在同级标签中的index
     * bee自动获取
     */
    ei: 1,
    /**
     * 标签的资源信息
     * bee自动获取，href 或 src
     */
    eh: '',
    /**
     * 坑位信息
     * 用户写入对应标签的 data-bee(可自由配置)中
     * 在触发了点击事件后 bee自动获取。
     * 用来标记当前坑位的信息，是一个非常重要的字段
     */
    br: 'home',
  }],
};

const event = {
  /**
   * 自定义事件类型
   * 用户传入，用于用户区分
   */
  et: 'login',
  /**
   * 自定义事件参数
   * 用户传入， 格式不限，统一转为string
   */
  ep: 'zhangsan',
};