// GLSL for the chrome object, the composite pass and the post effects.

import { DIRECTOR_SHAPE, SPIRIT_GLSL } from "./spirit";

export const COMMON = `
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float vnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}`;
export const VERT = `varying vec2 vUv;void main(){vUv=position.xy*.5+.5;gl_Position=vec4(position.xy,0.,1.);}`;
export const RAY = `precision highp float;varying vec2 vUv;
uniform vec2 uRes;uniform float uTime,uMorph,uScale,uIntro,uJoin,uSpin,uGather,uBurst,uLight,uVel,uText,uMelt,uLens,uDropY,uDropR,uHold,uReduce;uniform sampler2D tTitle,tEnv;uniform vec2 uLook;uniform float uBlink,uMouth,uSmile,uWide;uniform vec2 uPos,uMouse,uTilt;uniform vec3 uTint;uniform float uTintAmt;
${COMMON}
${SPIRIT_GLSL}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float sdTorus(vec3 p,vec2 t){vec2 q=vec2(length(p.xz)-t.x,p.y);return length(q)-t.y;}
float sdRBox(vec3 p,vec3 b,float r){vec3 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float shape(vec3 p,float i){
  float t=uTime;
  if(i<.5){ float d=length(p)-.92*(1.-uBurst*.25); d+=sin(p.x*2.6+t*.9)*sin(p.y*2.3+t*1.1)*sin(p.z*2.9+t*.7)*(.09+uBurst*.25);
    for(int k=0;k<4;k++){float fk=float(k);vec3 o=vec3(sin(t*.55+fk*2.1)*1.3,cos(t*.47+fk*1.7)*.95,sin(t*.4+fk)*.7)*uGather*(1.+uBurst*1.4);d=smin(d,length(p-o)-(.24-fk*.035),.5);}
    d=smin(d,length(p-vec3(uMouse,.55))-.2,.55); if(uDropR>.001) d=smin(d,length(p-vec3(0.,uDropY,0.))-uDropR,.38); return d;}
  if(i<1.5){ float d=length(p)-.95; float a=length(p.xz); d+=sin(p.y*13.-t*2.4)*.018*smoothstep(1.,.2,abs(p.y)); d+=sin(a*9.-t*1.6)*.012; d+=sin(p.x*3.+t)*uBurst*.15; return d;}
  if(i<2.5){ vec3 q=p; q.xz*=rot(q.y*1.35+uSpin); q.xy*=rot(.12); float d=sdRBox(q,vec3(.36,1.35,.36),.09); return d*.7;}
  if(i<3.5){ vec3 q=p; q.yz*=rot(1.15); q.xz*=rot(t*.35); float r=sdTorus(q,vec2(1.05,.11));
    float c=length(p)-.36+sin(t*2.)*.03; float d=min(r,c);
    for(int k=0;k<3;k++){float fk=float(k);vec3 o=vec3(cos(t*.9+fk*2.09)*1.05,0.,sin(t*.9+fk*2.09)*1.05);o.yz*=rot(-1.15);d=smin(d,length(p-o)-.07,.18);} return d;}
  if(i<4.5){ float s=length(p)-1.02; vec3 q=p*4.2; q.xy*=rot(t*.08); float g=abs(dot(sin(q+t*.25),cos(q.zxy)))/4.2-.035; return max(s,g)*.8;}
  if(i<5.5){ float x=mix(1.05,.0,uJoin); float a=length(p-vec3(-x,sin(t*.8)*.08,0.))-.62; float b=length(p-vec3(x,-sin(t*.8)*.08,0.))-.62; return smin(a,b,.45+uJoin*.15); }
  return spiritSdf(p);
}
float map(vec3 p){
  p.xy-=uPos; float sc=max(uScale*uIntro,.02); p/=sc; p.y/=1.+abs(uVel)*.08; p.x*=1.+abs(uVel)*.04;
  float fw=clamp(uMorph-5.,0.,1.); p.xz*=rot(mix(uTilt.x+uTime*.05,uLook.x*.14,fw)); p.yz*=rot(mix(uTilt.y,uLook.y*.1,fw));
  float a=floor(uMorph),f=uMorph-a; float d=shape(p,a);
  if(f>.001){ float e=shape(p,a+1.); d=mix(d,e,smoothstep(0.,1.,f)); d+=sin(f*3.14159)*.06*sin(p.x*6.+uTime)*sin(p.y*5.); }
  return d*sc;
}
vec3 nrm(vec3 p){vec2 e=vec2(.0015,-.0015);return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
vec3 envD(vec3 r){
  vec3 c=mix(vec3(.015,.016,.03),vec3(.09,.09,.14),smoothstep(-.6,.9,r.y));
  c+=vec3(1.6,1.55,1.5)*pow(max(dot(r,normalize(vec3(-.6,.65,.45))),0.),26.);
  c+=vec3(.55,.75,1.4)*pow(max(dot(r,normalize(vec3(.85,.15,.35))),0.),9.)*.9;
  c+=vec3(1.4,.75,.55)*pow(max(dot(r,normalize(vec3(-.2,-.75,.5))),0.),7.)*.5;
  c+=vec3(1.2)*smoothstep(.93,.99,r.y)*.7;
  c+=vec3(.9)*smoothstep(.035,.0,abs(r.x-.55))*smoothstep(-.2,.6,r.y)*.6;
  c+=vec3(.7,.8,1.)*smoothstep(.02,.0,abs(r.y+.1))*smoothstep(.2,.9,abs(r.x))*.5;
  c+=vec3(1.,.55,.35)*pow(max(dot(r,normalize(vec3(.9,-.1,-.3))),0.),12.)*.6;
  return c;}
vec3 envL(vec3 r){
  vec3 c=mix(vec3(.55,.55,.62),vec3(1.,1.,1.02),smoothstep(-.7,.8,r.y));
  c-=vec3(.6)*smoothstep(.06,.0,abs(r.x+.42))*smoothstep(-.4,.7,r.y);
  c-=vec3(.55)*pow(max(dot(r,normalize(vec3(.8,-.2,.45))),0.),5.);
  c+=vec3(.4,.5,.9)*pow(max(dot(r,normalize(vec3(.85,.25,.35))),0.),12.)*.5;
  c+=vec3(.9,.5,.35)*pow(max(dot(r,normalize(vec3(-.2,-.75,.5))),0.),7.)*.35;
  return c;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec3 ro=vec3(0.,0.,5.),rd=normalize(vec3(uv,-1.6));
  float t=0.,glow=0.;bool hit=false;vec3 p;
  if(uIntro<.03){gl_FragColor=vec4(0.);return;}
  float dm=1e9,tm=0.,ea=1.;
  for(int i=0;i<STEPS;i++){p=ro+rd*t;float d=map(p);glow+=exp(-d*7.)*.012;if(d<dm){dm=d;tm=t;}if(d<.0015){hit=true;break;}t+=d*.85;if(t>9.)break;}
  if(!hit){ float pw=tm*2./uRes.y; if(dm<pw){ hit=true; p=ro+rd*tm; ea=1.-dm/pw; } }
  vec3 gc=.5+.5*cos(6.2831*(vec3(.55,.68,.85)+uv.x*.25+uTime*.03));
  gc=mix(gc,uTint,uTintAmt*.6);
  if(!hit){ float g=clamp(glow*uIntro,0.,1.)*(1.-uLight*.75); gl_FragColor=vec4(gc*g*.55,g*.45); return; }
  vec3 n=nrm(p);float emb=0.;
  if(uText>.001){ vec2 suv=gl_FragCoord.xy/uRes; float k=uText*(1.-uMelt); vec2 tuv=suv+vec2(0.,uMelt*(.08+.22*vnoise(vec2(suv.x*9.,uTime))));
    float e=2.5/uRes.y; float h=texture2D(tTitle,tuv).r, hx=texture2D(tTitle,tuv+vec2(e,0.)).r, hy=texture2D(tTitle,tuv+vec2(0.,e)).r;
    n=normalize(n+vec3(-(hx-h),-(hy-h),0.)*k*22.); emb=h*k; }
  vec3 v=-rd,r=reflect(rd,n);float fr=pow(1.-max(dot(n,v),0.),2.6);
  vec3 irid=.5+.5*cos(6.2831*(vec3(0.,.33,.67)+fr*1.15+dot(n,vec3(.25,.55,.1))*.55+uTime*.035));
  irid=mix(irid,uTint*1.1,uTintAmt*.55);
  vec3 e=mix(envD(r),envL(r),uLight);
  if(uHold>.01){ vec3 hc=texture2D(tEnv,vec2(.5)+r.xy*vec2(.42,.42)).rgb; e=mix(e,hc*1.25,uHold*.8*smoothstep(-.3,.5,r.z+.3)); }
  vec3 col=uMorph>${DIRECTOR_SHAPE - 0.5}?spiritChrome(r,n,v,uLight):e*mix(vec3(.85),irid*1.25,mix(.55,.4,uLight))+irid*fr*mix(.85,.5,uLight);
  col+=vec3(.9,.95,1.)*pow(max(dot(r,normalize(vec3(-.6,.65,.45))),0.),90.)*1.5;
  col*=.9+.1*vnoise(p.xy*40.);
  col+=mix(vec3(.9,.95,1.),irid,.35)*emb*.28;
  if(uLens>.5){ col=col*(fr*.8+.05); }
  if(uMorph>5.2&&uMorph<${DIRECTOR_SHAPE - 0.2}){ float ao=0.,sc=1.; for(int k=1;k<6;k++){ float h=.02+.05*float(k); ao+=(h-map(p+n*h))*sc; sc*=.7; } ao=clamp(1.-ao*3.2,0.,1.); col*=mix(1.,ao,.9); col+=vec3(.25,.22,.3)*pow(fr,3.)*(1.-uLight)*.4; }
  if(uMorph>${DIRECTOR_SHAPE - 0.5}){ vec3 markP=p; markP.xy-=uPos; markP/=max(uScale*uIntro,.02); col+=spiritEmission(markP); }
  gl_FragColor=vec4(col*ea,ea);
}`;
export const FLOW = `precision highp float;varying vec2 vUv;uniform sampler2D tPrev;uniform vec2 uM,uV,uSpC;uniform float uAsp,uDiss,uSp,uSpR;
void main(){vec4 c=texture2D(tPrev,vUv);vec2 v=(c.rg*2.-1.);v=sign(v)*max(abs(v)-.008,0.)*uDiss;vec2 d=vUv-uM;d.x*=uAsp;float f=smoothstep(.17,0.,length(d));v=clamp(v+uV*f,-1.,1.);
  if(uSp>0.){ vec2 q=vUv-uSpC; q.x*=uAsp; float l=length(q); v=clamp(v+normalize(q+1e-5)*uSp*smoothstep(.07,0.,abs(l-uSpR)),-1.,1.); }
  gl_FragColor=vec4(v*.5+.5,0.,1.);}`;
export const COMP = `precision highp float;varying vec2 vUv;
uniform sampler2D tScene,tFlow,tP,tK,tMenu,tName,tBloom,tSpace;uniform float uSpace,uStars,uCA;uniform vec2 uSpClip;uniform vec4 uPR,uKR,uNR;uniform vec2 uRes,uPTex,uKTex,uKVel,uGlowPos,uLensC,uRows;
uniform float uTime,uPA,uKA,uDim,uIntro,uHover,uLight,uVel,uFront,uBgA,uCover,uLens,uLensR,uMenuLens,uNameA,uNameDiff,uBloom;uniform vec3 uTint,uFg;uniform float uTintAmt;
${COMMON}
vec2 cover(vec2 uv,vec2 box,vec2 tex){float rb=box.x/box.y,rt=tex.x/tex.y;vec2 s=rb>rt?vec2(1.,rt/rb):vec2(rb/rt,1.);return (uv-.5)*s+.5;}
float rbox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
vec3 bgAt(vec2 uv){ float asp=uRes.x/uRes.y; vec2 q=uv-uGlowPos;q.x*=asp;
  vec3 bgD=mix(vec3(.027,.031,.051),vec3(.06,.06,.1),smoothstep(1.2,0.,length(q)));
  bgD+=mix(vec3(.25,.3,.55),uTint,uTintAmt*.7)*.12*smoothstep(.75,0.,length(q))*uIntro;
  bgD+=vec3(.45,.3,.6)*.05*smoothstep(1.,0.,length(uv-vec2(.1,1.)));
  vec3 bgL=mix(vec3(.933,.929,.949),vec3(.975,.972,.99),smoothstep(1.1,0.,length(q)));
  bgL-=mix(vec3(.05,.04,.0),(vec3(1.)-uTint)*.06,uTintAmt)*smoothstep(.7,0.,length(q))*uIntro;
  bgD+=vec3(.8,.85,1.)*uStars*step(.9986,hash(floor(uv*uRes*.5)))*(.5+.5*sin(uTime*2.+hash(floor(uv*uRes*.5)+3.)*30.));
  return mix(bgD,bgL,uLight); }
vec4 layers(vec2 uv,vec2 fl){
  vec3 col=bgAt(uv); float A=mix(1.,uBgA,uFront); col*=A;
  if(uSpace>0.){ float cm=smoothstep(uSpClip.x,uSpClip.x+.015,uv.y)*(1.-smoothstep(uSpClip.y-.015,uSpClip.y,uv.y)); vec4 sp=texture2D(tSpace,uv+fl*.012)*uSpace*cm; col=col*(1.-sp.a)+sp.rgb; A=A*(1.-sp.a)+sp.a; }
  if(uPA>0.){vec2 pu=(uv-uPR.xy)/uPR.zw;
    if(pu.x>-.02&&pu.x<1.02&&pu.y>-.02&&pu.y<1.02){
      vec2 dpu=pu-fl*.09;float zoom=1.06-.06*min(uPA,1.)-uHover*.03;vec2 tu=cover((dpu-.5)/zoom+.5,uPR.zw*uRes,uPTex);
      float sh=length(fl)*.025+.002;
      vec3 pc=vec3(texture2D(tP,tu+vec2(sh,0.)).r,texture2D(tP,tu).g,texture2D(tP,tu-vec2(sh,0.)).b);
      pc=mix(pc,vec3(dot(pc,vec3(.3,.59,.11))),.15)*1.05;
      float n=vnoise(pu*vec2(6.,9.)+uTime*.2)*.35;float edge=uPA*1.4-(1.-pu.y)*.95-n;
      float inb=step(0.,pu.x)*step(pu.x,1.)*step(0.,pu.y)*step(pu.y,1.);
      float m=smoothstep(0.,.06,edge)*inb; float line=smoothstep(.06,0.,abs(edge-.03))*inb*(1.-step(1.3,uPA));
      col=mix(col,pc,m);A=mix(A,1.,m);col+=vec3(.66,.85,1.)*line*.9*A; }}
  if(uNameA>0.){ vec2 nu=(uv-uNR.xy)/uNR.zw; nu.x-=nu.y>.5?uRows.x:uRows.y; nu-=fl*.03;
    if(nu.x>0.&&nu.x<1.&&nu.y>0.&&nu.y<1.){ float m=texture2D(tName,nu).a*uNameA;
      vec3 base=col/max(A,.001); vec3 nc=mix(uFg,abs(vec3(1.)-base)*1.14,uNameDiff); col=mix(col,nc,m); A=mix(A,1.,m); } }
  if(uKA>0.){vec2 ku=(uv-uKR.xy)/uKR.zw;
    ku.x+=uKVel.x*(ku.y-.5)*(ku.y-.5)*1.4;ku.y+=uKVel.y*(ku.x-.5)*(ku.x-.5)*1.4;
    float d=rbox((ku-.5)*uKR.zw*uRes,uKR.zw*uRes*.5,18.); float m=smoothstep(1.,-1.,d)*uKA;
    if(m>0.){vec2 tu=cover((ku-.5)/(1.12-.12*uKA)+.5,uKR.zw*uRes,uKTex);float sh=length(uKVel)*.03;
      vec3 kc=vec3(texture2D(tK,tu+vec2(sh,0.)).r,texture2D(tK,tu).g,texture2D(tK,tu-vec2(sh,0.)).b);col=mix(col,kc,m);A=mix(A,1.,m);}}
  return vec4(col,A); }
void main(){
  vec2 fl=texture2D(tFlow,vUv).rg*2.-1.;fl=sign(fl)*max(abs(fl)-.02,0.);
  float asp=uRes.x/uRes.y; vec3 bgc=bgAt(vUv);
  vec4 L=layers(vUv,fl); vec3 col=L.rgb; float A=L.a;
  vec2 su=vUv-fl*.035;su.y+=sin(vUv.x*3.14159)*uVel*.012;float ca=(.0025+length(fl)*.012+abs(uVel)*.004)*uCA;
  vec4 s=texture2D(tScene,su);s.r=texture2D(tScene,su+vec2(ca,0.)).r;s.b=texture2D(tScene,su-vec2(ca,0.)).b;
  s.rgb*=uDim;s.a*=mix(.6,1.,uDim);
  float inside=uLens*smoothstep(.93,1.,s.a); vec4 sN=s*(1.-inside);
  col=col*(1.-sN.a)+sN.rgb; A=A*(1.-sN.a)+sN.a;
  if(inside>0.){ vec2 dd=(vUv-uLensC)*vec2(asp,1.); float rr=clamp(length(dd)/max(uLensR,.01),0.,1.); float mag=.5+.32*rr*rr;
    vec2 luv=uLensC+(vUv-uLensC)*mag+fl*.02; float ab=.001+.006*rr*rr*rr; vec3 glass;
    if(uMenuLens>.5){ vec3 tc=vec3(texture2D(tMenu,luv+vec2(ab,0.)).r,texture2D(tMenu,luv).g,texture2D(tMenu,luv-vec2(ab,0.)).b);
      glass=bgc*(.55+.25*(1.-rr))+tc*1.05+vec3(.6,.7,1.)*.04*(1.-rr); }
    else { vec3 g1=layers(luv+vec2(ab*2.,0.),fl).rgb, g2=layers(luv,fl).rgb, g3=layers(luv-vec2(ab*2.,0.),fl).rgb; glass=vec3(g1.r,g2.g,g3.b)*(.9+.12*(1.-rr)); }
    col=mix(col,glass+s.rgb,inside); A=mix(A,1.,inside); }
  float cov=smoothstep(.75,1.,uCover); col=mix(col,col+bgc*.55*(1.-A),cov); A=mix(A,1.,cov);
  col+=texture2D(tBloom,vUv).rgb*uBloom*A;
  col+=mix(vec3(.6,.75,1.),vec3(.2,.3,.6),uLight)*length(fl)*.04*(1.-uLight*2.)*A;
  vec2 vv=vUv-.5;col*=1.-dot(vv,vv)*mix(.75,.25,uLight);
  col=col/(1.+col*mix(.12,.02,uLight));
  col+=(hash(vUv*uRes+fract(uTime*7.))-.5)*mix(.045,.03,uLight)*A;
  gl_FragColor=vec4(max(col,0.),A);
}`;
export const BRIGHT = `precision highp float;varying vec2 vUv;uniform sampler2D tSrc;uniform vec2 uTx;
void main(){ vec3 c=vec3(0.); for(int i=0;i<4;i++){ vec2 o=vec2(mod(float(i),2.)-.5,floor(float(i)/2.)-.5)*uTx; c+=texture2D(tSrc,vUv+o).rgb; } c*=.25; float l=dot(c,vec3(.3,.59,.11)); gl_FragColor=vec4(c*smoothstep(.5,1.05,l),1.); }`;
export const BLUR = `precision highp float;varying vec2 vUv;uniform sampler2D tSrc;uniform vec2 uDir;
void main(){ vec3 c=texture2D(tSrc,vUv).rgb*.227; c+=(texture2D(tSrc,vUv+uDir*1.385).rgb+texture2D(tSrc,vUv-uDir*1.385).rgb)*.316; c+=(texture2D(tSrc,vUv+uDir*3.23).rgb+texture2D(tSrc,vUv-uDir*3.23).rgb)*.07; gl_FragColor=vec4(c,1.); }`;
