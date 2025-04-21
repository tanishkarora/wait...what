import React from "react";
import { Link } from "react-router-dom";
import "./ThemeCard.css";

const categoryColors = {
  Politics: "#dc2626",       // red
  Economics: "#2563eb",      // blue
  "Tech and Science": "#16a34a", // green
  Culture: "#9333ea",        // purple
  "Business & Industries": "#eab308", // amber
};

function ThemeCard({ theme }) {
  const color = categoryColors[theme.category] || "#6b7280"; // fallback: gray

  return (
    <Link to={`/theme/${theme.id}`} className="theme-card-link" style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "rgba(15, 23, 42, 0.75)",
          border: `1px solid ${color}55`,
          boxShadow: `0 4px 20px ${color}55`,
          borderRadius: "16px",
          padding: "20px",
          color: "#fff",
          backdropFilter: "blur(10px)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          fontFamily: "Inter, sans-serif",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.03)";
          e.currentTarget.style.boxShadow = `0 6px 25px ${color}88`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = `0 4px 20px ${color}55`;
        }}
      >
        <div style={{ fontSize: "0.75rem", color, marginBottom: "6px" }}>{theme.category}</div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "6px" }}>{theme.title}</h2>
        <p style={{ fontSize: "0.9rem", color: "#d1d5db", lineHeight: 1.5 }}>{theme.description}</p>
      </div>
    </Link>
  );
}

export default ThemeCard;
