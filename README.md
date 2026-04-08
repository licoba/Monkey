# FusionToolBox Userscript Template

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

## 发布工作流

推荐工作流：

1. 开发时运行本地服务，使用 `my-toolbox.loader.user.js`
2. 调试完成后执行构建命令生成发布版 `my-toolbox.user.js`
3. 把生成后的 `my-toolbox.user.js` 发布到 Greasy Fork

### 构建发布版

前提：本机已安装 Node.js。

在项目根目录执行：

```powershell
npm run build
```

这个命令会：

- 读取 `userscript-header.txt`
- 读取 `toolbox-runtime.js`
- 自动生成发布文件 `my-toolbox.user.js`

以后不要手工维护 `my-toolbox.user.js` 的脚本逻辑，逻辑统一写在 `toolbox-runtime.js`。

### 发布到 Greasy Fork

1. 确认 `userscript-header.txt` 里的 `@version` 已递增
2. 运行 `npm run build`
3. 打开 <https://greasyfork.org/zh-CN/scripts/new>
4. 粘贴 `my-toolbox.user.js` 内容并提交

后续每次发新版本也按这个流程走。

版本号以 `userscript-header.txt` 为准，构建时会自动同步到发布文件里的 `TOOLBOX_VERSION`。

## 生产模式

如果你以后想脱离本地服务单独使用，安装：

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
