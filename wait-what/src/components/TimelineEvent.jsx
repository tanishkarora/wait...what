import React from "react";
import "./TimelineEvent.css"; // optional styles

const getSignificanceLabel = (level) => {
  switch (level) {
    case 1:
      return { text: "Key Event", color: "red" };
    case 2:
      return { text: "Major Development", color: "orange" };
    default:
      return null;
  }
};

function TimelineEvent({ article }) {
  const { title, date, snippet, thumbnail } = article;
  const label = getSignificanceLabel(article.significance);
  const formattedDate = new Date(date).toLocaleDateString();

  return (
    <div className="timeline-event">
      <div className="event-date">{formattedDate}</div>

      <div className="event-card">
        <h3 className="event-title">{title}</h3>
        {thumbnail && <img src={thumbnail} alt={title} />}

        <p>{snippet}</p>

        <div className="event-footer">
          <small>Date: {formattedDate}</small>
          {label && (
            <small
              style={{
                position: "absolute", // ← key to top-right
                top: "12px",
                right: "16px",
                padding: "2px 8px",
                backgroundColor: label.color,
                color: "white",
                borderRadius: "12px",
                fontSize: "0.75rem",
              }}
            >
              {label.text}
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimelineEvent;
