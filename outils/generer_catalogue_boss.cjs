/* Documentation-only catalogue of boss.js. No engine file is rewritten. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {inspectEngine,prepareAction,clone,repo,mode}=require('./lib/boss-engine.cjs');
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const difficulties={easy:'Débutant',normal:'Porteur',hard:'Vétéran'};
const actionNotes={
  light:['Frappe unique ; aucun enchaînement par annulation ni touche confirmée n’est requis.'],
  sweep:['Même frappe, portée et dégâts que Léger dans ce moteur. Aucun niveau de garde propre au Boss.'],
  heavy:['Frappe unique. MULE peut aussi lancer sa propre caisse placée à moins de 180 unités ; la caisse est consommée.'],
  lift:['Même frappe que Lourd ; aucun lancement vertical du Boss. La poussée de sa propre caisse reste possible pour MULE.'],
  grab:['Les grandes cibles ne sont pas projetées : frappe d’appui de base 14. Sur Camion et Convoi, la commande sert uniquement aux colis et ne démarre pas cette frappe.'],
  finish:['Charge offensive pendant la rencontre : 70 points, une mêlée puis un projectile. Les deux contacts ne sont pas garantis. Aucun cinéma de finalité du duel.'],
  bola:['Projectile unique à hauteur de torse ; ne lie pas le déplacement du Boss.'],
  brace:['Bouclier de contre, 55 pas à partir de l’exécution. Face au prochain impact, bloque même une attaque non gardable, riposte de base 24 et se consomme.'],
  parry:['Même bouclier de contre de 55 pas que Reprise d’appui ici. Aucun échange automatique de côté.'],
  blink:['Avance de 210 unités, limité à la piste ; 30 pas d’invulnérabilité et mêlée à la nouvelle position. Une traversée trop profonde peut placer la cible derrière la frappe.'],
  fan:['Mêlée de base 30, sans restriction de garde haute ni soulèvement de la grande cible.'],
  beacon:['Première activation : repère de 240 pas. Seconde : retour au repère, consommation et 24 pas d’invulnérabilité. Chaque activation coûte 16.'],
  tar:['La zone vise la position du Boss à l’exécution, après 23 pas, et non sa position au départ du geste.'],
  mine:['Zone immobile à 185 unités devant le joueur, limitée à la piste. Délai du projectile 18 pas ; ne remplace pas le marqueur personnel.'],
  feint:['Recul de 110 unités limité à la piste ; 38 pas d’invulnérabilité. Aucun leurre avec une collision indépendante.'],
  salvo:['Deux projectiles de base 20, à deux hauteurs ; le second attend 9 pas. Aucune garantie de double touche.'],
  post:['Pose à 230 unités devant, limitée à la piste ; le poste dure 300 pas.'],
  recall:['Exige son poste avant la dépense. Zone verticale sur le poste puis consommation ; aucun coût ni action si le poste manque.'],
  scan:['Expose le Boss pendant 150 pas, même hors de portée de la mêlée. La frappe de base 18 a une portée de 480 unités plus le rayon de la cible ; le bonus d’exposition s’applique déjà à cette frappe.'],
  crate:['Pose sa caisse à 86 unités devant, limitée à la piste, pour 360 pas. Pose seule : aucun dégât. Lourd/Montant ou Saisie de lot la consomment.'],
  retrieve:['Exige sa propre caisse avant la dépense. La caisse part vers la position du joueur au moment de l’exécution, vitesse 8 ; si les deux positions coïncident, vitesse 0.'],
  order:['Bouclier de contre pendant 80 pas. Même protection et riposte de base 24 que les contres de Sam ; aucun sceau ni renforcement ultérieur de Ligne d’arrêt/Relève.'],
  gate:['Zone immobile à 170 unités devant, limitée à la piste ; sa durée ne dépend d’aucun sceau.'],
  relief:['Recul de 75 unités limité à la piste, puis mêlée de portée 210 ; 18 pas d’invulnérabilité. Aucun bonus de sceau.'],
  anchor:['Pose un ancrage à 155 unités devant, limité à la piste, pour 360 pas.'],
  deck:['Le projectile part de son ancrage, ou des pieds sans ancrage. Même vitesse, volume et dégâts dans les deux cas ; ne consomme pas l’ancrage.'],
  winch:['Exige son ancrage avant la dépense ; rejoint ce repère, le consomme et donne 25 pas d’invulnérabilité. Aucun dégât direct.'],
  pulse:['Projectile unique de base 38 ; aucune fenêtre de battement ni accélération liée au rythme dans boss.js.'],
  memory:['Première activation : mémoire de 300 pas. Seconde : zone de base 48 sur le repère puis consommation. Chaque activation coûte 18.'],
  syncope:['Recul de 110 unités limité à la piste ; 38 pas d’invulnérabilité, sans condition de battement.']
};
const patternNotes={
  charge:{damage:25,response:'Sautez au passage ou utilisez un contre prêt en faisant face. La garde ordinaire ne bloque pas la charge.',details:'La cible est mémorisée au début de l’annonce, limitée à x=150…1130. Le Boss atteint cette abscisse en 38 pas ; contact à distance horizontale <125 et hauteur des pieds <120. Un seul impact réussi par charge.'},
  ring:{damage:20,response:'Sautez lorsque chaque anneau arrive. La garde ordinaire ne le bloque pas.',details:'Deux anneaux partent en sens opposés, bas et non gardables. Vitesse 7,2 en phase 1, 9 en phase 2 ; ils peuvent encore circuler pendant la récupération.'},
  spikes:{damage:23,response:'Quittez les colonnes marquées avant leur émission ; la garde ordinaire ne les bloque pas.',details:'Trois colonnes en phase 1, jusqu’à cinq en phase 2. Les positions sont limitées à la piste et dédoublonnées près des bords. Les émissions sont décalées de 4 pas.'},
  pounce:{damage:28,response:'Sortez de la marque au sol ; un simple saut dans la colonne n’assure pas l’esquive.',details:'Le Boss rejoint la cible de l’annonce en 14 pas ; zone de frappe de 215 × 240, délai propre 10 pas, non gardable.'},
  breach:{damage:28,response:'Quittez la zone annoncée de la réapparition et profitez ensuite du noyau exposé.',details:'Même bond de 14 pas et zone de 215 × 240 que le bond léonin ; délai propre 10 pas, non gardable.'},
  stomp:{damage:28,response:'Déplacez-vous hors de chaque marque ; la colonne haute couvre un saut ordinaire.',details:'Une zone de 200 × 450. En phase 2, une seconde zone de 180 × 450 est placée à 290 unités du premier point, vers le centre et limitée à la piste. Délai propre 10 pas, non gardable.'},
  orbs:{damage:19,response:'Gardez face aux orbes ; accroupissez-vous avec la garde pour ceux du bas, ou évitez leur trajectoire.',details:'Trois orbes, puis quatre en phase 2. Hauteurs alternées 92 / 36 au-dessus du sol ; intervalle d’émission 18 pas. Ils peuvent persister après l’entrée en récupération.'},
  bolts:{damage:15,response:'Gardez face aux tirs ; Bas + Garde pour les tirs bas. Dans le Convoi, interceptez les tirs bas avant le dépôt.',details:'Trois tirs, puis quatre en phase 2 ; hauteurs 92 / 36, intervalle 18 pas. Un tir bas non intercepté entre x=90 et 170 retire 7 d’intégrité au dépôt du Convoi.'}
};
const encounterNotes={
  lion:['Enchaînement fixe : charge, anneau, bond. La charge vise votre position au début de son annonce.'],
  squid:['Enchaînement fixe : jets, orbes, anneau. Les jets se resserrent près des bords quand plusieurs repères se confondent.'],
  whale:['Enchaînement fixe : orbes, jets, brèche. Après chaque récupération naturelle, immersion de 55 pas puis réapparition du côté opposé à la position actuelle du joueur (x=980 si joueur à gauche, sinon 300), suivie de 35 pas d’approche.','Pendant l’immersion, aucune mêlée ni aucun projectile ami ne peut infliger de dégâts. L’exposition du scan continue de s’écouler.'],
  giant:['Enchaînement fixe : écrasement, anneau, orbes. La hauteur de collision passe de 380 à 266 dans les poses d’annonce/attaque ; le dessin ne détermine pas cette collision.'],
  truck:['Un seul camion. Son immobilisation fait apparaître deux colis. Il faut les prendre et les livrer séparément au dépôt à gauche.','Ce Camion isolé n’endommage pas directement le dépôt avec ses tirs ou sa charge. Recevoir un coup non bloqué en portant un colis retire toutefois 12 d’intégrité.'],
  convoy:['Deux camions, un colis par camion. Le second arrive 180 pas après la destruction du premier, même si le premier colis n’a pas encore été livré.','Les PV du second camion sont arrondis après un facteur ×1,12. Le temps, la vitalité, l’énergie, la garde, l’intégrité et les colis ne sont pas réinitialisés entre les vagues.','Un tir bas non intercepté retire 7 d’intégrité au dépôt. Une charge qui atteint x<220 retire 18, une seule fois par charge. La première cargaison peut être livrée pendant la seconde vague.']
};
const rules=[
  'Une nouvelle rencontre Boss Battle ou un début de chapitre de campagne commence à 120 PV, énergie chirale 100 et garde 100. Boss Rush conserve ses PV de série ; une reprise conserve les ressources prévues par son mode. Simulation fixe à 60 pas par seconde ; aucune valeur du duel n’est reprise par ce catalogue.',
  'L’énergie récupère 0,19 par pas actif. La garde récupère 0,12 si la commande Garde est tenue, sinon 0,55 ; plafonds 100. L’introduction et la pause ne font pas avancer ces recharges.',
  'Une garde au sol exige aucune action ni étourdissement. L’impact doit arriver de face, avec une tolérance de 24 unités derrière le joueur. Les tirs bas exigent Bas + Garde.',
  'La garde ordinaire retire 2 PV et 18 de garde par impact, puis donne 14 pas d’invulnérabilité. Le grattage peut tuer. À garde nulle : 45 pas d’étourdissement.',
  'Un bouclier de contre prêt absorbe aussi les attaques non gardables et les tirs bas s’ils arrivent de face. Il coûte 6 de garde, ne gratte aucun PV, rend 14 pas invulnérable, riposte de base 24 et se consomme au premier impact.',
  'Un coup non bloqué applique les dégâts arrondis selon la difficulté, interrompt l’action, étourdit 22 pas, rend invulnérable 38 pas et repousse de 34 unités. Porter un colis coûte alors 12 d’intégrité.',
  'Dégâts sur le Boss = max(1, arrondi(base × puissance du combattant × facteur de cible)). Le facteur est 1,35 pendant une récupération ou une exposition au scan ; sinon 0,72 pour les camions, 0,65 pour la baleine, 1 pour les autres. Le bonus remplace le blindage, il ne se multiplie pas avec lui.',
  'À 85 de déséquilibre cumulé, le Boss entre en récupération forcée de 90 pas. Les attaques en récupération ne rechargent pas cette fenêtre. Les orbes et tirs déjà émis subsistent ; les autres dangers sont supprimés par cette rupture. La sortie de récupération avance le cycle même si le motif interrompu n’avait pas encore été émis.',
  'À 50 % des PV maximum ou moins après une touche non mortelle, la phase 2 est activée. Les futures annonces sont plus courtes ; les anneaux vont plus vite et certains motifs gagnent des zones ou projectiles. Le motif en cours n’est pas automatiquement annulé.',
  'Une action exécute son effet une seule fois au pas indiqué, puis se termine à sa durée totale. Il n’y a pas d’annulation offensive ni de file d’entrée différée : les pressions non acceptées sont perdues. Les projectiles émis ont une durée indépendante.',
  'Les actions et les spéciales sont autorisées en l’air ; il n’existe pas de frappe aérienne distincte. Le saut peut aussi commencer pendant une action. Une seule commande offensive par pas est essayée : Colis/Appui, Charge chirale, Signature, Lourd, Léger.',
  'La marche reste possible pendant l’action (×0,75), la garde (×0,38), l’accroupissement (×0,5 si aucune garde) et le portage (×0,76). Les facteurs applicables se multiplient. Saut : vitesse 13,5, gravité 0,65 par pas ; aucun pas rapide du duel.',
  'Le volume du joueur contre les dangers mesure 34 unités de large, 170 de haut debout et 105 accroupi, indépendamment de la hauteur visuelle du kit.',
  'Un projectile ami réussi ajoute 16 de déséquilibre. Une mêlée teste le centre du joueur contre le rayon du Boss plus sa portée, avec une tolérance de 25 unités derrière. Un projectile avance avant son contact et peut toucher au dernier pas de sa durée ; les collisions utilisent les volumes du moteur, indépendamment du chargement des images.',
  'Après l’introduction de 75 pas, le temps diminue pendant le combat, la collecte et l’intervalle entre vagues. Au dernier pas, actions du joueur, Boss puis projectiles sont résolus avant l’échec par le temps : une victoire obtenue avant ce contrôle reste une victoire.'
];
function extract(){
  const env=inspectEngine(),a=env.audit,raw=clone({encounters:a.encounters,players:a.players,directions:a.directions,costs:a.costs});
  const initial=a.makeState({p1:'sam',boss:'lion'}),ids=Object.keys(raw.encounters);
  const patterns={};
  for(const [id,d] of Object.entries(raw.encounters))for(const kind of d.patterns){
    if(patterns[kind])continue;
    const phases={};let title,advice;
    for(const tier of [1,2]){
      const s=a.makeState({p1:'sam',boss:id,difficulty:'normal'});s.phase='active';s.p.x=640;s.boss.x=940;s.boss.tier=tier;s.boss.cycle=d.patterns.indexOf(kind);
      a.prepareAttack(s);title=s.boss.attack.name;advice=s.boss.attack.advice;
      const attack=clone(s.boss.attack);a.launchAttack(s);
      phases[tier]={active:attack.active,markers:attack.markers.map(m=>({width:m.w,height:m.h,offsetFromTarget:m.x-attack.target})),
        hazards:s.hazards.map(h=>({kind:h.kind,baseDamage:h.damage,width:h.w,height:h.h,speed:Math.abs(h.vx),ttl:h.ttl,delay:h.delay,blockable:h.blockable,low:h.low,heightAboveFloor:a.FLOOR-h.y}))};
    }
    patterns[kind]={id:kind,title,advice,...patternNotes[kind],damageByDifficulty:Object.fromEntries(Object.keys(difficulties).map(d=>[d,Math.round(patternNotes[kind].damage*({easy:.7,normal:1,hard:1.25}[d]))])),phases,sources:['boss.js:prepareAttack','boss.js:launchAttack','boss.js:bossTick','boss.js:projectilesTick']};
  }
  const encounters=Object.entries(raw.encounters).map(([id,d])=>{
    const hp={},tell={};for(const difficulty of Object.keys(difficulties)){
      hp[difficulty]=Array.from({length:d.waves||1},(_,i)=>a.newBoss(d,difficulty,i+1).maxHp);
      tell[difficulty]=[1,2].map(tier=>{const s=a.makeState({p1:'sam',boss:id,difficulty});s.boss.tier=tier;a.prepareAttack(s);return s.boss.timer;});
    }
    return {id,name:d.name,type:d.type,stage:d.stage,stageName:env.content.stages[d.stage],seconds:d.seconds,baseHp:d.hp,hp,tell,
      patterns:d.patterns,normalRecovery:d.recover,forcedRecovery:90,phase2AtRatio:.5,initialApproach:55,followingApproach:id==='whale'?35:[42,28],dive:id==='whale'?55:0,
      armour:d.type==='mule-truck'?.72:d.type==='whale'?.65:1,exposedMultiplier:1.35,
      body:{radius:d.radius,height:d.bodyHeight,poseHeights:d.bodyHeights||{},physicalRadius:d.radius*.55,physicalBelow:125},
      waves:d.waves||1,cargo:d.cargo||0,goal:d.goal,
      success:d.cargo?'Boss de la dernière vague à 0 PV et les deux colis livrés au dépôt.':'Boss à 0 PV.',
      failures:d.cargo?['PV du joueur à 0','Temps écoulé','Intégrité de cargaison à 0']:['PV du joueur à 0','Temps écoulé'],
      notes:encounterNotes[id],sources:['boss.js:encounters','boss.js:newBoss','boss.js:damageBoss','boss.js:bossTick','boss.js:defeatBoss','boss.js:interact','boss.js:step']};
  });
  const commons={light:['Léger','Léger'],heavy:['Lourd','Lourd'],sweep:['Balayage','Bas + Léger'],lift:['Montant','Bas + Lourd'],grab:['Frappe d’appui / Colis','Colis / Appui'],finish:['Charge chirale','Charge chirale']};
  const keys=[...Object.keys(commons),...Object.values(raw.directions).flat()];
  const actions=keys.map(key=>{
    const p=prepareAction(a,key),direction=p.owner==='common'?-1:raw.directions[p.owner].indexOf(key);
    const effects=clone(a.probePerform(p.s,p.act));
    const variants=[];
    const variant=({beacon:'return',memory:'release',deck:'anchor',heavy:'crate',lift:'crate'})[key];
    if(variant){const v=prepareAction(a,key,variant);variants.push({id:variant,effects:clone(a.probePerform(v.s,v.act))});}
    return {id:'BOSS_MOVE:'+p.owner+':'+key,engineAction:key,owner:p.owner,
      name:p.owner==='common'?commons[key][0]:env.content.fighters[p.owner].techniques[direction][1],
      command:p.owner==='common'?commons[key][1]:['Signature neutre','Avant + Signature','Arrière + Signature'][direction],
      cost:p.cost,timing:{firstEffect:p.act.delay,clearAt:p.act.duration,nextUncancelledStartAt:p.act.duration+1,unit:'pas de simulation à 60 Hz',convention:'Effet unique quand frame atteint delay ; suppression à frame >= duration. Pas de fenêtre active de mêlée persistante.'},
      requiresMarker:({recall:'post',retrieve:'crate',winch:'anchor'})[key]||null,effects,variants,notes:actionNotes[key],
      compatibility:Object.fromEntries(ids.map(id=>[id,key==='grab'&&raw.encounters[id].cargo?'interaction-colis':'action-disponible'])),
      sources:['boss.js:beginAction','boss.js:perform','boss.js:movePlayer','boss.js:melee','boss.js:projectilesTick']};
  });
  const fighters=Object.fromEntries(Object.entries(raw.players).map(([id,p])=>[id,{id,name:env.content.fighters[id].name,call:env.content.fighters[id].call,...p,techniques:raw.directions[id],notes:'Nom repris du kit DS1 / Director’s Cut ; règles ci-dessous extraites uniquement de boss.js.'}]));
  return {schema:1,date:'2026-11-25',engine:'StrandBoss',source:{file:'modes/echos-de-la-greve/boss.js',sha256:hash(env.sources['boss.js']),content_sha256:hash(env.sources['content.js']),campaign_sha256:hash(env.sources['campaign.js']),base:'8d274a015e0edf314a853630031d5eb507354811',method:'Constantes et mesures de fonctions réelles via hook VM en mémoire. Les notes interprétatives sont relues et testées séparément. Aucun nombre issu de StrandFight.'},
    units:{hz:Math.round(1000/a.STEP),width:a.W,height:a.H,floor:a.FLOOR},raw,difficulties,encounters,patterns,actions,fighters,rules,
    player:{health:initial.p.hp,energy:initial.p.energy,guard:initial.p.guardMeter,collision:{halfWidth:17,standingHeight:170,crouchHeight:105},regen:{energy:.19,guardHeld:.12,guardReleased:.55},
      damageScale:{easy:.7,normal:1,hard:1.25},guardRules:{chip:2,cost:18,invulnerability:14,breakStun:45,facingTolerance:24},
      counter:{chip:0,cost:6,invulnerability:14,riposteBase:24,riposteStagger:10,consumed:true},hit:{stun:22,invulnerability:38,push:34,cargoDamage:12}},
    projectileRules:{staggerPerHit:16,advanceBeforeContact:true,contactOnLastTtl:true},
    cargo:{initialIntegrity:100,pickupDistanceExclusive:75,pickupHeightExclusive:20,depotXInclusive:155,depotHeightExclusive:8,walkMultiplier:.76,waveDelay:180,convoyLowBoltDamage:7,convoyChargeDamage:18},
    modes:{boss:{title:'Boss Battle',storage:a.STORE,rules:a.RULES,notes:['Une rencontre et une difficulté choisies ; départ neuf à 120 PV, énergie et garde 100.','Checkpoint propre avec l’état de simulation ; sauvegarde périodique tous les 180 ticks, aux pauses et aux sorties. Une reprise restaure les ressources sauvegardées et libère les commandes.','Les records sont séparés par combattant, rencontre et difficulté. Les images et le décor statique n’altèrent pas les valeurs de combat.']},
      bossrush:{title:'Boss Rush',storage:a.RUSH_STORE,rules:a.RUSH_RULES,order:clone(a.RUSH_ORDER),heal:20,healthCap:120,notes:['Six rencontres dans l’ordre indiqué, avec leur arène par défaut. Combattant, tenue et difficulté sont fixes pour la série.','Les PV exacts restants sont conservés ; chaque victoire ajoute 20, avec un plafond de 120. Énergie et garde repartent à 100 à la rencontre suivante.','La première défaite termine la série. Une série perdue ne reprend pas au Boss suivant ; un nouveau départ recommence au Catcher léonin.','Checkpoint et records de série indépendants de Boss Battle. Une reprise active conserve la rencontre et ses ressources ; aucune liste de replay Boss n’est produite par ce moteur.']},
      campaign:{title:env.campaign.title,storage:env.campaign.storeKey,rules:env.campaign.rules,chapters:env.campaign.chapters.filter(c=>c.kind==='boss').map(c=>({id:c.id,title:c.title,p1:c.p1,boss:c.boss,stage:c.stage})),notes:['Le chapitre 5 utilise Die-Hardman / Convoi à la ferme ; le chapitre 6 utilise Sam / Baleine sur la Grève. Les règles de rencontre et la difficulté restent celles de boss.js.','La campagne appelle isolated:true. Aucun record ni checkpoint de Boss Battle ou de Boss Rush n’est lu ou écrit par ces rencontres.','La sauvegarde propre à la campagne reprend au début du chapitre. Les ressources reviennent à 120 / 100 / 100 à ce nouveau départ ; aucun soin de Boss Rush ni cumul de vitalité entre chapitres.','Les scènes relèvent de la fiction du simulateur ; elles ne réécrivent ni les événements officiels ni La Ligne silencieuse.']}},
    limits:['Les valeurs décrivent le moteur actuel du simulateur, pas des statistiques canoniques de Death Stranding.','Les variantes d’action sont mesurées sur des états préparés, à x=400, face à droite, repère éventuel x=486 et Boss x=900. Les limites de piste et une cible mobile peuvent modifier les contacts.','La compatibilité signifie que la commande dispose d’un chemin d’exécution dans les six rencontres. Elle ne garantit ni la touche de chaque projectile, ni un équilibre entre kits, ni une victoire.','Aucun jeu en navigateur, rendu matériel, manette physique ou calibrage humain n’est déduit de l’extraction.']};
}
function effectText(e){
  const values=[];for(const m of e.melee)values.push(`mêlée ${m.baseDamage}, portée ${m.reach}, déséquilibre ${m.stagger}`);
  for(const q of e.shots)values.push(`projectile ${q.baseDamage}, ${q.width}×${q.height}, vitesse ${q.velocity}, durée ${q.ttl}, délai ${q.delay}`);
  if(e.shield)values.push(`contre ${e.shield} pas`);if(e.invulnerability)values.push(`invulnérabilité ${e.invulnerability} pas`);
  if(e.displacement)values.push(`déplacement ${e.displacement}`);if(e.exposure)values.push(`exposition ${e.exposure} pas`);
  if(e.markerAfter)values.push(`repère ${e.markerAfter.kind}, durée nominale ${e.markerAfter.ttl}`);
  return values.join(' ; ')||'Aucun dégât direct';
}
function documentation(data){
  let out='# Boss et grandes rencontres — règles du moteur actuel\n\n**25 novembre 2026 · StrandBoss · six rencontres, huit motifs et 30 actions propres à ce moteur.**\n\n[Catalogue JSON](data/boss-et-rencontres.json) · [Compendium du jeu](../../modes/echos-de-la-greve/boss-guide.js) · [Moteur](../../modes/echos-de-la-greve/boss.js) · [Extracteur](../../outils/generer_catalogue_boss.cjs) · [Recette ciblée](production/20261125-extension/boss-compendium-verification.json).\n\nLes chiffres sont ceux d’Échos de la Grève, une adaptation du simulateur. Les noms de techniques peuvent être communs au duel, mais leurs effets, délais et ressources sont décrits ici à partir de `boss.js`. Ce catalogue ne crée ni kit, ni équilibrage, ni animation.\n\n## Règles communes et convention de temps\n\n'+data.rules.map(s=>'- '+s).join('\n')+'\n\n**Lecture des délais.** E est le pas de première exécution et D celui où l’action est supprimée, après l’incrément du compteur. Une nouvelle action sans interruption peut commencer au pas D+1. Les durées de bouclier, d’invulnérabilité et de repère sont nominales au moment de la création ; le repère perd déjà un pas à la fin de cette même mise à jour. Un projectile à délai nul avance et teste sa collision le pas où il est émis. Un délai positif est décrémenté avant toute collision. Les phases actives du Boss et la durée de ses dangers sont distinctes.\n\n## Vue des six rencontres\n\n| Rencontre | PV Débutant / Porteur / Vétéran | Temps | Annonce phase 1 / 2, Porteur | Récupération naturelle | Victoire |\n|---|---|---:|---:|---:|---|\n';
  for(const d of data.encounters)out+=`| ${d.name} | ${Object.keys(difficulties).map(k=>d.hp[k].join(' + ')).join(' / ')} | ${d.seconds} s | ${d.tell.normal.join(' / ')} pas | ${d.normalRecovery} pas | ${d.success} |\n`;
  for(const d of data.encounters){
    out+=`\n## ${d.name} · ${d.id}\n\n${d.goal}\n\nArène par défaut : **${d.stageName}** (${d.stage}). ${d.waves} vague${d.waves>1?'s':''} ; ${d.cargo} colis à livrer. Multiplicateur normal de cible : ×${d.armour} ; exposition : ×${d.exposedMultiplier}.\n\n| Difficulté | PV par vague | Annonce phase 1 | Annonce phase 2 |\n|---|---|---:|---:|\n`;
    for(const k of Object.keys(difficulties))out+=`| ${difficulties[k]} | ${d.hp[k].join(' puis ')} | ${d.tell[k][0]} pas | ${d.tell[k][1]} pas |\n`;
    out+=`\n**Cycle.** ${d.patterns.map(k=>data.patterns[k].title).join(' → ')} → répétition. Première approche : ${d.initialApproach} pas après l’introduction. Récupération naturelle : ${d.normalRecovery} pas ; rupture : ${d.forcedRecovery} pas. ${d.dive?'Après récupération : immersion '+d.dive+' pas, puis approche '+d.followingApproach+' pas.':'Approches suivantes : '+d.followingApproach.join(' / ')+' pas en phases 1 / 2.'}\n\n**Succès :** ${d.success} **Échec :** ${d.failures.join(' ; ')}.\n\n`+d.notes.map(s=>'- '+s).join('\n')+'\n';
    for(const id of [...new Set(d.patterns)]){const p=data.patterns[id];out+=`\n**${p.title}.** ${p.response} ${p.details} Phase d’attaque : ${p.phases[1].active} pas. Dégâts non bloqués Débutant / Porteur / Vétéran : ${Object.values(p.damageByDifficulty).join(' / ')} PV, avant plafonnement aux PV restants.\n`;}
    out+=`\n**Volume de cible.** Rayon horizontal ${d.body.radius} ; hauteur ${d.body.height}${d.body.poseHeights.attack?', '+d.body.poseHeights.attack+' dans la pose d’annonce/attaque':''}. Séparation physique sous 125 unités de hauteur : rayon ×0,55, soit ${Number(d.body.physicalRadius.toFixed(2))}. Ce volume peut différer du contour du sprite.\n`;
  }
  out+='\n## Camions, colis et dépôt\n\nLa commande **Colis / Appui** est prioritaire sur les autres commandes offensives du même pas. Dans Camion et Convoi, elle ne produit pas la frappe d’appui. Elle exige toutefois de ne pas être déjà en action, en garde ou étourdi. Pour prendre : colis au sol à moins de 75 unités et pieds à moins de 20 unités du sol. Pour livrer : porter un colis, x ≤155 et hauteur des pieds <8. Sinon la commande pose le colis à la position du joueur. Un seul colis est porté à la fois ; le portage multiplie la vitesse par 0,76.\n\nL’intégrité commune démarre à 100. Un coup non bloqué pendant le portage lui retire 12 ; le contre et la garde n’infligent pas cette pénalité. Les tirs bas (7) et charges profondes (18) menacent directement le dépôt uniquement dans le Convoi. Une intégrité nulle termine immédiatement la rencontre. Si le même coup détruit la cargaison et vide les PV du porteur, le premier arrêt est l’échec de cargaison.\n\nLe chronomètre ne s’arrête ni pendant la collecte ni entre les vagues. Les deux colis doivent être livrés, le dernier camion détruit et la dernière vague atteinte. La dernière livraison peut donc gagner au dernier pas avant le contrôle du temps.\n\n## Trente actions du moteur Boss\n\nLes dégâts ci-dessous sont des **bases** : appliquer la puissance du kit puis le blindage ou l’exposition. Les projectiles ne sont pas des touches garanties. La portée de mêlée s’ajoute au rayon de la cible. Les déplacements décrivent une exécution loin des bords ; ils sont limités à la piste.\n';
  const actionsTable=list=>'\n| Action / commande | Coût | E / D / prochaine action | Effets mesurés de base |\n|---|---:|---:|---|\n'+list.map(x=>`| ${x.name} · ${x.command} | ${x.cost} | ${x.timing.firstEffect} / ${x.timing.clearAt} / ${x.timing.nextUncancelledStartAt} | ${effectText(x.effects)} |`).join('\n')+'\n';
  out+='\n### Actions communes\n'+actionsTable(data.actions.filter(x=>x.owner==='common'));
  for(const x of data.actions.filter(x=>x.owner==='common'))out+=`\n**${x.id}.** ${x.notes.join(' ')}${x.variants.length?' Variante caisse personnelle de MULE : '+effectText(x.variants[0].effects)+'.':''}\n`;
  for(const [id,f] of Object.entries(data.fighters)){
    const list=data.actions.filter(x=>x.owner===id);
    out+=`\n### ${f.name}\n\nPuissance ×${f.power}, vitesse de base ${f.speed} par pas, hauteur visuelle du kit ${f.h}.\n`+actionsTable(list);
    for(const x of list){out+=`\n**${x.id}.** ${x.notes.join(' ')}\n`;for(const v of x.variants)out+=`\nVariante ${v.id} : ${effectText(v.effects)}.\n`;}
  }
  out+='\n### Compatibilité et limites de contact\n\nLes huit kits peuvent démarrer les six rencontres. Les 24 signatures ont un chemin d’exécution dans chacune ; les techniques de rappel exigent leur repère. Les quatre attaques normales et la charge restent disponibles. Appui devient l’interaction Colis sur les deux rencontres de camions. Les Boss ne possèdent pas de garde ordinaire ni de résistance propre à un combattant : les différences de dégâts proviennent de la puissance, du blindage, de l’exposition et des volumes de collision. La Baleine est invulnérable pendant son immersion.\n\nLa recette vérifie les démarrages, effets et contacts préparés, y compris les 48 couples kit/rencontre et les variantes de repère, dans un périmètre explicite. Elle ne certifie ni la touche de chaque projectile en mouvement, ni l’équilibre, ni les meilleures stratégies de chaque confrontation.\n\n## Boss Battle, série et campagne\n';
  for(const m of Object.values(data.modes)){out+=`\n### ${m.title}\n\nClé propre : \`${m.storage}\`. Règles : \`${m.rules}\`.\n\n`+m.notes.map(s=>'- '+s).join('\n')+'\n';if(m.order)out+='\nOrdre : '+m.order.map(id=>data.encounters.find(d=>d.id===id).name).join(' → ')+'.\n';}
  out+='\n## Provenance, reproduction et portée\n\nSource principale SHA-256 : `'+data.source.sha256+'`. L’extracteur ne modifie jamais le moteur ; il ajoute un accès de lecture dans une copie en mémoire. Les noms viennent du contenu du projet, les valeurs et effets viennent du moteur Boss. Les notes de condition sont écrites explicitement et confrontées à la recette ciblée.\n\n```sh\nnode outils/generer_catalogue_boss.cjs\nnode modes/echos-de-la-greve/qa/boss-compendium.cjs docs/combat/production/20261125-extension/boss-compendium-verification.json\n```\n\n[Rapport de livraison et limites](production/20261125-extension/BOSS_COMPENDIUM.md). La validation utilise Node, des états unitaires préparés et, pour les sauvegardes, les véritables entrées du moteur avec un hôte simulé. Elle ne constitue pas une séance de jeu en navigateur, un test matériel, une revue de pixels ou une certification d’équilibre.\n';
  return out;
}
function runtime(data){return `/* Read-only Boss reference. Regenerate with outils/generer_catalogue_boss.cjs. */\n(function(host){'use strict';\nconst data=${JSON.stringify(data,null,2)};\nconst own=(object,key)=>typeof key==='string'&&Object.hasOwn(object,key);\nfunction forEncounter(id){return data.encounters.find(e=>e.id===id)||null;}\nfunction forFighter(id){if(!own(data.fighters,id))return null;return {...data.fighters[id],common:data.actions.filter(a=>a.owner==='common'),techniques:data.actions.filter(a=>a.owner===id)};}\nfunction damage(base,bossId,playerId,exposed=false){const boss=forEncounter(bossId),player=own(data.fighters,playerId)?data.fighters[playerId]:null;if(!boss||!player||!Number.isFinite(base)||base<0)return null;return Math.max(1,Math.round(base*(exposed?boss.exposedMultiplier:boss.armour)*player.power));}\nfunction freeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}\nhost.StrandBossData=Object.freeze({...freeze(data),forEncounter,forFighter,damage});\n})(window);\n`;}
function generated(){const data=extract();return {data,files:{'docs/combat/data/boss-et-rencontres.json':JSON.stringify(data,null,2)+'\n','modes/echos-de-la-greve/boss-data.js':runtime(data),'docs/combat/BOSS_ET_RENCONTRES.md':documentation(data)}};}
if(require.main===module){const result=generated();for(const [file,body] of Object.entries(result.files)){fs.mkdirSync(path.dirname(path.join(repo,file)),{recursive:true});fs.writeFileSync(path.join(repo,file),body);}console.log('Boss catalogue generated: '+result.data.encounters.length+' encounters, '+result.data.actions.length+' actions, '+Object.keys(result.data.patterns).length+' patterns. Source '+result.data.source.sha256);}
module.exports={extract,generated,effectText};
