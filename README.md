# FusionToolBox Userscript Template

这是一个自用油猴脚本模板，思路是：

- 一个总脚本 `FusionToolBox.user.js`
- 每个网站一个模块
- 每个站点模块单独放在 `sites/*.js`
- 每个模块都实现 `match()` 和 `run()`
- 默认使用白名单模式，只对 `@match` 里列出的网站注入

## 当前已包含

- `tempmail.plus`：隐藏左右广告位
- `2925.com`：隐藏站内广告容器，包括阅读页浮层广告和首页广告卡片
- `ip.sb`：隐藏 Riven Cloud 推广块和常见广告节点
- `linux.do`：隐藏顶部社区标语横幅和所有用户头像
- `finance.sina.com.cn`：隐藏新浪财经文章页广告、浮层和广告脚本节点
- `v2ex.com`：隐藏右侧栏推广广告
- `www.nodeseek.com`：隐藏页面网格背景、首页帖子及个人头像，并移除“欢迎新用户”模块
- `www.tampermonkey.net/scripts.php`：隐藏用户脚本页面的左右栏、内容区和自动广告
- `mail.chatgpt.org.uk`：隐藏 GPTMail 页面广告和推广位
- `chatgpt.com`：隐藏工作区成员达到使用上限的顶部横幅
- `example.com`：空白模板模块

## 使用方法

1. 打开 Tampermonkey
2. 新建脚本
3. 粘贴 `FusionToolBox.user.js` 的内容
4. 保存并刷新目标网站

## 推荐开发方式

开发模式下，安装一次加载器脚本，真正逻辑从本地服务动态加载。

1. Windows / macOS / Linux 都直接运行 `python ./start-FusionToolBox-server.py`
2. 浏览器打开 `http://127.0.0.1:8123/FusionToolBox.loader.user.js`
3. 用 Tampermonkey 安装这个加载器
4. 以后只改本地的 `sites/*.js` 或 `src/*.js`
5. 保存文件后，已打开的页面会自动刷新并加载最新代码

开发模式文件：

- `FusionToolBox.loader.user.js`
- `src/runtime-prefix.js`
- `src/runtime-suffix.js`
- `sites/*.js`
- `dev-server.js`

开发服务器会在请求 `FusionToolBox.runtime.js` 时，实时把 `src/` 和 `sites/` 里的源文件拼成一个运行时脚本，所以开发时不需要手工先构建。

当前开发加载器只对白名单网站生效：

- `https://tempmail.plus/*`
- `https://2925.com/*`
- `https://www.meiguodizhi.com/*`
- `https://greasyfork.org/*`
- `https://ip.sb/*`
- `https://www.ip.sb/*`
- `https://linux.do/*`
- `https://finance.sina.com.cn/*`
- `https://v2ex.com/*`
- `https://www.nodeseek.com/*`
- `https://www.tampermonkey.net/scripts.php*`
- `https://mail.chatgpt.org.uk/*`
- `https://chatgpt.com/*`

## 发布工作流

推荐工作流：

1. 开发时运行本地服务，使用 `FusionToolBox.loader.user.js`
2. 调试完成后执行打包脚本生成发布版 `FusionToolBox.user.js`
3. 把生成后的 `FusionToolBox.user.js` 发布到 Greasy Fork

### 构建发布版

前提：

- 本机已安装 Python
- 开发模式仍然需要 Node.js 来跑本地 dev server

在项目根目录执行：

```powershell
py .\build.py
```

这个脚本会：

- 读取 `userscript-header.txt`
- 读取 `src/runtime-prefix.js`
- 读取 `src/runtime-suffix.js`
- 读取 `sites/*.js`
- 生成 `FusionToolBox.runtime.js`
- 交互式显示当前版本，并询问是否要自动把补丁版本加 `1`
- 自动生成发布文件 `FusionToolBox.user.js`
- 自动把发布版本号同步到 `FUSION_TOOLBOX_VERSION`
- 输出构建结果和下一步发布提示

以后不要手工维护 `FusionToolBox.runtime.js` 和 `FusionToolBox.user.js` 的脚本逻辑，逻辑统一写在 `sites/*.js` 和 `src/*.js`。

常用用法：

```powershell
py .\build.py
py .\build.py --check
py .\build.py --version 0.1.2
py .\build.py --output .\dist\FusionToolBox.user.js
```

直接运行 `py .\build.py` 时，会进入交互模式：

- 先显示当前版本
- 询问是否自动加版本号
- 如果确认，会默认执行 `patch + 1`
- 然后自动继续构建

### 发布到 Greasy Fork

1. 确认 `userscript-header.txt` 里的 `@version` 已递增
2. 运行 `py .\build.py`
3. 打开 <https://greasyfork.org/zh-CN/script_versions/new>
4. 粘贴 `FusionToolBox.user.js` 内容并提交

这个页面就是 Greasy Fork 当前的“发布新脚本”入口；如果未登录，会先跳转到登录页。

后续每次发新版本也按这个流程走。

版本号以 `userscript-header.txt` 为准，构建时会自动同步到发布文件里的 `FUSION_TOOLBOX_VERSION`。

## 生产模式

如果你以后想脱离本地服务单独使用，安装：

- `FusionToolBox.user.js`

这是完整独立版，不依赖本地服务器，但开发时没有自动刷新。

当前独立版也只对白名单网站生效：

- `https://tempmail.plus/*`
- `https://2925.com/*`
- `https://www.meiguodizhi.com/*`
- `https://greasyfork.org/*`
- `https://ip.sb/*`
- `https://www.ip.sb/*`
- `https://linux.do/*`
- `https://finance.sina.com.cn/*`
- `https://v2ex.com/*`
- `https://www.nodeseek.com/*`
- `https://www.tampermonkey.net/scripts.php*`
- `https://mail.chatgpt.org.uk/*`
- `https://chatgpt.com/*`

## 后续新增网站

在 `modules` 数组里复制一个对象，改这三部分：

- `name`
- `match()`
- `run()`

如果要让脚本对新网站注入，除了新增模块，还要在脚本头部新增对应的 `@match`。

你现在可以直接复制 `sites/_template.github.js` 或 `sites/_template.example.js`，另存为新的站点文件。

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
