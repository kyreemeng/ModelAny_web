/**
 * ModelAny Landing Page Script
 * Features:
 * - Interactive Prompt Launcher simulation (prompt flowing to model nodes)
 * - GitHub Stars API with graceful degradation
 * - Mobile menu toggle with focus trap
 * - Native IntersectionObserver scroll reveal (no GSAP dependency)
 * - Prefers-reduced-motion support
 * - Touch-friendly step highlight
 * - Copy success feedback
 * - Dark mode toggle with localStorage persistence
 * - Scroll-to-top button
 * - FAQ accordion with smooth animation
 */

(function () {
  'use strict';

  // --- Model data structure (reusable) ---
  const MODELS = [
    { id: 'chatgpt',  name: 'ChatGPT',  color: '#10A37F', url: 'https://chatgpt.com/' },
    { id: 'gemini',   name: 'Gemini',   color: '#4285F4', url: 'https://gemini.google.com/' },
    { id: 'deepseek', name: 'DeepSeek', color: '#4D6BFE', url: 'https://chat.deepseek.com/' },
    { id: 'kimi',     name: 'Kimi',     color: '#111827', url: 'https://www.kimi.com/' },
    { id: 'glm',      name: 'GLM',      color: '#159C8C', url: 'https://chatglm.cn/' },
    { id: 'qwen',     name: 'Qwen',     color: '#6954E8', url: 'https://www.qianwen.com/' },
    { id: 'doubao',   name: 'Doubao',   color: '#3B82F6', url: 'https://www.doubao.com/chat/' },
    { id: 'wenxin',   name: 'Wenxin',   color: '#2F6BFF', url: 'https://wenxin.baidu.com/' }
  ];

  const GITHUB_API_URL = 'https://api.github.com/repos/kyreemeng/ModelAny';
  const BRIDGE_TIMEOUT_MS = 5000;
  const MAX_PROMPT_LENGTH = 5000;
  const ORBIT_PULSE_DELAY = 120;
  const ORBIT_PULSE_DURATION = 600;
  const ORBIT_CLEANUP_DELAY = 800;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Theme Toggle ---
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const current = document.documentElement.getAttribute('data-theme');
      const isDark = current === 'dark' ||
        (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
      const next = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('modelany-theme', next);
      // Update meta theme-color
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', next === 'dark' ? '#16162A' : '#6D5DFB');
      }
    });
  }

  // --- Mobile Menu Toggle with Focus Trap ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    let menuTriggerBeforeOpen = null;
    let focusTrapHandler = null;

    function getFocusableElements(container) {
      return Array.from(container.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )).filter(function (el) {
        return el.offsetParent !== null || el === container;
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
      if (restoreFocus && menuTriggerBeforeOpen) {
        menuToggle.focus();
      }
    }

    function openMobileMenu() {
      navMenu.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      menuTriggerBeforeOpen = document.activeElement;

      focusTrapHandler = function (event) {
        if (event.key !== 'Tab') return;
        const focusable = getFocusableElements(navMenu);
        if (focusable.length === 0) return;
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

      const firstLink = navMenu.querySelector('a, button');
      if (firstLink) {
        setTimeout(function () { firstLink.focus(); }, 100);
      }
    }

    menuToggle.addEventListener('click', function () {
      if (navMenu.classList.contains('open')) {
        closeMobileMenu(true);
      } else {
        openMobileMenu();
      }
    });

    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu(true);
      }
    });

    document.addEventListener('click', function (event) {
      if (navMenu.classList.contains('open') && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMobileMenu(false);
      }
    });
  }

  // --- Header scroll effect ---
  const header = document.getElementById('site-header');

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 10) {
      header.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)';
      header.style.background = 'var(--header-bg-scrolled)';
    } else {
      header.style.boxShadow = 'none';
      header.style.background = 'var(--header-bg)';
    }
  }

  if (header) {
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  }

  // --- Scroll-to-top Button ---
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 800) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  // --- Interactive Prompt Launcher ---
  const launcherSend = document.getElementById('launcher-send');
  const launcherChips = document.getElementById('launcher-chips');
  const launcherInput = document.getElementById('launcher-input');
  const launcherCounter = document.getElementById('launcher-counter');
  const sendCount = document.getElementById('send-count');
  const autoSubmit = document.getElementById('launcher-auto-submit');
  const launcherStatus = document.getElementById('launcher-status');
  const launcherFallback = document.getElementById('launcher-fallback');
  const copyButton = document.getElementById('launcher-copy');
  const openSitesButton = document.getElementById('launcher-open-sites');
  const orbitContainer = document.getElementById('orbit-container');
  const orbitLines = document.getElementById('orbit-lines');

  // Track selected models
  const selectedModels = new Set(MODELS.map(function (m) { return m.id; }));

  const isZh = document.documentElement.lang === 'zh-CN';
  const copy = isZh ? {
    enterPrompt: '请先输入问题。',
    selectModel: '请至少选择一个模型。',
    checking: '正在检测已安装的 ModelAny 扩展…',
    sending: '正在发送…',
    acceptedFill: '正在打开 {n} 个模型网站。问题将自动填入，供你确认。',
    acceptedSend: '正在打开 {n} 个模型网站。已请求自动发送。',
    rejected: '扩展无法启动此任务。',
    missing: '未检测到支持网页发送的 ModelAny。请确认扩展已更新至 v1.0.2 或更高版本后重试；问题仍保留在本页。',
    copied: '问题已复制到剪贴板。',
    copyFailed: '复制失败。请手动选中问题后复制。',
    copyRetry: '重试复制',
    opened: '已打开所选模型网站。请自行粘贴问题。'
  } : {
    enterPrompt: 'Enter a question before launching.',
    selectModel: 'Select at least one model.',
    checking: 'Checking the installed ModelAny extension…',
    sending: 'Sending…',
    acceptedFill: 'Opening {n} model sites. Your question will be filled in for review.',
    acceptedSend: 'Opening {n} model sites. Auto-send was requested.',
    rejected: 'The extension could not start this task.',
    missing: 'A ModelAny version with website launch support was not detected. Update to v1.0.2 or later, then try again. Your question remains on this page.',
    copied: 'Question copied to your clipboard.',
    copyFailed: 'Copy failed. Select the question and copy it manually.',
    copyRetry: 'Retry copy',
    opened: 'Opened the selected model sites. Paste the question yourself.'
  };

  // Toggle chip selection
  if (launcherChips) {
    launcherChips.querySelectorAll('[data-model]').forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(selectedModels.has(chip.dataset.model)));
      chip.addEventListener('click', function () {
        const modelId = chip.dataset.model;
        if (selectedModels.has(modelId)) {
          selectedModels.delete(modelId);
          chip.classList.remove('active');
        } else {
          selectedModels.add(modelId);
          chip.classList.add('active');
        }
        chip.setAttribute('aria-pressed', String(selectedModels.has(modelId)));
        updateSendCount();
      });
    });
  }

  function updateLauncherCounter() {
    if (!launcherInput || !launcherCounter) return;
    const text = launcherInput.value;
    const chars = Array.from(text);
    if (chars.length > MAX_PROMPT_LENGTH) {
      const limited = chars.slice(0, MAX_PROMPT_LENGTH).join('');
      launcherInput.value = limited;
    }
    const trimmedLength = Array.from(launcherInput.value.trim()).length;
    launcherCounter.textContent = trimmedLength + ' / ' + MAX_PROMPT_LENGTH;

    const ratio = trimmedLength / MAX_PROMPT_LENGTH;
    launcherCounter.classList.remove('is-warning', 'is-danger');
    if (ratio >= 0.95) {
      launcherCounter.classList.add('is-danger');
    } else if (ratio >= 0.85) {
      launcherCounter.classList.add('is-warning');
    }
  }

  function updateSendCount() {
    if (sendCount) {
      sendCount.textContent = String(selectedModels.size);
    }
    if (launcherSend) {
      launcherSend.disabled = selectedModels.size === 0;
      launcherSend.setAttribute('aria-disabled', String(selectedModels.size === 0));
    }
    syncOrbitNodeState();
  }

  function syncOrbitNodeState() {
    if (!orbitContainer) return;
    orbitContainer.querySelectorAll('.orbit-node').forEach(function (node) {
      node.classList.toggle('inactive', !selectedModels.has(node.dataset.model));
    });
  }

  function drawOrbitLines() {
    if (!orbitLines || !orbitContainer) return;

    orbitLines.replaceChildren();

    const svgNamespace = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(svgNamespace, 'defs');
    const gradient = document.createElementNS(svgNamespace, 'linearGradient');
    gradient.setAttribute('id', 'orbit-gradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    [['0%', '#6D5DFB', '0.8'], ['100%', '#55B8FF', '0.4']].forEach(function (stopData) {
      const stop = document.createElementNS(svgNamespace, 'stop');
      stop.setAttribute('offset', stopData[0]);
      stop.setAttribute('stop-color', stopData[1]);
      stop.setAttribute('stop-opacity', stopData[2]);
      gradient.appendChild(stop);
    });

    defs.appendChild(gradient);
    orbitLines.appendChild(defs);

    const containerRect = orbitContainer.getBoundingClientRect();
    const cx = containerRect.width / 2;
    const cy = containerRect.height / 2;

    orbitContainer.querySelectorAll('.orbit-node').forEach(function (node) {
      const nodeRect = node.getBoundingClientRect();
      const nx = nodeRect.left - containerRect.left + nodeRect.width / 2;
      const ny = nodeRect.top - containerRect.top + nodeRect.height / 2;

      const line = document.createElementNS(svgNamespace, 'line');
      line.setAttribute('x1', String(cx));
      line.setAttribute('y1', String(cy));
      line.setAttribute('x2', String(nx));
      line.setAttribute('y2', String(ny));
      line.setAttribute('data-model', node.dataset.model);
      orbitLines.appendChild(line);
    });
  }

  function playOrbitLaunchAnimation() {
    if (!orbitContainer || !orbitLines || prefersReducedMotion) {
      if (orbitContainer) {
        orbitContainer.classList.add('active');
        setTimeout(function () { orbitContainer.classList.remove('active'); }, 400);
      }
      return;
    }

    orbitContainer.classList.add('active');
    const nodes = orbitContainer.querySelectorAll('.orbit-node');
    let delay = 0;
    nodes.forEach(function (node) {
      const modelId = node.dataset.model;
      if (!selectedModels.has(modelId)) return;

      setTimeout(function () {
        node.classList.add('pulse');
        const line = orbitLines.querySelector('line[data-model="' + modelId + '"]');
        if (line) {
          line.style.opacity = '1';
          line.style.strokeWidth = '2.5';
        }
      }, delay);
      delay += ORBIT_PULSE_DELAY;

      setTimeout(function () {
        node.classList.remove('pulse');
        const line = orbitLines.querySelector('line[data-model="' + modelId + '"]');
        if (line) {
          line.style.opacity = '';
          line.style.strokeWidth = '';
        }
      }, delay + ORBIT_PULSE_DURATION);
    });

    setTimeout(function () {
      orbitContainer.classList.remove('active');
    }, delay + ORBIT_CLEANUP_DELAY);
  }

  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (orbitLines) drawOrbitLines();
    }, 200);
  });

  if (orbitLines) {
    requestAnimationFrame(function () {
      requestAnimationFrame(drawOrbitLines);
    });
  }

  if (launcherInput) {
    launcherInput.addEventListener('input', updateLauncherCounter);
  }

  function setLauncherStatus(message, type) {
    if (!launcherStatus) return;
    launcherStatus.textContent = message;
    launcherStatus.classList.remove('is-error', 'is-success', 'is-info');
    if (type) {
      launcherStatus.classList.add('is-' + type);
    }
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
      playOrbitLaunchAnimation();
      try {
        const result = await requestExtensionLaunch({
          prompt: prompt,
          modelIds: Array.from(selectedModels),
          autoSubmit: Boolean(autoSubmit && autoSubmit.checked)
        });
        if (result.status === 'accepted') {
          const template = result.autoSubmit ? copy.acceptedSend : copy.acceptedFill;
          setLauncherStatus(template.replace('{n}', String(result.modelCount)), 'success');
        } else {
          showLauncherFallback(result.message || copy.rejected, true);
        }
      } catch (error) {
        showLauncherFallback(copy.missing, true);
      } finally {
        launcherSend.classList.remove('sending');
        launcherSend.disabled = selectedModels.size === 0;
      }
    });
  }

  if (copyButton) {
    const originalCopyText = copyButton.textContent;
    copyButton.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(selectedPrompt());
        setLauncherStatus(copy.copied, 'success');
        copyButton.textContent = '\u2713 ' + copy.copied.split('.')[0];
        copyButton.classList.add('is-success');
        setTimeout(function () {
          copyButton.textContent = originalCopyText;
          copyButton.classList.remove('is-success');
        }, 2000);
      } catch {
        setLauncherStatus(copy.copyFailed, 'error');
        copyButton.textContent = copy.copyRetry;
        copyButton.classList.add('is-error');
        setTimeout(function () {
          copyButton.textContent = originalCopyText;
          copyButton.classList.remove('is-error');
        }, 3000);
      }
    });
  }

  if (openSitesButton) {
    openSitesButton.addEventListener('click', function () {
      MODELS.filter(function (model) { return selectedModels.has(model.id); }).forEach(function (model) {
        window.open(model.url, '_blank', 'noopener,noreferrer');
      });
      setLauncherStatus(copy.opened, 'info');
    });
  }

  updateSendCount();
  updateLauncherCounter();

  // --- GitHub Stars API ---
  const githubStarText = document.getElementById('github-star-text');
  const githubStarLink = document.getElementById('github-star-link');

  function showGithubLoading() {
    if (githubStarText) {
      const loadingIndicator = document.createElement('span');
      loadingIndicator.className = 'github-stat-loading';
      loadingIndicator.setAttribute('aria-label', 'Loading star count');
      githubStarText.replaceChildren(loadingIndicator);
    }
  }

  function showGithubStars(count) {
    if (githubStarText) {
      const countElement = document.createElement('span');
      countElement.className = 'github-stat-count';
      countElement.textContent = formatNumber(count);
      githubStarText.replaceChildren(countElement, document.createTextNode(' stars'));
    }
  }

  function showGithubFallback() {
    if (githubStarText) {
      githubStarText.textContent = 'Star on GitHub';
      if (githubStarLink) {
        githubStarLink.setAttribute('title', 'Star count temporarily unavailable');
      }
    }
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return String(num);
  }

  async function fetchGitHubStats() {
    showGithubLoading();

    try {
      const response = await fetch(GITHUB_API_URL, {
        headers: {
          'Accept': 'application/vnd.github+json'
        }
      });

      if (!response.ok) {
        throw new Error('GitHub API responded with status ' + response.status);
      }

      const data = await response.json();

      if (typeof data.stargazers_count === 'number') {
        showGithubStars(data.stargazers_count);
      } else {
        showGithubFallback();
      }
    } catch (err) {
      showGithubFallback();
    }
  }

  if (githubStarText) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchGitHubStats, { timeout: 3000 });
    } else {
      setTimeout(fetchGitHubStats, 500);
    }
  }

  // --- Scroll Reveal (native IntersectionObserver, no GSAP) ---
  function initScrollReveal() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    const revealTargets = [
      '.feature-card',
      '.model-card',
      '.usecase-card',
      '.step',
      '.popup-mockup',
      '.privacy-card',
      '.faq-list',
      '.popular-link',
      '.trust-item',
      '.section-header'
    ];

    const selector = revealTargets.join(', ');
    const elements = document.querySelectorAll(selector);

    elements.forEach(function (el) {
      el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const target = entry.target;
          const siblings = target.parentElement ? target.parentElement.children : [];
          let index = 0;
          for (let i = 0; i < siblings.length; i++) {
            if (siblings[i] === target) { index = i; break; }
          }
          setTimeout(function () {
            target.classList.add('visible');
          }, Math.min(index * 80, 400));
          observer.unobserve(target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollReveal();

  // --- FAQ Accordion (native, no GSAP) ---
  function initFaqAccordion() {
    const items = document.querySelectorAll('details.faq-item');
    items.forEach(function (item) {
      if (item.dataset.faqBound === '1') return;
      item.dataset.faqBound = '1';

      const summary = item.querySelector('summary');
      if (!summary) return;

      // Ensure initial state
      if (item.open) {
        item.classList.add('is-open');
      }

      summary.addEventListener('click', function (event) {
        event.preventDefault();
        const isOpen = item.classList.contains('is-open');

        if (isOpen) {
          // Closing: remove class, wait for transition, then close details
          item.classList.remove('is-open');
          setTimeout(function () {
            if (!item.classList.contains('is-open')) {
              item.open = false;
            }
          }, 400);
        } else {
          // Opening: set open, then add class in next frame for transition
          item.open = true;
          requestAnimationFrame(function () {
            item.classList.add('is-open');
          });
        }
      });
    });
  }

  initFaqAccordion();

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  // --- Active navigation state ---
  if ('IntersectionObserver' in window) {
    const sectionLinks = Array.from(document.querySelectorAll('.nav-menu a[href^="#"]'));
    const sections = sectionLinks
      .map(function (link) { return document.querySelector(link.getAttribute('href')); })
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (link) {
          const isActive = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', isActive);
          if (isActive) {
            link.setAttribute('aria-current', 'location');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // --- How it works preview highlight (mouse + touch + keyboard) ---
  const steps = document.querySelectorAll('.step[data-step]');
  const mockupTargets = document.querySelectorAll('[data-step-target]');

  function highlightStep(stepNumber) {
    steps.forEach(function (step) {
      step.classList.toggle('is-active', step.dataset.step === stepNumber);
    });
    mockupTargets.forEach(function (target) {
      target.classList.toggle('is-highlighted', target.dataset.stepTarget === stepNumber);
    });
  }

  steps.forEach(function (step) {
    ['mouseenter', 'focus', 'click', 'touchstart'].forEach(function (eventName) {
      step.addEventListener(eventName, function (e) {
        if (eventName === 'touchstart') e.preventDefault();
        highlightStep(step.dataset.step);
      }, { passive: false });
    });
  });

  highlightStep('1');

  // --- Email obfuscation ---
  document.querySelectorAll('[data-email]').forEach(function (el) {
    const user = el.dataset.email.split('|')[0];
    const domain = el.dataset.email.split('|')[1];
    if (user && domain) {
      el.textContent = user + '@' + domain;
      el.setAttribute('href', 'mailto:' + user + '@' + domain);
    }
  });

})();
