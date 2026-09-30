/**
 * Shared site chrome (header, footer, mobile CTA) for every page.
 *
 * Static pages carry the chrome between <!-- chrome:header:start/end --> and
 * <!-- chrome:footer:start/end --> markers; `node seo/sync-chrome.mjs` rewrites
 * those blocks. Generated pages call these functions directly.
 */
import { CHROME_STORE_URL, EDGE_STORE_URL, GITHUB_REPO } from './data/models.mjs';

export const CONTACT_EMAIL_PARTS = 'kyreemeng|gmail.com';

const ICONS = {
  moon: '<svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  sun: '<svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
  chrome: '<svg class="browser-icon browser-icon-chrome" viewBox="0 0 24 24" aria-hidden="true"><path fill="#EA4335" d="M12 2a10 10 0 0 1 8.66 5H12a5 5 0 0 0-4.33 2.5L3.34 5A10 10 0 0 1 12 2Z"/><path fill="#FBBC05" d="M20.66 7A10 10 0 0 1 13 21.9l4.33-7.5A5 5 0 0 0 20.66 7Z"/><path fill="#34A853" d="M13 21.9A10 10 0 0 1 3.34 5l4.33 7.5A10 10 0 0 0 13 21.9Z"/><circle cx="12" cy="12" r="4" fill="#4285F4"/><circle cx="12" cy="12" r="2.2" fill="#fff"/></svg>',
  edge: '<svg class="browser-icon browser-icon-edge" viewBox="0 0 24 24" aria-hidden="true"><path fill="#0C9EE8" d="M20.8 15.2c-.5 4.1-4 6.8-8.2 6.8-4.7 0-8.6-3.7-8.6-8.4 0-5.4 4.5-9.7 9.8-9.6 3.8.1 6.9 2.3 8.2 5.4-1.6-1.2-3.8-1.6-5.7-.8-2 .8-3.4 2.6-3.7 4.7 1.9-1.1 5.1-1.2 8.2 2.3Z"/><path fill="#16C6A4" d="M20.8 15.2c-3.1-3.5-6.3-3.4-8.2-2.3-.1.8.1 1.7.6 2.4 1 1.5 2.6 2.4 4.4 2.4 1.2 0 2.3-.4 3.2-1.1Z"/></svg>',
  github: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"/></svg>',
  globe: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
};

export { ICONS };

const COPY = {
  en: {
    homeHref: '/',
    homeLabel: 'ModelAny home',
    navLabel: 'Primary navigation',
    footerLabel: 'Footer navigation',
    menuLabel: 'Toggle menu',
    themeLabel: 'Toggle dark mode',
    switchHref: '/zh/',
    switchLabel: '中文',
    switchLang: 'zh',
    switchHreflang: 'zh-CN',
    ctaShort: 'Add to Chrome',
    ctaMobile: 'Add to Chrome — free',
    nav: [
      { id: 'features', label: 'Features', href: '#features' },
      { id: 'how-to-use', label: 'How to use', href: '/how-to-use/', page: true },
      { id: 'models', label: 'Supported AIs', href: '#models' },
      { id: 'compare', label: 'Compare', href: '/compare/', page: true },
      { id: 'privacy', label: 'Privacy', href: '#privacy' },
      { id: 'faq', label: 'FAQ', href: '#faq' },
    ],
    tagline: 'Ask ChatGPT, Claude, Gemini, DeepSeek and 7 more AIs at once—with your own accounts, for free. Your data stays in your browser.',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '/#features' },
          { label: 'How to use', href: '/how-to-use/' },
          { label: 'Supported AIs', href: '/#models' },
          { label: 'Privacy', href: '/#privacy' },
          { label: 'FAQ', href: '/#faq' },
        ],
      },
      {
        title: 'Features',
        links: [
          { label: 'AI chat comparison', href: '/ai-chat-comparison/' },
          { label: 'Ask multiple AIs at once', href: '/compare-ai-models/' },
          { label: 'Export AI chats to PDF & Word', href: '/export-chatgpt-conversation/' },
          { label: 'Export ChatGPT to PDF', href: '/export-chatgpt-conversation-to-pdf/' },
          { label: 'YouTube video summarizer', href: '/youtube-video-summarizer/' },
          { label: 'Continue in another AI', href: '/continue-chat-in-another-ai/' },
          { label: 'Local AI chat memory', href: '/ai-chat-memory/' },
          { label: 'ChatGPT Chrome extension', href: '/ai-browser-extension/' },
        ],
      },
      {
        title: 'Guides',
        links: [
          { label: 'AI model comparisons', href: '/compare/' },
          { label: 'Best AI by use case', href: '/best-for/' },
          { label: 'Save ChatGPT conversations', href: '/save-chatgpt-conversation/' },
          { label: 'AI alternatives', href: '/alternatives/' },
          { label: 'Free AI guides', href: '/free/' },
          { label: 'AI pricing guides', href: '/pricing/' },
          { label: 'Public benchmarks', href: '/benchmarks/' },
        ],
      },
    ],
    install: 'Install',
    chromeLabel: 'Chrome Web Store',
    edgeLabel: 'Microsoft Edge Add-ons',
    privacyLabel: 'Privacy policy',
    privacyHref: '/privacy.html',
    githubLabel: 'GitHub',
    contactLabel: 'Contact',
    copyright: '© 2026 ModelAny. Free browser extension for Chrome and Edge.',
    disclaimer: 'ChatGPT, Claude, Gemini and other product names are trademarks of their respective owners. ModelAny is an independent tool and is not affiliated with them.',
  },
  zh: {
    homeHref: '/zh/',
    homeLabel: 'ModelAny 首页',
    navLabel: '主导航',
    footerLabel: '页脚导航',
    menuLabel: '切换导航菜单',
    themeLabel: '切换深色模式',
    switchHref: '/',
    switchLabel: 'EN',
    switchLang: 'en',
    switchHreflang: 'en',
    ctaShort: '免费安装',
    ctaMobile: '免费安装 ModelAny',
    nav: [
      { id: 'features', label: '功能', href: '#features' },
      { id: 'how-to-use', label: '使用教程', href: '/zh/how-to-use/', page: true },
      { id: 'models', label: '支持的 AI', href: '#models' },
      { id: 'benchmarks', label: '评测对比', href: '/zh/benchmarks/', page: true },
      { id: 'privacy', label: '隐私', href: '#privacy' },
      { id: 'faq', label: '常见问题', href: '#faq' },
    ],
    tagline: '一次提问，ChatGPT、Claude、Gemini、DeepSeek 等 11 个 AI 同时回答。用你自己的账号，完全免费，数据只在你的浏览器里。',
    columns: [
      {
        title: '产品',
        links: [
          { label: '功能', href: '/zh/#features' },
          { label: '使用教程', href: '/zh/how-to-use/' },
          { label: '支持的 AI', href: '/zh/#models' },
          { label: '隐私', href: '/zh/#privacy' },
          { label: '常见问题', href: '/zh/#faq' },
        ],
      },
      {
        title: '功能',
        links: [
          { label: '同时问多个 AI', href: '/zh/compare-ai-models/' },
          { label: 'AI 对话导出 PDF / Word', href: '/zh/export-ai-chat/' },
          { label: 'B 站 / YouTube 视频总结', href: '/zh/video-summary/' },
          { label: '换个 AI 继续聊', href: '/zh/continue-in-another-ai/' },
          { label: '本地 AI 记忆库', href: '/zh/ai-memory/' },
          { label: 'AI 浏览器插件', href: '/zh/ai-browser-extension/' },
        ],
      },
      {
        title: '评测与对比',
        links: [
          { label: '公开评测数据', href: '/zh/benchmarks/' },
          { label: 'Kimi vs ChatGPT', href: '/zh/compare/kimi-vs-chatgpt/' },
          { label: '通义千问 vs ChatGPT', href: '/zh/compare/qwen-vs-chatgpt/' },
          { label: '豆包 vs DeepSeek', href: '/zh/compare/doubao-vs-deepseek/' },
          { label: 'GLM vs ChatGPT', href: '/zh/compare/glm-vs-chatgpt/' },
          { label: 'GLM vs DeepSeek', href: '/zh/compare/glm-vs-deepseek/' },
        ],
      },
    ],
    install: '安装',
    chromeLabel: 'Chrome 应用商店',
    edgeLabel: 'Edge 扩展商店',
    privacyLabel: '隐私政策',
    privacyHref: '/zh/privacy.html',
    githubLabel: 'GitHub',
    contactLabel: '联系我们',
    copyright: '© 2026 ModelAny · 免费的 Chrome / Edge 浏览器扩展',
    disclaimer: 'ChatGPT、Claude、Gemini 等名称为其各自所有者的商标。ModelAny 是独立工具，与上述公司无关联。',
  },
};

/**
 * @param {{ lang?: 'en'|'zh', home?: boolean, switchHref?: string }} options
 *   home: true when rendered on the homepage (in-page anchors stay relative).
 *   switchHref: equivalent page in the other language.
 */
export function siteHeader({ lang = 'en', home = false, switchHref } = {}) {
  const c = COPY[lang];
  const altHref = switchHref || c.switchHref;
  const links = c.nav.map((item) => {
    const href = item.page ? item.href : `${home ? '' : c.homeHref}${item.href}`;
    return `<a href="${href}">${item.label}</a>`;
  }).join('\n        ');
  return `<header class="site-header" id="site-header">
    <div class="container nav-container">
      <a href="${home ? '#top' : c.homeHref}" class="brand" aria-label="${c.homeLabel}">
        <img src="/assets/favicon-192.png" alt="" class="brand-icon" width="32" height="32">
        <span class="brand-text">ModelAny</span>
      </a>
      <nav class="nav-menu" id="nav-menu" aria-label="${c.navLabel}">
        ${links}
        <a href="${altHref}" data-locale-switch="${c.switchLang}" class="locale-switch nav-menu-locale" hreflang="${c.switchHreflang}" lang="${c.switchHreflang}">${ICONS.globe}<span>${lang === 'zh' ? 'English' : '中文'}</span></a>
        <a href="${CHROME_STORE_URL}" data-download-cta data-cta="short" class="btn btn-primary nav-download">${c.ctaShort}</a>
      </nav>
      <div class="nav-actions">
        <a href="${altHref}" data-locale-switch="${c.switchLang}" class="locale-switch locale-switch-compact" hreflang="${c.switchHreflang}" lang="${c.switchHreflang}">${ICONS.globe}<span>${c.switchLabel}</span></a>
        <button class="theme-toggle" id="theme-toggle" aria-label="${c.themeLabel}" type="button">
          ${ICONS.moon}
          ${ICONS.sun}
        </button>
        <a href="${CHROME_STORE_URL}" data-download-cta data-cta="short" class="btn btn-primary nav-cta"><span class="cta-icon" aria-hidden="true">${ICONS.chrome}${ICONS.edge}</span><span data-cta-text>${c.ctaShort}</span></a>
        <button class="menu-toggle" id="menu-toggle" aria-label="${c.menuLabel}" aria-expanded="false" aria-controls="nav-menu">
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
        </button>
      </div>
    </div>
  </header>`;
}

export function siteFooter({ lang = 'en', switchHref } = {}) {
  const c = COPY[lang];
  const altHref = switchHref || c.switchHref;
  const columns = c.columns.map((column) => `<div class="footer-col">
          <h2 class="footer-heading">${column.title}</h2>
          <ul>
            ${column.links.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join('\n            ')}
          </ul>
        </div>`).join('\n        ');
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-about">
          <a href="${c.homeHref}" class="footer-brand"><img src="/assets/favicon-192.png" alt="" class="footer-logo" width="28" height="28"><span>ModelAny</span></a>
          <p class="footer-tagline">${c.tagline}</p>
          <div class="footer-stores">
            <a href="${CHROME_STORE_URL}" target="_blank" rel="noopener noreferrer" class="store-chip">${ICONS.chrome}<span>${c.chromeLabel}</span></a>
            <a href="${EDGE_STORE_URL}" target="_blank" rel="noopener noreferrer" class="store-chip">${ICONS.edge}<span>${c.edgeLabel}</span></a>
          </div>
        </div>
        ${columns}
      </div>
      <div class="footer-bottom">
        <p>${c.copyright}</p>
        <nav class="footer-links" aria-label="${c.footerLabel}">
          <a href="${c.privacyHref}">${c.privacyLabel}</a>
          <a href="${GITHUB_REPO}" target="_blank" rel="noopener noreferrer">${c.githubLabel}</a>
          <a href="#" data-email="${CONTACT_EMAIL_PARTS}">${c.contactLabel}</a>
          <a href="${altHref}" data-locale-switch="${c.switchLang}" hreflang="${c.switchHreflang}" lang="${c.switchHreflang}">${lang === 'zh' ? 'English' : '中文'}</a>
        </nav>
      </div>
      <p class="footer-disclaimer">${c.disclaimer}</p>
    </div>
  </footer>`;
}

export function mobileCtaBar(lang = 'en') {
  const c = COPY[lang];
  return `<div class="mobile-cta-bar">
    <a href="${CHROME_STORE_URL}" data-download-cta data-cta="mobile" class="btn btn-primary btn-block"><span data-cta-text>${c.ctaMobile}</span></a>
  </div>`;
}

export function scrollTopButton(lang = 'en') {
  return `<button class="scroll-top" id="scroll-top" aria-label="${lang === 'zh' ? '回到顶部' : 'Scroll to top'}" type="button">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
  </button>`;
}
