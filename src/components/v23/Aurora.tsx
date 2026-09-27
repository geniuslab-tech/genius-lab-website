"use client";

import { useEffect, useRef } from "react";

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

/*
 * A restrained light field: slow curtains of cool blue and teal over the brand navy, warped by
 * fractal noise. Kept deliberately low in contrast so white type always sits on near-black.
 */
const FRAG = `
precision mediump float;
uniform vec2 u_res;
uniform float u_t;
uniform vec2 u_m;
uniform float u_lift;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/u_res;
  float asp=u_res.x/u_res.y;
  vec2 p=vec2(uv.x*asp,uv.y);
  float t=u_t*.03;
  float w=fbm(vec2(p.x*1.1+t,p.y*.55-t*.4));
  float band=sin((p.x*1.9+w*2.6-t*1.4)*3.14159)*.5+.5;
  band=smoothstep(.35,1.,band);
  float fall=smoothstep(.1,.9,uv.y)*(1.-smoothstep(.92,1.08,uv.y));
  float n2=fbm(p*1.8+vec2(-t,t*.6));
  float glow=band*fall*(.45+.55*n2);
  vec3 base=vec3(.016,.024,.063);
  vec3 navy=vec3(.063,.078,.251);
  vec3 blue=vec3(.14,.34,.66);
  vec3 teal=vec3(.07,.44,.48);
  vec3 col=mix(base,navy,uv.y*.5+n2*.22+u_lift*.35);
  col+=mix(teal,blue,smoothstep(.25,.75,w))*glow*.26;
  float d=distance(p,vec2(u_m.x*asp,u_m.y));
  col+=blue*.05*exp(-d*d*5.);
  col+=(hash(gl_FragCoord.xy+fract(u_t))-.5)/255.;
  gl_FragColor=vec4(col,1.);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

/**
 * The aurora canvas. Renders at half resolution with DPR capped at 1.5 (the field is soft, so
 * nothing is lost), runs near 30fps, pauses when offscreen or the tab is hidden, and draws a single
 * still frame under reduced motion. A CSS gradient underneath stands in if WebGL is unavailable.
 */
export function Aurora({ lift = 0, className = "" }: { lift?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    if (!gl) return;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uT = gl.getUniformLocation(prog, "u_t");
    const uM = gl.getUniformLocation(prog, "u_m");
    const uLift = gl.getUniformLocation(prog, "u_lift");
    gl.uniform1f(uLift, lift);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    let last = 0;
    let t = 18;
    const mouse = { x: 0.5, y: 0.7, tx: 0.5, ty: 0.7 };

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
      const w = Math.max(2, Math.round(canvas.clientWidth * scale));
      const h = Math.max(2, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, w, h);
    };
    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform1f(uT, t);
      gl.uniform2f(uM, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const loop = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (now - last > 32) {
        t += Math.min(0.05, (now - last) / 1000) * 1;
        last = now;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduce || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw();
    canvas.dataset.ready = "1";

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / Math.max(1, r.width);
      mouse.ty = 1 - (e.clientY - r.top) / Math.max(1, r.height);
    };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });
    const onLost = (e: Event) => {
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      delete canvas.dataset.ready;
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [lift]);

  return (
    <div className={`v23-aurora ${className}`} aria-hidden="true">
      <canvas ref={ref} className="v23-aurora-canvas" />
    </div>
  );
}
