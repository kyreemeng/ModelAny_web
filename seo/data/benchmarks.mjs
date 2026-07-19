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

const CATEGORY_LABEL = {
  text: { en: 'general chat preference', zh: '通用对话偏好' },
  search: { en: 'search-style preference', zh: '搜索类偏好' },
  code: { en: 'coding preference', zh: '编程偏好' },
  Verified: { en: 'real software-issue fixing', zh: '真实软件问题修复' },
};

const SOURCE_PLAIN = {
  arena: {
    en: 'Arena asks people to pick the better answer without knowing which model wrote it. Higher Elo means more people preferred that model in that category.',
    zh: 'Arena 会让用户在不知道模型身份的情况下选出更好的回答。Elo 越高，说明该类别里越多人偏好这个模型。',
  },
  swebench: {
    en: 'SWE-bench Verified measures how often an AI coding setup can fix real GitHub issues. A higher resolved percentage means more issues were fixed in that test.',
    zh: 'SWE-bench Verified 衡量的是 AI 编程系统修好真实 GitHub 问题的比例。解决率越高，说明那次测试里修好的问题越多。',
  },
  livebench: {
    en: 'LiveBench scores models on regularly refreshed objective tasks. Higher category scores mean better measured performance on that task type.',
    zh: 'LiveBench 用定期更新的客观题目给模型打分。类别分数越高，说明该类任务上的测量表现更好。',
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

export function sharedBenchmarkGroups(modelIds) {
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

  return groups.sort((a, b) => a.source.localeCompare(b.source) || a.category.localeCompare(b.category));
}

export function hasSharedBenchmarkData(modelIds) {
  return sharedBenchmarkGroups(modelIds).length > 0;
}
