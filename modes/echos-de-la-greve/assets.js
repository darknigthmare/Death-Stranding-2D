/* Relative paths also work when the combat menu is opened directly from disk. */
(() => {
  function illustrations(folder, ids, suffix = '') {
    return Object.fromEntries(ids.map(id => [id, 'assets/' + folder + '/' + id + suffix + '.webp']));
  }
  const story = illustrations('story', [
    'shore-prologue', 'sam-intro-shore', 'sam-higgs-rival', 'sam-intro', 'sam-ending',
    'fragile-intro', 'fragile-rival', 'fragile-ending', 'higgs-intro', 'higgs-rival', 'higgs-ending',
    'cliff-intro', 'cliff-rival', 'cliff-ending', 'mule-intro', 'mule-rival', 'mule-ending',
    'diehardman-intro', 'diehardman-rival', 'diehardman-ending', 'mama-intro', 'mama-rival', 'mama-ending',
    'heartman-intro', 'heartman-rival', 'heartman-ending'
  ]);
  story['sam-rival'] = story['sam-higgs-rival'];
  story['diehardman-rival'] = 'assets/story/diehardman-rival.png';
  const roster = Object.keys(window.StrandContent.fighters);
  const arenas = Object.keys(window.StrandContent.stages);
  const stageLayers = (suffix, ids=arenas) => Object.fromEntries(ids.map(id => [id, 'assets/stages/' + id + suffix + '.png']));
  // Every location has five independent layers and a panorama fallback.
  const movement = ['guard','crouch','rise','apex','fall'];
  const generatedFighters = ['sam','fragile','higgs','cliff','mule','diehardman','heartman'];
  const replacementRoot = {heartman:'assets/fighters/heartman/',higgs:'assets/fighters/higgs/',diehardman:'assets/fighters/diehardman/',mama:'assets/fighters/mama/atelier/'};
  const replacement = pose => Object.fromEntries(Object.entries(replacementRoot).map(([id,folder])=>[id,folder+pose+'.png']));
  const poses = Object.fromEntries(generatedFighters.map(id => [id,
    Object.fromEntries(movement.map(pose => [pose,'assets/fighters/'+id+'/'+pose+'.png']))
  ]));
  poses.heartman = {...poses.heartman,...Object.fromEntries(['stance','action','step','hit'].map(pose=>[pose,replacementRoot.heartman+pose+'.png']))};
  poses.higgs = {...poses.higgs,...Object.fromEntries(['stance','action','step','hit','jump'].map(pose=>[pose,replacementRoot.higgs+pose+'.png']))};
  poses.diehardman = {...poses.diehardman,...Object.fromEntries(['stance','action','step','hit','jump'].map(pose=>[pose,replacementRoot.diehardman+pose+'.png']))};
  poses.mama = Object.fromEntries(['stance','action','step','hit',...movement].map(pose=>[pose,replacementRoot.mama+pose+'.png']));
  const nativeStageIds = ['mule-camp-dry','port-knot','incinerator'];
  const wardrobe = {mama:{
    atelier:{name:'Atelier'},
    viaduc:{name:'Maintenance du viaduc', portrait:'assets/fighters/mama/viaduc/portrait.png',
      poses:Object.fromEntries(['stance','action','step','hit',...movement].map(pose=>[pose,'assets/fighters/mama/viaduc/'+pose+'.png'])),
      nativePoses:true,poseGeometry:window.StrandGeneratedGeometry?.wardrobes?.mama?.viaduc || {}}

  }};
  window.StrandAssets = {
    wardrobe,
    // Individual native PNGs; measured crops and foot anchors live separately.
    // Keep every legacy jump available as a loading/offline fallback.
    poses,
    projectiles:Object.fromEntries(['sam','higgs','cliff','recall','gate','heartman','memory']
      .map(id => [id,'assets/projectiles/'+id+'.png'])),
    generatedGeometry:window.StrandGeneratedGeometry || {},
    jumps:{...Object.fromEntries(roster.filter(id=>id!=='mama').map(id=>[id,'assets/fighters/'+id+'-jump.png'])),diehardman:replacementRoot.diehardman+'jump.png',higgs:replacementRoot.higgs+'jump.png'},
    geometry: {
      sam:{jumpAnchor:.5,jumpBaseline:1306/1536,jumpScale:1},
      fragile:{jumpAnchor:.5,jumpBaseline:1226/1536,jumpScale:1},
      cliff:{jumpAnchor:.5,jumpBaseline:1483/1536,jumpScale:1},
      mule:{jumpAnchor:.5,jumpBaseline:1343/1536,jumpScale:1},
      heartman:{jumpAnchor:.5,jumpBaseline:1393/1536,jumpScale:1},
      higgs:{jumpAnchor:.69,jumpBaseline:1258/1312,jumpScale:1},
      diehardman:{jumpAnchor:.51,jumpBaseline:1217/1478,jumpScale:1}
    },
    hero: story['sam-higgs-rival'],
    story,
    fighters: {...illustrations('fighters', roster, '-stance'),...replacement('stance')},
    actions: {...illustrations('fighters', roster, '-action'),...replacement('action')},
    steps: {...illustrations('fighters', roster, '-step'),...replacement('step')},
    hits: {...illustrations('fighters', roster, '-hit'),...replacement('hit')},
    props: {
      cargo:'assets/props/mule-cargo.webp',
      closedParcel:'assets/props/courier-parcel-closed.png',
      openParcel:'assets/props/courier-parcel-open.png',
      bridgeDeck:'assets/props/bridge-deck.png',
      goldImprint:'assets/props/gold-imprint.png',
      heartmanMonitor:'assets/props/heartman-monitor.png'
    },
    portraits: {...illustrations('fighters', roster, '-portrait'),...replacement('portrait')},
    supportPortraits:{...Object.fromEntries(['deadman','amelie','bridget'].map(id=>[id,'assets/fighters/support/'+id+'-portrait.png'])),lockne:'assets/static-20261125/lockne-portrait.png'},
    finishers: illustrations('finishers', roster),
    stages: {...illustrations('stages', arenas),...stageLayers('',nativeStageIds)},
    skyplates: stageLayers('-sky'),
    distants: stageLayers('-distant'),
    midgrounds: stageLayers('-midground'),
    floors: stageLayers('-floor'),
    stageGeometry: {
      // All layers retain their source aspect ratio. base positions anchorY in
      // the source at this screen height; transparent padding is never stretched.
      shore:{distant:{anchorY:680/724,base:594},middle:{anchorY:557/724,base:596,alpha:.9},floor:{anchorY:221/724}},
      terminal:{distant:{anchorY:680/724,base:594},middle:{anchorY:701/724,base:594},floor:{anchorY:214/724}},
      battlefield:{distant:{anchorY:1,base:594},middle:{anchorY:696/724,base:594},floor:{anchorY:229/724}},
      'mule-camp':{distant:{anchorY:.96,base:609},middle:{anchorY:.97,base:576},floor:{anchorY:302/724}},
      'mule-camp-dry':{distant:{anchorY:679/724,base:598},middle:{anchorY:686/724,base:592},floor:{anchorY:300/724}},
      'heartman-lab':{distant:{anchorY:.96,base:590},middle:{anchorY:.96,base:590},floor:{anchorY:225/724}},
      'mama-workshop':{distant:{anchorY:.96,base:564},middle:{anchorY:.93,base:578},floor:{anchorY:201/724}},
      'ruined-factory':{distant:{anchorY:.96,base:592},middle:{anchorY:.93,base:596},floor:{anchorY:202/724}},
      'timefall-shelter':{distant:{anchorY:.96,base:592},middle:{anchorY:.93,base:576},floor:{anchorY:235/724}},
      'tar-basin':{distant:{anchorY:.96,base:592},middle:{anchorY:.95,base:572},floor:{anchorY:213/724}},
      'mountain-pass':{distant:{anchorY:707/724,base:594},middle:{anchorY:687/724,base:594},floor:{anchorY:194/724}},
      'port-knot':{distant:{anchorY:1,base:598},middle:{anchorY:1,base:594},floor:{anchorY:367/941}},
      incinerator:{distant:{anchorY:1,base:598},middle:{anchorY:1,base:594},floor:{anchorY:273/809}}
    },
    foregrounds: {...illustrations('stages', arenas, '-foreground'),...stageLayers('-foreground',nativeStageIds)}
  };
})();
