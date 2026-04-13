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
}
