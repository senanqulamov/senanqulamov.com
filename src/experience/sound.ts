// Every sound on the site is synthesized here. Nothing plays until the visitor turns sound on.

import { $$, body } from "./dom";
import { tr } from "./i18n";

let actx: AudioContext = null,
  master: GainNode = null,
  sfxBus: GainNode = null,
  verb: ConvolverNode = null;
export let soundOn = false;
export const AMB = {
  filter: null as BiquadFilterNode,
  pad: null as GainNode,
  get ctx() {
    return actx;
  },
};
function initAudio() {
  if (actx) return;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return;
  actx = new AC();
  master = actx.createGain();
  master.gain.value = 0;
  const comp = actx.createDynamicsCompressor();
  master.connect(comp).connect(actx.destination);
  // a simple synthetic room so every sound shares a space
  verb = actx.createConvolver();
  const len = actx.sampleRate * 2.6,
    ir = actx.createBuffer(2, len, actx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.8);
  }
  verb.buffer = ir;
  const vg = actx.createGain();
  vg.gain.value = 0.32;
  verb.connect(vg).connect(master);
  sfxBus = actx.createGain();
  sfxBus.gain.value = 1;
  sfxBus.connect(master);
  sfxBus.connect(verb);
  // ambient: a warm, slowly changing chord pad with occasional glass notes
  const pf = actx.createBiquadFilter();
  pf.type = "lowpass";
  pf.frequency.value = 650;
  pf.Q.value = 0.4;
  const pad = actx.createGain();
  pad.gain.value = 0.0;
  pf.connect(pad);
  pad.connect(master);
  const ps = actx.createGain();
  ps.gain.value = 0.7;
  pad.connect(ps).connect(verb);
  pad.gain.linearRampToValueAtTime(0.055, actx.currentTime + 4);
  const CH = [
    [110, 261.63, 329.63, 392],
    [87.31, 261.63, 349.23, 440],
    [130.81, 246.94, 329.63, 392],
    [98, 246.94, 293.66, 392],
  ];
  const voices = CH[0].map((f, i) => {
    const g = actx.createGain();
    g.gain.value = i === 0 ? 0.5 : 0.22;
    const o1 = actx.createOscillator(),
      o2 = actx.createOscillator();
    o1.type = "triangle";
    o2.type = "sine";
    o1.frequency.value = f;
    o2.frequency.value = f;
    o2.detune.value = 5 + i * 2;
    o1.detune.value = -4;
    const pan = actx.createStereoPanner ? actx.createStereoPanner() : null;
    o1.connect(g);
    o2.connect(g);
    if (pan) {
      pan.pan.value = [-0.4, 0.3, -0.2, 0.45][i];
      g.connect(pan).connect(pf);
    } else g.connect(pf);
    o1.start();
    o2.start();
    return [o1, o2];
  });
  let ci = 0;
  setInterval(() => {
    ci = (ci + 1) % CH.length;
    const t = actx.currentTime;
    voices.forEach((v, i) => v.forEach((o) => o.frequency.setTargetAtTime(CH[ci][i], t, 2.2)));
  }, 12000);
  const lfo = actx.createOscillator(),
    lg = actx.createGain();
  lfo.frequency.value = 0.035;
  lg.gain.value = 220;
  lfo.connect(lg).connect(pf.frequency);
  lfo.start();
  AMB.filter = pf;
  AMB.pad = pad;
  const sparkle = () => {
    if (soundOn && !document.hidden) {
      const sc = [880, 987.77, 1174.66, 1318.51, 1567.98, 1760];
      const f = sc[(Math.random() * sc.length) | 0];
      SFX.tone(f, { type: "sine", a: 0.04, d: 2.8, peak: 0.012 });
      SFX.tone(f * 2, { type: "sine", a: 0.04, d: 1.4, peak: 0.004 });
    }
    setTimeout(sparkle, 6000 + Math.random() * 7000);
  };
  setTimeout(sparkle, 5000);
  const nb = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate),
    nd = nb.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  SFX.noise = nb;
}
export const SFX = {
  noise: null as AudioBuffer,
  t() {
    return actx.currentTime;
  },
  env(g, a, peak, d) {
    const t = SFX.t();
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
  },
  tone(
    f: number,
    { type = "sine" as OscillatorType, a = 0.005, d = 0.3, peak = 0.06, glide = 0, detune = 0 } = {},
  ) {
    if (!soundOn || !actx) return;
    const o = actx.createOscillator(),
      g = actx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, SFX.t());
    o.detune.value = detune;
    if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(20, f * glide), SFX.t() + a + d);
    o.connect(g).connect(sfxBus);
    SFX.env(g, a, peak, d);
    o.start();
    o.stop(SFX.t() + a + d + 0.05);
  },
  hiss({ a = 0.3, d = 0.6, peak = 0.05, f0 = 300, f1 = 3000, q = 1 } = {}) {
    if (!soundOn || !actx || !SFX.noise) return;
    const s = actx.createBufferSource();
    s.buffer = SFX.noise;
    const f = actx.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = q;
    f.frequency.setValueAtTime(f0, SFX.t());
    f.frequency.exponentialRampToValueAtTime(f1, SFX.t() + a + d * 0.5);
    const g = actx.createGain();
    s.connect(f).connect(g).connect(sfxBus);
    SFX.env(g, a, peak, d);
    s.start();
    s.stop(SFX.t() + a + d + 0.05);
  },
  drop(p = 1) {
    SFX.tone(900 * p, { d: 0.18, peak: 0.07, glide: 0.35 });
    SFX.tone(1800 * p, { d: 0.08, peak: 0.02, glide: 0.5 });
  },
  swell(dur = 1) {
    SFX.hiss({ a: dur * 0.85, d: 0.4, peak: 0.06, f0: 180, f1: 2600, q: 0.8 });
    SFX.tone(55, { type: "sine", a: dur * 0.8, d: 0.6, peak: 0.09, glide: 2 });
  },
  thud() {
    SFX.tone(70, { d: 0.9, peak: 0.14, glide: 0.5 });
    SFX.hiss({ a: 0.005, d: 0.25, peak: 0.03, f0: 400, f1: 120, q: 0.7 });
  },
  glass(i = 0) {
    const sc = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66];
    const f = sc[((i % sc.length) + sc.length) % sc.length];
    SFX.tone(f, { type: "triangle", d: 1.4, peak: 0.035 });
    SFX.tone(f * 2.01, { d: 0.9, peak: 0.012 });
    SFX.tone(f * 3.98, { d: 0.5, peak: 0.006 });
  },
  chord() {
    [261.6, 329.6, 392, 523.3].forEach((f, i) =>
      setTimeout(() => SFX.tone(f, { type: "triangle", a: 0.02, d: 1.8, peak: 0.03 }), i * 60),
    );
  },
  melt() {
    for (let i = 0; i < 6; i++)
      setTimeout(() => SFX.drop(0.6 + Math.random() * 0.9), i * 90 + Math.random() * 60);
  },
  whoosh() {
    SFX.hiss({ a: 0.18, d: 0.35, peak: 0.05, f0: 2500, f1: 300, q: 1.2 });
  },
  tick() {
    SFX.tone(2400 + Math.random() * 600, { d: 0.04, peak: 0.012 });
  },
  coin() {
    SFX.tone(1318, { type: "square", d: 0.08, peak: 0.01 });
    SFX.tone(1760, { type: "triangle", d: 0.35, peak: 0.025 });
  },
};
export function setSound(on) {
  initAudio();
  if (!actx) return;
  soundOn = on;
  actx.resume();
  master.gain.cancelScheduledValues(actx.currentTime);
  master.gain.linearRampToValueAtTime(on ? 0.8 : 0, actx.currentTime + 1.2);
  body.classList.toggle("sound-on", on);
  $$("[data-sound]").forEach((b) => {
    b.setAttribute("aria-pressed", String(on));
    const l = b.querySelector("[data-sound-label]");
    if (l) l.textContent = tr(on ? "Sound on" : "Sound off");
  });
}
export function blip(f = 880, len = 0.25) {
  SFX.tone(f, { d: len, peak: 0.035, glide: 1.4 });
}
document.addEventListener(
  "pointerenter",
  (e) => {
    if (
      soundOn &&
      (e.target as HTMLElement).closest &&
      (e.target as HTMLElement).closest<HTMLElement>(".prow,.door-card,.btn,.jrow")
    )
      SFX.tick();
  },
  true,
);
