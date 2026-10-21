// A small live render of the Director's chrome bust, used for the floating button and the figure beside the chat.

import { clamp, lerp, root } from "../dom";
import { coarse } from "../env";
import { mouse } from "../state";

export const MiniFace = (() => {
  const cv = document.createElement("canvas");
  cv.className = "mini-face";
  cv.setAttribute("aria-hidden", "true");
  let g: WebGLRenderingContext = null,
    prog: WebGLProgram = null;
  const U: Record<string, WebGLUniformLocation> = {};
  const st: Record<string, any> = {
    lx: 0,
    ly: 0,
    blink: 1,
    mouth: 0,
    smile: 0.3,
    wide: 0,
    state: "idle",
    next: 0,
    bt: -1,
    t: 0,
    frame: 0,
    frameT: 0,
    nod: 0,
    nodV: 0,
    roll: 0,
    amp: 0,
    target: null,
  };
  let started = false;
  function start() {
    if (started) return !!prog;
    started = true;
    g = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true });
    if (g) {
      const vs = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
      const fs = `precision highp float;uniform vec2 uRes,uLook;uniform float uTime,uBlink,uMouth,uSmile,uWide,uLight,uFrame,uNod,uRoll;
    float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
    mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
    float smax(float a,float b,float k){return -smin(-a,-b,k);}
float sdEl(vec3 p,vec3 r){float k0=length(p/r);float k1=length(p/(r*r));return k0*(k0-1.)/k1;}
float sdCap(vec3 p,vec3 a,vec3 b,float r){vec3 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h)-r;}
float face(vec3 p){
  p.y+=.12; vec3 q=vec3(abs(p.x),p.y,p.z);
  float d=sdEl(p-vec3(0.,.16,-.06),vec3(.74,.92,.82));
  d=smin(d,sdEl(p-vec3(0.,-.36,.1),vec3(.5,.44,.56)),.24);
  d=smin(d,sdEl(p-vec3(0.,-.62,.2),vec3(.24,.16,.24)),.18);
  d=smin(d,sdEl(q-vec3(.37,-.08,.42),vec3(.24,.18,.24)),.16);
  float sock=sdEl(q-vec3(.29,.13,.62),vec3(.19,.12,.17)); d=smax(d,-sock,.09);
  d=smin(d,sdEl(q-vec3(.28,.3,.63),vec3(.23,.055,.1)),.08);
  float nose=sdCap(p,vec3(0.,.2,.72),vec3(0.,-.1,.93),.065); nose=smin(nose,sdEl(p-vec3(0.,-.13,.88),vec3(.11,.075,.09)),.07);
  nose=smin(nose,sdEl(q-vec3(.07,-.15,.82),vec3(.055,.045,.06)),.04); d=smin(d,nose,.07);
  d=smax(d,-sdEl(q-vec3(.045,-.19,.88),vec3(.022,.016,.03)),.012);
  float mo=uMouth*.075; float sm=uSmile*.05;
  vec3 lp=p; lp.y-=lp.x*lp.x*uSmile*1.3;
  float upl=sdEl(lp-vec3(0.,-.335+mo*.25,.8),vec3(.19,.04,.075)); float lol=sdEl(lp-vec3(0.,-.425-mo,.78),vec3(.165,.048,.075));
  d=smin(d,min(upl,lol),.035);
  d=smax(d,-sdEl(lp-vec3(0.,-.378-mo*.4,.83),vec3(.155-sm*.2,.006+mo,.07)),.015);
  d=smin(d,sdEl(q-vec3(.76,.06,-.05),vec3(.065,.19,.13)),.07);
  d=smin(d,sdCap(p,vec3(0.,-.7,-.12),vec3(0.,-1.2,-.16),.33),.16);
  d=smin(d,sdCap(q,vec3(.18,-1.02,-.16),vec3(.82,-1.36,-.2),.26),.22);
  d=smin(d,sdEl(p-vec3(0.,-1.62,-.18),vec3(1.05,.5,.5)),.28);
  vec3 eo=q-vec3(.29,.13,.585); float eye=length(eo)-.125;
  vec2 lk=uLook*vec2(.06,.05); vec3 pc=vec3((p.x<0.?-.29:.29)+lk.x,.13+lk.y,.705);
  eye=smax(eye,-(length(p-pc)-.045),.01);
  float lid=sdEl(eo,vec3(.142,.142,.142)); float ly=mix(-.16,.07+uWide*.025,clamp(uBlink,0.,1.)); lid=max(lid,-(eo.y-ly)); lid=max(lid,-(eo.z+.02));
  d=min(d,min(eye,lid+.002));
  return d*.9; }

    float map(vec3 p){ p.xy*=rot(uRoll); p.xz*=rot(uLook.x*.45); p.yz*=rot(uLook.y*.28+uNod); return face(p); }
    vec3 nrm(vec3 p){vec2 e=vec2(.002,-.002);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
    vec3 env(vec3 r){ vec3 c=mix(vec3(.03,.035,.06),vec3(.2,.2,.28),smoothstep(-.6,.9,r.y)); c+=vec3(1.6)*pow(max(dot(r,normalize(vec3(-.6,.65,.45))),0.),22.); c+=vec3(.55,.75,1.4)*pow(max(dot(r,normalize(vec3(.85,.15,.35))),0.),8.)*.8; c+=vec3(1.3,.7,.5)*pow(max(dot(r,normalize(vec3(-.2,-.75,.5))),0.),6.)*.45;
      vec3 l=mix(vec3(.55,.55,.62),vec3(1.),smoothstep(-.7,.8,r.y)); l-=vec3(.55)*pow(max(dot(r,normalize(vec3(.8,-.2,.45))),0.),5.); return mix(c,l,uLight); }
    void main(){ vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y; vec3 ro=vec3(0.,mix(-.05,-.5,uFrame),mix(3.4,5.4,uFrame)), rd=normalize(vec3(uv,-1.75)); float t=0.; bool hit=false; vec3 p;
      for(int i=0;i<72;i++){ p=ro+rd*t; float d=map(p); if(d<.0015){hit=true;break;} t+=d; if(t>9.) break; }
      if(!hit){ gl_FragColor=vec4(0.); return; }
      vec3 n=nrm(p), v=-rd, r=reflect(rd,n); float fr=pow(1.-max(dot(n,v),0.),2.5);
      vec3 ir=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fr*1.1+dot(n,vec3(.25,.55,.1))*.5+uTime*.03));
      vec3 col=env(r)*mix(vec3(.88),ir*1.2,.38)+ir*fr*.45;
      float ao=0.,sc=1.; for(int k=1;k<6;k++){ float h=.02+.05*float(k); ao+=(h-map(p+n*h))*sc; sc*=.7; } ao=clamp(1.-ao*3.,0.,1.); col*=mix(1.,ao,.9);
      float fade=smoothstep(-2.15,-1.6,p.y); gl_FragColor=vec4(col*fade,fade); }`;
      const sh = (t: number, s: string) => {
        const o = g.createShader(t);
        g.shaderSource(o, s);
        g.compileShader(o);
        if (!g.getShaderParameter(o, g.COMPILE_STATUS)) console.warn(g.getShaderInfoLog(o));
        return o;
      };
      prog = g.createProgram();
      g.attachShader(prog, sh(g.VERTEX_SHADER, vs));
      g.attachShader(prog, sh(g.FRAGMENT_SHADER, fs));
      g.linkProgram(prog);
      if (!g.getProgramParameter(prog, g.LINK_STATUS)) prog = null;
      else {
        g.useProgram(prog);
        const b = g.createBuffer();
        g.bindBuffer(g.ARRAY_BUFFER, b);
        g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
        const l = g.getAttribLocation(prog, "a");
        g.enableVertexAttribArray(l);
        g.vertexAttribPointer(l, 2, g.FLOAT, false, 0, 0);
        [
          "uRes",
          "uLook",
          "uTime",
          "uBlink",
          "uMouth",
          "uSmile",
          "uWide",
          "uLight",
          "uFrame",
          "uNod",
          "uRoll",
        ].forEach((n) => (U[n] = g.getUniformLocation(prog, n)));
      }
    }
    requestAnimationFrame(frame);
    return !!prog;
  }
  let last = performance.now(),
    skip = 0;
  function frame(now: number) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!prog || !cv.isConnected || document.hidden) return;
    const r = cv.getBoundingClientRect();
    if (!r.width) return;
    if (coarse && skip++ % 2) return;
    st.t += dt;
    const D = Math.min(coarse ? 1.5 : 2, devicePixelRatio || 1),
      w = Math.round(r.width * D),
      h = Math.round(r.height * D);
    if (cv.width !== w || cv.height !== h) {
      cv.width = w;
      cv.height = h;
    }
    const cx = r.left + r.width / 2,
      cy = r.top + r.height * (st.frame > 0.5 ? 0.32 : 0.45);
    let tx, ty;
    if (st.target && st.target.isConnected && st.state === "listen") {
      const tr = st.target.getBoundingClientRect();
      tx = (tr.left + tr.width * 0.5 - cx) / 260;
      ty = -(tr.top + tr.height * 0.5 - cy) / 260;
    } else {
      tx = (mouse.x - cx) / 240;
      ty = -(mouse.y - cy) / 240;
      if (!mouse.active) {
        tx = 0;
        ty = 0;
      }
    }
    const l = Math.hypot(tx, ty);
    if (l > 1) {
      tx /= l;
      ty /= l;
    }
    if (st.state === "think") {
      tx = 0.6 + Math.sin(st.t * 0.8) * 0.1;
      ty = 0.65;
    }
    st.lx = lerp(st.lx, tx, 0.1);
    st.ly = lerp(st.ly, ty, 0.1);
    if (now > st.next) {
      st.bt = now;
      st.next = now + 2200 + Math.random() * 3600;
    }
    const bk = st.bt > 0 ? clamp((now - st.bt) / 160, 0, 1) : 1;
    st.blink = st.bt > 0 && bk < 1 ? 1 - Math.sin(bk * Math.PI) : 1;
    const speak = st.state === "speak";
    st.amp = lerp(st.amp, speak ? 1 : 0, 0.06);
    const sm = speak ? 0.45 : st.state === "think" ? -0.15 : st.state === "listen" ? 0.4 : 0.25;
    st.smile = lerp(st.smile, sm, 0.08);
    st.wide =
      lerp(st.wide, st.state === "listen" ? 1 : st.state === "think" ? 0.6 : 0, 0.08) +
      (speak ? Math.max(0, Math.sin(st.t * 2.3)) * 0.25 * st.mouth : 0);
    st.mouth = lerp(st.mouth, 0, 1 - Math.pow(0.0005, dt));
    st.nodV += (-st.nod * 90 - st.nodV * 12) * dt;
    st.nod += st.nodV * dt;
    const sway = Math.sin(st.t * 1.2) * 0.04 * st.amp + Math.sin(st.t * 0.5) * 0.02;
    st.roll = lerp(st.roll, st.state === "think" ? 0.12 : sway, 0.05);
    st.frame = lerp(st.frame, st.frameT, 0.08);
    g.viewport(0, 0, w, h);
    g.clearColor(0, 0, 0, 0);
    g.clear(g.COLOR_BUFFER_BIT);
    g.uniform2f(U.uRes, w, h);
    g.uniform2f(U.uLook, st.lx, st.ly);
    g.uniform1f(U.uTime, st.t);
    g.uniform1f(U.uBlink, st.blink);
    g.uniform1f(U.uMouth, Math.min(1, st.mouth));
    g.uniform1f(U.uSmile, st.smile);
    g.uniform1f(U.uWide, st.wide);
    g.uniform1f(U.uLight, root.dataset.theme === "light" ? 1 : 0);
    g.uniform1f(U.uFrame, st.frame);
    g.uniform1f(U.uNod, st.nod);
    g.uniform1f(U.uRoll, st.roll);
    g.drawArrays(g.TRIANGLES, 0, 3);
  }
  return {
    el: cv,
    start,
    ok: () => !!prog,
    state(s: string) {
      st.state = s;
    },
    mouth(v: number) {
      st.mouth = Math.max(st.mouth, v);
      if (Math.random() < 0.35) st.nodV += 0.6;
    },
    nod(k = 1) {
      st.nodV += 1.6 * k;
    },
    poke() {
      st.bt = performance.now();
      st.nodV -= 2.2;
    },
    frameTo(f: number, instant?: boolean) {
      st.frameT = f;
      if (instant) st.frame = f;
    },
    lookAt(el: HTMLElement) {
      st.target = el;
    },
  };
})();
