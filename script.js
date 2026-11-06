import * as THREE from "https://esm.sh/three@0.160.0";
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js";

// ======================
// DATA
// ======================
const agents = [
  { id: 1, name: "Chronos", role: "CEO Assistant", dept: "CEO Office", status: "working", color: "#3b82f6", avatar: "ク" },
  { id: 2, name: "Kai", role: "Content Creator", dept: "Content Creation", status: "posting", color: "#8b5cf6", avatar: "カ" },
  { id: 3, name: "Ross", role: "Marketing Lead", dept: "Marketing", status: "break", color: "#f59e0b", avatar: "ロ" },
  { id: 4, name: "Nova", role: "Developer", dept: "Development", status: "working", color: "#10b981", avatar: "ノ" },
  { id: 5, name: "Luna", role: "Finance Analyst", dept: "Finance", status: "standby", color: "#ef4444", avatar: "ル" },
  { id: 6, name: "C.C", role: "Customer Support", dept: "Customer Service", status: "standby", color: "#6366f1", avatar: "C" },
];

let tasks = [
  { id: 1, title: "Analisis data penjualan Q3", assignee: "Luna", priority: "high", status: "in-progress", progress: 65 },
  { id: 2, title: "Buat konten Instagram minggu ini", assignee: "Kai", priority: "medium", status: "in-progress", progress: 40 },
  { id: 3, title: "Review proposal vendor baru", assignee: "Chronos", priority: "high", status: "todo", progress: 0 },
  { id: 4, title: "Optimasi landing page", assignee: "Nova", priority: "medium", status: "in-progress", progress: 80 },
];

let currentView = "dashboard";
let selectedAgent = null;
let officeScene = null;

// ======================
// CLOCK
// ======================
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("en-GB");
}
setInterval(updateClock, 1000);
updateClock();

// ======================
// RENDER AGENTS SIDEBAR
// ======================
function renderAgentList() {
  const el = document.getElementById("agentList");
  el.innerHTML = agents.map(a => `
    <div class="agent-item ${selectedAgent === a.id ? 'active' : ''}" data-id="${a.id}">
      <div class="agent-avatar" style="background:${a.color}">${a.avatar}</div>
      <div class="agent-info">
        <div class="agent-name">${a.name}</div>
        <div class="agent-status status-${a.status}">${a.status.replace("-", " ")}</div>
      </div>
    </div>
  `).join("");

  el.querySelectorAll(".agent-item").forEach(item => {
    item.addEventListener("click", () => {
      selectedAgent = Number(item.dataset.id);
      renderAgentList();
      if (currentView === "chat") renderChat();
      updateMonitor();
    });
  });
}

// ======================
// NAVIGATION
// ======================
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentView = btn.dataset.view;
    renderView();
  });
});

document.getElementById("btnAddAgent").addEventListener("click", () => {
  const name = prompt("Nama AI Employee baru:");
  if (!name) return;
  agents.push({
    id: Date.now(),
    name,
    role: "New Recruit",
    dept: "CEO Office",
    status: "standby",
    color: "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6,"0"),
    avatar: name[0].toUpperCase()
  });
  renderAgentList();
  updateMonitor();
});

// ======================
// VIEWS
// ======================
function renderView() {
  const content = document.getElementById("content");
  
  // destroy previous three.js if any
  if (officeScene) {
    officeScene = null;
  }

  switch (currentView) {
    case "dashboard": renderDashboard(content); break;
    case "office": renderOffice(content); break;
    case "employees": renderEmployees(content); break;
    case "tasks": renderTasks(content); break;
    case "chat": renderChat(content); break;
    case "meeting": renderPlaceholder(content, "AI Meeting Room", "Buat rapat virtual, undang AI, dan dapatkan kesimpulan otomatis."); break;
    case "projects": renderPlaceholder(content, "Project Management", "Kelola proyek, deadline, dan penugasan multi-AI."); break;
    case "finance": renderPlaceholder(content, "Finance & Accounting", "Simulasi keuangan perusahaan, anggaran divisi, dan laporan."); break;
    case "analytics": renderPlaceholder(content, "AI Performance & Analytics", "Grafik produktivitas, penilaian kinerja, dan evaluasi."); break;
    case "documents": renderPlaceholder(content, "Document Center", "Laporan, proposal, surat resmi, dan arsip otomatis."); break;
    case "ceo": renderPlaceholder(content, "CEO Control Center", "Kontrol penuh atas seluruh AI, anggaran, dan keputusan strategis."); break;
    case "settings": renderPlaceholder(content, "Company Settings", "Pengaturan perusahaan, rekrutmen, training, dan backup."); break;
    default: renderDashboard(content);
  }
  updateMonitor();
}

function renderPlaceholder(container, title, desc) {
  container.innerHTML = `
    <div class="placeholder">
      <h2>${title}</h2>
      <p>${desc}</p>
      <p style="font-size:13px;margin-top:8px">Fitur ini siap menerima perintah detail dari kamu.</p>
    </div>
  `;
}

// ===== DASHBOARD =====
function renderDashboard(container) {
  const working = agents.filter(a => a.status === "working").length;
  const completed = tasks.filter(t => t.status === "done").length;
  const active = tasks.filter(t => t.status !== "done").length;

  container.innerHTML = `
    <div class="view-header">
      <h1>Executive Dashboard</h1>
      <div class="view-actions">
        <button class="btn btn-outline">Export Report</button>
        <button class="btn btn-primary" onclick="assignRandomTask()">+ Quick Task</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="card-title">Total AI Employees</div>
        <div class="card-value">${agents.length}</div>
        <div class="card-sub">${working} sedang bekerja</div>
      </div>
      <div class="card">
        <div class="card-title">Active Tasks</div>
        <div class="card-value">${active}</div>
        <div class="card-sub">${completed} selesai hari ini</div>
      </div>
      <div class="card">
        <div class="card-title">Productivity</div>
        <div class="card-value">87%</div>
        <div class="card-sub">+4% dari kemarin</div>
      </div>
      <div class="card">
        <div class="card-title">Company Credits</div>
        <div class="card-value">1,240</div>
        <div class="card-sub">Simulasi</div>
      </div>
    </div>

    <div class="activity-list">
      <h3 style="margin-bottom:12px;font-size:15px">Aktivitas Terbaru</h3>
      <div class="activity-item">
        <div class="activity-time">13:32</div>
        <div><b>Kai</b> menyelesaikan draft konten Instagram</div>
      </div>
      <div class="activity-item">
        <div class="activity-time">13:18</div>
        <div><b>Nova</b> push update landing page (80%)</div>
      </div>
      <div class="activity-item">
        <div class="activity-time">12:55</div>
        <div><b>Chronos</b> membuat laporan harian otomatis</div>
      </div>
      <div class="activity-item">
        <div class="activity-time">12:40</div>
        <div><b>Ross</b> sedang istirahat (ON BREAK)</div>
      </div>
    </div>
  `;
}

// ===== EMPLOYEES =====
function renderEmployees(container) {
  container.innerHTML = `
    <div class="view-header">
      <h1>AI Employee Management</h1>
      <div class="view-actions">
        <button class="btn btn-primary" id="btnRecruit">+ Recruit AI</button>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${agents.map(a => `
            <tr>
              <td><strong>${a.name}</strong></td>
              <td>${a.role}</td>
              <td>${a.dept}</td>
              <td><span class="agent-status status-${a.status}">${a.status}</span></td>
              <td>
                <button class="btn btn-outline" style="padding:4px 10px;font-size:12px" onclick="editAgent(${a.id})">Edit</button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
  document.getElementById("btnRecruit").onclick = () => document.getElementById("btnAddAgent").click();
}

// ===== TASKS =====
function renderTasks(container) {
  container.innerHTML = `
    <div class="view-header">
      <h1>AI Task Manager</h1>
      <div class="view-actions">
        <button class="btn btn-primary" onclick="createTask()">+ New Task</button>
      </div>
    </div>
    <div style="padding:0 24px 24px">
      ${tasks.map(t => `
        <div class="task-item">
          <div>
            <div style="font-weight:600;margin-bottom:4px">${t.title}</div>
            <div style="font-size:12px;color:var(--text-dim)">
              Assigned to <b>${t.assignee}</b> · ${t.progress}%
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:10px">
            <span class="task-priority priority-${t.priority}">${t.priority}</span>
            <button class="btn btn-outline" style="padding:5px 10px;font-size:12px" onclick="completeTask(${t.id})">Done</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

// ===== CHAT =====
function renderChat(container) {
  const agent = agents.find(a => a.id === selectedAgent) || agents[0];
  selectedAgent = agent.id;

  container.innerHTML = `
    <div class="chat-layout">
      <div class="chat-agents">
        <div style="padding:14px;font-size:12px;font-weight:700;color:var(--text-dim);border-bottom:1px solid var(--panel-border)">
          SELECT AGENT
        </div>
        ${agents.map(a => `
          <div class="agent-item ${a.id === selectedAgent ? 'active' : ''}" data-id="${a.id}" style="margin:6px;border-radius:8px">
            <div class="agent-avatar" style="background:${a.color}">${a.avatar}</div>
            <div class="agent-info">
              <div class="agent-name">${a.name}</div>
              <div class="agent-status status-${a.status}">${a.status}</div>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="chat-main">
        <div style="padding:14px 18px;border-bottom:1px solid var(--panel-border);font-weight:600">
          Chat with ${agent.name} <span style="font-weight:400;color:var(--text-dim);font-size:13px">· ${agent.role}</span>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="msg ai">Halo! Saya ${agent.name}, ${agent.role}. Ada yang bisa saya bantu hari ini?</div>
        </div>
        <div class="chat-input-bar">
          <input id="chatInput" placeholder="Ketik pesan untuk ${agent.name}..." />
          <button class="btn btn-primary" onclick="sendChat()">Kirim</button>
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll(".chat-agents .agent-item").forEach(item => {
    item.addEventListener("click", () => {
      selectedAgent = Number(item.dataset.id);
      renderChat(container);
    });
  });

  document.getElementById("chatInput").addEventListener("keydown", e => {
    if (e.key === "Enter") sendChat();
  });
}

// ===== OFFICE 3D =====
function renderOffice(container) {
  container.innerHTML = `
    <div class="office-container">
      <canvas id="officeCanvas"></canvas>
      <div class="office-hint">Drag untuk putar · Scroll untuk zoom · Klik agen untuk detail</div>
    </div>
  `;
  initOffice3D();
}

function initOffice3D() {
  const canvas = document.getElementById("officeCanvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf4f1eb);
  scene.fog = new THREE.Fog(0xf4f1eb, 40, 90);

  const camera = new THREE.PerspectiveCamera(40, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.set(22, 26, 22);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0, 0);
  controls.maxPolarAngle = Math.PI / 2.3;
  controls.minDistance = 14;
  controls.maxDistance = 50;

  // Lights
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd4cfc4, 1.1));
  const dir = new THREE.DirectionalLight(0xffffff, 1.6);
  dir.position.set(12, 22, 10);
  dir.castShadow = true;
  dir.shadow.mapSize.set(2048, 2048);
  scene.add(dir);

  const mat = (c, r=0.6, m=0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });

  // Floor
  const floor = new THREE.Mesh(new THREE.BoxGeometry(36, 0.3, 28), mat(0xe8e4dc, 0.85));
  floor.position.y = -0.15;
  floor.receiveShadow = true;
  scene.add(floor);

  // Walls
  const wallMat = mat(0xf8f6f1, 0.9);
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(36, 6, 0.25), wallMat);
  backWall.position.set(0, 3, -14);
  scene.add(backWall);

  // Glass partitions (simple)
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xa5d0ff, transparent: true, opacity: 0.22, roughness: 0.05, side: THREE.DoubleSide
  });

  function glass(w, h, x, z, rot=0) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.06), glassMat);
    m.position.set(x, h/2 + 0.1, z);
    m.rotation.y = rot;
    scene.add(m);
  }
  glass(10, 2.2, -4, -5);
  glass(10, 2.2, 6, -5);
  glass(0.06, 2.2, -4, -8, Math.PI/2);
  glass(0.06, 2.2, 1, -8, Math.PI/2);
  glass(0.06, 2.2, 6, -8, Math.PI/2);

  // Desks
  function desk(x, z) {
    const g = new THREE.Group();
    const top = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.1, 1.2), mat(0xc4a574, 0.45));
    top.position.y = 1.1;
    top.castShadow = true;
    g.add(top);
    [[-1, -0.45], [1, -0.45], [-1, 0.45], [1, 0.45]].forEach(([dx,dz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 0.08), mat(0x333333));
      leg.position.set(dx, 0.55, dz);
      g.add(leg);
    });
    // monitor
    const mon = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.05), mat(0x222222));
    mon.position.set(0, 1.55, -0.35);
    g.add(mon);
    g.position.set(x, 0, z);
    scene.add(g);
  }

  // layout desks
  [-9, -4.5, 0, 4.5, 9].forEach(x => {
    desk(x, -8);
    desk(x, -3.5);
  });
  desk(-9, 2);
  desk(-4.5, 2);
  desk(4.5, 2);
  desk(9, 2);

  // Simple characters (cylinders)
  const charGroup = new THREE.Group();
  agents.slice(0, 6).forEach((a, i) => {
    const g = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.7, 12), mat(a.color));
    body.position.y = 0.7;
    g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), mat(0xf5d0b0));
    head.position.y = 1.25;
    g.add(head);

    // position around office
    const positions = [
      [-9, -7], [-4.5, -7], [0, -7], [4.5, -7], [9, -7], [-9, 3]
    ];
    g.position.set(positions[i][0], 0, positions[i][1]);
    charGroup.add(g);
  });
  scene.add(charGroup);

  // Plants
  function plant(x, z) {
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.2, 0.4, 10), mat(0x8b7355));
    pot.position.set(x, 0.2, z);
    scene.add(pot);
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.9, 8), mat(0x2d6a4f));
    leaf.position.set(x, 0.85, z);
    scene.add(leaf);
  }
  plant(-12, -11);
  plant(12, -11);
  plant(-12, 6);
  plant(12, 6);
  plant(0, -12);

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // subtle bob
    charGroup.children.forEach((c, i) => {
      c.position.y = Math.sin(Date.now() * 0.002 + i) * 0.03;
    });
    renderer.render(scene, camera);
  }
  animate();

  // resize
  window.addEventListener("resize", () => {
    if (!canvas) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });

  officeScene = { scene, renderer, camera };
}

// ======================
// ACTIONS
// ======================
window.assignRandomTask = function() {
  const free = agents.filter(a => a.status === "standby" || a.status === "break");
  const agent = free.length ? free[Math.floor(Math.random()*free.length)] : agents[Math.floor(Math.random()*agents.length)];
  agent.status = "working";
  tasks.unshift({
    id: Date.now(),
    title: "Tugas baru dari Dashboard",
    assignee: agent.name,
    priority: ["high","medium","low"][Math.floor(Math.random()*3)],
    status: "in-progress",
    progress: 0
  });
  renderAgentList();
  if (currentView === "dashboard") renderView();
  updateMonitor();
};

window.createTask = function() {
  const title = prompt("Judul tugas:");
  if (!title) return;
  const assignee = agents[Math.floor(Math.random()*agents.length)].name;
  tasks.unshift({
    id: Date.now(),
    title,
    assignee,
    priority: "medium",
    status: "todo",
    progress: 0
  });
  renderView();
};

window.completeTask = function(id) {
  const t = tasks.find(t => t.id === id);
  if (t) {
    t.status = "done";
    t.progress = 100;
    const agent = agents.find(a => a.name === t.assignee);
    if (agent) agent.status = "standby";
    renderView();
    renderAgentList();
  }
};

window.editAgent = function(id) {
  const a = agents.find(a => a.id === id);
  if (!a) return;
  const newRole = prompt("Role baru:", a.role);
  if (newRole) a.role = newRole;
  renderView();
  renderAgentList();
};

window.sendChat = function() {
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  if (!input || !messages || !input.value.trim()) return;

  const text = input.value.trim();
  messages.innerHTML += `<div class="msg user">${text}</div>`;
  input.value = "";

  const agent = agents.find(a => a.id === selectedAgent) || agents[0];
  setTimeout(() => {
    const replies = [
      `Baik, saya ${agent.name} akan kerjakan itu sekarang.`,
      `Siap! Saya catat dan proses sesuai prioritas.`,
      `Terima kasih. Saya akan laporkan hasilnya nanti.`,
      `Understood. Sedang saya analisis dulu.`
    ];
    messages.innerHTML += `<div class="msg ai">${replies[Math.floor(Math.random()*replies.length)]}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 600);
};

// ======================
// MONITOR
// ======================
function updateMonitor() {
  const body = document.getElementById("monitorBody");
  if (!body) return;

  const working = agents.filter(a => a.status === "working").length;
  const activeTasks = tasks.filter(t => t.status !== "done").length;

  body.innerHTML = `
    <div class="metric"><span class="metric-label">Agents Online</span><span class="metric-value">${agents.length}</span></div>
    <div class="metric"><span class="metric-label">Working</span><span class="metric-value">${working}</span></div>
    <div class="metric"><span class="metric-label">Active Tasks</span><span class="metric-value">${activeTasks}</span></div>
    <div class="metric"><span class="metric-label">Completed Today</span><span class="metric-value">${tasks.filter(t=>t.status==="done").length}</span></div>
    <div class="metric"><span class="metric-label">Productivity</span><span class="metric-value">87%</span></div>
    <div style="margin-top:18px;font-size:11px;font-weight:700;color:var(--text-dim);letter-spacing:0.5px">SELECTED AGENT</div>
    ${selectedAgent ? (() => {
      const a = agents.find(x => x.id === selectedAgent);
      return a ? `
        <div style="margin-top:10px;padding:12px;background:#f8f6f1;border-radius:10px">
          <div style="font-weight:700">${a.name}</div>
          <div style="font-size:12px;color:var(--text-dim);margin:2px 0 8px">${a.role}</div>
          <div class="agent-status status-${a.status}">${a.status.toUpperCase()}</div>
        </div>
      ` : "";
    })() : `<div style="margin-top:10px;color:var(--text-dim);font-size:13px">Pilih agen di kiri</div>`}
  `;
}

// ======================
// INIT
// ======================
renderAgentList();
renderView();
