/**
 * search.js
 * Client-side full-text search over all sections on the current page.
 * Indexes: section title, chapter label, paragraph text.
 * Opens/closes with Cmd/Ctrl+K or the search button.
 */
(function () {
  'use strict';

  let index = [];
  let currentFocus = -1;

  document.addEventListener('DOMContentLoaded', () => {
    buildIndex();
    bindUI();
  });

  // ── Build index from DOM ──
  function buildIndex() {
    index = [];
    // Index every section that has a data-section-id
    document.querySelectorAll('[data-section-id]').forEach(section => {
      const id       = section.dataset.sectionId;
      const label    = (section.querySelector('.chapter-label') || {}).textContent || '';
      const title    = (section.querySelector('h1,h2') || {}).textContent || '';
      const paras    = Array.from(section.querySelectorAll('p,li,td'))
                            .map(el => el.textContent.trim())
                            .filter(Boolean)
                            .join(' ')
                            .replace(/\s+/g, ' ')
                            .slice(0, 600);

      index.push({ id, label: label.replace(/\s+/g,' ').trim(), title: title.trim(), body: paras });
    });
  }

  // ── Bind UI elements ──
  function bindUI() {
    const overlay    = document.getElementById('search-overlay');
    const input      = document.getElementById('search-input');
    const results    = document.getElementById('search-results');
    const openBtn    = document.getElementById('search-open-btn');
    const closeBtn   = document.getElementById('search-close-btn');

    if (!overlay || !input || !results) return;

    // Open
    if (openBtn) openBtn.addEventListener('click', () => openSearch(overlay, input));
    // Keyboard shortcut
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(overlay, input); }
      if (e.key === 'Escape') closeSearch(overlay, input, results);
    });
    // Close button
    if (closeBtn) closeBtn.addEventListener('click', () => closeSearch(overlay, input, results));
    // Close on backdrop click
    overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(overlay, input, results); });

    // Search on type
    input.addEventListener('input', () => {
      currentFocus = -1;
      render(input.value.trim(), results);
    });

    // Arrow key navigation
    input.addEventListener('keydown', e => {
      const items = results.querySelectorAll('.search-result-item');
      if (e.key === 'ArrowDown') { currentFocus = Math.min(currentFocus + 1, items.length - 1); focusItem(items); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { currentFocus = Math.max(currentFocus - 1, 0); focusItem(items); e.preventDefault(); }
      else if (e.key === 'Enter') { if (currentFocus >= 0 && items[currentFocus]) items[currentFocus].click(); }
    });
  }

  function openSearch(overlay, input) {
    buildIndex(); // refresh in case content changed
    overlay.classList.add('open');
    setTimeout(() => input.focus(), 50);
  }
  function closeSearch(overlay, input, results) {
    overlay.classList.remove('open');
    input.value = '';
    results.innerHTML = '';
    currentFocus = -1;
  }

  // ── Render results ──
  function render(query, container) {
    if (!query) { container.innerHTML = ''; return; }

    const q = query.toLowerCase();
    const matches = index
      .map(item => {
        const titleScore = item.title.toLowerCase().includes(q) ? 10 : 0;
        const labelScore = item.label.toLowerCase().includes(q) ? 4 : 0;
        const bodyScore  = item.body.toLowerCase().includes(q) ? 2 : 0;
        return { ...item, score: titleScore + labelScore + bodyScore };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    if (!matches.length) {
      container.innerHTML = `<div class="search-empty">No results for "<strong style="color:#888">${escHtml(query)}</strong>"</div>`;
      return;
    }

    container.innerHTML = matches.map(item => {
      const snippet = highlight(getSnippet(item.body, q), q);
      const titleHL = highlight(escHtml(item.title), q);
      const href = item.id === 'hero' ? '#hero' : `#${item.id}`;
      return `
        <a class="search-result-item" href="${href}" data-id="${item.id}">
          <div class="result-chapter">${escHtml(item.label)}</div>
          <div class="result-title">${titleHL}</div>
          ${snippet ? `<div class="result-snippet">${snippet}</div>` : ''}
        </a>`;
    }).join('');

    // Close overlay on result click
    container.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const overlay = document.getElementById('search-overlay');
        const input   = document.getElementById('search-input');
        if (overlay) { overlay.classList.remove('open'); if (input) input.value = ''; container.innerHTML = ''; }
      });
    });
  }

  function getSnippet(body, q) {
    const i = body.toLowerCase().indexOf(q);
    if (i === -1) return body.slice(0, 120);
    const start = Math.max(0, i - 60);
    const end   = Math.min(body.length, i + q.length + 80);
    return (start > 0 ? '…' : '') + body.slice(start, end) + (end < body.length ? '…' : '');
  }

  function highlight(text, q) {
    if (!q) return text;
    const re = new RegExp(`(${escRe(q)})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
  }

  function focusItem(items) {
    items.forEach((el, i) => { el.classList.toggle('focused', i === currentFocus); if (i === currentFocus) el.focus(); });
  }

  function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
})();
