const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});
  try {
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.addInitScript(() => {
      let time=0, sequence=0;
      const callbacks=new Map();
      window.requestAnimationFrame=fn=>{callbacks.set(++sequence,fn);return sequence;};
      window.cancelAnimationFrame=id=>callbacks.delete(id);
      window.advanceTrial=n=>{
        for (let i=0;i<n;i++) {
          const batch=[...callbacks.values()]; callbacks.clear(); time+=1000/60+.000001;
          batch.forEach(fn=>fn(time));
        }
      };
    });
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    const physics=await page.evaluate(()=>{
      const canvas=document.createElement('canvas');
      const received=[];
      StrandFight.start({canvas,p1:'sam',p2:'cliff',mode:'local',roundsToWin:1,startingVitality:12,parcel:true,sound:false,
        onEnd:result=>received.push(result)});
      const initial=StrandFight.snapshot();
      canvas.width=64;canvas.height=36;
      advanceTrial(74);
      StrandFight.input(2,'left',true); advanceTrial(75); StrandFight.input(2,'left',false);
      StrandFight.input(1,'guard',true); advanceTrial(2);
      const tap=key=>{StrandFight.input(2,key,true);StrandFight.input(2,key,false);};
      tap('light'); advanceTrial(22);
      const guarded=StrandFight.snapshot();
      StrandFight.input(1,'guard',false); advanceTrial(12);
      tap('heavy'); advanceTrial(45);
      const struck=StrandFight.snapshot();
      advanceTrial(148);
      StrandFight.stop();
      return {initial:initial.fighters[0].hp, guarded:guarded.parcel, guardHP:guarded.fighters[0].hp,
        broken:struck.parcel, result:received[0]};
    });
    assert.deepEqual([physics.initial,physics.guarded,physics.guardHP,physics.broken],[12,'intact',12,'broken']);
    assert.equal(physics.result.vitality,0);assert.equal(physics.result.parcel,'broken');assert.equal(physics.result.winner,2);
    await page.evaluate(()=>{
      const start=StrandFight.start;
      StrandFight.start=options=>{window.trialOptions=options;return start(options);};
      window.resolveTrial=(winner,vitality,parcel)=>trialOptions.onEnd({winner,vitality,parcel,rounds:winner===1?[1,0]:[0,1],reason:'ko'});
    });
    const act=name=>page.locator('[data-act="'+name+'"]').first().click();
    const resolve=(winner,hp,parcel)=>page.evaluate(args=>window.resolveTrial(...args),[winner,hp,parcel]);
    const mode=()=>page.locator('[data-mode="challenges"]').click();
    await mode();await act('start');await resolve(1,62,null);await act('trialFight');
    assert.equal(await page.evaluate(()=>StrandFight.snapshot().fighters[0].hp),77);
    await resolve(2,0,null);await act('retryTrial');
    assert.equal(await page.evaluate(()=>StrandFight.snapshot().fighters[0].hp),77);
    const opponents=[];
    for (let i=1;i<7;i++) {
      opponents.push(await page.evaluate(()=>trialOptions.p2));await resolve(1,97,null);
      if(i<6) {await act('trialFight');assert.equal(await page.evaluate(()=>StrandFight.snapshot().fighters[0].hp),100);}
    }
    assert.equal(new Set(opponents).size,6);assert.equal(await page.locator('main h1').innerText(),'Survie terminée');
    await act('selection');assert.match(await page.locator('main').innerText(),/sans reprise · 1 \/ 7/);
    assert.match(await page.locator('main').innerText(),/avec reprise · 7 \/ 7/);
    await page.locator('[data-option=challenge]').selectOption('delivery');await act('start');
    assert.equal(await page.evaluate(()=>StrandFight.snapshot().parcel),'intact');
    await resolve(1,60,'broken');assert.equal(await page.locator('main h1').innerText(),'Scellé rompu');
    await act('retryTrial');await resolve(1,100,'intact');assert.equal(await page.locator('main h1').innerText(),'Cargaison livrée');
    await page.reload();await act('gallery');assert.match(await page.locator('main').innerText(),/Sceau du camp/);
    assert.deepEqual(errors,[]);
    console.log('OK — report de vitalité avec plafond, sept adversaires, reprises, records séparés, garde du colis, rupture au contact et sceau persistant.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
