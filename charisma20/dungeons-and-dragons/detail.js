(function(){
const P=window.C20_PAGE,$=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const C=P.kind==="class",dir=C?"classes":"species",lbl=C?"Classes":"Species",n=esc(P.name);
document.title=P.name+" | Charisma20";
const img=P.image||`../images/${dir}/${P.slug}.png`;
const norm=a=>(a||[]).filter(Boolean).map(f=>Array.isArray(f)?{level:f[0],name:f[1],html:f[2]}:f);
const feats=norm(P.features);
// Features with these names appear in the level table but not in the detailed list below it
const HIDE_BELOW=["Ability Score Improvement","Subclass Feature"];
const KEEP_FIRST=["Ability Score Improvement"];
// Plain-text descriptions are wrapped in <p> automatically; text starting with a tag is used as-is
const body=h=>!h?'<p class="todo">Description coming soon.</p>':(/^\s*</.test(h)?h:`<p>${h}</p>`);
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-");

let d=`<img class="art" src="${esc(img)}" alt="${n}" onerror="this.remove()">`+(P.intro||[]).map(p=>`<p>${p}</p>`).join("");
if(!C){
 d+=`<h2 id="traits">${n} Traits</h2><p>${(P.stats||[]).map(([k,v])=>`<b>${esc(k)}:</b> ${esc(v)}`).join("<br>")}</p><p>As a ${n}, you have these special traits.</p>`;
 d+=feats.map((f,i)=>`<h4 id="f${i}">${esc(f.name)}</h4>${body(f.html)}`).join("");
}else{
 d+=`<h2 id="core">Core ${n} Traits</h2><div class="tw"><table><tbody>${(P.core||[]).map(([k,v])=>`<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table></div>`;
 let rows="";
 for(let L=1;L<=20;L++){const f=feats.filter(x=>x.level===L).map(x=>esc(x.name)).join(", ")||"&mdash;";rows+=`<tr><td>${L}</td><td>+${2+Math.floor((L-1)/4)}</td><td>${f}</td></tr>`}
 d+=`<h2 id="table">${n} Features Table</h2><div class="tw"><table><thead><tr><th>Level</th><th>Proficiency Bonus</th><th>Class Features</th></tr></thead><tbody>${rows}</tbody></table></div>`;
 d+=`<h2 id="features">${n} Class Features</h2>`+feats.filter((f,i)=>!HIDE_BELOW.includes(f.name)||(KEEP_FIRST.includes(f.name)&&feats.findIndex(x=>x.name===f.name)===i)).map((f,i)=>`<h4 id="f${i}">Level ${f.level}: ${esc(f.name)}</h4>${body(f.html)}`).join("");
 // Subclasses: one section per entry in P.subclasses (each gets its own tracker link)
 d+=(P.subclasses||[]).map((s,si)=>`<h2 id="sub-${slug(s.slug||s.name)}">${esc(s.name)} Subclass</h2>`
  +(s.label?`<p class="sublabel">${esc(s.label)}</p>`:"")
  +(s.intro||[]).map(p=>`<p>${p}</p>`).join("")
  +norm(s.features).map((f,i)=>`<h4 id="s${si}f${i}">Level ${f.level}: ${esc(f.name)}</h4>${body(f.html)}`).join("")).join("");
}
if(P.source)d+=`<div class="src">${esc(P.source)}</div>`;

$("#app").innerHTML=`<main class="wrap" style="--c:${esc(P.color)}">
 <div class="crumbs"><a href="../../charisma20-home.html">Home</a><span>/</span><a href="../${dir}.html#${esc(P.slug)}">${lbl}</a><span>/</span>${n}</div>
 <div class="title"><h1>${n}</h1><p>${C?"Class":"Species"} Details</p></div>
 <div class="layout"><nav class="toc" aria-label="Chapters"><h5>Chapters</h5></nav><article class="doc">${d}</article></div></main><footer>Charisma20</footer>`;

// chapter tracker: built from headings, highlights the section being read
const toc=$(".toc"),hs=[...document.querySelectorAll(".doc h2")];
hs.forEach(h=>{const a=document.createElement("a");a.href="#"+h.id;a.dataset.t=h.id;a.textContent=h.textContent;if(h.tagName==="H4")a.className="sub";toc.appendChild(a)});
const links=[...toc.querySelectorAll("a")];let cur;
function spy(){
 let id=hs[0].id;for(const h of hs){if(h.getBoundingClientRect().top<=120)id=h.id;else break}
 if(id===cur)return;cur=id;
 const fx=getComputedStyle(toc).display==="flex";
 links.forEach(a=>{const on=a.dataset.t===id;a.classList.toggle("on",on);
  if(on){if(fx)toc.scrollLeft=a.offsetLeft-24;else toc.scrollTop=a.offsetTop-toc.clientHeight/2}});
}
addEventListener("scroll",spy,{passive:true});addEventListener("resize",()=>{cur=null;spy()});spy();
})();
