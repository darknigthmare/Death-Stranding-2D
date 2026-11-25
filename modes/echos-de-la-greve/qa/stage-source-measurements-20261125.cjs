/* Inspect native PNG dimensions and alpha to choose stage anchors.
 * This reads image pixels; it never crops, rescales or rewrites the source PNGs. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),{createHash}=require('node:crypto');
const {createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..');
const ids=process.argv.find(arg=>arg.startsWith('--stages='))?.slice(9).split(',')||
  ['south-knot-ruins','timefall-farm','mountain-knot-approach','magellan-ds2'];
const layers=['sky','distant','midground','floor','foreground'];
const report={date:new Date().toISOString(),method:'@napi-rs/canvas; native PNG pixels, no source modification',files:[],missing:[]};
const quantile=(values,p)=>values[Math.min(values.length-1,Math.floor((values.length-1)*p))];
(async()=>{
  for(const id of ids)for(const layer of layers){
    const file='assets/stages/'+id+'-'+layer+'.png',location=path.join(root,file);
    if(!fs.existsSync(location)){report.missing.push(file);continue;}
    const image=await loadImage(location),width=image.width,height=image.height,canvas=createCanvas(width,height),context=canvas.getContext('2d');
    context.drawImage(image,0,0);const pixels=context.getImageData(0,0,width,height).data;
    const alpha=(x,y)=>pixels[(y*width+x)*4+3];
    let alphaMin=255,alphaMax=0,clear=0,solid=0,left=width,top=height,right=-1,bottom=-1;
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const a=alpha(x,y);alphaMin=Math.min(alphaMin,a);alphaMax=Math.max(alphaMax,a);if(a===0)clear++;if(a===255)solid++;
      if(a>24){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
    }
    const item={id,layer,file,width,height,sha256:createHash('sha256').update(fs.readFileSync(location)).digest('hex'),
      alphaMin,alphaMax,transparentFraction:clear/(width*height),opaqueFraction:solid/(width*height),
      visibleBounds:right<0?null:[left,top,right-left+1,bottom-top+1]};
    if(layer==='floor'){
      const rows=[];
      for(let x=Math.ceil(width*.1);x<width*.9;x++){
        for(let y=0;y<height-4;y++){
          if(alpha(x,y)>=224&&alpha(x,y+1)>=224&&alpha(x,y+2)>=224&&alpha(x,y+3)>=224&&alpha(x,y+4)>=224){rows.push(y);break;}
        }
      }
      rows.sort((a,b)=>a-b);
      item.centralSupport={columns:rows.length,min:rows[0],p10:quantile(rows,.1),median:quantile(rows,.5),p90:quantile(rows,.9),max:rows.at(-1)};
      item.suggestedAnchorY=quantile(rows,.5)/height;
      item.nativeLineToScreen588={sourceRow:quantile(rows,.5),sourceHeight:height};
    }
    if(layer==='distant'||layer==='midground'){
      let lastOpaqueRow=null;
      for(let y=height-1;y>=0&&lastOpaqueRow===null;y--){
        let covered=true;
        for(let x=Math.ceil(width*.04);x<width*.96;x++)if(alpha(x,y)<224){covered=false;break;}
        if(covered)lastOpaqueRow=y;
      }
      item.lowestCentralOpaqueRow=lastOpaqueRow;
      item.suggestedBottomAnchorY=lastOpaqueRow===null?null:(lastOpaqueRow+1)/height;
    }
    if(layer==='foreground'){
      let first=null;
      for(let y=0;y<height&&first===null;y++)for(let x=Math.ceil(width*.1);x<width*.9;x++)if(alpha(x,y)>24){first=y;break;}
      item.centralTopVisibleRow=first;
      item.projectedCentralTopY=first===null?null:720-(height-first)*1440/width;
    }
    report.files.push(item);
  }
  report.complete=report.missing.length===0;
  const output=process.argv.find(arg=>arg.startsWith('--output='))?.slice(9);
  if(output){fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');}
  console.log(JSON.stringify(report,null,2));
  if(!report.complete&&!process.argv.includes('--partial'))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
