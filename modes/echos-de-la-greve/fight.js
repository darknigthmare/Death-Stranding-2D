/* StrandFight — standalone 2D duel engine. Simulation units are pixels and 60 Hz ticks. */
(function (host) {
  'use strict';

  const WIDTH = 1280, HEIGHT = 720, FLOOR = 588, STEP = 1000 / 60;
  const INK = '#081318', ICE = '#b5eaf0', AMBER = '#efba60';
  const TAU = Math.PI * 2;
  const cargoWidth = 42, cargoHeight = 21;
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const mix = (a, b, t) => a + (b - a) * t;
  const roster = {
    sam:     {name:'Sam Porter Bridges', short:'SAM', suit:'#365570', cloth:'#506e85', trim:'#ffad57', metal:'#a8c5cd', skin:'#c0947e', h:176, speed:4.4, power:1, move:'Bola de liaison', end:'Cargaison sécurisée'},
    higgs:   {name:'Higgs Monaghan', short:'HIGGS', suit:'#292936', cloth:'#46414b', trim:'#d8a34a', metal:'#ecd08b', skin:'#bd9a56', h:184, speed:4.05, power:1.06, move:'Marée noire', end:'Rideau de goudron'},
    fragile: {name:'Fragile', short:'FRAGILE', suit:'#283946', cloth:'#3f5362', trim:'#a9e6ee', metal:'#b2cbd0', skin:'#d0a28e', h:166, speed:4.95, power:0.94, move:'Pas de Grève', end:'Dernier saut'},
    cliff:   {name:'Cliff Unger', short:'CLIFF', suit:'#3c493d', cloth:'#59614c', trim:'#f09c66', metal:'#a5aa89', skin:'#bf9783', h:179, speed:4.2, power:1.03, move:'Écho de section', end:'Rappel de section'},
    mule:    {name:'Porteur MULE', short:'MULE', suit:'#9f7134', cloth:'#4f4536', trim:'#f5bd58', metal:'#a19c8a', skin:'#b59170', h:177, speed:4.25, power:1, move:'Balayage de capteur', end:'Hors inventaire'},
    diehardman:{name:'Die-Hardman', short:'DIE-HARDMAN', suit:'#282e32', cloth:'#485456', trim:'#b7c6b4', metal:'#a1a8a4', skin:'#7f5c4d', h:181, speed:4.1, power:1.02, move:'Ordre de maintien', end:'Levée de consigne'},
    mama:{name:'Mama', short:'MAMA', suit:'#495c66', cloth:'#617788', trim:'#80d9d4', metal:'#b6c4cd', skin:'#bc9a81', h:170, speed:4.4, power:.96, move:'Point d’ancrage', end:'Travée de retour'},
    heartman:{name:'Heartman', short:'HEARTMAN', suit:'#343f48', cloth:'#485869', trim:'#df9687', metal:'#a6b6bd', skin:'#c3a68e', h:176, speed:4.15, power:.96, move:'Impulsion témoin', end:'Intervalle'}
  };
  // An anchor is the horizontal midpoint between supporting feet in the source crop.
  const spriteGeometry = {
    sam: {stanceAnchor:.50, actionAnchor:.40, actionScale:.87, motionFrames:4, stepScale:1.12, hitScale:1.12},
    fragile: {stanceAnchor:.53, actionAnchor:.43, actionScale:.80, hitAnchor:.49, stepAnchor:.51, hitScale:.96, stepScale:.98},
    higgs: {stanceAnchor:.69, actionAnchor:.57, actionScale:1, hitAnchor:.63, stepAnchor:.58, hitScale:.96, stepScale:.98},
    cliff: {stanceAnchor:.50, actionAnchor:.35, actionScale:.78, motionFrames:4, stepScale:1.12, hitScale:1.12},
    heartman: {stanceAnchor:.50, actionAnchor:.29, actionScale:.99, hitAnchor:.53, stepAnchor:.50, hitScale:.92, stepScale:.97},
    mama: {stanceAnchor:.425, actionAnchor:.395, actionScale:.928, hitAnchor:.487, stepAnchor:.471, hitScale:.965, stepScale:1.015},
    diehardman: {stanceAnchor:.405, actionAnchor:.346, actionScale:.97, hitAnchor:.445, stepAnchor:.647, hitScale:.95, stepScale:.98},
    mule: {stanceAnchor:.59, actionAnchor:.39, actionScale:.86, hitAnchor:.45, stepAnchor:.52, hitScale:.92, stepScale:.97}
  };
  const stages = host.StrandContent?.arenas || {
    shore:{title:'La Grève', sky:'#668184', light:'#d3d0aa', weather:'rain'},
    terminal:{title:'Centre de distribution', sky:'#4e727e', light:'#a6d2d8', weather:'rain'},
    battlefield:{title:'Champ de bataille', sky:'#816e69', light:'#e2b58a', weather:'embers'}
  };
  // start, active and recover are counted separately. Reach extends from the fighter's center.
  const moves = {
    light:   {start:5, active:3, recover:10, reach:81, low:39, high:112, damage:5, balance:9, stun:12, push:5},
    heavy:   {start:14, active:4, recover:19, reach:111, low:63, high:152, damage:12, balance:20, stun:21, push:10},
    sweep:   {start:8, active:4, recover:16, reach:110, low:3, high:44, damage:7, balance:13, stun:16, push:7},
    lift:    {start:12, active:4, recover:22, reach:78, low:12, high:124, damage:10, balance:17, stun:22, push:4, launch:7},
    air:     {start:7, active:6, recover:15, reach:94, low:6, high:105, damage:8, balance:12, stun:15, push:7},
    grab:    {start:7, active:2, recover:24, reach:56, low:14, high:115, damage:10, balance:23, stun:21, push:13, grab:true},
    sam:     {start:16, active:1, recover:23, cost:28},
    higgs:   {start:25, active:5, recover:20, cost:28},
    fragile: {start:12, active:4, recover:18, reach:85, low:21, high:139, damage:13, balance:18, stun:20, push:9, cost:28},
    cliff:   {start:17, active:9, recover:21, cost:28},
    brace:   {name:"Reprise d’appui", start:8, active:6, recover:18, cost:14},
    parry:   {name:"Parade au lien", start:4, active:5, recover:25, cost:18},
    fan:     {name:"Éventail de pluie", start:11, active:4, recover:20, cost:18, reach:114, low:118, high:217, damage:9, balance:14, stun:18, push:5, launch:5},
    beacon:  {name:"Point de retour", start:15, active:1, recover:13, cost:16},
    mine:    {name:"Empreinte d’or", start:18, active:1, recover:16, cost:21},
    feint:   {name:"Faux départ", start:9, active:10, recover:20, cost:14},
    post:    {name:"Poste avancé", start:19, active:1, recover:15, cost:18},
    recall:  {name:"Rappel de section", start:12, active:1, recover:22, cost:16},
    mule:    {name:'Balayage de capteur', start:18, active:12, recover:17, cost:28},
    crate:   {name:'Consigne mobile', start:16, active:1, recover:18, cost:18},
    retrieve:{name:'Saisie de lot', start:13, active:3, recover:24, cost:16},
    diehardman:{name:'Ordre de maintien', start:11, active:5, recover:21, cost:28},
    gate:{name:'Ligne d’arrêt', start:17, active:6, recover:22, cost:18},
    relief:{name:'Relève', start:8, active:4, recover:16, cost:16, reach:77, low:48, high:109, damage:7, balance:14, stun:14, push:6},
    mama:{name:'Point d’ancrage', start:18, active:1, recover:16, cost:28},
    deck:{name:'Tablier', start:16, active:10, recover:21, cost:18},
    winch:{name:'Treuil', start:12, active:8, recover:15, cost:16},
    heartman:{name:'Impulsion témoin', start:15, active:16, recover:18, cost:28},
    memory:{name:'Mémoire de phase', start:14, active:1, recover:17, cost:18},
    syncope:{name:'Syncope du signal', start:10, active:6, recover:24, cost:16}
  };
  const directional = {
    sam:{forward:'brace',back:'parry'}, fragile:{forward:'fan',back:'beacon'},
    higgs:{forward:'mine',back:'feint'}, cliff:{forward:'post',back:'recall'},
    mule:{forward:'crate',back:'retrieve'}, diehardman:{forward:'gate',back:'relief'},
    mama:{forward:'deck',back:'winch'}, heartman:{forward:'memory',back:'syncope'}
  };
  const shotHit = {
    sam:{damage:10,balance:17,stun:26,push:3},
    higgs:{damage:14,balance:21,stun:23,push:6,launch:6},
    cliff:{damage:5,balance:9,stun:11,push:4},
    mine:{damage:6,balance:12,stun:15,push:5,level:'low'},
    recall:{damage:8,balance:15,stun:16,push:4,launch:7},
    crate:{damage:6,balance:11,stun:12,push:4,level:'low'},
    retrieve:{damage:7,balance:13,stun:14,push:4,level:'low'},
    gate:{damage:8,balance:16,stun:15,push:7}, deck:{damage:9,balance:16,stun:14,push:6},
    heartman:{damage:7,balance:12,stun:12,push:5}, memory:{damage:8,balance:15,stun:14,push:6}
  };
  const keyActions = ['left','right','up','down','light','heavy','special','guard','throw','finish'];
  let match, raf = 0, serial = 0, audio, noiseBuffer, sound = true;
  const voices=new Set();
  function playVoice(source,output,span,level,delay,attack) {
    const t=audio.currentTime+delay, volume=audio.createGain();
    volume.gain.setValueAtTime(.0001,t);
    volume.gain.exponentialRampToValueAtTime(level,t+Math.min(span*.45,attack));
    volume.gain.exponentialRampToValueAtTime(.0001,t+span);
    output.connect(volume); volume.connect(audio.destination);
    const voice={source,volume};
    voices.add(voice);
    source.onended=()=>{
      voices.delete(voice); source.disconnect(); output.disconnect(); volume.disconnect();
    };
    source.start(t); source.stop(t+span+.002);
  }
  function tone(hz,span,waveform='sine',gain=.035,end=hz,delay=0,attack=.009) {
    if (!sound || match?.silentResimulation || audio?.state!=='running') return;
    try {
      const t=audio.currentTime+delay, osc=audio.createOscillator();
      osc.type=waveform; osc.frequency.setValueAtTime(hz,t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(18,end),t+span);
      playVoice(osc,osc,span,gain,delay,attack);
    } catch (_) { /* Sound is optional. */ }
  }
  function friction(type,hz,end,span,gain,delay=0) {
    if (!sound || match?.silentResimulation || audio?.state!=='running') return;
    try {
      if (!noiseBuffer) {
        noiseBuffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*.4),audio.sampleRate);
        const samples=noiseBuffer.getChannelData(0), roll=randomSeed(0x4c2abf);
        for (let i=0;i<samples.length;i++) samples[i]=roll()*2-1;
      }
      const source=audio.createBufferSource(), filter=audio.createBiquadFilter(), t=audio.currentTime+delay;
      source.buffer=noiseBuffer;
      filter.type=type; filter.Q.value=.8;
      filter.frequency.setValueAtTime(hz,t); filter.frequency.exponentialRampToValueAtTime(end,t+span);
      source.connect(filter); playVoice(source,filter,span,gain,delay,.005);
    } catch (_) { /* Sound is optional. */ }
  }
  // Material and device cues share a lower peak level than the impact confirmation.
  function signatureSound(id) {
    switch (id) {
      case 'sam':
        friction('bandpass',780,2350,.095,.036);
        tone(1880,.026,'triangle',.029,480,.092,.002);
        break;
      case 'fragile':
        tone(2200,.016,'square',.014,960,0,.001);
        tone(2740,.023,'triangle',.021,1220,.021,.002);
        friction('highpass',1400,6200,.077,.024,.03);
        break;
      case 'higgs':
        friction('lowpass',520,125,.18,.046);
        tone(77,.12,'sine',.032,142);
        tone(460,.077,'sine',.035,89,.15,.003);
        break;
      case 'cliff':
        tone(1190,.017,'square',.021,714,0,.001);
        friction('bandpass',2050,1150,.17,.043,.018);
        break;
      case 'mule':
        tone(360,.067,'sawtooth',.015,1280);
        tone(940,.045,'sine',.027,1640,.091);
        break;
      case 'diehardman':
        tone(114,.065,'triangle',.035,61,0,.002);
        tone(690,.071,'square',.013,460,.055,.004);
        break;
      case 'mama':
        friction('bandpass',480,1500,.088,.03);
        tone(580,.093,'triangle',.027,1160,.028);
        tone(1740,.073,'sine',.017,1680,.11,.003);
        break;
      case 'heartman':
        tone(114,.066,'sine',.04,72,0,.004);
        tone(940,.075,'sine',.027,910,.093,.003);
        break;
    }
  }
  function wakeAudio() {
    if (!sound) return;
    try {
      if (!audio) { const Ctor=host.AudioContext || host.webkitAudioContext; if (Ctor) audio=new Ctor(); }
      if (audio && audio.state==='suspended') audio.resume().catch(()=>{});
    } catch (_) { /* Audio is optional. */ }
  }
  function randomSeed(seed) {
    const next = () => { seed=(Math.imul(1664525,seed)+1013904223)>>>0; return seed/4294967296; };
    next.state = () => seed;
    next.restore = value => { seed=value>>>0; };
    return next;
  }
  function fighterId(input, fallback) { const id=typeof input==='string'?input:input?.id; return roster[id]?id:fallback; }
  function fighter(id,x,face) {
    return {id, spec:roster[id], x, y:0, vx:0, vy:0, face, hp:100, balance:100, chiral:42, keys:{}, taps:{}, queue:[], act:null, marker:null,
      stun:0, blockStun:0, dash:0, drift:0, crouch:false, guard:false, flash:0, postHit:0, walk:0, combo:0, comboTTL:0, aiWait:0, grounded:true, lastMove:'', notice:'', noticeTTL:0};
  }
  function notify(m, force=false) {
    if (m.onStatus && (force || m.tick%12===0 || m.dummyTape && (m.training.timing || m.training.dummy==='record' && m.training.frames===1))) m.onStatus(snapshot());
  }
  const commonAttackNames={light:'Coup léger',heavy:'Coup lourd',sweep:'Balayage',lift:'Coup montant',air:'Frappe aérienne',grab:'Projection'};
  function trainingTiming(f) {
    const data=moves[f.lastMove];
    if (!data) return null;
    const frame=f.act?.t || 0;
    const phase=!frame ? 'Repos' : frame<data.start ? 'Démarrage' : frame<data.start+data.active ? 'Activité' : 'Récupération';
    return {name:data.name || commonAttackNames[f.lastMove] || f.spec.move,start:data.start,active:data.active,recover:data.recover,
      phase,frame,projectile:f.emission || 0,marker:f.marker?.ttl ?? null};
  }
  function snapshot() {
    const m=match; if (!m) return null;
    return {phase:m.phase, tick:m.tick, paused:m.paused, round:m.round, wins:m.wins.slice(), maxRounds:m.toWin, time:Math.ceil(m.remaining/60),
      stage:m.stage, mode:m.mode, parcel:m.parcel, beat:m.beat, winner:m.winner, finisher:m.finisher, fighters:m.f.map(f=>({id:f.id,hp:Math.ceil(f.hp),balance:Math.ceil(f.balance),chiral:Math.floor(f.chiral),combo:f.combo,x:f.x,y:f.y,guard:f.guard,action:f.act?.key || '',stun:f.stun,move:f.lastMove,marker:f.marker ? {...f.marker} : null,scan:f.scan ? {...f.scan} : null})), training:{...m.training,...(m.dummyTape && m.training.timing ? {moves:m.f.map(trainingTiming)} : {})}};
  }
  function validReplay(tape) {
    if (!tape || tape.version !== 1 || !Object.hasOwn(roster,tape.p1) || !Object.hasOwn(roster,tape.p2) ||
        !Object.hasOwn(stages,tape.stage) || !['cpu','local'].includes(tape.mode) ||
        !Number.isInteger(tape.seed) || tape.seed<0 || tape.seed>0xffffffff ||
        !Number.isInteger(tape.difficulty) || tape.difficulty<0 || tape.difficulty>2 ||
        !Number.isInteger(tape.roundsToWin) || tape.roundsToWin<1 || tape.roundsToWin>5 ||
        !Number.isSafeInteger(tape.ticks) || tape.ticks<1 || !Array.isArray(tape.events)) return false;
    let previous=0;
    return tape.events.every(event=>{
      if (!Array.isArray(event) || event.length!==2) return false;
      const [tick,code]=event;
      if (!Number.isSafeInteger(tick) || tick<previous || tick>=tape.ticks || !Number.isInteger(code) ||
          code < -1 || code >= keyActions.length*(tape.mode==='local' ? 4 : 2)) return false;
      previous=tick; return true;
    });
  }
  function start(o) {
    if (!o || !o.canvas || typeof o.canvas.getContext!=='function') throw new TypeError('StrandFight.start requires a canvas.');
    if (o.replay) {
      if (!validReplay(o.replay)) throw new Error('Enregistrement de duel incompatible.');
      const {p1,p2,stage,mode,difficulty,roundsToWin,seed}=o.replay;
      o={...o,p1,p2,stage,mode,difficulty,roundsToWin,seed};
    }
    stop(); const ctx=o.canvas.getContext('2d'); if (!ctx) throw new Error('Canvas 2D indisponible.');
    const stage=stages[o.stage]?o.stage:'shore', ids=[fighterId(o.p1,'sam'),fighterId(o.p2,'higgs')];
    const difficulty=({easy:0,facile:0,normal:1,medium:1,hard:2,difficile:2})[o.difficulty] ?? (Number.isInteger(o.difficulty)?clamp(o.difficulty,0,2):1);
    const seed=Number.isInteger(o.seed) ? o.seed>>>0 : 0x63cee17;
    const m={canvas:o.canvas,ctx,stage,ids,difficulty,mode:['cpu','local','training'].includes(o.mode)?o.mode:'cpu',toWin:clamp(Math.floor(Number(o.roundsToWin)||2),1,5),
      onEnd:typeof o.onEnd==='function'?o.onEnd:null,onStatus:typeof o.onStatus==='function'?o.onStatus:null,
      wins:[0,0], round:1, tick:0, beat:0, paused:false, phase:'intro', phaseTicks:72, remaining:75*60,
      f:ids.map((id,i)=>fighter(id,i?818:462,i?-1:1)), shots:[], sparks:[], hstop:0, shake:0, winner:0, finisher:false, reason:'',
      camera:0, images:{}, training:{dummy:'idle',hitboxes:false,...o.training}, sudden:false, scene:makeScenery(stage), simRandom:randomSeed(seed), particlesRandom:randomSeed(782), now:null, lag:0};
    if (m.mode==='training') {
      m.dummyTape={events:[],next:0};
      m.training.frames=0; m.training.position=0;
      if (m.training.dummy==='loop') m.training.dummy='idle';
    }
    m.networkClock=o.clock==='network' && m.mode==='local' && !o.replay;
    m.playback=o.replay || null;
    m.eventIndex=0;
    m.recording=o.record && !m.playback && m.mode!=='training' ? {
      version:1,p1:ids[0],p2:ids[1],stage,mode:m.mode,difficulty,seed,roundsToWin:m.toWin,events:[]
    } : null;
    if (Number.isFinite(o.startingVitality)) m.f[0].hp=clamp(Math.round(o.startingVitality),1,100);
    m.parcel = o.parcel ? 'intact' : null;
    match=m; const generation=++serial;
    const art = host.StrandAssets || {};
    const load = src => {
      if (!src || typeof src !== 'string') return src || null;
      const image = new Image();
      image.src = src;
      return image;
    };
    for (const id of new Set(ids)) {
      m.images[id] = load((o.visuals || {})[id] || art.fighters?.[id]);
      m.images[id + 'Action'] = load(art.actions?.[id]);
      m.images[id + 'Step'] = load(art.steps?.[id]);
      m.images[id + 'Hit'] = load(art.hits?.[id]);
      if (m.mode !== 'training') m.images[id + 'Finale'] = load(art.finishers?.[id]);
    }
    m.scene.back = load(art.stages?.[stage]);
    m.scene.front = load(art.foregrounds?.[stage]);
    if (ids.includes('mule') || m.parcel) m.images.cargo = load(art.props?.cargo);
    if (typeof o.sound==='boolean') setSound(o.sound);
    o.canvas.width=WIDTH; o.canvas.height=HEIGHT; wakeAudio(); draw(m); notify(m,true);
    function frame(t) {
      if (serial!==generation || match!==m) return;
      if (!m.paused) {
        m.lag+=m.now===null?0:clamp(t-m.now,0,90);
        while (m.lag>=STEP && serial===generation) { step(m); m.lag-=STEP; }
      }
      if (serial!==generation || match!==m) return;
      m.now=t; draw(m);
      if (m.phase!=='ended') raf=host.requestAnimationFrame(frame);
    }
    if (!m.networkClock) raf=host.requestAnimationFrame(frame);
    return snapshot();
  }
  function stop() { if (raf) host.cancelAnimationFrame(raf); raf=0; serial++; match=null; }
  function clearFighterControls(f) { f.queue=[]; f.keys={}; f.taps={}; f.guard=false; }
  function clearControls(m) { m.f.forEach(clearFighterControls); }
  function pause(on=true) {
    const m=match;
    if (!m) return;
    m.paused=!!on; m.now=null; m.lag=0;
    if (!m.playback) {
      if (m.recording) m.recording.events.push([m.tick,-1]);
      if (m.dummyTape && m.training.dummy==='record' && m.phase==='fight' && on)
        m.dummyTape.events.push([m.training.frames,null,false]);
      if (m.dummyTape && m.training.dummy==='loop') clearFighterControls(m.f[0]);
      else clearControls(m);
    }
    draw(m); notify(m,true);
  }
  function setTraining(options={}) {
    const m=match;
    if (!m?.dummyTape) return;
    const state=m.training, tape=m.dummyTape;
    if ('hitboxes' in options) state.hitboxes=!!options.hitboxes;
    if ('timing' in options) state.timing=!!options.timing;
    const nextMode=options.reset && state.dummy==='record' ? 'idle' : options.dummy;
    if (['idle','guard','cpu','record','loop'].includes(nextMode) && nextMode!==state.dummy) {
      // Events after the last simulated frame belong to neither end of the loop.
      if (state.dummy==='record') while (tape.events.length && tape.events.at(-1)[0]>=state.frames) tape.events.pop();
      if (nextMode!=='loop' || state.frames>0) {
        if (nextMode==='record') { tape.events=[]; state.frames=0; }
        state.dummy=nextMode; state.position=0; tape.next=0;
        clearFighterControls(m.f[1]);
      }
    }
    if (options.reset) {
      state.position=0; tape.next=0; m.round=0; m.camera=0; m.shake=0;
      resetRound(m);
    }
    notify(m,true);
  }
  function advanceDummyTape(m) {
    const state=m.training, tape=m.dummyTape;
    if (state.dummy==='record') { state.frames++; return; }
    if (state.dummy!=='loop') return;
    if (state.position===state.frames) {
      state.position=0; tape.next=0;
      clearFighterControls(m.f[1]);
    }
    while (tape.next<tape.events.length && tape.events[tape.next][0]===state.position) {
      const [,action,down]=tape.events[tape.next++];
      if (action===null) clearFighterControls(m.f[1]);
      else applyControl(m,2,action,down);
    }
    state.position++;
  }
  function setSound(on) {
    sound=!!on;
    if (sound) {wakeAudio(); return;}
    for (const {source,volume} of voices) {
      volume.disconnect();
      try {source.stop();} catch (_) { /* A source may already have ended. */ }
    }
    voices.clear();
  }
  function input(player,action,down=true) {
    const m=match;
    if (!m || m.phase==='ended' || m.paused || m.playback || ![1,2].includes(player) || !keyActions.includes(action)) return;
    if (player===2 && m.dummyTape) {
      if (m.training.dummy!=='record' || m.phase!=='fight' || !!m.f[1].keys[action]===!!down) return;
      m.dummyTape.events.push([m.training.frames,action,!!down]);
      applyControl(m,2,action,down);
      return;
    }
    if (player===2 && m.mode!=='local') return;
    if (m.recording && !!m.f[player-1].keys[action]!==!!down) {
      const code=((player-1)*keyActions.length+keyActions.indexOf(action))*2+Number(!!down);
      m.recording.events.push([m.tick,code]);
    }
    applyControl(m,player,action,down);
  }
  function applyControl(m,player,action,down) {
    const f=m.f[player-1]; if (down && !f.keys[action]) {
      wakeAudio();
      if (m.phase==='finish' && m.winner===player && action==='finish') activateFinish(m);
      if (m.phase==='fight') pushInput(m,f,action);
    }
    f.keys[action]=!!down;
  }
  function pushInput(m,f,action) {
    if (action==='left'||action==='right') {
      if (m.tick-(f.taps[action]??-999)<=13 && f.grounded && !f.stun && !f.act && !f.blockStun && !f.dash) {
        f.dash=12; f.drift=action==='right'?1:-1; f.taps={}; burst(m,f.x,FLOOR-3,ICE,4);
      } else f.taps[action]=m.tick;
    } else if (['up','light','heavy','special','throw'].includes(action)) {
      // Capture the direction on the button press, including a quick tap during recovery.
      const axis = Number(!!f.keys.right) - Number(!!f.keys.left);
      const foe = m.f[f === m.f[0] ? 1 : 0];
      const facing = Math.sign(foe.x - f.x) || f.face;
      const special = axis ? directional[f.id][axis === facing ? 'forward' : 'back'] : f.id;
      f.queue=f.queue.filter(q=>q.action!==action);f.queue.push({action,special,beat:m.beat,until:m.tick+9});
    }
  }
  const onMonitorBeat = beat => beat <= 3 || beat >= 57;
  function beginAttack(m,f,foe,key,beatAtInput) {
    if (key === 'winch' && f.marker?.kind !== 'anchor') {
      f.notice='AUCUN ANCRAGE'; f.noticeTTL=30; return;
    }
    if (key === 'retrieve' && (f.marker?.kind !== 'crate' || f.marker.travel === 'retrieve')) {
      f.notice = f.marker ? 'RAPPEL EN COURS' : 'AUCUNE CAISSE'; f.noticeTTL = 30;
      return;
    }
    const a=moves[key];if (a.cost && f.chiral<a.cost) {f.notice='CHIRAL INSUFFISANT';f.noticeTTL=42;return;}
    if (a.cost) {f.chiral-=a.cost;f.notice=(a.name || f.spec.move).toUpperCase();f.noticeTTL=50;signatureSound(f.id);}
    if (key === 'retrieve') f.marker.ttl = Math.max(f.marker.ttl, a.start + 1);
    f.face=foe.x>=f.x?1:-1; f.act={key,t:0,hit:false,target:clamp(foe.x,48,WIDTH-48),hitConfirmed:false};f.lastMove=key;
    if (m.dummyTape) f.emission=0;
    if (key === 'relief' && f.marker?.kind === 'seal') {
      f.act.extended = true;
      f.marker = null;
    }
    if (key === 'winch' || (key === 'memory' && f.marker?.kind === 'memory'))
      f.marker.ttl = Math.max(f.marker.ttl, a.start + 1);
    if (key === 'heartman') f.act.onBeat = onMonitorBeat(beatAtInput);
    if (key==='grab') tone(140,.07,'triangle',.025,85);
  }
  function actOnQueue(m,f,foe) {
    f.queue=f.queue.filter(q=>q.until>=m.tick);
    if (!f.queue.length || f.stun || f.blockStun || f.dash) return;
    const q=f.queue[0]; const a=f.act;
    if (a) {
      const canLink=a.hitConfirmed && a.t>=moves[a.key].start+moves[a.key].active && (
        (a.key==='light' && ['heavy','special'].includes(q.action)) || (['heavy','lift','sweep'].includes(a.key) && q.action==='special'));
      if (!canLink) return;
    }
    f.queue.shift();
    if (q.action==='up') {
      if (f.grounded && !f.act) {f.vy=14.5;f.grounded=false;f.crouch=false;f.guard=false;tone(110,.09,'sine',.02,170);}
      return;
    }
    if (!f.grounded && ['special','throw'].includes(q.action)) return;
    const key=q.action==='special'?q.special:q.action==='throw'?'grab':!f.grounded?'air':f.keys.down?(q.action==='heavy'?'lift':'sweep'):q.action;
    beginAttack(m,f,foe,key,q.beat);
  }
  function cpu(m,f,foe) {
    if (m.mode==='training' && m.training.dummy!=='cpu') {
      if (m.training.dummy==='idle' || m.training.dummy==='guard') f.keys={guard:m.training.dummy==='guard'};
      return;
    }
    if (--f.aiWait>0) return;
    const r=m.simRandom, d=m.difficulty, gap=Math.abs(f.x-foe.x), forward=foe.x>f.x?'right':'left', back=forward==='right'?'left':'right';
    f.aiWait=5+Math.floor(r()*(16-d*4));f.keys={};
    if (f.stun || f.blockStun) return;
    const threat=foe.act && gap<156 || m.shots.some(s=>s.owner===0 && Math.abs(s.x-f.x)<175);
    if (f.id === 'diehardman' && gap < 143 && ['light','heavy','lift'].includes(foe.act?.key) &&
        foe.act.t < moves[foe.act.key].start && f.chiral >= 28 && r() < .35 + .15*d) {
      pushInput(m,f,'special'); return;
    }
    if (f.id === 'diehardman' && gap >= 92 && gap < 144 && f.chiral >= moves.gate.cost && r() < .32) {
      f.keys[forward]=true; pushInput(m,f,'special'); return;
    }
    if (f.id === 'mama' && f.marker?.kind === 'anchor' && r() < .65) {
      const near = Math.abs(foe.x - f.marker.x) < 82;
      if (f.chiral >= (near ? moves.deck.cost : moves.winch.cost)) {
        f.keys[near ? forward : back] = true;
        pushInput(m,f,'special'); return;
      }
    }
    if (f.id === 'heartman' && gap < (onMonitorBeat(m.beat) ? 188 : 149) && gap > 91 &&
        f.chiral >= moves.heartman.cost && r() < .4) {
      pushInput(m,f,'special'); return;
    }
    if (f.id === 'heartman' && f.marker?.kind === 'memory' && Math.abs(f.marker.x-foe.x)<77 && f.chiral>=18) {
      f.keys[forward]=true; pushInput(m,f,'special'); return;
    }
    const lowCrate = foe.marker?.kind === 'crate' && foe.marker.travel && Math.abs(foe.marker.x - f.x) < 95;
    if ((threat || lowCrate) && r()<.38+d*.23) {f.keys.guard=true;f.keys.down=foe.act?.key==='sweep' || lowCrate;return;}
    if (f.id === 'mule' && f.marker?.kind === 'crate' && !f.marker.travel) {
      const crateAhead = (f.marker.x - f.x) * (foe.x >= f.x ? 1 : -1);
      if (crateAhead > gap && f.chiral >= moves.retrieve.cost) {
        f.keys[back] = true; pushInput(m,f,'special'); return;
      }
      if (crateAhead > 0 && crateAhead <= moves.heavy.reach && gap < crateAhead + 145) {
        pushInput(m,f,'heavy'); return;
      }
    }
    if (gap>122) {
      f.keys[forward]=true;
      if (gap>158 && gap<600 && f.chiral>=28 && f.id!=='diehardman' && f.id!=='heartman' && r()<.12+d*.04) {
        // Alternate deployment with a neutral projectile or approach.
        f.keys[forward]=['cliff','higgs','mule'].includes(f.id) && !f.marker && r()<.45;
        if (f.id==='cliff' && f.marker && Math.abs(foe.x-f.marker.x)<72) f.keys[back]=true;
        pushInput(m,f,'special');
      }
      else if (gap>230 && r()<.13) {f.dash=12;f.drift=forward==='right'?1:-1;}
      return;
    }
    if (foe.guard && gap<76 && r()<.53) pushInput(m,f,'throw');
    else {
      const roll=r();
      if (roll<.12) f.keys[back]=true;
      else if (roll<.22) {f.keys.guard=true;}
      else if (roll<.28) {f.keys[forward]=true;pushInput(m,f,'up');}
      else if (roll<.45 && f.chiral>=28) {
        if (d && r()<.55) {
          const deploy = (f.id === 'mule' && !f.marker) || r()<.5;
          f.keys[deploy ? forward : back]=true;
        }
        pushInput(m,f,'special');
      }
      else {f.keys[forward]=gap>76;f.keys.down=r()<.16;pushInput(m,f,roll>.72?'heavy':'light');}
    }
  }
  function updateFighter(m,f,o,index) {
    f.flash=Math.max(0,f.flash-1);f.postHit=Math.max(0,f.postHit-1);
    if (f.comboTTL>0 && --f.comboTTL===0) f.combo=0;
    if(f.noticeTTL>0) f.noticeTTL--;
    if (f.marker && f.marker.travel !== 'retrieve' && --f.marker.ttl <= 0) f.marker=null;
    if (f.scan && --f.scan.ttl <= 0) f.scan = null;
    if (f.stun>0) f.stun--; if(f.blockStun>0) f.blockStun--;
    if (!f.act && !f.stun && !f.dash) f.face=o.x>=f.x?1:-1;
    actOnQueue(m,f,o);
    f.guard=!!f.keys.guard && f.grounded && !f.act && !f.stun && !f.dash;
    f.crouch=!!f.keys.down && f.grounded && !f.dash && !f.stun;
    const walk=Number(!!f.keys.right)-Number(!!f.keys.left);
    if (f.dash>0) {f.x+=f.drift*(2+f.dash*.74);f.dash--;}
    else if (!f.stun && !f.blockStun && !f.act && !f.guard && !f.crouch) {
      const delta=walk*f.spec.speed*(f.grounded?1:.78);f.x+=delta;f.walk+=Math.abs(delta)*.065;
    }
    if (f.act) {
      const a=f.act, d=moves[a.key]; a.t++;
      if (a.key==='fragile' && a.t===8) {
        burst(m,f.x,FLOOR-78,ICE,18);f.x+=f.face*Math.min(158,Math.max(0,Math.abs(o.x-f.x)-52));burst(m,f.x,FLOOR-72,ICE,18);
      }
      if (directional[f.id].forward === a.key || directional[f.id].back === a.key)
        stepDirectional(m, f, index, a, d);
      if (a.key==='heavy' && a.t===d.start-3) f.x+=f.face*(f.id === 'diehardman' ? 6 : 12);
      if (a.key === 'mama' && a.t === d.start) {
        f.marker = {kind:'anchor', x:clamp(f.x + f.face * 130, 48, WIDTH-48), ttl:200};
        tone(530,.1,'sine',.025,720);
      }
      if (a.key === 'heartman' && a.t === d.start) {
        const speed = a.onBeat ? 10 : 7.5;
        makeShot(m,index,'heartman',f.x,FLOOR-83,f.face*speed,16);
        tone(a.onBeat ? 660 : 390,.12,'sine',.032,260);
      }
      if (a.key === 'relief' && a.t < d.start) f.x -= f.face * 2.5;
      if (a.key === 'winch' && a.destination !== undefined && a.t >= d.start && a.t < d.start + d.active) {
        const remaining = d.start + d.active - a.t;
        f.x += (a.destination - f.x) / remaining;
      }
      if (a.key === 'heavy' && a.t === d.start && f.marker?.kind === 'crate' && !f.marker.travel) {
        const reach = (f.marker.x - f.x) * f.face;
        if (reach >= -12 && reach <= d.reach) {
          Object.assign(f.marker, {travel:'crate', endX:clamp(f.marker.x + 112 * f.face, 48, WIDTH-48), hit:false});
        }
      }
      if (a.key==='sam' && a.t===d.start) makeShot(m,index,'sam',f.x+f.face*37,FLOOR-f.y-87,f.face*12,76);
      if (a.key==='higgs' && a.t===d.start) makeShot(m,index,'higgs',a.target,FLOOR-49,0,6);
      if (a.key==='cliff' && [d.start,d.start+8].includes(a.t)) makeShot(m,index,'cliff',f.x+f.face*36,FLOOR-f.y-(a.t===d.start?97:53),f.face*13,62);
      if (a.t>d.start+d.active+d.recover) f.act=null;
    }
    f.x=clamp(f.x+f.vx,48,WIDTH-48);f.vx*=.78;
    if (f.y>0 || f.vy!==0 || !f.grounded) {
      f.y+=f.vy;f.vy-=.77;
      if (f.y<=0) {if(f.vy<-6) burst(m,f.x,FLOOR-4,stages[m.stage].light,5);f.y=0;f.vy=0;f.grounded=true;}
    }
    f.chiral=clamp(f.chiral+(m.mode==='training'?.34:.025),0,100);
    if (!f.postHit && !f.guard && !f.stun && !f.act) f.balance=clamp(f.balance+.28,0,100);
  }
  function stepDirectional(m, f, owner, action, move) {
    if (action.t === move.start) {
      switch (action.key) {
        case 'gate':
          makeShot(m, owner, 'gate', clamp(f.x + f.face*108, 48, WIDTH-48), FLOOR-72, 0,
            move.active + (f.marker?.kind === 'seal' ? 2 : 0));
          break;
        case 'deck': {
          const anchored = f.marker?.kind === 'anchor';
          makeShot(m,owner,'deck',anchored ? f.marker.x : f.x,FLOOR-76,f.face*(anchored ? 7.2 : 3.6),move.active);
          break;
        }
        case 'winch':
          action.destination = f.marker.x;
          f.marker = null;
          break;
        case 'memory':
          if (f.marker?.kind === 'memory') {
            makeShot(m,owner,'memory',f.marker.x,FLOOR-64,0,8);
            f.marker = null;
          } else f.marker = {kind:'memory',x:f.x,ttl:120};
          break;
        case 'brace': case 'parry': case 'fan':
          burst(m, f.x + f.face * 25, FLOOR - (action.key === 'fan' ? 130 : 75), ICE, 8);
          break;
        case 'beacon':
          if (f.marker) {
            burst(m, f.x, FLOOR - 45, ICE, 15);
            f.x = f.marker.x;
            f.marker = null;
            burst(m, f.x, FLOOR - 45, ICE, 15);
          } else f.marker = {kind:'beacon', x:f.x, ttl:180};
          break;
        case 'mine':
          f.marker = {kind:'mine', x:clamp(f.x + f.face * 55, 48, WIDTH - 48), ttl:150};
          break;
        case 'post':
          f.marker = {kind:'post', x:clamp(f.x + f.face * 165, 48, WIDTH - 48), ttl:160};
          break;
        case 'crate':
          f.marker = {kind:'crate', x:clamp(f.x + f.face * 86, 48, WIDTH-48), ttl:180, travel:null, hit:false};
          tone(225,.07,'triangle',.03,160);
          break;
        case 'retrieve':
          if (f.marker?.kind === 'crate') Object.assign(f.marker, {travel:'retrieve', hit:false});
          break;
        case 'recall':
          if (f.marker) {
            makeShot(m, owner, 'recall', f.marker.x, FLOOR - 15, 0, 6);
            f.marker = null;
          } else {
            f.notice = 'AUCUN POSTE'; f.noticeTTL = 30;
            tone(175,.045,'square',.018);
          }
          break;
        case 'feint':
          action.origin = f.x;
          burst(m, f.x, FLOOR - 55, AMBER, 7);
          break;
      }
    }
    if (action.key === 'feint' && action.t >= move.start && action.t < move.start + move.active)
      f.x -= f.face * 5.25;
  }
  function makeShot(m,owner,kind,x,y,vx,ttl) {
    m.shots.push({owner,kind,x,y,vx,ttl,age:0});
    if (m.dummyTape) m.f[owner].emission=ttl;
  }
  function hurt(f) {
    const h=f.spec.h*(f.crouch?.62:1), y=FLOOR-f.y;
    return {l:f.x-22,r:f.x+22,t:y-h,b:y};
  }
  function strike(f) {
    const a=f.act; if (!a) return null;
    const d=moves[a.key]; if (!d.reach || a.t<d.start || a.t>=d.start+d.active || a.hit) return null;
    const x=f.x+f.face*(d.reach + (a.extended ? 44 : 0)), y=FLOOR-f.y;
    return {l:Math.min(f.x,x),r:Math.max(f.x,x),t:y-d.high,b:y-d.low};
  }
  const intersects=(a,b)=>a.l<b.r && a.r>b.l && a.t<b.b && a.b>b.t;
  function immune(f) {return f.dash>=4 && f.dash<=8 || (f.act?.key==='syncope' && f.act.t>=10 && f.act.t<16) || (f.act?.key==='fragile' && f.act.t>=6 && f.act.t<=10);}
  function intercept(m, defender, attacker, kind, melee) {
    const defense = defender.act;
    if (!melee || !defense || defense.hit || !['brace','parry','diehardman'].includes(defense.key)) return false;
    const move = moves[defense.key];
    if (defense.t < move.start || defense.t >= move.start + move.active || kind === 'grab') return false;
    if (defense.key === 'diehardman') {
      if (!['light','heavy','lift','relief','fragile'].includes(kind)) return false;
      defender.marker = {kind:'seal',ttl:120};
      defender.notice = 'SCEAU ACCORDÉ';
      attacker.stun = Math.max(attacker.stun, 26);
      attacker.act = null;
    } else if (defense.key === 'brace') {
      if (kind !== 'light') return false;
      defender.notice = 'APPUI STABLE';
    } else {
      [defender.x, attacker.x] = [attacker.x, defender.x];
      defender.face = Math.sign(attacker.x - defender.x) || -defender.face;
      attacker.face = -defender.face;
      attacker.stun = Math.max(attacker.stun, 15);
      attacker.act = null;
      defender.notice = 'PARADE';
    }
    defense.hit = true;
    defender.noticeTTL = 30;
    m.hstop = Math.max(m.hstop, 3);
    burst(m, defender.x, FLOOR - 90, ICE, 13);
    tone(460,.10,'triangle',.035,250);
    return true;
  }
  function hit(m,attacker,victim,kind,d,face) {
    const grab=!!d.grab, blocked=victim.guard && !grab && ((kind!=='sweep' && d.level!=='low') || victim.crouch) && (kind!=='air' || !victim.crouch);
    const damage=Math.round(d.damage*attacker.spec.power);
    if (!blocked && m.parcel === 'intact' && victim === m.f[0]) {
      m.parcel='broken'; victim.notice='SCELLÉ ROMPU'; victim.noticeTTL=75;
    }
    victim.hp=clamp(victim.hp-(blocked?0:damage),0,100);
    victim.balance=clamp(victim.balance-d.balance*(blocked?1.25:.76),0,100);victim.postHit=58;
    attacker.chiral=clamp(attacker.chiral+(blocked?2:4),0,100);victim.chiral=clamp(victim.chiral+(blocked?2:3),0,100);
    victim.vx+=face*d.push*(blocked?.44:1);let shattered=false;
    if (blocked) {victim.blockStun=Math.max(victim.blockStun,9);tone(330,.075,'square',.019,110);}
    else {
      victim.stun=Math.max(victim.stun,d.stun);victim.act=null;victim.dash=0;victim.flash=7;victim.guard=false;attacker.combo++;attacker.comboTTL=d.stun+18;
      if (d.launch) {victim.vy=d.launch;victim.grounded=false;}
      tone(d.damage>8?103:160,.11,'triangle',.065,38);
    }
    if (victim.balance<=0) {
      shattered=true;victim.stun=Math.max(victim.stun,38);victim.blockStun=0;victim.guard=false;victim.balance=36;victim.act=null;
      victim.notice='ÉQUILIBRE ROMPU';victim.noticeTTL=64;tone(380,.28,'triangle',.035,56);
    }
    m.hstop=Math.max(m.hstop,blocked?2:d.damage>=10?6:3);m.shake=Math.max(m.shake,blocked?2:grab?8:d.damage*.48);
    burst(m,victim.x-face*16,FLOOR-victim.y-(kind==='sweep'?30:victim.crouch?60:90),blocked?ICE:shattered?AMBER:'#fff2c9',blocked?8:14);
    return !blocked;
  }
  function contacts(m) {
    const bodies=m.f.map(hurt), events=[];
    m.f.forEach((f,i)=>{
      const rect=strike(f), o=m.f[1-i], a=f.act;
      if (rect && !immune(o) && intersects(rect,bodies[1-i]) && !(a.key==='grab' && (!o.grounded || o.stun))) {
        a.hit=true;events.push({i,d:moves[a.key],a,kind:a.key,face:f.face});
      }
    });
    for (const s of m.shots) {
      s.age++;s.x+=s.vx;s.ttl--;
      if (s.kind==='recall') s.y-=16;
      const o=m.f[1-s.owner], rx=s.kind==='higgs'?43:s.kind==='recall'?46:s.kind==='memory'?66:s.kind==='gate'?18:13,
        ry=s.kind==='higgs'?51:s.kind==='gate'?72:s.kind==='memory'?45:9;
      if (!immune(o) && intersects({l:s.x-rx,r:s.x+rx,t:s.y-ry,b:s.y+ry},bodies[1-s.owner])) {
        events.push({i:s.owner,d:shotHit[s.kind],kind:s.kind,face:s.vx?Math.sign(s.vx):Math.sign(o.x-m.f[s.owner].x)||1});s.ttl=0;
      }
    }
    m.f.forEach((f,i) => {
      const mark = f.marker, opponent = m.f[1-i];
      if (f.act?.key === 'mule') {
        const action = f.act, waveFrame = action.t - moves.mule.start;
        if (waveFrame >= 0 && waveFrame < moves.mule.active && !action.hit) {
          const distance = Math.abs(opponent.x - f.x);
          const radius = (waveFrame + 1) * 38;
          if (distance >= radius - 61 && distance <= radius + 22 && !immune(opponent)) {
            action.hit = true;
            if (opponent.guard) {
              tone(160,.10,'triangle',.024,135);
              f.notice = 'SCAN BLOQUÉ'; f.noticeTTL = 36;
            } else {
              f.scan = {x:opponent.x, ttl:120};
              tone(570,.085,'sine',.036,760);
            }
          }
        }
      }
      if (mark?.kind === 'crate' && mark.travel) {
        const from = mark.x, recalling = mark.travel === 'retrieve';
        const to = recalling ? f.x : mark.endX;
        const speed = recalling ? 14 : 10;
        mark.x += clamp(to - from, -speed, speed);
        const path = {l:Math.min(from,mark.x)-cargoWidth/2, r:Math.max(from,mark.x)+cargoWidth/2, t:FLOOR-cargoHeight, b:FLOOR};
        if (!mark.hit && !immune(opponent) && intersects(path,bodies[1-i])) {
          mark.hit = true;
          events.push({i, d:shotHit[mark.travel], kind:mark.travel, face:Math.sign(to-from) || f.face});
        }
        if (mark.x === to) {
          if (recalling) f.marker = null;
          else mark.travel = null;
        }
      }
      if (mark?.kind !== 'mine' || mark.ttl > 130 || immune(opponent)) return;
      if (intersects({l:mark.x-22,r:mark.x+22,t:FLOOR-23,b:FLOOR+1}, bodies[1-i])) {
        events.push({i, d:shotHit.mine, kind:'mine', face:Math.sign(opponent.x-mark.x) || f.face});
        burst(m,mark.x,FLOOR-9,AMBER,14);
        f.marker = null;
      }
    });
    m.shots=m.shots.filter(s=>s.ttl>0 && s.x>-60 && s.x<WIDTH+60);
    // Collect both fighters' contacts before applying hitstun so equal-frame strikes can trade.
    for (const e of events) {
      const attacker = m.f[e.i], defender = m.f[1-e.i];
      if (intercept(m, defender, attacker, e.kind, !!e.a)) continue;
      const ok = hit(m, attacker, defender, e.kind, e.d, e.face);
      if (e.a) e.a.hitConfirmed = ok;
    }
  }
  function resetRound(m) {
    m.round++;m.beat=0;m.winner=0;m.phase='intro';m.phaseTicks=66;m.remaining=75*60;m.sudden=false;m.hstop=0;m.shots=[];m.sparks=[];
    m.f=m.ids.map((id,i)=>fighter(id,i?818:462,i?-1:1));notify(m,true);
  }
  function winRound(m,index,reason) {
    m.winner=index+1;m.wins[index]++;m.reason=reason;
    m.phase=m.wins[index]>=m.toWin && reason==='ko'?'finish':'roundover';m.phaseTicks=m.phase==='finish'?135:96;
    m.shots=[];clearControls(m);m.f.forEach(f=>{f.marker=null;f.scan=null;f.act=null;f.stun=0;f.crouch=false;});tone(145,.35,'sine',.045,71);notify(m,true);
  }
  function activateFinish(m) {
    if(m.phase!=='finish')return;
    m.finisher=true;m.phase='cinema';m.phaseTicks=108;m.shake=6;
    const f=m.f[m.winner-1],v=m.f[2-m.winner];
    f.face=v.x>=f.x?1:-1;burst(m,v.x,FLOOR-68,f.spec.trim,35);tone(220,.62,'sine',.06,55);notify(m,true);
  }
  function finishMatch(m) {
    m.phase='ended';notify(m,true);
    if (m.onEnd) {
      const result={vitality:Math.ceil(m.f[0].hp),parcel:m.parcel,winner:m.winner,loser:3-m.winner,rounds:m.wins.slice(),reason:m.reason,finisher:m.finisher,stage:m.stage,fighters:m.ids.slice()};
      if (m.recording) result.replay={...m.recording,events:m.recording.events.slice(),ticks:m.tick};
      if (m.playback && m.tick!==m.playback.ticks) result.replayMismatch=true;
      m.onEnd(result);
    }
  }
  function step(m) {
    if (m.phase==='ended') return;
    if (m.playback) {
      const events=m.playback.events;
      while (m.eventIndex<events.length && events[m.eventIndex][0]===m.tick) {
        const code=events[m.eventIndex++][1];
        if (code===-1) clearControls(m);
        else {
          const index=Math.floor(code/2);
          applyControl(m,1+Math.floor(index/keyActions.length),keyActions[index%keyActions.length],!!(code%2));
        }
      }
      if (m.tick>=m.playback.ticks) {
        m.phase='ended';
        m.onEnd?.({replayMismatch:true});
        return;
      }
    }
    if (m.dummyTape && m.phase==='fight') advanceDummyTape(m);
    m.tick++;m.shake*=.85;
    for (const p of m.sparks) {p.x+=p.vx;p.y+=p.vy;p.vy+=.14;p.ttl--;}
    m.sparks=m.sparks.filter(p=>p.ttl>0);
    if (m.phase!=='fight') {
      m.phaseTicks--;
      if (m.phase==='intro' && m.phaseTicks<=0) {m.phase='fight';tone(520,.13);notify(m,true);}
      else if(m.phase==='finish' && m.mode!=='local' && m.winner===2 && m.phaseTicks===84) activateFinish(m);
      else if (['finish','cinema','roundover'].includes(m.phase) && m.phaseTicks<=0) {
        if (m.wins.some(w=>w>=m.toWin)) finishMatch(m);else resetRound(m);
      }
      return;
    }
    if (m.hstop>0) {m.hstop--;return;}
    m.beat = (m.beat + 1) % 60;
    if (m.mode!=='local') cpu(m,m.f[1],m.f[0]);
    const [a,b]=m.f;updateFighter(m,a,b,0);updateFighter(m,b,a,1);
    const delta=b.x-a.x, overlap=44-Math.abs(delta);
    if(overlap>0 && Math.abs(a.y-b.y)<105) {
      const dir=delta>=0?1:-1;a.x=clamp(a.x-dir*overlap/2,48,WIDTH-48);b.x=clamp(b.x+dir*overlap/2,48,WIDTH-48);
    }
    contacts(m);m.camera=mix(m.camera,clamp(((a.x+b.x)/2-WIDTH/2)/3,-96,96),.035);
    if(m.mode==='training') {
      for(const f of m.f) if(f.hp<=0){f.hp=100;f.balance=100;f.chiral=100;f.notice='VITALITÉ RÉTABLIE';f.noticeTTL=70;}
    } else {
      m.remaining=Math.max(0,m.remaining-1);
      if ((a.hp<=0 && b.hp<=0) || (!m.remaining && a.hp===b.hp)) {
        m.sudden=true;a.hp=1;b.hp=1;m.remaining=15*60;m.shots=[];a.x=462;b.x=818;
        for(const f of m.f) {f.marker=null;f.act=null;f.stun=0;f.queue=[];f.vx=0;f.vy=0;f.y=0;f.grounded=true;f.notice='PROCHAIN IMPACT DÉCISIF';f.noticeTTL=85;}
      } else if (a.hp<=0 || b.hp<=0) winRound(m,a.hp>0?0:1,'ko');
      else if (!m.remaining) winRound(m,a.hp>b.hp?0:1,'time');
    }
    notify(m);
  }

  function makeScenery(stage) {
    const pick = randomSeed(stage.charCodeAt(0) * 79);
    const rain = Array.from({length: 60}, () => ({x: pick() * 1536, y: pick() * HEIGHT, speed: 2 + pick() * 4}));
    return {rain, back: null, front: null};
  }

  function burst(m, x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = m.particlesRandom() * TAU, speed = 1 + m.particlesRandom() * 5;
      m.sparks.push({x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 1,
        ttl: 12 + m.particlesRandom() * 13, color});
    }
  }

  function ready(image) {
    return image && image.complete && image.naturalWidth > 0;
  }

  function line(ctx, x, y, xx, yy, color, width = 1) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
    ctx.stroke();
  }

  function oval(ctx, x, y, rx, ry, fill) {
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), 0, 0, TAU);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  function label(ctx, value, x, y, size, color, align = 'left', bold = true) {
    ctx.font = (bold ? '700 ' : '400 ') + size + 'px Arial, sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.fillText(value, x, y);
  }

  function scenery(m) {
    const c = m.ctx, s = m.scene, theme = stages[m.stage];
    c.fillStyle = theme.sky;
    c.fillRect(0, 0, WIDTH, HEIGHT);
    if (ready(s.back)) {
      c.drawImage(s.back, -28 - m.camera * .14, -12, WIDTH + 56, HEIGHT + 24);
    }
    const shade = c.createLinearGradient(0, HEIGHT * .45, 0, HEIGHT);
    shade.addColorStop(0, 'rgba(2,12,17,0)');
    shade.addColorStop(1, 'rgba(2,12,17,.42)');
    c.fillStyle = shade;
    c.fillRect(0, 0, WIDTH, HEIGHT);
    if (!theme.weather) return;
    const flakes = theme.weather === 'snow';
    const dust = theme.weather === 'dust';
    const embers = theme.weather === 'embers';
    c.beginPath();
    for (const drop of s.rain) {
      const drift = flakes ? Math.sin(m.tick * .025 + drop.x) * 14 : 0;
      const x = ((drop.x - m.camera * .38 - m.tick * .38 + drift) % 1536 + 1536) % 1536 - 128;
      const speed = dust || flakes ? drop.speed * .24 : drop.speed;
      const y = (drop.y + m.tick * speed) % HEIGHT;
      if (theme.weather === 'shelter' && x > WIDTH * .18 && x < WIDTH * .88) continue;
      c.moveTo(x, y);
      c.lineTo(x - (dust ? 3 : 1), y + (dust ? 0 : flakes ? 1 : drop.speed));
    }
    c.lineWidth = flakes ? 2 : 1;
    c.strokeStyle = embers || dust ? 'rgba(251,210,151,.28)' : 'rgba(207,226,224,.28)';
    c.stroke();
  }

  function foreground(m) {
    const c = m.ctx;
    if (ready(m.scene.front)) {
      const width = WIDTH + 160;
      const height = width * m.scene.front.naturalHeight / m.scene.front.naturalWidth;
      c.drawImage(m.scene.front, -80 - m.camera * .8, HEIGHT - height, width, height);
    } else {
      // Near silhouettes stay below the fighting lane and move faster than the backdrop.
      const x = -m.camera * .76;
      c.save();
      c.translate(x, 0);
      if (m.stage === 'terminal') {
        for (const start of [-154, 1164]) {
          c.fillStyle = '#19252be8';
          c.fillRect(start, 659, 252, 77);
          c.fillStyle = '#344246';
          c.fillRect(start, 655, 252, 6);
          for (let i = 1; i <= 7; i++) line(c, start+i*32, 662, start+i*32-28, 716, '#465050', 4);
        }
      } else {
        for (const start of [-82, 1180]) {
          line(c, start, 725, start+63, 639, '#172024', 10);
          line(c, start+18, 640, start+86, 725, '#1c2324', 8);
          line(c, start-52, 668, start+148, 686, '#303330', 2);
        }
      }
      c.restore();
    }
  }

  function drawFighter(m, f, index) {
    const c = m.ctx, feet = FLOOR - f.y;
    const act = f.act, actionArt = m.images[f.id + 'Action'];
    const movement = m.phase === 'fight' && f.grounded && !f.act && !f.guard && !f.stun &&
      !f.blockStun && !f.crouch && (f.dash || !!f.keys.left !== !!f.keys.right);
    const phase = act ? act.t / (moves[act.key].start + moves[act.key].active + moves[act.key].recover) : 0;
    const reach = act ? Math.sin(Math.PI * Math.min(1, Math.max(0, phase))) : 0;
    const performing = act && act.t >= moves[act.key].start * .61 && phase < .85;
    let pose = 'stance';
    let image = m.images[f.id];
    const hitArt = m.images[f.id + 'Hit'];
    const stepArt = m.images[f.id + 'Step'];
    if (f.stun > 0 && ready(hitArt)) {
      pose = 'hit';
      image = hitArt;
    } else if (performing && ready(actionArt)) {
      pose = 'action';
      image = actionArt;
    } else if (movement && (f.dash || Math.sin(f.walk) >= 0) && ready(stepArt)) {
      pose = 'step';
      image = stepArt;
    }
    const lost = m.winner && m.winner !== index + 1 && ['finish','cinema','roundover','ended'].includes(m.phase);
    const compression = f.crouch ? .69 : f.guard ? .93 : lost ? .84 : 1;
    const breathing = movement ? 2.1 * Math.sin(f.walk) : 1.1 * Math.sin(m.tick * .055 + index);
    const height = f.spec.h * compression + breathing;
    oval(c, f.x, FLOOR + 1, Math.max(11, 29 - f.y * .08), 4.3, 'rgba(4,11,14,.54)');
    c.save();
    c.translate(f.x, feet);
    c.scale(f.face, 1);
    const sway = f.stun ? -.12 : lost ? -.09 : f.guard ? -.07 : f.dash ? .16 : movement ? .035 * Math.sin(f.walk) : 0;
    c.rotate(sway + (performing ? .025 : .12) * reach);
    if (immune(f)) c.globalAlpha = f.act?.key === 'syncope' ? .14 : .63;
    if (ready(image)) {
      const geometry = spriteGeometry[f.id];
      const h = height * (geometry[pose + 'Scale'] || 1);
      const frames = (pose === 'step' || pose === 'hit') ? geometry.motionFrames || 1 : 1;
      const srcWidth = image.naturalWidth / frames;
      const w = h * srcWidth / image.naturalHeight;
      const anchor = geometry[pose + 'Anchor'] ?? geometry.stanceAnchor;
      if (f.flash > 1 && (f.flash % 4 < 2)) c.filter = 'brightness(1.5)';
      const weight = pose === 'hit' ? Math.min(1, f.stun / 8) : f.dash ? 1 : Math.sin(f.walk);
      const frame = clamp(Math.ceil(weight * frames)-1,0,frames-1);
      c.drawImage(image,frame * srcWidth,0,srcWidth,image.naturalHeight,-w * anchor + 9 * reach,-h,w,h);
    } else {
      // A temporary silhouette fills the same collision space during image decoding.
      c.fillStyle = f.spec.suit;
      c.fillRect(-14,-height+26,28,height*.58);
      oval(c,0,-height+16,12,16,f.spec.skin);
      line(c,-7,-height*.36,-17,-2,f.spec.suit,12);
      line(c,7,-height*.36,18,-2,f.spec.suit,12);
    }
    c.restore();
    if (m.parcel && index===0 && ready(m.images.cargo)) {
      c.save(); c.translate(f.x-f.face*13,feet-height*.44); c.rotate(f.face * (m.parcel==='broken' ? .24 : -.06));
      c.drawImage(m.images.cargo,-16,-14,32,16); c.restore();
    }
    if (act?.key === 'feint' && act.origin !== undefined && act.t < moves.feint.start + moves.feint.active) {
      const elapsed = act.t - moves.feint.start;
      const echoX = act.origin + f.face * elapsed * 3;
      c.save();
      c.globalAlpha = .34 * (1 - elapsed / 12);
      c.translate(echoX, feet);
      c.scale(f.face, 1);
      if (ready(image)) {
        const width = height * image.naturalWidth / image.naturalHeight;
        c.drawImage(image, -width / 2, -height, width, height);
      } else {
        oval(c,0,-height+14,12,14,AMBER);
        line(c,0,-height+30,-7,-23,AMBER,15);
      }
      c.restore();
    }
    if (act?.key === 'fan' && strike(f)) {
      c.save(); c.translate(f.x, feet - 100); c.scale(f.face,1);
      c.beginPath(); c.arc(5,0,103,-1.2,-.18); c.strokeStyle=ICE; c.lineWidth=3; c.stroke();
      c.restore();
    }
    if (f.guard) {
      c.beginPath();
      c.strokeStyle = f.blockStun ? '#d9ffff' : 'rgba(150,218,226,.55)';
      c.lineWidth = f.blockStun ? 3 : 1;
      c.ellipse(f.x + f.face * 12, feet - height * .51, 32, height * .37, 0,
        f.face > 0 ? -1.13 : 2.01, f.face > 0 ? 1.13 : 4.27);
      c.stroke();
    }
    if (act && performing && ['sweep','lift','heavy','light','air','grab'].includes(act.key)) {
      const heightOffset = act.key === 'sweep' ? 20 : act.key === 'lift' ? 100 : 83;
      const length = moves[act.key].reach;
      line(c, f.x + f.face * length * .57, feet - heightOffset + 3,
        f.x + f.face * length, feet - heightOffset, 'rgba(225,238,232,.45)', 1.5);
    }
    if (f.noticeTTL > 0) label(c, f.notice, f.x, feet - height - 12, 10, '#fff0b6', 'center');
    if (f.combo > 1 && f.comboTTL) label(c, f.combo + ' COUPS', f.x, feet - height - 27, 13, 'white', 'center');
  }

  function pulseTrace(c,x,y,w,h,color) {
    c.beginPath(); c.moveTo(x-w,y); c.lineTo(x-w*.35,y); c.lineTo(x-w*.14,y+h*.32);
    c.lineTo(x,y-h); c.lineTo(x+w*.18,y+h*.55); c.lineTo(x+w*.38,y);
    c.lineTo(x+w,y); c.strokeStyle=color; c.lineWidth=2; c.stroke();
  }

  function effects(m) {
    const c = m.ctx;
    for (const f of m.f) {
      if (f.id === 'heartman') {
        const lit = onMonitorBeat(m.beat);
        const y = FLOOR-f.y+12;
        pulseTrace(c,f.x,y,24,lit ? 10 : 3,lit ? '#ffe7b5' : '#dca696');
        oval(c,f.x-24+m.beat*48/60,y,2,2,'#ffe4bd');
        if (f.act?.key === 'syncope' && immune(f))
          line(c,f.x-21,FLOOR-2,f.x+21,FLOOR-2,'#ffdec1',3);
      }
      if (f.act?.key === 'diehardman' && f.act.t <= moves.diehardman.start + moves.diehardman.active) {
        const x = f.x+f.face*39, y = FLOOR-104;
        c.strokeStyle=f.act.t < moves.diehardman.start ? '#80988b' : '#deffe8';
        c.lineWidth=2; c.strokeRect(x-10,y-10,20,20);
      }
      if (f.act?.key === 'mama' && f.act.t === moves.mama.start-1) {
        const x=clamp(f.x+f.face*130,48,WIDTH-48);
        line(c,f.x+f.face*22,FLOOR-84,x,FLOOR-8,ICE,1);
      }
      if (f.act?.key === 'winch' && f.act.destination !== undefined && f.act.t < moves.winch.start+moves.winch.active)
        line(c,f.x,FLOOR-64,f.act.destination,FLOOR-4,'#8ee9df',2);
      if (f.act?.key === 'relief' && strike(f)) {
        const reach=moves.relief.reach+(f.act.extended ? 44 : 0);
        line(c,f.x+f.face*21,FLOOR-77,f.x+f.face*reach,FLOOR-77,'#d8e8cb',2);
      }
      if (f.act?.key === 'mule') {
        const wave = f.act.t - moves.mule.start;
        if (wave >= 0 && wave < moves.mule.active) {
          const radius = (wave+1) * 38;
          c.strokeStyle = AMBER; c.lineWidth = 2;
          c.beginPath(); c.ellipse(f.x,FLOOR-6,radius,5+radius*.06,0,0,TAU); c.stroke();
        }
      }
      if (f.scan) {
        const x = f.scan.x, y = FLOOR-8;
        line(c,x-15,y-9,x-15,y,AMBER,2);
        line(c,x-15,y,x-6,y,AMBER,2);
        line(c,x+15,y-9,x+15,y,AMBER,2);
        line(c,x+15,y,x+6,y,AMBER,2);
      }
      const mark = f.marker;
      if (!mark) continue;
      const {x,kind,ttl} = mark;
      if (kind === 'seal') {
        const sx=f.x-f.face*30, sy=FLOOR-f.y-126;
        c.strokeStyle='#d7f3d2'; c.lineWidth=2; c.strokeRect(sx-6,sy-6,12,12);
        line(c,sx-6,sy+10,sx-6+12*ttl/120,sy+10,'#d7f3d2',2);
      } else if (kind === 'anchor') {
        oval(c,x,FLOOR-2,16,3,'#75cfc7');
        line(c,x-9,FLOOR-2,x,FLOOR-30,'#91ede0',2);
        line(c,x,FLOOR-30,x+9,FLOOR-2,'#91ede0',2);
        line(c,x-6,FLOOR-11,x+6,FLOOR-11,ICE,2);
      } else if (kind === 'memory') {
        oval(c,x,FLOOR-2,17,3,'#a77e73');
        pulseTrace(c,x,FLOOR-20,18,9,'#ffc9ad');
      } else if (kind === 'beacon') {
        oval(c,x,FLOOR-2,22,4,'rgba(175,240,250,.65)');
        line(c,x,FLOOR-2,x,FLOOR-33,ICE,1.5);
      } else if (kind === 'mine') {
        oval(c,x,FLOOR-2,17,4,ttl>130?'#8b784c':'#edc46e');
        for (let toe=-1; toe<=1; toe++) oval(c,x+toe*8,FLOOR-7,3,2,AMBER);
      } else if (kind === 'crate') {
        if (ready(m.images.cargo)) {
          c.drawImage(m.images.cargo,x-cargoWidth/2,FLOOR-cargoHeight,cargoWidth,cargoHeight);
        } else {
          c.fillStyle='#414549'; c.fillRect(x-cargoWidth/2,FLOOR-cargoHeight,cargoWidth,cargoHeight);
          c.fillStyle=AMBER; c.fillRect(x-9,FLOOR-cargoHeight,3,cargoHeight); c.fillRect(x+6,FLOOR-cargoHeight,3,cargoHeight);
        }
        if (mark.travel === 'retrieve') line(c,x,FLOOR-13,f.x,FLOOR-69,'rgba(241,200,111,.69)',1.5);
      } else {
        oval(c,x,FLOOR-2,19,3,'rgba(160,198,162,.65)');
        oval(c,x,FLOOR-61,6,8,'#9aafa1');
        line(c,x,FLOOR-50,x-4,FLOOR-7,'rgba(145,169,151,.7)',8);
      }
    }
    for (const s of m.shots) {
      if (s.kind === 'gate') {
        c.fillStyle='rgba(168,214,181,.18)'; c.fillRect(s.x-15,FLOOR-143,30,143);
        c.strokeStyle='#cae6ca'; c.lineWidth=2; c.strokeRect(s.x-15,FLOOR-143,30,143);
        line(c,s.x-15,FLOOR-128,s.x+15,FLOOR-110,ICE,2);
      } else if (s.kind === 'deck') {
        const tail=s.x-Math.sign(s.vx)*24;
        line(c,tail,s.y-4,s.x,s.y-4,'#b1f3ec',3);
        line(c,tail,s.y+5,s.x,s.y+5,'#79c0c0',2);
        line(c,tail,s.y+5,s.x,s.y-4,'#b1f3ec',2);
      } else if (s.kind === 'heartman' || s.kind === 'memory') {
        pulseTrace(c,s.x,s.y,s.kind==='memory' ? 64 : 14,s.kind==='memory' ? 25 : 8,'#ffceae');
      } else if (s.kind === 'recall') {
        line(c,s.x-24,s.y+18,s.x+25,s.y-10,'#cddbbb',3);
      } else if (s.kind === 'higgs') {
        for (let i=-2;i<=2;i++) {
          const rise = 44 - Math.abs(i)*7;
          line(c,s.x+i*11,FLOOR,s.x+i*15-3,s.y-rise,'#15171c',7);
          line(c,s.x+i*15-3,s.y-rise,s.x+i*15+1,s.y-rise-9,AMBER,2);
        }
      } else if (s.kind === 'sam') {
        c.strokeStyle = '#f1cc88'; c.lineWidth = 2;
        c.beginPath(); c.ellipse(s.x,s.y,14,7,Math.sin(s.age*.3),0,TAU); c.stroke();
        line(c,s.x,s.y,s.x-Math.sign(s.vx)*25,s.y+2,AMBER,1);
      } else {
        line(c,s.x,s.y,s.x-Math.sign(s.vx)*26,s.y,'#e1c29b',2);
      }
    }
    for (const p of m.sparks) line(c,p.x,p.y,p.x-p.vx,p.y-p.vy,p.color,2);
    if (m.mode === 'training' && m.training.hitboxes) {
      for (const f of m.f) {
        for (const [box,color] of [[hurt(f),'#76f5e3'],[strike(f),'#ff955e']]) {
          if (!box) continue;
          c.strokeStyle=color; c.lineWidth=1.5; c.strokeRect(box.l,box.t,box.r-box.l,box.b-box.t);
        }
      }
    }
  }

  function meter(c,x,y,w,h,value,color,right) {
    c.fillStyle = '#0e191eee';
    c.fillRect(x,y,w,h);
    const fill = w * clamp(value / 100,0,1);
    c.fillStyle = color;
    c.fillRect(right ? x+w-fill : x,y,fill,h);
  }

  function hud(m) {
    const c=m.ctx;
    const fade=c.createLinearGradient(0,0,0,115);
    fade.addColorStop(0,'rgba(4,13,17,.93)'); fade.addColorStop(1,'rgba(4,13,17,0)');
    c.fillStyle=fade; c.fillRect(0,0,WIDTH,118);
    m.f.forEach((f,i)=>{
      const right=i===1, x=right?WIDTH-50-478:50, edge=right?x+478:x;
      const align=right?'right':'left';
      label(c, f.spec.name.toUpperCase(), edge, 39, 23, '#edf2ed', align);
      meter(c,x,50,478,12,f.hp,'#ccdfcf',right);
      meter(c,x,68,478,4,f.balance,'#d4aa66',right);
      meter(c,x,76,478,4,f.chiral,'#89c6cd',right);
      for (let r=0; r<m.toWin && m.mode!=='training'; r++) oval(c,edge+(right?-1:1)*(6+r*18),94,4,4,r<m.wins[i]?'#f8cd87':'#606f72');
    });
    if (m.parcel) label(c,m.parcel==='intact'?'COLIS SCELLÉ':'SCELLÉ ROMPU',WIDTH/2,106,12,m.parcel==='intact'?ICE:AMBER,'center');
    const display = m.mode==='training'?'∞':String(Math.ceil(m.remaining/60)).padStart(2,'0');
    label(c,display,WIDTH/2,61,46,'#f7f6ed','center');
    label(c,m.mode==='training'?'DOJO':'MANCHE '+m.round,WIDTH/2,83,12,'#c5d6d3','center');
    let caption='', sub='';
    if(m.phase==='intro'){caption='MANCHE '+m.round;sub=stages[m.stage].title;}
    if(m.phase==='roundover'){caption=m.reason==='time'?'TEMPS ÉCOULÉ':'K.-O.';sub=m.f[m.winner-1].spec.short;}
    if(m.phase==='finish'){caption='RUPTURE';sub=m.f[m.winner-1].spec.short+' · COMMANDE DE FINITION';}
    if(m.phase==='cinema'){caption=m.f[m.winner-1].spec.end.toUpperCase();sub='ÉCHO DISSIPÉ';}
    if(m.paused){caption='PAUSE';sub='';}
    if(caption) {
      c.fillStyle='rgba(4,13,17,.80)';c.fillRect(0,HEIGHT*.29,WIDTH,100);
      label(c,caption,WIDTH/2,HEIGHT*.29+49,34,'#f1f2e9','center');
      label(c,sub,WIDTH/2,HEIGHT*.29+78,14,'#dec194','center');
    }
  }

  function finisherScene(m) {
    const actor=m.f[m.winner-1], target=m.f[2-m.winner], c=m.ctx;
    const t=1-m.phaseTicks/108, p=Math.sin(t*Math.PI), x=target.x, y=FLOOR-target.y;
    c.save();
    c.globalAlpha=p;
    if (actor.id==='higgs') {
      oval(c,x,y,100*p,15,'#15151e');
      for(let i=-4;i<=4;i++) {
        const h=(1-Math.abs(i)*.12)*p*150;
        line(c,x+i*12,y,x+i*10+Math.sin(t*7+i)*8,y-h,'#14151d',7);
        line(c,x+i*10+Math.sin(t*7+i)*8,y-h,x+i*10+6,y-h-8,AMBER,1.5);
      }
    } else if(actor.id==='fragile') {
      for(let i=1;i<=3;i++) {
        c.strokeStyle='#c9f2ed';c.lineWidth=1.5;c.beginPath();
        c.ellipse(x,y-82,(13+t*43)*i/2,94,0,0,TAU);c.stroke();
      }
    } else if(actor.id==='mule') {
      const scanY = y - 155 + 140 * ((t * 2) % 1);
      c.strokeStyle = AMBER; c.lineWidth = 2;
      c.strokeRect(x-47,y-158,94,158);
      line(c,x-47,scanY,x+47,scanY,'#ffe8ac',3);
      for (let n = 0; n < 5; n++) line(c,x-28+n*12,y-8,x-28+n*12,y-18,AMBER,2);
    } else if(actor.id==='diehardman') {
      for (let i=0;i<3;i++) {
        const offset=Math.max(0,1-t*3+i*.33)*54;
        const gx=x+(i-1)*88;
        c.strokeStyle='#c4dccb'; c.lineWidth=2; c.strokeRect(gx-37,y-157,74,157);
        c.fillStyle='rgba(91,124,109,.72)';
        c.fillRect(gx-36-offset,y-155,35,152); c.fillRect(gx+1+offset,y-155,35,152);
      }
    } else if(actor.id==='mama') {
      for (let i=0;i<3;i++) {
        const gx=x+(i-1.5)*54, gy=y-23-i*13, span=54*clamp(t*5-i,0,1);
        line(c,gx,gy,gx+span,gy,'#a2e9e0',4);
        line(c,gx,y,gx+span,gy,'#8abeb9',2);
      }
      const progress=clamp((t-.35)/.56,0,1);
      oval(c,x-81+progress*162,y-34-progress*39,9,9,AMBER);
    } else if(actor.id==='heartman') {
      pulseTrace(c,x,y-81,98,53*p,'#ffd1ad');
      for (const sign of [-1,1]) {
        const gx=x+sign*(78-44*p);
        oval(c,gx,y-81,6,6,'#fff1d6');
        line(c,gx,y-147,gx,y-15,'rgba(249,185,143,.68)',1.5);
      }
    } else if(actor.id==='sam') {
      for(let i=0;i<5;i++)line(c,actor.x, FLOOR-91,x+(i%2?16:-16),y-36-i*17,'#d9ad76',2);
    } else {
      for(let i=0;i<4;i++){
        const offset=(i%2?1:-1)*(62+48*Math.floor(i/2));
        oval(c,x+offset,y-104,9,12,'#1c241e');
        c.fillStyle='#26302a';c.fillRect(x+offset-12,y-92,24,61);
        line(c,x+offset,y-72,x,y-77,'rgba(190,198,173,.65)',1.5);
      }
    }
    c.restore();
  }

  function finisherArtwork(m) {
    const winner = m.f[m.winner - 1];
    const image = m.images[winner.id + 'Finale'];
    const elapsed = 108 - m.phaseTicks;
    if (!ready(image) || elapsed <= 22) return;

    const c = m.ctx;
    const fade = clamp((elapsed - 22) / 16, 0, 1);
    const scale = Math.max(WIDTH / image.naturalWidth, HEIGHT / image.naturalHeight);
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    c.save();
    c.globalAlpha = fade;
    c.drawImage(image, (WIDTH - w) / 2, (HEIGHT - h) / 2, w, h);
    const shade = c.createLinearGradient(0, HEIGHT * .64, 0, HEIGHT);
    shade.addColorStop(0, 'rgba(3,10,13,0)');
    shade.addColorStop(1, 'rgba(3,10,13,.94)');
    c.fillStyle = shade;
    c.fillRect(0, HEIGHT * .64, WIDTH, HEIGHT * .36);
    label(c, winner.spec.name.toUpperCase(), 52, HEIGHT - 86, 18, '#eed39b');
    label(c, winner.spec.end, 50, HEIGHT - 34, 45, '#f4f2e9');
    c.restore();
  }

  function draw(m) {
    const c=m.ctx;
    c.save();
    scenery(m);
    const gap=Math.abs(m.f[0].x-m.f[1].x);
    const zoom=clamp(1.83-gap*.00082,1.02,1.64);
    const mid=(m.f[0].x+m.f[1].x)/2;
    const center=clamp(mid,WIDTH/(2*zoom),WIDTH-WIDTH/(2*zoom));
    const shake=Math.sin(m.tick*2.1)*m.shake;
    c.save();
    c.translate(WIDTH/2+shake,FLOOR+10+shake*.45);
    c.scale(zoom,zoom);
    c.translate(-center,-FLOOR);
    drawFighter(m,m.f[0],0);
    drawFighter(m,m.f[1],1);
    effects(m);
    if(m.phase==='cinema') finisherScene(m);
    c.restore();
    foreground(m);
    hud(m);
    if (m.phase === 'cinema' && !m.paused) finisherArtwork(m);
    c.restore();
  }

  // Checkpoints contain mutable simulation data only. Art, callbacks and the canvas
  // stay attached to this match while the private room reconciles late inputs.
  const networkFields = ['wins','round','tick','beat','phase','phaseTicks','remaining','f','shots','sparks',
    'hstop','shake','winner','finisher','reason','camera','sudden','parcel'];
  const network = {
    checkpoint() {
      if (!match?.networkClock) return null;
      const state={};
      for (const key of networkFields) state[key]=match[key];
      return {state:structuredClone(state),particles:match.particlesRandom.state(),simulation:match.simRandom.state()};
    },
    restore(point) {
      if (!match?.networkClock || !point) return;
      Object.assign(match,structuredClone(point.state));
      match.particlesRandom.restore(point.particles); match.simRandom.restore(point.simulation);
    },
    advance(inputs,silent=false) {
      if (!match?.networkClock) return;
      match.silentResimulation=silent;
      try {
        for (const [player,action,down] of inputs) input(player,action,down);
        step(match);
      } finally { match.silentResimulation=false; }
    },
    draw() {if (match?.networkClock) draw(match);}
  };

  host.StrandFight = {start, stop, pause, input, setTraining, setSound, snapshot, validReplay, network};
})(window);
