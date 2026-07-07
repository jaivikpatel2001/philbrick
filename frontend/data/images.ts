/* =============================================================================
   VERTIQ — IMAGE CATALOG
   Single source of truth for every image reference. Never hardcode URLs in
   components — import from here. Placeholders use Unsplash; swap the IDs for
   production assets without touching component code.
   ========================================================================== */

const UNSPLASH = "https://images.unsplash.com/photo-";

/** Build a sized, optimized Unsplash URL from a photo id. */
export function img(
  id: string,
  { w = 1600, q = 75, h }: { w?: number; q?: number; h?: number } = {}
): string {
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(w),
    q: String(q),
  });
  if (h) params.set("h", String(h));
  return `${UNSPLASH}${id}?${params.toString()}`;
}

/* ----- Raw photo IDs (curated: architecture, vertical transport, tech) ---- */
const ID = {
  towerUpward: "1486406146926-c627a92ad1ab",
  glassFacade: "1496307653780-42ee777d4833",
  skylineDusk: "1444723121867-7a241cacace9",
  curvedTower: "1493606278519-11aa9f86e40a",
  whiteArch: "1487958449943-2429e8be8625",
  atriumLight: "1545324418-cc1a3fa10c00",
  lobbyInterior: "1497366216548-37526070297c",
  modernLobby: "1497366811353-6870744d04b2",
  escalator: "1567958451986-2de427a4a0be",
  escalatorMetro: "1610018556010-6a11691bc905",
  elevatorCabin: "1554469384-e58fac16e23a",
  staircaseSpiral: "1503387762-592deb58ef4e",
  cityNight: "1449824913935-59a10b8d2000",
  engineerFactory: "1581091226825-a6a2a5aee158",
  controlRoom: "1581092160562-40aa08e78837",
  blueprint: "1503387837-b154d5074bd2",
  teamMeeting: "1522071820081-009f0129c71c",
  handshake: "1521737604893-d14cc237f11d",
  solarPanels: "1509391366360-2e959784a276",
  greenBuilding: "1518005020951-eccb494ad742",
  dataServer: "1558494949-ef010cbdcc31",
  circuitTech: "1518770660439-4636190af475",
  hospitalCorridor: "1519494026892-80bbd2d6fd0d",
  warehouse: "1553413077-190dd305871c",
  hotelLobby: "1564501049412-61c2a3083791",
  residentialTower: "1545079968-1feb95494244",
  craneConstruction: "1541888946425-d81bb19240f5",
  facadeNight: "1470723710355-95304d8aece4",
  portraitMan: "1500648767791-00dcc994a43e",
  portraitWoman: "1494790108377-be9c29b29330",
  portraitMan2: "1507003211169-0a1dd7228f2d",
  portraitWoman2: "1438761681033-6461ffad8d80",
  abstractBlue: "1451187580459-43490279c0fa",
  cityAerial: "1480714378408-67cf0d13bc1b",
  // Indian context (web-sourced from Unsplash; review/replace with licensed
  // brand photography before launch):
  mumbaiSkyline: "1710582308582-55cc0c461c4e",
  mumbaiNight: "1726390731208-3656bb0b8e42",
  personIN1: "1742981365880-698cfb84492d",
  personIN2: "1653666866518-d01fabfa94c2",
  personIN3: "1626063240213-c629ae4ef34c",
  personIN4: "1656221009909-4f202547cd94",
};

/* ----- Hero & atmospheric --------------------------------------------- */
export const HERO = {
  home: img(ID.mumbaiSkyline, { w: 2400, q: 80 }),
  homeAlt: img(ID.mumbaiNight, { w: 2000 }),
  about: img(ID.atriumLight, { w: 2200 }),
  products: img(ID.elevatorCabin, { w: 2200 }),
  technology: img(ID.circuitTech, { w: 2200 }),
  innovation: img(ID.dataServer, { w: 2200 }),
  projects: img(ID.mumbaiNight, { w: 2400 }),
  services: img(ID.engineerFactory, { w: 2200 }),
  industries: img(ID.glassFacade, { w: 2200 }),
  sustainability: img(ID.greenBuilding, { w: 2200 }),
  quality: img(ID.controlRoom, { w: 2200 }),
  careers: img(ID.teamMeeting, { w: 2200 }),
  blog: img(ID.cityAerial, { w: 2200 }),
  contact: img(ID.facadeNight, { w: 2200 }),
  dealer: img(ID.handshake, { w: 2200 }),
  global: img(ID.mumbaiSkyline, { w: 2400 }),
  download: img(ID.blueprint, { w: 2200 }),
  faq: img(ID.whiteArch, { w: 2000 }),
};

/* ----- Products -------------------------------------------------------- */
export const PRODUCT_IMG = {
  passenger: img(ID.elevatorCabin, { w: 1400 }),
  home: img(ID.modernLobby, { w: 1400 }),
  freight: img(ID.warehouse, { w: 1400 }),
  hospital: img(ID.hospitalCorridor, { w: 1400 }),
  escalators: img(ID.escalatorMetro, { w: 1400 }),
  components: img(ID.controlRoom, { w: 1400 }),
  walkways: img(ID.escalator, { w: 1400 }),
  panoramic: img(ID.glassFacade, { w: 1400 }),
  highspeed: img(ID.curvedTower, { w: 1400 }),
  mrl: img(ID.staircaseSpiral, { w: 1400 }),
  dumbwaiter: img(ID.lobbyInterior, { w: 1400 }),
  capsule: img(ID.atriumLight, { w: 1400 }),
};

/* ----- Industries ------------------------------------------------------ */
export const INDUSTRY_IMG = {
  residential: img(ID.residentialTower, { w: 1400 }),
  commercial: img(ID.glassFacade, { w: 1400 }),
  healthcare: img(ID.hospitalCorridor, { w: 1400 }),
  hospitality: img(ID.hotelLobby, { w: 1400 }),
  industrial: img(ID.warehouse, { w: 1400 }),
};

/* ----- Projects -------------------------------------------------------- */
export const PROJECT_IMG = {
  one: img(ID.mumbaiSkyline, { w: 1600 }),
  two: img(ID.mumbaiNight, { w: 1600 }),
  three: img(ID.hotelLobby, { w: 1600 }),
  four: img(ID.hospitalCorridor, { w: 1600 }),
  five: img(ID.glassFacade, { w: 1600 }),
  six: img(ID.cityAerial, { w: 1600 }),
  seven: img(ID.residentialTower, { w: 1600 }),
  eight: img(ID.facadeNight, { w: 1600 }),
};

/* ----- Technology / innovation ---------------------------------------- */
export const TECH_IMG = {
  ai: img(ID.dataServer, { w: 1400 }),
  iot: img(ID.circuitTech, { w: 1400 }),
  drive: img(ID.controlRoom, { w: 1400 }),
  digital: img(ID.abstractBlue, { w: 1400 }),
  cabin: img(ID.atriumLight, { w: 1400 }),
  safety: img(ID.engineerFactory, { w: 1400 }),
};

/* ----- Services -------------------------------------------------------- */
export const SERVICE_IMG = {
  installation: img(ID.craneConstruction, { w: 1400 }),
  maintenance: img(ID.engineerFactory, { w: 1400 }),
  modernization: img(ID.lobbyInterior, { w: 1400 }),
  amc: img(ID.controlRoom, { w: 1400 }),
};

/* ----- People ---------------------------------------------------------- */
export const PEOPLE = {
  a: img(ID.personIN1, { w: 600, h: 720 }),
  b: img(ID.personIN2, { w: 600, h: 720 }),
  c: img(ID.personIN3, { w: 600, h: 720 }),
  d: img(ID.personIN4, { w: 600, h: 720 }),
};

/* ----- Editorial / misc ------------------------------------------------ */
export const MISC = {
  sustainability: img(ID.solarPanels, { w: 1400 }),
  greenBuilding: img(ID.greenBuilding, { w: 1400 }),
  blueprint: img(ID.blueprint, { w: 1400 }),
  factory: img(ID.engineerFactory, { w: 1400 }),
  lobby: img(ID.lobbyInterior, { w: 1400 }),
  spiral: img(ID.staircaseSpiral, { w: 1200 }),
  aerial: img(ID.cityAerial, { w: 1800 }),
  ctaTower: img(ID.facadeNight, { w: 2000 }),
};

export const BLOG_IMG = [
  img(ID.dataServer, { w: 1200 }),
  img(ID.greenBuilding, { w: 1200 }),
  img(ID.circuitTech, { w: 1200 }),
  img(ID.craneConstruction, { w: 1200 }),
  img(ID.elevatorCabin, { w: 1200 }),
  img(ID.skylineDusk, { w: 1200 }),
];

export const OG_IMAGE = img(ID.towerUpward, { w: 1200, h: 630 });
