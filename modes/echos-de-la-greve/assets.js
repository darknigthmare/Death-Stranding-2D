/* Relative paths also work when the combat menu is opened directly from disk. */
(() => {
  function illustrations(folder, ids, suffix = '') {
    return Object.fromEntries(ids.map(id => [id, 'assets/' + folder + '/' + id + suffix + '.webp']));
  }
  const story = illustrations('story', [
    'shore-prologue', 'sam-intro-shore', 'sam-higgs-rival', 'sam-intro', 'sam-ending',
    'fragile-intro', 'fragile-rival', 'fragile-ending', 'higgs-intro', 'higgs-ending',
    'cliff-intro', 'cliff-rival', 'cliff-ending'
  ]);
  story['sam-rival'] = story['sam-higgs-rival'];
  story['higgs-rival'] = story['sam-higgs-rival'];
  window.StrandAssets = {
    hero: story['sam-higgs-rival'],
    story,
    fighters: {
      ...illustrations('fighters', ['sam', 'cliff'], '-stance'),
      higgs: 'assets/fighters/higgs-action.webp'
    },
    actions: illustrations('fighters', ['sam', 'higgs'], '-action'),
    portraits: illustrations('fighters', ['fragile'], '-portrait'),
    stages: illustrations('stages', ['shore', 'terminal', 'battlefield']),
    foregrounds: illustrations('stages', ['shore'], '-foreground')
  };
})();
