import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({userAgent:'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36'});
for (const q of process.argv.slice(2)) {
  const r = await p.goto('https://unsplash.com/napi/search/photos?per_page=15&orientation=landscape&query='+encodeURIComponent(q));
  console.log('==', q, r.status());
  try { const d = JSON.parse(await p.innerText('body'));
    for (const x of d.results) if(!x.premium && !x.plus) console.log(x.id, x.width+'x'+x.height, x.user.name, '|', (x.alt_description||'').slice(0,80), '|', x.urls.raw.split('?')[0]);
  } catch(e){ console.log((await p.content()).slice(0,300)); }
}
await b.close();
