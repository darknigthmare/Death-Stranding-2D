/* Native Canvas proof of the real linked renderer and visual rollback.
 * Sources are decoded unchanged; only review WebPs are exported. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createHash}=require('node:crypto'),{createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),output=process.env.TRANSITION_SCREENSHOTS||path.join(require('node:os').tmpdir(),'echos-linked-renders');
const source=file=>fs.readFileSync(path.join(root,file),'utf8'),clone=x=>JSON.parse(JSON.stringify(x)),sha=x=>createHash('sha256').update(x).digest('hex');
const catalog={window:{}};for(const name of ['content.js','asset-geometry-20261124.js','assets.js'])vm.runInNewContext(source(name),catalog);
const art=catalog.window.StrandAssets,stageGroups=['skyplates','distants','midgrounds','floors','foregrounds'],zones=['terminal','terminal-hangar'],fighters=['higgs','fragile'];
const files=new Set(zones.flatMap(zone=>['stages',...stageGroups].map(group=>art[group][zone])));
for(const id of fighters){
  for(const group of ['fighters','actions','steps','hits','jumps','finishers']){
    const value=art[group]?.[id];if(typeof value==='string')files.add(value);else if(value)Object.values(value).forEach(x=>files.add(x));
  }
  Object.values(art.poses?.[id]||{}).forEach(x=>files.add(x));
  Object.values(art.wardrobe?.[id]?.atelier?.poses||{}).forEach(x=>files.add(x));
}
files.add(art.projectiles.higgs);files.add(art.props.goldImprint);
(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const decoded=new Map();for(const file of files)decoded.set(file,await loadImage(path.join(root,file)));
  const report={date:new Date().toISOString(),renderer:'@napi-rs/canvas; actual fight.js',browser:false,cases:[],captures:[],visualRestores:0};
  for(const staticScenery of [false,true])for(const side of [1,-1]){
    const native=createCanvas(1280,720),ctx=native.getContext('2d'),draws=[];
    const traced=new Proxy(ctx,{get(target,key){
      if(key==='drawImage')return (image,...args)=>{draws.push({file:image.src,rect:args.length===8?args.slice(4):args});return target.drawImage(image.drawable,...args);};
      const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;
    },set(target,key,value){Reflect.set(target,key,value,target);return true;}});
    const host={...catalog.window,requestAnimationFrame:()=>1,cancelAnimationFrame(){}};
    class Image{set src(file){this._src=file;this.drawable=decoded.get(file);assert(this.drawable,'Source decoded '+file);this.complete=true;this.naturalWidth=this.drawable.width;this.naturalHeight=this.drawable.height;}get src(){return this._src;}}
    vm.runInNewContext(source('fight.js'),{window:host,Image,structuredClone});
    const engine=host.StrandFight,point=()=>clone(engine.network.checkpoint());
    const config={canvas:{getContext:()=>traced},p1:fighters[0],p2:fighters[1],stage:'terminal-linked',mode:'local',clock:'network',seed:4192,sound:false};
    engine.start(config);
    const step=(inputs=[])=>engine.network.advance(inputs,true);
    function capture(label,filename){
      const before=point(),zone=before.state.link.zone;draws.length=0;engine.network.draw();assert.deepEqual(point(),before,'Drawing does not change simulation');
      const expected=stageGroups.map(group=>art[group][zone]),layers=draws.filter(draw=>zones.some(id=>stageGroups.some(group=>art[group][id]===draw.file)));
      assert.deepEqual(layers.map(x=>x.file),expected,'Exactly the active zone layers are drawn');
      for(const draw of layers){const image=decoded.get(draw.file);assert(Math.abs(draw.rect[2]/draw.rect[3]-image.width/image.height)<.00001,'Native ratio');}
      const floor=layers[3],anchor=art.stageGeometry[zone].floor.anchorY;assert(Math.abs(floor.rect[1]+floor.rect[3]*anchor-588)<.01,'Physical floor anchor');
      const rgba=ctx.getImageData(0,0,1280,720).data;let alpha=255;for(let i=3;i<rgba.length;i+=4)alpha=Math.min(alpha,rgba[i]);assert.equal(alpha,255,'Opaque final composite');
      const entry={label,side,staticScenery,phase:before.state.phase,tick:before.state.tick,zone,
        checkpointSha256:sha(JSON.stringify(before)),rgbaSha256:sha(rgba),layers:expected,compositeMinAlpha:alpha};
      if(filename){fs.writeFileSync(path.join(output,filename),native.toBuffer('image/webp',88));entry.capture=filename;entry.captureSha256=sha(fs.readFileSync(path.join(output,filename)));report.captures.push(filename);}
      report.cases.push(entry);return entry;
    }
    for(let i=0;i<72;i++)step();
    const direction=side===1?'right':'left',attacker=side===1?1:2;
    step([[1,direction,true],[2,direction,true]]);
    let safety=0;while((Math.abs(engine.snapshot().fighters[0].x-engine.snapshot().fighters[1].x)>60||engine.snapshot().fighters[2-attacker].x*side<(side===1?1231:-49))&&safety++<330)step();
    step([[1,direction,false],[2,direction,false]]);
    if(staticScenery)engine.setStaticScenery(true); // Freeze an actual, nonzero edge camera.
    const beforePoint=point(),before=capture('quay-before',!staticScenery&&side===1?'terminal-linked-right-quay.webp':null);
    step([[attacker,'heavy',true],[attacker,'heavy',false]]);
    safety=0;while(engine.snapshot().phase!=='transition'&&safety++<50)step();assert.equal(engine.snapshot().phase,'transition');
    const passagePoint=point(),passage=capture('passage',!staticScenery&&side===1?'terminal-linked-right-passage.webp':null);
    for(let i=0;i<36;i++)step();assert.equal(engine.snapshot().link.zone,'terminal-hangar');
    const arrivedPoint=point(),arrival=capture('hangar-arrival',!staticScenery?'terminal-linked-'+(side===1?'right':'left')+'-hangar.webp':null);
    for(const [saved,reference,label]of [[beforePoint,before,'restore-quay'],[passagePoint,passage,'restore-passage'],[arrivedPoint,arrival,'restore-hangar']]){
      assert(engine.network.restore(saved));const restored=capture(label);assert.equal(restored.rgbaSha256,reference.rgbaSha256,'Pixel-identical visual rollback '+label);report.visualRestores++;
    }
    if(staticScenery){
      engine.start({...config,staticScenery:true,preserveStaticScenery:true});assert(engine.network.restore(arrivedPoint));
      const rebuilt=capture('network-rebuild-held-scenery');assert.equal(rebuilt.rgbaSha256,arrival.rgbaSha256,'Full network restart retains held local composition in the arrived zone');report.visualRestores++;
    }
    engine.stop();
  }
  report.sourceSha256=Object.fromEntries(['fight.js','content.js','assets.js','qa/transitions-canvas.cjs'].map(file=>[file,sha(source(file))]));
  report.images=zones.flatMap(zone=>['stages',...stageGroups].map(group=>{const file=art[group][zone],image=decoded.get(file);return {zone,group,file,width:image.width,height:image.height,sha256:sha(fs.readFileSync(path.join(root,file)))};}));
  report.passed=true;fs.writeFileSync(path.join(output,'validation.json'),JSON.stringify(report,null,2)+'\n');
  console.log('PASS '+report.cases.length+' native linked frames, '+report.visualRestores+' pixel-identical visual restores, '+report.captures.length+' review WebPs; no browser.');
})().catch(error=>{console.error(error);process.exitCode=1;});
