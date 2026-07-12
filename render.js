const puppeteer = require('puppeteer');
const serve = require('serve');
const path = require('path');

(async () => {
  // تشغيل خادم محلي على المنفذ 3000
  const server = serve(path.resolve('.'), { port: 3000 });
  console.log("--- الخادم المحلي يعمل على http://localhost:3000 ---");

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    protocolTimeout: 600000
  });

  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[Browser]: ${msg.text()}`));

  // الآن نفتح الرابط عبر http بدلاً من file
  console.log("جاري فتح الرابط...");
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle0' });

  // انتظار إشارة النجاح
  await new Promise((resolve, reject) => {
    page.on('console', (msg) => {
      if (msg.text() === 'RENDER_FINISHED') resolve();
    });
    setTimeout(() => reject(new Error("Timeout")), 600000);
  });

  await browser.close();
  server.stop(); // إيقاف الخادم
  console.log("--- انتهت المهمة بنجاح ---");
})();
