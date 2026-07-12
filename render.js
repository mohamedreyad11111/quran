const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

// خادم بسيط جداً بدون مكتبات خارجية
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, content) => {
    res.end(content);
  });
}).listen(3000);

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log(`[Browser]: ${msg.text()}`));
  await page.goto('http://localhost:3000/index.html');

  // ... باقي كود الانتظار ...
  await browser.close();
  server.close();
})();
