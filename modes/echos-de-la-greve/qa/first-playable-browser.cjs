/* Real Chromium UI, native images, browser keyboard events and local persistence.
 * Full combat phases are covered separately by the public-control/native recipe. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const {openRelay}=require('../netplay-server.cjs');
const mode=path.resolve(__dirname,'..'),repo=path.resolve(mode,'../..');
const out=path.resolve(process.env.LDM_QA_OUTPUT||path.join(repo,'docs/combat/production/20261127-first-playable'));
const captures=path.join(out,'browser-renders'),checks=[],errors=[],httpErrors=[],failedRequests=[],flowErrors=[],pictures=[];
fs.mkdirSync(captures,{recursive:true});
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const files=['index.html','app.js','presentation.js','teams.html','teams.js','extension.html','extension.js','fight.js','boss.js','lessons.js','original-kits.js','original-kits-assets.js','original-bosses.js','original-bosses-assets.js','qa/first-playable-browser.cjs'];
const report={date:new Date().toISOString(),browser:true,hardware:false,passed:false,checks,errors,httpErrors,failedRequests,flowErrors,captures:pictures,sourceSha256:Object.fromEntries(files.map(file=>[file,hash(fs.readFileSync(path.join(mode,file)))]))};
async function check(name,fn){try{const result=await fn();checks.push({name,passed:true,result});console.log('PASS '+name);return result;}catch(error){checks.push({name,passed:false,error:String(error.stack||error)});console.error('FAIL '+name+': '+error.message);throw error;}}
async function capture(page,name,selector='#arena'){
 const raw=await page.locator(selector).screenshot({type:'png'}),im=await loadImage(raw),c=createCanvas(im.width,im.height);
 c.getContext('2d').drawImage(im,0,0);const bytes=c.toBuffer('image/webp',92),file='browser-renders/'+name+'.webp';
 fs.writeFileSync(path.join(out,file),bytes);pictures.push({file,width:im.width,height:im.height,bytes:bytes.length,sha256:hash(bytes)});
}
async function layout(page,label){
 const value=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
 assert(value.width<=value.viewport+1,label+' overflow '+JSON.stringify(value));assert(value.body<=value.viewport+1,label+' body overflow');return value;
}
async function preload(page,kind){
 await page.evaluate(async kind=>{
   const paths=kind==='balise'?Object.values(window.StrandOriginalKitsAssets.kits.balise.poses).flatMap(faces=>Object.values(faces).map(d=>d.src)):
     Object.values(window.StrandOriginalBossArt.directionalPoses.consignateur).flatMap(faces=>Object.values(faces).map(d=>d.src));
   paths.push(window.StrandAssets.stages['ldm-stage-digue-aval']);
   paths.push(...(kind==='balise'?Object.values(window.StrandOriginalKitsAssets.kits.balise.props).map(d=>d.src):Object.values(window.StrandOriginalBossArt.props)));
   await Promise.all([...new Set(paths)].map(src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=()=>reject(new Error(src));image.src=src;})));
 },kind);
}
async function heldSpecial(page,direction,key){
 await page.keyboard.down(direction);await page.keyboard.down('h');
 try{await page.waitForFunction(key=>window.StrandFight.snapshot()?.fighters?.[0]?.action===key,key,{timeout:4000});}
 finally{await page.keyboard.up('h');await page.keyboard.up(direction);}
}
async function balise(page,base,label,full){
 await page.goto(base+'/extension.html#ldm-char-balise',{waitUntil:'networkidle'});
 await check(label+' original dossier exposes the actual playable link',async()=>{
   assert(await page.locator('#dossier').evaluate(el=>el.open));
   assert.match(await page.locator('#dossier-status').innerText(),/Duel, entraînement et relais/);
   assert.equal(await page.locator('#dossier-actions a.button').getAttribute('href'),'index.html?ldmFighter=balise');
   await page.locator('#dossier-actions a.button').click();await page.waitForSelector('[data-act="start"]');
   assert.equal(await page.locator('[data-act="pick"]').count(),9);
   assert.equal(await page.locator('[data-act="pick"][aria-pressed="true"]').getAttribute('data-id'),'balise');
   // Navigation keeps the real pointer coordinates; it may land on another card.
   // Restore the committed selection before inspecting its large preview.
   await page.mouse.move(8,8);
   await page.locator('[data-act="pick"][data-id="balise"]').focus();
   const preview=page.locator('[data-presentation-slot="0"] img.presentationCurrent');
   await page.waitForFunction(()=>document.querySelector('[data-presentation-slot="0"] img.presentationCurrent')?.getAttribute('src')?.endsWith('/balise/stance-right.png'));
   await preview.waitFor();assert.match(await preview.getAttribute('src'),/balise\/stance-right\.png$/);
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('[data-presentation-slot="0"] img')).every(im=>im.complete&&im.naturalWidth>0));
   return {kits:9,preview:true,layout:await layout(page,label+' selection')};
 });
 await check(label+' commands include the original move sheet',async()=>{
   await page.locator('#controlsLink').click();assert(await page.locator('#manual').evaluate(el=>el.open));
   const text=await page.locator('#keys').innerText();assert.match(text,/Courte traction au lien/);assert.match(text,/Ancrage de rappel/);assert.match(text,/Coups de Balise/);
   await page.locator('#manual form[method="dialog"] button').click();return {sixMoves:true};
 });
 await page.locator('[data-act="start"]').click();
 await page.waitForFunction(()=>window.StrandFight.snapshot()?.phase==='fight');
 await preload(page,'balise');
 await check(label+' the shipped training engine starts Balise on Digue',async()=>{
   const state=await page.evaluate(()=>window.StrandFight.snapshot());
   assert.equal(state.fighters[0].id,'balise');assert.equal(state.mode,'training');assert.equal(state.stage,'ldm-stage-digue-aval');
   return {fighter:state.fighters[0].id,stage:state.stage,layout:await layout(page,label+' arena')};
 });
 if(full){
   await check(label+' browser keyboard places and recalls a real anchor',async()=>{
     await heldSpecial(page,'d','baliseAnchor');
     await page.waitForFunction(()=>window.StrandFight.snapshot()?.fighters?.[0]?.marker?.kind==='baliseAnchor');
     await page.locator('#pauseBtn').click();
     const before=await page.evaluate(()=>window.StrandFight.snapshot().fighters[0]);
     assert(before.marker.ttl>0);await capture(page,'balise-anchor-browser');
     await page.locator('#pauseBtn').click();await page.waitForFunction(()=>!window.StrandFight.snapshot().fighters[0].action);
     await heldSpecial(page,'a','baliseReel');await page.waitForFunction(()=>!window.StrandFight.snapshot().fighters[0].action);
     const after=await page.evaluate(()=>window.StrandFight.snapshot().fighters[0]);
     assert.equal(after.marker,null);assert(after.x>before.x&&after.x<=before.marker.x+1);
     return {anchor:before.marker.x,from:before.x,to:after.x,remainingChiral:after.chiral};
   });
 }else{
   await page.locator('#pauseBtn').click();await capture(page,'balise-mobile-browser');
 }
 await page.goto(base+'/index.html',{waitUntil:'networkidle'});
 await check(label+' unsupported routes keep eight canonical kits',async()=>{
   for(const mode of ['story','arcade','tournament','challenges','boss','bossrush']){
     if(mode==='story')await page.locator('[data-act="mode"][data-mode="story"]').click();
     else await page.locator('[data-act="mode"][data-mode="'+mode+'"]').click();
     assert.equal(await page.locator('[data-act="pick"]').count(),8,mode);
     assert.equal(await page.locator('[data-act="pick"][data-id="balise"]').count(),0,mode);
     await page.locator('[data-act="home"]').first().click();
   }return {modes:6,canonicalKits:8};
 });
}
async function relay(page,base,label){
 await page.goto(base+'/teams.html',{waitUntil:'networkidle'});
 await page.locator('#teamMember01').selectOption('balise');await page.locator('#teamOpponent').selectOption('local');await page.locator('#teamStage').selectOption('ldm-stage-digue-aval');
 await page.locator('#teamStart').click();await page.waitForFunction(()=>window.StrandFight.snapshot()?.phase==='fight');await preload(page,'balise');
 await check(label+' Balise assistance, tag and persistent resume use actual UI',async()=>{
   await page.locator('[data-player="1"][data-action="finish"]').evaluate(button=>button.click());
   await page.waitForFunction(()=>window.StrandFight.snapshot()?.teams?.[0]?.busy?.kind==='assist');
   await page.waitForFunction(()=>!window.StrandFight.snapshot().teams[0].busy);
   await page.locator('[data-player="1"][data-action="taunt"]').evaluate(button=>button.click());
   await page.waitForFunction(()=>window.StrandFight.snapshot()?.fighters?.[0]?.id==='balise');
   await page.locator('#teamSave').click();
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('echos.teams.v1')));
   assert.equal(stored.originalRules,'balise-1');
   await page.reload({waitUntil:'networkidle'});await page.locator('#teamResume').click();
   const restored=await page.evaluate(()=>window.StrandFight.snapshot());assert(restored.paused);assert.equal(restored.fighters[0].id,'balise');
   await preload(page,'balise');await capture(page,'balise-relay-'+label,'#teamCanvas');
   return {rules:stored.originalRules,active:'balise',paused:true,layout:await layout(page,label+' relay')};
 });
}
async function boss(page,base,label){
 await page.goto(base+'/extension.html#ldm-boss-consignateur',{waitUntil:'networkidle'});
 await check(label+' original boss dossier and menu expose seven encounters',async()=>{
   assert.match(await page.locator('#dossier-status').innerText(),/Rencontre jouable/);
   await page.locator('#dossier-actions a.button').click();await page.waitForSelector('[data-act="startBoss"]');
   assert.equal(await page.locator('[data-act="pickBoss"]').count(),7);
   assert.equal(await page.locator('[data-act="pick"]').count(),8);
   assert.equal(await page.locator('[data-option="bossStage"] option').count(),1);
   assert.match(await page.locator('.originalBossGuide').innerText(),/trois phases/i);
   await page.locator('[data-option="scenarioSpeed"]').selectOption('0.75');
   await page.locator('#controlsLink').click();
   assert.match(await page.locator('#keys').innerText(),/Prise \/ interaction · consoles, registre et reddition/);
   assert.doesNotMatch(await page.locator('#keys').innerText(),/le dépôt est à gauche/);
   await page.locator('#manual form[method="dialog"] button').click();
   return {encounters:7,canonicalKits:8,stageOptions:1,layout:await layout(page,label+' boss selection')};
 });
 await page.locator('[data-act="startBoss"]').click();await page.waitForFunction(()=>window.StrandBoss.snapshot()?.phase==='active');await preload(page,'boss');
 await check(label+' boss controls, speed, stage and resumed checkpoint are active',async()=>{
   const initial=await page.evaluate(()=>window.StrandBoss.snapshot());assert.equal(initial.bossId,'ldm-boss-consignateur');assert.equal(initial.stage,'ldm-stage-digue-aval');assert.equal(initial.original.speed,.75);
   assert.match(await page.locator('[data-p="1"][data-input="throw"]').innerText(),/Prise \/ interaction/);
   await page.locator('#pauseBtn').click();await capture(page,'consignateur-'+label);
   assert(await page.evaluate(()=>window.StrandBoss.snapshot().paused));
   await page.reload({waitUntil:'networkidle'});await page.locator('[data-act="resumeBoss"]').click();
   const resumed=await page.evaluate(()=>window.StrandBoss.snapshot());assert.equal(resumed.bossId,initial.bossId);assert.equal(resumed.original.speed,.75);assert(resumed.tick>=initial.tick);
   await page.locator('#pauseBtn').click();await page.locator('[data-act="leave"]').click();
   assert.equal(await page.locator('[data-option="scenarioSpeed"]').inputValue(),'0.75');
   await page.locator('[data-act="startBoss"]').click();await page.waitForFunction(()=>window.StrandBoss.snapshot()?.phase==='active');
   const restarted=await page.evaluate(()=>window.StrandBoss.snapshot());assert.equal(restarted.bossId,'ldm-boss-consignateur');assert.equal(restarted.original.speed,.75);
   return {speed:resumed.original.speed,phase:resumed.original.phase,checkpoint:true,nextAttemptSpeed:restarted.original.speed,layout:await layout(page,label+' boss arena')};
 });
}
(async()=>{
 let browser,server;
 try{
   browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-dev-shm-usage'],timeout:60000});
   report.browserVersion=browser.version();server=openRelay();await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
   const base='http://127.0.0.1:'+server.address().port;
   for(const [label,viewport,full] of [['desktop',{width:1280,height:900},true],['mobile',{width:390,height:844},false]]){
     const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:!full,hasTouch:!full});const page=await context.newPage();page.setDefaultTimeout(20000);
     page.on('pageerror',error=>errors.push({page:label,message:String(error)}));
     page.on('response',response=>{if(response.status()>=400&&!new URL(response.url()).pathname.endsWith('/favicon.ico'))httpErrors.push({page:label,url:response.url(),status:response.status()});});
     page.on('requestfailed',request=>failedRequests.push({page:label,url:request.url(),error:request.failure()?.errorText}));
     for(const [name,flow] of [['balise',()=>balise(page,base,label,full)],['relay',()=>relay(page,base,label)],['boss',()=>boss(page,base,label)]]){
       try{await flow();}catch(error){flowErrors.push({page:label,flow:name,error:String(error.stack||error)});console.error('FLOW FAIL '+label+'/'+name+': '+error.message);}
     }
     await context.close();
   }
   await check('No uncaught error in the actual original-content pages',async()=>{assert.equal(errors.length,0);return errors;});
   await check('All requested game resources return successfully',async()=>{assert.equal(httpErrors.length,0,JSON.stringify(httpErrors));return httpErrors;});
   report.passed=flowErrors.length===0&&checks.every(check=>check.passed);if(!report.passed)process.exitCode=1;
 }catch(error){report.fatalError=String(error.stack||error);process.exitCode=1;}
 finally{if(browser)await browser.close();if(server)await new Promise(resolve=>server.close(resolve));report.finishedAt=new Date().toISOString();fs.writeFileSync(path.join(out,'first-playable-browser-verification.json'),JSON.stringify(report,null,2)+'\n');}
})();
