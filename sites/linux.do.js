{
  name: 'linux.do-hide-community-slogan-banner',
  match() {
    return location.hostname === 'linux.do';
  },
  run() {
    Utils.addStyle(
      'fusion-toolbox-linuxdo-hide-user-avatars',
      `img.avatar,
      img[src*="/user_avatar/"],
      img[src*="/letter_avatar/"] {
        display: none !important;
      }`
    );

    const bannerTextPattern = /真诚[、,，]\s*友善[、,，]\s*团结[、,，]\s*专业[，,]\s*共建你我引以为荣之社区[。!！]?|Where possible begins/i;
    const externalLinkDialogPattern = /打开外部链接|external link/i;
    const candidateSelectors = [
      '#banner',
      '.banner-box',
      '.custom-header-banner',
      '.custom-homepage-banner',
      '.global-notice',
      '.top-notice',
      '.alert.alert-info',
    ];

    const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

    const hideElement = (element) => {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('pointer-events', 'none', 'important');
      element.style.setProperty('min-height', '0', 'important');
      element.style.setProperty('max-height', '0', 'important');
    };

    const isNearTop = (element) => {
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.top < Math.max(window.innerHeight * 0.3, 220);
    };

    const findSloganContainer = (element) => {
      let current = element;
      let fallback = element;

      while (current && current !== document.body && current !== document.documentElement) {
        const text = normalizeText(current.textContent || '');

        if (bannerTextPattern.test(text)) {
          fallback = current;

          if (text.length <= 180 && isNearTop(current)) {
            return current;
          }
        }

        current = current.parentElement;
      }

      return fallback;
    };

    const isExternalHttpUrl = (url) => {
      return /^https?:$/.test(url.protocol) && url.hostname !== location.hostname;
    };

    const openExternalLinkDirectly = (event) => {
      const link = event.target.closest?.('a[href]');

      if (!link || event.defaultPrevented || event.button !== 0 || link.hasAttribute('download')) {
        return;
      }

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) {
        return;
      }

      let url;
      try {
        url = new URL(href, location.href);
      } catch (error) {
        return;
      }

      if (!isExternalHttpUrl(url)) {
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      if (event.metaKey || event.ctrlKey || event.shiftKey || link.target === '_blank') {
        window.open(url.href, '_blank', 'noopener,noreferrer');
        return;
      }

      window.location.href = url.href;
    };

    const autoContinueExternalLinkDialog = (root = document) => {
      const scope = root instanceof Document ? root : root.ownerDocument || document;
      const dialogs = scope.querySelectorAll(
        '.d-modal, .modal, .modal-container, .dialog, [role="dialog"]'
      );

      for (const dialog of dialogs) {
        const text = normalizeText(dialog.textContent || '');

        if (!externalLinkDialogPattern.test(text)) {
          continue;
        }

        const controls = dialog.querySelectorAll('button, a, .btn');

        for (const control of controls) {
          const controlText = normalizeText(control.textContent || '');

          if (/继续|continue/i.test(controlText)) {
            control.click();
            return;
          }
        }
      }
    };

    const hideSloganBanner = (root = document) => {
      const scope = root instanceof Document ? root : root.ownerDocument || document;

      for (const candidate of scope.querySelectorAll(candidateSelectors.join(','))) {
        const text = normalizeText(candidate.textContent || '');

        if (bannerTextPattern.test(text) && isNearTop(candidate)) {
          hideElement(candidate);
        }
      }

      const walker = scope.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let textNode = walker.nextNode();

      while (textNode) {
        const text = normalizeText(textNode.nodeValue || '');
        const parent = textNode.parentElement;

        if (!parent || !bannerTextPattern.test(text) || !isNearTop(parent)) {
          textNode = walker.nextNode();
          continue;
        }

        hideElement(findSloganContainer(parent));
        textNode = walker.nextNode();
      }
    };

    Utils.onReady(() => {
      document.addEventListener('click', openExternalLinkDirectly, true);
      hideSloganBanner();
      autoContinueExternalLinkDialog();

      Utils.observeAddedNodes((node) => {
        hideSloganBanner(node);
        autoContinueExternalLinkDialog(node);
      });
    });
  },
}
