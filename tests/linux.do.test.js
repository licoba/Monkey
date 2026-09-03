const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const MODULE_PATH = path.join(__dirname, '..', 'sites', 'linux.do.js');

class FakeStyle {
  constructor() {
    this.properties = new Map();
  }

  setProperty(name, value) {
    this.properties.set(name, value);
  }

  get(name) {
    return this.properties.get(name);
  }
}

class FakeElement {
  constructor({ topic = false, title = null, siteLogo = false } = {}) {
    this.topic = topic;
    this.title = title;
    this.siteLogo = siteLogo;
    this.children = [];
    this.parentElement = null;
    this.ownerDocument = null;
    this.style = new FakeStyle();
    this.removed = false;
  }

  append(...children) {
    for (const child of children) {
      child.parentElement = this;
      child.setOwnerDocument(this.ownerDocument);
      this.children.push(child);
    }
  }

  setOwnerDocument(document) {
    this.ownerDocument = document;
    for (const child of this.children) {
      child.setOwnerDocument(document);
    }
  }

  matches(selector) {
    if (selector.includes('#site-logo')) {
      return this.siteLogo;
    }

    if (selector.includes('topic-list-item')) {
      return this.topic;
    }

    return false;
  }

  querySelector(selector) {
    if (selector.includes('a.title') && this.title !== null) {
      return { textContent: this.title };
    }

    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    return this.children.flatMap((child) => [
      ...(child.matches(selector) ? [child] : []),
      ...child.querySelectorAll(selector),
    ]);
  }

  remove() {
    if (this.parentElement) {
      this.parentElement.children = this.parentElement.children.filter((child) => child !== this);
    }

    this.parentElement = null;
    this.removed = true;
  }

  getBoundingClientRect() {
    return { top: 500 };
  }
}

class FakeDocument {
  constructor() {
    this.readyState = 'complete';
    this.documentElement = new FakeElement();
    this.body = new FakeElement();
    this.documentElement.setOwnerDocument(this);
    this.body.setOwnerDocument(this);
    this.documentElement.append(this.body);
  }

  addEventListener() {}

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }

  createTreeWalker() {
    return { nextNode: () => null };
  }
}

function runModule(document) {
  let addedNodeCallback = null;
  const styles = [];
  const context = {
    document,
    Document: FakeDocument,
    Element: FakeElement,
    NodeFilter: { SHOW_TEXT: 4 },
    location: { hostname: 'linux.do', href: 'https://linux.do/latest' },
    window: { innerHeight: 900 },
    Utils: {
      addStyle(_id, cssText) {
        styles.push(cssText);
      },
      onReady(callback) {
        callback();
      },
      observeAddedNodes(callback) {
        addedNodeCallback = callback;
      },
    },
  };
  const source = fs.readFileSync(MODULE_PATH, 'utf8');
  const runnableModule = vm.runInNewContext(`(${source})`, context, {
    filename: MODULE_PATH,
  });

  assert.equal(runnableModule.match(), true);
  runnableModule.run();

  return {
    styles,
    notifyAdded(node) {
      assert.ok(addedNodeCallback);
      addedNodeCallback(node);
    },
  };
}

test('hides only topic rows whose title contains 鹈鹕', () => {
  const document = new FakeDocument();
  const blocked = new FakeElement({ topic: true, title: '大家怎么看鹈鹕这个词' });
  const allowed = new FakeElement({ topic: true, title: '普通帖子标题' });
  document.body.append(blocked, allowed);

  runModule(document);

  assert.equal(blocked.style.get('display'), 'none');
  assert.equal(allowed.style.get('display'), undefined);
});

test('hides a matching topic row added by infinite scrolling', () => {
  const document = new FakeDocument();
  const runtime = runModule(document);
  const blocked = new FakeElement({ topic: true, title: '又一个鹈鹕相关标题' });
  blocked.setOwnerDocument(document);

  runtime.notifyAdded(blocked);

  assert.equal(blocked.style.get('display'), 'none');
});

test('removes the site logo and replaces it with the LINUX DO text style', () => {
  const document = new FakeDocument();
  const logo = new FakeElement({ siteLogo: true });
  document.body.append(logo);

  const runtime = runModule(document);

  assert.equal(logo.removed, true);
  assert.match(runtime.styles.join('\n'), /content: 'LINUX DO'/);
});

test('removes a site logo added after initial page load', () => {
  const document = new FakeDocument();
  const runtime = runModule(document);
  const logo = new FakeElement({ siteLogo: true });
  logo.setOwnerDocument(document);

  runtime.notifyAdded(logo);

  assert.equal(logo.removed, true);
});
