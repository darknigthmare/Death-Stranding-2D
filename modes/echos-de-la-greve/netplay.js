(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const engine = window.StrandFight, {fighters,stages} = window.StrandContent;
  const commands = ['left','right','up','down','light','heavy','special','guard','throw','finish'];
  const labels = ['←','→','Saut','Bas','Léger','Lourd','Signature','Garde','Prise','Finalité'];
  const keyMap = {ArrowLeft:'left',q:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'up',z:'up',w:'up',ArrowDown:'down',s:'down',f:'light',g:'heavy',h:'special',r:'guard',t:'throw',y:'finish'};
  const sessionKey = 'echos.private.session', saveKey = 'echos.private.record';
  const held = new Set(), pingSamples = [];
  let identity=null, state=null, run=null, record=null, busy=false, timer=0, nextCommand=null;
  let pending=[], sequence=0, cursor=0, receivedAt=0, resumeControls=false, reading=false;
  const status = message => {if ($('status').textContent !== message) $('status').textContent=message;};
  function freshToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(20)),n=>n.toString(16).padStart(2,'0')).join('');
  }
  function remember(storage,key,value) {try {window[storage].setItem(key,JSON.stringify(value));} catch {}}
  function recall(storage,key) {try {return JSON.parse(window[storage].getItem(key));} catch {return null;}}
  const storedAmbience=recall('localStorage','echos.v1.ambienceVolume');
  const audioOptions={sound:recall('localStorage','echos.v1.sound')!==false,
    ambienceVolume:typeof storedAmbience==='number' && Number.isFinite(storedAmbience) ? Math.max(0,Math.min(1,storedAmbience)) : .35,
    reducedEffects:recall('localStorage','echos.v1.reducedEffects') ?? !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    staticScenery:recall('localStorage','echos.v1.staticScenery')===true};
  let audioBlurred=false,audioDisconnected=false;
  const audioBlocked=()=>audioBlurred || document.hidden || !!run && (audioDisconnected || !state?.live || !!state.result);
  function updateAudioState() {engine.setAudioSuspended(audioBlocked());}
  const audioControls=document.createElement('div');audioControls.className='row';
  audioControls.innerHTML='<button id="roomSound" type="button"></button><label>Ambiance du décor <input id="roomAmbience" type="range" min="0" max="100" step="5" aria-label="Volume de l’ambiance"><output id="roomAmbienceValue"></output></label><label>Décor <select id="roomScenery" aria-label="Animation du décor"><option value="animated">Animé</option><option value="static">Statique</option></select></label>';
  document.querySelector('header').append(audioControls);
  function updateAudioControls() {
    $('roomSound').textContent=audioOptions.sound?'Son activé':'Son coupé';
    $('roomSound').setAttribute('aria-pressed',String(audioOptions.sound));
    const percent=Math.round(audioOptions.ambienceVolume*100);
    $('roomAmbience').value=String(percent);$('roomAmbienceValue').textContent=percent+' %';
  }
  $('roomSound').onclick=()=>{
    audioOptions.sound=!audioOptions.sound;remember('localStorage','echos.v1.sound',audioOptions.sound);
    engine.setSound(audioOptions.sound);updateAudioControls();
  };
  $('roomAmbience').oninput=()=>{
    audioOptions.ambienceVolume=Number($('roomAmbience').value)/100;
    remember('localStorage','echos.v1.ambienceVolume',audioOptions.ambienceVolume);
    engine.setAmbienceVolume(audioOptions.ambienceVolume);updateAudioControls();
  };
  $('roomScenery').value=audioOptions.staticScenery?'static':'animated';
  $('roomScenery').onchange=()=>{
    audioOptions.staticScenery=$('roomScenery').value==='static';
    remember('localStorage','echos.v1.staticScenery',audioOptions.staticScenery);
    engine.setStaticScenery(audioOptions.staticScenery);
  };
  // Opening a room involves asynchronous requests. Unlock audio from the local
  // gesture, never from a remote player's input or a silent rollback step.
  document.addEventListener('pointerdown',()=>{if(audioOptions.sound)engine.setSound(true);});
  document.addEventListener('keydown',()=>{if(audioOptions.sound)engine.setSound(true);});
  updateAudioControls();
  async function call(op,data={},token=identity?.token) {
    const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),2500);
    try {
      const response=await fetch('/room',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,
        body:JSON.stringify({op,room:identity?.room,token,version:window.StrandRoomVersion,...data})});
      const result=await response.json();
      if (!response.ok) throw Object.assign(new Error(result.error||'Relais indisponible.'),{status:response.status});
      return result;
    } finally {clearTimeout(timeout);}
  }
  for (const [id,v] of Object.entries(fighters)) $('fighter').add(new Option(v.name,id));
  for (const [id,title] of Object.entries(stages)) $('stage').add(new Option(title,id));
  function clearRun() {
    cancelAnimationFrame(run?.frame);engine.stop();run=null;pending=[];sequence=0;cursor=0;held.clear();pingSamples.length=0;
  }
  function resetLobby(message) {
    clearTimeout(timer);clearRun();identity=null;state=null;nextCommand=null;remember('sessionStorage',sessionKey,null);
    $('lobby').hidden=true;$('game').hidden=true;$('entry').hidden=false;status(message);showRecord();
  }
  function updateLobby() {
    const mine=state.seats[identity.player-1],other=state.seats[2-identity.player];
    $('entry').hidden=true;$('lobby').hidden=false;
    $('seat').textContent='Joueur '+identity.player+' · '+fighters[mine.fighter].name;
    $('presence').textContent=other ? 'Adversaire · '+fighters[other.fighter].name+' · '+(!other.connected?'connexion interrompue':other.ready?'prêt':'choisit son combattant'):'En attente du deuxième joueur.';
    $('invite').value=location.origin+location.pathname+'#room='+identity.room;
    if (mine.ready) $('fighter').value=mine.fighter;
    $('fighter').disabled=mine.ready;$('ready').textContent=mine.ready?'Annuler mon état prêt':'Prêt';
    $('picks').hidden=!!state.match;
    $('arena').hidden=!!state.match||identity.player!==1||!state.seats.every(s=>s?.ready && s.connected);
  }
  // Acknowledged input replaces its predicted tick. Never apply the same serial twice.
  function insertEvent(event) {
    const [player,serial,tick]=event,key=player+'/'+serial;
    const old=run.known.get(key);
    if (old && old[2]===tick) return;
    if (old) {
      const list=run.buckets.get(old[2]);
      list.splice(list.findIndex(e=>e[0]===player && e[1]===serial),1);
      if (!list.length) run.buckets.delete(old[2]);
    }
    run.known.set(key,event);
    if (!run.buckets.has(tick)) run.buckets.set(tick,[]);
    const bucket=run.buckets.get(tick);
    bucket.push(event);bucket.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
    const dirty=Math.min(tick,old?.[2]??tick);
    if (dirty<run.tick) run.dirty=Math.min(run.dirty,dirty);
  }
  function startEngine(silent=false) {
    const cfg=run.config;
    engine.start({canvas:$('canvas'),p1:cfg.p1,p2:cfg.p2,stage:cfg.stage,mode:'local',clock:'network',seed:cfg.seed,
      difficulty:'normal',roundsToWin:2,...audioOptions,preserveStaticScenery:silent,audioSuspended:silent || audioBlocked(),onEnd:r=>{run.done={tick:run.tick+1,winner:r.winner,rounds:r.rounds.join('-')};}});
    run.tick=0;run.done=null;run.points.clear();run.points.set(0,engine.network.checkpoint());
  }
  function rewind() {
    if (run.dirty===Infinity) return;
    const candidates=[...run.points.keys()].filter(t=>t<=run.dirty);
    const priorTick=run.tick;
    if (!candidates.length) startEngine(true);
    else {
      const tick=Math.max(...candidates);
      run.tick=tick;run.done=null;
      engine.network.restore(run.points.get(tick));
      for (const t of run.points.keys()) if (t>tick) run.points.delete(t);
    }
    run.silentUntil=Math.max(run.silentUntil,priorTick);run.dirty=Infinity;
  }
  function estimate() {
    if (!state?.live) return state?.tick||0;
    const elapsed=Math.max(0,performance.now()-receivedAt);
    return state.tick+Math.min(12,Math.floor((elapsed+(pingSamples.at(-1)||0)/2)*.06));
  }
  function frame() {
    if (!run) return;
    rewind();
    const goal=Math.max(0,estimate()),stop=Math.min(goal,run.tick+300);
    while(run.tick<stop && !run.done) {
      if (run.tick%8===0 && !run.points.has(run.tick)) {
        run.points.set(run.tick,engine.network.checkpoint());
        for (const t of run.points.keys()) if (t<run.tick-64) run.points.delete(t);
      }
      const inputs=(run.buckets.get(run.tick)||[]).map(e=>[e[0],e[3],e[4]]);
      engine.network.advance(inputs,run.tick<run.silentUntil || goal-run.tick>15);
      run.tick++;
    }
    // A full rebuild also stays silent until its corrected frame is ready.
    updateAudioState();engine.network.draw();
    if (state.result && cursor===state.total && (run.done || state.result.mismatch)) networkResult(state.result);
    else run.frame=requestAnimationFrame(frame);
  }
  function launch(config) {
    $('game').hidden=false;$('saved').hidden=true;$('fightTitle').textContent=fighters[config.p1].name+' / '+fighters[config.p2].name;
    run={config,tick:0,points:new Map(),known:new Map(),buckets:new Map(),dirty:Infinity,silentUntil:0,done:null,frame:0};
    startEngine();run.frame=requestAnimationFrame(frame);
  }
  function submit(action,down) {
    if (!run || run.done || !state?.live || !commands.includes(action) || held.has(action)===down) return;
    if (down) held.add(action);else held.delete(action);
    const event=[++sequence,Math.max(run.tick,estimate()),action,down];
    pending.push(event);insertEvent([identity.player,...event]);
  }
  function release() {for (const action of [...held]) submit(action,false);}
  function networkResult(result) {
    engine.setAudioSuspended(true);
    if (result.mismatch) {status('Les deux simulations ont donné des résultats différents.');return;}
    if (!run?.done) return;
    const cfg=run.config;
    const events=[...run.known.values()].filter(e=>e[2]<result.tick).sort((a,b)=>a[2]-b[2]||a[0]-b[0]||a[1]-b[1]);
    const tape={version:1,p1:cfg.p1,p2:cfg.p2,stage:cfg.stage,mode:'local',seed:cfg.seed,difficulty:1,roundsToWin:2,ticks:result.tick,
      events:events.map(([p,,t,a,d])=>[t,((p-1)*commands.length+commands.indexOf(a))*2+Number(d)])};
    record={version:cfg.version,participants:[identity.room+'/1',identity.room+'/2'],result,tape};
    remember('localStorage',saveKey,record);
    status('Duel terminé · Joueur '+result.winner+' vainqueur ('+result.rounds+').');showRecord();
  }
  async function sync() {
    if (!identity || busy) return;
    busy=true;const who=identity,cmd=nextCommand;nextCommand=null;
    try {
      const before=performance.now(),done=run?.done;
      const reply=await call(cmd?.op||'sync',cmd?.data||{cursor,inputs:pending.slice(0,64),
        done:done && run.dirty===Infinity && !pending.length && cursor===state.total && state.tick>done.tick+24 ? done:null});
      if (identity!==who) return;
      if (reply.closed && !reply.result || cmd?.op==='leave') {resetLobby('Salon fermé.');return;}
      receivedAt=performance.now();pingSamples.push(receivedAt-before);if(pingSamples.length>9) pingSamples.shift();
      const median=[...pingSamples].sort((a,b)=>a-b)[Math.floor(pingSamples.length/2)];
      $('ping').textContent='Aller-retour médian · '+Math.round(median)+' ms';
      state=reply;audioDisconnected=false;
      sequence=Math.max(sequence,reply.ack);pending=pending.filter(e=>e[0]>reply.ack);
      if (!run && reply.match) launch(reply.match);
      if (run) {
        for (const event of reply.events) insertEvent(event);
        cursor=Math.max(cursor,reply.cursor+reply.events.length);
        if (resumeControls && cursor===reply.total) {
          resumeControls=false;const latest=new Map();
          for (const event of run.known.values()) if(event[0]===identity.player) latest.set(event[3],event[4]);
          for (const [action,down] of latest) if(down) pending.push([++sequence,reply.tick,action,false]);
        }
        if (!reply.live && held.size) {
          for(const action of held) pending.push([++sequence,reply.tick,action,false]);
          held.clear();
        }
      }
      updateAudioState();updateLobby();
      status(run ? reply.live?'Duel en cours.':'Connexion interrompue · en attente de l’adversaire.':
        reply.seats.every(s=>s?.ready)?'Les deux joueurs sont prêts. Le joueur 1 choisit l’arène.':'Salon ouvert.');
      if (reply.result && cursor===reply.total && (run.done || reply.result.mismatch)) networkResult(reply.result);
    } catch(error) {
      if (identity!==who) return;
      audioDisconnected=true;updateAudioState();
      if ([400,403,404,409,415].includes(error.status)) {
        if (cmd && error.status===409) status(error.message);else {resetLobby(error.message);return;}
      } else {
        if (cmd && !nextCommand) nextCommand=cmd;
        status('Liaison interrompue · reconnexion en cours.');
      }
    } finally {
      busy=false;
      if(identity && (!state?.result || cursor<state.total || nextCommand)) timer=setTimeout(sync,nextCommand?0:run?30:220);
    }
  }
  function change(op,data={}) {
    if (!identity) return;
    nextCommand={op,data:{...data,cursor}};clearTimeout(timer);if(!busy) sync();
  }
  async function enter(op,room) {
    if (reading) return;
    reading=true;engine.stop();$('game').hidden=true;
    const previous=recall('sessionStorage',sessionKey);
    const token=previous?.room===room?previous.token:freshToken();
    try {
      const joined=await call(op,{room},token);
      identity={...joined,token};remember('sessionStorage',sessionKey,identity);
      pending=[];cursor=0;sequence=0;state=null;nextCommand=null;resumeControls=previous?.room===joined.room;
      $('controls').hidden=false;location.hash='room='+identity.room;$('entry').hidden=true;$('saved').hidden=true;clearTimeout(timer);sync();
    } catch(e) {status(e.message||'Relais indisponible.');} finally {reading=false;}
  }
  function showRecord() {
    if (!record?.result || !engine.validReplay(record.tape)) return;
    const compatible=record.version===window.StrandRoomVersion;
    $('saved').hidden=false;
    $('summary').textContent='Joueur '+record.result.winner+' vainqueur · '+record.result.rounds+' · '+stages[record.tape.stage]+(compatible?'':' · Version différente, lecture indisponible.');
    $('watch').disabled=!compatible;
  }
  $('create').onclick=()=>enter('create',null);
  $('joinForm').onsubmit=e=>{e.preventDefault();enter('join',$('roomCode').value.trim());};
  $('connect').onsubmit=e=>{e.preventDefault();const url=new URL($('address').value);if(['http:','https:'].includes(url.protocol)) location.assign(url.origin+'/netplay.html'+location.hash);};
  $('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('invite').value);status('Invitation copiée.');}catch{$('invite').select();status('Invitation sélectionnée. Copie le lien pour le partager.');}};
  $('ready').onclick=()=>change('ready',{ready:!state.seats[identity.player-1].ready,fighter:$('fighter').value});
  $('start').onclick=()=>change('start',{stage:$('stage').value});
  $('leave').onclick=()=>change('leave');
  $('watch').onclick=()=>{
    if (identity) {call('leave').catch(()=>{});resetLobby('Lecture de la rediffusion.');}
    $('game').hidden=false;$('controls').hidden=true;$('ping').textContent='';$('fightTitle').textContent='Rediffusion';
    engine.start({canvas:$('canvas'),replay:record.tape,...audioOptions,audioSuspended:audioBlocked(),onEnd:r=>{
      status(!r.replayMismatch && r.winner===record.result.winner && r.rounds?.join('-')===record.result.rounds?'Résultat de la rediffusion vérifié.':'Résultat de la rediffusion différent.');
    }});
  };
  $('export').onclick=()=>{
    const uri=URL.createObjectURL(new Blob([JSON.stringify(record)],{type:'application/json'}));
    const link=document.createElement('a');link.href=uri;link.download='duel-prive.json';link.click();setTimeout(()=>URL.revokeObjectURL(uri),2000);
  };
  for (const [i,action] of commands.entries()) {
    const button=document.createElement('button');button.textContent=labels[i];button.type='button';button.dataset.action=action;
    button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);submit(action,true);};
    button.onpointerup=button.onpointercancel=button.onlostpointercapture=()=>submit(action,false);
    $('controls').append(button);
  }
  for (const type of ['keydown','keyup']) window.addEventListener(type,event=>{
    if (!run) return;
    const action=keyMap[event.key]||keyMap[event.key.toLowerCase()];
    if(!action)return;
    // A local option can take focus while a movement key is still held.
    // Always release that existing input, including after a modifier changes.
    if(type==='keyup'){if(held.has(action))submit(action,false);return;}
    if(event.altKey||event.ctrlKey||event.metaKey||event.target?.matches?.('input,select,textarea'))return;
    event.preventDefault();if(!event.repeat)submit(action,true);
  });
  window.addEventListener('blur',()=>{audioBlurred=true;release();updateAudioState();});
  window.addEventListener('focus',()=>{audioBlurred=false;updateAudioState();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)release();updateAudioState();});
  window.addEventListener('pagehide',clearRun);
  async function boot() {
    const wanted=new URLSearchParams(location.hash.slice(1)).get('room');
    if(wanted) $('roomCode').value=wanted;
    record=recall('localStorage',saveKey);showRecord();
    try {
      if(!['http:','https:'].includes(location.protocol)) throw new Error();
      const response=await fetch('/room-version.js',{cache:'no-store'});
      if (!response.ok) throw new Error();
      const match=(await response.text()).match(/^window\.StrandRoomVersion="([0-9a-f]{20})"$/);
      if (!match) throw new Error();
      window.StrandRoomVersion=match[1];showRecord();
      $('entry').hidden=false;status('Relais connecté.');
      const saved=recall('sessionStorage',sessionKey);
      if (saved && (!wanted||wanted===saved.room)) await enter('join',saved.room);
    } catch {$('offline').hidden=false;status('');}
  }
  boot();
})();
