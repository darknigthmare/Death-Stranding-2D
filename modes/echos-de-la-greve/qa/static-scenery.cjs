/* Static scenery is a local presentation preference. This harness compares
 * complete checkpoints and renders the existing scenery functions on native
 * Canvas. Test-only closure hooks expose those functions without replacing
 * their bodies or modifying any source image. No browser is launched. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const source=file=>fs.readFileSync(path.join(root,file),'utf8'),clone=value=>JSON.parse(JSON.stringify(value));
const sha=value=>createHash('sha256').update(value).digest('hex');
const baseline='c3fa7ead88f1667b80202a44dca6549784021866';
const previous=file=>execFileSync('git',['show',baseline+':modes/echos-de-la-greve/'+file],{cwd:repo,encoding:'utf8'});
const oldFight=previous('fight.js'),oldBoss=previous('boss.js');
const report={date:new Date().toISOString(),browser:false,nativeCanvas:false,baselineCommit:baseline,
  baselineMethod:'Previous engines and current engines receive the same current content/assets; only runtime changes are compared.',
  staticAnimatedCheckpoints:0,baselineCheckpoints:0,bossStaticAnimatedCheckpoints:0,bossBaselineCheckpoints:0,
  preferenceChanges:0,checks:[],nativeStages:[],nativeBossStages:[]};
function catalogue(){
  const context={window:{}};
  for(const file of ['content.js','asset-geometry-20261124.js','assets.js','boss-geometry-20261124.js','boss-assets.js'])vm.runInNewContext(source(file),context);
  return context.window;
}
const data=catalogue(),allStages=Object.keys(data.StrandContent.stages),fighters=Object.keys(data.StrandContent.fighters);
function logicalWorld({boss=false,old=false}={}){
  const host=catalogue(),pending=new Map();let serial=0;
  host.localStorage={getItem(){return null;},setItem(){}};
  host.requestAnimationFrame=fn=>{pending.set(++serial,fn);return serial;};host.cancelAnimationFrame=id=>pending.delete(id);
  const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:()=>({width:40})},
    {get:(object,key)=>key in object?object[key]:()=>{}});
  class Image{set src(value){this._src=value;this.complete=false;this.naturalWidth=0;this.naturalHeight=0;}get src(){return this._src;}}
  vm.runInNewContext(old?(boss?oldBoss:oldFight):source(boss?'boss.js':'fight.js'),{window:host,Image,structuredClone});
  return {engine:boss?host.StrandBoss:host.StrandFight,canvas:{getContext:()=>ctx}};
}
const tap=key=>[[1,key,true],[1,key,false]],special=direction=>direction?[[1,direction,true],...tap('special'),[1,direction,false]]:tap('special');
const sequence=[[4,[[1,'guard',true]]],[4,[[1,'guard',false],[1,'down',true]]],
  [46,[[1,'down',false],...tap('up')]],[24,[[1,'right',true]]],[35,[[1,'right',false],...tap('light')]],
  [45,tap('heavy')],[60,special()],[60,special('right')],[60,special('left')]];
for(const stage of allStages)for(const p1 of fighters){
  const animated=logicalWorld(),still=logicalWorld(),prior=logicalWorld({old:true});
  for(const target of [animated,still,prior]){
    target.engine.start({canvas:target.canvas,p1,p2:'higgs',stage,mode:'local',clock:'network',seed:2456,sound:false,staticScenery:target===still});
    for(let tick=0;tick<75;tick++)target.engine.network.advance([],true);
  }
  for(const [index,[ticks,inputs]]of sequence.entries()){
    if(index===3||index===6){
      const before=still.engine.network.checkpoint();still.engine.setStaticScenery(index===6);
      assert.deepEqual(clone(still.engine.network.checkpoint()),clone(before),'Changing scenery leaves every checkpoint field unchanged');report.preferenceChanges++;
    }
    for(const target of [animated,still,prior])for(let tick=0;tick<ticks;tick++)target.engine.network.advance(tick?[]:inputs,true);
    assert.deepEqual(clone(animated.engine.network.checkpoint()),clone(still.engine.network.checkpoint()),'Static/animated duel parity: '+stage+' / '+p1);
    assert.deepEqual(clone(animated.engine.network.checkpoint()),clone(prior.engine.network.checkpoint()),'Prior/current duel parity: '+stage+' / '+p1);
    report.staticAnimatedCheckpoints++;report.baselineCheckpoints++;
  }
  const before=still.engine.network.checkpoint();still.engine.setReducedEffects(true);
  assert(still.engine.snapshot().staticScenery&&still.engine.snapshot().reducedEffects,'Both preferences may be enabled independently');
  assert.deepEqual(clone(still.engine.network.checkpoint()),clone(before),'Reduced effects and static scenery are absent from checkpoints');
  still.engine.network.advance([[1,'right',true]],true);still.engine.network.restore(before);
  assert(still.engine.snapshot().staticScenery,'Rollback retains the local scenery preference');
  assert.deepEqual(clone(still.engine.network.checkpoint()),clone(before),'Rollback restores the same combat state');
  for(const target of [animated,still,prior])target.engine.stop();
}
for(const boss of ['lion','squid','whale','giant','truck','convoy'])for(const p1 of fighters){
  const animated=logicalWorld({boss:true}),still=logicalWorld({boss:true}),prior=logicalWorld({boss:true,old:true});
  for(const target of [animated,still,prior])target.engine.start({canvas:target.canvas,p1,boss,stage:'shore',manualClock:true,sound:false,isolated:true,staticScenery:target===still});
  for(const [ticks,inputs]of sequence){
    for(const target of [animated,still,prior]){for(const args of inputs)target.engine.input(...args);target.engine.advance(ticks,false);}
    const point=animated.engine.checkpoint();assert(point,'Reachable active boss checkpoint');
    assert.deepEqual(clone(still.engine.checkpoint()),clone(point),'Static/animated boss parity: '+boss+' / '+p1);
    assert.deepEqual(clone(prior.engine.checkpoint()),clone(point),'Prior/current boss parity: '+boss+' / '+p1);
    report.bossStaticAnimatedCheckpoints++;report.bossBaselineCheckpoints++;
  }
  const before=still.engine.checkpoint();still.engine.setStaticScenery(false);still.engine.setStaticScenery(true);
  assert.deepEqual(clone(still.engine.checkpoint()),clone(before),'Changing boss scenery leaves the full checkpoint unchanged');
  for(const target of [animated,still,prior])target.engine.stop();
}
report.checks.push('Eight fighters on every current arena: static/animated and previous/current duel checkpoints, toggles, reduced-effects independence and rollback');
report.checks.push('Six bosses with all eight fighters: static/animated and previous/current checkpoints remain identical');

async function nativeChecks(){
  const {createCanvas,loadImage}=require('@napi-rs/canvas');
  const requested=process.argv.find(arg=>arg.startsWith('--stages='))?.slice(9).split(','),ids=requested||allStages;
  const output=process.env.STATIC_SCENERY_SCREENSHOTS||path.join(require('node:os').tmpdir(),'echos-static-scenery');
  fs.mkdirSync(output,{recursive:true});
  const exportStages=new Set(['shore','plate-gate-ds2','sandstorm-ds2','dunes-ds2']);
  const assets=data.StrandAssets,stageGroups=['stages','skyplates','distants','midgrounds','floors','foregrounds'];
  function paths(stage,boss){
    const files=new Set(stageGroups.map(group=>assets[group][stage]));
    for(const fighter of ['higgs','fragile']){
      for(const group of ['fighters','actions','steps','hits','jumps','finishers']){
        const item=assets[group]?.[fighter];if(typeof item==='string')files.add(item);else if(item)Object.values(item).forEach(file=>files.add(file));
      }
      Object.values(assets.poses?.[fighter]||{}).forEach(file=>files.add(file));
      Object.values(assets.wardrobe?.[fighter]?.atelier?.poses||{}).forEach(file=>files.add(file));
    }
    files.add(assets.props.goldImprint);files.add(assets.projectiles.higgs);
    if(boss){
      Object.values(data.StrandBossAssets.sprites.lion).forEach(file=>files.add(file));
      Object.values(data.StrandBossAssets.effects).forEach(file=>files.add(file));
      Object.values(assets.projectiles).forEach(file=>files.add(file));
      for(const key of ['cargo','bridgeDeck','closedParcel'])files.add(assets.props[key]);
    }
    return files;
  }
  async function world(stage,boss=false){
    const decoded=new Map();for(const file of paths(stage,boss))decoded.set(file,await loadImage(path.join(root,file)));
    const surface=createCanvas(1280,720),native=surface.getContext('2d'),images=[],rectangles=[];
    const ctx=new Proxy(native,{get(target,key){
      if(key==='drawImage')return(im,...args)=>{const t=target.getTransform();images.push({file:im.src,args,matrix:[t.a,t.b,t.c,t.d,t.e,t.f]});target.drawImage(im.drawable,...args);};
      if(key==='fillRect')return(...args)=>{rectangles.push({args,fill:String(target.fillStyle)});target.fillRect(...args);};
      const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
    },set(target,key,value){Reflect.set(target,key,value,target);return true;}});
    const host=catalogue();host.localStorage={getItem(){throw Error('Native isolated session read storage');},setItem(){throw Error('Native isolated session wrote storage');}};
    host.requestAnimationFrame=()=>1;host.cancelAnimationFrame=()=>{};
    class Image{set src(file){this._src=file;this.drawable=decoded.get(file);assert(this.drawable,'Decoded image: '+file);this.complete=true;this.naturalWidth=this.drawable.width;this.naturalHeight=this.drawable.height;}get src(){return this._src;}}
    const name=boss?'boss.js':'fight.js',token=boss?'  host.StrandBoss=':'  host.StrandFight =';
    const hook=boss?'  host.__renderScenery=()=>scenery(current);\n':'  host.__renderScenery=()=>{scenery(match);foreground(match);};\n';
    assert(source(name).includes(token),'Native test hook insertion point');
    vm.runInNewContext(source(name).replace(token,hook+token),{window:host,Image,structuredClone});
    const engine=boss?host.StrandBoss:host.StrandFight,canvas={getContext:()=>ctx};
    function start(staticScenery,preserveStaticScenery=false){engine.start({canvas,p1:'higgs',p2:'fragile',stage,boss:'lion',mode:'local',clock:'network',manualClock:true,isolated:true,seed:8172,sound:false,staticScenery,preserveStaticScenery});}
    function advance(ticks,inputs=[]){if(boss){for(const args of inputs)engine.input(...args);engine.advance(ticks,false);}else for(let i=0;i<ticks;i++)engine.network.advance(i?[]:inputs,true);}
    function backdrop(){native.setTransform(1,0,0,1,0,0);native.clearRect(0,0,1280,720);host.__renderScenery();return sha(native.getImageData(0,0,1280,720).data);}
    function full(){images.length=0;rectangles.length=0;boss?engine.draw():engine.network.draw();return {actors:clone(images.filter(row=>row.file.includes('/fighters/'))),rectangles:clone(rectangles)};}
    function capture(name){full();fs.writeFileSync(path.join(output,name),surface.toBuffer('image/webp',88));return name;}
    return {engine,start,advance,backdrop,full,capture,decoded};
  }
  for(const stage of ids){
    const w=await world(stage),row={stage,animated:{},static:{},captures:[]};
    for(const frozen of [false,true]){
      w.start(frozen);w.advance(78);const before=w.backdrop(),actorsBefore=w.full().actors;
      if(exportStages.has(stage))row.captures.push(w.capture(stage+'-duel-'+(frozen?'static':'animated')+'-before.webp'));
      w.advance(32,[[1,'right',true],[2,'right',true]]);const after=w.backdrop(),actorsAfter=w.full().actors;
      assert.notDeepEqual(actorsBefore,actorsAfter,'Fighter drawing keeps moving under '+(frozen?'static':'animated')+' scenery: '+stage);
      if(frozen)assert.equal(before,after,'Every backdrop pixel stays still, including weather and decorative loops: '+stage);
      else assert.notEqual(before,after,'Animated backdrop follows the active clock/camera: '+stage);
      row[frozen?'static':'animated']={before,after,fighterDrawingChanges:true};
      if(exportStages.has(stage))row.captures.push(w.capture(stage+'-duel-'+(frozen?'static':'animated')+'-after.webp'));
      w.engine.stop();
    }
    w.start(false);w.advance(120,[[1,'right',true],[2,'right',true]]);
    const atToggle=w.backdrop(),checkpoint=clone(w.engine.network.checkpoint());w.engine.setStaticScenery(true);
    assert.equal(w.backdrop(),atToggle,'Enabling static scenery holds the current composition without a jump: '+stage);
    assert.deepEqual(clone(w.engine.network.checkpoint()),checkpoint,'Native toggle leaves combat unchanged: '+stage);
    w.advance(45,[[1,'right',false],[2,'right',false],[1,'left',true],[2,'left',true]]);w.engine.setStaticScenery(true);
    assert.equal(w.backdrop(),atToggle,'Repeated enable calls do not advance the held frame: '+stage);
    w.engine.network.restore(checkpoint);assert.equal(w.backdrop(),atToggle,'Rollback retains the held presentation: '+stage);
    w.engine.setStaticScenery(false);w.advance(16);assert.notEqual(w.backdrop(),atToggle,'Animation resumes on its current combat clock: '+stage);
    w.engine.setStaticScenery(true);const heldForRebuild=w.backdrop();w.start(true,true);w.advance(160,[[1,'left',true],[2,'left',true]]);
    assert.equal(w.backdrop(),heldForRebuild,'Full private-room reconstruction preserves the held composition: '+stage);
    row.liveToggle=true;row.rollback=true;row.fullRebuild=true;
    row.sourceImages=stageGroups.map(group=>{const file=assets[group][stage],im=w.decoded.get(file);return {file,width:im.width,height:im.height,sha256:sha(fs.readFileSync(path.join(root,file)))};});
    report.nativeStages.push(row);w.engine.stop();
    if(exportStages.has(stage)){
      const b=await world(stage,true),result={stage,captures:[]};
      b.start(true);b.advance(132);assert.equal(b.engine.snapshot().boss.phase,'tell','A real boss telegraph is active');
      const first=b.backdrop(),before=b.full(),countdown=before.rectangles.find(r=>r.args[0]===316&&r.args[1]===165&&r.args[3]===6);
      assert(countdown,'The actual telegraph countdown is drawn');
      b.advance(18,[[1,'right',true]]);const second=b.backdrop(),after=b.full(),next=after.rectangles.find(r=>r.args[0]===316&&r.args[1]===165&&r.args[3]===6);
      assert.equal(first,second,'Boss backdrop pixels remain static: '+stage);
      assert(next&&next.args[2]<countdown.args[2],'The useful telegraph countdown keeps advancing: '+stage);
      assert.notDeepEqual(before.actors,after.actors,'Boss player drawing keeps moving: '+stage);
      result.captures.push(b.capture(stage+'-boss-static-telegraph.webp'));
      result.staticBackdrop=true;result.telegraphContinues=true;result.playerDrawingChanges=true;report.nativeBossStages.push(result);b.engine.stop();
    }
  }
  report.nativeCanvas=true;report.renderer='@napi-rs/canvas; actual engine functions exposed by test-only closure hooks; function bodies unchanged';
  report.checks.push('Native backdrop pixel hashes stay identical in static mode while fighter drawings and boss telegraphs continue; animated mode, live toggle, checkpoint rollback and full private-room reconstruction are checked separately');
}
(async()=>{
  if(!process.argv.includes('--logic-only'))await nativeChecks();
  report.sourceSha256=Object.fromEntries(['content.js','asset-geometry-20261124.js','assets.js','fight.js','boss-geometry-20261124.js','boss-assets.js','boss.js','netplay.js'].map(file=>[file,sha(source(file))]));
  report.baselineSha256={'fight.js':sha(oldFight),'boss.js':sha(oldBoss)};
  report.catalogue={fighters:fighters.length,places:new Set(Object.entries(data.StrandContent.arenas).map(([id,a])=>a.variantOf||id)).size,configurations:allStages.length};
  report.passed=true;
  const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
  if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');}
  console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
