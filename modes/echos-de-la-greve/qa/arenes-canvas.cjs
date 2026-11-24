// Exercise the actual game renderer with native Canvas when Chromium is unavailable.
// This checks rendering and simulation only, not browser menus or canonical visual fidelity.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createHash} = require('node:crypto');
const {createCanvas,loadImage} = require('@napi-rs/canvas');
const root = path.resolve(__dirname,'..');
const output = process.env.ARENA_SCREENSHOTS || path.join(require('node:os').tmpdir(),'echos-stage-renders');
const requested = process.argv.find(a=>a.startsWith('--stages='))?.slice(9).split(',');
const groups = ['skyplates','distants','midgrounds','floors','foregrounds'];
const speeds = [.14,.27,.43,.62,.8];
// These exterior joins previously exposed a strip of sky above the floor.
const joinRegressions = new Set(['shore','terminal','battlefield','mountain-pass','mule-camp-dry','port-knot','incinerator']);
const script = name => fs.readFileSync(path.join(root,name),'utf8');
const catalog = {window:{},structuredClone};
vm.runInNewContext(script('content.js'),catalog);
vm.runInNewContext(script('asset-geometry-20261124.js'),catalog);
vm.runInNewContext(script('assets.js'),catalog);
const assets = catalog.window.StrandAssets;
const ids = requested || Object.keys(catalog.window.StrandContent.stages);
const scenarioFighters = ['higgs','fragile'];

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const results=[];
  for(const id of ids){
    const layers=groups.map(group=>{
      assert.ok(assets[group]?.[id],id+' missing '+group);
      return assets[group][id];
    });
    const files=new Set([...layers,assets.stages[id]]);
    for(const fighter of scenarioFighters) {
      for(const kind of ['fighters','actions','steps','hits','jumps','finishers']) {
        const f=assets[kind]?.[fighter];
        if(typeof f==='string') files.add(f);
        else if(f && typeof f==='object') Object.values(f).forEach(file=>files.add(file));
      }
      Object.values(assets.poses?.[fighter] || {}).forEach(file=>files.add(file));
      Object.values(assets.wardrobe?.[fighter]?.atelier?.poses || {}).forEach(file=>files.add(file));
    }
    for(const [kind,file] of Object.entries(assets.projectiles || {})) {
      const owner=({recall:'cliff',gate:'diehardman',memory:'heartman'})[kind] || kind;
      if(scenarioFighters.includes(owner)) files.add(file);
    }
    files.add(assets.props.goldImprint);
    const decoded=new Map();
    for(const file of files) decoded.set(file,await loadImage(path.join(root,file)));
    const draws=[];
    const joinCanvas=createCanvas(1280,4),joinContext=joinCanvas.getContext('2d');
    let joinAlphaMin=255;
    const nativeCanvas=createCanvas(160,90);
    const nativeContext=nativeCanvas.getContext('2d');
    nativeContext.scale(.125,.125);
    const ctx=new Proxy(nativeContext,{
      get(target,key){
        if(key==='drawImage') return (image,...args)=>{
          if(image.src?.startsWith('assets/stages/')) draws.push({file:image.src,rect:args.length===8?args.slice(4):args,alpha:target.globalAlpha});
          return target.drawImage(image.drawable || image,...args);
        };
        const value=Reflect.get(target,key,target);
        return typeof value==='function'?value.bind(target):value;
      },
      set(target,key,value){Reflect.set(target,key,value,target);return true;}
    });
    const canvas={getContext:()=>ctx};
    let time=0,next=0;
    const pending=new Map();
    const host={
      StrandContent:catalog.window.StrandContent,StrandAssets:assets,
      requestAnimationFrame(fn){pending.set(++next,fn);return next;},
      cancelAnimationFrame(key){pending.delete(key);}
    };
    const context={window:host,structuredClone,Image:class {
      set src(file){
        this._src=file;this.drawable=decoded.get(file);
        assert.ok(this.drawable,'Missing decoded source '+file);
        this.complete=true;this.naturalWidth=this.drawable.width;this.naturalHeight=this.drawable.height;
      }
      get src(){return this._src;}
    }};
    vm.runInNewContext(script('fight.js'),context);
    const engine=host.StrandFight;
    function advance(count){
      for(let i=0;i<count;i++){
        time+=1000/60+.000001;
        const frames=[...pending.values()];pending.clear();draws.length=0;
        for(const frame of frames)frame(time);
      }
      return {rects:new Map(draws.map(d=>[d.file,d.rect])),alphas:new Map(draws.map(d=>[d.file,d.alpha])),order:draws.map(d=>d.file),state:engine.snapshot()};
    }
    function validateFrame(frame,label){
      assert.deepEqual(frame.order,layers,'Layer order '+label);
      for(const file of layers){
        const [x,,w,h]=frame.rects.get(file),im=decoded.get(file);
        assert(x<=0 && x+w>=1280,'Horizontal coverage '+label+' '+file);
        assert(Math.abs(w/h-im.width/im.height)<.00001,'Aspect ratio '+label+' '+file);
      }
      const [,y,,h]=frame.rects.get(layers[3]);
      const anchor=assets.stageGeometry[id]?.floor?.anchorY ?? .3;
      assert(Math.abs(y+h*anchor-588)<.01,'Floor contact '+label);
      assert(y+h>=720,'Floor bottom '+label);
      if(joinRegressions.has(id)){
        // Replay the actual two background draw calls onto a transparent band.
        // Their pixels must cover y=584..587, immediately above the floor.
        joinContext.setTransform(1,0,0,1,0,0);joinContext.clearRect(0,0,1280,4);
        joinContext.setTransform(1,0,0,1,0,-584);
        for(const file of layers.slice(1,3)){
          joinContext.globalAlpha=frame.alphas.get(file);
          joinContext.drawImage(decoded.get(file),...frame.rects.get(file));
        }
        const pixels=joinContext.getImageData(0,0,1280,4).data;
        let minimum=255;
        for(let i=3;i<pixels.length;i+=4)minimum=Math.min(minimum,pixels[i]);
        joinAlphaMin=Math.min(joinAlphaMin,minimum);
        assert(minimum>=224,'Background must meet the floor without a sky strip '+label+' (minimum alpha '+minimum+')');
      }
    }
    let cases=0;
    for(const mode of ['local','training']){
      const normal=[];
      for(const reducedEffects of [false,true]){
        engine.start({canvas,p1:scenarioFighters[0],p2:scenarioFighters[1],stage:id,mode,reducedEffects,sound:false,seed:8172});
        let before=advance(78);validateFrame(before,id);
        for(const direction of [1,-1]){
          const key=direction===1?'right':'left';
          engine.input(1,key,true);if(mode==='local')engine.input(2,key,true);
          advance(32);
          engine.input(1,key,false);if(mode==='local')engine.input(2,key,false);
          const after=advance(22),label=[id,mode,direction,reducedEffects].join('/');
          validateFrame(after,label);
          for(let player=0;player<(mode==='local'?2:1);player++)assert((after.state.fighters[player].x-before.state.fighters[player].x)*direction>20,'Movement '+label);
          const shifts=layers.map(file=>(before.rects.get(file)[0]-after.rects.get(file)[0])*direction);
          assert(shifts[0]>0,'Sky motion '+label);
          for(let i=1;i<shifts.length;i++){
            assert(shifts[i]>shifts[i-1],'Parallax order '+label);
            assert(Math.abs(shifts[i]/shifts[0]-speeds[i]/speeds[0])<.02,'Parallax ratio '+label);
          }
          if(reducedEffects){
            const expected=normal[direction===1?0:1];
            for(let i=0;i<shifts.length;i++)assert(Math.abs(shifts[i]/expected[i]-.2)<.005,'Reduced motion '+label);
          }else normal.push(shifts);
          if(mode==='local'&&!reducedEffects){
            nativeCanvas.width=1280;nativeCanvas.height=720;
            const frame=[...pending.values()];pending.clear();
            for(const draw of frame)draw(time);
            fs.writeFileSync(path.join(output,id+(direction===1?'-right':'-left')+'.webp'),nativeCanvas.toBuffer('image/webp',88));
            nativeCanvas.width=160;nativeCanvas.height=90;nativeContext.scale(.125,.125);
          }
          before=after;cases++;
        }
        engine.stop();
      }
    }
    results.push({stage:id,cases,layers,...(joinRegressions.has(id)?{background_join_min_alpha:joinAlphaMin}:{}),passed:true});
    console.log('OK '+id+' — '+cases+' cases, actual renderer, five layers, floor and parallax.');
  }
  const source_sha256=Object.fromEntries(['content.js','asset-geometry-20261124.js','assets.js','fight.js'].map(file=>[
    file,createHash('sha256').update(script(file)).digest('hex')
  ]));
  const places=new Set(ids.map(id=>catalog.window.StrandContent.arenas[id].variantOf || id));
  const report={date:'2026-11-24',renderer:'@napi-rs/canvas; actual fight.js',browser_verified:false,
    locations:places.size,stages:results.length,cases:results.reduce((sum,r)=>sum+r.cases,0),source_sha256,results};
  fs.writeFileSync(path.join(output,'validation.json'),JSON.stringify(report,null,2)+'\n');
  console.log('PASS '+report.stages+' stages / '+report.cases+' rendering cases. Browser interface not exercised.');
})().catch(error=>{console.error(error);process.exitCode=1;});
