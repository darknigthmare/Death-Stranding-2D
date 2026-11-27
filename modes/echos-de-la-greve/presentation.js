/* Presentation only. Character identity/version is read from the active roster;
 * no timer, image load, CSS animation or preview can change combat state. */
(() => {
  'use strict';
  const host=window;
  const profiles=Object.freeze({
    sam:{title:'Salut du porteur',gesture:'Sam lève le pouce en gardant son autre main sur la sangle.',version:'DS1 / Director’s Cut'},
    fragile:{title:'Sous mon parapluie',gesture:'Fragile invite son adversaire à avancer, parapluie fermé en main.',version:'DS1'},
    higgs:{title:'Le public attend',gesture:'Higgs adresse un salut théâtral à son adversaire.',version:'DS1 · tenue Homo Demens'},
    cliff:{title:'Salut de section',gesture:'Cliff porte deux doigts à sa tempe.',version:'DS1 · champ de bataille'},
    mule:{title:'Scan prioritaire',gesture:'L’opérateur lève son scanner portatif.',version:'DS1 · opérateur MULE'},
    diehardman:{title:'Gant ajusté',gesture:'Die-Hardman ajuste son gant avant de reprendre sa garde.',version:'DS1 · Bridges'},
    mama:{title:'Mise au point',gesture:'Mama ajuste ses lunettes.',version:'DS1 · avatar du simulateur'},
    heartman:{title:'Un instant',gesture:'Heartman consulte brièvement son appareil au poignet.',version:'DS1 · avatar du simulateur'}
  });
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone=value=>JSON.parse(JSON.stringify(value));
  function art(slot,gesture=false){
    const assets=host.StrandAssets||{},kit=assets.wardrobe?.[slot.id]?.[slot.outfit];
    return gesture && (!kit || slot.outfit==='atelier') ? host.StrandPresentationAssets?.[slot.id]?.taunt?.src || kit?.poses?.stance || assets.fighters?.[slot.id] : kit?.poses?.stance || assets.fighters?.[slot.id];
  }
  function actor(slot,kind,gesture){
    const src=art(slot,gesture);
    return src?'<img class="presentationActor '+kind+'" src="'+esc(src)+'" alt="" draggable="false">':'';
  }
  function markup(){
    return '<section class="presentationPanel" data-presentation aria-label="Présentation du choix">'+
      '<div class="presentationHeading"><h2>Liaison des combattants</h2><p>Survole un portrait pour consulter son aperçu. Le clic confirme le choix immédiatement.</p></div>'+
      '<div class="presentationCast" data-presentation-cast></div><p class="presentationStatus" role="status" aria-live="polite" data-presentation-status></p>'+
      '<p class="presentationHint">Geste de défi en duel : 0,9 s d’exposition, sans attaque ni bonus. Les gestes appartiennent au simulateur.</p></section>';
  }
  function mount(container,{slots=[],previous=[],reduced=false}={}){
    if(!container)return {destroy(){},preview(){},restore(){},setReduced(){}};
    let disposed=false,generation=0,timers=[],committed=clone(slots),shown=clone(slots),isPreview=false;
    const cast=container.querySelector('[data-presentation-cast]'),status=container.querySelector('[data-presentation-status]');
    function cancel(){generation++;for(const timer of timers)host.clearTimeout(timer);timers=[];}
    function later(fn,delay){const own=generation;timers.push(host.setTimeout(()=>{if(!disposed&&generation===own)fn();},delay));}
    function render(next,old,preview=false){
      if(disposed || !cast)return;
      cancel();shown=clone(next);isPreview=preview;container.classList.toggle('presentationReduced',!!reduced);
      const changed=next.some((slot,i)=>slot.id!==old[i]?.id || slot.outfit!==old[i]?.outfit);
      cast.innerHTML=next.map((slot,i)=>{
        const id=slot.id,profile=profiles[id],fighter=host.StrandContent?.fighters?.[id];
        if(!profile||!fighter)return '';
        const before=old[i],different=before && (id!==before.id || slot.outfit!==before.outfit);
        const phase=preview?'preview':different?'confirm':'waiting';
        const wardrobe=host.StrandAssets?.wardrobe?.[id]?.[slot.outfit];
        return '<article class="presentationSlot" data-presentation-slot="'+i+'" data-phase="'+phase+'">'+
          '<div class="presentationViewport" aria-hidden="true">'+
          (different&&!reduced?actor(before,'presentationLeaving',false):'')+
          actor(slot,(!reduced&&(different||!before)?'presentationEntering ':'')+'presentationCurrent',!preview)+'</div>'+
          '<div class="presentationCopy"><span class="kicker">'+esc(slot.label||'Joueur '+(i+1))+' · '+(preview&&i===0?'Aperçu':'Choix confirmé')+'</span>'+
          '<h3>'+esc(fighter.name)+'</h3><p>'+esc(profile.version)+(wardrobe?' · '+esc(wardrobe.name):'')+'</p><strong>'+esc(profile.title)+'</strong></div></article>';
      }).join('');
      if(status)status.textContent=preview?'Aperçu de '+(host.StrandContent?.fighters?.[next[0]?.id]?.name||'')+' ; le choix confirmé reste '+(host.StrandContent?.fighters?.[committed[0]?.id]?.name||'')+'.':
        next.map(slot=>(slot.label||'Combattant')+' : '+host.StrandContent?.fighters?.[slot.id]?.name).join(' · ');
      if(!reduced&&!preview)later(()=>{
        cast.querySelectorAll('.presentationLeaving').forEach(node=>node.remove());
        cast.querySelectorAll('.presentationEntering').forEach(node=>node.classList.remove('presentationEntering'));
        cast.querySelectorAll('[data-presentation-slot]').forEach(node=>{node.dataset.phase='waiting';});
      },changed?420:260);
      // A failed PNG keeps its own identity/outfit: never borrow another fighter.
      cast.querySelectorAll('img.presentationCurrent').forEach((image,i)=>{
        const fallback=art(next[i],false);
        image.addEventListener('error',()=>{if(!disposed&&fallback&&image.getAttribute('src')!==fallback)image.src=fallback;},{once:true});
      });
    }
    render(committed,previous,false);
    return {
      preview(id){if(disposed||!profiles[id]||!committed.length||isPreview&&shown[0]?.id===id)return;
        if(id===committed[0].id){if(isPreview)render(committed,shown,false);return;}
        const next=clone(committed);next[0]={...next[0],id,outfit:id===committed[0].id?committed[0].outfit:'atelier'};render(next,shown,true);},
      restore(){if(isPreview)render(committed,shown,false);},
      setReduced(value){reduced=!!value;render(shown,shown,isPreview);},
      state:()=>({slots:clone(committed),shown:clone(shown),preview:isPreview,reduced:!!reduced,disposed}),
      destroy(){disposed=true;cancel();}
    };
  }
  host.StrandPresentation={profiles,markup,mount};
})();
