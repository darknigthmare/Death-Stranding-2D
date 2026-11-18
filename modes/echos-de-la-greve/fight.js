/* StrandFight — standalone 2D duel engine. Simulation units are pixels and 60 Hz ticks. */
(function (host) {
  'use strict';

  const WIDTH = 1280, HEIGHT = 720, FLOOR = 588, STEP = 1000 / 60;
  const INK = '#081318', ICE = '#b5eaf0', AMBER = '#efba60';
  const TAU = Math.PI * 2;
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const mix = (a, b, t) => a + (b - a) * t;
  const roster = {
    sam:     {name:'Sam Porter Bridges', short:'SAM', suit:'#365570', cloth:'#506e85', trim:'#ffad57', metal:'#a8c5cd', skin:'#c0947e', h:176, speed:4.4, power:1, move:'Bola de liaison', end:'Cargaison sécurisée'},
    higgs:   {name:'Higgs Monaghan', short:'HIGGS', suit:'#292936', cloth:'#46414b', trim:'#d8a34a', metal:'#ecd08b', skin:'#bd9a56', h:184, speed:4.05, power:1.06, move:'Marée noire', end:'Rideau de goudron'},
    fragile: {name:'Fragile', short:'FRAGILE', suit:'#283946', cloth:'#3f5362', trim:'#a9e6ee', metal:'#b2cbd0', skin:'#d0a28e', h:166, speed:4.95, power:0.94, move:'Pas de Grève', end:'Dernier saut'},
    cliff:   {name:'Cliff Unger', short:'CLIFF', suit:'#3c493d', cloth:'#59614c', trim:'#f09c66', metal:'#a5aa89', skin:'#bf9783', h:179, speed:4.2, power:1.03, move:'Écho de section', end:'Rappel de section'}
  };
  const stages = {
    shore:{title:'LA GRÈVE', code:'BEACH / 01', sky:['#122c39','#668184','#a9a78d'], mountains:['#7c9091','#526d71','#324e54'], ground:['#435c5d','#162a32','#061219'], light:'#d3d0aa'},
    terminal:{title:'CENTRE DE DISTRIBUTION', code:'BRIDGES / 02', sky:['#112d3a','#4e727e','#92a8a7'], mountains:['#79949b','#4e717e','#334f5a'], ground:['#4b6068','#1c323a','#09181f'], light:'#a6d2d8'},
    battlefield:{title:'LE CHAMP DE BATAILLE', code:'LIMBO / 03', sky:['#382f35','#816e69','#c39e83'], mountains:['#8f7f77','#716965','#4c5252'], ground:['#5d5a54','#2d3433','#11191c'], light:'#e2b58a'}
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
    cliff:   {start:17, active:9, recover:21, cost:28}
  };
  const shotHit = {
    sam:{damage:10,balance:17,stun:26,push:3},
    higgs:{damage:14,balance:21,stun:23,push:6,launch:6},
    cliff:{damage:5,balance:9,stun:11,push:4}
  };
  const keyActions = ['left','right','up','down','light','heavy','special','guard','throw','finish'];
  let match, raf = 0, serial = 0, audio, sound = true;
  function tone(hz, span, waveform='sine', gain=.035, end=hz) {
    if (!sound || !audio || audio.state !== 'running') return;
    try {
      const t=audio.currentTime, osc=audio.createOscillator(), volume=audio.createGain();
      osc.type=waveform; osc.frequency.setValueAtTime(hz,t); osc.frequency.exponentialRampToValueAtTime(Math.max(18,end),t+span);
      volume.gain.setValueAtTime(.001,t); volume.gain.exponentialRampToValueAtTime(gain,t+.009);
      volume.gain.exponentialRampToValueAtTime(.001,t+span); osc.connect(volume); volume.connect(audio.destination); osc.start(); osc.stop(t+span+.015);
    } catch (_) { /* A suspended audio device has no effect on the simulation. */ }
  }
  function wakeAudio() {
    if (!sound) return;
    try {
      if (!audio) { const Ctor=host.AudioContext || host.webkitAudioContext; if (Ctor) audio=new Ctor(); }
      if (audio && audio.state==='suspended') audio.resume().catch(()=>{});
    } catch (_) { /* Audio is optional. */ }
  }
  function randomSeed(seed) {
    return () => { seed=(Math.imul(1664525,seed)+1013904223)>>>0; return seed/4294967296; };
  }
  function fighterId(input, fallback) { const id=typeof input==='string'?input:input?.id; return roster[id]?id:fallback; }
  function fighter(id,x,face) {
    return {id, spec:roster[id], x, y:0, vx:0, vy:0, face, hp:100, balance:100, chiral:42, keys:{}, taps:{}, queue:[], act:null,
      stun:0, blockStun:0, dash:0, drift:0, crouch:false, guard:false, flash:0, postHit:0, walk:0, combo:0, comboTTL:0, aiWait:0, grounded:true, lastMove:'', notice:'', noticeTTL:0};
  }
  function notify(m, force=false) { if (m.onStatus && (force || m.tick%12===0)) m.onStatus(snapshot()); }
  function snapshot() {
    const m=match; if (!m) return null;
    return {phase:m.phase, paused:m.paused, round:m.round, wins:m.wins.slice(), maxRounds:m.toWin, time:Math.ceil(m.remaining/60),
      stage:m.stage, mode:m.mode, winner:m.winner, finisher:m.finisher, fighters:m.f.map(f=>({id:f.id,hp:Math.ceil(f.hp),balance:Math.ceil(f.balance),chiral:Math.floor(f.chiral),combo:f.combo,x:f.x,y:f.y,guard:f.guard,action:f.act?.key || '',stun:f.stun,move:f.lastMove})), training:{...m.training}};
  }
  function start(o) {
    if (!o || !o.canvas || typeof o.canvas.getContext!=='function') throw new TypeError('StrandFight.start requires a canvas.');
    stop(); const ctx=o.canvas.getContext('2d'); if (!ctx) throw new Error('Canvas 2D indisponible.');
    const stage=stages[o.stage]?o.stage:'shore', ids=[fighterId(o.p1,'sam'),fighterId(o.p2,'higgs')];
    const difficulty=({easy:0,facile:0,normal:1,medium:1,hard:2,difficile:2})[o.difficulty] ?? (Number.isInteger(o.difficulty)?clamp(o.difficulty,0,2):1);
    const m={canvas:o.canvas,ctx,stage,ids,difficulty,mode:['cpu','local','training'].includes(o.mode)?o.mode:'cpu',toWin:clamp(Math.floor(Number(o.roundsToWin)||2),1,5),
      onEnd:typeof o.onEnd==='function'?o.onEnd:null,onStatus:typeof o.onStatus==='function'?o.onStatus:null,
      wins:[0,0], round:1, tick:0, paused:false, phase:'intro', phaseTicks:72, remaining:75*60,
      f:ids.map((id,i)=>fighter(id,i?818:462,i?-1:1)), shots:[], sparks:[], hstop:0, shake:0, winner:0, finisher:false, reason:'',
      camera:0, images:{}, training:{dummy:'idle',hitboxes:false,...o.training}, sudden:false, scene:makeScenery(stage), simRandom:randomSeed(0x63cee17), particlesRandom:randomSeed(782), now:null, lag:0};
    match=m; const generation=++serial;
    for (const [id,src] of Object.entries(o.visuals || {})) {
      if (!roster[id] || !src) continue;
      if (typeof src==='string') { const im=new Image(); im.src=src; m.images[id]=im; }
      else if (src instanceof host.HTMLImageElement) m.images[id]=src;
    }
    if (typeof o.sound==='boolean') sound=o.sound;
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
    raf=host.requestAnimationFrame(frame); return snapshot();
  }
  function stop() { if (raf) host.cancelAnimationFrame(raf); raf=0; serial++; match=null; }
  function clearControls(m) { for (const f of m.f) {f.queue=[];f.keys={};f.taps={};f.guard=false;} }
  function pause(on=true) { if (match) {match.paused=!!on;match.now=null;match.lag=0;clearControls(match);draw(match);notify(match,true);} }
  function setTraining(options={}) { if (!match || match.mode!=='training') return;
    if (['idle','guard','cpu'].includes(options.dummy)) match.training.dummy=options.dummy;
    if ('hitboxes' in options) match.training.hitboxes=!!options.hitboxes;
    match.f[1].keys={};notify(match,true);
  }
  function setSound(on) { sound=!!on;if(sound) wakeAudio(); }
  function input(player,action,down=true) {
    const m=match; if (!m || m.paused || ![1,2].includes(player) || !keyActions.includes(action)) return;
    if (player===2 && m.mode!=='local') return;
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
      f.queue=f.queue.filter(q=>q.action!==action);f.queue.push({action,until:m.tick+9});
    }
  }
  function beginAttack(m,f,foe,key) {
    const a=moves[key];if (a.cost && f.chiral<a.cost) {f.notice='CHIRAL INSUFFISANT';f.noticeTTL=42;return;}
    if (a.cost) {f.chiral-=a.cost;f.notice=f.spec.move.toUpperCase();f.noticeTTL=50;tone(260,.12,'sine',.035,480);}
    f.face=foe.x>=f.x?1:-1; f.act={key,t:0,hit:false,target:clamp(foe.x,48,WIDTH-48),hitConfirmed:false};f.lastMove=key;
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
    const key=q.action==='special'?f.id:q.action==='throw'?'grab':!f.grounded?'air':f.keys.down?(q.action==='heavy'?'lift':'sweep'):q.action;
    beginAttack(m,f,foe,key);
  }
  function cpu(m,f,foe) {
    if (m.mode==='training' && m.training.dummy!=='cpu') {f.keys={guard:m.training.dummy==='guard'};return;}
    if (--f.aiWait>0) return;
    const r=m.simRandom, d=m.difficulty, gap=Math.abs(f.x-foe.x), forward=foe.x>f.x?'right':'left', back=forward==='right'?'left':'right';
    f.aiWait=5+Math.floor(r()*(16-d*4));f.keys={};
    if (f.stun || f.blockStun) return;
    const threat=foe.act && gap<156 || m.shots.some(s=>s.owner===0 && Math.abs(s.x-f.x)<175);
    if (threat && r()<.38+d*.23) {f.keys.guard=true;f.keys.down=foe.act?.key==='sweep';return;}
    if (gap>122) {
      f.keys[forward]=true;
      if (gap>158 && gap<600 && f.chiral>=28 && r()<.12+d*.04) pushInput(m,f,'special');
      else if (gap>230 && r()<.13) {f.dash=12;f.drift=forward==='right'?1:-1;}
      return;
    }
    if (foe.guard && gap<76 && r()<.53) pushInput(m,f,'throw');
    else {
      const roll=r();
      if (roll<.12) f.keys[back]=true;
      else if (roll<.22) {f.keys.guard=true;}
      else if (roll<.28) {f.keys[forward]=true;pushInput(m,f,'up');}
      else if (roll<.45 && f.chiral>=28) pushInput(m,f,'special');
      else {f.keys[forward]=gap>76;f.keys.down=r()<.16;pushInput(m,f,roll>.72?'heavy':'light');}
    }
  }
  function updateFighter(m,f,o,index) {
    f.flash=Math.max(0,f.flash-1);f.postHit=Math.max(0,f.postHit-1);
    if (f.comboTTL>0 && --f.comboTTL===0) f.combo=0;
    if(f.noticeTTL>0) f.noticeTTL--;
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
      if (a.key==='heavy' && a.t===d.start-3) f.x+=f.face*12;
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
  function makeShot(m,owner,kind,x,y,vx,ttl) {m.shots.push({owner,kind,x,y,vx,ttl,age:0});}
  function hurt(f) {
    const h=f.spec.h*(f.crouch?.62:1), y=FLOOR-f.y;
    return {l:f.x-22,r:f.x+22,t:y-h,b:y};
  }
  function strike(f) {
    const a=f.act; if (!a) return null;
    const d=moves[a.key]; if (!d.reach || a.t<d.start || a.t>=d.start+d.active || a.hit) return null;
    const x=f.x+f.face*d.reach, y=FLOOR-f.y;
    return {l:Math.min(f.x,x),r:Math.max(f.x,x),t:y-d.high,b:y-d.low};
  }
  const intersects=(a,b)=>a.l<b.r && a.r>b.l && a.t<b.b && a.b>b.t;
  function immune(f) {return f.dash>=4 && f.dash<=8 || (f.act?.key==='fragile' && f.act.t>=6 && f.act.t<=10);}
  function hit(m,attacker,victim,kind,d,face) {
    const grab=!!d.grab, blocked=victim.guard && !grab && (kind!=='sweep' || victim.crouch) && (kind!=='air' || !victim.crouch);
    const damage=Math.round(d.damage*attacker.spec.power);
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
      s.age++;s.x+=s.vx;s.ttl--;const o=m.f[1-s.owner], rx=s.kind==='higgs'?43:13, ry=s.kind==='higgs'?51:9;
      if (!immune(o) && intersects({l:s.x-rx,r:s.x+rx,t:s.y-ry,b:s.y+ry},bodies[1-s.owner])) {
        events.push({i:s.owner,d:shotHit[s.kind],kind:s.kind,face:s.vx?Math.sign(s.vx):Math.sign(o.x-m.f[s.owner].x)||1});s.ttl=0;
      }
    }
    m.shots=m.shots.filter(s=>s.ttl>0 && s.x>-60 && s.x<WIDTH+60);
    // Collect both fighters' contacts before applying hitstun so equal-frame strikes can trade.
    for(const e of events) {const ok=hit(m,m.f[e.i],m.f[1-e.i],e.kind,e.d,e.face);if(e.a) e.a.hitConfirmed=ok;}
  }
  function resetRound(m) {
    m.round++;m.winner=0;m.phase='intro';m.phaseTicks=66;m.remaining=75*60;m.sudden=false;m.hstop=0;m.shots=[];m.sparks=[];
    m.f=m.ids.map((id,i)=>fighter(id,i?818:462,i?-1:1));notify(m,true);
  }
  function winRound(m,index,reason) {
    m.winner=index+1;m.wins[index]++;m.reason=reason;
    m.phase=m.wins[index]>=m.toWin && reason==='ko'?'finish':'roundover';m.phaseTicks=m.phase==='finish'?135:96;
    m.shots=[];clearControls(m);m.f.forEach(f=>{f.act=null;f.stun=0;f.crouch=false;});tone(145,.35,'sine',.045,71);notify(m,true);
  }
  function activateFinish(m) {
    if(m.phase!=='finish')return;
    m.finisher=true;m.phase='cinema';m.phaseTicks=108;m.shake=6;
    const f=m.f[m.winner-1],v=m.f[2-m.winner];
    f.face=v.x>=f.x?1:-1;burst(m,v.x,FLOOR-68,f.spec.trim,35);tone(220,.62,'sine',.06,55);notify(m,true);
  }
  function finishMatch(m) {
    m.phase='ended';notify(m,true);
    if (m.onEnd) m.onEnd({winner:m.winner,loser:3-m.winner,rounds:m.wins.slice(),reason:m.reason,finisher:m.finisher,stage:m.stage,fighters:m.ids.slice()});
  }
  function step(m) {
    if (m.phase==='ended') return;
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
        for(const f of m.f) {f.act=null;f.stun=0;f.queue=[];f.vx=0;f.vy=0;f.y=0;f.grounded=true;f.notice='PROCHAIN IMPACT DÉCISIF';f.noticeTTL=85;}
      } else if (a.hp<=0 || b.hp<=0) winRound(m,a.hp>0?0:1,'ko');
      else if (!m.remaining) winRound(m,a.hp>b.hp?0:1,'time');
    }
    notify(m);
  }
