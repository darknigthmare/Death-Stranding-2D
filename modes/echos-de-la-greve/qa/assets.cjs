// Resource and render-path checks runnable without a browser display.
// These verify decoding and the real simulation's image choices, not visual fidelity.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sharp = require('sharp');

(async () => {
  const root = path.resolve(__dirname, '..');
  const source = name => fs.readFileSync(path.join(root, name), 'utf8');
  const context = {window:{}, structuredClone};
  vm.runInNewContext(source('content.js'), context);
  vm.runInNewContext(source('assets.js'), context);
  const assets = context.window.StrandAssets;
  const files = new Set();
  function collect(value) {
    if (typeof value === 'string' && value.startsWith('assets/')) files.add(value);
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  }
  collect(assets);
  const dimensions = new Map();
  for (const file of files) {
    const absolute = path.join(root, file);
    assert.ok(fs.existsSync(absolute), 'Fichier déclaré absent : ' + file);
    const image = sharp(absolute);
    const metadata = await image.metadata();
    await image.stats(); // Decode all pixels, rather than trusting a valid header.
    assert.ok(metadata.width > 0 && metadata.height > 0, file);
    dimensions.set(file, metadata);
  }
  console.log('Ressources · ' + files.size + ' chemins uniques présents et images décodées.');

  context.Image = class {
    set src(file) {
      assert.ok(dimensions.has(file), 'Image chargée hors registre : ' + file);
      this._src = file;
      this.complete = true;
      this.naturalWidth = dimensions.get(file).width;
      this.naturalHeight = dimensions.get(file).height;
    }
    get src() {return this._src;}
  };
  vm.runInNewContext(source('fight.js'), context);
  const engine = context.window.StrandFight;
  const seen = new Set(), positions = new Map();
  let facing = 1;
  const stack = [];
  const canvasContext = new Proxy({
    createLinearGradient:() => ({addColorStop(){}}),
    save() {stack.push(facing);},
    restore() {facing = stack.pop();},
    scale(x) {facing *= Math.sign(x);},
    drawImage(image, ...args) {
      assert.ok(args.every(Number.isFinite),'Géométrie finie : ' + image.src);
      seen.add(image.src + '/' + facing);
      positions.set(image.src, args.length === 8 ? args[4] : args[0]);
    }
  }, {get:(object,key) => key in object ? object[key] : () => {}});
  const canvas = {getContext:() => canvasContext};
  function step(count, inputs = []) {
    for (let i = 0; i < count; i++) {
      engine.network.advance(i === 0 ? inputs : [], true);
      engine.network.draw();
    }
  }
  function start(p1, p2 = 'sam', extra = {}) {
    engine.start({canvas,p1,p2,mode:'local',clock:'network',sound:false,...extra});
    step(74);
    seen.clear();
  }
  const tap = (player,key) => [[player,key,true],[player,key,false]];

  // Every delivered airborne pose must be used in both orientations.
  let airborne = 0;
  for (const id of Object.keys(context.window.StrandContent.fighters)) {
    const poses = assets.wardrobe?.[id]?.atelier?.poses;
    const jump = assets.jumps?.[id];
    const sources = poses?.rise ? [poses.rise,poses.apex,poses.fall] :
      typeof jump === 'string' ? [jump] : Object.values(jump || {});
    if (!sources.length) continue;
    for (const side of [1,2]) {
      start(side === 1 ? id : 'sam', side === 2 ? id : 'sam');
      step(44, tap(side,'up'));
      for (const file of sources) assert.ok(seen.has(file + '/' + (side === 1 ? 1 : -1)),id + ' saut J' + side + ' : ' + file);
      assert.equal(engine.snapshot().fighters[side-1].y,0,id + ' atterrissage');
    }
    airborne++;
  }
  console.log('Sauts · ' + airborne + ' combattants : poses livrées dessinées des deux côtés puis retour au sol.');

  start('higgs');
  step(35, [[1,'right',true],...tap(1,'special'),[1,'right',false]]);
  assert.ok(seen.has(assets.props.goldImprint + '/1'),'Empreinte d’or dessinée pendant le piège');
  start('mama');
  step(32, [[1,'right',true],...tap(1,'special'),[1,'right',false]]);
  assert.ok(seen.has(assets.props.bridgeDeck + '/1'),'Tablier dessiné pendant la projection');
  if (assets.props.heartmanMonitor) {
    start('heartman');
    step(30, [[1,'right',true],...tap(1,'special'),[1,'right',false]]);
    assert.equal(engine.snapshot().fighters[0].marker.kind,'memory');
    assert.ok(seen.has(assets.props.heartmanMonitor + '/1'),'Moniteur dessiné au repère mémoire');
  }
  start('sam','sam',{parcel:true});
  step(33, [[1,'right',true],[2,'left',true]]);
  step(1, [[1,'right',false],[2,'left',false]]);
  assert.ok(seen.has(assets.props.closedParcel + '/1'),'Colis intact visible');
  seen.clear();
  step(24,tap(2,'heavy'));
  assert.equal(engine.snapshot().parcel,'broken','Le coup reçu rompt le scellé');
  assert.ok(seen.has(assets.props.openParcel + '/1'),'Colis ouvert visible après impact');
  assert.ok(!seen.has(assets.props.cargo + '/1'),'La caisse MULE ne remplace pas le colis du défi');
  console.log('Accessoires · empreinte de Higgs, tablier de Mama et remplacement du colis après un impact réel.');

  for (const [stage, middle] of Object.entries(assets.midgrounds)) {
    start('sam','sam',{stage});
    engine.network.draw();
    const before = new Map(positions);
    step(32,[[1,'right',true],[2,'right',true]]);
    step(22,[[1,'right',false],[2,'right',false]]);
    const shift = file => before.get(file) - positions.get(file);
    const layered=assets.skyplates[stage] && assets.distants[stage] && assets.floors[stage];
    const ordered=layered ? [assets.skyplates[stage],assets.distants[stage],middle,assets.floors[stage],assets.foregrounds[stage]] :
      [assets.stages[stage],middle,assets.foregrounds[stage]];
    assert.ok(shift(ordered[0]) > 0,stage + ' déplacement du fond');
    for (let i=1;i<ordered.length;i++) assert.ok(shift(ordered[i]) > shift(ordered[i-1]),stage + ' parallaxe '+ordered[i]);
  }
  console.log('Décors · ' + Object.keys(assets.midgrounds).length + ' arènes avec plans livrés et vitesses ordonnées.');
  engine.stop();
})().catch(error => {console.error(error);process.exitCode = 1;});
