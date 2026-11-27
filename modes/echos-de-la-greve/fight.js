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
  const originalKits=host.StrandOriginalKits?.enabled?host.StrandOriginalKits:null;
  Object.assign(roster,originalKits?.roster || {});
  const originalIds=originalKits?.originalCharacterIds || [];
  const originalRulesFor=ids=>ids.some(id=>originalIds.includes(id))?originalKits.rules:null;
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
  const stageLinks = host.StrandContent?.stageLinks || {};
  const stageId = m => m?.link?.zone || m?.stage;
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
  Object.assign(moves,originalKits?.moves || {});
  const moveBase=key=>moves[key]?.baseKey || key;
  const directional = {
    sam:{forward:'brace',back:'parry'}, fragile:{forward:'fan',back:'beacon'},
    higgs:{forward:'mine',back:'feint'}, cliff:{forward:'post',back:'recall'},
    mule:{forward:'crate',back:'retrieve'}, diehardman:{forward:'gate',back:'relief'},
    mama:{forward:'deck',back:'winch'}, heartman:{forward:'memory',back:'syncope'}
  };
  Object.assign(directional,originalKits?.directional || {});
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
  // The original ten-action encoding is immutable: old J2 recordings use it.
  // Version 2 adds codes 40–43 for taunt without shifting any existing code.
  const tauntRules = Object.freeze({entry:10,hold:28,exit:16,total:54});
  const tauntPhase = frame => frame < tauntRules.entry ? 'entry' : frame < tauntRules.entry + tauntRules.hold ? 'hold' : 'exit';
  const tauntPoses = Object.freeze({entry:'tauntEntry',hold:'taunt',exit:'tauntExit'});
  let match, raf = 0, serial = 0, audio, noiseBuffer, sound = true;
  let ambienceVolume=.35, ambience=null, ambienceBuffer, audioSuspended=false, resumePending=false;
  const voices=new Set();
  function releaseVoice(voice, stopSource=true) {
    if (voice.released) return;
    voice.released=true;
    voice.source.onended=null;
    if (stopSource) try {voice.source.stop();} catch (_) { /* Already ended. */ }
    for (const node of new Set([voice.source,voice.output,voice.volume])) node.disconnect();
    voices.delete(voice);
  }
  function stopCombatAudio() { for (const voice of [...voices]) releaseVoice(voice); }
  function playVoice(source,output,span,level,delay,attack) {
    const t=audio.currentTime+delay, volume=audio.createGain();
    volume.gain.setValueAtTime(.0001,t);
    volume.gain.exponentialRampToValueAtTime(level,t+Math.min(span*.45,attack));
    volume.gain.exponentialRampToValueAtTime(.0001,t+span);
    output.connect(volume); volume.connect(audio.destination);
    const voice={source,output,volume};
    voices.add(voice);
    source.onended=()=>releaseVoice(voice,false);
    source.start(t); source.stop(t+span+.002);
  }
  function tone(hz,span,waveform='sine',gain=.035,end=hz,delay=0,attack=.009) {
    if (!sound || audioSuspended || match?.paused || match?.silentResimulation || audio?.state!=='running') return;
    try {
      const t=audio.currentTime+delay, osc=audio.createOscillator();
      osc.type=waveform; osc.frequency.setValueAtTime(hz,t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(18,end),t+span);
      playVoice(osc,osc,span,gain,delay,attack);
    } catch (_) { /* Sound is optional. */ }
  }
  function friction(type,hz,end,span,gain,delay=0) {
    if (!sound || audioSuspended || match?.paused || match?.silentResimulation || audio?.state!=='running') return;
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
    if (!sound || audioSuspended || match?.paused || match?.silentResimulation) return;
    try {
      if (!audio) {
        const Ctor=host.AudioContext || host.webkitAudioContext;
        if (Ctor) {
          audio=new Ctor();
          audio.addEventListener?.('statechange',()=>{
            if (audio.state==='running') syncAmbience(); else stopAudio();
          });
        }
      }
      if (audio?.state==='suspended' && !resumePending) {
        resumePending=true;
        Promise.resolve(audio.resume()).then(()=>{resumePending=false;syncAmbience();},()=>{resumePending=false;});
      }
      syncAmbience();
    } catch (_) { resumePending=false; /* Audio is optional. */ }
  }
  // Original synthesized scenery. These clocks and sources never enter the
  // simulation/checkpoints; drawing a corrected network frame cannot replay a cue.
  const ambiencePresets={
    shore:{filter:'lowpass',hz:540,level:.075,cue:'surf',interval:9,x:.18},
    terminal:{filter:'lowpass',hz:680,level:.038,hum:58,cue:'door',interval:12,x:.86},
    'terminal-hangar':{filter:'lowpass',hz:360,level:.025,hum:58,cue:'door',interval:16,x:.86},
    battlefield:{filter:'bandpass',hz:380,level:.055,cue:'radio',interval:13,x:.16},
    'mule-camp':{filter:'highpass',hz:1250,level:.035,cue:'beacon',interval:11,x:.87},
    'mule-camp-dry':{filter:'bandpass',hz:720,level:.06,cue:'beacon',interval:11,x:.87},
    'heartman-lab':{filter:'lowpass',hz:170,level:.022,hum:72,cue:'ecg',interval:7,x:.12},
    'mama-workshop':{filter:'bandpass',hz:340,level:.03,hum:92,cue:'winch',interval:12,x:.82},
    'ruined-factory':{filter:'lowpass',hz:410,level:.045,hum:49,cue:'pipe',interval:10,x:.84},
    'timefall-shelter':{filter:'lowpass',hz:1900,level:.06,cue:'drip',interval:6,x:.1},
    'tar-basin':{filter:'lowpass',hz:260,level:.055,cue:'bubble',interval:9,x:.84},
    'mountain-pass':{filter:'bandpass',hz:960,level:.07,cue:'gust',interval:11,x:.16},
    'port-knot':{filter:'lowpass',hz:430,level:.052,cue:'surf',interval:12,x:.15},
    incinerator:{filter:'bandpass',hz:560,level:.04,hum:52,cue:'gust',interval:14,x:.72},
    'south-knot-ruins':{filter:'lowpass',hz:1700,level:.055,cue:'drip',interval:8,x:.16},
    'timefall-farm':{filter:'lowpass',hz:1450,level:.05,cue:'gust',interval:12,x:.82},
    'mountain-knot-approach':{filter:'bandpass',hz:1020,level:.065,cue:'gust',interval:11,x:.15},
    'magellan-ds2':{filter:'lowpass',hz:620,level:.035,hum:64,cue:'winch',interval:14,x:.84},
    'plate-gate-ds2':{filter:'bandpass',hz:280,level:.035,hum:48,cue:'gust',interval:16,x:.24},
    'sandstorm-ds2':{filter:'lowpass',hz:1850,level:.055,cue:'gust',interval:10,x:.82},
    'dunes-ds2':{filter:'bandpass',hz:1180,level:.04,cue:'gust',interval:15,x:.18}
  };
  function releaseAmbientVoice(group,voice,stopSource=true) {
    if (voice.released) return;
    voice.released=true;voice.source.onended=null;
    if (stopSource) try {voice.source.stop();} catch (_) { /* Already ended. */ }
    for (const node of voice.nodes) node.disconnect();
    group.voices.delete(voice);
  }
  function stopAmbience() {
    const group=ambience;ambience=null;
    if (!group) return;
    for (const voice of [...group.voices]) releaseAmbientVoice(group,voice);
    group.bus.disconnect();
  }
  function stopAudio() { stopAmbience();stopCombatAudio(); }
  function ambientNoise() {
    if (!ambienceBuffer) {
      ambienceBuffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*4),audio.sampleRate);
      const samples=ambienceBuffer.getChannelData(0),roll=randomSeed(0x61746d6f);
      for (let i=0;i<samples.length;i++) samples[i]=roll()*2-1;
    }
    return ambienceBuffer;
  }
  function ambientVoice(group,{noise=false,filter='lowpass',hz=440,end=hz,wave='sine',level=.02,span=0,delay=0,pan=0}) {
    const source=noise ? audio.createBufferSource() : audio.createOscillator();
    const gain=audio.createGain(),nodes=[source,gain],t=audio.currentTime+delay;
    const voice={source,nodes};group.voices.add(voice);
    try {
      let output=source;
      if (noise) {
        source.buffer=ambientNoise();source.loop=!span;
        output=audio.createBiquadFilter();nodes.push(output);
        output.type=filter;output.Q.value=.65;source.connect(output);
      } else source.type=wave;
      output.frequency.setValueAtTime(hz,t);
      if (span) output.frequency.exponentialRampToValueAtTime(Math.max(18,end),t+span);
      output.connect(gain);
      gain.gain.setValueAtTime(.0001,t);
      gain.gain.exponentialRampToValueAtTime(level,t+(span ? Math.min(.18,span*.3) : .4));
      if (span) gain.gain.exponentialRampToValueAtTime(.0001,t+span);
      if (span && audio.createStereoPanner) {
        const panner=audio.createStereoPanner();nodes.push(panner);
        panner.pan.setValueAtTime(pan,t);gain.connect(panner);panner.connect(group.bus);
      } else gain.connect(group.bus);
      source.onended=()=>releaseAmbientVoice(group,voice,false);
      source.start(t);
      if (span) source.stop(t+span+.002);
    } catch (error) {releaseAmbientVoice(group,voice);throw error;}
  }
  function ambienceCue(group,m) {
    const p=group.preset,pan=clamp((p.x*WIDTH-m.camera*.31-WIDTH/2)/(WIDTH/2),-.85,.85);
    const note=(hz,end,span,level=.02,delay=0,wave='sine')=>ambientVoice(group,{hz,end,span,level,delay,wave,pan});
    const noise=(filter,hz,end,span,level,delay=0)=>ambientVoice(group,{noise:true,filter,hz,end,span,level,delay,pan});
    switch (p.cue) {
      case 'surf': noise('lowpass',720,190,1.8,.11);break;
      case 'door': noise('bandpass',190,320,.65,.045);note(95,66,.2,.022,.55,'triangle');break;
      case 'radio': noise('bandpass',1550,1000,.48,.026);note(510,505,.08,.012,.2,'triangle');break;
      case 'beacon': note(660,710,.11,.022);note(940,980,.09,.016,.18);break;
      case 'ecg': note(1450,1430,.055,.014);break;
      case 'winch': note(190,260,.5,.012,0,'sawtooth');noise('bandpass',900,530,.65,.018);break;
      case 'pipe': noise('highpass',2100,650,.75,.04);break;
      case 'drip': note(920,180,.09,.032);noise('bandpass',2900,1600,.08,.005,.04);break;
      case 'bubble': note(130,60,.18,.035);noise('lowpass',240,110,.12,.02,.04);break;
      case 'gust': noise('bandpass',900,260,1.7,.08);break;
    }
  }
  function syncAmbience(cues=false) {
    const m=match,preset=ambiencePresets[stageId(m)];
    if (!sound || !ambienceVolume || audioSuspended || !m || m.paused || m.phase==='ended' ||
        m.silentResimulation || host.document?.hidden || audio?.state!=='running' || !preset) {
      stopAmbience();return;
    }
    try {
      if (ambience?.owner!==m || ambience?.preset!==preset) {
        stopAmbience();
        const bus=audio.createGain();bus.connect(audio.destination);
        ambience={owner:m,preset,bus,voices:new Set(),nextAt:audio.currentTime+2};
        bus.gain.setValueAtTime(ambienceVolume*(m.reducedEffects ? .65 : 1),audio.currentTime);
        ambientVoice(ambience,{noise:true,filter:preset.filter,hz:preset.hz,level:preset.level});
        if (preset.hum) ambientVoice(ambience,{hz:preset.hum,level:.0045});
      }
      // A long pause, redraw or rollback never queues missed scenery sounds.
      if (cues && audio.currentTime>=ambience.nextAt) {
        ambience.nextAt=audio.currentTime+preset.interval;
        if (!m.reducedEffects && ambience.voices.size<3) ambienceCue(ambience,m);
      }
    } catch (_) {stopAmbience(); /* A browser without Web Audio still plays normally. */}
  }
  function setAmbienceVolume(value) {
    if (typeof value!=='number' || !Number.isFinite(value)) return ambienceVolume;
    ambienceVolume=clamp(value,0,1);
    if (!ambienceVolume) stopAmbience();
    else {
      if (ambience) ambience.bus.gain.setTargetAtTime(ambienceVolume*(match?.reducedEffects ? .65 : 1),audio.currentTime,.04);
      wakeAudio();
    }
    return ambienceVolume;
  }
  // Audio-only suspension, e.g. a private room waiting for a connection. It must
  // not pause network ticks, clear inputs or alter deterministic checkpoints.
  function setAudioSuspended(on) {
    const next=!!on;if (audioSuspended===next) return;
    audioSuspended=next;
    if (next) stopAudio();else wakeAudio();
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
  // Opt-in local team rules. Ordinary duels keep their original simulation and
  // replay encoding. A team member is a persistent fighter, never a fresh HP bar.
  const teamRules=Object.freeze({capacity:100,start:50,gain:.1,assistCost:25,tagCost:15,assistCooldown:360,tagCooldown:240,assistEntry:18,assistDuration:60,tagTransfer:15,tagDuration:30});
  const assistanceNames={sam:'Liaison de couverture',fragile:'Quai de passage',higgs:'Empreinte de repli',cliff:'Couverture de section',mule:'Livraison interceptée',diehardman:'Consigne de couverture',mama:'Travée d’essai',heartman:'Mesure croisée'};
  Object.assign(assistanceNames,Object.fromEntries(Object.entries(originalKits?.assists || {}).map(([id,profile])=>[id,profile.name])));
  function validTeamSelection(value) {
    return Array.isArray(value)&&value.length===2&&value.every(ids=>Array.isArray(ids)&&ids.length===2&&ids[0]!==ids[1]&&ids.every(id=>Object.hasOwn(roster,id)));
  }
  function freshTeams(ids) {
    return ids.map((pair,side)=>({active:0,cohesion:teamRules.start,assistCooldown:0,tagCooldown:0,busy:null,combo:0,comboTTL:0,
      members:pair.map((id,slot)=>({...fighter(id,side?818:462,side?-1:1),teamSide:side,teamSlot:slot}))}));
  }
  function syncTeamActors(m) {
    m.f=m.teams.map(team=>team.members[team.active]);
    m.ids=m.f.map(f=>f.id);
    if(m.teamFrames)m.fighterFrames=m.f.map(f=>m.teamFrames[f.teamSide][f.teamSlot]);
  }
  function teamSnapshot(m) {
    return m.teams.map(team=>({active:team.active,cohesion:Math.floor(team.cohesion*10)/10,assistCooldown:team.assistCooldown,tagCooldown:team.tagCooldown,
      busy:team.busy?{kind:team.busy.kind,frame:team.busy.frame,member:team.busy.member}:null,combo:team.combo,
      members:team.members.map(f=>({id:f.id,hp:Math.ceil(f.hp),chiral:Math.floor(f.chiral),balance:Math.ceil(f.balance),x:f.x,y:f.y,ko:f.hp<=0}))}));
  }
  function teamNotice(m,side,text) {const f=m.f[side];f.notice=text;f.noticeTTL=70;}
  function requestTeamAction(m,side,kind) {
    const team=m.teams[side],active=m.f[side],reserve=team.members[1-team.active];
    if(m.phase!=='fight'||team.busy||active.hp<=0||reserve.hp<=0||reserve.stun||reserve.blockStun)return false;
    if(active.stun||active.blockStun||active.taunt||active.dash||!active.grounded)return false;
    if(kind==='tag'&&(active.act||active.guard||active.keys.guard||active.keys.down))return false;
    const cost=kind==='assist'?teamRules.assistCost:teamRules.tagCost;
    if(team[kind==='assist'?'assistCooldown':'tagCooldown']>0){teamNotice(m,side,'PARTENAIRE EN RÉCUPÉRATION');return false;}
    if(team.cohesion<cost){teamNotice(m,side,'COHÉSION INSUFFISANTE');return false;}
    team.cohesion-=cost;
    team.busy={kind,frame:0,member:1-team.active,interrupted:false,emitted:false,transferred:false};
    clearFighterControls(reserve);reserve.act=null;delete reserve.taunt;
    reserve.x=clamp(active.x-active.face*76,48,WIDTH-48);reserve.y=0;reserve.vx=0;reserve.vy=0;reserve.grounded=true;reserve.face=active.face;
    if(kind==='tag'){clearFighterControls(active);active.teamLock=true;teamNotice(m,side,'RELAIS · ENTRÉE ANNONCÉE');}
    else teamNotice(m,side,assistanceNames[reserve.id].toUpperCase());
    notify(m,true);return true;
  }
  function leaveTeamField(f) {
    clearFighterControls(f);f.act=null;delete f.taunt;delete f.teamLock;
    // These objects are recalled on reserve entry; their paid cost is never
    // refunded. Inert crate/beacon/memory retain their own expiry clock.
    if(['post','anchor','baliseAnchor'].includes(f.marker?.kind))f.marker=null;
    if(f.marker?.kind==='crate')f.marker.travel=null;
  }
  function transferTeam(m,side,automatic=false) {
    const team=m.teams[side],outgoing=m.f[side],incoming=team.members[1-team.active];
    if(incoming.hp<=0)return false;
    const x=outgoing.x,face=outgoing.face;
    leaveTeamField(outgoing);team.active=1-team.active;syncTeamActors(m);
    clearFighterControls(incoming);incoming.act=null;delete incoming.taunt;
    incoming.x=x;incoming.y=0;incoming.vx=0;incoming.vy=0;incoming.grounded=true;incoming.face=face;
    incoming.combo=team.combo;incoming.comboTTL=team.comboTTL;
    if(automatic){team.busy=null;incoming.notice='RELAIS APRÈS K.-O.';incoming.noticeTTL=70;}
    else {team.busy.transferred=true;incoming.teamLock=true;}
    return true;
  }
  function finishTeamBusy(team) {
    const busy=team.busy;if(!busy)return;
    if(busy.kind==='assist'){const f=team.members[busy.member];clearFighterControls(f);f.act=null;team.assistCooldown=teamRules.assistCooldown;}
    else {team.tagCooldown=teamRules.tagCooldown;team.members.forEach(f=>delete f.teamLock);}
    team.busy=null;
  }
  function teamSupport(m,side) {
    const team=m.teams?.[side];return team?.busy?.kind==='assist'?team.members[team.busy.member]:null;
  }
  function advanceTeams(m) {
    m.teams.forEach((team,side)=>{
      team.cohesion=clamp(team.cohesion+teamRules.gain,0,100);
      team.assistCooldown=Math.max(0,team.assistCooldown-1);team.tagCooldown=Math.max(0,team.tagCooldown-1);
      if(team.comboTTL>0&&!--team.comboTTL)team.combo=0;
      const reserve=team.members[1-team.active];
      for(const key of ['stun','blockStun','flash','postHit','noticeTTL'])reserve[key]=Math.max(0,(reserve[key]||0)-1);
      if(reserve.marker&&--reserve.marker.ttl<=0)reserve.marker=null;
      if(reserve.scan&&--reserve.scan.ttl<=0)reserve.scan=null;
      const busy=team.busy;
      if(!busy)return;
      busy.frame++;
      if(busy.kind==='tag'){
        if(m.f[side].stun||m.f[side].hp<=0){finishTeamBusy(team);return;}
        if(busy.frame===teamRules.tagTransfer)transferTeam(m,side);
        if(busy.frame>=teamRules.tagDuration)finishTeamBusy(team);
        return;
      }
      const support=team.members[busy.member],foe=m.f[1-side];
      support.face=Math.sign(foe.x-support.x)||support.face;
      support.x=clamp(support.x+support.vx,48,WIDTH-48);support.vx*=.78;
      if(support.y>0||support.vy!==0||!support.grounded){support.y+=support.vy;support.vy-=.77;if(support.y<=0){support.y=0;support.vy=0;support.grounded=true;}}
      if(support.stun||support.hp<=0){busy.interrupted=true;support.act=null;}
      const originalAssist=originalKits?.assists[support.id];
      if(!busy.interrupted && originalAssist){
        support.act={key:originalAssist.key,t:busy.frame,hit:!!busy.hit};
        if(busy.frame===originalAssist.entry)busy.emitted=true;
      }
      if(!busy.interrupted && !originalAssist){
        // Existing key poses illustrate the announced intervention. They are
        // not declared to be new frame-by-frame assistance animations.
        support.act=busy.frame>=18&&busy.frame<38?{key:'heavy',t:14+busy.frame-18,hit:false}:null;
        if(busy.frame===teamRules.assistEntry){
          busy.emitted=true;
          const kind={sam:'sam',fragile:null,higgs:'higgs',cliff:'cliff',mule:'crate',diehardman:'gate',mama:'deck',heartman:'heartman'}[support.id];
          if(kind){
            const atTarget=['higgs','gate'].includes(kind),vx=kind==='higgs'||kind==='gate'?0:support.face*9;
            makeShot(m,side,kind,atTarget?clamp(support.x+support.face*135,48,WIDTH-48):support.x+support.face*33,
              FLOOR-(kind==='crate'?18:kind==='higgs'?49:kind==='gate'?72:85),vx,kind==='higgs'?6:kind==='gate'?6:52,support);
          }
        }
      }
      if(busy.frame>=(originalAssist?.duration || teamRules.assistDuration))finishTeamBusy(team);
    });
  }
  function resolveTeamRound(m,lifeBefore) {
    m.teams.forEach(team=>team.members.forEach(f=>{if(f.hp<=0)f.marker=null;}));
    const totals=m.teams.map(team=>team.members.reduce((sum,f)=>sum+f.hp,0));
    // No dead member is revived to break an exact simultaneous double KO.
    if(!totals[0]&&!totals[1]){m.winner=0;m.reason='doubleko';m.shots=[];finishMatch(m);return;}
    if(!totals[0]||!totals[1]){
      const winner=totals[0]>0?0:1;
      // An equal-frame trade may KO the active winner while its reserve still
      // lives. The survivor, rather than the defeated actor, receives control
      // and the individual finishing invitation.
      if(m.f[winner].hp<=0){finishTeamBusy(m.teams[winner]);transferTeam(m,winner,true);}
      winRound(m,winner,'ko');return;
    }
    m.teams.forEach((team,side)=>{if(m.f[side].hp<=0){finishTeamBusy(team);m.f[side].marker=null;transferTeam(m,side,true);}});
    if(m.sudden){
      const damage=totals.map((total,i)=>lifeBefore[i]-total);
      if(damage[0]!==damage[1])winRound(m,damage[0]<damage[1]?0:1,'sudden');
      return;
    }
    m.remaining=Math.max(0,m.remaining-1);
    if(m.remaining)return;
    if(totals[0]!==totals[1]){winRound(m,totals[0]>totals[1]?0:1,'time');return;}
    m.sudden=true;m.shots=[];
    m.teams.forEach((team,side)=>{
      finishTeamBusy(team);
      team.members.forEach(f=>{f.act=null;f.marker=null;f.stun=0;f.blockStun=0;f.vx=0;f.vy=0;f.y=0;f.grounded=true;clearFighterControls(f);delete f.taunt;});
      m.f[side].x=side?818:462;m.f[side].notice='PROCHAIN AVANTAGE NET DÉCISIF';m.f[side].noticeTTL=100;
    });
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
      ...(m.teams?{teams:teamSnapshot(m),sudden:m.sudden}:{}),
      stage:m.stage, ...(m.link ? {link:{...m.link,from:stageLinks[m.stage].source,to:stageLinks[m.stage].destination,limit:stageLinks[m.stage].limit,
        ticksRemaining:m.phase==='transition'?m.phaseTicks:0}} : {}),
      mode:m.mode, reducedEffects:m.reducedEffects, staticScenery:m.staticScenery, parcel:m.parcel, beat:m.beat, winner:m.winner, finisher:m.finisher, fighters:m.f.map(f=>({id:f.id,hp:Math.ceil(f.hp),balance:Math.ceil(f.balance),chiral:Math.floor(f.chiral),combo:f.combo,x:f.x,y:f.y,guard:f.guard,action:f.act?.key || '',stun:f.stun,move:f.lastMove,marker:f.marker ? {...f.marker} : null,scan:f.scan ? {...f.scan} : null,...(f.taunt?{taunt:{...f.taunt,phase:tauntPhase(f.taunt.frame)}}:{})})), training:{...m.training,...(m.dummyTape && m.training.timing ? {moves:m.f.map(trainingTiming)} : {})}};
  }
  function validReplay(tape) {
    if (!tape || ![1,2].includes(tape.version) || !Object.hasOwn(roster,tape.p1) || !Object.hasOwn(roster,tape.p2) ||
        !Object.hasOwn(stages,tape.stage) || !['cpu','local'].includes(tape.mode) ||
        !Number.isInteger(tape.seed) || tape.seed<0 || tape.seed>0xffffffff ||
        !Number.isInteger(tape.difficulty) || tape.difficulty<0 || tape.difficulty>2 ||
        !Number.isInteger(tape.roundsToWin) || tape.roundsToWin<1 || tape.roundsToWin>5 ||
        !Number.isSafeInteger(tape.ticks) || tape.ticks<1 || !Array.isArray(tape.events) ||
        (tape.stageRules ?? null)!==(stageLinks[tape.stage]?.replayTag ?? null) ||
        (tape.originalRules ?? null)!==originalRulesFor([tape.p1,tape.p2])) return false;
    let previous=0;
    return tape.events.every(event=>{
      if (!Array.isArray(event) || event.length!==2) return false;
      const [tick,code]=event;
      if (!Number.isSafeInteger(tick) || tick<previous || tick>=tape.ticks || !Number.isInteger(code) ||
          code < -1 || !(code < keyActions.length*(tape.mode==='local' ? 4 : 2) ||
            tape.version===2 && code>=40 && code<(tape.mode==='local'?44:42))) return false;
      previous=tick; return true;
    });
  }
  function start(o) {
    if (!o || !o.canvas || typeof o.canvas.getContext!=='function') throw new TypeError('StrandFight.start requires a canvas.');
    if(o.teams&&(!validTeamSelection(o.teams)||o.replay||o.clock==='network'||o.mode==='training'||stageLinks[o.stage]))throw new Error('Équipes locales incompatibles : deux kits distincts par camp et une arène fixe sont requis.');
    if (o.replay) {
      if (!validReplay(o.replay)) throw new Error('Enregistrement de duel incompatible.');
      const {p1,p2,stage,mode,difficulty,roundsToWin,seed}=o.replay;
      o={...o,p1,p2,stage,mode,difficulty,roundsToWin,seed};
    }
    // A private-room reconstruction may restart simulation from tick zero.
    // Keep its already-held local composition outside the rollback checkpoint.
    const heldScenery=o.preserveStaticScenery===true&&o.clock==='network'&&o.staticScenery&&match?.networkClock&&
      match.staticScenery&&match.stage===o.stage ? {...match.staticScene} : null;
    stop(); audioSuspended=!!o.audioSuspended;
    if (Number.isFinite(o.ambienceVolume)) ambienceVolume=clamp(o.ambienceVolume,0,1);
    const ctx=o.canvas.getContext('2d'); if (!ctx) throw new Error('Canvas 2D indisponible.');
    const stage=stages[o.stage]?o.stage:'shore', ids=o.teams?o.teams.map(pair=>pair[0]):[fighterId(o.p1,'sam'),fighterId(o.p2,'higgs')];
    if(o.clock==='network' && originalRulesFor(ids) && o.originalRules!==originalKits.rules)
      throw new Error('Kit original local : la simulation déterministe exige son identifiant de règles explicite.');
    const difficulty=({easy:0,facile:0,normal:1,medium:1,hard:2,difficile:2})[o.difficulty] ?? (Number.isInteger(o.difficulty)?clamp(o.difficulty,0,2):1);
    const seed=Number.isInteger(o.seed) ? o.seed>>>0 : 0x63cee17;
    const m={canvas:o.canvas,ctx,stage,ids,difficulty,mode:['cpu','local','training'].includes(o.mode)?o.mode:'cpu',toWin:clamp(Math.floor(Number(o.roundsToWin)||2),1,5),
      onEnd:typeof o.onEnd==='function'?o.onEnd:null,onStatus:typeof o.onStatus==='function'?o.onStatus:null,
      wins:[0,0], round:1, tick:0, beat:0, paused:false, phase:'intro', phaseTicks:72, remaining:75*60,
      f:ids.map((id,i)=>fighter(id,i?818:462,i?-1:1)), shots:[], sparks:[], hstop:0, shake:0, winner:0, finisher:false, reason:'',
      camera:0, images:{}, reducedEffects:!!o.reducedEffects, staticScenery:!!o.staticScenery, staticScene:null, training:{dummy:'idle',hitboxes:false,...o.training}, sudden:false, scene:makeScenery(stage), simRandom:randomSeed(seed), particlesRandom:randomSeed(782), now:null, lag:0};
    if (Object.hasOwn(stageLinks,stage)) m.link=freshLink(stageLinks[stage]);
    if(o.teams){m.teamSelection=structuredClone(o.teams);m.teams=freshTeams(o.teams);syncTeamActors(m);}
    if(m.staticScenery)m.staticScene=heldScenery||captureScenery(m);
    if (m.mode==='training') {
      m.dummyTape={events:[],next:0};
      m.training.frames=0; m.training.position=0;
      if (m.training.dummy==='loop') m.training.dummy='idle';
    }
    m.networkClock=o.clock==='network' && m.mode==='local' && !o.replay;
    m.playback=o.replay || null;
    m.eventIndex=0;
    m.recording=o.record && !m.teams && !m.playback && m.mode!=='training' ? {
      version:1,p1:ids[0],p2:ids[1],stage,...(originalRulesFor(ids)?{originalRules:originalKits.rules}:{}),...(m.link?{stageRules:stageLinks[stage].replayTag}:{}),mode:m.mode,difficulty,seed,roundsToWin:m.toWin,events:[]
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
    const loadFighterFrames=(id,side)=>{
      const base = {};
      base.stance = load((o.visuals || {})[id] || art.fighters?.[id]);
      base.action = load(art.actions?.[id]);
      base.step = load(art.steps?.[id]);
      base.hit = load(art.hits?.[id]);
      for (const [pose, file] of Object.entries(art.poses?.[id] || {})) base[pose] = load(file);
      const jump = art.jumps?.[id];
      if (typeof jump === 'string') base.jump = load(jump);
      else for (const phase of ['rise','apex','fall']) base[phase] ||= load(jump?.[phase]);
      const options = art.wardrobe?.[id];
      const kit = options?.[o.outfits?.[side]] || options?.atelier;
      // Resolve the complete costume first; missing/undecoded phases keep its
      // own stance. Image availability never changes the simulation counter.
      const alternate=options?.[o.outfits?.[side]] && o.outfits[side]!=='atelier';
      const source=host.StrandPresentationAssets?.[id];
      const tauntArt = host.StrandPresentation?.gestureAssets ? host.StrandPresentation.gestureAssets(id,o.outfits?.[side]) :
        alternate ? source?.outfits?.[o.outfits[side]] : source;
      const tauntGeometry={};
      for(const pose of Object.values(tauntPoses)){
        base[pose]=load(tauntArt?.[pose]?.src);
        tauntGeometry[pose]=tauntArt?.[pose] || null;
      }
      const tailored = {};
      for (const [pose, file] of Object.entries(kit?.poses || {})) tailored[pose] = load(file);
      if (m.mode !== 'training') m.images[id + 'Finale'] = load(art.finishers?.[id]);
      const originalSource=originalKits?.art[id];
      const original=originalSource?Object.fromEntries(Object.entries(originalSource.poses).map(([pose,faces])=>[pose,
        Object.fromEntries(Object.entries(faces).map(([face,descriptor])=>[face,{...descriptor,image:load(descriptor.src)}]))])):null;
      return {base, tailored, original, tauntGeometry, geometry:{...spriteGeometry[id], ...art.geometry?.[id], ...kit?.geometry},
        generatedPoses:art.poses?.[id] || {}, poseGeometry:art.generatedGeometry?.fighters?.[id] || {},
        tailoredPoseGeometry:kit?.nativePoses ? kit.poseGeometry || {} : null};
    };
    m.fighterFrames=ids.map(loadFighterFrames);
    if(m.teams){m.teamFrames=m.teamSelection.map((pair,side)=>pair.map(id=>loadFighterFrames(id,side)));syncTeamActors(m);}
    const allIds=m.teams?m.teamSelection.flat():ids;
    m.originalProps=Object.fromEntries(allIds.filter(id=>originalKits?.art[id]).map(id=>[id,
      Object.fromEntries(Object.entries(originalKits.art[id].props).map(([name,descriptor])=>[name,{...descriptor,image:load(descriptor.src)}]))]));
    const projectileOwners = {sam:'sam',higgs:'higgs',cliff:'cliff',recall:'cliff',gate:'diehardman',heartman:'heartman',memory:'heartman'};
    m.projectileImages = Object.fromEntries(Object.entries(art.projectiles || {})
      .filter(([kind]) => allIds.includes(projectileOwners[kind])).map(([kind,file]) => [kind,load(file)]));
    m.projectileGeometry = art.generatedGeometry?.projectiles || {};
    // Keep the complete panorama available while a layered stage decodes, or
    // when a file is missing in an older/offline copy of the game.
    const sceneArt=(scene,id)=>Object.assign(scene,{
      legacy:load(art.stages?.[id]),back:load(art.skyplates?.[id]),distant:load(art.distants?.[id]),
      middle:load(art.midgrounds?.[id]),floor:load(art.floors?.[id]),front:load(art.foregrounds?.[id]),geometry:art.stageGeometry?.[id] || {}});
    if (m.link) {
      // Decode both zones ahead of time. Loading cannot delay the simulation or
      // affect the tick at which a rollback/replay changes the active zone.
      const rule=stageLinks[stage];
      m.linkScenes=Object.fromEntries([rule.source,rule.destination].map(id=>[id,sceneArt(makeScenery(id),id)]));
      m.scene=m.linkScenes[m.link.zone];
    } else sceneArt(m.scene,stage);
    if (allIds.includes('mule')) m.images.cargo = load(art.props?.cargo);
    if (m.parcel) {
      m.images.closedParcel = load(art.props?.closedParcel || art.props?.cargo);
      m.images.openParcel = load(art.props?.openParcel);
    }
    if (allIds.includes('mama')) m.images.bridgeDeck = load(art.props?.bridgeDeck);
    if (allIds.includes('higgs')) m.images.goldImprint = load(art.props?.goldImprint);
    if (allIds.includes('heartman')) m.images.heartmanMonitor = load(art.props?.heartmanMonitor);
    if (typeof o.sound==='boolean') setSound(o.sound);
    o.canvas.width=WIDTH; o.canvas.height=HEIGHT; wakeAudio(); draw(m); notify(m,true);
    function frame(t) {
      if (serial!==generation || match!==m) return;
      if (!m.paused) {
        m.lag+=m.now===null?0:clamp(t-m.now,0,90);
        while (m.lag>=STEP && serial===generation) { step(m); m.lag-=STEP; }
      }
      if (serial!==generation || match!==m) return;
      m.now=t; syncAmbience(true);draw(m);
      if (m.phase!=='ended') raf=host.requestAnimationFrame(frame);
    }
    if (!m.networkClock) raf=host.requestAnimationFrame(frame);
    return snapshot();
  }
  function stop() { if (raf) host.cancelAnimationFrame(raf); raf=0; serial++; match=null;stopAudio(); }
  function clearFighterControls(f) { f.queue=[]; f.keys={}; f.taps={}; f.guard=false; }
  function clearControls(m) { (m.teams?m.teams.flatMap(team=>team.members):m.f).forEach(clearFighterControls);if(m.teams)m.teams.forEach(team=>{team.assistHeld=false;team.tagHeld=false;}); }
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
    if (m.paused) stopAudio();else wakeAudio();
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
    stopAudio();
  }
  // This is a local viewing preference. It never enters replay tapes, rollback
  // checkpoints or the combat clock, so two players may choose it independently.
  function setReducedEffects(on) {
    if (!match) return;
    match.reducedEffects=!!on;
    // Keep a quiet, steady bed; reduced effects removes intermittent scenery cues.
    stopAmbience();syncAmbience();
    draw(match); notify(match,true);
  }
  function captureScenery(m) { return {camera:m.camera,tick:m.tick,phase:m.phase,phaseTicks:m.phaseTicks}; }
  function setStaticScenery(on) {
    const m=match;if(!m)return;
    const next=!!on;
    if(next===m.staticScenery)return;
    m.staticScenery=next;m.staticScene=next?captureScenery(m):null;
    // Only presentation is held. Combat clocks, camera simulation and useful
    // fighter/projectile/telegraph animations continue with the same inputs.
    draw(m);notify(m,true);
  }
  function input(player,action,down=true) {
    const m=match;
    if (!m || m.phase==='ended' || m.paused || m.playback || ![1,2].includes(player) ||
        !(keyActions.includes(action) || action==='taunt' || m.teams&&['assist','tag'].includes(action)) || action==='taunt' && m.networkClock) return;
    if(m.teams&&['assist','tag'].includes(action)){
      const team=m.teams[player-1];
      if(player===2&&m.mode!=='local')return;
      const held=!!team[action+'Held'];team[action+'Held']=!!down;
      if(down&&!held)requestTeamAction(m,player-1,action);
      return;
    }
    if (player===2 && m.dummyTape) {
      if (m.training.dummy!=='record' || m.phase!=='fight' || !!m.f[1].keys[action]===!!down) return;
      m.dummyTape.events.push([m.training.frames,action,!!down]);
      applyControl(m,2,action,down);
      return;
    }
    if (player===2 && m.mode!=='local') return;
    if (m.recording && !!m.f[player-1].keys[action]!==!!down) {
      const code=action==='taunt' ? 40+(player-1)*2+Number(!!down) : ((player-1)*keyActions.length+keyActions.indexOf(action))*2+Number(!!down);
      if(action==='taunt')m.recording.version=2;
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
    if(f.teamLock)return;
    // A presentation gesture is an exposed commitment, never an attack cancel.
    // Held directions may resume afterwards; attacks pressed during it are not buffered.
    if(f.taunt)return;
    if(action==='taunt') {
      if(m.networkClock || !f.grounded || f.stun || f.blockStun || f.act || f.dash || f.guard || f.keys.guard || f.keys.down)return;
      f.queue=[];f.taps={};f.taunt={frame:0};f.guard=false;f.crouch=false;
      f.notice=host.StrandPresentation?.profiles?.[f.id]?.title?.toUpperCase() || 'GESTE DE DÉFI';f.noticeTTL=tauntRules.total;
      return;
    }
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
    key=originalKits?.normalKeys[f.id]?.[key] || key;
    if(key==='baliseReel' && (!originalAnchorOwned(f,f.marker,m.f.indexOf(f)) || Math.abs(f.marker.x-f.x)<2)){
      f.notice=originalAnchorOwned(f,f.marker,m.f.indexOf(f))?'ANCRAGE DÉJÀ ATTEINT':'AUCUN ANCRAGE';f.noticeTTL=36;return;
    }
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
    if(key==='baliseAnchor')f.act.anchorX=clamp(f.x+f.face*originalKits.geometry.anchorDistance,48,WIDTH-48);
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
    if (!f.queue.length || f.stun || f.blockStun || f.dash || f.taunt || f.teamLock) return;
    const q=f.queue[0]; const a=f.act;
    if (a) {
      const canLink=a.hitConfirmed && a.t>=moves[a.key].start+moves[a.key].active && (
        (moveBase(a.key)==='light' && ['heavy','special'].includes(q.action)) || (['heavy','lift','sweep'].includes(moveBase(a.key)) && q.action==='special'));
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
    // AI movement must obey the same committed tag window as physical input.
    // In particular its direct dash assignment must not bypass pushInput.
    if(f.teamLock)return;
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
    if(m.teams){f.combo=m.teams[index].combo;f.comboTTL=m.teams[index].comboTTL;}
    else if (f.comboTTL>0 && --f.comboTTL===0) f.combo=0;
    if(f.noticeTTL>0) f.noticeTTL--;
    if (f.marker && f.marker.travel !== 'retrieve' && --f.marker.ttl <= 0) f.marker=null;
    if (f.scan && --f.scan.ttl <= 0) f.scan = null;
    if (f.stun>0) f.stun--; if(f.blockStun>0) f.blockStun--;
    if(f.taunt && ++f.taunt.frame>=tauntRules.total)delete f.taunt;
    if (!f.act && !f.stun && !f.dash && !f.taunt) f.face=o.x>=f.x?1:-1;
    actOnQueue(m,f,o);
    f.guard=!!f.keys.guard && f.grounded && !f.act && !f.stun && !f.dash && !f.taunt && !f.teamLock;
    f.crouch=!!f.keys.down && f.grounded && !f.dash && !f.stun && !f.taunt && !f.teamLock;
    const walk=Number(!!f.keys.right)-Number(!!f.keys.left);
    if (f.dash>0) {f.x+=f.drift*(2+f.dash*.74);f.dash--;}
    else if (!f.stun && !f.blockStun && !f.act && !f.guard && !f.crouch && !f.taunt && !f.teamLock) {
      const delta=walk*f.spec.speed*(f.grounded?1:.78);f.x+=delta;f.walk+=Math.abs(delta)*.065;
    }
    if (f.act) {
      const a=f.act, d=moves[a.key]; a.t++;
      if (a.key==='fragile' && a.t===8) {
        burst(m,f.x,FLOOR-78,ICE,18);f.x+=f.face*Math.min(158,Math.max(0,Math.abs(o.x-f.x)-52));burst(m,f.x,FLOOR-72,ICE,18);
      }
      if(originalIds.includes(f.id))stepOriginal(m,f,index,a,d);
      if (directional[f.id].forward === a.key || directional[f.id].back === a.key)
        stepDirectional(m, f, index, a, d);
      if (moveBase(a.key)==='heavy' && a.t===d.start-3) f.x+=f.face*(f.id === 'diehardman' ? 6 : 12);
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
      if (moveBase(a.key) === 'heavy' && a.t === d.start && f.marker?.kind === 'crate' && !f.marker.travel) {
        const reach = (f.marker.x - f.x) * f.face;
        if (reach >= -12 && reach <= d.reach) {
          Object.assign(f.marker, {travel:'crate', endX:clamp(f.marker.x + 112 * f.face, 48, WIDTH-48), hit:false});
        }
      }
      if (a.key==='sam' && a.t===d.start) makeShot(m,index,'sam',f.x+f.face*37,FLOOR-f.y-87,f.face*12,76);
      if (a.key==='higgs' && a.t===d.start) makeShot(m,index,'higgs',a.target,FLOOR-49,0,6);
      if (a.key==='cliff' && [d.start,d.start+8].includes(a.t)) makeShot(m,index,'cliff',f.x+f.face*36,FLOOR-f.y-(a.t===d.start?97:53),f.face*13,62);
      if (a.t>d.start+d.active+d.recover || originalKits?.moves[a.key] && a.t>=d.start+d.active+d.recover) f.act=null;
    }
    f.x=clamp(f.x+f.vx,48,WIDTH-48);f.vx*=.78;
    if (f.y>0 || f.vy!==0 || !f.grounded) {
      f.y+=f.vy;f.vy-=.77;
      if (f.y<=0) {if(f.vy<-6) burst(m,f.x,FLOOR-4,stages[stageId(m)].light,5);f.y=0;f.vy=0;f.grounded=true;}
    }
    f.chiral=clamp(f.chiral+(m.mode==='training'?.34:.025),0,100);
    if (!f.postHit && !f.guard && !f.stun && !f.act && !f.taunt) f.balance=clamp(f.balance+.28,0,100);
  }

  function originalAnchorOwned(f,marker,side=f.teamSide) {
    return marker?.kind==='baliseAnchor' && marker.ttl>0 && marker.ownerId===f.id &&
      [0,1].includes(marker.ownerSide) && (side===undefined || marker.ownerSide===side) &&
      marker.ownerMember===(f.teamSlot ?? null);
  }
  function originalOpponents(m,side) {
    return [m.f[1-side],teamSupport(m,1-side)].filter(f=>f&&f.hp>0);
  }
  function stepOriginal(m,f,side,action,data) {
    if(action.key==='baliseAnchor' && action.t===data.start) {
      const x=action.anchorX,blocked=originalOpponents(m,side).some(foe=>foe.grounded&&Math.abs(foe.x-x)<22+originalKits.geometry.anchorRadius);
      if(blocked){f.notice='ZONE D’ANCRAGE OCCUPÉE';f.noticeTTL=36;return;}
      f.marker={kind:'baliseAnchor',x,ttl:originalKits.geometry.anchorTTL,ownerId:f.id,ownerSide:side,ownerMember:f.teamSlot ?? null};
      tone(310,.09,'triangle',.025,430);
    }
    if(action.key!=='baliseReel')return;
    if(action.t===data.start) {
      if(!originalAnchorOwned(f,f.marker,side)){action.failed=true;f.notice='ANCRAGE PERDU';f.noticeTTL=36;return;}
      action.destination=f.marker.x;f.marker=null;
    }
    if(action.failed || action.destination===undefined || action.t<data.start || action.t>=data.start+data.active)return;
    // Swept movement, bounded per tick. A hurtbox in the path stops the reel;
    // the ordinary overlap correction never has to push a fighter through it.
    const delta=clamp(action.destination-f.x,-originalKits.geometry.reelSpeed,originalKits.geometry.reelSpeed);
    const direction=Math.sign(delta);let next=clamp(f.x+delta,48,WIDTH-48);
    if(direction)for(const foe of originalOpponents(m,side)){
      const ours=hurt(f),theirs=hurt(foe),vertical=ours.t<theirs.b&&ours.b>theirs.t;
      const ahead=(foe.x-f.x)*direction;
      if(vertical&&ahead>=0&&ahead<Math.abs(next-f.x)+44)
        next=direction>0?Math.min(next,Math.max(f.x,foe.x-44)):Math.max(next,Math.min(f.x,foe.x+44));
    }
    f.x=next;
  }
  function originalObjectContacts(m) {
    const actors=m.teams?m.teams.flatMap(team=>team.members):m.f;
    for(const owner of actors) {
      const marker=owner.marker;if(marker?.kind!=='baliseAnchor')continue;
      const side=m.teams?owner.teamSide:m.f.indexOf(owner);
      const box={l:marker.x-12,r:marker.x+12,t:FLOOR-30,b:FLOOR+1};
      const opponents=originalOpponents(m,side);
      const protectedByBody=attackerX=>[m.f[side],teamSupport(m,side)].filter(Boolean).some(body=>
        body.hp>0&&body.grounded&&Math.sign(body.x-attackerX)===Math.sign(marker.x-attackerX)&&
        Math.abs(body.x-attackerX)+22<Math.abs(marker.x-attackerX));
      let broken=false;
      for(const foe of opponents){
        const strikeBox=strike(foe);
        if(!strikeBox||protectedByBody(foe.x)||!intersects(strikeBox,box)||moves[foe.act.key].grab)continue;
        foe.act.hit=true;
        if(m.teams&&foe===teamSupport(m,1-side))m.teams[1-side].busy.hit=true;
        broken=true;break;
      }
      if(!broken)for(const shot of m.shots){
        if(shot.owner===side||shot.ttl<=0||protectedByBody(shot.x))continue;
        const rx=shot.kind==='higgs'?43:shot.kind==='recall'?46:shot.kind==='memory'?66:shot.kind==='gate'?18:shot.kind==='crate'?21:13;
        const ry=shot.kind==='higgs'?51:shot.kind==='gate'?72:shot.kind==='memory'?45:shot.kind==='crate'?18:9;
        const to=shot.x+shot.vx,shotBox={l:Math.min(shot.x,to)-rx,r:Math.max(shot.x,to)+rx,t:shot.y-ry,b:shot.y+ry};
        if(intersects(shotBox,box)){shot.ttl=0;broken=true;break;}
      }
      if(broken){owner.marker=null;owner.notice='ANCRAGE ROMPU';owner.noticeTTL=40;burst(m,marker.x,FLOOR-9,AMBER,7);}
    }
    m.shots=m.shots.filter(shot=>shot.ttl>0);
  }
  function validOriginalState(f,side,slot) {
    if(!originalKits)return true;
    const isMove=key=>Object.hasOwn(originalKits.moves,key);
    if(f.id!=='balise')return !isMove(f.act?.key)&&f.marker?.kind!=='baliseAnchor'&&f.queue.every(q=>!isMove(q.special));
    if(f.queue.some(q=>!['balise','baliseAnchor','baliseReel'].includes(q.special)))return false;
    if(f.marker && (!originalAnchorOwned(f,f.marker,side)||f.marker.ownerMember!==slot||
      !Number.isInteger(f.marker.ttl)||f.marker.ttl>originalKits.geometry.anchorTTL||!finiteBetween(f.marker.x,48,WIDTH-48)))return false;
    if(!f.act)return true;
    const a=f.act,d=moves[a.key];
    if(!isMove(a.key)&&!['light','heavy','lift','sweep','air','grab'].includes(a.key))return false;
    if(!Number.isInteger(a.t)||a.t>d.start+d.active+d.recover)return false;
    if(a.key==='baliseAnchor'&&!finiteBetween(a.anchorX,48,WIDTH-48))return false;
    if(a.key==='baliseReel'&&a.t>=d.start&&!(a.failed===true||finiteBetween(a.destination,48,WIDTH-48)))return false;
    return true;
  }

  function drawOriginalProp(m,id,name,x,y,height) {
    const descriptor=m.originalProps[id]?.[name];if(!descriptor||!ready(descriptor.image))return false;
    const crop=nativeCrop(descriptor.image,descriptor),width=height*crop[2]/crop[3];
    m.ctx.drawImage(descriptor.image,...crop,x-width*descriptor.anchorX,y-height*descriptor.baselineY,width,height);
    return true;
  }
  function drawOriginalFighter(m,f,index) {
    const c=m.ctx,frames=m.teams?m.teamFrames[f.teamSide][f.teamSlot]:m.fighterFrames[index];
    const feet=FLOOR-f.y,face=f.face>0?'right':'left',a=f.act;
    const decided=['finish','cinema','roundover','ended'].includes(m.phase)&&m.winner;
    const movement=m.phase==='fight'&&f.grounded&&!a&&!f.taunt&&!f.guard&&!f.stun&&!f.blockStun&&!f.crouch&&(f.dash||!!f.keys.left!==!!f.keys.right);
    let pose=decided?(m.winner===index+1?'victory':'fall'):f.stun?'hurt':f.taunt?'taunt':
      (f.guard||f.blockStun)?'guard':
      a?({balise:'tether',baliseAnchor:'anchor',baliseReel:'reel',baliseAssist:'tether',baliseLight:'light',baliseHeavy:'heavy',baliseLift:'heavy',sweep:'light',air:'light',grab:'heavy'}[a.key]||'stance'):
      !f.grounded?'jump':f.crouch?'crouch':movement?(Math.sin(f.walk)>=0?'walk1':'walk2'):'stance';
    // The received fall drawings show a grounded, living defeat. The compact
    // jump pose is used for both ascent and descent; velocity does not topple the body.
    const requested=frames.original?.[pose]?.[face],fallback=frames.original?.stance?.[face];
    const descriptor=ready(requested?.image)?requested:fallback;
    oval(c,f.x,FLOOR+1,Math.max(11,29-f.y*.08),4.3,'rgba(4,11,14,.54)');
    if(m.mode==='training'&&m.training.hitboxes){
      const edge=clamp(f.x+f.face*moves.balise.reach,0,WIDTH);
      c.save();c.setLineDash([4,4]);line(c,f.x,FLOOR+17,edge,FLOOR+17,'#e9b675',1);c.restore();
      label(c,'T · 2,4 CORPS',edge,FLOOR+32,9,'#e9b675','center');
    }
    if(a?.key==='baliseAnchor'&&a.t<moves.baliseAnchor.start){
      const x=a.anchorX;c.save();c.globalAlpha=.35+a.t/48;
      oval(c,x,FLOOR-2,12,3,'#f1a05c');line(c,f.x+f.face*18,feet-73,x,FLOOR-8,'#f1a05c',1);c.restore();
    }
    if(a&&['balise','baliseAssist'].includes(a.key)){
      const data=moves[a.key],out=a.t>=data.start&&a.t<data.start+data.active;
      const reach=out?data.reach:Math.max(18,data.reach*(1-Math.max(0,a.t-data.start-data.active)/data.recover))*(a.t<data.start?.18:1);
      const x=clamp(f.x+f.face*reach,0,WIDTH);
      line(c,f.x+f.face*15,feet-72,x,feet-31,out?'#f4bd7e':'#9e866c',out?2:1);
      drawOriginalProp(m,f.id,'ropeHook',x,feet-27,14);
    }
    if(a?.key==='baliseReel'){
      const destination=a.destination ?? f.marker?.x;
      if(Number.isFinite(destination))line(c,f.x,feet-68,destination,FLOOR-8,'#f4bd7e',2);
    }
    if(ready(descriptor?.image)){
      const crop=nativeCrop(descriptor.image,descriptor),height=f.spec.h*descriptor.heightRatio,width=height*crop[2]/crop[3];
      c.save();
      if(f.flash>1&&f.flash%4<2)c.filter='brightness(1.5)';
      // True left/right source drawings preserve the anatomical equipment side.
      c.drawImage(descriptor.image,...crop,f.x-width*descriptor.anchorX,feet-height*descriptor.baselineY,width,height);
      c.restore();
    }else{
      c.fillStyle=f.spec.suit;c.fillRect(f.x-14,feet-f.spec.h+26,28,f.spec.h*.58);
      oval(c,f.x,feet-f.spec.h+16,12,16,f.spec.skin);
    }
    if(f.guard){c.strokeStyle=f.blockStun?'#f9e0bd':'#d8a268';c.lineWidth=1.5;c.beginPath();c.ellipse(f.x+f.face*12,feet-88,32,65,0,f.face>0?-1.13:2.01,f.face>0?1.13:4.27);c.stroke();}
    if(f.noticeTTL>0)label(c,f.notice,f.x,feet-f.spec.h-12,10,'#fff0b6','center');
    if(f.combo>1&&f.comboTTL)label(c,f.combo+' COUPS',f.x,feet-f.spec.h-27,13,'white','center');
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
  function makeShot(m,owner,kind,x,y,vx,ttl,emitter=m.f[owner]) {
    if(m.teams&&m.shots.filter(shot=>shot.owner===owner).length>=3)return false;
    m.shots.push({owner,kind,x,y,vx,ttl,age:0,...(m.teams?{member:emitter.teamSlot}:{})});
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
    kind=moveBase(kind);
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
    const team=m.teams?.[attacker.teamSide];
    const scaling=team?Math.max(.45,1-Math.max(0,team.combo-1)*.08):1;
    const damage=Math.round(d.damage*attacker.spec.power*scaling);
    if (!blocked && m.parcel === 'intact' && victim === m.f[0]) {
      m.parcel='broken'; victim.notice='SCELLÉ ROMPU'; victim.noticeTTL=75;
    }
    victim.hp=clamp(victim.hp-(blocked?0:damage),0,100);
    victim.balance=clamp(victim.balance-d.balance*(blocked?1.25:.76),0,100);victim.postHit=58;
    attacker.chiral=clamp(attacker.chiral+(blocked?2:4),0,100);victim.chiral=clamp(victim.chiral+(blocked?2:3),0,100);
    victim.vx+=face*(d.rope && blocked?0:d.push)*(blocked?.44:1);let shattered=false;
    if (blocked) {victim.blockStun=Math.max(victim.blockStun,9);tone(330,.075,'square',.019,110);}
    else {
      if(victim.taunt){victim.notice='';victim.noticeTTL=0;}
      delete victim.taunt;
      victim.stun=Math.max(victim.stun,d.stun);victim.act=null;victim.dash=0;victim.flash=7;victim.guard=false;attacker.combo++;attacker.comboTTL=d.stun+18;
      if(team){team.combo++;team.comboTTL=d.stun+18;team.members.forEach(f=>{f.combo=team.combo;f.comboTTL=team.comboTTL;});}
      if(m.teams){const defending=m.teams[victim.teamSide];if(defending.busy?.kind==='tag'&&victim===m.f[victim.teamSide])finishTeamBusy(defending);if(defending.busy?.kind==='assist'&&victim===teamSupport(m,victim.teamSide))defending.busy.interrupted=true;}
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
    if(m.teams)return teamContacts(m);
    if(originalKits)originalObjectContacts(m);
    const bodies=m.f.map(hurt), events=[];
    let passage=null;
    m.f.forEach((f,i)=>{
      const rect=strike(f), o=m.f[1-i], a=f.act;
      if (rect && !immune(o) && (!moves[a.key].groundedOnly || o.grounded) && intersects(rect,bodies[1-i]) && !(a.key==='grab' && (!o.grounded || o.stun))) {
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
      // Resolve every contact (including a simultaneous trade) before the
      // passage is considered. A block, projectile or ordinary light hit never
      // activates it, and an impact must point outwards from the fighting lane.
      if (ok && !passage && m.link && !m.link.used && e.a && ['heavy','grab'].includes(moveBase(e.kind)) && attacker.grounded && defender.grounded) {
        const rule=stageLinks[m.stage],side=defender.x<=48+rule.edge ? -1 : defender.x>=WIDTH-48-rule.edge ? 1 : 0;
        if (side && e.face===side && side*(defender.x-attacker.x)>0) passage={side,attacker:e.i+1};
      }
    }
    return passage;
  }
  function teamContacts(m) {
    if(originalKits)originalObjectContacts(m);
    const events=[],targets=side=>[m.f[side],teamSupport(m,side)].filter(f=>f&&f.hp>0);
    const add=(attacker,victim,kind,d,face,a)=>events.push({attacker,victim,kind,d,face,a});
    m.f.forEach((f,side)=>{
      const box=strike(f),action=f.act;
      if(box)for(const victim of targets(1-side))if(!immune(victim)&&(!moves[action.key].groundedOnly||victim.grounded)&&intersects(box,hurt(victim))&&!(action.key==='grab'&&(!victim.grounded||victim.stun))){
        action.hit=true;add(f,victim,action.key,moves[action.key],f.face,action);
      }
      const support=teamSupport(m,side),busy=m.teams[side].busy;
      const originalAssist=originalKits?.assists[support?.id];
      if(originalAssist&&busy&&!busy.interrupted&&!busy.hit&&busy.frame>=originalAssist.entry&&busy.frame<originalAssist.entry+originalAssist.active){
        const box=strike(support),data=moves[originalAssist.key];
        const victim=targets(1-side).filter(v=>!immune(v)&&(!data.groundedOnly||v.grounded)&&box&&intersects(box,hurt(v))).sort((a,b)=>Math.abs(a.x-support.x)-Math.abs(b.x-support.x))[0];
        if(victim){busy.hit=true;support.act.hit=true;add(support,victim,originalAssist.key,data,support.face);}
      }
      if(support?.id==='fragile'&&busy&&!busy.interrupted&&!busy.hit&&busy.frame>=18&&busy.frame<22){
        const edge=support.x+support.face*108,box={l:Math.min(support.x,edge),r:Math.max(support.x,edge),t:FLOOR-139,b:FLOOR-21};
        for(const victim of targets(1-side))if(!immune(victim)&&intersects(box,hurt(victim))){busy.hit=true;add(support,victim,'fragile',moves.fragile,support.face);}
      }
    });
    for(const shot of m.shots){
      shot.age++;shot.x+=shot.vx;shot.ttl--;if(shot.kind==='recall')shot.y-=16;
      const rx=shot.kind==='higgs'?43:shot.kind==='recall'?46:shot.kind==='memory'?66:shot.kind==='gate'?18:shot.kind==='crate'?21:13;
      const ry=shot.kind==='higgs'?51:shot.kind==='gate'?72:shot.kind==='memory'?45:shot.kind==='crate'?18:9;
      const box={l:shot.x-rx,r:shot.x+rx,t:shot.y-ry,b:shot.y+ry};
      const victim=targets(1-shot.owner).filter(f=>!immune(f)&&intersects(box,hurt(f))).sort((a,b)=>Math.abs(a.x-shot.x)-Math.abs(b.x-shot.x))[0];
      if(victim){const attacker=m.teams[shot.owner].members[shot.member];add(attacker,victim,shot.kind,shotHit[shot.kind],shot.vx?Math.sign(shot.vx):Math.sign(victim.x-attacker.x)||1);shot.ttl=0;}
    }
    m.teams.forEach((team,side)=>team.members.forEach(f=>{
      if(f.hp<=0){f.marker=null;return;}
      const active=f===m.f[side],mark=f.marker,opponents=targets(1-side);
      if(active&&f.act?.key==='mule'){
        const action=f.act,wave=action.t-moves.mule.start;
        if(wave>=0&&wave<moves.mule.active&&!action.hit){
          const opponent=opponents[0],distance=Math.abs(opponent.x-f.x),radius=(wave+1)*38;
          if(distance>=radius-61&&distance<=radius+22&&!immune(opponent)){action.hit=true;if(!opponent.guard)f.scan={x:opponent.x,ttl:120};}
        }
      }
      if(active&&mark?.kind==='crate'&&mark.travel){
        const from=mark.x,recalling=mark.travel==='retrieve',to=recalling?f.x:mark.endX;
        mark.x+=clamp(to-from,recalling?-14:-10,recalling?14:10);
        const box={l:Math.min(from,mark.x)-cargoWidth/2,r:Math.max(from,mark.x)+cargoWidth/2,t:FLOOR-cargoHeight,b:FLOOR};
        if(!mark.hit)for(const victim of opponents)if(!immune(victim)&&intersects(box,hurt(victim))){mark.hit=true;add(f,victim,mark.travel,shotHit[mark.travel],Math.sign(to-from)||f.face);}
        if(mark.x===to){if(recalling)f.marker=null;else mark.travel=null;}
      }
      if(mark?.kind==='mine'&&mark.ttl<=130){
        const box={l:mark.x-22,r:mark.x+22,t:FLOOR-23,b:FLOOR+1};
        for(const victim of opponents)if(!immune(victim)&&intersects(box,hurt(victim))){add(f,victim,'mine',shotHit.mine,Math.sign(victim.x-mark.x)||f.face);f.marker=null;}
      }
    }));
    m.shots=m.shots.filter(s=>s.ttl>0&&s.x>-60&&s.x<WIDTH+60);
    // Gather all contacts before applying damage. Active/support trades have
    // the same tick semantics on both sides; a late KO cannot erase a hit.
    for(const event of events){
      if(intercept(m,event.victim,event.attacker,event.kind,!!event.a))continue;
      const ok=hit(m,event.attacker,event.victim,event.kind,event.d,event.face);
      if(event.a)event.a.hitConfirmed=ok;
    }
    return null;
  }
  function freshLink(rule) {
    return {id:rule.id,version:rule.version,zone:rule.source,used:0,side:0,attacker:0};
  }
  function neutralForPassage(m) {
    // Resource values and physical held inputs survive. Transient attacks,
    // buffers, targets and projectiles belong to the departed zone only.
    m.f=m.f.map(f=>({...fighter(f.id,f.x,f.face),hp:f.hp,balance:f.balance,chiral:f.chiral,keys:{...f.keys}}));
    m.shots=[];m.sparks=[];m.hstop=0;m.shake=0;
  }
  function beginPassage(m,passage) {
    const rule=stageLinks[m.stage];
    Object.assign(m.link,passage,{used:1});
    neutralForPassage(m);
    m.phase='transition';m.phaseTicks=rule.duration;
    notify(m,true);
  }
  function arriveFromPassage(m) {
    const rule=stageLinks[m.stage],{side,attacker}=m.link;
    neutralForPassage(m);
    m.f[attacker-1].x=WIDTH/2-side*rule.arrivalGap/2;
    m.f[2-attacker].x=WIDTH/2+side*rule.arrivalGap/2;
    m.f[attacker-1].face=side;m.f[2-attacker].face=-side;
    m.link.zone=rule.destination;m.scene=m.linkScenes[m.link.zone];
    m.camera=0;m.phase='fight';m.phaseTicks=0;
    notify(m,true);
  }
  function validLinkCheckpoint(m,state) {
    const rule=stageLinks[m.stage],link=state.link;
    if (!rule) return !Object.hasOwn(state,'link') && state.phase!=='transition';
    if (!link || link.id!==rule.id || link.version!==rule.version || ![0,1].includes(link.used)) return false;
    if (!link.used) return link.zone===rule.source && link.side===0 && link.attacker===0 && state.phase!=='transition';
    if (![-1,1].includes(link.side) || ![1,2].includes(link.attacker)) return false;
    if (state.phase==='transition') return link.zone===rule.source && Number.isInteger(state.phaseTicks) && state.phaseTicks>0 && state.phaseTicks<=rule.duration;
    return link.zone===rule.destination;
  }
  function resetRound(m) {
    m.round++;m.beat=0;m.winner=0;m.phase='intro';m.phaseTicks=66;m.remaining=75*60;m.sudden=false;m.hstop=0;m.shots=[];m.sparks=[];
    if (m.link) {m.link=freshLink(stageLinks[m.stage]);m.scene=m.linkScenes[m.link.zone];}
    if(m.teams){m.teams=freshTeams(m.teamSelection);syncTeamActors(m);}else m.f=m.ids.map((id,i)=>fighter(id,i?818:462,i?-1:1));notify(m,true);
  }
  function winRound(m,index,reason) {
    m.winner=index+1;m.wins[index]++;m.reason=reason;
    m.phase=m.wins[index]>=m.toWin && reason==='ko' && !originalIds.includes(m.f[index].id)?'finish':'roundover';m.phaseTicks=m.phase==='finish'?135:96;
    m.shots=[];clearControls(m);if(m.teams)m.teams.forEach(finishTeamBusy);(m.teams?m.teams.flatMap(team=>team.members):m.f).forEach(f=>{delete f.taunt;f.marker=null;f.scan=null;f.act=null;f.stun=0;f.crouch=false;});tone(145,.35,'sine',.045,71);notify(m,true);
  }
  function activateFinish(m) {
    if(m.phase!=='finish')return;
    m.finisher=true;m.phase='cinema';m.phaseTicks=108;m.shake=6;
    const f=m.f[m.winner-1],v=m.f[2-m.winner];
    f.face=v.x>=f.x?1:-1;burst(m,v.x,FLOOR-68,f.spec.trim,35);tone(220,.62,'sine',.06,55);notify(m,true);
  }
  function finishMatch(m) {
    m.phase='ended';if (!m.silentResimulation) stopAudio();notify(m,true);
    if (m.onEnd) {
      const result={vitality:Math.ceil(m.f[0].hp),parcel:m.parcel,winner:m.winner,loser:3-m.winner,rounds:m.wins.slice(),reason:m.reason,finisher:m.finisher,stage:m.stage,fighters:m.ids.slice()};
      if(m.teams){result.teams=teamSnapshot(m);if(!m.winner)result.loser=0;}
      if (m.link) result.link={...m.link};
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
        else if(code>=40) {
          applyControl(m,1+Math.floor((code-40)/2),'taunt',!!(code%2));
        } else {
          const index=Math.floor(code/2);
          applyControl(m,1+Math.floor(index/keyActions.length),keyActions[index%keyActions.length],!!(code%2));
        }
      }
      if (m.tick>=m.playback.ticks) {
        m.phase='ended';
        stopAudio();
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
      else if (m.phase==='transition' && m.phaseTicks<=0) arriveFromPassage(m);
      else if(m.phase==='finish' && m.mode!=='local' && m.winner===2 && m.phaseTicks===84) activateFinish(m);
      else if (['finish','cinema','roundover'].includes(m.phase) && m.phaseTicks<=0) {
        if (m.wins.some(w=>w>=m.toWin)) finishMatch(m);else resetRound(m);
      }
      return;
    }
    if (m.hstop>0) {m.hstop--;return;}
    m.beat = (m.beat + 1) % 60;
    const teamLifeBefore=m.teams?.map(team=>team.members.reduce((sum,f)=>sum+f.hp,0));
    if(m.teams){
      advanceTeams(m);
      if(m.mode==='cpu'&&m.tick%30===0){const team=m.teams[1];if(m.f[1].hp<35&&team.members[1-team.active].hp>m.f[1].hp)requestTeamAction(m,1,'tag');else if(Math.abs(m.f[0].x-m.f[1].x)<350)requestTeamAction(m,1,'assist');}
    }
    if (m.mode!=='local') cpu(m,m.f[1],m.f[0]);
    const [a,b]=m.f;updateFighter(m,a,b,0);updateFighter(m,b,a,1);
    const delta=b.x-a.x, overlap=44-Math.abs(delta);
    if(overlap>0 && Math.abs(a.y-b.y)<105) {
      const dir=delta>=0?1:-1;a.x=clamp(a.x-dir*overlap/2,48,WIDTH-48);b.x=clamp(b.x+dir*overlap/2,48,WIDTH-48);
    }
    const passage=contacts(m),knockedOut=a.hp<=0 || b.hp<=0;
    m.camera=mix(m.camera,clamp(((a.x+b.x)/2-WIDTH/2)/3,-96,96),.035);
    let expired=false;
    if(m.teams){resolveTeamRound(m,teamLifeBefore);notify(m);return;}
    if(m.mode==='training') {
      for(const f of m.f) if(f.hp<=0){f.hp=100;f.balance=100;f.chiral=100;f.notice='VITALITÉ RÉTABLIE';f.noticeTTL=70;}
    } else {
      m.remaining=Math.max(0,m.remaining-1);
      expired=!m.remaining;
      if ((a.hp<=0 && b.hp<=0) || (!m.remaining && a.hp===b.hp)) {
        m.sudden=true;a.hp=1;b.hp=1;m.remaining=15*60;m.shots=[];a.x=462;b.x=818;
        for(const f of m.f) {delete f.taunt;f.marker=null;f.act=null;f.stun=0;f.queue=[];f.vx=0;f.vy=0;f.y=0;f.grounded=true;f.notice='PROCHAIN IMPACT DÉCISIF';f.noticeTTL=85;}
      } else if (a.hp<=0 || b.hp<=0) winRound(m,a.hp>0?0:1,'ko');
      else if (!m.remaining) winRound(m,a.hp>b.hp?0:1,'time');
    }
    // K.O., double K.O., tied time and the dojo's vitality reset have priority.
    // A late hit cannot turn a decided round into a passage or an extra attack.
    if (passage && !knockedOut && !expired && m.phase==='fight') beginPassage(m,passage);
    notify(m);
  }

  function makeScenery(stage) {
    const pick = randomSeed(stage.charCodeAt(0) * 79);
    const rain = Array.from({length: 60}, () => ({x: pick() * 1536, y: pick() * HEIGHT, speed: 2 + pick() * 4}));
    return {rain, legacy:null, back:null, distant:null, middle:null, floor:null, front:null, geometry:{}};
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

  // Source rectangles use native pixels. Only the visible alpha bounds are
  // sampled; scaling always keeps that rectangle's aspect ratio. A bad or absent
  // measurement falls back to the full source, never to a distorted rectangle.
  function nativeCrop(image, geometry) {
    const crop = geometry?.crop;
    if (Array.isArray(crop) && crop.length === 4 && crop.every(Number.isFinite) &&
      crop[0] >= 0 && crop[1] >= 0 && crop[2] > 0 && crop[3] > 0 &&
      crop[0] + crop[2] <= image.naturalWidth && crop[1] + crop[3] <= image.naturalHeight) return crop;
    return [0,0,image.naturalWidth,image.naturalHeight];
  }
  const finiteOr = (value, fallback) => Number.isFinite(value) ? value : fallback;
  const generatedPoseRatios = {guard:1,crouch:.69,rise:.90,apex:.82,fall:.94};
  const projectileSizes = {sam:34,higgs:86,cliff:45,recall:54,gate:36,heartman:30,memory:128};

  function drawProjectileSprite(m, shot) {
    const image = m.projectileImages?.[shot.kind];
    if (!ready(image)) return false;
    const geometry = m.projectileGeometry?.[shot.kind] || {};
    const crop = nativeCrop(image,geometry);
    const width = Math.max(1,finiteOr(geometry.width,projectileSizes[shot.kind] || 40));
    const height = width * crop[3] / crop[2];
    const floorAnchored = shot.kind === 'higgs' || shot.kind === 'gate';
    const anchorX = finiteOr(geometry.anchorX,.5), anchorY = finiteOr(geometry.anchorY,floorAnchored ? 1 : .5);
    const c = m.ctx;
    c.save();
    c.translate(shot.x,floorAnchored ? FLOOR : shot.y);
    c.scale(Math.sign(shot.vx) || m.f[shot.owner].face,1);
    c.drawImage(image,...crop,-width*anchorX,-height*anchorY,width,height);
    c.restore();
    return true;
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

  function sceneryFrame(m) { return m.staticScenery ? m.staticScene : m; }
  function sceneryCamera(m) { return sceneryFrame(m).camera * (m.reducedEffects ? .2 : 1); }

  function sceneryLayer(m, key, speed, defaults) {
    const image=m.scene[key];
    if (!ready(image)) return;
    const config=m.scene.geometry[key] || {};
    const width=WIDTH+defaults.margin*2;
    const height=width*image.naturalHeight/image.naturalWidth;
    const base=Number.isFinite(config.base) ? config.base : defaults.base;
    const anchorY=Number.isFinite(config.anchorY) ? clamp(config.anchorY,0,1) : defaults.anchorY;
    const alpha=Number.isFinite(config.alpha) ? clamp(config.alpha,0,1) : defaults.alpha;
    const c=m.ctx;
    c.save(); c.globalAlpha=alpha;
    c.drawImage(image,-defaults.margin-sceneryCamera(m)*speed,base-height*anchorY,width,height);
    c.restore();
  }

  function ambientScenery(m) {
    if (m.reducedEffects) return;
    const c=m.ctx, frame=sceneryFrame(m), tick=frame.tick, camera=sceneryCamera(m), zone=stageId(m);
    const between=['roundover','finish','cinema','ended'].includes(frame.phase);
    const cycle=(ticks,offset=0)=>((tick+offset)%ticks)/ticks;
    const pulse=(ticks,offset=0)=>(1-Math.cos(cycle(ticks,offset)*TAU))*.5;
    c.save();
    // Scenery cannot cover the floor, feet, or combat markers. All these events
    // are computed from the recorded clock; drawing them consumes no RNG state.
    c.beginPath(); c.rect(0,90,WIDTH,FLOOR-118); c.clip();
    c.translate(-camera*.31,0);
    if (zone==='shore') {
      // A quiet tide during play; the shore advances further between rounds.
      for (let i=0;i<3;i++) {
        const tide=cycle(390,i*96), rise=Math.sin(tide*Math.PI);
        const y=407+i*14+rise*(between ? 28 : 10);
        c.beginPath();
        for (let x=-70;x<=WIDTH+70;x+=24) {
          const yy=y+Math.sin(x*.011+tide*TAU)*2.5;
          if (x===-70) c.moveTo(x,yy); else c.lineTo(x,yy);
        }
        c.strokeStyle='rgba(183,211,210,'+((1-tide)*.18).toFixed(3)+')';
        c.lineWidth=1.5; c.stroke();
      }
    } else if (zone==='terminal') {
      // Small shutters and their warm work light stay in a remote side bay.
      const closed=between ? pulse(192) : .14+.08*pulse(420);
      c.fillStyle='rgba(179,199,195,.09)'; c.fillRect(1032,281,126,112);
      c.fillStyle='rgba(29,52,60,.34)';
      c.fillRect(1032,281,63*closed,112); c.fillRect(1158-63*closed,281,63*closed,112);
      line(c,1035,279,1155,279,'rgba(223,193,130,'+(.18+.13*pulse(180)).toFixed(3)+')',3);
      for (let i=0;i<3;i++) oval(c,1044+i*13,407,2.2,1.4,i===Math.floor(cycle(180)*3)?'#9bbac1':'#526b71');
    } else if (zone==='battlefield') {
      // Distant memories fade during the result; they are never combat summons.
      const fade=between ? clamp(frame.phaseTicks/96,0,1) : .65+.2*pulse(480);
      for (const [x,y] of [[140,357],[213,364],[1070,344]]) {
        c.globalAlpha=fade*.2;
        oval(c,x,y,4,5,'#a1a5a0');
        line(c,x,y+5,x-2,y+27,'#9aa49c',6);
        line(c,x-2,y+27,x-8,y+37,'#9aa49c',3);
        line(c,x-2,y+27,x+4,y+37,'#9aa49c',3);
      }
      c.globalAlpha=1;
      line(c,-40,402,WIDTH+40,402,'rgba(185,174,149,'+(.025+.035*pulse(340)).toFixed(3)+')',8);
    } else if (zone==='mule-camp' || zone==='mule-camp-dry') {
      // Amber beacons have no expanding ring, unlike the fighter's cargo scan.
      for (const [index,x] of [124,244,1090].entries()) {
        const glow=Math.pow(pulse(240,index*62),10);
        line(c,x,311,x,354,'rgba(155,143,101,.12)',1);
        oval(c,x,309,3,2,'rgba(220,178,93,'+(.12+glow*.35).toFixed(3)+')');
        if (glow>.45) line(c,x-6,309,x+6,309,'rgba(238,202,122,.15)',1);
      }
    } else if (zone==='heartman-lab') {
      // A small background ECG trace is unrelated to Heartman's gameplay beat.
      const x=113,y=347,w=74,h=30, sweep=cycle(159)*w;
      c.fillStyle='rgba(8,28,34,.35)'; c.fillRect(x,y,w,h);
      c.beginPath();
      for (let i=0;i<=w;i+=2) {
        const p=((i-sweep+w)%w)/w;
        const spike=p>.33 && p<.42 ? Math.sin((p-.33)/.09*TAU)*10 : Math.sin(p*TAU)*1.5;
        if (!i) c.moveTo(x+i,y+h*.55-spike); else c.lineTo(x+i,y+h*.55-spike);
      }
      c.strokeStyle='rgba(157,205,191,.42)'; c.lineWidth=1; c.stroke();
      line(c,x+sweep,y+3,x+sweep,y+h-3,'rgba(152,214,202,.12)',1);
    } else if (zone==='mama-workshop') {
      // Slack cable and a workshop status lamp, kept above the fighting lane.
      const sway=Math.sin(tick*.014)*3;
      c.beginPath();c.moveTo(1040,124);c.quadraticCurveTo(1025+sway,183,1062+sway,215);
      c.strokeStyle='rgba(128,153,149,.35)'; c.lineWidth=2; c.stroke();
      oval(c,1062+sway,216,3,4,'rgba(171,209,193,'+(.2+.18*pulse(290)).toFixed(3)+')');
      line(c,79,395,157,395,'rgba(120,187,177,'+(.04+.07*pulse(310)).toFixed(3)+')',1.5);
    } else if (zone==='ruined-factory') {
      // Air escaping a damaged side conduit carries dust slowly downward.
      for (let i=0;i<13;i++) {
        const drift=cycle(260+i*7,i*41);
        const x=1080+Math.sin(i*2.7+drift*3)*26+drift*27;
        const y=226+drift*142;
        oval(c,x,y,1.1+i%3*.45,.8+i%2*.45,'rgba(172,155,133,'+((1-drift)*.16).toFixed(3)+')');
      }
      line(c,1059,222,1091,222,'rgba(149,117,83,'+(.03+.04*pulse(620)).toFixed(3)+')',1);
    } else if (zone==='timefall-shelter') {
      // Drops come only from the outer roof edges; the central dry lane stays clear.
      for (let i=0;i<12;i++) {
        const fall=cycle(68+i*3,i*29), x=i<6?70+i*12:1114+(i-6)*13;
        const y=203+fall*252;
        line(c,x,y,x-.7,y+4+fall*4,'rgba(167,203,207,'+(.08+fall*.11).toFixed(3)+')',1);
        if (fall>.84) {
          c.beginPath();c.ellipse(x-1,462,(fall-.84)*31,1.1,0,0,TAU);
          c.strokeStyle='rgba(151,191,194,'+((1-fall)*.6).toFixed(3)+')';c.stroke();
        }
      }
    } else if (zone==='tar-basin') {
      // Small matte rings stay far from Higgs's bright combat marks.
      for (const [index,x] of [171,1048,1151].entries()) {
        const ring=cycle(310,index*103), y=426+(index%2)*21;
        c.beginPath();
        c.ellipse(x,y,3+ring*26,1+ring*4,0,0,TAU);
        c.strokeStyle='rgba(146,143,128,'+((1-ring)*.17).toFixed(3)+')';c.lineWidth=1;c.stroke();
        if (ring<.16) oval(c,x,y-2-Math.sin(ring/.16*Math.PI)*4,3,2,'rgba(102,108,108,.23)');
      }
    } else if (zone==='mountain-pass' || zone==='mountain-knot-approach') {
      // Spindrift follows the far ridge in sparse lateral strokes.
      for (let i=0;i<18;i++) {
        const gust=cycle(440,i*31), x=-80+gust*(WIDTH+160), y=385+Math.sin(i*2.4+gust*5)*25;
        line(c,x,y,x+8+i%4*3,y-1,'rgba(211,226,232,'+(Math.sin(gust*Math.PI)*.18).toFixed(3)+')',1);
      }
    }
    c.restore();
  }

  function weatherScenery(m) {
    const c=m.ctx, s=m.scene, theme=stages[stageId(m)];
    if (m.reducedEffects || !theme.weather) return;
    const frame=sceneryFrame(m);
    const flakes = theme.weather === 'snow';
    const dust = theme.weather === 'dust';
    const embers = theme.weather === 'embers';
    c.beginPath();
    for (const drop of s.rain) {
      const drift = flakes ? Math.sin(frame.tick * .025 + drop.x) * 14 : 0;
      const x = ((drop.x - frame.camera * .38 - frame.tick * .38 + drift) % 1536 + 1536) % 1536 - 128;
      const speed = dust || flakes ? drop.speed * .24 : drop.speed;
      const y = (drop.y + frame.tick * speed) % HEIGHT;
      if (theme.weather === 'shelter' && x > WIDTH * .18 && x < WIDTH * .88) continue;
      c.moveTo(x, y);
      c.lineTo(x - (dust ? 3 : 1), y + (dust ? 0 : flakes ? 1 : drop.speed));
    }
    c.lineWidth = flakes ? 2 : 1;
    c.strokeStyle = embers || dust ? 'rgba(251,210,151,.28)' : 'rgba(207,226,224,.28)';
    c.stroke();
  }

  function scenery(m) {
    const c=m.ctx, s=m.scene, theme=stages[stageId(m)];
    c.fillStyle=theme.sky; c.fillRect(0,0,WIDTH,HEIGHT);
    const layered=ready(s.back) && ready(s.distant) && ready(s.floor);
    const background=layered ? s.back : s.legacy;
    if (ready(background)) {
      // Cover the viewport plus camera overscan without distorting the panorama.
      const ratio=background.naturalWidth/background.naturalHeight;
      const floorY=!layered&&Number.isFinite(s.geometry?.legacy?.floorY)&&s.geometry.legacy.floorY>.05&&s.geometry.legacy.floorY<.98?s.geometry.legacy.floorY:null;
      const height=floorY===null?Math.max((WIDTH+56)/ratio,HEIGHT+24):Math.max((WIDTH+56)/ratio,(FLOOR+12)/floorY,(HEIGHT-FLOOR+12)/(1-floorY));
      const width=height*ratio,y=floorY===null?(HEIGHT-height)/2:FLOOR-height*floorY;
      c.drawImage(background,(WIDTH-width)/2-sceneryCamera(m)*.14,y,width,height);
    }
    if (layered) sceneryLayer(m,'distant',.27,{margin:48,base:552,anchorY:.96,alpha:1});
    sceneryLayer(m,'middle',.43,{margin:48,base:FLOOR-12,anchorY:.97,alpha:.92});
    ambientScenery(m);
    weatherScenery(m);
    if (layered) sceneryLayer(m,'floor',.62,{margin:80,base:FLOOR,anchorY:.3,alpha:1});
    const shade=c.createLinearGradient(0,HEIGHT*.45,0,HEIGHT);
    shade.addColorStop(0,'rgba(2,12,17,0)'); shade.addColorStop(1,'rgba(2,12,17,.42)');
    c.fillStyle=shade; c.fillRect(0,0,WIDTH,HEIGHT);
  }

  function foreground(m) {
    const c = m.ctx;
    if (ready(m.scene.front)) {
      const width = WIDTH + 160;
      const height = width * m.scene.front.naturalHeight / m.scene.front.naturalWidth;
      c.drawImage(m.scene.front, -80 - sceneryCamera(m) * .8, HEIGHT - height, width, height);
    } else {
      // Near silhouettes stay below the fighting lane and move faster than the backdrop.
      const x = -sceneryCamera(m) * .76;
      c.save();
      c.translate(x, 0);
      if (stageId(m) === 'terminal' || stageId(m)==='terminal-hangar') {
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
    if(originalIds.includes(f.id)){drawOriginalFighter(m,f,index);return;}
    const c = m.ctx, feet = FLOOR - f.y;
    const act = f.act;
    const {base, tailored, geometry, generatedPoses, poseGeometry, tailoredPoseGeometry, tauntGeometry} = m.teams?m.teamFrames[f.teamSide][f.teamSlot]:m.fighterFrames[index];
    // An unavailable outfit gesture waits on its own stance (or the neutral
    // loading silhouette), including when that stance has not decoded yet.
    const frameFor = pose => f.taunt && pose==='stance' && tailored.stance ? tailored.stance :
      ready(tailored[pose]) ? tailored[pose] : base[pose];
    const movement = m.phase === 'fight' && f.grounded && !f.act && !f.taunt && !f.guard && !f.stun &&
      !f.blockStun && !f.crouch && (f.dash || !!f.keys.left !== !!f.keys.right);
    const phase = act ? act.t / (moves[act.key].start + moves[act.key].active + moves[act.key].recover) : 0;
    const reach = act ? Math.sin(Math.PI * Math.min(1, Math.max(0, phase))) : 0;
    const performing = act && act.t >= moves[act.key].start * .61 && phase < .85;
    let pose = 'stance';
    if (f.stun > 0) pose = 'hit';
    else if (f.taunt) {
      const phasePose=tauntPoses[tauntPhase(f.taunt.frame)];
      // Reduced effects retain the established stance/hold/stance sequence;
      // the two new decorative drawings do not add motion to that setting.
      if((!m.reducedEffects || phasePose==='taunt') && ready(base[phasePose]))pose=phasePose;
    }
    else if (performing) pose = 'action';
    else if (!f.grounded) {
      const phase = f.vy > 4 ? 'rise' : f.vy < -4 ? 'fall' : 'apex';
      pose = ready(frameFor(phase)) ? phase : 'jump';
    } else if (f.crouch && ready(frameFor('crouch'))) pose = 'crouch';
    else if ((f.guard || f.blockStun) && ready(frameFor('guard'))) pose = 'guard';
    else if (movement && (f.dash || Math.sin(f.walk) >= 0)) pose = 'step';
    if (!ready(frameFor(pose))) pose = 'stance';
    const image = frameFor(pose);
    // Select geometry from the actual ready source: an unavailable outfit pose
    // falls back to the base image with that base image's own measured crop.
    const nativeGeometry = tauntGeometry[pose] || (image === tailored[pose]
      ? (tailoredPoseGeometry ? tailoredPoseGeometry[pose] || {} : null)
      : (generatedPoses[pose] && image === base[pose] ? poseGeometry[pose] || {} : null));
    const lost = m.winner && m.winner !== index + 1 && ['finish','cinema','roundover','ended'].includes(m.phase);
    const compression = pose === 'crouch' || pose === 'guard' ? 1 :
      f.crouch ? .69 : f.guard ? .93 : lost ? .84 : 1;
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
      if (f.flash > 1 && (f.flash % 4 < 2)) c.filter = 'brightness(1.5)';
      if (nativeGeometry) {
        const measured = nativeGeometry;
        const crop = nativeCrop(image,measured);
        const ratio = Math.max(.1,finiteOr(measured.heightRatio,generatedPoseRatios[pose] || 1));
        const h = height * ratio, w = h * crop[2] / crop[3];
        const anchor = finiteOr(measured.anchorX,.5), baseline = finiteOr(measured.baselineY,1);
        c.drawImage(image,...crop,-w*anchor + 9*reach,-h*baseline,w,h);
      } else {
        const h = height * (geometry[pose + 'Scale'] || 1);
        const frames = (pose === 'step' || pose === 'hit') ? geometry.motionFrames || 1 : 1;
        const srcWidth = image.naturalWidth / frames;
        const w = h * srcWidth / image.naturalHeight;
        const anchor = geometry[pose + 'Anchor'] ?? geometry.stanceAnchor;
        const baseline = geometry[pose + 'Baseline'] ?? 1;
        const weight = pose === 'hit' ? Math.min(1, f.stun / 8) : f.dash ? 1 : Math.sin(f.walk);
        const frame = clamp(Math.ceil(weight * frames)-1,0,frames-1);
        c.drawImage(image,frame * srcWidth,0,srcWidth,image.naturalHeight,-w * anchor + 9 * reach,-h * baseline,w,h);
      }
    } else {
      // A temporary silhouette fills the same collision space during image decoding.
      c.fillStyle = f.spec.suit;
      c.fillRect(-14,-height+26,28,height*.58);
      oval(c,0,-height+16,12,16,f.spec.skin);
      line(c,-7,-height*.36,-17,-2,f.spec.suit,12);
      line(c,7,-height*.36,18,-2,f.spec.suit,12);
    }
    c.restore();
    const parcelImage = m.parcel === 'broken' && ready(m.images.openParcel) ? m.images.openParcel : m.images.closedParcel;
    if (m.parcel && index===0 && ready(parcelImage)) {
      c.save(); c.translate(f.x-f.face*13,feet-height*.44); c.rotate(f.face * (m.parcel==='broken' ? .24 : -.06));
      const parcelHeight = 32 * parcelImage.naturalHeight / parcelImage.naturalWidth;
      c.drawImage(parcelImage,-16,-parcelHeight,32,parcelHeight); c.restore();
    }
    if (act?.key === 'feint' && act.origin !== undefined && act.t < moves.feint.start + moves.feint.active) {
      const elapsed = act.t - moves.feint.start;
      const echoX = act.origin + f.face * elapsed * 3;
      c.save();
      c.globalAlpha = .34 * (1 - elapsed / 12);
      c.translate(echoX, feet);
      c.scale(f.face, 1);
      if (ready(image)) {
        if (nativeGeometry) {
          const measured=nativeGeometry, crop=nativeCrop(image,measured);
          const h=height*Math.max(.1,finiteOr(measured.heightRatio,generatedPoseRatios[pose] || 1));
          const w=h*crop[2]/crop[3];
          c.drawImage(image,...crop,-w*finiteOr(measured.anchorX,.5),-h*finiteOr(measured.baselineY,1),w,h);
        } else {
          const width = height * image.naturalWidth / image.naturalHeight;
          c.drawImage(image, -width / 2, -height, width, height);
        }
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
    const effectFighters=m.teams?m.teams.flatMap(team=>team.members.filter((f,slot)=>slot===team.active||['mine','crate'].includes(f.marker?.kind))):m.f;
    for (const f of effectFighters) {
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
      } else if (kind === 'baliseAnchor') {
        if(!drawOriginalProp(m,f.id,'anchor',x,FLOOR,30)){
          oval(c,x,FLOOR-8,9,6,'#e9aa70');line(c,x,FLOOR-5,x,FLOOR-25,'#f2bd85',2);
        }
        line(c,x-12,FLOOR+5,x-12+24*ttl/originalKits.geometry.anchorTTL,FLOOR+5,'#efaa6c',2);
      } else if (kind === 'anchor') {
        oval(c,x,FLOOR-2,16,3,'#75cfc7');
        line(c,x-9,FLOOR-2,x,FLOOR-30,'#91ede0',2);
        line(c,x,FLOOR-30,x+9,FLOOR-2,'#91ede0',2);
        line(c,x-6,FLOOR-11,x+6,FLOOR-11,ICE,2);
      } else if (kind === 'memory') {
        oval(c,x,FLOOR-2,17,3,'#a77e73');
        if (ready(m.images.heartmanMonitor)) {
          const image=m.images.heartmanMonitor, width=30, height=width*image.naturalHeight/image.naturalWidth;
          c.drawImage(image,x-width/2,FLOOR-height,width,height);
          pulseTrace(c,x,FLOOR-height-8,18,7,'#ffc9ad');
        } else pulseTrace(c,x,FLOOR-20,18,9,'#ffc9ad');
      } else if (kind === 'beacon') {
        oval(c,x,FLOOR-2,22,4,'rgba(175,240,250,.65)');
        line(c,x,FLOOR-2,x,FLOOR-33,ICE,1.5);
      } else if (kind === 'mine') {
        if (ready(m.images.goldImprint)) {
          c.save();
          c.globalAlpha = ttl > 130 ? .45 : 1;
          c.drawImage(m.images.goldImprint,x-22,FLOOR-21,44,22);
          c.restore();
          if (ttl <= 130) oval(c,x,FLOOR-1,22,2,'rgba(239,186,96,.3)');
        } else {
          oval(c,x,FLOOR-2,17,4,ttl>130?'#8b784c':'#edc46e');
          for (let toe=-1; toe<=1; toe++) oval(c,x+toe*8,FLOOR-7,3,2,AMBER);
        }
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
      if (drawProjectileSprite(m,s)) continue;
      if(s.kind==='crate'){
        if(ready(m.images.cargo))c.drawImage(m.images.cargo,s.x-21,s.y-12,42,21);
        else {c.fillStyle='#414549';c.fillRect(s.x-21,s.y-12,42,21);line(c,s.x-10,s.y-12,s.x-10,s.y+9,AMBER,3);}
      } else if (s.kind === 'gate') {
        c.fillStyle='rgba(168,214,181,.18)'; c.fillRect(s.x-15,FLOOR-143,30,143);
        c.strokeStyle='#cae6ca'; c.lineWidth=2; c.strokeRect(s.x-15,FLOOR-143,30,143);
        line(c,s.x-15,FLOOR-128,s.x+15,FLOOR-110,ICE,2);
      } else if (s.kind === 'deck') {
        if (ready(m.images.bridgeDeck)) {
          c.save(); c.translate(s.x,s.y); c.scale(Math.sign(s.vx) || 1,1);
          c.drawImage(m.images.bridgeDeck,-18,-6,36,12); c.restore();
        } else {
          const tail=s.x-Math.sign(s.vx)*24;
          line(c,tail,s.y-4,s.x,s.y-4,'#b1f3ec',3);
          line(c,tail,s.y+5,s.x,s.y+5,'#79c0c0',2);
          line(c,tail,s.y+5,s.x,s.y-4,'#b1f3ec',2);
        }
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
    const display = m.mode==='training'?'∞':m.teams&&m.sudden?'DÉC.':String(Math.ceil(m.remaining/60)).padStart(2,'0');
    label(c,display,WIDTH/2,61,46,'#f7f6ed','center');
    label(c,m.mode==='training'?'DOJO':'MANCHE '+m.round,WIDTH/2,83,12,'#c5d6d3','center');
    let caption='', sub='';
    if(m.phase==='intro'){caption='MANCHE '+m.round;sub=m.link?'RECONSTITUTION · LOURD / PROJECTION AU BORD → HANGAR · 1 PASSAGE / MANCHE':stages[m.stage].title;}
    if(m.phase==='transition'){caption='PASSAGE VERS LE HANGAR';sub='RECONSTITUTION DU SIMULATEUR · REPRISE DANS '+(m.phaseTicks/60).toFixed(1)+' s';}
    if(m.phase==='roundover'){caption=m.reason==='time'?'TEMPS ÉCOULÉ':m.reason==='sudden'?'AVANTAGE DÉCISIF':'K.-O.';sub=m.f[m.winner-1].spec.short;}
    if(m.phase==='finish'){caption='RUPTURE';sub=m.f[m.winner-1].spec.short+' · COMMANDE DE FINITION';}
    if(m.phase==='cinema'){caption=m.f[m.winner-1].spec.end.toUpperCase();sub='ÉCHO DISSIPÉ';}
    if(m.paused){caption='PAUSE';sub='';}
    if(m.teams&&m.phase==='ended'&&!m.winner){caption='ÉGALITÉ';sub='DOUBLE K.-O. SIMULTANÉ · AUCUNE RÉSURRECTION';}
    if(m.link) label(c,m.link.zone===stageLinks[m.stage].destination?'HANGAR · LIAISON UTILISÉE (1/1)':'QUAI → HANGAR · LOURD / PROJECTION VERS LE BORD',WIDTH/2,128,12,'#e2ca9d','center');
    if(caption) {
      c.fillStyle='rgba(4,13,17,.80)';c.fillRect(0,HEIGHT*.29,WIDTH,100);
      label(c,caption,WIDTH/2,HEIGHT*.29+49,34,'#f1f2e9','center');
      label(c,sub,WIDTH/2,HEIGHT*.29+78,14,'#dec194','center');
    }
  }
  function teamHud(m) {
    const c=m.ctx;
    m.teams.forEach((team,side)=>{
      const x=side?WIDTH-528:50,edge=side?x+478:x,align=side?'right':'left',reserve=team.members[1-team.active];
      c.fillStyle='rgba(5,17,22,.91)';c.fillRect(x-12,HEIGHT-109,502,91);
      label(c,'RÉSERVE · '+reserve.spec.short+(reserve.hp<=0?' · K.-O.':''),edge,HEIGHT-85,16,'#dce7df',align);
      meter(c,x,HEIGHT-74,478,6,reserve.hp,'#829caa',side===1);
      label(c,'COHÉSION '+Math.floor(team.cohesion)+' / 100',edge,HEIGHT-44,16,'#f0c881',align);
      meter(c,x,HEIGHT-35,478,5,team.cohesion,'#e5ba76',side===1);
      const ready=reserve.hp<=0?'PARTENAIRE K.-O.':team.busy?team.busy.kind==='tag'?'RELAIS EN COURS':'ASSISTANCE EN COURS':
        'APPUI '+(team.assistCooldown?(team.assistCooldown/60).toFixed(1)+' s':'PRÊT')+' · RELAIS '+(team.tagCooldown?(team.tagCooldown/60).toFixed(1)+' s':'PRÊT');
      label(c,ready,edge,HEIGHT-117,12,'#cbdad6',align);
    });
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
    const shake=m.reducedEffects ? 0 : Math.sin(m.tick*2.1)*m.shake;
    c.save();
    c.translate(WIDTH/2+shake,FLOOR+10+shake*.45);
    c.scale(zoom,zoom);
    c.translate(-center,-FLOOR);
    if (m.link && !m.link.used) {
      const edge=stageLinks[m.stage].edge;
      c.fillStyle='rgba(239,186,96,.28)';
      for (const x of [48,WIDTH-48-edge]) {
        c.fillRect(x,FLOOR-3,edge,7);
        label(c,'PASSAGE',x+edge/2,FLOOR-13,10,'#f0ce91','center');
      }
    }
    if(m.teams)m.teams.forEach((team,side)=>{const support=teamSupport(m,side);if(support)drawFighter(m,support,side);
      if(team.busy?.kind==='tag'){const f=m.f[side];line(c,f.x-28,FLOOR+5,f.x+28,FLOOR+5,AMBER,4);label(c,'RELAIS',f.x,FLOOR-f.spec.h-18,13,AMBER,'center');}});
    drawFighter(m,m.f[0],0);
    drawFighter(m,m.f[1],1);
    effects(m);
    if(m.phase==='cinema') finisherScene(m);
    c.restore();
    foreground(m);
    hud(m);
    if(m.teams)teamHud(m);
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
      if (match.link) state.link=match.link;
      return {state:structuredClone(state),particles:match.particlesRandom.state(),simulation:match.simRandom.state()};
    },
    restore(point) {
      if (!match?.networkClock || !point?.state || !validLinkCheckpoint(match,point.state)) return false;
      Object.assign(match,structuredClone(point.state));
      match.particlesRandom.restore(point.particles); match.simRandom.restore(point.simulation);
      if (match.link) match.scene=match.linkScenes[match.link.zone];
      return true;
    },
    advance(inputs,silent=false) {
      if (!match?.networkClock) return;
      match.silentResimulation=silent;
      try {
        for (const [player,action,down] of inputs) input(player,action,down);
        step(match);
      } finally { match.silentResimulation=false; }
    },
    draw() {
      if (!match?.networkClock) return;
      // A corrected match may have ended during silent catch-up. Release even
      // previously scheduled combat voices when that final state is presented.
      if (match.phase==='ended') stopAudio();else syncAmbience(true);
      draw(match);
    }
  };

  const teamStateFields=['wins','round','tick','beat','phase','phaseTicks','remaining','shots','sparks','hstop','shake','winner','finisher','reason','camera','sudden','parcel','teams'];
  const finiteBetween=(value,min,max)=>Number.isFinite(value)&&value>=min&&value<=max;
  function validTeamPoint(point) {
    if(!point||point.version!==1||point.rules!=='relay-1'||!validTeamSelection(point.selection)||!Object.hasOwn(stages,point.stage)||stageLinks[point.stage]||!['cpu','local'].includes(point.mode)||(point.originalRules??null)!==originalRulesFor(point.selection.flat()))return false;
    const s=point.state;if(!s||!Array.isArray(s.teams)||s.teams.length!==2||!['intro','fight','finish','cinema','roundover','ended'].includes(s.phase))return false;
    if(!Number.isSafeInteger(s.tick)||s.tick<0||!finiteBetween(s.remaining,0,4500)||!finiteBetween(s.hstop,0,100)||!finiteBetween(s.phaseTicks,-1,200)||![0,1,2].includes(s.winner)||!Array.isArray(s.wins)||s.wins.length!==2||!s.wins.every(v=>Number.isInteger(v)&&v>=0&&v<=5))return false;
    if(!Number.isInteger(s.round)||s.round<1||s.round>10||!finiteBetween(s.beat,0,59)||!finiteBetween(s.shake,0,100)||!finiteBetween(s.camera,-2000,2000)||typeof s.sudden!=='boolean'||typeof s.finisher!=='boolean')return false;
    // These phases dereference the winning actor during drawing. Reject an
    // inconsistent save before replacing any live state, not after drawing it.
    if(['finish','cinema','roundover'].includes(s.phase)&&(![1,2].includes(s.winner)||s.wins[s.winner-1]<1))return false;
    if(['intro','fight'].includes(s.phase)&&s.winner!==0)return false;
    if(['finish','cinema'].includes(s.phase)&&(s.wins[s.winner-1]<point.toWin||s.reason!=='ko'))return false;
    if(s.phase==='cinema'&&!s.finisher||s.phase==='finish'&&s.finisher)return false;
    const memberOK=(f,side,slot)=>f&&f.id===point.selection[side][slot]&&f.teamSide===side&&f.teamSlot===slot&&
      ['hp','balance','chiral'].every(key=>finiteBetween(f[key],0,100))&&finiteBetween(f.x,-60,WIDTH+60)&&finiteBetween(f.y,0,2000)&&[-1,1].includes(f.face)&&
      ['vx','vy','walk'].every(key=>finiteBetween(f[key],-1e5,1e5))&&['stun','blockStun','dash','postHit','combo','comboTTL','aiWait','noticeTTL'].every(key=>finiteBetween(f[key],0,1e5))&&
      Array.isArray(f.queue)&&f.queue.length<=20&&f.queue.every(q=>['up','light','heavy','special','throw'].includes(q.action)&&finiteBetween(q.until,0,Number.MAX_SAFE_INTEGER)&&Object.hasOwn(moves,q.special))&&
      f.keys&&typeof f.keys==='object'&&Object.values(f.keys).every(v=>typeof v==='boolean')&&
      (!f.act||Object.hasOwn(moves,f.act.key)&&finiteBetween(f.act.t,0,1000)&&
        (f.act.key!=='higgs'||finiteBetween(f.act.target,-60,WIDTH+60))&&
        (f.act.key!=='winch'||(f.act.t<moves.winch.start?
          f.marker?.kind==='anchor'&&f.marker.ttl>moves.winch.start-f.act.t:
          finiteBetween(f.act.destination,-60,WIDTH+60))))&&
      (!f.marker||['anchor','memory','beacon','mine','post','crate','seal',...(originalKits?['baliseAnchor']:[])].includes(f.marker.kind)&&finiteBetween(f.marker.ttl,0,10000)&&
        (f.marker.kind==='seal'||finiteBetween(f.marker.x,-60,WIDTH+60))&&
        (f.marker.kind!=='crate'||(f.marker.travel==null||['crate','retrieve'].includes(f.marker.travel))&&
          (f.marker.travel!=='crate'||finiteBetween(f.marker.endX,-60,WIDTH+60))))&&
      (!f.scan||finiteBetween(f.scan.x,-60,WIDTH+60)&&finiteBetween(f.scan.ttl,0,10000))&&
      (!f.taunt||finiteBetween(f.taunt.frame,0,teamRules.assistDuration))&&
      (f.teamLock===undefined||typeof f.teamLock==='boolean') && validOriginalState(f,side,slot);
    if(!s.teams.every((team,side)=>team&&[0,1].includes(team.active)&&finiteBetween(team.cohesion,0,100)&&
      finiteBetween(team.assistCooldown,0,360)&&finiteBetween(team.tagCooldown,0,240)&&finiteBetween(team.combo,0,1e5)&&finiteBetween(team.comboTTL,0,1e5)&&
      Array.isArray(team.members)&&team.members.length===2&&team.members.every((f,slot)=>memberOK(f,side,slot))&&
      (!team.busy||['assist','tag'].includes(team.busy.kind)&&[0,1].includes(team.busy.member)&&finiteBetween(team.busy.frame,0,60)&&typeof team.busy.interrupted==='boolean'&&typeof team.busy.transferred==='boolean'&&
        (team.busy.kind==='assist'?team.busy.member!==team.active:team.busy.transferred?team.busy.member===team.active:team.busy.member!==team.active))))return false;
    // A team lock has exactly one owner and exists only during a live tag.
    // An orphaned persisted flag otherwise freezes movement and attacks forever.
    if(!s.teams.every(team=>team.members.every((f,slot)=>!!f.teamLock===(s.phase==='fight'&&team.busy?.kind==='tag'&&slot===team.active))))return false;
    if(!Array.isArray(s.shots)||s.shots.length>6||!s.shots.every(shot=>[0,1].includes(shot.owner)&&[0,1].includes(shot.member)&&Object.hasOwn(shotHit,shot.kind)&&['x','y','vx','ttl','age'].every(key=>finiteBetween(shot[key],-1e5,1e5))))return false;
    if(!Array.isArray(s.sparks)||s.sparks.length>2000||!s.sparks.every(p=>['x','y','vx','vy','ttl'].every(key=>finiteBetween(p[key],-1e6,1e6))))return false;
    return [point.simulation,point.particles].every(n=>Number.isInteger(n)&&n>=0&&n<=0xffffffff)&&Number.isInteger(point.toWin)&&point.toWin>=1&&point.toWin<=5&&[0,1,2].includes(point.difficulty);
  }
  const team={
    rules:teamRules,names:assistanceNames,validSelection:validTeamSelection,validCheckpoint:validTeamPoint,
    checkpoint(){
      const m=match;if(!m?.teams)return null;
      const state={};for(const key of teamStateFields)state[key]=m[key];
      return structuredClone({version:1,rules:'relay-1',...(originalRulesFor(m.teamSelection.flat())?{originalRules:originalKits.rules}:{}),selection:m.teamSelection,stage:m.stage,mode:m.mode,toWin:m.toWin,difficulty:m.difficulty,state,particles:m.particlesRandom.state(),simulation:m.simRandom.state()});
    },
    restore(point){
      const m=match;
      if(!m?.teams||!validTeamPoint(point)||point.stage!==m.stage||point.mode!==m.mode||JSON.stringify(point.selection)!==JSON.stringify(m.teamSelection)||point.toWin!==m.toWin||point.difficulty!==m.difficulty)return false;
      const next=structuredClone(point.state);for(const key of teamStateFields)m[key]=next[key];
      m.teams.forEach(t=>t.members.forEach(f=>{f.spec=roster[f.id];}));
      syncTeamActors(m);clearControls(m);m.particlesRandom.restore(point.particles);m.simRandom.restore(point.simulation);
      m.paused=true;m.now=null;m.lag=0;stopAudio();draw(m);notify(m,true);return true;
    }
  };

  host.StrandFight = {start, stop, pause, input, setTraining, setSound, setAmbienceVolume, setAudioSuspended, setReducedEffects, setStaticScenery, snapshot, validReplay, network, tauntRules,team,originalCharacterIds:originalIds.slice(),compatibleLocalOnly:!!originalKits,originalRules:originalKits?.rules || null};
})(window);
