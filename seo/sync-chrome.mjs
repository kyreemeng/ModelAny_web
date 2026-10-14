/**
 * Rewrites the shared header/footer on hand-written pages.
 * Run: node seo/sync-chrome.mjs (also invoked by seo/generate.mjs)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { adsenseCode, ahrefsAnalytics, mobileCtaBar, scrollTopButton, siteFooter, siteHeader } from './chrome.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

export const STATIC_PAGES = [
  { path: 'index.html', lang: 'en', home: true, switchHref: '/zh/' },
  { path: 'zh/index.html', lang: 'zh', home: true, switchHref: '/' },
  { path: 'privacy.html', lang: 'en', switchHref: '/zh/privacy.html' },
  { path: 'zh/privacy.html', lang: 'zh', switchHref: '/privacy.html' },
  { path: '404.html', lang: 'en', switchHref: '/zh/' },
  { path: 'benchmarks/index.html', lang: 'en', switchHref: '/zh/benchmarks/' },
  { path: 'zh/benchmarks/index.html', lang: 'zh', switchHref: '/benchmarks/' },
];

const HEADER_START = '<!-- chrome:header:start -->';
const HEADER_END = '<!-- chrome:header:end -->';
const FOOTER_START = '<!-- chrome:footer:start -->';
const FOOTER_END = '<!-- chrome:footer:end -->';
const HEAD_ANALYTICS_START = '<!-- chrome:head:analytics:start -->';
const HEAD_ANALYTICS_END = '<!-- chrome:head:analytics:end -->';
const HEAD_ADSENSE_START = '<!-- chrome:head:adsense:start -->';
const HEAD_ADSENSE_END = '<!-- chrome:head:adsense:end -->';

// Injects a <head> snippet just before </head>, wrapped in idempotent markers
// so re-runs replace the block instead of duplicating it.
function syncHeadBlock(html, startMarker, endMarker, content) {
  const block = `  ${startMarker}\n  ${content}\n  ${endMarker}\n`;
  const startIndex = html.indexOf(startMarker);
  if (startIndex !== -1) {
    const endIndex = html.indexOf(endMarker);
    const lineStart = html.lastIndexOf('\n', startIndex) + 1;
    return html.slice(0, lineStart) + block + html.slice(endIndex + endMarker.length + 1);
  }
  const headClose = html.indexOf('</head>');
  if (headClose === -1) throw new Error(`No </head> found for ${startMarker} injection`);
  return html.slice(0, headClose) + block + html.slice(headClose);
}

function replaceBlock(html, start, end, content, legacyPattern) {
  const block = `${start}\n  ${content}\n  ${end}`;
  const startIndex = html.indexOf(start);
  const endIndex = html.indexOf(end);
  if (startIndex !== -1 && endIndex !== -1) {
    return html.slice(0, startIndex) + block + html.slice(endIndex + end.length);
  }
  if (!legacyPattern.test(html)) throw new Error(`No chrome block found for ${start}`);
  return html.replace(legacyPattern, block);
}

export function syncChrome() {
  for (const page of STATIC_PAGES) {
    const file = join(ROOT, page.path);
    let html = readFileSync(file, 'utf8');
    html = html
      .replace(/\s*<!-- Scroll-to-top button -->/g, '')
      .replace(/\s*<!-- Mobile CTA bar -->/g, '')
      .replace(/\s*<button class="scroll-top"[\s\S]*?<\/button>(?![\s\S]*<!-- chrome:footer:end -->)/g, '')
      .replace(/\s*<div class="mobile-cta-bar">[\s\S]*?<\/div>(?![\s\S]*<!-- chrome:footer:end -->)/g, '');
    html = replaceBlock(html, HEADER_START, HEADER_END, siteHeader(page), /<header class="site-header"[\s\S]*?<\/header>/);
    const footer = [siteFooter(page), scrollTopButton(page.lang), mobileCtaBar(page.lang)].join('\n  ');
    html = replaceBlock(html, FOOTER_START, FOOTER_END, footer, /<footer class="site-footer"[\s\S]*?<\/footer>/);
    html = syncHeadBlock(html, HEAD_ANALYTICS_START, HEAD_ANALYTICS_END, ahrefsAnalytics());
    html = syncHeadBlock(html, HEAD_ADSENSE_START, HEAD_ADSENSE_END, adsenseCode());
    writeFileSync(file, html, 'utf8');
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  syncChrome();
  console.log(`Synced chrome on ${STATIC_PAGES.length} static pages.`);
}
