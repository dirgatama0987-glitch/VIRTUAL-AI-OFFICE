import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("office");
if (!canvas) throw new Error("Canvas #office tidak ditemukan");

// ==============================
// NEURA OFFICE 3.0 - Multi Room Realistic
// ==============================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);
scene.fog = new THREE.Fog(0x0f172a, 40, 90);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 250);
camera.position.set(22, 28, 22);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 2);
controls.maxPolarAngle = Math.PI / 2.15;
controls.minDistance = 14;
controls.maxDistance = 55;

// ========== MATERIALS ==========
const mat = (c, r = 0.5, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const floorMat = mat(0x1e293b, 0.4, 0.15);
const wallMat = mat(0x1e293b, 0.75);
const darkMat = mat(0x0f172a, 0.3, 0.3);
const woodMat = mat(0x5c4033, 0.45);
const whiteMat = mat(0xf1f5f9, 0.25);
const blackMat = mat(0x0a0f18, 0.2, 0.2);
const blueMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 1.4 });
const purpleMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, emissiveIntensity: 1.3 });
const greenMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 1.2 });
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x93c5fd, transparent: true, opacity: 0.18, roughness: 0.04, metalness: 0.05, side: THREE.DoubleSide
});
const partitionMat = new THREE.MeshPhysicalMaterial({
  color: 0x60a5fa, transparent: true, opacity: 0.32, roughness: 0.08, side: THREE.DoubleSide
});
const carpetMat = mat(0x334155, 0.85);

// ========== LIGHTS ==========
scene.add(new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 1.6));
const mainLight = new THREE.DirectionalLight(0xffffff, 2.4);
mainLight.position.set(12, 25, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(2048, 2048);
mainLight.shadow.camera.near = 1;
mainLight.shadow.camera.far = 60;
mainLight.shadow.camera.left = -30;
mainLight.shadow.camera.right = 30;
mainLight.shadow.camera.top = 30;
mainLight.shadow.camera.bottom = -30;
scene.add(mainLight);

function addPoint(c, x, y, z, i = 22) {
  const l = new THREE.PointLight(c, i, 16);
  l.position.set(x, y, z);
  scene.add(l);
}
addPoint(0x3b82f6, -8, 5.5, -6, 28);
addPoint(0x8b5cf6, 8, 5.5, 4, 24);
addPoint(0x10b981, 0, 5, 10, 18);
addPoint(0xf59e0b, -10, 4.5, 8, 16);

// ========== HELPER ==========
function box(w, h, d, material, x, y, z, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

// ========== FLOOR + OUTER WALLS ==========
box(36, 0.4, 28, floorMat, 0, -0.2, 0);
box(36, 7, 0.35, wallMat, 0, 3.5, -14);   // back
box(0.35, 7, 28, wallMat, -18, 3.5, 0);    // left
box(0.35, 7, 28, wallMat, 18, 3.5, 0);     // right
box(36, 7, 0.35, wallMat, 0, 3.5, 14);     // front (partial)

// LED accent
box(34, 0.04, 0.08, blueMat, 0, 0.02, -13.7);
box(0.08, 0.04, 26, purpleMat, -17.7, 0.02, 0);

// Windows + city
for (let i = 0; i < 6; i++) {
  const x = -13.5 + i * 5.4;
  box(4.6, 4.2, 0.08, glassMat, x, 3.5, -13.85);
  box(0.12, 4.3, 0.12, blueMat, x - 2.35, 3.5, -13.8);
}
box(32, 0.12, 0.12, blueMat, 0, 5.7, -13.8);

// City skyline
const city = new THREE.Group();
for (let i = 0; i < 20; i++) {
  const h = 5 + Math.random() * 12;
  const b = new THREE.Mesh(new THREE.BoxGeometry(1.5 + Math.random(), h, 1.1), mat(0x1e3a5f, 0.55, 0.25));
  b.position.set(-24 + i * 2.5, h / 2 - 0.6, -17);
  city.add(b);
}
scene.add(city);

// ========== INTERNAL WALLS (MULTI ROOM) ==========
// Open office | Meeting room separator
box(0.25, 4.5, 12, wallMat, -6, 2.25, -2);
// Kitchen / Break room wall
box(12, 4.5, 0.25, wallMat, -12, 2.25, 5);
// Manager office
box(0.25, 4.5, 8, wallMat, 8, 2.25, 6);
// Glass partitions
function glassWall(w, h, x, z, rot = 0) {
  const p = box(w, h, 0.06, partitionMat, x, h / 2 + 0.1, z);
  p.rotation.y = rot;
  return p;
}
glassWall(10, 1.9, -1, -6.5);
glassWall(10, 1.9, 5, -6.5);
glassWall(8, 1.9, -1, -1.5);
glassWall(8, 1.9, 5, -1.5);
glassWall(0.06, 1.9, -6, -4, Math.PI / 2);
glassWall(0.06, 1.9, 0, -4, Math.PI / 2);
glassWall(0.06, 1.9, 6, -4, Math.PI / 2);

// Carpet zones
box(14, 0.05, 10, carpetMat, 1, 0.01, -3.5);
box(8, 0.05, 7, carpetMat, -12, 0.01, 9);

// ========== DESKS ==========
function createDesk(x, z, color = 0x4a3728) {
  const g = new THREE.Group();
  const top = mat(color, 0.35);
  box(2.5, 0.12, 1.3, top, 0, 1.15, 0, g);
  [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]].forEach(([dx, dz]) => {
    box(0.1, 1.15, 0.1, darkMat, dx, 0.57, dz, g);
  });
  // dual monitor
  box(1.05, 0.68, 0.07, blackMat, -0.35, 1.68, -0.38, g);
  box(0.95, 0.58, 0.02, blueMat, -0.35, 1.69, -0.33, g);
  box(1.05, 0.68, 0.07, blackMat, 0.45, 1.68, -0.38, g);
  box(0.95, 0.58, 0.02, greenMat, 0.45, 1.69, -0.33, g);
  box(0.12, 0.35, 0.12, darkMat, 0.05, 1.28, -0.38, g);
  // keyboard + mouse
  box(0.75, 0.03, 0.24, blackMat, 0, 1.22, 0.32, g);
  box(0.12, 0.03, 0.18, blackMat, 0.55, 1.22, 0.25, g);
  g.position.set(x, 0, z);
  scene.add(g);
  return g;
}

// Open office desks (3 rows)
[-10, -5.5, -1].forEach(x => createDesk(x, -8.5, 0x4a3728));
[-10, -5.5, -1].forEach(x => createDesk(x, -4.5, 0x3d4f66));
[-10, -5.5, -1].forEach(x => createDesk(x, -0.5, 0x3d4f66));

// Side desks
createDesk(4, -8.5, 0x3d4f66);
createDesk(9, -8.5, 0x3d4f66);
createDesk(4, -4.5, 0x3d4f66);
createDesk(9, -4.5, 0x3d4f66);

// ========== CHAIRS ==========
function createChair(x, z, rot = 0) {
  const g = new THREE.Group();
  box(0.72, 0.12, 0.68, blackMat, 0, 0.72, 0, g);
  box(0.72, 0.78, 0.12, darkMat, 0, 1.15, 0.3, g);
  box(0.12, 0.55, 0.12, blackMat, 0, 0.35, 0, g);
  g.position.set(x, 0, z);
  g.rotation.y = rot;
  scene.add(g);
  return g;
}
[-10, -5.5, -1, 4, 9].forEach(x => {
  createChair(x, -7.2);
  createChair(x, -3.2);
  createChair(x, 0.8);
});

// ========== MEETING ROOM ==========
const meet = new THREE.Group();
box(5.2, 0.14, 2.4, whiteMat, 0, 1.15, 0, meet);
[[-2.1, -0.9], [2.1, -0.9], [-2.1, 0.9], [2.1, 0.9]].forEach(([x, z]) => {
  box(0.12, 1.15, 0.12, darkMat, x, 0.57, z, meet);
});
// big screen
box(3.2, 1.6, 0.08, blackMat, 0, 2.5, -1.4, meet);
box(3.0, 1.4, 0.03, purpleMat, 0, 2.5, -1.35, meet);
meet.position.set(12, 0, -6);
scene.add(meet);

// meeting chairs
[[10, -7.2], [14, -7.2], [10, -4.8], [14, -4.8], [12, -8.5]].forEach(([x, z]) => createChair(x, z));

// ========== RECEPTION ==========
box(4.2, 1.05, 1.3, whiteMat, -13, 0.55, 10);
box(4.2, 0.06, 1.35, blueMat, -13, 1.1, 10);
box(2.8, 0.6, 0.08, blackMat, -13, 1.95, 10.7);
// logo light
const logo = box(1.8, 0.08, 0.08, blueMat, -13, 2.5, 10.7);

// ========== KITCHEN / BREAK ==========
box(3.5, 0.9, 1.8, whiteMat, -13, 0.5, 7);
box(3.5, 0.08, 1.85, mat(0xcbd5e1), -13, 0.95, 7);
// coffee machine
box(0.55, 0.7, 0.45, blackMat, -14.2, 1.35, 7.3);
box(0.4, 0.25, 0.35, mat(0x1e293b), -14.2, 1.75, 7.3);
// fridge
box(1.1, 1.9, 0.9, whiteMat, -11.5, 0.95, 7.6);
// sofa
box(2.8, 0.45, 1.1, mat(0x334155), -10, 0.35, 11.5);
box(2.8, 0.7, 0.25, mat(0x1e293b), -10, 0.85, 12);

// ========== MANAGER OFFICE ==========
box(3.8, 0.14, 1.8, woodMat, 12.5, 1.15, 8.5);
[[-1.5, -0.7], [1.5, -0.7], [-1.5, 0.7], [1.5, 0.7]].forEach(([x, z]) => {
  box(0.12, 1.15, 0.12, darkMat, x, 0.57, z, scene);
});
// manager chair
createChair(12.5, 9.8, Math.PI);
// bookshelf
box(0.9, 2.2, 0.4, woodMat, 15.5, 1.2, 10);
for (let i = 0; i < 4; i++) {
  box(0.8, 0.08, 0.35, mat(0x64748b), 15.5, 0.5 + i * 0.5, 10);
}

// ========== PLANTS ==========
function plant(x, z, scale = 1) {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * scale, 0.22 * scale, 0.5 * scale, 12), mat(0x334155));
  pot.position.y = 0.25 * scale;
  g.add(pot);
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.16 * scale, 1.1 * scale, 7), mat(0x15803d));
    const a = i * Math.PI / 3;
    leaf.position.set(Math.cos(a) * 0.18 * scale, 0.95 * scale, Math.sin(a) * 0.18 * scale);
    leaf.rotation.z = Math.cos(a) * 0.3;
    g.add(leaf);
  }
  g.position.set(x, 0, z);
  scene.add(g);
}
plant(-16, -11);
plant(16, -11);
plant(-16, 12);
plant(16, 12);
plant(0, -12);
plant(-8, 12);
plant(6, 12);

// ========== 3 NAMED CHARACTERS ==========
const characters = [];

function createCharacter(name, x, z, bodyColor, hairColor) {
  const g = new THREE.Group();
  // body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.32, 0.9, 12), mat(bodyColor));
  body.position.y = 0.8;
  g.add(body);
  // head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), mat(0xe8b98a));
  head.position.y = 1.42;
  g.add(head);
  // hair
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(hairColor));
  hair.position.y = 1.5;
  g.add(hair);
  // simple arms
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 8), mat(bodyColor));
  armL.position.set(-0.32, 0.9, 0);
  armL.rotation.z = 0.3;
  g.add(armL);
  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.55, 8), mat(bodyColor));
  armR.position.set(0.32, 0.9, 0);
  armR.rotation.z = -0.3;
  g.add(armR);

  g.position.set(x, 0, z);
  scene.add(g);

  const char = {
    name,
    group: g,
    state: "idle",          // idle | working | chatting | reading | walking
    task: null,
    target: null,
    offset: Math.random() * 10,
    home: { x, z },
    timer: 0,
    talkPartner: null
  };
  characters.push(char);
  return char;
}

// 3 karakter bernama
const rina = createCharacter("Rina", -10, -7.0, 0x3b82f6, 0x1e1b4b);   // biru
const budi = createCharacter("Budi", -5.5, -3.0, 0x8b5cf6, 0x0f172a);   // ungu
const sari = createCharacter("Sari", -1, 0.5, 0x10b981, 0x451a03);     // hijau

// ========== BEHAVIOR SYSTEM ==========
const idleActions = ["chatting", "reading", "walking", "stretching"];
const talkPoints = [
  { x: -12, z: 9 },   // kitchen
  { x: 0, z: 8 },     // middle open
  { x: 12, z: -5 },   // near meeting
  { x: -8, z: -10 }   // back
];
const readPoints = [
  { x: -10, z: 11.5 }, // sofa
  { x: 15, z: 9.5 },   // manager shelf
  { x: 0, z: -11 }
];

function setState(char, newState) {
  char.state = newState;
  char.timer = 3 + Math.random() * 6;
  char.talkPartner = null;
}

function findFreePartner(char) {
  return characters.find(c => c !== char && c.state === "idle" && !c.task);
}

function updateCharacter(char, dt, t) {
  char.timer -= dt;

  // Jika punya tugas → working
  if (char.task) {
    char.state = "working";
    // duduk di meja home
    char.group.position.x += (char.home.x - char.group.position.x) * 0.04;
    char.group.position.z += (char.home.z - char.group.position.z) * 0.04;
    char.group.rotation.y = Math.sin(t * 0.8 + char.offset) * 0.08;
    // typing motion
    char.group.children[3].rotation.x = Math.sin(t * 8 + char.offset) * 0.25;
    char.group.children[4].rotation.x = Math.sin(t * 8 + char.offset + 1) * 0.25;
    return;
  }

  // Tidak punya tugas → idle behaviors
  if (char.timer <= 0) {
    const action = idleActions[Math.floor(Math.random() * idleActions.length)];
    setState(char, action);

    if (action === "chatting") {
      const partner = findFreePartner(char);
      if (partner) {
        char.talkPartner = partner;
        partner.talkPartner = char;
        partner.state = "chatting";
        partner.timer = char.timer;
        // pilih titik ngobrol
        const p = talkPoints[Math.floor(Math.random() * talkPoints.length)];
        char.target = p;
        partner.target = { x: p.x + 0.9, z: p.z };
      } else {
        setState(char, "reading");
      }
    } else if (action === "reading") {
      char.target = readPoints[Math.floor(Math.random() * readPoints.length)];
    } else if (action === "walking") {
      char.target = {
        x: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 16
      };
    }
  }

  // Movement
  if (char.target) {
    const dx = char.target.x - char.group.position.x;
    const dz = char.target.z - char.group.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > 0.25) {
      char.group.position.x += dx * 0.025;
      char.group.position.z += dz * 0.025;
      char.group.rotation.y = Math.atan2(dx, dz);
      // walking bounce
      char.group.position.y = Math.abs(Math.sin(t * 6 + char.offset)) * 0.06;
    } else {
      char.target = null;
      char.group.position.y = 0;
    }
  } else {
    // idle breathe
    char.group.position.y = Math.sin(t * 1.3 + char.offset) * 0.025;
    if (char.state === "chatting" && char.talkPartner) {
      // face each other
      const other = char.talkPartner.group.position;
      char.group.rotation.y = Math.atan2(other.x - char.group.position.x, other.z - char.group.position.z);
      // gesture
      char.group.children[3].rotation.z = 0.4 + Math.sin(t * 3) * 0.2;
    }
    if (char.state === "reading") {
      char.group.rotation.y = Math.sin(t * 0.4) * 0.1;
    }
  }
}

// ========== TASK SYSTEM (linked to characters) ==========
let credits = 0, completed = 0;
const taskList = [
  "Menganalisis dokumen perusahaan",
  "Membuat laporan keuangan Q3",
  "Mengatur jadwal meeting klien",
  "Memeriksa data inventory",
  "Menyusun presentasi pitch",
  "Review proposal vendor",
  "Update database pelanggan",
  "Buat ringkasan email penting"
];

window.assignTask = function () {
  // cari karakter yang free
  const free = characters.filter(c => !c.task);
  if (free.length === 0) {
    // semua sibuk, tetap catat task
    const el = document.getElementById("tasks");
    if (el) {
      const p = document.createElement("p");
      p.textContent = "⏳ Semua AI sedang sibuk...";
      el.prepend(p);
    }
    return;
  }

  const char = free[Math.floor(Math.random() * free.length)];
  const task = taskList[Math.floor(Math.random() * taskList.length)];
  char.task = task;
  char.state = "working";
  char.timer = 12 + Math.random() * 10; // lama mengerjakan

  const el = document.getElementById("tasks");
  if (el) {
    const p = document.createElement("p");
    p.innerHTML = `✅ <b>${char.name}</b>: ${task}`;
    el.prepend(p);
  }

  // selesai otomatis setelah timer
  setTimeout(() => {
    if (char.task === task) {
      char.task = null;
      setState(char, "idle");
      completed++;
      credits += 15;
      const d = document.getElementById("done");
      const c = document.getElementById("credits");
      if (d) d.textContent = completed;
      if (c) c.textContent = credits;

      const el2 = document.getElementById("tasks");
      if (el2) {
        const p2 = document.createElement("p");
        p2.style.opacity = "0.7";
        p2.textContent = `🎉 ${char.name} selesai: ${task}`;
        el2.prepend(p2);
      }
    }
  }, char.timer * 1000);
};

window.sendMessage = function () {
  const input = document.getElementById("message");
  const chatlog = document.getElementById("chatlog");
  if (!input || !chatlog) return;
  const msg = input.value.trim();
  if (!msg) return;

  const u = document.createElement("p");
  u.textContent = "Kamu: " + msg;
  chatlog.appendChild(u);

  // simple response based on character status
  const busy = characters.filter(c => c.task).map(c => c.name);
  let reply = "Neura AI: Siap! Saya bantu atur pekerjaan kantor kamu.";
  if (busy.length > 0) {
    reply = `Neura AI: ${busy.join(", ")} sedang mengerjakan tugas. Yang lain free dan bisa dibantu.`;
  } else {
    reply = "Neura AI: Semua AI sedang free. Mereka lagi ngobrol / baca buku di kantor.";
  }

  const r = document.createElement("p");
  r.textContent = reply;
  chatlog.appendChild(r);
  input.value = "";
  chatlog.scrollTop = chatlog.scrollHeight;
};

// ========== RESIZE + ANIMATE ==========
function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener("resize", resize);
resize();

let lastTime = performance.now();
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  const t = now * 0.001;

  characters.forEach(c => updateCharacter(c, dt, t));

  // subtle logo pulse
  logo.material.emissiveIntensity = 1.2 + Math.sin(t * 2) * 0.4;

  controls.update();
  renderer.render(scene, camera);
}
animate();
