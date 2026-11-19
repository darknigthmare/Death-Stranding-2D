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
  const roster = Object.keys(window.StrandContent.fighters);
  const arenas = Object.keys(window.StrandContent.stages);
  const stageLayers = (suffix, ids=arenas) => Object.fromEntries(ids.map(id => [id, 'assets/stages/' + id + suffix + '.png']));
  // Register only delivered files. A missing production batch must not create broken URLs.
  const movement = ['guard','crouch','rise','apex','fall'];
  const fixedFrame = poses => Object.fromEntries(poses.flatMap(pose => [
    [pose+'Anchor',.5], [pose+'Baseline',1017/1020], [pose+'Scale',1020/920]
  ]));
  const wardrobe = {mama:{
    atelier:{name:'Atelier', poses:illustrations('fighters/mama/atelier',movement), geometry:fixedFrame(movement)},
    viaduc:{name:'Maintenance du viaduc', portrait:'assets/fighters/mama/viaduc/portrait.webp',
      poses:illustrations('fighters/mama/viaduc',['stance','action','step','hit',...movement]),
      geometry:{...fixedFrame(['stance','action','step','hit',...movement]),motionFrames:1}}
  }};
  window.StrandAssets = {
    wardrobe,
    jumps:Object.fromEntries(roster.filter(id=>id!=='mama').map(id=>[id,'assets/fighters/'+id+'-jump.png'])),
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
    fighters: illustrations('fighters', roster, '-stance'),
    actions: illustrations('fighters', roster, '-action'),
    steps: illustrations('fighters', roster, '-step'),
    hits: illustrations('fighters', roster, '-hit'),
    props: {
      cargo:'assets/props/mule-cargo.webp',
      closedParcel:'assets/props/courier-parcel-closed.png',
      openParcel:'assets/props/courier-parcel-open.png',
      bridgeDeck:'assets/props/bridge-deck.png',
      goldImprint:'assets/props/gold-imprint.png',
      heartmanMonitor:'assets/props/heartman-monitor.png'
    },
    portraits: illustrations('fighters', roster, '-portrait'),
    finishers: illustrations('finishers', roster),
    stages: illustrations('stages', arenas),
    skyplates: stageLayers('-sky',['shore','terminal','battlefield','heartman-lab','mama-workshop','ruined-factory','timefall-shelter','mountain-pass']),
    distants: stageLayers('-distant',['shore','terminal','battlefield','mama-workshop','ruined-factory','mountain-pass']),
    midgrounds: stageLayers('-midground'),
    floors: stageLayers('-floor',['shore','terminal','battlefield','mama-workshop','mountain-pass']),
    stageGeometry: {
      // All layers retain their source aspect ratio. base positions anchorY in
      // the source at this screen height; transparent padding is never stretched.
      shore:{distant:{anchorY:.94,base:540},middle:{anchorY:.77,base:550,alpha:.9},floor:{anchorY:221/724}},
      terminal:{distant:{anchorY:.94,base:564},middle:{anchorY:.97,base:580},floor:{anchorY:214/724}},
      battlefield:{distant:{anchorY:.96,base:552},middle:{anchorY:.97,base:574},floor:{anchorY:229/724}},
      'mule-camp':{distant:{anchorY:.96,base:560},middle:{anchorY:.97,base:576}},
      'heartman-lab':{distant:{anchorY:.96,base:566},middle:{anchorY:.96,base:578}},
      'mama-workshop':{distant:{anchorY:.96,base:564},middle:{anchorY:.93,base:578},floor:{anchorY:201/724}},
      'ruined-factory':{distant:{anchorY:.96,base:566},middle:{anchorY:.93,base:578}},
      'timefall-shelter':{distant:{anchorY:.96,base:562},middle:{anchorY:.93,base:576}},
      'tar-basin':{distant:{anchorY:.96,base:550},middle:{anchorY:.95,base:572}},
      'mountain-pass':{distant:{anchorY:.96,base:554},middle:{anchorY:.96,base:574},floor:{anchorY:194/724}}
    },
    foregrounds: illustrations('stages', arenas, '-foreground')
  };
})();
