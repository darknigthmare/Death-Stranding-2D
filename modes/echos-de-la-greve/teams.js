/* Local team screen: the canonical duel engine runs all fighting. */
(() => {
  'use strict';
  const engine=window.StrandFight,input=window.StrandInput,content=window.StrandContent,art=window.StrandAssets;
  const ids=['sam','fragile','higgs','cliff','mule','diehardman','mama','heartman'];
  const $=id=>document.getElementById(id),esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const saveKey='echos.teams.v1',settings=input.createSettings();
  let running=false,paused=false,sound=true,reduced=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,controller,editor=null,savedPoint=null,lastConfig=null;
  const message=text=>{$('teamMessage').textContent=text;};
  const selected=()=>[0,1].map(side=>[0,1].map(slot=>$('teamMember'+side+slot).value));
  function selection(){
    $('teamSelection').innerHTML=[0,1].map(side=>'<section class="teamCamp"><h2>Équipe '+(side+1)+'</h2><div class="teamPair">'+[0,1].map(slot=>{
      const initial=[['sam','fragile'],['higgs','mule']][side][slot];
      return '<div class="teamMember"><label>'+(slot?'Réserve':'Premier membre')+'<select id="teamMember'+side+slot+'">'+ids.map(id=>'<option value="'+id+'"'+(id===initial?' selected':'')+'>'+esc(content.fighters[id].name)+'</option>').join('')+'</select></label><img id="teamPreview'+side+slot+'" alt=""><p id="teamSupport'+side+slot+'"></p></div>';
    }).join('')+'</div></section>').join('');
    const arenas=content.arenas||content.stages;
    $('teamStage').innerHTML=Object.entries(arenas).filter(([id])=>!content.stageLinks?.[id]).map(([id,value])=>'<option value="'+esc(id)+'">'+esc(value.title||id)+'</option>').join('');
    $('teamStage').value='shore';updateSelection();
  }
  function updateSelection(){
    selected().forEach((pair,side)=>pair.forEach((id,slot)=>{
      $('teamPreview'+side+slot).src=art.fighters[id];$('teamPreview'+side+slot).alt=content.fighters[id].name;
      $('teamSupport'+side+slot).textContent='Appui : '+engine.team.names[id]+'.';
    }));
    const valid=engine.team.validSelection(selected());$('teamStart').disabled=!valid;
    message(valid?'':'Choisis deux kits différents dans chaque équipe. Un miroir entre les deux camps est possible.');
  }
  function controls(){
    $('teamTouch').innerHTML=[1,2].filter(p=>p===1||lastConfig?.mode==='local').map(player=>'<section><h3>Joueur '+player+' · clavier, manette ou toucher</h3><div class="teamButtons">'+input.actions.filter(action=>action.id!=='taunt').concat([{id:'taunt',short:'Relais'}]).map(action=>
      '<button type="button" data-player="'+player+'" data-action="'+action.id+'" aria-label="J'+player+' · '+esc(action.id==='finish'?'Appui / finalité':action.id==='taunt'?'Relais':action.title)+'">'+(action.id==='finish'?'Appui / fin':action.short)+'<small>'+esc(settings.label(player,action.id))+'</small></button>').join('')+'</div></section>').join('');
  }
  function accepts(player){return running&&!paused&&!$('teamManual').open&&engine.snapshot()?.phase!=='ended'&&(player===1||lastConfig?.mode==='local');}
  function translate(action){return action==='taunt'?'tag':action==='finish'&&engine.snapshot()?.phase==='fight'?'assist':action;}
  function status(state){
    if(!state?.teams)return;
    $('teamReadout').innerHTML=state.teams.map((team,i)=>'<span>Équipe '+(i+1)+' : '+team.members.map((f,index)=>esc(content.fighters[f.id].call||f.id)+(index===team.active?' (actif)':'')+' '+f.hp+' PV').join(' · ')+' · Cohésion '+Math.floor(team.cohesion)+'</span>').join('');
    $('teamBattleState').textContent=state.phase==='ended'?state.winner?'Victoire de l’équipe '+state.winner:'Égalité — double K.-O.':state.paused?'Combat en pause':state.sudden?'Départage : prochain avantage net':'Relais de liaison · '+state.time+' s';
  }
  function end(result){
    controller.releaseAll();paused=false;$('teamPause').disabled=true;$('teamSave').disabled=true;
    $('teamBattleState').textContent=result.winner?'Victoire de l’équipe '+result.winner+' — '+(result.reason==='time'?'vitalité cumulée':result.reason==='sudden'?'avantage décisif':'deux adversaires K.-O.'):'Égalité — double K.-O. simultané';
    try{window.localStorage.removeItem(saveKey);savedPoint=null;$('teamResume').hidden=true;}catch{}
  }
  function start(point=null){
    const config=point?{teams:point.selection,stage:point.stage,mode:point.mode,roundsToWin:point.toWin,difficulty:point.difficulty}:
      {teams:selected(),stage:$('teamStage').value,mode:$('teamOpponent').value,roundsToWin:1,difficulty:$('teamDifficulty').value};
    if(!engine.team.validSelection(config.teams)){message('Chaque camp nécessite deux kits différents.');return;}
    lastConfig=config;running=true;paused=false;$('teamSetup').hidden=true;$('teamArena').hidden=false;$('teamPause').disabled=false;$('teamSave').disabled=false;
    engine.start({...config,canvas:$('teamCanvas'),sound,reducedEffects:reduced,staticScenery:reduced,onStatus:status,onEnd:end});
    controls();
    if(point){
      if(!engine.team.restore(point)){engine.stop();running=false;$('teamArena').hidden=true;$('teamSetup').hidden=false;message('Cette sauvegarde est incompatible ; tes autres progressions restent disponibles.');return;}
      paused=true;
    }
    $('teamPause').textContent=paused?'Reprendre':'Pause';$('teamCanvas').focus();
  }
  function pause(value){if(!running||engine.snapshot()?.phase==='ended')return;controller?.releaseAll();paused=!!value;engine.pause(paused);$('teamPause').textContent=paused?'Reprendre':'Pause';}
  function back(save=false){
    if(save){
      pause(true);const point=engine.team.checkpoint();
      if(!engine.team.validCheckpoint(point)){message('Sauvegarde impossible : état de combat incomplet.');$('teamBattleState').textContent='Sauvegarde impossible ; partie conservée en pause.';return;}
      try{window.localStorage.setItem(saveKey,JSON.stringify(point));savedPoint=point;$('teamResume').hidden=false;message('Partie enregistrée. La reprise conserve les quatre membres, les ressources et les objets.');}
      catch{$('teamBattleState').textContent='Stockage indisponible : partie conservée en pause. Tu peux reprendre sans quitter.';return;}
    }
    controller?.releaseAll();engine.stop();running=false;paused=false;$('teamArena').hidden=true;$('teamSetup').hidden=false;$('teamStart').focus();
  }
  selection();
  try{const value=JSON.parse(window.localStorage.getItem(saveKey)||'null');if(value&&engine.team.validCheckpoint(value)&&value.state.phase!=='ended'){savedPoint=value;$('teamResume').hidden=false;}else if(value)message('Une sauvegarde incompatible a été conservée sans être chargée.');}catch{message('La sauvegarde locale est indisponible ; le combat reste jouable.');}
  controller=input.createController({settings,accepts,canPause:()=>running&&!$('teamManual').open,onInput:(p,a,down)=>engine.input(p,translate(a),down),onPause:()=>pause(!paused),onDeviceLost:()=>pause(true),onSettingsChange:controls});
  $('teamSelection').addEventListener('change',updateSelection);
  $('teamStart').addEventListener('click',()=>start());$('teamResume').addEventListener('click',()=>start(savedPoint));
  $('teamPause').addEventListener('click',()=>pause(!paused));$('teamSave').addEventListener('click',()=>back(true));$('teamNew').addEventListener('click',()=>back(false));
  $('teamEffects').addEventListener('click',()=>{reduced=!reduced;$('teamEffects').setAttribute('aria-pressed',String(reduced));engine.setReducedEffects(reduced);engine.setStaticScenery(reduced);});
  $('teamEffects').setAttribute('aria-pressed',String(reduced));
  $('teamAudio').addEventListener('click',()=>{sound=!sound;$('teamAudio').setAttribute('aria-pressed',String(sound));$('teamAudio').textContent=sound?'Son activé':'Son coupé';engine.setSound(sound);});
  $('teamControls').addEventListener('click',()=>{pause(true);editor?.destroy();editor=input.mountEditor($('teamInputEditor'),{settings,controller});$('teamManual').showModal();});
  $('teamManual').addEventListener('close',()=>{editor?.destroy();editor=null;controls();if(running)$('teamPause').focus();});
  $('teamTouch').addEventListener('pointerdown',event=>{const button=event.target.closest('[data-action]');if(!button)return;event.preventDefault();if(controller.press('pointer:'+event.pointerId,Number(button.dataset.player),button.dataset.action)){button.classList.add('held');button.setPointerCapture?.(event.pointerId);}});
  const release=event=>{controller.release('pointer:'+event.pointerId);const button=event.target.closest?.('[data-action]');button?.classList.remove('held');};
  window.addEventListener('pointerup',release);window.addEventListener('pointercancel',release);
  $('teamTouch').addEventListener('click',event=>{if(event.detail)return;const button=event.target.closest('[data-action]');if(button&&accepts(Number(button.dataset.player))){const p=Number(button.dataset.player),action=translate(button.dataset.action);engine.input(p,action,true);engine.input(p,action,false);}});
  window.addEventListener('blur',()=>pause(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)pause(true);});
  window.addEventListener('pagehide',()=>{controller.destroy();engine.stop();});
})();
