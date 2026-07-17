"use client";
/* =============================================================================
   VARIANT 2 — "ARCHITECTURAL JOURNEY" (photoreal imagery edition)

   The night skyline and hero tower are the stage; the PRODUCT is real: the
   client's cutaway machine render stands as the tower's core, and all 8 real
   component cutouts reveal one by one alongside it as the camera climbs.

   Storyboard: skyline → dolly toward the tower → the glass facade dissolves
   and floor plates draw in → the real machine core is revealed → the camera
   climbs past all 8 photoreal components (each with a named callout) → the
   film ends on a pull back with the complete system and every part in place.

   Camera: one continuous keyframed dolly, no cuts. Scrub reversible. Photo
   planes render unlit (their lighting is baked); the scene sells depth with
   fog, emissive accents, dust and the vignette.
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

export const V2_SCROLL_VH = 820;

const AZURE = 0x2facec;

const FLOORS = 12;
const FLOOR_H = 1.75;
const TOWER_H = FLOORS * FLOOR_H; // 21
const SPINE_H = 14;
const SPINE_Y = 10.5; // spans y 3.5 .. 17.5, covering the whole climb
/* the floor plates keep an OPEN CORE (|x| < CORE_HALF) so the machine render
   and the component cutouts are never sliced by slab geometry */
const CORE_HALF = 4.9;

const CAM: CamStop[] = [
  { p: 0.0, pos: [0, 6, 46], look: [0, 10, 0] },
  { p: 0.13, pos: [0, 8, 30], look: [0, 10.5, 0] },
  { p: 0.27, pos: [0, 9, 15], look: [0, 9, 0] },
  { p: 0.36, pos: [2.8, 4.3, 8.4], look: [0, 4.3, -0.5] },
  { p: 0.82, pos: [2.8, 16.6, 8.4], look: [0, 16.6, -0.5] },
  { p: 1.0, pos: [11.5, 12, 27], look: [0, 10.5, 0] },
];

/* the 8 real parts, staged along the climb; each part's height matches the
   camera's altitude at its beat so it is always centred in view when revealed */
const CLIMB: { key: string; y: number; x: number; h: number }[] = [
  { key: "safety", y: 4.3, x: -2.4, h: 2.6 },
  { key: "interior", y: 6.06, x: 2.5, h: 2.8 },
  { key: "control-panel", y: 7.82, x: -2.3, h: 3.2 },
  { key: "key-switch", y: 9.58, x: 2.4, h: 2.2 },
  { key: "emergency", y: 11.34, x: -2.4, h: 2.0 },
  { key: "display", y: 13.1, x: 2.5, h: 1.8 },
  { key: "doors", y: 14.86, x: -2.5, h: 2.2 },
  { key: "motor", y: 16.62, x: 2.4, h: 2.6 },
];
const CLIMB_START = 0.36;
const CLIMB_END = 0.84;
const partWindow = (i: number): [number, number] => {
  const step = (CLIMB_END - CLIMB_START) / CLIMB.length;
  return [CLIMB_START + i * step, CLIMB_START + (i + 1) * step];
};

function buildArchitecturalJourney(ctx: HeroSceneCtx): HeroSceneHandle {
  const { scene, camera, lowPerf } = ctx;
  scene.background = new THREE.Color(0x070b12);
  scene.fog = new THREE.Fog(0x070b12, 30, 95);

  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x151b24, metalness: 0.7, roughness: 0.5 });
  const slabMat = new THREE.MeshStandardMaterial({ color: 0x232c38, metalness: 0.3, roughness: 0.7 });

  scene.add(new THREE.HemisphereLight(0x35506e, 0x05070c, 0.55));
  const key = new THREE.DirectionalLight(0xbfd8ff, 1.15);
  key.position.set(-14, 26, 18);
  scene.add(key);
  const rim = new THREE.DirectionalLight(AZURE, 0.5);
  rim.position.set(16, 10, -14);
  scene.add(rim);

  /* ---- abstract city backdrop (environment, not product) ---- */
  const cityGeo = new THREE.BoxGeometry(1, 1, 1);
  const cityMat = new THREE.MeshStandardMaterial({ color: 0x0c121b, metalness: 0.4, roughness: 0.8 });
  const cityCount = lowPerf ? 26 : 44;
  const city = new THREE.InstancedMesh(cityGeo, cityMat, cityCount);
  const m4 = new THREE.Matrix4();
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < cityCount; i++) {
    const ang = rnd() * Math.PI * 2;
    const rad = 24 + rnd() * 42;
    const h = 6 + rnd() * 22;
    m4.compose(
      new THREE.Vector3(Math.cos(ang) * rad, h / 2 - 0.5, Math.sin(ang) * rad - 6),
      new THREE.Quaternion(),
      new THREE.Vector3(3.5 + rnd() * 5, h, 3.5 + rnd() * 5)
    );
    city.setMatrixAt(i, m4);
  }
  scene.add(city);

  const lightCount = lowPerf ? 320 : 700;
  const lp = new Float32Array(lightCount * 3);
  for (let i = 0; i < lightCount; i++) {
    const ang = rnd() * Math.PI * 2;
    const rad = 23 + rnd() * 44;
    lp[i * 3] = Math.cos(ang) * rad;
    lp[i * 3 + 1] = 0.6 + rnd() * 24;
    lp[i * 3 + 2] = Math.sin(ang) * rad - 6;
  }
  const lightsGeo = new THREE.BufferGeometry();
  lightsGeo.setAttribute("position", new THREE.BufferAttribute(lp, 3));
  const cityLights = new THREE.Points(
    lightsGeo,
    new THREE.PointsMaterial({ color: 0xffe0b0, size: 0.16, transparent: true, opacity: 0.85 })
  );
  scene.add(cityLights);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 240),
    new THREE.MeshStandardMaterial({ color: 0x0a0e14, metalness: 0.2, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.6;
  scene.add(ground);

  /* ---- hero tower shell ---- */
  const tower = new THREE.Group();
  scene.add(tower);
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.34, TOWER_H, 0.34), darkMetal);
      col.position.set(sx * 6.6, TOWER_H / 2, sz * 4.6);
      tower.add(col);
    }
  /* floor plates as side ledges around an open core, so the machine render
     and the parts are never sliced by slab geometry */
  const ledgeW = 6.8 - CORE_HALF;
  const slabGeo = new THREE.BoxGeometry(ledgeW, 0.16, 9.6);
  const slabs: THREE.Mesh[] = [];
  for (let i = 0; i < FLOORS; i++) {
    for (const sx of [-1, 1]) {
      const s = new THREE.Mesh(slabGeo, slabMat);
      s.position.set(sx * (CORE_HALF + ledgeW / 2), i * FLOOR_H, 0);
      tower.add(s);
      slabs.push(s);
    }
  }
  /* depthWrite MUST be false: otherwise the glass box writes depth even when
     fully transparent and silently occludes every photo plane inside it */
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x9fc8e8, metalness: 0, roughness: 0.08, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false,
  });
  const facade = new THREE.Mesh(new THREE.BoxGeometry(13.8, TOWER_H, 9.8), glassMat);
  facade.position.y = TOWER_H / 2 - 0.1;
  tower.add(facade);

  /* ---- THE REAL MACHINE: the client's cutaway render as the tower core ---- */
  const spine = photoPlane(SPINE_ASSET.src, SPINE_H, SPINE_ASSET.aspect);
  spine.group.position.set(0, SPINE_Y, -1.8);
  spine.mat.opacity = 0;
  scene.add(spine.group);
  // a soft azure halo behind the machine so it reads against the dark core
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(SPINE_H * SPINE_ASSET.aspect * 1.5, SPINE_H * 1.1),
    new THREE.MeshBasicMaterial({ color: 0x123047, transparent: true, opacity: 0, depthWrite: false, toneMapped: false })
  );
  halo.position.set(0, SPINE_Y, -1.9);
  halo.renderOrder = 1;
  scene.add(halo);

  /* ---- the 8 REAL components, staged along the climb ---- */
  const partPlanes = CLIMB.map((c, i) => {
    const asset = PART_ASSETS.find((a) => a.key === c.key)!;
    const pp = photoPlane(asset.src, c.h, asset.aspect, asset.framed);
    pp.group.position.set(c.x * 0.2, c.y, -1.6);
    pp.mat.opacity = 0;
    if (asset.framed) (pp.group.children[1] as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>).material.opacity = 0;
    scene.add(pp.group);
    return { ...c, i, asset, pp };
  });

  /* shaft dust */
  const dustCount = lowPerf ? 90 : 180;
  const dp = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    dp[i * 3] = (rnd() - 0.5) * 9;
    dp[i * 3 + 1] = rnd() * TOWER_H;
    dp[i * 3 + 2] = (rnd() - 0.5) * 5;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({ color: 0x7fb8dd, size: 0.05, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(dust);

  const target = new THREE.Vector3();

  const callouts: HeroCallout[] = partPlanes.map((p) => {
    const [a, b] = partWindow(p.i);
    return {
      key: p.key,
      pos: new THREE.Vector3(p.x + (p.x < 0 ? -0.3 : 0.3) * p.h * 0.5, p.y + p.h * 0.55, 1.0),
      range: [a + 0.012, Math.min(0.965, b + 0.05)],
      title: p.asset.component.name,
      sub: p.asset.component.tagline,
      side: p.x < 0 ? "left" : "right",
    };
  });

  return {
    staticPose: 0.95,
    callouts,
    update(p, t) {
      poseCamera(camera, CAM, p, target);
      camera.position.x += Math.sin(t * 0.4) * 0.05;
      camera.position.y += Math.sin(t * 0.31) * 0.04;

      // facade dissolves as we pass through (and is fully removed from the
      // render once gone, so it can never occlude the machine)
      glassMat.opacity = 0.14 * (1 - beat(p, 0.26, 0.35));
      facade.visible = glassMat.opacity > 0.004;
      // floor plates draw in
      for (let i = 0; i < slabs.length; i++) {
        const k = beat(p, 0.22 + i * 0.012, 0.3 + i * 0.012);
        slabs[i].scale.set(Math.max(0.001, k), 1, Math.max(0.001, k));
      }
      // the real machine reveals as the camera enters
      const reveal = beat(p, 0.3, 0.4);
      spine.mat.opacity = reveal;
      halo.material.opacity = reveal * 0.5 * (0.85 + Math.sin(t * 1.2) * 0.15);

      // the 8 parts: slide out from the machine during their beat, then stay
      for (const part of partPlanes) {
        const [a, b] = partWindow(part.i);
        const k = beat(p, a, a + (b - a) * 0.7);
        part.pp.mat.opacity = k;
        part.pp.group.position.x = lerp(part.x * 0.2, part.x, k);
        part.pp.group.position.z = lerp(-1.6, 1.0, k);
        if (part.asset.framed) {
          (part.pp.group.children[1] as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>).material.opacity = k * 0.35;
        }
        // billboard toward the camera so the photo always reads true
        part.pp.group.quaternion.copy(camera.quaternion);
      }

      dust.rotation.y = t * 0.02;
      (cityLights.material as THREE.PointsMaterial).opacity = 0.75 + Math.sin(t * 0.7) * 0.1;
    },
  };
}

const CAPTIONS: { range: [number, number]; index: string; title: string; sub: string }[] = [
  { range: [0.12, 0.26], index: "01 Arrival", title: "Every tower has a spine.", sub: "Behind the glass, a Philbrick system is waiting." },
  { range: [0.3, 0.4], index: "02 The core", title: "The machine, revealed.", sub: "One system runs the whole vertical city." },
  { range: [0.44, 0.82], index: "03 The climb", title: "Eight components, one ride.", sub: "Every part engineered and built in-house." },
  { range: [0.86, 0.94], index: "04 The system", title: "All of it, working as one.", sub: "From the pit buffers to the traction machine." },
];

export function Variant2Scene() {
  const { rootRef, canvasRef, calloutLayerRef, progressRef, reduced } = useHeroScene({
    build: buildArchitecturalJourney,
    fov: 44,
  });
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tick = () => {
      const p = progressRef.current ?? 0;
      if (introRef.current) {
        const k = 1 - beat(p, 0.04, 0.11);
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
      const done = beat(p, 0.955, 0.995);
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
      style={{ height: reduced ? "auto" : `${V2_SCROLL_VH}vh` }}
      aria-label="Architectural journey: fly into the tower and climb past all eight Philbrick elevator components"
    >
      <div className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
        <div className={styles.vignette} aria-hidden />
        <div ref={calloutLayerRef} className={styles.calloutLayer} aria-hidden />

        <div ref={introRef} className={styles.intro}>
          <p className={styles.eyebrow}>Variant 02 · Architectural journey</p>
          <h1 className={styles.title}>
            The city moves <em>vertically.</em>
          </h1>
          <p className={styles.lead}>
            Scroll to fly into the tower and climb the real machine, all eight
            components revealed on the way up.
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
          <p className={styles.outroLine}>One system carries the whole building.</p>
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
