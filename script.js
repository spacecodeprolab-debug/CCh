(() => {
const $ = s => document.querySelector(s), inr = n => "₹" + n;
const slug = s => s.toLowerCase().replace(/[^a-z]+/g, "-");
let cart = []; try { cart = JSON.parse(localStorage.getItem("cch-cart")) || []; } catch (e) {}
const save = () => { try { localStorage.setItem("cch-cart", JSON.stringify(cart)); } catch (e) {} };
const flags = {v: false, s: false, b: false};
const items = MENU.flatMap(([c, , l]) => l.map(([n, p, note = "", f = "", img]) => ({c, n, p, note, f, img, sizes: Array.isArray(p) ? p : null, from: Array.isArray(p) ? p[0][1] : p})));

const ICONS = {
 burger:'<svg viewBox="0 0 64 64" fill="currentColor"><path d="M8 28a24 19 0 0 1 48 0z"/><circle cx="22" cy="17" r="1.6" fill="#F5C518"/><circle cx="34" cy="13" r="1.6" fill="#F5C518"/><circle cx="42" cy="20" r="1.6" fill="#F5C518"/><path d="M6 32q6 6 13 0t13 0 13 0 13 0v3H6z"/><rect x="8" y="37" width="48" height="7" rx="3.5"/><path d="M8 47h48v2a7 7 0 0 1-7 7H15a7 7 0 0 1-7-7z"/></svg>',
 fries:'<svg viewBox="0 0 64 64" fill="currentColor"><rect x="17" y="6" width="6" height="28" rx="3"/><rect x="26" y="3" width="6" height="30" rx="3"/><rect x="35" y="7" width="6" height="27" rx="3"/><rect x="43" y="10" width="6" height="24" rx="3"/><path d="M12 28h40l-5 32H17z"/></svg>',
 leg:'<svg viewBox="0 0 64 64" fill="currentColor"><path d="M40 6c10 0 18 8 16 18-1 8-8 14-16 14-3 0-6-1-8-2L20 48l-5-1-1-5 12-12c-1-2-2-5-2-8C24 14 31 6 40 6z"/><circle cx="12" cy="52" r="5"/><circle cx="19" cy="57" r="5"/></svg>',
 pizza:'<svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 60 6 18a44 44 0 0 1 52 0z"/><circle cx="26" cy="26" r="4" fill="#F5C518"/><circle cx="40" cy="24" r="3.5" fill="#F5C518"/><circle cx="33" cy="38" r="3.5" fill="#F5C518"/></svg>',
 wrap:'<svg viewBox="0 0 64 64" fill="currentColor"><path d="M10 22 44 8l12 20-30 28z"/><path d="M14 18c8-8 18-8 26-4l-6 6z" fill="#F5C518"/><path d="M36 20l18 8" stroke="#F5C518" stroke-width="3" fill="none"/></svg>',
 bowl:'<svg viewBox="0 0 64 64" fill="currentColor"><path d="M6 30h52c0 14-10 24-26 24S6 44 6 30z"/><path d="M22 8q-4 6 0 10M32 5q-4 7 0 12M42 8q-4 6 0 10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>'};
ICONS.flame='<svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 4c2 10 14 16 14 32a14 14 0 0 1-28 0c0-8 4-12 8-16 0 6 3 8 5 8-2-8-1-16 1-24z"/></svg>';
ICONS.chili='<svg viewBox="0 0 64 64" fill="currentColor"><path d="M46 12C44 30 34 48 12 54c20 4 42-6 42-30 0-6-3-10-8-12z"/><path d="M46 12c0-5 3-8 8-8" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
ICONS.leaf='<svg viewBox="0 0 64 64" fill="currentColor"><path d="M8 54C8 24 24 8 56 8c0 30-16 46-48 46z"/><path d="M12 52 40 24" stroke="#F5C518" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>';
ICONS.grid='<svg viewBox="0 0 64 64" fill="currentColor"><rect x="6" y="6" width="23" height="23" rx="7"/><rect x="35" y="6" width="23" height="23" rx="7"/><rect x="6" y="35" width="23" height="23" rx="7"/><rect x="35" y="35" width="23" height="23" rx="7"/></svg>';
const ICON_OF = {"Shawarma":"wrap","Burgers":"burger","Wraps":"wrap","Pizza":"pizza","Fries":"fries","Tacos & Pockets":"wrap","Chicken & Popcorn":"leg","Baked Bowls":"bowl"};
document.querySelectorAll("[data-ico]").forEach(e => e.innerHTML = ICONS[e.dataset.ico]);

// footer
$("#branches").innerHTML = CONFIG.branches.map(b => `<div><b>${b.name}</b><span>${b.addr}</span><span class="lk"><a href="tel:+${b.wa}">Call ${b.wa.slice(2, 7)} ${b.wa.slice(7)}</a><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Chicken Craving Hub " + b.addr)}" target="_blank" rel="noopener">Get directions</a></span></div>`).join("");
let branch = -1; try { const sv = localStorage.getItem("cch-branch2"); branch = sv === null ? -1 : +sv; if (!(branch >= 0 && branch < CONFIG.branches.length)) branch = -1; } catch (e) {}
let noteVal = "";
$("#owners").innerHTML = "Owners: " + CONFIG.owners.map(o => `<a href="https://instagram.com/${o}" target="_blank" rel="noopener">@${o}</a>`).join(" · ");

// render menu
const dot = f => `<span class="dot ${f.includes("v") ? "v" : ""}" title="${f.includes("v") ? "Veg" : "Non-veg"}"></span>`;
function render() {
  const q = $("#q").value.trim().toLowerCase(); let any = false;
  $("#list").innerHTML = MENU.map(([c, sub]) => {
    const rows = items.filter(i => i.c === c && i.n.toLowerCase().includes(q) && Object.keys(flags).every(k => !flags[k] || i.f.includes(k)));
    if (!rows.length) return ""; any = true;
    return `<section class="cat" id="${slug(c)}" data-c="${c}"><h2>${c}</h2><p>${sub}</p><div class="grid">${rows.map(i => `
      <button class="item rv" data-i="${items.indexOf(i)}">${i.img ? `<img src="${i.img}" alt="" loading="lazy" width="400" height="300">` : `<span class="ic">${ICONS[ICON_OF[i.c]]}</span>`}
      ${i.f.includes("b") ? `<span class="tag">Best seller</span>` : ""}<b>${dot(i.f)}${i.n}</b>${i.note ? `<small>${i.note}</small>` : ""}
      <span class="foot"><span class="price">${i.sizes ? "<em>from </em>" : ""}${inr(i.from)}</span><span class="plus">+</span></span></button>`).join("")}</div></section>`;
  }).join("");
  $("#none").hidden = any; watch();
}
$("#cats").innerHTML = MENU.map(([c]) => `<a href="#${slug(c)}">${c}</a>`).join("");
$("#q").addEventListener("input", render);

// craving tiles
const TILES = [["all", "Everything", "grid"], ["b", "Best sellers", "flame"], ["s", "Spicy", "chili"], ["v", "Veg", "leaf"]];
$("#tiles").innerHTML = TILES.map(([k, l, ic]) => `<button class="tile ${k === "all" ? "on" : ""}" data-k="${k}"><span class="ti">${ICONS[ic]}</span><span><b>${l}</b><small>${k === "all" ? items.length : items.filter(i => i.f.includes(k)).length} items</small></span></button>`).join("");
function pick(k) { Object.keys(flags).forEach(x => flags[x] = x === k); document.querySelectorAll(".tile").forEach(t => t.classList.toggle("on", t.dataset.k === k || (k === "all" && t.dataset.k === "all"))); render(); }
$("#tiles").addEventListener("click", e => { const t = e.target.closest(".tile"); if (t) pick(t.dataset.k); });
document.querySelectorAll("[data-pick]").forEach(a => a.addEventListener("click", () => pick(a.dataset.pick)));
// ribbons
const rib = (el, w) => { const h = Array(3).fill(w.map(t => `<span>${t}</span>`).join("")).join(""); el.innerHTML = h + h; };
rib($("#rb1"), ["Crispy", "Cheesy", "Crazy good"]); rib($("#rb2"), ["Made fresh to order", "4 branches in Ahmedabad", "Order on WhatsApp"]);

// reveal on scroll + category spy
const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))), {rootMargin: "0px 0px -8% 0px"});
const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) {
  document.querySelectorAll(".bar a").forEach(a => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  const on = $(".bar a.on"), c = $("#cats"); on && c.scrollTo({left: on.offsetLeft - c.clientWidth / 2 + on.offsetWidth / 2, behavior: "smooth"}); } }), {rootMargin: "-30% 0px -65% 0px"});
function watch() { document.querySelectorAll(".rv").forEach(el => io.observe(el)); document.querySelectorAll(".cat").forEach(el => spy.observe(el)); }

// overlays
const scrim = $("#scrim");
let hideT;
function open(el) { clearTimeout(hideT); scrim.hidden = el.hidden = false; requestAnimationFrame(() => { scrim.classList.add("show"); el.classList.add("show"); }); document.body.style.overflow = "hidden"; }
function closeAll() { scrim.classList.remove("show"); ["#sheet", "#drawer"].forEach(s => $(s).classList.remove("show")); document.body.style.overflow = "";
  hideT = setTimeout(() => { scrim.hidden = $("#sheet").hidden = $("#drawer").hidden = true; }, 450); }
scrim.onclick = closeAll; addEventListener("keydown", e => e.key === "Escape" && closeAll());

// item sheet
$("#list").addEventListener("click", e => { const b = e.target.closest(".item"); if (b) openItem(items[b.dataset.i]); });
function openItem(i) {
  let qty = 1; const sh = $("#sheet");
  sh.innerHTML = `<button class="x" aria-label="Close">×</button><h3>${i.n}</h3>${i.note ? `<small>${i.note}</small>` : ""}
  <div class="opts">${i.sizes ? i.sizes.map(([l, p], k) => `<label class="opt"><span><input type="radio" name="sz" value="${k}" ${k ? "" : "checked"}>${l}</span>${inr(p)}</label>`).join("") : ""}
  ${CONFIG.addons.map(([l, p], k) => `<label class="opt"><span><input type="checkbox" name="ad" value="${k}">${l}</span>+${inr(p)}</label>`).join("")}</div>
  <div class="row"><div class="qty"><button aria-label="Less">−</button><span>1</span><button aria-label="More">+</button></div><b id="tot"></b></div>
  <button class="btn full" id="add">Add to order</button>`;
  const calc = () => { const z = sh.querySelector("[name=sz]:checked"), ads = [...sh.querySelectorAll("[name=ad]:checked")].map(a => CONFIG.addons[a.value]);
    return {size: z ? i.sizes[z.value][0] : "", ads: ads.map(a => a[0]), unit: (z ? i.sizes[z.value][1] : i.from) + ads.reduce((s, a) => s + a[1], 0)}; };
  const upd = () => { $("#tot").textContent = inr(calc().unit * qty); sh.querySelector(".qty span").textContent = qty; };
  sh.onchange = upd; upd();
  const [lo, hi] = sh.querySelectorAll(".qty button");
  lo.onclick = () => { qty = Math.max(1, qty - 1); upd(); }; hi.onclick = () => { qty++; upd(); };
  sh.querySelector(".x").onclick = closeAll;
  $("#add").onclick = () => { const c = calc(), key = [i.n, c.size, c.ads.join()].join("|"), ex = cart.find(x => x.key === key);
    ex ? ex.qty += qty : cart.push({key, n: i.n, size: c.size, ads: c.ads, unit: c.unit, qty});
    save(); fly($("#add")); closeAll(); bar(true); };
  open(sh);
}

// cart bar + drawer
const count = () => cart.reduce((s, x) => s + x.qty, 0), total = () => cart.reduce((s, x) => s + x.qty * x.unit, 0);
function bar(pop) { document.body.classList.toggle("hascart", count() > 0); $("#nc").textContent = count(); if (pop) { const o = $("#ordbtn"); o.classList.remove("pop"); void o.offsetWidth; o.classList.add("pop"); } const b = $("#cartbar"); $("#cc").textContent = count() + (count() === 1 ? " item" : " items"); $("#ct").textContent = "View order · " + inr(total());
  if (count()) { b.hidden = false; requestAnimationFrame(() => b.classList.add("show")); } else { b.classList.remove("show"); }
  if (pop) { b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop"); } }
$("#cartbar").onclick = openCart;
function openCart() {
  const d = $("#drawer");
  d.innerHTML = `<button class="x" aria-label="Close">×</button><h3>Your order</h3><div style="flex:1;overflow:auto">${cart.map((x, k) => `
    <div class="ci row"><div><b>${x.n}</b><small>${[x.size, ...x.ads].filter(Boolean).join(", ")}</small><small>${inr(x.unit)} each</small></div>
    <div class="qty" data-k="${k}"><button aria-label="Less">−</button><span>${x.qty}</span><button aria-label="More">+</button></div></div>`).join("")}</div>
  <div class="br"><b>Pick your branch</b><div class="opts">${CONFIG.branches.map((b, k) => `<label class="opt"><span><input type="radio" name="br" value="${k}" ${k === branch ? "checked" : ""}>${b.name}<small>${b.area}</small></span></label>`).join("")}</div></div>
  <textarea id="note" rows="2" placeholder="Add a note for the kitchen (optional)">${noteVal}</textarea>
  <div class="row"><span>Subtotal</span><b>${inr(total())}</b></div>
  <button class="btn full" id="send" ${branch < 0 ? "disabled" : ""}>${branch < 0 ? "Pick a branch to order" : "Send order to " + CONFIG.branches[branch].name}</button>`;
  d.querySelector(".x").onclick = closeAll;
  $("#note").oninput = e => noteVal = e.target.value;
  d.querySelectorAll("[name=br]").forEach(r => r.onchange = () => { branch = +r.value; try { localStorage.setItem("cch-branch2", branch); } catch (e) {}
    const sb = $("#send"); sb.disabled = false; sb.textContent = "Send order to " + CONFIG.branches[branch].name; });
  d.querySelectorAll(".qty").forEach(q => { const k = q.dataset.k, [lo, hi] = q.querySelectorAll("button");
    lo.onclick = () => { cart[k].qty--; if (!cart[k].qty) cart.splice(k, 1); change(); }; hi.onclick = () => { cart[k].qty++; change(); }; });
  const change = () => { save(); bar(); if (!cart.length) return closeAll(); const s = d.scrollTop; openCart(); d.scrollTop = s; };
  $("#send").onclick = () => { const note = $("#note").value.trim();
    const b = CONFIG.branches[branch], msg = `*New order · ${CONFIG.brand}*\n*Branch: ${b.name}*\n\n` + cart.map(x => `${x.qty} x ${x.n}${[x.size, ...x.ads].filter(Boolean).length ? " (" + [x.size, ...x.ads].filter(Boolean).join(", ") + ")" : ""} - ${inr(x.qty * x.unit)}`).join("\n") + `\n\n*Total: ${inr(total())}*` + (note ? `\nNote: ${note}` : "");
    open_wa(msg, b.wa || CONFIG.whatsapp); };
  if (d.hidden) open(d);
}
function fly(from) { const a = from.getBoundingClientRect(), d = document.createElement("div"); d.className = "fly"; document.body.append(d);
  const tx = innerWidth / 2 - a.left - a.width / 2, ty = innerHeight - 50 - a.top;
  d.animate([{transform: "translate(" + (a.left + a.width / 2) + "px," + a.top + "px) scale(1)", offset: 0}, {transform: "translate(" + (a.left + a.width / 2 + tx / 2) + "px," + (a.top - 90) + "px) scale(1.3)", offset: .45}, {transform: "translate(" + (innerWidth / 2) + "px," + (innerHeight - 50) + "px) scale(.4)", opacity: .4}], {duration: 750, easing: "cubic-bezier(.5,0,.7,.4)"}).onfinish = () => d.remove();
  d.style.left = d.style.top = "0"; }
const open_wa = (m, num) => window.open(`https://wa.me/${num}?text=${encodeURIComponent(m)}`, "_blank", "noopener");
const links = $("#links"), tog = $("#tog");
tog.onclick = () => { const o = links.classList.toggle("open"); tog.setAttribute("aria-expanded", o); };
links.addEventListener("click", e => { if (e.target.closest("a")) { links.classList.remove("open"); tog.setAttribute("aria-expanded", false); } });
$("#ordbtn").onclick = () => cart.length ? openCart() : document.getElementById("menu").scrollIntoView();
new IntersectionObserver((es, o) => es.forEach(e => e.isIntersecting && (e.target.classList.add("in"), o.unobserve(e.target))), {threshold: .3}).observe($("#credit"));
render(); bar();
})();
