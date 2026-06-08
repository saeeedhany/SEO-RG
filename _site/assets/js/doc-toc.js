/**
 * doc-toc.js
 * Right-rail Table of Contents — active section tracking.
 * Highlights the current chapter in the TOC as you scroll.
 * Works with the doc.html layout only.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const tocItems = document.querySelectorAll('.doc-toc-item[data-toc-id]');
    if (!tocItems.length) return;

    // Build a map of section id → toc item
    const map = {};
    tocItems.forEach(item => {
      map[item.dataset.tocId] = item;
    });

    // Observe all sections that have a matching toc entry
    const sections = document.querySelectorAll('[data-section-id]');
    if (!sections.length) return;

    const io = new IntersectionObserver(onIntersect, {
      rootMargin: '-60px 0px -55% 0px',
      threshold: 0
    });

    sections.forEach(s => {
      if (map[s.dataset.sectionId]) io.observe(s);
    });

    function onIntersect(entries) {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.dataset.sectionId;

        // Remove active from all
        tocItems.forEach(item => item.classList.remove('active'));

        // Set active on the matching item
        if (map[id]) {
          map[id].classList.add('active');
          // Scroll the TOC to keep the active item visible
          map[id].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      });
    }
  }
})();
