"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiCpu,
  FiWifi,
  FiActivity,
  FiNavigation,
  FiZap,
  FiMonitor,
  FiArrowDown,
} from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { INDUSTRY_IMG } from "@/data/images";
import styles from "./ScrollStory.module.css";

/* ---- Exploded-view component callouts (scene 3) -------------------------- */
const PARTS = [
  { n: "01", name: "Traction Machine", tip: "Gearless permanent magnet drive with regenerative braking.", side: "left", top: "12%", left: "1%" },
  { n: "02", name: "Suspension Belts", tip: "Carbon fibre belts, seven times lighter than steel.", side: "left", top: "27%", left: "0%", mobileHide: true },
  { n: "03", name: "Guide Rails", tip: "Cold drawn steel rails machined to micron tolerances.", side: "left", top: "45%", left: "1%" },
  { n: "04", name: "Counterweight", tip: "Balances the car to cut motor load and energy use.", side: "left", top: "62%", left: "0%", mobileHide: true },
  { n: "05", name: "Control Systems", tip: "Control panel managing motion, safety, doors and signalling.", side: "right", top: "10%", left: "64%" },
  { n: "06", name: "Cabin", tip: "Aerospace grade car frame with active vibration damping.", side: "right", top: "28%", left: "70%", mobileHide: true },
  { n: "07", name: "Glass Doors", tip: "Silent belt operators and anti crush infrared curtains.", side: "right", top: "45%", left: "70%" },
  { n: "08", name: "Safety Brakes", tip: "Progressive safety gear arrests the car in milliseconds.", side: "right", top: "58%", left: "64%", mobileHide: true },
  { n: "09", name: "Elevator IoT", tip: "Streams live status and fault data to the cloud for remote monitoring.", side: "right", top: "72%", left: "66%" },
];

/* ---- Intelligence tags (scene 4) ---------------------------------------- */
const TECH = [
  { icon: FiCpu, label: "Live Monitoring", top: "16%", left: "2%" },
  { icon: FiWifi, label: "IoT Connectivity", top: "26%", left: "66%" },
  { icon: FiActivity, label: "Fault Alerts", top: "48%", left: "0%", mobileHide: true },
  { icon: FiNavigation, label: "Usage Insight", top: "60%", left: "68%", mobileHide: true },
  { icon: FiZap, label: "Energy Efficiency", top: "74%", left: "6%" },
  { icon: FiMonitor, label: "Remote Diagnostics", top: "82%", left: "60%" },
];

/* ---- Project tiles (scene 5) -------------------------------------------- */
const TILES = [
  { img: INDUSTRY_IMG.residential, name: "Residential" },
  { img: INDUSTRY_IMG.commercial, name: "Commercial" },
  { img: INDUSTRY_IMG.healthcare, name: "Healthcare" },
  { img: INDUSTRY_IMG.hospitality, name: "Hospitality" },
];

const SCENES = ["Arrival", "Future", "Architecture", "Anatomy", "Intelligence", "Proof", "Reveal"];

/* The interior story starts at t=14 of a 114-unit timeline (see below), so the
   old thresholds map to (14 + t) / 114 of total scroll. */
function sceneFromProgress(p: number) {
  if (p < 0.12) return 0;
  if (p < 0.25) return 1;
  if (p < 0.43) return 2;
  if (p < 0.65) return 3;
  if (p < 0.82) return 4;
  if (p < 0.91) return 5;
  return 6;
}

export function ScrollStory() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = gsap.utils.selector(root);
      const s = (c: string) => `.${c}`;

      const rig = q(s(styles.rig))[0];
      const doorL = q(s(styles.doorL))[0];
      const doorR = q(s(styles.doorR))[0];
      const cabinGlow = q(s(styles.cabinGlow))[0];
      const building = q(s(styles.building))[0];
      const exterior = q(s(styles.exterior))[0];
      const extTower = q(s(styles.extTower))[0];
      const blueprint = q(s(styles.blueprint))[0];
      const labels = q(s(styles.labels))[0];
      const techLayer = q(s(styles.techLayer))[0];
      const techTags = q("[data-tech]");
      const finale = q(s(styles.finale))[0];
      const flare = q(s(styles.flare))[0];
      const cue = q(s(styles.cue))[0];
      const scenes = q("[data-scene]");
      const tiles = q("[data-tile]");
      const cabin = q(s(styles.cabin))[0];
      const ropes = q(s(styles.ropes))[0];

      const exploding = [
        { el: q(s(styles.machine))[0], x: 0, y: -96 },
        { el: q(s(styles.railL))[0], x: -86, y: 0 },
        { el: q(s(styles.railR))[0], x: 86, y: 0 },
        { el: q(s(styles.counterweight))[0], x: 124, y: -14 },
        { el: q(s(styles.brakeL))[0], x: -66, y: 0 },
        { el: q(s(styles.brakeR))[0], x: 66, y: 0 },
        { el: q(s(styles.controls))[0], x: 104, y: -36 },
      ];
      const explodingEls = exploding.map((p) => p.el);

      /* ---- Baseline (timeline time 0 = exterior arrival: the tower is
         visible, the rig waits hidden behind the facade) ---- */
      gsap.set(exterior, { autoAlpha: 1 });
      gsap.set(rig, { autoAlpha: 0, y: 0, scale: 0.95, rotateY: 0 });
      gsap.set(building, { autoAlpha: 0, y: 50 });
      gsap.set([blueprint, labels, techLayer, finale, flare], { autoAlpha: 0 });
      gsap.set(blueprint, { scale: 1.04 });
      gsap.set(cabinGlow, { autoAlpha: 0 });
      gsap.set(scenes, { autoAlpha: 0, y: 28 });
      gsap.set(scenes[0], { autoAlpha: 1, y: 0 });
      gsap.set(tiles, { autoAlpha: 0, y: 24 });
      gsap.set(techTags, { autoAlpha: 0, scale: 0.8 });
      // Note: the resting hero state (exterior + scene 1 copy) is fully visible
      // via the set() calls above — no time-based entrance is required, so the
      // hero is never blank on load. A CSS "settle" handles the on-load flourish.

      const dummy = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.width = `${self.progress * 100}%`;
            setActive((prev) => {
              const next = sceneFromProgress(self.progress);
              return next === prev ? prev : next;
            });
          },
        },
      });

      /* ---- Scene 1 — arrival (0–14): push in toward the tower at night,
         then cross-fade through the facade into the elevator rig, so even the
         fallback reads "outside → inside" ---- */
      tl.to(cue, { autoAlpha: 0, duration: 4 }, 4);
      tl.to(extTower, { scale: 1.5, y: 110, ease: "power1.in", duration: 15 }, 0);
      tl.to(scenes[0], { autoAlpha: 0, y: -24, duration: 4 }, 9);
      tl.to(exterior, { autoAlpha: 0, duration: 5 }, 10);
      tl.to(rig, { autoAlpha: 1, scale: 1, duration: 6 }, 10);
      tl.to(scenes[1], { autoAlpha: 1, y: 0, duration: 5 }, 11.5);

      /* ---- The original interior story, nested so its local t0–100 maps to
         global 14–114 (≈ scroll 0.12–1.0) ---- */
      const inner = gsap.timeline({ defaults: { ease: "none" } });

      // Continuous ambient parallax across the whole journey.
      inner.to(q(s(styles.grid))[0], { yPercent: -6, duration: 100 }, 0);
      inner.to(q(s(styles.glowBlue))[0], { yPercent: 26, duration: 100 }, 0);

      /* ---- Scene 2 — the rise (0–15) ---- */
      inner.to(rig, { y: -14, duration: 14 }, 0.01);
      inner.to(scenes[1], { autoAlpha: 0, y: -24, duration: 5 }, 14);

      /* ---- Scene 3 — architecture / blueprint (15–35) ---- */
      inner.to(building, { autoAlpha: 0.55, y: 0, duration: 9 }, 14);
      inner.to(rig, { scale: 1.14, y: 18, duration: 20 }, 15);
      inner.to(blueprint, { autoAlpha: 1, scale: 1, duration: 10 }, 16);
      inner.to(scenes[2], { autoAlpha: 1, y: 0, duration: 6 }, 18);
      inner.to(scenes[2], { autoAlpha: 0, y: -24, duration: 5 }, 33);
      inner.to(blueprint, { autoAlpha: 0, duration: 5 }, 33);

      /* ---- Scene 4 — exploded view (35–60) ---- */
      inner.to(rig, { scale: 1, y: 0, rotateY: -18, ease: "power2.inOut", duration: 8 }, 34);
      exploding.forEach((p) =>
        inner.to(p.el, { x: p.x, y: p.y, ease: "power2.out", duration: 12 }, 36)
      );
      inner.to(cabin, { scale: 1.05, duration: 12 }, 36);
      inner.to(ropes, { autoAlpha: 0.2, y: -28, duration: 10 }, 36);
      inner.to(scenes[3], { autoAlpha: 1, y: 0, duration: 6 }, 37);
      inner.to(labels, { autoAlpha: 1, duration: 6 }, 44);
      inner.to(labels, { autoAlpha: 0, duration: 5 }, 58);
      inner.to(scenes[3], { autoAlpha: 0, y: -24, duration: 5 }, 58);

      /* ---- Scene 5 — intelligent technology (60–80) ---- */
      inner.to(rig, { rotateY: 0, scale: 0.96, duration: 9 }, 59);
      inner.to(explodingEls, { autoAlpha: 0.4, duration: 8 }, 59);
      inner.to(techLayer, { autoAlpha: 1, duration: 8 }, 60);
      inner.to(techTags, { autoAlpha: 1, scale: 1, stagger: 1.1, duration: 5 }, 61);
      inner.to(scenes[4], { autoAlpha: 1, y: 0, duration: 6 }, 61);
      inner.to(techTags, { autoAlpha: 0, duration: 4 }, 78);
      inner.to(techLayer, { autoAlpha: 0, duration: 5 }, 78);
      inner.to(scenes[4], { autoAlpha: 0, y: -24, duration: 5 }, 78);

      /* ---- Scene 6 — reassemble + project showcase (80–90) ---- */
      inner.to(
        explodingEls,
        { x: 0, y: 0, autoAlpha: 1, ease: "power2.inOut", duration: 9 },
        79
      );
      inner.to(cabin, { scale: 1, duration: 9 }, 79);
      inner.to(ropes, { autoAlpha: 1, y: 0, duration: 9 }, 79);
      inner.to(rig, { scale: 0.72, duration: 10 }, 80);
      inner.to(scenes[5], { autoAlpha: 1, y: 0, duration: 5 }, 81);
      inner.to(tiles, { autoAlpha: 1, y: 0, stagger: 0.8, duration: 4 }, 82);
      inner.to(scenes[5], { autoAlpha: 0, y: -24, duration: 4 }, 89);

      /* ---- Scene 7 — final reveal (90–100) ---- */
      inner.to(rig, { scale: 0.98, duration: 5 }, 88);
      inner.to(doorL, { xPercent: -100, ease: "power2.inOut", duration: 8 }, 89);
      inner.to(doorR, { xPercent: 100, ease: "power2.inOut", duration: 8 }, 89);
      inner.to(cabinGlow, { autoAlpha: 1, duration: 8 }, 89);
      inner.to(rig, { scale: 2.6, ease: "power2.in", duration: 9 }, 92);
      inner.to(flare, { autoAlpha: 1, duration: 7 }, 93);
      inner.to(finale, { autoAlpha: 1, duration: 5 }, 95);
      inner.set(finale, { pointerEvents: "auto" }, 96);
      inner.to(dummy, { v: 1, duration: 0.01 }, 100);

      tl.add(inner, 14);
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <section
      ref={root}
      className={styles.story}
      data-reduced={reduced}
      aria-label="The Philbrick elevator experience"
    >
      <div className={styles.stage}>
        {/* Atmosphere */}
        <div className={styles.sky} aria-hidden />
        <div className={styles.grid} aria-hidden />
        <div className={styles.glowGold} aria-hidden />
        <div className={styles.glowBlue} aria-hidden />
        <div className={styles.building} aria-hidden />
        {/* Exterior establishing shot (scene 1) — crossfades into the rig */}
        <div className={styles.exterior} aria-hidden>
          <div className={styles.extSideL} />
          <div className={styles.extSideR} />
          <div className={styles.extTower}>
            <span className={styles.extEntrance} />
          </div>
        </div>
        <div className={styles.vignette} aria-hidden />
        <div className={styles.topScrim} aria-hidden />

        <div className={styles.layout}>
          {/* Scene copy — left, vertically centered */}
          <div className={styles.copy}>
            <div className={styles.scenes}>
              <div className={styles.scene} data-scene>
                <div className={styles.sceneInner}>
                  <span className={styles.eyebrow}>01 Arrival</span>
                  {/* The fallback hero's opening line doubles as the page H1 */}
                  <h1 className={styles.sceneTitle}>
                    Engineered for <em>movement.</em>
                  </h1>
                  <p className={styles.sceneSub}>
                    Night falls on a Philbrick-equipped tower. Step through the
                    glass, your elevator is already waiting.
                  </p>
                </div>
              </div>

              <div className={styles.scene} data-scene>
                <div className={styles.sceneInner}>
                  <span className={styles.eyebrow}>02 Vertical Mobility</span>
                  <h2 className={styles.sceneTitle}>
                    Engineering <em>Movement.</em>
                  </h2>
                  <p className={styles.sceneSub}>
                    Elevating cities with intelligent vertical transportation.
                  </p>
                  <div className={styles.sceneNote}>
                    <span>Designed for modern architecture</span>
                    <span>Built for safety</span>
                    <span>Engineered for generations</span>
                  </div>
                </div>
              </div>

              <div className={styles.scene} data-scene>
                <div className={styles.sceneInner}>
                  <span className={styles.eyebrow}>03 Architecture × Engineering</span>
                  <h2 className={styles.sceneTitle}>
                    Every great building begins with <em>movement.</em>
                  </h2>
                  <p className={styles.sceneSub}>
                    Our systems are engineered alongside architects, developers
                    and engineers, from the first blueprint to the final rise.
                  </p>
                </div>
              </div>

              <div className={styles.scene} data-scene>
                <div className={styles.sceneInner}>
                  <span className={styles.eyebrow}>04 Anatomy</span>
                  <h2 className={styles.sceneTitle}>
                    Precision in <em>every component.</em>
                  </h2>
                  <p className={styles.sceneSub}>
                    Every system is designed, tested and optimised for
                    reliability, efficiency and passenger comfort. Hover a node to
                    explore.
                  </p>
                </div>
              </div>

              <div className={styles.scene} data-scene>
                <div className={styles.sceneInner}>
                  <span className={styles.eyebrow}>05 Intelligence</span>
                  <h2 className={styles.sceneTitle}>
                    Smart elevators for <em>smart buildings.</em>
                  </h2>
                  <p className={styles.sceneSub}>
                    Real-time monitoring and predictive intelligence ensure
                    maximum uptime and operational efficiency.
                  </p>
                </div>
              </div>

              <div className={styles.scene} data-scene>
                <div className={styles.sceneInner}>
                  <span className={styles.eyebrow}>06 Applications</span>
                  <h2 className={styles.sceneTitle}>
                    Built into <em>every kind of building.</em>
                  </h2>
                  <p className={styles.sceneSub}>
                    From homes and offices to hospitals and industrial sites,
                    Philbrick components go into elevators everywhere.
                  </p>
                  <div className={styles.projRow}>
                    {TILES.map((t) => (
                      <div key={t.name} className={styles.projTile} data-tile>
                        <Image src={t.img} alt={t.name} fill sizes="150px" />
                        <span>{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The rig — right */}
          <div className={styles.rigStage}>
            <div className={styles.rigWrap} aria-hidden>
              <div className={styles.rig}>
                <svg
                  className={styles.blueprint}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line data-bp="faint" x1="50" y1="0" x2="50" y2="100" />
                  <line data-bp="faint" x1="0" y1="22" x2="100" y2="22" />
                  <line data-bp="faint" x1="0" y1="50" x2="100" y2="50" />
                  <line data-bp="faint" x1="0" y1="78" x2="100" y2="78" />
                  <rect data-bp="line" x="26" y="8" width="48" height="84" />
                  <ellipse data-bp="gold" cx="50" cy="50" rx="30" ry="34" />
                  <line data-bp="line" x1="14" y1="10" x2="14" y2="90" />
                  <line data-bp="line" x1="11" y1="10" x2="17" y2="10" />
                  <line data-bp="line" x1="11" y1="90" x2="17" y2="90" />
                  <path data-bp="line" d="M2 2 L2 9 M2 2 L9 2" />
                  <path data-bp="line" d="M98 98 L98 91 M98 98 L91 98" />
                </svg>

                <div className={styles.shaft} />
                <div className={styles.machine} />
                <div className={styles.ropes}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.railL} />
                <div className={styles.railR} />
                <div className={styles.counterweight} />
                <div className={styles.controls} />

                <div className={styles.cabin}>
                  <div className={styles.carShadow} />
                  <div className={styles.car}>
                    <div className={styles.carInterior} />
                    <div className={styles.cabinGlow} />
                    <div className={styles.ceiling} />
                    <div className={styles.transom}>
                      <span className={styles.floorNo}>24</span>
                    </div>
                    <div className={styles.doorL} />
                    <div className={styles.doorR} />
                    <div className={styles.sill} />
                  </div>
                  <div className={styles.brakeL} />
                  <div className={styles.brakeR} />
                </div>

                <div className={styles.sensors}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              {/* Exploded-view callouts */}
              <div className={styles.labels}>
                {PARTS.map((p) => (
                  <div
                    key={p.n}
                    className={styles.label}
                    data-side={p.side}
                    style={{ top: p.top, left: p.left }}
                    data-mobile={p.mobileHide ? "hide" : undefined}
                    tabIndex={0}
                  >
                    <span className={styles.dot} />
                    <span className={styles.labelText}>
                      <span className={styles.labelNum}>{p.n}</span>
                      {p.name}
                    </span>
                    <span className={styles.tip}>{p.tip}</span>
                  </div>
                ))}
              </div>

              {/* Intelligence layer */}
              <div className={styles.techLayer}>
                <div className={styles.dataRing} />
                <div className={styles.dataRing} />
                {TECH.map((t) => (
                  <div
                    key={t.label}
                    className={styles.techTag}
                    style={{ top: t.top, left: t.left }}
                    data-tech
                    data-mobile={t.mobileHide ? "hide" : undefined}
                  >
                    <t.icon />
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.flare} aria-hidden />

        {/* Finale */}
        <div className={styles.finale}>
          <div className={styles.finaleInner}>
            <h2 className={styles.finaleTitle}>
              Moving People.
              <br />
              <em>Elevating Possibilities.</em>
            </h2>
            <p className={styles.finaleSub}>Innovation · Reliability · Excellence</p>
            <div className={styles.finaleActions}>
              <Button href="/contact" size="lg" withArrow>
                Request consultation
              </Button>
              <Button href="#solutions" size="lg" variant="secondary">
                Explore solutions
              </Button>
            </div>
          </div>
        </div>

        {/* HUD */}
        <div className={styles.hud} aria-hidden>
          {SCENES.map((label, i) => (
            <div
              key={label}
              className={`${styles.hudDot} ${i === active ? styles.hudDotActive : ""}`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className={styles.progressTrack} aria-hidden>
          <div ref={bar} className={styles.progressBar} />
        </div>

        <div className={styles.cue} aria-hidden>
          <span>Scroll</span>
          <span className={styles.cueLine} />
          <FiArrowDown />
        </div>
      </div>
    </section>
  );
}
