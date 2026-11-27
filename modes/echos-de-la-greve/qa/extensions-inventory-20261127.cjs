/* Exact source preservation and delivered inventory. No browser or lore claim. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),lot=path.join(repo,'docs/combat/production/20261127-extensions');
const json=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
const files=['content.js','asset-geometry-20261124.js','assets.js','boss-geometry-20261124.js','boss-assets.js','static-assets-data.js','presentation-assets.js','progression-data.js'];
const ctx={window:{},structuredClone};
for(const file of files)vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),ctx,{filename:file});
const paths=new Set();
function visit(value){if(typeof value==='string'&&/^assets\/.+\.(png|webp)$/.test(value))paths.add(value);else if(value&&typeof value==='object')for(const child of Object.values(value))visit(child);}
visit(ctx.window);
const missing=[...paths].filter(file=>!fs.existsSync(path.join(root,file)));assert.deepEqual(missing,[],'Every exposed image exists');
const baseline=json(path.join(lot,'preexisting-image-inventory.json')),modified=[];
for(const item of baseline.images){const file=path.join(repo,item.path);if(!fs.existsSync(file)||blob(fs.readFileSync(file))!==item.git_blob_sha)modified.push(item.path);}
assert.equal(baseline.images.length,baseline.count);assert.deepEqual(modified,[],'Every preexisting raster asset retains its exact Git blob');
const native=json(path.join(lot,'native-inventory.json'));
assert.equal(native.length,8);assert.equal(new Set(native.map(item=>item.path)).size,8);
const fighterIds=Object.keys(ctx.window.StrandContent.fighters).sort();
assert.deepEqual(native.map(item=>item.fighter).sort(),fighterIds,'One native pose per current fighter');
for(const item of native){
  const bytes=fs.readFileSync(path.join(repo,item.path));assert.equal(sha(bytes),item.sha256,item.id+' SHA256');assert.equal(blob(bytes),item.git_blob_sha,item.id+' Git blob');
  assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.equal(bytes.readUInt32BE(16),item.width);assert.equal(bytes.readUInt32BE(20),item.height);assert.equal(bytes[25],6,'RGBA PNG');
  assert(item.alpha_0_fraction>.2&&item.alpha_ge_128_fraction>.1,'Measured cutout has both transparent space and subject pixels');
  const geometry=ctx.window.StrandPresentationAssets[item.fighter].taunt;
  assert.equal(JSON.stringify(geometry),JSON.stringify(item.geometry),'Manifest and runtime geometry agree');
  const [x,y,w,h]=geometry.crop;assert([x,y,w,h].every(Number.isFinite));assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=item.width&&y+h<=item.height);
  assert(geometry.anchorX>0&&geometry.anchorX<1&&geometry.baselineY>0&&geometry.baselineY<=1);
  assert(paths.has(geometry.src),item.id+' is exposed in the actual runtime catalogue');
}
const provenance=json(path.join(repo,'docs/combat/references/combat-guides-provenance.json')),guides=[];
assert.equal(provenance.sources.length,3);
for(const item of provenance.sources){const bytes=fs.readFileSync(path.join(repo,'docs/combat/references',item.filename));assert.equal(bytes.length,item.bytes);assert.equal(sha(bytes),item.sha256);guides.push({file:item.filename,bytes:bytes.length,sha256:sha(bytes)});}
const extension=fs.readFileSync(path.join(repo,'docs/combat/EXTENSIONS_COMBAT.md'),'utf8');
for(let number=30;number<=67;number++)assert(extension.includes('| EDG-G'+number+' '),'Guide rubric '+number+' is explicitly mapped');
const catalogue=ctx.window.StrandProgressionData.build(ctx.window.StrandContent,ctx.window.StrandAssets,ctx.window.StrandStaticCatalogue);
assert.equal(catalogue.length,59);assert.equal(new Set(catalogue.map(item=>item.id)).size,59);
const categories=Object.fromEntries(['memories','fighters','costumes','stages','modes','future'].map(category=>[category,catalogue.filter(item=>item.category===category).length]));
assert.deepEqual(categories,{memories:8,fighters:8,costumes:2,stages:25,modes:9,future:7});
const previous=json(path.join(repo,'docs/combat/production/20261125-extension/integration-verification.json'));
assert.equal(previous.counts.recent_native_images,257);assert.equal(paths.size,previous.counts.unique_image_paths+8);
const result={schema_version:1,date:new Date().toISOString(),passed:true,browser:false,nativeCanvas:false,
  method:'SHA-256 of three original guides, Git object hashes of every baseline PNG/WebP, native PNG headers/manifest, and actual JavaScript catalogue traversal. Alpha pixels and engine placement have a separate native Canvas proof.',
  baselineCommit:baseline.base_commit,counts:{fighters:fighterIds.length,progressionEntries:catalogue.length,progressionCategories:categories,guideSectionsAdded:38,
    nativeHoldPosesAdded:native.length,previousRasterFilesUnchanged:baseline.count,totalRasterAssets:baseline.count+native.length,
    previousRecentNativeImages:previous.counts.recent_native_images,recentNativeImages:previous.counts.recent_native_images+native.length,
    previousExposedImages:previous.counts.unique_image_paths,exposedUniqueImages:paths.size},
  missing,modifiedPreexisting:modified,guides,newNativeFiles:native.map(({path,sha256,git_blob_sha})=>({path,sha256,git_blob_sha})),
  sourceSha256:Object.fromEntries([...files,'qa/extensions-inventory-20261127.cjs'].map(file=>[file,sha(fs.readFileSync(path.join(root,file)))])),paths:[...paths].sort()};
fs.writeFileSync(path.join(lot,'inventory-verification.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({passed:true,counts:result.counts,guideSha256:guides.map(item=>item.sha256)},null,2));
