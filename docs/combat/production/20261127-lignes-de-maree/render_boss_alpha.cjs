'use strict';
const fs=require('node:fs'), path=require('node:path'), crypto=require('node:crypto');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'../../../..');
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'bosses-generation.json'),'utf8'));
const out=path.join(__dirname,'boss-alpha-review');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const evidence=[];
 for(let batch=0;batch<5;batch++){
  const c=createCanvas(1536,1120),ctx=c.getContext('2d');
  ctx.fillStyle='#102a30';ctx.fillRect(0,0,c.width,c.height);
  ctx.fillStyle='#eff7f5';ctx.font='bold 27px sans-serif';
  ctx.fillText('BOSS · BASES NATIVES RGBA · contrôle de transparence '+(batch+1)+'/5',24,42);
  const assets=manifest.assets.slice(batch*4,batch*4+4);
  for(let i=0;i<assets.length;i++){
   const a=assets[i],p=path.join(root,a.assetPath),before=hash(p),im=await loadImage(p);
   const x=(i%2)*768+16,y=Math.floor(i/2)*520+70,w=736,h=470;
   for(let py=0;py<h;py+=32)for(let px=0;px<w;px+=32){
    ctx.fillStyle=((Math.floor(px/32)+Math.floor(py/32))%2)?'#bdcdcd':'#e4ecea';
    ctx.fillRect(x+px,y+py,Math.min(32,w-px),Math.min(32,h-py));
   }
   const scale=Math.min((w-26)/im.width,(h-22)/im.height);
   ctx.drawImage(im,x+(w-im.width*scale)/2,y+(h-im.height*scale)/2,im.width*scale,im.height*scale);
   ctx.fillStyle='#eff7f5';ctx.font='19px sans-serif';ctx.fillText(a.id+' · '+im.width+' × '+im.height,x,y+h+27);
   if(hash(p)!==before)throw Error('Source modified: '+p);
  }
  const filename='boss-alpha-'+(batch+1)+'.png';
  fs.writeFileSync(path.join(out,filename),c.toBuffer('image/png'));
  evidence.push({file:'boss-alpha-review/'+filename,sha256:hash(path.join(out,filename)),assetIds:assets.map(a=>a.id)});
 }
 fs.writeFileSync(path.join(out,'canvas-review.json'),JSON.stringify({nativeCanvas:true,purpose:'Read-only QA rendering of unchanged PNG assets over a checkerboard; these contact sheets are not sprite assets.',assetFilesUnmodified:true,cases:evidence},null,2)+'\n');
 console.log(JSON.stringify({passed:true,imagesDrawn:20,sheets:5,out}));
})().catch(e=>{console.error(e);process.exitCode=1});
