/**
 * Safe programmatic SEO generator.
 *
 * Compare pages are generated only when every model shares public third-party
 * benchmark coverage. Other research drafts stay noindex,follow and are omitted
 * from sitemap.xml until they have reviewable evidence.
 *
 * Run: node seo/generate.mjs
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hasSharedBenchmarkData, sharedBenchmarkGroups } from './data/benchmarks.mjs';
import { DATE, DOWNLOAD, models, SITE } from './data/models.mjs';
import {
  alternativePages,
  bestForPages,
  comparePages,
  freePages,
  pricingPages,
  removedCompareRedirects,
  zhComparePages,
} from './data/pages.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CORE_COMPARE_SLUGS = new Set([
  'chatgpt-vs-deepseek',
  'chatgpt-vs-claude',
  'chatgpt-vs-gemini',
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
            ${sources.map((item) => `<li><a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.label)}</a> - ${item.verifiedAt}</li>`).join('\n            ')}
          </ul>
        </section>`;
}

function formatRetrievedAt(value, lang) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '-';
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function publicEvidenceHtml(modelIds, lang) {
  const groups = sharedBenchmarkGroups(modelIds);
  if (!groups.length) return '';
  const hub = lang === 'zh' ? '/zh/benchmarks/' : '/benchmarks/';
  const blocks = groups.map((group) => {
    const rows = [...group.rows].sort((a, b) => b.score - a.score || a.rank - b.rank).map((row) => `<tr>
              <th scope="row">${esc(row.product)}</th>
              <td>${esc(row.modelExactName)}</td>
              <td>${esc(String(row.rank))}</td>
              <td>${esc(String(row.score))}${row.unit === '%' ? '%' : ''}</td>
              <td>${esc(row.metric)} (${esc(row.unit)})</td>
            </tr>`).join('\n            ');
    return `<article class="seo-evidence-card">
          <h3>${esc(group.source === 'arena' ? 'Arena' : group.source === 'swebench' ? 'SWE-bench Verified' : group.source)} · ${esc(group.label[lang] || group.category)}</h3>
          <p>${esc(group.plain[lang] || '')}</p>
          <p class="seo-evidence-meta">${lang === 'zh' ? '数据抓取时间' : 'Retrieved'}: ${esc(formatRetrievedAt(group.retrievedAt, lang))} · <a href="${esc(group.sourceUrl)}" target="_blank" rel="noopener noreferrer">${lang === 'zh' ? '查看原始排行榜' : 'Open original leaderboard'}</a></p>
          <div class="seo-table-wrap">
            <table class="seo-table">
              <thead><tr><th>${lang === 'zh' ? '产品' : 'Product'}</th><th>${lang === 'zh' ? '精确模型版本' : 'Exact model version'}</th><th>${lang === 'zh' ? '排名' : 'Rank'}</th><th>${lang === 'zh' ? '成绩' : 'Score'}</th><th>${lang === 'zh' ? '指标' : 'Metric'}</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </article>`;
  }).join('\n        ');

  return `<section class="seo-section" aria-labelledby="public-evidence-heading">
          <h2 id="public-evidence-heading">${lang === 'zh' ? '公开评测怎么说' : 'What public benchmarks show'}</h2>
          <p>${lang === 'zh'
            ? '下面只展示这些模型共同出现在同一公开评测类别里的结果。不同来源的分数不能相加，也不能直接宣布谁全面更好。'
            : 'Below are results only from public benchmark categories where every model on this page appears together. Scores from different sources cannot be added up, and they do not prove one model is best overall.'}</p>
          ${blocks}
          <p><a href="${hub}">${lang === 'zh' ? '查看按场景整理的全部公开评测数据' : 'Browse all public benchmark data by scenario'}</a></p>
        </section>`;
}

function comparisonBody(page, items, lang) {
  const names = items.map((item) => item.name).join(' vs ');
  const productRows = items.map((item) => `<tr>
              <th scope="row">${esc(item.name)}</th>
              <td>${esc(item.vendor)}</td>
              <td><a href="${esc(item.productUrl)}" target="_blank" rel="noopener noreferrer">${lang === 'zh' ? '访问产品官网' : 'Visit product site'}</a></td>
              <td>${item.inModelAny ? (lang === 'zh' ? 'ModelAny 当前支持' : 'Currently supported by ModelAny') : (lang === 'zh' ? '当前不在 ModelAny 启动列表中' : 'Not currently in ModelAny launcher')}</td>
            </tr>`).join('\n            ');

  return `<div class="quick-verdict">
          <h2>${lang === 'zh' ? '如何阅读本页' : 'How to read this page'}</h2>
          <p>${lang === 'zh'
            ? '本页用通俗方式汇总公开第三方评测。它帮助你快速了解公开数据里两边的相对位置，但不能替代你用真实任务亲自试用。'
            : 'This page summarizes public third-party benchmarks in plain language. It helps you see where the models stand in published data, but it does not replace trying them on your own tasks.'}</p>
        </div>
        ${publicEvidenceHtml(page.models, lang)}
        <section class="seo-section">
          <h2>${lang === 'zh' ? '产品入口' : 'Product entry points'}</h2>
          <div class="seo-table-wrap">
            <table class="seo-table">
              <caption>${lang === 'zh' ? `${esc(names)}：官网与支持状态` : `${esc(names)}: official sites and support status`}</caption>
              <thead><tr><th>${lang === 'zh' ? '产品' : 'Product'}</th><th>${lang === 'zh' ? '提供方' : 'Provider'}</th><th>${lang === 'zh' ? '官方入口' : 'Official entry point'}</th><th>ModelAny</th></tr></thead>
              <tbody>${productRows}</tbody>
            </table>
          </div>
        </section>
        <section class="seo-section">
          <h2>${lang === 'zh' ? '自己试用时可以看什么' : 'What to check when you try them yourself'}</h2>
          <ul>
            <li>${lang === 'zh' ? '你的真实问题能否一次答对，还是还要大量修改。' : 'Whether your real question is answered well, or still needs heavy editing.'}</li>
            <li>${lang === 'zh' ? '当前套餐下够不够用，以及价格是否可接受。' : 'Whether the current plan is enough, and whether the price fits.'}</li>
            <li>${lang === 'zh' ? '隐私、登录方式和团队协作是否适合你。' : 'Whether privacy, sign-in, and team features fit your needs.'}</li>
          </ul>
        </section>
        ${relatedComparisonsHtml(page, lang)}
        ${sourcesHtml(items, lang)}`;
}

function relatedComparisonsHtml(currentPage, lang) {
  const registry = lang === 'zh' ? zhComparePages : comparePages;
  const pages = registry
    .filter((page) => !page.canonicalSlug && page.slug !== currentPage.slug && hasSharedBenchmarkData(page.models))
    .filter((page) => lang === 'zh' || CORE_COMPARE_SLUGS.has(page.slug))
    .slice(0, 6);
  if (!pages.length) return '';
  const prefix = lang === 'zh' ? '/zh/compare/' : '/compare/';
  const links = pages.map((page) => {
    const names = resolveModels(page.models).map((item) => item.name).join(' vs ');
    return `<li><a href="${prefix}${page.slug}/">${esc(names)}</a></li>`;
  }).join('\n            ');
  return `<section class="seo-section" aria-labelledby="related-comparisons-heading">
          <h2 id="related-comparisons-heading">${lang === 'zh' ? '更多有公开证据的模型对比' : 'More evidence-backed model comparisons'}</h2>
          <ul class="seo-index-list">
            ${links}
          </ul>
        </section>`;
}

function researchBody(page, items, lang = 'en') {
  const names = items.map((item) => item.name).join(lang === 'zh' ? '、' : ', ');
  const modelIds = page.models || (page.target ? [page.target] : items.map((item) => item.id));
  const evidence = modelIds.length >= 2 && hasSharedBenchmarkData(modelIds)
    ? publicEvidenceHtml(modelIds, lang)
    : `<section class="seo-section"><h2>${lang === 'zh' ? '公开评测' : 'Public benchmarks'}</h2><p>${lang === 'zh'
      ? '当前快照里还没有足以支撑本页全部产品并列比较的公开评测结果，因此本页不发布能力排名。'
      : 'The current snapshot does not yet contain shared public benchmark coverage for every product on this page, so no capability ranking is published.'}</p><p><a href="${lang === 'zh' ? '/zh/benchmarks/' : '/benchmarks/'}">${lang === 'zh' ? '查看已有公开评测数据' : 'Browse available public benchmark data'}</a></p></section>`;
  return `<div class="quick-verdict">
          <h2>${lang === 'zh' ? '研究稿状态' : 'Research-draft status'}</h2>
          <p>${lang === 'zh'
            ? '此页尚未完成完整审校，不参与搜索索引。只有具备可核验公开评测或第一方测试后才会开放索引。'
            : 'This page has not completed full editorial review, so it is excluded from search indexing. It becomes eligible only after verifiable public benchmarks or first-party testing are available.'}</p>
        </div>
        <section class="seo-section">
          <h2>${lang === 'zh' ? '计划覆盖范围' : 'Planned scope'}</h2>
          <p>${lang === 'zh'
            ? `关键词“${esc(page.keyword)}”计划覆盖：${esc(names)}。`
            : `The planned scope for “${esc(page.keyword)}” is ${esc(names)}.`}</p>
        </section>
        ${evidence}
        ${sourcesHtml(items, lang)}`;
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

function htmlPage({ path, canonical, title, description, h1, body, lang = 'en', indexable = false, breadcrumbs, localeHref }) {
  const base = assetBase(path);
  const pageUrl = `${SITE}${canonical}`;
  const robots = indexable ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow, max-image-preview:large, max-snippet:-1';
  const switchHref = localeHref || (lang === 'zh' ? '/compare/' : '/zh/benchmarks/');
  const switchLabel = lang === 'zh' ? 'English' : '中文';
  const switchLang = lang === 'zh' ? 'en' : 'zh';
  const switchHreflang = lang === 'zh' ? 'en' : 'zh-CN';
  const downloadLabel = lang === 'zh' ? '安装扩展' : 'Install extension';
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
        image: `${SITE}/assets/og-image.jpg`,
        inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: h1,
        description,
        isPartOf: { '@id': `${SITE}/#website` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${SITE}/assets/og-image.jpg`,
          width: 1200,
          height: 630,
        },
        inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
        dateModified: DATE,
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
  const xDefault = lang === 'en'
    ? `\n  <link rel="alternate" hreflang="x-default" href="${pageUrl}">`
    : '';
  const mobileNav = `
    <div class="nav-actions">
      <a href="${switchHref}" data-locale-switch="${switchLang}" class="locale-switch locale-switch-compact" hreflang="${switchHreflang}" lang="${switchHreflang}" aria-current="false">${switchLabel}</a>
      <a href="${DOWNLOAD}" data-download-cta class="btn btn-primary btn-pill nav-cta">${downloadLabel}</a>
      <button class="menu-toggle" id="menu-toggle" aria-label="${lang === 'zh' ? '切换导航菜单' : 'Toggle menu'}" aria-expanded="false" aria-controls="nav-menu">
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
      </button>
    </div>`;
  const analytics = indexable ? `
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-CX4BMB7829"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-CX4BMB7829');
  </script>
  <script defer src="https://cdn.vercel-insights.com/v1/script.js"></script>` : '';

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
  <meta name="googlebot" content="${robots}">
  <link rel="canonical" href="${pageUrl}">
  <link rel="alternate" hreflang="${lang === 'zh' ? 'zh-CN' : 'en'}" href="${pageUrl}">${xDefault}
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${SITE}/assets/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(h1)}">
  <meta property="og:site_name" content="ModelAny">
  <meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE}/assets/og-image.jpg">
  <meta name="twitter:image:alt" content="${esc(h1)}">
  <link rel="icon" type="image/png" sizes="32x32" href="${base}assets/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="${base}assets/apple-touch-icon.png">
  <link rel="manifest" href="${base}site.webmanifest">
  <link rel="stylesheet" href="${base}styles.css">
  <link rel="stylesheet" href="${base}seo-pages.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="seo-page locale-${lang}">
  <a href="#main" class="skip-link">${lang === 'zh' ? '跳到主要内容' : 'Skip to main content'}</a>
  <header class="site-header"><div class="container nav-container">
    <a href="${lang === 'zh' ? '/zh/' : '/'}" class="brand" aria-label="ModelAny ${lang === 'zh' ? '首页' : 'home'}"><img src="${base}assets/favicon-192.png" alt="" class="brand-icon" width="36" height="36"><span class="brand-text">ModelAny</span></a>
    <nav class="nav-menu" id="nav-menu" aria-label="${lang === 'zh' ? '主导航' : 'Primary navigation'}">${lang === 'zh' ? '' : '<a href="/compare/">Compare</a>'}<a href="${lang === 'zh' ? '/zh/benchmarks/' : '/benchmarks/'}">${lang === 'zh' ? '评测数据' : 'Benchmarks'}</a><a href="${switchHref}" data-locale-switch="${switchLang}" hreflang="${switchHreflang}">${switchLabel}</a><a href="${DOWNLOAD}" data-download-cta>${downloadLabel}</a></nav>${mobileNav}
  </div></header>
  <main id="main" class="seo-main"><div class="container seo-container">
    <nav class="seo-breadcrumb" aria-label="Breadcrumb"><ol>${crumbHtml}</ol></nav>
    <article class="seo-article">
      <header class="seo-header"><p class="seo-eyebrow">${lang === 'zh' ? '公开评测快照' : 'Public benchmark snapshot'}: ${DATE}</p><h1>${esc(h1)}</h1></header>
      ${body}
      <section class="seo-section" aria-labelledby="faq-heading"><h2 id="faq-heading">${lang === 'zh' ? '常见问题' : 'Frequently asked questions'}</h2><div class="faq-list">${faqHtml}</div></section>
      <section class="seo-cta"><h2>${lang === 'zh' ? '用同一提示词比较多个模型' : 'Compare multiple models with one prompt'}</h2><p>${lang === 'zh' ? 'ModelAny 已在 Chrome 网上应用店上架；Microsoft Edge 扩展仍在审核中。草稿、设置与历史保留在浏览器本地。' : 'ModelAny is available on the Chrome Web Store. The Microsoft Edge Add-ons listing is still under review. Drafts, settings, and history remain in your browser.'}</p><a href="${DOWNLOAD}" data-download-cta class="btn btn-primary btn-pill">${downloadLabel}</a></section>
    </article>
  </div></main>
  <footer class="site-footer"><div class="container footer-container"><div class="footer-brand"><span>ModelAny</span></div><nav class="footer-links" aria-label="${lang === 'zh' ? '页脚导航' : 'Footer navigation'}"><a href="${lang === 'zh' ? '/zh/privacy.html' : '/privacy.html'}">${lang === 'zh' ? '隐私' : 'Privacy'}</a><a href="${switchHref}" data-locale-switch="${switchLang}">${switchLabel}</a><a href="${DOWNLOAD}" data-download-cta>${downloadLabel}</a></nav></div></footer>
  <script src="${base}locale.js" defer></script>
  <script src="${base}download.js" defer></script>
  <script src="${base}script.js" defer></script>
${analytics}
</body>
</html>`;
}

function titleCase(text) {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase()).replace(/\bAi\b/g, 'AI').replace(/\bApi\b/g, 'API');
}

function generateCompare(page, prefix = 'compare', lang = 'en') {
  const items = resolveModels(page.models);
  if (page.canonicalSlug) return null;
  if (!hasSharedBenchmarkData(page.models)) return null;
  const canonical = `/${prefix}/${page.slug}/`;
  const path = `${prefix}/${page.slug}/index.html`;
  const indexable = prefix === 'compare' ? CORE_COMPARE_SLUGS.has(page.slug) : true;
  const names = items.map((item) => item.name).join(' vs ');
  const h1 = lang === 'zh' ? `${names} 公开评测对比` : `${names}: public benchmark comparison`;
  const description = lang === 'zh'
    ? `${names} 的公开第三方评测结果、精确模型版本与官方来源说明。`
    : `Public third-party benchmark results, exact model versions, and official sources for ${names}.`;
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
      body: comparisonBody(page, items, lang),
      indexable,
      localeHref: lang === 'zh' ? '/compare/' : '/zh/benchmarks/',
      breadcrumbs: [
        { name: lang === 'zh' ? '首页' : 'Home', href: lang === 'zh' ? '/zh/' : '/' },
        { name: lang === 'zh' ? '评测数据' : 'Compare', href: lang === 'zh' ? '/zh/benchmarks/' : '/compare/' },
        { name: names, href: canonical },
      ],
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
  const publishablePages = pages.filter((page) => !page.canonicalSlug);
  const links = publishablePages.map((page) => `<li><a href="/${section}/${page.slug}/">${esc(page.keyword)}</a></li>`).join('');
  const indexable = section === 'compare' && publishablePages.length > 0;
  return {
    path,
    url: canonical,
    indexable,
    content: htmlPage({
      path,
      canonical,
      title: `${label} | ModelAny`,
      description: indexable
        ? 'Compare AI models using public third-party benchmark evidence, exact model versions, source links, and clearly stated limits.'
        : `${label} research hub. Pages are published to search only after source and test review.`,
      h1: label,
      lang,
      indexable,
      body: indexable
        ? `<div class="quick-verdict"><h2>Evidence before rankings</h2><p>Every published comparison below uses results where the models appear in the same public benchmark category. Metrics remain separate, exact model versions are shown, and no single score is treated as a universal ranking.</p></div><section class="seo-section"><h2>Published AI model comparisons</h2><ul class="seo-index-list">${links}</ul></section><section class="seo-section"><h2>How these comparisons are reviewed</h2><p>We preserve the source leaderboard, retrieval time, metric, model version, and test limitations. Pages without shared evidence remain outside search indexing until review is complete.</p><p><a href="/benchmarks/">Browse all benchmark snapshots by scenario</a></p></section>`
        : `<div class="quick-verdict"><h2>${lang === 'zh' ? '发布状态' : 'Publication status'}</h2><p>${lang === 'zh' ? '此索引页与其下研究稿暂不参与搜索索引；只有通过来源、测试与人工审校后才会开放。' : 'This hub and its drafts are excluded from search indexing until they pass source, test, and editorial review.'}</p></div><section class="seo-section"><h2>${lang === 'zh' ? '研究主题' : 'Research topics'}</h2><ul class="seo-index-list">${links}</ul></section>`,
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: label, href: canonical }],
    }),
  };
}

function writeRedirectConfig() {
  const pairRedirects = comparePages
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
  const redirects = [...pairRedirects, ...removedCompareRedirects];
  writeFileSync(join(ROOT, 'vercel.json'), `${JSON.stringify({ redirects }, null, 2)}\n`, 'utf8');
}

function pruneRemovedCompareDirs() {
  const keep = new Set([
    ...comparePages.filter((page) => !page.canonicalSlug).map((page) => `compare/${page.slug}`),
    ...zhComparePages.filter((page) => !page.canonicalSlug).map((page) => `zh/compare/${page.slug}`),
  ]);
  const pruneTargets = new Set([
    ...removedCompareRedirects.map((item) => item.source.replace(/\/$/, '').replace(/^\//, '')),
    ...comparePages.filter((page) => page.canonicalSlug).map((page) => `compare/${page.slug}`),
  ]);
  for (const rel of pruneTargets) {
    if (rel !== 'zh/compare' && !rel.startsWith('compare/') && !rel.startsWith('zh/compare/')) continue;
    if (keep.has(rel)) continue;
    const full = join(ROOT, rel);
    if (rel === 'zh/compare') {
      const hub = join(full, 'index.html');
      if (existsSync(hub)) rmSync(hub, { force: true });
    } else if (existsSync(full)) {
      rmSync(full, { recursive: true, force: true });
    }
  }
}

function writeSitemap(records) {
  const indexable = records.filter((record) => record.indexable);
  const entries = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/zh/', priority: '1.0', changefreq: 'weekly' },
    { url: '/benchmarks/', priority: '0.8', changefreq: 'daily' },
    { url: '/zh/benchmarks/', priority: '0.8', changefreq: 'daily' },
    { url: '/privacy.html', priority: '0.3', changefreq: 'yearly' },
    { url: '/zh/privacy.html', priority: '0.3', changefreq: 'yearly' },
    ...indexable.map((record) => ({ url: record.url, priority: '0.8', changefreq: 'weekly' })),
  ];
  const languagePairs = {
    '/': { en: '/', zh: '/zh/' },
    '/zh/': { en: '/', zh: '/zh/' },
    '/benchmarks/': { en: '/benchmarks/', zh: '/zh/benchmarks/' },
    '/zh/benchmarks/': { en: '/benchmarks/', zh: '/zh/benchmarks/' },
    '/privacy.html': { en: '/privacy.html', zh: '/zh/privacy.html' },
    '/zh/privacy.html': { en: '/privacy.html', zh: '/zh/privacy.html' },
  };
  const body = entries.map((entry) => {
    const pair = languagePairs[entry.url];
    const alternates = pair
      ? `
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${pair.en}"/>
    <xhtml:link rel="alternate" hreflang="zh-CN" href="${SITE}${pair.zh}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${pair.en}"/>`
      : '';
    return `  <url>
    <loc>${SITE}${entry.url}</loc>
    <lastmod>${DATE}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${alternates}
  </url>`;
  }).join('\n');
  writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`, 'utf8');
}

const tests = loadTests();
const records = [];
for (const page of comparePages) {
  const record = generateCompare(page, 'compare', 'en');
  if (record) records.push(record);
}
for (const page of zhComparePages) {
  const record = generateCompare(page, 'zh/compare', 'zh');
  if (record) records.push(record);
}
for (const page of bestForPages) records.push(generateDraft(page, 'best-for', resolveModels(page.models), tests));
for (const page of alternativePages) records.push(generateDraft(page, 'alternatives', resolveModels([page.target]), tests));
for (const page of freePages) records.push(generateDraft(page, 'free', resolveModels(page.models), tests));
for (const page of pricingPages) records.push(generateDraft(page, 'pricing', resolveModels(page.models), tests));

records.push(
  generateHub('compare', 'AI model comparisons', comparePages.filter((page) => !page.canonicalSlug && hasSharedBenchmarkData(page.models))),
  generateHub('best-for', 'Best AI by use case', bestForPages),
  generateHub('alternatives', 'AI alternatives', alternativePages),
  generateHub('free', 'Free AI guides', freePages),
  generateHub('pricing', 'AI pricing guides', pricingPages),
);

pruneRemovedCompareDirs();
for (const record of records) writePage(record.path, record.content);
writeRedirectConfig();
writeSitemap(records);
console.log(`Generated ${records.length} pages; ${records.filter((record) => record.indexable).length} SEO pages are indexable.`);
