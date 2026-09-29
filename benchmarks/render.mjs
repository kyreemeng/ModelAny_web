#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isValidSnapshot } from './sources.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SNAPSHOT_PATH = join(ROOT, 'benchmarks', 'data', 'latest.json');
const START = '<!-- benchmark-static:start -->';
const END = '<!-- benchmark-static:end -->';

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(value, lang) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '-';
  return new Intl.DateTimeFormat(lang === 'zh' ? 'zh-CN' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

/** Display order: strongest-known general categories first inside each source. */
const CATEGORY_ORDER = {
  arena: ['text', 'code', 'search'],
  livebench: ['Agentic Coding', 'Coding', 'Mathematics', 'Reasoning', 'Data Analysis', 'Instruction Following', 'Language'],
  swebench: ['Verified'],
};

const CATEGORY_LABEL = {
  arena: {
    text: { en: 'General chat preference', zh: '通用对话偏好' },
    code: { en: 'Coding preference', zh: '编程偏好' },
    search: { en: 'Search-style preference', zh: '搜索类偏好' },
  },
  livebench: {
    'Agentic Coding': { en: 'Agentic coding', zh: '智能体编程' },
    Coding: { en: 'Coding tasks', zh: '编程任务' },
    Mathematics: { en: 'Mathematics', zh: '数学' },
    Reasoning: { en: 'Reasoning', zh: '推理' },
    'Data Analysis': { en: 'Data analysis', zh: '数据分析' },
    'Instruction Following': { en: 'Instruction following', zh: '指令遵循' },
    Language: { en: 'Language tasks', zh: '语言任务' },
  },
  swebench: {
    Verified: { en: 'Real software-issue fixing', zh: '真实软件问题修复' },
  },
};

const LABELS = {
  en: {
    leadersTitle: 'Who leads each test',
    leadersNote: 'The gold row is the top scorer of that official test category. It is not an overall ranking: scores from different benchmarks cannot be combined.',
    legend: 'Rank · Model family · Exact model version · Score',
    families: 'model families compared',
    source: 'Open original leaderboard',
    updated: 'Retrieved',
    sources: 'official sources',
    records: 'records',
    votes: 'votes',
    detailTitle: 'Full standings by source',
    detailNote: 'Each bar is the best-scoring configuration per model family in that test, so one vendor with many agent setups does not crowd out the others. Expand the original leaderboard for every row.',
  },
  zh: {
    leadersTitle: '每项测试的领先者',
    leadersNote: '金色行是该官方测试类别的第一名。这不是全面总排名：不同基准的分数不能相加或直接比较。',
    legend: '排名 · 模型家族 · 精确模型版本 · 成绩',
    families: '个模型家族参与对比',
    source: '查看原始排行榜',
    updated: '抓取时间',
    sources: '个官方来源',
    records: '条记录',
    votes: '票',
    detailTitle: '按来源查看完整名次',
    detailNote: '每个条形代表该测试中一个模型家族的最好成绩配置，避免同一厂商的多个代理配置挤占榜单。完整名单请展开原始排行榜。',
  },
};

function fmtScore(record) {
  if (record.unit === '%') return `${record.score.toFixed(1)}%`;
  if (record.unit === 'Elo') return String(Math.round(record.score));
  return record.score.toFixed(1);
}

/**
 * Collapse a flat record list into "best configuration per model family",
 * sorted by score, so the leader and the runner-ups are visible at a glance
 * while the exact model version stays on the row for verification.
 */
function bestPerProduct(group) {
  const byProduct = new Map();
  for (const record of group) {
    const family = record.product || record.modelExactName;
    const previous = byProduct.get(family);
    if (!previous || record.score > previous.score || (record.score === previous.score && record.rank < previous.rank)) {
      byProduct.set(family, record);
    }
  }
  return [...byProduct.entries()]
    .map(([family, record]) => ({ family, record }))
    .sort((a, b) => b.record.score - a.record.score || a.record.rank - b.record.rank);
}

function buildGroups(snapshot) {
  const groups = new Map();
  for (const record of snapshot.records) {
    const key = `${record.source}:${record.category}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }
  const out = [];
  for (const sourceId of Object.keys(CATEGORY_ORDER)) {
    for (const category of CATEGORY_ORDER[sourceId] || []) {
      const group = groups.get(`${sourceId}:${category}`);
      if (group?.length) out.push({ sourceId, category, group, products: bestPerProduct(group) });
    }
  }
  return out;
}

function barList(products, { limit = 8, votesLabel } = {}) {
  const max = products[0]?.record.score || 1;
  return `<ol class="bm-bars">
            ${products.slice(0, limit).map(({ family, record }, index) => {
              const rank = index + 1;
              const width = Math.max(4, Math.round((record.score / max) * 100));
              const exact = record.modelExactName && record.modelExactName !== family
                ? `<em>${esc(record.modelExactName)}</em>`
                : '';
              const votes = record.sampleSize
                ? `<span class="bm-votes">${Number(record.sampleSize).toLocaleString('en-US')} ${votesLabel}</span>`
                : '';
              return `<li class="bm-row${rank === 1 ? ' is-leader' : ''}">
                  <div class="bm-row-head">
                    <span class="bm-rank${rank <= 3 ? ` is-${rank}` : ''}" aria-label="rank ${rank}">${rank}</span>
                    <span class="bm-who"><strong>${esc(family)}</strong>${exact}</span>
                    <span class="bm-val">${esc(fmtScore(record))}${votes}</span>
                  </div>
                  <div class="bm-bar" aria-hidden="true"><i style="width:${width}%"></i></div>
                </li>`;
            }).join('\n            ')}
          </ol>`;
}

function render(snapshot, lang) {
  const labels = LABELS[lang] || LABELS.en;
  const sourceById = new Map(snapshot.sources.map((source) => [source.id, source]));
  const groups = buildGroups(snapshot);
  if (!groups.length) {
    return `${START}<p class="benchmark-empty">${lang === 'zh' ? '暂无可展示的成绩。' : 'No displayable results in this snapshot yet.'}</p>${END}`;
  }

  const freshSources = snapshot.sources.filter((source) => source.status === 'fresh').length;

  const leaderCards = groups.map(({ sourceId, category, products }) => {
    const source = sourceById.get(sourceId);
    const label = CATEGORY_LABEL[sourceId]?.[category]?.[lang] || category;
    const top3 = products.slice(0, 3);
    const max = top3[0]?.record.score || 1;
    return `<article class="bm-card">
              <header class="bm-card-head">
                <h3>${esc(source?.name || sourceId)}<span class="bm-card-cat">${esc(label)}</span></h3>
                <span class="bm-chip">${esc(source?.metric || '')}${source?.metric ? ' · ' : ''}${esc(products[0].record.unit)}</span>
              </header>
              <ol class="bm-top3">
                ${top3.map(({ family, record }, index) => {
                  const exact = record.modelExactName && record.modelExactName !== family
                    ? `<em>${esc(record.modelExactName)}</em>`
                    : '';
                  return `<li class="is-${index + 1}">
                    <span class="bm-rank is-${index + 1}">${index + 1}</span>
                    <span class="bm-who"><strong>${esc(family)}</strong>${exact}</span>
                    <span class="bm-val">${esc(fmtScore(record))}</span>
                    <span class="bm-minibar" aria-hidden="true"><i style="width:${Math.max(6, Math.round((record.score / max) * 100))}%"></i></span>
                  </li>`;
                }).join('\n                ')}
              </ol>
            </article>`;
  }).join('\n            ');

  const detailSections = [...new Set(groups.map(({ sourceId }) => sourceId))].map((sourceId) => {
    const source = sourceById.get(sourceId);
    const sourceGroups = groups.filter(({ sourceId: id }) => id === sourceId);
    const totalFamilies = new Set(sourceGroups.flatMap(({ group }) => group.map((record) => record.product || record.modelExactName))).size;
    return `<section class="bm-source" id="${esc(sourceId)}">
              <header class="bm-source-head">
                <div>
                  <h2>${esc(source?.name || sourceId)}</h2>
                  <p class="bm-source-meta">${lang === 'zh' ? `${totalFamilies} ${labels.families}` : `${totalFamilies} ${labels.families}`} · ${esc(formatDate(snapshot.retrievedAt, lang))}</p>
                </div>
                <a href="${esc(source?.sourceUrl || sourceGroups[0].group[0].sourceUrl)}" target="_blank" rel="noopener noreferrer">${labels.source}</a>
              </header>
              <p class="bm-disclaimer">${esc(source?.disclaimer?.[lang] || '')}</p>
              ${sourceGroups.map(({ category, products }) => {
                const label = CATEGORY_LABEL[sourceId]?.[category]?.[lang] || category;
                return `<article class="bm-block">
                          <h3>${esc(label)}</h3>
                          ${barList(products, { votesLabel: labels.votes })}
                        </article>`;
              }).join('\n              ')}
            </section>`;
  }).join('\n            ');

  const warnings = snapshot.refreshWarnings?.length
    ? `<p class="benchmark-warning">${lang === 'zh' ? '抓取提示' : 'Refresh notes'}: ${esc(snapshot.refreshWarnings.join(' | '))}</p>`
    : '';

  return `${START}
          <div class="bm-strip">
            <p class="benchmark-updated">${labels.updated}: ${esc(formatDate(snapshot.retrievedAt, lang))} · ${freshSources} ${labels.sources} · ${snapshot.records.length} ${labels.records}</p>
            <p class="bm-strip-note">${esc(labels.leadersNote)}</p>
          </div>
          <section class="bm-leaders" aria-labelledby="bm-leaders-title">
            <h2 id="bm-leaders-title">${esc(labels.leadersTitle)}</h2>
            <p class="bm-legend">${esc(labels.legend)}</p>
            <div class="bm-grid">
              ${leaderCards}
            </div>
          </section>
          <section class="bm-details" aria-labelledby="bm-details-title">
            <h2 id="bm-details-title">${esc(labels.detailTitle)}</h2>
            <p class="bm-strip-note">${esc(labels.detailNote)}</p>
            ${detailSections}
          </section>
          ${warnings}
          ${END}`;
}

async function updatePage(path, snapshot, lang) {
  const html = await readFile(path, 'utf8');
  const replacement = render(snapshot, lang);
  const pattern = new RegExp(`${START}[\\s\\S]*?${END}`);
  if (!pattern.test(html)) throw new Error(`Static benchmark markers missing in ${path}`);
  await writeFile(path, html.replace(pattern, replacement), 'utf8');
}

export async function renderBenchmarkPages() {
  const snapshot = JSON.parse(await readFile(SNAPSHOT_PATH, 'utf8'));
  if (!isValidSnapshot(snapshot)) throw new Error('Refusing to render an invalid benchmark snapshot');
  await Promise.all([
    updatePage(join(ROOT, 'benchmarks', 'index.html'), snapshot, 'en'),
    updatePage(join(ROOT, 'zh', 'benchmarks', 'index.html'), snapshot, 'zh'),
  ]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await renderBenchmarkPages();
  console.log('Rendered crawlable benchmark HTML for English and Chinese pages.');
}
