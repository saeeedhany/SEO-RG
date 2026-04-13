/**
 * search.js v2
 * Global search across all handbooks and the overview.
 *
 * Features:
 *  - Static cross-page index (all sections from all pages baked in)
 *  - Live DOM index of the current page merged on top
 *  - Hot-topic suggestions shown before the user types
 *  - Bilingual: queries against both EN and AR text
 *  - Keyboard navigation (↑↓ Enter Escape)
 *  - Ctrl/Cmd+K shortcut
 */
(function () {
  'use strict';

  /* ── Global index — root-relative hrefs ── */
  const GLOBAL_INDEX = [
    { id:'what-is-seo',      href:'/#what-is-seo',      label:'Section 01', title:'What is SEO?',                    title_ar:'ما هو السيو؟',              body:'Search engine optimization ranking Google crawl index algorithm',          body_ar:'تحسين محركات البحث جوجل ترتيب فهرسة', tags:['basics'] },
    { id:'why-it-matters',   href:'/#why-it-matters',   label:'Section 02', title:'Why SEO Matters',                  title_ar:'لماذا يهم السيو',           body:'organic traffic ROI business revenue leads conversions',                   body_ar:'حركة مرور عضوية إيرادات تحويلات', tags:['basics','business'] },
    { id:'pillars',          href:'/#pillars',          label:'Section 03', title:'The 4 Pillars of SEO',             title_ar:'الأركان الأربعة للسيو',     body:'technical content authority experience on-page off-page',                  body_ar:'تقني محتوى سلطة تجربة', tags:['basics'] },
    { id:'how-google-works', href:'/#how-google-works', label:'Section 04', title:'How Google Works',                 title_ar:'كيف يعمل جوجل',            body:'crawl render index PageRank algorithm Googlebot',                           body_ar:'زحف عرض فهرسة خوارزمية جوجل', tags:['technical','google'] },
    { id:'ranking-factors',  href:'/#ranking-factors',  label:'Section 05', title:'Ranking Factors',                  title_ar:'عوامل الترتيب',            body:'backlinks content speed mobile Core Web Vitals E-E-A-T',                   body_ar:'روابط خلفية محتوى سرعة جوال', tags:['ranking'] },
    { id:'roadmap',          href:'/#roadmap',          label:'Section 06', title:'SEO Learning Roadmap',             title_ar:'خارطة طريق السيو',         body:'learning roadmap beginner intermediate advanced steps order',              body_ar:'خارطة طريق تعلم', tags:['learning'] },
    { id:'handbooks',        href:'/#handbooks',        label:'Section 07', title:'Specialist Handbooks',             title_ar:'الأدلة المتخصصة',          body:'handbooks guides content technical link building local SEO',                body_ar:'أدلة محتوى تقني بناء روابط', tags:['handbooks'] },

    { id:'cw-ch01', href:'/chapters/content-writing/#ch01', label:'CW · Ch 01', title:'What is SEO? — Writer Perspective', title_ar:'ما هو السيو من منظور الكاتب', body:'writer perspective content SEO on-page off-page technical',               body_ar:'منظور الكاتب كتابة المحتوى', tags:['content','writing'] },
    { id:'cw-ch02', href:'/chapters/content-writing/#ch02', label:'CW · Ch 02', title:"Content Writer's Role",             title_ar:'دور كاتب المحتوى',           body:'writer role discoverability clickability convertibility CTR',              body_ar:'دور الكاتب قابلية الاكتشاف', tags:['content','writing'] },
    { id:'cw-ch03', href:'/chapters/content-writing/#ch03', label:'CW · Ch 03', title:'Keyword Research for Writers',      title_ar:'بحث الكلمات المفتاحية',      body:'keyword research head term long tail LSI semantic volume difficulty',      body_ar:'بحث الكلمات المفتاحية حجم صعوبة', tags:['keywords'] },
    { id:'cw-ch04', href:'/chapters/content-writing/#ch04', label:'CW · Ch 04', title:'Search Intent',                    title_ar:'نية البحث',                  body:'search intent informational navigational transactional commercial',        body_ar:'نية البحث معلوماتية تجارية', tags:['intent'] },
    { id:'cw-ch05', href:'/chapters/content-writing/#ch05', label:'CW · Ch 05', title:'Product Description Structure',    title_ar:'هيكل وصف المنتج',            body:'structure hook features benefits CTA heading H1 H2 format',              body_ar:'هيكل خطاف مزايا فوائد', tags:['content','structure'] },
    { id:'cw-ch06', href:'/chapters/content-writing/#ch06', label:'CW · Ch 06', title:'Writing the Title Tag',            title_ar:'كتابة وسم العنوان',          body:'title tag 60 characters keyword brand SERP click-through',                body_ar:'وسم العنوان حروف كلمة مفتاحية', tags:['title','on-page'] },
    { id:'cw-ch07', href:'/chapters/content-writing/#ch07', label:'CW · Ch 07', title:'Meta Description Mastery',         title_ar:'إتقان الوصف التعريفي',       body:'meta description 160 characters CTA value proposition click',             body_ar:'الوصف التعريفي حروف دعوة للعمل', tags:['meta','on-page'] },
    { id:'cw-ch08', href:'/chapters/content-writing/#ch08', label:'CW · Ch 08', title:'Body Copy Rules',                  title_ar:'قواعد نص المحتوى',           body:'body copy persuasion customer-first sensory proof objection CTA',         body_ar:'نص المحتوى إقناع', tags:['content'] },
    { id:'cw-ch09', href:'/chapters/content-writing/#ch09', label:'CW · Ch 09', title:'Tone, Voice & Readability',        title_ar:'الأسلوب والصوت',             body:'tone voice brand readability Flesch luxury B2B DTC audience',            body_ar:'أسلوب صوت العلامة التجارية', tags:['content','tone'] },
    { id:'cw-ch10', href:'/chapters/content-writing/#ch10', label:'CW · Ch 10', title:'Common Mistakes to Avoid',         title_ar:'الأخطاء الشائعة',            body:'mistakes duplicate keyword stuffing mobile alt text CTA internal links',  body_ar:'أخطاء محتوى مكرر حشو كلمات', tags:['mistakes'] },
    { id:'cw-ch11', href:'/chapters/content-writing/#ch11', label:'CW · Ch 11', title:'Final Publishing Checklist',       title_ar:'قائمة التحقق النهائية',      body:'checklist publish title meta H1 duplicate schema readability CTA',        body_ar:'قائمة تحقق نشر', tags:['checklist'] },

    { id:'ts-ch01', href:'/chapters/technical-seo/#ch01', label:'Tech · Ch 01', title:'How Google Crawls and Indexes',  title_ar:'كيف يزحف جوجل',         body:'crawl render index pipeline Googlebot HTML JavaScript',                    body_ar:'زحف عرض فهرسة جوجل', tags:['technical','crawl'] },
    { id:'ts-ch02', href:'/chapters/technical-seo/#ch02', label:'Tech · Ch 02', title:'Crawl Budget',                  title_ar:'ميزانية الزحف',         body:'crawl budget rate limit demand faceted navigation session IDs',            body_ar:'ميزانية الزحف تصفح صفحات', tags:['technical','crawl'] },
    { id:'ts-ch03', href:'/chapters/technical-seo/#ch03', label:'Tech · Ch 03', title:'Site Architecture',             title_ar:'هيكل الموقع',           body:'site architecture silo internal links breadcrumbs orphan sitemap',         body_ar:'هيكل الموقع روابط داخلية', tags:['technical'] },
    { id:'ts-ch04', href:'/chapters/technical-seo/#ch04', label:'Tech · Ch 04', title:'Core Web Vitals',               title_ar:'مؤشرات الويب الأساسية', body:'Core Web Vitals LCP INP CLS PageSpeed performance page experience',        body_ar:'مؤشرات ويب LCP INP CLS سرعة', tags:['technical','cwv'] },
    { id:'ts-ch05', href:'/chapters/technical-seo/#ch05', label:'Tech · Ch 05', title:'Mobile-First Indexing',         title_ar:'الفهرسة المحمولة',      body:'mobile-first indexing responsive design viewport tap target font',        body_ar:'فهرسة محمول تصميم متجاوب', tags:['technical','mobile'] },
    { id:'ts-ch06', href:'/chapters/technical-seo/#ch06', label:'Tech · Ch 06', title:'Structured Data & Schema',      title_ar:'البيانات المنظمة',       body:'structured data schema JSON-LD rich results Product FAQ HowTo',           body_ar:'بيانات منظمة مخطط نتائج', tags:['technical','schema'] },
    { id:'ts-ch07', href:'/chapters/technical-seo/#ch07', label:'Tech · Ch 07', title:'JavaScript SEO',                title_ar:'سيو جافاسكريبت',        body:'JavaScript SEO client-side server-side rendering SSR SSG SPA',            body_ar:'جافاسكريبت سيو تصيير', tags:['technical'] },
    { id:'ts-ch08', href:'/chapters/technical-seo/#ch08', label:'Tech · Ch 08', title:'Canonicalisation',              title_ar:'الكانونيكال',           body:'canonical tag duplicate content self-referencing HTTPS www slash',        body_ar:'كانونيكال محتوى مكرر', tags:['technical'] },
    { id:'ts-ch09', href:'/chapters/technical-seo/#ch09', label:'Tech · Ch 09', title:'Redirects & Hreflang',          title_ar:'إعادة التوجيه',         body:'redirect 301 302 410 hreflang multilingual international x-default',      body_ar:'إعادة توجيه هريفلانج', tags:['technical'] },
    { id:'ts-ch10', href:'/chapters/technical-seo/#ch10', label:'Tech · Ch 10', title:'Search Console Mastery',        title_ar:'إتقان سيرش كونسول',     body:'Search Console coverage performance URL inspection Core Web Vitals',      body_ar:'سيرش كونسول تقرير أداء', tags:['tools'] },
    { id:'ts-ch11', href:'/chapters/technical-seo/#ch11', label:'Tech · Ch 11', title:'Technical SEO Audit Checklist', title_ar:'قائمة التدقيق التقني',  body:'audit checklist crawl architecture performance Core Web Vitals schema',   body_ar:'قائمة تدقيق تقني', tags:['technical','checklist'] },

    { id:'lb-ch01', href:'/chapters/link-building/#ch01', label:'Links · Ch 01', title:'Why Backlinks Matter',          title_ar:'لماذا تهم الروابط',     body:'backlinks PageRank authority trust E-E-A-T link equity ranking',          body_ar:'روابط خلفية سلطة ثقة ترتيب', tags:['links'] },
    { id:'lb-ch02', href:'/chapters/link-building/#ch02', label:'Links · Ch 02', title:'Anatomy of a Valuable Link',   title_ar:'تشريح الرابط القيم',    body:'domain authority relevance anchor text dofollow nofollow placement',      body_ar:'سلطة النطاق نص الربط', tags:['links'] },
    { id:'lb-ch03', href:'/chapters/link-building/#ch03', label:'Links · Ch 03', title:'Link-Worthy Content',          title_ar:'محتوى يستحق الربط',     body:'linkable asset original research data guide tools infographic',           body_ar:'أصول قابلة للربط بحث أصلي', tags:['links','content'] },
    { id:'lb-ch04', href:'/chapters/link-building/#ch04', label:'Links · Ch 04', title:'Digital PR',                   title_ar:'العلاقات العامة الرقمية', body:'digital PR journalist pitch data-led story HARO reactive expert',        body_ar:'علاقات عامة رقمية صحفي', tags:['links','pr'] },
    { id:'lb-ch05', href:'/chapters/link-building/#ch05', label:'Links · Ch 05', title:'Guest Posting',                title_ar:'التدوين كضيف',           body:'guest post byline editorial white hat placement traffic authority',        body_ar:'تدوين كضيف سلطة', tags:['links'] },
    { id:'lb-ch06', href:'/chapters/link-building/#ch06', label:'Links · Ch 06', title:'Broken Link Building',         title_ar:'بناء الروابط المكسورة', body:'broken link building dead links Wayback Machine replacement outreach',    body_ar:'روابط مكسورة بناء', tags:['links'] },
    { id:'lb-ch07', href:'/chapters/link-building/#ch07', label:'Links · Ch 07', title:'Competitor Backlink Analysis', title_ar:'تحليل روابط المنافسين', body:'competitor backlink gap analysis Ahrefs Semrush intersect domain',        body_ar:'تحليل روابط المنافسين', tags:['links','competitor'] },
    { id:'lb-ch08', href:'/chapters/link-building/#ch08', label:'Links · Ch 08', title:'Outreach Strategy',            title_ar:'استراتيجية التواصل',    body:'outreach email personalization pitch conversion follow-up reply',          body_ar:'تواصل بريد إلكتروني', tags:['links'] },
    { id:'lb-ch09', href:'/chapters/link-building/#ch09', label:'Links · Ch 09', title:'Black Hat vs White Hat',       title_ar:'القبعة السوداء والبيضاء', body:'black hat white hat PBN paid links manual penalty scheme',               body_ar:'قبعة سوداء بيضاء عقوبة', tags:['links','ethics'] },
    { id:'lb-ch10', href:'/chapters/link-building/#ch10', label:'Links · Ch 10', title:'Toxic Link Audit & Disavow',   title_ar:'تدقيق الروابط السامة', body:'toxic link audit disavow file spam backlink profile removal',             body_ar:'روابط سامة ملف الرفض', tags:['links','toxic'] },
    { id:'lb-ch11', href:'/chapters/link-building/#ch11', label:'Links · Ch 11', title:'Measuring Link Authority',     title_ar:'قياس سلطة الروابط',    body:'domain rating DR Moz DA referring domains ranking measure',               body_ar:'تقييم النطاق سلطة قياس', tags:['links'] },

    { id:'ls-ch01', href:'/chapters/local-seo/#ch01', label:'Local · Ch 01', title:'What is Local SEO?',          title_ar:'ما هو السيو المحلي؟',   body:'local SEO proximity relevance prominence local pack maps',                 body_ar:'سيو محلي قرب صلة أهمية', tags:['local'] },
    { id:'ls-ch02', href:'/chapters/local-seo/#ch02', label:'Local · Ch 02', title:'The Local Pack',             title_ar:'حزمة الخرائط',          body:'local pack map pack 3-pack Google Maps impressions clicks',               body_ar:'حزمة محلية خرائط جوجل', tags:['local'] },
    { id:'ls-ch03', href:'/chapters/local-seo/#ch03', label:'Local · Ch 03', title:'Google Business Profile',    title_ar:'الملف التجاري على جوجل', body:'Google Business Profile GBP category photos posts Q&A services',         body_ar:'الملف التجاري جوجل فئة صور', tags:['local','gbp'] },
    { id:'ls-ch04', href:'/chapters/local-seo/#ch04', label:'Local · Ch 04', title:'NAP Consistency',            title_ar:'تناسق NAP',             body:'NAP name address phone consistency citations directories',                 body_ar:'الاسم العنوان الهاتف تناسق', tags:['local','nap'] },
    { id:'ls-ch05', href:'/chapters/local-seo/#ch05', label:'Local · Ch 05', title:'Local Citations',            title_ar:'الاستشهادات المحلية',   body:'citations directories Yelp Bing Apple Maps Yellow Pages industry',        body_ar:'استشهادات دليل محلي', tags:['local'] },
    { id:'ls-ch06', href:'/chapters/local-seo/#ch06', label:'Local · Ch 06', title:'Review Strategy',            title_ar:'استراتيجية المراجعات', body:'reviews star rating Google acquire respond reputation management',         body_ar:'مراجعات تقييم سمعة', tags:['local','reviews'] },
    { id:'ls-ch07', href:'/chapters/local-seo/#ch07', label:'Local · Ch 07', title:'Local On-Page SEO',          title_ar:'السيو المحلي في الصفحة', body:'local on-page title tag schema LocalBusiness NAP footer map',            body_ar:'سيو محلي في الصفحة مخطط', tags:['local','on-page'] },
    { id:'ls-ch08', href:'/chapters/local-seo/#ch08', label:'Local · Ch 08', title:'Near-Me Optimisation',       title_ar:'تحسين "بالقرب مني"',    body:'near me searches proximity mobile location service area',                  body_ar:'بالقرب مني بحث موقع محمول', tags:['local'] },
    { id:'ls-ch09', href:'/chapters/local-seo/#ch09', label:'Local · Ch 09', title:'Local Link Building',        title_ar:'بناء الروابط المحلية',  body:'local links sponsorship chamber of commerce local press community',        body_ar:'روابط محلية رعاية غرفة تجارة', tags:['local','links'] },
    { id:'ls-ch10', href:'/chapters/local-seo/#ch10', label:'Local · Ch 10', title:'Multi-Location SEO',         title_ar:'سيو المواقع المتعددة',  body:'multi-location GBP per location unique landing pages URL structure',       body_ar:'مواقع متعددة صفحات هيكل', tags:['local'] },
    { id:'ls-ch11', href:'/chapters/local-seo/#ch11', label:'Local · Ch 11', title:'Local SEO Audit Checklist',  title_ar:'قائمة تدقيق السيو المحلي', body:'local audit GBP NAP reviews on-page schema mobile citations',           body_ar:'تدقيق محلي تناسق مراجعات', tags:['local','checklist'] },

    { id:'qa-audits',     href:'/chapters/quick-answers/#audits',     label:'Q&A', title:'SEO Audits',                   title_ar:'تدقيق السيو',            body:'SEO audit tools Screaming Frog Search Console Ahrefs quarterly',         body_ar:'تدقيق سيو أدوات', tags:['audit','qa'] },
    { id:'qa-backlinks',  href:'/chapters/quick-answers/#backlinks',  label:'Q&A', title:'Backlinks Explained',          title_ar:'شرح الروابط الخلفية',   body:'backlinks dofollow nofollow how many toxic harm anchor text',             body_ar:'روابط خلفية ضار نص ربط', tags:['links','qa'] },
    { id:'qa-algorithms', href:'/chapters/quick-answers/#algorithms', label:'Q&A', title:'Algorithm Updates',            title_ar:'تحديثات الخوارزمية',    body:'Panda Penguin Hummingbird Core Update Helpful Content ranking drop',      body_ar:'تحديثات جوجل خوارزمية هبوط', tags:['google','qa'] },
    { id:'qa-eeat',       href:'/chapters/quick-answers/#eeat',       label:'Q&A', title:'E-E-A-T Explained',            title_ar:'شرح E-E-A-T',           body:'E-E-A-T experience expertise authority trust YMYL health finance',        body_ar:'خبرة تخصص سلطة ثقة', tags:['eeat','qa'] },
    { id:'qa-penalties',  href:'/chapters/quick-answers/#penalties',  label:'Q&A', title:'Google Penalties & Recovery',  title_ar:'عقوبات جوجل والتعافي', body:'manual action penalty algorithm drop unnatural links reconsideration',    body_ar:'عقوبة يدوية هبوط روابط', tags:['penalty','qa'] },
    { id:'qa-tools',      href:'/chapters/quick-answers/#tools',      label:'Q&A', title:'SEO Tools Comparison',         title_ar:'مقارنة أدوات السيو',   body:'Ahrefs Semrush Moz Search Console Screaming Frog BrightLocal',           body_ar:'أدوات سيو مقارنة', tags:['tools','qa'] },
    { id:'qa-ai',         href:'/chapters/quick-answers/#ai-seo',     label:'Q&A', title:'AI & SEO',                     title_ar:'الذكاء الاصطناعي والسيو', body:'AI SEO Google AI Overview SGE semantic search helpful content',         body_ar:'ذكاء اصطناعي سيو جوجل', tags:['ai','qa'] },
    { id:'qa-metrics',    href:'/chapters/quick-answers/#metrics',    label:'Q&A', title:'Key SEO Metrics',              title_ar:'مقاييس السيو الرئيسية', body:'organic sessions rankings impressions CTR referring domains DA DR CWV',   body_ar:'جلسات عضوية ترتيبات ظهور', tags:['metrics','qa'] },
    { id:'qa-myths',      href:'/chapters/quick-answers/#myths',      label:'Q&A', title:'SEO Myths Debunked',           title_ar:'خرافات السيو',          body:'myths SEO submit Google social media bounce rate GA HTTPS ranking',       body_ar:'خرافات سيو جوجل', tags:['myths','qa'] },
  ];

  const HOT_TOPICS = {
    en: [
      { label: 'Core Web Vitals',        q: 'core web vitals' },
      { label: 'Keyword Research',        q: 'keyword research' },
      { label: 'Backlinks',              q: 'backlinks' },
      { label: 'E-E-A-T',               q: 'e-e-a-t' },
      { label: 'Search Intent',          q: 'search intent' },
      { label: 'Google Business Profile', q: 'google business' },
      { label: 'Technical Audit',        q: 'audit checklist' },
      { label: 'Meta Description',       q: 'meta description' },
    ],
    ar: [
      { label: 'مؤشرات الويب',   q: 'مؤشرات الويب' },
      { label: 'كلمات مفتاحية', q: 'كلمات مفتاحية' },
      { label: 'روابط خلفية',   q: 'روابط خلفية' },
      { label: 'نية البحث',     q: 'نية البحث' },
      { label: 'الملف التجاري', q: 'الملف التجاري' },
      { label: 'تدقيق تقني',   q: 'تدقيق' },
      { label: 'وصف تعريفي',   q: 'الوصف التعريفي' },
      { label: 'عقوبات جوجل',  q: 'عقوبة' },
    ]
  };

  let localIndex   = [];
  let currentFocus = -1;

  function currentLang() {
    return (window.I18n && window.I18n.current) || document.documentElement.getAttribute('lang') || 'en';
  }

  function resolveHref(href) {
    // Jekyll uses clean URLs - hrefs are already root-relative
    return href;
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }

  function highlight(text, q) {
    if (!q) return text;
    return text.replace(new RegExp(`(${escRe(q)})`, 'gi'), '<mark>$1</mark>');
  }

  function getSnippet(body, q) {
    if (!body) return '';
    const i = body.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return body.slice(0, 110);
    const start = Math.max(0, i - 50);
    const end   = Math.min(body.length, i + q.length + 70);
    return (start > 0 ? '…' : '') + body.slice(start, end) + (end < body.length ? '…' : '');
  }

  function buildLocalIndex() {
    localIndex = [];
    document.querySelectorAll('[data-section-id]').forEach(section => {
      const id = section.dataset.sectionId;
      if (GLOBAL_INDEX.some(g => g.href && g.href.includes('#' + id))) return;
      const label = (section.querySelector('.chapter-label') || {}).textContent || '';
      const title = (section.querySelector('h1,h2') || {}).textContent || '';
      const body  = Array.from(section.querySelectorAll('p,li,td'))
        .map(el => el.textContent.trim()).filter(Boolean)
        .join(' ').replace(/\s+/g,' ').slice(0, 600);
      localIndex.push({ id, href: '#' + id, label: label.replace(/\s+/g,' ').trim(), title: title.trim(), title_ar: '', body, body_ar: '', tags: [] });
    });
  }

  function search(query) {
    const q   = query.toLowerCase().trim();
    const all = [...GLOBAL_INDEX, ...localIndex];
    return all.map(item => {
      const ts = (item.title.toLowerCase().includes(q) || (item.title_ar && item.title_ar.includes(q))) ? 14 : 0;
      const bs = (item.body.toLowerCase().includes(q)  || (item.body_ar  && item.body_ar.includes(q)))  ? 4  : 0;
      const gs = item.tags && item.tags.some(t => t.includes(q)) ? 6 : 0;
      return { ...item, score: ts + bs + gs };
    }).filter(i => i.score > 0).sort((a,b) => b.score - a.score).slice(0, 9);
  }

  function renderHotTopics(container) {
    const lang   = currentLang();
    const topics = HOT_TOPICS[lang] || HOT_TOPICS.en;
    container.innerHTML = `
      <div class="search-hot">
        <p class="search-hot-label">${lang === 'ar' ? 'مواضيع رائجة' : 'Trending Topics'}</p>
        <div class="search-hot-chips">
          ${topics.map(t => `<button class="search-chip" data-q="${escHtml(t.q)}">${escHtml(t.label)}</button>`).join('')}
        </div>
      </div>`;
    container.querySelectorAll('.search-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const input = document.getElementById('search-input');
        if (input) { input.value = chip.dataset.q; input.dispatchEvent(new Event('input')); input.focus(); }
      });
    });
  }

  function renderResults(query, container) {
    if (!query) { renderHotTopics(container); return; }
    const matches = search(query);
    const lang    = currentLang();
    if (!matches.length) {
      container.innerHTML = `<div class="search-empty">${lang === 'ar' ? `لا نتائج لـ` : `No results for`} "<strong style="color:#888">${escHtml(query)}</strong>"</div>`;
      return;
    }
    container.innerHTML = matches.map(item => {
      const titleField = (lang === 'ar' && item.title_ar) ? item.title_ar : item.title;
      const bodyField  = (lang === 'ar' && item.body_ar)  ? item.body_ar  : item.body;
      const snippet  = highlight(escHtml(getSnippet(bodyField, query)), query);
      const titleHL  = highlight(escHtml(titleField), query);
      const href     = resolveHref(item.href);
      return `<a class="search-result-item" href="${escHtml(href)}" data-id="${escHtml(item.id)}">
        <div class="result-chapter">${escHtml(item.label)}</div>
        <div class="result-title">${titleHL}</div>
        ${snippet ? `<div class="result-snippet">${snippet}</div>` : ''}
      </a>`;
    }).join('');
    container.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const overlay = document.getElementById('search-overlay');
        const input   = document.getElementById('search-input');
        if (overlay) overlay.classList.remove('open');
        if (input)   input.value = '';
        container.innerHTML = '';
        currentFocus = -1;
      });
    });
  }

  function focusItem(items) {
    items.forEach((el, i) => { el.classList.toggle('focused', i === currentFocus); if (i === currentFocus) el.focus(); });
  }

  function bindUI() {
    const overlay  = document.getElementById('search-overlay');
    const input    = document.getElementById('search-input');
    const results  = document.getElementById('search-results');
    const openBtn  = document.getElementById('search-open-btn');
    const closeBtn = document.getElementById('search-close-btn');
    if (!overlay || !input || !results) return;

    function open() {
      buildLocalIndex();
      overlay.classList.add('open');
      setTimeout(() => { input.focus(); renderHotTopics(results); }, 50);
    }
    function close() {
      overlay.classList.remove('open');
      input.value = '';
      results.innerHTML = '';
      currentFocus = -1;
    }

    if (openBtn)  openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); open(); }
      if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });
    input.addEventListener('input', () => { currentFocus = -1; renderResults(input.value.trim(), results); });
    input.addEventListener('keydown', e => {
      const items = results.querySelectorAll('.search-result-item');
      if (e.key === 'ArrowDown')  { currentFocus = Math.min(currentFocus + 1, items.length - 1); focusItem(items); e.preventDefault(); }
      else if (e.key === 'ArrowUp')   { currentFocus = Math.max(currentFocus - 1, 0); focusItem(items); e.preventDefault(); }
      else if (e.key === 'Enter')     { if (currentFocus >= 0 && items[currentFocus]) items[currentFocus].click(); }
    });
    window.addEventListener('langchange', () => {
      if (overlay.classList.contains('open') && !input.value.trim()) renderHotTopics(results);
    });
  }

  document.addEventListener('DOMContentLoaded', () => { buildLocalIndex(); bindUI(); });
})();
