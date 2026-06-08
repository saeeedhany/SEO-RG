/**
 * nav.js v4
 * Unified nav: sidebar toggle, active section tracking, search keyboard shortcut.
 * Works on both the main page (anchor-based) and chapter pages.
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const shell     = document.getElementById('app-shell');
    const hamburger = document.getElementById('hamburger');
    const overlay   = document.getElementById('sidebar-overlay');

    if (!shell || !hamburger) return;

    hamburger.addEventListener('click', () => toggleSidebar(shell, hamburger, overlay));
    if (overlay) overlay.addEventListener('click', () => closeSidebar(shell, hamburger, overlay));

    // Close on mobile when a sidebar link is clicked
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) closeSidebar(shell, hamburger, overlay);
      });
    });

    // Active section tracking (for pages with data-section-id elements)
    const sections = document.querySelectorAll('[data-section-id]');
    if (sections.length) {
      const io = new IntersectionObserver(onIntersect, {
        rootMargin: '-56px 0px -50% 0px',
        threshold: 0
      });
      sections.forEach(s => io.observe(s));
    }

    // Search keyboard shortcut
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-open-btn')?.click();
      }
      if (e.key === 'Escape') {
        closeSidebar(shell, hamburger, overlay);
        closeSearch();
      }
    });

    // Search open/close
    document.getElementById('search-open-btn')?.addEventListener('click', openSearch);
    document.getElementById('search-close-btn')?.addEventListener('click', closeSearch);
    document.getElementById('search-overlay')?.addEventListener('click', function(e) {
      if (e.target === this) closeSearch();
    });
  }

  /* ── Sidebar ─────────────────────────────────────────── */
  function toggleSidebar(shell, hamburger, overlay) {
    shell.classList.contains('sidebar-open')
      ? closeSidebar(shell, hamburger, overlay)
      : openSidebar(shell, hamburger, overlay);
  }
  function openSidebar(shell, hamburger, overlay) {
    shell.classList.add('sidebar-open');
    hamburger.classList.add('active');
    if (overlay && window.innerWidth <= 900) {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  function closeSidebar(shell, hamburger, overlay) {
    shell.classList.remove('sidebar-open');
    hamburger.classList.remove('active');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Active section ──────────────────────────────────── */
  function onIntersect(entries) {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.dataset.sectionId;
      document.querySelectorAll('.sidebar-link[data-section]').forEach(l => {
        l.classList.toggle('active', l.dataset.section === id);
      });
      const active = document.querySelector(`.sidebar-link[data-section="${id}"]`);
      if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }

  /* ── Search ──────────────────────────────────────────── */
  function openSearch() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    document.getElementById('search-input')?.focus();
  }
  function closeSearch() {
    document.getElementById('search-overlay')?.classList.remove('open');
  }

})();
