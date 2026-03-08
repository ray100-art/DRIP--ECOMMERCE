/* ============================================
   DRIP — checkout.js
   Handles:
   - Multi-step form navigation
   - Form validation
   - Order summary rendering
   - Promo codes
   - Card number formatting
   - Order placement + success modal
   ============================================ */

/* ===== SHIPPING COSTS =====
   Maps shipping method values to prices.
   We'll replace these with real API calls in Stage 6.
======================== */
const SHIPPING_COSTS = {
  standard:  0,
  express:   9.99,
  overnight: 19.99,
};

const TAX_RATE = 0.08; // 8%

/* ===== PROMO CODES =====
   Simple lookup table. In Stage 5 (backend)
   these will be stored in the database.
======================== */
const PROMO_CODES = {
  'DRIP30':   0.30,  // 30% off
  'SAVE10':   0.10,  // 10% off
  'WELCOME':  0.15,  // 15% off
};

/* ===== STATE ===== */
let currentStep     = 1;
let shippingMethod  = 'standard';
let promoDiscount   = 0;       // decimal e.g. 0.30 = 30%
let shippingInfo    = {};      // saved from step 2

/* ===== STEP NAVIGATION ===== */
function goToStep(n) {
  // Hide current step
  document.getElementById(`step${currentStep}`).classList.add('hidden');

  // Show new step
  document.getElementById(`step${n}`).classList.remove('hidden');

  // Update step indicators in navbar
  for (let i = 1; i <= 3; i++) {
    const el = document.getElementById(`step-indicator-${i}`);
    el.classList.remove('active', 'done');
    if (i < n)  el.classList.add('done');
    if (i === n) el.classList.add('active');
  }

  currentStep = n;

  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ===== RENDER ORDER SUMMARY ===== */
function renderSummary() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping  = SHIPPING_COSTS[shippingMethod] || 0;
  const discount  = subtotal * promoDiscount;
  const taxable   = subtotal - discount;
  const tax       = taxable * TAX_RATE;
  const total     = taxable + shipping + tax;

  // Items list
  document.getElementById('summaryItems').innerHTML = cart.map(item => `
    <div class="summary-item">
      <div class="summary-item-img">
        ${item.emoji}
        <span class="summary-item-qty">${item.qty}</span>
      </div>
      <div class="summary-item-info">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-brand">${item.brand}</div>
      </div>
      <div class="summary-item-price">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');

  // Totals
  document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summaryShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
  document.getElementById('summaryTax').textContent      = `$${tax.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent    = `$${total.toFixed(2)}`;

  // Discount row
  const discountRow = document.getElementById('discountRow');
  if (promoDiscount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('summaryDiscount').textContent = `-$${discount.toFixed(2)}`;
  } else {
    discountRow.style.display = 'none';
  }
}

/* ===== RENDER CHECKOUT CART ITEMS (Step 1) ===== */
function renderCheckoutCart() {
  const container  = document.getElementById('checkoutCartItems');
  const emptyEl    = document.getElementById('emptyCheckout');
  const actionsEl  = document.getElementById('step1Actions');

  if (cart.length === 0) {
    container.innerHTML = '';
    emptyEl.style.display     = 'flex';
    actionsEl.style.display   = 'none';
    return;
  }

  emptyEl.style.display   = 'none';
  actionsEl.style.display = 'flex';

  container.innerHTML = cart.map(item => `
    <div class="checkout-cart-item">
      <div class="checkout-item-img">${item.emoji}</div>
      <div class="checkout-item-info">
        <div class="checkout-item-name">${item.name}</div>
        <div class="checkout-item-brand">${item.brand}</div>
        <div class="checkout-item-qty-row">
          <button class="qty-btn" onclick="checkoutChangeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="checkoutChangeQty(${item.id}, 1)">+</button>
          <button class="cart-item-remove" onclick="checkoutRemove(${item.id})" title="Remove">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
      <div class="checkout-item-price">$${(item.price * item.qty).toFixed(2)}</div>
    </div>
  `).join('');
}

/* Qty / remove helpers that refresh checkout view */
window.checkoutChangeQty = function(id, change) {
  changeQty(id, change);   // from app.js
  renderCheckoutCart();
  renderSummary();
};
window.checkoutRemove = function(id) {
  removeFromCart(id);       // from app.js
  renderCheckoutCart();
  renderSummary();
};

/* ===== FORM VALIDATION ===== */
function validateField(id, errorId, rule, message) {
  const input = document.getElementById(id);
  const error = document.getElementById(errorId);
  if (!rule(input.value)) {
    input.classList.add('error');
    error.textContent = message;
    return false;
  }
  input.classList.remove('error');
  error.textContent = '';
  return true;
}

function validateShippingForm() {
  let valid = true;

  valid = validateField('firstName', 'firstNameError',
    v => v.trim().length >= 2, 'Please enter your first name.') && valid;

  valid = validateField('lastName', 'lastNameError',
    v => v.trim().length >= 2, 'Please enter your last name.') && valid;

  valid = validateField('email', 'emailError',
    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Please enter a valid email.') && valid;

  valid = validateField('address', 'addressError',
    v => v.trim().length >= 5, 'Please enter your street address.') && valid;

  valid = validateField('city', 'cityError',
    v => v.trim().length >= 2, 'Please enter your city.') && valid;

  valid = validateField('zip', 'zipError',
    v => v.trim().length >= 3, 'Please enter your ZIP code.') && valid;

  valid = validateField('state', 'stateError',
    v => v.trim().length >= 1, 'Please enter your state.') && valid;

  valid = validateField('country', 'countryError',
    v => v !== '', 'Please select your country.') && valid;

  return valid;
}

function validatePaymentForm() {
  let valid = true;

  valid = validateField('cardNumber', 'cardNumberError',
    v => v.replace(/\s/g, '').length === 16, 'Please enter a valid 16-digit card number.') && valid;

  valid = validateField('expiry', 'expiryError',
    v => /^\d{2}\s?\/\s?\d{2}$/.test(v), 'Please enter expiry as MM / YY.') && valid;

  valid = validateField('cvv', 'cvvError',
    v => /^\d{3}$/.test(v), 'Please enter a 3-digit CVV.') && valid;

  valid = validateField('cardName', 'cardNameError',
    v => v.trim().length >= 3, 'Please enter the name on your card.') && valid;

  return valid;
}

/* ===== SAVE SHIPPING INFO & RENDER SUMMARY ===== */
function saveShippingInfo() {
  shippingInfo = {
    name:     `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
    email:    document.getElementById('email').value,
    address:  document.getElementById('address').value,
    city:     document.getElementById('city').value,
    zip:      document.getElementById('zip').value,
    state:    document.getElementById('state').value,
    country:  document.getElementById('country').value,
    method:   shippingMethod,
  };

  // Show shipping summary at top of step 3
  const summary = document.getElementById('shippingSummary');
  const methodLabel = { standard:'Standard Shipping', express:'Express Shipping', overnight:'Overnight Shipping' };
  summary.innerHTML = `
    <span class="edit-link" onclick="goToStep(2)">Edit</span>
    <strong>${shippingInfo.name}</strong><br/>
    ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zip}<br/>
    ${shippingInfo.state}, ${shippingInfo.country}<br/>
    <strong>Shipping:</strong> ${methodLabel[shippingMethod]}
  `;
}

/* ===== PROMO CODE ===== */
document.getElementById('applyPromoBtn')?.addEventListener('click', () => {
  const code    = document.getElementById('promoInput').value.trim().toUpperCase();
  const msgEl   = document.getElementById('promoMessage');
  const discount = PROMO_CODES[code];

  if (discount) {
    promoDiscount = discount;
    msgEl.className = 'promo-message success';
    msgEl.textContent = `✓ Code applied — ${discount * 100}% off!`;
    renderSummary();
  } else {
    promoDiscount = 0;
    msgEl.className = 'promo-message error';
    msgEl.textContent = 'Invalid promo code. Try DRIP30.';
    renderSummary();
  }
});

/* ===== CARD NUMBER FORMATTING =====
   Adds a space every 4 digits as you type:
   1234 5678 9012 3456
======================== */
document.getElementById('cardNumber')?.addEventListener('input', e => {
  let value = e.target.value.replace(/\D/g, '').substring(0, 16);
  e.target.value = value.replace(/(.{4})/g, '$1 ').trim();
});

/* ===== EXPIRY FORMATTING =====
   Auto-inserts " / " after 2 digits
======================== */
document.getElementById('expiry')?.addEventListener('input', e => {
  let value = e.target.value.replace(/\D/g, '').substring(0, 4);
  if (value.length >= 3) value = value.substring(0, 2) + ' / ' + value.substring(2);
  e.target.value = value;
});

/* ===== SHIPPING METHOD CHANGE ===== */
document.querySelectorAll('input[name="shipping"]').forEach(radio => {
  radio.addEventListener('change', e => {
    shippingMethod = e.target.value;
    renderSummary();
  });
});

/* ===== STEP BUTTONS ===== */

// Step 1 → Step 2
document.getElementById('toStep2Btn')?.addEventListener('click', () => {
  if (cart.length > 0) goToStep(2);
});

// Step 2 back → Step 1
document.getElementById('backToStep1Btn')?.addEventListener('click', () => goToStep(1));

// Step 2 → Step 3
document.getElementById('toStep3Btn')?.addEventListener('click', () => {
  if (validateShippingForm()) {
    saveShippingInfo();
    goToStep(3);
  }
});

// Step 3 back → Step 2
document.getElementById('backToStep2Btn')?.addEventListener('click', () => goToStep(2));

/* ===== PLACE ORDER ===== */
document.getElementById('placeOrderBtn')?.addEventListener('click', async () => {
  if (!validatePaymentForm()) return;

  // Show loading state on button
  const btn = document.getElementById('placeOrderBtn');
  btn.disabled  = true;
  btn.innerHTML = '<i class="bi bi-hourglass-split"></i> Processing...';

  // Build order totals
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = SHIPPING_COSTS[shippingMethod] || 0;
  const discount = subtotal * promoDiscount;
  const taxable  = subtotal - discount;
  const tax      = taxable * TAX_RATE;
  const total    = taxable + shipping + tax;

  // Build the order object to send to Spring Boot
  const orderPayload = {
    email:          shippingInfo.email,
    firstName:      document.getElementById('firstName').value,
    lastName:       document.getElementById('lastName').value,
    address:        document.getElementById('address').value,
    city:           document.getElementById('city').value,
    state:          document.getElementById('state').value,
    zip:            document.getElementById('zip').value,
    shippingMethod: shippingMethod,
    items:          cart.map(i => ({
                      productId: String(i.id),
                      name:      i.name,
                      brand:     i.brand,
                      emoji:     i.emoji,
                      price:     i.price,
                      qty:       i.qty
                    })),
    subtotal:       subtotal,
    shippingCost:   shipping,
    discount:       discount,
    total:          total
  };

  try {
    const token = getToken();
const res = await fetch('http://localhost:8080/api/orders', {
  method:  'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  },
  body: JSON.stringify(orderPayload)
});
    if (!res.ok) throw new Error('Order failed');

    const savedOrder = await res.json();

    // Show success with real MongoDB order ID
    document.getElementById('orderNumber').textContent  = '#DRP-' + savedOrder.id.slice(-6).toUpperCase();
    document.getElementById('confirmEmail').textContent = shippingInfo.email || 'your email';

    // Clear the cart
    cart = [];
    saveCart();
    updateCartUI();

    // Show success modal
    document.getElementById('successOverlay').classList.add('open');

  } catch (err) {
    console.error('Order error:', err);
    alert('Something went wrong. Please try again.');

    // Reset button so user can try again
    btn.disabled  = false;
    btn.innerHTML = '<i class="bi bi-lock-fill"></i> Place Order';
  }
});
/* ===== MOBILE: TOGGLE ORDER SUMMARY ===== */
document.getElementById('toggleSummary')?.addEventListener('click', () => {
  const body = document.getElementById('summaryBody');
  const icon = document.querySelector('#toggleSummary i');
  body.classList.toggle('collapsed');
  icon.className = body.classList.contains('collapsed')
    ? 'bi bi-chevron-down' : 'bi bi-chevron-up';
});

/* ===== INLINE VALIDATION (real-time) =====
   Remove error state as soon as user starts typing
======================== */
['firstName','lastName','email','address','city','zip','state'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = '';
  });
});
['cardNumber','expiry','cvv','cardName'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = '';
  });
});

/* ===== INIT ===== */
renderCheckoutCart();
renderSummary();