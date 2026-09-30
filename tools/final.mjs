import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
const URL='http://localhost:5180/';
const b = await chromium.launch();
const errs=[];
const scrollAll = async (p) => {
  const H = await p.evaluate(()=>document.documentElement.scrollHeight);
  for (let y=0; y<H; y+=250) { await p.evaluate(y=>window.__lenis.scrollTo(y,{immediate:true}), y); await p.waitForTimeout(50); }
  await p.waitForTimeout(1200); return H;
};
// 1. heroes with full intro
for (const [w,h,dsf] of [[1440,900,1],[390,844,2]]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor:dsf, isMobile:w<500, hasTouch:w<500 });
  p.on('pageerror', e=>errs.push(e.message));
  await p.goto(URL, { waitUntil:'networkidle' });
  if (w>500) { await p.waitForTimeout(1100); await p.screenshot({ path:'shots/intro-loader-1440x900.png' }); }
  await p.waitForFunction(()=>window.__ready===true); await p.waitForTimeout(900);
  await p.screenshot({ path:`shots/hero-${w}x${h}.png` });
  await p.close();
}
// 2. key sections at 1440x900, end state
{
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  p.on('pageerror', e=>errs.push(e.message));
  await p.goto(URL+'?noloader&final', { waitUntil:'networkidle' });
  await p.waitForFunction(()=>window.__ready===true);
  await scrollAll(p);
  const pos = await p.evaluate(()=>{ const t=s=>document.querySelector(s).getBoundingClientRect().top+window.scrollY; return { about:t('.about__grid'), pillars:t('#approche'), inter:t('.inter'), services:t('#services'), value:t('.value__grid'), cta:t('#contact') }; });
  const go = async (y,n)=>{ await p.evaluate(y=>window.__lenis.scrollTo(y,{immediate:true}),y); await p.waitForTimeout(2200); await p.screenshot({path:`shots/${n}.png`}); };
  await go(pos.about-170,'section-about-1440x900');
  await go(pos.pillars+900*0.4,'section-pillars-1440x900');
  await go(pos.inter+120,'section-interlude-1440x900');
  await go(pos.services+330,'section-services-1440x900');
  await go(pos.services+1500,'section-services-2-1440x900');
  await go(pos.value-200,'section-value-1440x900');
  await go(pos.cta,'section-cta-1440x900');
  await p.close();
}
// 3. full pages: static layout (the end state of every reveal, pins unrolled)
for (const [w,dsf,n] of [[1440,1,'home-full-1440'],[390,2,'home-full-390']]) {
  const p = await b.newPage({ viewport:{width:w,height:900}, deviceScaleFactor:dsf, isMobile:w<500 });
  await p.goto(URL+'?static', { waitUntil:'networkidle' });
  await p.evaluate(async()=>{ for (let y=0;y<document.body.scrollHeight;y+=400){ window.scrollTo(0,y); await new Promise(r=>setTimeout(r,40)); } window.scrollTo(0,0); });
  await p.waitForTimeout(800);
  await p.screenshot({ path:`shots/${n}.png`, fullPage:true });
  await p.close();
}
// 4. scroll video
{
  const ctx = await b.newContext({ viewport:{width:1440,height:900}, recordVideo:{ dir:'/tmp/vid', size:{width:1440,height:900} } });
  const p = await ctx.newPage();
  await p.goto(URL, { waitUntil:'networkidle' });
  await p.waitForFunction(()=>window.__ready===true); await p.waitForTimeout(900);
  const H = await p.evaluate(()=>document.documentElement.scrollHeight - innerHeight);
  await p.mouse.move(720,450);
  for (let y=0; y<=H; y+=90) { await p.mouse.wheel(0,90); await p.waitForTimeout(55); }
  await p.waitForTimeout(1500);
  const v = p.video(); await ctx.close();
  const src = await v.path();
  execSync(`ffmpeg -y -loglevel error -i ${src} -vf "fps=30,format=yuv420p" -c:v libx264 -crf 22 -preset medium -movflags +faststart shots/scroll.mp4`);
}
console.log('errors', errs);
await b.close();
