"use client";
import { useEffect, useRef, useState } from "react";
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
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { FiArrowDown } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { MODEL } from "@/data/model";
import { ScrollStory } from "./ScrollStory";
import story from "./ScrollStory.module.css";
import styles from "./ElevatorScene.module.css";

const SCROLL_VH = 900;

const SCENES = [
  {
    eyebrow: "01 — Arrival",
    t1: "Engineered for ",
    em: "movement.",
    sub: "Step into a lobby built around one of the most advanced vertical-transport systems in the world.",
    notes: ["Architectural by design", "Silent by engineering", "Built for generations"],
  },
  {
    eyebrow: "02 — The Call",
    t1: "Your elevator ",
    em: "arrives.",
    sub: "Floors settle to your level, the indicator stills, and the doors part in perfect silence.",
  },
  {
    eyebrow: "03 — Step Inside",
    t1: "Into the ",
    em: "cabin.",
    sub: "Brushed steel, heavy glass and warm hidden light — craftsmanship in every surface.",
  },
  {
    eyebrow: "04 — Ascending",
    t1: "The ",
    em: "ascent.",
    sub: "Smooth, silent, effortless — the building falls away beneath you.",
  },
  {
    eyebrow: "05 — Engineering",
    t1: "Beneath the ",
    em: "calm.",
    sub: "Behind the panels: guide rails, counterweight, suspension and a gearless machine in perfect balance.",
  },
];

const HUD = ["Arrival", "The Call", "Step Inside", "Ascending", "Engineering"];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}
function sceneFrom(p: number) {
  if (p < 0.2) return 0;
  if (p < 0.4) return 1;
  if (p < 0.6) return 2;
  if (p < 0.82) return 3;
  return 4;
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
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setFallback(mq.matches || !hasWebGL());
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  if (fallback) return <ScrollStory />;
  return <Scene3D />;
}

function Scene3D() {
  const root = useRef<HTMLElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.9;
    pmrem.dispose();

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
      if (light) {
        g.addColorStop(0, "#e9e6df");
        g.addColorStop(1, "#d7d2c8");
      } else {
        g.addColorStop(0, "#33363d");
        g.addColorStop(1, "#262931");
      }
      x.fillStyle = g;
      x.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 26; i++) {
        const v = light ? 90 + Math.random() * 60 : 150 + Math.random() * 80;
        x.strokeStyle = `rgba(${v},${v},${v + 8},${0.05 + Math.random() * 0.12})`;
        x.lineWidth = 0.4 + Math.random() * 2;
        x.beginPath();
        let px = Math.random() * 512, py = Math.random() * 512;
        x.moveTo(px, py);
        for (let j = 0; j < 6; j++) {
          px += (Math.random() - 0.5) * 200;
          py += (Math.random() - 0.5) * 200;
          x.lineTo(px, py);
        }
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
    const steel = new THREE.MeshPhysicalMaterial({ color: 0x9aa3b1, metalness: 1, roughness: 0.3, roughnessMap: brushed, anisotropy: 0.55, anisotropyRotation: Math.PI / 2, envMapIntensity: 1.3, clearcoat: 0.2, clearcoatRoughness: 0.3 });
    const darkMetal = new THREE.MeshPhysicalMaterial({ color: 0x171a20, metalness: 0.92, roughness: 0.42, roughnessMap: brushed, envMapIntensity: 1.0 });
    const gold = new THREE.MeshPhysicalMaterial({ color: 0xc7a96a, metalness: 1, roughness: 0.34, anisotropy: 0.4, envMapIntensity: 1.3, clearcoat: 0.3, clearcoatRoughness: 0.22 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xdcebf3, metalness: 0, roughness: 0.05, transmission: 1, thickness: 0.6, ior: 1.46, transparent: true, opacity: 1, envMapIntensity: 1.4, clearcoat: 0.6, clearcoatRoughness: 0.06 });
    const panelMat = new THREE.MeshPhysicalMaterial({ color: 0x8e97a5, metalness: 1, roughness: 0.3, roughnessMap: brushed, anisotropy: 0.5, envMapIntensity: 1.25, transparent: true, opacity: 1 });
    const mirror = new THREE.MeshPhysicalMaterial({ color: 0x232b34, metalness: 1, roughness: 0.06, envMapIntensity: 1.6 });
    const stone = new THREE.MeshStandardMaterial({ map: floorMarble, color: 0x6b6b72, metalness: 0.1, roughness: 0.4, envMapIntensity: 0.7 });
    const floorMat = new THREE.MeshStandardMaterial({ map: floorMarble, color: 0xb7b2a8, metalness: 0.1, roughness: 0.14, envMapIntensity: 1.0 });
    const wallMat = new THREE.MeshStandardMaterial({ map: wallMarble, color: 0x3a3e46, metalness: 0.05, roughness: 0.55, envMapIntensity: 0.55 });
    const coveMat = new THREE.MeshStandardMaterial({ color: 0xffe9c8, emissive: 0xffe1b4, emissiveIntensity: 1.1 });
    const ledMat = new THREE.MeshStandardMaterial({ color: 0xfff4d6, emissive: 0xffe6b0, emissiveIntensity: 1.6 });
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x06102a, emissive: 0x2f6bff, emissiveIntensity: 1.2 });
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0x06122e, emissive: 0x37a0ff, emissiveIntensity: 1.6 });
    const brakeMat = new THREE.MeshPhysicalMaterial({ color: 0xb23a2c, metalness: 0.45, roughness: 0.45, clearcoat: 0.3, emissive: 0x3a0d08, emissiveIntensity: 0.4 });

    /* ---------- Helpers ---------- */
    const geoCache = new Map<string, RoundedBoxGeometry>();
    const rbox = (w: number, h: number, d: number, r = 0.02) => {
      const key = `${w}_${h}_${d}_${r}`;
      let g = geoCache.get(key);
      if (!g) {
        g = new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2));
        geoCache.set(key, g);
        disposables.push(g);
      }
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
    const FY = -H / 2; // floor level

    const world = new THREE.Group();
    scene.add(world);

    /* ================= LOBBY ================= */
    const lobby = new THREE.Group();
    world.add(lobby);
    // floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FY;
    floor.receiveShadow = true;
    lobby.add(floor);
    // back wall (behind the elevator) + side walls
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 9), wallMat);
    backWall.position.set(0, FY + 4, -4.2);
    backWall.receiveShadow = true;
    lobby.add(backWall);
    for (const sx of [-1, 1]) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(16, 9), wallMat);
      w.rotation.y = -sx * (Math.PI / 2);
      w.position.set(sx * 7, FY + 4, 0);
      w.receiveShadow = true;
      lobby.add(w);
      // gold pilaster reveals on the back wall
      box(lobby, [0.08, 7, 0.12], [sx * 2.6, FY + 3.2, -4.1], gold, false, 0.02);
    }
    // ceiling + warm light coves
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(20, 16), wallMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, FY + 8, 0);
    lobby.add(ceiling);
    for (const cz of [-3, 0, 3]) {
      const cove = new THREE.Mesh(rbox(9, 0.06, 0.4, 0.02), coveMat);
      cove.position.set(0, FY + 7.8, cz);
      lobby.add(cove);
    }

    /* ================= ELEVATOR CAR ================= */
    const car = new THREE.Group();
    world.add(car);
    // frame: top, bottom, glass back (panoramic — see the shaft), gold corner posts
    box(car, [W + 0.12, 0.14, D + 0.12], [0, H / 2, 0], darkMetal); // header
    box(car, [W + 0.12, 0.16, D + 0.12], [0, -H / 2, 0], darkMetal); // base
    box(car, [W - 0.06, H - 0.2, 0.05], [0, 0, -D / 2], glass, false); // glass back wall
    box(car, [W - 0.1, 0.05, D - 0.1], [0, FY + 0.1, 0], stone, false); // cabin floor
    for (const sx of [-1, 1])
      for (const sz of [-1, 1])
        box(car, [0.07, H, 0.07], [(sx * W) / 2, 0, (sz * D) / 2], gold);
    // ceiling LED
    const ledCeil = new THREE.Mesh(rbox(W - 0.5, 0.05, D - 0.5, 0.02), ledMat);
    ledCeil.position.set(0, H / 2 - 0.12, 0);
    car.add(ledCeil);
    // side panels (steel) — these FADE in the engineering reveal
    const sidePanels = new THREE.Group();
    car.add(sidePanels);
    box(sidePanels, [0.05, H - 0.2, D - 0.2], [-W / 2, 0, 0], panelMat, false);
    box(sidePanels, [0.05, H - 0.2, D - 0.2], [W / 2, 0, 0], panelMat, false);
    // mirror strip + handrail + control panel on the right interior
    const backMirror = new THREE.Mesh(rbox(0.02, H - 0.7, D - 0.7, 0.01), mirror);
    backMirror.position.set(-W / 2 + 0.06, 0.1, 0);
    car.add(backMirror);
    const handrail = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, D - 0.4, 16), gold);
    handrail.rotation.x = Math.PI / 2;
    handrail.position.set(W / 2 - 0.08, -0.1, 0);
    car.add(handrail);
    const cop = new THREE.Group();
    cop.position.set(W / 2 - 0.12, 0.15, D / 2 - 0.3);
    box(cop, [0.04, 0.9, 0.2], [0, 0, 0], steel, false);
    const copScreen = new THREE.Mesh(rbox(0.02, 0.18, 0.14, 0.01), screenMat);
    copScreen.position.set(-0.03, 0.28, 0);
    cop.add(copScreen);
    const btnGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.02, 12);
    for (let i = 0; i < 8; i++) {
      const b = new THREE.Mesh(btnGeo, screenMat);
      b.rotation.z = Math.PI / 2;
      b.position.set(-0.03, 0.05 - (i % 4) * 0.1, i < 4 ? -0.04 : 0.04);
      cop.add(b);
    }
    car.add(cop);
    // doors (front) + transom + floor indicator
    const doorW = W / 2 - 0.05;
    const doorL = box(car, [doorW, H - 0.7, 0.05], [-W / 4, -0.1, D / 2], glass, false);
    const doorR = box(car, [doorW, H - 0.7, 0.05], [W / 4, -0.1, D / 2], glass, false);
    box(doorL, [0.05, H - 0.7, 0.07], [doorW / 2 - 0.02, 0, 0], steel, false, 0.015);
    box(doorR, [0.05, H - 0.7, 0.07], [-doorW / 2 + 0.02, 0, 0], steel, false, 0.015);
    box(car, [W, 0.4, 0.08], [0, H / 2 - 0.2, D / 2], darkMetal); // transom
    // floor indicator (canvas)
    const indCanvas = document.createElement("canvas");
    indCanvas.width = 256;
    indCanvas.height = 96;
    const indCtx = indCanvas.getContext("2d")!;
    const indTex = track(new THREE.CanvasTexture(indCanvas));
    indTex.colorSpace = THREE.SRGBColorSpace;
    let lastFloor = -1;
    const drawFloor = (n: number) => {
      indCtx.clearRect(0, 0, 256, 96);
      indCtx.fillStyle = "#070707";
      indCtx.fillRect(0, 0, 256, 96);
      indCtx.fillStyle = "#d8b673";
      indCtx.font = "bold 58px monospace";
      indCtx.textAlign = "center";
      indCtx.textBaseline = "middle";
      indCtx.fillText(`▲ ${n}`, 128, 52);
      indTex.needsUpdate = true;
    };
    drawFloor(1);
    const indMat = new THREE.MeshStandardMaterial({ map: indTex, emissive: 0xffffff, emissiveMap: indTex, emissiveIntensity: 1.1, toneMapped: true });
    const indicator = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.26), indMat);
    indicator.position.set(0, H / 2 - 0.2, D / 2 + 0.05);
    car.add(indicator);
    // interior warm light
    const interiorLight = new THREE.PointLight(0xffd9a0, 0, 6, 2);
    interiorLight.position.set(0, 0.3, 0);
    car.add(interiorLight);

    /* ================= SHAFT (scrolls during ascent) ================= */
    const shaft = new THREE.Group();
    shaft.position.z = -D / 2 - 0.6;
    world.add(shaft);
    // guide rails
    for (const sx of [-1, 1]) {
      const rail = box(shaft, [0.1, 26, 0.1], [sx * (W / 2 + 0.25), 0, 0], steel, false, 0.02);
      rail.position.z = 0;
    }
    // counterweight
    const counterweight = new THREE.Group();
    counterweight.position.set(W / 2 + 0.6, 0, -0.3);
    box(counterweight, [0.3, 1.8, 0.4], [0, 0, 0], darkMetal, false, 0.02);
    for (let i = 0; i < 8; i++) box(counterweight, [0.24, 0.16, 0.34], [0, -0.7 + i * 0.2, 0.03], steel, false, 0.01);
    shaft.add(counterweight);
    // repeating floor markers + shaft lights
    const markers = new THREE.Group();
    shaft.add(markers);
    for (let i = -6; i <= 6; i++) {
      box(markers, [W * 2.4, 0.08, 0.3], [0, i * 2.4, -0.6], darkMetal, false, 0.01);
      const lt = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), sensorMat);
      lt.position.set(-(W / 2 + 0.5), i * 2.4 + 1.2, -0.5);
      markers.add(lt);
    }
    // machine room at top
    const machine = new THREE.Group();
    machine.position.set(0, 6.2, -0.3);
    box(machine, [1.4, 0.5, 0.9], [0, -0.3, 0], darkMetal, false, 0.04);
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 28), steel);
    motor.rotation.z = Math.PI / 2;
    machine.add(motor);
    const sheave = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.18, 32), gold);
    sheave.rotation.z = Math.PI / 2;
    sheave.position.x = 0.55;
    machine.add(sheave);
    shaft.add(machine);
    // suspension ropes (cabin top → machine)
    const ropes = new THREE.Group();
    for (const rx of [-0.18, 0, 0.18]) {
      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 6, 6), steel);
      r.position.set(rx, 3.4, 0);
      ropes.add(r);
    }
    shaft.add(ropes);
    // safety brakes on the car (revealed with the panels)
    box(car, [0.18, 0.4, 0.3], [-(W / 2 + 0.04), -0.4, -0.2], brakeMat, false, 0.02);
    box(car, [0.18, 0.4, 0.3], [W / 2 + 0.04, -0.4, -0.2], brakeMat, false, 0.02);

    /* ================= Ambient particles ================= */
    const pCount = 260;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 12;
      pPos[i * 3 + 1] = Math.random() * 7 + FY;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    disposables.push(pGeo);
    const pMat = track(new THREE.PointsMaterial({ color: 0xffe9c8, size: 0.02, transparent: true, opacity: 0.25, depthWrite: false }));
    const particles = new THREE.Points(pGeo, pMat);
    world.add(particles);

    /* ================= Lighting ================= */
    const key = new THREE.DirectionalLight(0xffe9cf, 2.0);
    key.position.set(4, 7, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
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
    scene.add(new THREE.HemisphereLight(0x5a6577, 0x0a0b0e, 0.4));
    // destination light (brightens on arrival)
    const destLight = new THREE.PointLight(0xfff2dc, 0, 12, 2);
    destLight.position.set(0, 0.5, 3.5);
    scene.add(destLight);

    /* ================= Optional GLTF ================= */
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
          m.traverse((o) => {
            const mm = o as THREE.Mesh;
            if (mm.isMesh) {
              mm.castShadow = true;
              mm.receiveShadow = true;
              const mat = mm.material as THREE.MeshStandardMaterial | undefined;
              if (mat && "envMapIntensity" in mat) mat.envMapIntensity = 1.3;
            }
          });
          gltfGroup.add(m);
          gltfGroup.visible = true;
          world.visible = false;
          gltfActive = true;
        },
        undefined,
        (err) => console.warn("[ElevatorScene] GLTF failed to load, using procedural fallback:", err)
      );
    }

    /* ================= Camera path ================= */
    const camKeys = [
      { p: 0.0, pos: [0.0, 0.55, 8.6] }, // arrival — across the lobby
      { p: 0.22, pos: [0.0, 0.4, 6.0] }, // the call — approach
      { p: 0.42, pos: [0.0, 0.3, 4.2] }, // step inside — at the doorway
      { p: 0.62, pos: [0.55, 0.45, 4.1] }, // ascending — slight parallax
      { p: 0.82, pos: [2.0, 0.7, 4.8] }, // engineering — pull aside to see structure
      { p: 0.9, pos: [0.3, 0.25, 3.2] }, // recenter on the doorway
      { p: 1.0, pos: [0.0, 0.02, 1.2] }, // glide inside (the light wipe covers the final push)
    ];
    const camKeysG = [
      { p: 0.0, pos: [0.0, 0.4, 9.5] },
      { p: 0.5, pos: [0.6, 0.5, 7.6] },
      { p: 1.0, pos: [0.0, 0.2, 5.0] },
    ];
    const sample = (k: { p: number; pos: number[] }[], p: number) => {
      if (p <= k[0].p) return k[0].pos;
      if (p >= k[k.length - 1].p) return k[k.length - 1].pos;
      for (let i = 0; i < k.length - 1; i++)
        if (p >= k[i].p && p <= k[i + 1].p) {
          const t = smoothstep(k[i].p, k[i + 1].p, p);
          return [lerp(k[i].pos[0], k[i + 1].pos[0], t), lerp(k[i].pos[1], k[i + 1].pos[1], t), lerp(k[i].pos[2], k[i + 1].pos[2], t)];
        }
      return k[k.length - 1].pos;
    };
    const target = new THREE.Vector3(0, 0.0, 0);
    const targetG = new THREE.Vector3(0, 0.1, 0);

    const floorNumber = (p: number) => {
      if (p < 0.3) return Math.round(lerp(9, 1, p / 0.3)); // arriving
      if (p < 0.5) return 1;
      if (p < 0.9) return Math.round(lerp(1, 42, (p - 0.5) / 0.4)); // ascending
      return 42;
    };

    const pose = (p: number, t: number) => {
      if (gltfActive) {
        const cg = sample(camKeysG, p);
        camera.position.set(cg[0], cg[1], cg[2]);
        camera.lookAt(targetG);
        gltfGroup.rotation.y = Math.sin(t * 0.18) * 0.03;
        return;
      }

      const cp = sample(camKeys, p);
      camera.position.set(cp[0], cp[1], cp[2]);
      camera.lookAt(target);

      // doors open during the call / step-inside
      const o = smoothstep(0.26, 0.46, p);
      doorL.position.x = -W / 4 - o * (doorW + 0.02);
      doorR.position.x = W / 4 + o * (doorW + 0.02);

      // interior light comes up once you can see inside
      interiorLight.intensity = smoothstep(0.34, 0.5, p) * 2.6;

      // ascent: scroll the shaft markers downward (looped) + climb the indicator
      const travel = Math.max(0, p - 0.5) * 60;
      markers.position.y = -(travel % 2.4);
      counterweight.position.y = (travel % 4.8) - 2.0;
      const fn = floorNumber(p);
      if (fn !== lastFloor) {
        lastFloor = fn;
        drawFloor(fn);
      }

      // engineering reveal: fade the side panels to expose rails/machine/ropes
      const xray = smoothstep(0.68, 0.82, p) * (1 - smoothstep(0.93, 0.99, p));
      panelMat.opacity = 1 - xray * 0.92;
      sensorMat.emissiveIntensity = 1.2 + Math.sin(t * 2.4) * 0.5;
      screenMat.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.3;

      // destination: warm light blooms, doors fully open
      const dest = smoothstep(0.9, 1, p);
      destLight.intensity = dest * 6;
      ledMat.emissiveIntensity = 1.4 + dest * 1.2;

      // subtle particle drift
      particles.rotation.y = t * 0.01;
    };

    /* ================= Post ================= */
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.12, 0.4, 0.9); // very subtle
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    composer.addPass(new SMAAPass());

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

    const startT = performance.now();
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      pose(progress.current, (performance.now() - startT) / 1000);
      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
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
  }, []);

  useGSAP(
    () => {
      if (!root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = gsap.utils.selector(root);
      const s = (c: string) => `.${c}`;
      const scenes = q("[data-scene]");
      const finale = q(s(story.finale))[0];
      const finaleScrim = q(s(styles.finaleScrim))[0];
      const cue = q(s(story.cue))[0];

      // Full-screen light-wipe overlay (appended to body so it sits above the
      // whole page during the hero → content hand-off).
      const flash = document.createElement("div");
      flash.className = styles.flash;
      flash.setAttribute("aria-hidden", "true");
      document.body.appendChild(flash);
      gsap.set(flash, { opacity: 0 });

      gsap.set(scenes, { autoAlpha: 0, y: 26 });
      gsap.set(scenes[0], { autoAlpha: 1, y: 0 });
      gsap.set([finale, finaleScrim], { autoAlpha: 0 });

      const dummy = { v: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,
          onUpdate: (self) => {
            progress.current = self.progress;
            if (bar.current) bar.current.style.width = `${self.progress * 100}%`;
            setActive((prev) => {
              const next = sceneFrom(self.progress);
              return next === prev ? prev : next;
            });
          },
        },
      });

      tl.to(cue, { autoAlpha: 0, duration: 4 }, 5);
      tl.to(scenes[0], { autoAlpha: 0, y: -22, duration: 5 }, 16);
      tl.to(scenes[1], { autoAlpha: 1, y: 0, duration: 5 }, 21);
      tl.to(scenes[1], { autoAlpha: 0, y: -22, duration: 5 }, 37);
      tl.to(scenes[2], { autoAlpha: 1, y: 0, duration: 5 }, 42);
      tl.to(scenes[2], { autoAlpha: 0, y: -22, duration: 5 }, 58);
      tl.to(scenes[3], { autoAlpha: 1, y: 0, duration: 5 }, 62);
      tl.to(scenes[3], { autoAlpha: 0, y: -22, duration: 5 }, 78);
      tl.to(scenes[4], { autoAlpha: 1, y: 0, duration: 5 }, 82);
      tl.to(scenes[4], { autoAlpha: 0, y: -22, duration: 4 }, 88);
      tl.to(finaleScrim, { autoAlpha: 1, duration: 5 }, 84);
      tl.to(finale, { autoAlpha: 1, duration: 5 }, 86);
      tl.set(finale, { pointerEvents: "auto" }, 89);
      // doors open → warm light blooms into a full-screen wipe
      tl.to(flash, { opacity: 1, duration: 9 }, 91);
      tl.to(dummy, { v: 1, duration: 0.01 }, 100);

      // …then the wipe fades out as the real page content scrolls up beneath it
      ScrollTrigger.create({
        trigger: root.current,
        start: "bottom bottom",
        end: "+=100%",
        scrub: true,
        onUpdate: (self) => {
          flash.style.opacity = String(1 - self.progress);
        },
      });

      return () => {
        flash.remove();
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className={styles.section} style={{ height: `${SCROLL_VH}vh` }} aria-label="The VERTIQ vertical-mobility experience">
      <div className={styles.stage}>
        <div ref={mount} className={styles.mount} aria-hidden />
        <div className={styles.vignette} aria-hidden />
        <div className={styles.topScrim} aria-hidden />
        <div className={styles.copyScrim} aria-hidden />

        <div className={styles.copyWrap}>
          {SCENES.map((sc, i) => (
            <div key={i} className={story.scene} data-scene>
              <div className={story.sceneInner}>
                <span className={story.eyebrow}>{sc.eyebrow}</span>
                <h2 className={story.sceneTitle}>
                  {sc.t1}
                  <em>{sc.em}</em>
                </h2>
                <p className={story.sceneSub}>{sc.sub}</p>
                {sc.notes && (
                  <div className={story.sceneNote}>
                    {sc.notes.map((n) => (
                      <span key={n}>{n}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.finaleScrim} aria-hidden />

        <div className={story.finale}>
          <div className={story.finaleInner}>
            <h2 className={story.finaleTitle}>
              Engineering Every
              <br />
              <em>Journey.</em>
            </h2>
            <p className={story.finaleSub}>Innovation · Reliability · Excellence</p>
            <div className={story.finaleActions}>
              <Button href="/products" size="lg" withArrow>
                Explore our solutions
              </Button>
              <Button href="/contact" size="lg" variant="secondary">
                Request consultation
              </Button>
            </div>
          </div>
        </div>

        <div className={story.hud} aria-hidden>
          {HUD.map((label, i) => (
            <div key={label} className={`${story.hudDot} ${i === active ? story.hudDotActive : ""}`}>
              {label}
            </div>
          ))}
        </div>
        <div className={story.progressTrack} aria-hidden>
          <div ref={bar} className={story.progressBar} />
        </div>
        <div className={story.cue} aria-hidden>
          <span>Scroll</span>
          <span className={story.cueLine} />
          <FiArrowDown />
        </div>
      </div>
    </section>
  );
}
