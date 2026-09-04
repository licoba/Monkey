{
  name: 'wx.mail.qq.com-dark-theme',
  match() {
    return location.hostname === 'wx.mail.qq.com';
  },
  run() {
    Utils.addStyle(
      'fusion-toolbox-qqmail-dark-theme',
      `:root {
        color-scheme: dark;
        --fusion-qqmail-bg: #0f1318;
        --fusion-qqmail-panel: #151a20;
        --fusion-qqmail-panel-raised: #1b2129;
        --fusion-qqmail-hover: #222a34;
        --fusion-qqmail-active: #25384d;
        --fusion-qqmail-border: #2c3540;
        --fusion-qqmail-text: #e7edf3;
        --fusion-qqmail-muted: #9ba8b6;
        --fusion-qqmail-accent: #6aafff;
      }

      html,
      body,
      .xmail-page-root,
      .frame-theme-layer-base,
      .frame-theme-layer-overlay,
      .frame-theme-layer-festive,
      .frame-theme-bg-body,
      .frame-theme-bg-route-content,
      .frame-theme-bg-right,
      .frame-body,
      .frame-route-wrap,
      .frame-route-content,
      .mail-list-page,
      .mail-list-body,
      .mail-list-page-items,
      .mail-list-reader-wrap,
      .mail-list-page-reader,
      .mail-reader-body,
      .reader-body-children,
      .mail-list-page-reader-tips {
        background: var(--fusion-qqmail-bg) !important;
        color: var(--fusion-qqmail-text) !important;
      }

      .frame-theme-bg-header,
      .frame-header,
      .frame-theme-bg-sidebar,
      .frame-sidebar,
      .sidebar-header,
      .mail-list-page-toolbar,
      [class*='compose'][class*='header'],
      [class*='reader'][class*='header'] {
        background: var(--fusion-qqmail-panel) !important;
        color: var(--fusion-qqmail-text) !important;
        border-color: var(--fusion-qqmail-border) !important;
        box-shadow: none !important;
      }

      .mail-list-page-toolbar,
      .mail-list-page-items,
      .mail-list-reader-wrap,
      .mail-list-page-reader,
      .mail-list-page-splitter,
      .mail-list-page-group-title,
      .mail-list-page-item,
      .sidebar-menus,
      [class*='compose'][class*='body'],
      [class*='compose'][class*='content'],
      [class*='reader'][class*='toolbar'] {
        border-color: var(--fusion-qqmail-border) !important;
      }

      .mail-list-page-item {
        background: var(--fusion-qqmail-panel) !important;
        color: var(--fusion-qqmail-text) !important;
      }

      .mail-list-page-item:hover,
      .mail-list-page-item[class*='active'],
      .mail-list-page-item[class*='selected'],
      .frame-sidebar-menu:hover,
      .xmail-ui-menu-item:hover,
      [class*='dropdown'] [class*='item']:hover {
        background: var(--fusion-qqmail-hover) !important;
      }

      .sidebar-menu-active,
      .frame-sidebar-menu[class*='active'] {
        background: var(--fusion-qqmail-active) !important;
        color: #f5f9ff !important;
      }

      .mail-unread,
      .mail-unread .mail-sender,
      .mail-unread .mail-subject,
      .mail-unread .mail-time {
        color: #f5f9ff !important;
        font-weight: 600;
      }

      .mail-sender,
      .mail-subject,
      .mail-text,
      .mail-time,
      .mail-detail-subject,
      .mail-subject-text,
      .mail-detail-basic,
      .mail-detail-content,
      .cmp-account-nick,
      .cmp-account-email,
      .cmp-account-inner,
      .time-text,
      .sidebar-menu-text,
      .sidebar-feature-title,
      .toolbar-title,
      .toolbar-folder-name,
      .tips-title,
      .xmail-cmp-account,
      .xmail-ui-hyperlink,
      label,
      legend {
        color: var(--fusion-qqmail-text) !important;
      }

      .mail-digest,
      .title-total,
      .mail-list-page-toolbar-mail-total,
      .basic-item-name,
      .sub-mail-digest,
      .quick-reply-text,
      .user-email,
      [class*='placeholder'],
      [class*='secondary'],
      [class*='description'] {
        color: var(--fusion-qqmail-muted) !important;
      }

      .mail-detail-alert-bar {
        background: var(--fusion-qqmail-panel-raised) !important;
        color: var(--fusion-qqmail-text) !important;
        border-color: var(--fusion-qqmail-border) !important;
      }

      .mail-detail-alert-bar .alert-text {
        color: var(--fusion-qqmail-text) !important;
      }

      .mail-list-page-items-notice-bar,
      .mail-list-page-items-notice-bar .notice-bar-body {
        background: var(--fusion-qqmail-panel-raised) !important;
        color: var(--fusion-qqmail-text) !important;
        border-color: var(--fusion-qqmail-border) !important;
      }

      .mail-list-page-items-notice-bar .xmail-ui-hyperlink,
      .mail-list-page-items-notice-bar .text-margin-link {
        color: var(--fusion-qqmail-accent) !important;
      }

      .qmbox {
        color: var(--fusion-qqmail-text) !important;
      }

      .qmbox [style*='color: black' i],
      .qmbox [style*='color:black' i],
      .qmbox [style*='color: #000' i],
      .qmbox [style*='color:#000' i],
      .qmbox [color='black' i],
      .qmbox [color='#000'],
      .qmbox [color='#000000'] {
        color: var(--fusion-qqmail-text) !important;
      }

      .qmbox > div[style*='font-family: -apple-system, system-ui'][style*='color: rgb(0, 0, 0)'] {
        color: var(--fusion-qqmail-text) !important;
      }

      a,
      .xmail-ui-hyperlink[class*='blue'] {
        color: var(--fusion-qqmail-accent) !important;
      }

      .mail-lazy-search-wrap,
      input,
      textarea,
      select,
      [contenteditable='true'],
      .xmail-ui-input,
      .xmail-ui-textarea {
        background: var(--fusion-qqmail-panel-raised) !important;
        color: var(--fusion-qqmail-text) !important;
        border-color: var(--fusion-qqmail-border) !important;
        box-shadow: none !important;
      }

      input::placeholder,
      textarea::placeholder {
        color: var(--fusion-qqmail-muted) !important;
      }

      .xmail-ui-btn,
      button {
        color: var(--fusion-qqmail-text) !important;
        border-color: var(--fusion-qqmail-border) !important;
        box-shadow: none !important;
      }

      .xmail-ui-btn:not([class*='primary']):not([class*='theme']),
      button:not([class*='primary']):not([class*='theme']) {
        background: var(--fusion-qqmail-panel-raised) !important;
      }

      .xmail-ui-btn:hover,
      button:hover {
        background-color: var(--fusion-qqmail-hover) !important;
      }

      html body.page-color-theme .xmail-page-root .frame-sidebar .frame-sidebar-compose-btn {
        background-color: #2878d8 !important;
        background-image: none !important;
        color: #ffffff !important;
        border-color: #3989e8 !important;
        box-shadow: inset 0 0 0 100vmax #2878d8 !important;
        isolation: isolate;
        overflow: hidden;
      }

      html body.page-color-theme .xmail-page-root .frame-sidebar .frame-sidebar-compose-btn:hover,
      html body.page-color-theme .xmail-page-root .frame-sidebar .frame-sidebar-compose-btn:focus,
      html body.page-color-theme .xmail-page-root .frame-sidebar .frame-sidebar-compose-btn:focus-visible {
        background-color: #3388e8 !important;
        box-shadow: inset 0 0 0 100vmax #3388e8 !important;
      }

      html body.page-color-theme .xmail-page-root .frame-sidebar .frame-sidebar-compose-btn:active,
      html body.page-color-theme .xmail-page-root .frame-sidebar .frame-sidebar-compose-btn[class*='active'] {
        background-color: #226bc2 !important;
        box-shadow: inset 0 0 0 100vmax #226bc2 !important;
      }

      .frame-sidebar-compose-btn::before,
      .frame-sidebar-compose-btn::after {
        background: transparent !important;
        background-image: none !important;
      }

      .frame-sidebar-compose-btn .compose-btn-text,
      .frame-sidebar-compose-btn .xmail-ui-icon,
      .frame-sidebar-compose-btn svg {
        color: #ffffff !important;
      }

      .frame-sidebar-menu[data-sidebar-dir-id='1003'],
      .frame-sidebar-menu[data-sidebar-dir-id='1004'],
      .frame-sidebar-menu[data-sidebar-dir-id='1006'],
      .frame-sidebar-menu[data-sidebar-dir-id='1007'] {
        display: none !important;
      }

      .xmail-ui-icon,
      .xmail-ui-checkbox,
      .ui-checkbox-icon-uncheck,
      .ui-checkbox-uncheck-icon {
        color: var(--fusion-qqmail-text) !important;
        border-color: #667585 !important;
      }

      .xmail-ui-dialog,
      .xmail-ui-modal,
      .xmail-ui-popover,
      .xmail-ui-menu,
      [role='dialog'],
      [role='menu'],
      [class*='dialog'][class*='content'],
      [class*='modal'][class*='content'],
      [class*='popover'][class*='content'],
      [class*='dropdown'][class*='menu'] {
        background: var(--fusion-qqmail-panel-raised) !important;
        color: var(--fusion-qqmail-text) !important;
        border-color: var(--fusion-qqmail-border) !important;
        box-shadow: 0 12px 32px rgb(0 0 0 / 45%) !important;
      }

      html body.page-color-theme .xmail-ui-dialog .ui-dialog-mask {
        background: rgb(0 0 0 / 68%) !important;
      }

      html body.page-color-theme .xmail-ui-dialog .ui-dialog-body,
      html body.page-color-theme .xmail-ui-dialog .ui-dialog-header,
      html body.page-color-theme .xmail-ui-dialog .ui-dialog-title,
      html body.page-color-theme .xmail-ui-dialog .ui-dialog-content,
      html body.page-color-theme .xmail-ui-dialog .ui-dialog-footer {
        background: var(--fusion-qqmail-panel-raised) !important;
        color: var(--fusion-qqmail-text) !important;
        border-color: var(--fusion-qqmail-border) !important;
      }

      html body.page-color-theme .xmail-ui-dialog .ui-dialog-body {
        box-shadow: 0 18px 48px rgb(0 0 0 / 55%) !important;
      }

      html body.page-color-theme .xmail-ui-dialog .ui-dialog-title-text {
        color: var(--fusion-qqmail-text) !important;
      }

      html body.page-color-theme .xmail-ui-dialog .ui-dialog-subtitle {
        color: var(--fusion-qqmail-muted) !important;
      }

      [class*='compose'][class*='page'],
      [class*='compose'][class*='wrap'],
      [class*='compose'][class*='body'],
      [class*='compose'][class*='content'] {
        background: var(--fusion-qqmail-bg) !important;
        color: var(--fusion-qqmail-text) !important;
      }

      .xmail-ui-float-scroll-bar,
      ::-webkit-scrollbar-corner {
        background: var(--fusion-qqmail-bg) !important;
      }

      ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      ::-webkit-scrollbar-thumb {
        background: #46515e !important;
        border: 2px solid var(--fusion-qqmail-bg);
        border-radius: 6px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #596777 !important;
      }

      *:focus-visible {
        outline: 2px solid var(--fusion-qqmail-accent) !important;
        outline-offset: 2px !important;
      }`
    );
  },
}
