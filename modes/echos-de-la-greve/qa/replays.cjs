const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

(async()=>{
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});
  try {
    const page=await browser.newPage();
    const errors=[];
    page.on('pageerror',err=>errors.push(err.message));
    await page.addInitScript(()=>{
      // No graphics assets are needed for a comparison of simulation states.
      Object.defineProperty(window,'StrandAssets',{get:()=>({}),set:()=>{}});
      let time=0,seq=0;
      const frames=new Map();
      window.requestAnimationFrame=fn=>{frames.set(++seq,fn);return seq;};
      window.cancelAnimationFrame=id=>frames.delete(id);
      window.advance=()=>{
        const list=Array.from(frames.values()); frames.clear(); time+=1000/60+.000001;
        for (const fn of list) fn(time);
      };
      window.smallCanvas=()=>{
        const c=document.querySelector('#arena');
        c.width=64; c.height=36; c.getContext('2d').scale(.05,.05);
      };
    });
    const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
    await page.goto(url);
    for (const humans of [2,1]) {
      const setup=await page.evaluate(humans=>{
        for (let seed=1;seed<200;seed++) {
          const cup=StrandTournament.create({count:4,humans,p1:'diehardman',p2:'heartman',difficulty:'easy',seed});
          const match=StrandTournament.next(cup);
          if (match.players.filter(slot=>cup.entrants[slot].human).length!==humans) continue;
          // Old saves without a recorded arena must use the original three-arena mapping.
          if (humans===1) for (const item of cup.rounds.flat()) delete item.stage;
          localStorage.setItem('echos.v1.cup',JSON.stringify(cup));
          return {id:match.id,stage:match.stage || ['shore','terminal','battlefield'][match.seed%3]};
        }
        throw Error('Tirage introuvable');
      },humans);
      async function openBracket() {
        await page.reload();
        await page.locator('[data-mode=tournament]').click();
        await page.locator('[data-act=bracket]').click();
      }
      await openBracket();
      assert.equal(await page.locator('[data-act=cupReplay]').count(),0);
      await page.locator('[data-act=cupFight]').click();
      const live=await page.evaluate(humans=>{
        smallCanvas();
        const frames=[];
        const tap=(p,key)=>{StrandFight.input(p,key,true);StrandFight.input(p,key,false);};
        let pausedOnce=false;
        for (let i=0;i<22000 && StrandFight.snapshot();i++) {
          const state=StrandFight.snapshot();
          if (state.phase==='fight') {
            const [a,b]=state.fighters;
            if (!pausedOnce && state.tick===100) {
              StrandFight.pause(); advance(); advance(); StrandFight.pause(false);
              pausedOnce=true;
            }
            StrandFight.input(1,'right',a.x<b.x); StrandFight.input(1,'left',a.x>b.x);
            if (Math.abs(a.x-b.x)<133 && !a.action && !a.stun)
              tap(1,b.guard && Math.abs(a.x-b.x)<72 ? 'throw' : 'heavy');
            if (humans===2 && state.round===1 && state.tick===105) tap(2,'light');
          }
          if (state.phase==='finish') tap(state.winner,'finish');
          advance();
          const next=StrandFight.snapshot();
          if (next && next.tick!==state.tick && next.tick%37===0) frames.push(next);
        }
        if (StrandFight.snapshot() || !pausedOnce) throw Error('Le duel réel n’est pas terminé.');
        const saved=localStorage.getItem('echos.v1.cup');
        return {frames,saved};
      },humans);
      const cup=JSON.parse(live.saved), match=cup.rounds.flat().find(m=>m.id===setup.id), tape=match.replay;
      assert.ok(tape && tape.events.length>10 && tape.ticks>500);
      assert.equal(tape.mode,humans===1 ? 'cpu' : 'local');
      assert.equal(tape.stage,setup.stage);
      assert.equal(tape.seed,match.seed);
      assert.ok(tape.events.some(e=>e[1]===-1));
      if (humans===2) assert.ok(tape.events.some(e=>e[1]>=20),'J2 enregistré');
      assert.ok(live.frames.length>20);
      await openBracket();
      assert.equal(await page.locator('[data-act=cupReplay]').count(),1);
      await page.locator('[data-act=cupReplay]').click();
      assert.equal(await page.locator('[data-input]').count(),0);
      const played=await page.evaluate(ticks=>{
        smallCanvas();
        const frames=[]; let pausedOnce=false;
        for (let i=0;i<ticks+12 && StrandFight.snapshot();i++) {
          const state=StrandFight.snapshot();
          if (!pausedOnce && state.tick===190) {
            StrandFight.pause(); advance(); advance(); StrandFight.pause(false); pausedOnce=true;
          }
          // Live attacks must have no effect during playback, including held keys.
          StrandFight.input(1,'guard',true); StrandFight.input(2,'heavy',true);
          advance();
          const next=StrandFight.snapshot();
          if (next && next.tick!==state.tick && next.tick%37===0) frames.push(next);
        }
        return {frames,saved:localStorage.getItem('echos.v1.cup')};
      },tape.ticks);
      assert.deepEqual(played.frames,live.frames,'Positions, ressources et phases à chaque échantillon');
      assert.equal(played.saved,live.saved,'Tableau identique octet pour octet');
      assert.equal(await page.locator('main h1').innerText(),'Fin de la relecture');
      await page.locator('[data-act=bracket]').click();
      await page.locator('[data-act=cupReplay]').click();
      await page.locator('.fightbar [data-act=leave]').click();
      assert.equal(await page.evaluate(()=>localStorage.getItem('echos.v1.cup')),live.saved);
      assert.equal(await page.evaluate(t=>StrandFight.validReplay({...t,events:[[2,1],[1,3]]}),tape),false);
    }
    assert.deepEqual(errors,[]);
    console.log('OK — Tournoi local J1/J2 et contre IA, ancien tirage, entrées horodatées, pause, finitions, lecture après rechargement et tableau inchangé.');
  } finally {await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
