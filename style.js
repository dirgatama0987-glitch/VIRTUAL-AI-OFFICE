
import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("office");

if (!canvas) {
  throw new Error("Canvas office tidak ditemukan!");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1422);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(12, 11, 15);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});

renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(0, 0.7, 0);

scene.add(new THREE.HemisphereLight(0xb8dcff, 0x182338, 2));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 12, 8);
light.castShadow = true;
scene.add(light);

function box(w, h, d, color, x, y, z) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color })
  );

  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

// Office floor
box(18, 0.3, 14, 0x1b2b40, 0, -0.15, 0);

const grid = new THREE.GridHelper(18, 36, 0x3976a8, 0x263b53);
grid.position.y = 0.01;
scene.add(grid);

// Office walls
box(18, 4, 0.3, 0x14243a, 0, 2, -7);
box(0.3, 4, 14, 0x14243a, -9, 2, 0);
box(0.3, 4, 14, 0x14243a, 9, 2, 0);

// Desks
function desk(x, z) {
  box(2.2, 0.15, 1.2, 0x344c68, x, 1, z);

  for (const dx of [-0.9, 0.9]) {
    for (const dz of [-0.45, 0.45]) {
      box(0.08, 1, 0.08, 0x172438, x + dx, 0.5, z + dz);
    }
  }

  box(0.95, 0.65, 0.1, 0x080f1b, x, 1.48, z - 0.25);
  box(0.83, 0.49, 0.02, 0x087ac0, x, 1.48, z - 0.18);
}

desk(-5, -3);
desk(0, -3);
desk(5, -3);
desk(-2, 2);
desk(3, 2);

// Plants
function plant(x, z) {
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.3, 0.5, 16),
    new THREE.MeshStandardMaterial({ color: 0x34445b })
  );

  pot.position.set(x, 0.25, z);
  scene.add(pot);

  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x269b75 })
    );

    leaf.position.set(
      x + Math.sin(i) * 0.2,
      0.7,
      z + Math.cos(i) * 0.2
    );

    leaf.scale.y = 2;
    scene.add(leaf);
  }
}

plant(-7, -5);
plant(7, -5);
plant(-7, 5);
plant(7, 5);

// AI Employees
const workers = [];
const colors = [0x428cff, 0xa47bff, 0x35b99d, 0xe18a69];

function createWorker(x, z, index) {
  const group = new THREE.Group();
  scene.add(group);
  group.position.set(x, 0, z);

  const shirt = new THREE.MeshStandardMaterial({ color: colors[index] });
  const skin = new THREE.MeshStandardMaterial({ color: 0xd8a27d });
  const dark = new THREE.MeshStandardMaterial({ color: 0x182438 });

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.27, 0.5, 4, 8),
    shirt
  );
  body.position.y = 1;
  group.add(body);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.23, 16, 12),
    skin
  );
  head.position.y = 1.52;
  group.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 12, 8),
    dark
  );
  hair.position.y = 1.67;
  group.add(hair);

  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.09, 0.35, 3, 6),
      dark
    );
    leg.position.set(side * 0.13, 0.38, 0);
    group.add(leg);

    const arm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.08, 0.35, 3, 6),
      shirt
    );
    arm.position.set(side * 0.34, 1, 0.05);
    arm.rotation.z = side * 0.35;
    group.add(arm);
  }

  workers.push({
    group,
    x,
    z,
    phase: index
  });
}

createWorker(-5, -1, 0);
createWorker(0, -1, 1);
createWorker(5, -1, 2);
createWorker(2, 3, 3);

// Resize
function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  if (!width || !height) return;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

new ResizeObserver(resize).observe(canvas);
resize();

// Animation
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  workers.forEach(worker => {
    worker.group.position.x =
      worker.x + Math.sin(time * 0.7 + worker.phase) * 0.12;

    worker.group.position.z =
      worker.z + Math.cos(time * 0.5 + worker.phase) * 0.12;
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Task Manager
let completed = 12;
let credits = 2450;

window.assignTask = function () {
  const names = ["Alex Morgan", "Mia Chen", "Ravi Patel", "Sofia Reyes"];

  const tasks = [
    "Prepare Project Roadmap",
    "Design New Interface",
    "Analyze Customer Data",
    "Improve Office Workflow"
  ];

  const name = names[Math.floor(Math.random() * names.length)];
  const task = tasks[Math.floor(Math.random() * tasks.length)];

  const element = document.createElement("div");
  element.className = "task";
  element.textContent = task + " — " + name;

  document.getElementById("tasks").prepend(element);

  let progress = 0;
  const bar = document.createElement("div");
  bar.className = "bar";

  const fill = document.createElement("div");
  fill.style.width = "0%";
  bar.appendChild(fill);
  element.appendChild(bar);

  const timer = setInterval(() => {
    progress += 20;
    fill.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(timer);
      completed++;
      credits += 30;

      document.getElementById("done").textContent = completed + " / 16";
      document.getElementById("credits").textContent =
        credits.toLocaleString("en-US");
    }
  }, 700);
};

// AI Assistant demo
window.sendMessage = function () {
  const input = document.getElementById("message");
  const log = document.getElementById("chatlog");

  const message = input.value.trim();
  if (!message) return;

  const user = document.createElement("p");
  user.textContent = "You: " + message;
  log.appendChild(user);

  const response = document.createElement("p");
  response.textContent =
    "Neura AI: Saya siap membantu aktivitas kantor virtual kamu.";
  log.appendChild(response);

  input.value = "";
  log.scrollTop = log.scrollHeight;
};

console.log("NeuraOffice 3D berhasil dimuat!");
