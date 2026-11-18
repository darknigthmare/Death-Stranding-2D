const assert = require('node:assert/strict');
const {chromium} = require('playwright');
const {openRelay} = require('../netplay-server.cjs');
const sleep = ms => new Promise(done=>setTimeout(done,ms));
async function wait(fn,label,seconds=16) {
  const end=Date.now()+seconds*1000;
  while(Date.now()<end) {
    if(await fn()) return;
    await sleep(80);
  }
  throw new Error('Délai dépassé · '+label);
}
async function run(browser,url,latency) {
  const contexts=await Promise.all([browser.newContext(),browser.newContext()]);
  const pages=await Promise.all(contexts.map(c=>c.newPage()));
  const failures=[];
  const net=pages.map(()=>({lose:false,offline:false,dropped:false}));
  try {
    for (const [i,page] of pages.entries()) {
      page.on('pageerror',e=>failures.push(e.message));
      await page.route('**/room',async route=>{
        const packet=route.request().postDataJSON(),link=net[i];
        if(link.offline){await route.abort();return;}
        await sleep(latency/2);
        try {
          const response=await route.fetch();
          if (link.lose && packet.op==='sync' && packet.inputs?.length && !link.dropped) {
            link.dropped=true;await route.abort();return;
          }
          await sleep(latency/2);await route.fulfill({response});
        } catch(error) {
          // Closing or reloading the page cancels requests already in flight.
          if (!/closed|canceled|cancelled|disposed|aborted/i.test(String(error))) throw error;
        }
      });
      await page.goto(url);
      await page.evaluate(()=>{
        const net=StrandFight.network;
        window.points={};window.restorations=0;
        const restore=net.restore;
        net.restore=function(p){
          window.restorations++;
          for (const t of Object.keys(window.points)) if(+t>p.state.tick) delete window.points[t];
          return restore(p);
        };
        const advance=net.advance;
        net.advance=function(...args){
          const value=advance(...args),snap=StrandFight.snapshot();
          if(snap.tick%16===0) window.points[snap.tick]=snap;
          return value;
        };
      });
    }
    const [a,b]=pages;
    await a.click('#create');await a.locator('#invite').waitFor({state:'visible'});
    const invite=await a.locator('#invite').inputValue(),code=new URL(invite).hash.slice(6);
    await b.fill('#roomCode',code);await b.click('#joinForm button');
    await b.locator('#ready').waitFor();
    await a.selectOption('#fighter','sam');await b.selectOption('#fighter','mule');
    await a.click('#ready');assert(await a.locator('#arena').isHidden());
    await b.click('#ready');await a.selectOption('#stage','mule-camp');await a.click('#start');
    await wait(async()=> (await Promise.all(pages.map(p=>p.evaluate(()=>StrandFight.snapshot()?.phase==='fight')))).every(Boolean),'combat');
    net[0].lose=true;
    await a.keyboard.down('d');await b.keyboard.down('q');
    await sleep(900);await a.keyboard.up('d');await b.keyboard.up('q');
    await a.keyboard.press('f');await sleep(200);await b.keyboard.press('h');
    await wait(()=>net[0].dropped,'réponse perdue');
    await sleep(1600);
    const results=await Promise.all(pages.map(p=>p.evaluate(()=>({points:window.points,rewind:window.restorations,median:document.querySelector('#ping').textContent}))));
    const same=Object.keys(results[0].points).map(Number).filter(t=>t>120 && t in results[1].points).sort((x,y)=>y-x);
    assert(same.length>=2);
    const tick=same[1];
    assert.deepEqual(results[0].points[tick],results[1].points[tick],'divergence au pas '+tick);
    assert(results[0].points[tick].fighters[0].x>470);
    assert(results[0].points[tick].fighters[1].x<805);
    assert(results.some(d=>d.rewind>0));
    assert(results.every(d=>/\d+ ms/.test(d.median)));
    if(latency===160) {
      net[1].offline=true;
      await wait(()=>a.locator('#status').textContent().then(s=>s.includes('interrompue')),'déconnexion');
      const time=await a.evaluate(()=>StrandFight.snapshot().time);await sleep(700);
      assert.equal(time,await a.evaluate(()=>StrandFight.snapshot().time));
      net[1].offline=false;
      await b.reload();await wait(()=>b.locator('#game').isVisible(),'reprise au rechargement');
      await wait(()=>a.locator('#status').textContent().then(s=>s==='Duel en cours.'),'reprise à deux');
      await sleep(850);
      const fighters=await Promise.all(pages.map(p=>p.evaluate(()=>StrandFight.snapshot().fighters.map(f=>[f.id,f.hp,f.x]))));
      assert.deepEqual(fighters[0],fighters[1]);
    }
    assert.deepEqual(failures,[]);
    await a.click('#leave');await wait(()=>b.locator('#entry').isVisible(),'fermeture');
    console.log(latency+' ms simulées, retransmission et convergence au pas '+tick+'.');
  } finally {await Promise.all(contexts.map(c=>c.close()));}
}
(async()=>{
  const relay=openRelay();
  let browser;
  try {
    await new Promise((resolve,reject)=>relay.once('error',reject).listen(0,'127.0.0.1',resolve));
    const url='http://127.0.0.1:'+relay.address().port+'/netplay.html';
    browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||undefined});
    for (const latency of [40,90,160]) await run(browser,url,latency);
  } finally {
    if(browser) await browser.close();
    if(relay.listening) await new Promise(resolve=>relay.close(resolve));
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
