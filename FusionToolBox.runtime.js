(function () {
  'use strict';

  const FUSION_TOOLBOX_VERSION = '0.1.3';

  const Utils = {
    addStyle(id, cssText) {
      if (document.getElementById(id)) {
        return;
      }

      const style = document.createElement('style');
      style.id = id;
      style.textContent = cssText;
      (document.head || document.documentElement).appendChild(style);
    },

    hideSelectors(selectors, root = document) {
      for (const selector of selectors) {
        for (const node of root.querySelectorAll(selector)) {
          node.style.setProperty('visibility', 'hidden', 'important');
          node.style.setProperty('opacity', '0', 'important');
          node.style.setProperty('pointer-events', 'none', 'important');
        }
      }
    },

    removeSelectors(selectors, root = document) {
      for (const selector of selectors) {
        for (const node of root.querySelectorAll(selector)) {
          node.style.setProperty('display', 'none', 'important');
        }
      }
    },

    observeAddedNodes(callback) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
              callback(node);
            }
          }
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });

      return observer;
    },

    onReady(callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
      } else {
        callback();
      }
    },
  };

  const modules = [
    {
      name: 'tempmail.plus-hide-side-ads',
      match() {
        return location.hostname === 'tempmail.plus';
      },
      run() {
        const styleId = 'fusion-toolbox-tempmail-plus-hide-ads';
        const hideSelectors = [
          '#email > .title',
          'header .d-flex.flex-row.align-items-center > .d-none.d-md-block',
          'header .link',
          '#email .row > .col p.text-left.text-white',
          '#ads-del2',
          '#ads-del4',
          '#ads-del5',
          '.ad-banners',
          '.ad-banners a',
          '.main [id*="ads-del"]',
          '[id^="ads-del"]',
          '[id*="ads-del"]',
          '[class*="ad-banner"]',
          '[class*="ads-banner"]',
          'iframe[src*="googlesyndication"]',
          'iframe[src*="doubleclick"]',
          'iframe[id*="google_ads"]',
        ];
        const removeSelectors = [
          '.info.mb-50.mb-xl-70',
        ];

        Utils.addStyle(
          styleId,
          `${hideSelectors.join(',\n')} {
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          ${removeSelectors.join(',\n')} {
            display: none !important;
          }`
        );

        const hide = (root = document) => {
          Utils.hideSelectors(hideSelectors, root);
          Utils.removeSelectors(removeSelectors, root);
        };

        Utils.onReady(() => {
          hide();

          Utils.observeAddedNodes((node) => {
            if (node.matches?.([...hideSelectors, ...removeSelectors].join(','))) {
              hide(node.parentElement || document);
              return;
            }

            hide(node);
          });
        });
      },
    },
    {
      name: '2925.com-hide-ads',
      match() {
        return location.hostname === '2925.com';
      },
      run() {
        const styleId = 'fusion-toolbox-2925-hide-ads';
        const removeSelectors = [
          '.adv-container',
          '.left-adv',
          '.index-adv',
        ];

        Utils.addStyle(
          styleId,
          `${removeSelectors.join(',\n')} {
            display: none !important;
          }`
        );

        const hide = (root = document) => {
          Utils.removeSelectors(removeSelectors, root);
        };

        Utils.onReady(() => {
          hide();

          Utils.observeAddedNodes((node) => {
            if (node.matches?.(removeSelectors.join(','))) {
              hide(node.parentElement || document);
              return;
            }

            hide(node);
          });
        });
      },
    },
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
            background: #111827 !important;
            color: #e5e7eb !important;
            border-color: #374151 !important;
          }
          html,
          body {
            background: #0b1220 !important;
            color: #e5e7eb !important;
          }
          .content {
            background: #111827 !important;
            border: 1px solid #334155 !important;
            box-shadow: none !important;
          }
          .navbar.navbar-default,
          #nav-top-1,
          #nav-top-1 .i-m-n,
          #nav-top-1 .item,
          .navbar-header.sign-2,
          .visible-xs.sign {
            background: #111827 !important;
            border-color: #334155 !important;
            background-image: none !important;
            box-shadow: none !important;
          }
          #nav-top-1 .item {
            border-bottom: 1px solid #243041 !important;
          }
          #nav-top-1 .item a,
          .navbar-header.sign-2 a,
          .visible-xs.sign a {
            color: #e5e7eb !important;
          }
          .navbar-default .navbar-toggle {
            border-color: #475569 !important;
            background: #0f172a !important;
          }
          .navbar-default .navbar-toggle .icon-bar {
            background-color: #e5e7eb !important;
          }
          .detail,
          .indexpage,
          .item,
          .item .right,
          .row.item,
          .row.detail {
            background: transparent !important;
            color: #e5e7eb !important;
            border-color: #334155 !important;
          }
          .c-te,
          .c-te tr,
          .c-te td,
          .table.c-te,
          .table.c-te > tbody > tr > td,
          .table.c-te > tbody > tr > th {
            background: transparent !important;
            color: #e5e7eb !important;
            border-color: #334155 !important;
          }
          .boder-none,
          input.boder-none {
            background: transparent !important;
            color: #e5e7eb !important;
            border: none !important;
            box-shadow: none !important;
          }
          #city {
            background: #0f172a !important;
            color: #e5e7eb !important;
            border: 1px solid #475569 !important;
          }
          h1, h2, h3, h4, h5, h6,
          p, span, div, li, dt, dd, td, th, label, strong, small,
          a:not(.btn) {
            color: #e5e7eb !important;
          }
          a,
          .breadcrumb > li + li:before,
          .list-group-item a,
          .panel-title,
          .nav > li > a,
          .navbar-brand {
            color: #7dd3fc !important;
          }
          .panel-heading,
          .navbar,
          .navbar-default,
          .btn-success,
          .btn-primary,
          .label,
          .badge,
          [class*="header"] {
            background: #1f6feb !important;
            color: #f8fafc !important;
            border-color: #2563eb !important;
          }
          p.title,
          .title {
            background: #172033 !important;
            color: #e5e7eb !important;
            border-left: 3px solid #38bdf8 !important;
            border-bottom: 1px solid #334155 !important;
          }
          p.title b,
          .title b {
            color: #f8fafc !important;
          }
          .btn,
          button,
          input,
          select,
          textarea {
            background: #0f172a !important;
            color: #e5e7eb !important;
            border-color: #475569 !important;
          }
          input::placeholder,
          textarea::placeholder {
            color: #94a3b8 !important;
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
            border-color: #334155 !important;
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
            background: #111827 !important;
            color: #cbd5e1 !important;
            border-color: #334155 !important;
          }
          #all-c {
            background: #111827 !important;
            border-top: 1px solid #334155 !important;
          }
          #all-c .all-c-t,
          #all-c p,
          #all-c a {
            color: #e5e7eb !important;
          }
          #all-c .all-c-t {
            background: #111827 !important;
            color: #e5e7eb !important;
            border-bottom: 1px solid #334155 !important;
          }
          #all-c a:hover {
            color: #7dd3fc !important;
          }
          h2.text-center,
          h3.text-center,
          h4.text-center,
          .text-center {
            color: #e5e7eb !important;
          }
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
    },
    {
      name: 'greasyfork.org-hide-bottom-ads',
      match() {
        return location.hostname === 'greasyfork.org';
      },
      run() {
        const styleId = 'fusion-toolbox-greasyfork-hide-bottom-ads';
        const hideSelectors = [
          'ins.adsbygoogle',
          'iframe[id^="google_ads_iframe"]',
          'iframe[src*="googlesyndication"]',
          'iframe[src*="doubleclick"]',
          '[id^="google_ads_iframe"]',
          '[class*="adsbygoogle"]',
        ];
        const removeSelectors = [
          '[class*="ad-container"]',
          '[class*="ad-slot"]',
          '[class*="advert"]',
          '[data-ad-client]',
          '[data-ad-slot]',
        ];

        Utils.addStyle(
          styleId,
          `${hideSelectors.join(',\n')} {
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
            min-height: 0 !important;
            max-height: 0 !important;
          }
          ${removeSelectors.join(',\n')} {
            display: none !important;
          }`
        );

        const hide = (root = document) => {
          Utils.hideSelectors(hideSelectors, root);
          Utils.removeSelectors(removeSelectors, root);
        };

        Utils.onReady(() => {
          hide();

          Utils.observeAddedNodes((node) => {
            if (node.matches?.([...hideSelectors, ...removeSelectors].join(','))) {
              hide(node.parentElement || document);
              return;
            }

            hide(node);
          });
        });
      },
    },
    // Site module template:
    // 1. Copy this block.
    // 2. Replace name / match / run.
    // 3. Add the site's @match rule to the userscript header.
    {
      name: 'github.com-template',
      match() {
        return location.hostname === 'github.com';
      },
      run() {
        // Example:
        // Utils.addStyle('fusion-toolbox-github-demo', '.AppHeader { outline: 1px solid red !important; }');
      },
    },
    {
      name: 'example.com-template',
      match() {
        return location.hostname === 'example.com';
      },
      run() {
        // Copy this module and replace the site-specific logic.
      },
    },
  ];

  for (const module of modules) {
    if (module.match()) {
      module.run();
    }
  }
})();
