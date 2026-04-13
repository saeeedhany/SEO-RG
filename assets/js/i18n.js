/**
 * i18n.js
 * Language switching engine.
 * Reads data-i18n attributes and replaces text with current locale.
 *
 * Usage:
 *   <span data-i18n="navTitle">SEO Reference Guide</span>
 *   <html dir="ltr" lang="en">
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'seo-guide-lang';
  const DEFAULT_LANG = 'en';

  window.I18n = {
    current: DEFAULT_LANG,

    init() {
      const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
      this.apply(saved, false);
    },

    apply(lang, animate = true) {
      const T = window.TRANSLATIONS[lang];
      if (!T) return;

      this.current = lang;
      localStorage.setItem(STORAGE_KEY, lang);

      // Direction & lang attr
      document.documentElement.setAttribute('dir', T.dir);
      document.documentElement.setAttribute('lang', lang);

      // Font class
      document.body.classList.remove('font-latin', 'font-arabic');
      document.body.classList.add(T.fontClass);

      // Apply all keyed strings
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (T[key] !== undefined) el.textContent = T[key];
      });

      // Apply HTML-containing strings (data-i18n-html)
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (T[key] !== undefined) el.innerHTML = T[key];
      });

      // Update lang toggle button label
      const btn = document.getElementById('lang-toggle-btn');
      if (btn) btn.textContent = T.langToggle;

      // Fade animation
      if (animate) {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity .2s';
        requestAnimationFrame(() => {
          setTimeout(() => {
            document.body.style.opacity = '1';
          }, 200);
        });
      }

      // Dispatch event so other modules can react
      window.dispatchEvent(new CustomEvent('langchange', { detail: { lang, T } }));
    },

    toggle() {
      const next = this.current === 'en' ? 'ar' : 'en';
      this.apply(next, true);
    }
  };

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.I18n.init());
  } else {
    window.I18n.init();
  }
})();
