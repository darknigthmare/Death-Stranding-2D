/* Interface du défi Sam/Higgs. La simulation historique tourne à 60 pas par seconde. */
(() => {
  "use strict";
  const $ = selector => document.querySelector(selector);
  const app = $("#app");
  const dialog = $("#dialog");
  const menu = "../index.html";
  const commands = {
    ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down",
    KeyJ: "light", KeyK: "heavy", KeyL: "special", KeyI: "throw", KeyO: "super", Space: "guard"
  };
  const keyLabels = {left:"←", right:"→", up:"↑", down:"↓", guard:"Garde", light:"Léger", heavy:"Lourd", special:"Spécial", throw:"Prise", super:"Super"};
  const keystate = new Set();
  const pointers = new Map();
  let fighter = "sam", difficulty = 0.55, match = null, animation = 0;
  let sound = false, audio = null, last = null, debt = 0, finishFrames = 0, nodes = null;

  function clearInput() {
    keystate.clear();
    pointers.clear();
    document.querySelectorAll("[data-held=true]").forEach(el => delete el.dataset.held);
  }

  function stop() {
    cancelAnimationFrame(animation);
    clearInput();
    match = null;
    nodes = null;
    last = null;
    debt = 0;
  }

  function selection() {
    stop();
    $("#pause").hidden = true;
    app.innerHTML = '<section class="wrap"><header class="section-head"><div><span class="eyebrow">Les Duels de la Grève</span><h1>Duel originel</h1></div></header>' +
      '<div class="select-grid">' + Object.entries(Duels.ID).map(([id, info]) =>
        '<button class="fighter-card ' + id + '" data-choose="' + id + '" aria-pressed="false"><img alt="" src="../assets/fighters/' +
        (id === "sam" ? "sam-stance" : "higgs-action") + '.webp"><span class="card-label"><small>' + info.role + '</small><strong>' +
        info.short + '</strong></span></button>').join("") +
      '</div><div class="selection-foot"><a class="back" href="../index.html">Retour à Échos de la Grève</a><label>Difficulté <select id="difficulty">' +
      '<option value="0.25">Accessible</option><option value="0.55">Normale</option><option value="0.85">Difficile</option></select></label>' +
      '<button class="primary" id="start">Commencer le duel</button></div></section>';
    $("#difficulty").value = String(difficulty);
    function markChoice() {
      app.querySelectorAll("[data-choose]").forEach(button => {
        const active = button.dataset.choose === fighter;
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("selected", active);
      });
    }
    app.querySelectorAll("[data-choose]").forEach(button => button.onclick = () => {
      fighter = button.dataset.choose; markChoice();
    });
    markChoice();
    $("#start").onclick = () => { difficulty = Number($("#difficulty").value); start(); };
    app.focus({preventScroll:true});
  }

  function vital(id, i) {
    return '<div class="vital p' + (i + 1) + '" style="--tone:' + Duels.ID[id].color +
      '"><span class="who">' + (i === 0 ? "Joueur" : "IA") + '</span><span class="name">' + Duels.ID[id].short +
      '</span><span class="hp" role="meter" aria-label="Vie de ' + Duels.ID[id].short +
      '" aria-valuemin="0" aria-valuemax="100"><i></i></span><span class="meter" role="meter" aria-label="Énergie de ' + Duels.ID[id].short +
      '" aria-valuemin="0" aria-valuemax="100"><i></i></span><span class="roundmarks"></span></div>';
  }

  function touchGroup(keys) {
    return '<div>' + keys.map(key => '<button data-action="' + key + '" aria-label="' +
      ({left:"Reculer vers la gauche",right:"Avancer vers la droite",up:"Sauter",down:"S’accroupir"}[key] || keyLabels[key]) +
      '">' + keyLabels[key] + '</button>').join("") + '</div>';
  }

  function start() {
    stop();
    const other = fighter === "sam" ? "higgs" : "sam";
    match = Duels.newMatch(fighter, other);
    finishFrames = 0;
    $("#pause").hidden = false;
    app.innerHTML = '<section class="arena-shell"><header class="arena-top"><div class="eyebrow">Duel originel</div><span class="tiny">Deux manches gagnantes</span></header>' +
      '<div class="stage"><canvas width="1120" height="630" aria-label="Duel sur la Grève"></canvas><div class="hud">' + vital(fighter, 0) +
      '<div class="timer"></div>' + vital(other, 1) + '</div><div class="battle-msg" aria-live="polite"><b></b><small></small></div></div>' +
      '<div class="touch">' + touchGroup(["left","right","up","down","guard"]) + touchGroup(["light","heavy","special","throw","super"]) +
      '</div><p class="arena-foot">Flèches · J léger · K lourd · L spécial · I prise · O super · Espace garde · Échap pause</p><div class="result-actions" hidden></div></section>';
    nodes = {
      canvas: $("canvas"), timer: $(".timer"), message: $(".battle-msg b"), prompt: $(".battle-msg small"),
      bars: Array.from(app.querySelectorAll(".vital")).map(node => ({hp:node.querySelector(".hp"), meter:node.querySelector(".meter"), wins:node.querySelector(".roundmarks")}))
    };
    app.querySelectorAll("[data-action]").forEach(button => {
      button.addEventListener("pointerdown", event => {
        if (!match || dialog.open) return;
        event.preventDefault(); button.setPointerCapture(event.pointerId); pointers.set(event.pointerId, button.dataset.action); button.dataset.held = "true";
      });
      function release(event) {
        pointers.delete(event.pointerId);
        if (!Array.from(pointers.values()).includes(button.dataset.action)) delete button.dataset.held;
      }
      button.addEventListener("pointerup", release);
      button.addEventListener("lostpointercapture", release);
      button.addEventListener("pointercancel", release);
    });
    app.focus({preventScroll:true});
    draw();
    animation = requestAnimationFrame(frame);
  }

  function meter(node, amount) {
    const value = String(Math.round(amount));
    if (node.getAttribute("aria-valuenow") === value) return;
    node.setAttribute("aria-valuenow", value);
    node.firstElementChild.style.width = value + "%";
  }

  function draw() {
    const s = match;
    GrèveScene.draw(nodes.canvas, s, {finishFrame: finishFrames > 0 ? finishFrames : null});
    nodes.timer.textContent = Math.ceil(s.clock / 60);
    s.fighters.forEach((f, i) => {
      const bars = nodes.bars[i];
      meter(bars.hp, f.hp); meter(bars.meter, f.meter);
      bars.wins.textContent = "●".repeat(s.wins[i]) + "○".repeat(2 - s.wins[i]);
      bars.wins.setAttribute("aria-label", s.wins[i] + " manches gagnées");
    });
    let title = "", subtitle = "";
    if (s.phase === "ready") title = "Manche " + s.round;
    if (s.phase === "break") title = s.roundWinner < 0 ? "Égalité" : "Manche pour " + Duels.ID[s.fighters[s.roundWinner].id].short;
    if (s.phase === "finish") {
      title = "Dernier geste";
      subtitle = s.winner === 0 ? "L ou Spécial pour conclure" : "La Grève attend votre rival.";
    }
    if (s.phase === "result") title = s.ghost ? Duels.ID[s.fighters[s.winner].id].finish : "Duel terminé";
    if (nodes.message.textContent !== title) nodes.message.textContent = title;
    if (nodes.prompt.textContent !== subtitle) nodes.prompt.textContent = subtitle;
  }

  function tone(event) {
    if (!sound || !audio || audio.state !== "running") return;
    const frequency = {start:440, hit:105, guard:240, roundEnd:170, finished:315}[event.type];
    if (!frequency) return;
    const gain = audio.createGain(), oscillator = audio.createOscillator(), now = audio.currentTime;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.6, now + 0.09);
    gain.gain.setValueAtTime(0.07, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(now); oscillator.stop(now + 0.11);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }

  function frame(now) {
    if (!match || dialog.open) return;
    debt += last == null ? 0 : Math.min(100, now - last); last = now;
    while (debt >= 1000 / 60) {
      debt -= 1000 / 60;
      if (match.phase === "result") { finishFrames++; continue; }
      const input = {};
      for (const code of keystate) input[commands[code]] = true;
      for (const action of pointers.values()) input[action] = true;
      Duels.tick(match, [input, Duels.cpu(match, 1, difficulty)]);
      match.events.forEach(tone);
    }
    draw();
    if (match.phase === "result" && (!match.ghost || finishFrames >= 68)) {
      const panel = $(".result-actions");
      panel.hidden = false;
      panel.innerHTML = '<h2>' + Duels.ID[match.fighters[match.winner].id].short + ' remporte le duel · ' + match.wins.join(" – ") +
        '</h2><div class="btn-row"><button class="primary" id="again">Revanche</button><button class="ghost" id="choose">Changer de combattant</button><a class="back" href="../index.html">Retour à Échos de la Grève</a></div>';
      $("#again").onclick = start; $("#choose").onclick = selection;
      $("#pause").hidden = true; $(".touch").hidden = true; $(".arena-foot").hidden = true;
      $("#again").focus({preventScroll:true});
      return;
    }
    animation = requestAnimationFrame(frame);
  }

  function openDialog(help) {
    if (dialog.open) return;
    cancelAnimationFrame(animation); clearInput(); last = null; debt = 0;
    $("#dialog-body").innerHTML = help ? '<h2 id="dialog-title">Commandes</h2>' +
      '<table class="keys"><tr><th>Geste</th><th>Commande</th></tr>' +
      [["Déplacement / ruée","← ou → / double direction"],["Saut / accroupissement","↑ / ↓"],["Garde","Espace ou arrière"],
       ["Coup léger / lourd","J / K"],["Balayage","↓ + J"],["Attaque aérienne","↑ puis J ou K"],["Prise","I"],
       ["Technique / finalité","L"],["Super (75 % d’énergie)","O"]].map(([a,b])=>'<tr><td>'+a+'</td><td>'+b+'</td></tr>').join("") + '</table>'
      : '<h2 id="dialog-title">Pause</h2><p>Le duel est suspendu.</p><a class="back" href="../index.html">Retour à Échos de la Grève</a>';
    $("#close-dialog").textContent = match && match.phase !== "result" ? "Reprendre" : "Fermer";
    dialog.showModal();
  }

  dialog.addEventListener("close", () => {
    clearInput(); last = null; debt = 0;
    if (match && $(".result-actions").hidden) animation = requestAnimationFrame(frame);
  });
  $("#brand").onclick = () => location.assign(menu);
  $("#pause").onclick = () => openDialog(false);
  $("#help").onclick = () => openDialog(true);
  $("#close-dialog").onclick = () => dialog.close();
  $("#sound").onclick = async () => {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      audio ||= new Audio();
      if (!sound) await audio.resume();
      sound = !sound;
    } catch { sound = false; }
    $("#sound").textContent = sound ? "Son actif" : "Son coupé";
    $("#sound").setAttribute("aria-pressed", String(sound));
    if (sound) tone({type:"start"});
  };
  window.addEventListener("keydown", event => {
    if (dialog.open || !match || !$(".result-actions").hidden || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.code === "Escape") {event.preventDefault(); openDialog(false); return;}
    if (commands[event.code]) {event.preventDefault(); keystate.add(event.code);}
  });
  window.addEventListener("keyup", event => keystate.delete(event.code));
  function backgroundPause() {
    clearInput();
    if (match && $(".result-actions").hidden && !dialog.open) openDialog(false);
  }
  window.addEventListener("blur", backgroundPause);
  document.addEventListener("visibilitychange", () => { if (document.hidden) backgroundPause(); });
  selection();
})();
