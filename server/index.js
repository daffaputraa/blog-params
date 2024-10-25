// server/index.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const app = express();

app.use(express.static(path.join(__dirname, "../build")));

// Route untuk halaman artikel
app.get("/artikel/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    // Fetch data artikel dari API
    const response = await axios.get(
      "https://new-anime-api.vercel.app/all-anime"
    );
    const anime = response.data.find((item) => item.slug === slug);

    if (!anime) {
      return res
        .status(404)
        .sendFile(path.join(__dirname, "../build/index.html"));
    }

    // Baca file index.html
    const filePath = path.join(__dirname, "../build/index.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading index.html:", err);
        return res.status(500).send("Error reading index.html");
      }

      // Inject meta tags dinamis
      const modifiedHtml = data
        .replace(/<title>.*?<\/title>/, `<title>${anime.title}</title>`)
        .replace(
          /<meta name="description".*?>/,
          `<meta name="description" content="${anime.description}" />`
        )
        .replace(
          /<meta property="og:title".*?>/,
          `<meta property="og:title" content="${anime.title}" />`
        )
        .replace(
          /<meta property="og:description".*?>/,
          `<meta property="og:description" content="${anime.description}" />`
        )
        .replace(
          /<meta property="og:image".*?>/,
          `<meta property="og:image" content="${anime.thumbnail}" />`
        )
        .replace(
          /<meta property="og:url".*?>/,
          `<meta property="og:url" content="${process.env.REACT_APP_BASE_URL}/read/${anime.slug}" />`
        )
        .replace(
          /<meta property="twitter:title".*?>/,
          `<meta property="twitter:title" content="${anime.title}" />`
        )
        .replace(
          /<meta property="twitter:description".*?>/,
          `<meta property="twitter:description" content="${anime.description}" />`
        )
        .replace(
          /<meta property="twitter:image".*?>/,
          `<meta property="twitter:image" content="${anime.thumbnail}" />`
        )
        .replace(
          /<meta property="twitter:url".*?>/,
          `<meta property="twitter:url" content="${process.env.REACT_APP_BASE_URL}/read/${anime.slug}" />`
        );

      res.send(modifiedHtml);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).sendFile(path.join(__dirname, "../build/index.html"));
  }
});

// Fallback route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
