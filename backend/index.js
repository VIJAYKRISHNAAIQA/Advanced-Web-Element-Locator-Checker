const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ✅ Route to fetch full HTML from a given URL
app.post('/fetch-html', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (AdvancedLocatorBot/1.0)',
        Accept: 'text/html',
      },
    });
    res.json({ html: response.data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch HTML', details: err.message });
  }
});

// 🚀 Future Endpoints (placeholders)
/*
app.post('/validate-locators', async (req, res) => {
  // Use Puppeteer or Playwright to validate selector presence in live DOM
});

app.post('/generate-sitemap-locators', async (req, res) => {
  // Crawl sitemap.xml and fetch all HTML pages to extract locators
});

app.post('/ai-score-locators', async (req, res) => {
  // Score selectors based on stability and AI ranking model
});

app.get('/export-locators', (req, res) => {
  // Export data into Selenium / Postman JSON formats
});
*/

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
