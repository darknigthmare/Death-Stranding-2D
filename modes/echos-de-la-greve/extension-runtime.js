/* Original expansion arenas. Only received, measured panoramas enter selection. */
(function(host){
  'use strict';
  const content=host.StrandContent,art=host.StrandAssets,catalogue=host.StrandOriginalExtension,images=host.StrandExtensionAssets;
  const registered=[];
  if(content&&art&&catalogue&&images){
    art.stages=art.stages||{};art.stageGeometry=art.stageGeometry||{};
    for(const stage of catalogue.stages||[]){
      const image=images.items?.[stage.id];
      if(!image||image.kind!=='stage'||!Number.isFinite(image.floorY)||image.floorY<=0||image.floorY>=1)continue;
      if(content.arenas[stage.id]||content.stages[stage.id])continue;
      content.arenas[stage.id]={title:stage.name+' · Lignes de Marée',sky:'#637b80',light:'#d8e9e4'};
      content.stages[stage.id]=content.arenas[stage.id].title;
      content.stageDetails[stage.id]={place:'Les Lignes de Marée · lieu original',material:'Piste statique · panorama',ambience:stage.summary||''};
      art.stages[stage.id]=image.src;art.stageGeometry[stage.id]={legacy:{floorY:image.floorY}};
      registered.push(stage.id);
    }
  }
  host.StrandExtensionRuntime=Object.freeze({version:1,stages:Object.freeze(registered),characters:0,enemies:0,bosses:0});
})(window);
