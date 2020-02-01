# Bee web数据采集（施工中）

## 写在前面

**任何采集系统的上报方式、数据结构等，都要结合后续的数据模型、计算能力等来进行设计。**

[DEOM](http://test.clew.fun) （打开F12食用）

## 基本概念

- src      web sdk 代码
- server   服务端相关代码(OpenResty)
- examples 例子

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

- bee-devTool： chorme扩展，配合验证上报数据 (施工中)

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
