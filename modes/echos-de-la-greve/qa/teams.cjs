/* Real StrandFight simulation and explicit DOM fixture; no browser/hardware claim. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {world}=require('./input-host.cjs');
const root=path.resolve(__dirname,'..'),checks=[];
const copy=value=>JSON.parse(JSON.stringify(value));
function check(name,fn){fn();checks.push({name,passed:true});console.log('OK — '+name);}
function make(options={}){
  const w=world({gamepads:false});w.load(['content.js','assets.js','fight.js']);const e=w.host.StrandFight;
  e.start({canvas:new w.Node('canvas'),teams:[['sam','fragile'],['higgs','mule']],stage:'shore',mode:'local',roundsToWin:1,sound:false,seed:43,...options});
  w.e=e;w.s=()=>copy(e.snapshot());w.p=()=>copy(e.team.checkpoint());
  w.step=(n=1)=>{const end=w.s().tick+n;let guard=n*3+10;while(w.s().tick<end&&w.s().phase!=='ended'&&guard-->0)w.frames();assert(guard>0,'Simulation advanced');};
  w.ready=()=>{while(w.s().phase==='intro')w.step();};w.tap=(p,key)=>{e.input(p,key,true);e.input(p,key,false);};
  w.edit=fn=>{const p=w.p();fn(p.state,p);assert(e.team.restore(p),'Fixture state accepted');e.pause(false);};
  w.ready();return w;
}
check('Only two distinct supported kits per side; mirror teams allowed',()=>{
  const w=make(),valid=w.e.team.validSelection;assert(valid([['sam','fragile'],['sam','fragile']]));
  for(const value of [null,[],[['sam','sam'],['mule','higgs']],[['sam','oc'],['mule','higgs']]])assert(!valid(value));
  assert.throws(()=>w.e.start({canvas:new w.Node('canvas'),teams:[['sam','sam'],['higgs','mule']]}));w.e.stop();
});
check('Atomic assistance/tag engagement and the last 25 Cohesion',()=>{
  const w=make();w.edit(s=>s.teams[0].cohesion=25);w.tap(1,'assist');w.tap(1,'tag');
  assert.equal(w.s().teams[0].cohesion,0);assert.equal(w.s().teams[0].busy.kind,'assist');
  w.tap(1,'assist');assert.equal(w.s().teams[0].cohesion,0);w.e.stop();
});
check('Insufficient Cohesion refuses without a charge or partner appearance',()=>{
  const w=make();w.edit(s=>s.teams[0].cohesion=14);w.tap(1,'tag');w.tap(1,'assist');assert.equal(w.s().teams[0].cohesion,14);assert.equal(w.s().teams[0].busy,null);w.e.stop();
});
check('Guard, hitstun, airborne and attack prevent voluntary tags',()=>{
  for(const edit of [null,f=>f.stun=12,f=>{f.grounded=false;f.y=20;},f=>f.act={key:'light',t:1,hit:false}]){
    const w=make();if(edit)w.edit(s=>edit(s.teams[0].members[0]));else w.e.input(1,'guard',true);const before=w.s().teams[0].cohesion;w.tap(1,'tag');assert.equal(w.s().teams[0].busy,null);assert.equal(w.s().teams[0].cohesion,before);w.e.stop();
  }
});
check('Control changes at tick 15 once; life and Chiral survive transfer',()=>{
  const w=make();w.edit(s=>{s.teams[0].members[1].hp=63;s.teams[0].members[1].chiral=17;});w.tap(1,'tag');w.step(14);assert.equal(w.s().fighters[0].id,'sam');
  w.step();assert.equal(w.s().fighters[0].id,'fragile');assert.equal(w.s().fighters[0].hp,63);assert.equal(w.s().fighters[0].chiral,17);w.step(15);assert.equal(w.s().teams[0].busy,null);assert.equal(w.s().teams[0].tagCooldown,240);w.e.stop();
});
check('Reserve health never regenerates and tag cooldown prevents immediate reuse',()=>{
  const w=make();w.edit(s=>s.teams[0].members[0].hp=41);w.tap(1,'tag');w.step(30);const before=w.s().teams[0].cohesion;w.tap(1,'tag');assert.equal(w.s().teams[0].cohesion,before);
  w.step(240);assert.equal(w.s().teams[0].members[0].hp,41);w.tap(1,'tag');assert.equal(w.s().teams[0].busy.kind,'tag');w.e.stop();
});
check('Pause and hitstop freeze Cohesion and partner clocks',()=>{
  const w=make();w.tap(1,'assist');w.step(5);w.e.pause(true);const before=w.p();w.frames(90);assert.deepEqual(w.p(),before);w.e.pause(false);
  w.edit(s=>s.hstop=6);const gauge=w.s().teams[0].cohesion,frame=w.s().teams[0].busy.frame;w.step(6);assert.equal(w.s().teams[0].cohesion,gauge);assert.equal(w.s().teams[0].busy.frame,frame);w.step();assert.equal(w.s().teams[0].busy.frame,frame+1);w.e.stop();
});
check('An arriving support can be hit and interrupted without refund',()=>{
  const w=make({teams:[['fragile','sam'],['higgs','mule']]});w.tap(1,'assist');w.edit(s=>{const foe=s.teams[1].members[0];foe.x=430;foe.face=-1;foe.act={key:'light',t:4,hit:false};});w.step();
  assert.equal(w.s().teams[0].members[1].hp,95);assert.equal(w.s().teams[0].members[0].hp,100);assert(w.p().state.teams[0].busy.interrupted);assert(w.s().teams[0].cohesion<26);
  w.step(75);assert.equal(w.p().state.shots.length,0);assert(w.s().teams[0].assistCooldown>300);w.e.stop();
});
check('Support KO forbids subsequent assistance/tag and does not hurt its active ally',()=>{
  const w=make({teams:[['fragile','sam'],['higgs','mule']]});w.edit(s=>s.teams[0].members[1].hp=1);w.tap(1,'assist');w.edit(s=>{const foe=s.teams[1].members[0];foe.x=430;foe.face=-1;foe.act={key:'light',t:4,hit:false};});w.step(80);
  assert.equal(w.s().teams[0].members[1].hp,0);const before=w.s().teams[0].cohesion;w.tap(1,'tag');assert.equal(w.s().teams[0].cohesion,before);assert.equal(w.s().teams[0].members[0].hp,100);w.e.stop();
});
check('Assistance ends once and cooldown begins after its exit',()=>{
  const w=make();w.tap(1,'assist');w.step(59);assert.equal(w.s().teams[0].busy.frame,59);assert.equal(w.s().teams[0].assistCooldown,0);w.step();assert.equal(w.s().teams[0].busy,null);assert.equal(w.s().teams[0].assistCooldown,360);w.e.stop();
});
check('A hit during tag departure interrupts the transfer without refund',()=>{
  const w=make();w.tap(1,'tag');w.edit(s=>{const foe=s.teams[1].members[0];foe.x=510;foe.face=-1;foe.act={key:'light',t:4,hit:false};});w.step();
  assert.equal(w.s().teams[0].busy,null);assert.equal(w.s().teams[0].active,0);assert.equal(w.s().teams[0].tagCooldown,240);assert(w.s().teams[0].cohesion<36);w.e.stop();
});
check('Both camps can call independently while each camp keeps at most three projectiles',()=>{
  const w=make({teams:[['fragile','sam'],['mule','cliff']]});w.edit(s=>{s.shots=[0,1,2].map(i=>({owner:0,member:0,kind:'sam',x:100+i*20,y:500,vx:0,ttl:400,age:0}));});w.tap(1,'assist');w.tap(2,'assist');w.step(18);
  const p=w.p();assert.equal(p.state.shots.filter(shot=>shot.owner===0).length,3);assert.equal(p.state.teams[0].busy.frame,18);assert.equal(p.state.teams[1].busy.frame,18);assert.equal(p.state.teams[0].members.length,2);w.e.stop();
});
check('KO automatically transfers to the survivor with zero Cohesion and preserves resources',()=>{
  const w=make();w.edit(s=>{s.teams[0].cohesion=0;s.teams[0].tagCooldown=120;s.teams[0].members[0].hp=0;s.teams[0].members[1].hp=37;s.teams[0].members[1].chiral=9;});w.step();
  assert.equal(w.s().fighters[0].id,'fragile');assert.equal(w.s().fighters[0].hp,37);assert.equal(w.s().fighters[0].chiral,9);assert.equal(w.s().teams[0].tagCooldown,119);assert.equal(w.s().phase,'fight');w.e.stop();
});
check('Projectile ownership and its Chiral reward remain with the emitter after tag',()=>{
  const w=make();w.edit(s=>{s.teams[1].members[0].x=1050;s.shots=[{owner:0,member:0,kind:'sam',x:500,y:501,vx:3,ttl:230,age:0}];});w.tap(1,'tag');w.step(30);
  assert.equal(w.p().state.shots[0].member,0);const before=w.p().state.teams[0].members[0].chiral;w.step(185);
  assert.equal(w.s().teams[1].members[0].hp,90);assert.equal(w.p().state.teams[0].members[0].chiral,before+4);w.e.stop();
});
check('Crates become inert in reserve and expire instead of being cloned',()=>{
  const w=make({teams:[['mule','mama'],['higgs','sam']]});w.edit(s=>{s.teams[0].members[0].marker={kind:'crate',x:500,ttl:100,travel:'crate',endX:1100,hit:false};});w.tap(1,'tag');w.step(15);
  const mark=w.p().state.teams[0].members[0].marker;assert.equal(mark.kind,'crate');assert.equal(mark.travel,null);w.step(30);assert.equal(w.p().state.teams[0].members[0].marker.x,mark.x);w.step(60);assert.equal(w.p().state.teams[0].members[0].marker,null);w.e.stop();
});
check('Cliff post and Mama anchor are recalled on reserve entry',()=>{
  for(const [id,kind]of [['cliff','post'],['mama','anchor']]){const w=make({teams:[[id,'sam'],['higgs','mule']]});w.edit(s=>s.teams[0].members[0].marker={kind,x:500,ttl:160});w.tap(1,'tag');w.step(15);assert.equal(w.p().state.teams[0].members[0].marker,null);w.e.stop();}
});
check('Time limit compares both health pools, not only the active fighters',()=>{
  const w=make();w.edit(s=>{s.remaining=1;s.teams[0].members[1].hp=40;s.teams[1].members.forEach(f=>f.hp=90);});w.step();assert.equal(w.s().winner,2);assert.equal(w.p().state.reason,'time');w.e.stop();
});
check('Equal time preserves health; equal simultaneous hits do not favor a side',()=>{
  const w=make();w.edit(s=>{s.remaining=1;[80,20].forEach((hp,i)=>s.teams[0].members[i].hp=hp);[40,60].forEach((hp,i)=>s.teams[1].members[i].hp=hp);});w.step();assert(w.s().sudden);assert.deepEqual(w.s().teams.map(t=>t.members.map(f=>f.hp)),[[80,20],[40,60]]);
  w.edit(s=>s.teams.forEach((t,i)=>{const f=t.members[t.active];f.x=600+i*44;f.face=i?-1:1;f.act={key:'light',t:4,hit:false};}));w.step();assert.equal(w.s().winner,0);assert.equal(w.s().phase,'fight');
  w.edit(s=>{s.hstop=0;s.teams.forEach((t,i)=>{const f=t.members[t.active];f.stun=0;f.act=i?null:{key:'light',t:4,hit:false};f.x=600+i*44;f.face=i?-1:1;});});w.step();assert.equal(w.s().winner,1);assert.equal(w.p().state.reason,'sudden');w.e.stop();
});
check('Exact final double KO ends in a draw without resurrection',()=>{
  const w=make();w.edit(s=>s.teams.forEach((t,i)=>{t.members[1].hp=0;const f=t.members[0];f.hp=5;f.x=600+i*44;f.face=i?-1:1;f.act={key:'light',t:4,hit:false};}));w.step();assert.equal(w.s().phase,'ended');assert.equal(w.s().winner,0);assert(w.s().teams.every(t=>t.members.every(f=>f.hp===0)));w.e.stop();
});
check('Shared combo survives a tag and applies to subsequent partner damage',()=>{
  const w=make();w.edit(s=>{s.teams[0].combo=5;s.teams[0].comboTTL=80;});w.tap(1,'tag');w.step(15);assert.equal(w.s().teams[0].combo,5);assert.equal(w.s().fighters[0].combo,5);w.e.stop();
});
check('All eight assistance profiles run and leave the partner exactly once',()=>{
  for(const id of ['sam','fragile','higgs','cliff','mule','diehardman','mama','heartman']){
    const w=make({teams:[[id==='sam'?'fragile':'sam',id],['higgs','mule']]});w.tap(1,'assist');w.step(95);assert.equal(w.s().teams[0].busy,null,id);assert(w.s().teams[0].assistCooldown>250,id);assert.equal(w.s().teams[0].active,0);w.e.stop();
  }
});
check('Save/reload resumes the complete team state in pause with inputs released',()=>{
  const w=make({difficulty:'hard'});w.tap(1,'assist');w.step(11);const point=w.p(),other=make({difficulty:'hard'});assert(other.e.team.validCheckpoint(point));assert(other.e.team.restore(point));
  assert(other.s().paused);assert.deepEqual(other.s().teams,w.s().teams);assert.equal(other.p().difficulty,2);other.e.pause(false);w.step(80);other.step(80);assert.deepEqual(other.s(),w.s());w.e.stop();other.e.stop();
});
check('Corrupt or incompatible team saves are rejected without changing live state',()=>{
  const w=make();const pristine=w.p();
  for(const mutate of [p=>p.version=99,p=>p.selection[0][1]='sam',p=>p.state.teams[0].cohesion=-1,p=>p.state.teams[0].members[0].hp=101,p=>p.state.teams[0].members[0].act={key:'fake',t:2},p=>p.state.shots=[{owner:99}],p=>p.stage='fake',p=>p.difficulty=5]){
    const bad=copy(pristine);mutate(bad);assert(!w.e.team.restore(bad));assert.deepEqual(w.p(),pristine);
  }w.e.stop();
});
check('UI prevents duplicates, starts the engine, maps team keys, saves and resumes',()=>{
  const w=world({gamepads:false});w.html('teams.html');w.load(['content.js','assets.js','fight.js','input.js','teams.js']);
  w.change('#teamMember01','sam');assert(w.document.getElementById('teamStart').disabled);w.change('#teamMember01','fragile');w.change('#teamOpponent','local');w.click('#teamStart');w.frames(75);
  assert.equal(w.host.StrandFight.snapshot().phase,'fight');w.key('b');w.key('b',false);w.frames(32);assert.equal(w.host.StrandFight.snapshot().fighters[0].id,'fragile');
  w.click('#teamSave');assert(w.storage.has('echos.teams.v1'));assert(!w.document.getElementById('teamSetup').hidden);w.click('#teamResume');assert(w.host.StrandFight.snapshot().paused);assert.equal(w.host.StrandFight.snapshot().fighters[0].id,'fragile');w.click('#teamPause');assert(!w.host.StrandFight.snapshot().paused);
  w.host.StrandFight.stop();
});
check('Denied storage retains the playable fight in pause with an honest message',()=>{
  const w=world({gamepads:false,writeError:true});w.html('teams.html');w.load(['content.js','assets.js','fight.js','input.js','teams.js']);w.click('#teamStart');w.frames(75);w.click('#teamSave');
  assert(w.host.StrandFight.snapshot().paused);assert(!w.document.getElementById('teamArena').hidden);assert.match(w.document.getElementById('teamBattleState').textContent,/Stockage indisponible/);w.host.StrandFight.stop();
});
const out=process.argv.find(arg=>arg.startsWith('--output='));if(out){const file=path.resolve(out.slice(9));fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify({date:'2026-11-27',adapter:'Actual StrandFight simulation + explicit DOM/Canvas fixture; not native browser or physical controller',checks,engineSha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'fight.js'))).digest('hex')},null,2)+'\n');}
console.log(checks.length+' groups passed.');
