{
  name: 'tampermonkey.net-hide-scripts-page-ads',
  match() {
    return (
      location.hostname === 'www.tampermonkey.net' &&
      location.pathname === '/scripts.php'
    );
  },
  run() {
    const adSelectors = [
      '.row:has(> .col-12 > .searcad.incontent)',
      '.searcad',
      'ins.adsbygoogle',
      'iframe[id^="aswift_"]',
      'iframe[id^="google_ads_iframe_"]',
      'iframe[src*="googleads.g.doubleclick.net"]',
      '[id^="aswift_"][id$="_host"]',
    ];
    const adSelector = adSelectors.join(',');

    Utils.addStyle(
      'fusion-toolbox-tampermonkey-hide-scripts-page-ads',
      `.row:has(> .col-12 > .searcad.incontent),
      .searcad,
      ins.adsbygoogle,
      iframe[id^="aswift_"],
      iframe[id^="google_ads_iframe_"],
      iframe[src*="googleads.g.doubleclick.net"],
      [id^="aswift_"][id$="_host"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        width: 0 !important;
        height: 0 !important;
        min-height: 0 !important;
        max-height: 0 !important;
      }

      body.scripts {
        padding-bottom: 0 !important;
      }`
    );

    const removeAds = (root = document) => {
      if (root.matches?.(adSelector)) {
        root.remove();
      } else {
        for (const element of root.querySelectorAll?.(adSelector) || []) {
          element.remove();
        }
      }

      document.body?.style.setProperty('padding-bottom', '0', 'important');
    };

    Utils.onReady(() => {
      removeAds();
      Utils.observeAddedNodes(removeAds);
    });
  },
}
