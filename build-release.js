const fs = require('fs');
const path = require('path');

const root = __dirname;
const headerPath = path.join(root, 'userscript-header.txt');
const runtimePath = path.join(root, 'toolbox-runtime.js');
const outputPath = path.join(root, 'my-toolbox.user.js');

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

const header = readFile(headerPath).trimEnd();
const versionMatch = header.match(/^\/\/ @version\s+(.+)$/m);

if (!versionMatch) {
  throw new Error('Missing @version in userscript-header.txt');
}

const version = versionMatch[1].trim();
const runtime = readFile(runtimePath)
  .replace(
    /const TOOLBOX_VERSION = '[^']+';/,
    `const TOOLBOX_VERSION = '${version}';`
  )
  .trimStart();
const output = `${header}\n\n// Built from toolbox-runtime.js via build-release.js.\n${runtime}\n`;

fs.writeFileSync(outputPath, output, 'utf8');

console.log(`Built ${path.basename(outputPath)} from ${path.basename(runtimePath)}`);
