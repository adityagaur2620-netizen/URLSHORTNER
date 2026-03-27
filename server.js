const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
app.use(express.json());
app.use(cors());

// In-memory DB
const urlDatabase = {};       // shortCode → originalUrl
const reverseIndex = {};      // originalUrl → shortCode (for duplicate detection)

// --- Rate limiting (simple in-memory) ---
const rateLimitMap = {};
const RATE_LIMIT = 10;        // max requests
const RATE_WINDOW_MS = 60_000; // per minute

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!rateLimitMap[ip]) {
    rateLimitMap[ip] = { count: 1, windowStart: now };
    return next();
  }

  const entry = rateLimitMap[ip];

  if (now - entry.windowStart > RATE_WINDOW_MS) {
    // Reset window
    entry.count = 1;
    entry.windowStart = now;
    return next();
  }

  if (entry.count >= RATE_LIMIT) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute." });
  }

  entry.count++;
  next();
}

// --- URL validation ---
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Test route
app.get('/', (req, res) => {
  res.send("API running...");
});

// Shorten route
app.post('/shorten', rateLimit, (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: "URL required" });
    }

    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: "Invalid URL. Must start with http:// or https://" });
    }

    // Duplicate detection — return existing short code for same URL
    if (reverseIndex[originalUrl]) {
      const existingCode = reverseIndex[originalUrl];
      return res.json({ shortUrl: `http://localhost:5000/${existingCode}` });
    }

    const shortCode = nanoid(6);
    urlDatabase[shortCode] = originalUrl;
    reverseIndex[originalUrl] = shortCode;

    res.json({ shortUrl: `http://localhost:5000/${shortCode}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect
app.get('/:code', (req, res) => {
  const originalUrl = urlDatabase[req.params.code];

  if (originalUrl) {
    return res.redirect(originalUrl);
  }

  res.status(404).send("Not found");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});