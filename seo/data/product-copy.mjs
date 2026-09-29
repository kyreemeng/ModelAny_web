/**
 * Feature / product page copy (EN + ZH).
 * Keys are page slugs. Prefer concrete steps and product facts over marketing filler.
 */

function section(id, heading, paragraphs = [], list = null, listOrdered = false) {
  return { id, heading, paragraphs, list, listOrdered };
}

function link(href, label) {
  return { href, label };
}

/** Map Chinese feature slugs to the English content key when structure is shared. */
const ALIAS = {
  'export-ai-chat': 'export-chatgpt-conversation',
  'video-summary': 'youtube-video-summarizer',
  'continue-in-another-ai': 'continue-chat-in-another-ai',
  'ai-memory': 'ai-chat-memory',
};

const COPY = {
  'how-to-use': {
    en: {
      eyebrow: 'Setup guide',
      leadHeading: 'From install to your first multi-AI question',
      lead: [
        'ModelAny is a free Chrome and Edge extension. It does not create a new AI account. You stay signed in to ChatGPT, Claude, Gemini, DeepSeek and the other sites you already use; ModelAny fills prompts, opens tabs, and adds export, memory and attachment tools those sites omit.',
        'Nothing is routed through a ModelAny server. Prompts go only to the AI websites you select. Drafts, settings, history and the memory library stay in your browser.',
      ],
      sections: [
        section('install', '1. Install and pin the extension', [
          'Install from the official store for your browser, then pin ModelAny so the icon stays on the toolbar.',
        ], [
          'Chrome: Chrome Web Store listing for ModelAny',
          'Microsoft Edge: Edge Add-ons listing for ModelAny',
          'After install, open chrome://extensions or edge://extensions only if you need to confirm the extension is enabled',
        ]),
        section('sign-in', '2. Sign in to the AI sites you use', [
          'Open each site in a normal tab and sign in as usual (free or paid). ModelAny does not replace those logins and does not ask for an API key.',
        ], [
          'ChatGPT, Claude, Gemini, DeepSeek and Grok for international workflows',
          'Kimi, Qwen, Doubao, GLM, Tencent Yuanbao and Wenxiaoyan when you work in Chinese',
        ]),
        section('ask', '3. Ask once and compare answers', [
          'Click the ModelAny icon, or press Ctrl+Shift+Y (⌘+Shift+Y on Mac). Enter one question, select the models, then send. ModelAny opens each official site, fills the prompt, and can submit it for you.',
          'Open the comparison view to read answers side by side, export a Markdown report, or save the thread into local memory.',
        ]),
        section('recipes', '4. Common follow-ups', [], [
          'Export: on any supported AI page, open the ModelAny edge tab → Markdown / Word / PDF',
          'Video: on YouTube or Bilibili, open the popup → Attach transcript → send a summary prompt',
          'Continue elsewhere: on an AI chat page → Continue in another AI → pick another model',
          'Prompts: save a template once, then insert it from the popup or inside a supported AI site',
        ]),
        section('limits', 'What to expect', [
          'Each AI site still enforces its own rate limits, region rules and plan quotas. If a site changes its layout, use the built-in diagnostics or point ModelAny at the input box manually.',
        ]),
      ],
      related: [
        link('/export-chatgpt-conversation/', 'Export chats to PDF, Word or Markdown'),
        link('/youtube-video-summarizer/', 'Attach YouTube or Bilibili transcripts'),
        link('/continue-chat-in-another-ai/', 'Continue a chat in another AI'),
        link('/ai-chat-memory/', 'Local AI chat memory'),
        link('/compare-ai-models/', 'Same-prompt model comparison'),
        link('/ai-browser-extension/', 'ChatGPT Chrome extension overview'),
      ],
      faqs: [
        {
          q: 'Do I need an API key?',
          a: 'No. ModelAny uses the web apps you already sign into. Free accounts work; paid plans keep their normal limits.',
        },
        {
          q: 'Where is my data stored?',
          a: 'Drafts, settings, send history and the memory library stay in browser extension storage on your device. Prompts are sent only to the AI sites you choose—not to a ModelAny backend.',
        },
        {
          q: 'Which browsers are supported?',
          a: 'Google Chrome and Microsoft Edge via their official extension stores. Other Chromium browsers may work if they can install from those stores, but they are not the primary tested targets.',
        },
      ],
      ctaHeading: 'Install ModelAny',
      ctaBody: 'Free on the Chrome Web Store and Microsoft Edge Add-ons. No ModelAny account, subscription or credits.',
    },
    zh: {
      eyebrow: '使用说明',
      leadHeading: '从安装到第一次同时问多个 AI',
      lead: [
        'ModelAny 是免费的 Chrome / Edge 浏览器扩展。它不会另开一套 AI 账号：你继续登录自己的 ChatGPT、DeepSeek、Kimi、豆包等官网；扩展负责填入问题、打开标签页，并补上导出、记忆库、附上字幕等这些网站本身缺少的能力。',
        '没有 ModelAny 自有服务器中转。提示词只发给你勾选的 AI 官网；草稿、设置、发送记录与记忆库都留在本机浏览器里。',
      ],
      sections: [
        section('install', '1. 安装并固定扩展图标', [
          '从当前浏览器对应的官方商店安装，然后把 ModelAny 固定到工具栏，方便随时点开。',
        ], [
          'Chrome：Chrome 网上应用店中的 ModelAny',
          'Microsoft Edge：Edge 加载项中的 ModelAny',
          '若图标未出现，可在扩展管理页确认已启用',
        ]),
        section('sign-in', '2. 登录你常用的 AI 网站', [
          '在普通标签页打开各官网并照常登录（免费或付费均可）。ModelAny 不替代这些登录，也不要求 API Key。',
        ], [
          '国内常用：DeepSeek、Kimi、豆包、通义千问、智谱 GLM、腾讯元宝、文小言',
          '国际常用：ChatGPT、Claude、Gemini、Grok',
        ]),
        section('ask', '3. 一次提问，并排对比', [
          '点击扩展图标，或按 Ctrl+Shift+Y（Mac 为 ⌘+Shift+Y）。输入一个问题，勾选模型后发送。扩展会打开各官网、填入提示词，并可代为提交。',
          '在对比页并排阅读回答，可导出 Markdown 报告，或把整段对话存入本地记忆库。',
        ]),
        section('recipes', '4. 常用后续操作', [], [
          '导出：在支持的 AI 页面点右侧 ModelAny 小标签 → Markdown / Word / PDF',
          '视频：打开 B 站或 YouTube → 弹出窗「附上字幕」→ 发送总结类问题',
          '换模型继续：在 AI 对话页 →「换个模型继续」→ 选择另一个模型',
          '提示词：模板保存一次后，可从弹出窗或 AI 页面内插入',
        ]),
        section('limits', '使用时请注意', [
          '各 AI 网站仍按各自规则限制次数、地区与套餐额度。若某网站改版导致填入失败，可用扩展内诊断，或手动指定输入框位置。',
        ]),
      ],
      related: [
        link('/zh/export-ai-chat/', '导出对话为 PDF / Word / Markdown'),
        link('/zh/video-summary/', '附上 B 站 / YouTube 字幕'),
        link('/zh/continue-in-another-ai/', '换个 AI 继续聊'),
        link('/zh/ai-memory/', '本地 AI 记忆库'),
        link('/zh/compare-ai-models/', '同一提示词对比大模型'),
        link('/zh/ai-browser-extension/', 'AI 浏览器插件说明'),
      ],
      faqs: [
        {
          q: '需要 API Key 吗？',
          a: '不需要。ModelAny 使用你已登录的 AI 网页版。免费账号可用；付费套餐仍按官网原有额度计算。',
        },
        {
          q: '数据存在哪里？',
          a: '草稿、设置、发送记录与记忆库保存在本机扩展存储中。提示词只发送到你选择的 AI 官网，不会经过 ModelAny 后端。',
        },
        {
          q: '支持哪些浏览器？',
          a: '官方支持 Google Chrome 与 Microsoft Edge。其他基于 Chromium、且能安装上述商店扩展的浏览器或可使用，但不作为主要测试目标。',
        },
      ],
      ctaHeading: '安装 ModelAny',
      ctaBody: '可在 Chrome 网上应用店与 Microsoft Edge 加载项免费获取。无需 ModelAny 账号，不卖积分。',
    },
  },

  'export-chatgpt-conversation': {
    en: {
      eyebrow: 'Export guide',
      leadHeading: 'Turn an on-page AI chat into a local document',
      lead: [
        'On supported AI websites, ModelAny shows a slim tab on the page edge. Open it to export the current conversation as Markdown, Word (.docx) or PDF, or copy Markdown to the clipboard. Files are built in your browser and saved locally—ModelAny does not upload the chat to its own servers.',
        'Works across ChatGPT, Claude, Gemini, DeepSeek, Grok, Kimi, Qwen, Doubao, GLM, Tencent Yuanbao and Wenxiaoyan, using the same toolbar pattern on each site.',
      ],
      sections: [
        section('steps', 'How to export', [], [
          'Open a conversation on a supported AI website',
          'Click the ModelAny tab on the right edge of the page',
          'Choose Markdown, Word or PDF—or Copy as Markdown',
          'Save the download your browser offers, or paste from the clipboard',
        ], true),
        section('to-markdown', 'Export a ChatGPT conversation to Markdown', [
          'Markdown is the right choice when the chat is going into Notion, Obsidian, a Git repo, or any tool that ingests plain text: headings, lists and code blocks survive the trip, and diffs stay readable. Use Copy as Markdown when you are pasting straight into an editor.',
        ]),
        section('to-pdf', 'Export a ChatGPT conversation to PDF', [
          'PDF fixes the layout: use it for print, email attachments, or a record you do not want to edit again. The file is generated in your browser from the turns currently rendered on the page.',
        ]),
        section('to-word', 'Export a ChatGPT conversation to Word', [
          'Word (.docx) is for documents someone will edit next—shared drafts, reports with tracked changes. Start from the export, then apply your own template and styles.',
        ]),
        section('privacy', 'Privacy notes', [
          'Export reads the conversation already rendered on that page, and only after you click. Generation runs locally. Clearing browser data for the extension, or removing the extension, also removes its local storage.',
        ]),
        section('tips', 'Practical tips', [], [
          'Export before you leave a long thread you may need later',
          'Pair with Save to memory if you want search later without keeping the tab open',
          'If the toolbar is missing, refresh the tab and confirm ModelAny is allowed on that site',
        ]),
      ],
      related: [
        link('/how-to-use/', 'How to use ModelAny'),
        link('/ai-chat-memory/', 'Local AI chat memory'),
        link('/continue-chat-in-another-ai/', 'Continue in another AI'),
        link('/compare-ai-models/', 'Compare models with one prompt'),
      ],
      faqs: [
        {
          q: 'Can I export ChatGPT Plus or Team chats?',
          a: 'Yes, if the conversation is open in the ChatGPT web app in your browser. ModelAny exports what is on the page; it does not call OpenAI’s export API.',
        },
        {
          q: 'Does export include images or file uploads?',
          a: 'Text turns are the primary export. Rich attachments may be omitted or represented as placeholders, depending on what the page exposes in the DOM.',
        },
        {
          q: 'Is the PDF generated on a server?',
          a: 'No. PDF, Word and Markdown are produced in the browser and downloaded as local files.',
        },
      ],
      ctaHeading: 'Export chats without leaving the AI site',
      ctaBody: 'Install ModelAny, open any supported chat, and use the edge toolbar. Free; no API key.',
    },
    zh: {
      eyebrow: '导出说明',
      leadHeading: '把当前 AI 对话保存为本地文档',
      lead: [
        '在支持的 AI 网站上，页面右侧会出现 ModelAny 小标签。点开后可将当前对话导出为 Markdown、Word（.docx）或 PDF，也可复制为 Markdown。文件在浏览器本地生成并下载，不会上传到 ModelAny 自有服务器。',
        'ChatGPT、DeepSeek、Kimi、豆包、通义千问、智谱 GLM、腾讯元宝、文小言，以及 Claude、Gemini、Grok 等站点使用同一套工具条。',
      ],
      sections: [
        section('steps', '导出步骤', [], [
          '在支持的 AI 网站打开一段对话',
          '点击页面右侧的 ModelAny 小标签',
          '选择 Markdown、Word、PDF，或「复制为 Markdown」',
          '按浏览器提示保存文件，或粘贴剪贴板内容',
        ], true),
        section('formats', '格式怎么选', [
          'Markdown 适合笔记、仓库与纯文本工具；Word 适合协作修改；PDF 适合固定版式与打印；复制为 Markdown 则便于贴进 Notion、Obsidian 或编辑器。',
        ]),
        section('privacy', '隐私说明', [
          '仅在你点击导出后，读取当前页面上已渲染的对话，并在本地生成文件。清除该扩展的浏览器数据或卸载扩展，会一并清除其本地存储。',
        ]),
        section('tips', '实用建议', [], [
          '长对话离开前先导出，避免之后难以找回',
          '若还要全文检索，可同时「存入记忆库」',
          '若看不到小标签，刷新页面并确认扩展已对该站点启用',
        ]),
      ],
      related: [
        link('/zh/how-to-use/', 'ModelAny 使用教程'),
        link('/zh/ai-memory/', '本地 AI 记忆库'),
        link('/zh/continue-in-another-ai/', '换个 AI 继续聊'),
        link('/zh/compare-ai-models/', '同一提示词对比大模型'),
      ],
      faqs: [
        {
          q: '能导出 ChatGPT 付费版对话吗？',
          a: '可以，只要对话在浏览器里的 ChatGPT 网页中打开。ModelAny 导出的是页面上可见的内容，并不调用 OpenAI 官方导出接口。',
        },
        {
          q: '图片或上传的文件会一并导出吗？',
          a: '以文本轮次为主。图片与附件是否出现，取决于页面 DOM 能否提供对应内容，部分情况会省略或仅保留占位说明。',
        },
        {
          q: 'PDF 是在服务器上生成的吗？',
          a: '不是。PDF、Word 与 Markdown 均在浏览器本地生成并下载。',
        },
      ],
      ctaHeading: '在 AI 页面直接导出对话',
      ctaBody: '安装 ModelAny 后，打开任意支持的对话页即可使用右侧工具条。免费，无需 API Key。',
    },
  },

  'youtube-video-summarizer': {
    en: {
      eyebrow: 'Video & page guide',
      leadHeading: 'Attach a transcript, then ask the AI you already use',
      lead: [
        'On a YouTube or Bilibili watch page, open ModelAny and choose Attach transcript. Captions are requested from that video site in your current session—not scraped through a ModelAny proxy. Segments keep timestamps (about 30 seconds each) so answers can cite moments in the video.',
        'The same popup can Attach text on ordinary articles (navigation and ads stripped) or attach a local PDF / TXT / Markdown / HTML file parsed in the browser. After attaching, send a ready-made prompt—Key points, Chapters, Quotes, action items, find flaws, translate—or write your own.',
      ],
      sections: [
        section('video-steps', 'Summarize a video', [], [
          'Open the video on YouTube or Bilibili and wait until the player is ready',
          'Open ModelAny → Attach transcript (Chinese or English captions when available)',
          'Pick a one-tap prompt such as Key points or Chapters, or type your own question',
          'Choose one or more AI sites and send; review answers with timestamp references',
        ], true),
        section('other', 'Articles and local files', [
          'Attach text works on typical article pages. Local PDFs and text files are parsed on your device; the file is not uploaded to ModelAny. Length limits still apply on each AI website—trim or ask for a section-by-section summary when the source is very long.',
        ]),
        section('limits', 'Accuracy and limits', [
          'Quality depends on the captions or article text the site provides. Auto-generated captions can mishear names and jargon. ModelAny does not invent a transcript when the video has none.',
        ]),
      ],
      related: [
        link('/how-to-use/', 'How to use ModelAny'),
        link('/export-chatgpt-conversation/', 'Export AI chats'),
        link('/ai-chat-memory/', 'Save summaries to local memory'),
        link('/compare-ai-models/', 'Compare models on the same brief'),
      ],
      faqs: [
        {
          q: 'Does this work without a YouTube premium plan?',
          a: 'Yes. It uses captions the watch page already exposes to your browser session. Availability depends on the video having captions, not on a ModelAny subscription.',
        },
        {
          q: 'Are captions sent to ModelAny servers?',
          a: 'No. Captions are read in-page from YouTube or Bilibili. They leave your machine only when you send a prompt to an AI site you select.',
        },
        {
          q: 'Can I summarize Bilibili videos?',
          a: 'Yes. Bilibili is supported the same way as YouTube: Attach transcript on the watch page, then ask your chosen models.',
        },
      ],
      ctaHeading: 'Summarize videos with your own AI accounts',
      ctaBody: 'Install ModelAny, attach a transcript on YouTube or Bilibili, and send. No API key, no ModelAny credits.',
    },
    zh: {
      eyebrow: '视频与网页',
      leadHeading: '先附上字幕或正文，再用你已有的 AI 提问',
      lead: [
        '在 YouTube 或哔哩哔哩播放页打开 ModelAny，选择「附上字幕」。字幕由当前视频网站、在你已有登录状态的页面内提供，不经 ModelAny 代理抓取。内容按约 30 秒分段并保留时间点，便于回答引用具体位置。',
        '同一弹出窗也可在普通文章页「附上正文」（去掉导航与广告），或附上本机 PDF / TXT / Markdown / HTML（浏览器内解析）。附上后可一键发送：总结要点、章节时间线、金句、行动项、找漏洞、翻译，也可自写问题。',
      ],
      sections: [
        section('video-steps', '总结视频', [], [
          '在 B 站或 YouTube 打开视频，等待播放器就绪',
          '打开 ModelAny →「附上字幕」（有中英字幕时会按可用项选择）',
          '选择「总结要点」「章节时间线」等预设，或输入自己的问题',
          '勾选一个或多个 AI 网站发送，对照带时间点的回答',
        ], true),
        section('other', '文章与本地文件', [
          '「附上正文」适用于常见文章页。本地 PDF 与文本在设备上解析，不会上传到 ModelAny。各 AI 网站仍有长度限制；材料很长时，可分段提问或要求按章节总结。',
        ]),
        section('limits', '效果与边界', [
          '质量取决于网站提供的字幕或正文。自动字幕可能听错专有名词。若视频没有字幕，ModelAny 不会凭空生成一份。',
        ]),
      ],
      related: [
        link('/zh/how-to-use/', 'ModelAny 使用教程'),
        link('/zh/export-ai-chat/', '导出 AI 对话'),
        link('/zh/ai-memory/', '把总结存进本地记忆库'),
        link('/zh/compare-ai-models/', '同一任务对比多个模型'),
      ],
      faqs: [
        {
          q: '没有会员也能用吗？',
          a: '可以。扩展读取的是播放页已向当前浏览器会话提供的字幕。能否附上取决于该视频是否有字幕，而不是 ModelAny 是否收费。',
        },
        {
          q: '字幕会传到 ModelAny 服务器吗？',
          a: '不会。字幕在 YouTube / B 站页面内读取；只有当你向所选 AI 官网发送提示词时，相关内容才会发往该官网。',
        },
        {
          q: '支持哔哩哔哩吗？',
          a: '支持。与 YouTube 相同：在播放页「附上字幕」，再发给你选择的模型。',
        },
      ],
      ctaHeading: '用自己的 AI 账号总结视频',
      ctaBody: '安装 ModelAny，在 B 站或 YouTube 附上字幕后发送即可。无需 API Key，不卖积分。',
    },
  },

  'continue-chat-in-another-ai': {
    en: {
      eyebrow: 'Continue elsewhere',
      leadHeading: 'Move context to another model without retyping',
      lead: [
        'When you hit a message cap, want a second opinion, or need a model that is stronger on a sub-task, use Continue in another AI on the current chat page. ModelAny packs recent turns from that conversation and opens another supported site with the context ready to continue.',
        'Long threads keep the most recent turns so the package still fits typical web-app limits. You stay on official sites with your own accounts—ModelAny is only the bridge.',
      ],
      sections: [
        section('steps', 'How to continue elsewhere', [], [
          'Stay on the AI chat page that already has the discussion',
          'Open the ModelAny edge tab or popup → Continue in another AI',
          'Pick the target model (for example Claude, Gemini, DeepSeek or Kimi)',
          'Review the prepared context in the new tab, then keep chatting there',
        ], true),
        section('chatgpt-to-claude', 'Moving a ChatGPT conversation into Claude', [
          'The most common route: a long ChatGPT thread hits its message cap mid-task. Open Continue in another AI on that chat page and pick Claude. ModelAny packs the recent turns of the ChatGPT conversation into a context block and opens claude.ai with it filled in, so your first Claude message is “continue from here”, not a re-explanation.',
          'Skim the prepared block once before sending: long threads keep the most recent turns, so earlier constraints worth restating (goals, format, deadlines) are better pinned at the top of your next message.',
        ]),
        section('when', 'When it helps', [], [
          'Daily or hourly caps on one provider',
          'Cross-checking a plan, code review or translation with a second model',
          'Moving a Chinese-heavy thread to Kimi / DeepSeek, or an English coding thread to Claude',
        ]),
        section('limits', 'What does not transfer', [
          'Provider-specific artifacts (custom GPTs, Projects files, voice mode state) are not migrated. Only conversation text ModelAny can read from the page is carried. Always skim the prepared context before you send the next message.',
        ]),
      ],
      related: [
        link('/how-to-use/', 'How to use ModelAny'),
        link('/export-chatgpt-conversation/', 'Export the original chat first'),
        link('/ai-chat-memory/', 'Save threads to local memory'),
        link('/compare-ai-models/', 'Compare fresh answers with one prompt'),
      ],
      faqs: [
        {
          q: 'Will the other AI see my full ChatGPT history?',
          a: 'No. Only the context package prepared from the current page (with recent-turn trimming on long chats) is sent to the site you open next.',
        },
        {
          q: 'Do I need to be signed in on the destination site?',
          a: 'Yes. Sign in to the target AI website beforehand, the same as when asking multiple models from the popup.',
        },
        {
          q: 'Can I go from Claude back to ChatGPT?',
          a: 'Yes. Continue in another AI works across supported sites in either direction, subject to each site’s login and limits.',
        },
      ],
      ctaHeading: 'Switch models without restarting the brief',
      ctaBody: 'Install ModelAny and use Continue in another AI on any supported AI chat page.',
    },
    zh: {
      eyebrow: '换模型继续',
      leadHeading: '带着上下文换到另一个 AI，无需重讲',
      lead: [
        '遇到次数上限、想听第二个模型的意见，或某一子任务更适合别的模型时，在当前 AI 页面使用「换个模型继续」。ModelAny 会整理该页近期对话，并打开另一个支持的官网，便于接着聊。',
        '对话过长时会优先保留最近若干轮，以适应常见网页版长度限制。你始终在各官方网站、用自己的账号操作；ModelAny 只做桥接。',
      ],
      sections: [
        section('steps', '操作步骤', [], [
          '停留在已有讨论的 AI 对话页',
          '打开右侧 ModelAny 小标签或弹出窗 →「换个模型继续」',
          '选择目标模型（如 DeepSeek、Kimi、Claude、Gemini）',
          '在新标签页检查整理好的上下文，然后继续提问',
        ], true),
        section('when', '适合这些情况', [], [
          '某一平台达到日/时限额',
          '方案、代码审查或翻译需要第二个模型交叉核对',
          '中文长文更想交给 Kimi / DeepSeek，英文编程更想交给 Claude 等',
        ]),
        section('limits', '不会迁移的内容', [
          '各平台专有能力（如自定义 GPT、项目文件、语音状态）不会一并迁移。仅携带 ModelAny 能从当前页面读取的对话文本。发送下一条消息前，请先快速核对整理结果。',
        ]),
      ],
      related: [
        link('/zh/how-to-use/', 'ModelAny 使用教程'),
        link('/zh/export-ai-chat/', '先导出原对话'),
        link('/zh/ai-memory/', '存入本地记忆库'),
        link('/zh/compare-ai-models/', '用同一提示词重新对比'),
      ],
      faqs: [
        {
          q: '另一个 AI 会看到我的全部 ChatGPT 历史吗？',
          a: '不会。只会带上从当前页面整理出的上下文（长对话会裁剪为最近若干轮），并发往你接下来打开的那个官网。',
        },
        {
          q: '目标网站需要先登录吗？',
          a: '需要。请事先登录目标 AI 官网，与从弹出窗同时问多个模型时的要求相同。',
        },
        {
          q: '可以从 Claude 再转回 ChatGPT 吗？',
          a: '可以。在支持的站点之间可双向继续，仍受各网站登录状态与额度限制。',
        },
      ],
      ctaHeading: '换模型，不换话题',
      ctaBody: '安装 ModelAny，在支持的 AI 对话页使用「换个模型继续」。',
    },
  },

  'ai-chat-memory': {
    en: {
      eyebrow: 'Save & back up chats',
      leadHeading: 'Save ChatGPT chats to a library that never leaves your browser',
      lead: [
        'A ChatGPT conversation only exists on chatgpt.com until you save it somewhere. ModelAny gives you two local copies: save the chat into a searchable memory library in your browser (full-text search, tags, notes), or export it as a Markdown, Word or PDF file for a folder backup. Nothing is uploaded to a ModelAny server.',
        'The same save-and-back-up loop works on Claude, Gemini, DeepSeek, Grok, Kimi, Qwen, Doubao, GLM and other supported sites, so conversations scattered across several AI apps end up in one place.',
      ],
      sections: [
        section('save', 'Save a chat', [], [
          'Open the conversation on a supported AI site',
          'Use the ModelAny edge tab → Save to memory (or save from the comparison view after a multi-AI send)',
          'Optional: add tags or a short note so you can filter later',
        ], true),
        section('backup', 'Back up as a file', [
          'For a backup you control outside the browser, export the conversation to Markdown (best for Notion, Obsidian, Git repos), Word (shared docs) or PDF (fixed layout). Files are generated in your browser and saved wherever you keep local archives.',
        ]),
        section('reuse', 'Search and reuse', [
          'Open the Memory page from the popup. Search by keyword, filter by tag, open an entry, then bring it into the model you are about to use as context. You can delete individual entries or clear the library from that page; uninstalling the extension removes the data with it.',
        ]),
        section('privacy', 'Local by design', [
          'Memory is not synced to a ModelAny cloud. Device backups or sync products you configure yourself (for example browser profile sync) are outside ModelAny’s control—turn those off for the extension if you need a strict local-only setup.',
        ]),
      ],
      related: [
        link('/export-chatgpt-conversation/', 'Export a chat as PDF, Word or Markdown'),
        link('/continue-chat-in-another-ai/', 'Continue in another AI'),
        link('/how-to-use/', 'How to use ModelAny'),
        link('/privacy.html', 'Privacy policy'),
      ],
      faqs: [
        {
          q: 'How do I save a ChatGPT conversation?',
          a: 'Open the conversation on chatgpt.com, click the ModelAny tab on the right edge, and choose Save to memory (searchable library) or Markdown / Word / PDF (a file backup). Both copies stay on your machine.',
        },
        {
          q: 'Can I back up my whole chat history?',
          a: 'ModelAny saves the conversations you deliberately save, one chat at a time—unlike OpenAI’s account-level data export. Save important threads when you finish them; the library stays searchable on your device.',
        },
        {
          q: 'Is memory uploaded for “AI sync”?',
          a: 'No. ModelAny does not operate a sync server for memory. Data stays in local extension storage unless you export it yourself.',
        },
        {
          q: 'Does search work for Chinese?',
          a: 'Yes. Full-text search is intended for both Chinese and English content in saved entries.',
        },
      ],
      ctaHeading: 'Keep useful AI chats on your machine',
      ctaBody: 'Install ModelAny and save from the on-page toolbar or comparison view. Free and local-first.',
    },
    zh: {
      eyebrow: '本地记忆库',
      leadHeading: '可搜索的对话库，默认不离开你的浏览器',
      lead: [
        '把各支持站点上的对话存进 ModelAny 记忆库。条目保存在本机扩展存储中，支持中英文全文检索，可加标签与备注，并在之后把某条记忆作为上下文带入任意支持的模型。',
        '适合回答散落在 ChatGPT、DeepSeek、Kimi、豆包等各处、又希望先在本地集中查找、而不是默认粘贴到云端文档的场景。',
      ],
      sections: [
        section('save', '保存对话', [], [
          '在支持的 AI 网站打开对话',
          '通过右侧 ModelAny 小标签「存入记忆库」（多模型发送后也可在对比页保存）',
          '可选：添加标签或简短备注，便于日后筛选',
        ], true),
        section('reuse', '检索与再次使用', [
          '从弹出窗打开记忆库页面，按关键词搜索或按标签筛选，打开条目后可带入即将使用的模型。可在该页删除单条或清空全部；卸载扩展会一并删除这些数据。',
        ]),
        section('privacy', '本地优先', [
          '记忆库不会同步到 ModelAny 云端。若你自行启用了浏览器配置同步等能力，其行为由浏览器决定——若要求严格仅本机，请勿对扩展开启此类同步。',
        ]),
      ],
      related: [
        link('/zh/how-to-use/', 'ModelAny 使用教程'),
        link('/zh/export-ai-chat/', '导出为本地文件'),
        link('/zh/continue-in-another-ai/', '换个 AI 继续聊'),
        link('/zh/privacy.html', '隐私政策'),
      ],
      faqs: [
        {
          q: '记忆库会上传做「云同步」吗？',
          a: '不会。ModelAny 不为记忆库提供同步服务器。数据留在本地扩展存储中，除非你自行导出。',
        },
        {
          q: '可以备份吗？',
          a: '可使用产品内提供的导出/备份能力（如 Markdown 或 JSON 等形式，以扩展内实际选项为准），重要对话也可先导出为文件再清理数据。',
        },
        {
          q: '中文能搜到吗？',
          a: '可以。全文检索面向已保存条目中的中英文内容。',
        },
      ],
      ctaHeading: '把有用的 AI 对话留在本机',
      ctaBody: '安装 ModelAny，从页面工具条或对比页保存即可。免费，本地优先。',
    },
  },

  'compare-ai-models': {
    en: {
      eyebrow: 'Comparison workflow',
      leadHeading: 'Same task, same prompt, several official sites',
      lead: [
        'Model rankings from public arenas are useful context, not a verdict for your document, codebase or customer email. A fair check fixes the task and success criteria first, then sends one prompt to multiple web apps you already use.',
        'ModelAny opens ChatGPT, Claude, Gemini, DeepSeek and other supported sites in parallel, fills the same text, and collects answers for side-by-side review. You can export a Markdown report or save the run to local memory.',
      ],
      sections: [
        section('workflow', 'Suggested workflow', [], [
          'Write the real task, inputs and what “good” means (accuracy, tone, length, constraints)',
          'In ModelAny, select two to four models that fit the job—not every model every time',
          'Send one prompt; avoid editing it per tab if you want a clean comparison',
          'Score answers against your criteria; note edits you still need and each site’s usage limits',
        ], true),
        section('fair', 'Keep the comparison fair', [
          'Do not treat answers from different prompts as comparable. Prefer models you can actually continue using (login, language, price). Public benchmark tables on this site show shared categories only—they do not crown an overall winner.',
        ]),
      ],
      related: [
        link('/side-by-side-ai-comparison/', 'Side-by-side comparison pattern'),
        link('/ai-browser-extension/', 'Browser extension overview'),
        link('/how-to-use/', 'Install and first send'),
        link('/compare/', 'Public model comparisons'),
        link('/benchmarks/', 'Benchmark snapshots'),
      ],
      faqs: [
        {
          q: 'Is this an API router?',
          a: 'No. ModelAny drives the official websites in your browser. Billing and rate limits stay with each provider.',
        },
        {
          q: 'How many models can I send to?',
          a: 'Up to the models listed in the launcher (currently eleven sites). For serious evaluation, fewer models with a clear rubric usually beats selecting all of them.',
        },
      ],
      ctaHeading: 'Run a same-prompt comparison',
      ctaBody: 'Install ModelAny for Chrome or Edge, sign in to the sites you use, and send one prompt to several models.',
      includeEvidence: true,
    },
    zh: {
      eyebrow: '对比方法',
      leadHeading: '同一任务、同一提示词，打开多个官网',
      lead: [
        '公开竞技场榜单可以作参考，但不能直接当作业、代码或客户邮件的结论。较稳妥的做法是先固定任务与成功标准，再把同一提示词发给多个你已在用的网页版模型。',
        'ModelAny 会并行打开 ChatGPT、DeepSeek、Kimi、豆包等支持的站点，填入同一段文字，并收集回答供并排查看。可导出 Markdown 报告，或将本轮结果存入本地记忆库。',
      ],
      sections: [
        section('workflow', '建议步骤', [], [
          '写清真实任务、输入材料，以及何为合格（事实、语气、篇幅、约束）',
          '在 ModelAny 中只勾选 2–4 个与任务匹配的模型，不必每次全选',
          '发送同一提示词；若要公平对比，避免在各标签页里改成不同版本',
          '按标准打分，记录仍需修改之处，并留意各站点的用量限制',
        ], true),
        section('fair', '如何比得公平', [
          '不同提示词下的回答不宜直接横向比较。优先选择你之后还能继续用的模型（登录、语言、费用）。本站公开评测表只展示模型共同出现的类别，并不产生「全面第一」的结论。',
        ]),
      ],
      related: [
        link('/zh/ai-browser-extension/', 'AI 浏览器插件说明'),
        link('/zh/how-to-use/', '安装与第一次发送'),
        link('/zh/benchmarks/', '公开评测数据'),
        link('/zh/compare/kimi-vs-chatgpt/', 'Kimi vs ChatGPT 评测摘录'),
      ],
      faqs: [
        {
          q: '这是 API 聚合路由吗？',
          a: '不是。ModelAny 在你的浏览器里操作各官方网站。计费与次数限制仍由各服务商决定。',
        },
        {
          q: '一次最多发给几个模型？',
          a: '不超过启动列表中的站点数量（目前为 11 个）。认真评估时，用清晰标准少选几个模型，通常比全选更有用。',
        },
      ],
      ctaHeading: '做一次同题对比',
      ctaBody: '在 Chrome 或 Edge 安装 ModelAny，登录常用官网，把同一提示词发给多个模型。',
      includeEvidence: true,
    },
  },

  'ai-browser-extension': {
    en: {
      eyebrow: 'Extension overview',
      leadHeading: 'A Chrome and Edge add-on for the AI sites you already use',
      lead: [
        'ModelAny installs from the Chrome Web Store or Microsoft Edge Add-ons. It is not a new chatbot. It sits on top of ChatGPT, Claude, Gemini, DeepSeek and other supported web apps so you can send one prompt to several of them, export chats, attach video transcripts, continue elsewhere and keep a local memory library.',
        'There is no ModelAny account, credit pack or API key. You use whatever free or paid plan you already have on each site. Drafts and history remain in the browser; prompts go only to the sites you select.',
      ],
      sections: [
        section('install', 'Install', [], [
          'Open the Chrome Web Store or Edge Add-ons page for ModelAny',
          'Add the extension, then pin it to the toolbar',
          'Sign in to the AI websites you rely on',
          'Press Ctrl+Shift+Y (⌘+Shift+Y on Mac) for the first send',
        ], true),
        section('fit', 'When an extension helps', [
          'Choose an extension when your work already happens in the browser and you refuse to re-paste the same brief across tabs. If you need server-side orchestration or a single vendor API bill, use that vendor’s API instead—ModelAny intentionally stays on the web UI path.',
        ]),
      ],
      related: [
        link('/how-to-use/', 'Step-by-step setup'),
        link('/compare-ai-models/', 'Same-prompt comparison'),
        link('/export-chatgpt-conversation/', 'Export ChatGPT and other chats'),
        link('/privacy.html', 'Privacy policy'),
      ],
      faqs: [
        {
          q: 'Is ModelAny free?',
          a: 'The extension is free. AI websites may still require their own paid plans for higher limits or models.',
        },
        {
          q: 'Does it work on Edge?',
          a: 'Yes. Install from Microsoft Edge Add-ons. Behavior matches the Chrome build for supported sites.',
        },
      ],
      ctaHeading: 'Add ModelAny to your browser',
      ctaBody: 'Available on the Chrome Web Store and Microsoft Edge Add-ons. Local-first; no ModelAny server in the prompt path.',
      includeEvidence: true,
    },
    zh: {
      eyebrow: '扩展说明',
      leadHeading: '装在 Chrome / Edge 上，服务你已在用的 AI 官网',
      lead: [
        'ModelAny 通过 Chrome 网上应用店或 Microsoft Edge 加载项安装。它不是又一个聊天机器人，而是叠加在 ChatGPT、DeepSeek、Kimi、豆包等网页版之上：同一提示词发给多个站点、导出对话、附上视频字幕、换模型继续，以及本地记忆库。',
        '没有 ModelAny 账号、积分包或 API Key。各站点免费或付费套餐仍按原样使用。草稿与历史留在浏览器；提示词只发往你勾选的官网。',
      ],
      sections: [
        section('install', '安装', [], [
          '打开 Chrome 网上应用店或 Edge 加载项中的 ModelAny 页面',
          '添加扩展，并固定到工具栏',
          '登录你常用的 AI 网站',
          '按 Ctrl+Shift+Y（Mac 为 ⌘+Shift+Y）完成第一次发送',
        ], true),
        section('fit', '什么时候适合用扩展', [
          '若工作已在浏览器里完成、又不想在多个标签页重复粘贴同一段需求，扩展很合适。若你需要服务端编排或统一的厂商 API 账单，应直接使用该厂商 API——ModelAny 有意停留在网页操作路径。',
        ]),
      ],
      related: [
        link('/zh/how-to-use/', '分步安装与使用'),
        link('/zh/compare-ai-models/', '同一提示词对比'),
        link('/zh/export-ai-chat/', '导出对话'),
        link('/zh/privacy.html', '隐私政策'),
      ],
      faqs: [
        {
          q: 'ModelAny 收费吗？',
          a: '扩展本身免费。各 AI 网站若提供付费套餐，额度与模型仍由该网站计费。',
        },
        {
          q: 'Edge 能用吗？',
          a: '能。从 Microsoft Edge 加载项安装即可，支持站点上的行为与 Chrome 版一致。',
        },
      ],
      ctaHeading: '把 ModelAny 加到浏览器',
      ctaBody: '可在 Chrome 网上应用店与 Microsoft Edge 加载项获取。本地优先；提示词路径上没有 ModelAny 服务器。',
      includeEvidence: true,
    },
  },

  'side-by-side-ai-comparison': {
    en: {
      eyebrow: 'Comparison pattern',
      leadHeading: 'Compare AI answers side by side against one brief',
      lead: [
        'Comparing AI answers side by side means one task definition, one frozen prompt, and several answers read together against the same criteria—not screenshots from unrelated chats. ModelAny’s comparison view is built for that loop: send once, collect every answer, skim agreements and gaps, then export or save.',
        'The comparison is only as good as the criteria you read with. Most real decisions come down to four questions: is it factually right, is it complete, how much editing does it need, and can you verify the claims it makes.',
      ],
      sections: [
        section('criteria', 'What to judge, in order', [], [
          'Facts first: can every claim, number and citation be checked against a source you trust?',
          'Completeness: does it cover the constraints you actually stated (length, tone, framework, region)?',
          'Edit cost: count the minutes from raw answer to usable result—that number decides the workflow',
          'Failure style: which answer fails safely (says “I don’t know”, flags risk) versus fails confidently?',
        ], true),
        section('practice', 'Practice checklist', [], [
          'Freeze the prompt before the first send—no per-tab edits if you want a clean read',
          'Limit the set to models you might actually adopt',
          'Score with a short rubric (facts, structure, risks, edit cost) instead of a gut verdict',
          'Record which answer you used and why, so the next run is faster',
        ], true),
        section('report', 'Turn the run into a record', [
          'After a send, export the comparison as a Markdown report or save it to local memory. A dated record of prompt, models and scores turns a one-off check into evidence you can re-run when a new model version ships.',
        ]),
      ],
      related: [
        link('/chatgpt-vs-claude-vs-gemini-same-prompt/', 'ChatGPT vs Claude vs Gemini on the same prompt'),
        link('/compare-ai-models/', 'Send one prompt to several models'),
        link('/how-to-use/', 'How to use ModelAny'),
        link('/compare/chatgpt-vs-gemini/', 'ChatGPT vs Gemini benchmarks'),
      ],
      faqs: [
        {
          q: 'Why not paste into each tab manually?',
          a: 'You can, but small edits creep in and timing differs. A single send reduces accidental prompt drift and puts every answer in one place.',
        },
        {
          q: 'How many answers should I compare at once?',
          a: 'Two to four. With more columns, attention per answer drops and the rubric stops being applied honestly.',
        },
      ],
      ctaHeading: 'Compare answers in one pass',
      ctaBody: 'Install ModelAny, send one prompt to several official AI sites, and review them side by side.',
      includeEvidence: true,
    },
    zh: {
      eyebrow: '对比方式',
      leadHeading: '对照同一份需求，并排比较多份回答',
      lead: [
        '并排对比指：先固定任务与提示词，再把多份回答放在一起、按同一套标准阅读——而不是把互不相关的截图拼在一起。ModelAny 的对比页服务这条路径：一次发送、汇总回答、查看一致与分歧，再导出或存档。',
        '对比的价值取决于你用什么标准去读。多数真实决策归结为四个问题：事实对不对、覆盖全不全、还要改多久、结论可不可验证。',
      ],
      sections: [
        section('criteria', '按什么顺序判断', [], [
          '先看事实：每条结论、数字与引用能否在你信任的来源里核对？',
          '再看覆盖：是否满足你真实提出的约束（篇幅、语气、框架、地区）？',
          '再看修改成本：从原始回答到可用结果要花多少分钟——这个数字决定工作流',
          '再看失败方式：哪份回答失败得“安全”（会承认不知道、会提示风险），哪份失败得很自信？',
        ], true),
        section('practice', '操作清单', [], [
          '第一次发送前锁定提示词，各标签页不做微调',
          '只选你之后真可能采用的模型',
          '用简短标准打分（事实、结构、风险、修改成本），不凭感觉',
          '记下采用了哪份回答及原因，方便下次更快决策',
        ], true),
        section('report', '把对比变成记录', [
          '发送结束后，把对比结果导出为 Markdown 报告，或存入本地记忆库。带日期的记录（提示词、模型、评分）让一次性检查变成可复验的证据——新版本发布时可以重跑一遍。',
        ]),
      ],
      related: [
        link('/zh/compare-ai-models/', '同一提示词工作流'),
        link('/zh/how-to-use/', 'ModelAny 使用教程'),
        link('/zh/benchmarks/', '公开评测汇总'),
      ],
      faqs: [
        {
          q: '为什么不手动往每个标签页粘贴？',
          a: '可以，但容易出现细微改写与时间差。一次发送能减少提示词被无意改掉的情况，并让所有回答集中在一处。',
        },
        {
          q: '一次对比几份回答合适？',
          a: '两到四份。列数越多，每份回答分到的注意力越少，评分标准就越难如实执行。',
        },
      ],
      ctaHeading: '一次看完多份回答',
      ctaBody: '安装 ModelAny，把同一提示词发给多个 AI 官网，并在对比页并排审阅。',
      includeEvidence: true,
    },
  },

  'chatgpt-vs-claude-vs-gemini-same-prompt': {
    en: {
      eyebrow: 'Three-way comparison',
      leadHeading: 'One prompt, three official sites, three answers',
      lead: [
        'Pairwise scores cannot tell you what matters for your task: whether ChatGPT, Claude or Gemini writes the answer you would actually ship. The honest test is the same prompt into all three official sites, then reading the three answers side by side against your own criteria.',
        'ModelAny sends that one prompt to chatgpt.com, claude.ai and gemini.google.com in parallel—your own accounts, no API key—and collects the three answers in one comparison view.',
      ],
      sections: [
        section('method', 'The five-minute method', [], [
          'Pick one real task from this week’s work—something you can judge, not a trivia question',
          'Write the prompt once with its constraints (length, format, audience) and freeze it',
          'Send it to ChatGPT, Claude and Gemini in one ModelAny send',
          'Score the three answers on the rubric below while they are fresh',
          'Note which answer you used and what you edited—that note is the real verdict',
        ], true),
        section('pack', 'A reusable prompt pack', [
          'One prompt per capability you are actually choosing between. Copy them, replace the bracketed part, and keep the wording identical across the three sites.',
        ], [
          'Reasoning: “Here is our situation: [describe]. List the three decisions we must make first, and for each, what evidence would change your recommendation.”',
          'Writing: “Rewrite this paragraph for a skeptical [audience]: [paste]. Keep it under 120 words and do not invent facts.”',
          'Coding: “This test fails: [paste test + error]. Name the most likely cause, then the smallest fix, then what you would check next.”',
          'Summarizing: “Summarize the attached transcript into at most 8 bullet points with timestamps, then flag any claim you could not verify.”',
          'Refactoring: “Refactor this function for readability only—no behavior change: [paste]. List every assumption you made.”',
        ]),
        section('rubric', 'Score the three answers on this rubric', [], [
          'Verifiability: are claims checkable, and does the model flag what it could not check?',
          'Constraint-keeping: did it respect length, format and audience without being reminded?',
          'Edit distance: minutes from raw answer to usable result',
          'Risk handling: does it surface trade-offs and failure modes, or only the happy path?',
        ], true),
        section('benchmarks', 'Where public benchmarks fit', [
          'Public benchmark tables (the shared ones are rendered below) are useful context for capability ranges—SWE-bench Verified for real-issue code fixing, Arena preference votes for chat quality. They do not test your prompt. Use them to sanity-check what you saw; use your run to decide.',
        ]),
      ],
      related: [
        link('/side-by-side-ai-comparison/', 'How to compare answers side by side'),
        link('/compare/chatgpt-vs-claude/', 'ChatGPT vs Claude benchmarks'),
        link('/compare/chatgpt-vs-gemini/', 'ChatGPT vs Gemini benchmarks'),
        link('/compare/claude-vs-gemini/', 'Claude vs Gemini benchmarks'),
        link('/compare-ai-models/', 'Same-prompt comparison workflow'),
      ],
      faqs: [
        {
          q: 'Why the same prompt instead of reading benchmark tables?',
          a: 'Benchmarks measure tasks you do not have, on versions chosen by the tester. A same-prompt run measures your task on today’s live versions—the thing you are actually deciding about.',
        },
        {
          q: 'Can I include DeepSeek, Grok or Chinese models in the same send?',
          a: 'Yes. The launcher supports up to eleven sites; three-way is just the common case. Chinese models such as DeepSeek, Kimi and GLM join the same comparison with the same prompt.',
        },
        {
          q: 'Do free accounts work for this?',
          a: 'Yes. Each site runs under the plan you already have there; free quotas apply. ModelAny itself is free and needs no API key.',
        },
      ],
      ctaHeading: 'Run the same prompt on all three',
      ctaBody: 'Install ModelAny for Chrome or Edge, sign in to ChatGPT, Claude and Gemini, and send one prompt to all three at once.',
      includeEvidence: true,
    },
    zh: {
      eyebrow: '三方对比',
      leadHeading: '同一个提示词，三个官网，三份回答',
      lead: [
        '两两对比的分数无法回答真正的问题：同一条任务，ChatGPT、Claude、Gemini 谁写的答案你真的愿意用。诚实的测法是把同一提示词发给三个官网，再按你自己的标准并排阅读三份回答。',
        'ModelAny 把这一条提示词并行发到 chatgpt.com、claude.ai 和 gemini.google.com——用你自己的账号，无需 API Key——并把三份回答收进同一个对比页。',
      ],
      sections: [
        section('method', '五分钟做法', [], [
          '从本周工作里挑一个真实任务——你能判断好坏的那种，不是冷知识问答',
          '把提示词连同约束（篇幅、格式、受众）写一遍并锁定',
          '在 ModelAny 里一次发送给 ChatGPT、Claude 和 Gemini',
          '趁新鲜按下面的评分表给三份回答打分',
          '记下你实际采用了哪份、改了什么——这条记录才是真正的结论',
        ], true),
        section('rubric', '评分表', [], [
          '可验证性：结论能否核对？模型是否标注了自己无法核实的内容？',
          '守约束：篇幅、格式、受众是否第一次就遵守？',
          '修改距离：从原始回答到可用结果需要多少分钟',
          '风险处理：是否主动给出取舍与失败情形，还是只报喜？',
        ], true),
        section('benchmarks', '公开评测的用法', [
          '下方渲染的公开评测（三方共有的类别）可以说明能力区间，但不能代替你的提示词。用它们校验你的观察，用你自己的运行做决定。',
        ]),
      ],
      related: [
        link('/side-by-side-ai-comparison/', '如何并排比较回答'),
        link('/compare/chatgpt-vs-claude/', 'ChatGPT vs Claude 公开评测'),
        link('/compare/chatgpt-vs-gemini/', 'ChatGPT vs Gemini 公开评测'),
        link('/compare/claude-vs-gemini/', 'Claude vs Gemini 公开评测'),
      ],
      faqs: [
        {
          q: '为什么要用同一提示词，而不只看榜单？',
          a: '榜单测的是别人的任务与所选版本；同题运行测的是你的任务在今天的线上版本上的表现——这才是你真正要决定的事。',
        },
        {
          q: '免费账号能用吗？',
          a: '可以。各站点按你已有的套餐运行，免费额度照常适用。ModelAny 本身免费且不需要 API Key。',
        },
      ],
      ctaHeading: '把同一条提示词发给三家',
      ctaBody: '在 Chrome 或 Edge 安装 ModelAny，登录 ChatGPT、Claude 与 Gemini，一次发送、并排对比。',
      includeEvidence: true,
    },
  },

  'chatgpt-usage-limit-workaround': {
    en: {
      eyebrow: 'Usage limits',
      leadHeading: 'ChatGPT says you hit the limit—what actually works',
      lead: [
        'When ChatGPT shows the usage-limit message, the cap applies to that account, on that plan, for that window. There is no safe trick that removes the cap itself; what you can do is choose how to spend the remaining quota and how to keep the task moving elsewhere until the reset.',
        'One of those options is built into ModelAny: carry the current conversation into Claude, Gemini, DeepSeek or another supported AI with its context, so you keep working instead of re-explaining the task from scratch.',
      ],
      sections: [
        section('options', 'Four legitimate ways to keep working', [], [
          'Wait for the reset: limits refresh on a rolling window. Note the time the message appeared; the same task usually runs again without burning anything extra',
          'Switch models inside ChatGPT: the fastest models generally have the most headroom—move the remaining subtasks (drafting, reformatting) to the lighter model and save the heavy model for the steps that need it',
          'Continue in another AI: on the chat page, use ModelAny → Continue in another AI to move the recent conversation into Claude, Gemini, DeepSeek or Kimi with context included, then keep going there',
          'Upgrade only if the pattern repeats: if you hit the cap several days in a row at the same hour, the honest fix is a higher plan on that provider—not a rotation of evasions',
        ], true),
        section('context', 'Moving the chat without losing it', [
          'Continue in another AI packs the conversation turns visible on the page into a context block and opens the destination site with it filled in. Long threads keep the most recent turns. Restate any early constraint that still matters (goal, format, deadline) at the top of your next message.',
        ]),
        section('avoid', 'What to avoid', [
          'Bulk account creation, VPN rotation to dodge regional rules, or automation that fakes human pace violate the provider’s terms and put your account at risk. None of them raise the cap anyway. ModelAny does not do these things: it opens sites, fills your prompt and clicks send only when you tell it to.',
        ]),
      ],
      related: [
        link('/continue-chat-in-another-ai/', 'Continue a ChatGPT chat in Claude'),
        link('/chatgpt-vs-claude-vs-gemini-same-prompt/', 'Same prompt, three answers'),
        link('/ai-chat-memory/', 'Save the thread before switching'),
        link('/alternatives/chatgpt/', 'ChatGPT alternatives'),
      ],
      faqs: [
        {
          q: 'When does the ChatGPT usage limit reset?',
          a: 'Message caps refresh on a rolling window that depends on your plan and model. OpenAI documents the current limits on its help pages—the message itself usually names when you can continue.',
        },
        {
          q: 'Will ModelAny bypass the limit?',
          a: 'No. ModelAny does not bypass usage limits, captchas or security checks on any site. It performs the same steps you would do by hand: open the page, paste the prompt, send.',
        },
        {
          q: 'Does the other AI see my whole ChatGPT history?',
          a: 'No. Only the context package prepared from the current page is sent to the site you move to, with recent-turn trimming on long chats.',
        },
      ],
      ctaHeading: 'Keep the task moving when the cap hits',
      ctaBody: 'Install ModelAny and use Continue in another AI on any supported chat page. Free, local-first, no API key.',
    },
    zh: {
      eyebrow: '用量限制',
      leadHeading: 'ChatGPT 提示达到用量上限时，真正有效的做法',
      lead: [
        '当 ChatGPT 显示用量上限提示，限制只作用于该账号、该套餐、该时间窗。没有什么“安全绕过”能直接解除上限；你能做的是把剩余额度花在刀刃上，并在重置前让任务在别处继续推进。',
        '其中一种方式内置于 ModelAny：把当前对话连同上下文带到 Claude、Gemini、DeepSeek 等其他支持的 AI 继续，不需要从头重新解释任务。',
      ],
      sections: [
        section('options', '四种正规做法', [], [
          '等重置：限额按滚动时间窗刷新。记下提示出现的时刻，到点后同一任务通常可以直接继续',
          '站内换模型：轻量模型的剩余额度一般更多——把改写、整理类子任务交给轻量模型，把重模型留给关键步骤',
          '换 AI 继续：在对话页用 ModelAny →「换个模型继续」，把近期对话带上下文移到 Claude、Gemini、DeepSeek 或 Kimi 接着聊',
          '反复触顶再升级：如果连续多天在同一时段触顶，诚实的解法是升级该平台套餐，而不是轮换各种规避手段',
        ], true),
        section('context', '带着上下文换模型', [
          '「换个模型继续」会把当前页面上可见的对话轮次整理成上下文块，并填入目标站点。长对话会优先保留最近若干轮；仍然重要的早期约束（目标、格式、截止时间）最好在下一条消息开头重申一遍。',
        ]),
        section('avoid', '不要做的事', [
          '批量注册小号、用 VPN 轮换规避地区规则、或模拟人类节奏的自动化，都违反服务商条款，账号风险自担，而且上限并不会因此提高。ModelAny 不做这些：它只打开页面、填入你的提示词，并在你确认后点击发送。',
        ]),
      ],
      related: [
        link('/zh/continue-in-another-ai/', '换个 AI 继续聊'),
        link('/zh/ai-memory/', '换之前先存档'),
        link('/export-chatgpt-conversation/', '导出对话为本地文件'),
      ],
      faqs: [
        {
          q: 'ChatGPT 用量上限什么时候重置？',
          a: '消息上限按滚动时间窗刷新，具体取决于套餐与模型。OpenAI 会在帮助页更新当前额度；提示信息本身通常也会说明何时可以继续。',
        },
        {
          q: 'ModelAny 能绕过限制吗？',
          a: '不能。ModelAny 不绕过任何站点的用量限制、验证码或安全检查。它做的只是你手动也会做的动作：打开页面、粘贴提示词、发送。',
        },
      ],
      ctaHeading: '触顶不让任务停摆',
      ctaBody: '安装 ModelAny，在支持的对话页使用「换个模型继续」。免费、本地优先、无需 API Key。',
    },
  },
};

export function resolveProductCopy(slug, lang = 'en') {
  const key = ALIAS[slug] || slug;
  const entry = COPY[key];
  if (!entry) return null;
  return entry[lang] || entry.en || null;
}

export function productCopyKey(slug) {
  return ALIAS[slug] || slug;
}
