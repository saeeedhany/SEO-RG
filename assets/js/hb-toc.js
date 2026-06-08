/**
 * hb-toc.js — Handbook right TOC active tracking.
 * Highlights the current section in the right rail TOC as you scroll.
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.hb-toc-item[data-toc-id]');
    if (!items.length) return;

    const map = {};
    items.forEach(item => { map[item.dataset.tocId] = item; });

    const sections = document.querySelectorAll('[data-section-id]');
    if (!sections.length) return;

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.dataset.sectionId;
        items.forEach(i => i.classList.remove('active'));
        if (map[id]) {
          map[id].classList.add('active');
          map[id].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-56px 0px -55% 0px', threshold: 0 });

    sections.forEach(s => { if (map[s.dataset.sectionId]) io.observe(s); });
  });
})();
