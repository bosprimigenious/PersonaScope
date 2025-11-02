import React from 'react';
import { Link } from 'react-router-dom';
import HealthIcon from './HealthIcon';
import './Badge.css';

export default function Badge({ iconType, text, link, onClick, variant = 'default', size = 'medium', className = '' }) {
  const content = (
    <>
      {iconType && <HealthIcon type={iconType} className="badge-icon" size={size === 'small' ? 20 : 24} />}
      {text && <span className="badge-text">{text}</span>}
    </>
  );

  const classes = `badge badge-${variant} badge-${size} ${className}`;

  if (link) {
    return (
      <Link to={link} className={classes}>
        {content}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button className={classes} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}

