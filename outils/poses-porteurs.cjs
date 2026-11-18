// Bake four in-between poses from the original stance for each step and hit reaction.
// Run with Node.js and sharp installed. The game reads the exported atlases offline.
const sharp=require('sharp');
const path=require('node:path');
const folder=path.resolve(__dirname,'../modes/echos-de-la-greve/assets/fighters');
const rigs = {
  sam: {hips:.55, split:.52, shoulders:.25, stride:.063, lean:.054, load:.017},
  cliff: {hips:.53, split:.49, shoulders:.22, stride:.084, lean:.073, load:.009}
};
const limit = n => Math.max(0, Math.min(1, n));
const smooth = n => { n = limit(n); return n * n * (3 - 2 * n); };

async function bake(id) {
  const rig=rigs[id], h=600, pad=Math.ceil(h*.12);
  const art=sharp(path.join(folder,id+'-stance.webp'));
  const meta=await art.metadata(), w=Math.round(h*meta.width/meta.height), width=w+2*pad, height=h+pad;
  const source=await art.resize(w,h).ensureAlpha().extend({
    top:pad,bottom:0,left:pad,right:pad,background:{r:0,g:0,b:0,alpha:0}
  }).raw().toBuffer();
  for (const kind of ['step','hit']) {
    const frames=[];
    for (let index=0;index<4;index++) {
      const strength=(index+1)/4;
      const target=Buffer.alloc(width*height*4);
      for (let row=0; row<height; row++) {
        const y=(row-pad)/h;
        const torso=smooth((rig.hips-y)/(rig.hips-rig.shoulders));
        const thigh=smooth((y-rig.hips)/.24), calf=smooth((y-rig.hips-.20)/.23);
        for (let col=0; col<width; col++) {
          const x=(col-pad)/w;
          const front=smooth((x-rig.split+.13)/.26), rear=1-front;
          let dx,dy;
          if (kind==='step') {
            // One boot rolls off the ground while the other travels forward; the load lags behind.
            dx=torso*(rig.lean*.45-(1-smooth(x/.5))*rig.load)
               +thigh*rig.stride*(front*.59-rear*.15)+calf*rig.stride*(front*.32-rear*1.15);
            dy=torso*.011-thigh*(rear*.035+front*.013)-calf*rear*.044;
          } else {
            // Both soles remain planted. Hips sink and the upper back yields more than the belt.
            dx=-(torso*rig.lean*1.75+(1-calf)*.019)+thigh*(1-calf)*front*.035;
            dy=torso*.023+(1-torso)*(1-calf)*.044;
          }
          const sx=Math.round(col-dx*h*strength), sy=Math.round(row-dy*h*strength);
          if (sx<0 || sx>=width || sy<0 || sy>=height) continue;
          const from=4*(sy*width+sx), to=4*(row*width+col);
          target.writeUInt32LE(source.readUInt32LE(from),to);
        }
      }

      frames.push({input:target,raw:{width,height,channels:4},left:index*width,top:0});
    }
    await sharp({create:{width:width*4,height,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
      .composite(frames).webp({quality:94,alphaQuality:100}).toFile(path.join(folder,id+'-'+kind+'.webp'));
  }
}
Promise.all(Object.keys(rigs).map(bake)).catch(error=>{console.error(error);process.exitCode=1;});
