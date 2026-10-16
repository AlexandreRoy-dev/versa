import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1440,height:900}, recordVideo:{ dir:'/workspace/versa/_vid', size:{width:1440,height:900} } });
const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:5180/', { waitUntil:'load' });
await p.mouse.move(720,450);
await p.waitForTimeout(2200);
const H = await p.evaluate(()=>document.documentElement.scrollHeight - innerHeight);
const steps = 110;
for (let i=0;i<steps;i++){ await p.mouse.wheel(0, H/steps); await p.waitForTimeout(70); if(i===40){ await p.mouse.move(400,500); } if(i===42){ await p.mouse.move(520,420);} }
await p.waitForTimeout(800);
const v = p.video(); await ctx.close(); console.log(await v.path(), errs); await b.close();
