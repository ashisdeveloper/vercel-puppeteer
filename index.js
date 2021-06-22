const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    const browser = await puppeteer.launch(process.env.AWS_EXECUTION_ENV ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless
    } : {
        args: [],
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 400,
        height: 400,
        deviceScaleFactor: 1
    });
    await page.goto('https://www.telehealthindia.in');

    let allHtml = await page.content();
    // await page.setContent('<h1>Hello World!</h1>', { waitUntil: 'networkidle2' });
    // await page.screenshot({ path: 'public/image.png' });
    await browser.close();
    res.status(200).json({ result: allHtml })
});

const port = process.env.PORT || 3000;

let server = app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
server.setTimeout(0)
process.setMaxListeners(0);