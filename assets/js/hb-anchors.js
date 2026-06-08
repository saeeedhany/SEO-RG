/**
 * hb-anchors.js — Injects copyable anchor link icons on h2 inside .hb-content.
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    const content = document.querySelector('.hb-content');
    if (!content) return;

    content.querySelectorAll('section[id] h2, h2[id]').forEach(function (h2) {
      let id = h2.id;
      if (!id) { const s = h2.closest('section[id]'); if (s) id = s.id; }
      if (!id) return;

      const a = document.createElement('a');
      a.className  = 'hb-anchor-link';
      a.href       = '#' + id;
      a.title      = 'Copy link to section';
      a.setAttribute('aria-label', 'Copy link');
      a.innerHTML  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';

      a.addEventListener('click', function (e) {
        e.preventDefault();
        const url = location.origin + location.pathname + '#' + id;
        navigator.clipboard.writeText(url).catch(function () {});
        history.pushState(null, '', '#' + id);
        a.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
        setTimeout(function () {
          a.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
        }, 1800);
      });
      h2.appendChild(a);
    });
  });
})();
