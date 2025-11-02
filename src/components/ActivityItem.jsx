import React from 'react';
import './ActivityItem.css';

export default function ActivityItem({ time, text, icon, onClick, className = '' }) {
  return (
    <div className={`activity-item ${className}`} onClick={onClick}>
      {icon && <div className="activity-icon">{icon}</div>}
      <span className="activity-time">{time}</span>
      <span className="activity-text">{text}</span>
    </div>
  );
}

