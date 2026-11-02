/* Mobile menu — same behavior as the main site's main.js */
(function () {
  var toggle = document.getElementById("menuToggle");
  var panel = document.getElementById("mobileNav");
  if (!toggle || !panel) return;
  function closeNav() {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function (e) {
    e.preventDefault(); e.stopPropagation();
    var open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  panel.addEventListener("click", function (e) { e.stopPropagation(); });
  document.addEventListener("click", function (e) {
    if (!document.body.classList.contains("nav-open")) return;
    if (panel.contains(e.target) || toggle.contains(e.target)) return;
    closeNav();
  });
  document.querySelectorAll('.site-nav a[href^="#"]').forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
})();

/* Background music: autoplay on desktop (once the browser allows it), never on phones/tablets */
(function () {
  var audio = document.getElementById("tbMusic");
  var btn = document.getElementById("tbMusicBtn");
  if (!audio || !btn) return;

  var TARGET = 0.5, KEY = "tbMusic";
  var isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  var userOff = false, resumeAfterHidden = false, fadeTimer = null, waiting = false;

  try { userOff = localStorage.getItem(KEY) === "off"; } catch (e) {}
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function setUI(playing) {
    btn.classList.toggle("is-playing", playing);
    btn.setAttribute("aria-pressed", String(playing));
    btn.setAttribute("aria-label", playing ? "Turn music off" : "Turn music on");
    btn.classList.toggle("is-hint", !playing && !userOff);
  }
  function fadeTo(v, ms, done) {
    clearInterval(fadeTimer);
    var from = audio.volume, steps = Math.max(1, Math.round(ms / 50)), i = 0;
    fadeTimer = setInterval(function () {
      i++; audio.volume = Math.min(1, Math.max(0, from + (v - from) * (i / steps)));
      if (i >= steps) { clearInterval(fadeTimer); if (done) done(); }
    }, 50);
  }
  function play() {
    audio.volume = 0;
    var p = audio.play();
    if (p && p.then) {
      p.then(function () { fadeTo(TARGET, 1800); setUI(true); stopWaiting(); })
       .catch(function () { setUI(false); });
    } else { fadeTo(TARGET, 1800); setUI(true); }
  }
  function pause() { fadeTo(0, 500, function () { audio.pause(); }); setUI(false); }

  function onGesture(e) {
    if (btn.contains(e.target) || userOff) return;
    play();
  }
  function startWaiting() {
    if (waiting) return; waiting = true;
    document.addEventListener("pointerdown", onGesture);
    document.addEventListener("keydown", onGesture);
  }
  function stopWaiting() {
    waiting = false;
    document.removeEventListener("pointerdown", onGesture);
    document.removeEventListener("keydown", onGesture);
  }

  btn.addEventListener("click", function () {
    stopWaiting();
    if (audio.paused) { userOff = false; save("on"); play(); }
    else { userOff = true; save("off"); pause(); }
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && !audio.paused) { resumeAfterHidden = true; audio.pause(); }
    else if (!document.hidden && resumeAfterHidden && !userOff) { resumeAfterHidden = false; audio.play().catch(function () {}); }
  });

  /* Reveal the button only when the audio actually loads; hide it if both files fail */
  var failed = 0, sources = audio.querySelectorAll("source");
  audio.addEventListener("error", function () {
    failed++; if (failed >= sources.length) btn.hidden = true;
  }, true);
  function ready() {
    if (!btn.hidden) return;
    btn.hidden = false; setUI(false);
    if (!isTouch && !userOff) { play(); startWaiting(); }
  }
  if (audio.readyState >= 1) ready(); else audio.addEventListener("loadedmetadata", ready, { once: true });
})();
