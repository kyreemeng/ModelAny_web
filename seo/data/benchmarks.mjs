/**
 * Plain-language helpers that load the latest public benchmark snapshot
 * and only return records where every compared product shares the same source category.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveProduct } from '../../benchmarks/sources.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LATEST = join(ROOT, 'benchmarks', 'data', 'latest.json');

export const PRODUCT_BY_MODEL_ID = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  deepseek: 'DeepSeek',
  qwen: 'Qwen',
  kimi: 'Kimi',
  glm: 'GLM',
  doubao: 'Doubao',
  wenxin: 'Wenxin',
};

/**
 * Launcher products the public snapshot does not map to any benchmark family
 * yet. They are named here so the hub can show them as unmeasured rows instead
 * of dropping them or printing a raw id.
 */
const FALLBACK_PRODUCT_NAME = {
  grok: 'Grok',
  yuanbao: 'Tencent Yuanbao',
};

const CATEGORY_LABEL = {
  text: { en: 'general chat preference', zh: '通用对话偏好' },
  search: { en: 'search-style preference', zh: '搜索类偏好' },
  code: { en: 'coding preference', zh: '编程偏好' },
  Verified: { en: 'real software-issue fixing', zh: '真实软件问题修复' },
  'Agentic Coding': { en: 'agentic coding', zh: '智能体编程' },
  Coding: { en: 'coding tasks', zh: '编程任务' },
  Mathematics: { en: 'mathematics', zh: '数学' },
  Reasoning: { en: 'reasoning', zh: '推理' },
  'Data Analysis': { en: 'data analysis', zh: '数据分析' },
  'Instruction Following': { en: 'instruction following', zh: '指令遵循' },
  Language: { en: 'language tasks', zh: '语言任务' },
};

const SOURCE_PLAIN = {
  arena: {
    en: 'Arena asks people to pick the better answer without knowing which model wrote it. A higher Elo means more preference votes in that category—not an overall product ranking.',
    zh: 'Arena 让用户在不知道模型身份的情况下选出更好的回答。Elo 越高，说明该类别里偏好票越多——并不等于产品的全面最优。',
  },
  swebench: {
    en: 'SWE-bench Verified measures how often an AI coding setup can fix real GitHub issues. A higher resolved percentage means more issues were fixed in that specific test setup.',
    zh: 'SWE-bench Verified 衡量 AI 编程系统修好真实 GitHub 问题的比例。解决率越高，说明在该次测试设置中修好的问题越多。',
  },
  livebench: {
    en: 'LiveBench scores models on regularly refreshed objective tasks. Higher category scores mean better measured performance on that task type—not a universal ranking.',
    zh: 'LiveBench 用定期更新的客观题目给模型打分。类别分数越高，说明该类任务上的测量表现更好——并不构成通用总排名。',
  },
};

let cachedSnapshot = null;

export function loadBenchmarkSnapshot() {
  if (cachedSnapshot) return cachedSnapshot;
  if (!existsSync(LATEST)) return null;
  cachedSnapshot = JSON.parse(readFileSync(LATEST, 'utf8'));
  return cachedSnapshot;
}

function productKeys(modelIds) {
  return modelIds.map((id) => PRODUCT_BY_MODEL_ID[id]).filter(Boolean);
}

/**
 * Map editorial focus areas to public benchmark categories that are relevant
 * enough to show on the page. Unrelated categories (e.g. SWE-bench on an HR
 * guide) dilute usefulness and confuse searchers.
 */
const FOCUS_CATEGORY_ALLOWLIST = {
  coding: new Set(['code', 'Verified', 'Coding', 'Agentic Coding']),
  writing: new Set(['text', 'Language']),
  reasoning: new Set(['text', 'Reasoning', 'Mathematics']),
  research: new Set(['search', 'text', 'Reasoning', 'Data Analysis']),
  business: new Set(['text', 'search']),
  students: new Set(['text', 'search', 'Instruction Following', 'Reasoning']),
};

export function sharedBenchmarkGroups(modelIds, { focus } = {}) {
  const snapshot = loadBenchmarkSnapshot();
  if (!snapshot?.records?.length) return [];
  const products = productKeys(modelIds);
  if (products.length < 2 || products.length !== modelIds.length) return [];

  const buckets = new Map();
  for (const record of snapshot.records) {
    const product = record.product || resolveProduct(record.modelExactName);
    if (!product || !products.includes(product)) continue;
    const key = `${record.source}::${record.category}`;
    if (!buckets.has(key)) buckets.set(key, new Map());
    const byProduct = buckets.get(key);
    const previous = byProduct.get(product);
    if (!previous || record.rank < previous.rank) byProduct.set(product, { ...record, product });
  }

  const groups = [];
  for (const [key, byProduct] of buckets) {
    if (products.every((product) => byProduct.has(product))) {
      const [source, category] = key.split('::');
      groups.push({
        source,
        category,
        label: CATEGORY_LABEL[category] || { en: category, zh: category },
        plain: SOURCE_PLAIN[source] || { en: '', zh: '' },
        retrievedAt: snapshot.retrievedAt,
        sourceUrl: byProduct.get(products[0]).sourceUrl,
        rows: products.map((product) => byProduct.get(product)),
      });
    }
  }

  const sorted = groups.sort((a, b) => a.source.localeCompare(b.source) || a.category.localeCompare(b.category));
  const allow = FOCUS_CATEGORY_ALLOWLIST[focus];
  if (!allow) return sorted;
  const filtered = sorted.filter((group) => allow.has(group.category));
  // Prefer focus-relevant evidence; fall back to general chat preference, then unfiltered.
  if (filtered.length) return filtered;
  const chatOnly = sorted.filter((group) => group.category === 'text');
  return chatOnly.length ? chatOnly : sorted;
}

export function hasSharedBenchmarkData(modelIds) {
  return sharedBenchmarkGroups(modelIds).length > 0;
}

/**
 * Coverage matrix for the model-comparison hub: one row per launcher model,
 * one column per public test category that at least `minModels` products
 * appear in. A cell is either the best-scoring configuration that product has
 * in that category (score, rank, exact version) or null when the snapshot has
 * no result for it.
 *
 * The nulls are the point: the hub must show which of the eleven web apps have
 * public evidence and which do not, instead of inventing a "best overall" row
 * for products nobody has measured. `coverage` counts the tests a product is
 * actually present in.
 */
export function modelCoverageMatrix(modelIds, minModels = 4) {
  const groups = launcherBenchmarkGroups(modelIds, minModels);
  // The hub lists every launcher entry, including the ones with no public
  // benchmark mapping yet—those rows are the honest "no public evidence" line.
  const products = modelIds.map((id) => PRODUCT_BY_MODEL_ID[id] || FALLBACK_PRODUCT_NAME[id] || id);
  const rows = modelIds.map((id, index) => {
    const product = products[index];
    const cells = groups.map((group) => {
      const candidates = group.rows.filter((row) => row.product === product);
      if (!candidates.length) return null;
      return candidates.reduce((best, row) => (
        !best || row.score > best.score || (row.score === best.score && row.rank < best.rank) ? row : best
      ), null);
    });
    return {
      id,
      product,
      cells,
      coverage: cells.filter(Boolean).length,
      wins: cells.filter((cell, index) => {
        if (!cell) return false;
        const best = Math.max(...groups[index].rows.map((row) => row.score));
        return cell.score === best;
      }).length,
    };
  });
  return {
    tests: groups.map((group) => ({
      source: group.source,
      category: group.category,
      label: group.label,
      unit: group.rows[0]?.unit || '',
      retrievedAt: group.retrievedAt,
      sourceUrl: group.sourceUrl,
    })),
    rows,
    covered: rows.filter((row) => row.coverage > 0).length,
    total: rows.length,
    mapped: groups.length,
    retrievedAt: snapshotRetrievedAt(groups),
  };
}

function snapshotRetrievedAt(groups) {
  return groups
    .map((group) => group.retrievedAt)
    .filter(Boolean)
    .sort()
    .at(-1) || null;
}

/**
 * Benchmark groups for the full launcher set. Unlike sharedBenchmarkGroups,
 * a category is kept when at least `minModels` of the products have a public
 * result in it—models without a result in that test are simply omitted from
 * the table. Used by the AI chat comparison overview page.
 */
export function launcherBenchmarkGroups(modelIds, minModels = 4) {
  const snapshot = loadBenchmarkSnapshot();
  if (!snapshot?.records?.length) return [];
  const products = productKeys(modelIds);
  if (products.length < minModels) return [];

  const buckets = new Map();
  for (const record of snapshot.records) {
    const product = record.product || resolveProduct(record.modelExactName);
    if (!product || !products.includes(product)) continue;
    const key = `${record.source}::${record.category}`;
    if (!buckets.has(key)) buckets.set(key, new Map());
    const byProduct = buckets.get(key);
    const previous = byProduct.get(product);
    if (!previous || record.rank < previous.rank) byProduct.set(product, { ...record, product });
  }

  const groups = [];
  for (const [key, byProduct] of buckets) {
    if (byProduct.size < minModels) continue;
    const [source, category] = key.split('::');
    groups.push({
      source,
      category,
      label: CATEGORY_LABEL[category] || { en: category, zh: category },
      plain: SOURCE_PLAIN[source] || { en: '', zh: '' },
      retrievedAt: snapshot.retrievedAt,
      sourceUrl: [...byProduct.values()][0].sourceUrl,
      rows: [...byProduct.values()],
    });
  }
  const order = { swebench: 0, livebench: 1, arena: 2 };
  return groups.sort((a, b) => (order[a.source] ?? 9) - (order[b.source] ?? 9) || a.category.localeCompare(b.category));
}
