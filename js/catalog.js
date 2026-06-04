'use strict';
/* ── Catalog Page Logic ────────────────────────────────────── */
window._isCatalogPage = true;

let _books = [];
window.yearFilter = window.yearFilter || 'All';
const CAT_ORDER_DEFAULT = ['Journal','Poetry','Fiction','Non-Fiction','Biography','Inspirational','Anthology',"Children's Literature",'General Reference'];

/* ── Fuzzy Search Helpers (Typo Tolerance) ── */
function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  let r0 = Array(b.length + 1).fill(0).map((_, i) => i);
  let r1 = Array(b.length + 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    r1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      r1[j + 1] = Math.min(r1[j] + 1, r0[j + 1] + 1, r0[j] + cost);
    }
    r0 = [...r1];
  }
  return r0[b.length];
}

function fuzzyMatch(text, query) {
  if (!query) return true;
  const qWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!qWords.length) return true;
  const tWords = text.toLowerCase().split(/[^\w\d\u00C0-\u00FF]+/).filter(Boolean);
  return qWords.every(qw => {
    return tWords.some(tw => {
      if (tw.startsWith(qw) || tw.includes(qw)) return true;
      const dist = levenshtein(qw, tw);
      return qw.length <= 4 ? dist <= 1 : dist <= 2;
    });
  });
}

/* ── Search predictions (called by components.js) ── */
window._catalogSearch = function(v) {
  const pred = document.getElementById('searchPreds');
  if (!pred) return;
  if (v.length > 0) {
    const q = v.toLowerCase().trim();
    const m = _books.filter(b => {
      const fields = [b.title, authorDisplay(b) || '', b.category, b.year.toString()].join(' ');
      return fuzzyMatch(fields, q);
    }).slice(0, 7);
    if (m.length) {
      pred.innerHTML = m.map(b => `<div class="pred-item" role="option" tabindex="0"
        onclick="viewBook('${b.id}');closePreds()"
        onkeydown="if(event.key==='Enter'){viewBook('${b.id}');closePreds()}">
        <div class="pred-title">${b.title}</div>
        <div class="pred-meta">${authorDisplay(b) || 'Various'} · ${b.year} · ₱${Number(b.price).toLocaleString()}</div>
      </div>`).join('');
      pred.style.display = 'block';
    } else pred.style.display = 'none';
  } else pred.style.display = 'none';
};

/* ── Bookshelf Rendering ── */
function renderShelves(books, genreFilter) {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  if (!books.length) {
    grid.innerHTML = `<div class="no-results"><div class="nr-icon" aria-hidden="true">◌</div><h3>No titles found</h3><p>Try adjusting your filters.</p></div>`;
    return;
  }

  const catOrder = [...new Set(books.map(b => b.category))].sort((a, b) => {
    const ai = CAT_ORDER_DEFAULT.indexOf(a), bi = CAT_ORDER_DEFAULT.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const grouped = {};
  catOrder.forEach(c => grouped[c] = []);
  books.forEach(b => { if (grouped[b.category]) grouped[b.category].push(b); });

  if (grouped['Journal']) grouped['Journal'].sort((a, b) => (b.issueNum || 0) - (a.issueNum || 0));

  let html = '';
  catOrder.forEach(cat => {
    const catBooks = grouped[cat];
    if (!catBooks || !catBooks.length) return;
    if (genreFilter !== 'All' && cat !== genreFilter) return;

    const isMobile = window.innerWidth <= 600;
    const shelfLimit = isMobile ? 4 : (typeof BOOKS_PER_SHELF !== 'undefined' ? BOOKS_PER_SHELF : 8);
    const rows = [];
    for (let i = 0; i < catBooks.length; i += shelfLimit) rows.push(catBooks.slice(i, i + shelfLimit));

    html += `<div class="shelf-section" data-cat="${cat}" role="listitem">
      <div class="shelf-header">
        <h2 class="shelf-cat-title">${cat}</h2>
        <span class="shelf-count">${catBooks.length} title${catBooks.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="shelf-wrap">
        ${rows.map((row, ri) => `
          <div class="shelf-row-books" role="list" aria-label="${cat} — row ${ri + 1}">
            ${row.map(renderCard).join('')}
          </div>
          <div class="shelf-plank" aria-hidden="true"></div>
        `).join('')}
      </div>
    </div>`;
  });

  grid.innerHTML = html || `<div class="no-results"><div class="nr-icon">◌</div><h3>No titles found</h3><p>Try adjusting your filters.</p></div>`;
}

function renderCard(b) {
  const ad = authorDisplay(b);
  const imgSrc = b.img || '';
  return `<article class="book-card" role="listitem" onclick="viewBook('${b.id}')"
    tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ')viewBook('${b.id}')"
    aria-label="${b.title}${ad ? ' by ' + ad : ''}">
    <div class="book-cover-wrap">
      ${imgSrc ? `<img class="book-cover-img" src="${imgSrc}" alt="Cover of ${b.title}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
      <div class="bk-placeholder" style="${imgSrc ? 'display:none' : 'display:flex'}" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" opacity=".35"><path d="${_SVG.book}"/></svg>
        <span class="ph-t">${b.title}</span>
      </div>
    </div>
    <div class="book-meta-area">
      <div class="book-title-txt">${b.title}</div>
      ${ad ? `<div class="book-author-txt">${ad}</div>` : ''}
      <div class="book-price-txt">₱${Number(b.price).toLocaleString()}</div>
    </div>
  </article>`;
}

/* ── View Book ── */
window.viewBook = function(id) {
  const b = _books.find(x => x.id === id);
  if (!b) return;
  const ad = authorDisplay(b);

  document.getElementById('mCategory').textContent = b.category;
  document.getElementById('mTitle').textContent = b.title;

  const mA = document.getElementById('mAuthor');
  if (ad) { mA.textContent = ad; mA.style.display = ''; } else mA.style.display = 'none';

  document.getElementById('mPrice').textContent = `₱${Number(b.price).toLocaleString()}`;
  document.getElementById('mYear').textContent = b.year;
  document.getElementById('mLang').textContent = b.lang || '—';
  document.getElementById('mBlurb').textContent = b.blurb;
  document.getElementById('mStock').innerHTML = stockHtml(b);

  const iw = document.getElementById('mIsbnWrap');
  if (b.isbn && b.isbn.trim()) { document.getElementById('mISBN').textContent = b.isbn; iw.style.display = ''; }
  else iw.style.display = 'none';

  const gw = document.getElementById('mGumroadBtn');
  if (b.gumroad) { gw.href = b.gumroad; gw.style.display = 'inline-flex'; }
  else gw.style.display = 'none';

  const cv = document.getElementById('mCover'), ph = cv.nextElementSibling;
  if (b.img) { cv.src = b.img; cv.style.display = ''; ph.style.display = 'none'; cv.onerror = () => { cv.style.display = 'none'; ph.style.display = 'flex'; }; }
  else { cv.style.display = 'none'; ph.style.display = 'flex'; }

  // Hook up Add to Cart
  const addToCartBtn = document.getElementById('mAddToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.onclick = () => {
      window.addToCart(b.id, b.title, b.price, b.img);
    };
  }

  // SEO Overrides
  if (!window._originalTitle) window._originalTitle = document.title;
  document.title = `${b.title} — San Anselmo Publications, Inc.`;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  if (!window._originalMetaDesc) {
    window._originalMetaDesc = metaDesc.content;
  }
  metaDesc.content = `${b.title} by ${ad || 'Various'}. ${b.blurb.slice(0, 150)}...`;

  // URL state update
  const url = new URL(window.location.href);
  if (url.searchParams.get('book') !== b.id) {
    url.searchParams.set('book', b.id);
    window.history.replaceState({}, '', url.pathname + url.search);
  }

  openModal('detailModal');
};

/* ── View Author ── */
window.viewAuthor = function(name) {
  const allAuthors = typeof AUTHORS !== 'undefined' ? AUTHORS : [];
  const a = allAuthors.find(x => x.name === name);
  if (!a) return;
  const key = a.name.split(',')[0].split('(')[0].trim();
  const books = _books.filter(b => (b.author && b.author.includes(key)) || (b.editor && b.editor.includes(key)));

  document.getElementById('amAvatar').innerHTML = a.img
    ? `<img src="${a.img}" alt="${a.name}" loading="lazy" onerror="this.parentElement.textContent='${initials(a.name)}'">`
    : initials(a.name);
  document.getElementById('amName').textContent = a.name;
  document.getElementById('amBio').textContent = a.bio;
  document.getElementById('amBooks').innerHTML = books.length
    ? books.map(b => `<div role="listitem" onclick="closeModal('authorModal');viewBook('${b.id}')" style="cursor:pointer" tabindex="0" onkeydown="if(event.key==='Enter'){closeModal('authorModal');viewBook('${b.id}')}">
        <div style="aspect-ratio:2/3;background:var(--ash-light);border-radius:2px 8px 8px 2px;overflow:hidden;box-shadow:var(--shadow-book);margin-bottom:.4rem">
          ${b.img ? `<img src="${b.img}" alt="${b.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:var(--sepia);font-size:.6rem;text-align:center;padding:.3rem\\'>${b.title}</div>'">` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--sepia);font-size:.6rem;text-align:center;padding:.3rem">${b.title}</div>`}
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:var(--fs-sm);line-height:1.2;color:var(--ink)">${b.title}</div>
      </div>`).join('')
    : '<p style="color:var(--sepia);font-style:italic">No listed publications.</p>';
  openModal('authorModal');
};

/* ── Relevance Score Helper ── */
function getRelevanceScore(b, query) {
  if (!query) return 0;
  const q = query.toLowerCase().trim();
  let score = 0;
  const title = b.title.toLowerCase();
  const author = (authorDisplay(b) || '').toLowerCase();
  const cat = b.category.toLowerCase();
  const blurb = (b.blurb || '').toLowerCase();

  if (title === q) score += 30;
  else if (title.startsWith(q)) score += 20;
  else if (title.includes(q)) score += 10;

  if (author.includes(q)) score += 8;
  if (cat.includes(q)) score += 5;
  if (blurb.includes(q)) score += 2;

  const qWords = q.split(/\s+/).filter(Boolean);
  qWords.forEach(qw => {
    if (title.includes(qw)) score += 5;
    if (author.includes(qw)) score += 3;
    if (blurb.includes(qw)) score += 1;
  });
  return score;
}

/* ── Filters ── */
window.applyFilters = function() {
  const maxVal = document.getElementById('maxPrice')?.value;
  const maxPrice = maxVal ? Number(maxVal) : 2000;
  const activeTags = document.querySelectorAll('.genre-tag.active');
  const genres = Array.from(activeTags).map(t => t.dataset.genre);
  const showAll = genres.includes('All') || genres.length === 0;
  const input = document.getElementById('searchInput');
  const q = input ? input.value.toLowerCase().trim() : '';

  const filtered = _books.map(b => {
    const score = q ? getRelevanceScore(b, q) : 0;
    return { ...b, _score: score };
  }).filter(b => {
    const mY = window.yearFilter === 'All' || b.year.toString() === window.yearFilter;
    const mPrice = Number(b.price) <= maxPrice;
    const mGenre = showAll || genres.includes(b.category);
    const fields = [b.title, authorDisplay(b) || '', b.editor || '', b.category].join(' ');
    const mQ = !q || b._score > 0 || fuzzyMatch(fields, q);
    return mY && mPrice && mGenre && mQ;
  });

  const sortVal = window._selectedSort || 'newest';
  filtered.sort((a, b) => {
    if (q) {
      const diff = b._score - a._score;
      if (diff !== 0) return diff;
    }
    if (sortVal === 'price-asc') return a.price - b.price;
    if (sortVal === 'price-desc') return b.price - a.price;
    if (sortVal === 'title-asc') return a.title.localeCompare(b.title);
    return b.year - a.year; // newest
  });

  renderShelves(filtered, 'All');
};

window.filterByGenre = function(g, el) {
  if (g === 'All') {
    document.querySelectorAll('.genre-tag').forEach(t => {
      const isAll = t.dataset.genre === 'All';
      t.classList.toggle('active', isAll);
      t.setAttribute('aria-pressed', isAll ? 'true' : 'false');
    });
  } else {
    el.classList.toggle('active');
    el.setAttribute('aria-pressed', el.classList.contains('active') ? 'true' : 'false');
    
    // Deactivate 'All'
    const allBtn = document.querySelector('.genre-tag[data-genre="All"]');
    if (allBtn) {
      allBtn.classList.remove('active');
      allBtn.setAttribute('aria-pressed', 'false');
    }
    
    // If nothing is active, reactivate 'All'
    const activeTags = document.querySelectorAll('.genre-tag.active');
    if (activeTags.length === 0 && allBtn) {
      allBtn.classList.add('active');
      allBtn.setAttribute('aria-pressed', 'true');
    }
  }
  applyFilters();
};

window.toggleFilter = function() {
  const dd = document.getElementById('filterDropdown');
  if (!dd) return;
  const open = dd.classList.toggle('show');
  const btn = document.getElementById('filterBtn');
  if (btn) btn.setAttribute('aria-expanded', open);
};

window.toggleYearOpts = function() {
  const o = document.getElementById('yearOpts');
  if (!o) return;
  const open = o.classList.toggle('show');
  const btn = document.getElementById('yearBtn');
  if (btn) btn.setAttribute('aria-expanded', open);
};

window.toggleSortOpts = function() {
  const o = document.getElementById('sortOpts');
  if (!o) return;
  const open = o.classList.toggle('show');
  const btn = document.getElementById('sortBtn');
  if (btn) btn.setAttribute('aria-expanded', open);
};

window.selectYear = function(y) {
  window.yearFilter = y;
  const lbl = document.getElementById('yearLabel');
  if (lbl) lbl.textContent = y === 'All' ? 'All Years' : y;
  const o = document.getElementById('yearOpts');
  if (o) o.classList.remove('show');
  applyFilters();
};

window.selectSort = function(s) {
  window._selectedSort = s;
  const labels = {
    'newest': 'Newest',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'title-asc': 'Title: A-Z'
  };
  const lbl = document.getElementById('sortLabel');
  if (lbl) lbl.textContent = labels[s] || 'Newest';
  const o = document.getElementById('sortOpts');
  if (o) o.classList.remove('show');
  applyFilters();
};

window.resetFilters = function() {
  window.yearFilter = 'All';
  const lbl = document.getElementById('yearLabel');
  if (lbl) lbl.textContent = 'All Years';

  const mx = document.getElementById('maxPrice');
  if (mx) mx.value = 2000;
  const pv = document.getElementById('priceVal');
  if (pv) pv.textContent = '2,000';

  window._selectedSort = 'newest';
  const sl = document.getElementById('sortLabel');
  if (sl) sl.textContent = 'Newest';

  document.querySelectorAll('.genre-tag').forEach(t => {
    const isAll = t.dataset.genre === 'All';
    t.classList.toggle('active', isAll);
    t.setAttribute('aria-pressed', isAll ? 'true' : 'false');
  });

  clearSearch();
  applyFilters();
};

/* ── Init ── */
document.addEventListener('DOMContentLoaded', async () => {
  injectNav('catalog');
  injectBackToTop();
  initTheme();
  initBurgerMenu();
  initScrollHandlers();

  // Load data
  _books = await SheetsCMS.getBooks().catch(() => typeof BOOKS !== 'undefined' ? BOOKS : []);

  // Preload first 4 covers dynamically to optimize LCP
  _books.slice(0, 4).forEach(b => {
    if (b.img) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = b.img;
      document.head.appendChild(link);
    }
  });

  // Year options
  const years = [...new Set(_books.map(b => b.year))].sort().reverse();
  const yearOpts = document.getElementById('yearOpts');
  if (yearOpts) {
    yearOpts.innerHTML = `<div class="cs-opt" onclick="selectYear('All')">All Years</div>` +
      years.map(y => `<div class="cs-opt" onclick="selectYear('${y}')">${y}</div>`).join('');
  }

  // Genre cloud
  const genres = ['All', ...new Set(_books.map(b => b.category))].sort((a, b) => a === 'All' ? -1 : a.localeCompare(b));
  const gc = document.getElementById('genreCloud');
  if (gc) {
    gc.innerHTML = genres.map(g =>
      `<button class="genre-tag${g === 'All' ? ' active' : ''}" data-genre="${g}" aria-pressed="${g === 'All'}">${g}</button>`
    ).join('');
    gc.addEventListener('click', e => {
      const btn = e.target.closest('.genre-tag');
      if (btn) filterByGenre(btn.dataset.genre, btn);
    });
  }

  // Render
  renderShelves(_books, 'All');

  // Handle URL params
  const params = new URLSearchParams(window.location.search);
  const q = params.get('q');
  if (q) {
    const input = document.getElementById('searchInput');
    if (input) { input.value = q; handleSearch(); }
  }
  const bookId = params.get('book');
  if (bookId) viewBook(bookId);

  // Filter dropdown — close on outside click
  document.addEventListener('click', e => {
    const fd = document.getElementById('filterDropdown');
    const fb = document.getElementById('filterBtn');
    if (fd && !fd.contains(e.target) && fb && !fb.contains(e.target)) {
      fd.classList.remove('show');
      if (fb) fb.setAttribute('aria-expanded', 'false');
    }
    const yo = document.getElementById('yearOpts');
    const yb = document.getElementById('yearBtn');
    if (yo && !yo.contains(e.target) && yb && !yb.contains(e.target)) {
      yo.classList.remove('show');
      if (yb) yb.setAttribute('aria-expanded', 'false');
    }
  });

  // Handle resize transition between mobile and desktop shelf limits
  let isMobileCached = window.innerWidth <= 600;
  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 600;
    if (isMobile !== isMobileCached) {
      isMobileCached = isMobile;
      if (typeof applyFilters === 'function') {
        applyFilters();
      }
    }
  });
});
