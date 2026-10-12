{
  name: 'guozaoke-hide-ads',
  match() {
    return location.hostname === 'guozaoke.com' || location.hostname === 'www.guozaoke.com';
  },
  run() {
    Utils.addStyle(
      'fusion-toolbox-guozaoke-hide-avatars',
      `img.avatar,
      a.avatar[href^="/u/"],
      a[href^="/u/"]:has(> img.avatar:only-child) {
        display: none !important;
      }
      .topic-item > .main,
      .reply-item > .main,
      .ui-header:has(> a > img.avatar) > .main {
        padding-left: 0 !important;
      }`
    );

    const selector = [
      '.sidebox:has(> .ui-content.ad)',
      '.google-auto-placed',
      'ins.adsbygoogle',
      '.fc-dns-dialog:has(.fc-dns-link)',
    ].join(',');

    Utils.addStyle(
      'fusion-toolbox-guozaoke-hide-ads',
      `${selector} { display: none !important; }
      html:has(ins.adsbygoogle[data-anchor-status]) body {
        padding-bottom: 0 !important;
      }`
    );

    const hide = (element) => {
      // Google side rails use inline !important styles and may restore them.
      if (element.style.getPropertyValue('display') !== 'none' ||
          element.style.getPropertyPriority('display') !== 'important') {
        element.style.setProperty('display', 'none', 'important');
      }
    };
    const scan = (root) => {
      if (root.matches?.(selector)) hide(root);
      for (const element of root.querySelectorAll?.(selector) || []) hide(element);
    };

    scan(document);
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          if (mutation.target.matches(selector)) hide(mutation.target);
        } else {
          for (const node of mutation.addedNodes) scan(node);
        }
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
  },
}
