// Relais en mémoire pour deux clients utilisant le moteur StrandFight.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { randomBytes, createHash } = require('node:crypto');
const { performance } = require('node:perf_hooks');
const root = __dirname;
const gameRoot = path.resolve(root, '../..');
const context = {window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'content.js'), 'utf8'), context);
const {fighters, stages} = context.window.StrandContent;
const actions = new Set(['left','right','up','down','light','heavy','guard','special','throw','finish']);
const heartbeat = 3000;
const pastWindow = 24;
const futureWindow = 10;
const tokenPattern = /^[a-zA-Z0-9_-]{24,64}$/;
const roomCode = () => randomBytes(9).toString('base64url');
function reject(status, message) { throw Object.assign(new Error(message), {status}); }
// The relay serves the same image inventory that participates in its version.
// Nested outfits are allowed, while source files, dot paths and symlinks stay private.
function assetFiles(baseRoot = root) {
  const files = [];
  const assetRoot = path.join(baseRoot,'assets');
  if (!fs.lstatSync(assetRoot,{throwIfNoEntry:false})?.isDirectory()) return files;
  function visit(relative) {
    const directory = path.join(baseRoot,relative);
    if (!fs.lstatSync(directory,{throwIfNoEntry:false})?.isDirectory()) return;
    for (const entry of fs.readdirSync(directory,{withFileTypes:true})) {
      const file = relative + '/' + entry.name;
      if (entry.isDirectory() && /^[\w-]+$/.test(entry.name)) visit(file);
      else if (entry.isFile() && /^[\w-]+\.(?:webp|png)$/.test(entry.name)) files.push(file);
    }
  }
  for (const folder of ['fighters','finishers','props','projectiles','stages','story']) visit('assets/' + folder);
  return files.sort();
}
function gameVersion(baseRoot = root, assets = assetFiles(baseRoot)) {
  const hash = createHash('sha256');
  for (const file of ['fight.js','content.js','asset-geometry-20261124.js','assets.js','netplay.js','netplay-server.cjs']) {
    hash.update(file);
    hash.update(fs.readFileSync(path.join(baseRoot,file)));
  }
  for (const file of assets) {
    hash.update(file);
    hash.update(fs.readFileSync(path.join(baseRoot,file)));
  }
  return hash.digest('hex').slice(0,20);
}
function roomService(version, clock = () => performance.now()) {
  const rooms = new Map();
  const seat = (token, now) => ({token, seen:now, serial:0, ready:false, fighter:'sam', done:null});
  function advance(room, now) {
    if (room.match && room.live && !room.closed) {
      const until = Math.min(now, ...room.seats.map(s => s.seen + heartbeat));
      room.frames += Math.max(0, until - room.time) * .06;
    }
    room.time = now;
    room.live = room.seats.every(s => s && now - s.seen < heartbeat);
  }
  function receive(data) {
    const {op,token} = data;
    if (data.version !== version) reject(409,'Version de jeu différente. Recharge la page.');
    if (typeof token !== 'string' || !tokenPattern.test(token)) reject(400,'Identifiant de session incorrect.');
    const now = clock();
    for (const [key,r] of rooms) if (now-r.touched > 15*60*1000) rooms.delete(key);
    if (op === 'create') {
      const prior = [...rooms.values()].find(r => r.seats[0].token === token && !r.closed);
      if (prior) return {room:prior.code, player:1};
      if (rooms.size >= 128) reject(503,'Tous les salons sont occupés.');
      const code = roomCode();
      rooms.set(code,{code,seats:[seat(token,now),null],match:null,frames:0,time:now,live:false,touched:now,events:[],closed:false});
      return {room:code,player:1};
    }
    const room = rooms.get(data.room);
    if (!room) reject(404,'Ce salon a expiré ou son adresse est incorrecte.');
    const seats = room.seats;
    let i = seats.findIndex(s => s?.token === token);
    if (op === 'join' && i === -1 && !seats[1] && !room.closed) {
      seats[1] = seat(token,now);
      i = 1;
    }
    if (i === -1) reject(403,'Les deux places de ce salon sont déjà prises ou le salon est fermé.');
    advance(room,now);
    const me = seats[i];
    room.touched = now;
    me.seen = now;
    if (op === 'join') {
      if (room.closed) reject(404,'Ce salon est fermé.');
      advance(room,now);
      return {room:room.code,player:i+1};
    }
    if (op === 'leave') room.closed = true;
    else if (op === 'ready' && !room.match && !room.closed) {
      if (!Object.hasOwn(fighters,data.fighter) || typeof data.ready !== 'boolean') reject(400,'Choix de combattant incorrect.');
      me.ready = data.ready;
      me.fighter = data.fighter;
    } else if (op === 'start' && !room.match && !room.closed) {
      if (i !== 0 || !seats.every(s => s?.ready && now-s.seen < heartbeat) || !Object.hasOwn(stages,data.stage)) reject(409,'Les deux joueurs doivent être présents et prêts.');
      room.match = {p1:seats[0].fighter,p2:seats[1].fighter,stage:data.stage,seed:randomBytes(4).readUInt32LE(),version};
    } else if (op === 'sync' && room.match && !room.closed) {
      const tick = Math.floor(room.frames);
      if (!Array.isArray(data.inputs) || data.inputs.length > 64) reject(400,'Lot de commandes incorrect.');
      for (const event of data.inputs) {
        if (!Array.isArray(event) || event.length !== 4) reject(400,'Commande incorrecte.');
        const [serial,at,action,down] = event;
        if (!Number.isSafeInteger(serial) || serial < 1 || !Number.isSafeInteger(at) || !actions.has(action) || typeof down !== 'boolean') reject(400,'Commande incorrecte.');
        if (serial <= me.serial) continue;
        if (serial !== me.serial+1) break;
        if (room.events.length >= 120000) {room.closed=true;break;}
        const scheduled = Math.min(tick+futureWindow, Math.max(0,tick-pastWindow,at,me.lastTick||0));
        room.events.push([i+1,serial,scheduled,action,down]);
        me.serial = serial;
        me.lastTick = scheduled;
      }
      const done = data.done;
      if (done && Number.isSafeInteger(done.tick) && done.tick > 0 && done.tick < tick-pastWindow &&
          [1,2].includes(done.winner) && /^[0-2]-[0-2]$/.test(done.rounds) &&
          data.cursor === room.events.length) {
        me.done = {tick:done.tick,winner:done.winner,rounds:done.rounds};
      }
    }
    advance(room,now);
    const cursor = Number.isSafeInteger(data.cursor) && data.cursor>=0 ? Math.min(data.cursor,room.events.length) : 0;
    const done = seats.every(s => s?.done);
    return {player:i+1,room:room.code,seats:seats.map(s => s ? {ready:s.ready,fighter:s.fighter,connected:now-s.seen<heartbeat}:null),
      match:room.match,tick:Math.floor(room.frames),live:room.live,closed:room.closed,cursor,
      ack:me.serial,events:room.events.slice(cursor,cursor+2500),total:room.events.length,
      result:done ? (JSON.stringify(seats[0].done) === JSON.stringify(seats[1].done) ? seats[0].done:{mismatch:true}):null};
  }
  return receive;
}
const statics = new Set(['index.html','style.css','app.js','fight.js','content.js','asset-geometry-20261124.js','assets.js','tournament.js','netplay.html','netplay.js','netplay.css',
  'duel-originel/index.html','duel-originel/style.css','duel-originel/interface.js','duel-originel/moteur.js','duel-originel/scene.js']);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png'};
function openRelay(clock) {
  const assets = new Set(assetFiles());
  const version = gameVersion(root,assets);
  const receive = roomService(version,clock);
  return http.createServer(async (req,res) => {
    function send(code,payload) {
      res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});
      res.end(JSON.stringify(payload));
    }
    try {
      const url = new URL(req.url,'http://localhost');
      if (req.method === 'GET' && url.pathname === '/room-version.js') {
        res.writeHead(200,{'Content-Type':'text/javascript','Cache-Control':'no-store'});
        res.end('window.StrandRoomVersion='+JSON.stringify(version));
        return;
      }
      if (req.method === 'POST' && url.pathname === '/room') {
        if (req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) reject(403,'Origine différente.');
        if (!/^application\/json(?:;|$)/.test(req.headers['content-type']||'')) reject(415,'Format JSON requis.');
        let total=0;
        const buffers=[];
        for await (const chunk of req) {
          total += chunk.length;
          if (total > 24576) reject(413,'Requête trop longue.');
          buffers.push(chunk);
        }
        let body;
        try {body=JSON.parse(Buffer.concat(buffers));} catch {reject(400,'JSON incorrect.');}
        if (!body || typeof body !== 'object' || Array.isArray(body)) reject(400,'Requête incorrecte.');
        send(200,receive(body));
        return;
      }
      const requested = decodeURIComponent(url.pathname.slice(1));
      const file = requested.replace(/^modes\/echos-de-la-greve\//,'') || 'netplay.html';
      const asset = assets.has(file);
      const campaign = file === 'JOUER.html' || /^campagne\/catalogue\/lot-0[1-5]\.js$/.test(file);
      if (req.method !== 'GET' || (!statics.has(file) && !asset && !campaign)) reject(404,'Page introuvable.');
      const location = path.join(campaign ? gameRoot : root,file);
      const stat = fs.lstatSync(location,{throwIfNoEntry:false});
      if (!stat?.isFile()) reject(404,'Fichier absent.');
      if (asset && fs.realpathSync(location) !== location) reject(404,'Fichier absent.');
      res.writeHead(200,{'Content-Type':types[path.extname(file)],'Content-Length':stat.size,'Cache-Control':'no-cache'});
      fs.createReadStream(location).on('error',() => res.destroy()).pipe(res);
    } catch (err) {
      if (!res.headersSent) send(err.status || 400,{error:err.status ? err.message : 'Requête invalide.'});
      else res.destroy();
    }
  });
}
if (require.main === module) {
  const server = openRelay();
  const host = process.env.HOST || '127.0.0.1';
  server.listen(Number(process.env.PORT || 8080),host,() => console.log('Salon privé · http://'+host+':'+server.address().port+'/netplay.html'));
}
module.exports = {openRelay,roomService,gameVersion};
