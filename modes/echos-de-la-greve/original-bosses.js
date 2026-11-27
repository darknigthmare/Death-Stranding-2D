/* Les Lignes de Marée — first optional, non-lethal original encounter.
 * No canonical encounter, campaign inventory or Boss Rush registration is changed. */
(function(host){
  'use strict';
  const ID='ldm-boss-consignateur',VERSION=1,GUARD=300,THRESHOLDS=[300,198,99];
  const CONSOLES=[360,1030],REGISTER_X=685;
  const PHASES=Object.freeze([
    Object.freeze({index:1,attack:'shield-push',name:'POUSSÉE AU BOUCLIER',tell:60,recover:48,active:36,
      advice:'Sautez ou sortez du couloir ; revenez du côté découvert.'}),
    Object.freeze({index:2,attack:'pole-strike',name:'INTERCEPTION À LA PERCHE',tell:72,recover:42,active:24,
      advice:'Quittez la zone ; désamorcez une console pendant la reprise.'}),
    Object.freeze({index:3,attack:'passage-restraint',name:'RETENUE DE PASSAGE',tell:90,recover:60,active:30,
      advice:'Sortez du cadre ; récupérez le registre pendant la reprise.'})
  ]);
  const encounter=Object.freeze({name:'Le Consignateur',title:'Le péage des cargaisons',type:'consignateur',
    stage:'ldm-stage-digue-aval',hp:GUARD,fixedGuard:true,nonLethal:true,height:194,radius:48,bodyHeight:178,
    bodyHeights:{kneel:125,surrender:125},seconds:300,original:true,
    goal:'Brisez sa garde sans le tuer. Deux consoles, un registre à restituer, puis une reddition au lien.',
    patterns:PHASES.map(p=>p.attack),tell:60,recover:48});
  const copy=value=>JSON.parse(JSON.stringify(value));
  const scalar=(value,min,max)=>Number.isFinite(value)&&value>=min&&value<=max;
  const integer=(value,min,max)=>Number.isInteger(value)&&scalar(value,min,max);
  const both=m=>m.consoles.every(Boolean);
  const duration=(s,value)=>Math.round(value/s.original.speed);
  const flags=m=>({consoles:m.consoles.slice(),register:m.register,freightIntegrity:m.freightIntegrity,surrendered:m.surrendered});
  function objective(s){
    const m=s.original,b=s.boss;
    if(m.surrendered)return 'PASSAGE ROUVERT · REGISTRE RESTITUÉ · AUCUNE MORT';
    if(m.phase===1)return 'GARDE '+Math.ceil(b.hp)+' / 300 · PUNIR LA POUSSÉE MANQUÉE';
    if(m.phase===2)return 'CONSOLES '+m.consoles.filter(Boolean).length+' / 2 · T PENDANT UNE REPRISE';
    if(m.register!=='retrieved')return 'REGISTRE '+m.freightIntegrity+' % · T POUR LE RESTITUER PENDANT UNE REPRISE';
    return b.hp>0?'REGISTRE RESTITUÉ · FAIRE TOMBER LA GARDE':'GARDE À ZÉRO · APPROCHEZ-VOUS ET T POUR LA REDDITION AU LIEN';
  }
  function rememberPhase(s){
    const m=s.original,p=s.p;
    m.phaseStart={phase:m.phase,guard:s.boss.hp,bossX:s.boss.x,playerX:p.x,playerHp:p.hp,
      energy:p.energy,guardMeter:p.guardMeter,marker:copy(p.marker),seed:m.seed,tick:s.tick,
      remaining:s.remaining,nextId:s.nextId,stats:copy(s.stats),objectiveFlags:flags(m)};
  }
  function create(s,options){
    s.original={schema:VERSION,phase:1,consoles:[false,false],register:'held',registerX:REGISTER_X,
      freightIntegrity:100,surrendered:false,seed:integer(options.seed,1,16777215)?options.seed:271127,
      speed:[.75,1,1.25].includes(options.scenarioSpeed)?options.scenarioSpeed:1,phaseStart:null};
    s.boss.hp=s.boss.maxHp=GUARD;rememberPhase(s);
  }
  function enterPhase(s,next,api){
    const m=s.original,b=s.boss;m.phase=next;b.tier=next;b.hp=THRESHOLDS[next-1];
    b.phase='approach';b.timer=duration(s,48);b.attack=null;b.stagger=0;b.exposed=0;
    s.hazards=[];s.shots=[];s.p.act=null;s.p.stun=0;s.p.invuln=Math.max(s.p.invuln,24);
    if(next===3){m.register='ground';m.registerX=REGISTER_X;}
    api.message(s,next===2?'Phase 2 · deux consoles de péage. T près d’une console pendant sa reprise.':
      'Phase 3 · le registre est libéré. Récupérez-le avec T pendant sa reprise, puis faites tomber sa garde.',220);
    api.tone(next===2?430:560,.16);rememberPhase(s);api.savePhase(s);
  }
  function damage(s,amount,power,impactX,api){
    const b=s.boss,m=s.original;if(b.hp<=0||s.phase==='ended')return false;
    const exposed=b.phase==='recover',openSide=(impactX-b.x)*b.face<0;
    const scale=exposed?(openSide?1.45:.9):b.exposed>0?.8:.3;
    const raw=Math.max(1,Math.round(amount*power*scale));
    const minimum=m.phase===1?198:m.phase===2?99:m.register==='retrieved'?0:1;
    const applied=Math.min(Math.max(0,b.hp-minimum),raw);
    if(!applied){
      api.message(s,m.phase===2?'Les deux consoles doivent être désamorcées avant de rouvrir le passage.':
        'Le registre doit être restitué avant la reddition.',100);return false;
    }
    b.hp-=applied;b.flash=10;s.stats.damageDealt+=applied;
    api.effect(s,b.x-b.face*25,api.floor-105);api.tone(exposed?180:110,.07);
    if(m.phase===1&&b.hp<=198){enterPhase(s,2,api);return true;}
    if(m.phase===2&&b.hp<=99&&both(m)){enterPhase(s,3,api);return true;}
    if(b.hp===0){
      b.phase='defeated';b.timer=0;b.attack=null;s.hazards=[];s.shots=[];s.p.act=null;
      api.message(s,'Il s’agenouille. Approchez-vous et appuyez sur T pour obtenir sa reddition au lien.',240);
      api.tone(350,.16);
    }
    return true;
  }
  function prepare(s,api){
    const b=s.boss,m=s.original,p=s.p,spec=PHASES[m.phase-1];
    m.seed=(m.seed*1664525+1013904223)%16777216;
    const target=m.phase===3&&m.register==='ground'&&b.cycle%2===1?m.registerX:p.x;
    b.face=target>=b.x?1:-1;
    const from=b.x,to=api.clamp(from+b.face*Math.min(m.phase===1?300:230,Math.max(90,Math.abs(target-from)-40)),90,1190);
    let markers;
    if(m.phase===1){const left=Math.max(32,Math.min(from,to)-58),right=Math.min(1248,Math.max(from,to)+58);markers=[{x:(left+right)/2,w:right-left,h:128}];}
    else if(m.phase===2){markers=[{x:api.clamp(from+b.face*160,150,1130),w:260,h:112}];}
    else markers=[{x:api.clamp(to,155,1125),w:245,h:180}];
    const warning=duration(s,spec.tell);
    b.attack={type:spec.attack,target,from,to,markers,age:0,hit:false,depot:false,warning,
      active:duration(s,spec.active),name:spec.name,advice:spec.advice};
    b.phase='tell';b.timer=warning;api.message(s,spec.advice,warning);api.tone(260+m.phase*95,.09);
  }
  function touches(s,marker,api){
    const p=s.p,bottom=api.floor-p.y,top=bottom-(p.crouch?105:170);
    return Math.abs(p.x-marker.x)<marker.w/2+17&&bottom>api.floor-marker.h&&top<api.floor;
  }
  function tick(s,api){
    const b=s.boss,m=s.original;if(b.hp<=0||s.phase==='ended')return;
    if(b.phase==='approach'){
      const target=m.phase===3&&m.register==='ground'&&b.cycle%2===1?m.registerX:s.p.x;
      const distance=target-b.x;b.face=distance>=0?1:-1;
      if(Math.abs(distance)>190)b.x=api.clamp(b.x+Math.sign(distance)*1.65*m.speed,90,1190);
    }
    if(b.phase==='attack'){
      const a=b.attack;a.age++;
      const fraction=a.age/a.active;
      if(m.phase===1){
        b.x=a.from+(a.to-a.from)*Math.min(1,fraction/.83);
        if(!a.hit&&Math.abs(s.p.x-b.x)<58&&s.p.y<128)a.hit=api.damagePlayer(s,23,{blockable:false,x:b.x});
      }else{
        if(m.phase===3)b.x=a.from+(a.to-a.from)*Math.min(1,fraction/.5);
        if(fraction>=.36&&fraction<=.67&&!a.hit&&a.markers.some(q=>touches(s,q,api)))
          a.hit=api.damagePlayer(s,m.phase===2?20:26,{blockable:m.phase===2,low:m.phase===2,x:b.x});
        if(s.phase==='ended'||b.hp<=0||b.phase!=='attack'||b.attack!==a)return;
        // A visible pole/shield impact can push the unattended ledger towards the edge.
        if(m.phase===3&&fraction>=.4&&!a.depot&&m.register==='ground'&&a.markers.some(q=>Math.abs(q.x-m.registerX)<q.w/2+20)){
          a.depot=true;m.freightIntegrity=Math.max(0,m.freightIntegrity-25);s.stats.cargoHits++;
          api.effect(s,m.registerX,api.floor-28,'cargo');
          api.message(s,'Registre menacé · intégrité '+m.freightIntegrity+' %. Récupérez-le pendant la reprise.',140);
          if(!m.freightIntegrity){api.finish(s,false,'objective');return;}
        }
      }
      // A player counter may have changed the phase, cleared the attack or ended the encounter.
      if(s.phase==='ended'||b.hp<=0||b.phase!=='attack'||b.attack!==a)return;
    }
    if(--b.timer>0)return;
    if(b.phase==='approach')prepare(s,api);
    else if(b.phase==='tell'){b.phase='attack';b.timer=b.attack.active;api.tone(120,.08);}
    else if(b.phase==='attack'){
      if(!b.attack.hit)s.stats.avoided++;
      b.attack=null;b.phase='recover';b.timer=duration(s,PHASES[m.phase-1].recover);b.stagger=0;
      api.message(s,m.phase===1?'Poussée terminée · côté découvert !':
        m.phase===2?'Reprise · T près d’une console pour la désamorcer.':
        m.register==='ground'?'Reprise · T près du registre pour le restituer.':'Reprise · faites tomber sa garde.',b.timer);
      api.tone(520,.08);
    }else if(b.phase==='recover'){b.cycle++;b.phase='approach';b.timer=duration(s,42);}
  }
  function interact(s,api){
    const p=s.p,b=s.boss,m=s.original;if(p.y>12)return false;
    if(m.phase===2){
      const index=CONSOLES.findIndex(x=>Math.abs(p.x-x)<=85);
      if(index>=0){
        if(m.consoles[index]){api.message(s,'Cette console est déjà désamorcée.',75);return true;}
        if(b.phase!=='recover'){api.message(s,'Console verrouillée · attendez la reprise après son attaque.',100);return true;}
        m.consoles[index]=true;api.effect(s,CONSOLES[index],api.floor-55,'guard');api.tone(620,.1);
        api.message(s,'Console '+(index+1)+' désamorcée · '+m.consoles.filter(Boolean).length+' / 2.',130);
        if(b.hp<=99&&both(m))enterPhase(s,3,api);else api.savePhase(s);
        return true;
      }
    }
    if(m.phase===3&&m.register==='ground'&&Math.abs(p.x-m.registerX)<=80){
      if(b.phase!=='recover'){api.message(s,'Le passage reste retenu · attendez sa reprise pour récupérer le registre.',100);return true;}
      m.register='retrieved';api.effect(s,m.registerX,api.floor-30,'guard');api.tone(720,.13);
      api.message(s,'Registre restitué. Faites tomber sa garde, puis approchez-vous avec le lien (T).',180);api.savePhase(s);return true;
    }
    if(m.phase===3&&b.hp===0){
      if(Math.abs(p.x-b.x)>100){api.message(s,'Approchez-vous du Consignateur agenouillé, puis T pour la reddition.',120);return true;}
      if(m.register!=='retrieved'||!both(m))return true;
      m.surrendered=true;b.phase='defeated';api.tone(740,.2);api.finish(s,true,'surrender');return true;
    }
    return false;
  }
  function pose(s){
    if(s.original.surrendered)return 'surrender';
    if(s.boss.hp===0)return 'kneel';
    if(s.boss.phase==='recover'||s.boss.flash>0)return 'stagger';
    if(['tell','attack'].includes(s.boss.phase))return s.original.phase===2?'pole-strike':'shield-push';
    return 'guard';
  }
  function restore(s){
    const m=s.original,a=m.phaseStart,p=s.p;
    if(!a)return false;
    m.phase=a.phase;m.consoles=a.objectiveFlags.consoles.slice();m.register=a.objectiveFlags.register;
    m.freightIntegrity=a.objectiveFlags.freightIntegrity;m.surrendered=false;m.seed=a.seed;
    s.tick=a.tick;s.remaining=a.remaining;s.nextId=a.nextId;s.stats=copy(a.stats);s.result=null;
    s.phase='intro';s.phaseTicks=60;s.wave=1;s.waveDelay=0;s.shots=[];s.hazards=[];s.effects=[];
    Object.assign(p,{x:a.playerX,y:0,vy:0,face:a.bossX>=a.playerX?1:-1,hp:a.playerHp,energy:a.energy,
      guardMeter:a.guardMeter,guard:false,crouch:false,keys:{},taps:{},act:null,stun:0,invuln:0,shield:0,walk:0,
      marker:copy(a.marker),flash:0});
    Object.assign(s.boss,{x:a.bossX,hp:a.guard,maxHp:GUARD,face:a.playerX>=a.bossX?1:-1,phase:'approach',
      timer:duration(s,55),tier:a.phase,cycle:0,attack:null,stagger:0,flash:0,exposed:0});
    s.message='Reprise de la phase '+a.phase+' · ressources de son début restaurées. '+objective(s);s.messageTicks=200;
    return true;
  }
  function validFlags(f,phase,anchor=false){
    if(!f||!Array.isArray(f.consoles)||f.consoles.length!==2||!f.consoles.every(v=>typeof v==='boolean')||
      !['held','ground','retrieved'].includes(f.register)||!integer(f.freightIntegrity,1,100)||f.freightIntegrity%25!==0||f.surrendered!==false)return false;
    if(phase===1)return f.consoles.every(v=>!v)&&f.register==='held'&&f.freightIntegrity===100;
    if(phase===2)return f.register==='held'&&f.freightIntegrity===100&&(!anchor||f.consoles.every(v=>!v));
    return f.consoles.every(Boolean)&&(anchor?f.register==='ground'&&f.freightIntegrity===100:['ground','retrieved'].includes(f.register));
  }
  function valid(s){
    const m=s.original,b=s.boss,a=m?.phaseStart;
    if(!m||m.schema!==VERSION||!integer(m.phase,1,3)||b.tier!==m.phase||b.maxHp!==GUARD||
      ![.75,1,1.25].includes(m.speed)||!integer(m.seed,0,16777215)||m.registerX!==REGISTER_X||
      !validFlags(m,m.phase)||!['intro','active'].includes(s.phase)||s.result!==null)return false;
    if(m.phase===1&&!(b.hp>198&&b.hp<=300)||m.phase===2&&!(b.hp>=99&&b.hp<=198)||
      m.phase===2&&b.hp===99&&both(m)||m.phase===3&&!(b.hp>=0&&b.hp<=99)||
      m.phase===3&&b.hp===0&&m.register!=='retrieved')return false;
    if(b.hp===0?b.phase!=='defeated'||b.attack!==null||b.timer!==0:
      !['approach','tell','attack','recover'].includes(b.phase)||b.timer<=0)return false;
    if(b.attack&&(b.attack.type!==PHASES[m.phase-1].attack||
      b.attack.warning!==duration(s,PHASES[m.phase-1].tell)||b.attack.active!==duration(s,PHASES[m.phase-1].active)))return false;
    if(!a||a.phase!==m.phase||a.guard!==THRESHOLDS[m.phase-1]||!validFlags(a.objectiveFlags,m.phase,true)||
      !scalar(a.bossX,90,1190)||!scalar(a.playerX,32,1248)||!scalar(a.playerHp,1,120)||
      !scalar(a.energy,0,100)||!scalar(a.guardMeter,0,100)||!integer(a.seed,0,16777215)||
      !integer(a.tick,0,18000)||!integer(a.remaining,1,18000)||!integer(a.nextId,1,100000))return false;
    const marker=a.marker;
    if(marker!==null&&(!marker||!['beacon','post','crate','anchor','memory'].includes(marker.kind)||
      !scalar(marker.x,0,1280)||!integer(marker.ttl,1,400)))return false;
    return a.stats&&['damageDealt','damageTaken','guarded','avoided','attacks','signatures','cargoHits'].every(key=>scalar(a.stats[key],0,100000));
  }
  function result(s){return {contentId:ID,nonLethal:true,phase:s.original.phase,objectiveFlags:flags(s.original),
    guardRemaining:s.boss.hp,retryAvailable:s.phase==='ended'&&!s.original.surrendered};}
  function drawObjects(s,c,images,geometries,paint){
    const m=s.original,floor=paint.floor;
    for(const [index,x] of CONSOLES.entries()){
      const disabled=m.consoles[index],key=disabled?'console-inactive':'console-active';
      if(!paint.sprite(c,images[key],x,floor,88,geometries[key]||{},'height')){
        c.fillStyle=disabled?'#53605a':'#c2a65e';c.fillRect(x-19,floor-73,38,73);
        c.fillStyle=disabled?'#b7c8c0':'#182b33';c.fillRect(x-14,floor-64,28,25);
      }
      paint.text(c,disabled?'DÉSACTIVÉE':m.phase===2?'T · CONSOLE '+(index+1):'PÉAGE '+(index+1),x,floor+25,12,disabled?'#bcebc5':'#ffe2a0','center');
      if(!disabled&&m.phase===2&&s.boss.phase==='recover'){
        c.strokeStyle='#d5f3a4';c.lineWidth=3;c.strokeRect(x-29,floor-92,58,100);
      }
    }
    if(m.register==='ground'){
      if(!paint.sprite(c,images.register,m.registerX,floor,48,geometries.register||{},'height')){
        c.fillStyle='#c8b47d';c.fillRect(m.registerX-24,floor-25,48,25);c.strokeStyle='#293c40';c.strokeRect(m.registerX-24,floor-25,48,25);
      }
      paint.text(c,'T · REGISTRE '+m.freightIntegrity+' %',m.registerX,floor-38,12,'#e7f1b7','center');
    }
    if(s.boss.hp===0&&!m.surrendered)paint.text(c,'T · LIEN / REDDITION',s.boss.x,floor-150,13,'#d6f2bb','center');
  }
  const guide=Object.freeze({id:ID,title:'Le péage des cargaisons',
    summary:'Un consignateur humain retient les colis pour les protéger. Rouvrez le passage en lui faisant restituer le registre et accepter le lien.',
    commands:Object.freeze([{key:'T',label:'Interagir',detail:'Près d’une console ou du registre pendant une reprise ; près du Consignateur à garde zéro pour sa reddition.'},
      {key:'Saut / déplacement',label:'Esquiver',detail:'Les cadres au sol annoncent les zones de poussée, de perche et de retenue. Les sons signalent annonce, impact et reprise.'},
      {key:'Léger / lourd / signature',label:'Réduire la garde',detail:'Les huit kits canoniques sont compatibles. Les frappes du côté découvert pendant une reprise sont les plus efficaces.'}]),
    phases:Object.freeze(PHASES.map((phase,i)=>Object.freeze({index:phase.index,guard:['300 → 198','198 → 99','99 → 0'][i],
      attack:phase.name,telegraphFrames:phase.tell,recoveryFrames:phase.recover,
      objective:['Punir la poussée manquée.','Désamorcer les deux consoles pendant les reprises.','Restituer le registre, faire tomber la garde, puis T pour la reddition.'][i],
      counter:phase.advice}))),
    victory:'Deux consoles désamorcées, registre restitué, garde zéro puis interaction au lien : aucune mort.',
    failure:'Vitalité à zéro, registre tombé à zéro d’intégrité ou temps écoulé. Reprise au début de la phase.',
    checkpoint:'Phase, objectifs, vitalité, énergie, repère, garde, temporisations, graine et état de reprise sont sauvegardés. Aucun inventaire de campagne n’est partagé.',
    compatibility:'Huit kits canoniques. Rencontre hors Boss Rush. Vitesse de scénario 0,75× / 1× / 1,25× ; les timings affichés correspondent à 1×.'});
  const requiredPoses=['guard','shield-push','pole-strike','stagger','kneel','surrender'],requiredProps=['console-active','console-inactive','register'];
  const source=host.StrandOriginalBossArt||{};
  const validGeometry=g=>g&&Array.isArray(g.crop)&&g.crop.length===4&&g.crop.every(Number.isFinite)&&g.crop[0]>=0&&g.crop[1]>=0&&g.crop[2]>0&&g.crop[3]>0&&scalar(g.anchorX,0,1)&&scalar(g.baselineY,0,1);
  const ready=source.ready===true&&requiredPoses.every(key=>typeof source.sprites?.consignateur?.[key]==='string'&&source.sprites.consignateur[key].length>0&&validGeometry(source.geometry?.bosses?.consignateur?.[key]))&&
    requiredProps.every(key=>typeof source.props?.[key]==='string'&&source.props[key].length>0&&validGeometry(source.propGeometry?.[key]));
  const controller=Object.freeze({create,valid,damage,tick,interact,pose,restore,result,objective,drawObjects});
  host.StrandOriginalBosses=Object.freeze({version:VERSION,id:ID,ready,phases:PHASES,guide,
    encounters:Object.freeze(ready?{[ID]:encounter}:{}),controllers:Object.freeze(ready?{[ID]:controller}:{})});
})(window);
