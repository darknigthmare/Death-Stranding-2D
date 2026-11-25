(() => {
  'use strict';
  const categoryNames = {
    characters: 'Personnages', enemies: 'Ennemis',
    projectiles: 'Projectiles', stages: 'Décors · Panorama'
  };
  const grid = document.getElementById('static-grid');
  const count = document.getElementById('static-count');
  const empty = document.getElementById('static-empty');
  const viewer = document.getElementById('static-viewer');
  const viewerImage = document.getElementById('viewer-image');
  const filters = Array.from(document.querySelectorAll('[data-category]'));
  const catalogue = window.StrandStaticCatalogue;
  const items = catalogue && Array.isArray(catalogue.items) ? catalogue.items : [];
  const cards = [];
  let category = 'all';

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function dimensions(item) {
    return item.width && item.height ? item.width + ' × ' + item.height + ' px' : 'PNG original';
  }

  function refresh() {
    let total = 0;
    cards.forEach(record => {
      const visible = !record.failed && (category === 'all' || record.item.category === category);
      record.card.hidden = !visible;
      if (visible) total++;
    });
    count.textContent = total + (total === 1 ? ' image' : ' images') +
      (category === 'all' ? ' dans le catalogue' : ' · ' + categoryNames[category].toLowerCase());
    empty.hidden = total !== 0;
  }

  function openImage(item) {
    document.getElementById('viewer-category').textContent = categoryNames[item.category] + ' · ' + item.kind;
    document.getElementById('viewer-title').textContent = item.title;
    viewerImage.src = item.src;
    viewerImage.alt = item.alt || item.title;
    document.getElementById('viewer-dimensions').textContent = dimensions(item);
    const download = document.getElementById('viewer-download');
    download.href = item.src;
    download.download = item.src.split('/').pop();
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else window.open(item.src, '_blank', 'noopener');
  }

  items.forEach(source => {
    if (!source || !categoryNames[source.category] || !source.src || !source.title) return;
    const item = {...source};
    const card = element('article', 'static-card');
    card.dataset.category = item.category;
    if (item.layout === 'wide' || item.category === 'stages') card.classList.add('static-wide');
    const visual = element('button', 'static-visual');
    visual.type = 'button';
    visual.setAttribute('aria-label', 'Agrandir : ' + item.title);
    const picture = element('img');
    picture.alt = item.alt || item.title;
    picture.loading = 'lazy';
    picture.decoding = 'async';
    if (item.width && item.height) {
      picture.width = item.width;
      picture.height = item.height;
    }
    const zoom = element('span', 'static-zoom', '↗');
    zoom.setAttribute('aria-hidden', 'true');
    visual.append(picture, zoom);
    visual.addEventListener('click', () => openImage(item));
    const caption = element('div', 'static-caption');
    caption.append(element('div', 'kicker', categoryNames[item.category] + ' · ' + item.kind));
    caption.append(element('h2', '', item.title));
    caption.append(element('p', '', item.description));
    const foot = element('div', 'static-cardfoot');
    const size = element('small', '', dimensions(item));
    const link = element('a', '', 'PNG original ↓');
    link.href = item.src;
    link.download = item.src.split('/').pop();
    link.setAttribute('aria-label', 'Télécharger ' + item.title + ' en PNG');
    foot.append(size, link);
    caption.append(foot);
    card.append(visual, caption);
    const record = {item, card, failed: false};
    cards.push(record);
    picture.addEventListener('load', () => {
      item.width = picture.naturalWidth;
      item.height = picture.naturalHeight;
      size.textContent = dimensions(item);
    });
    picture.addEventListener('error', () => {
      record.failed = true;
      refresh();
    });
    picture.src = item.src;
    grid.append(card);
  });

  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.category;
    filters.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    refresh();
  }));
  document.getElementById('preview-background').addEventListener('change', event => {
    document.body.dataset.preview = event.target.value === 'neutral' ? 'neutral' : 'dark';
  });
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => { viewerImage.removeAttribute('src'); });
  refresh();
})();
