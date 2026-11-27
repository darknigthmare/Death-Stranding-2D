/* Extension 01: real engine and UI logic, explicit DOM/Canvas simulator.
 * PNG content and browser layout are separate checks; no hardware claim. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {world}=require('./input-host.cjs');
const root=path.resolve(__dirname,'..'),checks=[],counts={fighterCycles:0,replaySamples:0,selectionChanges:0};
const copy=value=>JSON.parse(JSON.stringify(value));
const files=['content.js','asset-geometry-20261124.js','assets.js','presentation.js','boss-geometry-20261124.js','boss-assets.js','tournament.js','fight.js','boss.js','boss-data.js','boss-guide.js','campaign.js','moves-data.js','relationships.js','input.js','lessons.js'];
function check(name,fn){fn();checks.push({name,passed:true});console.log('OK — '+name);}
function make(options={}){
  const w=world({gamepads:false,...options});w.host.setTimeout=w.context.setTimeout;w.host.clearTimeout=w.context.clearTimeout;
  w.Node.prototype.remove=function(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(node=>node!==this);this.parentNode=null;}};
  w.html('index.html');w.load(files);w.engine=w.host.StrandFight;w.state=()=>copy(w.engine.snapshot());
  w.start=(opts={})=>{w.result=null;w.engine.start({canvas:new w.Node('canvas'),p1:'sam',p2:'higgs',stage:'shore',mode:'local',sound:false,seed:4511,roundsToWin:1,onEnd:r=>{w.result=copy(r);},...opts});};
  w.step=(n=1)=>{for(let i=0;i<n;i++){const tick=w.engine.snapshot().tick;let attempts=0;while(w.engine.snapshot().tick===tick&&w.engine.snapshot().phase!=='ended'&&attempts++<3)w.frames();}};
  w.ready=()=>{while(w.state().phase==='intro')w.step();};
  w.tap=(p,key)=>{w.engine.input(p,key,true);w.engine.input(p,key,false);};
  w.settle=()=>{const timers=[...w.timers.values()];w.timers.clear();for(const fn of timers)fn();};
  return w;
}
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
const report={date:new Date().toISOString(),passed:true,method:'Real JavaScript engine + app driven by normal logical or DOM events; Canvas/DOM are explicit test adapters. No browser pixels or physical controller claim.',browser:false,nativeCanvas:false,checks,counts,sourceSHA256:Object.fromEntries(['fight.js','app.js','input.js','netplay.js','presentation.js','presentation.css','index.html'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]))};
const output=process.argv.find(value=>value.startsWith('--output='))?.slice(9);if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(path.resolve(output),JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed:report.passed,checks:checks.length,counts},null,2));
