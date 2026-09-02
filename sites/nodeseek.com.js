{
  name: 'nodeseek.com-hide-homepage-post-avatars',
  match() {
    return location.hostname === 'www.nodeseek.com';
  },
  run() {
    Utils.addStyle(
      'fusion-toolbox-nodeseek-hide-homepage-post-avatars',
      `.post-list-item > a:has(> img.avatar-normal) {
        display: none !important;
      }

      .post-list-item > .post-list-content {
        margin-left: 0 !important;
      }

      .user-head > a:has(> img.avatar-normal) {
        display: none !important;
      }

      .nsk-panel > h4:has(+ .nsk-new-member-board),
      .nsk-new-member-board {
        display: none !important;
      }`
    );
  },
}
