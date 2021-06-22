const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
const cheerio = require('cheerio');
const express = require('express');
const app = express();


app.get('/', (req, res) => { res.send('Home Page Route') });

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));