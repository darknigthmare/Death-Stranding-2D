const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname,'..');
const mock = `window.StrandFight = {start(options){this.options=options;this.inputs=[];options.onStatus({phase:'intro',training:{...options.training,frames:0,position:0}});},stop(){this.stops=(this.stops||0)+1},setSound(on){this.sound=on},pause(on){this.paused=on},input(player,action,down){this.inputs.push([player,action,down])},setTraining(settings){this.training={...this.training,...settings}},end(winner){this.options.onEnd({winner,rounds:winner===1?[2,0]:[1,2],reason:'ko',finisher:false})}}`;
(async () => {
  const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined, args:['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:1280,height:800}});
  const errors = [];
  page.on('pageerror',error => errors.push(error.message));
  await page.route('http://ui.test/**',async route => {
    const name = new URL(route.request().url()).pathname.split('/').pop() || 'index.html';
    let body;
    if (name === 'fight.js') body = mock;
    else if (name === 'assets.js') body = 'window.StrandAssets = {}';
    else if (fs.existsSync(path.join(root,name))) body=fs.readFileSync(path.join(root,name));
    else return route.fulfill({status:404,body:''});
    return route.fulfill({body,contentType:name.endsWith('css') ? 'text/css' : name.endsWith('js') ? 'application/javascript' : 'text/html'});
  });
  await page.goto('http://ui.test/modes/echos-de-la-greve/index.html');
  const act = async action => {
    await page.locator('[data-act="'+action+'"]').first().click();
    if(['start','routeFight'].includes(action)&&await page.locator('[data-act="enterDuel"]').count())await page.locator('[data-act="enterDuel"]').click();
  };
  const mode = value => page.locator('[data-act="mode"][data-mode="'+value+'"]').click();
  const pick = id => page.locator('[data-act="pick"][data-id="'+id+'"]').click();
  const end = winner => page.evaluate(win => StrandFight.end(win),winner);
  for (const id of ['sam','higgs','cliff','fragile','mule','diehardman','mama','heartman']) {
    await mode('story'); await pick(id); await act('start');
    assert.match(await page.locator('.speaker').textContent(),/Introduction/);
    await act('routeFight'); let p1 = await page.evaluate(() => StrandFight.options.p1); assert.equal(p1,id);
    if (id === 'sam') {
      await end(2); await act('routeFight');
      await act('pause'); assert.equal(await page.evaluate(()=>StrandFight.paused),true);
      await act('pause');
      await page.keyboard.down('d'); await page.keyboard.up('d');
      assert.deepEqual(await page.evaluate(()=>StrandFight.inputs.slice(-2)),[[1,'right',true],[1,'right',false]]);
      await act('controls'); assert.equal(await page.locator('dialog').evaluate(el=>el.open),true);
      assert.match(await page.locator('dialog').textContent(),/Reprise d’appui/);
      await page.locator('dialog form[method="dialog"] button').click();
      await page.waitForFunction(()=>StrandFight.paused===false,{},{timeout:2500});
    }
    await end(1); await act('routeFight'); await end(1); await act('rival'); assert.match(await page.locator('.speaker').textContent(),/Rivalité/);
    await act('routeFight'); await end(1); await act('ending'); assert.match(await page.locator('.speaker').textContent(),/Épilogue/); await act('home');
  }
  await act('gallery'); assert.equal(await page.locator('[data-act=replay]').count(),24); await act('replay'); await act('gallery'); await act('home');
  await mode('arcade'); await act('start'); await end(1); await act('routeFight'); await end(1); await act('routeFight'); await end(1);
  assert.match(await page.locator('.result').textContent(),/trois adversaires/); await act('home');
  await mode('versus'); await page.locator('[data-option=opponent]').selectOption('local'); await act('start');
  await page.keyboard.down('ArrowLeft'); await page.keyboard.up('ArrowLeft');
  assert.deepEqual(await page.evaluate(()=>StrandFight.inputs.slice(-2)),[[2,'left',true],[2,'left',false]]);
  await end(2); await act('start'); await act('pause'); await act('leave'); await act('home');
  await mode('training'); await act('start'); await page.locator('#dummy').selectOption('guard'); await page.locator('#boxes').check();
  assert.deepEqual(await page.evaluate(()=>StrandFight.training),{dummy:'guard',hitboxes:true}); await act('resetTraining');
  await act('pause'); await act('leave'); await act('home');
  for (const count of ['4','6','8']) {
    await mode('tournament'); await page.locator('[data-option=count]').selectOption(count); await page.locator('[data-option=humans]').selectOption('2'); await act('start');
    const expectedStage = await page.evaluate(legacy => {
      const cup = JSON.parse(localStorage.getItem('echos.v1.cup'));
      const arenas = Object.keys(StrandContent.stages);
      if (!cup.rounds.flat().every(match => match.stage === arenas[match.seed % arenas.length]))
        throw new Error('Arène du tableau non enregistrée');
      if (legacy) {
        for (const match of cup.rounds.flat()) delete match.stage;
        localStorage.setItem('echos.v1.cup',JSON.stringify(cup));
      }
      const next = StrandTournament.next(cup);
      return next.stage || ['shore','terminal','battlefield'][next.seed % 3];
    }, count === '4');
    await page.reload(); await mode('tournament'); await act('bracket');
    for (let i=0;i<10;i++) {
      if (!await page.locator('[data-act=cupFight]').count()) break;
      if (count === '6' && i === 0) {
        await page.reload(); await mode('tournament'); await act('bracket'); assert.match(await page.locator('.pair').allTextContents().then(a=>a.join(' ')),/Qualification directe/);
      }
      await act('cupFight');
      if (i === 0) assert.equal(await page.evaluate(()=>StrandFight.options.stage),expectedStage);
      await end(i%2===0?2:1); await act('bracket');
    }
    assert.match(await page.locator('main h1').textContent(),/Champion/);
    let saved = await page.evaluate(()=>JSON.parse(localStorage.getItem('echos.v1.cup')));
    const scored=saved.rounds.flat().filter(m=>m.score).length;
    assert.equal(scored,Number(count)-1); assert.equal(saved.rounds.flat().every(m=>m.winner!==null),true);
    await act('home');
  }
  await page.setViewportSize({width:390,height:844});
  await mode('versus');await act('start');
  const pointer = page.locator('[data-p="1"][data-input="light"]');
  await pointer.click();assert.deepEqual(await page.evaluate(()=>StrandFight.inputs.slice(-2)),[[1,'light',true],[1,'light',false]]);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
  assert.deepEqual(errors,[]);
  await browser.close();
  console.log('OK — 8 campagnes, 24 scènes, arcade, revanche et J2, dojo, pause, commandes tactiles/clavier, tournois 4/6/8 avec reprise.');
})().catch(error=>{console.error(error);process.exit(1)});
