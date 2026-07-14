import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GOLD = new THREE.Color('#e6c364');
const GOLD_DIM = new THREE.Color('#8a7340');

/**
 * Full-bleed WebGL layer: floating dust, soft rings, subtle parallax.
 * Renders with alpha; keep pointer-events-none on the wrapper.
 */
export function GirnarThreeBackdrop({ className = '', intensity = 1 }) {
  const mountRef = useRef(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      return undefined;
    }

    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 120);
    camera.position.set(0, 0.2, 6.5);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderer = new THREE.WebGLRenderer({
      antialias: dpr <= 1.25,
      alpha: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
      depth: false,
      stencil: false,
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xfff4e0, 0.35 * intensity);
    scene.add(ambient);
    const point = new THREE.PointLight(0xffe8a8, 1.2 * intensity, 24, 2);
    point.position.set(2, 3, 4);
    scene.add(point);

    // --- Particle field (lighter count = smoother scroll / less GPU) ---
    const isMobileViewport = window.innerWidth < 768;
    const count = reduced ? 80 : (isMobileViewport ? 150 : 350);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const radius = 6.5;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      const r = radius * (0.2 + Math.random() * 0.8);
      positions[i * 3] = Math.cos(t) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8.0;
      positions[i * 3 + 2] = Math.sin(t) * r * 0.4;
      
      sizes[i] = Math.random() * 0.06 + 0.02;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: GOLD.clone().multiplyScalar(1.2) },
        uColor2: { value: GOLD_DIM.clone() },
        uIntensity: { value: intensity },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vAlpha;
        varying float vDistance;

        void main() {
          vec3 p = position;
          
          // Noise-like organic drift
          float driftX = sin(uTime * 0.4 + aPhase) * 0.15;
          float driftY = cos(uTime * 0.3 + aPhase * 1.5) * 0.15;
          float driftZ = sin(uTime * 0.5 + aPhase * 2.0) * 0.1;
          p += vec3(driftX, driftY, driftZ);

          // Interactive mouse attraction/repulsion
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          vec2 screenPos = (projectionMatrix * mvPosition).xy / (projectionMatrix * mvPosition).w;
          float dist = distance(screenPos, uMouse);
          
          // Subtle swell when mouse is near
          float swell = smoothstep(0.45, 0.0, dist) * 1.8;
          p.z += swell * 0.3;
          
          // Re-calculate mvPosition after swell
          mvPosition = modelViewMatrix * vec4(p, 1.0);
          
          vAlpha = (0.4 + 0.6 * smoothstep(10.0, 1.0, -mvPosition.z)) * (1.0 + swell * 0.5);
          vDistance = dist;
          
          gl_PointSize = aSize * (520.0 / -mvPosition.z) * (1.0 + swell);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uColor2;
        varying float vAlpha;
        varying float vDistance;

        void main() {
          vec2 c = gl_PointCoord - vec2(0.5);
          float d = length(c);
          if (d > 0.5) discard;
          
          float soft = smoothstep(0.5, 0.05, d);
          
          // Color shift based on mouse proximity
          vec3 col = mix(uColor2, uColor, soft + (smoothstep(0.4, 0.0, vDistance) * 0.4));
          
          gl_FragColor = vec4(col, soft * vAlpha * 0.85);
        }
      `,
    });

    const points = new THREE.Points(geo, particleMat);
    points.rotation.x = -0.12;
    scene.add(points);

    const onMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    
    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = mount.getBoundingClientRect();
        mouseRef.current.x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current.y = -(((e.touches[0].clientY - rect.top) / rect.height) * 2 - 1);
      }
    };
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const timer = new THREE.Timer();
    if (typeof document !== 'undefined') {
      timer.connect(document);
    }

    let running = true;

    const tick = (timestamp) => {
      if (!running) return;
      frameRef.current = requestAnimationFrame(tick);
      if (typeof document !== 'undefined' && document.hidden) return;

      timer.update(timestamp);
      const t = timer.getElapsed();
      const mx = mouseRef.current.x * 0.25;
      const my = mouseRef.current.y * 0.18;

      if (!reduced) {
        particleMat.uniforms.uTime.value = t;
        particleMat.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
        points.rotation.y = t * 0.04 + mx * 0.15;
        points.rotation.x = -0.12 + my * 0.08;
      }

      camera.position.x += (mx * 0.35 - camera.position.x) * 0.04;
      camera.position.y += (my * 0.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    tick();

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(mount);

    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouchMove);
      ro.disconnect();
      geo.dispose();
      particleMat.dispose();
      timer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [intensity]);

  return (
    <div
      ref={mountRef}
      className={`${className}`}
      aria-hidden="true"
      role="presentation"
      style={{ 
        pointerEvents: 'none',
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        isolation: 'isolate',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden'
      }}
    />
  );
}
