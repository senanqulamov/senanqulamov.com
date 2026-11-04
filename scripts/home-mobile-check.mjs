import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const out = resolve("audit/home-mobile");
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
const sizes = process.env.ONE ? [[process.env.ONE, Number(process.env.ONE), Number(process.env.ONE) === 390 ? 844 : 780]] : [["360",360,780],["390",390,844],["430",430,932]];
for (const [name, width, height] of sizes) for (const theme of ["dark","light"]) {
  const page = await browser.newPage({ viewport:{width,height}, isMobile:true, hasTouch:true });
  await page.addInitScript((v) => localStorage.setItem("sq-theme", v), theme);
  await page.goto("http://127.0.0.1:3017", { waitUntil:"domcontentloaded", timeout:60000 });
  await page.locator("#lEnter.on").waitFor({timeout:20000});
  await page.locator("#loader").click({position:{x:width/2,y:height/2}});
  await page.waitForFunction(() => document.body.classList.contains("ready"), null, {timeout:20000});
  await page.waitForTimeout(1800);
  await page.screenshot({path:resolve(out,`${name}-${theme}-hero.png`)});
  for (const id of ["belief","numbers","story","bidbary"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded(); await page.waitForTimeout(180);
    const metrics = await page.evaluate(() => ({w:innerWidth, sw:document.documentElement.scrollWidth}));
    if(metrics.sw > metrics.w) throw new Error(`${name} ${theme} ${id}: horizontal overflow`);
    await page.screenshot({path:resolve(out,`${name}-${theme}-${id}.png`)});
  }
  await page.close();
}
await browser.close();
console.log(`Screenshots written to ${out}`);
