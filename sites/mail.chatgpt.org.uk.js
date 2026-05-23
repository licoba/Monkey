{
  name: 'mail.chatgpt.org.uk-hide-ads',
  match() {
    return location.hostname === 'mail.chatgpt.org.uk';
  },
  run() {
    const styleId = 'fusion-toolbox-mail-chatgpt-org-uk-hide-ads';
    const adSelectors = [
      'ins.adsbygoogle',
      'iframe[id^="google_ads_iframe"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
      '[id^="google_ads_iframe"]',
      '[class*="adsbygoogle"]',
      '[data-ad-client]',
      '[data-ad-slot]',
      '.affiliate-banner',
      'script[src*="pagead2.googlesyndication.com"]',
      'script[src*="googlesyndication.com"]',
      'script[src*="doubleclick.net"]',
    ];

    const selectorText = adSelectors.join(',\n');

    const disableAdsQueue = () => {
      const sink = {
        push() {
          return 0;
        },
      };

      try {
        window.adsbygoogle = sink;
      } catch (error) {
        // Ignore pages that make the property non-writable.
      }
    };

    const hideElement = (node) => {
      node.style.setProperty('display', 'none', 'important');
      node.style.setProperty('visibility', 'hidden', 'important');
      node.style.setProperty('opacity', '0', 'important');
      node.style.setProperty('pointer-events', 'none', 'important');
      node.style.setProperty('min-height', '0', 'important');
      node.style.setProperty('max-height', '0', 'important');
    };

    const hide = (root = document) => {
      const scope = root instanceof Document ? root : root.ownerDocument || document;

      for (const node of scope.querySelectorAll(selectorText)) {
        hideElement(node);
      }
    };

    disableAdsQueue();
    Utils.addStyle(
      styleId,
      `${selectorText} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        min-height: 0 !important;
        max-height: 0 !important;
      }`
    );

    Utils.onReady(() => {
      disableAdsQueue();
      hide();

      Utils.observeAddedNodes((node) => {
        disableAdsQueue();

        if (node.matches?.(selectorText)) {
          hideElement(node);
          return;
        }

        hide(node);
      });
    });
  },
}
