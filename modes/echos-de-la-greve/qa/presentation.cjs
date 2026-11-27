/* Extension 01: real engine and UI logic, explicit DOM/Canvas simulator.
 * PNG content and browser layout are separate checks; no hardware claim. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),{execFileSync}=require('node:child_process');
const {world}=require('./input-host.cjs');
const root=path.resolve(__dirname,'..'),checks=[],counts={fighterCycles:0,replaySamples:0,baselineSamples:0,selectionChanges:0,phaseBoundarySamples:0,phaseInterruptions:0,outfitFallbackCases:0};
const simulationBaseline='7e000d3';
const copy=value=>JSON.parse(JSON.stringify(value));
const files=['content.js','asset-geometry-20261124.js','assets.js','presentation.js','boss-geometry-20261124.js','boss-assets.js','tournament.js','fight.js','boss.js','boss-data.js','boss-guide.js','campaign.js','moves-data.js','relationships.js','input.js','lessons.js'];
function check(name,fn){fn();checks.push({name,passed:true});console.log('OK — '+name);}
function make(options={}){
  const w=world({gamepads:false,...options});w.host.setTimeout=w.context.setTimeout;w.host.clearTimeout=w.context.clearTimeout;
  w.Node.prototype.remove=function(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(node=>node!==this);this.parentNode=null;}};
  w.html('index.html');w.load(files);
  if(options.fightSource)vm.runInContext(options.fightSource,w.context,{filename:'fight-baseline.js'});
  w.engine=w.host.StrandFight;w.state=()=>copy(w.engine.snapshot());
  w.start=(opts={})=>{w.result=null;w.engine.start({canvas:new w.Node('canvas'),p1:'sam',p2:'higgs',stage:'shore',mode:'local',sound:false,seed:4511,roundsToWin:1,onEnd:r=>{w.result=copy(r);},...opts});};
  w.step=(n=1)=>{for(let i=0;i<n;i++){const tick=w.engine.snapshot().tick;let attempts=0;while(w.engine.snapshot().tick===tick&&w.engine.snapshot().phase!=='ended'&&attempts++<3)w.frames();}};
  w.ready=()=>{while(w.state().phase==='intro')w.step();};
  w.tap=(p,key)=>{w.engine.input(p,key,true);w.engine.input(p,key,false);};
  w.settle=()=>{const timers=[...w.timers.values()];w.timers.clear();for(const fn of timers)fn();};
  return w;
}
const phaseKeys={entry:'tauntEntry',hold:'taunt',exit:'tauntExit'};
const ids=['sam','fragile','higgs','cliff','mule','diehardman','mama','heartman'];
function fixtureSet(id,outfit='atelier',holdOnly=false){
  return Object.fromEntries(Object.entries(phaseKeys).filter(([phase])=>!holdOnly||phase==='hold').map(([phase,key],i)=>[key,
    {src:'fixture/'+id+'/'+outfit+'/'+phase+'.png',crop:[i+1,i+2,64+i,128+i],anchorX:.43+i*.02,baselineY:.98,heightRatio:.97+i*.01}]));
}
function fixtureAssets(){
  const art=Object.fromEntries(ids.map(id=>[id,fixtureSet(id,'atelier',id==='diehardman')]));
  art.mama.outfits={viaduc:fixtureSet('mama','viaduc')};return art;
}
function withDraws(w,art=fixtureAssets(),missing=new Set()){
  w.host.StrandPresentationAssets=copy(art);w.drawn=[];w.images=[];
  w.context.Image=class{set src(value){this._src=value;this.complete=!missing.has(value);this.naturalWidth=96;this.naturalHeight=192;w.images.push(this);}get src(){return this._src;}};
  w.ctx.drawImage=(image,...args)=>{w.drawn.push({src:image?.src,args});};
  return w;
}
function identityStance(w,id,outfit){return w.host.StrandAssets.wardrobe?.[id]?.[outfit]?.poses?.stance || w.host.StrandAssets.fighters[id];}
check('Every combat snapshot matches main 7e000d3 while new phase images are ready',()=>{
  const fightSource=execFileSync('git',['show',simulationBaseline+':modes/echos-de-la-greve/fight.js'],{cwd:path.resolve(root,'../..'),encoding:'utf8'});
  const commands=new Map([[90,[[1,'taunt',true],[1,'taunt',false]]],[100,[[2,'taunt',true],[2,'taunt',false]]],
    [150,[[2,'left',true]]],[230,[[2,'left',false]]],[232,[[1,'taunt',true],[1,'taunt',false],[2,'light',true],[2,'light',false]]],
    [235,[[1,'guard',true]]],[240,[[1,'guard',false]]],[280,[[1,'taunt',true],[1,'taunt',false]]]]);
  for(const slot of [...ids.map(id=>({id,outfit:'atelier'})),{id:'mama',outfit:'viaduc'}]){
    const w=withDraws(make()),baseline=make({fightSource}),config={p1:slot.id,p2:'sam',outfits:[slot.outfit,'atelier']};w.start(config);baseline.start(config);
    while(w.state().tick<360){
      for(const command of commands.get(w.state().tick)||[]){w.engine.input(...command);baseline.engine.input(...command);}
      w.step();baseline.step();assert.deepEqual(w.state(),baseline.state(),slot.id+'/'+slot.outfit+' at tick '+w.state().tick);counts.baselineSamples++;
    }
    w.engine.stop();baseline.engine.stop();
  }
});
check('Three native phase slots follow the unchanged 10/38/54 boundaries for both players and nine costume choices',()=>{
  for(const slot of [...ids.map(id=>({id,outfit:'atelier'})),{id:'mama',outfit:'viaduc'}])for(const player of [1,2]){
    const w=withDraws(make()),control=make();
    const outfit=slot.outfit,id=slot.id,other=id==='sam'?'higgs':'sam';
    const config={p1:player===1?id:other,p2:player===2?id:other,outfits:player===1?[outfit,'atelier']:['atelier',outfit]};
    w.start(config);control.start(config);w.ready();control.ready();w.tap(player,'taunt');control.tap(player,'taunt');
    const chosen=w.host.StrandPresentation.gestureAssets(id,outfit);let previous=0;
    for(const frame of [1,9,10,37,38,53,54]){
      w.drawn.length=0;w.step(frame-previous);control.step(frame-previous);previous=frame;
      assert.deepEqual(w.state(),control.state(),'Images cannot change simulation at '+id+'/'+outfit+'/'+frame);
      const phase=frame<10?'entry':frame<38?'hold':frame<54?'exit':null,descriptor=phase?chosen[phaseKeys[phase]]:null;
      const expected=descriptor?.src||identityStance(w,id,outfit);
      const ownImages=new Set([identityStance(w,id,outfit),...Object.values(phaseKeys).map(key=>chosen[key]?.src).filter(Boolean)]);
      const last=w.drawn.filter(draw=>ownImages.has(draw.src)).at(-1);
      assert.equal(last?.src,expected,id+'/'+outfit+' frame '+frame+' uses its actual phase or its own stance');
      if(descriptor)assert.deepEqual(last.args.slice(0,4),descriptor.crop,'Each phase keeps its own crop');
      counts.phaseBoundarySamples++;
    }
    w.engine.stop();control.engine.stop();
  }
});
check('Absent or undecoded costume phases fall back to that costume, including an unavailable own stance',()=>{
  for(const [phase,key]of Object.entries(phaseKeys))for(const missingDescriptor of [true,false]){
    const art=fixtureAssets(),descriptor=art.mama.outfits.viaduc[key];
    if(missingDescriptor)delete art.mama.outfits.viaduc[key];
    const w=withDraws(make(),art,missingDescriptor?new Set():new Set([descriptor.src]));
    w.start({p1:'mama',outfits:['viaduc','atelier']});w.ready();w.tap(1,'taunt');w.drawn.length=0;w.step({entry:5,hold:20,exit:45}[phase]);
    const ownStance=identityStance(w,'mama','viaduc');assert(w.drawn.some(draw=>draw.src===ownStance));
    assert(!w.drawn.some(draw=>draw.src===descriptor.src));
    for(const base of Object.values(phaseKeys).map(k=>art.mama[k].src))assert(!w.images.some(image=>image.src===base),'No base costume phase is requested');
    assert.equal(w.state().fighters[0].taunt.phase,phase);w.engine.stop();counts.outfitFallbackCases++;
  }
  const art=fixtureAssets(),w=make(),stance=identityStance(w,'mama','viaduc');
  withDraws(w,art,new Set([stance,...Object.values(phaseKeys).map(k=>art.mama.outfits.viaduc[k].src)]));
  w.start({p1:'mama',outfits:['viaduc','atelier']});w.ready();w.tap(1,'taunt');w.drawn.length=0;w.step(20);
  assert(!w.drawn.some(draw=>draw.src===w.host.StrandAssets.fighters.mama),'Unavailable costume never borrows the atelier stance during a gesture');
  assert(!w.drawn.some(draw=>draw.src===stance));assert.equal(w.state().fighters[0].taunt.phase,'hold');w.engine.stop();counts.outfitFallbackCases++;
});
check('Late phase decoding changes only the drawing and cannot restart or extend the gesture',()=>{
  const art=fixtureAssets(),source=art.mama.outfits.viaduc.tauntEntry.src;
  const w=withDraws(make(),art,new Set([source])),control=make(),config={p1:'mama',outfits:['viaduc','atelier']};
  w.start(config);control.start(config);w.ready();control.ready();w.tap(1,'taunt');control.tap(1,'taunt');w.step(5);control.step(5);
  for(const image of w.images)if(image.src===source)image.complete=true;
  w.drawn.length=0;w.step();control.step();assert(w.drawn.some(draw=>draw.src===source));assert.deepEqual(w.state(),control.state());
  w.step(48);control.step(48);assert.equal(w.state().fighters[0].taunt,undefined);assert.deepEqual(w.state(),control.state());w.engine.stop();control.engine.stop();
});
check('Reduced effects retain stance/hold/stance without changing any combat state or phase duration',()=>{
  const w=withDraws(make()),normal=withDraws(make()),config={p1:'mama',outfits:['viaduc','atelier']};
  w.start({...config,reducedEffects:true});normal.start(config);w.ready();normal.ready();w.tap(1,'taunt');normal.tap(1,'taunt');
  let previous=0;
  for(const frame of [5,20,45,54]){
    w.drawn.length=0;w.step(frame-previous);normal.step(frame-previous);previous=frame;
    const a=w.state(),b=normal.state();delete a.reducedEffects;delete b.reducedEffects;assert.deepEqual(a,b);
    const hold=w.host.StrandPresentationAssets.mama.outfits.viaduc.taunt.src,stance=identityStance(w,'mama','viaduc');
    assert.equal(w.drawn.filter(draw=>draw.src===hold||draw.src===stance).at(-1)?.src,frame>=10&&frame<38?hold:stance);
    assert(!w.drawn.some(draw=>draw.src==='fixture/mama/viaduc/entry.png'||draw.src==='fixture/mama/viaduc/exit.png'));
  }
  w.engine.stop();normal.engine.stop();
});
check('Each phase remains interruptible for either player and the hit pose immediately replaces it',()=>{
  for(const player of [1,2])for(const [phase,offset]of Object.entries({entry:0,hold:16,exit:40})){
    const w=withDraws(make()),opponent=3-player;
    w.start({p1:player===1?'mama':'sam',p2:player===2?'mama':'sam',outfits:player===1?['viaduc','atelier']:['atelier','viaduc']});w.ready();
    w.engine.input(opponent,opponent===1?'right':'left',true);w.step(80);w.engine.input(opponent,opponent===1?'right':'left',false);
    w.tap(player,'taunt');w.step(offset);w.engine.input(player,'guard',true);w.tap(opponent,'light');
    let n=0,before;w.drawn.length=0;
    while(w.state().fighters[player-1].hp===100&&n++<10){before=w.state().fighters[player-1].taunt?.phase;w.step();}
    const victim=w.state().fighters[player-1];assert.equal(before,phase);assert(victim.hp<100);assert.equal(victim.taunt,undefined);assert(victim.stun>0);
    assert(w.drawn.some(draw=>draw.src===w.host.StrandAssets.wardrobe.mama.viaduc.poses.hit));w.engine.stop();counts.phaseInterruptions++;
  }
});
check('Eight exposed cycles have 10/28/16 ticks, no damage or resource bonus, and resume held movement',()=>{
  for(const id of ['sam','fragile','higgs','cliff','mule','diehardman','mama','heartman']){
    const w=make(),control=make();w.start({p1:id});control.start({p1:id});w.ready();control.ready();
    const x=w.state().fighters[0].x;w.engine.input(1,'taunt',true);w.engine.input(1,'right',true);
    w.tap(1,'light');w.tap(1,'special');w.tap(1,'up');w.engine.input(1,'guard',true);
    assert.equal(w.state().fighters[0].taunt.phase,'entry');
    w.step(9);control.step(9);assert.equal(w.state().fighters[0].taunt.phase,'entry');
    w.step();control.step();assert.equal(w.state().fighters[0].taunt.phase,'hold');
    w.step(28);control.step(28);assert.equal(w.state().fighters[0].taunt.phase,'exit');
    w.step(15);control.step(15);assert.equal(w.state().fighters[0].x,x);assert.equal(w.state().fighters[0].guard,false);
    assert.equal(w.state().fighters[0].chiral,control.state().fighters[0].chiral);assert.equal(w.state().fighters[1].hp,100);
    assert.equal(w.state().fighters[0].action,'');w.engine.input(1,'guard',false);w.step();
    assert.equal(w.state().fighters[0].taunt,undefined);assert(w.state().fighters[0].x>x);
    w.step(55);assert.equal(w.state().fighters[0].taunt,undefined,'A held taunt never repeats');
    w.engine.stop();control.engine.stop();counts.fighterCycles++;
  }
});
check('Airborne, crouching, guarding and attacking states reject a taunt without cancelling their action',()=>{
  for(const action of ['up','down','guard','light']){
    const w=make();w.start();w.ready();w.engine.input(1,action,true);w.step();const before=w.state();w.tap(1,'taunt');
    assert.equal(w.state().fighters[0].taunt,undefined);assert.equal(w.state().fighters[0].action,before.fighters[0].action);w.engine.stop();
  }
});
check('A melee impact interrupts the gesture; a held guard cannot remove its vulnerability',()=>{
  const w=make();w.start();w.ready();w.engine.input(2,'left',true);w.step(65);w.engine.input(2,'left',false);
  w.tap(1,'taunt');w.engine.input(1,'guard',true);w.tap(2,'heavy');
  let n=0;while(w.state().fighters[0].hp===100&&n++<30)w.step();
  assert(w.state().fighters[0].hp<100);assert.equal(w.state().fighters[0].taunt,undefined);assert(w.state().fighters[0].stun>0);w.engine.stop();
});
check('A remote tar attack interrupts a taunt without suppressing the ordinary projectile mechanics',()=>{
  const w=make();w.start();w.ready();w.tap(1,'taunt');w.tap(2,'special');
  let n=0;while(w.state().fighters[0].hp===100&&n++<40)w.step();
  assert(w.state().fighters[0].hp<100);assert.equal(w.state().fighters[0].taunt,undefined);assert(w.state().fighters[1].chiral<42);w.engine.stop();
});
check('Pause freezes the gesture; resume and stop do not leave an active gesture',()=>{
  const w=make();w.start();w.ready();w.tap(1,'taunt');w.step(20);const frame=w.state().fighters[0].taunt.frame;
  w.engine.pause();w.frames(90);assert.equal(w.state().fighters[0].taunt.frame,frame);w.engine.pause(false);w.step(34);assert.equal(w.state().fighters[0].taunt,undefined);
  w.tap(1,'taunt');w.engine.stop();w.start();assert.equal(w.state().fighters[0].taunt,undefined);w.engine.stop();
});
check('The private-room clock ignores the new action and keeps its existing checkpoint fields',()=>{
  const w=make();w.start({clock:'network'});for(let i=0;i<72;i++)w.engine.network.advance([]);
  const before=copy(w.engine.network.checkpoint());w.engine.input(1,'taunt',true);w.engine.input(2,'taunt',true);
  assert.deepEqual(copy(w.engine.network.checkpoint()),before);w.engine.stop();
});
check('Legacy recordings stay version 1; taunt recordings use v2 with both old J2 and new gesture codes intact',()=>{
  for(const gesture of [false,true]){
    const w=make();w.start({record:true,startingVitality:99});
    const frames=[];
    while(!w.result&&w.state().tick<5000){
      const tick=w.state().tick;
      if(tick===90){w.tap(2,'light');if(gesture)w.tap(1,'taunt');}
      if(tick===180&&gesture)w.tap(2,'taunt');
      w.step();if(w.state().tick%17===0)frames.push(w.state());
    }
    assert(w.result);const tape=w.result.replay;assert.equal(tape.version,gesture?2:1);assert(tape.events.some(e=>e[1]===29));
    assert.equal(tape.events.some(e=>e[1]===41),gesture);assert.equal(tape.events.some(e=>e[1]===43),gesture);assert(w.engine.validReplay(tape));
    const replay=make();replay.start({replay:tape,startingVitality:99});const rerun=[];
    while(!replay.result&&replay.state().tick<5000){replay.step();if(replay.state().tick%17===0)rerun.push(replay.state());}
    assert(replay.result);assert.deepEqual(rerun,frames);assert.equal(replay.result.replayMismatch,undefined);counts.replaySamples+=frames.length;
    const invalid=copy(tape);invalid.version=1;invalid.events=[[90,41]];assert.equal(w.engine.validReplay(invalid),false);
    const cpu=copy(tape);cpu.version=2;cpu.mode='cpu';cpu.events=[[90,43]];assert.equal(w.engine.validReplay(cpu),false);
    w.engine.stop();replay.engine.stop();
  }
});
check('Legacy remapping migrates only missing taunt keys, preserves collisions and persists deterministically',()=>{
  const w=make(),original=w.host.StrandInput.createSettings().state();
  for(const profile of original.profiles){for(const p of [1,2])delete profile.bindings[p].taunt;profile.bindings[1].light=['b'];profile.bindings[2].heavy=['p'];}
  original.profiles[1].name='Mon profil';original.active='2';const storage=new Map([['echos.input.v1',JSON.stringify(original)]]),m=make({storage});
  const settings=m.host.StrandInput.createSettings(),migrated=settings.state();assert.equal(migrated.active,'2');assert.equal(migrated.profiles[1].name,'Mon profil');
  for(let i=0;i<3;i++)for(const p of [1,2])for(const [key,value]of Object.entries(original.profiles[i].bindings[p]))assert.deepEqual(copy(migrated.profiles[i].bindings[p][key]),copy(value));
  assert(m.host.StrandInput.valid(migrated));assert.notEqual(migrated.profiles[0].bindings[1].taunt[0],'b');assert.notEqual(migrated.profiles[0].bindings[2].taunt[0],'p');
  assert.deepEqual(JSON.parse(storage.get('echos.input.v1')),copy(migrated));assert.equal(settings.bind(1,'taunt',0,'p').ok,false);
  const fail=make({storage:new Map([['echos.input.v1',JSON.stringify(original)]]),writeError:true}).host.StrandInput.createSettings();assert.equal(fail.profile().name,'Mon profil');assert.equal(fail.status().saved,false);
});
check('Keyboard, tactile and L3 share the new logical action; excluded contexts never emit it',()=>{
  const w=make({gamepads:true}),events=[],settings=w.host.StrandInput.createSettings();
  const controller=w.host.StrandInput.createController({settings,accepts:()=>true,onInput:(...args)=>events.push(args)});
  w.key('b');w.key('b',false);assert.deepEqual(copy(events),[[1,'taunt',true],[1,'taunt',false]]);
  controller.press('pointer:1',2,'taunt');controller.release('pointer:1');assert.deepEqual(copy(events.slice(-2)),[[2,'taunt',true],[2,'taunt',false]]);
  w.samples[0]={index:0,connected:true,mapping:'standard',axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false,value:0}))};controller.poll();w.samples[0].buttons[10]={pressed:true,value:1};controller.poll();w.samples[0].buttons[10]={pressed:false,value:0};controller.poll();assert.deepEqual(copy(events.slice(-2)),[[1,'taunt',true],[1,'taunt',false]]);controller.destroy();
  const excluded=w.host.StrandInput.createController({settings,accepts:()=>true,acceptsAction:a=>a!=='taunt',onInput:(...args)=>events.push(args)}),count=events.length;
  w.key('b');w.key('b',false);assert.equal(excluded.press('pointer:2',1,'taunt'),false);assert.equal(events.length,count);excluded.destroy();
});
check('Selection previews do not confirm; replacements, mirror choices and independent outfits keep their own identity',()=>{
  const w=make();w.load(['app.js']);w.click('[data-mode="versus"]');
  assert.equal(w.document.querySelectorAll('[data-presentation-slot]').length,2);
  const sam=w.document.querySelector('[data-act="pick"][data-id="sam"]'),higgs=w.document.querySelector('[data-act="pick"][data-id="higgs"]');
  w.send(higgs,'pointerover');assert.equal(sam.getAttribute('aria-pressed'),'true');assert.match(w.document.querySelector('[data-presentation-status]').textContent,/Aperçu de Higgs/);
  w.send(higgs,'pointerout',{relatedTarget:w.document.body});assert.match(w.document.querySelector('[data-presentation-status]').textContent,/J1 : Sam/);
  w.click(higgs);assert.equal(w.document.querySelector('[data-id="higgs"]').getAttribute('aria-pressed'),'true');
  assert.equal(w.document.querySelectorAll('.presentationLeaving').length,1);assert.match(w.document.querySelector('[data-presentation-status]').textContent,/J1 : Higgs/);
  w.settle();assert.equal(w.document.querySelectorAll('.presentationLeaving').length,0);
  w.click('[data-id="mama"]');w.change('[data-option="p2"]','mama');w.change('[data-option="outfit1"]','viaduc');
  const images=w.document.querySelectorAll('img.presentationCurrent');assert(images[0].src.includes('/viaduc/'));assert(!images[1].src.includes('/viaduc/'));w.engine.stop();
});
check('Rapid selection cleans previous timers; reduced motion retains the same choice and removes exiting ghosts',()=>{
  const w=make();w.load(['app.js']);w.click('[data-mode="versus"]');
  for(let i=0;i<40;i++){w.click('[data-id="'+(i%2?'sam':'fragile')+'"]');counts.selectionChanges++;assert(w.timers.size<=1);}
  w.click('#effects');assert(w.document.querySelector('[data-presentation]').classList.contains('presentationReduced'));
  assert.equal(w.document.querySelectorAll('.presentationLeaving').length,0);assert.equal(w.timers.size,0);
  w.click('[data-id="cliff"]');assert.match(w.document.querySelector('[data-presentation-status]').textContent,/J1 : Clifford/);assert.equal(w.timers.size,0);
  w.click('[data-act="home"]');assert.equal(w.document.querySelector('[data-presentation]'),null);assert.equal(w.timers.size,0);
  assert(w.document.querySelectorAll('a').some(node=>node.getAttribute('href')==='progression.html'));
});
check('DOM previews use the selected costume hold, preserve separate mirror costumes, and recover a failed image safely',()=>{
  const w=withDraws(make());w.load(['app.js']);w.click('[data-mode="versus"]');w.click('[data-id="mama"]');
  w.change('[data-option="p2"]','mama');w.change('[data-option="outfit1"]','viaduc');
  let images=w.document.querySelectorAll('img.presentationCurrent');
  assert.equal(images[0].src,'fixture/mama/viaduc/hold.png');assert.equal(images[1].src,'fixture/mama/atelier/hold.png');
  w.send(images[0],'error');assert.equal(images[0].src,identityStance(w,'mama','viaduc'));assert.equal(images[1].src,'fixture/mama/atelier/hold.png');
  const sam=w.document.querySelector('[data-id="sam"]');w.send(sam,'pointerover');assert.equal(w.document.querySelector('[data-id="mama"]').getAttribute('aria-pressed'),'true');
  w.send(sam,'pointerout',{relatedTarget:w.document.body});w.click('#effects');images=w.document.querySelectorAll('img.presentationCurrent');
  assert.equal(images[0].src,'fixture/mama/viaduc/hold.png');assert.equal(images[1].src,'fixture/mama/atelier/hold.png');
  assert.equal(w.document.querySelectorAll('.presentationLeaving').length,0);assert.equal(w.timers.size,0);
  w.click('[data-act="home"]');assert.equal(w.timers.size,0);w.engine.stop();
});
check('Duel touch controls expose taunt while Boss controls exclude it',()=>{
  const w=make();w.load(['app.js']);w.click('[data-mode="training"]');w.click('[data-act="start"]');
  assert(w.document.querySelector('[data-input="taunt"]'));w.click('[data-act="pause"]');w.click('[data-act="leave"]');w.click('[data-act="home"]');
  w.click('[data-mode="boss"]');w.click('[data-act="startBoss"]');assert.equal(w.document.querySelector('[data-input="taunt"]'),null);w.engine.stop();w.host.StrandBoss.stop();
});
check('Base taunt art is never loaded for Mama viaduc; a stale outfit from a different fighter cannot hide a valid base gesture',()=>{
  const w=make(),loaded=[];
  w.context.Image=class{set src(value){loaded.push(value);this._src=value;this.complete=false;this.naturalWidth=0;}get src(){return this._src;}};
  w.host.StrandPresentationAssets={mama:{taunt:{src:'assets/fixture-mama-taunt.png'}},sam:{taunt:{src:'assets/fixture-sam-taunt.png'}}};
  w.start({p1:'mama',outfits:['viaduc','atelier']});w.ready();w.tap(1,'taunt');w.step(20);
  assert.equal(w.state().fighters[0].taunt.phase,'hold');assert(!loaded.includes('assets/fixture-mama-taunt.png'));assert(loaded.includes('assets/fighters/mama/viaduc/stance.png'));
  loaded.length=0;w.start({p1:'mama',outfits:['atelier','atelier']});assert(loaded.includes('assets/fixture-mama-taunt.png'));
  loaded.length=0;w.start({p1:'sam',outfits:['viaduc','atelier']});assert(loaded.includes('assets/fixture-sam-taunt.png'));w.engine.stop();
});
const report={date:new Date().toISOString(),passed:true,method:'Real JavaScript engine + app driven by normal logical or DOM events; Canvas/DOM and phase image readiness are explicit test adapters. No browser pixels or physical controller claim.',browser:false,nativeCanvas:false,visualAssetFixtures:true,simulationBaseline,checks,counts,sourceSHA256:Object.fromEntries(['fight.js','app.js','input.js','netplay.js','presentation.js','presentation.css','index.html','qa/presentation.cjs'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]))};
const output=process.argv.find(value=>value.startsWith('--output='))?.slice(9);if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(path.resolve(output),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed:report.passed,checks:checks.length,counts},null,2));
