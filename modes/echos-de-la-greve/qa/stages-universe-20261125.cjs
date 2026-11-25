/* Catalogue, real menu wiring and deterministic-engine regression checks.
 * The DOM and Canvas in this harness are simulated. Pixel rendering is checked
 * separately by arenes-canvas.cjs with the actual PNG files. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const source=file=>fs.readFileSync(path.join(root,file),'utf8');
const baseline='1cfc7787a49a7aaf6d7e82df28cfea57b1535e9b';
const oldFight=execFileSync('git',['show',baseline+':modes/echos-de-la-greve/fight.js'],{cwd:repo,encoding:'utf8'});
const ids=['south-knot-ruins','timefall-farm','mountain-knot-approach','magellan-ds2'];
const panoramas={
  'south-knot-ruins':'assets/static-20261125/south-knot-ruins-panorama.png',
  'timefall-farm':'assets/static-20261125/timefall-farm-panorama.png',
  'mountain-knot-approach':'assets/static-20261125/mountain-knot-city-panorama.png',
  'magellan-ds2':'assets/static-universe-20261125/magellan-ds2-panorama.png'
};
const groups=['skyplates','distants','midgrounds','floors','foregrounds'];
const suffixes=['sky','distant','midground','floor','foreground'];
const report={date:new Date().toISOString(),browser:false,nativeCanvas:false,pixelsDecoded:false,
  baselineCommit:baseline,baselineMethod:'Previous fight.js with the same current content/assets; isolates runtime changes from added stage data.',
  stages:[],checkpointComparisons:0,ui:[],checks:[]};
const clone=value=>JSON.parse(JSON.stringify(value));
function catalog(){
  const context={window:{}};
  for(const file of ['content.js','asset-geometry-20261124.js','assets.js'])vm.runInNewContext(source(file),context);
  return context.window;
}
const catalogue=catalog(),content=catalogue.StrandContent,assets=catalogue.StrandAssets;
assert.equal(Object.keys(content.fighters).length,8);
assert.equal(Object.keys(content.stages).length,17);
assert.equal(new Set(Object.entries(content.arenas).map(([id,a])=>a.variantOf||id)).size,16);
assert.equal(new Set(groups.flatMap(group=>Object.values(assets[group]))).size,85);
report.checks.push('8 playable fighters, 16 places, 17 configurations and 85 distinct layer paths');
for(const id of ids){
  assert.equal(assets.stages[id],panoramas[id],'Reuse the original panorama path: '+id);
  assert(content.stageDetails[id]?.place&&content.stageDetails[id]?.material&&content.stageDetails[id]?.ambience,'Stage card details: '+id);
  const files=groups.map((group,index)=>{
    const expected='assets/stages/'+id+'-'+suffixes[index]+'.png';assert.equal(assets[group][id],expected);return expected;
  });
  report.stages.push({id,title:content.stages[id],panorama:panoramas[id],layers:files});
}
if(!process.argv.includes('--logic-only')){
  report.images=[];
  for(const file of new Set(report.stages.flatMap(stage=>[stage.panorama,...stage.layers]))){
    const bytes=fs.readFileSync(path.join(root,file));
    assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'Native PNG: '+file);
    const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
    assert(width>0&&height>0,'PNG dimensions: '+file);
    report.images.push({file,width,height,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
  report.checks.push('24 native PNG paths present; original panorama paths reused without duplicate copies');
}else report.assetFilesChecked=false;

function engineHost(fightSource=source('fight.js')){
  const host=catalog(),pending=new Map();let serial=0;
  host.requestAnimationFrame=fn=>{pending.set(++serial,fn);return serial;};host.cancelAnimationFrame=id=>pending.delete(id);
  host.localStorage={getItem(){return null;},setItem(){}};host.scrollTo=()=>{};host.addEventListener=()=>{};
  host.matchMedia=()=>({matches:false,addEventListener(){}});
  const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),measureText:()=>({width:40})},
    {get:(object,key)=>key in object?object[key]:()=>{}});
  class Image{set src(value){this._src=value;this.complete=false;this.naturalWidth=0;this.naturalHeight=0;}get src(){return this._src;}}
  const context={window:host,Image,structuredClone};vm.createContext(context);vm.runInContext(fightSource,context);
  const canvas={getContext:()=>ctx};
  return {host,context,canvas,ctx,engine:host.StrandFight,pending};
}
const tap=key=>[[1,key,true],[1,key,false]],special=direction=>direction?[[1,direction,true],...tap('special'),[1,direction,false]]:tap('special');
const sequence=[[4,[[1,'guard',true]]],[4,[[1,'guard',false],[1,'down',true]]],
  [46,[[1,'down',false],...tap('up')]],[24,[[1,'right',true]]],[35,[[1,'right',false],...tap('light')]],
  [45,tap('heavy')],[60,special()],[60,special('right')],[60,special('left')]];
for(const stage of ['shore',...ids])for(const p1 of Object.keys(content.fighters)){
  const current=engineHost(),prior=engineHost(oldFight);
  for(const target of [current,prior])target.engine.start({canvas:target.canvas,p1,p2:'higgs',stage,mode:'local',clock:'network',seed:2456,sound:false});
  for(const target of [current,prior])for(let tick=0;tick<75;tick++)target.engine.network.advance([],true);
  for(const [ticks,inputs]of sequence){
    for(const target of [current,prior])for(let tick=0;tick<ticks;tick++){
      target.engine.network.advance(tick?[]:inputs,true);target.engine.network.draw();
    }
    assert.deepEqual(clone(current.engine.network.checkpoint()),clone(prior.engine.network.checkpoint()),'Unchanged simulation: '+stage+' / '+p1);
    report.checkpointComparisons++;
  }
  current.engine.stop();prior.engine.stop();
}
report.checks.push('360 identical checkpoints: eight fighters, all four new stages plus the shore, fixed input sequences against the previous fight.js');

// Run actual app handlers and engines while only replacing browser surfaces.
const ui=engineHost(),nodes=new Map(),persistent=new Set(['view','manual','keys','effects','audio','homeLink','controlsLink']);
function element(id=''){
  const listeners={},classes=new Set(),el={id,dataset:{},hidden:false,open:false,value:'',textContent:'',listeners,
    classList:{add(...names){names.forEach(n=>classes.add(n));},remove(...names){names.forEach(n=>classes.delete(n));},toggle(name,on){on?classes.add(name):classes.delete(name);}},
    addEventListener(name,fn){(listeners[name]||=[]).push(fn);},setAttribute(){},focus(){},matches(){return false;},
    querySelectorAll(){return[];},querySelector(){return element();},closest(selector){return selector==='[data-act]'?this:null;},
    showModal(){this.open=true;},close(){this.open=false;}};
  if(id==='arena')el.getContext=()=>ui.ctx;
  let html='';Object.defineProperty(el,'innerHTML',{get:()=>html,set(value){
    html=String(value);if(id!=='view')return;
    for(const key of [...nodes.keys()])if(!persistent.has(key))nodes.delete(key);
    for(const match of html.matchAll(/<[^>]+\bid="([^"]+)"[^>]*>/g))nodes.set(match[1],element(match[1]));
  }});return el;
}
for(const id of persistent)nodes.set(id,element(id));
ui.context.document={body:element('body'),getElementById:id=>nodes.get(id)||null,addEventListener(){},querySelectorAll(){return[];}};
ui.context.localStorage=ui.host.localStorage;ui.host.StrandTournament={};
for(const file of ['boss-geometry-20261124.js','boss-assets.js','boss.js','app.js'])vm.runInContext(source(file),ui.context);
const view=nodes.get('view');
function click(act,data={}){const target=element();target.dataset={act,...data};for(const fn of view.listeners.click||[])fn({target});}
function change(option,value){const target=element();target.dataset={option};target.value=value;for(const fn of view.listeners.change||[])fn({target});}
click('stageGallery');assert.equal((view.innerHTML.match(/data-act="exploreStage"/g)||[]).length,17,'All configurations in arena gallery');
for(const id of ids){
  assert(view.innerHTML.includes('data-stage="'+id+'"'),'Arena card: '+id);
  click('exploreStage',{stage:id});assert(view.innerHTML.includes(panoramas[id]),'Panorama in selection preview: '+id);click('start');
  assert.equal(ui.engine.snapshot().stage,id,'Training opens selected arena');click('pause');click('leave');
  click('mode',{mode:'versus'});change('stage',id);click('start');assert.equal(ui.engine.snapshot().stage,id,'Versus opens selected arena');click('pause');click('leave');
  click('mode',{mode:'boss'});change('bossStage',id);click('startBoss');assert.equal(ui.host.StrandBoss.snapshot().stage,id,'Boss Battle opens selected arena');click('pause');click('leave');
  report.ui.push({stage:id,training:true,versus:true,bossBattle:true,gallery:true});click('stageGallery');
}
click('home');assert.equal(ui.engine.snapshot(),null);assert.equal(ui.host.StrandBoss.snapshot(),null);
report.checks.push('Actual app flows: gallery, panorama preview, training, Versus and Boss Battle on all four new stages, pause/exit and return home');
report.sourceSha256=Object.fromEntries(['content.js','assets.js','fight.js','app.js','boss.js'].map(file=>[file,createHash('sha256').update(source(file)).digest('hex')]));
report.baselineFightSha256=createHash('sha256').update(oldFight).digest('hex');report.passed=true;
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));
