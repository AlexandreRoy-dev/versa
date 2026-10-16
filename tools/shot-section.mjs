import { chromium } from 'playwright';
const [,,out,w,sel]=process.argv; const W=+w;
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:W,height:900},deviceScaleFactor:W<500?2:1,isMobile:W<500});
await p.goto('http://localhost:5180/?static',{waitUntil:'load'});
const el=await p.$(sel); await p.addStyleTag({content:'.hdr,.progress{display:none!important}'}); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(1200);
await el.screenshot({path:out}); await b.close();
