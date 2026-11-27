/* Real HTML script order + shipped input-host.cjs DOM/Canvas adapter.
 * This is an integration recipe, not a native browser or visual acceptance test.
 * Art metadata and every required PNG are mandatory; no synthetic art fallback. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {world}=require('./input-host.cjs');
const root=path.resolve(__dirname,'..'),checks=[],pngFiles=new Set();
const BALISE='balise',BOSS='ldm-boss-consignateur',DIGUE='ldm-stage-digue-aval';
const CANON=['sam','fragile','higgs','cliff','mule','diehardman','mama','heartman'];
const copy=value=>JSON.parse(JSON.stringify(value));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
function check(name,fn){fn();checks.push({name,passed:true});console.log('OK — '+name);}
function scripts(page){
  return [...read(page).matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1]);
}
function before(list,first,second){assert(list.includes(first)&&list.includes(second),first+' and '+second+' must be declared');assert(list.indexOf(first)<list.indexOf(second),first+' must precede '+second);}
function augmentDOM(w,url){
  // Add missing browser primitives to the existing event host. No application,
  // engine, catalogue or asset implementation is replaced by this adapter.
  const proto=w.Node.prototype,append=proto.append;
  proto.append=function(...nodes){for(const node of nodes)append.call(this,node);};
  proto.replaceChildren=function(...nodes){for(const child of this.children)child.parentNode=null;this.children=[];this._text='';this._html='';this.append(...nodes);};
  proto.prepend=function(...nodes){const rest=this.children.slice();this.children=[];this.append(...nodes,...rest);};
  proto.remove=function(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(child=>child!==this);this.parentNode=null;}};
  Object.defineProperty(proto,'childNodes',{configurable:true,get(){return this.children;}});
  w.document.createTextNode=text=>{const node=new w.Node('#text');node.textContent=text;return node;};
  const location={};
  const setLocation=value=>{const next=new URL(value,location.href||url.href);for(const key of ['href','protocol','origin','pathname','search','hash'])location[key]=next[key];};
  setLocation(url.href);w.context.location=w.host.location=location;
  w.host.history={replaceState(_state,_title,value){setLocation(value);}};
  w.host.setTimeout=w.context.setTimeout;w.host.clearTimeout=w.context.clearTimeout;
  w.host.localStorage.removeItem=key=>{w.operations.push(['remove',key]);w.storage.delete(key);};
}
function make(href='index.html',storage=new Map()){
  const url=new URL(href,'http://localhost/modes/echos-de-la-greve/');
  const page=path.basename(url.pathname),w=world({gamepads:false,storage});
  augmentDOM(w,url);w.html(page);w.load(scripts(page));
  w.page=page;w.url=url;
  return w;
}
function dispose(w){w.send(w.host,'pagehide');w.queue.clear();w.timers.clear();}
function text(w,id='view'){return w.document.getElementById(id)?.textContent||'';}
function cards(w){return w.document.querySelectorAll('[data-act="pick"]').map(node=>node.dataset.id);}
function options(node){assert(node,'Missing select');return node.children.filter(child=>child.tagName==='OPTION').map(child=>child.value);}
function select(w,key){return w.document.querySelector('[data-option="'+key+'"]');}
function pressed(w,id){return w.document.querySelectorAll('[data-act="pick"]').find(node=>node.dataset.id===id)?.getAttribute('aria-pressed')==='true';}
function until(w,condition,limit=400){for(let i=0;i<limit;i++){if(condition())return;w.frames();}assert(condition(),'UI/simulation did not reach the expected state within '+limit+' frames');}
function startDuel(w){w.click('[data-act="start"]');const enter=w.document.querySelector('[data-act="enterDuel"]');if(enter)w.click(enter);until(w,()=>w.host.StrandFight.snapshot()?.phase==='fight');return w.host.StrandFight.snapshot();}
function assertRoster(actual,expected,label){assert.deepEqual([...actual].sort(),[...expected].sort(),label);}
function png(src,geometry,label){
  assert.equal(typeof src,'string',label+' source');assert(src.startsWith('assets/'),label+' source must be a local asset');
  const file=path.resolve(root,src);assert(file.startsWith(root+path.sep),label+' escaped asset root');
  assert(fs.existsSync(file),label+' missing PNG '+src);const bytes=fs.readFileSync(file);
  assert(bytes.length>32&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),label+' must be an actual PNG');
  const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20),crop=geometry?.crop;
  assert(width>0&&height>0&&Array.isArray(crop)&&crop.length===4&&crop.every(Number.isFinite),label+' geometry');
  assert(crop[0]>=0&&crop[1]>=0&&crop[2]>0&&crop[3]>0&&crop[0]+crop[2]<=width&&crop[1]+crop[3]<=height,label+' crop outside native PNG');
  for(const key of ['anchorX','baselineY'])assert(Number.isFinite(geometry[key])&&geometry[key]>=0&&geometry[key]<=1,label+' '+key);
  pngFiles.add(src);
}
function catalogueLink(w,id){
  const groups=id.startsWith('ldm-char-')?'characters':id.startsWith('ldm-boss-')?'bosses':'stages';
  w.click('[data-category="'+groups+'"]');w.click('[data-entity-id="'+id+'"]');
  assert(w.document.getElementById('dossier').open,'Dossier did not open');
  const link=w.document.getElementById('dossier-actions').querySelectorAll('a').find(node=>(node.href||node.getAttribute('href')||'').startsWith('index.html?'));
  assert(link,'Missing playable link for '+id);const href=link.href||link.getAttribute('href');w.click('#close');return href;
}
function originalCheckpoint(seed,kind){
  // Validated saved encounters are explicit fixtures for the result/resume
  // screens. End conditions still run through the real engine and UI callbacks.
  const cp=copy(seed),s=cp.state,o=s.original,b=s.boss,p=s.p;
  s.phase='active';s.phaseTicks=0;s.tick=1000;s.remaining=17075;s.result=null;s.shots=[];s.hazards=[];s.effects=[];
  Object.assign(p,{x:kind==='victory'?940:32,y:0,vy:0,hp:120,energy:87,guardMeter:82,guard:false,crouch:false,keys:{},taps:{},act:null,stun:0,invuln:0,shield:0,walk:0,marker:null,flash:0});
  Object.assign(b,{x:940,face:-1,hp:kind==='victory'?0:50,maxHp:300,tier:3,cycle:1,phase:kind==='victory'?'defeated':'attack',
    timer:kind==='victory'?0:19,attack:null,stagger:0,flash:0,exposed:0});
  Object.assign(o,{phase:3,consoles:[true,true],register:kind==='victory'?'retrieved':'ground',registerX:685,
    freightIntegrity:kind==='victory'?100:25,surrendered:false,speed:1});
  s.stats.damageDealt=300-b.hp;
  o.phaseStart={...copy(o.phaseStart),phase:3,guard:99,bossX:940,playerX:32,playerHp:113,energy:73,guardMeter:89,marker:null,
    tick:800,remaining:17275,nextId:s.nextId,seed:o.seed,stats:{...copy(s.stats),damageDealt:201,cargoHits:0},
    objectiveFlags:{consoles:[true,true],register:'ground',freightIntegrity:100,surrendered:false}};
  if(kind!=='victory')b.attack={type:'passage-restraint',target:685,from:940,to:685,markers:[{x:685,w:245,h:180}],
    age:11,hit:false,depot:false,warning:90,active:30,name:'RETENUE DE PASSAGE',advice:'Récupérez le registre pendant la reprise.'};
  return cp;
}
function storeCheckpoint(w,cp){
  const e=w.host.StrandBoss;assert(e.validCheckpoint(cp),'Result fixture must pass the real checkpoint validator');
  const storage=new Map(w.storage),progress=e.progress();progress.checkpoint=copy(cp);
  storage.set(e.storageKey,JSON.stringify(progress));return storage;
}

check('HTML declares the complete dependency order on all three entry pages',()=>{
  const index=scripts('index.html'),team=scripts('teams.html'),catalogue=scripts('extension.html');
  for(const list of [index,team]){before(list,'content.js','assets.js');before(list,'assets.js','original-kits.js');before(list,'original-kits-assets.js','original-kits.js');before(list,'original-kits.js','fight.js');}
  before(index,'original-bosses-assets.js','original-bosses.js');before(index,'original-bosses.js','boss.js');before(index,'boss.js','app.js');before(index,'fight.js','app.js');
  before(team,'fight.js','teams.js');before(team,'input.js','teams.js');
  before(catalogue,'original-kits-assets.js','extension.js');before(catalogue,'original-bosses-assets.js','extension.js');
});

check('Real complete art enables Balise and Consignateur; every required native crop exists',()=>{
  const w=make(),kit=w.host.StrandOriginalKits,boss=w.host.StrandOriginalBosses,art=w.host.StrandOriginalKitsAssets?.kits?.balise,bossArt=w.host.StrandOriginalBossArt;
  assert(kit?.enabled&&kit.artReady&&art?.ready,'Balise cannot pass with incomplete or synthetic art');
  assert(boss?.ready&&bossArt?.ready,'Consignateur cannot pass with incomplete art');
  assertRoster(kit.originalCharacterIds,[BALISE],'active original roster');assertRoster(kit.canonicalCharacterIds,CANON,'canonical roster');
  const poses=['stance','guard','crouch','jump','light','heavy','hurt','tether','anchor','reel','fall','taunt','victory','walk1','walk2'];
  for(const pose of poses)for(const side of ['left','right']){
    const descriptor=art.poses?.[pose]?.[side];assert(descriptor,pose+' '+side);png(descriptor.src,descriptor,'Balise '+pose+' '+side);
    assert(Number.isFinite(descriptor.heightRatio)&&descriptor.heightRatio>=.1&&descriptor.heightRatio<=2,'pose height ratio');
  }
  for(const pose of poses)assert.notEqual(JSON.stringify([art.poses[pose].left.src,art.poses[pose].left.crop]),JSON.stringify([art.poses[pose].right.src,art.poses[pose].right.crop]),pose+' must select real directional sources/crops');
  for(const prop of ['anchor','ropeHook'])png(art.props[prop]?.src,art.props[prop],'Balise '+prop);
  for(const pose of ['guard','shield-push','pole-strike','stagger','kneel','surrender'])png(bossArt.sprites?.consignateur?.[pose],bossArt.geometry?.bosses?.consignateur?.[pose],'Consignateur '+pose);
  for(const prop of ['console-active','console-inactive','register'])png(bossArt.props?.[prop],bossArt.propGeometry?.[prop],'Consignateur '+prop);
  assert.equal(w.host.StrandAssets.fighters.balise,art.poses.stance.right.src);assert.equal(w.host.StrandAssets.portraits.balise,art.poses.stance.right.src);
  dispose(w);
});

check('Catalogue Balise link opens real training selection and an actual Balise duel',()=>{
  const catalogue=make('extension.html'),href=catalogueLink(catalogue,'ldm-char-balise');assert.equal(new URL(href,'http://localhost').searchParams.get('ldmFighter'),'balise');dispose(catalogue);
  const w=make(href);assertRoster(cards(w),[...CANON,BALISE],'training cards');assert(pressed(w,BALISE),'Balise not selected');
  assert.equal(select(w,'stage').value,DIGUE);assertRoster(options(select(w,'p2')),[...CANON,BALISE],'training opponent choices');
  const slot=w.document.querySelector('[data-presentation-slot="0"]');assert(slot&&slot.textContent.includes('Balise'),'selected Balise presentation slot is blank');
  assert(slot.querySelectorAll('img').some(image=>image.src===w.host.StrandAssets.fighters.balise),'selected Balise preview missing');
  const state=startDuel(w);assert.equal(state.mode,'training');assert.equal(state.fighters[0].id,BALISE);assert.equal(state.stage,DIGUE);dispose(w);
});

check('Commandes exposes Balise techniques and all six exact public frame rows',()=>{
  const w=make('index.html?ldmFighter=balise');w.click('#controlsLink');
  assert(w.document.getElementById('manual').open,'Commandes dialog did not open');const body=text(w,'keys'),sheet=w.host.StrandContent.fighters.balise.frameData;
  assert.equal(sheet.length,6);assert.equal(body.includes('undefined'),false,'undefined move label');
  for(const move of sheet){assert(body.includes(move.name),'Missing '+move.name);assert(body.includes([move.start,move.active,move.recover].join(' / ')),'Missing frame data '+move.name);}
  const signatures=w.host.StrandContent.fighters.balise.techniques;assert.equal(signatures.length,3);
  for(const [,name,cost]of signatures){assert(body.includes(name),'Missing signature '+name);assert(body.includes(String(cost)),'Missing cost '+name);}
  w.document.getElementById('manual').close();startDuel(w);w.click('#controlsLink');assert(w.host.StrandFight.snapshot().paused,'Manual did not pause training');
  w.document.getElementById('manual').close();assert(!w.host.StrandFight.snapshot().paused,'Manual did not resume training');dispose(w);
});

check('Versus CPU and local J2 both expose nine kits and run Balise correctly',()=>{
  for(const opponent of ['cpu','local']){
    const w=make('index.html?ldmFighter=balise');w.click('[data-act="home"]');w.click('[data-mode="versus"]');
    assertRoster(cards(w),[...CANON,BALISE],'versus cards');assert(pressed(w,BALISE),'compatible mode lost Balise');
    w.change('[data-option="opponent"]',opponent);assertRoster(options(select(w,'p2')),[...CANON,BALISE],'versus opponents');
    if(opponent==='local')w.change('[data-option="p2"]',BALISE);
    const state=startDuel(w);assert.equal(state.mode,opponent);assert.equal(state.fighters[0].id,BALISE);if(opponent==='local')assert.equal(state.fighters[1].id,BALISE);
    dispose(w);
  }
});

check('After selecting Balise, every canonical mode restores eight eligible kits without crashing',()=>{
  for(const mode of ['story','arcade','tournament','challenges','boss','bossrush']){
    const w=make('index.html?ldmFighter=balise');w.change('[data-option="p2"]',BALISE);w.click('[data-act="home"]');w.click('[data-mode="'+mode+'"]');
    assertRoster(cards(w),CANON,mode+' canonical cards');assert(pressed(w,'sam'),mode+' must reset unsupported selected fighter');
    assert(!w.document.querySelector('[data-act="pick"][data-id="balise"]'),mode+' exposed Balise');
    if(mode==='tournament'){w.change('[data-option="humans"]','2');assertRoster(options(select(w,'p2')),CANON,'tournament J2');assert.notEqual(select(w,'p2').value,BALISE,'unsupported J2 retained');}
    if(['story','arcade','tournament','challenges'].includes(mode)){w.click('[data-act="start"]');assert(text(w).length>30,mode+' start rendered an empty screen');}
    if(mode==='boss')assert.equal(w.document.querySelectorAll('[data-act="pickBoss"]').length,7);
    if(mode==='bossrush'){assert.equal(w.host.StrandBoss.rush.order.length,6);assert(!w.host.StrandBoss.rush.order.includes(BOSS));}
    dispose(w);
  }
});

check('Guided dojo keeps eight kits and rejects a persisted Balise lesson resume',()=>{
  const w=make('index.html?ldmFighter=balise');w.click('[data-act="lessons"]');assertRoster(options(w.document.querySelector('[data-lesson-fighter]')),CANON,'guided dojo');
  w.click('[data-act="startLesson"]');until(w,()=>w.host.StrandFight.snapshot()?.phase==='fight');assert(CANON.includes(w.host.StrandFight.snapshot().fighters[0].id));dispose(w);
  const progress={version:1,completed:{},resume:{id:'signatures',fighter:BALISE}},storage=new Map([['echos.lessons.v1',JSON.stringify(progress)]]);
  const second=make('index.html?ldmFighter=balise',storage);assert.equal(second.host.StrandLessons.valid(progress),false,'original lesson resume accepted');
  assert.equal(second.host.StrandLessons.createStore().begin('signatures',BALISE),false,'original lesson begin accepted');
  assert.throws(()=>second.host.StrandLessons.createSession('signatures',BALISE));
  second.click('[data-act="lessons"]');assertRoster(options(second.document.querySelector('[data-lesson-fighter]')),CANON,'restored dojo roster');
  assert(!second.document.querySelector('[data-act="startLesson"][data-fighter="balise"]'),'incompatible resume button remained');
  second.click('[data-act="startLesson"]');until(second,()=>second.host.StrandFight.snapshot()?.phase==='fight');assert(CANON.includes(second.host.StrandFight.snapshot().fighters[0].id));dispose(second);
});

check('Relais exposes nine real previews, validates duplicates, starts, saves and resumes Balise',()=>{
  const w=make('teams.html');
  for(const side of [0,1])for(const member of [0,1])assertRoster(options(w.document.getElementById('teamMember'+side+member)),[...CANON,BALISE],'Relais roster');
  w.change('#teamMember00',BALISE);assert.equal(w.document.getElementById('teamPreview00').src,w.host.StrandAssets.fighters.balise);
  assert(text(w,'teamSupport00').includes('Ligne de vie'),'Balise support label missing');
  w.change('#teamMember01',BALISE);assert(w.document.getElementById('teamStart').disabled,'duplicate team accepted');w.change('#teamMember01','sam');assert(!w.document.getElementById('teamStart').disabled);
  w.change('#teamOpponent','local');w.click('#teamStart');until(w,()=>w.host.StrandFight.snapshot()?.phase==='fight');assert.equal(w.host.StrandFight.snapshot().fighters[0].id,BALISE);
  w.click('#teamSave');const saved=JSON.parse(w.storage.get('echos.teams.v1'));assert.equal(saved.originalRules,'balise-1');assert(w.host.StrandFight.team.validCheckpoint(saved));
  assert(!w.document.getElementById('teamSetup').hidden);w.click('#teamResume');assert(w.host.StrandFight.snapshot().paused);assert.equal(w.host.StrandFight.snapshot().fighters[0].id,BALISE);
  w.click('#teamPause');assert(!w.host.StrandFight.snapshot().paused);dispose(w);
});

check('Catalogue Consignateur link selects the seventh boss, forces Digue and applies both scenario speeds',()=>{
  const catalogue=make('extension.html'),href=catalogueLink(catalogue,BOSS);assert.equal(new URL(href,'http://localhost').searchParams.get('ldmBoss'),BOSS);dispose(catalogue);
  const w=make(href);assert.equal(w.document.querySelectorAll('[data-act="pickBoss"]').length,7);
  assert.equal(w.document.querySelector('[data-boss="'+BOSS+'"]').getAttribute('aria-pressed'),'true');assertRoster(cards(w),CANON,'Boss player roster');assertRoster(Object.keys(w.host.StrandBoss.players),CANON,'Boss engine player roster');
  assert.deepEqual(options(select(w,'bossStage')),['recommended'],'original encounter offered unrelated stage');
  assert.deepEqual(options(select(w,'scenarioSpeed')).sort(),['0.75','1','1.25'].sort());
  w.change('[data-option="bossStage"]','shore');assert.equal(select(w,'bossStage').value,'recommended','original stage constraint bypassed');
  w.change('[data-option="scenarioSpeed"]','1.25');w.click('[data-act="startBoss"]');let state=w.host.StrandBoss.snapshot();
  assert.equal(state.bossId,BOSS);assert.equal(state.stage,DIGUE);assert.equal(state.original.speed,1.25);
  w.click('[data-act="pause"]');w.click('[data-act="leave"]');w.change('[data-option="scenarioSpeed"]','0.75');w.click('[data-act="startBoss"]');state=w.host.StrandBoss.snapshot();
  assert.equal(state.stage,DIGUE);assert.equal(state.original.speed,.75);dispose(w);
});

check('Boss Rush remains exactly six canonical encounters and eight player choices',()=>{
  const w=make();w.click('[data-mode="bossrush"]');assertRoster(cards(w),CANON,'Rush players');
  assert.deepEqual(copy(w.host.StrandBoss.rush.order),['lion','squid','whale','giant','truck','convoy']);
  w.click('[data-act="newRush"]');assert.equal(w.host.StrandBoss.snapshot().bossId,'lion');assert(!w.host.StrandBoss.rush.order.includes(BOSS));
  assert.equal(w.host.StrandBoss.rush.progress().run.index,0);dispose(w);
});

check('Register loss renders the specific result and resumes the saved phase with its resources',()=>{
  const initial=make('index.html?ldmBoss='+BOSS);initial.click('[data-act="startBoss"]');
  const fixture=originalCheckpoint(initial.host.StrandBoss.checkpoint(),'loss'),expected=copy(fixture.state.original.phaseStart),storage=storeCheckpoint(initial,fixture);dispose(initial);
  const w=make('index.html?ldmBoss='+BOSS,storage);w.click('[data-act="resumeBoss"]');until(w,()=>text(w).includes('Registre endommagé'));
  assert(text(w).includes('Phase atteinte')&&text(w).includes('3 / 3'),'original result details missing');
  const button=w.document.querySelector('[data-act="resumeBoss"]');assert(button&&button.textContent.includes('Reprendre cette phase'),'phase retry button missing');
  const checkpoint=w.host.StrandBoss.progress().checkpoint;assert(w.host.StrandBoss.validCheckpoint(checkpoint));
  w.click(button);const state=w.host.StrandBoss.snapshot();
  assert.equal(state.original.phase,3);assert.equal(state.stage,DIGUE);assert.equal(state.phase,'intro');assert.equal(state.p.hp,expected.playerHp);assert.equal(state.p.energy,expected.energy);
  assert.equal(state.p.guardMeter,expected.guardMeter);assert.equal(state.boss.hp,99);assert.equal(state.remaining,expected.remaining);
  assert.equal(state.original.register,'ground');assert.equal(state.original.freightIntegrity,100);assert.deepEqual(copy(state.original.consoles),[true,true]);
  until(w,()=>w.host.StrandBoss.snapshot()?.phase==='active');assert(w.host.StrandBoss.validCheckpoint(w.host.StrandBoss.checkpoint()));dispose(w);
});

check('A saved kneeling Consignateur requires the real interaction before the non-lethal result',()=>{
  const initial=make('index.html?ldmBoss='+BOSS);initial.click('[data-act="startBoss"]');
  const fixture=originalCheckpoint(initial.host.StrandBoss.checkpoint(),'victory'),storage=storeCheckpoint(initial,fixture);dispose(initial);
  const w=make('index.html?ldmBoss='+BOSS,storage);w.click('[data-act="resumeBoss"]');assert.equal(w.host.StrandBoss.snapshot().phase,'active');
  w.frames(2);assert.equal(w.host.StrandBoss.snapshot().phase,'active','zero guard auto-won before interaction');
  w.key('t');w.key('t',false);until(w,()=>text(w).includes('Passage rouvert · reddition acceptée'));
  assert(text(w).includes('Reddition non létale'));assert(!w.document.querySelector('[data-act="resumeBoss"]'),'victory incorrectly retained retry');
  assert.equal(w.host.StrandBoss.progress().checkpoint,null);const record=w.host.StrandBoss.progress().records['sam:'+BOSS+':normal'];
  assert.equal(record.wins,1);assert.equal(record.attempts,1);dispose(w);
});

check('All twenty catalogue arena links still select and start their actual training stage',()=>{
  const catalogue=make('extension.html'),stages=catalogue.host.StrandOriginalExtension.stages;assert.equal(stages.length,20);
  for(const stage of stages){
    const href=catalogueLink(catalogue,stage.id);assert.equal(new URL(href,'http://localhost').searchParams.get('ldmStage'),stage.id);
    const w=make(href);assert.equal(select(w,'stage').value,stage.id,'stage selection '+stage.id);assert(w.host.StrandExtensionRuntime.stages.includes(stage.id));
    assertRoster(cards(w),[...CANON,BALISE],'original stage must retain local roster');
    const state=startDuel(w);assert.equal(state.mode,'training');assert.equal(state.stage,stage.id,'stage launch '+stage.id);
    dispose(w);
  }
  dispose(catalogue);
});

const report={date:'2026-11-27',suite:'first-playable-entrypoints',adapter:'Shipped input-host.cjs event DOM/Canvas simulation; native PNG existence/crop checks; not browser/visual acceptance',
  pages:Object.fromEntries(['index.html','teams.html','extension.html'].map(page=>[page,scripts(page)])),
  requiredRasterFiles:pngFiles.size,arenaLinks:20,checks,
  sourceSha256:Object.fromEntries(['app.js','presentation.js','lessons.js','teams.js','fight.js','boss.js','original-kits.js','original-bosses.js'].map(file=>[file,crypto.createHash('sha256').update(read(file)).digest('hex')]))};
const output=process.argv.find(argument=>argument.startsWith('--output='));
if(output){const file=path.resolve(output.slice(9));fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');}
console.log(checks.length+' integration groups passed; 20 arena links verified; '+pngFiles.size+' real required PNGs.');
