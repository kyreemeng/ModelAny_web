/**
 * ModelAny site script
 * - Interactive launcher that hands prompts to the installed extension
 *   through the website bridge, with install/copy/open fallbacks
 * - Theme toggle, mobile menu with focus trap, header state
 * - Scroll reveal, FAQ accordion, active nav, email de-obfuscation
 */
(function () {
  'use strict';

  const MODELS = [
    { id: 'chatgpt', url: 'https://chatgpt.com/' },
    { id: 'claude', url: 'https://claude.ai/' },
    { id: 'gemini', url: 'https://gemini.google.com/' },
    { id: 'deepseek', url: 'https://chat.deepseek.com/' },
    { id: 'grok', url: 'https://x.com/i/grok' },
    { id: 'kimi', url: 'https://www.kimi.com/' },
    { id: 'qwen', url: 'https://www.qianwen.com/' },
    { id: 'doubao', url: 'https://www.doubao.com/chat/' },
    { id: 'glm', url: 'https://chatglm.cn/' },
    { id: 'yuanbao', url: 'https://yuanbao.tencent.com/' },
    { id: 'wenxin', url: 'https://wenxin.baidu.com/' }
  ];

  const BRIDGE_TIMEOUT_MS = 5000;
  const MAX_PROMPT_LENGTH = 5000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isZh = document.documentElement.lang === 'zh-CN';

  // --- Theme toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const isDark = current === 'dark' || (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('modelany-theme', next);
    });
  }

  // --- Mobile menu with focus trap ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    let focusTrapHandler = null;

    function getFocusableElements(container) {
      return Array.from(container.querySelectorAll('a[href], button:not([disabled])')).filter(function (el) {
        return el.offsetParent !== null;
      });
    }

    function closeMobileMenu(restoreFocus) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (focusTrapHandler) {
        document.removeEventListener('keydown', focusTrapHandler);
        focusTrapHandler = null;
      }
      if (restoreFocus) menuToggle.focus();
    }

    function openMobileMenu() {
      navMenu.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      focusTrapHandler = function (event) {
        if (event.key !== 'Tab') return;
        const focusable = getFocusableElements(navMenu).concat(menuToggle);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };
      document.addEventListener('keydown', focusTrapHandler);
      const firstLink = navMenu.querySelector('a');
      if (firstLink) setTimeout(function () { firstLink.focus(); }, 80);
    }

    menuToggle.addEventListener('click', function () {
      if (navMenu.classList.contains('open')) closeMobileMenu(true);
      else openMobileMenu();
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { closeMobileMenu(false); });
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) closeMobileMenu(true);
    });
    document.addEventListener('click', function (event) {
      if (navMenu.classList.contains('open') && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMobileMenu(false);
      }
    });
  }

  // --- Header state + scroll-to-top ---
  const header = document.getElementById('site-header');
  const scrollTopBtn = document.getElementById('scroll-top');
  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', y > 900);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // --- Interactive launcher ---
  const launcherSend = document.getElementById('launcher-send');
  const launcherChips = document.getElementById('launcher-chips');
  const launcherInput = document.getElementById('launcher-input');
  const launcherCounter = document.getElementById('launcher-counter');
  const sendCountEls = [document.getElementById('send-count'), document.getElementById('send-count-button')].filter(Boolean);
  const selectAllButton = document.getElementById('launcher-select-all');
  const autoSubmit = document.getElementById('launcher-auto-submit');
  const launcherStatus = document.getElementById('launcher-status');
  const launcherFallback = document.getElementById('launcher-fallback');
  const copyButton = document.getElementById('launcher-copy');
  const openSitesButton = document.getElementById('launcher-open-sites');

  const copy = isZh ? {
    enterPrompt: '请先输入问题。',
    selectModel: '请至少选择一个 AI。',
    checking: '正在连接已安装的 ModelAny…',
    acceptedFill: '正在打开 {n} 个 AI 网站，问题会自动填入，确认后即可发送。',
    acceptedSend: '正在打开 {n} 个 AI 网站并自动发送。',
    rejected: '扩展未能启动这次发送。',
    missing: '这台浏览器上还没有检测到 ModelAny。安装后刷新本页，就能从这里一键发送；也可以先复制问题或打开所选网站。',
    copied: '已复制问题',
    copyFailed: '复制失败，请手动选中文字复制。',
    opened: '已打开所选 AI 网站，请粘贴问题。',
    selectAll: '全选',
    clearAll: '清空'
  } : {
    enterPrompt: 'Type a question first.',
    selectModel: 'Pick at least one AI.',
    checking: 'Connecting to your installed ModelAny…',
    acceptedFill: 'Opening {n} AI sites. Your question will be filled in for you to review.',
    acceptedSend: 'Opening {n} AI sites and sending your question.',
    rejected: 'The extension could not start this request.',
    missing: 'ModelAny isn’t installed in this browser yet. Add it, reload this page, and this box will send for real. Meanwhile you can copy the question or open the selected sites.',
    copied: 'Question copied',
    copyFailed: 'Copy failed. Select the text and copy it manually.',
    opened: 'Opened the selected AI sites. Paste your question there.',
    selectAll: 'Select all',
    clearAll: 'Clear'
  };

  const selectedModels = new Set();
  if (launcherChips) {
    launcherChips.querySelectorAll('[data-model]').forEach(function (chip) {
      if (chip.classList.contains('active')) selectedModels.add(chip.dataset.model);
      chip.addEventListener('click', function () {
        const id = chip.dataset.model;
        if (selectedModels.has(id)) selectedModels.delete(id);
        else selectedModels.add(id);
        syncChips();
      });
    });
  }

  function syncChips() {
    if (!launcherChips) return;
    launcherChips.querySelectorAll('[data-model]').forEach(function (chip) {
      const on = selectedModels.has(chip.dataset.model);
      chip.classList.toggle('active', on);
      chip.setAttribute('aria-pressed', String(on));
    });
    sendCountEls.forEach(function (el) { el.textContent = String(selectedModels.size); });
    if (launcherSend) {
      launcherSend.disabled = selectedModels.size === 0;
      launcherSend.setAttribute('aria-disabled', String(selectedModels.size === 0));
    }
    if (selectAllButton) {
      selectAllButton.textContent = selectedModels.size === MODELS.length ? copy.clearAll : copy.selectAll;
    }
  }

  if (selectAllButton) {
    selectAllButton.addEventListener('click', function () {
      if (selectedModels.size === MODELS.length) selectedModels.clear();
      else MODELS.forEach(function (m) { selectedModels.add(m.id); });
      syncChips();
    });
  }

  function updateLauncherCounter() {
    if (!launcherInput || !launcherCounter) return;
    const chars = Array.from(launcherInput.value);
    if (chars.length > MAX_PROMPT_LENGTH) launcherInput.value = chars.slice(0, MAX_PROMPT_LENGTH).join('');
    const length = Array.from(launcherInput.value.trim()).length;
    launcherCounter.textContent = length + ' / ' + MAX_PROMPT_LENGTH;
    const ratio = length / MAX_PROMPT_LENGTH;
    launcherCounter.classList.toggle('is-danger', ratio >= 0.95);
    launcherCounter.classList.toggle('is-warning', ratio >= 0.85 && ratio < 0.95);
  }

  if (launcherInput) launcherInput.addEventListener('input', updateLauncherCounter);

  document.querySelectorAll('[data-template]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (!launcherInput) return;
      const current = launcherInput.value.trim();
      launcherInput.value = button.dataset.template + current;
      updateLauncherCounter();
      launcherInput.focus();
      launcherInput.setSelectionRange(launcherInput.value.length, launcherInput.value.length);
    });
  });

  function setLauncherStatus(message, type) {
    if (!launcherStatus) return;
    launcherStatus.textContent = message;
    launcherStatus.classList.remove('is-error', 'is-success', 'is-info');
    if (type) launcherStatus.classList.add('is-' + type);
  }

  function selectedPrompt() {
    return launcherInput ? launcherInput.value.trim() : '';
  }

  function requestExtensionLaunch(payload) {
    return new Promise(function (resolve, reject) {
      const nonce = crypto.randomUUID();
      const timer = window.setTimeout(function () {
        window.removeEventListener('message', onMessage);
        reject(new Error('EXTENSION_NOT_DETECTED'));
      }, BRIDGE_TIMEOUT_MS);

      function onMessage(event) {
        if (event.origin !== window.location.origin || event.source !== window || !event.data || event.data.nonce !== nonce) return;
        if (event.data.type !== 'MODELANY_LAUNCH_RESULT') return;
        window.clearTimeout(timer);
        window.removeEventListener('message', onMessage);
        resolve(event.data);
      }

      window.addEventListener('message', onMessage);
      window.postMessage({ type: 'MODELANY_LAUNCH_REQUEST', nonce: nonce, payload: payload }, window.location.origin);
    });
  }

  function showLauncherFallback(message, isError) {
    setLauncherStatus(message, isError ? 'error' : 'info');
    if (launcherFallback) launcherFallback.hidden = false;
  }

  if (launcherSend) {
    launcherSend.addEventListener('click', async function () {
      const prompt = selectedPrompt();
      if (!prompt) return showLauncherFallback(copy.enterPrompt, true);
      if (!selectedModels.size) return showLauncherFallback(copy.selectModel, true);

      launcherSend.classList.add('sending');
      launcherSend.disabled = true;
      setLauncherStatus(copy.checking, 'info');
      if (launcherFallback) launcherFallback.hidden = true;
      try {
        const result = await requestExtensionLaunch({
          prompt: prompt,
          modelIds: MODELS.map(function (m) { return m.id; }).filter(function (id) { return selectedModels.has(id); }),
          autoSubmit: Boolean(autoSubmit && autoSubmit.checked)
        });
        if (result.status === 'accepted') {
          const template = result.autoSubmit ? copy.acceptedSend : copy.acceptedFill;
          setLauncherStatus(template.replace('{n}', String(result.modelCount)), 'success');
        } else {
          showLauncherFallback(result.message || copy.rejected, true);
        }
      } catch (error) {
        showLauncherFallback(copy.missing, false);
      } finally {
        launcherSend.classList.remove('sending');
        launcherSend.disabled = selectedModels.size === 0;
      }
    });

    if (launcherInput) {
      launcherInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          launcherSend.click();
        }
      });
    }
  }

  if (copyButton) {
    const originalCopyText = copyButton.textContent;
    copyButton.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(selectedPrompt());
        copyButton.textContent = '✓ ' + copy.copied;
        setTimeout(function () { copyButton.textContent = originalCopyText; }, 2000);
      } catch {
        setLauncherStatus(copy.copyFailed, 'error');
      }
    });
  }

  if (openSitesButton) {
    openSitesButton.addEventListener('click', function () {
      MODELS.filter(function (m) { return selectedModels.has(m.id); }).forEach(function (m) {
        window.open(m.url, '_blank', 'noopener,noreferrer');
      });
      setLauncherStatus(copy.opened, 'info');
    });
  }

  syncChips();
  updateLauncherCounter();

  // --- Scroll reveal (progressive enhancement) ---
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const targets = document.querySelectorAll('.feature-card, .mini-card, .install-step, .recipe, .pain-card, .model-card, .usecase-card, .privacy-panel, .cta-panel, .popular-link, .fp-step');
    targets.forEach(function (el) { el.classList.add('reveal', 'reveal-hide'); });
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const index = target.parentElement ? Array.prototype.indexOf.call(target.parentElement.children, target) : 0;
        setTimeout(function () {
          target.classList.add('visible');
          target.classList.remove('reveal-hide');
        }, Math.min(index * 60, 300));
        observer.unobserve(target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el) { observer.observe(el); });
  }

  // --- FAQ accordion ---
  document.querySelectorAll('details.faq-item').forEach(function (item) {
    const summary = item.querySelector('summary');
    if (!summary) return;
    item.classList.add('js-faq');
    if (item.open) item.classList.add('is-open');
    summary.addEventListener('click', function (event) {
      event.preventDefault();
      if (item.classList.contains('is-open')) {
        item.classList.remove('is-open');
        setTimeout(function () { if (!item.classList.contains('is-open')) item.open = false; }, 380);
      } else {
        item.open = true;
        requestAnimationFrame(function () { item.classList.add('is-open'); });
      }
    });
  });

  // --- Smooth in-page anchors ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (event) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      if (href === '#top') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        history.replaceState(null, '', href);
      }
    });
  });

  // --- Active navigation state ---
  if ('IntersectionObserver' in window) {
    const sectionLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
    const sections = sectionLinks.map(function (link) { return document.querySelector(link.getAttribute('href')); }).filter(Boolean);
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (link) {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  // --- Email de-obfuscation ---
  document.querySelectorAll('[data-email]').forEach(function (el) {
    const parts = el.dataset.email.split('|');
    if (parts[0] && parts[1]) {
      const address = parts[0] + '@' + parts[1];
      if (el.textContent.trim() === '' || el.textContent.includes('@')) el.textContent = address;
      el.setAttribute('href', 'mailto:' + address);
    }
  });
})();
