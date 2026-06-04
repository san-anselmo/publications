'use strict';
/* ── Authors Page Logic ────────────────────────────────────── */

let _authBooks = [];

function renderAuthorGrid(authors, books) {
  const grid = document.getElementById('authorGrid');
  if (!grid) return;
  grid.innerHTML = authors.map(a => {
    const key = a.name.split(',')[0].split('(')[0].trim();
    const cnt = books.filter(b => (b.author && b.author.includes(key)) || (b.editor && b.editor.includes(key))).length;
    return `<div class="author-row" role="listitem" onclick="viewAuthorOnPage('${a.name.replace(/'/g, "\\'")}')" tabindex="0" onkeydown="if(event.key==='Enter')viewAuthorOnPage('${a.name.replace(/'/g, "\\'")}')">
      <div style="display:flex;align-items:center;gap:.85rem;min-width:0">
        <div class="author-row-avatar">${a.img ? `<img src="${a.img}" alt="${a.name}" loading="eager" decoding="async" onerror="this.parentElement.textContent='${initials(a.name)}'">` : initials(a.name)}</div>
        <div style="min-width:0"><div class="author-row-name">${a.name}</div><div class="author-row-bio">${a.bio}</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:.7rem;flex-shrink:0">
        ${cnt ? `<div class="author-row-count">${cnt} title${cnt !== 1 ? 's' : ''}</div>` : ''}
        <svg class="author-row-arrow" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
      </div>
    </div>`;
  }).join('');
}

window.viewAuthorOnPage = function(name) {
  const allAuthors = typeof AUTHORS !== 'undefined' ? AUTHORS : [];
  const a = allAuthors.find(x => x.name === name);
  if (!a) return;
  const key = a.name.split(',')[0].split('(')[0].trim();
  const books = _authBooks.filter(b => (b.author && b.author.includes(key)) || (b.editor && b.editor.includes(key)));

  document.getElementById('amAvatar').innerHTML = a.img
    ? `<img src="${a.img}" alt="${a.name}" loading="eager" onerror="this.parentElement.textContent='${initials(a.name)}'">`
    : initials(a.name);
  document.getElementById('amName').textContent = a.name;
  document.getElementById('amBio').textContent = a.bio;
  document.getElementById('amBooks').innerHTML = books.length
    ? books.map(b => `<div role="listitem" onclick="window.location.href='index.html?book=${b.id}'" style="cursor:pointer" tabindex="0" onkeydown="if(event.key==='Enter')window.location.href='index.html?book=${b.id}'">
        <div style="aspect-ratio:2/3;background:var(--ash-light);border-radius:2px 8px 8px 2px;overflow:hidden;box-shadow:var(--shadow-book);margin-bottom:.4rem">
          ${b.img ? `<img src="${b.img}" alt="${b.title}" loading="eager" style="width:100%;height:100%;object-fit:cover" onerror="this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;color:var(--sepia);font-size:.6rem;text-align:center;padding:.3rem\\'>${b.title}</div>'">` : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--sepia);font-size:.6rem;text-align:center;padding:.3rem">${b.title}</div>`}
        </div>
        <div style="font-family:'Cormorant Garamond',serif;font-size:var(--fs-sm);line-height:1.2;color:var(--ink)">${b.title}</div>
      </div>`).join('')
    : '<p style="color:var(--sepia);font-style:italic">No listed publications.</p>';
  openModal('authorModal');
};

document.addEventListener('DOMContentLoaded', async () => {
  injectNav('authors');
  injectBackToTop();
  initTheme();
  initBurgerMenu();
  initScrollHandlers();

  const authorsData = await SheetsCMS.getAuthors().catch(() => typeof AUTHORS !== 'undefined' ? AUTHORS : []);
  _authBooks = await SheetsCMS.getBooks().catch(() => typeof BOOKS !== 'undefined' ? BOOKS : []);
  renderAuthorGrid(authorsData, _authBooks);
});
