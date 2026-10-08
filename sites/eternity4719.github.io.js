{
  name: 'howtolivebetter-hide-sidebar-ad',
  match() {
    return (
      location.hostname === 'eternity4719.github.io' &&
      location.pathname.startsWith('/HowToLiveBetter/')
    );
  },
  run() {
    Utils.addStyle(
      'fusion-toolbox-howtolivebetter-hide-sidebar-ad',
      '#sidebar > .group.ad { display: none !important; }'
    );
  },
}
