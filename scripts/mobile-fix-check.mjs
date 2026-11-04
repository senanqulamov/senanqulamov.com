import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
const out=resolve("audit/mobile-fix"); await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
for(const [label,w,h] of [["360",360,780],["390",390,844],["430",430,932]]) for(const theme of ["dark","light"]){
 const p=await browser.newPage({viewport:{width:w,height:h},isMobile:true,hasTouch:true});
 await p.addInitScript(t=>localStorage.setItem("sq-theme",t),theme);
 await p.goto("http://127.0.0.1:3019",{waitUntil:"domcontentloaded"});
 await p.locator("#lEnter.on").waitFor({timeout:20000}); await p.screenshot({path:resolve(out,`${label}-${theme}-loader.png`)});
 await p.locator("#loader").click({position:{x:w/2,y:h/2}}); await p.waitForFunction(()=>document.body.classList.contains("ready")); await p.waitForTimeout(1500);
 await p.locator("#menuBtn").click(); await p.waitForTimeout(900); await p.screenshot({path:resolve(out,`${label}-${theme}-menu.png`)});
 await p.locator("#menuBtn").click(); await p.locator("#dirBtn").click(); await p.waitForTimeout(700); await p.screenshot({path:resolve(out,`${label}-${theme}-director.png`)});
 await p.locator("#dirScrim").click(); await p.goto("http://127.0.0.1:3019/work/bidbary",{waitUntil:"domcontentloaded"}); await p.waitForTimeout(300); await p.locator(".tour-steps").scrollIntoViewIfNeeded(); await p.screenshot({path:resolve(out,`${label}-${theme}-project-tour.png`)});
 const m=await p.evaluate(()=>({w:innerWidth,sw:document.documentElement.scrollWidth})); if(m.sw>m.w) throw new Error(`${label} ${theme} overflow ${m.sw}/${m.w}`); await p.close();
}
await browser.close(); console.log(out);
