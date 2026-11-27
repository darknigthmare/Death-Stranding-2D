#!/usr/bin/env node
'use strict';
// Execute the shipped source, instrumented only in this test process.
// The canvas and directional art descriptors below are fixtures, not visual acceptance.
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const fightSource=read('modes/echos-de-la-greve/fight.js');
const kitSource=read('modes/echos-de-la-greve/original-kits.js');
const contentSource=read('modes/echos-de-la-greve/content.js');
const baselineCommit='07c818cd3942c0e1925bb0cc32dfe73da19ff297';
let baseSource;
try {
  baseSource=process.env.ORIGINAL_KITS_BASE_SOURCE?fs.readFileSync(process.env.ORIGINAL_KITS_BASE_SOURCE,'utf8'):
    execFileSync('git',['show',baselineCommit+':modes/echos-de-la-greve/fight.js'],{cwd:root,encoding:'utf8',maxBuffer:2000000,stdio:['ignore','pipe','pipe']});
} catch(error) {
  throw new Error('Canonical regression baseline unavailable. Use a full-history checkout or set ORIGINAL_KITS_BASE_SOURCE to its extracted fight.js. '+error.message);
}



function buildHarness(fightSource, kitSource, contentSource, options={}) {
  const draws=[],scales=[];
  const context=new Proxy({},{
    get(target,key){
      if(key==='measureText')return text=>({width:String(text).length*8});
      if(key==='createLinearGradient'||key==='createRadialGradient')return ()=>({addColorStop(){}});
      if(key==='drawImage')return (...args)=>draws.push(args);
      if(key==='scale')return (...args)=>scales.push(args);
      if(key==='getImageData')return ()=>({data:new Uint8ClampedArray(4)});
      return target[key]??(()=>{});
    },set(target,key,value){target[key]=value;return true;}
  });
  class FakeImage {constructor(){this.complete=true;this.naturalWidth=100;this.naturalHeight=200;}set src(value){this._src=value;}get src(){return this._src;}}
  const window={requestAnimationFrame:()=>1,cancelAnimationFrame(){},StrandAssets:{}};
  const clone=value=>JSON.parse(JSON.stringify(value));
  Function('window',contentSource)(window);
  const poses={};
  for(const pose of ['stance','guard','crouch','jump','light','heavy','hurt','tether','anchor','reel','fall','taunt','victory','walk1','walk2']){
    poses[pose]={};for(const side of ['left','right'])poses[pose][side]={src:'assets/test/balise-'+pose+'-'+side+'.png',crop:[0,0,100,200],anchorX:.5,baselineY:1,heightRatio:1};
  }
  const props={};for(const name of ['anchor','ropeHook'])props[name]={src:'assets/test/'+name+'.png',crop:[0,0,100,200],anchorX:.5,baselineY:1};
  window.StrandOriginalKitsAssets=options.art || {version:1,kits:{balise:{ready:true,poses,props}}};
  if(options.kit!==false)Function('window',kitSource)(window);
  const hook="host.__fightTest={get match(){return match;},roster,moves,directional,step,beginAttack,updateFighter,contacts,hit,strike,hurt,immune,requestTeamAction,advanceTeams,transferTeam,drawOriginalFighter:typeof drawOriginalFighter==='function'?drawOriginalFighter:null,originalObjectContacts:typeof originalObjectContacts==='function'?originalObjectContacts:null,draw,finishMatch};\n  ";
  const hooked=fightSource.replace('  host.StrandFight = {',hook+'host.StrandFight = {');
  Function('window','Image','document','structuredClone',hooked)(window,FakeImage,{hidden:false},clone);
  const canvas={getContext:()=>context,width:1280,height:720};
  function start(extra={}) {
    window.StrandFight.start({canvas,p1:window.StrandOriginalKits?.enabled?'balise':'sam',p2:'sam',stage:'shore',mode:'local',sound:false,ambienceVolume:0,roundsToWin:1,...extra});
    const m=window.__fightTest.match;m.phase='fight';m.phaseTicks=0;return m;
  }
  function ticks(n){for(let i=0;i<n;i++)window.__fightTest.step(window.__fightTest.match);}
  function action(key,side=0){const m=window.__fightTest.match;window.__fightTest.beginAttack(m,m.f[side],m.f[1-side],key,m.beat);}
  return {window,api:window.StrandFight,hooks:window.__fightTest,canvas,context,draws,scales,start,ticks,action,clone};
}

function runOriginalTests(buildHarness,fightSource,kitSource,contentSource,baseSource) {
  const passed=[];
  function check(value,message){if(!value)throw Error(message);}
  function close(actual,expected,message){check(Math.abs(actual-expected)<1e-6,message+': '+actual+' !== '+expected);}
  function test(name,run){run();passed.push(name);}
  const build=options=>buildHarness(fightSource,kitSource,contentSource,options);
  test('Complete directional art is mandatory; missing pose or prop keeps eight kits',()=>{
    const h=build();check(h.window.StrandOriginalKits.enabled,'complete kit disabled');
    const broken=h.clone(h.window.StrandOriginalKitsAssets);delete broken.kits.balise.poses.reel.left;
    const b=build({art:broken});check(!b.window.StrandOriginalKits.enabled,'partial art enabled');
    check(Object.keys(b.hooks.roster).length===8&&b.api.originalCharacterIds.length===0,'base eight not preserved');
    const prop=h.clone(h.window.StrandOriginalKitsAssets);delete prop.kits.balise.props.ropeHook;
    check(!build({art:prop}).window.StrandOriginalKits.enabled,'partial props enabled');
  });
  test('Catalogue identities, normal frame data and exact three special costs',()=>{
    const h=build();const m=h.start();check(m.f[0].id==='balise','wrong engine ID');
    check(h.window.StrandOriginalKits.catalogueToEngine['ldm-char-balise']==='balise','missing catalogue map');
    check(h.window.StrandAssets.fighters.balise==='assets/test/balise-stance-right.png','missing selection source');
    check(h.window.StrandAssets.portraits.balise===h.window.StrandAssets.fighters.balise,'missing relay portrait');
    const sheet=h.window.StrandContent.fighters.balise.frameData;
    check(sheet===h.window.StrandOriginalKits.moveSheets.balise&&sheet.length===6,'missing public move sheet');
    check(sheet.filter(row=>row.category==='normal').length===3&&sheet.filter(row=>row.category==='special').length===3,'wrong move categories');
    check(sheet.find(row=>row.key==='baliseLift').input==='2 + F','missing low heavy command');
    check(Object.keys(h.window.StrandContent.fighters.sam).every(key=>key!=='frameData'),'canonical profile altered');
    for(const [key,start,active,recover,cost] of [['balise',18,4,24,28],['baliseAnchor',24,1,21,18],['baliseReel',10,6,22,16]]){
      const d=h.hooks.moves[key];check([d.start,d.active,d.recover,d.cost].join()=== [start,active,recover,cost].join(),'catalogue mismatch '+key);
    }
    for(const [input,key,start,active,recover,damage] of [['light','baliseLight',7,3,12,5],['heavy','baliseHeavy',15,4,24,10],['lift','baliseLift',13,4,25,8]]){
      m.f[0].act=null;h.action(input);const d=h.hooks.moves[key];check(m.f[0].act.key===key,'normal not mapped');
      check([d.start,d.active,d.recover,d.damage].join()===[start,active,recover,damage].join(),'normal mismatch');
    }
    const low=build(),n=low.start();low.api.input(1,'down',true);low.api.input(1,'heavy',true);low.ticks(1);
    check(n.f[0].act.key==='baliseLift','2 + F did not reach Balise rising normal');
    low.draws.length=0;low.hooks.drawOriginalFighter(n,n.f[0],0);
    check(low.draws.some(args=>args[0].src==='assets/test/balise-heavy-right.png'),'low heavy reused a canonical drawing');
    const sweep=build(),p=sweep.start();sweep.api.input(1,'down',true);sweep.api.input(1,'light',true);sweep.ticks(1);
    check(p.f[0].act.key==='sweep','2 + L lost the common sweep');
    sweep.draws.length=0;sweep.hooks.drawOriginalFighter(p,p.f[0],0);
    check(sweep.draws.some(args=>args[0].src==='assets/test/balise-light-right.png'),'low light reused a canonical drawing');
  });
  test('Tether commits 28 on miss, insufficient resource refuses and no free repeat',()=>{
    const h=build(),m=h.start(),f=m.f[0];h.action('balise');close(f.chiral,14,'cost');h.ticks(46);
    check(f.act===null,'recovery did not end at 46');close(m.f[1].hp,100,'out-of-range tether hit');h.action('balise');
    check(f.act===null&&f.notice==='CHIRAL INSUFFISANT','free repeat');
  });
  test('Tether begins at tick 18, hits once, holds a grounded target and draws finite reach',()=>{
    const h=build(),m=h.start(),f=m.f[0],v=m.f[1];f.x=400;v.x=500;h.action('balise');h.ticks(17);check(v.hp===100,'early tether');
    h.ticks(1);check(v.hp===90&&v.stun===18&&v.grounded,'wrong ground hit');
    h.ticks(15);check(v.hp===90,'multi-hit tether');
    close(h.hooks.moves.balise.reach,44*2.4,'range');
  });
  test('Standing guard, crouching guard and airborne targets avoid tether damage',()=>{
    for(const mode of ['guard','low','air']){
      const h=build(),m=h.start(),f=m.f[0],v=m.f[1];f.x=400;v.x=500;
      if(mode==='air'){v.grounded=false;v.y=160;v.vy=0;}else v.keys={guard:true,down:mode==='low'};
      h.action('balise');h.ticks(18);check(v.hp===100,'defense failed: '+mode);
      if(mode!=='air'){check(v.blockStun>0,'guard did not block');close(v.vx,0,'guard pulled target');}
    }
  });
  test('Directional inputs are relative to opponent and do not overwrite the base eight',()=>{
    for(const [x,ox,forward,back] of [[400,800,'right','left'],[900,500,'left','right']]){
      const h=build(),m=h.start();m.f[0].x=x;m.f[1].x=ox;h.api.input(1,forward,true);h.api.input(1,'special',true);h.ticks(1);
      check(m.f[0].act.key==='baliseAnchor','wrong forward input');
      m.f[0].act=null;m.f[0].keys={};m.f[0].queue=[];m.f[0].chiral=100;
      m.f[0].marker={kind:'baliseAnchor',x:x+30,ttl:100,ownerId:'balise',ownerSide:0,ownerMember:null};
      h.api.input(1,back,true);h.api.input(1,'special',true);h.ticks(1);check(m.f[0].act.key==='baliseReel','wrong back input');
    }
  });
  test('Anchor arms only at tick 24, replaces one object and expires without refund',()=>{
    const h=build(),m=h.start(),f=m.f[0];h.action('baliseAnchor');h.ticks(23);check(!f.marker,'early anchor');
    h.ticks(1);check(f.marker.kind==='baliseAnchor'&&f.marker.x===528&&f.marker.ttl===240,'wrong anchor');
    check(f.marker.ownerSide===0&&f.marker.ownerMember===null,'wrong owner');
    h.ticks(46);f.chiral=100;h.action('baliseAnchor');h.ticks(24);check(f.marker.ttl===240,'anchor not replaced');
    h.ticks(239);check(f.marker?.ttl===1,'wrong lifetime');h.ticks(1);check(!f.marker,'expired anchor remains');
  });
  test('Occupied placement and interrupted placement lose paid cost without spawning',()=>{
    const h=build(),m=h.start(),f=m.f[0],v=m.f[1];f.x=400;v.x=466;h.action('baliseAnchor');h.ticks(24);
    check(!f.marker&&f.notice==='ZONE D’ANCRAGE OCCUPÉE','occupied placement spawned');check(f.chiral<25,'placement refunded');
    const b=build(),n=b.start(),a=n.f[0];b.action('baliseAnchor');b.ticks(10);
    b.hooks.hit(n,n.f[1],a,'light',b.hooks.moves.light,-1);b.ticks(40);
    check(!a.marker&&a.chiral<30,'interrupted anchor spawned or refunded');
  });
  test('Recall requires an owned live anchor and pays once; missing or already reached refuses',()=>{
    const h=build(),m=h.start(),f=m.f[0];h.action('baliseReel');check(!f.act&&f.chiral===42,'missing anchor charged');
    f.marker={kind:'baliseAnchor',x:f.x+66,ttl:240,ownerId:'balise',ownerSide:1,ownerMember:null};h.action('baliseReel');check(!f.act,'foreign anchor accepted');
    f.marker.ownerSide=0;f.marker.x=f.x;h.action('baliseReel');check(!f.act&&f.chiral===42,'zero-distance recall charged');
    f.marker.x=f.x+66;h.action('baliseReel');check(f.act.key==='baliseReel'&&f.chiral===26,'recall cost');
  });
  test('Recall moves continuously in six active ticks, consumes the anchor and has no immunity',()=>{
    const h=build(),m=h.start(),f=m.f[0];f.marker={kind:'baliseAnchor',x:528,ttl:240,ownerId:'balise',ownerSide:0,ownerMember:null};
    h.action('baliseReel');h.ticks(9);close(f.x,462,'early movement');
    let previous=f.x;for(let tick=10;tick<16;tick++){h.ticks(1);check(f.x-previous>0&&f.x-previous<=11,'teleport/overshoot');check(!h.hooks.immune(f),'reel invulnerability');previous=f.x;}
    close(f.x,528,'destination');check(!f.marker,'anchor not consumed');h.ticks(23);check(!f.act,'recovery did not end');
  });
  test('Recall is stopped by an opponent, including an entering support, without side swapping',()=>{
    const h=build(),m=h.start(),f=m.f[0],v=m.f[1];f.x=400;v.x=460;
    f.marker={kind:'baliseAnchor',x:600,ttl:100,ownerId:'balise',ownerSide:0,ownerMember:null};h.action('baliseReel');h.ticks(16);
    check(f.x<=416&&v.x===460,'crossed or pushed opponent');
    const b=build(),n=b.start({teams:[['balise','sam'],['higgs','cliff']]});n.f[0].x=400;n.f[1].x=900;
    b.hooks.requestTeamAction(n,1,'assist');const reserve=n.teams[1].members[1];reserve.x=460;
    n.f[0].marker={kind:'baliseAnchor',x:600,ttl:100,ownerId:'balise',ownerSide:0,ownerMember:0};b.action('baliseReel');b.ticks(16);
    check(n.f[0].x<=416&&reserve.x===460,'crossed support');
  });
  test('Anchor expiring during recall startup causes paid failure, not teleport or life extension',()=>{
    const h=build(),m=h.start(),f=m.f[0];f.marker={kind:'baliseAnchor',x:528,ttl:5,ownerId:'balise',ownerSide:0,ownerMember:null};
    h.action('baliseReel');h.ticks(16);check(f.x===462&&!f.marker&&f.act.failed,'expired recall moved');check(f.chiral<27,'failed recall refunded');
  });
  test('Stage edges clamp placement and physical recall in both directions',()=>{
    for(const [x,ox,expected] of [[1220,1200,1154],[60,100,126],[1200,1220,1232],[80,60,48]]){
      const h=build(),m=h.start(),f=m.f[0];f.x=x;m.f[1].x=ox;h.action('baliseAnchor');
      // Move the opponent clear after fixing the telegraphed placement.
      m.f[1].x=640;h.ticks(24);check(f.marker?.x===expected,'anchor edge '+x);
      f.act=null;f.chiral=100;h.action('baliseReel');h.ticks(16);check(f.x>=48&&f.x<=1232,'left arena');
    }
  });
  test('A melee strike destroys an anchor once, with no hit damage or chiral refund',()=>{
    const h=build(),m=h.start(),f=m.f[0],v=m.f[1];f.x=400;v.x=540;
    f.marker={kind:'baliseAnchor',x:500,ttl:100,ownerId:'balise',ownerSide:0,ownerMember:null};
    h.action('sweep',1);h.ticks(8);check(!f.marker,'anchor not destroyed');check(f.hp===100,'anchor collision damaged owner');check(v.chiral<43,'object granted hit meter');
  });
  test('A low projectile can destroy an anchor; no ghost contact survives its destruction',()=>{
    const h=build(),m=h.start(),f=m.f[0];f.x=400;m.f[1].x=700;
    f.marker={kind:'baliseAnchor',x:500,ttl:100,ownerId:'balise',ownerSide:0,ownerMember:null};
    m.shots.push({kind:'crate',owner:1,x:530,y:570,vx:-20,ttl:10,age:0});h.ticks(1);
    check(!f.marker&&!m.shots.length&&f.hp===100,'projectile-object collision failed');
  });
  test('Ligne de vie telegraphs 24 ticks, stays guardable and leaves at tick 55',()=>{
    const h=build(),m=h.start({teams:[['sam','balise'],['higgs','cliff']]});m.f[0].x=430;m.f[1].x=478;
    const reserve=m.teams[0].members[1],before=reserve.chiral;check(h.hooks.requestTeamAction(m,0,'assist'),'assist refused');
    close(m.teams[0].cohesion,25,'assist cost');h.ticks(23);check(m.f[1].hp===100,'early assist');
    h.ticks(1);check(m.f[1].hp===94,'assist missed local target');check(reserve.chiral===before+4,'resource assigned to wrong actor');
    // Clear hitstop only to inspect the authored simulation duration.
    m.hstop=0;h.ticks(31);check(!m.teams[0].busy&&m.teams[0].assistCooldown===360,'assist exit mismatch');
    const b=build(),n=b.start({teams:[['sam','balise'],['higgs','cliff']]});n.f[0].x=430;n.f[1].x=478;n.f[1].keys.guard=true;b.hooks.requestTeamAction(n,0,'assist');b.ticks(24);
    check(n.f[1].hp===100&&n.f[1].blockStun>0,'assist not guardable');
  });
  test('An entering Balise can be interrupted before emission and remains paid',()=>{
    const h=build(),m=h.start({teams:[['sam','balise'],['higgs','cliff']]});h.hooks.requestTeamAction(m,0,'assist');const support=m.teams[0].members[1];
    h.hooks.hit(m,m.f[1],support,'heavy',h.hooks.moves.heavy,-1);m.hstop=0;h.ticks(55);
    check(m.f[1].hp===100&&!m.teams[0].busy&&m.teams[0].cohesion<31,'interrupted assist emitted/refunded');
  });
  test('Team anchor saves require exact rules and stable owner; tag recalls paid object',()=>{
    const h=build(),m=h.start({teams:[['balise','sam'],['higgs','cliff']]});h.action('baliseAnchor');h.ticks(46);
    const point=h.api.team.checkpoint();check(point.originalRules==='balise-1'&&h.api.team.validCheckpoint(point),'original checkpoint rejected');
    const altered=h.clone(point);altered.state.teams[0].members[0].marker.ownerMember=1;check(!h.api.team.validCheckpoint(altered),'wrong member accepted');
    const foreign=h.clone(point);foreign.state.teams[1].members[0].marker=h.clone(point.state.teams[0].members[0].marker);check(!h.api.team.validCheckpoint(foreign),'cross-kit object accepted');
    const missing=h.clone(point);delete missing.originalRules;check(!h.api.team.validCheckpoint(missing),'missing rules accepted');
    check(h.api.team.restore(point),'valid save failed restore');h.api.pause(false);
    check(h.hooks.requestTeamAction(m,0,'tag'),'tag refused');h.ticks(15);
    check(m.f[0].id==='sam'&&!m.teams[0].members[0].marker,'reserve kept anchor');
  });
  test('Original checkpoint rejects malformed reel destination and cross-character special',()=>{
    const h=build(),m=h.start({teams:[['balise','sam'],['higgs','cliff']]});m.f[0].marker={kind:'baliseAnchor',x:528,ttl:100,ownerId:'balise',ownerSide:0,ownerMember:0};
    h.action('baliseReel');h.ticks(10);const point=h.api.team.checkpoint();check(h.api.team.validCheckpoint(point),'legitimate reel save rejected');
    const broken=h.clone(point);broken.state.teams[0].members[0].act.destination=99999;check(!h.api.team.validCheckpoint(broken),'invalid destination accepted');
    const other=h.clone(point);other.state.teams[1].members[0].act=h.clone(point.state.teams[0].members[0].act);check(!h.api.team.validCheckpoint(other),'cross-kit move accepted');
  });
  test('Directional drawings are selected without runtime mirroring or stock action reuse',()=>{
    const h=build(),m=h.start(),f=m.f[0];h.draws.length=0;h.scales.length=0;f.face=-1;f.act={key:'baliseReel',t:11,destination:400};h.hooks.drawOriginalFighter(m,f,0);
    check(h.draws.some(args=>args[0].src==='assets/test/balise-reel-left.png'),'left reel asset absent');
    check(!h.scales.some(args=>args[0]===-1),'sprite mirrored');
    h.draws.length=0;f.face=1;f.act=null;f.guard=true;h.hooks.drawOriginalFighter(m,f,0);
    check(h.draws.some(args=>args[0].src==='assets/test/balise-guard-right.png'),'right guard asset absent');
    h.draws.length=0;f.guard=false;f.grounded=false;f.y=80;f.act={key:'air',t:8};h.hooks.drawOriginalFighter(m,f,0);
    check(h.draws.some(args=>args[0].src==='assets/test/balise-light-right.png'),'air attack hidden behind jump pose');
  });
  test('A Balise victory uses its key pose without inventing a canonical finisher',()=>{
    const h=build(),m=h.start();m.f[1].hp=0;h.ticks(1);check(m.phase==='roundover'&&m.winner===1&&!m.finisher,'stock finisher enabled');
    h.draws.length=0;h.hooks.drawOriginalFighter(m,m.f[0],0);check(h.draws.some(args=>args[0].src.includes('victory-right')),'victory key pose absent');
  });
  test('Local original tapes carry strict rules and replay the exact terminal state',()=>{
    const h=build();let result=null;h.start({record:true,onEnd:r=>{result=r;}});h.api.input(1,'right',true);
    for(let t=0;t<1800&&!result;t++){
      if(t>=55&&t%52===3)h.api.input(1,'heavy',true);
      if(t>=55&&t%52===4)h.api.input(1,'heavy',false);
      h.ticks(1);
    }
    check(result?.replay,'duel did not complete');const tape=result.replay;check(tape.originalRules==='balise-1'&&h.api.validReplay(tape),'invalid recorded tape');
    const bad=h.clone(tape);delete bad.originalRules;check(!h.api.validReplay(bad),'unversioned original replay accepted');
    check(!build({kit:false}).api.validReplay(tape),'kitless replay accepted');
    const b=build();let replayResult=null;b.api.start({canvas:b.canvas,replay:tape,sound:false,onEnd:r=>{replayResult=r;}});
    // The test recorded a match after skipping only the decorative intro.
    b.hooks.match.phase='fight';b.hooks.match.phaseTicks=0;
    for(let t=0;t<=tape.ticks&&!replayResult;t++)b.ticks(1);
    check(replayResult&&!replayResult.replayMismatch,'replay diverged');
    check(replayResult.winner===result.winner&&replayResult.vitality===result.vitality&&JSON.stringify(replayResult.rounds)===JSON.stringify(result.rounds),'replay result differs');
  });
  test('Original deterministic clock requires an explicit rules identifier',()=>{
    const h=build();let rejected=false;try{h.start({clock:'network'});}catch{rejected=true;}check(rejected,'untagged clock accepted');
    h.start({clock:'network',originalRules:'balise-1'});check(h.api.network.checkpoint()!==null,'tagged deterministic recipe rejected');
  });
  if(baseSource)test('Eight canonical kits retain identical deterministic state with module absent or loaded',()=>{
    const oldBuild=()=>buildHarness(baseSource,kitSource,contentSource,{kit:false}),newBuild=()=>build({kit:false});
    for(const kit of [false,true])for(const id of ['sam','fragile','higgs','cliff','mule','diehardman','mama','heartman']){
      const a=oldBuild(),b=build({kit});a.start({p1:id,p2:'higgs'});b.start({p1:id,p2:'higgs'});
      for(let tick=0;tick<400;tick++){
        for(const h of [a,b]){
          if(tick===0)h.api.input(1,'right',true);
          if(tick===45)h.api.input(1,'right',false);
          if(tick%75===50)h.api.input(1,'special',true);
          if(tick%75===51)h.api.input(1,'special',false);
          if(tick%42===6)h.api.input(1,'heavy',true);
          if(tick%42===7)h.api.input(1,'heavy',false);
          h.ticks(1);
        }
        check(JSON.stringify(a.api.snapshot())===JSON.stringify(b.api.snapshot()),'canonical divergence '+id+' tick '+tick);
      }
    }
  });
  return passed;
}

const passed=runOriginalTests(buildHarness,fightSource,kitSource,contentSource,baseSource);
console.log(JSON.stringify({suite:'original-kits',rules:'balise-1',passed:passed.length,canonicalComparisonTicks:6400,
  host:'Node with simulated canvas and image descriptors',baselineCommit,groups:passed},null,2));
