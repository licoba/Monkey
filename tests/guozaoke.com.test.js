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
  let themeCss;
  vm.runInNewContext(`(${source})`, {
    document: { documentElement: {}, querySelectorAll: () => [existing] },
    setInterval: () => {},
    Utils: { addStyle: (id, text) => {
      if (id.endsWith('hide-avatars')) avatarCss = text;
      else if (id.endsWith('reading-theme')) themeCss = text;
      else css = text;
    } },
    MutationObserver: class {
      constructor(fn) { callback = fn; }
      observe(_root, config) { options = config; }
    },
  }).run();
  assert.equal(existing.style.getPropertyValue('display'), 'none');
  assert.ok(themeCss.includes('--ft-gzk-line: rgba(220, 228, 240, .08)'));
  assert.ok(themeCss.includes('html body .topic-tags .tag-badge'));
  assert.ok(themeCss.includes('html body .hot-topics .title { border-bottom: 0 !important; }'));
  assert.ok(themeCss.includes(':focus-visible'));
  assert.ok(themeCss.includes('@media (max-width: 767px)'));
  assert.ok(themeCss.includes('--ft-gzk-gap-sm: 8px'));
  assert.ok(themeCss.includes('--ft-gzk-gap-md: 16px'));
  assert.ok(themeCss.includes('--ft-gzk-gap-lg: 24px'));
  assert.ok(themeCss.includes('padding-right: 40px !important'));
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

test('hides shadow privacy footers mounted late and watches their internal updates', () => {
  const observers = new Map();
  let poll;
  let writes = 0;
  let display = 'block';
  let hasButton = false;
  const footer = {
    matches: (selector) => hasButton && selector.includes('.ipr-container:has(> .ipr-button)'),
    closest(selector) { return this.matches(selector) ? this : null; },
    querySelectorAll: () => [],
    style: {
      getPropertyValue: () => display,
      getPropertyPriority: () => 'important',
      setProperty: (_name, value) => { display = value; writes++; },
    },
  };
  const root = {
    querySelectorAll: (selector) => selector === '*' || footer.matches(selector) ? [footer] : [],
  };
  const host = {};
  const page = {
    documentElement: {},
    querySelectorAll: (selector) => selector === '*' || selector === 'body > .container > div' ? [host] : [],
  };
  vm.runInNewContext(`(${source})`, {
    document: page,
    Utils: { addStyle() {} },
    setInterval: (fn) => { poll = fn; },
    MutationObserver: class {
      constructor(fn) { this.callback = fn; }
      observe(target) { observers.set(target, this.callback); }
    },
  }).run();

  // No DOM mutation occurs when a pre-existing host gets an open shadow root.
  host.shadowRoot = root;
  poll();
  assert.ok(observers.has(root));
  assert.equal(display, 'block', 'leave unrelated shadow content alone');

  // The Google button may be inserted separately from its empty container.
  hasButton = true;
  observers.get(root)([{ type: 'childList', target: footer, addedNodes: [{ nodeType: 3 }] }]);
  assert.equal(display, 'none');
  display = 'block';
  observers.get(root)([{ type: 'attributes', target: footer }]);
  assert.equal(display, 'none', 'hide it again if the vendor restores display');
  const previousWrites = writes;
  observers.get(root)([{ type: 'attributes', target: footer }]);
  poll();
  assert.equal(writes, previousWrites, 'do not loop on our own style writes');
  assert.equal(observers.size, 2, 'observe each shadow root only once');
});
