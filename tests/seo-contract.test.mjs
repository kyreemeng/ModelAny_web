import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { hasSharedBenchmarkData } from '../seo/data/benchmarks.mjs';
import { alternativePages, bestForPages, freePages, KEPT_ALTERNATIVE_SLUGS, KEPT_BEST_FOR_SLUGS, KEPT_PRICING_SLUGS, pricingPages, productPages } from '../seo/data/pages.mjs';

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
  const sweStart = html.indexOf('<h3>SWE-bench Verified');
  assert.ok(sweStart >= 0);
  const tableSlice = html.slice(sweStart, sweStart + 2800);
  const claudeRow = tableSlice.indexOf('<th scope="row">Claude</th>');
  const chatgptRow = tableSlice.indexOf('<th scope="row">ChatGPT</th>');

  assert.ok(claudeRow >= 0);
  assert.ok(chatgptRow >= 0);
  assert.ok(claudeRow < chatgptRow);
});

test('Chinese comparison hub is published with a reciprocal hreflang pair', async () => {
  // The zh pair pages need a real in-language parent: without it every
  // /zh/compare/<pair>/ breadcrumb pointed at /zh/benchmarks/ and the EN hub
  // had no declared Chinese equivalent.
  const [hub, enHub, sitemap] = await Promise.all([
    projectFile('zh/compare/index.html'),
    projectFile('compare/index.html'),
    projectFile('sitemap.xml'),
  ]);
  const vercel = JSON.parse(await projectFile('vercel.json'));

  assert.equal(vercel.redirects.find((item) => item.source === '/zh/compare/'), undefined);
  assert.match(hub, /<link rel="canonical" href="https:\/\/www\.modelany\.app\/zh\/compare\/">/);
  assert.match(hub, /hreflang="en" href="https:\/\/www\.modelany\.app\/compare\/"/);
  assert.match(hub, /hreflang="zh-CN" href="https:\/\/www\.modelany\.app\/zh\/compare\/"/);
  assert.match(enHub, /hreflang="zh-CN" href="https:\/\/www\.modelany\.app\/zh\/compare\/"/);
  assert.match(hub, /<meta name="robots" content="index, follow/);
  assert.match(sitemap, /<loc>https:\/\/www\.modelany\.app\/zh\/compare\/<\/loc>/);

  const pair = await projectFile('zh/compare/glm-vs-chatgpt/index.html');
  assert.match(pair, /<li><a href="\/zh\/compare\/">模型对比<\/a><\/li>/, 'pair pages should link up to the zh hub');
});

test('core comparisons and task guides are indexable with selection content', async () => {
  const [comparison, hub, keptGuide, guide, sitemap] = await Promise.all([
    projectFile('compare/chatgpt-vs-deepseek/index.html'),
    projectFile('compare/index.html'),
    projectFile('best-for/academic-writing/index.html'),
    projectFile('best-for/coding/index.html'),
    projectFile('sitemap.xml'),
  ]);

  assert.doesNotMatch(comparison, /<meta name="robots" content="noindex, follow/);
  assert.doesNotMatch(hub, /<meta name="robots" content="noindex, follow/);
  assert.doesNotMatch(keptGuide, /<meta name="robots" content="noindex, follow/);
  assert.match(keptGuide, /Selection framework/);
  assert.match(keptGuide, /What to evaluate/);
  assert.doesNotMatch(guide, /<meta name="robots" content="noindex, follow/);
  assert.match(guide, /Validate the same task with ModelAny/);
  assert.match(sitemap, /https:\/\/www\.modelany\.app\/compare\/</);
  assert.match(sitemap, /\/compare\/chatgpt-vs-deepseek\//);
  assert.match(sitemap, /\/best-for\/coding\//);
  assert.match(comparison, /public benchmark/i);
});

test('best-for pages outside the kept list are noindexed and excluded from the sitemap', async () => {
  const sitemap = await projectFile('sitemap.xml');
  const withdrawn = await projectFile('best-for/research/index.html');

  assert.match(withdrawn, /<meta name="robots" content="noindex, follow/);
  assert.doesNotMatch(sitemap, /\/best-for\/research\//);
  for (const slug of ['coding', 'code-review', 'academic-writing', 'excel', 'java']) {
    const html = await projectFile(`best-for/${slug}/index.html`);
    assert.doesNotMatch(html, /<meta name="robots" content="noindex, follow/, `${slug} should stay indexable`);
    assert.match(sitemap, new RegExp(`/best-for/${slug}/`), `${slug} should be in the sitemap`);
  }
});

test('the best-for hub only links to kept pages', async () => {
  const hub = await projectFile('best-for/index.html');
  assert.match(hub, /href="\/best-for\/coding\/"/);
  assert.match(hub, /href="\/best-for\/excel\/"/);
  // java earns 172 impressions / 4 clicks in GSC and is the fifth kept guide.
  assert.match(hub, /href="\/best-for\/java\/"/);
  assert.doesNotMatch(hub, /href="\/best-for\/research\/"/);
  assert.doesNotMatch(hub, /href="\/best-for\/python\/"/);
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

test('sitemap declares reciprocal language alternates for equivalent pages', async () => {
  const sitemap = await projectFile('sitemap.xml');
  assert.match(sitemap, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  assert.match(sitemap, /hreflang="zh-CN" href="https:\/\/www\.modelany\.app\/zh\/benchmarks\/"/);
  // Compare pairs now have language-equivalent zh pages: the sitemap entries
  // must cross-link both directions and include x-default on each.
  const comparisonEntry = sitemap.match(/<url>\s*<loc>https:\/\/www\.modelany\.app\/compare\/chatgpt-vs-deepseek\/<\/loc>[\s\S]*?<\/url>/)?.[0] || '';
  assert.match(comparisonEntry, /hreflang="en" href="https:\/\/www\.modelany\.app\/compare\/chatgpt-vs-deepseek\/"/);
  assert.match(comparisonEntry, /hreflang="zh-CN" href="https:\/\/www\.modelany\.app\/zh\/compare\/chatgpt-vs-deepseek\/"/);
  assert.match(comparisonEntry, /hreflang="x-default" href="https:\/\/www\.modelany\.app\/compare\/chatgpt-vs-deepseek\/"/);
  const zhEntry = sitemap.match(/<url>\s*<loc>https:\/\/www\.modelany\.app\/zh\/compare\/chatgpt-vs-deepseek\/<\/loc>[\s\S]*?<\/url>/)?.[0] || '';
  assert.match(zhEntry, /hreflang="en" href="https:\/\/www\.modelany\.app\/compare\/chatgpt-vs-deepseek\/"/);
  assert.match(zhEntry, /hreflang="zh-CN" href="https:\/\/www\.modelany\.app\/zh\/compare\/chatgpt-vs-deepseek\/"/);
  // zh-only pairs (no EN counterpart) must stay single-language entries.
  const zhOnlyEntry = sitemap.match(/<url>\s*<loc>https:\/\/www\.modelany\.app\/zh\/compare\/qwen-vs-chatgpt\/<\/loc>[\s\S]*?<\/url>/)?.[0] || '';
  assert.doesNotMatch(zhOnlyEntry, /hreflang="en"/);
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
    assert.match(html, /analytics\.ahrefs\.com\/analytics\.js/, `${url} should include Ahrefs Analytics`);
    assert.match(html, /data-key="kcyItMUoMOGo8l17owwZQg"/, `${url} should carry the Ahrefs data key`);
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

test('every editorially approved guide keeps a self-canonical URL; withdrawn ones are noindexed', async () => {
  const sitemap = await projectFile('sitemap.xml');
  const stillPublished = ['pricing/chatgpt-vs-deepseek'];
  const withdrawn = [
    'best-for/research',
    'best-for/essays',
    'best-for/data-analysis',
    'best-for/blog-posts',
    'pricing/api-startups',
  ];

  for (const guide of stillPublished) {
    const url = `https://www.modelany.app/${guide}/`;
    const html = await projectFile(`${guide}/index.html`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${url}">`));
    assert.match(html, /<meta name="robots" content="index, follow/);
    assert.match(sitemap, new RegExp(`<loc>${url}</loc>\\s*<lastmod>\\d{4}-\\d{2}-\\d{2}</lastmod>`));
  }
  for (const guide of withdrawn) {
    const html = await projectFile(`${guide}/index.html`);
    assert.match(html, /<meta name="robots" content="noindex, follow/, `${guide} should be noindexed`);
    assert.doesNotMatch(sitemap, new RegExp(`/${guide}/`), `${guide} should be out of the sitemap`);
  }
});

test('every registered guide and product page is unique and uses lightweight navigation', async () => {
  const guides = [
    ...bestForPages.map((page) => ({
      path: `best-for/${page.slug}/index.html`,
      url: `/best-for/${page.slug}/`,
      published: KEPT_BEST_FOR_SLUGS.has(page.slug),
    })),
    ...alternativePages.map((page) => ({ path: `alternatives/${page.slug}/index.html`, url: `/alternatives/${page.slug}/`, published: KEPT_ALTERNATIVE_SLUGS.has(page.slug) })),
    ...freePages.map((page) => ({ path: `free/${page.slug}/index.html`, url: `/free/${page.slug}/`, published: true })),
    ...pricingPages.map((page) => ({ path: `pricing/${page.slug}/index.html`, url: `/pricing/${page.slug}/`, published: KEPT_PRICING_SLUGS.has(page.slug) })),
    ...productPages.map((page) => {
      const prefix = page.pathPrefix ? `${page.pathPrefix}/` : '';
      return { path: `${prefix}${page.slug}/index.html`, url: `/${prefix}${page.slug}/`, published: true };
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
    if (guide.published) {
      assert.match(html, /<meta name="robots" content="index, follow/, `${guide.url} should be indexable`);
      assert.match(sitemap, new RegExp(`<loc>https://www\\.modelany\\.app${guide.url}</loc>`));
    } else {
      assert.match(html, /<meta name="robots" content="noindex, follow/, `${guide.url} should be noindexed`);
      assert.doesNotMatch(sitemap, new RegExp(`<loc>https://www\\.modelany\\.app${guide.url}</loc>`));
    }
    assert.match(html, /script\.js/);
    assert.doesNotMatch(html, /src="(?:\.\.\/)*nav\.js"/);
  }
});

test('merged free/alternatives URLs permanently redirect and no longer exist as files', async () => {
  const vercel = JSON.parse(await projectFile('vercel.json'));
  const expected = {
    '/alternatives/chatgpt-free/': '/alternatives/free-chatgpt/',
    '/alternatives/free-chatgpt-2026/': '/alternatives/free-chatgpt/',
    '/free/chatgpt/': '/alternatives/free-chatgpt/',
    // The whole /free/ tree is folded into /alternatives/ and /pricing/ so the
    // two free-access hubs stop competing for the same intent.
    '/free/': '/alternatives/',
    '/free/ai-no-limits/': '/alternatives/free-chatgpt/',
    '/free/best-ai-chatbot/': '/alternatives/best-chatgpt/',
    '/free/best-ai-chatbot-2026/': '/alternatives/best-chatgpt/',
    '/free/best-ai-coding/': '/alternatives/chatgpt-coding/',
    '/free/ai-api/': '/pricing/cheapest-api/',
    '/free/claude/': '/alternatives/claude/',
    '/free/gemini/': '/alternatives/gemini/',
    '/free/deepseek/': '/alternatives/deepseek/',
    '/free/ai-tools-2026/': '/alternatives/',
    // The no-sign-in intent survives as its own top-level page.
    '/free/ai-no-login/': '/free-ai-no-login/',
  };

  for (const [source, destination] of Object.entries(expected)) {
    const redirect = vercel.redirects.find((item) => item.source === source);
    assert.ok(redirect, `${source} should have a redirect`);
    assert.deepEqual(redirect, { source, destination, permanent: true });
    assert.equal(await exists(`${source.slice(1)}index.html`), false, `${source} should not remain a static file`);
  }

  const merged = await projectFile('alternatives/free-chatgpt/index.html');
  assert.match(merged, /official free tier|free alternatives/i);
  // The surviving URL is the promoted no-login page, not the old /free/ hub.
  assert.equal(await exists('free/index.html'), false, '/free/ hub should not remain a static file');
  const promoted = await projectFile('free-ai-no-login/index.html');
  assert.match(promoted, /<meta name="robots" content="index, follow/);
  assert.match(promoted, /no login/i);
});

test('priority Chinese comparisons embed per-pair differences beyond the template', async () => {
  const pairs = ['glm-vs-chatgpt', 'kimi-vs-chatgpt', 'doubao-vs-chatgpt', 'glm-vs-deepseek'];
  for (const slug of pairs) {
    const html = await projectFile(`zh/compare/${slug}/index.html`);
    assert.match(html, /公开评测快照里的差异/, `${slug} should state snapshot-based differences`);
    assert.match(html, /产品与使用条件的差异/, `${slug} should state practical differences`);
    assert.match(html, /建议的同题实测任务/, `${slug} should include a same-prompt test pack`);
    assert.doesNotMatch(html, /<meta name="robots" content="noindex, follow/);
  }
});

test('new keyword-targeted product pages are published and in the sitemap', async () => {
  const sitemap = await projectFile('sitemap.xml');
  for (const slug of ['chatgpt-vs-claude-vs-gemini-same-prompt', 'chatgpt-usage-limit-workaround']) {
    const html = await projectFile(`${slug}/index.html`);
    assert.match(html, /<meta name="robots" content="index, follow/);
    assert.match(sitemap, new RegExp(`/${slug}/`));
  }
  const threeWay = await projectFile('chatgpt-vs-claude-vs-gemini-same-prompt/index.html');
  assert.match(threeWay, /What public benchmarks show/);
});

test('thin alternatives and pricing pages outside the kept list are noindexed', async () => {
  const sitemap = await projectFile('sitemap.xml');
  const withdrawnAlt = await projectFile('alternatives/chatgpt/index.html');
  const withdrawnPricing = await projectFile('pricing/api-startups/index.html');

  assert.match(withdrawnAlt, /<meta name="robots" content="noindex, follow/);
  assert.match(withdrawnPricing, /<meta name="robots" content="noindex, follow/);
  assert.doesNotMatch(sitemap, /\/alternatives\/chatgpt\//);
  assert.doesNotMatch(sitemap, /\/pricing\/api-startups\//);
  for (const slug of ['free-chatgpt', 'chatgpt-no-login', 'chatgpt-coding', 'chatgpt-chinese']) {
    const html = await projectFile(`alternatives/${slug}/index.html`);
    assert.doesNotMatch(html, /<meta name="robots" content="noindex, follow/, `${slug} should stay indexable`);
    assert.match(sitemap, new RegExp(`/alternatives/${slug}/`), `${slug} should be in the sitemap`);
  }
  for (const slug of ['chatgpt-vs-deepseek', 'cheapest-api']) {
    const html = await projectFile(`pricing/${slug}/index.html`);
    assert.doesNotMatch(html, /<meta name="robots" content="noindex, follow/, `${slug} should stay indexable`);
    assert.match(sitemap, new RegExp(`/pricing/${slug}/`), `${slug} should be in the sitemap`);
  }
});

test('the alternatives and pricing hubs only link to kept pages', async () => {
  const [altHub, pricingHub] = await Promise.all([
    projectFile('alternatives/index.html'),
    projectFile('pricing/index.html'),
  ]);
  assert.match(altHub, /href="\/alternatives\/free-chatgpt\/"/);
  assert.doesNotMatch(altHub, /href="\/alternatives\/chatgpt\/"/);
  assert.doesNotMatch(altHub, /href="\/alternatives\/windsurf\/"/);
  assert.match(pricingHub, /href="\/pricing\/chatgpt-vs-deepseek\/"/);
  assert.doesNotMatch(pricingHub, /href="\/pricing\/api-startups\/"/);
});

test('compare-ai-models is a blank worksheet, not a filled 11-model ranking', async () => {
  const html = await projectFile('compare-ai-models/index.html');
  assert.match(html, /<title>Compare AI Models Side by Side — Free \| ModelAny<\/title>/);
  assert.match(html, /blank same-prompt worksheet/i);
  assert.match(html, /Blank 11-model worksheet/);
  assert.match(html, /not a completed 11-model test/i);
});

test('homepage footer does not send Ask multiple AIs at once to compare-ai-models', async () => {
  const html = await projectFile('index.html');
  assert.match(html, /href="\/compare-ai-models\/">Compare AI models \(same prompt\)</);
  assert.match(html, /href="\/ask-multiple-ai-at-once\/">Ask multiple AIs at once</);
  assert.doesNotMatch(html, /href="\/compare-ai-models\/">Ask multiple AIs at once</);
});

test('Doubao vs ChatGPT does not treat 74.6% as an independent ChatGPT score', async () => {
  const html = await projectFile('zh/compare/doubao-vs-chatgpt/index.html');
  assert.match(html, /JoyCode \+ Claude 4 Sonnet \+ GPT-4\.1/);
  assert.match(html, /怎么选：按你的任务落位/);
  assert.doesNotMatch(html, /ChatGPT 系配置的最好记录（74\.6%/);
  const switchMatch = html.match(/data-locale-switch="en"[^>]*href="([^"]+)"/) || html.match(/href="([^"]+)"[^>]*data-locale-switch="en"/);
  assert.ok(switchMatch, 'zh pair should have an English locale switch');
  assert.equal(switchMatch[1], '/compare/');
});

