/* Four independent axes: discovery, entitlement, technical availability and context.
 * Local memories are awarded by local game saves. No external entitlement is read
 * from localStorage; source-access evaluation below is an unconnected contract. */
(function (host) {
  'use strict';
  const STORE_KEY='echos.liaison.v1';
  const LESSON_IDS=['distance','reach','guard-high','guard-low','punish','resource','signatures','combo'];
  const SOURCE_KEYS=['echos.v1.chapters','echos.v1.scenes','echos.lessons.v1'];
  const object=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
  const copy=value=>JSON.parse(JSON.stringify(value));
  const own=(value,key)=>Object.prototype.hasOwnProperty.call(value,key);
  function read(storage,key,notices) {
    try {const raw=storage?.getItem(key);return raw?JSON.parse(raw):null;}
    catch (_) {notices.push('Une sauvegarde ne peut pas être lue ; ses données restent intactes.');return null;}
  }
  function loadFacts(storage,fighterIds) {
    const notices=[],chapters=read(storage,SOURCE_KEYS[0],notices),scenes=read(storage,SOURCE_KEYS[1],notices),lessons=read(storage,SOURCE_KEYS[2],notices);
    const routes={},completed={};
    for(const id of fighterIds)routes[id]=(object(chapters)&&own(chapters,id)&&chapters[id]===3)||(object(scenes)&&own(scenes,id+'-ending')&&scenes[id+'-ending']===true);
    const validLessons=object(lessons)&&lessons.version===1&&object(lessons.completed)&&object(lessons.resume)&&
      LESSON_IDS.includes(lessons.resume.id)&&fighterIds.includes(lessons.resume.fighter)&&
      Object.entries(lessons.completed).every(([id,entry])=>LESSON_IDS.includes(id)&&object(entry)&&Number.isSafeInteger(entry.runs)&&entry.runs>0&&
        Array.isArray(entry.fighters)&&entry.fighters.length>0&&new Set(entry.fighters).size===entry.fighters.length&&entry.fighters.every(fighter=>fighterIds.includes(fighter)));
    if(validLessons)for(const [id,entry] of Object.entries(lessons.completed))completed[id]=entry.fighters.slice();
    else if(lessons!==null)notices.push('Le relevé du dojo est incompatible ; aucune récompense nouvelle n’en est déduite.');
    return {routes,lessons:completed,notices:[...new Set(notices)]};
  }
  function evaluateCondition(rule,facts={},depth=0) {
    if(!object(rule)||depth>12)return {met:false,label:'Condition non disponible',op:'invalid',children:[]};
    const label=typeof rule.label==='string'?rule.label:'Condition',base={label,op:rule.op,children:[]};
    if(rule.op==='always')return {...base,met:true,current:1,total:1};
    if(rule.op==='route')return {...base,met:facts.routes?.[rule.fighter]===true,current:facts.routes?.[rule.fighter]===true?1:0,total:1};
    if(rule.op==='lesson') {const met=Array.isArray(facts.lessons?.[rule.lesson])&&facts.lessons[rule.lesson].includes(rule.fighter);return {...base,met,current:met?1:0,total:1};}
    if(['all','any'].includes(rule.op)&&Array.isArray(rule.conditions)&&rule.conditions.length) {
      const children=rule.conditions.map(child=>evaluateCondition(child,facts,depth+1));
      return {...base,children,met:rule.op==='all'?children.every(child=>child.met):children.some(child=>child.met),current:children.filter(child=>child.met).length,total:children.length};
    }
    return {...base,met:false,current:0,total:1};
  }
  /* Pure policy evaluator. Its caller must supply authoritative decisions; it
     neither authenticates a member nor trusts a browser-stored subscriber flag.
     No paid catalogue or provider adapter is connected to this function. */
  function accessFromSources(sources=[],options={}) {
    const now=Number.isFinite(options.now)?options.now:Date.now(),online=options.online!==false;
    const accepted=[],pending=[],expired=[],revoked=[];
    const seen=new Set();
    for(const source of Array.isArray(sources)?sources:[]) {
      if(!object(source)||typeof source.id!=='string'||seen.has(source.id))continue;
      seen.add(source.id);
      if(source.authority!=='local-game'&&source.authority!=='trusted-service')continue;
      if(source.authority==='trusted-service'&&source.confirmed!==true){pending.push(source.id);continue;}
      if(source.revoked===true){revoked.push(source.id);continue;}
      if(source.kind==='permanent'){accepted.push({id:source.id,kind:'permanent'});continue;}
      if(source.kind!=='temporary')continue;
      if(!Number.isFinite(source.validUntil)||!Number.isFinite(source.validFrom)||source.validFrom>now){pending.push(source.id);continue;}
      if(source.validUntil<=now){expired.push(source.id);continue;}
      if(!online&&(!Number.isFinite(source.offlineUntil)||source.offlineUntil<=now)){pending.push(source.id);continue;}
      accepted.push({id:source.id,kind:'temporary',validUntil:source.validUntil});
    }
    const permanent=accepted.some(source=>source.kind==='permanent');
    return {allowed:accepted.length>0,state:permanent?'permanent':accepted.length?'temporary':pending.length?'pending':expired.length?'expired':revoked.length?'revoked':'none',accepted,pending,expired,revoked};
  }
  function sourceFor(item){return 'rule:'+item.id+':v'+(item.ruleVersion||1);}
  function validGrant(item,entry) {return object(entry)&&entry.source===sourceFor(item)&&Number.isFinite(entry.acquiredAt)&&entry.acquiredAt>=0;}
  function createStore({storage=host.localStorage,catalogue=[],fighterIds=[],now=()=>Date.now()}={}) {
    const rewards=catalogue.filter(item=>item.category==='memories'),rewardById=new Map(rewards.map(item=>[item.id,item]));
    let state={version:1,grants:{},retainedGrants:{},preferences:{hideFutureIdentities:true}},saved=!!storage,protectedVersion=false,notices=[],facts={routes:{},lessons:{}},newlyGranted=[];
    function absorb() {
      let stored=null;
      try {const raw=storage?.getItem(STORE_KEY);stored=raw?JSON.parse(raw):null;}
      catch (_) {protectedVersion=true;saved=false;notices.push('Le registre des dossiers ne peut pas être lu. Il est préservé ; les nouveaux acquis restent dans cette session.');return;}
      if(stored===null)return;
      if(!object(stored)||stored.version!==1){protectedVersion=true;notices.push('Le format des dossiers enregistré est incompatible. Il est préservé ; les nouveaux acquis restent dans cette session.');return;}
      if(object(stored.preferences)&&typeof stored.preferences.hideFutureIdentities==='boolean')state.preferences.hideFutureIdentities=stored.preferences.hideFutureIdentities;
      if(!object(stored.grants)){notices.push('Le registre des acquisitions est incomplet. Les preuves de jeu sont relues sans modifier les anciennes sauvegardes.');return;}
      const records={...(object(stored.retainedGrants)?stored.retainedGrants:{}),...stored.grants};
      for(const [id,entry] of Object.entries(records)) {
        if(['__proto__','prototype','constructor'].includes(id))continue;
        const item=rewardById.get(id);if(!item||!validGrant(item,entry)){state.retainedGrants[id]=copy(entry);continue;}
        delete state.retainedGrants[id];
        if(!state.grants[id]||entry.acquiredAt<state.grants[id].acquiredAt)state.grants[id]={source:entry.source,acquiredAt:entry.acquiredAt};
      }
    }
    function persist() {
      if(protectedVersion){saved=false;return false;}
      try {if(!storage)throw Error('No storage');storage.setItem(STORE_KEY,JSON.stringify(state));saved=true;return true;}
      catch (_) {saved=false;notices.push('Le stockage est indisponible. Les nouveaux souvenirs restent accessibles pendant cette session.');return false;}
    }
    function refresh() {
      notices=[];absorb();facts=loadFacts(storage,fighterIds);notices.push(...facts.notices);newlyGranted=[];
      for(const item of rewards)if(!state.grants[item.id]&&evaluateCondition(item.condition,facts).met){delete state.retainedGrants[item.id];state.grants[item.id]={source:sourceFor(item),acquiredAt:Math.max(0,Number(now())||0)};newlyGranted.push(item.id);}
      if(newlyGranted.length)persist();
      return snapshot();
    }
    function snapshot(){return {...copy(state),facts:copy(facts),saved:saved&&!protectedVersion,protectedVersion,notices:[...new Set(notices)],newlyGranted:newlyGranted.slice()};}
    function setHideFuture(value){absorb();state.preferences.hideFutureIdentities=!!value;persist();return snapshot();}
    refresh();
    return {refresh,snapshot,setHideFuture};
  }
  function resolve(item,state,context={}) {
    const grant=state.grants?.[item.id],owned=item.included===true||validGrant(item,grant),condition=item.condition?evaluateCondition(item.condition,state.facts):null;
    const discovery=item.category==='future'&&state.preferences?.hideFutureIdentities?'secret':item.category==='memories'&&!owned?'hint':'identified';
    const availability=item.availability==='planned'?'planned':context.installed===false?'missing':item.availability==='error'?'error':'ready';
    const mode=context.mode||'archive',modeAllowed=!item.allowedModes||item.allowedModes.includes(mode);
    const missingDependency=(item.dependencies||[]).find(id=>context.availableIds&&!context.availableIds.includes(id));
    const compatibility=modeAllowed&&!missingDependency?'compatible':'incompatible';
    const entitlement=owned?'permanent':condition?.met?'earned':'none';
    let label=owned?'Acquis':'Archive scellée';
    if(item.included)label='Disponible';
    if(availability==='planned')label='Kit en préparation';
    else if(availability==='missing')label=owned?'Acquis · installation nécessaire':'Installation nécessaire';
    else if(availability==='error')label='Temporairement indisponible';
    else if(compatibility==='incompatible')label=missingDependency?(owned?'Acquis · personnage requis':'Personnage requis'):'Indisponible dans ce mode';
    return {discovery,entitlement,availability,compatibility,owned,usable:owned&&availability==='ready'&&compatibility==='compatible',label,condition,missingDependency};
  }
  function safePublic(item,status) {
    const hidden=status.discovery==='secret';
    return {title:hidden?item.hintTitle:status.discovery==='hint'?item.hintTitle:item.title,preview:hidden?'':item.preview,work:hidden?'DS2 · identité masquée':item.work,
      description:hidden?'Une base visuelle de DS2 est répertoriée. Son kit n’est pas jouable. Décoche le masquage des identités pour consulter les détails.':item.description||'',hidden};
  }
  function esc(value){return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  const lockIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>';
  const openIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/><path d="M20 13v7H4V4h9"/></svg>';
  function conditionMarkup(rule) {
    const mark=rule.met?'✓':'○';
    if(rule.children.length)return '<li class="condition '+(rule.met?'met':'')+'"><span class="branch-label">'+mark+' '+esc(rule.label)+(rule.op==='all'?' · '+rule.current+' / '+rule.total:' · OU')+'</span><ul class="condition-group">'+rule.children.map(conditionMarkup).join('')+'</ul></li>';
    return '<li class="condition '+(rule.met?'met':'')+'">'+mark+' '+esc(rule.label)+' <span class="sr">'+(rule.met?'— validé':'— à accomplir')+'</span></li>';
  }
  function mount(document) {
    const root=document.getElementById('liaison');if(!root)return null;
    const data=host.StrandProgressionData,catalogue=data.build(host.StrandContent,host.StrandAssets,host.StrandStaticCatalogue),fighterIds=Object.keys(host.StrandContent.fighters),itemById=new Map(catalogue.map(item=>[item.id,item]));
    let storage;try{storage=host.localStorage;}catch(_){storage=null;}
    const store=createStore({storage,catalogue,fighterIds}),cards=document.getElementById('cards'),dialog=document.getElementById('dossier-dialog'),category=document.getElementById('category'),search=document.getElementById('search'),hide=document.getElementById('hide-future');
    let state=store.snapshot(),dialogId=null,returnFocus=null;
    const revealSeen=new Set();
    try{if(JSON.parse(storage?.getItem('echos.v1.reducedEffects'))===true)document.body.classList.add('reduced-motion');}catch(_){}
    function render(message='') {
      const memories=catalogue.filter(item=>item.category==='memories'),total=memories.length,acquired=memories.filter(item=>state.grants[item.id]).length;
      document.getElementById('summary').innerHTML='<div><strong>'+acquired+' <span style="display:inline">/ '+total+'</span></strong><span>souvenirs ouverts</span></div><div class="summary-bar" aria-hidden="true"><i style="--value:'+(total?acquired/total*100:0)+'%"></i></div><span>Acquis permanents<br>dans ce navigateur</span>';
      hide.checked=state.preferences.hideFutureIdentities;
      const query=search.value.trim().toLocaleLowerCase('fr'),filtered=catalogue.filter(item=>{
        if(category.value!=='all'&&item.category!==category.value)return false;
        const status=resolve(item,state),publicItem=safePublic(item,status);
        return !query||[publicItem.title,publicItem.work,publicItem.description,status.label].join(' ').toLocaleLowerCase('fr').includes(query);
      });
      cards.innerHTML=filtered.length?filtered.map(item=>{
        const status=resolve(item,state),display=safePublic(item,status),locked=item.category==='memories'&&!status.owned;
        const art=display.preview?'<img src="'+esc(display.preview)+'" alt="" loading="lazy">':'<span class="neutral" aria-hidden="true">?</span>';
        const reveal=state.newlyGranted.includes(item.id)&&!revealSeen.has(item.id);if(reveal)revealSeen.add(item.id);
        return '<button type="button" class="card '+(locked?'locked ':'')+(reveal?'reveal ':'')+(item.category==='stages'?'stage ':'')+'" data-dossier="'+esc(item.id)+'" aria-label="'+esc(display.title+' — '+status.label)+'"><span class="card-art">'+art+(item.category==='memories'?'<span class="seal" aria-hidden="true">'+(status.owned?openIcon:lockIcon)+'</span>':'')+'</span><span class="card-body"><span class="card-category">'+esc(data.categories[item.category])+'</span><strong>'+esc(display.title)+'</strong><span class="state '+(status.usable?'ready':'')+'">'+esc(status.label)+'</span><small>'+esc(display.work)+'</small><span class="cta">'+(locked?'Voir les conditions':item.category==='memories'?'Lire le souvenir':'Consulter le dossier')+' ↗</span></span></button>';
      }).join(''):'<p class="empty">Aucun dossier ne correspond à cette recherche.</p>';
      document.getElementById('result-count').textContent=filtered.length+' dossier'+(filtered.length!==1?'s':'')+' affiché'+(filtered.length!==1?'s':'');
      const notice=message||(state.newlyGranted.length?state.newlyGranted.length+' nouveau'+(state.newlyGranted.length>1?'x souvenirs ouverts.':' souvenir ouvert.'):'');
      document.getElementById('save-notice').textContent=[notice,...state.notices,state.saved?'Progression locale relue ; les autres sauvegardes sont conservées.':'Acquis disponibles pour cette session.'].filter(Boolean).join(' ');
      if(dialog.open&&dialogId){const titleFocused=document.activeElement?.id==='dossier-title';renderDialog(dialogId);if(titleFocused)document.getElementById('dossier-title').focus();}
    }
    function renderDialog(id) {
      const item=itemById.get(id);if(!item)return;
      const status=resolve(item,state),display=safePublic(item,status),locked=item.category==='memories'&&!status.owned;
      const picture=display.preview?'<img class="dossier-picture '+(locked?'silhouette':'')+'" src="'+esc(display.preview)+'" alt="">':'<span class="neutral" aria-hidden="true">?</span>';
      const details={Découverte:{secret:'Identité masquée',hint:'Silhouette et indice',identified:'Identité révélée'}[status.discovery],Accès:status.entitlement==='permanent'?(item.included?'Inclus dans le jeu':'Acquisition permanente'):'Aucun droit à réclamer',Disponibilité:{planned:'Kit en préparation',missing:'Installation nécessaire',error:'Indisponible',ready:'Contenu présent'}[status.availability],Contexte:'Consultation des archives'};
      if(locked)details.Accès='À débloquer en jouant';
      if(status.availability==='planned')details.Accès='Aucune règle de déblocage active';
      let body='';
      if(item.category==='memories'&&status.owned)body='<p class="dossier-body">'+esc(item.body)+'</p><p class="dossier-note">'+esc(item.note)+'</p>';
      else if(locked)body='<p>Ce souvenir du simulateur est scellé. Termine l’une des deux voies ci-dessous ; l’attribution sera automatique lorsque tu reviendras aux dossiers.</p>';
      else body='<p>'+esc(display.description)+'</p>';
      const requirements=status.condition?'<section class="requirements"><h3>'+ (status.owned?'Les voies d’obtention':'Conditions de déblocage')+'</h3><ul class="condition-group">'+conditionMarkup(status.condition)+'</ul><p class="work">Histoire complète OU les quatre exercices avec le même combattant. Les huit combattants actuels restent tous disponibles. Aucun coût ni abonnement.</p></section>':'';
      const actions=item.category==='memories'?'<a href="index.html">Rejoindre l’histoire ou le dojo ↗</a>':display.hidden?'':item.href?'<a href="'+esc(item.href)+'">'+esc(item.actionLabel)+' ↗</a>':'';
      document.getElementById('dossier-content').innerHTML='<div class="dossier-header">'+picture+'<div><span class="state '+(status.usable?'ready':'')+'">'+esc(status.label)+'</span><h2 id="dossier-title" tabindex="-1">'+esc(display.title)+'</h2><p class="work">'+esc(display.work)+'</p></div></div>'+body+'<dl class="dimensions">'+Object.entries(details).map(([name,value])=>'<div><dt>'+esc(name)+'</dt><dd>'+esc(value)+'</dd></div>').join('')+'</dl>'+requirements+'<div class="dossier-actions">'+actions+'</div>';
    }
    function open(id,trigger){if(!itemById.has(id))return;dialogId=id;returnFocus=trigger;renderDialog(id);dialog.showModal();document.getElementById('dossier-title').focus();}
    cards.addEventListener('click',event=>{const button=event.target.closest?.('[data-dossier]');if(button)open(button.dataset.dossier,button);});
    document.getElementById('close-dossier').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('close',()=>{const id=dialogId;dialogId=null;const target=returnFocus?.isConnected?returnFocus:cards.querySelector('[data-dossier="'+id+'"]')||document.getElementById('dossiers');target.focus();returnFocus=null;});
    category.addEventListener('change',()=>render());search.addEventListener('input',()=>render());
    hide.addEventListener('change',()=>{state=store.setHideFuture(hide.checked);render();});
    document.getElementById('refresh').addEventListener('click',()=>{state=store.refresh();render(state.newlyGranted.length?'':'Acquis actualisés.');});
    host.addEventListener?.('storage',event=>{if(event.key===null||[STORE_KEY,...SOURCE_KEYS].includes(event.key)){state=store.refresh();render();}});
    host.addEventListener?.('pageshow',event=>{if(event.persisted){state=store.refresh();render();}});
    render();
    return {store,catalogue,render,refresh(){state=store.refresh();render();},open};
  }
  host.StrandProgression={version:1,STORE_KEY,SOURCE_KEYS,loadFacts,evaluateCondition,accessFromSources,createStore,resolve,safePublic,conditionMarkup,mount};
  if(host.document?.getElementById('liaison'))mount(host.document);
})(typeof window==='undefined'?globalThis:window);
