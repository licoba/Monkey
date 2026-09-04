const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const MODULE_PATH = path.join(__dirname, '..', 'sites', 'wx.mail.qq.com.js');

function runModule(hostname = 'wx.mail.qq.com') {
  const styles = [];
  const context = {
    location: { hostname },
    Utils: {
      addStyle(id, cssText) {
        styles.push({ id, cssText });
      },
    },
  };
  const source = fs.readFileSync(MODULE_PATH, 'utf8');
  const module = vm.runInNewContext(`(${source})`, context, {
    filename: MODULE_PATH,
  });

  return { module, styles };
}

test('matches only the new QQ Mail host', () => {
  assert.equal(runModule().module.match(), true);
  assert.equal(runModule('mail.qq.com').module.match(), false);
});

test('injects a complete dark theme for QQ Mail surfaces and controls', () => {
  const { module, styles } = runModule();

  module.run();

  assert.equal(styles.length, 1);
  assert.equal(styles[0].id, 'fusion-toolbox-qqmail-dark-theme');
  assert.match(styles[0].cssText, /color-scheme: dark/);
  assert.match(styles[0].cssText, /\.frame-sidebar/);
  assert.match(styles[0].cssText, /\.mail-list-page-item/);
  assert.match(styles[0].cssText, /\[role='dialog'\]/);
  assert.match(styles[0].cssText, /\[contenteditable='true'\]/);
  assert.match(styles[0].cssText, /\.mail-detail-alert-bar/);
  assert.match(styles[0].cssText, /\.mail-list-page-items-notice-bar \.notice-bar-body/);
  assert.match(styles[0].cssText, /\.frame-sidebar-compose-btn:active/);
  assert.match(styles[0].cssText, /background-image: none !important/);
  assert.match(styles[0].cssText, /\.qmbox \[style\*='color: black' i\]/);
  assert.match(styles[0].cssText, /\.qmbox > div\[style\*='font-family: -apple-system, system-ui'\]/);
  for (const directoryId of ['1003', '1004', '1006', '1007']) {
    assert.match(styles[0].cssText, new RegExp(`data-sidebar-dir-id='${directoryId}'`));
  }
  assert.match(styles[0].cssText, /\*:focus-visible/);
});
