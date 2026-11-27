/* One bounded Chromium launch, then real DOM/layout and ordinary UI checks.
 * Uses the installed Playwright browser (or an explicit executable override). */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const {openRelay}=require('../netplay-server.cjs');
const mode=path.resolve(__dirname,'..'),repo=path.resolve(mode,'../..');
const out=path.resolve(process.env.LDM_QA_OUTPUT||path.join(repo,'docs/combat/production/20261127-lignes-de-maree'));
const tmp=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'ds2d-browser-')),profile=path.join(tmp,'original-browser-profile');
const executable=process.env.LDM_CHROMIUM_EXECUTABLE||chromium.executablePath();
const captures=path.join(out,'browser-renders');
const report={date:new Date().toISOString(),status:'pending',passed:false,browser:false,hardware:false,launch:{attempts:1,executable,headless:true,timeoutMs:60000,TMPDIR:tmp,userDataDir:profile,args:['--no-sandbox','--disable-dev-shm-usage']},checks:[],captures:[],consoleErrors:[],pageErrors:[],failedRequests:[]};
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const sourceFiles=['extension.html','extension.css','extension.js','extension-data.js','extension-assets.js','extension-runtime.js','teams.html','teams.css','teams.js','fight.js'];
report.sourceSha256=Object.fromEntries(sourceFiles.map(file=>[file,sha(fs.readFileSync(path.join(mode,file)))]));
function saveReport(){fs.writeFileSync(path.join(out,'browser-verification.json'),JSON.stringify(report,null,2)+'\n');}
async function check(name,fn){
  try{const details=await fn();report.checks.push({name,passed:true,details:details||null});console.log('PASS '+name);return details;}
  catch(error){report.checks.push({name,passed:false,error:String(error.stack||error)});console.log('FAIL '+name+': '+error.message);return null;}
}
function observe(page,label){
  page.on('console',msg=>{if(msg.type()==='error')report.consoleErrors.push({page:label,text:msg.text()});});
  page.on('pageerror',error=>report.pageErrors.push({page:label,text:String(error)}));
  page.on('requestfailed',request=>report.failedRequests.push({page:label,url:request.url(),error:request.failure()?.errorText}));
}
async function capture(page,name,locator){
  const buffer=locator?await locator.screenshot({type:'png',timeout:15000}):await page.screenshot({type:'png',timeout:15000});
  const image=await loadImage(buffer),canvas=createCanvas(image.width,image.height);canvas.getContext('2d').drawImage(image,0,0);
  const bytes=canvas.toBuffer('image/webp',92),file='browser-renders/'+name+'.webp';fs.writeFileSync(path.join(out,file),bytes);
  const result={file,width:image.width,height:image.height,bytes:bytes.length,sha256:sha(bytes)};report.captures.push(result);return result;
}
async function layout(page,label){
  return check(label+' has no horizontal overflow',async()=>{
    const value=await page.evaluate(()=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,clientWidth:document.documentElement.clientWidth,height:document.documentElement.scrollHeight}));
    assert(value.documentWidth<=value.viewport+1,JSON.stringify(value));assert(value.bodyWidth<=value.viewport+1,JSON.stringify(value));return value;
  });
}
async function loadedVisibleImages(page){
  await page.waitForFunction(()=>Array.from(document.images).filter(image=>{const r=image.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.width>0;}).every(image=>image.complete&&image.naturalWidth>0),{},{timeout:20000});
}
async function extension(page,base,label,allCounts){
  observe(page,label);await page.goto(base+'/extension.html',{waitUntil:'networkidle',timeout:30000});
  await check(label+' initial ten cards',async()=>{assert.equal(await page.locator('#cards .card').count(),10);return {cards:10,metrics:await page.locator('#metrics').innerText()};});
  await layout(page,label+' initial');await capture(page,label+'-hero');
  await page.locator('#catalogue').scrollIntoViewIfNeeded();await loadedVisibleImages(page);await capture(page,label+'-catalogue');
  if(allCounts){
    await check(label+' 147 dossiers and 70 visual bases',async()=>{
      await page.locator('[data-category="all"]').click();assert.equal(await page.locator('#cards .card').count(),147);
      await page.locator('#with-image').check();assert.equal(await page.locator('#cards .card').count(),70);assert.equal(await page.locator('#cards img').count(),70);
      const text=await page.locator('#result-count').innerText();assert.match(text,/70 fiches.*70 avec un visuel/);return {allDossiers:147,visualCards:70,displayedStatus:text};
    });
    await layout(page,label+' visual catalogue');
  }
  await check(label+' stages search and modal',async()=>{
    await page.locator('#with-image').uncheck();await page.locator('[data-category="stages"]').click();
    assert.equal(await page.locator('#cards .card').count(),20);
    await page.locator('#search').fill('SERRE DE VEILLE');assert.equal(await page.locator('#cards .card').count(),1);
    await page.locator('[data-entity-id="ldm-stage-serre-veille"]').click();
    assert(await page.locator('#dossier').evaluate(d=>d.open));assert.equal(await page.locator('#dossier-title').innerText(),'La Serre de veille');
    const action=page.locator('#dossier-actions a.button');assert.match(await action.getAttribute('href'),/ldmStage=ldm-stage-serre-veille/);
    await loadedVisibleImages(page);await capture(page,label+'-serre-dialog');
    const modal=await page.locator('#dossier').evaluate(d=>({width:d.getBoundingClientRect().width,scrollWidth:d.scrollWidth,clientWidth:d.clientWidth,scrollHeight:d.scrollHeight,clientHeight:d.clientHeight}));
    assert(modal.scrollWidth<=modal.clientWidth+1,'Modal horizontal overflow: '+JSON.stringify(modal));
    await page.locator('#close').click();assert(!(await page.locator('#dossier').evaluate(d=>d.open)));
    assert.equal(await page.evaluate(()=>document.activeElement?.dataset?.entityId),'ldm-stage-serre-veille');return {stages:20,searchResults:1,modal,focusReturned:true};
  });
  await layout(page,label+' filtered');
}
async function teams(page,base,label,fullInteractions){
  observe(page,label);await page.goto(base+'/teams.html',{waitUntil:'networkidle',timeout:30000});
  await check(label+' four selectors and 44 arenas',async()=>{
    const members=page.locator('#teamSelection select');assert.equal(await members.count(),4);
    const kits=await page.evaluate(()=>8+(window.StrandOriginalKits?.enabled?1:0));
    for(let i=0;i<4;i++)assert.equal(await members.nth(i).locator('option').count(),kits);
    const arenas=await page.locator('#teamStage option').count();assert.equal(arenas,44);
    assert.equal(await page.locator('#teamOpponent option').count(),2);
    return {selectors:4,kitsPerSelector:kits,modes:2,arenas};
  });
  await layout(page,label+' setup');await loadedVisibleImages(page);await capture(page,label+'-setup',page.locator('#teamSetup'));
  await check(label+' ordinary selection and 2v2 launch',async()=>{
    await page.locator('#teamMember01').selectOption('mama');await page.locator('#teamOpponent').selectOption('local');await page.locator('#teamStage').selectOption('ldm-stage-serre-veille');
    if(await page.locator('#teamAudio').getAttribute('aria-pressed')==='true')await page.locator('#teamAudio').click();
    await page.locator('#teamStart').click();
    await page.waitForFunction(()=>window.StrandFight.snapshot()?.phase==='fight',{}, {timeout:20000});await page.waitForLoadState('networkidle',{timeout:20000});
    const state=await page.evaluate(()=>window.StrandFight.snapshot());assert.equal(state.teams.length,2);assert(state.teams.every(team=>team.members.length===2));assert.equal(state.stage,'ldm-stage-serre-veille');assert.equal(state.mode,'local');
    assert.equal(await page.locator('#teamTouch section').count(),2);return {stage:state.stage,mode:state.mode,teams:state.teams.map(team=>({active:team.active,members:team.members.map(m=>m.id)}))};
  });
  await layout(page,label+' live');
  await check(label+' assistance button',async()=>{
    const before=await page.evaluate(()=>window.StrandFight.snapshot().teams[0].cohesion);
    await page.locator('[data-player="1"][data-action="finish"]').click();
    await page.waitForFunction(()=>window.StrandFight.snapshot()?.teams[0].busy?.kind==='assist',{}, {timeout:3000});
    const state=await page.evaluate(()=>window.StrandFight.snapshot());assert(state.teams[0].cohesion<before);return {beforeCohesion:before,afterCohesion:state.teams[0].cohesion,busy:state.teams[0].busy};
  });
  await check(label+' relay button transfers control',async()=>{
    await page.waitForFunction(()=>!window.StrandFight.snapshot()?.teams[0].busy,{}, {timeout:5000});
    await page.locator('[data-player="1"][data-action="taunt"]').click();
    await page.waitForFunction(()=>window.StrandFight.snapshot()?.fighters[0].id==='mama',{}, {timeout:5000});
    const state=await page.evaluate(()=>window.StrandFight.snapshot());return {activeFighter:state.fighters[0].id,activeSlot:state.teams[0].active,cohesion:state.teams[0].cohesion};
  });
  await capture(page,label+'-live',page.locator('#teamArena'));
  await check(label+' pause and resume buttons',async()=>{
    await page.locator('#teamPause').click();assert(await page.evaluate(()=>window.StrandFight.snapshot().paused));
    await page.locator('#teamPause').click();assert(!(await page.evaluate(()=>window.StrandFight.snapshot().paused)));return {pausedThenResumed:true};
  });
  if(fullInteractions){
    await check(label+' save, restore and return buttons',async()=>{
      await page.locator('#teamSave').click();assert(await page.locator('#teamSetup').isVisible());
      assert(await page.evaluate(()=>!!JSON.parse(localStorage.getItem('echos.teams.v1'))));
      await page.locator('#teamResume').click();const restored=await page.evaluate(()=>window.StrandFight.snapshot());assert(restored.paused);assert.equal(restored.fighters[0].id,'mama');
      await page.locator('#teamNew').click();assert(await page.locator('#teamSetup').isVisible());return {stored:true,restoredPaused:true,activeFighter:'mama',returnedToSetup:true};
    });
    await check(label+' controls dialog opens and closes',async()=>{
      await page.locator('#teamControls').click();assert(await page.locator('#teamManual').evaluate(d=>d.open));
      await page.locator('#teamManual form[method="dialog"] button').click();assert(!(await page.locator('#teamManual').evaluate(d=>d.open)));return true;
    });
  }
}
(async()=>{
  fs.mkdirSync(tmp,{recursive:true});fs.mkdirSync(captures,{recursive:true});
  let context,server,mobile;
  try{
    const started=Date.now();
    try{
      context=await chromium.launchPersistentContext(profile,{executablePath:executable,headless:true,args:report.launch.args,timeout:60000,env:{...process.env,TMPDIR:tmp},viewport:{width:1280,height:900},deviceScaleFactor:1});
      report.launch.elapsedMs=Date.now()-started;report.launch.success=true;report.browser=true;report.browserVersion=context.browser().version();console.log('CHROMIUM LAUNCHED '+report.browserVersion);
    }catch(error){report.launch.elapsedMs=Date.now()-started;report.launch.success=false;report.launch.error=String(error.stack||error);report.status='blocked';saveReport();console.log('CHROMIUM BLOCKED '+error.message);return;}
    server=openRelay();await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    const base='http://127.0.0.1:'+server.address().port;report.baseUrl=base;
    const page=context.pages()[0]||await context.newPage();page.setDefaultTimeout(15000);
    await extension(page,base,'extension-desktop',true);
    await teams(page,base,'teams-desktop',true);
    mobile=await context.browser().newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
    const phone=await mobile.newPage();phone.setDefaultTimeout(15000);
    await extension(phone,base,'extension-mobile',false);
    await teams(phone,base,'teams-mobile',false);
    await check('No uncaught page errors',async()=>{assert.equal(report.pageErrors.length,0);return report.pageErrors;});
    await check('Tested source files preserved',async()=>{for(const[file,digest]of Object.entries(report.sourceSha256))assert.equal(sha(fs.readFileSync(path.join(mode,file))),digest,file);return Object.keys(report.sourceSha256);});
    report.passed=report.checks.every(item=>item.passed);report.status=report.passed?'passed':'issues';
  }catch(error){report.status=report.browser?'issues':'blocked';report.fatalError=String(error.stack||error);console.error(error);}
  finally{
    if(mobile)await mobile.close().catch(()=>{});if(context)await context.close().catch(()=>{});
    if(server)await new Promise(resolve=>server.close(resolve));
    report.finishedAt=new Date().toISOString();saveReport();if(!report.passed)process.exitCode=1;
    fs.rmSync(tmp,{recursive:true,force:true});
  }
})().catch(error=>{report.fatalError=String(error);report.status='blocked';saveReport();process.exitCode=1;});
