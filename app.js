/* ===== Nova AI — interactive chatbot dashboard ===== */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Navigation ---------- */
  const navItems = $$(".nav-item");
  const views = $$(".view");
  const sidebar = $("#sidebar");
  const overlay = $("#overlay");

  function setView(name) {
    views.forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
    navItems.forEach((n) => n.classList.toggle("active", n.dataset.view === name));
    closeSidebar();
    if (name === "dashboard") renderDashboard();
    if (name === "chat") $("#chatInput")?.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Any element with data-view triggers navigation (nav items + hero buttons)
  $$("[data-view]").forEach((el) =>
    el.addEventListener("click", () => setView(el.dataset.view))
  );

  /* ---------- Mobile sidebar ---------- */
  function openSidebar() { sidebar.classList.add("open"); overlay.classList.add("show"); }
  function closeSidebar() { sidebar.classList.remove("open"); overlay.classList.remove("show"); }
  $("#menuToggle").addEventListener("click", openSidebar);
  overlay.addEventListener("click", closeSidebar);

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("nova-theme", theme);
    const dm = $("#darkModeSetting");
    if (dm) dm.checked = theme === "dark";
  }
  function toggleTheme() {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  }
  $("#themeToggle").addEventListener("click", toggleTheme);
  $("#themeToggleMobile").addEventListener("click", toggleTheme);
  $("#darkModeSetting").addEventListener("change", (e) =>
    applyTheme(e.target.checked ? "dark" : "light")
  );
  applyTheme(localStorage.getItem("nova-theme") || "light");

  /* ---------- Accent color ---------- */
  const swatches = $$(".swatch");
  function applyAccent(color) {
    root.style.setProperty("--accent", color);
    root.style.setProperty("--accent-2", lighten(color, 0.22));
    root.style.setProperty("--accent-soft", hexToSoft(color));
    localStorage.setItem("nova-accent", color);
    swatches.forEach((s) => s.classList.toggle("active", s.dataset.color === color));
  }
  function hexToSoft(hex) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.12)`;
  }
  function lighten(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.min(255, ((n >> 16) & 255) + Math.round(255 * amt));
    const g = Math.min(255, ((n >> 8) & 255) + Math.round(255 * amt));
    const b = Math.min(255, (n & 255) + Math.round(255 * amt));
    return `rgb(${r}, ${g}, ${b})`;
  }
  swatches.forEach((s) => s.addEventListener("click", () => applyAccent(s.dataset.color)));
  applyAccent(localStorage.getItem("nova-accent") || "#1e4d8c");

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* ---------- Chatbot ---------- */
  const messagesEl = $("#messages");
  const composer = $("#composer");
  const chatInput = $("#chatInput");
  const speeds = { 1: 1400, 2: 800, 3: 350 };

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addMessage(text, who) {
    const msg = document.createElement("div");
    msg.className = "msg " + who;
    msg.innerHTML = `
      <div class="mini-avatar">${who === "bot" ? "N" : "You"}</div>
      <div>
        <div class="bubble">${escapeHtml(text)}</div>
        <span class="time">${now()}</span>
      </div>`;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return msg;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function showTyping() {
    const msg = document.createElement("div");
    msg.className = "msg bot";
    msg.id = "typingMsg";
    msg.innerHTML = `
      <div class="mini-avatar">N</div>
      <div class="bubble"><div class="typing-bubble"><span></span><span></span><span></span></div></div>`;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function botReply(userText) {
    const tone = $("#toneSelect")?.value || "Friendly";
    const speed = speeds[$("#speedRange")?.value || 2];
    showTyping();
    setTimeout(() => {
      $("#typingMsg")?.remove();
      addMessage(generateReply(userText, tone), "bot");
      if ($("#soundSetting")?.checked) beep();
    }, speed);
  }

  const replyBank = {
    greeting: ["Hello! How can I help you today?", "Hi there! What can I do for you?"],
    tips: ["Here are 3 quick productivity tips:\n1) Time-block your day\n2) Tackle the hardest task first\n3) Take short breaks every 50 minutes."],
    poem: ["Here's a little verse for you:\nCode flows like a quiet stream,\nbugs dissolve in morning light —\nlogic builds the dreamer's dream,\nshipping features through the night."],
    recursion: ["Recursion is when a function calls itself to solve smaller pieces of a problem, until it reaches a simple 'base case' it can answer directly — like looking up a word whose definition uses simpler words."],
    plan: ["Sure! A solid daily plan:\n• Morning: deep focus work\n• Midday: meetings & collaboration\n• Afternoon: admin + emails\n• Evening: review and plan tomorrow."],
    fallback: [
      "That's a great question! Let me think… here's what I'd suggest based on what you shared.",
      "Got it. I'd approach that step by step — happy to go deeper on any part.",
      "Interesting! Here's a clear way to look at it.",
    ],
  };

  function generateReply(text, tone) {
    const t = text.toLowerCase();
    let base;
    if (/\b(hi|hello|hey)\b/.test(t)) base = pick(replyBank.greeting);
    else if (t.includes("tip") || t.includes("productiv")) base = pick(replyBank.tips);
    else if (t.includes("poem") || t.includes("poetry")) base = pick(replyBank.poem);
    else if (t.includes("recursion")) base = pick(replyBank.recursion);
    else if (t.includes("plan") && t.includes("day")) base = pick(replyBank.plan);
    else base = pick(replyBank.fallback);

    if (tone === "Concise") base = base.split("\n")[0];
    if (tone === "Playful") base = base + " 🎉";
    if (tone === "Professional") base = base.replace(/!+/g, ".");
    return base;
  }

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 660; o.type = "sine";
      g.gain.setValueAtTime(0.08, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      o.start(); o.stop(ctx.currentTime + 0.25);
    } catch (e) { /* audio not available */ }
  }

  composer.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, "user");
    chatInput.value = "";
    $("#suggestions").style.display = "none";
    botReply(text);
  });

  $$("#suggestions .chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      chatInput.value = chip.textContent;
      composer.dispatchEvent(new Event("submit"));
    })
  );

  $("#clearChat").addEventListener("click", () => {
    messagesEl.innerHTML = "";
    $("#suggestions").style.display = "flex";
    seedChat();
    toast("Chat cleared");
  });

  function seedChat() {
    addMessage("Hi! I'm Nova, your AI assistant. Ask me anything or tap a suggestion below.", "bot");
  }
  seedChat();

  /* ---------- Dashboard ---------- */
  let dashRendered = false;
  function renderDashboard() {
    animateCounters();
    renderBars();
    renderDonut();
    dashRendered = true;
  }

  function animateCounters() {
    $$(".stat-value").forEach((el) => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const start = performance.now();
      const dur = 1100;
      function step(t) {
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  const barData = [
    { d: "Mon", v: 320 }, { d: "Tue", v: 480 }, { d: "Wed", v: 410 },
    { d: "Thu", v: 620 }, { d: "Fri", v: 540 }, { d: "Sat", v: 290 }, { d: "Sun", v: 380 },
  ];
  function renderBars() {
    const chart = $("#barChart");
    const max = Math.max(...barData.map((b) => b.v));
    chart.innerHTML = barData
      .map((b) => `<div class="bar" style="height:0" data-h="${(b.v / max) * 100}">
          <span class="bar-val">${b.v}</span>
          <span class="bar-label">${b.d}</span>
        </div>`)
      .join("");
    requestAnimationFrame(() =>
      $$(".bar", chart).forEach((bar) => (bar.style.height = bar.dataset.h + "%"))
    );
  }

  const topics = [
    { label: "General", val: 38, color: "#1e4d8c" },
    { label: "Coding", val: 27, color: "#2f6fb0" },
    { label: "Writing", val: 20, color: "#0f766e" },
    { label: "Other", val: 15, color: "#94a0b3" },
  ];
  function renderDonut() {
    const donut = $("#donut");
    let acc = 0;
    const segs = topics
      .map((t) => {
        const start = acc;
        acc += t.val;
        return `${t.color} ${start}% ${acc}%`;
      })
      .join(", ");
    donut.style.background = `conic-gradient(${segs})`;
    $("#donutLegend").innerHTML = topics
      .map((t) => `<li><span class="dot" style="background:${t.color}"></span>${t.label}<span class="leg-val">${t.val}%</span></li>`)
      .join("");
  }

  $("#rangeSelect").addEventListener("change", () => {
    barData.forEach((b) => (b.v = Math.round(b.v * (0.7 + Math.random() * 0.6))));
    renderBars();
    toast("Dashboard updated");
  });

  /* ---------- History ---------- */
  const history = [
    { icon: "💡", title: "Brainstorming app names", snippet: "Let's come up with names for a fitness tracker…", time: "2h ago" },
    { icon: "🐍", title: "Python list comprehension", snippet: "How do I flatten a nested list in Python?", time: "Yesterday" },
    { icon: "✉️", title: "Drafting a follow-up email", snippet: "Write a polite reminder to a client about…", time: "Yesterday" },
    { icon: "📚", title: "Explaining big-O notation", snippet: "Can you explain time complexity simply?", time: "3 days ago" },
    { icon: "🍳", title: "Quick dinner recipes", snippet: "Give me a 20-minute pasta recipe…", time: "5 days ago" },
    { icon: "🧠", title: "Study plan for exams", snippet: "Help me build a 2-week revision schedule…", time: "1 week ago" },
  ];
  function renderHistory(filter = "") {
    const list = $("#historyList");
    const f = filter.toLowerCase();
    const items = history.filter(
      (h) => h.title.toLowerCase().includes(f) || h.snippet.toLowerCase().includes(f)
    );
    list.innerHTML = items.length
      ? items
          .map(
            (h) => `<li class="history-item">
              <div class="h-icon">${h.icon}</div>
              <div class="h-body"><strong>${h.title}</strong><p>${h.snippet}</p></div>
              <span class="h-meta">${h.time}</span>
            </li>`
          )
          .join("")
      : `<li class="history-item"><div class="h-body"><strong>No matches</strong><p>Try a different search term.</p></div></li>`;
    $$(".history-item", list).forEach((el) =>
      el.addEventListener("click", () => { setView("chat"); toast("Opened conversation"); })
    );
  }
  $("#historySearch").addEventListener("input", (e) => renderHistory(e.target.value));
  renderHistory();

  /* ---------- Settings ---------- */
  $("#saveSettings").addEventListener("click", () => {
    localStorage.setItem("nova-tone", $("#toneSelect").value);
    localStorage.setItem("nova-sound", $("#soundSetting").checked);
    localStorage.setItem("nova-speed", $("#speedRange").value);
    toast("Settings saved ✓");
  });
  $("#resetSettings").addEventListener("click", () => {
    $("#toneSelect").value = "Friendly";
    $("#soundSetting").checked = true;
    $("#speedRange").value = 2;
    applyAccent("#1e4d8c");
    applyTheme("light");
    toast("Reset to defaults");
  });
  // Restore saved settings
  if (localStorage.getItem("nova-tone")) $("#toneSelect").value = localStorage.getItem("nova-tone");
  if (localStorage.getItem("nova-sound")) $("#soundSetting").checked = localStorage.getItem("nova-sound") === "true";
  if (localStorage.getItem("nova-speed")) $("#speedRange").value = localStorage.getItem("nova-speed");

  // Clear chat badge when visiting chat
  $('[data-view="chat"]').addEventListener("click", () => {
    const badge = $("#chatBadge");
    if (badge) badge.style.display = "none";
  });
})();
