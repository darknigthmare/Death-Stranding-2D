const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

const menu = pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const shots = process.env.ARENA_SCREENSHOTS;
const required = [
  'shore', 'terminal', 'battlefield', 'mule-camp', 'heartman-lab',
  'mama-workshop', 'ruined-factory', 'timefall-shelter', 'tar-basin', 'mountain-pass'
];

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined
  });
  try {
    const page = await browser.newPage({viewport:{width:1440, height:1000}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      let time = 0, next = 0;
      const pending = new Map();
      window.requestAnimationFrame = fn => { pending.set(++next, fn); return next; };
      window.cancelAnimationFrame = key => pending.delete(key);
      window.advanceFrames = count => {
        for (let i = 0; i < count; i++) {
          time += 1000 / 60 + .000001;
          const current = [...pending.values()];
          pending.clear();
          for (const fn of current) fn(time);
        }
      };
      window.layerPositions = {};
      const draw = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
        if (this.canvas.id === 'arena' && image.src?.includes('/assets/stages/')) {
          window.layerPositions[image.src.split('/').pop()] = args[0];
        }
        return draw.call(this, image, ...args);
      };
    });

    if (shots) fs.mkdirSync(shots, {recursive:true});
    const captions = {};
    for (const mode of ['versus', 'training']) {
      await page.goto(menu);
      await page.locator('[data-mode="' + mode + '"]').click();
      const stageSelect = page.locator('[data-option=stage]');
      const stages = await stageSelect.locator('option').evaluateAll(options =>
        options.map(option => [option.value, option.textContent]));
      assert.deepEqual(stages.map(([id]) => id).sort(), required.slice().sort());
      await page.locator('[data-act=pick][data-id=higgs]').click();
      if (mode === 'versus') await page.locator('[data-option=opponent]').selectOption('local');
      await page.locator('[data-option=p2]').selectOption('fragile');

      for (const [id, title] of stages) {
        await stageSelect.selectOption(id);
        await page.locator('[data-act=start]').click();
        const before = await page.evaluate(async stage => {
          const sources = [
            StrandAssets.stages[stage], StrandAssets.foregrounds[stage],
            StrandAssets.fighters.higgs, StrandAssets.fighters.fragile
          ];
          await Promise.all(sources.map(async src => {
            const image = new Image();
            image.src = src;
            await image.decode();
          }));
          window.layerPositions = {};
          advanceFrames(78);
          return {layers:{...layerPositions}, state:StrandFight.snapshot()};
        }, id);
        const back = id + '.webp';
        const front = id + '-foreground.webp';
        assert.equal(before.state.stage, id);
        assert.deepEqual(Object.keys(before.layers).sort(), [back, front].sort());

        await page.keyboard.down('d');
        if (mode === 'versus') await page.keyboard.down('ArrowRight');
        await page.evaluate(() => advanceFrames(28));
        await page.keyboard.up('d');
        if (mode === 'versus') await page.keyboard.up('ArrowRight');
        const after = await page.evaluate(() => {
          advanceFrames(12);
          return {layers:{...layerPositions}, state:StrandFight.snapshot()};
        });
        assert(after.state.fighters[0].x > before.state.fighters[0].x + 20);
        if (mode === 'versus') assert(after.state.fighters[1].x > before.state.fighters[1].x + 20);
        const pan = before.layers[back] - after.layers[back];
        const nearPan = before.layers[front] - after.layers[front];
        assert(pan > 0, mode + ' / ' + id + ' panorama immobile');
        assert(nearPan > pan, mode + ' / ' + id + ' premier plan immobile');
        if (shots && mode === 'versus') {
          await page.locator('#arena').screenshot({path:path.join(shots, id + '.png')});
          captions[id] = title;
        }
        await page.getByRole('button', {name:'Pause', exact:true}).click();
        await page.locator('[data-act=leave]').click();
      }
    }
    if (shots) fs.writeFileSync(path.join(shots, 'titres.json'), JSON.stringify(captions));
    assert.deepEqual(errors, []);
    console.log('OK — 10 arènes en Versus et en Entraînement ; deux plans réellement dessinés et défilement différentiel après déplacement.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
