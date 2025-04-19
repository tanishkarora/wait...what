import React from "react";
import "./TimelineEvent.css"; // optional styles

function TimelineEvent({ article }) {
    const {
        title,
        date,
        snippet,
        thumbnail,
        significance
      } = article;

      const formattedDate = new Date(date).toLocaleDateString();
      
  return (
    <div className="timeline-event">
      <div className="event-date">{formattedDate}</div>

      <div className="event-card">
        <h3 className="event-title">
        {title}
        </h3>
        {thumbnail && <img src={thumbnail} alt={title} />}

        <p>{snippet}</p>

        <div className="event-footer">
        <small>Date: {formattedDate}</small>
        <small>Significance: {significance}</small>
        </div>
      </div>
    </div>
  );
}

export default TimelineEvent;