/* Native Canvas reception of the opt-in team engine. No HTML/browser claim. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),out=path.resolve(process.argv.find(a=>a.startsWith('--output='))?.slice(9)||path.join(root,'../../docs/combat/production/20261127-team-gameplay'));
const files=['content.js','asset-geometry-20261124.js','assets.js','presentation-assets.js','presentation.js','fight.js'];
const requested=new Set(),decoded=new Map(),queue=new Map();let serial=0,time=0;
const canvas=createCanvas(1280,720),native=canvas.getContext('2d');
const ctx=new Proxy(native,{get(target,key){if(key==='drawImage')return(image,...args)=>target.drawImage(image.drawable||image,...args);const v=Reflect.get(target,key,target);return typeof v==='function'?v.bind(target):v;},set(target,key,v){Reflect.set(target,key,v,target);return true;}});
const host={requestAnimationFrame(fn){queue.set(++serial,fn);return serial;},cancelAnimationFrame(id){queue.delete(id);}};
const context={window:host,structuredClone,Image:class{set src(file){this._src=file;requested.add(file);this.drawable=decoded.get(file);this.complete=!!this.drawable;this.naturalWidth=this.drawable?.width||0;this.naturalHeight=this.drawable?.height||0;}get src(){return this._src;}}};
vm.createContext(context);for(const file of files)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const e=host.StrandFight,options={canvas:{getContext:()=>ctx},teams:[['sam','fragile'],['higgs','mama']],stage:'terminal',mode:'local',roundsToWin:1,sound:false,seed:443,staticScenery:true};
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function step(n=1){let remaining=n*3+10;const end=e.snapshot().tick+n;while(e.snapshot().tick<end&&remaining-->0){time+=1000/60+.000001;const jobs=[...queue.values()];queue.clear();for(const fn of jobs)fn(time);}assert(remaining>0);}
function start(reducedEffects=false){e.start({...options,reducedEffects});while(e.snapshot().phase==='intro')step();}
function tap(p,key){e.input(p,key,true);e.input(p,key,false);}
const cases=[];
function capture(name){const image='team-renders/'+name+'.webp';fs.writeFileSync(path.join(out,image),canvas.toBuffer('image/webp',90));cases.push({image,sha256:sha(path.join(out,image)),snapshot:e.snapshot()});}
(async()=>{
  fs.mkdirSync(path.join(out,'team-renders'),{recursive:true});e.start(options);e.stop();
  const originals={};for(const file of requested){originals[file]=sha(path.join(root,file));decoded.set(file,await loadImage(path.join(root,file)));}
  start();capture('two-teams-ready');tap(1,'assist');tap(2,'assist');step(10);capture('both-supports-enter');assert(e.snapshot().teams.every(t=>t.busy?.kind==='assist'));e.stop();
  start();tap(1,'tag');step(15);assert.equal(e.snapshot().fighters[0].id,'fragile');capture('control-transferred');e.stop();
  start(true);tap(1,'assist');tap(2,'assist');step(10);capture('supports-reduced-effects');e.stop();
  for(const [file,digest]of Object.entries(originals))assert.equal(sha(path.join(root,file)),digest,'Image source preserved');
  const report={date:'2026-11-27',passed:true,nativeCanvas:true,browser:false,htmlLayoutRendered:false,hardwareGamepadTested:false,fontFamilies:GlobalFonts.families.length,
    method:'Actual StrandFight rendering at 1280 × 720, PNG/WebP decoded natively; ordinary logical inputs only; no fabricated fighter state for these captures.',
    cases,imageSources:originals,sourceSha256:Object.fromEntries(files.map(file=>[file,sha(path.join(root,file))]))};
  fs.writeFileSync(path.join(out,'teams-native.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:true,cases:cases.length,decoded:decoded.size,fontFamilies:report.fontFamilies}));
})().catch(error=>{console.error(error);process.exitCode=1;});
