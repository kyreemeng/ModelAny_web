(() => {
  const CHROME_STORE = 'https://chromewebstore.google.com/detail/modelany/kbpnggjenonafpcigahfaeiooojepfjn?utm_source=item-share-cb';
  const isZh = document.documentElement.lang === 'zh-CN';
  const copy = isZh
    ? {
        chrome: '从 Chrome 商店安装',
        other: 'Chrome 商店可用',
        tip: '请使用 Google Chrome 打开此页面，再从 Chrome 网上应用店安装 ModelAny。Microsoft Edge 扩展仍在审核中。',
      }
    : {
        chrome: 'Install from Chrome Web Store',
        other: 'Available on Chrome Web Store',
        tip: 'Please open this page in Google Chrome, then install ModelAny from the Chrome Web Store. The Microsoft Edge Add-ons listing is still under review.',
      };

  function isChromeBrowser() {
    const ua = navigator.userAgent;
    return /Chrome\//.test(ua) && !/Edg\//.test(ua) && !/OPR\//.test(ua) && !/Brave\//.test(ua);
  }

  function ensureTip(anchor) {
    let tip = document.querySelector('[data-download-tip]');
    if (!tip) {
      tip = document.createElement('p');
      tip.setAttribute('data-download-tip', '');
      tip.className = 'download-tip';
      tip.setAttribute('role', 'status');
      tip.hidden = true;
      const host = document.querySelector('.install-availability') || anchor.parentElement;
      host?.insertAdjacentElement('afterend', tip);
    }
    return tip;
  }

  function bind(anchor) {
    const chrome = isChromeBrowser();
    anchor.setAttribute('href', chrome ? CHROME_STORE : '#download');
    if (chrome) {
      anchor.setAttribute('target', '_blank');
      anchor.setAttribute('rel', 'noopener noreferrer');
    } else {
      anchor.removeAttribute('target');
      if (anchor.textContent.trim()) {
        const versionMatch = anchor.textContent.match(/v?\d+\.\d+\.\d+/);
        anchor.textContent = versionMatch ? `${copy.other}` : copy.other;
      }
    }

    anchor.addEventListener('click', (event) => {
      if (chrome) return;
      event.preventDefault();
      const tip = ensureTip(anchor);
      tip.hidden = false;
      tip.textContent = copy.tip;
      tip.focus?.();
    });
  }

  document.querySelectorAll('[data-download-cta]').forEach(bind);
})();
