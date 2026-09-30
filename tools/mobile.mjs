import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:1, hasTouch:true, isMobile:true });
const errs=[]; p.on('pageerror', e=>errs.push(e.message));
await p.goto('http://localhost:5180/?noloader&final', { waitUntil:'networkidle' });
await p.waitForFunction(()=>window.__ready===true);
const H = await p.evaluate(()=>document.documentElement.scrollHeight);
for (let y=0; y<H; y+=250) { await p.evaluate(y=>window.__lenis.scrollTo(y,{immediate:true}), y); await p.waitForTimeout(50); }
await p.waitForTimeout(1500);
const n = Math.ceil(H/844);
for (let i=0;i<n;i+=Math.max(1,Math.floor(n/8))) { await p.evaluate(y=>window.__lenis.scrollTo(y,{immediate:true}), i*844); await p.waitForTimeout(1600); await p.screenshot({path:`shots/work-m-${String(i).padStart(2,'0')}.png`}); }
const ov = await p.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>window.innerWidth+1 && !e.closest('.cta__lines,.grain,.hero__media,.inter__media,.cta__media')).slice(0,10).map(e=>e.className+' '+Math.round(e.getBoundingClientRect().right)));
console.log('H',H,'overflow',ov,'errs',errs);
await b.close();
