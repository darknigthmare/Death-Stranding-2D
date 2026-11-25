/* Read-only inspection of the existing Boss closure. Hooks live only in the VM. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const repo=path.resolve(__dirname,'../..'),mode=path.join(repo,'modes/echos-de-la-greve');
const clone=value=>JSON.parse(JSON.stringify(value));
function inspectEngine(){
  const sources=Object.fromEntries(['boss.js','content.js','assets.js','campaign.js'].map(file=>[file,fs.readFileSync(path.join(mode,file),'utf8')]));
  const storage=new Map(),storageCalls=[];
  const host={localStorage:{getItem(key){storageCalls.push(['get',key]);return storage.get(key)||null;},setItem(key,value){storageCalls.push(['set',key]);storage.set(key,value);}},requestAnimationFrame:()=>1,cancelAnimationFrame(){}};
  const context={window:host,Image:class{constructor(){this.complete=false;this.naturalWidth=0;this.naturalHeight=0;}},structuredClone};
  for(const name of ['content.js','assets.js','campaign.js'])vm.runInNewContext(sources[name],context,{filename:name});
  const marker='  host.StrandBoss={';
  if(sources['boss.js'].split(marker).length!==2)throw Error('Review the Boss export before extracting.');
  const hook=`  host.__bossAudit={W,H,FLOOR,STEP,RULES,STORE,RUSH_RULES,RUSH_STORE,RUSH_ORDER,encounters,players,directions,costs,
    makeState,newBoss,beginAction,perform,movePlayer,prepareAttack,launchAttack,bossTick,projectilesTick,damageBoss,damagePlayer,damageCargo,
    melee,bossPose,bossBodyHeight,rectangleTouchesPlayer,interact,finish,finishRush,step,getCurrent:()=>current,
    traceUpdates(s,count){const calls=[],original=perform;try{perform=(state,action)=>{calls.push({kind:action.kind,frame:action.frame});return original(state,action);};for(let i=0;i<count;i++)movePlayer(s);}finally{perform=original;}return calls;},
    probePerform(s,a){const before=clone(s.p),from=s.shots.length,calls=[],original=melee;
      try{melee=(state,damage,reach,stagger=18)=>{calls.push({baseDamage:damage,reach,stagger});return original(state,damage,reach,stagger);};perform(s,a);}
      finally{melee=original;}
      return {melee:calls,shots:s.shots.slice(from).map(q=>({kind:q.kind,baseDamage:q.damage,width:q.w,height:q.h,velocity:q.vx,ttl:q.ttl,delay:q.delay,spawnOffsetX:q.x-before.x,heightAboveFloor:FLOOR-q.y})),
        displacement:s.p.x-before.x,invulnerability:s.p.invuln,shield:s.p.shield,exposure:s.boss.exposed,
        markerBefore:before.marker,markerAfter:clone(s.p.marker)};
    }};\n`;
  vm.runInNewContext(sources['boss.js'].replace(marker,hook+marker),context,{filename:'boss.js'});
  const drawing=new Proxy({createLinearGradient:()=>({addColorStop(){}}),measureText:s=>({width:String(s).length*7})},{get:(o,k)=>o[k]||(()=>{})});
  const canvas={width:1280,height:720,getContext:()=>drawing};
  function start(options={}){host.StrandBoss.start({canvas,p1:'sam',boss:'lion',difficulty:'normal',isolated:true,manualClock:true,sound:false,...options});return host.__bossAudit.getCurrent();}
  return {repo,mode,sources,context,host,api:host.StrandBoss,audit:host.__bossAudit,content:host.StrandContent,campaign:host.StrandCampaign,canvas,start,storage,storageCalls};
}
function prepareAction(audit,action,variant='base'){
  const owner=Object.keys(audit.directions).find(id=>audit.directions[id].includes(action))||'common';
  const s=audit.makeState({p1:owner==='common'?(variant==='crate'?'mule':'sam'):owner,boss:'lion',difficulty:'normal'});
  s.phase='active';s.p.x=400;s.boss.x=900;s.boss.hp=s.boss.maxHp=5000;
  let key=action;
  if(owner!=='common'){
    key='special';const direction=audit.directions[owner].indexOf(action);
    if(direction)s.p.keys[direction===1?'right':'left']=true;
  }else if(action==='grab')key='throw';
  else if(action==='sweep'){key='light';s.p.keys.down=true;}
  else if(action==='lift'){key='heavy';s.p.keys.down=true;}
  const marker={recall:'post',retrieve:'crate',winch:'anchor'}[action]||({return:'beacon',release:'memory',crate:'crate',anchor:'anchor'})[variant];
  if(marker)s.p.marker={kind:marker,x:486,ttl:300};
  const energy=s.p.energy;audit.beginAction(s,key);
  if(!s.p.act||s.p.act.kind!==action)throw Error('Cannot inspect '+action+' / '+variant);
  return {s,owner,key,act:clone(s.p.act),cost:energy-s.p.energy};
}
module.exports={inspectEngine,prepareAction,clone,repo,mode};
