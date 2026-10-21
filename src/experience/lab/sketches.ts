// The visual sketches in the lab, each running full screen on its own canvas.

import { sketches } from "@/data/lab";
import { $, $$, fonts } from "../dom";
import { lowEnd } from "../env";
import { lenis } from "../state";
import { tr } from "../i18n";
import { blip } from "../sound";

export const Sketches = (() => {
  const stage = $("#labStage"),
    cv = $<HTMLCanvasElement>("#labCanvas"),
    ctx = cv.getContext("2d");
  let raf = 0,
    exp: string = null;
  const ui = $("#labCtrl");
  let state: Record<string, any> = {};
  const DPR = Math.min(2, devicePixelRatio || 1);
  let W = 0,
    H = 0,
    lm = { x: innerWidth / 2, y: innerHeight / 2, down: false };
  function fit() {
    W = innerWidth;
    H = innerHeight;
    cv.width = W * DPR;
    cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  cv.addEventListener("pointermove", (e) => {
    lm.x = e.clientX;
    lm.y = e.clientY;
  });
  cv.addEventListener("pointerdown", (e) => {
    lm.x = e.clientX;
    lm.y = e.clientY;
    if (exp && EX[exp].click) EX[exp].click(lm.x, lm.y);
  });
  const EX = {
    tungsten: {
      init() {
        state.p = Array.from({ length: lowEnd ? 160 : 320 }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          z: Math.random(),
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        }));
      },
      draw(t) {
        ctx.fillStyle = "#050608";
        ctx.fillRect(0, 0, W, H);
        const ox = W / 2,
          oy = H + 20,
          ang = Math.atan2(lm.y - oy, lm.x - ox),
          spread = 0.32;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, Math.max(W, H) * 1.1);
        g.addColorStop(0, "rgba(255,214,150,.38)");
        g.addColorStop(1, "rgba(255,214,150,0)");
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.arc(ox, oy, Math.max(W, H) * 1.2, ang - spread, ang + spread);
        ctx.closePath();
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
        state.p.forEach((p) => {
          p.x += p.vx + Math.sin(t * 0.0004 + p.z * 9) * 0.15;
          p.y += p.vy - 0.05;
          if (p.y < -5) p.y = H + 5;
          if (p.x < -5) p.x = W + 5;
          if (p.x > W + 5) p.x = -5;
          let a = Math.atan2(p.y - oy, p.x - ox) - ang;
          a = Math.atan2(Math.sin(a), Math.cos(a));
          const lit = Math.max(0, 1 - Math.abs(a) / spread);
          ctx.fillStyle = `rgba(255,${(200 + lit * 40) | 0},${(150 + lit * 60) | 0},${0.06 + lit * 0.85 * (0.4 + p.z * 0.6)})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 0.6 + p.z * 1.8, 0, 7);
          ctx.fill();
        });
      },
    },
    grain: {
      init() {
        state.n = { grain: 0.5, scratch: 0.4, flicker: 0.3 };
        ui.innerHTML = ["grain", "scratch", "flicker"]
          .map(
            (k) =>
              `<label>${k[0].toUpperCase() + k.slice(1)}<input type="range" min="0" max="1" step=".01" value="${state.n[k]}" data-k="${k}"></label>`,
          )
          .join("");
        ui.oninput = (e) => {
          state.n[(e.target as HTMLInputElement).dataset.k] = +(e.target as HTMLInputElement).value;
        };
        state.img = ctx.createImageData(256, 256);
      },
      draw(t) {
        const n = state.n,
          f = 1 - n.flicker * 0.25 * Math.random();
        ctx.fillStyle = `rgb(${(30 * f) | 0},${(28 * f) | 0},${(24 * f) | 0})`;
        ctx.fillRect(0, 0, W, H);
        const d = state.img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = Math.random() * 255 * n.grain;
          d[i] = d[i + 1] = d[i + 2] = v;
          d[i + 3] = 90;
        }
        ctx.putImageData(state.img, 0, 0);
        ctx.globalAlpha = 1;
        for (let y = 0; y < H; y += 256) for (let x = 0; x < W; x += 256) ctx.putImageData(state.img, x, y);
        ctx.fillStyle = `rgba(240,230,210,${0.08 * f})`;
        ctx.font = `600 ${Math.min(W * 0.12, 140)}px ${fonts.display()}`;
        ctx.textAlign = "center";
        ctx.fillText("Reel 48", W / 2, H / 2);
        if (Math.random() < n.scratch) {
          ctx.strokeStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.4})`;
          ctx.lineWidth = Math.random() * 1.5;
          const x = Math.random() * W;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + (Math.random() - 0.5) * 30, H);
          ctx.stroke();
        }
        const v = ctx.createRadialGradient(
          W / 2,
          H / 2,
          Math.min(W, H) * 0.3,
          W / 2,
          H / 2,
          Math.max(W, H) * 0.75,
        );
        v.addColorStop(0, "rgba(0,0,0,0)");
        v.addColorStop(1, "rgba(0,0,0,.8)");
        ctx.fillStyle = v;
        ctx.fillRect(0, 0, W, H);
      },
    },
    gravity: {
      init() {
        state.b = [];
        state.total = 0;
      },
      click(x, y) {
        const amt = [50, 100, 250, 500][(Math.random() * 4) | 0];
        state.total += amt;
        state.b.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: 0,
          r: 16 + amt / 22,
          a: amt,
          c: ["#A8E0FF", "#B9A7FF", "#FFB79A", "#ECEBF2"][(Math.random() * 4) | 0],
        });
        blip(400 + amt, 0.15);
        if (state.b.length > 140) state.b.shift();
      },
      draw() {
        ctx.fillStyle = "#050608";
        ctx.fillRect(0, 0, W, H);
        const B = state.b;
        for (let it = 0; it < 2; it++) {
          B.forEach((p) => {
            p.vy += 0.25;
            p.x += p.vx;
            p.y += p.vy;
            if (p.y > H - p.r) {
              p.y = H - p.r;
              p.vy *= -0.3;
              p.vx *= 0.9;
            }
            if (p.x < p.r) {
              p.x = p.r;
              p.vx *= -0.5;
            }
            if (p.x > W - p.r) {
              p.x = W - p.r;
              p.vx *= -0.5;
            }
          });
          for (let i = 0; i < B.length; i++)
            for (let j = i + 1; j < B.length; j++) {
              const a = B[i],
                b = B[j],
                dx = b.x - a.x,
                dy = b.y - a.y,
                d = Math.hypot(dx, dy),
                m = a.r + b.r;
              if (d < m && d > 0) {
                const o = (m - d) / 2,
                  nx = dx / d,
                  ny = dy / d;
                a.x -= nx * o;
                a.y -= ny * o;
                b.x += nx * o;
                b.y += ny * o;
                const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
                if (rv < 0) {
                  a.vx += rv * nx * 0.5;
                  a.vy += rv * ny * 0.5;
                  b.vx -= rv * nx * 0.5;
                  b.vy -= rv * ny * 0.5;
                }
              }
            }
        }
        B.forEach((p) => {
          ctx.fillStyle = p.c;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 7);
          ctx.fill();
          ctx.fillStyle = "#07080D";
          ctx.font = `600 ${Math.max(10, p.r * 0.55) | 0}px ${fonts.text()}`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("+" + p.a, p.x, p.y);
        });
        ctx.fillStyle = "#ECEBF2";
        ctx.font = `300 ${Math.min(W * 0.09, 110)}px ${fonts.display()}`;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.globalAlpha = 0.9;
        ctx.fillText("AZN " + state.total.toLocaleString("en-US"), 24, H * 0.42);
        ctx.globalAlpha = 1;
      },
    },
    magnet: {
      init() {
        const off = document.createElement("canvas"),
          o = off.getContext("2d");
        off.width = W;
        off.height = H;
        o.fillStyle = "#fff";
        o.font = `800 ${Math.min(W * 0.24, H * 0.4) | 0}px ${fonts.display()}`;
        o.textAlign = "center";
        o.textBaseline = "middle";
        o.fillText("SENAN", W / 2, H / 2);
        const d = o.getImageData(0, 0, W, H).data,
          gap = lowEnd ? 7 : 5;
        state.p = [];
        for (let y = 0; y < H; y += gap)
          for (let x = 0; x < W; x += gap)
            if (d[(y * W + x) * 4 + 3] > 128)
              state.p.push({ x: Math.random() * W, y: Math.random() * H, hx: x, hy: y, vx: 0, vy: 0 });
      },
      draw() {
        ctx.fillStyle = "rgba(5,6,8,.35)";
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#ECEBF2";
        state.p.forEach((p) => {
          const dx = p.x - lm.x,
            dy = p.y - lm.y,
            d2 = dx * dx + dy * dy;
          if (d2 < 12000) {
            const f = ((12000 - d2) / 12000) * 3;
            const d = Math.sqrt(d2) || 1;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
          p.vx += (p.hx - p.x) * 0.04;
          p.vy += (p.hy - p.y) * 0.04;
          p.vx *= 0.82;
          p.vy *= 0.82;
          p.x += p.vx;
          p.y += p.vy;
          const sp = Math.min(1, Math.hypot(p.vx, p.vy) / 6);
          ctx.fillStyle = sp > 0.1 ? `hsl(${200 + sp * 120},90%,${70 + sp * 10}%)` : "#ECEBF2";
          ctx.fillRect(p.x, p.y, 2, 2);
        });
      },
    },
  };
  function loop(t: number) {
    if (!exp) return;
    EX[exp].draw(t);
    raf = requestAnimationFrame(loop);
  }
  function open(k: string) {
    exp = k;
    const x = sketches.find((e) => e.key === k);
    $("#labT").textContent = tr(x.title);
    $("#labH").textContent = tr(x.hint);
    ui.innerHTML = "";
    ui.oninput = null;
    stage.classList.add("on");
    lenis && lenis.stop();
    fit();
    EX[k].init();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
    $("#labClose").focus();
  }
  function close() {
    exp = null;
    cancelAnimationFrame(raf);
    stage.classList.remove("on");
    lenis && lenis.start();
  }
  $("#labClose").addEventListener("click", close);
  addEventListener("resize", () => {
    if (exp) {
      fit();
      EX[exp].init();
    }
  });
  return {
    open,
    close,
    mountPreviews() {
      $$("[data-exp]").forEach((b) => b.addEventListener("click", () => open(b.dataset.exp)));
      $$<HTMLCanvasElement>("canvas.prev").forEach((c) => {
        const r = c.getBoundingClientRect();
        c.width = r.width;
        c.height = r.height;
        const x = c.getContext("2d"),
          k = c.dataset.prev,
          w = c.width,
          h = c.height;
        if (k === "tungsten") {
          const g = x.createRadialGradient(w * 0.5, h, 0, w * 0.5, h, h * 1.2);
          g.addColorStop(0, "rgba(255,214,150,.5)");
          g.addColorStop(1, "rgba(255,214,150,0)");
          x.fillStyle = g;
          x.beginPath();
          x.moveTo(w * 0.5, h);
          x.lineTo(w * 0.85, 0);
          x.lineTo(w * 1.05, 0);
          x.closePath();
          x.fill();
          for (let i = 0; i < 90; i++) {
            x.fillStyle = `rgba(255,220,170,${Math.random() * 0.6})`;
            x.fillRect(w * 0.55 + Math.random() * w * 0.45, Math.random() * h, 1.5, 1.5);
          }
        }
        if (k === "grain") {
          for (let i = 0; i < 4000; i++) {
            x.fillStyle = `rgba(200,200,200,${Math.random() * 0.25})`;
            x.fillRect(Math.random() * w, Math.random() * h, 1, 1);
          }
          x.strokeStyle = "rgba(255,255,255,.3)";
          x.beginPath();
          x.moveTo(w * 0.7, 0);
          x.lineTo(w * 0.72, h);
          x.stroke();
        }
        if (k === "gravity") {
          for (let i = 0; i < 26; i++) {
            const r = 8 + Math.random() * 16;
            x.fillStyle = ["#A8E0FF", "#B9A7FF", "#FFB79A"][i % 3];
            x.globalAlpha = 0.6;
            x.beginPath();
            x.arc(w * 0.45 + Math.random() * w * 0.55, h - r - Math.random() * h * 0.35, r, 0, 7);
            x.fill();
          }
        }
        if (k === "magnet") {
          x.fillStyle = "rgba(200,200,220,.5)";
          for (let i = 0; i < 700; i++) {
            const a = Math.random() * 7,
              d = Math.random() * h * 0.4;
            x.fillRect(w * 0.75 + Math.cos(a) * d * 1.4, h * 0.5 + Math.sin(a) * d, 1.5, 1.5);
          }
        }
      });
    },
  };
})();
