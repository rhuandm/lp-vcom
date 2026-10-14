(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('mobile-menu');
  const setMenu = open => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    toggle.textContent = open ? 'Fechar' : 'Menu';
  };
  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  window.matchMedia('(min-width: 900px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Portfolio carousel ---------- */
  const carousel = document.querySelector('.carousel');
  const slides = [...carousel.querySelectorAll('.slide')];
  const dots = [...document.querySelectorAll('.dot')];
  const n = slides.length;
  let current = 0;
  let paused = false;

  const go = i => {
    current = (i + n) % n;
    slides.forEach((s, k) => {
      s.classList.toggle('is-active', k === current);
      s.classList.toggle('is-before', k < current);
      s.setAttribute('aria-hidden', String(k !== current));
    });
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === current)));
  };

  dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
  document.querySelector('.arrow--prev').addEventListener('click', () => go(current - 1));
  document.querySelector('.arrow--next').addEventListener('click', () => go(current + 1));

  carousel.addEventListener('mouseenter', () => { paused = true; });
  carousel.addEventListener('mouseleave', () => { paused = false; });
  carousel.addEventListener('focusin', () => { paused = true; });
  carousel.addEventListener('focusout', () => { paused = false; });

  let touchX = 0;
  carousel.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; paused = true; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
    paused = false;
  }, { passive: true });

  // Once the carousel is near the viewport, load the other slides' images so swaps are instant.
  if ('IntersectionObserver' in window) {
    const warm = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      carousel.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
      warm.disconnect();
    }, { rootMargin: '400px 0px' });
    warm.observe(carousel);
  }

  if (!reduceMotion) {
    setInterval(() => { if (!paused && !document.hidden) go(current + 1); }, 6000);
  }

  /* ---------- Scroll reveal ---------- */
  // The js-reveal class is set by an inline script in <head> to avoid a flash before this runs.
  if (!document.documentElement.classList.contains('js-reveal')) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const sibs = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
      const delay = Math.min(sibs.indexOf(el), 6) * 90;
      el.style.setProperty('--d', delay + 'ms');
      el.classList.add('is-visible');
      io.unobserve(el);
      // Hand control back to the element's own hover transitions once revealed.
      setTimeout(() => { el.removeAttribute('data-reveal'); el.classList.remove('is-visible'); el.style.removeProperty('--d'); }, 1000 + delay);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();
