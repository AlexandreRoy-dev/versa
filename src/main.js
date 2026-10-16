/* Versa Capital, accueil simple: header state + gentle fade-ins only. */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const params = new URLSearchParams(location.search);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || params.has('static');
root.classList.add(reduce ? 'no-motion' : 'motion');

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const hdr = $('[data-hdr]');
let lastY = 0;
function updateHeader(y) {
  const probe = document.elementFromPoint(window.innerWidth / 2, hdr.offsetHeight + 2);
  const sec = probe && probe.closest('[data-section]');
  const atTop = y < 80;
  hdr.classList.toggle('is-solid', !atTop && sec && sec.dataset.section === 'light');
  hdr.classList.toggle('is-dark', !atTop && sec && sec.dataset.section === 'dark');
  if (!reduce) hdr.classList.toggle('is-hidden', y > 400 && y > lastY + 4);
  if (y < lastY - 4) hdr.classList.remove('is-hidden');
  lastY = y;
}

window.addEventListener('scroll', () => updateHeader(window.scrollY), { passive: true });
updateHeader(0);
window.__ready = true;

$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  const target = id === '#top' ? document.body : $(id);
  if (!target) return;
  e.preventDefault();
  const y = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - 72;
  window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
}));

if (!reduce) {
  $$('.fade').forEach((el) => {
    gsap.to(el, {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    });
  });
}
