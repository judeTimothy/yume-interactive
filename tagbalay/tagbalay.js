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
