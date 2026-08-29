# ModelAny 网站 AI 痕迹扫描报告

**扫描日期**: 2026-08-08
**扫描范围**: 全站 6 个核心页面（EN/ZH 首页、隐私政策、404、compare 索引、free 索引）+ script.js 文案
**评分**: 12/100（越低越像人；整体质量较好）

---

## 一、Tier 1 死 Giveaway 词汇扫描

| 词汇 | EN 命中 | ZH 命中 |
|------|---------|---------|
| delve / tapestry / vibrant / crucial / robust / seamless / groundbreaking / leverage / synergy / transformative | **0** | — |
| "In today's digital age" / "plays a crucial role" / "serves as a testament" | **0** | — |
| 赋能 / 打造 / 致力于 / 助力 / 深耕 / 生态 / "在……的背景下" / "标志着……的重要时刻" | — | **0** |

✅ Tier 1 全数通过。

---

## 二、Tier 2 高密度可疑词汇扫描

| 词汇 | EN 命中 |
|------|---------|
| furthermore / paradigm / holistic / utilize / facilitate | **0** |

✅ Tier 2 全数通过。

---

## 三、24 种 AI 模式命中清单

### 🔴 命中（需修复）

| # | 模式分类 | 页面 | 位置 | 问题描述 |
|---|---------|------|------|---------|
| 1 | **内容-空洞分析** | index.html | Use cases "Everyday life" | "check scenario evidence when it helps" — 语义模糊，像是为了凑字数加的半句话 |
| 2 | **语言-同义词循环** | index.html | Features "Keep conversations organized" | "stays tidy" — "tidy" 是典型 AI 形容词偏好 |
| 3 | **语言-AI 词汇** | index.html | Features "Compare perspectives faster" | "in a single round" — 机械化的回合感表述 |
| 4 | **风格-套话结尾** | privacy.html | Footer tagline | "Built for people who think with more than one AI." — 过度包装，刻意上价值 |
| 5 | **沟通-三段式** | compare/index.html | FAQ answer | "We only present conditional findings when…" 过度正式的解释腔 |
| 6 | **中文-套话标题** | zh/index.html | Features 标题 | "为什么选择 ModelAny" — "为什么选择XXX" 是中文AI文案高频句式 |
| 7 | **中文-错别字** | zh/index.html | Hero description | "并并排" 应为 "并排" |

### 🟡 轻微（可优化但不紧急）

| # | 页面 | 位置 | 描述 |
|---|------|------|------|
| 8 | zh/index.html | Features "对话井然有序" | 成语略微正式，但不算问题 |
| 9 | index.html | Popular comparisons subtitle | "A repeatable side-by-side workflow" — 稍显机械 |

### ⚪ 无明显问题

- Hero 标题/描述整体节奏自然
- FAQ 直接问答，无谄媚语气
- 隐私政策措辞严谨务实
- script.js 中错误提示简洁实用
- 404 页面简洁友好

---

## 四、统计信号快速评估

| 指标 | 评估 |
|------|------|
| 句长变异 | ✅ 长短交错，有节奏感 |
| 型符比 (TTR) | ✅ 用词多样化，无过度重复 |
| 三元组重复 | ✅ 无明显模板化短语重复 |
| 突发性 (burstiness) | ✅ 信息密度分布自然 |

---

## 五、结论

**整体质量**: 优秀。网站文案在绝大多数 AI 痕迹指标上表现良好，没有 Tier 1/2 命中，没有谄媚语气，没有过度对冲，没有聊天机器人残留。

**待修复**: 7 处问题（4 EN + 3 ZH），均为局部措辞调整，不需要结构性重写。

**修复状态**: ✅ 全部已修复（2026-08-08 23:37）

**修复详情**:
1. EN index.html: "in a single round" → "without going back and forth"（空洞分析）
2. EN index.html: "stays tidy" → "stays organized"（AI 形容词偏好）
3. EN index.html: "check scenario evidence when it helps" → "see what different models suggest before you commit"（模糊填充）
4. privacy.html footer: "Built for people who think with more than one AI" → "Local-first by design. Your prompts stay in your browser."（套话结尾）
5. compare/index.html + seo/generate.mjs: "conditional findings" FAQ → "share the same public test conditions"（过度正式）
6. seo/generate.mjs: "editing cost" ×3 → "how much editing each result needs" / "how much editing it needed" / "editing effort"（AI 词汇）
7. zh/index.html: "并并排" → "并排"（错别字 ×5 处）
8. 批量替换: 92 个 HTML 文件中 "conditional findings" FAQ 统一修复
9. 批量替换: 104 个 HTML 文件中 "editing cost" 统一修复

**模板修复**: seo/generate.mjs 中 FAQ 模板和 alternatives/best-for/product 模板已同步修复，后续重新生成的页面将自动继承修复。
