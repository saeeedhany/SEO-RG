/**
 * translations.js
 * Bilingual content strings — EN & AR
 * Usage: window.TRANSLATIONS[lang][key]
 *
 * To add a new language: duplicate the 'ar' block with new lang code.
 * To add a new key: add to both 'en' and 'ar' objects.
 */

window.TRANSLATIONS = {
  en: {
    dir: 'ltr',
    fontClass: 'font-latin',

    /* ── NAV ── */
    navTitle:       'SEO Reference Guide',
    langToggle:     'عربي',
    searchLabel:    'Search',

    /* ── SIDEBAR ── */
    tocLabel:       'Contents',
    chaptersLabel:  'Chapters',
    moreLabel:      'More',
    sidebarGuide:   'In This Guide',
    sidebarDeep:    'Deep Dives',

    /* ── HERO ── */
    heroEyebrow:    "Content Writer's Handbook — 11 Chapters",
    heroTitle:      "The Complete SEO Product Description Guide for",
    heroTitleEm:    "Content Writers",
    heroSub:        "Everything you need — from SEO fundamentals to a perfect product description, A to Z.",
    heroCta:        "Begin Reading",

    /* ── CHAPTER LABELS ── */
    ch01Label: 'Chapter 01',
    ch02Label: 'Chapter 02',
    ch03Label: 'Chapter 03',
    ch04Label: 'Chapter 04',
    ch05Label: 'Chapter 05',
    ch06Label: 'Chapter 06',
    ch07Label: 'Chapter 07',
    ch08Label: 'Chapter 08',
    ch09Label: 'Chapter 09',
    ch10Label: 'Chapter 10',
    ch11Label: 'Chapter 11',

    /* ── CHAPTER TITLES (sidebar) ── */
    ch01Short: 'What is SEO?',
    ch02Short: "Writer's Role",
    ch03Short: 'Keyword Research',
    ch04Short: 'Search Intent',
    ch05Short: 'Structure A–Z',
    ch06Short: 'Title Tag',
    ch07Short: 'Meta Description',
    ch08Short: 'Body Copy',
    ch09Short: 'Tone & Voice',
    ch10Short: 'Common Mistakes',
    ch11Short: 'Final Checklist',

    /* ── CHAPTER 01 ── */
    ch01Title: 'What is SEO?',
    ch01p1: 'Search Engine Optimization (SEO) is the practice of structuring and writing content so that search engines — primarily Google — can understand what your page is about and rank it prominently when users search for related terms.',
    ch01p2: 'For product description writers, SEO isn\'t about gaming algorithms. It\'s about writing clearly, accurately, and helpfully — because those are exactly the qualities modern search engines reward.',
    ch01Quote: '"Good SEO writing and good writing are converging. The best product descriptions rank well because they serve the reader first."',

    /* ── CHAPTER 02 ── */
    ch02Title: "The Content Writer's Role in SEO",
    ch02p1: "You are not an algorithm-feeder. You are a bridge between a customer's need and a product's value. SEO frameworks tell you where to place information; your craft determines how well that information converts.",
    ch02p2: "Writers contribute to three measurable outcomes: discoverability (ranking), clickability (CTR from search results), and convertibility (turning readers into buyers).",

    /* ── FOOTER ── */
    footerTitle: 'The Complete SEO Reference Guide',
    footerSub: 'A comprehensive reference — structured for clarity, written for people.',
  },

  ar: {
    dir: 'rtl',
    fontClass: 'font-arabic',

    /* ── NAV ── */
    navTitle:       'مرجع تحسين محركات البحث',
    langToggle:     'English',
    searchLabel:    'بحث',

    /* ── SIDEBAR ── */
    tocLabel:       'المحتويات',
    chaptersLabel:  'الفصول',
    moreLabel:      'المزيد',
    sidebarGuide:   'في هذا الدليل',
    sidebarDeep:    'دراسات متعمقة',

    /* ── HERO ── */
    heroEyebrow:    'دليل كتّاب المحتوى — ١١ فصلاً',
    heroTitle:      'الدليل الشامل لكتابة أوصاف المنتجات لـ',
    heroTitleEm:    'كتّاب المحتوى',
    heroSub:        'كل ما تحتاجه — من أساسيات تحسين محركات البحث إلى الوصف المثالي للمنتج، من الألف إلى الياء.',
    heroCta:        'ابدأ القراءة',

    /* ── CHAPTER LABELS ── */
    ch01Label: 'الفصل الأول',
    ch02Label: 'الفصل الثاني',
    ch03Label: 'الفصل الثالث',
    ch04Label: 'الفصل الرابع',
    ch05Label: 'الفصل الخامس',
    ch06Label: 'الفصل السادس',
    ch07Label: 'الفصل السابع',
    ch08Label: 'الفصل الثامن',
    ch09Label: 'الفصل التاسع',
    ch10Label: 'الفصل العاشر',
    ch11Label: 'الفصل الحادي عشر',

    /* ── CHAPTER TITLES (sidebar) ── */
    ch01Short: 'ما هو السيو؟',
    ch02Short: 'دور الكاتب',
    ch03Short: 'بحث الكلمات المفتاحية',
    ch04Short: 'نية البحث',
    ch05Short: 'هيكل الوصف',
    ch06Short: 'وسم العنوان',
    ch07Short: 'الوصف التعريفي',
    ch08Short: 'نص المحتوى',
    ch09Short: 'الأسلوب والصوت',
    ch10Short: 'الأخطاء الشائعة',
    ch11Short: 'قائمة التحقق النهائية',

    /* ── CHAPTER 01 ── */
    ch01Title: 'ما هو تحسين محركات البحث (SEO)؟',
    ch01p1: 'تحسين محركات البحث (SEO) هو ممارسة هيكلة المحتوى وكتابته بطريقة تُمكّن محركات البحث — وفي المقام الأول جوجل — من فهم موضوع صفحتك وترتيبها بارزةً حين يبحث المستخدمون عن مصطلحات ذات صلة.',
    ch01p2: 'بالنسبة لكتّاب أوصاف المنتجات، لا يتعلق السيو بالتحايل على الخوارزميات، بل بالكتابة بوضوح ودقة وفائدة — وهي بالضبط الصفات التي تكافئها محركات البحث الحديثة.',
    ch01Quote: '"الكتابة الجيدة لمحركات البحث والكتابة الجيدة أصبحتا تتقاربان. أفضل أوصاف المنتجات تحتل مراتب عالية لأنها تخدم القارئ أولاً."',

    /* ── CHAPTER 02 ── */
    ch02Title: 'دور كاتب المحتوى في السيو',
    ch02p1: 'أنت لست مُغذّيًا للخوارزميات، بل جسرٌ يربط احتياج العميل بقيمة المنتج. تُخبرك أُطر السيو بأين تضع المعلومات؛ أما حرفتك فتُحدد مدى قدرتها على التحويل.',
    ch02p2: 'يُسهم الكتّاب في ثلاثة نتائج قابلة للقياس: قابلية الاكتشاف (الترتيب)، وقابلية النقر (معدل النقر من نتائج البحث)، وقابلية التحويل (تحويل القرّاء إلى مشترين).',

    /* ── FOOTER ── */
    footerTitle: 'الدليل الشامل لمحركات البحث',
    footerSub: 'مرجع متكامل — منظّم للوضوح، مكتوب للناس.',
  }
};
