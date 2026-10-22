// The compact Director renderer. Geometry and chrome/decal shading are shared with the main GL scene.

import { clamp, lerp, root } from "../dom";
import { coarse, reduce } from "../env";
import { SPIRIT_GLSL } from "../gl/spirit";
import { mouse } from "../state";

export const MiniFace = (() => {
  const cv = document.createElement("canvas");
  cv.className = "mini-face";
  cv.setAttribute("aria-hidden", "true");
  let g: WebGLRenderingContext = null,
    prog: WebGLProgram = null;
  const U: Record<string, WebGLUniformLocation> = {};
  const st = {
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
    target: null as HTMLElement | null,
  };
  let started = false,
    last = performance.now(),
    skip = 0;

  function start() {
    if (started) return !!prog;
    started = true;
    g = cv.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: true });
    if (!g) return false;
    const vs = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
    const fs = `precision highp float;uniform vec2 uRes,uLook;uniform float uTime,uBlink,uMouth,uSmile,uWide,uLight,uFrame,uNod,uRoll,uReduce;
${SPIRIT_GLSL}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float map(vec3 p){p.xy*=rot(uRoll);p.yz*=rot(uNod);return spiritSdf(p);}
vec3 nrm(vec3 p){vec2 e=vec2(.002,-.002);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
void main(){vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;vec3 ro=vec3(0.,0.,mix(3.15,4.5,uFrame)),rd=normalize(vec3(uv,-1.72));float t=0.;bool hit=false;vec3 p;
for(int i=0;i<48;i++){p=ro+rd*t;float d=map(p);if(d<.0017){hit=true;break;}t+=d*.9;if(t>7.)break;}if(!hit){gl_FragColor=vec4(0.);return;}
vec3 n=nrm(p),v=-rd,r=reflect(rd,n),col=spiritChrome(r,n,v,uLight)+spiritEmission(p);float a=smoothstep(1.2,.78,length(uv));gl_FragColor=vec4(col*a,a);}`;
    const shader = (type: number, source: string) => {
      const out = g.createShader(type);
      g.shaderSource(out, source);
      g.compileShader(out);
      if (!g.getShaderParameter(out, g.COMPILE_STATUS)) console.warn(g.getShaderInfoLog(out));
      return out;
    };
    prog = g.createProgram();
    g.attachShader(prog, shader(g.VERTEX_SHADER, vs));
    g.attachShader(prog, shader(g.FRAGMENT_SHADER, fs));
    g.linkProgram(prog);
    if (!g.getProgramParameter(prog, g.LINK_STATUS)) {
      prog = null;
      return false;
    }
    g.useProgram(prog);
    const buffer = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buffer);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
    const attr = g.getAttribLocation(prog, "a");
    g.enableVertexAttribArray(attr);
    g.vertexAttribPointer(attr, 2, g.FLOAT, false, 0, 0);
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
      "uReduce",
    ].forEach((name) => (U[name] = g.getUniformLocation(prog, name)));
    requestAnimationFrame(frame);
    return true;
  }
  function frame(now: number) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!prog || !cv.isConnected || document.hidden) return;
    const rect = cv.getBoundingClientRect();
    if (!rect.width || (coarse && skip++ % 2)) return;
    st.t += dt;
    const dpr = Math.min(coarse ? 1.5 : 2, devicePixelRatio || 1),
      w = Math.round(rect.width * dpr),
      h = Math.round(rect.height * dpr);
    if (cv.width !== w || cv.height !== h) {
      cv.width = w;
      cv.height = h;
    }
    const cx = rect.left + rect.width / 2,
      cy = rect.top + rect.height * 0.48;
    let tx = (mouse.x - cx) / 240,
      ty = -(mouse.y - cy) / 240;
    if (st.target?.isConnected && st.state === "listen") {
      const r = st.target.getBoundingClientRect();
      tx = (r.left + r.width / 2 - cx) / 260;
      ty = -(r.top + r.height / 2 - cy) / 260;
    }
    if (!mouse.active) tx = ty = 0;
    if (st.state === "think") {
      tx = 0.6;
      ty = 0.4;
    }
    const l = Math.hypot(tx, ty);
    if (l > 1) {
      tx /= l;
      ty /= l;
    }
    st.lx = lerp(st.lx, tx, 0.1);
    st.ly = lerp(st.ly, ty, 0.1);
    if (now > st.next) {
      st.bt = now;
      st.next = now + 2200 + Math.random() * 3600;
    }
    const blink = st.bt > 0 ? clamp((now - st.bt) / 160, 0, 1) : 1;
    st.blink = blink < 1 ? 1 - Math.sin(blink * Math.PI) : 1;
    st.smile = lerp(
      st.smile,
      st.state === "think" ? -0.15 : st.state === "speak" ? 0.42 : st.state === "listen" ? 0.35 : 0.26,
      0.08,
    );
    st.wide = lerp(st.wide, st.state === "listen" ? 1 : st.state === "think" ? 0.55 : 0, 0.08);
    st.mouth = lerp(st.mouth, 0, 1 - Math.pow(0.0005, dt));
    st.nodV += (-st.nod * 90 - st.nodV * 12) * dt;
    st.nod += st.nodV * dt;
    st.roll = lerp(st.roll, reduce ? 0 : st.state === "think" ? 0.1 : Math.sin(st.t * 0.6) * 0.025, 0.06);
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
    g.uniform1f(U.uReduce, reduce ? 1 : 0);
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
      st.nodV += 0.3;
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
