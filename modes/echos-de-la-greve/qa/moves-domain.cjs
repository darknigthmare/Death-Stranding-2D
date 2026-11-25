const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const ctx={window:{},Image:class{},structuredClone};for(const f of ['content.js','moves-data.js','relationships.js'])vm.runInNewContext(read(f),ctx);
const source=read('fight.js'),mark='  host.StrandFight = ';assert.equal(source.split(mark).length,2);
vm.runInNewContext(source.replace(mark,'  host.__audit={roster,moves,shotHit,directional,fighter,beginAttack,updateFighter,contacts,strike,hit,intercept,immune,cpu,actOnQueue,pushInput,onMonitorBeat,getMatch:()=>match};\n'+mark),ctx);
const api=ctx.window.StrandFight,a=ctx.window.__audit,data=ctx.window.StrandMovesData,rels=ctx.window.StrandRelationships;
const canonical=v=>JSON.parse(JSON.stringify(v)),hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const checks=[],stats={timings:0,volumes:0,impacts:0,guards:0,cancelCases:0,conditionalCases:0,aiThresholds:0,relationOrientations:0,mirrors:0},advantage=[];
const test=(name,fn)=>{fn();checks.push(name);};
function setup(p1='sam',p2='mule'){
 const drawing=new Proxy({createLinearGradient:()=>({addColorStop(){}}),measureText:()=>({width:1})},{get:(o,k)=>o[k]||(()=>{})});
 api.start({canvas:{getContext:()=>drawing},p1,p2,stage:'terminal',mode:'local',clock:'network',roundsToWin:2,sound:false});
 const m=a.getMatch();m.phase='fight';m.f[0].x=240;m.f[1].x=1000;for(const f of m.f){f.chiral=100;f.keys={};}
 return m;
}
function prepare(m,key){const f=m.f[0];if(key==='winch')f.marker={kind:'anchor',x:420,ttl:1000};if(key==='retrieve')f.marker={kind:'crate',x:420,ttl:1000};if(key==='recall')f.marker={kind:'post',x:420,ttl:1000};a.beginAttack(m,f,m.f[1],key,0);assert(f.act,key+' starts');}
function runTo(m,key,frame){const f=m.f[0];prepare(m,key);for(let i=1;i<=frame;i++){m.tick++;a.updateFighter(m,f,m.f[1],0);}return f;}
function role(key){return data.actions.find(x=>x.engineAction===key).owner;}
test('Source digest and complete action/identity tables match the loaded engine',()=>{
 assert.equal(data.source.sha256,hash(source));assert.equal(data.actions.length,30);assert.equal(Object.keys(data.fighters).length,8);
 assert.deepEqual(canonical(data.raw.moves),canonical(a.moves));assert.deepEqual(canonical(data.raw.shotHit),canonical(a.shotHit));
 for(const id of Object.keys(a.roster)){const f=data.forFighter(id);assert.equal(f.common.length,6);assert.equal(f.techniques.length,3);for(const row of [...f.common,...f.techniques]){assert.equal(row.startup,a.moves[row.engineAction].start);assert.equal(row.cost,a.moves[row.engineAction].cost||0);assert.equal(typeof row.damage,'string');assert(row.range&&row.guard&&row.cancel);}}
});
test('All 30 nominal actions clear at their documented actual update and allow the next input one update later',()=>{
 for(const row of data.actions){const m=setup(row.owner==='common'?'sam':row.owner),f=m.f[0];prepare(m,row.engineAction);let n=0;while(f.act&&n<150){m.tick++;a.updateFighter(m,f,m.f[1],0);n++;}assert.equal(n,row.timing.clearAt,row.engineAction);a.pushInput(m,f,'light');m.tick++;a.updateFighter(m,f,m.f[1],0);assert.equal(f.act?.t,1);assert.equal(n+1,row.timing.nextUncancelledStartAt);stats.timings++;}
});
test('Melee volumes use the declared first/last active frames, facing and feet-relative height',()=>{
 for(const row of data.actions.filter(x=>x.nominal.reach)){for(const face of [-1,1]){const m=setup(row.owner==='common'?'sam':row.owner),f=m.f[0],d=a.moves[row.engineAction];prepare(m,row.engineAction);f.face=face;f.y=31;f.act.t=d.start-1;assert.equal(a.strike(f),null);f.act.t=d.start;const r=a.strike(f);assert.equal(r.r-r.l,d.reach);assert.equal(r.t,588-31-d.high);assert.equal(r.b,588-31-d.low);f.act.t=d.start+d.active-1;assert(a.strike(f));f.act.t++;assert.equal(a.strike(f),null);stats.volumes++;}}
});
test('Damage, zero chip, guard levels, resources and balance use the real hit handler for all kits',()=>{
 const profiles=[...Object.entries(a.moves).filter(([,d])=>d.damage!==undefined),...Object.entries(a.shotHit)];
 for(const id of Object.keys(a.roster))for(const [key,d] of profiles){for(const guard of [false,true])for(const crouch of [false,true]){const m=setup(id),f=m.f[0],o=m.f[1];f.chiral=o.chiral=0;o.guard=guard;o.crouch=crouch;const ok=a.hit(m,f,o,key,d,1);const blocked=guard&&!d.grab&&((key!=='sweep'&&d.level!=='low')||crouch)&&(key!=='air'||!crouch);assert.equal(ok,!blocked);assert.equal(o.hp,100-(blocked?0:Math.round(d.damage*a.roster[id].power)));assert.equal(f.chiral,blocked?2:4);assert.equal(o.chiral,blocked?2:3);assert.equal(o.balance,100-d.balance*(blocked?1.25:.76));if(blocked)assert.equal(o.blockStun,9);else assert.equal(o.stun,d.stun);stats.impacts++;if(guard)stats.guards++;}}
 const m=setup();m.f[1].balance=1;m.f[1].guard=true;a.hit(m,m.f[0],m.f[1],'heavy',a.moves.heavy,1);assert.equal(m.f[1].balance,36);assert.equal(m.f[1].stun,38);assert.equal(m.f[1].blockStun,0);
});
test('Cancellation accepts only the documented button, confirmed hit and recovery threshold',()=>{
 for(const row of data.actions)for(const confirmed of [false,true])for(const button of ['light','heavy','special','up','throw']){
 const m=setup(row.owner==='common'?'sam':row.owner),f=m.f[0];prepare(m,row.engineAction);f.act.t=row.startup+row.active;f.act.hitConfirmed=confirmed;const previous=f.act;a.pushInput(m,f,button);a.actOnQueue(m,f,m.f[1]);const expected=confirmed&&row.cancelRules.inputActions.includes(button);assert.equal(f.act!==previous,expected,row.engineAction+'/'+button+'/'+confirmed);stats.cancelCases++;}
 const m=setup(),f=m.f[0];prepare(m,'light');f.act.hitConfirmed=true;f.act.t=a.moves.light.start+a.moves.light.active-1;a.pushInput(m,f,'special');a.actOnQueue(m,f,m.f[1]);assert.equal(f.act.key,'light');
});
test('Closed-model hit/block advantage matches actual ability to start an uncancelled action',()=>{
 for(const row of data.actions.filter(x=>x.nominal.reach))for(const last of [false,true])for(const blocked of [false,true]){
 if(blocked&&row.engineAction==='grab')continue;
 const m=setup(row.owner==='common'?'sam':row.owner),f=m.f[0],o=m.f[1];prepare(m,row.engineAction);const frame=last?row.timing.lastActive:row.timing.firstActive;f.act.t=frame;f.act.hit=true;f.act.hitConfirmed=false;o.guard=blocked;o.crouch=blocked&&(row.engineAction==='sweep');a.hit(m,f,o,row.engineAction,a.moves[row.engineAction],1);o.vx=0;o.vy=0;o.y=0;o.grounded=true;
 let firstF=null,firstO=null;for(let n=1;n<=100&&(!firstF||!firstO);n++){m.tick++;if(!firstF)a.pushInput(m,f,'light');if(!firstO)a.pushInput(m,o,'light');a.updateFighter(m,f,o,0);a.updateFighter(m,o,f,1);if(!firstF&&f.act?.key==='light'&&f.act.t===1)firstF=n;if(!firstO&&o.act?.key==='light'&&o.act.t===1)firstO=n;}
 const measured=firstO-firstF,key=blocked?(last?'onBlockLast':'onBlockFirst'):(last?'onHitLast':'onHitFirst');assert.equal(measured,row.advantage[key],row.engineAction+' '+key+' '+JSON.stringify({firstF,firstO}));advantage.push({action:row.engineAction,contact:last?'last':'first',outcome:blocked?'block':'hit',attackerNextStart:firstF,defenderNextStart:firstO,advantage:measured});}
});
test('Missing/active marker failures and consumed resources match the documented differences',()=>{
 for(const [id,key] of [['mama','winch'],['mule','retrieve']]){const m=setup(id);a.beginAttack(m,m.f[0],m.f[1],key,0);assert.equal(m.f[0].act,null);assert.equal(m.f[0].chiral,100);stats.conditionalCases++;}
 let m=setup('mule');m.f[0].marker={kind:'crate',travel:'retrieve',x:400,ttl:20};a.beginAttack(m,m.f[0],m.f[1],'retrieve',0);assert.equal(m.f[0].act,null);assert.equal(m.f[0].chiral,100);
 m=setup('cliff');a.beginAttack(m,m.f[0],m.f[1],'recall',0);assert.equal(m.f[0].chiral,84);for(let i=0;i<12;i++)a.updateFighter(m,m.f[0],m.f[1],0);assert.equal(m.shots.length,0);assert.equal(m.f[0].notice,'AUCUN POSTE');stats.conditionalCases+=2;
 for(const seal of [false,true]){m=setup('diehardman');if(seal)m.f[0].marker={kind:'seal',ttl:120};let f=runTo(m,'gate',17);assert.equal(m.shots[0].ttl,seal?8:6);assert.equal(!!f.marker,seal);m=setup('diehardman');if(seal)m.f[0].marker={kind:'seal',ttl:120};f=runTo(m,'relief',8);assert.equal(a.strike(f).r-a.strike(f).l,seal?121:77);assert.equal(f.marker,null);assert.equal(f.x,222.5);stats.conditionalCases+=2;}
 for(const anchor of [false,true]){m=setup('mama');if(anchor)m.f[0].marker={kind:'anchor',x:420,ttl:200};runTo(m,'deck',16);assert.equal(m.shots[0].vx,anchor?7.2:3.6);assert.equal(m.shots[0].x,anchor?420:240);assert.equal(!!m.f[0].marker,anchor);stats.conditionalCases++;}
 for(const memory of [false,true]){m=setup('heartman');if(memory)m.f[0].marker={kind:'memory',x:420,ttl:120};runTo(m,'memory',14);assert.equal(m.shots.length,memory?1:0);assert.equal(m.f[0].marker?.kind,memory?undefined:'memory');stats.conditionalCases++;}
});
test('Rhythm, invulnerability, counters, trap arm and scan limit are exercised as conditional mechanics',()=>{
 for(let beat=0;beat<60;beat++){const m=setup('heartman');a.beginAttack(m,m.f[0],m.f[1],'heartman',beat);for(let i=0;i<15;i++)a.updateFighter(m,m.f[0],m.f[1],0);assert.equal(m.shots[0].vx,beat<=3||beat>=57?10:7.5);stats.conditionalCases++;}
 for(const [key,min,max] of [['fragile',6,10],['syncope',10,15]])for(let t=0;t<=30;t++){const m=setup(key==='syncope'?'heartman':'fragile');m.f[0].act={key,t};assert.equal(a.immune(m.f[0]),t>=min&&t<=max);stats.conditionalCases++;}
 for(let dash=0;dash<=12;dash++){const m=setup();m.f[0].dash=dash;assert.equal(a.immune(m.f[0]),dash>=4&&dash<=8);stats.conditionalCases++;}
 for(const key of ['brace','parry','diehardman'])for(const kind of ['light','heavy','sweep','lift','air','grab','fragile','fan','relief'])for(const melee of [false,true]){const id=key==='diehardman'?key:'sam',m=setup(id),f=m.f[0],o=m.f[1];f.act={key,t:a.moves[key].start,hit:false};o.act={key:kind,t:1};const ok=a.intercept(m,f,o,kind,melee);const expected=melee&&kind!=='grab'&&(key==='brace'?kind==='light':key==='diehardman'?['light','heavy','lift','relief','fragile'].includes(kind):true);assert.equal(ok,expected,key+'/'+kind+'/'+melee);if(ok){assert.equal(f.hp,100);assert.equal(o.hp,100);assert.equal(f.act.hit,true);if(key==='parry')assert.equal(o.stun,15);if(key==='diehardman'){assert.equal(o.stun,26);assert.equal(f.marker.kind,'seal');}}stats.conditionalCases++;}
 for(const ttl of [131,130]){const m=setup('higgs');m.f[0].marker={kind:'mine',x:m.f[1].x,ttl};a.contacts(m);assert.equal(m.f[1].hp,ttl===130?94:100);assert.equal(!!m.f[0].marker,ttl!==130);stats.conditionalCases++;}
 for(const distance of [478,479])for(const guard of [false,true]){const m=setup('mule');m.f[0].act={key:'mule',t:29,hit:false};m.f[1].x=m.f[0].x+distance;m.f[1].guard=guard;a.contacts(m);assert.equal(!!m.f[0].scan,distance===478&&!guard);assert.equal(m.f[1].hp,100);stats.conditionalCases++;}
});
function rng(values){let i=0;return()=>values[i++]??.999999;}
test('Three AI cadence ranges and conditional guard/counter/ranged thresholds match real decisions',()=>{
 for(const p of data.aiProfiles){for(const random of [0,.999999]){const m=setup('mule','sam'),f=m.f[1];m.difficulty=p.engineDifficulty;m.simRandom=()=>random;f.stun=1;a.cpu(m,f,m.f[0]);assert.equal(f.aiWait,random?p.decisionDelay.max:p.decisionDelay.min);stats.aiThresholds++;}
 for(const delta of [-.000001,.000001]){
 let m=setup('mule','sam'),f=m.f[1],o=m.f[0];m.difficulty=p.engineDifficulty;f.x=340;o.x=240;o.act={key:'light',t:1};m.simRandom=rng([0,p.guardProbability+delta]);a.cpu(m,f,o);assert.equal(!!f.keys.guard,delta<0);stats.aiThresholds++;
 m=setup('mule','diehardman');f=m.f[1];o=m.f[0];f.x=340;o.x=240;o.act={key:'light',t:1};m.difficulty=p.engineDifficulty;m.simRandom=rng([0,p.counterProbability+delta]);a.cpu(m,f,o);assert.equal(f.queue[0]?.special==='diehardman'&&f.queue[0]?.action==='special',delta<0);stats.aiThresholds++;
 m=setup('mule','sam');f=m.f[1];o=m.f[0];f.x=540;o.x=240;m.difficulty=p.engineDifficulty;m.simRandom=rng([0,p.rangedSpecialProbability+delta]);a.cpu(m,f,o);assert.equal(f.queue[0]?.action==='special',delta<0);stats.aiThresholds++;
 }}
});
test('28 pairs, 56 orientations and eight mirrors are explicit simulator fiction; original routes remain unchanged',()=>{
 assert.equal(rels.pairs.length,28);assert.equal(new Set(rels.pairs.map(p=>p.id)).size,28);for(const pair of rels.pairs)for(const [p1,p2] of [pair.fighters,[...pair.fighters].reverse()]){const d=rels.get(p1,p2);assert.equal(d.lines.length,2);assert.equal(d.lines[0].fighter,p1);assert.equal(d.lines[1].fighter,p2);assert.equal(d.status,'Fiction du simulateur');assert.equal(d.officialRelation,false);assert.equal(d.skippable,true);d.lines[0].text='changed outside';assert.notEqual(rels.get(p1,p2).lines[0].text,'changed outside');stats.relationOrientations++;}for(const id of Object.keys(data.fighters)){assert.equal(rels.get(id,id).lines.length,2);stats.mirrors++;}assert.equal(rels.get('unknown','sam'),null);
 const old={window:{}};vm.runInNewContext(cp.execFileSync('git',['show','2250b7c1b54b445637e0c9354133e6fecbc325de:modes/echos-de-la-greve/content.js'],{cwd:repo,encoding:'utf8'}),old);for(const [id,f] of Object.entries(ctx.window.StrandContent.fighters))for(const key of ['story','route','scenes','finisher'])assert.deepEqual(canonical(f[key]),canonical(old.window.StrandContent.fighters[id][key]),id+'/'+key);
});
console.log(JSON.stringify({date:new Date().toISOString(),method:'Actual fight functions inspected by an in-memory closure hook. Explicit unit fixtures, no browser, no pixel rendering, no full-match or balance certification. Relation orientation and unchanged original route data checked.',browser:false,nativeCanvas:false,syntheticUnitStates:true,checks_passed:checks.length,checks,counts:stats,advantage,source_sha256:Object.fromEntries(['fight.js','content.js','moves-data.js','relationships.js'].map(f=>[f,hash(read(f))])),passed:true},null,2));
