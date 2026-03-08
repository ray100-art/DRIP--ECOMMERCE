/* ============================================
   DRIP Fashion Store — app.js
   ============================================ */

/* ===== PRODUCT DATA =====
   This is our "fake database" for now.
   In Stage 4 we will replace this with real
   MongoDB data fetched from our backend API.
========================================== */
/* ============================================
   DRIP — app.js  (Stage 2: API version)
   ============================================ */

var API_BASE = 'http://localhost:8080/api';

// Products are now loaded from the backend.
// We keep a local copy once fetched so cart
// functions (addToCart etc.) still work.
let products = [];

async function loadProducts() {
  try {
    const res  = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    products = await res.json();
    renderFeatured();   // re-render now that data is loaded
    // If we're on the products page, re-render that grid too
    if (typeof renderProducts === 'function') renderProducts();
  } catch (err) {
    console.error('Could not load products from API:', err);
  }
}

/* ===== CART STATE =====
   We store the cart in localStorage so it
   persists when the user refreshes the page.
========================================== */
let cart = JSON.parse(localStorage.getItem('drip-cart')) || [];

/* Save cart to localStorage */
function saveCart() {
  localStorage.setItem('drip-cart', JSON.stringify(cart));
}

/* ===== ADD TO CART ===== */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartUI();
  openCart();

  // Flash the button green
  const btn = document.querySelector(`[data-add-id="${productId}"]`);
  if (btn) {
    btn.classList.add('added');
    btn.innerHTML = '<i class="bi bi-check"></i> Added!';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.innerHTML = '<i class="bi bi-bag-plus"></i> Add to Bag';
    }, 1500);
  }
}

/* ===== REMOVE FROM CART ===== */
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

/* ===== CHANGE QUANTITY ===== */
function changeQty(productId, change) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) removeFromCart(productId);
  else { saveCart(); updateCartUI(); }
}

/* ===== UPDATE CART UI ===== */
function updateCartUI() {
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Update cart count badge in navbar
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = totalItems;
    countEl.classList.toggle('visible', totalItems > 0);
  }

  // Update cart item count in sidebar header
  const itemCountEl = document.getElementById('cartItemCount');
  if (itemCountEl) itemCountEl.textContent = `(${totalItems})`;

  // Update total price
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = `$${totalPrice.toFixed(2)}`;

  // Render cart items
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooterEl = document.getElementById('cartFooter');

  if (!cartItemsEl) return;

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="bi bi-bag-x"></i>
        <p>Your bag is empty</p>
        <a href="products.html" class="btn btn-primary" style="margin-top:16px;">Start Shopping</a>
      </div>`;
    if (cartFooterEl) cartFooterEl.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `).join('');
    if (cartFooterEl) cartFooterEl.style.display = 'block';
  }
}

/* ===== OPEN / CLOSE CART ===== */
function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
}
function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
}

/* ===== RENDER PRODUCT CARD ===== */
function createProductCard(product) {
  return `
    <div class="product-card" onclick="window.location='products.html'">
      <div class="product-img">
        <span style="font-size:70px">${product.emoji}</span>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <button class="product-wishlist" onclick="event.stopPropagation(); toggleWishlist(this)">
          <i class="bi bi-heart"></i>
        </button>
      </div>
      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">
          <span class="price-current">$${product.price}</span>
          ${product.oldPrice ? `<span class="price-old">$${product.oldPrice}</span>` : ''}
        </div>
        <button class="product-add-btn" data-add-id="${product.id}"
          onclick="event.stopPropagation(); addToCart(${product.id})">
          <i class="bi bi-bag-plus"></i> Add to Bag
        </button>
      </div>
    </div>
  `;
}

/* ===== WISHLIST TOGGLE ===== */
function toggleWishlist(btn) {
  btn.classList.toggle('liked');
  const icon = btn.querySelector('i');
  icon.className = btn.classList.contains('liked') ? 'bi bi-heart-fill' : 'bi bi-heart';
}

/* ===== RENDER FEATURED PRODUCTS ===== */
function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  // Show first 4 products
  grid.innerHTML = products.slice(0, 4).map(createProductCard).join('');
}

/* ===== NAVBAR: SEARCH TOGGLE ===== */
document.getElementById('searchBtn')?.addEventListener('click', () => {
  document.getElementById('searchBar')?.classList.toggle('open');
  document.getElementById('searchInput')?.focus();
});

/* ===== NAVBAR: MOBILE MENU ===== */
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
  document.getElementById('mobileMenu')?.classList.toggle('open');
});

/* ===== CART OPEN/CLOSE EVENTS ===== */
document.getElementById('cartBtn')?.addEventListener('click', openCart);
document.getElementById('closeCart')?.addEventListener('click', closeCart);
document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

/* ===== AUTO YEAR IN FOOTER ===== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== INIT ===== */
loadProducts();   // fetches products then calls renderFeatured internally
updateCartUI();