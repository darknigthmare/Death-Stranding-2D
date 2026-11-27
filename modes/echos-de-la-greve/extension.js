(function(host){
  'use strict';
  const data=host.StrandOriginalExtension,assets=host.StrandExtensionAssets||{items:{}};
  const doc=host.document;
  const labels={characters:'Personnages',stages:'Stages',enemies:'Ennemis',bosses:'Boss',props:'Accessoires',gadgets:'Équipements',vehicles:'Véhicules',projectiles:'Projectiles',missions:'Missions',bonusChallenges:'Bonus',duos:'Duos'};
  const groups=Object.keys(labels);
  const fieldNames={summary:'Présentation',role:'Rôle',identity:'Identité',visuals:'Direction visuelle',gameplay:'Gameplay prévu',loreConstraints:'Cohérence avec l’univers',campaign:'Campagne personnelle',moveset:'Techniques',moves:'Techniques',specials:'Techniques spéciales',assist:'Assistance',teamSuper:'Super en duo',duo:'Duo',finisher:'Rupture de lien',conclusion:'Conclusion',costumes:'Costumes',taunt:'Geste',selection:'Présentation de sélection',deselection:'Retour de sélection',intro:'Introduction',outro:'Épilogue',ending:'Épilogue',rival:'Rival',rivals:'Rivaux',chapters:'Chapitres',phases:'Phases',phase:'Phase',attacks:'Attaques',attack:'Attaque',tell:'Signal préalable',telegraph:'Signal préalable',counter:'Contre',counterplay:'Réponse du joueur',counterplayWindow:'Fenêtre de réponse',arena:'Arène',arenaRules:'Règles de l’arène',connections:'Liaisons',links:'Liaisons',stageIds:'Lieux associés',stageId:'Lieu associé',bossIds:'Boss associés',enemyIds:'Ennemis associés',characterIds:'Personnages associés',objective:'Objectif',objectives:'Objectifs',rewards:'Récompenses',unlock:'Déblocage',unlockRule:'Condition de déblocage',reward:'Récompense',palette:'Palette',silhouette:'Silhouette',materials:'Matériaux',equipment:'Équipement',animation:'Animation',animations:'Animations à produire',detachableParts:'Pièces séparées',projectileIds:'Projectiles associés',hazard:'Danger de campagne',hazards:'Dangers de campagne',safeLane:'Piste de combat',weather:'Météo',layers:'Plans de décor',parallax:'Plans de parallaxe prévus',camera:'Caméra',scale:'Échelle',faction:'Affiliation',name:'Nom',age:'Âge',pronouns:'Pronoms',description:'Description',archetype:'Style',range:'Portée',cost:'Coût',damage:'Dégâts',startup:'Démarrage',active:'Activité',recovery:'Récupération',startupFrames:'Démarrage (pas)',activeFrames:'Activité (pas)',recoveryFrames:'Récupération (pas)',duration:'Durée',effect:'Effet',input:'Commande',limitation:'Limite',limits:'Limites',failure:'Échec',failureCondition:'Condition d’échec',success:'Réussite',winCondition:'Victoire',loseCondition:'Défaite',health:'Vie',hp:'Vie',speed:'Vitesse',weakness:'Faiblesse',position:'Position',narrative:'Récit',route:'Parcours',states:'États',rules:'Règles',chapterId:'Secteur',animationPlan:'Animations prévues',sound:'Son',sfx:'Effets sonores',vfx:'Effets visuels',rescue:'Secours',nonLethal:'Issue non létale'};
  function el(tag,cls,text){const n=doc.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
  if(!data){doc.getElementById('cards').append(el('p','no-data','Le catalogue est indisponible. Recharge la page après avoir vérifié les fichiers de l’extension.'));return;}
  const entries=groups.flatMap(category=>(data[category]||[]).map(item=>({...item,category})));
  const byId=new Map(entries.map(item=>[item.id,item]));
  const loreById=new Map((data.loreRules||[]).map(rule=>[rule.id,rule]));
  const sources=Array.isArray(data.sources)?data.sources:Object.entries(data.sources||{}).map(([id,s])=>({id,...s}));
  const state={category:'characters',query:'',withImage:false};
  let opener=null;
  const dialog=doc.getElementById('dossier');
  function received(item){return assets.items?.[item.id];}
  function playable(item){const image=received(item);return item.category==='stages'&&image&&Number.isFinite(image.floorY);}
  function badgeText(item){return playable(item)?'Arène statique jouable':'Gameplay prévu dans la bible';}
  function badges(item){const n=el('div','badges');n.append(el('span','badge',received(item)?(item.category==='stages'?'Panorama reçu':'Base visuelle reçue'):'Visuel à produire'),el('span','badge'+(playable(item)?' playable':''),badgeText(item)));return n;}
  function art(item){const image=received(item);if(!image)return el('span','pending','Visuel à produire');const n=el('img');n.src=image.src;n.alt=item.name+' · création originale';n.loading='lazy';n.width=image.width;n.height=image.height;return n;}
  function textValue(value){if(typeof value==='string'&&byId.has(value)){const button=el('button','relation',byId.get(value).name);button.type='button';button.addEventListener('click',()=>open(byId.get(value)));return button;}if(typeof value==='string'&&loreById.has(value)){const rule=loreById.get(value);return el('span','',rule.rule||rule.text||rule.description||rule.summary||value);}return el('span','',String(value));}
  Object.assign(fieldNames,{accessibility:'Accessibilité',aiStates:'Comportement prévu',alias:'Nom de terrain',arenaContract:'Lisibilité de la rencontre',asymmetryRule:'Continuité des accessoires',baseWidthBodies:'Largeur en silhouettes',batteryRequired:'Batterie nécessaire',bidirectional:'Passage dans les deux sens',biome:'Milieu',bonus:'Bonus',bossId:'Boss associé',btOutcome:'Issue contre un Échoué',canAttackOffscreen:'Attaque hors champ',canonIsolation:'Place dans la fiction du projet',chapter:'Chapitre',characterId:'Personnage',checkpoint:'Point de reprise',collision:'Contact',combatArsenal:'Équipement de combat',competitiveProfile:'Profil de duel',condition:'Condition',conditions:'Conditions',costChiral:'Coût de Chiral',costCohesion:'Coût de Cohésion',damageCap:'Plafond de dégâts',defeatOutcome:'Issue de la rencontre',deselected:'Retour après désélection',destructible:'Destructible',diegeticMeaning:'Sens dans le récit',drops:'Restitution et ressources',encounterTitle:'Nom de la rencontre',entryFrames:'Entrée (pas)',exitFrames:'Sortie (pas)',finalBossId:'Rencontre finale',floor:'Sol praticable',goal:'But personnel',groupBudget:'Attaques simultanées',healthSemantic:'Sens de la jauge',holdFrames:'Tenue (pas)',humanOutcome:'Issue contre un humain',index:'Phase',lifetimeFrames:'Durée de présence (pas)',limit:'Limite',max:'Maximum',maxInstancesPerOwner:'Présences par émetteur',modes:'Modes visés',normals:'Coups de base',objectivePriority:'Priorité des objectifs',occlusion:'Masquage de la piste',onBlock:'Sur garde',optional:'Facultatif',ownerCharacterId:'Personnage équipé',ownership:'Propriété',paid:'Accès payant',panoramaIsParallax:'Panorama avec plans séparés',presentation:'Gestes et sélection',projectileId:'Élément émis',reason:'Motif',requires:'Condition de passage',requiresRuntimeReady:'Nécessite un kit livré',resource:'Ressource',rule:'Règle',ruleset:'Cadre de conception',selected:'Confirmation du choix',sequence:'Déroulement',slot:'Plan',storyHazard:'Danger de mission',storyObjective:'Objectif de mission',super:'Technique majeure',symmetricalBounds:'Limites symétriques',teamConclusion:'Conclusion en duo',telegraphFrames:'Annonce (pas)',terrainAffectsStats:'Effet du terrain sur les capacités',threshold:'Seuil de phase',title:'Titre',transition:'Passage',unlocks:'Accès ouverts',victory:'Condition de victoire',vulnerable:'Vulnérable',walkMultiplier:'Vitesse relative'});
  const hiddenKeys=new Set(['id','sources','production','assetStatus','playable','canonStatus','sourceIds','kind','assetPlan','artBrief','illustrationIds','checkpointFields','assetRequirements','existingRosterUnaffected']);
  function pretty(key){return fieldNames[key]||key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase());}
  function rich(value,depth=0){
    if(value===null||value===undefined)return doc.createTextNode('');
    if(typeof value!=='object')return textValue(value===true?'Oui':value===false?'Non':value);
    if(depth>7)return el('p','','Détail disponible dans la bible complète.');
    if(Array.isArray(value)){const ul=el('ul',value.some(v=>v&&typeof v==='object')?'field-list':'');value.forEach(v=>{const li=el('li');li.append(rich(v,depth+1));ul.append(li);});return ul;}
    const dl=el('dl');for(const[key,v]of Object.entries(value)){if(hiddenKeys.has(key)||v===null||v===undefined)continue;dl.append(el('dt','',pretty(key)));const dd=el('dd');dd.append(rich(v,depth+1));dl.append(dd);}return dl;
  }
  function open(item,trigger){
    if(trigger)opener=trigger;
    doc.getElementById('dossier-category').textContent=labels[item.category];
    doc.getElementById('dossier-title').textContent=item.name;
    doc.getElementById('dossier-summary').textContent=item.summary||'';
    const panel=doc.getElementById('dossier-art');panel.classList.toggle('landscape',item.category==='stages');panel.replaceChildren(art(item));
    doc.getElementById('dossier-status').replaceChildren(...badges(item).childNodes);
    const actions=doc.getElementById('dossier-actions');actions.replaceChildren();
    const image=received(item);if(image){const a=el('a','','Image originale ↓');a.href=image.src;a.download=image.src.split('/').pop();actions.append(a);}
    if(playable(item)){const a=el('a','button','Essayer cette arène ↗');a.href='index.html?ldmStage='+encodeURIComponent(item.id);actions.prepend(a);}
    const details=doc.getElementById('dossier-detail');details.replaceChildren();
    for(const[key,value]of Object.entries(item)){if(['id','name','summary','category',...hiddenKeys].includes(key)||value==null)continue;const section=el('details');if(['gameplay','visuals'].includes(key))section.open=true;section.append(el('summary','',pretty(key)),rich(value));details.append(section);}
    const note=el('p','','Création originale du projet. Une base visuelle ne constitue pas une animation complète ni un nouveau combattant jouable.');details.append(note);
    if(!dialog.open)dialog.showModal();
    dialog.scrollTop=0;
    const hash='#'+encodeURIComponent(item.id);if(host.location.hash!==hash)host.history.replaceState(null,'',hash);
  }
  function refresh(){
    const q=state.query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr');
    const shown=entries.filter(item=>(state.category==='all'||state.category===item.category)&&(!state.withImage||received(item))&&(!q||JSON.stringify(item).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('fr').includes(q)));
    const grid=doc.getElementById('cards');grid.replaceChildren();
    for(const item of shown){const card=el('article','card'+(item.category==='stages'?' wide':'')),button=el('button','card-button');button.type='button';button.setAttribute('aria-label','Ouvrir le dossier : '+item.name);button.dataset.entityId=item.id;const visual=el('div','visual');visual.append(art(item));const copy=el('div','card-copy');copy.append(el('span','card-id',labels[item.category]),el('h3','',item.name),el('p','summary',item.summary||''),badges(item));button.append(visual,copy);button.addEventListener('click',()=>open(item,button));card.append(button);grid.append(card);}
    doc.getElementById('result-count').textContent=shown.length+' fiche'+(shown.length===1?'':'s')+' · '+shown.filter(received).length+' avec un visuel';
    doc.getElementById('empty').hidden=shown.length!==0;
    doc.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
  }
  const filter=doc.getElementById('filters');
  for(const[key,title]of Object.entries({all:'Tout',...labels})){if(key!=='all'&&!(data[key]||[]).length)continue;const b=el('button','',title);b.type='button';b.dataset.category=key;b.setAttribute('aria-pressed',String(key===state.category));b.addEventListener('click',()=>{state.category=key;refresh();});filter.append(b);}
  doc.getElementById('search').addEventListener('input',e=>{state.query=e.target.value;refresh();});
  doc.getElementById('with-image').addEventListener('change',e=>{state.withImage=e.target.checked;refresh();});
  doc.getElementById('reset').addEventListener('click',()=>{state.category='characters';state.query='';state.withImage=false;doc.getElementById('search').value='';doc.getElementById('with-image').checked=false;refresh();});
  doc.getElementById('close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus();host.history.replaceState(null,'',host.location.pathname+host.location.search);});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  const metrics=doc.getElementById('metrics');for(const category of ['characters','stages','enemies','bosses']){const n=el('div','metric');n.append(el('strong','',String((data[category]||[]).length)),el('span','',labels[category]+' conçus'));metrics.append(n);}const visualCount=entries.filter(received).length;const n=el('div','metric');n.append(el('strong','',String(visualCount)),el('span','','Bases visuelles reçues'));metrics.append(n);
  if(typeof data.premise==='string')doc.getElementById('premise').textContent=data.premise;
  for(const[ci,chapter]of(data.chapters||[]).entries()){const card=el('article','chapter');card.append(el('p','eyebrow','SECTEUR '+String(ci+1).padStart(2,'0')),el('h3','',chapter.name||chapter.title||''),el('p','',chapter.summary||chapter.objective||chapter.theme||''));const list=el('ul');for(const id of chapter.stageIds||[]){const stage=byId.get(id);if(!stage)continue;const li=el('li');li.append(textValue(id));list.append(li);}card.append(list);doc.getElementById('chapters').append(card);}
  for(const source of sources){if(typeof source.url!=='string'||!/^https:\/\//.test(source.url))continue;const li=el('li'),a=el('a','',source.title||source.name||source.url);a.href=source.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a);doc.getElementById('sources').append(li);}
  refresh();let id;try{id=decodeURIComponent(host.location.hash.slice(1));}catch{}if(byId.has(id))open(byId.get(id));
  host.StrandExtensionUI=Object.freeze({counts:Object.freeze(Object.fromEntries(groups.map(k=>[k,(data[k]||[]).length])))});
})(window);
