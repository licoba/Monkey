{
  name: 'ai.eaglelab.tcl.com-dark-theme',
  match() {
    return location.hostname === 'ai.eaglelab.tcl.com';
  },
  run() {
    Utils.addStyle(
      'fusion-toolbox-eaglelab-dark-theme',
      `:root, html.light, html.dark {
        color-scheme: dark;
        --fusion-eagle-bg: #292a2d;
        --fusion-eagle-sidebar: #212327;
        --fusion-eagle-surface: #303136;
        --fusion-eagle-hover: #3a3c42;
        --fusion-eagle-border: #484a51;
        --fusion-eagle-text: #e4e4e7;
        --fusion-eagle-muted: #a6a8b0;
        --fusion-eagle-accent: #6e9bff;
        --theme-bg: var(--fusion-eagle-bg) !important;
        --theme-gray-bg: var(--fusion-eagle-sidebar) !important;
        --sidebar-bg: var(--fusion-eagle-sidebar) !important;
        --sidebar-shadow: none !important;
        --chat-bg: var(--fusion-eagle-bg) !important;
        --font-color: var(--fusion-eagle-text) !important;
        --theme-color: var(--fusion-eagle-accent) !important;
        --theme-color-2: #6e9bffcc !important;
        --theme-colo-3: #6e9bff99 !important;
        --hh-main-bg-1: var(--fusion-eagle-bg) !important;
        --hh-block-bg-1: var(--fusion-eagle-surface) !important;
        --hh-block-bg-2: var(--fusion-eagle-sidebar) !important;
        --hh-btn-bg-1: var(--fusion-eagle-surface) !important;
        --hh-btn-bg-2: var(--fusion-eagle-hover) !important;
        --hh-main-text-color: var(--fusion-eagle-text) !important;
        --hh-placeholder-text-color: var(--fusion-eagle-muted) !important;
        --hh-border-color: var(--fusion-eagle-border) !important;
        --svg-normal-color: var(--fusion-eagle-hover) !important;
        --send-normal-color: #46516a !important;
        --feedback-normal-color: var(--fusion-eagle-muted) !important;
        --svg-upload-color: var(--fusion-eagle-text) !important;
        --msg-border: var(--fusion-eagle-border) !important;
        --msg-bg: var(--fusion-eagle-surface) !important;
        --el-bg-color: var(--fusion-eagle-bg) !important;
        --el-bg-color-page: var(--fusion-eagle-sidebar) !important;
        --el-bg-color-overlay: var(--fusion-eagle-surface) !important;
        --el-fill-color-blank: var(--fusion-eagle-surface) !important;
        --el-fill-color: var(--fusion-eagle-hover) !important;
        --el-fill-color-light: #35373d !important;
        --el-fill-color-lighter: #313338 !important;
        --el-fill-color-extra-light: #2d2f34 !important;
        --el-fill-color-dark: #44464e !important;
        --el-fill-color-darker: #51535d !important;
        --el-text-color-primary: var(--fusion-eagle-text) !important;
        --el-text-color-regular: #d2d3d8 !important;
        --el-text-color-secondary: var(--fusion-eagle-muted) !important;
        --el-text-color-placeholder: #92959f !important;
        --el-text-color-disabled: #797d88 !important;
        --el-border-color: var(--fusion-eagle-border) !important;
        --el-border-color-light: #41434a !important;
        --el-border-color-lighter: #393b42 !important;
        --el-border-color-extra-light: #34363d !important;
        --el-border-color-dark: #575a63 !important;
        --el-border-color-darker: #656974 !important;
        --el-color-primary: var(--fusion-eagle-accent) !important;
        --el-color-primary-1: #6e9bff99 !important;
        --el-color-primary-2: #6e9bff66 !important;
        --el-color-primary-light-1: #2c3547 !important;
        --el-color-primary-light-3: #527fdc !important;
        --el-color-primary-light-5: #4266ad !important;
        --el-color-primary-light-7: #35496f !important;
        --el-color-primary-light-8: #303f5b !important;
        --el-color-primary-light-9: #2c3547 !important;
        --el-color-primary-dark-2: #4d80ee !important;
        --el-color-info: var(--fusion-eagle-muted) !important;
        --el-color-info-light-3: #777c88 !important;
        --el-color-info-light-5: #626671 !important;
        --el-color-info-light-7: #444750 !important;
        --el-color-info-light-8: #3a3d44 !important;
        --el-color-info-light-9: #33363d !important;
        --el-color-success: #78cb9d !important;
        --el-color-success-light-8: #34483e !important;
        --el-color-success-light-9: #2c3a33 !important;
        --el-color-warning: #e5b86d !important;
        --el-color-warning-light-8: #504433 !important;
        --el-color-warning-light-9: #3e372f !important;
        --el-color-danger: #f18b91 !important;
        --el-color-danger-light-8: #57383e !important;
        --el-color-danger-light-9: #423136 !important;
        --el-color-error: #f18b91 !important;
        --el-color-error-light-8: #57383e !important;
        --el-color-error-light-9: #423136 !important;
        --el-disabled-bg-color: #34363b !important;
        --el-disabled-text-color: #858995 !important;
        --el-disabled-border-color: #41434a !important;
        --el-mask-color: rgb(0 0 0 / 65%) !important;
        --el-mask-color-extra-light: rgb(33 35 39 / 80%) !important;
        --el-box-shadow-light: 0 8px 28px rgb(0 0 0 / 35%) !important;
      }

      html, body, #__nuxt, .main-layout, .main-content, .page-content,
      .chat-content, .top-header, .white {
        background-color: var(--fusion-eagle-bg) !important;
        color: var(--fusion-eagle-text) !important;
      }
      /* Match the site's tiled watermark layers, including ones recreated on navigation. */
      div[style*='pointer-events: none'][style*='background-image:'][style*='background-repeat: repeat'][style*='print-color-adjust: exact'] {
        opacity: 0 !important;
      }
      .sidebar, .sidebar-scrollbar, .sidebar .logo-section {
        background: var(--fusion-eagle-sidebar) !important;
      }
      .drag-drop-container, .notification-card, .assistant-dropdown,
      .legacy-submenu, .language-submenu, .submenu-panel,
      .el-dialog, .el-message-box, .el-drawer, .el-popover,
      .el-popper.is-light, .tooltip-border.el-popper.is-dark,
      .el-dropdown-menu, .el-select-dropdown, .el-cascader-panel,
      .el-card, .el-upload-dragger, .el-input__wrapper,
      .el-select__wrapper, .el-textarea__inner,
      .welcome-model-dialog .el-dialog__headerbtn,
      [class~='bg-white'], [class~='bg-gray-50'], [class~='bg-gray-100'] {
        background-color: var(--fusion-eagle-surface) !important;
        color: var(--fusion-eagle-text) !important;
        border-color: var(--fusion-eagle-border) !important;
      }
      .el-popper.is-light > .el-popper__arrow::before {
        background: var(--fusion-eagle-surface) !important;
        border-color: var(--fusion-eagle-border) !important;
      }
      .notification-card .header, .el-table, .el-table th.el-table__cell,
      .el-table tr, .el-table td.el-table__cell {
        background-color: var(--fusion-eagle-bg) !important;
        color: var(--fusion-eagle-text) !important;
      }
      .el-table .el-table__row:hover > td.el-table__cell,
      .sidebar .nav-item.active, .sidebar .nav-item:hover,
      .chat-list-item-simple:hover, .menu-item:hover, .menu-item.active, .submenu-item:hover,
      .el-select-dropdown__item.is-hovering,
      .el-dropdown-menu__item:not(.is-disabled):hover {
        background-color: var(--fusion-eagle-hover) !important;
      }
      .page-title, .page-description, .privacy-label, .el-form-item__label,
      .menu-item-title, .check-icon,
      .el-dialog__title, .el-message-box__title, .el-radio__label,
      .el-checkbox__label, .el-input__inner, .el-select__placeholder,
      [contenteditable='true'], [class~='text-black'],
      [class~='text-gray-900'], [class~='text-gray-800'], [class~='text-gray-700'] {
        color: var(--fusion-eagle-text) !important;
      }
      .privacy-desc, .menu-item-desc, .menu-group-header,
      [class~='text-gray-600'], [class~='text-gray-500'], [class~='text-gray-400'],
      [class~='text-black/40'], [class~='text-black/50'], [class~='text-black/60'] {
        color: var(--fusion-eagle-muted) !important;
      }
      input::placeholder, textarea::placeholder { color: #92959f !important; }
      [class~='text-[#333]'], [class~='text-[#333333]'], [class~='text-[#000]'] {
        color: var(--fusion-eagle-text) !important;
      }
      .el-check-tag.is-checked, .el-check-tag-custom .el-button--info.active {
        background-color: #2c3547 !important;
        color: #9bb9ff !important;
      }
      .drag-drop-container .nuxt-icon { color: var(--fusion-eagle-muted) !important; }
      .drag-drop-container svg [fill='#000000'],
      .drag-drop-container svg [fill='#333'],
      .drag-drop-container svg [fill='#333333'],
      .drag-drop-container svg [fill='#495057'] {
        fill: var(--fusion-eagle-muted) !important;
      }
      .page-wrapper.left-0 {
        background-image: linear-gradient(to right, var(--fusion-eagle-bg), transparent) !important;
      }
      .page-wrapper.right-0 {
        background-image: linear-gradient(to left, var(--fusion-eagle-bg), transparent) !important;
      }
      .el-tabs__nav-wrap::after { background-color: var(--fusion-eagle-border) !important; }
      article [class~='bg-white/[0.4]'], .think-status {
        background: var(--fusion-eagle-surface) !important;
        color: var(--fusion-eagle-muted) !important;
      }
      .think-content {
        color: var(--fusion-eagle-muted) !important;
        border-color: var(--fusion-eagle-border) !important;
      }
      article [class~='bg-white/[0.4]'] svg [fill]:not([fill='none']) {
        fill: var(--fusion-eagle-muted) !important;
      }
      article .nuxt-icon.svg-icon.cursor-pointer {
        color: var(--fusion-eagle-muted) !important;
        border-radius: 4px;
        transition: color 120ms ease, background-color 120ms ease;
      }
      article .nuxt-icon.svg-icon.cursor-pointer:hover {
        color: var(--fusion-eagle-text) !important;
        background-color: var(--fusion-eagle-hover) !important;
      }
      article .nuxt-icon.svg-icon.cursor-pointer svg [fill]:not([fill='none']) {
        fill: currentColor !important;
      }
      article .nuxt-icon.svg-icon.cursor-pointer svg [stroke]:not([stroke='none']) {
        stroke: currentColor !important;
      }
      .el-tabs .el-tabs__item.is-active, .el-tabs .el-tabs__item:hover,
      .el-select-dropdown__item.is-selected { color: var(--fusion-eagle-accent) !important; }
      .el-button--primary:not(.is-plain), .el-button--primary:not(.is-plain):hover {
        --el-button-text-color: #fff;
        --el-button-hover-text-color: #fff;
        --el-button-bg-color: #4d6bfe;
        --el-button-hover-bg-color: #5f7aff;
        --el-button-border-color: #4d6bfe;
        --el-button-hover-border-color: #5f7aff;
      }
      [class~='border-gray-200'], [class~='border-gray-100'],
      [class~='border-[#f0f0f0]'], .file-item, .drag-drop-container {
        border-color: var(--fusion-eagle-border) !important;
      }
      [class~='bg-gray-200'] { background-color: var(--fusion-eagle-border) !important; }
      [class~='bg-black/[0.06]'] { background-color: var(--fusion-eagle-hover) !important; }
      .markdown-body, .markdown-body table tr {
        background-color: transparent !important;
        color: var(--fusion-eagle-text) !important;
        --color-fg-default: var(--fusion-eagle-text);
        --color-fg-muted: var(--fusion-eagle-muted);
        --color-canvas-default: var(--fusion-eagle-bg);
        --color-canvas-subtle: var(--fusion-eagle-sidebar);
        --color-border-default: var(--fusion-eagle-border);
        --color-accent-fg: var(--fusion-eagle-accent);
      }
      .markdown-body pre, .markdown-body code, pre.hljs {
        background-color: var(--fusion-eagle-sidebar) !important;
        color: var(--fusion-eagle-text);
      }
      .markdown-body a { color: var(--fusion-eagle-accent) !important; }
      :focus-visible { outline-color: var(--fusion-eagle-accent); }
      ::selection { background: #4563a0; color: #fff; }
      :root { scrollbar-color: #5c606a var(--fusion-eagle-sidebar); }
      ::-webkit-scrollbar-track, ::-webkit-scrollbar-corner { background: var(--fusion-eagle-sidebar); }
      ::-webkit-scrollbar-thumb { background: #5c606a; border-radius: 6px; }`
    );
  },
}
