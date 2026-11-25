/* Pure, read-only reference: native details work without listeners or saved state. */
(function(host){
  'use strict';
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const list=values=>'<ul>'+values.map(value=>'<li>'+esc(value)+'</li>').join('')+'</ul>';
  const number=value=>String(Number(Number(value).toFixed(2))).replace('.',',');
  function table(caption,head,rows){return '<div class="bossGuideTable" tabindex="0" role="region" aria-label="'+esc(caption)+'"><table><caption>'+esc(caption)+'</caption><thead><tr>'+head.map(h=>'<th scope="col">'+esc(h)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map((cell,i)=>i===0?'<th scope="row">'+esc(cell)+'</th>':'<td>'+esc(cell)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';}
  function render(options={}){
    const data=host.StrandBossData;if(!data)return '';
    const own=(object,key)=>typeof key==='string'&&Object.hasOwn(object,key);
    const selected=data.forEncounter(options.boss)||data.encounters[0];
    const player=own(data.fighters,options.p1)?options.p1:'sam';
    const difficulty=own(data.difficulties,options.difficulty)?options.difficulty:'normal';
    const context=own(data.modes,options.context)?options.context:'boss',mode=data.modes[context];
    function damageText(e,fighter){
      const parts=[];
      const impact=(base,label)=>e.exposure>0?label+' : '+data.damage(base,selected.id,fighter,true)+' PV, exposition appliquée avant la touche (base '+base+')':label+' : '+data.damage(base,selected.id,fighter,false)+' PV / '+data.damage(base,selected.id,fighter,true)+' exposé (base '+base+')';
      for(const m of e.melee)parts.push(impact(m.baseDamage,'mêlée')+', portée '+m.reach+', déséquilibre '+m.stagger);
      for(const q of e.shots)parts.push(impact(q.baseDamage,'projectile')+', '+q.width+' × '+q.height+', vitesse '+number(q.velocity)+', durée '+q.ttl+', délai '+q.delay);
      if(e.shield)parts.push('contre prêt '+e.shield+' pas');
      if(e.invulnerability)parts.push('invulnérabilité '+e.invulnerability+' pas');
      if(e.displacement)parts.push((e.displacement>0?'avance ':'recul ')+Math.abs(e.displacement)+' unités, limité à la piste');
      if(e.exposure)parts.push('exposition '+e.exposure+' pas');
      if(e.markerAfter)parts.push('repère de '+e.markerAfter.ttl+' pas');
      return parts.join(' ; ')||'Aucun dégât direct';
    }
    function actionRow(action,fighter){
      const cargo=action.compatibility[selected.id]==='interaction-colis';
      return [action.name+' · '+action.command,cargo?'0':String(action.cost),cargo?'Interaction immédiate si disponible':action.timing.firstEffect+' / '+action.timing.clearAt+' / '+action.timing.nextUncancelledStartAt,cargo?'Prendre, poser ou livrer un colis ; aucune frappe d’appui.':damageText(action.effects,fighter)];
    }
    function actionNotes(action,fighter){
      const variants=action.variants.filter(v=>v.id!=='crate'||fighter==='mule');
      return '<details class="bossGuideAction"><summary>'+esc(action.name)+' · conditions et variantes</summary>'+list(action.notes)+variants.map(v=>'<p><strong>'+esc(({return:'Retour au repère',release:'Déclenchement de la mémoire',anchor:'Depuis son ancrage',crate:'Avec sa propre caisse'})[v.id]||v.id)+' :</strong> '+esc(damageText(v.effects,fighter))+'.</p>').join('')+'</details>';
    }
    const selectedFighter=data.fighters[player];
    let html='<details class="bossGuide"><summary>Guide des six rencontres · '+esc(selected.name)+'</summary><div class="bossGuideBody">';
    html+='<p class="bossGuideLead">Fiches du simulateur Échos de la Grève. Profil affiché : <strong>'+esc(selectedFighter.name)+' · '+esc(data.difficulties[difficulty])+'</strong>. Les dégâts et commandes ci-dessous sont ceux des grandes rencontres.</p>';
    html+='<section><h3>'+esc(mode.title)+' · règles de départ et de reprise</h3>'+list(mode.notes);
    if(mode.order)html+='<p><strong>Ordre de la série :</strong> '+esc(mode.order.map(id=>data.forEncounter(id).name).join(' → '))+'.</p>';
    const starting=context==='bossrush'?'Début de série : 120 PV ; ensuite PV restants +20, plafond 120. Énergie et garde : 100 à chaque nouveau Boss.':context==='campaign'?'Début ou reprise du chapitre : 120 PV · énergie 100 · garde 100.':'Nouvelle rencontre : 120 PV · énergie 100 · garde 100. Une reprise conserve les ressources sauvegardées.';
    html+='</section><p class="bossGuideKey"><strong>'+esc(starting)+'</strong> Garde ordinaire : 2 PV et 18 de garde par impact. Charge chirale : une attaque de 70 points d’énergie pendant le combat.</p>';
    html+='<details><summary>Défense, ressources et lecture des délais</summary>'+list(data.rules);
    html+='<p><strong>E / D / prochaine :</strong> première exécution, fin de l’action, puis premier nouveau démarrage sans interruption. 60 pas = 1 seconde de simulation. Une mêlée s’exécute une seule fois ; les projectiles peuvent continuer après l’action. Les repères perdent déjà un pas à la fin de leur création.</p></details>';
    html+='<section><h3>Choisir sa réponse à chaque rencontre</h3>';
    for(const encounter of data.encounters){
      const e=encounter;
      html+='<details class="bossGuideEncounter"'+(e.id===selected.id?' open':'')+'><summary>'+esc(e.name)+' · '+esc(e.hp[difficulty].join(' puis '))+' PV · '+e.seconds+' s</summary>';
      html+='<p>'+esc(e.goal)+'</p><p><strong>Victoire :</strong> '+esc(e.success)+' <strong>Échec :</strong> '+esc(e.failures.join(' ; '))+'.</p>';
      html+=table('Repères de '+e.name,['Difficulté','PV par vague','Annonce phase 1 / 2'],Object.keys(data.difficulties).map(id=>[data.difficulties[id],e.hp[id].join(' puis '),e.tell[id].join(' / ')+' pas']));
      html+='<p><strong>Cycle fixe :</strong> '+esc(e.patterns.map(id=>data.patterns[id].title).join(' → '))+'. <strong>Ouverture :</strong> '+e.normalRecovery+' pas de récupération naturelle ; 90 après rupture. Le noyau exposé multiplie les dégâts par 1,35 à la place du blindage normal ×'+number(e.armour)+'.</p>';
      html+=list(e.notes);
      for(const id of [...new Set(e.patterns)]){
        const p=data.patterns[id];
        html+='<details><summary>'+esc(p.title)+' · '+p.damageByDifficulty[difficulty]+' PV si non bloqué</summary><p><strong>'+esc(p.response)+'</strong></p><p>'+esc(p.details)+'</p>';
        html+=table('Dangers de '+p.title,['Phase','Phase d’attaque','Dangers émis'],[1,2].map(tier=>{const t=p.phases[tier];return [String(tier),t.active+' pas',t.hazards.length?t.hazards.map(h=>h.kind+' : '+h.width+'×'+h.height+', vitesse '+number(h.speed)+', durée '+h.ttl+', délai '+h.delay+(h.low?', bas':'')+(h.blockable?', gardable':', non gardable')).join(' ; '):'Collision du corps pendant la charge'];}));
        html+='</details>';
      }
      html+='</details>';
    }
    html+='</section><details><summary>Colis et dépôt · seuils utiles</summary><p>Prendre : colis au sol à moins de 75 unités et pieds à moins de 20 du sol. Livrer : porter un colis, x ≤155 et hauteur des pieds &lt;8. Ailleurs, la commande pose le colis. Elle exige aucune action, garde ou immobilisation en cours.</p><p>Un seul colis à la fois ; vitesse ×0,76. Intégrité commune 100. Un coup non bloqué pendant le portage coûte 12 d’intégrité. Dans le Convoi, un tir bas arrivé au dépôt coûte 7 et une charge profonde 18. Le temps continue pendant la collecte et entre les deux vagues.</p></details>';
    html+='<section><h3>Actions contre '+esc(selected.name)+'</h3><p>Les dégâts affichés comparent le blindage normal et le noyau exposé ; ils sont arrondis avec la puissance du kit. Les deux contacts d’une charge ou d’une salve ne sont pas garantis. La portée de mêlée s’ajoute au rayon de la cible.</p>';
    const common=data.actions.filter(a=>a.owner==='common');
    html+='<details><summary>Six commandes communes · '+esc(selectedFighter.call)+'</summary>'+table('Actions communes de '+selectedFighter.call,['Action','Coût','E / D / prochaine','Effets'],common.map(a=>actionRow(a,player)))+common.map(a=>actionNotes(a,player)).join('')+'</details>';
    for(const [id,fighter] of Object.entries(data.fighters)){
      const actions=data.actions.filter(a=>a.owner===id);
      html+='<details class="bossGuideKit"'+(id===player?' open':'')+'><summary>'+esc(fighter.name)+' · puissance ×'+number(fighter.power)+'</summary>'+table('Signatures de '+fighter.call,['Action','Coût','E / D / prochaine','Effets'],actions.map(a=>actionRow(a,id)))+actions.map(a=>actionNotes(a,id)).join('')+'</details>';
    }
    html+='</section><p class="bossGuideLimit">Ces fiches décrivent des règles du simulateur. Une commande disponible ne garantit pas son contact : position, délai, repère et immersion de la Baleine restent déterminants. Les huit kits sont disponibles sur les six rencontres ; la commande Appui devient Colis sur les camions.</p></div></details>';
    return html;
  }
  host.StrandBossGuide=Object.freeze({render});
})(window);
