import { spawn } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = await mkdtemp(join(tmpdir(), "gallery-cdp-"));
const output = join(process.cwd(), "artifacts", "gallery-wall");
await mkdir(output, { recursive: true });
const processChrome = spawn(chrome, [
  "--headless=new",
  "--no-first-run",
  "--no-default-browser-check",
  "--disable-gpu",
  "--remote-debugging-port=0",
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore", windowsHide: true });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket;
try {
  let port;
  for (let i = 0; i < 100; i++) {
    try {
      port = Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]);
      break;
    } catch { await pause(100); }
  }
  if (!port) throw new Error("Chrome debugging port did not start");
  const target = (await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json())).find((p) => p.type === "page");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", (event) => {
    const packet = JSON.parse(event.data);
    if (packet.method === "Runtime.exceptionThrown") console.error("PAGE ERROR", JSON.stringify(packet.params.exceptionDetails));
    if (packet.method === "Runtime.consoleAPICalled" && packet.params.type === "error") console.error("CONSOLE", JSON.stringify(packet.params.args));
    if (packet.method === "Runtime.consoleAPICalled" && packet.params.type === "info") console.log("INFO", JSON.stringify(packet.params.args));
    if (!packet.id) return;
    const job = pending.get(packet.id);
    if (!job) return;
    pending.delete(packet.id);
    packet.error ? job.reject(new Error(packet.error.message)) : job.resolve(packet.result);
  });
  function send(method, params = {}) {
    const current = ++id;
    return new Promise((resolve, reject) => {
      pending.set(current, { resolve, reject });
      socket.send(JSON.stringify({ id: current, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
  await send("Page.enable");
  await send("Runtime.enable");
  if (process.env.GALLERY_REDUCE) {
    await send("Page.addScriptToEvaluateOnNewDocument", {
      source: 'localStorage.setItem("sq-reduce", "1")',
    });
  }
  const cases = [
    { width: 1440, height: 900 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
  ];
  const quickCase = Number(process.env.GALLERY_CASE || 0);
  for (const { width, height } of process.env.GALLERY_QUICK ? cases.slice(quickCase, quickCase + 1) : cases) {
    for (const theme of process.env.GALLERY_QUICK ? ["dark"] : ["dark", "light"]) {
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
      await send("Page.navigate", { url: "http://localhost:3012/gallery" });
      await pause(1800);
      await evaluate(`localStorage.setItem("sq-theme", "${theme}"); document.documentElement.dataset.theme = "${theme}"`);
      for (let attempt = 0; attempt < 30; attempt++) {
        if (await evaluate(`document.body.classList.contains("ready")`)) break;
        await evaluate(`document.querySelector("#loader")?.click()`);
        await pause(500);
      }
      if (!(await evaluate(`document.body.classList.contains("ready")`))) throw new Error(`Loader did not finish at ${width}x${height}`);
      await pause(1800);
      if (width === 1440 && theme === "dark") {
        const headShot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
        await writeFile(join(output, "1440x900-dark-page-head.png"), Buffer.from(headShot.data, "base64"));
      }
      const metrics = await evaluate(`(() => {
        const wall = document.querySelector("#galleryWall");
        const head = document.querySelector(".page-head");
        const rect = wall.getBoundingClientRect();
        return { headBottom: head.getBoundingClientRect().bottom, wallTop: rect.top + scrollY,
          wallHeight: rect.height, columns: document.querySelectorAll(".gallery-column").length,
          originals: document.querySelectorAll(".gallery-cycle:not([aria-hidden]) > .gallery-card:not([aria-hidden])").length,
          cycleHeights: [...document.querySelectorAll(".gallery-column")].map(c => c.querySelector(".gallery-cycle").offsetHeight),
          bodyHeight: document.body.scrollHeight };
      })()`);
      const pinLength = height * (width < 768 ? 2 : 3);
      const stages = process.env.GALLERY_QUICK ? ["start"] : ["start", "middle", "end"];
      for (const stage of stages) {
        const fraction = stage === "start" ? 0.01 : stage === "middle" ? 0.5 : 0.99;
        await evaluate(`window.scrollTo(0, ${metrics.wallTop + pinLength * fraction})`);
        await pause(1500);
        const state = await evaluate(`(() => {
          const wall = document.querySelector("#galleryWall");
          const rect = wall.getBoundingClientRect();
          return { scrollY, wallTop: rect.top, wallBottom: rect.bottom,
            tracks: [...document.querySelectorAll(".gallery-track")].map(t => ({ top: t.getBoundingClientRect().top, height: t.getBoundingClientRect().height })),
            pinned: document.body.classList.contains("gallery-pinned") };
        })()`);
        const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
        const name = `${width}x${height}-${theme}-${stage}${process.env.GALLERY_REDUCE ? "-reduced" : ""}.png`;
        await writeFile(join(output, name), Buffer.from(shot.data, "base64"));
        console.log(JSON.stringify({ name, metrics, state }));
      }
      if (process.env.GALLERY_QUICK && !process.env.GALLERY_REDUCE) {
        await evaluate(`document.querySelector('[data-gallery-open="1"]')?.click()`);
        await pause(350);
        const lightbox = await evaluate(`({open: document.querySelector('#lb')?.classList.contains('on'), count: document.querySelector('#lbCount')?.textContent, caption: document.querySelector('.lb-frame.is-active .lb-caption')?.textContent})`);
        console.log(JSON.stringify({ lightbox }));
      }
    }
  }
} finally {
  socket?.close();
  processChrome.kill();
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
