import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const params = new URLSearchParams(location.search);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || params.has('static');
const skipLoader = params.has('noloader');
root.classList.add(reduce ? 'no-motion' : 'motion');

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* Split an element's text into masked words, keeping inline markup. */
function splitWords(el, cls = 'w') {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const o = document.createElement('span'); o.className = cls;
          const i = document.createElement('span'); i.textContent = part;
          o.appendChild(i); frag.appendChild(o);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
  walk(el);
  $$('.' + cls, el).forEach((w) => w.setAttribute('aria-hidden', 'true'));
  return $$('.' + cls + ' > span', el);
}

/* Header state */
const hdr = $('[data-hdr]');
let lastY = 0;
function updateHeader(y) {
  const probe = document.elementFromPoint(window.innerWidth / 2, hdr.offsetHeight + 2);
  const sec = probe && probe.closest('[data-section]');
  const atTop = y < window.innerHeight * 0.6;
  hdr.classList.toggle('is-solid', !atTop && sec && sec.dataset.section === 'light');
  hdr.classList.toggle('is-dark', !atTop && sec && sec.dataset.section === 'dark');
  if (!reduce) hdr.classList.toggle('is-hidden', y > window.innerHeight && y > lastY + 2);
  if (y < lastY - 2) hdr.classList.remove('is-hidden');
  lastY = y;
}

/* CTA canvas: slow drifting lines on the V slant */
function vLines(canvas, animate) {
  const ctx = canvas.getContext('2d');
  const slope = 67 / 200; // slant of the logo stripes
  let w, h, dpr, lines, running = false, t0 = performance.now();
  const colors = ['rgba(151,211,242,', 'rgba(0,168,232,', 'rgba(255,255,255,'];
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(w / 38);
    lines = Array.from({ length: n }, (_, i) => ({
      x: (i / n) * (w + h * slope) - h * slope * 0.2,
      a: Math.random() < 0.12 ? 0.22 + Math.random() * 0.16 : 0.04 + Math.random() * 0.06,
      c: colors[Math.random() < 0.15 ? 1 : Math.random() < 0.5 ? 0 : 2],
      s: 6 + Math.random() * 10,
      len: 0.35 + Math.random() * 0.65,
      off: Math.random(),
    }));
  }
  function draw(now) {
    const t = (now - t0) / 1000;
    ctx.clearRect(0, 0, w, h);
    for (const l of lines) {
      const x = ((l.x + t * l.s) % (w + h * slope + 100)) - 50;
      const yA = h * ((l.off + t * 0.02 * l.s / 10) % 1) - h * 0.2;
      const y0 = Math.max(0, yA), y1 = Math.min(h, yA + h * l.len);
      const g = ctx.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, l.c + '0)'); g.addColorStop(0.5, l.c + l.a + ')'); g.addColorStop(1, l.c + '0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - y0 * slope + h * slope, y0); ctx.lineTo(x - y1 * slope + h * slope, y1); ctx.stroke();
    }
    if (running) requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize', resize);
  if (!animate) { draw(performance.now()); return; }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; requestAnimationFrame(draw); }
    else if (!e.isIntersecting) running = false;
  }).observe(canvas);
}

/* ---------- Reduced motion / static: content already visible ---------- */
if (reduce) {
  window.addEventListener('scroll', () => updateHeader(window.scrollY), { passive: true });
  updateHeader(0);
  vLines($('.cta__lines'), false);
  window.__ready = true;
} else {
  initMotion();
}

function initMotion() {
  const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  window.__lenis = lenis;
  lenis.on('scroll', ({ scroll }) => { ScrollTrigger.update(); updateHeader(scroll); });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); const target = id === '#top' ? 0 : $(id);
    if (target === null) return; e.preventDefault(); lenis.scrollTo(target, { duration: 1.6 });
  }));

  /* Split text */
  const splits = $$('.split').map((el) => ({ el, words: splitWords(el) }));
  splits.forEach(({ words }) => gsap.set(words, { yPercent: 110 }));
  const wordScrubs = $$('[data-words]').map((el) => ({ el, words: splitWords(el, 'wd') }));

  /* Intro */
  lenis.stop();
  const heroLines = $$('.hero__title .ln__i');
  gsap.set(heroLines, { y: 0, yPercent: 110 });
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => { lenis.start(); window.__ready = true; } });
  const loader = $('.loader');
  if (!skipLoader) {
    const stripes = $$('.vmark__s'); const v = $('.vmark__v');
    gsap.set(stripes, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set(v, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set('.loader__word span', { yPercent: 120 });
    intro
      .to(stripes, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, stagger: 0.09, ease: 'expo.inOut' }, 0.15)
      .to(v, { clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'expo.inOut' }, 0.45)
      .to('.loader__word span', { yPercent: 0, duration: 0.9, stagger: 0.06 }, 0.9)
      .to('.loader__inner', { y: -30, autoAlpha: 0, duration: 0.6, ease: 'power3.in' }, 1.75)
      .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 2.05)
      .set(loader, { display: 'none' });
  } else {
    loader.style.display = 'none';
  }
  const s = skipLoader ? 0 : 2.2;
  intro
    .fromTo('.hero__img', { scale: 1.22 }, { scale: 1.06, duration: 2.6, ease: 'expo.out' }, s - 0.3)
    .to('.hero__kicker', { autoAlpha: 1, duration: 1 }, s + 0.2)
    .to(heroLines, { yPercent: 0, y: 0, duration: 1.4, stagger: 0.1 }, s + 0.05)
    .fromTo('.hero__rule', { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'expo.inOut' }, s + 0.2)
    .to('.hero .fade', { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.08 }, s + 0.6);
  $$('.hero .fade').forEach((el) => el.dataset.done = '1');

  /* Hero scroll-out */
  gsap.to('.hero__img', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__title', { yPercent: -18, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true } });

  /* Generic reveals */
  splits.forEach(({ el, words }) => {
    if (el.closest('.services') && window.innerWidth >= 900) return; // handled in horizontal scroller
    gsap.to(words, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.045, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  $$('.fade').forEach((el) => {
    if (el.dataset.done) return;
    gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });
  $$('.reveal-clip').forEach((el) => {
    const img = $('img', el);
    gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
      .to(el, { clipPath: 'inset(0% 0 0 0)', duration: 1.6, ease: 'expo.inOut' })
      .from(img, { scale: 1.3, duration: 2, ease: 'expo.out' }, 0.1);
  });
  $$('.parallax').forEach((el) => {
    const sp = parseFloat(el.dataset.speed || 0.1);
    gsap.fromTo(el, { yPercent: -sp * 50 }, { yPercent: sp * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('.sec-head .hair').forEach((el) => gsap.from(el, { scaleX: 0, duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
  wordScrubs.forEach(({ el, words }) => {
    if (params.has('final')) return; // screenshot mode: scrubbed copy shown at its end state
    gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  });
  $$('.vrow').forEach((row, i) => {
    gsap.from($('.vrow__t', row), { yPercent: 105, duration: 1.3, ease: 'expo.out', delay: i * 0.02, scrollTrigger: { trigger: row, start: 'top 92%', once: true } });
  });

  /* Interlude: image opens from a framed inset */
  gsap.fromTo('.inter__media', { clipPath: 'inset(14% 12% 14% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.inter', start: 'top bottom', end: 'top 10%', scrub: true } });
  gsap.fromTo('.inter__media img', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.inter', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* Desktop-only pinned storytelling */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    /* Pillars */
    const sec = $('.pillars'); sec.classList.add('is-pinned');
    const pillars = $$('.pillar'); const imgs = $$('.pillars__img'); const tabs = $$('.pillars__tabs li');
    const pw = pillars.map((p) => ({ t: splitWords($('.pillar__title', p), 'w'), b: $('.pillar__body', p) }));
    pillars.forEach((p, i) => { if (i) { gsap.set(pw[i].t, { yPercent: 110 }); gsap.set(pw[i].b, { autoAlpha: 0, y: 20 }); } });
    gsap.set(imgs, { clipPath: 'inset(100% 0 0 0)' }); gsap.set(imgs[0], { clipPath: 'inset(0% 0 0 0)' });
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    for (let i = 1; i < pillars.length; i++) {
      const at = i * 2;
      tl.to(pw[i - 1].t, { yPercent: -110, duration: 0.8, stagger: 0.04 }, at)
        .to(pw[i - 1].b, { autoAlpha: 0, y: -20, duration: 0.6 }, at)
        .to(pw[i].t, { yPercent: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, at + 0.55)
        .to(pw[i].b, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' }, at + 0.7)
        .to(imgs[i], { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'expo.inOut' }, at)
        .fromTo(imgs[i], { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, at + 0.2);
    }
    tl.to({}, { duration: 1 });
    ScrollTrigger.create({
      trigger: sec, start: 'top top', end: '+=260%', pin: '.pillars__pin', scrub: 0.8, animation: tl,
      onUpdate: (self) => {
        const p = self.progress * 3;
        tabs.forEach((t, i) => { t.style.setProperty('--p', Math.min(1, Math.max(0, p - i))); t.classList.toggle('is-on', p >= i && (p < i + 1 || i === 2)); });
      },
    });

    /* Services horizontal */
    const svcSec = $('.services'); svcSec.classList.add('is-hscroll');
    const track = $('.services__track');
    const dist = () => track.scrollWidth - window.innerWidth;
    const hs = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: svcSec, start: 'top top', end: () => '+=' + dist(), pin: '.services__pin', scrub: 1, invalidateOnRefresh: true, onUpdate: (self) => gsap.set('.services__prog i', { scaleX: self.progress }) } });
    const intro = splits.find((x) => x.el.classList.contains('svc__headline'));
    if (intro) gsap.to(intro.words, { yPercent: 0, duration: 1.3, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: svcSec, start: 'top 60%', once: true } });
    $$('.svc:not(.svc--intro)').forEach((panel) => {
      const fig = $('.svc__fig', panel); const img = $('img', fig);
      gsap.fromTo(fig, { clipPath: 'polygon(30% 0,100% 0,70% 100%,0 100%)' }, { clipPath: 'polygon(0% 0,100% 0,100% 100%,0 100%)', ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: hs, start: 'left 95%', end: 'left 35%', scrub: true } });
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: hs, start: 'left right', end: 'right left', scrub: true } });
      gsap.from($$('.svc__title, .svc__list li, .svc__body .label', panel), { x: 60, autoAlpha: 0, stagger: 0.06, ease: 'none', scrollTrigger: { trigger: panel, containerAnimation: hs, start: 'left 85%', end: 'left 40%', scrub: true } });
    });
    return () => { sec.classList.remove('is-pinned'); svcSec.classList.remove('is-hscroll'); };
  });
  mm.add('(max-width: 899px)', () => {
    $$('.svc__fig').forEach((fig) => gsap.fromTo(fig, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: fig, start: 'top 85%', once: true } }));
    $$('.pillars__img').forEach((img) => gsap.fromTo(img, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: img, start: 'top 85%', once: true } }));
  });

  /* Stat count */
  const num = $('.svc__num span');
  if (num) { const o = { v: 0 }; gsap.to(o, { v: 20, duration: 2, ease: 'expo.out', onUpdate: () => (num.textContent = Math.round(o.v)), scrollTrigger: { trigger: '.services', start: 'top 55%', once: true } }); }

  vLines($('.cta__lines'), true);
  gsap.from('.cta__row > *', { y: 40, autoAlpha: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.cta__row', start: 'top 92%', once: true } });

  /* Cursor + magnetic (fine pointers only) */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    root.classList.add('has-cursor');
    const c = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.12 }), dy = gsap.quickTo(dot, 'y', { duration: 0.12 });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
    let shown = false;
    window.addEventListener('pointermove', (e) => { if (!shown) { shown = true; c.classList.add('is-on'); } dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    document.addEventListener('pointerover', (e) => {
      c.classList.toggle('is-link', !!e.target.closest('a, button, [data-hover]'));
      c.classList.toggle('is-media', !!e.target.closest('[data-cursor]'));
    });
    $$('[data-magnetic]').forEach((el) => {
      const xT = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, .4)' }), yT = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, .4)' });
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xT((e.clientX - r.left - r.width / 2) * 0.35); yT((e.clientY - r.top - r.height / 2) * 0.35); });
      el.addEventListener('pointerleave', () => { xT(0); yT(0); });
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
}
