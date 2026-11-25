/* Actual campaign/app/fight/boss modules with an event-capable DOM and Canvas
 * simulation. Combat is advanced by requestAnimationFrame and player inputs.
 * This is not a browser, layout check, native Canvas render or pixel review. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {execFileSync}=require('node:child_process'),{createHash}=require('node:crypto');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const clone=value=>JSON.parse(JSON.stringify(value));
const files=['content.js','asset-geometry-20261124.js','assets.js','boss-geometry-20261124.js','boss-assets.js','tournament.js','fight.js','boss.js','campaign.js','app.js'];
const sources=Object.fromEntries(files.map(file=>[file,fs.readFileSync(path.join(root,file),'utf8')]));
for(const file of files)new Function(sources[file]);
const report={date:new Date().toISOString(),method:'Actual app, campaign, duel and boss modules; event-capable simulated DOM and Canvas; real input sequences and requestAnimationFrame clock',
  browser:false,nativeCanvas:false,imagePixelsDecoded:false,syntheticStateFixtures:true,checks:[],victories:[],defeats:[],carousel:{sequences:0,frames:0},
  sourceSHA256:Object.fromEntries(files.map(file=>[file,createHash('sha256').update(sources[file]).digest('hex')]))};
const worldLogs=[];

const decode=text=>String(text).replace(/&(amp|lt|gt|quot|#39);/g,(_,name)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"})[name]);
function world(config={}){
  const storage=config.storage||new Map(),storageLog=[],queue=new Map(),events={},scrolls=[];let serial=0,time=0,stack=0;
  worldLogs.push({storage,operations:storageLog});
  const numeric=(values,method)=>assert(values.filter(v=>typeof v==='number').every(Number.isFinite),'Finite Canvas '+method);
  const ctx=new Proxy({save(){stack++;},restore(){assert(stack>0,'Balanced Canvas restore');stack--;},
    createLinearGradient:(...v)=>{numeric(v,'gradient');return{addColorStop(){}};},createRadialGradient:(...v)=>{numeric(v,'gradient');return{addColorStop(){}};},
    measureText:value=>({width:String(value).length*8})},{get:(object,key)=>key in object?object[key]:(...v)=>numeric(v,key)});
  let document;
  class Node{
    constructor(tag='div',attrs={},parent=null){this.tagName=tag.toUpperCase();this.attrs=attrs;this.parentNode=parent;this.children=[];this.events={};this._text='';this._html='';this.dataset={};this.style={};
      this.value=attrs.value||'';this.hidden=Object.hasOwn(attrs,'hidden');this.disabled=Object.hasOwn(attrs,'disabled');this.open=false;
      const classes=new Set((attrs.class||'').split(/\s+/).filter(Boolean));this.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x),toggle:(x,on)=>{const add=on===undefined?!classes.has(x):on;add?classes.add(x):classes.delete(x);return add;}};
      for(const [key,value]of Object.entries(attrs))if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
    }
    get id(){return this.attrs.id||'';}get src(){return this.attrs.src;}get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}
    set textContent(value){this._text=String(value);this.children=[];}
    get innerHTML(){return this._html;}set innerHTML(markup){this._html=String(markup);this._text='';this.children=[];const parents=[this];
      for(const token of this._html.matchAll(/<[^>]+>|[^<]+/g)){const text=token[0];if(text.startsWith('</')){if(parents.length>1)parents.pop();continue;}
        if(text.startsWith('<')){const match=text.match(/^<([\w-]+)([\s\S]*?)\/?\s*>$/);if(!match)continue;const attrs={};
          for(const a of match[2].matchAll(/([^\s=\/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g))attrs[a[1]]=decode(a[2]??a[3]??a[4]??'');
          const node=new Node(match[1],attrs,parents.at(-1));parents.at(-1).children.push(node);
          if(!['IMG','INPUT','BR','HR','META','LINK','SOURCE','WBR'].includes(node.tagName)&&!text.endsWith('/>'))parents.push(node);
        }else{const node=new Node('#text',{},parents.at(-1));node._text=decode(text);parents.at(-1).children.push(node);}
      }
      for(const select of this.querySelectorAll('select')){const choice=select.children.find(n=>Object.hasOwn(n.attrs,'selected'))||select.children.find(n=>n.tagName==='OPTION');if(choice)select.value=choice.attrs.value;}
    }
    matches(selector){return selector.split(',').some(raw=>{let s=raw.trim();if(!s)return false;
      if(s.includes(':enabled')){if(this.disabled)return false;s=s.replace(':enabled','');}if(s.includes(':disabled')){if(!this.disabled)return false;s=s.replace(':disabled','');}
      const tag=s.match(/^[\w-]+/);if(tag&&this.tagName!==tag[0].toUpperCase())return false;
      for(const m of s.matchAll(/\.([\w-]+)/g))if(!this.classList.contains(m[1]))return false;
      const id=s.match(/#([\w-]+)/);if(id&&this.id!==id[1])return false;
      for(const m of s.matchAll(/\[([^\]=]+)(?:=["']?([^\]"']*)["']?)?\]/g)){if(!Object.hasOwn(this.attrs,m[1]))return false;if(m[2]!==undefined&&this.attrs[m[1]]!==m[2])return false;}
      return this.tagName!=='#TEXT';});}
    querySelectorAll(selector){return this.children.flatMap(node=>[...(node.matches(selector)?[node]:[]),...node.querySelectorAll(selector)]);}
    querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
    closest(selector){return this.matches(selector)?this:this.parentNode?.closest(selector)||null;}
    focus(){document.activeElement=this;}setAttribute(name,value){this.attrs[name]=String(value);}getAttribute(name){return this.attrs[name]??null;}
    addEventListener(type,fn){(this.events[type]||=[]).push(fn);}setPointerCapture(){}getContext(){return ctx;}
    showModal(){this.open=true;}close(){this.open=false;emit(this,'close');}
  }
  const body=new Node('body'),permanent={};
  for(const id of ['view','manual','keys','effects','scenery','audio','homeLink','controlsLink']){permanent[id]=new Node(id==='view'?'main':id==='manual'?'dialog':'button',{id},body);body.children.push(permanent[id]);}
  document={body,hidden:false,activeElement:null,events:{},getElementById:id=>body.querySelector('#'+id),querySelectorAll:selector=>body.querySelectorAll(selector),addEventListener(type,fn){(this.events[type]||=[]).push(fn);}};
  function emit(target,type,data={}){const event={target,preventDefault(){this.defaultPrevented=true;},...data};for(const fn of target.events?.[type]||[])fn(event);return event;}
  const host={document,localStorage:{getItem(key){storageLog.push(['get',key]);if(config.unreadable)throw Error('Storage read denied');return storage.get(key)??null;},
    setItem(key,value){storageLog.push(['set',key]);if(config.quota)throw Error('Storage quota');storage.set(key,String(value));}},
    requestAnimationFrame(fn){queue.set(++serial,fn);return serial;},cancelAnimationFrame(id){queue.delete(id);},events,
    addEventListener(type,fn){(events[type]||=[]).push(fn);},scrollTo(...args){scrolls.push(args);},matchMedia(){return{matches:false,addEventListener(){}};}};
  class Image{set src(value){this._src=value;this.complete=false;this.naturalWidth=0;this.naturalHeight=0;}get src(){return this._src;}}
  const endings=[],starts=[];
  for(const file of files){
    if(file==='app.js')for(const key of ['StrandFight','StrandBoss']){const E=host[key],start=E.start;E.start=options=>{starts.push({engine:key,...Object.fromEntries(Object.entries(options).filter(([k,v])=>typeof v!=='function'&&k!=='canvas'))});
      return start({...options,onEnd:result=>{endings.push({engine:key,result:clone(result)});options.onEnd?.(result);}});};}
    new Function('window','document','Image','localStorage',sources[file])(host,document,Image,host.localStorage);
  }
  function frames(count){for(let i=0;i<count;i++){time+=1000/60+.000001;const jobs=[...queue.values()];queue.clear();for(const fn of jobs)fn(time);assert.equal(stack,0,'Canvas stack returns to zero');}}
  const view=permanent.view;
  function find(action,data={}){return view.querySelectorAll('[data-act]').find(n=>n.dataset.act===action&&Object.entries(data).every(([k,v])=>n.dataset[k]===v));}
  function click(action,data={}){const target=find(action,data);assert(target,'Visible action '+action+' '+JSON.stringify(data));assert(!target.disabled,'Action enabled '+action);emit(view,'click',{target});}
  function change(key,value){const target=view.querySelector('[data-option="'+key+'"]');assert(target,'Visible option '+key);assert(target.children.some(n=>n.attrs.value===value),'Declared option value '+value);target.value=value;emit(view,'change',{target});}
  function key(name,down=true,extra={}){return emit(host,down?'keydown':'keyup',{key:name,code:name.length===1?'Key'+name.toUpperCase():name,target:view,repeat:false,...extra});}
  return{host,document,view,storage,storageLog,starts,endings,frames,emit,key,click,change,find,permanent,Node,scrolls,
    state:()=>JSON.parse(storage.get('echos.campaign.v1')||'null'),engine:()=>host.StrandBoss.snapshot()?host.StrandBoss:host.StrandFight};
}

// State-unit fixtures are explicitly synthetic. They do not count as gameplay victories.
const isolated=world(),C=isolated.host.StrandCampaign,content=isolated.host.StrandContent;
assert.equal(C.chapters.length,6);assert.equal(C.scenes.length,14);assert.equal(new Set(C.scenes.map(s=>s.id)).size,14);
for(const c of C.chapters){assert(content.fighters[c.p1]);assert(content.stages[c.stage]);assert.equal(c.work,'ds1-dc');assert(c.kind==='duel'?content.fighters[c.p2]:isolated.host.StrandBoss.encounters[c.boss]);}
const unitStorage=new Map(),unitLog=[],adapter={getItem:key=>{unitLog.push(['get',key]);return unitStorage.get(key)||null;},setItem:(key,value)=>{unitLog.push(['set',key]);unitStorage.set(key,value);}};
const S=C.createStore(adapter);S.start('easy');assert(C.valid(S.progress()));assert.equal(S.currentScene().id,'prologue');S.advance();
function fixture(entry,won=true){const c=entry.chapter;return c.kind==='duel'?{fighters:[c.p1,c.p2],stage:c.stage,winner:won?1:2,rounds:won?[2,0]:[0,2],reason:'ko',vitality:won?70:0}:
  {p1:c.p1,bossId:c.boss,stage:c.stage,difficulty:entry.difficulty,won,score:1800,vitality:won?65:0,reason:won?'boss':'health'};}
let entry=S.beginEncounter(),oldTicket=entry.ticket;
assert.equal(S.record(oldTicket,{...fixture(entry),stage:'shore'}),null,'Wrong encounter rejected');
S.suspend();assert.equal(S.record(oldTicket,fixture(entry)),null,'Suspended callback rejected');assert.equal(S.progress().run.phase,'briefing');
entry=S.beginEncounter();assert.notEqual(entry.ticket,oldTicket);assert(S.record(entry.ticket,fixture(entry,false)));assert.equal(S.progress().run.phase,'defeat');S.resume();
for(let i=0;i<6;i++){entry=S.beginEncounter();assert(entry);assert(S.record(entry.ticket,fixture(entry)));assert.equal(S.record(entry.ticket,fixture(entry)),null,'Duplicate result rejected');assert(C.valid(S.progress()));S.advance();}
assert.equal(S.progress().run.phase,'ending');assert.equal(S.progress().unlocked.length,14);S.advance();assert.equal(S.advance(),false);assert.equal(S.progress().completed.easy,1);
const finished=S.progress();
for(const mutate of [d=>d.version=99,d=>d.rules='future',d=>d.run.chapter=99,d=>d.run.difficulty='__proto__',d=>d.run.results.reverse(),d=>d.run.lastResult.vitality=-1,d=>d.run.lastResult.chapter='unknown',d=>d.unlocked.push('unknown')]){
  const bad=clone(finished);mutate(bad);assert(!C.valid(bad),'Malformed save rejected');const recovered=C.createStore({getItem:()=>JSON.stringify(bad),setItem(){}});assert.equal(recovered.progress().run,null);assert(recovered.progress().recovery);
}
S.start('hard');assert.equal(S.progress().run.difficulty,'hard');assert.equal(S.progress().unlocked.length,14);assert.equal(S.progress().run.results.length,0);assert.equal(S.progress().completed.easy,1);
assert(unitLog.every(([,key])=>key===C.storeKey),'State module uses its own save key exclusively');
const quota=C.createStore({getItem(){return null;},setItem(){throw Error('Quota');}});quota.start('normal');quota.advance();assert(!quota.progress().saved);assert.equal(quota.progress().run.phase,'briefing');
const unreadable=C.createStore({getItem(){throw Error('Denied');},setItem(){throw Error('Denied');}});assert(!unreadable.progress().saved);assert(unreadable.progress().recovery);
report.checks.push('State-unit fixtures: fixed roster and DS1/DC versions, six ordered chapters, fourteen scenes, save schema, stale/duplicate/wrong result rejection, isolated key, restart retention and unavailable storage');

function pilotDuel(E){const s=E.snapshot();if(!s||s.phase!=='fight')return;const [p,o]=s.fighters,d=o.x-p.x,gap=Math.abs(d),axis=gap>52?Math.sign(d):0;
  for(const [k,v]of Object.entries({left:axis<0,right:axis>0,guard:false,down:false,up:false}))E.input(1,k,v);
  for(const k of ['light','heavy','throw','special'])E.input(1,k,false);
  if(gap<62&&o.guard)E.input(1,'throw',true);else if(gap<85)E.input(1,'light',true);
}
function pilotBoss(E){const s=E.snapshot();if(!s||s.phase==='ended'||s.phase==='intro')return;const p=s.p,b=s.boss,d=E.encounters[s.bossId];
  let axis=0,guard=false,down=false,jump=false,attack=false,special=false,interact=false;
  if(b.hp<=0){if(s.waveDelay>0)axis=p.x<300?0:-1;else if(s.cargo.carrying!==null){axis=p.x>120?-1:0;interact=axis===0;}
    else{const box=s.cargo.boxes.find(q=>q.state==='ground');if(box){axis=Math.abs(p.x-box.x)>38?Math.sign(box.x-p.x):0;interact=axis===0;}}}
  else{const side=p.x<b.x?-1:1,target=Math.max(55,Math.min(1225,b.x+side*(d.radius*.55+62)));axis=Math.abs(p.x-target)>15?Math.sign(target-p.x):0;const a=b.attack;
    if(b.phase==='tell'&&a){if(['spikes','stomp','pounce','breach'].includes(a.type)){
      const unsafe=x=>a.markers.some(m=>Math.abs(x-m.x)<m.w/2+55),safe=Array.from({length:23},(_,i)=>65+i*50).filter(x=>!unsafe(x)).sort((x,y)=>Math.abs(x-p.x)-Math.abs(y-p.x))[0];
      if(safe!==undefined)axis=Math.abs(safe-p.x)>12?Math.sign(safe-p.x):0;
    }else if(a.type==='charge'){axis=p.x<180?1:p.x>1100?-1:side;jump=b.timer<19&&p.y===0;}
    else if(['orbs','bolts'].includes(a.type)){axis=0;guard=true;down=true;}else if(a.type==='ring')axis=0;
    }else if(b.phase==='attack'&&a){if(a.type==='charge'){axis=p.x<100?1:p.x>1180?-1:side;jump=Math.abs(p.x-b.x)<260&&p.y===0;}
      else if(['orbs','bolts'].includes(a.type)){axis=0;guard=true;down=true;}else if(['stomp','spikes','pounce','breach'].includes(a.type))axis=0;
    }else if(b.phase!=='dive'){attack=Math.abs(b.x-p.x)<d.radius+125;special=p.energy>45&&axis===0&&b.phase==='recover';}
    const ring=s.hazards.find(h=>h.kind==='ring'&&h.delay<=0&&Math.abs(h.x-p.x)<170&&(p.x-h.x)*h.vx>=0);
    if(ring&&p.y===0){jump=true;guard=false;down=false;}if(!guard&&!b.attack&&Math.abs(b.x-p.x)<d.radius+125)attack=true;
  }
  for(const [k,v]of Object.entries({left:axis<0,right:axis>0,up:jump,guard,down}))E.input(1,k,v);
  for(const k of ['heavy','special','throw'])E.input(1,k,false);
  if(interact)E.input(1,'throw',true);else if(special)E.input(1,'special',true);else if(attack)E.input(1,'heavy',true);
}
const sentinels=new Map([['echos.v1.sound','false'],['echos.v1.chapters','{"sam":2,"mama":1}'],['echos.v1.scenes','{"sam-intro":true}'],
  ['echos.v1.cup','{"version":1,"kept":true,"rounds":[],"entrants":[]}'],['echos.boss.v1','{"externalBoss":"keep-exact-bytes"}'],
  ['echos.boss-rush.v1','{"externalRush":"keep-exact-bytes"}'],['ds-silent-line-v3','main-campaign-byte-sentinel']]);
const gameStorage=new Map(sentinels);let w=world({storage:gameStorage});
assert.equal(w.view.querySelectorAll('[data-act="mode"]').length,9,'Nine mode entries');
w.click('mode',{mode:'campaign'});assert(w.view.textContent.includes('Les Nœuds rompus'));assert(w.view.textContent.includes('début de ce chapitre'));
w.change('campaignDifficulty','easy');w.click('campaignNew');assert.equal(w.state().run.phase,'prologue');w.click('campaignAdvance');
assert.equal(w.state().run.phase,'briefing');w.click('campaignFight');let E=w.engine();assert.equal(w.starts.at(-1).mode,'cpu');assert.equal(w.starts.at(-1).roundsToWin,2);
w.frames(90);const beforeKey=E.snapshot().fighters[0].x;w.key('d');w.frames(8);w.key('d',false);assert(E.snapshot().fighters[0].x>beforeKey,'Keyboard drives actual fighter');
w.key('Escape');assert(E.snapshot().paused);assert.equal(w.document.activeElement.closest('#pauseBox'),w.document.getElementById('pauseBox'),'Campaign pause focuses its visible resume action');
let tick=E.snapshot().tick;w.frames(15);assert.equal(E.snapshot().tick,tick,'Pause freezes simulation');w.key('Escape');assert(!E.snapshot().paused);assert.equal(w.document.activeElement.id,'pauseBtn','Resuming restores focus to the fight pause control');
w.click('controls');assert(w.permanent.manual.open&&E.snapshot().paused);w.permanent.manual.close();assert(!E.snapshot().paused,'Closing controls resumes only an active match');
const touch=w.view.querySelector('[data-input="right"]');w.emit(w.view,'pointerdown',{target:touch,pointerId:4});assert(touch.classList.contains('held'));w.frames(3);w.emit(w.view,'pointercancel',{target:touch,pointerId:4});assert(!touch.classList.contains('held'));
w.emit(w.host,'blur');assert(E.snapshot().paused);w.click('pause');assert(!E.snapshot().paused);
w.permanent.scenery.onclick();assert(E.snapshot().staticScenery);assert(!E.snapshot().reducedEffects);assert.equal(gameStorage.get('echos.v1.staticScenery'),'true');
const firstAttempt=w.state().run.attempts[0];w.click('pause');w.click('leave');assert.equal(w.state().run.phase,'briefing');assert.equal(w.state().run.results.length,0);assert.equal(E.snapshot(),null);
w=world({storage:gameStorage});w.click('mode',{mode:'campaign'});w.change('campaignDifficulty','hard');w.click('campaignResume');w.click('campaignFight');E=w.engine();
assert.equal(w.starts.at(-1).difficulty,'easy','Resume preserves the running difficulty');assert.equal(w.state().run.attempts[0],firstAttempt+1);assert.equal(E.snapshot().tick,0);assert.equal(E.snapshot().fighters[0].hp,100);assert(E.snapshot().staticScenery);

function runCurrent(target,won=true){const ch=C.chapters[target.state().run.chapter],engine=target.engine(),count=target.endings.length;let frames=0,carried=false,secondWave=false;
  while(target.endings.length===count&&frames<60000){if(won)(ch.kind==='duel'?pilotDuel:pilotBoss)(engine);target.frames(5);frames+=5;const s=engine.snapshot();
    if(ch.kind==='boss'&&s){carried ||= s.cargo.carrying!==null;secondWave ||= s.wave===2;}}
  assert(target.endings.length>count,'Encounter completes by real inputs/time: '+ch.id);const result=target.endings.at(-1).result;
  assert.equal(ch.kind==='duel'?result.winner===1:result.won,won,'Expected outcome: '+ch.id+' '+JSON.stringify(result));
  assert.equal(target.state().run.phase,won?'aftermath':'defeat');assert(C.valid(target.state()),'Reachable saved state validates');
  const row={chapter:ch.id,kind:ch.kind,frames,carried,secondWave,result};(won?report.victories:report.defeats).push(row);
  assert(target.find(won?'campaignInterlude':'campaignResume'),'Result has its narrative/retry action');
  return row;
}
for(let index=0;index<6;index++){
  assert.equal(w.state().run.chapter,index);
  if(index===1||index===4){runCurrent(w,false);const victories=w.state().run.results.length;w.click('campaignResume');assert.equal(w.state().run.phase,'briefing');assert.equal(w.state().run.results.length,victories);w.click('campaignFight');}
  if(index===4){E=w.engine();assert(w.starts.at(-1).isolated);assert.equal(E.snapshot().saved,null);assert(E.snapshot().staticScenery);
    w.frames(125);w.emit(w.host,'pagehide');assert.equal(w.state().run.phase,'briefing');assert.equal(E.snapshot(),null);
    w=world({storage:gameStorage});w.click('mode',{mode:'campaign'});w.click('campaignResume');w.click('campaignFight');E=w.engine();assert.equal(E.snapshot().tick,0);assert.equal(w.state().run.results.length,4);}
  const row=runCurrent(w);assert.equal(w.state().run.results.length,index+1);
  if(index===4){assert(row.carried&&row.secondWave,'Convoy victory really carries and delivers two waves');assert.equal(row.result.cargo,2);assert.equal(row.result.cargoGoal,2);assert.equal(row.result.saved,null);}
  if(index===0){w=world({storage:gameStorage});w.click('mode',{mode:'campaign'});w.click('campaignResume');assert.equal(w.state().run.phase,'aftermath');assert.equal(w.starts.length,0,'Reload after victory reopens the interlude without a new fight');}
  else w.click('campaignInterlude');
  assert(w.view.textContent.includes(C.chapters[index].after.title));w.click('campaignAdvance');
  if(index<5){assert.equal(w.state().run.phase,'briefing');w.click('campaignFight');}
}
assert.equal(w.state().run.phase,'ending');assert.equal(w.state().unlocked.length,14);assert(w.view.textContent.includes(C.ending.title));w.click('campaignAdvance');assert.equal(w.state().run.phase,'complete');assert.equal(w.state().completed.easy,1);
w.click('campaignConclusion');assert(w.view.textContent.includes(C.ending.title));w.click('campaignSelection');assert.equal(w.state().completed.easy,1,'Conclusion replay cannot award completion twice');
const completeBytes=gameStorage.get(C.storeKey);w.click('campaignGallery');assert.equal(w.view.querySelectorAll('[data-act="campaignReplay"]').length,14);
for(const scene of C.scenes){w.click('campaignReplay',{scene:scene.id});assert(w.view.textContent.includes(scene.title));assert(!w.find('campaignFight'));w.click('campaignGallery');}
assert.equal(gameStorage.get(C.storeKey),completeBytes,'Gallery never mutates campaign progress');
w.click('campaignSelection');w.change('campaignDifficulty','hard');w.click('campaignNew');assert.equal(w.state().run.difficulty,'hard');assert.equal(w.state().run.phase,'prologue');assert.equal(w.state().unlocked.length,14);assert.equal(w.state().completed.easy,1);
w.click('campaignSelection');const replacementBytes=gameStorage.get(C.storeKey);w.click('campaignNew');assert(w.find('campaignStart'));assert.equal(gameStorage.get(C.storeKey),replacementBytes,'Replacing an unfinished campaign requires the explicit new-run action');w.click('campaignResume');
for(const [key,value]of sentinels)assert.equal(gameStorage.get(key),value,'Independent save byte preservation '+key);
const campaignOperations=worldLogs.filter(row=>row.storage===gameStorage).flatMap(row=>row.operations);
assert(!campaignOperations.some(([op,key])=>op==='set'&&[...sentinels.keys()].includes(key)),'Campaign UI writes no foreign save across all reloads');
assert(!campaignOperations.some(([,key])=>['echos.boss.v1','echos.boss-rush.v1'].includes(key)),'Campaign neither reads nor writes Boss Battle or Rush saves');
report.checks.push('Actual six-chapter UI traversal: four CPU duels and both isolated bosses, real victory/defeat/retry, two convoy deliveries, interludes, conclusion and retained gallery');
report.checks.push('Real keyboard and pointer controls, pause/controls/blur, chapter-start resume after return and pagehide/reload, fixed running difficulty, aftermath reload, exact independent save preservation');
report.checks.push('Static scenery preference reaches both real engines, survives reload and stays independent of reduced effects');

// Original route prose and route order are compared with the published baseline.
const oldHost={};new Function('window',execFileSync('git',['show','c3fa7ea:modes/echos-de-la-greve/content.js'],{cwd:repo,encoding:'utf8'}))(oldHost);
for(const id of Object.keys(content.fighters)){assert.deepEqual(clone(content.fighters[id].route),clone(oldHost.StrandContent.fighters[id].route));assert.deepEqual(clone(content.fighters[id].scenes),clone(oldHost.StrandContent.fighters[id].scenes));}
const archive=Object.fromEntries(Object.keys(content.fighters).flatMap(id=>['intro','rival','ending'].map(part=>[id+'-'+part,true])));
const galleryStorage=new Map([['echos.v1.sound','false'],['echos.v1.scenes',JSON.stringify(archive)],['echos.v1.chapters','{"sam":1}']]),g=world({storage:galleryStorage});
const galleryBefore=new Map(galleryStorage);g.click('gallery');
for(const id of Object.keys(content.fighters))for(const part of ['intro','rival','ending']){
  const frames=g.host.StrandAssets.storyFrames[id][part];assert.equal(frames.length,{intro:3,rival:1,ending:2}[part]);g.click('replay',{id,part});
  const liveStatus=g.document.getElementById('sceneFrameStatus'),scrollCount=g.scrolls.length;
  for(let index=0;index<frames.length;index++){
    const picture=g.document.getElementById('scenePicture');assert.equal(picture.src,frames[index].src);assert(picture.getAttribute('alt'));
    assert(g.view.textContent.includes(content.fighters[id].scenes[part][0]));assert(g.view.textContent.includes(content.fighters[id].scenes[part][1]));
    assert(g.view.textContent.includes('Illustration '+(index+1)+' / '+frames.length));assert(g.view.textContent.includes(frames[index].caption));assert(g.find('gallery'));
    if(frames.length>1){assert.equal(g.find('previousSceneFrame').disabled,index===0);assert.equal(g.find('nextSceneFrame').disabled,index===frames.length-1);}
    report.carousel.frames++;if(index<frames.length-1){g.click('nextSceneFrame');assert(g.document.activeElement.matches('[data-act]')&&!g.document.activeElement.disabled,'Navigation restores focus to an enabled button');
      assert.equal(g.document.getElementById('sceneFrameStatus'),liveStatus,'Live status is updated in place');assert.equal(g.scrolls.length,scrollCount,'Frame changes preserve scrolling');}
  }
  const atEnd=g.document.getElementById('scenePicture').src;g.key('ArrowRight');assert.equal(g.document.getElementById('scenePicture').src,atEnd,'Right edge is clamped');
  if(frames.length>1){g.key('ArrowLeft');assert.equal(g.document.getElementById('scenePicture').src,frames.at(-2).src);
    const before=g.document.getElementById('scenePicture').src;g.key('ArrowLeft',true,{target:new g.Node('input')});assert.equal(g.document.getElementById('scenePicture').src,before,'Editable controls keep arrow keys');
    g.permanent.controlsLink.onclick();g.key('ArrowLeft');assert.equal(g.document.getElementById('scenePicture').src,before,'Dialog keeps arrow keys');g.permanent.manual.close();
    for(let i=0;i<frames.length;i++)g.key('ArrowLeft');assert.equal(g.document.getElementById('scenePicture').src,frames[0].src);assert(!g.document.activeElement.disabled);
  }
  report.carousel.sequences++;g.click('gallery');
}
for(const [key,value]of galleryBefore)assert.equal(galleryStorage.get(key),value,'Story gallery leaves route and unlock bytes unchanged');
assert.equal(report.carousel.sequences,24);assert.equal(report.carousel.frames,48);
const live=world({storage:new Map([['echos.v1.sound','false']])});live.click('mode',{mode:'story'});live.click('start');
for(let i=0;i<3;i++){assert(live.find('routeFight'),'Live scene main action available on every frame');if(i<2)live.click('nextSceneFrame');}
live.click('routeFight');assert(live.host.StrandFight.snapshot(),'Original route still enters the real duel');live.emit(live.host,'pagehide');
report.checks.push('Eight route definitions and original texts identical to c3fa7ea; 24 accessible manual sequences / 48 frames, ordered mappings, captions, clamp, enabled focus, stable live region/scrolling, arrow/modal/editable behavior and no gallery side effects');
report.checks.push('Original story route launches its real duel after the third intro illustration; primary narrative actions remain available on all three frames');

const imagePaths=new Set(C.scenes.map(s=>g.host.StrandAssets.stages[s.stage]));
for(const character of Object.values(g.host.StrandAssets.storyFrames))for(const sequence of Object.values(character))for(const frame of sequence)imagePaths.add(frame.src);
report.imageFiles={expected:imagePaths.size,missing:[...imagePaths].filter(file=>!fs.existsSync(path.join(root,file)))};
report.save={key:C.storeKey,rules:C.rules,sceneCount:C.scenes.length,chapterCount:C.chapters.length,foreignKeysPreserved:[...sentinels.keys()]};
report.logicPassed=true;report.assetsComplete=report.imageFiles.missing.length===0;report.assetsRequired=process.argv.includes('--require-assets');
report.passed=report.logicPassed&&(!report.assetsRequired||report.assetsComplete);
const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify(report,null,2));
if(report.assetsRequired)assert(report.assetsComplete,'All declared narrative illustrations must exist before publication');
