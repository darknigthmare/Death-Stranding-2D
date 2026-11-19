const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require('playwright');

(async()=>{
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
    args:['--autoplay-policy=no-user-gesture-required']});
  try {
    const page=await browser.newPage(), errors=[], media=[];
    page.on('pageerror',err=>errors.push(err.message));
    page.on('request',req=>{if (req.resourceType()==='media') media.push(req.url());});
    await page.addInitScript(()=>{
      Object.defineProperty(window,'StrandAssets',{get:()=>({}),set:()=>{}});
      const NativeAudio=window.AudioContext;
      const started=[], silenced=[];
      window.audioTest={started,silenced};
      function observePitch(param,sequence) {
        for (const method of ['setValueAtTime','exponentialRampToValueAtTime']) {
          const schedule=param[method].bind(param);
          param[method]=(value,...args)=>{sequence.push(value);return schedule(value,...args);};
        }
      }
      function trackSource(node,describe) {
        const start=node.start.bind(node), stop=node.stop.bind(node);
        node.start=t=>{started.push(describe());start(t);};
        node.stop=t=>{if (t===undefined) silenced.push(describe());stop(t);};
        return node;
      }
      window.AudioContext=class extends NativeAudio {
        constructor() {
          super(); window.audioTest.ctx=this;
          this.meter=this.createAnalyser(); this.meter.fftSize=256;
        }
        createGain() {
          const node=super.createGain(), connect=node.connect.bind(node);
          node.connect=(target,...args)=>{
            if (target===this.destination) connect(this.meter);
            return connect(target,...args);
          };
          return node;
        }
        createOscillator() {
          const node=super.createOscillator(), pitch=[];
          observePitch(node.frequency,pitch);
          return trackSource(node,()=>[node.type,...pitch]);
        }
        createBufferSource() {
          const node=super.createBufferSource(), connect=node.connect.bind(node);
          let filter;
          node.connect=target=>{filter=target; return connect(target);};
          return trackSource(node,()=>[filter.type,...filter.pitch]);
        }
        createBiquadFilter() {
          const node=super.createBiquadFilter();
          node.pitch=[]; observePitch(node.frequency,node.pitch); return node;
        }
      };
      let time=0,seq=0;
      const frames=new Map();
      window.requestAnimationFrame=fn=>{frames.set(++seq,fn); return seq;};
      window.cancelAnimationFrame=id=>frames.delete(id);
      window.advanceSound=count=>{
        for (let i=0;i<count;i++) {
          const list=Array.from(frames.values());frames.clear();time+=1000/60+.000001;
          for (const fn of list) fn(time);
        }
      };
    });
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    const result=await page.evaluate(async()=>{
      const canvas=document.createElement('canvas'), trace=audioTest.started;
      const step=advanceSound, {start,input,setSound,snapshot,stop}=StrandFight;
      await audioTest.ctx.resume();
      function reset(id,side=1,sound=true) {
        setSound(false);
        start({canvas,mode:'local',p1:side===1?id:'sam',p2:side===2?id:'sam',stage:'shore',sound,ambienceVolume:0});
        canvas.width=64;canvas.height=36;canvas.getContext('2d').scale(.05,.05);
        step(74); trace.length=0;
      }
      function tap(side,key) {input(side,key,true);input(side,key,false);}
      const profiles=[{},{}];
      for (const side of [1,2]) for (const id of Object.keys(StrandContent.fighters)) {
        reset(id,side); tap(side,'special');step(1);
        profiles[side-1][id]=trace.splice(0);
      }
      reset('mama'); input(1,'left',true);tap(1,'special');input(1,'left',false);step(1);
      const missingAnchor=trace.splice(0);
      reset('sam');tap(1,'special');step(44);trace.length=0;
      tap(1,'special');step(1);
      const insufficient=trace.splice(0);
      reset('cliff');input(1,'right',true);tap(1,'special');input(1,'right',false);step(1);
      const directional=trace.splice(0);
      reset('sam');input(2,'left',true);step(64);input(2,'left',false);
      tap(1,'heavy');step(13);
      const beforeContact=trace.splice(0); step(1);
      const hit=trace.splice(0);
      reset('sam');input(2,'left',true);step(64);input(2,'left',false);
      input(2,'guard',true);tap(1,'heavy');step(14);
      const block=trace.splice(0);

      reset('higgs'); tap(1,'special'); step(1);
      const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
      const meter=audioTest.ctx.meter;
      function peak() {
        const wave=new Float32Array(meter.fftSize);
        meter.getFloatTimeDomainData(wave);
        return Math.max(...wave.map(Math.abs));
      }
      let audible=0;
      for (let i=0;i<4;i++) {await wait(12);audible=Math.max(audible,peak());}
      audioTest.silenced.length=0; setSound(false);
      const stopped=audioTest.silenced.length;
      await wait(100);const mutedPeak=peak();
      reset('heartman',1,false);tap(1,'special');step(25);
      const muted={voices:trace.splice(0),move:snapshot().fighters[0].move};
      reset('heartman');tap(1,'special');step(1);
      const restored=trace.splice(0);
      stop();setSound(false);
      return {profiles,missingAnchor,insufficient,directional,beforeContact,hit,block,audible,stopped,mutedPeak,muted,restored};
    });
    assert.deepEqual(result.profiles[0],result.profiles[1]);
    const expected={
      sam:[['bandpass',780,2350],['triangle',1880,480]],
      fragile:[['square',2200,960],['triangle',2740,1220],['highpass',1400,6200]],
      higgs:[['lowpass',520,125],['sine',77,142],['sine',460,89]],
      cliff:[['square',1190,714],['bandpass',2050,1150]],
      mule:[['sawtooth',360,1280],['sine',940,1640]],
      diehardman:[['triangle',114,61],['square',690,460]],
      mama:[['bandpass',480,1500],['triangle',580,1160],['sine',1740,1680]],
      heartman:[['sine',114,72],['sine',940,910]]
    };
    assert.deepEqual(result.profiles[0],expected);
    assert.deepEqual(result.directional,expected.cliff);
    assert.deepEqual(result.missingAnchor,[]); assert.deepEqual(result.insufficient,[]);
    assert.deepEqual(result.beforeContact,[]); assert.deepEqual(result.hit,[['triangle',103,38]]);
    assert.deepEqual(result.block,[['square',330,110]]);
    assert.ok(result.audible>.0001,'La signature atteint le signal de sortie audio');
    assert.ok(result.stopped>=2,'La coupure arrête les notes en cours ou programmées');
    assert.ok(result.mutedPeak<.00001,'Le signal de sortie revient au silence');
    assert.deepEqual(result.muted,{voices:[],move:'heartman'});
    assert.deepEqual(result.restored,expected.heartman);
    assert.deepEqual(errors,[]);assert.deepEqual(media,[]);
    console.log('OK — Huit signatures synthétisées identiques sur les deux côtés, départ, impact, garde, refus, coupure et reprise du son mesurés dans Web Audio.');
  } finally {await browser.close();}
})().catch(err=>{console.error(err);process.exitCode=1;});
