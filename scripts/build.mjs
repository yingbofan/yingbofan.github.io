import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(projectRoot, 'content/site.json'), 'utf8'));
const dist = path.join(projectRoot, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.cpSync(path.join(projectRoot, 'public'), dist, { recursive: true });
fs.copyFileSync(path.join(projectRoot, 'src/styles.css'), path.join(dist, 'assets/site.css'));
fs.copyFileSync(path.join(projectRoot, 'src/site.js'), path.join(dist, 'assets/site.js'));

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const baseUrl = 'https://yingbofan.github.io';

function profileLinks() {
  return data.site.profiles.map((item) => `
    <a class="text-link" href="${escapeHtml(item.url)}"${item.url.startsWith('http') ? ' target="_blank" rel="noreferrer"' : ''}>
      ${escapeHtml(item.label)}<span aria-hidden="true"> ↗</span>
    </a>`).join('');
}

function header(active = 'home') {
  const nav = [
    ['home', '/', 'Home'],
    ['publications', '/publications/', 'Publications'],
    ['projects', '/projects/', 'Projects'],
    ['cv', '/cv/', 'CV']
  ];
  return `
    <header class="site-header">
      <div class="shell nav-shell">
        <a class="site-name" href="/" aria-label="Yingbo Fan home">Yingbo Fan</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>
        <nav id="primary-nav" class="primary-nav" aria-label="Primary navigation">
          ${nav.map(([key, href, label]) => `<a href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
        </nav>
      </div>
    </header>`;
}

function footer() {
  const emailText = data.site.email.replace('@', ' [at] ');
  return `
    <footer class="site-footer">
      <div class="shell footer-grid">
        <div>
          <p class="footer-name">${escapeHtml(data.site.name)}</p>
          <p>${escapeHtml(data.site.title)} · ${escapeHtml(data.site.institution)}</p>
        </div>
        <div class="footer-contact">
          <a href="mailto:${escapeHtml(data.site.email)}">${escapeHtml(emailText)}</a>
          <p>Last updated September 2026</p>
        </div>
      </div>
    </footer>`;
}

function layout({ title, description, active, pathname, content }) {
  const pageTitle = title === data.site.name ? title : `${title} · ${data.site.name}`;
  const canonical = `${baseUrl}${pathname}`;
  const sameAs = data.site.profiles.filter((item) => item.url.startsWith('http')).map((item) => item.url);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.site.name,
    alternateName: data.site.nameZh,
    jobTitle: data.site.title,
    affiliation: { '@type': 'CollegeOrUniversity', name: data.site.institution },
    url: baseUrl,
    email: `mailto:${data.site.email}`,
    sameAs
  };
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHtml(description)}">
    <meta name="theme-color" content="#fbfaf7">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${escapeHtml(pageTitle)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${baseUrl}/assets/og-image.svg">
    <link rel="canonical" href="${canonical}">
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/site.css?v=20260902-portrait">
    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>
    <script src="/assets/site.js" defer></script>
    <title>${escapeHtml(pageTitle)}</title>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    ${header(active)}
    <main id="main">${content}</main>
    ${footer()}
  </body>
</html>`;
}

function sectionHeading(kicker, title, action = '') {
  return `<div class="section-heading">
    <div><p class="eyebrow">${escapeHtml(kicker)}</p><h2>${escapeHtml(title)}</h2></div>
    ${action}
  </div>`;
}

function featuredRow(item, index) {
  const links = item.links.length
    ? `<div class="link-row">${item.links.map((link) => `<a class="text-link" href="${escapeHtml(link.url)}">${escapeHtml(link.label)} ↗</a>`).join('')}</div>`
    : '';
  return `<article class="feature-row${index % 2 ? ' feature-row-reverse' : ''}" id="${escapeHtml(item.slug)}">
    <div class="feature-visual"><img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}" loading="lazy"></div>
    <div class="feature-copy">
      <div class="feature-topline"><span class="research-label">${escapeHtml(item.category)}</span><span class="status-label">${escapeHtml(item.status)}</span></div>
      <h3>${escapeHtml(item.title)}</h3>
      ${item.subtitle ? `<p class="feature-subtitle">${escapeHtml(item.subtitle)}</p>` : ''}
      <p>${escapeHtml(item.description)}</p>
      ${links}
    </div>
  </article>`;
}

function publicationCard(pub) {
  return `<article class="publication-card">
    <div class="publication-thumb"><img src="${escapeHtml(pub.image || '/assets/publication.svg')}" alt="" loading="lazy"></div>
    <div class="publication-body">
      <div class="publication-meta"><span>${escapeHtml(pub.venue)}</span>${pub.firstAuthor ? '<span>First author</span>' : ''}</div>
      <h3>${escapeHtml(pub.title)}</h3>
      <p class="authors">${escapeHtml(pub.authors)}</p>
      ${pub.summary ? `<p class="publication-summary">${escapeHtml(pub.summary)}</p>` : ''}
      <div class="link-row">${pub.url ? `<a class="text-link" href="${escapeHtml(pub.url)}" target="_blank" rel="noreferrer">Paper ↗</a>` : ''}${pub.doi ? `<span class="doi">DOI ${escapeHtml(pub.doi)}</span>` : ''}</div>
    </div>
  </article>`;
}

function homePage() {
  const selected = data.publications.filter((pub) => pub.selected);
  const latestProjects = data.projects.slice(0, 3);
  const content = `
    <section class="hero shell">
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(data.site.title)} · ${escapeHtml(data.site.institution)}</p>
        <p class="hero-chinese-name">${escapeHtml(data.site.nameZh)}</p>
        <h1>${escapeHtml(data.site.name)}</h1>
        <p class="hero-tagline">${escapeHtml(data.site.tagline)}</p>
        <p class="hero-mission">${escapeHtml(data.site.mission)}</p>
        <p class="research-keywords">${data.site.keywords.map(escapeHtml).join(' · ')}</p>
        <div class="profile-links">${profileLinks()}<a class="text-link" href="/cv/">CV →</a></div>
      </div>
      <div class="portrait-wrap">
        <img src="/assets/yingbo-fan-portrait.webp" alt="Yingbo Fan, Postdoctoral Researcher at Peking University" fetchpriority="high" decoding="async">
      </div>
    </section>

    <section class="record-band" aria-labelledby="record-heading">
      <div class="shell">
        <p class="record-label" id="record-heading">Academic output at a glance</p>
        <div class="metrics-grid">
          ${data.stats.map((stat) => `<div class="metric"><p class="metric-value">${escapeHtml(stat.value)}</p><p class="metric-label">${escapeHtml(stat.label)}</p><p class="metric-detail">${escapeHtml(stat.detail)}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section shell research-arc-section">
      ${sectionHeading('Research vision', 'Understand. Predict. Act.')}
      <p class="section-intro">My research asks a unified question: how can an intelligent system build a multimodal model of space, anticipate how that world will evolve, and act reliably within it? I approach this through representation, prediction, and deployment.</p>
      <div class="research-arc">
        ${data.researchArc.map((item) => `<article><p class="arc-index">${escapeHtml(item.index)}</p><p class="arc-verb">${escapeHtml(item.verb)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join('')}
      </div>
    </section>

    <section class="section section-tint">
      <div class="shell">
        ${sectionHeading('Current agenda', 'Research frontiers', '<a class="section-link" href="/projects/">All projects →</a>')}
        <div class="feature-list">${data.featured.map(featuredRow).join('')}</div>
      </div>
    </section>

    <section class="section shell">
      ${sectionHeading('Research output', 'Selected publications', '<a class="section-link" href="/publications/">Full publication list →</a>')}
      <p class="section-intro">Foundational work in robust perception, efficient models, spatial vision, and intelligent mining.</p>
      <div class="publication-list">${selected.map(publicationCard).join('')}</div>
    </section>

    <section class="section applied-section">
      <div class="shell applied-grid">
        <div class="applied-visual"><img src="/assets/industrial-spatial.svg" alt="Concept illustration of multimodal spatial intelligence for intelligent mining" loading="lazy"></div>
        <div class="applied-copy">
          <p class="eyebrow">Real-world frontier</p>
          <h2>Intelligent mining in complex physical worlds</h2>
          <p>Mines are large-scale, dynamic, and partially observable 3D environments where perception, prediction, and action must remain reliable under dust, low illumination, occlusion, and constrained computation. I use this frontier to study deployable multimodal intelligence, panoramic sensing, 3D digital twins, and decision support.</p>
          <a class="text-link" href="/projects/">Explore intelligent mining research →</a>
        </div>
      </div>
    </section>

    <section class="section shell">
      ${sectionHeading('Research at scale', 'Selected programs', '<a class="section-link" href="/projects/">View all projects →</a>')}
      <div class="project-preview-grid">
        ${latestProjects.map((project) => `<article><p class="project-period">${escapeHtml(project.period)}</p><h3>${escapeHtml(project.title)}</h3><p class="project-program">${escapeHtml(project.program)}</p><p>${escapeHtml(project.description)}</p></article>`).join('')}
      </div>
    </section>

    <section class="section background-section">
      <div class="shell">
        ${sectionHeading('Background', 'Education and experience', '<a class="section-link" href="/cv/">Full CV →</a>')}
        <div class="timeline-grid">
          ${data.experience.slice(0, 1).map((item) => `<article><p>${escapeHtml(item.period)}</p><h3>${escapeHtml(item.role)}</h3><p>${escapeHtml(item.institution)}</p></article>`).join('')}
          ${data.education.map((item) => `<article><p>${escapeHtml(item.period)}</p><h3>${escapeHtml(item.degree)}</h3><p>${escapeHtml(item.institution)}</p></article>`).join('')}
        </div>
      </div>
    </section>`;
  return layout({ title: data.site.name, description: data.site.description, active: 'home', pathname: '/', content });
}

function publicationsPage() {
  const years = [...new Set(data.publications.map((pub) => pub.year))].sort((a, b) => b - a);
  const content = `
    <section class="page-hero shell">
      <p class="eyebrow">Research output</p>
      <h1>Publications</h1>
      <p>A complete publication record assembled from the current academic materials. First-author work is marked explicitly.</p>
    </section>
    <section class="page-section shell">
      <div class="filter-bar" role="group" aria-label="Filter publications">
        <button type="button" class="filter-button is-active" data-publication-filter="all" aria-pressed="true">All · ${data.publications.length}</button>
        <button type="button" class="filter-button" data-publication-filter="first" aria-pressed="false">First author · ${data.publications.filter((pub) => pub.firstAuthor).length}</button>
        <button type="button" class="filter-button" data-publication-filter="selected" aria-pressed="false">Selected · ${data.publications.filter((pub) => pub.selected).length}</button>
      </div>
      <p class="filter-status" aria-live="polite"></p>
      <div class="year-groups">
        ${years.map((year) => `<section class="year-group"><h2>${year}</h2><div>${data.publications.filter((pub) => pub.year === year).map((pub) => `<article class="publication-row" data-first-author="${pub.firstAuthor}" data-selected="${pub.selected}">
          <div class="publication-year-mark">${pub.firstAuthor ? 'First author' : 'Co-author'}</div>
          <div><h3>${escapeHtml(pub.title)}</h3><p class="authors">${escapeHtml(pub.authors)}</p><p class="venue">${escapeHtml(pub.venue)}</p><div class="tag-row">${(pub.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div></div>
          <div class="publication-actions">${pub.url ? `<a class="text-link" href="${escapeHtml(pub.url)}" target="_blank" rel="noreferrer">Paper ↗</a>` : ''}${pub.doi ? `<p>DOI<br>${escapeHtml(pub.doi)}</p>` : ''}</div>
        </article>`).join('')}</div></section>`).join('')}
      </div>
    </section>`;
  return layout({ title: 'Publications', description: `Publications by ${data.site.name}.`, active: 'publications', pathname: '/publications/', content });
}

function projectsPage() {
  const content = `
    <section class="page-hero shell">
      <p class="eyebrow">Research and systems</p>
      <h1>Projects</h1>
      <p>Research connecting multimodal spatial understanding, predictive world models, embodied decision-making, and intelligent mining in complex physical environments.</p>
    </section>
    <section class="page-section shell">
      ${sectionHeading('Current agenda', 'Research directions')}
      <div class="feature-list compact-feature-list">${data.featured.map(featuredRow).join('')}</div>
    </section>
    <section class="page-section section-tint">
      <div class="shell">
        ${sectionHeading('Funded research', 'Selected major programs')}
        <div class="project-list">${data.projects.map((project) => `<article>
          <div><p class="project-period">${escapeHtml(project.period)}</p><p class="role-label">${escapeHtml(project.role)}</p></div>
          <div><h3>${escapeHtml(project.title)}</h3><p class="project-program">${escapeHtml(project.program)}</p><p>${escapeHtml(project.description)}</p></div>
        </article>`).join('')}</div>
      </div>
    </section>
    <section class="page-section shell system-story">
      <div><img src="/assets/industrial-spatial.svg" alt="Concept illustration for multimodal spatial intelligence and intelligent mining"></div>
      <div><p class="eyebrow">Intelligence in the wild</p><h2>From world understanding to operational intelligence</h2><p>Across these projects, panoramic and multi-view sensing, vector-space modeling, 3D reconstruction, multimodal fusion, and efficient deployment form a continuous research program. Intelligent mining provides a rigorous physical-world frontier for advancing spatial intelligence and world models beyond controlled settings.</p></div>
    </section>`;
  return layout({ title: 'Projects', description: `Research projects by ${data.site.name}.`, active: 'projects', pathname: '/projects/', content });
}

function cvPage() {
  const content = `
    <section class="page-hero shell cv-hero">
      <div><p class="eyebrow">Curriculum vitae</p><h1>${escapeHtml(data.site.name)}</h1><p>${escapeHtml(data.site.title)}, ${escapeHtml(data.site.affiliation)}</p></div>
      <div class="cv-contact"><p>${escapeHtml(data.site.email.replace('@', ' [at] '))}</p><p>${escapeHtml(data.site.location)}</p></div>
    </section>
    <section class="page-section shell cv-layout">
      <aside class="cv-sidebar">
        <nav aria-label="CV sections"><a href="#experience">Experience</a><a href="#education">Education</a><a href="#awards">Awards</a><a href="#patents">Patents</a></nav>
      </aside>
      <div class="cv-content">
        <section id="experience"><h2>Experience</h2>${data.experience.map((item) => `<article class="cv-entry"><p>${escapeHtml(item.period)}</p><div><h3>${escapeHtml(item.role)}</h3><p>${escapeHtml(item.institution)}</p></div></article>`).join('')}</section>
        <section id="education"><h2>Education</h2>${data.education.map((item) => `<article class="cv-entry"><p>${escapeHtml(item.period)}</p><div><h3>${escapeHtml(item.degree)}</h3><p>${escapeHtml(item.institution)}</p></div></article>`).join('')}</section>
        <section id="awards"><h2>Awards</h2>${data.awards.map((item) => `<article class="cv-entry"><p>${escapeHtml(item.year || 'Selected')}</p><div><h3>${escapeHtml(item.title)}</h3></div></article>`).join('')}</section>
        <section id="patents"><div class="cv-section-heading"><h2>Granted patents</h2><p>${data.patents.length} entries</p></div><div class="patent-list">${data.patents.map((patent) => `<article><p>${escapeHtml(patent.year)} · ${escapeHtml(patent.country)}</p><h3>${escapeHtml(patent.title)}</h3><p>${escapeHtml(patent.number)}</p></article>`).join('')}</div></section>
      </div>
    </section>`;
  return layout({ title: 'CV', description: `Curriculum vitae of ${data.site.name}.`, active: 'cv', pathname: '/cv/', content });
}

function writePage(relativePath, html) {
  const outputPath = path.join(dist, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
}

writePage('index.html', homePage());
writePage('publications/index.html', publicationsPage());
writePage('projects/index.html', projectsPage());
writePage('cv/index.html', cvPage());
writePage('404.html', layout({
  title: 'Page not found',
  description: 'Page not found.',
  active: '',
  pathname: '/404.html',
  content: '<section class="page-hero shell"><p class="eyebrow">404</p><h1>Page not found</h1><p>The requested page does not exist.</p><a class="text-link" href="/">Return home →</a></section>'
}));

fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['/', '/publications/', '/projects/', '/cv/'].map((url) => `  <url><loc>${baseUrl}${url}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`Built ${data.site.name}'s academic homepage in ${dist}`);
