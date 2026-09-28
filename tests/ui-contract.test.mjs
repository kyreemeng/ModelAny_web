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
  assert.match(html, /microsoftedge\.microsoft\.com\/addons\/detail\/lfeckjibcfbjfdlepidpmnalpfimhdli/);
  assert.match(html, /browser-icon-chrome/);
  assert.match(html, /browser-icon-edge/);
  assert.doesNotMatch(html, /github\.com\/kyreemeng\/ModelAny-Releases\/releases\/tag/);
  assert.match(download, /isChromeBrowser/);
  assert.match(download, /isEdgeBrowser/);
  assert.match(download, /microsoftedge\.microsoft\.com\/addons\/detail\/lfeckjibcfbjfdlepidpmnalpfimhdli/);
});

test('the interactive launcher remains available to assistive technology', async () => {
  const html = await readProjectFile('index.html');

  assert.doesNotMatch(html, /<div class="hero-visual" aria-hidden="true">/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-label="Prompt to distribute"/);
  assert.match(html, /id="launcher-chips"/);
  assert.match(html, /data-model="claude"/);
  assert.match(html, /data-model="grok"/);
  assert.match(html, /data-model="yuanbao"/);
});

test('launcher validates prompts and uses the verified extension bridge with a fallback', async () => {
  const script = await readProjectFile('script.js');

  assert.match(script, /function updateLauncherCounter\(\)/);
  assert.match(script, /MAX_PROMPT_LENGTH = 5000/);
  assert.match(script, /MODELANY_LAUNCH_REQUEST/);
  assert.match(script, /crypto\.randomUUID\(\)/);
  assert.match(script, /BRIDGE_TIMEOUT_MS = 5000/);
  assert.match(script, /function showLauncherFallback\(/);
  assert.match(script, /id: 'claude'/);
  assert.match(script, /id: 'yuanbao'/);
  assert.doesNotMatch(script, /\.innerHTML/);
});

test('the mobile navigation supports an accessible dismissal path', async () => {
  const script = await readProjectFile('script.js');

  assert.match(script, /function closeMobileMenu\(/);
  assert.match(script, /event\.key === 'Escape'/);
  assert.match(script, /document\.body\.classList\.(add|toggle)\('menu-open'/);
});

test('homepage chrome and product sections use the v2 design system', async () => {
  const [html, styles] = await Promise.all([
    readProjectFile('index.html'),
    readProjectFile('styles.css'),
  ]);

  assert.match(html, /chrome:header:start/);
  assert.match(html, /chrome:footer:start/);
  assert.match(html, /softwareVersion": "2\.0\.0"/);
  assert.match(html, /id="features"/);
  assert.match(html, /id="install"/);
  assert.match(styles, /--signal:/);
  assert.match(styles, /\.launcher-card/);
  assert.match(styles, /\.bento/);
  assert.match(styles, /\.privacy-panel/);
});
