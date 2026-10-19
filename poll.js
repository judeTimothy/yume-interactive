(() => {
  "use strict";

  /* ===== EDIT ME: question + options (change `id` to start a fresh poll) ===== */
  const POLL = {
    id: "charisma20-2026",
    question: "Charisma20 TTRPG Plans for 2026",
    subtitle: "No date yet. Select the events you would like to join. More will be added soon.",
    options: [
      "Arena one-shot (light story, hectic combat days)",
      "GMM Playtest #4",
      "Christmas one shot?",
      "Start of Main Campaign, Act 2"
    ]
  };

  /* Same Firebase project the GMM / D&D tools already use (public web config). */
  const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCY0tkVIUqGjO_6ayWJWLHNcRUpDls5VZ8",
    authDomain: "grace-might-and-magicks.firebaseapp.com",
    projectId: "grace-might-and-magicks",
    storageBucket: "grace-might-and-magicks.firebasestorage.app",
    messagingSenderId: "449279853302",
    appId: "1:449279853302:web:fdef6375c84605bcf5a2d7"
  };
  /* =========================================================================== */

  const COLORS = ["#d13b2f", "#00d8ff", "#ff3ea8", "#ffc46b", "#7c8cff", "#5ee7c8", "#b48cff", "#9be36b"];
  const LS_KEY = "yume_poll_" + POLL.id;
  const $ = (id) => document.getElementById(id);

  // Firebase is only used for this poll, under its own named app so it can't collide with anything else.
  const app = firebase.apps.find((a) => a.name === "yume-poll") || firebase.initializeApp(FIREBASE_CONFIG, "yume-poll");
  const db = app.firestore();
  const base = db.collection("polls").doc(POLL.id);
  const optCol = base.collection("options");
  const ccCol = base.collection("countries");

  const region = (() => { try { return new Intl.DisplayNames(["en"], { type: "region" }); } catch (e) { return null; } })();
  const countryName = (cc) => cc === "XX" ? "Unknown" : ((region && region.of(cc)) || cc);
  const flag = (cc) => cc === "XX" ? "🌐" : String.fromCodePoint(...[...cc].map((c) => 127397 + c.charCodeAt(0)));

  async function getCountry() {
    try {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 4000);
      const r = await fetch("https://api.country.is/", { signal: ctl.signal });
      clearTimeout(t);
      const j = await r.json();
      return /^[A-Z]{2}$/.test(j.country) ? j.country : "XX";
    } catch (e) { return "XX"; }
  }

  /* ---- ballot (multi-select + confirm) ---- */
  $("pollQ").textContent = POLL.question;
  $("pollHint").textContent = POLL.subtitle + " Press Confirm when you\u2019re done. One vote per browser; results appear after you vote.";
  $("year") && ($("year").textContent = new Date().getFullYear());
  const optsEl = $("pollOptions");
  const selected = new Set();

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.className = "btn btn-primary poll-confirm";
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Confirm vote";
  optsEl.after(confirmBtn);

  const updateConfirm = () => {
    confirmBtn.disabled = selected.size === 0;
    confirmBtn.textContent = selected.size ? `Confirm vote (${selected.size})` : "Confirm vote";
  };

  POLL.options.forEach((label, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "poll-opt";
    b.setAttribute("aria-pressed", "false");
    const d = document.createElement("span"); d.className = "poll-dot"; d.style.background = COLORS[i % COLORS.length];
    const t = document.createElement("span"); t.className = "poll-label"; t.textContent = label;
    const c = document.createElement("span"); c.className = "poll-check"; c.setAttribute("aria-hidden", "true");
    b.append(d, t, c);
    b.addEventListener("click", () => {
      const on = !selected.has(i);
      on ? selected.add(i) : selected.delete(i);
      b.classList.toggle("is-selected", on);
      b.setAttribute("aria-pressed", String(on));
      updateConfirm();
    });
    optsEl.appendChild(b);
  });

  const setDisabled = (v) => {
    optsEl.querySelectorAll("button").forEach((b) => (b.disabled = v));
    confirmBtn.disabled = v || selected.size === 0;
  };

  confirmBtn.addEventListener("click", vote);

  const getMine = () => {
    try {
      const v = JSON.parse(localStorage.getItem(LS_KEY));
      return Array.isArray(v) ? v : (Number.isInteger(v) ? [v] : []);
    } catch (e) { return []; }
  };

  async function vote() {
    if (localStorage.getItem(LS_KEY) !== null) return showResults();
    if (!selected.size) return;
    setDisabled(true);
    $("pollError").textContent = "";
    try {
      const cc = await getCountry();
      const inc = firebase.firestore.FieldValue.increment(1);
      const batch = db.batch();
      [...selected].forEach((i) => batch.set(optCol.doc("o" + i), { n: inc }, { merge: true }));
      batch.set(ccCol.doc(cc), { n: inc }, { merge: true });
      await batch.commit();
      localStorage.setItem(LS_KEY, JSON.stringify([...selected].sort((a, b) => a - b)));
      showResults();
    } catch (e) {
      setDisabled(false);
      $("pollError").textContent = "Couldn't record your vote. Please try again in a moment.";
    }
  }

  /* ---- results (subscribed only after the visitor has voted) ---- */
  let started = false, counts = {}, countries = {};

  function showResults() {
    const mine = getMine();
    optsEl.hidden = true;
    confirmBtn.hidden = true;
    $("pollHint").hidden = true;
    $("pollResults").hidden = false;
    $("pollMine").textContent = mine.map((i) => POLL.options[i]).filter(Boolean).join(", ");
    if (started) return;
    started = true;
    optCol.onSnapshot((s) => { counts = {}; s.forEach((d) => (counts[d.id] = d.data().n || 0)); render(); }, () => {});
    ccCol.onSnapshot((s) => { countries = {}; s.forEach((d) => (countries[d.id] = d.data().n || 0)); render(); }, () => {});
  }

  function render() {
    const mine = getMine();
    const vals = POLL.options.map((_, i) => counts["o" + i] || 0);
    const total = vals.reduce((a, b) => a + b, 0);
    const pct = vals.map((v) => (total ? (v / total) * 100 : 0));

    let acc = 0; const stops = [];
    pct.forEach((p, i) => { stops.push(`${COLORS[i % COLORS.length]} ${acc}% ${acc + p}%`); acc += p; });
    $("pollPie").style.background = total ? `conic-gradient(${stops.join(",")})` : "rgba(255,255,255,.1)";

    const lg = $("pollLegend"); lg.textContent = "";
    POLL.options.forEach((label, i) => {
      const li = document.createElement("li"); if (mine.includes(i)) li.className = "mine";
      const d = document.createElement("span"); d.className = "poll-dot"; d.style.background = COLORS[i % COLORS.length];
      const t = document.createElement("span"); t.textContent = label;
      const p = document.createElement("span"); p.className = "pct"; p.textContent = pct[i].toFixed(1) + "%";
      li.append(d, t, p); lg.appendChild(li);
    });

    const entries = Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const ctotal = Object.values(countries).reduce((a, b) => a + b, 0);
    const bars = $("pollBars"); bars.textContent = "";
    entries.forEach(([cc, n]) => {
      const share = (n / ctotal) * 100;
      const row = document.createElement("div"); row.className = "poll-bar";
      const nm = document.createElement("span"); nm.className = "name"; nm.textContent = flag(cc) + " " + countryName(cc);
      const tr = document.createElement("div"); tr.className = "poll-track";
      const f = document.createElement("div"); f.className = "poll-fill"; tr.appendChild(f);
      const v = document.createElement("span"); v.className = "v"; v.textContent = Math.round(share) + "%";
      row.append(nm, tr, v); bars.appendChild(row);
      requestAnimationFrame(() => (f.style.width = share + "%"));
    });
  }

  if (localStorage.getItem(LS_KEY) !== null) showResults();
})();
