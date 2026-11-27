/* Final delivery checks: original blobs, native additions, runtime scope and real HTTP.
 * --integrity-only omits HTTP while documentation is still being finished.
 * No browser, pixel-layout, animation or physical-controller certification.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm');
const crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const mode=path.resolve(__dirname,'..'),repo=path.resolve(mode,'../..');
const base='7e000d36f2eb0fa4578b545bfb3d8b334acd516a';
const originalProof='docs/combat/production/20261127-lignes-de-maree',teamProof='docs/combat/production/20261127-team-gameplay';
const integrityOnly=process.argv.includes('--integrity-only');
const output=path.join(repo,originalProof,integrityOnly?'delivery-integrity.json':'delivery-verification.json');
const read=(file,root=repo)=>fs.readFileSync(path.join(root,file)),json=file=>JSON.parse(read(file));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const canonical=value=>JSON.parse(JSON.stringify(value));
const expectedCounts={characters:10,stages:20,enemies:20,bosses:20,props:20,gadgets:10,vehicles:4,projectiles:12,missions:20,bonusChallenges:6,duos:5};
const report={schemaVersion:1,date:new Date().toISOString(),passed:false,status:'running',scope:integrityOnly?'integrity-only':'integrity-and-real-http',browser:false,nativeCanvas:false,hardware:false,checks:[]};
const check=(name,fn)=>{const result=fn();report.checks.push(name);return result;};
const git=args=>execFileSync('git',args,{cwd:repo,encoding:'utf8',maxBuffer:24*1024*1024});
const modules=['content.js','asset-geometry-20261124.js','assets.js','boss-geometry-20261124.js','boss-assets.js','static-assets-data.js','presentation-assets.js','progression-data.js','moves-data.js'];

function loadRuntime(){
  const context={window:{},structuredClone};vm.createContext(context);
  for(const file of modules)vm.runInContext(read(file,mode).toString(),context,{filename:file});
  const scope=context.window;
  const before={fighters:canonical(scope.StrandContent.fighters),stages:Object.keys(scope.StrandContent.stages),arenas:Object.keys(scope.StrandContent.arenas),bossAssets:canonical(scope.StrandBossAssets)};
  for(const file of ['extension-data.js','extension-assets.js','extension-runtime.js'])vm.runInContext(read(file,mode).toString(),context,{filename:file});
  return {scope,before};
}
function runtimePaths(value,found=new Set(),seen=new Set()){
  if(typeof value==='string'&&/^assets\/.+\.(?:png|webp)$/.test(value))found.add(value);
  else if(value&&typeof value==='object'&&!seen.has(value)){seen.add(value);for(const child of Object.values(value))runtimePaths(child,found,seen);}
  return found;
}
function walk(folder,extensions){
  const result=[];
  for(const entry of fs.readdirSync(path.join(repo,folder),{withFileTypes:true})){
    if(entry.name.startsWith('.')||entry.isSymbolicLink())continue;
    const relative=folder+'/'+entry.name;
    if(entry.isDirectory())result.push(...walk(relative,extensions));
    else if(entry.isFile()&&extensions.has(path.extname(entry.name)))result.push(relative);
  }
  return result.sort();
}
function inspectPNG(relative,root=repo){
  const bytes=read(relative,root);
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',relative+' is PNG');
  let offset=8;
  while(offset+12<=bytes.length){const length=bytes.readUInt32BE(offset),kind=bytes.toString('ascii',offset+4,offset+8);assert.notEqual(kind,'acTL',relative+' is one still image');offset+=length+12;}
  return {path:relative,bytes:bytes.length,sha256:sha(bytes),gitBlobSha:blob(bytes),width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),pngColorType:bytes[25]};
}
function verifyBaseline(){
  const commit=git(['rev-parse','--verify',base+'^{commit}']).trim();
  const records=git(['ls-tree','-r','-z','-l',commit,'--','modes/echos-de-la-greve/assets']).split('\0').filter(Boolean).map(line=>{
    const m=/^\d+ blob ([a-f0-9]+)\s+(\d+)\t(.+)$/.exec(line);assert(m,'Recognized Git tree record');
    return {path:m[3],bytes:Number(m[2]),gitBlobSha:m[1]};
  }).filter(item=>/\.(?:png|webp|svg)$/.test(item.path));
  const rasters=records.filter(item=>/\.(?:png|webp)$/.test(item.path)),vectors=records.filter(item=>item.path.endsWith('.svg'));
  assert.equal(rasters.length,450);assert.equal(vectors.length,33);
  for(const item of records){const bytes=read(item.path);assert.equal(bytes.length,item.bytes,item.path+' retains its length');assert.equal(blob(bytes),item.gitBlobSha,item.path+' retains its exact original Git blob');item.sha256=sha(bytes);}
  return {commit,rasters:rasters.length,svg:vectors.length,modified:[],records};
}
function versionFixture(){
  const {assetFiles,gameVersion}=require('../netplay-server.cjs'),fixture=fs.mkdtempSync(path.join(os.tmpdir(),'echos-original-delivery-'));
  try{
    for(const entry of fs.readdirSync(mode,{withFileTypes:true}))if(entry.isFile()&&/\.(?:js|css|html|cjs)$/.test(entry.name))fs.copyFileSync(path.join(mode,entry.name),path.join(fixture,entry.name));
    fs.mkdirSync(path.join(fixture,'assets'));
    const empty=gameVersion(fixture),relative='assets/lignes-de-maree/characters/version-fixture.png',file=path.join(fixture,relative);
    fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,'one fixture byte sequence');
    const added=gameVersion(fixture);assert.notEqual(added,empty,'New original asset changes room version');assert.deepEqual(assetFiles(fixture),[relative]);
    fs.appendFileSync(file,' changed');assert.notEqual(gameVersion(fixture),added,'Changed asset bytes change room version');
    fs.writeFileSync(file,'one fixture byte sequence');assert.equal(gameVersion(fixture),added);
    for(const name of ['extension-assets.js','extension-runtime.js','teams.js']){
      const target=path.join(fixture,name),original=fs.readFileSync(target);fs.appendFileSync(target,'\n// delivery fixture mutation\n');
      assert.notEqual(gameVersion(fixture),added,name+' participates in room version');fs.writeFileSync(target,original);assert.equal(gameVersion(fixture),added);
    }
    fs.writeFileSync(path.join(path.dirname(file),'.hidden.png'),'private');fs.writeFileSync(path.join(path.dirname(file),'source.svg'),'<svg/>');
    fs.symlinkSync(file,path.join(path.dirname(file),'linked.png'));fs.symlinkSync(path.dirname(file),path.join(path.dirname(file),'linked-folder'));
    assert.deepEqual(assetFiles(fixture),[relative],'Hidden, vector and symbolic sources excluded');assert.equal(gameVersion(fixture),added);
    return {passed:true,assetAdditionChangesVersion:true,assetBytesChangeVersion:true,modulesVersioned:['extension-assets.js','extension-runtime.js','teams.js'],hiddenSymlinkAndSVGExcluded:true};
  }finally{fs.rmSync(fixture,{recursive:true,force:true});}
}
function integrity(){
  report.baseline=check('450 original rasters and 33 SVG retain exact reference Git blobs.',verifyBaseline);
  report.recovered=check('19 recovered fidelity PNGs retain their inventory SHA-256, dimensions and byte counts.',()=>{
    const native=json('docs/combat/production/20261127-fidelity/native-inventory.json');assert.equal(native.length,19);
    return native.map(item=>{const actual=inspectPNG(item.path);for(const key of ['sha256','width','height','bytes'])assert.equal(actual[key],item[key],item.path+' / '+key);if(item.git_blob_sha)assert.equal(actual.gitBlobSha,item.git_blob_sha);return actual;});
  });
  const {scope,before}=loadRuntime(),catalog=json('docs/combat/extensions/lignes-de-maree/catalog.json'),manifest=json(originalProof+'/assets-manifest.json');
  const items=Array.isArray(manifest.items)?manifest.items:Object.values(manifest.items);
  report.original=check('70 original native PNGs match the public manifest and runtime descriptors exactly.',()=>{
    assert.equal(manifest.schemaVersion,1);assert.equal(items.length,70);assert.equal(scope.StrandExtensionAssets.schemaVersion,1);assert.deepEqual(canonical(scope.StrandOriginalExtension),catalog);
    const ids=new Set(),paths=new Set(),hashes=new Set(),records=[],kinds={character:0,stage:0,enemy:0,boss:0};
    for(const item of items){
      assert(!ids.has(item.id));ids.add(item.id);assert(!paths.has(item.src));paths.add(item.src);
      assert.match(item.src,/^assets\/lignes-de-maree\/(?:characters|stages|enemies|bosses)\/[a-z0-9-]+\.png$/);
      const actual=inspectPNG(item.src,mode);for(const key of ['sha256','width','height','bytes'])assert.equal(actual[key],item[key],item.id+' / '+key);
      assert.equal(actual.gitBlobSha,item.gitBlobSha);assert(!hashes.has(actual.sha256),'Distinct original image');hashes.add(actual.sha256);assert.deepEqual(canonical(scope.StrandExtensionAssets.items[item.id]),item);
      assert(Object.hasOwn(kinds,item.kind));kinds[item.kind]++;
      if(item.kind!=='stage'){assert.equal(actual.pngColorType,6);assert.equal(item.alphaMin,0);}
      else assert(Number.isFinite(item.floorY)&&item.floorY>0&&item.floorY<1,item.id+' has measured floor geometry');
      records.push({...actual,id:item.id,kind:item.kind});
    }
    assert.deepEqual(kinds,{character:10,stage:20,enemy:20,boss:20});assert.equal(records.reduce((n,item)=>n+item.bytes,0),145362802);
    return {images:70,bytes:145362802,kinds,records};
  });
  report.catalogue=check('147 original designs remain distinct; no original character, enemy or boss kit becomes playable.',()=>{
    assert.equal(catalog.schemaVersion,1);assert.equal(catalog.canonStatus,'original-fan-extension');
    const entries=Object.keys(expectedCounts).flatMap(key=>{assert.equal(catalog[key].length,expectedCounts[key],key);return catalog[key];});assert.equal(entries.length,147);assert.equal(new Set(entries.map(e=>e.id)).size,147);
    for(const entity of entries){assert.equal(entity.canonStatus,'original-fan-extension');assert.equal(entity.production.design,'complete');}
    for(const kind of ['characters','enemies','bosses'])for(const entity of catalog[kind]){assert.notEqual(entity.playable,true,entity.id+' stays non-playable');if(kind==='characters')assert.equal(entity.playable,false,entity.id+' has an explicit locked character flag');assert.equal(entity.production.runtime,'planned',entity.id+' runtime planned');}
    assert.deepEqual(canonical(scope.StrandContent.fighters),before.fighters);assert.deepEqual(canonical(scope.StrandBossAssets),before.bossAssets);assert.equal(Object.keys(scope.StrandContent.fighters).length,8);
    assert.equal(scope.StrandExtensionRuntime.characters,0);assert.equal(scope.StrandExtensionRuntime.enemies,0);assert.equal(scope.StrandExtensionRuntime.bosses,0);
    const stageIds=catalog.stages.map(e=>e.id).sort();assert.deepEqual(Array.from(scope.StrandExtensionRuntime.stages).sort(),stageIds);
    assert.deepEqual(Object.keys(scope.StrandContent.stages).filter(id=>!before.stages.includes(id)).sort(),stageIds);
    assert.deepEqual(Object.keys(scope.StrandContent.arenas).filter(id=>!before.arenas.includes(id)).sort(),stageIds);
    for(const id of stageIds){const image=scope.StrandExtensionAssets.items[id];assert.equal(scope.StrandAssets.stages[id],image.src);assert.equal(scope.StrandAssets.stageGeometry[id].legacy.floorY,image.floorY);}
    return {schemaVersion:1,entities:147,counts:expectedCounts,canonicalFighters:8,originalPlayableFighters:0,originalEnemiesAI:0,originalBossesAI:0,receivedStaticArenas:20};
  });
  report.movesCatalogue=check('Regenerated moves match the current fight engine and JSON source.',()=>{
    const data=json('docs/combat/data/actions-et-ia.json');for(const key of Object.keys(data))assert.deepEqual(canonical(scope.StrandMovesData[key]),data[key],'Generated catalogue field '+key);
    assert.equal(data.source.sha256,sha(read('fight.js',mode)));assert.equal(data.source.content_sha256,sha(read('content.js',mode)));assert.deepEqual(Object.keys(data.fighters).sort(),Object.keys(before.fighters).sort());
    const qa=json(teamProof+'/moves-domain-verification.json');assert.equal(qa.passed,true);assert.equal(qa.checks_passed,10);assert.equal(qa.source_sha256['fight.js'],data.source.sha256);
    return {passed:true,engineSha256:data.source.sha256,attacks:data.actions.length,utilities:data.commonUtility.length,qa:teamProof+'/moves-domain-verification.json',qaGroups:qa.checks_passed};
  });
  report.runtimeInventory=check('Exactly 539 rasters are exposed: 450 original, 19 recovered and 70 extension images.',()=>{
    const served=require('../netplay-server.cjs').assetFiles();
    const original=report.baseline.records.filter(e=>/\.(?:png|webp)$/.test(e.path)).map(e=>e.path.replace(/^modes\/echos-de-la-greve\//,''));
    const expected=[...original,...report.recovered.map(e=>e.path.replace(/^modes\/echos-de-la-greve\//,'')),...items.map(e=>e.src)].sort();
    assert.equal(new Set(expected).size,539);assert.deepEqual(served,expected);
    const active=Array.from(runtimePaths(scope)).sort();for(const file of active)assert(served.includes(file),'Referenced image served: '+file);
    return {servedRasters:served.length,activeMappedPaths:active.length,newOriginalPNGs:items.length,paths:served};
  });
  report.versionFixture=check('Asset addition, byte changes and new modules change the version; private sources stay excluded.',versionFixture);
  return {scope,items};
}
async function httpChecks(items){
  const {openRelay,gameVersion}=require('../netplay-server.cjs'),server=openRelay(),records=[],checked=new Set(),uiLinks=[],sourceLinks=[];
  let requests=0;await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const origin='http://127.0.0.1:'+server.address().port;
  const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.md':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8','.txt':'text/plain; charset=utf-8'};
  function locate(url){
    const relative=decodeURIComponent(url.pathname.slice(1)).replace(/^modes\/echos-de-la-greve\//,'')||'netplay.html';
    const rooted=relative.startsWith('docs/')||relative==='JOUER.html'||relative.startsWith('campagne/');
    const absolute=path.resolve(rooted?repo:mode,relative);assert(absolute.startsWith(repo+path.sep),'Evidence stays in project');return absolute;
  }
  async function exact(address,role='resource',collect=true){
    const url=new URL(address,origin),key=url.pathname;if(collect&&checked.has(key))return;
    const absolute=locate(url);assert(fs.existsSync(absolute),'HTTP-linked file exists: '+key);
    const local=fs.readFileSync(absolute),response=await fetch(url,{signal:AbortSignal.timeout(15000)});requests++;
    assert.equal(response.status,200,'GET '+key);assert.equal(response.headers.get('content-type'),mime[path.extname(absolute)],'Content type '+key);
    const body=Buffer.from(await response.arrayBuffer());assert.equal(sha(body),sha(local),'Exact bytes GET '+key);
    if(collect){checked.add(key);records.push({path:key,role,status:200,bytes:body.length,sha256:sha(body)});}
  }
  function localLink(value,baseURL){
    if(!value||value.startsWith('#')||/^(?:https?:|mailto:|data:|javascript:)/.test(value)||/[{}$]/.test(value))return null;
    const result=new URL(value,baseURL);return result.origin===origin?result:null;
  }
  const links=text=>Array.from(text.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/g),m=>m[1]);
  try{
    const versionResponse=await fetch(origin+'/room-version.js',{signal:AbortSignal.timeout(15000)});requests++;assert.equal(versionResponse.status,200);assert.equal(await versionResponse.text(),'window.StrandRoomVersion='+JSON.stringify(gameVersion()));
    for(const prefix of ['/','/modes/echos-de-la-greve/']){
      await exact(prefix,'landing');
      for(const page of ['index.html','teams.html','extension.html']){
        const baseURL=new URL(prefix+page,origin);await exact(baseURL,'page');
        for(const value of links(read(page,mode).toString())){const url=localLink(value,baseURL);if(!url)continue;await exact(url,/\.js$/.test(url.pathname)?'script':/\.css$/.test(url.pathname)?'stylesheet':'ui-link');if(url.pathname.includes('/docs/'))uiLinks.push(url.pathname);}
      }
      for(const file of ['app.js','teams.js','extension.js'])for(const value of links(read(file,mode).toString())){
        const url=localLink(value,new URL(prefix+'index.html',origin));if(!url)continue;await exact(url,'dynamic-ui-link');if(url.pathname.includes('/docs/'))uiLinks.push(url.pathname);
      }
      for(const item of items)await exact(prefix+item.src,'original-png');
      for(const item of report.recovered)await exact(prefix+item.path.replace(/^modes\/echos-de-la-greve\//,''),'recovered-png');
      for(const file of ['assets/fighters/sam-jump.png',report.baseline.records.find(x=>x.path.endsWith('.webp')).path.replace(/^modes\/echos-de-la-greve\//,'')])await exact(prefix+file,'baseline-smoke');
    }
    for(const item of [...records].filter(r=>r.path.endsWith('.css')))for(const match of fs.readFileSync(locate(new URL(item.path,origin)),'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)){const url=localLink(match[1],new URL(item.path,origin));if(url)await exact(url,'css-resource');}
    report.checks.push('Both URL prefixes serve exact pages, referenced JS/CSS, navigation, all 70 original PNGs and all 19 recovered PNGs.');
    const extensions=new Set(['.md','.json','.txt','.png','.webp']);
    const documents=[...walk(originalProof,extensions),...walk(teamProof,extensions),...walk('docs/combat/extensions/lignes-de-maree',extensions)],selfPath=originalProof+'/delivery-verification.json';
    const directDocuments=new Set(documents.filter(file=>file!==selfPath));
    for(const pathname of uiLinks)directDocuments.add(path.relative(repo,locate(new URL(pathname,origin))).split(path.sep).join('/'));
    for(const file of [...directDocuments]){
      if(!file.endsWith('.md'))continue;
      for(const match of read(file).toString().matchAll(/\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)){
        const value=match[1];if(value.startsWith('#')||/^[a-z]+:\/\//i.test(value))continue;
        const url=new URL(value,new URL('/'+file,origin)),absolute=locate(url);assert(fs.existsSync(absolute),'Report link exists: '+file+' → '+value);
        const relative=path.relative(repo,absolute).split(path.sep).join('/');
        if(relative.startsWith('docs/')&&extensions.has(path.extname(relative))&&relative!==selfPath)directDocuments.add(relative);
        else sourceLinks.push({from:file,href:value,localFileExists:true,httpChecked:false});
      }
    }
    for(const file of directDocuments)for(const prefix of ['/','/modes/echos-de-la-greve/'])await exact(prefix+file,'document-or-proof');
    report.checks.push('Current production proofs, extension design documents and direct report/UI documentation links serve exact bytes.');
    for(const route of ['/assets/lignes-de-maree/.hidden.png','/assets/lignes-de-maree/bosses/source.svg','/assets/lignes-de-maree/private.json','/docs/combat/production/20261127-lignes-de-maree/.private.json','/docs/combat/production/20261127-lignes-de-maree/verify_bosses.py','/modes/echos-de-la-greve/qa/original-delivery.cjs']){
      const response=await fetch(origin+route,{signal:AbortSignal.timeout(15000)});requests++;assert.equal(response.status,404,'Source/private route unavailable: '+route);await response.arrayBuffer();
    }
    report.checks.push('Private files and source scripts stay unavailable via HTTP.');
    report.http={realHTTP:true,rootAndPrefixed:true,gameVersion:gameVersion(),requests:requests+2,records,documentPaths:[...directDocuments].sort(),localSourceLinks:sourceLinks,finalReport:{paths:['/'+selfPath,'/modes/echos-de-la-greve/'+selfPath],byteIdentityVerified:true,hashNotEmbedded:'Self SHA-256 is not embedded; both HTTP bodies are compared to the final disk file after writing.'}};
    report.checks.push('The final report itself serves unchanged at both HTTP prefixes.');
    report.passed=true;report.status='complete';fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
    await exact('/'+selfPath,'final-report',false);await exact('/modes/echos-de-la-greve/'+selfPath,'final-report',false);
  }finally{server.closeAllConnections?.();await new Promise(resolve=>server.close(resolve));}
}
(async()=>{
  fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');const {items}=integrity();
  report.sourceSha256=Object.fromEntries([...modules,'fight.js','extension-data.js','extension-assets.js','extension-runtime.js','teams.html','teams.js','teams.css','extension.html','extension.js','extension.css','netplay-server.cjs','qa/original-delivery.cjs'].map(file=>[file,sha(read(file,mode))]));
  if(integrityOnly){report.passed=true;report.status='complete';fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');}else await httpChecks(items);
  console.log(JSON.stringify({passed:true,scope:report.scope,groups:report.checks.length,baselineRasters:report.baseline.rasters,baselineSVG:report.baseline.svg,recovered:report.recovered.length,originalPNGs:report.original.images,originalBytes:report.original.bytes,servedRasters:report.runtimeInventory.servedRasters,activeMappedPaths:report.runtimeInventory.activeMappedPaths,httpRequests:report.http?.requests||0,report:path.relative(repo,output)}));
})().catch(error=>{report.passed=false;report.status='failed';report.error={name:error.name,message:error.message,stack:error.stack};fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.error(error);process.exitCode=1;});
