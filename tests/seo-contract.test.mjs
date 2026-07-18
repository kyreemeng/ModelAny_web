import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);

async function projectFile(path) {
  return readFile(new URL(path, root), 'utf8');
}

test('research drafts are noindex before first-party tests are recorded', async () => {
  const [comparison, useCase, sitemap] = await Promise.all([
    projectFile('compare/chatgpt-vs-deepseek/index.html'),
    projectFile('best-for/coding/index.html'),
    projectFile('sitemap.xml'),
  ]);

  assert.match(comparison, /<meta name="robots" content="noindex, follow/);
  assert.match(useCase, /<meta name="robots" content="noindex, follow/);
  assert.doesNotMatch(sitemap, /\/compare\/chatgpt-vs-deepseek\//);
});

test('generated comparison pages avoid unsupported rankings and FAQ rich-result markup', async () => {
  const html = await projectFile('compare/chatgpt-vs-deepseek/index.html');

  assert.doesNotMatch(html, /currently leads|Ranked picks|\/10|FAQPage/i);
  assert.match(html, /Official sources and verification date/);
  assert.match(html, /This page does not yet publish first-party test findings/);
});

test('reverse comparison routes are permanent Vercel redirects', async () => {
  const vercel = JSON.parse(await projectFile('vercel.json'));
  const expected = {
    '/compare/deepseek-vs-chatgpt': '/compare/chatgpt-vs-deepseek/',
    '/compare/claude-vs-chatgpt': '/compare/chatgpt-vs-claude/',
    '/compare/gemini-vs-chatgpt': '/compare/chatgpt-vs-gemini/',
  };

  for (const [source, destination] of Object.entries(expected)) {
    const redirect = vercel.redirects.find((item) => item.source === source);
    assert.deepEqual(redirect, { source, destination, permanent: true });
  }
});

test('test registry is valid JSON and starts empty', async () => {
  const registry = JSON.parse(await projectFile('seo/data/test-results.json'));
  assert.deepEqual(registry, {});
});
