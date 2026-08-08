import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { hasSharedBenchmarkData } from '../seo/data/benchmarks.mjs';
import { alternativePages, bestForPages, freePages, pricingPages, productPages } from '../seo/data/pages.mjs';

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

test('core comparisons and task guides are indexable with selection content', async () => {
  const [comparison, hub, approvedGuide, guide, sitemap] = await Promise.all([
    projectFile('compare/chatgpt-vs-deepseek/index.html'),
    projectFile('compare/index.html'),
    projectFile('best-for/research/index.html'),
    projectFile('best-for/coding/index.html'),
    projectFile('sitemap.xml'),
  ]);

  assert.doesNotMatch(comparison, /<meta name="robots" content="noindex, follow/);
  assert.doesNotMatch(hub, /<meta name="robots" content="noindex, follow/);
  assert.doesNotMatch(approvedGuide, /<meta name="robots" content="noindex, follow/);
  assert.match(approvedGuide, /Selection framework/);
  assert.match(approvedGuide, /What to evaluate/);
  assert.doesNotMatch(guide, /<meta name="robots" content="noindex, follow/);
  assert.match(guide, /Validate the same task with ModelAny/);
  assert.match(sitemap, /https:\/\/www\.modelany\.app\/compare\/</);
  assert.match(sitemap, /\/compare\/chatgpt-vs-deepseek\//);
  assert.match(sitemap, /\/best-for\/research\//);
  assert.match(sitemap, /\/best-for\/coding\//);
  assert.match(comparison, /public benchmark/i);
});

test('generated comparison pages avoid unsupported rankings and FAQ rich-result markup', async () => {
  const html = await projectFile('compare/chatgpt-vs-deepseek/index.html');

  assert.doesNotMatch(html, /currently leads|Ranked picks|FAQPage/i);
  assert.match(html, /What public benchmarks show/);
  assert.match(html, /"@type":"WebPage"/);
  assert.match(html, /More evidence-backed model comparisons/);
  assert.match(html, /hreflang="x-default"/);
  assert.doesNotMatch(html, /hreflang="zh-CN" href="https:\/\/www\.modelany\.app\/zh\/benchmarks\//);
});

test('sitemap declares reciprocal language alternates only for equivalent pages', async () => {
  const sitemap = await projectFile('sitemap.xml');
  assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  assert.match(sitemap, /hreflang="zh-CN" href="https:\/\/www\.modelany\.app\/zh\/benchmarks\/"/);
  const comparisonEntry = sitemap.match(/<url>\s*<loc>https:\/\/www\.modelany\.app\/compare\/chatgpt-vs-deepseek\/<\/loc>[\s\S]*?<\/url>/)?.[0] || '';
  assert.doesNotMatch(comparisonEntry, /hreflang="zh-CN"/);
});

test('every sitemap page includes first-party traffic measurement', async () => {
  const sitemap = await projectFile('sitemap.xml');
  const urls = [...sitemap.matchAll(/<loc>https:\/\/www\.modelany\.app(.*?)<\/loc>/g)].map((match) => match[1]);

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

test('index.html permanently redirects to the canonical root URL', async () => {
  const vercel = JSON.parse(await projectFile('vercel.json'));
  const redirect = vercel.redirects.find((item) => item.source === '/index.html');

  assert.deepEqual(redirect, {
    source: '/index.html',
    destination: '/',
    permanent: true,
  });
});

test('editorial review registry only publishes complete, scoped guides', async () => {
  const registry = JSON.parse(await projectFile('seo/data/test-results.json'));
  const expected = [
    'best-for/research',
    'best-for/essays',
    'best-for/data-analysis',
    'best-for/blog-posts',
    'pricing/api-startups',
  ];

  assert.deepEqual(Object.keys(registry).sort(), expected.sort());
  for (const key of expected) {
    const review = registry[key];
    assert.equal(review.status, 'approved');
    assert.equal(review.method, 'editorial-source-review');
    assert.match(review.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(review.summary.length > 80);
    assert.ok(review.methodology.length > 100);
    assert.ok(review.criteria.length >= 3);
  }
});

test('every editorially approved guide has a self-canonical URL and current sitemap lastmod', async () => {
  const sitemap = await projectFile('sitemap.xml');
  const guides = [
    'best-for/research',
    'best-for/essays',
    'best-for/data-analysis',
    'best-for/blog-posts',
    'pricing/api-startups',
  ];

  for (const guide of guides) {
    const url = `https://www.modelany.app/${guide}/`;
    const html = await projectFile(`${guide}/index.html`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url}">`));
    assert.match(html, /<meta name="robots" content="index, follow/);
    assert.doesNotMatch(html, /research draft|Research-draft status/i);
    assert.match(sitemap, new RegExp(`<loc>${url}</loc>\\s*<lastmod>2026-07-28</lastmod>`));
  }
});

test('every registered guide and product page is indexable, unique, and uses lightweight navigation', async () => {
  const guides = [
    ...bestForPages.map((page) => ({ path: `best-for/${page.slug}/index.html`, url: `/best-for/${page.slug}/` })),
    ...alternativePages.map((page) => ({ path: `alternatives/${page.slug}/index.html`, url: `/alternatives/${page.slug}/` })),
    ...freePages.map((page) => ({ path: `free/${page.slug}/index.html`, url: `/free/${page.slug}/` })),
    ...pricingPages.map((page) => ({ path: `pricing/${page.slug}/index.html`, url: `/pricing/${page.slug}/` })),
    ...productPages.map((page) => {
      const prefix = page.pathPrefix ? `${page.pathPrefix}/` : '';
      return { path: `${prefix}${page.slug}/index.html`, url: `/${prefix}${page.slug}/` };
    }),
  ];
  const sitemap = await projectFile('sitemap.xml');
  const titles = new Set();
  const descriptions = new Set();

  for (const guide of guides) {
    const html = await projectFile(guide.path);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
    assert.ok(title, `${guide.url} should have a title`);
    assert.ok(description, `${guide.url} should have a description`);
    assert.ok(!titles.has(title), `${guide.url} should have a unique title`);
    assert.ok(!descriptions.has(description), `${guide.url} should have a unique description`);
    titles.add(title);
    descriptions.add(description);
    assert.match(html, /<meta name="robots" content="index, follow/);
    assert.doesNotMatch(html, /Research-draft status|research draft/i);
    assert.match(html, /nav\.js/);
    assert.doesNotMatch(html, /src="(?:\.\.\/)*script\.js"/);
    assert.match(sitemap, new RegExp(`<loc>https://www\\.modelany\\.app${guide.url}</loc>`));
  }
});
