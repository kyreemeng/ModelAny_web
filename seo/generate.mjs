/**
 * Safe programmatic SEO generator.
 *
 * Compare pages are generated only when every model shares public third-party
 * benchmark coverage. Editorial guides provide task-specific selection criteria,
 * official sources, and ModelAny workflows without unsupported rankings.
 *
 * Run: node seo/generate.mjs
 */
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hasSharedBenchmarkData, sharedBenchmarkGroups } from './data/benchmarks.mjs';
import { DATE, DOWNLOAD, EDGE_STORE_URL, models, SITE } from './data/models.mjs';
import {
  alternativePages,
  bestForPages,
  comparePages,
  freePages,
  pricingPages,
  productPages,
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
const CONTENT_UPDATED = '2026-07-31';

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

function approvedReview(tests, section, slug) {
  const review = tests[`${section}/${slug}`];
  if (!review || review.status !== 'approved' || review.method !== 'editorial-source-review') return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt || '')) return null;
  if (!review.summary || !review.methodology || !Array.isArray(review.criteria) || review.criteria.length < 3) return null;
  return review;
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
            ? '下面只展示这些模型共同出现在同一公开评测类别里的结果。不同来源的分数不能相加，也不能据此宣布谁全面更好。'
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
            ? '本页汇总双方共同出现在同一公开第三方评测中的结果，并标明精确模型版本与原始来源。它便于快速核对公开证据，但不能替代你用真实任务亲自试用。'
            : 'This page summarizes results from public third-party benchmarks where both products appear in the same category, with exact model versions and original sources. It helps you inspect published evidence quickly, but it does not replace testing the models on your own tasks.'}</p>
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
          <h2>${lang === 'zh' ? '亲自试用时可核对的事项' : 'What to verify in your own trial'}</h2>
          <ul>
            <li>${lang === 'zh' ? '对你的真实任务，答案是否准确、完整，以及还需要多少人工修改。' : 'Whether answers to your real tasks are accurate and complete, and how much editing they still need.'}</li>
            <li>${lang === 'zh' ? '当前套餐的配额、价格与地区可用性是否满足长期使用。' : 'Whether the current plan’s quotas, pricing, and regional availability fit long-term use.'}</li>
            <li>${lang === 'zh' ? '隐私条款、登录方式与团队协作是否符合你的工作要求。' : 'Whether privacy terms, sign-in, and team collaboration match your requirements.'}</li>
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

function displayModelName(item, lang = 'en') {
  if (lang === 'zh') return item.name;
  const enAlias = {
    wenxin: 'Wenxin',
    qwen: 'Qwen',
    doubao: 'Doubao',
    glm: 'GLM',
  };
  return enAlias[item.id] || item.name;
}

function guideCriteria(page, section, items, review, lang) {
  if (review?.criteria?.length) return review.criteria;
  const names = items.map((item) => displayModelName(item, lang)).join(lang === 'zh' ? '、' : ', ');
  const targetName = displayModelName(items[0] || { name: lang === 'zh' ? '该产品' : 'the product', id: '' }, lang);
  const criteria = {
    'best-for': lang === 'zh'
      ? [`用与你目标场景一致的真实任务测试 ${names}，而不是只看品牌知名度。`, '核对输出是否可验证、可编辑，并符合你的隐私或合规要求。', '比较当前套餐、登录方式和协作流程是否适合长期使用。']
      : [`Test ${names} on a real task that matches your use case—not brand familiarity alone.`, 'Check that the output is verifiable, editable, and appropriate for your privacy or compliance needs.', 'Compare the current plan, sign-in flow, and collaboration fit before adopting a tool.'],
    alternatives: lang === 'zh'
      ? [`明确你想替代 ${targetName} 的原因：价格、登录方式、地区、工作流或隐私。`, '逐项检查候选工具是否满足你的筛选条件，而不是只比较品牌热度。', '在迁移前用同一任务保留输入、输出和修改成本的记录。']
      : [`State why you are replacing ${targetName}: price, sign-in, region, workflow, or privacy.`, 'Check each candidate against the stated constraint instead of comparing brand popularity.', 'Before migrating, keep a record of the same task, its output, and how much editing it needed.'],
    free: lang === 'zh'
      ? ['区分免费试用、免费套餐、免登录入口和开放 API——它们并不等价。', '在开始真实工作前，确认官网显示的地区、登录和用量限制。', '不要把免费入口当作生产级 SLA；为关键任务保留人工复核。']
      : ['Distinguish a trial, a free tier, a no-login entry point, and an open API—they are not equivalent.', 'Confirm the region, sign-in, and usage conditions shown on the official site before real work.', 'Do not treat a free entry point as a production SLA; keep human review for important work.'],
    pricing: lang === 'zh'
      ? ['按自己的输入、输出、重试和峰值流量估算成本，而不是只看首页标价。', '核对 API 文档、速率限制、数据处理条款和迁移成本。', '在上线前记录质量、延迟、失败率和实际支出。']
      : ['Estimate cost from your own inputs, outputs, retries, and peak traffic rather than a headline price alone.', 'Check API documentation, rate limits, data-handling terms, and migration cost.', 'Track quality, latency, failures, and actual spend before production rollout.'],
  };
  return criteria[section] || [];
}

function guideIntroduction(page, section, items, lang) {
  const names = items.map((item) => displayModelName(item, lang)).join(lang === 'zh' ? '、' : ', ');
  const target = displayModelName(items[0] || { name: names, id: '' }, lang) || names;
  if (section === 'alternatives') {
    return lang === 'zh'
      ? `本指南说明如何评估 ${target} 的替代方案。重点是把价格、登录、地区、工作流和隐私等约束写成可核对条件，而不是给出脱离场景的“最佳”结论。`
      : `This guide explains how to evaluate alternatives to ${target}. It turns constraints such as price, sign-in, region, workflow, and privacy into checkable conditions—not a claim that any product is best in every case.`;
  }
  if (section === 'free') {
    return lang === 'zh'
      ? `本指南说明免费访问的不同形式（试用、免费套餐、免登录入口与开放 API），并把会变化的地区、配额与条款留给官方页面确认。`
      : `This guide explains the different forms of free access—trials, free tiers, no-login entry points, and open APIs—and leaves changing regional limits, quotas, and terms to the official pages.`;
  }
  if (section === 'pricing') {
    return lang === 'zh'
      ? `本指南侧重成本核对方法：按真实用量估算支出，并交叉检查官方文档与迁移风险，而不是发布很快过期的价格排行。`
      : `This guide focuses on a cost-checking method: estimate spend from real usage, then cross-check official documentation and migration risk—rather than publishing a price ranking that quickly goes stale.`;
  }
  return lang === 'zh'
    ? `本指南把 ${names} 放在同一任务选择框架中，提供决策标准与试用方法，不发布脱离任务条件的绝对排名。`
    : `This guide places ${names} in one task-selection framework. It provides decision criteria and a trial method—not an absolute ranking outside a specific task context.`;
}

function modelAnyWorkflow(page, section, items, lang) {
  const fromPage = items.filter((item) => item.inModelAny).map((item) => displayModelName(item, lang));
  const fallback = Object.values(models).filter((item) => item.inModelAny).map((item) => displayModelName(item, lang)).slice(0, 4);
  const supported = section === 'alternatives' && fromPage.length <= 1 ? fallback : (fromPage.length ? fromPage : fallback);
  const names = supported.join(lang === 'zh' ? '、' : ', ');
  const need = lang === 'zh'
    ? (section === 'alternatives'
      ? `与替代 ${esc(displayModelName(items[0] || { name: '当前工具', id: '' }, lang))} 相关的真实任务`
      : '与你目标场景相符的真实任务')
    : (section === 'alternatives'
      ? `a real task related to replacing ${esc(displayModelName(items[0] || { name: 'your current tool', id: '' }, lang))}`
      : 'a real task that matches your use case');
  return `<section class="seo-section" aria-labelledby="modelany-workflow-heading">
          <h2 id="modelany-workflow-heading">${lang === 'zh' ? '用 ModelAny 做同题验证' : 'Validate the same task with ModelAny'}</h2>
          <p>${lang === 'zh'
            ? `把同一个提示词（对应${need}）发送给 ${esc(names)} 等当前支持的服务，并排检查事实准确性、可执行性与修改成本。ModelAny 只负责打开并填入所选服务；各服务的回答、套餐与数据条款仍由提供方负责。`
            : `Send one prompt for ${need} to ${esc(names)} (and any other services you select), then compare factual accuracy, actionability, and how much editing each result needs. ModelAny only opens and fills the selected services; each provider remains responsible for its answers, plans, and data terms.`}</p>
          <ol>
            <li>${lang === 'zh' ? '写下成功标准，例如可验证性、修改时间和隐私要求。' : 'Write down success criteria such as verifiability, editing time, and privacy requirements.'}</li>
            <li>${lang === 'zh' ? '用同一个输入比较多个可用模型，避免因提示词不同造成误判。' : 'Compare available models with the same input so prompt differences do not distort the result.'}</li>
            <li>${lang === 'zh' ? '记录输出、人工修改和失败情况，再决定长期工作流。' : 'Record the output, human edits, and failures before choosing a long-term workflow.'}</li>
          </ol>
        </section>`;
}

function researchBody(page, section, items, lang = 'en', review = null) {
  const modelIds = page.models || (page.target ? [page.target] : items.map((item) => item.id));
  const evidence = modelIds.length >= 2 && hasSharedBenchmarkData(modelIds)
    ? publicEvidenceHtml(modelIds, lang)
    : `<section class="seo-section"><h2>${lang === 'zh' ? '公开评测的适用范围' : 'Where public benchmarks apply'}</h2><p>${lang === 'zh'
      ? '当前公开快照未覆盖本页所有产品的同类测试，因此这里不发布能力排名。请依据本页的选择标准，用真实任务自行验证。'
      : 'The current public snapshot does not cover every product on this page in the same test, so this guide does not publish a capability ranking. Use the selection criteria below and validate with a real task.'}</p><p><a href="${lang === 'zh' ? '/zh/benchmarks/' : '/benchmarks/'}">${lang === 'zh' ? '查看可比较的公开评测数据' : 'Browse comparable public benchmark data'}</a></p></section>`;
  const criteria = guideCriteria(page, section, items, review, lang).map((criterion) => `<li>${esc(criterion)}</li>`).join('\n            ');
  const reviewNote = review
    ? `<p class="seo-note">${lang === 'zh' ? `本页最近编辑审校：${esc(review.reviewedAt)}。` : `Last editorial review: ${esc(review.reviewedAt)}.`}</p>`
    : '';
  return `<div class="quick-verdict">
          <h2>${lang === 'zh' ? '选择框架' : 'Selection framework'}</h2>
          <p>${esc(guideIntroduction(page, section, items, lang))}</p>
        </div>
        <section class="seo-section" aria-labelledby="selection-criteria-heading">
          <h2 id="selection-criteria-heading">${lang === 'zh' ? '选择时要核对什么' : 'What to evaluate'}</h2>
          <ul>${criteria}</ul>
          ${reviewNote}
        </section>
        ${modelAnyWorkflow(page, section, items, lang)}
        ${evidence}
        ${sourcesHtml(items, lang)}`;
}

function faqs(lang) {
  return lang === 'zh'
    ? [
        { q: '本页是否给出绝对排名？', a: '不会。本站只在公开测试条件、原始来源与审校方法可核验时，才呈现限定条件下的结论；不会发布脱离场景的“全面最优”名单。' },
        { q: '价格和套餐信息是否最终有效？', a: '页面会链接官方来源并标注核验日期。购买或部署前，请以提供方官网及你所在地区显示的价格与条款为准。' },
        { q: 'ModelAny 会保存提示词吗？', a: 'ModelAny 采用本地优先设计：草稿、设置与历史保留在浏览器本地；提示词仅发送到你选择的 AI 服务，不会上传到 ModelAny 自有服务器。' },
      ]
    : [
        { q: 'Does this page publish an absolute ranking?', a: 'No. We compare models only where they share the same public test conditions, and we link to the original sources so you can verify. We don\'t publish a “best overall” list outside a stated context.' },
        { q: 'Are pricing and plan details definitive?', a: 'This page links to official sources and verification dates. Confirm the price and terms shown for your region on the provider site before purchasing or deploying.' },
        { q: 'Does ModelAny store prompts?', a: 'ModelAny is local-first: drafts, settings, and history stay in your browser. Prompts are sent only to the AI services you choose and are not uploaded to ModelAny servers.' },
      ];
}

function htmlPage({ path, canonical, title, description, h1, body, lang = 'en', indexable = false, breadcrumbs, localeHref, dateModified = CONTENT_UPDATED, pageType = 'Article', alternateUrl }) {
  const base = assetBase(path);
  const pageUrl = `${SITE}${canonical}`;
  const robots = indexable ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, follow, max-image-preview:large, max-snippet:-1';
  const switchHref = localeHref || (lang === 'zh' ? '/compare/' : '/zh/benchmarks/');
  const switchLabel = lang === 'zh' ? 'English' : '中文';
  const switchLang = lang === 'zh' ? 'en' : 'zh';
  const switchHreflang = lang === 'zh' ? 'en' : 'zh-CN';
  const downloadLabel = lang === 'zh' ? '安装扩展' : 'Install extension';
  const ogImage = lang === 'zh' ? `${SITE}/assets/og-image-zh.jpg` : `${SITE}/assets/og-image.jpg`;
  const datePublished = '2026-07-12';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': pageType,
        '@id': `${pageUrl}#article`,
        headline: h1,
        description,
        datePublished,
        dateModified,
        author: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        image: ogImage,
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
          url: ogImage,
          width: 1200,
          height: 630,
        },
        inLanguage: lang === 'zh' ? 'zh-CN' : 'en',
        datePublished,
        dateModified,
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
  const faqHtml = faqs(lang).map((item) => `<details class="faq-item"><summary><span>${esc(item.q)}</span></summary><div class="faq-answer"><div class="faq-answer-inner"><p>${esc(item.a)}</p></div></div></details>`).join('\n          ');
  if (canonical.startsWith('/pricing')) {
    schema['@graph'].push({
      '@type': 'SoftwareApplication',
      '@id': `${SITE}/#software`,
      name: 'ModelAny',
      applicationCategory: 'BrowserExtension',
      operatingSystem: 'Chrome, Edge',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    });
  }
  const hreflangBlock = alternateUrl
    ? `
  <link rel="alternate" hreflang="en" href="${lang === 'zh' ? `${SITE}${alternateUrl}` : pageUrl}">
  <link rel="alternate" hreflang="zh-CN" href="${lang === 'zh' ? pageUrl : `${SITE}${alternateUrl}`}">
  <link rel="alternate" hreflang="x-default" href="${lang === 'zh' ? `${SITE}${alternateUrl}` : pageUrl}">`
    : `
  <link rel="alternate" hreflang="${lang === 'zh' ? 'zh-CN' : 'en'}" href="${pageUrl}">
  <link rel="alternate" hreflang="x-default" href="${pageUrl}">`;
  const themeToggleBtn = `<button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode" type="button">
        <svg class="icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg class="icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>`;
  const mobileNav = `
    <div class="nav-actions">
      ${themeToggleBtn}
      <a href="${switchHref}" data-locale-switch="${switchLang}" class="locale-switch locale-switch-compact" lang="${switchHreflang}" aria-current="false">${switchLabel}</a>
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
  <meta name="theme-color" content="#FDFDFB">
  <meta name="color-scheme" content="light dark">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="author" content="ModelAny">
  <meta name="robots" content="${robots}">
  <meta name="googlebot" content="${robots}">
  <link rel="canonical" href="${pageUrl}">${hreflangBlock}
  <meta property="og:type" content="article">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(h1)}">
  <meta property="og:site_name" content="ModelAny">
  <meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:image:alt" content="${esc(h1)}">
  <link rel="icon" type="image/png" sizes="32x32" href="${base}assets/favicon-32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="${base}assets/apple-touch-icon.png">
  <link rel="manifest" href="${base}site.webmanifest">
  <script>
    (function() {
      var stored = localStorage.getItem('modelany-theme');
      if (stored) {
        document.documentElement.setAttribute('data-theme', stored);
      }
    })();
  </script>
  <link rel="stylesheet" href="${base}styles.css">
  <link rel="stylesheet" href="${base}seo-pages.css">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body class="seo-page locale-${lang}">
  <a href="#main" class="skip-link">${lang === 'zh' ? '跳到主要内容' : 'Skip to main content'}</a>
  <header class="site-header"><div class="container nav-container">
    <a href="${lang === 'zh' ? '/zh/' : '/'}" class="brand" aria-label="ModelAny ${lang === 'zh' ? '首页' : 'home'}"><img src="${base}assets/favicon-192.png" alt="" class="brand-icon" width="36" height="36"><span class="brand-text">ModelAny</span></a>
    <nav class="nav-menu" id="nav-menu" aria-label="${lang === 'zh' ? '主导航' : 'Primary navigation'}">${lang === 'zh' ? '' : '<a href="/compare/">Compare</a>'}<a href="${lang === 'zh' ? '/zh/benchmarks/' : '/benchmarks/'}">${lang === 'zh' ? '评测数据' : 'Benchmarks'}</a><a href="${switchHref}" data-locale-switch="${switchLang}">${switchLabel}</a><a href="${DOWNLOAD}" data-download-cta>${downloadLabel}</a></nav>${mobileNav}
  </div></header>
  <main id="main" class="seo-main"><div class="container seo-container">
    <nav class="seo-breadcrumb" aria-label="Breadcrumb"><ol>${crumbHtml}</ol></nav>
    <article class="seo-article">
      <header class="seo-header"><p class="seo-eyebrow">${dateModified === DATE
        ? `${lang === 'zh' ? '公开评测快照' : 'Public benchmark snapshot'}: ${DATE}`
        : `${lang === 'zh' ? '内容更新' : 'Content updated'}: ${dateModified}`}</p><h1>${esc(h1)}</h1></header>
      ${body}
      <section class="seo-section" aria-labelledby="faq-heading"><h2 id="faq-heading">${lang === 'zh' ? '常见问题' : 'Frequently asked questions'}</h2><div class="faq-list">${faqHtml}</div></section>
      <section class="seo-cta"><h2>${lang === 'zh' ? '用同一提示词比较多个模型' : 'Compare multiple models with one prompt'}</h2><p>${lang === 'zh' ? `ModelAny 是免费开源的浏览器扩展，已在 <a href="${DOWNLOAD}" target="_blank" rel="noopener noreferrer">Chrome 网上应用店</a> 与 <a href="${EDGE_STORE_URL}" target="_blank" rel="noopener noreferrer">Microsoft Edge 加载项</a> 上架。草稿、设置与历史保留在浏览器本地。` : `ModelAny is a free, open-source browser extension available on the <a href="${DOWNLOAD}" target="_blank" rel="noopener noreferrer">Chrome Web Store</a> and <a href="${EDGE_STORE_URL}" target="_blank" rel="noopener noreferrer">Microsoft Edge Add-ons</a>. Drafts, settings, and history remain in your browser.`}</p><a href="${DOWNLOAD}" data-download-cta class="btn btn-primary btn-pill">${downloadLabel}</a></section>
    </article>
  </div></main>
  <footer class="site-footer"><div class="container footer-container"><div class="footer-brand"><span>ModelAny</span></div><nav class="footer-links" aria-label="${lang === 'zh' ? '页脚导航' : 'Footer navigation'}"><a href="${lang === 'zh' ? '/zh/privacy.html' : '/privacy.html'}">${lang === 'zh' ? '隐私' : 'Privacy'}</a><a href="${switchHref}" data-locale-switch="${switchLang}">${switchLabel}</a><a href="${DOWNLOAD}" data-download-cta>${downloadLabel}</a></nav></div></footer>
  <script src="${base}locale.js" defer></script>
  <script src="${base}download.js" defer></script>
  <script src="${base}script.js" defer></script>
${analytics}
  <button class="scroll-top" id="scroll-top" aria-label="Scroll to top" type="button">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
  </button>
  <div class="mobile-cta-bar">
    <a href="${DOWNLOAD}" data-download-cta class="btn btn-primary btn-pill">${downloadLabel}</a>
  </div>
</body>
</html>`;
}

const TITLE_TOKENS = {
  ai: 'AI',
  api: 'API',
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  deepseek: 'DeepSeek',
  gemini: 'Gemini',
  perplexity: 'Perplexity',
  copilot: 'Copilot',
  github: 'GitHub',
  javascript: 'JavaScript',
  java: 'Java',
  python: 'Python',
  leetcode: 'LeetCode',
  powerpoint: 'PowerPoint',
  excel: 'Excel',
  sql: 'SQL',
  hr: 'HR',
  llm: 'LLM',
  vs: 'vs',
  ide: 'IDE',
  sla: 'SLA',
  qwen: 'Qwen',
  kimi: 'Kimi',
  glm: 'GLM',
  doubao: 'Doubao',
  wenxin: 'Wenxin',
  windsurf: 'Windsurf',
  cursor: 'Cursor',
  mistral: 'Mistral',
  llama: 'Llama',
  grok: 'Grok',
};

function titleCase(text) {
  const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'of', 'on', 'or', 'the', 'to', 'with', 'without']);
  const parts = String(text).split(/\s+/).filter(Boolean);
  return parts
    .map((token, index) => {
      const lower = token.toLowerCase();
      if (TITLE_TOKENS[lower]) return TITLE_TOKENS[lower];
      if (/^\d{4}$/.test(token)) return token;
      if (index > 0 && smallWords.has(lower)) return lower;
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join(' ');
}

const SECTION_LABELS = {
  compare: { en: 'Compare', zh: '评测对比' },
  'best-for': { en: 'Best for', zh: '场景选型' },
  alternatives: { en: 'Alternatives', zh: '替代方案' },
  free: { en: 'Free', zh: '免费指南' },
  pricing: { en: 'Pricing', zh: '定价指南' },
};

function sectionLabel(section, lang = 'en') {
  return SECTION_LABELS[section]?.[lang] || titleCase(section);
}

function guideMetaDescription(page, section, items, review, lang) {
  if (review?.summary) return review.summary;
  const names = items.map((item) => displayModelName(item, lang)).join(lang === 'zh' ? '、' : ', ');
  const topic = titleCase(page.keyword);
  const target = displayModelName(items[0] || { name: names, id: '' }, lang);
  if (lang === 'zh') {
    if (section === 'alternatives') return `${topic}：评估 ${target || names} 替代方案的筛选条件、官方来源、公开评测适用范围与同题验证方法。`;
    if (section === 'free') return `${topic}：区分试用、免费套餐、免登录入口与开放 API，并说明如何核对官方条件。`;
    if (section === 'pricing') return `${topic}：按真实用量估算成本，并交叉检查官方文档与迁移风险。`;
    return `${topic}：面向 ${names} 的任务选择标准、官方来源、公开评测适用范围与同题验证方法。`;
  }
  if (section === 'alternatives') return `${topic}: how to evaluate alternatives to ${target || names} with selection criteria, official sources, public-benchmark scope, and a same-prompt validation workflow.`;
  if (section === 'free') return `${topic}: how to distinguish trials, free tiers, no-login entry points, and open APIs—plus how to verify official conditions.`;
  if (section === 'pricing') return `${topic}: estimate cost from real usage, then cross-check official documentation and migration risk.`;
  return `${topic}: task-specific selection criteria for ${names}, official sources, public-benchmark scope, and a same-prompt validation workflow.`;
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
    ? `${names} 公开第三方评测对比：列出双方共有的测试项、精确模型版本、原始来源与适用边界，便于用同一提示词自行验证。`
    : `Public third-party benchmark results, exact model versions, and official sources for ${names}.`;
  const retrievedAt = sharedBenchmarkGroups(page.models)
    .map((group) => group.retrievedAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  const lastmod = retrievedAt ? String(retrievedAt).slice(0, 10) : CONTENT_UPDATED;
  return {
    path,
    url: canonical,
    indexable,
    lastmod,
    content: htmlPage({
      path,
      canonical,
      title: `${h1} | ModelAny`,
      description,
      h1,
      lang,
      body: comparisonBody(page, items, lang),
      indexable,
      dateModified: lastmod,
      localeHref: lang === 'zh' ? '/compare/' : '/zh/benchmarks/',
      breadcrumbs: [
        { name: lang === 'zh' ? '首页' : 'Home', href: lang === 'zh' ? '/zh/' : '/' },
        { name: lang === 'zh' ? '评测数据' : 'Compare', href: lang === 'zh' ? '/zh/benchmarks/' : '/compare/' },
        { name: names, href: canonical },
      ],
    }),
  };
}

function productBody(page, items, lang) {
  const supported = items.filter((item) => item.inModelAny).map((item) => displayModelName(item, lang)).join(lang === 'zh' ? '、' : ', ');
  const browserExtension = page.intent === 'browser-extension';
  const heading = browserExtension
    ? (lang === 'zh' ? '为现有浏览器增加多模型工作流' : 'Add a multi-model workflow to your current browser')
    : (lang === 'zh' ? '把模型选择变成可重复的同题比较' : 'Make model selection a repeatable same-task comparison');
  const intro = browserExtension
    ? (lang === 'zh'
      ? `ModelAny 是一款 Chrome 与 Microsoft Edge 扩展，可把同一个提示词发送到你选择的服务。当前启动列表包括 ${supported}。`
      : `ModelAny is a Chrome and Microsoft Edge extension that sends the same prompt to services you choose. Its current launcher includes ${supported}.`)
    : (lang === 'zh'
      ? '不要把不同模型在不同提示词下的单次输出当作结论。先定义同一个任务和成功标准，再并排检查结果、修改量与限制条件。'
      : 'Do not treat one-off outputs from different prompts as a conclusion. Define one task and success criteria first, then compare results, edits, and constraints side by side.');
  const relatedProduct = browserExtension
    ? (lang === 'zh' ? { href: '/zh/compare-ai-models/', label: '对比大模型：同一提示词验证' } : { href: '/compare-ai-models/', label: 'Compare AI models with the same prompt' })
    : (lang === 'zh' ? { href: '/zh/ai-browser-extension/', label: 'AI 浏览器插件安装说明' } : { href: '/ai-browser-extension/', label: 'ChatGPT Chrome extension installation guide' });
  const extraRelated = lang === 'zh'
    ? `<li><a href="/zh/compare/kimi-vs-chatgpt/">查看 Kimi vs ChatGPT 公开评测</a></li>`
    : `<li><a href="/side-by-side-ai-comparison/">Side-by-side AI comparison workflow</a></li>
            <li><a href="/compare/chatgpt-vs-gemini/">ChatGPT vs Gemini public benchmarks</a></li>`;
  return `<div class="quick-verdict"><h2>${heading}</h2><p>${intro}</p></div>
        <section class="seo-section" aria-labelledby="workflow-heading">
          <h2 id="workflow-heading">${lang === 'zh' ? '建议工作流' : 'Suggested workflow'}</h2>
          <ol>
            <li>${lang === 'zh' ? '写下一个真实任务、输入材料和成功标准。' : 'Write down a real task, its input material, and success criteria.'}</li>
            <li>${lang === 'zh' ? '在 ModelAny 中选择要比较的服务，并使用相同提示词。' : 'Choose the services to compare in ModelAny and use the same prompt.'}</li>
            <li>${lang === 'zh' ? '并排检查事实、可执行性、修改成本和各服务的条款。' : 'Review facts, actionability, editing effort, and each service’s terms side by side.'}</li>
          </ol>
        </section>
        <section class="seo-section" aria-labelledby="install-heading">
          <h2 id="install-heading">${lang === 'zh' ? '安装 ModelAny' : 'Install ModelAny'}</h2>
          <p>${lang === 'zh' ? '请选择与你当前浏览器匹配的官方商店。扩展采用本地优先设计：草稿、设置和历史保留在浏览器中；提示词只会发送到你选择的 AI 服务。' : 'Choose the official store for your current browser. The extension is local-first: drafts, settings, and history remain in your browser, while prompts are sent only to the AI services you choose.'}</p>
          <p><a href="${DOWNLOAD}" target="_blank" rel="noopener noreferrer">Chrome Web Store</a> · <a href="${EDGE_STORE_URL}" target="_blank" rel="noopener noreferrer">Microsoft Edge Add-ons</a></p>
        </section>
        <section class="seo-section" aria-labelledby="next-step-heading">
          <h2 id="next-step-heading">${lang === 'zh' ? '相关资源' : 'Related resources'}</h2>
          <ul class="seo-index-list">
            <li><a href="${lang === 'zh' ? '/zh/benchmarks/' : '/compare/'}">${lang === 'zh' ? '查看公开评测数据' : 'Browse public model comparisons'}</a></li>
            <li><a href="${relatedProduct.href}">${relatedProduct.label}</a></li>
            ${extraRelated}
          </ul>
        </section>
        ${publicEvidenceHtml(page.models, lang)}
        ${sourcesHtml(items, lang)}`;
}

function generateProductPage(page) {
  const lang = page.lang || 'en';
  const prefix = page.pathPrefix ? `${page.pathPrefix}/` : '';
  const canonical = `/${prefix}${page.slug}/`;
  const path = `${prefix}${page.slug}/index.html`;
  const items = resolveModels(page.models);
  const h1 = page.h1 || (lang === 'zh'
    ? (page.intent === 'browser-extension' ? 'AI 浏览器扩展：用同一提示词比较多个模型' : '并排比较 AI 模型：用同一提示词验证答案')
    : (page.intent === 'browser-extension'
      ? 'AI Browser Extension for Comparing Multiple Models'
      : page.slug === 'side-by-side-ai-comparison'
        ? 'Side-by-Side AI Comparison with the Same Prompt'
        : 'Compare AI Models Side by Side with the Same Prompt'));
  const description = page.description || (lang === 'zh'
    ? '了解如何通过 ModelAny 在 Chrome 和 Microsoft Edge 中用同一提示词比较多个 AI 服务。'
    : page.intent === 'browser-extension'
      ? 'Install a Chrome or Microsoft Edge AI browser extension for a local-first, same-prompt model comparison workflow.'
      : page.slug === 'side-by-side-ai-comparison'
        ? 'Use a repeatable side-by-side AI comparison workflow to evaluate multiple model responses against the same task.'
        : 'Compare AI models with the same prompt in Chrome or Microsoft Edge, then review answers, edits, and provider terms side by side.');
  return {
    path,
    url: canonical,
    indexable: true,
    lastmod: CONTENT_UPDATED,
    content: htmlPage({
      path,
      canonical,
      title: page.title || `${h1} | ModelAny`,
      description,
      h1,
      lang,
      indexable: true,
      dateModified: CONTENT_UPDATED,
      localeHref: page.localePath || (lang === 'zh' ? '/' : '/zh/'),
      alternateUrl: page.localePath,
      body: productBody(page, items, lang),
      breadcrumbs: [
        { name: lang === 'zh' ? '首页' : 'Home', href: lang === 'zh' ? '/zh/' : '/' },
        { name: h1, href: canonical },
      ],
    }),
  };
}

function generateDraft(page, section, items, tests, lang = 'en') {
  const canonical = `/${section}/${page.slug}/`;
  const path = `${section}/${page.slug}/index.html`;
  const review = approvedReview(tests, section, page.slug);
  const indexable = true;
  const h1 = lang === 'zh' ? page.keyword : titleCase(page.keyword);
  const description = guideMetaDescription(page, section, items, review, lang);
  return {
    path,
    url: canonical,
    indexable,
    lastmod: review?.reviewedAt || CONTENT_UPDATED,
    content: htmlPage({
      path,
      canonical,
      title: `${h1} | ModelAny`,
      description,
      h1,
      lang,
      body: researchBody(page, section, items, lang, review),
      indexable,
      dateModified: review?.reviewedAt || CONTENT_UPDATED,
      breadcrumbs: [
        { name: lang === 'zh' ? '首页' : 'Home', href: lang === 'zh' ? '/zh/' : '/' },
        { name: sectionLabel(section, lang), href: `/${section}/` },
        { name: h1, href: canonical },
      ],
    }),
  };
}

function generateHub(section, label, pages, lang = 'en') {
  const canonical = `/${section}/`;
  const path = `${section}/index.html`;
  const publishablePages = pages.filter((page) => !page.canonicalSlug);
  const links = publishablePages.map((page) => {
    const linkLabel = lang === 'zh' ? page.keyword : titleCase(page.keyword);
    return `<li><a href="/${section}/${page.slug}/">${esc(linkLabel)}</a></li>`;
  }).join('');
  const indexable = publishablePages.length > 0;
  const hubCopy = {
    'best-for': 'Practical guides for choosing an AI workflow by task. Each page covers what to evaluate, where public benchmarks apply, and how to validate the same prompt.',
    alternatives: 'Guides for replacing a current AI tool based on clear constraints—without claiming a universal ranking.',
    free: 'Guides to free access, free tiers, no-login options, and official conditions that can vary by region.',
    pricing: 'Cost-planning guides focused on your usage patterns, official documentation, and migration risk.',
  };
  return {
    path,
    url: canonical,
    indexable,
    content: htmlPage({
      path,
      canonical,
      title: `${label} | ModelAny`,
      description: indexable
        ? (hubCopy[section] || 'Compare AI models using public third-party benchmark evidence, exact model versions, source links, and clearly stated limits.')
        : `${label} guide hub.`,
      h1: label,
      lang,
      indexable,
      pageType: 'CollectionPage',
      body: section === 'compare'
        ? `<div class="quick-verdict"><h2>Evidence before rankings</h2><p>Every comparison below uses results where the models appear in the same public benchmark category. Metrics stay separate, exact model versions are shown, and no single score is treated as a universal ranking.</p></div><section class="seo-section"><h2>Published AI model comparisons</h2><ul class="seo-index-list">${links}</ul></section><section class="seo-section"><h2>ChatGPT vs Gemini vs Claude</h2><p>Searches for three-way comparisons still resolve to pairwise evidence. Read each shared-benchmark page, then run the same prompt in ModelAny instead of treating a single blended score as a ranking.</p><ul class="seo-index-list"><li><a href="/compare/chatgpt-vs-claude/">ChatGPT vs Claude</a></li><li><a href="/compare/chatgpt-vs-gemini/">ChatGPT vs Gemini</a></li><li><a href="/compare/claude-vs-gemini/">Claude vs Gemini</a></li></ul></section><section class="seo-section"><h2>Try the same prompt yourself</h2><p>Define a repeatable task, compare answers side by side, and review editing cost before choosing a workflow.</p><ul class="seo-index-list"><li><a href="/compare-ai-models/">Compare AI models with the same prompt</a></li><li><a href="/side-by-side-ai-comparison/">Side-by-side AI comparison workflow</a></li><li><a href="/ai-browser-extension/">ChatGPT Chrome extension for comparing models</a></li></ul></section><section class="seo-section"><h2>How these comparisons are reviewed</h2><p>Each page preserves the source leaderboard, retrieval time, metric, exact model version, and stated test limitations.</p><p><a href="/benchmarks/">Browse all benchmark snapshots by scenario</a></p></section>`
        : `<div class="quick-verdict"><h2>Browse by intent</h2><p>${esc(hubCopy[section] || `${label} pages are organized around a distinct search and product-selection intent.`)}</p></div><section class="seo-section"><h2>${label}</h2><ul class="seo-index-list">${links}</ul></section><section class="seo-section"><h2>Use these guides responsibly</h2><p>Availability, prices, and model behavior can change. Open the official sources, test a representative task, and keep human review for decisions with meaningful impact.</p></section>`,
      breadcrumbs: [{ name: 'Home', href: '/' }, { name: label, href: canonical }],
    }),
  };
}

function writeRedirectConfig() {
  const vercelPath = join(ROOT, 'vercel.json');
  const existing = existsSync(vercelPath) ? JSON.parse(readFileSync(vercelPath, 'utf8')) : {};
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
  const redirects = [
    { source: '/index.html', destination: '/', permanent: true },
    ...pairRedirects,
    ...removedCompareRedirects,
  ];
  writeFileSync(vercelPath, `${JSON.stringify({ ...existing, redirects }, null, 2)}\n`, 'utf8');
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
    { url: '/', lastmod: CONTENT_UPDATED },
    { url: '/zh/', lastmod: CONTENT_UPDATED },
    { url: '/benchmarks/', lastmod: '2026-07-26' },
    { url: '/zh/benchmarks/', lastmod: '2026-07-26' },
    { url: '/privacy.html', lastmod: '2026-07-12' },
    { url: '/zh/privacy.html', lastmod: '2026-07-14' },
    ...indexable.map((record) => ({
      url: record.url,
      lastmod: record.lastmod || CONTENT_UPDATED,
    })),
  ];
  const languagePairs = {
    '/': { en: '/', zh: '/zh/' },
    '/zh/': { en: '/', zh: '/zh/' },
    '/benchmarks/': { en: '/benchmarks/', zh: '/zh/benchmarks/' },
    '/zh/benchmarks/': { en: '/benchmarks/', zh: '/zh/benchmarks/' },
    '/privacy.html': { en: '/privacy.html', zh: '/zh/privacy.html' },
    '/zh/privacy.html': { en: '/privacy.html', zh: '/zh/privacy.html' },
    '/ai-browser-extension/': { en: '/ai-browser-extension/', zh: '/zh/ai-browser-extension/' },
    '/zh/ai-browser-extension/': { en: '/ai-browser-extension/', zh: '/zh/ai-browser-extension/' },
    '/compare-ai-models/': { en: '/compare-ai-models/', zh: '/zh/compare-ai-models/' },
    '/zh/compare-ai-models/': { en: '/compare-ai-models/', zh: '/zh/compare-ai-models/' },
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
    <lastmod>${entry.lastmod || CONTENT_UPDATED}</lastmod>${alternates}
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
for (const page of productPages) records.push(generateProductPage(page));

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
