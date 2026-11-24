/* Portable verification of actual game sources with a simulated host.
 * No image pixel decoding, native Canvas rendering or browser validation.
 */
function runBossSimulationQA(sources,options) {
  'use strict';
  options=options||{};
  const clone=v=>JSON.parse(JSON.stringify(v));
  const assert=(condition,message)=>{if(!condition)throw Error(message);};
  const equal=(actual,expected,message)=>assert(JSON.stringify(actual)===JSON.stringify(expected),message);
  const report={method:'hosted JavaScript; actual simulation and app; simulated Canvas, Image and DOM',
    imagePixelsDecoded:false,nativeCanvas:false,browser:false,checks:[],victories:[],defeats:[],drawnAssets:[],checkpointSamples:0};
  for(const name of ['content.js','assets.js','boss-assets.js','boss.js','app.js']){
    assert(typeof sources[name]==='string','Source required: '+name);new Function(sources[name]);
  }
  const scriptOrder=['content.js','asset-geometry-20261124.js','assets.js','boss-geometry-20261124.js','boss-assets.js','boss.js'];
  const allUsed=new Set();
  function world(config={}) {
    const draws=[],used=new Set(),requests=new Set(),storage=config.storage||new Map(),events={},queue=new Map();
    const surface={width:1280,height:720},matrixStack=[];let matrix=[1,0,0,1,0,0],serial=0,time=0,result=null;
    const numeric=(args,name)=>assert(args.every(Number.isFinite),'Finite Canvas '+name);
    const ctx={font:'16px Arial',globalAlpha:1,save(){matrixStack.push(matrix.slice());},restore(){assert(matrixStack.length>0,'Canvas restore balanced');matrix=matrixStack.pop();},
      translate(x,y){numeric([x,y],'translate');matrix[4]+=matrix[0]*x+matrix[2]*y;matrix[5]+=matrix[1]*x+matrix[3]*y;},
      scale(x,y){numeric([x,y],'scale');matrix[0]*=x;matrix[1]*=x;matrix[2]*=y;matrix[3]*=y;},
      beginPath(){},stroke(){},fill(){},clip(){},setLineDash(){},
      fillText(value,x,y){numeric([x,y],'text');},measureText(value){return {width:String(value).length*(parseFloat(this.font.match(/(\d+(?:\.\d+)?)px/)?.[1]||'16')*.53)};},
      drawImage(im,...args){
        assert(im&&im.complete&&im.naturalWidth>0,'Drawing a ready source');numeric(args,'drawImage');
        assert(args.length===4||args.length===8,'Supported native drawImage form');
        const dest=args.length===8?args.slice(4):args,sw=args.length===8?args[2]:im.naturalWidth,sh=args.length===8?args[3]:im.naturalHeight;
        assert(dest[2]>0&&dest[3]>0&&sw>0&&sh>0,'Positive source/destination sizes');
        assert(Math.abs(dest[2]/dest[3]-sw/sh)<.00001,'Uniform image scaling: '+im.src);
        if(args.length===8)assert(args[0]>=0&&args[1]>=0&&args[0]+sw<=im.naturalWidth+.001&&args[1]+sh<=im.naturalHeight+.001,'Native crop: '+im.src);
        used.add(im.src);allUsed.add(im.src);draws.push({file:im.src,args:args.slice(),matrix:matrix.slice()});
      }
    };
    for(const name of ['moveTo','lineTo','fillRect','strokeRect','rect','ellipse','arc'])ctx[name]=(...args)=>numeric(args.filter(x=>typeof x!=='boolean'),name);
    surface.getContext=()=>ctx;
    const host={localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>{if(config.quota)throw Error('Storage unavailable');storage.set(key,value);}},
      requestAnimationFrame(fn){queue.set(++serial,fn);return serial;},cancelAnimationFrame(id){queue.delete(id);},
      addEventListener(name,fn){(events[name]||=[]).push(fn);},scrollTo(){},matchMedia(){return {matches:false,addEventListener(){}};}};
    class Image {
      set src(file){
        this._src=file;requests.add(file);
        const known=options.imageSizes?.[file],size=Array.isArray(known)?known:known?[known.width,known.height]:file.includes('/stages/')?[1536,1024]:[1536,1536];
        this.complete=!config.missingImages;this.naturalWidth=this.complete?size[0]:0;this.naturalHeight=this.complete?size[1]:0;
      }
      get src(){return this._src;}
    }
    for(const file of scriptOrder)if(sources[file])new Function('window','Image',sources[file])(host,Image);
    const engine=host.StrandBoss;
    function start(boss='lion',p1='sam',extra={}){
      result=null;draws.length=0;
      engine.start({canvas:surface,boss,p1,stage:engine.encounters[boss].stage,difficulty:'normal',manualClock:true,sound:false,
        onEnd:r=>{result=r;},...extra});return engine.snapshot();
    }
    function advance(ticks,render=false){const state=engine.advance(ticks,render);assert(matrixStack.length===0,'Canvas frame stack balanced');return state;}
    function render(){draws.length=0;engine.draw();assert(matrixStack.length===0,'Canvas draw stack balanced');return draws.slice();}
    function frames(count){for(let i=0;i<count;i++){time+=1000/60+.000001;const jobs=[...queue.values()];queue.clear();for(const job of jobs)job(time);}return engine.snapshot();}
    return {host,engine,surface,ctx,start,advance,render,frames,draws,used,requests,storage,events,Image,get result(){return result;}};
  }
  const storage=new Map([['echos.v1.chapters','{"sam":2}'],['echos.v1.cup','{"kept":true}'],['ds-silent-line-v3','campaign-kept']]);
  const original=new Map(storage),w=world({storage}),e=w.engine;
  assert(Object.keys(e.encounters).length===6,'Six encounters');assert(Object.keys(e.players).length===8,'Eight players');
  report.rules=e.rules;
  const set=(action,value)=>e.input(1,action,value),pulse=action=>{set(action,false);set(action,true);};
  function controls(values){for(const key of ['left','right','up','down','guard'])set(key,!!values[key]);}
  function pilot(target=w){
    const E=target.engine,s=E.snapshot();if(!s||s.phase==='ended'||s.phase==='intro')return;
    const p=s.p,b=s.boss,d=E.encounters[s.bossId];
    let axis=0,guard=false,down=false,jump=false,attack=false,special=false,interact=false;
    if(b.hp<=0){
      if(s.waveDelay>0)axis=p.x<300?0:-1;
      else if(s.cargo.carrying!==null){axis=p.x>120?-1:0;interact=axis===0;}
      else{const box=s.cargo.boxes.find(q=>q.state==='ground');if(box){axis=Math.abs(p.x-box.x)>38?Math.sign(box.x-p.x):0;interact=axis===0;}}
    }else{
      const side=p.x<b.x?-1:1,targetX=Math.max(55,Math.min(1225,b.x+side*(d.radius*.55+62)));
      axis=Math.abs(p.x-targetX)>15?Math.sign(targetX-p.x):0;
      const a=b.attack;
      if(b.phase==='tell'&&a){
        if(['spikes','stomp','pounce','breach'].includes(a.type)){
          const unsafe=x=>a.markers.some(m=>Math.abs(x-m.x)<m.w/2+55);
          const safe=Array.from({length:23},(_,i)=>65+i*50).filter(x=>!unsafe(x)).sort((x,y)=>Math.abs(x-p.x)-Math.abs(y-p.x))[0];
          if(safe!==undefined)axis=Math.abs(safe-p.x)>12?Math.sign(safe-p.x):0;
        }else if(a.type==='charge'){axis=p.x<180?1:p.x>1100?-1:side;jump=b.timer<19&&p.y===0;}
        else if(['orbs','bolts'].includes(a.type)){axis=0;guard=true;down=true;}
        else if(a.type==='ring')axis=0;
      }else if(b.phase==='attack'&&a){
        if(a.type==='charge'){axis=p.x<100?1:p.x>1180?-1:side;jump=Math.abs(p.x-b.x)<260&&p.y===0;}
        else if(['orbs','bolts'].includes(a.type)){axis=0;guard=true;down=true;}
        else if(['stomp','spikes','pounce','breach'].includes(a.type))axis=0;
      }else if(b.phase!=='dive'){attack=Math.abs(b.x-p.x)<d.radius+125;special=p.energy>45&&axis===0&&b.phase==='recover';}
      const ring=s.hazards.find(h=>h.kind==='ring'&&h.delay<=0&&Math.abs(h.x-p.x)<170&&(p.x-h.x)*h.vx>=0);
      if(ring&&p.y===0){jump=true;guard=false;down=false;}
      if(!guard&&!b.attack&&Math.abs(b.x-p.x)<d.radius+125)attack=true;
    }
    for(const [key,value] of Object.entries({left:axis<0,right:axis>0,up:jump,guard,down}))E.input(1,key,value);
    for(const key of ['heavy','special','throw'])E.input(1,key,false);
    if(interact)E.input(1,'throw',true);else if(special)E.input(1,'special',true);else if(attack)E.input(1,'heavy',true);
  }
  function runVictory(boss,target=w,p1='sam'){
    const E=target.engine;target.start(boss,p1);
    const phases=new Set(),tiers=new Set();let carried=false,wave2=false;
    for(let ticks=0;ticks<18000&&!target.result;ticks+=5){
      pilot(target);const s=target.advance(5);if(!s)break;
      phases.add(s.boss.phase);tiers.add(s.boss.tier);carried ||= s.cargo.carrying!==null;wave2 ||= s.wave===2;
      if(s.phase!=='ended'){
        assert(E.validCheckpoint(E.checkpoint()),'Reachable checkpoint valid: '+boss+' / '+s.tick+' / '+s.boss.phase);
        report.checkpointSamples++;
      }
      if(s.boss.phase==='tell')assert(s.boss.attack.warning>=45,'Readable telegraph duration');
      target.render();
    }
    const r=target.result;assert(r&&r.won,'Input-driven victory '+boss+': '+JSON.stringify(r));
    for(const phase of ['tell','attack','recover'])assert(phases.has(phase),'Encounter phase reached '+boss+' '+phase);
    assert(tiers.has(2),'Second phase reached '+boss);
    if(E.encounters[boss].cargo){assert(carried,'Actual parcel carry '+boss);assert(r.cargo===r.cargoGoal,'Required parcels delivered '+boss);}
    if(boss==='convoy')assert(wave2,'Two convoy waves');
    const s=E.snapshot();assert(s.shots.length===0&&s.hazards.length===0,'End clears autonomous damage');
    assert(E.progress().checkpoint===null,'Victory clears resume');
    return {...r,observedPhases:[...phases],carried,wave2};
  }
  for(const boss of Object.keys(e.encounters))report.victories.push(runVictory(boss));
  report.checks.push('six victories from real input sequences; cargo pickup/carry/deposit; both convoy waves; phase two');

  // Genuine in-flight resume, including active telegraphs, remains deterministic.
  w.start('squid');w.advance(140);set('right',true);w.advance(9);e.pause(true);
  const stopped=JSON.stringify(e.snapshot());w.advance(420);equal(JSON.stringify(e.snapshot()),stopped,'Pause freezes all simulation clocks');
  equal(Object.keys(e.snapshot().p.keys),[],'Pause clears held inputs');
  const cp=e.checkpoint();assert(e.validCheckpoint(cp),'Saved telegraph checkpoint');
  function continuation(){e.pause(false);set('left',true);w.advance(17);set('left',false);pulse('special');w.advance(46);return e.checkpoint();}
  const direct=continuation();w.start('squid','sam',{resume:cp});equal(continuation(),direct,'Reload reproduces exact following state');
  report.checks.push('pause freezes state and inputs; active-telegraph checkpoint reproduces exact following frames');
  for(const mutate of [p=>p.rules='old',p=>p.state.p.x=Infinity,p=>p.state.bossId='unknown',p=>p.state.cargo.goal=99,
    p=>p.state.p.hp=-2,p=>p.state.p.marker='invalid',p=>p.state.boss.attack=null,p=>p.state.hazards=[null]]){
    const bad=clone(cp);mutate(bad);assert(!e.validCheckpoint(bad),'Invalid checkpoint rejected');
  }
  report.checks.push('invalid rules, numbers, identifiers, markers, attacks and damage arrays rejected');

  const directional={sam:['bola','brace','parry'],fragile:['blink','fan','beacon'],higgs:['tar','mine','feint'],cliff:['salvo','post','recall'],
    mule:['scan','crate','retrieve'],diehardman:['order','gate','relief'],mama:['anchor','deck','winch'],heartman:['pulse','memory','syncope']};
  for(const p1 of Object.keys(e.players)){
    w.start('giant',p1);w.advance(76);
    set('guard',true);w.advance(2);const guard=w.render();
    const a=w.host.StrandAssets;
    assert(guard.some(d=>d.file===(a.wardrobe?.[p1]?.atelier?.poses?.guard||a.poses?.[p1]?.guard)),'Guard source used '+p1);
    set('guard',false);set('down',true);w.advance(2);
    assert(w.render().some(d=>d.file===(a.wardrobe?.[p1]?.atelier?.poses?.crouch||a.poses?.[p1]?.crouch)),'Crouch source used '+p1);
    set('down',false);pulse('up');w.advance(3);
    assert(e.snapshot().p.y>25,'Physical jump '+p1);const ascent=w.render();w.advance(17);const apex=w.render();w.advance(12);const fall=w.render();
    for(const [pose,draws] of [['rise',ascent],['apex',apex],['fall',fall]])assert(draws.some(d=>d.file===(a.wardrobe?.[p1]?.atelier?.poses?.[pose]||a.poses?.[p1]?.[pose])),'Three jump phases used '+p1+' '+pose);
    w.advance(20);set('left',true);w.advance(2);assert(w.render().some(d=>d.file===(a.wardrobe?.[p1]?.atelier?.poses?.step||a.poses?.[p1]?.step||a.steps[p1])),'Step source used '+p1);set('left',false);
    for(let dir=0;dir<3;dir++){
      w.start('giant',p1);w.advance(76);
      if(dir===2&&['cliff','mule','mama'].includes(p1)){
        controls({right:p1!=='mama'});pulse('special');w.advance(34);controls({});
        assert(e.snapshot().p.marker,'Dependent technique has its marker');
        const expired=e.checkpoint();expired.state.p.marker.ttl=1;assert(e.validCheckpoint(expired),'Expiring marker checkpoint');
        w.start('giant',p1,{resume:expired});
      }
      controls({right:dir===1,left:dir===2});pulse('special');w.advance(1);
      assert(e.snapshot().p.act?.kind===directional[p1][dir],'Directional signature accepted '+p1+' '+dir);
      w.advance(25);w.render();
      assert(e.snapshot().stats.signatures>=1,'Signature executes '+p1);
    }
  }
  report.checks.push('eight fighters: guard/crouch/step and all three jump images; 24 direction-dependent signatures; expiring-marker actions');

  // Ground ring: compare the same genuinely generated incoming attack with and without a jump.
  w.start('giant');w.advance(130);set('right',true);w.advance(58);set('right',false);
  let ringPoint=null;
  for(let i=0;i<1000;i++){
    const s=e.snapshot(),h=s.hazards.find(h=>h.kind==='ring'&&h.vx<0&&h.x-s.p.x>90&&h.x-s.p.x<135);
    if(h&&s.p.y===0&&!s.p.invuln){ringPoint=e.checkpoint();break;}w.advance(1);
  }
  assert(ringPoint,'Real approaching ground ring generated');w.render();w.advance(32);const grounded=e.snapshot().p.hp;
  w.start('giant','sam',{resume:ringPoint});pulse('up');w.advance(32);assert(e.snapshot().p.hp>grounded,'Jump avoids the approaching ground ring');w.render();
  report.checks.push('same real ground ring hits grounded player and is avoided by a jump');

  // Guard: compare a real bolt approaching the same player.
  w.start('truck');let boltPoint=null;
  for(let i=0;i<600;i++){
    const s=e.snapshot(),h=s.hazards.find(h=>h.kind==='bolt'&&!h.low&&h.vx<0&&h.x-s.p.x>90&&h.x-s.p.x<135);
    if(h&&!s.p.invuln){boltPoint=e.checkpoint();break;}w.advance(1);
  }
  assert(boltPoint,'Real incoming MULE bolt generated');w.render();w.advance(20);const unguarded=e.snapshot().p.hp;
  w.start('truck','sam',{resume:boltPoint});set('guard',true);w.advance(20);
  assert(e.snapshot().stats.guarded>0&&e.snapshot().p.hp>unguarded,'Guard reduces the same bolt impact');w.render();
  report.checks.push('same real MULE bolt: guard mitigates damage and consumes guard meter');

  w.start('lion','heartman');w.advance(18000);assert(w.result&&!w.result.won&&w.result.reason==='health','Actual no-input defeat');
  report.defeats.push(w.result);assert(w.result.stats.damageTaken===120,'Damage statistics cap at actual health lost');
  w.start('lion','heartman');const fresh=e.snapshot();assert(fresh.p.hp===120&&fresh.phase==='intro'&&fresh.wave===1&&!fresh.shots.length&&!fresh.hazards.length&&fresh.cargo.carrying===null,'Fresh rematch resets the encounter');
  report.checks.push('no-input defeat and fresh rematch; actual health loss recorded without overkill');

  // Review regressions: legitimate boundary checkpoints execute real counter/cargo code.
  w.start('truck');w.advance(76);
  const counter=e.checkpoint(),cs=counter.state;
  Object.assign(cs.boss,{x:400,hp:1,phase:'attack',timer:47,attack:{type:'charge',from:400,to:400,target:399,age:0,active:48,warning:76,name:'CHARGE',advice:'Sautez',hit:false,depot:false,markers:[{x:400,w:180,h:115}]}});
  Object.assign(cs.p,{x:399,shield:50,face:1});
  assert(e.validCheckpoint(counter),'Counter-kill boundary checkpoint');
  w.start('truck','sam',{resume:counter});w.advance(1);
  assert(e.snapshot().phase==='collect'&&e.snapshot().boss.timer===0&&e.snapshot().cargo.boxes.length===2,'Counter kill keeps defeated timer at zero and creates cargo');
  const cargoAfterCounter=e.checkpoint();assert(e.validCheckpoint(cargoAfterCounter),'Counter-kill checkpoint remains valid');
  e.pause(true);const savedCounter=e.progress().checkpoint;e.stop();w.start('truck','sam',{resume:savedCounter});
  equal(e.checkpoint(),savedCounter,'Counter-kill resume retains both parcels and zero boss health');
  const staggerCounter=clone(counter);staggerCounter.state.boss.hp=staggerCounter.state.boss.maxHp;staggerCounter.state.boss.stagger=80;
  w.start('truck','sam',{resume:staggerCounter});w.advance(1);
  assert(e.snapshot().boss.phase==='recover'&&e.snapshot().boss.timer===90&&e.snapshot().boss.attack===null,'Counter stagger preserves the full new recovery timer');
  assert(e.validCheckpoint(e.checkpoint()),'Counter stagger checkpoint valid');

  const scan=clone(cargoAfterCounter);scan.state.p1='mule';
  Object.assign(scan.state.p,{x:1248,face:1,act:null,marker:null,energy:100,shield:0,invuln:0});scan.state.effects=[];
  assert(e.validCheckpoint(scan),'Right-edge collection fixture valid');
  w.start('truck','mule',{resume:scan});pulse('special');w.advance(12);
  assert(e.snapshot().effects.some(f=>f.x===1584),'Actual Scan creates the long-range cosmetic effect');
  assert(e.validCheckpoint(e.checkpoint()),'Right-edge Scan keeps checkpoint valid');
  e.pause(true);const savedScan=e.progress().checkpoint;e.stop();w.start('truck','mule',{resume:savedScan});
  equal(e.checkpoint(),savedScan,'Scan resume preserves defeated truck and cargo');
  for(const [p1,kind,marker] of [['cliff','recall','post'],['mama','winch','anchor'],['mule','retrieve','crate']]){
    const malformed=clone(cp);malformed.state.p1=p1;malformed.state.p.marker=null;
    malformed.state.p.act={kind,frame:11,delay:12,duration:34,face:1};
    assert(!e.validCheckpoint(malformed),'Unfired '+kind+' requires a '+marker+' marker');
    malformed.state.p.act.frame=12;assert(e.validCheckpoint(malformed),'Already-fired '+kind+' may consume its marker');
  }
  for(const field of ['cycle','stagger','flash','exposed']){
    const bad=clone(cp);delete bad.state.boss[field];assert(!e.validCheckpoint(bad),'Arithmetic boss field required: '+field);
  }
  for(const field of ['from','to','target']){
    const bad=clone(cp);delete bad.state.boss.attack[field];assert(!e.validCheckpoint(bad),'Arithmetic attack field required: '+field);
  }
  report.checks.push('review regressions: counter kill/stagger retain valid cargo checkpoints; edge Scan resumes; unarmed recalls and missing arithmetic fields rejected');

  // Direction is captured for an action, even when crossing an immersed boss.
  w.start('whale');w.advance(76);const crossing=e.checkpoint();
  Object.assign(crossing.state.boss,{x:940,phase:'dive',timer:55,attack:null});
  Object.assign(crossing.state.p,{x:920,face:1});
  assert(e.validCheckpoint(crossing),'Immersed-whale crossing fixture valid');
  w.start('whale','sam',{resume:crossing});pulse('special');w.advance(1);set('right',true);w.advance(11);set('right',false);
  const crossed=e.snapshot(),bola=crossed.shots.find(shot=>shot.kind==='sam');
  assert(crossed.p.x>crossed.boss.x&&bola&&crossed.p.act.face===1&&crossed.p.face===1&&bola.vx>0,'Action, sprite and projectile retain the captured facing after crossing');
  const facingDraw=w.render().find(draw=>draw.file===w.host.StrandAssets.actions.sam);
  assert(facingDraw&&facingDraw.matrix[0]>0,'Actual action sprite faces its emitted projectile');
  w.advance(22);w.advance(1);assert(e.snapshot().p.face===-1,'Automatic facing resumes after the action');
  report.checks.push('crossing an immersed whale during wind-up keeps action, sprite and projectile direction aligned');

  // The lowered giant pose uses a logical body height independent of pixel decoding.
  w.start('giant');w.advance(219);const giantPose=e.checkpoint();
  assert(giantPose.state.boss.phase==='attack','Real giant attack pose reached');
  function giantShot(y,missingImages=false){
    const point=clone(giantPose),s=point.state;
    s.shots=[{id:s.nextId++,kind:'cliff',x:s.boss.x,y,vx:0,damage:20,w:42,h:32,ttl:100,delay:0}];
    assert(e.validCheckpoint(point),'Giant projectile fixture valid');
    const target=world({missingImages});target.start('giant','sam',{resume:point});target.advance(1);target.render();return target.engine.checkpoint();
  }
  const aboveGiant=giantShot(250),torsoGiant=giantShot(410);
  assert(aboveGiant.state.boss.hp===giantPose.state.boss.hp,'Shot above bent giant body misses');
  assert(torsoGiant.state.boss.hp<giantPose.state.boss.hp,'Shot inside bent giant torso hits');
  equal(giantShot(250,true),aboveGiant,'Giant air miss does not depend on image availability');
  equal(giantShot(410,true),torsoGiant,'Giant torso hit does not depend on image availability');
  report.checks.push('giant bent pose: above-body shot misses, torso shot hits; same collision with absent images');

  // Boundary cases use valid checkpoints, then execute the actual remaining collision/clock.
  w.start('convoy');let depotPoint=null;
  for(let i=0;i<700;i++){
    const s=e.snapshot(),h=s.hazards.find(h=>h.kind==='bolt'&&h.low&&h.vx<0&&h.x>170&&h.x<195);
    if(h){depotPoint=e.checkpoint();break;}w.advance(1);
  }
  assert(depotPoint,'Actual low bolt approaches the depot');depotPoint.state.cargo.integrity=1;depotPoint.state.p.x=650;
  assert(e.validCheckpoint(depotPoint),'Cargo boundary checkpoint');
  w.start('convoy','sam',{resume:depotPoint});w.advance(10);assert(w.result?.reason==='cargo'&&!w.result.won,'Depot collision ends encounter when integrity reaches zero');report.defeats.push(w.result);
  w.start('lion');w.advance(76);const timeout=e.checkpoint();timeout.state.remaining=1;
  assert(e.validCheckpoint(timeout),'Time boundary checkpoint');w.start('lion','sam',{resume:timeout});w.advance(1);assert(w.result?.reason==='time','Time expiration ends encounter');report.defeats.push(w.result);
  report.checks.push('valid boundary checkpoints: actual incoming depot hit destroys cargo; final tick expires');

  let ended=0;
  w.start('lion','sam',{resume:timeout,onEnd(){ended++;e.stop();}});w.advance(10);
  assert(ended===1&&e.snapshot()===null,'End callback may stop engine safely');
  w.start('lion','sam',{resume:timeout,onEnd(){ended++;w.start('truck');}});w.advance(10);
  assert(ended===2&&e.snapshot().bossId==='truck'&&e.snapshot().tick===0,'End callback may replace engine without ticking new match');
  report.checks.push('onEnd stop/restart callbacks are safe and fire once');

  const quota=world({quota:true});quota.start('squid');quota.advance(140);quota.engine.pause(true);
  assert(!quota.engine.snapshot().saved&&quota.engine.validCheckpoint(quota.engine.progress().checkpoint),'Storage failure preserves a valid session checkpoint');
  const retained=quota.engine.progress().checkpoint;quota.engine.stop();quota.start('squid','sam',{resume:retained});equal(quota.engine.checkpoint(),retained,'Session checkpoint survives stop/start after quota refusal');
  report.checks.push('storage refusal is reported while session resume remains available');

  const missing=world({missingImages:true}),present=world();
  for(const target of [missing,present]){target.start('lion');target.advance(80);target.engine.input(1,'right',true);target.advance(60);target.engine.input(1,'right',false);target.engine.input(1,'special',true);target.advance(80);target.render();}
  equal(missing.engine.checkpoint(),present.engine.checkpoint(),'Image availability cannot change simulation');
  report.checks.push('missing/decoding images preserve identical gameplay and use renderer fallback');

  for(const [key,value] of original)assert(storage.get(key)===value,'Other mode save preserved '+key);
  report.checks.push('campaign, story and tournament saves remain unchanged');
  for(const poses of Object.values(w.host.StrandBossAssets.sprites))for(const file of Object.values(poses))assert(allUsed.has(file),'Boss source actually drawn: '+file);
  for(const file of Object.values(w.host.StrandBossAssets.effects))assert(allUsed.has(file),'Boss FX actually drawn: '+file);
  report.checks.push('all 14 boss sprite paths and all four boss FX exercised by actual draw calls');

  // Execute the real menu module against an event-capable DOM host, not a browser.
  const ui=world({storage:new Map([['echos.v1.sound','false']])}),nodes=new Map(),permanent=new Set(['view','manual','keys','effects','audio','homeLink','controlsLink']);
  function element(id=''){
    const listeners={},classes=new Set(),el={id,dataset:{},hidden:false,open:false,textContent:'',value:'',listeners,
      classList:{add(...names){names.forEach(n=>classes.add(n));},remove(...names){names.forEach(n=>classes.delete(n));},contains:n=>classes.has(n),toggle(name,on){if(on===undefined)on=!classes.has(name);on?classes.add(name):classes.delete(name);return on;}},
      addEventListener(name,fn){(listeners[name]||=[]).push(fn);},setAttribute(name,value){this[name]=value;},focus(){},setPointerCapture(){},
      matches(){return false;},querySelectorAll(){return[];},querySelector(){return element();},
      closest(selector){return selector==='[data-act]'&&this.dataset.act?this:selector==='[data-input]'&&this.dataset.input?this:null;},
      showModal(){this.open=true;},close(){this.open=false;for(const fn of listeners.close||[])fn({});}};
    if(id==='arena')el.getContext=()=>ui.ctx;
    let markup='';
    Object.defineProperty(el,'innerHTML',{get:()=>markup,set(value){
      markup=String(value);
      if(id==='view'){
        for(const key of [...nodes.keys()])if(!permanent.has(key))nodes.delete(key);
        for(const match of markup.matchAll(/<[^>]+\bid="([^"]+)"[^>]*>/g)){const child=element(match[1]);child.hidden=/\bhidden\b/.test(match[0]);nodes.set(match[1],child);}
      }
    }});
    return el;
  }
  for(const id of permanent)nodes.set(id,element(id));
  const documentEvents={},doc={body:element('body'),hidden:false,getElementById:id=>nodes.get(id)||null,querySelectorAll(){return[];},
    addEventListener(name,fn){(documentEvents[name]||=[]).push(fn);}};
  const duel={starts:[],inputs:[],pauses:[],start(o){this.starts.push(o);},stop(){},pause(on){this.pauses.push(on);},
    input(...args){this.inputs.push(args);},setSound(){},setAmbienceVolume(){},setReducedEffects(){}};
  ui.host.StrandFight=duel;ui.host.StrandTournament={};
  new Function('window','document','localStorage',sources['app.js'])(ui.host,doc,ui.host.localStorage);
  const view=nodes.get('view');
  function click(action,data={}){const target=element();target.dataset={act:action,...data};for(const fn of view.listeners.click||[])fn({target});}
  function change(key,value){const target=element();target.dataset={option:key};target.value=value;for(const fn of view.listeners.change||[])fn({target});}
  function key(type,value,code){const event={key:value,code:code||value,repeat:false,target:view,preventDefault(){}};for(const fn of ui.events[type]||[])fn(event);}
  function pointer(type,button,id=9){for(const fn of view.listeners[type]||[])fn({target:button,pointerId:id,preventDefault(){}});}
  assert(view.innerHTML.includes('data-mode="boss"')&&view.innerHTML.includes('href="archives.html"'),'Home includes Boss Battle and Archives');
  click('mode',{mode:'boss'});
  assert((view.innerHTML.match(/data-act="pickBoss"/g)||[]).length===6,'Dedicated six-boss selection');
  assert((view.innerHTML.match(/data-act="pick"/g)||[]).length===8,'Dedicated selection retains eight fighters');
  change('bossStage','terminal');click('startBoss');ui.frames(80);
  assert(ui.engine.snapshot()?.stage==='terminal','Menu stage reaches boss engine');assert(doc.body.classList.contains('playing'),'Combat screen active');
  const beforeMove=ui.engine.snapshot().p.x;key('keydown','d','KeyD');ui.frames(14);key('keyup','d','KeyD');
  assert(ui.engine.snapshot().p.x>beforeMove,'Keyboard routed to Boss engine');assert(duel.inputs.length===0,'Boss input does not reach duel engine');
  key('keydown','ArrowRight','ArrowRight');ui.frames(2);key('keyup','ArrowRight','ArrowRight');
  assert(!ui.engine.snapshot().p.keys.ArrowRight,'Second-player commands ignored in solo Boss');
  const touch=element();touch.dataset={p:'1',input:'guard'};pointer('pointerdown',touch);ui.frames(2);
  assert(ui.engine.snapshot().p.keys.guard===true,'Touch routes Boss guard');pointer('pointercancel',touch);
  assert(ui.engine.snapshot().p.keys.guard===false&&!touch.classList.contains('held'),'Pointer cancellation releases control');
  click('pause');const frozen=ui.engine.snapshot().tick;ui.frames(90);
  assert(ui.engine.snapshot().tick===frozen&&nodes.get('pauseBox').hidden===false,'Menu pause freezes the actual engine');
  click('pause');click('controls');
  assert(nodes.get('manual').open&&ui.engine.snapshot().paused,'Opening controls pauses Boss');
  assert(nodes.get('keys').innerHTML.includes('Charge chirale')&&!nodes.get('keys').innerHTML.includes('<th>Joueur 2</th>'),'Boss-specific command labels');
  nodes.get('manual').close();assert(!ui.engine.snapshot().paused,'Closing commands resumes active match');
  click('pause');click('leave');
  assert(view.innerHTML.includes('data-act="resumeBoss"'),'Leaving preserves a resume action');
  click('resumeBoss');assert(ui.engine.snapshot().stage==='terminal','Resume retains chosen arena');
  for(const fn of ui.events.blur||[])fn({});assert(ui.engine.snapshot().paused,'Focus loss pauses Boss');
  click('pause');
  for(let i=0;i<5000&&ui.engine.snapshot();i+=5)ui.frames(5);
  assert(ui.engine.snapshot()===null&&view.innerHTML.includes('bossResult'),'Actual result callback replaces combat with result UI');
  assert(view.innerHTML.includes('data-act="startBoss"'),'Result offers rematch');
  click('startBoss');assert(ui.engine.snapshot().p.hp===120&&ui.engine.snapshot().stage==='terminal','UI rematch resets and keeps arena');
  click('pause');click('leave');click('mode',{mode:'versus'});click('start');
  assert(duel.starts.length===1&&ui.engine.snapshot()===null,'Returning to Versus starts its original engine');
  key('keydown','f','KeyF');key('keyup','f','KeyF');
  assert(duel.inputs.some(args=>args[0]===1&&args[1]==='light'&&args[2]===true),'Versus controls retain original routing');
  report.checks.push('actual app module: home, 6/8 selection, stage, keyboard, touch cancel, pause, commands, resume, focus loss, result, rematch and return to Versus');

  report.drawnAssets=[...allUsed].sort();
  report.imageDimensions=options.imageSizes?'supplied metadata where available; synthetic fallback':'synthetic fixtures; no assertion of pixel fidelity';
  report.passed=true;return report;
}
if(typeof module!=='undefined'&&module.exports)module.exports=runBossSimulationQA;
