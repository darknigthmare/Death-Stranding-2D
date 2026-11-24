// Verify real production-image routing and unchanged simulation. This does not
// certify canonical visual fidelity, which requires official reference review.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sharp = require('sharp');
const root = path.resolve(__dirname,'..');
const source = file => fs.readFileSync(path.join(root,file),'utf8');
const generatedFiles = new Set(), dimensions = new Map(), visibleBounds = new Map();
const fighters = ['sam','fragile','higgs','cliff','mule','diehardman','heartman'];
const phases = ['guard','crouch','rise','apex','fall'];
const shotKinds = ['sam','higgs','cliff','recall','gate','heartman','memory'];

function catalog() {
  const context = {window:{},structuredClone};
  vm.runInNewContext(source('content.js'),context);
  vm.runInNewContext(source('asset-geometry-20261124.js'),context);
  vm.runInNewContext(source('assets.js'),context);
  return context;
}
function geometryFor(assets,file) {
  for (const id of fighters) for (const pose of phases)
    if (assets.poses[id][pose] === file) return assets.generatedGeometry.fighters?.[id]?.[pose];
  for (const kind of shotKinds)
    if (assets.projectiles[kind] === file) return assets.generatedGeometry.projectiles?.[kind];
}
function harness(unavailable = () => false) {
  const context = catalog(), assets = context.window.StrandAssets;
  context.Image = class {
    set src(file) {
      const meta = dimensions.get(file);
      assert.ok(meta,'Image declared and decoded: ' + file);
      this._src = file;
      this.complete = !unavailable(file);
      this.naturalWidth = this.complete ? meta.width : 0;
      this.naturalHeight = this.complete ? meta.height : 0;
    }
    get src() {return this._src;}
  };
  const seen = new Set(), calls = [], stack = [];
  let facing = 1;
  const ctx = new Proxy({
    createLinearGradient:() => ({addColorStop(){}}),
    save() {stack.push(facing);},
    restore() {facing = stack.pop();},
    scale(x) {facing *= Math.sign(x);},
    drawImage(image,...args) {
      assert.ok(args.every(Number.isFinite),'Finite render geometry: ' + image.src);
      seen.add(image.src + '/' + facing);
      if (!generatedFiles.has(image.src)) return;
      assert.equal(args.length,8,'Native source crop: ' + image.src);
      const [sx,sy,sw,sh,dx,dy,dw,dh] = args;
      const measure = geometryFor(assets,image.src);
      assert.deepEqual([sx,sy,sw,sh],Array.from(measure.crop),'Measured source: ' + image.src);
      assert.ok(Math.abs(sw/sh - dw/dh) < 1e-9,'Unstretched proportions: ' + image.src);
      if (image.src.startsWith('assets/fighters/'))
        assert.ok(Math.abs(dy + dh*measure.baselineY) < 1e-8,'Foot baseline: ' + image.src);
      const targetHeight = image.src===assets.projectiles.higgs ? 100 : image.src===assets.projectiles.gate ? 143 : null;
      if (targetHeight!==null) {
        // Use the PNG's actual visible alpha, excluding transparent crop padding.
        // These ground effects must reach their original vertical hit envelope
        // while preserving source proportions; extending a blank crop cannot pass.
        const bounds=visibleBounds.get(image.src), scale=dh/sh;
        const tip=dy+(bounds[1]-sy)*scale, base=dy+(bounds[3]-sy)*scale;
        assert.ok(Math.abs(tip+targetHeight)<=2,'Visible ground-effect height: '+image.src+' ('+(-tip).toFixed(2)+'px)');
        assert.ok(Math.abs(base)<=2,'Visible ground-effect base: '+image.src+' ('+base.toFixed(2)+'px)');
      }
      calls.push({file:image.src,facing,args});
    }
  },{get:(object,key) => key in object ? object[key] : () => {}});
  vm.runInNewContext(source('fight.js'),context);
  const engine = context.window.StrandFight, canvas = {getContext:()=>ctx};
  function step(count,inputs=[]) {
    for (let frame=0;frame<count;frame++) {
      engine.network.advance(frame===0 ? inputs : [],true);
      engine.network.draw();
    }
  }
  function start(id,side=1) {
    engine.start({canvas,p1:side===1?id:'sam',p2:side===2?id:'sam',stage:'shore',
      mode:'local',clock:'network',sound:false,seed:2456});
    step(74);seen.clear();calls.length=0;
  }
  return {engine,assets,seen,calls,start,step};
}
const tap = (side,key) => [[side,key,true],[side,key,false]];
const special = (side,direction) => direction ? [[side,direction,true],...tap(side,'special'),[side,direction,false]] : tap(side,'special');

(async () => {
  const context = catalog(), assets = context.window.StrandAssets;
  const allFiles = new Set();
  function collect(value) {
    if (typeof value==='string' && value.startsWith('assets/')) allFiles.add(value);
    else if (value && typeof value==='object') Object.values(value).forEach(collect);
  }
  collect(assets);
  for (const id of fighters) for (const pose of phases) generatedFiles.add(assets.poses[id][pose]);
  for (const kind of shotKinds) generatedFiles.add(assets.projectiles[kind]);
  assert.equal(generatedFiles.size,42,'35 individual poses and 7 projectiles');
  for (const file of allFiles) {
    const image = sharp(path.join(root,file)), meta = await image.metadata();
    dimensions.set(file,meta);
    if (!generatedFiles.has(file)) continue;
    const stats = await image.stats();
    assert.ok(meta.hasAlpha,'Real alpha channel: ' + file);
    assert.equal(stats.isOpaque,false,'Transparent canvas: ' + file);
    if (file===assets.projectiles.higgs || file===assets.projectiles.gate) {
      const {data,info}=await image.clone().extractChannel('alpha').raw().toBuffer({resolveWithObject:true});
      let left=info.width,top=info.height,right=0,bottom=0;
      for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) if(data[y*info.width+x]>2) {
        left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x+1);bottom=Math.max(bottom,y+1);
      }
      assert.ok(right>left && bottom>top,'Visible projectile silhouette: '+file);
      visibleBounds.set(file,[left,top,right,bottom]);
    }
    const measure = geometryFor(assets,file);
    assert.ok(measure,'Geometry present: ' + file);
    assert.equal(measure.crop.length,4,'Pixel crop: ' + file);
    const [x,y,w,h] = measure.crop;
    assert.ok([x,y,w,h].every(Number.isFinite) && x>=0 && y>=0 && w>0 && h>0 && x+w<=meta.width && y+h<=meta.height,'Valid crop: ' + file);
    for (const key of file.startsWith('assets/fighters/') ? ['anchorX','baselineY','heightRatio'] : ['anchorX','anchorY','width'])
      assert.ok(Number.isFinite(measure[key]),key + ': ' + file);
  }
  console.log('Production images · 42 native rasters decoded, transparency and measured geometry valid.');

  const complete = harness();
  for (const id of fighters) for (const side of [1,2]) {
    complete.start(id,side);
    complete.step(4,[[side,'guard',true]]);
    complete.step(4,[[side,'guard',false],[side,'down',true]]);
    complete.step(44,[[side,'down',false],...tap(side,'up')]);
    for (const pose of phases) assert.ok(complete.seen.has(assets.poses[id][pose]+'/'+(side===1?1:-1)),id+' '+pose+' J'+side);
    assert.equal(complete.engine.snapshot().fighters[side-1].y,0,id+' landed');
  }
  console.log('Poses · all 35 images used by guard, crouch and full jump on both sides, with proportional crop and grounded baseline.');

  for (const kind of shotKinds) for (const side of [1,2]) {
    const id = ({recall:'cliff',gate:'diehardman',memory:'heartman'})[kind] || kind;
    const forward = side===1?'right':'left', back = side===1?'left':'right';
    complete.start(id,side);
    if (kind==='recall' || kind==='memory') {
      complete.step(40,special(side,forward));
      complete.step(38,special(side,kind==='recall'?back:forward));
    } else if (kind==='gate') complete.step(38,special(side,forward));
    else if (kind==='higgs') {
      // Move away during startup; an instant contact consumes the hitbox before
      // the renderer, whereas a missed summon keeps its independent lifetime.
      complete.step(38,[...special(side),[3-side,forward,true]]);
    } else complete.step(45,special(side));
    assert.ok(complete.seen.has(assets.projectiles[kind]+'/'+(side===1?1:-1)),kind+' real attack J'+side);
  }
  console.log('Projectiles · all 7 rasters emitted by real techniques in both orientations; Higgs and gate visible heights/base match their ground envelopes within 2 pixels without stretching.');

  const unavailable = harness(file=>generatedFiles.has(file));
  for (const side of [1,2]) {
    complete.start('sam',side);unavailable.start('sam',side);
    const sequence = [[4,[[side,'guard',true]]],[4,[[side,'guard',false],[side,'down',true]]],
      [44,[[side,'down',false],...tap(side,'up')]],[45,special(side)]];
    for (const [count,inputs] of sequence) {
      complete.step(count,inputs);unavailable.step(count,inputs);
      assert.equal(JSON.stringify(complete.engine.network.checkpoint()),JSON.stringify(unavailable.engine.network.checkpoint()),'Missing images leave simulation identical');
    }
    const sign = side===1?1:-1;
    assert.ok(unavailable.seen.has(assets.fighters.sam+'/'+sign),'Stance fallback');
    assert.ok(unavailable.seen.has(assets.jumps.sam+'/'+sign),'Legacy jump fallback');
    assert.ok(!unavailable.calls.length,'No undecoded new image drawn');
  }
  complete.engine.stop();unavailable.engine.stop();
  console.log('Fallback · absent new images keep legacy sprites and procedural effects; simulation/checkpoints identical.');
})().catch(error => {console.error(error);process.exitCode=1;});
