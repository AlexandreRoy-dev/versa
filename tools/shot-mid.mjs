import { chromium } from 'playwright';
const [,,out]=process.argv;
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:5180/',{waitUntil:'load'}); await p.waitForTimeout(1800);
await p.mouse.move(720,450); for(let i=0;i<10;i++){await p.mouse.wheel(0,52);await p.waitForTimeout(60);}
await p.waitForTimeout(1500); await p.screenshot({path:out}); await b.close();
