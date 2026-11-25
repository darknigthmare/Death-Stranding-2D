/* Run from the repository with Node. This harness does not decode pixels or launch a browser. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const run = require('./boss-simulation.js');
const root = path.resolve(__dirname, '..');
const names = ['content.js','asset-geometry-20261124.js','assets.js','boss-geometry-20261124.js','boss-assets.js','boss.js','input.js','app.js'];
const sources = Object.fromEntries(names.map(name => [name, fs.readFileSync(path.join(root,name),'utf8')]));
const dimensionsPath = path.join(__dirname,'native-image-dimensions-20261124.cjs');
const imageSizes = require(dimensionsPath);
const blobSha = source => {
  const bytes = Buffer.from(source,'utf8');
  return crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');
};
const result = run(sources,{imageSizes});
result.executedAt = new Date().toISOString();
result.method = 'Node.js; actual simulation and app; simulated Canvas, Image and DOM';
result.node = process.version;
result.sourceBlobs = Object.fromEntries(names.map(name => [name,blobSha(sources[name])]));
result.sourceBlobs['qa/boss-simulation.js'] = blobSha(fs.readFileSync(path.join(__dirname,'boss-simulation.js'),'utf8'));
result.sourceBlobs['qa/native-image-dimensions-20261124.cjs'] = blobSha(fs.readFileSync(dimensionsPath,'utf8'));
result.imageMetadataCount = Object.keys(imageSizes).length;
const json = JSON.stringify(result,null,2)+'\n';
if(process.argv[2]) {
  const output = path.resolve(process.argv[2]);
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,json);
}
process.stdout.write(json);
