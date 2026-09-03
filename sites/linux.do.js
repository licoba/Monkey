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
      }

      .d-header #site-logo,
      .d-header img.logo-big,
      .d-header img.logo-small,
      .d-header img.logo-mobile {
        display: none !important;
      }

      .d-header .title > a::after,
      .d-header .title a[href="/"]::after {
        content: 'LINUX DO';
        color: var(--primary) !important;
        font-size: 1.15rem;
        font-weight: 700;
        letter-spacing: 0;
        white-space: nowrap;
      }`
    );

    const bannerTextPattern = /真诚[、,，]\s*友善[、,，]\s*团结[、,，]\s*专业[，,]\s*共建你我引以为荣之社区[。!！]?|Where possible begins/i;
    const externalLinkDialogPattern = /打开外部链接|external link/i;
    const blockedTopicTitlePattern = /鹈鹕|女装/;
    const siteLogoSelector = [
      '.d-header #site-logo',
      '.d-header img.logo-big',
      '.d-header img.logo-small',
      '.d-header img.logo-mobile',
    ].join(',');
    const topicContainerSelector = [
      'tr.topic-list-item',
      '.latest-topic-list-item',
      '.search-result-topic',
      '.fps-result',
      '.topic-list-item',
    ].join(',');
    const topicTitleSelector = [
      'a.title',
      '.link-top-line a[href*="/t/"]',
      '.main-link a[href*="/t/"]',
      '.topic-title a[href*="/t/"]',
    ].join(',');
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

    const hideBlockedTopics = (root = document) => {
      const containers = [];

      if (root instanceof Element && root.matches(topicContainerSelector)) {
        containers.push(root);
      }

      containers.push(...root.querySelectorAll(topicContainerSelector));

      for (const container of containers) {
        const title = container.querySelector(topicTitleSelector);

        if (title && blockedTopicTitlePattern.test(normalizeText(title.textContent || ''))) {
          hideElement(container);
        }
      }
    };

    const removeSiteLogo = (root = document) => {
      const logos = [];

      if (root.matches?.(siteLogoSelector)) {
        logos.push(root);
      }

      logos.push(...(root.querySelectorAll?.(siteLogoSelector) || []));

      for (const logo of logos) {
        logo.remove();
      }
    };

    Utils.onReady(() => {
      document.addEventListener('click', openExternalLinkDirectly, true);
      removeSiteLogo();
      hideSloganBanner();
      hideBlockedTopics();
      autoContinueExternalLinkDialog();

      Utils.observeAddedNodes((node) => {
        removeSiteLogo(node);
        hideSloganBanner(node);
        hideBlockedTopics(node);
        autoContinueExternalLinkDialog(node);
      });
    });
  },
}
