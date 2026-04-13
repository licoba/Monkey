{
  name: 'json.cn-hide-all-ads',
  match() {
    return location.hostname === 'www.json.cn';
  },
  run() {
    const styleId = 'fusion-toolbox-jsoncn-hide-all-ads';
    const runtimeState = {
      intervalId: null,
    };
    const removeSelectors = [
      '.show-hide-adv',
      '.wwads-cn',
      '.wwads-sticky',
      '.wwads-horizontal',
      '.wwads-vertical',
      '[class*="wwads"]',
      '[class*="wwads"][class*="sticky"]',
      'script[src*="cdn.wwads.cn/js/makemoney.js"]',
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
      'script[src*="/d/dt/"]',
      'iframe[src*="wwads"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
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

    const hideFloatingBottomAds = () => {
      for (const node of document.body?.querySelectorAll('*') || []) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }

        const style = window.getComputedStyle(node);
        if (style.position !== 'fixed') {
          continue;
        }

        const rect = node.getBoundingClientRect();
        const nearBottom = rect.bottom >= window.innerHeight - 40;
        const wideEnough = rect.width >= Math.min(window.innerWidth * 0.45, 280);
        const tallEnough = rect.height >= 72;
        const elevated = style.zIndex !== 'auto' && Number(style.zIndex || 0) >= 1;
        const likelyHandle =
          rect.width >= 40 &&
          rect.width <= 140 &&
          rect.height >= 20 &&
          rect.height <= 80 &&
          rect.bottom <= window.innerHeight &&
          rect.top >= window.innerHeight - 180;

        if ((nearBottom && wideEnough && tallEnough) || likelyHandle) {
          node.style.setProperty('display', 'none', 'important');
          node.style.setProperty('visibility', 'hidden', 'important');
          node.style.setProperty('opacity', '0', 'important');
          if (elevated) {
            node.style.setProperty('pointer-events', 'none', 'important');
          }
        }
      }
    };

    const hide = (root = document) => {
      Utils.removeSelectors(removeSelectors, root);
      hideFloatingBottomAds();
    };

    Utils.onReady(() => {
      hide();
      runtimeState.intervalId = window.setInterval(hideFloatingBottomAds, 800);

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
