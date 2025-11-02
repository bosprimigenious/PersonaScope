import React from 'react';
import './ResultCard.css';

export default function ResultCard({ title, children, score, maxScore, severity, severityColor, actions, className = '' }) {
  return (
    <div className={`result-card ${className}`} style={{ borderLeftColor: severityColor }}>
      {title && <h3 className="result-title">{title}</h3>}
      {score !== undefined && (
        <div className="score-display">
          <div className="score-value">{score}</div>
          {maxScore && <div className="score-max">/{maxScore}</div>}
        </div>
      )}
      {severity && (
        <div className="severity-indicator" style={{ backgroundColor: severityColor + '20', color: severityColor }}>
          {severity}
        </div>
      )}
      <div className="result-content">{children}</div>
      {actions && <div className="result-actions">{actions}</div>}
    </div>
  );
}

