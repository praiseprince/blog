// PRAISE PRINCE — shared site script
// Theme + palette persistence, masthead date, reading progress.

(function () {
  const root = document.documentElement;

  // ─── Theme + palette (persisted via localStorage; also accepts URL params) ───
  function getStored(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
  }
  function setStored(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  const params = new URLSearchParams(location.search);
  const theme = params.get('theme') || getStored('pp-theme', 'day');
  const palette = params.get('palette') || getStored('pp-palette', 'newsprint');

  root.setAttribute('data-theme', theme);
  root.setAttribute('data-palette', palette);

  // Sync across pages: if loaded inside an iframe, ping parent for shared state.
  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === '__pp_theme') {
      root.setAttribute('data-theme', e.data.theme);
      setStored('pp-theme', e.data.theme);
    }
    if (e.data.type === '__pp_palette') {
      root.setAttribute('data-palette', e.data.palette);
      setStored('pp-palette', e.data.palette);
    }
  });

  // Expose helpers
  window.PP = {
    setTheme(t) {
      root.setAttribute('data-theme', t);
      setStored('pp-theme', t);
      // Propagate to peer iframes (siblings on the same canvas) via parent.
      try { window.parent.postMessage({ type: '__pp_theme', theme: t }, '*'); } catch (e) {}
    },
    setPalette(p) {
      root.setAttribute('data-palette', p);
      setStored('pp-palette', p);
      try { window.parent.postMessage({ type: '__pp_palette', palette: p }, '*'); } catch (e) {}
    },
    toggleTheme() {
      const t = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
      this.setTheme(t);
      const btn = document.querySelector('.theme-toggle');
      if (btn) btn.textContent = t === 'night' ? '☼ DAY' : '☾ NIGHT';
    },
  };

  // ─── Masthead live date (formatted) ───
  function fmtDate(d) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${months[d.getMonth()]}. ${d.getDate()}, ${d.getFullYear()}`;
  }
  function fmtIssue(d) {
    const start = new Date(d.getFullYear(), 0, 1);
    const week = Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
    return `Vol. ${d.getFullYear() - 1996} · Issue ${String(week).padStart(2, '0')}`;
  }
  document.addEventListener('DOMContentLoaded', () => {
    const now = new Date();
    document.querySelectorAll('[data-date]').forEach(el => el.textContent = fmtDate(now));
    document.querySelectorAll('[data-issue]').forEach(el => el.textContent = fmtIssue(now));

    // Theme button label
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = root.getAttribute('data-theme') === 'night' ? '☼ DAY' : '☾ NIGHT';

    // Reading progress
    const bar = document.querySelector('.read-progress');
    if (bar) {
      const update = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
    }
  });
})();
