import React from 'react';
import HealthIcon from './HealthIcon';
import './StatCard.css';

export default function StatCard({ label, value, iconType, color, className = '' }) {
  return (
    <div className={`stat-card ${className}`} style={{ borderLeftColor: color }}>
      <div className="stat-icon">
        <HealthIcon type={iconType} size={32} color={color} />
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

