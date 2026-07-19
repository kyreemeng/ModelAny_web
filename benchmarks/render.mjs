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

function render(snapshot, lang) {
  const isZh = lang === 'zh';
  const labels = isZh
    ? { updated: '抓取时间', rank: '排名', model: '精确模型版本', score: '成绩', metric: '指标', samples: '样本 / 投票', source: '查看原始排行榜' }
    : { updated: 'Retrieved', rank: 'Rank', model: 'Exact model', score: 'Score', metric: 'Metric', samples: 'Samples / votes', source: 'Open original leaderboard' };
  const sourceById = new Map(snapshot.sources.map((source) => [source.id, source]));
  const records = [...snapshot.records]
    .sort((a, b) => a.source.localeCompare(b.source) || a.category.localeCompare(b.category) || a.rank - b.rank)
    .slice(0, 40);
  const groups = new Map();
  for (const record of records) {
    const key = `${record.source}:${record.category}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(record);
  }

  const sections = [...groups].map(([key, group]) => {
    const [sourceId, category] = key.split(':');
    const source = sourceById.get(sourceId);
    const rows = group.slice(0, 10).map((record) => `<tr>
                  <td>${esc(record.rank)}</td>
                  <td>${esc(record.modelExactName)}</td>
                  <td>${esc(record.score)}${record.unit === '%' ? '%' : ''}</td>
                  <td>${esc(record.metric)} (${esc(record.unit)})</td>
                  <td>${esc(record.sampleSize || '-')}</td>
                </tr>`).join('\n');
    return `<section class="benchmark-source">
              <div class="benchmark-source-header">
                <h2>${esc(source?.name || sourceId)} · ${esc(category)}</h2>
                <a href="${esc(source?.sourceUrl || group[0].sourceUrl)}" target="_blank" rel="noopener noreferrer">${labels.source}</a>
              </div>
              <p class="benchmark-disclaimer">${esc(source?.disclaimer?.[lang] || '')}</p>
              <div class="benchmark-table-wrap">
                <table class="benchmark-table">
                  <thead><tr><th>${labels.rank}</th><th>${labels.model}</th><th>${labels.score}</th><th>${labels.metric}</th><th>${labels.samples}</th></tr></thead>
                  <tbody>${rows}</tbody>
                </table>
              </div>
            </section>`;
  }).join('\n            ');

  return `${START}
          <div class="benchmark-context"><p class="benchmark-updated">${labels.updated}: ${esc(formatDate(snapshot.retrievedAt, lang))}</p></div>
          ${sections}
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
