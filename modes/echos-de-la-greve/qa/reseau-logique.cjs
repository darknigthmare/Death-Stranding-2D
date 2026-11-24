const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const vm = require('node:vm');
const {roomService,openRelay,gameVersion} = require('../netplay-server.cjs');

function verifyProtocol() {
  let now = 0;
  const version = 'local-test';
  const receive = roomService(version, () => now);
  const tokens = ['a'.repeat(40),'b'.repeat(40)];
  const created = receive({op:'create',version,token:tokens[0]});
  assert.equal(created.player,1);
  const room = created.room;
  const call = (player,op,data={}) => receive({token:tokens[player-1],version,room,op,inputs:[],cursor:0,...data});
  assert.equal(call(2,'join').player,2);
  call(1,'ready',{fighter:'sam',ready:true});
  assert.throws(() => call(1,'start',{stage:'shore'}));
  call(2,'ready',{fighter:'higgs',ready:true});
  const started=call(1,'start',{stage:'mule-camp-dry'});
  assert.deepEqual(started.seats.map(s=>s.ready),[true,true]);
  assert.equal(started.match.stage,'mule-camp-dry','La variante météo est disponible dans le salon privé');
  now=1000;
  const inputs=[[1,55,'right',true],[2,56,'right',false]];
  const a=call(1,'sync',{inputs});
  const retry=call(1,'sync',{inputs});
  assert.equal(a.tick,60);
  assert.deepEqual(a.events,retry.events);
  assert.equal(call(2,'sync',{cursor:1}).events.length,1);
  for (let t=1500;t<=5000;t+=500) {now=t;call(1,'sync');}
  const pause=call(1,'sync');
  assert.equal(pause.live,false);
  now+=1000;
  assert.equal(call(1,'sync').tick,pause.tick);
  assert.equal(call(2,'join').player,2);
  call(1,'sync');
  now+=500;
  const resumed=call(2,'sync');
  assert.equal(resumed.tick,pause.tick+30);
  const done={tick:90,winner:2,rounds:'1-2'};
  call(2,'sync',{done,cursor:2});
  assert.deepEqual(call(1,'sync',{done,cursor:2}).result,done);
  assert.equal(call(1,'leave').closed,true);
  assert.equal(call(2,'sync').closed,true);
  console.log('Relais · création, deux places, choix, lancement, accusés, reprise, résultat et fermeture vérifiés.');
}
function verifyEngines() {
  const source = name => fs.readFileSync(path.join(__dirname,'..',name),'utf8');
  const context = {window:{},Image:class {},structuredClone};
  vm.runInNewContext(source('content.js'),context);
  vm.runInNewContext(source('fight.js'),context);
  const engine=context.window.StrandFight;
  const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]||(()=>{})});
  const canvas={getContext:()=>ctx};
  const start=()=>engine.start({canvas,p1:'sam',p2:'mule',stage:'mule-camp',seed:42,mode:'local',clock:'network',roundsToWin:2,sound:false});
  const inputs = new Map([[90,[[1,'right',true],[2,'left',true]]],[125,[[1,'right',false],[2,'left',false]]],[130,[[1,'light',true]]],[131,[[1,'light',false]]],[140,[[2,'special',true]]],[141,[[2,'special',false]]]]);
  const advance=(from,to,late=false)=>{for(let tick=from;tick<to;tick++)engine.network.advance(late && tick===130 ? []:inputs.get(tick)||[],true);};
  start();
  advance(0,200);
  const reference=JSON.stringify(engine.network.checkpoint());
  start();
  advance(0,128);
  const saved=engine.network.checkpoint();
  advance(128,150,true);
  engine.network.restore(saved);
  advance(128,200);
  assert.equal(JSON.stringify(engine.network.checkpoint()),reference);
  const snap=engine.snapshot();
  assert(snap.fighters[0].x>462 && snap.fighters[1].x<818);
  assert.equal(snap.tick,200);
  console.log('Moteur · état complet identique après correction d’une commande tardive, au pas 200.');
}
verifyProtocol();
for (const stage of ['port-knot','incinerator']) {
  const receive=roomService('stages-test',()=>0);
  const tokens=['c'.repeat(40),'d'.repeat(40)];
  const room=receive({op:'create',version:'stages-test',token:tokens[0]}).room;
  const call=(index,op,data={})=>receive({token:tokens[index],version:'stages-test',room,op,...data});
  call(1,'join');call(0,'ready',{fighter:'mama',ready:true});call(1,'ready',{fighter:'diehardman',ready:true});
  assert.equal(call(0,'start',{stage}).match.stage,stage,stage+' disponible en salon privé');
  call(0,'leave');
}
verifyEngines();
async function verifyNestedAssets() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(),'echos-relay-assets-'));
  try {
    for (const name of ['fight.js','content.js','assets.js','asset-geometry-20261124.js','boss-geometry-20261124.js','boss-assets.js','boss.js','netplay.js','netplay-server.cjs'])
      fs.writeFileSync(path.join(fixture,name),'fixture');
    const directory = path.join(fixture,'assets/fighters/mama/atelier');
    fs.mkdirSync(directory,{recursive:true});
    const guard = path.join(directory,'guard.webp'), jump = path.join(directory,'apex.png');
    fs.writeFileSync(guard,'first guard'); fs.writeFileSync(jump,'first jump');
    const bossDirectory=path.join(fixture,'assets/bosses/giant');
    fs.mkdirSync(bossDirectory,{recursive:true});
    const bossPose=path.join(bossDirectory,'attack.png');
    fs.writeFileSync(bossPose,'first boss pose');
    const initial = gameVersion(fixture);
    fs.writeFileSync(bossPose,'revised boss pose');
    assert.notEqual(gameVersion(fixture),initial,'Une variante de boss modifie la version du salon');
    fs.writeFileSync(bossPose,'first boss pose');
    fs.writeFileSync(guard,'revised guard');
    assert.notEqual(gameVersion(fixture),initial,'Une pose imbriquée modifie la version du salon');
    fs.unlinkSync(guard); fs.unlinkSync(jump);
    fs.writeFileSync(jump,'first jump'); fs.writeFileSync(guard,'first guard');
    assert.equal(gameVersion(fixture),initial,'L’ordre de création des images ne change pas la version');
    const external = path.join(fixture,'private');
    fs.mkdirSync(external); fs.writeFileSync(path.join(external,'secret.webp'),'private image');
    fs.symlinkSync(path.join(external,'secret.webp'),path.join(directory,'linked.webp'));
    fs.symlinkSync(external,path.join(directory,'linked-folder'));
    fs.writeFileSync(path.join(directory,'source.svg'),'<svg/>');
    assert.equal(gameVersion(fixture),initial,'Les liens symboliques et les sources sont exclus');
  } finally {fs.rmSync(fixture,{recursive:true,force:true});}

  const server = openRelay();
  try {
    await new Promise((resolve,reject) => {server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    const origin = 'http://127.0.0.1:' + server.address().port;
    const root = path.resolve(__dirname,'..');
    for (const file of ['assets/fighters/mama/atelier/guard.webp','assets/fighters/mama/viaduc/stance.webp','assets/fighters/mama/parts/helmet.webp',
      'assets/stages/mule-camp-dry.png','assets/stages/mule-camp-dry-floor.png',
      'assets/fighters/mama/atelier/guard.png','assets/fighters/diehardman/stance.png',
      'assets/fighters/support/deadman-portrait.png','assets/bosses/giant/attack.png',
      'assets/bosses/mule-truck/damaged.png','assets/projectiles/boss-chiral-ring.png',
      'assets/stages/port-knot-floor.png','assets/stages/incinerator-floor.png']) {
      const response = await fetch(origin + '/' + file);
      assert.equal(response.status,200,file + ' servi par le salon');
      assert.equal(response.headers.get('content-type'),file.endsWith('.png')?'image/png':'image/webp');
      assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join(root,file)),file + ' contenu exact');
    }
    for (const file of ['boss.js','boss-assets.js','boss-geometry-20261124.js','archives.html']) {
      const response=await fetch(origin+'/'+file);
      assert.equal(response.status,200,file+' accessible');
      assert.equal(await response.text(),fs.readFileSync(path.join(root,file),'utf8'),file+' source exacte');
    }
    const prefixed = await fetch(origin + '/modes/echos-de-la-greve/assets/fighters/mama/atelier/guard.webp');
    assert.equal(prefixed.status,200,'Le préfixe de l’entrée campagne conserve les images imbriquées');
    await prefixed.arrayBuffer();
    for (const file of ['assets/fighters/mama/reconstruction.json','assets/fighters/source/mama.svg',
      'assets/fighters/mama/__proto__/guard.webp','assets/fighters/mama/%2e%2e%2f%2e%2e%2f%2e%2e%2fAGENTS.md']) {
      const response = await fetch(origin + '/' + file);
      assert.equal(response.status,404,file + ' reste inaccessible');
      await response.arrayBuffer();
    }
    console.log('Ressources réseau · tenues et pièces imbriquées servies, empreinte récursive stable, sources et traversées refusées.');
  } finally {await new Promise(resolve => server.close(resolve));}
}
verifyNestedAssets().catch(error => {console.error(error);process.exitCode = 1;});
