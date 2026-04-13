/**
 * pdf-reader.js v2
 * Floating reading-progress ring + PDF download with language-choice modal.
 *
 * Locked state: shows progress %, click shows tooltip with link to downloads page.
 * Unlocked (100% read): click opens language modal → window.print() → Save as PDF.
 */
(function () {
  'use strict';

  const WIDGET_HTML = `
    <div id="pdf-widget" class="pdf-widget" aria-label="Download PDF">
      <svg class="pdf-ring" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <circle class="pdf-ring-track" cx="28" cy="28" r="24"/>
        <circle class="pdf-ring-fill"  cx="28" cy="28" r="24"/>
      </svg>
      <button class="pdf-btn" id="pdf-btn" type="button">
        <svg class="pdf-icon pdf-icon-lock" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="9" width="12" height="9" rx="1.5"/><path d="M7 9V6.5a3 3 0 0 1 6 0V9"/>
        </svg>
        <svg class="pdf-icon pdf-icon-dl" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 3v9m0 0-3-3m3 3 3-3"/><path d="M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14"/>
        </svg>
        <span class="pdf-pct" id="pdf-pct">0%</span>
      </button>
      <div class="pdf-tooltip" id="pdf-tooltip" role="status" aria-live="polite">
        <p class="pdf-tooltip-text" id="pdf-tip-text">Finish reading to unlock the PDF download.</p>
        <p class="pdf-tooltip-sub" id="pdf-tip-sub">Want it now? <a id="pdf-tooltip-link" href="#">Downloads page →</a></p>
        <div class="pdf-tooltip-tail"></div>
      </div>
    </div>`;

  const MODAL_HTML = `
    <div id="pdf-lang-modal" class="pdf-modal-overlay" role="dialog" aria-modal="true">
      <div class="pdf-modal">
        <p class="pdf-modal-eyebrow">PDF Download</p>
        <h2 class="pdf-modal-title">Choose Language</h2>
        <p class="pdf-modal-sub">The handbook will open in your browser's print dialog. Select "Save as PDF" to download.</p>
        <div class="pdf-modal-langs">
          <button class="pdf-modal-lang-btn" id="pdf-pick-en">
            <span class="pdf-modal-lang-name">English</span>
            <span class="pdf-modal-lang-hint">Left-to-right</span>
          </button>
          <button class="pdf-modal-lang-btn" id="pdf-pick-ar">
            <span class="pdf-modal-lang-name">العربية</span>
            <span class="pdf-modal-lang-hint">يمين إلى يسار</span>
          </button>
        </div>
        <button class="pdf-modal-cancel" id="pdf-modal-cancel">Cancel</button>
      </div>
    </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    const downloadsHref = '/downloads/';

    document.body.insertAdjacentHTML('beforeend', WIDGET_HTML);
    document.body.insertAdjacentHTML('beforeend', MODAL_HTML);

    const widget    = document.getElementById('pdf-widget');
    const btn       = document.getElementById('pdf-btn');
    const pctEl     = document.getElementById('pdf-pct');
    const tooltip   = document.getElementById('pdf-tooltip');
    const tipText   = document.getElementById('pdf-tip-text');
    const tipSub    = document.getElementById('pdf-tip-sub');
    const modal     = document.getElementById('pdf-lang-modal');
    const pickEn    = document.getElementById('pdf-pick-en');
    const pickAr    = document.getElementById('pdf-pick-ar');
    const cancelBtn = document.getElementById('pdf-modal-cancel');

    // Wire downloads link in tooltip
    const tipLink = document.getElementById('pdf-tooltip-link');
    if (tipLink) tipLink.href = downloadsHref;

    // Update tooltip text on language change
    function updateTooltipLang() {
      const lang = (window.I18n && window.I18n.current) || 'en';
      if (lang === 'ar') {
        if (tipText) tipText.textContent = 'أكمل القراءة لفتح تنزيل PDF.';
        if (tipSub)  tipSub.innerHTML = 'تريده الآن؟ <a id="pdf-tooltip-link" href="' + downloadsHref + '">صفحة التنزيلات ←</a>';
      } else {
        if (tipText) tipText.textContent = 'Finish reading to unlock the PDF download.';
        if (tipSub)  tipSub.innerHTML = 'Want it now? <a id="pdf-tooltip-link" href="' + downloadsHref + '">Downloads page →</a>';
      }
    }
    window.addEventListener('langchange', updateTooltipLang);

    // Ring geometry
    const ringFill = widget.querySelector('.pdf-ring-fill');
    const CIRCUM   = 2 * Math.PI * 24;
    ringFill.style.strokeDasharray  = CIRCUM;
    ringFill.style.strokeDashoffset = CIRCUM;

    let progress = 0, unlocked = false, tooltipOpen = false, shown = false, rafId = null;

    function calcProgress() {
      const footer   = document.querySelector('footer');
      const scrollTop = window.scrollY;
      const winH     = window.innerHeight;
      const endY = footer ? footer.getBoundingClientRect().top + scrollTop - winH
                          : document.documentElement.scrollHeight - winH;
      const raw = Math.max(0, Math.min(1, (scrollTop - winH * 0.3) / Math.max(1, endY - winH * 0.3)));
      return Math.round(raw * 100);
    }

    function updateRing(pct) { ringFill.style.strokeDashoffset = CIRCUM * (1 - pct / 100); }

    function setUnlocked() {
      if (unlocked) return;
      unlocked = true;
      widget.classList.add('pdf-unlocked');
      pctEl.textContent = '';
      btn.setAttribute('aria-label', 'Download PDF');
    }

    function onScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        progress = calcProgress();
        if (!shown && window.scrollY > 80) { shown = true; widget.classList.add('pdf-visible'); }
        pctEl.textContent = unlocked ? '' : `${progress}%`;
        updateRing(progress);
        if (progress >= 100 && !unlocked) setUnlocked();
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Locked click → tooltip
    btn.addEventListener('click', () => {
      if (unlocked) { openModal(); return; }
      tooltipOpen = !tooltipOpen;
      tooltip.classList.toggle('pdf-tooltip-open', tooltipOpen);
      if (tooltipOpen) {
        clearTimeout(btn._tipTimer);
        btn._tipTimer = setTimeout(() => { tooltipOpen = false; tooltip.classList.remove('pdf-tooltip-open'); }, 4000);
      }
    });
    document.addEventListener('click', e => {
      if (tooltipOpen && !widget.contains(e.target)) { tooltipOpen = false; tooltip.classList.remove('pdf-tooltip-open'); }
    });

    // Modal
    function openModal() {
      modal.classList.add('pdf-modal-open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => pickEn && pickEn.focus(), 60);
    }
    function closeModal() { modal.classList.remove('pdf-modal-open'); document.body.style.overflow = ''; }

    function printInLang(lang) {
      closeModal();
      const current    = (window.I18n && window.I18n.current) || 'en';
      const needSwitch = lang !== current;
      function doPrint() {
        setTimeout(() => {
          window.print();
          if (needSwitch && window.I18n) setTimeout(() => window.I18n.apply(current, false), 300);
        }, needSwitch ? 350 : 80);
      }
      if (needSwitch && window.I18n) { window.I18n.apply(lang, false); doPrint(); }
      else doPrint();
    }

    if (pickEn)    pickEn.addEventListener('click',    () => printInLang('en'));
    if (pickAr)    pickAr.addEventListener('click',    () => printInLang('ar'));
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('pdf-modal-open')) closeModal();
    });
  });
})();
