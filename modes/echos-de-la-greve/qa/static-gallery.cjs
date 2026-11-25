'use strict';

// Exercise the shipped controller with a deliberately small DOM model.
// This checks state and callbacks, not native keyboard behavior or CSS layout.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'static-assets.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'static-assets.js'), 'utf8');
const source = fs.readFileSync(path.join(root, 'static-assets-data.js'), 'utf8');
const dataScope = {window: {}};
vm.runInNewContext(source, dataScope);
const catalogue = dataScope.window.StrandStaticCatalogue;
const categories = ['all', 'characters', 'enemies', 'projectiles', 'props', 'stages'];
const checks = [];
function check(name, run) { run(); checks.push(name); }

function harness(data) {
  let document;
  const opened = [];
  class Element {
    constructor(tag) {
      this.tagName = tag.toUpperCase(); this.children = []; this.dataset = {};
      this.attributes = {}; this.listeners = {}; this.className = ''; this.hidden = false;
      this.text = ''; this.open = false; this.scrollTop = 0; this.scrollLeft = 0;
      this.classList = {
        add: name => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), name])].join(' '); },
        contains: name => this.className.split(/\s+/).includes(name),
        toggle: (name, on) => {
          const names = new Set(this.className.split(/\s+/).filter(Boolean));
          if (on) names.add(name); else names.delete(name);
          this.className = [...names].join(' ');
        }
      };
    }
    set textContent(value) { this.text = String(value); this.children = []; }
    get textContent() { return this.text + this.children.map(child => child.textContent).join(''); }
    set innerHTML(_) { throw new Error('The gallery must keep catalogue text out of innerHTML.'); }
    append(...children) { children.forEach(child => { child.parentNode = this; this.children.push(child); }); }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    removeAttribute(name) { delete this.attributes[name]; delete this[name]; }
    addEventListener(type, listener) { (this.listeners[type] ||= []).push(listener); }
    emit(type, detail = {}) { (this.listeners[type] || []).forEach(listener => listener({target: this, ...detail})); }
    focus() { document.activeElement = this; }
    closest(selector) {
      for (let node = this; node; node = node.parentNode) if (selector === '[hidden]' && node.hidden) return node;
      return null;
    }
    get isConnected() { for (let node = this; node; node = node.parentNode) if (node === document.body) return true; return false; }
    showModal() { this.open = true; }
    close() { this.open = false; this.emit('close'); }
    getBoundingClientRect() { return {left: 50, right: 950, top: 50, bottom: 750}; }
  }
  const nodes = new Map();
  for (const match of html.matchAll(/<([a-z][a-z0-9]*)\b[^>]*\bid="([^"]+)"[^>]*>/g)) {
    assert(!nodes.has(match[2]), 'Duplicate HTML ID: ' + match[2]);
    const node = new Element(match[1]); node.id = match[2]; node.hidden = /\bhidden\b/.test(match[0]); nodes.set(node.id, node);
  }
  const filters = [...html.matchAll(/<button\b[^>]*data-category="([^"]+)"[^>]*>/g)].map(match => {
    const button = new Element('button'); button.dataset.category = match[1]; button.type = 'button';
    button.setAttribute('aria-pressed', /aria-pressed="true"/.test(match[0]) ? 'true' : 'false');
    return button;
  });
  document = {
    body: new Element('body'), activeElement: null,
    createElement: tag => new Element(tag), getElementById: id => nodes.get(id),
    querySelectorAll: selector => { assert.equal(selector, '.static-filters [data-category]'); return filters; }
  };
  nodes.forEach(node => document.body.append(node));
  filters.forEach(button => document.body.append(button));
  const window = {StrandStaticCatalogue: data, open: (...args) => opened.push(args)};
  vm.runInNewContext(script, {document, window});
  const cards = nodes.get('static-grid').children;
  const visible = () => cards.filter(card => !card.hidden);
  const chooseCategory = value => filters.find(button => button.dataset.category === value).emit('click');
  const chooseWork = value => { nodes.get('static-work').value = value; nodes.get('static-work').emit('change'); };
  return {document, nodes, filters, cards, visible, chooseCategory, chooseWork, opened};
}

const fixture = {items: [
  {id: 'legacy', title: 'Legacy', category: 'characters', kind: 'Silhouette', src: 'assets/legacy.png'},
  {id: 'ds2-character', title: '<img onerror=alert(1)>', category: 'characters', kind: 'Silhouette', work: 'ds2', version: 'Tenue <de test>', description: 'Texte <préservé>', src: 'assets/new.png', width: 100, height: 200},
  {id: 'ds2-prop', title: 'Objet', category: 'props', work: 'ds2', version: 'Variante objet', src: 'assets/prop.png'},
  {id: 'ds2-stage', title: 'Paysage', category: 'stages', work: 'ds2', version: 'Panorama', src: 'assets/stage.png'},
  {id: 'ds1-projectile', title: 'Grenade', category: 'projectiles', work: 'ds1-dc', version: 'Niveau 1', src: 'assets/grenade.png'},
  {id: 'ignored', title: 'Inconnu', category: 'unknown', work: 'ds2', src: 'assets/unknown.png'}
]};

check('The HTML exposes all categories, labeled work/background selectors and native button/dialog controls.', () => {
  const h = harness(fixture);
  assert.deepEqual(h.filters.map(button => button.dataset.category), categories);
  assert.match(html, /<label[^>]*>Œuvre\s*<select id="static-work">/);
  assert.match(html, /<dialog[^>]*id="static-viewer"[^>]*aria-labelledby="viewer-title"/);
  assert.match(html, /<form method="dialog"><button[^>]*type="submit"[^>]*autofocus/);
  assert.equal(h.cards.length, 5);
  assert.equal(h.cards[0].dataset.work, 'ds1-dc');
  assert.equal(h.nodes.get('static-count').textContent, '5 images dans le catalogue');
});
check('Work and category filters intersect in either order and preserve accessible pressed states.', () => {
  const h = harness(fixture);
  h.chooseWork('ds2'); assert.equal(h.visible().length, 3);
  h.chooseCategory('characters'); assert.equal(h.visible().length, 1);
  assert.equal(h.visible()[0].dataset.assetId, 'ds2-character');
  assert.equal(h.nodes.get('static-count').textContent, '1 image sur 5 dans le catalogue');
  h.chooseWork('ds1-dc'); assert.equal(h.visible()[0].dataset.assetId, 'legacy');
  h.chooseCategory('props'); assert.equal(h.visible().length, 0);
  assert.equal(h.filters.find(button => button.dataset.category === 'props').getAttribute('aria-pressed'), 'true');
  h.chooseWork('ds2'); assert.equal(h.visible()[0].dataset.assetId, 'ds2-prop');
});
check('Empty intersections offer a reset that restores both filters, the total and a visible focus target.', () => {
  const h = harness(fixture); h.chooseWork('ds1-dc'); h.chooseCategory('props');
  assert.equal(h.nodes.get('static-empty').hidden, false);
  assert.equal(h.nodes.get('static-reset').hidden, false);
  h.nodes.get('static-reset').emit('click');
  assert.equal(h.visible().length, 5); assert.equal(h.nodes.get('static-work').value, 'all');
  assert.equal(h.nodes.get('static-empty').hidden, true);
  assert.equal(h.document.activeElement.dataset.category, 'all');
});
check('Works and versions are presented as text in both cards and viewer; image proportions use native dimensions.', () => {
  const h = harness(fixture); const card = h.cards[1]; const visual = card.children[0];
  const caption = card.children[1];
  assert.equal(caption.children[1].textContent, '<img onerror=alert(1)>');
  assert.equal(caption.children[2].children[0].textContent, 'Tenue <de test>');
  visual.emit('click');
  assert.equal(h.nodes.get('viewer-title').textContent, '<img onerror=alert(1)>');
  assert.equal(h.nodes.get('viewer-origin').textContent, 'Death Stranding 2 · On the Beach · Tenue <de test>');
  const image = h.nodes.get('viewer-image'); image.naturalWidth = 1024; image.naturalHeight = 1536; image.emit('load');
  assert.equal(h.nodes.get('viewer-dimensions').textContent, '1024 × 1536 px');
});
check('Viewer and card downloads point to the same original PNG and retain a descriptive accessible name.', () => {
  const h = harness(fixture); const card = h.cards[1]; card.children[0].emit('click');
  const cardDownload = card.children[1].children.at(-1).children[1];
  const viewerDownload = h.nodes.get('viewer-download');
  assert.equal(cardDownload.href, 'assets/new.png'); assert.equal(viewerDownload.href, cardDownload.href);
  assert.equal(cardDownload.download, 'new.png'); assert.equal(viewerDownload.download, 'new.png');
  assert.match(viewerDownload.getAttribute('aria-label'), /Tenue <de test>/);
});
check('Zoom toggles fitted/original state, scroll accessibility, helper text and scroll origin.', () => {
  const h = harness(fixture); h.cards[1].children[0].emit('click');
  const panel = h.nodes.get('viewer-image-panel'); const zoom = h.nodes.get('viewer-zoom');
  zoom.emit('click'); assert.equal(zoom.getAttribute('aria-pressed'), 'true');
  assert(panel.classList.contains('is-zoomed')); assert.equal(panel.tabIndex, 0);
  assert.equal(h.nodes.get('viewer-zoom-hint').hidden, false);
  panel.scrollTop = 320; panel.scrollLeft = 120; zoom.emit('click');
  assert.equal(panel.scrollTop, 0); assert.equal(panel.scrollLeft, 0); assert.equal(panel.tabIndex, -1);
  assert.equal(zoom.textContent, 'Taille réelle');
});
check('Closing clears the displayed source, resets zoom and returns focus to the opener or a visible fallback.', () => {
  const h = harness(fixture); const opener = h.cards[1].children[0]; const viewer = h.nodes.get('static-viewer');
  opener.emit('click'); h.nodes.get('viewer-zoom').emit('click'); viewer.close();
  assert.equal(h.nodes.get('viewer-image').src, undefined);
  assert.equal(h.document.activeElement, opener); assert.equal(h.nodes.get('viewer-zoom').getAttribute('aria-pressed'), 'false');
  opener.emit('click'); h.cards[1].hidden = true; viewer.close();
  assert.equal(h.document.activeElement, h.nodes.get('static-work'));
});
check('Backdrop hit testing closes outside the dialog while an inside click preserves it.', () => {
  const h = harness(fixture); h.cards[0].children[0].emit('click'); const viewer = h.nodes.get('static-viewer');
  viewer.emit('click', {clientX: 80, clientY: 80}); assert.equal(viewer.open, true);
  viewer.emit('click', {clientX: 0, clientY: 0}); assert.equal(viewer.open, false);
});
check('Missing images leave both filtered and total counts; absent catalogues have a safe empty state.', () => {
  const h = harness(fixture); h.chooseWork('ds2'); h.cards[1].children[0].children[0].emit('error');
  assert.equal(h.visible().length, 2); assert.equal(h.nodes.get('static-count').textContent, '2 images sur 4 dans le catalogue');
  h.chooseCategory('characters'); assert.equal(h.visible().length, 0);
  const missing = harness(undefined); assert.equal(missing.cards.length, 0);
  assert.equal(missing.nodes.get('static-empty').hidden, false); assert.equal(missing.nodes.get('static-reset').hidden, true);
});
check('The background selector and non-dialog fallback preserve their supported behavior.', () => {
  const h = harness(fixture); const background = h.nodes.get('preview-background');
  background.value = 'neutral'; background.emit('change'); assert.equal(h.document.body.dataset.preview, 'neutral');
  background.value = 'invalid'; background.emit('change'); assert.equal(h.document.body.dataset.preview, 'dark');
  h.nodes.get('static-viewer').showModal = undefined; h.cards[0].children[0].emit('click');
  assert.deepEqual(h.opened, [['assets/legacy.png', '_blank', 'noopener']]);
});

const pngs = [];
check('Every real catalogue entry has a unique ID, a supported category and a readable original PNG at its declared size.', () => {
  const ids = new Set();
  for (const item of catalogue.items) {
    assert(item.id && !ids.has(item.id), 'Duplicate/missing ID'); ids.add(item.id);
    assert(categories.includes(item.category) && item.category !== 'all', 'Unsupported category: ' + item.category);
    assert(!item.work || ['ds1-dc', 'ds2'].includes(item.work), 'Unsupported work: ' + item.work);
    const location = path.resolve(root, item.src); assert(location.startsWith(root + path.sep));
    const bytes = fs.readFileSync(location); assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
    const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
    assert.equal(width, item.width, item.id + ' width'); assert.equal(height, item.height, item.id + ' height');
    pngs.push({id: item.id, work: item.work || 'ds1-dc', width, height});
  }
});
check('All work/category combinations match the real catalogue without a hard-coded item total.', () => {
  const h = harness(catalogue); assert.equal(h.cards.length, catalogue.items.length);
  for (const work of ['all', 'ds1-dc', 'ds2']) for (const category of categories) {
    h.chooseWork(work); h.chooseCategory(category);
    const expected = catalogue.items.filter(item => (work === 'all' || (item.work || 'ds1-dc') === work) && (category === 'all' || item.category === category));
    assert.equal(h.visible().length, expected.length, work + '/' + category);
  }
});

const hashes = {};
for (const name of ['static-assets.html', 'static-assets.css', 'static-assets.js', 'static-assets-data.js']) {
  hashes[name] = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex');
}
console.log(JSON.stringify({
  date: '2026-11-25', scope: 'Shipped gallery controller in a simulated DOM; actual catalogue PNG files',
  native_browser_rendering: false, layout_verified: false, native_keyboard_verified: false,
  checks_passed: checks.length, checks, actual_catalogue_total: catalogue.items.length,
  work_counts: Object.fromEntries(['ds1-dc', 'ds2'].map(work => [work, pngs.filter(item => item.work === work).length])),
  entries_without_work_or_version: catalogue.items.filter(item => !item.work || !item.version).map(item => item.id),
  original_pngs: pngs, source_sha256: hashes
}, null, 2));
