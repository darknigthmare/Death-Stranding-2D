/* Décor et effets de combat sur plans indépendants. */
(function(scope){
  "use strict";
  const W=1120,H=630,GROUND=528;
  const img={},scenes=new Map();
  const stageIds=Object.freeze(['shore','terminal','mule-camp','timefall-shelter','battlefield','tar-basin']);
  const catalog=scope.StrandContent,art=scope.StrandAssets;
  const assets = {
    sam: "fighters/sam-stance", samAction: "fighters/sam-action", higgs: "fighters/higgs-action"
  };
  for (const [key, path] of Object.entries(assets)) {
    const picture = new Image();
    picture.src = "../assets/" + path + ".webp";
    img[key] = picture;
  }
  const ready=i=>i && i.complete && i.naturalWidth>0;
  const preference=typeof matchMedia!=="undefined"?matchMedia("(prefers-reduced-motion: reduce)"):null;
  let smooth=!preference?.matches;
  preference?.addEventListener?.('change',event=>{smooth=!event.matches;});
  const stageId=id=>stageIds.includes(id)?id:'shore';
  function preload(id){
    id=stageId(id);
    if(!scenes.has(id)){
      const load=path=>{if(!path)return null;const image=new Image();image.src='../'+path;return image;};
      scenes.set(id,{
        legacy:load(art.stages[id]),sky:load(art.skyplates[id]),distant:load(art.distants[id]),
        middle:load(art.midgrounds[id]),floor:load(art.floors[id]),front:load(art.foregrounds[id]),
        geometry:art.stageGeometry[id]||{}
      });
    }
    return scenes.get(id);
  }
  function cover(c,i,x,y,w,h){
    const ratio=Math.max(w/i.naturalWidth,h/i.naturalHeight),iw=i.naturalWidth*ratio,ih=i.naturalHeight*ratio;
    c.drawImage(i,x+(w-iw)/2,y+(h-ih)/2,iw,ih);
  }
  // The historical camera follows a much wider range than the newer engine.
  // Keep scenery travel bounded by the same overscan at both arena limits.
  const sceneryCamera=cam=>cam*.2*(smooth?1:.2);
  function layer(c,scene,key,cam,speed,margin,defaultBase,defaultAnchor,defaultAlpha=1){
    const image=scene[key];if(!ready(image))return;
    const geometry=scene.geometry[key]||{},width=W+margin*2,height=width*image.naturalHeight/image.naturalWidth;
    // Registry bases use 1280 × 720 / ground 588. Preserve their distance to
    // the floor when rendering the original duel at 1120 × 630 / ground 528.
    const base=key==='floor'?GROUND:Number.isFinite(geometry.base)?GROUND+(geometry.base-588)*W/1280:defaultBase;
    const anchor=Number.isFinite(geometry.anchorY)?Math.max(0,Math.min(1,geometry.anchorY)):defaultAnchor;
    c.save();c.globalAlpha=geometry.alpha??defaultAlpha;
    c.drawImage(image,-margin-sceneryCamera(cam)*speed,base-height*anchor,width,height);c.restore();
  }
  function atmosphere(c,id,cam,t){
    if(!smooth)return;
    c.save();c.beginPath();c.rect(0,85,W,GROUND-150);c.clip();
    if(id==='shore'){
      c.translate(-sceneryCamera(cam)*.31,0);
      [[98,184],[171,150],[632,174],[838,125],[982,198]].forEach(([x,y],n)=>{
        const drop=Math.sin(t/134+n)*3;
        c.strokeStyle="rgba(30,42,42,.35)";c.lineWidth=.9;c.beginPath();c.moveTo(x-2,0);c.quadraticCurveTo(x+9,y*.6,x,y+drop);c.stroke();
        c.fillStyle="rgba(26,36,36,.4)";c.beginPath();c.ellipse(x,y+drop,2.1,5.5,.13,0,7);c.fill();
      });
    }
    const weather=catalog.arenas[id]?.weather;
    if(weather){
      c.beginPath();
      for(let i=0;i<40;i++){
        const x=((i*83-t*.38-sceneryCamera(cam)*.38)%(W+80)+W+80)%(W+80)-40;
        if(weather==='shelter'&&x>W*.18&&x<W*.88)continue;
        const y=(i*57+t*((weather==='dust'||weather==='embers') ? .6 : 4.1))%H;
        c.moveTo(x,y);c.lineTo(x-(weather==='dust'?3:1),y+(weather==='dust'?0:weather==='embers'?2:7));
      }
      c.strokeStyle=weather==='embers'||weather==='dust'?'rgba(232,197,147,.2)':'rgba(194,220,224,.18)';c.lineWidth=1;c.stroke();
    }
    c.restore();
  }
  function scenery(c,id,cam,t){
    const scene=preload(id),layered=['sky','distant','middle','floor','front'].every(key=>ready(scene[key]));
    c.fillStyle=catalog.arenas[id]?.sky||'#344448';c.fillRect(0,0,W,H);
    const background=layered?scene.sky:scene.legacy;
    if(ready(background))cover(c,background,-32-sceneryCamera(cam)*.14,-12,W+64,H+24);
    if(layered){
      layer(c,scene,'distant',cam,.27,48,GROUND-32,.96);
      layer(c,scene,'middle',cam,.43,56,GROUND-12,.97,.92);
    }
    atmosphere(c,id,cam,t);
    if(layered)layer(c,scene,'floor',cam,.62,80,GROUND,.3);
    const shade=c.createLinearGradient(0,H*.45,0,H);shade.addColorStop(0,'rgba(2,12,17,0)');shade.addColorStop(1,'rgba(2,12,17,.42)');
    c.fillStyle=shade;c.fillRect(0,0,W,H);
    return layered?scene:null;
  }
  function near(c,scene,cam){
    if(!scene)return;
    const width=W+176,height=width*scene.front.naturalHeight/scene.front.naturalWidth;
    c.drawImage(scene.front,-88-sceneryCamera(cam)*.8,H-height,width,height);
  }
  function player(c,s,i,cam,eco){
    const f=s.fighters[i],t=s.frame;
    const p=f.id==="sam" && f.attack && ready(img.samAction)?img.samAction:img[f.id];
    const x=f.x-cam*.38,y=GROUND-f.z,dir=f.facing;
    c.save();c.fillStyle="rgba(5,14,16,"+(.37*(1-f.z/350))+")";c.beginPath();c.ellipse(x,GROUND+1,48-f.z*.1,8-f.z*.02,0,0,7);c.fill();
    const a=f.attack, m=a?Duels.MOVES[f.id][a.key]:null;
    const arc=a?Math.sin(Math.PI*Math.min(1,a.age/(m.start+m.active+m.recover))):0;
    const bob=!smooth?0:(f.walking?Math.sin(t*.43)*3:Math.sin(t*.057+i)*1.4);
    const recoil=f.hurt?Math.sin(f.hurt*.25)*.05:0,lean=f.guard?-.06:a?(a.key==="low"?-.09:.15)*arc:0;
    const crouch=f.crouch || a?.key==="low";
    c.translate(x+(a?arc*dir*10:0),y+bob);c.scale(dir,1);c.rotate(lean+recoil);
    const ph=(crouch?194:252)*(f.id==="higgs"?1.02:1),pw=ready(p)?ph*(p.naturalWidth/p.naturalHeight):130;
    if(eco) c.filter="grayscale(.6) sepia(.45) hue-rotate(125deg) brightness(1.08)";
    if(f.hurt>9&&smooth) c.filter="brightness(1.43)";
    if(ready(p)) c.drawImage(p,-pw/2,-ph,pw,ph);
    else {c.fillStyle=Duels.ID[f.id].color;c.font="bold 19px sans-serif";c.textAlign="center";c.save();c.scale(dir,1);c.fillText(Duels.ID[f.id].short,0,-75);c.restore();}
    c.filter="none";
    if(f.guardFlash>0){
      c.strokeStyle="#a9edf8";c.lineWidth=3;c.beginPath();c.ellipse(33,-86,30,62,0,-1.22,1.22);c.stroke();
    }else if(f.guard && !f.walking){
      c.strokeStyle="#b4ece685";c.lineWidth=1.1;c.beginPath();c.ellipse(41,-90,16,65,0,-1.07,1.07);c.stroke();
    }
    if(a && a.age>=m.start-3 && a.age<m.start+m.active+4 && !m.projectile){
      const color=f.id==="sam"?"#91d8e1":"#e4c184";
      c.globalAlpha=.8;c.strokeStyle=color;c.lineWidth=m.pull?2:3;c.beginPath();
      if(m.pull || m.grab){const end=Math.min(m.reach,180)*(.74+.25*arc);c.moveTo(18,-100);c.bezierCurveTo(43,-140,end-25,-62,end,-108);c.bezierCurveTo(end+10,-120,end-17,-117,end-8,-105);}
      else {const h=crouch?-29:a.key==="air"?-55:-117;c.moveTo(32,h-16);c.quadraticCurveTo(m.reach*.86,h+3,m.reach,h);}
      c.stroke();
    }c.restore();
    if(f.nameLife>0 && !s.ghost){
      const label=f.combo>=2?f.actionName+" · "+f.combo+" touches":f.actionName;
      c.save();c.textAlign="center";c.font="bold 12px monospace";const tw=c.measureText(label).width;
      const tx=Math.max(tw/2+12,Math.min(W-tw/2-12,x));c.fillStyle="#0b151bdc";c.fillRect(tx-tw/2-7,GROUND+12,tw+14,20);c.fillStyle="#e4efe9";c.fillText(label,tx,GROUND+26);c.restore();
    }
  }
  function projectile(c,s,cam){
    for(const p of s.shots){
      const x=p.x-cam*.38,y=GROUND-61,w=p.key==="super"?63:33;
      c.save();c.translate(x,y);c.scale(p.dir,1);c.fillStyle="#182324ed";c.strokeStyle="#d5b77c";c.lineWidth=1.7;
      c.beginPath();c.moveTo(-w*1.7,9);c.quadraticCurveTo(-w*.7,-6,2,-w*.61);c.quadraticCurveTo(w*.75,7,-w*.55,13);c.closePath();c.fill();c.stroke();c.restore();
    }
  }
  function finish(c,s,cam,frame){
    const f=s.fighters[s.winner],o=s.fighters[1-s.winner];
    const x=o.x-cam*.38,y=GROUND, p=Math.min(1,frame/62);
    c.save();
    if(f.id==="higgs"){
      for(let k=0;k<5;k++){
        const v=(p+k*.17)%1;
        c.strokeStyle="rgba(209,178,113,"+(.8*(1-v))+")";c.fillStyle="rgba(6,15,17,.32)";c.lineWidth=2;
        c.beginPath();c.ellipse(x,y+2,26+v*155,3+v*17,0,0,7);c.fill();c.stroke();
      }
      const dim=c.createLinearGradient(0,y-190*p,0,y);dim.addColorStop(0,"#08121400");dim.addColorStop(1,"#081214");c.fillStyle=dim;c.fillRect(x-60,y-190*p,120,200*p);
    }else{
      const sx=f.x-cam*.38;
      c.strokeStyle="rgba(153,226,232,"+(.9-p*.3)+")";c.lineWidth=2;c.beginPath();c.moveTo(sx,y-102);c.quadraticCurveTo((sx+x)/2,y+56*p,x,y-40*p);c.stroke();
      for(let k=0;k<3;k++){c.strokeStyle="rgba(191,239,230,"+(.65*(1-p))+")";c.beginPath();c.ellipse(sx,y-80,20+k*24+p*105,10+k*12+p*60,0,0,7);c.stroke();}
    }
    c.restore();
  }
  function draw(canvas,s,options={}){
    const c=canvas.getContext("2d"),cam=((s.fighters[0].x+s.fighters[1].x)/2-W/2);
    c.save();c.clearRect(0,0,W,H);
    if(s.shake>0 && smooth)c.translate(Math.sin(s.frame*2)*s.shake*.43,Math.cos(s.frame)*s.shake*.18);
    const scene=scenery(c,stageId(options.stage),cam,s.frame);
    const back=s.fighters[1].attack && !s.fighters[0].attack?0:1;
    player(c,s,back,cam,options.echo?.[back]);player(c,s,1-back,cam,options.echo?.[1-back]);
    projectile(c,s,cam);near(c,scene,cam);
    if(options.finishFrame!=null)finish(c,s,cam,options.finishFrame);
    const top=c.createLinearGradient(0,0,0,175);top.addColorStop(0,"#061115c7");top.addColorStop(1,"#06111500");c.fillStyle=top;c.fillRect(0,0,W,175);c.restore();
  }
  scope.GrèveScene={draw,preload,stageIds};
})(globalThis);
