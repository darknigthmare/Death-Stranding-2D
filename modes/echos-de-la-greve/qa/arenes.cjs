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
    const errors = [];
    const captions = {};
    if (shots) fs.mkdirSync(shots, {recursive:true});

    async function openSelection(mode) {
      const page = await browser.newPage({viewport:{width:1440,height:1000}});
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        let time = 0, next = 0;
        const pending = new Map();
        window.requestAnimationFrame = fn => { pending.set(++next, fn); return next; };
        window.cancelAnimationFrame = key => pending.delete(key);
        window.layerPositions = {};
        window.advanceFrames = async count => {
          const canvas = document.getElementById('arena');
          for (let i = 0; i < count; i++) {
            time += 1000 / 60 + .000001;
            const current = [...pending.values()];
            pending.clear();
            window.layerPositions = {};
            for (const fn of current) fn(time);
            // Submit small batches so headless Chromium doesn't retain a duel's draw commands.
            if (i % 8 === 7 || i === count - 1) {
              const frame = await createImageBitmap(canvas);
              frame.close();
            }
          }
        };
        window.resizeTarget = scale => {
          const canvas = document.getElementById('arena');
          canvas.width = 1280 * scale;
          canvas.height = 720 * scale;
          canvas.getContext('2d').scale(scale,scale);
        };
        const draw = CanvasRenderingContext2D.prototype.drawImage;
        CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
          if (this.canvas.id === 'arena' && image.src?.includes('/assets/stages/')) {
            window.layerPositions[image.src.split('/').pop()] = args.length === 8 ? args[4] : args[0];
          }
          return draw.call(this,image,...args);
        };
      });
      await page.goto(menu);
      await page.locator('[data-mode="' + mode + '"]').click();
      const options = await page.locator('[data-option=stage] option').evaluateAll(items =>
        items.map(item => item.value));
      assert.deepEqual(options.sort(),required.slice().sort());
      await page.locator('[data-act=pick][data-id=higgs]').click();
      if (mode === 'versus') await page.locator('[data-option=opponent]').selectOption('local');
      await page.locator('[data-option=p2]').selectOption('fragile');
      return page;
    }

    async function travel(page,mode,direction) {
      const key = direction > 0 ? 'd' : 'q';
      const secondKey = direction > 0 ? 'ArrowRight' : 'ArrowLeft';
      await page.keyboard.down(key);
      if (mode === 'versus') await page.keyboard.down(secondKey);
      await page.evaluate(() => advanceFrames(32));
      await page.keyboard.up(key);
      if (mode === 'versus') await page.keyboard.up(secondKey);
      return page.evaluate(async () => {
        await advanceFrames(22);
        return {layers:{...layerPositions},state:StrandFight.snapshot()};
      });
    }

    for (const mode of ['versus','training']) {
      // A fresh renderer context releases decoded scenery from the preceding three arenas.
      for (let index = 0; index < required.length; index += 3) {
        const page = await openSelection(mode);
        try {
          for (const id of required.slice(index,index+3)) {
            const stageSelect = page.locator('[data-option=stage]');
            await stageSelect.selectOption(id);
            const title = await stageSelect.locator('option:checked').innerText();
            const back = id + '.webp', front = id + '-foreground.webp';
            const middle = 'shore-midground.png';
            const ordered = id === 'shore' ? [back,middle,front] : [back,front];
            await page.locator('[data-act=start]').click();
            let previous = await page.evaluate(async files => {
              resizeTarget(1/8);
              const sources = files.map(file => 'assets/stages/' + file).concat([
                StrandAssets.fighters.higgs, StrandAssets.fighters.fragile
              ]);
              await Promise.all(sources.map(async src => {
                const image = new Image();
                image.src = src;
                await image.decode();
              }));
              await advanceFrames(78);
              return {layers:{...layerPositions},state:StrandFight.snapshot()};
            }, ordered);
            assert.equal(previous.state.stage,id);
            assert.deepEqual(Object.keys(previous.layers),ordered,'Ordre des plans : ' + id);
            for (const direction of [1,-1]) {
              const after = await travel(page,mode,direction);
              assert.deepEqual(Object.keys(after.layers),ordered);
              for (let i=0; i < (mode === 'versus' ? 2 : 1); i++) {
                assert((after.state.fighters[i].x-previous.state.fighters[i].x)*direction > 20);
              }
              const displacement = file => (previous.layers[file] - after.layers[file]) * direction;
              const rearPan = displacement(back), nearPan = displacement(front);
              const label = mode + ' / ' + id + ' (direction ' + direction + ')';
              assert(rearPan > 0 && nearPan > rearPan,'Parallaxe arrière et avant : ' + label);
              if (id === 'shore') {
                const midPan = displacement(middle);
                assert(midPan > rearPan && nearPan > midPan,'Parallaxe du rivage : ' + label);
                assert(Math.abs(midPan/rearPan - .43/.14) < .02,'Vitesse du rivage : ' + label);
                assert(Math.abs(nearPan/rearPan - .8/.14) < .02,'Vitesse du premier plan : ' + label);
              }
              if (shots && mode === 'versus' && direction === 1) {
                await page.evaluate(async () => {resizeTarget(1);await advanceFrames(1);});
                await page.locator('#arena').screenshot({path:path.join(shots,id+'.png')});
                captions[id] = title;
                await page.evaluate(() => resizeTarget(1/8));
              }
              previous = after;
            }
            await page.getByRole('button',{name:'Pause',exact:true}).click();
            await page.locator('[data-act=leave]').click();
          }
        } finally {await page.close();}
      }
    }
    if (shots) fs.writeFileSync(path.join(shots, 'titres.json'), JSON.stringify(captions));
    assert.deepEqual(errors, []);
    console.log('OK — 10 arènes dans les deux sens en Versus et Entraînement, dont trois plans sur la Grève.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
