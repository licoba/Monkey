{
  name: 'example.com-template',
  match() {
    return location.hostname === 'example.com';
  },
  run() {
    // Copy this module and replace the site-specific logic.
  },
}
