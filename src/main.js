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

/* Count-up on the credibility figures */
function countUp(el) {
  const end = +el.dataset.count; const t0 = performance.now(); const dur = 1400;
  const step = (now) => { const p = Math.min(1, (now - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString('fr-CA'); if (p < 1) requestAnimationFrame(step); };
  el.textContent = '0'; requestAnimationFrame(step);
}

if (reduce) {
  $$('.fade').forEach((el) => el.classList.add('is-in'));
} else {
  requestAnimationFrame(() => root.classList.add('hero-in'));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.fade').forEach((el) => io.observe(el));
}
window.__ready = true;

/* ---- Vivant 2026-10-16: progress bar, parallax, tilt, magnetic (no libs) ---- */
const bar = $('.progress');
const heroCopy = $('.hero__grid');
const pars = $$('[data-parallax] img');
let ticking = false;
function onScroll() {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    if (!reduce) {
      if (heroCopy && scrollY < innerHeight * 1.2) { const k = Math.min(1, scrollY / (innerHeight * 0.8)); heroCopy.style.opacity = (1 - k * 0.85).toFixed(3); heroCopy.style.translate = `0 ${(-k * 40).toFixed(1)}px`; }
      pars.forEach((img) => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        img.style.translate = `0 ${(-p * 24).toFixed(1)}px`;
      });
    }
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  $$('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-6px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
  $$('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px,${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
