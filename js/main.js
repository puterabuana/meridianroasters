/* =========================================================================
   MERIDIAN ROASTERS — APP LOGIC
   Header/footer injection · cart (in-memory) · product rendering · UI
   ========================================================================= */

/* ---------- Header & Footer ---------- */
function currentPage() {
  const path = location.pathname.split("/").pop() || "index.html";
  return path === "" ? "index.html" : path;
}

/* ---------- Graphics (self-contained SVG illustrations) ---------- */
// Lighten (amt > 0) or darken (amt < 0) a #rrggbb hex color.
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((t - r) * p) + r;
  g = Math.round((t - g) * p) + g;
  b = Math.round((t - b) * p) + b;
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Product visual: real photo when the product has one, else the illustrated
// coffee bag as a graceful fallback (so a new product never shows a broken img).
function productMedia(p, mode = "card") {
  if (p.image) {
    const alt = mode === "thumb" ? "" : `${p.name} — ${p.origin} specialty coffee`;
    const loading = mode === "feature" ? ' fetchpriority="high"' : mode === "thumb" ? "" : ' loading="lazy"';
    return `<img class="product-photo" src="${p.image}" width="1000" height="800" alt="${alt}" decoding="async"${loading}
      onerror="this.outerHTML=bagArt(PRODUCTS.find(x=>x.id==='${p.id}'),'${mode}')" />`;
  }
  return bagArt(p, mode);
}

// Illustrated coffee-bag "product photo", tinted from p.color. No external assets.
function bagArt(p, mode = "card") {
  const uid = "b" + p.id.replace(/[^a-z0-9]/gi, "");
  const top = shade(p.color, 0.22);
  const base = p.color;
  const bot = shade(p.color, -0.18);
  const deep = shade(p.color, -0.32);

  if (mode === "thumb") {
    return `
    <svg class="bag-art" viewBox="0 0 64 64" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="${uid}t" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bot}"/>
        </linearGradient>
      </defs>
      <rect width="64" height="64" fill="#ece0ce"/>
      <rect width="64" height="64" fill="${base}" opacity="0.12"/>
      <rect x="17" y="11" width="30" height="7" rx="2" fill="${deep}"/>
      <rect x="19" y="16" width="26" height="40" rx="5" fill="url(#${uid}t)"/>
      <rect x="25" y="30" width="14" height="18" rx="2" fill="#f6efe2"/>
      <circle cx="32" cy="25" r="3" fill="${deep}"/>
    </svg>`;
  }

  const grid = [];
  for (let x = 40; x < 320; x += 40) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="300"/>`);
  for (let y = 40; y < 300; y += 40) grid.push(`<line x1="0" y1="${y}" x2="320" y2="${y}"/>`);
  const crimp = [];
  for (let i = 0; i < 11; i++) crimp.push(`<line x1="${110 + i * 9}" y1="52" x2="${110 + i * 9}" y2="66"/>`);
  const longName = p.name.length > 9 ? ` textLength="72" lengthAdjust="spacingAndGlyphs"` : "";
  const dots = ["#c06b3e", "#6f7a5a", top]
    .map((c, i) => `<circle cx="${138 + i * 22}" cy="202" r="4.5" fill="${c}"/>`).join("");

  return `
  <svg class="bag-art" viewBox="0 0 320 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="${uid}b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${top}"/>
        <stop offset="0.55" stop-color="${base}"/>
        <stop offset="1" stop-color="${bot}"/>
      </linearGradient>
      <linearGradient id="${uid}c" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#000" stop-opacity="0.30"/>
        <stop offset="0.16" stop-color="#000" stop-opacity="0"/>
        <stop offset="0.5" stop-color="#fff" stop-opacity="0.22"/>
        <stop offset="0.84" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.34"/>
      </linearGradient>
    </defs>
    <rect width="320" height="300" fill="#ece0ce"/>
    <rect width="320" height="300" fill="${base}" opacity="0.13"/>
    <g stroke="#b89b76" stroke-width="0.6" opacity="0.22">${grid.join("")}</g>
    <ellipse cx="160" cy="118" rx="150" ry="120" fill="#ffffff" opacity="0.28"/>
    <ellipse cx="160" cy="252" rx="72" ry="14" fill="#3a2415" opacity="0.18"/>
    <rect x="104" y="50" width="112" height="18" rx="3" fill="${deep}"/>
    <g stroke="${shade(p.color, -0.45)}" stroke-width="1" opacity="0.55">${crimp.join("")}</g>
    <rect x="110" y="64" width="100" height="180" rx="12" fill="url(#${uid}b)"/>
    <rect x="110" y="64" width="100" height="180" rx="12" fill="url(#${uid}c)"/>
    <circle cx="160" cy="90" r="8" fill="${deep}"/>
    <circle cx="160" cy="90" r="3.4" fill="${shade(p.color, -0.5)}"/>
    <rect x="120" y="112" width="80" height="114" rx="5" fill="#f6efe2"/>
    <g transform="translate(160 132) rotate(-18)">
      <ellipse cx="0" cy="0" rx="5" ry="8.2" fill="${base}"/>
      <path d="M0 -7.5 C -3 -4 3 0 0 3.5 S -3 8 0 11.5" fill="none" stroke="#f6efe2" stroke-width="1.3" stroke-linecap="round"/>
    </g>
    <text x="160" y="162" text-anchor="middle" font-family="'Spline Sans Mono',monospace" font-size="8" letter-spacing="1.2" fill="#b06a3c">${p.origin.toUpperCase()}</text>
    <text x="160" y="184" text-anchor="middle" font-family="Fraunces,serif" font-weight="600" font-size="16" fill="#2b1a12"${longName}>${p.name}</text>
    ${dots}
  </svg>`;
}

// Rotating rubber stamp for the hero — circular trade-seal text around a bean.
function stampMark() {
  return `
  <svg viewBox="0 0 120 120" role="img" aria-label="Meridian Roasters direct-trade seal">
    <defs>
      <path id="stamp-arc" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
    </defs>
    <circle cx="60" cy="60" r="57" fill="var(--cream)" stroke="var(--ink)" stroke-width="2"/>
    <circle cx="60" cy="60" r="48" fill="none" stroke="var(--ink)" stroke-width="1"/>
    <text font-family="var(--fm), monospace" font-size="9" font-weight="500"
          letter-spacing="3.1" fill="var(--ink)">
      <textPath href="#stamp-arc" startOffset="0">
        MERIDIAN ROASTERS · DIRECT TRADE · ROASTED TO ORDER ·
      </textPath>
    </text>
    <g transform="rotate(-20 60 60)">
      <ellipse cx="60" cy="60" rx="11" ry="17" fill="var(--rust)"/>
      <path d="M60 44 C 54 50 66 54 60 60 S 54 70 60 76" fill="none" stroke="var(--cream)" stroke-width="2.4" stroke-linecap="round"/>
    </g>
  </svg>`;
}

// Brand logo: an espresso "coordinate coin" with meridian lines and a coffee bean.
function brandMark() {
  return `
  <svg class="brand__logo" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <circle cx="16" cy="16" r="15" fill="var(--espresso)"/>
    <circle cx="16" cy="16" r="15" fill="none" stroke="var(--copper)" stroke-width="1.2"/>
    <g fill="none" stroke="var(--copper)" stroke-width="0.9" opacity="0.55">
      <line x1="2" y1="16" x2="30" y2="16"/>
      <ellipse cx="16" cy="16" rx="6.5" ry="14.6"/>
      <ellipse cx="16" cy="16" rx="12" ry="14.6"/>
    </g>
    <g transform="rotate(-20 16 16)">
      <ellipse cx="16" cy="16" rx="5" ry="8.2" fill="var(--cream)"/>
      <path d="M16 8.5 C 12.8 11.5 19.2 13 16 16 S 12.8 20.5 16 23.5" fill="none" stroke="var(--espresso)" stroke-width="1.4" stroke-linecap="round"/>
    </g>
  </svg>`;
}


function renderChrome() {
  const page = currentPage();
  const active = (p) => (page === p ? ' aria-current="page"' : "");

  const header = `
    <div class="topbar">
      <div class="topbar__inner">
        <span>Free worldwide shipping over $45</span>
        <span class="topbar__sep" aria-hidden="true">◦</span>
        <span>Roasted to order · shipped in 24h</span>
        <span class="topbar__sep" aria-hidden="true">◦</span>
        <span>Exporting to 40+ countries</span>
      </div>
    </div>
    <header class="site-header">
      <div class="site-header__inner">
        <button class="nav-toggle" id="navToggle" aria-label="Toggle menu" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
        </button>
        <a class="brand" href="index.html">
          ${brandMark()}
          <span class="brand__word">Meridian</span> <span class="brand__mark">ROASTERS</span>
        </a>
        <form class="search" id="searchForm" role="search">
          <svg class="search__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3" stroke-linecap="round"/></svg>
          <input class="search__input" id="searchInput" type="search" placeholder="Search origins, roasts, notes…" aria-label="Search the shop" autocomplete="off" />
        </form>
        <div class="header-actions">
          <a class="header-link" href="about.html"${active("about.html")}>Our story</a>
          <button class="cart-btn" id="cartBtn" aria-label="Open cart">
            <svg class="cart-btn__icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z" stroke-linejoin="round"/><path d="M9 7a3 3 0 0 1 6 0" stroke-linecap="round"/></svg>
            <span class="cart-btn__count" id="cartCount">0</span>
            <span class="cart-btn__sub" id="cartSubtotal">$0.00</span>
          </button>
        </div>
      </div>
      <nav class="shopnav" aria-label="Shop categories">
        <ul class="shopnav__list" id="shopnavList">
          <li><a href="index.html" data-cat="all">All roasts</a></li>
          <li><a href="index.html?cat=single" data-cat="single">Single origin</a></li>
          <li><a href="index.html?cat=blends" data-cat="blends">Blends</a></li>
          <li><a href="index.html?cat=decaf" data-cat="decaf">Decaf</a></li>
          <li><a href="index.html#wholesale">Wholesale · Export</a></li>
          <li><a href="about.html"${active("about.html")}>Our story</a></li>
        </ul>
        <span class="shopnav__note">◦ In stock · ships in 24h</span>
      </nav>
    </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="site-footer__brand">
          <a class="brand" href="index.html">${brandMark()}<span class="brand__word">Meridian</span> <span class="brand__mark">ROASTERS</span></a>
          <p>Small-batch specialty coffee, roasted to order in Portland, Oregon since 2019.</p>
        </div>
        <div class="footcol">
          <h4>Shop</h4>
          <ul>
            <li><a href="index.html">All roasts</a></li>
            <li><a href="index.html?cat=single">Single origin</a></li>
            <li><a href="index.html?cat=blends">Blends</a></li>
            <li><a href="index.html?cat=decaf">Decaf</a></li>
          </ul>
        </div>
        <div class="footcol">
          <h4>Trade</h4>
          <ul>
            <li><a href="index.html#wholesale">Wholesale &amp; export</a></li>
            <li><a href="mailto:hello@meridianroasters.com?subject=Wholesale%20enquiry">Request pricing</a></li>
            <li><a href="about.html">Our sourcing</a></li>
            <li><a href="mailto:hello@meridianroasters.com">Contact</a></li>
          </ul>
        </div>
        <div class="footcol">
          <h4>Resources</h4>
          <ul>
            <li><a href="index.html#newsletter">Newsletter</a></li>
            <li><a href="sitemap.xml">XML sitemap</a></li>
            <li><a href="llms.txt">AI site guide</a></li>
          </ul>
        </div>
      </div>
      <div class="site-footer__bottom">
        <span>© 2019–2026 Meridian Roasters.</span>
        <span>Portland, OR · Roasted with care</span>
      </div>
    </footer>

    <!-- Cart drawer -->
    <div class="drawer-overlay" id="drawerOverlay"></div>
    <aside class="drawer" id="drawer" aria-label="Shopping cart" aria-hidden="true">
      <div class="drawer__head">
        <h2>Your cart</h2>
        <button class="drawer__close" id="drawerClose" aria-label="Close cart">×</button>
      </div>
      <div class="drawer__body" id="drawerBody"></div>
      <div class="drawer__foot">
        <div class="drawer__total"><span>Subtotal</span><span id="cartTotal">$0.00</span></div>
        <button class="btn btn--copper btn--block" id="checkoutBtn">Checkout</button>
        <p class="drawer__note">Free shipping over $45 · Roasted & shipped within 24h</p>
      </div>
    </aside>
    <div class="toast" id="toast"></div>`;

  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;
}

/* ---------- Cart (persisted to localStorage) ---------- */
const cart = { items: [] };
const CART_KEY = "msc_cart";

function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart.items)); } catch (e) {}
}
function loadCart() {
  try {
    const data = JSON.parse(localStorage.getItem(CART_KEY));
    if (Array.isArray(data)) {
      cart.items = data.filter((i) => i && PRODUCTS.some((p) => p.id === i.id) && i.qty > 0);
    }
  } catch (e) {}
}

function addToCart(id, qty = 1) {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return;
  const existing = cart.items.find((i) => i.id === id);
  if (existing) existing.qty += qty;
  else cart.items.push({ id, qty });
  updateCartUI();
  showToast(`${product.name} added to cart`);
}

function changeQty(id, delta) {
  const item = cart.items.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.items = cart.items.filter((i) => i.id !== id);
  updateCartUI();
}

function removeItem(id) {
  cart.items = cart.items.filter((i) => i.id !== id);
  updateCartUI();
}

function cartTotal() {
  return cart.items.reduce((sum, i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return sum + (p ? p.price * i.qty : 0);
  }, 0);
}

function updateCartUI() {
  const count = cart.items.reduce((s, i) => s + i.qty, 0);
  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartTotal");
  const subEl = document.getElementById("cartSubtotal");
  const body = document.getElementById("drawerBody");
  if (countEl) countEl.textContent = count;
  if (totalEl) totalEl.textContent = "$" + cartTotal().toFixed(2);
  if (subEl) subEl.textContent = "$" + cartTotal().toFixed(2);
  saveCart();

  if (!body) return;
  if (cart.items.length === 0) {
    body.innerHTML = `<p class="cart-empty">Your cart is empty.<br>Time to fix that.</p>`;
    return;
  }
  body.innerHTML = cart.items.map((i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return `
      <div class="cart-item">
        <div class="cart-item__thumb">${productMedia(p, "thumb")}</div>
        <div class="cart-item__info">
          <div class="cart-item__row">
            <div class="cart-item__name">${p.name}</div>
            <button class="cart-item__remove" data-remove="${p.id}" aria-label="Remove ${p.name} from cart">Remove</button>
          </div>
          <div class="cart-item__meta">${p.origin} · $${p.price.toFixed(2)}</div>
          <div class="cart-item__controls">
            <button data-qty="-1" data-id="${p.id}" aria-label="Decrease quantity">−</button>
            <span>${i.qty}</span>
            <button data-qty="1" data-id="${p.id}" aria-label="Increase quantity">+</button>
            <span class="cart-item__line">$${(p.price * i.qty).toFixed(2)}</span>
          </div>
        </div>
      </div>`;
  }).join("");

  body.querySelectorAll("[data-qty]").forEach((b) =>
    b.addEventListener("click", () => changeQty(b.dataset.id, parseInt(b.dataset.qty)))
  );
  body.querySelectorAll("[data-remove]").forEach((b) =>
    b.addEventListener("click", () => removeItem(b.dataset.remove))
  );
}

/* ---------- Drawer ---------- */
function openDrawer() {
  document.getElementById("drawer")?.classList.add("open");
  document.getElementById("drawerOverlay")?.classList.add("open");
  document.getElementById("drawer")?.setAttribute("aria-hidden", "false");
}
function closeDrawer() {
  document.getElementById("drawer")?.classList.remove("open");
  document.getElementById("drawerOverlay")?.classList.remove("open");
  document.getElementById("drawer")?.setAttribute("aria-hidden", "true");
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Commerce helpers ---------- */
// Deterministic pseudo rating/reviews from the id, so the catalog reads like
// a real shop without hand-maintaining review data.
function ratingFor(p) {
  let h = 0;
  for (const c of p.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { stars: (4.5 + (h % 5) / 10).toFixed(1), reviews: 40 + (h % 280) };
}

function matchesFilter(product, filter) {
  if (!filter || filter === "all") return true;
  if (filter === "Blend") return product.roast === "Blend" || product.process === "Blend";
  if (filter === "Decaf") return /decaf/i.test(product.process) || /decaf/i.test(product.origin);
  if (filter === "Light") return /light/i.test(product.roast);
  if (filter === "Medium") return /^medium/i.test(product.roast);
  if (filter === "Dark") return /dark/i.test(product.roast);
  return true;
}

function matchesCat(p, cat) {
  if (!cat || cat === "all") return true;
  if (cat === "single") return !/blend|decaf/i.test(p.origin) && !/blend|decaf/i.test(p.process);
  if (cat === "blends") return /blend/i.test(p.origin) || /blend/i.test(p.process);
  if (cat === "decaf") return /decaf/i.test(p.origin) || /decaf/i.test(p.process);
  return true;
}

function sortList(list, sort) {
  const arr = [...list];
  if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
  else if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
  else arr.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  return arr;
}

/* ---------- Product card (shop card) ---------- */
function productCard(p) {
  const r = ratingFor(p);
  const tag = p.tag ? `<span class="card__bagtag">${p.tag}</span>` : "";
  const stock = p.stock
    ? `<span class="card__stock">In stock</span>`
    : `<span class="card__stock card__stock--out">Sold out</span>`;
  const action = p.stock
    ? `<button class="add-btn add-btn--block" data-add="${p.id}" aria-label="Add ${p.name} to cart">Add to cart · $${p.price}</button>`
    : `<button class="add-btn add-btn--block" disabled>Sold out</button>`;
  return `
    <article class="card">
      <a class="card__visual" href="product.html?id=${p.id}" aria-label="${p.name}, ${p.origin}">
        ${productMedia(p, "card")}
        ${tag}
      </a>
      <div class="card__body">
        <div class="card__top">
          <span class="card__origin">${p.origin}</span>
          <span class="card__rating">★ ${r.stars} <small>(${r.reviews})</small></span>
        </div>
        <a href="product.html?id=${p.id}"><h3 class="card__name">${p.name}</h3></a>
        <p class="card__notes">${p.notes.join(" · ")}</p>
        <div class="card__foot">
          <span class="card__price">$${p.price} <small>/ ${p.weight}</small></span>
          ${stock}
        </div>
        ${action}
      </div>
    </article>`;
}

function bindAddButtons(scope = document) {
  scope.querySelectorAll("[data-add]").forEach((b) =>
    b.addEventListener("click", () => { addToCart(b.dataset.add); openDrawer(); })
  );
}

/* ---------- Homepage featured (legacy grid, if present) ---------- */
function renderFeatured() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.filter((p) => p.featured).map(productCard).join("");
  bindAddButtons(grid);
}

/* ---------- Storefront: featured buy panel ---------- */
function renderFeatureLot() {
  const el = document.getElementById("feature-lot");
  if (!el) return;
  const p = PRODUCTS.find((x) => x.featured) || PRODUCTS[0];
  const r = ratingFor(p);
  el.innerHTML = `
    <div class="flot__media">
      <div class="hero__stamp" id="hero-stamp" aria-hidden="true"></div>
      <a class="flot__img" href="product.html?id=${p.id}" aria-label="${p.name}, ${p.origin}">
        ${productMedia(p, "feature")}
      </a>
      <span class="flot__lot">Lot №07 · Featured</span>
    </div>
    <div class="flot__buy">
      <span class="flot__origin">${p.origin} · Single origin</span>
      <h1 class="flot__name">${p.name} specialty coffee</h1>
      <div class="flot__spec">${p.coords} &nbsp;·&nbsp; ${p.altitude} &nbsp;·&nbsp; ${p.process}</div>
      <p class="flot__blurb">${p.blurb}</p>
      <div class="flot__notes">${p.notes.map((n) => `<span>${n}</span>`).join("")}</div>
      <div class="flot__pricerow">
        <span class="flot__price">$${p.price}<small> / ${p.weight}</small></span>
        <span class="flot__rating">★ ${r.stars} <small>(${r.reviews} reviews)</small></span>
      </div>
      <div class="flot__actions">
        <div class="qty">
          <button id="flotDown" aria-label="Decrease quantity">−</button>
          <span id="flotQ">1</span>
          <button id="flotUp" aria-label="Increase quantity">+</button>
        </div>
        <button class="btn btn--copper" id="flotAdd">Add to cart</button>
        <a class="btn btn--ghost" href="product.html?id=${p.id}">View details</a>
      </div>
      <ul class="flot__trust">
        <li>In stock</li><li>Ships in 24h</li><li>Free over $45</li>
      </ul>
    </div>`;

  let qty = 1;
  const qv = el.querySelector("#flotQ");
  el.querySelector("#flotDown")?.addEventListener("click", () => { qty = Math.max(1, qty - 1); qv.textContent = qty; });
  el.querySelector("#flotUp")?.addEventListener("click", () => { qty += 1; qv.textContent = qty; });
  el.querySelector("#flotAdd")?.addEventListener("click", () => { addToCart(p.id, qty); openDrawer(); });
  const stamp = el.querySelector("#hero-stamp");
  if (stamp) stamp.innerHTML = stampMark();
}

/* ---------- Storefront: filterable catalog ---------- */
function renderStore() {
  const grid = document.getElementById("store-grid");
  if (!grid) return;
  const params = new URLSearchParams(location.search);
  const state = {
    cat: params.get("cat") || "all",
    roast: "all",
    origin: "all",
    q: (params.get("q") || "").toLowerCase(),
    sort: "featured",
  };

  const railOrigin = document.getElementById("railOrigin");
  if (railOrigin) {
    const origins = [...new Set(PRODUCTS.map((p) => p.origin.split(" · ")[0]))];
    railOrigin.innerHTML =
      `<button data-origin="all" aria-pressed="true">All</button>` +
      origins.map((o) => `<button data-origin="${o}">${o}</button>`).join("");
  }

  const setPressed = (sel, key, val) =>
    document.querySelectorAll(sel).forEach((b) => b.setAttribute("aria-pressed", b.dataset[key] === val));

  function apply() {
    let list = PRODUCTS.filter((p) =>
      matchesCat(p, state.cat) &&
      matchesFilter(p, state.roast) &&
      (state.origin === "all" || p.origin.split(" · ")[0] === state.origin)
    );
    if (state.q) {
      list = list.filter((p) =>
        (p.name + " " + p.origin + " " + p.notes.join(" ")).toLowerCase().includes(state.q));
    }
    list = sortList(list, state.sort);
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<p class="empty-note">No lots match those filters yet — try clearing them.</p>`;
    bindAddButtons(grid);
    const c = document.getElementById("storeCount");
    if (c) c.textContent = list.length;
    setPressed("#railRoast button", "roast", state.roast);
    setPressed("#railOrigin button", "origin", state.origin);
    setPressed("#railCat button", "cat", state.cat);
  }

  document.getElementById("railRoast")?.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return; state.roast = b.dataset.roast; apply();
  });
  document.getElementById("railOrigin")?.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return; state.origin = b.dataset.origin; apply();
  });
  document.getElementById("railCat")?.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return; state.cat = b.dataset.cat; apply();
  });
  document.getElementById("sortSelect")?.addEventListener("change", (e) => { state.sort = e.target.value; apply(); });

  const si = document.getElementById("searchInput");
  if (si) {
    si.value = state.q;
    si.addEventListener("input", () => { state.q = si.value.trim().toLowerCase(); apply(); });
  }
  document.querySelectorAll("#shopnavList a[data-cat]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      state.cat = a.dataset.cat;
      apply();
      document.querySelector(".site-header")?.classList.remove("nav-open");
      document.getElementById("shop")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  apply();
}

/* ---------- Newsletter ---------- */
function bindSignup() {
  const form = document.getElementById("signup-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const note = document.getElementById("signup-note");
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    note.textContent = valid
      ? "You're on the list. Watch your inbox for the drop."
      : "Please enter a valid email address.";
    if (valid) form.reset();
  });
}

/* ---------- Motion & scroll polish ---------- */
function bindHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Tag key elements so they fade/slide in as they enter the viewport.
function markReveal() {
  const heroSeq = [".hero__meta", ".hero__title", ".hero__lede", ".hero__actions", ".hero__stats"];
  heroSeq.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (el) { el.setAttribute("data-reveal", ""); el.style.transitionDelay = (i * 0.09) + "s"; }
  });
  const panel = document.querySelector(".hero__panel");
  if (panel) { panel.setAttribute("data-reveal", ""); panel.style.transitionDelay = "0.18s"; }

  document.querySelectorAll(
    ".section__head, .cta-band__inner, .page-head, .shop-toolbar, .pdp__visual, .pdp__info, .prose > *"
  ).forEach((el) => el.setAttribute("data-reveal", ""));

  document.querySelectorAll(".grid").forEach((g) => {
    [...g.children].forEach((c, i) => {
      c.setAttribute("data-reveal", "");
      c.style.transitionDelay = ((i % 4) * 0.07 + 0.02) + "s";
    });
  });
  document.querySelectorAll(".process__list li").forEach((c, i) => {
    c.setAttribute("data-reveal", "");
    c.style.transitionDelay = (i * 0.08) + "s";
  });
}

function setupReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window) || !targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  targets.forEach((t) => io.observe(t));
}

/* ---------- Global events ---------- */
function bindChrome() {
  bindHeaderScroll();
  document.getElementById("cartBtn")?.addEventListener("click", openDrawer);
  document.getElementById("drawerClose")?.addEventListener("click", closeDrawer);
  document.getElementById("drawerOverlay")?.addEventListener("click", closeDrawer);
  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    if (cart.items.length === 0) { showToast("Your cart is empty"); return; }
    location.href = "checkout.html";
  });
  const toggle = document.getElementById("navToggle");
  toggle?.addEventListener("click", () => {
    const header = document.querySelector(".site-header");
    const open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open);
  });

  // Search: live-filter on the storefront, otherwise route to the shop.
  document.getElementById("searchForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (document.getElementById("store-grid")) return;
    const v = (document.getElementById("searchInput").value || "").trim();
    location.href = v ? "index.html?q=" + encodeURIComponent(v) : "index.html";
  });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  bindChrome();
  loadCart();
  updateCartUI();
  renderFeatureLot();
  renderStore();
  renderFeatured();
  bindSignup();
  if (typeof renderShop === "function") renderShop();
  if (typeof renderProduct === "function") renderProduct();
  if (typeof renderCheckout === "function") renderCheckout();
  markReveal();
  setupReveal();
});
