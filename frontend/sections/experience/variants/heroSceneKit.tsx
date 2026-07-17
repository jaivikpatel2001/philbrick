"use client";
/* =============================================================================
   HERO SCENE KIT — shared runtime for the /variant2+ Three.js hero scenes.

   One place for everything every cinematic scroll hero needs, so each variant
   file only describes its SCENE (geometry, lights, camera path, beats):

   - WebGL renderer (ACES, sRGB, alpha, DPR cap 2 / 1.5 on low-perf devices)
   - RoomEnvironment IBL (same studio look as the homepage hero)
   - CSS-sticky stage + tall section scrubbed by ScrollTrigger (house pattern:
     no GSAP pin; Lenis already drives ScrollTrigger via SmoothScroll.tsx)
   - One render loop on the gsap ticker, paused when the hero is off-screen or
     the tab is hidden; disposed fully on unmount
   - Reduced motion: renders ONE static frame at a scene-chosen pose, no scrub
   - HTML callout projector: 3D anchors -> screen-positioned labels with
     per-beat visibility windows (opacity/transform only)

   Standards: sections/experience/THREEJS-IMPLEMENTATION.md (dispose, DPR <= 2,
   pause off-screen, transform/opacity-only overlays).
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export interface HeroCallout {
  key: string;
  /** world-space anchor the label tracks */
  pos: THREE.Vector3;
  /** scroll-progress window [start, end] in which the callout is visible */
  range: [number, number];
  /** label copy */
  title: string;
  sub?: string;
  /** which side of the anchor the label sits on (screen space) */
  side?: "left" | "right";
}

export interface HeroSceneHandle {
  /** apply the scroll pose. p = 0..1 scrubbed progress, t = seconds elapsed */
  update: (p: number, t: number) => void;
  /** world anchors for HTML callouts (projected each frame) */
  callouts?: HeroCallout[];
  /** pose used for the reduced-motion static frame (default 0.9) */
  staticPose?: number;
  /** extra cleanup beyond the kit's geometry/material sweep */
  dispose?: () => void;
}

export interface HeroSceneCtx {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  lowPerf: boolean;
}

interface KitOptions {
  build: (ctx: HeroSceneCtx) => HeroSceneHandle;
  /** camera vertical FOV on desktop (mobile gets +6) */
  fov?: number;
}

export interface KitRefs {
  rootRef: React.RefObject<HTMLElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  calloutLayerRef: React.RefObject<HTMLDivElement | null>;
  /** live scrubbed progress (0..1) for overlay copy driven outside the canvas */
  progressRef: React.RefObject<number>;
  /** true once the scene built (or reduced-motion frame rendered) */
  ready: boolean;
  reduced: boolean;
}

/** smoothstep helper every scene needs for beat windows */
export function beat(p: number, a: number, b: number): number {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** keyframed camera path: sorted stops {p, pos, look}; lerped with smoothing */
export interface CamStop {
  p: number;
  pos: [number, number, number];
  look: [number, number, number];
}
export function poseCamera(camera: THREE.PerspectiveCamera, path: CamStop[], p: number, target: THREE.Vector3) {
  let i = 0;
  while (i < path.length - 2 && p > path[i + 1].p) i++;
  const a = path[i];
  const b = path[i + 1];
  const t = beat(p, a.p, b.p);
  camera.position.set(lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t));
  target.set(lerp(a.look[0], b.look[0], t), lerp(a.look[1], b.look[1], t), lerp(a.look[2], b.look[2], t));
  camera.lookAt(target);
}

export function useHeroScene({ build, fov = 42 }: KitOptions): KitRefs {
  const rootRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const calloutLayerRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);

    const lowPerf =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth < 900 ||
      (navigator.hardwareConcurrency || 8) <= 4;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      root.classList.add("no-webgl");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPerf ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.localClippingEnabled = true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(lowPerf ? fov + 6 : fov, 1, 0.1, 400);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.85;

    const stage = canvas.parentElement as HTMLElement;
    const size = () => {
      const w = stage.clientWidth || 1;
      const h = stage.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(stage);

    const handle = build({ scene, camera, renderer, lowPerf });
    const startT = performance.now();

    /* ---- HTML callouts ---- */
    const layer = calloutLayerRef.current;
    const calloutEls: { el: HTMLElement; c: HeroCallout }[] = [];
    if (layer && handle.callouts) {
      for (const c of handle.callouts) {
        const el = document.createElement("div");
        el.className = `hs-callout ${c.side === "right" ? "hs-callout--right" : ""}`;
        el.setAttribute("aria-hidden", "true");
        el.innerHTML = `<span class="hs-callout__dot"></span><span class="hs-callout__body"><span class="hs-callout__title"></span>${
          c.sub ? '<span class="hs-callout__sub"></span>' : ""
        }</span>`;
        (el.querySelector(".hs-callout__title") as HTMLElement).textContent = c.title;
        if (c.sub) (el.querySelector(".hs-callout__sub") as HTMLElement).textContent = c.sub;
        layer.appendChild(el);
        calloutEls.push({ el, c });
      }
    }
    const v = new THREE.Vector3();
    const projectCallouts = (p: number) => {
      if (!calloutEls.length) return;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      for (const { el, c } of calloutEls) {
        const inWin = beat(p, c.range[0], c.range[0] + 0.03) * (1 - beat(p, c.range[1] - 0.03, c.range[1]));
        if (inWin <= 0.01) {
          el.style.opacity = "0";
          continue;
        }
        v.copy(c.pos).project(camera);
        if (v.z > 1) {
          el.style.opacity = "0";
          continue;
        }
        el.style.opacity = String(inWin);
        el.style.transform = `translate3d(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px, 0)`;
      }
    };

    /* ---- reduced motion: one static frame, no scrub, no loop ---- */
    if (prefersReduced) {
      const p = handle.staticPose ?? 0.9;
      progressRef.current = p;
      handle.update(p, 0);
      projectCallouts(p);
      renderer.render(scene, camera);
      setReady(true);
      return () => {
        ro.disconnect();
        calloutEls.forEach(({ el }) => el.remove());
        handle.dispose?.();
        disposeScene(scene);
        envRT.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    }

    /* ---- scrub ---- */
    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        root.style.setProperty("--p", String(self.progress));
      },
    });

    /* ---- render loop: gsap ticker, paused off-screen/hidden ---- */
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(root);
    const onVis = () => (visible = visible && document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);

    const tick = () => {
      if (!visible || document.hidden) return;
      const p = progressRef.current;
      const t = (performance.now() - startT) / 1000;
      handle.update(p, t);
      projectCallouts(p);
      renderer.render(scene, camera);
    };
    gsap.ticker.add(tick);
    setReady(true);

    return () => {
      gsap.ticker.remove(tick);
      st.kill();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      calloutEls.forEach(({ el }) => el.remove());
      handle.dispose?.();
      disposeScene(scene);
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [build, fov]);

  return { rootRef, canvasRef, calloutLayerRef, progressRef, ready, reduced };
}

/* ---- photoreal imagery helpers ---------------------------------------------
   The variants build their realism from the client's actual renders (spine
   cutaway + 8 component cutouts). Photos carry their own baked lighting, so
   they render UNLIT (MeshBasic, toneMapped: false) — the same rule as the
   brand decal in ElevatorScene — and the scene sells depth around them with
   fog, light cones, particles and motion. */

const texLoader = new THREE.TextureLoader();

export function loadPhoto(url: string): THREE.Texture {
  const t = texLoader.load(url);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export interface PhotoPlane {
  group: THREE.Group;
  mat: THREE.MeshBasicMaterial;
}

/** an unlit, alpha-preserving photo plane sized by height (width = h·aspect) */
export function photoPlane(url: string, height: number, aspect: number, framed = false): PhotoPlane {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({
    map: loadPhoto(url),
    transparent: true,
    toneMapped: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(height * aspect, height), mat);
  mesh.renderOrder = 4;
  group.add(mesh);
  if (framed) {
    // photo plates with a baked background get a hairline frame + backing
    const w = height * aspect;
    const backing = new THREE.Mesh(
      new THREE.PlaneGeometry(w + 0.08, height + 0.08),
      new THREE.MeshBasicMaterial({ color: 0x2facec, transparent: true, opacity: 0.35, toneMapped: false, depthWrite: false })
    );
    backing.position.z = -0.01;
    backing.renderOrder = 3;
    group.add(backing);
  }
  return { group, mat };
}

/** soft elliptical contact glow to ground a floating photo (canvas radial) */
let glowTex: THREE.Texture | null = null;
export function contactGlow(
  radius: number,
  color = "#2facec"
): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> {
  if (!glowTex) {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    grad.addColorStop(0, "rgba(255,255,255,0.85)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    glowTex = new THREE.CanvasTexture(c);
  }
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(radius * 2, radius * 0.8),
    new THREE.MeshBasicMaterial({
      map: glowTex,
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    })
  );
  m.rotation.x = -Math.PI / 2;
  m.renderOrder = 2;
  return m;
}

function disposeScene(scene: THREE.Scene) {
  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    for (const m of mats) {
      for (const val of Object.values(m)) {
        if (val instanceof THREE.Texture) val.dispose();
      }
      m.dispose();
    }
  });
  scene.clear();
}
