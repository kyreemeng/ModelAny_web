import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const projectFile = (path) => readFile(new URL(path, root), 'utf8');

test('English and Chinese homepages are separate, self-canonical language documents', async () => {
  const [english, chinese] = await Promise.all([
    projectFile('index.html'),
    projectFile('zh/index.html'),
  ]);

  assert.match(english, /<html lang="en">/);
  assert.match(chinese, /<html lang="zh-CN">/);
  assert.match(english, /hreflang="zh-CN" href="https:\/\/modelany\.app\/zh\/"/);
  assert.match(chinese, /hreflang="en" href="https:\/\/modelany\.app\/"/);
  assert.match(chinese, /<link rel="canonical" href="https:\/\/modelany\.app\/zh\/">/);
  assert.match(english, /data-locale-switch="zh"/);
  assert.match(chinese, /data-locale-switch="en"/);
});

test('locale middleware preserves explicit locales and avoids bots', async () => {
  const middleware = await projectFile('middleware.js');

  assert.match(middleware, /x-vercel-ip-country/);
  assert.match(middleware, /accept-language/);
  assert.match(middleware, /modelany_locale/);
  assert.match(middleware, /Googlebot/);
  assert.match(middleware, /url\.pathname !== '\/'/);
});

test('English homepage has no mixed Chinese body copy', async () => {
  const english = await projectFile('index.html');
  const chinese = [...english.matchAll(/[\u4e00-\u9fff]+/g)].map((match) => match[0]);
  assert.deepEqual([...new Set(chinese)], ['中文']);
  assert.doesNotMatch(english, /class="[^"]*-zh"/);
});

test('Chinese homepage mirrors English structure with localized chrome', async () => {
  const chinese = await projectFile('zh/index.html');
  assert.match(chinese, /class="hero-visual"/);
  assert.match(chinese, /id="orbit-container"/);
  assert.match(chinese, /href="\.\.\/styles\.css"/);
  assert.match(chinese, /data-locale-switch="en"/);
  assert.doesNotMatch(chinese, />How it works</);
  assert.doesNotMatch(chinese, />Features</);
});

test('Chinese homepage compare links stay on Chinese routes', async () => {
  const chinese = await projectFile('zh/index.html');
  assert.match(chinese, /href="\/zh\/compare\//);
  assert.match(chinese, /href="\/zh\/benchmarks\//);
  assert.doesNotMatch(chinese, /href="\/compare\/chatgpt-vs-/);
  assert.doesNotMatch(chinese, /href="\/best-for\//);
  assert.doesNotMatch(chinese, /href="\/compare\/"/);
});

test('locale switch normalizes language codes for aria-current', async () => {
  const locale = await projectFile('locale.js');
  assert.match(locale, /normalizeLang/);
  assert.match(locale, /startsWith\('zh'\)/);
});
