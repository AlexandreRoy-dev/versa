import { chromium } from 'playwright';
const b = await chromium.launch();
const errs=[];
for (const [w,h,name] of [[1440,900,'hero-1440x900'],[390,844,'hero-390x844']]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor: w<500?2:1 });
  p.on('pageerror', e=>errs.push(e.message)); p.on('console', m=>{ if(m.type()==='error') errs.push(m.text()); });
  await p.goto('http://localhost:5180/', { waitUntil:'networkidle' });
  await p.waitForFunction(()=>window.__ready===true,{timeout:15000});
  await p.waitForTimeout(800);
  await p.screenshot({ path:`shots/${process.argv[2]||''}${name}.png` });
  await p.close();
}
console.log('errors:', errs);
await b.close();
