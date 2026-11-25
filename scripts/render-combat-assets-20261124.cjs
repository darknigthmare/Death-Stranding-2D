// Reproducible review frames from the actual combat renderer, without a browser.
// Requires @napi-rs/canvas. Run from any directory with NODE_PATH configured.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const {createCanvas,loadImage} = require('@napi-rs/canvas');
const repo = path.resolve(__dirname,'..');
const root = path.join(repo,'modes/echos-de-la-greve');
const out = path.join(repo,'docs/combat/apercus/production-20261124');
const context = {window:{},structuredClone};
for (const name of ['content.js','asset-geometry-20261124.js','assets.js'])
  vm.runInNewContext(fs.readFileSync(path.join(root,name),'utf8'),context);
const files = new Set();
function collect(value) {
  if (typeof value === 'string' && value.startsWith('assets/')) files.add(value);
  else if (value && typeof value === 'object') Object.values(value).forEach(collect);
}
collect(context.window.StrandAssets);
(async () => {
  const images = new Map();
  for (const file of files) images.set(file,await loadImage(path.join(root,file)));
  const canvas = createCanvas(1280,720), native = canvas.getContext('2d'), seen = new Set();
  const ctx = new Proxy(native,{
    get(target,key) {
      if (key === 'drawImage') return (image,...args) => {
        seen.add(image.src); return target.drawImage(image.drawable,...args);
      };
      const value = Reflect.get(target,key,target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
    set(target,key,value) { Reflect.set(target,key,value,target); return true; }
  });
  context.Image = class {
    set src(file) {
      this._src = file; this.drawable = images.get(file); this.complete = !!this.drawable;
      this.naturalWidth = this.drawable?.width || 0; this.naturalHeight = this.drawable?.height || 0;
    }
    get src() { return this._src; }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root,'fight.js'),'utf8'),context);
  const game = context.window.StrandFight, target = {getContext:() => ctx};
  const step = (n,inputs = []) => {
    for (let i=0;i<n;i++) { game.network.advance(i===0 ? inputs : [],true); seen.clear(); game.network.draw(); }
  };
  const tap = (player,key) => [[player,key,true],[player,key,false]];
  const start = (p1,p2,stage) => {
    game.start({canvas:target,p1,p2,stage,mode:'local',clock:'network',sound:false,seed:2456}); step(74);
  };
  const screenshots = [];
  const save = name => {
    fs.mkdirSync(out,{recursive:true});
    fs.writeFileSync(path.join(out,name+'.png'),canvas.toBuffer('image/png'));
    screenshots.push(name+'.png');
    console.log(name,JSON.stringify(game.snapshot().fighters.map(f => ({id:f.id,x:f.x,y:f.y}))));
  };
  start('sam','fragile','shore'); step(4,[[1,'guard',true],[2,'guard',true]]); save('sam-fragile-garde');
  start('sam','fragile','terminal'); step(11,[[1,'down',true],...tap(2,'up')]); save('sam-fragile-saut');
  start('higgs','cliff','battlefield');
  let saved = false;
  for (let i=0;i<40;i++) {
    step(1,i===0 ? [...tap(1,'special'),[2,'left',true]] : []);
    if (seen.has('assets/projectiles/higgs.png')) { save('higgs-maree-noire'); saved = true; break; }
  }
  if (!saved) throw Error('Higgs projectile not visible');
  start('heartman','diehardman','heartman-lab'); saved = false;
  for (let i=0;i<35;i++) {
    step(1,i===0 ? [...tap(1,'special'),[2,'guard',true]] : []);
    if (seen.has('assets/projectiles/heartman.png')) {
      step(9); // Let the short pulse leave its caster's silhouette.
      if (!seen.has('assets/projectiles/heartman.png')) throw Error('Heartman pulse expired before review frame');
      save('heartman-impulsion'); saved = true; break;
    }
  }
  if (!saved) throw Error('Heartman projectile not visible');
  game.stop();
  const source_sha256 = Object.fromEntries(['content.js','assets.js','asset-geometry-20261124.js','fight.js'].map(file =>
    [file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
  fs.writeFileSync(path.join(out,'render-evidence.json'),JSON.stringify({
    date:'2026-11-24', renderer:'actual fight.js rendered with @napi-rs/canvas',
    canvas:[1280,720], screenshots, source_sha256, browserValidated:false
  },null,2)+'\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
