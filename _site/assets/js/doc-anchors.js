/**
 * doc-anchors.js
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const content = document.querySelector('.doc-content');
    if (!content) return;

    content.querySelectorAll('h2[id], section[id] h2').forEach(h2 => {
      // Determine the anchor id
      let id = h2.id;
      if (!id) {
        const section = h2.closest('section[id]');
        if (section) id = section.id;
      }
      if (!id) return;

      const anchor = document.createElement('a');
      anchor.className = 'anchor-link';
      anchor.href = '#' + id;
      anchor.setAttribute('aria-label', 'Copy link to this section');
      anchor.title = 'Copy link';
      anchor.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;

      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const url = window.location.origin + window.location.pathname + '#' + id;
        navigator.clipboard.writeText(url).then(() => {
          anchor.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
          setTimeout(() => {
            anchor.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
          }, 1800);
        });
        // Also update the URL bar
        history.pushState(null, '', '#' + id);
      });

      h2.appendChild(anchor);
    });
  }
})();
