/**
 * pdf-reader.js
 * Floating reading-progress + PDF download widget.
 *
 * Behaviour:
 *  - Tracks scroll progress (0–100%) through the page content
 *  - Shows an SVG ring that fills as you read
 *  - Button is locked (not clickable) until progress ≥ 100%
 *  - Locked click → shows a "smoky" tooltip with a link to the downloads page
 *  - Unlocked → triggers PDF download
 *  - Animates in after first scroll, hides near top
 */
(function () {
  'use strict';

  const WIDGET_HTML = `
    <div id="pdf-widget" class="pdf-widget" aria-label="Download PDF">
      <!-- SVG progress ring -->
      <svg class="pdf-ring" viewBox="0 0 56 56" fill="none" aria-hidden="true">
        <circle class="pdf-ring-track" cx="28" cy="28" r="24"/>
        <circle class="pdf-ring-fill"  cx="28" cy="28" r="24"/>
      </svg>

      <!-- Inner button face -->
      <button class="pdf-btn" id="pdf-btn" type="button">
        <!-- Lock icon (shown while locked) -->
        <svg class="pdf-icon pdf-icon-lock" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="9" width="12" height="9" rx="1.5"/>
          <path d="M7 9V6.5a3 3 0 0 1 6 0V9"/>
        </svg>
        <!-- Download icon (shown when unlocked) -->
        <svg class="pdf-icon pdf-icon-dl" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 3v9m0 0-3-3m3 3 3-3"/>
          <path d="M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14"/>
        </svg>
        <!-- Percent label -->
        <span class="pdf-pct" id="pdf-pct">0%</span>
      </button>

      <!-- Tooltip bubble (shown on locked click) -->
      <div class="pdf-tooltip" id="pdf-tooltip" role="status" aria-live="polite">
        <p class="pdf-tooltip-text">Finish reading to unlock the PDF download.</p>
        <p class="pdf-tooltip-sub">Want it now? All PDFs are on the <a id="pdf-tooltip-link" href="#">Downloads page →</a></p>
        <div class="pdf-tooltip-tail"></div>
      </div>
    </div>
  `;

  document.addEventListener('DOMContentLoaded', () => {
    // Resolve paths: chapters live one folder deep, index is at root
    const isChapter = window.location.pathname.includes('/chapters/');
    const downloadsHref = isChapter ? '../downloads.html' : 'downloads.html';
    const pdfHref      = document.documentElement.dataset.pdfHref || null;

    // Inject widget
    document.body.insertAdjacentHTML('beforeend', WIDGET_HTML);

    const widget   = document.getElementById('pdf-widget');
    const btn      = document.getElementById('pdf-btn');
    const pctEl    = document.getElementById('pdf-pct');
    const tooltip  = document.getElementById('pdf-tooltip');
    const tipLink  = document.getElementById('pdf-tooltip-link');

    // Wire downloads link
    if (tipLink) tipLink.href = downloadsHref;

    // Ring geometry
    const ringFill = widget.querySelector('.pdf-ring-fill');
    const R        = 24;
    const CIRCUM   = 2 * Math.PI * R;
    ringFill.style.strokeDasharray  = CIRCUM;
    ringFill.style.strokeDashoffset = CIRCUM; // starts empty

    let progress    = 0;
    let unlocked    = false;
    let tooltipOpen = false;
    let shown       = false;
    let rafId       = null;

    // ── Scroll tracking ──
    function calcProgress() {
      const main = document.querySelector('.main-content') || document.body;
      const footer = document.querySelector('footer');

      const scrollTop  = window.scrollY;
      const winH       = window.innerHeight;

      // End point: top of footer (so 100% when footer enters view)
      const endY = footer
        ? footer.getBoundingClientRect().top + scrollTop - winH
        : document.documentElement.scrollHeight - winH;

      // Start point: just past the hero / first section
      const startY = winH * 0.3;

      const raw = Math.max(0, Math.min(1, (scrollTop - startY) / Math.max(1, endY - startY)));
      return Math.round(raw * 100);
    }

    function updateRing(pct) {
      const offset = CIRCUM * (1 - pct / 100);
      ringFill.style.strokeDashoffset = offset;
    }

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

        // Show widget after first meaningful scroll
        if (!shown && window.scrollY > 80) {
          shown = true;
          widget.classList.add('pdf-visible');
        }

        pctEl.textContent = unlocked ? '' : `${progress}%`;
        updateRing(progress);

        if (progress >= 100 && !unlocked) setUnlocked();

        // Hide tooltip if user scrolled (implicit dismiss)
        if (tooltipOpen && window.scrollY > 0) {
          // only close if they actually moved
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial state

    // ── Button click ──
    btn.addEventListener('click', () => {
      if (unlocked) {
        // Download
        if (pdfHref) {
          const a = document.createElement('a');
          a.href     = pdfHref;
          a.download = '';
          a.click();
        } else {
          // No PDF yet — go to downloads page
          window.location.href = downloadsHref;
        }
        return;
      }

      // Locked: show tooltip
      tooltipOpen = !tooltipOpen;
      tooltip.classList.toggle('pdf-tooltip-open', tooltipOpen);

      if (tooltipOpen) {
        // Auto-dismiss after 4s
        clearTimeout(btn._tipTimer);
        btn._tipTimer = setTimeout(() => {
          tooltipOpen = false;
          tooltip.classList.remove('pdf-tooltip-open');
        }, 4000);
      }
    });

    // Close tooltip on outside click
    document.addEventListener('click', e => {
      if (tooltipOpen && !widget.contains(e.target)) {
        tooltipOpen = false;
        tooltip.classList.remove('pdf-tooltip-open');
      }
    });
  });
})();
