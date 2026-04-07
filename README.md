# My Toolbox Userscript Template

这是一个自用油猴脚本模板，思路是：

- 一个总脚本 `my-toolbox.user.js`
- 每个网站一个模块
- 每个模块都实现 `match()` 和 `run()`
- 默认使用白名单模式，只对 `@match` 里列出的网站注入

## 当前已包含

- `tempmail.plus`：隐藏左右广告位
- `2925.com`：隐藏 `#/mailList` 左下角广告浮层
- `example.com`：空白模板模块

## 使用方法

1. 打开 Tampermonkey
2. 新建脚本
3. 粘贴 `my-toolbox.user.js` 的内容
4. 保存并刷新目标网站

## 推荐开发方式

开发模式下，安装一次加载器脚本，真正逻辑从本地服务动态加载。

1. 运行 `.\start-toolbox-server.ps1`
2. 浏览器打开 `http://127.0.0.1:8123/my-toolbox.loader.user.js`
3. 用 Tampermonkey 安装这个加载器
4. 以后只改本地的 `toolbox-runtime.js`
5. 保存文件后，已打开的页面会自动刷新并加载最新代码

开发模式文件：

- `my-toolbox.loader.user.js`
- `toolbox-runtime.js`
- `dev-server.js`

当前开发加载器只对白名单网站生效：

- `https://tempmail.plus/*`
- `https://2925.com/*`

## 生产模式

如果你以后想脱离本地服务单独使用，还是可以安装：

- `my-toolbox.user.js`

这是完整独立版，不依赖本地服务器，但开发时没有自动刷新。

当前独立版也只对白名单网站生效：

- `https://tempmail.plus/*`
- `https://2925.com/*`

## 后续新增网站

在 `modules` 数组里复制一个对象，改这三部分：

- `name`
- `match()`
- `run()`

如果要让脚本对新网站注入，除了新增模块，还要在脚本头部新增对应的 `@match`。

你现在可以直接复制 [toolbox-runtime.js](E:\projects\monkey\toolbox-runtime.js) 里的 `github.com-template` 或 `example.com-template` 模块。

示例：

```javascript
{
  name: 'github.com-demo',
  match() {
    return location.hostname === 'github.com';
  },
  run() {
    console.log('your github logic here');
  },
}
```

例如要新增 GitHub：

```javascript
// @match        https://github.com/*
```

## 常用模式

隐藏元素：

```javascript
Utils.hideSelectors(['.ad', '#banner']);
```

注入样式：

```javascript
Utils.addStyle(
  'my-style-id',
  `.sidebar { display: none !important; }`
);
```

监听动态加载：

```javascript
Utils.observeAddedNodes((node) => {
  console.log('new node', node);
});
```
