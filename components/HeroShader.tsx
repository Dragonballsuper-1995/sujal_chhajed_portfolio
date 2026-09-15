import React, { useRef, useEffect } from 'react';

interface HeroShaderProps {
  className?: string;
}

const HeroShader: React.FC<HeroShaderProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    // Vertex shader
    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader: slow-moving, gentle, broad pastel ambient aura
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_scroll_fade;

      // Simplex-style pseudo noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 p = vec2(uv.x * aspect, uv.y);

        // Slow, organic time evolution (calm, continuous drift)
        float t = u_time * 0.08;

        // Subtle mouse displacement with wide gentle falloff
        vec2 mouse = u_mouse / u_resolution;
        mouse.x *= aspect;
        vec2 mouseDelta = p - mouse;
        float mouseDist = length(mouseDelta);
        float mouseInfluence = smoothstep(0.48, 0.0, mouseDist);
        vec2 mouseWarp = (mouseDist > 0.001) ? (mouseDelta / mouseDist) * mouseInfluence * 0.12 : vec2(0.0);

        // Very broad, low-frequency coordinate mapping (smooth expansive gradients, no high-freq noise)
        vec2 flow = vec2(sin(t * 0.6) * 0.15, cos(t * 0.45) * 0.15);
        vec2 q = vec2(
          snoise(p * 0.38 + flow + vec2(t * 0.05, t * 0.04) + mouseWarp * 0.5),
          snoise(p * 0.38 - flow + vec2(5.2, 2.1) + vec2(-t * 0.04, t * 0.05))
        );

        float f = snoise(p * 0.32 + q * 0.35 + vec2(t * 0.03, -t * 0.02));

        // Distinct, harmonious neo-brutalist pastel pigments
        vec3 colYellow   = vec3(1.00, 0.88, 0.35); // Neo-yellow
        vec3 colCyan     = vec3(0.30, 0.85, 0.94); // Clean cyan
        vec3 colPink     = vec3(1.00, 0.48, 0.74); // Vibrant soft pink
        vec3 colMint     = vec3(0.45, 0.90, 0.50); // Fresh mint green
        vec3 colLavender = vec3(0.70, 0.55, 0.95); // Gentle lavender

        // Broad, silky gradient transitions
        vec3 color = colYellow;
        color = mix(color, colCyan, smoothstep(-0.50, 0.50, q.x));
        color = mix(color, colPink, smoothstep(-0.50, 0.50, q.y));
        color = mix(color, colMint, smoothstep(-0.45, 0.45, f));
        color = mix(color, colLavender, smoothstep(0.20, 0.70, q.x * q.y));

        // Clearly visible, balanced ambient intensity (0.24 - 0.34 range)
        float baseAlpha = 0.24 + 0.08 * (f * 0.5 + 0.5);
        float alpha = clamp(baseAlpha + mouseInfluence * 0.05, 0.20, 0.36);

        gl_FragColor = vec4(color, alpha);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    // Fullscreen quad
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    // Accessibility: reduced motion support
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = reducedMotionQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    let mouseX = 0;
    let mouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = canvas.height - (e.clientY - rect.top);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animationFrameId: number;
    let startTime = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const render = (time: number) => {
      resize();

      // Smooth mouse follow
      currentMouseX += (mouseX - currentMouseX) * 0.05;
      currentMouseY += (mouseY - currentMouseY) * 0.05;

      const speedMultiplier = isReducedMotion ? 0.05 : 1.0;
      const elapsed = (time - startTime) * 0.001 * speedMultiplier;

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, currentMouseX, currentMouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none mix-blend-multiply ${className}`}
      aria-hidden="true"
    />
  );
};

export default React.memo(HeroShader);
