import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function readProjectFile(filename) {
  return readFile(new URL(filename, root), 'utf8');
}

test('all primary download actions use the published GitHub release', async () => {
  const html = await readProjectFile('index.html');
  const releaseUrl = 'https://github.com/kyreemeng/ModelAny/releases/tag/v1.0.1';

  assert.ok(html.includes(releaseUrl));
  assert.match(html, /Download v1\.0\.1 on GitHub/);
  assert.match(html, /Chrome.*Coming soon/);
  assert.match(html, /Edge.*Coming soon/);
});

test('the interactive launcher remains available to assistive technology', async () => {
  const html = await readProjectFile('index.html');

  assert.doesNotMatch(html, /<div class="hero-visual" aria-hidden="true">/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-label="Prompt to distribute"/);
});

test('launcher selection, counter, and orbit rendering have explicit state handling', async () => {
  const script = await readProjectFile('script.js');

  assert.match(script, /function updateLauncherCounter\(\)/);
  assert.match(script, /function syncOrbitNodeState\(\)/);
  assert.match(script, /orbitLines\.replaceChildren\(\)/);
  assert.doesNotMatch(script, /\.innerHTML/);
});

test('the mobile navigation supports an accessible dismissal path', async () => {
  const script = await readProjectFile('script.js');

  assert.match(script, /function closeMobileMenu\(/);
  assert.match(script, /event\.key === 'Escape'/);
  assert.match(script, /document\.body\.classList\.toggle\('menu-open'/);
});

test('every orbit node preserves its anchor transform while hovering', async () => {
  const styles = await readProjectFile('styles.css');

  for (const node of [1, 2, 3, 4, 5, 6, 7, 8]) {
    assert.match(styles, new RegExp(`\\.orbit-node-${node}:hover\\s*\\{[\\s\\S]*?translate\\(`));
  }
});
