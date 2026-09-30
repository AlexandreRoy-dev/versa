import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
const r = await p.goto('https://versacapital.ca/wp-content/uploads/2021/01/image-1.png');
console.log(r.status(), r.headers()['content-type']);
if (r.ok()) { const fs = await import('fs'); fs.writeFileSync('public/img/logo-src.png', await r.body()); }
else { const r2 = await p.goto('https://versacapital.ca/'); console.log('home', r2.status()); const srcs = await p.$$eval('img', a=>a.map(i=>i.src)); console.log(srcs.slice(0,10)); }
await b.close();
