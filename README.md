# SEO Reference Guide — Jekyll

A Jekyll conversion of the SEO Reference Guide website. Same design, same JS/CSS — but now content lives in clean Markdown/HTML files that are easy to edit and extend.

---

## Quick Start

```bash
# 1. Install Ruby (if not already installed)
#    macOS:   brew install ruby
#    Ubuntu:  sudo apt-get install ruby-full build-essential
#    Windows: https://rubyinstaller.org/

# 2. Install Jekyll and Bundler
gem install jekyll bundler

# 3. Install project dependencies
bundle install

# 4. Serve locally (auto-reloads on file changes)
bundle exec jekyll serve

# 5. Open http://localhost:4000
```

---

## Project Structure

```
seo-guide-jekyll/
│
├── _config.yml              ← Site settings (title, URL, collections)
├── Gemfile                  ← Ruby gem dependencies
│
├── _layouts/
│   ├── default.html         ← Base layout (index + downloads pages)
│   ├── chapter.html         ← Handbook chapter layout (sidebar + hero auto-generated)
│   └── downloads.html       ← Downloads page layout
│
├── _includes/
│   └── sidebar.html         ← Main overview sidebar (used by default layout)
│
├── _chapters/               ← Jekyll collection — one file per handbook
│   ├── content-writing.html
│   ├── technical-seo.html
│   ├── link-building.html
│   ├── local-seo.html
│   └── quick-answers.html
│
├── assets/
│   ├── css/
│   │   └── style.css        ← All styles (unchanged from original)
│   └── js/
│       ├── translations.js  ← EN/AR translation strings
│       ├── i18n.js          ← Language switching engine
│       ├── nav.js           ← Sidebar + hamburger behaviour
│       ├── main.js          ← Scroll reveal, accordions, progress bars
│       ├── search.js        ← Full-text search across all pages
│       └── pdf-reader.js    ← Reading-progress ring + PDF download widget
│
├── pdfs/                    ← Place your PDF files here
│   ├── content-writing-handbook.pdf
│   ├── technical-seo-handbook.pdf
│   ├── link-building-handbook.pdf
│   └── local-seo-handbook.pdf
│
├── index.html               ← Home page (SEO Overview)
└── downloads.html           ← PDF Downloads page
```

---

## How to Write Content

### Editing an Existing Chapter

Open the chapter file in `_chapters/`, e.g. `_chapters/content-writing.html`.

The top of the file is **front matter** (YAML between `---` delimiters):

```yaml
---
layout: chapter
title: "Content Writer's SEO Handbook"
sidebar_title: "Content Writer's Handbook"
description: "11 chapters covering everything..."
eyebrow: "Handbook 01 — 11 Chapters"
hero_title: "Content Writer's<br><em>SEO Handbook</em>"
hero_sub: "Everything a content writer needs..."
pdf_href: "/pdfs/content-writing-handbook.pdf"
chapters:
  - id: hero
    num: "00"
    label: "Introduction"
  - id: ch01
    num: "01"
    label: "What is SEO?"
  # ... more chapters
---
```

Below the front matter is the HTML content — regular HTML sections that render directly into the page. Add a new chapter section like this:

```html
<!-- CH 12 -->
<section id="ch12" data-section-id="ch12" class="section reveal">
    <p class="chapter-label">Chapter 12</p>
    <h2>Your New Chapter Title</h2>
    <p>Your content here. Standard HTML — paragraphs, tables, cards, etc.</p>
</section>
```

Then add it to the front matter `chapters` list:

```yaml
  - id: ch12
    num: "12"
    label: "Your New Chapter"
```

The sidebar link is generated automatically from the front matter list.

---

### Adding a Brand New Handbook

1. Create `_chapters/your-handbook-name.html`
2. Add the front matter (copy from an existing chapter file and edit)
3. Write your sections below the front matter
4. Add a card to `index.html` in the `#handbooks` section
5. Add a sidebar link in `_includes/sidebar.html`
6. Add a download card to `downloads.html`
7. Add the search entries to `assets/js/search.js` in the `GLOBAL_INDEX` array

---

### Available HTML Components

All existing CSS classes are available. Use these building blocks:

```html
<!-- Section wrapper (required for scroll reveal + sidebar tracking) -->
<section id="your-id" data-section-id="your-id" class="section reveal">
    <p class="chapter-label">Chapter XX</p>
    <h2>Section Title</h2>
    <p>Body text paragraph.</p>
</section>

<!-- Highlighted quote block -->
<div class="highlight">"Your pull quote here."</div>

<!-- 3-column card grid -->
<div class="card-grid">
    <div class="card">
        <span class="card-num">Label</span>
        <h3>Card Title</h3>
        <p>Card body text.</p>
    </div>
</div>

<!-- Numbered steps list -->
<div class="steps-list">
    <div class="step-item">
        <div class="step-number">01</div>
        <div class="step-body">
            <h4>Step Title</h4>
            <p>Step description.</p>
        </div>
    </div>
</div>

<!-- Data table -->
<div class="table-wrap">
    <table>
        <thead><tr><th>Col 1</th><th>Col 2</th></tr></thead>
        <tbody>
            <tr><td>Data</td><td>Data</td></tr>
        </tbody>
    </table>
</div>

<!-- Checklist -->
<ul class="checklist">
    <li><span class="check-icon"></span><span>Checklist item text</span></li>
</ul>

<!-- Accordion -->
<div class="accordion">
    <div class="acc-item">
        <button class="acc-trigger">Question or title</button>
        <div class="acc-body">
            <p>Answer or expanded content.</p>
        </div>
    </div>
</div>

<!-- Pillar list (4-column feature blocks) -->
<div class="pillar-list">
    <div class="pillar-item">
        <div class="pillar-meta">
            <span class="pillar-tag">Category Label</span>
            <span class="pillar-num">01</span>
        </div>
        <div class="pillar-content">
            <h3>Title</h3>
            <p>Description.</p>
        </div>
    </div>
</div>

<!-- Dark stats band (full-width dark section) -->
<div class="dark-section reveal" data-section-id="your-stats-id">
    <div class="dark-section-inner">
        <h2>Section Title</h2>
        <div class="prog-item">
            <div class="prog-label"><span>Metric name</span><span>68%</span></div>
            <div class="prog-bar"><div class="prog-fill" data-width="68"></div></div>
        </div>
    </div>
</div>
```

---

## Adding Translations

Open `assets/js/translations.js`. Add your key to both `en` and `ar` objects:

```js
en: {
  myNewKey: 'English text here',
  ...
},
ar: {
  myNewKey: 'النص العربي هنا',
  ...
}
```

Then use it in any HTML with:

```html
<span data-i18n="myNewKey">Fallback text</span>
```

---

## Building for Production

```bash
# Build static site into ./_site/
bundle exec jekyll build

# Build with a specific base URL (for GitHub Pages subdirectory)
bundle exec jekyll build --baseurl "/my-repo-name"
```

The built site in `_site/` can be deployed to any static host:
- **GitHub Pages**: push to `gh-pages` branch or configure in repo settings
- **Netlify**: connect repo, set build command `jekyll build`, publish dir `_site`
- **Vercel**: same as Netlify
- **Any web server**: copy `_site/` contents to your server

---

## PDF Files

Place your PDF files in the `pdfs/` directory:

```
pdfs/
├── content-writing-handbook.pdf
├── technical-seo-handbook.pdf
├── link-building-handbook.pdf
└── local-seo-handbook.pdf
```

The download buttons on the Downloads page and the PDF widget on each chapter page will work automatically once the files are present.

---

## Updating the Search Index

When you add new sections, add entries to the `GLOBAL_INDEX` array in `assets/js/search.js`:

```js
{ 
  id: 'your-unique-id', 
  href: '/chapters/your-handbook/#section-id', 
  label: 'Handbook · Ch 01', 
  title: 'Section Title', 
  title_ar: 'العنوان بالعربية',
  body: 'keywords for search matching here',
  body_ar: 'كلمات للبحث بالعربية',
  tags: ['tag1', 'tag2']
},
```

---

Built by Saeed.
