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

test('keeps attachment metadata and conversation badges legible on dark surfaces', () => {
  const { module, styles } = runModule();
  module.run();
  const rules = [...styles[0].cssText.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  for (const [selectors, color] of [
    [['.mail-detail-attaches .attaches-total', '.mail-detail-attach-card .attach-name-wrap',
      '.mail-detail-attach-card .name-wrap', '.mail-detail-attach-card .attach-name',
      '.mail-detail-attach-card .attach-suffix'], 'text'],
    [['.mail-detail-attach-card .attach-size', '.mail-detail-attach-card .attach-size-num',
      '.mail-detail-subject .session-count', '.mail-session-count', '.gg-unread-count'], 'muted'],
  ]) {
    for (const selector of selectors) {
      assert.ok(rules.some(([, targets, body]) =>
        targets.split(',').map(s => s.trim()).includes(selector) &&
        body.includes(`color: var(--fusion-qqmail-${color}) !important;`)), selector);
    }
  }
  const luminance = hex => {
    const rgb = hex.match(/\w\w/g).map(v => parseInt(v, 16) / 255)
      .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const palette = Object.fromEntries([...styles[0].cssText.matchAll(/--fusion-qqmail-([\w-]+): #([\da-f]{6});/g)]
    .map(([, name, hex]) => [name, luminance(hex)]));
  for (const foreground of ['text', 'muted']) {
    for (const background of ['bg', 'panel', 'panel-raised', 'hover']) {
      assert.ok((palette[foreground] + 0.05) / (palette[background] + 0.05) >= 4.5,
        `${foreground} on ${background} must meet WCAG AA text contrast`);
    }
  }
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
  assert.match(styles[0].cssText, /\.xmail-ui-dialog \.ui-dialog-body/);
  assert.match(styles[0].cssText, /\.xmail-ui-dialog \.ui-dialog-header/);
  assert.match(styles[0].cssText, /\.xmail-ui-dialog \.ui-dialog-content/);
  assert.match(styles[0].cssText, /\.xmail-ui-dialog \.ui-dialog-footer/);
  assert.match(styles[0].cssText, /\[contenteditable='true'\]/);
  assert.match(styles[0].cssText, /\.mail-detail-alert-bar/);
  assert.match(styles[0].cssText, /\.mail-list-page-items-notice-bar \.notice-bar-body/);
  assert.match(styles[0].cssText, /body\.page-color-theme .* \.frame-sidebar-compose-btn:hover/);
  assert.match(styles[0].cssText, /\.frame-sidebar-compose-btn::before/);
  assert.match(styles[0].cssText, /box-shadow: inset 0 0 0 100vmax/);
  assert.match(styles[0].cssText, /background-image: none !important/);
  assert.match(styles[0].cssText, /\.qmbox \[style\*='color: black' i\]/);
  assert.match(styles[0].cssText, /\.qmbox > div\[style\*='font-family: -apple-system, system-ui'\]/);
  for (const directoryId of ['1003', '1004', '1006', '1007']) {
    assert.match(styles[0].cssText, new RegExp(`data-sidebar-dir-id='${directoryId}'`));
  }
  assert.match(styles[0].cssText, /\*:focus-visible/);
});
