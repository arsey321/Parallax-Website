/* ============================================================
   PARALLAX PARFUMS · interaction layer
   - Mode toggle (lucent ⇄ umbra) with localStorage persistence
   - Subtle parallax via requestAnimationFrame
   - Readout of scroll position as faux-coordinates
   ============================================================ */

(function () {
  'use strict';

  const html = document.documentElement;
  const toggle = document.getElementById('modeToggle');
  const coordsVal = document.getElementById('coordsVal');
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));

  /* ---------- Mode toggle ---------- */
  const STORAGE_KEY = 'parallax-mode';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'umbra' || stored === 'lucent') {
      html.setAttribute('data-mode', stored);
    }
  } catch (_) { /* localStorage may be unavailable; defaults are fine */ }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = html.getAttribute('data-mode') === 'umbra' ? 'lucent' : 'umbra';
      html.setAttribute('data-mode', next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (_) {}
    });
  }

  /* ---------- Reduced motion ---------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Parallax (cheap, GPU-friendly) ---------- */
  let lastY = 0;
  let ticking = false;

  function updateParallax() {
    const y = window.scrollY;
    for (let i = 0; i < parallaxEls.length; i++) {
      const el = parallaxEls[i];
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0;
      // Find offset within viewport to make parallax local, not cumulative
      const rect = el.getBoundingClientRect();
      // We only animate elements that are roughly on screen, to save work
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;
      const offset = (rect.top - window.innerHeight / 2) * speed;
      el.style.transform = `translate3d(0, ${(-offset).toFixed(1)}px, 0)`;
    }

    // Faux coordinates: drift longitude slightly so it feels alive
    if (coordsVal) {
      const drift = ((y % 1000) / 1000) * 0.0009;
      coordsVal.textContent = `37.3541° N / ${(121.9552 - drift).toFixed(4)}° W`;
    }

    ticking = false;
  }

  function onScroll() {
    lastY = window.scrollY;
    if (!ticking && !prefersReduced) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  if (!prefersReduced) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateParallax();
  }

  /* ---------- Reveal-on-scroll for frag cards & events ---------- */
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    document.querySelectorAll('.frag, .event, .spec').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 800ms cubic-bezier(0.2,0.7,0.2,1), transform 800ms cubic-bezier(0.2,0.7,0.2,1)';
      io.observe(el);
    });
  }

})();
