import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import themes from "../data/themes.json";

function ThemePage() {
  const { id } = useParams();
  const theme = themes.find((t) => t.id === id);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!theme) return;

    const fetchArticles = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            theme.query
          )}&sortBy=publishedAt&pageSize=20&apiKey=${
            process.env.REACT_APP_NEWS_API_KEY
          }`
        );

        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [theme]);

  if (!theme) {
    return <div>Theme not found.</div>;
  }

  return (
    <div className="theme-page">
      <h1>{theme.title}</h1>
      <p><strong>Category:</strong> {theme.category}</p>
      <p>{theme.description}</p>

      <hr style={{ margin: "24px 0" }} />

      {loading ? (
        <p>Loading articles...</p>
      ) : (
        <div>
          <h2>📰 Recent Articles</h2>
          <ul>
            {articles.map((article, index) => (
              <li key={index} style={{ marginBottom: "12px" }}>
                <a href={article.url} target="_blank" rel="noreferrer">
                  <strong>{article.title}</strong>
                </a>
                <br />
                <small>{new Date(article.publishedAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ThemePage;
