import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import themes from "../data/themes.json";
import TimelineEvent from "../components/TimelineEvent";
function ThemePage() {
  const { id } = useParams();
  const theme = themes.find((t) => t.id === id);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLevel, setDetailLevel] = useState(2); // 1 = concise, 2 = balanced, 3 = detailed
  
  const filteredArticles = articles.filter(
    (article) => article.significance <= detailLevel
  );  

  const fetchTimelineFromGroq = useCallback(async () => {
    setLoading(true);
  
    const prompt = `
  You are a timeline builder for a news explainer app.
  
  Create a JSON array of 20 to 25 key events about the topic: "${theme.title}".
  
  Each event should include:
  - "title": a short, news-style headline
  - "date": in ISO format (YYYY-MM-DD)
  - "snippet": a 2–3 sentence summary
  - "significance": an integer from 1 to 3, where:
    - 1 = most significant turning point or milestone
    - 2 = Very significant but sloghtly less significant than the most significant
    - 3 = Very significant but slightly less significant than the top 2 levels of significance
  - "thumbnail": a relevant image URL (or "null" if none)
  
  The number of events should depend on the topic’s complexity and timespan.
  
  Select events based on their significance in the complete lifecycle of the story of this news event.
  
  Respond ONLY with the JSON array, without additional explanation.
  `;
  
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3
        })
      });
  
      const data = await res.json();
      const jsonText = data?.choices?.[0]?.message?.content
      let timelineData = [];

      try {
        // Remove backticks and unescape double-escaped quotes
        const cleaned = jsonText
          .trim()
          .replace(/^`+/, "")    // Remove starting backticks
          .replace(/`+$/, "")    // Remove ending backticks
          .replace(/\\n/g, "")
          .replace(/\\"/g, '"')
          .replace(/<|>/g, "");  // Optional: remove angle brackets around URLs
      
        timelineData = JSON.parse(cleaned);
      } catch (err) {
        console.error("Failed to parse LLM timeline JSON:", err, jsonText);
      }

      setArticles(timelineData);
    } catch (err) {
      console.error("Error generating timeline:", err);
    } finally {
      setLoading(false);
    }
  }, [theme]);

  

  useEffect(() => {
    if (theme) {
      fetchTimelineFromGroq();
    }
  }, [theme, fetchTimelineFromGroq]);

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
