import express from 'express';
import puppeteer from 'puppeteer'; // Now importing 'puppeteer' instead of 'puppeteer-core'

const app = express();
const port = 3400;

// Route to get HTML from a provided URL
app.get('/get-html', async (req, res) => {
  const { url } = req.query;

  // Ensure URL is provided
  if (!url) {
    return res.status(400).send('URL query parameter is required.');
  }

  try {
    // Launch Puppeteer without specifying executablePath (it uses the bundled Chromium by default)
    const browser = await puppeteer.launch({
      headless: true, // Set to true for headless operation
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Retrieve the page's HTML
    const html = await page.content();

    // Close the browser after scraping the content
    await browser.close();

    // Send the HTML content back as the response
    res.send(html);
  } catch (error) {
    console.error('Error while fetching HTML:', error);
    res.status(500).send('Error fetching HTML content.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
