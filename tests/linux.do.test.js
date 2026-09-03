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
  constructor({ topic = false, title = null } = {}) {
    this.topic = topic;
    this.title = title;
    this.children = [];
    this.parentElement = null;
    this.ownerDocument = null;
    this.style = new FakeStyle();
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

  matches() {
    return this.topic;
  }

  querySelector() {
    return this.title === null ? null : { textContent: this.title };
  }

  querySelectorAll() {
    return this.children.flatMap((child) => [
      ...(child.topic ? [child] : []),
      ...child.querySelectorAll(),
    ]);
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

  querySelectorAll() {
    return this.body.querySelectorAll();
  }

  createTreeWalker() {
    return { nextNode: () => null };
  }
}

function runModule(document) {
  let addedNodeCallback = null;
  const context = {
    document,
    Document: FakeDocument,
    Element: FakeElement,
    NodeFilter: { SHOW_TEXT: 4 },
    location: { hostname: 'linux.do', href: 'https://linux.do/latest' },
    window: { innerHeight: 900 },
    Utils: {
      addStyle() {},
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
