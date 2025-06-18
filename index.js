require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = [];

app.post('/api/shorturl', async (req, res) => {
  const url = req.body.url;
  // const urlRegex = /^(https?:\/\/)([\w.-]+)(\.[a-z]{2,})(\/.*)?$/i;
  const urlRegex = /^https?:\/\/.+/i;
  if (!urlRegex.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  let entry = urls.find(u => u.original_url === url);
  if (entry) {
    return res.json({
      original_url: entry.original_url,
      short_url: entry.short_url,
    });
  }

  const shortUrl = urls.length + 1;
  entry = { original_url: url, short_url: shortUrl };
  urls.push(entry);
  res.json(entry);
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  const entry = urls.find(u => u.short_url === shortUrl);
  if (entry) {
    return res.redirect(entry.original_url);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
