'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const outputIndex=process.argv.indexOf('--output'),inlineOutput=process.argv.find(arg=>arg.startsWith('--output='));
if(outputIndex>=0)assert(process.argv[outputIndex+1]&&!process.argv[outputIndex+1].startsWith('--'),'--output requires a directory');
if(inlineOutput!==undefined)assert(inlineOutput.slice('--output='.length),'--output requires a directory');
const requestedOutput=inlineOutput!==undefined?inlineOutput.slice('--output='.length):outputIndex>=0?process.argv[outputIndex+1]:process.env.LDM_QA_OUTPUT;
const out=path.resolve(requestedOutput||path.join(repo,'docs/combat/production/20261127-first-playable'));
assert.notEqual(out,path.join(repo,'docs/combat/production/20261127-lignes-de-maree'),'The previous delivery report is historical; choose a different output directory.');
const scope={window:{}},canonicalIds=['sam','fragile','higgs','cliff','mule','diehardman','mama','heartman'];
vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),scope,{filename:'content.js'});
const canonicalContent=structuredClone(scope.window.StrandContent);
const canonicalFighters=new Map(canonicalIds.map(id=>[id,JSON.stringify(canonicalContent.fighters[id])]));
for(const file of ['asset-geometry-20261124.js','assets.js','extension-data.js','extension-assets.js'])vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),scope,{filename:file});
const originalFiles=['original-kits-assets.js','original-kits.js','original-bosses-assets.js','original-bosses.js'];
const originalSources=new Map(originalFiles.map(file=>[file,fs.readFileSync(path.join(root,file),'utf8')]));
function loadOriginalModules(host){for(const file of originalFiles)vm.runInNewContext(originalSources.get(file),{window:host},{filename:file});}
loadOriginalModules(scope.window);
vm.runInNewContext(fs.readFileSync(path.join(root,'extension-runtime.js'),'utf8'),scope,{filename:'extension-runtime.js'});
const data=scope.window.StrandOriginalExtension,images=scope.window.StrandExtensionAssets.items,checks=[];
const partial=process.argv.includes('--partial');
function check(name,fn){fn();checks.push(name);}
const groups=['characters','stages','enemies','bosses','props','gadgets','vehicles','projectiles','missions','bonusChallenges','duos'];
const entries=groups.flatMap(k=>data[k]||[]),known=new Set(entries.map(e=>e.id));
check('All requested original entities are present once, with complete design and explicit origin.',()=>{
 for(const[k,n]of Object.entries({characters:10,stages:20,enemies:20,bosses:20,props:20,gadgets:10,vehicles:4,projectiles:12,missions:20,bonusChallenges:6,duos:5}))assert.equal(data[k].length,n,k);
 assert.equal(entries.length,147);assert.equal(known.size,147);
 for(const e of entries){assert.equal(e.canonStatus,'original-fan-extension',e.id);assert.equal(e.production.design,'complete',e.id);assert(e.name&&e.summary,e.id);}
});
check('Global production counters match the one original kit, one original boss and unchanged design catalogue.',()=>{
 const production=data.production,runtime=scope.window.StrandExtensionRuntime;
 assert.equal(production.runtime,'static_arenas_and_first_playable');
 assert.equal(production.playableOriginalCharacters,1);assert.equal(production.playableOriginalBosses,1);assert.equal(production.playableOriginalEnemies,0);
 assert.equal(production.playableOriginalCharacters,runtime.characters);assert.equal(production.playableOriginalBosses,runtime.bosses);assert.equal(production.playableOriginalEnemies,runtime.enemies);
 assert.deepEqual(Array.from(data.characters.filter(item=>item.playable===true),item=>item.id),['ldm-char-balise']);
 assert.deepEqual(Array.from(data.bosses.filter(item=>item.playable===true),item=>item.id),['ldm-boss-consignateur']);
 assert.equal(data.enemies.filter(item=>item.playable===true).length,0);
 assert.equal(production.staticArenas,20);assert.equal(production.staticArenas,runtime.stages.length);
 assert.equal(production.receivedBaseImages,70);assert.equal(production.receivedPlayableImages,48);
 assert.equal(production.activePlayableImages,47);assert.equal(production.archivedPlayableVariants,1);
 assert.equal(production.receivedPlayableImages,production.activePlayableImages+production.archivedPlayableVariants);
 assert.equal(production.receivedImages,118);assert.equal(production.receivedImages,production.receivedBaseImages+production.receivedPlayableImages);
 if(!partial)assert.equal(production.receivedBaseImages,Object.keys(images).length);
});
check('All four chapters and twenty connected locations have real, reciprocal links.',()=>{
 assert.equal(data.chapters.length,4);assert.equal(new Set(data.chapters.flatMap(c=>c.stageIds)).size,20);
 const map=new Map(data.stages.map(s=>[s.id,s])),visited=new Set(),queue=[data.stages[0].id];
 while(queue.length){const id=queue.shift();if(visited.has(id))continue;visited.add(id);for(const l of map.get(id).links){assert(map.has(l.stageId),l.stageId);assert(map.get(l.stageId).links.some(r=>r.stageId===id),'Non reciprocal '+id);queue.push(l.stageId);}}
 assert.equal(visited.size,20);assert.equal(data.stages.reduce((n,s)=>n+s.links.length,0)/2,24);
});
check('Character routes, rivalries, bosses and unique special effects point to defined content.',()=>{
 for(const c of data.characters){assert(known.has(c.campaign.finalBossId));c.campaign.stageIds.forEach(id=>assert(known.has(id)));c.campaign.rivals.forEach(r=>assert(known.has(r.characterId)));assert.equal(c.gameplay.specials.length,3);assert.equal(new Set(c.gameplay.specials.map(m=>m.name)).size,3);assert.equal(c.gameplay.assist.costCohesion,25);}
 for(const b of data.bosses){assert(known.has(b.stageId));assert.equal(b.gameplay.phases.length,3);for(const p of b.gameplay.phases){assert(p.telegraphFrames>0);assert(p.recoveryFrames>0);assert(p.counter);}}
});
check('Every received image belongs to its actual entity and retains native bytes.',()=>{
 const hashes=new Set();for(const[id,image]of Object.entries(images)){assert(known.has(id),id);assert.match(image.src,/^assets\/lignes-de-maree\/(characters|stages|enemies|bosses)\/[a-z0-9-]+\.png$/);const bytes=fs.readFileSync(path.join(root,image.src));assert.equal(bytes.readUInt32BE(16),image.width);assert.equal(bytes.readUInt32BE(20),image.height);const hash=crypto.createHash('sha256').update(bytes).digest('hex');assert.equal(hash,image.sha256);assert(!hashes.has(hash),'Duplicate art '+id);hashes.add(hash);if(image.kind!=='stage')assert.equal(image.alphaMin,0);}
 if(!partial)assert.equal(Object.keys(images).length,70);
});
check('Measured arenas coexist with nine kits, eight unchanged canonical fighters and one original boss.',()=>{
 const runtime=scope.window.StrandExtensionRuntime,ready=data.stages.filter(s=>Number.isFinite(images[s.id]?.floorY));
 const fighters=scope.window.StrandContent.fighters,kits=scope.window.StrandOriginalKits,bosses=scope.window.StrandOriginalBosses;
 assert.equal(runtime.stages.length,ready.length);if(!partial)assert.equal(ready.length,20);
 assert.deepEqual(Object.keys(canonicalContent.fighters).sort(),canonicalIds.slice().sort());
 assert.deepEqual(Object.keys(fighters).sort(),canonicalIds.concat('balise').sort());assert.equal(Object.keys(fighters).length,9);
 for(const id of canonicalIds)assert.equal(JSON.stringify(fighters[id]),canonicalFighters.get(id),'Canonical fighter changed: '+id);
 assert.equal(kits.enabled,true);assert.equal(kits.artReady,true);assert.deepEqual(Array.from(kits.canonicalCharacterIds).sort(),canonicalIds.slice().sort());
 assert.deepEqual(Array.from(kits.originalCharacterIds),['balise']);assert.equal(runtime.characters,1);
 assert.equal(bosses.ready,true);assert.deepEqual(Object.keys(bosses.encounters),['ldm-boss-consignateur']);assert.equal(runtime.bosses,1);assert.equal(runtime.enemies,0);
 for(const s of ready){assert(scope.window.StrandContent.arenas[s.id]);assert.equal(scope.window.StrandAssets.stageGeometry[s.id].legacy.floorY,images[s.id].floorY);assert.equal(scope.window.StrandAssets.stages[s.id],images[s.id].src);}
});
const html=fs.readFileSync(path.join(root,'extension.html'),'utf8'),controller=fs.readFileSync(path.join(root,'extension.js'),'utf8');
check('The shipped catalogue loads both original art registries before its controller.',()=>{
 const scripts=Array.from(html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g),match=>match[1]),controllerIndex=scripts.indexOf('extension.js');
 assert(controllerIndex>=0);
 for(const file of ['original-kits-assets.js','original-bosses-assets.js'])assert(scripts.indexOf(file)>=0&&scripts.indexOf(file)<controllerIndex,file);
});
function harness(hash=''){
 let doc;const nodes=new Map();
 class Element{
  constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.attributes={};this.listeners={};this.className='';this.text='';this.open=false;this.hidden=false;this.classList={toggle:(name,on)=>{const all=new Set(this.className.split(/\s+/).filter(Boolean));on?all.add(name):all.delete(name);this.className=[...all].join(' ');}};}
  set textContent(t){this.text=String(t);this.children=[];}get textContent(){return this.text+this.children.map(c=>c.textContent).join('');}get childNodes(){return this.children;}
  set innerHTML(_){throw Error('Catalogue content must be written as text, not executable HTML');}
  append(...items){for(const child of items){child.parentNode=this;this.children.push(child);}}
  prepend(...items){for(const child of items)child.parentNode=this;this.children.unshift(...items);}
  replaceChildren(...items){for(const child of this.children)child.parentNode=null;this.children=[];this.text='';this.append(...items);}
  setAttribute(k,v){this.attributes[k]=String(v);}getAttribute(k){return this.attributes[k];}
  addEventListener(k,fn){(this.listeners[k]||=[]).push(fn);}emit(k,other={}){for(const fn of this.listeners[k]||[])fn({target:this,...other});}
  get isConnected(){for(let p=this;p;p=p.parentNode)if(p===doc.body)return true;return false;}
  focus(){doc.activeElement=this;}showModal(){this.open=true;}close(){this.open=false;this.emit('close');}
  getBoundingClientRect(){return{left:10,top:10,right:990,bottom:690};}
 }
 for(const m of html.matchAll(/<([a-z][a-z0-9]*)\b[^>]*\bid="([^"]+)"[^>]*>/g)){assert(!nodes.has(m[2]));const el=new Element(m[1]);el.id=m[2];nodes.set(m[2],el);}
 function all(){const found=[];function visit(n){found.push(n);n.children.forEach(visit);}visit(doc.body);return found;}
 doc={body:new Element('body'),activeElement:null,createElement:t=>new Element(t),createTextNode:t=>{const n=new Element('text');n.textContent=t;return n;},getElementById:id=>nodes.get(id),querySelectorAll:q=>{assert.equal(q,'[data-category]');return all().filter(n=>n.dataset.category);}};
 nodes.forEach(n=>doc.body.append(n));
 const host={document:doc,StrandContent:structuredClone(canonicalContent),StrandAssets:{},StrandOriginalExtension:structuredClone(data),StrandExtensionAssets:structuredClone(scope.window.StrandExtensionAssets),location:{hash,pathname:'/extension.html',search:''},history:{replaceState:(_a,_b,url)=>{host.location.hash=url.startsWith('#')?url:'';}}};
 loadOriginalModules(host);
 vm.runInNewContext(controller,{window:host});
 const filter=k=>nodes.get('filters').children.find(n=>n.dataset.category===k).emit('click');
 const cards=()=>nodes.get('cards').children;
 return{host,nodes,doc,filter,cards,all};
}
check('The ten character dossiers expose Balise as playable and keep the other nine in design.',()=>{
 const h=harness();assert.equal(h.cards().length,10);
 assert.equal(h.host.StrandOriginalKitsAssets.kits.balise.ready,true);assert.equal(h.host.StrandOriginalKits.artReady,true);
 let playable=0,planned=0;
 for(let i=0;i<10;i++){
  const item=data.characters[i],button=h.cards()[i].children[0];button.emit('click');assert(h.nodes.get('dossier').open);
  assert.equal(h.nodes.get('dossier-title').textContent,item.name);
  const status=h.nodes.get('dossier-status').textContent,link=h.nodes.get('dossier-actions').children.find(node=>node.className==='button');
  if(item.id==='ldm-char-balise'){
   assert.equal(item.playable,true);assert.match(status,/Duel, entraînement et relais/);assert.doesNotMatch(status,/Gameplay prévu/);
   assert(link,'Balise entry missing');assert.equal(link.href,'index.html?ldmFighter=balise');playable++;
  }else{
   assert.notEqual(item.playable,true);assert.match(status,/Gameplay prévu/);assert(!link,'Unimplemented character has a play entry: '+item.id);planned++;
  }
  h.nodes.get('close').emit('click');assert.equal(h.doc.activeElement,button);
 }
 assert.equal(playable,1);assert.equal(planned,9);
});
check('Only the Consignateur boss dossier provides a playable encounter entry.',()=>{
 const h=harness();h.filter('bosses');assert.equal(h.cards().length,20);
 assert.equal(h.host.StrandOriginalBossArt.ready,true);assert.equal(h.host.StrandOriginalBosses.ready,true);
 let playable=0,planned=0;
 for(let i=0;i<20;i++){
  const item=data.bosses[i],button=h.cards()[i].children[0];button.emit('click');
  assert(h.nodes.get('dossier').open);assert.equal(h.nodes.get('dossier-title').textContent,item.name);
  const status=h.nodes.get('dossier-status').textContent,link=h.nodes.get('dossier-actions').children.find(node=>node.className==='button');
  if(item.id==='ldm-boss-consignateur'){
   assert.equal(item.playable,true);assert.match(status,/Rencontre jouable/);assert.doesNotMatch(status,/Gameplay prévu/);
   assert(link,'Consignateur entry missing');assert.equal(link.href,'index.html?ldmBoss=ldm-boss-consignateur');playable++;
  }else{
   assert.notEqual(item.playable,true);assert.match(status,/Gameplay prévu/);assert(!link,'Unimplemented boss has a play entry: '+item.id);planned++;
  }
  h.nodes.get('close').emit('click');assert.equal(h.doc.activeElement,button);
 }
 assert.equal(playable,1);assert.equal(planned,19);
});
check('Category and accent-insensitive search intersect; resetting restores all ten characters.',()=>{
 const h=harness();h.filter('stages');assert.equal(h.cards().length,20);const input=h.nodes.get('search');input.value='SERRE DE VEILLE';input.emit('input');assert.equal(h.cards().length,1);input.value='zzzzzz-no-result';input.emit('input');assert.equal(h.cards().length,0);assert.equal(h.nodes.get('empty').hidden,false);h.nodes.get('reset').emit('click');assert.equal(h.cards().length,10);assert.equal(h.nodes.get('empty').hidden,true);
});
check('Received-only filter never turns planned content into a playable kit.',()=>{
 const h=harness();h.filter('all');const filter=h.nodes.get('with-image');filter.checked=true;filter.emit('change');assert.equal(h.cards().length,Object.keys(images).length);h.filter('props');assert.equal(h.cards().length,0);
});
check('Stage dossiers provide a working local entry; enemy dossiers provide no false play button.',()=>{
 const h=harness();h.filter('stages');const ready=data.stages.find(s=>Number.isFinite(images[s.id]?.floorY));if(ready){h.cards().find(c=>c.children[0].dataset.entityId===ready.id).children[0].emit('click');const link=h.nodes.get('dossier-actions').children.find(n=>n.className==='button');assert.equal(link.href,'index.html?ldmStage='+encodeURIComponent(ready.id));h.nodes.get('close').emit('click');}h.filter('enemies');h.cards()[0].children[0].emit('click');assert(!h.nodes.get('dossier-actions').children.some(n=>n.className==='button'));
});
check('Deep links open known entities, ignore unknown and malformed fragments, and display lore text.',()=>{
 const h=harness('#ldm-char-balise');assert(h.nodes.get('dossier').open);assert(!h.nodes.get('dossier-detail').textContent.includes('LDM-L01'));assert(!h.nodes.get('dossier-detail').textContent.includes('Art brief'));assert(!harness('#unknown').nodes.get('dossier').open);assert(!harness('#%not-valid').nodes.get('dossier').open);
});
const report={date:new Date().toISOString(),passed:true,groups:checks.length,checks,entities:entries.length,received:Object.keys(images).length,receivedBaseImages:Object.keys(images).length,receivedPlayableImages:data.production.receivedPlayableImages,activePlayableImages:data.production.activePlayableImages,archivedPlayableVariants:data.production.archivedPlayableVariants,staticArenas:scope.window.StrandExtensionRuntime.stages.length,totalKits:Object.keys(scope.window.StrandContent.fighters).length,canonicalKits:canonicalIds.length,playableOriginalCharacters:scope.window.StrandExtensionRuntime.characters,playableOriginalBosses:scope.window.StrandExtensionRuntime.bosses,playableOriginalEnemies:scope.window.StrandExtensionRuntime.enemies,interface:'DOM fixture loading original modules and exercising shipped controller; not browser layout',browserVerified:false};
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'catalogue-verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
