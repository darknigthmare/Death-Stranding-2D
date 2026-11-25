/* Targeted reference checks: real Boss functions, prepared unit states, no browser. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),cp=require('node:child_process');
const repo=path.resolve(__dirname,'../../..'),mode=path.join(repo,'modes/echos-de-la-greve');
const {inspectEngine,prepareAction,clone}=require(path.join(repo,'outils/lib/boss-engine.cjs'));
const {generated}=require(path.join(repo,'outils/generer_catalogue_boss.cjs'));
const read=file=>fs.readFileSync(path.join(repo,file),'utf8'),sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const env=inspectEngine(),a=env.audit,api=env.api,checks=[],counts={hpProfiles:0,telegraphs:0,patternPhases:0,actionTimings:0,actionVariants:0,kitEncounterStarts:0,compatibilityCases:0,defenseCases:0,damageCases:0,conditionalCases:0,guideRenders:0};
vm.runInNewContext(read('modes/echos-de-la-greve/boss-data.js'),env.context);
vm.runInNewContext(read('modes/echos-de-la-greve/boss-guide.js'),env.context);
const data=env.host.StrandBossData,guide=env.host.StrandBossGuide;
const test=(name,fn)=>{fn();checks.push(name);};
const near=(actual,expected,label)=>assert(Math.abs(actual-expected)<1e-8,(label||'number')+': '+actual+' != '+expected);
function fixture(boss='lion',p1='sam',difficulty='normal'){
  const s=a.makeState({boss,p1,difficulty});s.phase='active';s.p.x=400;s.boss.x=900;s.boss.hp=s.boss.maxHp=5000;return s;
}
function live(boss='lion',options={}){const m=env.start({boss,...options});m.s.phase='active';return m;}
function neutralHazards(hazards){return hazards.map(h=>({kind:h.kind,baseDamage:h.damage,width:h.w,height:h.h,speed:Math.abs(h.vx),ttl:h.ttl,delay:h.delay,blockable:h.blockable,low:h.low,heightAboveFloor:a.FLOOR-h.y}));}
test('Generated files reproduce exactly and identify the separate Boss engine',()=>{
  const result=generated();for(const [file,body] of Object.entries(result.files))assert.equal(read(file),body,file);
  assert.equal(data.engine,'StrandBoss');assert.equal(data.source.sha256,sha(env.sources['boss.js']));
  assert.equal(data.encounters.length,6);assert.equal(data.actions.length,30);assert.equal(Object.keys(data.patterns).length,8);assert.equal(Object.keys(data.fighters).length,8);
  assert.deepEqual(clone(data.raw),clone({encounters:a.encounters,players:a.players,directions:a.directions,costs:a.costs}));
  assert(Object.isFrozen(data.actions[0].effects));assert.equal(data.forFighter('toString'),null);assert.equal(data.forEncounter('__proto__'),null);assert.equal(data.damage(10,'lion','toString'),null);
});
test('HP, difficulty and announced durations are actual engine results for each encounter and wave',()=>{
  for(const e of data.encounters)for(const difficulty of Object.keys(data.difficulties)){
    for(let wave=1;wave<=e.waves;wave++){assert.equal(a.newBoss(a.encounters[e.id],difficulty,wave).maxHp,e.hp[difficulty][wave-1]);counts.hpProfiles++;}
    for(const tier of [1,2]){const s=fixture(e.id,'sam',difficulty);s.boss.tier=tier;a.prepareAttack(s);assert.equal(s.boss.timer,e.tell[difficulty][tier-1]);assert.equal(s.boss.attack.warning,s.boss.timer);counts.telegraphs++;}
  }
  assert.deepEqual(clone(data.forEncounter('convoy').hp),{easy:[156,174],normal:[190,213],hard:[228,255]});
  const m=env.start();api.advance(74,false);assert.equal(m.s.phase,'intro');assert.equal(m.s.remaining,150*60);assert.equal(m.s.p.energy,100);
  api.advance(1,false);assert.equal(m.s.phase,'active');assert.equal(m.s.remaining,150*60);api.advance(1,false);assert.equal(m.s.remaining,150*60-1);
});
test('All eight pattern types emit their documented dangers and finish at the active-phase boundary',()=>{
  for(const [kind,p] of Object.entries(data.patterns))for(const tier of [1,2]){
    const e=data.encounters.find(e=>e.patterns.includes(kind)),s=fixture(e.id);s.p.x=640;s.p.y=300;s.boss.x=940;s.boss.tier=tier;s.boss.cycle=e.patterns.indexOf(kind);
    a.prepareAttack(s);const warning=s.boss.attack.warning,markers=clone(s.boss.attack.markers);a.launchAttack(s);
    assert.equal(s.boss.timer,p.phases[tier].active);assert.equal(warning,e.tell.normal[tier-1]);
    assert.deepEqual(clone(neutralHazards(s.hazards)),clone(p.phases[tier].hazards));
    assert.deepEqual(markers.map(m=>({width:m.w,height:m.h,offsetFromTarget:m.x-640})),clone(p.phases[tier].markers));
    for(let i=1;i<p.phases[tier].active;i++)a.bossTick(s);assert.equal(s.boss.phase,'attack',kind);
    a.bossTick(s);assert.equal(s.boss.phase,'recover',kind);assert.equal(s.boss.timer,e.normalRecovery);counts.patternPhases++;
  }
  const s=fixture('squid');s.p.x=32;s.boss.tier=2;s.boss.cycle=0;a.prepareAttack(s);assert.equal(s.boss.attack.markers.length,3);assert.equal(s.boss.attack.markers[0].x,65);
});
test('Thirty Boss actions execute once at E, clear at D and accept the next action at D+1',()=>{
  for(const row of data.actions){
    const p=prepareAction(a,row.engineAction);assert.equal(p.cost,row.cost);assert.equal(p.act.delay,row.timing.firstEffect);assert.equal(p.act.duration,row.timing.clearAt);
    const calls=a.traceUpdates(p.s,row.timing.clearAt);assert.deepEqual(clone(calls),[{kind:row.engineAction,frame:row.timing.firstEffect}]);assert.equal(p.s.p.act,null);
    p.s.p.keys={};p.s.p.taps.light=true;a.movePlayer(p.s);assert.equal(p.s.p.act?.kind,'light');assert.equal(p.s.p.act.frame,1);assert.equal(row.timing.nextUncancelledStartAt,row.timing.clearAt+1);counts.actionTimings++;
    const q=prepareAction(a,row.engineAction);assert.deepEqual(clone(a.probePerform(q.s,q.act)),clone(row.effects));
    for(const v of row.variants){const r=prepareAction(a,row.engineAction,v.id);assert.deepEqual(clone(a.probePerform(r.s,r.act)),clone(v.effects));counts.actionVariants++;}
  }
  assert.equal(data.actions.find(x=>x.engineAction==='finish').cost,70);assert.equal(data.actions.find(x=>x.engineAction==='tar').timing.firstEffect,23);
});
test('All eight kits start all six encounters; thirty actions and five variants have tested contact/utility paths',()=>{
  for(const boss of data.encounters)for(const p1 of Object.keys(data.fighters)){const m=env.start({boss:boss.id,p1});assert.equal(m.s.bossId,boss.id);assert.equal(m.s.p1,p1);assert.equal(m.s.p.hp,120);assert.equal(m.isolated,true);counts.kitEncounterStarts++;}
  const utility=new Set(['brace','parry','order','beacon','post','crate','anchor','winch','feint','syncope','memory']);
  for(const boss of data.encounters)for(const row of data.actions)for(const variant of ['base',...row.variants.map(v=>v.id)]){
    const p=prepareAction(a,row.engineAction,variant),s=p.s;s.bossId=boss.id;s.boss=a.newBoss(a.encounters[boss.id],'normal',1);s.boss.hp=s.boss.maxHp=5000;s.boss.x=row.engineAction==='blink'?630:560;s.cargo.goal=boss.cargo;
    s.p.act=null;s.p.energy=100;a.beginAction(s,p.key);
    if(row.engineAction==='grab'&&boss.cargo){assert.equal(s.p.act,null);assert.equal(s.p.energy,100);assert.equal(row.compatibility[boss.id],'interaction-colis');}
    else{
      assert.equal(s.p.act?.kind,row.engineAction);const before=s.boss.hp;a.perform(s,s.p.act);for(let n=0;n<40;n++)a.projectilesTick(s);
      const expectedDamage=!utility.has(row.engineAction)||row.engineAction==='memory'&&variant==='release';
      assert.equal(s.boss.hp<before,expectedDamage,boss.id+'/'+row.engineAction+'/'+variant);
    }
    counts.compatibilityCases++;
  }
});
test('Facing, low guard, unblockables, counters, chip and invulnerability match the documented defense',()=>{
  for(const difficulty of Object.keys(data.difficulties))for(const facing of [false,true])for(const low of [false,true])for(const blockable of [false,true])for(const crouch of [false,true])for(const shield of [false,true]){
    const s=fixture('lion','sam',difficulty);s.p.guard=true;s.p.crouch=crouch;s.p.shield=shield?55:0;
    const blocked=facing&&(shield||blockable&&(!low||crouch)),counter=blocked&&shield;
    a.damagePlayer(s,20,{x:s.p.x+(facing?100:-100),low,blockable});
    assert.equal(s.p.hp,120-(blocked?(counter?0:2):Math.round(20*data.player.damageScale[difficulty])));
    assert.equal(s.p.guardMeter,100-(blocked?(counter?6:18):0));assert.equal(s.p.invuln,blocked?14:38);
    assert.equal(s.p.shield,shield?(counter?0:55):0);if(counter)assert.equal(s.boss.hp,5000-24);counts.defenseCases++;
  }
  for(const behind of [24,24.001]){const s=fixture();s.p.guard=true;a.damagePlayer(s,20,{x:s.p.x-behind});assert.equal(s.p.hp,behind===24?118:100);counts.defenseCases++;}
  let s=fixture();s.p.guard=true;s.p.guardMeter=17;a.damagePlayer(s,20);assert.equal(s.p.stun,45);assert.equal(s.p.guard,false);assert.equal(s.p.guardMeter,0);
  s=fixture();s.p.invuln=1;assert.equal(a.damagePlayer(s,20),false);assert.equal(s.p.hp,120);
  const m=live();m.s.p.hp=2;m.s.p.guard=true;a.damagePlayer(m.s,20);assert.equal(m.s.result.reason,'health');assert.equal(m.s.result.won,false);
});
test('Power, armor and exposure produce the advertised damage; phase two and stagger do not renew recovery',()=>{
  for(const boss of data.encounters)for(const p1 of Object.keys(data.fighters))for(const exposed of [false,true])for(const base of [10,23,65]){
    const s=fixture(boss.id,p1);if(exposed)s.boss.phase='recover';a.damageBoss(s,base,0);assert.equal(5000-s.boss.hp,data.damage(base,boss.id,p1,exposed));counts.damageCases++;
  }
  let s=fixture('whale');s.boss.phase='dive';assert.equal(a.damageBoss(s,65),false);assert.equal(s.boss.hp,5000);
  s=fixture();s.boss.stagger=84;s.hazards=[{kind:'bolt'},{kind:'orb'},{kind:'ring'},{kind:'spike'},{kind:'slam'}];a.damageBoss(s,1,1);assert.equal(s.boss.phase,'recover');assert.equal(s.boss.timer,90);assert.deepEqual(clone(s.hazards),[{kind:'bolt'},{kind:'orb'}]);
  s.boss.timer=42;a.damageBoss(s,10,99);assert.equal(s.boss.timer,42);assert.equal(s.boss.stagger,0);
  s=fixture();s.boss.hp=101;s.boss.maxHp=200;s.boss.phase='tell';s.boss.timer=50;a.damageBoss(s,1,0);assert.equal(s.boss.hp,100);assert.equal(s.boss.tier,2);assert.equal(s.boss.timer,50);
  s=fixture('whale');s.boss.phase='recover';s.boss.timer=1;s.p.x=300;a.bossTick(s);assert.equal(s.boss.phase,'dive');assert.equal(s.boss.timer,55);for(let n=0;n<55;n++)a.bossTick(s);assert.equal(s.boss.x,980);assert.equal(s.boss.timer,35);
  s=fixture('giant');assert.equal(a.bossBodyHeight(s),380);s.boss.phase='tell';assert.equal(a.bossBodyHeight(s),266);s.boss.phase='attack';assert.equal(a.bossBodyHeight(s),266);s.boss.phase='recover';assert.equal(a.bossBodyHeight(s),380);
});
test('Danger rectangles and friendly projectile delay/last-TTL contacts use the documented volumes',()=>{
  let s=fixture();const h={x:400,y:438,w:20,h:20};assert.equal(a.rectangleTouchesPlayer(s,h),true);s.p.crouch=true;assert.equal(a.rectangleTouchesPlayer(s,h),false);s.p.crouch=false;h.x=427;assert.equal(a.rectangleTouchesPlayer(s,h),false);h.x=426.999;assert.equal(a.rectangleTouchesPlayer(s,h),true);
  for(const delay of [0,1]){s=fixture();s.boss.x=560;s.shots=[{id:1,kind:'sam',x:500,y:496,vx:9,damage:34,w:42,h:32,ttl:1,delay}];a.projectilesTick(s);if(delay){assert.equal(s.boss.hp,5000);assert.equal(s.shots[0].delay,0);a.projectilesTick(s);}assert.equal(s.boss.hp,4966);assert.equal(s.boss.stagger,data.projectileRules.staggerPerHit);assert.equal(s.shots.length,0);}
});
test('Resources, missing markers, mirrored directions and action restrictions are engine-specific',()=>{
  for(const row of data.actions.filter(x=>x.owner!=='common')){
    let p=prepareAction(a,row.engineAction);p.s.p.act=null;p.s.p.energy=row.cost-.01;a.beginAction(p.s,p.key);assert.equal(p.s.p.act,null);assert.equal(p.s.p.energy,row.cost-.01);counts.conditionalCases++;
    p=prepareAction(a,row.engineAction);p.s.p.act=null;p.s.p.energy=row.cost;p.s.p.face=-1;p.s.p.keys={};const dir=a.directions[row.owner].indexOf(row.engineAction);if(dir)p.s.p.keys[dir===1?'left':'right']=true;a.beginAction(p.s,'special');assert.equal(p.s.p.act?.kind,row.engineAction);assert.equal(p.s.p.energy,0);counts.conditionalCases++;
    if(row.requiresMarker){p=prepareAction(a,row.engineAction);p.s.p.act=null;p.s.p.marker=null;p.s.p.energy=100;a.beginAction(p.s,'special');assert.equal(p.s.p.act,null);assert.equal(p.s.p.energy,100);counts.conditionalCases++;}
  }
  let s=fixture();s.p.energy=0;s.p.guardMeter=0;a.movePlayer(s);near(s.p.energy,.19);near(s.p.guardMeter,.55);s.p.keys.guard=true;a.movePlayer(s);near(s.p.guardMeter,.67);
  s=fixture();s.p.y=40;a.beginAction(s,'special');assert.equal(s.p.act.kind,'bola');s.p.y=0;s.p.taps.up=true;a.movePlayer(s);assert(s.p.y>0);assert.equal(s.p.act.kind,'bola');
  s=fixture();s.p.taps={finish:true,special:true,heavy:true,light:true};a.movePlayer(s);assert.equal(s.p.act.kind,'finish');
  s=fixture('truck');s.cargo.goal=2;s.p.taps={throw:true,heavy:true};a.movePlayer(s);assert.equal(s.p.act,null);assert.deepEqual(clone(s.p.taps),{});
  for(const distance of [179.999,180]){const p=prepareAction(a,'heavy','crate');p.s.p.marker.x=p.s.p.x+distance;a.perform(p.s,p.act);assert.equal(p.s.shots.length,distance<180?1:0);counts.conditionalCases++;}
  const p=prepareAction(a,'scan');p.s.boss.x=1200;p.s.p.x=32;const before=p.s.boss.hp;a.perform(p.s,p.act);assert.equal(p.s.boss.exposed,150);assert.equal(p.s.boss.hp,before);
});
test('Truck collection and convoy timing, shared resources and depot damage are distinct',()=>{
  let m=live('truck'),s=m.s;s.boss.hp=1;a.damageBoss(s,1);assert.equal(s.phase,'collect');assert.equal(s.cargo.boxes.length,2);assert.equal(s.result,null);
  const first=s.cargo.boxes[0];s.p.x=first.x+75;a.interact(s);assert.equal(s.cargo.carrying,null);s.p.x=first.x;s.p.y=20;a.interact(s);assert.equal(s.cargo.carrying,null);s.p.y=19.999;a.interact(s);assert.equal(s.cargo.carrying,first.id);
  s.p.x=155;s.p.y=8;a.interact(s);assert.equal(first.state,'ground');s.p.y=0;a.interact(s);assert.equal(s.cargo.carrying,first.id);a.interact(s);assert.equal(s.cargo.delivered,1);
  const second=s.cargo.boxes[1];s.p.x=second.x;a.interact(s);s.p.x=155;s.p.y=0;s.remaining=1;s.p.taps.throw=true;a.step(m);assert.equal(s.result.won,true);assert.equal(s.result.reason,'cargo');assert.equal(s.remaining,0);
  m=live('convoy');s=m.s;s.boss.hp=1;a.damageBoss(s,1);s.p.hp=60;s.p.energy=40;s.p.guardMeter=30;s.cargo.integrity=90;s.remaining=1000;
  api.advance(179,false);assert.equal(s.wave,1);assert.equal(s.waveDelay,1);api.advance(1,false);assert.equal(s.wave,2);assert.equal(s.boss.maxHp,213);assert.equal(s.cargo.boxes.length,1);assert.equal(s.cargo.delivered,0);assert.equal(s.remaining,820);assert.equal(s.p.hp,60);near(s.p.energy,74.2);assert.equal(s.p.guardMeter,100);assert.equal(s.cargo.integrity,90);
  for(const boss of ['truck','convoy']){
    s=fixture(boss);s.cargo.goal=2;s.p.y=300;s.hazards=[{kind:'bolt',x:171,y:552,vx:-8,w:38,h:20,damage:15,ttl:190,delay:0,hit:false,blockable:true,low:true}];a.projectilesTick(s);assert.equal(s.cargo.integrity,boss==='convoy'?93:100);
    s=fixture(boss);s.cargo.goal=2;s.p.x=150;s.p.y=300;s.boss.cycle=1;a.prepareAttack(s);a.launchAttack(s);s.boss.attack.age=37;a.bossTick(s);assert.equal(s.cargo.integrity,boss==='convoy'?82:100);a.bossTick(s);assert.equal(s.cargo.integrity,boss==='convoy'?82:100);
  }
  m=live('truck');s=m.s;s.p.hp=1;s.cargo.integrity=10;s.cargo.carrying=1;s.cargo.boxes=[{id:1,state:'carried',x:s.p.x}];a.damagePlayer(s,20);assert.equal(s.result.reason,'cargo');assert.equal(s.result.won,false);
});
test('Final-step victory and ordinary timeout follow the documented update order',()=>{
  let m=live(),s=m.s;s.remaining=1;s.p.x=400;s.boss.x=560;s.boss.hp=1;s.p.act={kind:'light',frame:5,delay:6,duration:20,face:1};a.step(m);assert.equal(s.result.won,true);assert.equal(s.result.reason,'boss');assert.equal(s.remaining,0);
  m=live();s=m.s;s.remaining=1;a.step(m);assert.equal(s.result.won,false);assert.equal(s.result.reason,'time');
});
test('Standalone checkpoint, Rush exact vitality and isolated campaign saves have separate boundaries',()=>{
  let other=inspectEngine(),m=other.start({isolated:false});m.s.phase='active';m.s.p.hp=65;m.s.p.energy=45;m.s.p.guardMeter=50;other.api.pause(true);
  const saved=other.api.progress().checkpoint;assert(other.api.validCheckpoint(saved));other.api.stop();other.start({isolated:false,resume:saved});assert.equal(other.api.snapshot().p.hp,65);assert.equal(other.api.snapshot().p.energy,45);assert.equal(other.api.snapshot().p.guardMeter,50);assert.deepEqual(clone(other.api.snapshot().p.keys),{});
  other=inspectEngine();other.api.rush.create({p1:'sam',difficulty:'normal'});other.api.rush.start({canvas:other.canvas,manualClock:true,sound:false});m=other.audit.getCurrent();m.s.phase='active';m.s.p.hp=75.25;other.audit.finish(m.s,true,'boss');let run=other.api.rush.progress().run;assert.equal(run.health,95.25);assert.equal(run.results[0].vitality,75.25);assert.equal(run.index,1);assert.equal(run.status,'ready');
  other.api.rush.start({canvas:other.canvas,manualClock:true,sound:false});m=other.audit.getCurrent();assert.equal(m.s.bossId,'squid');assert.equal(m.s.p.hp,95.25);assert.equal(m.s.p.energy,100);assert.equal(m.s.p.guardMeter,100);m.s.phase='active';other.audit.damagePlayer(m.s,500);assert.equal(other.api.rush.progress().run.status,'lost');assert.equal(other.api.rush.start({canvas:other.canvas,manualClock:true,sound:false}),null);
  other=inspectEngine();other.api.rush.create({p1:'sam',difficulty:'hard'});
  for(let i=0;i<6;i++){other.api.rush.start({canvas:other.canvas,manualClock:true,sound:false});m=other.audit.getCurrent();assert.equal(m.s.bossId,data.modes.bossrush.order[i]);assert.equal(m.s.difficulty,'hard');m.s.phase='active';m.s.p.hp=119;other.audit.finish(m.s,true,m.s.cargo.goal?'cargo':'boss');assert.equal(other.api.rush.progress().run.health,120);}
  assert.equal(other.api.rush.progress().run.status,'won');
  other=inspectEngine();other.storage.set(other.api.storageKey,'external-boss');other.storage.set(other.api.rush.storageKey,'external-rush');m=other.start({boss:'convoy',p1:'diehardman',isolated:true});other.api.pause(true);other.api.pause(false);m.s.phase='active';other.audit.finish(m.s,false,'time');other.api.stop();assert.equal(other.storageCalls.length,0);assert.equal(m.s.result.saved,null);assert.equal(other.storage.get(other.api.storageKey),'external-boss');assert.equal(other.storage.get(other.api.rush.storageKey),'external-rush');
  assert.deepEqual(clone(data.modes.campaign.chapters),clone(other.campaign.chapters.filter(c=>c.kind==='boss').map(c=>({id:c.id,title:c.title,p1:c.p1,boss:c.boss,stage:c.stage}))));assert.equal(data.modes.campaign.storage,'echos.campaign.v1');
});
test('Guide renders native accessible sections for all encounter/context selections without changing saves or engine state',()=>{
  const m=env.start(),before=JSON.stringify(api.snapshot()),calls=env.storageCalls.length,players=Object.keys(data.fighters);
  for(const context of Object.keys(data.modes))for(const [i,e] of data.encounters.entries()){
    const html=guide.render({boss:e.id,context,p1:players[i],difficulty:['easy','normal','hard'][i%3]});assert(html.startsWith('<details class="bossGuide">'));assert(html.includes('<summary>Guide des six rencontres'));assert(html.includes(data.modes[context].title));assert.equal((html.match(/class="bossGuideEncounter"/g)||[]).length,6);assert.equal((html.match(/class="bossGuideKit"/g)||[]).length,8);assert(html.includes('scope="col"'));assert(html.includes('scope="row"'));assert(html.includes('<caption>'));assert(html.includes('tabindex="0" role="region"'));assert(!/<script|onclick=|onchange=|onkeydown=/i.test(html));assert.equal((html.match(/<details\b/g)||[]).length,(html.match(/<\/details>/g)||[]).length);counts.guideRenders++;
  }
  const bad=guide.render({boss:'<script>bad</script>',p1:'toString',context:'__proto__',difficulty:'<x>'});assert(!bad.includes('<script>'));assert(bad.includes('Catcher léonin'));assert.equal(JSON.stringify(api.snapshot()),before);assert.equal(env.storageCalls.length,calls);assert.equal(env.audit.getCurrent(),m);
});
test('The Boss engine differs from main only in two remappable cargo instruction strings',()=>{
  const old=cp.execFileSync('git',['show','8d274a015e0edf314a853630031d5eb507354811:modes/echos-de-la-greve/boss.js'],{cwd:repo,encoding:'utf8'});
  const expected=old.replace('Colis saisi · rejoignez le dépôt à gauche puis appuyez sur T','Colis saisi · rejoignez le dépôt à gauche puis utilisez la commande Colis').replace('Approchez-vous d’un colis et appuyez sur T.','Approchez-vous d’un colis et utilisez la commande Colis.');assert.equal(env.sources['boss.js'],expected);
});
const files=['modes/echos-de-la-greve/boss.js','modes/echos-de-la-greve/content.js','modes/echos-de-la-greve/campaign.js','modes/echos-de-la-greve/boss-data.js','modes/echos-de-la-greve/boss-guide.js','modes/echos-de-la-greve/boss-guide.css','outils/generer_catalogue_boss.cjs','outils/lib/boss-engine.cjs','modes/echos-de-la-greve/qa/boss-compendium.cjs','docs/combat/data/boss-et-rencontres.json','docs/combat/BOSS_ET_RENCONTRES.md'];
const result={executedAt:new Date().toISOString(),node:process.version,passed:true,checksPassed:checks.length,checks,counts,method:'Actual Boss closure functions through read-only in-memory hooks, prepared unit states, simulated Canvas/Image and storage. The 48 starts use the public engine. Rush result transitions use explicit prepared result fixtures, not six played victories. Pure guide HTML is inspected without a browser.',browser:false,nativeCanvas:false,hardware:false,syntheticUnitStates:true,limits:['No human balance or full-match strategy certification.','No pixel layout or physical controls validation.','App hooks are checked separately by the UI owner.'],sourceSha256:Object.fromEntries(files.map(file=>[file,sha(read(file))]))};
const output=process.argv[2];if(output){const target=path.resolve(output);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n');}
console.log(JSON.stringify(result,null,2));
