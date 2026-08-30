const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '127.0.0.1';
const port = 8123;
const root = __dirname;
const watchedFiles = [
  'FusionToolBox.user.js',
  'FusionToolBox.loader.user.js',
  'userscript-header.txt',
  'README.md',
];
const watchedDirs = ['src', 'sites'];

const clients = new Set();
let revisionCounter = 0;
let revision = `${Date.now()}-${revisionCounter}`;

function sendReload(reason) {
  revisionCounter += 1;
  revision = `${Date.now()}-${revisionCounter}`;
  const payload = `event: reload\ndata: ${JSON.stringify({ reason, at: Date.now() })}\n\n`;
  for (const client of clients) {
    client.write(payload);
  }
}

function contentType(filePath) {
  if (filePath.endsWith('.js')) {
    return 'application/javascript; charset=utf-8';
  }

  if (filePath.endsWith('.md')) {
    return 'text/markdown; charset=utf-8';
  }

  if (filePath.endsWith('.html')) {
    return 'text/html; charset=utf-8';
  }

  return 'text/plain; charset=utf-8';
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function listSiteFiles() {
  const sitesDir = path.join(root, 'sites');
  return fs.readdirSync(sitesDir)
    .filter((name) => name.endsWith('.js') && !name.startsWith('_'))
    .sort()
    .map((name) => path.join(sitesDir, name));
}

function buildRuntime() {
  const headerPath = path.join(root, 'userscript-header.txt');
  const prefixPath = path.join(root, 'src', 'runtime-prefix.js');
  const suffixPath = path.join(root, 'src', 'runtime-suffix.js');

  const header = readText(headerPath);
  const versionMatch = header.match(/^\/\/ @version\s+(.+)$/m);
  if (!versionMatch) {
    throw new Error('userscript-header.txt 缺少 @version');
  }

  const version = versionMatch[1].trim();
  const prefix = readText(prefixPath).replace('__FUSION_TOOLBOX_VERSION__', version).trimEnd();
  const modules = listSiteFiles().map((filePath) => readText(filePath).trim());
  const suffix = readText(suffixPath).trim();

  return `${prefix}\n${modules.join(',\n')}\n${suffix}\n`;
}

function serveFile(req, res, fileName) {
  if (fileName === 'FusionToolBox.runtime.js') {
    try {
      const data = buildRuntime();
      res.writeHead(200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
      return;
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Failed to build FusionToolBox.runtime.js: ${error.message}`);
      return;
    }
  }

  const filePath = path.join(root, fileName);
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Not found: ${fileName}`);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType(filePath),
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(data);
  });
}

const devClientScript = `
(function () {
  if (window.__fusionToolBoxDevClientLoaded) {
    return;
  }
  window.__fusionToolBoxDevClientLoaded = true;

  const source = new EventSource('http://127.0.0.1:8123/events');
  source.addEventListener('reload', () => {
    window.location.reload();
  });
})();
`;

const server = http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0];

  if (requestPath === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('\n');
    clients.add(res);

    req.on('close', () => {
      clients.delete(res);
    });
    return;
  }

  if (requestPath === '/dev-client.js') {
    res.writeHead(200, {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(devClientScript);
    return;
  }

  if (requestPath === '/revision') {
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(revision);
    return;
  }

  const fileName = requestPath === '/' ? 'README.md' : requestPath.slice(1);
  serveFile(req, res, fileName);
});

for (const file of watchedFiles) {
  fs.watch(path.join(root, file), { persistent: true }, () => {
    sendReload(file);
  });
}

for (const dir of watchedDirs) {
  fs.watch(path.join(root, dir), { persistent: true }, (_eventType, fileName) => {
    sendReload(`${dir}/${fileName || ''}`);
  });
}

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}/`);
  console.log('Watching userscript files for changes...');
});
