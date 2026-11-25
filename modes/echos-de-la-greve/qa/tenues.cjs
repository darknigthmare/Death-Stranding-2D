const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');

(async () => {
  const browser = await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined});
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(path.resolve(__dirname,'../index.html')).href);
    await page.click('[data-mode="versus"]');
    await page.click('[data-act="pick"][data-id="mama"]');
    await page.selectOption('[data-option="opponent"]','local');
    await page.selectOption('[data-option="p2"]','mama');
    await page.selectOption('[data-option="outfit1"]','viaduc');
    assert.equal(await page.locator('[data-id="mama"] img').getAttribute('src'), 'assets/fighters/mama/viaduc/portrait.webp');
    await page.evaluate(async () => {
      const costumes = Object.values(StrandAssets.wardrobe.mama);
      const files = costumes.flatMap(c => Object.values(c.poses));
      await Promise.all(files.map(async file => {
        const image = new Image();
        image.src = file;
        await image.decode();
      }));
    });
    await page.evaluate(() => {
      let clock = 0, id = 0;
      const queue = new Map();
      const seen = new Set();
      window.requestAnimationFrame = fn => { queue.set(++id, fn); return id; };
      window.cancelAnimationFrame = key => queue.delete(key);
      window.advance = count => {
        for (let i = 0; i < count; i++) {
          const callbacks = [...queue.values()];
          queue.clear();
          clock += 1000 / 60 + .000001;
          callbacks.forEach(fn => fn(clock));
        }
      };
      const drawImage = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = function (image,...args) {
        if (image.src?.includes('/fighters/mama/')) {
          seen.add(image.src.split('/fighters/mama/')[1] + '/' + Math.sign(this.getTransform().a));
        }
        return drawImage.call(this,image,...args);
      };
      window.seenFrames = seen;
    });
    await page.dispatchEvent('[data-act="start"]','click');
    if(await page.locator('[data-act="enterDuel"]').count())await page.dispatchEvent('[data-act="enterDuel"]','click');
    await page.waitForSelector('#arena');
    const frames = await page.evaluate(() => {
      const both = (key, down) => [1,2].forEach(side => StrandFight.input(side,key,down));
      advance(77);
      both('guard',true); advance(7); both('guard',false);
      both('down',true); advance(7); both('down',false);
      both('up',true); advance(2); both('up',false); advance(44);
      return [...seenFrames];
    });
    for (const pose of ['guard','crouch','rise','apex','fall']) {
      assert.ok(frames.includes('atelier/' + pose + '.webp/-1'),pose + ' J2');
      assert.ok(frames.includes('viaduc/' + pose + '.webp/1'),pose + ' J1');
    }
    assert.ok(frames.includes('viaduc/stance.webp/1'));
    assert.ok(!frames.includes('viaduc/stance.webp/-1'));
    console.log('OK — duel miroir, deux tenues indépendantes, portrait, garde, accroupissement et trois phases de saut.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
