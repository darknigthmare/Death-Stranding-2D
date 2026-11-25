/* Les Nœuds rompus: original simulator fiction and its independent chapter save. */
(function(host){
  'use strict';
  const STORE='echos.campaign.v1',RULES='les-noeuds-rompus-20261125-v1';
  const difficulties={easy:'Débutant',normal:'Porteur',hard:'Vétéran'};
  const prologue={id:'prologue',title:'Six liaisons interrompues',speaker:'Le simulateur',stage:'terminal',
    paragraphs:[
      'Une nouvelle reconstitution s’ouvre dans Échos de la Grève. Six liaisons du réseau interne se ferment au même instant. Sur chaque terminal, la même phrase demeure : « Relier sans effacer. »',
      'Les silhouettes qui répondent sont des empreintes réunies par le simulateur. Chacune garde un fragment du trajet, mais aucune ne peut le parcourir seule. La machine tente de protéger leurs souvenirs en les isolant ; elle les rend ainsi inaccessibles.',
      'Sam ramasse une balise dépourvue d’adresse. Il ne s’agit pas de changer leur passé. Il faut leur rendre la possibilité de se répondre.'
    ]};
  const chapters=[
    {id:'balise-sans-adresse',title:'Balise sans adresse',p1:'sam',p2:'mule',kind:'duel',stage:'mule-camp',objective:'Récupérer la balise sans effacer le registre du camp.',
      before:{title:'Le colis qui ne part pas',paragraphs:[
        'Au camp reconstitué, tous les lecteurs pointent vers la même caisse. L’empreinte du porteur MULE la protège comme si la déplacer devait faire disparaître le reste du stock.',
        'Sam pose sa balise sur le couvercle. Les deux appareils émettent la même note, mais refusent d’inscrire un destinataire. Pour sortir du camp, il doit rompre la garde du porteur et accéder au registre.',
        '« Je ne prends pas ton inventaire, dit Sam. J’ai besoin de savoir à qui cette caisse essaie de répondre. »'
      ]},
      after:{title:'Une adresse incomplète',paragraphs:[
        'Le registre cesse de se répéter. Sous les numéros de cargaison, Sam découvre un appel qui n’a jamais reçu de réponse. La balise en conserve le rythme, pas le nom.',
        'Le porteur garde sa caisse. Sam transmet seulement la trace à Fragile : le signal s’est perdu dans les ruines, au moment où deux itinéraires ont été superposés.'
      ]}},
    {id:'detour-higgs',title:'Le détour d’Higgs',p1:'fragile',p2:'higgs',kind:'duel',stage:'south-knot-ruins',objective:'Séparer la vraie liaison du détour qui la ramène sur elle-même.',
      before:{title:'Le même carrefour',paragraphs:[
        'Fragile suit la trace jusqu’à une rue que la reconstitution lui présente trois fois. Chaque sortie revient au même carrefour. L’empreinte d’Higgs attend au milieu du passage.',
        '« Une seule route, une seule voix. Ce serait tellement plus simple. » Son raccourci promet de réunir les fragments en supprimant tout ce qui les distingue.',
        'Fragile refuse. Elle doit ouvrir une brèche dans cette boucle pour retrouver la liaison, sans accepter la version unique qu’Higgs voudrait laisser derrière lui.'
      ]},
      after:{title:'Le détour reconnu',paragraphs:[
        'La rue reprend sa profondeur. Fragile distingue enfin le signal de la balise du bruit qui le recouvrait. Higgs n’avait pas créé les six ruptures : son empreinte exploitait une fermeture déjà inscrite dans le réseau interne.',
        'Le passage mène à une installation verrouillée. Fragile remet à Mama la trace et une consigne : rouvrir la liaison, sans choisir à la place des autres ce qui mérite d’être conservé.'
      ]}},
    {id:'ordre-ferme',title:'L’ordre fermé',p1:'mama',p2:'diehardman',kind:'duel',stage:'ruined-factory',objective:'Rouvrir le relais de la reconstitution sans supprimer ses empreintes.',
      before:{title:'Préserver en fermant',paragraphs:[
        'Dans l’installation, Mama trouve deux ordres incompatibles : préserver toutes les empreintes et fermer toutes les liaisons. L’automate de contrôle les applique pourtant ensemble.',
        'L’empreinte de Die-Hardman tient le seuil. Elle ne laisse rien entrer, rien sortir, pas même la preuve que la fermeture est devenue le danger.',
        'Mama installe son ancrage sur la piste d’essai. « Une porte qui ne s’ouvre jamais ne protège plus un passage. Laisse-moi te le montrer. » Le duel éprouvera le verrou, pas le droit d’un souvenir à exister.'
      ]},
      after:{title:'Une consigne corrigée',paragraphs:[
        'Le relais répond. Die-Hardman voit enfin les appels accumulés derrière sa propre consigne. Il conserve le registre, mais libère le seuil.',
        'Mama réunit la balise et la clé du relais. Il manque encore une voix capable de reconnaître les fragments. Heartman reçoit un signal provenant d’un champ de bataille reconstitué.'
      ]}},
    {id:'memoire-ouverte',title:'Ce qui répond encore',p1:'heartman',p2:'cliff',kind:'duel',stage:'battlefield',objective:'Dégager un repère de mémoire sans le confondre avec un retour à la vie.',
      before:{title:'Une voix dans la brume',paragraphs:[
        'Heartman retrouve la note de la balise entre deux détonations. Le simulateur a enfermé ici un fragment de réponse ; il le rejoue sans jamais lui laisser atteindre son destinataire.',
        'Cliff garde la piste avec l’obstination d’une empreinte qui craint le silence. Heartman n’annonce ni résurrection ni promesse de retrouvailles. Il veut ouvrir une écoute, en gardant à cette voix sa place et ses limites.',
        '« Je ne viens pas te prendre ce que tu cherches. Je veux que ton appel cesse de tourner seul. » Pour atteindre le repère, il doit traverser la garde de Cliff.'
      ]},
      after:{title:'Le fragment reste distinct',paragraphs:[
        'La brume s’écarte autour du repère. Heartman isole la réponse sans la fondre dans les autres voix. Le champ de bataille reste une reconstitution ; ce qui en sort est un fragment de mémoire, pas un être revenu.',
        'Les pièces peuvent maintenant rejoindre le dernier relais. Die-Hardman prend en charge leur transport, avec une consigne qui laisse enfin une destination ouverte.'
      ]}},
    {id:'convoi-des-retours',title:'Le convoi des retours',p1:'diehardman',boss:'convoy',kind:'boss',stage:'timefall-farm',objective:'Intercepter deux camions et livrer leurs deux colis au dépôt.',
      before:{title:'Deux charges à ramener',paragraphs:[
        'La reconstitution a réparti les pièces de la liaison dans deux cargaisons. Un convoi MULE les emporte vers une nouvelle boucle de stockage. Sans elles, le relais rouvert ne pourra transmettre aucun retour.',
        'Die-Hardman entre sur la piste de la ferme. Cette fois, son ordre ne demande pas de tenir une porte fermée : il faut préserver le dépôt et rapporter les deux charges.',
        'Intercepte un camion par vague, puis transporte son colis vers le dépôt à gauche. Les tirs bas menacent la cargaison autant que le porteur.'
      ]},
      after:{title:'Le dépôt répond',paragraphs:[
        'Les deux colis atteignent le dépôt. La balise retrouve le rythme de l’appel, la clé libère son passage et le repère de mémoire lui rend une provenance. Les six liaisons peuvent désormais se distinguer.',
        'Une dernière masse de bruit demeure sur la Grève du simulateur. Sam reçoit les pièces réunies : il lui reste à dégager l’espace où leurs réponses pourront circuler.'
      ]}},
    {id:'dernier-lien',title:'Le dernier lien',p1:'sam',boss:'whale',kind:'boss',stage:'shore',objective:'Vaincre la baleine de goudron pour libérer le dernier relais.',
      before:{title:'Sous la masse de goudron',paragraphs:[
        'Sur la Grève reconstituée, les liaisons isolées ont pris la forme d’une baleine de goudron. Sa présence étouffe le dernier relais ; chaque réapparition recouvre une nouvelle tentative de réponse.',
        'Sam porte la balise, la clé et le repère. Il n’a pas à choisir quelle voix doit rester. Il doit ouvrir le passage assez longtemps pour que chacune retrouve sa propre liaison.',
        'Repère les jets annoncés, quitte leur zone et frappe pendant les ouvertures. « Je ne porte pas leur passé, dit Sam. Je porte leurs réponses. »'
      ]},
      after:{title:'Les six réponses',paragraphs:[
        'Le goudron se retire de la piste. Six signaux distincts atteignent le relais : aucun n’efface son voisin, aucun ne parle à sa place.',
        'Sam dépose la balise. Au lieu d’un nom unique, son écran montre six destinations ouvertes. La reconstitution peut se poursuivre sans enfermer ses empreintes.'
      ]}}
  ];
  const ending={id:'conclusion',title:'Une place pour chaque voix',speaker:'Les empreintes réunies',stage:'shore',
    paragraphs:[
      'Dans le terminal du simulateur, Mama regarde les liaisons reprendre leur place. Heartman conserve les fragments séparément. Die-Hardman laisse la consigne corrigée auprès de la porte, là où le prochain porteur pourra la lire.',
      'Fragile vérifie qu’aucune route ne revient au même carrefour. Au camp, le porteur referme sa caisse sans relancer son lecteur. Dans la brume, un appel cesse enfin de tourner sur lui-même.',
      'Sam franchit le seuil les mains libres. Le réseau interne n’a réécrit aucune vie : il a rendu à chaque empreinte la possibilité d’être entendue. Sur la balise, une phrase demeure. « Relier sans effacer. »'
    ]};
  for(const chapter of chapters){
    chapter.work='ds1-dc';chapter.version='Empreinte du kit DS1 / Director’s Cut';
    chapter.before={id:chapter.id+'-avant',speaker:chapter.p1,stage:chapter.stage,...chapter.before};
    chapter.after={id:chapter.id+'-apres',speaker:chapter.p1,stage:chapter.stage,...chapter.after};
  }
  const scenes=[prologue,...chapters.flatMap(c=>[c.before,c.after]),ending];
  const sceneIds=new Set(scenes.map(s=>s.id));
  function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  freeze(chapters);freeze(scenes);freeze(difficulties);
  const clone=v=>JSON.parse(JSON.stringify(v)),integer=(v,max=1000000)=>Number.isInteger(v)&&v>=0&&v<=max;
  function empty(){return {version:1,rules:RULES,nextRun:1,run:null,unlocked:[],completed:{easy:0,normal:0,hard:0}};}
  function valid(data){
    if(!data||data.version!==1||data.rules!==RULES||!integer(data.nextRun)||data.nextRun<1||
      !Array.isArray(data.unlocked)||data.unlocked.length>scenes.length||data.unlocked.some(id=>!sceneIds.has(id))||new Set(data.unlocked).size!==data.unlocked.length||
      !data.completed||Object.keys(difficulties).some(d=>!integer(data.completed[d])))return false;
    const r=data.run;if(r===null)return true;
    if(!r||!integer(r.id)||r.id<1||r.id>=data.nextRun||!Object.hasOwn(difficulties,r.difficulty)||!integer(r.chapter,chapters.length-1)||
      !['prologue','briefing','active','defeat','aftermath','ending','complete'].includes(r.phase)||!Array.isArray(r.attempts)||r.attempts.length!==chapters.length||r.attempts.some(a=>!integer(a))||
      !Array.isArray(r.results)||r.results.length>chapters.length)return false;
    const expected=['ending','complete'].includes(r.phase)?chapters.length:r.phase==='aftermath'?r.chapter+1:r.chapter;
    if(r.results.length!==expected||(r.phase==='prologue'&&r.chapter!==0)||(['ending','complete'].includes(r.phase)&&r.chapter!==chapters.length-1))return false;
    const summary=(result,index,won)=>result&&result.chapter===chapters[index].id&&result.won===won&&integer(result.attempt)&&result.attempt>0&&result.attempt<=r.attempts[index]&&
      integer(result.vitality,120)&&['ko','time','health','cargo','boss','encounter'].includes(result.reason)&&
      (result.rounds===undefined||Array.isArray(result.rounds)&&result.rounds.length===2&&result.rounds.every(n=>integer(n,5)))&&
      (result.score===undefined||integer(result.score,100000000));
    if(!r.results.every((result,index)=>summary(result,index,true)))return false;
    if(['prologue','briefing','active'].includes(r.phase))return r.lastResult===null;
    return summary(r.lastResult,r.chapter,r.phase!=='defeat');
  }
  function createStore(storage){
    if(!arguments.length){try{storage=host.localStorage;}catch{storage=null;}}
    let state=empty(),saved=!!storage,recovery='',ticket=null;
    try{
      const raw=storage?.getItem(STORE);
      if(raw){const data=JSON.parse(raw);if(valid(data))state=clone(data);else recovery='La sauvegarde de cette campagne est incompatible. Une nouvelle partie peut être créée.';}
    }catch{saved=false;recovery='La sauvegarde de cette campagne n’a pas pu être lue. La progression reste disponible pendant cette session.';}
    function write(){try{if(!storage)throw Error('No storage');storage.setItem(STORE,JSON.stringify(state));saved=true;}catch{saved=false;}return saved;}
    function unlock(id){if(!state.unlocked.includes(id))state.unlocked.push(id);}
    function progress(){return {...clone(state),saved,recovery};}
    function start(difficulty){
      const selected=Object.hasOwn(difficulties,difficulty)?difficulty:'normal';
      state.run={id:state.nextRun++,difficulty:selected,chapter:0,phase:'prologue',attempts:chapters.map(()=>0),results:[],lastResult:null};
      ticket=null;recovery='';unlock(prologue.id);write();return progress();
    }
    function suspend(){
      ticket=null;
      if(state.run?.phase==='active'){state.run.phase='briefing';state.run.lastResult=null;write();}
      return progress();
    }
    function resume(){
      if(state.run?.phase==='defeat'){state.run.phase='briefing';state.run.lastResult=null;write();}
      return suspend();
    }
    function advance(){
      const r=state.run;if(!r)return false;
      if(r.phase==='prologue'){r.phase='briefing';unlock(chapters[0].before.id);}
      else if(r.phase==='aftermath'){
        if(r.chapter===chapters.length-1){r.phase='ending';unlock(ending.id);}
        else{r.chapter++;r.phase='briefing';r.lastResult=null;unlock(chapters[r.chapter].before.id);}
      }else if(r.phase==='ending'){r.phase='complete';state.completed[r.difficulty]++;}
      else return false;
      ticket=null;write();return true;
    }
    function beginEncounter(){
      const r=state.run;if(!r||r.phase!=='briefing')return null;
      r.phase='active';r.lastResult=null;r.attempts[r.chapter]++;
      ticket=[r.id,r.chapter,r.attempts[r.chapter]].join(':');write();
      return {ticket,chapter:chapters[r.chapter],difficulty:r.difficulty,index:r.chapter};
    }
    function record(expectedTicket,result){
      const r=state.run;if(!r||r.phase!=='active'||!ticket||ticket!==expectedTicket||!result)return null;
      const c=chapters[r.chapter],duel=c.kind==='duel';
      if(result.stage!==c.stage||(duel?result.fighters?.[0]!==c.p1||result.fighters?.[1]!==c.p2||![1,2].includes(result.winner):
        result.p1!==c.p1||result.bossId!==c.boss||result.difficulty!==r.difficulty||typeof result.won!=='boolean'))return null;
      const won=duel?result.winner===1:result.won;
      const summary={chapter:c.id,won,attempt:r.attempts[r.chapter],reason:['ko','time','health','cargo','boss'].includes(result.reason)?result.reason:'encounter',
        vitality:Number.isFinite(result.vitality)?Math.max(0,Math.round(result.vitality)):0};
      if(duel&&Array.isArray(result.rounds)&&result.rounds.length===2&&result.rounds.every(n=>integer(n,5)))summary.rounds=result.rounds.slice();
      if(!duel&&Number.isFinite(result.score))summary.score=Math.max(0,Math.round(result.score));
      r.lastResult=summary;r.phase=won?'aftermath':'defeat';
      if(won){r.results.push(summary);unlock(c.after.id);}
      ticket=null;write();return clone(summary);
    }
    function currentScene(){const r=state.run;if(!r)return null;return r.phase==='prologue'?prologue:r.phase==='aftermath'?chapters[r.chapter].after:
      ['ending','complete'].includes(r.phase)?ending:chapters[r.chapter].before;}
    return {progress,start,resume,suspend,advance,beginEncounter,record,currentScene};
  }
  host.StrandCampaign=Object.freeze({title:'Les Nœuds rompus',storeKey:STORE,rules:RULES,chapters,scenes,prologue,ending,difficulties,createStore,valid,
    fiction:'Fiction du simulateur Échos. Les empreintes et rencontres de cette campagne ne réécrivent ni les événements officiels ni La Ligne silencieuse.'});
})(typeof window!=='undefined'?window:globalThis);
