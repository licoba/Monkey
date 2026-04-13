{
  name: 'linshiyouxiang.net-hide-bottom-ads',
  match() {
    return location.hostname === 'www.linshiyouxiang.net';
  },
  run() {
    const styleId = 'fusion-toolbox-linshiyouxiang-hide-bottom-ads';
    const hideSelectors = [
      'ins.adsbygoogle',
      'iframe[id^="google_ads_iframe"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
      '[id^="google_ads_iframe"]',
      '[class*="adsbygoogle"]',
    ];
    const removeSelectors = [
      '.site-description',
      '.px-2.text-center',
      '.d-none.d-lg-block.col-md-3.no-padding.text-center',
      '[data-ad-client]',
      '[data-ad-slot]',
    ];
    const floatingPromoSelectors = [
      '[style*="position:fixed"][style*="bottom"][style*="right"]',
      '[style*="position: fixed"][style*="bottom"][style*="right"]',
      '[style*="position:fixed"][style*="bottom"]',
      '[style*="position: fixed"][style*="bottom"]',
    ];

    const shouldRemoveFloatingPromo = (node) => {
      if (!(node instanceof Element)) {
        return false;
      }

      const inlineStyle = (node.getAttribute('style') || '').toLowerCase();
      const computedStyle = window.getComputedStyle(node);
      const position = (computedStyle.position || '').toLowerCase();
      if (
        position !== 'fixed' &&
        !inlineStyle.includes('position:fixed') &&
        !inlineStyle.includes('position: fixed')
      ) {
        return false;
      }

      const hasBottomAnchor =
        inlineStyle.includes('bottom') ||
        (computedStyle.bottom && computedStyle.bottom !== 'auto');
      if (!hasBottomAnchor) {
        return false;
      }

      const text = (node.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      if (!text) {
        return false;
      }

      return (
        (text.includes('电子邮件') && text.includes('即时消息')) ||
        (text.includes('email') && text.includes('message')) ||
        text.includes('数据恢复服务')
      );
    };

    Utils.addStyle(
      styleId,
      `:root {
        color-scheme: dark;
      }
      html,
      body {
        background: #0b1220 !important;
        color: #dbe4ee !important;
      }
      body,
      #top,
      #main,
      #foot,
      .container,
      .row,
      .msglist,
      .mail,
      .mail-info,
      .mail-content,
      .history-list,
      .modal-content,
      .dropdown-menu,
      .table-responsive,
      .input-group-addon,
      .form-control,
      .btn-default {
        background-color: #111827 !important;
        color: #dbe4ee !important;
        border-color: #334155 !important;
        box-shadow: none !important;
      }
      #top,
      #foot,
      .mail-info,
      .table thead th,
      .modal-header,
      .modal-footer {
        background: #0f172a !important;
        color: #e5edf6 !important;
        border-color: #334155 !important;
      }
      #main .msglist,
      #main .history-list,
      .content .mail-info,
      .content .mail-content,
      .table-responsive {
        background: #111827 !important;
        border: 1px solid #334155 !important;
      }
      #main .table-striped > tbody > tr:nth-of-type(2n),
      .table-striped > tbody > tr:nth-of-type(2n),
      .table-hover > tbody > tr:hover,
      .dropdown-menu > li > a:hover,
      .dropdown-item:hover {
        background: #172033 !important;
        color: #f8fafc !important;
      }
      #main .table-striped > tbody > tr:nth-of-type(2n+1),
      .table-striped > tbody > tr:nth-of-type(2n+1),
      table.table tbody tr,
      table.table tbody td {
        background: #111827 !important;
        color: #dbe4ee !important;
        border-color: #243041 !important;
      }
      a,
      .dropdown-menu > li > a,
      .dropdown-item,
      .state li a,
      #message-list a,
      .content .mail-top ul li a {
        color: #7dd3fc !important;
      }
      a:hover,
      .dropdown-menu > li > a:hover,
      .dropdown-item:hover,
      .state li a:hover,
      #message-list a:hover,
      .content .mail-top ul li a:hover {
        color: #f59e0b !important;
      }
      .text-muted,
      .description,
      .receiveTime,
      .tooltip-inner,
      .msglist form label,
      input::placeholder {
        color: #94a3b8 !important;
      }
      #no-emails-row,
      #loading-row,
      #gmail-loading-row,
      #no-emails-row td,
      #loading-row td,
      #gmail-loading-row td,
      #no-emails-text,
      #check-tip,
      #check-tip-text,
      .text-black-50,
      .bg-white {
        background: #111827 !important;
        color: #cbd5e1 !important;
        border-color: #243041 !important;
      }
      #top .active-mail .input-group input,
      #active-mail,
      input,
      textarea,
      select {
        background: #0f172a !important;
        color: #e5edf6 !important;
        border-color: #334155 !important;
      }
      .input-group-addon,
      .btn.dropdown-toggle,
      .btn-default,
      button,
      .modal-content .btn {
        background: #1e293b !important;
        color: #e5edf6 !important;
        border-color: #475569 !important;
      }
      .left-side li,
      #main .left-side li a {
        background: #1b3146 !important;
        border-color: #24364d !important;
        color: #d8e4f0 !important;
      }
      #main .left-side li a:hover {
        background: #223a52 !important;
        color: #f8fafc !important;
      }
      .badge,
      .open,
      .btn.btn-orange.active,
      .btn.btn-orange:active,
      .btn.btn-orange:focus,
      .btn.btn-orange:hover {
        background: #0ea5e9 !important;
        color: #eff6ff !important;
        border-color: #0284c7 !important;
      }
      .btn.btn-orange,
      .btn.btn-orange .fa {
        color: #7dd3fc !important;
        border-color: #0369a1 !important;
        background: #082f49 !important;
      }
      .tooltip.bottom .tooltip-arrow {
        border-bottom-color: #1e293b !important;
      }
      .tooltip.bs-tooltip-right .tooltip-inner,
      #top .active-mail .tooltip-inner {
        background: #1e293b !important;
        color: #e5edf6 !important;
      }
      ${hideSelectors.join(',\n')} {
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

      const candidates = [];
      if (root instanceof Element) {
        candidates.push(root);
      }
      for (const selector of floatingPromoSelectors) {
        candidates.push(...root.querySelectorAll(selector));
      }
      candidates.push(...document.body.querySelectorAll('div, section, aside, a, button'));
      for (const node of candidates) {
        if (shouldRemoveFloatingPromo(node)) {
          node.style.setProperty('display', 'none', 'important');
        }
      }
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
}
