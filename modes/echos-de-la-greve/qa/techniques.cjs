const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined
  });
  try {
    const page = await browser.newPage();
    // Keep the real engine and its input buffer, and advance exactly one display frame at a time.
    await page.addInitScript(() => {
      let time = 0, id = 0;
      const pending = new Map();
      window.requestAnimationFrame = callback => {
        pending.set(++id, callback);
        return id;
      };
      window.cancelAnimationFrame = handle => pending.delete(handle);
      window.stepTestFrames = count => {
        for (let n = 0; n < count; n++) {
          const callbacks = [...pending.values()];
          pending.clear();
          time += 1000 / 60 + 0.000001;
          callbacks.forEach(fn => fn(time));
        }
      };
    });
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    const art = await page.evaluate(async () => {
      const files = new Set();
      for (const category of ['story','fighters','actions','steps','hits','portraits','stages','foregrounds','finishers','props']) {
        Object.values(StrandAssets[category]).forEach(src => files.add(src));
      }
      await Promise.all([...files].map(async src => {
        const img = new Image();
        img.src = src;
        try { await img.decode(); }
        catch { throw new Error('Illustration illisible : ' + src); }
      }));
      return {
        portraits: Object.keys(StrandAssets.portraits).sort(),
        finishers: Object.keys(StrandAssets.finishers).sort(),
        actions: Object.keys(StrandAssets.actions).sort(),
        fronts: Object.keys(StrandAssets.foregrounds).sort(),
        stages: Object.keys(StrandContent.stages).sort(),
        stageVariants: Object.fromEntries(Object.entries(StrandContent.arenas).filter(([,arena])=>arena.variantOf).map(([id,arena])=>[id,arena.variantOf])),
        rivals: ['sam', 'higgs'].map(id => StrandAssets.story[id + '-rival'])
      };
    });
    const roster = ['cliff','diehardman','fragile','heartman','higgs','mama','mule','sam'];
    assert.deepEqual(art.portraits, roster);
    assert.deepEqual(art.finishers, roster);
    assert.deepEqual(art.actions, roster);
    assert.equal(art.stages.length,11);
    assert.deepEqual(art.stageVariants,{'mule-camp-dry':'mule-camp'});
    assert.deepEqual(art.fronts, art.stages);
    assert.notEqual(art.rivals[0], art.rivals[1]);
    const results = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      const results = [];
      function start(id) {
        StrandFight.start({canvas, p1:id, p2:id, stage:'shore', mode:'local', sound:false});
        stepTestFrames(74);
      }
      function press(player, direction) {
        if (direction) StrandFight.input(player,direction,true);
        StrandFight.input(player,'special',true);
        StrandFight.input(player,'special',false);
        if (direction) StrandFight.input(player,direction,false);
      }
      for (const id of ['sam','fragile','higgs','cliff']) {
        for (const directions of [[null,null],['right','left'],['left','right']]) {
          start(id);
          directions.forEach((direction,i) => press(i + 1,direction));
          stepTestFrames(1);
          results.push(StrandFight.snapshot().fighters.map(f => f.action));
        }
      }
      start('fragile');
      press(1,'left');
      stepTestFrames(32);
      const beacon = StrandFight.snapshot().fighters[0].marker;
      StrandFight.input(1,'right',true);
      stepTestFrames(15);
      StrandFight.input(1,'right',false);
      const from = StrandFight.snapshot().fighters[0].x;
      press(1,'left');
      stepTestFrames(16);
      const back = StrandFight.snapshot().fighters[0];
      start('cliff');
      press(1,'right');
      stepTestFrames(40);
      const post = StrandFight.snapshot().fighters[0].marker;
      press(1,'left');
      stepTestFrames(14);
      const afterRecall = StrandFight.snapshot().fighters[0];
      StrandFight.stop();
      return {results, beacon, from, back, post, afterRecall};
    });
    const expected = [
      'sam','brace','parry','fragile','fan','beacon',
      'higgs','mine','feint','cliff','post','recall'
    ];
    assert.deepEqual(results.results, expected.map(key => [key,key]));
    assert.equal(results.beacon.kind,'beacon');
    assert.ok(results.from > results.beacon.x + 35);
    assert.equal(results.back.x,results.beacon.x);
    assert.equal(results.back.marker,null);
    assert.equal(results.post.kind,'post');
    assert.equal(results.afterRecall.marker,null);
    assert.equal(results.afterRecall.action,'recall');
    console.log('OK — 12 signatures et variantes, 2 côtés, entrée brève, balise de Fragile et rappel de Cliff sur le moteur réel.');

    for (const [index, id] of roster.entries()) {
      const player = index % 2 + 1;
      const result = await page.evaluate(async ({id, player}) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const drawImage = ctx.drawImage.bind(ctx);
        const shown = new Set();
        ctx.drawImage = (image, ...args) => {
          if (image.src?.includes('/finishers/')) shown.add(image.src.split('/').pop());
          return drawImage(image, ...args);
        };
        let outcome;
        const other = id === 'cliff' ? 'sam' : 'cliff';
        StrandFight.start({canvas, p1:player === 1 ? id : other, p2:player === 2 ? id : other,
          mode:'local', roundsToWin:1, sound:false, onEnd:value => {outcome = value;}});
        const preload = new Image();
        preload.src = StrandAssets.finishers[id];
        await preload.decode();
        stepTestFrames(74);
        StrandFight.input(player, player === 1 ? 'right' : 'left', true);
        for (let i = 0; i < 40 && StrandFight.snapshot().phase === 'fight'; i++) {
          stepTestFrames(22);
          if (StrandFight.snapshot().phase !== 'fight') break;
          StrandFight.input(player, 'heavy', true);
          StrandFight.input(player, 'heavy', false);
          stepTestFrames(23);
        }
        const invite = StrandFight.snapshot().phase;
        const before = [...shown];
        StrandFight.input(player, 'finish', true);
        stepTestFrames(60);
        const during = StrandFight.snapshot().phase;
        stepTestFrames(56);
        StrandFight.stop();
        return {invite, before, during, shown:[...shown], winner:outcome?.winner, finished:outcome?.finisher};
      }, {id, player});
      assert.deepEqual(result, {invite:'finish', before:[], during:'cinema', shown:[id + '.webp'], winner:player, finished:true});
    }
    console.log('OK — huit finalités après K.-O., illustration du vainqueur et résultat du duel.');
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
