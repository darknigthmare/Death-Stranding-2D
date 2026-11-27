/* Native reception of the first playable originals.
 * @napi-rs/canvas is pinned to 0.1.80. PNGs, crops, fonts and rendering are real.
 * Balise poses are explicitly prepared in memory; the Sam boss run uses only
 * public controls. Engine files and source images are never rewritten. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas');
const canvasPackage=require('@napi-rs/canvas/package.json');
assert.equal(canvasPackage.version,'0.1.80','Use the pinned native Canvas version');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const out=path.resolve(process.argv.find(arg=>arg.startsWith('--output='))?.slice(9)||path.join(repo,'docs/combat/production/20261127-first-playable/native-renders'));
const W=1280,H=720,FLOOR=588,DIGUE='ldm-stage-digue-aval',BOSS='ldm-boss-consignateur';
const poses=['stance','guard','crouch','jump','light','heavy','hurt','tether','anchor','reel','fall','taunt','victory','walk1','walk2'];
const bossPoses=['guard','shield-push','pole-strike','stagger','kneel','surrender'];
const poseLabels={stance:'Attente',guard:'Garde',crouch:'Accroupissement',jump:'Saut',light:'Contact léger',heavy:'Coup de harnais',hurt:'Impact reçu',
  tether:'Traction au lien',anchor:'Pose de l’ancre',reel:'Rappel physique',fall:'Renversement · défaite',taunt:'Vérification du mousqueton',victory:'Victoire',walk1:'Marche · appui 1',walk2:'Marche · appui 2'};
const copy=value=>JSON.parse(JSON.stringify(value)),close=(a,b,why)=>assert(Math.abs(a-b)<.02,why+': '+a+' / '+b);
const shaBuffer=bytes=>crypto.createHash('sha256').update(bytes).digest('hex'),sha=file=>shaBuffer(fs.readFileSync(file));
const keep=new Set(['content.js','asset-geometry-20261124.js','assets.js','extension-data.js','extension-assets.js','extension-runtime.js',
  'presentation-assets.js','presentation.js','boss-geometry-20261124.js','boss-assets.js','original-kits-assets.js','original-kits.js',
  'fight.js','original-bosses-assets.js','original-bosses.js','boss.js']);
const files=[...fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1]).filter(file=>keep.has(file));
assert.equal(files.length,keep.size,'HTML must declare every native reception dependency exactly once');
const sources=Object.fromEntries(files.map(file=>[file,fs.readFileSync(path.join(root,file),'utf8')]));
const sourceSha256=Object.fromEntries(files.map(file=>[file,sha(path.join(root,file))]));
const requested=new Set(),decoded=new Map(),imageSources={},alphaCache=new Map(),snapshots=[],poseChecks=[],bossPoseChecks=[];
let strictImages=false;
const loadedFonts=[],availableFonts=[];
function fontFiles(directory,depth=0){
  if(depth>6||!fs.existsSync(directory))return [];
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?fontFiles(path.join(directory,entry.name),depth+1):
    entry.isFile()&&/\.(ttf|otf|ttc)$/i.test(entry.name)?[path.join(directory,entry.name)]:[]);
}
function loadFonts(){
  const directories=['/usr/share/fonts','/usr/local/share/fonts',path.join(process.env.HOME||'/nonexistent','.fonts')];
  for(const file of [...new Set(directories.flatMap(directory=>fontFiles(directory)))]){
    availableFonts.push(file);if(GlobalFonts.registerFromPath(file))loadedFonts.push(file);
  }
  const regular=availableFonts.find(file=>/LiberationSans-Regular\.ttf$/i.test(file))||availableFonts.find(file=>/DejaVuSans\.ttf$/i.test(file));
  const bold=availableFonts.find(file=>/LiberationSans-Bold\.ttf$/i.test(file))||availableFonts.find(file=>/DejaVuSans-Bold\.ttf$/i.test(file));
  assert(regular,'A real proportional system font is required; install DejaVu Sans or Liberation Sans');
  const registeredAlias=GlobalFonts.registerFromPath(regular,'Arial');assert(registeredAlias||GlobalFonts.has('Arial'),'Arial alias registration failed');
  if(bold)assert(GlobalFonts.registerFromPath(bold,'Arial')||GlobalFonts.has('Arial'),'Arial bold alias registration failed');
  const probe=createCanvas(300,80).getContext('2d');probe.font='20px Arial, sans-serif';
  const wide=probe.measureText('WWWW'),narrow=probe.measureText('iiii'),accent=probe.measureText('Échos de la Grève');
  assert(wide.width>narrow.width*1.3&&accent.width>40&&accent.actualBoundingBoxAscent>0,'Native font metrics unavailable');
  return {availableFiles:availableFonts.length,registeredFiles:loadedFonts.length,registeredAlias,families:GlobalFonts.families.length,alias:'Arial',regular,bold: bold||null,
    regularSha256:sha(regular),metrics:{wide:wide.width,narrow:narrow.width,accent:accent.width,ascent:accent.actualBoundingBoxAscent}};
}
function environment(){
  const canvas=createCanvas(W,H),native=canvas.getContext('2d'),draws=[],queue=new Map();let serial=0;
  const ctx=new Proxy(native,{
    get(target,key){
      if(key==='drawImage')return(image,...args)=>{
        const file=typeof image.src==='string'?image.src:null,drawable=image.drawable||image;
        assert(drawable,'Missing native drawable');
        const matrix=target.getTransform(),transform={a:matrix.a,b:matrix.b,c:matrix.c,d:matrix.d,e:matrix.e,f:matrix.f};
        draws.push({file,args:args.slice(),transform,alpha:target.globalAlpha});
        return target.drawImage(drawable,...args);
      };
      const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
    },
    set(target,key,value){Reflect.set(target,key,value,target);return true;}
  });
  class CachedImage {
    set src(file){
      assert.equal(typeof file,'string','Image source must be a path');this._src=file;requested.add(file);this.drawable=decoded.get(file);
      if(strictImages)assert(this.drawable,'Unrequested/undecoded real image '+file);
      this.complete=!!this.drawable;this.naturalWidth=this.drawable?.width||0;this.naturalHeight=this.drawable?.height||0;
    }
    get src(){return this._src;}
  }
  const storage=new Map(),host={document:{hidden:false},requestAnimationFrame(fn){queue.set(++serial,fn);return serial;},cancelAnimationFrame(id){queue.delete(id);},
    localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)}};
  const context={window:host,Image:CachedImage,structuredClone,console};
  vm.createContext(context);
  for(const file of files){
    let code=sources[file];
    if(file==='fight.js'){
      const marker='  host.StrandFight = {';assert.equal(code.split(marker).length,2,'Fight observation insertion point changed');
      code=code.replace(marker,'  host.__nativeFight={getMatch:()=>match,draw};\n'+marker);
    }
    if(file==='boss.js'){
      const marker='  host.StrandBoss={';assert.equal(code.split(marker).length,2,'Boss observation insertion point changed');
      code=code.replace(marker,'  host.__nativeBoss={getCurrent:()=>current};\n'+marker);
    }
    vm.runInContext(code,context,{filename:file});
  }
  const surface={width:W,height:H,getContext:()=>ctx};
  return {canvas,native,ctx,draws,host,surface,queue};
}
function pathFor(src){assert(typeof src==='string'&&src.startsWith('assets/'),'A local received asset is required');const file=path.resolve(root,src);assert(file.startsWith(root+path.sep),'Asset escaped mode directory');return file;}
function descriptor(src,g,label,pngOnly=true){
  const file=pathFor(src),bytes=fs.readFileSync(file);assert(bytes.length>32,label+' image is empty');
  if(pngOnly)assert(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),label+' is not PNG');
  const im=decoded.get(src);assert(im&&im.width>0&&im.height>0,label+' is not decoded');
  assert(Array.isArray(g?.crop)&&g.crop.length===4&&g.crop.every(Number.isFinite),label+' crop missing');
  const [x,y,w,h]=g.crop;assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=im.width&&y+h<=im.height,label+' crop outside source');
  for(const key of ['anchorX','baselineY'])assert(Number.isFinite(g[key])&&g[key]>=0&&g[key]<=1,label+' '+key);
  return {src,width:im.width,height:im.height,crop:g.crop.slice(),sha256:imageSources[src]};
}
function alphaBounds(src,crop){
  const key=src+':'+crop.join(',');if(alphaCache.has(key))return alphaCache.get(key);
  assert(crop.every(Number.isInteger),'Measured PNG crops must be native integer rectangles');
  const canvas=createCanvas(crop[2],crop[3]),ctx=canvas.getContext('2d');
  ctx.drawImage(decoded.get(src),...crop,0,0,crop[2],crop[3]);const pixels=ctx.getImageData(0,0,crop[2],crop[3]).data;
  let l=crop[2],r=-1,t=crop[3],b=-1,count=0;
  for(let y=0;y<crop[3];y++)for(let x=0;x<crop[2];x++)if(pixels[(y*crop[2]+x)*4+3]>8){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);count++;}
  assert(count>0,'Empty transparent pose '+src);const result={l,r,t,b,alphaPixels:count,fraction:count/(crop[2]*crop[3])};alphaCache.set(key,result);return result;
}
function point(matrix,x,y){return {x:matrix.a*x+matrix.c*y+matrix.e,y:matrix.b*x+matrix.d*y+matrix.f};}
function oneDraw(w,src,label){const matches=w.draws.filter(draw=>draw.file===src);assert.equal(matches.length,1,label+' must draw the requested source exactly once');return matches[0];}
function inspectPose(w,descriptorValue,actor,label){
  const g=descriptorValue,meta=descriptor(g.src,g,label),draw=oneDraw(w,g.src,label),args=draw.args;
  assert.equal(args.length,8,label+' must use its native crop');assert.deepEqual(args.slice(0,4),[...g.crop],label+' requested crop');
  const [dx,dy,width,height]=args.slice(4),matrix=draw.transform;
  assert(width>0&&height>0&&[dx,dy,width,height].every(Number.isFinite),label+' finite destination');
  close(width/height,g.crop[2]/g.crop[3],label+' native proportions');
  const local=actor.local===true,anchorX=local?0:actor.x,anchorY=local?0:FLOOR-(actor.y||0);
  close(dx+width*g.anchorX,anchorX,label+' foot X anchor');
  close(dy+height*g.baselineY,anchorY,label+' foot Y anchor');
  if(actor.height)close(height,actor.height*g.heightRatio,label+' anatomical display scale');
  assert(matrix.a>0&&matrix.d>0&&Math.abs(matrix.b)<1e-8&&Math.abs(matrix.c)<1e-8,label+' must not be mirrored or rotated');
  const screenFoot=point(matrix,dx+width*g.anchorX,dy+height*g.baselineY),screenFloor=local?{x:actor.x,y:FLOOR}:point(matrix,actor.x,FLOOR);
  if(local)close(screenFoot.x,actor.x,label+' translated foot X');
  close(screenFloor.y-screenFoot.y,matrix.d*(actor.y||0),label+' jump/ground displacement');
  const alpha=alphaBounds(g.src,g.crop),visibleBottom=dy+height*(alpha.b+1)/g.crop[3],pixelGroundGap=anchorY-visibleBottom;
  assert(pixelGroundGap>=-4&&pixelGroundGap<=8,label+' visible pixels detach from measured foot baseline: '+pixelGroundGap);
  return {label,...meta,destination:{x:dx,y:dy,width,height},transform:matrix,screenFoot,screenFloor,pixelGroundGap,alphaBounds:alpha,mirror:false};
}
function panorama(w){
  const src=w.host.StrandAssets.stages[DIGUE],image=decoded.get(src),draw=oneDraw(w,src,'Digue panorama'),floorY=w.host.StrandAssets.stageGeometry[DIGUE].legacy.floorY;
  assert.equal(draw.args.length,4);const [x,y,width,height]=draw.args;
  close(width/height,image.width/image.height,'Digue native proportions');close(y+height*floorY,FLOOR,'Digue measured ground');
  assert(x<=0&&y<=0&&x+width>=W&&y+height>=H,'Digue does not cover native viewport');
  return {src,sha256:imageSources[src],rect:{x,y,width,height},sourceFloorY:floorY,screenFloorY:y+height*floorY};
}
function record(w,name,details={}){
  const file=name+'.webp',bytes=w.canvas.toBuffer('image/webp',94);fs.writeFileSync(path.join(out,file),bytes);
  const entry={file,width:W,height:H,sha256:shaBuffer(bytes),...details};snapshots.push(entry);return entry;
}
function nativeFrame(w,draw){w.draws.length=0;draw();const pixel=w.native.getImageData(0,0,W,H).data;for(let at=3;at<pixel.length;at+=4)assert.equal(pixel[at],255,'Native composition must be opaque');return panorama(w);}
function prepareBalise(m,pose,side){
  const endedPose=pose==='victory'||pose==='fall';
  m.phase=endedPose?'roundover':'fight';m.phaseTicks=endedPose?80:0;m.winner=pose==='victory'?1:pose==='fall'?2:0;m.wins=[pose==='victory'?1:0,pose==='fall'?1:0];m.tick=120;m.beat=0;m.hstop=0;m.shake=0;m.camera=0;m.shots=[];m.sparks=[];
  const f=m.f[0],foe=m.f[1],face=side==='right'?1:-1;
  Object.assign(f,{x:face>0?462:818,y:0,vx:0,vy:0,face,hp:pose==='fall'?0:100,chiral:70,balance:100,keys:{},taps:{},queue:[],act:null,marker:null,stun:0,blockStun:0,dash:0,drift:0,
    grounded:true,crouch:false,guard:false,flash:0,postHit:0,walk:0,combo:0,comboTTL:0,notice:'',noticeTTL:0,lastMove:''});delete f.taunt;delete f.scan;
  Object.assign(foe,{x:face>0?818:462,y:0,vx:0,vy:0,face:-face,keys:{},act:null,stun:0,guard:false,crouch:false,flash:0,hp:100});delete foe.taunt;
  const move=(key,t)=>{f.act={key,t,hit:false,hitConfirmed:false,target:foe.x};f.lastMove=key;};
  if(pose==='guard')f.guard=true;
  if(pose==='crouch')f.crouch=true;
  if(pose==='jump'){f.y=70;f.vy=8;f.grounded=false;}
  if(pose==='light')move('baliseLight',8);
  if(pose==='heavy')move('baliseHeavy',16);
  if(pose==='hurt')f.stun=12;
  if(pose==='tether')move('balise',19);
  if(pose==='anchor'){move('baliseAnchor',16);f.act.anchorX=f.x+face*66;}
  if(pose==='reel'){move('baliseReel',12);f.act.destination=f.x+face*66;}
  if(pose==='taunt')f.taunt={frame:20};
  if(pose.startsWith('walk')){f.keys[face>0?'right':'left']=true;f.walk=pose==='walk1'?Math.PI/2:Math.PI*1.5;}
  return {pose,side,preparation:'Explicit in-memory pose state; no simulation progression claimed',fighter:copy(f),opponent:{x:foe.x,face:foe.face},phase:m.phase,winner:m.winner};
}
function board(side){
  const width=1700,height=1540,canvas=createCanvas(width,height),ctx=canvas.getContext('2d');
  ctx.fillStyle='#0b161c';ctx.fillRect(0,0,width,height);ctx.fillStyle='#eef2e7';ctx.font='700 34px Arial, sans-serif';
  ctx.fillText('BALISE · 15 POSES CLÉS · '+(side==='right'?'VERS LA DROITE':'VERS LA GAUCHE'),28,48);
  ctx.font='18px Arial, sans-serif';ctx.fillStyle='#b7c8c9';ctx.fillText('Rendu réel de la Digue · états préparés en mémoire · sources orientées, sans miroir',28,80);
  return {canvas,ctx,width,height};
}
function boardTile(sheet,w,index,pose,proof){
  const col=index%5,row=Math.floor(index/5),x=col*340+14,y=110+row*470,ctx=sheet.ctx;
  ctx.fillStyle='#13252c';ctx.fillRect(x,y,312,448);
  const cropX=Math.max(0,Math.min(W-340,proof.screenFoot.x-170)),cropY=Math.max(0,Math.min(H-430,proof.screenFloor.y-410));
  ctx.drawImage(w.canvas,cropX,cropY,340,430,x+6,y+6,300,379.41);
  ctx.fillStyle='#f0dcc0';ctx.font='700 17px Arial, sans-serif';ctx.fillText(String(index+1).padStart(2,'0')+' · '+poseLabels[pose],x+10,y+407,292);
  ctx.fillStyle='#bdcfd0';ctx.font='12px Arial, sans-serif';ctx.fillText(path.basename(proof.src),x+10,y+426,292);
  ctx.fillText('Sol '+proof.screenFloor.y.toFixed(1)+' · ancre '+proof.screenFoot.y.toFixed(1)+' · sans miroir',x+10,y+442,292);
  proof.boardCell={column:col,row,crop:{x:cropX,y:cropY,width:340,height:430}};
}
function bossBoard(){
  const canvas=createCanvas(1440,1560),ctx=canvas.getContext('2d');
  ctx.fillStyle='#0b161c';ctx.fillRect(0,0,1440,1560);ctx.fillStyle='#eef2e7';ctx.font='700 32px Arial, sans-serif';
  ctx.fillText('CONSIGNATEUR · 6 POSES × 2 ORIENTATIONS',26,46);
  ctx.font='17px Arial, sans-serif';ctx.fillStyle='#b7c8c9';ctx.fillText('États observés pendant Sam normal ; orientation préparée en mémoire uniquement',26,77);
  ctx.fillText('Chaque paire présente gauche / droite. Contrôler le bras du bouclier, les appuis et les bords alpha.',26,101);
  return {canvas,ctx,width:1440,height:1560};
}
function bossTile(sheet,w,index,pose,side,proof){
  const col=index%4,row=Math.floor(index/4),x=col*360+12,y=126+row*470,ctx=sheet.ctx;
  const start=point(proof.transform,proof.destination.x,proof.destination.y),end=point(proof.transform,proof.destination.x+proof.destination.width,proof.destination.y+proof.destination.height);
  const cropW=Math.max(280,Math.min(W,Math.abs(end.x-start.x)+48)),cropH=Math.max(310,Math.min(H,Math.abs(end.y-start.y)+65));
  const cropX=Math.max(0,Math.min(W-cropW,(start.x+end.x)/2-cropW/2)),cropY=Math.max(0,Math.min(H-cropH,proof.screenFloor.y+20-cropH));
  ctx.fillStyle='#13252c';ctx.fillRect(x,y,336,450);
  const scale=Math.min(320/cropW,382/cropH),dw=cropW*scale,dh=cropH*scale;
  ctx.drawImage(w.canvas,cropX,cropY,cropW,cropH,x+(336-dw)/2,y+7+(382-dh)/2,dw,dh);
  const labels={guard:'Garde','shield-push':'Poussée','pole-strike':'Perche',stagger:'Reprise',kneel:'Agenouillement',surrender:'Reddition'};
  ctx.fillStyle='#f0dcc0';ctx.font='700 18px Arial, sans-serif';ctx.fillText(labels[pose]+' · '+(side==='left'?'gauche':'droite'),x+10,y+412,316);
  ctx.fillStyle='#bdcfd0';ctx.font='12px Arial, sans-serif';ctx.fillText(path.basename(proof.src),x+10,y+431,316);
  ctx.fillText('Sol '+proof.screenFloor.y.toFixed(1)+' · dessin orienté sans miroir',x+10,y+447,316);
  proof.boardCell={column:col,row,crop:{x:cropX,y:cropY,width:cropW,height:cropH}};
}
function bossPose(s){return s.original.surrendered?'surrender':s.boss.hp===0?'kneel':s.boss.phase==='recover'||s.boss.flash>0?'stagger':['tell','attack'].includes(s.boss.phase)?s.original.phase===2?'pole-strike':'shield-push':'guard';}
function publicSamRun(w){
  const api=w.host.StrandBoss,pulses=[],events=[],captured=new Set(),states=new Map();let result=null,checkpointCount=0;
  api.start({canvas:w.surface,boss:BOSS,p1:'sam',difficulty:'normal',scenarioSpeed:1,manualClock:true,sound:false,isolated:true,staticScenery:true,onEnd:value=>{result=copy(value);}});
  function snapshotState(s){
    const pose=bossPose(s);if(!states.has(pose))states.set(pose,copy(s));
    const take=(name,condition)=>{if(!condition||captured.has(name))return;captured.add(name);
      const floor=nativeFrame(w,()=>api.draw()),face=s.boss.face<0?'left':'right',g=w.host.StrandOriginalBossArt.directionalPoses.consignateur[pose][face];
      const proof=inspectPose(w,g,{x:s.boss.x,y:0,local:true,height:194},'Public Consignateur '+name+' '+face);
      if(name==='consignateur-console-disabled')oneDraw(w,w.host.StrandOriginalBossArt.props['console-inactive'],'Disabled console');
      if(name==='consignateur-register')oneDraw(w,w.host.StrandOriginalBossArt.props.register,'Visible register');
      if(name==='consignateur-surrender')assert.equal(w.draws.filter(draw=>draw.file===w.host.StrandOriginalBossArt.props['console-inactive']).length,2,'Both consoles must remain disabled');
      record(w,name,{method:'Public Sam normal run; logical inputs only',tick:s.tick,phase:s.original.phase,bossPose:pose,direction:face,
        objectiveFlags:{consoles:s.original.consoles,register:s.original.register,freightIntegrity:s.original.freightIntegrity,surrendered:s.original.surrendered},
        guard:s.boss.hp,playerHp:s.p.hp,panorama:floor,poseProof:proof});
    };
    for(const phase of [1,2,3])take('consignateur-phase-'+phase,s.original.phase===phase&&s.boss.phase==='tell');
    take('consignateur-console-disabled',s.original.phase===2&&s.original.consoles.filter(Boolean).length===1);
    take('consignateur-register',s.original.phase===3&&s.original.register==='ground'&&s.boss.phase==='recover');
    take('consignateur-kneel',s.boss.hp===0&&!s.original.surrendered);
    take('consignateur-surrender',s.phase==='ended'&&s.original.surrendered);
  }
  let previous='',total=0;
  for(;total<18080&&!result;total++){
    for(const key of pulses.splice(0))api.input(1,key,false);
    const s=api.snapshot(),p=s.p,b=s.boss,o=s.original;
    snapshotState(s);const tag=o.phase+':'+o.consoles.join(',')+':'+o.register;
    if(tag!==previous){events.push({tick:s.tick,tag,hp:p.hp,guard:b.hp});previous=tag;}
    if(s.phase!=='active'){api.advance(1,false);continue;}
    let target=p.x,interact=false,attack=false;
    if(b.hp===0){target=b.x+(p.x<b.x?-65:65);interact=Math.abs(p.x-b.x)<=95;}
    else if(o.phase===2&&!o.consoles.every(Boolean)){
      const indices=[0,1].filter(index=>!o.consoles[index]),index=indices.sort((a,z)=>Math.abs(p.x-[360,1030][a])-Math.abs(p.x-[360,1030][z]))[0];
      target=[360,1030][index];interact=b.phase==='recover'&&Math.abs(p.x-target)<=75;
    }else if(o.phase===3&&o.register==='ground'){target=o.registerX;interact=b.phase==='recover'&&Math.abs(p.x-target)<=70;}
    else {target=b.x+(p.x<b.x?-125:125);attack=b.phase==='recover';}
    if(['tell','attack'].includes(b.phase)&&b.attack){
      const marker=b.attack.markers[0],left=marker.x-marker.w/2-43,right=marker.x+marker.w/2+43;
      if(p.x>left&&p.x<right){const choices=[left,right].filter(x=>x>=32&&x<=1248);target=choices.sort((a,z)=>Math.abs(a-p.x)-Math.abs(z-p.x))[0]??(p.x<640?1240:40);}
    }
    const axis=Math.abs(target-p.x)>8?Math.sign(target-p.x):0;
    api.input(1,'left',axis<0);api.input(1,'right',axis>0);
    const pulse=key=>{api.input(1,key,true);pulses.push(key);};
    if(b.hp>0&&['tell','attack'].includes(b.phase)&&p.y===0&&axis*(b.x-p.x)>0&&Math.abs(p.x-b.x)<115&&!p.stun)pulse('up');
    if(interact&&!p.act&&!p.stun&&p.y<10){api.input(1,'left',false);api.input(1,'right',false);pulse('throw');}
    else if(attack&&!p.act&&!p.stun){
      if(Math.abs(p.x-b.x)<=175&&b.timer>16)pulse('heavy');
      else if(p.energy>=28&&Math.abs(p.x-b.x)<420&&b.timer>16){api.input(1,'left',false);api.input(1,'right',false);pulse('special');}
    }
    api.advance(1,false);
    if(total%60===0&&api.snapshot().phase!=='ended'){assert(api.validCheckpoint(api.checkpoint()),'Public checkpoint '+total);checkpointCount++;}
  }
  const final=api.snapshot();snapshotState(final);
  assert(result?.won&&result.reason==='surrender'&&result.original.nonLethal,'Sam normal did not finish the public non-lethal run');
  assert.deepEqual(copy(result.original.objectiveFlags.consoles),[true,true]);assert.equal(result.original.objectiveFlags.register,'retrieved');
  for(const name of ['consignateur-phase-1','consignateur-phase-2','consignateur-phase-3','consignateur-console-disabled','consignateur-register','consignateur-kneel','consignateur-surrender'])
    assert(captured.has(name),'Public run missed capture '+name);
  for(const pose of bossPoses)assert(states.has(pose),'Public run did not observe '+pose);
  return {total,result,events,checkpointCount,states};
}
(async()=>{
  const fonts=loadFonts(),w=environment(),kit=w.host.StrandOriginalKits,art=w.host.StrandOriginalKitsAssets?.kits?.balise,bossArt=w.host.StrandOriginalBossArt;
  assert(kit?.enabled&&kit.artReady&&art?.ready,'Complete measured Balise art is mandatory');
  assert(w.host.StrandOriginalBosses?.ready&&bossArt?.ready,'Complete measured Consignateur art is mandatory');
  assert(w.host.StrandExtensionRuntime.stages.includes(DIGUE),'Digue is not registered');
  // A discovery pass collects paths only. No image from that pass is accepted or saved.
  w.host.StrandFight.start({canvas:w.surface,p1:'balise',p2:'sam',stage:DIGUE,mode:'local',sound:false,staticScenery:true});w.host.StrandFight.stop();
  w.host.StrandBoss.start({canvas:w.surface,boss:BOSS,p1:'sam',difficulty:'normal',manualClock:true,sound:false,isolated:true,staticScenery:true});w.host.StrandBoss.stop();
  for(const src of requested){const file=pathFor(src);assert(fs.existsSync(file),'Missing requested image '+src);imageSources[src]=sha(file);decoded.set(src,await loadImage(file));}
  strictImages=true;
  for(const pose of poses)for(const side of ['left','right']){const g=art.poses?.[pose]?.[side];assert(g,'Missing Balise '+pose+'/'+side);descriptor(g.src,g,'Balise '+pose+'/'+side);}
  assert.equal(new Set(poses.flatMap(pose=>['left','right'].map(side=>JSON.stringify([art.poses[pose][side].src,art.poses[pose][side].crop])))).size,30,'Each Balise key pose must have its own source/crop');
  for(const prop of ['anchor','ropeHook'])descriptor(art.props[prop]?.src,art.props[prop],'Balise prop '+prop);
  for(const pose of bossPoses)for(const side of ['left','right']){
    const g=bossArt.directionalPoses?.consignateur?.[pose]?.[side];assert(g,'Missing Consignateur '+pose+'/'+side);descriptor(g.src,g,'Consignateur '+pose+'/'+side);
    assert.equal(g.nativeFacing,side==='left'?-1:1,'Directional source orientation');
    assert(Number.isFinite(g.heightRatio)&&g.heightRatio>=.1&&g.heightRatio<=2,'Boss pose ratio');
  }
  assert.equal(new Set(bossPoses.flatMap(pose=>['left','right'].map(side=>JSON.stringify([bossArt.directionalPoses.consignateur[pose][side].src,bossArt.directionalPoses.consignateur[pose][side].crop])))).size,12,'Each Consignateur key pose/direction must have its own source/crop');
  for(const prop of ['console-active','console-inactive','register'])descriptor(bossArt.props[prop],bossArt.propGeometry[prop],'Consignateur prop '+prop);
  fs.mkdirSync(out,{recursive:true});
  w.host.StrandFight.start({canvas:w.surface,p1:'balise',p2:'sam',stage:DIGUE,mode:'local',sound:false,staticScenery:true});
  const match=w.host.__nativeFight.getMatch();
  for(const side of ['right','left']){
    const sheet=board(side);
    for(const [index,pose]of poses.entries()){
      const preparation=prepareBalise(match,pose,side),floor=nativeFrame(w,()=>w.host.__nativeFight.draw(match));
      const proof=inspectPose(w,art.poses[pose][side],{...match.f[0],height:176},'Balise '+pose+' '+side);
      proof.preparation=preparation;proof.panorama=floor;proof.frameSha256=shaBuffer(w.canvas.toBuffer('image/png'));
      boardTile(sheet,w,index,pose,proof);poseChecks.push(proof);
    }
    const file='balise-poses-'+side+'.webp',bytes=sheet.canvas.toBuffer('image/webp',94);fs.writeFileSync(path.join(out,file),bytes);
    snapshots.push({file,width:sheet.width,height:sheet.height,sha256:shaBuffer(bytes),method:'Contact sheet cropped exclusively from actual native Digue frames; prepared in-memory poses',direction:side,poses:15});
  }
  // The received fall drawings are grounded defeats, not normal descending jumps.
  const airborneChecks=[];
  for(const side of ['left','right']){
    const preparation=prepareBalise(match,'jump',side);match.f[0].vy=-8;
    preparation.preparation='Explicit ordinary descending jump in memory, y=70, vy=-8; the upright aerial source must remain jump';
    preparation.fighter=copy(match.f[0]);
    const floor=nativeFrame(w,()=>w.host.__nativeFight.draw(match));
    const proof=inspectPose(w,art.poses.jump[side],{...match.f[0],height:176},'Balise descending jump '+side);
    assert(!w.draws.some(draw=>draw.file===art.poses.fall[side].src),'Grounded defeat image used for ordinary jump descent');
    airborneChecks.push({...proof,preparation,panorama:floor});
  }
  prepareBalise(match,'anchor','right');match.f[0].act.t=30;match.f[0].marker={kind:'baliseAnchor',x:match.f[0].x+66,ttl:210,ownerId:'balise',ownerSide:0,ownerMember:null};
  const anchorFloor=nativeFrame(w,()=>w.host.__nativeFight.draw(match));oneDraw(w,art.props.anchor.src,'Placed anchor');
  record(w,'balise-anchor',{method:'Prepared in-memory anchor recovery at frame 30, live owned marker, TTL 210; actual engine rendering',snapshot:w.host.StrandFight.snapshot(),panorama:anchorFloor});
  prepareBalise(match,'tether','right');match.f[1].x=match.f[0].x+90;match.f[1].hp=90;match.f[1].stun=18;
  const tetherFloor=nativeFrame(w,()=>w.host.__nativeFight.draw(match));oneDraw(w,art.props.ropeHook.src,'Active rope loop');
  record(w,'balise-tether',{method:'Prepared in-memory tether active frame 19, grounded target at 90 pixels, 90 HP and 18 stun; actual engine rendering',snapshot:w.host.StrandFight.snapshot(),panorama:tetherFloor});
  w.host.StrandFight.stop();
  const run=publicSamRun(w),current=w.host.__nativeBoss.getCurrent(),finalState=copy(current.s),bossSheet=bossBoard();
  // These twelve extra direction checks reuse states observed in the public run.
  // Only facing is prepared; they do not count as further public encounters.
  for(const pose of bossPoses)for(const side of ['left','right']){
    current.s=copy(run.states.get(pose));current.s.boss.face=side==='left'?-1:1;
    const floor=nativeFrame(w,()=>w.host.StrandBoss.draw()),g=bossArt.directionalPoses.consignateur[pose][side];
    const proof=inspectPose(w,g,{x:current.s.boss.x,y:0,local:true,height:194},'Consignateur '+pose+' '+side);
    proof.preparation='State observed in the public Sam run; only boss facing is changed in memory for directional inspection';
    proof.observedTick=current.s.tick;proof.panorama=floor;bossTile(bossSheet,w,bossPoseChecks.length,pose,side,proof);bossPoseChecks.push(proof);
  }
  const bossBoardFile='consignateur-poses-directions.webp',bossBoardBytes=bossSheet.canvas.toBuffer('image/webp',94);
  fs.writeFileSync(path.join(out,bossBoardFile),bossBoardBytes);
  snapshots.push({file:bossBoardFile,width:bossSheet.width,height:bossSheet.height,sha256:shaBuffer(bossBoardBytes),method:'Twelve actual native renders; public observed states with only facing prepared in memory',poses:12});
  current.s=finalState;w.host.StrandBoss.stop();
  for(const [src,digest]of Object.entries(imageSources))assert.equal(sha(pathFor(src)),digest,'Source image modified: '+src);
  for(const [file,digest]of Object.entries(sourceSha256))assert.equal(sha(path.join(root,file)),digest,'Engine/source file modified: '+file);
  const report={date:'2026-11-27',passed:true,nativeCanvas:true,nativeCanvasVersion:canvasPackage.version,browser:false,htmlLayoutRendered:false,captureEncoding:'WebP quality 94 at full canvas size; native source PNGs unchanged',
    method:'Actual game rendering with decoded received PNG/WebP sources and system fonts. All Balise pose states are explicit in-memory preparations. Sam normal boss progression uses only public input/advance APIs.',
    floors:{worldY:FLOOR,duelCameraOffsetY:10,note:'The inherited duel camera maps the world floor to screen Y 598; the Boss renderer uses screen Y 588.'},
    fonts,scriptOrder:files,balisePoseCount:poseChecks.length,consignateurDirectionalCount:bossPoseChecks.length,poseChecks,bossPoseChecks,airborneChecks,
    publicBossRun:{player:'sam',difficulty:'normal',scenarioSpeed:1,totalTicks:run.total,checkpointCount:run.checkpointCount,transitions:run.events,result:run.result},
    captures:snapshots,imageSources,sourceSha256};
  fs.writeFileSync(path.join(out,'first-playable-native.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed:true,balisePoses:poseChecks.length,bossDirections:bossPoseChecks.length,publicBossWon:run.result.won,captures:snapshots.length,decoded:decoded.size,fontFamilies:fonts.families,output:out},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
