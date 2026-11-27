(() => {
  'use strict';
  const {fighters, stages} = window.StrandContent;
  const modes = {...window.StrandContent.modes,boss:'Boss Battle',bossrush:'Boss Rush',campaign:'Campagne du simulateur'};
  const tournament = window.StrandTournament;
  const asset = window.StrandAssets || {};
  const engine = window.StrandFight;
  const bossEngine = window.StrandBoss;
  const input = window.StrandInput;
  const inputSettings = input.createSettings();
  let inputController=null,inputEditor=null,manualReturnFocus=null,pendingDuel=null;
  let presentationController=null,previousPresentation=[];
  const campaignContent = window.StrandCampaign;
  const campaign = campaignContent?.createStore();
  const lessonContent = window.StrandLessons;
  const lessonStore = lessonContent?.createStore();
  let lessonRun = null, lessonFighter = lessonStore?.progress().resume.fighter || 'sam';
  const view = document.getElementById('view');
  const manual = document.getElementById('manual');
  const localIds = Object.keys(fighters);
  const originalIds = window.StrandOriginalKits?.originalCharacterIds || [];
  const ids = localIds.filter(id => !originalIds.includes(id));
  const selectableIds = () => ['versus','training'].includes(config.mode) ? localIds : ids;
  const originalBossId = 'ldm-boss-consignateur';
  const isOriginalBoss = id => id === originalBossId && !!bossEngine?.encounters?.[id];
  const scenes = {intro:'Introduction', rival:'Rivalité', ending:'Épilogue'};
  const icon = {
    arcade:'<path d="M4 17h16v4H4zM9 16l3-8"/><circle cx="13" cy="5" r="2.5"/>',
    versus:'<path d="M3 5l13 13m-2-1 4 3 2-2-3-4M21 5l-5 5m-8 4-4 4 2 2 4-4"/>',
    tournament:'<path d="M3 4h5v5H3m0 6h5v5H3M8 7h4v11H8m4-6h7"/>',
    challenges:'<path d="M6 4h12v4a6 6 0 0 1-12 0zm6 10v5m-4 2h8M6 6H3v2a4 4 0 0 0 4 4m11-6h3v2a4 4 0 0 1-4 4"/>',
    training:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
    boss:'<path d="M4 20V9l4-5 4 4 4-4 4 5v11M7 13h3m4 0h3M9 18h6"/>',
    bossrush:'<path d="M3 19V8l4-4 5 4 5-4 4 4v11M7 13h3m4 0h3M8 19h8m-4-3v6"/>',
    campaign:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="18" r="2"/><path d="M7 5l10 1M5 7l1 10m2 2 8-1M8 17l9-9"/>'
  };
  const config = {mode:'story', p1:'sam', p2:'higgs', stage:'shore', difficulty:'normal', opponent:'cpu', outfit1:'atelier', outfit2:'atelier', count:'4', humans:'1', challenge:'survival',boss:'lion',bossStage:'recommended',scenarioSpeed:'1',campaignDifficulty:campaign?.progress().run?.difficulty||'normal'};
  let trial;
  const trialNames = {survival:'Survie', delivery:'Livraison sous pression'};
  let screen = '', activeFight = null, paused = false, resumeAfterManual = false, arcadeStep = 0, scenePlayback = null;
  let training = {dummy:'idle',hitboxes:false};
  function activeEngine() { return activeFight?.kind==='boss' ? bossEngine : engine; }
  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem('echos.v1.' + key)) ?? fallback; }
    catch { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem('echos.v1.' + key, JSON.stringify(value)); return true; } catch { return false; }
  }
  let sound = read('sound',true);
  const savedAmbience=read('ambienceVolume',.35);
  let ambienceVolume=typeof savedAmbience==='number' && Number.isFinite(savedAmbience) ? Math.max(0,Math.min(1,savedAmbience)) : .35;
  const motionPreference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reducedEffects = read('reducedEffects',!!motionPreference?.matches);
  let staticScenery = read('staticScenery',false) === true;
  let cup = read('cup',null);
  if (cup?.version !== 1 || !Array.isArray(cup?.rounds) || !Array.isArray(cup?.entrants)) cup = null;
  const progress = read('chapters',{});
  const archive = read('scenes',{});
  function esc(str) {
    return String(str).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function image(src, alt = '') { return src ? '<img src="' + esc(src) + '" alt="' + esc(alt) + '">' : ''; }
  function backdrop(src) { return src ? ' style="--picture:url(&quot;' + esc(src) + '&quot;)"' : ''; }
  function button(action, label, css = 'primary', attrs = '') {
    return '<button class="' + css + '" data-act="' + action + '" ' + attrs + '>' + label + '</button>';
  }
  function choose(key, title, options) {
    return '<label>' + title + '<select data-option="' + key + '">' + Object.entries(options).map(([value,label]) =>
      '<option value="' + value + '"' + (String(config[key]) === value ? ' selected' : '') + '>' + esc(label) + '</option>').join('') + '</select></label>';
  }
  function ambienceControl() {
    const percent=Math.round(ambienceVolume*100);
    return '<label class="ambienceControl">Ambiance du décor<span><input type="range" min="0" max="100" step="5" value="'+percent+
      '" data-ambience-volume aria-label="Volume de l’ambiance"><output data-ambience-value>'+percent+' %</output></span></label>';
  }
  function changeAmbience(event) {
    if (!event.target.matches?.('[data-ambience-volume]')) return;
    ambienceVolume=Math.max(0,Math.min(1,Number(event.target.value)/100));
    save('ambienceVolume',ambienceVolume);engine?.setAmbienceVolume?.(ambienceVolume);bossEngine?.setAmbienceVolume?.(ambienceVolume);
    const percent=Math.round(ambienceVolume*100);
    document.querySelectorAll('[data-ambience-volume]').forEach(control=>{control.value=String(percent);});
    document.querySelectorAll('[data-ambience-value]').forEach(output=>{output.textContent=percent+' %';});
  }
  const arrow = '<span aria-hidden="true" class="arrow">↗</span>';
  const back = () => button('home','← Accueil','back');
  const presentationPanel=()=>window.StrandPresentation?.markup()||'';
  function presentationSlots(){
    const slots=[{id:config.p1,outfit:config.outfit1,label:'J1'}];
    if(['versus','training'].includes(config.mode)||config.mode==='tournament'&&config.humans==='2')
      slots.push({id:config.p2,outfit:config.outfit2,label:config.mode==='training'?'Mannequin':config.opponent==='cpu'&&config.mode==='versus'?'Adversaire IA':'J2'});
    return slots;
  }
  function setScreen(name, markup) {
    presentationController?.destroy();presentationController=null;
    screen = name;
    document.body.classList.toggle('playing', name === 'fight');
    view.innerHTML = markup;
    if(name==='select'){
      const panel=view.querySelector('[data-presentation]'),slots=presentationSlots();
      if(panel)presentationController=window.StrandPresentation?.mount(panel,{slots,previous:previousPresentation,reduced:reducedEffects});
      previousPresentation=slots;
    }else previousPresentation=[];
    view.querySelectorAll('[data-layered-stage]').forEach(preview => {
      const required = [...preview.querySelectorAll('.stageSky,.stageDistant,.stageFloor')];
      const update = () => preview.classList.toggle('stageReady',
        required.length === 3 && required.every(image => image.complete && image.naturalWidth > 0));
      required.forEach(image => {
        image.addEventListener('load', update);
        image.addEventListener('error', update);
      });
      update();
    });
    view.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
  function releaseControls() {
    inputController?.releaseAll();
    view.querySelectorAll('.held').forEach(button => button.classList.remove('held'));
  }
  function stopFight() {
    releaseControls();
    if (activeFight?.mode==='campaign') campaign?.suspend();
    if (activeFight) activeEngine()?.stop();
    if (activeFight?.kind==='training' && ['record','loop'].includes(training.dummy)) training.dummy='idle';
    lessonRun = null;
    activeFight = null; paused = false;
  }
  function stageRule(stage) {
    const link=window.StrandContent.stageLinks?.[stage];
    return link?'<p class="brief stageRule"><strong>Quai → hangar · liaison du simulateur.</strong> '+esc(link.description)+'</p>':'';
  }
  function home() {
    stopFight();
    const copy = {arcade:'Trois adversaires jusqu’au rival.', versus:'Duel contre l’IA ou à deux en local.', tournament:'Tableau à élimination directe.', training:'Dojo libre et parcours d’exercices dirigés.'};
    copy.challenges='Survie ou livraison sous pression.';
    copy.boss=isOriginalBoss(originalBossId)?'Sept rencontres : Échoués, convois et Consignateur.':'Quatre Échoués géants, camion et convoi MULE.';
    copy.bossrush='Six rencontres, une réserve de vie et une série à terminer.';
    copy.campaign='Les Nœuds rompus · six chapitres et une intrigue commune.';
    const tiles = Object.keys(copy).map(key =>
      '<button class="tile" data-act="mode" data-mode="' + key + '"><span class="symbol"><svg aria-hidden="true" viewBox="0 0 24 24">' + icon[key] + '</svg></span>' +
      '<strong>' + modes[key] + '</strong><small>' + copy[key] + '</small>' + arrow + '</button>').join('');
    setScreen('home','<section class="hero"' + backdrop(asset.hero || asset.story?.['shore-prologue'] || asset.stages?.shore) + '><div><div class="eyebrow">Simulation chirale</div>' +
      '<h1>Échos de<br>la Grève</h1><p>Choisis un combattant et suis son histoire jusqu’au duel avec son rival.</p>' +
      '<div class="actions">' + button('mode','Jouer l’histoire ' + arrow,'darkbtn','data-mode="story"') + '</div></div></section>' +
      '<section class="shelf"><div class="shelfhead"><h2>Modes de combat</h2></div><div class="tiles">' + tiles +
      '<a class="tile" href="teams.html"><span class="symbol" aria-hidden="true">⇄</span><strong>Relais de liaison</strong><small>Deux membres par camp, assistance et relais. Contre l’IA ou à deux en local.</small>'+arrow+'</a>'+
      '<a class="tile" href="extension.html"><span class="symbol" aria-hidden="true">≈</span><strong>Les Lignes de Marée</strong><small>Extension originale : personnages, stages, ennemis et boss. Explore les dossiers d’expédition.</small>'+arrow+'</a>'+
      '</div><div class="archives">' +
      button('stageGallery','Parcourir les arènes','mini') + button('gallery','Galerie des scènes','mini') + button('campaignGallery','Interludes des Nœuds rompus','mini') + '<a class="mini" href="duel-originel/index.html">Duel originel · Sam / Higgs</a><a class="mini" href="netplay.html">Salon privé en réseau</a>' +
      '<a class="mini" href="archives.html">Archives de Bridges</a><a class="mini" href="static-assets.html">Silhouettes et horizons</a><a class="mini" href="progression.html">Dossiers de liaison</a><a class="mini campaignLink" href="../../JOUER.html">Retour à la campagne ↗</a></div></section>');
  }
  function stageFor(id) { return fighters[id]?.route?.[0]?.[1] || (originalIds.includes(id) ? 'ldm-stage-digue-aval' : 'shore'); }
  function stagePreview(id) {
    if (!asset.stages?.[id]) return '';
    const geometry = asset.stageGeometry?.[id] || {};
    const layered = asset.skyplates?.[id] && asset.distants?.[id] && asset.floors?.[id];
    // Use the combat's 1280×720 frame, source proportions and vertical anchors.
    // Keep the full panorama until all three replacement layers have decoded.
    const layer = (src, name, key, defaults) => {
      if (!src) return '';
      const config = geometry[key] || {};
      const base = Number.isFinite(config.base) ? config.base : defaults.base;
      const anchorY = Number.isFinite(config.anchorY) ? Math.max(0,Math.min(1,config.anchorY)) : defaults.anchorY;
      const alpha = Number.isFinite(config.alpha) ? Math.max(0,Math.min(1,config.alpha)) : defaults.alpha;
      return '<img class="stageLayer ' + name + '" src="' + esc(src) + '" alt="" style="left:' + (-defaults.margin/12.8) +
        '%;top:' + (base/7.2) + '%;width:' + ((1280+defaults.margin*2)/12.8) + '%;transform:translateY(' + (-anchorY*100) + '%);opacity:' + alpha + '">';
    };
    return '<figure class="stagePreview"' + (layered ? ' data-layered-stage' : '') + ' role="img" aria-label="Aperçu de ' + esc(stages[id]) + '">' +
      '<img class="stageLayer stageBackdrop stageLegacy" src="' + esc(asset.stages[id]) + '" alt="">' +
      (layered ? '<img class="stageLayer stageBackdrop stageSky stageCandidate" src="' + esc(asset.skyplates[id]) + '" alt="">' +
        layer(asset.distants[id],'stageDistant stageCandidate','distant',{margin:48,base:552,anchorY:.96,alpha:1}) : '') +
      layer(asset.midgrounds?.[id],'stageMiddle','middle',{margin:48,base:576,anchorY:.97,alpha:.92}) +
      (layered ? layer(asset.floors[id],'stageFloor stageCandidate','floor',{margin:80,base:588,anchorY:.3,alpha:1}) : '') +
      '<span class="stageShade"></span>' +
      (asset.foregrounds?.[id] ? '<img class="stageNear" src="' + esc(asset.foregrounds[id]) + '" alt="">' : '') + '</figure>';
  }
  function stageGallery() {
    stopFight();
    const details = window.StrandContent.stageDetails || {};
    const cards = Object.entries(stages).map(([id,title]) => {
      const info = details[id] || {};
      return '<article class="stageCard">' + stagePreview(id) + '<div class="stageCardCopy"><p class="kicker">' + esc(info.place || '') +
        '</p><h2>' + esc(title) + '</h2><p>' + esc(info.ambience || '') + '</p><div class="stageCardFoot"><span>' + esc(info.material || '') +
        '</span>' + button('exploreStage','S’entraîner ici','mini','data-stage="' + id + '"') + '</div></div></article>';
    }).join('');
    setScreen('stages','<section class="shell">' + back() + '<div class="pagehead"><div><div class="eyebrow">Lieux de la simulation</div>' +
      '<h1>Les arènes</h1></div><p>'+Object.keys(stages).length+' configurations d’arène, de la Grève aux installations de Bridges et aux montagnes. Choisis une piste pour y entrer avec ton combattant.</p></div>' +
      '<div class="stageGallery">' + cards + '</div></section>');
  }
  function art(id, part) {
    const scene = asset.story || {};
    const fallback = part === 'rival' ? fighters[id].route[2][1] : stageFor(id);
    return scene[id + '-' + part] ||
      (part === 'rival' && ['sam','higgs'].includes(id) ? scene['sam-higgs-rival'] : null) || asset.stages?.[fallback] || asset.hero;
  }
  function nameMap() { return Object.fromEntries(selectableIds().map(id => [id, fighters[id].name])); }
  function chapter() { const n = progress[config.p1]; return Number.isInteger(n) && n >= 0 && n <= 3 ? n : 0; }
  function outfitField(slot, id) {
    const outfits = asset.wardrobe?.[id];
    if (!outfits || Object.keys(outfits).length < 2) return '';
    if (!Object.hasOwn(outfits, config['outfit' + slot])) config['outfit' + slot] = Object.keys(outfits)[0];
    return choose('outfit' + slot, 'Tenue J' + slot + ' · ' + fighters[id].call,
      Object.fromEntries(Object.entries(outfits).map(([key, outfit]) => [key, outfit.name])));
  }
  function selection() {
    const available=selectableIds();
    if(!available.includes(config.p1))config.p1=available[0];
    if(!available.includes(config.p2))config.p2=available.includes('higgs')?'higgs':available[0];
    if (config.mode==='campaign') { campaignSelection(); return; }
    if (config.mode==='boss') { bossSelection(); return; }
    if (config.mode==='bossrush') { rushSelection(); return; }
    stopFight();
    const {mode,p1} = config;
    const character = fighters[p1];
    const cards = selectableIds().map(id => {
      const f = fighters[id];
      const preview = id === p1 && ['versus','training'].includes(mode) ? asset.wardrobe?.[id]?.[config.outfit1] : null;
      const portrait = preview?.portrait || asset.portraits?.[id], stance = asset.fighters?.[id];
      return '<button class="char ' + (portrait ? 'portrait' : stance ? '' : 'landscape') + '" data-act="pick" data-id="' + id +
        '" aria-pressed="' + (id === p1) + '">' + image(portrait || stance || asset.stages?.[stageFor(id)]) +
        '<span class="charlabel"><strong>' + f.call + '</strong><small>' + f.role + '</small></span></button>';
    }).join('');
    const isSolo = mode !== 'versus' || config.opponent !== 'local';
    let fields = '';
    if (mode === 'challenges') fields += choose('challenge','Épreuve',trialNames);
    if (mode === 'versus') fields += choose('opponent','Adversaire',{cpu:'Intelligence artificielle',local:'Joueur 2 · local'});
    if (mode === 'tournament') {
      fields += choose('count','Participants',{'4':'4 entrants','6':'6 entrants · 2 exemptions','8':'8 entrants'});
      fields += choose('humans','Joueurs locaux',{'1':'1 joueur','2':'2 joueurs'});
    }
    if (['versus','training'].includes(mode) || (mode === 'tournament' && config.humans === '2'))
      fields += choose('p2',mode === 'training' ? 'Mannequin' : 'Combattant adverse / J2',nameMap());
    if (['versus','training'].includes(mode)) {
      fields += outfitField(1, p1) + outfitField(2, config.p2) + choose('stage','Arène',stages);
    }
    if (isSolo) fields += choose('difficulty','Difficulté',{easy:'Débutant',normal:'Porteur',hard:'Vétéran'});
    fields += ambienceControl();
    const route = ['story','arcade'].includes(mode) ? character.route.map(([rival,place]) => fighters[rival].call + ' · ' + stages[place]).join('　→　') : '';
    const startLabel = mode === 'story' && chapter() > 0 && chapter() < 3 ? 'Reprendre le duel ' + (chapter() + 1) :
      ({challenges:'Lancer l’épreuve',story:'Ouvrir l’histoire',arcade:'Lancer le parcours',tournament:cup ? 'Créer un nouveau tableau' : 'Tirer le tableau',versus:'Lancer le duel',training:'Entrer dans l’arène'})[mode];
    setScreen('select','<section class="shell">' + back() + '<div class="pagehead"><div><div class="eyebrow">' + modes[mode] +
      '</div><h1>Choix du combattant</h1></div></div><div class="chars">' + cards + '</div>'+presentationPanel()+'<div class="options">' + fields +
      '</div>' + (['versus','training'].includes(mode) ? stagePreview(config.stage)+stageRule(config.stage) : '') +
      '<div class="brief"><strong>' + character.special + '</strong> · ' + character.tip + '</div>' +
      (['story','arcade'].includes(mode) ? '<p class="montage">' + (mode === 'story' ? '<b>' + character.story + '</b><br>' : '') + route + '</p>' : '') +
      (mode === 'challenges' ? trialBrief() : '') +
      (mode === 'training' && lessonContent ? '<section class="lessonIntro"><h2>Apprendre en pratiquant</h2><p>Les exercices vérifient tes déplacements, tes gardes, tes punitions, tes signatures et le risque d’un geste de défi. Choisis ton combattant, suis les étapes et reprends à ton rythme.</p>'+button('lessons','Parcours dirigé · '+lessonContent.lessons.length+' exercices','secondary')+'</section>' : '') +
      '<div class="actions">' + (mode === 'tournament' && cup ? button('bracket',cup.rounds.at(-1)[0].winner === null ? 'Reprendre le tableau' : 'Revoir le tableau') : '') +
      button('start',startLabel + ' ' + arrow,mode === 'tournament' && cup ? 'secondary' : 'primary') +
      (mode === 'story' && chapter() > 0 && chapter() < 3 ? button('restartStory','Recommencer l’histoire','secondary') : '') + '</div></section>');
  }
  function bossGuide(options) {
    const guide=isOriginalBoss(options.boss)&&window.StrandOriginalBosses?.guide;
    if(!guide)return window.StrandBossGuide?.render(options)||'';
    return '<section class="bossGuide originalBossGuide"><h2>'+esc(guide.title)+'</h2><p>'+esc(guide.summary)+'</p><h3>Actions d’objectif</h3><ul>'+
      (guide.commands||[]).map(command=>'<li><strong>'+esc(command.label)+(command.action==='throw'||command.key==='T'?' · '+keyText(1,'throw'):'')+'</strong> · '+esc(command.detail)+'</li>').join('')+'</ul><h3>Les trois phases</h3><ol>'+
      (guide.phases||[]).map(phase=>'<li><strong>'+esc(phase.objective)+'</strong><p>'+esc(phase.attack)+' · '+esc(phase.counter)+'</p></li>').join('')+
      '</ol><p>'+esc(guide.victory)+'</p><p class="hint">'+esc(guide.checkpoint)+'</p><p class="hint">'+esc(guide.compatibility)+'</p></section>';
  }
  function bossSelection() {
    stopFight();
    if (!bossEngine) { setScreen('error','<section class="shell">'+back()+'<h1>Boss Battle indisponible</h1><p class="hint">Le module de grandes rencontres n’a pas pu être chargé.</p></section>'); return; }
    config.mode='boss';
    if(!ids.includes(config.p1))config.p1=ids[0];
    if(!bossEngine.encounters[config.boss])config.boss='lion';
    const bosses=bossEngine.encounters, selected=bosses[config.boss] || bosses.lion, history=bossEngine.progress();
    const record=history.records[[config.p1,config.boss,config.difficulty].join(':')];
    const cards=Object.entries(bosses).map(([id,b])=>
      '<button class="bossCard" data-act="pickBoss" data-boss="'+id+'" aria-pressed="'+(id===config.boss)+'"'+
      backdrop(isOriginalBoss(id)?window.StrandOriginalBossArt?.sprites?.consignateur?.guard:window.StrandBossAssets?.sprites?.[b.type]?.idle)+'><span class="bossCardNumber">'+String(Object.keys(bosses).indexOf(id)+1).padStart(2,'0')+
      '</span><strong>'+esc(b.name)+'</strong><small>'+(isOriginalBoss(id)?'Péage · 3 phases · issue non létale':b.waves?'2 vagues · fret à protéger':b.cargo?'Interception · 2 colis':'Échoué géant · 2 phases')+'</small></button>').join('');
    const fighterCards=ids.map(id=>'<button class="char portrait" data-act="pick" data-id="'+id+'" aria-pressed="'+(id===config.p1)+'">'+
      image(asset.wardrobe?.[id]?.[config.outfit1]?.portrait || asset.portraits?.[id])+'<span class="charlabel"><strong>'+esc(fighters[id].call)+
      '</strong><small>'+esc(fighters[id].role)+'</small></span></button>').join('');
    const bossStages=isOriginalBoss(config.boss)?{}:Object.fromEntries(Object.entries(stages).filter(([id])=>!window.StrandContent.stageLinks?.[id]&&!window.StrandExtensionRuntime?.stages.includes(id)));
    if(config.bossStage!=='recommended'&&!Object.hasOwn(bossStages,config.bossStage))config.bossStage='recommended';
    const field=outfitField(1,config.p1)+choose('difficulty','Difficulté',{easy:'Débutant',normal:'Porteur',hard:'Vétéran'})+
      choose('bossStage','Arène',{recommended:'Lieu conseillé · '+stages[selected.stage],...bossStages})+
      (isOriginalBoss(config.boss)?choose('scenarioSpeed','Vitesse de la rencontre',{'0.75':'75 % · lecture posée','1':'100 % · rythme standard','1.25':'125 % · rythme soutenu'}):'')+ambienceControl();
    const cp=history.checkpoint;
    const resume=cp&&bosses[cp.state.bossId]&&fighters[cp.state.p1]?'<div class="bossResume"><div><strong>Rencontre en cours</strong><p>'+esc(bosses[cp.state.bossId].name)+' · '+esc(fighters[cp.state.p1].call)+
      ' · '+Math.ceil(cp.state.p.hp)+' PV · '+Math.ceil(cp.state.remaining/60)+' s restantes</p></div>'+button('resumeBoss','Reprendre la rencontre','secondary')+'</div>':'';
    const recordLine=record?'<p class="montage">Ce combattant · '+record.wins+' victoire'+(record.wins>1?'s':'')+' / '+record.attempts+
      ' tentative'+(record.attempts>1?'s':'')+(record.best?' · Meilleur score '+record.best.toLocaleString('fr-FR'):'')+'</p>':'';
    setScreen('select','<section class="shell">'+back()+'<div class="pagehead"><div><div class="eyebrow">Boss Battle</div><h1>Les grandes rencontres</h1></div>'+
      '<p>Choisis ta cible et ton porteur. Observe l’annonce, ouvre une brèche, puis remplis l’objectif.</p></div>'+resume+
      '<div class="bossCards">'+cards+'</div><div class="fieldhead"><h2>Votre combattant</h2></div><div class="chars">'+fighterCards+'</div>'+
      presentationPanel()+'<div class="options">'+field+'</div><div class="bossBrief">'+stagePreview(config.bossStage==='recommended'?selected.stage:config.bossStage)+
      '<div><h2>'+esc(selected.name)+'</h2><p>'+esc(selected.goal)+'</p><p class="hint">'+esc(fighters[config.p1].special)+' · '+esc(fighters[config.p1].tip)+
      '</p>'+recordLine+'<p class="hint">La rencontre en cours et les records de Boss Battle sont sauvegardés séparément.</p>'+
      '<div class="actions">'+button('startBoss','Nouvelle tentative '+arrow)+button('controls','Commandes','secondary')+'</div></div></div>'+bossGuide({boss:config.boss,context:'boss',p1:config.p1,difficulty:config.difficulty})+'</section>');
  }
  function startBoss(resume=false) {
    const cp=resume?bossEngine?.progress().checkpoint:null;
    if(resume&&!cp){bossSelection();return;}
    stopFight();
    if(cp){config.p1=cp.state.p1;config.boss=cp.state.bossId;config.difficulty=cp.state.difficulty;config.outfit1=cp.state.outfit;config.bossStage=cp.state.stage;}
    config.mode='boss';
    const boss=bossEngine.encounters[config.boss],stage=cp?.state.stage || (config.bossStage==='recommended'?boss.stage:config.bossStage);
    const match={mode:'boss',kind:'boss',p1:config.p1,boss:config.boss,stage};activeFight=match;
    setScreen('fight','<section class="fightShell"><div class="fightbar"><div><div class="kicker">Boss Battle · '+esc(boss.name)+
      '</div><b>'+esc(stages[stage])+'</b></div><div class="tools">'+button('controls','Commandes','mini')+button('pause','Pause','mini','id="pauseBtn"')+
      '</div></div><div class="screen"><canvas id="arena" tabindex="0" aria-label="'+esc(fighters[match.p1].name+' affronte '+boss.name)+'"></canvas>'+
      '<div id="pauseBox" class="pausebox" hidden><h2>En pause</h2><p>Votre rencontre est conservée pour la reprise.</p>'+ambienceControl()+
      button('pause','Reprendre')+button('leave','Choisir une rencontre','secondary')+'</div></div><div class="combatNotes"><span>'+esc(boss.goal)+(isOriginalBoss(match.boss)?' · Prise / interaction : '+keyText(1,'throw'):'')+
      '</span><span id="signal" aria-live="polite"></span></div><div class="touchgroup">'+touchControls(1)+'</div></section>');
    bossEngine.start({canvas:document.getElementById('arena'),p1:match.p1,boss:match.boss,stage,difficulty:config.difficulty,outfit:config.outfit1,
      sound,ambienceVolume,reducedEffects,staticScenery,scenarioSpeed:Number(config.scenarioSpeed),resume:cp,onStatus(status){
        const signal=document.getElementById('signal');if(signal)signal.textContent=status.saved===false?'La progression reste disponible pour cette session.':status.message;
      },onEnd(result){if(activeFight===match)bossResult(match,result);}});
  }
  function bossResult(match,result) {
    stopFight();
    const boss=bossEngine.encounters[match.boss],title=result.won?(isOriginalBoss(match.boss)?'Passage rouvert · reddition acceptée':result.cargoGoal?'Cargaison sécurisée':'Grande présence vaincue'):
      ({cargo:'Cargaison perdue',freight:'Registre endommagé',time:'Temps écoulé',health:'Porteur à terre'})[result.reason] || 'Rencontre interrompue';
    const seconds=(result.elapsed/60).toFixed(1).replace('.',',');
    const rows=[['Résultat',result.won?'Victoire':'Défaite'],['Temps joué',seconds+' s'],['Vitalité',result.vitality+' / 120'],['Score',result.score.toLocaleString('fr-FR')],
      ['Dégâts infligés',result.stats.damageDealt],['Impacts gardés / contrés',result.stats.guarded],['Attaques évitées',result.stats.avoided]];
    if(result.cargoGoal)rows.push(['Colis livrés',result.cargo+' / '+result.cargoGoal],['Intégrité',result.integrity+' %']);
    if(boss.waves)rows.push(['Vagues atteintes',result.waves+' / '+boss.waves]);
    if(result.original){const flags=result.original.objectiveFlags;rows.push(['Phase atteinte',result.original.phase+' / 3'],['Consoles désactivées',(flags?.consoles?.filter(Boolean).length||0)+' / 2'],['Registre',flags?.register==='retrieved'?'Restitué':'À récupérer'],['Issue',flags?.surrendered?'Reddition non létale':'Passage encore fermé']);}
    setScreen('result','<section class="shell"><div class="result bossResult"><div class="eyebrow">Boss Battle · '+esc(boss.name)+
      '</div><h1>'+title+'</h1><p>'+esc(fighters[match.p1].call)+' · '+esc(stages[match.stage])+'</p><dl class="bossStats">'+
      rows.map(([label,value])=>'<div><dt>'+esc(label)+'</dt><dd>'+esc(value)+'</dd></div>').join('')+'</dl>'+
      '<p class="hint">'+(result.saved?'Bilan et records enregistrés.':'Le stockage du navigateur est indisponible ; ce bilan reste visible pendant cette session.')+'</p>'+
      '<div class="actions">'+(result.retryAvailable&&isOriginalBoss(match.boss)&&bossEngine.progress().checkpoint?button('resumeBoss','Reprendre cette phase'):'')+button('startBoss','Recommencer la rencontre',result.retryAvailable?'secondary':'primary')+button('bossSelection','Changer de rencontre','secondary')+button('home','Accueil','secondary')+'</div></div></section>');
  }
  function rushSelection() {
    stopFight();
    if(!bossEngine?.rush){setScreen('error','<section class="shell">'+back()+'<h1>Boss Rush indisponible</h1><p>Le module des grandes rencontres n’a pas pu être chargé.</p></section>');return;}
    config.mode='bossrush';
    if(!ids.includes(config.p1))config.p1=ids[0];
    const history=bossEngine.rush.progress(),run=history.run,order=bossEngine.rush.order;
    const record=history.records[[config.p1,config.difficulty].join(':')],ongoing=run&&['ready','active'].includes(run.status);
    const fighterCards=ids.map(id=>'<button class="char portrait" data-act="pick" data-id="'+id+'" aria-pressed="'+(id===config.p1)+'">'+
      image(asset.wardrobe?.[id]?.[config.outfit1]?.portrait||asset.portraits?.[id])+'<span class="charlabel"><strong>'+esc(fighters[id].call)+
      '</strong><small>'+esc(fighters[id].role)+'</small></span></button>').join('');
    const resume=ongoing?'<div class="bossResume"><div><strong>Série en cours · rencontre '+(run.index+1)+' / '+order.length+'</strong><p>'+esc(fighters[run.p1].call)+
      ' · '+esc(bossEngine.encounters[order[run.index]].name)+' · '+Math.ceil(run.health)+' PV · '+esc({easy:'Débutant',normal:'Porteur',hard:'Vétéran'}[run.difficulty])+
      '</p></div>'+button('continueRush','Reprendre la série','secondary')+'</div>':'';
    const recordLine=record?'<p class="montage">Ce combattant et cette difficulté · '+record.wins+' série'+(record.wins>1?'s':'')+' terminée'+(record.wins>1?'s':'')+
      ' / '+record.attempts+' tentative'+(record.attempts>1?'s':'')+(record.best?' · Meilleur score '+record.best.toLocaleString('fr-FR'):'')+'</p>':'';
    setScreen('select','<section class="shell">'+back()+'<div class="pagehead"><div><div class="eyebrow">Boss Rush</div><h1>Les six grandes rencontres</h1></div>'+
      '<p>Garde le même combattant et la même difficulté jusqu’au bout. Chaque victoire ouvre la rencontre suivante.</p></div>'+resume+
      '<div class="brief"><strong>120 PV au départ.</strong> La vie restante est conservée ; chaque victoire rend 20 PV, sans dépasser 120. '+
      'L’énergie chirale et la garde reviennent à 100 à chaque rencontre. Les effets, projectiles et colis sont réinitialisés. Une défaite termine la série.</div>'+
      '<ol class="montage">'+order.map(id=>'<li>'+esc(bossEngine.encounters[id].name)+' · '+esc(stages[bossEngine.encounters[id].stage])+'</li>').join('')+'</ol>'+
      '<div class="fieldhead"><h2>Votre combattant pour une nouvelle série</h2></div><div class="chars">'+fighterCards+'</div>'+presentationPanel()+'<div class="options">'+
      outfitField(1,config.p1)+choose('difficulty','Difficulté de la série',{easy:'Débutant',normal:'Porteur',hard:'Vétéran'})+ambienceControl()+'</div>'+recordLine+
      '<p class="hint">La reprise conserve le combattant, la tenue et la difficulté de la série sauvegardée. Les rencontres suivent leurs arènes conseillées. '+
      'Les bilans et la reprise de Boss Rush sont séparés de Boss Battle ; un entraînement libre reste accessible depuis l’accueil.</p><div class="actions">'+
      button('newRush',ongoing?'Recommencer au premier boss':'Commencer la série')+(run&&!ongoing?button('rushResult','Revoir le bilan','secondary'):'')+
      button('controls','Commandes','secondary')+'</div>'+bossGuide({boss:order[ongoing?run.index:0],context:'bossrush',p1:ongoing?run.p1:config.p1,difficulty:ongoing?run.difficulty:config.difficulty})+'</section>');
  }
  function startRush(fresh=false) {
    stopFight();
    if(fresh)bossEngine.rush.create({p1:config.p1,difficulty:config.difficulty,outfit:config.outfit1});
    const run=bossEngine.rush.progress().run;
    if(!run){rushSelection();return;}
    if(!['ready','active'].includes(run.status)){rushResult();return;}
    config.mode='bossrush';config.p1=run.p1;config.difficulty=run.difficulty;config.outfit1=run.outfit;
    const id=bossEngine.rush.order[run.index],boss=bossEngine.encounters[id],stage=boss.stage;
    const match={mode:'bossrush',kind:'boss',p1:run.p1,boss:id,stage};activeFight=match;
    setScreen('fight','<section class="fightShell"><div class="fightbar"><div><div class="kicker">Boss Rush · '+(run.index+1)+' / '+bossEngine.rush.order.length+
      ' · '+esc(boss.name)+'</div><b>'+esc(stages[stage])+'</b></div><div class="tools">'+button('controls','Commandes','mini')+
      button('pause','Pause','mini','id="pauseBtn"')+'</div></div><div class="screen"><canvas id="arena" tabindex="0" aria-label="'+esc(fighters[run.p1].name+' affronte '+boss.name)+'"></canvas>'+
      '<div id="pauseBox" class="pausebox" hidden><h2>En pause</h2><p>Votre série et la rencontre en cours sont conservées pour la reprise.</p>'+ambienceControl()+
      button('pause','Reprendre')+button('leave','Retour à Boss Rush','secondary')+'</div></div><div class="combatNotes"><span>'+esc(boss.goal)+
      '</span><span id="signal" aria-live="polite"></span></div><div class="touchgroup">'+touchControls(1)+'</div></section>');
    bossEngine.rush.start({canvas:document.getElementById('arena'),sound,ambienceVolume,reducedEffects,staticScenery,onStatus(status){
      const signal=document.getElementById('signal');if(signal)signal.textContent=status.saved===false?'La série reste disponible pour cette session.':status.message;
    },onEnd(result){if(activeFight===match)rushResult(result);}});
  }
  function rushResult(result) {
    stopFight();config.mode='bossrush';
    const run=bossEngine.rush.progress().run;
    if(!run){rushSelection();return;}
    const total=bossEngine.rush.order.length,totals=bossEngine.rush.totals(run),won=run.status==='won',lost=run.status==='lost';
    const title=won?'Les six rencontres sont terminées':lost?'La série est terminée':'Une étape franchie';
    const last=run.results.at(-1),reason=lost?({health:'Porteur à terre.',time:'Temps écoulé.',cargo:'Cargaison perdue.'})[last.reason]:'';
    const next=!won&&!lost?bossEngine.encounters[bossEngine.rush.order[run.index]]:null;
    const rows=[['Rencontres gagnées',run.index+' / '+total],['Score cumulé',totals.score.toLocaleString('fr-FR')],
      ['Temps joué',(totals.elapsed/60).toFixed(1).replace('.',',')+' s'],['Vitalité après étape',Math.ceil(run.health)+' / 120'],
      ['Difficulté',{easy:'Débutant',normal:'Porteur',hard:'Vétéran'}[run.difficulty]]];
    setScreen('result','<section class="shell"><div class="result bossResult"><div class="eyebrow">Boss Rush</div><h1>'+title+'</h1><p>'+esc(fighters[run.p1].call)+
      (reason?' · '+esc(reason):'')+'</p><dl class="bossStats">'+rows.map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>').join('')+'</dl>'+
      (next?'<p>'+Math.ceil(run.health-(last?.vitality??run.health))+' PV récupérés, dans la limite de 120. Prochaine rencontre : <strong>'+esc(next.name)+'</strong>.</p>':'')+
      (result?.saved===false?'<p class="hint">Le stockage du navigateur est indisponible ; la série reste disponible pendant cette session.</p>':'')+
      '<div class="actions">'+(next?button('continueRush','Affronter '+esc(next.name)):button('retryRush','Recommencer la série'))+
      button('rushSelection','Choix de la série','secondary')+button('home','Accueil','secondary')+'</div></div></section>');
  }
  function campaignSaveHint() {
    return campaign.progress().saved ? 'Progression enregistrée dans ce navigateur. Une rencontre interrompue reprend au début du chapitre.' :
      'Le stockage du navigateur est indisponible. Ta progression reste disponible pendant cette session ; elle sera perdue à la fermeture.';
  }
  function campaignSelection(notice='') {
    stopFight();config.mode='campaign';
    if(!campaign||!engine||!bossEngine){setScreen('error','<section class="shell">'+back()+'<h1>Campagne indisponible</h1><p>Un module nécessaire au parcours n’a pas pu être chargé.</p></section>');return;}
    const state=campaign.progress(),run=state.run,finished=run?.phase==='complete',completed=run?.results.length||0;
    const current=run?campaignContent.chapters[run.chapter]:null;
    const resumeLabel=run?.phase==='ending'?'Voir la conclusion':run?.phase==='aftermath'?'Lire l’interlude du chapitre '+(run.chapter+1):
      run?.phase==='prologue'?'Reprendre le prologue':'Reprendre le chapitre '+((run?.chapter||0)+1);
    const cards=campaignContent.chapters.map((c,index)=>{
      const done=index<completed,active=run&&!finished&&index===run.chapter;
      const opponent=c.kind==='boss'?bossEngine.encounters[c.boss].name:fighters[c.p2].call;
      return '<li class="campaignChapter'+(done?' completed':'')+(active?' current':'')+'"><span class="campaignNumber">'+String(index+1).padStart(2,'0')+
        '</span><div><p class="kicker">'+esc(fighters[c.p1].call)+' · '+(c.kind==='boss'?'Grande rencontre':'Duel')+'</p><h2>'+esc(c.title)+
        '</h2><p>'+esc(opponent)+' · '+esc(stages[c.stage])+'</p><small>'+esc(c.objective)+'</small></div><span class="campaignStatus">'+
        (done?'Validé':active?'En cours':'À parcourir')+'</span></li>';
    }).join('');
    setScreen('campaign','<section class="shell campaignShell">'+back()+'<div class="pagehead"><div><div class="eyebrow">Campagne du simulateur</div><h1>'+campaignContent.title+
      '</h1></div><p>Six liaisons rompues. Cinq points de vue. Une réponse à reconstruire ensemble.</p></div><p class="campaignFiction">'+esc(campaignContent.fiction)+
      '</p>'+(notice||state.recovery?'<p class="brief" role="status">'+esc(notice||state.recovery)+'</p>':'')+
      (run?'<div class="campaignResume"><div><strong>'+(finished?'Campagne terminée':completed+' / 6 chapitres validés')+'</strong><p>'+esc(campaignContent.difficulties[run.difficulty])+
        (current&&!finished?' · '+esc(current.title):' · Les six liaisons sont rétablies.')+'</p></div>'+button(finished?'campaignConclusion':'campaignResume',finished?'Revoir la conclusion':resumeLabel)+'</div>':'')+
      '<div class="campaignRules"><p><strong>Quatre duels et deux grandes rencontres.</strong> Les duels se gagnent en deux manches. Le point de vue et l’arène suivent le récit.</p>'+
      '<p>La difficulté reste fixée pendant une partie. Vitalité, garde et énergie repartent à leur valeur de départ à chaque chapitre. Une défaite permet de recommencer le chapitre sans perdre les précédents.</p>'+
      '<p>Quitter une rencontre ou fermer la page ramène au début de ce chapitre. Les interludes débloqués restent dans leur galerie, même après une nouvelle partie.</p></div>'+
      '<div class="options">'+choose('campaignDifficulty','Difficulté d’une nouvelle partie',campaignContent.difficulties)+ambienceControl()+'</div><div class="actions">'+
      button('campaignNew',run?'Nouvelle campagne':'Commencer les six chapitres',run?'secondary':'primary')+button('campaignGallery','Interludes · '+state.unlocked.length+' / '+campaignContent.scenes.length,'secondary')+
      button('controls','Commandes','secondary')+'</div><p class="hint campaignSave" role="status">'+esc(campaignSaveHint())+'</p><ol class="campaignChapters">'+cards+'</ol></section>');
  }
  function campaignNew() {
    stopFight();
    const run=campaign?.progress().run;
    if(run&&run.phase!=='complete'){
      setScreen('campaignReplace','<section class="shell"><div class="result"><div class="eyebrow">Les Nœuds rompus</div><h1>Recommencer les six chapitres ?</h1>'+
        '<p>La partie en cours sera remplacée. Les interludes déjà débloqués resteront disponibles. Les huit histoires et les autres modes conservent leurs sauvegardes.</p><div class="actions">'+
        button('campaignResume','Garder et reprendre la partie')+button('campaignStart','Recommencer la campagne','secondary')+'</div></div></section>');return;
    }
    campaignStart();
  }
  function campaignStart() {
    if(!campaign)return campaignSelection();
    stopFight();config.mode='campaign';campaign.start(config.campaignDifficulty);campaignScene();
  }
  function campaignResume() {
    if(!campaign?.progress().run)return campaignSelection();
    stopFight();config.mode='campaign';campaign.resume();campaignScene();
  }
  function campaignScene(replayId=null) {
    if(!campaign)return campaignSelection();
    const state=campaign.progress(),run=state.run;
    const fromGallery=typeof replayId==='string';
    if(fromGallery&&!state.unlocked.includes(replayId))return campaignGallery();
    const current=fromGallery?campaignContent.scenes.find(s=>s.id===replayId):campaign.currentScene();
    if(!current)return campaignSelection();
    const speaker=fighters[current.speaker]?.call||current.speaker;
    const chapterIndex=campaignContent.chapters.findIndex(c=>c.before.id===current.id||c.after.id===current.id);
    const label=chapterIndex>=0?'Chapitre '+(chapterIndex+1)+' / 6 · '+campaignContent.chapters[chapterIndex].title:
      current.id==='prologue'?'Prologue':'Conclusion';
    const action=fromGallery?'campaignGallery':run.phase==='briefing'?'campaignFight':run.phase==='complete'?'campaignSelection':'campaignAdvance';
    const next=fromGallery?'Retour aux interludes':run.phase==='briefing'?'Entrer dans l’arène':run.phase==='prologue'?'Commencer le premier chapitre':
      run.phase==='ending'?'Clore la campagne':run.phase==='complete'?'Retour à la campagne':run.chapter===5?'Voir la conclusion':'Chapitre suivant';
    const portrait=asset.portraits?.[current.speaker];
    const guideChapter=!fromGallery&&run?.phase==='briefing'?campaignContent.chapters[run.chapter]:null;
    setScreen('campaignScene','<section class="story-art campaignScene"'+backdrop(asset.stages?.[current.stage]||asset.hero)+'>'+
      (portrait?'<img class="campaignPortrait" src="'+esc(portrait)+'" alt="">':'')+'<div class="story-copy"><div class="eyebrow">Les Nœuds rompus · '+esc(label)+
      '</div><div class="speaker">'+esc(speaker)+'</div><h1>'+esc(current.title)+'</h1>'+current.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+
      '<div class="actions">'+button(action,next+' '+arrow)+(!fromGallery?button('campaignSelection','Retour au parcours','secondary'):'')+'</div></div></section>'+
      '<div class="routebar">Fiction du simulateur · Empreintes DS1 / Director’s Cut'+(fromGallery?' · Relecture sans effet sur la progression':' · '+esc(campaignSaveHint()))+'</div>'+
      (guideChapter?.kind==='boss'?'<section class="shell">'+bossGuide({boss:guideChapter.boss,context:'campaign',p1:guideChapter.p1,difficulty:run.difficulty})+'</section>':''));
  }
  function campaignAdvance() {
    if(!campaign?.advance())return campaignSelection();
    if(campaign.progress().run.phase==='complete')campaignSelection();else campaignScene();
  }
  function campaignGallery() {
    stopFight();config.mode='campaign';
    if(!campaign)return campaignSelection();
    const state=campaign.progress();
    const cards=campaignContent.scenes.map(s=>{
      const unlocked=state.unlocked.includes(s.id),speaker=fighters[s.speaker]?.call||s.speaker;
      return unlocked?'<button data-act="campaignReplay" data-scene="'+s.id+'">'+image(asset.stages?.[s.stage],s.title)+'<strong>'+esc(s.title)+
        '</strong><small>'+esc(speaker)+'</small></button>':'<article class="campaignLocked"><span aria-hidden="true">◇</span><strong>Interlude à découvrir</strong><small>'+esc(speaker)+'</small></article>';
    }).join('');
    setScreen('campaignGallery','<section class="shell">'+button('campaignSelection','← Les Nœuds rompus','back')+'<div class="pagehead"><div><div class="eyebrow">Campagne du simulateur</div><h1>Les interludes</h1></div>'+
      '<p>'+state.unlocked.length+' / '+campaignContent.scenes.length+' scènes débloquées. Les relire ne change pas la partie en cours.</p></div><div class="gallery campaignGallery">'+cards+
      '</div><p class="hint campaignSave">Les illustrations réemploient les décors du simulateur ; le récit est une création de cette campagne.</p></section>');
  }
  function campaignFight() {
    stopFight();
    const entry=campaign?.beginEncounter();if(!entry)return campaignResume();
    const c=entry.chapter;config.mode='campaign';config.p1=c.p1;
    const match={mode:'campaign',kind:c.kind==='boss'?'boss':'cpu',p1:c.p1,p2:c.p2,boss:c.boss,stage:c.stage,difficulty:entry.difficulty,
      campaignTicket:entry.ticket,chapter:c.id,title:'Les Nœuds rompus · '+(entry.index+1)+' / 6 · '+c.title};
    if(c.kind==='duel'){fight(match);return;}
    activeFight=match;
    const boss=bossEngine.encounters[c.boss];
    setScreen('fight','<section class="fightShell"><div class="fightbar"><div><div class="kicker">'+esc(match.title)+'</div><b>'+esc(stages[c.stage])+
      '</b></div><div class="tools">'+button('controls','Commandes','mini')+button('pause','Pause','mini','id="pauseBtn"')+'</div></div><div class="screen">'+
      '<canvas id="arena" tabindex="0" aria-label="'+esc(fighters[c.p1].name+' affronte '+boss.name)+'"></canvas><div id="pauseBox" class="pausebox campaignPause" hidden><h2>En pause</h2>'+
      '<p>Quitter ou fermer la page reprend ce chapitre depuis son début. Les chapitres précédents restent validés.</p>'+ambienceControl()+button('pause','Reprendre')+
      button('leave','Retour à la campagne','secondary')+'</div></div><div class="combatNotes"><span>'+esc(boss.goal)+'</span><span id="signal" aria-live="polite"></span></div>'+
      '<div class="touchgroup">'+touchControls(1)+'</div></section>');
    bossEngine.start({canvas:document.getElementById('arena'),p1:c.p1,boss:c.boss,stage:c.stage,difficulty:entry.difficulty,outfit:'atelier',isolated:true,
      sound,ambienceVolume,reducedEffects,staticScenery,onStatus(status){const signal=document.getElementById('signal');if(signal)signal.textContent=status.message||'';},
      onEnd(result){if(activeFight===match)campaignOutcome(match,result);}});
  }
  function campaignOutcome(match,result) {
    const summary=campaign.record(match.campaignTicket,result);stopFight();
    if(!summary){campaignSelection('La rencontre a été interrompue. Reprends ce chapitre depuis son début.');return;}
    const run=campaign.progress().run,c=campaignContent.chapters[run.chapter];
    const detail=summary.rounds?summary.rounds.join(' – ')+' manches':summary.won?'Objectif de la grande rencontre atteint.':
      ({cargo:'Le dépôt a été perdu.',time:'Le temps est écoulé.',health:'Le porteur est à terre.'})[summary.reason]||'La rencontre est perdue.';
    setScreen('campaignResult','<section class="shell"><div class="result campaignResult"><div class="eyebrow">Les Nœuds rompus · Chapitre '+(run.chapter+1)+
      '</div><h1>'+(summary.won?'La liaison se rouvre':'La liaison reste fermée')+'</h1><p>'+esc(c.title)+' · '+esc(fighters[c.p1].call)+'</p><p class="campaignResultDetail">'+esc(detail)+
      '</p><p>'+(summary.won?'Le chapitre est validé. Découvre ce que cette victoire rend possible.':'Tu peux recommencer ce chapitre avec tes ressources de départ. Les victoires précédentes sont conservées.')+
      '</p><p class="hint campaignSave" role="status">'+esc(campaignSaveHint())+'</p><div class="actions">'+
      button(summary.won?'campaignInterlude':'campaignResume',summary.won?'Lire l’interlude':'Recommencer ce chapitre')+button('campaignSelection','Voir le parcours','secondary')+
      button('home','Accueil','secondary')+'</div></div></section>');
  }
  function openStory() {
    const index = chapter();
    if (index === 3 || !index) {
      progress[config.p1] = 0; save('chapters',progress);
      scene(config.p1,'intro'); return;
    }
    if (index === 2) scene(config.p1,'rival'); else routeFight();
  }
  function unlock(id, part) { archive[id + '-' + part] = true; save('scenes',archive); }
  function sceneFrames(id,part) {
    const declared=asset.storyFrames?.[id]?.[part];
    const frames=Array.isArray(declared)?declared.filter(frame=>frame&&typeof frame.src==='string'&&frame.src).map(frame=>({
      src:frame.src,caption:typeof frame.caption==='string'?frame.caption:fighters[id].scenes[part][0],alt:typeof frame.alt==='string'?frame.alt:frame.caption
    })):[];
    return frames.length?frames:[{src:art(id,part),caption:fighters[id].scenes[part][0],alt:fighters[id].call+' · '+scenes[part]}];
  }
  function scene(id, part, fromGallery = false, frameIndex = 0) {
    const character = fighters[id];
    if(!character||!Object.hasOwn(scenes,part))return gallery();
    const [title,body] = character.scenes[part],frames=sceneFrames(id,part),index=Math.max(0,Math.min(frames.length-1,Number.isInteger(frameIndex)?frameIndex:0)),frame=frames[index];
    if (!fromGallery&&!archive[id+'-'+part]) unlock(id,part);
    scenePlayback={id,part,fromGallery,index,total:frames.length};
    const next = fromGallery ? button('gallery','Retour à la galerie') : part === 'ending' ? button('home','Terminer le parcours') : button('routeFight','Entrer dans l’arène ' + arrow);
    const navigation='<div class="sceneNavigation" role="group" aria-label="Illustrations de la scène"><p id="sceneFrameStatus" aria-live="polite" aria-atomic="true"><span class="sceneCount">Illustration '+(index+1)+' / '+frames.length+
      '</span><span class="sceneCaption">'+esc(frame.caption)+'</span></p>'+(frames.length>1?'<div class="sceneButtons">'+button('previousSceneFrame','← Précédent','mini','aria-controls="scenePicture"'+(index===0?' disabled':''))+
      button('nextSceneFrame','Suivant →','mini','aria-controls="scenePicture"'+(index===frames.length-1?' disabled':''))+'</div>':'')+'</div>';
    setScreen('scene','<section class="story-art sceneSequence"><img id="scenePicture" class="scenePicture" src="'+esc(frame.src)+'" alt="'+esc(frame.alt||frame.caption)+'"><div class="story-copy"><div class="eyebrow">' +
      character.call + ' / ' + character.story + '</div><div class="speaker">' + scenes[part] + '</div><h1>' + title + '</h1><p>' + body +
      '</p>'+navigation+'<div class="actions">' + next + '</div></div></section><div class="routebar">' + character.route.map(([opponent,place]) => fighters[opponent].call + ' · ' + stages[place]).join('　→　') + '</div>');
  }
  function sceneStep(direction) {
    if(screen!=='scene'||!scenePlayback)return;
    const p=scenePlayback,index=Math.max(0,Math.min(p.total-1,p.index+direction));
    if(index===p.index)return;
    const frame=sceneFrames(p.id,p.part)[index],picture=document.getElementById('scenePicture'),status=document.getElementById('sceneFrameStatus');
    if(!frame||!picture||!status)return;
    scenePlayback={...p,index};
    picture.setAttribute('src',frame.src);picture.setAttribute('alt',frame.alt||frame.caption);
    status.querySelector('.sceneCount').textContent='Illustration '+(index+1)+' / '+p.total;
    status.querySelector('.sceneCaption').textContent=frame.caption;
    const previous=view.querySelector('[data-act="previousSceneFrame"]'),next=view.querySelector('[data-act="nextSceneFrame"]');
    if(previous)previous.disabled=index===0;if(next)next.disabled=index===p.total-1;
    const action=index===0?'nextSceneFrame':index===p.total-1?'previousSceneFrame':direction<0?'previousSceneFrame':'nextSceneFrame';
    view.querySelector('[data-act="'+action+'"]')?.focus({preventScroll:true});
  }
  function gallery() {
    const unlocked = ids.flatMap(id => Object.keys(scenes).filter(part => archive[id + '-' + part]).map(part =>
      '<button data-act="replay" data-id="' + id + '" data-part="' + part + '">' + image(art(id,part)) + '<strong>' + fighters[id].scenes[part][0] + '</strong><small>' + fighters[id].call + ' · ' + scenes[part] + '</small></button>'));
    const seal=read('seal.delivery',false) ? '<div class="brief"><strong>Sceau du camp</strong> · Décerné pour une livraison sous pression arrivée intacte.</div>' : '';
    setScreen('gallery','<section class="shell">' + back() + '<h1>Galerie des scènes</h1>' + seal + (unlocked.length ?
      '<div class="gallery">' + unlocked.join('') + '</div>' : '<p class="hint matchline">Ouvre un parcours en mode Histoire pour retrouver ici ses scènes au fil de ta progression.</p>') + '</section>');
  }
  function bracketName(entrant) { return entrant.label + ' · ' + fighters[entrant.fighter].call; }
  function roundName(round) { return ({1:'Finale',2:'Demi-finales',4:'Quarts de finale'})[round.length]; }
  function bracket() {
    if (!cup) { selection(); return; }
    const finale = cup.rounds.at(-1)[0], champ = finale.winner;
    const groups = cup.rounds.map(round => '<section class="roundgroup"><h2>' + roundName(round) + '</h2>' + round.map(match => {
      const sides = match.players.map((id,index) => '<div class="names' + (id !== null && id === match.winner ? ' won' : '') +
        '"><span>' + (id === null ? (match.bye ? 'Exemption' : 'À qualifier') : bracketName(cup.entrants[id])) +
        '</span><span class="score">' + (match.score ? match.score[index] : '—') + '</span></div>');
      return '<div class="pair' + (match.winner !== null ? ' complete' : '') + '">' + sides.join('') +
        (match.bye ? '<small>Qualification directe</small>' : '') +
        (match.winner!==null && engine?.validReplay?.(match.replay) ? button('cupReplay','Revoir le duel','mini','data-match="'+esc(match.id)+'"') : '') + '</div>';
    }).join('') + '</section>').join('');
    const match = tournament.next(cup);
    const nextLine = match ? '<p class="hint matchline">Prochaine rencontre · ' + match.players.map(id => bracketName(cup.entrants[id])).join(' / ') + '</p>' : '';
    setScreen('bracket','<section class="shell">' + back() + '<div class="pagehead"><div><div class="eyebrow">Tournoi · ' + cup.entrants.length + ' entrants</div><h1>' +
      (champ === null ? 'Tableau du tournoi' : 'Champion · ' + bracketName(cup.entrants[champ])) + '</h1></div><p>Les rencontres entre deux IA sont simulées. Chaque duel joué se décide en deux manches gagnantes.</p></div><div class="bracket">' + groups +
      '</div>' + nextLine + '<div class="actions">' + (match ? button('cupFight','Jouer la rencontre ' + arrow) : '') +
      button('mode','Inscription','secondary','data-mode="tournament"') + '</div></section>');
  }
  function cupFight() {
    const match = cup && tournament.next(cup);
    if (!match) { bracket(); return; }
    openCupMatch(match);
  }
  function cupReplay(el) {
    const match=cup?.rounds.flat().find(item=>item.id===el.dataset.match);
    if (match?.winner!=null && engine?.validReplay?.(match.replay)) openCupMatch(match,match.replay);
  }
  function openCupMatch(match,replay=null) {
    const slots = match.players.slice();
    if (!cup.entrants[slots[0]].human || (cup.entrants[slots[1]].human && slots[1] === 0)) slots.reverse();
    const [a,b] = slots.map(id => cup.entrants[id]);
    const bothHuman = a.human && b.human;
    // Match-side controllers are reassigned on screen; an isolated human always uses J1.
    // The original saved brackets use their three release arenas in this order.
    const stage = match.stage || ['shore','terminal','battlefield'][match.seed % 3];
    fight({p1:a.fighter, p2:b.fighter, stage, difficulty:cup.difficulty,
      kind:bothHuman ? 'local' : 'cpu', mode:'tournament', title:roundName(cup.rounds[Number(match.id.split('-')[0])]),
      labels:[bracketName(a),bracketName(b)], matchId:match.id, slots,seed:match.seed,replay});
  }
  function routeFight() {
    const index = config.mode === 'story' ? chapter() : arcadeStep;
    const [p2,stage] = fighters[config.p1].route[index];
    fight({...config, p2, stage, kind:'cpu', title:modes[config.mode] + ' · Duel ' + (index + 1) + '/3'});
  }
  function start() {
    switch (config.mode) {
      case 'campaign': campaign.progress().run?campaignResume():campaignNew(); return;
      case 'boss': startBoss(); return;
      case 'bossrush': startRush(true); return;
      case 'story': openStory(); return;
      case 'challenges': startTrial(); return;
      case 'arcade': arcadeStep = 0; routeFight(); return;
      case 'tournament':
        if (cup && cup.rounds.at(-1)[0].winner === null) {
          setScreen('replaceCup','<section class="shell"><div class="result"><div class="eyebrow">Tournoi</div><h1>Nouveau tirage ?</h1><p>Le tableau en cours sera remplacé.</p><div class="actions">' +
            button('bracket','Garder le tableau') + button('newCup','Créer le nouveau tableau','secondary') + '</div></div></section>'); return;
        }
        newCup(); return;
      default: fight({...config, kind:config.mode === 'training' ? 'training' : config.opponent, title:modes[config.mode]});
    }
  }
  // Records are distinct for each fighter, difficulty, rule revision and retry policy.
  function trialKey(retried) {
    return ['trial',1,config.challenge,config.difficulty,config.p1,retried ? 'retry' : 'clean'].join('.');
  }
  function trialBrief() {
    const delivery=config.challenge==='delivery';
    const goal=delivery ? 'Gagne une manche au camp en protégeant le scellé de la caisse. Un coup bloqué préserve le colis. Une frappe directe rompt le scellé.' :
      'Affronte les sept autres combattants, une manche chacun. Après chaque victoire, tu récupères 15 points de vitalité, jusqu’à 100.';
    const records=[false,true].map(retried=>{
      const best=read(trialKey(retried),null);
      if (!best) return '';
      return '<p class="montage">Record ' + (retried ? 'avec reprise' : 'sans reprise') + ' · ' +
        (delivery ? 'Colis intact' : best.wins+' / '+(ids.length-1)+' victoires') + ' · Vitalité '+best.hp+' / 100</p>';
    }).join('');
    return '<p class="montage">'+goal+'</p>'+records;
  }
  function startTrial() {
    const delivery=config.challenge==='delivery';
    const start=ids.indexOf(config.p1);
    const route=delivery ? [[config.p1==='mule' ? 'sam' : 'mule','mule-camp']] :
      ids.slice(start+1).concat(ids.slice(0,start)).map(id=>[id,stageFor(id)]);
    trial={route,wins:0,hp:100,retries:0};
    trialFight();
  }
  function trialFight() {
    const [p2,stage]=trial.route[trial.wins];
    fight({...config,kind:'cpu',p2,stage,vitality:trial.hp,parcel:config.challenge==='delivery',
      title:trialNames[config.challenge]+' · '+(trial.wins+1)+'/'+trial.route.length});
  }
  function retryTrial() { trial.retries++; trialFight(); }
  function trialResult(result) {
    const delivery=config.challenge==='delivery';
    const won=result.winner===1 && (!delivery || result.parcel==='intact');
    const hp=result.vitality;
    if (won) trial.wins++;
    const done=trial.wins===trial.route.length;
    const key=trialKey(trial.retries>0), best=read(key,null);
    if (won && (!best || trial.wins>best.wins || (trial.wins===best.wins && hp>best.hp)))
      save(key,{wins:trial.wins,hp});
    if (delivery && won) save('seal.delivery',true);
    const title=delivery ? won ? 'Cargaison livrée' : result.parcel==='broken' ? 'Scellé rompu' : 'Livraison interrompue' :
      done ? 'Survie terminée' : won ? 'Adversaire vaincu' : 'Série interrompue';
    let detail=delivery ? won ? 'La caisse arrive intacte. Le sceau du camp est disponible dans la galerie.' :
      result.parcel==='broken' ? 'Une frappe directe a atteint le porteur. La garde protège le scellé.' : 'Le porteur a perdu le duel.' :
      trial.wins+' / '+trial.route.length+' adversaires vaincus.';
    if (won && !done) {
      trial.hp=Math.min(100,hp+15);
      detail+=' Vitalité pour la prochaine manche : '+trial.hp+' / 100.';
    }
    const next=done ? button('startTrial','Nouvelle tentative') : won ? button('trialFight','Adversaire suivant') : button('retryTrial','Reprendre ce duel');
    setScreen('result','<section class="shell"><div class="result"><div class="eyebrow">'+trialNames[config.challenge]+
      '</div><h1>'+title+'</h1><p>'+detail+'</p><div class="actions">'+next+button('selection','Choix de l’épreuve','secondary')+
      button('home','Accueil','secondary')+'</div></div></section>');
  }
  function newCup() {
    cup = tournament.create({...config, count:Number(config.count), humans:Number(config.humans), seed:Math.floor(Math.random() * 0x100000000)});
    save('cup',cup); bracket();
  }
  const keys = input.actions;
  function keyText(player,action) {return '<span data-key-player="'+player+'" data-key-action="'+action+'">'+esc(inputSettings.label(player,action))+'</span>';}
  function inputSummary(player) {return 'J'+player+' · Léger '+inputSettings.label(player,'light')+' · Lourd '+inputSettings.label(player,'heavy')+' · Signature '+inputSettings.label(player,'special')+' · Garde '+inputSettings.label(player,'guard');}
  function refreshInputLabels() {
    document.querySelectorAll('[data-key-player]').forEach(node=>{node.textContent=inputSettings.label(Number(node.dataset.keyPlayer),node.dataset.keyAction);});
    document.querySelectorAll('[data-input-summary]').forEach(node=>{node.textContent=inputSummary(Number(node.dataset.inputSummary));});
    view.querySelectorAll('[data-input]').forEach(node=>{
      const text='J'+node.dataset.p+' · '+node.dataset.inputTitle+' · clavier '+inputSettings.label(Number(node.dataset.p),node.dataset.input);
      node.setAttribute('aria-label',text);node.title=text;
    });
    if(activeFight?.kind!=='boss'&&activeFight&&!activeFight.replay){
      const status=engine.snapshot?.(),signal=document.getElementById('signal');
      if(signal&&status?.phase==='finish')signal.textContent=finishHint(status,activeFight.kind==='local');
    }
  }
  function finishHint(status,local){return 'Finalité disponible · '+(status.winner===1?'J1 · '+inputSettings.label(1,'finish'):local?'J2 · '+inputSettings.label(2,'finish'):'IA');}
  function touchControls(player) {
    function control(item) {
      const {id:action,title,short:label} = item;
      const bossLabel=activeFight?.kind==='boss'?({throw:bossEngine.encounters[activeFight.boss]?.cargo?'Colis':'Appui',finish:'Chiral'})[action]:null;
      const hint='J'+player+' · '+(bossLabel||title)+' · clavier '+inputSettings.label(player,action);
      return '<button type="button" aria-label="'+esc(hint)+'" title="'+esc(hint)+'" data-input-title="'+esc(bossLabel||title)+'" data-p="' + player + '" data-input="' + action + '">' + (bossLabel || label) + '</button>';
    }
    return '<div class="touchRow"><small>J' + player + '</small><div class="touch"><div>' + keys.slice(0,4).map(control).join('') +
      '</div><div>' + keys.slice(4).filter(item=>activeFight?.kind!=='boss'||item.id!=='taunt').map(control).join('') + '</div></div></div>';
  }
  const dojoSeconds=new Intl.NumberFormat('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1});
  function lessonSelection() {
    stopFight();config.mode='training';
    if(!lessonContent||!lessonStore||!window.StrandMovesData){setScreen('error','<section class="shell">'+back()+'<h1>Parcours indisponible</h1><p>Le module des exercices ou les fiches de combat n’ont pas pu être chargés.</p></section>');return;}
    const state=lessonStore.progress(),completed=Object.keys(state.completed).length,resume=state.resume;
    const cards=lessonContent.lessons.map((lesson,index)=>{
      const record=state.completed[lesson.id];
      return '<li class="lessonCard'+(record?' complete':'')+'"><span class="kicker">Exercice '+(index+1)+' / '+lessonContent.lessons.length+(record?' · Validé':'')+
        '</span><h2>'+esc(lesson.title)+'</h2><p>'+esc(lesson.summary)+'</p>'+(record?'<small>Validé avec '+record.fighters.map(id=>esc(fighters[id].call)).join(', ')+'.</small>':'')+
        button('startLesson',record?'S’exercer à nouveau':'Commencer','secondary','data-lesson="'+lesson.id+'"')+'</li>';
    }).join('');
    const fighterChoice='<label>Combattant des exercices<select data-lesson-fighter>'+ids.map(id=>'<option value="'+id+'"'+(id===lessonFighter?' selected':'')+'>'+esc(fighters[id].name)+'</option>').join('')+'</select></label>';
    setScreen('lessons','<section class="shell">'+button('selection','← Dojo libre','back')+'<div class="pagehead"><div><div class="eyebrow">Centre d’entraînement</div><h1>Le parcours du dojo</h1></div><p>Des objectifs concrets, un mannequin prévisible et les commandes de ton profil J1.</p></div>'+
      '<p class="lessonProgress">'+completed+' / '+lessonContent.lessons.length+' exercices validés</p><p>Chaque exercice peut être joué directement. Les validations restent acquises. Une interruption reprend l’exercice depuis son début ; aucun duel, récit ou record Boss n’est modifié.</p>'+
      '<div class="options">'+fighterChoice+ambienceControl()+'</div><div class="lessonResume"><span>Point de reprise · '+esc(lessonContent.get(resume.id).title)+' · '+esc(fighters[resume.fighter].call)+'</span>'+
      button('startLesson',completed===lessonContent.lessons.length?'Rejouer le dernier exercice':'Reprendre le parcours','primary','data-lesson="'+resume.id+'" data-fighter="'+resume.fighter+'"')+'</div>'+
      '<p class="hint" role="status">'+esc(state.notice||(state.saved?'Progression des exercices enregistrée dans ce navigateur.':'Progression disponible pendant cette session.'))+'</p><ol class="lessonList">'+cards+'</ol></section>');
  }
  function startLesson(id,selectedFighter=lessonFighter) {
    if(!lessonContent?.get(id)||!fighters[selectedFighter])return lessonSelection();
    stopFight();lessonFighter=selectedFighter;config.mode='training';config.p1=selectedFighter;
    lessonStore.begin(id,selectedFighter);
    fight({mode:'training',kind:'training',lesson:id,p1:selectedFighter,p2:selectedFighter==='higgs'?'sam':'higgs',
      stage:stages['firing-range-dc']?'firing-range-dc':'terminal',difficulty:'easy',seed:0x1e550,
      title:'Parcours du dojo · '+lessonContent.get(id).title});
  }
  function lessonMarkup() {
    const definition=lessonRun.session.definition;
    return '<section class="lessonPanel" aria-labelledby="lessonTitle"><p class="kicker">Exercice dirigé · J1 '+esc(fighters[lessonRun.fighter].call)+'</p><h2 id="lessonTitle">'+esc(definition.title)+
      '</h2><ol class="lessonSteps" id="lessonSteps"></ol><p id="lessonFeedback" class="lessonFeedback" role="status"></p><p id="lessonMetric" class="lessonMetric"></p><p class="hint">'+esc(definition.note)+
      '</p><div class="lessonActions">'+button('retryLesson','Recommencer l’exercice','mini')+button('lessons','Retour au parcours','mini')+'</div><div id="lessonResult" class="lessonResult" hidden></div></section>';
  }
  function renderLesson(state) {
    if(!lessonRun)return;
    const steps=document.getElementById('lessonSteps'),metric=document.getElementById('lessonMetric'),feedback=document.getElementById('lessonFeedback');
    if(!steps)return;
    const forward=state.forward||'right',backward=forward==='right'?'left':'right',stamp=[state.step,state.phase,forward].join(':');
    if(lessonRun.renderStamp!==stamp){
      lessonRun.renderStamp=stamp;
      const text=value=>esc(value).replace(/\{([a-z]+)\}/g,(_,action)=>'<span class="lessonKey">'+keyText(1,action==='forward'?forward:action==='back'?backward:action)+'</span>');
      steps.innerHTML=state.steps.map((step,index)=>'<li'+(index<state.step?' class="done"':index===state.step&&state.phase==='active'?' aria-current="step"':'')+'>'+text(step)+'</li>').join('');
    }
    if(metric.textContent!==state.metric)metric.textContent=state.metric;
    if(feedback.textContent!==state.feedback)feedback.textContent=state.feedback;
  }
  function updateLesson(status) {
    const run=lessonRun;if(!run)return;
    const update=run.session.observe(status);
    for(const [player,action,down] of update.commands)engine.input(player,action,down);
    renderLesson(update.state);
    if(update.state.phase==='active'||run.settled)return;
    run.settled=true;paused=true;releaseControls();engine.pause(true);
    const passed=update.state.phase==='success';
    if(passed)lessonStore.complete(run.id,run.fighter);
    const next=lessonContent.lessons[lessonContent.lessons.findIndex(item=>item.id===run.id)+1];
    const result=document.getElementById('lessonResult');
    result.innerHTML='<h3 tabindex="-1" id="lessonResultTitle">'+(passed?'Exercice validé':'À réessayer')+'</h3><p>'+esc(update.state.feedback)+'</p>'+
      (passed?'<p class="hint">'+esc(lessonStore.progress().notice||'Cette validation reste acquise lorsque tu quittes le dojo.')+'</p>':'')+
      '<div class="lessonActions">'+(passed&&next?button('startLesson','Exercice suivant','primary','data-lesson="'+next.id+'"'):button('lessons',passed?'Voir le parcours':'Choisir un autre exercice','secondary'))+
      button('retryLesson','Recommencer','secondary')+'</div>';
    result.hidden=false;document.getElementById('pauseBtn').disabled=true;document.getElementById('lessonResultTitle').focus();
  }
  function trainingTools() {
    const options = {idle:'Immobile',guard:'En garde',cpu:'IA active',record:'Enregistrer J2',loop:'Lire en boucle'};
    return '<label>Mannequin <select id="dummy">' + Object.entries(options).map(([value,label]) => '<option value="' + value + '"' +
      (value === training.dummy ? ' selected' : '') + '>' + label + '</option>').join('') +
      '</select></label><span id="tapeStatus"></span><span class="inputSummary" data-input-summary="2">'+esc(inputSummary(2))+'</span><label><input type="checkbox" id="boxes"' + (training.hitboxes ? ' checked' : '') + '>Zones de touche</label>' + button('resetTraining','Replacer au centre','mini') +
      '<label><input type="checkbox" id="dojoTiming"'+(training.timing ? ' checked' : '')+'>Données des coups</label>' +
      '<div id="dojoData" hidden><table><caption>Durées en pas de simulation (60 par seconde)</caption><thead><tr>' +
      ['Joueur','Dernier coup','Démarrage','Activité','Récupération','Phase en cours','Effet autonome'].map(label=>'<th scope="col">'+label+'</th>').join('') +
      '</tr></thead><tbody>'+[1,2].map(side=>'<tr id="timingJ'+side+'"><th scope="row">J'+side+'</th>'+('<td>—</td>').repeat(6)+'</tr>').join('')+'</tbody></table></div>';
  }
  function updateTraining(status) {
    const {dummy,frames,position}=status.training;
    const select=document.getElementById('dummy');
    select.value=dummy;
    select.querySelector('[value="loop"]').disabled=!frames;
    select.querySelector('[value="record"]').textContent=frames && dummy!=='record' ? 'Remplacer la séquence (J2)' : 'Enregistrer J2';
    document.getElementById('dummyControls').hidden=dummy!=='record';
    const seconds=ticks=>dojoSeconds.format(ticks/60);
    document.getElementById('tapeStatus').textContent=dummy==='record' ? 'Commandes J2 · '+seconds(frames)+' s' :
      dummy==='loop' ? 'Boucle · '+seconds(position)+' / '+seconds(frames)+' s' : frames ? 'Séquence de '+seconds(frames)+' s' : '';
    training.dummy=dummy;
    const table=document.getElementById('dojoData');
    table.hidden=!status.training.timing;
    if (!table.hidden) status.training.moves.forEach((move,index)=>{
      const cells=document.getElementById('timingJ'+(index+1)).cells;
      const effects=[];
      if (move?.projectile) effects.push('Émission de '+move.projectile+' pas');
      if (move?.marker!=null) effects.push('Marqueur · '+move.marker+' pas restants');
      const values=move ? [move.name,move.start,move.active,move.recover,move.phase+(move.frame ? ' · '+move.frame : ''),effects.join(' / ') || '—'] :
        ['—','—','—','—','Repos','—'];
      values.forEach((value,i)=>{if (cells[i+1].textContent!==String(value)) cells[i+1].textContent=value;});
    });
  }
  function acceptsSecondPlayer() {
    return activeFight?.kind==='local' || (activeFight?.kind==='training' && !lessonRun && training.dummy==='record');
  }
  function fight(match) {
    if(['versus','arcade'].includes(match.mode)&&!match.introSeen&&!match.replay){
      const relationship=window.StrandRelationships?.get(match.p1,match.p2);
      if(relationship){
        stopFight();pendingDuel=match;
        setScreen('matchIntro','<section class="shell">'+back()+'<div class="pagehead"><div><div class="eyebrow">'+esc(match.title)+'</div><h1>Avant le duel</h1></div></div>'+
          '<p class="hint">'+esc(relationship.status)+' · '+esc(relationship.version)+'</p><div class="relationLines">'+relationship.lines.map(line=>'<blockquote><p class="speaker">'+esc(fighters[line.fighter]?.call||line.fighter)+'</p><p>'+esc(line.text)+'</p></blockquote>').join('')+'</div>'+
          stagePreview(match.stage)+stageRule(match.stage)+'<div class="actions">'+button('enterDuel','Combattre · passer l’échange '+arrow)+button('selection','Retour au choix','secondary')+button('controls','Commandes','secondary')+'</div></section>');
        return;
      }
    }
    stopFight();
    if (!engine) {
      setScreen('error','<section class="shell">' + back() + '<h1>Moteur indisponible</h1><p class="hint">Le fichier du duel n’a pas pu être chargé.</p></section>'); return;
    }
    activeFight = match;
    if(match.lesson)lessonRun={id:match.lesson,fighter:match.p1,session:lessonContent.createSession(match.lesson,match.p1),settled:false,renderStamp:null};
    const local = match.kind === 'local', watching=!!match.replay;
    const labels = match.labels || [fighters[match.p1].name,fighters[match.p2].name];
    setScreen('fight','<section class="fightShell'+(lessonRun?' lessonFight':'')+'"><div class="fightbar"><div><div class="kicker">' + (watching ? 'Relecture · ' : '') + match.title +
      '</div><b>' + stages[match.stage] + '</b></div><div class="tools">' + (watching ? button('leave','Retour au tableau','mini') : button('controls','Commandes','mini')) + button('pause','Pause','mini','id="pauseBtn"') +
      '</div></div>'+(lessonRun?lessonMarkup():'')+'<div class="screen"><canvas id="arena" tabindex="0" aria-label="Duel entre ' + esc(labels.join(' et ')) + '"></canvas>' +
      '<div id="pauseBox" class="pausebox'+(match.mode==='campaign'?' campaignPause':'')+'" hidden><h2>En pause</h2>' + (match.mode==='campaign'?'<p>Quitter ou fermer la page reprend ce chapitre depuis son début. Les chapitres précédents restent validés.</p>':lessonRun?'<p>Quitter reprend cet exercice depuis son début. Les validations précédentes restent acquises.</p>':'') + ambienceControl() + button('pause','Reprendre') + button('leave',watching ? 'Retour au tableau' : match.mode==='campaign'?'Retour à la campagne':lessonRun?'Retour au parcours':'Quitter le duel','secondary') +
      '</div></div><div class="combatNotes"><span>' + (watching ? labels.join('　 /　') : 'Commandes J1 · ' + labels[0] + '　 /　' + (local ? 'Commandes J2' : match.kind==='training' ? 'Mannequin' : 'IA') + ' · ' + labels[1]) + '</span>' +
      (match.kind === 'training' && !lessonRun ? trainingTools() : '') + '<span id="signal" aria-live="polite"></span></div>'+stageRule(match.stage)+'<div class="touchgroup">' +
      (watching ? '' : touchControls(1) + (local ? touchControls(2) : match.kind==='training' && !lessonRun ? '<div id="dummyControls" hidden>'+touchControls(2)+'</div>' : '')) + '</div></section>');
    const canvas = document.getElementById('arena'), signal = document.getElementById('signal');
    let phase = null;
    engine.start({canvas,p1:match.p1,p2:match.p2,stage:match.stage,mode:match.kind,difficulty:match.difficulty,seed:match.seed,record:match.mode==='tournament' && !watching,replay:match.replay,roundsToWin:match.mode === 'challenges' ? 1 : 2,startingVitality:match.vitality,parcel:match.parcel,training:lessonRun?{dummy:'record',timing:true,hitboxes:false}:training,
      outfits:['versus','training'].includes(match.mode) ? [config.outfit1,config.outfit2] : undefined,
      sound,ambienceVolume,reducedEffects,staticScenery,visuals:asset.fighters || {},onStatus(status) {
        if (match.lesson)updateLesson(status);else if (match.kind==="training") updateTraining(status);
        if (!signal || status.phase === phase) return;
        phase = status.phase;
        signal.textContent = phase==='transition'?'Passage vers le hangar · chronomètre suspendu':phase === 'finish' && !watching ? finishHint(status,local) : '';
      },onEnd(result) { if (activeFight === match) outcome(match,result); }
    });
  }
  function setPause(on) {
    if (!activeFight) return;
    if(lessonRun?.settled)return;
    paused = !!on;
    releaseControls(); activeEngine().pause(paused);
    const box=document.getElementById('pauseBox'),control=document.getElementById('pauseBtn');
    box.hidden = !paused;
    control.textContent = paused ? 'Reprendre' : 'Pause';
    if(activeFight.mode==='campaign'||lessonRun)(paused?box.querySelector('[data-act="pause"]'):control)?.focus({preventScroll:true});
  }
  function outcome(match, result) {
    if(match.mode==='campaign'){campaignOutcome(match,result);return;}
    stopFight();
    if (match.replay) {
      const recorded=cup.rounds.flat().find(item=>item.id===match.matchId);
      const scores=recorded?.players.map(slot=>result.rounds?.[match.slots.indexOf(slot)]);
      const consistent=!result.replayMismatch && recorded?.winner===match.slots[result.winner-1] && scores.every((v,i)=>v===recorded.score[i]);
      setScreen('result','<section class="shell"><div class="result"><div class="eyebrow">'+match.title+
        '</div><h1>'+(consistent ? 'Fin de la relecture' : 'Relecture incompatible')+'</h1><p>'+
        (consistent ? esc(match.labels[result.winner-1])+' l’emporte · '+result.rounds.join(' – ')+' manches' : 'Les entrées enregistrées ne reproduisent plus ce résultat.')+
        '</p><div class="actions">'+button('bracket','Retour au tableau')+'</div></div></section>');
      return;
    }
    const won = result.winner === 1;
    const winner = match.labels?.[result.winner - 1] || fighters[won ? match.p1 : match.p2].name;
    let buttons = '', extra = '';
    if (match.mode === 'tournament') {
      const bracketMatch = tournament.next(cup);
      if (bracketMatch && bracketMatch.id === match.matchId) {
        const score = match.slots[0] === bracketMatch.players[0] ? result.rounds.slice() : result.rounds.slice().reverse();
        tournament.record(cup,match.matchId,match.slots[result.winner - 1],score,result.replay);
        if (!save('cup',cup)) {
          delete bracketMatch.replay;
          const scoreSaved=save('cup',cup);
          if (result.replay) bracketMatch.replay=result.replay;
          extra='<p>'+(scoreSaved ? 'Score sauvegardé. La relecture est disponible pour cette session.' :
            'Ce navigateur conserve le tableau pour cette session uniquement.')+'</p>';
        }
      }
      buttons = button('bracket','Voir le tableau ' + arrow);
    } else if (match.mode === 'challenges') { trialResult(result); return;
    } else if (['arcade','story'].includes(match.mode)) {
      if (!won) {
        buttons = button('routeFight','Rejouer ce duel');
      } else if (match.mode === 'story') {
        const next = chapter() + 1;
        progress[match.p1] = next; save('chapters',progress);
        if (next === 3) unlock(match.p1,'ending');
        buttons = button(next === 3 ? 'ending' : next === 2 ? 'rival' : 'routeFight',next === 3 ? 'Voir l’épilogue ' + arrow : next === 2 ? 'Rencontrer le rival ' + arrow : 'Duel suivant ' + arrow);
      } else {
        arcadeStep++;
        if (arcadeStep < 3) buttons = button('routeFight','Duel suivant ' + arrow);
        else { extra = '<p>Les trois adversaires du parcours ont été vaincus.</p>'; buttons = button('start','Rejouer le parcours'); }
      }
    } else {
      buttons = button('start','Revanche') + button('selection','Changer de combattant','secondary');
    }
    setScreen('result','<section class="shell"><div class="result"><div class="eyebrow">' + match.title + '</div><h1>' +
      winner + ' l’emporte</h1><p>' + result.rounds.join(' – ') + ' manches · ' + (result.reason === 'time' ? 'Au temps' : 'K.-O.') +
      (result.finisher ? ' · ' + fighters[won ? match.p1 : match.p2].finisher : '') + '</p>' + extra + '<div class="actions">' +
      buttons + button('home','Accueil','secondary') + '</div></div></section>');
  }
  function controls() {
    if(manual.open)return;
    manualReturnFocus=document.activeElement;inputEditor?.destroy();releaseControls();
    resumeAfterManual = !!activeFight && !paused;
    if (resumeAfterManual) setPause(true);
    const campaignChapter=campaignContent?.chapters[campaign?.progress().run?.chapter||0];
    const bossMode=activeFight?.kind==='boss' || (!activeFight && (['boss','bossrush'].includes(config.mode)||config.mode==='campaign'&&campaignChapter?.kind==='boss'));
    const table = '<table><thead><tr><th>Action</th><th>Joueur 1</th>'+(bossMode?'':'<th>Joueur 2</th>')+'</tr></thead><tbody>' +
      keys.filter(item=>!bossMode||item.id!=='taunt').map(({id:action,title}) => '<tr><td>' + (bossMode?({throw:'Prendre / poser / livrer · frappe d’appui',finish:'Charge chirale'})[action]||title:title) + '</td><td>' + keyText(1,action) + '</td>'+(bossMode?'':'<td>' + keyText(2,action) + '</td>')+'</tr>').join('') +
      '</tbody></table>';
    const fighterIds = [activeFight?.p1 || (config.mode==='campaign'?campaignChapter?.p1:null) || config.p1];
    if (acceptsSecondPlayer() && !fighterIds.includes(activeFight.p2)) fighterIds.push(activeFight.p2);
    const moveLists = fighterIds.map(id => {
      const current = fighters[id];
      const rows = current.techniques.map(([direction, name, cost, effect]) =>
        '<tr><td>' + direction + '</td><td><strong>' + name + '</strong><br>' + effect + '</td><td>' + cost + '</td></tr>').join('');
      const sheet=window.StrandMovesData?.forFighter(id);
      const originalFrames=current.frameData?'<details class="moveDetails"><summary>Coups de Balise · pas de simulation à 60 Hz</summary><p>Neutre, avant et arrière utilisent la commande Signature ('+keyText(1,'special')+'). Les directions sont relatives à l’adversaire.</p><table><thead><tr><th>Action</th><th>Démarrage / activité / reprise</th><th>Coût</th><th>Dégâts</th></tr></thead><tbody>'+current.frameData.map(move=>'<tr><td>'+esc(move.name)+'</td><td>'+[move.start,move.active,move.recover].join(' / ')+'</td><td>'+move.cost+'</td><td>'+move.damage+'</td></tr>').join('')+'</tbody></table><p>Un ancrage dure quatre secondes. La garde et le saut répondent à la boucle ; les frappes basses peuvent détruire l’ancrage.</p></details>':'';
      const details=sheet?'<details class="moveDetails"><summary>Données du duel · '+esc(current.call)+'</summary><p>'+esc(sheet.summary)+'</p><p class="hint">'+esc(sheet.version)+' · '+esc(window.StrandMovesData.units||'Pas de simulation à 60 Hz')+'</p>'+
        [...sheet.common,...sheet.techniques].map(move=>'<article><h4>'+esc(move.name)+'</h4><p>'+esc(move.command)+'</p><dl>'+[
          ['Démarrage / activité / récupération',[move.startup,move.active,move.recovery].map(value=>value??'—').join(' / ')],['Coût',move.cost??'—'],
          ['Dégâts',move.damage],['Portée',move.range],['Garde',move.guard],['Enchaînement',move.cancel]
        ].map(([label,value])=>'<dt>'+esc(label)+'</dt><dd>'+esc(value??'—')+'</dd>').join('')+'</dl>'+(move.notes?.length?'<ul>'+move.notes.map(note=>'<li>'+esc(note)+'</li>').join('')+'</ul>':'')+'</article>').join('')+
        '<h4>Adversaire piloté par l’IA</h4><p>'+esc(sheet.ai?.summary||'')+'</p><ul>'+(sheet.ai?.notes||[]).concat(sheet.rules||[]).map(note=>'<li>'+esc(note)+'</li>').join('')+'</ul></details>':'';
      return '<h3>Techniques de ' + current.call + '</h3>' +
        '<table><thead><tr><th>Direction</th><th>Technique</th><th>Coût chiral</th></tr></thead><tbody>' + rows + '</tbody></table>'+(!bossMode?details+originalFrames:'');
    }).join('');
    document.getElementById('keys').innerHTML = '<div class="options">'+ambienceControl()+'</div><div class="commandSheet">'+table+'</div>' +
      (bossMode ? '<p class="hint">Les grandes rencontres se jouent avec J1. Les directions déplacent, font sauter et accroupir le porteur. Combine bas et garde contre les tirs bas. Les zones pointillées annoncent les attaques à esquiver : sors de la zone ou saute selon le signal. Léger et lourd frappent ; Signature utilise la technique directionnelle. Charge chirale ('+keyText(1,'finish')+') libère 70 points de jauge. La commande colis / appui ('+keyText(1,'throw')+') prend, pose ou livre un colis ; le dépôt est à gauche. Les grandes cibles résistent à la projection et au soulèvement. Échap met en pause. Les dégâts, durées et effets de projection des techniques ci-dessous sont adaptés aux grandes rencontres.</p>' :
      '<p class="hint">Appuie deux fois dans une direction pour une ruée. Combine bas et léger pour balayer, bas et lourd pour soulever. Sur impact, enchaîne léger, lourd et signature. La finalité s’ouvre au dernier K.-O. Échap met le duel en pause.</p><p class="hint">Geste de défi : '+keyText(1,'taunt')+' pour J1, '+keyText(2,'taunt')+' pour J2, ou L3. Depuis la position neutre au sol, tu t’exposes pendant 0,9 s : entrée, tenue, sortie. Aucun dégât, bonus ou protection. Un impact interrompt le geste ; les attaques ne peuvent pas l’annuler.</p>') +
      '<p class="hint">Maintiens la direction au moment de la signature ('+keyText(1,'special')+' pour J1'+(bossMode?'':', '+keyText(2,'special')+' pour J2')+'). « Avant » pointe toujours vers l’adversaire.</p>' + moveLists+'<div id="inputEditor"></div>';
    inputEditor=input.mountEditor(document.getElementById('inputEditor'),{settings:inputSettings,controller:inputController});
    manual.showModal();
  }
  manual.addEventListener('cancel',event=>{if(inputEditor?.isCapturing()){event.preventDefault();inputEditor.cancel();}});
  manual.addEventListener('close',() => {
    inputEditor?.destroy();inputEditor=null;releaseControls();
    if (resumeAfterManual && activeFight) setPause(false);resumeAfterManual=false;
    if(manualReturnFocus?.isConnected!==false)manualReturnFocus?.focus?.({preventScroll:true});manualReturnFocus=null;
  });
  function updateSound() {
    const label = document.getElementById('audio');
    label.textContent = sound ? 'Son activé' : 'Son coupé'; label.setAttribute('aria-pressed',String(sound));
    engine?.setSound(sound);
    bossEngine?.setSound(sound);
  }
  function updateEffects() {
    const control = document.getElementById('effects');
    control.setAttribute('aria-pressed',String(reducedEffects));
    control.title = reducedEffects ? 'Animations de décor et secousses réduites' : 'Activer la réduction des animations de décor et des secousses';
    engine?.setReducedEffects?.(reducedEffects);
    bossEngine?.setReducedEffects?.(reducedEffects);
    presentationController?.setReduced(reducedEffects);
  }
  function updateScenery() {
    const control=document.getElementById('scenery');
    if(control){control.setAttribute('aria-pressed',String(staticScenery));control.title=staticScenery?
      'Décor entièrement fixe ; les combattants et les annonces restent animés':'Figer le décor sans arrêter les combattants ni les annonces';}
    engine?.setStaticScenery?.(staticScenery);bossEngine?.setStaticScenery?.(staticScenery);
  }
  const sceneryControl=document.getElementById('scenery');
  if(sceneryControl)sceneryControl.onclick=()=>{staticScenery=!staticScenery;save('staticScenery',staticScenery);updateScenery();};
  document.getElementById('effects').onclick = () => { reducedEffects = !reducedEffects; save('reducedEffects',reducedEffects); updateEffects(); };
  motionPreference?.addEventListener('change',event => {
    if (read('reducedEffects',null) === null) { reducedEffects = event.matches; updateEffects(); }
  });
  document.getElementById('audio').onclick = () => { sound = !sound; save('sound',sound); updateSound(); };
  view.addEventListener('input',changeAmbience);
  manual.addEventListener('input',changeAmbience);
  document.getElementById('controlsLink').onclick = controls;
  document.getElementById('homeLink').onclick = () => { if (activeFight&&!lessonRun?.settled) setPause(true); else home(); };
  const actions = {
    startTrial, trialFight, retryTrial, home, gallery, stageGallery, selection, bracket, cupFight, cupReplay, routeFight, start, newCup, controls,
    lessons:()=>lessonSelection(),startLesson:el=>startLesson(el.dataset.lesson,el.dataset.fighter||lessonFighter),retryLesson:()=>{if(lessonRun)startLesson(lessonRun.id,lessonRun.fighter);},
    campaignSelection:()=>campaignSelection(),campaignNew,campaignStart,campaignResume,campaignAdvance,campaignFight,campaignGallery,
    campaignInterlude:()=>campaignScene(),campaignConclusion:()=>campaignScene(),campaignReplay:el=>campaignScene(el.dataset.scene),
    previousSceneFrame:()=>sceneStep(-1),nextSceneFrame:()=>sceneStep(1),
    enterDuel:()=>{const match=pendingDuel;pendingDuel=null;if(match)fight({...match,introSeen:true});},
    startBoss:() => startBoss(), resumeBoss:() => startBoss(true), bossSelection,
    newRush:()=>startRush(true),continueRush:()=>startRush(),rushSelection,rushResult:()=>rushResult(),
    retryRush:()=>{const run=bossEngine.rush.progress().run;if(run){config.p1=run.p1;config.difficulty=run.difficulty;config.outfit1=run.outfit;}startRush(true);},
    pickBoss:el => { config.boss=el.dataset.boss; bossSelection(); view.querySelector('[data-boss="'+config.boss+'"]')?.focus({preventScroll:true}); },
    exploreStage:el => { if (!Object.hasOwn(stages,el.dataset.stage)) return; config.stage = el.dataset.stage; config.mode = 'training'; selection(); },
    mode:el => { config.mode = el.dataset.mode; selection(); },
    pick:el => { config.p1 = el.dataset.id; selection(); view.querySelector('[data-id="' + config.p1 + '"]')?.focus({preventScroll:true}); },
    replay:el => scene(el.dataset.id,el.dataset.part,true),
    restartStory:() => { progress[config.p1] = 0; save('chapters',progress); openStory(); },
    ending:() => scene(config.p1,'ending'), rival:() => scene(config.p1,'rival'),
    pause:() => setPause(!paused),
    leave:() => { const mode = activeFight?.mode,lesson=!!lessonRun; stopFight(); if(lesson)lessonSelection();else if (mode === 'tournament') bracket(); else if(mode==='campaign')campaignSelection();else selection(); },
    resetTraining:() => {
      if (activeFight?.kind==='training') { releaseControls(); engine.setTraining({reset:true}); }
    }
  };
  view.addEventListener('click',event => {
    const target = event.target.closest('[data-act]'); if (target) actions[target.dataset.act]?.(target);
  });
  function previewCharacter(event){
    if(screen!=='select')return;
    const card=event.target.closest?.('[data-act="pick"]');
    if(card)presentationController?.preview(card.dataset.id);
  }
  view.addEventListener('pointerover',previewCharacter);
  view.addEventListener('focusin',previewCharacter);
  view.addEventListener('pointerout',event=>{
    if(event.target.closest?.('[data-act="pick"]')&&!event.relatedTarget?.closest?.('[data-act="pick"]'))presentationController?.restore();
  });
  view.addEventListener('focusout',event=>{
    if(event.target.closest?.('[data-act="pick"]')&&!event.relatedTarget?.closest?.('[data-act="pick"]'))presentationController?.restore();
  });
  view.addEventListener('change',event => {
    const target = event.target, key = target.dataset.option;
    if(target.matches?.('[data-lesson-fighter]')&&fighters[target.value]){
      lessonFighter=target.value;lessonSelection();view.querySelector('[data-lesson-fighter]')?.focus({preventScroll:true});
    } else if (key && Object.hasOwn(config,key)) {
      config[key] = target.value; selection();
      view.querySelector('[data-option="' + key + '"]')?.focus({preventScroll:true});
    } else if (['dummy','boxes','dojoTiming'].includes(target.id)) {
      if (target.id==='dummy') {
        inputController?.releaseAll(2);
        view.querySelectorAll('[data-p="2"].held').forEach(button=>button.classList.remove('held'));
        engine?.setTraining({dummy:target.value});
      } else {
        const field=target.id==='boxes' ? 'hitboxes' : 'timing';
        training[field]=target.checked; engine?.setTraining({[field]:target.checked});
      }
      view.focus({preventScroll:true});
    }
  });
  function editable(target) { return target.closest?.('input,textarea,select,[contenteditable="true"]'); }
  window.addEventListener('keydown',event => {
    if(screen==='scene'&&!manual.open&&!event.ctrlKey&&!event.altKey&&!event.metaKey&&!editable(event.target)&&['ArrowLeft','ArrowRight'].includes(event.key)){
      event.preventDefault();if(!event.repeat)sceneStep(event.key==='ArrowLeft'?-1:1);return;
    }
  });
  view.addEventListener('pointerdown',event => {
    const target = event.target.closest('[data-input]');
    if (!target || !activeFight || paused || !inputController.press('pointer:'+event.pointerId,Number(target.dataset.p),target.dataset.input)) return;
    event.preventDefault(); target.setPointerCapture(event.pointerId); target.classList.add('held');
  });
  function pointerRelease(event) {
    inputController.release('pointer:' + event.pointerId);
    const target = event.target.closest?.('[data-input]');
    if (target && !inputController.isHeld(Number(target.dataset.p),target.dataset.input))
      target.classList.remove('held');
  }
  for (const type of ['pointerup','pointercancel','lostpointercapture']) view.addEventListener(type,pointerRelease);
  function backgroundPause() { if (activeFight) { resumeAfterManual = false; setPause(true); } }
  window.addEventListener('blur',backgroundPause);
  document.addEventListener('visibilitychange',() => { if (document.hidden) backgroundPause(); });
  window.addEventListener('pagehide',stopFight);
  window.addEventListener('pageshow',event => { if (event.persisted && screen === 'fight') home(); });
  inputController=input.createController({settings:inputSettings,
    acceptsAction:action=>action!=='taunt'||activeFight?.kind!=='boss',
    accepts:player=>screen==='fight'&&!!activeFight&&!paused&&!manual.open&&!activeFight.replay&&!lessonRun?.settled&&(player===1||player===2&&acceptsSecondPlayer()),
    canPause:player=>screen==='fight'&&!!activeFight&&!manual.open&&!lessonRun?.settled&&(player===1||player===2&&acceptsSecondPlayer()),
    onInput:(player,action,down)=>{activeEngine()?.input(player,action,down);if(!down)view.querySelectorAll('[data-p="'+player+'"][data-input="'+action+'"]').forEach(button=>button.classList.remove('held'));},onPause:()=>setPause(!paused),
    onDeviceLost:backgroundPause,onSettingsChange:refreshInputLabels,
    onRelease:player=>view.querySelectorAll(player?'[data-p="'+player+'"].held':'.held').forEach(button=>button.classList.remove('held'))});
  engine?.setAmbienceVolume?.(ambienceVolume);
  bossEngine?.setAmbienceVolume?.(ambienceVolume);
  updateSound(); updateEffects(); updateScenery(); home();
  const initialQuery=typeof URLSearchParams==='function'?new URLSearchParams(window.location?.search||''):null;
  const initialStage=initialQuery?.get('ldmStage'),initialFighter=initialQuery?.get('ldmFighter'),initialBoss=initialQuery?.get('ldmBoss');
  if(isOriginalBoss(initialBoss)){
    config.boss=initialBoss;config.bossStage='recommended';config.mode='boss';selection();
  }else if(initialFighter&&originalIds.includes(initialFighter)){
    config.p1=initialFighter;config.stage='ldm-stage-digue-aval';config.mode='training';selection();
  }else if(initialStage&&window.StrandExtensionRuntime?.stages.includes(initialStage)&&Object.hasOwn(stages,initialStage)){
    config.stage=initialStage;config.mode='training';selection();
  }
})();
