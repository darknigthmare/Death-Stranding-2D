/* Boss Battle: independent, deterministic 60 Hz simulation. No campaign/duel state is shared. */
(function(host){
  'use strict';
  const W=1280,H=720,FLOOR=588,STEP=1000/60,RULES='boss-20261124-v1',STORE='echos.boss.v1';
  const RUSH_RULES='boss-rush-20261125-v1',RUSH_STORE='echos.boss-rush.v1';
  const RUSH_ORDER=Object.freeze(['lion','squid','whale','giant','truck','convoy']);
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n)),clone=value=>JSON.parse(JSON.stringify(value));
  const own=(object,key)=>typeof key==='string'&&Object.hasOwn(object,key);
  const content=host.StrandContent,art=host.StrandAssets||{},bossArt=host.StrandBossAssets||{};
  const encounters={
    lion:{name:'Catcher léonin',type:'lion',stage:'tar-basin',hp:280,height:270,radius:162,bodyHeight:230,seconds:150,
      goal:'Abattez le Catcher. Sautez au-dessus de sa charge et frappez pendant sa récupération.',
      patterns:['charge','ring','pounce'],tell:65,recover:90},
    squid:{name:'Catcher aquatique',type:'squid',stage:'shore',hp:300,height:345,radius:150,bodyHeight:300,seconds:160,
      goal:'Évitez les tentacules annoncés au sol. Gardez face aux orbes et sautez l’anneau au sol.',
      patterns:['spikes','orbs','ring'],tell:72,recover:85},
    whale:{name:'Baleine de goudron',type:'whale',stage:'tar-basin',hp:340,height:315,radius:220,bodyHeight:260,seconds:180,
      goal:'Repérez sa réapparition. Quittez les jets annoncés, puis attaquez son noyau exposé.',
      patterns:['orbs','spikes','breach'],tell:82,recover:105},
    giant:{name:'Géant de goudron',type:'giant',stage:'shore',hp:400,height:420,radius:126,bodyHeight:380,bodyHeights:{attack:266},seconds:200,
      goal:'Sortez des zones de frappe. Sautez l’anneau chiral et exploitez les longues récupérations.',
      patterns:['stomp','ring','orbs'],tell:88,recover:115},
    truck:{name:'Camion MULE',type:'mule-truck',stage:'mule-camp-dry',hp:240,height:190,radius:205,bodyHeight:170,seconds:180,cargo:2,
      goal:'Immobilisez le camion, puis rapportez ses deux colis au dépôt à gauche. La commande Colis prend, pose ou livre un colis.',
      patterns:['bolts','charge','bolts'],tell:76,recover:85},
    convoy:{name:'Convoi MULE',type:'mule-truck',stage:'mule-camp',hp:190,height:190,radius:205,bodyHeight:170,seconds:240,cargo:2,waves:2,
      goal:'Interceptez deux camions en deux vagues. Rapportez un colis par camion et protégez le dépôt des tirs bas.',
      patterns:['bolts','charge','bolts'],tell:72,recover:80}
  };
  const players={sam:{h:176,speed:4.4,power:1},fragile:{h:166,speed:4.95,power:.94},higgs:{h:184,speed:4.05,power:1.06},
    cliff:{h:179,speed:4.2,power:1.03},mule:{h:177,speed:4.25,power:1},diehardman:{h:181,speed:4.1,power:1.02},
    mama:{h:170,speed:4.4,power:.96},heartman:{h:176,speed:4.15,power:.96}};
  const legacyGeometry={
    sam:{stanceAnchor:.50,actionAnchor:.40,actionScale:.87,motionFrames:4,stepScale:1.12,hitScale:1.12},
    fragile:{stanceAnchor:.53,actionAnchor:.43,actionScale:.80,hitAnchor:.49,stepAnchor:.51,hitScale:.96,stepScale:.98},
    higgs:{stanceAnchor:.69,actionAnchor:.57,hitAnchor:.63,stepAnchor:.58,hitScale:.96,stepScale:.98},
    cliff:{stanceAnchor:.50,actionAnchor:.35,actionScale:.78,motionFrames:4,stepScale:1.12,hitScale:1.12},
    heartman:{stanceAnchor:.50,actionAnchor:.29,actionScale:.99,hitAnchor:.53,stepAnchor:.50,hitScale:.92,stepScale:.97},
    mama:{stanceAnchor:.425,actionAnchor:.395,actionScale:.928,hitAnchor:.487,stepAnchor:.471,hitScale:.965,stepScale:1.015},
    diehardman:{stanceAnchor:.405,actionAnchor:.346,actionScale:.97,hitAnchor:.445,stepAnchor:.647,hitScale:.95,stepScale:.98},
    mule:{stanceAnchor:.59,actionAnchor:.39,actionScale:.86,hitAnchor:.45,stepAnchor:.52,hitScale:.92,stepScale:.97}
  };
  const directions={sam:['bola','brace','parry'],fragile:['blink','fan','beacon'],higgs:['tar','mine','feint'],
    cliff:['salvo','post','recall'],mule:['scan','crate','retrieve'],diehardman:['order','gate','relief'],
    mama:['anchor','deck','winch'],heartman:['pulse','memory','syncope']};
  const costs={bola:28,brace:14,parry:18,blink:28,fan:18,beacon:16,tar:28,mine:21,feint:14,salvo:28,post:18,recall:16,
    scan:28,crate:18,retrieve:16,order:28,gate:18,relief:16,anchor:28,deck:18,winch:16,pulse:28,memory:18,syncope:16};
  const actionNames=new Set(['left','right','up','down','light','heavy','special','guard','throw','finish']);
  const validKinds=new Set(['light','heavy','lift','sweep','grab','finish',...Object.keys(costs)]);
  let current=null,raf=0,audio=null,soundOn=true,ambience=.35,reduced=false,sessionProgress=null,sessionRush=null;

  function storage(){try{return host.localStorage;}catch{return null;}}
  function validOutfit(p1,outfit){return outfit==='atelier'||own(art.wardrobe?.[p1]||{},outfit);}
  function emptyProgress(){return {version:1,rules:RULES,records:{},recent:[],checkpoint:null};}
  function finiteTree(value,depth=0){
    if(depth>14)return false;
    if(typeof value==='number')return Number.isFinite(value)&&Math.abs(value)<1e8;
    if(value===null||['string','boolean'].includes(typeof value))return true;
    if(Array.isArray(value))return value.length<=128&&value.every(v=>finiteTree(v,depth+1));
    return value&&typeof value==='object'&&Object.keys(value).length<=80&&Object.values(value).every(v=>finiteTree(v,depth+1));
  }
  function validCheckpoint(cp){
    if(!cp||cp.version!==1||cp.rules!==RULES||!finiteTree(cp))return false;
    const s=cp.state,p=s?.p,b=s?.boss,d=own(encounters,s?.bossId)?encounters[s.bossId]:null;
    if(!d||!own(players,s?.p1)||!own(content.stages,s?.stage))return false;
    const scalar=(v,min,max)=>Number.isFinite(v)&&v>=min&&v<=max;
    const attack=b?.attack,attackOK=!attack || (typeof attack==='object'&&d?.patterns.includes(attack.type)&&
      Array.isArray(attack.markers)&&attack.markers.length<=5&&attack.markers.every(q=>q&&scalar(q.x,0,W)&&scalar(q.w,1,W)&&scalar(q.h,1,H))&&
      scalar(attack.warning,45,150)&&scalar(attack.age,0,200)&&scalar(attack.active,1,150)&&typeof attack.name==='string'&&typeof attack.advice==='string'&&
      scalar(attack.from,0,W)&&scalar(attack.to,0,W)&&scalar(attack.target,0,W)&&typeof attack.hit==='boolean'&&typeof attack.depot==='boolean');
    const marker=p?.marker,markerOK=!marker || (typeof marker==='object'&&['beacon','post','crate','anchor','memory'].includes(marker.kind)&&scalar(marker.x,0,W)&&scalar(marker.ttl,1,400));
    const act=p?.act,requiredMarker={recall:'post',winch:'anchor',retrieve:'crate'}[act?.kind],actionOK=!act || (typeof act==='object'&&validKinds.has(act.kind)&&
      (directions[s?.p1]?.includes(act.kind)||['light','heavy','lift','sweep','grab','finish'].includes(act.kind))&&
      Number.isInteger(act.frame)&&scalar(act.frame,0,99)&&Number.isInteger(act.delay)&&scalar(act.delay,1,60)&&Number.isInteger(act.duration)&&scalar(act.duration,act.delay+1,100)&&act.frame<act.duration&&act.face*act.face===1&&
      (!requiredMarker||act.frame>=act.delay||marker?.kind===requiredMarker&&marker.ttl>=act.delay-act.frame));
    const arraysOK=s&&['shots','hazards','effects'].every(key=>Array.isArray(s[key])&&s[key].length<=80)&&
      s.shots.every(q=>q&&['sam','higgs','cliff','recall','gate','heartman','memory','cargo','deck'].includes(q.kind)&&scalar(q.x,-90,W+90)&&scalar(q.y,0,H)&&scalar(q.ttl,1,400)&&scalar(q.delay,0,60)&&scalar(q.w,1,200)&&scalar(q.h,1,200)&&scalar(q.damage,1,100)&&scalar(q.vx,-15,15))&&
      s.hazards.every(q=>q&&['ring','spike','slam','bolt','orb'].includes(q.kind)&&scalar(q.x,-120,W+120)&&scalar(q.y,0,H)&&scalar(q.ttl,1,250)&&scalar(q.delay,0,100)&&scalar(q.w,1,250)&&scalar(q.h,1,H)&&scalar(q.damage,1,100)&&scalar(q.vx,-15,15))&&
      s.effects.every(q=>q&&typeof q.kind==='string'&&scalar(q.ttl,1,22)&&scalar(q.x,-400,W+400)&&scalar(q.y,0,H));
    const boxes=s?.cargo?.boxes,boxesOK=Array.isArray(boxes)&&boxes.length<=(d?.cargo||0)&&
      boxes.every(q=>q&&Number.isInteger(q.id)&&q.id>0&&scalar(q.x,0,W)&&['ground','carried','delivered'].includes(q.state))&&
      new Set(boxes.map(q=>q.id)).size===boxes.length&&boxes.filter(q=>q.state==='delivered').length===s.cargo.delivered&&
      (s.cargo.carrying===null?boxes.every(q=>q.state!=='carried'):boxes.filter(q=>q.state==='carried').length===1&&boxes.some(q=>q.state==='carried'&&q.id===s.cargo.carrying));
    return !!(['easy','normal','hard'].includes(s.difficulty)&&
      ['intro','active','collect'].includes(s.phase)&&Number.isInteger(s.tick)&&s.tick>=0&&s.tick<=18000&&
      Number.isInteger(s.remaining)&&s.remaining>0&&s.remaining<=d.seconds*60&&scalar(s.phaseTicks,0,75)&&scalar(s.waveDelay,0,180)&&
      typeof s.message==='string'&&scalar(s.messageTicks,0,300)&&
      p&&p.hp>0&&p.hp<=120&&p.x>=32&&p.x<=W-32&&p.y>=0&&p.y<=360&&Math.abs(p.vy)<=30&&
      p.energy>=0&&p.energy<=100&&p.guardMeter>=0&&p.guardMeter<=100&&p.face*p.face===1&&
      ['stun','invuln','shield','flash'].every(key=>scalar(p[key],0,100))&&scalar(p.walk,0,10000)&&actionOK&&markerOK&&
      b&&b.type===d.type&&b.hp>=0&&b.hp<=b.maxHp&&b.maxHp>0&&b.maxHp<1000&&scalar(b.x,0,W)&&b.face*b.face===1&&scalar(b.timer,0,300)&&
      ['approach','tell','attack','recover','dive','defeated'].includes(b.phase)&&
      attackOK&&(!['tell','attack'].includes(b.phase)||attack)&&[1,2].includes(b.tier)&&Number.isInteger(b.cycle)&&scalar(b.cycle,0,1000)&&
      scalar(b.stagger,0,200)&&scalar(b.flash,0,20)&&scalar(b.exposed,0,150)&&
      s.wave>=1&&s.wave<=(d.waves||1)&&s.cargo&&s.cargo.goal===(d.cargo||0)&&s.cargo.integrity>0&&s.cargo.integrity<=100&&
      boxesOK&&s.cargo.delivered>=0&&s.cargo.delivered<=s.cargo.goal&&arraysOK&&
      s.stats&&['damageDealt','damageTaken','guarded','avoided','attacks','signatures','cargoHits'].every(key=>scalar(s.stats[key],0,100000))&&Number.isInteger(s.nextId)&&s.nextId>0);
  }
  function progress(){
    if(sessionProgress)return clone(sessionProgress);
    const remember=p=>{sessionProgress=p;return clone(p);};
    try{
      const raw=storage()?.getItem(STORE);if(!raw||raw.length>180000)return remember(emptyProgress());
      const p=JSON.parse(raw);if(p.version!==1||p.rules!==RULES||!p.records||typeof p.records!=='object'||!Array.isArray(p.recent))return remember(emptyProgress());
      const clean=emptyProgress();
      for(const [key,r] of Object.entries(p.records).slice(0,200))if(/^(sam|fragile|higgs|cliff|mule|diehardman|mama|heartman):(lion|squid|whale|giant|truck|convoy):(easy|normal|hard)$/.test(key)&&finiteTree(r)&&Number.isInteger(r.attempts)&&r.attempts>=0&&Number.isInteger(r.wins)&&r.wins>=0&&r.wins<=r.attempts&&Number.isFinite(r.best)&&r.best>=0&&(r.fastest===null||Number.isFinite(r.fastest)))clean.records[key]=r;
      clean.recent=p.recent.filter(r=>r&&own(encounters,r.bossId)&&own(players,r.p1)&&Number.isFinite(r.score)&&typeof r.won==='boolean').slice(0,12);
      clean.checkpoint=validCheckpoint(p.checkpoint)?p.checkpoint:null;return remember(clean);
    }catch{return remember(emptyProgress());}
  }
  function writeProgress(p){sessionProgress=clone(p);try{const store=storage();if(!store)return false;store.setItem(STORE,JSON.stringify(p));return true;}catch{return false;}}
  function checkpoint(){
    if(!current||!['intro','active','collect'].includes(current.s.phase))return null;
    const state=clone(current.s);state.p.keys={};state.p.taps={};return {version:1,rules:RULES,state};
  }
  function emptyRushProgress(){return {version:1,rules:RUSH_RULES,engineRules:RULES,records:{},recent:[],run:null};}
  function rushTotals(run){return {score:run.results.reduce((total,r)=>total+r.score,0),elapsed:run.results.reduce((total,r)=>total+r.elapsed,0)};}
  function validRushRun(run){
    if(!run||!finiteTree(run)||!own(players,run.p1)||!['easy','normal','hard'].includes(run.difficulty)||
      !validOutfit(run.p1,run.outfit)||!Number.isInteger(run.index)||run.index<0||run.index>RUSH_ORDER.length||
      !['ready','active','won','lost'].includes(run.status)||!Number.isFinite(run.health)||run.health<0||run.health>120||
      !Array.isArray(run.results)||run.results.length>RUSH_ORDER.length)return false;
    const lost=run.status==='lost',won=run.status==='won';
    if(run.results.length!==run.index+(lost?1:0)||won!==(run.index===RUSH_ORDER.length)||(!lost&&run.health<=0))return false;
    for(let i=0;i<run.results.length;i++){
      const r=run.results[i],d=encounters[RUSH_ORDER[i]];
      if(!r||r.bossId!==RUSH_ORDER[i]||r.won!==(!lost||i<run.index)||
        !Number.isFinite(r.score)||r.score<0||r.score>1e6||!Number.isInteger(r.elapsed)||r.elapsed<0||r.elapsed>d.seconds*60||
        !Number.isFinite(r.vitality)||r.vitality<0||r.vitality>120||
        !['boss','cargo','time','health'].includes(r.reason))return false;
    }
    if(run.status==='active'){
      const cp=run.checkpoint,s=cp?.state;
      return validCheckpoint(cp)&&s.bossId===RUSH_ORDER[run.index]&&s.p1===run.p1&&s.difficulty===run.difficulty&&
        s.outfit===run.outfit&&s.stage===encounters[s.bossId].stage&&s.p.hp===run.health;
    }
    if(run.checkpoint!==null)return false;
    if(run.status==='ready'||won){
      const expected=run.index?Math.min(120,run.results[run.index-1].vitality+20):120;
      return run.health===expected;
    }
    return run.health===run.results.at(-1).vitality;
  }
  function rushProgress(){
    if(sessionRush)return clone(sessionRush);
    const remember=p=>{sessionRush=p;return clone(p);};
    try{
      const raw=storage()?.getItem(RUSH_STORE);if(!raw||raw.length>220000)return remember(emptyRushProgress());
      const p=JSON.parse(raw);
      if(p.version!==1||p.rules!==RUSH_RULES||p.engineRules!==RULES||!p.records||typeof p.records!=='object'||!Array.isArray(p.recent))return remember(emptyRushProgress());
      const clean=emptyRushProgress();
      for(const [key,r] of Object.entries(p.records).slice(0,24))if(/^(sam|fragile|higgs|cliff|mule|diehardman|mama|heartman):(easy|normal|hard)$/.test(key)&&
        finiteTree(r)&&Number.isInteger(r.attempts)&&r.attempts>=0&&Number.isInteger(r.wins)&&r.wins>=0&&r.wins<=r.attempts&&
        Number.isFinite(r.best)&&r.best>=0&&(r.fastest===null||Number.isFinite(r.fastest)&&r.fastest>=0))clean.records[key]=r;
      clean.recent=p.recent.filter(r=>validRushRun(r)&&['won','lost'].includes(r.status)).slice(0,8);
      clean.run=validRushRun(p.run)?p.run:null;return remember(clean);
    }catch{return remember(emptyRushProgress());}
  }
  function writeRushProgress(p){sessionRush=clone(p);try{const store=storage();if(!store)return false;store.setItem(RUSH_STORE,JSON.stringify(p));return true;}catch{return false;}}
  function createRush(o={}){
    stop();
    const p=rushProgress(),p1=own(players,o.p1)?o.p1:'sam';
    const outfit=validOutfit(p1,o.outfit)?o.outfit:'atelier';
    p.run={p1,difficulty:['easy','normal','hard'].includes(o.difficulty)?o.difficulty:'normal',outfit,
      index:0,status:'ready',health:120,results:[],checkpoint:null};
    const saved=writeRushProgress(p);return {...clone(p.run),saved};
  }
  function finishRush(result,health){
    const p=rushProgress(),run=p.run;
    run.results.push({bossId:result.bossId,won:result.won,reason:result.reason,score:result.score,elapsed:result.elapsed,vitality:health});
    run.checkpoint=null;
    if(result.won){run.index++;run.health=Math.min(120,health+20);run.status=run.index===RUSH_ORDER.length?'won':'ready';}
    else{run.health=health;run.status='lost';}
    if(['won','lost'].includes(run.status)){
      const key=[run.p1,run.difficulty].join(':'),r=p.records[key]||{attempts:0,wins:0,best:0,fastest:null},totals=rushTotals(run);
      r.attempts++;
      if(run.status==='won'){r.wins++;r.best=Math.max(r.best,totals.score);r.fastest=r.fastest===null?totals.elapsed:Math.min(r.fastest,totals.elapsed);}
      p.records[key]=r;p.recent.unshift(clone(run));p.recent=p.recent.slice(0,8);
    }
    const saved=writeRushProgress(p);
    result.rush={index:run.index,total:RUSH_ORDER.length,status:run.status,health:run.health,...rushTotals(run)};
    return saved;
  }
  function persist(){
    if(current?.isolated)return null;
    if(current?.rush){
      const p=rushProgress();p.run.checkpoint=checkpoint();p.run.status='active';p.run.health=current.s.p.hp;
      return writeRushProgress(p);
    }
    const p=progress();p.checkpoint=checkpoint();return writeProgress(p);
  }
  function newBoss(d,difficulty,wave){
    const maxHp=Math.round(d.hp*({easy:.82,normal:1,hard:1.2}[difficulty])*(wave>1?1.12:1));
    return {type:d.type,x:940,face:-1,hp:maxHp,maxHp,phase:'approach',timer:55,tier:1,cycle:0,attack:null,
      stagger:0,flash:0,exposed:0,damageToDepot:false};
  }
  function makeState(o){
    const bossId=own(encounters,o.boss)?o.boss:'lion',d=encounters[bossId];
    const p1=own(players,o.p1)?o.p1:'sam',difficulty=['easy','normal','hard'].includes(o.difficulty)?o.difficulty:'normal';
    return {bossId,p1,difficulty,stage:own(content.stages,o.stage)?o.stage:d.stage,outfit:validOutfit(p1,o.outfit)?o.outfit:'atelier',tick:0,phase:'intro',phaseTicks:75,
      remaining:d.seconds*60,p:{x:250,y:0,vy:0,face:1,hp:120,energy:100,guardMeter:100,guard:false,crouch:false,keys:{},taps:{},
        act:null,stun:0,invuln:0,shield:0,walk:0,marker:null,flash:0},boss:newBoss(d,difficulty,1),wave:1,waveDelay:0,
      cargo:{goal:d.cargo||0,delivered:0,integrity:100,carrying:null,boxes:[]},shots:[],hazards:[],effects:[],nextId:1,
      message:d.goal,messageTicks:200,stats:{damageDealt:0,damageTaken:0,guarded:0,avoided:0,attacks:0,signatures:0,cargoHits:0},result:null};
  }
  function image(path){if(!path)return null;const im=new Image();im.src=path;return im;}
  function loadArt(s){
    const id=s.p1,tailored=art.wardrobe?.[id]?.[s.outfit],base={stance:art.fighters?.[id],action:art.actions?.[id],step:art.steps?.[id],
      hit:art.hits?.[id],jump:art.jumps?.[id],...art.poses?.[id]};
    return {base:Object.fromEntries(Object.entries(base).map(([key,path])=>[key,image(path)])),
      tailored:Object.fromEntries(Object.entries(tailored?.poses||{}).map(([key,path])=>[key,image(path)])),
      legacy:{...legacyGeometry[id],...art.geometry?.[id],...tailored?.geometry},measured:art.generatedGeometry?.fighters?.[id]||{},
      tailoredMeasured:tailored?.nativePoses ? tailored.poseGeometry || {} : null,
      boss:Object.fromEntries(Object.entries(bossArt.sprites?.[encounters[s.bossId].type]||{}).map(([key,path])=>[key,image(path)])),
      effects:Object.fromEntries(Object.entries(bossArt.effects||{}).map(([key,path])=>[key,image(path)])),
      shots:Object.fromEntries(Object.entries(art.projectiles||{}).map(([key,path])=>[key,image(path)])),
      cargo:image(art.props?.cargo),deck:image(art.props?.bridgeDeck),parcel:image(art.props?.closedParcel),
      stage:Object.fromEntries(['stages','skyplates','distants','midgrounds','floors','foregrounds'].map(key=>[key,image(art[key]?.[s.stage])]))};
  }
  function start(o){
    if(o.isolated&&o.rush)throw new Error('Une rencontre isolée ne peut pas modifier une série Boss Rush.');
    // The campaign owns its save. Even replacing a still-mounted encounter
    // cannot touch the standalone records/checkpoint from this entry point.
    clearSession(!o.isolated);
    const run=o.rush?rushProgress().run:null;
    if(o.rush&&(!run||!['ready','active'].includes(run.status)))return null;
    if(run)o={...o,p1:run.p1,boss:RUSH_ORDER[run.index],stage:encounters[RUSH_ORDER[run.index]].stage,
      difficulty:run.difficulty,outfit:run.outfit,resume:run.checkpoint};
    const saved=o.resume&&validCheckpoint(o.resume)?clone(o.resume.state):null,s=saved||makeState(o);
    if(run&&!saved)s.p.hp=run.health;
    s.p.keys={};s.p.taps={};
    current={s,canvas:o.canvas,ctx:o.canvas.getContext('2d'),images:loadArt(s),onEnd:o.onEnd,onStatus:o.onStatus,
      manual:!!o.manualClock,paused:false,last:null,accumulator:0,statusKey:'',saved:true,rush:!!run,isolated:!!o.isolated,
      staticScenery:!!o.staticScenery,staticSceneCamera:clamp((s.p.x-W/2)*.13,-65,65)};
    o.canvas.width=W;o.canvas.height=H;
    soundOn=o.sound!==false;ambience=clamp(Number.isFinite(o.ambienceVolume)?o.ambienceVolume:.35,0,1);reduced=!!o.reducedEffects;
    current.saved=persist();notify(true);draw();if(!current.manual)raf=host.requestAnimationFrame(frame);return snapshot();
  }
  function clearSession(save){
    if(save&&current&&current.s.phase!=='ended')persist();
    if(raf)host.cancelAnimationFrame(raf);raf=0;current=null;stopAudio();
  }
  function stop(){clearSession(true);}
  function pause(on){
    if(!current||current.s.phase==='ended')return;current.paused=!!on;current.s.p.keys={};current.s.p.taps={};current.last=null;current.accumulator=0;
    if(on){current.saved=persist();stopAudio();}notify(true);draw();
  }
  function input(player,action,down){
    if(!current||player!==1||!actionNames.has(action)||current.s.phase==='ended')return;
    const p=current.s.p;if(current.paused&&down)return;
    if(down&&!p.keys[action])p.taps[action]=true;p.keys[action]=!!down;
    if(down&&soundOn)ensureAudio();
  }
  function snapshot(){return current?{...clone(current.s),paused:current.paused,saved:current.saved,isolated:current.isolated,staticScenery:current.staticScenery}:null;}
  function notify(force=false){
    if(!current)return;const s=current.s,key=[s.phase,s.boss.phase,s.message,s.wave,s.cargo.delivered,current.paused].join('|');
    if(!force&&key===current.statusKey)return;current.statusKey=key;current.onStatus?.(snapshot());
  }
  function message(s,text,time=150){s.message=text;s.messageTicks=time;}
  function effect(s,x,y,kind='hit'){s.effects.push({id:s.nextId++,x,y,kind,ttl:22});}
  function finish(s,won,reason){
    if(s.phase==='ended')return;s.phase='ended';s.p.keys={};s.p.taps={};s.hazards=[];s.shots=[];
    const d=encounters[s.bossId],elapsed=d.seconds*60-s.remaining;
    const score=won?Math.max(100,Math.round(12000+s.stats.damageDealt*9+s.p.hp*25+(d.cargo?s.cargo.integrity*12:0)-elapsed*1.5)):0;
    const result={won,reason,score,bossId:s.bossId,p1:s.p1,difficulty:s.difficulty,stage:s.stage,elapsed,
      vitality:Math.ceil(s.p.hp),cargo:s.cargo.delivered,cargoGoal:s.cargo.goal,integrity:s.cargo.integrity,waves:s.wave,stats:clone(s.stats)};
    if(current.isolated){result.saved=null;result.isolated=true;}
    else if(current.rush)result.saved=finishRush(result,s.p.hp);
    else{
      const p=progress(),key=[s.p1,s.bossId,s.difficulty].join(':'),r=p.records[key]||{attempts:0,wins:0,best:0,fastest:null};
      r.attempts++;if(won){r.wins++;r.best=Math.max(r.best||0,score);r.fastest=r.fastest===null?elapsed:Math.min(r.fastest,elapsed);}
      p.records[key]=r;p.recent.unshift(result);p.recent=p.recent.slice(0,12);p.checkpoint=null;result.saved=writeProgress(p);
    }
    s.result=result;current.saved=result.saved;stopAudio();notify(true);current?.onEnd?.(clone(result));
  }
  function damageCargo(s,amount){
    if(!s.cargo.goal||s.phase==='ended')return;s.cargo.integrity=Math.max(0,s.cargo.integrity-amount);s.stats.cargoHits++;effect(s,115,FLOOR-34,'cargo');
    message(s,'Cargaison touchée · intégrité '+s.cargo.integrity+' %');if(!s.cargo.integrity)finish(s,false,'cargo');
  }
  function damagePlayer(s,amount,{blockable=true,low=false,x=s.boss.x}={}){
    const p=s.p;if(p.invuln>0||s.phase==='ended')return false;
    const facing=(x-p.x)*p.face>=-24;
    const shield=p.shield>0&&facing,guard=p.guard&&facing&&blockable&&(!low||p.crouch)&&p.guardMeter>0;
    if(shield||guard){
      const chip=Math.min(p.hp,shield?0:2);p.hp-=chip;s.stats.damageTaken+=chip;s.stats.guarded++;
      p.guardMeter=Math.max(0,p.guardMeter-(shield?6:18));p.invuln=14;effect(s,p.x,FLOOR-p.y-95,'guard');tone(270,.09);
      if(shield){p.shield=0;damageBoss(s,24,10);message(s,'Contre réussi · riposte de commandement');}
      if(!p.guardMeter){p.stun=45;p.guard=false;message(s,'Garde rompue · reculez pour récupérer');}
      if(!p.hp)finish(s,false,'health');return true;
    }
    const damage=Math.min(p.hp,Math.round(amount*({easy:.7,normal:1,hard:1.25}[s.difficulty])));
    p.hp-=damage;p.stun=22;p.invuln=38;p.flash=20;p.act=null;p.x=clamp(p.x+(p.x<x?-34:34),32,W-32);
    s.stats.damageTaken+=damage;effect(s,p.x,FLOOR-p.y-80);tone(85,.16);
    if(s.cargo.carrying!==null)damageCargo(s,12);
    if(!p.hp)finish(s,false,'health');return true;
  }
  function defeatBoss(s){
    const b=s.boss,d=encounters[s.bossId];b.hp=0;b.phase='defeated';b.timer=0;b.attack=null;s.hazards=[];
    if(!d.cargo){finish(s,true,'boss');return;}
    const count=d.waves?1:2;
    for(let i=0;i<count;i++)s.cargo.boxes.push({id:s.nextId++,x:clamp(b.x+(i-(count-1)/2)*75,220,W-70),state:'ground'});
    s.phase='collect';
    if(s.wave<(d.waves||1)){s.waveDelay=180;message(s,'Camion immobilisé · deuxième vague dans 3 secondes. Récupérez le colis !',180);}
    else message(s,'Camion immobilisé · prends un colis, puis livre-le au dépôt à gauche.',240);
    tone(380,.2);
  }
  function damageBoss(s,amount,stagger=12){
    const b=s.boss;if(b.hp<=0||b.phase==='dive'||s.phase==='ended')return false;
    const exposed=b.phase==='recover'||b.exposed>0,armour=b.type==='mule-truck'?.72:b.type==='whale'?.65:1;
    const n=Math.max(1,Math.round(amount*(exposed?1.35:armour)*players[s.p1].power));
    const applied=Math.min(b.hp,n);b.hp-=applied;b.flash=10;s.stats.damageDealt+=applied;
    // An exposed boss can be punished, but repeated hits cannot restart that window forever.
    if(b.phase!=='recover')b.stagger+=stagger;
    effect(s,b.x-60,FLOOR-110);tone(160,.07);
    if(b.hp<=0){defeatBoss(s);return true;}
    if(b.stagger>=85){b.stagger=0;b.phase='recover';b.timer=90;b.attack=null;s.hazards=s.hazards.filter(h=>h.kind==='bolt'||h.kind==='orb');message(s,'Équilibre rompu · noyau exposé',90);}
    if(b.hp<=b.maxHp*.5&&b.tier===1){b.tier=2;message(s,'Phase 2 · attaques rapprochées. Gardez les zones annoncées en vue.',170);}
    return true;
  }
  // Pose-dependent collision remains deterministic even while images are loading or unavailable.
  function bossPose(b){return b.type==='mule-truck'?(b.hp<b.maxHp*.5?'damaged':'idle'):b.hp===0||b.phase==='recover'?'stagger':['tell','attack'].includes(b.phase)?'attack':'idle';}
  function bossBodyHeight(s){const d=encounters[s.bossId];return d.bodyHeights?.[bossPose(s.boss)]??d.bodyHeight;}
  function melee(s,damage,reach,stagger=18){
    const p=s.p,b=s.boss,d=encounters[s.bossId];
    if(b.hp>0&&Math.abs(b.x-p.x)<=d.radius+reach&&(b.x-p.x)*p.face>=-25&&p.y<bossBodyHeight(s)+40)damageBoss(s,damage,stagger);
    effect(s,p.x+p.face*reach*.7,FLOOR-p.y-90,'swing');
  }
  function friendly(s,kind,x,y,vx,damage,extra={}){
    if(s.phase!=='ended')s.shots.push({id:s.nextId++,kind,x,y,vx,damage,w:42,h:32,ttl:160,delay:0,...extra});
  }
  function interact(s){
    if(!s.cargo.goal)return false;
    const p=s.p,c=s.cargo;
    if(c.carrying!==null){
      const box=c.boxes.find(q=>q.id===c.carrying);if(!box){c.carrying=null;return false;}
      if(p.x<=155&&p.y<8){box.state='delivered';c.delivered++;c.carrying=null;message(s,'Colis livré · '+c.delivered+' / '+c.goal);tone(540,.12);
        if(c.delivered===c.goal&&s.boss.hp===0&&s.wave===(encounters[s.bossId].waves||1))finish(s,true,'cargo');
      }else{box.state='ground';box.x=p.x;c.carrying=null;message(s,'Colis posé · commande Colis pour le reprendre');}
      return true;
    }
    const box=c.boxes.find(q=>q.state==='ground'&&Math.abs(q.x-p.x)<75&&p.y<20);
    if(box){box.state='carried';c.carrying=box.id;message(s,'Colis saisi · rejoignez le dépôt à gauche puis utilisez la commande Colis');return true;}
    message(s,s.boss.hp>0?'Immobilisez le camion avant de récupérer sa cargaison.':'Approchez-vous d’un colis et utilisez la commande Colis.');return true;
  }
  function beginAction(s,key){
    const p=s.p;if(p.act||p.stun||p.guard)return;
    if(key==='throw'&&interact(s))return;
    let kind=key,delay=key==='heavy'?14:6,duration=key==='heavy'?34:20;
    if(key==='special'){
      const axis=(p.keys.right?1:0)-(p.keys.left?1:0),dir=axis?axis===p.face?1:2:0;kind=directions[s.p1][dir];
      if((kind==='winch'&&p.marker?.kind!=='anchor')||(kind==='recall'&&p.marker?.kind!=='post')||(kind==='retrieve'&&p.marker?.kind!=='crate')){message(s,'Posez votre repère avant cette technique.');return;}
      if(p.energy<costs[kind]){message(s,'Énergie chirale insuffisante · elle se recharge avec le temps.',70);return;}
      p.energy-=costs[kind];delay=kind==='tar'?23:12;duration=delay+22;s.stats.signatures++;
      if(['winch','recall','retrieve'].includes(kind))p.marker.ttl=Math.max(p.marker.ttl,delay+1);
    }else if(key==='finish'){
      if(p.energy<70){message(s,'Charge chirale · 70 points requis.');return;}p.energy-=70;delay=22;duration=52;
    }else if(key==='throw')kind='grab';
    else if(key==='light'&&p.keys.down)kind='sweep';
    else if(key==='heavy'&&p.keys.down)kind='lift';
    p.act={kind,frame:0,delay,duration,face:p.face};s.stats.attacks++;
  }
  function perform(s,a){
    const p=s.p,b=s.boss,face=a.face,x=p.x,y=FLOOR-p.y;
    switch(a.kind){
      case'light':case'sweep':melee(s,10,100,11);break;
      case'heavy':case'lift':
        melee(s,23,135,24);
        if(p.marker?.kind==='crate'&&Math.abs(p.marker.x-x)<180){friendly(s,'cargo',p.marker.x,FLOOR-22,face*7,32,{w:56,h:42});p.marker=null;}break;
      case'grab':melee(s,14,65,28);message(s,'Les grandes cibles résistent à la projection · frappe d’appui.');break;
      case'finish':melee(s,65,230,48);friendly(s,'memory',x+face*90,y-90,face*8,22,{w:110,h:110,ttl:90});message(s,'Charge chirale !',70);break;
      case'bola':friendly(s,'sam',x+face*45,y-92,face*9,34);break;
      case'brace':case'parry':case'order':p.shield=a.kind==='order'?80:55;message(s,'Contre prêt · faites face au prochain impact.',90);break;
      case'blink':p.invuln=30;p.x=clamp(x+face*210,35,W-35);melee(s,36,145,24);effect(s,x,y-90,'blink');break;
      case'fan':melee(s,30,175,22);break;
      case'beacon':
        if(p.marker?.kind==='beacon'){p.x=p.marker.x;p.marker=null;p.invuln=24;}else p.marker={kind:'beacon',x,ttl:240};break;
      case'tar':friendly(s,'higgs',clamp(b.x,60,W-60),FLOOR-50,0,38,{w:86,h:100,ttl:12});break;
      case'mine':friendly(s,'higgs',clamp(x+face*185,50,W-50),FLOOR-35,0,34,{w:80,h:80,delay:18,ttl:200});break;
      case'feint':case'syncope':p.x=clamp(x-face*110,35,W-35);p.invuln=38;effect(s,x,y-85,'blink');break;
      case'salvo':friendly(s,'cliff',x+face*38,y-95,face*10,20);friendly(s,'cliff',x+face*38,y-55,face*10,20,{delay:9});break;
      case'post':p.marker={kind:'post',x:clamp(x+face*230,60,W-60),ttl:300};break;
      case'recall':friendly(s,'recall',p.marker.x,FLOOR-85,0,45,{w:65,h:165,ttl:18});p.marker=null;break;
      case'scan':b.exposed=150;melee(s,18,480,15);effect(s,x,y-90,'scan');message(s,'Cible repérée · blindage affaibli pendant 2,5 secondes.');break;
      case'crate':p.marker={kind:'crate',x:clamp(x+face*86,50,W-50),ttl:360};break;
      case'retrieve':friendly(s,'cargo',p.marker.x,FLOOR-22,Math.sign(x-p.marker.x)*8,36,{w:55,h:42,ttl:120});p.marker=null;break;
      case'gate':friendly(s,'gate',clamp(x+face*170,50,W-50),FLOOR-71,0,36,{w:45,h:143,ttl:100});break;
      case'relief':p.x=clamp(x-face*75,35,W-35);melee(s,30,210,25);p.invuln=18;break;
      case'anchor':p.marker={kind:'anchor',x:clamp(x+face*155,55,W-55),ttl:360};break;
      case'deck':friendly(s,'deck',p.marker?.kind==='anchor'?p.marker.x:x,FLOOR-55,face*7,38,{w:100,h:55,ttl:130});break;
      case'winch':p.x=p.marker.x;p.marker=null;p.invuln=25;break;
      case'pulse':friendly(s,'heartman',x+face*40,y-90,face*8,38,{w:45,h:50});break;
      case'memory':
        if(p.marker?.kind==='memory'){friendly(s,'memory',p.marker.x,FLOOR-75,0,48,{w:150,h:150,ttl:18});p.marker=null;}
        else p.marker={kind:'memory',x,ttl:300};break;
    }
    tone(420,.07);
  }
  function movePlayer(s){
    const p=s.p,b=s.boss,spec=players[s.p1],oldX=p.x;
    for(const key of ['stun','invuln','shield','flash'])if(p[key]>0)p[key]--;
    p.energy=Math.min(100,p.energy+.19);p.guardMeter=Math.min(100,p.guardMeter+(p.keys.guard?.12:.55));
    p.guard=!!p.keys.guard&&!p.stun&&!p.act&&p.y<3;p.crouch=!!p.keys.down&&p.y<3;
    if(b.hp>0&&!p.act)p.face=b.x>=p.x?1:-1;
    if(!p.stun){
      if(p.taps.up&&p.y===0){p.vy=13.5;p.guard=false;p.crouch=false;}
      const axis=(p.keys.right?1:0)-(p.keys.left?1:0),speed=spec.speed*(p.guard?.38:p.crouch?.5:1)*(s.cargo.carrying!==null?.76:1)*(p.act?.75:1);
      p.x=clamp(p.x+axis*speed,32,W-32);if(axis){p.walk+=.3;if(b.hp<=0&&!p.act)p.face=axis;}
      for(const key of ['throw','finish','special','heavy','light'])if(p.taps[key]){beginAction(s,key);break;}
    }
    if(p.y>0||p.vy>0){p.y=Math.max(0,p.y+p.vy);p.vy-=.65;if(p.y===0)p.vy=0;}
    if(b.hp>0&&b.phase!=='dive'&&p.y<125){const radius=encounters[s.bossId].radius*.55;
      if(Math.abs(p.x-b.x)<radius)p.x=clamp(b.x+(oldX<b.x?-radius:radius),32,W-32);}
    if(p.act){const a=p.act;a.frame++;if(a.frame===a.delay)perform(s,a);if(a.frame>=a.duration)p.act=null;}
    if(p.marker&&--p.marker.ttl<=0)p.marker=null;
    p.taps={};
  }
  function prepareAttack(s){
    const b=s.boss,d=encounters[s.bossId],type=d.patterns[b.cycle%d.patterns.length],x=s.p.x;
    b.face=x>=b.x?1:-1;
    const a={type,target:x,from:b.x,to:clamp(x,150,W-150),markers:[],age:0,hit:false,depot:false};
    if(type==='charge'){a.name='CHARGE';a.advice='Sautez au-dessus du passage';a.markers=[{x:(b.x+a.to)/2,w:Math.abs(b.x-a.to)+180,h:115}];a.active=48;}
    if(type==='ring'){a.name='ANNEAU AU SOL';a.advice='Sautez lorsque l’anneau approche';a.markers=[{x:W/2,w:W-60,h:50}];a.active=90;}
    if(type==='spikes'){a.name='JETS DE GOUDRON';a.advice='Quittez les colonnes marquées';const offsets=b.tier===2?[-360,-180,0,180,360]:[-245,0,245];
      a.markers=[...new Set(offsets.map(n=>clamp(x+n,65,W-65)))].map(px=>({x:px,w:82,h:240}));a.active=42;}
    if(type==='pounce'||type==='breach'||type==='stomp'){
      a.name=type==='pounce'?'BOND':type==='breach'?'SURGISSEMENT':'FRAPPE DU GÉANT';a.advice='Sortez des zones avant l’impact';
      a.markers=[{x,w:type==='stomp'?200:215,h:type==='stomp'?450:240}];
      if(type==='stomp'&&b.tier===2)a.markers.push({x:clamp(x+(x<W/2?290:-290),110,W-110),w:180,h:450});a.active=36;
    }
    if(type==='orbs'||type==='bolts'){a.name=type==='orbs'?'SALVE CHIRALE':'TIRS MULE';a.advice='Gardez face aux tirs · bas + garde pour les tirs bas';
      a.markers=[{x:(b.x+x)/2,w:Math.abs(b.x-x)+140,h:120}];a.active=100;}
    b.attack=a;b.phase='tell';b.timer=Math.max(45,Math.round(d.tell*(b.tier===2?.86:1)*(s.difficulty==='easy'?1.2:s.difficulty==='hard'?.88:1)));
    a.warning=b.timer;message(s,a.name+' · '+a.advice,b.timer+30);tone(210,.16);
  }
  function hazard(s,kind,x,y,vx,w,h,damage,extra={}){
    s.hazards.push({id:s.nextId++,kind,x,y,vx,w,h,damage,ttl:120,delay:0,hit:false,blockable:true,low:false,...extra});
  }
  function launchAttack(s){
    const b=s.boss,a=b.attack;b.phase='attack';b.timer=a.active;a.age=0;
    if(a.type==='ring')for(const dir of [-1,1])hazard(s,'ring',b.x,FLOOR-23,dir*(b.tier===2?9:7.2),95,46,20,{ttl:190,blockable:false,low:true});
    if(a.type==='spikes')for(const [i,m] of a.markers.entries())hazard(s,'spike',m.x,FLOOR-m.h/2,0,m.w,m.h,23,{ttl:22,delay:i*4,blockable:false});
    if(['pounce','breach','stomp'].includes(a.type))for(const m of a.markers)hazard(s,'slam',m.x,FLOOR-m.h/2,0,m.w,m.h,28,{ttl:18,delay:10,blockable:false});
    if(a.type==='orbs'||a.type==='bolts'){
      const bolts=a.type==='bolts',count=b.tier===2?4:3;
      for(let i=0;i<count;i++)hazard(s,bolts?'bolt':'orb',b.x+b.face*(bolts?155:100),FLOOR-(i%2===0?92:36),b.face*(bolts?8:5.8),bolts?38:55,bolts?20:48,bolts?15:19,{delay:i*18,ttl:190,low:i%2===1});
    }
  }
  function bossTick(s){
    const b=s.boss,d=encounters[s.bossId];if(b.flash>0)b.flash--;if(b.exposed>0)b.exposed--;
    if(b.hp<=0){
      if(s.waveDelay>0&&--s.waveDelay===0){s.wave++;s.boss=newBoss(d,s.difficulty,s.wave);s.phase='active';message(s,'Deuxième vague · protégez le dépôt et rapportez le dernier colis.',200);}
      return;
    }
    if(b.phase==='attack'){
      const a=b.attack;a.age++;
      if(a.type==='charge'){
        const t=Math.min(1,a.age/38);b.x=a.from+(a.to-a.from)*t;
        if(!a.hit&&Math.abs(s.p.x-b.x)<125&&s.p.y<120)a.hit=damagePlayer(s,25,{blockable:false,x:b.x});
        // A counter can defeat or stagger this boss inside damagePlayer.
        if(s.phase==='ended'||b.hp<=0||b.phase!=='attack'||b.attack!==a)return;
        if(s.bossId==='convoy'&&!a.depot&&b.x<220){damageCargo(s,18);a.depot=true;if(s.phase==='ended')return;}
      }
      if(a.type==='pounce'||a.type==='breach')b.x=clamp(a.from+(a.to-a.from)*Math.min(1,a.age/14),155,W-155);
    }
    if(--b.timer>0)return;
    if(b.phase==='approach')prepareAttack(s);
    else if(b.phase==='tell')launchAttack(s);
    else if(b.phase==='attack'){
      if(b.attack.type==='charge'&&!b.attack.hit)s.stats.avoided++;
      b.phase='recover';b.timer=d.recover;b.attack=null;b.stagger=0;message(s,'Noyau exposé · attaquez maintenant',Math.min(85,b.timer));
    }else if(b.phase==='recover'){
      b.cycle++;b.stagger=Math.max(0,b.stagger-20);
      if(b.type==='whale'){b.phase='dive';b.timer=55;message(s,'Immersion · la baleine change de côté.',65);}
      else{b.phase='approach';b.timer=b.tier===2?28:42;}
    }else if(b.phase==='dive'){b.x=s.p.x<W/2?980:300;b.phase='approach';b.timer=35;b.face=s.p.x>=b.x?1:-1;}
  }
  function rectangleTouchesPlayer(s,h){
    const p=s.p,height=p.crouch?105:170,bottom=FLOOR-p.y,top=bottom-height;
    return Math.abs(p.x-h.x)<h.w/2+17&&bottom>h.y-h.h/2&&top<h.y+h.h/2;
  }
  function projectilesTick(s){
    const b=s.boss,d=encounters[s.bossId];
    for(const q of s.shots){
      if(q.delay>0){q.delay--;continue;}q.x+=q.vx;q.ttl--;
      if(b.hp>0&&Math.abs(q.x-b.x)<d.radius+q.w/2&&q.y+q.h/2>FLOOR-bossBodyHeight(s)&&q.y-q.h/2<FLOOR&&b.phase!=='dive'){
        damageBoss(s,q.damage,16);q.ttl=0;if(s.phase==='ended')return;
      }
    }
    s.shots=s.shots.filter(q=>q.ttl>0&&q.x>-90&&q.x<W+90);
    for(const h of s.hazards){
      if(h.delay>0){h.delay--;continue;}h.x+=h.vx;h.ttl--;
      if(!h.hit&&rectangleTouchesPlayer(s,h)){
        h.hit=damagePlayer(s,h.damage,{blockable:h.blockable,low:h.low,x:h.x-h.vx*2});
        if(s.phase==='ended')return;
        if(h.hit&&(h.kind==='orb'||h.kind==='bolt'))h.ttl=0;
      }
      if(s.bossId==='convoy'&&h.kind==='bolt'&&h.low&&!h.hit&&h.x<170&&h.x>90){damageCargo(s,7);h.hit=true;h.ttl=0;if(s.phase==='ended')return;}
      if(h.ttl<=0&&!h.hit)s.stats.avoided++;
    }
    s.hazards=s.hazards.filter(h=>h.ttl>0&&h.x>-120&&h.x<W+120);
  }
  function step(m){
    if(m!==current||m.paused||m.s.phase==='ended')return;
    const s=m.s;s.tick++;if(s.messageTicks>0)s.messageTicks--;
    if(s.phase==='intro'){
      s.p.taps={};if(--s.phaseTicks<=0){s.phase='active';message(s,encounters[s.bossId].goal,180);}notify();return;
    }
    s.remaining--;movePlayer(s);if(s.phase==='ended'||m!==current)return;
    bossTick(s);if(s.phase==='ended'||m!==current)return;
    projectilesTick(s);if(s.phase==='ended'||m!==current)return;
    for(const fx of s.effects)fx.ttl--;s.effects=s.effects.filter(fx=>fx.ttl>0);
    if(s.remaining<=0){finish(s,false,'time');return;}
    if(s.tick%180===0)m.saved=persist();notify();
  }
  function frame(time){
    const m=current;if(!m||m.manual)return;
    if(m.last===null)m.last=time;
    m.accumulator+=Math.min(100,Math.max(0,time-m.last));m.last=time;
    while(m.accumulator>=STEP&&m===current){step(m);m.accumulator-=STEP;}
    if(m===current){draw();raf=host.requestAnimationFrame(frame);}
  }
  function advance(ticks=1,renderFrame=true){if(!current?.manual)return;const m=current;for(let i=0;i<clamp(Math.floor(ticks),0,18000)&&m===current;i++)step(m);if(m===current&&renderFrame)draw();return snapshot();}

  function ready(im){return !!(im&&im.complete&&im.naturalWidth>0);}
  function crop(im,g){const a=g?.crop;return Array.isArray(a)&&a.length===4&&a.every(Number.isFinite)&&a[0]>=0&&a[1]>=0&&a[2]>0&&a[3]>0&&a[0]+a[2]<=im.naturalWidth&&a[1]+a[3]<=im.naturalHeight?a:[0,0,im.naturalWidth,im.naturalHeight];}
  function sprite(c,im,x,y,size,g={},axis='height',face=1,nativeFace=1){
    if(!ready(im))return false;
    const box=crop(im,g),height=axis==='height'?size:size*box[3]/box[2],width=height*box[2]/box[3];
    c.save();c.translate(x,y);c.scale(face/(g.nativeFacing||nativeFace),1);
    c.drawImage(im,...box,-width*(g.anchorX??.5),-height*(g.baselineY??g.anchorY??1),width,height);c.restore();return true;
  }
  function text(c,str,x,y,size=16,color='#e7eee5',align='left'){
    c.fillStyle=color;c.font='600 '+size+'px Arial,sans-serif';c.textAlign=align;c.fillText(str,x,y);c.textAlign='left';
  }
  function wrappedText(c,str,x,y,width,size=15,color='#e7eee5'){
    c.font='600 '+size+'px Arial,sans-serif';
    const words=String(str).split(/\s+/),lines=[];let line='';
    for(const word of words){const next=line?line+' '+word:word;if(line&&c.measureText(next).width>width){lines.push(line);line=word;}else line=next;}
    if(line)lines.push(line);
    lines.slice(0,2).forEach((value,index)=>text(c,value,x,y+index*20,size,color,'center'));
  }
  function oval(c,x,y,rx,ry,color){c.beginPath();c.ellipse(x,y,Math.max(1,rx),Math.max(1,ry),0,0,Math.PI*2);c.fillStyle=color;c.fill();}
  function line(c,x,y,x2,y2,color,width=2){c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
  function scenery(m){
    const c=m.ctx,s=m.s,ims=m.images.stage,geo=art.stageGeometry?.[s.stage]||{},cam=(m.staticScenery?m.staticSceneCamera:clamp((s.p.x-W/2)*.13,-65,65))*(reduced?.2:1);
    c.fillStyle=content.arenas[s.stage]?.sky||'#425358';c.fillRect(0,0,W,H);
    const sky=ready(ims.skyplates)&&ready(ims.distants)&&ready(ims.floors)?ims.skyplates:ims.stages;
    if(ready(sky)){const scale=Math.max((W+56)/sky.naturalWidth,(H+24)/sky.naturalHeight);c.drawImage(sky,-28-cam*.14,-12,sky.naturalWidth*scale,sky.naturalHeight*scale);}
    for(const [key,gkey,margin,base,anchor,alpha,speed] of [['distants','distant',48,552,.96,1,.27],['midgrounds','middle',48,576,.97,.92,.43],['floors','floor',80,FLOOR,.3,1,.62]]){
      const im=ims[key];if(!ready(im))continue;const q=geo[gkey]||{},width=W+margin*2,height=width*im.naturalHeight/im.naturalWidth;
      c.save();c.globalAlpha=q.alpha??alpha;c.drawImage(im,-margin-cam*speed,(q.base??base)-height*(q.anchorY??anchor),width,height);c.restore();
    }
    if(!ready(ims.floors)){c.fillStyle='#18272a';c.fillRect(0,FLOOR,W,H-FLOOR);line(c,0,FLOOR,W,FLOOR,'#7c9290');}
    c.fillStyle='rgba(3,10,15,.16)';c.fillRect(0,0,W,H);
  }
  function drawPlayer(m){
    const s=m.s,p=s.p,images=m.images,c=m.ctx;
    let pose=p.stun?'hit':p.act&&p.act.frame>=p.act.delay*.5?'action':p.y>0?p.vy>4?'rise':p.vy<-4?'fall':'apex':p.crouch?'crouch':p.guard||p.shield?'guard':!!p.keys.left!==!!p.keys.right&&Math.sin(p.walk)>=0?'step':'stance';
    const get=key=>ready(images.tailored[key])?images.tailored[key]:images.base[key];
    if(!ready(get(pose)))pose=p.y>0&&ready(get('jump'))?'jump':'stance';
    const im=get(pose),height=players[s.p1].h,feet=FLOOR-p.y;
    const g=im===images.tailored[pose]
      ? (images.tailoredMeasured ? images.tailoredMeasured[pose] || {} : null)
      : images.measured[pose];
    oval(c,p.x,FLOOR+2,Math.max(12,29-p.y*.07),5,'#071116aa');c.save();
    if(p.invuln&&p.invuln%6<3)c.globalAlpha=.58;
    if(ready(im)){
      if(g)sprite(c,im,p.x,feet,height*(g.heightRatio||1),g,'height',p.face);
      else{
        const legacy=images.legacy,frames=['step','hit'].includes(pose)?legacy.motionFrames||1:1,sw=im.naturalWidth/frames;
        const index=frames>1?clamp(Math.floor((Math.sin(p.walk)+1)*frames/2),0,frames-1):0;
        sprite(c,im,p.x,feet,height*(legacy[pose+'Scale']||1),{crop:[index*sw,0,sw,im.naturalHeight],anchorX:legacy[pose+'Anchor']??legacy.stanceAnchor??.5,baselineY:legacy[pose+'Baseline']??1},'height',p.face);
      }
    }else{
      const h=p.crouch?height*.69:height;c.fillStyle='#516b71';c.fillRect(p.x-18,feet-h+25,36,h-25);oval(c,p.x,feet-h+16,13,16,'#bca88d');
    }
    if(p.shield){c.strokeStyle='#d8efaa';c.lineWidth=3;c.strokeRect(p.x-27,feet-145,54,132);}
    if(s.cargo.carrying!==null)sprite(c,images.parcel||images.cargo,p.x-p.face*12,feet-65,46,{},'width',p.face);
    c.restore();
    if(p.marker){
      const q=p.marker;oval(c,q.x,FLOOR,23,5,'#84f3d788');line(c,q.x,FLOOR,q.x,FLOOR-40,'#a1e9d1',3);
      if(q.kind==='crate')sprite(c,images.cargo,q.x,FLOOR,48,{},'width');
      text(c,({anchor:'ANCRE',post:'POSTE',beacon:'RETOUR',memory:'MÉMOIRE',crate:'CAISSE'})[q.kind]||'',q.x,FLOOR+22,10,'#cae4d5','center');
    }
  }
  function drawBoss(m){
    const s=m.s,b=s.boss,d=encounters[s.bossId],c=m.ctx;if(b.phase==='dive'){
      oval(c,b.x,FLOOR,180,11,'#070c14bb');return;
    }
    const pose=bossPose(b);
    const im=m.images.boss[pose]||m.images.boss.idle,g=bossArt.geometry?.bosses?.[b.type]?.[pose]||{};
    oval(c,b.x,FLOOR+4,d.radius*.8,10,'#030810b3');c.save();if(b.hp===0)c.globalAlpha=.5;
    if(b.flash>0&&b.flash%4<2)c.globalAlpha*=.7;
    if(!sprite(c,im,b.x,FLOOR,d.height*(g.heightRatio||1),g,'height',b.face,-1)){
      const x=b.x,h=bossBodyHeight(s);c.fillStyle=b.phase==='recover'?'#29434a':'#111c24';
      if(b.type==='mule-truck'){c.fillRect(x-190,FLOOR-155,380,120);c.fillStyle='#ba954c';c.fillRect(x-175,FLOOR-145,110,65);for(const dx of [-125,125])oval(c,x+dx,FLOOR-18,29,29,'#071017');}
      else if(b.type==='giant'){c.fillRect(x-55,FLOOR-h+50,110,h-50);oval(c,x,FLOOR-h+25,39,44,'#23313b');line(c,x-50,FLOOR-h+90,x-115,FLOOR-90,'#16232c',34);line(c,x+50,FLOOR-h+90,x+115,FLOOR-80,'#16232c',34);}
      else{oval(c,x,FLOOR-h*.52,d.radius,h*.48,'#14212a');for(let i=0;i<4;i++)line(c,x-d.radius*.65+i*d.radius*.43,FLOOR-65,x-d.radius*.85+i*d.radius*.52,FLOOR-4,'#172833',15);}
      oval(c,x-45,FLOOR-h*.62,13,12,b.phase==='recover'?'#dbeea6':'#e5c071');
    }
    c.restore();
    if(b.phase==='recover'&&b.hp>0){text(c,'NOYAU EXPOSÉ',b.x,FLOOR-d.height-16,16,'#ebf8ad','center');}
  }
  function drawHazards(m){
    const c=m.ctx,s=m.s;
    for(const h of s.hazards){if(h.delay>0)continue;
      const key={orb:'tar-orb',bolt:'mule-bolt',spike:'tar-spike',slam:'tar-spike',ring:'chiral-ring'}[h.kind],im=m.images.effects[key],g=bossArt.geometry?.effects?.[key]||{};
      const vertical=h.kind==='spike'||h.kind==='slam',size=vertical?h.h:h.kind==='ring'?100:h.kind==='bolt'?58:68;
      const renderGeo={anchorX:.5,anchorY:vertical?1:.5,...g};
      if(!sprite(c,im,h.x,vertical?FLOOR:h.y,size,renderGeo,vertical?'height':'width',Math.sign(h.vx)||1)){
        if(vertical){c.fillStyle='#17232eee';c.fillRect(h.x-h.w/2,FLOOR-h.h,h.w,h.h);line(c,h.x-h.w/2,FLOOR-h.h,h.x+h.w/2,FLOOR-h.h,'#f6c477',4);}
        else oval(c,h.x,h.y,h.w/2,h.h/2,h.kind==='bolt'?'#f2bf65':'#bcbd81');
      }
    }
    for(const q of s.shots){if(q.delay>0)continue;const im=q.kind==='cargo'?m.images.cargo:q.kind==='deck'?m.images.deck:m.images.shots[q.kind];
      const g=art.generatedGeometry?.projectiles?.[q.kind]||{},floorAnchored=['higgs','gate'].includes(q.kind),width=g.width||({sam:38,cliff:45,recall:55,gate:48,heartman:45,memory:130,deck:150,cargo:55})[q.kind]||60;
      if(!sprite(c,im,q.x,floorAnchored?FLOOR:q.y,width,{anchorX:.5,anchorY:floorAnchored?1:.5,...g},'width',Math.sign(q.vx)||s.p.face))oval(c,q.x,q.y,q.w/2,q.h/2,'#9eeadb');
    }
    for(const fx of s.effects){c.save();c.globalAlpha=fx.ttl/22;c.strokeStyle=fx.kind==='guard'?'#cce99b':fx.kind==='cargo'?'#ef9759':'#b7e7d8';c.lineWidth=3;c.beginPath();c.arc(fx.x,fx.y,(22-fx.ttl)*1.6+5,0,Math.PI*2);c.stroke();c.restore();}
  }
  function warnings(m){
    const c=m.ctx,s=m.s,b=s.boss,a=b.attack;if(!a||b.phase!=='tell')return;
    c.save();for(const q of a.markers){
      c.fillStyle='rgba(240,161,85,.12)';c.fillRect(q.x-q.w/2,FLOOR-q.h,q.w,q.h);
      c.strokeStyle='#f6c475';c.lineWidth=3;c.setLineDash([12,7]);c.strokeRect(q.x-q.w/2,FLOOR-q.h,q.w,q.h);c.setLineDash([]);
      line(c,q.x-q.w/2,FLOOR+6,q.x+q.w/2,FLOOR+6,'#ffcf83',6);
    }
    const remaining=b.timer/a.warning;c.fillStyle='#111b20ed';c.fillRect(300,125,680,61);
    text(c,a.name+' · '+a.advice,640,150,17,'#ffe0a1','center');c.fillStyle='#f1c577';c.fillRect(316,165,648*remaining,6);c.restore();
  }
  function drawCargo(m){
    const c=m.ctx,s=m.s;if(!s.cargo.goal)return;
    c.fillStyle='rgba(123,195,156,.2)';c.fillRect(35,FLOOR-70,120,85);c.strokeStyle='#a1e8bb';c.lineWidth=2;c.strokeRect(35,FLOOR-70,120,85);
    text(c,'DÉPÔT · T',95,FLOOR-78,15,'#d5f2bf','center');
    for(const box of s.cargo.boxes){if(box.state!=='ground')continue;
      if(!sprite(c,m.images.parcel||m.images.cargo,box.x,FLOOR,48,{},'width')){c.fillStyle='#b69a5c';c.fillRect(box.x-22,FLOOR-34,44,34);}
      text(c,'T · PRENDRE',box.x,FLOOR-52,12,'#e9eabb','center');
    }
  }
  function hud(m){
    const s=m.s,d=encounters[s.bossId],p=s.p,b=s.boss,c=m.ctx;
    c.fillStyle='#061118e8';c.fillRect(0,0,W,110);c.fillRect(0,632,W,88);
    text(c,content.fighters[s.p1].name.toUpperCase(),30,32,20);text(c,d.name.toUpperCase(),W-30,32,22,'#f0dcad','right');
    const bar=(x,y,w,h,value,max,color)=>{c.fillStyle='#354347';c.fillRect(x,y,w,h);c.fillStyle=color;c.fillRect(x,y,w*clamp(value/max,0,1),h);};
    bar(30,44,340,18,p.hp,120,'#b8e8c2');bar(30,72,230,7,p.energy,100,'#79c9dc');bar(278,72,92,7,p.guardMeter,100,'#d9d89b');
    bar(570,44,680,18,b.hp,b.maxHp,'#e0ba75');text(c,Math.ceil(p.hp)+' / 120 · énergie '+Math.floor(p.energy),30,100,12,'#bdcfcb');
    text(c,'PHASE '+b.tier+(d.waves?' · VAGUE '+s.wave+' / '+d.waves:''),1250,94,13,'#dfd5bd','right');
    text(c,String(Math.max(0,Math.ceil(s.remaining/60))).padStart(3,'0'),464,60,33,'#f1f0dc','center');
    const objective=s.cargo.goal?'COLIS '+s.cargo.delivered+' / '+s.cargo.goal+' · INTÉGRITÉ '+s.cargo.integrity+' %'+(s.cargo.carrying!==null?' · COLIS PORTÉ':''):
      'ATTAQUES ANNONCÉES → ESQUIVE → NOYAU EXPOSÉ';
    text(c,objective,30,657,16,'#daedb8');text(c,'Léger · Lourd · Signature · Garde · Saut'+(s.cargo.goal?' · Colis':' · Appui')+' · Charge chirale',30,687,13,'#bcd1d2');
    if(s.messageTicks>0&&!['tell'].includes(b.phase)){
      c.fillStyle='#07141bcf';c.fillRect(120,125,1040,55);wrappedText(c,s.message,640,147,1005,15,'#e5eed4');
    }
    if(s.phase==='intro'){c.fillStyle='#07151bc7';c.fillRect(250,255,780,150);text(c,'BOSS BATTLE',640,300,22,'#c6d696','center');text(c,d.name,640,349,42,'#f4e9c8','center');text(c,'Préparez votre première esquive',640,384,17,'#d4e1d9','center');}
  }
  function draw(){
    const m=current;if(!m)return;const c=m.ctx;c.save();scenery(m);drawBoss(m);drawCargo(m);drawPlayer(m);drawHazards(m);
    const fg=m.images.stage.foregrounds;if(ready(fg)){const width=W+160,h=width*fg.naturalHeight/fg.naturalWidth;c.save();c.globalAlpha=.38;c.drawImage(fg,-80,H-h,width,h);c.restore();}
    warnings(m);hud(m);c.restore();
  }
  function ensureAudio(){
    if(!soundOn||current?.paused||current?.s.phase==='ended')return null;
    try{
      if(!audio){const Context=host.AudioContext||host.webkitAudioContext;if(!Context)return null;
        const ctx=new Context(),gain=ctx.createGain(),filter=ctx.createBiquadFilter(),noise=ctx.createBufferSource(),buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);
        for(let i=0;i<data.length;i++)data[i]=(Math.sin(i*12.9898)*43758.5453%1)*.7;
        noise.buffer=buffer;noise.loop=true;filter.type='lowpass';filter.frequency.value=480;noise.connect(filter);filter.connect(gain);gain.connect(ctx.destination);gain.gain.value=ambience*.025;noise.start();audio={ctx,gain,noise};
      }
      audio.ctx.resume()?.catch?.(()=>{});return audio.ctx;
    }catch{return null;}
  }
  function stopAudio(){if(audio){try{audio.noise.stop();audio.ctx.close()?.catch?.(()=>{});}catch{}audio=null;}}
  function tone(frequency,duration){const ctx=ensureAudio();if(!ctx)return;try{const osc=ctx.createOscillator(),g=ctx.createGain();osc.type='sine';osc.frequency.value=frequency;g.gain.setValueAtTime(.025,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);osc.connect(g);g.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+duration);}catch{}}
  function setSound(on){soundOn=!!on;if(!on)stopAudio();}
  function setAmbienceVolume(value){ambience=clamp(value,0,1);if(audio)audio.gain.gain.value=ambience*.025;}
  function setReducedEffects(value){reduced=!!value;}
  function setStaticScenery(value){
    const m=current;if(!m)return;const next=!!value;
    if(next===m.staticScenery)return;
    if(next)m.staticSceneCamera=clamp((m.s.p.x-W/2)*.13,-65,65);
    m.staticScenery=next;draw();notify(true);
  }
  host.StrandBoss={encounters,players,start,stop,pause,input,snapshot,checkpoint,validCheckpoint,progress,advance,draw,
    setSound,setAmbienceVolume,setReducedEffects,setStaticScenery,rules:RULES,storageKey:STORE,
    rush:{order:RUSH_ORDER,rules:RUSH_RULES,storageKey:RUSH_STORE,progress:rushProgress,create:createRush,
      start:o=>start({...o,rush:true}),validRun:validRushRun,totals:rushTotals}};
})(window);
