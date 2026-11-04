
import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

// SCENE
const canvas = document.getElementById("office");

if (!canvas) {
  throw new Error("Canvas dengan id office tidak ditemukan. Periksa index.html.");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101827);

const camera = new THREE.PerspectiveCamera(
  65,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.set(9, 8, 12);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// CAMERA CONTROL
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// LIGHTING
scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 5);
scene.add(light);

// MATERIALS
const floorMaterial = new THREE.MeshStandardMaterial({
  color: 0x263449
});

const wallMaterial = new THREE.MeshStandardMaterial({
  color: 0x34445d
});

const deskMaterial = new THREE.MeshStandardMaterial({
  color: 0x9b7653
});

const screenMaterial = new THREE.MeshStandardMaterial({
  color: 0x142b40,
  emissive: 0x0878a8,
  emissiveIntensity: 0.5
});

// FLOOR
const floor = new THREE.Mesh(
  new THREE.BoxGeometry(14, 0.3, 12),
  floorMaterial
);
floor.position.y = -0.2;
scene.add(floor);

// WALLS
function createWall(width, height, depth, x, y, z) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    wallMaterial
  );

  wall.position.set(x, y, z);
  scene.add(wall);
}

createWall(14, 5, 0.2, 0, 2.3, -6);
createWall(0.2, 5, 12, -7, 2.3, 0);

// DESKS
function createDesk(x, z) {
  const desk = new THREE.Group();

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.18, 1.2),
    deskMaterial
  );
  top.position.y = 1.2;
  desk.add(top);

  for (const dx of [-0.9, 0.9]) {
    for (const dz of [-0.45, 0.45]) {
      const leg = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 1.2, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x222b38 })
      );
      leg.position.set(dx, 0.6, dz);
      desk.add(leg);
    }
  }

  const monitor = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.65, 0.08),
    screenMaterial
  );
  monitor.position.set(0, 1.7, -0.25);
  desk.add(monitor);

  desk.position.set(x, 0, z);
  scene.add(desk);
}

createDesk(-3, -2);
createDesk(1, -2);
createDesk(-3, 2);
createDesk(1, 2);

// AI EMPLOYEES
const employees = [];

function createEmployee(x, z, color) {
  const employee = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.4, 1, 16),
    new THREE.MeshStandardMaterial({ color })
  );
  body.position.y = 0.8;
  employee.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0xf0c7a4 })
  );
  head.position.y = 1.5;
  employee.add(head);

  employee.position.set(x, 0, z);
  scene.add(employee);

  employees.push(employee);
}

createEmployee(-4, -0.5, 0x36a2eb);
createEmployee(0, -0.5, 0x8b5cf6);
createEmployee(-4, 3.5, 0x22c55e);
createEmployee(0, 3.5, 0xf59e0b);

// PLANTS
function createPlant(x, z) {
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.3, 0.5, 16),
    new THREE.MeshStandardMaterial({ color: 0xb46b42 })
  );
  pot.position.set(x, 0.2, z);
  scene.add(pot);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x22a06b })
  );
  leaves.position.set(x, 0.9, z);
  scene.add(leaves);
}

createPlant(5, -4);
createPlant(5, 4);

// TASK SYSTEM
let credits = 0;
let completed = 0;

window.assignTask = function () {
  const tasks = [
    "Menganalisis dokumen",
    "Membuat laporan",
    "Mengatur jadwal meeting",
    "Memeriksa data perusahaan",
    "Menyelesaikan pekerjaan kantor"
  ];

  const task = tasks[Math.floor(Math.random() * tasks.length)];

  const taskElement = document.getElementById("tasks");

  if (taskElement) {
    const item = document.createElement("p");
    item.textContent = "⏳ " + task + " - Selesai";
    taskElement.prepend(item);
  }

  completed++;
  credits += 10;

  const doneElement = document.getElementById("done");
  const creditsElement = document.getElementById("credits");

  if (doneElement) doneElement.textContent = completed;
  if (creditsElement) creditsElement.textContent = credits;

  // Animasi karyawan
  employees.forEach((employee) => {
    employee.rotation.y += 0.5;
  });
};

// AI CHAT DEMO
window.sendMessage = function () {
  const input = document.getElementById("message");
  const chatlog = document.getElementById("chatlog");

  if (!input || !chatlog) return;

  const message = input.value.trim();
  if (!message) return;

  const userMessage = document.createElement("p");
  userMessage.textContent = "Kamu: " + message;
  chatlog.appendChild(userMessage);

  const answer = document.createElement("p");
  answer.textContent =
    "Neura AI: Baik! Saya akan membantu mengerjakan tugas kantor tersebut.";

  chatlog.appendChild(answer);

  input.value = "";
  chatlog.scrollTop = chatlog.scrollHeight;
};

// ANIMATION
function animate() {
  requestAnimationFrame(animate);

  employees.forEach((employee, index) => {
    employee.position.y =
      Math.sin(Date.now() * 0.001 + index) * 0.04;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

// RESPONSIVE
window.addEventListener("resize", () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
});
