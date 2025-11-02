import React from 'react';
import HealthIcon from './HealthIcon';
import './FeatureCard.css';

export default function FeatureCard({ iconType, title, description, className = '' }) {
  return (
    <div className={`feature-card ${className}`}>
      <div className="feature-icon">
        <HealthIcon type={iconType} size={40} />
      </div>
      <h4>{title}</h4>
      {description && <p>{description}</p>}
    </div>
  );
}

