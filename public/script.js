// Shared site script
// Theme + palette persistence, masthead date, reading progress.

(function () {
  const root = document.documentElement;

  // ─── Theme + palette (persisted via localStorage) ───
  function getStored(key, fallback) {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
  }
  function setStored(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }

  const theme = getStored('pp-theme', 'day');
  const palette = getStored('pp-palette', 'newsprint');
  root.setAttribute('data-theme', theme);
  root.setAttribute('data-palette', palette);

  window.PP = {
    setTheme(t) {
      root.setAttribute('data-theme', t);
      setStored('pp-theme', t);
    },
    setPalette(p) {
      root.setAttribute('data-palette', p);
      setStored('pp-palette', p);
    },
    toggleTheme() {
      const t = root.getAttribute('data-theme') === 'night' ? 'day' : 'night';
      this.setTheme(t);
      const btn = document.querySelector('.theme-toggle');
      if (btn) btn.textContent = t === 'night' ? '☼ DAY' : '☾ NIGHT';
    },
  };

  // ─── Masthead live date / issue stamp ───
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

    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = root.getAttribute('data-theme') === 'night' ? '☼ DAY' : '☾ NIGHT';

    const bar = document.querySelector('.read-progress');
    if (bar) {
      const update = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
    }

    const viewer = document.querySelector('.photo-viewer');
    if (viewer) {
      const image = viewer.querySelector('img');
      const ix = viewer.querySelector('.ix');
      const caption = viewer.querySelector('.caption');
      const close = viewer.querySelector('.photo-viewer-close');
      const download = viewer.querySelector('.photo-viewer-download');

      // Turn /_astro/name.HASH.jpg into a clean "name.jpg" for the saved file.
      function downloadName(src) {
        const base = (src.split('/').pop() || 'image').split('?')[0];
        return base.replace(/\.[\w-]{6,}\.(jpe?g|png|webp|gif|avif)$/i, '.$1');
      }

      function closeViewer() {
        if (typeof viewer.close === 'function') viewer.close();
        else viewer.removeAttribute('open');
      }

      document.querySelectorAll('.photo-viewer-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
          const fullSrc = trigger.dataset.fullSrc || '';
          image.src = fullSrc;
          image.alt = trigger.dataset.fullAlt || '';
          ix.textContent = trigger.dataset.fullIx || '';
          caption.innerHTML = trigger.dataset.fullCaption || '';
          if (download) {
            download.href = fullSrc;
            download.setAttribute('download', downloadName(fullSrc));
          }

          if (typeof viewer.showModal === 'function') viewer.showModal();
          else viewer.setAttribute('open', '');

          // The <dialog> would auto-focus the close button and show it in its
          // hover/focus state. Blur it so the calm default look is shown
          // until the user actually interacts with it (Escape still closes).
          requestAnimationFrame(() => {
            if (document.activeElement === close) close.blur();
          });
        });
      });

      close.addEventListener('click', closeViewer);
      viewer.addEventListener('click', event => {
        if (event.target === viewer) closeViewer();
      });
    }
  });
})();
