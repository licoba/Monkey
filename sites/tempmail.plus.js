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
}
