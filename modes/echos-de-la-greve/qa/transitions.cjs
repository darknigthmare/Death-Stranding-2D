/* EDG-G15: actual duel engine, deterministic input runs, explicit checkpoint
 * fixtures for boundary conditions. No browser or source-image rewriting. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const source=file=>fs.readFileSync(path.join(root,file),'utf8'),clone=value=>JSON.parse(JSON.stringify(value));
const sha=value=>createHash('sha256').update(value).digest('hex');
const baseline='2250b7c1b54b445637e0c9354133e6fecbc325de';
const oldFight=execFileSync('git',['show',baseline+':modes/echos-de-la-greve/fight.js'],{cwd:repo,encoding:'utf8'});
const oldTournament=execFileSync('git',['show',baseline+':modes/echos-de-la-greve/tournament.js'],{cwd:repo,encoding:'utf8'});
const oldContent=execFileSync('git',['show',baseline+':modes/echos-de-la-greve/content.js'],{cwd:repo,encoding:'utf8'});
const report={date:new Date().toISOString(),browser:false,nativeCanvas:false,baselineCommit:baseline,checks:[],cases:[],baselineComparisons:0,staticComparisons:0};
const actions=['left','right','up','down','light','heavy','special','guard','throw','finish'];
function catalogue(){
  const context={window:{}};
  for(const file of ['content.js','asset-geometry-20261124.js','assets.js'])vm.runInNewContext(source(file),context);
  return context.window;
}
const data=catalogue(),rule=data.StrandContent.stageLinks['terminal-linked'];
const ordinaryStages=Object.keys(data.StrandContent.stages).filter(id=>!Object.hasOwn(data.StrandContent.stageLinks,id));
function world(options={}){
  const host=catalogue(),frames=new Map();let sequence=0,time=0,result=null;
  host.requestAnimationFrame=fn=>{frames.set(++sequence,fn);return sequence;};host.cancelAnimationFrame=id=>frames.delete(id);
  const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}}),measureText:()=>({width:40})},{get:(o,k)=>k in o?o[k]:()=>{}});
  class Image{set src(file){this._src=file;this.complete=false;this.naturalWidth=0;}get src(){return this._src;}}
  const context={window:host,Image,structuredClone};vm.runInNewContext(options.old?oldFight:source('fight.js'),context);
  const engine=host.StrandFight,canvas={getContext:()=>ctx};
  const config={canvas,p1:'sam',p2:'higgs',stage:'terminal-linked',mode:'local',clock:'network',seed:23741,sound:false,...options};
  delete config.old;
  engine.start({...config,onEnd:value=>{result=clone(value);}});
  const frame=()=>{time+=1000/60+.000001;const pending=[...frames.values()];frames.clear();for(const fn of pending)fn(time);};
  function step(inputs=[],silent=true){
    if(engine.network.checkpoint())engine.network.advance(inputs,silent);
    else {for(const args of inputs)engine.input(...args);const tick=engine.snapshot()?.tick;let attempts=0;while(engine.snapshot()?.tick===tick&&frames.size&&attempts++<3)frame();}
  }
  const advance=(n,inputs=[])=>{for(let i=0;i<n;i++)step(i?[]:inputs);};
  const ready=()=>{for(let i=0;i<80&&engine.snapshot().phase==='intro';i++)step();assert.equal(engine.snapshot().phase,'fight');};
  return {engine,canvas,config,step,advance,ready,frame,frames,result:()=>result,point:()=>clone(engine.network.checkpoint()),state:()=>clone(engine.snapshot())};
}
const tap=(player,key)=>[[player,key,true],[player,key,false]];
function until(w,predicate,limit=150){for(let i=0;i<limit&&!predicate(w.state());i++)w.step();assert(predicate(w.state()),'Expected state reached within '+limit+' ticks');return w.state();}
function fixture(w,fn){const point=w.point();assert(point,'Fixture uses public network checkpoint');fn(point.state);assert(w.engine.network.restore(point));return point;}
function atEdge({attacker=1,side=1,options={},natural=false}={}){
  const w=world(options);w.ready();
  if(natural){
    const direction=side===1?'right':'left';
    w.step([[1,direction,true],[2,direction,true]]);
    until(w,s=>s.fighters[2-attacker].x*(side) >= (side===1?1231:-49)&&Math.abs(s.fighters[0].x-s.fighters[1].x)<60,320);
    w.step([[1,direction,false],[2,direction,false]]);w.advance(3);
  } else fixture(w,s=>{
    const a=s.f[attacker-1],v=s.f[2-attacker];v.x=side===1?1220:60;a.x=v.x-side*52;a.face=side;v.face=-side;
  });
  return w;
}
function strike(w,player=1,key='heavy'){w.step(tap(player,key));return until(w,s=>s.phase==='transition'||s.phase==='roundover'||s.phase==='finish',60);}
function resources(point){return {parcel:point.state.parcel,f:point.state.f.map(f=>({hp:f.hp,balance:f.balance,chiral:f.chiral}))};}

// Catalogue identities and file aliases make the rule an explicit selection.
for(const group of ['stages','skyplates','distants','midgrounds','floors','foregrounds'])assert.equal(data.StrandAssets[group]['terminal-linked'],data.StrandAssets[group].terminal,group+' aliases quay');
assert.deepEqual(clone(data.StrandAssets.stageGeometry['terminal-linked']),clone(data.StrandAssets.stageGeometry.terminal));
assert.equal(rule.replayTag,'terminal-quay-hangar@1');assert.equal(rule.limit,1);
report.catalogue={configurations:Object.keys(data.StrandContent.stages).length,
  places:new Set(Object.entries(data.StrandContent.arenas).map(([id,a])=>a.variantOf||a.zoneOf||id)).size,
  graphicalZones:new Set(Object.entries(data.StrandContent.arenas).map(([id,a])=>a.variantOf||id)).size,
  uniqueLayers:new Set(['skyplates','distants','midgrounds','floors','foregrounds'].flatMap(g=>Object.values(data.StrandAssets[g]))).size};
report.checks.push('Dedicated linked configuration; ordinary terminal and standalone hangar have no link; all six quay files reused by path');
{
  const current={window:{StrandContent:data.StrandContent}},previous={window:{}};
  vm.runInNewContext(source('tournament.js'),current);vm.runInNewContext(oldContent,previous);vm.runInNewContext(oldTournament,previous);
  const stripStages=cup=>{const value=clone(cup);for(const match of value.rounds.flat())delete match.stage;return value;};
  let created=0,preserved=0;
  for(const count of [4,5,6,7,8])for(const humans of [1,2])for(let seed=1;seed<=20;seed++){
    const config={count,humans,p1:'sam',p2:'fragile',difficulty:'normal',seed};
    const cup=current.window.StrandTournament.create(config),old=previous.window.StrandTournament.create(config);
    assert(cup.rounds.flat().every(m=>!data.StrandContent.stageLinks[m.stage]),'No implicit link in automatic draw');
    assert.deepEqual(stripStages(cup),stripStages(old),'Only selected stage can differ from the old bracket');created++;
    // Complete one human match with the previous service, serialize, then
    // resume with the new service. Neither existing stage nor result changes.
    const first=previous.window.StrandTournament.next(old);
    previous.window.StrandTournament.record(old,first.id,first.players[0],[2,0]);
    const saved=clone(old),stages=saved.rounds.flat().map(m=>m.stage),completed=clone(saved.rounds.flat().filter(m=>m.winner!==null));
    let match;while((match=current.window.StrandTournament.next(saved)))current.window.StrandTournament.record(saved,match.id,match.players[0],[2,0]);
    assert.deepEqual(saved.rounds.flat().map(m=>m.stage),stages,'Old saved stage assignments are preserved');
    for(const finished of completed)assert.deepEqual(saved.rounds.flat().find(m=>m.id===finished.id),finished,'Old completed results remain intact');preserved++;
  }
  const legacy=previous.window.StrandTournament.create({count:4,humans:1,p1:'sam',p2:'higgs',difficulty:'easy',seed:7});
  for(const match of legacy.rounds.flat())delete match.stage;
  const match=current.window.StrandTournament.next(legacy);current.window.StrandTournament.record(legacy,match.id,match.players[0],[2,0]);
  assert(legacy.rounds.flat().every(m=>!Object.hasOwn(m,'stage')),'Old stage-less save is left for the existing app fallback');
  report.tournament={automaticDrawsChecked:created,oldSavesResumed:preserved,legacyWithoutStagePreserved:true};
  report.checks.push('200 automatic tournament draws exclude links; 200 pre-feature saved brackets resume with stages and completed results intact; stage-less legacy metadata remains untouched');
}

// All player/side combinations use real contact resolution. Two naturally
// reachable orientations are driven from the initial positions by inputs only.
for(const attacker of [1,2])for(const side of [-1,1])for(const key of ['heavy','throw']){
  const natural=(attacker===1&&side===1)||(attacker===2&&side===-1);
  const w=atEdge({attacker,side,natural}),before=w.point();
  if(key==='throw')w.step([[3-attacker,'guard',true]]);
  const started=strike(w,attacker,key),point=w.point();
  assert.equal(started.phase,'transition');assert.equal(started.link.attacker,attacker);assert.equal(started.link.side,side);
  assert.equal(started.link.used,1);assert.equal(started.link.zone,'terminal');assert.equal(point.state.phaseTicks,36);
  assert(point.state.f[2-attacker].hp<before.state.f[2-attacker].hp,'Triggering hit damages normally');
  const kept=resources(point),remaining=point.state.remaining,beat=point.state.beat;
  for(let i=1;i<=36;i++){
    w.step();assert.deepEqual(resources(w.point()),kept,'No passage damage, regen or cost');
    assert.equal(w.point().state.remaining,remaining);assert.equal(w.point().state.beat,beat);
    assert.equal(w.state().phase,i===36?'fight':'transition');
  }
  const arrived=w.point(),a=arrived.state.f[attacker-1],v=arrived.state.f[2-attacker];
  assert.equal(arrived.state.link.zone,'terminal-hangar');assert.equal(a.x,640-side*130);assert.equal(v.x,640+side*130);
  assert.equal(a.face,side);assert.equal(v.face,-side);assert.equal(arrived.state.camera,0);
  for(const f of arrived.state.f){assert.equal(f.y,0);assert.equal(f.stun,0);assert.equal(f.blockStun,0);assert.equal(f.act,null);assert.equal(f.combo,0);assert.deepEqual(f.queue,[]);}
  w.step([[attacker,side===1?'right':'left',true]]);assert.notEqual(w.point().state.f[attacker-1].x,a.x,'Immediate control on arrival');
  report.cases.push({attacker,side,move:key,inputOnly:natural,triggerTick:point.state.tick,arrivalTick:arrived.state.tick,resourcesPreserved:true});
  w.engine.stop();
}
report.checks.push('8 successful edge contacts: both players × both edges × heavy/grab; 4 input-only approaches, guarded grabs, 36 exact ticks, resources and arrival control');
{
  const w=atEdge();strike(w);
  w.step([[1,'right',true],[1,'heavy',true],[2,'guard',true]]);w.advance(35);
  const arrival=w.point();assert.equal(arrival.state.phase,'fight');assert.equal(arrival.state.f[0].keys.right,true);assert.equal(arrival.state.f[0].keys.heavy,true);
  assert.equal(arrival.state.f[0].act,null);assert.deepEqual(arrival.state.f[0].queue,[]);
  w.step();assert(w.point().state.f[0].x>arrival.state.f[0].x);assert(w.point().state.f[1].guard);assert.equal(w.point().state.f[0].act,null);
  w.step([[1,'heavy',false],[1,'heavy',true]]);assert.equal(w.point().state.f[0].act.key,'heavy');w.engine.stop();
}
report.checks.push('Held movement/guard survive passage; an attack pressed during passage is not buffered and requires a new edge after arrival');

// Negative cases and resource/transient behaviour use explicit fixtures.
for(const kind of ['blocked','light','inward','central','projectile','airborne']){
  const w=atEdge();
  if(kind==='blocked')w.step([[2,'guard',true]]);
  if(kind==='inward')fixture(w,s=>{s.f[0].x=1220;s.f[1].x=1168;s.f[0].face=-1;s.f[1].face=1;});
  if(kind==='central')fixture(w,s=>{s.f[0].x=600;s.f[1].x=652;});
  if(kind==='projectile')fixture(w,s=>{s.shots=[{owner:0,kind:'sam',x:1200,y:500,vx:0,ttl:20,age:0}];});
  else w.step(tap(1,kind==='light'?'light':'heavy'));
  if(kind==='airborne'){
    w.advance(12);fixture(w,s=>{s.f[1].y=20;s.f[1].vy=6;s.f[1].grounded=false;});
  }
  w.advance(65);assert.equal(w.state().link.used,0,kind+' cannot open link');assert.equal(w.state().link.zone,'terminal');
  if(kind==='blocked'){assert.equal(w.state().fighters[1].hp,100);assert(w.point().state.f[1].balance<100,'Blocked heavy made contact');}
  else assert(w.state().fighters[1].hp<100,kind+' actually hit; exclusion is not a whiff');
  w.engine.stop();
}
{
  const w=atEdge({options:{parcel:true}});
  fixture(w,s=>{s.f[0].marker={kind:'post',x:500,ttl:100};s.f[0].scan={x:700,ttl:100};s.f[1].marker={kind:'mine',x:500,ttl:100};
    s.shots=[{owner:0,kind:'cliff',x:700,y:500,vx:0,ttl:100,age:0}];s.f[0].combo=4;s.f[0].comboTTL=80;});
  strike(w);const p=w.point();assert.deepEqual(p.state.shots,[]);assert.deepEqual(p.state.sparks,[]);
  for(const f of p.state.f){assert.equal(f.marker,null);assert(!f.scan);assert.equal(f.combo,0);assert.equal(f.act,null);assert.equal(f.vx,0);}
  assert.equal(p.state.parcel,'intact');w.advance(36);
  fixture(w,s=>{s.f[0].x=1168;s.f[1].x=1220;});w.step(tap(1,'heavy'));w.advance(65);
  assert.equal(w.state().link.used,1);assert.equal(w.state().phase,'fight');assert.equal(w.state().link.zone,'terminal-hangar');
  w.engine.stop();
}
{
  const w=atEdge({attacker:2,side:-1,options:{parcel:true}});strike(w,2);assert.equal(w.point().state.parcel,'broken');w.advance(36);assert.equal(w.point().state.parcel,'broken');w.engine.stop();
}
report.checks.push('6 exclusions; projectiles/markers/scans/combos cancelled; intact and broken parcel preserved; no second passage in the same round');

// Trigger candidates are discarded after the complete contact batch if a
// round decision or a dojo vitality reset takes priority.
for(const kind of ['ko','ko-time','double-ko','time','tied-time','trade']){
  const w=atEdge();
  w.step(tap(1,'heavy'));w.advance(12);
  fixture(w,s=>{
    assert.equal(s.f[0].act.t,13);
    if(kind==='ko'||kind==='ko-time')s.f[1].hp=1;
    if(kind==='time'||kind==='tied-time'||kind==='ko-time')s.remaining=1;
    if(kind==='tied-time'){s.f[0].hp=88;s.f[1].hp=100;}
    if(kind==='double-ko'||kind==='trade'){
      s.f[1].act={key:'heavy',t:13,hit:false};s.f[1].face=-1;
      if(kind==='double-ko'){s.f[0].hp=13;s.f[1].hp=12;}
    }
  });
  w.step();const s=w.point().state;
  if(kind==='trade'){assert.equal(s.phase,'transition');assert(s.f.every(f=>f.hp<100),'Both contacts resolve before passage');}
  else {assert.equal(s.link.used,0);assert.notEqual(s.phase,'transition');}
  if(kind==='ko'||kind==='ko-time')assert.equal(s.reason,'ko');
  if(kind==='time')assert.equal(s.reason,'time');
  if(kind==='double-ko'||kind==='tied-time'){assert.equal(s.sudden,true);assert.equal(s.remaining,900);assert(s.f.every(f=>f.hp===1));}
  w.engine.stop();
}
{
  const w=atEdge();strike(w);w.advance(36);
  fixture(w,s=>{s.f[0].x=600;s.f[1].x=660;s.f[1].hp=1;});w.step(tap(1,'heavy'));
  until(w,s=>s.phase==='roundover');until(w,s=>s.round===2,110);
  assert.equal(w.state().phase,'intro');assert.equal(w.state().link.used,0);assert.equal(w.state().link.zone,'terminal');w.engine.stop();
}
{
  const w=world({mode:'training',clock:null});w.ready();w.step([[1,'right',true]]);
  until(w,s=>s.fighters[1].x>=1220,450);w.step([[1,'right',false]]);strike(w);w.advance(36);
  assert.equal(w.state().link.zone,'terminal-hangar');w.engine.setTraining({reset:true});assert.equal(w.state().link.zone,'terminal');assert.equal(w.state().link.used,0);w.engine.stop();
}
{
  const w=world({mode:'training',clock:null});w.ready();w.step([[1,'right',true]]);
  until(w,s=>s.fighters[1].x>=1220,450);w.step([[1,'right',false]]);
  for(let i=0;i<18;i++)w.advance(30,tap(1,'light'));
  assert.equal(w.state().fighters[1].hp,10);w.advance(40,tap(1,'heavy'));
  assert.equal(w.state().fighters[1].hp,100);assert.equal(w.state().link.used,0);assert.equal(w.state().phase,'fight');w.engine.stop();
}
report.checks.push('K.O./double K.O./time/tied-time priorities, equal-frame trade, reset between rounds, actual dojo approach/reset and lethal-heavy vitality reset before passage');

// JSON restoration works before, during and after the passage. Preference
// changes do not enter checkpoints; restoring also chooses the matching zone.
{
  const w=atEdge({natural:true}),points=[w.point()];strike(w);points.push(w.point());w.advance(18);points.push(w.point());w.advance(17);points.push(w.point());w.step();points.push(w.point());
  for(const point of points){
    const a=world(),b=world({staticScenery:true,reducedEffects:true});assert(a.engine.network.restore(point));assert(b.engine.network.restore(clone(point)));
    for(let tick=0;tick<130;tick++){
      const input=tick===40?tap(1,'heavy'):tick===70?[[2,'left',true]]:tick===85?[[2,'left',false]]:[];
      a.step(input);b.step(input);assert.deepEqual(b.point(),a.point());report.staticComparisons++;
    }
    a.engine.stop();b.engine.stop();
  }
  for(const mutate of [s=>{delete s.link;},s=>{s.link.version=99;},s=>{s.link.zone='shore';},s=>{s.link.used=2;},s=>{s.phase='transition';s.phaseTicks=0;},s=>{s.link.used=0;s.phase='transition';}]){
    const bad=clone(points[2]);mutate(bad.state);const before=w.point();assert.equal(w.engine.network.restore(bad),false);assert.deepEqual(w.point(),before);
  }
  const ordinary=world({stage:'terminal'});assert.equal(ordinary.engine.network.restore(points[2]),false);ordinary.engine.stop();w.engine.stop();
}
report.checks.push('5 JSON restore positions, 650 static/animated checkpoint comparisons, 7 incompatible restores rejected atomically');

// Ordinary stages must remain identical against the exact pre-feature engine.
for(const stage of ordinaryStages)for(const p1 of ['sam','mule','mama','heartman']){
  const a=world({stage,p1}),b=world({stage,p1,old:true});
  for(const w of [a,b])w.ready();
  const sequence=[[40,[[1,'right',true]]],[35,[[1,'right',false],...tap(1,'heavy')]],[55,tap(1,'special')],[40,[[1,'left',true],...tap(1,'special'),[1,'left',false]]]];
  for(const [ticks,inputs]of sequence){a.advance(ticks,inputs);b.advance(ticks,inputs);assert.deepEqual(a.point(),b.point(),'Ordinary parity '+stage+'/'+p1);assert(!Object.hasOwn(a.point().state,'link'));report.baselineComparisons++;}
  a.engine.stop();b.engine.stop();
}
report.checks.push(report.baselineComparisons+' unchanged ordinary checkpoints, including the standalone hangar; four representative kits on every unlinked configuration');

// One complete input-only match, then a full recording replay and two network
// clients with late inputs and genuine checkpoint rewind/re-simulation.
const live=atEdge({natural:true,options:{record:true,roundsToWin:1}}),states=new Map();
// Replay must include the initial approach, so collect checkpoints again from
// its complete input tape after the live match has ended.
strike(live);let safety=0;
while(live.state().phase!=='ended'&&safety++<6000){
  const s=live.state(),inputs=[];
  if(s.phase==='fight'){
    const [a,b]=s.fighters,gap=Math.abs(a.x-b.x);
    const desired=gap>75;
    const point=live.point();
    for(const [key,on]of [['right',desired&&a.x<b.x],['left',desired&&a.x>b.x]])if(!!point.state.f[0].keys[key]!==on)inputs.push([1,key,on]);
    if(gap<126&&!a.action&&!a.stun)inputs.push(...tap(1,'heavy'));
  }
  if(s.phase==='finish')inputs.push(...tap(s.winner,'finish'));
  live.step(inputs);
}
assert(live.result()&&!live.result().replayMismatch,'Input-only match completed');
const tape=live.result().replay;assert(live.engine.validReplay(tape));assert.equal(tape.stageRules,rule.replayTag);
for(const wrong of [undefined,'terminal-quay-hangar@2']){const bad=clone(tape);if(wrong===undefined)delete bad.stageRules;else bad.stageRules=wrong;assert.equal(live.engine.validReplay(bad),false);}
const events=new Map();
for(const [tick,code]of tape.events){assert.notEqual(code,-1);const index=Math.floor(code/2),event=[1+Math.floor(index/actions.length),actions[index%actions.length],!!(code%2)];if(!events.has(tick))events.set(tick,[]);events.get(tick).push(event);}
const canonical=world({roundsToWin:1}),playback=world({replay:tape,clock:null}),delayed=world({roundsToWin:1,staticScenery:true});
const checkpoints=new Map([[0,delayed.point()]]),known=new Map(),delivered=new Set();let rewinds=0,zoneRewinds=0;
for(let tick=0;tick<tape.ticks;tick++){
  canonical.step(events.get(tick)||[]);states.set(tick+1,canonical.state());
  playback.step();assert.deepEqual(playback.state(),canonical.state(),'Full replay at tick '+(tick+1));
}
assert.deepEqual(canonical.point(),live.point());assert.equal(playback.result().winner,live.result().winner);assert(!playback.result().replayMismatch);
let current=0;
const pending=tape.events.map(([tick,code],index)=>({tick,code,index,delivery:tick+((Math.floor(code/2)%actions.length===5)?60:7)}));
for(let wall=0;wall<=tape.ticks+65;wall++){
  let earliest=Infinity;
  for(const event of pending)if(!delivered.has(event.index)&&event.delivery<=wall){
    delivered.add(event.index);if(!known.has(event.tick))known.set(event.tick,[]);known.get(event.tick).push(event);
    if(event.tick<current)earliest=Math.min(earliest,event.tick);
  }
  const inputAt=tick=>(known.get(tick)||[]).sort((a,b)=>a.index-b.index).map(({code})=>{const index=Math.floor(code/2);return [1+Math.floor(index/actions.length),actions[index%actions.length],!!(code%2)];});
  if(earliest<Infinity){
    const previousZone=delayed.state().link.zone;assert(delayed.engine.network.restore(checkpoints.get(earliest)));rewinds++;
    for(let at=earliest;at<current;at++){delayed.step(inputAt(at));checkpoints.set(at+1,delayed.point());}
    if(previousZone!==delayed.state().link.zone)zoneRewinds++;
  }
  if(current<tape.ticks){delayed.step(inputAt(current));current++;checkpoints.set(current,delayed.point());}
}
assert.equal(delivered.size,pending.length);assert.deepEqual(delayed.point(),canonical.point(),'Two-client final state after late input delivery');assert(rewinds>0);assert(zoneRewinds>0,'Late input reconciliation crosses the zone boundary');
report.recording={ticks:tape.ticks,events:tape.events.length,stageRules:tape.stageRules,winner:live.result().winner,
  replaySnapshotsCompared:states.size,networkRewinds:rewinds,networkZoneChangesAfterRewind:zoneRewinds,finalCheckpointSha256:sha(JSON.stringify(canonical.point()))};
for(const w of [live,canonical,playback,delayed])w.engine.stop();
report.checks.push('Full input-only linked match, complete replay state parity, two clients with delayed commands and rollback to the exact same final checkpoint');

// Local pause/stop has no asynchronous transition callback that could move a
// later match into the hangar. A suspended network simply performs no advances.
{
  const w=world({clock:null});w.ready();w.step([[1,'right',true],[2,'right',true]]);
  until(w,s=>s.fighters[1].x>=1231&&Math.abs(s.fighters[0].x-s.fighters[1].x)<60,320);
  w.step([[1,'right',false],[2,'right',false]]);strike(w);
  w.engine.pause(true);const before=w.state();for(let i=0;i<60;i++)w.frame();assert.deepEqual(w.state(),before);
  w.engine.pause(false);w.advance(36);assert.equal(w.state().link.zone,'terminal-hangar');
  w.engine.stop();for(let i=0;i<60;i++)w.frame();assert.equal(w.engine.snapshot(),null);assert.equal(w.frames.size,0);
}
{
  const w=world({clock:null});w.ready();w.step([[1,'right',true],[2,'right',true]]);
  until(w,s=>s.fighters[1].x>=1231&&Math.abs(s.fighters[0].x-s.fighters[1].x)<60,320);
  w.step([[1,'right',false],[2,'right',false]]);strike(w);
  const obsoleteFrame=[...w.frames.values()][0];assert.equal(typeof obsoleteFrame,'function');w.engine.stop();assert.equal(w.frames.size,0);
  w.engine.start({canvas:w.canvas,mode:'local',clock:'network',stage:'terminal',sound:false});const fresh=w.point();obsoleteFrame(999999);
  assert.deepEqual(w.point(),fresh,'A frame from an abandoned passage cannot affect the next match');assert(!w.state().link);w.engine.stop();
}
report.checks.push('Local pause freezes passage, resumption arrives once, stop during passage cancels frames and an obsolete callback cannot mutate a new ordinary match');
report.sourceSha256=Object.fromEntries(['content.js','assets.js','fight.js','tournament.js','qa/transitions.cjs'].map(file=>[file,sha(source(file))]));
report.passed=true;console.log(JSON.stringify(report,null,2));
