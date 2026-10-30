import * as THREE from "three";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { $, clamp, fonts, lerp, smoothstep } from "../dom";
import { gsap, lowEnd, coarse, reduce } from "../env";
import { mouse, scene } from "../state";
import { BLUR, BRIGHT, COMP, FLOW, RAY, VERT } from "./shaders";

export function initGL() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: $("#gl") as HTMLCanvasElement,
      antialias: false,
      alpha: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
  } catch (e) {
    return null;
  }
  if (!renderer.getContext()) return null;
  const DPR = Math.min(devicePixelRatio || 1, lowEnd ? 1.5 : 2);
  renderer.setPixelRatio(DPR);
  const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const tri = new THREE.BufferGeometry();
  tri.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3),
  );
  const mkPass = (
    frag: string,
    uniforms: Record<string, THREE.IUniform>,
    defines?: Record<string, number>,
  ) => {
    const m = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: frag,
      uniforms,
      defines: defines || {},
      depthTest: false,
      depthWrite: false,
    });
    const sc = new THREE.Scene();
    const me = new THREE.Mesh(tri, m);
    me.frustumCulled = false;
    sc.add(me);
    return { sc, m };
  };
  const rtOpts = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: false,
    stencilBuffer: false,
  };
  let quality = lowEnd ? 0.55 : 1;
  const maxPx = lowEnd ? 380000 : 1300000;
  const sceneRT = new THREE.WebGLRenderTarget(4, 4, rtOpts);
  let flowA = new THREE.WebGLRenderTarget(128, 128, rtOpts),
    flowB = new THREE.WebGLRenderTarget(128, 128, rtOpts);
  const V2 = (x = 0, y = 0) => new THREE.Vector2(x, y);
  const ray = mkPass(
    RAY,
    {
      uRes: { value: V2() },
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uScale: { value: 0.42 },
      uIntro: { value: 0 },
      uJoin: { value: 0 },
      uSpin: { value: 0 },
      uGather: { value: 3.5 },
      uBurst: { value: 0 },
      uLight: { value: 0 },
      uVel: { value: 0 },
      uText: { value: 0 },
      uMelt: { value: 0 },
      uLens: { value: 0 },
      uDropY: { value: 4 },
      uDropR: { value: 0 },
      uHold: { value: 0 },
      uLook: { value: V2() },
      uBlink: { value: 1 },
      uMouth: { value: 0 },
      uSmile: { value: 0.3 },
      uWide: { value: 0 },
      uReduce: { value: reduce ? 1 : 0 },
      tTitle: { value: null },
      tEnv: { value: null },
      uPos: { value: V2() },
      uMouse: { value: V2(9, 9) },
      uTilt: { value: V2() },
      uTint: { value: new THREE.Vector3(1, 1, 1) },
      uTintAmt: { value: 0 },
    },
    { STEPS: lowEnd ? 40 : 48 },
  );
  const flow = mkPass(FLOW, {
    tPrev: { value: null },
    uM: { value: V2(-1, -1) },
    uV: { value: V2() },
    uAsp: { value: 1 },
    uDiss: { value: 0.955 },
    uSp: { value: 0 },
    uSpR: { value: 0 },
    uSpC: { value: V2(0.5, 0.5) },
  });
  const bRT1 = new THREE.WebGLRenderTarget(4, 4, rtOpts),
    bRT2 = new THREE.WebGLRenderTarget(4, 4, rtOpts);
  const bright = mkPass(BRIGHT, { tSrc: { value: sceneRT.texture }, uTx: { value: V2() } }),
    blur = mkPass(BLUR, { tSrc: { value: null }, uDir: { value: V2() } });
  const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  blank.needsUpdate = true;
  const titleCv = document.createElement("canvas"),
    menuCv = document.createElement("canvas");
  const nameCv = document.createElement("canvas");
  const nameTex = new THREE.CanvasTexture(nameCv);
  nameTex.minFilter = THREE.LinearFilter;
  nameTex.generateMipmaps = false;
  const titleTex = new THREE.CanvasTexture(titleCv),
    menuTex = new THREE.CanvasTexture(menuCv);
  [titleTex, menuTex].forEach((t) => {
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
  });
  const comp = mkPass(COMP, {
    tScene: { value: sceneRT.texture },
    tFlow: { value: flowA.texture },
    tP: { value: blank },
    tK: { value: blank },
    uPR: { value: new THREE.Vector4() },
    uKR: { value: new THREE.Vector4() },
    uRes: { value: V2() },
    uPTex: { value: V2(4, 5) },
    uKTex: { value: V2(4, 5) },
    uKVel: { value: V2() },
    uGlowPos: { value: V2(0.5, 0.5) },
    uTime: { value: 0 },
    uPA: { value: 0 },
    uKA: { value: 0 },
    uDim: { value: 1 },
    uIntro: { value: 0 },
    uHover: { value: 0 },
    uLight: { value: 0 },
    uVel: { value: 0 },
    uFront: { value: 0 },
    uBgA: { value: 1 },
    uCover: { value: 0 },
    uLens: { value: 0 },
    uLensR: { value: 0.2 },
    uLensC: { value: V2(0.5, 0.5) },
    tMenu: { value: null },
    uMenuLens: { value: 0 },
    tName: { value: null },
    uNR: { value: new THREE.Vector4() },
    uRows: { value: V2() },
    uNameA: { value: 0 },
    uNameDiff: { value: 1 },
    uFg: { value: new THREE.Vector3(0.93, 0.92, 0.95) },
    tBloom: { value: null },
    uBloom: { value: lowEnd ? 0.5 : 0.85 },
    tSpace: { value: null },
    uSpace: { value: 0 },
    uCA: { value: 1 },
    uSpClip: { value: V2(0, 1) },
    uStars: { value: 0 },
    uTint: { value: new THREE.Vector3(1, 1, 1) },
    uTintAmt: { value: 0 },
  });
  [flowA, flowB].forEach((rt) => {
    renderer.setRenderTarget(rt);
    renderer.setClearColor(new THREE.Color(0.5, 0.5, 0), 1);
    renderer.clear();
  });
  renderer.setRenderTarget(null);
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  const prep = (t) => {
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    if (THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const pTex = new Promise<void>((res) =>
    loader.load(
      profile.portrait,
      (t) => {
        prep(t);
        comp.m.uniforms.tP.value = t;
        comp.m.uniforms.uPTex.value.set(t.image.width, t.image.height);
        res();
      },
      undefined,
      () => res(),
    ),
  );
  // project textures: a generated tile right away, replaced by the real cover when it arrives
  const tile = (p) => {
    const c = document.createElement("canvas");
    c.width = 420;
    c.height = 525;
    const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 420, 525);
    g.addColorStop(0, p.colors[0]);
    g.addColorStop(1, p.colors[1]);
    x.fillStyle = g;
    x.fillRect(0, 0, 420, 525);
    x.globalAlpha = 0.18;
    for (let i = 0; i < 14; i++) {
      x.beginPath();
      x.arc(210, 262, 40 + i * 22, 0, Math.PI * 2);
      x.strokeStyle = "#fff";
      x.stroke();
    }
    x.globalAlpha = 1;
    x.fillStyle = "rgba(255,255,255,.95)";
    x.font = `600 44px ${fonts.display()}`;
    x.fillText(p.title.length > 11 ? p.title.slice(0, 10) + "…" : p.title, 28, 470);
    x.font = `400 18px ${fonts.text()}`;
    x.fillStyle = "rgba(255,255,255,.75)";
    x.fillText(p.subtitle.slice(0, 36), 30, 500);
    return prep(new THREE.CanvasTexture(c));
  };
  const kTex = projects.map(() => null);
  const getK = (i) => {
    if (kTex[i]) return kTex[i];
    const p = projects[i];
    kTex[i] = tile(p);
    if (p.cover)
      loader.load(
        p.cover,
        (t) => {
          kTex[i] = prep(t);
          if (kIdx === i) comp.m.uniforms.tK.value = t;
        },
        undefined,
        () => {},
      );
    return kTex[i];
  };
  // ---- Space: the project index as a flight through floating cards
  const SPC = {
    on: false,
    p: 0,
    vel: 0,
    a: 0,
    vis: 0,
    clip: null as [number, number] | null,
    hover: -1,
    filter: "all",
    N: projects.length,
    gap: 2.7,
  };
  const spScene = new THREE.Scene(),
    spCam = new THREE.PerspectiveCamera(38, 1, 0.1, 100),
    spRT = new THREE.WebGLRenderTarget(4, 4, rtOpts);
  const spGeo = new THREE.PlaneGeometry(1.6, 1, 24, 12);
  const spVS = `varying vec2 vUv;uniform float uBend,uHover,uTime;void main(){vUv=uv;vec3 p=position;p.z+=sin(uv.x*3.14159)*uBend+sin(uv.y*3.14159)*uHover*.1;p.y+=sin(uv.x*6.+uTime)*.01*uHover;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
  const spFS = `precision highp float;varying vec2 vUv;uniform sampler2D tMap;uniform vec2 uTex;uniform float uA,uHover;
    void main(){ float rb=1.6,rt=uTex.x/max(uTex.y,1.);vec2 s=rb>rt?vec2(1.,rt/rb):vec2(rb/rt,1.);vec2 uv=(vUv-.5)*s+.5;uv.y=mix(uv.y,1.-(1.-uv.y)*.9,0.);
      vec2 q=abs(vUv-.5)*vec2(1.6,1.)-vec2(.8,.5)+.06; float d=length(max(q,0.))-.06; float m=smoothstep(.004,-.004,d);
      vec3 c=texture2D(tMap,uv).rgb*(.82+.25*uHover); float rim=smoothstep(.0,-.02,d)-smoothstep(-.02,-.04,d); c+=vec3(.7,.85,1.)*rim*uHover*.6;
      float a=m*uA; gl_FragColor=vec4(c*a,a); }`;
  const spMeshes = projects.map((p, i) => {
    const m = new THREE.Mesh(
      spGeo,
      new THREE.ShaderMaterial({
        uniforms: {
          tMap: { value: null },
          uTex: { value: V2(16, 10) },
          uA: { value: 1 },
          uBend: { value: 0 },
          uHover: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: spVS,
        fragmentShader: spFS,
        transparent: true,
        depthWrite: false,
        premultipliedAlpha: true,
      }),
    );
    const side = i % 2 ? 1 : -1;
    m.position.set(side * (0.95 + 0.35 * Math.sin(i * 1.7)), Math.sin(i * 1.9) * 0.5, -i * SPC.gap);
    m.rotation.y = -side * 0.22;
    m.userData = { i, base: m.position.clone(), h: 0 };
    spScene.add(m);
    return m;
  });
  const ray3 = new THREE.Raycaster(),
    ndc = new THREE.Vector2();
  function spaceRender(dt) {
    const N = SPC.N,
      zEnd = -(N - 1) * SPC.gap;
    const camZ = 3.2 + SPC.p * (zEnd - 1.4);
    spCam.position.z = lerp(spCam.position.z, camZ, 1 - Math.pow(0.004, dt));
    spCam.position.x = lerp(spCam.position.x, (mouse.x / W - 0.5) * 0.5, 0.05);
    spCam.position.y = lerp(spCam.position.y, -(mouse.y / H - 0.5) * 0.3, 0.05);
    spCam.lookAt(spCam.position.x * 0.4, spCam.position.y * 0.4, spCam.position.z - 6);
    spCam.aspect = W / H;
    const cl = SPC.clip || [0, H];
    const cy = (Math.max(cl[0], 0) + Math.min(cl[1], H)) / 2;
    spCam.setViewOffset(W, H, 0, -(cy - H / 2), W, H);
    spCam.updateProjectionMatrix();
    ndc.set((mouse.x / W) * 2 - 1, -(mouse.y / H) * 2 + 1);
    ray3.setFromCamera(ndc, spCam);
    const hits = mouse.active ? ray3.intersectObjects(spMeshes) : [];
    SPC.hover = hits.length ? hits[0].object.userData.i : -1;
    spMeshes.forEach((m) => {
      const u = m.material.uniforms,
        i = m.userData.i,
        dz = m.position.z - spCam.position.z,
        p = projects[i];
      const vis = smoothstep(-14, -6, dz) * (1 - smoothstep(-0.6, 0.4, dz));
      const ok = SPC.filter === "all" || p.type === SPC.filter;
      m.userData.h = lerp(m.userData.h, SPC.hover === i ? 1 : 0, 0.12);
      u.uHover.value = m.userData.h;
      u.uA.value = vis * (ok ? 1 : 0.12) * SPC.a;
      u.uBend.value = clamp(SPC.vel * 0.012, -0.35, 0.35);
      u.uTime.value += dt;
      const t = getK(i);
      u.tMap.value = t;
      if (t && t.image && t.image.width) u.uTex.value.set(t.image.width, t.image.height);
      const s = 1 + m.userData.h * 0.08;
      m.scale.set(s, s, 1);
      m.position.x = m.userData.base.x + Math.sin(performance.now() * 0.0004 + i) * 0.04;
    });
    renderer.setRenderTarget(spRT);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(spScene, spCam);
  }
  let kIdx = -1,
    kA = 0,
    kTarget = 0,
    kx = innerWidth / 2,
    ky = innerHeight / 2,
    kvx = 0,
    kvy = 0;
  document.addEventListener("pointerover", (e) => {
    if (coarse) return;
    const r =
      (e.target as HTMLElement).closest && (e.target as HTMLElement).closest<HTMLElement>("[data-peek]");
    if (r) {
      kIdx = +r.dataset.peek;
      comp.m.uniforms.tK.value = getK(kIdx);
      kTarget = 1;
    }
  });
  let pHover = 0;
  document.addEventListener("pointerover", (e) => {
    pHover =
      (e.target as HTMLElement).closest && (e.target as HTMLElement).closest<HTMLElement>("#pSlot") ? 1 : 0;
  });
  let W = 0,
    H = 0,
    prevX = mouse.x,
    prevY = mouse.y;
  let faceHi = false;
  function resize() {
    W = innerWidth;
    H = innerHeight;
    renderer.setSize(W, H, false);
    const full = W * H * DPR * DPR;
    const mp = faceHi && !lowEnd ? 2400000 : maxPx;
    const sc = Math.min(1, Math.sqrt(mp / full)) * quality;
    const rw = Math.max(2, Math.round(W * DPR * sc)),
      rh = Math.max(2, Math.round(H * DPR * sc));
    sceneRT.setSize(rw, rh);
    spRT.setSize(Math.round(W * Math.min(DPR, 1.5)), Math.round(H * Math.min(DPR, 1.5)));
    const bw = Math.max(2, Math.round(W / 4)),
      bh = Math.max(2, Math.round(H / 4));
    bRT1.setSize(bw, bh);
    bRT2.setSize(bw, bh);
    bright.m.uniforms.uTx.value.set(1 / rw, 1 / rh);
    ray.m.uniforms.uRes.value.set(rw, rh);
    comp.m.uniforms.uRes.value.set(W, H);
    flow.m.uniforms.uAsp.value = W / H;
  }
  resize();
  addEventListener("resize", resize);
  let isReady = false;
  const ready = Promise.all([
    renderer.compileAsync(ray.sc, cam),
    renderer.compileAsync(flow.sc, cam),
    renderer.compileAsync(bright.sc, cam),
    renderer.compileAsync(blur.sc, cam),
    renderer.compileAsync(comp.sc, cam),
    renderer.compileAsync(spScene, spCam),
  ]).then(() => {
    isReady = true;
  });
  const st = {
    morph: 0,
    u: 0.5,
    v: 0.46,
    s: 0.36,
    dim: 1,
    intro: 0,
    introT: 0.12,
    tiltX: 0,
    tiltY: 0,
    spin: 0,
    pa: 0,
    join: 0,
    gather: 3.5,
    light: document.documentElement.dataset.theme === "light" ? 1 : 0,
    tint: new THREE.Vector3(1, 1, 1),
    tintAmt: 0,
    burst: 0,
  };
  let frames = 0,
    acc = 0;
  const api = {
    pTex,
    ready,
    get isReady() {
      return isReady;
    },
    st,
    override: null,
    drive: null,
    isFront: false,
    bgA: 0,
    cover: 0,
    emboss: 0,
    melt: 0,
    lens: 0,
    menuLens: 0,
    stars: false,
    vel: 0,
    heroLens: 0,
    heroLensT: 0,
    nameA: 0,
    nameEl: null,
    rows: [0, 0],
    pulse: 0,
    hold: 0,
    holdOn: false,
    setName(el, draw) {
      const r = el.getBoundingClientRect(),
        D = Math.min(devicePixelRatio || 1, 2);
      nameCv.width = Math.round(r.width * D);
      nameCv.height = Math.round(r.height * D);
      const x = nameCv.getContext("2d");
      x.setTransform(D, 0, 0, D, 0, 0);
      x.clearRect(0, 0, r.width, r.height);
      draw(x, r);
      nameTex.needsUpdate = true;
      comp.m.uniforms.tName.value = nameTex;
      api.nameEl = el;
    },
    splash(x, y) {
      const F = flow.m.uniforms;
      F.uSpC.value.set(x, 1 - y);
      const o = { r: 0, s: 0.9 };
      gsap.to(o, {
        r: 0.45,
        s: 0,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => {
          F.uSpR.value = o.r;
          F.uSp.value = o.s;
        },
      });
    },
    space: SPC,
    face: {
      lx: 0,
      ly: 0,
      blink: 1,
      mouth: 0,
      smile: 0.3,
      wide: 0,
      state: "idle",
      next: 0,
      bt: -1,
      on: false,
    },
    spaceRect(i) {
      const m = spMeshes[i];
      const v = new THREE.Vector3();
      const pts = [
        [-0.8, -0.5],
        [0.8, -0.5],
        [0.8, 0.5],
        [-0.8, 0.5],
      ].map(([x, y]) => {
        v.set(x, y, 0).applyMatrix4(m.matrixWorld).project(spCam);
        return [((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H];
      });
      const xs = pts.map((p) => p[0]),
        ys = pts.map((p) => p[1]);
      return {
        l: Math.min(...xs),
        t: Math.min(...ys),
        w: Math.max(...xs) - Math.min(...xs),
        h: Math.max(...ys) - Math.min(...ys),
        r: 12,
      };
    },
    drop(y, r) {
      ray.m.uniforms.uDropY.value = y;
      ray.m.uniforms.uDropR.value = r;
    },
    setTitle(txt) {
      const W = 1400,
        H = Math.round((1400 * innerHeight) / innerWidth);
      titleCv.width = W;
      titleCv.height = H;
      const x = titleCv.getContext("2d");
      x.fillStyle = "#000";
      x.fillRect(0, 0, W, H);
      const words = txt.split(" ");
      let size = Math.min(W * 0.2, H * 0.36),
        lines = [txt];
      const fit = () => {
        x.font = `700 ${size}px ${fonts.display()}`;
        lines = [];
        let cur = "";
        words.forEach((w) => {
          const t = cur ? cur + " " + w : w;
          if (x.measureText(t).width > W * 0.84 && cur) {
            lines.push(cur);
            cur = w;
          } else cur = t;
        });
        lines.push(cur);
        return lines.length * size * 0.95 < H * 0.7 && lines.every((l) => x.measureText(l).width <= W * 0.86);
      };
      while (!fit() && size > 30) size *= 0.9;
      try {
        x.letterSpacing = -size * 0.05 + "px";
      } catch (e) {}
      x.textAlign = "center";
      x.textBaseline = "middle";
      x.fillStyle = "#fff";
      const y0 = H / 2 - ((lines.length - 1) * size * 0.95) / 2;
      x.filter = "blur(9px)";
      lines.forEach((l, i) => x.fillText(l, W / 2, y0 + i * size * 0.95));
      x.filter = "blur(2px)";
      x.globalAlpha = 0.6;
      lines.forEach((l, i) => x.fillText(l, W / 2, y0 + i * size * 0.95));
      x.globalAlpha = 1;
      x.filter = "none";
      titleTex.needsUpdate = true;
      ray.m.uniforms.tTitle.value = titleTex;
    },
    setMenuTex(draw) {
      const D = Math.min(devicePixelRatio || 1, 2);
      menuCv.width = Math.round(innerWidth * D);
      menuCv.height = Math.round(innerHeight * D);
      const x = menuCv.getContext("2d");
      x.setTransform(D, 0, 0, D, 0, 0);
      x.clearRect(0, 0, innerWidth, innerHeight);
      draw(x);
      menuTex.needsUpdate = true;
      comp.m.uniforms.tMenu.value = menuTex;
    },
    front(v) {
      api.isFront = v;
      document.body.classList.toggle("gl-front", v);
    },
    gatherTarget: 3.5,
    tintTarget: null,
    lightTarget: st.light,
    setIntro(v) {
      st.introT = v;
    },
    burst() {
      st.burst = 1;
    },
    setTint(hex) {
      if (!hex) {
        api.tintTarget = null;
        return;
      }
      const c = new THREE.Color(hex);
      api.tintTarget = [c.r, c.g, c.b];
    },
    setLight(v, instant) {
      api.lightTarget = v;
      if (instant) st.light = v;
    },
    snap() {
      st.morph = scene.m;
      st.u = scene.u;
      st.v = scene.v;
      st.s = scene.s;
    },
    render(dt) {
      const U = ray.m.uniforms,
        C = comp.m.uniforms,
        e = 1 - Math.pow(0.02, dt),
        o = api.override || scene;
      st.intro = lerp(st.intro, st.introT, 1 - Math.pow(0.2, dt));
      U.uIntro.value = smoothstep(0, 1, st.intro);
      C.uIntro.value = st.intro;
      st.gather = lerp(st.gather, api.gatherTarget, 1 - Math.pow(0.08, dt));
      U.uGather.value = st.gather;
      st.burst = lerp(st.burst, 0, 1 - Math.pow(0.15, dt));
      U.uBurst.value = st.burst;
      if (api.drive) {
        const d = api.drive;
        st.morph = d.m;
        st.u = d.u;
        st.v = d.v;
        st.s = d.s;
        st.dim = d.dim ?? 1;
      } else {
        st.morph = lerp(st.morph, o.m, e * 0.9);
        st.u = lerp(st.u, o.u, e);
        st.v = lerp(st.v, o.v, e);
        st.s = lerp(st.s, o.s, e);
        st.dim = lerp(st.dim, o.dim, e);
      }
      C.uFront.value = api.isFront ? 1 : 0;
      C.uBgA.value = api.bgA;
      C.uCover.value = api.cover;
      api.heroLens = lerp(api.heroLens, api.heroLensT, 1 - Math.pow(0.05, dt));
      const lensV = Math.max(api.lens, api.heroLens);
      ray.m.uniforms.uText.value = api.emboss;
      ray.m.uniforms.uMelt.value = api.melt;
      ray.m.uniforms.uLens.value = lensV;
      C.uLens.value = lensV;
      C.uMenuLens.value = api.lens > api.heroLens ? 1 : 0;
      api.pulse = lerp(api.pulse, 0, 1 - Math.pow(0.02, dt));
      C.uCA.value = lerp(C.uCA.value, api.face.on ? 0 : 1, 0.08);
      if (api.face.on !== faceHi) {
        faceHi = api.face.on;
        resize();
      }
      {
        const F = api.face,
          now = performance.now();
        let tx = (mouse.x / W - st.u) * 2.2,
          ty = -(mouse.y / H - st.v) * 2.2;
        const l = Math.hypot(tx, ty);
        if (l > 1) {
          tx /= l;
          ty /= l;
        }
        if (F.state === "think") {
          tx = 0.75;
          ty = 0.65;
        }
        if (!mouse.active) {
          tx = 0;
          ty = 0;
        }
        F.lx = lerp(F.lx, tx, 0.14);
        F.ly = lerp(F.ly, ty, 0.14);
        if (now > F.next) {
          F.bt = now;
          F.next = now + 2200 + Math.random() * 4200;
        }
        const bk = F.bt > 0 ? clamp((now - F.bt) / 170, 0, 1) : 1;
        F.blink = F.bt > 0 && bk < 1 ? 1 - Math.sin(bk * Math.PI) * 0.95 : 1;
        const sm =
          F.state === "speak"
            ? 0.55
            : F.state === "think"
              ? -0.1
              : F.state === "listen" || F.state === "happy"
                ? 0.52
                : 0.38;
        F.smile = lerp(F.smile, sm, 0.06);
        F.wide = lerp(F.wide, F.state === "listen" ? 1 : 0, 0.08);
        F.mouth = lerp(F.mouth, 0, 1 - Math.pow(0.004, dt));
        U.uLook.value.set(F.lx, F.ly + Math.sin(performance.now() * 0.009) * F.mouth * 0.07);
        U.uBlink.value = F.blink;
        U.uMouth.value = F.mouth;
        U.uSmile.value = F.smile;
        U.uWide.value = F.wide;
      }
      if (api.nameEl && api.nameEl.isConnected && !document.body.classList.contains("menu-full")) {
        const r = api.nameEl.getBoundingClientRect();
        C.uNR.value.set(r.left / W, 1 - r.bottom / H, r.width / W, r.height / H);
        C.uRows.value.set(api.rows[0] / r.width, api.rows[1] / r.width);
        C.uNameA.value = api.nameA;
      } else C.uNameA.value = 0;
      C.uNameDiff.value = st.light > 0.5 ? 0 : 1;
      {
        const fg = st.light > 0.5 ? [0.043, 0.047, 0.07] : [0.925, 0.92, 0.95];
        C.uFg.value.set(fg[0], fg[1], fg[2]);
      }
      st.join = lerp(st.join, scene.join, e);
      st.spin = lerp(st.spin, (scene.spin || 0) * Math.PI * 3, e);
      st.light = lerp(st.light, api.lightTarget, 1 - Math.pow(0.001, dt));
      U.uLight.value = st.light;
      C.uLight.value = st.light;
      const tt = api.tintTarget;
      st.tintAmt = lerp(st.tintAmt, tt ? 1 : 0, e);
      if (tt) st.tint.set(lerp(st.tint.x, tt[0], e), lerp(st.tint.y, tt[1], e), lerp(st.tint.z, tt[2], e));
      U.uTint.value.copy(st.tint);
      C.uTint.value.copy(st.tint);
      U.uTintAmt.value = st.tintAmt;
      C.uTintAmt.value = st.tintAmt;
      const asp = W / H,
        K = 3.125;
      const wx = (st.u - 0.5) * asp * K,
        wy = (0.5 - st.v) * K;
      U.uTime.value += dt * (reduce ? 0.25 : 1);
      C.uTime.value = U.uTime.value;
      U.uMorph.value = st.morph;
      U.uVel.value = C.uVel.value;
      U.uScale.value = st.s * (1 + api.pulse * 0.14);
      U.uPos.value.set(wx, wy);
      U.uJoin.value = st.join;
      U.uSpin.value = st.spin;
      const nx = mouse.x / W - 0.5,
        ny = mouse.y / H - 0.5;
      st.tiltX = lerp(st.tiltX, nx * 0.9, e * 0.5);
      st.tiltY = lerp(st.tiltY, ny * 0.6, e * 0.5);
      U.uTilt.value.set(st.tiltX, st.tiltY);
      U.uMouse.value.set(
        mouse.active ? (nx * asp * K - wx) / st.s : 9,
        mouse.active ? (-ny * K - wy) / st.s : 9,
      );
      C.uVel.value = lerp(C.uVel.value, clamp(api.vel || 0, -30, 30) / 10, 0.15);
      C.uDim.value = st.dim;
      C.uGlowPos.value.set(st.u, 1 - st.v);
      C.uLensC.value.set(st.u, 1 - st.v);
      C.uLensR.value = (st.s * 0.98) / K;
      const vx = (mouse.x - prevX) / W,
        vy = -(mouse.y - prevY) / H;
      prevX = mouse.x;
      prevY = mouse.y;
      flow.m.uniforms.tPrev.value = flowA.texture;
      flow.m.uniforms.uM.value.set(mouse.x / W, 1 - mouse.y / H);
      flow.m.uniforms.uV.value.set(clamp(vx * 9, -1, 1), clamp(vy * 9, -1, 1));
      renderer.setRenderTarget(flowB);
      renderer.render(flow.sc, cam);
      [flowA, flowB] = [flowB, flowA];
      C.tFlow.value = flowA.texture;
      const slot = $("#pSlot");
      if (slot && !document.body.classList.contains("menu-full")) {
        const r = slot.getBoundingClientRect();
        C.uPR.value.set(r.left / W, 1 - r.bottom / H, r.width / W, r.height / H);
        st.pa = lerp(st.pa, document.body.classList.contains("ready") ? 1.6 : 0, 1 - Math.pow(0.35, dt));
      } else st.pa = 0;
      C.uPA.value = st.pa;
      C.uHover.value = lerp(C.uHover.value, pHover, e);
      if (kTarget > 0) {
        const el = document.elementFromPoint(mouse.x, mouse.y);
        if (!el || !el.closest<HTMLElement>("[data-peek]")) kTarget = 0;
      }
      kA = lerp(kA, kTarget, 1 - Math.pow(0.004, dt));
      C.uKA.value = kA < 0.01 ? 0 : kA;
      const pkw = Math.min(340, W * 0.24),
        pkh = pkw * 1.25;
      const nkx = lerp(kx, mouse.x, 1 - Math.pow(0.001, dt)),
        nky = lerp(ky, mouse.y, 1 - Math.pow(0.001, dt));
      kvx = lerp(kvx, ((nkx - kx) / W) * 6, 0.2);
      kvy = lerp(kvy, (-(nky - ky) / H) * 6, 0.2);
      kx = nkx;
      ky = nky;
      C.uKR.value.set((kx + 30) / W, 1 - (ky + pkh * 0.5) / H, pkw / W, pkh / H);
      C.uKVel.value.set(clamp(kvx, -1, 1), clamp(kvy, -1, 1));
      if (kIdx >= 0) {
        const tx = C.tK.value;
        if (tx && tx.image && tx.image.width) C.uKTex.value.set(tx.image.width, tx.image.height);
      }
      api.hold = lerp(api.hold, api.holdOn ? kA : 0, 0.1);
      U.uHold.value = api.hold;
      U.tEnv.value = C.tK.value;
      SPC.a = lerp(SPC.a, SPC.on ? SPC.vis || 0 : 0, 1 - Math.pow(0.002, dt));
      if (SPC.a > 0.01) {
        spaceRender(dt);
        C.tSpace.value = spRT.texture;
      }
      C.uSpace.value = SPC.a > 0.01 ? SPC.a : 0;
      {
        const cl = SPC.clip || [0, H];
        C.uSpClip.value.set(1 - Math.min(cl[1], H) / H, 1 - Math.max(cl[0], 0) / H);
      }
      C.uStars.value = lerp(C.uStars.value, api.stars ? 1 : 0, 0.02);
      renderer.setRenderTarget(sceneRT);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(ray.sc, cam);
      bright.m.uniforms.tSrc.value = sceneRT.texture;
      renderer.setRenderTarget(bRT1);
      renderer.render(bright.sc, cam);
      blur.m.uniforms.tSrc.value = bRT1.texture;
      blur.m.uniforms.uDir.value.set(1 / bRT1.width, 0);
      renderer.setRenderTarget(bRT2);
      renderer.render(blur.sc, cam);
      blur.m.uniforms.tSrc.value = bRT2.texture;
      blur.m.uniforms.uDir.value.set(0, 1 / bRT1.height);
      renderer.setRenderTarget(bRT1);
      renderer.render(blur.sc, cam);
      C.tBloom.value = bRT1.texture;
      renderer.setRenderTarget(null);
      renderer.setClearColor(0x000000, 0);
      renderer.render(comp.sc, cam);
      frames++;
      acc += dt;
      if (acc > 1.2) {
        const fps = frames / acc;
        frames = 0;
        acc = 0;
        if (fps < 42 && quality > 0.4) {
          quality = Math.max(0.4, quality * 0.78);
          resize();
        } else if (fps > 58 && quality < (lowEnd ? 0.7 : 1)) {
          quality = Math.min(lowEnd ? 0.7 : 1, quality * 1.1);
          resize();
        }
      }
    },
  };
  return api;
}

export type GLApi = ReturnType<typeof initGL>;
