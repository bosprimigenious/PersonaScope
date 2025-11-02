import React from 'react';
import { Link } from 'react-router-dom';
import HealthIcon from './HealthIcon';
import './ActionCard.css';

export default function ActionCard({ title, desc, link, iconType, onClick, className = '' }) {
  const content = (
    <>
      <div className="action-icon">
        <HealthIcon type={iconType} size={48} />
      </div>
      <div className="action-title">{title}</div>
      {desc && <div className="action-desc">{desc}</div>}
    </>
  );

  if (link) {
    return (
      <Link to={link} className={`action-card ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`action-card ${className}`} onClick={onClick}>
      {content}
    </div>
  );
}

