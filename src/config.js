/**
 * 配置项
 */
export default {
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
    page: 'page', // 页面
    click: 'clck', // 点击
    imp: 'imp', // 曝光
    cstm: 'cstm', // 自定义
    data: 'data', // 自定义数据
  },
};