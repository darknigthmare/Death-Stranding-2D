/* Native reception of the original static panoramas. The actual fight.js renderer
 * is used without changing its code or fabricating fighter simulation state.
 * This is not a browser, five-layer parallax, transition, or canonical fidelity test. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const production=path.join(repo,'docs/combat/production/20261127-lignes-de-maree');
const out=path.resolve(process.argv.find(a=>a.startsWith('--output='))?.slice(9)||production);
const renders=path.join(out,'stage-renders');
const files=['content.js','asset-geometry-20261124.js','assets.js','extension-data.js','extension-assets.js','extension-runtime.js','fight.js'];
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sourceSha256=Object.fromEntries(files.map(file=>[file,sha(path.join(root,file))]));
const geometry=JSON.parse(fs.readFileSync(path.join(production,'stage-geometry.json'),'utf8'));
const manifest=JSON.parse(fs.readFileSync(path.join(production,'stages-generation.json'),'utf8'));
const requested=new Set(),decoded=new Map(),queue=new Map();
const draws=[];let serial=0,time=0,strictImages=false;
const canvas=createCanvas(1280,720),native=canvas.getContext('2d');
const ctx=new Proxy(native,{
  get(target,key){
    if(key==='drawImage')return(image,...args)=>{
      draws.push({file:image.src||null,rect:args.length===8?args.slice(4):args,alpha:target.globalAlpha});
      return target.drawImage(image.drawable||image,...args);
    };
    const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
  },
  set(target,key,value){Reflect.set(target,key,value,target);return true;}
});
const host={requestAnimationFrame(fn){queue.set(++serial,fn);return serial;},cancelAnimationFrame(id){queue.delete(id);}};
const context={window:host,structuredClone,Image:class{
  set src(file){
    this._src=file;requested.add(file);this.drawable=decoded.get(file);
    if(strictImages)assert.ok(this.drawable,'Missing decoded image: '+file);
    this.complete=!!this.drawable;this.naturalWidth=this.drawable?.width||0;this.naturalHeight=this.drawable?.height||0;
  }
  get src(){return this._src;}
}};
vm.createContext(context);
for(const file of files)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const engine=host.StrandFight,art=host.StrandAssets;
const ids=manifest.entries.map(item=>item.id);
const options=id=>({canvas:{width:1280,height:720,getContext:()=>ctx},p1:'sam',p2:'higgs',stage:id,mode:'local',sound:false,seed:443,staticScenery:true});
function step(count=1){
  let remaining=count*3+10;
  const end=engine.snapshot().tick+count;
  while(engine.snapshot().tick<end&&remaining-->0){
    time+=1000/60+.000001;const jobs=[...queue.values()];queue.clear();draws.length=0;
    for(const fn of jobs)fn(time);
  }
  assert(remaining>0,'Simulation advanced without hanging');
}
function start(id){
  engine.start(options(id));
  let guard=100;
  while(engine.snapshot().phase==='intro'&&guard-->0)step();
  assert(guard>0,'Introduction completed: '+id);
  step(1);
}
function checkFrame(id,label){
  const file=art.stages[id],im=decoded.get(file),floorY=geometry[id].floorY;
  const stageDraws=draws.filter(draw=>draw.file===file);
  assert.equal(stageDraws.length,1,'Exactly one panorama, no layer stack: '+id+'/'+label);
  const [x,y,w,h]=stageDraws[0].rect;
  assert([x,y,w,h].every(Number.isFinite),'Finite draw rectangle: '+id+'/'+label);
  assert(x<=0&&x+w>=1280&&y<=0&&y+h>=720,'Full viewport coverage: '+id+'/'+label);
  const ratioError=Math.abs(w/h-im.width/im.height),floorError=Math.abs(y+h*floorY-588);
  assert(ratioError<1e-10,'Native aspect ratio retained: '+id+'/'+label);
  assert(floorError<.01,'Source floor maps to y=588: '+id+'/'+label);
  const pixels=native.getImageData(0,0,1280,720).data;
  let alpha=255;for(let i=3;i<pixels.length;i+=4)alpha=Math.min(alpha,pixels[i]);
  assert.equal(alpha,255,'Opaque final composition: '+id+'/'+label);
  const snapshot=engine.snapshot();
  assert.equal(snapshot.stage,id,'No silent fallback to a canonical arena');
  assert.equal(snapshot.link,undefined,'No transition route attached to a static original arena');
  assert.equal(snapshot.fighters[0].id,'sam');assert.equal(snapshot.fighters[1].id,'higgs');
  assert(snapshot.fighters.every(f=>f.y===0),'Both canonical fighters remain grounded');
  return {label,panoramaRect:{x,y,width:w,height:h},floorY,screenFloorY:y+h*floorY,ratioError,floorError,compositeMinAlpha:alpha,
    staticScenery:snapshot.staticScenery,reducedEffects:snapshot.reducedEffects,tick:snapshot.tick,
    fighters:snapshot.fighters.map(f=>({id:f.id,x:f.x,y:f.y}))};
}
function moveTogether(key,count){
  for(const player of [1,2])engine.input(player,key,true);
  step(count);
  for(const player of [1,2])engine.input(player,key,false);
  step(2);
}
(async()=>{
  fs.mkdirSync(renders,{recursive:true});
  assert.equal(ids.length,20,'Exactly 20 original stage bases');
  assert.equal(new Set(ids).size,20,'Twenty distinct stage IDs');
  assert.equal(host.StrandExtensionRuntime.stages.length,20,'All 20 measured stages registered');
  assert.equal(Object.keys(geometry).length,20,'All 20 floor anchors supplied');
  for(const id of ids){
    assert(host.StrandExtensionRuntime.stages.includes(id),'Stage is in the runtime: '+id);
    assert.equal(art.stageGeometry[id]?.legacy?.floorY,geometry[id]?.floorY,'Runtime matches measured floor anchor: '+id);
    for(const group of ['skyplates','distants','midgrounds','floors','foregrounds'])assert(!art[group]?.[id],'Original is a single panorama, not a claimed layer stack: '+id+'/'+group);
    engine.start(options(id));engine.stop();
  }
  const imageSources={};
  for(const file of requested){imageSources[file]=sha(path.join(root,file));decoded.set(file,await loadImage(path.join(root,file)));}
  strictImages=true;
  const results=[];
  for(const entry of manifest.entries){
    const id=entry.id,file=art.stages[id],im=decoded.get(file);
    assert.equal(imageSources[file],entry.sha256,'Native panorama matches received bytes: '+id);
    assert.equal(im.width,entry.width);assert.equal(im.height,entry.height);
    start(id);
    const cases=[checkFrame(id,'static-ready')];
    const capture='stage-renders/'+id.replace(/^ldm-stage-/,'')+'.webp';
    fs.writeFileSync(path.join(out,capture),canvas.toBuffer('image/webp',90));
    moveTogether('right',32);
    const moved=checkFrame(id,'static-moved-right');cases.push(moved);
    for(let player=0;player<2;player++)assert(moved.fighters[player].x-cases[0].fighters[player].x>20,'Ordinary movement reaches a different position: '+id);
    assert.equal(moved.panoramaRect.x,cases[0].panoramaRect.x,'Held scenery remains still when fighters move: '+id);
    engine.setReducedEffects(true);step(1);cases.push(checkFrame(id,'static-reduced-effects'));
    engine.setReducedEffects(false);engine.setStaticScenery(false);step(1);
    moveTogether('right',32);cases.push(checkFrame(id,'camera-moved-right'));
    moveTogether('left',64);cases.push(checkFrame(id,'camera-moved-left'));
    assert(cases[3].panoramaRect.x<cases[0].panoramaRect.x,'The legacy panorama responds to the ordinary camera when enabled: '+id);
    engine.stop();
    results.push({id,name:entry.name,source:file,width:im.width,height:im.height,sha256:imageSources[file],floorY:geometry[id].floorY,
      sourceFloorPixel:geometry[id].floorY*im.height,capture,captureSha256:sha(path.join(out,capture)),cases,passed:true});
    console.log('OK '+id+' — 5 actual-renderer cases; one native panorama; floor=588; '+capture);
  }
  const contactSheets=[];
  for(let page=0;page<Math.ceil(results.length/4);page++){
    const sheet=createCanvas(1280,792),pen=sheet.getContext('2d');
    pen.fillStyle='#0b171d';pen.fillRect(0,0,1280,792);pen.font='bold 16px sans-serif';
    for(let slot=0;slot<4;slot++){
      const result=results[page*4+slot];if(!result)continue;
      const x=slot%2*640,y=Math.floor(slot/2)*396;
      pen.fillStyle='#ecf3ee';pen.fillText((page*4+slot+1)+' · '+result.name+' · sol '+result.floorY,x+10,y+21);
      pen.drawImage(await loadImage(path.join(out,result.capture)),x,y+30,640,360);
    }
    const file='stage-renders/engine-contact-'+(page+1)+'.webp';
    fs.writeFileSync(path.join(out,file),sheet.toBuffer('image/webp',92));contactSheets.push({file,sha256:sha(path.join(out,file))});
  }
  for(const [file,digest]of Object.entries(imageSources))assert.equal(sha(path.join(root,file)),digest,'Source image unchanged: '+file);
  for(const [file,digest]of Object.entries(sourceSha256))assert.equal(sha(path.join(root,file)),digest,'Runtime source unchanged during QA: '+file);
  const report={date:new Date().toISOString(),passed:true,renderer:'@napi-rs/canvas; actual StrandFight / fight.js',nativeCanvas:true,
    browser:false,htmlLayoutRendered:false,hardwareGamepadTested:false,viewport:{width:1280,height:720},fighters:['sam','higgs'],
    stageCount:results.length,caseCount:results.reduce((sum,r)=>sum+r.cases.length,0),capturedStages:results.length,
    stageType:'One opaque static panorama per arena; legacy camera projection and measured floor anchor.',
    fiveLayerParallax:false,stageTransitions:false,sourcePixelsModified:false,canonicalFidelityClaim:false,
    method:'Actual runtime scripts, native decoded assets, ordinary public input API and requestAnimationFrame; no fabricated fighter state. Geometry derives from visual inspection of each received source.',
    fontFamilies:GlobalFonts.families.length,sourceSha256,imageSources,contactSheets,results};
  fs.writeFileSync(path.join(out,'stage-native.json'),JSON.stringify(report,null,2)+'\n');
  console.log('PASS '+report.stageCount+' original stages / '+report.caseCount+' cases / '+report.capturedStages+' full-size captures. Browser not exercised.');
})().catch(error=>{console.error(error);process.exitCode=1;});
