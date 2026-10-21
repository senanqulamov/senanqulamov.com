// The brief builder: six short steps, a live estimate and an optional intro call slot.

import { pricing } from "@/data/pricing";
import { profile } from "@/data/profile";
import { locales } from "@/i18n";
import { money } from "@/lib/format";
import { $, $$, clamp, esc } from "../dom";
import { cleanup, GL, lenis } from "../state";
import { getLang, tr } from "../i18n";
import { copy, toast } from "../ui";
import { blip } from "../sound";
import { fieldErr } from "../forms";
import { sendMessage } from "../send";

export const Start = (() => {
  let form: HTMLFormElement,
    step = 0,
    slot = { day: "", time: "" },
    shown = 0;
  const P = pricing,
    round50 = (v: number) => Math.round(v / 50) * 50,
    unit = (u?: string) => (u === "month" ? " / month" : u === "session" ? " / session" : "");
  function read() {
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) || "").trim();
    return {
      svc: fd.getAll("svc").map(String),
      pkg: get("pkg") || "feature",
      add: fd.getAll("add").map(String),
      time: get("time") || "standard",
      budget: get("budget"),
      name: get("name"),
      company: get("company"),
      email: get("email"),
      phone: get("phone"),
      story: get("story"),
    };
  }
  function compute() {
    const f = read(),
      pk = P.packages[f.pkg],
      tl = P.timeline[f.time];
    const lines: [string, string][] = [];
    let project = 0,
      monthly = 0,
      perSession = 0,
      wMin = 0,
      wMax = 0;
    f.svc.forEach((k) => {
      const s = P.services[k];
      if (s.unit === "month") {
        monthly += s.from;
        lines.push([tr(s.name), money(s.from) + unit("month")]);
      } else if (s.unit === "session") {
        perSession += s.from;
        lines.push([tr(s.name), money(s.from) + unit("session")]);
      } else {
        const v = s.from * pk.multiplier;
        project += v;
        wMin = Math.max(wMin, s.weeks[0]);
        wMax = Math.max(wMax, s.weeks[1]);
        lines.push([tr(s.name), money(round50(v))]);
      }
    });
    f.add.forEach((k) => {
      const a = P.addons[k];
      if (a.unit === "month") {
        monthly += a.price;
        lines.push([tr(a.name), money(a.price) + unit("month")]);
      } else {
        project += a.price;
        lines.push([tr(a.name), money(a.price)]);
      }
    });
    if (project > 0) {
      lines.push([
        tr(pk.label + ": " + pk.name),
        pk.multiplier === 1 ? tr("Base price") : "×" + pk.multiplier,
      ]);
      lines.push([
        tr(tl.name),
        tl.multiplier === 1
          ? tr("Base price")
          : (tl.multiplier > 1 ? "+" : "−") + Math.round(Math.abs(tl.multiplier - 1) * 100) + "%",
      ]);
    }
    const total = round50(project * tl.multiplier),
      high = round50(total * 1.35);
    const weeks =
      project > 0
        ? [
            Math.max(1, Math.round(wMin * pk.timeFactor * tl.timeFactor)),
            Math.max(1, Math.round(wMax * pk.timeFactor * tl.timeFactor)),
          ]
        : null;
    return { f, lines, total, high, weeks, monthly, perSession };
  }
  function paint() {
    const e = compute();
    $("#stLines").innerHTML = e.lines.length
      ? e.lines.map((l) => `<li><span>${esc(l[0])}</span><span>${esc(l[1])}</span></li>`).join("")
      : `<li class="empty">${tr("Choose what we are making to see the estimate.")}</li>`;
    const to = e.total,
      from = shown,
      t0 = performance.now();
    const el = $("#stTotal");
    const step = (t: number) => {
      const k = clamp((t - t0) / 700, 0, 1);
      shown = from + (to - from) * (1 - Math.pow(1 - k, 4));
      el.textContent = money(round50(shown));
      if (k < 1 && el.isConnected) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    $("#stRange").textContent = e.total
      ? tr("up to") + " " + money(e.high)
      : e.monthly || e.perSession
        ? tr("Recurring work only")
        : "";
    if ($("#ebTotal")) {
      $("#ebTotal").textContent = money(e.total) + (e.monthly && !e.total ? "" : "");
      $("#ebWeeks").textContent = e.weeks
        ? e.weeks[0] + "–" + e.weeks[1] + " " + tr("weeks")
        : e.monthly
          ? money(e.monthly) + " / " + tr("month")
          : "";
    }
    $("#stWeeks").textContent = e.weeks ? tr(e.weeks[0] + " to " + e.weeks[1] + " weeks") : "-";
    $("#stMonthly").textContent = e.monthly
      ? money(e.monthly) + unit("month")
      : e.perSession
        ? money(e.perSession) + unit("session")
        : "-";
    $("#stCall").textContent =
      slot.day && slot.time
        ? new Date(slot.day).toLocaleDateString(locales[getLang()], {
            weekday: "short",
            day: "numeric",
            month: "short",
          }) +
          ", " +
          slot.time
        : "-";
  }
  function goStep(n: number) {
    step = clamp(n, 0, 5);
    $$(".st-scene").forEach((s) => s.classList.toggle("on", +s.dataset.sc === step));
    $$("#stSteps button").forEach((b, i) => {
      b.classList.toggle("on", i === step);
      b.classList.toggle("done", i < step);
    });
    $<HTMLButtonElement>("#stPrev").disabled = step === 0;
    $(".st-next-label").textContent = tr(step === 5 ? "Send the brief" : "Next scene");
    const egb = $("#ebGo");
    if (egb) egb.textContent = tr(step === 5 ? "Send the brief" : "Next scene");
    $("#stProg").style.transform = `scaleX(${(step + 1) / 6})`;
    GL && GL.burst && (GL.st.burst = 0.35);
    const top = $("#stForm").getBoundingClientRect().top + scrollY - 120;
    if (scrollY > top) {
      if (lenis) lenis.scrollTo(top, { duration: 1 });
      else scrollTo({ top, behavior: "smooth" });
    }
  }
  function brief(e: ReturnType<typeof compute>) {
    const f = e.f;
    return [
      `New project brief`,
      ``,
      `What: ${f.svc.map((k) => P.services[k].name).join(", ") || "-"}`,
      `Cut: ${P.packages[f.pkg].name}`,
      `Extras: ${f.add.map((k) => P.addons[k].name).join(", ") || "-"}`,
      `Timeline: ${P.timeline[f.time].name}`,
      `Budget: ${f.budget || "-"}`,
      `Estimate: ${e.total ? money(e.total) + " to " + money(e.high) : "-"}${e.weeks ? ", " + e.weeks[0] + " to " + e.weeks[1] + " weeks" : ""}${e.monthly ? ", plus " + money(e.monthly) + " / month" : ""}`,
      `Intro call: ${$("#stCall").textContent}`,
      ``,
      `The story:`,
      f.story || "-",
      ``,
      `${f.name}${f.company ? ", " + f.company : ""}`,
      f.email,
      f.phone,
    ].join("\n");
  }
  async function send() {
    const e = compute(),
      f = e.f,
      err = $("#stErr");
    if (!f.svc.length) {
      goStep(0);
      toast(tr("Pick at least one thing we are making."));
      return;
    }
    const bad = [];
    if (!f.name) bad.push(["name", tr("Add your name so I know who to reply to.")]);
    if (!/^\S+@\S+\.\S+$/.test(f.email)) bad.push(["email", tr("Add a valid email, like name@company.com.")]);
    if (bad.length) {
      goStep(5);
      setTimeout(() => bad.forEach(([k, m]) => fieldErr(k, m, form)), 350);
      return;
    }
    err.textContent = "";
    const sb = $("#stSend");
    sb.classList.add("loading");
    const b = brief(e),
      subject = "Project brief from " + f.name,
      href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(b)}`;
    const sent = await sendMessage({ subject, text: b, replyTo: f.email });
    sb.classList.remove("loading");
    $<HTMLAnchorElement>("#stMail").href = href;
    $("#stCopy").onclick = () => copy(b, "Brief copied");
    if (!sent) location.href = href;
    else $("#stDoneText").textContent = tr("Your brief is on its way. You will hear back within a few days.");
    $(".st-wrap").hidden = true;
    $("#stDone").hidden = false;
    $("#estBar") && $("#estBar").classList.add("gone");
    lenis && lenis.resize();
    GL && GL.burst();
    blip(990, 0.4);
  }
  return {
    mount() {
      form = $<HTMLFormElement>("#stForm");
      step = 0;
      slot = { day: "", time: "" };
      shown = 0;
      const pre = (new URLSearchParams(location.search).get("svc") || "").split(",").filter(Boolean);
      pre.forEach((k) => {
        const i = form.querySelector<HTMLInputElement>(`input[name=svc][value="${k}"]`);
        if (i) i.checked = true;
      });
      form.querySelector<HTMLInputElement>("input[name=pkg][value=feature]").checked = true;
      form.querySelector<HTMLInputElement>("input[name=time][value=standard]").checked = true;
      form.addEventListener("change", paint);
      paint();
      $$("#stSteps button").forEach((b) => b.addEventListener("click", () => goStep(+b.dataset.go)));
      $("#ebGo").addEventListener("click", () => (step === 5 ? send() : goStep(step + 1)));
      const eb = $("#estBar");
      const eio = new IntersectionObserver((es) =>
        es.forEach((x) => eb.classList.toggle("hide", x.isIntersecting)),
      );
      eio.observe($("#est"));
      cleanup.push(() => eio.disconnect());
      $("#stPrev").addEventListener("click", () => goStep(step - 1));
      $("#stNext").addEventListener("click", () => (step === 5 ? send() : goStep(step + 1)));
      $("#stSend").addEventListener("click", send);
      $("#stDays").addEventListener("click", (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>("button");
        if (!b) return;
        slot.day = b.dataset.day;
        $$("#stDays button").forEach((x) => x.classList.toggle("on", x === b));
        upd();
      });
      $("#stTimes").addEventListener("click", (e) => {
        const b = (e.target as HTMLElement).closest<HTMLElement>("button");
        if (!b) return;
        slot.time = b.dataset.time;
        $$("#stTimes button").forEach((x) => x.classList.toggle("on", x === b));
        upd();
      });
      const upd = () => {
        const loc = locales[getLang()];
        $("#stSlot").textContent =
          slot.day && slot.time
            ? tr("Picked:") +
              " " +
              new Date(slot.day).toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long" }) +
              " " +
              tr("at") +
              " " +
              slot.time +
              ", " +
              tr("Baku time.")
            : slot.day
              ? tr("Now pick a time.")
              : tr("No slot picked yet.");
        paint();
      };
      $("#stAgain").addEventListener("click", () => {
        form.reset();
        form.querySelector<HTMLInputElement>("input[name=pkg][value=feature]").checked = true;
        form.querySelector<HTMLInputElement>("input[name=time][value=standard]").checked = true;
        slot = { day: "", time: "" };
        $$("#stDays button,#stTimes button").forEach((x) => x.classList.remove("on"));
        $$(".fl", form).forEach((x) => x.classList.remove("valid", "err"));
        upd();
        $(".st-wrap").hidden = false;
        $("#stDone").hidden = true;
        goStep(0);
      });
    },
  };
})();
