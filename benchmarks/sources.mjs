export const SNAPSHOT_SCHEMA_VERSION = 1;

export const SCENES = {
  research: {
    en: 'Research',
    zh: '研究',
    disclaimer: {
      en: 'Research is represented by reasoning, data analysis, and search preference proxies. It is not a measure of source accuracy for every topic.',
      zh: '研究场景使用推理、数据分析与搜索偏好作为代理指标，不能代表所有主题的事实准确性。',
    },
  },
  writing: {
    en: 'Writing',
    zh: '写作',
    disclaimer: {
      en: 'Language and human-preference results are proxies for writing quality, not a universal style ranking.',
      zh: '语言能力与人工偏好结果仅是写作质量的代理指标，不构成通用文风排名。',
    },
  },
  coding: {
    en: 'Coding',
    zh: '编程',
    disclaimer: {
      en: 'SWE-bench evaluates agent systems on repository issues. It must not be compared directly with single-turn coding scores.',
      zh: 'SWE-bench 评测的是代码代理系统解决仓库问题的能力，不能与单轮编程分数直接比较。',
    },
  },
  learning: {
    en: 'Learning',
    zh: '学习',
    disclaimer: {
      en: 'Instruction following, reasoning, and math are learning-support proxies, not a pedagogical-quality certification.',
      zh: '指令遵循、推理与数学成绩仅是学习辅助能力的代理指标，不是教学质量认证。',
    },
  },
  creative: {
    en: 'Creative',
    zh: '创意',
    disclaimer: {
      en: 'Creative-writing preference results reflect the benchmark voters and prompts, not universal creative quality.',
      zh: '创意写作偏好反映的是该基准的投票者和题目，并不代表普遍的创意质量。',
    },
  },
  everyday: {
    en: 'Everyday life',
    zh: '生活',
    disclaimer: {
      en: 'No general authoritative benchmark covers everyday assistance. Text and occupational preference are displayed only as proxies.',
      zh: '目前没有覆盖日常生活助手的通用权威基准。文本与职业偏好仅作为代理指标展示。',
    },
  },
};

export const SOURCES = {
  livebench: {
    id: 'livebench',
    name: 'LiveBench',
    authority: 'Official benchmark',
    sourceUrl: 'https://livebench.ai/',
    machineUrl: 'https://livebench.ai/',
    metric: 'Score',
    unit: 'points',
    disclaimer: {
      en: 'LiveBench publishes independently scored, frequently refreshed objective tasks. Category scores are shown separately.',
      zh: 'LiveBench 发布独立评分、定期更新的客观任务。各类别分数独立展示。',
    },
  },
  swebench: {
    id: 'swebench',
    name: 'SWE-bench Verified',
    authority: 'Official benchmark',
    sourceUrl: 'https://www.swebench.com/verified',
    machineUrl: 'https://www.swebench.com/',
    metric: 'Resolved',
    unit: '%',
    disclaimer: {
      en: 'This result concerns an agent configuration and repository issue resolution, not generic chat coding.',
      zh: '该结果针对特定代理配置和仓库问题解决，不代表通用聊天式编程能力。',
    },
  },
  arena: {
    id: 'arena',
    name: 'Arena',
    authority: 'Official leaderboard via structured community mirror',
    sourceUrl: 'https://arena.ai/leaderboard',
    machineUrl: 'https://api.wulong.dev/arena-ai-leaderboards/v1/leaderboard',
    metric: 'Elo',
    unit: 'Elo',
    disclaimer: {
      en: 'Arena has no official public API. Data is read from a daily structured mirror and always links back to the official leaderboard.',
      zh: 'Arena 没有官方公开 API。数据来自每日结构化镜像，并始终链接回官方排行榜。',
    },
  },
};

export const SOURCE_SCENE_MAP = {
  livebench: {
    research: ['Reasoning', 'Data Analysis'],
    writing: ['Language'],
    coding: ['Coding', 'Agentic Coding'],
    learning: ['Instruction Following', 'Reasoning', 'Mathematics'],
    creative: ['Language'],
  },
  swebench: { coding: ['Verified'] },
  arena: {
    research: ['search', 'text'],
    writing: ['text'],
    coding: ['code'],
    creative: ['text'],
    everyday: ['text'],
  },
};

export const MODEL_ALIASES = [
  { product: 'ChatGPT', match: /\b(gpt|o[1-9])\b/i },
  { product: 'Claude', match: /\bclaude\b/i },
  { product: 'Gemini', match: /\bgemini\b/i },
  { product: 'DeepSeek', match: /\bdeepseek\b/i },
  { product: 'Kimi', match: /\b(kimi|moonshot)\b/i },
  { product: 'Qwen', match: /\b(qwen|alibaba)\b/i },
  { product: 'GLM', match: /\b(glm|zhipu)\b/i },
  { product: 'Doubao', match: /\b(doubao|seed)\b/i },
  { product: 'Wenxin', match: /\b(wenxin|ernie|baidu)\b/i },
];

export function resolveProduct(modelExactName) {
  const hit = MODEL_ALIASES.find((alias) => alias.match.test(modelExactName));
  return hit ? hit.product : null;
}

export function isValidSnapshot(snapshot) {
  if (!snapshot || snapshot.schemaVersion !== SNAPSHOT_SCHEMA_VERSION) return false;
  if (!/^\d{4}-\d{2}-\d{2}T/.test(snapshot.retrievedAt || '')) return false;
  if (!Array.isArray(snapshot.records) || !Array.isArray(snapshot.sources)) return false;
  return snapshot.records.every((record) =>
    typeof record.source === 'string' &&
    typeof record.sourceUrl === 'string' &&
    typeof record.modelExactName === 'string' &&
    typeof record.metric === 'string' &&
    typeof record.unit === 'string' &&
    typeof record.score === 'number' &&
    typeof record.rank === 'number'
  );
}
