import React from "react";
import { Link } from "react-router-dom";
import "./ThemeCard.css"; // Optional: create this file for styling

function ThemeCard({ theme }) {
  return (
    <Link to={`/theme/${theme.id}`} className="theme-card-link">
      <div className="theme-card">
        <h2 className="theme-title">{theme.title}</h2>
        <p className="theme-category"><strong>Category:</strong> {theme.category}</p>
        <p className="theme-description">{theme.description}</p>
      </div>
    </Link>
  );
}

export default ThemeCard;