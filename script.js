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

  const GITHUB_API_URL = 'https://api.github.com/repos/kyreemeng/ModelAny';
  const GITHUB_REPO_URL = 'https://github.com/kyreemeng/ModelAny';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Mobile Menu Toggle ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
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
  const sendCount = document.getElementById('send-count');
  const orbitContainer = document.getElementById('orbit-container');
  const orbitLines = document.getElementById('orbit-lines');

  // Track selected models
  const selectedModels = new Set(MODELS.map(function (m) { return m.id; }));

  // Update send button count
  function updateSendCount() {
    if (sendCount) {
      sendCount.textContent = String(selectedModels.size);
    }
    if (launcherSend) {
      launcherSend.disabled = selectedModels.size === 0;
    }
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
        updateSendCount();
      });
    });
  }

  // Draw orbit lines from center to each node
  function drawOrbitLines() {
    if (!orbitLines || !orbitContainer) return;

    // Define gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML =
      '<linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">' +
        '<stop offset="0%" stop-color="#6D5DFB" stop-opacity="0.8"/>' +
        '<stop offset="100%" stop-color="#55B8FF" stop-opacity="0.4"/>' +
      '</linearGradient>';
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
        // Clear all lines except defs
        const lines = orbitLines.querySelectorAll('line');
        lines.forEach(function (l) { l.remove(); });
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
      if (selectedModels.size === 0 || launcherSend.classList.contains('sending')) return;

      if (prefersReducedMotion) {
        // For reduced motion, just show a brief state change
        launcherSend.classList.add('sending');
        setTimeout(function () {
          launcherSend.classList.remove('sending');
        }, 800);
        return;
      }

      launcherSend.classList.add('sending');
      var originalText = launcherSend.innerHTML;
      launcherSend.innerHTML = 'Launching...';

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
        launcherSend.innerHTML = originalText;
        if (orbitContainer) {
          orbitContainer.classList.remove('active');
        }
      }, delay + 800);
    });
  }

  updateSendCount();

  // --- GitHub Stars API ---
  const githubStarText = document.getElementById('github-star-text');
  const githubStarLink = document.getElementById('github-star-link');

  function showLoading() {
    if (githubStarText) {
      githubStarText.innerHTML = '<span class="github-stat-loading"></span>';
    }
  }

  function showStars(count) {
    if (githubStarText) {
      githubStarText.innerHTML = '<span class="github-stat-count">' + escapeHtml(formatNumber(count)) + '</span> stars';
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

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
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

})();
