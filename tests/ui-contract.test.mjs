import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readProjectFile(filename) {
  return readFile(new URL(filename, root), 'utf8');
}

test('primary install actions use Chrome Web Store without GitHub release downloads', async () => {
  const [html, download] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('download.js'),
  ]);
  const storeUrl = 'https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn?utm_source=item-share-cb';

  assert.ok(html.includes(storeUrl));
  assert.match(html, /data-download-cta/);
  assert.match(html, /Chrome Web Store/);
  assert.match(html, /Under review/);
  assert.match(html, /browser-icon-chrome/);
  assert.match(html, /browser-icon-edge/);
  assert.doesNotMatch(html, /github\.com\/kyreemeng\/ModelAny-Releases\/releases\/tag/);
  assert.match(download, /isChromeBrowser/);
  assert.match(download, /Chrome 商店可用|Available on Chrome Web Store/);
});

test('the interactive launcher remains available to assistive technology', async () => {
  const html = await readProjectFile('index.html');

  assert.doesNotMatch(html, /<div class="hero-visual" aria-hidden="true">/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-label="Prompt to distribute"/);
});

test('launcher validates prompts and uses the verified extension bridge with a fallback', async () => {
  const script = await readProjectFile('script.js');

  assert.match(script, /function updateLauncherCounter\(\)/);
  assert.match(script, /MAX_PROMPT_LENGTH = 5000/);
  assert.match(script, /MODELANY_LAUNCH_REQUEST/);
  assert.match(script, /crypto\.randomUUID\(\)/);
  assert.match(script, /BRIDGE_TIMEOUT_MS = 5000/);
  assert.match(script, /function showLauncherFallback\(/);
  assert.match(script, /function drawOrbitLines\(\)/);
  assert.match(script, /function playOrbitLaunchAnimation\(\)/);
  assert.doesNotMatch(script, /\.innerHTML/);
});

test('the mobile navigation supports an accessible dismissal path', async () => {
  const script = await readProjectFile('script.js');

  assert.match(script, /function closeMobileMenu\(/);
  assert.match(script, /event\.key === 'Escape'/);
  assert.match(script, /document\.body\.classList\.(add|toggle)\('menu-open'/);
});

test('orbit model icons keep circular positions and hover scaling', async () => {
  const styles = await readProjectFile('styles.css');

  assert.match(styles, /\.orbit-node-1 \{ top: 0%; left: 50%; transform: translate\(-50%, 0\); \}/);
  assert.match(styles, /\.orbit-node-3 \{ top: 50%; left: 95%; transform: translate\(-50%, -50%\); \}/);
  assert.match(styles, /\.orbit-node-7 \{ top: 50%; left: 5%; transform: translate\(-50%, -50%\); \}/);
  assert.match(styles, /\.orbit-node-1:hover \{ transform: translate\(-50%, 0\) scale\(1\.12\); \}/);
  assert.match(styles, /\.orbit-node-3:hover \{ transform: translate\(-50%, -50%\) scale\(1\.12\); \}/);
  assert.doesNotMatch(styles, /\.orbit-node-1,\s*\.orbit-node-2,\s*\.orbit-node-3,\s*\.orbit-node-4 \{ left: 12%; \}/);
});
