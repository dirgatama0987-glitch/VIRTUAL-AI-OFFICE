// ======================
// MEETING ROOM
// ======================
let currentMeeting = null;

function renderMeeting(container) {
  if (currentMeeting && currentMeeting.status === "running") {
    renderMeetingRunning(container);
    return;
  }

  // Tampilan awal - buat rapat baru
  container.innerHTML = `
    <div class="view-header">
      <h1>AI Meeting Room</h1>
    </div>

    <div style="padding: 0 24px 30px; max-width: 700px;">
      <div class="card" style="margin-bottom: 20px;">
        <div style="font-weight:600; margin-bottom:12px;">Buat Rapat Baru</div>
        
        <label style="font-size:13px; color:var(--text-dim); display:block; margin-bottom:6px;">Topik Rapat</label>
        <input id="meetingTopic" type="text" placeholder="Contoh: Strategi marketing bulan depan" 
          style="width:100%; padding:10px 14px; border:1px solid var(--panel-border); border-radius:8px; font-size:14px; margin-bottom:16px; outline:none;">

        <label style="font-size:13px; color:var(--text-dim); display:block; margin-bottom:8px;">Undang AI Employees</label>
        <div id="meetingAgents" style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">
          ${agents.map(a => `
            <label style="display:flex; align-items:center; gap:6px; background:#f8f6f1; padding:6px 12px; border-radius:20px; cursor:pointer; font-size:13px;">
              <input type="checkbox" value="${a.id}" style="accent-color:var(--accent);">
              <span style="width:10px;height:10px;border-radius:50%;background:${a.color};display:inline-block;"></span>
              ${a.name}
            </label>
          `).join("")}
        </div>

        <button class="btn btn-primary" onclick="startMeeting()">Mulai Rapat</button>
      </div>

      <div style="font-size:13px; color:var(--text-dim); line-height:1.6;">
        <b>Cara pakai:</b><br>
        1. Tulis topik rapat<br>
        2. Centang AI yang ingin diundang<br>
        3. Klik <b>Mulai Rapat</b><br>
        4. AI akan memberikan pendapat sesuai divisi masing-masing<br>
        5. Sistem otomatis membuat kesimpulan
      </div>
    </div>
  `;
}

function startMeeting() {
  const topicInput = document.getElementById("meetingTopic");
  const topic = topicInput ? topicInput.value.trim() : "";
  
  if (!topic) {
    alert("Tulis topik rapat terlebih dahulu!");
    return;
  }

  const checked = document.querySelectorAll("#meetingAgents input[type=checkbox]:checked");
  if (checked.length === 0) {
    alert("Pilih minimal 1 AI untuk diundang!");
    return;
  }

  const invited = [];
  checked.forEach(cb => {
    const agent = agents.find(a => a.id === Number(cb.value));
    if (agent) invited.push(agent);
  });

  currentMeeting = {
    topic: topic,
    invited: invited,
    status: "running",
    opinions: [],
    conclusion: null
  };

  // Ubah status AI jadi meeting
  invited.forEach(a => a.status = "meeting");
  renderAgentList();

  // Langsung render tampilan running
  renderView();
}

function renderMeetingRunning(container) {
  const m = currentMeeting;

  container.innerHTML = `
    <div class="view-header">
      <h1>Meeting Room</h1>
      <div class="view-actions">
        <button class="btn btn-outline" onclick="endMeeting()">Akhiri Rapat</button>
      </div>
    </div>

    <div style="padding: 0 24px 30px;">
      <div class="card" style="margin-bottom: 16px;">
        <div style="font-size:13px; color:var(--text-dim);">Topik Rapat</div>
        <div style="font-size:18px; font-weight:700; margin-top:4px;">${m.topic}</div>
        <div style="margin-top:10px; font-size:13px;">
          Peserta: ${m.invited.map(a => `<span style="background:#dbeafe; color:#1d4ed8; padding:2px 8px; border-radius:12px; margin-right:6px; font-size:12px;">${a.name}</span>`).join("")}
        </div>
      </div>

      <div id="meetingDiscussion" style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
        <div style="text-align:center; color:var(--text-dim); padding:20px;">
          AI sedang berdiskusi...
        </div>
      </div>

      <div id="meetingConclusion" style="display:none;"></div>
    </div>
  `;

  // Simulasi diskusi AI
  simulateDiscussion();
}

function simulateDiscussion() {
  const m = currentMeeting;
  const discussionEl = document.getElementById("meetingDiscussion");
  if (!discussionEl) return;

  discussionEl.innerHTML = "";
  let delay = 0;

  m.invited.forEach((agent, index) => {
    delay += 900;

    setTimeout(() => {
      const opinion = generateOpinion(agent, m.topic);
      m.opinions.push({ agent: agent.name, text: opinion });

      const div = document.createElement("div");
      div.className = "card";
      div.style.padding = "14px";
      div.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
          <div style="width:28px;height:28px;border-radius:6px;background:${agent.color};color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">
            ${agent.avatar}
          </div>
          <strong>${agent.name}</strong>
          <span style="font-size:12px;color:var(--text-dim);">${agent.role}</span>
        </div>
        <div style="font-size:14px; line-height:1.5;">${opinion}</div>
      `;
      discussionEl.appendChild(div);
      discussionEl.scrollTop = discussionEl.scrollHeight;

      // Kalau ini pendapat terakhir → buat kesimpulan
      if (index === m.invited.length - 1) {
        setTimeout(() => {
          generateConclusion();
        }, 800);
      }
    }, delay);
  });
}

function generateOpinion(agent, topic) {
  const opinions = {
    "CEO Office": [
      `Dari sisi operasional, topik "${topic}" perlu diprioritaskan. Saya usulkan kita buat timeline jelas dan tanggung jawab tiap divisi.`,
      `Sebagai asisten CEO, saya melihat "${topic}" sangat strategis. Mari kita pastikan semua divisi selaras.`
    ],
    "Marketing": [
      `Untuk "${topic}", saya rekomendasikan pendekatan konten organik + paid ads. Target kita naikkan engagement 30% bulan ini.`,
      `Dari sisi marketing, "${topic}" bisa kita manfaatkan untuk campaign. Saya sudah punya beberapa ide kreatif.`
    ],
    "Finance": [
      `Dari sisi keuangan, "${topic}" harus kita sesuaikan dengan anggaran. Saya hitung estimasi biayanya dulu.`,
      `Perlu hati-hati dengan budget untuk "${topic}". Saya usulkan alokasi maksimal 15% dari dana marketing.`
    ],
    "Development": [
      `Secara teknis, "${topic}" feasible. Saya butuh waktu sekitar 1-2 minggu untuk develop fitur pendukungnya.`,
      `Dari sisi development, kita bisa support "${topic}" dengan tools internal. Saya siap kerjakan.`
    ],
    "Content Creation": [
      `Untuk "${topic}", saya bisa buatkan rangkaian konten (Instagram, TikTok, Blog). Estimasi 8-12 konten.`,
      `Topik "${topic}" bagus untuk storytelling. Saya siap buatkan script dan visualnya.`
    ],
    "Customer Service": [
      `Dari feedback pelanggan terkait "${topic}", banyak yang meminta kejelasan. Kita perlu komunikasi yang lebih baik.`,
      `Saya catat keluhan terkait "${topic}". Sebaiknya kita siapkan FAQ dan response template.`
    ]
  };

  const list = opinions[agent.dept] || [
    `Saya setuju dengan pembahasan "${topic}". Mari kita kerjakan bersama secara terstruktur.`
  ];

  return list[Math.floor(Math.random() * list.length)];
}

function generateConclusion() {
  const m = currentMeeting;
  const conclusionEl = document.getElementById("meetingConclusion");
  if (!conclusionEl) return;

  const summary = `
    <div class="card" style="border: 2px solid var(--accent);">
      <div style="font-weight:700; font-size:16px; margin-bottom:10px; color:var(--accent);">
        Kesimpulan Rapat
      </div>
      <div style="font-size:14px; line-height:1.6; margin-bottom:14px;">
        Rapat dengan topik <b>"${m.topic}"</b> telah selesai dibahas oleh ${m.invited.length} AI.<br><br>
        <b>Poin utama:</b><br>
        • Semua peserta memberikan masukan sesuai keahlian divisi masing-masing.<br>
        • Perlu dibuat action plan dan penanggung jawab.<br>
        • Disarankan follow-up dalam 3 hari ke depan.
      </div>
      <button class="btn btn-primary" onclick="saveMeetingDocument()">Simpan sebagai Dokumen</button>
      <button class="btn btn-outline" style="margin-left:8px;" onclick="endMeeting()">Selesai</button>
    </div>
  `;

  conclusionEl.innerHTML = summary;
  conclusionEl.style.display = "block";
  m.conclusion = summary;
  m.status = "finished";
}

function saveMeetingDocument() {
  alert("Dokumen hasil rapat berhasil disimpan ke Document Center! (simulasi)");
  endMeeting();
}

function endMeeting() {
  if (currentMeeting) {
    currentMeeting.invited.forEach(a => {
      if (a.status === "meeting") a.status = "standby";
    });
  }
  currentMeeting = null;
  renderAgentList();
  renderView();
}
