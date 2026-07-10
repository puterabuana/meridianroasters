/* Product detail page: dynamic content, SEO tags, and Product JSON-LD.
   Depends on products.js and main.js */

function renderProduct() {
  const pdp = document.getElementById("pdp");
  if (!pdp) return;

  const id = new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];

  // --- Dynamic SEO ---
  document.title = `${p.name} — ${p.origin} Coffee | Meridian Supply Co.`;
  setMeta("description", `${p.blurb} Tasting notes: ${p.notes.join(", ")}. $${p.price} per ${p.weight}, roasted to order.`);
  const canonical = document.getElementById("canonical");
  if (canonical) canonical.href = `https://meridianroasters.com/product.html?id=${p.id}`;
  document.getElementById("crumb-name").textContent = p.name;

  // --- Product structured data ---
  injectJSONLD({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${p.name} — ${p.origin}`,
    "description": p.blurb,
    "brand": { "@type": "Brand", "name": "Meridian Supply Co." },
    "category": "Specialty Coffee",
    "offers": {
      "@type": "Offer",
      "price": p.price.toFixed(2),
      "priceCurrency": "USD",
      "availability": p.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://meridianroasters.com/product.html?id=${p.id}`
    },
    "additionalProperty": [
      { "@type": "PropertyValue", "name": "Roast", "value": p.roast },
      { "@type": "PropertyValue", "name": "Process", "value": p.process },
      { "@type": "PropertyValue", "name": "Altitude", "value": p.altitude }
    ]
  });

  // --- Render ---
  const action = p.stock
    ? `<button class="btn btn--copper" id="pdpAdd">Add to cart · $${p.price}</button>`
    : `<span class="card__soldout">Currently sold out</span>`;

  pdp.innerHTML = `
    <div class="pdp__visual">
      ${productMedia(p, "card")}
      <span class="pdp__coords">${p.coords}</span>
    </div>
    <div class="pdp__info">
      <p class="pdp__origin">${p.origin}${p.tag ? " · " + p.tag : ""}</p>
      <h1 class="pdp__name">${p.name}</h1>
      <p class="pdp__price">$${p.price} <small>/ ${p.weight}</small></p>
      <p class="pdp__blurb">${p.blurb}</p>
      <div class="pdp__notes">
        ${p.notes.map((n) => `<span>${n}</span>`).join("")}
      </div>
      <table class="spec-table">
        <tbody>
          <tr><th scope="row">Roast level</th><td>${p.roast}</td></tr>
          <tr><th scope="row">Process</th><td>${p.process}</td></tr>
          <tr><th scope="row">Altitude</th><td>${p.altitude}</td></tr>
          <tr><th scope="row">Weight</th><td>${p.weight}</td></tr>
          <tr><th scope="row">Availability</th><td>${p.stock ? "In stock · ships in 24h" : "Sold out"}</td></tr>
        </tbody>
      </table>
      <div class="pdp__buy">
        <div class="qty" ${p.stock ? "" : "hidden"}>
          <button id="qtyDown" aria-label="Decrease quantity">−</button>
          <span id="qtyVal">1</span>
          <button id="qtyUp" aria-label="Increase quantity">+</button>
        </div>
        ${action}
      </div>
    </div>`;

  // Qty + add
  let qty = 1;
  const qtyVal = document.getElementById("qtyVal");
  document.getElementById("qtyDown")?.addEventListener("click", () => { qty = Math.max(1, qty - 1); qtyVal.textContent = qty; });
  document.getElementById("qtyUp")?.addEventListener("click", () => { qty += 1; qtyVal.textContent = qty; });
  document.getElementById("pdpAdd")?.addEventListener("click", () => { addToCart(p.id, qty); openDrawer(); });

  // Related
  const related = document.getElementById("related-grid");
  if (related) {
    const others = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 4);
    related.innerHTML = others.map(productCard).join("");
    bindAddButtons(related);
  }
}

function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
  el.content = content;
}

function injectJSONLD(obj) {
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(obj);
  document.head.appendChild(s);
}
