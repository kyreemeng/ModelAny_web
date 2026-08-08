(() => {
  const CHROME_STORE = 'https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn?utm_source=item-share-cb';
  const EDGE_STORE = 'https://microsoftedge.microsoft.com/addons/detail/lfeckjibcfbjfdlepidpmnalpfimhdli';
  const isZh = document.documentElement.lang === 'zh-CN';

  function isChromeBrowser() {
    const ua = navigator.userAgent;
    return /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua) && !/Brave\//.test(ua);
  }

  function isEdgeBrowser() {
    return /Edg(?:e|A|iOS)?\//.test(navigator.userAgent);
  }

  function bind(anchor) {
    const chrome = isChromeBrowser();
    const edge = isEdgeBrowser();
    const store = edge || (!chrome && isZh) ? EDGE_STORE : CHROME_STORE;

    anchor.setAttribute('href', store);
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  }

  document.querySelectorAll('[data-download-cta]').forEach(bind);
})();
