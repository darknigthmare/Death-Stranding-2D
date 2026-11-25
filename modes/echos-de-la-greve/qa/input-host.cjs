/* Event-capable DOM/Canvas simulation for command UI checks. This is not a
 * browser, layout engine, native Canvas or hardware gamepad implementation. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const decode=text=>String(text).replace(/&(amp|lt|gt|quot|#39);/g,(_,name)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"})[name]);
function world(options={}) {
  const storage=options.storage||new Map(),operations=[],queue=new Map(),timers=new Map(),texts=[];let serial=0,time=0;
  const events=()=>({listeners:{},addEventListener(type,fn,capture=false){(this.listeners[type]||=[]).push({fn,capture:!!capture});},
    removeEventListener(type,fn,capture=false){this.listeners[type]=(this.listeners[type]||[]).filter(item=>item.fn!==fn||item.capture!==!!capture);}});
  let document,host;
  const ctx=new Proxy({fillText:text=>texts.push(String(text)),measureText:text=>({width:String(text).length*8}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},
    {get:(target,key)=>target[key]??(()=>{})});
  class Node {
    constructor(tag='div',attrs={}){Object.assign(this,events());this.tagName=tag.toUpperCase();this.attrs={...attrs};this.children=[];this.parentNode=null;this.dataset={};this.style={};this._text='';this._html='';
      this.value=attrs.value||'';this.checked=Object.hasOwn(attrs,'checked');this.hidden=Object.hasOwn(attrs,'hidden');this.disabled=Object.hasOwn(attrs,'disabled');this.open=false;
      const classes=new Set((attrs.class||'').split(/\s+/).filter(Boolean));this.classList={add:(...v)=>v.forEach(x=>classes.add(x)),remove:(...v)=>v.forEach(x=>classes.delete(x)),contains:v=>classes.has(v),toggle(v,on){on=on===undefined?!classes.has(v):!!on;on?classes.add(v):classes.delete(v);return on;}};
      for(const [key,value]of Object.entries(attrs))if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;
    }
    get id(){return this.attrs.id||'';}set id(value){this.attrs.id=String(value);}
    get className(){return this.attrs.class||'';}set className(value){this.attrs.class=String(value);for(const c of String(value).split(/\s+/))this.classList.add(c);}
    get isConnected(){let node=this;while(node.parentNode)node=node.parentNode;return node===document.body;}
    get textContent(){return this._text+this.children.map(n=>n.textContent).join('');}set textContent(value){this._text=String(value);this.children=[];}
    get src(){return this.attrs.src;}set src(value){this.attrs.src=String(value);}
    get innerHTML(){return this._html;}set innerHTML(value){this._html=String(value);this._text='';this.children=[];const stack=[this];
      for(const {0:token}of this._html.matchAll(/<[^>]+>|[^<]+/g)){
        if(token.startsWith('</')){if(stack.length>1)stack.pop();continue;}
        if(token.startsWith('<')){const match=token.match(/^<([\w-]+)([\s\S]*?)\/?\s*>$/);if(!match)continue;const attrs={};
          for(const a of match[2].matchAll(/([^\s=\/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g))attrs[a[1]]=decode(a[2]??a[3]??a[4]??'');
          const node=new Node(match[1],attrs);stack.at(-1).append(node);if(!['IMG','INPUT','BR','HR','META','LINK','SOURCE','WBR'].includes(node.tagName)&&!token.endsWith('/>'))stack.push(node);
        }else{const node=new Node('#text');node._text=decode(token);stack.at(-1).append(node);}
      }
      for(const select of this.querySelectorAll('select')){const selected=select.children.find(n=>Object.hasOwn(n.attrs,'selected'))||select.children.find(n=>n.tagName==='OPTION');if(selected)select.value=selected.value;}
    }
    matches(selector){return selector.split(',').some(raw=>{let value=raw.trim();if(!value||this.tagName==='#TEXT')return false;
      if(value.includes(':enabled')){if(this.disabled)return false;value=value.replace(':enabled','');}
      const tag=value.match(/^[\w-]+/);if(tag&&this.tagName!==tag[0].toUpperCase())return false;
      const id=value.match(/#([\w-]+)/);if(id&&this.id!==id[1])return false;
      for(const c of value.matchAll(/\.([\w-]+)/g))if(!this.classList.contains(c[1]))return false;
      for(const a of value.matchAll(/\[([^\]=]+)(?:=["']?([^\]"']*)["']?)?\]/g)){let actual=this.attrs[a[1]];
        if(a[1].startsWith('data-'))actual=this.dataset[a[1].slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())];
        if(actual===undefined)return false;if(a[2]!==undefined&&actual!==a[2])return false;}
      return true;});}
    querySelectorAll(selector){return this.children.flatMap(node=>[...(node.matches(selector)?[node]:[]),...node.querySelectorAll(selector)]);}
    querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
    closest(selector){return this.matches(selector)?this:this.parentNode?.closest(selector)||null;}
    append(node){if(typeof node==='string'){const text=new Node('#text');text._text=node;node=text;}node.parentNode=this;this.children.push(node);}
    add(node){this.append(node);if(this.children.length===1)this.value=node.value;}
    setAttribute(name,value){this.attrs[name]=String(value);if(name.startsWith('data-'))this.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(value);}
    getAttribute(name){return this.attrs[name]??null;}
    focus(){document.activeElement=this;send(this,'focusin');}
    showModal(){this.open=true;(this.querySelector('input,select,button')||this).focus();}
    close(){this.open=false;send(this,'close');}
    setPointerCapture(){}getContext(){return ctx;}get cells(){return this.children.filter(n=>['TH','TD'].includes(n.tagName));}
  }
  const body=new Node('body');
  document={...events(),body,hidden:false,activeElement:null,getElementById:id=>body.querySelector('#'+id),createElement:tag=>new Node(tag),
    querySelectorAll:selector=>body.querySelectorAll(selector),querySelector:selector=>body.querySelector(selector)};
  const localStorage={getItem(key){operations.push(['get',key]);if(options.readError)throw Error('Read denied');return storage.get(key)??null;},
    setItem(key,value){operations.push(['set',key]);if(options.writeError)throw Error('Quota');storage.set(key,String(value));}};
  const samples=[];
  host={...events(),document,localStorage,navigator:options.gamepads===false?{}:{getGamepads:()=>samples},
    sessionStorage:{getItem:()=>null,setItem(){}},matchMedia:()=>({matches:false,addEventListener(){}}),scrollTo(){},
    requestAnimationFrame(fn){queue.set(++serial,fn);return serial;},cancelAnimationFrame(id){queue.delete(id);}};
  const context={window:host,document,localStorage,navigator:host.navigator,console,URL,URLSearchParams,AbortController,structuredClone,
    Image:class{set src(value){this._src=value;this.complete=false;this.naturalWidth=0;this.naturalHeight=0;}get src(){return this._src;}},
    Option:class extends Node{constructor(text,value){super('option',{value});this._text=text;}},crypto:{getRandomValues:array=>array.fill(5)},
    performance:{now:()=>time},requestAnimationFrame:host.requestAnimationFrame,cancelAnimationFrame:host.cancelAnimationFrame,
    setTimeout(fn){timers.set(++serial,fn);return serial;},clearTimeout(id){timers.delete(id);},
    location:{protocol:'file:',hash:'',origin:'http://localhost',pathname:'/netplay.html'},fetch:options.fetch||(()=>{throw Error('No network in DOM simulation');})};
  vm.createContext(context);
  function load(files){for(const file of files)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});}
  function html(file){const content=fs.readFileSync(path.join(root,file),'utf8'),markup=content.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];body.innerHTML=markup;}
  function send(target,type,data={}){
    const event={target,type,defaultPrevented:false,preventDefault(){this.defaultPrevented=true;},stopImmediatePropagation(){this.stopped=true;},...data};
    let chain;
    if(target===host)chain=[host];else if(target===document)chain=[document,host];else{chain=[];for(let node=target;node;node=node.parentNode)chain.push(node);chain.push(document,host);}
    for(const capture of [true,false])for(const node of capture?[...chain].reverse():chain){
      for(const listener of [...(node.listeners?.[type]||[])]){if(listener.capture===capture)listener.fn(event);if(event.stopped)return event;}
      if(!capture&&typeof node['on'+type]==='function')node['on'+type](event);if(event.stopped)return event;
    }
    return event;
  }
  function key(key,down=true,extra={}){const code=key.length===1?'Key'+key.toUpperCase():key;return send(extra.target||document.activeElement||body,down?'keydown':'keyup',{key,code,repeat:false,...extra});}
  function click(selector){const node=typeof selector==='string'?document.querySelector(selector):selector;if(!node)throw Error('Missing clickable '+selector);if(node.disabled)throw Error('Disabled '+selector);node.focus();send(node,'click');return node;}
  function change(selector,value){const node=document.querySelector(selector);if(!node)throw Error('Missing input '+selector);node.focus();node.value=String(value);send(node,'change');return node;}
  function frames(count=1){for(let i=0;i<count;i++){time+=1000/60+.000001;const jobs=[...queue.values()];queue.clear();for(const fn of jobs)fn(time);}}
  const settle=async()=>{for(let i=0;i<20;i++)await Promise.resolve();};
  return {host,document,context,Node,ctx,texts,storage,operations,samples,load,html,send,key,click,change,frames,queue,timers,settle};
}
module.exports={world};
