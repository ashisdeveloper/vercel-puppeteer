/* const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core'); */
const bluebird = require("bluebird");
const verifier = require('email-verify');
const express = require('express');
const cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 3000;
let server = app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
server.setTimeout(0)
process.setMaxListeners(0);


app.get('/', async (req, res) => {
    let result = await guessEmail(req.query.site.trim())
    res.status(200).json({ result })
});

const guessEmail = async (domain) => {
    let preMailArr = ['info', 'sales', 'support', 'contact', 'admin']
    preMailArr = shuffle(preMailArr)
    let finalResult = [];
    await bluebird.map(preMailArr, async (preMail) => {
        if (finalResult.length == 0) {
            let email = preMail + '@' + domain
            let result = await new Promise((resolve, reject) => {
                try {
                    verifier.verify(email, function (err, info) {
                        if (!err) resolve(info.success)
                        else {
                            resolve(false)
                        }
                    })
                } catch (e) { return false }
            })
            finalResult.push({ domain, email, status: result })
        }
    }, { concurrency: 5 })
    finalResult = finalResult.filter(item => item.status == true) || []
    finalResult = finalResult.length > 0 ? finalResult.map(item => item.email) : []
    return finalResult
}

function shuffle(array) {
    var currentIndex = array.length, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

/* app.get('/', async (req, res) => {
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

    await page.goto('https://www.waferpro.com');
    allHtml = allHtml + await page.content();

    await page.goto('https://www.softtechlab.com');
    allHtml = allHtml + await page.content();

    await page.goto('https://www.ismartslab.com');
    allHtml = allHtml + await page.content();

    await page.goto('https://www.google.com');
    allHtml = allHtml + await page.content();

    await page.goto('https://www.facebook.com');
    allHtml = allHtml + await page.content();
    // await page.setContent('<h1>Hello World!</h1>', { waitUntil: 'networkidle2' });
    // await page.screenshot({ path: 'public/image.png' });
    await browser.close();
    res.status(200).json({ result: allHtml })
}); */


