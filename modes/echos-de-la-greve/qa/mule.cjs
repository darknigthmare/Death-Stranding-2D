const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});
  try {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      let now = 0, sequence = 0;
      const callbacks = new Map();
      window.requestAnimationFrame = callback => {
        callbacks.set(++sequence, callback);
        return sequence;
      };
      window.cancelAnimationFrame = id => callbacks.delete(id);
      window.advanceMuleTest = count => {
        for (let i = 0; i < count; i++) {
          const frame = Array.from(callbacks.values());
          callbacks.clear();
          now += 1000 / 60 + 0.000001;
          for (const callback of frame) callback(now);
        }
      };
    });
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    for (const side of [1,2]) {
      const result = await page.evaluate(side => {
        const canvas = document.createElement('canvas'), other = 3 - side;
        const forward = side === 1 ? 'right' : 'left';
        const back = side === 1 ? 'left' : 'right';
        const direction = side === 1 ? 1 : -1;
        const input = StrandFight.input;
        const tick = advanceMuleTest;
        const actor = () => StrandFight.snapshot().fighters[side - 1];
        const opponent = () => StrandFight.snapshot().fighters[other - 1];
        function start() {
          StrandFight.start({canvas, mode:'local', stage:'shore', sound:false,
            p1:side === 1 ? 'mule' : 'sam', p2:side === 2 ? 'mule' : 'sam'});
          tick(74);
        }
        function special(axis) {
          if (axis) input(side,axis,true);
          input(side,'special',true); input(side,'special',false);
          if (axis) input(side,axis,false);
        }
        function place() {
          special(forward);
          tick(36);
        }
        start();
        const id = actor().id, costBefore = actor().chiral;
        special(back); tick(2);
        const empty = [actor().action, actor().chiral - costBefore];
        special(); tick(1);
        const scanAction = actor().action;
        for (let i = 0; i < 40 && !actor().scan; i++) tick(1);
        const scan = actor().scan;
        const detectedX = opponent().x;
        input(other,forward,true); tick(12); input(other,forward,false);
        const movedX = opponent().x, markAfterMove = actor().scan;
        StrandFight.pause(); tick(30);
        const pausedMark = actor().scan;
        StrandFight.pause(false); tick(121);
        const expired = actor().scan;
        start();
        input(other,'guard',true); special(); tick(42);
        const blockedScan = actor().scan;

        start();
        place();
        const placed = actor().marker;
        input(other,back,true); tick(39); input(other,back,false);
        const beforePush = opponent().hp;
        input(side,'heavy',true); input(side,'heavy',false); tick(43);
        const pushed = actor().marker, pushDamage = beforePush - opponent().hp;

        function recall(defense) {
          start(); place();
          input(other,back,true); tick(72); input(other,back,false);
          if (defense === 'jump') {
            input(other,'up',true); input(other,'up',false); tick(2);
          } else {
            input(other,'guard',true);
            if (defense === 'low') input(other,'down',true);
          }
          const hp = opponent().hp;
          special(back); tick(1);
          const move = actor().action;
          tick(45);
          return {move, damage:hp - opponent().hp, marker:actor().marker};
        }
        const high = recall('high'), low = recall('low'), jump = recall('jump');
        start(); place(); tick(181);
        const expiredCrate = actor().marker;
        StrandFight.stop();
        return {id, empty, scanAction, scan, detectedX, movedX, markAfterMove, pausedMark, expired,
          blockedScan, placed, pushed, pushDamage, high, low, jump, expiredCrate, direction};
      },side);
      assert.equal(result.id,'mule');
      assert.deepEqual(result.empty,['',0]);
      assert.equal(result.scanAction,'mule');
      assert.deepEqual(result.scan,{x:result.detectedX,ttl:120});
      assert.notEqual(result.movedX,result.detectedX);
      assert.equal(result.markAfterMove.x,result.detectedX);
      assert.deepEqual(result.markAfterMove,result.pausedMark);
      assert.equal(result.expired,null);
      assert.equal(result.blockedScan,null);
      assert.equal(result.placed.kind,'crate');
      assert.equal(result.pushed.x - result.placed.x,112 * result.direction);
      assert.equal(result.pushDamage,6);
      assert.deepEqual(result.high,{move:'retrieve', damage:7, marker:null});
      assert.deepEqual(result.low,{move:'retrieve', damage:0, marker:null});
      assert.deepEqual(result.jump,{move:'retrieve', damage:0, marker:null});
      assert.equal(result.expiredCrate,null);
    }
    const cargo = await page.evaluate(async () => {
      const source = new URL(StrandAssets.props.cargo,document.baseURI).href;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d'), draw = ctx.drawImage.bind(ctx);
      const samples = new Set();
      ctx.drawImage = (image,...args) => {
        if (image.src === source) samples.add(args[0]);
        return draw(image,...args);
      };
      StrandFight.start({canvas, p1:'mule', p2:'sam', mode:'local', sound:false});
      const preload = new Image();
      preload.src = source;
      await preload.decode();
      advanceMuleTest(74);
      function special(direction) {
        StrandFight.input(1,direction,true); StrandFight.input(1,'special',true);
        StrandFight.input(1,'special',false); StrandFight.input(1,direction,false);
      }
      special('right'); advanceMuleTest(36);
      const atRest = samples.size;
      samples.clear();
      StrandFight.input(1,'heavy',true); StrandFight.input(1,'heavy',false);
      advanceMuleTest(45);
      const duringPush = samples.size;
      samples.clear();
      special('left'); advanceMuleTest(54);
      const duringReturn = samples.size;
      StrandFight.stop();
      return {atRest, duringPush, duringReturn, width:preload.naturalWidth};
    });
    assert.ok(cargo.width > 0);
    assert.equal(cargo.atRest,1);
    assert.ok(cargo.duringPush > 2);
    assert.ok(cargo.duringReturn > 2);
    console.log('OK — MULE côté J1 et J2, scan de 120 pas, garde, poussée et rappel bas, saut, expiration, pause et dessin du WebP dans les trois états de la caisse.');
  } finally {
    await browser.close();
  }
})().catch(error => {console.error(error);process.exitCode=1;});
