/*
 * Rebuild Mama's missing wardrobe and articulated frames from the checked-in SVG.
 * This edits vector geometry, not a raster sprite. Every runtime file has one pose.
 * Run: node outils/reconstruire_mama.cjs
 * Optional contact sheet: node outils/reconstruire_mama.cjs --contact /absolute/file.png
 * Requires the project's existing sharp dependency (or NODE_PATH pointing to it).
 */
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const fighters = path.join(root, 'modes/echos-de-la-greve/assets/fighters');
const sources = path.join(fighters, 'source/mama-reconstruction');
const runtime = path.join(fighters, 'mama');
const SCALE = 3, WIDTH = 320, HEIGHT = 340, VIEW_Y = 35;
const FRAME_WIDTH = WIDTH * SCALE, FRAME_HEIGHT = HEIGHT * SCALE;
const FIXED_DATE = '2026-11-19';

// These overlays change the silhouette and the equipment, without recolouring
// or replacing the original face, glasses, clothing, reel, or articulated pieces.
const equipment = `
  <linearGradient id="viaducOchre" x1="0%" y1="0%" x2="100%" y2="22%">
    <stop offset="0%" stop-color="#77613d"/><stop offset="29%" stop-color="#b79147"/>
    <stop offset="54%" stop-color="#d7b268"/><stop offset="78%" stop-color="#ab8947"/>
    <stop offset="100%" stop-color="#715f43"/>
  </linearGradient>
  <linearGradient id="viaducSlate" x1="0%" y1="0%" x2="100%" y2="15%">
    <stop offset="0%" stop-color="#344448"/><stop offset="38%" stop-color="#6d7e7e"/>
    <stop offset="56%" stop-color="#9ba49a"/><stop offset="100%" stop-color="#4d6265"/>
  </linearGradient>
  <g id="helmet" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-23 -41 Q-25 -53 -14 -58 Q-2 -63 11 -59 Q22 -56 25 -44 L28 -38
      22 -34 12 -37 -4 -35 -18 -36Z" fill="url(#viaducOchre)" stroke="#364246" stroke-width="1.25"/>
    <path d="M-19 -43 Q-18 -53 -8 -56 L-4 -55 -7 -38 -17 -38Z" fill="#858573" stroke="#57615c" stroke-width=".7"/>
    <path d="M2 -59 Q9 -58 12 -55 L13 -39 8 -38 6 -56Z" fill="#d8c38c" stroke="#8f794d" stroke-width=".6"/>
    <path d="M-23 -40 Q-4 -35 13 -39 L30 -37 31 -34 22 -32 9 -35 -8 -33 -24 -36Z"
      fill="url(#metal)" stroke="#303e41" stroke-width="1"/>
    <path d="M-18 -38 L-17 -26 -12 -19 -8 -18" fill="none" stroke="#414c48" stroke-width="3"/>
    <path d="M-18 -36 L-17 -26 -12 -20" fill="none" stroke="#b3a177" stroke-width=".8"/>
    <path d="M16 -50 L24 -48 26 -42 18 -41 14 -44Z" fill="url(#metal)" stroke="#354245" stroke-width=".9"/>
    <path d="M20 -47 L24 -46 25 -43 20 -42Z" fill="#abd8d2" stroke="#536f71" stroke-width=".6"/>
    <path d="M-12 -49 L-7 -48 M-12 -46 L-8 -45" fill="none" stroke="#5b665b" stroke-width="1"/>
    <path d="M-15 -56 Q-2 -60 6 -58 M-20 -42 L-15 -41" fill="none" stroke="#e4d1a1" stroke-width=".7"/>
    <circle cx="-16" cy="-37" r="1.4" fill="#c7cbb3" stroke="#4b5651" stroke-width=".6"/>
  </g>
  <g id="harness" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-19 -87 L-11 -86 -6 -61 10 -30 17 -12 12 -6 2 -27 -13 -57Z"
      fill="#354649" stroke="#2a3a3e" stroke-width="1"/>
    <path d="M12 -88 L19 -84 12 -61 -4 -34 -16 -7 -23 -10 -12 -36 5 -65Z"
      fill="url(#viaducOchre)" stroke="#5b604d" stroke-width="1"/>
    <path d="M-16 -83 L-10 -60 5 -29 13 -10 M13 -83 L8 -63 -8 -35 -19 -11"
      fill="none" stroke="#c7b47e" stroke-width=".8"/>
    <path d="M-19 -61 L13 -62 14 -55 -18 -53Z" fill="#35484b" stroke="#293b3e" stroke-width="1"/>
    <path d="M-5 -64 L5 -64 7 -57 3 -52 -6 -54Z" fill="url(#metal)" stroke="#3c514f" stroke-width=".8"/>
    <path d="M-3 -60 L3 -61 3 -56 -2 -56Z" fill="#a9b5a2" stroke="#52675e" stroke-width=".55"/>
    <path d="M-24 -12 Q-3 -7 21 -14 L22 -6 Q-3 3 -26 -5Z" fill="#344548" stroke="#293b3f" stroke-width="1"/>
    <path d="M-20 -9 Q-3 -5 16 -10" fill="none" stroke="#cab789" stroke-width=".85"/>
    <path d="M-4 -9 L4 -11 8 -6 6 0 -2 1 -6 -3Z" fill="url(#viaducSlate)" stroke="#2f4448" stroke-width=".8"/>
    <path d="M-2 -6 L3 -7 4 -3 0 -2Z" fill="#c3ccad"/>
    <path d="M15 -6 Q24 -8 25 -1 Q26 6 18 8 L15 4Z" fill="none" stroke="#bac1a4" stroke-width="2.2"/>
    <path d="M-22 -8 L-26 -3 -24 7 -18 10" fill="none" stroke="#dab66b" stroke-width="2"/>
    <path d="M-22 -8 L-26 -3 -24 7 -18 10" fill="none" stroke="#514f43" stroke-width=".6"/>
    <rect x="7" y="-49" width="9" height="15" rx="2" fill="url(#viaducSlate)" stroke="#3b5155" stroke-width=".8"/>
    <path d="M9 -45 L14 -46 M9 -41 L14 -42" fill="none" stroke="#9accc6" stroke-width=".9"/>
  </g>
  <g id="pauldron" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-10 -6 Q-1 -11 9 -5 L12 4 9 16 2 20 -8 16 -11 7Z"
      fill="url(#viaducOchre)" stroke="#384a4a" stroke-width="1.1"/>
    <path d="M-8 -3 Q0 -7 7 -2 L8 4 4 12 -5 11 -9 5Z" fill="url(#viaducSlate)" stroke="#5b665d" stroke-width=".75"/>
    <path d="M-10 10 L-4 15 4 16 9 12" fill="none" stroke="#dac185" stroke-width="1.3"/>
    <circle cx="-7" cy="2" r="1.25" fill="#c6cbb6" stroke="#53645b" stroke-width=".5"/>
    <circle cx="6" cy="2" r="1.25" fill="#c6cbb6" stroke="#53645b" stroke-width=".5"/>
    <path d="M-5 15 L4 16" fill="none" stroke="#2e4146" stroke-width="2"/>
  </g>
  <g id="gauntlet" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-8 0 L6 -1 9 5 8 16 5 34 -4 37 -8 31 -9 14Z"
      fill="url(#viaducSlate)" stroke="#35494b" stroke-width="1"/>
    <path d="M-6 5 L6 3 7 8 -6 11Z M-6 27 L5 25 4 30 -6 32Z" fill="#34484a" stroke="#283d40" stroke-width=".5"/>
    <path d="M-3 12 L4 10 5 20 1 24 -4 23Z" fill="#bf9c55" stroke="#506056" stroke-width=".8"/>
    <path d="M-2 14 L3 13 3 17 -2 18Z" fill="#aad9cd" stroke="#637f73" stroke-width=".5"/>
    <path d="M-6 3 L-5 1 3 0 M-5 35 L2 33" fill="none" stroke="#cad1b6" stroke-width=".8"/>
  </g>
  <g id="kneepad" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-15 -3 L-5 -5 12 -2 16 5 12 17 1 21 -12 16 -16 7Z"
      fill="url(#viaducOchre)" stroke="#394d4d" stroke-width="1"/>
    <path d="M-11 0 L-3 -2 9 1 11 7 6 14 -5 14 -12 8Z" fill="url(#viaducSlate)" stroke="#596e65" stroke-width=".8"/>
    <path d="M-11 5 L9 5 M-7 10 L6 10" fill="none" stroke="#acb9a4" stroke-width=".8"/>
    <path d="M-14 12 L-11 16 -1 19 10 16" fill="none" stroke="#d4bd82" stroke-width="1"/>
    <circle cx="-11" cy="2" r="1" fill="#c3cdb6"/>
    <circle cx="9" cy="3" r="1" fill="#c3cdb6"/>
  </g>`;

const overlays = {head:'helmet', torso:'harness', upperArm:'pauldron', forearm:'gauntlet', shin:'kneepad'};
const movementPoses = {
  guard: {
    hips:[150,230], lean:-5, head:2,
    backKnee:[112,286], backFoot:[90,357], backFootAngle:0,
    frontKnee:[185,284], frontFoot:[205,357], frontFootAngle:0,
    backElbow:[178,165], backWrist:[189,129], backHandAngle:-60,
    frontElbow:[161,183], frontWrist:[182,146], frontHandAngle:-48,
    remote:true, note:'Deux avant-bras ferment la poitrine et le visage ; jambes fléchies et pieds plantés.'
  },
  crouch: {
    hips:[147,287], lean:18, head:-12,
    backKnee:[106,319], backFoot:[85,357], backFootAngle:0,
    frontKnee:[211,308], frontFoot:[204,357], frontFootAngle:0,
    backElbow:[212,218], backWrist:[221,184], backHandAngle:-48,
    frontElbow:[176,244], frontWrist:[204,226], frontHandAngle:-30,
    remote:true, note:'Bassin abaissé, deux genoux réellement pliés, bras devant le torse ; le corps n’est pas écrasé.'
  },
  rise: {
    hips:[151,235], lean:6, head:-4,
    backKnee:[123,291], backFoot:[112,349], backFootAngle:12,
    frontKnee:[204,254], frontFoot:[205,315], frontFootAngle:-18,
    backElbow:[190,173], backWrist:[205,137], backHandAngle:-42,
    frontElbow:[163,190], frontWrist:[192,165], frontHandAngle:-35,
    remote:true, airborne:true, note:'Un genou monte tandis que la jambe arrière termine la poussée.'
  },
  apex: {
    hips:[153,239], lean:-6, head:5,
    backKnee:[106,269], backFoot:[133,329], backFootAngle:-26,
    frontKnee:[204,253], frontFoot:[201,320], frontFootAngle:21,
    backElbow:[181,177], backWrist:[198,141], backHandAngle:-48,
    frontElbow:[157,195], frontWrist:[190,176], frontHandAngle:-28,
    remote:true, airborne:true, note:'Les deux genoux se replient au sommet, les bottes restent séparées et le bassin se redresse.'
  },
  fall: {
    hips:[150,226], lean:10, head:-7,
    backKnee:[117,286], backFoot:[115,352], backFootAngle:8,
    frontKnee:[182,285], frontFoot:[198,351], frontFootAngle:-6,
    backElbow:[196,174], backWrist:[220,147], backHandAngle:-24,
    frontElbow:[151,190], frontWrist:[183,186], frontHandAngle:-12,
    remote:true, airborne:true, note:'Jambes dépliées pour la réception, bras ouverts pour rétablir l’équilibre.'
  }
};

const parts = {
  thigh:{pivot:[66,14],size:[132,249]}, shin:{pivot:[50,16],size:[100,240]},
  boot:{pivot:[50,32],size:[158,84]}, upperArm:{pivot:[35,25],size:[72,157]},
  forearm:{pivot:[28,13],size:[57,143]}, cuff:{pivot:[31,19],size:[65,41]},
  hand:{pivot:[22,10],size:[73,62]}, remote:{pivot:[22,31],size:[125,58]},
  torso:{pivot:[88,319],size:[168,422]}, reel:{pivot:[58,61],size:[108,133]},
  head:{pivot:[115,165],size:[206,178]}, helmet:{pivot:[76,188],size:[177,147]},
  harness:{pivot:[82,271],size:[177,320]}, pauldron:{pivot:[37,29],size:[80,96]},
  gauntlet:{pivot:[31,7],size:[66,123]}, kneepad:{pivot:[52,19],size:[109,85]}
};

function groupBody(source, id) {
  const start = source.indexOf('<g id="' + id + '">');
  if (start < 0) throw new Error('Missing source group: ' + id);
  const begin = source.indexOf('>', start) + 1;
  const tags = /<g\b[^>]*>|<\/g>/g; tags.lastIndex = begin;
  let depth = 1, match;
  while ((match = tags.exec(source))) {
    depth += match[0].startsWith('</') ? -1 : 1;
    if (!depth) return source.slice(begin, match.index);
  }
  throw new Error('Unclosed group: ' + id);
}
const fmt = number => Number(number.toFixed(4));
function use(id, transform='') { return `<use xlink:href="#${id}" transform="${transform}"/>`; }
function bone(id, from, to, length) {
  const dx=to[0]-from[0], dy=to[1]-from[1];
  return use(id, `translate(${from.map(fmt).join(' ')}) rotate(${fmt(Math.atan2(-dx,dy)*180/Math.PI)}) scale(1 ${fmt(Math.hypot(dx,dy)/length)})`);
}
function point(origin, local, degrees) {
  const angle=degrees*Math.PI/180, c=Math.cos(angle), s=Math.sin(angle);
  return [origin[0]+c*local[0]-s*local[1], origin[1]+s*local[0]+c*local[1]];
}
function joint(p, radius) {
  return `<circle cx="${fmt(p[0])}" cy="${fmt(p[1])}" r="${radius}" fill="url(#metal)" stroke="#344041" stroke-width="1.1"/>
    <circle cx="${fmt(p[0])}" cy="${fmt(p[1])}" r="${radius/2}" fill="#657470" stroke="#394547" stroke-width=".65"/>
    <path d="M${fmt(p[0]-radius*.24)} ${fmt(p[1]+radius*.15)}l${radius*.48} ${-radius*.3}"
      fill="none" stroke="#c1bda0" stroke-width=".7" stroke-linecap="round"/>`;
}
function rig(pose) {
  const hipBack=[pose.hips[0]-5,pose.hips[1]+1], hipFront=[pose.hips[0]+5,pose.hips[1]+2];
  const backShoulder=point(pose.hips,[10,-78],pose.lean);
  const frontShoulder=point(pose.hips,[-11,-77],pose.lean);
  const reel=point(pose.hips,[-22,3],pose.lean);
  return `<g opacity=".98">${bone('thigh',hipBack,pose.backKnee,74)}
      ${bone('shin',pose.backKnee,pose.backFoot,70)}
      ${use('boot',`translate(${pose.backFoot.join(' ')}) rotate(${pose.backFootAngle})`)}</g>
    ${bone('thigh',hipFront,pose.frontKnee,74)}
    ${bone('shin',pose.frontKnee,pose.frontFoot,70)}
    ${use('boot',`translate(${pose.frontFoot.join(' ')}) rotate(${pose.frontFootAngle})`)}
    ${bone('upperArm',backShoulder,pose.backElbow,39)}${joint(pose.backElbow,5.5)}
    ${bone('forearm',pose.backElbow,pose.backWrist,40)}
    ${use('hand',`translate(${pose.backWrist.join(' ')}) rotate(${pose.backHandAngle})`)}
    <g transform="translate(${pose.hips.join(' ')}) rotate(${pose.lean})">
      ${use('torso')}${use('head',`translate(2 -97) rotate(${pose.head})`)}</g>
    ${use('reel',`translate(${reel.map(fmt).join(' ')}) rotate(${pose.lean-5})`)}
    ${bone('upperArm',frontShoulder,pose.frontElbow,39)}${joint(pose.frontElbow,5.5)}
    ${bone('forearm',pose.frontElbow,pose.frontWrist,40)}
    ${use('cuff',`translate(${pose.frontWrist.join(' ')}) rotate(${pose.frontHandAngle})`)}
    ${use('hand',`translate(${pose.frontWrist.join(' ')}) rotate(${pose.frontHandAngle})`)}
    ${pose.remote ? use('remote',`translate(${pose.frontWrist[0]+7} ${pose.frontWrist[1]+5}) rotate(${pose.frontHandAngle*.3})`) : ''}
    ${joint(frontShoulder,7)}`;
}
function dress(body) {
  return body.replace(/<use\b[^>]*xlink:href="#(head|torso|upperArm|forearm|shin)"[^>]*\/>/g,
    (match,id) => match + match.replace('href="#'+id+'"', 'href="#'+overlays[id]+'"'));
}
function svg(defs, body, width, height, box, title) {
  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${width}" height="${height}" viewBox="${box.join(' ')}">
  <title>${title}</title><desc>Reconstruction vectorielle du 19 novembre 2026 à partir des pièces de mama.svg. Une seule pose. Tenue Viaduc originale du fan game ; fidélité canonique non validée.</desc>
  <defs>${defs}</defs>${body}
</svg>\n`;
}
async function bbox(buffer) {
  const {data,info}=await sharp(buffer).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let left=info.width,top=info.height,right=-1,bottom=-1,solid=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++) {
    const alpha=data[(y*info.width+x)*4+3];
    if(alpha>8) {left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);solid++;}
  }
  return {left,top,right,bottom,visiblePixels:solid};
}
async function writeFrame(defs, outfit, pose, body, shift, portrait=false) {
  const frameBody=`<g transform="translate(${shift} 0)">${outfit==='viaduc'?dress(body):body}</g>`;
  const width=portrait?710:FRAME_WIDTH, height=portrait?915:FRAME_HEIGHT;
  // Portrait uses the original bust composition with room for the new helmet.
  const box=portrait?[87,50,133,171.4]:[0,VIEW_Y,WIDTH,HEIGHT];
  const content=svg(defs,frameBody,width,height,box,`Mama · ${outfit} · ${pose}`);
  const svgFile=path.join(sources,outfit,pose+'.svg'), webpFile=path.join(runtime,outfit,pose+'.webp');
  await fs.mkdir(path.dirname(svgFile),{recursive:true});
  await fs.mkdir(path.dirname(webpFile),{recursive:true});
  await fs.writeFile(svgFile,content);
  const output=await sharp(Buffer.from(content)).webp({lossless:true,effort:5}).toBuffer();
  await fs.writeFile(webpFile,output);
  const bounds=await bbox(output);
  if(!portrait && (bounds.left<2 || bounds.top<2 || bounds.right>width-3 || bounds.bottom>height-3)) {
    throw new Error(`Clipped pose ${outfit}/${pose}: ${JSON.stringify(bounds)}`);
  }
  return {file:path.relative(fighters,webpFile).split(path.sep).join('/'),source:path.relative(fighters,svgFile).split(path.sep).join('/'),
    width,height,...(!portrait?{anchorX:480,baselineY:1017,stanceHeight:920,anchor:.5,scale:FRAME_HEIGHT/920}:{}),
    bounds,sha256:crypto.createHash('sha256').update(output).digest('hex')};
}
async function main() {
  const master=await fs.readFile(path.join(fighters,'source/mama.svg'),'utf8');
  const firstPose=master.indexOf('<g id="pose-stance">');
  const defs=master.slice(master.indexOf('<defs>')+6,firstPose)+equipment;
  const baseShifts={stance:8,step:5.5,action:2,hit:5,portrait:0};
  const frames={atelier:{},viaduc:{}};
  for(const [pose,spec] of Object.entries(movementPoses)) {
    // The frame origin follows the support midpoint, not the changing image bounds.
    const shift=spec.airborne?160-spec.hips[0]:160-((spec.backFoot[0]+spec.frontFoot[0])/2+10);
    const body=rig(spec);
    for(const outfit of ['atelier','viaduc']) frames[outfit][pose]=await writeFrame(defs,outfit,pose,body,shift);
  }
  for(const pose of ['stance','action','step','hit','portrait']) {
    frames.viaduc[pose]=await writeFrame(defs,'viaduc',pose,groupBody(master,'pose-'+pose),baseShifts[pose],pose==='portrait');
  }
  const partManifest={units:'pixels',pixelsPerDesignUnit:3,pivots:{},overlays,parts:{}};
  await fs.mkdir(path.join(sources,'parts'),{recursive:true});
  await fs.mkdir(path.join(runtime,'parts'),{recursive:true});
  for(const [id,spec] of Object.entries(parts)) {
    const [width,height]=spec.size, [px,py]=spec.pivot;
    const content=svg(defs,use(id),width,height,[-px/SCALE,-py/SCALE,width/SCALE,height/SCALE],`Mama · pièce · ${id}`);
    await fs.writeFile(path.join(sources,'parts',id+'.svg'),content);
    const image=await sharp(Buffer.from(content)).webp({lossless:true,effort:5}).toBuffer();
    await fs.writeFile(path.join(runtime,'parts',id+'.webp'),image);
    const bounds=await bbox(image);
    if(bounds.left===0 || bounds.top===0 || bounds.right===width-1 || bounds.bottom===height-1)
      throw new Error('Clipped part '+id+': '+JSON.stringify(bounds));
    partManifest.pivots[id+'.webp']=spec.pivot;
    partManifest.parts[id+'.webp']={width,height,bounds,reconstructedOverlay:Object.values(overlays).includes(id)};
  }
  await fs.writeFile(path.join(runtime,'parts/pivots.json'),JSON.stringify(partManifest,null,2)+'\n');
  const manifest={schemaVersion:1,date:FIXED_DATE,source:'source/mama.svg',
    sourceSha256:crypto.createHash('sha256').update(master).digest('hex'),
    generator:'outils/reconstruire_mama.cjs',
    status:'reconstructed-from-existing-vector-not-recovered-original-binaries',
    fidelity:'Original articulated adaptation; canonical 1:1 comparison not validated. Viaduc is an original fan-game costume.',
    frameContract:{width:FRAME_WIDTH,height:FRAME_HEIGHT,viewBox:[0,VIEW_Y,WIDTH,HEIGHT],anchorX:480,baselineY:1017,scale:FRAME_HEIGHT/920},
    newArticulations:movementPoses,frames,
    counts:{individualRuntimeViews:15,separateRuntimeParts:16,newMovementPoses:5,newEquipmentOverlays:5},
    notes:['Four Viaduc core poses retain the original articulated pose geometry, with added equipment and a fixed frame.',
      'Airborne poses retain their in-frame vertical offsets; world jump height remains controlled by the simulation.',
      'All sixteen local piece pivots preserve the recovered coordinate contract; five overlays were drawn anew.',
      'Portrait is intentionally cropped at the torso. Gameplay views include the complete silhouette.']};
  await fs.writeFile(path.join(runtime,'reconstruction.json'),JSON.stringify(manifest,null,2)+'\n');
  const contactIndex=process.argv.indexOf('--contact');
  if(contactIndex>=0) {
    const output=process.argv[contactIndex+1];
    if(!output || !path.isAbsolute(output))throw new Error('--contact requires an absolute output path');
    const order=['stance','guard','crouch','rise','apex','fall','step','action','hit'];
    const tileW=180,tileH=225,columns=9,rows=2;
    const layers=[];
    for(let row=0;row<rows;row++)for(let col=0;col<columns;col++) {
      const outfit=row?'viaduc':'atelier',pose=order[col],frame=frames[outfit][pose];
      if(!frame)continue;
      const buffer=await sharp(path.join(fighters,frame.file)).resize(172,196,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).png().toBuffer();
      layers.push({input:buffer,left:col*tileW+4,top:row*tileH+22});
      const label=Buffer.from(`<svg width="${tileW}" height="20"><text x="8" y="15" fill="#d7e7e5" font-family="sans-serif" font-size="12">${outfit} / ${pose}</text></svg>`);
      layers.push({input:label,left:col*tileW,top:row*tileH});
    }
    await sharp({create:{width:tileW*columns,height:tileH*rows,channels:4,background:'#20323a'}}).composite(layers).png().toFile(output);
  }
  console.log(JSON.stringify({views:15,parts:16,dimensions:[FRAME_WIDTH,FRAME_HEIGHT],manifest:path.relative(root,path.join(runtime,'reconstruction.json'))},null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;});
