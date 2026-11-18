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
  window.StrandAssets = {
    hero: story['sam-higgs-rival'],
    story,
    fighters: illustrations('fighters', roster, '-stance'),
    actions: illustrations('fighters', roster, '-action'),
    steps: illustrations('fighters', roster, '-step'),
    hits: illustrations('fighters', roster, '-hit'),
    props: {cargo:'assets/props/mule-cargo.webp'},
    portraits: illustrations('fighters', roster, '-portrait'),
    finishers: illustrations('finishers', roster),
    stages: illustrations('stages', arenas),
    foregrounds: illustrations('stages', arenas, '-foreground')
  };
})();
