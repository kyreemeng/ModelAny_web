/**
 * Safe programmatic SEO generator.
 *
 * A page is indexable only when it is a selected core page and has a complete
 * first-party test record. All other research drafts stay noindex,follow and
 * are omitted from sitemap.xml.
 *
 * Run: node seo/generate.mjs
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DATE, DOWNLOAD, models, SITE } from './data/models.mjs';
import {
  alternativePages,
  bestForPages,
  comparePages,
  freePages,
  pricingPages,
  zhComparePages,
} from './data/pages.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORE_COMPARE_SLUGS = new Set([
  'chatgpt-vs-deepseek',
  'chatgpt-vs-claude',
  'chatgpt-vs-gemini',
  'chatgpt-vs-copilot',
  'chatgpt-vs-perplexity',
  'chatgpt-vs-grok',
  'deepseek-vs-claude',
  'deepseek-vs-gemini',
  'claude-vs-gemini',
]);
const TEST_RECORD_PATH = join(ROOT, 'seo', 'data', 'test-results.json');

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function loadTests() {
  if (!existsSync(TEST_RECORD_PATH)) return {};
  return JSON.parse(readFileSync(TEST_RECORD_PATH, 'utf8'));
}

function resolveModels(ids) {
  return ids.map((id) => {
    if (!models[id]) throw new Error(`Unknown model: ${id}`);
    return models[id];
  });
}

function assetBase(path) {
  return '../'.repeat(path.split('/').length - 1);
}

function writePage(path, content) {
  const fullPath = join(ROOT, path);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content, 'utf8');
}

function modelSources(items) {
  const seen = new Set();
  return items
    .flatMap((model) => model.sources)
    .filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
}

function sourcesHtml(items, lang) {
  const sources = modelSources(items);
  return `<section class="seo-section" aria-labelledby="sources-heading">
          <h2 id="sources-heading">${lang === 'zh' ? '官方来源与核验时间' : 'Official sources and verification date'}</h2>
          <p>${lang === 'zh'
            ? `下列链接是本页产品身份与套餐信息的官方来源，最后核验于 ${DATE}。价格、可用模型、配额与地区限制可能变化，请在购买或部署前以官网为准。`
            : `The links below are official sources for product identity and plan information, last checked ${DATE}. Pricing, model availability, quotas, and regional access can change; confirm on the provider site before purchasing or deploying.`}</p>
          <ul>
            ${sources.map((item) => `<li><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.label)}</a> — ${item.verifiedAt}</li>`).join('\n            ')}
          </ul>
        </section>`;
}

function testMethodHtml(items, lang, test) {
  const names = items.map((item) => item.name).join(lang === 'zh' ? '、' : ', ');
  if (test) {
    return `<section class="seo-section" aria-labelledby="test-heading">
          <h2 id="test-heading">${lang === 'zh' ? '真实多模型测试' : 'First-party multi-model test'}</h2>
          <p>${lang === 'zh'
            ? `测试日期：${esc(test.date)}；地区：${esc(test.region)}；测试范围：${esc(test.models)}。以下结论仅适用于所列模型版本、套餐与提示词。`
            : `Test date: ${esc(test.date)}; region: ${esc(test.region)}; scope: ${esc(test.models)}. Findings apply only to the listed model versions, plans, and prompts.`}</p>
          ${test.method ? `<p>${esc(test.method)}</p>` : ''}
          ${test.resultSummary ? `<p><strong>${lang === 'zh' ? '人工结论：' : 'Reviewer summary: '}</strong>${esc(test.resultSummary)}</p>` : ''}
          ${test.artifactUrl ? `<p><a href="${esc(test.artifactUrl)}" target="_blank" rel="noopener noreferrer">${lang === 'zh' ? '查看完整测试记录与原始输出' : 'View the complete test record and raw outputs'}</a></p>` : ''}
        </section>`;
  }

  return `<section class="seo-section" aria-labelledby="test-heading">
          <h2 id="test-heading">${lang === 'zh' ? '如何自行测试' : 'How to test this comparison yourself'}</h2>
          <p>${lang === 'zh'
            ? `本页尚未发布第一方测试结论，因此不对 ${esc(names)} 做能力排名。请在同一时间窗口、相同地区和相同套餐条件下，用完全相同的提示词比较输出。`
            : `This page does not yet publish first-party test findings, so it does not rank ${esc(names)}. Compare the same prompt in the same time window, region, and plan conditions.`}</p>
          <ol>
            <li>${lang === 'zh' ? '记录产品、模型版本、套餐、地区和测试日期。' : 'Record product, model version, plan, region, and test date.'}</li>
            <li>${lang === 'zh' ? '保存完整原始输出，而不是只截取好看的片段。' : 'Keep complete raw outputs, not selected highlights.'}</li>
            <li>${lang === 'zh' ? '按你的任务评估准确性、修改成本、速度与隐私要求。' : 'Evaluate accuracy, editing cost, speed, and privacy fit for your own tasks.'}</li>
          </ol>
        </section>`;
}

function comparisonBody(page, items, lang, test) {
  const names = items.map((item) => item.name).join(' vs ');
  const productRows = items.map((item) => `<tr>
              <th scope="row">${esc(item.name)}</th>
              <td>${esc(item.vendor)}</td>
              <td><a href="${esc(item.productUrl)}" target="_blank" rel="noopener noreferrer">${lang === 'zh' ? '访问产品官网' : 'Visit product site'}</a></td>
              <td>${item.inModelAny ? (lang === 'zh' ? 'ModelAny 当前支持' : 'Currently supported by ModelAny') : (lang === 'zh' ? '当前不在 ModelAny 启动列表中' : 'Not currently in ModelAny’s launcher')}</td>
            </tr>`).join('\n            ');

  return `<div class="quick-verdict">
          <h2>${lang === 'zh' ? '页面状态' : 'Page status'}</h2>
          <p>${test
            ? (lang === 'zh' ? '本页包含有日期、版本和原始记录支撑的第一方测试。结论仅适用于列明的测试条件。' : 'This page includes a dated first-party test with versions and raw records. Findings apply only to the stated test conditions.')
            : (lang === 'zh' ? '本页是待验证的对比研究稿；在第一方测试完成前，不作“最佳”或能力排名结论。' : 'This is a comparison research draft. It makes no “best” or capability-ranking claim until first-party testing is complete.')}</p>
        </div>
        <section class="seo-section">
          <h2>${lang === 'zh' ? '对比范围' : 'Comparison scope'}</h2>
          <p>${lang === 'zh'
            ? `本页围绕“${esc(page.keyword)}”梳理 ${esc(names)}。它旨在帮助你建立测试短名单，而不是替代你的实际工作负载验证。`
            : `This page scopes the query “${esc(page.keyword)}” across ${esc(names)}. It is designed to help you build a test shortlist, not replace validation against your real workload.`}</p>
        </section>
        <section class="seo-section">
          <h2>${lang === 'zh' ? '产品身份与官方入口' : 'Product identity and official entry points'}</h2>
          <div class="seo-table-wrap">
            <table class="seo-table">
              <caption>${lang === 'zh' ? `${esc(names)}：可核验产品信息` : `${esc(names)}: verifiable product details`}</caption>
              <thead><tr><th>${lang === 'zh' ? '产品' : 'Product'}</th><th>${lang === 'zh' ? '提供方' : 'Provider'}</th><th>${lang === 'zh' ? '官方入口' : 'Official entry point'}</th><th>ModelAny</th></tr></thead>
              <tbody>${productRows}</tbody>
            </table>
          </div>
        </section>
        ${testMethodHtml(items, lang, test)}
        <section class="seo-section">
          <h2>${lang === 'zh' ? '选择时应比较什么' : 'What to compare before choosing'}</h2>
          <ul>
            <li>${lang === 'zh' ? '你的实际任务是否正确完成，以及是否需要大量人工改写。' : 'Whether your real task is completed correctly and how much human revision it needs.'}</li>
            <li>${lang === 'zh' ? '当前套餐、地区和模型版本下的使用限制与成本。' : 'Usage limits and costs for your current plan, region, and model version.'}</li>
            <li>${lang === 'zh' ? '数据处理、团队账号和合规要求是否适配。' : 'Whether data handling, team accounts, and compliance requirements fit your situation.'}</li>
          </ul>
        </section>
        ${sourcesHtml(items, lang)}`;
}

function researchBody(page, items, lang = 'en') {
  const names = items.map((item) => item.name).join(lang === 'zh' ? '、' : ', ');
  return `<div class="quick-verdict">
          <h2>${lang === 'zh' ? '研究稿状态' : 'Research-draft status'}</h2>
          <p>${lang === 'zh'
            ? '此页尚未经过第一方测试与人工审校，不参与搜索索引。待补齐可复现测试、来源和查询专属分析后才会开放索引。'
            : 'This page has not yet passed first-party testing and editorial review, so it is excluded from search indexing. It will be eligible only after reproducible testing, sources, and query-specific analysis are added.'}</p>
        </div>
        <section class="seo-section">
          <h2>${lang === 'zh' ? '计划覆盖范围' : 'Planned scope'}</h2>
          <p>${lang === 'zh'
            ? `关键词“${esc(page.keyword)}”计划覆盖：${esc(names)}。发布前将补充适用于该查询的真实测试，而不会使用通用能力分数或未经核验的排名。`
            : `The planned scope for “${esc(page.keyword)}” is ${esc(names)}. Before publication, it will receive query-specific real testing rather than generic capability scores or unverified rankings.`}</p>
        </section>
        ${sourcesHtml(items, lang)}
        ${testMethodHtml(items, lang, null)}`;
}

function faqs(lang) {
  return lang === 'zh'
    ? [
        { q: '这页是否给出绝对排名？', a: '不会。只有在公开测试条件、原始输出与人工方法完整披露时，才会发布限定条件下的结论。' },
        { q: '价格和套餐信息可靠吗？', a: '页面链接到官方来源并标注核验日期；购买前仍应以提供方官网和你所在地区显示的价格为准。' },
        { q: 'ModelAny 会保存提示词吗？', a: 'ModelAny 采用本地优先设计；提示词仅发送到你选择的 AI 服务，不会上传到 ModelAny 自有服务器。' },
      ]
    : [
        { q: 'Does this page publish an absolute ranking?', a: 'No. Conditional findings are published only when test conditions, raw outputs, and a review method are disclosed.' },
        { q: 'Are pricing and plan details definitive?', a: 'This page links to official sources and verification dates. Confirm the provider price shown for your region before purchasing.' },
        { q: 'Does ModelAny store prompts?', a: 'ModelAny is local-first. Prompts are sent only to the AI services you choose and are not uploaded to ModelAny servers.' },
      ];
}

function htmlPage({ path, canonical, title, description, h1, body, lang = 'en', indexable = false, breadcrumbs }) {
  const base = assetBase(path);
  const pageUrl = `${SITE}${canonical}`;
  const robots = indexable ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow, max-image-preview:large, max-snippet:-1';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: h1,
        description,
        dateModified: DATE,
        author: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${SITE}${item.href}`,
        })),
      },
    ],
  };
  const crumbHtml = breadcrumbs.map((item, index) => (
    index === breadcrumbs.length - 1
      ? `<li aria-current="page">${esc(item.name)}</li>`
      : `<li><a href="${item.href}">${esc(item.name)}</a></li>`
  )).join('\n          ');
  const faqHtml = faqs(lang).map((item) => `<details class="faq-item"><summary><span>${esc(item.q)}</span></summary><div class="faq-answer"><p>${esc(item.a)}</p></div></details>`).join('\n          ');

  return `<!DOCTYPE html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#6D5DFB">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="ModelAny">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${pageUrl}">
  <link rel="alternate" hreflang="${lang === 'zh' ? 'zh-CN' : 'en'}" href="${pageUrl}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE}/assets/og-image.jpg">
  <meta property="og:site_name" content="ModelAny">
  <meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE}/assets/og-image.jpg">
  <link rel="icon" type="image/png" sizes="32x32" href="${base}assets/favicon-32.png">
  <link rel="stylesheet" href="${base}styles.css">
  <link rel="stylesheet" href="${base}seo-pages.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="seo-page locale-${lang}">
  <a href="#main" class="skip-link">${lang === 'zh' ? '跳到主要内容' : 'Skip to main content'}</a>
  <header class="site-header"><div class="container nav-container">
    <a href="${lang === 'zh' ? '/zh/' : '/'}" class="brand" aria-label="ModelAny ${lang === 'zh' ? '首页' : 'home'}"><img src="${base}assets/modelany-icon-master.png" alt="" class="brand-icon" width="36" height="36"><span class="brand-text">ModelAny</span></a>
    <nav class="nav-menu" aria-label="${lang === 'zh' ? '主导航' : 'Primary navigation'}"><a href="${lang === 'zh' ? '/zh/compare/' : '/compare/'}">${lang === 'zh' ? '对比' : 'Compare'}</a><a href="${lang === 'zh' ? '/' : '/zh/'}" data-locale-switch="${lang === 'zh' ? 'en' : 'zh'}" hreflang="${lang === 'zh' ? 'en' : 'zh-CN'}">${lang === 'zh' ? 'English' : '中文'}</a><a href="${DOWNLOAD}" target="_blank" rel="noopener noreferrer">${lang === 'zh' ? '下载' : 'Download'}</a></nav>
  </div></header>
  <main id="main" class="seo-main"><div class="container seo-container">
    <nav class="seo-breadcrumb" aria-label="Breadcrumb"><ol>${crumbHtml}</ol></nav>
    <article class="seo-article">
      <header class="seo-header"><p class="seo-eyebrow">Verified source registry: ${DATE}</p><h1>${esc(h1)}</h1></header>
      ${body}
      <section class="seo-section" aria-labelledby="faq-heading"><h2 id="faq-heading">${lang === 'zh' ? '常见问题' : 'Frequently asked questions'}</h2><div class="faq-list">${faqHtml}</div></section>
      <section class="seo-cta"><h2>${lang === 'zh' ? '用同一提示词比较多个模型' : 'Compare multiple models with one prompt'}</h2><p>${lang === 'zh' ? 'ModelAny 是免费开源的 Chrome 扩展。草稿、设置与历史保留在浏览器本地。' : 'ModelAny is a free, open-source Chrome extension. Drafts, settings, and history remain in your browser.'}</p><a href="${DOWNLOAD}" class="btn btn-primary btn-pill" target="_blank" rel="noopener noreferrer">Download ModelAny</a></section>
    </article>
  </div></main>
  <footer class="site-footer"><div class="container footer-container"><div class="footer-brand"><span>ModelAny</span></div><nav class="footer-links" aria-label="${lang === 'zh' ? '页脚导航' : 'Footer navigation'}"><a href="${lang === 'zh' ? '/zh/privacy.html' : '/privacy.html'}">${lang === 'zh' ? '隐私' : 'Privacy'}</a><a href="${lang === 'zh' ? '/' : '/zh/'}" data-locale-switch="${lang === 'zh' ? 'en' : 'zh'}">${lang === 'zh' ? 'English' : '中文'}</a><a href="${DOWNLOAD}" target="_blank" rel="noopener noreferrer">${lang === 'zh' ? '下载' : 'Download'}</a></nav></div></footer>
  <script src="${base}locale.js" defer></script>
</body>
</html>`;
}

function titleCase(text) {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/\bAi\b/g, 'AI').replace(/\bApi\b/g, 'API');
}

function generateCompare(page, prefix = 'compare', lang = 'en', tests) {
  const items = resolveModels(page.models);
  if (page.canonicalSlug) return null;
  const canonical = `/${prefix}/${page.slug}/`;
  const path = `${prefix}/${page.slug}/index.html`;
  const isCore = prefix === 'compare' && CORE_COMPARE_SLUGS.has(page.slug);
  const test = tests[canonical];
  const indexable = Boolean(isCore && test);
  const names = items.map((item) => item.name).join(' vs ');
  const h1 = lang === 'zh' ? `${names} 对比指南` : `${names}: comparison guide`;
  const description = lang === 'zh'
    ? `${names} 的可核验产品来源、对比方法与第一方测试状态。`
    : `Verifiable product sources, comparison method, and first-party testing status for ${names}.`;
  return {
    path,
    url: canonical,
    indexable,
    content: htmlPage({
      path,
      canonical,
      title: `${h1} | ModelAny`,
      description,
      h1,
      lang,
      body: comparisonBody(page, items, lang, test),
      indexable,
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: lang === 'zh' ? '对比' : 'Compare', href: lang === 'zh' ? '/zh/compare/' : '/compare/' }, { name: names, href: canonical }],
    }),
  };
}

function generateDraft(page, section, items, tests, lang = 'en') {
  const canonical = `/${section}/${page.slug}/`;
  const path = `${section}/${page.slug}/index.html`;
  const h1 = lang === 'zh' ? `${page.keyword}：研究稿` : `${titleCase(page.keyword)}: research draft`;
  return {
    path,
    url: canonical,
    indexable: false,
    content: htmlPage({
      path,
      canonical,
      title: `${h1} | ModelAny`,
      description: lang === 'zh' ? `待补充第一方测试与人工审校的 ${page.keyword} 研究稿。` : `A ${page.keyword} research draft awaiting first-party testing and editorial review.`,
      h1,
      lang,
      body: researchBody(page, items, lang),
      indexable: false,
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: section, href: `/${section}/` }, { name: page.keyword, href: canonical }],
    }),
  };
}

function generateHub(section, label, pages, lang = 'en') {
  const canonical = `/${section}/`;
  const path = `${section}/index.html`;
  const links = pages.filter((page) => !page.canonicalSlug).slice(0, 12).map((page) => `<li><a href="/${section}/${page.slug}/">${esc(page.keyword)}</a></li>`).join('');
  return {
    path,
    url: canonical,
    indexable: false,
    content: htmlPage({
      path,
      canonical,
      title: `${label} | ModelAny`,
      description: `${label} research hub. Pages are published to search only after source and test review.`,
      h1: label,
      lang,
      indexable: false,
      body: `<div class="quick-verdict"><h2>${lang === 'zh' ? '发布状态' : 'Publication status'}</h2><p>${lang === 'zh' ? '此索引页与其下研究稿暂不参与搜索索引；只有通过来源、测试与人工审校后才会开放。' : 'This hub and its drafts are excluded from search indexing until they pass source, test, and editorial review.'}</p></div><section class="seo-section"><h2>${lang === 'zh' ? '研究主题' : 'Research topics'}</h2><ul class="seo-index-list">${links}</ul></section>`,
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: label, href: canonical }],
    }),
  };
}

function writeRedirectConfig() {
  const redirects = comparePages
    .filter((page) => page.canonicalSlug)
    .flatMap((page) => [
      {
        source: `/compare/${page.slug}`,
        destination: `/compare/${page.canonicalSlug}/`,
        permanent: true,
      },
      {
        source: `/compare/${page.slug}/`,
        destination: `/compare/${page.canonicalSlug}/`,
        permanent: true,
      },
    ]);
  writeFileSync(join(ROOT, 'vercel.json'), `${JSON.stringify({ redirects }, null, 2)}\n`, 'utf8');
}

function writeSitemap(records) {
  const indexable = records.filter((record) => record.indexable);
  const entries = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/zh/', priority: '1.0', changefreq: 'weekly' },
    { url: '/privacy.html', priority: '0.3', changefreq: 'yearly' },
    { url: '/zh/privacy.html', priority: '0.3', changefreq: 'yearly' },
    ...indexable.map((record) => ({ url: record.url, priority: '0.8', changefreq: 'weekly' })),
  ];
  const body = entries.map((entry) => `  <url>
    <loc>${SITE}${entry.url}</loc>
    <lastmod>${DATE}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n');
  writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`, 'utf8');
}

const tests = loadTests();
const records = [];
for (const page of comparePages) {
  const record = generateCompare(page, 'compare', 'en', tests);
  if (record) records.push(record);
}
for (const page of zhComparePages) records.push(generateCompare(page, 'zh/compare', 'zh', tests));
for (const page of bestForPages) records.push(generateDraft(page, 'best-for', resolveModels(page.models), tests));
for (const page of alternativePages) records.push(generateDraft(page, 'alternatives', resolveModels([page.target]), tests));
for (const page of freePages) records.push(generateDraft(page, 'free', resolveModels(page.models), tests));
for (const page of pricingPages) records.push(generateDraft(page, 'pricing', resolveModels(page.models), tests));

records.push(
  generateHub('compare', 'AI model comparisons', comparePages),
  generateHub('zh/compare', '国产与中文 AI 对比', zhComparePages, 'zh'),
  generateHub('best-for', 'Best AI by use case', bestForPages),
  generateHub('alternatives', 'AI alternatives', alternativePages),
  generateHub('free', 'Free AI guides', freePages),
  generateHub('pricing', 'AI pricing guides', pricingPages),
);

for (const record of records) writePage(record.path, record.content);
writeRedirectConfig();
writeSitemap(records);
console.log(`Generated ${records.length} pages; ${records.filter((record) => record.indexable).length} SEO pages are indexable.`);
