
import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("office");

if (!canvas) {
  throw new Error("Canvas #office tidak ditemukan di index.html");
}

// ==============================
// NEURA OFFICE 2.0
// ==============================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101827);
scene.fog = new THREE.Fog(0x101827, 25, 65);

const camera = new THREE.PerspectiveCamera(
  50, 1, 0.1, 200
);
camera.position.set(15, 13, 19);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);
controls.maxPolarAngle = Math.PI / 2.05;
controls.minDistance = 8;
controls.maxDistance = 35;

// ==============================
// MATERIALS
// ==============================

const mat = (color, roughness = 0.5, metalness = 0) =>
  new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness
  });

const floorMat = mat(0x202b3b, 0.3, 0.35);
const wallMat = mat(0x26364b, 0.65);
const darkMat = mat(0x111a29, 0.35, 0.4);
const woodMat = mat(0x795b43, 0.4);
const whiteMat = mat(0xe3eaf2, 0.35);
const blackMat = mat(0x080d16, 0.25, 0.3);

const blueMat = new THREE.MeshStandardMaterial({
  color: 0x168cff,
  emissive: 0x087bff,
  emissiveIntensity: 2
});

const purpleMat = new THREE.MeshStandardMaterial({
  color: 0x8c55ff,
  emissive: 0x703cff,
  emissiveIntensity: 2
});

const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0x75caff,
  transparent: true,
  opacity: 0.18,
  roughness: 0.08,
  metalness: 0.1,
  side: THREE.DoubleSide
});

// ==============================
// LIGHTING
// ==============================

scene.add(new THREE.HemisphereLight(0xc4e4ff, 0x20243c, 2));

const mainLight = new THREE.DirectionalLight(0xffffff, 3);
mainLight.position.set(8, 15, 8);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(2048, 2048);
scene.add(mainLight);

function addPointLight(color, x, y, z, intensity = 30) {
  const light = new THREE.PointLight(color, intensity, 12);
  light.position.set(x, y, z);
  scene.add(light);
}

addPointLight(0x168cff, -5, 4, -3, 35);
addPointLight(0x874cff, 5, 4, 3, 30);

// ==============================
// OBJECT HELPER
// ==============================

function box(w, h, d, material, x, y, z, parent = scene) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    material
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

// ==============================
// FLOOR AND ROOM
// ==============================

box(20, 0.4, 16, floorMat, 0, -0.2, 0);

// Floor LED strips
box(19, 0.035, 0.08, blueMat, 0, 0.03, -7.5);
box(0.08, 0.035, 14, purpleMat, -9.5, 0.03, 0);

// Back wall
box(20, 7, 0.3, wallMat, 0, 3.5, -8);

// Side walls
box(0.3, 7, 16, wallMat, -10, 3.5, 0);
box(0.3, 7, 16, wallMat, 10, 3.5, 0);

// Ceiling beams
box(20, 0.2, 0.3, darkMat, 0, 6.8, -7.5);
box(0.2, 0.2, 16, darkMat, -9.5, 6.8, 0);

// Glass windows
for (let i = 0; i < 4; i++) {
  const x = -6 + i * 4;

  box(0.08, 4.3, 0.12, blueMat, x - 1.8, 3.2, -7.7);
  box(3.5, 4.2, 0.08, glassMat, x, 3.2, -7.8);
}

box(16, 0.12, 0.12, blueMat, 0, 5.4, -7.7);

// ==============================
// CITY VIEW
// ==============================

const city = new THREE.Group();

for (let i = 0; i < 18; i++) {
  const height = 3 + Math.random() * 10;
  const width = 1 + Math.random() * 2;

  const building = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 1),
    mat(0x253b5c, 0.6, 0.3)
  );

  building.position.set(
    -18 + i * 2.1,
    height / 2 - 1,
    -13
  );

  city.add(building);

  for (let j = 0; j < 4; j++) {
    const windowLight = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.18, 0.03),
      new THREE.MeshBasicMaterial({
        color: j % 2 ? 0x168cff : 0xffd58a
      })
    );

    windowLight.position.set(
      building.position.x,
      0.5 + j * 1.1,
      -12.45
    );

    city.add(windowLight);
  }
}

scene.add(city);

// ==============================
// OFFICE DESKS
// ==============================

function createDesk(x, z, color = 0x795b43) {
  const group = new THREE.Group();

  const topMat = mat(color, 0.35);

  box(2.7, 0.15, 1.4, topMat, 0, 1.2, 0, group);

  for (const dx of [-1.15, 1.15]) {
    for (const dz of [-0.5, 0.5]) {
      box(0.12, 1.2, 0.12, darkMat, dx, 0.6, dz, group);
    }
  }

  // Monitor
  box(1.15, 0.75, 0.1, blackMat, 0, 1.72, -0.28, group);
  box(1.03, 0.62, 0.025, blueMat, 0, 1.73, -0.22, group);
  box(0.12, 0.35, 0.12, darkMat, 0, 1.25, -0.28, group);
  box(0.6, 0.07, 0.4, darkMat, 0, 1.12, -0.28, group);

  // Keyboard
  box(0.8, 0.035, 0.25, blackMat, 0, 1.3, 0.38, group);

  group.position.set(x, 0, z);
  scene.add(group);

  return group;
}

createDesk(-6, -3);
createDesk(-2.5, -3);
createDesk(1.5, -3);
createDesk(5, -3);

createDesk(-6, 1.5, 0x344c69);
createDesk(-2.5, 1.5, 0x344c69);
createDesk(1.5, 1.5, 0x344c69);
createDesk(5, 1.5, 0x344c69);

// ==============================
// OFFICE CHAIRS
// ==============================

function createChair(x, z) {
  const group = new THREE.Group();

  box(0.85, 0.15, 0.8, blackMat, 0, 0.8, 0, group);
  box(0.85, 0.9, 0.15, darkMat, 0, 1.3, 0.35, group);
  box(0.15, 0.65, 0.15, blackMat, 0, 0.4, 0, group);

  for (let i = 0; i < 4; i++) {
    const angle = i * Math.PI / 2;

    box(
      0.12, 0.1, 0.5,
      blackMat,
      Math.cos(angle) * 0.25,
      0.08,
      Math.sin(angle) * 0.25,
      group
    );
  }

  group.position.set(x, 0, z);
  scene.add(group);
}

for (const x of [-6, -2.5, 1.5, 5]) {
  createChair(x, -1.5);
  createChair(x, 3);
}

// ==============================
// MEETING ROOM
// ==============================

const meeting = new THREE.Group();

box(5, 0.2, 2.2, whiteMat, 0, 1.3, 0, meeting);

for (const x of [-2, 2]) {
  for (const z of [-0.8, 0.8]) {
    box(0.15, 1.3, 0.15, darkMat, x, 0.65, z, meeting);
  }
}

box(2.6, 1.4, 0.12, blackMat, 0, 2.5, -1.4, meeting);
box(2.4, 1.2, 0.04, purpleMat, 0, 2.5, -1.32, meeting);

meeting.position.set(0, 0, 5);
scene.add(meeting);

// ==============================
// RECEPTION
// ==============================

box(3.5, 1.1, 1.2, whiteMat, -7, 0.6, 6);
box(3.5, 0.08, 1.3, blueMat, -7, 1.2, 6);

box(2.8, 0.7, 0.08, blackMat, -7, 2.1, 7);
box(2.5, 0.45, 0.04, blueMat, -7, 2.1, 7.06);

// Logo text board
box(4, 0.8, 0.15, darkMat, 0, 5.5, -7.65);
box(2.5, 0.06, 0.04, blueMat, 0, 5.1, -7.5);

// ==============================
// PLANTS
// ==============================

function createPlant(x, z) {
  const group = new THREE.Group();

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.25, 0.65, 20),
    mat(0x303b4d)
  );
  pot.position.y = 0.35;
  group.add(pot);

  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 1.5, 8),
      mat(0x26996c)
    );

    const angle = i * Math.PI / 3;
    leaf.position.set(
      Math.cos(angle) * 0.25,
      1.2,
      Math.sin(angle) * 0.25
    );
    leaf.rotation.z = Math.cos(angle) * 0.3;
    leaf.rotation.x = Math.sin(angle) * 0.3;
    group.add(leaf);
  }

  group.position.set(x, 0, z);
  scene.add(group);
}

createPlant(-8, -5);
createPlant(8, -5);
createPlant(-8, 5);
createPlant(8, 5);

// ==============================
// AI EMPLOYEES
// ==============================

const employees = [];

function createEmployee(x, z, color) {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.42, 1.1, 16),
    mat(color)
  );
  body.position.y = 0.9;
  group.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 24, 24),
    mat(0xe6b995)
  );
  head.position.y = 1.65;
  group.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.33, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    mat(0x20212a)
  );
  hair.position.y = 1.75;
  group.add(hair);

  const badge = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.12, 0.04),
    blueMat
  );
  badge.position.set(0, 1.05, 0.38);
  group.add(badge);

  group.position.set(x, 0, z);
  scene.add(group);

  employees.push({
    group,
    baseY: 0,
    offset: Math.random() * 5
  });
}

createEmployee(-6, -0.5, 0x168cff);
createEmployee(-2.5, -0.5, 0x8b5cf6);
createEmployee(1.5, -0.5, 0x20b98a);
createEmployee(5, -0.5, 0xf2a23a);

// ==============================
// TASK SYSTEM
// ==============================

let credits = 0;
let completed = 0;

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

  const taskElement = document.getElementById("tasks");

  if (taskElement) {
    const item = document.createElement("p");
    item.textContent = "✅ " + task;
    taskElement.prepend(item);
  }

  completed++;
  credits += 10;

  const doneElement = document.getElementById("done");
  const creditsElement = document.getElementById("credits");

  if (doneElement) doneElement.textContent = completed;
  if (creditsElement) creditsElement.textContent = credits;
};

// ==============================
// AI CHAT DEMO
// ==============================

window.sendMessage = function () {
  const input = document.getElementById("message");
  const chatlog = document.getElementById("chatlog");

  if (!input || !chatlog) return;

  const message = input.value.trim();
  if (!message) return;

  const user = document.createElement("p");
  user.textContent = "Kamu: " + message;
  chatlog.appendChild(user);

  const reply = document.createElement("p");
  reply.textContent =
    "Neura AI: Siap! Saya akan membantu mengatur pekerjaan kantor kamu.";

  chatlog.appendChild(reply);

  input.value = "";
  chatlog.scrollTop = chatlog.scrollHeight;
};

// ==============================
// RESPONSIVE
// ==============================

function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("resize", resize);
resize();

// ==============================
// ANIMATION
// ==============================

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now() * 0.001;

  employees.forEach((employee, index) => {
    employee.group.position.y =
      Math.sin(time * 1.5 + employee.offset) * 0.035;

    employee.group.rotation.y =
      Math.sin(time * 0.4 + index) * 0.08;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();
