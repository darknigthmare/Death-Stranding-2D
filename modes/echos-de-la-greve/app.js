(() => {
  'use strict';
  const {fighters, stages, modes} = window.StrandContent;
  const tournament = window.StrandTournament;
  const asset = window.StrandAssets || {};
  const engine = window.StrandFight;
  const view = document.getElementById('view');
  const manual = document.getElementById('manual');
  const ids = Object.keys(fighters);
  const scenes = {intro:'Introduction', rival:'Rivalité', ending:'Épilogue'};
  const icon = {
    arcade:'<path d="M4 17h16v4H4zM9 16l3-8"/><circle cx="13" cy="5" r="2.5"/>',
    versus:'<path d="M3 5l13 13m-2-1 4 3 2-2-3-4M21 5l-5 5m-8 4-4 4 2 2 4-4"/>',
    tournament:'<path d="M3 4h5v5H3m0 6h5v5H3M8 7h4v11H8m4-6h7"/>',
    training:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>'
  };
  const config = {mode:'story', p1:'sam', p2:'higgs', stage:'shore', difficulty:'normal', opponent:'cpu', count:'4', humans:'1'};
  const held = new Map();
  let screen = '', activeFight = null, paused = false, resumeAfterManual = false, arcadeStep = 0;
  let training = {dummy:'idle',hitboxes:false};
  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem('echos.v1.' + key)) ?? fallback; }
    catch { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem('echos.v1.' + key, JSON.stringify(value)); } catch { /* Private browsing can disable storage. */ }
  }
  let sound = read('sound',true);
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
  const arrow = '<span aria-hidden="true" class="arrow">↗</span>';
  const back = () => button('home','← Accueil','back');
  function setScreen(name, markup) {
    screen = name;
    document.body.classList.toggle('playing', name === 'fight');
    view.innerHTML = markup;
    view.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
  function releaseControls() {
    for (const {player,action} of held.values()) engine?.input(player,action,false);
    held.clear();
    view.querySelectorAll('.held').forEach(button => button.classList.remove('held'));
  }
  function stopFight() {
    releaseControls();
    if (activeFight) engine?.stop();
    activeFight = null; paused = false;
  }
  function home() {
    stopFight();
    const copy = {arcade:'Trois adversaires jusqu’au rival.', versus:'Duel contre l’IA ou à deux en local.', tournament:'Tableau à élimination directe.', training:'Mannequin, garde et zones de touche.'};
    const tiles = Object.keys(copy).map(key =>
      '<button class="tile" data-act="mode" data-mode="' + key + '"><span class="symbol"><svg aria-hidden="true" viewBox="0 0 24 24">' + icon[key] + '</svg></span>' +
      '<strong>' + modes[key] + '</strong><small>' + copy[key] + '</small>' + arrow + '</button>').join('');
    setScreen('home','<section class="hero"' + backdrop(asset.hero || asset.story?.['shore-prologue'] || asset.stages?.shore) + '><div><div class="eyebrow">Simulation chirale</div>' +
      '<h1>Échos de<br>la Grève</h1><p>Quatre combattants suivent les traces d’un colis, d’un parapluie, d’un masque ou d’une radio.</p>' +
      '<div class="actions">' + button('mode','Jouer l’histoire ' + arrow,'darkbtn','data-mode="story"') + '</div></div></section>' +
      '<section class="shelf"><div class="shelfhead"><h2>Modes de combat</h2></div><div class="tiles">' + tiles + '</div><div class="archives">' +
      button('gallery','Galerie des scènes','mini') + '<a class="mini" href="duel-originel/index.html">Duel originel · Sam / Higgs</a>' +
      '<a class="mini campaignLink" href="../../JOUER.html">Retour à la campagne ↗</a></div></section>');
  }
  function stageFor(id) { return fighters[id].route[0][1]; }
  function art(id, part) {
    const scene = asset.story || {};
    const fallback = part === 'rival' ? fighters[id].route[2][1] : stageFor(id);
    return scene[id + '-' + part] ||
      (part === 'rival' && ['sam','higgs'].includes(id) ? scene['sam-higgs-rival'] : null) || asset.stages?.[fallback] || asset.hero;
  }
  function nameMap() { return Object.fromEntries(ids.map(id => [id, fighters[id].name])); }
  function chapter() { const n = progress[config.p1]; return Number.isInteger(n) && n >= 0 && n <= 3 ? n : 0; }
  function selection() {
    stopFight();
    const {mode,p1} = config;
    const character = fighters[p1];
    const cards = ids.map(id => {
      const f = fighters[id];
      const portrait = asset.portraits?.[id], stance = asset.fighters?.[id];
      return '<button class="char ' + (portrait ? 'portrait' : stance ? '' : 'landscape') + '" data-act="pick" data-id="' + id +
        '" aria-pressed="' + (id === p1) + '">' + image(portrait || stance || asset.stages?.[stageFor(id)]) +
        '<span class="charlabel"><strong>' + f.call + '</strong><small>' + f.role + '</small></span></button>';
    }).join('');
    const isSolo = mode !== 'versus' || config.opponent !== 'local';
    let fields = '';
    if (mode === 'versus') fields += choose('opponent','Adversaire',{cpu:'Intelligence artificielle',local:'Joueur 2 · local'});
    if (mode === 'tournament') {
      fields += choose('count','Participants',{'4':'4 entrants','6':'6 entrants · 2 exemptions','8':'8 entrants'});
      fields += choose('humans','Joueurs locaux',{'1':'1 joueur','2':'2 joueurs'});
    }
    if (['versus','training'].includes(mode) || (mode === 'tournament' && config.humans === '2'))
      fields += choose('p2',mode === 'training' ? 'Mannequin' : 'Combattant adverse / J2',nameMap());
    if (['versus','training'].includes(mode)) fields += choose('stage','Arène',stages);
    if (isSolo) fields += choose('difficulty','Difficulté',{easy:'Débutant',normal:'Porteur',hard:'Vétéran'});
    const route = character.route.map(([rival,place]) => fighters[rival].call + ' · ' + stages[place]).join('　→　');
    const startLabel = mode === 'story' && chapter() > 0 && chapter() < 3 ? 'Reprendre le duel ' + (chapter() + 1) :
      ({story:'Ouvrir l’histoire',arcade:'Lancer le parcours',tournament:cup ? 'Créer un nouveau tableau' : 'Tirer le tableau',versus:'Lancer le duel',training:'Entrer dans l’arène'})[mode];
    setScreen('select','<section class="shell">' + back() + '<div class="pagehead"><div><div class="eyebrow">' + modes[mode] +
      '</div><h1>Choix du combattant</h1></div></div><div class="chars">' + cards + '</div><div class="options">' + fields +
      '</div><div class="brief"><strong>' + character.special + '</strong> · ' + character.tip + '</div>' +
      (['story','arcade'].includes(mode) ? '<p class="montage">' + (mode === 'story' ? '<b>' + character.story + '</b><br>' : '') + route + '</p>' : '') +
      '<div class="actions">' + (mode === 'tournament' && cup ? button('bracket',cup.rounds.at(-1)[0].winner === null ? 'Reprendre le tableau' : 'Revoir le tableau') : '') +
      button('start',startLabel + ' ' + arrow,mode === 'tournament' && cup ? 'secondary' : 'primary') +
      (mode === 'story' && chapter() > 0 && chapter() < 3 ? button('restartStory','Recommencer l’histoire','secondary') : '') + '</div></section>');
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
  function scene(id, part, fromGallery = false) {
    const character = fighters[id], [title,body] = character.scenes[part];
    if (!fromGallery) unlock(id,part);
    const next = fromGallery ? button('gallery','Retour à la galerie') : part === 'ending' ? button('home','Terminer le parcours') : button('routeFight','Entrer dans l’arène ' + arrow);
    setScreen('scene','<section class="story-art"' + backdrop(art(id,part)) + '><div class="story-copy"><div class="eyebrow">' +
      character.call + ' / ' + character.story + '</div><div class="speaker">' + scenes[part] + '</div><h1>' + title + '</h1><p>' + body +
      '</p><div class="actions">' + next + '</div></div></section><div class="routebar">' + character.route.map(([opponent,place]) => fighters[opponent].call + ' · ' + stages[place]).join('　→　') + '</div>');
  }
  function gallery() {
    const unlocked = ids.flatMap(id => Object.keys(scenes).filter(part => archive[id + '-' + part]).map(part =>
      '<button data-act="replay" data-id="' + id + '" data-part="' + part + '">' + image(art(id,part)) + '<strong>' + fighters[id].scenes[part][0] + '</strong><small>' + fighters[id].call + ' · ' + scenes[part] + '</small></button>'));
    setScreen('gallery','<section class="shell">' + back() + '<h1>Galerie des scènes</h1>' + (unlocked.length ?
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
        (match.bye ? '<small>Qualification directe</small>' : '') + '</div>';
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
    const slots = match.players.slice();
    if (!cup.entrants[slots[0]].human || (cup.entrants[slots[1]].human && slots[1] === 0)) slots.reverse();
    const [a,b] = slots.map(id => cup.entrants[id]);
    const bothHuman = a.human && b.human;
    // Match-side controllers are reassigned on screen; an isolated human always uses J1.
    fight({p1:a.fighter, p2:b.fighter, stage:Object.keys(stages)[match.seed % 3], difficulty:cup.difficulty,
      kind:bothHuman ? 'local' : 'cpu', mode:'tournament', title:roundName(cup.rounds[Number(match.id.split('-')[0])]),
      labels:[bracketName(a),bracketName(b)], matchId:match.id, slots});
  }
  function routeFight() {
    const index = config.mode === 'story' ? chapter() : arcadeStep;
    const [p2,stage] = fighters[config.p1].route[index];
    fight({...config, p2, stage, kind:'cpu', title:modes[config.mode] + ' · Duel ' + (index + 1) + '/3'});
  }
  function start() {
    switch (config.mode) {
      case 'story': openStory(); return;
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
  function newCup() {
    cup = tournament.create({...config, count:Number(config.count), humans:Number(config.humans), seed:Math.floor(Math.random() * 0x100000000)});
    save('cup',cup); bracket();
  }
  const keys = [
    ['left','Gauche',['q','a'],['ArrowLeft'],'Q / A','←','←'], ['right','Droite',['d'],['ArrowRight'],'D','→','→'],
    ['up','Saut',['z','w'],['ArrowUp'],'Z / W','↑','↑'], ['down','Bas',['s'],['ArrowDown'],'S','↓','↓'],
    ['light','Coup léger',['f'],['j'],'F','J','Léger'], ['heavy','Coup lourd',['g'],['k'],'G','K','Lourd'],
    ['special','Signature',['h'],['l'],'H','L','Spécial'], ['guard','Garde',['r'],['u'],'R','U','Garde'],
    ['throw','Projection',['t'],['i'],'T','I','Prise'], ['finish','Finalité',['y'],['o'],'Y','O','Fin']
  ];
  const keymap = new Map();
  for (const [action,,first,second] of keys) {
    for (const key of first) keymap.set(key,{player:1,action});
    for (const key of second) keymap.set(key,{player:2,action});
  }
  function touchControls(player) {
    function control(item) {
      const [action,title,,,,,label] = item;
      return '<button type="button" aria-label="J' + player + ' · ' + title + '" data-p="' + player + '" data-input="' + action + '">' + label + '</button>';
    }
    return '<div class="touchRow"><small>J' + player + '</small><div class="touch"><div>' + keys.slice(0,4).map(control).join('') +
      '</div><div>' + keys.slice(4).map(control).join('') + '</div></div></div>';
  }
  function trainingTools() {
    const options = {idle:'Immobile',guard:'En garde',cpu:'IA active'};
    return '<label>Mannequin <select id="dummy">' + Object.entries(options).map(([value,label]) => '<option value="' + value + '"' +
      (value === training.dummy ? ' selected' : '') + '>' + label + '</option>').join('') +
      '</select></label><label><input type="checkbox" id="boxes"' + (training.hitboxes ? ' checked' : '') + '>Zones de touche</label>' + button('resetTraining','Replacer au centre','mini');
  }
  function fight(match) {
    stopFight();
    if (!engine) {
      setScreen('error','<section class="shell">' + back() + '<h1>Moteur indisponible</h1><p class="hint">Le fichier du duel n’a pas pu être chargé.</p></section>'); return;
    }
    activeFight = match;
    const local = match.kind === 'local';
    const labels = match.labels || [fighters[match.p1].name,fighters[match.p2].name];
    setScreen('fight','<section class="fightShell"><div class="fightbar"><div><div class="kicker">' + match.title +
      '</div><b>' + stages[match.stage] + '</b></div><div class="tools">' + button('controls','Commandes','mini') + button('pause','Pause','mini','id="pauseBtn"') +
      '</div></div><div class="screen"><canvas id="arena" aria-label="Duel entre ' + esc(labels.join(' et ')) + '"></canvas>' +
      '<div id="pauseBox" class="pausebox" hidden><h2>En pause</h2>' + button('pause','Reprendre') + button('leave','Quitter le duel','secondary') +
      '</div></div><div class="combatNotes"><span>Commandes J1 · ' + labels[0] + '　 /　' + (local ? 'Commandes J2' : 'IA') + ' · ' + labels[1] + '</span>' +
      (match.kind === 'training' ? trainingTools() : '<span id="signal" aria-live="polite"></span>') + '</div><div class="touchgroup">' +
      touchControls(1) + (local ? touchControls(2) : '') + '</div></section>');
    const canvas = document.getElementById('arena'), signal = document.getElementById('signal');
    let phase = null;
    engine.start({canvas,p1:match.p1,p2:match.p2,stage:match.stage,mode:match.kind,difficulty:match.difficulty,roundsToWin:2,training,
      sound,visuals:asset.fighters || {},onStatus(status) {
        if (!signal || status.phase === phase) return;
        phase = status.phase;
        signal.textContent = phase === 'finish' ? 'Finalité disponible · ' + (status.winner === 1 ? 'J1 · Y' : local ? 'J2 · O' : 'IA') : '';
      },onEnd(result) { if (activeFight === match) outcome(match,result); }
    });
  }
  function setPause(on) {
    if (!activeFight) return;
    paused = !!on;
    releaseControls(); engine.pause(paused);
    document.getElementById('pauseBox').hidden = !paused;
    document.getElementById('pauseBtn').textContent = paused ? 'Reprendre' : 'Pause';
  }
  function outcome(match, result) {
    stopFight();
    const won = result.winner === 1;
    const winner = match.labels?.[result.winner - 1] || fighters[won ? match.p1 : match.p2].name;
    let buttons = '', extra = '';
    if (match.mode === 'tournament') {
      const bracketMatch = tournament.next(cup);
      if (bracketMatch && bracketMatch.id === match.matchId) {
        const score = match.slots[0] === bracketMatch.players[0] ? result.rounds.slice() : result.rounds.slice().reverse();
        tournament.record(cup,match.matchId,match.slots[result.winner - 1],score); save('cup',cup);
      }
      buttons = button('bracket','Voir le tableau ' + arrow);
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
    resumeAfterManual = !!activeFight && !paused;
    if (resumeAfterManual) setPause(true);
    const table = '<table><thead><tr><th>Action</th><th>Joueur 1</th><th>Joueur 2</th></tr></thead><tbody>' +
      keys.map(([,title,,,first,second]) => '<tr><td>' + title + '</td><td>' + first + '</td><td>' + second + '</td></tr>').join('') +
      '</tbody></table>';
    const fighterId = activeFight?.p1 || config.p1;
    const current = fighters[fighterId];
    const techniques = current.techniques.map(([direction, name, cost, effect]) =>
      '<tr><td>' + direction + '</td><td><strong>' + name + '</strong><br>' + effect + '</td><td>' + cost + '</td></tr>').join('');
    document.getElementById('keys').innerHTML = table +
      '<p class="hint">Appuie deux fois dans une direction pour une ruée. Combine bas et léger pour balayer, bas et lourd pour soulever. Sur impact, enchaîne léger, lourd et signature. La finalité s’ouvre au dernier K.-O. Échap met le duel en pause.</p>' +
      '<h3>Techniques de ' + current.call + '</h3><p class="hint">Maintiens la direction au moment de la signature (H pour J1, L pour J2). « Avant » pointe toujours vers l’adversaire.</p>' +
      '<table><thead><tr><th>Direction</th><th>Technique</th><th>Coût chiral</th></tr></thead><tbody>' + techniques + '</tbody></table>';
    manual.showModal();
  }
  manual.addEventListener('close',() => { if (resumeAfterManual && activeFight) setPause(false); resumeAfterManual = false; });
  function updateSound() {
    const label = document.getElementById('audio');
    label.textContent = sound ? 'Son activé' : 'Son coupé'; label.setAttribute('aria-pressed',String(sound));
    engine?.setSound(sound);
  }
  document.getElementById('audio').onclick = () => { sound = !sound; save('sound',sound); updateSound(); };
  document.getElementById('controlsLink').onclick = controls;
  document.getElementById('homeLink').onclick = () => { if (activeFight) setPause(true); else home(); };
  const actions = {
    home, gallery, selection, bracket, cupFight, routeFight, start, newCup, controls,
    mode:el => { config.mode = el.dataset.mode; selection(); },
    pick:el => { config.p1 = el.dataset.id; selection(); view.querySelector('[data-id="' + config.p1 + '"]')?.focus({preventScroll:true}); },
    replay:el => scene(el.dataset.id,el.dataset.part,true),
    restartStory:() => { progress[config.p1] = 0; save('chapters',progress); openStory(); },
    ending:() => scene(config.p1,'ending'), rival:() => scene(config.p1,'rival'),
    pause:() => setPause(!paused),
    leave:() => { const mode = activeFight?.mode; stopFight(); if (mode === 'tournament') bracket(); else selection(); },
    resetTraining:() => { if (activeFight?.kind === 'training') fight({...activeFight}); }
  };
  view.addEventListener('click',event => {
    const target = event.target.closest('[data-act]'); if (target) actions[target.dataset.act]?.(target);
  });
  view.addEventListener('change',event => {
    const target = event.target, key = target.dataset.option;
    if (key && Object.hasOwn(config,key)) {
      config[key] = target.value; selection();
      view.querySelector('[data-option="' + key + '"]')?.focus({preventScroll:true});
    } else if (target.id === 'dummy' || target.id === 'boxes') {
      training = {dummy:document.getElementById('dummy').value,hitboxes:document.getElementById('boxes').checked};
      engine?.setTraining(training);
    }
  });
  function press(token, player, action) {
    if (held.has(token)) return;
    held.set(token,{player,action}); engine.input(player,action,true);
  }
  function release(token) {
    const binding = held.get(token);
    if (!binding) return;
    held.delete(token);
    if (![...held.values()].some(x => x.player === binding.player && x.action === binding.action))
      engine?.input(binding.player,binding.action,false);
  }
  function editable(target) { return target.matches?.('input,textarea,select,[contenteditable="true"]'); }
  window.addEventListener('keydown',event => {
    if (screen !== 'fight' || manual.open || !activeFight || event.ctrlKey || event.altKey || event.metaKey) return;
    if (event.key === 'Escape') { event.preventDefault(); if (!event.repeat) setPause(!paused); return; }
    if (paused || editable(event.target)) return;
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const binding = keymap.get(key);
    if (!binding || (binding.player === 2 && activeFight.kind !== 'local')) return;
    event.preventDefault();
    if (!event.repeat) press('key:' + (event.code || key),binding.player,binding.action);
  });
  window.addEventListener('keyup',event => release('key:' + (event.code || (event.key.length === 1 ? event.key.toLowerCase() : event.key))));
  view.addEventListener('pointerdown',event => {
    const target = event.target.closest('[data-input]');
    if (!target || !activeFight || paused) return;
    event.preventDefault(); target.setPointerCapture(event.pointerId); target.classList.add('held');
    press('pointer:' + event.pointerId,Number(target.dataset.p),target.dataset.input);
  });
  function pointerRelease(event) {
    release('pointer:' + event.pointerId);
    const target = event.target.closest?.('[data-input]');
    if (target && ![...held.values()].some(bind => bind.player === Number(target.dataset.p) && bind.action === target.dataset.input))
      target.classList.remove('held');
  }
  for (const type of ['pointerup','pointercancel','lostpointercapture']) view.addEventListener(type,pointerRelease);
  function backgroundPause() { if (activeFight) { resumeAfterManual = false; setPause(true); } }
  window.addEventListener('blur',backgroundPause);
  document.addEventListener('visibilitychange',() => { if (document.hidden) backgroundPause(); });
  window.addEventListener('pagehide',stopFight);
  window.addEventListener('pageshow',event => { if (event.persisted && screen === 'fight') home(); });
  updateSound(); home();
})();
