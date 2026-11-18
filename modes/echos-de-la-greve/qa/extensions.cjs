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
      let now=0, id=0;
      const frames=new Map();
      window.requestAnimationFrame=callback=>{frames.set(++id,callback); return id;};
      window.cancelAnimationFrame=key=>frames.delete(key);
      window.advanceExtensionTest=count=>{
        for (let i=0;i<count;i++) {
          const callbacks=Array.from(frames.values());
          frames.clear();
          now+=1000/60+.000001;
          for (const callback of callbacks) callback(now);
        }
      };
    });
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    for (const side of [1,2]) {
      const data=await page.evaluate(side=>{
        window.StrandAssets={}; // The pose and artwork suites exercise decoded images separately.
        const canvas=document.createElement('canvas'), other=3-side, sign=side===1 ? 1 : -1;
        const forward=side===1 ? 'right' : 'left', back=side===1 ? 'left' : 'right';
        const context=canvas.getContext('2d',{willReadFrequently:true});
        const {start,input,snapshot,pause,stop}=StrandFight;
        function step(count) {
          window.advanceExtensionTest(count);
          context.getImageData(0,0,1,1);
        }
        const actor=()=>snapshot().fighters[side-1], opponent=()=>snapshot().fighters[other-1];
        function reset(id) {
          start({canvas,mode:'local',stage:'shore',sound:false,
            p1:side===1 ? id : 'sam',p2:side===2 ? id : 'sam'});
          // Hit resolution uses simulation coordinates. Keep the render target small across thousands of frames.
          canvas.width=64; canvas.height=36;
          context.scale(.05,.05);
          step(74);
        }
        function tap(player,key) {input(player,key,true); input(player,key,false);}
        function walk(player,axis,frames) {input(player,axis,true); step(frames); input(player,axis,false);}
        function special(axis) {
          if (axis) input(side,axis,true);
          tap(side,'special');
          if (axis) input(side,axis,false);
        }
        function alignBeat(beat) {
          for (let i=0;i<61 && snapshot().beat!==beat;i++) step(1);
          if (snapshot().beat!==beat) throw Error('Horloge du combat immobile');
        }
        function parry(low=false) {
          reset('diehardman'); walk(other,back,62);
          special(); step(low ? 4 : 7);
          if (low) input(other,'down',true);
          tap(other,'light'); step(9);
          input(other,'down',false);
          return {hp:actor().hp,mark:actor().marker,stun:opponent().stun};
        }
        const counter=parry(), bypass=parry(true);
        parry(); step(87);
        const sealedHP=opponent().hp;
        special(back); step(1);
        const extended={marker:actor().marker,action:actor().action};
        step(24); extended.damage=sealedHP-opponent().hp;
        reset('diehardman'); walk(other,back,62);
        special(back); step(28);
        const unsealedDamage=100-opponent().hp;
        parry(); step(125);
        const sealExpiry=actor().marker;
        function gate(guard) {
          reset('diehardman'); walk(other,back,57);
          if (guard) input(other,'guard',true);
          const reserve=actor().chiral;
          special(forward); step(1);
          const cost=reserve-actor().chiral, action=actor().action;
          step(35);
          return {cost,action,damage:100-opponent().hp};
        }
        const gateHit=gate(false), gateGuard=gate(true);
        function lateGate(sealed) {
          if (sealed) {
            parry(); step(34); walk(other,forward,21); step(36);
          } else {reset('diehardman'); walk(other,back,41);}
          special(forward); step(16); walk(other,back,8);
          return {damage:100-opponent().hp,seal:actor().marker?.kind || null};
        }
        const ordinaryWindow=lateGate(false), sealedWindow=lateGate(true);
        reset('mama');
        const reserve=actor().chiral;
        special(back); step(2);
        const emptyWinch={action:actor().action,cost:reserve-actor().chiral};
        const home=actor().x;
        special(); step(18);
        const anchor=actor().marker;
        pause(); step(34); const pausedAnchor=actor().marker;
        pause(false); step(96);
        special(back); step(14);
        const moving={pos:(actor().x-home)*sign,action:actor().action};
        step(8);
        const arrived=(actor().x-home)*sign, cleared=actor().marker;
        reset('mama'); special(); step(219); const anchorExpiry=actor().marker;
        function deck(anchor,guard=false) {
          reset('mama'); walk(other,back,43);
          if (anchor) {special(); step(145);}
          if (guard) input(other,'guard',true);
          special(forward); step(1);
          const action=actor().action;
          step(48);
          return {action,damage:100-opponent().hp};
        }
        const shortDeck=deck(false), longDeck=deck(true), blockedDeck=deck(true,true);
        reset('mama'); special(); step(38); special(); step(1);
        const insufficient={action:actor().action,move:actor().move,energy:actor().chiral};
        function pulse(beat,guard=false) {
          reset('heartman'); walk(other,back,41);
          alignBeat(beat);
          if (guard) input(other,'guard',true);
          special(); step(1);
          const action=actor().action;
          step(52);
          return {damage:100-opponent().hp,action};
        }
        const offBeat=pulse(56), onBeat=pulse(3), guardedPulse=pulse(59,true);
        reset('heartman');
        const markX=actor().x;
        special(forward); step(14);
        const memory=actor().marker, beat=snapshot().beat;
        pause(); step(40);
        const pausedBeat=snapshot().beat, pausedMemory=actor().marker;
        pause(false); step(21);
        walk(side,back,15); walk(other,back,63);
        const displacement=(markX-actor().x)*sign;
        special(forward); step(34);
        const memoryDamage=100-opponent().hp, clearedMemory=actor().marker;
        reset('heartman'); special(forward); step(136);
        const memoryExpiry=actor().marker;
        reset('heartman'); special(forward); step(131);
        special(forward); step(16);
        const lastMomentRelease=actor().marker;
        function syncope(hitAt) {
          reset('heartman'); walk(other,back,64);
          special(back); step(hitAt-5);
          const action=actor().action;
          tap(other,'light'); step(18);
          return {action,damage:100-actor().hp};
        }
        const evaded=syncope(11), punished=syncope(18);
        stop();
        return {counter,bypass,extended,unsealedDamage,sealExpiry,gateHit,gateGuard,ordinaryWindow,sealedWindow,
          emptyWinch,home,sign,anchor,pausedAnchor,moving,arrived,cleared,anchorExpiry,shortDeck,longDeck,blockedDeck,
          insufficient,offBeat,onBeat,guardedPulse,markX,memory,beat,pausedBeat,pausedMemory,
          displacement,memoryDamage,clearedMemory,memoryExpiry,lastMomentRelease,evaded,punished};
      },side);
      const eq=(actual,expected,what)=>assert.deepEqual(actual,expected,'J'+side+' '+what+' '+JSON.stringify(actual));
      eq(data.counter.hp,100,'interception');
      eq(data.counter.mark.kind,'seal','sceau');
      assert.ok(data.counter.mark.ttl<=120 && data.counter.mark.ttl>115 && data.counter.stun>20);
      eq(data.bypass.hp,93,'attaque basse');
      eq(data.bypass.mark,null,'aucun sceau sur attaque basse');
      eq(data.extended,{marker:null,action:'relief',damage:7},'Relève renforcée');
      eq(data.unsealedDamage,0,'Relève hors de portée');
      eq(data.sealExpiry,null,'expiration sceau');
      eq(data.gateHit,{cost:18,action:'gate',damage:8},'portique');
      eq(data.gateGuard,{cost:18,action:'gate',damage:0},'garde du portique');
      eq(data.ordinaryWindow,{damage:0,seal:null},'portique fermé avant le passage tardif');
      eq(data.sealedWindow,{damage:8,seal:'seal'},'portique prolongé, sceau conservé');
      eq(data.emptyWinch,{action:'',cost:0},'treuil sans point');
      eq(data.anchor,{kind:'anchor',x:data.home+130*data.sign,ttl:200},'émission ancrage');
      eq(data.pausedAnchor,data.anchor,'pause ancrage');
      assert.ok(data.moving.pos>0 && data.moving.pos<130);
      eq(data.moving.action,'winch','treuil en mouvement');
      eq(data.arrived,130,'arrivée au point'); eq(data.cleared,null,'ancrage utilisé');
      eq(data.anchorExpiry,null,'expiration ancrage');
      eq(data.shortDeck,{action:'deck',damage:0},'tablier court');
      eq(data.longDeck,{action:'deck',damage:9},'tablier depuis le point');
      eq(data.blockedDeck,{action:'deck',damage:0},'garde du tablier');
      eq(data.insufficient.action,'','chiral insuffisant'); assert.ok(data.insufficient.energy<28);
      eq(data.offBeat,{action:'heartman',damage:0},'impulsion hors tempo');
      eq(data.onBeat,{action:'heartman',damage:7},'portée sur le battement');
      eq(data.guardedPulse,{action:'heartman',damage:0},'garde sur le battement');
      eq(data.memory,{kind:'memory',x:data.markX,ttl:120},'mémoire');
      eq(data.pausedBeat,data.beat,'pause du tempo'); eq(data.pausedMemory,data.memory,'pause mémoire');
      assert.ok(data.displacement>55);
      eq(data.memoryDamage,8,'onde à la position enregistrée'); eq(data.clearedMemory,null,'consommation mémoire');
      eq(data.memoryExpiry,null,'expiration mémoire'); eq(data.lastMomentRelease,null,'déclenchement avant expiration');
      eq(data.evaded,{action:'syncope',damage:0},'esquive active');
      eq(data.punished,{action:'syncope',damage:5},'récupération vulnérable');
    }
    assert.deepEqual(errors,[]);
    console.log('OK — Die-Hardman, Mama et Heartman sur les deux côtés. Neuf techniques, ripostes, portées, ressources, tempo, pause et expiration.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
