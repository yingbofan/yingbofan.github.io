const menuButton = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

if (menuButton && primaryNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    primaryNav.classList.toggle('is-open', !isOpen);
  });
}

const filterButtons = [...document.querySelectorAll('[data-publication-filter]')];
const publicationRows = [...document.querySelectorAll('.publication-row')];
const filterStatus = document.querySelector('.filter-status');

if (filterButtons.length && publicationRows.length) {
  const updateFilter = (filter) => {
    let visible = 0;
    publicationRows.forEach((row) => {
      const show = filter === 'all'
        || (filter === 'first' && row.dataset.firstAuthor === 'true')
        || (filter === 'selected' && row.dataset.selected === 'true');
      row.hidden = !show;
      if (show) visible += 1;
    });

    document.querySelectorAll('.year-group').forEach((group) => {
      group.hidden = !group.querySelector('.publication-row:not([hidden])');
    });

    filterButtons.forEach((button) => {
      const active = button.dataset.publicationFilter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    if (filterStatus) {
      const template = filterStatus.dataset.filterTemplate || '{count} publications shown';
      filterStatus.textContent = template.replace('{count}', String(visible));
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => updateFilter(button.dataset.publicationFilter));
  });

  updateFilter('all');
}
