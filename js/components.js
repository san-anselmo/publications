'use strict';
// Preload critical nav logo immediately
const _logoPl = document.createElement('link');
_logoPl.rel = 'preload';
_logoPl.as = 'image';
_logoPl.href = 'images/sap logo only.webp';
document.head.appendChild(_logoPl);

/* ── Shared Components — Nav, Footer, Theme, Utilities ─────── */

/* ── SVG icon paths (from original) ── */
const _SVG = {
  book:    'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1z',
  info:    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
  people:  'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  edit:    'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  coffee:  'M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z',
  cal:     'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  mail:    'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  cart:    'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.45 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
  burger:  'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
  search:  'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z',
  sun:     'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z',
  moon:    'M9.37 5.51A7.35 7.35 0 009.1 7.5c0 4.08 3.32 7.4 7.4 7.4.68 0 1.35-.09 1.99-.27A7.014 7.014 0 0112 19c-3.86 0-7-3.14-7-7 0-2.93 1.81-5.45 4.37-6.49zM12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z',
  up:      'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
  filter:  'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z'
};
const _icon = (path, w=17, h=17) => `<svg viewBox="0 0 24 24" width="${w}" height="${h}" fill="currentColor"><path d="${path}"/></svg>`;
const _bmIcon = (path) => `<svg class="bm-icon" viewBox="0 0 24 24"><path d="${path}"/></svg>`;

/* ── Nav items config ── */
const _NAV_ITEMS = [
  {section:'Catalog',   items:[{key:'catalog', label:'Our Publications', icon:_SVG.book, href:'index.html'}]},
  {section:'About',     items:[
    {key:'about',   label:'About Us',   icon:_SVG.info,   href:'about.html'},
    {key:'team',    label:'Our Team',   icon:_SVG.people, href:'team.html'},
    {key:'authors', label:'Authors',    icon:_SVG.edit,   href:'authors.html'}
  ]},
  {section:'Community', items:[
    {key:'news',    label:'News',          icon:_SVG.coffee, href:'news.html'},
    {key:'events',  label:'Events',        icon:_SVG.cal,    href:'events.html'},
    {key:'contact', label:'Contact Us',    icon:_SVG.mail,   href:'contact.html'},
    {key:'order',   label:'How to Order',  icon:_SVG.cart,   href:'order.html'}
  ]}
];

/* ── Inject Navigation ── */
function injectNav(activePage) {
  const container = document.getElementById('navContainer');
  if (!container) return;

  // Burger backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'burger-backdrop';
  backdrop.id = 'burgerBackdrop';
  backdrop.onclick = closeBurgerMenu;

  // Burger menu
  let burgerHTML = '';
  _NAV_ITEMS.forEach(group => {
    burgerHTML += `<div class="bm-section">${group.section}</div>`;
    group.items.forEach(item => {
      const active = item.key === activePage ? ' active' : '';
      burgerHTML += `<a class="bm-btn${active}" href="${item.href}">${_bmIcon(item.icon)} ${item.label}</a>`;
    });
  });

  const burgerMenu = document.createElement('nav');
  burgerMenu.className = 'burger-menu';
  burgerMenu.id = 'burgerMenu';
  burgerMenu.setAttribute('aria-label', 'Main navigation');
  burgerMenu.setAttribute('aria-hidden', 'true');
  burgerMenu.innerHTML = burgerHTML;

  // Topbar
  const topbar = document.createElement('header');
  topbar.className = 'topbar';
  topbar.id = 'topbar';
  topbar.setAttribute('role', 'banner');
  topbar.innerHTML = `
    <button class="topbar-burger" id="burgerBtn" aria-label="Open navigation" aria-expanded="false">
      ${_icon(_SVG.burger)}
    </button>
    <a class="topbar-center" href="index.html" aria-label="San Anselmo Publications home">
      <img src="images/sap logo only.webp" class="topbar-logo" alt="SAP Logo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="topbar-logo-fallback" style="display:none" aria-hidden="true">S</div>
      <span class="topbar-center-name">San Anselmo Publications</span>
    </a>
    <div class="topbar-right">
      <div class="topbar-search" role="search">
        ${_icon(_SVG.search, 13, 13)}
        <input type="text" id="searchInput" placeholder="Search titles…" autocomplete="off" oninput="handleSearch()" aria-label="Search publications">
        <button class="clear-btn" id="clearBtn" onclick="clearSearch()" aria-label="Clear search" style="display:none">×</button>
        <div class="search-predictions" id="searchPreds" role="listbox"></div>
      </div>
      <button class="tb-icon" id="mobileSearchBtn" onclick="toggleMobileSearch()" aria-label="Toggle search" aria-expanded="false">
        ${_icon(_SVG.search, 15, 15)}
      </button>
      ${activePage === 'catalog' ? `
      <div class="filter-wrap">
        <button class="tb-icon" id="filterBtn" onclick="toggleFilter()" aria-label="Filters" aria-expanded="false">
          ${_icon(_SVG.filter, 15, 15)}
        </button>
        <div class="filter-dropdown" id="filterDropdown">
          <div class="f-row">
            <label>Year</label>
            <div class="cs-wrap">
              <button class="cs-btn" id="yearBtn" onclick="toggleYearOpts()" aria-expanded="false">
                <span id="yearLabel">All Years</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
              </button>
              <div class="cs-opts" id="yearOpts" role="listbox"></div>
            </div>
          </div>
          <div class="f-row">
            <label>Sort By</label>
            <div class="cs-wrap">
              <button class="cs-btn" id="sortBtn" onclick="toggleSortOpts()" aria-expanded="false">
                <span id="sortLabel">Newest</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
              </button>
              <div class="cs-opts" id="sortOpts" role="listbox">
                <div class="cs-opt" onclick="selectSort('newest')">Newest</div>
                <div class="cs-opt" onclick="selectSort('price-asc')">Price: Low to High</div>
                <div class="cs-opt" onclick="selectSort('price-desc')">Price: High to Low</div>
                <div class="cs-opt" onclick="selectSort('title-asc')">Title: A-Z</div>
              </div>
            </div>
          </div>
          <div class="f-row">
            <label>Max Price: ₱<span id="priceVal">2,000</span></label>
            <input type="range" id="maxPrice" min="0" max="2000" step="50" value="2000" oninput="document.getElementById('priceVal').textContent=Number(this.value).toLocaleString(); applyFilters()" style="width: 100%;">
          </div>
          <button class="f-reset" onclick="resetFilters()">Reset All</button>
        </div>
      </div>` : ''}
      <button class="tb-icon" id="cartToggleBtn" onclick="toggleCartDrawer()" aria-label="Shopping Cart" style="position: relative;">
        ${_icon(_SVG.cart, 15, 15)}
        <span class="cart-badge" id="cartBadge" style="display:none">0</span>
      </button>
      <button class="tb-icon" onclick="toggleTheme()" aria-label="Toggle dark mode">
        <span id="iconSun">${_icon(_SVG.sun, 15, 15)}</span>
        <span id="iconMoon" style="display:none">${_icon(_SVG.moon, 15, 15)}</span>
      </button>
    </div>`;

  // Cart Backdrop
  const cartBackdrop = document.createElement('div');
  cartBackdrop.className = 'cart-backdrop';
  cartBackdrop.id = 'cartBackdrop';
  cartBackdrop.onclick = toggleCartDrawer;

  // Cart Drawer
  const cartDrawer = document.createElement('div');
  cartDrawer.className = 'cart-drawer';
  cartDrawer.id = 'cartDrawer';
  cartDrawer.setAttribute('role', 'dialog');
  cartDrawer.setAttribute('aria-modal', 'true');
  cartDrawer.setAttribute('aria-hidden', 'true');
  cartDrawer.innerHTML = `
    <div class="cart-header">
      <h2 class="cart-title">Your Order Cart</h2>
      <button class="cart-close-btn" onclick="toggleCartDrawer()" aria-label="Close cart">×</button>
    </div>
    <div class="cart-body" id="cartItemsList"></div>
    
    <!-- Checkout Details Form -->
    <div class="cart-body" id="cartCheckoutForm" style="display:none; gap: 0.8rem;">
      <h3 style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.15rem; color: var(--terra); margin-bottom: 0.2rem;">Delivery &amp; Payment Details</h3>
      <div class="checkout-field">
        <label for="coName" style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sepia); display: block; margin-bottom: 0.25rem;">Full Name</label>
        <input type="text" id="coName" class="checkout-input" placeholder="e.g. Juan dela Cruz" style="width: 100%; box-sizing: border-box; padding: 0.5rem 0.7rem; border-radius: 6px; border: 1px solid var(--ash); background: var(--white); color: var(--ink); font-size: 0.85rem;" required>
      </div>
      <div class="checkout-field">
        <label for="coPhone" style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sepia); display: block; margin-bottom: 0.25rem;">Phone Number</label>
        <input type="tel" id="coPhone" class="checkout-input" placeholder="e.g. 09171234567" style="width: 100%; box-sizing: border-box; padding: 0.5rem 0.7rem; border-radius: 6px; border: 1px solid var(--ash); background: var(--white); color: var(--ink); font-size: 0.85rem;" required>
      </div>
      <div class="checkout-field">
        <label for="coEmail" style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sepia); display: block; margin-bottom: 0.25rem;">Email Address</label>
        <input type="email" id="coEmail" class="checkout-input" placeholder="e.g. juan@gmail.com" style="width: 100%; box-sizing: border-box; padding: 0.5rem 0.7rem; border-radius: 6px; border: 1px solid var(--ash); background: var(--white); color: var(--ink); font-size: 0.85rem;" required>
      </div>
      <div class="checkout-field">
        <label for="coAddress" style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sepia); display: block; margin-bottom: 0.25rem;">Delivery Address</label>
        <textarea id="coAddress" class="checkout-input" placeholder="e.g. 123 Rizal St, Brgy. Central, Quezon City" rows="2" style="width: 100%; box-sizing: border-box; padding: 0.5rem 0.7rem; border-radius: 6px; border: 1px solid var(--ash); background: var(--white); color: var(--ink); font-size: 0.85rem; resize: vertical; font-family: inherit;" required></textarea>
      </div>
      <div class="checkout-field">
        <label style="font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--sepia); display: block; margin-bottom: 0.25rem;">Payment Method</label>
        <select id="coPayment" class="checkout-input" style="width: 100%; box-sizing: border-box; padding: 0.5rem 0.7rem; border-radius: 6px; border: 1px solid var(--ash); background: var(--white); color: var(--ink); font-size: 0.85rem;" required>
          <option value="" disabled selected>Select Payment Option</option>
          <option value="GCash">GCash</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
        </select>
      </div>
      <div style="margin-top: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
        <button type="button" class="back-to-cart-btn" onclick="showCartView()" style="background: none; border: none; color: var(--sepia); font-size: 0.8rem; cursor: pointer; text-decoration: underline; font-weight: 500;">
          &larr; Back to Review Cart
        </button>
      </div>
    </div>

    <div class="cart-footer">
      <div class="cart-total-row">
        <span>Total Price:</span>
        <span class="cart-total-price" id="cartTotalVal">₱0</span>
      </div>
      <button id="cartCheckoutBtn" class="btn-primary cart-checkout-btn" onclick="showCheckoutForm()" style="width: 100%; justify-content: center; margin-top: 1rem; margin-left: 0;">
        Checkout via Messenger
      </button>
    </div>`;

  container.appendChild(backdrop);
  container.appendChild(burgerMenu);
  container.appendChild(cartBackdrop);
  container.appendChild(cartDrawer);
  container.appendChild(topbar);
  injectFooter();
  window.updateCartBadge();
}

/* ── Inject Back To Top ── */
function injectBackToTop() {
  const c = document.getElementById('backToTopContainer');
  if (!c) return;
  c.innerHTML = `<button class="back-to-top" id="backToTop" aria-label="Back to top">
    ${_icon(_SVG.up)}
  </button>`;
  const btn = document.getElementById('backToTop');
  if (btn) btn.addEventListener('click', () => {
    const mc = document.getElementById('mainContent');
    if (mc && mc.scrollTop > 0) mc.scrollTo({top:0,behavior:'smooth'});
    else window.scrollTo({top:0,behavior:'smooth'});
  });
}

/* ── Theme ── */
function initTheme() {
  window.isDark = window.isDark || false;
  if (localStorage.getItem('sap-theme') === 'dark') {
    window.isDark = true;
    document.body.classList.add('dark');
    const sun = document.getElementById('iconSun');
    const moon = document.getElementById('iconMoon');
    if (sun) sun.style.display = 'none';
    if (moon) moon.style.display = '';
  }
}

function toggleTheme() {
  window.isDark = !window.isDark;
  document.body.classList.toggle('dark', window.isDark);
  const sun = document.getElementById('iconSun');
  const moon = document.getElementById('iconMoon');
  if (sun) sun.style.display = window.isDark ? 'none' : '';
  if (moon) moon.style.display = window.isDark ? '' : 'none';
  localStorage.setItem('sap-theme', window.isDark ? 'dark' : 'light');
}

/* ── Burger Menu ── */
function initBurgerMenu() {
  const btn = document.getElementById('burgerBtn');
  if (btn) btn.addEventListener('click', toggleBurgerMenu);
}

function toggleBurgerMenu() {
  const menu = document.getElementById('burgerMenu');
  const btn = document.getElementById('burgerBtn');
  const bd = document.getElementById('burgerBackdrop');
  if (!menu) return;
  const open = menu.classList.contains('open');
  if (open) { closeBurgerMenu(); }
  else {
    menu.classList.add('open');
    if (btn) { btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    if (bd) bd.classList.add('show');
    menu.removeAttribute('aria-hidden');
  }
}

function closeBurgerMenu() {
  const menu = document.getElementById('burgerMenu');
  const btn = document.getElementById('burgerBtn');
  const bd = document.getElementById('burgerBackdrop');
  if (menu) { menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); }
  if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
  if (bd) bd.classList.remove('show');
}

/* ── Scroll Handlers ── */
function initScrollHandlers() {
  const handler = () => {
    const mc = document.getElementById('mainContent');
    const sy = (mc ? mc.scrollTop : 0) || window.scrollY || document.documentElement.scrollTop;
    const btt = document.getElementById('backToTop');
    const tb = document.getElementById('topbar');
    if (btt) btt.classList.toggle('show', sy > 400);
    if (tb) tb.classList.toggle('scrolled', sy > 20);
  };
  const mc = document.getElementById('mainContent');
  if (mc) mc.addEventListener('scroll', handler);
  window.addEventListener('scroll', handler);
}

/* ── Helpers ── */
function initials(n) {
  return n.replace(/Atty\.\s*/, '').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function authorDisplay(b) {
  if (b.editor && !b.author) return 'Ed. ' + b.editor;
  if (b.author) {
    if (/\(ed\.\)/i.test(b.author)) return 'Ed. ' + b.author.replace(/\s*\(ed\.\)\s*/i, '').trim();
    return b.author;
  }
  if (b.editor) return 'Ed. ' + b.editor;
  return null;
}

function stockHtml(b) {
  if (b.stock === 0 || (b.note && b.note.toLowerCase().includes('sold out'))) {
    const sub = b.note && b.note.includes('2nd') ? ' — Awaiting 2nd Printing' : '';
    return `<span class="badge-label badge-soldout">Sold Out${sub}</span>`;
  }
  if (b.stock === -2 || (b.note && b.note.toLowerCase().includes('not available')))
    return `<span class="badge-label badge-unavail">Currently Not Available</span>`;
  return `<span class="badge-label badge-avail">Available</span>`;
}

/* ── Modals ── */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  if (id === 'detailModal') {
    document.title = window._originalTitle || 'San Anselmo Publications — Catalog';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && window._originalMetaDesc) {
      metaDesc.content = window._originalMetaDesc;
    }
    const url = new URL(window.location.href);
    if (url.searchParams.has('book')) {
      url.searchParams.delete('book');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }
}

/* Global modal listeners */
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', e => {
    const overlay = e.target.closest('.modal-overlay');
    if (overlay && e.target === overlay) closeModal(overlay.id);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    }
  });
});

/* ── Search (redirect to catalog on non-catalog pages) ── */
function handleSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const v = input.value;
  document.getElementById('clearBtn').style.display = v ? 'block' : 'none';

  // If we're NOT on the catalog page and user has typed, redirect
  if (!window._isCatalogPage && v.length > 2) {
    window.location.href = 'index.html?q=' + encodeURIComponent(v);
    return;
  }

  // Catalog page handles its own predictions via catalog.js
  if (typeof window._catalogSearch === 'function') window._catalogSearch(v);

  // Apply filters on the catalog grid in real-time
  if (window._isCatalogPage && typeof window.applyFilters === 'function') {
    window.applyFilters();
  }
}

function closePreds() {
  const p = document.getElementById('searchPreds');
  if (p) p.style.display = 'none';
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  const cb = document.getElementById('clearBtn');
  if (cb) cb.style.display = 'none';
  closePreds();

  // Reset grid filters
  if (window._isCatalogPage && typeof window.applyFilters === 'function') {
    window.applyFilters();
  }
}

function toggleMobileSearch() {
  const bar = document.querySelector('.topbar-search');
  if (!bar) return;
  const isOpen = bar.classList.toggle('mobile-open');
  const mb = document.getElementById('mobileSearchBtn');
  if (mb) mb.setAttribute('aria-expanded', isOpen);
  if (isOpen) setTimeout(() => { const i = document.getElementById('searchInput'); if (i) i.focus(); }, 50);
  else closePreds();
}

/* Close mobile search on outside click */
document.addEventListener('click', e => {
  const bar = document.querySelector('.topbar-search');
  const mBtn = document.getElementById('mobileSearchBtn');
  if (bar && !bar.contains(e.target) && !(mBtn && mBtn.contains(e.target))) {
    closePreds();
    if (bar.classList.contains('mobile-open')) {
      bar.classList.remove('mobile-open');
      if (mBtn) mBtn.setAttribute('aria-expanded', 'false');
    }
  }
});


/* Inject global premium footer */
function injectFooter() {
  const main = document.getElementById('mainContent');
  if (!main) return;
  if (document.getElementById('globalFooter')) return;
  
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.id = 'globalFooter';
  footer.setAttribute('role', 'contentinfo');
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand-col">
          <div class="footer-logo-wrap">
            <img src="images/sap logo only.webp" alt="San Anselmo Publications Logo" class="footer-logo">
            <span class="footer-brand-title">San Anselmo Publications</span>
          </div>
          <p class="footer-brand-desc">Preserving the Filipino intellect, one title at a time. Publishing fine literature, poetry, fiction, and journals in the Philippines.</p>
        </div>
        <div class="footer-links-col">
          <div class="footer-col-title">Navigation</div>
          <ul class="footer-links-list">
            <li><a href="index.html">All Publications</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="team.html">Our Team</a></li>
            <li><a href="authors.html">Authors</a></li>
          </ul>
        </div>
        <div class="footer-links-col">
          <div class="footer-col-title">Explore</div>
          <ul class="footer-links-list">
            <li><a href="news.html">News & Updates</a></li>
            <li><a href="events.html">Events</a></li>
            <li><a href="order.html">How to Order</a></li>
            <li><a href="contact.html">Contact Us</a></li>
          </ul>
        </div>
        <div class="footer-social-col">
          <div class="footer-col-title">Connect</div>
          <a class="footer-plain-link" href="https://www.facebook.com/sananselmopress" target="_blank" rel="noopener">Facebook</a>
          <a class="footer-plain-link" href="https://www.instagram.com/leondepola/" target="_blank" rel="noopener">Instagram</a>
          <a class="footer-plain-link" href="mailto:pr.sananselmo@gmail.com" target="_blank" rel="noopener">Email Us</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-copyright">
          &copy; 2026 San Anselmo Publications, Inc. All rights reserved.
        </div>
        <div class="footer-meta-info">
          <span class="footer-meta-item">v1.0.15</span>
        </div>
        <div class="footer-credit">
          <a href="https://www.facebook.com/edzfrnc" target="_blank" rel="noopener">Developed and designed by Edzel Frince Bual.</a>
        </div>
      </div>
    </div>`;
  main.appendChild(footer);
}

/* ── Shopping Cart Logic ── */
window.getCart = function() {
  try {
    const cart = localStorage.getItem('sap-cart');
    return cart ? JSON.parse(cart) : [];
  } catch { return []; }
};

window.saveCart = function(cart) {
  try {
    localStorage.setItem('sap-cart', JSON.stringify(cart));
  } catch {}
  window.updateCartBadge();
  window.renderCartItems();
};

window.addToCart = function(id, title, price, img) {
  const cart = window.getCart();
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, title, price: Number(price), img, qty: 1 });
  }
  window.saveCart(cart);
  window.showToast(`"${title}" added to cart!`);
};

window.removeFromCart = function(id) {
  let cart = window.getCart();
  const item = cart.find(x => x.id === id);
  cart = cart.filter(x => x.id !== id);
  window.saveCart(cart);
  if (item) window.showToast(`Removed "${item.title}" from cart`);
};

window.updateCartQty = function(id, qty) {
  let cart = window.getCart();
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty = parseInt(qty, 10);
  if (isNaN(item.qty) || item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }
  window.saveCart(cart);
};

window.toggleCartDrawer = function() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('cartBackdrop');
  if (!drawer) return;
  const isOpen = drawer.classList.contains('open');
  if (isOpen) {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (backdrop) backdrop.classList.remove('show');
  } else {
    drawer.classList.add('open');
    drawer.removeAttribute('aria-hidden');
    if (backdrop) backdrop.classList.add('show');
    window.renderCartItems();
    window.showCartView();
  }
};

window.updateCartBadge = function() {
  const cart = window.getCart();
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  if (totalQty > 0) {
    badge.textContent = totalQty;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
};

window.renderCartItems = function() {
  const list = document.getElementById('cartItemsList');
  const totalVal = document.getElementById('cartTotalVal');
  if (!list) return;
  const cart = window.getCart();
  if (cart.length === 0) {
    list.innerHTML = `<div style="text-align:center;color:var(--sepia);margin-top:2rem;font-style:italic">Your cart is empty.</div>`;
    if (totalVal) totalVal.textContent = '₱0';
    return;
  }

  let html = '';
  let total = 0;
  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    html += `
      <div class="cart-item">
        ${item.img ? `<img src="${item.img}" alt="${item.title}" class="cart-item-img" onerror="this.style.display='none'">` : '<div class="cart-item-img" style="background:var(--ash-light);display:flex;align-items:center;justify-content:center;font-size:0.6rem;color:var(--sepia)">No Cover</div>'}
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">₱${item.price.toLocaleString()}</div>
          <div class="cart-item-qty-row">
            <button class="qty-btn" onclick="updateCartQty('${item.id}', ${item.qty - 1})">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartQty('${item.id}', ${item.qty + 1})">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove item">×</button>
      </div>`;
  });
  list.innerHTML = html;
  if (totalVal) totalVal.textContent = `₱${total.toLocaleString()}`;
};

window.showCartView = function() {
  const cartItemsList = document.getElementById('cartItemsList');
  const cartCheckoutForm = document.getElementById('cartCheckoutForm');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
  
  if (cartItemsList && cartCheckoutForm && cartCheckoutBtn) {
    cartItemsList.style.display = 'flex';
    cartCheckoutForm.style.display = 'none';
    cartCheckoutBtn.textContent = 'Checkout via Messenger';
    cartCheckoutBtn.setAttribute('onclick', 'showCheckoutForm()');
  }
};

window.showCheckoutForm = function() {
  const cart = window.getCart();
  if (cart.length === 0) {
    window.showToast("Your cart is empty!");
    return;
  }
  const cartItemsList = document.getElementById('cartItemsList');
  const cartCheckoutForm = document.getElementById('cartCheckoutForm');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
  
  if (cartItemsList && cartCheckoutForm && cartCheckoutBtn) {
    cartItemsList.style.display = 'none';
    cartCheckoutForm.style.display = 'flex';
    cartCheckoutBtn.textContent = 'Confirm & Send Order';
    cartCheckoutBtn.setAttribute('onclick', 'submitCheckout()');
  }
};

window.submitCheckout = function() {
  const cart = window.getCart();
  if (cart.length === 0) {
    window.showToast("Your cart is empty!");
    return;
  }

  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const email = document.getElementById('coEmail').value.trim();
  const address = document.getElementById('coAddress').value.trim();
  const payment = document.getElementById('coPayment').value;

  if (!name || !phone || !email || !address || !payment) {
    window.showToast("Please fill in all checkout fields!");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    window.showToast("Please enter a valid email address!");
    return;
  }

  let orderSlip = '*San Anselmo Publications Order*\n\n';
  orderSlip += '*Items Ordered:*\n';
  let total = 0;
  cart.forEach(item => {
    const sub = item.price * item.qty;
    total += sub;
    orderSlip += `- ${item.qty}x ${item.title} (₱${sub.toLocaleString()})\n`;
  });
  orderSlip += `\n*Total Net Price:* ₱${total.toLocaleString()}\n\n`;
  orderSlip += '*Customer Details:*\n';
  orderSlip += `- Name: ${name}\n`;
  orderSlip += `- Phone: ${phone}\n`;
  orderSlip += `- Email: ${email}\n`;
  orderSlip += `- Delivery Address: ${address}\n`;
  orderSlip += `- Mode of Payment: ${payment}`;

  navigator.clipboard.writeText(orderSlip).then(() => {
    window.showToast("Order slip copied to clipboard!");
  }).catch(() => {
    const el = document.createElement('textarea');
    el.value = orderSlip;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    window.showToast("Order slip copied to clipboard!");
  });

  setTimeout(() => {
    window.open('https://m.me/sananselmopress', '_blank', 'noopener');
  }, 1000);
};

window.showToast = function(msg) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = 'toast-notification';
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 3000);
};

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js?v=1.0.15')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.error('Service Worker registration failed', err));
  });
}


