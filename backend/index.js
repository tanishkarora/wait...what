const express = require('express');
const cors = require('cors');
const mongoose = require('./db'); // ensures connection
const Article = require('./models/article');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, _, next) => {
    console.log(req.method, req.url);
    next();
  });

// POST /api/articles - create a new article
app.post('/api/articles', async (req, res) => {
  try {
    const { title, date, snippet, significance, thumbnail, theme } = req.body;
    const newArticle = new Article({ title, date, snippet, significance, thumbnail, theme });
    const saved = await newArticle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles - fetch all articles under specified theme
app.get('/api/articles', async (req, res) => {
    try {
      const { theme } = req.query; // Extract 'theme' parameter from query string
      const filter = {};
      if (theme) filter.theme = theme; // Apply theme filter if provided
  
      const articles = await Article.find(filter).sort({ date: -1 });
      if (theme && articles.length === 0) {
        // Notify frontend when no articles match the requested theme
        return res.status(404).json({ message: `No articles found for theme '${theme}'.` });
      }
      return res.json(articles);
    } catch (err) {
      console.error('GET /api/articles error:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/articles', async (req, res) => {
    try {
      const { theme } = req.query;
      let result;
      if (theme) {
        // Delete only articles matching the provided theme
        result = await Article.deleteMany({ theme });
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: `No articles found for theme '${theme}'.` });
        }
        return res.json({ message: `Deleted ${result.deletedCount} articles for theme '${theme}'.` });
      }
      // No theme specified: delete all articles
      result = await Article.deleteMany({});
      return res.json({ message: `Deleted ${result.deletedCount} articles from all themes.` });
    } catch (err) {
      console.error('DELETE /api/articles error:', err);
      return res.status(500).json({ error: err.message });
    }
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
