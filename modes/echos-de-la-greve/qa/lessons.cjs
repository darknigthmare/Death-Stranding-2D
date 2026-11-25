/* Real StrandFight + application, driven through normal inputs in an explicit
 * DOM/Canvas simulation. No fighter mutation, checkpoint injection or fake wins. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {world}=require('./input-host.cjs');
const root=path.resolve(__dirname,'..'),checks=[],runs=[];
const clone=value=>JSON.parse(JSON.stringify(value));
const files=['content.js','asset-geometry-20261124.js','assets.js','boss-geometry-20261124.js','boss-assets.js','tournament.js','fight.js','boss.js','campaign.js','moves-data.js','relationships.js','input.js','lessons.js'];
function check(name,fn){fn();checks.push({name,passed:true});console.log('OK — '+name);}
function make(options={}){const a=world({gamepads:false,...options});a.html('index.html');a.load(files);return a;}
function driver(send){const held={};return wanted=>{for(const action of ['left','right','down','guard','light','heavy','special','throw','up'])if(!!held[action]!==!!wanted[action]){held[action]=!!wanted[action];send(action,!!wanted[action]);}};}
function pilot(id,state,status,memory){
  const [self,foe]=status.fighters,gap=Math.abs(foe.x-self.x),forward=self.x<=foe.x?'right':'left',back=forward==='right'?'left':'right',wanted={};
  if(status.phase!=='fight'||status.paused||state.phase!=='active')return wanted;
  const pulse=action=>{wanted[action]=true;};
  if(id==='distance'){if(state.step===0&&gap>90)wanted[forward]=true;else if(state.step===1&&gap<265)wanted[back]=true;}
  if(id==='reach'){
    if(state.step===0&&!self.action&&!memory.whiff){pulse('light');memory.whiff=true;}
    if(state.step===1){if(gap>88)wanted[forward]=true;else if(!self.action)pulse('light');}
  }
  if(id==='guard-high')wanted.guard=true;
  if(id==='guard-low'){wanted.guard=true;wanted.down=true;}
  if(id==='punish'){
    if(state.step===0&&!foe.action&&gap>170)wanted[forward]=true;
    if(state.step===0&&!foe.action&&gap<160)wanted[back]=true;
    if(state.step===1){if(gap>102)wanted[forward]=true;else if(!self.action)pulse('light');}
  }
  if(id==='resource'&&state.step===0&&!self.action)pulse('special');
  if(id==='signatures'&&!self.action){if(state.step===1)wanted[forward]=true;if(state.step===2)wanted[back]=true;pulse('special');}
  if(id==='combo'){
    if(state.step===0){if(gap>65)wanted[forward]=true;else if(!self.action)pulse('light');}
    if(state.step===1&&!memory.heavy){pulse('heavy');memory.heavy=true;}
    if(state.step===0)memory.heavy=false;
  }
  return wanted;
}
function runLesson(a,id,fighter='sam',options={}){
  const engine=a.host.StrandFight,session=a.host.StrandLessons.createSession(id,fighter),memory={};let observed=session.status();
  const input=driver((action,down)=>engine.input(1,action,down));
  engine.start({canvas:new a.Node('canvas'),p1:fighter,p2:fighter==='higgs'?'sam':'higgs',stage:'terminal',mode:'training',sound:false,seed:0x1e550,
    training:{dummy:'record',timing:true},onStatus(status){const update=session.observe(status);observed=update.state;for(const event of update.commands)engine.input(...event);}});
  let frames=0;
  while(frames++<(options.limit||2400)&&observed.phase==='active'){
    input(options.idle?{}:options.controls?options.controls(observed,engine.snapshot(),memory):pilot(id,observed,engine.snapshot(),memory));a.frames();
  }
  input({});const result={id,fighter,phase:observed.phase,frames,evidence:clone(observed.evidence),final:clone(engine.snapshot()),feedback:observed.feedback};
  engine.stop();
  if(!options.optional)assert.equal(result.phase,'success',JSON.stringify({id,fighter,frames,feedback:result.feedback,state:observed,final:result.final}));
  return result;
}
function appWorld(options={}){
  const a=make(options);let current=null;
  const create=a.host.StrandLessons.createSession;
  a.host.StrandLessons.createSession=(...args)=>{current=create(...args);return current;};
  a.currentLesson=()=>current;
  const settings=a.host.StrandInput.createSettings();
  if(options.remap)for(const [action,key]of Object.entries(options.remap))assert.equal(settings.bind(1,action,0,key).ok,true);
  a.load(['app.js']);return a;
}
function openLesson(a,id){a.click('[data-act="mode"][data-mode="training"]');a.click('[data-act="lessons"]');a.click('[data-act="startLesson"][data-lesson="'+id+'"]');}
function completeAppLesson(a,id,keys){
  const input=driver((action,down)=>a.key(keys[action],down)),memory={};let frames=0;
  while(frames++<2400&&a.currentLesson().status().phase==='active'){input(pilot(id,a.currentLesson().status(),a.host.StrandFight.snapshot(),memory));a.frames();}
  input({});assert.equal(a.currentLesson().status().phase,'success',id);
  assert.equal(a.document.getElementById('lessonResult').hidden,false);assert.equal(a.document.getElementById('pauseBtn').disabled,true);
  assert.equal(a.document.activeElement.id,'lessonResultTitle');assert(a.host.StrandFight.snapshot().paused);
  return {id,frames,evidence:clone(a.currentLesson().status().evidence)};
}

check('All eight exercises complete through real engine inputs with measured objectives',()=>{
  const a=make();
  for(const lesson of a.host.StrandLessons.lessons){const result=runLesson(a,lesson.id);assert(result.evidence.length===lesson.steps.length);runs.push({id:result.id,fighter:result.fighter,frames:result.frames,evidence:result.evidence});}
});
check('Three active directional signatures are required for each of the eight fighters',()=>{
  const a=make();
  for(const fighter of Object.keys(a.host.StrandContent.fighters)){
    const result=runLesson(a,'signatures',fighter);assert.deepEqual(result.evidence.map(e=>e.engineAction),clone(a.host.StrandMovesData.forFighter(fighter).techniques.map(m=>m.engineAction)));
    runs.push({id:'signatures',fighter,frames:result.frames,evidence:result.evidence});
  }
});
check('Punishment and confirmed cancel remain achievable with all eight movement/power profiles',()=>{
  const a=make();for(const fighter of Object.keys(a.host.StrandContent.fighters))for(const id of ['punish','combo']){
    const result=runLesson(a,id,fighter);runs.push({id,fighter,frames:result.frames,evidence:result.evidence});
  }
});
check('No-input and wrong-guard attempts cannot validate; failure can be retried',()=>{
  const a=make();
  for(const id of ['distance','reach','punish','resource','signatures','combo'])assert.equal(runLesson(a,id,'sam',{idle:true,optional:true,limit:400}).phase,'active',id);
  for(const id of ['guard-high','guard-low']){const failed=runLesson(a,id,'sam',{idle:true,optional:true});assert.equal(failed.phase,'retry');assert.equal(failed.evidence.length,0);assert.equal(runLesson(a,id).phase,'success');}
  const highAgainstLow=runLesson(a,'guard-low','sam',{controls:()=>({guard:true}),optional:true});assert.equal(highAgainstLow.phase,'retry');assert.equal(highAgainstLow.evidence.length,0);
});
check('Objective boundaries reject a late punish and a fresh attack during recovery of resources',()=>{
  const a=make();
  const late=runLesson(a,'punish','sam',{optional:true,limit:500,controls(state,status,memory){
    const [self,foe]=status.fighters,gap=Math.abs(foe.x-self.x),forward=self.x<=foe.x?'right':'left',wanted={};
    if(status.phase!=='fight'||memory.late)return wanted;
    if(state.step===0&&!foe.action&&gap>170)wanted[forward]=true;
    if(state.step===1){if(gap>102)wanted[forward]=true;else if(status.training.moves[1]?.frame>=33&&!self.action){wanted.light=true;memory.late=true;}}
    return wanted;
  }});
  assert.equal(late.phase,'active');assert(late.final.fighters[1].hp<100,'Late hit really landed after the recovery boundary');assert.equal(late.evidence.length,0);
  const spending=runLesson(a,'resource','sam',{optional:true,controls(state,status,memory){
    if(status.phase!=='fight'||status.fighters[0].action)return {};
    if(state.step===0)return {special:true};
    if(!memory.extra){memory.extra=true;return {heavy:true};}
    return {};
  }});
  assert.equal(spending.phase,'retry');assert.equal(spending.evidence.length,1,'Only the initial spend was validated');
});

check('Progress is isolated, validates stored values and survives an unavailable store',()=>{
  const storage=new Map([['echos.v1.chapters','{"sam":2}'],['echos.campaign.v1','untouched'],['echos.v1.cup','untouched'],['echos.boss.v1','untouched']]);
  const a=make({storage}),module=a.host.StrandLessons,store=module.createStore();const before=new Map(storage);
  assert(store.begin('punish','sam'));assert.equal(store.complete('guard-high','sam'),true);assert.equal(store.complete('not-a-lesson','sam'),false);
  const restored=module.createStore().progress();assert.equal(restored.completed['guard-high'].runs,1);assert.deepEqual(clone(restored.completed['guard-high'].fighters),['sam']);
  for(const [key,value]of before)assert.equal(storage.get(key),value,key+' preserved');
  for(const invalid of ['{broken',JSON.stringify({version:1,completed:[],resume:{id:'distance',fighter:'sam'}}),JSON.stringify({version:1,completed:{distance:{runs:1,fighters:['unknown']}},resume:{id:'distance',fighter:'sam'}})]){
    const b=make({storage:new Map([[module.storeKey,invalid]])}),bad=b.host.StrandLessons.createStore();assert.equal(Object.keys(bad.progress().completed).length,0);assert(bad.progress().notice);assert.equal(b.storage.get(module.storeKey),invalid,'Read does not overwrite invalid storage');
  }
  const unavailable=make({writeError:true}).host.StrandLessons.createStore();assert(unavailable.complete('distance','sam'));assert.equal(unavailable.progress().saved,false);assert.equal(unavailable.progress().completed.distance.runs,1);
});
check('Actual application completes the full course with remapped keys, visible feedback and isolated progress',()=>{
  const remap={right:'e',light:'b',heavy:'c',special:'v',guard:'x',down:'n'},keys={left:'q',right:'e',up:'z',down:'n',guard:'x',light:'b',heavy:'c',special:'v',throw:'t'};
  const storage=new Map([['echos.v1.chapters','{"sam":2}'],['echos.v1.scenes','{"sam:intro":true}']]),before=new Map(storage);
  const a=appWorld({storage,remap});a.click('[data-act="mode"][data-mode="training"]');a.click('[data-act="lessons"]');
  assert.equal(a.document.querySelectorAll('.lessonCard').length,8);
  const ids=a.host.StrandLessons.lessons.map(l=>l.id);
  a.click('[data-act="startLesson"][data-lesson="'+ids[0]+'"]');
  for(const [index,id]of ids.entries()){
    assert.equal(a.document.querySelector('#dummy'),null,'Guided mannequin is not the free recording UI');
    const result=completeAppLesson(a,id,keys);runs.push({id,fighter:'sam',surface:'actual-app-remapped-keyboard',...result});
    if(index<ids.length-1)a.click('[data-act="startLesson"][data-lesson="'+ids[index+1]+'"]');
  }
  assert.equal(Object.keys(JSON.parse(storage.get(a.host.StrandLessons.storeKey)).completed).length,8);
  for(const [key,value]of before)assert.equal(storage.get(key),value,'Other progression unchanged');
  a.click('#homeLink');assert.equal(a.host.StrandFight.snapshot(),null,'Home works after a settled lesson');
  assert(a.document.querySelector('[data-act="mode"][data-mode="training"]'));
});
check('Actual application pauses, retries, resumes at the beginning, and preserves free dojo controls',()=>{
  const storage=new Map(),a=appWorld({storage});openLesson(a,'guard-low');a.frames(74);
  const before=clone(a.host.StrandFight.snapshot());a.key('ArrowLeft');a.frames(8);a.key('ArrowLeft',false);
  assert.equal(a.host.StrandFight.snapshot().fighters[1].move,'','External J2 cannot replace the guided action');
  a.key('Escape');assert(a.host.StrandFight.snapshot().paused);const tick=a.host.StrandFight.snapshot().tick;a.frames(80);assert.equal(a.host.StrandFight.snapshot().tick,tick);
  a.key('Escape',false);a.key('Escape');a.key('Escape',false);assert(!a.host.StrandFight.snapshot().paused);
  a.click('[data-act="controls"]');assert(a.document.getElementById('manual').open);assert(a.host.StrandFight.snapshot().paused);a.document.getElementById('manual').close();assert(!a.host.StrandFight.snapshot().paused);
  a.frames(160);assert.equal(a.currentLesson().status().phase,'retry');assert.equal(a.document.getElementById('lessonResult').hidden,false);
  assert.equal(JSON.parse(storage.get(a.host.StrandLessons.storeKey)).completed['guard-low'],undefined,'Failed attempt is not saved as complete');a.click('[data-act="retryLesson"]');assert.equal(a.currentLesson().status().phase,'active');assert.equal(a.currentLesson().status().step,0);
  a.frames(90);a.send(a.host,'pagehide');assert.equal(a.host.StrandFight.snapshot(),null);
  const b=appWorld({storage});b.click('[data-act="mode"][data-mode="training"]');b.click('[data-act="lessons"]');
  b.click('[data-act="startLesson"][data-lesson="guard-low"][data-fighter="sam"]');assert.equal(b.currentLesson().status().step,0);
  assert.equal(b.host.StrandFight.snapshot().tick,0);b.click('[data-act="lessons"]');b.click('[data-act="selection"]');b.click('[data-act="start"]');
  assert.equal(b.host.StrandFight.snapshot().training.dummy,'idle');assert(b.document.getElementById('dummy'));
  b.change('#dummy','record');b.frames(80);b.key('j');b.frames(3);b.key('j',false);assert.equal(b.host.StrandFight.snapshot().fighters[1].move,'light');b.send(b.host,'pagehide');
});
check('Touch and a synthetic standard gamepad drive the same measured lesson',()=>{
  const touch=appWorld();openLesson(touch,'guard-high');touch.frames(80);
  const guard=touch.document.querySelector('[data-p="1"][data-input="guard"]');touch.send(guard,'pointerdown',{pointerId:12});
  for(let i=0;i<700&&touch.currentLesson().status().phase==='active';i++)touch.frames();
  assert.equal(touch.currentLesson().status().phase,'success');assert.equal(guard.classList.contains('held'),false);touch.send(guard,'pointerup',{pointerId:12});touch.send(touch.host,'pagehide');
  const pad=appWorld({gamepads:true});openLesson(pad,'guard-high');pad.frames(80);
  const gamepad={index:0,id:'Synthetic standard lesson pad',mapping:'standard',connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};
  pad.samples[0]=gamepad;pad.frames(2);gamepad.buttons[4]={pressed:true,value:1};
  for(let i=0;i<700&&pad.currentLesson().status().phase==='active';i++)pad.frames();
  assert.equal(pad.currentLesson().status().phase,'success');pad.send(pad.host,'pagehide');
});

check('Boss compendium surfaces: real app selection, saved Rush and campaign briefing fixtures',()=>{
  const a=make();a.load(['boss-data.js','boss-guide.js']);a.load(['app.js']);
  a.click('[data-act="mode"][data-mode="boss"]');assert(a.document.querySelector('.bossGuide'));
  a.click('[data-act="pickBoss"][data-boss="truck"]');assert(a.document.querySelector('.bossGuide').textContent.includes(a.host.StrandBoss.encounters.truck.name));
  a.click('[data-act="pick"][data-id="fragile"]');a.change('[data-option="difficulty"]','hard');
  assert.match(a.document.querySelector('.bossGuideLead').textContent,/Fragile/);assert.match(a.document.querySelector('.bossGuideLead').textContent,/Vétéran/);
  a.click('[data-act="home"]');a.click('[data-act="mode"][data-mode="bossrush"]');
  assert(a.document.querySelector('.bossGuide').textContent.includes(a.host.StrandBossData.modes.bossrush.title));
  a.click('[data-act="newRush"]');a.click('[data-act="pause"]');a.click('[data-act="leave"]');a.click('[data-act="pick"][data-id="sam"]');
  assert.match(a.document.querySelector('.bossGuideLead').textContent,/Fragile/,'Guide reflects the saved Rush fighter, not a prospective replacement');
  a.send(a.host,'pagehide');
  // Explicit valid progress fixtures test the briefing UI, not campaign wins.
  for(const chapter of [4,5]){
    const b=make(),campaign=b.host.StrandCampaign.createStore();campaign.start('easy');campaign.advance();
    for(let i=0;i<chapter;i++){const encounter=campaign.beginEncounter(),c=encounter.chapter;
      const fixture=c.kind==='duel'?{stage:c.stage,fighters:[c.p1,c.p2],winner:1,rounds:[2,0],vitality:80,reason:'ko'}:
        {stage:c.stage,p1:c.p1,bossId:c.boss,difficulty:'easy',won:true,vitality:80,reason:'boss',score:1000};
      assert(campaign.record(encounter.ticket,fixture));assert(campaign.advance());
    }
    b.load(['boss-data.js','boss-guide.js','app.js']);b.click('[data-act="mode"][data-mode="campaign"]');b.click('[data-act="campaignResume"]');
    const expected=b.host.StrandCampaign.chapters[chapter],guide=b.document.querySelector('.bossGuide');assert(guide);
    assert(guide.textContent.includes(b.host.StrandBoss.encounters[expected.boss].name));
    assert(guide.textContent.includes(b.host.StrandBossData.modes.campaign.title));assert.equal(b.host.StrandBoss.snapshot(),null);
    assert(b.document.querySelector('[data-act="campaignFight"]'),'Encounter entry remains accessible');b.send(b.host,'pagehide');
  }
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  for(const file of ['lessons.js','lessons.css','boss-data.js','boss-guide.js','boss-guide.css'])assert(html.includes('"'+file+'"'),file+' loaded');
});

const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
const sources=[...files,'app.js','index.html','lessons.css','qa/lessons.cjs','qa/input-host.cjs','boss-data.js','boss-guide.js','boss-guide.css'];
const report={date:new Date().toISOString(),passed:true,method:'Modules réels et entrées normales ; DOM/Canvas simulés, aucune victoire ni modification de combattant injectée.',browser:false,nativeCanvas:false,hardwareGamepadTested:false,
  checks,runs,sourceSha256:Object.fromEntries(sources.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]))};
if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({passed:true,checks:checks.length,runs:runs.length,output:output||null}));
