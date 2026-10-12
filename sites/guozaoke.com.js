{
  name: 'guozaoke-hide-ads',
  match() {
    return location.hostname === 'guozaoke.com' || location.hostname === 'www.guozaoke.com';
  },
  run() {
    Utils.addStyle(
      'fusion-toolbox-guozaoke-reading-theme',
      `html:root {
        color-scheme: dark;
        --ft-gzk-bg: #1b1c1e;
        --ft-gzk-panel: #242628;
        --ft-gzk-raised: #2d3034;
        --ft-gzk-line: rgba(220, 228, 240, .08);
        --ft-gzk-text: #d9dde3;
        --ft-gzk-muted: #a0a7b1;
        --ft-gzk-link: #a7c4e6;
        --ft-gzk-gap-sm: 8px;
        --ft-gzk-gap-md: 16px;
        --ft-gzk-gap-lg: 24px;
        background: var(--ft-gzk-bg) !important;
      }
      html body {
        background: var(--ft-gzk-bg) !important;
        color: var(--ft-gzk-text) !important;
      }
      html body > .container,
      html body .navbar > .container,
      html body .container-box .main {
        background: transparent !important;
      }
      html body .container-box {
        background: var(--ft-gzk-panel) !important;
        color: var(--ft-gzk-text) !important;
        border: 1px solid var(--ft-gzk-line) !important;
        border-radius: 10px !important;
        box-shadow: none !important;
      }
      html body .container-box .ui-header,
      html body .container-box .ui-content,
      html body .container-box .ui-footer,
      html body .hot-topics .box,
      html body .hot-topics .cell {
        background: transparent !important;
        border-color: var(--ft-gzk-line) !important;
      }
      html body .reply-item,
      html body .hot-topics .cell,
      html body .hot-topics .title,
      html body .nodes-cloud li,
      html body .nodes-cloud > .title,
      html body .container-box .ui-header > .title,
      html body .usercard .status,
      html body .topic-tags,
      html body .divider-vertical {
        border-color: var(--ft-gzk-line) !important;
      }
      html body .topic-detail > .ui-header {
        padding: var(--ft-gzk-gap-lg) var(--ft-gzk-gap-lg) var(--ft-gzk-gap-md) !important;
      }
      html body .topic-detail > .ui-header .title {
        font-size: 23px;
        font-weight: 600 !important;
        line-height: 1.45;
        color: #eef0f3 !important;
      }
      html body .topic-detail > .ui-content {
        padding: var(--ft-gzk-gap-md) var(--ft-gzk-gap-lg) var(--ft-gzk-gap-sm) !important;
        font-size: 15px !important;
        line-height: 1.8 !important;
        overflow-wrap: anywhere;
      }
      html body .topic-detail > .ui-footer {
        padding: 12px var(--ft-gzk-gap-lg) !important;
        line-height: 1.8 !important;
      }
      html body .topic-detail > .ui-content p { margin: 0 0 12px !important; }
      html body .topic-detail > .ui-content p:last-child { margin-bottom: 0 !important; }
      html body .topic-reply > .ui-header { padding: var(--ft-gzk-gap-md) var(--ft-gzk-gap-lg) !important; }
      html body .topic-reply > .ui-content { padding: 0 var(--ft-gzk-gap-lg) !important; }
      html body .topic-reply,
      html body .sidebar-right > .container-box + .container-box { margin-top: var(--ft-gzk-gap-md) !important; }
      html body .reply-item { padding: var(--ft-gzk-gap-md) 0 !important; }
      html body .reply-item:last-child { border-bottom: 0 !important; }
      html body .reply-item .content {
        color: var(--ft-gzk-text) !important;
        font-size: 14px !important;
        line-height: 1.75 !important;
        overflow-wrap: anywhere;
      }
      html body .reply-item .meta { margin-bottom: var(--ft-gzk-gap-sm) !important; }
      html body .reply-item .content p { margin: 0 0 var(--ft-gzk-gap-sm) !important; }
      html body .reply-item .content p:last-child { margin-bottom: 0 !important; }
      html body .container-box .meta { font-size: 12px !important; line-height: 1.6 !important; }
      html body .topic-detail .meta { margin-top: var(--ft-gzk-gap-sm) !important; }
      html body .reply-item .meta .reply-username {
        color: #c2cbd6 !important;
        font-weight: 500 !important;
      }
      html body .container-box .meta,
      html body .container-box .meta span,
      html body .container-box .meta a,
      html body .container-box .ui-footer,
      html body .container-box .ui-footer span {
        color: var(--ft-gzk-muted) !important;
      }
      html body .container-box a {
        color: var(--ft-gzk-link) !important;
        text-decoration: none;
      }
      html body .container-box .ui-content a {
        background: transparent !important;
        border-color: var(--ft-gzk-line) !important;
      }
      html body .container-box a:hover { color: #d0e3fa !important; }
      html body .container-box .title a,
      html body .hot_topic_title a {
        color: var(--ft-gzk-text) !important;
      }
      html body .topic-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--ft-gzk-gap-sm);
        padding: var(--ft-gzk-gap-sm) var(--ft-gzk-gap-lg) var(--ft-gzk-gap-md) !important;
        border-top: 0 !important;
      }
      html body .topic-tags .tag-badge,
      html body .container-box .meta .node a {
        background: var(--ft-gzk-raised) !important;
        color: #b9cce2 !important;
        border: 0 !important;
        border-radius: 999px !important;
        padding: 3px 10px !important;
        font-size: 12px !important;
        line-height: 1.6 !important;
        margin: 0 !important;
      }
      html body .topic-tags .tag-badge:hover,
      html body .container-box .meta .node a:hover {
        background: #384350 !important;
        color: #e0ebf8 !important;
      }
      html body .hot-topics .box { padding: 0 var(--ft-gzk-gap-md); }
      html body .hot-topics .ui-header { padding: var(--ft-gzk-gap-md) 0 var(--ft-gzk-gap-sm) !important; }
      html body .hot-topics .title { border-bottom: 0 !important; }
      html body .hot-topics .cell { padding: 12px 0 !important; }
      html body .hot-topics .cell:last-child { border-bottom: 0 !important; }
      html body .hot_topic_title { font-size: 13px !important; line-height: 1.65 !important; }
      html body .hot-topics td:has(> a > img.avatar),
      html body .hot-topics td:has(> a > img.avatar) + td:empty { display: none; }
      html body .topic-item {
        background: transparent !important;
        border-color: var(--ft-gzk-line) !important;
        padding: 12px var(--ft-gzk-gap-md) !important;
        min-height: 0 !important;
      }
      html body .topic-item .title { margin: 0 0 4px !important; font-size: 15px !important; line-height: 1.5 !important; }
      html body .topic-item .meta { margin: 0 !important; }
      html body .topic-item > .main { padding-right: 40px !important; }
      html body .topic-item .count { right: var(--ft-gzk-gap-md) !important; }
      html body .hotlink { border-color: var(--ft-gzk-line) !important; }
      html body .topic-item:hover { background: #2a2d31 !important; }
      html body .topic-item .count a {
        background: var(--ft-gzk-raised) !important;
        color: var(--ft-gzk-muted) !important;
        border-radius: 6px;
      }
      html body .top-navbar {
        background: #212325 !important;
        border-color: var(--ft-gzk-line) !important;
      }
      html body .navbar-nav > li > a { color: var(--ft-gzk-muted) !important; }
      html body .navbar-nav > li.active > a,
      html body .navbar-nav > li > a:hover {
        background: var(--ft-gzk-raised) !important;
        color: var(--ft-gzk-link) !important;
      }
      html body .form-control,
      html body .navbar-form .form-control {
        background: var(--ft-gzk-raised) !important;
        border-color: var(--ft-gzk-line) !important;
        color: var(--ft-gzk-text) !important;
        border-radius: 7px;
        box-shadow: none !important;
      }
      html body a:focus-visible,
      html body button:focus-visible,
      html body .form-control:focus-visible {
        outline: 2px solid var(--ft-gzk-link) !important;
        outline-offset: 3px;
      }
      @media (max-width: 767px) {
        html body .topic-detail > .ui-header,
        html body .topic-detail > .ui-content,
        html body .topic-detail > .ui-footer,
        html body .topic-reply > .ui-header,
        html body .topic-reply > .ui-content,
        html body .topic-tags {
          padding-left: var(--ft-gzk-gap-md) !important;
          padding-right: var(--ft-gzk-gap-md) !important;
        }
        html body .topic-detail > .ui-header .title { font-size: 20px; }
      }`
    );

    Utils.addStyle(
      'fusion-toolbox-guozaoke-hide-avatars',
      `img.avatar,
      a.avatar[href^="/u/"],
      a[href^="/u/"]:has(> img.avatar:only-child) {
        display: none !important;
      }
      .topic-item > .main,
      .reply-item > .main,
      .ui-header:has(> a > img.avatar) > .main {
        padding-left: 0 !important;
      }`
    );

    const selector = [
      '.sidebox:has(> .ui-content.ad)',
      '.google-auto-placed',
      'ins.adsbygoogle',
      '.fc-dns-dialog:has(.fc-dns-link)',
    ].join(',');

    Utils.addStyle(
      'fusion-toolbox-guozaoke-hide-ads',
      `${selector} { display: none !important; }
      html:has(ins.adsbygoogle[data-anchor-status]) body {
        padding-bottom: 0 !important;
      }`
    );

    const hide = (element) => {
      // Google side rails use inline !important styles and may restore them.
      if (element.style.getPropertyValue('display') !== 'none' ||
          element.style.getPropertyPriority('display') !== 'important') {
        element.style.setProperty('display', 'none', 'important');
      }
    };
    const scan = (root) => {
      if (root.matches?.(selector)) hide(root);
      for (const element of root.querySelectorAll?.(selector) || []) hide(element);
    };

    scan(document);
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          if (mutation.target.matches(selector)) hide(mutation.target);
        } else {
          for (const node of mutation.addedNodes) scan(node);
        }
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
  },
}
