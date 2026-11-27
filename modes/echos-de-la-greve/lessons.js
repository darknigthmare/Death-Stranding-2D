/* Guided practice observes StrandFight snapshots and uses its normal J2 inputs.
 * It never edits fighter state, combat values, checkpoints or another save. */
(function (host) {
  'use strict';
  const storeKey='echos.lessons.v1';
  const lessons=[
    {id:'distance',title:'Entrer et sortir de portée',summary:'Approche, stabilise ta position, puis recrée de l’espace.',steps:['Reste à 65–105 pixels du mannequin pendant 15 pas. Avance avec {forward}, sans attaquer.','Recule avec {back}, puis reste à au moins 250 pixels pendant 15 pas.'],note:'L’écart est mesuré entre les centres des combattants. Tu apprends à choisir ta distance avant de frapper.'},
    {id:'reach',title:'Faire toucher un coup léger',summary:'Compare un coup dans le vide avec un vrai impact.',steps:['À au moins 150 pixels, lance un Léger avec {light} et laisse-le se terminer dans le vide.','Approche avec {forward}, relâche la direction, puis touche avec Léger {light}.'],note:'Le coup doit réellement enlever des PV au mannequin. Une pression sur le bouton ne suffit pas.'},
    {id:'guard-high',title:'Tenir la garde debout',summary:'Bloque trois frappes annoncées sans perdre de vitalité.',steps:['Le mannequin avance et lance des coups légers. Maintiens Garde {guard} pour en bloquer trois sans subir de dégât.'],note:'Une garde réussie protège les PV mais consomme de l’équilibre. Les attaques sont espacées pour cet exercice.'},
    {id:'guard-low',title:'Protéger les jambes',summary:'Reconnais un balayage et combine bas avec la garde.',steps:['Le mannequin avance et balaie. Maintiens Bas {down} + Garde {guard} pour bloquer trois balayages sans perdre de PV.'],note:'Une garde debout seule ne bloque pas le balayage. Si tu es touché, recommence pour essayer la combinaison.'},
    {id:'punish',title:'Punir un coup dans le vide',summary:'Attends la récupération du lourd et réponds avec un léger.',steps:['Place-toi à 150–175 pixels. Le mannequin lance un Lourd ; laisse-le manquer sans bloquer ni subir de dégât.','Dès sa récupération, avance avec {forward} et touche avec Léger {light} avant qu’il retrouve le repos.'],note:'Observe « Récupération » : cette fenêtre est courte. Si elle se referme, replace-toi et attends le prochain lourd.'},
    {id:'resource',title:'Dépenser puis récupérer',summary:'Déclenche une signature neutre et surveille la jauge chirale.',steps:['Relâche les directions et lance Signature {special}. La dépense de la technique doit apparaître dans la jauge.','Laisse la jauge remonter à 60, sans lancer d’autre attaque.'],note:'Le dojo recharge la jauge plus vite que les duels. Cette vitesse d’exercice ne décrit pas celle d’un match.'},
    {id:'signatures',title:'Les trois signatures',summary:'Exécute les variantes neutre, avant et arrière de ton combattant.',steps:['Neutre : relâche les directions, puis Signature {special}.','Avant : maintiens {forward} et appuie sur Signature {special}.','Arrière : maintiens {back} et appuie sur Signature {special}.'],note:'Avant désigne le mannequin, même après un changement de côté. Attends la fin du coup avant la variante suivante. Les préparations propres au combattant restent nécessaires.'},
    {id:'combo',title:'Confirmer puis enchaîner',summary:'Sur un léger qui touche, enchaîne immédiatement le lourd.',steps:['Approche et touche avec Léger {light}.','Pendant la récupération du léger confirmé, appuie sur Lourd {heavy}. Les deux impacts doivent appartenir au même enchaînement.'],note:'Le lourd doit commencer avant la fin naturelle du léger. Un lourd après le retour au repos ne valide pas cet exercice.'},
    {id:'taunt',title:'Le geste expose',summary:'Termine ton geste à distance, puis interromps celui du mannequin.',steps:['À au moins 250 pixels, lance Geste de défi {taunt}. Laisse les 54 pas se terminer en restant à distance.','Le mannequin se rapproche et provoque. Pendant son geste, touche avec Léger {light} pour l’interrompre. Attends la fin de tes autres techniques avant cet essai.'],note:'Le geste dure 0,9 seconde et reste vulnérable en entrée, en tenue et en sortie. Il ne donne aucun bonus offensif. Une frappe après la fin du geste ne valide pas l’interruption.'}
  ];
  const ids=lessons.map(lesson=>lesson.id),fighters=()=>Object.keys(host.StrandContent?.fighters||{});
  const copy=value=>JSON.parse(JSON.stringify(value));
  const get=id=>lessons.find(lesson=>lesson.id===id)||null;
  function valid(value) {
    if(!value||value.version!==1||!value.completed||typeof value.completed!=='object'||Array.isArray(value.completed))return false;
    if(!value.resume||!ids.includes(value.resume.id)||!fighters().includes(value.resume.fighter))return false;
    return Object.entries(value.completed).every(([id,entry])=>ids.includes(id)&&entry&&Number.isSafeInteger(entry.runs)&&entry.runs>0&&
      Array.isArray(entry.fighters)&&entry.fighters.length>0&&new Set(entry.fighters).size===entry.fighters.length&&entry.fighters.every(id=>fighters().includes(id)));
  }
  function createStore(storage=host.localStorage) {
    const fresh=()=>({version:1,completed:{},resume:{id:ids[0],fighter:'sam'}});
    let state=fresh(),saved=true,notice='';
    try {
      const raw=storage?.getItem(storeKey);
      if(raw){const parsed=JSON.parse(raw);if(valid(parsed))state=copy(parsed);else notice='La progression d’exercices enregistrée est incompatible. Un parcours vide est disponible ; les autres sauvegardes sont conservées.';}
    }catch(_){saved=false;notice='La progression n’a pas pu être lue. Le parcours reste disponible pendant cette session.';}
    function persist(){try{if(!storage)throw Error('No storage');storage.setItem(storeKey,JSON.stringify(state));saved=true;notice='';}catch(_){saved=false;notice='Le stockage est indisponible. Les exercices validés restent disponibles pendant cette session.';}}
    return {
      progress:()=>({...copy(state),saved,notice}),
      begin(id,fighter){if(!get(id)||!fighters().includes(fighter))return false;state.resume={id,fighter};persist();return true;},
      complete(id,fighter){if(!get(id)||!fighters().includes(fighter))return false;const entry=state.completed[id]||{runs:0,fighters:[]};
        entry.runs=Math.min(Number.MAX_SAFE_INTEGER,entry.runs+1);if(!entry.fighters.includes(fighter))entry.fighters.push(fighter);state.completed[id]=entry;
        state.resume={id:ids.find(next=>!state.completed[next])||id,fighter};persist();return true;}
    };
  }
  function createSession(id,fighter) {
    const definition=get(id),sheet=host.StrandMovesData?.forFighter(fighter);
    if(!definition||!sheet?.techniques?.length)throw new Error('Exercice ou fiche de combattant indisponible.');
    const steps=definition.steps.slice(),techniques=sheet.techniques;
    if(id==='signatures')techniques.forEach((move,index)=>{steps[index]+=' '+move.name+' · coût '+move.cost+'.';});
    const state={id,fighter,phase:'active',step:0,steps,feedback:'Prends place dans le dojo.',metric:'',ticks:0,evidence:[]};
    let previous=null,lastTick=-1,firstTick=null,held=0,blocks=0,lastAttack=-120,attack=null,whiff=null,resource=null,signature=null,combo=false,tauntRun=null;
    const bot={};
    const goal=details=>{state.evidence.push({goal:state.step+1,tick:lastTick,...details});state.step++;
      if(state.step>=steps.length){state.phase='success';state.feedback='Exercice validé. Tu peux poursuivre ou le refaire avec un autre combattant.';}};
    const fail=text=>{state.phase='retry';state.feedback=text;};
    function controls(wanted={}) {
      const commands=[];
      for(const action of ['left','right','down','light','heavy','taunt'])if(!!bot[action]!==!!wanted[action]){bot[action]=!!wanted[action];commands.push([2,action,!!wanted[action]]);}
      return commands;
    }
    function observe(status) {
      if(!status||status.mode!=='training')return {state:copy(state),commands:[]};
      if(status.paused||status.phase!=='fight'||state.phase!=='active')return {state:copy(state),commands:controls()};
      if(status.tick===lastTick)return {state:copy(state),commands:[]};
      lastTick=status.tick;if(firstTick===null)firstTick=lastTick;state.ticks=lastTick-firstTick;
      const [self,foe]=status.fighters,gap=Math.abs(foe.x-self.x),forward=foe.x>=self.x?'right':'left',toward=foe.x>=self.x?'left':'right';
      const [ownTiming,foeTiming]=status.training.moves||[],before=previous?.fighters[0],enemyBefore=previous?.fighters[1];
      const ownDamage=before?self.hp<before.hp:false,enemyDamage=enemyBefore?foe.hp<enemyBefore.hp:false;
      const began=!!self.action&&(self.action!==before?.action||(ownTiming?.frame||0)<(previous?.training.moves?.[0]?.frame||0));
      const wanted={};state.forward=forward;state.metric='Écart '+Math.round(gap)+' px · Jauge chirale '+self.chiral+' / 100';
      if(id==='distance') {
        const inZone=state.step===0?gap>=65&&gap<=105:gap>=250;
        held=inZone&&!self.action&&self.y===0&&before&&Math.abs(self.x-before.x)<.2?held+1:0;state.metric+=' · Stabilité '+Math.min(held,15)+' / 15';
        state.feedback=state.step===0?'Entre dans la zone 65–105 px et relâche la direction.':'Éloigne-toi à au moins 250 px et stabilise ta position.';
        if(held>=15){goal({gap:Math.round(gap),stableTicks:held});held=0;}
      } else if(id==='reach') {
        if(state.step===0){
          if(began&&self.action==='light'&&gap>=150)whiff={hp:foe.hp,tick:lastTick,gap};
          if(whiff&&foe.hp<whiff.hp)whiff=null;
          if(whiff&&before?.action==='light'&&!self.action){goal({kind:'light-whiff',startGap:Math.round(whiff.gap),opponentHp:foe.hp});whiff=null;}
          state.feedback='Lance un léger depuis au moins 150 px et attends son retour au repos.';
        } else {state.feedback='Approche : le léger doit maintenant enlever des PV.';if(enemyDamage&&self.move==='light')goal({kind:'light-hit',damage:enemyBefore.hp-foe.hp,gap:Math.round(gap)});}
      } else if(id==='guard-high'||id==='guard-low') {
        const low=id==='guard-low',kind=low?'sweep':'light';
        state.metric+=' · Blocages '+blocks+' / 3';state.feedback=low?'Maintiens Bas + Garde : le mannequin prépare un balayage.':'Maintiens Garde : le mannequin prépare un léger.';
        if(ownDamage)fail(low?'Le balayage t’a touché. Recommence en combinant Bas et Garde.':'La frappe t’a touché. Recommence en tenant la garde avant l’impact.');
        else if(before&&self.hp===before.hp&&self.balance<before.balance&&self.guard&&foe.action===kind){
          blocks++;state.metric='Blocages '+blocks+' / 3 · Vitalité '+self.hp+' / 100';state.feedback='Blocage confirmé · '+blocks+' / 3.';
          if(blocks===3)goal({blocks,kind,vitality:self.hp});
        }
        if(state.phase==='active'&&!foe.action&&!foe.stun){
          if(gap>72)wanted[toward]=true;
          else if(lastTick-lastAttack>=110){wanted.down=low;wanted.light=true;lastAttack=lastTick;}
        } else if(low&&foe.action==='sweep')wanted.down=true;
      } else if(id==='punish') {
        if(ownDamage){fail('Le lourd t’a touché. Recommence en restant hors de portée jusqu’à sa récupération.');}
        if(!foe.action&&!foe.stun&&gap>=150&&gap<=175&&lastTick-lastAttack>=95){
          wanted.heavy=true;lastAttack=lastTick;attack={hp:self.hp,balance:self.balance,whiff:false,started:false};state.step=0;
        }
        if(attack&&foe.action==='heavy')attack.started=true;
        if(attack&&foe.action==='heavy'&&foeTiming?.phase==='Récupération'&&!attack.whiff&&self.hp===attack.hp&&self.balance>=attack.balance){
          attack.whiff=true;state.step=1;state.evidence=[{goal:1,tick:lastTick,kind:'heavy-whiff',gap:Math.round(gap)}];
        }
        const recovery=previous?.training.moves?.[1];
        if(attack?.whiff&&enemyDamage&&self.move==='light'&&enemyBefore?.action==='heavy'&&recovery?.phase==='Récupération'&&recovery.frame<recovery.start+recovery.active+recovery.recover)
          goal({kind:'recovery-punish',damage:enemyBefore.hp-foe.hp,opponentPhaseBeforeImpact:recovery.phase});
        if(attack?.started&&!foe.action&&!enemyDamage&&state.phase==='active'){attack=null;state.step=0;state.evidence=[];}
        state.feedback=state.phase==='retry'?state.feedback:state.step===1?'Récupération : avance et touche au léger maintenant.':'Place-toi à 150–175 px. Attends que le lourd manque avant d’avancer.';
      } else if(id==='resource') {
        if(state.step===0){state.feedback='Sans direction, déclenche ta signature neutre.';
          if(began&&self.action===techniques[0].engineAction&&before&&before.chiral-self.chiral>=techniques[0].cost-1){resource={start:self.chiral};goal({kind:'chiral-spent',observedDrop:before.chiral-self.chiral,cost:techniques[0].cost});}}
        else {state.feedback='Observe la recharge du dojo : attends 60 points de jauge.';
          if(began){fail('Une autre attaque a commencé. Recommence pour observer le retour de la jauge sans nouvelle attaque.');}
          else if(resource&&self.chiral>=60)goal({kind:'chiral-recovered',from:resource.start,to:self.chiral});}
      } else if(id==='signatures') {
        const move=techniques[state.step];
        if(began){const prerequisite=self.action==='recall'?'post':self.action==='winch'?'anchor':self.action==='retrieve'?'crate':null;
          signature={key:self.action,prepared:!prerequisite||before?.marker?.kind===prerequisite};}
        state.feedback=state.step===0?'Commence sans direction.':state.step===1?'Maintiens la direction vers le mannequin au moment de la signature.':'Maintiens la direction opposée au mannequin au moment de la signature.';
        if(state.step===2&&['mama','mule','cliff'].includes(fighter))state.feedback+=' Si le marqueur a disparu, repose '+(fighter==='mama'?'l’ancrage avec la signature neutre.':fighter==='mule'?'la caisse avec Avant + Signature.':'le poste avec Avant + Signature.');
        if(signature?.key===move.engineAction&&signature.prepared&&self.action===move.engineAction&&ownTiming?.frame>=move.startup){
          goal({kind:'signature-active',engineAction:move.engineAction,frame:ownTiming.frame,cost:move.cost});signature=null;
        }
      } else if(id==='taunt') {
        if(state.step===0){
          state.feedback=gap<250?'Recule à au moins 250 px avant de lancer le geste.':'Lance Geste de défi et laisse son cycle entier se terminer.';
          if(self.taunt&&!before?.taunt&&gap>=250)tauntRun={startTick:lastTick-self.taunt.frame,total:host.StrandFight.tauntRules.total,minGap:gap,hp:self.hp,phases:[]};
          if(tauntRun){
            tauntRun.minGap=Math.min(tauntRun.minGap,gap);
            if(ownDamage||gap<250||self.y!==0||self.action){tauntRun=null;state.feedback='Le cycle à distance n’est pas complet. Replace-toi et recommence le geste.';}
            else if(self.taunt){
              if(!tauntRun.phases.includes(self.taunt.phase))tauntRun.phases.push(self.taunt.phase);
              state.metric+=' · Geste '+Math.min(self.taunt.frame,tauntRun.total)+' / '+tauntRun.total+' pas';
              state.feedback='Le geste t’expose : attends la fin de sa sortie.';
            } else if(before?.taunt&&before.taunt.frame===tauntRun.total-1&&lastTick-tauntRun.startTick>=tauntRun.total&&self.hp===tauntRun.hp){
              goal({kind:'taunt-complete',duration:tauntRun.total,minGap:Math.round(tauntRun.minGap),phases:tauntRun.phases});tauntRun=null;
            } else tauntRun=null;
          }
        } else {
          state.feedback=foe.taunt?'Le mannequin est vulnérable : touche au léger pendant son geste.':'Attends sa provocation. Une frappe après le geste ne compte pas.';
          const lingering=!!(before?.marker||self.marker||previous?.training.moves?.[0]?.projectile||ownTiming?.projectile);
          const activeLight=self.action==='light'&&self.move==='light'&&ownTiming?.phase==='Activité'&&!lingering;
          // Both fighters advance before contacts: the last previous frame can
          // already have ended naturally when this hit actually lands.
          if(enemyDamage&&enemyBefore?.taunt&&enemyBefore.taunt.frame<host.StrandFight.tauntRules.total-1&&!foe.taunt&&activeLight)
            goal({kind:'taunt-interrupted',opponentPhase:enemyBefore.taunt.phase,opponentFrame:enemyBefore.taunt.frame,damage:enemyBefore.hp-foe.hp});
          else if(enemyDamage)state.feedback=!activeLight?'Attends la fin de tes autres techniques, puis interromps le prochain geste avec un coup léger.':'La frappe est arrivée hors du geste. Attends la prochaine provocation.';
          if(state.phase==='active'&&!foe.action&&!foe.stun&&!foe.taunt){
            if(gap>78)wanted[toward]=true;
            else if(lastTick-lastAttack>=90){wanted.taunt=true;lastAttack=lastTick;}
          }
        }
      } else if(id==='combo') {
        if(enemyDamage&&self.move==='light'){state.step=1;state.evidence=[{goal:1,tick:lastTick,kind:'light-hit',combo:self.combo}];combo=false;}
        if(began&&self.action==='heavy'&&before?.action==='light'&&before.combo>0)combo=true;
        if(state.step===1&&enemyDamage&&self.move==='heavy'&&self.combo>=2&&combo)goal({kind:'confirmed-cancel',combo:self.combo,damage:enemyBefore.hp-foe.hp});
        if(state.step===1&&!self.combo&&state.phase==='active'){state.step=0;state.evidence=[];combo=false;}
        state.feedback=state.step===0?'Approche et confirme un impact léger.':'Enchaîne le lourd pendant la récupération du léger qui a touché.';
      }
      if(state.phase==='success')state.feedback='Exercice validé. Poursuis le parcours ou recommence pour t’exercer.';
      previous=copy(status);
      return {state:copy(state),commands:controls(state.phase==='active'?wanted:{})};
    }
    return {definition:copy(definition),observe,status:()=>copy(state),release:()=>controls()};
  }
  host.StrandLessons={schema:1,storeKey,lessons,get,valid,createStore,createSession};
})(window);
