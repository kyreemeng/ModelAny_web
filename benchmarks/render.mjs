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

/** Compact column headers for the cross-test podium matrix. */
const MATRIX_SHORT = {
  arena: {
    text: { en: 'Chat', zh: '对话' },
    code: { en: 'Code pref', zh: '代码偏好' },
    search: { en: 'Search', zh: '搜索' },
  },
  livebench: {
    'Agentic Coding': { en: 'Agentic', zh: '智能体' },
    Coding: { en: 'Coding', zh: '编程' },
    Mathematics: { en: 'Math', zh: '数学' },
    Reasoning: { en: 'Reasoning', zh: '推理' },
    'Data Analysis': { en: 'Data', zh: '数据' },
    'Instruction Following': { en: 'Instruct', zh: '指令' },
    Language: { en: 'Language', zh: '语言' },
  },
  swebench: {
    Verified: { en: 'SWE-bench', zh: 'SWE' },
  },
};

const LABELS = {
  en: {
    leadersTitle: 'Who leads each test',
    leadersNote: 'The gold panel marks the top scorer of that official test category, with the gap to the runner-ups shown beside each score. It is not an overall ranking: scores from different benchmarks cannot be combined.',
    legend: 'Rank · Model family · Exact model version · Score',
    gapToTop: 'gap to first place',
    matrixTitle: 'The podium map across all tests',
    matrixNote: 'Each row is a model family, sorted by most first places. A cell shows where that family lands in the test column — only top-3 finishes are marked, and every column keeps its own benchmark’s score.',
    matrixFamilyCol: 'Model family',
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
    leadersNote: '金色面板是该官方测试类别的第一名，亚军与季军旁标注了与第一名的差距。这不是全面总排名：不同基准的分数不能相加或直接比较。',
    legend: '排名 · 模型家族 · 精确模型版本 · 成绩',
    gapToTop: '与第一名的差距',
    matrixTitle: '全部测试的领奖台地图',
    matrixNote: '每一行是一个模型家族，按第一名数量排序。单元格显示该家族在对应测试中的名次，仅标注前三名，且每列保留各自基准的独立分数。',
    matrixFamilyCol: '模型家族',
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

/** Human-readable gap to the current leader, e.g. "−13" or "−2.4". */
function fmtDelta(leaderScore, record) {
  const gap = leaderScore - record.score;
  if (!(gap > 0)) return '';
  const value = record.unit === 'Elo' ? String(Math.round(gap)) : gap.toFixed(1);
  return `−${value}`;
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

function whoHtml(family, record) {
  const exact = record.modelExactName && record.modelExactName !== family
    ? `<em>${esc(record.modelExactName)}</em>`
    : '';
  return `<span class="bm-who"><strong>${esc(family)}</strong>${exact}</span>`;
}

function leaderCard({ sourceId, category, products }, { source, lang, labels }) {
  const label = CATEGORY_LABEL[sourceId]?.[category]?.[lang] || category;
  const [first, ...rest] = products;
  const leaderScore = first.record.score;
  const runnerRows = rest.slice(0, 2).map(({ family, record }, index) => {
    const rank = index + 2;
    const delta = fmtDelta(leaderScore, record);
    return `<li class="bm-runner">
                  <span class="bm-medal is-${rank}" aria-label="rank ${rank}">${rank}</span>
                  ${whoHtml(family, record)}
                  ${delta ? `<span class="bm-delta" title="${esc(labels.gapToTop)}">${esc(delta)}</span>` : '<span class="bm-delta" aria-hidden="true"></span>'}
                  <span class="bm-val">${esc(fmtScore(record))}</span>
                </li>`;
  }).join('\n                ');
  return `<article class="bm-card">
              <header class="bm-card-head">
                <p class="bm-card-src">${esc(source?.name || sourceId)}</p>
                <h3>${esc(label)}</h3>
                <span class="bm-chip">${esc(first.record.unit)}</span>
              </header>
              <div class="bm-champ">
                <span class="bm-medal is-1" aria-label="rank 1">1</span>
                ${whoHtml(first.family, first.record)}
                <span class="bm-champ-score">${esc(fmtScore(first.record))}</span>
              </div>
              <ol class="bm-runners">
                ${runnerRows}
              </ol>
            </article>`;
}

/**
 * Cross-test podium matrix: one row per model family that reached a top-3
 * spot, one column per test. Rows are sorted by gold, then silver, then bronze.
 */
function matrixHtml(groups, { sourceById, lang, labels }) {
  const tests = groups.map(({ sourceId, category, products }) => {
    const source = sourceById.get(sourceId);
    const fullLabel = `${source?.name || sourceId} · ${CATEGORY_LABEL[sourceId]?.[category]?.[lang] || category}`;
    return {
      short: MATRIX_SHORT[sourceId]?.[category]?.[lang] || category,
      full: fullLabel,
      top3: new Map(products.slice(0, 3).map(({ family }, index) => [family, index + 1])),
    };
  });

  const tally = new Map();
  for (const test of tests) {
    for (const [family, rank] of test.top3) {
      if (!tally.has(family)) tally.set(family, [0, 0, 0]);
      tally.get(family)[rank - 1] += 1;
    }
  }
  const rows = [...tally.entries()].sort((a, b) =>
    b[1][0] - a[1][0] || b[1][1] - a[1][1] || b[1][2] - a[1][2] || a[0].localeCompare(b[0]));

  const headCells = tests.map(({ short, full }) =>
    `<th scope="col" title="${esc(full)}">${esc(short)}</th>`).join('');

  const bodyRows = rows.map(([family, counts]) => {
    const tallyBits = [['g', counts[0]], ['s', counts[1]], ['b', counts[2]]]
      .filter(([, count]) => count > 0)
      .map(([cls, count]) => `<i class="${cls}"></i>${count}`)
      .join(' ');
    const cells = tests.map(({ top3 }) => {
      const rank = top3.get(family);
      return rank
        ? `<td class="bm-mx-cell is-${rank}"><span aria-label="rank ${rank}">${rank}</span></td>`
        : '<td class="bm-mx-empty" aria-label="not on podium"><span>·</span></td>';
    }).join('');
    return `<tr>
              <th scope="row" class="bm-mx-family"><strong>${esc(family)}</strong><span class="bm-tally">${tallyBits}</span></th>
              ${cells}
            </tr>`;
  }).join('\n            ');

  return `<section class="bm-matrix-sec" aria-labelledby="bm-matrix-title">
            <h2 id="bm-matrix-title">${esc(labels.matrixTitle)}</h2>
            <p class="bm-strip-note">${esc(labels.matrixNote)}</p>
            <div class="bm-matrix-wrap" role="region" aria-label="${esc(labels.matrixTitle)}" tabindex="0">
              <table class="bm-matrix">
                <thead>
                  <tr>
                    <th scope="col">${esc(labels.matrixFamilyCol)}</th>
                    ${headCells}
                  </tr>
                </thead>
                <tbody>
                  ${bodyRows}
                </tbody>
              </table>
            </div>
          </section>`;
}

function barList(products, { limit = 8, votesLabel } = {}) {
  const max = products[0]?.record.score || 1;
  return `<ol class="bm-bars">
            ${products.slice(0, limit).map(({ family, record }, index) => {
              const rank = index + 1;
              const width = Math.max(4, Math.round((record.score / max) * 100));
              const delta = fmtDelta(max, record);
              const votes = record.sampleSize
                ? `<span class="bm-votes">${Number(record.sampleSize).toLocaleString('en-US')} ${votesLabel}</span>`
                : '';
              return `<li class="bm-row${rank === 1 ? ' is-leader' : ''}">
                  <div class="bm-row-head">
                    <span class="bm-rank${rank <= 3 ? ` is-${rank}` : ''}" aria-label="rank ${rank}">${rank}</span>
                    ${whoHtml(family, record)}
                    <span class="bm-val">${esc(fmtScore(record))}${delta ? `<span class="bm-delta">${esc(delta)}</span>` : ''}${votes}</span>
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

  const leaderCards = groups.map((group) => leaderCard(group, {
    source: sourceById.get(group.sourceId),
    lang,
    labels,
  })).join('\n            ');

  const detailSections = [...new Set(groups.map(({ sourceId }) => sourceId))].map((sourceId) => {
    const source = sourceById.get(sourceId);
    const sourceGroups = groups.filter(({ sourceId: id }) => id === sourceId);
    const totalFamilies = new Set(sourceGroups.flatMap(({ group }) => group.map((record) => record.product || record.modelExactName))).size;
    return `<section class="bm-source" id="${esc(sourceId)}">
              <header class="bm-source-head">
                <div>
                  <h2>${esc(source?.name || sourceId)}</h2>
                  <p class="bm-source-meta">${totalFamilies} ${labels.families} · ${esc(formatDate(snapshot.retrievedAt, lang))}</p>
                </div>
                <a href="${esc(source?.sourceUrl || sourceGroups[0].group[0].sourceUrl)}" target="_blank" rel="noopener noreferrer">${labels.source}</a>
              </header>
              <p class="bm-disclaimer">${esc(source?.disclaimer?.[lang] || '')}</p>
              <div class="bm-source-body">
              ${sourceGroups.map(({ category, products }) => {
                const label = CATEGORY_LABEL[sourceId]?.[category]?.[lang] || category;
                return `<article class="bm-block">
                          <h3>${esc(label)}</h3>
                          ${barList(products, { votesLabel: labels.votes })}
                        </article>`;
              }).join('\n              ')}
              </div>
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
          ${matrixHtml(groups, { sourceById, lang, labels })}
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
