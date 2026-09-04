import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const datasets = {
  en: JSON.parse(fs.readFileSync(path.join(projectRoot, 'content/site.json'), 'utf8')),
  zh: JSON.parse(fs.readFileSync(path.join(projectRoot, 'content/site.zh.json'), 'utf8'))
};
let locale = 'en';
let data = datasets.en;
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

const ui = {
  en: {
    home: 'Home', publications: 'Publications', projects: 'Projects', cv: 'CV', menu: 'Menu',
    primaryNavigation: 'Primary navigation', skip: 'Skip to content', language: '中文', languageLabel: '切换到中文版',
    lastUpdated: 'Last updated September 2026', academicGlance: 'Academic output at a glance',
    researchVision: 'Research vision', researchArcTitle: 'Understand. Predict. Act.',
    researchIntro: 'My research asks a unified question: how can an intelligent system build a multimodal model of space, anticipate how that world will evolve, and act reliably within it? I approach this through representation, prediction, and deployment.',
    currentAgenda: 'Current agenda', researchFrontiers: 'Research frontiers', allProjects: 'All projects →',
    researchOutput: 'Research output', selectedPublications: 'Selected publications', fullPublicationList: 'Full publication list →',
    publicationsIntro: 'Foundational work in robust perception, efficient models, spatial vision, and intelligent mining.',
    realWorldFrontier: 'Real-world frontier', miningTitle: 'Intelligent mining in complex physical worlds',
    miningCopy: 'Mines are large-scale, dynamic, and partially observable 3D environments where perception, prediction, and action must remain reliable under dust, low illumination, occlusion, and constrained computation. I use this frontier to study deployable multimodal intelligence, panoramic sensing, 3D digital twins, and decision support.',
    exploreMining: 'Explore intelligent mining research →', researchAtScale: 'Research at scale', selectedPrograms: 'Selected programs', viewAllProjects: 'View all projects →',
    background: 'Background', educationExperience: 'Education and experience', fullCv: 'Full CV →',
    firstAuthor: 'First author', coAuthor: 'Co-author', paper: 'Paper ↗',
    publicationsTitle: 'Publications', publicationsPageIntro: 'A complete publication record assembled from the current academic materials. First-author work is marked explicitly.',
    filterPublications: 'Filter publications', all: 'All', selected: 'Selected', filterTemplate: '{count} publications shown',
    researchSystems: 'Research and systems', projectsTitle: 'Projects',
    projectsIntro: 'Research connecting multimodal spatial understanding, predictive world models, embodied decision-making, and intelligent mining in complex physical environments.',
    researchDirections: 'Research directions', fundedResearch: 'Funded research', selectedMajorPrograms: 'Selected major programs',
    intelligenceWild: 'Intelligence in the wild', operationalTitle: 'From world understanding to operational intelligence',
    operationalCopy: 'Across these projects, panoramic and multi-view sensing, vector-space modeling, 3D reconstruction, multimodal fusion, and efficient deployment form a continuous research program. Intelligent mining provides a rigorous physical-world frontier for advancing spatial intelligence and world models beyond controlled settings.',
    curriculumVitae: 'Curriculum vitae', cvSections: 'CV sections', experience: 'Experience', education: 'Education', awards: 'Awards', patents: 'Patents', grantedPatents: 'Granted patents', entries: 'entries', selectedLabel: 'Selected',
    portraitAlt: 'Yingbo Fan, Postdoctoral Researcher at Peking University', industrialAlt: 'Concept illustration of multimodal spatial intelligence for intelligent mining',
    pageNotFound: 'Page not found', pageNotFoundText: 'The requested page does not exist.', returnHome: 'Return home →'
  },
  zh: {
    home: '首页', publications: '论文', projects: '项目', cv: '简历', menu: '菜单',
    primaryNavigation: '主导航', skip: '跳转到主要内容', language: 'EN', languageLabel: 'Switch to English',
    lastUpdated: '最后更新于 2026 年 9 月', academicGlance: '学术成果概览',
    researchVision: '研究愿景', researchArcTitle: '理解 · 预测 · 行动',
    researchIntro: '我的研究围绕一个统一问题展开：智能系统如何构建空间的多模态模型，预测世界将如何演化，并在其中可靠行动？我从表征、预测与部署三个层面推进这一研究主线。',
    currentAgenda: '当前研究议程', researchFrontiers: '研究前沿', allProjects: '全部项目 →',
    researchOutput: '研究成果', selectedPublications: '代表性论文', fullPublicationList: '完整论文列表 →',
    publicationsIntro: '围绕鲁棒感知、高效模型、空间视觉与智能矿山开展的代表性研究。',
    realWorldFrontier: '真实世界前沿', miningTitle: '复杂物理世界中的智能矿山',
    miningCopy: '矿山是大尺度、动态且部分可观测的三维环境，感知、预测与行动必须在粉尘、弱光、遮挡和算力受限条件下保持可靠。我以这一真实世界前沿为牵引，研究可部署的多模态智能、全景感知、三维数字孪生与智能决策。',
    exploreMining: '查看智能矿山研究 →', researchAtScale: '规模化科研', selectedPrograms: '代表性科研项目', viewAllProjects: '查看全部项目 →',
    background: '学术背景', educationExperience: '教育与工作经历', fullCv: '完整简历 →',
    firstAuthor: '第一作者', coAuthor: '共同作者', paper: '论文 ↗',
    publicationsTitle: '论文成果', publicationsPageIntro: '根据现有学术材料整理的完整论文列表，其中第一作者论文已作明确标注。',
    filterPublications: '筛选论文', all: '全部', selected: '代表作', filterTemplate: '当前显示 {count} 篇论文',
    researchSystems: '研究与系统', projectsTitle: '科研项目',
    projectsIntro: '连接多模态空间理解、预测式世界模型、具身决策与复杂物理环境智能矿山的系统性研究。',
    researchDirections: '研究方向', fundedResearch: '科研项目', selectedMajorPrograms: '代表性重大项目',
    intelligenceWild: '真实环境中的智能', operationalTitle: '从世界理解走向作业智能',
    operationalCopy: '全景与多视角感知、矢量空间建模、三维重建、多模态融合和高效部署共同构成一条连续的研究主线。智能矿山为推动空间智能与世界模型走出受控环境、进入复杂真实世界提供了严格的验证前沿。',
    curriculumVitae: '个人简历', cvSections: '简历目录', experience: '工作经历', education: '教育经历', awards: '奖励荣誉', patents: '授权专利', grantedPatents: '授权专利', entries: '项', selectedLabel: '代表性荣誉',
    portraitAlt: '北京大学博士后研究人员樊迎博', industrialAlt: '面向智能矿山的多模态空间智能概念图',
    pageNotFound: '页面不存在', pageNotFoundText: '未找到您访问的页面。', returnHome: '返回首页 →'
  }
};

const t = (key) => ui[locale][key];
const route = (pathname) => locale === 'zh'
  ? (pathname === '/' ? '/zh/' : `/zh${pathname}`)
  : pathname;

const pageRoute = (active) => ({ home: '/', publications: '/publications/', projects: '/projects/', cv: '/cv/' })[active] || '/';

function alternateRoute(active) {
  const pathname = pageRoute(active);
  return locale === 'zh' ? pathname : (pathname === '/' ? '/zh/' : `/zh${pathname}`);
}

function profileLinks() {
  return data.site.profiles.map((item) => `
    <a class="text-link" href="${escapeHtml(item.url)}"${item.url.startsWith('http') ? ' target="_blank" rel="noreferrer"' : ''}>
      ${escapeHtml(item.label)}<span aria-hidden="true"> ↗</span>
    </a>`).join('');
}

function header(active = 'home') {
  const nav = [
    ['home', '/', t('home')],
    ['publications', '/publications/', t('publications')],
    ['projects', '/projects/', t('projects')],
    ['cv', '/cv/', t('cv')]
  ];
  return `
    <header class="site-header">
      <div class="shell nav-shell">
        <a class="site-name" href="${route('/')}" aria-label="${escapeHtml(data.site.name)} ${escapeHtml(t('home'))}">${escapeHtml(data.site.name)}</a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">${escapeHtml(t('menu'))}</button>
        <nav id="primary-nav" class="primary-nav" aria-label="${escapeHtml(t('primaryNavigation'))}">
          ${nav.map(([key, href, label]) => `<a href="${route(href)}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
          <a class="language-switch" href="${alternateRoute(active)}" hreflang="${locale === 'zh' ? 'en' : 'zh-CN'}" aria-label="${escapeHtml(t('languageLabel'))}">${escapeHtml(t('language'))}</a>
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
          <p>${escapeHtml(t('lastUpdated'))}</p>
        </div>
      </div>
    </footer>`;
}

function layout({ title, description, active, pathname, content }) {
  const pageTitle = title === data.site.name ? title : `${title} · ${data.site.name}`;
  const canonical = `${baseUrl}${pathname}`;
  const englishPathname = locale === 'zh' ? pathname.replace(/^\/zh/, '') || '/' : pathname;
  const chinesePathname = locale === 'zh' ? pathname : (pathname === '/' ? '/zh/' : `/zh${pathname}`);
  const sameAs = datasets.en.site.profiles.filter((item) => item.url.startsWith('http')).map((item) => item.url);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: datasets.en.site.name,
    alternateName: datasets.en.site.nameZh,
    jobTitle: datasets.en.site.title,
    affiliation: { '@type': 'CollegeOrUniversity', name: datasets.en.site.institution },
    url: baseUrl,
    email: `mailto:${data.site.email}`,
    sameAs
  };
  return `<!doctype html>
<html lang="${locale === 'zh' ? 'zh-CN' : 'en'}">
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
    <link rel="alternate" hreflang="en" href="${baseUrl}${englishPathname}">
    <link rel="alternate" hreflang="zh-CN" href="${baseUrl}${chinesePathname}">
    <link rel="alternate" hreflang="x-default" href="${baseUrl}${englishPathname}">
    <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="/assets/site.css?v=20260904-bilingual">
    <script type="application/ld+json">${JSON.stringify(jsonLd).replaceAll('<', '\\u003c')}</script>
    <script src="/assets/site.js" defer></script>
    <title>${escapeHtml(pageTitle)}</title>
  </head>
  <body class="lang-${locale}">
    <a class="skip-link" href="#main">${escapeHtml(t('skip'))}</a>
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
    <div class="publication-thumb"><img src="${escapeHtml(pub.image || '/assets/publication.svg')}" alt="${escapeHtml(pub.imageAlt || '')}" loading="lazy"></div>
    <div class="publication-body">
      <div class="publication-meta"><span>${escapeHtml(pub.venue)}</span>${pub.firstAuthor ? `<span>${escapeHtml(t('firstAuthor'))}</span>` : ''}</div>
      <h3>${escapeHtml(pub.title)}</h3>
      <p class="authors">${escapeHtml(pub.authors)}</p>
      ${pub.summary ? `<p class="publication-summary">${escapeHtml(pub.summary)}</p>` : ''}
      <div class="link-row">${pub.url ? `<a class="text-link" href="${escapeHtml(pub.url)}" target="_blank" rel="noreferrer">${escapeHtml(t('paper'))}</a>` : ''}${pub.doi ? `<span class="doi">DOI ${escapeHtml(pub.doi)}</span>` : ''}</div>
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
        <div class="profile-links">${profileLinks()}<a class="text-link" href="${route('/cv/')}">${escapeHtml(t('cv'))} →</a></div>
      </div>
      <div class="portrait-wrap">
        <img src="/assets/yingbo-fan-portrait.webp" alt="${escapeHtml(t('portraitAlt'))}" fetchpriority="high" decoding="async">
      </div>
    </section>

    <section class="record-band" aria-labelledby="record-heading">
      <div class="shell">
        <p class="record-label" id="record-heading">${escapeHtml(t('academicGlance'))}</p>
        <div class="metrics-grid">
          ${data.stats.map((stat) => `<div class="metric"><p class="metric-value">${escapeHtml(stat.value)}</p><p class="metric-label">${escapeHtml(stat.label)}</p><p class="metric-detail">${escapeHtml(stat.detail)}</p></div>`).join('')}
        </div>
      </div>
    </section>

    <section class="section shell research-arc-section">
      ${sectionHeading(t('researchVision'), t('researchArcTitle'))}
      <p class="section-intro">${escapeHtml(t('researchIntro'))}</p>
      <div class="research-arc">
        ${data.researchArc.map((item) => `<article><p class="arc-index">${escapeHtml(item.index)}</p><p class="arc-verb">${escapeHtml(item.verb)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p></article>`).join('')}
      </div>
    </section>

    <section class="section section-tint">
      <div class="shell">
        ${sectionHeading(t('currentAgenda'), t('researchFrontiers'), `<a class="section-link" href="${route('/projects/')}">${escapeHtml(t('allProjects'))}</a>`)}
        <div class="feature-list">${data.featured.map(featuredRow).join('')}</div>
      </div>
    </section>

    <section class="section shell">
      ${sectionHeading(t('researchOutput'), t('selectedPublications'), `<a class="section-link" href="${route('/publications/')}">${escapeHtml(t('fullPublicationList'))}</a>`)}
      <p class="section-intro">${escapeHtml(t('publicationsIntro'))}</p>
      <div class="publication-list">${selected.map(publicationCard).join('')}</div>
    </section>

    <section class="section applied-section">
      <div class="shell applied-grid">
        <div class="applied-visual"><img src="/assets/industrial-spatial.svg" alt="${escapeHtml(t('industrialAlt'))}" loading="lazy"></div>
        <div class="applied-copy">
          <p class="eyebrow">${escapeHtml(t('realWorldFrontier'))}</p>
          <h2>${escapeHtml(t('miningTitle'))}</h2>
          <p>${escapeHtml(t('miningCopy'))}</p>
          <a class="text-link" href="${route('/projects/')}">${escapeHtml(t('exploreMining'))}</a>
        </div>
      </div>
    </section>

    <section class="section shell">
      ${sectionHeading(t('researchAtScale'), t('selectedPrograms'), `<a class="section-link" href="${route('/projects/')}">${escapeHtml(t('viewAllProjects'))}</a>`)}
      <div class="project-preview-grid">
        ${latestProjects.map((project) => `<article><p class="project-period">${escapeHtml(project.period)}</p><h3>${escapeHtml(project.title)}</h3><p class="project-program">${escapeHtml(project.program)}</p><p>${escapeHtml(project.description)}</p></article>`).join('')}
      </div>
    </section>

    <section class="section background-section">
      <div class="shell">
        ${sectionHeading(t('background'), t('educationExperience'), `<a class="section-link" href="${route('/cv/')}">${escapeHtml(t('fullCv'))}</a>`)}
        <div class="timeline-grid">
          ${data.experience.slice(0, 1).map((item) => `<article><p>${escapeHtml(item.period)}</p><h3>${escapeHtml(item.role)}</h3><p>${escapeHtml(item.institution)}</p></article>`).join('')}
          ${data.education.map((item) => `<article><p>${escapeHtml(item.period)}</p><h3>${escapeHtml(item.degree)}</h3><p>${escapeHtml(item.institution)}</p></article>`).join('')}
        </div>
      </div>
    </section>`;
  return layout({ title: data.site.name, description: data.site.description, active: 'home', pathname: route('/'), content });
}

function publicationsPage() {
  const years = [...new Set(data.publications.map((pub) => pub.year))].sort((a, b) => b - a);
  const content = `
    <section class="page-hero shell">
      <p class="eyebrow">${escapeHtml(t('researchOutput'))}</p>
      <h1>${escapeHtml(t('publicationsTitle'))}</h1>
      <p>${escapeHtml(t('publicationsPageIntro'))}</p>
    </section>
    <section class="page-section shell">
      <div class="filter-bar" role="group" aria-label="${escapeHtml(t('filterPublications'))}">
        <button type="button" class="filter-button is-active" data-publication-filter="all" aria-pressed="true">${escapeHtml(t('all'))} · ${data.publications.length}</button>
        <button type="button" class="filter-button" data-publication-filter="first" aria-pressed="false">${escapeHtml(t('firstAuthor'))} · ${data.publications.filter((pub) => pub.firstAuthor).length}</button>
        <button type="button" class="filter-button" data-publication-filter="selected" aria-pressed="false">${escapeHtml(t('selected'))} · ${data.publications.filter((pub) => pub.selected).length}</button>
      </div>
      <p class="filter-status" data-filter-template="${escapeHtml(t('filterTemplate'))}" aria-live="polite"></p>
      <div class="year-groups">
        ${years.map((year) => `<section class="year-group"><h2>${year}</h2><div>${data.publications.filter((pub) => pub.year === year).map((pub) => `<article class="publication-row" data-first-author="${pub.firstAuthor}" data-selected="${pub.selected}">
          <div class="publication-year-mark">${pub.firstAuthor ? escapeHtml(t('firstAuthor')) : escapeHtml(t('coAuthor'))}</div>
          <div><h3>${escapeHtml(pub.title)}</h3><p class="authors">${escapeHtml(pub.authors)}</p><p class="venue">${escapeHtml(pub.venue)}</p><div class="tag-row">${(pub.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}</div></div>
          <div class="publication-actions">${pub.url ? `<a class="text-link" href="${escapeHtml(pub.url)}" target="_blank" rel="noreferrer">${escapeHtml(t('paper'))}</a>` : ''}${pub.doi ? `<p>DOI<br>${escapeHtml(pub.doi)}</p>` : ''}</div>
        </article>`).join('')}</div></section>`).join('')}
      </div>
    </section>`;
  return layout({ title: t('publicationsTitle'), description: data.site.publicationsDescription, active: 'publications', pathname: route('/publications/'), content });
}

function projectsPage() {
  const content = `
    <section class="page-hero shell">
      <p class="eyebrow">${escapeHtml(t('researchSystems'))}</p>
      <h1>${escapeHtml(t('projectsTitle'))}</h1>
      <p>${escapeHtml(t('projectsIntro'))}</p>
    </section>
    <section class="page-section shell">
      ${sectionHeading(t('currentAgenda'), t('researchDirections'))}
      <div class="feature-list compact-feature-list">${data.featured.map(featuredRow).join('')}</div>
    </section>
    <section class="page-section section-tint">
      <div class="shell">
        ${sectionHeading(t('fundedResearch'), t('selectedMajorPrograms'))}
        <div class="project-list">${data.projects.map((project) => `<article>
          <div><p class="project-period">${escapeHtml(project.period)}</p><p class="role-label">${escapeHtml(project.role)}</p></div>
          <div><h3>${escapeHtml(project.title)}</h3><p class="project-program">${escapeHtml(project.program)}</p><p>${escapeHtml(project.description)}</p></div>
        </article>`).join('')}</div>
      </div>
    </section>
    <section class="page-section shell system-story">
      <div><img src="/assets/industrial-spatial.svg" alt="${escapeHtml(t('industrialAlt'))}"></div>
      <div><p class="eyebrow">${escapeHtml(t('intelligenceWild'))}</p><h2>${escapeHtml(t('operationalTitle'))}</h2><p>${escapeHtml(t('operationalCopy'))}</p></div>
    </section>`;
  return layout({ title: t('projectsTitle'), description: data.site.projectsDescription, active: 'projects', pathname: route('/projects/'), content });
}

function cvPage() {
  const content = `
    <section class="page-hero shell cv-hero">
      <div><p class="eyebrow">${escapeHtml(t('curriculumVitae'))}</p><h1>${escapeHtml(data.site.name)}</h1><p>${escapeHtml(data.site.title)}, ${escapeHtml(data.site.affiliation)}</p></div>
      <div class="cv-contact"><p>${escapeHtml(data.site.email.replace('@', ' [at] '))}</p><p>${escapeHtml(data.site.location)}</p></div>
    </section>
    <section class="page-section shell cv-layout">
      <aside class="cv-sidebar">
        <nav aria-label="${escapeHtml(t('cvSections'))}"><a href="#experience">${escapeHtml(t('experience'))}</a><a href="#education">${escapeHtml(t('education'))}</a><a href="#awards">${escapeHtml(t('awards'))}</a><a href="#patents">${escapeHtml(t('patents'))}</a></nav>
      </aside>
      <div class="cv-content">
        <section id="experience"><h2>${escapeHtml(t('experience'))}</h2>${data.experience.map((item) => `<article class="cv-entry"><p>${escapeHtml(item.period)}</p><div><h3>${escapeHtml(item.role)}</h3><p>${escapeHtml(item.institution)}</p></div></article>`).join('')}</section>
        <section id="education"><h2>${escapeHtml(t('education'))}</h2>${data.education.map((item) => `<article class="cv-entry"><p>${escapeHtml(item.period)}</p><div><h3>${escapeHtml(item.degree)}</h3><p>${escapeHtml(item.institution)}</p></div></article>`).join('')}</section>
        <section id="awards"><h2>${escapeHtml(t('awards'))}</h2>${data.awards.map((item) => `<article class="cv-entry"><p>${escapeHtml(item.year || t('selectedLabel'))}</p><div><h3>${escapeHtml(item.title)}</h3></div></article>`).join('')}</section>
        <section id="patents"><div class="cv-section-heading"><h2>${escapeHtml(t('grantedPatents'))}</h2><p>${data.patents.length} ${escapeHtml(t('entries'))}</p></div><div class="patent-list">${data.patents.map((patent) => `<article><p>${escapeHtml(patent.year)} · ${escapeHtml(patent.country)}</p><h3>${escapeHtml(patent.title)}</h3><p>${escapeHtml(patent.number)}</p></article>`).join('')}</div></section>
      </div>
    </section>`;
  return layout({ title: t('cv'), description: data.site.cvDescription, active: 'cv', pathname: route('/cv/'), content });
}

function writePage(relativePath, html) {
  const outputPath = path.join(dist, relativePath);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
}

function buildLocale(selectedLocale) {
  locale = selectedLocale;
  data = datasets[selectedLocale];
  const folder = selectedLocale === 'zh' ? 'zh/' : '';
  writePage(`${folder}index.html`, homePage());
  writePage(`${folder}publications/index.html`, publicationsPage());
  writePage(`${folder}projects/index.html`, projectsPage());
  writePage(`${folder}cv/index.html`, cvPage());
}

buildLocale('en');
buildLocale('zh');

locale = 'en';
data = datasets.en;
writePage('404.html', layout({
  title: t('pageNotFound'),
  description: t('pageNotFoundText'),
  active: '',
  pathname: '/404.html',
  content: `<section class="page-hero shell"><p class="eyebrow">404</p><h1>${escapeHtml(t('pageNotFound'))}</h1><p>${escapeHtml(t('pageNotFoundText'))}</p><a class="text-link" href="/">${escapeHtml(t('returnHome'))}</a></section>`
}));

fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`);
const sitemapRoutes = ['/', '/publications/', '/projects/', '/cv/', '/zh/', '/zh/publications/', '/zh/projects/', '/zh/cv/'];
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((url) => `  <url><loc>${baseUrl}${url}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`Built bilingual academic homepage in ${dist}`);
