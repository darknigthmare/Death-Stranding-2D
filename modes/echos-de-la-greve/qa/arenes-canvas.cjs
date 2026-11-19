// Exercise the unmodified game renderer with native Canvas when Chromium is unavailable.
// This checks rendering and simulation only, not browser menus or canonical visual fidelity.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createCanvas,loadImage} = require('@napi-rs/canvas');
const root = path.resolve(__dirname,'..');
const output = process.env.ARENA_SCREENSHOTS || path.join(require('node:os').tmpdir(),'echos-stage-renders');
const requested = process.argv.find(a=>a.startsWith('--stages='))?.slice(9).split(',');
const groups = ['skyplates','distants','midgrounds','floors','foregrounds'];
const speeds = [.14,.27,.43,.62,.8];
const script = name => fs.readFileSync(path.join(root,name),'utf8');
const catalog = {window:{},structuredClone};
vm.runInNewContext(script('content.js'),catalog);
vm.runInNewContext(script('assets.js'),catalog);
const assets = catalog.window.StrandAssets;
const ids = requested || Object.keys(catalog.window.StrandContent.stages);

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const results=[];
  for(const id of ids){
    const layers=groups.map(group=>{
      assert.ok(assets[group]?.[id],id+' missing '+group);
      return assets[group][id];
    });
    const files=new Set([...layers,assets.stages[id]]);
    for(const fighter of ['higgs','fragile']) {
      for(const kind of ['fighters','actions','steps','hits','jumps','finishers']) {
        const f=assets[kind]?.[fighter]; if(typeof f==='string') files.add(f);
      }
    }
    files.add(assets.props.goldImprint);
    const decoded=new Map();
    for(const file of files) decoded.set(file,await loadImage(path.join(root,file)));
    const draws=[];
    const nativeCanvas=createCanvas(160,90);
    const nativeContext=nativeCanvas.getContext('2d');
    nativeContext.scale(.125,.125);
    const ctx=new Proxy(nativeContext,{
      get(target,key){
        if(key==='drawImage') return (image,...args)=>{
          if(image.src?.startsWith('assets/stages/')) draws.push({file:image.src,rect:args.length===8?args.slice(4):args});
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
      return {rects:new Map(draws.map(d=>[d.file,d.rect])),order:draws.map(d=>d.file),state:engine.snapshot()};
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
    }
    let cases=0;
    for(const mode of ['local','training']){
      const normal=[];
      for(const reducedEffects of [false,true]){
        engine.start({canvas,p1:'higgs',p2:'fragile',stage:id,mode,reducedEffects,sound:false,seed:8172});
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
    results.push({stage:id,cases,layers,passed:true});
    console.log('OK '+id+' — '+cases+' cases, actual renderer, five layers, floor and parallax.');
  }
  const report={date:'2026-11-19',renderer:'@napi-rs/canvas; unmodified fight.js',browser_verified:false,stages:results.length,cases:results.reduce((sum,r)=>sum+r.cases,0),results};
  fs.writeFileSync(path.join(output,'validation.json'),JSON.stringify(report,null,2)+'\n');
  console.log('PASS '+report.stages+' stages / '+report.cases+' rendering cases. Browser interface not exercised.');
})().catch(error=>{console.error(error);process.exitCode=1;});
