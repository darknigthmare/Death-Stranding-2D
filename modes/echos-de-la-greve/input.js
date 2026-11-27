/* Local input preferences and device arbitration. Engines/replays receive only
 * the existing logical actions; physical keys and pads never enter checkpoints. */
(() => {
  'use strict';
  const host=window, storeKey='echos.input.v1';
  const actions=[
    {id:'left',title:'Gauche',short:'←',pad:'Croix / stick vers la gauche'},
    {id:'right',title:'Droite',short:'→',pad:'Croix / stick vers la droite'},
    {id:'up',title:'Saut',short:'Saut',pad:'Croix / stick haut · bouton du bas (A / ×)'},
    {id:'down',title:'Bas',short:'↓',pad:'Croix / stick bas'},
    {id:'light',title:'Coup léger',short:'Léger',pad:'Bouton de gauche (X / □)'},
    {id:'heavy',title:'Coup lourd',short:'Lourd',pad:'Bouton du haut (Y / △)'},
    {id:'special',title:'Signature',short:'Spécial',pad:'Bouton de droite (B / ○)'},
    {id:'guard',title:'Garde',short:'Garde',pad:'Épaule ou gâchette gauche (LB / L1 · LT / L2)'},
    {id:'throw',title:'Projection · Colis / Appui en Boss',short:'Prise',pad:'Épaule droite (RB / R1)'},
    {id:'finish',title:'Finalité',short:'Fin',pad:'Gâchette droite (RT / R2)'},
    {id:'taunt',title:'Geste de défi · duels locaux',short:'Défi',pad:'Clic du stick gauche (L3) · duels locaux'}
  ];
  const actionIds=actions.map(a=>a.id), ids=['1','2','3'],deadzones=[.15,.2,.25,.3,.4,.5,.6];
  const defaults={
    1:{left:['q','a'],right:['d'],up:['z','w'],down:['s'],light:['f'],heavy:['g'],special:['h'],guard:['r'],throw:['t'],finish:['y'],taunt:['b']},
    2:{left:['ArrowLeft'],right:['ArrowRight'],up:['ArrowUp'],down:['ArrowDown'],light:['j'],heavy:['k'],special:['l'],guard:['u'],throw:['i'],finish:['o'],taunt:['p']}
  };
  const names={ArrowLeft:'←',ArrowRight:'→',ArrowUp:'↑',ArrowDown:'↓',' ':'Espace',Enter:'Entrée',Backspace:'Retour arrière',Delete:'Suppr.',Insert:'Inser.',Home:'Début',End:'Fin',PageUp:'Page ↑',PageDown:'Page ↓'};
  const clone=value=>JSON.parse(JSON.stringify(value));
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function normaliseKey(value) {
    if(typeof value!=='string')return null;
    if(value==='Spacebar')value=' ';
    if(Object.hasOwn(names,value))return value;
    return [...value].length===1 && !/[\p{C}\p{Z}]/u.test(value) ? value.toLocaleLowerCase('fr-FR') : null;
  }
  const keyLabel=key=>names[key]||String(key).toLocaleUpperCase('fr-FR');
  const editable=target=>!!target?.closest?.('input,textarea,select,[contenteditable="true"]');
  function fresh() {return {version:1,active:'1',profiles:ids.map(id=>({id,name:'Profil '+id,bindings:clone(defaults)})),gamepad:{enabled:true,deadzone:.25},networkPlayer:1};}
  function collision(bindings) {
    const seen=new Map();
    for(const player of [1,2])for(const action of actionIds)for(const key of bindings[player][action]) {
      if(seen.has(key))return {key,first:seen.get(key),second:{player,action}};
      seen.set(key,{player,action});
    }
    return null;
  }
  function valid(data) {
    if(!data||data.version!==1||!ids.includes(data.active)||![1,2].includes(data.networkPlayer)||!Array.isArray(data.profiles)||data.profiles.length!==3||
      typeof data.gamepad?.enabled!=='boolean'||!deadzones.includes(data.gamepad.deadzone))return false;
    return data.profiles.every((profile,i)=>profile?.id===ids[i] && typeof profile.name==='string' && profile.name.trim().length>0 && profile.name.length<=28 &&
      [1,2].every(player=>actionIds.every(action=>{
        const keys=profile.bindings?.[player]?.[action];
        return Array.isArray(keys)&&keys.length>=1&&keys.length<=2&&keys.every(key=>normaliseKey(key)===key);
      }))&&!collision(profile.bindings));
  }
  function upgrade(value) {
    // Preserve every existing binding, profile name and active profile. Select a
    // free key for the added command instead of replacing a user's remapping.
    const next=clone(value);let changed=false;
    if(next?.version!==1 || !Array.isArray(next.profiles))return {value:next,changed};
    for(const profile of next.profiles){
      if(!profile?.bindings?.[1] || !profile?.bindings?.[2])continue;
      const used=new Set([1,2].flatMap(player=>Object.values(profile.bindings[player]).flat()));
      for(const player of [1,2])if(profile.bindings[player].taunt===undefined){
        const candidates=[...defaults[player].taunt,...'bpcvnm1234567890abcdefghijklmnopqrstuvwxyz,.;/!@#$%^&*()-_=+[]{}?'];
        const key=candidates.find(key=>!used.has(key)&&normaliseKey(key)===key);
        if(key){profile.bindings[player].taunt=[key];used.add(key);changed=true;}
      }
    }
    return {value:next,changed};
  }
  function createSettings(storage) {
    let data=fresh(),message='',saved=true;const listeners=new Set();
    try {
      storage=storage===undefined?host.localStorage:storage;
      const raw=storage?.getItem(storeKey);
      if(raw!=null){const migrated=upgrade(JSON.parse(raw));if(valid(migrated.value)){
        data=migrated.value;
        if(migrated.changed){message='Geste de défi ajouté sur des touches libres. Tes commandes existantes sont conservées.';storage.setItem(storeKey,JSON.stringify(data));}
      }else message='Le profil enregistré était invalide. Les commandes par défaut sont chargées.';}
      if(!storage)saved=false;
    }catch{message='Les commandes sont disponibles pour cette session ; la sauvegarde locale est inaccessible.';saved=false;}
    const current=()=>data.profiles.find(profile=>profile.id===data.active);
    function persist(next) {
      if(!valid(next))return {ok:false,message:'Ce profil est incomplet ou contient des touches en double.'};
      data=next;saved=true;
      try{if(!storage)throw Error('Storage unavailable');storage.setItem(storeKey,JSON.stringify(data));}catch{saved=false;}
      message=saved?'Commandes enregistrées.':'Commandes appliquées pour cette session ; la sauvegarde locale est inaccessible.';
      for(const listener of listeners)listener();
      return {ok:true,saved,message};
    }
    function find(key,bindings=current().bindings) {
      for(const player of [1,2])for(const action of actionIds){const slot=bindings[player][action].indexOf(key);if(slot!==-1)return {player,action,slot};}
      return null;
    }
    const describe=bind=>'J'+bind.player+' · '+actions.find(a=>a.id===bind.action).title;
    return {
      state:()=>clone(data),profile:()=>clone(current()),status:()=>({saved,message}),valid,
      label:(player,action)=>current().bindings[player]?.[action]?.map(keyLabel).join(' / ')||'—',find,
      subscribe(listener){listeners.add(listener);return ()=>listeners.delete(listener);},
      bind(player,action,slot,value){
        const key=normaliseKey(value);
        if(![1,2].includes(player)||!actionIds.includes(action)||![0,1].includes(slot))return {ok:false,message:'Commande inconnue.'};
        if(!key)return {ok:false,message:'Cette touche est réservée à la navigation. Choisis une lettre, un chiffre, une flèche ou une touche de saisie.'};
        const other=find(key);
        if(other&&(other.player!==player||other.action!==action||other.slot!==slot))return {ok:false,collision:other,message:keyLabel(key)+' est déjà attribuée à '+describe(other)+'. Libère cette touche ou choisis-en une autre.'};
        const next=clone(data),target=next.profiles.find(p=>p.id===next.active).bindings[player][action];
        target[slot]=key;return persist(next);
      },
      removeSecondary(player,action){
        if(![1,2].includes(player)||!actionIds.includes(action))return {ok:false,message:'Commande inconnue.'};
        const next=clone(data);next.profiles.find(p=>p.id===next.active).bindings[player][action].splice(1);return persist(next);
      },
      activate(id){if(!ids.includes(id))return {ok:false,message:'Profil inconnu.'};const next=clone(data);next.active=id;return persist(next);},
      rename(name){name=String(name).trim();if(!name||name.length>28)return {ok:false,message:'Donne un nom de 1 à 28 caractères.'};const next=clone(data);next.profiles.find(p=>p.id===next.active).name=name;return persist(next);},
      restore(player){
        const next=clone(data),target=next.profiles.find(p=>p.id===next.active);
        if(player===1||player===2)target.bindings[player]=clone(defaults[player]);else target.bindings=clone(defaults);
        const duplicate=collision(target.bindings);
        if(duplicate)return {ok:false,message:'Restauration impossible : '+keyLabel(duplicate.key)+' serait partagée par '+describe(duplicate.first)+' et '+describe(duplicate.second)+'. Restaure les deux joueurs ou libère cette touche.'};
        return persist(next);
      },
      setGamepad(enabled,deadzone=data.gamepad.deadzone){const next=clone(data);next.gamepad={enabled:!!enabled,deadzone:Number(deadzone)};return persist(next);},
      setNetworkPlayer(player){const next=clone(data);next.networkPlayer=Number(player);return persist(next);},
      reload(){
        try{const raw=storage?.getItem(storeKey),migrated=raw==null?{value:fresh(),changed:false}:upgrade(JSON.parse(raw)),next=migrated.value;if(!valid(next))return false;data=clone(next);saved=true;if(migrated.changed)storage.setItem(storeKey,JSON.stringify(data));message='Profil actualisé depuis un autre onglet.';for(const listener of listeners)listener();return true;}catch{return false;}
      }
    };
  }
  function createController(options={}) {
    const settings=options.settings||createSettings(),doc=host.document,held=new Map(),pads=new Map(),statusListeners=new Set();
    let blurred=false,destroyed=false,raf=0,deviceStatus={available:typeof host.navigator?.getGamepads==='function',connected:0,unsupported:0};
    const accepts=player=>!destroyed&&!blurred&&!doc?.hidden&&!editable(doc?.activeElement)&&!!options.accepts?.(player);
    const canPause=player=>!destroyed&&!blurred&&!doc?.hidden&&!editable(doc?.activeElement)&&!!options.canPause?.(player);
    const emit=(p,a,down)=>options.onInput?.(p,a,down);
    function release(token) {
      const binding=held.get(token);if(!binding)return false;held.delete(token);
      if(![...held.values()].some(item=>item.player===binding.player&&item.action===binding.action))emit(binding.player,binding.action,false);
      return true;
    }
    function press(token,player,action) {
      if(held.has(token)||!accepts(player)||!actionIds.includes(action)||options.acceptsAction?.(action)===false)return false;
      const exists=[...held.values()].some(item=>item.player===player&&item.action===action);
      held.set(token,{player,action});if(!exists)emit(player,action,true);return true;
    }
    function releaseAll(player) {
      for(const [token,binding] of [...held])if(!player||binding.player===player)release(token);
      for(const item of pads.values())if(!player||item.player===player)item.neutralRequired=true;
      options.onRelease?.(player);
    }
    const token=event=>'key:'+(event.code||normaliseKey(event.key)||event.key);
    function keydown(event) {
      if(event.defaultPrevented||event.isComposing||event.ctrlKey||event.altKey||event.metaKey||editable(event.target))return;
      if(['Enter',' '].includes(event.key)&&event.target?.closest?.('button,a,summary'))return;
      if(event.key==='Escape'&&canPause(1)){event.preventDefault();if(!event.repeat){releaseAll();options.onPause?.(1);}return;}
      const key=normaliseKey(event.key),binding=key&&settings.find(key);
      if(!binding||!accepts(binding.player)||options.acceptsAction?.(binding.action)===false)return;
      event.preventDefault();if(!event.repeat)press(token(event),binding.player,binding.action);
    }
    function keyup(event){release(token(event));}
    function changeStatus(next){if(JSON.stringify(next)===JSON.stringify(deviceStatus))return;deviceStatus=next;for(const fn of statusListeners)fn({...deviceStatus});}
    function readPad(pad,deadzone) {
      const down=index=>!!pad.buttons?.[index]?.pressed||Number(pad.buttons?.[index]?.value)>.5;
      const x=Number.isFinite(pad.axes?.[0])?pad.axes[0]:0,y=Number.isFinite(pad.axes?.[1])?pad.axes[1]:0;
      return {left:down(14)||x < -deadzone,right:down(15)||x > deadzone,up:down(12)||y < -deadzone||down(0),down:down(13)||y > deadzone,
        light:down(2),heavy:down(3),special:down(1),guard:down(4)||down(6),throw:down(5),finish:down(7),taunt:down(10),pause:down(9)};
    }
    function poll() {
      if(destroyed)return;
      let found=[],available=typeof host.navigator?.getGamepads==='function';const config=settings.state(),players=options.gamepadPlayers?.()||[1,2];
      try{found=Array.from(host.navigator?.getGamepads?.()||[]).filter(pad=>pad&&pad.connected!==false);}
      catch{available=false;}
      const supported=config.gamepad.enabled?found.filter(pad=>pad.mapping==='standard'):[];
      for(const [index,item] of pads)if(!supported.some(pad=>pad.index===index)){
        for(const key of [...held.keys()])if(key.startsWith('pad:'+index+':'))release(key);
        pads.delete(index);if(config.gamepad.enabled)options.onDeviceLost?.(item.player);
      }
      for(const pad of supported){
        let item=pads.get(pad.index);
        if(!item){const used=new Set([...pads.values()].map(p=>p.slot));const slot=players.findIndex((_,i)=>!used.has(i));if(slot===-1)continue;
          item={slot,player:players[slot],neutralRequired:true,pause:false};pads.set(pad.index,item);}
        if(item.player!==players[item.slot]){releaseAll(item.player);item.player=players[item.slot];item.neutralRequired=true;}
        const state=readPad(pad,config.gamepad.deadzone),active=accepts(item.player),pauseAllowed=canPause(item.player);
        if(!active&&!pauseAllowed){for(const key of [...held.keys()])if(key.startsWith('pad:'+pad.index+':'))release(key);item.neutralRequired=true;item.pause=state.pause;continue;}
        if(item.neutralRequired){if(!Object.values(state).some(Boolean)){item.neutralRequired=false;item.pause=false;}continue;}
        if(state.pause&&!item.pause&&pauseAllowed){item.pause=true;releaseAll();options.onPause?.(item.player);continue;}
        item.pause=state.pause;
        for(const action of actionIds){const key='pad:'+pad.index+':'+action;if(active&&state[action])press(key,item.player,action);else release(key);}
      }
      changeStatus({available,connected:found.filter(p=>p.mapping==='standard').length,unsupported:found.filter(p=>p.mapping!=='standard').length});
    }
    function disconnect(event){const index=event.gamepad?.index,item=pads.get(index);if(item){
      for(const token of [...held.keys()])if(token.startsWith('pad:'+index+':'))release(token);pads.delete(index);options.onDeviceLost?.(item.player);
    }poll();}
    function frame(){poll();if(!destroyed&&typeof host.navigator?.getGamepads==='function')raf=host.requestAnimationFrame?.(frame)||0;}
    function blur(){blurred=true;releaseAll();}
    function focus(){blurred=false;releaseAll();}
    function focusin(event){if(event.target?.closest?.('input,textarea,select,button,a,summary,[contenteditable="true"]'))releaseAll();}
    function visibility(){if(doc.hidden)releaseAll();}
    function storage(event){if(event.key===storeKey||event.key===null)settings.reload();}
    const bindings=[[host,'keydown',keydown],[host,'keyup',keyup],[host,'blur',blur],[host,'focus',focus],[host,'storage',storage],
      [host,'gamepadconnected',poll],[host,'gamepaddisconnected',disconnect],[doc,'focusin',focusin],[doc,'visibilitychange',visibility]];
    for(const [target,type,fn]of bindings)target?.addEventListener?.(type,fn);
    const unsubscribe=settings.subscribe(()=>{releaseAll();options.onSettingsChange?.();});
    if(typeof host.navigator?.getGamepads==='function')frame();
    return {settings,press,release,releaseAll,poll,held:()=>[...held.entries()].map(([token,binding])=>({token,...binding})),
      isHeld:(player,action)=>[...held.values()].some(item=>item.player===player&&item.action===action),
      status:()=>({...deviceStatus}),subscribeStatus(fn){statusListeners.add(fn);return()=>statusListeners.delete(fn);},
      destroy(){releaseAll();destroyed=true;host.cancelAnimationFrame?.(raf);unsubscribe();for(const [target,type,fn]of bindings)target?.removeEventListener?.(type,fn);statusListeners.clear();}
    };
  }
  function mountEditor(container,{settings,controller,network=false}={}) {
    if(!container||!settings)return {destroy(){},isCapturing:()=>false,cancel(){}};
    const visibleActions=actions.filter(action=>!network || action.id!=='taunt');
    let player=network?settings.state().networkPlayer:1,capture=null,removed=false;
    container.innerHTML='<section class="inputEditor" aria-label="Configurer les commandes"><div data-input-body></div><p class="inputNotice" data-input-notice role="status" aria-live="polite"></p><p class="inputDevice" data-input-device aria-live="polite"></p></section>';
    const body=container.querySelector('[data-input-body]'),notice=container.querySelector('[data-input-notice]'),device=container.querySelector('[data-input-device]');
    function announce(message){notice.textContent=message||'';}
    function deviceText(){const status=controller?.status();if(!status)return;device.textContent=!status.available?'Manette indisponible dans ce navigateur ; le clavier et les commandes tactiles restent disponibles.':
      status.connected?status.connected+' manette'+(status.connected>1?'s':'')+' standard détectée'+(status.connected>1?'s':'')+'.'+(status.unsupported?' Un autre périphérique n’a pas de disposition standard reconnue.':''):
      'Appuie sur un bouton de la manette pour la détecter.'+(status.unsupported?' Le périphérique détecté n’a pas de disposition standard reconnue.':'');}
    function render(focusSelector) {
      if(removed)return;
      const state=settings.state(),profile=settings.profile();
      body.innerHTML='<h3>Mes commandes</h3><p>Trois profils conservés dans ce navigateur. Chaque profil contient les touches de J1 et de J2. Une touche appartient à une seule action.</p>'+
        '<div class="inputProfile"><label>Profil actif <select data-input-profile>'+state.profiles.map(p=>'<option value="'+p.id+'"'+(p.id===state.active?' selected':'')+'>'+esc(p.name)+'</option>').join('')+'</select></label>'+
        '<form data-input-name-form><label>Nom <input data-input-name value="'+esc(profile.name)+'" maxlength="28" required></label><button type="submit">Renommer</button></form></div>'+
        (network?'<label class="inputLocalPlayer">Mes touches dans ce salon <select data-input-network><option value="1"'+(state.networkPlayer===1?' selected':'')+'>Profil J1</option><option value="2"'+(state.networkPlayer===2?' selected':'')+'>Profil J2</option></select></label><p>Ce choix est local, quel que soit ton numéro de joueur dans le salon. Une seule manette est utilisée.</p>':'')+
        '<div class="inputPlayers" aria-label="Joueur à configurer">'+[1,2].map(p=>'<button type="button" data-input-player="'+p+'" aria-pressed="'+(p===player)+'">Joueur '+p+'</button>').join('')+'</div>'+
        (capture?'<div class="inputCapture"><strong>J'+player+' · '+esc(actions.find(a=>a.id===capture.action).title)+'</strong><p>Appuie sur la nouvelle touche. Échap annule ; Tab quitte la capture.</p><button type="button" data-input-edit="cancel">Annuler la saisie</button></div>':'')+
        '<div class="inputTable"><table><caption>Clavier J'+player+' · '+esc(profile.name)+'</caption><thead><tr><th scope="col">Action</th><th scope="col">Touche principale</th><th scope="col">Seconde touche</th></tr></thead><tbody>'+
        visibleActions.map(action=>'<tr><th scope="row">'+action.title+'</th>'+[0,1].map(slot=>'<td><button type="button" data-input-edit="bind" data-input-action="'+action.id+'" data-input-slot="'+slot+'" aria-label="J'+player+' · '+action.title+' · '+(slot?'seconde touche':'touche principale')+' · '+esc(profile.bindings[player][action.id][slot]?keyLabel(profile.bindings[player][action.id][slot]):'aucune')+'">'+esc(profile.bindings[player][action.id][slot]?keyLabel(profile.bindings[player][action.id][slot]):'Ajouter')+'</button>'+
          (slot&&profile.bindings[player][action.id][slot]?'<button type="button" class="inputRemove" data-input-edit="remove" data-input-action="'+action.id+'" aria-label="Retirer la seconde touche de '+action.title+'">Retirer</button>':'')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>'+
        '<div class="inputRestore"><button type="button" data-input-edit="restore-player">Restaurer J'+player+'</button><button type="button" data-input-edit="restore-all">Restaurer J1 et J2</button></div>'+
        '<p>Échap reste réservé à la pause et à l’annulation. Tab garde la navigation. Les raccourcis Ctrl, Alt et ⌘ ne déclenchent aucun coup. Le Duel originel conserve ses propres commandes.</p>'+
        '<fieldset class="inputGamepad"><legend>Manette standard</legend><label><input type="checkbox" data-input-gamepad'+(state.gamepad.enabled?' checked':'')+'> Activer la manette</label>'+
        '<label>Zone neutre du stick <select data-input-deadzone>'+deadzones.map(value=>'<option value="'+value+'"'+(value===state.gamepad.deadzone?' selected':'')+'>'+Math.round(value*100)+' %</option>').join('')+'</select></label>'+
        '<p>Les deux premières manettes reconnues prennent J1 puis J2 en local. Une déconnexion ne réattribue pas la manette restante. Relâche les sticks et boutons après une pause ou un changement de profil.</p>'+
        '<details><summary>Disposition de la manette</summary><ul>'+visibleActions.map(action=>'<li><strong>'+action.title+' :</strong> '+action.pad+'</li>').join('')+'</ul><p>Menu / Options : pause dans les modes hors ligne. Les lettres et symboles sont des repères ; la position du bouton fait foi. Les menus se parcourent au clavier ou au toucher.</p></details></fieldset>';
      if(focusSelector)body.querySelector(focusSelector)?.focus({preventScroll:true});
      deviceText();
    }
    const bindingSelector=entry=>'[data-input-edit="bind"][data-input-action="'+entry.action+'"][data-input-slot="'+entry.slot+'"]';
    function cancel(message='Saisie annulée. Aucune touche modifiée.') {if(!capture)return false;const old=capture;capture=null;render(bindingSelector(old));announce(message);return true;}
    function result(value,focus){capture=null;render(focus);announce(value.message);}
    function click(event) {
      const playerButton=event.target.closest?.('[data-input-player]');
      if(playerButton){capture=null;player=Number(playerButton.dataset.inputPlayer);render('[data-input-player="'+player+'"]');return;}
      const button=event.target.closest?.('[data-input-edit]');if(!button)return;
      const action=button.dataset.inputAction,slot=Number(button.dataset.inputSlot);
      switch(button.dataset.inputEdit){
        case 'bind':controller?.releaseAll();capture={action,slot};render('[data-input-edit="cancel"]');announce('En attente d’une touche pour J'+player+' · '+actions.find(a=>a.id===action).title+'.');break;
        case 'cancel':cancel();break;
        case 'remove':result(settings.removeSecondary(player,action),'[data-input-edit="bind"][data-input-action="'+action+'"][data-input-slot="1"]');break;
        case 'restore-player':result(settings.restore(player),'[data-input-edit="restore-player"]');break;
        case 'restore-all':result(settings.restore(),'[data-input-edit="restore-all"]');break;
      }
    }
    function change(event) {
      const target=event.target;
      if(target.matches?.('[data-input-profile]'))result(settings.activate(target.value),'[data-input-profile]');
      else if(target.matches?.('[data-input-network]')){player=Number(target.value);result(settings.setNetworkPlayer(player),'[data-input-network]');}
      else if(target.matches?.('[data-input-gamepad]'))result(settings.setGamepad(target.checked),'[data-input-gamepad]');
      else if(target.matches?.('[data-input-deadzone]'))result(settings.setGamepad(settings.state().gamepad.enabled,Number(target.value)),'[data-input-deadzone]');
    }
    function submit(event){if(!event.target.matches?.('[data-input-name-form]'))return;event.preventDefault();result(settings.rename(body.querySelector('[data-input-name]').value),'[data-input-name]');}
    function keydown(event) {
      if(!capture)return;
      if(event.key==='Tab'){cancel();return;}
      event.preventDefault();event.stopImmediatePropagation?.();
      if(event.key==='Escape'){cancel();return;}
      if(event.repeat||event.isComposing)return;
      if(event.ctrlKey||event.altKey||event.metaKey){announce('Les raccourcis Ctrl, Alt et ⌘ sont réservés au navigateur.');return;}
      const old=capture,value=settings.bind(player,old.action,old.slot,event.key);
      if(value.ok)result(value,bindingSelector(old));else announce(value.message);
    }
    function background(){cancel('Saisie annulée lors du changement de fenêtre.');}
    function visibility(){if(host.document?.hidden)background();}
    const off=settings.subscribe(()=>{const wasCapturing=!!capture;capture=null;render(wasCapturing?'[data-input-profile]':undefined);if(wasCapturing)announce('Le profil a changé ; la saisie précédente est annulée.');}),offStatus=controller?.subscribeStatus(deviceText);
    container.addEventListener('click',click);container.addEventListener('change',change);container.addEventListener('submit',submit);host.addEventListener('keydown',keydown,true);host.addEventListener('blur',background);host.document?.addEventListener?.('visibilitychange',visibility);
    render();announce(settings.status().message);
    return {isCapturing:()=>!!capture,cancel,refresh:()=>render(),destroy(){removed=true;capture=null;off();offStatus?.();container.removeEventListener?.('click',click);container.removeEventListener?.('change',change);container.removeEventListener?.('submit',submit);host.removeEventListener?.('keydown',keydown,true);host.removeEventListener?.('blur',background);host.document?.removeEventListener?.('visibilitychange',visibility);}};
  }
  host.StrandInput={storeKey,actions,normaliseKey,keyLabel,valid,createSettings,createController,mountEditor};
})();
