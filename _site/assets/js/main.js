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


  /* ── CHECKLIST TOGGLE ── */
  (function initChecklists() {
    document.querySelectorAll('.checklist-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('done');
        // Persist to sessionStorage so state survives scroll
        const key = 'chk-' + item.closest('section')?.id + '-' + Array.from(item.parentElement.children).indexOf(item);
        sessionStorage.setItem(key, item.classList.contains('done') ? '1' : '0');
      });
    });

    // Restore state
    document.querySelectorAll('.checklist-item').forEach((item, i) => {
      const key = 'chk-' + item.closest('section')?.id + '-' + Array.from(item.parentElement.children).indexOf(item);
      if (sessionStorage.getItem(key) === '1') item.classList.add('done');
    });
  })();

  /* ── GLOSSARY FILTER ── */
  (function initGlossaryFilter() {
    const input = document.getElementById('gloss-search');
    if (!input) return;

    input.addEventListener('input', function () {
      const q = this.value.toLowerCase().trim();
      document.querySelectorAll('.gloss-entry').forEach(entry => {
        const term = entry.dataset.term || '';
        const def  = entry.querySelector('.gloss-def')?.textContent || '';
        const match = !q || term.includes(q) || def.toLowerCase().includes(q);
        entry.style.display = match ? '' : 'none';
      });
      // Hide empty groups
      document.querySelectorAll('.gloss-group').forEach(group => {
        const visible = group.querySelectorAll('.gloss-entry:not([style*="none"])').length;
        group.style.display = visible ? '' : 'none';
      });
    });
  })();
