(() => {
"use strict";
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const inr = n => "₹" + n;
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const slug = s => s.toLowerCase().replace(/[^a-z]+/g, "-");
const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
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


// ---------------------------------------------------------------- footer
$("#branches").innerHTML = CONFIG.branches.map(b => `<div><b>${esc(b.name)}</b><span>${esc(b.addr)}</span><span class="lk"><a href="tel:+${b.wa}">Call ${b.wa.slice(2, 7)} ${b.wa.slice(7)}</a><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Chicken Craving Hub " + b.addr)}" target="_blank" rel="noopener">Get directions</a></span></div>`).join("");
$("#owners").innerHTML = "Owners: " + CONFIG.owners.map(o => `<a href="https://instagram.com/${o}" target="_blank" rel="noopener">@${o}</a>`).join(" · ");

// ---------------------------------------------------------------- menu data and cart state
const MAXQ = 20;
const items = MENU.flatMap(([c, , l]) => l.map(([n, p, note = "", f = "", img]) => ({c, n, note, f, img, sizes: Array.isArray(p) ? p : null, from: Array.isArray(p) ? p[0][1] : p})));
items.forEach((i, k) => { i.k = k; });
const byName = new Map(items.map(i => [i.n, i]));
const addonOf = n => CONFIG.addons.find(a => a[0] === n);
const keyOf = l => [l.n, l.size, [...l.ads].sort().join("+")].join("|");
// A saved cart never trusts old prices or items: lines are rebuilt from the current menu every time.
function sanitize(raw) {
  const out = new Map();
  (Array.isArray(raw) ? raw : []).forEach(l => {
    const i = l && byName.get(l.n); if (!i) return;
    const size = i.sizes ? (i.sizes.some(s => s[0] === l.size) ? l.size : i.sizes[0][0]) : "";
    const ads = [...new Set((Array.isArray(l.ads) ? l.ads : []).filter(addonOf))];
    const line = {n: i.n, size, ads, q: Math.max(1, Math.min(Math.floor(+(l.q != null ? l.q : l.qty)) || 1, MAXQ))};
    const k = keyOf(line), ex = out.get(k);
    if (ex) ex.q = Math.min(MAXQ, ex.q + line.q); else out.set(k, line);
  });
  return [...out.values()];
}
let cart = sanitize(store.get("cch-cart-v2", null) || store.get("cch-cart", []));
const saveCart = () => store.set("cch-cart-v2", cart);
const unit = l => { const i = byName.get(l.n); return (i.sizes ? i.sizes.find(s => s[0] === l.size)[1] : i.from) + l.ads.reduce((s, a) => s + addonOf(a)[1], 0); };
const count = () => cart.reduce((s, l) => s + l.q, 0), total = () => cart.reduce((s, l) => s + unit(l) * l.q, 0);
let branch = store.get("cch-branch2", -1); if (!(Number.isInteger(branch) && branch >= 0 && branch < CONFIG.branches.length)) branch = -1;
const F = Object.assign({mode: "delivery", name: "", phone: "", address: ""}, store.get("cch-form", {}));
if (F.mode !== "pickup") F.mode = "delivery";
let note = "", errs = {}, doneUrl = null;
const saveForm = () => store.set("cch-form", {mode: F.mode, name: F.name, phone: F.phone, address: F.address});

// ---------------------------------------------------------------- toast, crumbs, fly-to-cart
let toastT;
function toast(t) { let e = $("#toast"); if (!e) { e = document.createElement("div"); e.id = "toast"; e.className = "toast"; e.setAttribute("role", "status"); document.body.append(e); }
  e.textContent = t; e.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove("on"), 1800); }
function burst(el) { if (calm() || !el) return; const r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let k = 0; k < 10; k++) { const d = document.createElement("i"); d.className = "crumbp"; d.style.left = cx + "px"; d.style.top = cy + "px"; document.body.append(d);
    const a = Math.PI * 2 * k / 10 + Math.random() * .5, m = 30 + Math.random() * 34;
    d.animate([{transform: "translate(-50%,-50%) scale(1)", opacity: 1}, {transform: `translate(calc(-50% + ${Math.cos(a) * m}px),calc(-50% + ${Math.sin(a) * m}px)) scale(.3)`, opacity: 0}], {duration: 600 + Math.random() * 250, easing: "cubic-bezier(.2,.8,.3,1)"}).onfinish = () => d.remove(); } }
function fly(from) { if (calm() || !from) return; const a = from.getBoundingClientRect(), t = $("#ordbtn").getBoundingClientRect(); if (!a.width || !t.width) return;
  const d = document.createElement("div"); d.className = "fly"; d.style.left = d.style.top = "0"; document.body.append(d);
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = t.left + t.width / 2, y1 = t.top + t.height / 2, c = "translate(-50%,-50%)";
  d.animate([{transform: `translate(${x0}px,${y0}px) ${c} scale(1)`}, {transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 80}px) ${c} scale(1.25)`, offset: .5}, {transform: `translate(${x1}px,${y1}px) ${c} scale(.4)`, opacity: .5}], {duration: 700, easing: "cubic-bezier(.45,0,.55,1)"}).onfinish = () => d.remove(); }

// ---------------------------------------------------------------- menu
const dot = f => `<span class="dot ${f.includes("v") ? "v" : ""}" title="${f.includes("v") ? "Veg" : "Non-veg"}"></span>`;
const flags = {v: false, s: false, b: false};
function render() {
  const q = $("#q").value.trim().toLowerCase(), seen = new Set(); let any = false;
  $("#list").innerHTML = MENU.map(([c, sub]) => {
    const rows = items.filter(i => i.c === c && i.n.toLowerCase().includes(q) && Object.keys(flags).every(k => !flags[k] || i.f.includes(k)));
    if (!rows.length) return ""; any = true; seen.add(slug(c));
    return `<section class="cat" id="${slug(c)}"><h2>${esc(c)}</h2><p>${esc(sub)}</p><div class="grid">${rows.map(i => `
      <button type="button" class="item rv" data-k="${i.k}" aria-label="${esc(i.n)}, ${i.sizes ? "from " : ""}${inr(i.from)}. Tap to customise">${i.img ? `<img src="${esc(i.img)}" alt="" loading="lazy" width="400" height="300">` : `<span class="ic">${ICONS[ICON_OF[i.c]]}</span>`}
      ${i.f.includes("b") ? `<span class="tag">Best seller</span>` : ""}<b>${dot(i.f)}${esc(i.n)}</b>${i.note ? `<small>${esc(i.note)}</small>` : ""}
      <span class="foot"><span class="price">${i.sizes ? "<em>from </em>" : ""}${inr(i.from)}</span><span class="plus" role="button" aria-label="Quick add ${esc(i.n)}">+</span></span></button>`).join("")}</div></section>`;
  }).join("");
  $("#none").hidden = any;
  $$(".bar a").forEach(a => { a.style.display = seen.has(a.getAttribute("href").slice(1)) ? "" : "none"; });
  $$(".rv").forEach(el => io.observe(el)); mark(); syncCards();
}
$("#cats").innerHTML = MENU.map(([c]) => `<a href="#${slug(c)}">${esc(c)}</a>`).join("");
let qT; $("#q").addEventListener("input", () => { clearTimeout(qT); qT = setTimeout(render, 120); });
$("#q").addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); e.target.blur(); } });

const TILES = [["all", "Everything", "grid"], ["b", "Best sellers", "flame"], ["s", "Spicy", "chili"], ["v", "Veg", "leaf"]];
$("#tiles").innerHTML = TILES.map(([k, l, ic]) => `<button type="button" class="tile ${k === "all" ? "on" : ""}" data-k="${k}" aria-pressed="${k === "all"}"><span class="ti">${ICONS[ic]}</span><span><b>${l}</b><small>${k === "all" ? items.length : items.filter(i => i.f.includes(k)).length} items</small></span></button>`).join("");
function pick(k) { Object.keys(flags).forEach(x => { flags[x] = x === k; }); $$(".tile").forEach(t => { const on = t.dataset.k === k || (k === "all" && t.dataset.k === "all"); t.classList.toggle("on", on); t.setAttribute("aria-pressed", on); }); render(); }
$("#tiles").addEventListener("click", e => { const t = e.target.closest(".tile"); if (t) pick(t.dataset.k); });
$$("[data-pick]").forEach(a => a.addEventListener("click", () => pick(a.dataset.pick)));

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), {rootMargin: "0px 0px -6% 0px"});
// the active category follows the scroll position, measured from the bottom of the sticky header
function mark() { const lim = $(".bar").getBoundingClientRect().bottom + 24; let cur = null;
  $$(".cat").forEach(el => { if (el.getBoundingClientRect().top <= lim) cur = el; });
  let on = null; $$(".bar a").forEach(a => { const is = !!cur && a.getAttribute("href") === "#" + cur.id; a.classList.toggle("on", is); if (is) on = a; });
  if (on && on !== mark.last) { mark.last = on; const c = $("#cats"); c.scrollTo({left: on.offsetLeft - c.clientWidth / 2 + on.offsetWidth / 2, behavior: calm() ? "auto" : "smooth"}); } }
let tick = false;
addEventListener("scroll", () => { if (tick) return; tick = true; requestAnimationFrame(() => { mark(); $("#prog").style.setProperty("--p", Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight))); tick = false; }); }, {passive: true});
// header turns solid after the hero; hero animations pause while it is off screen
new IntersectionObserver(([e]) => { document.body.classList.toggle("scrolled", !e.isIntersecting); document.body.classList.toggle("hero-off", !e.isIntersecting); }, {rootMargin: "-70px 0px 0px 0px"}).observe($("#top"));

// ---------------------------------------------------------------- overlays (item sheet + cart): focus, scroll lock, Esc, Back button
const scrim = $("#scrim"), sheet = $("#sheet"), drawer = $("#drawer");
let cur = null, hideT, lastFocus = null, ignorePop = false;
if (history.state && history.state.ov) history.replaceState(null, "");
function show(el, name, focusSel) {
  closeNav(); clearTimeout(hideT); lastFocus = document.activeElement; cur = name;
  scrim.hidden = el.hidden = false; document.documentElement.classList.add("lock");
  if (!(history.state && history.state.ov)) history.pushState({ov: 1}, "");
  requestAnimationFrame(() => { scrim.classList.add("show"); el.classList.add("show"); const f = el.querySelector(focusSel) || el.querySelector("button"); if (f) f.focus({preventScroll: true}); });
}
function hideUI() {
  if (!cur) return; cur = null;
  scrim.classList.remove("show"); sheet.classList.remove("show"); drawer.classList.remove("show"); document.documentElement.classList.remove("lock");
  hideT = setTimeout(() => { scrim.hidden = sheet.hidden = drawer.hidden = true; }, 430);
  if (lastFocus && lastFocus.focus) lastFocus.focus({preventScroll: true});
}
function closeAll() { if (!cur) return; hideUI(); if (history.state && history.state.ov) { ignorePop = true; history.back(); } }
addEventListener("popstate", () => { if (ignorePop) { ignorePop = false; return; } hideUI(); });
scrim.addEventListener("click", closeAll);
addEventListener("keydown", e => {
  if (e.key === "Escape") { if (cur) closeAll(); else closeNav(); return; }
  if (e.key !== "Tab" || !cur) return;
  const box = cur === "cart" ? drawer : sheet, f = [...box.querySelectorAll("button:not([disabled]),input:not([disabled]),select,textarea,a[href]")].filter(x => x.offsetParent !== null);
  if (!f.length) return; const a = f[0], z = f[f.length - 1];
  if (!box.contains(document.activeElement) || (e.shiftKey && document.activeElement === a)) { e.preventDefault(); (e.shiftKey ? z : a).focus(); }
  else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
});

// ---------------------------------------------------------------- adding items
$("#list").addEventListener("click", e => {
  const b = e.target.closest(".item"); if (!b) return; const i = items[+b.dataset.k];
  if (e.target.closest(".plus") && !i.sizes) quickAdd(i, b.querySelector(".plus")); else openItem(i);
});
function addLine(l) { const k = keyOf(l), ex = cart.find(x => keyOf(x) === k);
  if (ex) { if (ex.q + l.q > MAXQ) { ex.q = MAXQ; toast("Maximum " + MAXQ + " of one item per order"); return; } ex.q += l.q; } else cart.push({n: l.n, size: l.size, ads: [...l.ads], q: Math.min(l.q, MAXQ)});
  toast("Added to your cart"); }
function quickAdd(i, btn) { addLine({n: i.n, size: "", ads: [], q: 1}); saveCart(); burst(btn); fly(btn); bar(true); }
let sh = null;
function openItem(i) {
  sh = {i, size: i.sizes ? i.sizes[0][0] : "", ads: [], q: 1};
  sheet.innerHTML = `<div class="dh"><h3>${esc(i.n)}</h3><button type="button" class="x" data-close aria-label="Close">×</button></div>${i.note ? `<small class="muted">${esc(i.note)}</small>` : ""}
  <div class="opts">${i.sizes ? i.sizes.map(([l, p], k) => `<label class="opt"><span><input type="radio" name="sz" value="${esc(l)}" ${k ? "" : "checked"}>${esc(l)}</span><b>${inr(p)}</b></label>`).join("") : ""}
  ${CONFIG.addons.map(([l, p]) => `<label class="opt"><span><input type="checkbox" name="ad" value="${esc(l)}">${esc(l)}</span><b>+${inr(p)}</b></label>`).join("")}</div>
  <div class="row"><div class="qty"><button type="button" data-d="-1" aria-label="Decrease">−</button><span id="sq" aria-live="polite">1</span><button type="button" data-d="1" aria-label="Increase">+</button></div><b id="tot" class="big"></b></div>
  <button type="button" class="btn full" id="add" data-add>Add to cart</button>`;
  paintSheet(); show(sheet, "sheet", "[name=sz]:checked, [name=ad], #add");
}
function sheetLine() { return {n: sh.i.n, size: sh.size, ads: sh.ads, q: sh.q}; }
function paintSheet() { $("#sq").textContent = sh.q; $("#tot").textContent = inr(unit({n: sh.i.n, size: sh.size, ads: sh.ads}) * sh.q); }
sheet.addEventListener("change", e => { if (!sh) return; const t = e.target;
  if (t.name === "sz") sh.size = t.value; else if (t.name === "ad") sh.ads = $$("#sheet [name=ad]:checked").map(x => x.value); paintSheet(); });
sheet.addEventListener("click", e => { if (!sh) return; const t = e.target.closest("button"); if (!t) return;
  if (t.dataset.close !== undefined) closeAll();
  else if (t.dataset.d) { sh.q = Math.max(1, Math.min(MAXQ, sh.q + +t.dataset.d)); paintSheet(); }
  else if (t.dataset.add !== undefined) { addLine(sheetLine()); saveCart(); burst(t); fly(t); closeAll(); bar(true); } });

// ---------------------------------------------------------------- cart button, bar and drawer
function syncCards() { $$(".item").forEach(el => { const i = items[+el.dataset.k], p = el.querySelector(".plus"), q = cart.filter(x => x.n === i.n).reduce((s, x) => s + x.q, 0);
  p.dataset.q = q || ""; p.classList.toggle("has", q > 0); }); }
function bar(pop) {
  syncCards(); const n = count(), b = $("#cartbar");
  document.body.classList.toggle("hascart", n > 0); $("#nc").textContent = n;
  $("#cc").textContent = n + (n === 1 ? " item" : " items"); $("#ct").textContent = "View cart · " + inr(total());
  b.classList.toggle("show", n > 0); b.tabIndex = n ? 0 : -1; b.setAttribute("aria-hidden", n ? "false" : "true");
  if (pop && !calm()) [$("#ordbtn"), b].forEach(el => { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); });
  if (cur === "cart" && !doneUrl) paintCart();
}
$("#cartbar").addEventListener("click", openCart); $("#ordbtn").addEventListener("click", openCart);
function openCart() { doneUrl = null; errs = {}; drawer.innerHTML = `<div class="dh"><h3>Your cart</h3><button type="button" class="x" data-close aria-label="Close cart">×</button></div><div class="db" id="db"></div><div class="df" id="df"></div>`; show(drawer, "cart", "[data-focus]"); paintCart(); }
const fld = (id, label, inner, hint = "") => `<div class="fg"><label for="${id}">${label}</label>${inner}${errs[id] ? `<div class="err" id="e-${id}">${errs[id]}</div>` : ""}</div>`;
function paintCart() {
  const db = $("#db"), df = $("#df"); if (!db) return; const st = db.scrollTop, ae = document.activeElement;
  const fk = ae && ae.closest && ae.closest(".qty") ? ae.closest(".qty").dataset.k : null, fd = fk !== null && ae.dataset ? ae.dataset.d : null;
  if (!cart.length) { db.innerHTML = `<div class="empty"><div class="ei">${ICONS.bowl}</div><h3>Your cart is empty</h3><p class="muted">Add something crispy from the menu.</p><button type="button" class="btn red" data-close data-focus>Browse the menu</button></div>`; df.hidden = true; return; }
  df.hidden = false;
  db.innerHTML = `<div id="lines">${cart.map((l, k) => `<div class="ci"><div class="cinfo"><b>${esc(l.n)}</b>${[l.size, ...l.ads].filter(Boolean).length ? `<small>${esc([l.size, ...l.ads].filter(Boolean).join(", "))}</small>` : ""}<small>${inr(unit(l))} each · <b>${inr(unit(l) * l.q)}</b></small><button type="button" class="lnk" data-rm="${k}">Remove</button></div>
    <div class="qty" data-k="${k}"><button type="button" data-d="-1" aria-label="${l.q === 1 ? "Remove" : "Decrease"} ${esc(l.n)}">−</button><span aria-live="polite">${l.q}</span><button type="button" data-d="1" aria-label="Increase ${esc(l.n)}" ${l.q >= MAXQ ? "disabled" : ""}>+</button></div></div>`).join("")}</div>
  <div class="f"><h4>Branch</h4><div class="opts ${errs.br ? "bad" : ""}" role="radiogroup" aria-label="Branch">${CONFIG.branches.map((b, k) => `<label class="opt"><span><input type="radio" name="br" value="${k}" ${k === branch ? "checked" : ""}>${esc(b.name)}<small>${esc(b.area)}</small></span></label>`).join("")}</div>${errs.br ? `<div class="err" id="e-br">${errs.br}</div>` : ""}
  <h4>Order type</h4><div class="seg2"><label class="opt"><span><input type="radio" name="mode" value="delivery" ${F.mode === "delivery" ? "checked" : ""}>Delivery</span></label><label class="opt"><span><input type="radio" name="mode" value="pickup" ${F.mode === "pickup" ? "checked" : ""}>Pickup</span></label></div>
  ${fld("fn", "Your name", `<input id="fn" autocomplete="name" value="${esc(F.name)}" class="${errs.fn ? "bad" : ""}">`)}
  ${fld("fp", "Mobile number", `<input id="fp" type="tel" inputmode="tel" autocomplete="tel" value="${esc(F.phone)}" class="${errs.fp ? "bad" : ""}">`)}
  <div id="addrw" ${F.mode === "pickup" ? "hidden" : ""}>${fld("fa", "Delivery address", `<textarea id="fa" rows="3" autocomplete="street-address" class="${errs.fa ? "bad" : ""}">${esc(F.address)}</textarea>`)}</div>
  ${fld("fo", "Note for the kitchen (optional)", `<input id="fo" value="${esc(note)}" maxlength="140">`)}</div>`;
  df.innerHTML = `<div class="trow"><span>Total</span><b>${inr(total())}</b></div><button type="button" class="btn red full" id="place" data-place data-focus></button><p class="muted sm" id="hintp"></p>`;
  paintPlace(); db.scrollTop = st;
  if (fk !== null) { const t = db.querySelector(`.qty[data-k="${fk}"] [data-d="${fd}"]`) || db.querySelector(".qty button:not([disabled])"); if (t) t.focus({preventScroll: true}); }
}
function paintPlace() { const b = $("#place"), h = $("#hintp"); if (!b) return; b.textContent = branch < 0 ? "Choose a branch to order" : "Send order to " + CONFIG.branches[branch].name;
  h.textContent = `Opens WhatsApp with your order so the branch can confirm it. Pay by cash or UPI on ${F.mode === "pickup" ? "pickup" : "delivery"}.`; }
function changeQty(k, d) { const l = cart[k]; if (!l) return; l.q += d; if (l.q < 1) { toast("Removed " + l.n); cart.splice(k, 1); } if (l.q > MAXQ) l.q = MAXQ; saveCart(); bar(); }
drawer.addEventListener("click", e => { const t = e.target.closest("button, a"); if (!t) return;
  if (t.dataset.close !== undefined) closeAll();
  else if (t.dataset.d && t.closest(".qty")) changeQty(+t.closest(".qty").dataset.k, +t.dataset.d);
  else if (t.dataset.rm !== undefined) { const l = cart[+t.dataset.rm]; if (l) { toast("Removed " + l.n); cart.splice(+t.dataset.rm, 1); saveCart(); bar(); } }
  else if (t.dataset.place !== undefined) place();
  else if (t.dataset.new !== undefined) { cart = []; note = ""; doneUrl = null; saveCart(); bar(); closeAll(); toast("Cart cleared. Thank you!"); }
  else if (t.dataset.back !== undefined) { doneUrl = null; paintCart(); } });
drawer.addEventListener("input", e => { const t = e.target, m = {fn: "name", fp: "phone", fa: "address"}[t.id];
  if (m) { F[m] = t.value; saveForm(); } else if (t.id === "fo") note = t.value;
  if (errs[t.id]) { delete errs[t.id]; t.classList.remove("bad"); const x = $("#e-" + t.id); if (x) x.remove(); } });
drawer.addEventListener("change", e => { const t = e.target;
  if (t.name === "br") { branch = +t.value; store.set("cch-branch2", branch); delete errs.br; const x = $("#e-br"); if (x) x.remove(); const g = $(".opts.bad"); if (g) g.classList.remove("bad"); paintPlace(); }
  else if (t.name === "mode") { F.mode = t.value; saveForm(); $("#addrw").hidden = F.mode === "pickup"; paintPlace(); } });
drawer.addEventListener("focusin", e => { if (e.target.matches("input,textarea")) setTimeout(() => { if (e.target.isConnected) e.target.scrollIntoView({block: "center", behavior: calm() ? "auto" : "smooth"}); }, 320); });
function place() {
  errs = {}; const ph = F.phone.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  if (branch < 0) errs.br = "Choose the branch you want to order from";
  if (F.name.trim().length < 2) errs.fn = "Enter your name";
  if (ph.length !== 10) errs.fp = "Enter a 10-digit mobile number";
  if (F.mode === "delivery" && F.address.trim().length < 8) errs.fa = "Enter your full delivery address";
  const bad = Object.keys(errs)[0];
  if (bad) { paintCart(); const el = bad === "br" ? $("[name=br]") : $("#" + bad); if (el) { el.focus({preventScroll: true}); el.scrollIntoView({block: "center", behavior: calm() ? "auto" : "smooth"}); } return; }
  const b = CONFIG.branches[branch], ref = Date.now().toString(36).slice(-5).toUpperCase();
  const lines = cart.map(l => { const x = [l.size, ...l.ads].filter(Boolean).join(", "); return `${l.q} x ${l.n}${x ? " (" + x + ")" : ""} - ${inr(unit(l) * l.q)}`; });
  const msg = [`*New order · ${CONFIG.brand}*`, `*Branch: ${b.name}* · ${F.mode === "pickup" ? "PICKUP" : "DELIVERY"}`, `Ref: ${ref}`, "", ...lines, "", `*Total: ${inr(total())}* (cash or UPI on ${F.mode === "pickup" ? "pickup" : "delivery"})`, "",
    `Name: ${F.name.trim()}`, `Phone: ${ph}`, ...(F.mode === "delivery" ? [`Address: ${F.address.trim()}`] : []), ...(note.trim() ? [`Note: ${note.trim()}`] : [])].join("\n");
  doneUrl = `https://wa.me/${b.wa || CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  const w = window.open(doneUrl, "_blank"); if (w) w.opener = null; else location.href = doneUrl;
  $("#db").innerHTML = `<div class="empty done"><div class="ei ok">✓</div><h3>Order ready to send</h3><p class="muted">WhatsApp should now be open with your order for <b>${esc(b.name)}</b>. Tap <b>Send</b> there to confirm it. Nothing is ordered until you send it.</p>
    <a class="btn red full" href="${doneUrl}" target="_blank" rel="noopener" data-focus>Open WhatsApp</a><button type="button" class="btn ghost full" data-new>I have sent it, start a new order</button><button type="button" class="lnk" data-back>Back to my cart</button></div>`;
  $("#df").hidden = true;
}

// ---------------------------------------------------------------- header menu (phones)
const links = $("#links"), tog = $("#tog");
function closeNav() { links.classList.remove("open"); tog.setAttribute("aria-expanded", "false"); }
tog.addEventListener("click", e => { e.stopPropagation(); const o = links.classList.toggle("open"); tog.setAttribute("aria-expanded", o); });
links.addEventListener("click", e => { if (e.target.closest("a")) closeNav(); });
document.addEventListener("click", e => { if (links.classList.contains("open") && !e.target.closest("#nav")) closeNav(); });

// ---------------------------------------------------------------- hero play (tap the bucket), hover effects only for real mice
const art = $("#art"), bk = $(".bucket");
function crunch() { if (calm() || document.hidden || !bk) return; $$(".dr,.ng").forEach((el, k) => el.animate([{transform: "none"}, {transform: "translateY(-52px) rotate(8deg)"}, {transform: "none"}], {duration: 700, delay: k * 70, easing: "cubic-bezier(.3,1.5,.5,1)"}));
  bk.animate([{rotate: "0deg"}, {rotate: "-3deg"}, {rotate: "3deg"}, {rotate: "0deg"}], {duration: 450}); burst(bk);
  const t = document.createElement("span"); t.className = "crunch"; t.textContent = ["Crunch!", "Crispy!", "Yum!"][Math.floor(Math.random() * 3)]; art.append(t);
  t.animate([{opacity: 0, transform: "translate(-50%,10px) scale(.4) rotate(-8deg)"}, {opacity: 1, transform: "translate(-50%,-26px) scale(1.15) rotate(-8deg)", offset: .35}, {opacity: 0, transform: "translate(-50%,-70px) scale(1) rotate(-8deg)"}], {duration: 950, easing: "ease-out"}).onfinish = () => t.remove(); }
art.addEventListener("click", crunch);
setInterval(() => { if (scrollY < 500 && !cur) crunch(); }, 7000);
if (matchMedia("(hover: hover)").matches) {
  const lst = $("#list");
  lst.addEventListener("pointermove", e => { if (e.pointerType !== "mouse") return; const b = e.target.closest(".item"); if (!b) return; const r = b.getBoundingClientRect();
    b.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 10 + "deg"); b.style.setProperty("--rx", (.5 - (e.clientY - r.top) / r.height) * 8 + "deg"); });
  lst.addEventListener("pointerout", e => { const b = e.target.closest(".item"); if (b && !b.contains(e.relatedTarget)) { b.style.removeProperty("--rx"); b.style.removeProperty("--ry"); } });
  $("#top").addEventListener("pointermove", e => { if (e.pointerType !== "mouse") return; const r = e.currentTarget.getBoundingClientRect();
    art.style.setProperty("--mx", ((e.clientX - r.left) / r.width - .5).toFixed(3)); art.style.setProperty("--my", ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
}
$$("[data-ico]").forEach(e => { e.innerHTML = ICONS[e.dataset.ico]; });
render(); bar();
})();
