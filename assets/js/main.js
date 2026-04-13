/**
 * main.js
 * Handles:
 *  - Scroll reveal animations
 *  - Accordion open/close
 *  - Progress bar animation on scroll-into-view
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initReveal();
    initAccordions();
    initProgressBars();
  });

  /* ── REVEAL ON SCROLL ── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.07 });

    els.forEach(el => io.observe(el));
  }

  /* ── ACCORDIONS ── */
  function initAccordions() {
    document.querySelectorAll('.acc-trigger').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.acc-item');
        const body = item.querySelector('.acc-body');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.acc-item.open').forEach(o => {
          o.classList.remove('open');
          o.querySelector('.acc-body').style.maxHeight = '0';
        });

        // Open this one if it was closed
        if (!isOpen) {
          item.classList.add('open');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
  }

  /* ── PROGRESS BARS ── */
  function initProgressBars() {
    const bars = document.querySelectorAll('.prog-fill');
    if (!bars.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = (e.target.dataset.width || 0) + '%';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(b => io.observe(b));
  }
})();
