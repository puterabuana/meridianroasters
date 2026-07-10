/* Shop page: filtering + rendering. Depends on products.js and main.js */

function matchesFilter(product, filter) {
  if (filter === "all") return true;
  if (filter === "Blend") return product.roast === "Blend" || product.process === "Blend";
  if (filter === "Decaf") return /decaf/i.test(product.process) || /decaf/i.test(product.origin);
  if (filter === "Light") return /light/i.test(product.roast);
  if (filter === "Medium") return /^medium/i.test(product.roast);
  if (filter === "Dark") return /dark/i.test(product.roast);
  return true;
}

function renderShop() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;

  const params = new URLSearchParams(location.search);
  let activeFilter = params.get("filter") || "all";
  const searchQuery = (params.get("q") || "").toLowerCase();

  const draw = (filter) => {
    let list = PRODUCTS.filter((p) => matchesFilter(p, filter));
    if (searchQuery) {
      list = list.filter((p) =>
        (p.name + p.origin + p.notes.join(" ")).toLowerCase().includes(searchQuery)
      );
    }
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<p class="cart-empty">No roasts match that filter yet.</p>`;
    bindAddButtons(grid);
    const count = document.getElementById("resultCount");
    if (count) count.textContent = `${list.length} ${list.length === 1 ? "roast" : "roasts"}`;
  };

  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach((chip) => {
    const isActive = chip.dataset.filter === activeFilter;
    chip.setAttribute("aria-pressed", isActive);
    chip.addEventListener("click", () => {
      activeFilter = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute("aria-pressed", c === chip));
      draw(activeFilter);
      const url = new URL(location);
      if (activeFilter === "all") url.searchParams.delete("filter");
      else url.searchParams.set("filter", activeFilter);
      history.replaceState({}, "", url);
    });
  });

  draw(activeFilter);
}
