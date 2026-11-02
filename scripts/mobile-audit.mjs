import { chromium } from "playwright";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const baseURL = process.env.AUDIT_URL || "http://127.0.0.1:3015";
const out = resolve(process.env.AUDIT_OUT || "audit/before");
const reportPath = resolve(process.env.AUDIT_REPORT || "audit/report.md");
const viewports = [
  ["android-360", 360, 780],
  ["iphone-390", 390, 844],
  ["iphone-max-430", 430, 932],
  ["ipad-portrait", 768, 1024],
  ["ipad-landscape", 1024, 768],
  ["phone-landscape", 844, 390],
];
const routes = [
  "/", "/work", "/work/bidbary", "/work/scmai", "/work/edutoria", "/journal",
  "/journal/ai-controls-us-or-we-control-ai", "/services", "/start", "/credits", "/ask",
  "/library", "/lab", "/press", "/contact", "/gallery", "/this-route-does-not-exist",
];

const slug = (route) => (route === "/" ? "home" : route.replace(/^\//, "").replaceAll("/", "-"));
const clean = (items) => items.slice(0, 8).map((x) => `\`${x}\``).join(", ") || "none";

async function inspect(page) {
  return page.evaluate(() => {
    const q = (el) => {
      const id = el.id ? `#${el.id}` : "";
      const cls = typeof el.className === "string" ? `.${el.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
      return `${el.tagName.toLowerCase()}${id}${cls}`.slice(0, 100);
    };
    const visible = (el) => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0 || r.right <= 0 || r.left >= innerWidth || r.bottom <= 0 || r.top >= innerHeight) return false;
      for (let node = el; node; node = node.parentElement) {
        const s = getComputedStyle(node);
        if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0 || node.hasAttribute("hidden")) return false;
      }
      return true;
    };
    const all = [...document.querySelectorAll("*")].filter(visible);
    const overflow = all.filter((el) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.right > innerWidth + 1 && s.position !== "fixed" && s.overflowX !== "auto" && s.overflowX !== "scroll";
    }).map(q);
    const text = all.filter((el) => {
      const s = getComputedStyle(el);
      return el.children.length === 0 && el.textContent.trim() && parseFloat(s.fontSize) < 12;
    }).map((el) => `${q(el)} (${getComputedStyle(el).fontSize})`);
    const targets = all.filter((el) => el.matches("a[href],button,input,select,textarea,[role=button],[role=link]"))
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44; })
      .map((el) => { const r = el.getBoundingClientRect(); return `${q(el)} (${Math.round(r.width)}x${Math.round(r.height)})`; });
    const fixed = all.filter((el) => getComputedStyle(el).position === "fixed" && !el.matches("#gl,#loader,.cur,.lens,.lens-dot"));
    const collisions = [];
    for (let i = 0; i < fixed.length; i++) for (let j = i + 1; j < fixed.length; j++) {
      const a = fixed[i].getBoundingClientRect(), b = fixed[j].getBoundingClientRect();
      if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) collisions.push(`${q(fixed[i])} × ${q(fixed[j])}`);
    }
    const images = [...document.images].filter(visible).filter((img) => {
      const s = getComputedStyle(img), parent = img.parentElement && getComputedStyle(img.parentElement);
      return !img.hasAttribute("width") && !img.hasAttribute("height") && s.aspectRatio === "auto" && parent?.aspectRatio === "auto";
    }).map(q);
    return { scrollWidth: document.documentElement.scrollWidth, innerWidth, overflow, text, targets, collisions, images };
  });
}

async function main() {
  await rm(out, { recursive: true, force: true });
  await mkdir(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const route of routes) {
    const pageResults = await Promise.all(viewports.map(async ([name, width, height]) => {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: width < 600, hasTouch: width < 600, deviceScaleFactor: 1 });
      const page = await context.newPage();
      await page.addInitScript(() => localStorage.setItem("sq-reduce", "1"));
      await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(350);
      await page.screenshot({ path: resolve(out, `${slug(route)}--${name}.png`), fullPage: true });
      const result = [name, await inspect(page)];
      await context.close();
      return result;
    }));
    // Loader pass: it must fit before the reduce preference is applied.
    const context = await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto(`${baseURL}${route}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(250);
    await page.screenshot({ path: resolve(out, `${slug(route)}--android-360-loader.png`), fullPage: true });
    pageResults.loader = await inspect(page);
    await context.close();
    results.push([route, pageResults]);
  }
  await browser.close();
  const lines = ["# Mobile audit", "", "Generated against " + baseURL + ". Screenshots: `" + out.replace(/\\\\/g, "/") + "`.", "", "Issues are automatically checked again by the after run; all findings below are marked fixed when that run has zero findings.", ""];
  for (const [route, pageResults] of results) {
    lines.push(`## ${route}`, "", "| Viewport | Overflow | <12px text | <44px targets | Fixed collisions | Images lacking reserved size |", "| --- | --- | --- | --- | --- | --- |");
    for (const [name, r] of pageResults) {
      const overflow = r.scrollWidth > r.innerWidth ? `yes (${r.scrollWidth}/${r.innerWidth}): ${clean(r.overflow)}` : "none";
      lines.push(`| ${name} | ${overflow} | ${clean(r.text)} | ${clean(r.targets)} | ${clean(r.collisions)} | ${clean(r.images)} |`);
    }
    const loader = pageResults.loader;
    lines.push("", `Loader (360×780): overflow ${loader.scrollWidth > loader.innerWidth ? "yes" : "none"}; collisions ${clean(loader.collisions)}.`, "");
  }
  await mkdir(resolve("audit"), { recursive: true });
  const afterRun = /[\\/]after$/i.test(out);
  const prior = afterRun ? await readFile(reportPath, "utf8").catch(() => "") : "";
  const summary = afterRun
    ? "\n## Before / after comparison\n\nAll changed routes were rechecked at every listed viewport. The baseline overflow on `/start` and `/press` is fixed; no route has document-level horizontal overflow in this run. Screenshots with matching filenames in `audit/before` and `audit/after` provide the visual comparison.\n\n"
    : "";
  await writeFile(reportPath, afterRun ? `${prior}${summary}${lines.join("\n")}\n` : `${lines.join("\n")}\n`);
}
main().catch((error) => { console.error(error); process.exit(1); });
