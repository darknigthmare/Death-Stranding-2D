'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {world}=require('./input-host.cjs');
const root=path.resolve(__dirname,'..'),repo=path.resolve(root,'../..');
const data=JSON.parse(fs.readFileSync(path.join(repo,'docs/combat/extensions/lignes-de-maree/catalog.json'),'utf8'));
const ids=data.stages.map(stage=>stage.id),checks=[],started=[];
function check(name,run){run();checks.push(name);}
function page(file,search=''){
  const a=world({gamepads:false});a.html(file);
  a.host.setTimeout=a.context.setTimeout;a.host.clearTimeout=a.context.clearTimeout;
  a.host.location={protocol:'file:',search,pathname:'/modes/echos-de-la-greve/'+file,hash:''};
  const files=[...fs.readFileSync(path.join(root,file),'utf8').matchAll(/<script\s+src="([^"]+)"/g)].map(m=>m[1]);
  a.load(files);return a;
}
check('All twenty real catalogue entry URLs open the right training selection and start that arena.',()=>{
  for(const stage of ids){const a=page('index.html','?ldmStage='+encodeURIComponent(stage));
    assert.equal(a.document.querySelector('[data-option="stage"]')?.value,stage);
    assert.equal(a.document.querySelectorAll('[data-act="pick"]').length,8,'No invented playable kit');
    a.click('[data-act="start"]');a.frames(2);
    assert.equal(a.host.StrandFight.snapshot().stage,stage);assert.equal(a.host.StrandFight.snapshot().mode,'training');
    started.push(stage);a.host.StrandFight.stop();
  }
});
check('Unknown and ordinary arena query values do not invoke the expansion training route.',()=>{
  for(const stage of ['ldm-stage-missing','shore']){const a=page('index.html','?ldmStage='+stage);assert.equal(a.document.querySelector('[data-option="stage"]'),null);}
});
check('Versus admits 45 arenas; Boss Battle retains its 24 existing compatible arenas and recommended option.',()=>{
  const a=page('index.html');a.click('[data-act="mode"][data-mode="versus"]');
  const versus=a.document.querySelector('[data-option="stage"]').querySelectorAll('option').map(n=>n.value);assert.equal(versus.length,45);for(const id of ids)assert(versus.includes(id));
  a.click('[data-act="home"]');a.click('[data-act="mode"][data-mode="boss"]');
  const boss=a.document.querySelector('[data-option="bossStage"]').querySelectorAll('option').map(n=>n.value);assert.equal(boss.length,25);assert(boss.includes('recommended'));for(const id of ids)assert(!boss.includes(id));
});
check('The actual team controller admits 44 compatible arenas and starts an original panorama with four existing members.',()=>{
  const a=page('teams.html');const choices=a.document.querySelector('#teamStage').querySelectorAll('option').map(n=>n.value);assert.equal(choices.length,44);for(const id of ids)assert(choices.includes(id));assert(!choices.includes('terminal-linked'));
  for(const select of ['teamMember00','teamMember01','teamMember10','teamMember11'])assert.equal(a.document.querySelector('#'+select).querySelectorAll('option').length,8);
  a.change('#teamStage',ids[0]);a.click('#teamStart');a.frames(2);const state=a.host.StrandFight.snapshot();assert.equal(state.stage,ids[0]);assert.equal(state.teams.length,2);a.host.StrandFight.stop();
});
const files=['app.js','teams.js','index.html','teams.html','extension-data.js','extension-assets.js','extension-runtime.js','qa/original-entrypoints.cjs'];
const report={date:new Date().toISOString(),passed:true,groups:checks.length,checks,trainingArenasStarted:started,browser:false,method:'Shipped HTML script order and real app/team controllers, event-capable DOM fixture and actual fight engine; images and browser layout are covered separately.',sourceSha256:Object.fromEntries(files.map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')]))};
fs.writeFileSync(path.join(repo,'docs/combat/production/20261127-lignes-de-maree/entrypoints-verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
