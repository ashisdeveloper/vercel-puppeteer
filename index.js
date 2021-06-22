const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

app.get('/', async (req, res) => {
    
    res.status(200).json({ result: 'allHtml' })
});

const port = process.env.PORT || 3000;

let server = app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));
server.setTimeout(0)
process.setMaxListeners(0);