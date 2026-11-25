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
for (const stage of ['port-knot','incinerator','south-knot-ruins','timefall-farm','mountain-knot-approach','magellan-ds2','plate-gate-ds2','sandstorm-ds2','dunes-ds2','terminal-linked','terminal-hangar']) {
  const receive=roomService('stages-test',()=>0);
  const tokens=['c'.repeat(40),'d'.repeat(40)];
  const room=receive({op:'create',version:'stages-test',token:tokens[0]}).room;
  const call=(index,op,data={})=>receive({token:tokens[index],version:'stages-test',room,op,...data});
  call(1,'join');call(0,'ready',{fighter:'mama',ready:true});call(1,'ready',{fighter:'diehardman',ready:true});
  const match=call(0,'start',{stage}).match;
  assert.equal(match.stage,stage,stage+' disponible en salon privé');
  if(stage==='terminal-linked') assert.equal(match.stageRules,'terminal-quay-hangar@1','La liaison porte sa version explicite');
  else assert.equal(Object.hasOwn(match,'stageRules'),false,'Les arènes ordinaires ne portent pas de règle liée');
  call(0,'leave');
}
verifyEngines();
async function verifyNestedAssets() {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(),'echos-relay-assets-'));
  try {
    for (const name of ['fight.js','content.js','assets.js','asset-geometry-20261124.js','boss-geometry-20261124.js','boss-assets.js','boss.js',
      'app.js','campaign.js','campaign.css','static-assets.html','static-assets.css','static-assets.js','static-assets-data.js','archives.html',
      'input.js','input.css','moves-data.js','relationships.js','netplay.js','netplay-server.cjs'])
      fs.writeFileSync(path.join(fixture,name),'fixture');
    const directory = path.join(fixture,'assets/fighters/mama/atelier');
    fs.mkdirSync(directory,{recursive:true});
    const guard = path.join(directory,'guard.webp'), jump = path.join(directory,'apex.png');
    fs.writeFileSync(guard,'first guard'); fs.writeFileSync(jump,'first jump');
    const bossDirectory=path.join(fixture,'assets/bosses/giant');
    fs.mkdirSync(bossDirectory,{recursive:true});
    const bossPose=path.join(bossDirectory,'attack.png');
    fs.writeFileSync(bossPose,'first boss pose');
    const staticPoses=['static-20261125','static-universe-20261125','static-completion-20261125','story-completion-20261125','static-domains-20261125'].map(folder=>{
      const directory=path.join(fixture,'assets',folder);
      fs.mkdirSync(directory,{recursive:true});
      const file=path.join(directory,'portrait.png');fs.writeFileSync(file,'first static pose');return file;
    });
    const initial = gameVersion(fixture);
    for (const name of ['campaign.js','campaign.css','static-assets-data.js','static-assets.js','archives.html','input.js','input.css','moves-data.js','relationships.js']) {
      const file=path.join(fixture,name);
      fs.writeFileSync(file,'revised module');
      assert.notEqual(gameVersion(fixture),initial,name+' modifie la version du salon');
      fs.writeFileSync(file,'fixture');
    }
    for(const file of staticPoses){
      fs.writeFileSync(file,'revised static pose');
      assert.notEqual(gameVersion(fixture),initial,'Une image de '+path.basename(path.dirname(file))+' modifie la version du salon');
      fs.writeFileSync(file,'first static pose');
    }
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
    const versionResponse=await fetch(origin+'/room-version.js');
    assert.equal(versionResponse.status,200,'Version du relais accessible');
    const currentVersion=gameVersion(root);
    assert.equal(await versionResponse.text(),'window.StrandRoomVersion='+JSON.stringify(currentVersion),'La version servie correspond aux sources et images locales');
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
    for (const file of ['boss.js','boss-assets.js','boss-geometry-20261124.js','campaign.js','campaign.css','archives.html',
      'static-assets.html','static-assets.css','static-assets.js','static-assets-data.js','input.js','input.css','moves-data.js','relationships.js']) {
      const response=await fetch(origin+'/'+file);
      assert.equal(response.status,200,file+' accessible');
      assert.equal(response.headers.get('content-type'),file.endsWith('.html')?'text/html; charset=utf-8':file.endsWith('.css')?'text/css':'text/javascript');
      assert.equal(await response.text(),fs.readFileSync(path.join(root,file),'utf8'),file+' source exacte');
    }
    const catalogue={window:{}};
    vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),catalogue);
    vm.runInNewContext(fs.readFileSync(path.join(root,'assets.js'),'utf8'),catalogue);
    vm.runInNewContext(fs.readFileSync(path.join(root,'static-assets-data.js'),'utf8'),catalogue);
    const galleryPaths=[...new Set(catalogue.window.StrandStaticCatalogue.items.map(item=>item.src))];
    assert(galleryPaths.includes('assets/static-20261125/lockne-portrait.png'),'Le portrait de Lockne est couvert par le test HTTP');
    const newStages=['south-knot-ruins','timefall-farm','mountain-knot-approach','magellan-ds2','plate-gate-ds2','sandstorm-ds2','dunes-ds2','terminal-hangar'];
    const stagePaths=[...new Set(newStages.flatMap(id=>['stages','skyplates','distants','midgrounds','floors','foregrounds'].map(group=>catalogue.window.StrandAssets[group][id])))];
    const storyPaths=[...new Set(Object.values(catalogue.window.StrandAssets.storyFrames).flatMap(parts=>Object.values(parts).flatMap(frames=>frames.map(frame=>frame.src))))];
    assert.equal(storyPaths.length,48,'Eight complete story frame sets preserve originals and add 24 frames');
    for(const prefix of ['/','/modes/echos-de-la-greve/']){
      for(const file of new Set(['static-assets.html','static-assets.css','static-assets.js','static-assets-data.js','campaign.js','campaign.css','input.js','input.css','moves-data.js','relationships.js',...galleryPaths,...stagePaths,...storyPaths])){
        const response=await fetch(origin+prefix+file);
        assert.equal(response.status,200,prefix+file+' accessible');
        if(file.endsWith('.png'))assert.equal(response.headers.get('content-type'),'image/png');
        if(file.endsWith('.webp'))assert.equal(response.headers.get('content-type'),'image/webp');
        assert.deepEqual(Buffer.from(await response.arrayBuffer()),fs.readFileSync(path.join(root,file)),prefix+file+' contenu exact');
      }
    }
    const documents=new Set([...catalogue.window.StrandStaticCatalogue.items.flatMap(item=>[item.bible,item.reference]).filter(Boolean),
      '../../docs/combat/ACTIONS_ET_IA.md','../../docs/combat/RELATIONS_SIMULATEUR.md']);
    for (const entry of documents) {
      for (const base of ['/', '/modes/echos-de-la-greve/']) {
        const target=new URL(entry,origin+base+'static-assets.html');
        const response=await fetch(target);
        assert.equal(response.status,200,'Documentation liée : '+target.pathname);
        assert.equal(response.headers.get('content-type'),'text/plain; charset=utf-8');
        const location=path.join(root,'../..',target.pathname);
        assert.equal(await response.text(),fs.readFileSync(location,'utf8'),'Documentation exacte');
      }
    }
    const prefixed = await fetch(origin + '/modes/echos-de-la-greve/assets/fighters/mama/atelier/guard.webp');
    assert.equal(prefixed.status,200,'Le préfixe de l’entrée campagne conserve les images imbriquées');
    await prefixed.arrayBuffer();
    for (const file of ['assets/fighters/mama/reconstruction.json','assets/fighters/source/mama.svg',
      'assets/fighters/mama/__proto__/guard.webp','assets/fighters/mama/%2e%2e%2f%2e%2e%2f%2e%2e%2fAGENTS.md',
      'docs/combat/production/20261125-completion/reference-research.json','docs/AGENTS.md']) {
      const response = await fetch(origin + '/' + file);
      assert.equal(response.status,404,file + ' reste inaccessible');
      await response.arrayBuffer();
    }
    console.log('Ressources réseau · commandes, données, tenues, boss, campagne, galerie et '+galleryPaths.length+' images statiques, '+stagePaths.length+' images de '+newStages.length+' zones étendues et '+storyPaths.length+' plans narratifs, servis en HTTP réel avec et sans préfixe ; empreinte récursive stable, sources et traversées refusées.');
    console.log('Exécution · '+new Date().toISOString()+' ; version réelle du relais '+currentVersion+'.');
  } finally {await new Promise(resolve => server.close(resolve));}
}
verifyNestedAssets().catch(error => {console.error(error);process.exitCode = 1;});
