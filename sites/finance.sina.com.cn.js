{
  name: 'finance.sina.com.cn-hide-ads',
  match() {
    return location.hostname === 'finance.sina.com.cn';
  },
  run() {
    const styleId = 'fusion-toolbox-finance-sina-hide-ads';
    const removeSelectors = [
      'ins.sinaads',
      '[data-ad-pdps]',
      '[data-ad-client]',
      '[data-ad-slot]',
      '#sinaads-script',
      '#left_hzh_ad',
      '#last_ad_wrap',
      '#last_side_ad',
      '#PublicRelation2',
      '#PublicRelation3',
      '#PublicRelation6',
      '#PublicRelation8',
      '#left_focus_ad',
      '#pl_sideAd',
      '#pradc1',
      '#pradc2',
      '#pradc3',
      '#pradc4',
      '#pradc5',
      '#pradc6',
      '#pradc7',
      '#pradc8',
      '#pradc9',
      '#pradc10',
      '#pradc11',
      '.tb-left.auto_switch',
      '.cj-r-qr',
      '.blk-zcapp',
      '.blk-wxfollow',
      '.tab_related_app_imglink',
      '.tab_related_app_imglink1',
      '.page-right-bar .zc-app-btn',
      '.tool-icon .fapp',
      '.side-btns-answer2022',
      '#heimaogif',
      '#tab_related',
      '.blk-related',
      '.page-right-bar .btn-home',
      '.page-right-bar .btn-audio',
      '.page-right-bar .btn-related',
      '[data-sudaclick="right_discovery_p"]',
      '[data-sudaclick="right_scientist_p"]',
      '[data-sudaclick="right_apple_p"]',
      '[data-sudaclick="right_zhongce_p"]',
      '[data-sudaclick="right_zt_p"]',
      '[data-sudaclick="right_weibo_p"]',
      '.top-ad',
      '.right-side-ad',
      '.ad.high-ad',
      'div.ad[id^="pradc"]',
      'script[src*="/sinaads/"]',
      'script[src*="/litong/zhitou/"]',
      'script[src*="/d1images/button/rotator.js"]',
      'script[src*="/finance/blackcat/pc/bcat.js"]',
      'script[src*="pluto.sina.cn/gk/match"]',
      'script[id="ttzz"]',
      'script[src*="bytegoofy.com/goofy/ttzz/push.js"]',
    ];

    const selectorText = removeSelectors.join(',\n');

    const disableSinaAdsQueue = () => {
      const sink = {
        push() {
          return 0;
        },
      };

      try {
        window.sinaads = sink;
      } catch (error) {
        // Ignore pages that make the property non-writable.
      }
    };

    const hideEmptyAdParent = (node) => {
      if (!(node instanceof Element)) {
        return;
      }

      const parent = node.parentElement;

      if (!parent || parent === document.body || parent === document.documentElement) {
        return;
      }

      if (
        parent.matches?.('.top-ad, .right-side-ad, .ad, [id*="ad"], [id*="Ad"]') &&
        !parent.textContent.trim()
      ) {
        parent.style.setProperty('display', 'none', 'important');
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

    const getPromotionalContainer = (node) => {
      let current = node;
      let fallback = node;

      while (current && current !== document.body && current !== document.documentElement) {
        if (
          current.matches?.(
            [
              '.tb-left',
              '.auto_switch',
              '.cj-r-qr',
              '.blk-zcapp',
              '.blk-wxfollow',
              '.tab_related_app_imglink',
              '.page-right-bar .zc-app-btn',
              '.right-bar-btn',
              '.ad',
              '[id*="ad"]',
              '[id*="Ad"]',
            ].join(',')
          )
        ) {
          return current;
        }

        const rect = current.getBoundingClientRect();
        const isFloatingPromo =
          getComputedStyle(current).position === 'fixed' &&
          rect.width >= 80 &&
          rect.height >= 80;
        const isBannerLike = rect.width >= 500 && rect.height >= 60 && rect.top < 260;

        fallback = current;

        if (isFloatingPromo || isBannerLike) {
          return current;
        }

        current = current.parentElement;
      }

      return fallback;
    };

    const hide = (root = document) => {
      const targetRoot = root instanceof Document ? root : root.ownerDocument || document;

      for (const node of targetRoot.querySelectorAll(selectorText)) {
        hideEmptyAdParent(node);
        hideElement(node);
      }
    };

    disableSinaAdsQueue();
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
      disableSinaAdsQueue();
      hide();

      Utils.observeAddedNodes((node) => {
        disableSinaAdsQueue();

        if (node.matches?.(selectorText)) {
          hideEmptyAdParent(node);
          hideElement(node);
          return;
        }

        hide(node);
      });
    });
  },
}
