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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = join(ROOT, 'benchmarks', 'data');
const LATEST_PATH = join(DATA_DIR, 'latest.json');
const timeout = AbortSignal.timeout(25_000);

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json,text/html;q=0.9,*/*;q=0.1', 'user-agent': 'ModelAnyBenchmarkBot/1.0 (+https://modelany.app/benchmarks/)' },
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

async function refreshLivebench() {
  const html = await fetchText(SOURCES.livebench.machineUrl);
  const candidates = extractJsonScripts(html);
  const rows = candidates.flatMap((item) => {
    if (Array.isArray(item)) return item;
    return Object.values(item).filter(Array.isArray).flat();
  });
  const records = [];
  for (const row of rows) {
    const model = row?.model || row?.Model;
    if (!model) continue;
    for (const category of ['Reasoning', 'Coding', 'Agentic Coding', 'Mathematics', 'Data Analysis', 'Language', 'Instruction Following']) {
      const value = row[category] ?? row[category.replaceAll(' ', '_')];
      if (!Number.isFinite(Number(value))) continue;
      records.push(makeRecord('livebench', model, Number(value), Number(row.rank || row.Rank || 0), {
        category,
        benchmarkVersion: row.release || row.date || null,
      }));
    }
  }
  if (!records.length) throw new Error('official LiveBench structured rows not found');
  return records.filter((record) => record.rank > 0);
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
  console.log(`Wrote ${records.length} records from ${new Set(records.map((record) => record.source)).size} sources.`);
  if (failures.length) console.warn(`Partial refresh: ${failures.join(' | ')}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
