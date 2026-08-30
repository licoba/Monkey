const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const MODULE_PATH = path.join(__dirname, '..', 'sites', 'chatgpt.com.js');

class FakeStyle {
  constructor() {
    this.properties = new Map();
  }

  setProperty(name, value, priority) {
    this.properties.set(name, { value, priority });
  }

  get(name) {
    return this.properties.get(name)?.value;
  }
}

class FakeElement {
  constructor(tagName, { text = '', rect = {} } = {}) {
    this.tagName = tagName.toUpperCase();
    this.ownText = text;
    this.children = [];
    this.parentElement = null;
    this.ownerDocument = null;
    this.style = new FakeStyle();
    this.rect = {
      top: 0,
      left: 0,
      width: 900,
      height: 100,
      ...rect,
    };
  }

  append(...children) {
    for (const child of children) {
      child.parentElement = this;
      child.ownerDocument = this.ownerDocument;
      this.children.push(child);
      child.setOwnerDocument(this.ownerDocument);
    }
  }

  setOwnerDocument(document) {
    this.ownerDocument = document;
    for (const child of this.children) {
      child.setOwnerDocument(document);
    }
  }

  get textContent() {
    return [this.ownText, ...this.children.map((child) => child.textContent)].join('');
  }

  getBoundingClientRect() {
    return {
      ...this.rect,
      right: this.rect.left + this.rect.width,
      bottom: this.rect.top + this.rect.height,
    };
  }
}

class FakeDocument {
  constructor() {
    this.readyState = 'complete';
    this.documentElement = new FakeElement('html', {
      rect: { top: 0, width: 1440, height: 900 },
    });
    this.body = new FakeElement('body', {
      rect: { top: 0, width: 1440, height: 900 },
    });
    this.documentElement.setOwnerDocument(this);
    this.body.setOwnerDocument(this);
    this.documentElement.append(this.body);
  }

  createTreeWalker(root) {
    const textNodes = [];

    const visit = (element) => {
      if (element.ownText) {
        textNodes.push({
          nodeValue: element.ownText,
          parentElement: element,
        });
      }

      for (const child of element.children) {
        visit(child);
      }
    };

    visit(root);
    let index = 0;

    return {
      nextNode() {
        return textNodes[index++] || null;
      },
    };
  }
}

function createQuotaBanner({ top = 0, empty = false } = {}) {
  const root = new FakeElement('div', {
    rect: { top, left: 260, width: 1180, height: 100 },
  });
  const layout = new FakeElement('div', {
    rect: { top, left: 410, width: 900, height: 100 },
  });
  const content = new FakeElement('div', {
    text: empty ? '' : '开启自动充值，系统会自动补充额度，避免今后再次中断。',
    rect: { top: top + 24, left: 450, width: 700, height: 52 },
  });
  const row = new FakeElement('div', {
    rect: { top: top + 24, left: 450, width: 700, height: 28 },
  });
  const heading = new FakeElement('p', {
    text: empty ? '' : '工作区有成员达到使用上限',
    rect: { top: top + 24, left: 490, width: 216, height: 28 },
  });
  const action = new FakeElement('button', {
    text: empty ? '' : '开启自动充值',
    rect: { top: top + 30, left: 1160, width: 120, height: 40 },
  });

  row.append(heading);
  content.append(row);
  layout.append(content, action);
  root.append(layout);

  return { root, content, heading, action };
}

function runModule(document) {
  let addedNodeCallback = null;
  let mutationCallback = null;
  const context = {
    document,
    Document: FakeDocument,
    Element: FakeElement,
    NodeFilter: { SHOW_TEXT: 4 },
    location: { hostname: 'chatgpt.com' },
    window: { innerHeight: 900 },
    MutationObserver: class {
      constructor(callback) {
        mutationCallback = callback;
      }

      observe() {}
    },
    Utils: {
      onReady(callback) {
        callback();
      },
      observeAddedNodes(callback) {
        addedNodeCallback = callback;
      },
    },
  };

  const source = fs.existsSync(MODULE_PATH)
    ? fs.readFileSync(MODULE_PATH, 'utf8')
    : '{ match() { return false; }, run() {} }';
  const runnableModule = vm.runInNewContext(`(${source})`, context, {
    filename: MODULE_PATH,
  });

  assert.equal(runnableModule.match(), true);
  runnableModule.run();

  return {
    notifyAdded(node) {
      if (mutationCallback) {
        mutationCallback([{
          type: 'childList',
          target: node.parentElement || document.body,
          addedNodes: [node],
        }]);
        return;
      }

      assert.ok(addedNodeCallback, 'the module should observe dynamically added nodes');
      addedNodeCallback(node);
    },
    notifyTextChanged(element) {
      assert.ok(mutationCallback, 'the module should observe delayed text changes');
      mutationCallback([{
        type: 'characterData',
        target: { parentElement: element },
        addedNodes: [],
      }]);
    },
  };
}

test('hides the complete ChatGPT workspace quota banner', () => {
  const document = new FakeDocument();
  const { root, heading } = createQuotaBanner();
  document.body.append(root);

  runModule(document);

  assert.equal(root.style.get('display'), 'none');
  assert.equal(heading.style.get('display'), undefined);
});

test('does not hide matching conversation text away from the page top', () => {
  const document = new FakeDocument();
  const { root } = createQuotaBanner({ top: 420 });
  document.body.append(root);

  runModule(document);

  assert.equal(root.style.get('display'), undefined);
});

test('hides a quota banner added after initial page load', () => {
  const document = new FakeDocument();
  const runtime = runModule(document);
  const { root } = createQuotaBanner();
  root.setOwnerDocument(document);

  runtime.notifyAdded(root);

  assert.equal(root.style.get('display'), 'none');
});

test('hides a quota banner whose text is populated after its container is mounted', () => {
  const document = new FakeDocument();
  const { root, content, heading, action } = createQuotaBanner({ empty: true });
  document.body.append(root);
  const runtime = runModule(document);

  content.ownText = '开启自动充值，系统会自动补充额度，避免今后再次中断。';
  heading.ownText = '工作区有成员达到使用上限';
  action.ownText = '开启自动充值';
  runtime.notifyTextChanged(heading);

  assert.equal(root.style.get('display'), 'none');
});
