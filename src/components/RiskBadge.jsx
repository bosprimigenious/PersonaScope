import React from 'react';
import './RiskBadge.css';

export default function RiskBadge({ level, className = '' }) {
  const levelMap = {
    '低': 'low',
    '低风险': 'low',
    '中': 'medium',
    '中风险': 'medium',
    '高': 'high',
    '高风险': 'high',
  };

  const riskClass = levelMap[level] || 'low';

  return (
    <div className={`risk-badge ${riskClass} ${className}`}>
      {level}
    </div>
  );
}

