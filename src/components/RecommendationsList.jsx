import React from 'react';
import './RecommendationsList.css';

export default function RecommendationsList({ items, title, className = '' }) {
  if (!items || items.length === 0) return null;

  return (
    <div className={`recommendations-list ${className}`}>
      {title && <h3>{title}</h3>}
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

