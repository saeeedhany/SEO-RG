/**
 * lang-switcher.js
 * Powers the language dropdown in the nav.
 * Reads current language from <html lang=""> attribute.
 * All languages and their URLs come from _data/languages.yml
 * rendered into the DOM by _includes/lang-switcher.html.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const btn      = document.getElementById('lang-btn');
    const dropdown = document.getElementById('lang-dropdown');
    const current  = document.getElementById('lang-current');
    if (!btn || !dropdown) return;

    // Set the button label to match the current page language
    const htmlLang = document.documentElement.lang || 'en';
    const activeOption = dropdown.querySelector(`[data-lang-code="${htmlLang}"]`);
    if (activeOption && current) {
      current.textContent = activeOption.querySelector('.lang-option-short')?.textContent || htmlLang.toUpperCase();
      activeOption.setAttribute('aria-selected', 'true');
      activeOption.classList.add('lang-option--current');
    }

    // Toggle dropdown
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const open = btn.getAttribute('aria-expanded') === 'true';
      closeAll();
      if (!open) openDropdown();
    });

    // Navigate on option click
    dropdown.querySelectorAll('.lang-option').forEach(opt => {
      opt.addEventListener('click', function () {
        const url = this.dataset.langUrl;
        if (url) window.location.href = url;
      });
      // Keyboard support
      opt.setAttribute('tabindex', '0');
      opt.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const url = this.dataset.langUrl;
          if (url) window.location.href = url;
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });

    function openDropdown() {
      dropdown.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    function closeAll() {
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  }
})();
