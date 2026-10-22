// Shared GLSL for the Director. Both renderers use this orb and its projected light marks.
// It deliberately contains no human features: only a living chrome form and simple signals.

export const SPIRIT_GLSL = `
float spiritEl(vec3 p,vec3 r){float a=length(p/r),b=length(p/(r*r));return a*(a-1.)/b;}
float spiritBox(vec2 p,vec2 b,float r){vec2 q=abs(p)-b+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
float spiritSdf(vec3 p){
  float wave=(sin(p.x*5.1+uTime*.62)*sin(p.y*4.3-uTime*.48)*sin(p.z*5.7+uTime*.39))*.022*(1.-uReduce);
  return spiritEl(p,vec3(.88,.81,.88))+wave;
}
vec3 spiritEnv(vec3 r,float light){
  vec3 dark=mix(vec3(.018,.022,.042),vec3(.12,.13,.2),smoothstep(-.65,.85,r.y));
  dark+=vec3(1.55,1.48,1.42)*pow(max(dot(r,normalize(vec3(-.6,.65,.45))),0.),28.);
  dark+=vec3(.42,.7,1.35)*pow(max(dot(r,normalize(vec3(.8,.12,.42))),0.),10.);
  dark+=vec3(1.2,.62,.42)*pow(max(dot(r,normalize(vec3(-.18,-.72,.45))),0.),7.)*.5;
  vec3 bright=mix(vec3(.52,.54,.62),vec3(.98,1.,1.),smoothstep(-.7,.82,r.y));
  bright+=vec3(.25,.4,.8)*pow(max(dot(r,normalize(vec3(.8,.2,.4))),0.),12.);
  return mix(dark,bright,light);
}
vec3 spiritChrome(vec3 r,vec3 n,vec3 v,float light){
  float fres=pow(1.-max(dot(n,v),0.),2.5);
  vec3 ir=.5+.5*cos(6.2831*(vec3(.0,.33,.67)+fres*1.12+dot(n,vec3(.25,.55,.1))*.55+uTime*.025));
  return spiritEnv(r,light)*mix(vec3(.87),ir*1.22,mix(.56,.38,light))+ir*fres*mix(.82,.45,light);
}
float spiritMarks(vec3 p){
  float front=smoothstep(.43,.76,p.z);
  vec2 look=uLook*vec2(.085,.055);
  float h=(.035+.013*uWide)*uBlink;
  vec2 l=vec2(p.x+.255-look.x,p.y-.12-look.y),r=vec2(p.x-.255-look.x,p.y-.12-look.y);
  float left=smoothstep(.018,-.012,spiritBox(l,vec2(.07,h),.035));
  float right=smoothstep(.018,-.012,spiritBox(r,vec2(.07,h*(uSmile<.0?.62:1.)),.035));
  vec2 m=vec2(p.x-uLook.x*.04,p.y+.235+uSmile*p.x*p.x*.75);
  float smile=smoothstep(.022,-.012,abs(m.y)-.014);
  float open=smoothstep(1.0,.68,length(m/vec2(.115,.025+.075*uMouth)));
  return front*max(max(left,right),mix(smile,open,clamp(uMouth*1.5,0.,1.)));
}
vec3 spiritEmission(vec3 p){return vec3(.74,.91,1.28)*spiritMarks(p)*2.4;}
`;
