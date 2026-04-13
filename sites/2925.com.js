{
  name: '2925.com-hide-ads',
  match() {
    return location.hostname === '2925.com';
  },
  run() {
    const styleId = 'fusion-toolbox-2925-hide-ads';
    const removeSelectors = [
      '.adv-container',
      '.left-adv',
      '.index-adv',
    ];

    Utils.addStyle(
      styleId,
      `${removeSelectors.join(',\n')} {
        display: none !important;
      }`
    );

    const hide = (root = document) => {
      Utils.removeSelectors(removeSelectors, root);
    };

    Utils.onReady(() => {
      hide();

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
