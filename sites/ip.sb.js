{
  name: 'ip.sb-hide-ads',
  match() {
    return location.hostname === 'ip.sb' || location.hostname === 'www.ip.sb';
  },
  run() {
    const styleId = 'fusion-toolbox-ip-sb-hide-ads';
    const hideSelectors = [
      'ins.adsbygoogle',
      'iframe[id^="google_ads_iframe"]',
      'iframe[src*="googlesyndication"]',
      'iframe[src*="doubleclick"]',
      '[id^="google_ads_iframe"]',
      '[class*="adsbygoogle"]',
    ];
    const removeSelectors = [
      '[data-ad-client]',
      '[data-ad-slot]',
      'a[href*="sa.net"]',
      'a[href*="riven.cloud"]',
      'a[href*="crmeb"]',
      'a[href*="duomall"]',
    ];
    const affiliateTextPattern = /Riven Cloud|极云网络|优惠码\s*IPSB|广告|多商户商城|B2B2C商家入驻|CRMEB|IPv6\s*地址查询/i;
    const contentTextPattern = /IPv4 connectivity|IPv6 connectivity|Address|Hostname|ASN Organization/i;
    const footerTextPattern = /Copyright|Terms of Use|Privacy Policy|All rights reserved/i;

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

    const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

    const hideElement = (element) => {
      element.style.setProperty('display', 'none', 'important');
    };

    const findAffiliateBlock = (element) => {
      let current = element;
      let fallback = element;

      while (current && current !== document.body && current !== document.documentElement) {
        const text = normalizeText(current.textContent || '');

        if (affiliateTextPattern.test(text)) {
          if (!contentTextPattern.test(text) && text.length <= 320) {
            return current;
          }

          if (!contentTextPattern.test(text) && text.length <= 500) {
            fallback = current;
          }
        }

        current = current.parentElement;
      }

      return fallback;
    };

    const hideAffiliateClusterFromHeading = (heading) => {
      hideElement(heading);

      let sibling = heading.nextElementSibling;
      let hiddenCount = 0;

      while (sibling && hiddenCount < 4) {
        const text = normalizeText(sibling.textContent || '');

        if (contentTextPattern.test(text)) {
          break;
        }

        const next = sibling.nextElementSibling;
        hideElement(sibling);
        sibling = next;
        hiddenCount += 1;
      }
    };

    const removeAffiliateAds = (root = document) => {
      const scope = root instanceof Document ? root : root.ownerDocument || document;

      for (const link of root.querySelectorAll?.('a[href*="sa.net"], a[href*="riven.cloud"]') || []) {
        hideElement(findAffiliateBlock(link));
      }

      for (const link of root.querySelectorAll?.('a[href*="crmeb"], a[href*="duomall"]') || []) {
        hideElement(findAffiliateBlock(link));
      }

      for (const heading of scope.querySelectorAll('h1, h2, h3, h4, h5, h6, div, section, aside')) {
        const text = normalizeText(heading.textContent || '');

        if (!affiliateTextPattern.test(text)) {
          continue;
        }

        if (contentTextPattern.test(text) || footerTextPattern.test(text)) {
          continue;
        }

        const block = findAffiliateBlock(heading);
        hideElement(block);

        if (block === heading) {
          hideAffiliateClusterFromHeading(heading);
        }
      }
    };

    const removeBottomAdCards = () => {
      for (const element of document.querySelectorAll('body *')) {
        const text = normalizeText(element.textContent || '');

        if (!affiliateTextPattern.test(text) || contentTextPattern.test(text) || footerTextPattern.test(text)) {
          continue;
        }

        if (!element.querySelector('img') && !element.querySelector('svg') && text.length > 180) {
          continue;
        }

        const rect = element.getBoundingClientRect();

        if (rect.width < 180 || rect.height < 40 || rect.top < window.innerHeight * 0.45) {
          continue;
        }

        hideElement(element);
      }
    };

    const removeFloatingPromos = () => {
      for (const element of document.querySelectorAll('body *')) {
        const text = normalizeText(element.textContent || '');

        if (!affiliateTextPattern.test(text) || footerTextPattern.test(text)) {
          continue;
        }

        const style = window.getComputedStyle(element);

        if (style.position !== 'fixed' && style.position !== 'sticky') {
          continue;
        }

        const rect = element.getBoundingClientRect();

        if (rect.width < 120 || rect.height < 32 || rect.top < window.innerHeight * 0.35) {
          continue;
        }

        hideElement(element);
      }
    };

    const hide = (root = document) => {
      Utils.hideSelectors(hideSelectors, root);
      Utils.removeSelectors(removeSelectors, root);
      removeAffiliateAds(root);
      removeBottomAdCards();
      removeFloatingPromos();
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
