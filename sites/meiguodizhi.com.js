{
  name: 'meiguodizhi.com-hide-right-ad-iframe',
  match() {
    return location.hostname === 'www.meiguodizhi.com';
  },
  run() {
    const styleId = 'fusion-toolbox-meiguodizhi-theme-and-hide-right-ad-iframe';

    Utils.addStyle(
      styleId,
      `:root {
        color-scheme: dark;
      }
      body,
      .content,
      .detail,
      .indexpage,
      .item,
      .container,
      .container-fluid,
      .panel,
      .panel-body,
      .panel-default,
      .panel-primary,
      .panel-info,
      .well,
      .breadcrumb,
      .list-group-item,
      .table,
      .table-responsive,
      .table-striped > tbody > tr:nth-of-type(odd),
      .table-striped > tbody > tr:nth-of-type(even),
      .table-hover > tbody > tr:hover,
      .form-control,
      .input-group-addon,
      .navbar,
      .navbar-default,
      .dropdown-menu,
      .modal-content,
      .pagination > li > a,
      .pagination > li > span,
      .jumbotron,
      footer {
        background: #292a2d !important;
        color: #e4e4e7 !important;
        border-color: #41434a !important;
      }
      html,
      body {
        background: #292a2d !important;
        color: #e4e4e7 !important;
      }
      .content {
        background: #292a2d !important;
        border: 1px solid #41434a !important;
        box-shadow: none !important;
      }
      .navbar.navbar-default,
      #nav-top-1,
      #nav-top-1 .i-m-n,
      #nav-top-1 .item,
      .navbar-header.sign-2,
      .visible-xs.sign {
        background: #292a2d !important;
        border-color: #41434a !important;
        background-image: none !important;
        box-shadow: none !important;
      }
      #nav-top-1 .item {
        border-bottom: 1px solid #3a3c42 !important;
      }
      #nav-top-1 .item a,
      .navbar-header.sign-2 a,
      .visible-xs.sign a {
        color: #e4e4e7 !important;
      }
      .navbar-default .navbar-toggle {
        border-color: #535660 !important;
        background: #303136 !important;
      }
      .navbar-default .navbar-toggle .icon-bar {
        background-color: #e4e4e7 !important;
      }
      .detail,
      .indexpage,
      .item,
      .item .right,
      .row.item,
      .row.detail {
        background: transparent !important;
        color: #e4e4e7 !important;
        border-color: #41434a !important;
      }
      .c-te,
      .c-te tr,
      .c-te td,
      .table.c-te,
      .table.c-te > tbody > tr > td,
      .table.c-te > tbody > tr > th {
        background: transparent !important;
        color: #e4e4e7 !important;
        border-color: #41434a !important;
      }
      .boder-none,
      input.boder-none {
        background: transparent !important;
        color: #e4e4e7 !important;
        border: none !important;
        box-shadow: none !important;
      }
      #city {
        background: #303136 !important;
        color: #e4e4e7 !important;
        border: 1px solid #535660 !important;
      }
      h1, h2, h3, h4, h5, h6,
      p, span, div, li, dt, dd, td, th, label, strong, small,
      a:not(.btn) {
        color: #e4e4e7 !important;
      }
      a,
      .breadcrumb > li + li:before,
      .list-group-item a,
      .panel-title,
      .nav > li > a,
      .navbar-brand {
        color: #8aafff !important;
      }
      .panel-heading,
      .navbar,
      .navbar-default,
      .btn-success,
      .btn-primary,
      .label,
      .badge,
      [class*="header"] {
        background: #303136 !important;
        color: #f4f4f5 !important;
        border-color: #41434a !important;
      }
      p.title,
      .title {
        background: #303136 !important;
        color: #e4e4e7 !important;
        border-left: 3px solid #6e9bff !important;
        border-bottom: 1px solid #41434a !important;
      }
      p.title b,
      .title b {
        color: #f4f4f5 !important;
      }
      .btn,
      button,
      input,
      select,
      textarea {
        background: #303136 !important;
        color: #e4e4e7 !important;
        border-color: #535660 !important;
      }
      input::placeholder,
      textarea::placeholder {
        color: #a6a8b0 !important;
      }
      hr,
      .table > thead > tr > th,
      .table > tbody > tr > td,
      .table > tbody > tr > th,
      .list-group-item,
      .breadcrumb,
      .panel,
      .panel-heading,
      .panel-footer {
        border-color: #41434a !important;
      }
      .row,
      .col-md-12,
      .col-sm-12,
      .col-xs-12,
      .page-header,
      .page-header h1,
      .page-header h2,
      .page-header h3,
      .country-list,
      .country-list a,
      .links,
      .links a,
      #all-c,
      #all-c ul,
      #all-c li,
      .tag,
      .tags,
      .friend-link,
      .friend-links,
      .link-list,
      .city-list,
      .area-list,
      .bottom-links,
      .bottom-nav,
      .site-links,
      .site-map,
      .address-links,
      .panel:last-of-type,
      .panel-body:last-of-type,
      .container > .row:last-of-type,
      .container-fluid > .row:last-of-type,
      [class*="country"],
      [class*="footer-links"],
      [class*="all-country"],
      [class*="all-country"] a,
      [class*="area-list"],
      [class*="area-list"] a {
        background: #292a2d !important;
        color: #b8bbc4 !important;
        border-color: #41434a !important;
      }
      #all-c {
        background: #292a2d !important;
        border-top: 1px solid #41434a !important;
      }
      #all-c .all-c-t,
      #all-c p,
      #all-c a {
        color: #e4e4e7 !important;
      }
      #all-c .all-c-t {
        background: #292a2d !important;
        color: #e4e4e7 !important;
        border-bottom: 1px solid #41434a !important;
      }
      #all-c a:hover {
        color: #8aafff !important;
      }
      h2.text-center,
      h3.text-center,
      h4.text-center,
      .text-center {
        color: #e4e4e7 !important;
      }
      .navbar.navbar-default,
      #nav-top-1, #nav-top-1 .i-m-n, #nav-top-1 .item,
      .navbar-header.sign-2, .visible-xs.sign,
      .breadcrumb, .panel-heading, .panel-footer {
        background: #212327 !important;
      }
      .ui_dialog, .modal-content, .dropdown-menu {
        background: #303136 !important;
        color: #e4e4e7 !important;
        border-color: #484a51 !important;
        box-shadow: 0 12px 32px rgb(0 0 0 / 35%) !important;
      }
      .ui_dialog_mask { background: rgb(0 0 0 / 65%) !important; }
      a:not(.btn), #nav-top-1 .item a:hover, #all-c a:hover {
        color: #8aafff !important;
      }
      #nav-top-1 .item:hover, .dropdown-menu > li > a:hover,
      .btn-default:hover, .table-hover > tbody > tr:hover {
        background: #3a3c42 !important;
      }
      .btn.btn-primary, .btn.btn-success {
        background: #4d6bfe !important;
        border-color: #4d6bfe !important;
        color: #fff !important;
      }
      .btn.btn-primary:hover, .btn.btn-success:hover,
      .btn.btn-primary:focus-visible, .btn.btn-success:focus-visible {
        background: #607bff !important;
        border-color: #607bff !important;
      }
      .btn.btn-primary:active, .btn.btn-success:active {
        background: #3e58df !important;
        border-color: #3e58df !important;
      }
      #city:focus, .form-control:focus, #dialog_textarea:focus {
        border-color: #6e9bff !important;
        box-shadow: 0 0 0 2px rgb(110 155 255 / 18%) !important;
        outline: none !important;
      }
      input:disabled, button:disabled, .btn.disabled {
        background: #35373d !important;
        color: #858995 !important;
        border-color: #484a51 !important;
      }
      ::selection { background: #4563a0; color: #fff; }
      :root { scrollbar-color: #5c606a #212327; }
      #all-c + * {
        display: none !important;
      }
      footer,
      .footer,
      #footer,
      .copyright,
      [class*="copyright"],
      [class*="beian"],
      [class*="备案"] {
        display: none !important;
      }
      iframe[style*="position: fixed"][style*="z-index: 2147483647"][style*="max-width: 420px"][style*="height: 190px"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }`
    );

    function isTargetAdFrame(node) {
      if (!(node instanceof HTMLIFrameElement)) {
        return false;
      }

      const style = node.style;
      const rect = node.getBoundingClientRect();

      return (
        style.position === 'fixed' &&
        style.background === 'transparent' &&
        style.maxWidth === '420px' &&
        style.height === '190px' &&
        style.width === '100%' &&
        style.zIndex === '2147483647' &&
        rect.top <= 30 &&
        rect.right >= window.innerWidth - 5 &&
        rect.height >= 150 &&
        rect.width >= 300
      );
    }

    function hideFrame(node) {
      node.style.setProperty('display', 'none', 'important');
      node.style.setProperty('visibility', 'hidden', 'important');
      node.style.setProperty('opacity', '0', 'important');
      node.style.setProperty('pointer-events', 'none', 'important');
    }

    function hideFrames(root = document) {
      const scope = root instanceof HTMLElement ? root : document;
      const nodes =
        scope === document
          ? document.querySelectorAll('iframe')
          : scope.querySelectorAll('iframe');

      for (const node of nodes) {
        if (!isTargetAdFrame(node)) {
          continue;
        }
        hideFrame(node);
      }

      if (scope instanceof HTMLIFrameElement && isTargetAdFrame(scope)) {
        hideFrame(scope);
      }
    }

    Utils.onReady(() => {
      hideFrames();

      Utils.observeAddedNodes((node) => {
        hideFrames(node);
      });

      const observer = new MutationObserver(() => {
        hideFrames();
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
      });

      Utils.removeSelectors([
        '#all-c + *',
        'footer',
        '.footer',
        '#footer',
        '.copyright',
        '[class*="copyright"]',
        '[class*="beian"]',
        '.container > .row:last-of-type + .row',
        '.container-fluid > .row:last-of-type + .row',
      ]);
    });
  },
}
