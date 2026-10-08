const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../sites/eternity4719.github.io.js'), 'utf8');

test('limits ad blocking to HowToLiveBetter on its exact host', () => {
  for (const [hostname, pathname, expected] of [
    ['eternity4719.github.io', '/HowToLiveBetter/', true],
    ['eternity4719.github.io', '/HowToLiveBetter/index.html', true],
    ['eternity4719.github.io', '/OtherProject/', false],
    ['eternity4719.github.io', '/HowToLiveBetter-copy/', false],
    ['other.github.io', '/HowToLiveBetter/', false],
  ]) {
    const module = vm.runInNewContext(`(${source})`, { location: { hostname, pathname } });
    assert.equal(module.match(), expected, `${hostname}${pathname}`);
  }
  const header = fs.readFileSync(path.join(__dirname, '../userscript-header.txt'), 'utf8');
  assert.match(header, /^\/\/ @match\s+https:\/\/eternity4719\.github\.io\/HowToLiveBetter\/\*$/m);
});

test('targets only the sidebar ad group, preserving navigation and article content', () => {
  let css;
  vm.runInNewContext(`(${source})`, {
    Utils: { addStyle: (_id, value) => { css = value; } },
  }).run();
  assert.equal(css, '#sidebar > .group.ad { display: none !important; }');
});
