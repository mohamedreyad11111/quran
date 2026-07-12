const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  console.log("--- بدء تشغيل محرك الرندر ---");

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    protocolTimeout: 600000 // رفع المهلة إلى 10 دقائق
  });

  const page = await browser.newPage();

  // تتبع الـ Console من المتصفح إلى الـ Terminal الخاص بـ GitHub Action
  page.on('console', msg => {
    console.log(`[Browser Console]: ${msg.text()}`);
  });

  console.log("جاري فتح صفحة الرندر...");
  await page.goto('file://' + path.resolve('index.html'), { 
    waitUntil: 'networkidle0',
    timeout: 60000 
  });

  // انتظار انتهاء الرندر بناءً على الـ console.log
  console.log("بانتظار إشارة اكتمال الرندر من المتصفح...");
  
  await new Promise((resolve, reject) => {
    page.on('console', (msg) => {
      if (msg.text() === 'RENDER_FINISHED') {
        console.log("تم استلام إشارة اكتمال الرندر!");
        resolve();
      }
    });

    // مهلة طوارئ في حال تعليق المتصفح
    setTimeout(() => reject(new Error("تجاوز وقت الرندر المسموح به (Timeout)")), 600000);
  });

  console.log("إغلاق المتصفح...");
  await browser.close();
  console.log("--- انتهت المهمة بنجاح ---");
})();
