const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');

// A controlled Web Audio graph checks ownership and clocks without requiring
// a browser, a sound device or an autoplay exception in CI.
function harness({available=true,state='running',resume='resolve'}={}) {
  const contexts=[],frames=new Map();let frameId=0;
  class Parameter {
    constructor(value=0){this.value=value;this.events=[];}
    setValueAtTime(value,time){this.value=value;this.events.push(['set',value,time]);}
    exponentialRampToValueAtTime(value,time){this.value=value;this.events.push(['ramp',value,time]);}
    setTargetAtTime(value,time,constant){this.value=value;this.events.push(['target',value,time,constant]);}
  }
  class Node {
    constructor(ctx,kind){this.ctx=ctx;this.kind=kind;this.connections=new Set();ctx.nodes.push(this);}
    connect(node){assert(node,'A node must connect to a destination');this.connections.add(node);return node;}
    disconnect(){this.connections.clear();}
  }
  class Source extends Node {
    constructor(ctx,kind){super(ctx,kind);this.frequency=new Parameter();this.active=false;this.stopAt=Infinity;this.loop=false;}
    start(time=0){assert(!this.started,'A Web Audio source starts only once');this.started=true;this.active=true;this.startAt=time;this.ctx.starts.push(this);}
    stop(time){if(time!==undefined&&time>this.ctx.currentTime){this.stopAt=time;return;}this.active=false;this.onended?.();}
  }
  class AudioContext {
    constructor(){this.state=state;this.currentTime=0;this.sampleRate=8000;this.nodes=[];this.starts=[];this.resumes=0;this.listeners={};this.destination={kind:'destination'};contexts.push(this);}
    createGain(){const node=new Node(this,'gain');node.gain=new Parameter(1);return node;}
    createOscillator(){return new Source(this,'oscillator');}
    createBufferSource(){return new Source(this,'buffer');}
    createBiquadFilter(){const node=new Node(this,'filter');node.frequency=new Parameter();node.Q=new Parameter();return node;}
    createStereoPanner(){const node=new Node(this,'panner');node.pan=new Parameter();return node;}
    createBuffer(channels,length){const values=new Float32Array(length);return {getChannelData:()=>values};}
    addEventListener(name,handler){this.listeners[name]=handler;}
    resume(){
      this.resumes++;
      if(resume==='reject')return Promise.reject(new Error('Autoplay denied'));
      if(resume==='throw')throw new Error('Context unavailable');
      if(resume==='defer')return new Promise(resolve=>{this.resolveResume=()=>{this.state='running';this.listeners.statechange?.();resolve();};});
      this.state='running';this.listeners.statechange?.();return Promise.resolve();
    }
    advance(seconds){this.currentTime+=seconds;for(const node of this.nodes)if(node.active&&node.stopAt<=this.currentTime)node.stop();}
    active(){return this.nodes.filter(node=>node.active);}
    connected(){return this.nodes.filter(node=>node.connections.size);}
  }
  const window={document:{hidden:false},requestAnimationFrame:callback=>{frames.set(++frameId,callback);return frameId;},cancelAnimationFrame:id=>frames.delete(id)};
  if(available)window.AudioContext=AudioContext;
  const context={window,Image:class{},structuredClone,console};
  vm.createContext(context);vm.runInContext(source('content.js'),context);vm.runInContext(source('fight.js'),context);
  const canvasContext=new Proxy({createLinearGradient:()=>({addColorStop(){}}),measureText:()=>({width:10})},{get:(o,key)=>o[key]||(()=>{})});
  const canvas={getContext:()=>canvasContext};
  const engine=window.StrandFight;
  const start=options=>engine.start({canvas,p1:'sam',p2:'higgs',stage:'shore',mode:'local',clock:'network',seed:42,sound:true,ambienceVolume:.35,...options});
  return {engine,start,contexts,window,frames,canvas};
}
function assertSilent(ctx,label){assert.equal(ctx.active().length,0,label+' : no source runs');assert.equal(ctx.connected().length,0,label+' : all nodes disconnect');}

async function verifyAudio() {
  const h=harness(),{engine,start}=h;
  const stages=Object.keys(h.window.StrandContent.stages);
  assert(stages.every(id=>Object.hasOwn(h.window.StrandContent.stages,id)),'Every audio profile names a delivered stage or variant');
  const profiles={};
  for(const stage of stages){
    start({stage});const ctx=h.contexts[0];
    assert(ctx.active().length>=1 && ctx.active().length<=2,stage+' starts one bed and at most one hum');
    const count=ctx.starts.length;ctx.advance(2.1);engine.network.draw();
    assert(ctx.starts.length>count,stage+' has a local sound');
    assert(ctx.nodes.some(n=>n.kind==='panner'&&n.connections.size&&Math.abs(n.pan.value)>.1),stage+' local sound has a position');
    const bed=ctx.active().find(n=>n.kind==='buffer'&&n.loop);
    const filter=[...bed.connections][0];profiles[stage]=[filter.type,filter.frequency.value];
    for(let i=0;i<8;i++){ctx.advance(30);engine.network.draw();assert(ctx.active().length<=4,stage+' sources remain bounded');}
    engine.pause(true);assertSilent(ctx,stage+' pause');
    engine.setAmbienceVolume(.8);assertSilent(ctx,stage+' setting while paused');
    engine.pause(false);assert(ctx.active().length>0,stage+' resumes');
    engine.setSound(false);assertSilent(ctx,stage+' mute');
    ctx.advance(50);engine.network.draw();assertSilent(ctx,stage+' stays muted');
    engine.setSound(true);assert(ctx.active().length>0,stage+' unmute');
    engine.setAmbienceVolume(0);assertSilent(ctx,stage+' zero ambience');
    engine.setAmbienceVolume(.4);assert(ctx.active().length>0,stage+' positive ambience');
    const checkpoint=JSON.stringify(engine.network.checkpoint());
    engine.setAudioSuspended(true);assertSilent(ctx,stage+' external suspension');
    assert.equal(JSON.stringify(engine.network.checkpoint()),checkpoint,'Audio suspension leaves simulation untouched');
    engine.setAudioSuspended(false);assert(ctx.active().length>0);
    engine.stop();assertSilent(ctx,stage+' stop');
  }
  assert.notDeepEqual(profiles['mule-camp'],profiles['mule-camp-dry'],'Wet rain and dry wind use different beds');
  assert.equal(new Set(Object.values(profiles).map(JSON.stringify)).size,stages.length,'Each arena configuration has a distinct ambient bed');

  start();const ctx=h.contexts[0];
  engine.setReducedEffects(true);const quietStart=ctx.starts.length;
  ctx.advance(30);engine.network.draw();assert.equal(ctx.starts.length,quietStart,'Reduced effects keeps the bed without intermittent cues');
  engine.setReducedEffects(false);const regular=ctx.starts.length;
  ctx.advance(3);engine.network.draw();assert(ctx.starts.length>regular);
  const rollback=engine.network.checkpoint(),played=ctx.starts.length,resumes=ctx.resumes;
  engine.network.restore(rollback);
  for(let tick=0;tick<90;tick++)engine.network.advance(tick===80?[[1,'special',true]]:[],true);
  assert.equal(ctx.starts.length,played,'Silent catch-up creates no sound');
  assert.equal(ctx.resumes,resumes,'Silent catch-up does not resume an AudioContext');
  engine.network.restore(rollback);engine.network.draw();
  assert.equal(ctx.starts.length,played,'Restoring an old tick does not duplicate a scenery cue');
  const ended=engine.network.checkpoint();ended.state.phase='roundover';ended.state.phaseTicks=1;ended.state.wins=[2,0];ended.state.winner=1;
  engine.network.restore(ended);engine.network.advance([],false);assert.equal(engine.snapshot().phase,'ended');assertSilent(ctx,'Natural end without callback');
  engine.stop();

  start();
  for(let tick=0;tick<73;tick++)engine.network.advance([],false);
  assert(ctx.active().some(node=>node.kind==='oscillator'),'A previously scheduled combat tone is active');
  const silentEnd=engine.network.checkpoint();Object.assign(silentEnd.state,{phase:'roundover',phaseTicks:1,wins:[2,0],winner:1});
  engine.network.restore(silentEnd);
  const beforeEnd=ctx.starts.length;engine.network.advance([],true);
  assert.equal(ctx.starts.length,beforeEnd,'A silent ending creates no sound');
  assert.equal(engine.snapshot().phase,'ended');engine.network.draw();
  assertSilent(ctx,'Presenting a silent ending also cancels previously scheduled combat tones');engine.stop();

  start({audioSuspended:true});const beforeRebuild=ctx.starts.length;
  for(let tick=0;tick<100;tick++)engine.network.advance([],true);
  assert.equal(ctx.starts.length,beforeRebuild,'A suspended full rebuild creates no source');
  assertSilent(ctx,'Full rebuild before presentation');
  engine.setAudioSuspended(false);engine.network.draw();
  assert.equal(ctx.starts.length,beforeRebuild+1,'The corrected frame resumes one bed without replaying a cue');
  engine.stop();assertSilent(ctx,'Full rebuild cleanup');

  const control=harness();control.start({sound:false});
  start({ambienceVolume:.8});
  for(let tick=0;tick<220;tick++){
    const inputs=tick===80?[[1,'right',true],[2,'left',true]]:tick===110?[[1,'right',false],[2,'left',false]]:tick===130?[[1,'heavy',true]]:tick===131?[[1,'heavy',false]]:[];
    engine.network.advance(inputs,false);control.engine.network.advance(inputs,false);
    ctx.advance(1/60);engine.network.draw();
  }
  assert.equal(JSON.stringify(engine.network.checkpoint()),JSON.stringify(control.engine.network.checkpoint()),'Audio consumes neither simulation nor visual RNG');
  engine.stop();assertSilent(ctx,'End of deterministic comparison');

  const tape={version:1,p1:'sam',p2:'higgs',stage:'shore',mode:'local',difficulty:1,roundsToWin:2,seed:42,ticks:1,events:[]};
  engine.start({canvas:h.canvas,replay:tape,sound:true,ambienceVolume:.5});
  for(const time of [0,17,34]){const list=[...h.frames.values()];h.frames.clear();for(const fn of list)fn(time);}
  assert.equal(engine.snapshot().phase,'ended');assertSilent(ctx,'Truncated replay');engine.stop();

  const absent=harness({available:false});assert.doesNotThrow(()=>{absent.start();absent.engine.network.draw();absent.engine.pause();absent.engine.setSound(false);absent.engine.stop();});
  for(const policy of ['reject','throw']){
    const denied=harness({state:'suspended',resume:policy});
    assert.doesNotThrow(()=>denied.start());await Promise.resolve();await Promise.resolve();
    assertSilent(denied.contexts[0],policy+' resume');denied.engine.setSound(false);denied.engine.stop();
  }
  const delayed=harness({state:'suspended',resume:'defer'});delayed.start();delayed.engine.stop();delayed.contexts[0].resolveResume();
  await Promise.resolve();assertSilent(delayed.contexts[0],'A late resume does not revive the old duel');
  console.log('Ambiances · '+stages.length+' profils, localisation, volume, sources bornées, pause/reprise, arrêt, fin silencieuse, replay, effets réduits, rollback complet et autoplay vérifiés.');
}

// The real application is executed against a small event/DOM adapter. This
// exercises range input and persistence; it makes no claim about browser layout.
function uiHarness(storage=new Map()) {
  const nodes=new Map(),calls=[];
  class Element {
    constructor(id){this.id=id;this.handlers={};this.dataset={};this.hidden=false;this.open=false;this.ranges=[];this.outputs=[];this.classList={toggle(){},add(){},remove(){}};}
    set innerHTML(html){
      this.html=html;this.ranges=[];this.outputs=[];
      if(this.id==='inputEditor')this.editorParts=Object.fromEntries(['body','notice','device'].map(name=>['[data-input-'+name+']',new Element('editor-'+name)]));
      for(const tag of html.match(/<input\b[^>]*data-ambience-volume[^>]*>/g)||[]){
        const range={value:tag.match(/value="([^"]*)"/)?.[1]||'',dataset:{ambienceVolume:''},matches:selector=>selector==='[data-ambience-volume]'};this.ranges.push(range);
      }
      for(const match of html.matchAll(/<output data-ambience-value>(.*?)<\/output>/g))this.outputs.push({textContent:match[1]});
    }
    get innerHTML(){return this.html||'';}
    addEventListener(name,handler){this.handlers[name]=handler;}
    emit(name,event){this.handlers[name]?.(event);}
    querySelectorAll(){return [];}
    querySelector(selector){return this.editorParts?.[selector]||null;}
    setAttribute(name,value){this[name]=value;}
    focus(){}
    showModal(){this.open=true;}
  }
  const document={body:{classList:{toggle(){}}},getElementById:id=>{if(!nodes.has(id))nodes.set(id,new Element(id));return nodes.get(id);},
    addEventListener(){},querySelectorAll:selector=>[...nodes.values()].flatMap(node=>selector==='[data-ambience-volume]'?node.ranges:selector==='[data-ambience-value]'?node.outputs:[])};
  const engine={setAmbienceVolume:value=>calls.push(['volume',value]),setSound:value=>calls.push(['sound',value]),setReducedEffects(){},stop:()=>calls.push(['stop']),pause:value=>calls.push(['pause',value]),input(){},start:options=>calls.push(['start',options])};
  const window={StrandFight:engine,StrandTournament:{},StrandAssets:{},scrollTo(){},addEventListener(){},matchMedia:()=>({matches:false,addEventListener(){}})};
  const localStorage={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)};
  window.document=document;window.localStorage=localStorage;
  const context={window,document,localStorage,console};vm.createContext(context);vm.runInContext(source('content.js'),context);vm.runInContext(source('input.js'),context);vm.runInContext(source('app.js'),context);
  const view=document.getElementById('view');
  const action=(act,extra={})=>view.emit('click',{target:{closest:()=>({dataset:{act,...extra}})}});
  return {storage,calls,document,view,action};
}
function verifyUI(){
  const first=uiHarness();first.action('mode',{mode:'training'});
  assert.equal(first.view.ranges[0].value,'35');
  first.view.ranges[0].value='65';first.view.emit('input',{target:first.view.ranges[0]});
  assert.equal(first.storage.get('echos.v1.ambienceVolume'),'0.65');
  assert.deepEqual(first.calls.at(-1),['volume',.65]);assert.equal(first.view.outputs[0].textContent,'65 %');
  first.action('start');assert.equal(first.calls.findLast(c=>c[0]==='start')[1].ambienceVolume,.65);
  first.action('pause');assert.deepEqual(first.calls.at(-1),['pause',true]);
  first.view.ranges[0].value='20';first.view.emit('input',{target:first.view.ranges[0]});
  assert.equal(first.storage.get('echos.v1.ambienceVolume'),'0.2');
  first.document.getElementById('audio').onclick();assert.deepEqual(first.calls.at(-1),['sound',false]);
  const second=uiHarness(first.storage);second.action('mode',{mode:'training'});
  assert.equal(second.view.ranges[0].value,'20','The range restores the saved volume');
  assert(second.calls.some(c=>c[0]==='sound'&&c[1]===false),'The global mute also persists');
  second.document.getElementById('controlsLink').onclick();
  const manual=second.document.getElementById('manual'),keys=second.document.getElementById('keys');
  keys.ranges[0].value='0';manual.emit('input',{target:keys.ranges[0]});
  assert.equal(second.storage.get('echos.v1.ambienceVolume'),'0');
  assert.equal(second.view.ranges[0].value,'0','Controls and selection stay synchronized');
  console.log('Interface · curseurs sélection/pause/commandes, volume transmis au duel, mise à jour et persistance après rechargement vérifiés.');
}

async function verifyNetworkUI(){
  const nodes=new Map(),calls=[],requests=[],timers=new Map(),frames=new Map(),events={},docEvents={};let serial=0,fail=false;
  const tape={version:1,p1:'sam',p2:'higgs',stage:'shore',mode:'local',difficulty:1,roundsToWin:2,seed:42,ticks:1,events:[]};
  const storage=new Map([['echos.v1.sound','false'],['echos.v1.ambienceVolume','0.6'],['echos.v1.reducedEffects','true'],['echos.v1.staticScenery','true'],
    ['echos.private.record',JSON.stringify({version:'test',result:{winner:1,rounds:'2-0'},tape})]]);
  class Element {
    constructor(){this.value='';this.hidden=false;this.dataset={};this.handlers={};}
    set innerHTML(html){for(const match of html.matchAll(/\bid="([^"]+)"/g))get(match[1]);}
    append(){}
    add(){}
    setAttribute(name,value){this[name]=value;}
    addEventListener(name,handler){const before=this.handlers[name];this.handlers[name]=event=>{before?.(event);handler(event);};}
    closest(selector){return this.matches?.(selector)?this:null;}
  }
  const get=id=>{if(!nodes.has(id))nodes.set(id,new Element());return nodes.get(id);};
  const document={hidden:false,getElementById:get,createElement:()=>new Element(),querySelector:()=>get('header'),addEventListener:(name,handler)=>{docEvents[name]=handler;}};
  const engine={start:options=>calls.push(['start',options]),stop:()=>calls.push(['stop']),setSound:value=>calls.push(['sound',value]),
    setAmbienceVolume:value=>calls.push(['volume',value]),setAudioSuspended:value=>calls.push(['suspended',value]),setStaticScenery:value=>calls.push(['staticScenery',value]),validReplay:()=>true,
    network:{checkpoint:()=>({}),restore:()=>calls.push(['restore']),advance:(inputs,silent)=>calls.push(['advance',inputs,silent]),draw:()=>calls.push(['draw'])}};
  const store={getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)};
  const window={document,StrandFight:engine,StrandRoomVersion:'test',localStorage:store,sessionStorage:{getItem:()=>null,setItem(){}},addEventListener:(name,handler)=>{const before=events[name];events[name]=event=>{before?.(event);handler(event);};},matchMedia:()=>({matches:false})};
  const reply={live:true,tick:0,ack:0,cursor:0,total:0,events:[],result:null,
    seats:[{fighter:'sam',ready:true,connected:true},{fighter:'higgs',ready:true,connected:true}],
    match:{p1:'sam',p2:'higgs',stage:'shore',seed:42,version:'test'}};
  const context={window,document,console,Option:class{},URL,URLSearchParams,AbortController,
    crypto:{getRandomValues:array=>array.fill(5)},location:{protocol:'file:',hash:'',origin:'http://localhost',pathname:'/netplay.html'},
    performance:{now:()=>0},requestAnimationFrame:fn=>{frames.set(++serial,fn);return serial;},cancelAnimationFrame:id=>frames.delete(id),
    setTimeout:fn=>{timers.set(++serial,fn);return serial;},clearTimeout:id=>timers.delete(id),
    fetch:async(_url,options)=>{
      const request=JSON.parse(options.body);
      requests.push(request);
      if(fail)throw new Error('Connection lost');
      return {ok:true,json:async()=>request.op==='create'?{player:1,room:'abc123456789'}:request.op==='leave'?{closed:true}:structuredClone(reply)};
    }};
  vm.createContext(context);vm.runInContext(source('content.js'),context);vm.runInContext(source('input.js'),context);vm.runInContext(source('netplay.js'),context);
  const settle=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
  const sync=async()=>{const entry=[...timers].find(([,fn])=>fn.name==='sync');assert(entry,'A sync poll is scheduled');timers.delete(entry[0]);await entry[1]();await settle();};
  const frame=()=>{const [id,callback]=frames.entries().next().value;frames.delete(id);callback();};
  await get('create').onclick();await settle();
  const start=calls.find(c=>c[0]==='start')[1];
  assert.equal(start.sound,false);assert.equal(start.ambienceVolume,.6);assert.equal(start.reducedEffects,true);assert.equal(start.staticScenery,true);
  assert.equal(get('roomScenery').value,'static','Static scenery is restored independently of reduced effects');
  get('roomScenery').value='animated';get('roomScenery').onchange();
  assert.equal(storage.get('echos.v1.staticScenery'),'false');assert.equal(storage.get('echos.v1.reducedEffects'),'true');
  assert.deepEqual(calls.at(-1),['staticScenery',false]);
  get('roomAmbience').value='25';get('roomAmbience').oninput();
  assert.equal(storage.get('echos.v1.ambienceVolume'),'0.25');assert.deepEqual(calls.at(-1),['volume',.25]);
  get('roomSound').onclick();assert.equal(storage.get('echos.v1.sound'),'true');assert.deepEqual(calls.at(-1),['sound',true]);
  get('roomScenery').value='static';get('roomScenery').onchange();assert.equal(storage.get('echos.v1.staticScenery'),'true');
  reply.tick=100;await sync();frame();
  const beforeRewind=calls.length;reply.events=[[2,1,0,'left',true]];reply.total=1;
  await sync();frame();
  const corrected=calls.slice(beforeRewind),rebuilt=corrected.find(c=>c[0]==='start');
  assert(rebuilt,'A late event older than retained checkpoints recreates the engine');
  assert.equal(rebuilt[1].audioSuspended,true,'The recreated match begins with audio suspended');
  assert.equal(rebuilt[1].ambienceVolume,.25,'A full rewind preserves local audio settings');
  assert.equal(rebuilt[1].staticScenery,true,'A full rewind preserves the independent scenery preference');
  assert.equal(rebuilt[1].preserveStaticScenery,true,'A full rewind requests the held local composition');
  assert.equal(corrected.filter(c=>c[0]==='advance').length,100);
  assert(corrected.filter(c=>c[0]==='advance').every(c=>c[2]===true),'Every recreated tick is silent');
  assert.deepEqual(corrected.slice(-2),[['suspended',false],['draw']],'Audio resumes only when the corrected frame is ready');
  reply.events=[];reply.cursor=1;
  const key=(type,name,extra={})=>events[type]({key:name,repeat:false,target:get('canvas'),preventDefault(){},...extra});
  const selector=get('roomScenery');selector.matches=pattern=>pattern.split(',').includes('select');
  key('keydown','d');key('keyup','d',{target:selector});await sync();
  assert.deepEqual(requests.at(-1).inputs.filter(event=>event[2]==='right').slice(-2).map(event=>event[3]),[true,false],
    'A held movement releases after the scenery selector takes keyboard focus');
  key('keydown','d');key('keyup','d',{ctrlKey:true});await sync();
  assert.deepEqual(requests.at(-1).inputs.filter(event=>event[2]==='right').slice(-2).map(event=>event[3]),[true,false],
    'A held movement releases when a modifier is pressed before keyup');
  const pendingBefore=requests.at(-1).inputs.length;
  key('keydown','d',{target:selector});key('keyup','d',{target:selector});await sync();
  assert.equal(requests.at(-1).inputs.length,pendingBefore,'Typing in the selector never starts a combat input');
  reply.live=false;await sync();assert.deepEqual(calls.at(-1),['suspended',true]);
  reply.live=true;await sync();assert.deepEqual(calls.at(-1),['suspended',false]);
  events.blur();assert.deepEqual(calls.at(-1),['suspended',true]);events.focus();assert.deepEqual(calls.at(-1),['suspended',false]);
  document.hidden=true;docEvents.visibilitychange();assert.deepEqual(calls.at(-1),['suspended',true]);
  document.hidden=false;docEvents.visibilitychange();assert.deepEqual(calls.at(-1),['suspended',false]);
  fail=true;await sync();assert.deepEqual(calls.at(-1),['suspended',true]);
  fail=false;await sync();assert.deepEqual(calls.at(-1),['suspended',false]);
  reply.result={mismatch:true};await sync();assert.deepEqual(calls.at(-1),['suspended',true]);
  get('watch').onclick();await settle();
  const replay=calls.findLast(c=>c[0]==='start')[1];assert(replay.replay);assert.equal(replay.sound,true);assert.equal(replay.ambienceVolume,.25);assert.equal(replay.staticScenery,true);
  events.pagehide();assert.deepEqual(calls.at(-1),['stop']);
  console.log('Réseau · préférences son/volume/effets/décor statique distinctes, reconstruction sans checkpoint, libération après focus/modificateur, connexion interrompue, erreur, onglet, résultat divergent, replay et sortie vérifiés sans pause de simulation.');
}

(async()=>{if(!process.argv.includes('--network-only')){await verifyAudio();verifyUI();}await verifyNetworkUI();})().catch(error=>{console.error(error);process.exitCode=1;});
