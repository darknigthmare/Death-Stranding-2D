const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});
  try {
    const page = await browser.newPage();
    const failures = [];
    page.on('requestfailed', request => failures.push(request.url()));
    page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
    await page.goto(pathToFileURL(path.resolve(__dirname, '../index.html')).href);
    const runs = await page.evaluate(async () => {
      const queue = new Map();
      let time = 0, sequence = 0;
      window.requestAnimationFrame = fn => { queue.set(++sequence, fn); return sequence; };
      window.cancelAnimationFrame = id => queue.delete(id);
      function tick(count) {
        for (let n = 0; n < count; n++) {
          time += 1000 / 60 + .000001;
          const callbacks = [...queue.values()];
          queue.clear();
          callbacks.forEach(fn => fn(time));
        }
      }
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const draw = ctx.drawImage.bind(ctx);
      const seen = new Set();
      ctx.drawImage = (image, ...args) => {
        if (image.src?.includes('/assets/fighters/')) {
          seen.add(image.src + '/' + Math.sign(ctx.getTransform().a));
        }
        return draw(image, ...args);
      };
      const preload = [...Object.values(StrandAssets.fighters), ...Object.values(StrandAssets.steps), ...Object.values(StrandAssets.hits),
        ...Object.values(StrandAssets.wardrobe || {}).flatMap(kits => Object.values(kits.atelier?.poses || {})),
        ...Object.values(StrandAssets.poses || {}).flatMap(poses => Object.values(poses))];
      await Promise.all(preload.map(async src => { const image = new Image(); image.src = src; await image.decode(); }));
      const results = [];
      for (const id of Object.keys(StrandContent.fighters)) {
        for (const side of [1,2]) {
          const other = 3 - side, opposite = id === 'sam' ? 'cliff' : 'sam';
          StrandFight.start({canvas, p1:side === 1 ? id : opposite, p2:side === 2 ? id : opposite, mode:'local', sound:false});
          await new Promise(resolve => setTimeout(resolve, 0));
          tick(75);
          seen.clear();
          StrandFight.input(1, 'right', true);
          StrandFight.input(2, 'left', true);
          tick(47);
          StrandFight.input(1, 'right', false);
          StrandFight.input(2, 'left', false);
          const facing = side === 1 ? 1 : -1;
          const pose = kind => {
            const category = {stance:'fighters',step:'steps',hit:'hits',guard:'fighters'}[kind];
            const source = StrandAssets.wardrobe?.[id]?.atelier?.poses?.[kind] || StrandAssets.poses?.[id]?.[kind] || StrandAssets[category]?.[id];
            return seen.has(new URL(source, location.href).href + '/' + facing);
          };
          const step = pose('step'), stance = pose('stance');
          seen.clear();
          StrandFight.input(side, 'guard', true);
          StrandFight.input(other, 'light', true);
          StrandFight.input(other, 'light', false);
          tick(16);
          const block = StrandFight.snapshot().fighters[side - 1];
          const blockHit = pose('hit'), blockStance = pose('guard');
          tick(14);
          seen.clear();
          StrandFight.input(side, 'guard', false);
          StrandFight.input(other, 'light', true);
          StrandFight.input(other, 'light', false);
          tick(9);
          const impact = StrandFight.snapshot().fighters[side - 1];
          results.push({id, side, step, stance, blockHit, blockStance, block, impact, hit:pose('hit')});
          StrandFight.stop();
        }
      }
      return results;
    });
    for (const r of runs) {
      const label = r.id + ' J' + r.side;
      assert.equal(r.stance, true, label);
      assert.equal(r.step, true, label + ' marche');
      assert.ok(r.block.guard && r.block.hp === 100 && r.block.balance < 100, label + ' garde réussie');
      assert.ok(r.blockStance && !r.blockHit, label + ' dessin de garde');
      assert.ok(r.impact.hp < 100 && r.impact.stun > 0, label + ' coup reçu');
      assert.equal(r.hit, true, label + ' réaction au coup');
    }
    assert.deepEqual(failures, []);
    console.log('OK — huit combattants dans les deux sens, pas, garde et réaction après impact, aucun fichier manquant.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
