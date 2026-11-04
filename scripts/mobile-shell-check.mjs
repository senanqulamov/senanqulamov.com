import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const base = "http://127.0.0.1:3018";
const out = resolve("audit/mobile-shell");
const sizes = [["360", 360, 780], ["390", 390, 844], ["430", 430, 932], ["768", 768, 1024]];
const routes = process.env.INTERACTIONS_ONLY ? [] : ["/", "/work", "/work/bidbary", "/journal", "/services", "/start", "/credits", "/ask", "/gallery", "/library", "/lab", "/press", "/contact"];
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const [label, width, height] of sizes) {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width, height }, isMobile: true, hasTouch: true });
    await page.addInitScript(() => localStorage.setItem("sq-reduce", "1"));
    page.on("pageerror", (error) => console.error("PAGEERROR", error.message));
    await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.locator("#lEnter.on").waitFor({ timeout: 20000 });
    await page.locator("#loader").evaluate((el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    await page.waitForFunction(() => document.body.classList.contains("ready"), null, { timeout: 20000 });
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(250);
    const metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, dock: !!document.querySelector(".mobile-dock"), dockVisible: getComputedStyle(document.querySelector(".mobile-dock")).opacity !== "0" }));
    if (metrics.scrollWidth > metrics.width || !metrics.dock || !metrics.dockVisible) throw new Error(`${route} ${label}: ${JSON.stringify(metrics)}`);
    await page.screenshot({ path: resolve(out, `${label}-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}.png`), fullPage: true });
    await page.close();
  }
}
// Interaction proof at the approved iPhone viewport.
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.addInitScript(() => localStorage.setItem("sq-reduce", "1"));
await page.goto(base, { waitUntil: "domcontentloaded" });
await page.locator("#lEnter.on").waitFor({ timeout: 20000 });
await page.locator("#loader").evaluate((el) => el.dispatchEvent(new MouseEvent("click", { bubbles: true }))); await page.waitForFunction(() => document.body.classList.contains("ready"), null, { timeout: 20000 });
await page.locator("#menuBtn").click(); await page.locator("body.menu-open").waitFor(); await page.waitForTimeout(950);
await page.screenshot({ path: resolve(out, "390-menu.png") });
await page.locator("#menuBtn").click(); await page.locator("body:not(.menu-open)").waitFor();
await page.locator("#dirBtn").click(); await page.locator("body.dir-open").waitFor(); await page.waitForTimeout(950);
await page.screenshot({ path: resolve(out, "390-director.png") });
await page.locator("#dirScrim").click(); await page.locator("body:not(.dir-open)").waitFor();
await browser.close();
console.log(`Screenshots written to ${out}`);
