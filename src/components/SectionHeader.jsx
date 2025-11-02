import React from 'react';
import './SectionHeader.css';

export default function SectionHeader({ title, subtitle, description, children, actions, className = '' }) {
  return (
    <div className={`section-header ${className}`}>
      <div className="section-header-content">
        {title && <h2>{title}</h2>}
        {subtitle && <h3>{subtitle}</h3>}
        {description && <p>{description}</p>}
        {children}
      </div>
      {actions && <div className="section-header-actions">{actions}</div>}
    </div>
  );
}

