/* Checkout page: order summary from the persisted cart, a shipping/payment
   form, and a confirmation step. No real payment is processed — this is a
   front-end demo, so "placing" an order just mints a reference and clears
   the cart. Depends on products.js and main.js. */

const SHIPPING_FLAT = 5;
const FREE_SHIP_THRESHOLD = 45;

function shippingCost(subtotal) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIPPING_FLAT;
}

function orderNumber() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return "MSC-" + n;
}

function summaryMarkup() {
  const subtotal = cartTotal();
  const ship = shippingCost(subtotal);
  const total = subtotal + ship;
  const rows = cart.items.map((i) => {
    const p = PRODUCTS.find((x) => x.id === i.id);
    return `
      <div class="summary__item">
        <div class="summary__thumb">${productMedia(p, "thumb")}</div>
        <div>
          <div class="summary__name">${p.name}</div>
          <div class="summary__qty">${p.origin} · Qty ${i.qty}</div>
        </div>
        <div class="summary__price">$${(p.price * i.qty).toFixed(2)}</div>
      </div>`;
  }).join("");

  return `
    <h2>Order summary</h2>
    ${rows}
    <div class="summary__line"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="summary__line"><span>Shipping</span><span>${ship === 0 ? "Free" : "$" + ship.toFixed(2)}</span></div>
    <div class="summary__total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
    <p class="summary__note">${subtotal >= FREE_SHIP_THRESHOLD
      ? "You've unlocked free shipping."
      : "Add $" + (FREE_SHIP_THRESHOLD - subtotal).toFixed(2) + " more for free shipping."}</p>`;
}

function renderCheckout() {
  const root = document.getElementById("checkout");
  if (!root) return;

  if (cart.items.length === 0) {
    root.innerHTML = `
      <div class="checkout__empty">
        <h1>Your cart is empty</h1>
        <p>Nothing to check out yet — go find something worth brewing.</p>
        <a class="btn btn--solid" href="shop.html">Browse the roasts</a>
      </div>`;
    return;
  }

  root.className = "checkout";
  root.innerHTML = `
    <form class="checkout__form" id="checkoutForm" novalidate>
      <div class="checkout__head">
        <h1>Checkout</h1>
        <p>Roasted to order and shipped within 24 hours. This is a demo storefront — no card is charged.</p>
      </div>

      <div class="form-legend">Contact</div>
      <div class="field">
        <label for="co-name">Full name</label>
        <input id="co-name" name="name" autocomplete="name" required />
      </div>
      <div class="field">
        <label for="co-email">Email</label>
        <input id="co-email" name="email" type="email" autocomplete="email" required />
      </div>

      <div class="form-legend">Shipping address</div>
      <div class="field">
        <label for="co-addr">Street address</label>
        <input id="co-addr" name="address" autocomplete="street-address" required />
      </div>
      <div class="field-row">
        <div class="field">
          <label for="co-city">City</label>
          <input id="co-city" name="city" autocomplete="address-level2" required />
        </div>
        <div class="field">
          <label for="co-zip">Postal code</label>
          <input id="co-zip" name="zip" autocomplete="postal-code" required />
        </div>
      </div>

      <div class="form-legend">Payment</div>
      <p class="pay-hint">Demo only — use any numbers, nothing is sent anywhere.</p>
      <div class="field">
        <label for="co-card">Card number</label>
        <input id="co-card" name="card" inputmode="numeric" placeholder="4242 4242 4242 4242" required />
      </div>
      <div class="field-row">
        <div class="field">
          <label for="co-exp">Expiry</label>
          <input id="co-exp" name="exp" placeholder="MM/YY" required />
        </div>
        <div class="field">
          <label for="co-cvc">CVC</label>
          <input id="co-cvc" name="cvc" inputmode="numeric" placeholder="123" required />
        </div>
      </div>

      <button type="submit" class="btn btn--copper btn--block" id="placeOrder">
        Place order · $${(cartTotal() + shippingCost(cartTotal())).toFixed(2)}
      </button>
    </form>

    <aside class="summary" id="summary" aria-label="Order summary">
      ${summaryMarkup()}
    </aside>`;

  const form = document.getElementById("checkoutForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = form.querySelector("#co-email");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    let firstBad = null;

    form.querySelectorAll("input[required]").forEach((input) => {
      const bad = !input.value.trim() || (input === email && !emailOk);
      input.classList.toggle("invalid", bad);
      if (bad && !firstBad) firstBad = input;
    });

    if (firstBad) {
      firstBad.focus();
      showToast("Please fill in the highlighted fields.");
      return;
    }

    completeOrder(email.value.trim());
  });
}

function completeOrder(email) {
  const ref = orderNumber();

  // Order placed — clear the cart everywhere.
  cart.items = [];
  saveCart();
  updateCartUI();

  const root = document.getElementById("checkout");
  root.className = "";
  root.innerHTML = `
    <div class="checkout__confirm">
      <div class="confirm-badge" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      </div>
      <h1>Order confirmed</h1>
      <p>Thanks for your order. We're firing up the roaster now — your beans will ship within 24 hours.</p>
      <p>A confirmation is on its way to <strong>${email}</strong>.</p>
      <div class="order-ref">${ref}</div>
      <div>
        <a class="btn btn--solid" href="shop.html">Keep shopping</a>
      </div>
    </div>`;

  window.scrollTo({ top: 0, behavior: "smooth" });
}
