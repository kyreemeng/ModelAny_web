#!/usr/bin/env node
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SNAPSHOT_SCHEMA_VERSION,
  SOURCES,
  isValidSnapshot,
  resolveProduct,
} from './sources.mjs';
import { renderBenchmarkPages } from './render.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'benchmarks', 'data');
const LATEST_PATH = join(DATA_DIR, 'latest.json');
const timeout = AbortSignal.timeout(25_000);

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json,text/html;q=0.9,*/*;q=0.1', 'user-agent': 'ModelAnyBenchmarkBot/1.0 (+https://www.modelany.app/benchmarks/)' },
    signal: timeout,
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.text();
}

function makeRecord(source, modelExactName, score, rank, extras = {}) {
  return {
    source,
    sourceUrl: SOURCES[source].sourceUrl,
    retrievedAt: new Date().toISOString(),
    publishedAt: extras.publishedAt || null,
    benchmarkVersion: extras.benchmarkVersion || null,
    category: extras.category || null,
    metric: extras.metric || SOURCES[source].metric,
    unit: extras.unit || SOURCES[source].unit,
    modelExactName,
    product: resolveProduct(modelExactName),
    score: Number(score),
    rank: Number(rank),
    sampleSize: Number.isFinite(extras.sampleSize) ? extras.sampleSize : null,
    confidenceInterval: Number.isFinite(extras.confidenceInterval) ? extras.confidenceInterval : null,
  };
}

async function refreshArena() {
  const records = [];
  const failures = [];
  for (const category of ['text', 'search', 'code']) {
    try {
      const data = JSON.parse(await fetchText(`${SOURCES.arena.machineUrl}?name=${encodeURIComponent(category)}`));
      if (!Array.isArray(data.models) || !data.models.length) throw new Error('empty model list');
      for (const model of data.models) {
        if (!Number.isFinite(model.score) || !Number.isFinite(model.rank) || !model.model) continue;
        records.push(makeRecord('arena', model.model, model.score, model.rank, {
          category,
          publishedAt: data.meta?.last_updated || null,
          benchmarkVersion: data.meta?.leaderboard || category,
          sampleSize: model.votes,
          confidenceInterval: model.ci,
        }));
      }
    } catch (error) {
      failures.push(`arena/${category}: ${error.message}`);
    }
  }
  return { records, failures };
}

function extractJsonScripts(html) {
  return [...html.matchAll(/<script[^>]*(?:type=["']application\/json["']|id=["'][^"']*(?:data|json)[^"']*["'])[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => {
      try { return JSON.parse(match[1]); } catch { return null; }
    })
    .filter(Boolean);
}

async function refreshSwebench() {
  const html = await fetchText(SOURCES.swebench.machineUrl);
  const data = extractJsonScripts(html).find((item) => Array.isArray(item) && item.some((group) => group?.name === 'Verified'));
  const verified = data?.find((group) => group?.name === 'Verified')?.results;
  if (!verified) throw new Error('official leaderboard JSON not found');
  const rows = Array.isArray(verified) ? verified : Object.values(verified).flat();
  const records = rows
    .map((row, index) => {
      const model = row.model || row.model_name || row.name;
      const score = row.resolved ?? row.score ?? row.percent_resolved;
      if (!model || !Number.isFinite(Number(score))) return null;
      return makeRecord('swebench', model, Number(score), Number(row.rank || index + 1), {
        category: 'Verified',
        benchmarkVersion: row['mini-swe-agent_version'] || row.agent_version || 'Verified',
        publishedAt: row.date || null,
        unit: '%',
        metric: 'Resolved',
      });
    })
    .filter(Boolean);
  if (!records.length) throw new Error('no valid SWE-bench rows');
  return records;
}

function parseCsvRows(text) {
  const rows = [];
  for (const rawLine of text.split(/\r?\n/)) {
    if (!rawLine.trim()) continue;
    const cells = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < rawLine.length; i += 1) {
      const char = rawLine[i];
      if (char === '"') {
        if (quoted && rawLine[i + 1] === '"') { cell += '"'; i += 1; } else quoted = !quoted;
      } else if (char === ',' && !quoted) {
        cells.push(cell); cell = '';
      } else cell += char;
    }
    cells.push(cell);
    rows.push(cells);
  }
  return rows;
}

/**
 * LiveBench is a React SPA: the leaderboard data is not embedded in the HTML.
 * The app bundle contains the release list and fetches
 * `table_<release>.csv` (models x subtask scores) plus
 * `categories_<release>.json` (category -> subtasks) at runtime. This fetcher
 * replicates those requests and averages the official subtask scores per
 * category, which the site publishes as category standing.
 */
async function refreshLivebench() {
  const base = new URL(SOURCES.livebench.machineUrl);
  const html = await fetchText(SOURCES.livebench.machineUrl);
  const bundlePath = (html.match(/static\/js\/main\.[a-f0-9]+\.js/) || [])[0];
  if (!bundlePath) throw new Error('LiveBench app bundle not found in HTML');
  const bundle = await fetchText(new URL(bundlePath, base).href);
  const releaseMatches = [...bundle.matchAll(/\["20\d{2}-\d{2}-\d{2}"(?:\s*,\s*"20\d{2}-\d{2}-\d{2}")+\]/g)];
  if (!releaseMatches.length) throw new Error('LiveBench release list not found in bundle');
  const releases = JSON.parse(releaseMatches.map((match) => match[0]).sort((a, b) => b.length - a.length)[0]);
  const release = releases.filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)).sort().at(-1);
  if (!release) throw new Error('LiveBench release list empty');
  const stamped = release.replaceAll('-', '_');
  const [tableCsv, categoryJson] = await Promise.all([
    fetchText(new URL(`table_${stamped}.csv`, base).href),
    fetchText(new URL(`categories_${stamped}.json`, base).href),
  ]);

  const categories = JSON.parse(categoryJson);
  const rows = parseCsvRows(tableCsv);
  const header = rows[0].map((name) => name.trim());
  const records = [];
  for (const cells of rows.slice(1)) {
    const model = cells[0]?.trim();
    if (!model) continue;
    const subtaskScores = new Map(header.slice(1).map((name, index) => [name, Number(cells[index + 1])]));
    for (const [category, subtasks] of Object.entries(categories)) {
      const values = subtasks.map((subtask) => subtaskScores.get(subtask)).filter((value) => Number.isFinite(value));
      if (!values.length) continue;
      records.push({ model, category, score: values.reduce((sum, value) => sum + value, 0) / values.length });
    }
  }
  if (!records.length) throw new Error('no valid LiveBench rows');

  const byCategory = new Map();
  for (const record of records) {
    if (!byCategory.has(record.category)) byCategory.set(record.category, []);
    byCategory.get(record.category).push(record);
  }
  const labelOf = (category) => (category === 'IF' ? 'Instruction Following' : category);
  const ranked = [];
  for (const [category, items] of [...byCategory].sort()) {
    items.sort((a, b) => b.score - a.score);
    items.forEach((item, index) => {
      ranked.push(makeRecord('livebench', item.model, item.score, index + 1, {
        category: labelOf(category),
        benchmarkVersion: `LiveBench ${release}`,
        publishedAt: release,
        metric: 'Category score',
        unit: 'points',
      }));
    });
  }
  if (!ranked.length) throw new Error('LiveBench category aggregation produced no rows');
  return ranked;
}

async function loadLastValidSnapshot() {
  try {
    const snapshot = JSON.parse(await readFile(LATEST_PATH, 'utf8'));
    return isValidSnapshot(snapshot) ? snapshot : null;
  } catch {
    return null;
  }
}

async function atomicWrite(path, content) {
  const temporary = `${path}.tmp`;
  await writeFile(temporary, content);
  await rename(temporary, path);
}

async function main() {
  const previous = await loadLastValidSnapshot();
  const results = await Promise.allSettled([refreshArena(), refreshSwebench(), refreshLivebench()]);
  const [arenaResult, sweResult, liveResult] = results;
  const records = [
    ...(arenaResult.status === 'fulfilled' ? arenaResult.value.records : []),
    ...(sweResult.status === 'fulfilled' ? sweResult.value : []),
    ...(liveResult.status === 'fulfilled' ? liveResult.value : []),
  ];
  const failures = [
    ...(arenaResult.status === 'fulfilled' ? arenaResult.value.failures : [`arena: ${arenaResult.reason.message}`]),
    ...(sweResult.status === 'rejected' ? [`swebench: ${sweResult.reason.message}`] : []),
    ...(liveResult.status === 'rejected' ? [`livebench: ${liveResult.reason.message}`] : []),
  ];

  if (!records.length) {
    if (previous) {
      console.warn(`No sources refreshed. Keeping ${LATEST_PATH}. ${failures.join(' | ')}`);
      return;
    }
    throw new Error(`No benchmark source returned valid data. ${failures.join(' | ')}`);
  }

  const now = new Date();
  const snapshot = {
    schemaVersion: SNAPSHOT_SCHEMA_VERSION,
    retrievedAt: now.toISOString(),
    sources: Object.values(SOURCES).map((source) => ({
      id: source.id,
      name: source.name,
      authority: source.authority,
      sourceUrl: source.sourceUrl,
      disclaimer: source.disclaimer,
      status: records.some((record) => record.source === source.id) ? 'fresh' : 'stale',
    })),
    records,
    refreshWarnings: failures,
  };
  if (!isValidSnapshot(snapshot)) throw new Error('Refusing to persist invalid snapshot');

  await mkdir(DATA_DIR, { recursive: true });
  const pretty = `${JSON.stringify(snapshot, null, 2)}\n`;
  const date = now.toISOString().slice(0, 10);
  await atomicWrite(join(DATA_DIR, `${date}.json`), pretty);
  await atomicWrite(LATEST_PATH, pretty);
  await renderBenchmarkPages();
  console.log(`Wrote ${records.length} records from ${new Set(records.map((record) => record.source)).size} sources.`);
  if (failures.length) console.warn(`Partial refresh: ${failures.join(' | ')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
