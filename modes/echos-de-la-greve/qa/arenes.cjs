const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

const menu = pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const shots = process.env.ARENA_SCREENSHOTS;
const required = [
  'shore', 'terminal', 'battlefield', 'mule-camp', 'mule-camp-dry', 'heartman-lab',
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
        window.layerRects = {};
        window.layerSizes = {};
        window.advanceFrames = async count => {
          const canvas = document.getElementById('arena');
          for (let i = 0; i < count; i++) {
            time += 1000 / 60 + .000001;
            const current = [...pending.values()];
            pending.clear();
            window.layerPositions = {};
            window.layerRects = {};
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
            const rectangle=args.length===8?args.slice(4):args;
            window.layerPositions[image.src.split('/').pop()] = rectangle[0];
            window.layerRects[image.src.split('/').pop()] = rectangle;
            window.layerSizes[image.src.split('/').pop()] = [image.naturalWidth,image.naturalHeight];
          }
          return draw.call(this,image,...args);
        };
      });
      await page.goto(menu);
      const inventories=await page.evaluate(()=>Object.fromEntries(
        ['skyplates','distants','midgrounds','floors','foregrounds'].map(key=>[key,Object.keys(StrandAssets[key] || {}).sort()])));
      for (const [key,ids] of Object.entries(inventories)) assert.deepEqual(ids,required.slice().sort(),key+' : les dix lieux et la variante sèche doivent être livrés');
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
        return {layers:{...layerPositions},rects:{...layerRects},sizes:{...layerSizes},state:StrandFight.snapshot()};
      });
    }

    for (const mode of ['versus','training']) {
      // A fresh renderer context releases decoded scenery from the preceding three arenas.
      for (let index = 0; index < required.length; index += 3) {
        const page = await openSelection(mode);
        try {
          for (const id of required.slice(index,index+3)) {
            const normalMotion=[];
            for (const reducedEffects of [false,true]) {
            const stageSelect = page.locator('[data-option=stage]');
            await stageSelect.selectOption(id);
            const title = await stageSelect.locator('option:checked').innerText();
            const ordered=await page.evaluate(id=>['skyplates','distants','midgrounds','floors','foregrounds']
              .map(key=>StrandAssets[key][id].split('/').pop()),id);
            const [back,distant,middle,floor,front]=ordered;
            await page.locator('[data-act=start]').click();
            let previous = await page.evaluate(async ({files,reducedEffects}) => {
              StrandFight.setReducedEffects(reducedEffects);
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
              return {layers:{...layerPositions},rects:{...layerRects},sizes:{...layerSizes},state:StrandFight.snapshot()};
            }, {files:ordered,reducedEffects});
            assert.equal(previous.state.stage,id);
            assert.equal(previous.state.reducedEffects,reducedEffects);
            assert.deepEqual(Object.keys(previous.layers),ordered,'Ordre des plans : ' + id);
            for (const direction of [1,-1]) {
              const after = await travel(page,mode,direction);
              assert.deepEqual(Object.keys(after.layers),ordered);
              for (let i=0; i < (mode === 'versus' ? 2 : 1); i++) {
                assert((after.state.fighters[i].x-previous.state.fighters[i].x)*direction > 20);
              }
              const displacement = file => (previous.layers[file] - after.layers[file]) * direction;
              const label = mode + ' / ' + id + ' (direction ' + direction + ', effets réduits ' + reducedEffects + ')';
              const shifts=ordered.map(displacement), speeds=[.14,.27,.43,.62,.8];
              assert(shifts[0]>0,'Déplacement du ciel : '+label);
              for (let layer=1;layer<ordered.length;layer++) {
                assert(shifts[layer]>shifts[layer-1],'Vitesses croissantes : '+label);
                assert(Math.abs(shifts[layer]/shifts[0]-speeds[layer]/speeds[0])<.02,'Vitesse '+ordered[layer]+' : '+label);
              }
              for (const file of ordered) {
                const [x,,width,height]=after.rects[file];
                const [sourceWidth,sourceHeight]=after.sizes[file];
                assert(x<=0 && x+width>=1280,'Débord horizontal : '+file+' / '+label);
                assert(Math.abs(width/height-sourceWidth/sourceHeight)<.00001,'Proportions préservées : '+file+' / '+label);
              }
              const [,floorY,,floorHeight]=after.rects[floor];
              const floorAnchor=await page.evaluate(id=>StrandAssets.stageGeometry[id]?.floor?.anchorY ?? .3,id);
              assert(Math.abs(floorY+floorHeight*floorAnchor-588)<.01,'Ligne de sol : '+label);
              assert(floorY+floorHeight>=720,'Sol plein jusqu’au bas : '+label);
              if (reducedEffects) {
                const expected=normalMotion[direction===1?0:1];
                for (let layer=0;layer<shifts.length;layer++) {
                  assert(Math.abs(shifts[layer]/expected[layer]-.2)<.005,'Amplitude réduite à 20 % : '+label);
                }
              } else {
                normalMotion.push(shifts);
              }
              if (shots && mode === 'versus' && direction === 1 && !reducedEffects) {
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
          }
        } finally {await page.close();}
      }
    }
    if (shots) fs.writeFileSync(path.join(shots, 'titres.json'), JSON.stringify(captions));
    assert.deepEqual(errors, []);
    console.log('OK — 11 configurations d’arène × 2 modes × 2 directions × 2 réglages : cinq plans chargés dans l’ordre, proportions conservées, vitesses distinctes, sol à 588, bords pleins et mouvement réduit à 20 %.');
  } finally { await browser.close(); }
})().catch(error => {console.error(error); process.exitCode = 1;});
