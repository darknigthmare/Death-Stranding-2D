/* Delivery gate for the first playable originals.
 * Reads Git/source/PNG metadata and exercises the real local relay over HTTP.
 * It neither draws images nor simulates combat. Run from a full-history checkout. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const BASE='07c818cd3942c0e1925bb0cc32dfe73da19ff297',BALISE='ldm-char-balise',BOSS='ldm-boss-consignateur';
const PACK='assets/lignes-de-maree/playable/',MODE='modes/echos-de-la-greve/';
const CANON=['sam','fragile','higgs','cliff','mule','diehardman','mama','heartman'];
const POSES=['stance','guard','crouch','jump','light','heavy','hurt','tether','anchor','reel','fall','taunt','victory','walk1','walk2'];
const BOSS_POSES=['guard','shield-push','pole-strike','stagger','kneel','surrender'];
const MODULES=['original-kits-assets.js','original-kits.js','original-bosses-assets.js','original-bosses.js'];
const cataloguePath='docs/combat/extensions/lignes-de-maree/catalog.json';
const out=path.resolve(process.argv.find(arg=>arg.startsWith('--output='))?.slice(9)||path.join(repo,'docs/combat/production/20261127-first-playable/delivery-verification.json'));
const copy=value=>JSON.parse(JSON.stringify(value)),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const hash=(bytes,kind='sha256')=>crypto.createHash(kind).update(bytes).digest('hex');
const blobHash=bytes=>hash(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes]),'sha1');
const sorted=values=>[...values].sort(),same=(actual,expected,label)=>assert.deepEqual(sorted(actual),sorted(expected),label);
const checks=[],assets=[],sourceHashes={};
function check(name,fn){const detail=fn();checks.push({name,passed:true,...detail});console.log('OK — '+name);return detail;}
function git(...args){try{return execFileSync('git',args,{cwd:repo,encoding:'utf8',maxBuffer:32*1024*1024});}catch(error){throw new Error('Git reference '+BASE+' must be available in this checkout (actions/checkout fetch-depth: 0). '+error.message);}}
function gitFiles(ref){return git('ls-tree','-r','-z','--full-tree',ref).split('\0').filter(row=>/^\d+ blob /.test(row)).map(row=>{
  const match=row.match(/^(\d+) blob ([0-9a-f]{40})\t([\s\S]+)$/);assert(match,'Unexpected Git tree entry');return {mode:match[1],sha:match[2],path:match[3]};});}
function scripts(page){return [...read(page).matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match=>match[1]);}
const engineFiles=new Set(['content.js','asset-geometry-20261124.js','assets.js','extension-data.js','extension-assets.js','extension-runtime.js',
  'presentation-assets.js','presentation.js','boss-geometry-20261124.js','boss-assets.js','tournament.js',...MODULES,
  'fight.js','boss.js','campaign.js','moves-data.js','lessons.js']);
function registry(includeOriginals=true){
  const storage=new Map(),window={localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)}};
  const context=vm.createContext({window,console,structuredClone});
  const loaded=[];
  for(const file of scripts('index.html')){
    if(!engineFiles.has(file)||!includeOriginals&&MODULES.includes(file))continue;
    const source=read(file);sourceHashes[file]=hash(Buffer.from(source));
    vm.runInContext(source,context,{filename:file});loaded.push(file);
  }
  return {window,context,loaded};
}
function safeSource(src){
  assert(typeof src==='string'&&src.startsWith(PACK)&&/\.png$/.test(src),'Runtime source must be a new pack PNG: '+src);
  const absolute=path.resolve(root,src);assert(absolute.startsWith(path.join(root,PACK)), 'Source escaped playable pack');
  const stat=fs.lstatSync(absolute);assert(stat.isFile()&&!stat.isSymbolicLink(),'Source must be a real file: '+src);
  assert.equal(fs.realpathSync(absolute),absolute,'Symlinked source is not a delivered image');
  return absolute;
}
function png(src,geometry,label,face){
  const file=safeSource(src),bytes=fs.readFileSync(file);
  assert(bytes.length>33&&bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),label+' is not a PNG');
  assert.equal(bytes.toString('ascii',12,16),'IHDR',label+' has no native IHDR');
  const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
  assert(width>0&&height>0,label+' native dimensions');
  if(geometry){
    const crop=geometry.crop;assert(Array.isArray(crop)&&crop.length===4&&crop.every(Number.isInteger),label+' measured integer crop');
    assert(crop[0]>=0&&crop[1]>=0&&crop[2]>0&&crop[3]>0&&crop[0]+crop[2]<=width&&crop[1]+crop[3]<=height,label+' crop outside PNG');
    for(const key of ['anchorX','baselineY'])assert(Number.isFinite(geometry[key])&&geometry[key]>=0&&geometry[key]<=1,label+' '+key);
    assert(Number.isFinite(geometry.heightRatio)&&geometry.heightRatio>=.1&&geometry.heightRatio<=2,label+' display ratio');
    if(face)assert.equal(geometry.nativeFacing,face==='left'?-1:1,label+' native orientation');
  }
  return {label,src,repoPath:MODE+src,sha256:hash(bytes),gitBlob:blobHash(bytes),width,height,bytes:bytes.length,
    crop:geometry?[...geometry.crop]:null,nativeFacing:geometry?.nativeFacing??null,pngColorType:bytes[25]};
}
function expression(source,pattern,label,context){
  const match=source.match(pattern);assert(match,label+' source declaration changed: update this source inspection deliberately');
  return vm.runInNewContext('('+match[1]+')',context,{filename:label});
}
function verifyModes(w){
  const h=w.window,kit=h.StrandOriginalKits;
  assert(kit?.enabled&&kit.artReady,'Balise runtime must be active');
  same(kit.canonicalCharacterIds,CANON,'Canonical roster changed');
  same(kit.originalCharacterIds,['balise'],'Only Balise is admitted as an original kit');
  same(kit.localModes,['versus','training','teams'],'Original kit modes');
  assert.equal(kit.compatibleLocalOnly,true);
  same(Object.keys(h.StrandContent.fighters),[...CANON,'balise'],'Local roster');
  const sheet=h.StrandContent.fighters.balise;
  assert.equal(sheet.storyReady,false);assert.equal(sheet.finisherReady,false);
  assert.equal(kit.production.fullAnimation,false,'Key poses must not be advertised as a full animation');
  assert.equal(h.StrandAssets.fighters.balise,h.StrandOriginalKitsAssets.kits.balise.poses.stance.right.src,'Selection stance mapping');
  assert.equal(h.StrandAssets.portraits.balise,h.StrandAssets.fighters.balise,'Selection preview mapping');
  const app=read('app.js'),config={mode:'versus'};
  const selectable=expression(app,/const selectableIds\s*=\s*([^;\n]+);/,'app.selectableIds',{config,localIds:[...CANON,'balise'],ids:CANON});
  const selections={};
  for(const mode of ['versus','training','story','arcade','tournament','challenges','boss','bossrush','campaign']){
    config.mode=mode;const ids=[...selectable()];same(ids,['versus','training'].includes(mode)?[...CANON,'balise']:CANON,'Selection '+mode);selections[mode]=ids;
  }
  const teamIds=expression(read('teams.js'),/const ids\s*=\s*([^;]+);/,'teams.ids',{window:h});same(teamIds,[...CANON,'balise'],'Relais roster');
  assert(h.StrandFight.team.validSelection([['balise','sam'],['higgs','fragile']]),'Balise team selection unavailable');
  for(const id of CANON)for(const [opponent]of h.StrandContent.fighters[id].route||[])assert(CANON.includes(opponent),'Story/arcade original opponent');
  for(const chapter of h.StrandCampaign.chapters){assert(CANON.includes(chapter.p1),'Campaign original protagonist');if(chapter.p2)assert(CANON.includes(chapter.p2),'Campaign original opponent');assert.notEqual(chapter.boss,BOSS,'Original encounter entered a canonical campaign');}
  same(Object.keys(h.StrandBoss.players),CANON,'Boss player roster');
  assert.equal(Object.keys(h.StrandBoss.encounters).length,7,'Expected six legacy encounters and Consignateur');
  assert.equal(h.StrandBoss.encounters[BOSS]?.stage,'ldm-stage-digue-aval','Original encounter arena');
  same(h.StrandBoss.rush.order,['lion','squid','whale','giant','truck','convoy'],'Boss Rush must remain six legacy encounters');
  const store=h.StrandLessons.createStore(),lesson=h.StrandLessons.lessons[0].id;
  assert.equal(store.begin(lesson,'balise'),false,'Guided lesson accepted Balise');
  assert.equal(store.complete(lesson,'balise'),false,'Guided lesson completion accepted Balise');
  assert.throws(()=>h.StrandLessons.createSession(lesson,'balise'),/Exercice ou fiche de combattant indisponible/);
  let draws=0,normalized=0;
  for(let seed=0;seed<64;seed++)for(const count of [4,6,8])for(const humans of [1,2]){
    for(const originalInput of [false,true]){
      const config={seed,count,humans,difficulty:'normal',p1:originalInput?'balise':'sam',p2:originalInput?'balise':'higgs'};
      const before=JSON.stringify(config),cup=h.StrandTournament.create(config);
      assert.equal(JSON.stringify(config),before,'Tournament must not mutate its configuration');
      assert.equal(cup.entrants.length,count);
      for(const entrant of cup.entrants)assert(CANON.includes(entrant.fighter),'Tournament admitted original '+entrant.fighter);
      if(originalInput)normalized++;else draws++;
    }
  }
  const netScripts=scripts('netplay.html');assert(MODULES.every(file=>!netScripts.includes(file)),'Network HTML loads original runtime');
  const base=registry(false).window;
  same(Object.keys(base.StrandContent.fighters),CANON,'Missing original modules must preserve eight kits');
  assert.equal(Object.keys(base.StrandBoss.encounters).length,6,'Missing original modules must preserve six encounters');
  assert.equal(h.StrandExtensionRuntime.characters,1);assert.equal(h.StrandExtensionRuntime.bosses,1);assert.equal(h.StrandExtensionRuntime.enemies,0);
  assert.equal(base.StrandExtensionRuntime.characters,0);assert.equal(base.StrandExtensionRuntime.bosses,0);
  return {selections,teams:[...teamIds],tournamentDraws:draws,invalidTournamentInputsNormalized:normalized,bossEncounters:7,rushEncounters:6,
    observation:'Selection expressions are evaluated from their actual source; full UI interactions belong to first-playable-entrypoints.cjs.'};
}
function request(server,route,body){
  return new Promise((resolve,reject)=>{
    const bytes=body===undefined?null:Buffer.from(JSON.stringify(body));
    const req=http.request({host:'127.0.0.1',port:server.address().port,path:route,method:bytes?'POST':'GET',agent:false,
      headers:bytes?{'Content-Type':'application/json','Content-Length':bytes.length}:{}},res=>{
      const chunks=[];res.on('data',chunk=>chunks.push(chunk));res.on('error',reject);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)}));
    });req.on('error',reject);req.setTimeout(15000,()=>req.destroy(new Error('Local HTTP timeout: '+route)));if(bytes)req.write(bytes);req.end();
  });
}
async function verifyHTTP(paths,catalogue){
  const relay=require(path.join(root,'netplay-server.cjs')),server=relay.openRelay(),results=[];
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  try{
    for(const src of paths)for(const prefix of ['/','/'+MODE]){
      const response=await request(server,prefix+src),bytes=fs.readFileSync(path.join(root,src));
      assert.equal(response.status,200,'Actual relay rejected '+prefix+src);
      assert(response.body.equals(bytes),'HTTP body differs from delivered file '+src);
      assert.equal(Number(response.headers['content-length']),bytes.length,'HTTP Content-Length '+src);
      const expected=src.endsWith('.png')?'image/png':'text/javascript';
      assert((response.headers['content-type']||'').startsWith(expected),'HTTP Content-Type '+src);
      results.push({url:prefix+src,status:response.status,bytes:bytes.length,sha256:hash(response.body)});
    }
    const catalogResponse=await request(server,'/'+cataloguePath);
    assert.equal(catalogResponse.status,200,'Real catalogue must be served by the repository relay');
    assert(catalogResponse.body.equals(fs.readFileSync(path.join(repo,cataloguePath))),'HTTP catalogue differs from source');
    for(const route of ['/netplay-server.cjs','/qa/first-playable-delivery.cjs','/assets/lignes-de-maree/playable/missing.png']){
      assert.equal((await request(server,route)).status,404,'Relay allowlist unexpectedly serves '+route);
    }
    const versionResponse=await request(server,'/room-version.js');assert.equal(versionResponse.status,200);
    const match=versionResponse.body.toString('utf8').match(/window\.StrandRoomVersion\s*=\s*("[^"]+")/);assert(match,'Room version script missing');
    const version=JSON.parse(match[1]),token=crypto.randomBytes(24).toString('base64url');
    const created=await request(server,'/room',{op:'create',token,version});assert.equal(created.status,200);
    const room=JSON.parse(created.body).room;assert.equal(typeof room,'string');
    const rejected=[];
    for(const fighter of ['balise',...catalogue.characters.map(item=>item.id),BOSS]){
      const response=await request(server,'/room',{op:'ready',token,version,room,fighter,ready:true});
      assert.equal(response.status,400,'Network room admitted original '+fighter);rejected.push(fighter);
    }
    for(const fighter of CANON){
      const response=await request(server,'/room',{op:'ready',token,version,room,fighter,ready:true});assert.equal(response.status,200,'Canonical network fighter rejected '+fighter);
      const state=JSON.parse(response.body);assert.equal(state.seats[0].fighter,fighter);
    }
    assert.equal((await request(server,'/room',{op:'leave',token,version,room})).status,200);
    return {server:'Shipped netplay-server.cjs openRelay(), real 127.0.0.1 socket',version,requests:results,catalogueServed:true,
      originalNetworkSelectionsRejected:rejected,canonicalNetworkSelectionsAccepted:CANON,privatePathsRejected:3};
  }finally{await new Promise(resolve=>server.close(resolve));}
}
(async()=>{
  assert.equal(git('rev-parse','--show-object-format').trim(),'sha1','Expected SHA-1 Git object identity');
  assert.equal(git('rev-parse','--verify',BASE+'^{commit}').trim(),BASE);
  const baseEntries=gitFiles(BASE),baseByPath=new Map(baseEntries.map(entry=>[entry.path,entry]));
  const baseline=check('Preserve the 539 reference rasters and 33 reference SVG byte for byte',()=>{
    const rasters=baseEntries.filter(entry=>entry.path.startsWith(MODE+'assets/')&&/\.(?:png|webp|jpe?g|gif|avif|bmp|tiff?)$/i.test(entry.path));
    const vectors=baseEntries.filter(entry=>/\.svg$/i.test(entry.path));
    assert.equal(rasters.length,539,'Reference raster count');assert.equal(vectors.length,33,'Reference SVG count');
    for(const entry of [...rasters,...vectors]){
      const file=path.join(repo,entry.path),stat=fs.lstatSync(file);assert(stat.isFile()&&!stat.isSymbolicLink(),'Reference media changed type '+entry.path);
      assert.equal(blobHash(fs.readFileSync(file)),entry.sha,'Reference media modified or replaced: '+entry.path);
    }
    return {reference:BASE,rasterScope:MODE+'assets/',svgScope:'Entire repository',rasters:rasters.length,svg:vectors.length,compared:rasters.length+vectors.length};
  });
  const w=registry(),h=w.window,kitArt=h.StrandOriginalKitsAssets?.kits?.balise,bossArt=h.StrandOriginalBossArt;
  const manifest=check('Complete measured manifests: 30 Balise, 12 Consignateur and five active props',()=>{
    assert.equal(kitArt?.ready,true,'Balise measured art is incomplete');assert.equal(bossArt?.ready,true,'Consignateur measured art is incomplete');
    same(Object.keys(kitArt.poses),POSES,'Balise pose keys');
    for(const pose of POSES){same(Object.keys(kitArt.poses[pose]),['left','right'],'Balise orientations');for(const side of ['left','right']){
      const g=kitArt.poses[pose][side];assets.push(png(g.src,g,'Balise '+pose+' '+side,side));
    }}
    same(Object.keys(kitArt.props),['anchor','ropeHook'],'Balise props');
    for(const prop of ['anchor','ropeHook']){const g=kitArt.props[prop];assets.push(png(g.src,g,'Balise '+prop));}
    const directional=bossArt.directionalPoses?.consignateur;assert(directional,'Boss directional poses missing');same(Object.keys(directional),BOSS_POSES,'Boss pose keys');
    for(const pose of BOSS_POSES){same(Object.keys(directional[pose]),['left','right'],'Boss orientations');for(const side of ['left','right']){
      const g=directional[pose][side];assets.push(png(g.src,g,'Consignateur '+pose+' '+side,side));
    }
      const left=directional[pose].left;assert.equal(bossArt.sprites.consignateur[pose],left.src,'Legacy Boss source must remain its left view');
      const legacy=bossArt.geometry.bosses.consignateur[pose];for(const key of ['crop','anchorX','baselineY','heightRatio','nativeFacing'])assert.deepEqual(copy(legacy[key]),copy(left[key]),'Legacy Boss geometry '+pose+' '+key);
    }
    same(Object.keys(bossArt.props),['console-active','console-inactive','register'],'Boss props');
    for(const prop of ['console-active','console-inactive','register'])assets.push(png(bossArt.props[prop],bossArt.propGeometry[prop],'Consignateur '+prop));
    assert.equal(assets.length,47);assert.equal(new Set(assets.map(asset=>asset.src)).size,47,'Each active entry must have its own received PNG');
    assert.equal(path.basename(kitArt.props.ropeHook.src),'balise-rope-loop-grey-red.png','Active rope must preserve Balise grey/red equipment');
    return {activePng:47,balisePoses:30,consignateurPoses:12,activeProps:5};
  });
  const inventory=check('48 added PNGs: 47 active sources and one preserved orange rope variant',()=>{
    const tracked=git('ls-files','-z').split('\0').filter(Boolean),pack=tracked.filter(file=>file.startsWith(MODE+PACK));
    assert.equal(pack.length,48,'Playable pack must contain exactly 48 tracked files');
    assert(pack.every(file=>file.endsWith('.png')),'Only PNGs belong in the received playable pack');
    for(const file of pack)assert(!baseByPath.has(file),'Received pack overwrites a baseline path '+file);
    for(const asset of assets)assert(pack.includes(asset.repoPath),'Active PNG is untracked '+asset.repoPath);
    const active=new Set(assets.map(asset=>asset.repoPath)),variants=pack.filter(file=>!active.has(file));
    assert.deepEqual(variants,[MODE+PACK+'props/balise-rope-loop.png'],'Only the orange rope may remain an unused preserved variant');
    const variant=png(variants[0].slice(MODE.length),null,'Preserved orange rope variant');
    const newRuntimeMedia=tracked.filter(file=>file.startsWith(MODE+'assets/')&&/\.(?:png|webp|jpe?g|gif|avif|bmp|tiff?|svg)$/i.test(file)&&!baseByPath.has(file));
    same(newRuntimeMedia,pack,'Unexpected new runtime image outside the received pack');
    const documentationMedia=tracked.filter(file=>!file.startsWith(MODE+'assets/')&&/\.(?:png|webp|jpe?g|svg)$/i.test(file)&&!baseByPath.has(file));
    return {addedRuntimePng:pack.length,active:assets.length,unusedVariants:[variant],newDocumentaryMedia:documentationMedia};
  });
  const provenance=check('The 48 generation records identify the exact delivered image bytes',()=>{
    const file='docs/combat/production/20261127-first-playable/art-generation.json';
    const generation=JSON.parse(fs.readFileSync(path.join(repo,file),'utf8'));
    assert.equal(generation.baseCommit,BASE,'Generation reference commit');
    assert(Array.isArray(generation.assets),'Generation asset list missing');
    const received=[...assets,...inventory.unusedVariants],byPath=new Map(received.map(asset=>[asset.repoPath,asset]));
    same(generation.assets.map(asset=>asset.path),received.map(asset=>asset.repoPath),'Generation manifest must cover all 48 PNGs exactly');
    for(const entry of generation.assets){
      const measured=byPath.get(entry.path);assert.equal(entry.blobSha,measured.gitBlob,'Generation blob mismatch '+entry.path);
      assert.equal(entry.width,measured.width,'Generation width '+entry.path);assert.equal(entry.height,measured.height,'Generation height '+entry.path);
      assert.equal(entry.byteLength,measured.bytes,'Generation byte length '+entry.path);
      assert.equal(entry.pngColorType,measured.pngColorType,'Generation PNG color type '+entry.path);
      assert.equal(measured.pngColorType,6,'Received source must retain its RGBA PNG '+entry.path);
      if(entry.dimensions){assert.equal(entry.dimensions.width,measured.width);assert.equal(entry.dimensions.height,measured.height);}
      if(entry.subject==='balise'){
        const g=kitArt.poses[entry.pose]?.[entry.facing];assert(g,'Generation Balise pose/direction missing');
        assert.equal(MODE+g.src,entry.path,'Generation pose points to a different runtime file');assert.equal(g.heightRatio,entry.heightRatio,'Generation anatomical ratio changed');
      }
    }
    const expectedProps={anchor:kitArt.props.anchor.src,ropeHook:kitArt.props.ropeHook.src,...bossArt.props};
    for(const [key,src]of Object.entries(expectedProps)){
      const entries=generation.assets.filter(entry=>entry.runtimeKey===key);assert.equal(entries.length,1,'Exactly one active prop provenance for '+key);
      assert.equal(entries[0].path,MODE+src,'Prop runtime mapping '+key);assert.notEqual(entries[0].archiveOnly,true,'Active prop marked archived');
    }
    const variant=generation.assets.find(entry=>entry.path===inventory.unusedVariants[0].repoPath);
    assert.equal(variant.archiveOnly,true,'Orange rope variant must remain archived');assert(!Object.hasOwn(variant,'runtimeKey'),'Archived rope must have no runtime key');
    assert(!assets.some(asset=>asset.repoPath===variant.path),'Archived rope entered the runtime descriptors');
    sourceHashes[file]=hash(fs.readFileSync(path.join(repo,file)));
    return {file,entries:generation.assets.length,activeSources:47,archivedVariants:1,gitBlobsMatched:48,rgbaPng:48};
  });
  const catalogue=JSON.parse(fs.readFileSync(path.join(repo,cataloguePath),'utf8'));
  const catalogCheck=check('Canonical catalogue, generated data and active original statuses agree',()=>{
    assert.deepEqual(copy(h.StrandOriginalExtension),catalogue,'extension-data.js must exactly reflect catalog.json');
    assert.equal(catalogue.status,'design_catalog_with_received_bases_static_arenas_and_first_playable');
    for(const [group,count]of Object.entries({characters:10,stages:20,enemies:20,bosses:20})){assert.equal(catalogue[group].length,count);assert.equal(catalogue.counts[group],count);}
    same(catalogue.characters.filter(item=>item.playable===true).map(item=>item.id),[BALISE],'Exactly Balise is a playable original character');
    same(catalogue.bosses.filter(item=>item.playable===true).map(item=>item.id),[BOSS],'Exactly Consignateur is a playable original boss');
    assert(!catalogue.enemies.some(item=>item.playable===true),'Original enemy gameplay is not delivered');
    const allowed=new Set([BALISE,BOSS,...catalogue.stages.map(item=>item.id)]);
    for(const [key,values]of Object.entries(catalogue))if(Array.isArray(values))for(const item of values)if(item?.playable===true)assert(allowed.has(item.id),'Undelivered playable claim in '+key+': '+item.id);
    assert.equal(catalogue.production.playableOriginalCharacters,1);assert.equal(catalogue.production.playableOriginalBosses,1);assert.equal(catalogue.production.playableOriginalEnemies,0);
    same(h.StrandExtensionRuntime.stages,catalogue.stages.map(item=>item.id),'All twenty original stages remain registered');
    assert.equal(catalogue.production.staticArenas,20);
    return {characters:10,bosses:20,enemies:20,staticArenas:20,playableOriginalCharacters:[BALISE],playableOriginalBosses:[BOSS],playableOriginalEnemies:0};
  });
  const modes=check('Admission remains limited to the delivered local modes',()=>verifyModes(w));
  const servedPaths=[...MODULES,...assets.map(asset=>asset.src),...inventory.unusedVariants.map(asset=>asset.src)];
  const httpReport=await verifyHTTP(servedPaths,catalogue);checks.push({name:'Actual repository relay serves all modules and received PNGs and rejects original network selections',passed:true,getRequests:httpReport.requests.length});
  console.log('OK — Actual repository relay HTTP and network admission');
  const report={date:'2026-11-27',passed:true,reference:BASE,checks,baseline,manifest,inventory,provenance,catalogue:catalogCheck,modes,http:httpReport,assets,sourceSha256:sourceHashes,
    limits:[
      'PNG validation reads native file headers and measured descriptor bounds; decoding, alpha pixels, anatomical side, floor contact and framing are covered by first-playable-canvas.cjs.',
      'Mode selection expressions and published rosters are checked from actual source. Full DOM interactions and catalogue launch links are covered by first-playable-entrypoints.cjs.',
      'HTTP uses the shipped server on a real local socket. This does not validate a public deployment, browser cache, Internet connectivity or cross-machine latency.',
      'Preservation compares the 539 baseline mode-assets rasters and all 33 repository SVG Git blobs to checkout bytes. Other historical documentary/source rasters are outside that requested inventory. New documentary captures are listed separately from the 48 runtime PNGs.'
    ]};
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed:true,preserved:baseline.compared,addedPng:48,activePng:47,httpGetRequests:httpReport.requests.length,output:out},null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
