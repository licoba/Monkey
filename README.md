# FusionToolBox

这是一个按网站拆分功能模块的自用 Tampermonkey 脚本：

- 一个总脚本 `FusionToolBox.user.js`
- 每个网站一个模块
- 每个站点模块单独放在 `sites/*.js`
- 每个模块都实现 `match()` 和 `run()`
- 默认使用白名单模式，只对 `@match` 里列出的网站注入

## 当前已包含

- `tempmail.plus`：隐藏左右广告位
- `2925.com`：隐藏站内广告容器，包括阅读页浮层广告和首页广告卡片
- `ip.sb`：隐藏 Riven Cloud 推广块和常见广告节点
- `linux.do`：将站点 Logo 替换为纯文字、隐藏社区标语和用户头像，并过滤标题包含“鹈鹕”或“女装”的帖子
- `finance.sina.com.cn`：隐藏新浪财经文章页广告、浮层和广告脚本节点
- `v2ex.com`：移除所有用户头像，并隐藏右侧栏推广广告
- `www.nodeseek.com`：隐藏页面网格背景、首页帖子及个人头像，并移除“欢迎新用户”模块
- `www.tampermonkey.net/scripts.php`：隐藏用户脚本页面的左右栏、内容区和自动广告
- `mail.chatgpt.org.uk`：隐藏 GPTMail 页面广告和推广位
- `wx.mail.qq.com`：为新版 QQ 邮箱提供完整暗色主题
- `chatgpt.com`：隐藏工作区成员达到使用上限的顶部横幅

## 安装与更新（推荐）

1. 从 [Greasy Fork 主脚本页面](https://greasyfork.org/zh-CN/scripts/580054-fusiontoolbox) 安装 `FusionToolBox`
2. Tampermonkey 中只启用正式版 `FusionToolBox`
3. 后续版本通过 Tampermonkey 自动检查更新，或在脚本菜单中手工检查更新

正式版是完整的单文件脚本，不依赖本地服务。日常使用不需要安装
`FusionToolBox Loader`，也不需要运行 `start-FusionToolBox-server.py`。

每次功能修改完成后，先递增版本并构建新的 `FusionToolBox.user.js`，再临时启动
本地服务，通过 `http://127.0.0.1:8123/FusionToolBox.user.js` 交给 Tampermonkey
安装。安装的是独立脚本，完成后即可关闭本地服务。

## 本地开发（可选）

需要频繁修改和调试时，可以临时使用 Loader，让浏览器从本地服务动态加载最新源码。

1. macOS / Linux 运行 `python3 ./start-FusionToolBox-server.py`；Windows 运行 `py .\start-FusionToolBox-server.py`
2. 浏览器打开 `http://127.0.0.1:8123/FusionToolBox.loader.user.js`
3. 用 Tampermonkey 安装这个加载器
4. 暂时禁用正式版 `FusionToolBox`，避免同一功能重复执行
5. 只修改本地的 `sites/*.js` 或 `src/*.js`
6. 保存文件后，已打开的页面会自动刷新并加载最新代码
7. 调试完成后停用或删除 Loader，重新启用正式版

开发模式文件：

- `FusionToolBox.loader.user.js`
- `src/runtime-prefix.js`
- `src/runtime-suffix.js`
- `sites/*.js`
- `dev-server.js`

开发服务器会在请求 `FusionToolBox.runtime.js` 时，实时把 `src/` 和 `sites/` 里的源文件拼成一个运行时脚本，所以开发时不需要手工先构建。

Loader 和正式版都只对白名单网站生效，实际范围以各自脚本头部的 `@match` 为准。

## 发布工作流

正式发布工作流：

1. 按需运行本地服务并使用 `FusionToolBox.loader.user.js` 调试
2. 运行 `npm test`
3. 递增版本号并执行构建，生成 `FusionToolBox.runtime.js` 和 `FusionToolBox.user.js`
4. 检查 Git author、committer 及待推送历史
5. 提交并推送 GitHub
6. 把生成后的 `FusionToolBox.user.js` 发布到 Greasy Fork
7. 在线核对版本号和脚本内容，再通过 Tampermonkey 验证更新

### 构建发布版

前提：

- 本机已安装 Python
- 开发模式仍然需要 Node.js 来跑本地 dev server

在项目根目录执行（Windows）：

```powershell
py .\build.py
```

macOS / Linux 使用：

```bash
python3 ./build.py
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
py .\build.py --version 0.1.38
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

## 正式版

`FusionToolBox.user.js` 是 Greasy Fork 分发的完整独立版，不依赖本地服务器。
该文件由构建脚本生成，不应手工修改。

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
