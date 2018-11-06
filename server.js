'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

/** this project needs a db !! **/
const db = require('./db');

const validate = require('./validate');

const app = express();

// Basic Configuration 
const port = process.env.PORT || 3000;

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post("/api/shorturl/new",
  async (req, res, next) => {
    try {
      await validate.validateURL(req.body.url);
      next();
    } catch (err) {
      res.json({ error: 'invalid URL' });
    }
  },
  async (req, res) => {
    try {
      const data = await db.findOrCreateURL(req.body.url);
      res.json({ original_url: data.original_url, short_url: data.short_url });
    } catch (error) {
      res.json({ error });
    }
  }
);

app.get("/api/shorturl/all", async (req, res, next) => {
  try {
    const urls = await db.showAll();
    res.json({ urls });
  } catch (error) {
    res.json({ error });
  }
})

app.get("/api/shorturl/:shorturl", async (req, res, next) => {
  const url = parseInt(req.params.shorturl);
  if (isNaN(url)) res.json({ error: 'Wrong shorturl format' });
  try {
    const data = await db.shortUrlLookup(url);
    res.redirect(data.original_url);
  } catch (error) {
    res.json({ error });
  }
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});