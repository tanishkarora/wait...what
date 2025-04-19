import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import themes from "../data/themes.json";
import { scoreArticleWithLLM } from "../utils/llmScorer";
import TimelineEvent from "../components/TimelineEvent";
function ThemePage() {
  const { id } = useParams();
  const theme = themes.find((t) => t.id === id);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLevel, setDetailLevel] = useState(2); // 1 = concise, 2 = balanced, 3 = detailed
  
  const filteredArticles = articles.filter(
    (article) => article.significanceScore >= detailLevel
  );

  useEffect(() => {
    if (!theme) return;
  
    const fetchAndScoreArticles = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(
            theme.query
          )}&sortBy=publishedAt&pageSize=15&apiKey=${
            process.env.REACT_APP_NEWS_API_KEY
          }`
        );
  
        const data = await response.json();
        const rawArticles = data.articles || [];
  
        const scored = await Promise.all(
          rawArticles.map(async (article) => {
            const score = await scoreArticleWithLLM(article);
            return { ...article, significanceScore: score };
          })
        );
  
        const final = scored
          .filter((a) => a.significanceScore >= 3)
          .sort((a, b) =>
            b.significanceScore === a.significanceScore
              ? new Date(a.publishedAt) - new Date(b.publishedAt)
              : b.significanceScore - a.significanceScore
          );
  
        setArticles(final);
      } catch (error) {
        console.error("Error fetching or scoring articles:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAndScoreArticles();
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
              <div style={{ margin: "24px 0" }}>
          <label><strong>View:</strong></label>
          <div style={{
            display: "flex",
            gap: "10px",
            marginTop: "8px",
            alignItems: "center"
          }}>
            <span style={{ fontSize: "0.9rem" }}>Concise</span>
      
            {[1, 2, 3].map((level) => (
              <button
                key={level}
                onClick={() => setDetailLevel(level)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  backgroundColor: detailLevel === level ? "#333" : "#f0f0f0",
                  color: detailLevel === level ? "#fff" : "#000",
                  cursor: "pointer",
                  fontWeight: detailLevel === level ? "bold" : "normal"
                }}
              >
                {level === 1 ? "1" : level === 2 ? "2" : "3"}
              </button>
            ))}

            <span style={{ fontSize: "0.9rem" }}>Detailed</span>
          </div>
        </div>
      {loading ? (
        <p>Loading articles...</p>
      ) : (
        <div>
          <h2>📰 Recent Articles</h2>
             {loading ? (
              <p>Loading timeline...</p>
            ) : filteredArticles.length === 0 ? (
              <p>No events at this detail level.</p>
            ) : (
              <div className="timeline">
                {filteredArticles.map((article, index) => (
                  <TimelineEvent key={index} article={article} />
                ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}

export default ThemePage;
