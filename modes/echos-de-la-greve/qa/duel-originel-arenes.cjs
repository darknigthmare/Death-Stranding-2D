/* Native Canvas plus a small DOM contract fixture. This is not a browser/layout test. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const crypto=require('node:crypto');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..'),duel=path.join(root,'duel-originel');
const output=process.env.DUEL_ARENA_OUTPUT||path.join(require('node:os').tmpdir(),'duel-originel-arenes');
const ids=['shore','terminal','mule-camp','timefall-shelter','battlefield','tar-basin'];
const groups=['skyplates','distants','midgrounds','floors','foregrounds'];
const speeds=[.14,.27,.43,.62,.8];
const preferenceKey='death-stranding-2d:duel-originel:preferences:v1';
const source=name=>fs.readFileSync(path.join(duel,name),'utf8');
const registry={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'content.js'),'utf8'),registry);
vm.runInNewContext(fs.readFileSync(path.join(root,'assets.js'),'utf8'),registry);
const content=registry.window.StrandContent,assets=registry.window.StrandAssets;
const engine=require(path.join(duel,'moteur.js'));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const checkedSources=['content.js','assets.js','duel-originel/moteur.js','duel-originel/scene.js','duel-originel/interface.js','duel-originel/index.html','duel-originel/style.css','qa/duel-originel-arenes.cjs'];
const sourceHashes=Object.fromEntries(checkedSources.map(file=>[file,hash(fs.readFileSync(path.join(root,file)))]));

// The fixture provides only the DOM operations used by the original interface.
// It exercises real event handlers and HTML state; CSS, native focus, pointer
// capture, browser image decoding and accessibility trees need a browser pass.
class Element {
  constructor(tag,attributes={},document){
    this.tagName=tag.toUpperCase();this.attributes={...attributes};this.ownerDocument=document;
    this.children=[];this.parentElement=null;this.listeners={};this.style={};this.dataset={};this._text='';
    for(const [key,value]of Object.entries(attributes))if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
    this.hidden=Object.hasOwn(attributes,'hidden');this.open=false;
    this.classList={toggle:(name,on)=>{const classes=new Set((this.attributes.class||'').split(/\s+/).filter(Boolean));on?classes.add(name):classes.delete(name);this.attributes.class=[...classes].join(' ');},contains:name=>(this.attributes.class||'').split(/\s+/).includes(name)};
  }
  append(child){child.parentElement=this;this.children.push(child);}
  set innerHTML(html){this.children=[];this._text='';parse(html,this,this.ownerDocument);}
  get textContent(){return this._text+this.children.map(child=>child.textContent).join('');}
  set textContent(value){this._text=String(value);this.children=[];}
  get firstElementChild(){return this.children.find(child=>child.tagName!=='#TEXT')||null;}
  get value(){return this._value??this.attributes.value??(this.tagName==='SELECT'?this.querySelector('option')?.value:'')??'';}
  set value(value){this._value=String(value);}
  setAttribute(key,value){this.attributes[key]=String(value);}
  getAttribute(key){return this.attributes[key]??null;}
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
  dispatch(type,detail={}){const event={type,target:this,preventDefault(){},...detail};this['on'+type]?.(event);for(const fn of this.listeners[type]||[])fn(event);}
  querySelectorAll(selector){return descendants(this).filter(node=>matches(node,selector));}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  focus(){this.ownerDocument.activeElement=this;}
  setPointerCapture(){}
  showModal(){this.open=true;}
  close(){this.open=false;this.dispatch('close');}
  getContext(){return this.ownerDocument.canvasContext;}
}
function descendants(node){return node.children.flatMap(child=>[child,...descendants(child)]);}
function simple(node,selector){
  if(node.tagName==='#TEXT')return false;
  for(const [all,key,,quoted,bare]of selector.matchAll(/\[([\w-]+)(?:=(?:(["'])(.*?)\2|([^\]]+)))?\]/g)){
    const value=key.startsWith('data-')?node.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]:node.getAttribute(key);
    if(value==null||((quoted??bare)!==undefined&&String(value)!==(quoted??bare)))return false;
    selector=selector.replace(all,'');
  }
  const id=selector.match(/#([\w-]+)/)?.[1];if(id&&node.getAttribute('id')!==id)return false;
  for(const [,name]of selector.matchAll(/\.([\w-]+)/g))if(!node.classList.contains(name))return false;
  const tag=selector.match(/^[\w-]+/)?.[0];return !tag||node.tagName===tag.toUpperCase();
}
function matches(node,selector){
  const parts=selector.trim().split(/\s+/);if(!simple(node,parts.pop()))return false;
  for(let ancestor=node.parentElement;parts.length;ancestor=ancestor?.parentElement){
    if(!ancestor)return false;if(simple(ancestor,parts.at(-1)))parts.pop();
  }
  return true;
}
function parse(html,parent,document){
  const stack=[parent],voids=new Set(['img','meta','link','input','br','hr']);
  for(const token of html.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]+>|[^<]+/g)||[]){
    if(token.startsWith('<!'))continue;
    if(token.startsWith('</')){if(stack.length>1)stack.pop();continue;}
    if(token.startsWith('<')){
      const tag=token.match(/^<([\w-]+)/)?.[1];if(!tag)continue;const attrs={};
      const remainder=token.slice(tag.length+1,-1);
      for(const [,key,double,single,bare]of remainder.matchAll(/([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))attrs[key]=double??single??bare??'';
      const node=new Element(tag,attrs,document);stack.at(-1).append(node);
      if(!voids.has(tag)&&!token.endsWith('/>'))stack.push(node);
    }else{const node=new Element('#text',{},document);node._text=token;stack.at(-1).append(node);}
  }
}
function makeDocument(canvasContext){
  const document=new Element('document');document.ownerDocument=document;document.canvasContext=canvasContext;document.hidden=false;
  parse(source('index.html').replace(/<script[\s\S]*?<\/script>/g,''),document,document);return document;
}

(async()=>{
  fs.mkdirSync(output,{recursive:true});
  const files=new Set(['assets/fighters/sam-stance.webp','assets/fighters/sam-action.webp','assets/fighters/higgs-action.webp']);
  for(const id of ids)for(const group of [...groups,'stages'])files.add(assets[group][id]);
  const decoded=new Map();for(const file of files)decoded.set('../'+file,await loadImage(path.join(root,file)));
  function contextFor(canvas,{reduced=false,storage=null,ui=false,blockedStorage=false}={}){
    const draws=[],native=canvas.getContext('2d');
    const drawing=new Proxy(native,{
      get(target,key){if(key==='drawImage')return(image,...args)=>{if(image.src.includes('/stages/'))draws.push({file:image.src,rect:args});return target.drawImage(image.drawable,...args);};const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;},
      set(target,key,value){Reflect.set(target,key,value,target);return true;}
    });
    const state={lastMatch:null,cpuCalls:0,now:0,next:0,pending:new Map(),draws,storage:storage||new Map(),listeners:{},reduced,mediaListeners:[]};
    const media={get matches(){return state.reduced;},addEventListener(type,fn){state.mediaListeners.push(fn);}};
    const scope={console,StrandContent:content,StrandAssets:assets,matchMedia:()=>media,
      Image:class{set src(file){this._src=file;this.drawable=decoded.get(file);assert(this.drawable,'Undecoded asset '+file);this.complete=true;this.naturalWidth=this.drawable.width;this.naturalHeight=this.drawable.height;}get src(){return this._src;}},
      requestAnimationFrame(fn){state.pending.set(++state.next,fn);return state.next;},cancelAnimationFrame(key){state.pending.delete(key);},
      localStorage:{getItem:key=>{if(blockedStorage)throw Error('blocked');return state.storage.get(key)??null;},setItem:(key,value)=>{if(blockedStorage)throw Error('blocked');state.storage.set(key,value);}},
      addEventListener(type,fn){(state.listeners[type]??=[]).push(fn);},location:{assign(url){state.navigation=url;}}
    };
    scope.window=scope;scope.document=makeDocument(drawing);
    vm.createContext(scope);vm.runInContext(source('moteur.js'),scope);
    const create=scope.Duels.newMatch,cpu=scope.Duels.cpu;
    scope.Duels.newMatch=(...args)=>(state.lastMatch=create(...args));
    scope.Duels.cpu=(...args)=>{state.cpuCalls++;return cpu(...args);};
    vm.runInContext(source('scene.js'),scope);
    state.scope=scope;state.document=scope.document;state.canvas={getContext:()=>drawing};
    state.step=(count=1)=>{for(let i=0;i<count;i++){state.now+=1000/60+.001;const frames=[...state.pending.values()];state.pending.clear();for(const fn of frames)fn(state.now);}};
    state.key=(type,code,target=scope.document.querySelector('#app'))=>{for(const fn of state.listeners[type]||[])fn({code,target,preventDefault(){}});};
    state.reducedMotion=on=>{state.reduced=on;for(const fn of state.mediaListeners)fn({matches:on});};
    if(ui)vm.runInContext(source('interface.js'),scope);
    return state;
  }
  const canvas=createCanvas(1120,630),render=contextFor(canvas),renderResults=[];
  assert.deepEqual(Array.from(render.scope.GrèveScene.stageIds),ids);
  function shot(id,positions,reduced=false){
    render.reducedMotion(reduced);const match=engine.newMatch('sam','higgs',true);match.phase='fight';match.frame=100;
    match.fighters.forEach((fighter,index)=>{fighter.x=positions[index];fighter.facing=index?-1:1;});
    const before=JSON.stringify(match);render.draws.length=0;render.scope.GrèveScene.draw(render.canvas,match,{stage:id});
    assert.equal(JSON.stringify(match),before,'Drawing must not change simulation');
    return {match,draws:render.draws.map(entry=>({...entry,rect:[...entry.rect]}))};
  }
  function validate(id,frame){
    const layers=groups.map(group=>'../'+assets[group][id]);
    assert.deepEqual(frame.draws.map(entry=>entry.file),layers,'Five planes in order '+id);
    frame.draws.forEach(({file,rect:[x,,width,height]})=>{
      const im=decoded.get(file);assert(x<=0&&x+width>=1120,'Viewport coverage '+file);
      assert(Math.abs(width/height-im.width/im.height)<1e-9,'Undistorted source '+file);
    });
    const [,y,,height]=frame.draws[3].rect;
    assert(Math.abs(y+height*assets.stageGeometry[id].floor.anchorY-528)<1e-9,'Contact at floor 528 '+id);
    assert(y+height>=630,'Floor reaches bottom '+id);
  }
  for(const id of ids){
    let cases=0;const normal={};
    for(const reduced of [false,true]){
      const centered=shot(id,[320,800],reduced);validate(id,centered);
      for(const direction of [-1,1]){
        const frame=shot(id,[320+direction*180,800+direction*180],reduced);validate(id,frame);
        const shifts=frame.draws.map((entry,index)=>(centered.draws[index].rect[0]-entry.rect[0])*direction);
        for(let i=0;i<shifts.length;i++){
          assert(shifts[i]>0,'Camera direction '+id);
          assert(Math.abs(shifts[i]/shifts[0]-speeds[i]/speeds[0])<1e-9,'Layer speeds '+id);
          if(reduced)assert(Math.abs(shifts[i]/normal[direction][i]-.2)<1e-9,'Reduced travel '+id);
        }
        if(!reduced){normal[direction]=shifts;fs.writeFileSync(path.join(output,id+(direction<0?'-left':'-right')+'.webp'),canvas.toBuffer('image/webp',88));}
        cases++;
      }
      for(const positions of [[69,126],[994,1051]]){validate(id,shot(id,positions,reduced));cases++;}
    }
    const frozen=shot(id,[320,800],true);frozen.match.shake=8;render.scope.GrèveScene.draw(render.canvas,frozen.match,{stage:id});const pixels=hash(canvas.data());
    frozen.match.frame+=120;render.scope.GrèveScene.draw(render.canvas,frozen.match,{stage:id});assert.equal(hash(canvas.data()),pixels,'Reduced motion freezes ambient movement '+id);
    renderResults.push({stage:id,cases,layers:groups.map(group=>assets[group][id]),passed:true});
  }
  const tiny=createCanvas(140,79);tiny.getContext('2d').scale(.125,.125);
  const storage=new Map([['echos-de-la-greve','parent-save-untouched']]),ui=contextFor(tiny,{ui:true,storage});
  const $=selector=>{const node=ui.document.querySelector(selector);assert(node,'Missing UI element '+selector);return node;};
  const click=selector=>$(selector).dispatch('click');
  function displayed(id){assert.equal($('#arena-place').textContent,content.stages[id]);assert($('canvas').getAttribute('aria-label').includes(content.stages[id]));}
  let directCases=0;
  for(const fighter of ['sam','higgs'])for(const id of ids){
    click('[data-choose="'+fighter+'"]');click('[data-stage="'+id+'"]');assert.equal($('[data-stage="'+id+'"]').getAttribute('aria-pressed'),'true');
    click('#start');displayed(id);assert.equal(ui.lastMatch.fighters[0].id,fighter);assert.equal(ui.lastMatch.training,false);ui.step(70);
    assert(ui.cpuCalls>0,'Historical CPU remains active');
    ui.lastMatch.phase='result';ui.lastMatch.winner=0;ui.lastMatch.wins=[2,0];ui.step(1);
    click('#again');displayed(id);assert.equal(ui.lastMatch.phase,'ready');click('#back-selection');directCases++;
  }
  let storyCases=0;
  for(const fighter of ['sam','higgs']){
    click('[data-stage="terminal"]');click('[data-choose="'+fighter+'"]');click('#story');click('#next-scene');click('#next-scene');
    displayed('shore');assert.equal(ui.lastMatch.training,false);
    ui.lastMatch.phase='result';ui.lastMatch.winner=0;ui.lastMatch.wins=[2,0];ui.step(1);click('#ending');click('#next-scene');
    assert.equal($('[data-stage="terminal"]').getAttribute('aria-pressed'),'true','Story must preserve direct-duel selection');storyCases++;
  }
  click('[data-stage="mule-camp"]');click('#training');displayed('mule-camp');assert.equal(ui.lastMatch.training,true);assert.equal($('.timer').textContent,'∞');
  ui.step(70);const initialX=ui.lastMatch.fighters[0].x,cpuBefore=ui.cpuCalls;
  ui.key('keydown','ArrowRight');ui.step(15);ui.key('keyup','ArrowRight');assert(ui.lastMatch.fighters[0].x>initialX+30,'Keyboard movement');
  assert.equal(ui.cpuCalls,cpuBefore,'Idle training target');assert.equal(ui.lastMatch.clock,engine.ROUND_TIME,'Unlimited training time');
  const guard=$('[data-action="guard"]');guard.dispatch('pointerdown',{pointerId:1});ui.step(2);assert.equal(ui.lastMatch.fighters[0].guard,true,'Touch guard');guard.dispatch('pointerup',{pointerId:1});
  const oldMatch=ui.lastMatch;$('#training-stage').value='tar-basin';$('#training-stage').dispatch('change');displayed('tar-basin');assert.equal(ui.lastMatch,oldMatch,'Changing training scenery keeps the match');
  const beforeSelect=ui.lastMatch.fighters[0].x;ui.key('keydown','ArrowLeft',$('#training-stage'));ui.step(3);assert.equal(ui.lastMatch.fighters[0].x,beforeSelect,'Select keyboard navigation must not move fighters');
  $('#training-opponent').value='guard';$('#training-opponent').dispatch('change');ui.step(2);assert.equal(ui.lastMatch.fighters[1].guard,true,'Guard training target');
  $('#training-opponent').value='cpu';$('#training-opponent').dispatch('change');ui.step(2);assert(ui.cpuCalls>cpuBefore,'CPU training target');
  ui.lastMatch.fighters[0].hp=30;click('#training-reset');assert.equal(ui.lastMatch.fighters[0].hp,100);assert.equal(ui.lastMatch.fighters[0].meter,100);assert.equal(ui.lastMatch.fighters[0].x,320);
  ui.key('keydown','ArrowRight');click('#pause');assert.equal($('#dialog').open,true);const pausedX=ui.lastMatch.fighters[0].x;ui.step(3);assert.equal(ui.lastMatch.fighters[0].x,pausedX);
  click('#close-dialog');ui.step(3);assert.equal(ui.lastMatch.fighters[0].x,pausedX,'Pause clears held controls');
  click('#back-selection');assert.equal($('[data-stage="tar-basin"]').getAttribute('aria-pressed'),'true');
  assert.equal(storage.get('echos-de-la-greve'),'parent-save-untouched','Main mode saves remain separate');
  const restarted=contextFor(tiny,{ui:true,storage});assert.equal(restarted.document.querySelector('[data-stage="tar-basin"]').getAttribute('aria-pressed'),'true','Persisted stage selection after reload');
  const corrupt=new Map([[preferenceKey,JSON.stringify({fighter:'unknown',difficulty:100,stage:'mule-camp-dry',trainingOpponent:'unknown'})]]);
  const safe=contextFor(tiny,{ui:true,storage:corrupt});assert.equal(safe.document.querySelector('[data-stage="shore"]').getAttribute('aria-pressed'),'true');
  assert.equal(safe.document.querySelectorAll('[data-stage]').length,6,'Original duel exposes exactly six locations');
  const blocked=contextFor(tiny,{ui:true,blockedStorage:true});blocked.document.querySelector('#start').dispatch('click');assert(blocked.lastMatch,'Storage denial must not block the duel');
  for(const file of checkedSources)assert.equal(hash(fs.readFileSync(path.join(root,file))),sourceHashes[file],'Source changed during validation: '+file);
  const report={renderer:'@napi-rs/canvas; production scene.js and moteur.js',browser_verified:false,interface_fixture:'Minimal DOM contract fixture; real interface.js handlers, simulated match results',source_sha256:sourceHashes,native_resolution:[1120,630],ground:528,stages:ids.length,render_cases:renderResults.reduce((sum,r)=>sum+r.cases,0),direct_duel_rematch_cases:directCases,story_cases:storyCases,training_keyboard_touch_pause_reset_persistence:true,parent_saves_unchanged:true,results:renderResults,limitations:['Browser layout, native focus, pointer capture, audio activation and accessibility tree are not exercised.','Result screens are reached by setting a winning simulation state; this suite does not replace combat balance tests.']};
  fs.writeFileSync(path.join(output,'validation.json'),JSON.stringify(report,null,2)+'\n');
  console.log('PASS: 6 stages, 48 Canvas cases, 12 selection/duel/rematch flows, 2 story flows, training and preferences. Browser not exercised.');
})().catch(error=>{console.error(error);process.exitCode=1;});
