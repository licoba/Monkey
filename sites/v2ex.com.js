{
  name: 'v2ex.com-cleanup',
  match() {
    return location.hostname === 'v2ex.com' || location.hostname === 'www.v2ex.com';
  },
  run() {
    const avatarSelectors = [
      'img.avatar',
      'img[data-uid]',
      'img[src^="https://cdn.v2ex.com/avatar/"]',
      'img[src^="https://cdn.v2ex.com/gravatar/"]',
    ];
    const avatarSelector = avatarSelectors.join(',');
    const styleId = 'fusion-toolbox-v2ex-hide-sidebar-promoted-ads';
    const sidebarAdSelectors = [
      '#Rightbar .box:has(a[href*="statistics.wlai.vip"])',
      '#Rightbar .box:has(a[href*="wlai.vip"])',
      '#Rightbar .box:has(a[href*="/ads/"])',
      '#Rightbar .box:has(a[href*="utm_source=v2ex"])',
      '#Rightbar .box:has(img[src*="ads"])',
      '#Rightbar .box:has(img[src*="ad"])',
    ];
    const promotedTextPattern = /Promoted by|^\s*PRO\s*$/i;

    const collapseAvatarOnlyCell = (cell, avatar) => {
      const link = cell?.firstElementChild;

      if (
        !cell ||
        (cell.textContent || '').trim() ||
        cell.children.length !== 1 ||
        !link?.matches('a[href^="/member/"]') ||
        link.children.length !== 1 ||
        link.firstElementChild !== avatar
      ) {
        return false;
      }

      link.remove();
      cell.removeAttribute('width');
      cell.style.setProperty('width', '0', 'important');
      cell.style.setProperty('min-width', '0', 'important');
      cell.style.setProperty('max-width', '0', 'important');
      cell.style.setProperty('padding', '0', 'important');
      return true;
    };

    const removeAvatars = (root = document) => {
      const avatars = [];

      if (root.matches?.(avatarSelector)) {
        avatars.push(root);
      }

      avatars.push(...(root.querySelectorAll?.(avatarSelector) || []));

      for (const avatar of avatars) {
        const cell = avatar.closest('td');

        if (collapseAvatarOnlyCell(cell, avatar)) {
          continue;
        }

        const link = avatar.parentElement;

        if (
          link?.matches('a[href^="/member/"]') &&
          link.children.length === 1 &&
          link.firstElementChild === avatar
        ) {
          link.remove();
          continue;
        }

        avatar.remove();
      }
    };

    const hideElement = (element) => {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('pointer-events', 'none', 'important');
      element.style.setProperty('min-height', '0', 'important');
      element.style.setProperty('max-height', '0', 'important');
    };

    const findSidebarBox = (element) => {
      return element.closest?.('#Rightbar .box') || null;
    };

    const hidePromotedBoxes = (root = document) => {
      const scope = root instanceof Document ? root : root.ownerDocument || document;

      for (const box of scope.querySelectorAll(sidebarAdSelectors.join(','))) {
        hideElement(box);
      }

      const rightbar = document.querySelector('#Rightbar');
      if (!rightbar) {
        return;
      }

      const walker = document.createTreeWalker(rightbar, NodeFilter.SHOW_TEXT);
      let textNode = walker.nextNode();

      while (textNode) {
        const text = (textNode.nodeValue || '').trim();
        const parent = textNode.parentElement;

        if (parent && promotedTextPattern.test(text)) {
          const box = findSidebarBox(parent);

          if (box) {
            hideElement(box);
          }
        }

        textNode = walker.nextNode();
      }
    };

    Utils.addStyle(
      styleId,
      `${sidebarAdSelectors.join(',\n')} {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        min-height: 0 !important;
        max-height: 0 !important;
      }`
    );

    removeAvatars();
    Utils.observeAddedNodes(removeAvatars);

    Utils.onReady(() => {
      hidePromotedBoxes();

      Utils.observeAddedNodes((node) => {
        if (node.matches?.(sidebarAdSelectors.join(','))) {
          hideElement(node);
          return;
        }

        hidePromotedBoxes(node);
      });
    });
  },
}
