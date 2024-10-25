// server/index.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "../build")));

// Proxy endpoints
app.get("/api/artikel/kajian", async (req, res) => {
  try {
    const response = await axios.get(
      "http://api.idrisiyyah.or.id:3000/artikel/kajian"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

app.get("/api/getimage/:imageName", async (req, res) => {
  try {
    const response = await axios.get(
      `http://api.idrisiyyah.or.id:3000/getimage/${req.params.imageName}`,
      { responseType: "stream" }
    );
    response.data.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
});

// Handle artikel routes for SEO
app.get("/artikel/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const indexPath = path.resolve(__dirname, "../build/index.html");

    // Fetch article data
    const response = await axios.get(
      "http://api.idrisiyyah.or.id:3000/artikel/kajian"
    );

    if (response.status === 200 && Array.isArray(response.data)) {
      const article = response.data.find(
        (item) => createSlug(item.judul_artikel) === slug
      );

      if (!article) {
        return res.sendFile(indexPath);
      }

      fs.readFile(indexPath, "utf8", (err, htmlData) => {
        if (err) {
          console.error("Error reading index.html:", err);
          return res.sendFile(indexPath);
        }

        // Generate absolute URLs
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const imageUrl = `${baseUrl}/api/getimage/${article.gambar}`;
        const articleUrl = `${baseUrl}/artikel/${slug}`;

        // Update meta tags
        const updatedHtml = htmlData
          .replace(
            /<title>.*?<\/title>/,
            `<title>${article.judul_artikel}</title>`
          )
          .replace(
            /<meta name="description".*?>/,
            `<meta name="description" content="${article.deskripsi}">`
          )
          .replace(
            /<meta property="og:title".*?>/,
            `<meta property="og:title" content="${article.judul_artikel}">`
          )
          .replace(
            /<meta property="og:description".*?>/,
            `<meta property="og:description" content="${article.deskripsi}">`
          )
          .replace(
            /<meta property="og:image".*?>/,
            `<meta property="og:image" content="${imageUrl}">`
          )
          .replace(
            /<meta property="og:url".*?>/,
            `<meta property="og:url" content="${articleUrl}">`
          );

        res.send(updatedHtml);
      });
    } else {
      res.sendFile(indexPath);
    }
  } catch (error) {
    console.error("Server error:", error);
    res.sendFile(path.resolve(__dirname, "../build/index.html"));
  }
});

// Handle all other routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build/index.html"));
});

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
