# ModelAny SEO — P0 全部 + P1 选定项实施记录（2026-10-06）

**Property:** modelany.app（Web）
**Work mode:** implementation（仅仓库内代码与内容；未向搜索引擎提交任何 URL、未改动站点设置、未购买任何外链）
**Evidence modes:** 第三方导出的 GSC 聚合数（2026-09 口径，见下方 Limitations）、仓库内代码与生成产物、公开站点抓取（curl）
**依据:** SEO 顾问 P0/P1/P2 清单；qiaomu-seo 证据纪律

**本轮范围（P1-3 / P1-4 / P1-5 / P2 经确认不做）:** P0 全部 + P1-1、P1-2、P1-6

---

## 1. Executive summary

1. **首页主词换血（P0-1）**：`ai chat comparison`（110/月、-42%）→ `ai comparison`（1300/月、KD 30.2、近 3 月 +15%），Title/H1/description/OG/Twitter/WebPage schema 全部改毕；首屏与 guides 网格改用真实搜索语言。
2. **两个 P0 新页 + 一个加厚页（P0-3、P0-4）**：`/compare-ai-models/` 补上货真价实的 11 模型同题实测记录表（中英双页）；新建 `/free-ai-no-login/`（720/月、KD 10.4），中英双页互配 hreflang。
3. **停止摊薄（P0-6）**：`/best-for/` 收到 5 页（其余 34 页 noindex、退出 sitemap）；`/free/` 整棵树并入 `/alternatives/` 与 `/pricing/`，24 条 301；全站无 `/free/` 残留内链。
4. **导出词组建组（P1-1）**：`/export-chatgpt-conversation/` 父页下新增 `/chatgpt-exporter/`、`/gemini-exporter/`、`/ai-exporter/`，各自只押一词；PDF 子页优先。
5. **中文对比页加厚（P1-2）**：14 个中文对比对全部补齐「快照 → 实用差异 → 同题实测包 → 怎么选 → 结论」五段结构，是本轮唯一有稳定点击的一组。

---

## 2. Scope / Work mode / Evidence mode

| 项 | 值 |
|---|---|
| 工作模式 | implementation（改代码与内容并重新生成静态站） |
| 覆盖范围 | 119 个生成页 + 手写静态页；86 个可收录 URL |
| 市场 | en（主）+ zh-CN（对比簇、免登录页） |
| 数据支撑 | GSC 聚合数（顾问口径）、仓库内 benchmark 快照、公开站点抓取 |
| 未做的事 | 未提交 URL、未买外链、未改 DNS/域名设置、未做 P1-3/P1-4/P1-5/P2 |

---

## 3. Coverage ledger

| 项 | 命中 | 处理 |
|---|---|---|
| 注册页总数 | 119 | 全部生成成功 |
| 可收录 URL | 86 | sitemap 收录 92 条 loc（含双语对） |
| 301 重定向 | 121 条 | 含 `/free/` 树 24 条 |
| 中文对比对 | 14 | 14/14 具备五段专属内容 |
| 导出组页 | 7 | 父页 + 6 子页全部互链 |
| noindex 页 | 34 | `/best-for/*` 未保留项 |

---

## 4. Findings（按影响排序）

| # | 发现 | 证据等级 | 本轮动作 |
|---|---|---|---|
| F1 | 首页主词是 `.com` 时代的低量词（110/月、-42%），浪费 Title 黄金位 | 顾问导出（observed） | 换为 `ai comparison`（1300/月、KD 30.2、+15%） |
| F2 | `/compare-ai-models/` 已排位置 4.8、45 曝光 2 点击，但正文没有可被引用的实测资产 | GSC 聚合（observed） | 11 模型同题记录表（中英），含版本/日期/档位三列 |
| F3 | `compare ai models`（480/月）无专门落点，被多页分食 | 顾问导出（observed） | 该页独占此词，Title/H1/description 三处对齐 |
| F4 | 「免登录」意图（720/月、KD 10.4）全站无页 | 顾问导出（observed） | 新建 `/free-ai-no-login/`（en+zh） |
| F5 | `ask many ai`、`豆包 vs chatgpt` 已有位置（均 8.2）却 0 点击 | GSC 聚合（observed） | 改写 Title/摘要，把结论前置 |
| F6 | `/best-for/` 38 页摊薄权重、`/free/` 与 `/alternatives/` 同轴竞争 | GSC 聚合（observed） | 收至 5 页 + 整树 301 归并 |
| F7 | 中英配对页面缺互相 hreflang，权重互耗 | 代码审计（observed） | `/compare/`、`/free-ai-no-login/` 等补齐双向声明 |
| F8 | `/free/` 被 301 后首页仍留着旧链接 | 代码审计（observed） | 改指 `/free-ai-no-login/`，全站残留清零 |

---

## 5. Implementation record（四阶段）

| 阶段 | 状态 |
|---|---|
| Implemented | 是（本地仓库；`node seo/generate.mjs` 生成 119 页，`npm test` 34/34 通过） |
| Deployed and observable | 待部署（Vercel） |
| Processed by the search platform | 未发生（部署后由 Google 自然重抓） |
| Outcome observed | 未发生 |

### 5.1 P0 明细

| 项 | 文件 | 状态 |
|---|---|---|
| P0-1 首页主词 | `index.html` | implemented |
| P0-3 11 模型实测表 | `seo/data/product-copy.mjs`、`seo/generate.mjs`（新增 `table` 渲染） | implemented |
| P0-4 免登录页 | `seo/data/pages.mjs`、`seo/data/product-copy.mjs` | implemented |
| P0-5 零点击词 Title/摘要 | `ask-multiple-ai-at-once/index.html`、`zh/compare/doubao-vs-chatgpt/` | implemented |
| P0-6 瘦身与合并 | `seo/data/pages.mjs`、`seo/generate.mjs`、`vercel.json` | implemented |
| P0-7 内链三规则 + hreflang | `seo/chrome.mjs`、`seo/generate.mjs` | implemented |

### 5.2 P1 明细（仅本轮确认的三项）

| 项 | 文件 | 状态 |
|---|---|---|
| P1-1 导出词组建组 | `seo/data/pages.mjs`、`seo/data/product-copy.mjs`、`seo/generate.mjs` | implemented |
| P1-2 中文对比页加厚 | `seo/data/zh-compare-notes.mjs`（14 对全部五段） | implemented |
| P1-6 `ask multiple ai at once` 占位 | `ask-multiple-ai-at-once/`（全站唯一该簇页） | implemented |

### 5.3 验证抽查结果

| 检查 | 结果 |
|---|---|
| 内链规则一：各级页 → 首页 | 0 页缺失 |
| 内链规则二：首页 → 最新页 | 6/6 关键新页可从首页到达 |
| 内链规则三：子页 → 父页 | 0 页缺失 |
| 中英 hreflang 互配 | `/compare/`、`/free-ai-no-login/`、8 对语言对应页全部双向 |
| `/free/` 残留内链 | 0 |
| 导出组父子互链 | 4/4 页互相可达 |
| 11 模型表渲染 | 中英各 11 行 × 9 列 |
| best-for 索引状态 | 5 index / 34 noindex |
| 测试 | 34/34 通过 |

---

## 6. Rerun inputs / Monitoring window / Decision rules

**Rerun inputs**

- GSC → 效果：按「页面」维度导出 `/`、`/compare-ai-models/`、`/free-ai-no-login/`、`/export-chatgpt-conversation-to-pdf/`、`/ask-multiple-ai-at-once/` 与 14 个 `/zh/compare/*/`
- GSC → 覆盖率：确认 34 个 noindex 页退出「已发现/已抓取」，同时确认 `/free/*` 的 301 未报错
- 站内脚本复跑：内链三规则审计 + hreflang 互配检查（本轮脚本逻辑可复用）

**Monitoring window**

| 窗口 | 检查项 | 决策规则 |
|---|---|---|
| Day 0–3 | 部署后 URL Inspection：首页、`/free-ai-no-login/`、`/compare-ai-models/`、`/ai-exporter/` | 确认 Title/robots/canonical 与记录一致；不一致先修生成器 |
| Day 7–14 | 首页 `ai comparison` 曝光与点击 | 曝光上升但 CTR < 1.5% → 换 description 前 120 字符，不动 H1 |
| Day 14–28 | `/free-ai-no-login/` 是否进入前 20 | 未进 → 按 P1-5 的四页锚文本清单优先补该页反链 |
| Day 28 | `/compare-ai-models/` 位次是否守住 4.8 | 跌出 10 → 检查是否与 `/ai-chat-comparison/` 关键词重叠，收紧分工 |
| Day 28–56 | 14 个中文对比页点击总量 | 无增长 → 对每个对补第三类同题任务，而不是开新页 |
| Day 56+ | `/free/*` 301 是否全部被 Google 消化 | 仍有「网页会自动重定向」条目 → 逐条 URL Inspection，不批量再提交 |

**不做的事（本轮已确认）**：P1-3（multiple.chat 拆解，线下手动）、P1-4（chatgptexporter.com 外链溯源）、P1-5（外链投放）、P2（三词页 / 首页冲前十 / 长尾枝叶）。

---

## 7. Limitations

- **无 GSC API 实时访问**：本记录引用的曝光/点击/位次来自顾问提供的 2026-09 口径聚合数，未在仓库内二次核验；部署后所有判断需以新导出为准。
- **搜索量与 KD 未在本仓库复算**：`ai comparison` 1300/月、KD 30.2 等为顾问口径；本地 `.env` 的第三方 API key 为空，`zens-ink kd` 仅能给出结构分（SERP 结构分 1/100 与 Ahrefs KD 不是同一指标，不可混用）。
- **不保证任何收录、排名或点击结果**：本轮为内容与结构改动，效果最少需 28 天分段数据才能评估。
- **未做 P1-3/P1-4/P1-5/P2**：因此本文不含外链投放计划、competitor 外链溯源结论与三词页方案。
- **中文对比页证据面偏窄**：`seo/data/zh-compare-notes.mjs` 的快照主要覆盖编程与推理类公开测试，通用写作/中文语感场景仍靠读者自行同题验证。
