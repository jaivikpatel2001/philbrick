"use client";
/* =============================================================================
   VARIANT 5 — "NIGHT ARRIVAL" (imagegeneration.md §10.1 consistency block)

   The §10.1 world, built live: clear dry night, full moon fixed upper right,
   deserted streets; the main tower with warm amber windows, a dark podium, a
   double-height glass lobby and one thin steel canopy; a single brushed
   centre-opening elevator with an azure indicator (arrow only, no lettering).

   One continuous forward dolly (the §10.1 camera grammar): descend to eye
   height on the boulevard → approach the tower → through the glass lobby →
   the doors answer the call and part → beyond them, the machine itself: the
   real cutaway render and ALL 8 real components reveal one by one, named.

   Photos render unlit (baked lighting). Azure #109BDD and warm amber only,
   per the consistency block.
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

export const V5_SCROLL_VH = 880;

const AZURE = 0x109bdd; // §10.1 fixed accent
const AMBER = 0xffc57a; // §10.1 warm architectural light

/* client environment mattes (processed 2026-07-17; see imagegeneration.md §11.4) */
const ENV_DIR = "/images/home/hero-exploration/environment";
const TOWER_MATTE = { src: `${ENV_DIR}/tower-night.png`, aspect: 0.248 };
const LOBBY_MATTE = { src: `${ENV_DIR}/lobby-backdrop.png`, aspect: 0.679 };
const LEAF_MATTE = { src: `${ENV_DIR}/door-leaf.png`, aspect: 0.321 };

const CAM: CamStop[] = [
  { p: 0.0, pos: [0, 7, 27], look: [0, 8, -24] },
  { p: 0.14, pos: [0, 1.7, 13], look: [0, 2.6, -24] },
  { p: 0.3, pos: [0, 1.7, -6], look: [0, 2.0, -24] },
  /* frame the FULL portal (doors + indicator), then pass through quickly so
     the leaf textures never fill the screen as a blur */
  { p: 0.46, pos: [0, 1.9, -19.2], look: [0, 2.1, -23.4] },
  { p: 0.55, pos: [0, 1.9, -21.8], look: [0, 2.2, -30] },
  { p: 0.64, pos: [0, 2.2, -26.5], look: [0, 2.8, -44] },
  { p: 0.85, pos: [0, 2.9, -36], look: [0, 3.4, -44] },
  { p: 1.0, pos: [2.2, 3.1, -35.6], look: [0, 3.4, -44] },
];

/* the showcase beyond the doors: all 8 real parts around the machine */
const SHOWCASE: { key: string; x: number; y: number; h: number }[] = [
  { key: "motor", x: -3.1, y: 5.6, h: 1.8 },
  { key: "display", x: 3.1, y: 5.7, h: 1.4 },
  { key: "doors", x: -5.3, y: 3.9, h: 1.6 },
  { key: "key-switch", x: 5.2, y: 3.9, h: 1.7 },
  { key: "safety", x: -3.2, y: 2.0, h: 1.9 },
  { key: "control-panel", x: 3.2, y: 2.1, h: 2.4 },
  { key: "interior", x: -5.2, y: 1.2, h: 1.6 },
  { key: "emergency", x: 5.3, y: 1.3, h: 1.4 },
];
const SHOW_START = 0.6;
const SHOW_END = 0.92;
const showWindow = (i: number): [number, number] => {
  const step = (SHOW_END - SHOW_START) / SHOWCASE.length;
  return [SHOW_START + i * step, SHOW_START + (i + 1) * step];
};

function buildNightArrival(ctx: HeroSceneCtx): HeroSceneHandle {
  const { scene, camera, lowPerf } = ctx;
  scene.background = new THREE.Color(0x060a12);
  scene.fog = new THREE.Fog(0x060a12, 26, 110);

  const darkMass = new THREE.MeshStandardMaterial({ color: 0x0d1219, metalness: 0.4, roughness: 0.8 });
  const podium = new THREE.MeshStandardMaterial({ color: 0x0a0d13, metalness: 0.2, roughness: 0.6 });
  const brushed = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, metalness: 0.88, roughness: 0.3 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x1a212b, metalness: 0.7, roughness: 0.45 });
  const stone = new THREE.MeshPhysicalMaterial({ color: 0x10141b, metalness: 0.1, roughness: 0.2, clearcoat: 0.4, clearcoatRoughness: 0.3 });

  scene.add(new THREE.HemisphereLight(0x2c3c52, 0x04060a, 0.5));
  const moonLight = new THREE.DirectionalLight(0xcfe0f5, 0.9);
  moonLight.position.set(30, 34, -20);
  scene.add(moonLight);
  const warmEntry = new THREE.PointLight(AMBER, 1.6, 22, 1.8);
  warmEntry.position.set(0, 3.4, -17);
  scene.add(warmEntry);

  /* ---- the night sky: full moon fixed upper right + stars ---- */
  const moon = new THREE.Mesh(
    new THREE.CircleGeometry(3.2, 40),
    new THREE.MeshBasicMaterial({ color: 0xf3f6fa, toneMapped: false })
  );
  moon.position.set(36, 32, -78);
  scene.add(moon);
  const moonGlow = new THREE.Mesh(
    new THREE.CircleGeometry(6.4, 40),
    new THREE.MeshBasicMaterial({ color: 0xbcd2ea, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  moonGlow.position.set(36, 32, -78.5);
  scene.add(moonGlow);
  const starCount = lowPerf ? 220 : 420;
  const sp = new Float32Array(starCount * 3);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < starCount; i++) {
    sp[i * 3] = (rnd() - 0.5) * 180;
    sp[i * 3 + 1] = 12 + rnd() * 55;
    sp[i * 3 + 2] = -60 - rnd() * 40;
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xdde8f5, size: 0.14, transparent: true, opacity: 0.8 })
  );
  scene.add(stars);

  /* ---- ground + deserted boulevard ---- */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 200), darkMass);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  scene.add(ground);
  const boulevard = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 60),
    new THREE.MeshStandardMaterial({ color: 0x141a23, metalness: 0.2, roughness: 0.7 })
  );
  boulevard.rotation.x = -Math.PI / 2;
  boulevard.position.set(0, 0, 0);
  scene.add(boulevard);

  /* ---- flanking skylines: the client's night-city matte, mirrored.
     They belong to the CITY act only — faded out once the camera passes the
     doors, so the showcase sits in a clean dark studio void. ---- */
  const SKY = { src: `${ENV_DIR}/skyline-strip.png`, aspect: 3.046 };
  const skylineMats: THREE.MeshBasicMaterial[] = [];
  for (const [x, z, w, flip] of [
    [-26, -54, 48, false],
    [28, -60, 52, true],
  ] as [number, number, number, boolean][]) {
    const sk = photoPlane(SKY.src, w / SKY.aspect, SKY.aspect);
    sk.group.position.set(x, (w / SKY.aspect) / 2 - 0.4, z);
    if (flip) sk.group.scale.x = -1;
    scene.add(sk.group);
    skylineMats.push(sk.mat);
  }

  /* ---- THE MAIN TOWER (§10.1: slender, warm windows, podium, canopy) ---- */
  const towerGrp = new THREE.Group();
  towerGrp.position.set(0, 0, -24);
  scene.add(towerGrp);
  /* the client's slender night tower render stands as the building itself;
     the 3D lobby interior below stays real geometry for parallax up close */
  const towerMatte = photoPlane(TOWER_MATTE.src, 44, TOWER_MATTE.aspect);
  towerMatte.group.position.set(0, 21.4, -2);
  towerGrp.add(towerMatte.group);
  void podium;

  /* lobby interior: stone floor, columns, the single elevator on the far wall */
  const lobbyFloor = new THREE.Mesh(new THREE.PlaneGeometry(11, 7), stone);
  lobbyFloor.rotation.x = -Math.PI / 2;
  lobbyFloor.position.set(0, 0.02, 2.9);
  towerGrp.add(lobbyFloor);
  for (const sx of [-1, 1]) {
    const col = new THREE.Mesh(new THREE.BoxGeometry(0.5, 5.6, 0.5), graphite);
    col.position.set(sx * 3.6, 2.8, 2.4);
    towerGrp.add(col);
  }
  const elevWall = new THREE.Mesh(new THREE.BoxGeometry(11, 6, 0.4), graphite);
  elevWall.position.set(0, 3, 0.4);
  towerGrp.add(elevWall);
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(3.4, 4.3, 0.26), graphite);
  doorFrame.position.set(0, 2.1, 0.68);
  towerGrp.add(doorFrame);
  /* pitch black void behind the leaves: what the parting doors reveal */
  const voidQuad = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 4.0),
    new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false })
  );
  voidQuad.position.set(0, 2.0, 0.55);
  towerGrp.add(voidQuad);
  /* the client's brushed door leaf render, mirrored into the pair */
  const LEAF_H = 3.8;
  const panels: THREE.Object3D[] = [];
  const panelMats: THREE.MeshBasicMaterial[] = [];
  for (const sx of [-1, 1]) {
    const leaf = photoPlane(LEAF_MATTE.src, LEAF_H, LEAF_MATTE.aspect);
    leaf.group.position.set(sx * 0.62, 1.95, 0.84);
    if (sx > 0) leaf.group.scale.x = -1;
    towerGrp.add(leaf.group);
    panels.push(leaf.group);
    panelMats.push(leaf.mat);
  }
  // azure dot-matrix indicator: an up arrow only (no lettering, per §10.1)
  const ac = document.createElement("canvas");
  ac.width = 96;
  ac.height = 48;
  const ag = ac.getContext("2d")!;
  ag.fillStyle = "#04121d";
  ag.fillRect(0, 0, 96, 48);
  ag.fillStyle = "#109bdd";
  ag.beginPath();
  ag.moveTo(48, 8); ag.lineTo(62, 24); ag.lineTo(53, 24); ag.lineTo(53, 40); ag.lineTo(43, 40); ag.lineTo(43, 24); ag.lineTo(34, 24);
  ag.closePath();
  ag.fill();
  const indicator = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 0.45),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ac), transparent: true, toneMapped: false })
  );
  indicator.position.set(0, 4.5, 0.86);
  towerGrp.add(indicator);
  const doorGlow = new THREE.PointLight(AMBER, 1.2, 8, 2);
  doorGlow.position.set(0, 3.4, 1.6);
  towerGrp.add(doorGlow);

  /* entrance glass (dissolves as the camera passes through) */
  /* depthWrite false so the glass never occludes the showcase photo planes */
  const entGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x9fc8e8, metalness: 0, roughness: 0.06, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false,
  });
  const entGlass = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 4.4), entGlassMat);
  entGlass.position.set(0, 2.3, -17.6);
  scene.add(entGlass);

  /* ---- beyond the doors: the machine and all 8 components ---- */
  const showcase = new THREE.Group();
  showcase.position.set(0, 0, -44);
  scene.add(showcase);
  const spine = photoPlane(SPINE_ASSET.src, 7, SPINE_ASSET.aspect);
  spine.group.position.set(0, 3.6, 0);
  spine.mat.opacity = 0;
  showcase.add(spine.group);
  const showParts = SHOWCASE.map((c, i) => {
    const asset = PART_ASSETS.find((a) => a.key === c.key)!;
    const pp = photoPlane(asset.src, c.h, asset.aspect, asset.framed);
    pp.group.position.set(0, 3.6, 0.2);
    pp.mat.opacity = 0;
    if (asset.framed) (pp.group.children[1] as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>).material.opacity = 0;
    showcase.add(pp.group);
    return { ...c, i, asset, pp };
  });

  const target = new THREE.Vector3();

  const callouts: HeroCallout[] = showParts.map((p) => {
    const [a, b] = showWindow(p.i);
    return {
      key: p.key,
      pos: new THREE.Vector3(p.x, p.y + p.h * 0.62, -43.8),
      range: [a + 0.01, Math.min(0.97, b + 0.05)],
      title: p.asset.component.name,
      sub: p.asset.component.tagline,
      side: p.x < 0 ? "left" : "right",
    };
  });

  return {
    staticPose: 0.94,
    callouts,
    update(p, t) {
      poseCamera(camera, CAM, p, target);
      camera.position.x += Math.sin(t * 0.35) * 0.04;
      camera.position.y += Math.sin(t * 0.27) * 0.03;

      // entrance glass dissolves just before the camera crosses it
      entGlassMat.opacity = 0.16 * (1 - beat(p, 0.37, 0.43));
      entGlass.visible = entGlassMat.opacity > 0.004;
      // the doors answer the call and part from the centre, fully aside
      // BEFORE the camera crosses the threshold (no blur close-up)
      const open = beat(p, 0.45, 0.53);
      panels[0].position.x = -0.62 - open * 1.5;
      panels[1].position.x = 0.62 + open * 1.5;
      // ...then dissolve the leaves entirely as the camera reaches the doorway,
      // so the door textures never smear across the lens on the pass-through
      const leafFade = 1 - beat(p, 0.5, 0.56);
      for (const m of panelMats) m.opacity = leafFade;
      for (const leaf of panels) leaf.visible = leafFade > 0.004;
      (indicator.material as THREE.MeshBasicMaterial).opacity = (0.75 + Math.sin(t * 2.4) * 0.25) * leafFade;

      /* act change: once the camera has passed the doorway the whole city act
         (tower, lobby, doors) sits behind the lens — drop it from the render,
         and fade the skylines so the showcase lives in a clean dark studio */
      towerGrp.visible = p < 0.66;
      const cityFade = 1 - beat(p, 0.56, 0.66);
      for (const m of skylineMats) m.opacity = cityFade;
      towerMatte.mat.opacity = cityFade;

      // the machine waits beyond the threshold
      const reveal = beat(p, 0.55, 0.64);
      spine.mat.opacity = reveal;

      for (const part of showParts) {
        const [a, b] = showWindow(part.i);
        const k = beat(p, a, a + (b - a) * 0.72);
        part.pp.mat.opacity = k;
        part.pp.group.position.x = lerp(0, part.x, k);
        part.pp.group.position.y = lerp(3.6, part.y, k);
        part.pp.group.position.z = lerp(0.2, 0.6, k);
        if (part.asset.framed) {
          (part.pp.group.children[1] as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>).material.opacity = k * 0.35;
        }
        part.pp.group.quaternion.copy(camera.quaternion);
      }
      spine.group.quaternion.copy(camera.quaternion);

      stars.rotation.z = t * 0.002;
    },
  };
}

const CAPTIONS: { range: [number, number]; index: string; title: string; sub: string }[] = [
  { range: [0.1, 0.28], index: "01 Arrival", title: "Night falls on a Philbrick tower.", sub: "Every journey begins at the street." },
  { range: [0.32, 0.46], index: "02 The lobby", title: "The doors keep the promise.", sub: "Brushed steel, azure signal, warm light." },
  { range: [0.5, 0.58], index: "03 The call", title: "The car answers.", sub: "Centre opening, quiet and sure." },
  { range: [0.62, 0.92], index: "04 The system", title: "What waits behind the doors.", sub: "The machine and all eight components, named." },
];

export function Variant5Scene() {
  const { rootRef, canvasRef, calloutLayerRef, progressRef, reduced } = useHeroScene({
    build: buildNightArrival,
    fov: 46,
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
      if (scrimRef.current) scrimRef.current.style.opacity = String(done * 0.88);
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
      style={{ height: reduced ? "auto" : `${V5_SCROLL_VH}vh` }}
      aria-label="Night arrival: approach the tower, the elevator doors open, and the machine with all eight components is revealed"
    >
      <div className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
        <div className={styles.vignette} aria-hidden />
        <div ref={calloutLayerRef} className={styles.calloutLayer} aria-hidden />

        <div ref={introRef} className={styles.intro}>
          <p className={styles.eyebrow}>Variant 05 · Night arrival</p>
          <h1 className={styles.title}>
            Engineered <em>for movement.</em>
          </h1>
          <p className={styles.lead}>
            Scroll to arrive: down the boulevard, through the lobby, and past
            the doors to the machine itself.
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
          <p className={styles.outroLine}>The city rests. The system never does.</p>
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
