/* Native raster verification: unmodified generated PNGs in the real renderer.
 * Each capture is a gameplay frame, never a replacement sprite or sprite sheet. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),out=path.resolve(process.argv.find(a=>a.startsWith('--output='))?.slice(9)||path.join(root,'../../docs/combat/production/20261127-extensions'));
const scripts=['content.js','asset-geometry-20261124.js','assets.js','presentation-assets.js','presentation.js','fight.js'];
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const hashes=new Map(),images=new Map(),cases=[],geometry=[],capturedDraws=[];let capture=false;
const canvas=createCanvas(160,90),native=canvas.getContext('2d');native.scale(.125,.125);
const context2d=new Proxy(native,{get(target,key){
  if(key==='drawImage')return(image,...args)=>{
    if(capture&&image._src?.includes('/presentation-20261127/')){
      const matrix=target.getTransform();capturedDraws.push({image:image._src,crop:args.slice(0,4),transform:{a:matrix.a,b:matrix.b,c:matrix.c,d:matrix.d,e:matrix.e,f:matrix.f}});
    }
    return target.drawImage(image.drawable||image,...args);
  };
  const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
},set(target,key,value){Reflect.set(target,key,value,target);return true;}});
const surface={getContext:()=>context2d},frames=new Map(),requested=new Set();let serial=0,time=0;
const host={requestAnimationFrame(fn){frames.set(++serial,fn);return serial;},cancelAnimationFrame(id){frames.delete(id);}};
const context={window:host,structuredClone,Image:class{
  set src(file){this._src=file;requested.add(file);this.drawable=images.get(file);this.complete=!!this.drawable;this.naturalWidth=this.drawable?.width||0;this.naturalHeight=this.drawable?.height||0;}
  get src(){return this._src;}
}};
vm.createContext(context);for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const engine=host.StrandFight,ids=Object.keys(host.StrandContent.fighters);
const options=id=>({canvas:surface,p1:id,p2:id,stage:'shore',mode:'local',sound:false,seed:2711,staticScenery:true});
function step(){const previous=engine.snapshot().tick;let attempts=0;while(engine.snapshot().tick===previous&&attempts++<3){time+=1000/60+.000001;const jobs=[...frames.values()];frames.clear();for(const fn of jobs)fn(time);}}
function ready(){while(engine.snapshot().phase==='intro')step();}
function lowResolution(){canvas.width=160;canvas.height=90;native.scale(.125,.125);}
async function preload(config){
  requested.clear();engine.start(config);engine.stop();
  for(const file of requested){const full=path.join(root,file);assert(fs.existsSync(full),file+' exists');if(!images.has(file))images.set(file,await loadImage(full));if(!hashes.has(file))hashes.set(file,sha(full));}
}
function captureFrame(name){
  canvas.width=1280;canvas.height=720;capturedDraws.length=0;capture=true;
  const before=engine.snapshot().tick,jobs=[...frames.values()];frames.clear();for(const fn of jobs)fn(time);
  capture=false;assert.equal(engine.snapshot().tick,before,'Capturing never advances simulation');
  const pixels=native.getImageData(0,0,1280,720).data;let minimum=255;
  for(let i=3;i<pixels.length;i+=4)minimum=Math.min(minimum,pixels[i]);assert.equal(minimum,255,'Gameplay frame is opaque');
  const relative='presentation-renders/'+name+'.webp',full=path.join(out,relative);fs.writeFileSync(full,canvas.toBuffer('image/webp',88));
  return {capture:relative,captureSha256:sha(full),compositeAlphaMin:minimum,draws:JSON.parse(JSON.stringify(capturedDraws)),snapshot:engine.snapshot()};
}
(async()=>{
  fs.mkdirSync(path.join(out,'presentation-renders'),{recursive:true});
  for(const id of ids){
    const descriptor=host.StrandPresentationAssets?.[id]?.taunt;assert(descriptor?.src,id+' has a declared dedicated PNG');
    const full=path.join(root,descriptor.src),image=await loadImage(full);images.set(descriptor.src,image);
    const [x,y,w,h]=descriptor.crop||[];assert([x,y,w,h].every(Number.isFinite));assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=image.width&&y+h<=image.height,'Measured crop fits '+id);
    assert(descriptor.anchorX>=0&&descriptor.anchorX<=1);assert(descriptor.baselineY>=0&&descriptor.baselineY<=1);assert(descriptor.heightRatio>0);
    const alphaCanvas=createCanvas(image.width,image.height),alphaContext=alphaCanvas.getContext('2d');alphaContext.drawImage(image,0,0);
    const pixels=alphaContext.getImageData(0,0,image.width,image.height).data;let transparent=0,visible=0;
    for(let n=3;n<pixels.length;n+=4){if(pixels[n]===0)transparent++;if(pixels[n]>0)visible++;}
    assert(transparent>0&&visible>0,'Native image has transparent background and visible subject');
    geometry.push({id,path:descriptor.src,width:image.width,height:image.height,sha256:sha(full),transparentPixels:transparent,visiblePixels:visible,crop:descriptor.crop,anchorX:descriptor.anchorX,baselineY:descriptor.baselineY,heightRatio:descriptor.heightRatio});
    await preload(options(id));
    for(const player of [1,2]){
      lowResolution();engine.start(options(id));ready();engine.input(player,'taunt',true);engine.input(player,'taunt',false);
      for(let n=0;n<18;n++)step();assert.equal(engine.snapshot().fighters[player-1].taunt.phase,'hold');
      const result=captureFrame(id+(player===1?'-right':'-left'));
      assert.equal(result.draws.length,1,'One dedicated taunt is rendered');assert.equal(result.draws[0].image,descriptor.src);assert.deepEqual(result.draws[0].crop,JSON.parse(JSON.stringify(descriptor.crop)));
      assert(player===1?result.draws[0].transform.a>0:result.draws[0].transform.a<0,'Actual draw transform follows the facing direction');
      cases.push({id,player,facing:player===1?'right':'left',...result});engine.stop();
    }
    // Decode only the active pair and the next pair at a time. Old image bytes
    // are still covered by hashes, not kept as hundreds of decoded bitmaps.
    images.clear();
  }
  const alternate={...options('mama'),outfits:['viaduc','atelier']};lowResolution();await preload(alternate);engine.start(alternate);ready();engine.input(1,'taunt',true);engine.input(1,'taunt',false);for(let n=0;n<18;n++)step();
  assert.equal(engine.snapshot().fighters[0].taunt.phase,'hold');const result=captureFrame('mama-viaduc-preserved');assert.equal(result.draws.length,0,'No base-costume gesture image drawn for Mama viaduc');cases.push({id:'mama',outfit:'viaduc',player:1,...result});engine.stop();
  for(const [file,digest]of hashes)assert.equal(sha(path.join(root,file)),digest,'No source image changed: '+file);
  const textAvailable=Array.isArray(GlobalFonts.families)&&GlobalFonts.families.length>0;
  const proof={date:new Date().toISOString(),passed:true,browser:false,nativeCanvas:true,htmlLayoutRendered:false,hardwareGamepadTested:false,nativeTextRenderingAvailable:textAvailable,fontFamilies:textAvailable?GlobalFonts.families.length:0,
    method:'Native PNG decode, unchanged source hashes, real StrandFight rendering at 1280 × 720. Gestures triggered by ordinary logical input, no fighter-state mutation. Both actual draw-transform signs checked for eight fighters; Mama viaduc checked separately.',
    limits:textAvailable?['Native Canvas captures do not validate HTML menu layout or hardware controls.']:['No native font families: glyphs not validated.','Native Canvas captures do not validate HTML menu layout or hardware controls.'],
    geometry,cases,decodedImagePaths:hashes.size,sourceSHA256:Object.fromEntries([...scripts,'qa/presentation-assets.cjs'].map(file=>[file,sha(path.join(root,file))])),imageSources:[...hashes].map(([file,sha256])=>({path:file,sha256}))};
  fs.writeFileSync(path.join(out,'presentation-native.json'),JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify({passed:true,cases:cases.length,images:geometry.length,decodedImagePaths:hashes.size,nativeTextRenderingAvailable:textAvailable}));
})().catch(error=>{console.error(error);process.exitCode=1;});
