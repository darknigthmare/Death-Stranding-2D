/* Native inventory, exact baseline preservation and real HTTP for the fidelity lot.
 * --measure writes candidates, without editing image bytes or runtime metadata.
 * --http verifies HTTP after inventory; --http-only reuses an already checked inventory.
 * A successful verification requires every planned presentation image to be received.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const assert=require('node:assert/strict'),os=require('node:os'),{execFileSync}=require('node:child_process');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const option=name=>process.argv.find(arg=>arg.startsWith('--'+name+'='))?.slice(name.length+3);
const base=option('base')||'7e000d36f2eb0fa4578b545bfb3d8b334acd516a';
const out=path.resolve(option('output')||path.join(repo,'docs/combat/production/20261127-fidelity'));
const folder='assets/fidelity-20261127/presentation/';
const ids=['sam','fragile','higgs','cliff','mule','mama','heartman'];
const expected=[...ids.flatMap(fighter=>['entry','exit'].map(phase=>({fighter,outfit:fighter==='mama'?'atelier':'default',phase,
  key:phase==='entry'?'tauntEntry':'tauntExit',path:folder+fighter+'-taunt-'+phase+'.png'}))),
  ...['hold','entry','exit'].map(phase=>({fighter:'mama',outfit:'viaduc',phase,key:phase==='hold'?'taunt':phase==='entry'?'tauntEntry':'tauntExit',
    path:folder+'mama-viaduc-taunt'+(phase==='hold'?'':'-'+phase)+'.png'})),
  {fighter:'heartman',outfit:'default',phase:'hold',key:'taunt',path:folder+'heartman-taunt.png'}];
const staticExpected=[{id:'maser-handgun-ds2-discharge',kind:'fixed_reference_vfx',work:'ds2',
  path:'assets/fidelity-20261127/static/maser-handgun-ds2-discharge.png'}];
const deliveredTargets=[...expected,...staticExpected];
const modules=['content.js','asset-geometry-20261124.js','assets.js','boss-geometry-20261124.js','boss-assets.js',
  'static-assets-data.js','presentation-assets.js','progression-data.js'];
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const round=value=>Math.round(value*1e6)/1e6;
const readJSON=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const writeJSON=(file,value)=>fs.writeFileSync(path.join(out,file),JSON.stringify(value,null,2)+'\n');
const git=args=>execFileSync('git',args,{cwd:repo,maxBuffer:16*1024*1024}).toString('utf8');

function loadRuntime(ref) {
  const context={window:{},structuredClone};
  for(const name of modules){const text=ref?git(['show',ref+':modes/echos-de-la-greve/'+name]):fs.readFileSync(path.join(root,name),'utf8');
    vm.runInNewContext(text,context,{filename:name});}
  return context.window;
}
function exposedPaths(runtime) {
  const result=new Set();
  function visit(value){if(typeof value==='string'&&/^assets\/.+\.(png|webp)$/.test(value))result.add(value);
    else if(value&&typeof value==='object')for(const child of Object.values(value))visit(child);}
  visit(runtime);return result;
}
function baselineInventory() {
  const commit=git(['rev-parse','--verify',base+'^{commit}']).trim();
  const records=git(['ls-tree','-r','-z','-l',commit,'--','modes/echos-de-la-greve/assets']).split('\0').filter(Boolean).map(line=>{
    const match=/^\d+ blob ([a-f0-9]+)\s+(\d+)\t(.+)$/.exec(line);assert(match,'Recognised Git tree record');
    return {path:match[3],bytes:Number(match[2]),git_blob_sha:match[1]};});
  const images=records.filter(item=>/\.(?:png|webp)$/.test(item.path)),vectors=records.filter(item=>/\.svg$/.test(item.path));
  const modified=[];
  for(const item of [...images,...vectors]){const absolute=path.join(repo,item.path);if(!fs.existsSync(absolute)||blob(fs.readFileSync(absolute))!==item.git_blob_sha)modified.push(item.path);}
  assert.deepEqual(modified,[],'Every preexisting raster and SVG retains its exact Git blob');
  return {schema_version:1,base_commit:commit,count:images.length,png:images.filter(x=>x.path.endsWith('.png')).length,
    webp:images.filter(x=>x.path.endsWith('.webp')).length,svgCount:vectors.length,images,vectors,modified};
}
async function measure(file) {
  const absolute=path.join(root,file),bytes=fs.readFileSync(absolute);
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a',file+' is PNG');
  assert.equal(bytes[25],6,file+' is RGBA PNG');
  let chunks=8;while(chunks+12<=bytes.length){const size=bytes.readUInt32BE(chunks),type=bytes.toString('ascii',chunks+4,chunks+8);
    assert.notEqual(type,'acTL',file+' is one still image');chunks+=size+12;}
  const image=await loadImage(absolute),width=image.width,height=image.height;
  assert.equal(width,bytes.readUInt32BE(16));assert.equal(height,bytes.readUInt32BE(20));
  const canvas=createCanvas(width,height),context=canvas.getContext('2d');context.drawImage(image,0,0);
  const pixels=context.getImageData(0,0,width,height).data;
  let left=width,top=height,right=-1,bottom=-1,transparent=0,solid=0,visible=0;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const a=pixels[(y*width+x)*4+3];if(a===0)transparent++;if(a>=128)solid++;
    if(a>8){visible++;left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}}
  assert(visible>0&&transparent>0,file+' has visible pixels and actual transparency');
  const bbox=[left,top,right+1,bottom+1],x=Math.max(0,left-2),y=Math.max(0,top-2);
  const crop=[x,y,Math.min(width,right+3)-x,Math.min(height,bottom+3)-y];
  const bandTop=Math.max(top,bottom-Math.ceil((bottom-top+1)*.025)+1),occupied=[];
  for(let column=left;column<=right;column++){let present=false;for(let row=bandTop;row<=bottom;row++)if(pixels[(row*width+column)*4+3]>8){present=true;break;}
    if(present)occupied.push(column);}
  const spans=[];for(const column of occupied){const last=spans[spans.length-1];if(last&&column===last[1]+1)last[1]=column;else spans.push([column,column]);}
  const center=occupied.length?(occupied[0]+occupied[occupied.length-1]+1)/2:(left+right+1)/2;
  const supportY=bottom+1;
  assert.equal(sha(fs.readFileSync(absolute)),sha(bytes),'Measurement preserves native image bytes');
  return {path:'modes/echos-de-la-greve/'+file,width,height,bytes:bytes.length,sha256:sha(bytes),git_blob_sha:blob(bytes),
    alpha_0_fraction:transparent/(width*height),alpha_ge_128_fraction:solid/(width*height),alpha_gt_8_pixels:visible,
    alpha_bbox_gt_8:bbox,edgeContact:{left:left===0,top:top===0,right:right===width-1,bottom:bottom===height-1},
    candidate:{src:file,crop,anchorX:round((center-x)/crop[2]),baselineY:round((supportY-y)/crop[3]),heightRatio:1},
    contactBand:{top:bandTop,bottom:bottom+1,spans:spans.map(([a,b])=>[a,b+1]),centerX:center,supportY},
    native_unchanged:true};
}
function descriptorFor(runtime,item) {
  const entry=runtime.StrandPresentationAssets[item.fighter];
  return (item.outfit==='viaduc'?entry.outfits?.viaduc:entry)?.[item.key];
}
function verifyDescriptor(item,measurement,descriptor) {
  assert(descriptor,item.path+' has a runtime descriptor');assert.equal(descriptor.src,item.path);
  assert.deepEqual(Array.from(descriptor.crop||[]),measurement.candidate.crop,item.path+' crop is measured on alpha > 8 with up to two pixels margin');
  assert(Number.isFinite(descriptor.anchorX)&&descriptor.anchorX>0&&descriptor.anchorX<1);
  assert(Number.isFinite(descriptor.baselineY)&&descriptor.baselineY>0&&descriptor.baselineY<=1);
  assert(Number.isFinite(descriptor.heightRatio)&&descriptor.heightRatio>0&&descriptor.heightRatio<=1.5);
  const [x,y,w,h]=descriptor.crop,anchorPixel=x+w*descriptor.anchorX,baselinePixel=y+h*descriptor.baselineY;
  const [left,top,right,bottom]=measurement.alpha_bbox_gt_8;
  assert(anchorPixel>=left&&anchorPixel<=right,'Foot anchor remains inside the measured subject');
  assert(baselinePixel>=top+(bottom-top)*.85&&baselinePixel<=bottom+2,'Baseline follows the lower support region');
  return {src:descriptor.src,crop:Array.from(descriptor.crop),anchorX:descriptor.anchorX,baselineY:descriptor.baselineY,heightRatio:descriptor.heightRatio,
    sourceAnchorPixels:{x:round(anchorPixel),y:round(baselinePixel)}};
}
function verifyPreservedMappings(current,previous) {
  for(const key of ['poses','fighters','actions','steps','hits','jumps','portraits','finishers','story','storyFrames','generatedGeometry','wardrobe'])
    assert.equal(JSON.stringify(current.StrandAssets[key]),JSON.stringify(previous.StrandAssets[key]),'Current lot preserves '+key+' including all DHM sources');
  for(const id of Object.keys(previous.StrandPresentationAssets).filter(id=>id!=='heartman'))
    assert.equal(JSON.stringify(current.StrandPresentationAssets[id].taunt),JSON.stringify(previous.StrandPresentationAssets[id].taunt),'Existing hold is unchanged: '+id);
  assert.equal(current.StrandPresentationAssets.heartman.taunt.src,folder+'heartman-taunt.png','Only the approved Heartman hold replacement is selected');
  assert.equal(current.StrandPresentationAssets.diehardman.tauntEntry,undefined,'No undelivered DHM entry is declared');
  assert.equal(current.StrandPresentationAssets.diehardman.tauntExit,undefined,'No undelivered DHM exit is declared');
  const oldDossiers=previous.StrandProgressionData.build(previous.StrandContent,previous.StrandAssets,previous.StrandStaticCatalogue);
  const newDossiers=current.StrandProgressionData.build(current.StrandContent,current.StrandAssets,current.StrandStaticCatalogue);
  assert.equal(JSON.stringify(newDossiers),JSON.stringify(oldDossiers),'Every progression dossier and condition remains unchanged');
  return {fighterCount:Object.keys(current.StrandContent.fighters).length,progressionEntries:newDossiers.length,
    futureDS2Dossiers:newDossiers.filter(item=>item.category==='future').length,staticCards:current.StrandStaticCatalogue.items.length,
    staticDS2Cards:current.StrandStaticCatalogue.items.filter(item=>item.work==='ds2').length,
    unchangedHolds:7,replacedHolds:1,diehardman:'Historical sources preserved; no new image received'};
}
function versionFixtureCheck() {
  const {assetFiles,gameVersion}=require('../netplay-server.cjs'),fixture=fs.mkdtempSync(path.join(os.tmpdir(),'echos-fidelity-version-'));
  try {
    for(const entry of fs.readdirSync(root,{withFileTypes:true}))if(entry.isFile()&&/\.(?:js|css|html|cjs)$/.test(entry.name))fs.copyFileSync(path.join(root,entry.name),path.join(fixture,entry.name));
    fs.mkdirSync(path.join(fixture,'assets'),{recursive:true});const before=gameVersion(fixture);
    const image=path.join(fixture,expected[0].path);fs.mkdirSync(path.dirname(image),{recursive:true});fs.writeFileSync(image,'fixture one');
    const first=gameVersion(fixture);assert.notEqual(first,before,'Fidelity folder contributes to the room version');
    assert.deepEqual(assetFiles(fixture),[expected[0].path]);fs.writeFileSync(image,'fixture two');
    assert.notEqual(gameVersion(fixture),first,'Fidelity image bytes contribute to the room version');fs.writeFileSync(image,'fixture one');
    const privateFolder=path.join(fixture,'private');fs.mkdirSync(privateFolder);fs.writeFileSync(path.join(privateFolder,'private.png'),'private');
    fs.symlinkSync(path.join(privateFolder,'private.png'),path.join(path.dirname(image),'linked.png'));
    fs.symlinkSync(privateFolder,path.join(path.dirname(image),'linked-directory'));
    fs.writeFileSync(path.join(path.dirname(image),'.hidden.png'),'hidden');fs.writeFileSync(path.join(path.dirname(image),'source.svg'),'<svg/>');
    assert.deepEqual(assetFiles(fixture),[expected[0].path]);assert.equal(gameVersion(fixture),first,'Private, symbolic and source files do not enter the version');
    return {passed:true,checks:['New fidelity folder is versioned recursively','Changing native image bytes changes version','Symbolic paths, hidden files and SVG source formats stay excluded']};
  } finally {fs.rmSync(fixture,{recursive:true,force:true});}
}
async function verifyHTTP(runtime,inventory) {
  const {openRelay,gameVersion,assetFiles}=require('../netplay-server.cjs');
  const servedAssets=assetFiles();for(const item of deliveredTargets)assert(servedAssets.includes(item.path),'Relay inventory exposes '+item.path);
  const fixture=versionFixtureCheck(),server=openRelay(),checks=[],documents=[],notYetProduced=[];
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  try {
    const origin='http://127.0.0.1:'+server.address().port,version=gameVersion();
    const versionResponse=await fetch(origin+'/room-version.js');assert.equal(versionResponse.status,200);
    assert.equal(await versionResponse.text(),'window.StrandRoomVersion='+JSON.stringify(version));
    const sources=['app.js','lessons.js','assets.js','presentation-assets.js','static-assets.js','static-assets-data.js',...deliveredTargets.map(item=>item.path),runtime.StrandPresentationAssets.diehardman.taunt.src];
    for(const prefix of ['/','/modes/echos-de-la-greve/'])for(const file of sources){
      const response=await fetch(origin+prefix+file);assert.equal(response.status,200,prefix+file+' is served');
      assert.equal(response.headers.get('content-type'),file.endsWith('.png')?'image/png':'text/javascript');
      const bytes=Buffer.from(await response.arrayBuffer());assert.equal(sha(bytes),sha(fs.readFileSync(path.join(root,file))),'Exact HTTP bytes: '+file);
      checks.push({path:prefix+file,status:response.status,bytes:bytes.length,sha256:sha(bytes)});
    }
    const publicFiles=['BILAN.md','ASSETS.md','REVUE_VISUELLE.md','AUDIT_SOURCES.md','MANQUANTS_DS2.md','FIDELITE.md','FIDELITY_PRESENTATION.md',
      'diehardman-generation.json','static-generation.json','reference-research.json','presentation-generation.json','native-inventory.json','geometry-measurements.json','preexisting-image-inventory.json',
      'inventory-verification.json','presentation-native.json','presentation-verification.json','regression-verification.json',
      'lessons-verification.json','lessons-native-verification.json','progression-verification.json','static-gallery-verification.json',
      'commandes-verification.json','moves-domain-verification.json','relay-verification.json'];
    const optionalPublicFiles=new Set(['FIDELITE.md','moves-domain-verification.json','relay-verification.json']);
    for(const file of publicFiles){const absolute=path.join(out,file);if(!fs.existsSync(absolute)){notYetProduced.push(file);
      assert(optionalPublicFiles.has(file),'Required public proof exists before final HTTP verification: '+file);continue;}
      const relative=path.relative(repo,absolute).split(path.sep).join('/'),response=await fetch(origin+'/'+relative);assert.equal(response.status,200,'New proof is explicitly served: '+relative);
      const bytes=Buffer.from(await response.arrayBuffer());assert.equal(sha(bytes),sha(fs.readFileSync(absolute)));documents.push({path:relative,sha256:sha(bytes)});}
    const captureFiles=[...Object.keys(runtime.StrandContent.fighters),'mama-viaduc'].flatMap(id=>['entry','hold','exit'].flatMap(phase=>['left','right'].map(facing=>'presentation-renders/'+id+'-'+phase+'-'+facing+'.webp')));
    captureFiles.push(...['entry','hold','exit'].map(phase=>'presentation-renders/mama-viaduc-reduced-'+phase+'-right.webp'),'presentation-renders/mama-viaduc-unavailable-hold-right.webp');
    captureFiles.push(...['guard-high','punish','taunt-distance','taunt-opponent','taunt-interrupted'].map(file=>'dojo-renders/'+file+'.webp'));
    for(const file of captureFiles){const absolute=path.join(out,file);
      assert(fs.existsSync(absolute),'Required native capture exists before final HTTP verification: '+file);
      const relative=path.relative(repo,absolute).split(path.sep).join('/'),response=await fetch(origin+'/'+relative);assert.equal(response.status,200,'Native capture is explicitly served: '+relative);
      assert.equal(response.headers.get('content-type'),'image/webp');const bytes=Buffer.from(await response.arrayBuffer());assert.equal(sha(bytes),sha(fs.readFileSync(absolute)));documents.push({path:relative,sha256:sha(bytes)});}
    for(const file of ['assets/fidelity-20261127/private.json','assets/fidelity-20261127/.hidden.png','assets/fidelity-20261127/presentation/source.svg',
      'assets/fidelity-20261127/%2e%2e%2f%2e%2e%2fnetplay-server.cjs','docs/combat/production/20261127-fidelity/private.json',
      'docs/combat/production/20261127-fidelity/presentation-renders/private.webp']){
      const response=await fetch(origin+'/'+file);assert.equal(response.status,404,'Private route stays unavailable: '+file);await response.arrayBuffer();}
    return {schema_version:1,date:new Date().toISOString(),passed:true,browser:false,realHTTP:true,gameVersion:version,
      plannedPresentationImages:expected.length,receivedPresentationImages:inventory.filter(item=>item.fighter).length,
      receivedStaticImages:inventory.filter(item=>!item.fighter).length,requiredCaptureChecks:captureFiles.length,versionFixture:fixture,
      resourceChecks:checks,documents,publicRoutesWithoutFileAtRun:notYetProduced,
      sourceSha256:Object.fromEntries(['app.js','lessons.js','assets.js','presentation-assets.js','static-assets.js','static-assets-data.js','netplay-server.cjs','qa/fidelity-inventory-20261127.cjs'].map(file=>[file,sha(fs.readFileSync(path.join(root,file)))]))};
  } finally {await new Promise(resolve=>server.close(resolve));}
}
async function main() {
  fs.mkdirSync(out,{recursive:true});
  if(process.argv.includes('--http-only')){
    const inventory=readJSON(path.join(out,'native-inventory.json'));
    assert.equal(inventory.length,deliveredTargets.length,'HTTP reuses the complete delivered inventory');
    for(const item of inventory)assert.equal(sha(fs.readFileSync(path.join(repo,item.path))),item.sha256,'Native bytes remain equal to the checked inventory');
    const report=await verifyHTTP(loadRuntime(),inventory);writeJSON('fidelity-http-verification.json',report);
    console.log(JSON.stringify({passed:true,scope:'http-only',resources:report.resourceChecks.length,documents:report.documents.length}));return;
  }
  const baseline=baselineInventory();writeJSON('preexisting-image-inventory.json',baseline);
  if(process.argv.includes('--baseline-only')){console.log(JSON.stringify({passed:true,scope:'baseline-only',rasters:baseline.count,svg:baseline.svgCount}));return;}
  const targets=process.argv.includes('--measure')?expected:deliveredTargets;
  const received=targets.filter(item=>fs.existsSync(path.join(root,item.path))),missing=targets.filter(item=>!received.includes(item));
  const measurements=[];for(const item of received)measurements.push({...item,...await measure(item.path)});
  if(process.argv.includes('--measure')){writeJSON('geometry-candidates.json',{date:new Date().toISOString(),reviewed:false,planned:expected.length,
    received:received.length,missing:missing.map(item=>item.path),method:'Alpha > 8; two-pixel crop margin; horizontal support candidate from lowest 2.5 percent of visible silhouette. Candidates require visual review.',measurements});
    console.log(JSON.stringify({scope:'measurement-candidates',received:received.length,planned:expected.length,missing:missing.length}));return;}
  assert.deepEqual(missing.map(item=>item.path),[],'Every retained new image must actually exist before success');
  const runtime=loadRuntime(),previous=loadRuntime(baseline.base_commit),preserved=verifyPreservedMappings(runtime,previous);
  const paths=exposedPaths(runtime),oldPaths=exposedPaths(previous),missingExposed=[...paths].filter(file=>!fs.existsSync(path.join(root,file)));
  assert.deepEqual(missingExposed,[],'Every actual runtime/catalogue image exists');
  const retiredExposed=[previous.StrandPresentationAssets.heartman.taunt.src];
  for(const file of oldPaths)if(!retiredExposed.includes(file))assert(paths.has(file),'Previously exposed image remains exposed: '+file);
  for(const file of retiredExposed){assert(!paths.has(file),'Supplanted Heartman hold is not selected');assert(fs.existsSync(path.join(root,file)),'Supplanted native file remains intact on disk');}
  const provenance=readJSON(path.join(out,'presentation-generation.json'));
  const staticProvenance=readJSON(path.join(out,'static-generation.json'));
  const inventory=measurements.map((measurement,index)=>{
    const item=received[index];let geometry=null;
    if(item.fighter)geometry=verifyDescriptor(item,measurement,descriptorFor(runtime,item));
    else {const card=runtime.StrandStaticCatalogue.items.find(entry=>entry.id===item.id);assert(card,'Fixed reference has a real gallery card');
      assert.equal(card.src,item.path);assert.equal(card.work,'ds2');assert.equal(card.category,'projectiles');
      assert.equal(card.width,measurement.width);assert.equal(card.height,measurement.height);
      assert.equal(card.reference,'../../docs/combat/production/20261127-fidelity/ASSETS.md#maser');
      assert.match(card.description,/ni tir jouable ni séquence animée complète/);}
    assert(paths.has(item.path),'New native image is exposed through runtime metadata');
    const source=((item.fighter?provenance:staticProvenance).assets||[]).find(entry=>entry.path===measurement.path);
    assert(source,'Received image has a provenance record: '+measurement.path);assert.equal(source.sha256,measurement.sha256,'Native file and generation manifest agree');
    if(item.fighter)assert.equal(source.generation?.nativeSha256,measurement.sha256,'Copied bytes equal the recorded native output');
    else assert.equal(source.copiedByteIdentical,true,'Static output is recorded as a byte-identical native copy');
    const nativePath=source.generation?.nativePath||source.nativePath;
    const nativeSourceAvailable=typeof nativePath==='string'&&fs.existsSync(nativePath);
    if(nativeSourceAvailable)assert.equal(sha(fs.readFileSync(nativePath)),measurement.sha256,'Current native output and installed bytes agree');
    const {candidate,contactBand,...record}=measurement;
    return {...record,kind:item.fighter?'single_native_'+item.phase+'_pose':item.kind,geometry,
      generation_file:source.generation?.nativeFilename||path.basename(nativePath),native_source_rechecked:nativeSourceAvailable,
      sourceReferenceKind:!item.fighter?'Official DS2 guide at 10.0 seconds; fixed adapted effect, no animation or playable attack':item.outfit==='viaduc'?'Existing project reconstruction; no official Viaduc costume claim':'Existing DS1/DC project sprite; original simulator gesture'};
  });
  assert.equal(new Set(inventory.map(item=>item.sha256)).size,inventory.length,'Each received phase is a distinct native image');
  const {assetFiles}=require('../netplay-server.cjs'),allRasters=assetFiles();
  assert.equal(allRasters.length,baseline.count+inventory.length,'Exact raster total excludes unreceived predictions');
  const newRasterPaths=allRasters.filter(file=>!baseline.images.some(item=>item.path==='modes/echos-de-la-greve/'+file));
  assert.deepEqual(newRasterPaths.sort(),deliveredTargets.map(item=>item.path).sort(),'Every new raster belongs to the received, declared lot');
  const geometryProof={schema_version:1,date:new Date().toISOString(),alphaThreshold:8,marginPixels:2,
    method:'Full native RGBA decode. Runtime crops compared with measured alpha bounds; foot-anchor pixels and height ratios recorded separately from unmodified image bytes.',
    measurements:inventory.map(item=>({path:item.path,sha256:item.sha256,width:item.width,height:item.height,alpha_bbox_gt_8:item.alpha_bbox_gt_8,
      edgeContact:item.edgeContact,geometry:item.geometry,supportBand:item.fighter?measurements.find(measured=>measured.path===item.path).contactBand:null,
      anchorReview:!item.fighter?'Not applicable: fixed effect shown as the whole native image; no fighter anchor or attack registered.':item.fighter==='fragile'?'Horizontal support uses the two boot-contact spans; the narrow umbrella tip is excluded.':'Source support region inspected before the runtime anchor was accepted.'})),
    visualReview:'See REVUE_VISUELLE.md and the real renderer proof presentation-native.json; this inventory does not certify official animation or complete lore fidelity.'};
  writeJSON('native-inventory.json',inventory);writeJSON('geometry-measurements.json',geometryProof);
  const report={schema_version:1,date:new Date().toISOString(),passed:true,browser:false,nativeCanvasDecode:true,baseCommit:baseline.base_commit,
    counts:{previousRastersUnchanged:baseline.count,previousPNG:baseline.png,previousWebP:baseline.webp,previousSVGUnchanged:baseline.svgCount,
      plannedPresentationImages:expected.length,receivedPresentationImages:inventory.filter(item=>item.fighter).length,
      receivedStaticImages:inventory.filter(item=>!item.fighter).length,newNativePNG:inventory.length,totalRasterAssets:allRasters.length,
      previousExposedImages:oldPaths.size,exposedUniqueImages:paths.size,newExposedImages:[...paths].filter(file=>!oldPaths.has(file)).length,
      retiredExposedImages:retiredExposed.length,netAdditionalExposedImages:paths.size-oldPaths.size,...preserved},
    diehardman:{status:'suspended-after-generation-refusal',plannedButUndelivered:18,newFiles:0,
      requestId:'4bffa5af-c38d-438e-ad7f-c5459534d593',serviceReason:'moderation_blocked; output category other',
      handling:'No retry; previous sources and hold retained; unavailable entry/exit use the fighter stance.'},
    higgsDS2:{status:'generation-refused',plannedButUndelivered:1,newFiles:0,
      requestId:'730e9ec2-bac8-4521-a8d5-9ad6d1c68ecc',serviceReason:'moderation_blocked; output category other',
      handling:'No retry; no static card, image path, dossier or unlock added.'},
    missing:missingExposed,modifiedPreexisting:baseline.modified,retiredExposedPaths:retiredExposed,
    newNativeFiles:inventory.map(({path,sha256,git_blob_sha})=>({path,sha256,git_blob_sha})),
    sourceSha256:Object.fromEntries([...modules,'static-assets.js','netplay-server.cjs','qa/fidelity-inventory-20261127.cjs','qa/static-gallery.cjs'].map(file=>[file,sha(fs.readFileSync(path.join(root,file)))])),paths:[...paths].sort()};
  writeJSON('inventory-verification.json',report);
  if(process.argv.includes('--http')){const http=await verifyHTTP(runtime,inventory);writeJSON('fidelity-http-verification.json',http);}
  console.log(JSON.stringify({passed:true,counts:report.counts,http:process.argv.includes('--http')},null,2));
}
if(require.main===module)main().catch(error=>{console.error(error);process.exitCode=1;});
module.exports={measure,expected,staticExpected,baselineInventory,loadRuntime};
