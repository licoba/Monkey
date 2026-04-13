{
  name: 'github.com-template',
  match() {
    return location.hostname === 'github.com';
  },
  run() {
    // Example:
    // Utils.addStyle('fusion-toolbox-github-demo', '.AppHeader { outline: 1px solid red !important; }');
  },
}
