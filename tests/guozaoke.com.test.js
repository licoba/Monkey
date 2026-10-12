const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../sites/guozaoke.com.js'), 'utf8');

test('runs only on Guozaoke hosts covered by userscript metadata', () => {
  const header = fs.readFileSync(path.join(__dirname, '../userscript-header.txt'), 'utf8');
  for (const hostname of ['guozaoke.com', 'www.guozaoke.com', 'other.com', 'guozaoke.com.other.com']) {
    const expected = ['guozaoke.com', 'www.guozaoke.com'].includes(hostname);
    const module = vm.runInNewContext(`(${source})`, { location: { hostname } });
    assert.equal(module.match(), expected);
    if (expected) assert.ok(header.includes(`https://${hostname}/*`));
  }
});

test('hides existing and late ads, resists inline overrides, and avoids observer loops', () => {
  const makeElement = (isAd) => {
    const node = {
      writes: 0,
      matches: () => isAd,
      querySelectorAll: () => [],
    };
    let value = 'block';
    let priority = 'important';
    node.style = {
      getPropertyValue: () => value,
      getPropertyPriority: () => priority,
      setProperty: (_name, next, nextPriority) => {
        value = next;
        priority = nextPriority;
        node.writes++;
      },
    };
    return node;
  };
  const existing = makeElement(true);
  let callback;
  let options;
  let css;
  let avatarCss;
  vm.runInNewContext(`(${source})`, {
    document: { documentElement: {}, querySelectorAll: () => [existing] },
    Utils: { addStyle: (id, text) => {
      if (id.endsWith('hide-avatars')) avatarCss = text;
      else css = text;
    } },
    MutationObserver: class {
      constructor(fn) { callback = fn; }
      observe(_root, config) { options = config; }
    },
  }).run();
  assert.equal(existing.style.getPropertyValue('display'), 'none');
  assert.ok(avatarCss.includes('a.avatar[href^="/u/"]'));
  assert.ok(avatarCss.includes('a[href^="/u/"]:has(> img.avatar:only-child)'));
  assert.match(avatarCss, /\.topic-item > \.main,[\s\S]*\.reply-item > \.main,[\s\S]*padding-left: 0 !important/);
  assert.match(css, /\.sidebox:has\(> \.ui-content\.ad\)/);
  assert.ok(css.includes('.fc-dns-dialog:has(.fc-dns-link)'));
  assert.match(css, /data-anchor-status[\s\S]*padding-bottom: 0 !important/);
  assert.equal(options.subtree, true);
  const late = makeElement(true);
  const content = makeElement(false);
  callback([{ type: 'childList', addedNodes: [late, content, { nodeType: 3 }] }]);
  assert.equal(late.style.getPropertyValue('display'), 'none');
  assert.equal(content.writes, 0);
  late.style.setProperty('display', 'block', 'important');
  callback([{ type: 'attributes', target: late }]);
  assert.equal(late.style.getPropertyValue('display'), 'none');
  const writes = late.writes;
  callback([{ type: 'attributes', target: late }, { type: 'attributes', target: content }]);
  assert.equal(late.writes, writes);
  assert.equal(content.writes, 0);
});
