/**
 * ModelAny — GSAP motion layer
 * Hero timeline, ScrollTrigger batch reveals, orbit launch, ambient blobs.
 * Loaded after gsap + ScrollTrigger; falls back gracefully if missing.
 */
(function () {
  'use strict';

  if (!window.gsap) return;
  if (document.documentElement.classList.contains('motion-fallback')) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  gsap.defaults({ ease: 'power3.out', duration: 0.65 });

  document.documentElement.classList.add('gsap-ready');

  var mm = gsap.matchMedia();

  mm.add(
    {
      isDesktop: '(min-width: 900px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
      motionOk: '(prefers-reduced-motion: no-preference)'
    },
    function (context) {
      var reduceMotion = context.conditions.reduceMotion;
      var isDesktop = context.conditions.isDesktop;

      if (reduceMotion) {
        gsap.set('.hero-content > *, .hero-visual, [data-reveal]', {
          clearProps: 'all'
        });
        return;
      }

      initHeroEntrance(isDesktop);
      initAmbientBlobs(isDesktop);
      initScrollReveals();
      initSectionHeaders();

      return function () {
        /* matchMedia auto-reverts tweens/ScrollTriggers created here */
      };
    }
  );

  // FAQ is outside matchMedia so open/close tweens aren't wiped on breakpoint changes
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initFaqAccordion();
  }

  window.ModelAnyMotion = {
    playOrbitLaunch: playOrbitLaunch,
    revert: function () {
      mm.revert();
    }
  };

  function initHeroEntrance(isDesktop) {
    var heroItems = gsap.utils.toArray('.hero-content > *');
    var heroVisual = document.querySelector('.hero-visual');

    if (!heroItems.length && !heroVisual) return;

    var tl = gsap.timeline({
      defaults: { ease: 'power3.out', duration: 0.7 }
    });

    if (heroItems.length) {
      gsap.set(heroItems, { y: 28, autoAlpha: 0 });
      tl.to(heroItems, { y: 0, autoAlpha: 1, stagger: 0.08 }, 0);
    }

    if (heroVisual) {
      gsap.set(heroVisual, {
        y: isDesktop ? 36 : 24,
        autoAlpha: 0,
        scale: 0.97
      });
      tl.to(
        heroVisual,
        { y: 0, autoAlpha: 1, scale: 1, duration: 0.9, ease: 'power3.out' },
        0.18
      );
    }
  }

  function initAmbientBlobs(isDesktop) {
    if (!isDesktop) return;

    var blobs = gsap.utils.toArray('.hero-blob');
    if (!blobs.length) return;

    blobs.forEach(function (blob, i) {
      gsap.to(blob, {
        x: i % 2 === 0 ? 24 : -18,
        y: i % 2 === 0 ? 16 : -22,
        duration: 7 + i * 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.35
      });
    });
  }

  function initScrollReveals() {
    if (!ScrollTrigger) return;

    var selector = [
      '.feature-card',
      '.model-card',
      '.usecase-card',
      '.step',
      '.popup-mockup',
      '.privacy-card',
      '.faq-list',
      '.popular-link',
      '.trust-item',
      '.seo-card',
      '.compare-card'
    ].join(', ');

    var targets = gsap.utils.toArray(selector);
    if (!targets.length) return;

    targets.forEach(function (el) {
      el.setAttribute('data-reveal', '');
    });

    gsap.set(targets, { y: 28, autoAlpha: 0 });

    ScrollTrigger.batch(targets, {
      start: 'top 92%',
      once: true,
      interval: 0.12,
      batchMax: 8,
      onEnter: function (elements) {
        gsap.to(elements, {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          ease: 'power3.out',
          stagger: { each: 0.07, from: 'start' },
          overwrite: 'auto'
        });
      }
    });
  }

  function initSectionHeaders() {
    if (!ScrollTrigger) return;

    gsap.utils.toArray('.section-header').forEach(function (header) {
      gsap.from(header, {
        y: 20,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 90%',
          once: true
        }
      });
    });
  }

  function initFaqAccordion() {
    var items = gsap.utils.toArray('details.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      if (item.dataset.faqBound === '1') return;

      var summary = item.querySelector('summary');
      var answer = item.querySelector('.faq-answer');
      if (!summary || !answer) return;

      item.dataset.faqBound = '1';
      item.classList.add('faq-gsap');

      // Start from a measured open height or collapsed
      if (item.open) {
        item.classList.add('is-open');
        gsap.set(answer, { height: 'auto' });
      } else {
        item.classList.remove('is-open');
        gsap.set(answer, { height: 0 });
      }

      summary.addEventListener('click', function (event) {
        event.preventDefault();

        var opening = !(item.classList.contains('is-open') || item.open);
        var tween = answer._faqTween;
        if (tween) tween.kill();

        if (opening) {
          item.open = true;
          item.classList.add('is-open');
          answer._faqTween = gsap.fromTo(
            answer,
            { height: 0 },
            {
              height: 'auto',
              duration: 0.42,
              ease: 'power2.out',
              overwrite: 'auto',
              onComplete: function () {
                answer._faqTween = null;
              }
            }
          );
        } else {
          answer._faqTween = gsap.to(answer, {
            height: 0,
            duration: 0.36,
            ease: 'power2.inOut',
            overwrite: 'auto',
            onComplete: function () {
              item.open = false;
              item.classList.remove('is-open');
              answer._faqTween = null;
            }
          });
        }
      });
    });
  }

  function playOrbitLaunch(orbitContainer, orbitLines, selectedModels) {
    if (!orbitContainer || !orbitLines || !selectedModels) return false;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      orbitContainer.classList.add('active');
      window.setTimeout(function () {
        orbitContainer.classList.remove('active');
      }, 400);
      return true;
    }

    var activeNodes = gsap.utils
      .toArray(orbitContainer.querySelectorAll('.orbit-node'))
      .filter(function (node) {
        return selectedModels.has(node.dataset.model);
      });

    if (!activeNodes.length) return false;

    var prev = orbitContainer._orbitTl;
    if (prev) prev.kill();

    var imgs = [];
    var lines = [];

    activeNodes.forEach(function (node) {
      var img = node.querySelector('img');
      if (img) imgs.push(img);
      var line = orbitLines.querySelector('line[data-model="' + node.dataset.model + '"]');
      if (line) lines.push(line);
    });

    var tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onStart: function () {
        orbitContainer.classList.add('active');
      },
      onComplete: function () {
        orbitContainer.classList.remove('active');
        gsap.set(imgs, { clearProps: 'transform' });
        gsap.set(activeNodes, { clearProps: 'boxShadow' });
        gsap.set(lines, { clearProps: 'opacity,visibility,strokeWidth' });
        orbitContainer._orbitTl = null;
      }
    });

    orbitContainer._orbitTl = tl;

    activeNodes.forEach(function (node, i) {
      var t = i * 0.1;
      var img = node.querySelector('img');
      var line = orbitLines.querySelector('line[data-model="' + node.dataset.model + '"]');

      if (line) {
        tl.fromTo(
          line,
          { autoAlpha: 0.15 },
          { autoAlpha: 1, duration: 0.28, attr: { 'stroke-width': 2.6 } },
          t
        );
        tl.to(
          line,
          { autoAlpha: 0.45, duration: 0.35, attr: { 'stroke-width': 1.5 }, ease: 'power2.in' },
          t + 0.4
        );
      }

      if (img) {
        tl.fromTo(
          img,
          { scale: 1 },
          { scale: 1.16, duration: 0.28, yoyo: true, repeat: 1, ease: 'power2.out' },
          t
        );
      }

      tl.fromTo(
        node,
        { boxShadow: '0 8px 24px rgba(109, 93, 251, 0.08)' },
        {
          boxShadow: '0 0 28px rgba(109, 93, 251, 0.45), 0 8px 24px rgba(109, 93, 251, 0.12)',
          duration: 0.28,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out'
        },
        t
      );
    });

    return true;
  }
})();
