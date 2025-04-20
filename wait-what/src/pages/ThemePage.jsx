import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import themes from "../data/themes.json";
import "./ThemePage.css";
import TimelineEvent from "../components/TimelineEvent";
function ThemePage() {
  const { id } = useParams();
  const theme = themes.find((t) => t.id === id);

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLevel, setDetailLevel] = useState(2); // 1 = concise, 2 = balanced, 3 = detailed
  const [sortOrder, setSortOrder] = useState("desc"); // or "asc"

  const filteredArticles = articles
    .filter((article) => article.significance <= detailLevel)
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const fetchTimelineFromGroq = useCallback(async () => {
    setLoading(true);

    const prompt = `
  You are a timeline builder for a news explainer app.
  
  Create a JSON array of 20 to 25 key events about the topic: "${theme.title}".
  
  Each event should include:
  - "title": a short yet descriptive news-style headline of a specific major event 
  - "date": in ISO format (YYYY-MM-DD)
  - "snippet": a 5–6 sentence summary
  - "significance": an integer from 1 to 3, where:
    - 1 = most significant turning point or milestone
    - 2 = Very significant but slightly less significant than the most significant
    - 3 = Very significant but slightly less significant than the top 2 levels of significance
  - "thumbnail": a relevant image URL [(or "null" if none)]
  
  The number of events should depend on the topic’s complexity and timespan.
  
  Select events based on their significance in the complete lifecycle of the story of this news event.
  
  Use data wherever reliable data is available

  Respond ONLY with the JSON array, without additional explanation.
  `;

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: prompt },
            ],
            temperature: 0.3,
          }),
        }
      );

      const data = await res.json();
      const jsonText = data?.choices?.[0]?.message?.content;
      let timelineData = [];

      try {
        // Remove backticks and unescape double-escaped quotes
        const cleaned = jsonText
          .trim()
          .replace(/^`+/, "") // Remove starting backticks
          .replace(/`+$/, "") // Remove ending backticks
          .replace(/\\n/g, "")
          .replace(/\\"/g, '"')
          .replace(/<|>/g, ""); // Optional: remove angle brackets around URLs

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
      <p>{theme.description}</p>

      <hr style={{ margin: "24px 0" }} />
      <div style={{ margin: "24px 0" }}>
        <label>
          <strong>View:</strong>
        </label>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "12px",
    margin: "24px 0"
  }}
>
          <div style={{ margin: "24px 0" }}>
            <label htmlFor="detail-slider">
              <strong>Detail Level:</strong>
            </label>
            <input
              id="detail-slider"
              type="range"
              min="1"
              max="3"
              step="1"
              value={detailLevel}
              onChange={(e) => setDetailLevel(Number(e.target.value))}
              style={{ width: "100%", marginTop: "8px" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                color: "#666",
              }}
            >
              <span>Concise</span>
              <span>Balanced</span>
              <span>Detailed</span>
            </div>
          </div>

          <div style={{ margin: "10px 0" }}>
            <label style={{ marginRight: "10px", fontWeight: 500 }}>
              Sort by:
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>
      {loading ? (
        <p>Loading articles...</p>
      ) : (
        <div>
          <h2>Timeline</h2>
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
