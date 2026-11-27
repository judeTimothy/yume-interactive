(function () {
  const NAV = [
    { label: "Home", href: "index.html" },
    { label: "Classes", href: "classes.html" },
    { label: "Play in Ossyra", children: [
      { label: "Choose Perks", href: "act2-perk-page.html" },
      { label: "Party View", href: "act2-perk-page.html#party" }
    ]},
    { label: "Rules", href: "rules.html" },               // PDF viewer page (to be built)
    { label: "Community", children: [
      { label: "Discord", href: "https://discord.gg/8xtDXPtE42" },
      { label: "Facebook", href: "https://www.facebook.com/charisma20dnd" }
    ]},
    { label: "Other Tools", children: [
      { label: "GMM Character Generator", href: "https://yume-interactive.site/charisma20/gmm/character-generator.html" },
      { label: "GMM Campaign Tracker", href: "https://yume-interactive.site/charisma20/gmm/campaign-tracker.html" }
    ]},
  ];

  const css = `
.oh{position:relative;z-index:50;background:#0c0a0a;border-bottom:2px solid var(--red,#c53131);font-family:'Roboto Condensed',sans-serif}
.oh-in{display:flex;align-items:center;gap:8px;padding:10px 16px;min-height:56px}
.oh-title{font:800 1.15rem var(--font-head,'Cinzel',serif);letter-spacing:.04em;color:var(--ink,#ece6df);margin:0 12px 0 0;white-space:nowrap}
.oh-nav{display:flex;align-items:center;gap:2px}
.oh-link{display:block;background:none;border:0;border-bottom:2px solid transparent;font:700 .8rem 'Roboto Condensed',sans-serif;text-transform:uppercase;letter-spacing:.08em;color:var(--mute,#9b918a);padding:10px 12px;cursor:pointer;text-decoration:none;white-space:nowrap}
.oh-link:hover,.oh-link:focus-visible{color:var(--ink,#ece6df)}
.oh-link.on{color:var(--gold,#d8a94a);border-bottom-color:var(--red,#c53131)}
.oh-dd{position:relative}
.oh-menu{display:none;position:absolute;top:100%;left:0;min-width:180px;background:var(--panel,#1d1a19);border:1px solid var(--line,#3a3331);border-top:2px solid var(--red,#c53131);border-radius:0 0 6px 6px;padding:4px 0;box-shadow:0 8px 20px rgba(0,0,0,.5)}
.oh-menu .oh-link{border:0;padding:10px 16px}
.oh-dd.open .oh-menu{display:block}
@media(hover:hover) and (min-width:761px){.oh-dd:hover .oh-menu{display:block}}
.oh-slot{margin-left:auto;display:flex;gap:8px;align-items:center}
.oh-auth{display:flex;align-items:center;gap:8px;visibility:hidden}
.oh-auth.on{visibility:visible}
.oh-auth .who{font:700 .75rem 'Roboto Condensed',sans-serif;letter-spacing:.06em;color:var(--mute,#9b918a);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.oh-btn{background:var(--red,#c53131);border:1px solid var(--red,#c53131);color:#fff;border-radius:4px;padding:7px 12px;font:700 .75rem 'Roboto Condensed',sans-serif;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}
.oh-btn.ghost{background:transparent;border-color:var(--line,#3a3331);color:var(--mute,#9b918a)}
@media(max-width:760px){.oh-auth .who{display:none}}
.oh-burger{display:none;background:none;border:1px solid var(--line,#3a3331);border-radius:4px;padding:8px;cursor:pointer;color:var(--ink,#ece6df);line-height:0}
@media(max-width:760px){
 .oh-burger{display:block}
 .oh-nav{display:none;position:absolute;top:100%;left:0;right:0;flex-direction:column;align-items:stretch;gap:0;background:#0c0a0a;border-bottom:2px solid var(--red,#c53131);padding:6px 0;box-shadow:0 10px 20px rgba(0,0,0,.5)}
 .oh.open .oh-nav{display:flex}
 .oh-link{padding:14px 20px;text-align:left;width:100%}
 .oh-link.on{border-bottom-color:transparent;border-left:3px solid var(--red,#c53131)}
 .oh-menu{position:static;box-shadow:none;border:0;border-left:1px solid var(--line,#3a3331);margin-left:20px;background:transparent}
}`;

  const here = location.pathname.split("/").pop() || "index.html";
  const hash = location.hash;
  const flat = NAV.flatMap(n => n.children || [n]);
  const hashes = flat.map(n => n.href.split("#")[1]).filter(Boolean).map(h => "#" + h);
  const isOn = n => {
    const [p, h] = n.href.split("#");
    return p.split("?")[0] === here && (h ? hash === "#" + h : !hashes.includes(hash));
  };
  const link = n => `<a class="oh-link${isOn(n) ? " on" : ""}" href="${n.href}">${n.label}</a>`;
  const item = n => n.children
    ? `<div class="oh-dd"><button type="button" class="oh-link" aria-haspopup="true" aria-expanded="false">${n.label} <span aria-hidden="true">▾</span></button><div class="oh-menu">${n.children.map(link).join("")}</div></div>`
    : link(n);

  const me = document.currentScript;
  const title = (me && me.dataset.title) || "Ossyra";
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
  me.insertAdjacentHTML("beforebegin", `
<header class="oh"><div class="oh-in">
  <h1 class="oh-title">${title}</h1>
  <nav class="oh-nav" id="ohNav" aria-label="Main">${NAV.map(item).join("")}</nav>
  <div class="oh-slot" id="headerSlot"></div>
  <div class="oh-auth" id="ohAuth"></div>
  <button type="button" class="oh-burger" id="ohBurger" aria-label="Menu" aria-expanded="false" aria-controls="ohNav">
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h16M3 11h16M3 16h16"/></svg>
  </button>
</div></header>`);

  const hdr = document.querySelector(".oh"), burger = document.getElementById("ohBurger");
  const closeDds = except => hdr.querySelectorAll(".oh-dd.open").forEach(d => {
    if (d !== except) { d.classList.remove("open"); d.firstElementChild.setAttribute("aria-expanded", "false"); }
  });
  burger.addEventListener("click", () => {
    const open = hdr.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  hdr.querySelectorAll(".oh-dd > button").forEach(b => b.addEventListener("click", e => {
    e.stopPropagation();
    const d = b.parentElement, open = d.classList.toggle("open");
    b.setAttribute("aria-expanded", open);
    closeDds(d);
  }));
  document.addEventListener("click", e => { if (!hdr.contains(e.target)) { closeDds(); hdr.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeDds(); hdr.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } });
  // ---- shared login (uses c20-auth.js next to this file) ----
  const authBox = document.getElementById("ohAuth");
  import(new URL("c20-auth.js", me.src).href).then(m => {
    const render = u => {
      authBox.innerHTML = m.isReal(u)
        ? `<span class="who">${(u.displayName || u.email || "Signed in").replace(/[<>&"]/g, "")}</span><button type="button" class="oh-btn ghost">Sign out</button>`
        : `<button type="button" class="oh-btn">Sign in</button>`;
      authBox.classList.add("on");
      authBox.querySelector("button").onclick = () => (m.isReal(u) ? m.logout() : m.login()).catch(e => { if (e.code !== "auth/popup-closed-by-user") alert(e.message); });
    };
    m.onAuthStateChanged(m.auth, render);
  }).catch(e => console.warn("Login module not loaded:", e));
})();
