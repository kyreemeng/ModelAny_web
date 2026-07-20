/**
 * Minimal factual registry for SEO pages.
 *
 * Do not add capability rankings, context windows, free-tier limits, or prices
 * unless they are tied to a specific official source and verification date.
 */
export const DATE = '2026-07-19';
export const SITE = 'https://modelany.app';
export const EXTENSION_VERSION = '1.0.1';
export const CHROME_STORE_URL = 'https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn?utm_source=item-share-cb';
/** Primary install CTA target. Non-Chrome browsers are handled in download.js. */
export const DOWNLOAD = CHROME_STORE_URL;
export const EDGE_STORE_STATUS = 'review';
export const GITHUB_REPO = 'https://github.com/kyreemeng/ModelAny';

const source = (url, label) => ({ url, label, verifiedAt: DATE });

export const models = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    vendor: 'OpenAI',
    productUrl: 'https://chatgpt.com/',
    inModelAny: true,
    sources: [source('https://openai.com/chatgpt/pricing/', 'OpenAI ChatGPT plans and pricing')],
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    vendor: 'Anthropic',
    productUrl: 'https://claude.ai/',
    inModelAny: false,
    sources: [source('https://www.anthropic.com/pricing', 'Anthropic plans and pricing')],
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    vendor: 'Google',
    productUrl: 'https://gemini.google.com/',
    inModelAny: true,
    sources: [source('https://gemini.google.com/advanced', 'Google Gemini plans')],
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    vendor: 'DeepSeek',
    productUrl: 'https://chat.deepseek.com/',
    inModelAny: true,
    sources: [source('https://api-docs.deepseek.com/quick_start/pricing', 'DeepSeek API models and pricing')],
  },
  copilot: {
    id: 'copilot',
    name: 'Microsoft Copilot',
    vendor: 'Microsoft',
    productUrl: 'https://copilot.microsoft.com/',
    inModelAny: false,
    sources: [source('https://www.microsoft.com/en-us/microsoft-copilot/for-individuals', 'Microsoft Copilot for individuals')],
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity',
    vendor: 'Perplexity',
    productUrl: 'https://www.perplexity.ai/',
    inModelAny: false,
    sources: [source('https://www.perplexity.ai/pro', 'Perplexity Pro')],
  },
  grok: {
    id: 'grok',
    name: 'Grok',
    vendor: 'xAI',
    productUrl: 'https://grok.com/',
    inModelAny: false,
    sources: [source('https://x.ai/grok', 'xAI Grok')],
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral',
    vendor: 'Mistral AI',
    productUrl: 'https://chat.mistral.ai/',
    inModelAny: false,
    sources: [source('https://mistral.ai/pricing', 'Mistral pricing')],
  },
  llama: {
    id: 'llama',
    name: 'Llama',
    vendor: 'Meta',
    productUrl: 'https://www.llama.com/',
    inModelAny: false,
    sources: [source('https://www.llama.com/', 'Meta Llama')],
  },
  wenxin: {
    id: 'wenxin',
    name: '文心一言',
    vendor: '百度',
    productUrl: 'https://wenxin.baidu.com/',
    inModelAny: true,
    sources: [source('https://wenxin.baidu.com/', '文心一言官网')],
  },
  qwen: {
    id: 'qwen',
    name: '通义千问',
    vendor: '阿里云',
    productUrl: 'https://qianwen.com/',
    inModelAny: true,
    sources: [source('https://qianwen.com/', '通义千问官网')],
  },
  doubao: {
    id: 'doubao',
    name: '豆包',
    vendor: '字节跳动',
    productUrl: 'https://www.doubao.com/chat/',
    inModelAny: true,
    sources: [source('https://www.doubao.com/', '豆包官网')],
  },
  kimi: {
    id: 'kimi',
    name: 'Kimi',
    vendor: '月之暗面',
    productUrl: 'https://www.kimi.com/',
    inModelAny: true,
    sources: [source('https://www.kimi.com/', 'Kimi 官网')],
  },
  glm: {
    id: 'glm',
    name: 'GLM / 智谱清言',
    vendor: '智谱 AI',
    productUrl: 'https://chatglm.cn/',
    inModelAny: true,
    sources: [source('https://chatglm.cn/', '智谱清言官网')],
  },
  cursor: {
    id: 'cursor',
    name: 'Cursor',
    vendor: 'Cursor',
    productUrl: 'https://cursor.com/',
    inModelAny: false,
    sources: [source('https://cursor.com/pricing', 'Cursor pricing')],
  },
  'claude-code': {
    id: 'claude-code',
    name: 'Claude Code',
    vendor: 'Anthropic',
    productUrl: 'https://www.anthropic.com/claude-code',
    inModelAny: false,
    sources: [source('https://www.anthropic.com/claude-code', 'Claude Code')],
  },
  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    vendor: 'Windsurf',
    productUrl: 'https://windsurf.com/',
    inModelAny: false,
    sources: [source('https://windsurf.com/pricing', 'Windsurf pricing')],
  },
};
