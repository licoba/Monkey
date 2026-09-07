const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../sites/meiguodizhi.com.js'), 'utf8');

test('scopes the address generator theme to its existing host', () => {
  for (const [hostname, expected] of [['www.meiguodizhi.com', true], ['example.com', false]]) {
    const module = vm.runInNewContext(`(${source})`, { location: { hostname } });
    assert.equal(module.match(), expected);
  }
});

test('styles address forms and dialogs without removing the ad cleanup rules', () => {
  let css;
  let ready;
  const module = vm.runInNewContext(`(${source})`, {
    Utils: { addStyle: (_id, value) => { css = value; }, onReady: (fn) => { ready = fn; } },
  });
  module.run();
  assert.equal(typeof ready, 'function');
  assert.match(css, /background: #292a2d !important/);
  assert.match(css, /\.ui_dialog, \.modal-content, \.dropdown-menu/);
  assert.match(css, /\.btn\.btn-primary:hover/);
  assert.match(css, /#city:focus/);
  assert.match(css, /iframe\[style\*="position: fixed"\]/);
  assert.match(css, /#all-c \+ \*\s*\{\s*display: none !important/);
  assert.doesNotMatch(css, /#0b1220|#111827|filter\s*:/);
});
