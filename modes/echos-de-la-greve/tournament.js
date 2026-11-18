/* Entrants retain their identity when two controllers choose the same fighter. */
(() => {
  'use strict';
  function random(seed) {
    let state = seed >>> 0;
    return () => {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }
  function shuffle(values, roll) {
    const items = values.slice();
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(roll() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
  function create(config) {
    const roll = random(config.seed);
    const entrants = [];
    const chosen = [config.p1, config.p2].slice(0, config.humans);
    const allFighters = Object.keys(window.StrandContent.fighters);
    const fighters = [
      ...shuffle(allFighters.filter(id => !chosen.includes(id)), roll),
      ...shuffle(allFighters.filter(id => chosen.includes(id)), roll)
    ];
    for (let i = 0; i < config.count; i++) {
      const human = i < config.humans;
      const fighter = human ? [config.p1, config.p2][i] : fighters[(i - config.humans) % fighters.length];
      entrants.push({id:i, fighter, label:human ? 'J' + (i + 1) : 'IA ' + (i - config.humans + 1), human});
    }
    const draw = shuffle(entrants.map(entrant => entrant.id), roll);
    const size = config.count > 4 ? 8 : 4;
    const byes = shuffle(Array.from({length:size / 2}, (_, i) => i), roll).slice(0, size - entrants.length);
    const rounds = [];
    for (let pairs = size / 2; pairs >= 1; pairs /= 2) {
      rounds.push(Array.from({length:pairs}, (_, i) => ({
        players:[null, null], winner:null, score:null, bye:false,
        seed:Math.floor(roll() * 0x100000000), id:rounds.length + '-' + i
      })));
    }
    for (const [i, match] of rounds[0].entries()) {
      match.players = [draw.shift(), byes.includes(i) ? null : draw.shift()];
    }
    const cup = {version:1, seed:config.seed, difficulty:config.difficulty, entrants, rounds};
    const arenas = Object.keys(window.StrandContent.stages);
    for (const match of rounds.flat()) match.stage = arenas[match.seed % arenas.length];
    advance(cup);
    return cup;
  }
  function completed(cup, match, winner, score, bye = false) {
    if (match.winner !== null || !match.players.includes(winner) || winner === null) return;
    match.winner = winner;
    match.score = score;
    match.bye = bye;
    const [round, pair] = match.id.split('-').map(Number);
    if (round + 1 < cup.rounds.length) cup.rounds[round + 1][Math.floor(pair / 2)].players[pair % 2] = winner;
  }
  function advance(cup) {
    for (const [roundIndex, round] of cup.rounds.entries()) {
      for (const match of round) {
        if (match.winner !== null) continue;
        const [a,b] = match.players;
        if (a === null || b === null) {
          if (roundIndex === 0 && a !== null) completed(cup, match, a, null, true);
          continue;
        }
        if (cup.entrants[a].human || cup.entrants[b].human) continue;
        const roll = random(match.seed);
        const result = [0,0];
        while (Math.max(...result) < 2) result[roll() < .5 ? 0 : 1]++;
        completed(cup, match, result[0] === 2 ? a : b, result);
      }
    }
  }
  function next(cup) {
    return cup.rounds.flat().find(m => m.winner === null && m.players.every(id => id !== null)) || null;
  }
  function record(cup, matchId, winner, score) {
    const target = next(cup);
    if (!target || target.id !== matchId) return;
    completed(cup, target, winner, score);
    advance(cup);
  }
  window.StrandTournament = {create, next, record};
})();
