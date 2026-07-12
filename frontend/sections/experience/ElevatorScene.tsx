"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { FiArrowDown } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/components/providers/ThemeProvider";
import { MODEL } from "@/data/model";
import { ENV } from "@/data/environment";
import { ELEVATOR_COMPONENTS, type ElevatorComponent } from "@/data/elevatorComponents";
import { ScrollStory } from "./ScrollStory";
import { ComponentModal } from "./ComponentModal";
import story from "./ScrollStory.module.css";
import styles from "./ElevatorScene.module.css";

const SCROLL_VH = 1300;

/* Story beats (progress 0→1): exterior establishing shot → dolly-zoom approach →
   threshold crossing through the facade → lobby (doors part) → component
   exploration → outro/light-wipe. One scrubbed progress value drives it all. */
const ARRIVE_END = 0.12; // wide exterior establishing shot
const APPROACH_END = 0.24; // push-in toward the entrance (fov narrows)
const INSIDE_P = 0.34; // camera fully inside — the lobby wide shot
const COMP_START = 0.42;
const COMP_END = 0.9;

/* Copy for the exterior beats (the component captions take over afterwards).
   The arrival line follows the theme: night scene in dark mode, daylight in light. */
const BEATS = [
  {
    eyebrow: "01 Arrival",
    lead: "Engineered for",
    em: "movement.",
    sub: "Night falls on a Philbrick-equipped tower. Every journey begins at the street.",
    subDay: "Daylight on a Philbrick-equipped tower. Every journey begins at the street.",
  },
  {
    eyebrow: "02 The Approach",
    lead: "Your elevator",
    em: "arrives.",
    sub: "Through the glass, the lobby is already waiting.",
    subDay: "Through the glass, the lobby is already waiting.",
  },
];
function beatFromP(p: number) {
  if (p < ARRIVE_END - 0.005) return 0;
  if (p < APPROACH_END - 0.005) return 1;
  return -1;
}

/* 3D anchor + auto-framing per component (camera = anchor + view·dist, look at anchor) */
const FRAMING: Record<string, { anchor: [number, number, number]; view: [number, number, number]; dist: number }> = {
  "control-panel": { anchor: [0.86, 0.1, 0.58], view: [-0.66, 0.2, 0.55], dist: 1.7 },
  "key-switch": { anchor: [0.86, -0.15, 0.6], view: [-0.66, 0.12, 0.5], dist: 1.25 },
  display: { anchor: [0.86, 0.43, 0.6], view: [-0.58, 0.22, 0.6], dist: 1.45 },
  emergency: { anchor: [0.86, -0.25, 0.6], view: [-0.66, 0.06, 0.5], dist: 1.15 },
  doors: { anchor: [0, 1.05, 0.85], view: [0.05, 0.12, 1], dist: 2.7 },
  motor: { anchor: [0, 2.1, -0.1], view: [0.35, 0.45, 1], dist: 3.1 },
  safety: { anchor: [-1.0, -0.4, -0.05], view: [-0.7, -0.12, 0.6], dist: 2.0 },
  interior: { anchor: [-0.25, 0.1, -0.15], view: [0.25, 0.22, 1], dist: 2.4 },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}
function activeFromP(p: number) {
  if (p < COMP_START || p > COMP_END) return -1;
  const step = (COMP_END - COMP_START) / ELEVATOR_COMPONENTS.length;
  return Math.min(ELEVATOR_COMPONENTS.length - 1, Math.max(0, Math.floor((p - COMP_START) / step)));
}
function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
}

export function ElevatorScene() {
  const [fallback, setFallback] = useState(false);
  const toFallback = useCallback(() => setFallback(true), []);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setFallback(mq.matches || !hasWebGL());
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (fallback) return <ScrollStory />;
  return <Scene3D onContextFail={toFallback} />;
}

function Scene3D({ onContextFail }: { onContextFail: () => void }) {
  const root = useRef<HTMLElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const activeRef = useRef(-1);
  const hotspotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(-1);
  const [beat, setBeat] = useState(0);
  const [openComponent, setOpenComponent] = useState<ElevatorComponent | null>(null);
  const { theme } = useTheme();

  /* Single write point for everything driven by scroll progress (3D pose reads
     progress.current in the rAF loop; HUD state updates here). Also reused by
     the dev-only scrub hook so beats can be tested without real scrolling. */
  const applyProgress = useCallback((p: number) => {
    progress.current = p;
    if (bar.current) bar.current.style.width = `${p * 100}%`;
    const a = activeFromP(p);
    activeRef.current = a;
    setActive((prev) => (prev === a ? prev : a));
    const b = beatFromP(p);
    setBeat((prev) => (prev === b ? prev : b));
  }, []);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    /* Scene3D renders before the capability check flips to the fallback, so a
       device with no working WebGL would throw here and blank the hero — hand
       over to ScrollStory instead. */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (err) {
      console.warn("[ElevatorScene] WebGL context failed, using ScrollStory fallback:", err);
      onContextFail();
      return;
    }
    /* Adaptive quality flag — touch / small-viewport / low-core devices get a
       lighter renderer config (DPR, shadow map, post) so the hero stays smooth
       on mobile without touching the desktop experience. A high-DPR phone
       rendering a full-screen postprocessed scene at native DPR (2-3x) is the
       single biggest mobile GPU cost, so we cap the pixel ratio lower there. */
    const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const smallVp = Math.min(window.innerWidth, window.innerHeight) < 760;
    const lowPerf = coarse || smallVp || (navigator.hardwareConcurrency ?? 8) <= 4;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPerf ? 1.5 : 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 600);

    /* Palette for the new exterior pulls from styles/tokens.css (with the same
       fallbacks the tokens define) so the facade matches the site exactly. */
    const cssVar = (name: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };
    /* WARM is the architectural warmth of window/interior lighting — kept a
       realistic amber, independent of the brand palette. BLUE is Philbrick's
       azure brand accent (from --blue), used for the sign glow and screens. */
    const GOLD = new THREE.Color("#e3b277");
    const BLACK = new THREE.Color(cssVar("--black", "#070a0f"));
    const GRAPHITE = new THREE.Color(cssVar("--graphite", "#0f141c"));
    const BLUE = new THREE.Color(cssVar("--blue", "#109bdd"));
    const STEEL = new THREE.Color(cssVar("--silver", "#c7cdd5"));
    const WARM_WINDOW = GOLD.clone().lerp(new THREE.Color("#ffffff"), 0.35);
    const WHITE = new THREE.Color("#ffffff");

    /* Day/night follows the site theme ([data-theme] on <html>), blended
       smoothly in the pose loop. Every themed change below is uniform- or
       texture-only — never a shader define — so switching themes (or fading
       lights) can never trigger a mid-scroll shader recompile stall. */
    const themeIsLight = () => document.documentElement.getAttribute("data-theme") === "light";
    let dayTarget = themeIsLight() ? 1 : 0;
    let dayBlend = dayTarget;
    const themeObserver = new MutationObserver(() => {
      dayTarget = themeIsLight() ? 1 : 0;
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    /* Atmospheric depth for the exterior beats. Starts well beyond every
       interior camera distance, so the lobby/cabin shots are untouched. */
    scene.fog = new THREE.Fog(BLACK.clone().lerp(GRAPHITE, 0.5), 60, 300);

    const pmrem = new THREE.PMREMGenerator(renderer);
    let envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = ENV.intensity;
    pmrem.dispose();
    // A real interior HDRI is the biggest realism upgrade — reflects a believable
    // room in every metal/glass surface. Optional (see data/environment.ts).
    if (ENV.hdri) {
      new RGBELoader().load(
        ENV.hdri,
        (hdr) => {
          hdr.mapping = THREE.EquirectangularReflectionMapping;
          const p2 = new THREE.PMREMGenerator(renderer);
          const rt = p2.fromEquirectangular(hdr);
          scene.environment = rt.texture;
          if (ENV.background) scene.background = rt.texture;
          envRT.dispose();
          envRT = rt;
          hdr.dispose();
          p2.dispose();
        },
        undefined,
        (err) => console.warn("[ElevatorScene] HDRI failed to load, using studio env:", err)
      );
    }

    /* ---------- Textures ---------- */
    const disposables: { dispose(): void }[] = [];
    const track = <T extends { dispose(): void }>(o: T) => {
      disposables.push(o);
      return o;
    };
    const brushed = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 512;
      const x = c.getContext("2d")!;
      x.fillStyle = "#8f8f8f";
      x.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 7000; i++) {
        const y = Math.random() * 512, lx = Math.random() * 512, len = 6 + Math.random() * 70;
        const g = 100 + Math.floor(Math.random() * 130);
        x.strokeStyle = `rgba(${g},${g},${g},0.06)`;
        x.beginPath();
        x.moveTo(lx, y);
        x.lineTo(lx + len, y);
        x.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(2, 2);
      t.colorSpace = THREE.NoColorSpace;
      return track(t);
    })();
    const makeMarble = (repeat: number, light: boolean) => {
      const c = document.createElement("canvas");
      c.width = c.height = 512;
      const x = c.getContext("2d")!;
      const g = x.createLinearGradient(0, 0, 512, 512);
      if (light) { g.addColorStop(0, "#e9e6df"); g.addColorStop(1, "#d7d2c8"); }
      else { g.addColorStop(0, "#33363d"); g.addColorStop(1, "#262931"); }
      x.fillStyle = g;
      x.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 26; i++) {
        const v = light ? 90 + Math.random() * 60 : 150 + Math.random() * 80;
        x.strokeStyle = `rgba(${v},${v},${v + 8},${0.05 + Math.random() * 0.12})`;
        x.lineWidth = 0.4 + Math.random() * 2;
        x.beginPath();
        let px = Math.random() * 512, py = Math.random() * 512;
        x.moveTo(px, py);
        for (let j = 0; j < 6; j++) { px += (Math.random() - 0.5) * 200; py += (Math.random() - 0.5) * 200; x.lineTo(px, py); }
        x.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeat, repeat);
      return track(t);
    };
    const floorMarble = makeMarble(6, true);
    const wallMarble = makeMarble(3, false);

    /* ---------- Materials ---------- */
    const steel = new THREE.MeshPhysicalMaterial({ color: 0xb9bdc4, metalness: 1, roughness: 0.32, roughnessMap: brushed, anisotropy: 0.4, anisotropyRotation: Math.PI / 2, envMapIntensity: 1.3, clearcoat: 0.15, clearcoatRoughness: 0.35 });
    const darkMetal = new THREE.MeshPhysicalMaterial({ color: 0x171a20, metalness: 0.92, roughness: 0.42, roughnessMap: brushed, envMapIntensity: 1.0 });
    const gold = new THREE.MeshPhysicalMaterial({ color: 0xc7a96a, metalness: 1, roughness: 0.32, anisotropy: 0.4, envMapIntensity: 1.35, clearcoat: 0.3, clearcoatRoughness: 0.2 });
    const panelMat = new THREE.MeshPhysicalMaterial({ color: 0x8e97a5, metalness: 1, roughness: 0.34, roughnessMap: brushed, anisotropy: 0.5, envMapIntensity: 1.05, transparent: true, opacity: 1 });
    const mirror = new THREE.MeshPhysicalMaterial({ color: 0x232b34, metalness: 1, roughness: 0.08, envMapIntensity: 1.3 });
    const stone = new THREE.MeshStandardMaterial({ map: floorMarble, color: 0x6b6b72, metalness: 0.1, roughness: 0.4, envMapIntensity: 0.7 });
    // Lobby floor + walls (threshold beat only — the cabin uses `stone`/panel
    // materials). Kept deliberately deep and matte so the strong daylight rig
    // can't blow the lobby out to white; env reflections dialled down to kill glare.
    const floorMat = new THREE.MeshStandardMaterial({ map: floorMarble, color: 0x514e48, metalness: 0.1, roughness: 0.5, envMapIntensity: 0.34 });
    const wallMat = new THREE.MeshStandardMaterial({ map: wallMarble, color: 0x282b31, metalness: 0.05, roughness: 0.62, envMapIntensity: 0.34 });
    const coveMat = new THREE.MeshStandardMaterial({ color: 0xffe9c8, emissive: 0xffe1b4, emissiveIntensity: 0.55 });
    const ledMat = new THREE.MeshStandardMaterial({ color: 0xfff4d6, emissive: 0xffe6b0, emissiveIntensity: 0.85 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x041019, emissive: 0x2facec, emissiveIntensity: 1.4 });
    const redMat = new THREE.MeshStandardMaterial({ color: 0xd23a2c, emissive: 0x6e150c, emissiveIntensity: 0.7, metalness: 0.2, roughness: 0.5 });

    /* ---------- Helpers ---------- */
    const geoCache = new Map<string, RoundedBoxGeometry>();
    const rbox = (w: number, h: number, d: number, r = 0.02) => {
      const key = `${w}_${h}_${d}_${r}`;
      let g = geoCache.get(key);
      if (!g) { g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)); geoCache.set(key, g); disposables.push(g); }
      return g;
    };
    const box = (parent: THREE.Object3D, size: [number, number, number], pos: [number, number, number], mat: THREE.Material, cast = true, r = 0.02) => {
      const m = new THREE.Mesh(rbox(size[0], size[1], size[2], r), mat);
      m.position.set(...pos);
      m.castShadow = cast;
      m.receiveShadow = true;
      parent.add(m);
      return m;
    };

    const W = 2.0, H = 2.6, D = 1.8;
    const FY = -H / 2;

    const world = new THREE.Group();
    scene.add(world);

    /* ===== Lobby =====
       Sized to the tower footprint (see the exterior below) so nothing pokes
       through the facade in the establishing shots: marble runs from the back
       wall to the entrance glass line at z = FRONT_Z. */
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(22, 21), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, FY, 2.5);
    floor.receiveShadow = true;
    world.add(floor);
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 9), wallMat);
    backWall.position.set(0, FY + 4, -4.2);
    world.add(backWall);
    for (const sx of [-1, 1]) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(21, 9), wallMat);
      w.rotation.y = -sx * (Math.PI / 2);
      w.position.set(sx * 7, FY + 4, 2.5);
      world.add(w);
      box(world, [0.08, 7, 0.12], [sx * 2.6, FY + 3.2, -4.1], gold, false, 0.02);
    }
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(20, 21), wallMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, FY + 8, 2.5);
    world.add(ceiling);
    for (const cz of [-3, 0, 3]) {
      const cove = new THREE.Mesh(rbox(9, 0.06, 0.4, 0.02), coveMat);
      cove.position.set(0, FY + 7.8, cz);
      world.add(cove);
    }

    /* ===== Exterior: tower, entrance, street, sky, city context =====
       Procedural and cheap — the window grid is a single InstancedMesh per
       material, neighbours share one flat material, the sky gradient is baked
       once. Only visible during the arrival/approach/threshold beats. */
    const exterior = new THREE.Group();
    world.add(exterior);
    const TW = 22, TD = 21, TH = 45, TZ = 2.5; // tower footprint/height
    const FRONT_Z = TZ + TD / 2; // = 13 — the facade / entrance plane
    const PODIUM_TOP = FY + 6;
    const ENT_W = 6, ENT_H = 4.5; // entrance opening the camera passes through

    const exBox = (w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material) => {
      const g = new THREE.BoxGeometry(w, h, d);
      disposables.push(g);
      const m = new THREE.Mesh(g, mat);
      m.position.set(x, y, z);
      exterior.add(m);
      return m;
    };

    const massMat = new THREE.MeshStandardMaterial({ color: GRAPHITE.clone().lerp(BLACK, 0.15), metalness: 0.2, roughness: 0.8, envMapIntensity: 0.5 });
    /* Facade envelope — slabs around the entrance instead of a solid box, so
       the lit lobby stays visible through the glass from outside. */
    exBox((TW - ENT_W) / 2, PODIUM_TOP - FY, 0.25, -(TW + ENT_W) / 4, (PODIUM_TOP + FY) / 2, FRONT_Z - 0.15, darkMetal);
    exBox((TW - ENT_W) / 2, PODIUM_TOP - FY, 0.25, (TW + ENT_W) / 4, (PODIUM_TOP + FY) / 2, FRONT_Z - 0.15, darkMetal);
    exBox(ENT_W, PODIUM_TOP - (FY + ENT_H), 0.25, 0, (PODIUM_TOP + FY + ENT_H) / 2, FRONT_Z - 0.15, darkMetal);
    exBox(TW, FY + TH - PODIUM_TOP, 0.2, 0, (PODIUM_TOP + FY + TH) / 2, FRONT_Z - 0.2, massMat);
    for (const sx of [-1, 1]) exBox(0.2, TH, TD, sx * (TW / 2 - 0.1), FY + TH / 2, TZ, massMat);
    exBox(TW, TH, 0.2, 0, FY + TH / 2, TZ - TD / 2 + 0.1, massMat);
    exBox(TW, 0.25, TD, 0, FY + TH, TZ, massMat);
    exBox(TW + 0.06, 0.1, 0.32, 0, PODIUM_TOP, FRONT_Z - 0.12, gold);
    exBox(TW + 0.06, 0.08, 0.3, 0, FY + TH - 0.1, FRONT_Z - 0.12, gold);

    /* Curtain-wall window grid — one InstancedMesh for dark glass, one for the
       sparse lit offices, across the front + both side faces. */
    const winGeo = new THREE.BoxGeometry(1.45, 2.3, 0.06);
    disposables.push(winGeo);
    const winMat = new THREE.MeshPhysicalMaterial({ color: GRAPHITE.clone().lerp(BLUE, 0.12), metalness: 0.9, roughness: 0.3, envMapIntensity: 1.0 });
    const winLitMat = new THREE.MeshStandardMaterial({ color: BLACK, emissive: WARM_WINDOW, emissiveIntensity: 1.5, roughness: 0.6 });
    type WinCell = { x: number; y: number; z: number; ry: number };
    const darkCells: WinCell[] = [];
    const litCells: WinCell[] = [];
    const putCell = (c: WinCell) => (Math.random() < 0.16 ? litCells : darkCells).push(c);
    const ROWS = 14, ROW0 = PODIUM_TOP + 1.6, PITCH_Y = 2.62;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < 13; c++) putCell({ x: (c - 6) * 1.62, y: ROW0 + r * PITCH_Y, z: FRONT_Z + 0.04, ry: 0 });
      for (const s of [-1, 1]) for (let c = 0; c < 12; c++) putCell({ x: s * (TW / 2 + 0.04), y: ROW0 + r * PITCH_Y, z: TZ + (c - 5.5) * 1.62, ry: (s * Math.PI) / 2 });
    }
    const inst = new THREE.Object3D();
    const mkWindows = (cells: WinCell[], mat: THREE.Material) => {
      const im = new THREE.InstancedMesh(winGeo, mat, cells.length);
      cells.forEach((c, i) => {
        inst.position.set(c.x, c.y, c.z);
        inst.rotation.set(0, c.ry, 0);
        inst.updateMatrix();
        im.setMatrixAt(i, inst.matrix);
      });
      im.instanceMatrix.needsUpdate = true;
      exterior.add(im);
      disposables.push(im);
    };
    mkWindows(darkCells, winMat);
    mkWindows(litCells, winLitMat);

    /* Entrance: gold-framed glass the camera dissolves through at the threshold */
    const entGlassMat = new THREE.MeshPhysicalMaterial({ color: STEEL, metalness: 0, roughness: 0.05, transparent: true, opacity: 0.16, envMapIntensity: 1.8, side: THREE.DoubleSide, depthWrite: false });
    const entGlassGeo = new THREE.PlaneGeometry(ENT_W, ENT_H);
    disposables.push(entGlassGeo);
    const entGlass = new THREE.Mesh(entGlassGeo, entGlassMat);
    entGlass.position.set(0, FY + ENT_H / 2, FRONT_Z);
    exterior.add(entGlass);
    exBox(0.14, ENT_H + 0.1, 0.3, -ENT_W / 2 - 0.05, FY + ENT_H / 2, FRONT_Z, gold);
    exBox(0.14, ENT_H + 0.1, 0.3, ENT_W / 2 + 0.05, FY + ENT_H / 2, FRONT_Z, gold);
    exBox(ENT_W + 0.24, 0.14, 0.3, 0, FY + ENT_H + 0.05, FRONT_Z, gold);
    exBox(0.06, ENT_H, 0.1, -ENT_W / 6, FY + ENT_H / 2, FRONT_Z + 0.02, steel);
    exBox(0.06, ENT_H, 0.1, ENT_W / 6, FY + ENT_H / 2, FRONT_Z + 0.02, steel);
    exBox(ENT_W + 1.2, 0.12, 1.7, 0, FY + ENT_H + 0.28, FRONT_Z + 0.85, darkMetal);
    exBox(ENT_W + 1.2, 0.05, 0.06, 0, FY + ENT_H + 0.25, FRONT_Z + 1.7, gold);

    /* The building carries NO brand name — it stays a clean, realistic facade.
       Philbrick's mark lives on the elevator car header instead (see the brand
       decal in the "Elevator car" section below). */

    /* Street/plaza + gradient night sky (baked once) + fogged context towers */
    const streetGeo = new THREE.PlaneGeometry(500, 500);
    disposables.push(streetGeo);
    const streetMat = new THREE.MeshStandardMaterial({ color: BLACK.clone().lerp(GRAPHITE, 0.55), metalness: 0.25, roughness: 0.35, envMapIntensity: 0.25 });
    const street = new THREE.Mesh(streetGeo, streetMat);
    street.rotation.x = -Math.PI / 2;
    street.position.y = FY - 0.03;
    exterior.add(street);

    /* ----- Ground composition: entrance path, planted beds, sidewalk, curb,
       road with lane markings. Flat planes + thin kerb boxes over the base
       plane — a believable urban frontage for a handful of draw calls. ----- */
    /* Adaptive detail: smaller textures, fewer stars, no rooftop plant on
       small/low-powered viewports. */
    const compact = Math.min(window.innerWidth, window.innerHeight) < 760;
    const texSize = compact ? 64 : 128;
    const makeGroundTex = (draw: (g: CanvasRenderingContext2D, s: number) => void, repeatX = 1, repeatY = 1) => {
      const c = document.createElement("canvas");
      c.width = c.height = texSize;
      const g = c.getContext("2d")!;
      draw(g, texSize);
      const t = track(new THREE.CanvasTexture(c));
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(repeatX, repeatY);
      return t;
    };
    // paving: light concrete with grout joints (two repeat scales — the long
    // sidewalk band and the short entrance path can't share one repeat)
    const paveDraw = (g: CanvasRenderingContext2D, s: number) => {
      g.fillStyle = "#9aa0a8";
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < s * 3; i++) {
        g.fillStyle = `rgba(${120 + Math.random() * 60},${125 + Math.random() * 60},${135 + Math.random() * 55},0.16)`;
        g.fillRect(Math.random() * s, Math.random() * s, 2, 2);
      }
      g.strokeStyle = "rgba(60,66,74,0.55)";
      g.lineWidth = Math.max(1, s / 64);
      const step = s / 4;
      for (let v = 0; v <= s; v += step) {
        g.beginPath(); g.moveTo(v, 0); g.lineTo(v, s); g.stroke();
        g.beginPath(); g.moveTo(0, v); g.lineTo(s, v); g.stroke();
      }
    };
    const paveTex = makeGroundTex(paveDraw, 90, 2);
    const pathTex = makeGroundTex(paveDraw, 4, 3.6);
    // asphalt with a dashed centre line + subtle aggregate
    const roadTex = makeGroundTex((g, s) => {
      g.fillStyle = "#23262b";
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < s * 4; i++) {
        const v = 30 + Math.random() * 40;
        g.fillStyle = `rgba(${v},${v},${v + 4},0.25)`;
        g.fillRect(Math.random() * s, Math.random() * s, 1.6, 1.6);
      }
      g.fillStyle = "rgba(214,214,206,0.8)";
      const dashW = s * 0.34;
      g.fillRect((s - dashW) / 2, s / 2 - Math.max(1.5, s / 52), dashW, Math.max(3, s / 26));
    }, 34, 1);
    // lawn: layered greens
    const grassTex = makeGroundTex((g, s) => {
      g.fillStyle = "#2c4a2e";
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < s * 5; i++) {
        const shade = Math.random();
        g.fillStyle = shade > 0.6 ? "rgba(66,110,64,0.5)" : "rgba(26,52,30,0.45)";
        g.fillRect(Math.random() * s, Math.random() * s, 2, 2 + Math.random() * 2);
      }
    }, 8, 3);

    const pathMat = new THREE.MeshStandardMaterial({ map: pathTex, color: STEEL.clone().lerp(GRAPHITE, 0.35), metalness: 0.05, roughness: 0.85 });
    const paveMat = new THREE.MeshStandardMaterial({ map: paveTex, color: STEEL.clone().lerp(GRAPHITE, 0.45), metalness: 0.05, roughness: 0.9 });
    const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, color: new THREE.Color("#a5a8ad"), metalness: 0.1, roughness: 0.85 });
    const grassMat = new THREE.MeshStandardMaterial({ map: grassTex, color: new THREE.Color("#5c6f58"), metalness: 0, roughness: 1 });
    const kerbMat = new THREE.MeshStandardMaterial({ color: STEEL.clone().lerp(GRAPHITE, 0.25), metalness: 0.05, roughness: 0.8 });
    const groundPlane = (w: number, d: number, x: number, z: number, y: number, mat: THREE.Material) => {
      const geo = new THREE.PlaneGeometry(w, d);
      disposables.push(geo);
      const m = new THREE.Mesh(geo, mat);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, y, z);
      exterior.add(m);
      return m;
    };
    // entrance path from the doors to the sidewalk
    groundPlane(8, 7.2, 0, FRONT_Z + 3.6, FY - 0.008, pathMat);
    // planted beds flanking the path, with low kerbs
    groundPlane(10.5, 6, -10.4, FRONT_Z + 3.5, FY - 0.014, grassMat);
    groundPlane(10.5, 6, 10.4, FRONT_Z + 3.5, FY - 0.014, grassMat);
    for (const gx of [-10.4, 10.4]) {
      exBox(10.9, 0.16, 0.18, gx, FY + 0.02, FRONT_Z + 0.6, kerbMat);
      exBox(10.9, 0.16, 0.18, gx, FY + 0.02, FRONT_Z + 6.4, kerbMat);
      exBox(0.18, 0.16, 6, gx - 5.35, FY + 0.02, FRONT_Z + 3.5, kerbMat);
      exBox(0.18, 0.16, 6, gx + 5.35, FY + 0.02, FRONT_Z + 3.5, kerbMat);
    }
    // sidewalk band along the frontage, then the curb drop to the road
    groundPlane(420, 4.6, 0, FRONT_Z + 9.4, FY - 0.018, paveMat);
    exBox(420, 0.14, 0.3, 0, FY - 0.01, FRONT_Z + 11.8, kerbMat);
    // the road itself + a far sidewalk to close the composition
    groundPlane(420, 11, 0, FRONT_Z + 17.5, FY - 0.024, roadMat);
    groundPlane(420, 3.4, 0, FRONT_Z + 24.9, FY - 0.02, paveMat);

    const skyCanvas = document.createElement("canvas");
    skyCanvas.width = 2;
    skyCanvas.height = 512;
    const skyCtx = skyCanvas.getContext("2d")!;
    /* Texture v: 0 = zenith, 0.5 = horizon (equator), >0.5 = below ground.
       The warm city-glow band therefore sits right at 0.5. */
    const skyGrad = skyCtx.createLinearGradient(0, 0, 0, 512);
    skyGrad.addColorStop(0, `#${BLACK.clone().multiplyScalar(0.75).getHexString()}`);
    skyGrad.addColorStop(0.34, `#${BLACK.getHexString()}`);
    skyGrad.addColorStop(0.46, `#${GRAPHITE.clone().lerp(BLUE, 0.28).getHexString()}`);
    skyGrad.addColorStop(0.5, `#${GRAPHITE.clone().lerp(GOLD, 0.35).getHexString()}`); // city glow
    skyGrad.addColorStop(0.56, `#${GRAPHITE.clone().lerp(BLACK, 0.5).getHexString()}`);
    skyGrad.addColorStop(1, `#${BLACK.getHexString()}`);
    skyCtx.fillStyle = skyGrad;
    skyCtx.fillRect(0, 0, 2, 512);
    const skyTex = track(new THREE.CanvasTexture(skyCanvas));
    skyTex.colorSpace = THREE.SRGBColorSpace;
    const skyGeo = new THREE.SphereGeometry(380, 24, 16);
    disposables.push(skyGeo);
    const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, depthWrite: false });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    skyDome.position.y = 20;
    exterior.add(skyDome);

    /* Day sky — a second dome crossfaded over the night one by the theme
       blend. It exists (and compiles) from mount; only its opacity animates. */
    const daySkyCanvas = document.createElement("canvas");
    daySkyCanvas.width = 2;
    daySkyCanvas.height = 512;
    const dayCtx = daySkyCanvas.getContext("2d")!;
    const dayGrad = dayCtx.createLinearGradient(0, 0, 0, 512);
    /* A real sky: saturated zenith blue easing to a cool haze at the horizon —
       never white-on-white, so the tower always reads against it. */
    dayGrad.addColorStop(0, `#${BLUE.clone().lerp(WHITE, 0.1).getHexString()}`);
    dayGrad.addColorStop(0.3, `#${BLUE.clone().lerp(WHITE, 0.34).getHexString()}`);
    dayGrad.addColorStop(0.5, `#${STEEL.clone().lerp(WHITE, 0.42).getHexString()}`); // horizon haze
    dayGrad.addColorStop(0.56, `#${STEEL.clone().lerp(WHITE, 0.18).getHexString()}`);
    dayGrad.addColorStop(1, `#${STEEL.clone().lerp(GRAPHITE, 0.35).getHexString()}`);
    dayCtx.fillStyle = dayGrad;
    dayCtx.fillRect(0, 0, 2, 512);
    const daySkyTex = track(new THREE.CanvasTexture(daySkyCanvas));
    daySkyTex.colorSpace = THREE.SRGBColorSpace;
    const daySkyGeo = new THREE.SphereGeometry(376, 24, 16);
    disposables.push(daySkyGeo);
    const daySkyMat = new THREE.MeshBasicMaterial({ map: daySkyTex, side: THREE.BackSide, fog: false, depthWrite: false, transparent: true, opacity: 0 });
    const daySky = new THREE.Mesh(daySkyGeo, daySkyMat);
    daySky.position.y = 20;
    daySky.renderOrder = 2;
    exterior.add(daySky);

    /* Sunset sky — a third dome whose opacity peaks mid-transition, so a
       theme switch reads Day → Sunset → Night instead of a straight crossfade.
       Baked once; opacity-only at runtime. */
    const sunsetCanvas = document.createElement("canvas");
    sunsetCanvas.width = 2;
    sunsetCanvas.height = 512;
    const ssCtx = sunsetCanvas.getContext("2d")!;
    const ssGrad = ssCtx.createLinearGradient(0, 0, 0, 512);
    ssGrad.addColorStop(0, "#151a33"); // deep indigo zenith
    ssGrad.addColorStop(0.34, "#3a3357");
    ssGrad.addColorStop(0.44, "#8a4a3e");
    ssGrad.addColorStop(0.5, "#e08a4a"); // amber band at the horizon
    ssGrad.addColorStop(0.55, "#5a3a35");
    ssGrad.addColorStop(1, "#171522");
    ssCtx.fillStyle = ssGrad;
    ssCtx.fillRect(0, 0, 2, 512);
    const sunsetTex = track(new THREE.CanvasTexture(sunsetCanvas));
    sunsetTex.colorSpace = THREE.SRGBColorSpace;
    const sunsetGeo = new THREE.SphereGeometry(378, 24, 16);
    disposables.push(sunsetGeo);
    const sunsetMat = new THREE.MeshBasicMaterial({ map: sunsetTex, side: THREE.BackSide, fog: false, depthWrite: false, transparent: true, opacity: 0 });
    const sunsetSky = new THREE.Mesh(sunsetGeo, sunsetMat);
    sunsetSky.position.y = 20;
    sunsetSky.renderOrder = 1;
    exterior.add(sunsetSky);

    /* Sun + moon — glow-textured discs riding arcs behind the skyline (sun on
       the left of the tower, moon on the right, per the hero composition).
       Positions/opacity animate in the pose loop; buildings depth-occlude
       them, so they genuinely rise and set behind the city. */
    const glowTexture = (stops: [number, string][], size = 256) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      stops.forEach(([o, col]) => grad.addColorStop(o, col));
      g.fillStyle = grad;
      g.fillRect(0, 0, size, size);
      const t = track(new THREE.CanvasTexture(c));
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    const skyDisc = (tex: THREE.Texture, size: number, order: number) => {
      const geo = new THREE.PlaneGeometry(size, size);
      disposables.push(geo);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        fog: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.renderOrder = order;
      exterior.add(mesh);
      return { mesh, mat };
    };
    const sun = skyDisc(
      glowTexture([
        [0, "rgba(255,246,225,1)"],
        [0.16, "rgba(255,232,180,0.98)"],
        [0.3, "rgba(255,190,110,0.5)"],
        [0.6, "rgba(255,150,70,0.14)"],
        [1, "rgba(255,140,60,0)"],
      ]),
      64,
      3
    );
    /* The moon is a shaded disc (limb darkening + a few maria blotches) with
       a soft halo — not a flat icon. */
    const moonTexCanvas = document.createElement("canvas");
    moonTexCanvas.width = moonTexCanvas.height = 256;
    const mg = moonTexCanvas.getContext("2d")!;
    const moonHalo = mg.createRadialGradient(128, 128, 0, 128, 128, 128);
    moonHalo.addColorStop(0, "rgba(226,234,244,1)");
    moonHalo.addColorStop(0.34, "rgba(226,234,244,1)");
    moonHalo.addColorStop(0.4, "rgba(200,214,230,0.55)");
    moonHalo.addColorStop(0.62, "rgba(170,190,214,0.12)");
    moonHalo.addColorStop(1, "rgba(170,190,214,0)");
    mg.fillStyle = moonHalo;
    mg.fillRect(0, 0, 256, 256);
    // limb shading (lower-left slightly darker) + maria
    const limb = mg.createRadialGradient(150, 108, 20, 128, 128, 92);
    limb.addColorStop(0, "rgba(255,255,255,0)");
    limb.addColorStop(1, "rgba(96,112,134,0.5)");
    mg.save();
    mg.beginPath();
    mg.arc(128, 128, 88, 0, Math.PI * 2);
    mg.clip();
    mg.fillStyle = limb;
    mg.fillRect(0, 0, 256, 256);
    mg.fillStyle = "rgba(148,164,186,0.4)";
    for (const [bx, by, br] of [[104, 106, 17], [142, 140, 13], [116, 152, 10], [152, 102, 8]] as const) {
      mg.beginPath();
      mg.arc(bx, by, br, 0, Math.PI * 2);
      mg.fill();
    }
    mg.restore();
    const moonTex = track(new THREE.CanvasTexture(moonTexCanvas));
    moonTex.colorSpace = THREE.SRGBColorSpace;
    const moonDisc = skyDisc(moonTex, 34, 3);

    /* Stars — one Points cloud on the upper sky shell. Static geometry, no
       per-frame updates; opacity follows the night blend. Fewer on small
       screens. */
    const STAR_COUNT = compact ? 200 : 420;
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starCol = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      // upper hemisphere shell, biased away from the horizon
      const az = Math.random() * Math.PI * 2;
      const el = 0.18 + Math.random() * 1.25; // radians above horizon
      const r = 344;
      starPos[i * 3] = Math.cos(az) * Math.cos(el) * r;
      starPos[i * 3 + 1] = 20 + Math.sin(el) * r;
      starPos[i * 3 + 2] = Math.sin(az) * Math.cos(el) * r;
      const b = 0.35 + Math.random() * 0.65; // varied brightness
      const warm = Math.random() < 0.18 ? 0.92 : 1; // a few warm stars
      starCol[i * 3] = b;
      starCol[i * 3 + 1] = b * (warm === 1 ? 1 : 0.94);
      starCol[i * 3 + 2] = b * warm;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starCol, 3));
    disposables.push(starGeo);
    const starSprite = glowTexture(
      [
        [0, "rgba(255,255,255,1)"],
        [0.4, "rgba(255,255,255,0.7)"],
        [1, "rgba(255,255,255,0)"],
      ],
      32
    );
    const starMat = track(
      new THREE.PointsMaterial({
        size: compact ? 1.7 : 2.1,
        sizeAttenuation: false,
        map: starSprite,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    (starMat as THREE.PointsMaterial & { fog: boolean }).fog = false;
    const stars = new THREE.Points(starGeo, starMat);
    stars.renderOrder = 3;
    exterior.add(stars);

    /* Context buildings — three façade variants (window grids with mullion
       lines and varied lit density) instead of one noise texture, plus
       parapet caps and rooftop plant. Three instanced draws for the towers,
       one each for parapets and roof structures. */
    const facadeTexture = (litChance: number, warmth: number) => {
      const c = document.createElement("canvas");
      c.width = c.height = 128;
      const g = c.getContext("2d")!;
      g.fillStyle = "#000";
      g.fillRect(0, 0, 128, 128);
      // faint mullion grid so unlit façades still read as architecture
      g.strokeStyle = "rgba(255,255,255,0.05)";
      g.lineWidth = 1;
      for (let v = 4; v < 128; v += 10) {
        g.beginPath();
        g.moveTo(v, 0);
        g.lineTo(v, 128);
        g.stroke();
      }
      for (let hLine = 6; hLine < 128; hLine += 12) {
        g.beginPath();
        g.moveTo(0, hLine);
        g.lineTo(128, hLine);
        g.stroke();
      }
      // window cells: mostly dark, some lit with varied warmth/brightness
      for (let y = 8; y < 120; y += 12)
        for (let x = 6; x < 120; x += 10) {
          if (Math.random() < litChance) {
            const a = 0.4 + Math.random() * 0.6;
            const cool = Math.random() > warmth;
            g.fillStyle = cool
              ? `rgba(210,228,255,${a * 0.8})`
              : `rgba(255,220,160,${a})`;
            g.fillRect(x, y, 6, 8);
          } else if (Math.random() < 0.3) {
            g.fillStyle = "rgba(255,255,255,0.03)"; // glass sheen on dark cells
            g.fillRect(x, y, 6, 8);
          }
        }
      const t = track(new THREE.CanvasTexture(c));
      t.colorSpace = THREE.NoColorSpace;
      return t;
    };
    const ctxGeo = new THREE.BoxGeometry(1, 1, 1);
    disposables.push(ctxGeo);
    /* x, z, w, h, d, rotY, variant */
    const CTX: [number, number, number, number, number, number, number][] = [
      [-34, -34, 14, 30, 14, 0.05, 0], [-58, -12, 12, 22, 12, -0.04, 1], [30, -44, 16, 36, 16, 0.03, 2],
      [54, -20, 12, 26, 14, -0.06, 0], [-28, -68, 18, 42, 18, 0.02, 1], [42, -66, 14, 24, 14, 0.06, 2],
      [68, -44, 12, 32, 12, -0.03, 1], [-52, 12, 10, 18, 12, 0.05, 2], [58, 6, 12, 20, 12, -0.05, 0],
    ];
    const ctxMats = [
      new THREE.MeshStandardMaterial({ color: GRAPHITE.clone().lerp(BLACK, 0.42), metalness: 0.1, roughness: 0.9, emissive: WARM_WINDOW, emissiveIntensity: 0.3, emissiveMap: facadeTexture(0.16, 0.72) }),
      new THREE.MeshStandardMaterial({ color: GRAPHITE.clone().lerp(BLACK, 0.55), metalness: 0.05, roughness: 0.95, emissive: WARM_WINDOW, emissiveIntensity: 0.3, emissiveMap: facadeTexture(0.1, 0.6) }),
      new THREE.MeshStandardMaterial({ color: GRAPHITE.clone().lerp(STEEL, 0.06), metalness: 0.15, roughness: 0.85, emissive: WARM_WINDOW, emissiveIntensity: 0.3, emissiveMap: facadeTexture(0.22, 0.8) }),
    ];
    const ctxByVariant: THREE.Matrix4[][] = [[], [], []];
    const parapetMatrices: THREE.Matrix4[] = [];
    const roofMatrices: THREE.Matrix4[] = [];
    CTX.forEach(([cx, cz, cw, ch, cd, ry, variant]) => {
      inst.position.set(cx, FY + ch / 2, cz);
      inst.rotation.set(0, ry, 0);
      inst.scale.set(cw, ch, cd);
      inst.updateMatrix();
      ctxByVariant[variant].push(inst.matrix.clone());
      // parapet: a slightly proud, shallow cap that crisps the roofline
      inst.position.set(cx, FY + ch + 0.28, cz);
      inst.scale.set(cw + 0.5, 0.55, cd + 0.5);
      inst.updateMatrix();
      parapetMatrices.push(inst.matrix.clone());
      // rooftop plant (lift-machine room / AC deck) on most towers
      if (!compact && roofMatrices.length < 6) {
        inst.position.set(cx - cw * 0.18, FY + ch + 1.1, cz + cd * 0.12);
        inst.rotation.set(0, ry, 0);
        inst.scale.set(cw * 0.3, 1.9, cd * 0.28);
        inst.updateMatrix();
        roofMatrices.push(inst.matrix.clone());
      }
      inst.rotation.set(0, 0, 0);
    });
    inst.scale.set(1, 1, 1);
    const ctxMeshes = ctxMats.map((mat, vi) => {
      const m = new THREE.InstancedMesh(ctxGeo, mat, ctxByVariant[vi].length);
      ctxByVariant[vi].forEach((mtx, i) => m.setMatrixAt(i, mtx));
      m.instanceMatrix.needsUpdate = true;
      exterior.add(m);
      disposables.push(m);
      return m;
    });
    void ctxMeshes;
    const parapetMat = new THREE.MeshStandardMaterial({ color: GRAPHITE.clone().lerp(BLACK, 0.25), metalness: 0.1, roughness: 0.85 });
    const parapets = new THREE.InstancedMesh(ctxGeo, parapetMat, parapetMatrices.length);
    parapetMatrices.forEach((mtx, i) => parapets.setMatrixAt(i, mtx));
    parapets.instanceMatrix.needsUpdate = true;
    exterior.add(parapets);
    disposables.push(parapets);
    if (roofMatrices.length > 0) {
      const roofUnits = new THREE.InstancedMesh(ctxGeo, parapetMat, roofMatrices.length);
      roofMatrices.forEach((mtx, i) => roofUnits.setMatrixAt(i, mtx));
      roofUnits.instanceMatrix.needsUpdate = true;
      exterior.add(roofUnits);
      disposables.push(roofUnits);
    }

    /* Exterior lighting: a moon/sun key that sculpts the facade, and a warm
       pool spilling from the entrance onto the plaza.
       IMPORTANT: these are added to the SCENE, not the toggled exterior group.
       Three.js keys every shader program on the scene's light counts — if
       these lights disappeared with `exterior.visible`, every physical
       material would compile a new shader variant mid-scroll (a multi-second
       main-thread stall that shows up as a freeze-then-jump on first scroll).
       They are faded via intensity instead, which is uniform-only. */
    const moon = new THREE.DirectionalLight(STEEL.clone().lerp(BLUE, 0.25), 0.7);
    moon.position.set(-40, 55, 90);
    scene.add(moon);
    scene.add(moon.target);
    const entrancePool = new THREE.PointLight(WARM_WINDOW, 2.4, 30, 1.8);
    entrancePool.position.set(0, 2.6, 15.5);
    scene.add(entrancePool);

    /* ===== Elevator car ===== */
    const car = new THREE.Group();
    world.add(car);
    box(car, [W + 0.12, 0.14, D + 0.12], [0, H / 2, 0], darkMetal);
    box(car, [W + 0.12, 0.16, D + 0.12], [0, -H / 2, 0], darkMetal);
    box(car, [W - 0.06, H - 0.2, 0.05], [0, 0, -D / 2], mirror, false);
    box(car, [W - 0.1, 0.05, D - 0.1], [0, FY + 0.1, 0], stone, false);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(car, [0.07, H, 0.07], [(sx * W) / 2, 0, (sz * D) / 2], gold);
    const ledCeil = new THREE.Mesh(rbox(W - 0.5, 0.05, D - 0.5, 0.02), ledMat);
    ledCeil.position.set(0, H / 2 - 0.12, 0);
    car.add(ledCeil);
    const sidePanels = new THREE.Group();
    car.add(sidePanels);
    box(sidePanels, [0.05, H - 0.2, D - 0.2], [-W / 2, 0, 0], panelMat, false);
    box(sidePanels, [0.05, H - 0.2, D - 0.2], [W / 2, 0, 0], panelMat, false);
    const backMirror = new THREE.Mesh(rbox(0.02, H - 0.7, D - 0.7, 0.01), mirror);
    backMirror.position.set(-W / 2 + 0.06, 0.1, 0);
    car.add(backMirror);
    const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, D - 0.4, 16), gold);
    handrail.rotation.x = Math.PI / 2;
    handrail.position.set(-W / 2 + 0.08, -0.1, 0);
    car.add(handrail);

    /* Car operating panel + detailed controls */
    const cop = new THREE.Group();
    cop.position.set(W / 2 - 0.12, 0.15, D / 2 - 0.3);
    box(cop, [0.04, 1.0, 0.24], [0, 0, 0], steel, false);
    const copScreen = new THREE.Mesh(rbox(0.02, 0.2, 0.16, 0.01), screenMat);
    copScreen.position.set(-0.035, 0.28, 0);
    cop.add(copScreen);
    // round metal call buttons with a faintly-lit core (like a real COP)
    const btnRing = new THREE.CylinderGeometry(0.02, 0.02, 0.012, 20);
    const btnCore = new THREE.CylinderGeometry(0.012, 0.012, 0.016, 20);
    const btnCoreMat = new THREE.MeshStandardMaterial({ color: 0x16181d, emissive: 0xffcf8a, emissiveIntensity: 0.45, metalness: 0.3, roughness: 0.4 });
    for (let i = 0; i < 8; i++) {
      const py = 0.05 - (i % 4) * 0.09;
      const pz = i < 4 ? -0.05 : 0.05;
      const ring = new THREE.Mesh(btnRing, steel);
      ring.rotation.z = Math.PI / 2;
      ring.position.set(-0.03, py, pz);
      cop.add(ring);
      const core = new THREE.Mesh(btnCore, btnCoreMat);
      core.rotation.z = Math.PI / 2;
      core.position.set(-0.042, py, pz);
      cop.add(core);
    }
    const keySwitch = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.025, 18), gold);
    keySwitch.rotation.z = Math.PI / 2;
    keySwitch.position.set(-0.04, -0.3, 0);
    cop.add(keySwitch);
    const emgBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.025, 20), redMat);
    emgBtn.rotation.z = Math.PI / 2;
    emgBtn.position.set(-0.04, -0.42, 0);
    cop.add(emgBtn);
    car.add(cop);

    /* Doors + operator header */
    const doorW = W / 2 - 0.05;
    const doorL = box(car, [doorW, H - 0.7, 0.05], [-W / 4, -0.1, D / 2], steel, false);
    const doorR = box(car, [doorW, H - 0.7, 0.05], [W / 4, -0.1, D / 2], steel, false);
    box(doorL, [0.05, H - 0.7, 0.07], [doorW / 2 - 0.02, 0, 0], steel, false, 0.015);
    box(doorR, [0.05, H - 0.7, 0.07], [-doorW / 2 + 0.02, 0, 0], steel, false, 0.015);
    box(car, [W, 0.4, 0.12], [0, H / 2 - 0.2, D / 2], darkMetal); // door operator header
    box(car, [W - 0.2, 0.06, 0.04], [0, H / 2 - 0.32, D / 2 + 0.06], steel, false); // header track

    /* ===== Philbrick brand decal on the door-operator header =====
       Moved off the building — a real elevator carries its maker's mark on the
       car header / transom. Unlit (MeshBasic, toneMapped:false) so it reads
       identically in day and night; the plane keeps the logo's native
       1277:286 aspect ratio, so the mark is never stretched or distorted. */
    const brandTex = track(
      new THREE.TextureLoader().load("/brand/logo.png", (t) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        t.needsUpdate = true;
      })
    );
    const brandW = W * 0.62;
    const brandGeo = new THREE.PlaneGeometry(brandW, brandW * (286 / 1277));
    disposables.push(brandGeo);
    const brandMat = new THREE.MeshBasicMaterial({
      map: brandTex,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    const brandDecal = new THREE.Mesh(brandGeo, brandMat);
    brandDecal.position.set(0, H / 2 - 0.16, D / 2 + 0.075);
    brandDecal.renderOrder = 2;
    car.add(brandDecal);

    const interiorLight = new THREE.PointLight(0xffd9a0, 0.6, 6, 2);
    interiorLight.position.set(0, 0.3, 0);
    car.add(interiorLight);

    /* ===== Shaft (rails, counterweight, machine, ropes, brakes) ===== */
    const shaft = new THREE.Group();
    shaft.position.z = -D / 2 - 0.6;
    world.add(shaft);
    for (const sx of [-1, 1]) box(shaft, [0.1, 26, 0.1], [sx * (W / 2 + 0.25), 0, 0], steel, false, 0.02);
    const counterweight = new THREE.Group();
    counterweight.position.set(W / 2 + 0.6, 0, -0.3);
    box(counterweight, [0.3, 1.8, 0.4], [0, 0, 0], darkMetal, false, 0.02);
    for (let i = 0; i < 8; i++) box(counterweight, [0.24, 0.16, 0.34], [0, -0.7 + i * 0.2, 0.03], steel, false, 0.01);
    shaft.add(counterweight);
    const machine = new THREE.Group();
    machine.position.set(0, 6.2, -0.3);
    box(machine, [1.4, 0.5, 0.9], [0, -0.3, 0], darkMetal, false, 0.04);
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 28), steel);
    motor.rotation.z = Math.PI / 2;
    machine.add(motor);
    for (let i = 0; i < 7; i++) {
      const fin = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.014, 24), darkMetal);
      fin.rotation.z = Math.PI / 2;
      fin.position.x = -0.32 + i * 0.1;
      machine.add(fin);
    }
    const sheave = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.18, 32), gold);
    sheave.rotation.z = Math.PI / 2;
    sheave.position.x = 0.55;
    machine.add(sheave);
    shaft.add(machine);
    const ropes = new THREE.Group();
    for (const rx of [-0.18, 0, 0.18]) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 6, 6), steel);
      r.position.set(rx, 3.4, 0);
      ropes.add(r);
    }
    shaft.add(ropes);
    // safety brakes + governor on the car
    box(car, [0.2, 0.42, 0.32], [-(W / 2 + 0.06), -0.4, -0.2], redMat, false, 0.02);
    box(car, [0.2, 0.42, 0.32], [W / 2 + 0.06, -0.4, -0.2], redMat, false, 0.02);
    box(car, [0.16, 0.16, 0.16], [-(W / 2 + 0.06), -0.1, -0.2], darkMetal, false, 0.02);

    /* machine position is in shaft space (z offset); move machine down so it sits above the car */
    machine.position.set(0, 2.1, 0.3);
    counterweight.position.set(W / 2 + 0.6, 0, 0.2);

    /* ===== Particles ===== */
    const pCount = 240;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) { pPos[i * 3] = (Math.random() - 0.5) * 12; pPos[i * 3 + 1] = Math.random() * 7 + FY; pPos[i * 3 + 2] = (Math.random() - 0.5) * 8; }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    disposables.push(pGeo);
    const pMat = track(new THREE.PointsMaterial({ color: 0xffe9c8, size: 0.02, transparent: true, opacity: 0.22, depthWrite: false }));
    world.add(new THREE.Points(pGeo, pMat));

    /* ===== Lighting ===== */
    const key = new THREE.DirectionalLight(0xffe9cf, 2.0);
    key.position.set(4, 7, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(lowPerf ? 1024 : 2048, lowPerf ? 1024 : 2048);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 30;
    key.shadow.camera.left = -8;
    key.shadow.camera.right = 8;
    key.shadow.camera.top = 8;
    key.shadow.camera.bottom = -8;
    key.shadow.bias = -0.0004;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcfe0ff, 0.5);
    fill.position.set(-3, 3, 5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x9ab4ff, 0.8);
    rim.position.set(-4, 4, -5);
    scene.add(rim);
    const hemi = new THREE.HemisphereLight(0x6b7384, 0x0a0b0e, 0.5);
    scene.add(hemi);
    // Soft area lights = even, photographic illumination on the metal (softboxes).
    RectAreaLightUniformsLib.init();
    // Softbox fill for the cabin. Toned down (was 3.2 / 1.8) so the interior
    // reads cinematic and contrasted rather than overexposed; these mostly
    // affect the inside beats (aimed at the elevator), leaving the tower alone.
    const soft1 = new THREE.RectAreaLight(0xfff2e4, 0.95, 7, 4.5);
    soft1.position.set(0, 3.6, 6.5);
    soft1.lookAt(0, 0, 0);
    scene.add(soft1);
    const soft2 = new THREE.RectAreaLight(0xdfe8ff, 0.5, 5, 4);
    soft2.position.set(-5, 2.6, 3.5);
    soft2.lookAt(0, 0, 0);
    scene.add(soft2);
    /* Restrained interior IBL level — the target scene.environmentIntensity
       eases to once the camera is inside (see the pose loop). */
    const INTERIOR_ENV = 0.9;

    /* ===== Optional GLTF ===== */
    const gltfGroup = new THREE.Group();
    gltfGroup.visible = false;
    scene.add(gltfGroup);
    let gltfActive = false;
    if (MODEL.enabled) {
      new GLTFLoader().load(
        MODEL.url,
        (gltf) => {
          const m = gltf.scene;
          const size0 = new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3());
          const sc = (MODEL.targetHeight / (size0.y || 1)) * MODEL.scale;
          m.scale.setScalar(sc);
          m.rotation.set(THREE.MathUtils.degToRad(MODEL.rotationX), THREE.MathUtils.degToRad(MODEL.rotationY), THREE.MathUtils.degToRad(MODEL.rotationZ));
          m.updateMatrixWorld(true);
          const center = new THREE.Box3().setFromObject(m).getCenter(new THREE.Vector3());
          m.position.sub(center);
          m.position.y += MODEL.yOffset;
          m.traverse((o) => { const mm = o as THREE.Mesh; if (mm.isMesh) { mm.castShadow = true; mm.receiveShadow = true; const mat = mm.material as THREE.MeshStandardMaterial | undefined; if (mat && "envMapIntensity" in mat) mat.envMapIntensity = 1.3; } });
          gltfGroup.add(m);
          gltfGroup.visible = true;
          world.visible = false;
          gltfActive = true;
        },
        undefined,
        (err) => console.warn("[ElevatorScene] GLTF failed to load, using procedural fallback:", err)
      );
    }

    /* ===== Camera stops (exterior → threshold → 8 components → outro) ===== */
    const frameOf = (k: string) => {
      const f = FRAMING[k];
      const an = new THREE.Vector3(...f.anchor);
      const dir = new THREE.Vector3(...f.view).normalize();
      const pos = an.clone().add(dir.multiplyScalar(f.dist));
      return { pos: [pos.x, pos.y, pos.z] as [number, number, number], target: f.anchor };
    };
    const step = (COMP_END - COMP_START) / ELEVATOR_COMPONENTS.length;
    const stops = [
      // exterior: wide establishing → drift closer → aimed at the entrance
      { p: 0.0, pos: [-17, 2.2, 56], target: [1.5, 17, 3] },
      { p: ARRIVE_END, pos: [-9, 3.4, 38], target: [0.6, 9, 5] },
      { p: APPROACH_END, pos: [-1.6, 1.15, 21], target: [0, 0.9, 6] },
      // threshold: under the canopy, through the (now faded) entrance glass
      { p: 0.3, pos: [0, 0.62, 14.6], target: [0, 0.4, 4] },
      { p: INSIDE_P, pos: [0, 0.5, 8.6], target: [0, 0.1, 0] },
      { p: 0.4, pos: [0, 0.4, 6.2], target: [0, 0.1, 0] },
      ...ELEVATOR_COMPONENTS.map((c, i) => ({ p: COMP_START + (i + 0.5) * step, ...frameOf(c.key) })),
      { p: 0.93, pos: [0, 0.2, 3.0], target: [0, 0.05, 0] },
      { p: 1.0, pos: [0, 0.02, 1.2], target: [0, 0, 0] },
    ] as { p: number; pos: number[]; target: number[] }[];
    const anchors = ELEVATOR_COMPONENTS.map((c) => new THREE.Vector3(...FRAMING[c.key].anchor));
    const safetyIdx = ELEVATOR_COMPONENTS.findIndex((c) => c.key === "safety");

    /* Same arrival feel when a GLTF cabin replaces the procedural world
       (the exterior lives in `world`, so it hides with it — degrade gracefully). */
    const gltfStops = [
      { p: 0.0, pos: [0, 2.4, 18], target: [0, 0.6, 0] },
      { p: APPROACH_END, pos: [0, 0.9, 12], target: [0, 0.2, 0] },
      { p: INSIDE_P, pos: [0, 0.4, 9.5], target: [0, 0.1, 0] },
      { p: 1.0, pos: [0, 0.2, 5.0], target: [0, 0.1, 0] },
    ] as { p: number; pos: number[]; target: number[] }[];

    const camPos = new THREE.Vector3();
    const camTarget = new THREE.Vector3();
    const ndc = new THREE.Vector3();

    const updateCamera = (p: number) => {
      /* Dolly-zoom: fov narrows while the camera pushes in (vertigo-style
         compression), then settles to the interior's 40° at the threshold. */
      const fov = lerp(lerp(52, 38, smoothstep(ARRIVE_END, 0.26, p)), 40, smoothstep(0.27, INSIDE_P, p));
      if (camera.fov !== fov) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
      const keys = gltfActive ? gltfStops : stops;
      let i = 0;
      while (i < keys.length - 1 && p > keys[i + 1].p) i++;
      const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
      const t = a === b ? 0 : smoothstep(a.p, b.p, p);
      camPos.set(lerp(a.pos[0], b.pos[0], t), lerp(a.pos[1], b.pos[1], t), lerp(a.pos[2], b.pos[2], t));
      camTarget.set(lerp(a.target[0], b.target[0], t), lerp(a.target[1], b.target[1], t), lerp(a.target[2], b.target[2], t));
      camera.position.copy(camPos);
      camera.lookAt(camTarget);
    };

    const updateHotspots = () => {
      const a = activeRef.current;
      for (let i = 0; i < anchors.length; i++) {
        const el = hotspotRefs.current[i];
        if (!el) continue;
        if (gltfActive || i !== a) { el.style.opacity = "0"; el.style.pointerEvents = "none"; continue; }
        ndc.copy(anchors[i]).project(camera);
        if (ndc.z > 1) { el.style.opacity = "0"; el.style.pointerEvents = "none"; continue; }
        const x = (ndc.x * 0.5 + 0.5) * host.clientWidth;
        const y = (-ndc.y * 0.5 + 0.5) * host.clientHeight;
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
      }
    };

    /* Day/night palettes, lerped by the theme blend each frame. Uniform-only.
       A third SUNSET stop makes theme switches travel Day → Sunset → Night
       (and back through sunrise) instead of a straight crossfade. */
    const NIGHT = {
      fog: BLACK.clone().lerp(GRAPHITE, 0.5),
      moonColor: STEEL.clone().lerp(BLUE, 0.25),
      moonI: 0.7,
      hemiSky: new THREE.Color(0x6b7384),
      hemiGround: new THREE.Color(0x0a0b0e),
      hemiI: 0.5,
      envExterior: 0.35,
      litWin: 1.5,
      pool: 2.4,
      street: BLACK.clone().lerp(GRAPHITE, 0.55),
      mass: GRAPHITE.clone().lerp(BLACK, 0.15),
      win: GRAPHITE.clone().lerp(BLUE, 0.12),
      ctxEmissive: 0.3,
      exposure: 1.2,
      road: new THREE.Color("#3f434c"),
      pave: GRAPHITE.clone().lerp(STEEL, 0.22),
      grass: new THREE.Color("#26312a"),
      kerb: GRAPHITE.clone().lerp(STEEL, 0.15),
    };
    /* Golden hour between the two: warm sky light, deep shadows, sun at the
       horizon. Only sky/light/exposure route through it — materials stay on a
       simple two-way blend so nothing overshoots. */
    const SUNSET = {
      fog: new THREE.Color("#54424a"),
      sunColor: new THREE.Color("#ff9a4d"),
      hemiSky: new THREE.Color("#c98a5e"),
      hemiGround: new THREE.Color("#2a2430"),
      hemiI: 0.6,
      exposure: 1.13,
    };
    /* Balanced daylight: one clear sun, restrained ambient/env/exposure so
       surfaces keep their material read — bright, never washed out. */
    const DAY = {
      fog: STEEL.clone().lerp(WHITE, 0.26),
      moonColor: new THREE.Color("#fff3e0"), // the key light becomes the sun
      moonI: 1.55,
      hemiSky: BLUE.clone().lerp(WHITE, 0.48),
      hemiGround: STEEL.clone().lerp(GRAPHITE, 0.5),
      hemiI: 0.72,
      envExterior: 0.62,
      litWin: 0.12,
      pool: 0.5,
      street: STEEL.clone().lerp(GRAPHITE, 0.38),
      mass: GRAPHITE.clone().lerp(STEEL, 0.2),
      win: BLUE.clone().lerp(STEEL, 0.18),
      ctxEmissive: 0.04,
      exposure: 1.08,
      road: new THREE.Color("#a5a8ad"),
      pave: STEEL.clone().lerp(GRAPHITE, 0.4),
      grass: new THREE.Color("#66815e"),
      kerb: STEEL.clone().lerp(GRAPHITE, 0.22),
    };
    /* Per-variant night/day colours for the context towers (keeps their
       material variation through the blend). */
    const ctxNight = ctxMats.map((m) => m.color.clone());
    const ctxDay = ctxNight.map((c) => c.clone().lerp(STEEL, 0.42));
    /* Piecewise three-stop mixers */
    const mixColor3 = (target: THREE.Color, a: THREE.Color, mid: THREE.Color, b: THREE.Color, t: number) => {
      if (t < 0.5) target.lerpColors(a, mid, t * 2);
      else target.lerpColors(mid, b, (t - 0.5) * 2);
    };
    const mix3n = (a: number, mid: number, b: number, t: number) =>
      t < 0.5 ? lerp(a, mid, t * 2) : lerp(mid, b, (t - 0.5) * 2);

    const startT = performance.now();
    let lastT = startT;
    const pose = (p: number) => {
      updateCamera(p);
      // exterior only participates while we're outside / crossing the facade
      exterior.visible = !gltfActive && p < INSIDE_P + 0.03;
      const insideT = smoothstep(APPROACH_END, INSIDE_P, p);

      // ease toward the current theme (light = daylight, dark = night).
      // Delta-time based; slow enough that the sunset/sunrise phase reads.
      const nowT = performance.now();
      const dt = Math.min(0.06, (nowT - lastT) / 1000);
      lastT = nowT;
      dayBlend += (dayTarget - dayBlend) * Math.min(1, dt * 2.3);
      if (Math.abs(dayTarget - dayBlend) < 0.002) dayBlend = dayTarget;
      const day = dayBlend;
      const dusk = day * (1 - day) * 4; // 0 at both ends, 1 mid-transition
      // Daylight interior dim: once the camera reaches the threshold/lobby (by
      // p≈0.30) in DAY mode, ease the interior lighting down so the pale lobby
      // floor/walls don't blow out to white. Gated by p (so the bright exterior
      // arrival at p<0.22 is untouched) and by `day` (so night is unchanged).
      const dayInterior = day * smoothstep(0.22, 0.3, p);
      mixColor3((scene.fog as THREE.Fog).color, NIGHT.fog, SUNSET.fog, DAY.fog, day);
      mixColor3(moon.color, NIGHT.moonColor, SUNSET.sunColor, DAY.moonColor, day);
      mixColor3(hemi.color, NIGHT.hemiSky, SUNSET.hemiSky, DAY.hemiSky, day);
      mixColor3(hemi.groundColor, NIGHT.hemiGround, SUNSET.hemiGround, DAY.hemiGround, day);
      // daylight lifts the ambient outside; ease back so the interior keeps
      // its studio look in both themes
      const hemiOut = mix3n(NIGHT.hemiI, SUNSET.hemiI, DAY.hemiI, day);
      hemi.intensity = lerp(hemiOut, lerp(hemiOut, 0.65, day), insideT) * lerp(1, 0.72, dayInterior);
      winLitMat.emissiveIntensity = lerp(NIGHT.litWin, DAY.litWin, day);
      streetMat.color.lerpColors(NIGHT.street, DAY.street, day);
      massMat.color.lerpColors(NIGHT.mass, DAY.mass, day);
      winMat.color.lerpColors(NIGHT.win, DAY.win, day);
      roadMat.color.lerpColors(NIGHT.road, DAY.road, day);
      paveMat.color.lerpColors(NIGHT.pave, DAY.pave, day);
      pathMat.color.lerpColors(NIGHT.pave, DAY.pave, day);
      grassMat.color.lerpColors(NIGHT.grass, DAY.grass, day);
      kerbMat.color.lerpColors(NIGHT.kerb, DAY.kerb, day);
      for (let ci = 0; ci < ctxMats.length; ci++) {
        ctxMats[ci].color.lerpColors(ctxNight[ci], ctxDay[ci], day);
        // windows glow brightest through dusk, then die off in daylight
        ctxMats[ci].emissiveIntensity = lerp(NIGHT.ctxEmissive, DAY.ctxEmissive, day) + dusk * 0.12;
      }
      // Exposure follows day/night outside, then dips once we're inside the
      // cabin so the bright metal/glass interior keeps material definition
      // instead of clipping to white. insideT is 0 during the exterior beats,
      // so this never touches the tower/sky/moon.
      renderer.toneMappingExposure =
        mix3n(NIGHT.exposure, SUNSET.exposure, DAY.exposure, day) * lerp(1, 0.5, insideT) * lerp(1, 0.6, dayInterior);
      // The warm key is strong for the exterior tower but over-lights the pale
      // lobby marble once we're inside — ease it down with insideT (0 outside).
      key.intensity = 2.0 * lerp(1, 0.5, insideT) * lerp(1, 0.6, dayInterior);
      // sky: night dome is the base; sunset peaks mid-blend; day fades in last
      sunsetMat.opacity = dusk * 0.95;
      sunsetSky.visible = dusk > 0.01;
      daySkyMat.opacity = smoothstep(0.45, 1, day);
      daySky.visible = daySkyMat.opacity > 0.002;
      // celestial arcs: the sun climbs from behind the left skyline as day
      // rises; the moon sets behind the right skyline. Buildings depth-occlude
      // both, so rise/set genuinely happens behind the city.
      sun.mesh.position.set(-115, lerp(-38, 88, day), -150);
      sun.mesh.scale.setScalar(1 + dusk * 0.3); // horizon magnification
      sun.mat.opacity = smoothstep(0.14, 0.52, day);
      moonDisc.mesh.position.set(185, lerp(108, -30, day), -130);
      moonDisc.mat.opacity = 1 - smoothstep(0.32, 0.72, day);
      starMat.opacity = (1 - smoothstep(0.2, 0.55, day)) * (1 - dusk * 0.4);
      stars.visible = starMat.opacity > 0.01;

      // night/day outside → studio reflections come up as we step inside, but
      // eased to a restrained interior level (was ENV.intensity 1.25, which
      // over-lit the chrome/glass) so surfaces read with depth, not glare.
      scene.environmentIntensity = lerp(lerp(NIGHT.envExterior, DAY.envExterior, day), INTERIOR_ENV, insideT) * lerp(1, 0.66, dayInterior);
      // the exterior key light hands over to the interior rig at the threshold
      moon.intensity = lerp(NIGHT.moonI, DAY.moonI, day) * (1 - smoothstep(0.3, INSIDE_P + 0.03, p));
      // the entrance glass dissolves just before the camera passes through it,
      // and the plaza pool light dims so it can't blow out at point-blank range
      entGlassMat.opacity = 0.16 * (1 - smoothstep(0.26, 0.3, p));
      entGlass.visible = entGlassMat.opacity > 0.004;
      entrancePool.intensity = lerp(NIGHT.pool, DAY.pool, day) * (1 - smoothstep(0.22, 0.29, p));
      // doors part once we've settled inside the lobby ("the call")
      const o = smoothstep(0.36, 0.45, p);
      doorL.position.x = -W / 4 - o * (doorW + 0.02);
      doorR.position.x = W / 4 + o * (doorW + 0.02);
      // safety x-ray: fade side panels when the safety component is active
      const tgt = activeRef.current === safetyIdx ? 0.12 : 1;
      panelMat.opacity += (tgt - panelMat.opacity) * 0.12;
      // emissive pulses (dialled down so the ceiling LED + COP screen glow
      // read as light sources, not blown highlights, in the rebalanced interior)
      const t = (performance.now() - startT) / 1000;
      screenMat.emissiveIntensity = 0.5 + Math.sin(t * 3) * 0.14;
      ledMat.emissiveIntensity = 0.55 + Math.sin(t * 1.4) * 0.1;
      updateHotspots();
    };

    /* ===== Post ===== */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    /* NaN guard: anisotropic materials derive tangents from screen-space UV
       derivatives, which collapse to zero when a mesh shrinks to sub-pixel
       size (e.g. the cabin seen from the street in the arrival beat). One NaN
       pixel makes UnrealBloom's blur chain black out the whole frame, so
       scrub the buffer before bloom. */
    composer.addPass(
      new ShaderPass({
        uniforms: { tDiffuse: { value: null } },
        vertexShader:
          "varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
        fragmentShader: [
          "uniform sampler2D tDiffuse;",
          "varying vec2 vUv;",
          "void main(){",
          "  vec4 c = texture2D(tDiffuse, vUv);",
          "  c.rgb = clamp(c.rgb, vec3(0.0), vec3(1000.0));",
          "  if (c.r != c.r || c.g != c.g || c.b != c.b || c.a != c.a) c = vec4(0.0, 0.0, 0.0, 1.0);",
          "  gl_FragColor = c;",
          "}",
        ].join("\n"),
      })
    );
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.06, 0.4, 0.9));
    composer.addPass(new OutputPass());
    /* MSAA (renderer `antialias:true`) already resolves edges; SMAA is a second
       full-screen AA pass. Skip it on low-perf devices to save that pass. */
    if (!lowPerf) composer.addPass(new SMAAPass());

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    /* Warm-up: compile every shader program up-front (including the day-sky
       dome, which is hidden at night) so neither scrolling nor a theme switch
       can ever hit a first-use compile stall. */
    renderer.compile(scene, camera);

    /* Render only while the hero is on screen AND the tab is visible. The site
       is a static export, so this 1300vh section stays mounted the whole time;
       without gating, the full postprocessed WebGL frame would keep rendering
       (and on mobile contend with content-scroll compositing) long after the
       hero has scrolled away — a needless GPU/battery drain and a jitter source. */
    let raf = 0;
    let running = false;
    let inView = true;
    const shouldRun = () => inView && !document.hidden;

    /* One-way adaptive DPR: if a low-perf device sustains slow frames after a
       warm-up grace period, drop the pixel ratio a single step. It never raises
       it again, so there is no oscillation / monitoring feedback loop. */
    let watchdogDone = !lowPerf;
    let prevFrame = 0;
    let slowAccum = 0;
    let sampleFrames = 0;
    const graceUntil = performance.now() + 1600;

    const animate = () => {
      if (!shouldRun()) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(animate);
      pose(progress.current);
      composer.render();

      if (!watchdogDone) {
        const now = performance.now();
        if (prevFrame && now > graceUntil) {
          slowAccum += now - prevFrame;
          sampleFrames++;
          if (sampleFrames >= 72) {
            if (slowAccum / sampleFrames > 23) {
              // sustained < ~43fps → step DPR down once, then rebuild buffers
              renderer.setPixelRatio(Math.max(1, renderer.getPixelRatio() - 0.5));
              resize();
            }
            watchdogDone = true;
          }
        }
        prevFrame = now;
      }
    };

    const start = () => {
      if (running || !shouldRun()) return;
      running = true;
      lastT = performance.now(); // avoid a day/night dt jump after a pause
      prevFrame = 0;
      raf = requestAnimationFrame(animate);
    };

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) start();
      },
      { threshold: 0 }
    );
    io.observe(host);
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    /* Dev-only scrub hook: backgrounded/preview tabs freeze rAF, so tests can
       drive a synchronous pose + render (plus the HUD state) at any progress. */
    const devWindow = window as unknown as {
      __vertiqHero?: {
        set: (p: number) => void;
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        composer: EffectComposer;
      };
    };
    if (process.env.NODE_ENV !== "production") {
      devWindow.__vertiqHero = {
        set: (p: number) => {
          applyProgress(p);
          pose(p);
          composer.render();
        },
        scene,
        camera,
        renderer,
        composer,
      };
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
      delete devWindow.__vertiqHero;
      window.removeEventListener("resize", resize);
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else if (mat) mat.dispose();
      });
      disposables.forEach((d) => d.dispose());
      envRT.dispose();
      composer.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [applyProgress, onContextFail]);

  useGSAP(
    () => {
      if (!root.current) return;
      gsap.registerPlugin(ScrollTrigger);

      /* No hand-off overlay: the hero simply finishes its last beat and the
         next section scrolls in normally. */
      const dummy = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          onUpdate: (self) => applyProgress(self.progress),
        },
      });
      tl.to(dummy, { v: 1, duration: 0.01 }, 100);
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section} style={{ height: `${SCROLL_VH}vh` }} aria-label="Arrival at a Philbrick-equipped tower and interactive elevator, explore the components">
      <div className={styles.stage}>
        <div ref={mount} className={styles.mount} aria-hidden />
        <div className={styles.vignette} aria-hidden />
        <div className={styles.topScrim} aria-hidden />

        {/* Exterior-beat copy (arrival / approach), before the explorer takes
            over. The arrival line is the homepage's H1 — it's present in the
            initial HTML, so the page has a crawlable primary heading even
            though the scene itself renders in WebGL. */}
        <div className={`${styles.beatCopy} ${beat >= 0 ? styles.beatShow : ""}`}>
          {beat >= 0 &&
            (() => {
              const Title = beat === 0 ? "h1" : "h2";
              return (
                <>
                  <span className={styles.capIndex}>{BEATS[beat].eyebrow}</span>
                  <Title className={styles.beatTitle}>
                    {BEATS[beat].lead} <em>{BEATS[beat].em}</em>
                  </Title>
                  <p className={styles.capTagline}>
                    {theme === "light" ? BEATS[beat].subDay : BEATS[beat].sub}
                  </p>
                </>
              );
            })()}
        </div>

        {/* Clickable component hotspots (positioned each frame over the 3D part) */}
        {ELEVATOR_COMPONENTS.map((c, i) => (
          <button
            key={c.key}
            ref={(el) => {
              hotspotRefs.current[i] = el;
            }}
            type="button"
            className={styles.hotspot}
            onClick={() => setOpenComponent(c)}
            aria-label={`${c.name}, view details`}
          >
            <span className={styles.hotspotDot} />
            <span className={styles.hotspotLabel}>{c.name}</span>
          </button>
        ))}

        {/* Active-component caption */}
        <div className={`${styles.caption} ${active >= 0 ? styles.captionShow : ""}`}>
          {active >= 0 && (
            <>
              <span className={styles.capIndex}>
                {ELEVATOR_COMPONENTS[active].index} Component
              </span>
              <h2 className={styles.capName}>{ELEVATOR_COMPONENTS[active].name}</h2>
              <p className={styles.capTagline}>{ELEVATOR_COMPONENTS[active].tagline}</p>
              <div className={styles.capBtn}>
                <Button size="sm" withArrow onClick={() => setOpenComponent(ELEVATOR_COMPONENTS[active])}>
                  View details
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Component rail */}
        <div className={styles.rail}>
          {ELEVATOR_COMPONENTS.map((c, i) => (
            <button
              key={c.key}
              type="button"
              className={`${styles.railItem} ${i === active ? styles.railItemActive : ""}`}
              onClick={() => setOpenComponent(c)}
            >
              {c.name}
              <span className={styles.railDot} />
            </button>
          ))}
        </div>

        <div className={story.progressTrack} aria-hidden>
          <div ref={bar} className={story.progressBar} />
        </div>
        <div className={`${story.cue} ${styles.cueHalo}`} aria-hidden>
          <span>Scroll to explore</span>
          <span className={story.cueLine} />
          <FiArrowDown />
        </div>
      </div>

      <ComponentModal component={openComponent} onClose={() => setOpenComponent(null)} />
    </section>
  );
}
