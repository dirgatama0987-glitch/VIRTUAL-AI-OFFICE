// ======================
// DRX.AI - Core Script
// ======================

const agents = [
  { id: 1, name: "Aria", role: "CEO Assistant", dept: "CEO Office", status: "working", color: "#3b82f6", avatar: "A" },
  { id: 2, name: "Kai", role: "Content Creator", dept: "Content Creation", status: "posting", color: "#8b5cf6", avatar: "K" },
  { id: 3, name: "Ross", role: "Marketing Lead", dept: "Marketing", status: "break", color: "#f59e0b", avatar: "R" },
  { id: 4, name: "Nova", role: "Fullstack Dev", dept: "Development", status: "working", color: "#10b981", avatar: "N" },
  { id: 5, name: "Luna", role: "Finance Analyst", dept: "Finance", status: "standby", color: "#ef4444", avatar: "L" },
  { id: 6, name: "C.C", role: "Customer Support", dept: "Customer Service", status: "standby", color: "#6366f1", avatar: "C" },
];

let tasks = [
  { id: 1, title: "Analisis data penjualan Q3", assignee: "Luna", priority: "high", status: "in-progress", progress: 65 },
  { id: 2, title: "Buat konten Instagram minggu ini", assignee: "Kai", priority: "medium", status: "in-progress", progress: 40 },
  { id: 3, title: "Review proposal vendor baru", assignee: "Aria", priority: "high", status: "todo", progress: 0 },
  { id: 4, title: "Optimasi landing page", assignee: "Nova", priority: "medium", status: "in-progress", progress: 80 },
];

let currentView = "dashboard";
let selectedAgent = null;

// ======================
// CLOCK
// ======================
function updateClock() {
  const el = document.getElementById("clock");
  if (el) el.textContent = new Date().toLocaleTimeString("en-GB");
}
setInterval(updateClock, 1000);
updateClock();

// ======================
// RENDER AGENTS
// ======================
function renderAgentList() {
  const el = document.getElementById("agentList");
  if (!el) return;

  el.innerHTML = agents.map(a => `
    <div class="agent-item ${selectedAgent === a.id ? 'active' : ''}" data-id="${a.id}">
      <div class="agent-avatar" style="background:${a.color}">${a.avatar}</div>
      <div class="agent-info">
        <div class="agent-name">${a.name}</div>
        <div class="agent-status status-${a.status}">${a.status}</div>
      </div>
    </div>
  `).join("");

  el.querySelectorAll(".agent-item").forEach(item => {
    item.onclick = () => {
      selectedAgent = Number(item.dataset.id);
      renderAgentList();
      updateMonitor();
      if (currentView === "chat") renderView();
    };
  });
}

// ======================
// NAVIGATION
// ======================
function initNavigation() {
  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentView = btn.dataset.view;
      renderView();
    };
  });

  document.getElementById("btnAddAgent").onclick = () => {
    const name = prompt("Nama AI Employee baru:");
    if (!name || !name.trim()) return;
    agents.push({
      id: Date.now(),
      name: name.trim(),
      role: "New Recruit",
      dept: "CEO Office",
      status: "standby",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
      avatar: name.trim()[0].toUpperCase()
    });
    renderAgentList();
    updateMonitor();
    if (currentView === "employees") renderView();
  };
}

// ======================
// VIEWS
// ======================
function renderView() {
  const content = document.getElementById("content");
  if (!content) return;

  switch (currentView) {
    case "dashboard": renderDashboard(content); break;
    case "office": renderOffice(content); break;
    case "employees": renderEmployees(content); break;
    case "tasks": renderTasks(content); break;
    case "chat": renderChat(content); break;
    case "meeting": renderPlaceholder(content, "AI Meeting Room", "Buat rapat virtual, undang beberapa AI, berikan topik, dan dapatkan kesimpulan + dokumen otomatis."); break;
    case "projects": renderPlaceholder(content, "Project Management", "Buat proyek, tentukan target & deadline, tugaskan multi AI, pantau progres."); break;
    case "finance": renderPlaceholder(content, "Finance & Accounting", "Simulasi pemasukan, pengeluaran, anggaran divisi, dan laporan keuangan."); break;
    case "analytics": renderPlaceholder(content, "AI Performance & Analytics", "Penilaian kinerja AI, kecepatan, tingkat keberhasilan, dan grafik produktivitas."); break;
    case "documents": renderPlaceholder(content, "Document Center", "Buat laporan, proposal, surat resmi, dan arsip otomatis per divisi."); break;
    case "ceo": renderPlaceholder(content, "CEO Control Center", "Kontrol penuh seluruh AI, struktur organisasi, anggaran, dan keputusan strategis."); break;
    case "settings": renderPlaceholder(content, "Company Settings", "Pengaturan perusahaan, AI Recruitment, Training, Memory, Automation, dan Backup."); break;
    default: renderDashboard(content);
  }
  updateMonitor();
}

function renderPlaceholder(container, title, desc) {
  container.innerHTML = `
    <div class="placeholder">
      <h2>${title}</h2>
      <p>${desc}</p>
      <p style="font-size:13px;margin-top:8px;opacity:0.7">Fitur ini siap dikembangkan sesuai perintahmu berikutnya.</p>
    </div>
  `;
}

// ===== DASHBOARD =====
function renderDashboard(container) {
  const working = agents.filter(a => a.status === "working").length;
  const active = tasks.filter(t => t.status !== "done").length;
  const completed = tasks.filter(t => t.status === "done").length;

  container.innerHTML = `
    <div class="view-header">
      <h1>Executive Dashboard</h1>
      <div class="view-actions">
        <button class="btn btn-outline" onclick="alert('Report exported (simulasi)')">Export Report</button>
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
        <div class="card-sub">${completed} selesai</div>
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
      <div class="activity-item"><div class="activity-time">13:32</div><div><b>Kai</b> menyelesaikan draft konten Instagram</div></div>
      <div class="activity-item"><div class="activity-time">13:18</div><div><b>Nova</b> push update landing page (80%)</div></div>
      <div class="activity-item"><div class="activity-time">12:55</div><div><b>Aria</b> membuat laporan harian otomatis</div></div>
      <div class="activity-item"><div class="activity-time">12:40</div><div><b>Ross</b> sedang istirahat (ON BREAK)</div></div>
    </div>
  `;
}

// ===== OFFICE =====
function renderOffice(container) {
  container.innerHTML = `
    <div class="office-placeholder">
      <h2>Virtual Office 3D</h2>
      <p>Kantor virtual DRX.AI</p>
      <p style="font-size:13px;max-width:360px;text-align:center">
        Versi 3D penuh sedang disiapkan. Saat ini kamu bisa kelola Agents, Tasks, dan Communication dulu.
      </p>
      <button class="btn btn-primary" onclick="document.querySelector('[data-view=dashboard]').click()">Kembali ke Dashboard</button>
    </div>
  `;
}

// ===== EMPLOYEES =====
function renderEmployees(container) {
  container.innerHTML = `
    <div class="view-header">
      <h1>AI Employee Management</h1>
      <div class="view-actions">
        <button class="btn btn-primary" onclick="document.getElementById('btnAddAgent').click()">+ Recruit AI</button>
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
            <th>Action</th>
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
      ${tasks.length === 0 ? '<p style="color:var(--text-dim)">Belum ada tugas</p>' : 
        tasks.map(t => `
          <div class="task-item">
            <div>
              <div style="font-weight:600;margin-bottom:4px">${t.title}</div>
              <div style="font-size:12px;color:var(--text-dim)">
                Assigned to <b>${t.assignee}</b> · ${t.progress}%
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              <span class="task-priority priority-${t.priority}">${t.priority}</span>
              ${t.status !== "done" ? 
                `<button class="btn btn-outline" style="padding:5px 10px;font-size:12px" onclick="completeTask(${t.id})">Done</button>` : 
                `<span style="font-size:12px;color:var(--green);font-weight:600">Completed</span>`
              }
            </div>
          </div>
        `).join("")
      }
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
          Chat with ${agent.name} 
          <span style="font-weight:400;color:var(--text-dim);font-size:13px">· ${agent.role}</span>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="msg ai">Halo! Saya ${agent.name}, ${agent.role} di DRX.AI. Ada yang bisa saya bantu?</div>
        </div>
        <div class="chat-input-bar">
          <input id="chatInput" placeholder="Ketik pesan untuk ${agent.name}..." />
          <button class="btn btn-primary" onclick="sendChat()">Kirim</button>
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll(".chat-agents .agent-item").forEach(item => {
    item.onclick = () => {
      selectedAgent = Number(item.dataset.id);
      renderChat(container);
    };
  });

  const input = document.getElementById("chatInput");
  if (input) {
    input.onkeydown = (e) => { if (e.key === "Enter") sendChat(); };
  }
}

// ======================
// ACTIONS
// ======================
function assignRandomTask() {
  const agent = agents[Math.floor(Math.random() * agents.length)];
  agent.status = "working";
  tasks.unshift({
    id: Date.now(),
    title: "Tugas baru dari Dashboard",
    assignee: agent.name,
    priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
    status: "in-progress",
    progress: 0
  });
  renderAgentList();
  if (currentView === "dashboard" || currentView === "tasks") renderView();
  updateMonitor();
}

function createTask() {
  const title = prompt("Judul tugas:");
  if (!title || !title.trim()) return;
  const assignee = agents[Math.floor(Math.random() * agents.length)].name;
  tasks.unshift({
    id: Date.now(),
    title: title.trim(),
    assignee,
    priority: "medium",
    status: "todo",
    progress: 0
  });
  renderView();
}

function completeTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) {
    t.status = "done";
    t.progress = 100;
    const agent = agents.find(a => a.name === t.assignee);
    if (agent) agent.status = "standby";
    renderAgentList();
    renderView();
  }
}

function editAgent(id) {
  const a = agents.find(a => a.id === id);
  if (!a) return;
  const newRole = prompt("Role baru:", a.role);
  if (newRole && newRole.trim()) {
    a.role = newRole.trim();
    renderView();
    renderAgentList();
  }
}

function sendChat() {
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
    messages.innerHTML += `<div class="msg ai">${replies[Math.floor(Math.random() * replies.length)]}</div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 500);
}

// ======================
// MONITOR
// ======================
function updateMonitor() {
  const body = document.getElementById("monitorBody");
  if (!body) return;

  const working = agents.filter(a => a.status === "working").length;
  const activeTasks = tasks.filter(t => t.status !== "done").length;

  let selectedHTML = `<div style="margin-top:10px;color:var(--text-dim);font-size:13px">Pilih agen di kiri</div>`;
  if (selectedAgent) {
    const a = agents.find(x => x.id === selectedAgent);
    if (a) {
      selectedHTML = `
        <div style="margin-top:10px;padding:12px;background:#f8f6f1;border-radius:10px">
          <div style="font-weight:700">${a.name}</div>
          <div style="font-size:12px;color:var(--text-dim);margin:2px 0 8px">${a.role}</div>
          <div class="agent-status status-${a.status}">${a.status.toUpperCase()}</div>
        </div>
      `;
    }
  }

  body.innerHTML = `
    <div class="metric"><span class="metric-label">Agents Online</span><span class="metric-value">${agents.length}</span></div>
    <div class="metric"><span class="metric-label">Working</span><span class="metric-value">${working}</span></div>
    <div class="metric"><span class="metric-label">Active Tasks</span><span class="metric-value">${activeTasks}</span></div>
    <div class="metric"><span class="metric-label">Completed</span><span class="metric-value">${tasks.filter(t => t.status === "done").length}</span></div>
    <div class="metric"><span class="metric-label">Productivity</span><span class="metric-value">87%</span></div>
    <div style="margin-top:18px;font-size:11px;font-weight:700;color:var(--text-dim);letter-spacing:0.5px">SELECTED AGENT</div>
    ${selectedHTML}
  `;
}

// ======================
// INIT
// ======================
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  renderAgentList();
  renderView();
});
