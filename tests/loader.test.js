const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const LOADER_PATH = path.join(__dirname, '..', 'FusionToolBox.loader.user.js');

function createLoaderHarness() {
  const requests = [];
  const appendedScripts = [];
  const createdBlobs = [];
  const intervalCallbacks = [];
  const revisions = ['revision-1'];
  let reloadCount = 0;
  const document = {
    head: {
      appendChild(node) {
        if (node.tagName === 'SCRIPT') {
          appendedScripts.push(node.src);
          node.onload?.();
        }
      },
    },
    documentElement: {},
    createElement(tagName) {
      return {
        tagName: tagName.toUpperCase(),
        async: true,
        src: '',
        textContent: '',
        remove() {},
      };
    },
  };
  const context = {
    document,
    Blob: class {
      constructor(parts, options) {
        this.parts = parts;
        this.options = options;
        createdBlobs.push(this);
      }
    },
    URL: {
      createObjectURL() {
        return 'blob:fusion-toolbox-runtime';
      },
      revokeObjectURL() {},
    },
    location: {
      hostname: 'chatgpt.com',
      reload() {
        reloadCount += 1;
      },
    },
    setInterval(callback) {
      intervalCallbacks.push(callback);
    },
    GM_xmlhttpRequest(options) {
      requests.push(options.url);

      if (options.url.includes('FusionToolBox.runtime.js')) {
        options.onload({
          status: 200,
          responseText: 'document.__fusionToolBoxRuntimeLoaded = true;',
        });
        return;
      }

      if (options.url.includes('/revision')) {
        options.onload({
          status: 200,
          responseText: revisions.at(-1),
        });
      }
    },
  };

  return {
    appendedScripts,
    createdBlobs,
    document,
    intervalCallbacks,
    requests,
    revisions,
    get reloadCount() {
      return reloadCount;
    },
    run() {
      vm.runInNewContext(fs.readFileSync(LOADER_PATH, 'utf8'), context, {
        filename: LOADER_PATH,
      });
    },
  };
}

test('executes the fetched runtime from a CSP-allowed blob URL instead of eval', () => {
  const harness = createLoaderHarness();

  harness.run();

  assert.ok(
    harness.requests.some((url) => url.includes('/FusionToolBox.runtime.js')),
    'the loader should request the runtime through GM_xmlhttpRequest'
  );
  assert.equal(harness.createdBlobs.length, 1);
  assert.match(
    harness.createdBlobs[0].parts.join(''),
    /__fusionToolBoxRuntimeLoaded/
  );
  assert.deepEqual(harness.appendedScripts, ['blob:fusion-toolbox-runtime']);
});

test('reloads the page when the local server revision changes', () => {
  const harness = createLoaderHarness();

  harness.run();
  assert.equal(harness.intervalCallbacks.length, 1);
  assert.equal(harness.reloadCount, 0);

  harness.revisions.push('revision-2');
  harness.intervalCallbacks[0]();

  assert.equal(harness.reloadCount, 1);
});
