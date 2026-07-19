(() => {
  const COOKIE_NAME = 'modelany_locale';
  const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

  const saveLocale = (locale) => {
    document.cookie = `${COOKIE_NAME}=${locale}; Path=/; Max-Age=${YEAR_IN_SECONDS}; SameSite=Lax; Secure`;
  };

  const normalizeLang = (value) => {
    if (!value) return '';
    if (value === 'zh' || value.startsWith('zh')) return 'zh';
    if (value === 'en' || value.startsWith('en')) return 'en';
    return value;
  };

  const currentLang = normalizeLang(document.documentElement.lang);
  document.querySelectorAll('[data-locale-switch]').forEach((link) => {
    const linkLang = normalizeLang(link.dataset.localeSwitch);
    // Locale switch links point to the other language, so mark current when they match page lang only if used as language badge.
    link.setAttribute('aria-current', String(linkLang === currentLang));
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-locale-switch]');
    if (!link) return;
    saveLocale(normalizeLang(link.dataset.localeSwitch) === 'zh' ? 'zh' : 'en');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      event.preventDefault();
      document.body.style.transition = 'opacity 0.15s ease-out';
      document.body.style.opacity = '0';
      const targetHref = link.getAttribute('href');
      setTimeout(() => {
        window.location.href = targetHref;
      }, 150);
    }
  });
})();
