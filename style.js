
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ===============================
// VIRTUAL AI OFFICE SIMULATOR
// ===============================

const canvas = document.getElementById('office');

if (canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111d30);

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
  );

  camera.position.set(8, 7, 10);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });

  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));

  const light = new THREE.DirectionalLight(0xffffff, 2);
  light.position.set(5, 10, 5);
  scene.add(light);

  // Floor
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(12, 0.2, 10),
    new THREE.MeshStandardMaterial({ color: 0x26364e })
  );

  floor.position.y = -0.1;
  scene.add(floor);

  // Grid
  const grid = new THREE.GridHelper(12, 12, 0x55a7ff, 0x35445a);
  grid.position.y = 0.02;
  scene.add(grid);

  // Office desks
  function createDesk(x, z) {
    const desk = new THREE.Group();

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.15, 1),
      new THREE.MeshStandardMaterial({ color: 0x8b6548 })
    );

    top.position.y = 1;
    desk.add(top);

    const legMaterial = new THREE.MeshStandardMaterial({
      color: 0x26364e
    });

    for (const dx of [-0.85, 0.85]) {
      for (const dz of [-0.35, 0.35]) {
        const leg = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 1, 0.12),
          legMaterial
        );

        leg.position.set(dx, 0.5, dz);
        desk.add(leg);
      }
    }

    desk.position.set(x, 0, z);
    scene.add(desk);
  }

  createDesk(-3, -2);
  createDesk(0, -2);
  createDesk(3, -2);
  createDesk(-3, 2);
  createDesk(3, 2);

  // AI Employees
  const employees = [];

  function createEmployee(x, z, color) {
    const employee = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.9, 0.4),
      new THREE.MeshStandardMaterial({ color })
    );

    body.position.y = 0.85;
    employee.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xffc99c })
    );

    head.position.y = 1.55;
    employee.add(head);

    employee.position.set(x, 0, z);
    scene.add(employee);

    employees.push(employee);
  }

  createEmployee(-3, -1, 0x55a7ff);
  createEmployee(0, -1, 0x43e0d0);
  createEmployee(3, -1, 0xb58aff);
  createEmployee(-3, 3, 0xffb454);
  createEmployee(3, 3, 0xff6b91);

  // Animation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    employees.forEach((employee, index) => {
      employee.position.y =
        Math.sin(time * 2 + index) * 0.04;
    });

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  // Responsive canvas
  window.addEventListener('resize', () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  });
}

// ===============================
// TASK MANAGEMENT
// ===============================

let totalTasks = 0;
let completedTasks = 0;

window.assignTask = function () {
  totalTasks++;

  const task = document.getElementById('task-count');

  if (task) {
    task.textContent = totalTasks;
  }

  alert('Tugas berhasil diberikan kepada AI Employee!');
};

// ===============================
// AI OFFICE CHAT DEMO
// ===============================

window.sendMessage = function () {
  const input = document.getElementById('chat-input');
  const output = document.getElementById('chat-output');

  if (!input || !output) return;

  const message = input.value.trim();

  if (!message) return;

  const userMessage = document.createElement('p');
  userMessage.textContent = 'You: ' + message;

  output.appendChild(userMessage);

  const reply = document.createElement('p');

  reply.textContent =
    'AI Assistant: Halo! Saya siap membantu aktivitas kantor virtual kamu.';

  output.appendChild(reply);

  input.value = '';
  output.scrollTop = output.scrollHeight;
};
