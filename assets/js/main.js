/* Frill Monarch — storefront behaviour.
   Forms post to handler.php (included; works on any PHP host with mail() enabled).
   If the handler can't be reached, the visitor's email app opens with the details filled in. */
(function(){
  "use strict";
  const $ = (s,c=document)=>c.querySelector(s), $$ = (s,c=document)=>Array.from(c.querySelectorAll(s));
  const P = window.FM_PRODUCTS || [], C = window.FM_COLORS || {}, IMG = window.FM_IMG, CATS = window.FM_CATS || {}, SHIP = window.FM_SHIP || {};
  const EMAIL = "hello@frillmonarch.com";
  const money = n => "$" + (Math.round(n*100)/100).toFixed(2);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const store = { get(k,d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }, set(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} } };
  const byId = id => P.find(p => p.id === id);
  const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
  const say = (box, t, k="err") => { let m = $(".msg", box); if (!m){ m = document.createElement("div"); box.prepend(m); } m.className = "msg msg-"+k; m.setAttribute("role", k==="err"?"alert":"status"); m.textContent = t; };
  const bad = (el, b) => { const f = el.closest(".fld"); if (f) f.classList.toggle("bad", b); return b; };
  const base = document.body.dataset.base || "";

  async function send(type, data){
    try{
      const fd = new FormData(); fd.append("type", type); Object.entries(data).forEach(([k,v]) => fd.append(k, typeof v === "string" ? v : JSON.stringify(v)));
      const r = await fetch(base + "handler.php", {method:"POST", body:fd, headers:{"Accept":"application/json"}});
      const j = await r.json(); return !!j.ok;
    }catch(e){ return false; }
  }

  /* ---- bag & wishlist state ---- */
  const bag = () => store.get("fm_bag", []), setBag = b => { store.set("fm_bag", b); badges(); };
  const wish = () => store.get("fm_wish", []), setWish = w => { store.set("fm_wish", w); badges(); };
  function badges(){
    const n = bag().reduce((s,i)=>s+i.qty,0), w = wish().length;
    $$("[data-bag-count]").forEach(e => { e.textContent = n; e.dataset.n = n; });
    $$("[data-wish-count]").forEach(e => { e.textContent = w; e.dataset.n = w; });
  }
  function addToBag(id, size, color, qty=1){
    const b = bag(); const ex = b.find(i => i.id===id && i.size===size && i.color===color);
    if (ex) ex.qty = Math.min(10, ex.qty + qty); else b.push({id,size,color,qty});
    setBag(b); toast(`${esc(byId(id).name)} added to your bag. <a href="${base}bag.html">View bag</a>`);
  }
  function toggleWish(id){
    const w = wish(); const i = w.indexOf(id); if (i>-1) w.splice(i,1); else w.push(id); setWish(w);
    return i === -1;
  }
  let tt; function toast(html){ let t = $(".toast"); if (!t){ t = document.createElement("div"); t.className="toast"; t.setAttribute("role","status"); document.body.appendChild(t); } t.innerHTML = html; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(()=>t.classList.remove("show"), 3600); }
  badges();

  /* ---- header: drawer & search ---- */
  const drawer = $(".drawer"), scrim = $(".scrim");
  const closeDrawer = () => { drawer?.classList.remove("open"); scrim?.classList.remove("show"); $(".menu-btn")?.setAttribute("aria-expanded","false"); };
  $(".menu-btn")?.addEventListener("click", () => { drawer.classList.add("open"); scrim.classList.add("show"); $(".menu-btn").setAttribute("aria-expanded","true"); $(".drawer a")?.focus(); });
  $(".drawer-close")?.addEventListener("click", closeDrawer); scrim?.addEventListener("click", closeDrawer);
  $(".search-btn")?.addEventListener("click", () => { const s = $(".searchbar"); s.classList.toggle("open"); if (s.classList.contains("open")) $("input", s).focus(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape"){ closeDrawer(); closeModal(); } });
  $$("[data-year]").forEach(e => e.textContent = new Date().getFullYear());

  /* ---- cookie consent (Google Consent Mode v2) ---- */
  const ck = $(".cookie"), choice = store.get("fm_consent", null);
  const apply = ok => { if (typeof gtag === "function") gtag("consent","update",{analytics_storage:ok?"granted":"denied",ad_storage:ok?"granted":"denied",ad_user_data:ok?"granted":"denied",ad_personalization:ok?"granted":"denied"}); };
  const cs = $("#consent-status"); const showC = c => { if (cs) cs.textContent = c==="all" ? "Analytics and advertising cookies are allowed." : c==="essential" ? "Only essential storage is active." : "No choice made yet."; };
  if (choice) apply(choice === "all"); else ck?.classList.add("show"); showC(choice);
  $$("[data-consent]").forEach(b => b.addEventListener("click", () => { store.set("fm_consent", b.dataset.consent); apply(b.dataset.consent==="all"); ck?.classList.remove("show"); showC(b.dataset.consent); }));
  $$("[data-cookie-settings]").forEach(b => b.addEventListener("click", () => ck?.classList.add("show")));

  /* ---- hero slider ---- */
  const slider = $(".slider");
  if (slider){
    const slides = $$(".slide", slider), bars = $$(".s-bars button", slider), cnt = $(".s-count b", slider); let i = 0, timer;
    const go = n => { i = (n + slides.length) % slides.length; slides.forEach((s,j)=>{ s.classList.toggle("on", j===i); s.setAttribute("aria-hidden", j!==i); });
      bars.forEach((b,j)=>{ b.classList.remove("on"); void b.offsetWidth; if (j===i) b.classList.add("on"); b.setAttribute("aria-current", j===i); }); cnt.textContent = String(i+1).padStart(2,"0");
      clearTimeout(timer); if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setTimeout(()=>go(i+1), 6000); };
    bars.forEach((b,j)=>b.addEventListener("click",()=>go(j)));
    $(".s-prev", slider)?.addEventListener("click",()=>go(i-1)); $(".s-next", slider)?.addEventListener("click",()=>go(i+1));
    slider.addEventListener("mouseenter",()=>clearTimeout(timer)); slider.addEventListener("mouseleave",()=>go(i));
    go(0);
  }

  /* ---- silhouette quiz ---- */
  const quiz = $("#quiz");
  if (quiz){
    const steps = $$(".q-step", quiz), score = {};
    const res = {
      dresses:["The Flowing Romantic","You love movement and softness. Start with our ruffle and floral midis — they do the styling for you.","dresses"],
      tailoring:["The Modern Tailored","Clean lines and a little structure make you feel your best. Explore our blazers and wide-leg trousers.","tailoring"],
      tops:["The Easy Classic","You like pieces that work hard. Frill blouses and silk shirts will slot into everything you own.","tops"],
      skirts:["The Playful Twirler","Swish, volume and color are your thing. Our pleated and tiered skirts were made for you.","skirts"]
    };
    let n = 0;
    const show = k => { steps.forEach((s,j)=>s.classList.toggle("on", j===k)); $$(".q-prog i", quiz).forEach((b,j)=>b.classList.toggle("on", j<=k)); };
    quiz.addEventListener("click", e => {
      const b = e.target.closest("[data-pick]"); if (!b) return;
      b.dataset.pick.split(" ").forEach(k => score[k] = (score[k]||0)+1); n++;
      if (n < steps.length) show(n);
      else { const top = Object.entries(score).sort((a,b)=>b[1]-a[1])[0][0]; const r = res[top];
        $("#quiz-title").textContent = r[0]; $("#quiz-text").textContent = r[1]; $("#quiz-link").href = "shop.html?cat=" + r[2]; $("#quiz-link").textContent = "Shop " + CATS[r[2]]; $("#quiz-restart").hidden = false; }
    });
    $("#quiz-restart").addEventListener("click", () => { n = 0; Object.keys(score).forEach(k=>delete score[k]); show(0); $("#quiz-title").textContent = "Your style, decoded"; $("#quiz-text").textContent = "Answer three quick questions and we'll point you to the shapes that suit how you like to dress."; $("#quiz-link").href="shop.html"; $("#quiz-link").textContent="Browse everything"; $("#quiz-restart").hidden = true; });
    show(0);
  }

  /* ---- lookbook hotspots ---- */
  $$(".spot").forEach(s => s.addEventListener("click", () => {
    const card = $("#"+s.getAttribute("aria-controls")); const open = !card.classList.contains("show");
    $$(".tip-card").forEach(c=>c.classList.remove("show")); $$(".spot").forEach(x=>x.setAttribute("aria-expanded","false"));
    if (open){ card.classList.add("show"); s.setAttribute("aria-expanded","true"); }
  }));

  /* ---- tabs ---- */
  $$("[role=tablist]").forEach(tl => { const tabs = $$("[role=tab]", tl);
    tabs.forEach(t => t.addEventListener("click", () => { tabs.forEach(x => { const on = x===t; x.setAttribute("aria-selected", on); $("#"+x.getAttribute("aria-controls")).hidden = !on; }); })); });

  /* ---- newsletter ---- */
  $$(".newsletter").forEach(f => f.addEventListener("submit", async e => {
    e.preventDefault(); const em = $("input[type=email]", f).value.trim(); const box = f.parentElement;
    const m = () => { let x = $(".msg", box); if (!x){ x = document.createElement("div"); box.appendChild(x); } return x; };
    if (!validEmail(em)){ const x = m(); x.className="msg msg-err"; x.textContent="Please enter a valid email address."; return; }
    const ok = await send("newsletter", {email:em}); const x = m();
    if (ok){ x.className="msg msg-ok"; x.textContent="Thank you — you're on the list. Look out for our next letter."; f.reset(); }
    else { x.className="msg msg-info"; x.innerHTML = `We couldn't reach our mailing list just now. <a href="mailto:${EMAIL}?subject=${encodeURIComponent("Newsletter sign-up")}&body=${encodeURIComponent("Please add "+em+" to the Frill Monarch letter.")}" style="color:inherit">Email us to join</a>.`; }
  }));

  /* ---- shop ---- */
  const grid = $("#pgrid");
  let modalProduct = null;
  if (grid){
    const qs = new URLSearchParams(location.search);
    const st = {cat: CATS[qs.get("cat")] ? qs.get("cat") : "all", size:"", color:"", max:250, q:(qs.get("q")||"").toLowerCase(), sort:"featured"};
    const allSizes = [...new Set(P.flatMap(p=>p.sizes))], allColors = [...new Set(P.flatMap(p=>p.colors))];
    $("#f-sizes").innerHTML = allSizes.map(s=>`<button type="button" data-size="${s}" aria-pressed="false">${s}</button>`).join("");
    $("#f-colors").innerHTML = allColors.map(c=>`<button type="button" data-color="${c}" aria-pressed="false" style="background:${C[c]}" aria-label="${c}" title="${c}"></button>`).join("");
    $("#f-q").value = st.q;
    const draw = () => {
      let list = P.filter(p => (st.cat==="all"||p.cat===st.cat) && (!st.size||p.sizes.includes(st.size)) && (!st.color||p.colors.includes(st.color)) && p.price<=st.max && (!st.q || (p.name+" "+p.desc+" "+CATS[p.cat]).toLowerCase().includes(st.q)));
      if (st.sort==="low") list.sort((a,b)=>a.price-b.price); if (st.sort==="high") list.sort((a,b)=>b.price-a.price); if (st.sort==="az") list.sort((a,b)=>a.name.localeCompare(b.name));
      $("#count").textContent = `${list.length} ${list.length===1?"piece":"pieces"}`;
      const w = wish();
      grid.innerHTML = list.length ? list.map(p => `<article class="pcard">
        <div class="media"><img src="${IMG(p.img,700)}" alt="${esc(p.alt)}" width="700" height="933" loading="lazy">${p.tag?`<span class="tag">${p.tag}</span>`:""}
          <button class="icon-btn heart" type="button" data-wish="${p.id}" aria-pressed="${w.includes(p.id)}" aria-label="Save ${esc(p.name)} to wishlist"><svg viewBox="0 0 24 24" stroke-width="1.6"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg></button>
          <button class="btn btn-sm btn-block qv" type="button" data-qv="${p.id}">Quick view</button></div>
        <h3>${esc(p.name)}</h3><div class="meta"><span>${CATS[p.cat]}</span><span class="price">${money(p.price)}</span></div>
        <div class="dots" aria-label="Colors: ${p.colors.join(", ")}">${p.colors.map(c=>`<i style="background:${C[c]}" title="${c}"></i>`).join("")}</div></article>`).join("")
        : `<div class="empty"><h3>Nothing matches just yet</h3><p class="muted">Try another size, color or price range.</p><button class="btn btn-sm" type="button" id="clear2">Clear filters</button></div>`;
      $("#clear2")?.addEventListener("click", clear);
    };
    const sync = () => {
      $$("[data-cat]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.cat===st.cat));
      $$("[data-size]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.size===st.size));
      $$("[data-color]").forEach(b=>b.setAttribute("aria-pressed", b.dataset.color===st.color));
      $("#f-max").value = st.max; $("#f-max-out").textContent = money(st.max).replace(".00","");
    };
    const clear = () => { Object.assign(st,{cat:"all",size:"",color:"",max:250,q:""}); $("#f-q").value=""; sync(); draw(); };
    document.addEventListener("click", e => {
      const c = e.target.closest("[data-cat]"); if (c){ st.cat = c.dataset.cat; sync(); draw(); }
      const s = e.target.closest("#f-sizes [data-size]"); if (s){ st.size = st.size===s.dataset.size ? "" : s.dataset.size; sync(); draw(); }
      const k = e.target.closest("#f-colors [data-color]"); if (k){ st.color = st.color===k.dataset.color ? "" : k.dataset.color; sync(); draw(); }
    });
    $("#f-max").addEventListener("input", e => { st.max = +e.target.value; sync(); draw(); });
    $("#f-q").addEventListener("input", e => { st.q = e.target.value.trim().toLowerCase(); draw(); });
    $("#f-sort").addEventListener("change", e => { st.sort = e.target.value; draw(); });
    $("#f-clear").addEventListener("click", clear);
    grid.addEventListener("click", e => {
      const h = e.target.closest("[data-wish]"); if (h){ const on = toggleWish(h.dataset.wish); h.setAttribute("aria-pressed", on); toast(on ? `Saved to your wishlist. <a href="${base}wishlist.html">View wishlist</a>` : "Removed from your wishlist."); }
      const q = e.target.closest("[data-qv]"); if (q) openModal(q.dataset.qv);
    });
    sync(); draw();
  }

  /* ---- quick view modal ---- */
  const modal = $("#qv-modal"); let lastFocus;
  function openModal(id){
    const p = byId(id); modalProduct = {p, size:p.sizes.length===1?p.sizes[0]:"", color:p.colors[0]}; lastFocus = document.activeElement;
    $("#qv-body").innerHTML = `<span class="eyebrow">${CATS[p.cat]}</span><h2 id="qv-title">${esc(p.name)}</h2><div class="price">${money(p.price)}</div>
      <p class="muted">${esc(p.desc)}</p>
      <span class="lbl">Color: <b id="qv-colname">${p.colors[0]}</b></span><div class="swatches" style="margin-bottom:18px">${p.colors.map((c,i)=>`<button type="button" data-qc="${c}" aria-pressed="${i===0}" style="background:${C[c]}" aria-label="${c}"></button>`).join("")}</div>
      <span class="lbl">Size <a href="${base}size-guide.html" style="float:right;color:var(--rose-dk)">Size guide</a></span><div class="size-pick">${p.sizes.map(s=>`<button type="button" data-qs="${s}" aria-pressed="${p.sizes.length===1}">${s}</button>`).join("")}</div>
      <div style="display:flex;gap:10px;align-items:stretch;flex-wrap:wrap"><div class="qty"><button type="button" data-qq="-1" aria-label="Decrease quantity">−</button><input id="qv-qty" type="number" value="1" min="1" max="10" aria-label="Quantity"><button type="button" data-qq="1" aria-label="Increase quantity">+</button></div>
      <button class="btn btn-solid" type="button" id="qv-add" style="flex:1">Add to bag</button></div>
      <p id="qv-err" class="msg msg-err" hidden style="margin-top:12px">Please choose a size.</p>
      <ul class="details-list" style="margin-top:22px"><li><b>Fabric:</b> ${esc(p.fabric)}</li><li><b>Fit:</b> ${esc(p.fit)}</li><li>Free standard shipping over $${SHIP.freeOver}; free 30-day returns.</li></ul>`;
    const im = $("#qv-img"); im.src = IMG(p.img, 900); im.alt = p.alt;
    modal.classList.add("open"); $(".modal-close", modal).focus();
  }
  function closeModal(){ if (modal?.classList.contains("open")){ modal.classList.remove("open"); lastFocus?.focus(); } }
  if (modal){
    $(".modal-close", modal).addEventListener("click", closeModal);
    modal.addEventListener("click", e => {
      if (e.target === modal) return closeModal();
      const m = modalProduct; if (!m) return;
      const c = e.target.closest("[data-qc]"); if (c){ m.color = c.dataset.qc; $$("[data-qc]",modal).forEach(b=>b.setAttribute("aria-pressed", b===c)); $("#qv-colname").textContent = m.color; }
      const s = e.target.closest("[data-qs]"); if (s){ m.size = s.dataset.qs; $$("[data-qs]",modal).forEach(b=>b.setAttribute("aria-pressed", b===s)); $("#qv-err").hidden = true; }
      const q = e.target.closest("[data-qq]"); if (q){ const i = $("#qv-qty"); i.value = Math.max(1, Math.min(10, (+i.value||1) + (+q.dataset.qq))); }
      if (e.target.closest("#qv-add")){ if (!m.size){ $("#qv-err").hidden = false; return; } addToBag(m.p.id, m.size, m.color, Math.max(1, Math.min(10, +$("#qv-qty").value||1))); closeModal(); }
    });
  }

  /* ---- wishlist page ---- */
  const wl = $("#wishlist");
  if (wl){
    const draw = () => { const w = wish().map(byId).filter(Boolean);
      wl.innerHTML = w.length ? w.map(p=>`<div class="wl-row"><i style="display:block;width:18px;height:18px;border-radius:50%;border:1px solid var(--line);background:${C[p.colors[0]]}"></i>
        <div><h3 style="margin:0;font-size:1.35rem">${esc(p.name)}</h3><small class="muted">${CATS[p.cat]} · ${money(p.price)} · ${p.sizes.join(", ")}</small></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end"><button class="btn btn-sm" type="button" data-qv="${p.id}">Choose size</button><button class="btn btn-sm" type="button" data-unwish="${p.id}" aria-label="Remove ${esc(p.name)}">Remove</button></div></div>`).join("")
        : `<div class="empty"><h3>Your wishlist is empty</h3><p class="muted">Tap the heart on any piece in the shop to save it here.</p><a class="btn btn-sm" href="shop.html">Browse the collection</a></div>`; };
    wl.addEventListener("click", e => { const r = e.target.closest("[data-unwish]"); if (r){ toggleWish(r.dataset.unwish); draw(); } const q = e.target.closest("[data-qv]"); if (q) openModal(q.dataset.qv); });
    draw();
  }

  /* ---- bag & checkout request ---- */
  const bagEl = $("#bag");
  if (bagEl){
    const totals = () => { const items = bag(); const sub = items.reduce((s,i)=>s + byId(i.id).price*i.qty, 0);
      const method = ($("input[name=ship]:checked")||{}).value || "standard";
      const ship = !items.length ? 0 : method === "express" ? SHIP.express : (sub >= SHIP.freeOver ? 0 : SHIP.standard);
      const tax = sub * SHIP.taxRate; return {items, sub, ship, tax, total: sub + ship + tax, method}; };
    const draw = () => { const t = totals();
      $("#lines").innerHTML = t.items.length ? t.items.map((i,k)=>{ const p = byId(i.id); return `<div class="li"><i class="sw" style="background:${C[i.color]}" title="${i.color}"></i>
        <div><h3>${esc(p.name)}</h3><small>Color: ${i.color} · Size: ${esc(i.size)} · ${money(p.price)}</small><br><button class="rm" type="button" data-rm="${k}">Remove</button></div>
        <div class="qty"><button type="button" data-q="${k}" data-d="-1" aria-label="Decrease quantity">−</button><input value="${i.qty}" aria-label="Quantity" readonly><button type="button" data-q="${k}" data-d="1" aria-label="Increase quantity">+</button></div>
        <b>${money(p.price*i.qty)}</b></div>`; }).join("")
        : `<div class="empty"><h3>Your bag is empty</h3><p class="muted">Find something you love in the collection.</p><a class="btn btn-sm" href="shop.html">Shop the collection</a></div>`;
      $("#s-sub").textContent = money(t.sub); $("#s-ship").textContent = t.ship ? money(t.ship) : (t.items.length ? "Free" : "—"); $("#s-tax").textContent = money(t.tax); $("#s-total").textContent = money(t.total);
      const left = Math.max(0, SHIP.freeOver - t.sub); $("#free-note").textContent = left > 0 ? `Add ${money(left)} more for free standard shipping.` : "You've unlocked free standard shipping.";
      $(".progress i").style.width = Math.min(100, t.sub / SHIP.freeOver * 100) + "%";
      $("#checkout").hidden = !t.items.length;
    };
    bagEl.addEventListener("click", e => { const b = bag();
      const r = e.target.closest("[data-rm]"); if (r){ b.splice(+r.dataset.rm,1); setBag(b); draw(); }
      const q = e.target.closest("[data-q]"); if (q){ const it = b[+q.dataset.q]; it.qty = Math.max(1, Math.min(10, it.qty + (+q.dataset.d))); setBag(b); draw(); } });
    $$("input[name=ship]").forEach(i => i.addEventListener("change", draw));
    $("#checkout").addEventListener("submit", async e => {
      e.preventDefault(); const f = e.target; $(".msg", f)?.remove(); let ok = true;
      const v = id => $("#"+id).value.trim();
      if (bad($("#o-name"), v("o-name").length < 2)) ok = false;
      if (bad($("#o-email"), !validEmail(v("o-email")))) ok = false;
      if (bad($("#o-phone"), v("o-phone").replace(/\D/g,"").length < 7)) ok = false;
      if (bad($("#o-addr"), v("o-addr").length < 5)) ok = false;
      if (bad($("#o-city"), v("o-city").length < 2)) ok = false;
      if (bad($("#o-zip"), v("o-zip").length < 3)) ok = false;
      if (bad($("#o-agree"), !$("#o-agree").checked)) ok = false;
      if (!ok){ say(f, "Please check the highlighted details."); return; }
      const t = totals(); const ref = "FM-" + Date.now().toString(36).slice(-5).toUpperCase();
      const lines = t.items.map(i => `${byId(i.id).name} (${i.color}, ${i.size}) x${i.qty} — ${money(byId(i.id).price*i.qty)}`);
      const order = {ref, name:v("o-name"), email:v("o-email"), phone:v("o-phone"), address:`${v("o-addr")}, ${v("o-city")} ${v("o-zip")}`, notes:v("o-notes"), shipping:t.method, items:lines.join("\n"), subtotal:money(t.sub), shippingCost:money(t.ship), tax:money(t.tax), total:money(t.total)};
      const btn = $("#o-submit"); btn.disabled = true; btn.textContent = "Sending…";
      const sent = await send("order", order);
      const orders = store.get("fm_orders", []); orders.unshift({...order, date:new Date().toISOString(), sent}); store.set("fm_orders", orders);
      setBag([]);
      const body = `Order request ${ref}\n\n${lines.join("\n")}\n\nSubtotal: ${order.subtotal}\nShipping (${t.method}): ${order.shippingCost}\nEstimated tax: ${order.tax}\nTotal: ${order.total}\n\nName: ${order.name}\nEmail: ${order.email}\nPhone: ${order.phone}\nShip to: ${order.address}\nNotes: ${order.notes||"-"}`;
      $("#bag").innerHTML = `<div class="order-done panel" style="grid-column:1/-1"><span class="eyebrow">${sent ? "Order request received" : "One more step"}</span>
        <h2 tabindex="-1" id="done-h">${sent ? "Thank you, " + esc(order.name.split(" ")[0]) : "Send your order to our studio"}</h2><p>Your order reference</p><div class="ref">${ref}</div>
        ${sent ? `<p>We've received your order request. Our studio team will confirm stock and email you a secure payment link within one business day. Your pieces ship as soon as payment is complete.</p>`
               : `<p>We couldn't reach our order system from this page. Tap below to send your order from your email app — our studio replies within one business day with a secure payment link.</p><p><a class="btn btn-solid" href="mailto:${EMAIL}?subject=${encodeURIComponent("Order request "+ref)}&body=${encodeURIComponent(body)}">Email my order</a></p>`}
        <p class="muted" style="font-size:.9rem">No payment has been taken. Questions? Call <a href="tel:+18887775845">+1-888-777-5845</a> and quote ${ref}.</p><a class="ulink" href="shop.html">Continue shopping</a></div>`;
      $("#done-h").focus(); scrollTo({top:0, behavior:"smooth"});
    });
    draw();
  }

  /* ---- size finder ---- */
  const sf = $("#size-finder");
  if (sf){
    const chart = [["XS",31,24,34],["S",33,26,36],["M",35,28,38],["L",38,31,41],["XL",41,34,44]]; let unit = "in";
    const run = () => {
      const k = unit === "cm" ? 1/2.54 : 1; const b = +$("#sf-bust").value*k, w = +$("#sf-waist").value*k, h = +$("#sf-hip").value*k;
      $$(".stable tr").forEach(r=>r.classList.remove("hit"));
      if (!b || !w || !h){ $("#sf-size").textContent = "—"; $("#sf-note").textContent = "Enter all three measurements to see your size."; return; }
      const pick = (m,col) => { const i = chart.findIndex(r => m <= r[col] + 0.5); return i === -1 ? chart.length : i; };
      const ib = pick(b,1), iw = pick(w,2), ih = pick(h,3); const i = Math.max(ib, iw, ih);
      if (i >= chart.length){ $("#sf-size").textContent = "XL+"; $("#sf-note").textContent = "Your measurements are above our current size range. Our studio can advise on relaxed-fit pieces — just get in touch."; return; }
      const sz = chart[i][0]; $("#sf-size").textContent = sz; $(`.stable tr[data-s="${sz}"]`)?.classList.add("hit");
      $("#sf-note").textContent = (Math.max(ib,iw,ih) !== Math.min(ib,iw,ih)) ? "Your measurements span two sizes. We've suggested the larger — for wrap and elasticated styles you may prefer the smaller." : "This size should fit you across bust, waist and hip.";
    };
    $$(".unit button", sf).forEach(b => b.addEventListener("click", () => { unit = b.dataset.unit; $$(".unit button", sf).forEach(x=>x.setAttribute("aria-pressed", x===b)); $$(".u", sf).forEach(x=>x.textContent = unit); run(); }));
    sf.addEventListener("input", run); run();
  }

  /* ---- contact ---- */
  const cf = $("#contact-form");
  if (cf){
    cf.addEventListener("submit", async e => {
      e.preventDefault(); $(".msg", cf)?.remove(); const v = id => $("#"+id).value.trim(); let ok = true;
      if (bad($("#c-name"), v("c-name").length < 2)) ok = false;
      if (bad($("#c-email"), !validEmail(v("c-email")))) ok = false;
      if (bad($("#c-topic"), !v("c-topic"))) ok = false;
      if (bad($("#c-msg"), v("c-msg").length < 15)) ok = false;
      if (bad($("#c-agree"), !$("#c-agree").checked)) ok = false;
      if (!ok) return;
      const d = {name:v("c-name"), email:v("c-email"), order:v("c-order"), topic:v("c-topic"), message:v("c-msg")};
      const sent = await send("contact", d);
      if (sent){ cf.reset(); say(cf, "Thank you — your message is with our studio team. We reply within one business day.", "ok"); }
      else { say(cf, "Opening your email app so you can send this message to us…", "info");
        location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Website message: "+d.topic)}&body=${encodeURIComponent(`Name: ${d.name}\nEmail: ${d.email}\nOrder: ${d.order||"-"}\n\n${d.message}`)}`; }
    });
  }
})();
