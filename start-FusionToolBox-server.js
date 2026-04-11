const path = require('path');
const { spawnSync, spawn } = require('child_process');

const root = __dirname;
const baseUrl = 'http://127.0.0.1:8123';

console.log(`Starting FusionToolBox dev server in ${root}`);
console.log('Keep this window open while developing the userscript.');
console.log(`Install loader: ${baseUrl}/FusionToolBox.loader.user.js`);
console.log('Debug target: https://www.meiguodizhi.com/');

const versionCheck = spawnSync('node', ['--version'], {
  stdio: 'ignore',
  shell: process.platform === 'win32',
});

if (versionCheck.error || versionCheck.status !== 0) {
  console.error('Node.js is required for start-FusionToolBox-server.js.');
  process.exit(1);
}

const child = spawn('node', ['dev-server.js'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', () => {
  console.error('Failed to start dev-server.js.');
  process.exit(1);
});
