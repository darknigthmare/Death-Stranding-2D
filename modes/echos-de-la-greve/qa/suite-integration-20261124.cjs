/* Portable integration checks for the native 20261124 assets.
 * Runs the real fight.js renderer against an instrumented Canvas, not a browser
 * or native pixel renderer. Native dimensions come from decoded production
 * manifests; legacy-only images use explicit test dimensions.
 */
'use strict';
function runSuiteIntegration(options) {
  const {source,dimensions,fileExists,baselineSource}=options;
  const check=(condition,message)=>{if(!condition)throw new Error(message);};
  const equal=(a,b,message)=>check(JSON.stringify(a)===JSON.stringify(b),message);
  const clone=typeof structuredClone==='function'?structuredClone:function copy(v){
    if(v===null||typeof v!=='object')return v;
    if(Array.isArray(v))return v.map(copy);
    return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,copy(x)]));
  };
  const report={date:'2026-11-24',renderer:'actual fight.js with instrumented Canvas methods',
    native_canvas_executed:false,browser_executed:false,pixels_decoded_in_this_test:false,
    native_dimension_source:'qa/native-image-dimensions-20261124.cjs (decoded production manifests)',
    legacy_dimensions:'1536x1024 test placeholder; legacy visual proportions are not certified by this test',
    checks:[],poses:[],stage_cases:[],simulation_regressions:[]};
  function catalog(read=source) {
    const host={};
    for(const file of ['content.js','asset-geometry-20261124.js','assets.js'])new Function('window',read(file))(host);
    return host;
  }
  const host=catalog(),assets=host.StrandAssets,content=host.StrandContent;
  const allFiles=new Set();
  function collect(value){
    if(typeof value==='string'&&value.startsWith('assets/'))allFiles.add(value);
    else if(value&&typeof value==='object')Object.values(value).forEach(collect);
  }
  collect(assets);
  for(const file of allFiles)check(fileExists(file),'Catalog file missing: '+file);
  check(Object.keys(content.fighters).length===8,'The eight existing playable fighters remain available');
  check(Object.keys(content.stages).length===13,'Thirteen stage variants');
  check(!assets.wardrobe.mama.atelier.poses,'Atelier must use native base PNGs');
  check(assets.wardrobe.mama.viaduc.poses.stance.endsWith('.webp'),'Viaduc keeps its own wardrobe source');
  report.catalog_paths=allFiles.size;
  const nativePoses=new Map();
  for(const [id,poses] of Object.entries(assets.poses))for(const [pose,file] of Object.entries(poses)){
    const geometry=assets.generatedGeometry.fighters[id]?.[pose],meta=dimensions[file];
    check(meta,'Native dimensions missing: '+file);
    check(geometry,'Native geometry missing: '+id+'/'+pose);
    const [x,y,w,h]=geometry.crop;
    check([x,y,w,h,geometry.anchorX,geometry.baselineY,geometry.heightRatio].every(Number.isFinite),'Finite geometry: '+file);
    check(x>=0&&y>=0&&w>0&&h>0&&x+w<=meta.width&&y+h<=meta.height,'Native crop lies inside source: '+file);
    check(geometry.anchorX>=0&&geometry.anchorX<=1&&geometry.baselineY>0&&geometry.baselineY<=1,'Valid image anchors: '+file);
    nativePoses.set(file,{id,pose,geometry});
  }
  report.native_pose_crops=nativePoses.size;
  const repainted=['mama','diehardman',...(assets.fighters.higgs.endsWith('.png')?['higgs']:[])];
  function harness({unavailable=()=>false,read=source}={}){
    const host=catalog(read),seen=new Set(),calls=[],stageDraws=[],stack=[];
    let facing=1,next=0,time=0,network=true;
    const pending=new Map();
    host.requestAnimationFrame=fn=>{pending.set(++next,fn);return next;};
    host.cancelAnimationFrame=id=>pending.delete(id);
    const ctx=new Proxy({
      createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),
      save(){stack.push(facing);},restore(){facing=stack.pop();},
      scale(x){facing*=Math.sign(x);},
      drawImage(image,...args){
        check(args.every(Number.isFinite),'Finite draw arguments: '+image.src);
        seen.add(image.src+'/'+facing);
        if(image.src.startsWith('assets/stages/'))stageDraws.push({file:image.src,rect:args.length===8?args.slice(4):args});
        const measured=read===source?nativePoses.get(image.src):null;
        if(!measured)return;
        check(args.length===8,'Native pose needs measured source crop: '+image.src);
        const [x,y,w,h,dx,dy,dw,dh]=args,g=measured.geometry;
        equal([x,y,w,h],g.crop,'Measured crop routed: '+image.src);
        check(Math.abs(w/h-dw/dh)<1e-9,'Source proportions preserved: '+image.src);
        check(Math.abs(dy+dh*g.baselineY)<1e-7,'Foot baseline preserved: '+image.src);
        calls.push({file:image.src,facing,pose:measured.pose});
      }
    },{get:(object,key)=>key in object?object[key]:()=>{}});
    class ImageStub{
      set src(file){
        check(fileExists(file),'Loaded image missing: '+file);
        this._src=file;this.complete=!unavailable(file);
        const meta=dimensions[file]||{width:1536,height:1024};
        this.naturalWidth=this.complete?meta.width:0;this.naturalHeight=this.complete?meta.height:0;
      }
      get src(){return this._src;}
    }
    new Function('window','Image','structuredClone',read('fight.js'))(host,ImageStub,clone);
    const engine=host.StrandFight,canvas={getContext:()=>ctx};
    function step(count,inputs=[]){
      for(let frame=0;frame<count;frame++){
        stageDraws.length=0;
        if(network){engine.network.advance(frame===0?inputs:[],true);engine.network.draw();}
        else {
          if(frame===0)for(const [player,key,down]of inputs)engine.input(player,key,down);
          time+=1000/60+.000001;
          const callbacks=[...pending.values()];pending.clear();
          for(const fn of callbacks)fn(time);
        }
      }
    }
    function start(id='mama',side=1,extra={}){
      network=(extra.mode||'local')==='local';
      const config={canvas,p1:side===1?id:'sam',p2:side===2?id:'sam',stage:'shore',mode:'local',
        clock:'network',sound:false,seed:2456,...extra};
      if(!network)delete config.clock;
      engine.start(config);step(75);seen.clear();calls.length=0;
    }
    return {engine,seen,calls,stageDraws,start,step,assets:host.StrandAssets};
  }
  const tap=(side,key)=>[[side,key,true],[side,key,false]];
  const special=(side,direction)=>direction?[[side,direction,true],...tap(side,'special'),[side,direction,false]]:tap(side,'special');
  const current=harness();
  for(const id of repainted)for(const side of [1,2]){
    const facing=side===1?1:-1,forward=side===1?'right':'left';
    current.start(id,side);current.step(1);
    current.step(5,[[side,'guard',true]]);
    current.step(5,[[side,'guard',false],[side,'down',true]]);
    current.step(46,[[side,'down',false],...tap(side,'up')]);
    current.step(26,[[side,forward,true]]);
    current.step(30,[[side,forward,false],...tap(side,'light')]);
    const point=current.engine.network.checkpoint();
    const target=point.state.f[side-1],opponent=point.state.f[2-side];
    target.x=640;target.y=0;target.vy=0;target.grounded=true;target.act=null;target.keys={};target.queue=[];target.guard=false;target.stun=0;
    opponent.x=640+facing*58;opponent.y=0;opponent.vy=0;opponent.grounded=true;opponent.face=-facing;opponent.act=null;opponent.keys={};opponent.queue=[];opponent.stun=0;
    current.engine.network.restore(point);
    current.step(20,tap(3-side,'light'));
    check(current.engine.snapshot().fighters[side-1].hp<100,id+' receives a real hit');
    const poses=['stance','action','step','hit','guard','crouch','rise','apex','fall'];
    for(const pose of poses){
      const file=assets.poses[id][pose];
      check(current.seen.has(file+'/'+facing),'Pose not drawn through input flow: '+id+'/'+pose+' side '+side);
    }
    report.poses.push({fighter:id,side,poses,real_hit:true});
  }
  for(const id of repainted.filter(id=>assets.poses[id].jump))for(const side of [1,2]){
    const suppressed=new Set(['rise','apex','fall'].map(p=>assets.poses[id][p]));
    const fallback=harness({unavailable:file=>suppressed.has(file)});
    fallback.start(id,side);fallback.step(46,tap(side,'up'));
    check(fallback.seen.has(assets.poses[id].jump+'/'+(side===1?1:-1)),'Native jump fallback: '+id);
    check(fallback.engine.snapshot().fighters[side-1].y===0,'Jump fallback lands: '+id);
    fallback.engine.stop();
  }
  report.checks.push('Repainted fighter poses drawn on both sides, real hit, preserved crops, ratios and boot baselines; native jump fallbacks');
  current.start('mama',1,{outfits:['viaduc',null]});
  current.step(4,[[1,'guard',true]]);current.step(4,[[1,'guard',false],[1,'down',true]]);current.step(46,[[1,'down',false],...tap(1,'up')]);
  for(const pose of ['guard','crouch','rise','apex','fall'])check(current.seen.has(assets.wardrobe.mama.viaduc.poses[pose]+'/1'),'Viaduc wardrobe route: '+pose);
  check(!current.calls.some(c=>c.file.includes('/mama/atelier/')),'Viaduc must not use Atelier PNG geometry');
  report.checks.push('Separate Mama Viaduc wardrobe remains independent');
  if(repainted.includes('higgs')){
    current.start('higgs',1);current.step(55,special(1,'left'));
    check(current.calls.some(c=>c.file===assets.fighters.higgs),'Higgs feint echo uses native pose crop');
    report.checks.push('Higgs feint echo retains native PNG crop and scale');
  }
  const stageGroups=['skyplates','distants','midgrounds','floors','foregrounds'],speeds=[.14,.27,.43,.62,.8];
  for(const stage of ['port-knot','incinerator'])for(const mode of ['local','training']){
    const normal=[];
    for(const reducedEffects of [false,true]){
      current.start('higgs',1,{p2:'fragile',stage,mode,reducedEffects});current.step(1);
      let before=current.stageDraws.map(x=>({file:x.file,rect:[...x.rect]}));
      for(const direction of [1,-1]){
        const key=direction===1?'right':'left';
        current.step(32,[[1,key,true],...(mode==='local'?[[2,key,true]]:[])]);
        current.step(22,[[1,key,false],...(mode==='local'?[[2,key,false]]:[])]);
        const after=current.stageDraws.map(x=>({file:x.file,rect:[...x.rect]}));
        const files=stageGroups.map(group=>assets[group][stage]);
        equal(after.map(x=>x.file),files,'Stage layer order: '+stage);
        const shifts=[];
        for(let i=0;i<files.length;i++){
          const [x,y,w,h]=after[i].rect,meta=dimensions[files[i]];
          check(x<=0&&x+w>=1280,'Stage covers width: '+files[i]);
          check(Math.abs(w/h-meta.width/meta.height)<1e-9,'Stage native aspect ratio: '+files[i]);
          shifts.push((before[i].rect[0]-x)*direction);
        }
        const [,floorY,,floorH]=after[3].rect;
        check(Math.abs(floorY+floorH*assets.stageGeometry[stage].floor.anchorY-588)<.01,'Native floor contact: '+stage);
        check(floorY+floorH>=720,'Floor reaches bottom: '+stage);
        check(shifts[0]>0,'Sky parallax moves: '+stage);
        for(let i=1;i<shifts.length;i++)check(shifts[i]>shifts[i-1]&&Math.abs(shifts[i]/shifts[0]-speeds[i]/speeds[0])<.02,'Ordered parallax: '+stage);
        if(reducedEffects)for(let i=0;i<shifts.length;i++)check(Math.abs(shifts[i]/normal[direction===1?0:1][i]-.2)<.005,'Reduced motion factor: '+stage);
        else normal.push(shifts);
        report.stage_cases.push({stage,mode,direction,reducedEffects,layers:5,passed:true});
        before=after;
      }
    }
  }
  report.checks.push('Two new stages: all five actual draw calls, both directions, local/training, reduced motion, floor contact and native aspect ratios');
  if(baselineSource){
    const prior=harness({read:baselineSource});
    for(const id of Object.keys(content.fighters)){
      current.start(id,1);prior.start(id,1);
      const sequence=[[4,[[1,'guard',true]]],[4,[[1,'guard',false],[1,'down',true]]],
        [46,[[1,'down',false],...tap(1,'up')]],[24,[[1,'right',true]]],
        [35,[[1,'right',false],...tap(1,'light')]],[45,tap(1,'heavy')],
        [60,special(1)],[60,special(1,'right')],[60,special(1,'left')]];
      for(const [count,inputs]of sequence){
        current.step(count,inputs);prior.step(count,inputs);
        equal(current.engine.network.checkpoint(),prior.engine.network.checkpoint(),'Simulation changed against prior published commit: '+id);
      }
      report.simulation_regressions.push({fighter:id,checkpoints:sequence.length,identical:true});
    }
    prior.engine.stop();
    report.checks.push('Eight fighters retain identical deterministic checkpoints against the previously published runtime');
  }
  const absent=harness({unavailable:file=>nativePoses.has(file)});
  for(const id of repainted){
    current.start(id);absent.start(id);
    for(const [count,inputs]of [[46,tap(1,'up')],[60,special(1)],[35,tap(1,'heavy')]]){
      current.step(count,inputs);absent.step(count,inputs);
      equal(current.engine.network.checkpoint(),absent.engine.network.checkpoint(),'Undecoded native art changes simulation: '+id);
    }
  }
  absent.engine.stop();current.engine.stop();
  report.checks.push('Unavailable native poses leave deterministic simulation unchanged');
  report.passed=true;
  return report;
}
module.exports={runSuiteIntegration};
if(typeof require==='function'&&require.main===module){
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
  const root=path.resolve(__dirname,'..'),source=file=>fs.readFileSync(path.join(root,file),'utf8');
  const dimensions=require('./native-image-dimensions-20261124.cjs');
  const report=runSuiteIntegration({source,dimensions,fileExists:file=>fs.existsSync(path.join(root,file))});
  report.source_sha256=Object.fromEntries(['content.js','assets.js','asset-geometry-20261124.js','fight.js'].map(file=>[file,crypto.createHash('sha256').update(source(file)).digest('hex')]));
  console.log(JSON.stringify(report,null,2));
}
