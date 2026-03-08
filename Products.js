/* ============================================
   DRIP — products.js
   Handles: filtering, sorting, searching,
            view toggle, load more
   ============================================
   NOTE: app.js must load first (has products
   array, cart functions, etc.)
   ============================================ */

/* ===== STATE =====
   We track what the user has currently
   selected so we can re-filter any time
   one thing changes.
======================== */
let state = {
  category:  'all',   // which category radio is selected
  maxPrice:  200,     // price slider value
  search:    '',      // text in the search box
  sort:      'default',
  showNew:   false,   // "New Arrivals" checkbox
  showSale:  false,   // "On Sale" checkbox
  view:      'grid',  // 'grid' or 'list'
  page:      1,       // for load-more pagination
  perPage:   6,       // products shown per page
};

/* ===== FILTER PRODUCTS =====
   Runs through the full products array and
   returns only the ones that match the state.
======================== */
function filterProducts() {
  let result = [...products]; // copy the array from app.js

  // 1. Filter by category
  if (state.category !== 'all') {
    result = result.filter(p => p.category === state.category);
  }

  // 2. Filter by max price
  result = result.filter(p => p.price <= state.maxPrice);

  // 3. Filter by search term
  if (state.search.trim()) {
    const term = state.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term)
    );
  }

  // 4. Filter by badge checkboxes
  if (state.showNew)  result = result.filter(p => p.badge === 'New');
  if (state.showSale) result = result.filter(p => p.badge === 'Sale');

  // 5. Sort
  switch (state.sort) {
    case 'price-asc':  result.sort((a, b) => a.price - b.price);  break;
    case 'price-desc': result.sort((a, b) => b.price - a.price);  break;
    case 'name-asc':   result.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'sale':       result.sort((a, b) => (b.oldPrice ? 1 : 0) - (a.oldPrice ? 1 : 0)); break;
  }

  return result;
}

/* ===== RENDER PRODUCTS =====
   Takes the filtered list and renders
   cards into the grid. Supports pagination
   via the "Load More" button.
======================== */
function renderProducts() {
  const grid      = document.getElementById('productsGrid');
  const emptyEl   = document.getElementById('emptyState');
  const countEl   = document.getElementById('resultsCount');
  const loadWrap  = document.getElementById('loadMoreWrap');

  const filtered  = filterProducts();
  const total     = filtered.length;
  const shown     = filtered.slice(0, state.page * state.perPage);

  // Update results count
  if (countEl) countEl.textContent = `Showing ${Math.min(shown.length, total)} of ${total} products`;

  // Show empty state if nothing matches
  if (total === 0) {
    grid.innerHTML = '';
    emptyEl.style.display = 'block';
    loadWrap.style.display = 'none';
    return;
  }

  emptyEl.style.display = 'none';

  // Render cards — we re-use createProductCard() from app.js
  grid.innerHTML = shown.map((p, i) => {
    // Add animation delay stagger per card
    const card = createProductCard(p);
    return card.replace('class="product-card"',
      `class="product-card" style="animation-delay:${i * 0.05}s"`);
  }).join('');

  // Apply list/grid view class
  grid.className = 'product-grid' + (state.view === 'list' ? ' list-view' : '');

  // Show/hide Load More button
  loadWrap.style.display = shown.length < total ? 'block' : 'none';

  // Update breadcrumb category label
  const breadEl = document.getElementById('breadcrumbCat');
  if (breadEl) {
    breadEl.textContent = state.category === 'all'
      ? 'Shop' : state.category.charAt(0).toUpperCase() + state.category.slice(1);
  }

  // Re-render active filter tags
  renderFilterTags();
}

/* ===== FILTER TAGS =====
   Shows little removable chips below the
   toolbar to show what's currently active.
======================== */
function renderFilterTags() {
  const container = document.getElementById('activeFilters');
  if (!container) return;

  let tags = [];

  if (state.category !== 'all')
    tags.push({ label: state.category, remove: () => { state.category = 'all'; document.querySelector('input[name="category"][value="all"]').checked = true; rerender(); } });

  if (state.maxPrice < 200)
    tags.push({ label: `Under $${state.maxPrice}`, remove: () => { state.maxPrice = 200; document.getElementById('priceRange').value = 200; document.getElementById('priceValue').textContent = '$200'; rerender(); } });

  if (state.search)
    tags.push({ label: `"${state.search}"`, remove: () => { state.search = ''; document.getElementById('productSearch').value = ''; rerender(); } });

  if (state.showNew)
    tags.push({ label: 'New Arrivals', remove: () => { state.showNew = false; document.getElementById('filterNew').checked = false; rerender(); } });

  if (state.showSale)
    tags.push({ label: 'On Sale', remove: () => { state.showSale = false; document.getElementById('filterSale').checked = false; rerender(); } });

  container.innerHTML = tags.map((t, i) => `
    <div class="filter-tag" data-tag="${i}">
      ${t.label}
      <button onclick="removeTag(${i})">×</button>
    </div>
  `).join('');

  // Store tag remove functions globally so onclick can reach them
  window._tagRemovers = tags.map(t => t.remove);
}

window.removeTag = function(i) {
  window._tagRemovers[i]();
};

/* ===== RERENDER HELPER =====
   Resets pagination and re-renders.
======================== */
function rerender() {
  state.page = 1;
  renderProducts();
}

/* ===== EVENT LISTENERS ===== */

// Category radio buttons
document.querySelectorAll('input[name="category"]').forEach(radio => {
  radio.addEventListener('change', e => {
    state.category = e.target.value;
    rerender();
  });
});

// Price range slider
document.getElementById('priceRange')?.addEventListener('input', e => {
  state.maxPrice = parseInt(e.target.value);
  document.getElementById('priceValue').textContent = `$${state.maxPrice}`;
  rerender();
});

// New / Sale checkboxes
document.getElementById('filterNew')?.addEventListener('change', e => {
  state.showNew = e.target.checked;
  // Can't be both new and sale at once
  if (state.showNew) { state.showSale = false; document.getElementById('filterSale').checked = false; }
  rerender();
});
document.getElementById('filterSale')?.addEventListener('change', e => {
  state.showSale = e.target.checked;
  if (state.showSale) { state.showNew = false; document.getElementById('filterNew').checked = false; }
  rerender();
});

// Search box (debounced — waits 300ms after typing stops)
let searchTimer;
document.getElementById('productSearch')?.addEventListener('input', e => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.search = e.target.value;
    rerender();
  }, 300);
});

// Sort dropdown
document.getElementById('sortSelect')?.addEventListener('change', e => {
  state.sort = e.target.value;
  rerender();
});

// Clear all filters
document.getElementById('clearFilters')?.addEventListener('click', () => {
  state.category = 'all';
  state.maxPrice  = 200;
  state.search    = '';
  state.showNew   = false;
  state.showSale  = false;
  state.sort      = 'default';
  // Reset UI controls
  document.querySelector('input[name="category"][value="all"]').checked = true;
  document.getElementById('priceRange').value = 200;
  document.getElementById('priceValue').textContent = '$200';
  document.getElementById('productSearch').value = '';
  document.getElementById('filterNew').checked = false;
  document.getElementById('filterSale').checked = false;
  document.getElementById('sortSelect').value = 'default';
  rerender();
});

// Reset button in empty state
document.getElementById('resetBtn')?.addEventListener('click', () => {
  document.getElementById('clearFilters').click();
});

// Load More
document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
  state.page += 1;
  renderProducts();
  // Scroll smoothly to the new cards
  window.scrollBy({ top: 400, behavior: 'smooth' });
});

// Grid / List view toggle
document.getElementById('gridViewBtn')?.addEventListener('click', () => {
  state.view = 'grid';
  document.getElementById('gridViewBtn').classList.add('active');
  document.getElementById('listViewBtn').classList.remove('active');
  renderProducts();
});
document.getElementById('listViewBtn')?.addEventListener('click', () => {
  state.view = 'list';
  document.getElementById('listViewBtn').classList.add('active');
  document.getElementById('gridViewBtn').classList.remove('active');
  renderProducts();
});

// Mobile: open / close filters sidebar
document.getElementById('filterToggleBtn')?.addEventListener('click', () => {
  document.getElementById('filtersSidebar').classList.add('open');
  document.getElementById('filtersOverlay').classList.add('open');
});
document.getElementById('closeFilters')?.addEventListener('click', closeFilters);
document.getElementById('filtersOverlay')?.addEventListener('click', closeFilters);

function closeFilters() {
  document.getElementById('filtersSidebar').classList.remove('open');
  document.getElementById('filtersOverlay').classList.remove('open');
}

/* ===== INIT ===== */
renderProducts();