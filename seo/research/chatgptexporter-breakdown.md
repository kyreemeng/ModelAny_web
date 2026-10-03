# chatgptexporter.com 逐页拆解（P2 竞品研究）

> 抓取日期：2026-10-02。来源：站点首页、/blog、页脚与 FAQ 区。DR52、域龄约 22 个月（第三方口径）。

## 1. 站点结构

| 路径 | 内容 | 押的词 |
|---|---|---|
| `/` | 首页：hero + 安装 CTA + 功能区 + 15 条多语言评价 + ~12 条 FAQ | chatgpt exporter / export chatgpt |
| `/pricing` | 订阅定价（3 天退款、学生/非营利折扣、支付宝/微信） | — |
| `/welcome` | 30 秒教程页 | — |
| `/docs/installation` | 唯一一篇文档：安装指南 | — |
| `/blog` ×7 | 见下表 | 导出簇全部长尾 |

博客逐篇（每篇只押一词，与我们的导出组同构）：

| 竞品文章 | 押词 | 我们的对应页 | 状态 |
|---|---|---|---|
| /en/blog/chatgpt-to-pdf-export-guide-2025 | chatgpt to pdf | /export-chatgpt-conversation-to-pdf/ | 已对位 |
| /en/blog/how-to-download-chat-gpt-results-to-pdf | download chatgpt to pdf | /download-chatgpt-conversation/ | 已对位 |
| /en/blog/save-chatgpt-conversation-as-pdf | save chatgpt conversation as pdf | /save-chatgpt-conversation/ | 已对位 |
| /en/blog/how-to-export-chatgpt-to-markdown | chatgpt to markdown | /export-chatgpt-conversation-to-markdown/ | 已对位 |
| /en/blog/how-to-export-chatgpt-to-json | chatgpt to json | 无 | 缺口（候选新页） |
| /en/blog/export-chatgpt-conversations-to-obsidian | export chatgpt to obsidian | 无（仅文案提及 Obsidian） | 缺口（候选新页） |
| /en/blog/how-to-bulk-export-chatgpt-conversations | bulk export chatgpt | 无 | 缺口（需求需先验证） |

## 2. 外链面（站外资产）

1. **Chrome 商店 Listing**：`ilmdofdhpnhffldihboadndccenlnfll`，80,000+ 用户、4.8 分——商店页本身是高权重外链 + 品牌信号。
2. **自有工具站网络（页脚互挂）**：ai-chat-exporter.net（Claude Exporter）、ai-chat-exporter.com（Gemini Exporter）、chat2pdf.org（在线 ChatGPT 转 PDF）。三个兄弟站互相导流，类似轻量 PBN 结构——注意我们**不效仿互挂网络**，但 chat2pdf.org 值得单独盯（它直接卡"chatgpt to pdf"在线工具意图）。
3. **多语言路径**：/en /zh-CN /zh-TW /ko /ja /es /it /de /pt 九语言子路径（疑似同一模板机翻，无 hreflang 深度运营的痕迹待查）。

## 3. 对位结论与行动

- **已对位 4/7**：PDF、Markdown、download、save 四个意图我们都有专门页，且 Title 各押一词（P1 已完成）。
- **真实缺口 2 个**：`chatgpt to json`（结构化数据/开发者意图）与 `export chatgpt to obsidian`（笔记库意图）。两者都符合"一词一页"，可作为导出组新子页挂到 /export-chatgpt-conversation/ 父页下（guideSetHtml 自动接线）。`bulk export` 先观察需求再决定。
- **差异化打法**：竞品博客是纯步骤文；我们的对应页应保持"成品导向 + 证据导向"（导出物长什么样、隐私边界、可验证事实），这是本次 P0-3 给 to-pdf 页补的区块方向。
- **外链纪律**：竞品的商店页外链来自 8 万用户规模，短期追不上；我们的杠杆是目录提交（见 README 提交套件）+ 树根与两个 P0 页的定向锚文本（已更新到 README）。锚文本多样化执行，勿复制竞品的单一锚文本模式。
