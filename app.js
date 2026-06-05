/* ===== Nova AI — Creative Glassmorphism App ===== */
(function () {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ============================================
     NAVIGATION
     ============================================ */
  function setView(name) {
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + name));
    // Sync all nav buttons (top pill-nav + bottom dock)
    $$("[data-view]").forEach((el) => {
      const isPillOrDock = el.classList.contains("pill-item") || el.classList.contains("dock-btn");
      if (isPillOrDock) el.classList.toggle("active", el.dataset.view === name);
    });
    if (name === "dashboard") renderDashboard();
    if (name === "chat") setTimeout(() => $("#chatInput")?.focus(), 300);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Attach nav to every [data-view] element (pills, dock buttons, hero CTAs)
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-view]");
    if (el) {
      setView(el.dataset.view);
      // Clear badge when visiting chat
      if (el.dataset.view === "chat") {
        const b = $("#chatBadge");
        if (b) b.style.display = "none";
      }
    }
  });

  /* ============================================
     THEME
     ============================================ */
  const root = document.documentElement;

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    localStorage.setItem("nova-theme", t);
    const cb = $("#darkModeSetting");
    if (cb) cb.checked = (t === "dark");
  }

  $("#themeToggle").addEventListener("click", () =>
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark")
  );
  $("#darkModeSetting").addEventListener("change", (e) =>
    applyTheme(e.target.checked ? "dark" : "light")
  );

  applyTheme(localStorage.getItem("nova-theme") || "dark");

  /* ============================================
     ACCENT COLOR
     ============================================ */
  const swatches = $$(".swatch");

  function applyAccent(hex) {
    root.style.setProperty("--accent", hex);
    root.style.setProperty("--accent-glow", hexAlpha(hex, 0.35));
    root.style.setProperty("--accent-dim", hexAlpha(hex, 0.14));
    localStorage.setItem("nova-accent", hex);
    swatches.forEach((s) => s.classList.toggle("active", s.dataset.color === hex));
  }

  function hexAlpha(hex, a) {
    const n = parseInt(hex.replace("#", ""), 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
  }

  swatches.forEach((s) => s.addEventListener("click", () => applyAccent(s.dataset.color)));

  const validAccents = swatches.map((s) => s.dataset.color);
  const savedAccent = localStorage.getItem("nova-accent");
  applyAccent(validAccents.includes(savedAccent) ? savedAccent : "#60a5fa");

  /* ============================================
     TOAST
     ============================================ */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* ============================================
     CHATBOT
     ============================================ */
  const messagesEl = $("#messages");
  const composer   = $("#composer");
  const chatInput  = $("#chatInput");

  const typingSpeeds = { "1": 1400, "2": 800, "3": 300 };

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function escHtml(s) {
    return s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function addMsg(text, who) {
    const d = document.createElement("div");
    d.className = "msg " + who;
    d.innerHTML = `
      <div class="mini-av">${who === "bot" ? "N" : "Me"}</div>
      <div>
        <div class="bubble">${escHtml(text)}</div>
        <span class="time">${nowTime()}</span>
      </div>`;
    messagesEl.appendChild(d);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return d;
  }

  function showTyping() {
    const d = document.createElement("div");
    d.className = "msg bot"; d.id = "typingMsg";
    d.innerHTML = `<div class="mini-av">N</div><div class="bubble"><div class="typing-bubble"><span></span><span></span><span></span></div></div>`;
    messagesEl.appendChild(d);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  const replies = {
    greeting: ["Hello! How can I help you today?", "Hey there! What's on your mind?"],
    tips: ["Here are 3 productivity tips:\n1) Time-block your day into deep-work slots.\n2) Tackle the hardest task first thing.\n3) Take a 5-min break every 50 minutes."],
    poem: ["Here's one for you:\nCode flows like a quiet stream,\nbugs dissolve in morning light —\nlogic builds the dreamer's dream,\nshipping features through the night."],
    recursion: ["Recursion is a function that calls itself on a smaller version of the problem until it reaches a base case it can solve directly — like peeling layers of an onion until there's nothing left to peel."],
    plan: ["A solid daily structure:\n• 8–11 AM → Deep focus work\n• 11–12 PM → Meetings & emails\n• 1–3 PM → Collaborative tasks\n• 3–4 PM → Admin & reviews\n• 4–5 PM → Plan tomorrow"],
    fallback: [
      "Great question! Here's how I'd approach that step by step.",
      "That's an interesting challenge — let me break it down for you.",
      "Happy to help with that. Here's a clear way to think about it.",
    ],
  };

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function genReply(text) {
    const t = text.toLowerCase();
    const tone = $("#toneSelect")?.value || "Friendly";
    let base;
    if (/\b(hi|hello|hey)\b/.test(t))          base = pick(replies.greeting);
    else if (/tip|productiv/.test(t))           base = pick(replies.tips);
    else if (/poem|poetry|verse/.test(t))       base = pick(replies.poem);
    else if (/recursion/.test(t))               base = pick(replies.recursion);
    else if (/plan.*day|schedule/.test(t))      base = pick(replies.plan);
    else                                         base = pick(replies.fallback);

    if (tone === "Concise")      base = base.split("\n")[0];
    if (tone === "Playful")      base += " 🎉";
    if (tone === "Professional") base = base.replace(/!+/g, ".");
    return base;
  }

  function botReply(text) {
    const speed = typingSpeeds[$("#speedRange")?.value || "2"];
    showTyping();
    setTimeout(() => {
      $("#typingMsg")?.remove();
      addMsg(genReply(text), "bot");
      if ($("#soundSetting")?.checked) beep();
    }, speed);
  }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 700; o.type = "sine";
      g.gain.setValueAtTime(0.07, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
      o.start(); o.stop(ctx.currentTime + 0.22);
    } catch (_) {}
  }

  composer.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    addMsg(text, "user");
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
    addMsg("Hi! I'm Nova — your AI assistant. Ask me anything or tap a suggestion below. ✦", "bot");
  }
  seedChat();

  /* ============================================
     DASHBOARD
     ============================================ */
  let dashReady = false;

  function renderDashboard() {
    if (dashReady) return;
    dashReady = true;
    animateKPIs();
    renderBars();
    renderDonut();
  }

  function animateKPIs() {
    $$(".kpi-val").forEach((el) => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || "";
      const t0 = performance.now();
      const dur = 1200;
      (function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
    });
  }

  const barData = [
    { d: "Mon", v: 310 }, { d: "Tue", v: 475 }, { d: "Wed", v: 420 },
    { d: "Thu", v: 610 }, { d: "Fri", v: 530 }, { d: "Sat", v: 285 }, { d: "Sun", v: 370 },
  ];

  function renderBars() {
    const chart = $("#barChart");
    chart.innerHTML = "";
    const max = Math.max(...barData.map((b) => b.v));
    barData.forEach((b) => {
      const bar = document.createElement("div");
      bar.className = "bar";
      bar.dataset.h = ((b.v / max) * 100).toFixed(1);
      bar.style.height = "0px";
      bar.innerHTML = `<span class="bar-val">${b.v}</span><span class="bar-label">${b.d}</span>`;
      chart.appendChild(bar);
    });
    requestAnimationFrame(() =>
      $$(".bar", chart).forEach((b) => (b.style.height = b.dataset.h + "%"))
    );
  }

  const topics = [
    { label: "General",  val: 38, color: "#60a5fa" },
    { label: "Coding",   val: 27, color: "#818cf8" },
    { label: "Writing",  val: 20, color: "#34d399" },
    { label: "Other",    val: 15, color: "#fb923c" },
  ];

  function renderDonut() {
    let acc = 0;
    const segs = topics.map((t) => {
      const s = acc; acc += t.val;
      return `${t.color} ${s}% ${acc}%`;
    }).join(", ");
    $("#donut").style.background = `conic-gradient(${segs})`;
    $("#donutLegend").innerHTML = topics
      .map((t) => `<li><span class="dot" style="background:${t.color}"></span>${t.label}<span class="leg-val">${t.val}%</span></li>`)
      .join("");
  }

  $("#rangeSelect").addEventListener("change", () => {
    barData.forEach((b) => (b.v = Math.round(b.v * (0.65 + Math.random() * 0.7))));
    renderBars();
    dashReady = false;
    animateKPIs();
    dashReady = true;
    toast("Dashboard refreshed");
  });

  /* ============================================
     HISTORY
     ============================================ */
  const historyData = [
    { icon: "💡", title: "Brainstorming app names", snippet: "Let's come up with catchy names for a fitness app…", time: "2h ago" },
    { icon: "🐍", title: "Python list comprehension", snippet: "How do I flatten a nested list in Python?", time: "Yesterday" },
    { icon: "✉️", title: "Drafting a follow-up email", snippet: "Write a polite reminder to a client about the invoice…", time: "Yesterday" },
    { icon: "📚", title: "Big-O notation explained", snippet: "Can you explain time complexity in simple terms?", time: "3 days ago" },
    { icon: "🍳", title: "Quick dinner recipes", snippet: "Give me a 20-minute weeknight pasta recipe…", time: "5 days ago" },
    { icon: "🧠", title: "Study plan for exams", snippet: "Help me build a 2-week revision schedule…", time: "1 week ago" },
  ];

  function renderHistory(filter = "") {
    const f = filter.toLowerCase();
    const list = $("#historyList");
    const items = historyData.filter(
      (h) => h.title.toLowerCase().includes(f) || h.snippet.toLowerCase().includes(f)
    );
    list.innerHTML = items.length
      ? items.map((h) => `
          <li class="history-item">
            <div class="h-icon">${h.icon}</div>
            <div class="h-body"><strong>${h.title}</strong><p>${h.snippet}</p></div>
            <span class="h-meta">${h.time}</span>
          </li>`).join("")
      : `<li class="history-item"><div class="h-body"><strong>No results</strong><p>Try a different search term.</p></div></li>`;

    $$(".history-item", list).forEach((el) =>
      el.addEventListener("click", () => { setView("chat"); toast("Conversation opened"); })
    );
  }

  $("#historySearch").addEventListener("input", (e) => renderHistory(e.target.value));
  renderHistory();

  /* ============================================
     SETTINGS
     ============================================ */
  $("#saveSettings").addEventListener("click", () => {
    localStorage.setItem("nova-tone",  $("#toneSelect").value);
    localStorage.setItem("nova-sound", $("#soundSetting").checked);
    localStorage.setItem("nova-speed", $("#speedRange").value);
    toast("Settings saved ✓");
  });

  $("#resetSettings").addEventListener("click", () => {
    $("#toneSelect").value   = "Friendly";
    $("#soundSetting").checked = true;
    $("#speedRange").value   = 2;
    applyAccent("#60a5fa");
    applyTheme("dark");
    toast("Reset to defaults");
  });

  // Restore saved settings on load
  const storedTone  = localStorage.getItem("nova-tone");
  const storedSound = localStorage.getItem("nova-sound");
  const storedSpeed = localStorage.getItem("nova-speed");
  if (storedTone)  $("#toneSelect").value    = storedTone;
  if (storedSound) $("#soundSetting").checked = storedSound === "true";
  if (storedSpeed) $("#speedRange").value     = storedSpeed;

})();
