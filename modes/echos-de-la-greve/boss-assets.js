/* Native sources remain unchanged. Geometry supplies measured alpha bounds for drawImage crops. */
(() => {
  const poses = id => Object.fromEntries(['idle','attack','stagger'].map(pose =>
    [pose,'assets/bosses/'+id+'/'+pose+'.png']));
  window.StrandBossAssets = {
    sprites:{lion:poses('lion'),squid:poses('squid'),whale:poses('whale'),giant:poses('giant'),
      'mule-truck':{idle:'assets/bosses/mule-truck/idle.png',damaged:'assets/bosses/mule-truck/damaged.png'}},
    effects:Object.fromEntries(['tar-orb','tar-spike','chiral-ring','mule-bolt'].map(id =>
      [id,'assets/projectiles/boss-'+id+'.png'])),
    geometry:window.StrandBossGeometry || {}
  };
})();
