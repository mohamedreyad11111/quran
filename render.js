const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // تحميل الصفحة
  await page.goto('file://' + path.resolve('index.html'), { waitUntil: 'networkidle0' });

  // انتظار انتهاء الرندر (بناءً على تحديث نص الحالة في الـ HTML الخاص بك)
  await page.waitForFunction(
    () => document.querySelector('#status-text').innerText.includes('تم إنتاج الفيديو'),
    { timeout: 300000 } // 5 دقائق كحد أقصى للرندر
  );

  // استخراج البافر من المتصفح (هذه الخطوة تتطلب أن يكون الـ blob متاحاً)
  // كبديل، تأكد أن كودك يحفظ الملف، أو يمكنك استخراج البيانات هنا:
  const videoData = await page.evaluate(async () => {
    // هذا الجزء يعتمد على كيفية تخزين الـ blob في كودك الأصلي
    // يجب أن تكون الدالة قادرة على إعادة الـ buffer
  });

  console.log("تم الرندر بنجاح!");
  await browser.close();
})();
