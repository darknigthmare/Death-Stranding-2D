/* Native raster verification: unmodified PNGs in the real renderer.
 * Captures are gameplay frames, never replacement sprites or sprite sheets. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),out=path.resolve(process.argv.find(a=>a.startsWith('--output='))?.slice(9)||path.join(root,'../../docs/combat/production/20261127-fidelity'));
const scripts=['content.js','asset-geometry-20261124.js','assets.js','presentation-assets.js','presentation.js','fight.js'];
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const sourceSHA256=Object.fromEntries([...scripts,'qa/presentation-assets.cjs'].map(file=>[file,sha(path.join(root,file))]));
const hashes=new Map(),images=new Map(),cases=[],geometry=[],capturedDraws=[],unavailable=new Set();let capture=false,captureSources=new Set();
const textAvailable=Array.isArray(GlobalFonts.families)&&GlobalFonts.families.length>0;
let canvas=createCanvas(160,90),native=canvas.getContext('2d');native.scale(.125,.125);
const context2d=new Proxy({},{get(_target,key){
  const target=native;
  if(!textAvailable&&(key==='fillText'||key==='strokeText'))return()=>{};
  if(!textAvailable&&key==='measureText')return text=>({width:String(text).length*8});
  if(key==='drawImage')return(image,...args)=>{
    if(capture&&captureSources.has(image._src)){
      const matrix=target.getTransform();capturedDraws.push({image:image._src,crop:args.slice(0,4),transform:{a:matrix.a,b:matrix.b,c:matrix.c,d:matrix.d,e:matrix.e,f:matrix.f}});
    }
    return target.drawImage(image.drawable||image,...args);
  };
  const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
},set(_target,key,value){Reflect.set(native,key,value,native);return true;}});
const surface={getContext:()=>context2d},frames=new Map(),requested=new Set();let serial=0,time=0;
const host={requestAnimationFrame(fn){frames.set(++serial,fn);return serial;},cancelAnimationFrame(id){frames.delete(id);}};
const context={window:host,structuredClone,Image:class{
  set src(file){this._src=file;requested.add(file);this.drawable=images.get(file);this.complete=!!this.drawable&&!unavailable.has(file);this.naturalWidth=this.drawable?.width||0;this.naturalHeight=this.drawable?.height||0;}
  get src(){return this._src;}
}};
vm.createContext(context);for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const engine=host.StrandFight,ids=Object.keys(host.StrandContent.fighters),phaseKeys={entry:'tauntEntry',hold:'taunt',exit:'tauntExit'},phaseFrames={entry:5,hold:20,exit:45};
const fighterFilter=process.argv.find(a=>a.startsWith('--fighter='))?.slice(10);if(fighterFilter)assert(ids.includes(fighterFilter),'Known fighter filter');
const slots=[...ids.map(id=>({id,outfit:'atelier',name:id})),{id:'mama',outfit:'viaduc',name:'mama-viaduc'}].filter(slot=>!fighterFilter||slot.id===fighterFilter);
const options=(slot,player=1,reducedEffects=false)=>({canvas:surface,p1:slot.id,p2:slot.id,outfits:player===1?[slot.outfit,'atelier']:['atelier',slot.outfit],stage:'shore',mode:'local',sound:false,seed:2711,staticScenery:true,reducedEffects});
const stance=slot=>host.StrandAssets.wardrobe?.[slot.id]?.[slot.outfit]?.poses?.stance||host.StrandAssets.fighters[slot.id];
function step(){const previous=engine.snapshot().tick;let attempts=0;while(engine.snapshot().tick===previous&&attempts++<3){time+=1000/60+.000001;const jobs=[...frames.values()];frames.clear();for(const fn of jobs)fn(time);}}
function ready(){while(engine.snapshot().phase==='intro')step();}
function lowResolution(){canvas=createCanvas(160,90);native=canvas.getContext('2d');native.scale(.125,.125);}
async function preload(config){
  requested.clear();engine.start(config);engine.stop();
  for(const file of requested){const full=path.join(root,file);assert(fs.existsSync(full),file+' exists');if(!images.has(file))images.set(file,await loadImage(full));if(!hashes.has(file))hashes.set(file,sha(full));}
}
function captureFrame(name){
  canvas=createCanvas(1280,720);native=canvas.getContext('2d');capturedDraws.length=0;capture=true;
  const before=engine.snapshot().tick,jobs=[...frames.values()];frames.clear();for(const fn of jobs)fn(time);
  capture=false;assert.equal(engine.snapshot().tick,before,'Capturing never advances simulation');
  const pixels=native.getImageData(0,0,1280,720).data;let minimum=255;
  for(let i=3;i<pixels.length;i+=4)minimum=Math.min(minimum,pixels[i]);assert.equal(minimum,255,'Gameplay frame is opaque');
  const relative='presentation-renders/'+name+'.webp',full=path.join(out,relative);fs.writeFileSync(full,canvas.toBuffer('image/webp',88));
  return {capture:relative,captureSha256:sha(full),compositeAlphaMin:minimum,draws:JSON.parse(JSON.stringify(capturedDraws)),snapshot:engine.snapshot()};
}
async function inspectDescriptor(slot,phase,descriptor){
  const full=path.join(root,descriptor.src),image=await loadImage(full);images.set(descriptor.src,image);
  const [x,y,w,h]=descriptor.crop||[];assert([x,y,w,h].every(Number.isFinite));assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=image.width&&y+h<=image.height,'Measured crop fits '+slot.name+'/'+phase);
  assert(descriptor.anchorX>=0&&descriptor.anchorX<=1);assert(descriptor.baselineY>=0&&descriptor.baselineY<=1);assert(descriptor.heightRatio>0);
  const alphaCanvas=createCanvas(image.width,image.height),alphaContext=alphaCanvas.getContext('2d');alphaContext.drawImage(image,0,0);
  const pixels=alphaContext.getImageData(0,0,image.width,image.height).data;let transparent=0,visible=0;
  for(let n=3;n<pixels.length;n+=4){if(pixels[n]===0)transparent++;if(pixels[n]>0)visible++;}
  assert(transparent>0&&visible>0,'Native image has transparent background and visible subject');
  const digest=sha(full);hashes.set(descriptor.src,digest);
  geometry.push({id:slot.id,outfit:slot.outfit,phase,path:descriptor.src,width:image.width,height:image.height,sha256:digest,transparentPixels:transparent,visiblePixels:visible,crop:descriptor.crop,anchorX:descriptor.anchorX,baselineY:descriptor.baselineY,heightRatio:descriptor.heightRatio});
  return digest;
}
function exercise(slot,player,phase,{reducedEffects=false,missing=false}={}){
  const selected=host.StrandPresentation.gestureAssets(slot.id,slot.outfit),descriptor=selected?.[phaseKeys[phase]],ownStance=stance(slot);
  if(missing){assert(descriptor?.src,'The simulated decode failure refers to a delivered image');unavailable.add(descriptor.src);}
  const phaseVisible=!!descriptor&&(!reducedEffects||phase==='hold')&&!missing,expected=phaseVisible?descriptor.src:ownStance;
  captureSources=new Set([ownStance,host.StrandAssets.fighters[slot.id],...Object.values(phaseKeys).map(key=>selected?.[key]?.src).filter(Boolean)]);
  lowResolution();engine.start(options(slot,player,reducedEffects));ready();engine.input(player,'taunt',true);engine.input(player,'taunt',false);
  for(let n=0;n<phaseFrames[phase];n++)step();assert.equal(engine.snapshot().fighters[player-1].taunt.phase,phase);
  const suffix=(reducedEffects?'-reduced':missing?'-unavailable':'')+'-'+phase+(player===1?'-right':'-left'),result=captureFrame(slot.name+suffix);
  const target=result.draws.filter(draw=>player===1?draw.transform.a>0:draw.transform.a<0);
  assert.equal(target.length,1,'Exactly one image renders the taunting fighter');assert.equal(target[0].image,expected,'Selected phase or safe costume fallback');
  if(phaseVisible)assert.deepEqual(target[0].crop,JSON.parse(JSON.stringify(descriptor.crop)));
  cases.push({id:slot.id,outfit:slot.outfit,player,facing:player===1?'right':'left',phase,phaseFrame:phaseFrames[phase],nativePhaseAvailable:!!descriptor,phaseImageDrawn:phaseVisible,
    reducedEffects,simulatedDecodeFailure:missing,fallbackReason:phaseVisible?null:missing?'image-not-decoded':reducedEffects?'reduced-effects':'phase-not-delivered',expectedSource:expected,...result});
  engine.stop();unavailable.clear();
}
(async()=>{
  fs.mkdirSync(path.join(out,'presentation-renders'),{recursive:true});
  for(const slot of slots){
    const selected=host.StrandPresentation.gestureAssets(slot.id,slot.outfit);assert(selected?.taunt?.src,slot.name+' has its own hold');const distinct=new Set();
    for(const [phase,key]of Object.entries(phaseKeys)){
      const descriptor=selected[key];
      if(slot.id!=='diehardman')assert(descriptor?.src,slot.name+' has the delivered '+phase+' image');
      if(descriptor)distinct.add(await inspectDescriptor(slot,phase,descriptor));
    }
    if(slot.id!=='diehardman')assert.equal(distinct.size,3,'Entry, hold and exit are distinct native image files');
    await preload(options(slot));
    for(const player of [1,2])for(const phase of Object.keys(phaseKeys))exercise(slot,player,phase);
    if(slot.outfit==='viaduc'){
      for(const phase of Object.keys(phaseKeys))exercise(slot,1,phase,{reducedEffects:true});
      exercise(slot,1,'hold',{missing:true});
    }
    // Keep only this costume pair decoded. Proof still retains all source hashes.
    images.clear();
  }
  for(const [file,digest]of hashes)assert.equal(sha(path.join(root,file)),digest,'No source image changed: '+file);
  for(const [file,digest]of Object.entries(sourceSHA256))assert.equal(sha(path.join(root,file)),digest,'No script changed during native verification: '+file);
  const proof={date:new Date().toISOString(),passed:true,browser:false,nativeCanvas:true,htmlLayoutRendered:false,hardwareGamepadTested:false,nativeTextRenderingAvailable:textAvailable,fontFamilies:textAvailable?GlobalFonts.families.length:0,
    method:'Native PNG decode, unchanged source hashes, real StrandFight rendering at 1280 × 720. All three simulation phases triggered by ordinary logical input, no fighter-state mutation. Both actual draw-transform signs checked for each costume explicitly listed in scope. Missing phase drawings remain explicit stance fallbacks. Additional reduced-effects and simulated image-decode failure cases are labelled.',
    limits:textAvailable?['Native Canvas captures do not validate HTML menu layout or hardware controls.']:['Native font families unavailable: glyph calls omitted; text metrics are a test fallback.','Native Canvas captures do not validate HTML menu layout or hardware controls.'],
    scope:{fighterFilter:fighterFilter||null,costumes:slots.map(slot=>({id:slot.id,outfit:slot.outfit}))},geometry,cases,decodedImagePaths:hashes.size,sourceSHA256,imageSources:[...hashes].map(([file,sha256])=>({path:file,sha256}))};
  fs.writeFileSync(path.join(out,'presentation-native.json'),JSON.stringify(proof,null,2)+'\n');
  console.log(JSON.stringify({passed:true,cases:cases.length,images:geometry.length,nativePhaseDraws:cases.filter(c=>c.phaseImageDrawn).length,fallbackDraws:cases.filter(c=>!c.phaseImageDrawn).length,decodedImagePaths:hashes.size,nativeTextRenderingAvailable:textAvailable}));
})().catch(error=>{console.error(error);process.exitCode=1;});
