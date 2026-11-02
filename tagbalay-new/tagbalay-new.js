(function () {
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  $("yr").textContent = new Date().getFullYear();

  /* Mobile menu (same behavior as the main site) */
  var tog = $("menuToggle"), panel = $("mobileNav");
  function closeNav() { document.body.classList.remove("nav-open"); tog.setAttribute("aria-expanded", "false"); }
  tog.addEventListener("click", function (e) {
    e.preventDefault(); e.stopPropagation();
    tog.setAttribute("aria-expanded", String(document.body.classList.toggle("nav-open")));
  });
  panel.addEventListener("click", function (e) { e.stopPropagation(); });
  document.addEventListener("click", function (e) {
    if (document.body.classList.contains("nav-open") && !panel.contains(e.target) && !tog.contains(e.target)) closeNav();
  });
  document.querySelectorAll('.site-nav a[href^="#"]').forEach(function (a) { a.addEventListener("click", closeNav); });

  /* Page-only download pop-out (desktop dropdown, mobile bottom sheet) */
  var gBtn = $("getBtn"), gBtnM = $("getBtnM"), gMenu = $("getMenu"), gOv = $("getOverlay");
  function gSet(open) {
    if (open && gBtn.offsetParent) {
      var r = gBtn.getBoundingClientRect();
      gMenu.style.setProperty("--tn-top", (r.bottom + 8) + "px");
      gMenu.style.setProperty("--tn-right", Math.max(8, innerWidth - r.right) + "px");
    }
    gMenu.classList.toggle("is-open", open); gOv.classList.toggle("is-open", open);
    gBtn.setAttribute("aria-expanded", String(open));
  }
  gBtn.addEventListener("click", function () { gSet(!gMenu.classList.contains("is-open")); });
  gBtnM.addEventListener("click", function () { closeNav(); gSet(true); });
  gOv.addEventListener("click", function () { gSet(false); });
  $("getClose").addEventListener("click", function () { gSet(false); });
  gMenu.addEventListener("click", function (e) { if (e.target.closest("a")) gSet(false); });

  /* Lightbox */
  var lb = $("lightbox"), lbImg = $("lbImg");
  function lbClose() { lb.classList.remove("is-open"); document.body.style.overflow = ""; }
  document.querySelectorAll(".tn-gallery button").forEach(function (b) {
    b.addEventListener("click", function () {
      lbImg.src = b.dataset.full; lbImg.alt = b.querySelector("img").alt;
      lb.classList.add("is-open"); document.body.style.overflow = "hidden";
    });
  });
  lb.addEventListener("click", function (e) { if (e.target !== lbImg) lbClose(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { lbClose(); closeNav(); gSet(false); }
  });

  /* Contact form (same Formspree endpoint as the main site) */
  var form = $("tnForm"), msg = $("tnMsg"), send = $("tnSend");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { msg.className = "tn-msg err"; msg.textContent = "Please fill in your name, e-mail, and message."; return; }
    send.disabled = true; msg.className = "tn-msg"; msg.textContent = "Sending...";
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw 0; msg.className = "tn-msg ok"; msg.textContent = "Message sent. Thank you!"; form.reset(); })
      .catch(function () { msg.className = "tn-msg err"; msg.textContent = "Couldn't send that. Please try again."; })
      .then(function () { send.disabled = false; });
  });

  /* Dust + fog (one canvas, lighter on phones, off for reduced motion, paused when hidden) */
  var cv = $("fx"), ctx = cv.getContext("2d");
  if (!reduce) {
    var W, H, dpr, dust = [], fog = [], on = true;
    var ND = touch ? 22 : 60, NF = touch ? 3 : 6;
    var size = function () {
      dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    size(); addEventListener("resize", size);
    for (var i = 0; i < ND; i++) dust.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(1, 4), vx: rnd(-.15, .15), vy: rnd(-.25, .05), a: rnd(.08, .3) });
    for (i = 0; i < NF; i++) fog.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(180, 380), vx: rnd(-.12, .12), vy: rnd(-.05, .05), a: rnd(.04, .09) });
    document.addEventListener("visibilitychange", function () { on = !document.hidden; if (on) frame(); });
    var frame = function () {
      if (!on) return;
      ctx.clearRect(0, 0, W, H);
      fog.forEach(function (f) {
        f.x += f.vx; f.y += f.vy;
        if (f.x < -f.r) f.x = W + f.r; if (f.x > W + f.r) f.x = -f.r;
        if (f.y < -f.r) f.y = H + f.r; if (f.y > H + f.r) f.y = -f.r;
        var g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        g.addColorStop(0, "rgba(190,70,60," + f.a + ")"); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);
      });
      dust.forEach(function (d) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0; if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.fillStyle = "rgba(170,170,170," + d.a + ")"; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      });
      requestAnimationFrame(frame);
    };
    frame();
  }

  /* Music: desktop autoplay once the browser allows it; never autoplays on phones/tablets */
  var audio = $("tbMusic"), mb = $("tbMusicBtn");
  if (!audio || !mb) return;
  var TARGET = .5, KEY = "tbMusic", userOff = false, wasPlaying = false, ft = null, waiting = false;
  try { userOff = localStorage.getItem(KEY) === "off"; } catch (e) {}
  var save = function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} };
  function ui(p) {
    mb.classList.toggle("is-playing", p); mb.setAttribute("aria-pressed", String(p));
    mb.setAttribute("aria-label", p ? "Turn music off" : "Turn music on"); mb.classList.toggle("is-hint", !p && !userOff);
  }
  function fade(v, ms, done) {
    clearInterval(ft); var from = audio.volume, n = Math.max(1, Math.round(ms / 50)), i = 0;
    ft = setInterval(function () { i++; audio.volume = Math.min(1, Math.max(0, from + (v - from) * i / n)); if (i >= n) { clearInterval(ft); if (done) done(); } }, 50);
  }
  function play() {
    audio.volume = 0; var p = audio.play();
    if (p && p.then) p.then(function () { fade(TARGET, 1800); ui(true); stopWait(); }).catch(function () { ui(false); });
  }
  function gesture(e) { if (!mb.contains(e.target) && !userOff) play(); }
  function startWait() { if (waiting) return; waiting = true; document.addEventListener("pointerdown", gesture); document.addEventListener("keydown", gesture); }
  function stopWait() { waiting = false; document.removeEventListener("pointerdown", gesture); document.removeEventListener("keydown", gesture); }
  mb.addEventListener("click", function () {
    stopWait();
    if (audio.paused) { userOff = false; save("on"); play(); } else { userOff = true; save("off"); fade(0, 500, function () { audio.pause(); }); ui(false); }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !audio.paused) { wasPlaying = true; audio.pause(); }
    else if (!document.hidden && wasPlaying && !userOff) { wasPlaying = false; audio.play().catch(function () {}); }
  });
  var failed = 0, n = audio.querySelectorAll("source").length;
  audio.addEventListener("error", function () { if (++failed >= n) mb.hidden = true; }, true);
  function ready() { if (!mb.hidden) return; mb.hidden = false; ui(false); if (!touch && !userOff) { play(); startWait(); } }
  if (audio.readyState >= 1) ready(); else audio.addEventListener("loadedmetadata", ready, { once: true });
})();
