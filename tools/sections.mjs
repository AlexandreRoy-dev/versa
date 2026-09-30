import { chromium } from 'playwright';
const prefix = process.argv[2] || 'work-';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
const errs=[]; p.on('pageerror', e=>errs.push(e.message));
await p.goto('http://localhost:5180/?noloader&final', { waitUntil:'networkidle' });
await p.waitForFunction(()=>window.__ready===true);
const H = await p.evaluate(()=>document.documentElement.scrollHeight);
// scroll through everything so all once-reveals fire
for (let y=0; y<H; y+=300) { await p.evaluate(y=>window.__lenis.scrollTo(y,{immediate:true}), y); await p.waitForTimeout(60); }
await p.waitForTimeout(1500);
const go = async (y, name) => { await p.evaluate(y=>window.__lenis.scrollTo(y,{immediate:true}), y); await p.waitForTimeout(2200); await p.screenshot({ path:`shots/${prefix}${name}.png` }); };
const pos = await p.evaluate(()=>{
  const top = s => { const e=document.querySelector(s); return e.getBoundingClientRect().top + window.scrollY; };
  const st = window.ScrollTrigger || null;
  return { about: top('#qui'), aboutGrid: top('.about__grid'), pillars: top('#approche'), inter: top('.inter'), services: top('#services'), value: top('#valeur'), engage: top('.engage'), cta: top('#contact') };
});
console.log(pos);
await go(pos.about, 's-about');
await go(pos.aboutGrid - 150, 's-about2');
await go(pos.pillars + 900*1.3, 's-pillars');
await go(pos.inter + 100, 's-inter');
await go(pos.services + 1400, 's-services');
await go(pos.value - 60, 's-value');
await go(pos.engage + 100, 's-engage');
await go(pos.cta, 's-cta');
await go(H, 's-footer');
console.log('errors', errs);
await b.close();
