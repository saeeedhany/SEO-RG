/**
 * nav.js v3
 * Desktop: sidebar collapses to numbers, hamburger toggles expansion
 * Mobile: sidebar is a drawer
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const shell     = document.getElementById('app-shell');
    const hamburger = document.getElementById('hamburger');
    const overlay   = document.getElementById('sidebar-overlay');
    const langBtn   = document.getElementById('lang-toggle-btn');
    if (!shell || !hamburger) return;

    hamburger.addEventListener('click', () => toggleSidebar(shell, hamburger, overlay));
    if (overlay) overlay.addEventListener('click', () => closeSidebar(shell, hamburger, overlay));

    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 900) closeSidebar(shell, hamburger, overlay);
      });
    });

    // Active section tracking
    const sections = document.querySelectorAll('[data-section-id]');
    if (sections.length) {
      const io = new IntersectionObserver(onIntersect, { rootMargin: '-56px 0px -50% 0px', threshold: 0 });
      sections.forEach(s => io.observe(s));
    }

    if (langBtn) langBtn.addEventListener('click', () => window.I18n && window.I18n.toggle());
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(shell, hamburger, overlay); });
  }

  function toggleSidebar(shell, hamburger, overlay) {
    shell.classList.contains('sidebar-open')
      ? closeSidebar(shell, hamburger, overlay)
      : openSidebar(shell, hamburger, overlay);
  }
  function openSidebar(shell, hamburger, overlay) {
    shell.classList.add('sidebar-open');
    hamburger.classList.add('active');
    if (overlay && window.innerWidth <= 900) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  }
  function closeSidebar(shell, hamburger, overlay) {
    shell.classList.remove('sidebar-open');
    hamburger.classList.remove('active');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  function onIntersect(entries) {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.dataset.sectionId;
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('active', l.dataset.section === id));
      const a = document.querySelector(`.sidebar-link[data-section="${id}"]`);
      if (a) a.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }
})();
