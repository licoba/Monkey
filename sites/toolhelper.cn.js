{
  name: 'toolhelper.cn-hide-jsonformat-bottom-ad',
  match() {
    return (
      location.hostname === 'www.toolhelper.cn' &&
      location.pathname === '/JSON/JSONFormat'
    );
  },
  run() {
    const styleId = 'fusion-toolbox-toolhelper-hide-jsonformat-bottom-ad';
    const removeSelectors = [
      '#divAd',
      '#divAd script',
      '#divAd ins.adsbygoogle',
      'script[src*="pagead2.googlesyndication.com"]',
      '[data-ad-client]',
      '[data-ad-slot]',
    ];

    Utils.addStyle(
      styleId,
      `${removeSelectors.join(',\n')} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        min-height: 0 !important;
        max-height: 0 !important;
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
}
