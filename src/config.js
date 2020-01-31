/**
 * 配置项
 */
export default {
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
    page: 'page', // 页面
    click: 'click', // 点击
    imp: 'imp', // 曝光
    cstm: 'event', // 自定义
  },
};