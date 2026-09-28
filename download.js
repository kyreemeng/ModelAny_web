(() => {
  const CHROME_STORE = 'https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn?utm_source=item-share-cb';
  const EDGE_STORE = 'https://microsoftedge.microsoft.com/addons/detail/lfeckjibcfbjfdlepidpmnalpfimhdli';
  const isZh = document.documentElement.lang === 'zh-CN';

  const LABELS = {
    en: {
      chrome: { short: 'Add to Chrome', long: 'Add to Chrome — it’s free', mobile: 'Add to Chrome — free' },
      edge: { short: 'Add to Edge', long: 'Add to Edge — it’s free', mobile: 'Add to Edge — free' },
      mobile: 'View in Chrome Web Store',
    },
    zh: {
      chrome: { short: '添加到 Chrome', long: '免费添加到 Chrome', mobile: '免费安装 ModelAny' },
      edge: { short: '添加到 Edge', long: '免费添加到 Edge', mobile: '免费安装 ModelAny' },
      mobile: '查看商店页面（需在电脑上安装）',
    },
  };

  function isChromeBrowser() {
    const ua = navigator.userAgent;
    return /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua) && !/Brave\//.test(ua);
  }

  function isEdgeBrowser() {
    return /Edg(?:e|A|iOS)?\//.test(navigator.userAgent);
  }

  function isMobile() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  }

  const chrome = isChromeBrowser();
  const edge = isEdgeBrowser();
  const useEdge = edge || (!chrome && isZh);
  const store = useEdge ? EDGE_STORE : CHROME_STORE;
  const browser = useEdge ? 'edge' : 'chrome';
  const labels = LABELS[isZh ? 'zh' : 'en'];

  document.documentElement.dataset.browser = browser;
  if (isMobile()) document.documentElement.dataset.device = 'mobile';

  function bind(anchor) {
    anchor.setAttribute('href', store);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');

    const variant = anchor.dataset.cta;
    if (!variant || anchor.hasAttribute('data-keep-label')) return;
    const text = isMobile() && variant === 'mobile' ? labels.mobile : labels[browser][variant];
    if (!text) return;
    const target = anchor.querySelector('[data-cta-text]');
    if (target) target.textContent = text;
    else anchor.textContent = text;
  }

  document.querySelectorAll('[data-download-cta]').forEach(bind);
})();
