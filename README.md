# Bee web数据采集（施工中）

## 写在前面

**任何采集系统的上报方式、数据结构等，都要结合后续的数据模型、计算能力等来进行设计。**

[DEMO](http://test.clew.fun) （打开F12食用）

[bee.js](http://clew.fun/bee.js)

结合chrome 扩展使用更加： [Bee-devtools](https://github.com/zjiang121143210/bee-devtools)

**施工中，代码和文档都不是很完善，见谅。**

## 基本概念

- src      web sdk 代码
- server   服务端相关代码(OpenResty)
- examples 例子

建议参考以下文档了解基础概念：

[Google Analytics](https://developers.google.com/analytics/devguides/collection/analyticsjs)
[GIO JS Book](https://sishen.gitbooks.io/gio-js-book/dom.html)

大概说明一下：

### 上报事件类型

- 页面事件： `page` 也就是 PV， 页面打开时触发，上报本次页面浏览相关的信息。
- 点击事件： `click`，当用户点击被标记元素(坑位)时触发，上报本次点击的相关信息。
- 曝光事件： `imp`，用来上报被标记元素(坑位)以被展示（曝光），具体触发方式相对复杂。
- 自定义事件： `event`，用户主动触发，用来上报用户自定义的事件。

### 会话、访次相关

Bee 中，每一次用户进入已经埋点的系统（统一域下的所有网页）为一次会话，会生成唯一的会话id（sid）来标记。
同时，如果30分钟内用户没有进行任何有效交互（触发上报的动作），将视为本次会话结束，后续的操作将视为下一次会话。
也就是说，在任意连续的30分钟内，用户没有触发上报，则视为本次会话结束。

## 快速入门

在页面引入：

```html
<script>
  !(function (e, t, n, g, i) {e[i] = e[i] || function () {(e[i].q = e[i].q || []).push(arguments);}, n = t.createElement('script'), tag = t.getElementsByTagName('script')[0], n.async = 1, n.src = (document.location.protocol == 'https:' ? 'https://' : 'http://') + g, tag.parentNode.insertBefore(n, tag);}(window, document, 'script', 't.jd.com/bee.js', 'bee'));
  bee('init', 'you-projectId', {
    cid: 'id',
    req: 'clew.fun/log',
  });
</script>
```

- 将 `you-projectId` 替换成你项目的id（自己起一个避免重复）
- 将`cid: 'id'` 替换成存储你业务id的cookie的name（作用是打通业务与流量数据）
- 将 `req: 'clew.fun/log'` 替换成你接送数据的地址（注意，跨域要开启CORS）

## 使用方式

本项目主体为采集SDK，server 文件夹中为对应的接收请求并落日志的服务端相关文件。

整体流程：

SDK(采集数据) -> OpenResty(nginx+lua,接收数据并落日志) -> 清洗 -> 计算(实时/离线) -> 可视化

相关库：

- [Bee-devtools](https://github.com/zjiang121143210/bee-devtools)： chorme扩展，配合验证上报数据

## 配置

```js
// 在初始化时可以通过如下方式修改配置
bee('init', 'you-projectId', {
    cid: 'id',
    req: 'clew.fun/log',
  });

// 初始化后也可以通过如下方式修改或获取配置
bee('config', 'req', 'clew.fun/log');
bee('config', {cid: 'id', req: 'clew.fun/log'});
```

完整的配置列表可以参考 `src/config.js`。

## 命令API

通过`bee(command, param, option)`的方式可以执行一些命令，来修改配置或上报数据

```js
/**
 * init
 * 初始化
 * 必须执行，且必须最先自行
 * you-projectId 替换成你自己项目的id，用来区分是哪个项目
 * {} 用来修改配置，详细配置参考上面一节
*/
bee('init', 'you-projectId', {});

/**
 * config
 * 用来修改和获取配置
 * 详细配置参考上面一节
*/
bee('config') // 返回目前的全部配置
bee('config', 'req') // 返回对应可以配置
bee('config', 'req', 'clew.fun/log') // 设置对应的配置 rep: clew.fun/log
bee('config', {cid: 'id', req: 'clew.fun/log'}) // 根据json更新配置

/**
 * event
 * 触发一次自定义上报
 * type 事件类型 string
 * param 事件数据 any
 * type 不允许出现内部事件类型： page， click， imp，event
*/
bee('event', type: string, param: any);
bee('event', 'login', {name: 'clew'});

/**
 * page
 * 触发一次page事件上报
*/
bee('page'); // 触发一次 page事件上报， 会自动获取 url
bee('page', 'clew.fun/test'); // 触发一次 page事件上报， url为 clew.fun/test

/**
 * click
 * 触发一次点击事件上报
 * 传入 string 是会自动填入为坑位信息
 * 传入 HTMLElement 是会自动计算节点信息并上报
*/
bee('click', 'btn1'); // 触发一次 page事件上报， 坑位信息为 btn1
bee('click', btn: HTMLElement); // 触发一次 page事件上报， 点击节点为btn

/**
 * imp
 * 触发一次曝光事件上报
*/
bee('imp'); // 触发一次 曝光 抓取，系统会进行重新计算当期需要曝光的坑位（标签），并曝光
/**
 * 触发一次曝光事件上报
 * 如果传入 HTMLElement 数组， 会上报存入标签的信息，并上报
 * 适合本身可以获取到 需要曝光的节点，但系统无法自动抓取的情况
*/
bee('imp', [HTMLElement]);
/**
 * 触发一次曝光事件上报
 * 如果传入 string 数组， 会将数据传入曝光标志位，并曝光
 * 适合本身可以获取到需要曝光的节点的坑位信息且不关心节点其他信息(xpath等等)，但系统无法自动抓取的情况
*/
bee('imp', ['btn2']);
```

## 上报字段解析

详见 `docs/报文解析及实例.md`

报文分为两个：

- 公共字段： 每种类型的报文都存在
- 特有字段： 根据类型有区别，用来记录独有的数据

**公共字段：**

```js
{
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
  /**
   * 页面时间
   * 存在于除page事件以外的事件
   * bee自动获取，等于 当前事件发生页的 tm，用来关联 page 事件和其他事件
   */
  ptm: '1580717161514',
}
```

**页面浏览事件（page）特有字段：**

```js
{
  /**
   * 页面标题
   * bee自动获取
   */
  tl: 'Bee埋点测试',
}
```

**点击事件（click）特有字段：**

```js
{
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
}
```

**坑位曝光事件（imp）特有字段：**

```js
{
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
}
```

**坑位曝光事件（imp）特有字段：**

```js
{
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
}
```

