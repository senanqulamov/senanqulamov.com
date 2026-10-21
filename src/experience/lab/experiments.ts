// The engineering lab: an in-browser SQL database, race conditions, rate limiters, consistent hashing, a cache simulator and live GitHub data.

import { profile } from "@/data/profile";
import { $, $$, esc, fonts, root } from "../dom";
import { cleanup, GL } from "../state";
import { SFX } from "../sound";

type SqlJsStatic = { Database: new () => any };

/** sql.js is served from /vendor so its Node-only code never reaches the bundler. */
function loadSqlJs(): Promise<SqlJsStatic> {
  const w = window as unknown as { initSqlJs?: (config: object) => Promise<SqlJsStatic> };
  const init = () => w.initSqlJs({ locateFile: (file: string) => `/vendor/${file}` });
  if (w.initSqlJs) return init();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/vendor/sql-wasm.js";
    script.onload = () => init().then(resolve, reject);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export const LabX = (() => {
  const C = (n) => getComputedStyle(root).getPropertyValue(n).trim();
  const COL = () => ({
    fg: C("--fg"),
    fg2: C("--fg-2"),
    line: C("--line"),
    ice: C("--ice"),
    lilac: C("--lilac"),
    peach: C("--peach"),
    red: C("--live") || "#ff5a6e",
    green: "#4ade80",
    bg: C("--bg"),
  });
  const D = () => Math.min(2, devicePixelRatio || 1);
  function fit(c) {
    const r = c.getBoundingClientRect(),
      d = D(),
      w = Math.max(10, Math.round(r.width * d)),
      h = Math.max(10, Math.round(r.height * d));
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }
    const x = c.getContext("2d");
    x.setTransform(d, 0, 0, d, 0, 0);
    return [x, r.width, r.height];
  }
  const rnd = (seed) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const fnv = (s) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;
  };
  const seg = (opts, cur, id) =>
    `<div class="seg" role="group" id="${id}">${opts.map(([v, l]) => `<button type="button" data-v="${v}" aria-pressed="${v === cur}">${l}</button>`).join("")}</div>`;
  const onSeg = (el, cb) =>
    el.addEventListener("click", (e) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("button");
      if (!b) return;
      $$("button", el).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      cb(b.dataset.v);
    });
  const slider = (id, label, min, max, val, step = 1) =>
    `<label class="xs"><span>${label} <b id="${id}V">${val}</b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
  const bindS = (id, cb) => {
    const i = $<HTMLInputElement>("#" + id);
    i.addEventListener("input", () => {
      $("#" + id + "V").textContent = i.value;
      cb(+i.value);
    });
    return i;
  };
  function bars(c, labels, vals, color?: string) {
    const [x, w, h] = fit(c),
      k = COL();
    x.clearRect(0, 0, w, h);
    const n = labels.length;
    if (!n) return;
    const max = Math.max(...vals, 1),
      rowH = Math.min(26, (h - 10) / n),
      lw = Math.min(180, w * 0.38);
    x.font = `12px ${fonts.text()}`;
    x.textBaseline = "middle";
    labels.forEach((l, i) => {
      const y = 5 + i * rowH + rowH / 2;
      x.fillStyle = k.fg2;
      x.textAlign = "left";
      x.fillText(String(l).slice(0, 26), 0, y);
      const bw = ((w - lw - 60) * vals[i]) / max;
      x.fillStyle = color || k.ice;
      x.globalAlpha = 0.85;
      x.beginPath();
      x.roundRect
        ? x.roundRect(lw, y - rowH * 0.32, Math.max(2, bw), rowH * 0.64, 4)
        : x.rect(lw, y - rowH * 0.32, Math.max(2, bw), rowH * 0.64);
      x.fill();
      x.globalAlpha = 1;
      x.fillStyle = k.fg;
      x.fillText(String(vals[i]), lw + bw + 8, y);
    });
  }
  function lines(c, series, { max = 1, min = 0, labels = [] } = {}) {
    const [x, w, h] = fit(c),
      k = COL();
    x.clearRect(0, 0, w, h);
    x.strokeStyle = k.line;
    x.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = 8 + ((h - 24) * i) / 4;
      x.beginPath();
      x.moveTo(0, y);
      x.lineTo(w, y);
      x.stroke();
      x.fillStyle = k.fg2;
      x.font = `10px ${fonts.text()}`;
      x.fillText((((max - ((max - min) * i) / 4) * 100) | 0) + "%", w - 30, y - 3);
    }
    series.forEach((s) => {
      const d = s.data;
      if (d.length < 2) return;
      x.strokeStyle = s.color;
      x.lineWidth = 2;
      x.beginPath();
      d.forEach((v, i) => {
        const px = (i / (s.cap - 1)) * (w - 40),
          py = 8 + (h - 24) * (1 - (v - min) / (max - min));
        i ? x.lineTo(px, py) : x.moveTo(px, py);
      });
      x.stroke();
    });
  }

  /* ---------- 01 SQL playground ---------- */
  const SQL = (() => {
    let db = null,
      el,
      idx = false;
    const PRE = [
      [
        "Top lots by final price",
        `SELECT l.title, l.format, MAX(b.amount) AS final_bid, COUNT(*) AS bids
FROM lots l JOIN bids b ON b.lot_id = l.id
GROUP BY l.id ORDER BY final_bid DESC LIMIT 10;`,
      ],
      [
        "Reserve met, by format",
        `SELECT format, COUNT(*) AS lots,
  ROUND(100.0 * SUM(final_bid >= reserve) / COUNT(*), 1) AS pct_met
FROM (SELECT l.format, l.reserve, MAX(b.amount) AS final_bid
      FROM lots l JOIN bids b ON b.lot_id = l.id GROUP BY l.id)
GROUP BY format ORDER BY pct_met DESC;`,
      ],
      [
        "Snipers: bids in the last 60s",
        `SELECT u.name, COUNT(*) AS late_bids
FROM bids b
JOIN lots l ON l.id = b.lot_id
JOIN users u ON u.id = b.user_id
WHERE (julianday(l.ends_at) - julianday(b.placed_at)) * 86400 <= 60
GROUP BY u.id ORDER BY late_bids DESC LIMIT 10;`,
      ],
      [
        "Bids and average by city",
        `SELECT u.city, COUNT(*) AS bids, ROUND(AVG(b.amount)) AS avg_bid
FROM bids b JOIN users u ON u.id = b.user_id
GROUP BY u.city ORDER BY bids DESC;`,
      ],
      [
        "Window function: ranking",
        `SELECT u.name, b.amount,
  RANK() OVER (ORDER BY b.amount DESC) AS rank_in_lot,
  b.amount - LAG(b.amount) OVER (ORDER BY b.placed_at) AS jump
FROM bids b JOIN users u ON u.id = b.user_id
WHERE b.lot_id = 3 ORDER BY b.placed_at DESC LIMIT 12;`,
      ],
    ];
    function seed(SQLm) {
      const r = rnd(48);
      db = new SQLm.Database();
      db.run(`CREATE TABLE users(id INTEGER PRIMARY KEY, name TEXT, city TEXT, verified INTEGER, joined TEXT);
CREATE TABLE lots(id INTEGER PRIMARY KEY, title TEXT, format TEXT, reserve INTEGER, host_id INTEGER, ends_at TEXT);
CREATE TABLE bids(id INTEGER PRIMARY KEY, lot_id INTEGER, user_id INTEGER, amount INTEGER, placed_at TEXT);`);
      const first = [
          "Aysel",
          "Rauf",
          "Leyla",
          "Orxan",
          "Nigar",
          "Tural",
          "Gunel",
          "Elvin",
          "Sabina",
          "Kamran",
          "Aynur",
          "Farid",
          "Lala",
          "Murad",
          "Zarina",
          "Emil",
          "Narmin",
          "Javid",
          "Sevinj",
          "Ilkin",
        ],
        last = [
          "Mammadov",
          "Aliyeva",
          "Hasanov",
          "Guliyeva",
          "Ismayilov",
          "Huseynova",
          "Abbasov",
          "Rzayeva",
          "Karimov",
          "Babayeva",
        ],
        cities = ["Baku", "Baku", "Baku", "Ganja", "Sumgait", "Lankaran", "Shaki", "Quba"];
      const u = db.prepare("INSERT INTO users VALUES (?,?,?,?,?)");
      for (let i = 1; i <= 60; i++) {
        const g = first[(r() * first.length) | 0],
          s = last[(r() * last.length) | 0];
        u.run([
          i,
          g + " " + s.charAt(0) + ".",
          cities[(r() * cities.length) | 0],
          r() < 0.7 ? 1 : 0,
          `202${3 + ((r() * 3) | 0)}-0${1 + ((r() * 9) | 0)}-1${(r() * 9) | 0}`,
        ]);
      }
      u.free();
      const T = {
        auction: [
          "Vintage Baku carpet",
          "Signed national team shirt",
          "1960s Soviet Leica",
          "Tabriz silk miniature",
          "First-edition Nizami",
          "Hand-made tar",
          "Shusha shawl",
          "Antique samovar",
        ],
        dinner: [
          "Chef's table for eight",
          "Rooftop dinner at Flame Towers",
          "Caspian seafood night",
          "Sheki piti masterclass dinner",
        ],
        concert: ["Jazz at Mugham Club", "Opera night", "Indie rooftop set"],
        tour: ["Gobustan at sunrise", "Sheki day trip"],
        workshop: ["Pottery evening", "Carpet weaving class"],
      };
      const L = db.prepare("INSERT INTO lots VALUES (?,?,?,?,?,?)"),
        B = db.prepare("INSERT INTO bids VALUES (?,?,?,?,?)");
      let lid = 0,
        bid = 0;
      const base = Date.UTC(2026, 8, 1, 18);
      for (const fmt of Object.keys(T))
        T[fmt].forEach((title, ti) => {
          for (let rep = 0; rep < (fmt === "auction" ? 3 : 2); rep++) {
            lid++;
            const reserve =
              fmt === "auction"
                ? 300 + ((r() * 30) | 0) * 100
                : fmt === "dinner"
                  ? 800 + ((r() * 12) | 0) * 100
                  : 100 + ((r() * 8) | 0) * 25;
            const end = base + lid * 86400000 * 1.3 + ((r() * 7200000) | 0);
            L.run([
              lid,
              title + (rep ? " #" + (rep + 1) : ""),
              fmt,
              reserve,
              1 + ((r() * 60) | 0),
              new Date(end).toISOString().replace("T", " ").slice(0, 19),
            ]);
            const nb = fmt === "auction" || fmt === "dinner" ? 12 + ((r() * 70) | 0) : 4 + ((r() * 12) | 0);
            let amt = Math.round((reserve * (0.35 + r() * 0.3)) / 10) * 10,
              t = end - 86400000 * (1 + r());
            for (let k = 0; k < nb; k++) {
              const late = k > nb * 0.75;
              t += late ? (end - t) * (0.2 + r() * 0.5) : (end - t) * (0.02 + r() * 0.12);
              amt += (fmt === "auction" ? [20, 50, 50, 100, 200] : [10, 25, 50])[
                (r() * (fmt === "auction" ? 5 : 3)) | 0
              ];
              bid++;
              B.run([
                bid,
                lid,
                1 + ((r() * 60) | 0),
                amt,
                new Date(Math.min(t, end - 1000)).toISOString().replace("T", " ").slice(0, 19),
              ]);
            }
          }
        });
      L.free();
      B.free();
    }
    function table(res) {
      if (!res) {
        return `<p class="muted">Query ran. No rows returned.</p>`;
      }
      const cols = res.columns,
        rows = res.values.slice(0, 200);
      return `<table><thead><tr>${cols.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((v) => `<td>${v == null ? '<span class="muted">null</span>' : esc(v)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }
    function chart(res) {
      const c = $("#sqlChart");
      if (!res || res.values.length < 2) {
        c.hidden = true;
        return;
      }
      const ni = res.columns.findIndex(
        (col, i) => i > 0 && res.values.every((r) => typeof r[i] === "number"),
      );
      if (ni < 0 || typeof res.values[0][0] !== "string") {
        c.hidden = true;
        return;
      }
      c.hidden = false;
      c.style.height = Math.min(320, res.values.length * 26 + 14) + "px";
      bars(
        c,
        res.values.slice(0, 12).map((r) => r[0]),
        res.values.slice(0, 12).map((r) => r[ni]),
      );
      $("#sqlChartL").textContent = `Chart: ${res.columns[0]} by ${res.columns[ni]}`;
    }
    function run(plan = false) {
      if (!db) return;
      const q = $<HTMLTextAreaElement>("#sqlIn").value.trim();
      const t0 = performance.now();
      try {
        if (plan) {
          const r = db.exec("EXPLAIN QUERY PLAN " + q)[0];
          const ms = (performance.now() - t0).toFixed(1);
          $("#sqlTable").innerHTML =
            `<div class="plan">${(r ? r.values : []).map((v) => `<div style="padding-left:${(v[1] ? 16 : 0) + (String(v[3]).startsWith("USE") ? 16 : 0)}px"><span class="${/USING (COVERING )?INDEX/.test(v[3]) ? "ok" : /SCAN/.test(v[3]) ? "warn" : ""}">${esc(v[3])}</span></div>`).join("") || "No plan."}</div><p class="muted" style="font-size:13px">SCAN reads every row. SEARCH using an index jumps straight to the rows it needs.</p>`;
          $("#sqlChart").hidden = true;
          $("#sqlMeta").textContent = `Plan in ${ms} ms`;
          return;
        }
        const res = db.exec(q);
        const ms = (performance.now() - t0).toFixed(1);
        const last = res[res.length - 1];
        $("#sqlTable").innerHTML = table(last);
        chart(last);
        $("#sqlMeta").textContent = `${last ? last.values.length : 0} rows in ${ms} ms`;
        GL && (GL.pulse = 0.3);
        SFX.tick();
      } catch (e) {
        $("#sqlTable").innerHTML = `<p class="err">${esc(e.message)}</p>`;
        $("#sqlChart").hidden = true;
        $("#sqlMeta").textContent = "Error";
      }
    }
    return {
      mount(e) {
        el = e;
        idx = false;
        el.innerHTML = `<div class="sql-pre">${PRE.map((p, i) => `<button class="chip" type="button" data-q="${i}">${p[0]}</button>`).join("")}</div>
      <div class="sql-ed"><label class="sr" for="sqlIn">SQL query</label><textarea id="sqlIn" spellcheck="false" data-lenis-prevent>${PRE[0][1]}</textarea>
      <div class="sql-act"><button class="btn" type="button" id="sqlRun">Run query</button><button class="chip" type="button" id="sqlPlan">Explain plan</button><button class="chip" type="button" id="sqlIdx" aria-pressed="false">Add index on bids(lot_id, amount)</button><span id="sqlMeta" class="muted">Loading SQLite…</span></div></div>
      <div class="sql-out"><div class="sql-table" id="sqlTable" data-lenis-prevent><p class="muted">Loading the database engine…</p></div><div><p class="muted" id="sqlChartL" style="font-size:12px;margin:0 0 6px"></p><canvas class="xcv" id="sqlChart" hidden></canvas></div></div>
      <p class="muted xp-small">Tables: <code>users(id, name, city, verified, joined)</code>, <code>lots(id, title, format, reserve, host_id, ends_at)</code>, <code>bids(id, lot_id, user_id, amount, placed_at)</code>. Ctrl + Enter runs the query.</p>`;
        $$(".sql-pre [data-q]", el).forEach((b) =>
          b.addEventListener("click", () => {
            $<HTMLTextAreaElement>("#sqlIn").value = PRE[+b.dataset.q][1];
            run();
          }),
        );
        $("#sqlRun").addEventListener("click", () => run());
        $("#sqlPlan").addEventListener("click", () => run(true));
        $("#sqlIn").addEventListener("keydown", (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.preventDefault();
            run();
          }
        });
        $("#sqlIdx").addEventListener("click", (e) => {
          if (!db) return;
          idx = !idx;
          db.run(
            idx
              ? "CREATE INDEX IF NOT EXISTS idx_bids_lot ON bids(lot_id, amount)"
              : "DROP INDEX IF EXISTS idx_bids_lot",
          );
          (e.currentTarget as HTMLElement).setAttribute("aria-pressed", String(idx));
          (e.currentTarget as HTMLElement).textContent = idx
            ? "Index on: drop it"
            : "Add index on bids(lot_id, amount)";
          run(true);
        });
        loadSqlJs()
          .then((m) => {
            seed(m);
            const n = db.exec(
              "SELECT (SELECT COUNT(*) FROM users),(SELECT COUNT(*) FROM lots),(SELECT COUNT(*) FROM bids)",
            )[0].values[0];
            run();
            $("#sqlMeta").textContent += ` · ${n[0]} users, ${n[1]} lots, ${n[2]} bids`;
          })
          .catch(() => {
            $("#sqlTable").innerHTML =
              `<p class="err">Could not load SQLite. This experiment needs an internet connection the first time.</p>`;
            $("#sqlMeta").textContent = "Offline";
          });
      },
    };
  })();

  /* ---------- 02 Auction race conditions ---------- */
  const RACE = (() => {
    let el,
      mode = "none",
      N = 8,
      sim = null,
      play = 0;
    function simulate() {
      const r = rnd(Date.now() & 0xffff),
        K = 4,
        inc = 50;
      const st = { price: 1000, ver: 0, lock: -1, queue: [] };
      const bs = [];
      for (let i = 0; i < N; i++)
        bs.push({ ph: "idle", t: (r() * 40) | 0, att: 0, rp: 0, rv: 0, segs: [], cur: null, acc: 0 });
      let lost = 0,
        retries = 0,
        accepted = 0,
        wait = 0,
        t = 0;
      const start = (b, ph, d) => {
        if (b.cur) b.cur[1] = t;
        b.ph = ph;
        b.t = d;
        b.cur = [t, t, ph];
        b.segs.push(b.cur);
      };
      while (t < 4000) {
        let busy = false;
        for (let i = 0; i < N; i++) {
          const b = bs[i];
          if (b.ph === "done") continue;
          busy = true;
          if (b.ph === "wait") {
            wait++;
            if (st.lock === -1 && st.queue[0] === i) {
              st.queue.shift();
              st.lock = i;
              start(b, "read", 5 + ((r() * 10) | 0));
              b.rp = st.price;
            }
            continue;
          }
          if (--b.t > 0) continue;
          if (b.ph === "idle") {
            if (b.att >= K) {
              if (b.cur) b.cur[1] = t;
              b.ph = "done";
              continue;
            }
            b.att++;
            if (mode === "pess") {
              st.queue.push(i);
              start(b, "wait", 1);
            } else {
              start(b, "read", 5 + ((r() * 10) | 0));
              b.rp = st.price;
              b.rv = st.ver;
            }
          } else if (b.ph === "read") start(b, "think", 4 + ((r() * 22) | 0));
          else if (b.ph === "think") start(b, "write", 4 + ((r() * 8) | 0));
          else if (b.ph === "write") {
            if (mode === "none") {
              if (st.price !== b.rp) {
                lost++;
                b.cur[2] = "lost";
              }
              st.price = b.rp + inc;
              accepted++;
              start(b, "idle", 8 + ((r() * 30) | 0));
            } else if (mode === "opt") {
              if (st.ver === b.rv) {
                st.price = b.rp + inc;
                st.ver++;
                accepted++;
                start(b, "idle", 8 + ((r() * 30) | 0));
              } else {
                retries++;
                b.cur[2] = "conflict";
                start(b, "read", 5 + ((r() * 10) | 0));
                b.rp = st.price;
                b.rv = st.ver;
              }
            } else {
              st.price += inc;
              st.ver++;
              accepted++;
              st.lock = -1;
              start(b, "idle", 8 + ((r() * 30) | 0));
            }
          }
        }
        if (!busy) break;
        t++;
      }
      bs.forEach((b) => {
        if (b.cur && b.cur[1] < b.cur[0]) b.cur[1] = t;
      });
      return { bs, t, lost, retries, accepted, wait, final: st.price, expected: 1000 + N * K * inc };
    }
    function draw() {
      if (!sim) return;
      const c = $("#raceCv"),
        [x, w, h] = fit(c),
        k = COL();
      x.clearRect(0, 0, w, h);
      const lane = (h - 24) / N,
        sx = (w - 60) / sim.t,
        now = sim.t * play;
      const col = {
        read: k.ice,
        think: k.line,
        write: k.green,
        wait: k.peach,
        lost: k.red,
        conflict: k.red,
        idle: "transparent",
      };
      sim.bs.forEach((b, i) => {
        const y = 4 + i * lane;
        x.fillStyle = k.fg2;
        x.font = `11px ${fonts.text()}`;
        x.textBaseline = "middle";
        x.fillText("Bidder " + (i + 1), 0, y + lane / 2);
        b.segs.forEach((s) => {
          if (s[0] > now) return;
          const e = Math.min(s[1], now);
          const c2 = col[s[2]];
          if (c2 === "transparent") return;
          x.fillStyle = c2;
          x.globalAlpha = s[2] === "think" ? 0.6 : 0.9;
          x.fillRect(60 + s[0] * sx, y + lane * 0.2, Math.max(1, (e - s[0]) * sx), lane * 0.6);
          x.globalAlpha = 1;
          if ((s[2] === "lost" || s[2] === "conflict") && e >= s[1]) {
            x.strokeStyle = k.red;
            x.beginPath();
            x.moveTo(60 + s[1] * sx, y);
            x.lineTo(60 + s[1] * sx, y + lane);
            x.stroke();
          }
        });
      });
      x.strokeStyle = k.fg;
      x.globalAlpha = 0.4;
      x.beginPath();
      x.moveTo(60 + now * sx, 0);
      x.lineTo(60 + now * sx, h - 18);
      x.stroke();
      x.globalAlpha = 1;
      x.fillStyle = k.fg2;
      x.font = `10px ${fonts.text()}`;
      x.fillText("0 ms", 60, h - 8);
      x.textAlign = "right";
      x.fillText(sim.t + " ms", w - 2, h - 8);
      x.textAlign = "left";
    }
    function metrics() {
      const s = sim,
        money = s.expected - s.final;
      $("#raceM").innerHTML = [
        ["Accepted bids", s.accepted],
        ["Lost updates", s.lost, s.lost ? "bad" : "ok"],
        ["Retries", s.retries],
        ["Time waiting for lock", s.wait + " ms"],
        ["Total time", s.t + " ms"],
        ["Final price", `AZN ${s.final.toLocaleString("en-US")}`, money ? "bad" : "ok"],
        ["Correct price", `AZN ${s.expected.toLocaleString("en-US")}`],
      ]
        .map((m) => `<div class="${m[2] || ""}"><small>${m[0]}</small><b>${m[1]}</b></div>`)
        .join("");
      $("#raceV").textContent =
        mode === "none"
          ? s.lost
            ? `${s.lost} bids were silently overwritten. The lot sold for AZN ${money.toLocaleString("en-US")} less than it should have.`
            : "Lucky run: no overlaps this time. Run it again."
          : mode === "pess"
            ? `Correct price, but bidders spent ${s.wait} ms queuing for the lock.`
            : `Correct price. ${s.retries} writes detected a stale version and retried instead of overwriting.`;
    }
    function go() {
      sim = simulate();
      play = 0;
      metrics();
      SFX.whoosh();
    }
    return {
      mount(e) {
        el = e;
        el.innerHTML = `<div class="xc">${seg(
          [
            ["none", "No locking"],
            ["pess", "Pessimistic lock"],
            ["opt", "Optimistic, version check"],
          ],
          mode,
          "raceMode",
        )}${slider("raceN", "Bidders", 2, 12, N)}<button class="btn" type="button" id="raceGo">Run the auction</button></div>
      <canvas class="xcv" id="raceCv" style="height:300px"></canvas><div class="legend"><span><i style="background:var(--ice)"></i>Read price</span><span><i style="background:var(--line-2)"></i>Think</span><span><i style="background:#4ade80"></i>Write</span><span><i style="background:var(--peach)"></i>Wait for lock</span><span><i style="background:var(--live)"></i>Lost update or conflict</span></div>
      <p class="verdict" id="raceV"></p><div class="xm" id="raceM"></div>`;
        onSeg($("#raceMode"), (v) => {
          mode = v;
          go();
        });
        bindS("raceN", (v) => {
          N = v;
          go();
        });
        $("#raceGo").addEventListener("click", go);
        go();
      },
      tick(dt) {
        if (!sim) return;
        if (play < 1) {
          play = Math.min(1, play + dt / 2.6);
        }
        draw();
      },
    };
  })();

  /* ---------- 03 Rate limiter lab ---------- */
  const RATE = (() => {
    let rps = 18,
      lim = 10,
      cap = 15,
      pat = "steady",
      t = 0,
      acc = 0,
      burst = 0;
    const H = 100,
      step = 0.1;
    let lims;
    function reset() {
      lims = [
        { n: "Fixed window", c: "ice", win: -1, cnt: 0, hist: [] },
        { n: "Sliding window log", c: "lilac", log: [], hist: [] },
        { n: "Token bucket", c: "peach", tok: cap, hist: [], lvl: [] },
      ];
    }
    function allow(L, now) {
      if (L.n === "Fixed window") {
        const w = Math.floor(now);
        if (w !== L.win) {
          L.win = w;
          L.cnt = 0;
        }
        if (L.cnt < lim) {
          L.cnt++;
          return true;
        }
        return false;
      }
      if (L.n === "Sliding window log") {
        while (L.log.length && L.log[0] <= now - 1) L.log.shift();
        if (L.log.length < lim) {
          L.log.push(now);
          return true;
        }
        return false;
      }
      if (L.tok >= 1) {
        L.tok--;
        return true;
      }
      return false;
    }
    function stepSim() {
      const now = t;
      let rate = rps;
      if (pat === "bursty") rate = Math.floor(now / 2) % 2 ? rps * 2.2 : rps * 0.2;
      if (pat === "edge") rate = now % 1 > 0.85 || now % 1 < 0.05 ? rps * 4 : rps * 0.15;
      let n = 0;
      const lam = rate * step;
      let L = Math.exp(-lam),
        p = 1;
      do {
        n++;
        p *= Math.random();
      } while (p > L);
      n--;
      n += burst;
      burst = 0;
      lims.forEach((l) => {
        if (l.n === "Token bucket") l.tok = Math.min(cap, l.tok + lim * step);
        let a = 0,
          r = 0;
        for (let i = 0; i < n; i++) {
          const tt = now + (i * step) / Math.max(n, 1);
          if (allow(l, tt)) a++;
          else r++;
        }
        l.hist.push([a, r]);
        if (l.hist.length > H) l.hist.shift();
        if (l.lvl) {
          l.lvl.push(l.tok);
          if (l.lvl.length > H) l.lvl.shift();
        }
      });
      t += step;
    }
    function draw() {
      const k = COL();
      lims.forEach((l, i) => {
        const c = $("#rlCv" + i);
        if (!c) return;
        const [x, w, h] = fit(c);
        x.clearRect(0, 0, w, h);
        const mx = Math.max(4, ...lims.flatMap((L) => L.hist.map((v) => v[0] + v[1])));
        const bw = w / H;
        l.hist.forEach((v, j) => {
          const ha = ((h - 16) * v[0]) / mx,
            hr = ((h - 16) * v[1]) / mx;
          x.fillStyle = k[l.c];
          x.fillRect(j * bw, h - ha, bw - 1, ha);
          x.fillStyle = k.red;
          x.globalAlpha = 0.75;
          x.fillRect(j * bw, h - ha - hr, bw - 1, hr);
          x.globalAlpha = 1;
        });
        if (l.lvl) {
          x.strokeStyle = k.fg;
          x.lineWidth = 1.5;
          x.beginPath();
          l.lvl.forEach((v, j) => {
            const y = h - (((h - 16) * v) / cap) * 0.9;
            j ? x.lineTo(j * bw, y) : x.moveTo(0, y);
          });
          x.stroke();
        }
        const tot = l.hist.reduce((s, v) => s + v[0] + v[1], 0),
          rej = l.hist.reduce((s, v) => s + v[1], 0);
        $("#rlS" + i).textContent = tot ? `${Math.round((rej / tot) * 100)}% rejected` : "0% rejected";
      });
    }
    return {
      mount(e) {
        reset();
        e.innerHTML = `<div class="xc">${seg(
          [
            ["steady", "Steady"],
            ["bursty", "Bursty"],
            ["edge", "Window edge"],
          ],
          pat,
          "rlPat",
        )}${slider("rlRps", "Traffic, req/s", 1, 60, rps)}${slider("rlLim", "Limit, req/s", 2, 40, lim)}${slider("rlCap", "Bucket size", 1, 60, cap)}<button class="btn" type="button" id="rlBurst">Send a burst of 40</button></div>
      <div class="rl-grid">${[0, 1, 2].map((i) => `<div class="rl"><div class="rl-h"><b>${lims[i].n}</b><span id="rlS${i}"></span></div><canvas class="xcv" id="rlCv${i}" style="height:150px"></canvas></div>`).join("")}</div>
      <div class="legend"><span><i style="background:var(--ice)"></i>Accepted</span><span><i style="background:var(--live)"></i>Rejected</span><span><i style="background:var(--fg)"></i>Tokens left</span></div>
      <p class="verdict">Try "Window edge": traffic bunches at the end of one second and the start of the next. The fixed window lets nearly double the limit through around the boundary; the sliding log and the token bucket do not.</p>`;
        onSeg($("#rlPat"), (v) => (pat = v));
        bindS("rlRps", (v) => (rps = v));
        bindS("rlLim", (v) => (lim = v));
        bindS("rlCap", (v) => {
          cap = v;
          lims[2].tok = Math.min(lims[2].tok, cap);
        });
        $("#rlBurst").addEventListener("click", () => {
          burst = 40;
          SFX.whoosh();
          GL && (GL.pulse = 0.5);
        });
      },
      tick(dt) {
        acc += dt;
        while (acc >= step) {
          acc -= step;
          stepSim();
        }
        draw();
      },
    };
  })();

  /* ---------- 04 Consistent hashing ring ---------- */
  const HASH = (() => {
    let nodes = ["db-1", "db-2", "db-3", "db-4"],
      vn = 40,
      keys = [],
      owner = [],
      prev = [],
      anim = 1,
      moved = null,
      nextId = 5;
    const PAL = ["#A8E0FF", "#B9A7FF", "#FFB79A", "#4ade80", "#f472b6", "#facc15", "#22d3ee", "#fb923c"];
    function ring() {
      const pts = [];
      nodes.forEach((n, ni) => {
        for (let v = 0; v < vn; v++) pts.push([fnv(n + "#" + v), ni]);
      });
      return pts.sort((a, b) => a[0] - b[0]);
    }
    function assign() {
      const pts = ring();
      return keys.map((k) => {
        const h = k.h;
        let lo = 0,
          hi = pts.length;
        while (lo < hi) {
          const m = (lo + hi) >> 1;
          if (pts[m][0] < h) lo = m + 1;
          else hi = m;
        }
        return nodes[(pts[lo % pts.length] || pts[0])[1]];
      });
    }
    function change(fn: () => void) {
      const before = assign();
      const modBefore = keys.map((k) => k.h % nodes.length);
      fn();
      const after = assign();
      const modAfter = keys.map((k) => k.h % nodes.length);
      prev = before;
      owner = after;
      anim = 0;
      moved = {
        mv: after.filter((o, i) => o !== before[i]).length,
        mm: modAfter.filter((v, i) => v !== modBefore[i]).length,
      };
      stats();
      SFX.drop(1);
    }
    function stats() {
      const cnt = nodes.map((n) => owner.filter((o) => o === n).length),
        avg = keys.length / nodes.length,
        sd = Math.sqrt(cnt.reduce((s, c) => s + (c - avg) ** 2, 0) / nodes.length);
      $("#hashM").innerHTML =
        `<div><small>Servers</small><b>${nodes.length}</b></div><div><small>Load spread (std. dev.)</small><b>${sd.toFixed(1)} keys</b></div>${moved ? `<div class="ok"><small>Keys moved, consistent hashing</small><b>${moved.mv} (${Math.round((moved.mv / keys.length) * 100)}%)</b></div><div class="bad"><small>Keys moved, hash mod N</small><b>${moved.mm} (${Math.round((moved.mm / keys.length) * 100)}%)</b></div>` : ""}`;
      $("#hashLoad").innerHTML = nodes
        .map((n, i) => `<div><span style="background:${PAL[i % 8]}"></span>${n}<b>${cnt[i]}</b></div>`)
        .join("");
    }
    function draw() {
      const c = $("#hashCv");
      if (!c) return;
      const [x, w, h] = fit(c),
        k = COL(),
        cx = w / 2,
        cy = h / 2,
        R = Math.min(w, h) / 2 - 30;
      x.clearRect(0, 0, w, h);
      x.strokeStyle = k.line;
      x.lineWidth = 2;
      x.beginPath();
      x.arc(cx, cy, R, 0, 7);
      x.stroke();
      ring().forEach((p) => {
        const a = (p[0] / 4294967296) * Math.PI * 2 - Math.PI / 2;
        x.fillStyle = PAL[p[1] % 8];
        x.fillRect(cx + Math.cos(a) * (R + 6) - 1.5, cy + Math.sin(a) * (R + 6) - 1.5, 3, 8 > vn ? 6 : 3);
      });
      keys.forEach((kk, i) => {
        const a = (kk.h / 4294967296) * Math.PI * 2 - Math.PI / 2,
          rr = R - 12 - (i % 5) * 7;
        const ni = nodes.indexOf(owner[i]);
        const was = prev.length && prev[i] !== owner[i] && anim < 1;
        x.fillStyle = PAL[ni % 8];
        x.globalAlpha = was ? 0.3 + 0.7 * anim : 0.85;
        x.beginPath();
        x.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, was ? 3.5 + 3 * (1 - anim) : 2.5, 0, 7);
        x.fill();
        x.globalAlpha = 1;
      });
      x.fillStyle = k.fg2;
      x.font = `12px ${fonts.text()}`;
      x.textAlign = "center";
      x.fillText(`${keys.length} keys, ${nodes.length} servers × ${vn} virtual nodes`, cx, cy);
      x.textAlign = "left";
    }
    return {
      mount(e) {
        nodes = ["db-1", "db-2", "db-3", "db-4"];
        nextId = 5;
        keys = Array.from({ length: 200 }, (_, i) => ({
          k: "user:" + (1000 + i),
          h: fnv("user:" + (1000 + i)),
        }));
        owner = assign();
        prev = [];
        moved = null;
        e.innerHTML = `<div class="xc"><button class="btn" type="button" id="hashAdd">Add a server</button><button class="btn ghost" type="button" id="hashDel">Remove a server</button>${slider("hashVn", "Virtual nodes per server", 1, 120, vn)}</div>
      <div class="hash-wrap"><canvas class="xcv" id="hashCv" style="height:380px"></canvas><div><div class="xm" id="hashM"></div><div class="hash-load" id="hashLoad"></div></div></div>
      <p class="verdict">With hash mod N, changing the number of servers remaps almost every key, which empties every cache at once. On a ring only the keys next to the changed server move. Try 1 virtual node to see why real systems use many.</p>`;
        $("#hashAdd").addEventListener("click", () => {
          if (nodes.length < 8) change(() => nodes.push("db-" + nextId++));
        });
        $("#hashDel").addEventListener("click", () => {
          if (nodes.length > 2) change(() => nodes.splice((Math.random() * nodes.length) | 0, 1));
        });
        bindS("hashVn", (v) => {
          vn = v;
          owner = assign();
          prev = [];
          moved = null;
          stats();
        });
        stats();
      },
      tick(dt) {
        if (anim < 1) anim = Math.min(1, anim + dt * 0.8);
        draw();
      },
    };
  })();

  /* ---------- 05 Cache simulator ---------- */
  const CACHE = (() => {
    let cap = 20,
      pat = "zipf",
      t = 0,
      hist = { lru: [], lfu: [], fifo: [] },
      caches,
      win = [],
      seq = 0,
      hot = 0;
    const N = 100,
      CAPH = 120;
    function reset() {
      caches = {
        lru: { m: new Map(), h: 0, n: 0 },
        lfu: { m: new Map(), f: new Map(), h: 0, n: 0 },
        fifo: { m: new Map(), q: [], h: 0, n: 0 },
      };
      hist = { lru: [], lfu: [], fifo: [] };
      win = [];
    }
    const zipfTable: { c: number[] | null; z: number } = { c: null, z: 0 };
    const zipf = () => {
      const s = 1.15;
      const u = Math.random();
      if (!zipfTable.c) {
        zipfTable.c = [];
        let z = 0;
        for (let i = 1; i <= N; i++) {
          z += 1 / Math.pow(i, s);
          zipfTable.c.push(z);
        }
        zipfTable.z = z;
      }
      const x = u * zipfTable.z;
      let i = zipfTable.c.findIndex((v) => v >= x);
      return i < 0 ? N - 1 : i;
    };
    function next() {
      seq++;
      if (pat === "scan") return seq % (cap + 15);
      if (pat === "mixed") return seq % 400 < 120 ? 100 + (seq % 140) : zipf();
      if (pat === "shift") {
        return (zipf() + hot) % N;
      }
      return zipf();
    }
    function access(name, key) {
      const c = caches[name];
      c.n++;
      if (name === "lru") {
        if (c.m.has(key)) {
          c.h++;
          c.m.delete(key);
          c.m.set(key, 1);
          return 1;
        }
        c.m.set(key, 1);
        if (c.m.size > cap) c.m.delete(c.m.keys().next().value);
        return 0;
      }
      if (name === "lfu") {
        if (c.m.has(key)) {
          c.h++;
          c.f.set(key, c.f.get(key) + 1);
          return 1;
        }
        if (c.m.size >= cap) {
          let mk = null,
            mf = 1e9;
          for (const k of c.m.keys()) {
            const f = c.f.get(k);
            if (f < mf) {
              mf = f;
              mk = k;
            }
          }
          c.m.delete(mk);
          c.f.delete(mk);
        }
        c.m.set(key, 1);
        c.f.set(key, 1);
        return 0;
      }
      if (c.m.has(key)) {
        c.h++;
        return 1;
      }
      c.m.set(key, 1);
      c.q.push(key);
      if (c.m.size > cap) c.m.delete(c.q.shift());
      return 0;
    }
    function stepSim() {
      for (let i = 0; i < 40; i++) {
        const k = next();
        const r = {};
        for (const n of ["lru", "lfu", "fifo"]) r[n] = access(n, k);
        win.push(r);
        if (win.length > 600) win.shift();
      }
      t++;
      if (pat === "shift" && t % 120 === 0) hot = (hot + 37) % N;
      for (const n of ["lru", "lfu", "fifo"]) {
        const ratio = win.reduce((s, r) => s + r[n], 0) / win.length;
        hist[n].push(ratio);
        if (hist[n].length > CAPH) hist[n].shift();
      }
    }
    function draw() {
      const k = COL();
      const c = $("#cacheCv");
      if (!c) return;
      lines(
        c,
        [
          { data: hist.lru, color: k.ice, cap: CAPH },
          { data: hist.lfu, color: k.lilac, cap: CAPH },
          { data: hist.fifo, color: k.peach, cap: CAPH },
        ],
        { max: 1, min: 0 },
      );
      ["lru", "lfu", "fifo"].forEach((n) => {
        const v = hist[n][hist[n].length - 1] || 0;
        const el = $("#cacheS-" + n);
        if (el) el.textContent = Math.round(v * 100) + "%";
        const cv = $("#cacheC-" + n);
        if (cv) {
          const keys = [...caches[n].m.keys()];
          cv.innerHTML = keys
            .slice(0, 60)
            .map((kk) => `<i style="opacity:${(0.25 + 0.75 * Math.max(0, 1 - kk / N)).toFixed(2)}"></i>`)
            .join("");
        }
      });
    }
    let acc = 0;
    return {
      mount(e) {
        reset();
        e.innerHTML = `<div class="xc">${seg(
          [
            ["zipf", "Hot keys"],
            ["scan", "Sequential scan"],
            ["mixed", "Hot keys + scans"],
            ["shift", "Shifting hot set"],
          ],
          pat,
          "cachePat",
        )}${slider("cacheCap", "Cache size", 5, 60, cap)}<button class="btn ghost" type="button" id="cacheReset">Reset</button></div>
      <div class="cache-wrap"><canvas class="xcv" id="cacheCv" style="height:260px"></canvas><div class="cache-side">${[
        ["lru", "LRU", "var(--ice)"],
        ["lfu", "LFU", "var(--lilac)"],
        ["fifo", "FIFO", "var(--peach)"],
      ]
        .map(
          (p) =>
            `<div class="cs"><div><span style="background:${p[2]}"></span>${p[1]}<b id="cacheS-${p[0]}">0%</b></div><div class="cells" id="cacheC-${p[0]}"></div></div>`,
        )
        .join("")}</div></div>
      <p class="verdict">"Hot keys" favours LFU. A "Sequential scan" larger than the cache drops LRU and FIFO to zero hits. With "Hot keys + scans", the scans flush LRU while LFU keeps the hot set: that is why databases protect their buffer pools from big scans.</p>`;
        onSeg($("#cachePat"), (v) => {
          pat = v;
          reset();
        });
        bindS("cacheCap", (v) => {
          cap = v;
          reset();
        });
        $("#cacheReset").addEventListener("click", reset);
      },
      tick(dt) {
        acc += dt;
        while (acc > 0.05) {
          acc -= 0.05;
          stepSim();
        }
        draw();
      },
    };
  })();

  /* ---------- 06 Live GitHub data ---------- */
  const GH = (() => {
    const U = profile.githubUser;
    async function get(url) {
      const k = "sq-gh-" + url;
      try {
        const c = JSON.parse(sessionStorage.getItem(k) || "null");
        if (c && Date.now() - c.t < 6e5) return c.d;
      } catch (e) {}
      const r = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
      if (!r.ok)
        throw new Error(
          r.status === 403
            ? "GitHub's hourly limit for anonymous requests is used up. Try again later."
            : "GitHub returned " + r.status + ".",
        );
      const d = await r.json();
      try {
        sessionStorage.setItem(k, JSON.stringify({ t: Date.now(), d }));
      } catch (e) {}
      return d;
    }
    const ago = (d) => {
      const s = (Date.now() - new Date(d).getTime()) / 1000;
      return s < 3600
        ? Math.round(s / 60) + " min ago"
        : s < 86400
          ? Math.round(s / 3600) + " h ago"
          : Math.round(s / 86400) + " days ago";
    };
    return {
      mount(e) {
        e.innerHTML = `<div class="gh"><div class="xm" id="ghM"><div><small>Loading</small><b>…</b></div></div><div class="gh-grid"><div><p class="muted" style="font-size:12px;margin:0 0 8px">Languages across public repositories</p><canvas class="xcv" id="ghLang" style="height:220px"></canvas></div><div><p class="muted" style="font-size:12px;margin:0 0 8px">Public activity, last 12 weeks</p><div class="heat" id="ghHeat"></div><p class="muted" style="font-size:12px;margin:14px 0 8px">Recently updated</p><ul class="gh-repos" id="ghRepos"></ul></div></div></div>`;
        Promise.all([
          get(`https://api.github.com/users/${U}`),
          get(`https://api.github.com/users/${U}/repos?per_page=100&sort=updated`),
          get(`https://api.github.com/users/${U}/events/public?per_page=100`).catch(() => []),
        ])
          .then(([u, repos, ev]) => {
            const own = repos.filter((r) => !r.fork),
              stars = own.reduce((s, r) => s + r.stargazers_count, 0),
              langs = {};
            own.forEach((r) => {
              if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;
            });
            $("#ghM").innerHTML = [
              ["Public repositories", u.public_repos],
              ["Stars received", stars],
              ["Followers", u.followers],
              ["On GitHub since", new Date(u.created_at).getFullYear()],
            ]
              .map((m) => `<div><small>${m[0]}</small><b>${m[1]}</b></div>`)
              .join("");
            const L = (Object.entries(langs) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8);
            bars(
              $("#ghLang"),
              L.map((l) => l[0]),
              L.map((l) => l[1]),
              COL().lilac,
            );
            $("#ghRepos").innerHTML = own
              .slice(0, 6)
              .map(
                (r) =>
                  `<li><a href="${r.html_url}" target="_blank" rel="noopener">${esc(r.name)}</a><span>${esc(r.language || "")}</span><span>★ ${r.stargazers_count}</span><span>${ago(r.pushed_at)}</span></li>`,
              )
              .join("");
            const days = {};
            (ev || []).forEach((x) => {
              const d = x.created_at.slice(0, 10);
              days[d] =
                (days[d] || 0) + (x.type === "PushEvent" && x.payload && x.payload.size ? x.payload.size : 1);
            });
            const cells = [];
            const today = new Date();
            for (let i = 83; i >= 0; i--) {
              const d = new Date(today);
              d.setDate(today.getDate() - i);
              const k = d.toISOString().slice(0, 10);
              cells.push([k, days[k] || 0]);
            }
            const mx = Math.max(1, ...cells.map((c) => c[1]));
            $("#ghHeat").innerHTML = cells
              .map(
                (c) =>
                  `<i title="${c[0]}: ${c[1]}" style="opacity:${c[1] ? (0.25 + (0.75 * c[1]) / mx).toFixed(2) : 0.08}"></i>`,
              )
              .join("");
          })
          .catch((err) => {
            $("#ghM").innerHTML =
              `<p class="err">${esc(err.message || "Could not reach GitHub.")} <a href="https://github.com/${U}" target="_blank" rel="noopener">Open the profile instead</a>.</p>`;
          });
      },
    };
  })();

  const MODS: Record<string, { mount: (el: HTMLElement) => void; tick?: (dt: number) => void }> = {
    sql: SQL,
    race: RACE,
    rate: RATE,
    hash: HASH,
    cache: CACHE,
    gh: GH,
  };
  let vis = new Set<string>(),
    raf = 0,
    last = 0,
    io = null;
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    vis.forEach((k) => {
      const m = MODS[k];
      m.tick && m.tick(dt);
    });
    if ($(".labx")) raf = requestAnimationFrame(loop);
  }
  return {
    mount() {
      Object.entries(MODS).forEach(([k, m]) => {
        const el = $("#xb-" + k);
        if (el) m.mount(el);
      });
      io = new IntersectionObserver(
        (es) =>
          es.forEach((e) => {
            const k = (e.target as HTMLInputElement).dataset.x;
            if (!k) return;
            e.isIntersecting ? vis.add(k) : vis.delete(k);
          }),
        { rootMargin: "100px" },
      );
      $$(".xp[data-x]").forEach((x) => io.observe(x));
      const links = $$(".lab-nav a");
      const secs = links.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(loop);
      const nt = setInterval(() => {
        let a = 0;
        secs.forEach((s, i) => {
          if (s && s.getBoundingClientRect().top < innerHeight * 0.4) a = i;
        });
        links.forEach((l, i) => l.classList.toggle("on", i === a));
      }, 200);
      cleanup.push(() => {
        cancelAnimationFrame(raf);
        io && io.disconnect();
        vis.clear();
        clearInterval(nt);
      });
    },
  };
})();
