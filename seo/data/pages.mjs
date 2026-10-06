/**
 * Page registry.
 *
 * Compare pages are only registered when every model in the pair has shared
 * public third-party benchmark coverage in the current snapshot.
 * Removed compare URLs are redirected away so thin research drafts are not kept.
 */

/**
 * best-for pages that keep participating in search. The set is capped at five
 * slugs: the four pages already earning impressions (coding, code-review,
 * academic-writing, excel) plus java, which GSC shows at 172 impressions and
 * 4 clicks-the only other task guide with real clicks. Everything else stays
 * live but noindex so crawl budget and internal links concentrate here.
 */
export const KEPT_BEST_FOR_SLUGS = new Set(['coding', 'code-review', 'academic-writing', 'excel', 'java']);

/**
 * alternatives/pricing pages that keep participating in search. The rest of
 * those clusters still exist as live URLs for humans and old links, but they
 * share one template (swap the product name) and should not compete in the
 * index until they have page-specific evidence.
 */
export const KEPT_ALTERNATIVE_SLUGS = new Set([
  'free-chatgpt',
  'chatgpt-no-login',
  'chatgpt-coding',
  'chatgpt-chinese',
]);

export const KEPT_PRICING_SLUGS = new Set([
  'chatgpt-vs-deepseek',
  'cheapest-api',
]);

/**
 * Free-access and alternatives pages that covered the same intent were merged
 * into one surviving URL per intent. These 301s consolidate their signals.
 *
 * The /free/ tree is folded into /alternatives/ and /pricing/ so the two
 * overlapping hubs stop splitting impressions: brand-specific free pages go to
 * the matching alternatives page, free-access pages go to the surviving
 * free-access guide, and the /free/ hub itself resolves to /alternatives/.
 * /free-ai-no-login/ is the one free-access URL promoted out of the merged
 * tree (it owns a distinct no-sign-in intent with its own search demand).
 */
export const mergeRedirects = [
  { source: '/alternatives/chatgpt-free', destination: '/alternatives/free-chatgpt/', permanent: true },
  { source: '/alternatives/chatgpt-free/', destination: '/alternatives/free-chatgpt/', permanent: true },
  { source: '/alternatives/free-chatgpt-2026', destination: '/alternatives/free-chatgpt/', permanent: true },
  { source: '/alternatives/free-chatgpt-2026/', destination: '/alternatives/free-chatgpt/', permanent: true },
  { source: '/free', destination: '/alternatives/', permanent: true },
  { source: '/free/', destination: '/alternatives/', permanent: true },
  { source: '/free/chatgpt', destination: '/alternatives/free-chatgpt/', permanent: true },
  { source: '/free/chatgpt/', destination: '/alternatives/free-chatgpt/', permanent: true },
  { source: '/free/ai-no-limits', destination: '/alternatives/free-chatgpt/', permanent: true },
  { source: '/free/ai-no-limits/', destination: '/alternatives/free-chatgpt/', permanent: true },
  { source: '/free/best-ai-chatbot', destination: '/alternatives/best-chatgpt/', permanent: true },
  { source: '/free/best-ai-chatbot/', destination: '/alternatives/best-chatgpt/', permanent: true },
  { source: '/free/best-ai-chatbot-2026', destination: '/alternatives/best-chatgpt/', permanent: true },
  { source: '/free/best-ai-chatbot-2026/', destination: '/alternatives/best-chatgpt/', permanent: true },
  { source: '/free/best-ai-coding', destination: '/alternatives/chatgpt-coding/', permanent: true },
  { source: '/free/best-ai-coding/', destination: '/alternatives/chatgpt-coding/', permanent: true },
  { source: '/free/ai-api', destination: '/pricing/cheapest-api/', permanent: true },
  { source: '/free/ai-api/', destination: '/pricing/cheapest-api/', permanent: true },
  { source: '/free/claude', destination: '/alternatives/claude/', permanent: true },
  { source: '/free/claude/', destination: '/alternatives/claude/', permanent: true },
  { source: '/free/gemini', destination: '/alternatives/gemini/', permanent: true },
  { source: '/free/gemini/', destination: '/alternatives/gemini/', permanent: true },
  { source: '/free/deepseek', destination: '/alternatives/deepseek/', permanent: true },
  { source: '/free/deepseek/', destination: '/alternatives/deepseek/', permanent: true },
  { source: '/free/ai-tools-2026', destination: '/alternatives/', permanent: true },
  { source: '/free/ai-tools-2026/', destination: '/alternatives/', permanent: true },
  // The no-sign-in intent is promoted to a top-level URL of its own.
  { source: '/free/ai-no-login', destination: '/free-ai-no-login/', permanent: true },
  { source: '/free/ai-no-login/', destination: '/free-ai-no-login/', permanent: true },
];

export const comparePages = [
  { slug: 'chatgpt-vs-deepseek', models: ['chatgpt', 'deepseek'], keyword: 'chatgpt vs deepseek', priority: 'P0' },
  { slug: 'chatgpt-vs-claude', models: ['chatgpt', 'claude'], keyword: 'chatgpt vs claude', priority: 'P0' },
  { slug: 'chatgpt-vs-gemini', models: ['chatgpt', 'gemini'], keyword: 'chatgpt vs gemini', priority: 'P0' },
  { slug: 'deepseek-vs-chatgpt', models: ['deepseek', 'chatgpt'], keyword: 'deepseek vs chatgpt', priority: 'P0', canonicalSlug: 'chatgpt-vs-deepseek' },
  { slug: 'claude-vs-chatgpt', models: ['claude', 'chatgpt'], keyword: 'claude vs chatgpt', priority: 'P0', canonicalSlug: 'chatgpt-vs-claude' },
  { slug: 'gemini-vs-chatgpt', models: ['gemini', 'chatgpt'], keyword: 'gemini vs chatgpt', priority: 'P0', canonicalSlug: 'chatgpt-vs-gemini' },
  { slug: 'deepseek-vs-claude', models: ['deepseek', 'claude'], keyword: 'deepseek vs claude', priority: 'P0' },
  { slug: 'deepseek-vs-gemini', models: ['deepseek', 'gemini'], keyword: 'deepseek vs gemini', priority: 'P0' },
  { slug: 'claude-vs-gemini', models: ['claude', 'gemini'], keyword: 'claude vs gemini', priority: 'P0' },
  { slug: 'gemini-vs-claude', models: ['gemini', 'claude'], keyword: 'gemini vs claude', priority: 'P0', canonicalSlug: 'claude-vs-gemini' },
];

export const zhComparePages = [
  // P0/P1 pairs mirror the English compare registry one-to-one so every EN
  // page has a language-equivalent zh page for reciprocal hreflang alternates.
  { slug: 'chatgpt-vs-deepseek', models: ['chatgpt', 'deepseek'], keyword: 'chatgpt vs deepseek', priority: 'P0' },
  { slug: 'chatgpt-vs-claude', models: ['chatgpt', 'claude'], keyword: 'chatgpt vs claude', priority: 'P0' },
  { slug: 'chatgpt-vs-gemini', models: ['chatgpt', 'gemini'], keyword: 'chatgpt vs gemini', priority: 'P0' },
  { slug: 'deepseek-vs-claude', models: ['deepseek', 'claude'], keyword: 'deepseek vs claude', priority: 'P1' },
  { slug: 'deepseek-vs-gemini', models: ['deepseek', 'gemini'], keyword: 'deepseek vs gemini', priority: 'P1' },
  { slug: 'claude-vs-gemini', models: ['claude', 'gemini'], keyword: 'claude vs gemini', priority: 'P1' },
  { slug: 'qwen-vs-chatgpt', models: ['qwen', 'chatgpt'], keyword: '通义千问 vs chatgpt', priority: 'P0' },
  {
    slug: 'doubao-vs-chatgpt', models: ['doubao', 'chatgpt'], keyword: '豆包 vs chatgpt', priority: 'P0',
    // GSC: position 8.2, 12 impressions, 0 clicks. The page ranks for the query
    // but the snippet gives no reason to click—lead with the concrete finding.
    serpTitle: '豆包 vs ChatGPT：智能体编程组合排进全榜前三 | ModelAny',
    serpDescription: '公开快照里豆包智能体组合（TRAE + Doubao-Seed-Code）修好 78.8%，排 SWE-bench 第 3。74.6% 那条是混用 Claude 的组合，不是独立 ChatGPT。含版本、来源与 3 条实测任务。',
  },
  { slug: 'kimi-vs-chatgpt', models: ['kimi', 'chatgpt'], keyword: 'kimi vs chatgpt', priority: 'P0' },
  { slug: 'glm-vs-chatgpt', models: ['glm', 'chatgpt'], keyword: 'glm vs chatgpt', priority: 'P0' },
  { slug: 'qwen-vs-deepseek', models: ['qwen', 'deepseek'], keyword: '通义千问 vs deepseek', priority: 'P0' },
  { slug: 'glm-vs-deepseek', models: ['glm', 'deepseek'], keyword: 'glm vs deepseek', priority: 'P0' },
  { slug: 'kimi-vs-deepseek', models: ['kimi', 'deepseek'], keyword: 'kimi vs deepseek', priority: 'P0' },
  { slug: 'doubao-vs-deepseek', models: ['doubao', 'deepseek'], keyword: '豆包 vs deepseek', priority: 'P0' },
];

/** Old compare URLs without shared public evidence. Redirect to hubs or benchmarks. */
export const removedCompareRedirects = [
  { source: '/compare/llm-benchmark', destination: '/benchmarks/', permanent: true },
  { source: '/compare/llm-benchmark/', destination: '/benchmarks/', permanent: true },
  { source: '/compare/chatgpt-vs-copilot', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-vs-copilot/', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-vs-perplexity', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-vs-perplexity/', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-vs-grok', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-vs-grok/', destination: '/compare/', permanent: true },
  { source: '/compare/deepseek-vs-grok', destination: '/compare/', permanent: true },
  { source: '/compare/deepseek-vs-grok/', destination: '/compare/', permanent: true },
  { source: '/compare/deepseek-vs-perplexity', destination: '/compare/', permanent: true },
  { source: '/compare/deepseek-vs-perplexity/', destination: '/compare/', permanent: true },
  { source: '/compare/claude-vs-grok', destination: '/compare/', permanent: true },
  { source: '/compare/claude-vs-grok/', destination: '/compare/', permanent: true },
  { source: '/compare/gemini-vs-grok', destination: '/compare/', permanent: true },
  { source: '/compare/gemini-vs-grok/', destination: '/compare/', permanent: true },
  { source: '/compare/perplexity-vs-claude', destination: '/compare/', permanent: true },
  { source: '/compare/perplexity-vs-claude/', destination: '/compare/', permanent: true },
  { source: '/compare/perplexity-vs-gemini', destination: '/compare/', permanent: true },
  { source: '/compare/perplexity-vs-gemini/', destination: '/compare/', permanent: true },
  { source: '/compare/perplexity-vs-chatgpt', destination: '/compare/', permanent: true },
  { source: '/compare/perplexity-vs-chatgpt/', destination: '/compare/', permanent: true },
  { source: '/compare/grok-vs-chatgpt', destination: '/compare/', permanent: true },
  { source: '/compare/grok-vs-chatgpt/', destination: '/compare/', permanent: true },
  { source: '/compare/copilot-vs-chatgpt', destination: '/compare/', permanent: true },
  { source: '/compare/copilot-vs-chatgpt/', destination: '/compare/', permanent: true },
  { source: '/compare/copilot-vs-claude', destination: '/compare/', permanent: true },
  { source: '/compare/copilot-vs-claude/', destination: '/compare/', permanent: true },
  { source: '/compare/copilot-vs-gemini', destination: '/compare/', permanent: true },
  { source: '/compare/copilot-vs-gemini/', destination: '/compare/', permanent: true },
  { source: '/compare/mistral-vs-chatgpt', destination: '/compare/', permanent: true },
  { source: '/compare/mistral-vs-chatgpt/', destination: '/compare/', permanent: true },
  { source: '/compare/llama-vs-chatgpt', destination: '/compare/', permanent: true },
  { source: '/compare/llama-vs-chatgpt/', destination: '/compare/', permanent: true },
  { source: '/compare/claude-vs-gemini-vs-chatgpt', destination: '/compare/', permanent: true },
  { source: '/compare/claude-vs-gemini-vs-chatgpt/', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-claude-gemini', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-claude-gemini/', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-deepseek-claude', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-deepseek-claude/', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-claude-gemini-deepseek', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-claude-gemini-deepseek/', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-claude-gemini-copilot', destination: '/compare/', permanent: true },
  { source: '/compare/chatgpt-claude-gemini-copilot/', destination: '/compare/', permanent: true },
  { source: '/compare/best-ai-models', destination: '/benchmarks/', permanent: true },
  { source: '/compare/best-ai-models/', destination: '/benchmarks/', permanent: true },
  { source: '/compare/ai-models-2026', destination: '/benchmarks/', permanent: true },
  { source: '/compare/ai-models-2026/', destination: '/benchmarks/', permanent: true },
  { source: '/compare/comparison-table', destination: '/benchmarks/', permanent: true },
  { source: '/compare/comparison-table/', destination: '/benchmarks/', permanent: true },
  { source: '/compare/chatgpt-vs-claude-coding', destination: '/compare/chatgpt-vs-claude/', permanent: true },
  { source: '/compare/chatgpt-vs-claude-coding/', destination: '/compare/chatgpt-vs-claude/', permanent: true },
  { source: '/compare/chatgpt-vs-deepseek-coding', destination: '/compare/chatgpt-vs-deepseek/', permanent: true },
  { source: '/compare/chatgpt-vs-deepseek-coding/', destination: '/compare/chatgpt-vs-deepseek/', permanent: true },
  { source: '/compare/deepseek-vs-claude-coding', destination: '/compare/deepseek-vs-claude/', permanent: true },
  { source: '/compare/deepseek-vs-claude-coding/', destination: '/compare/deepseek-vs-claude/', permanent: true },
  { source: '/compare/chatgpt-vs-claude-writing', destination: '/compare/chatgpt-vs-claude/', permanent: true },
  { source: '/compare/chatgpt-vs-claude-writing/', destination: '/compare/chatgpt-vs-claude/', permanent: true },
  { source: '/compare/cursor-vs-copilot', destination: '/compare/', permanent: true },
  { source: '/compare/cursor-vs-copilot/', destination: '/compare/', permanent: true },
  { source: '/compare/copilot-vs-cursor', destination: '/compare/', permanent: true },
  { source: '/compare/copilot-vs-cursor/', destination: '/compare/', permanent: true },
  { source: '/compare/cursor-vs-claude-code', destination: '/compare/', permanent: true },
  { source: '/compare/cursor-vs-claude-code/', destination: '/compare/', permanent: true },
  { source: '/compare/cursor-vs-windsurf', destination: '/compare/', permanent: true },
  { source: '/compare/cursor-vs-windsurf/', destination: '/compare/', permanent: true },
  { source: '/compare/claude-code-vs-copilot', destination: '/compare/', permanent: true },
  { source: '/compare/claude-code-vs-copilot/', destination: '/compare/', permanent: true },
  { source: '/zh/compare/wenxin-vs-qwen', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/wenxin-vs-qwen/', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/doubao-vs-wenxin', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/doubao-vs-wenxin/', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/kimi-vs-wenxin', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/kimi-vs-wenxin/', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/wenxin-vs-deepseek', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/wenxin-vs-deepseek/', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/best-chinese-ai', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/best-chinese-ai/', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/chinese-ai-ranking', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/chinese-ai-ranking/', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/chinese-llm-comparison', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/chinese-llm-comparison/', destination: '/zh/benchmarks/', permanent: true },
  // wenxin-vs-chatgpt has no shared public benchmark coverage in the current
  // snapshot, so the generator no longer publishes it. Remove the redirect if
  // a future snapshot restores shared coverage.
  { source: '/zh/compare/wenxin-vs-chatgpt', destination: '/zh/benchmarks/', permanent: true },
  { source: '/zh/compare/wenxin-vs-chatgpt/', destination: '/zh/benchmarks/', permanent: true },
];

export const bestForPages = [
  { slug: 'coding', keyword: 'best ai for coding', focus: 'coding', models: ['claude', 'deepseek', 'chatgpt', 'cursor'], priority: 'P0',
    description: 'Best AI for coding: compare Claude, DeepSeek, ChatGPT and Cursor on the same ticket. Check compile, tests, and how much of the patch you would actually merge.',
    intro: 'Coding quality is ticket-specific. Put Claude, DeepSeek, ChatGPT and Cursor on one representative bug or feature, then keep the patch you would merge—not the answer that sounds most confident.',
    criteria: [
      'Use one real ticket (bug, failing test, or small feature) with the same repo context for every model.',
      'Score compile, tests, API usage, and how much of the patch you would actually merge—not how fluent the explanation reads.',
      'Check whether the tool fits the workflow you already have: chat tab, IDE inline, or a mix of both.',
    ] },
  { slug: 'coding-2026', keyword: 'best ai for coding 2026', focus: 'coding', models: ['claude', 'deepseek', 'chatgpt', 'cursor'], priority: 'P0' },
  { slug: 'python', keyword: 'best ai for python', focus: 'coding', models: ['deepseek', 'claude', 'chatgpt'], priority: 'P0' },
  { slug: 'javascript', keyword: 'best ai for javascript', focus: 'coding', models: ['claude', 'chatgpt', 'deepseek'], priority: 'P0',
    description: 'Best AI for JavaScript: compare Claude, ChatGPT, and DeepSeek on the same bugfix or feature task before you pick a daily coding workflow.',
    intro: 'For JavaScript work, judge models on debugging speed, framework familiarity, and how much editing the generated code needs—not brand familiarity alone.' },
  { slug: 'java', keyword: 'best ai for java', focus: 'coding', models: ['chatgpt', 'claude', 'deepseek'], priority: 'P0',
    description: 'Best AI for Java: compare ChatGPT, Claude, and DeepSeek on the same Java task. Check correctness, readability, and editing cost side by side.',
    intro: 'Java teams usually care about compile-ready code, API usage, and how long fixes take. Put ChatGPT, Claude, and DeepSeek on one representative ticket before standardizing a tool.',
    criteria: [
      'Use one representative Java ticket: a compile error, a failing test, or a small Spring/API change, with the same snippets for every model.',
      'Score whether the patch compiles, uses the right APIs, and how much you would rewrite before merging.',
      'Check package and build-tool assumptions (Maven/Gradle, Java version) instead of accepting generic pseudo-Java.',
    ] },
  { slug: 'sql', keyword: 'best ai for sql', focus: 'coding', models: ['chatgpt', 'claude', 'deepseek'], priority: 'P0' },
  { slug: 'debugging', keyword: 'best ai for debugging', focus: 'coding', models: ['claude', 'deepseek', 'chatgpt'], priority: 'P0' },
  { slug: 'code-review', keyword: 'best ai for code review', focus: 'coding', models: ['claude', 'chatgpt', 'deepseek'], priority: 'P0',
    description: 'Best AI for code review: compare Claude, ChatGPT, and DeepSeek on the same pull request. Look for actionable findings, false positives, and review depth.',
    intro: 'Code review tools should surface real risks without drowning you in noise. Run the same PR through Claude, ChatGPT, and DeepSeek, then score findings you would actually merge.',
    criteria: [
      'Paste the same pull request (diff plus enough surrounding files) into Claude, ChatGPT and DeepSeek.',
      'Score findings you would actually request: bugs, security, missing tests—not style nits you would ignore.',
      'Count false positives. A long review that is mostly noise is worse than a short one with two real issues.',
    ] },
  { slug: 'refactoring', keyword: 'best ai for refactoring', focus: 'coding', models: ['claude', 'cursor', 'deepseek'], priority: 'P0' },
  { slug: 'leetcode', keyword: 'best ai for leetcode', focus: 'coding', models: ['deepseek', 'chatgpt', 'claude'], priority: 'P0' },
  { slug: 'system-design', keyword: 'best ai for system design', focus: 'coding', models: ['claude', 'chatgpt', 'gemini'], priority: 'P0',
    description: 'Best AI for system design: compare Claude, ChatGPT, and Gemini on the same architecture prompt. Check trade-offs, diagrams, and interview-ready structure.',
    intro: 'System design answers should spell out constraints, trade-offs, and failure modes. Compare Claude, ChatGPT, and Gemini on one shared design brief before trusting any single answer.' },
  { slug: 'coding-interviews', keyword: 'best ai for coding interviews', focus: 'coding', models: ['chatgpt', 'deepseek', 'claude'], priority: 'P0' },
  { slug: 'writing', keyword: 'best ai for writing', focus: 'writing', models: ['claude', 'chatgpt', 'gemini'], priority: 'P0',
    description: 'Best AI for writing: compare Claude, ChatGPT, and Gemini on the same brief. Judge tone, structure, and editing time—not marketing claims.',
    intro: 'Writing quality is task-specific. Put Claude, ChatGPT, and Gemini on one real brief, then keep the draft that needs the least rewriting for your voice.' },
  { slug: 'essays', keyword: 'best ai for essays', focus: 'writing', models: ['claude', 'chatgpt', 'gemini'], priority: 'P0' },
  { slug: 'emails', keyword: 'best ai for emails', focus: 'writing', models: ['chatgpt', 'claude', 'gemini'], priority: 'P0' },
  { slug: 'blog-posts', keyword: 'best ai for blog posts', focus: 'writing', models: ['claude', 'chatgpt', 'gemini'], priority: 'P0' },
  { slug: 'creative-writing', keyword: 'best ai for creative writing', focus: 'writing', models: ['claude', 'chatgpt', 'grok'], priority: 'P0' },
  { slug: 'content-creation', keyword: 'best ai for content creation', focus: 'writing', models: ['chatgpt', 'claude', 'gemini'], priority: 'P0' },
  { slug: 'academic-writing', keyword: 'best ai for academic writing', focus: 'writing', models: ['claude', 'gemini', 'chatgpt'], priority: 'P0',
    description: 'Best AI for academic writing: compare Claude, Gemini, and ChatGPT on the same manuscript section. Check citation care, structure, and revision effort.',
    intro: 'Academic drafts need careful sourcing and clear structure. Compare Claude, Gemini, and ChatGPT on one paper section, then verify claims against your primary sources.',
    criteria: [
      'Use one manuscript section (abstract, methods, or discussion) with the same notes and citation style.',
      'Check claim-to-source fit, hedging, and structure—then verify every citation against the paper you actually have.',
      'Keep human review for anything that will be submitted; the model is a drafting aid, not a source.',
    ] },
  { slug: 'translation', keyword: 'best ai for translation', focus: 'writing', models: ['chatgpt', 'deepseek', 'qwen'], priority: 'P0' },
  { slug: 'chinese-to-english', keyword: 'best ai for chinese to english', focus: 'writing', models: ['deepseek', 'qwen', 'chatgpt'], priority: 'P0' },
  { slug: 'reasoning', keyword: 'best ai for reasoning', focus: 'reasoning', models: ['deepseek', 'claude', 'chatgpt'], priority: 'P0' },
  { slug: 'math', keyword: 'best ai for math', focus: 'reasoning', models: ['deepseek', 'chatgpt', 'claude'], priority: 'P0' },
  { slug: 'research', keyword: 'best ai for research', focus: 'research', models: ['perplexity', 'gemini', 'claude'], priority: 'P0' },
  { slug: 'analysis', keyword: 'best ai for analysis', focus: 'research', models: ['claude', 'chatgpt', 'gemini'], priority: 'P0' },
  { slug: 'data-analysis', keyword: 'best ai for data analysis', focus: 'research', models: ['chatgpt', 'claude', 'deepseek'], priority: 'P0' },
  { slug: 'statistics', keyword: 'best ai for statistics', focus: 'reasoning', models: ['chatgpt', 'deepseek', 'claude'], priority: 'P0' },
  { slug: 'science', keyword: 'best ai for science', focus: 'research', models: ['claude', 'gemini', 'chatgpt'], priority: 'P0' },
  { slug: 'business', keyword: 'best ai for business', focus: 'business', models: ['chatgpt', 'claude', 'gemini'], priority: 'P0' },
  { slug: 'marketing', keyword: 'best ai for marketing', focus: 'business', models: ['chatgpt', 'claude', 'gemini'], priority: 'P0' },
  { slug: 'sales', keyword: 'best ai for sales', focus: 'business', models: ['chatgpt', 'claude', 'gemini'], priority: 'P0' },
  { slug: 'customer-support', keyword: 'best ai for customer support', focus: 'business', models: ['chatgpt', 'claude', 'gemini'], priority: 'P0' },
  { slug: 'excel', keyword: 'best ai for excel', focus: 'business', models: ['copilot', 'chatgpt', 'claude'], priority: 'P0',
    description: 'Best AI for Excel: compare Copilot, ChatGPT and Claude on one spreadsheet job—formulas, cleanup, and whether the output is safe to paste back into the workbook.',
    intro: 'Excel work fails on formulas that look right and data that should never leave the file. Put Copilot, ChatGPT and Claude on one real workbook task, then check formula correctness, cell references, and how much cleanup you still have to do.',
    criteria: [
      'Use one real workbook task (formula, pivot, cleanup, or chart) with the same sample rows for every model.',
      'Check formula correctness, named ranges, and whether the answer is safe to paste back—not just whether it sounds like Excel help.',
      'Prefer Copilot when the file must stay in Microsoft 365; use ChatGPT or Claude when you need a second opinion on the same brief.',
    ] },
  { slug: 'powerpoint', keyword: 'best ai for powerpoint', focus: 'business', models: ['copilot', 'chatgpt', 'gemini'], priority: 'P0' },
  { slug: 'spreadsheets', keyword: 'best ai for spreadsheets', focus: 'business', models: ['copilot', 'chatgpt', 'claude'], priority: 'P0' },
  { slug: 'hr', keyword: 'best ai for hr', focus: 'business', models: ['chatgpt', 'claude', 'gemini'], priority: 'P0',
    description: 'Best AI for HR: compare ChatGPT, Claude, and Gemini on job posts, policy drafts, and candidate notes—with privacy and editing cost in mind.',
    intro: 'HR work mixes sensitive data with repetitive drafting. Compare ChatGPT, Claude, and Gemini on one real HR task, and keep human review for hiring or policy decisions.' },
  { slug: 'finance', keyword: 'best ai for finance', focus: 'business', models: ['chatgpt', 'claude', 'gemini'], priority: 'P0' },
  { slug: 'students', keyword: 'best ai for students', focus: 'students', models: ['chatgpt', 'gemini', 'deepseek', 'claude'], priority: 'P0' },
];

export const alternativePages = [
  { slug: 'chatgpt', target: 'chatgpt', keyword: 'chatgpt alternative', priority: 'P1' },
  { slug: 'best-chatgpt', target: 'chatgpt', keyword: 'best chatgpt alternative', priority: 'P1' },
  {
    slug: 'free-chatgpt', target: 'chatgpt', keyword: 'free chatgpt alternative', priority: 'P1', filter: 'free',
    description: 'Free ChatGPT: use the official free tier on chatgpt.com, or compare free alternatives such as DeepSeek, Gemini and Kimi on the same prompt before you switch.',
    intro: 'There are two honest answers to “free ChatGPT”: the official free tier on chatgpt.com, and free alternatives that cover similar work. This page separates the two, lists what to verify on each official site, and shows how to compare candidates on one prompt instead of brand impressions.',
  },
  { slug: 'chatgpt-coding', target: 'chatgpt', keyword: 'chatgpt alternative for coding', priority: 'P1', focus: 'coding',
    description: 'ChatGPT alternative for coding: compare Claude, DeepSeek and Cursor on one real ticket before you switch a daily coding workflow away from ChatGPT.',
    intro: 'People look for a ChatGPT alternative for coding when the answers compile but the patch still needs too much rewriting, or when an IDE-native tool would be faster than another chat tab. This page is about that switch: what to test on one ticket, and which official products to put next to ChatGPT.',
    criteria: [
      'State the coding job you are replacing ChatGPT for: bugfix, tests, review, or inline IDE help.',
      'Run the same ticket on Claude, DeepSeek and Cursor (or Copilot) with identical repo context.',
      'Keep the tool whose patch you would merge, not the one whose explanation is longest.',
    ] },
  { slug: 'chatgpt-writing', target: 'chatgpt', keyword: 'chatgpt alternative for writing', priority: 'P1', focus: 'writing' },
  { slug: 'chatgpt-no-login', target: 'chatgpt', keyword: 'chatgpt alternative without login', priority: 'P1', filter: 'no-login',
    description: 'ChatGPT alternative without login: what “no login” actually means, which official sites open a chat box first, and how to check any candidate in a private window.',
    intro: 'A ChatGPT alternative without login is rarely a full ChatGPT replacement. It is usually a smaller or older model, a demo that gates the real answer, or a free tier that still wants an email. This page tells those cases apart and points to the official sites you can actually open without an OpenAI account.',
    criteria: [
      'Open the candidate in a private window and send a real question, not “hello”.',
      'Record whether an account, phone number, or credit card appears on the first, second, or third turn.',
      'Treat a no-login box as a one-off tool: no history, tighter caps, and no claim about ChatGPT-level quality.',
    ] },
  { slug: 'chatgpt-students', target: 'chatgpt', keyword: 'chatgpt alternative for students', priority: 'P1', focus: 'students' },
  { slug: 'chatgpt-business', target: 'chatgpt', keyword: 'chatgpt alternative for business', priority: 'P1', focus: 'business' },
  { slug: 'chatgpt-api', target: 'chatgpt', keyword: 'chatgpt alternative api', priority: 'P1', filter: 'api' },
  { slug: 'cheap-chatgpt', target: 'chatgpt', keyword: 'cheap chatgpt alternative', priority: 'P1', filter: 'cheap' },
  { slug: 'chatgpt-open-source', target: 'chatgpt', keyword: 'chatgpt alternative open source', priority: 'P1', filter: 'open-source' },
  { slug: 'chatgpt-image', target: 'chatgpt', keyword: 'chatgpt alternative with image generation', priority: 'P1', filter: 'image' },
  { slug: 'chatgpt-chinese', target: 'chatgpt', keyword: 'chatgpt alternative for chinese', priority: 'P1', focus: 'chinese',
    description: 'ChatGPT alternative for Chinese: compare DeepSeek, Qwen, Kimi, Doubao and GLM on the same Chinese task, then check mainland access, login, and how much editing the draft still needs.',
    intro: 'A ChatGPT alternative for Chinese work is usually about access and language, not a global ranking. Mainland-reachable products (DeepSeek, Qwen, Kimi, Doubao, GLM) take a phone number; ChatGPT does not. Compare them on one Chinese brief before treating any of them as a drop-in replacement.',
    criteria: [
      'Use one real Chinese task (email, summary, or code comment) with the same brief for every model.',
      'Check mainland access, phone-number login, and whether the draft still needs native-level rewriting.',
      'Keep ChatGPT in the mix only if you already have a working account; do not assume a Chinese site copies its tool stack.',
    ] },
  { slug: 'claude', target: 'claude', keyword: 'claude alternative', priority: 'P1' },
  { slug: 'gemini', target: 'gemini', keyword: 'gemini alternative', priority: 'P1' },
  { slug: 'deepseek', target: 'deepseek', keyword: 'deepseek alternative', priority: 'P1' },
  { slug: 'perplexity', target: 'perplexity', keyword: 'perplexity alternative', priority: 'P1' },
  { slug: 'cursor', target: 'cursor', keyword: 'cursor alternative', priority: 'P1', focus: 'coding-ide' },
  { slug: 'github-copilot', target: 'copilot', keyword: 'github copilot alternative', priority: 'P1', focus: 'coding-ide' },
  { slug: 'claude-code', target: 'claude-code', keyword: 'claude code alternative', priority: 'P1', focus: 'coding-ide' },
  { slug: 'windsurf', target: 'windsurf', keyword: 'windsurf alternative', priority: 'P1', focus: 'coding-ide' },
];

/**
 * The /free/ tree is retired. Its nine pages split the same free-access intent
 * across two hubs and two URL prefixes; every one of them is redirected in
 * `mergeRedirects` above. The single surviving free-access URL is the
 * top-level `/free-ai-no-login/` guide, which is registered as a product page
 * below because it is the only one of the group with a distinct, defensible
 * search intent (no sign-in) and enough demand to justify its own page.
 */
export const freePages = [];

export const pricingPages = [
  { slug: 'ai-comparison', keyword: 'ai pricing comparison', models: ['chatgpt', 'claude', 'gemini', 'deepseek', 'perplexity'], priority: 'P1' },
  { slug: 'chatgpt-vs-deepseek', keyword: 'chatgpt vs deepseek pricing', models: ['chatgpt', 'deepseek'], priority: 'P1',
    description: 'ChatGPT vs DeepSeek pricing: estimate cost from your own tokens and retries, then read both official price pages. This is a checking method, not a stale price table.',
    intro: 'ChatGPT vs DeepSeek pricing searches want a number. Official rates change, so this page does not publish one. It shows how to estimate spend from your own input, output and retries, then send you to OpenAI and DeepSeek docs to confirm the current list price and terms.',
    criteria: [
      'Estimate monthly spend from your real input/output tokens, retries, and peak traffic—not a homepage sticker.',
      'Open both official pricing pages on the same day and record model names, units, and any cached or batch rates.',
      'Factor quality and failure rate: a cheaper token that needs three retries is not cheaper.',
    ] },
  { slug: 'cheapest-api', keyword: 'cheapest ai api', models: ['deepseek', 'mistral', 'gemini', 'llama'], priority: 'P1',
    description: 'Cheapest AI API: a method for comparing DeepSeek, Mistral, Gemini and Llama list prices against your own traffic, rate limits, and migration cost—not a ranking that goes stale.',
    intro: '“Cheapest AI API” is a moving target. List prices, cached tokens, and regional availability change. This page is a checking method: estimate your own traffic, open the official docs, and only then decide whether DeepSeek, Mistral, Gemini or a self-hosted Llama stack is actually cheaper for that load.',
    criteria: [
      'Write down input tokens, output tokens, retries, and peak QPS before you look at any price page.',
      'Compare official docs for DeepSeek, Mistral, Gemini and Llama hosts on the same day, including rate limits and data terms.',
      'Add migration and quality cost: a cheaper API that fails or needs a second model is not the cheapest path.',
    ] },
  { slug: 'cheapest-chatgpt', keyword: 'cheapest chatgpt alternative', models: ['deepseek', 'gemini', 'mistral'], priority: 'P1' },
  { slug: 'api-startups', keyword: 'best ai api for startups', models: ['deepseek', 'gemini', 'mistral', 'chatgpt'], priority: 'P1' },
  { slug: 'api-small-business', keyword: 'best ai api for small business', models: ['deepseek', 'gemini', 'chatgpt', 'claude'], priority: 'P1' },
];

/**
 * Product-led pages target installation and comparison workflows rather than
 * unsupported capability rankings. These map to durable search intents that
 * directly match ModelAny's documented extension features.
 */
export const productPages = [
  {
    slug: 'compare-ai-models',
    keyword: 'compare AI models',
    intent: 'model-comparison-workflow',
    h1: 'Compare AI models with the same prompt',
    description: 'A blank same-prompt worksheet for ChatGPT, Claude, Gemini, DeepSeek and 7 more official sites. Fill in your own scores; public tables below are someone else\'s tasks.',
    title: 'Compare AI Models: Same-Prompt Worksheet | ModelAny',
    models: ['chatgpt', 'gemini', 'deepseek', 'qwen'],
    localePath: '/zh/compare-ai-models/',
    priority: 'P0',
  },
  {
    slug: 'ai-browser-extension',
    keyword: 'chatgpt chrome extension',
    intent: 'browser-extension',
    h1: 'ChatGPT Chrome extension for multi-model work',
    description: 'Install ModelAny from the Chrome Web Store or Edge Add-ons to send one prompt across ChatGPT and other AI sites—local-first, no ModelAny account or API key.',
    title: 'ChatGPT Chrome Extension for Multi-Model Work | ModelAny',
    models: ['chatgpt', 'gemini', 'deepseek', 'qwen'],
    localePath: '/zh/ai-browser-extension/',
    priority: 'P0',
  },
  {
    slug: 'side-by-side-ai-comparison',
    keyword: 'compare ai answers side by side',
    intent: 'model-comparison-workflow',
    h1: 'Compare AI answers side by side',
    description: 'A scoring rubric for reading ChatGPT, Claude and Gemini answers together: facts, completeness, edit cost and how the answer fails. Not a filled-in ranking.',
    title: 'Side-by-Side AI Comparison: Scoring Rubric | ModelAny',
    models: ['chatgpt', 'gemini', 'deepseek', 'qwen'],
    priority: 'P1',
  },
  {
    slug: 'chatgpt-vs-claude-vs-gemini-same-prompt',
    keyword: 'chatgpt vs claude vs gemini same prompt',
    intent: 'model-comparison-workflow',
    h1: 'ChatGPT vs Claude vs Gemini: the same prompt, three answers',
    description: 'Run one prompt through ChatGPT, Claude and Gemini and judge the answers side by side—with a prompt pack, a scoring rubric, and their shared benchmarks.',
    title: 'ChatGPT vs Claude vs Gemini on the Same Prompt | ModelAny',
    models: ['chatgpt', 'claude', 'gemini'],
    priority: 'P0',
  },
  {
    slug: 'chatgpt-usage-limit-workaround',
    keyword: 'chatgpt usage limit workaround',
    intent: 'browser-extension',
    h1: 'Hit your ChatGPT usage limit? Four ways to keep working',
    description: 'What works when ChatGPT says you hit your usage limit: wait for the reset, switch model, move the chat to Claude, Gemini or DeepSeek with context, or upgrade.',
    title: 'ChatGPT Usage Limit Reached: What Works Right Now | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    priority: 'P0',
  },
  {
    slug: 'ai-browser-extension',
    pathPrefix: 'zh',
    keyword: 'AI浏览器插件',
    intent: 'browser-extension',
    lang: 'zh',
    h1: 'AI 浏览器插件：同一提示词对比多个模型',
    description: '在 Chrome 或 Edge 安装 ModelAny，把同一问题发给 ChatGPT、DeepSeek、Kimi、豆包等官网并排查看。本地优先，不经 ModelAny 自有服务器中转。',
    title: 'AI 浏览器插件：多模型同题对比 | ModelAny',
    models: ['chatgpt', 'gemini', 'deepseek', 'qwen'],
    localePath: '/ai-browser-extension/',
    priority: 'P0',
  },
  {
    slug: 'compare-ai-models',
    pathPrefix: 'zh',
    keyword: '对比大模型',
    intent: 'model-comparison-workflow',
    lang: 'zh',
    h1: '对比大模型：同一提示词工作表',
    description: '先固定任务与合格标准，再用 ModelAny 把同一提示词发给 ChatGPT、DeepSeek、Kimi、豆包等官网。本页提供空白记录表和公开评测摘录，不代替你自己填写实测结果。',
    title: '对比大模型：同一提示词工作表 | ModelAny',
    models: ['chatgpt', 'gemini', 'deepseek', 'qwen'],
    localePath: '/compare-ai-models/',
    priority: 'P0',
  },
  {
    slug: 'how-to-use',
    keyword: 'how to use ModelAny',
    intent: 'browser-extension',
    h1: 'How to use ModelAny',
    description: 'Install ModelAny in Chrome or Edge, sign in to the AI sites you already use, send one question to several models, then export chats or attach video transcripts.',
    title: 'How to Use ModelAny | Setup Guide',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    localePath: '/zh/how-to-use/',
    priority: 'P0',
  },
  {
    slug: 'export-chatgpt-conversation',
    keyword: 'export chatgpt conversation',
    intent: 'browser-extension',
    h1: 'How to export a ChatGPT conversation',
    description: 'Every working way to export a ChatGPT conversation—PDF, Word, Markdown, copy-paste or official data export—with trade-offs and a one-click browser route.',
    title: 'Export ChatGPT Conversation: PDF, Word, Markdown | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    localePath: '/zh/export-ai-chat/',
    priority: 'P0',
  },
  {
    slug: 'export-chatgpt-conversation-to-pdf',
    keyword: 'export chatgpt conversation to pdf',
    parent: 'export-chatgpt-conversation',
    intent: 'browser-extension',
    h1: 'Export a ChatGPT conversation to PDF',
    description: 'Three ways to export a ChatGPT conversation to PDF: a one-click browser toolbar (works on Claude and DeepSeek too), the print route, and what each keeps.',
    title: 'Export a ChatGPT Conversation to PDF (Free) | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    priority: 'P0',
  },
  {
    slug: 'export-chatgpt-conversation-to-markdown',
    keyword: 'export chatgpt conversation to markdown',
    parent: 'export-chatgpt-conversation',
    intent: 'browser-extension',
    h1: 'Export a ChatGPT conversation to Markdown',
    description: 'Export a ChatGPT conversation to Markdown with headings, lists and code blocks intact—for Notion, Obsidian, Git repos or any plain-text workflow, in one click.',
    title: 'Export ChatGPT Conversation to Markdown (.md) | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    priority: 'P1',
  },
  {
    slug: 'download-chatgpt-conversation',
    keyword: 'download chatgpt conversation',
    parent: 'export-chatgpt-conversation',
    intent: 'browser-extension',
    h1: 'Download a ChatGPT conversation to your computer',
    description: 'Download a ChatGPT conversation as PDF, Word or Markdown—or request ChatGPT’s official data export. Files are generated in your browser; nothing is uploaded.',
    title: 'Download a ChatGPT Conversation as a Local File | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    priority: 'P1',
  },
  {
    slug: 'copy-chatgpt-conversation',
    keyword: 'copy chatgpt conversation',
    parent: 'export-chatgpt-conversation',
    intent: 'browser-extension',
    h1: 'Copy a ChatGPT conversation without losing the formatting',
    description: 'Copy a ChatGPT conversation with speaker labels and code intact—one turn, a range, or the whole thread as Markdown—and paste it cleanly into Word or Notion.',
    title: 'Copy a ChatGPT Conversation, Formatting Intact | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    priority: 'P1',
  },
  {
    slug: 'save-chatgpt-conversation',
    keyword: 'save chatgpt conversation',
    intent: 'browser-extension',
    h1: 'Save a ChatGPT conversation and find it again later',
    description: 'Save a ChatGPT conversation before it scrolls away: a searchable local library in your browser, or a PDF, Word and Markdown copy—with the limits of each route.',
    title: 'Save ChatGPT Conversations: Library & Files | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    priority: 'P1',
  },
  {
    slug: 'chatgpt-exporter',
    keyword: 'chatgpt exporter',
    parent: 'export-chatgpt-conversation',
    intent: 'browser-extension',
    h1: 'ChatGPT exporter: what to look for before you install one',
    description: 'A ChatGPT exporter should still work next month. Check what it captures, where the file is generated, which formats it produces, and whether it reaches Claude, Gemini and DeepSeek too.',
    title: 'ChatGPT Exporter: Formats, Privacy & Limits | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    priority: 'P1',
  },
  {
    slug: 'gemini-exporter',
    keyword: 'gemini exporter',
    parent: 'export-chatgpt-conversation',
    intent: 'browser-extension',
    h1: 'Gemini exporter: save a Gemini conversation as a file',
    description: 'Export a Gemini conversation to PDF, Word or Markdown from the page itself. What the export keeps, what it cannot reach, and how it compares with Google’s own data export.',
    title: 'Gemini Exporter: PDF, Word & Markdown | ModelAny',
    models: ['gemini', 'chatgpt', 'claude', 'deepseek'],
    priority: 'P1',
  },
  {
    slug: 'ai-exporter',
    keyword: 'ai exporter',
    parent: 'export-chatgpt-conversation',
    intent: 'browser-extension',
    h1: 'AI exporter: one tool for every chat site you use',
    description: 'Export conversations from ChatGPT, Claude, Gemini, DeepSeek, Kimi and more with one workflow—PDF, Word, Markdown or clipboard—generated locally in your browser.',
    title: 'AI Exporter for ChatGPT, Claude & Gemini | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    priority: 'P1',
  },
  {
    slug: 'free-ai-no-login',
    keyword: 'free ai no login',
    intent: 'free-access',
    h1: 'Free AI with no login: which sites actually open',
    description: 'Some AI sites answer before you create an account—and some only look like they do. What “no login” really means, what you give up, and how to check any site before trusting it.',
    title: 'Free AI Without Login: What Actually Works | ModelAny',
    models: ['chatgpt', 'gemini', 'deepseek', 'perplexity'],
    localePath: '/zh/free-ai-no-login/',
    priority: 'P0',
  },
  {
    slug: 'ai-chat-comparison',
    keyword: 'ai chat comparison',
    intent: 'model-comparison-workflow',
    special: 'ai-chat-comparison',
    h1: 'AI chat comparison: same prompt, every model, side by side',
    description: 'Dated public Arena, SWE-bench and LiveBench tables for ChatGPT, Claude, Gemini, DeepSeek, Kimi and GLM. Use them as context, then test your own prompt separately.',
    title: 'AI Chat Comparison: Evidence + Same-Prompt Method | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek', 'grok', 'yuanbao', 'wenxin', 'qwen', 'doubao', 'kimi', 'glm'],
    priority: 'P0',
  },
  {
    slug: 'ask-multiple-ai-at-once',
    keyword: 'ask multiple ai at once',
    intent: 'model-comparison-workflow',
    h1: 'Ask multiple AI at once: one question, every model',
    // GSC: "ask many ai" sits at position 8.2 with 16 impressions and 0 clicks.
    // The ranking is already there; the snippet is what fails to earn the click,
    // so the title leads with the query's own wording.
    description: 'Ask many AI at once: type one question, send it to ChatGPT, Claude, Gemini, DeepSeek, Kimi and more official sites, then read every answer together. Free.',
    title: 'Ask Many AI at Once: 11 Answers Side by Side | ModelAny',
    models: ['chatgpt', 'gemini', 'deepseek', 'qwen'],
    priority: 'P1',
  },
  {
    slug: 'youtube-video-summarizer',
    keyword: 'summarize youtube video',
    intent: 'browser-extension',
    h1: 'Summarize YouTube videos with ChatGPT, Claude, Gemini or DeepSeek',
    description: 'Attach a YouTube or Bilibili video’s captions with timestamps, then ask the AI accounts you already have for key points, a chapter timeline or a translation.',
    title: 'Summarize YouTube Videos with ChatGPT or Claude | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    localePath: '/zh/video-summary/',
    priority: 'P0',
  },
  {
    slug: 'continue-chat-in-another-ai',
    keyword: 'continue chatgpt conversation in claude',
    intent: 'browser-extension',
    h1: 'Continue a ChatGPT chat in Claude or another AI',
    description: 'Hit a ChatGPT limit or want a second opinion? Carry the conversation into Claude, Gemini, DeepSeek or another supported site in one step, context included.',
    title: 'Continue a ChatGPT Chat in Claude or Any AI | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    localePath: '/zh/continue-in-another-ai/',
    priority: 'P0',
  },
  {
    slug: 'ai-chat-memory',
    keyword: 'back up chatgpt chats',
    intent: 'browser-extension',
    h1: 'Back up ChatGPT chats (and any AI chat) locally',
    description: 'Back up ChatGPT chats to a searchable library in your browser, export to Markdown, Word or PDF, and reuse a saved thread as context in another model.',
    title: 'Back Up ChatGPT Chats to a Local Library | ModelAny',
    models: ['chatgpt', 'claude', 'gemini', 'deepseek'],
    localePath: '/zh/ai-memory/',
    priority: 'P1',
  },
  {
    slug: 'how-to-use',
    pathPrefix: 'zh',
    keyword: 'ModelAny使用教程',
    intent: 'browser-extension',
    lang: 'zh',
    h1: 'ModelAny 使用教程',
    description: '在 Chrome 或 Edge 安装 ModelAny，登录 DeepSeek、Kimi、豆包或 ChatGPT 等官网，一次提问并排对比；并说明导出对话与附上视频字幕的步骤。',
    title: 'ModelAny 使用教程 | 安装与第一次提问',
    models: ['chatgpt', 'deepseek', 'kimi', 'doubao'],
    localePath: '/how-to-use/',
    priority: 'P0',
  },
  {
    slug: 'export-ai-chat',
    pathPrefix: 'zh',
    keyword: 'AI对话导出PDF',
    intent: 'browser-extension',
    lang: 'zh',
    h1: '导出 AI 对话为 PDF、Word 或 Markdown',
    description: '在 ChatGPT、DeepSeek、Kimi 等页面用 ModelAny 右侧工具条，将当前对话导出为 PDF、Word 或 Markdown。文件在浏览器本地生成。',
    title: '导出 AI 对话为 PDF / Word / Markdown | ModelAny',
    models: ['chatgpt', 'deepseek', 'kimi', 'doubao'],
    localePath: '/export-chatgpt-conversation/',
    priority: 'P0',
  },
  {
    slug: 'video-summary',
    pathPrefix: 'zh',
    keyword: 'B站视频总结AI',
    intent: 'browser-extension',
    lang: 'zh',
    h1: '用已有 AI 账号总结 B 站与 YouTube 视频',
    description: '在 B 站或 YouTube 播放页附上字幕（保留时间点），再发给 DeepSeek、Kimi、豆包或 ChatGPT 做要点或章节时间线。无需 API Key。',
    title: 'B 站 / YouTube 视频总结 | ModelAny',
    models: ['chatgpt', 'deepseek', 'kimi', 'doubao'],
    localePath: '/youtube-video-summarizer/',
    priority: 'P0',
  },
  {
    slug: 'continue-in-another-ai',
    pathPrefix: 'zh',
    keyword: '换AI继续聊',
    intent: 'browser-extension',
    lang: 'zh',
    h1: '换个 AI 继续聊（带着上下文）',
    description: '次数用尽或需要第二个模型的意见时，把当前页面的近期对话整理后带到 DeepSeek、Kimi、Claude 等官网接着提问，无需从头重讲；长对话会自动保留最近若干轮。',
    title: '换个 AI 继续聊 | ModelAny',
    models: ['chatgpt', 'deepseek', 'kimi', 'claude'],
    localePath: '/continue-chat-in-another-ai/',
    priority: 'P1',
  },
  {
    slug: 'ai-memory',
    pathPrefix: 'zh',
    keyword: '本地AI记忆库',
    intent: 'browser-extension',
    lang: 'zh',
    h1: '本地 AI 记忆库',
    description: '将 ChatGPT、DeepSeek、Kimi 等对话存入仅保存在本机浏览器的记忆库，支持中英文全文检索、标签与备注，可再次带入任意支持的模型，也能导出为文件备份。',
    title: '本地 AI 记忆库 | ModelAny',
    models: ['chatgpt', 'deepseek', 'kimi', 'doubao'],
    localePath: '/ai-chat-memory/',
    priority: 'P1',
  },
  {
    slug: 'free-ai-no-login',
    pathPrefix: 'zh',
    keyword: '免登录的免费AI',
    intent: 'free-access',
    lang: 'zh',
    h1: '免登录的免费 AI：哪些真的能打开',
    description: '有些 AI 网站不注册就能对话，有些只是看起来可以。本文拆解「免登录」的三种含义、各自会让你失去什么，并给出一个一分钟内验证任何站点的方法。',
    title: '免登录的免费 AI：哪些真的能用 | ModelAny',
    models: ['chatgpt', 'gemini', 'deepseek', 'perplexity'],
    localePath: '/free-ai-no-login/',
    priority: 'P0',
  },
];

const focusCluster = {
  coding: 'developer-workflows',
  writing: 'writing-workflows',
  reasoning: 'reasoning-workflows',
  research: 'research-workflows',
  business: 'business-workflows',
  students: 'learning-workflows',
};

for (const page of bestForPages) {
  page.intent = 'use-case-selection';
  page.cluster = focusCluster[page.focus] || 'use-case-selection';
}
for (const page of alternativePages) {
  page.intent = 'product-substitution';
  page.cluster = page.focus ? `alternative-${page.focus}` : `alternative-${page.filter || page.target}`;
}
for (const page of freePages) {
  page.intent = 'free-access';
  page.cluster = page.special || 'free-access';
}
for (const page of pricingPages) {
  page.intent = 'pricing-api-economics';
  page.cluster = page.keyword.includes('api') ? 'api-economics' : 'plan-economics';
}
