/**
 * ModelAny Landing Page Script
 * Features:
 * - Interactive Prompt Launcher simulation (prompt flowing to model nodes)
 * - GitHub Stars API with graceful degradation
 * - Mobile menu toggle
 * - Scroll reveal animations
 * - Prefers-reduced-motion support
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

  const GITHUB_API_URL = 'https://api.github.com/repos/kyreemeng/ModelAny-Releases';
  const GITHUB_REPO_URL = 'https://github.com/kyreemeng/ModelAny-Releases';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    let menuTriggerBeforeOpen = null;

    function closeMobileMenu(restoreFocus) {
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      if (restoreFocus && menuTriggerBeforeOpen) {
        menuToggle.focus();
      }
    }

    menuToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
      if (isOpen) {
        menuTriggerBeforeOpen = document.activeElement;
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
  let lastScrollY = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 10) {
      header.style.boxShadow = '0 4px 24px rgba(109, 93, 251, 0.08)';
      header.style.background = 'rgba(255, 255, 255, 0.85)';
    } else {
      header.style.boxShadow = 'none';
      header.style.background = 'rgba(255, 255, 255, 0.7)';
    }
    lastScrollY = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // --- Interactive Prompt Launcher ---
  const launcherSend = document.getElementById('launcher-send');
  const launcherChips = document.getElementById('launcher-chips');
  const launcherInput = document.getElementById('launcher-input');
  const launcherCounter = document.getElementById('launcher-counter');
  const sendCount = document.getElementById('send-count');
  const orbitContainer = document.getElementById('orbit-container');
  const orbitLines = document.getElementById('orbit-lines');

  // Track selected models
  const selectedModels = new Set(MODELS.map(function (m) { return m.id; }));

  function updateLauncherCounter() {
    if (!launcherInput || !launcherCounter) return;
    const characterCount = Array.from(launcherInput.textContent.trim()).length;
    launcherCounter.textContent = String(characterCount) + ' / 5000';
  }

  function syncOrbitNodeState() {
    if (!orbitContainer) return;
    orbitContainer.querySelectorAll('.orbit-node').forEach(function (node) {
      node.classList.toggle('inactive', !selectedModels.has(node.dataset.model));
    });
  }

  // Update send button count
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

  if (launcherInput) {
    launcherInput.addEventListener('input', updateLauncherCounter);
  }

  // Toggle chip selection
  if (launcherChips) {
    launcherChips.querySelectorAll('.chip').forEach(function (chip) {
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
      chip.setAttribute('aria-pressed', String(selectedModels.has(chip.dataset.model)));
    });
  }

  // Draw orbit lines from center to each node
  function drawOrbitLines() {
    if (!orbitLines || !orbitContainer) return;

    orbitLines.replaceChildren();

    // Define gradient
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

    // Get node positions
    const nodes = orbitContainer.querySelectorAll('.orbit-node');
    nodes.forEach(function (node, idx) {
      const nodeRect = node.getBoundingClientRect();
      const nx = nodeRect.left - containerRect.left + nodeRect.width / 2;
      const ny = nodeRect.top - containerRect.top + nodeRect.height / 2;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(cx));
      line.setAttribute('y1', String(cy));
      line.setAttribute('x2', String(nx));
      line.setAttribute('y2', String(ny));
      line.setAttribute('data-model', node.dataset.model);
      orbitLines.appendChild(line);
    });
  }

  // Redraw on resize
  let resizeTimer;
  function handleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (orbitLines) {
        drawOrbitLines();
      }
    }, 200);
  }

  window.addEventListener('resize', handleResize);

  // Initialize orbit lines after layout settles
  if (orbitLines) {
    // Use requestAnimationFrame to ensure layout is complete
    requestAnimationFrame(function () {
      requestAnimationFrame(drawOrbitLines);
    });
  }

  // Send button animation
  if (launcherSend) {
    launcherSend.addEventListener('click', function () {
      if (selectedModels.size === 0 || launcherSend.classList.contains('sending') || !orbitContainer || !orbitLines) return;

      launcherSend.setAttribute('aria-label', 'Launching selected models');
      if (prefersReducedMotion) {
        // For reduced motion, just show a brief state change
        launcherSend.classList.add('sending');
        setTimeout(function () {
          launcherSend.classList.remove('sending');
          launcherSend.removeAttribute('aria-label');
        }, 800);
        return;
      }

      launcherSend.classList.add('sending');

      // Activate orbit lines
      if (orbitContainer) {
        orbitContainer.classList.add('active');
      }

      // Pulse each selected node in sequence
      const nodes = orbitContainer.querySelectorAll('.orbit-node');
      let delay = 0;
      nodes.forEach(function (node) {
        const modelId = node.dataset.model;
        if (!selectedModels.has(modelId)) return;

        setTimeout(function () {
          node.classList.add('pulse');
          // Highlight the corresponding line
          const line = orbitLines.querySelector('line[data-model="' + modelId + '"]');
          if (line) {
            line.style.opacity = '1';
            line.style.strokeWidth = '2.5';
          }
        }, delay);
        delay += 120;

        setTimeout(function () {
          node.classList.remove('pulse');
          const line = orbitLines.querySelector('line[data-model="' + modelId + '"]');
          if (line) {
            line.style.opacity = '';
            line.style.strokeWidth = '';
          }
        }, delay + 600);
      });

      // Reset after animation
      setTimeout(function () {
        launcherSend.classList.remove('sending');
        launcherSend.removeAttribute('aria-label');
        if (orbitContainer) {
          orbitContainer.classList.remove('active');
        }
      }, delay + 800);
    });
  }

  updateSendCount();
  updateLauncherCounter();

  // --- GitHub Stars API ---
  const githubStarText = document.getElementById('github-star-text');
  const githubStarLink = document.getElementById('github-star-link');

  function showLoading() {
    if (githubStarText) {
      const loadingIndicator = document.createElement('span');
      loadingIndicator.className = 'github-stat-loading';
      githubStarText.replaceChildren(loadingIndicator);
    }
  }

  function showStars(count) {
    if (githubStarText) {
      const countElement = document.createElement('span');
      countElement.className = 'github-stat-count';
      countElement.textContent = formatNumber(count);
      githubStarText.replaceChildren(countElement, document.createTextNode(' stars'));
    }
  }

  function showFallback() {
    if (githubStarText) {
      githubStarText.textContent = 'Star on GitHub';
    }
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return String(num);
  }

  async function fetchGitHubStats() {
    showLoading();

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
        showStars(data.stargazers_count);
      } else {
        showFallback();
      }
    } catch (err) {
      // Graceful degradation: show generic text, no fake data
      showFallback();
    }
  }

  // Fetch GitHub stats on load (with slight delay to prioritize above-fold)
  if (githubStarText) {
    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchGitHubStats, { timeout: 3000 });
    } else {
      setTimeout(fetchGitHubStats, 500);
    }
  }

  // --- Scroll Reveal Animation ---
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = [
      '.feature-card',
      '.model-card',
      '.usecase-card',
      '.step',
      '.popup-mockup',
      '.privacy-card'
    ];

    const selector = revealTargets.join(', ');
    const elements = document.querySelectorAll(selector);

    elements.forEach(function (el) {
      el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add slight stagger for grouped elements
          const target = entry.target;
          const siblings = target.parentElement ? target.parentElement.children : [];
          let index = 0;
          for (var i = 0; i < siblings.length; i++) {
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
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // --- How it works preview highlight ---
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
    ['mouseenter', 'focus'].forEach(function (eventName) {
      step.addEventListener(eventName, function () { highlightStep(step.dataset.step); });
    });
  });

  highlightStep('1');

})();
