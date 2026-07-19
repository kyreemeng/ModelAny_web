import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { hasSharedBenchmarkData } from '../seo/data/benchmarks.mjs';

const root = new URL('../', import.meta.url);

async function projectFile(path) {
  return readFile(new URL(path, root), 'utf8');
}

async function exists(path) {
  try {
    await access(new URL(path, root));
    return true;
  } catch {
    return false;
  }
}

test('compare pages without shared public evidence are removed and redirected', async () => {
  const vercel = JSON.parse(await projectFile('vercel.json'));
  const redirect = vercel.redirects.find((item) => item.source === '/compare/llm-benchmark/');
  assert.deepEqual(redirect, {
    source: '/compare/llm-benchmark/',
    destination: '/benchmarks/',
    permanent: true,
  });
  assert.equal(await exists('compare/llm-benchmark/index.html'), false);
  assert.equal(await exists('compare/chatgpt-vs-grok/index.html'), false);
  assert.equal(await exists('zh/compare/chinese-ai-ranking/index.html'), false);
});

test('kept compare pages embed plain-language public benchmark evidence', async () => {
  assert.equal(hasSharedBenchmarkData(['chatgpt', 'claude']), true);
  const html = await projectFile('compare/chatgpt-vs-claude/index.html');
  assert.match(html, /What public benchmarks show/);
  assert.match(html, /Exact model version/);
  assert.match(html, /Open original leaderboard/);
  assert.doesNotMatch(html, /overallScore|combinedScore|Ranked picks|currently leads/i);
  assert.match(html, /data-download-cta/);
  assert.doesNotMatch(html, /github\.com\/kyreemeng\/ModelAny-Releases\/releases\/tag/);
});

test('each benchmark table puts the higher score first', async () => {
  const html = await projectFile('compare/chatgpt-vs-claude/index.html');
  const claudeCoding = html.indexOf('<th scope="row">Claude</th>\n              <td>claude-fable-5</td>');
  const chatgptCoding = html.indexOf('<th scope="row">ChatGPT</th>\n              <td>gpt-5.6-sol-xhigh (codex-harness)</td>');

  assert.ok(claudeCoding >= 0);
  assert.ok(chatgptCoding >= 0);
  assert.ok(claudeCoding < chatgptCoding);
});

test('Chinese comparison hub is not published as a standalone page', async () => {
  const vercel = JSON.parse(await projectFile('vercel.json'));
  const redirect = vercel.redirects.find((item) => item.source === '/zh/compare/');

  assert.deepEqual(redirect, {
    source: '/zh/compare/',
    destination: '/zh/benchmarks/',
    permanent: true,
  });
  assert.equal(await exists('zh/compare/index.html'), false);
});

test('core compare pages with shared evidence are indexable; research drafts stay noindex', async () => {
  const [comparison, hub, useCase, sitemap] = await Promise.all([
    projectFile('compare/chatgpt-vs-deepseek/index.html'),
    projectFile('compare/index.html'),
    projectFile('best-for/coding/index.html'),
    projectFile('sitemap.xml'),
  ]);

  assert.doesNotMatch(comparison, /<meta name="robots" content="noindex, follow/);
  assert.doesNotMatch(hub, /<meta name="robots" content="noindex, follow/);
  assert.match(useCase, /<meta name="robots" content="noindex, follow/);
  assert.match(sitemap, /https:\/\/modelany\.app\/compare\/</);
  assert.match(sitemap, /\/compare\/chatgpt-vs-deepseek\//);
  assert.doesNotMatch(sitemap, /\/best-for\/coding\//);
  assert.match(comparison, /public benchmark/i);
});

test('generated comparison pages avoid unsupported rankings and FAQ rich-result markup', async () => {
  const html = await projectFile('compare/chatgpt-vs-deepseek/index.html');

  assert.doesNotMatch(html, /currently leads|Ranked picks|FAQPage/i);
  assert.match(html, /What public benchmarks show/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /More evidence-backed model comparisons/);
  assert.match(html, /hreflang="x-default"/);
  assert.doesNotMatch(html, /hreflang="zh-CN" href="https:\/\/modelany\.app\/zh\/benchmarks\//);
});

test('sitemap declares reciprocal language alternates only for equivalent pages', async () => {
  const sitemap = await projectFile('sitemap.xml');
  assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  assert.match(sitemap, /hreflang="zh-CN" href="https:\/\/modelany\.app\/zh\/benchmarks\/"/);
  const comparisonEntry = sitemap.match(/<url>\s*<loc>https:\/\/modelany\.app\/compare\/chatgpt-vs-deepseek\/<\/loc>[\s\S]*?<\/url>/)?.[0] || '';
  assert.doesNotMatch(comparisonEntry, /hreflang="zh-CN"/);
});

test('every sitemap page includes first-party traffic measurement', async () => {
  const sitemap = await projectFile('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>https:\/\/modelany\.app(.*?)<\/loc>/g)].map((match) => match[1]);

  for (const url of urls) {
    const path = url === '/'
      ? 'index.html'
      : url.endsWith('/')
        ? `${url.slice(1)}index.html`
        : url.slice(1);
    const html = await projectFile(path);
    assert.match(html, /G-CX4BMB7829/, `${url} should include GA4`);
    assert.match(html, /cdn\.vercel-insights\.com\/v1\/script\.js/, `${url} should include Vercel Analytics`);
  }
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
