/**
 * Rewrites the shared header/footer on hand-written pages.
 * Run: node seo/sync-chrome.mjs (also invoked by seo/generate.mjs)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mobileCtaBar, scrollTopButton, siteFooter, siteHeader } from './chrome.mjs';

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
    writeFileSync(file, html, 'utf8');
  }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  syncChrome();
  console.log(`Synced chrome on ${STATIC_PAGES.length} static pages.`);
}
