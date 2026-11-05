import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("office");
if (!canvas) throw new Error("Canvas #office tidak ditemukan");

// ==============================
// NEURA OFFICE 2.1 (quick ref layout)
// ==============================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101827);
scene.fog = new THREE.Fog(0x101827, 30, 70);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
camera.position.set(18, 22, 18); // lebih top-down mirip referensi

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);
controls.maxPolarAngle = Math.PI / 2.2;
controls.minDistance = 12;
controls.maxDistance = 40;

// Materials
const mat = (c, r = 0.5, m = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
const floorMat = mat(0x2a3548, 0.35, 0.2);
const wallMat = mat(0x1e2a3a, 0.7);
const darkMat = mat(0x0f1624, 0.3, 0.35);
const woodMat = mat(0x6b4f38, 0.4);
const whiteMat = mat(0xe8eef6, 0.3);
const blackMat = mat(0x0a0f18, 0.25, 0.25);
const blueMat = new THREE.MeshStandardMaterial({ color: 0x168cff, emissive: 0x0a6bff, emissiveIntensity: 1.8 });
const purpleMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x6d28d9, emissiveIntensity: 1.6 });
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x7ec8ff, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0.05, side: THREE.DoubleSide
});
const partitionMat = new THREE.MeshPhysicalMaterial({
  color: 0x3b82f6, transparent: true, opacity: 0.35, roughness: 0.1, side: THREE.DoubleSide
});

// Lights
scene.add(new THREE.HemisphereLight(0xc4e4ff, 0x1a2030, 1.8));
const mainLight = new THREE.DirectionalLight(0xffffff, 2.8);
mainLight.position.set(10, 20, 8);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(2048, 2048);
scene.add(mainLight);

function addPoint(c, x, y, z, i = 25) {
  const l = new THREE.PointLight(c, i, 14);
  l.position.set(x, y, z);
  scene.add(l);
}
addPoint(0x168cff, -6, 5, -4, 30);
addPoint(0x8b5cf6, 6, 5, 4, 25);

// Helper
function box(w, h, d, material, x, y, z, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

// ==============================
// FLOOR + WALLS
// ==============================
box(28, 0.35, 20, floorMat, 0, -0.18, 0);
box(28, 6, 0.3, wallMat, 0, 3, -10);          // back
box(0.3, 6, 20, wallMat, -14, 3, 0);           // left
box(0.3, 6, 20, wallMat, 14, 3, 0);            // right

// LED floor lines
box(26, 0.03, 0.07, blueMat, 0, 0.02, -9.5);
box(0.07, 0.03, 18, purpleMat, -13.5, 0.02, 0);

// Windows + city
for (let i = 0; i < 5; i++) {
  const x = -10 + i * 5;
  box(4.2, 3.8, 0.08, glassMat, x, 3, -9.85);
  box(0.1, 3.9, 0.1, blueMat, x - 2.15, 3, -9.8);
}
box(24, 0.1, 0.1, blueMat, 0, 5, -9.8);

// Simple city
const city = new THREE.Group();
for (let i = 0; i < 16; i++) {
  const h = 4 + Math.random() * 9;
  const b = new THREE.Mesh(new THREE.BoxGeometry(1.4 + Math.random(), h, 1), mat(0x1e2f45, 0.6, 0.2));
  b.position.set(-20 + i * 2.6, h / 2 - 0.5, -13);
  city.add(b);
}
scene.add(city);

// ==============================
// DESKS (cluster style seperti referensi)
// ==============================
function createDesk(x, z, color = 0x5c4030) {
  const g = new THREE.Group();
  const top = mat(color, 0.35);
  box(2.4, 0.12, 1.25, top, 0, 1.15, 0, g);
  // legs
  [[-1.05, -0.45], [1.05, -0.45], [-1.05, 0.45], [1.05, 0.45]].forEach(([dx, dz]) => {
    box(0.1, 1.15, 0.1, darkMat, dx, 0.57, dz, g);
  });
  // monitor
  box(1.0, 0.65, 0.08, blackMat, 0, 1.65, -0.35, g);
  box(0.9, 0.55, 0.02, blueMat, 0, 1.66, -0.3, g);
  box(0.1, 0.3, 0.1, darkMat, 0, 1.25, -0.35, g);
  // keyboard
  box(0.7, 0.03, 0.22, blackMat, 0, 1.22, 0.3, g);
  g.position.set(x, 0, z);
  scene.add(g);
  return g;
}

// Baris belakang (4 meja)
[-7.5, -2.5, 2.5, 7.5].forEach(x => createDesk(x, -5.5));
// Baris tengah
[-7.5, -2.5, 2.5, 7.5].forEach(x => createDesk(x, -1.5, 0x3d4f66));
// Baris depan
[-7.5, -2.5, 2.5, 7.5].forEach(x => createDesk(x, 2.5, 0x3d4f66));

// ==============================
// GLASS / BLUE PARTITIONS (mirip referensi)
// ==============================
function partition(w, h, x, z, rot = 0) {
  const p = box(w, h, 0.06, partitionMat, x, h / 2, z);
  p.rotation.y = rot;
  return p;
}

// Horizontal partitions
partition(9, 1.6, -5, -3.5);
partition(9, 1.6, 5, -3.5);
partition(9, 1.6, -5, 0.5);
partition(9, 1.6, 5, 0.5);

// Vertical small ones
partition(0.06, 1.6, -5, -5.5, Math.PI / 2);
partition(0.06, 1.6, 0, -5.5, Math.PI / 2);
partition(0.06, 1.6, 5, -5.5, Math.PI / 2);

// ==============================
// CHAIRS
// ==============================
function createChair(x, z) {
  const g = new THREE.Group();
  box(0.7, 0.12, 0.65, blackMat, 0, 0.75, 0, g);
  box(0.7, 0.75, 0.12, darkMat, 0, 1.15, 0.28, g);
  box(0.12, 0.6, 0.12, blackMat, 0, 0.35, 0, g);
  g.position.set(x, 0, z);
  scene.add(g);
}
[-7.5, -2.5, 2.5, 7.5].forEach(x => {
  createChair(x, -4.2);
  createChair(x, -0.2);
  createChair(x, 3.8);
});

// ==============================
// MEETING + RECEPTION
// ==============================
const meet = new THREE.Group();
box(4.5, 0.15, 2.0, whiteMat, 0, 1.2, 0, meet);
[[-1.8, -0.7], [1.8, -0.7], [-1.8, 0.7], [1.8, 0.7]].forEach(([x, z]) => {
  box(0.12, 1.2, 0.12, darkMat, x, 0.6, z, meet);
});
box(2.4, 1.3, 0.08, blackMat, 0, 2.3, -1.2, meet);
box(2.2, 1.1, 0.03, purpleMat, 0, 2.3, -1.15, meet);
meet.position.set(0, 0, 7);
scene.add(meet);

// Reception
box(3.2, 1.0, 1.1, whiteMat, -9, 0.55, 7.5);
box(3.2, 0.06, 1.15, blueMat, -9, 1.1, 7.5);
box(2.4, 0.55, 0.06, blackMat, -9, 1.9, 8.2);

// ==============================
// PLANTS
// ==============================
function plant(x, z) {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.22, 0.55, 12), mat(0x2a3548));
  pot.position.y = 0.28;
  g.add(pot);
  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.2, 7), mat(0x1f8a5a));
    const a = i * Math.PI / 2.5;
    leaf.position.set(Math.cos(a) * 0.2, 1.0, Math.sin(a) * 0.2);
    leaf.rotation.z = Math.cos(a) * 0.25;
    g.add(leaf);
  }
  g.position.set(x, 0, z);
  scene.add(g);
}
plant(-12, -7);
plant(12, -7);
plant(-12, 7);
plant(12, 7);
plant(0, -8.5);

// ==============================
// AI EMPLOYEES (lebih banyak)
// ==============================
const employees = [];
function createEmployee(x, z, color) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.95, 12), mat(color));
  body.position.y = 0.85;
  g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), mat(0xe8b98a));
  head.position.y = 1.5;
  g.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.27, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x1a1c24));
  hair.position.y = 1.58;
  g.add(hair);
  g.position.set(x, 0, z);
  scene.add(g);
  employees.push({ group: g, offset: Math.random() * 6 });
}

const colors = [0x168cff, 0x8b5cf6, 0x10b981, 0xf59e0b, 0xef4444, 0x06b6d4];
[-7.5, -2.5, 2.5, 7.5].forEach((x, i) => {
  createEmployee(x, -4.0, colors[i % 6]);
  createEmployee(x, 0.0, colors[(i + 2) % 6]);
  createEmployee(x, 4.0, colors[(i + 4) % 6]);
});

// ==============================
// TASK + CHAT (tetap sama)
// ==============================
let credits = 0, completed = 0;
window.assignTask = function () {
  const tasks = [
    "Menganalisis dokumen perusahaan",
    "Membuat laporan keuangan",
    "Mengatur jadwal meeting",
    "Memeriksa data perusahaan",
    "Menyelesaikan pekerjaan kantor",
    "Membuat presentasi proyek"
  ];
  const task = tasks[Math.floor(Math.random() * tasks.length)];
  const el = document.getElementById("tasks");
  if (el) {
    const p = document.createElement("p");
    p.textContent = "✅ " + task;
    el.prepend(p);
  }
  completed++;
  credits += 10;
  const d = document.getElementById("done");
  const c = document.getElementById("credits");
  if (d) d.textContent = completed;
  if (c) c.textContent = credits;
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
  const r = document.createElement("p");
  r.textContent = "Neura AI: Siap! Saya bantu atur pekerjaan kantor kamu.";
  chatlog.appendChild(r);
  input.value = "";
  chatlog.scrollTop = chatlog.scrollHeight;
};

// ==============================
// RESIZE + ANIMATE
// ==============================
function resize() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener("resize", resize);
resize();

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;
  employees.forEach((e, i) => {
    e.group.position.y = Math.sin(t * 1.4 + e.offset) * 0.03;
    e.group.rotation.y = Math.sin(t * 0.35 + i) * 0.06;
  });
  controls.update();
  renderer.render(scene, camera);
}
animate();
