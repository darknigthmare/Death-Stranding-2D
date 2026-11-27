/* Independent boundary regressions for the local 2x2 profile.
 * Uses real StrandFight logic with the existing explicit DOM/Canvas adapter.
 * No browser, physical controller or image-fidelity assertion. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {world}=require('./input-host.cjs');
const root=path.resolve(__dirname,'..'),checks=[];
function make(mode='local'){
  const w=world({gamepads:false});w.load(['content.js','assets.js','fight.js']);const e=w.host.StrandFight;
  e.start({canvas:new w.Node('canvas'),teams:[['sam','fragile'],['higgs','mule']],stage:'shore',mode,roundsToWin:1,sound:false,seed:43});
  while(e.snapshot().phase==='intro')w.frames();
  const point=()=>structuredClone(e.team.checkpoint());
  const step=n=>{const until=e.snapshot().tick+n;let guard=n*3+10;while(e.snapshot().tick<until&&e.snapshot().phase!=='ended'&&guard-->0)w.frames();assert(guard>0);};
  return{w,e,point,step};
}
function check(name,fn){fn();checks.push({name,passed:true});console.log('OK — '+name);}
check('Malformed winner phases are rejected atomically instead of throwing while drawing',()=>{
  const{e,point}=make(),before=point();
  for(const phase of ['finish','cinema','roundover']){
    const bad=structuredClone(before);bad.state.phase=phase;bad.state.winner=0;
    assert.equal(e.team.validCheckpoint(bad),false,phase);
    assert.doesNotThrow(()=>assert.equal(e.team.restore(bad),false));
    assert.deepEqual(point(),before,'Invalid save must not replace the live fight');
  }
  const bad=structuredClone(before);bad.state.phase='fight';bad.state.winner=1;
  assert.equal(e.team.restore(bad),false);assert.deepEqual(point(),before);e.stop();
});
check('A corrupted orphan lock cannot silently immobilize an active or reserve member',()=>{
  const{e,point}=make(),before=point();
  for(const side of [0,1])for(const slot of [0,1]){
    const bad=structuredClone(before);bad.state.teams[side].members[slot].teamLock=true;
    assert.equal(e.team.restore(bad),false);assert.deepEqual(point(),before);
  }
  e.stop();
});
check('Malformed placed objects cannot produce NaN coordinates or a missing-anchor crash after resume',()=>{
  const{e,point}=make(),before=point();
  for(const malformed of [
    f=>{f.marker={kind:'beacon',ttl:100};f.act={key:'beacon',t:14,hit:false};},
    f=>{f.marker={kind:'crate',x:500,ttl:100,travel:'crate'};},
    f=>{f.marker={kind:'crate',x:500,ttl:100,travel:'unknown',endX:900};},
    f=>{f.scan={ttl:100};},
    f=>{f.act={key:'winch',t:11,hit:false};f.marker=null;},
    f=>{f.act={key:'higgs',t:24,hit:false};}
  ]){
    const bad=structuredClone(before);malformed(bad.state.teams[0].members[0]);
    assert.equal(e.team.restore(bad),false);assert.deepEqual(point(),before);
  }
  e.stop();
});
check('Valid tag checkpoints preserve their lock before and after transfer',()=>{
  const a=make();a.e.input(1,'tag',true);a.e.input(1,'tag',false);
  for(const advance of [8,7,14]){
    a.step(advance);const p=a.point(),b=make();
    assert.equal(b.e.team.validCheckpoint(p),true);assert.equal(b.e.team.restore(p),true);
    b.e.pause(false);a.step(1);b.step(1);
    assert.deepEqual(structuredClone(b.e.snapshot().teams),structuredClone(a.e.snapshot().teams));b.e.stop();
  }
  a.e.stop();
});
check('AI respects the same tag commitment as a player and cannot inject a dash',()=>{
  const{e,point,step}=make('cpu'),p=point();
  // Reproduce an ordinary low-life AI decision at its next 30-tick boundary.
  // Seed 12 previously selected the direct CPU dash branch during that tag.
  p.simulation=12;p.state.tick=89;p.state.teams[1].members[0].hp=30;p.state.teams[1].members[0].aiWait=0;
  assert(e.team.restore(p));e.pause(false);step(1);
  const x=e.snapshot().fighters[1].x;assert.equal(e.snapshot().teams[1].busy.kind,'tag');
  for(let i=0;i<14;i++){
    assert.equal(point().state.teams[1].members[0].dash,0);
    assert.equal(e.snapshot().fighters[1].x,x);step(1);
  }
  assert.equal(e.snapshot().fighters[1].id,'higgs');step(1);
  assert.equal(e.snapshot().fighters[1].id,'mule');e.stop();
});
check('An equal-frame final trade awards control and the finisher to the living reserve on either side',()=>{
  for(const winner of [0,1]){
    const{e,point,step}=make(),p=point();
    p.state.teams[1-winner].members[1].hp=0;
    for(let i=0;i<2;i++)Object.assign(p.state.teams[i].members[0],{hp:5,x:600+i*44,face:i?-1:1,act:{key:'light',t:4,hit:false}});
    assert(e.team.restore(p));e.pause(false);step(1);
    const state=e.snapshot(),expected=winner?'mule':'fragile';
    assert.equal(state.phase,'finish');assert.equal(state.winner,winner+1);
    assert.equal(state.fighters[winner].id,expected);assert.equal(state.fighters[winner].hp,100);
    assert.equal(state.teams[winner].members[0].hp,0,'Defeated active stays KO');
    e.input(winner+1,'finish',true);e.input(winner+1,'finish',false);
    assert.equal(e.snapshot().phase,'cinema');assert.equal(e.snapshot().fighters[winner].id,expected);
    assert(e.team.validCheckpoint(point()),'A legitimate final-state checkpoint remains valid');e.stop();
  }
});
const report={date:'2026-11-27',reviewer:'independent-original-extension-agent',scope:'Real team simulation, boundary saves and simultaneous trades; explicit DOM/Canvas adapter, not native browser',checks,passed:true,engineSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'fight.js'))).digest('hex')};
const output=process.argv.find(a=>a.startsWith('--output='));if(output){const dest=path.resolve(output.slice(9));fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,JSON.stringify(report,null,2)+'\n');}
console.log(checks.length+' independent boundary groups passed.');
