# ModelAny SEO — 收录体检 + 关键词重打实施记录（2026-09-29）

**Property:** modelany.app（Web）  
**Work mode:** implementation（仅仓库内代码与内容；未提交任何 URL 给搜索引擎、未改动 index 控制之外的站点设置）  
**Evidence modes:** GSC 导出（2026-09-26，Coverage + Performance）、代码清单、生成产物抽查  
**依据:** qiaomu-seo 策略（P0 本周零成本 / P1 2–4 周一词一页 / 中文对比页加厚 / 收录瘦身）

---

## 1. Executive summary — 本轮三件事

1. **首页重打（P0）**：Title/H1/description 从自造说法「Ask Any Model at Once」改为真实搜索语言「Ask Multiple AI at Once & Compare Answers Side by Side」。
2. **一词一页（P1）**：8 个关键词各自落到明确页面（2 个新页 + 6 个重打/深化页），全部要求可核验证据，不写无依据的实测声明。
3. **收录瘦身**：/best-for/ 从 38 个可收录页砍到 4 个（其余 noindex、退出 sitemap）；/free/ 与 /alternatives/ 重叠页合并为每意图一个存活 URL（301 归并）。sitemap 从 118 → 82 个 URL。

---

## 2. 收录体检（P0，先于一切加页）

GSC 导出（2026-09-26）两个真警报信号：

| 信号 | 数量 | 已收录数 | 警报判定 |
|---|---|---|---|
| 已抓取-尚未编入索引（Crawled – not indexed） | 1 | ~83 | 健康（比例 ~1%，远低于“超过已收录数”的警报线） |
| 已发现-尚未编入索引（Discovered – not indexed） | 8 | ~83 | 健康（~10%） |

**结论：无收录紧急事故。** 机器人屏蔽、canonical 备用页、404 均为自主控制的正常结果，不处理。真正的损失来自内容自相竞争与模板化页面（GSC 里 best-for/* 大量曝光零点击、alternatives 三页打同一词），这正是本轮瘦身与重打的对象。

**复查规则（部署后）**：重新导出 Coverage。若「已抓取/已发现-尚未编入索引」合计超过已收录页数，才需要逐 URL 下钻处理；noindex 撤出页面会让两个桶先降后稳，属预期。

---

## 3. P0：首页重打（implemented）

| 位置 | 旧 | 新 |
|---|---|---|
| Title | Ask Any Model at Once: ChatGPT, Claude, Gemini & 8 More | **Ask Multiple AI at Once & Compare Answers Side by Side \| ModelAny** |
| Description | ask 11 AIs at once…（自造数字开头） | Send one question to ChatGPT, Claude, Gemini, DeepSeek and more official AI sites at once, then compare the answers side by side… |
| H1 | Ask ChatGPT, Claude, Gemini & 8 more AIs at once | **Ask multiple AI at once & compare the answers side by side** |
| OG/Twitter/WebSite/WebPage schema | 同旧说法 | 同步更新 |

中文首页已是真实说法（一次提问，同时问 11 个 AI），未动。GSC 里「ask any model」23 曝光 0 点击的歧义短语不再占用 Title 黄金位置；页脚内链锚文本「Ask multiple AIs at once」从 /compare-ai-models/ 移除，避免与首页抢同一短语（该链接改回「Compare AI models」）。

---

## 4. P1：一词一页（5–8 页名单 → 落位）

| 关键词 | 页面 | 动作 | 状态 |
|---|---|---|---|
| ask multiple AI at once | /（首页） | P0 重打，首页即该词的页 | implemented |
| compare AI answers side by side | /side-by-side-ai-comparison/ | 重打：新 Title/H1，新增「按什么顺序判断」四条评分标准（事实→覆盖→修改成本→失败方式）与「把对比变成记录」节 | implemented |
| chatgpt vs claude vs gemini same prompt | /chatgpt-vs-claude-vs-gemini-same-prompt/（新） | 独有内容：五分钟方法 + 5 条可复用提示词包 + 评分表 + 三方共享公开评测自动渲染 | implemented |
| export chatgpt conversation to pdf / to markdown | /export-chatgpt-conversation/ | 深化：拆出 to Markdown / to PDF / to Word 三个专节（Markdown 节明确 Notion/Obsidian/Git 场景） | implemented |
| save chatgpt conversation / back up chats | /ai-chat-memory/ | 重打：Title/H1/正文落到 save & back up ChatGPT chats，新增「Back up as a file」节；FAQ 新增「How do I save a ChatGPT conversation?」 | implemented |
| summarize youtube video | /youtube-video-summarizer/ | 重打：Title 改为 Summarize YouTube Videos with ChatGPT, Claude or Gemini | implemented |
| continue chatgpt conversation in claude | /continue-chat-in-another-ai/ | 深化：新增「Moving a ChatGPT conversation into Claude」专节（触顶场景 + 发送前核对提醒） | implemented |
| chatgpt usage limit workaround | /chatgpt-usage-limit-workaround/（新） | 四种正规做法（等重置/站内换模型/带上下文换 AI/反复触顶再升级）+ 明确「不要做的事」（不教违规绕过，与扩展 ToS 立场一致） | implemented |

**证据边界**：所有页面不虚构任何实测数据；公开评测结论仅引用仓库内带抓取日期的快照（2026-09-27）与官方来源链接。

---

## 5. 中文对比页加厚（优先级最高的一组）

为 4 个已出点击的中文对比对新增每对专属「差异节」（`seo/data/zh-compare-notes.mjs` + 生成器注入），不再是纯模板：

| 对 | 快照证据（SWE-bench Verified，抓取 2026-09-27） |
|---|---|
| GLM vs ChatGPT（3 点击/61 曝光/位 7.1） | GLM 5 (high) 72.8% ≈ GPT 5.2 (high) 72.8%，已追平；GLM-4.6 68.2% 落后 |
| Kimi vs ChatGPT | K2.5 (high) 70.8% vs GPT 5.2 72.8%，差距仅 1.5–2 分 |
| Doubao vs ChatGPT | TRAE + Doubao-Seed-Code 78.8% 列全榜第 3，高于快照中 ChatGPT 系最佳（74.6%）——标注为「智能体+模型组合成绩」 |
| GLM vs DeepSeek（位 6.9） | GLM 5 72.8%（25）vs V3.2 (high) 70%（46） |

每对还含：访问/登录条件、产品定位、价格（只链官方页、不引用数字）三块使用条件差异，以及 3 条针对该对的同题实测任务。其余中文对比对暂用共享模板，待各自有曝光证据后再加厚。

---

## 6. 收录瘦身（含破坏性操作清单）

- **/best-for/：38 → 4 可收录**。保留 coding、code-review、academic-writing、excel（GSC 有曝光）。其余 34 页保留可访问但主动 noindex、退出 sitemap；hub 只链保留页。未做 404/删除——noindex 完全可逆。
- **/free/ 与 /alternatives/ 合并**：/alternatives/free-chatgpt/ 为唯一存活页（正文已补「官方免费层 vs 免费替代品」双意图）；301 归并 /alternatives/chatgpt-free/、/alternatives/free-chatgpt-2026/、/free/chatgpt/；/free/best-ai-chatbot-2026/ → /free/best-ai-chatbot/。静态目录已删除，无绕过 301 的直开副本。
- **首页内链**：指向被撤页面（java/research/students/business/emails/writing/content-creation/debugging/translation）的链接全部改指保留页或新页。
- **回滚边界**：git revert 本轮提交并重新生成即可；301 为 permanent，若需撤销需同步改 vercel.json 与注册表。

---

## 7. Implementation record（四阶段）

| 阶段 | 状态 |
|---|---|
| Implemented | 是（本地仓库，`npm run generate:seo` 重新生成 110 页；34/34 测试通过） |
| Deployed and observable | 待部署（Vercel） |
| Processed by the search platform | 未发生（部署后由 Google 重新抓取，周期自然进行） |
| Outcome observed | 未发生 |

**验证抽查**：新页 Title/robots 正确；noindex 页不在 sitemap；vercel.json 101 条 redirect 含全部归并 301；中文差异节在 4 个目标页渲染；全站无「Ask Any Model」残留。

---

## 8. Monitoring plan（决策规则）

| 窗口 | 检查 | 决策规则 |
|---|---|---|
| Day 0–3（部署后） | URL Inspection：/、/chatgpt-vs-claude-vs-gemini-same-prompt/、/zh/compare/glm-vs-chatgpt/、/best-for/coding/ | 确认渲染后的 Title/robots 与本记录一致 |
| Day 7–14 | GSC Performance：首页「ask multiple AI」类查询 CTR；4 对中文对比页点击 | 首页新 Title 若 28 天 CTR 无改善，做 A/B 变体（换副标题，不动 H1 结构） |
| Day 28 | Coverage：两个警报桶 vs 已收录数；noindex 撤出数量变化 | 警报桶合计 > 已收录数才逐 URL 下钻；否则不干预 |
| Day 28–56 | 与前 28 天分段对比（页/查询维度） | 只在有分段证据时归因；不把流量波动归于单次改动 |

**Rerun inputs**：2026-10-27 前后重新导出 Coverage + Performance，与本文件对照。

---

## 9. Limitations

- 无 GSC API 实时访问；引用的是 2026-09-26 导出的聚合数，匿名查询不在导出内。
- 快照仅含 SWE-bench Verified 一个来源类别；中文对比页的「快照证据」目前只覆盖编程修复场景，通用对话/中文写作场景须靠读者同题实测。
- 本轮不保证任何收录、排名、点击结果；首页改 Title 的效果需 ≥28 天数据才能评估。
- apex `modelany.app` vs `www` 301 状态未验证（沿用上一轮记录的待办）。
