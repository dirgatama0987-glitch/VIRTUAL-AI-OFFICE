
import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

// =====================================
// NEURA OFFICE - 3D ENVIRONMENT
// =====================================

const canvas = document.getElementById("office");

if (canvas) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#111d30");

  const camera = new THREE.PerspectiveCamera(
    55,
    1,
    0.1,
    100
  );

  camera.position.set(9, 8, 11);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Camera controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0.5, 0);
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minDistance = 5;
  controls.maxDistance = 20;

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 1.4));

  const sunlight = new THREE.DirectionalLight(0xffffff, 2);
  sunlight.position.set(5, 10, 5);
  sunlight.castShadow = true;
  scene.add(sunlight);

  // Materials
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: "#26364e",
    roughness: 0.8
  });

  const deskMaterial = new THREE.MeshStandardMaterial({
    color: "#9b7653"
  });

  // Floor
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.25, 12),
    floorMaterial
  );

  floor.position.y = -0.15;
  floor.receiveShadow = true;
  scene.add(floor);

  // Floor grid
  const grid = new THREE.GridHelper(
    14,
    14,
    "#55a7ff",
    "#43536b"
  );

  grid.position.y = 0;
  scene.add(grid);

  // Create desk
  function createDesk(x, z) {
    const group = new THREE.Group();

    const top = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.16, 1.1),
      deskMaterial
    );

    top.position.y = 1;
    top.castShadow = true;
    group.add(top);

    for (const dx of [-0.8, 0.8]) {
      for (const dz of [-0.4, 0.4]) {
        const leg = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 1, 0.12),
          new THREE.MeshStandardMaterial({
            color: "#26364e"
          })
        );

        leg.position.set(dx, 0.5, dz);
        group.add(leg);
      }
    }

    // Computer monitor
    const monitor = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.55, 0.07),
      new THREE.MeshStandardMaterial({
        color: "#17243a",
        emissive: "#123c68",
        emissiveIntensity: 0.5
      })
    );

    monitor.position.set(0, 1.45, -0.25);
    group.add(monitor);

    group.position.set(x, 0, z);
    scene.add(group);
  }

  // Office desks
  createDesk(-3, -2);
  createDesk(0, -2);
  createDesk(3, -2);
  createDesk(-3, 2);
  createDesk(3, 2);

  // Create AI employee
  const employees = [];

  function createEmployee(x, z, color) {
    const person = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.9, 0.4),
      new THREE.MeshStandardMaterial({
        color: color
      })
    );

    body.position.y = 0.85;
    body.castShadow = true;
    person.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 24, 24),
      new THREE.MeshStandardMaterial({
        color: "#ffca9c"
      })
    );

    head.position.y = 1.5;
    person.add(head);

    person.position.set(x, 0, z);
    scene.add(person);

    employees.push(person);
  }

  createEmployee(-3, -0.8, "#55a7ff");
  createEmployee(0, -0.8, "#43e0d0");
  createEmployee(3, -0.8, "#b58aff");
  createEmployee(-3, 3, "#ffb454");
  createEmployee(3, 3, "#ff6b91");

  // Office plants
  function createPlant(x, z) {
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.23, 0.5, 16),
      new THREE.MeshStandardMaterial({
        color: "#a66b42"
      })
    );

    pot.position.set(x, 0.25, z);
    scene.add(pot);

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 16, 16),
      new THREE.MeshStandardMaterial({
        color: "#35a76c"
      })
    );

    leaves.position.set(x, 0.9, z);
    scene.add(leaves);
  }

  createPlant(-5, -4);
  createPlant(5, -4);
  createPlant(-5, 4);
  createPlant(5, 4);

  // Resize renderer
  function resizeOffice() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (!width || !height) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
  }

  const resizeObserver = new ResizeObserver(resizeOffice);
  resizeObserver.observe(canvas);

  resizeOffice();

  // Animation
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    employees.forEach((person, index) => {
      person.position.y =
        Math.sin(time * 2 + index) * 0.035;
    });

    controls.update();
    renderer.render(scene, camera);
  }

  animate();

} else {
  console.error("Canvas #office tidak ditemukan di index.html");
}

// =====================================
// TASK MANAGER
// =====================================

let totalTasks = 0;

window.assignTask = function () {
  totalTasks++;

  const taskCount = document.getElementById("task-count");

  if (taskCount) {
    taskCount.textContent = totalTasks;
  }

  alert("AI Employee berhasil menerima tugas!");
};

// =====================================
// AI OFFICE ASSISTANT DEMO
// =====================================

window.sendMessage = function () {
  const input = document.getElementById("chat-input");
  const output = document.getElementById("chat-output");

  if (!input || !output) return;

  const message = input.value.trim();

  if (!message) return;

  const userMessage = document.createElement("p");
  userMessage.textContent = "You: " + message;

  output.appendChild(userMessage);

  const response = document.createElement("p");

  response.textContent =
    "Neura AI: Halo! Ada yang bisa saya bantu di kantor virtual hari ini?";

  output.appendChild(response);

  input.value = "";
  output.scrollTop = output.scrollHeight;
};

console.log("NeuraOffice berhasil dimuat!");
