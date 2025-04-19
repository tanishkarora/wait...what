import React from "react";
import "./TimelineEvent.css"; // optional styles

function TimelineEvent({ article }) {
  const {
    title,
    description,
    url,
    urlToImage,
    source,
    publishedAt,
    significanceScore
  } = article;

  const formattedDate = new Date(publishedAt).toLocaleDateString();

  return (
    <div className="timeline-event">
      <div className="event-date">{formattedDate}</div>

      <div className="event-card">
        <h3 className="event-title">
          <a href={url} target="_blank" rel="noreferrer">{title}</a>
        </h3>

        {urlToImage && (
          <img src={urlToImage} alt={title} className="event-image" />
        )}

        {description && <p className="event-snippet">{description}</p>}

        <div className="event-footer">
          <span className="event-source">{source?.name}</span>
          <span className="event-score">Score: {significanceScore}</span>
        </div>
      </div>
    </div>
  );
}

export default TimelineEvent;