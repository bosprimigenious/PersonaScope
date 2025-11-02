import React from 'react';
import './SummaryCard.css';

export default function SummaryCard({ title, children, className = '' }) {
  return (
    <div className={`summary-card ${className}`}>
      {title && <h3>{title}</h3>}
      <div className="summary-content">{children}</div>
    </div>
  );
}

