import React, { useState } from "react";
import ThemeCard from "../components/ThemeCard";
import themes from "../data/themes.json";
import "./HomePage.css";

const categories = [
  "All",
  "Politics",
  "Economics",
  "Tech and Science",
  "Culture",
  "Business & Industries",
];

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredThemes =
    selectedCategory === "All"
      ? themes
      : themes.filter((theme) => theme.category === selectedCategory);

  return (
    <div className="homepage-container">
        <h1 style={{ fontStyle: "italic" }}>
            Wait... <span style={{ color: "grey" }}>What?</span>
        </h1>
      <p>Select a theme to see how the story has evolved.</p>

      {/* Category Filters */}
      <div className="category-buttons">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`category-button ${
              selectedCategory === cat ? "active" : ""
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Theme Cards */}
      <div className="theme-card-grid">
        {filteredThemes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
