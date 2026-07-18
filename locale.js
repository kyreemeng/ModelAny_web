(() => {
  const COOKIE_NAME = 'modelany_locale';
  const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

  const saveLocale = (locale) => {
    document.cookie = `${COOKIE_NAME}=${locale}; Path=/; Max-Age=${YEAR_IN_SECONDS}; SameSite=Lax; Secure`;
  };

  // Mark current locale link as aria-current
  const currentLang = document.documentElement.lang;
  document.querySelectorAll('[data-locale-switch]').forEach((link) => {
    const linkLang = link.dataset.localeSwitch;
    // The link pointing TO the current page language gets aria-current
    // (i.e., when on /zh/, the "中文" link is the current page)
    // But locale switches point to the OTHER language, so we mark the
    // current page's language indicator instead. We skip marking here
    // since the link always goes to the opposite language.
    link.setAttribute('aria-current', String(linkLang === currentLang));
  });

  // Add smooth fade-out transition on locale switch
  document.addEventListener('click', (event) => {
    const link = event.target.closest('[data-locale-switch]');
    if (link) {
      saveLocale(link.dataset.localeSwitch);
      // Only add transition if the browser supports it and reduced motion is not preferred
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        event.preventDefault();
        document.body.style.transition = 'opacity 0.15s ease-out';
        document.body.style.opacity = '0';
        const targetHref = link.getAttribute('href');
        setTimeout(() => {
          window.location.href = targetHref;
        }, 150);
      }
    }
  });
})();
