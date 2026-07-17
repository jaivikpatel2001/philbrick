"use client";
/* =============================================================================
   VARIANT 4 — "IMMERSIVE STORYTELLING" (single take edition)

   One continuous camera take, no cuts, no scene swaps (the earlier five scene
   version flashed at the boundaries — client feedback): the real machine and
   ALL 8 real components stand along one long studio gallery. The camera opens
   on the cutaway machine, then tracks laterally past every component — each
   one lit as the camera arrives — and finally pulls back and up to frame the
   entire line-up in a closing wide shot.

   Photos render unlit (baked lighting); atmosphere comes from light cones,
   contact glows, dust and fog. Everything is one scene graph — nothing
   toggles, so there is nothing to flash.
   ========================================================================== */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { Button } from "@/components/ui/Button";
import {
  useHeroScene,
  beat,
  lerp,
  photoPlane,
  contactGlow,
  type HeroSceneCtx,
  type HeroSceneHandle,
  type HeroCallout,
} from "./heroSceneKit";
import { PART_ASSETS, SPINE_ASSET } from "./partAssets";
import styles from "./variants.module.css";

export const V4_SCROLL_VH = 840;

/* the gallery line-up: story order — cabin, controls, access, emergency,
   doors, signalling, drive, safety */
const ROW: { key: string; x: number; h: number }[] = [
  { key: "interior", x: 7, h: 4.2 },
  { key: "control-panel", x: 11.5, h: 3.5 },
  { key: "key-switch", x: 15.5, h: 2.1 },
  { key: "emergency", x: 19.5, h: 2.0 },
  { key: "doors", x: 23.5, h: 2.5 },
  { key: "display", x: 27.5, h: 1.9 },
  { key: "motor", x: 31.5, h: 2.9 },
  { key: "safety", x: 35.5, h: 2.9 },
];

/* camera track: intro on the machine, lateral take, closing pull back */
const INTRO_END = 0.12;
const TRACK_END = 0.86;
const TRACK_X0 = 1.2;
const TRACK_X1 = 37.5;
const partP = (x: number) => INTRO_END + ((x - TRACK_X0) / (TRACK_X1 - TRACK_X0)) * (TRACK_END - INTRO_END);

function buildStory(ctx: HeroSceneCtx): HeroSceneHandle {
  const { scene, camera, lowPerf } = ctx;
  scene.background = new THREE.Color(0x05080d);
  scene.fog = new THREE.Fog(0x05080d, 10, 46);

  const darkFloorMat = new THREE.MeshPhysicalMaterial({ color: 0x0d1118, metalness: 0.2, roughness: 0.25, clearcoat: 0.4, clearcoatRoughness: 0.3 });
  scene.add(new THREE.HemisphereLight(0x2c3c52, 0x04060a, 0.42));

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(78, 20), darkFloorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.x = 20;
  scene.add(floor);

  /* ---- the machine opens the take ---- */
  const hero = photoPlane(SPINE_ASSET.src, 7.2, SPINE_ASSET.aspect);
  hero.group.position.set(0, 3.75, 0);
  scene.add(hero.group);
  const heroGlow = contactGlow(2.6, "#7fb8dd");
  heroGlow.position.set(0, 0.02, 0);
  scene.add(heroGlow);
  const heroCone = new THREE.Mesh(
    new THREE.ConeGeometry(3.2, 10.5, 24, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.045, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
  );
  heroCone.position.set(-1.1, 5.4, -0.6);
  heroCone.rotation.z = 0.1;
  scene.add(heroCone);

  /* ---- the 8 real components along the gallery ---- */
  const staged = ROW.map((r) => {
    const a = PART_ASSETS.find((x) => x.key === r.key)!;
    const pp = photoPlane(a.src, r.h, a.aspect, a.framed);
    const yCenter = r.h / 2 + 0.55;
    pp.group.position.set(r.x, yCenter, 0);
    scene.add(pp.group);
    const glow = contactGlow(Math.max(0.9, (r.h * a.aspect) / 2 + 0.3));
    glow.position.set(r.x, 0.02, 0);
    scene.add(glow);
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(0.8, r.h * a.aspect * 0.7), r.h + 2.4, 20, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xcfe8ff, transparent: true, opacity: 0.028, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })
    );
    cone.position.set(r.x, (r.h + 2.4) / 2 + 0.1, -0.2);
    scene.add(cone);
    return { ...r, a, pp, glow, cone, yCenter };
  });

  /* studio dust across the whole gallery */
  const dustCount = lowPerf ? 140 : 300;
  const dp = new Float32Array(dustCount * 3);
  let seed = 5;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < dustCount; i++) {
    dp[i * 3] = rnd() * 44 - 3;
    dp[i * 3 + 1] = rnd() * 7;
    dp[i * 3 + 2] = (rnd() - 0.5) * 7;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({ color: 0x9fdcff, size: 0.045, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  scene.add(dust);

  const billboards = [hero.group, ...staged.map((s) => s.pp.group)];
  const target = new THREE.Vector3();

  const callouts: HeroCallout[] = staged.map((s) => {
    const at = partP(s.x);
    return {
      key: s.key,
      pos: new THREE.Vector3(s.x, s.yCenter + s.h * 0.58, 0),
      range: [at - 0.045, at + 0.05],
      title: s.a.component.name,
      sub: s.a.component.tagline,
      side: "right",
    };
  });

  return {
    staticPose: 0.94,
    callouts,
    update(p, t) {
      /* one continuous camera: push in on the machine, track the gallery,
         pull back to frame everything — a single unbroken move */
      const intro = beat(p, 0, INTRO_END);
      const track = beat(p, INTRO_END, TRACK_END);
      const finale = beat(p, TRACK_END + 0.015, 0.97);

      const camX = lerp(lerp(0.4, TRACK_X0, intro), TRACK_X1, track);
      const lookX = camX + lerp(0.4, 0.8, track);

      /* intro frames the FULL machine (it is 7.2 tall — the camera must sit
         far enough back and aim at its centre or the render gets cropped),
         then eases down to part height for the lateral take */
      camera.position.set(
        lerp(camX, 19, finale),
        lerp(lerp(2.9, 2.5, track), 8.6, finale),
        lerp(lerp(14.2, 7.6, intro), 30, finale)
      );
      target.set(
        lerp(lookX, 19, finale),
        lerp(lerp(3.6, 2.1, track), 2.8, finale),
        0
      );
      camera.lookAt(target);
      camera.position.x += Math.sin(t * 0.3) * 0.05;
      camera.position.y += Math.sin(t * 0.24) * 0.03;

      /* each part gets its light as the camera arrives (and the finale lights
         the whole line-up at once) */
      for (const s of staged) {
        const d = Math.abs(camX - s.x);
        const near = Math.max(0, 1 - d / 3.2);
        const glow = Math.max(near, finale * 0.85);
        s.cone.material.opacity = 0.024 + glow * 0.055;
        s.glow.material.opacity = 0.14 + glow * 0.32;
      }
      heroCone.material.opacity = 0.03 + (1 - track) * 0.035 + finale * 0.03;
      heroGlow.material.opacity = 0.2 + (1 - track) * 0.2 + finale * 0.2;

      dust.rotation.y = t * 0.015;
      for (const b of billboards) b.quaternion.copy(camera.quaternion);
    },
  };
}

const CAPTIONS: { range: [number, number]; index: string; title: string; sub: string }[] = [
  { range: [0.02, 0.11], index: "The machine", title: "One system, one take.", sub: "Walk the line: all eight components, no cuts." },
  { range: [0.14, 0.3], index: "The cabin", title: "Where riders live.", sub: "Interior, controls and access, built in-house." },
  { range: [0.34, 0.5], index: "Access and safety", title: "Always within reach.", sub: "Key switch and emergency call, every trip." },
  { range: [0.52, 0.66], index: "The doors", title: "The first handshake.", sub: "Mechanism and signalling that guide every ride." },
  { range: [0.68, 0.84], index: "The drive", title: "The heart of the rise.", sub: "Traction machine and the safety system behind it." },
  { range: [0.88, 0.95], index: "The line-up", title: "All eight, one supplier.", sub: "Everything above is engineered by Philbrick." },
];

export function Variant4Scene() {
  const { rootRef, canvasRef, calloutLayerRef, progressRef, reduced } = useHeroScene({
    build: buildStory,
    fov: 38,
  });
  const introRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tick = () => {
      const p = progressRef.current ?? 0;
      if (introRef.current) {
        const k = 1 - beat(p, 0.03, 0.09);
        introRef.current.style.opacity = String(k);
        introRef.current.style.transform = `translate(-50%, calc(-50% - ${(1 - k) * 40}px))`;
      }
      capRefs.current.forEach((el, i) => {
        if (!el) return;
        const [a, b] = CAPTIONS[i].range;
        const k = beat(p, a, a + 0.035) * (1 - beat(p, b - 0.035, b));
        el.style.opacity = String(k);
        el.style.transform = `translateY(${(1 - k) * 14}px)`;
      });
      const done = beat(p, 0.955, 0.995);
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
      style={{ height: reduced ? "auto" : `${V4_SCROLL_VH}vh` }}
      aria-label="A single take product film: the real machine and all eight Philbrick components along one gallery"
    >
      <div className={styles.stage}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden />
        <div className={styles.vignette} aria-hidden />
        <div ref={calloutLayerRef} className={styles.calloutLayer} aria-hidden />

        <div ref={introRef} className={styles.intro}>
          <p className={styles.eyebrow}>Variant 04 · One continuous take</p>
          <h1 className={styles.title}>
            Eight components. <em>No cuts.</em>
          </h1>
          <p className={styles.lead}>
            Scroll to walk the line: the machine first, then every component,
            lit as you arrive.
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
          <p className={styles.outroLine}>Every part of the ride runs on Philbrick.</p>
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
