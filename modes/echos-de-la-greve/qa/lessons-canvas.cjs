/* Native Canvas proof of three guided exercises. This renders StrandFight, not
 * HTML layout. The teacher and learner both use ordinary engine inputs. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..');
const output=path.resolve(process.argv.find(a=>a.startsWith('--output='))?.slice(9)||path.join(root,'../../docs/combat/production/20261125-extension'));
const scripts=['content.js','asset-geometry-20261124.js','assets.js','presentation-assets.js','presentation.js','moves-data.js','lessons.js','fight.js'];
const queue=new Map(),requested=new Set(),decoded=new Map();let serial=0,time=0;
const canvas=createCanvas(160,90),nativeContext=canvas.getContext('2d');nativeContext.scale(.125,.125);
const context2d=new Proxy(nativeContext,{get(target,key){
  if(key==='drawImage')return(image,...args)=>target.drawImage(image.drawable||image,...args);
  const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
},set(target,key,value){Reflect.set(target,key,value,target);return true;}});
const surface={getContext:()=>context2d};
const host={requestAnimationFrame(fn){queue.set(++serial,fn);return serial;},cancelAnimationFrame(id){queue.delete(id);}};
const context={window:host,structuredClone,Image:class {
  set src(file){this._src=file;requested.add(file);this.drawable=decoded.get(file);this.complete=!!this.drawable;this.naturalWidth=this.drawable?.width||0;this.naturalHeight=this.drawable?.height||0;}
  get src(){return this._src;}
}};
vm.createContext(context);for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const engine=host.StrandFight;
const candidate='firing-range-dc',groups=['stages','skyplates','distants','midgrounds','floors','foregrounds'];
const stage=host.StrandContent.stages[candidate]&&groups.every(group=>host.StrandAssets[group]?.[candidate]&&fs.existsSync(path.join(root,host.StrandAssets[group][candidate])))?candidate:'terminal';
const options={canvas:surface,p1:'sam',p2:'higgs',stage,mode:'training',sound:false,seed:0x1e550,training:{dummy:'record',timing:true},staticScenery:true};
engine.start(options);engine.stop();
function frames(count=1){for(let i=0;i<count;i++){time+=1000/60+.000001;const jobs=[...queue.values()];queue.clear();for(const fn of jobs)fn(time);}}
function controls(){const held={};return wanted=>{for(const action of ['left','right','guard','light','taunt'])if(!!held[action]!==!!wanted[action]){held[action]=!!wanted[action];engine.input(1,action,!!wanted[action]);}};}
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function captureFrame(name){
  canvas.width=1280;canvas.height=720;
  const before=engine.snapshot().tick,jobs=[...queue.values()];queue.clear();for(const fn of jobs)fn(time);
  assert.equal(engine.snapshot().tick,before,'Capture does not advance simulation');
  const pixels=nativeContext.getImageData(0,0,1280,720).data;let minAlpha=255;
  for(let i=3;i<pixels.length;i+=4)minAlpha=Math.min(minAlpha,pixels[i]);assert.equal(minAlpha,255);
  const file='dojo-renders/'+name+'.webp';fs.writeFileSync(path.join(output,file),canvas.toBuffer('image/webp',88));
  const result={compositeAlphaMin:minAlpha,capture:file,captureSha256:sha(path.join(output,file)),snapshot:engine.snapshot()};
  canvas.width=160;canvas.height=90;nativeContext.scale(.125,.125);return result;
}
(async()=>{
  fs.mkdirSync(path.join(output,'dojo-renders'),{recursive:true});
  for(const file of requested){assert(fs.existsSync(path.join(root,file)),file);decoded.set(file,await loadImage(path.join(root,file)));}
  const cases=[];
  for(const id of ['guard-high','punish','taunt']){
    const lesson=host.StrandLessons.createSession(id,'sam'),captures=[];let state=lesson.status(),frame=0,taunted=false;
    const input=controls();
    engine.start({...options,onStatus(status){const update=lesson.observe(status);state=update.state;for(const args of update.commands)engine.input(...args);}});
    while(frame++<1800&&state.phase==='active'){
      const s=engine.snapshot(),[p,q]=s.fighters,gap=Math.abs(p.x-q.x),forward=p.x<=q.x?'right':'left',back=forward==='right'?'left':'right',wanted={};
      if(s.phase==='fight'){
        if(id==='guard-high')wanted.guard=true;
        else if(id==='taunt'){
          if(state.step===0){if(gap<250)wanted[back]=true;else if(!p.taunt&&!taunted){wanted.taunt=true;taunted=true;}}
          else if(q.taunt?.phase==='hold'&&!p.action)wanted.light=true;
        }
        else if(state.step===0&&!q.action){if(gap>170)wanted[forward]=true;else if(gap<160)wanted[back]=true;}
        else if(state.step===1){if(gap>102)wanted[forward]=true;else if(!p.action)wanted.light=true;}
      }
      input(wanted);frames();
      if(id==='taunt'){
        const [p,q]=engine.snapshot().fighters;
        if(!captures.length&&p.taunt?.phase==='hold'&&p.taunt.frame>=18)captures.push(captureFrame('taunt-distance'));
        if(captures.length===1&&q.taunt?.phase==='hold'&&q.taunt.frame>=12)captures.push(captureFrame('taunt-opponent'));
      }
    }
    input({});assert.equal(state.phase,'success',id+': '+state.feedback);
    if(id==='taunt'){assert.equal(captures.length,2);assert.equal(state.evidence[1].kind,'taunt-interrupted');}
    cases.push({id,stage,frames:frame,phase:state.phase,evidence:state.evidence,...captureFrame(id==='taunt'?'taunt-interrupted':id),captures});
    engine.stop();
  }
  const proof={date:new Date().toISOString(),passed:true,browser:false,nativeCanvas:true,htmlLayoutRendered:false,hardwareGamepadTested:false,
    method:'Trois exercices guidés exécutés par leurs entrées réelles ; PNG décodés et vrai renderer StrandFight à 1280×720. Le geste à distance, celui du mannequin et son interruption sont capturés séparément. Aucun moteur de mise en page HTML.',
    nativeTextRenderingAvailable:GlobalFonts.families.length>0,limits:GlobalFonts.families.length?[]:['Aucune police système disponible : ces captures valident images, barres et composition ; les glyphes du HUD ne sont pas rendus dans ce runtime.'],stage,decodedImages:decoded.size,cases,sourceSha256:Object.fromEntries([...scripts,'qa/lessons-canvas.cjs'].map(file=>[file,sha(path.join(root,file))])),
    imageSources:[...decoded.keys()].map(file=>({path:file,sha256:sha(path.join(root,file))}))};
  fs.writeFileSync(path.join(output,'lessons-native-verification.json'),JSON.stringify(proof,null,2)+'\n');
  console.log(JSON.stringify({passed:true,cases:cases.length,stage,decodedImages:decoded.size,captures:cases.map(c=>c.capture)}));
})().catch(error=>{console.error(error);process.exitCode=1;});
