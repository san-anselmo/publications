'use strict';
/* ── Events Page Logic ─────────────────────────────────────── */

let _events = [];
window.timeFilter = window.timeFilter || 'upcoming';
window.typeFilter = window.typeFilter || 'All';

function renderEvents() {
  const list = document.getElementById('eventsList');
  if (!list) return;
  const now = new Date();
  const filtered = _events.filter(e => {
    const d = new Date(e.date);
    const tOk = window.timeFilter === 'upcoming' ? d >= now : window.timeFilter === 'past' ? d < now : true;
    const yOk = window.typeFilter === 'All' || e.type === window.typeFilter;
    return tOk && yOk;
  });

  if (!filtered.length) {
    list.innerHTML = `<div class="no-results"><div class="nr-icon" aria-hidden="true">◌</div><h3>No events found</h3><p>Try adjusting filters.</p></div>`;
    return;
  }

  list.innerHTML = filtered.map(e => {
    const d = new Date(e.date);
    const mon = d.toLocaleString('en', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    const yr = d.getFullYear();
    return `<article class="event-card" role="listitem">
      <div class="event-date-block" aria-label="${e.date}">
        <div class="event-mon">${mon}</div>
        <div class="event-day">${day}</div>
        <div class="event-yr">${yr}</div>
      </div>
      <div class="event-info">
        <div class="event-type-badge">${e.type}</div>
        <h3 class="event-title">${e.title}</h3>
        <div class="event-loc">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          ${e.location}
        </div>
      </div>
      ${e.map ? `<div class="event-map">
        <iframe data-src="${e.map}" height="160" style="border:none;width:100%;border-radius:8px" loading="lazy" title="Event location map"></iframe>
      </div>` : ''}
    </article>`;
  }).join('');

  // IntersectionObserver for map iframes
  list.querySelectorAll('iframe[data-src]').forEach(iframe => {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            iframe.src = iframe.dataset.src;
            obs.disconnect();
          }
        });
      }, { rootMargin: '200px' });
      obs.observe(iframe);
    } else {
      iframe.src = iframe.dataset.src;
    }
  });
}

window.setEventFilter = function(kind, val) {
  if (kind === 'time') {
    window.timeFilter = val;
    ['efUpcoming', 'efPast', 'efAll'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('active');
    });
    const map = { upcoming: 'efUpcoming', past: 'efPast', all: 'efAll' };
    const active = document.getElementById(map[val]);
    if (active) active.classList.add('active');
  }
  if (kind === 'type') window.typeFilter = val;
  renderEvents();
};

window.toggleEvtTypeOpts = function() {
  const o = document.getElementById('evtTypeOpts');
  if (!o) return;
  const open = o.classList.toggle('show');
  const btn = document.getElementById('evtTypeBtn');
  if (btn) btn.setAttribute('aria-expanded', open);
};

window.setEventTypeFromDropdown = function(t) {
  window.typeFilter = t;
  const lbl = document.getElementById('evtTypeLabel');
  if (lbl) lbl.textContent = t;
  const o = document.getElementById('evtTypeOpts');
  if (o) o.classList.remove('show');
  renderEvents();
};

document.addEventListener('DOMContentLoaded', async () => {
  injectNav('events');
  injectBackToTop();
  initTheme();
  initBurgerMenu();
  initScrollHandlers();

  _events = await SheetsCMS.getEvents().catch(() => typeof EVENTS !== 'undefined' ? EVENTS : []);

  // Build type dropdown
  const types = ['All', 'Outreach', 'Book Fair', 'Book Launch', 'Book Signing', 'Book Talk', 'Workshop', 'Exhibition'];
  const evtTypeOpts = document.getElementById('evtTypeOpts');
  if (evtTypeOpts) {
    evtTypeOpts.innerHTML = types.map(t =>
      `<div class="cs-opt" data-t="${t}" onclick="setEventTypeFromDropdown('${t}')">${t}</div>`
    ).join('');
  }

  renderEvents();

  // Close dropdown on outside click
  document.addEventListener('click', e => {
    const o = document.getElementById('evtTypeOpts');
    const b = document.getElementById('evtTypeBtn');
    if (o && !o.contains(e.target) && b && !b.contains(e.target)) {
      o.classList.remove('show');
      if (b) b.setAttribute('aria-expanded', 'false');
    }
  });
});
