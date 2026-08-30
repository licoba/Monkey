{
  name: 'chatgpt.com-hide-workspace-usage-limit-banner',
  match() {
    return location.hostname === 'chatgpt.com';
  },
  run() {
    const headingPattern = /工作区有成员达到使用上限/;
    const detailPattern = /开启自动充值|系统会自动补充额度/;
    const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

    const hideElement = (element) => {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('pointer-events', 'none', 'important');
      element.style.setProperty('min-height', '0', 'important');
      element.style.setProperty('max-height', '0', 'important');
    };

    const isCompactTopBanner = (element) => {
      const rect = element.getBoundingClientRect();
      const nearTopLimit = Math.max(window.innerHeight * 0.25, 180);

      return rect.bottom > 0 && rect.top < nearTopLimit && rect.height <= 180;
    };

    const findBannerContainer = (element) => {
      let current = element;
      let banner = null;

      while (current && current !== document.body && current !== document.documentElement) {
        const text = normalizeText(current.textContent || '');

        if (text.length <= 240 && headingPattern.test(text) && detailPattern.test(text)) {
          if (isCompactTopBanner(current)) {
            banner = current;
          }
        }

        current = current.parentElement;
      }

      return banner;
    };

    const findMutationScanRoot = (element) => {
      let current = element;
      let scanRoot = element;

      while (current?.parentElement) {
        const parent = current.parentElement;
        const text = normalizeText(parent.textContent || '');

        if (
          parent === document.body ||
          parent === document.documentElement ||
          text.length > 240 ||
          !isCompactTopBanner(parent)
        ) {
          break;
        }

        scanRoot = parent;
        current = parent;
      }

      return scanRoot;
    };

    const hideWorkspaceUsageBanner = (root = document) => {
      const scanRoot = root instanceof Document ? document.body : root;
      const walker = document.createTreeWalker(scanRoot, NodeFilter.SHOW_TEXT);
      let textNode = walker.nextNode();

      while (textNode) {
        const text = normalizeText(textNode.nodeValue || '');
        const parent = textNode.parentElement;

        if (parent && headingPattern.test(text) && isCompactTopBanner(parent)) {
          const banner = findBannerContainer(parent);

          if (banner) {
            hideElement(banner);
          }
        }

        textNode = walker.nextNode();
      }
    };

    Utils.onReady(() => {
      hideWorkspaceUsageBanner();

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'characterData') {
            const parent = mutation.target.parentElement;

            if (parent && isCompactTopBanner(parent)) {
              hideWorkspaceUsageBanner(findMutationScanRoot(parent));
            }

            continue;
          }

          for (const node of mutation.addedNodes) {
            if (node instanceof Element) {
              hideWorkspaceUsageBanner(node);
              continue;
            }

            const parent = node.parentElement;

            if (parent && isCompactTopBanner(parent)) {
              hideWorkspaceUsageBanner(findMutationScanRoot(parent));
            }
          }
        }
      });

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });
  },
}
