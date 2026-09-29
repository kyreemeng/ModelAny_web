<div align="center">
  <img src="assets/readme-icon.png" alt="ModelAny" width="140">
  <h1>ModelAny</h1>
  <p><strong>Ask multiple AI at once &amp; compare the answers side by side.</strong></p>
  <p>一次提问，多个 AI 同时回答，并排对比。用你自己的账号，完全免费。</p>
  <p>
    <a href="https://www.modelany.app/"><img src="https://img.shields.io/badge/Website-modelany.app-5B3FE4?style=flat-square" alt="Website"></a>
    <a href="https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn"><img src="https://img.shields.io/badge/Chrome-Web_Store-4285F4?style=flat-square" alt="Chrome Web Store"></a>
    <a href="https://microsoftedge.microsoft.com/addons/detail/lfeckjibcfbjfdlepidpmnalpfimhdli"><img src="https://img.shields.io/badge/Edge-Add-ons-0C9EE8?style=flat-square" alt="Edge Add-ons"></a>
    <img src="https://img.shields.io/badge/Pricing-Free-0b6e63?style=flat-square" alt="Free">
    <img src="https://img.shields.io/badge/Manifest-V3-111318?style=flat-square" alt="Manifest V3">
    <img src="https://img.shields.io/badge/Data-100%25_local-6b7280" alt="100% local">
  </p>
  <p>
    <a href="https://www.modelany.app/"><strong>Website</strong></a> ·
    <a href="https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn"><strong>Install for Chrome</strong></a> ·
    <a href="https://microsoftedge.microsoft.com/addons/detail/lfeckjibcfbjfdlepidpmnalpfimhdli"><strong>Install for Edge</strong></a> ·
    <a href="#-中文介绍">中文介绍</a> ·
    <a href="#-link-submission-kit-外链提交信息包">Link-Submission Kit</a>
  </p>
</div>

---

This is the official website repository of **ModelAny** ([modelany.app](https://www.modelany.app/)) — the home of the free Chrome & Edge extension that sends one question to multiple AI sites at once and lines up every answer side by side.

> **What ModelAny is:** a browser extension that works on top of the AI websites you already use — ChatGPT, Claude, Gemini, Grok, DeepSeek, Kimi, Doubao, Qwen, GLM, Tencent Yuanbao and Wenxiaoyan — under **your own accounts**. No API key, no credits, no middleman server. It also adds the tools those sites leave out: chat export, cross-model hand-off, video summaries, and a local memory library.

## Why ModelAny exists

| The daily friction | ModelAny's answer |
|---|---|
| Pasting the same question into five tabs to compare answers | Type once, send to up to 11 AI sites, read the answers side by side |
| No clean way to save a great AI conversation as a document | One-click export to Markdown, Word or PDF — generated in your browser |
| Hitting a message cap mid-task and re-explaining everything elsewhere | Continue in another AI with the conversation's context carried over |
| Summarizing a long video means hunting for the transcript first | Attach YouTube / Bilibili captions with timestamps, then ask any AI |
| Best chats scattered across six AI apps | A searchable memory library that lives only on your computer |
| Every AI tool wants another subscription or credit pack | ModelAny is free; you use the accounts and quotas you already have |

## Features

### ⚡ Ask multiple AI at once, compare side by side
One input, sent in parallel to the models you select. The comparison page lines up every answer, highlights where models agree or disagree (a locally computed keyword-overlap heuristic), and exports a Markdown report.

### 📤 Export any AI chat
A slim tab on the edge of every supported AI site exports the current conversation as **Markdown, Word (.docx) or PDF**, or copies it as Markdown. Files are generated in your browser and saved locally.

### 🔁 Continue in another AI — context included
Hit a usage limit or want a second opinion? Carry the current conversation into Claude, Gemini, DeepSeek, Kimi or any other supported model in a new tab, without re-explaining the task. Long threads keep the most recent turns.

### 🎬 Attach videos, pages and files, then ask
- **YouTube / Bilibili**: attach captions with timestamps (~30-second segments) so answers can cite moments
- **Any article page**: attach the page text with navigation and ads stripped
- **Local files**: PDF, TXT, Markdown, HTML — parsed in your browser, never uploaded
- One-tap prompts after attaching: key points, chapter timeline, quotes, action items, find flaws, translate

### 🧠 Local memory library
Save chats from any supported AI into a library stored only in your browser (IndexedDB): full-text search in Chinese and English, tags, notes, and "bring into a model" to reuse saved threads as context. JSON backup and export included.

### 🎯 Prompt library
Save prompts once with `{{variables}}`, insert them from the popup or inside any supported AI site. Six starter prompts ship out of the box.

### 🔒 Privacy guard, not a claim
Sensitive-info detection flags phone, ID and card numbers, emails and API keys before sending, with one-click masking. ModelAny has **no server** — drafts, settings, history and memory stay in extension storage on your device.

### More entry points
Right-click menu (explain / translate / shorten / rewrite / save to memory), address-bar command (`ma` + space + question), dockable side panel, and keyboard shortcuts (`Ctrl+Shift+Y` popup, `Ctrl+Shift+1/2` ChatGPT / DeepSeek, `Ctrl+Shift+7` memory library). Diagnostics and manual input-box selection handle site redesigns.

## Supported AI websites (11)

| International | China |
|---|---|
| ChatGPT (chatgpt.com) | DeepSeek (chat.deepseek.com) |
| Claude (claude.ai) | Kimi (kimi.com) |
| Gemini (gemini.google.com) | Doubao 豆包 (doubao.com) |
| Grok (x.com/i/grok) | Qwen 通义千问 (qianwen.com) |
| | GLM 智谱清言 (chatglm.cn) |
| | Tencent Yuanbao 腾讯元宝 (yuanbao.tencent.com) |
| | Wenxiaoyan 文小言 (wenxin.baidu.com) |

## What's on the website (modelany.app)

- **Evidence-backed comparisons** — [/compare/](https://www.modelany.app/compare/) pages render only public-benchmark results where both models share the same test category (Arena preference, SWE-bench Verified), with exact model versions and source links
- **Public benchmark hub** — [/benchmarks/](https://www.modelany.app/benchmarks/), snapshots by scenario, refreshed on a schedule
- **Workflow guides** — [compare AI answers side by side](https://www.modelany.app/side-by-side-ai-comparison/), [ChatGPT vs Claude vs Gemini on the same prompt](https://www.modelany.app/chatgpt-vs-claude-vs-gemini-same-prompt/), [export ChatGPT conversations](https://www.modelany.app/export-chatgpt-conversation/), [summarize YouTube videos](https://www.modelany.app/youtube-video-summarizer/), [usage-limit workarounds](https://www.modelany.app/chatgpt-usage-limit-workaround/), [save & back up chats](https://www.modelany.app/ai-chat-memory/)
- **Chinese site** — [/zh/](https://www.modelany.app/zh/) with a dedicated comparison cluster for Chinese models ([GLM vs ChatGPT](https://www.modelany.app/zh/compare/glm-vs-chatgpt/), Kimi vs ChatGPT, Doubao vs ChatGPT, GLM vs DeepSeek…)
- `llms.txt` for AI crawlers, and a [privacy policy](https://www.modelany.app/privacy.html) matching the extension's local-first claims

## Who it's for

Students & researchers (cross-check facts, summarize lectures and papers), professionals (meeting notes, reports, emails), writers & creators (compare pitches of the same idea), developers (send one bug to ChatGPT, Claude and DeepSeek; export the thread to Markdown), and heavy AI users (several subscriptions in one place; hop models when one hits its cap).

## Privacy & security

- No ModelAny server: prompts go only to the AI sites you choose; nothing is uploaded to us
- Local storage: drafts, settings, history and memory live in your browser; uninstalling removes everything
- On-demand access: pages are read only when you click; minimal host permissions (the 11 AI domains + the official site)
- No remote code, no `eval`, no third-party analytics, no tracking
- Never bypasses usage limits, captchas or security checks — it performs only the steps you would do by hand

Full policy: [modelany.app/privacy.html](https://www.modelany.app/privacy.html) · Source: [github.com/kyreemeng/ModelAny](https://github.com/kyreemeng/ModelAny)

## Install

- **Chrome**: [Chrome Web Store](https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn)
- **Edge**: [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/lfeckjibcfbjfdlepidpmnalpfimhdli)
- Other Chromium browsers can usually install from the Chrome Web Store. Firefox, Safari and mobile are not supported.
- Build from source (extension repo): Node.js 22+, `npm install && npm run build`, then load `dist/` via `chrome://extensions` developer mode.

## FAQ

**Is it really free?** Yes — no subscription, no credits, no ads, no in-app purchases. AI answers are billed by each provider's own plans, which you already have.

**Do I need an API key?** No. ModelAny drives the web apps you're signed into: it opens the page, fills the prompt and sends, exactly as you would.

**Can my account get restricted?** ModelAny only automates your own manual steps, one prompt at a time. It does not send bulk requests or bypass any limits.

**Where does my data go?** Nowhere beyond the AI sites you pick. Exports and the memory library are generated and stored locally.

**Which browsers?** Chrome and Microsoft Edge via the official stores; other Chromium browsers usually work.

## Contact & license

- Issues & feedback: [github.com/kyreemeng/ModelAny/issues](https://github.com/kyreemeng/ModelAny/issues)
- Email: **kyreemeng@gmail.com**
- License: custom source-available license — the code is public for reading and auditing; redistribution and repackaging are not permitted (see the extension repo's [LICENSE](https://github.com/kyreemeng/ModelAny/blob/main/LICENSE)).

## About this repository

This site is plain HTML/CSS/JS — no framework, no build step, zero runtime dependencies. Preview locally:

```bash
python3 -m http.server 8765   # then open http://localhost:8765
```

Programmatic SEO pages (`/compare/`, `/best-for/`, `/alternatives/`, `/free/`, `/pricing/`, `/zh/compare/` and the workflow pages) are generated by `seo/generate.mjs`, which also writes `sitemap.xml` and Vercel redirect rules:

```bash
npm run generate:seo        # regenerate pages + sitemap + redirects
npm run render:benchmarks   # re-render latest benchmark snapshots into pages
npm test                    # contract tests (node --test)
```

Compare pages are generated only where every compared model shares public third-party benchmark coverage; guides carry task-scoped selection criteria and official sources, never context-free rankings.

---

<a id="-中文介绍"></a>
## 🀄 中文介绍

**ModelAny**（官网 [modelany.app](https://www.modelany.app/)）是一款免费的 Chrome / Edge 浏览器插件：**一次提问，同时发给你已在使用的多个 AI 官网，并排比较每一份回答。**

不复制粘贴、不改提示词、不换标签页。它不是一个新的聊天机器人，也不是 API 聚合平台——没有 API Key、不卖积分、没有中间服务器。你的问题直接发到官方网站，用的是你自己的账号：免费账号用免费额度，Plus / Pro 会员照常使用。

### 核心功能

- **一问多答**：一次输入，同时发给最多 11 个 AI（ChatGPT、Claude、Gemini、Grok、DeepSeek、Kimi、豆包、通义千问、智谱 GLM、腾讯元宝、文小言）；对比页并排展示，本地计算回答重合度供交叉验证参考，可导出 Markdown 报告
- **对话一键导出**：在 11 个 AI 网站页面右侧的 ModelAny 小标签里，把当前对话导出为 **Markdown / Word / PDF**，或复制为 Markdown；文件在浏览器本地生成
- **换个模型继续聊**：触发次数上限或想要第二意见时，把当前对话带上下文交给 Claude、Gemini、DeepSeek 等模型接着聊，无需从头解释；长对话自动保留最近几轮
- **视频 / 网页 / 文件即附即问**：YouTube 与 B 站视频附上带时间点的字幕（约 30 秒分段）；文章页附上去除导航广告的正文；本地 PDF / TXT / Markdown / HTML 在浏览器内解析；附上后一键「总结要点 / 章节时间线 / 金句 / 行动项 / 找漏洞 / 翻译」
- **本地记忆库**：把各 AI 的对话存进只在本机浏览器（IndexedDB）的库，中英文全文搜索、标签备注、JSON 备份，可把选中的记忆组装成上下文带入任意模型
- **提示词库**：常用提示词存一次，弹窗内或 AI 页面内一键插入，支持 `{{变量}}` 填空
- **敏感信息检查**：发送前识别手机号、身份证号、银行卡号、邮箱、API Key，一键脱敏
- **更多入口**：右键菜单、地址栏 `ma` 命令、侧边栏、快捷键（`Ctrl+Shift+Y` 打开弹窗）、站点改版兜底的手动指定输入框与诊断

### 与其他 AI 工具的区别

| | 积分制 AI 侧边栏 | 浏览器内置 AI | **ModelAny** |
|---|---|---|---|
| 费用 | 订阅 + 积分 | 基础免费，高级付费 | **完全免费** |
| 账号 | 平台的账号和额度 | 厂商自家账号 | **你自己的各家官方账号** |
| 模型 | 平台接入什么用什么 | 只有自家模型 | **11 个 AI 官网自由组合** |
| 提示词经过谁 | 平台服务器转发 | 厂商服务器 | **直接发到你勾选的官网** |
| 国产模型 | 部分支持 | 不支持 | **DeepSeek、Kimi、豆包等全部支持** |

### 安装

- **Chrome**：[Chrome 网上应用店](https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn)
- **Edge**：[Microsoft Edge 加载项](https://microsoftedge.microsoft.com/addons/detail/lfeckjibcfbjfdlepidpmnalpfimhdli)

### 隐私

没有 ModelAny 服务器：提示词只发给你勾选的 AI 官网；草稿、设置、历史与记忆库全部保存在本机浏览器；不加载远程代码、不做第三方统计；绝不绕过任何平台的用量限制或安全机制。完整说明见[隐私政策](https://www.modelany.app/privacy.html)。

### 联系

GitHub Issue：[kyreemeng/ModelAny/issues](https://github.com/kyreemeng/ModelAny/issues) · 邮箱：**kyreemeng@gmail.com**

---

<a id="-link-submission-kit-外链提交信息包"></a>
## 🔗 Link-Submission Kit（外链提交信息包）

> 做外链/目录收录时，表单要填的字段大同小异：**名称、多长度描述、类目与标签、价格、平台、链接、图片素材、联系方式，外加所有权验证；相当一部分 AI 目录还要求互挂回链。** 本节把所有字段一次备齐，直接复制即可。字符数均为实测。

### 1. 核心字段速查（Common form fields → paste-ready values）

| 表单字段 | 填写内容 |
|---|---|
| Product name / 产品名称 | `ModelAny` |
| Tagline / 一句话标题 | `Ask multiple AI at once & compare answers side by side`（54 chars） |
| Ultra-short tagline（约 25 字段） | `Ask multiple AI at once`（23 chars） |
| One-liner（约 100 字段） | `Send one question to 11 AI sites at once and compare the answers side by side. Free, no API key.`（96 chars） |
| Pricing / 价格 | `Free`（无订阅、无积分、无广告、无内购） |
| Platform / 平台 | `Chrome, Microsoft Edge (Chromium)` |
| Category 主类目 | `AI Tools` → `Productivity` / `Browser Extensions`（或 `AI Chat & Assistants`） |
| Languages / 语言 | `English, 中文 (Simplified)` |
| Version / 版本 | `2.0.0`（Manifest V3） |
| Released / 发布时间 | `2026-07`（商店上架；官网 2026-07-12） |
| Maker / 开发者 | 独立开发者（kyreemeng） |
| Users / 流量数据 | **不填**（未公开统计数据，不要编造） |

### 2. 描述文案（Descriptions at required lengths）

**Short description — 150 字段（实测 144 chars）**

```
One question, 11 AI answers side by side. Export chats to PDF/Word/Markdown, summarize YouTube videos, continue in another AI. Free, no API key.
```

**Short description — 200 字段（实测 186 chars）**

```
Free Chrome & Edge extension. Send one question to ChatGPT, Claude, Gemini, DeepSeek and 7 more official AI sites at once, then compare every answer side by side. No API key, no credits.
```

**Long description — 400–600 字段（实测 560 chars）**

```
ModelAny is a free Chrome and Edge extension to ask multiple AI at once and compare the answers side by side. One prompt goes in parallel to the official sites you already use — ChatGPT, Claude, Gemini, Grok, DeepSeek, Kimi and more — under your own accounts, with no API key, credits or middleman server. It also exports any chat to Markdown, Word or PDF, continues a ChatGPT conversation in Claude with context when you hit a limit, summarizes YouTube/Bilibili videos from transcripts, and keeps a searchable local memory library. Data stays in your browser.
```

**Full description — 1000+ 字段（实测 953 chars）**

```
ModelAny is a free browser extension for Chrome and Edge that lets you ask multiple AI at once and compare the answers side by side. Send one question in parallel to the official sites you already use — ChatGPT, Claude, Gemini, Grok, DeepSeek, Kimi, Doubao, Qwen, GLM, Tencent Yuanbao and Wenxiaoyan — under your own accounts. No API key, no credits, no middleman server: prompts go directly to the AI websites you select. ModelAny also adds the tools those sites leave out: one-click export of any conversation to Markdown, Word or PDF; continuing a ChatGPT chat in Claude (or any other model) with context when you hit a usage limit; summarizing YouTube and Bilibili videos by attaching transcripts with timestamps; a searchable local memory library for every chat; and a reusable prompt library with variables. Local-first by design: drafts, settings, history and the memory library stay in your browser, and nothing is uploaded to a ModelAny server.
```

**中文一句话（实测 20 字）**

```
一次提问，多个 AI 同时回答，并排对比
```

**中文短介绍（实测 113 字）**

```
免费的 Chrome / Edge 浏览器插件：把同一问题同时发给 ChatGPT、Claude、Gemini、DeepSeek 等 11 个 AI 官网，并排比较回答。可导出对话、总结视频、跨模型接力，无需 API Key。
```

**中文长介绍（实测 516 字）**

```
ModelAny 是一款免费的 Chrome / Edge 浏览器插件：一次提问，同时发给你已在使用的多个 AI 官网——ChatGPT、Claude、Gemini、Grok，以及 DeepSeek、Kimi、豆包、通义千问、智谱 GLM、腾讯元宝、文小言——并排比较每一份回答。使用你自己的账号：免费账号用免费额度，Plus / Pro 会员照常使用；不需要 API Key，不卖积分，没有 ModelAny 中间服务器，提示词只发到你勾选的官网。它还补上了这些网站缺少的能力：一键把对话导出为 Markdown / Word / PDF；触发用量上限时带着上下文换到另一个 AI 继续聊；为 YouTube / B 站视频附上带时间点的字幕做总结；把对话存进仅在本机浏览器里的可检索记忆库；以及可复用的提示词库。发送前自动识别手机号、银行卡号、API Key 等敏感信息并可一键脱敏。本地优先：草稿、设置、历史与记忆库都保存在你的浏览器里，不上传任何数据到 ModelAny 服务器。配套官网 modelany.app 提供基于公开评测（Arena、SWE-bench Verified）的模型对比、实用工作流教程与中文对比页。
```

### 3. 标签 / 关键词（Tags & keywords）

```
ChatGPT, Claude, Gemini, DeepSeek, Kimi, Doubao, Qwen, GLM, AI chatbot, browser extension, compare AI answers, ask multiple AI, side by side comparison, AI chat export, YouTube video summary, prompt library, local-first, productivity
```

中文侧标签：`ChatGPT`、`AI 对比`、`浏览器插件`、`DeepSeek`、`Kimi`、`豆包`、`AI 效率`、`对话导出`

### 4. 链接清单（All URLs you will be asked for）

| 用途 | URL |
|---|---|
| 官网（英文） | https://www.modelany.app/ |
| 官网（中文） | https://www.modelany.app/zh/ |
| Chrome 商店（下载页） | https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn |
| Edge 商店（下载页） | https://microsoftedge.microsoft.com/addons/detail/lfeckjibcfbjfdlepidpmnalpfimhdli |
| 扩展源码仓库 | https://github.com/kyreemeng/ModelAny |
| 官网源码仓库 | https://github.com/kyreemeng/ModelAny_web |
| 隐私政策 | https://www.modelany.app/privacy.html （中文：/zh/privacy.html） |
| 支持 / 反馈 | https://github.com/kyreemeng/ModelAny/issues |
| 联系邮箱 | kyreemeng@gmail.com |
| AI 爬虫说明 | https://www.modelany.app/llms.txt |
| 深度页（做锚文本用） | /compare-ai-models/ · /export-chatgpt-conversation/ · /youtube-video-summarizer/ · /continue-chat-in-another-ai/ · /ai-chat-memory/ · /chatgpt-vs-claude-vs-gemini-same-prompt/ · /benchmarks/ · /zh/compare/glm-vs-chatgpt/ |

商店扩展 ID（部分目录/商店验证要用）：Chrome `kbpnggjenonafpcigahfaeiooojepfjn` · Edge `lfeckjibcfbjfdlepidpmnalpfimhdli`

### 5. 图片素材（Logo & screenshots, direct URLs）

| 素材 | 尺寸 | URL |
|---|---|---|
| Logo（方形，主用） | 512×512 | `https://raw.githubusercontent.com/kyreemeng/ModelAny_web/main/assets/favicon-512.png` |
| Logo 备用 | 192×192 | `https://raw.githubusercontent.com/kyreemeng/ModelAny_web/main/assets/favicon-192.png` |
| Apple touch 图 | 180×180 | `https://raw.githubusercontent.com/kyreemeng/ModelAny_web/main/assets/apple-touch-icon.png` |
| 小图标 | 32×32 | `https://raw.githubusercontent.com/kyreemeng/ModelAny_web/main/assets/favicon-32.png` |
| 分享封面（英文） | 1200×630 | `https://raw.githubusercontent.com/kyreemeng/ModelAny_web/main/assets/og-image.jpg` |
| 分享封面（中文） | 1200×630 | `https://raw.githubusercontent.com/kyreemeng/ModelAny_web/main/assets/og-image-zh.jpg` |
| 截图：弹窗+视频字幕 | — | `https://raw.githubusercontent.com/kyreemeng/ModelAny/main/docs/screenshots/v2/popup-video.png` |
| 截图：AI 页内工具条 | — | `https://raw.githubusercontent.com/kyreemeng/ModelAny/main/docs/screenshots/v2/ai-site-toolbar.png` |
| 截图：导出 PDF | — | `https://raw.githubusercontent.com/kyreemeng/ModelAny/main/docs/screenshots/v2/export-pdf.png` |
| 截图：换模型继续 | — | `https://raw.githubusercontent.com/kyreemeng/ModelAny/main/docs/screenshots/v2/popup-continue.png` |
| 截图：附网页正文 | — | `https://raw.githubusercontent.com/kyreemeng/ModelAny/main/docs/screenshots/v2/popup-page.png` |
| 截图：本地记忆库 | — | `https://raw.githubusercontent.com/kyreemeng/ModelAny/main/docs/screenshots/v2/memory-library.png` |
| 截图：侧边栏 | — | `https://raw.githubusercontent.com/kyreemeng/ModelAny/main/docs/screenshots/v2/sidepanel.png` |

> 部分目录要求特定截图尺寸（常见 1280×800 或 640×400）。现有截图按原始比例上传即可；若平台强制裁剪，优先给「弹窗+视频字幕」和「页内工具条」两张。

### 6. Pros / Cons（AlternativeTo、SaaSHub 类表单用）

**Pros**

- Free — no subscription, credits or ads
- Works with your existing AI accounts; no API key
- 11 official AI sites in one send, including Chinese models (DeepSeek, Kimi, Doubao…)
- Local-first: no middleman server, data stays in the browser
- Chat export to Markdown / Word / PDF from the page itself

**Cons**

- Chrome / Edge (Chromium) only — no Firefox, Safari or mobile
- Depends on AI sites' own layouts; occasional adaptation needed after redesigns
- Free-tier rate limits of each AI site still apply

### 7. What's new（版本动态栏用）

```
v2.0.0 — Multi-AI compare with overlap analysis; export any chat to Markdown / Word / PDF;
continue in another AI with context; YouTube & Bilibili transcript summaries; local memory
library with full-text search; prompt library; sensitive-info masking; Edge Add-ons listing.
```

### 8. 所有权验证（Ownership verification）

目录平台通常用三种方式之一验证你拥有该网站：

| 方式 | 做法 |
|---|---|
| Meta 标签 | 在本仓库 `index.html` 的 `<head>` 加一行平台给的 `<meta name="xxx" content="...">`，部署后回平台点验证 |
| DNS TXT | 在域名 DNS 添加平台给的 TXT 记录（不需要改代码） |
| 根目录文件 | 把平台给的验证文件放进仓库根目录（静态托管，放进去即可访问） |

另外：Chrome 商店所有权用 Web Store 开发者账号确认；GitHub 相关目录用仓库 README 外链 + profile 上的网站字段确认。

### 9. 互换回链片段（Reciprocal-backlink snippets）

不少 AI 目录要求「挂上我们的链接」才给收录。三种现成片段（平台给了徽章图就替换 `img src`）：

**文本回链（通用）**

```html
<a href="https://www.modelany.app/">ModelAny — Ask multiple AI at once & Compare Answers Side by Side</a>
```

**带图徽章回链**

```html
<a href="https://www.modelany.app/"><img src="https://raw.githubusercontent.com/kyreemeng/ModelAny_web/main/assets/og-image.jpg" alt="ModelAny — ask multiple AI at once" width="240"></a>
```

**锚文本多样化深链（按对方目录的主题挑一条用，避免全站单一锚文本）**

```html
<a href="https://www.modelany.app/compare-ai-models/">how to compare AI models with the same prompt</a>
<a href="https://www.modelany.app/export-chatgpt-conversation/">export ChatGPT conversation to PDF, Word or Markdown</a>
<a href="https://www.modelany.app/youtube-video-summarizer/">summarize YouTube videos with ChatGPT</a>
<a href="https://www.modelany.app/continue-chat-in-another-ai/">continue a ChatGPT conversation in Claude</a>
<a href="https://www.modelany.app/chatgpt-vs-claude-vs-gemini-same-prompt/">ChatGPT vs Claude vs Gemini: same prompt, three answers</a>
<a href="https://www.modelany.app/benchmarks/">public AI model benchmarks (Arena, SWE-bench)</a>
<a href="https://www.modelany.app/zh/compare/glm-vs-chatgpt/">GLM vs ChatGPT 公开评测对比</a>
```

> 建议：只为**本身有编辑质量、且与产品相关**的目录挂互惠链接；对明显批量生成、无审核的目录只收单向链接，避免卷入链接农场式互挂。

### 10. 提交渠道清单（Where to submit, tracked）

| 类别 | 渠道 | 状态 |
|---|---|---|
| 浏览器商店 | Chrome Web Store | ✅ 已上架 |
| 浏览器商店 | Microsoft Edge Add-ons | ✅ 已上架 |
| 代码社区 | GitHub（补 topics、向 awesome-lists 提 PR） | ✅ 仓库已有 / topics 待补 |
| 启动/产品目录 | Product Hunt（需 maker 认证） | ⬜ |
| 启动/产品目录 | BetaList、Launching Next、StartupBase | ⬜ |
| 替代品目录 | AlternativeTo（Pros/Cons 用第 6 节） | ⬜ |
| 替代品目录 | SaaSHub、StackShare、LibHunt（GitHub 项目） | ⬜ |
| AI 工具目录 | There's An AI For That、Futurepedia、Toolify、TopAI.tools、FutureTools、AI Tools Directory 等 | ⬜（逐个提交，按目录侧重微调标题/描述） |
| 开发者社区 | DevHunt、Hacker News（Show HN）、Reddit（r/chrome_extensions、r/SideProject 等） | ⬜（先读版规，真实分享） |
| 中文渠道 | 少数派、小众软件、AppSo/爱范儿（投稿）、V2EX「分享创造」、酷安、即刻 | ⬜ |
| AI 爬虫收录 | llms.txt 已部署；GPTBot / ClaudeBot / PerplexityBot 已放行 | ✅ |

提交节奏建议：按目录权重（DR）从高到低做；每条记录**提交日期 + 用的描述版本 + 是否要求回链 + 上架 URL**，两周后回查是否生效；不要用同一锚文本批量群发。

### 11. 内容红线（Keep it honest）

- 用户数、评分、下载量、排名等字段**一律留空**——没有公开统计，不要编造
- 性能/对比表述与官网一致：对比结论只来自公开评测且注明版本与日期；不做「全面第一」声明
- 「开源」表述统一为 **source-available（源码公开可审阅，专有许可）**，与扩展 LICENSE 保持一致
- 隐私口径只有一句：**本地优先，无 ModelAny 服务器**，与 privacy.html 完全一致
