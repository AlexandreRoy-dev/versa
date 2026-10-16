/* Versa Capital, accueil premium: header state, hero reveal, staggered reveals, count-up. No libs. */
const root = document.documentElement;
const params = new URLSearchParams(location.search);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || params.has('static');
root.classList.add(reduce ? 'no-motion' : 'motion');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const hdr = $('[data-hdr]');
let lastY = 0;
function updateHeader() {
  const y = window.scrollY;
  hdr.classList.toggle('is-scrolled', y > 40);
  if (!reduce) hdr.classList.toggle('is-hidden', y > 500 && y > lastY + 4);
  if (y < lastY - 4) hdr.classList.remove('is-hidden');
  lastY = y;
}
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href'); const t = id === '#top' ? null : $(id);
  if (id !== '#top' && !t) return;
  e.preventDefault();
  window.scrollTo({ top: t ? t.getBoundingClientRect().top + scrollY - 72 : 0, behavior: reduce ? 'auto' : 'smooth' });
}));

/* Staggered card delays */
$$('[data-stagger]').forEach((g) => [...g.children].forEach((c, i) => c.style.setProperty('--d', `${i * 110}ms`)));

/* Count-up on 20+ only */
function countUp(el) {
  const end = +el.dataset.count; const t0 = performance.now(); const dur = 1400;
  const step = (now) => { const p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
  el.textContent = '0'; requestAnimationFrame(step);
}

if (reduce) {
  $$('.fade').forEach((el) => el.classList.add('is-in'));
} else {
  requestAnimationFrame(() => root.classList.add('hero-in'));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    const n = e.target.querySelector('[data-count]'); if (n) countUp(n);
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.fade').forEach((el) => io.observe(el));
}
window.__ready = true;
