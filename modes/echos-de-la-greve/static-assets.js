(() => {
  'use strict';
  const categoryNames = {
    characters: 'Personnages', enemies: 'Ennemis',
    projectiles: 'Projectiles', props: 'Objets et véhicules', stages: 'Décors · Panorama'
  };
  const workNames = {
    'ds1-dc': 'Death Stranding / Director’s Cut',
    ds2: 'Death Stranding 2 · On the Beach'
  };
  const grid = document.getElementById('static-grid');
  const count = document.getElementById('static-count');
  const empty = document.getElementById('static-empty');
  const viewer = document.getElementById('static-viewer');
  const viewerImage = document.getElementById('viewer-image');
  const imagePanel = document.getElementById('viewer-image-panel');
  const zoomButton = document.getElementById('viewer-zoom');
  const workFilter = document.getElementById('static-work');
  const resetButton = document.getElementById('static-reset');
  const filters = Array.from(document.querySelectorAll('.static-filters [data-category]'));
  const catalogue = window.StrandStaticCatalogue;
  const items = catalogue && Array.isArray(catalogue.items) ? catalogue.items : [];
  const cards = [];
  let category = 'all';
  let work = 'all';
  let currentItem = null;
  let previousFocus = null;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function dimensions(item) {
    return item.width && item.height ? item.width + ' × ' + item.height + ' px' : 'PNG original';
  }

  function origin(item) {
    const title = workNames[item.work] || 'Univers Death Stranding';
    return item.version ? title + ' · ' + item.version : title;
  }

  function kind(item) {
    return categoryNames[item.category] + (item.kind ? ' · ' + item.kind : '');
  }

  function refresh() {
    let total = 0;
    const available = cards.filter(record => !record.failed).length;
    cards.forEach(record => {
      const visible = !record.failed && (category === 'all' || record.item.category === category) &&
        (work === 'all' || record.item.work === work);
      record.card.hidden = !visible;
      if (visible) total++;
    });
    count.textContent = total + (total === 1 ? ' image' : ' images') +
      (category === 'all' && work === 'all' ? ' dans le catalogue' : ' sur ' + available + ' dans le catalogue');
    empty.hidden = total !== 0;
    resetButton.hidden = category === 'all' && work === 'all';
    document.getElementById('static-empty-message').textContent = available === 0 ?
      'Aucune image n’est disponible pour le moment.' :
      'Aucune image ne correspond à cette œuvre et à cette catégorie.';
  }

  function setZoom(zoomed) {
    imagePanel.classList.toggle('is-zoomed', zoomed);
    imagePanel.tabIndex = zoomed ? 0 : -1;
    imagePanel.scrollTop = 0;
    imagePanel.scrollLeft = 0;
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    zoomButton.textContent = zoomed ? 'Adapter à l’écran' : 'Taille réelle';
    document.getElementById('viewer-zoom-hint').hidden = !zoomed;
  }

  function openImage(item, opener) {
    previousFocus = opener;
    currentItem = item;
    setZoom(false);
    document.getElementById('viewer-category').textContent = kind(item);
    document.getElementById('viewer-title').textContent = item.title;
    document.getElementById('viewer-origin').textContent = origin(item);
    viewerImage.src = item.src;
    viewerImage.alt = item.alt || item.title;
    document.getElementById('viewer-dimensions').textContent = dimensions(item);
    const download = document.getElementById('viewer-download');
    download.href = item.src;
    download.download = item.src.split('/').pop();
    download.setAttribute('aria-label', 'Télécharger ' + item.title + ' · ' + origin(item) + ' en PNG');
    if (typeof viewer.showModal === 'function') {
      if (!viewer.open) viewer.showModal();
    }
    else window.open(item.src, '_blank', 'noopener');
  }

  items.forEach(source => {
    if (!source || !categoryNames[source.category] || !source.src || !source.title) return;
    const item = {...source, work: source.work || 'ds1-dc',
      version: typeof source.version === 'string' ? source.version.trim() : ''};
    const card = element('article', 'static-card');
    card.dataset.category = item.category;
    card.dataset.work = item.work;
    if (item.id) card.dataset.assetId = item.id;
    if (item.layout === 'wide' || item.category === 'stages') card.classList.add('static-wide');
    const visual = element('button', 'static-visual');
    visual.type = 'button';
    visual.setAttribute('aria-label', 'Agrandir : ' + item.title + ' · ' + origin(item));
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
    visual.addEventListener('click', () => openImage(item, visual));
    const caption = element('div', 'static-caption');
    caption.append(element('div', 'kicker', kind(item)));
    caption.append(element('h2', '', item.title));
    const provenance = element('p', 'static-origin', workNames[item.work] || 'Univers Death Stranding');
    if (item.version) provenance.append(element('span', 'static-version', item.version));
    caption.append(provenance, element('p', 'static-description', item.description));
    const foot = element('div', 'static-cardfoot');
    const size = element('small', '', dimensions(item));
    const link = element('a', '', 'PNG original ↓');
    link.href = item.src;
    link.download = item.src.split('/').pop();
    link.setAttribute('aria-label', 'Télécharger ' + item.title + ' · ' + origin(item) + ' en PNG');
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
  workFilter.addEventListener('change', () => {
    work = Object.prototype.hasOwnProperty.call(workNames, workFilter.value) ? workFilter.value : 'all';
    refresh();
  });
  resetButton.addEventListener('click', () => {
    category = 'all';
    work = 'all';
    workFilter.value = 'all';
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === 'all')));
    refresh();
    filters.find(button => button.dataset.category === 'all').focus();
  });
  document.getElementById('preview-background').addEventListener('change', event => {
    document.body.dataset.preview = event.target.value === 'neutral' ? 'neutral' : 'dark';
  });
  zoomButton.addEventListener('click', () => setZoom(zoomButton.getAttribute('aria-pressed') !== 'true'));
  viewerImage.addEventListener('load', () => {
    if (!currentItem) return;
    currentItem.width = viewerImage.naturalWidth;
    currentItem.height = viewerImage.naturalHeight;
    document.getElementById('viewer-dimensions').textContent = dimensions(currentItem);
  });
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
  viewer.addEventListener('close', () => {
    viewerImage.removeAttribute('src');
    currentItem = null;
    setZoom(false);
    if (previousFocus && previousFocus.isConnected && !previousFocus.closest('[hidden]')) {
      previousFocus.focus({preventScroll: true});
    } else workFilter.focus({preventScroll: true});
    previousFocus = null;
  });
  refresh();
})();
