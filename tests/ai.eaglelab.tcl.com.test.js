const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../sites/ai.eaglelab.tcl.com.js'), 'utf8');

test('enables the theme across EagleLab routes without matching other TCL hosts', () => {
  for (const hash of ['#/assistant', '#/settings', '#/models', '#/agents']) {
    const module = vm.runInNewContext(`(${source})`, {
      location: { hostname: 'ai.eaglelab.tcl.com', hash },
    });
    assert.equal(module.match(), true);
  }
  for (const hostname of ['eaglelab.tcl.com', 'other.tcl.com', 'ai.eaglelab.tcl.com.example.org']) {
    const module = vm.runInNewContext(`(${source})`, { location: { hostname } });
    assert.equal(module.match(), false);
  }
});

test('installs its global stylesheet without reading or changing account data', () => {
  const styles = new Map();
  const module = vm.runInNewContext(`(${source})`, {
    Utils: { addStyle: (id, css) => styles.set(id, css) },
  });
  module.run();
  module.run();
  assert.equal(styles.size, 1);
  const css = [...styles.values()][0];
  assert.match(css, /--el-bg-color-overlay:/);
  assert.match(css, /--hh-main-bg-1:/);
  assert.match(css, /article \[class~='bg-white\/\[0\.4\]'\], \.think-status\s*\{\s*background: var\(--fusion-eagle-surface\) !important;/);
  assert.match(css, /article \.nuxt-icon\.svg-icon\.cursor-pointer svg \[fill\]:not\(\[fill='none'\]\)/);
  assert.match(css, /article \.nuxt-icon\.svg-icon\.cursor-pointer:hover/);
  assert.match(css, /div\[style\*='pointer-events: none'\]\[style\*='background-image:'\]\[style\*='background-repeat: repeat'\]\[style\*='print-color-adjust: exact'\]\s*\{\s*opacity: 0 !important;/);
  assert.doesNotMatch(css, /filter\s*:/);
  const header = fs.readFileSync(path.join(__dirname, '../userscript-header.txt'), 'utf8');
  assert.match(header, /^\/\/ @match\s+https:\/\/ai\.eaglelab\.tcl\.com\/\*$/m);
});
