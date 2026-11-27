'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const {world}=require('./input-host.cjs'),root=path.resolve(__dirname,'..'),clone=value=>JSON.parse(JSON.stringify(value));
const report={date:new Date().toISOString(),method:'Actual input/app/netplay modules; event-capable simulated DOM and Canvas; synthetic standard-gamepad samples; actual duel and Boss engines for input integration',browser:false,nativeCanvas:false,hardwareGamepadTested:false,checks:[]};
function check(name,fn){fn();report.checks.push(name);}
function pad(index=0){return {index,mapping:'standard',connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false,value:0}))};}
function moduleWorld(options={}){const w=world(options);w.load(['input.js']);return w;}
const w=moduleWorld(),I=w.host.StrandInput,S=I.createSettings();
check('Default bindings, independent profiles and persistence',()=>{
  assert.equal(I.actions.length,11);assert.equal(S.label(1,'left'),'Q / A');assert.equal(S.label(2,'left'),'←');assert.equal(S.label(1,'taunt'),'B');assert.equal(S.label(2,'taunt'),'P');
  assert(S.bind(1,'light',0,';').ok);assert.equal(S.label(1,'light'),';');assert.equal(S.find('f'),null);
  assert(S.rename('Clavier du salon').ok);S.activate('2');assert.equal(S.label(1,'light'),'F');S.activate('1');assert.equal(S.label(1,'light'),';');
  const reloaded=I.createSettings();assert.equal(reloaded.profile().name,'Clavier du salon');assert.equal(reloaded.label(1,'light'),';');
  assert(w.operations.every(([,key])=>key===I.storeKey),'No game save touched');
});
check('All twenty-two player/action pairs are remappable; collisions are rejected without mutation',()=>{
  S.restore();const values=['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ';', '.', ',', '/', '\\', '-', '=', '[', ']', "'", '`', '?'];let i=0;
  for(const player of [1,2])for(const action of I.actions){assert(S.bind(player,action.id,0,values[i++]).ok);assert.equal(S.find(values[i-1]).player,player);}
  const before=JSON.stringify(S.state());assert.equal(S.bind(2,'finish',1,'0').ok,false);assert.equal(JSON.stringify(S.state()),before);
  assert.equal(S.bind(1,'left',1,'0').ok,false);assert.equal(S.bind(1,'light',0,'Escape').ok,false);assert.equal(S.bind(1,'light',0,'Tab').ok,false);
  assert(S.bind(1,'light',1,'Enter').ok);assert.equal(S.label(1,'light'),'4 / Entrée');assert(S.removeSecondary(1,'light').ok);assert.equal(S.label(1,'light'),'4');
});
check('Defaults restore per player; conflicting restoration preserves the current profile',()=>{
  S.restore();S.bind(1,'left',0,'1');S.removeSecondary(1,'left');S.bind(2,'heavy',0,'q');
  const before=JSON.stringify(S.state());assert.equal(S.restore(1).ok,false);assert.equal(JSON.stringify(S.state()),before);
  assert(S.restore().ok);assert.equal(S.label(1,'left'),'Q / A');assert.equal(S.label(2,'heavy'),'K');
  S.bind(1,'light',0,';');S.bind(2,'light',0,'c');S.restore(1);assert.equal(S.label(1,'light'),'F');assert.equal(S.label(2,'light'),'C');S.restore();
});
check('Invalid storage and denied storage fail safely',()=>{
  const valid=S.state();
  for(const value of ['{',JSON.stringify({...valid,version:99}),JSON.stringify({...valid,networkPlayer:3}),JSON.stringify({...valid,gamepad:{enabled:true,deadzone:-1}}),
    JSON.stringify({...valid,profiles:valid.profiles.map((p,i)=>i?p:{...p,bindings:{...p.bindings,1:{...p.bindings[1],light:['q']}}})})]){
    const stored=new Map([[I.storeKey,value]]),u=I.createSettings({getItem:key=>stored.get(key),setItem:(key,text)=>stored.set(key,text)});
    assert.equal(u.label(1,'light'),'F');assert(I.valid(u.state()));assert(u.status().message);assert.equal(stored.get(I.storeKey),value,'Unreadable data is not overwritten merely by loading');
  }
  const u=I.createSettings({getItem(){throw Error('Denied');},setItem(){throw Error('Quota');}});assert.equal(u.bind(1,'light',0,';').saved,false);assert.equal(u.label(1,'light'),';');
  const outer=S.state();outer.profiles[0].bindings[1].light=['Escape'];assert.equal(S.label(1,'light'),'F','Public snapshots cannot mutate settings');
});

const r=moduleWorld(),events=[],settings=r.host.StrandInput.createSettings();let enabled=true,second=true,pauses=0,lost=[];
const C=r.host.StrandInput.createController({settings,accepts:p=>enabled&&(p===1||second),canPause:()=>true,onPause:()=>{pauses++;},onInput:(...args)=>events.push(args),onDeviceLost:p=>lost.push(p)});
check('Physical key releases, aliases, modifiers, repeated events and multi-source arbitration',()=>{
  r.key('q');r.key('a');assert.deepEqual(events,[[1,'left',true]]);r.key('q',false);assert.equal(events.length,1);r.key('a',false);assert.deepEqual(events.at(-1),[1,'left',false]);
  events.length=0;r.key('d');r.key('D',false,{code:'KeyD',ctrlKey:true});assert.deepEqual(events,[[1,'right',true],[1,'right',false]]);
  events.length=0;r.key('f');r.key('f',true,{repeat:true});C.press('pointer:9',1,'light');r.key('f',false);assert.equal(events.length,1);C.release('pointer:9');assert.deepEqual(events.at(-1),[1,'light',false]);
  const before=events.length;r.key('d',true,{ctrlKey:true});r.key('d',true,{altKey:true});assert.equal(events.length,before);
  r.key('Escape');r.key('Escape',true,{repeat:true});assert.equal(pauses,1);
});
check('Focus, blur, visibility, reconfiguration and player availability release held inputs',()=>{
  const field=new r.Node('select');r.document.body.append(field);r.key('d');field.focus();assert.deepEqual(events.at(-1),[1,'right',false]);r.key('d');assert.equal(C.held().length,0);
  r.document.body.focus();r.key('d');r.send(r.host,'blur');assert.equal(C.held().length,0);r.key('d');assert.equal(C.held().length,0);r.send(r.host,'focus');
  r.key('d');settings.bind(1,'right',0,'e');assert.deepEqual(events.at(-1),[1,'right',false]);r.key('d',false);r.key('e');assert(C.isHeld(1,'right'));r.document.hidden=true;r.send(r.document,'visibilitychange');assert.equal(C.held().length,0);r.document.hidden=false;
  r.key('e',false);second=false;r.key('j');assert.equal(C.held().length,0);second=true;r.key('j');assert(C.isHeld(2,'light'));C.releaseAll(2);assert.equal(C.held().length,0);settings.restore();
  const button=new r.Node('button');r.document.body.append(button);r.key('d');button.focus();assert.equal(C.held().length,0,'Tabbing to a button neutralizes held combat inputs');
  settings.bind(1,'light',0,'Enter');const before=events.length;r.key('Enter');assert.equal(events.length,before,'Enter activates focused UI rather than a remapped attack');r.document.body.focus();r.key('Enter');assert(C.isHeld(1,'light'));r.key('Enter',false);settings.restore();
});
check('A valid external profile releases held inputs; invalid external data preserves the usable profile',()=>{
  r.document.body.focus();r.key('d');const external=settings.state();external.profiles[0].bindings[1].right=['e'];r.storage.set(I.storeKey,JSON.stringify(external));r.send(r.host,'storage',{key:I.storeKey});assert.equal(C.held().length,0);assert.equal(settings.label(1,'right'),'E');
  r.storage.set(I.storeKey,'{');r.send(r.host,'storage',{key:I.storeKey});assert.equal(settings.label(1,'right'),'E');r.key('d',false);settings.restore();
});
check('Standard gamepad deadzone, neutral rearm, keyboard aggregation and stable assignments',()=>{
  events.length=0;const first=pad(2),other=pad(5);r.samples[2]=first;r.samples[5]=other;first.axes[0]=.9;C.poll();assert.equal(events.length,0,'No carried input on connection');
  first.axes[0]=0;C.poll();first.axes[0]=.2;C.poll();assert.equal(events.length,0);first.axes[0]=.5;C.poll();assert.deepEqual(events.at(-1),[1,'right',true]);
  C.releaseAll();C.poll();assert.equal(C.held().length,0,'Held stick cannot restart after reconfiguration');first.axes[0]=0;C.poll();
  r.key('f');first.buttons[2].pressed=true;C.poll();r.key('f',false);assert(C.isHeld(1,'light'));first.buttons[2].pressed=false;C.poll();assert(!C.isHeld(1,'light'));
  other.axes[0]=-.8;C.poll();assert(C.isHeld(2,'left'));r.samples[2]=null;C.poll();assert(C.isHeld(2,'left'),'J2 is not reassigned after J1 disconnects');assert(lost.includes(1));
  other.axes[0]=0;C.poll();r.samples[5]=null;C.poll();assert.equal(C.held().length,0);assert(lost.includes(2));
});
check('Standard button mapping, pause, disconnection, unsupported pads and disable',()=>{
  const p=pad(0);r.samples[0]=p;C.poll();
  for(const [button,action]of [[0,'up'],[1,'special'],[2,'light'],[3,'heavy'],[4,'guard'],[5,'throw'],[6,'guard'],[7,'finish'],[10,'taunt'],[12,'up'],[13,'down'],[14,'left'],[15,'right']]){
    p.buttons[button].pressed=true;C.poll();assert(C.isHeld(1,action),'Standard button '+button);p.buttons[button].pressed=false;C.poll();assert(!C.isHeld(1,action));
  }
  p.buttons[9].pressed=true;C.poll();const count=pauses;C.poll();assert.equal(pauses,count,'Menu is edge-triggered');p.buttons[9].pressed=false;C.poll();
  p.axes[0]=1;C.poll();assert(C.isHeld(1,'right'));settings.setGamepad(false);C.poll();assert.equal(C.held().length,0);settings.setGamepad(true);C.poll();assert.equal(C.held().length,0);p.axes[0]=0;C.poll();
  p.buttons[2].pressed=true;C.poll();p.mapping='';C.poll();assert.equal(C.held().length,0);assert.equal(C.status().unsupported,1);r.samples[0]=null;C.poll();
  const get=r.host.navigator.getGamepads;r.host.navigator.getGamepads=()=>{throw Error('Denied');};C.poll();assert.equal(C.status().available,false);r.host.navigator.getGamepads=get;C.poll();assert.equal(C.status().available,true);
});

check('Editor capture, collisions, Escape, Tab, cancellation, focus and profile navigation',()=>{
  const container=new r.Node('div');r.document.body.append(container);r.document.body.focus();
  const editor=r.host.StrandInput.mountEditor(container,{settings,controller:C});
  const button=(action,slot=0)=>'[data-input-edit="bind"][data-input-action="'+action+'"][data-input-slot="'+slot+'"]';
  r.click(button('light'));assert(editor.isCapturing());r.key('g');assert(editor.isCapturing());assert.match(container.querySelector('[data-input-notice]').textContent,/déjà attribuée/);assert.equal(settings.label(1,'light'),'F');
  const count=pauses;r.key('Escape');assert(!editor.isCapturing());assert.equal(pauses,count,'Capture Escape does not pause/close the parent');assert.equal(r.document.activeElement.dataset.inputAction,'light');
  r.click(button('light'));r.key(';');assert.equal(settings.label(1,'light'),';');assert.equal(r.document.activeElement.dataset.inputAction,'light');
  r.click(button('heavy'));const tab=r.key('Tab');assert(!editor.isCapturing());assert.equal(tab.defaultPrevented,false,'Tab remains available for native navigation');
  r.click(button('heavy'));r.click('[data-input-edit="cancel"]');assert.equal(settings.label(1,'heavy'),'G');
  r.click(button('heavy'));r.send(r.host,'blur');assert(!editor.isCapturing(),'Leaving the window cancels capture');r.send(r.host,'focus');
  r.click('[data-input-player="2"]');r.click(button('light'));r.key('c');assert.equal(settings.label(2,'light'),'C');
  r.change('[data-input-profile]','2');assert.equal(settings.label(2,'light'),'J');assert.equal(r.document.activeElement.dataset.inputProfile,'');
  const name=container.querySelector('[data-input-name]');name.value='Deux joueurs';r.send(container.querySelector('[data-input-name-form]'),'submit');assert.equal(settings.profile().name,'Deux joueurs');
  r.change('[data-input-profile]','1');assert.equal(settings.label(2,'light'),'C');r.click('[data-input-edit="restore-all"]');assert.equal(settings.label(2,'light'),'J');
  editor.destroy();r.key(';');assert.equal(settings.label(1,'light'),'F','Destroyed editor cannot capture another key');C.releaseAll();
});

const appFiles=['content.js','asset-geometry-20261124.js','assets.js','boss-geometry-20261124.js','boss-assets.js','tournament.js','fight.js','boss.js','campaign.js','moves-data.js','relationships.js','input.js','app.js'];
check('Actual app: saved remap drives duel/Boss and updates touch, commands and dojo',()=>{
  const a=world({gamepads:false});a.html('index.html');a.load(['input.js']);const prefs=a.host.StrandInput.createSettings();prefs.bind(1,'right',0,'e');prefs.bind(1,'special',0,';');prefs.bind(1,'throw',0,'v');prefs.bind(2,'light',0,'c');
  a.load(appFiles.filter(file=>file!=='input.js'));a.click('[data-act="mode"][data-mode="training"]');a.click('[data-act="start"]');a.frames(100);
  let state=a.host.StrandFight.snapshot(),x=state.fighters[0].x;a.key('d');a.frames(8);a.key('d',false);assert.equal(a.host.StrandFight.snapshot().fighters[0].x,x,'Previous key no longer moves');
  a.key('e');a.frames(8);a.key('e',false);assert(a.host.StrandFight.snapshot().fighters[0].x>x,'Remapped key drives actual duel');
  const light=a.document.querySelector('[data-p="1"][data-input="light"]');a.key('f');a.send(light,'pointerdown',{pointerId:9});assert(light.classList.contains('held'));a.send(light,'pointerup',{pointerId:9});assert(light.classList.contains('held'),'Keyboard still holds the shared action');a.key('f',false);assert(!light.classList.contains('held'),'The final keyboard release clears tactile highlighting');
  assert.match(a.document.querySelector('[data-input="special"]').getAttribute('aria-label'),/clavier ;/);assert.match(a.document.querySelector('[data-input-summary="2"]').textContent,/Léger C/);
  a.change('#dummy','record');a.key('c');a.frames(8);a.key('c',false);assert(a.host.StrandFight.snapshot().training.frames>0,'J2 remap is recorded by actual dojo');
  a.click('[data-act="controls"]');assert(a.document.getElementById('manual').open);assert(a.host.StrandFight.snapshot().paused);assert.equal(a.document.querySelector('[data-key-player="1"][data-key-action="special"]').textContent,';');
  a.document.getElementById('manual').close();assert(!a.host.StrandFight.snapshot().paused);
  a.click('[data-act="pause"]');a.click('[data-act="leave"]');a.click('[data-act="home"]');a.click('[data-act="mode"][data-mode="boss"]');a.click('[data-act="pickBoss"][data-boss="truck"]');assert.match(a.document.getElementById('view').textContent,/La commande Colis prend/);assert(!a.document.getElementById('view').textContent.includes('T prend'));
  a.click('[data-act="startBoss"]');a.frames(150);assert(a.texts.some(text=>text==='Léger · Lourd · Signature · Garde · Saut · Colis · Charge chirale'));assert(!a.texts.some(text=>/F léger|T cargaison|Z\/W saut/.test(text)));assert.match(a.document.querySelector('[data-input="throw"]').getAttribute('aria-label'),/clavier V/);
  x=a.host.StrandBoss.snapshot().p.x;a.key('e');a.frames(8);a.key('e',false);assert(a.host.StrandBoss.snapshot().p.x>x,'Remapped key drives actual Boss');
  a.send(a.host,'blur');assert(a.host.StrandBoss.snapshot().paused);assert(!a.host.StrandBoss.snapshot().p.keys.right);a.send(a.host,'focus');
  a.click('[data-act="pause"]');a.click('[data-act="controls"]');assert(!a.document.getElementById('keys').textContent.includes('Données du duel'),'Duel timings are excluded from Boss commands');assert(a.document.getElementById('inputEditor').textContent.includes('Projection · Colis / Appui en Boss'),'Editor explicitly connects the Boss action alias to Projection');
  a.document.getElementById('manual').close();a.send(a.host,'pagehide');
});

check('Actual app: linked and standalone arena selection, Boss exclusion, optional Versus/Arcade exchanges',()=>{
  const a=world({gamepads:false});a.html('index.html');a.load(appFiles);a.click('[data-act="mode"][data-mode="training"]');a.change('[data-option="stage"]','terminal-linked');
  assert.match(a.document.querySelector('.stageRule').textContent,/un passage par manche/);a.click('[data-act="start"]');assert.equal(a.host.StrandFight.snapshot().stage,'terminal-linked');assert.equal(a.host.StrandFight.snapshot().link.zone,'terminal');
  a.click('[data-act="pause"]');a.click('[data-act="leave"]');a.change('[data-option="stage"]','terminal-hangar');a.click('[data-act="start"]');assert.equal(a.host.StrandFight.snapshot().stage,'terminal-hangar');assert.equal(a.host.StrandFight.snapshot().link,undefined);
  a.click('[data-act="pause"]');a.click('[data-act="leave"]');a.click('[data-act="home"]');a.click('[data-act="mode"][data-mode="boss"]');const stages=a.document.querySelector('[data-option="bossStage"]').children.map(option=>option.value);assert(!stages.includes('terminal-linked'));assert(stages.includes('terminal-hangar'));
  a.click('[data-act="home"]');a.click('[data-act="mode"][data-mode="versus"]');a.change('[data-option="stage"]','terminal-linked');a.click('[data-act="start"]');assert.match(a.document.getElementById('view').textContent,/Fiction du simulateur/);assert.equal(a.document.querySelectorAll('blockquote').length,2);assert.equal(a.host.StrandFight.snapshot(),null);a.click('[data-act="enterDuel"]');assert.equal(a.host.StrandFight.snapshot().stage,'terminal-linked');
  a.click('[data-act="pause"]');a.click('[data-act="leave"]');a.click('[data-act="home"]');a.click('[data-act="mode"][data-mode="arcade"]');a.click('[data-act="start"]');assert(a.document.querySelector('[data-act="enterDuel"]'));a.click('[data-act="enterDuel"]');assert(a.host.StrandFight.snapshot());a.send(a.host,'pagehide');
});

check('Actual app replay input guard uses logical recordings independently of current keys',()=>{
  const tape={version:1,p1:'sam',p2:'higgs',stage:'shore',mode:'local',seed:42,difficulty:1,roundsToWin:2,ticks:1000,events:[]};
  const cup={version:1,difficulty:'normal',entrants:[{id:0,fighter:'sam',label:'J1',human:true},{id:1,fighter:'higgs',label:'J2',human:true}],rounds:[[{id:'0-0',players:[0,1],winner:0,score:[2,0],seed:42,stage:'shore',replay:tape}]]};
  const a=world({gamepads:false,storage:new Map([['echos.v1.cup',JSON.stringify(cup)]])});a.html('index.html');a.load(appFiles);a.click('[data-act="mode"][data-mode="tournament"]');a.click('[data-act="bracket"]');a.click('[data-act="cupReplay"]');a.frames(100);
  const before=clone(a.host.StrandFight.snapshot().fighters.map(f=>f.x));a.key('d');a.key('h');a.frames(8);a.key('d',false);a.key('h',false);assert.deepEqual(clone(a.host.StrandFight.snapshot().fighters.map(f=>f.x)),before);assert.equal(a.document.querySelectorAll('[data-input]').length,0);a.send(a.host,'pagehide');
});

check('All nine local modes accept remapped keyboard and standard-gamepad samples through their actual engines',()=>{
  report.modeInputs=[];
  for(const mode of ['story','arcade','versus','tournament','challenges','training','boss','bossrush','campaign']){
    const a=world();a.html('index.html');a.load(['input.js']);const prefs=a.host.StrandInput.createSettings();prefs.bind(1,'right',0,'e');a.load(appFiles.filter(file=>file!=='input.js'));
    a.click('[data-act="mode"][data-mode="'+mode+'"]');
    if(mode==='boss')a.click('[data-act="startBoss"]');
    else if(mode==='bossrush')a.click('[data-act="newRush"]');
    else if(mode==='campaign'){a.click('[data-act="campaignNew"]');a.click('[data-act="campaignAdvance"]');a.click('[data-act="campaignFight"]');}
    else{a.click('[data-act="start"]');if(mode==='story')a.click('[data-act="routeFight"]');if(mode==='tournament')a.click('[data-act="cupFight"]');if(a.document.querySelector('[data-act="enterDuel"]'))a.click('[data-act="enterDuel"]');}
    a.frames(90);const boss=!!a.host.StrandBoss.snapshot(),engine=boss?a.host.StrandBoss:a.host.StrandFight,x=()=>boss?engine.snapshot().p.x:engine.snapshot().fighters[0].x;
    const keyboardBefore=x();a.key('e');a.frames(5);a.key('e',false);assert(x()>keyboardBefore,mode+' remapped keyboard reaches the engine');
    const p=pad();a.samples[0]=p;a.frames(2);const gamepadBefore=x();p.axes[0]=-.9;a.frames(5);p.axes[0]=0;a.frames(1);assert(x()<gamepadBefore,mode+' standard pad reaches the engine');
    a.samples[0]=null;a.frames(1);assert(engine.snapshot().paused,mode+' pauses on gamepad disconnection');
    report.modeInputs.push({mode,engine:boss?'StrandBoss':'StrandFight',remappedKeyboard:true,syntheticStandardGamepad:true,disconnectPaused:true});a.send(a.host,'pagehide');
  }
});

check('J2 remap and second gamepad reach local Versus and dojo recording',()=>{
  for(const mode of ['versus','training']){
    const a=world();a.html('index.html');a.load(['input.js']);a.host.StrandInput.createSettings().bind(2,'right',0,';');a.load(appFiles.filter(file=>file!=='input.js'));
    a.click('[data-act="mode"][data-mode="'+mode+'"]');if(mode==='versus')a.change('[data-option="opponent"]','local');a.click('[data-act="start"]');if(a.document.querySelector('[data-act="enterDuel"]'))a.click('[data-act="enterDuel"]');
    a.frames(90);if(mode==='training')a.change('#dummy','record');const x=()=>a.host.StrandFight.snapshot().fighters[1].x;
    let before=x();a.key(';');a.frames(5);a.key(';',false);assert(x()>before,mode+' J2 remap');
    a.samples[0]=pad(0);a.samples[1]=pad(1);a.frames(2);before=x();a.samples[1].axes[0]=-.9;a.frames(5);assert(x()<before,mode+' second pad');a.samples[1].axes[0]=0;a.frames(1);a.send(a.host,'pagehide');
  }
});

async function networkCheck(){
  const requests=[];let fail=false;
  const reply={live:true,tick:0,ack:0,cursor:0,total:0,events:[],result:null,seats:[{fighter:'sam',ready:true,connected:true},{fighter:'higgs',ready:true,connected:true}],match:{p1:'sam',p2:'higgs',stage:'shore',seed:42,version:'test'}};
  const n=world({fetch:async(_url,options)=>{const req=JSON.parse(options.body);requests.push(req);if(fail)throw Error('offline');return {ok:true,json:async()=>req.op==='create'?{player:2,room:'abc123456789'}:req.op==='leave'?{closed:true}:clone(reply)};}});
  const calls=[],delivered=[];n.host.StrandRoomVersion='test';n.storage.set('echos.private.record',JSON.stringify({version:'test',result:{winner:1,rounds:'2-0'},tape:{version:1,p1:'sam',p2:'higgs',stage:'shore',mode:'local',seed:42,difficulty:1,roundsToWin:2,ticks:1000,events:[]}}));
  n.host.StrandFight={start:o=>calls.push(['start',o]),stop(){},setSound(){},setAmbienceVolume(){},setAudioSuspended(){},setStaticScenery(){},validReplay:()=>true,
    snapshot:()=>({phase:'fight'}),network:{checkpoint:()=>({}),restore(){},advance(...args){calls.push(['advance',...args]);},draw(){}}};
  n.html('netplay.html');n.load(['content.js','input.js']);const create=n.host.StrandInput.createController;
  n.host.StrandInput.createController=options=>create({...options,onInput(...args){delivered.push(args);options.onInput(...args);}});
  n.load(['netplay.js']);n.click('#create');await n.settle();
  const sync=async()=>{const entry=[...n.timers].find(([,fn])=>fn.name==='sync');assert(entry);n.timers.delete(entry[0]);await entry[1]();await n.settle();};
  n.document.getElementById('canvas').focus();n.key('d');n.key('d',false);await sync();assert.deepEqual(requests.at(-1).inputs.slice(-2).map(event=>event.slice(2)),[['right',true],['right',false]],'Default local J1 controls work from network seat 2');
  n.click('#roomCommands');assert(n.document.getElementById('roomManual').open);n.change('[data-input-network]','2');n.click('[data-input-edit="bind"][data-input-action="light"][data-input-slot="0"]');n.key(';');
  assert.match(n.document.getElementById('roomKeySummary').textContent,/J2.*Coup léger ;/);n.document.getElementById('roomManual').close();n.document.getElementById('canvas').focus();
  const before=requests.at(-1).inputs.length;n.key('f');n.key('f',false);await sync();assert.equal(requests.at(-1).inputs.length,before,'Other local player profile is inactive in the room');
  n.key(';');const touch=n.document.querySelector('[data-action="light"]');n.send(touch,'pointerdown',{pointerId:7});n.key(';',false);await sync();assert.equal(requests.at(-1).inputs.at(-1)[3],true,'Touch keeps action active after keyboard releases');
  n.send(touch,'pointercancel',{pointerId:7});await sync();assert.equal(requests.at(-1).inputs.at(-1)[3],false);
  n.key('ArrowRight');n.document.getElementById('roomScenery').focus();await sync();assert.deepEqual(requests.at(-1).inputs.slice(-2).map(event=>event.slice(2)),[['right',true],['right',false]],'Focus releases before keyup');
  n.document.getElementById('canvas').focus();n.key('ArrowRight');fail=true;await sync();fail=false;await sync();assert.equal(requests.at(-1).inputs.at(-1)[3],false,'Connection loss releases predicted control');
  n.key('ArrowRight',false);n.samples[0]=pad();n.frames(2);n.samples[0].axes[0]=1;n.frames(1);await sync();assert.equal(requests.at(-1).inputs.at(-1)[3],true,'The first pad controls the selected local profile');n.samples[0]=null;n.frames(1);await sync();assert.equal(requests.at(-1).inputs.at(-1)[3],false,'Pad disconnection sends a logical release');
  reply.result={mismatch:true};await sync();const total=delivered.length;n.key('ArrowRight');n.key('ArrowRight',false);assert.equal(delivered.length,total,'A declared result disables new combat commands');
  n.click('#watch');await n.settle();assert(calls.at(-1)[1].replay);n.key('ArrowRight');n.key('ArrowRight',false);assert.equal(delivered.length,total,'Replay cannot receive local commands');n.send(n.host,'pagehide');
  report.checks.push('Actual network module: local profile independent of remote seat, shared remap UI, keyboard/touch/pad arbitration, focus and disconnection releases; relay/engine are explicit test adapters');
}
(async()=>{await networkCheck();
  report.sourceSHA256=Object.fromEntries([...new Set([...appFiles,'netplay.js','netplay.html','index.html','input.css','qa/commandes.cjs','qa/input-host.cjs'])].map(file=>[file,createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]));
  report.passed=true;const output=process.argv.find(value=>value.startsWith('--output='))?.slice(9);if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(path.resolve(output),JSON.stringify(report,null,2)+'\n');}
  console.log(JSON.stringify(report,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;});
