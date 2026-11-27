/* Real Boss closure and public controls; prepared fixtures are labelled below.
 * Run: node modes/echos-de-la-greve/qa/original-bosses.cjs
 * This tests deterministic simulation and draw contracts, not browser raster fidelity. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const mode=path.resolve(__dirname,'..'),repo=path.resolve(mode,'../..');
const names=['content.js','assets.js','extension-data.js','extension-assets.js','extension-runtime.js','original-bosses-assets.js','original-bosses.js','boss.js'];
const sources=Object.fromEntries(names.map(name=>[name,fs.readFileSync(path.join(mode,name),'utf8')]));
const catalog=JSON.parse(fs.readFileSync(path.join(repo,'docs/combat/extensions/lignes-de-maree/catalog.json'),'utf8'));
const ID='ldm-boss-consignateur',players=['sam','fragile','higgs','cliff','mule','diehardman','mama','heartman'];
const clone=value=>JSON.parse(JSON.stringify(value)),checks=[],counts={publicBattles:0,signatureCases:0,timingCases:0,checkpointFrames:0,corruptions:0};
const near=(a,b)=>assert(Math.abs(a-b)<1e-8,a+' != '+b);
function test(name,fn){fn();checks.push(name);}
function environment(sourceSet=sources,withModule=true,withArt=true,storage=new Map()){
  const storageCalls=[],drawCalls=[];
  const host={localStorage:{getItem(k){storageCalls.push(['get',k]);return storage.get(k)||null;},setItem(k,v){storageCalls.push(['set',k]);storage.set(k,v);}},requestAnimationFrame:()=>1,cancelAnimationFrame(){}};
  const context={window:host,Image:class{constructor(){this.complete=false;this.naturalWidth=0;this.naturalHeight=0;}}};
  for(const name of ['content.js','assets.js','extension-data.js','extension-assets.js','extension-runtime.js'])vm.runInNewContext(sourceSet[name],context,{filename:name});
  if(withArt)vm.runInNewContext(sourceSet['original-bosses-assets.js'],context,{filename:'original-bosses-assets.js'});
  if(withModule)vm.runInNewContext(sourceSet['original-bosses.js'],context,{filename:'original-bosses.js'});
  const marker='  host.StrandBoss={';assert.equal(sourceSet['boss.js'].split(marker).length,2);
  const hook='  host.__audit={makeState,newBoss,beginAction,perform,movePlayer,bossTick,projectilesTick,damageBoss,damagePlayer,interact,finish,step,scenery,drawBoss,draw,retryCheckpoint,getCurrent:()=>current};\n';
  vm.runInNewContext(sourceSet['boss.js'].replace(marker,hook+marker),context,{filename:'boss.js'});
  const drawing=new Proxy({createLinearGradient:()=>({addColorStop(){}}),measureText:s=>({width:String(s).length*7}),drawImage(...args){drawCalls.push(args);}},{get:(o,k)=>o[k]||(()=>{})});
  const canvas={width:1280,height:720,getContext:()=>drawing},api=host.StrandBoss,a=host.__audit;
  function start(options={}){api.start({canvas,boss:ID,p1:'sam',manualClock:true,sound:false,isolated:true,...options});return a.getCurrent();}
  return {host,api,a,canvas,start,storage,storageCalls,drawCalls};
}
function tap(e,key){e.api.input(1,key,true);e.api.advance(1,false);e.api.input(1,key,false);}
function phaseFixture(phase=1,options={}){
  const e=environment(),m=e.start(options),s=m.s;e.api.advance(75,false);
  if(phase>=2)e.a.damageBoss(s,10000);
  if(phase>=3){
    for(const x of [360,1030]){s.p.x=x;s.p.act=null;s.boss.phase='recover';s.boss.timer=42;s.boss.attack=null;tap(e,'throw');}
    e.a.damageBoss(s,10000);
  }
  assert.equal(s.original.phase,phase);
  return {e,m,s};
}
function retrieveRegister(e,s){
  s.p.x=685;s.p.y=0;s.p.vy=0;s.p.act=null;s.p.stun=0;s.p.keys={};s.boss.phase='recover';s.boss.timer=60;s.boss.attack=null;tap(e,'throw');
  assert.equal(s.original.register,'retrieved');
}

test('Optional registration requires received art; base encounters and Rush remain six',()=>{
  const base=['lion','squid','whale','giant','truck','convoy'];
  for(const [module,art] of [[false,false],[true,false]]){
    const e=environment(sources,module,art);assert.deepEqual(clone(Object.keys(e.api.encounters)),base);
    assert.deepEqual(clone(e.api.rush.order),base);assert.equal(Object.keys(e.api.players).length,8);
    const m=e.start({boss:'lion'});assert.equal(m.s.boss.maxHp,280);assert(e.api.validCheckpoint(e.api.checkpoint()));
  }
  const broken={...sources,'original-bosses-assets.js':sources['original-bosses-assets.js']+'\nwindow.StrandOriginalBossArt=JSON.parse(JSON.stringify(window.StrandOriginalBossArt));window.StrandOriginalBossArt.geometry.bosses.consignateur.guard.crop=[0,0,-1,10];'};
  assert.equal(Object.keys(environment(broken).api.encounters).length,6);
  const e=environment();assert.equal(e.host.StrandOriginalBosses.ready,true);
  assert.equal(Object.keys(e.api.encounters).length,7);assert.deepEqual(clone(e.api.rush.order),base);
  assert(!Object.hasOwn(e.api.players,'ldm-character-balise'));
});
test('Catalog guard, stage, three timing pairs and explicit guide agree with runtime',()=>{
  const e=environment(),entry=catalog.bosses.find(b=>b.id===ID),guide=e.host.StrandOriginalBosses.guide;
  assert(entry);assert.equal(e.api.encounters[ID].stage,entry.stageId);assert.equal(guide.phases.length,3);
  for(const difficulty of ['easy','normal','hard'])assert.equal(e.start({difficulty}).s.boss.maxHp,entry.gameplay.health);
  for(let i=0;i<3;i++){
    assert.equal(guide.phases[i].telegraphFrames,entry.gameplay.phases[i].telegraphFrames);
    assert.equal(guide.phases[i].recoveryFrames,entry.gameplay.phases[i].recoveryFrames);
  }
  assert(guide.commands.some(c=>c.action==='throw'));assert(/aucune mort/i.test(guide.victory));
});
test('Prepared boundary fixture: consoles and register gate damage; zero guard alone never wins',()=>{
  const {e,s}=phaseFixture(2);assert.equal(s.boss.hp,198);
  e.a.damageBoss(s,10000);assert.equal(s.boss.hp,99);assert.equal(s.original.phase,2);
  s.p.x=360;s.boss.phase='approach';s.boss.timer=20;s.p.act=null;tap(e,'throw');
  assert.deepEqual(clone(s.original.consoles),[false,false]);
  for(const [i,x] of [360,1030].entries()){
    s.p.x=x;s.boss.phase='recover';s.boss.timer=42;s.boss.attack=null;s.p.act=null;tap(e,'throw');
    assert.equal(s.original.consoles[i],true);assert(e.api.validCheckpoint(e.api.checkpoint()));
  }
  assert.equal(s.original.phase,3);assert.equal(s.boss.hp,99);assert.equal(s.original.register,'ground');
  e.a.damageBoss(s,10000);assert.equal(s.boss.hp,1);assert.equal(s.phase,'active');
  s.p.x=685;s.boss.phase='approach';s.boss.timer=20;s.p.act=null;tap(e,'throw');assert.equal(s.original.register,'ground');
  retrieveRegister(e,s);e.a.damageBoss(s,10000);assert.equal(s.boss.hp,0);assert.equal(s.phase,'active');
  assert(e.api.validCheckpoint(e.api.checkpoint()));
  s.p.x=s.boss.x>640?32:1248;tap(e,'throw');assert.equal(s.phase,'active');
  s.p.x=s.boss.x-60;s.p.act=null;tap(e,'throw');
  assert.equal(s.result.won,true);assert.equal(s.result.reason,'surrender');assert.equal(s.stats.damageDealt,300);
  assert.deepEqual(clone(s.result.original.objectiveFlags.consoles),[true,true]);
  assert.equal(s.result.original.objectiveFlags.register,'retrieved');assert.equal(s.result.original.nonLethal,true);
  assert.equal(e.api.checkpoint(),null);
});
test('Prepared timeline fixtures: exact announcements and recoveries; moving outside markers avoids each attack',()=>{
  for(const phase of [1,2,3])for(const speed of [.75,1,1.25])for(const dodge of [false,true]){
    const {e,s}=phaseFixture(phase,{scenarioSpeed:speed});s.p.x=600;s.p.invuln=0;s.boss.x=800;
    s.boss.phase='approach';s.boss.timer=1;s.boss.attack=null;e.api.advance(1,false);
    const warning=Math.round([60,72,90][phase-1]/speed),active=Math.round([36,24,30][phase-1]/speed),recover=Math.round([48,42,60][phase-1]/speed);
    assert.equal(s.boss.phase,'tell');assert.equal(s.boss.timer,warning);assert.equal(s.boss.attack.warning,warning);
    for(const marker of s.boss.attack.markers){assert(marker.x-marker.w/2>=0);assert(marker.x+marker.w/2<=1280);}
    const before=s.p.hp;if(dodge)s.p.x=32;
    e.api.advance(warning-1,false);assert.equal(s.boss.phase,'tell');assert.equal(s.boss.timer,1);
    e.api.advance(1,false);assert.equal(s.boss.phase,'attack');assert.equal(s.boss.timer,active);
    e.api.advance(active,false);assert.equal(s.boss.phase,'recover');assert.equal(s.boss.timer,recover);
    if(dodge)assert.equal(s.p.hp,before);else assert(s.p.hp<before);
    assert(e.api.validCheckpoint(e.api.checkpoint()));counts.timingCases++;
  }
});
test('Prepared guard window: open side deals more damage, repeated hits cannot extend recovery',()=>{
  function hit(x){const {e,s}=phaseFixture();s.p.x=x;s.boss.x=800;s.boss.face=-1;s.boss.phase='recover';s.boss.timer=48;
    e.a.damageBoss(s,23);return {damage:300-s.boss.hp,timer:s.boss.timer};}
  const front=hit(700),rear=hit(900);assert(rear.damage>front.damage);assert.equal(front.timer,48);assert.equal(rear.timer,48);
});
test('All 24 canonical signatures execute their real windup and retain valid checkpoint states',()=>{
  const directions={sam:['bola','brace','parry'],fragile:['blink','fan','beacon'],higgs:['tar','mine','feint'],
    cliff:['salvo','post','recall'],mule:['scan','crate','retrieve'],diehardman:['order','gate','relief'],
    mama:['anchor','deck','winch'],heartman:['pulse','memory','syncope']};
  for(const p1 of players)for(const [direction,kind] of directions[p1].entries()){
    const {e,s}=phaseFixture(1,{p1});s.p.x=400;s.boss.x=650;s.p.face=1;s.boss.phase='recover';s.boss.timer=48;
    if(direction)s.p.keys[direction===1?'right':'left']=true;
    const marker={recall:'post',retrieve:'crate',winch:'anchor'}[kind];
    if(marker)s.p.marker={kind:marker,x:600,ttl:300};
    const before=s.p.x;e.a.beginAction(s,'special');assert.equal(s.p.act.kind,kind);const delay=s.p.act.delay;
    for(let n=0;n<delay;n++)e.a.movePlayer(s);
    if(['bola','tar','mine','salvo','recall','retrieve','gate','deck','pulse'].includes(kind))assert(s.shots.length>0,kind);
    if(['brace','parry','order'].includes(kind))assert(s.p.shield>0,kind);
    if(['beacon','post','crate','anchor','memory'].includes(kind))assert(s.p.marker,kind);
    if(['blink','feint','syncope','relief','winch'].includes(kind)){assert.notEqual(s.p.x,before,kind);assert(s.p.invuln>0,kind);}
    if(kind==='scan')assert.equal(s.boss.exposed,150);
    if(marker)assert.equal(s.p.marker,null);
    assert(e.api.validCheckpoint(e.api.checkpoint()),kind);counts.signatureCases++;
  }
});
test('Prepared phase saves resume deterministically with the same attack, seed and objective flags',()=>{
  for(const phase of [1,2,3]){
    const {e,s}=phaseFixture(phase);s.p.x=32;e.api.advance(68,false);
    const cp=e.api.checkpoint();assert(e.api.validCheckpoint(cp));
    const resumed=environment();resumed.start({resume:cp});
    for(let frame=0;frame<180;frame++){e.api.advance(1,false);resumed.api.advance(1,false);}
    assert.deepEqual(clone(e.api.checkpoint()),clone(resumed.api.checkpoint()));
  }
});
test('Prepared corrupt saves reject impossible phases, objectives, guard, seed, speed and retry anchors',()=>{
  const cases=[
    s=>s.original.phase=4,s=>s.boss.tier=2,s=>s.boss.maxHp=301,s=>s.original.consoles=[true,false],
    s=>s.original.register='retrieved',s=>s.original.seed=-1,s=>s.original.speed=9,
    s=>s.original.phaseStart.guard=99,s=>s.original.phaseStart.playerHp=0,
    s=>s.original.phaseStart.objectiveFlags.register='retrieved',s=>s.original.surrendered=true,
    s=>s.boss.hp=0,s=>s.boss.phase='dive',s=>s.original.registerX=Infinity
  ];
  const {e}=phaseFixture();const cp=e.api.checkpoint();
  for(const mutate of cases){const corrupt=clone(cp);mutate(corrupt.state);assert.equal(e.api.validCheckpoint(corrupt),false);counts.corruptions++;}
  const phase3=phaseFixture(3);retrieveRegister(phase3.e,phase3.s);phase3.e.a.damageBoss(phase3.s,10000);
  const kneeling=phase3.e.api.checkpoint();assert(phase3.e.api.validCheckpoint(kneeling));
  const corrupt=clone(kneeling);corrupt.state.original.register='ground';assert.equal(phase3.e.api.validCheckpoint(corrupt),false);counts.corruptions++;
});
test('Actual health failure restores phase resources and persists a restart without touching campaign inventory',()=>{
  for(const phase of [1,2,3]){
    const {e,s}=phaseFixture(phase,{isolated:false}),anchor=clone(s.original.phaseStart);
    e.storage.set('campaign-fixture','unchanged');s.p.invuln=0;s.p.shield=0;s.p.guard=false;
    e.a.damagePlayer(s,1000);assert.equal(s.result.won,false);assert.equal(s.result.reason,'health');
    assert.equal(s.result.retryAvailable,true);const cp=e.api.progress().checkpoint;assert(e.api.validCheckpoint(cp));
    assert.equal(cp.state.original.phase,phase);const retry=e.api.retry();assert.equal(retry.original.phase,phase);
    assert.equal(retry.p.hp,anchor.playerHp);assert.equal(retry.p.energy,anchor.energy);
    assert.deepEqual(clone(retry.original.consoles),clone(anchor.objectiveFlags.consoles));
    assert.equal(e.storage.get('campaign-fixture'),'unchanged');
    const reboot=environment(sources,true,true,e.storage);assert.equal(reboot.api.progress().checkpoint.state.original.phase,phase);
  }
});
test('Prepared freight and clock boundaries produce real failure and phase-three retry',()=>{
  const {e,s}=phaseFixture(3,{isolated:false});
  for(let impact=0;impact<4;impact++){
    s.p.x=1248;s.p.invuln=0;s.boss.x=500;s.boss.cycle=1;s.boss.phase='approach';s.boss.timer=1;s.boss.attack=null;
    e.api.advance(1,false);const warning=s.boss.timer;e.api.advance(warning+Math.ceil(s.boss.attack.active*.45),false);
    assert.equal(s.original.freightIntegrity,100-(impact+1)*25);
  }
  assert.equal(s.result.reason,'objective');assert.equal(s.result.won,false);
  assert.equal(e.api.progress().checkpoint.state.original.phase,3);
  assert.equal(e.api.retry().original.freightIntegrity,100);
  const timed=phaseFixture(3,{isolated:false});timed.s.remaining=1;timed.e.api.advance(1,false);
  assert.equal(timed.s.result.reason,'time');assert.equal(timed.e.api.progress().checkpoint.state.original.phase,3);
});
test('Late phase entry after 18,000 total ticks remains saveable and retryable',()=>{
  const {e,s}=phaseFixture(1,{isolated:false});
  s.tick=18001;s.remaining=74;assert(e.api.validCheckpoint(e.api.checkpoint()));
  e.a.damageBoss(s,10000);assert.equal(s.original.phaseStart.tick,18001);
  assert(e.api.validCheckpoint(e.api.checkpoint()));
  s.p.invuln=0;e.a.damagePlayer(s,1000);assert.equal(s.result.retryAvailable,true);
  assert(e.api.validCheckpoint(e.api.progress().checkpoint));
  const retry=e.api.retry();assert(retry);assert.equal(retry.tick,18001);assert.equal(retry.original.phase,2);
  e.api.advance(60,false);assert(e.api.validCheckpoint(e.api.checkpoint()));
  assert.equal(e.api.snapshot().remaining,74);assert.equal(e.api.snapshot().tick,18061);
  const bad=e.api.checkpoint();bad.state.remaining=18001;assert.equal(e.api.validCheckpoint(bad),false);
});
test('Native Digue support row aligns to collision floor without distorting its aspect ratio',()=>{
  const {e,m,s}=phaseFixture();const image={complete:true,naturalWidth:1536,naturalHeight:1024};
  m.images.stage.stages=image;for(const key of ['skyplates','distants','midgrounds','floors','foregrounds'])m.images.stage[key]=null;
  e.drawCalls.length=0;e.a.scenery(m);
  const call=e.drawCalls.find(args=>args[0]===image);assert(call);
  near(call[2]+call[4]*e.host.StrandAssets.stageGeometry[s.stage].legacy.floorY,588);near(call[3]/call[4],1536/1024);
});
test('Twelve directional poses select their native images without a reflection',()=>{
  const {e,m,s}=phaseFixture(),faces=m.images.originalBossFaces,scales=[];
  for(const poseFaces of Object.values(faces))for(const image of Object.values(poseFaces)){
    image.complete=true;image.naturalWidth=8192;image.naturalHeight=8192;
  }
  m.ctx.scale=(x,y)=>scales.push([x,y]);
  const cases=[
    ['guard',()=>{s.boss.phase='approach';}],
    ['shield-push',()=>{s.boss.phase='tell';}],
    ['pole-strike',()=>{s.original.phase=2;s.boss.phase='attack';}],
    ['stagger',()=>{s.boss.phase='recover';}],
    ['kneel',()=>{s.original.phase=3;s.boss.hp=0;s.boss.phase='defeated';}],
    ['surrender',()=>{s.original.surrendered=true;}]
  ];
  for(const [pose,prepare] of cases){
    prepare();
    for(const [face,direction] of [['left',-1],['right',1]]){
      s.boss.face=direction;e.drawCalls.length=0;scales.length=0;e.a.drawBoss(m);
      assert(e.drawCalls.some(args=>args[0]===faces[pose][face]),pose+'/'+face);
      assert(scales.length>0,pose+'/'+face+' was not drawn as a sprite');
      assert(scales.every(([x,y])=>x===1&&y===1),pose+'/'+face+' applied a reflection');
    }
  }
});

test('Standalone original records survive reload while isolated runs perform no save writes',()=>{
  const {e,s}=phaseFixture(3,{isolated:false});retrieveRegister(e,s);e.a.damageBoss(s,10000);s.p.x=s.boss.x-60;tap(e,'throw');
  const reboot=environment(sources,true,true,e.storage),record=reboot.api.progress().records['sam:'+ID+':normal'];
  assert.equal(record.wins,1);assert.equal(reboot.api.progress().checkpoint,null);
  const isolated=phaseFixture(3);retrieveRegister(isolated.e,isolated.s);isolated.e.a.damageBoss(isolated.s,10000);isolated.s.p.x=isolated.s.boss.x-60;tap(isolated.e,'throw');
  assert.equal(isolated.e.storageCalls.filter(call=>call[0]==='set').length,0);
});

function play(environment,sources,player='sam',difficulty='normal',scenarioSpeed=1){
 const e=environment(sources),m=e.start({p1:player,difficulty,scenarioSpeed}),api=e.api;
 const transitions=[],pulses=[],actions=['left','right','up','light','heavy','special','throw','guard'];
 let previous='',total=0;
 function key(k,on){api.input(1,k,on);}
 function pulse(k){api.input(1,k,true);pulses.push(k);}
 for(;total<18080&&m.s.phase!=='ended';total++){
   for(const k of pulses.splice(0))key(k,false);
   const s=m.s,p=s.p,b=s.boss,o=s.original;
   const tag=o.phase+':'+o.consoles.join(',')+':'+o.register;
   if(tag!==previous){transitions.push({tick:s.tick,tag,hp:p.hp,guard:b.hp});previous=tag;}
   if(s.phase!=='active'){api.advance(1,false);continue;}
   let target=p.x,interact=false,attack=false;
   if(b.hp===0){target=b.x+(p.x<b.x?-65:65);interact=Math.abs(p.x-b.x)<=95;}
   else if(o.phase===2&&!o.consoles.every(Boolean)){
     const indices=[0,1].filter(i=>!o.consoles[i]),idx=indices.sort((a,z)=>Math.abs(p.x-[360,1030][a])-Math.abs(p.x-[360,1030][z]))[0];
     target=[360,1030][idx];interact=b.phase==='recover'&&Math.abs(p.x-target)<=75;
   }else if(o.phase===3&&o.register==='ground'){target=o.registerX;interact=b.phase==='recover'&&Math.abs(p.x-target)<=70;}
   else {target=b.x+(p.x<b.x?-125:125);attack=b.phase==='recover';}
   if(['tell','attack'].includes(b.phase)&&b.attack){
     const q=b.attack.markers[0],left=q.x-q.w/2-43,right=q.x+q.w/2+43;
     if(p.x>left&&p.x<right){
       const choices=[left,right].filter(x=>x>=32&&x<=1248);
       target=choices.sort((a,z)=>Math.abs(a-p.x)-Math.abs(z-p.x))[0]??(p.x<640?1240:40);
     }
   }
   const axis=Math.abs(target-p.x)>8?Math.sign(target-p.x):0;
   key('left',axis<0);key('right',axis>0);
   if(b.hp>0&&['tell','attack'].includes(b.phase)&&p.y===0&&axis*(b.x-p.x)>0&&Math.abs(p.x-b.x)<115&&!p.stun)pulse('up');
   if(interact&&!p.act&&!p.stun&&p.y<10){key('left',false);key('right',false);pulse('throw');}
   else if(attack&&!p.act&&!p.stun){
     if(Math.abs(p.x-b.x)<=175&&b.timer>16){pulse('heavy');}
     else if(player==='sam'&&p.energy>=28&&Math.abs(p.x-b.x)<420&&b.timer>16){key('left',false);key('right',false);pulse('special');}
   }
   api.advance(1,false);
   if(total%60===0&&m.s.phase!=='ended'){assert(api.validCheckpoint(api.checkpoint()),'public checkpoint at '+total);counts.checkpointFrames++;}
 }
 return {total,result:m.s.result,transitions,last:{p:m.s.p,boss:m.s.boss,mission:m.s.original}};
};

const publicResults=[];
test('Public-control runs win with all eight canonical fighters in normal and hard, with no state mutations',()=>{
  for(const difficulty of ['normal','hard'])for(const player of players){
    const r=play(environment,sources,player,difficulty);assert.equal(r.result?.won,true,player+'/'+difficulty);
    assert.equal(r.result.reason,'surrender');assert.equal(r.result.stats.damageDealt,300);
    assert.deepEqual(clone(r.result.original.objectiveFlags.consoles),[true,true]);assert.equal(r.result.original.objectiveFlags.register,'retrieved');
    publicResults.push({player,difficulty,ticks:r.total,vitality:r.result.vitality});counts.publicBattles++;
  }
});
test('Public-control runs also complete the two other scenario speeds',()=>{
  for(const speed of [.75,1.25]){
    const r=play(environment,sources,'sam','normal',speed);assert.equal(r.result?.won,true,'speed '+speed);
    publicResults.push({player:'sam',difficulty:'normal',speed,ticks:r.total,vitality:r.result.vitality});counts.publicBattles++;
  }
});
console.log(JSON.stringify({ok:true,scope:'Original Consignateur simulation; explicit canvas host mock',checks,counts,publicResults},null,2));
