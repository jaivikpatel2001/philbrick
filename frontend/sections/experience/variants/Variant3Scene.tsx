"use client";
/* =============================================================================
   VARIANT 3 — "ENGINEERING BLUEPRINT" (photoreal imagery edition)

   Storyboard: the machine stands as a living blueprint — azure wireframe on a
   drafting grid. A luminous scan ring sweeps up and, below it, the REAL
   machine materialises (the client's cutaway render, clipped by the scan
   plane). Once real, the drawing has done its job: all 8 real component
   cutouts detach and fly to an exploded technical layout, each with a named
   callout. Ends on the complete documented system.

   Technique: a clipping plane partitions blueprint lines (above) from the
   photo plane (below) — one scrubbed value, perfectly reversible, no shader
   recompiles. Photos render unlit (baked lighting).
   ========================================================================== */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Button } from "@/components/ui/Button";
import {
  useHeroScene,
  poseCamera,
  beat,
  lerp,
  photoPlane,
  type HeroSceneCtx,
  type HeroSceneHandle,
  type HeroCallout,
  type CamStop,
} from "./heroSceneKit";
import { PART_ASSETS, SPINE_ASSET } from "./partAssets";
import styles from "./variants.module.css";

export const V3_SCROLL_VH = 780;

const AZURE = 0x2facec;
const SPINE_H = 8.4;
const MODEL_TOP = 8.2;
const MODEL_BOTTOM = -0.4;

const CAM: CamStop[] = [
  { p: 0.0, pos: [6.5, 4.4, 11.5], look: [0, 3.8, 0] },
  { p: 0.3, pos: [1.5, 4.8, 12.5], look: [0, 3.9, 0] },
  { p: 0.52, pos: [-5, 4.4, 12], look: [0, 3.8, 0] },
  { p: 0.8, pos: [-1.5, 4.2, 15], look: [0, 3.9, 0] },
  { p: 1.0, pos: [2.5, 4.4, 16], look: [0, 3.9, 0] },
];

const sweepY = (p: number) => lerp(MODEL_BOTTOM, MODEL_TOP, beat(p, 0.12, 0.5));

/* exploded layout: two documented columns, all 8 real parts */
const EXPLODE: { key: string; x: number; y: number; h: number }[] = [
  { key: "motor", x: -4.4, y: 6.6, h: 2.1 },
  { key: "display", x: 4.4, y: 6.7, h: 1.5 },
  { key: "doors", x: -4.6, y: 4.7, h: 1.7 },
  { key: "key-switch", x: 4.5, y: 4.8, h: 1.8 },
  { key: "safety", x: -4.3, y: 2.6, h: 2.1 },
  { key: "control-panel", x: 4.3, y: 2.5, h: 2.7 },
  { key: "interior", x: -4.5, y: 0.7, h: 1.7 },
  { key: "emergency", x: 4.5, y: 0.6, h: 1.5 },
];
const EXPLODE_START = 0.56;
const EXPLODE_END = 0.92;
const explodeWindow = (i: number): [number, number] => {
  const step = (EXPLODE_END - EXPLODE_START) / EXPLODE.length;
  return [EXPLODE_START + i * step, EXPLODE_START + (i + 1) * step];
};

/* stylised blueprint line drawing of the machine (the "draft" stage) */
interface LineSpec {
  geo: () => THREE.BufferGeometry;
  pos: [number, number, number];
  rot?: [number, number, number];
}
const DRAFT: LineSpec[] = [
  ...[-1, 1].flatMap((sx) =>
    [-1, 1].map((sz): LineSpec => ({
      geo: () => new THREE.BoxGeometry(0.22, 8, 0.22),
      pos: [sx * 1.9, 3.6, sz * 1.4],
    }))
  ),
  ...[-1.2, 1.2].map((x): LineSpec => ({
    geo: () => new THREE.BoxGeometry(0.12, 7.6, 0.12),
    pos: [x, 3.4, 0],
  })),
  { geo: () => new THREE.BoxGeometry(1.9, 2.1, 1.7), pos: [0, 2.6, 0] },
  { geo: () => new THREE.BoxGeometry(0.8, 1.5, 0.3), pos: [0, 4.6, -1.3] },
  { geo: () => new THREE.BoxGeometry(3.2, 0.22, 2.2), pos: [0, 7.05, 0] },
  { geo: () => new THREE.CylinderGeometry(0.4, 0.4, 1.1, 20), pos: [-0.55, 7.62, 0], rot: [0, 0, Math.PI / 2] },
  { geo: () => new THREE.CylinderGeometry(0.58, 0.58, 0.16, 28), pos: [0.6, 7.7, 0], rot: [Math.PI / 2, 0, Math.PI / 2] },
  ...[-0.6, 0.6].map((x): LineSpec => ({
    geo: () => new THREE.CylinderGeometry(0.14, 0.18, 0.7, 10),
    pos: [x, 0.05, 0],
  })),
];

function buildBlueprint(ctx: HeroSceneCtx): HeroSceneHandle {
  const { scene, camera, lowPerf } = ctx;
  scene.background = new THREE.Color(0x081019);
  scene.fog = new THREE.Fog(0x081019, 26, 60);

  scene.add(new THREE.HemisphereLight(0x3a5878, 0x060a10, 0.6));
  const key = new THREE.DirectionalLight(0xdfeeff, 1.1);
  key.position.set(-10, 14, 12);
  scene.add(key);

  /* drafting grid backdrop */
  const gc = document.createElement("canvas");
  gc.width = gc.height = 256;
  const g2 = gc.getContext("2d")!;
  g2.fillStyle = "#081019";
  g2.fillRect(0, 0, 256, 256);
  g2.strokeStyle = "rgba(47,172,236,0.16)";
  g2.lineWidth = 1;
  for (let i = 0; i <= 256; i += 32) {
    g2.beginPath(); g2.moveTo(i, 0); g2.lineTo(i, 256); g2.stroke();
    g2.beginPath(); g2.moveTo(0, i); g2.lineTo(256, i); g2.stroke();
  }
  g2.strokeStyle = "rgba(47,172,236,0.34)";
  g2.strokeRect(0, 0, 256, 256);
  const gridTex = new THREE.CanvasTexture(gc);
  gridTex.wrapS = gridTex.wrapT = THREE.RepeatWrapping;
  gridTex.repeat.set(8, 5);
  const gridMat = new THREE.MeshBasicMaterial({ map: gridTex, transparent: true, opacity: 0.5, depthWrite: false });
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(64, 40), gridMat);
  grid.position.set(0, 6, -9);
  scene.add(grid);
  const floorGridMat = gridMat.clone();
  const floorGrid = new THREE.Mesh(new THREE.PlaneGeometry(64, 44), floorGridMat);
  floorGrid.rotation.x = -Math.PI / 2;
  floorGrid.position.y = -0.42;
  scene.add(floorGrid);

  /* clipping: blueprint survives ABOVE the scan, the real photo exists BELOW */
  const bpClip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const photoClip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);

  const draftGroup = new THREE.Group();
  const draftMats: THREE.LineBasicMaterial[] = [];
  for (const spec of DRAFT) {
    const geo = spec.geo();
    const mat = new THREE.LineBasicMaterial({ color: AZURE, transparent: true, opacity: 0.9 });
    mat.clippingPlanes = [bpClip];
    draftMats.push(mat);
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat);
    geo.dispose();
    lines.position.set(...spec.pos);
    if (spec.rot) lines.rotation.set(...spec.rot);
    draftGroup.add(lines);
  }
  scene.add(draftGroup);

  /* THE REAL MACHINE, materialising under the scan */
  const spine = photoPlane(SPINE_ASSET.src, SPINE_H, SPINE_ASSET.aspect);
  spine.group.position.set(0, SPINE_H / 2 - 0.35, 0.2);
  spine.mat.clippingPlanes = [photoClip];
  scene.add(spine.group);

  /* scan ring + sparks */
  const ringMat = new THREE.MeshBasicMaterial({ color: AZURE, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false });
  const ring = new THREE.Group();
  const rw = 6.4, rd = 4.2, rt = 0.035;
  const mk = (w: number, d: number, x: number, z: number) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, rt, d), ringMat);
    m.position.set(x, 0, z);
    ring.add(m);
  };
  mk(rw, rt, 0, rd / 2); mk(rw, rt, 0, -rd / 2); mk(rt, rd, rw / 2, 0); mk(rt, rd, -rw / 2, 0);
  scene.add(ring);

  const sparkCount = lowPerf ? 60 : 130;
  const sp = new Float32Array(sparkCount * 3);
  let seed = 13;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < sparkCount; i++) {
    sp[i * 3] = (rnd() - 0.5) * 6.4;
    sp[i * 3 + 1] = 0;
    sp[i * 3 + 2] = (rnd() - 0.5) * 4.2;
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const sparks = new THREE.Points(
    sparkGeo,
    new THREE.PointsMaterial({ color: 0x9fdcff, size: 0.06, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(sparks);

  /* the 8 REAL parts, docked inside the machine until the explosion phase */
  const partPlanes = EXPLODE.map((c, i) => {
    const asset = PART_ASSETS.find((a) => a.key === c.key)!;
    const pp = photoPlane(asset.src, c.h, asset.aspect, asset.framed);
    pp.group.position.set(0, SPINE_H / 2 - 0.35, 0.3);
    pp.mat.opacity = 0;
    if (asset.framed) (pp.group.children[1] as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>).material.opacity = 0;
    scene.add(pp.group);
    return { ...c, i, asset, pp };
  });

  const target = new THREE.Vector3();

  const callouts: HeroCallout[] = partPlanes.map((p) => {
    const [a, b] = explodeWindow(p.i);
    return {
      key: p.key,
      pos: new THREE.Vector3(p.x, p.y + p.h * 0.58, 0.3),
      range: [a + 0.01, Math.min(0.97, b + 0.05)],
      title: p.asset.component.name,
      sub: p.asset.component.tagline,
      side: p.x < 0 ? "left" : "right",
    };
  });

  return {
    staticPose: 0.96,
    callouts,
    update(p, t) {
      poseCamera(camera, CAM, p, target);
      camera.position.y += Math.sin(t * 0.35) * 0.05;

      const y = sweepY(p);
      bpClip.constant = -y; // blueprint above the scan
      photoClip.constant = y; // the real machine below it

      const scanActive = p > 0.1 && p < 0.52;
      ring.position.y = y;
      ringMat.opacity = (scanActive ? 0.85 : 0) * (0.75 + Math.sin(t * 6) * 0.25);
      sparks.position.y = y + 0.05;
      (sparks.material as THREE.PointsMaterial).opacity = scanActive ? 0.85 : 0;
      sparks.rotation.y = t * 0.35;

      // blueprint lines shimmer while drafting
      draftMats.forEach((m, i) => {
        m.opacity = 0.75 + Math.sin(t * 1.6 + i) * 0.18;
      });

      // grid recedes once the machine is real
      const fadeGrid = 1 - beat(p, 0.55, 0.85) * 0.8;
      gridMat.opacity = 0.5 * fadeGrid;
      floorGridMat.opacity = 0.4 * fadeGrid;

      // explosion: each real part detaches to its documented position
      for (const part of partPlanes) {
        const [a, b] = explodeWindow(part.i);
        const k = beat(p, a, a + (b - a) * 0.72);
        part.pp.mat.opacity = k;
        part.pp.group.position.x = lerp(0, part.x, k);
        part.pp.group.position.y = lerp(SPINE_H / 2 - 0.35, part.y, k);
        part.pp.group.position.z = lerp(0.3, 1.1, k);
        if (part.asset.framed) {
          (part.pp.group.children[1] as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>).material.opacity = k * 0.35;
        }
        part.pp.group.quaternion.copy(camera.quaternion);
      }
    },
  };
}

const CAPTIONS: { range: [number, number]; index: string; title: string; sub: string }[] = [
  { range: [0.1, 0.24], index: "01 Drafted", title: "It starts on the board.", sub: "Every Philbrick system begins as engineering." },
  { range: [0.28, 0.5], index: "02 Materialised", title: "The scan makes it real.", sub: "Drawing becomes working machine." },
  { range: [0.58, 0.9], index: "03 Documented", title: "Eight components, itemised.", sub: "Every part named, built and supported in-house." },
];

export function Variant3Scene() {
  const { rootRef, canvasRef, calloutLayerRef, progressRef, reduced } = useHeroScene({
    build: buildBlueprint,
    fov: 40,
  });
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tick = () => {
      const p = progressRef.current ?? 0;
      if (introRef.current) {
        const k = 1 - beat(p, 0.03, 0.1);
        introRef.current.style.opacity = String(k);
        introRef.current.style.transform = `translate(-50%, calc(-50% - ${(1 - k) * 40}px))`;
      }
      capRefs.current.forEach((el, i) => {
        if (!el) return;
        const [a, b] = CAPTIONS[i].range;
        const k = beat(p, a, a + 0.04) * (1 - beat(p, b - 0.04, b));
        el.style.opacity = String(k);
        el.style.transform = `translateY(${(1 - k) * 14}px)`;
      });
      const done = beat(p, 0.945, 0.99);
      if (scrimRef.current) scrimRef.current.style.opacity = String(done * 0.9);
      if (outroRef.current) {
        outroRef.current.style.opacity = String(done);
        outroRef.current.style.transform = `translate(-50%, calc(-50% + ${(1 - done) * 24}px))`;
      }
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [progressRef]);

  return (
    <section
      ref={rootRef as React.RefObject<HTMLElement>}
      className={styles.section}
      style={{ height: reduced ? "auto" : `${V3_SCROLL_VH}vh` }}
      aria-label="Engineering blueprint: the drawing becomes the real machine, then all eight components are documented"
    >
      <div className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
        <div className={styles.vignette} aria-hidden />
        <div ref={calloutLayerRef} className={styles.calloutLayer} aria-hidden />

        <div ref={introRef} className={styles.intro}>
          <p className={styles.eyebrow}>Variant 03 · Engineering blueprint</p>
          <h1 className={styles.title}>
            From drawing board <em>to running steel.</em>
          </h1>
          <p className={styles.lead}>
            Scroll to run the scan: the blueprint becomes the real machine, then
            all eight components step out to be counted.
          </p>
        </div>

        {CAPTIONS.map((c, i) => (
          <div
            key={c.index}
            ref={(el) => {
              capRefs.current[i] = el;
            }}
            className={styles.caption}
          >
            <span className={styles.captionIndex}>{c.index}</span>
            <span className={styles.captionTitle}>{c.title}</span>
            <span className={styles.captionSub}>{c.sub}</span>
          </div>
        ))}

        <div ref={scrimRef} className={styles.outroScrim} aria-hidden />
        <div ref={outroRef} className={styles.outro}>
          <p className={styles.outroLine}>Engineered on paper. Proven in buildings.</p>
          <div className={styles.outroCtas}>
            <Button href="/products" withArrow>
              Explore all products
            </Button>
            <Button href="/contact" variant="ghost" withArrow>
              Request a quote
            </Button>
          </div>
        </div>

        <p className={styles.cue} aria-hidden>
          Scroll to explore
        </p>
        <div className={styles.progress} aria-hidden />
      </div>
    </section>
  );
}
