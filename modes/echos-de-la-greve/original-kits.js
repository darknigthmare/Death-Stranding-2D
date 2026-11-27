/* Lignes de marée — first local original kit. Load after assets.js and before fight.js. */
(function (host) {
  'use strict';
  const rules = 'balise-1';
  const poseNames = ['stance','guard','crouch','jump','light','heavy','hurt','tether','anchor','reel','fall','taunt','victory','walk1','walk2'];
  const source = host.StrandOriginalKitsAssets?.version === 1 ? host.StrandOriginalKitsAssets.kits?.balise : null;
  const descriptorOK = (value, pose) => value && typeof value.src === 'string' && value.src.startsWith('assets/') &&
    Array.isArray(value.crop) && value.crop.length === 4 && value.crop.every(Number.isFinite) &&
    value.crop[0] >= 0 && value.crop[1] >= 0 && value.crop[2] > 0 && value.crop[3] > 0 &&
    Number.isFinite(value.anchorX) && value.anchorX >= 0 && value.anchorX <= 1 &&
    Number.isFinite(value.baselineY) && value.baselineY >= 0 && value.baselineY <= 1 &&
    (!pose || Number.isFinite(value.heightRatio) && value.heightRatio >= .1 && value.heightRatio <= 2);
  const artReady = source?.ready === true && poseNames.every(pose =>
    ['left','right'].every(face => descriptorOK(source.poses?.[pose]?.[face], true))) &&
    ['anchor','ropeHook'].every(prop => descriptorOK(source.props?.[prop], false));
  const canonicalCharacterIds = Object.keys(host.StrandContent?.fighters || {});
  const roster = {
    balise: {name:'Maëlle « Balise » Rocher',short:'BALISE',suit:'#303c43',cloth:'#495961',trim:'#df8547',metal:'#a9b5b6',skin:'#bd9278',
      h:176,speed:4.4,power:1,move:'Courte traction au lien',end:'Passage sécurisé',originalId:'ldm-char-balise'}
  };
  // Width is the existing 44-pixel collision body. No visual sprite width changes reach.
  const bodyWidth = 44;
  const moves = {
    baliseLight:{baseKey:'light',name:'Contact de contrôle',start:7,active:3,recover:12,reach:81,low:39,high:112,damage:5,balance:9,stun:12,push:5},
    baliseHeavy:{baseKey:'heavy',name:'Coup de harnais',start:15,active:4,recover:24,reach:111,low:63,high:152,damage:10,balance:20,stun:21,push:10},
    baliseLift:{baseKey:'lift',name:'Relevé de garde',start:13,active:4,recover:25,reach:78,low:12,high:124,damage:8,balance:17,stun:22,push:4,launch:7},
    balise:{name:'Courte traction au lien',start:18,active:4,recover:24,cost:28,reach:bodyWidth*2.4,low:8,high:54,damage:10,balance:14,stun:18,push:-3,groundedOnly:true,rope:true},
    baliseAnchor:{name:'Ancrage de rappel',start:24,active:1,recover:21,cost:18},
    baliseReel:{name:'Reprise de corde',start:10,active:6,recover:22,cost:16},
    baliseAssist:{name:'Ligne de vie',start:24,active:5,recover:26,reach:bodyWidth*2.4,low:8,high:54,damage:6,balance:12,stun:14,push:-2,groundedOnly:true,rope:true}
  };
  const fighters = {
    balise:{name:roster.balise.name,call:'Balise',role:'Sauvetage côtier · ancrage / interception',
      special:roster.balise.move,finisher:'Conclusion en production',originalId:'ldm-char-balise',
      localOnly:true,storyReady:false,finisherReady:false,
      tip:'Place un ancrage, puis rappelle-toi physiquement vers lui. Une garde ou un saut évite la boucle de corde ; les coups bas adverses peuvent détruire l’ancrage.',
      techniques:[
        ['Neutre','Courte traction au lien',28,'18 / 4 / 24 ticks. Boucle au sol à 2,4 largeurs de corps ; garde ou saut pour l’éviter.'],
        ['Avant','Ancrage de rappel',18,'24 / 1 / 21 ticks. Un ancrage à 1,5 largeur de corps, destructible et limité à 240 ticks.'],
        ['Arrière','Reprise de corde',16,'10 / 6 / 22 ticks. Consomme l’ancrage et tire le harnais jusqu’à 66 px, sans traverser un adversaire.']
      ]}
  };
  const frameData=[
    ['normal','L','baliseLight'],['normal','F','baliseHeavy'],['normal','2 + F','baliseLift'],
    ['special','T','balise'],['special','6 + T','baliseAnchor'],['special','4 + T','baliseReel']
  ].map(([category,input,key])=>{
    const move=moves[key];
    return {category,input,key,name:move.name,cost:move.cost || 0,start:move.start,active:move.active,recover:move.recover,damage:move.damage || 0};
  });
  fighters.balise.frameData=frameData;
  const api = {
    version:1,rules,enabled:!!artReady,artReady:!!artReady,compatibleLocalOnly:true,
    localModes:['versus','training','teams'],canonicalCharacterIds,
    originalCharacterIds:artReady?['balise']:[],catalogueToEngine:{'ldm-char-balise':'balise'},
    engineToCatalogue:{balise:'ldm-char-balise'},roster:artReady?roster:{},moves:artReady?moves:{},
    directional:artReady?{balise:{forward:'baliseAnchor',back:'baliseReel'}}:{},
    normalKeys:artReady?{balise:{light:'baliseLight',heavy:'baliseHeavy',lift:'baliseLift'}}:{},
    fighters:artReady?fighters:{},moveSheets:artReady?{balise:frameData}:{},art:artReady?{balise:source}:{},poseNames,
    assists:artReady?{balise:{name:'Ligne de vie',cost:25,entry:24,active:5,exit:26,duration:55,key:'baliseAssist'}}:{},
    geometry:{bodyWidth,anchorDistance:bodyWidth*1.5,anchorTTL:240,reelSpeed:11,anchorRadius:12},
    production:{character:'ldm-char-balise',scope:'Local kit, 30 directional key poses and 2 detached props',
      fullAnimation:false,storyReady:false,superReady:false,finisherReady:false,costumesReady:false}
  };
  host.StrandOriginalKits = Object.freeze(api);
  // Deliberately absent: story routes, campaign unlocks, an invented super and a stock finisher.
  if(artReady){
    if(host.StrandContent?.fighters)Object.assign(host.StrandContent.fighters,fighters);
    if(host.StrandAssets){
      host.StrandAssets.fighters ||= {};
      host.StrandAssets.portraits ||= {};
      host.StrandAssets.fighters.balise=source.poses.stance.right.src;
      host.StrandAssets.portraits.balise=source.poses.stance.right.src;
    }
  }
})(window);
