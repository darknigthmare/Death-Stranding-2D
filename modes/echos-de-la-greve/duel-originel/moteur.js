/* Simulation fixe à 60 Hz. Les distances sont exprimées dans l'espace de jeu (1120 unités). */
(function (scope) {
  "use strict";
  const WIDTH = 1120, LIMIT = 69, MAX_HP = 100, ROUND_TIME = 3600;
  const ID = {
    sam: { name: "Sam Porter Bridges", short: "Sam", role: "Porteur", color: "#6ed1e5", step: 4.1, specialName: "Lien de brin", superName: "Relève du porteur", finish: "Dernière livraison" },
    higgs: { name: "Higgs Monaghan", short: "Higgs", role: "Homo Demens", color: "#edc16b", step: 3.8, specialName: "Onde de goudron", superName: "Marée de la Grève", finish: "Marée noire" }
  };
  // Démarrage / activité / récupération, allonge, dégâts et ralentissement adverse.
  const move = (name, start, active, recover, reach, damage, stun, extra = {}) =>
    ({name, start, active, recover, reach, damage, stun, ...extra});
  const MOVES = {
    sam: {
      light: move("Direct du porteur", 4, 3, 10, 87, 6, 13),
      heavy: move("Heurt de cargaison", 10, 4, 17, 117, 13, 18),
      low: move("Balayage de botte", 7, 4, 15, 104, 8, 15, {level:"low"}),
      air: move("Frappe descendante", 5, 7, 11, 106, 9, 14, {level:"high"}),
      throw: move("Entrave au brin", 6, 2, 22, 74, 15, 24, {grab:true}),
      special: move("Lien de brin", 9, 5, 19, 187, 12, 18, {pull:true}),
      super: move("Relève du porteur", 10, 8, 25, 190, 27, 30, {cost:75, surge:9})
    }, higgs: {
      light: move("Revers du masque", 5, 3, 10, 94, 6, 13),
      heavy: move("Frappe du pèlerin", 12, 4, 19, 135, 14, 19),
      low: move("Reflux", 8, 5, 14, 110, 8, 15, {level:"low"}),
      air: move("Chute du masque", 6, 6, 12, 112, 10, 15, {level:"high"}),
      throw: move("Étreinte de goudron", 7, 2, 22, 77, 15, 24, {grab:true}),
      special: move("Onde de goudron", 14, 1, 24, 0, 10, 15, {projectile:6.5}),
      super: move("Marée de la Grève", 16, 1, 28, 0, 25, 28, {projectile:9, cost:75})
    }
  };
  const empty = () => ({});
  const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
  function actor(id,x,facing) {
    return {id,x,z:0,vz:0,facing,hp:MAX_HP,meter:25,stun:0,guardStun:0,guard:false,crouch:false,walking:false,
      attack:null,dash:0,dashDir:0,lastTap:{left:-90,right:-90},prev:{},buffer:null,combo:0,comboShow:0,
      hurt:0,guardFlash:0,actionName:"",nameLife:0,ai:{wait:0,controls:{}}};
  }
  function newMatch(id1,id2,training=false) {
    return {fighters:[actor(id1,320,1),actor(id2,800,-1)],training,frame:0,clock:ROUND_TIME,round:1,
      wins:[0,0],phase:"ready",delay:64,roundWinner:null,winner:null,shots:[],events:[],shake:0,ghost:0};
  }
  function event(s,type,extra={}) {s.events.push({type,...extra});}
  function beginRound(s) {
    const ids=s.fighters.map(f=>f.id), meters=s.fighters.map(f=>f.meter);
    s.fighters=[actor(ids[0],320,1),actor(ids[1],800,-1)];
    s.fighters.forEach((f,i)=>{f.meter=meters[i];});
    s.phase="ready"; s.clock=ROUND_TIME; s.round++; s.shots=[]; s.delay=64; s.roundWinner=null;
    event(s,"round",{round:s.round});
  }
  function refill(s) {
    const ids=s.fighters.map(f=>f.id);
    s.fighters=[actor(ids[0],320,1),actor(ids[1],800,-1)];
    s.fighters.forEach(f=>{f.meter=100;}); s.shots=[];s.clock=ROUND_TIME;s.ghost=0;
  }
  function awards(s) {
    const [a,b]=s.fighters;
    const w=a.hp===b.hp?-1:(a.hp>b.hp?0:1);
    s.roundWinner=w;
    if(w>=0) s.wins[w]++;
    s.phase="break";s.delay=78;
    event(s,"roundEnd",{w});
  }
  function pressed(f,p,key) {return !!p[key] && !f.prev[key];}
  function choose(f,p) {
    if(pressed(f,p,"super")) return "super";
    if(pressed(f,p,"special")) return "special";
    if(pressed(f,p,"throw")) return "throw";
    if(pressed(f,p,"heavy")) return f.z>0?"air":"heavy";
    if(pressed(f,p,"light")) return f.z>0?"air":p.down?"low":"light";
    return null;
  }
  function attack(f,key,s) {
    const m=MOVES[f.id][key];
    if(!m || (m.cost||0)>f.meter || ((key==="throw"||key==="super"||key==="special") && f.z>0)) return false;
    f.meter-=m.cost||0;
    f.attack={key,age:0,hit:false,connected:false,dir:f.facing,spawned:false};
    f.guard=false; f.dash=0; f.actionName=m.name;f.nameLife=46;
    event(s,"swing",{key,id:f.id});return true;
  }
  function steer(s,f,o,p) {
    const direction=Number(!!p.right)-Number(!!p.left);
    const pick=choose(f,p);
    if(pick) f.buffer={key:pick,life:7};
    else if(f.buffer && --f.buffer.life<=0) f.buffer=null;
    const busy=f.stun>0||f.guardStun>0;
    f.crouch=!!p.down && f.z===0 && !busy;
    f.walking=false;
    if(!f.attack) f.facing=(o.x>=f.x?1:-1);
    f.guard=f.z===0 && !busy && !f.attack && !f.dash && (!!p.guard || direction===-f.facing);
    if(f.guardStun>0) f.guard=true;
    if(!busy && f.buffer) {
      const n=f.buffer.key, a=f.attack;
      const cancel=a?.connected && a.age>=MOVES[f.id][a.key].start &&
        ((a.key==="light" && (n==="heavy"||n==="special")) || (a.key==="heavy" && (n==="special"||n==="super")));
      if((!a || cancel) && attack(f,n,s)) f.buffer=null;
    }
    if(!busy && !f.attack) {
      for(const key of ["left","right"]) if(pressed(f,p,key)) {
        if(s.frame-f.lastTap[key]<=12 && !f.dash && f.z===0 && !f.crouch){f.dash=8; f.dashDir=key==="left"?-1:1;}
        f.lastTap[key]=s.frame;
      }
      if(pressed(f,p,"up") && f.z===0 && !f.crouch){f.vz=13.5;f.guard=false;f.dash=0;}
      if(f.dash){f.x+=f.dashDir*9;f.dash--;f.guard=false;f.walking=true;}
      else if(!f.crouch && !p.guard) {f.x+=direction*ID[f.id].step*(f.z>0?.82:1);f.walking=!!direction;}
    }
    if(f.z || f.vz){f.z+=f.vz;f.vz-=.83;if(f.z<=0){f.z=0;f.vz=0;}}
    f.x=clamp(f.x,LIMIT,WIDTH-LIMIT);
    for(const k of ["stun","guardStun","hurt","guardFlash","comboShow","nameLife"]) f[k]=Math.max(0,f[k]-1);
    if(!f.comboShow) f.combo=0;
    f.prev={...p};
  }
  function followAttack(s,i) {
    const f=s.fighters[i], a=f.attack; if(!a) return null;
    const m=MOVES[f.id][a.key]; a.age++;
    if(m.surge && a.age<=m.start) f.x=clamp(f.x+m.surge*a.dir,LIMIT,WIDTH-LIMIT);
    if(a.age>=m.start && a.age<m.start+m.active) {
      if(m.projectile && !a.spawned) {
        a.spawned=true;s.shots.push({owner:i,x:f.x+35*a.dir,dir:a.dir,speed:m.projectile,m,key:a.key,life:96,touched:false});
      } else if(!m.projectile && !a.hit) {
        const o=s.fighters[1-i], distance=(o.x-f.x)*a.dir;
        const height=m.grab?o.z===0 && f.z===0:Math.abs(o.z-f.z)<(a.key==="air"?91:70);
        if(distance>=-10 && distance<=m.reach && height) {a.hit=true;return {i,m,dir:a.dir,a};}
      }
    }
    if(a.age>=m.start+m.active+m.recover) f.attack=null;
    return null;
  }
  function resolve(s,{i,m,dir,a}) {
    const f=s.fighters[i],o=s.fighters[1-i];
    const guarded=!m.grab && o.guard && (m.level==="low"?o.crouch:m.level==="high"?!o.crouch:true);
    if(guarded) {
      o.guardStun=8;o.guardFlash=11;f.meter=clamp(f.meter+3,0,100);o.meter=clamp(o.meter+2,0,100);
      o.x=clamp(o.x+dir*4,LIMIT,WIDTH-LIMIT);event(s,"guard",{i:1-i});return;
    }
    o.hp=clamp(o.hp-m.damage,0,100);o.hurt=15;o.stun=m.stun;o.attack=null;o.dash=0;o.guard=false;
    o.x=clamp(o.x+dir*(m.pull?-39:m.grab?37:12),LIMIT,WIDTH-LIMIT);
    f.meter=clamp(f.meter+(m.cost?0:9),0,100);o.meter=clamp(o.meter+6,0,100);
    f.combo++;f.comboShow=m.stun+4;s.shake=m.damage>=13?6:3;
    if(a) a.connected=true;
    event(s,"hit",{i:1-i,damage:m.damage});
  }
  function tick(s,inputs=[empty(),empty()]) {
    s.events=[]; s.frame++;
    if(s.phase==="ready"){if(--s.delay<=0){s.phase="fight";event(s,"start");}return;}
    if(s.phase==="break"){if(--s.delay<=0){
      if(s.wins.some(w=>w>=2)){s.winner=s.wins[0]>=2?0:1;s.phase="finish";s.delay=300;event(s,"finalWindow");}
      else beginRound(s);
    }return;}
    if(s.phase==="finish"){
      if(inputs[s.winner]?.special || --s.delay<=0){s.ghost=inputs[s.winner]?.special?1:0;s.phase="result";event(s,"finished",{finisher:!!s.ghost});}
      return;
    }
    if(s.phase!=="fight") return;
    const fs=s.fighters;
    fs.forEach((f,i)=>steer(s,f,fs[1-i],inputs[i]||{}));
    const hits=fs.map((_,i)=>followAttack(s,i)).filter(Boolean);
    for(const p of s.shots) {
      const target=fs[1-p.owner];p.x+=p.speed*p.dir;p.life--;
      if(Math.abs(p.x-target.x)<35 && target.z<64) {
        hits.push({i:p.owner,m:p.m,dir:p.dir});p.touched=true;
      }
    }
    s.shots=s.shots.filter(p=>p.life>0 && !p.touched && p.x>=0 && p.x<=WIDTH);
    hits.forEach(h=>resolve(s,h));
    if(Math.abs(fs[0].x-fs[1].x)<57 && Math.abs(fs[0].z-fs[1].z)<66) {
      const sign=fs[1].x>=fs[0].x?1:-1, mid=clamp((fs[0].x+fs[1].x)/2,LIMIT+28.5,WIDTH-LIMIT-28.5);
      fs[0].x=mid-28.5*sign; fs[1].x=mid+28.5*sign;
    }
    s.shake=Math.max(0,s.shake-.55);
    if(s.training){if(fs.some(f=>!f.hp)){refill(s);event(s,"refill");}}
    else if(--s.clock<=0 || fs.some(f=>!f.hp)) awards(s);
  }
  function cpu(s,i,skill=.6,rng=Math.random) {
    const f=s.fighters[i],o=s.fighters[1-i], ai=f.ai;
    if(s.phase==="finish") return {special:s.delay<245};
    if(s.phase!=="fight") return {};
    if(--ai.wait>0) {
      const held={...ai.controls};for(const k of ["light","heavy","special","throw","super","up"]) held[k]=false;
      return held;
    }
    ai.wait=Math.round(15-skill*8+rng()*8);
    const distance=Math.abs(f.x-o.x), dir=o.x>=f.x?"right":"left", roll=rng(), answer={};
    if(o.attack && distance<160 && roll<skill*.7) {answer.guard=true;answer.down=o.attack.key==="low";}
    else if(f.meter>=75 && distance<(f.id==="sam"?180:500) && roll<.23) answer.super=true;
    else if(f.id==="higgs" && distance>130 && distance<490 && roll<.32) answer.special=true;
    else if(f.id==="sam" && distance>105 && distance<180 && roll<.5) answer.special=true;
    else if(distance>80){answer[dir]=true; if(roll<.08 && distance<230) answer.up=true;}
    else if(roll<.17){answer.throw=true;}
    else if(roll<.35){answer.down=true;answer.light=true;}
    else if(roll<.78){answer.light=true;}
    else answer.heavy=true;
    ai.controls=answer;return answer;
  }
  function simulateDuel(a,b,firstSkill=.56,secondSkill=.56,rng=Math.random) {
    const s=newMatch(a,b);
    for(let i=0;i<42000 && s.winner===null;i++) tick(s,[cpu(s,0,firstSkill,rng),cpu(s,1,secondSkill,rng)]);
    return s.winner===null?(s.wins[0]===s.wins[1]?(s.fighters[0].hp>=s.fighters[1].hp?0:1):Number(s.wins[1]>s.wins[0])):s.winner;
  }
  const api={WIDTH,ID,MOVES,ROUND_TIME,newMatch,tick,cpu,refill,simulateDuel};
  if(typeof module!=="undefined" && module.exports) module.exports=api;
  else scope.Duels=api;
})(globalThis);
