{
  name: 'linux.do-lightweight-enhancements',
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

      #global-notice-alert-global-notice:has(a[href="/guidelines"]) {
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

    const normalizeText = (value) => value.replace(/\s+/g, ' ').trim();

    const hideElement = (element) => {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('pointer-events', 'none', 'important');
      element.style.setProperty('min-height', '0', 'important');
      element.style.setProperty('max-height', '0', 'important');
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
      hideBlockedTopics();

      Utils.observeAddedNodes((node) => {
        removeSiteLogo(node);
        hideBlockedTopics(node);
      });
    });
  },
}
