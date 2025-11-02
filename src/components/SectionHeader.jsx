import React from 'react';
import './SectionHeader.css';

export default function SectionHeader({ title, subtitle, description, children, className = '' }) {
  return (
    <div className={`section-header ${className}`}>
      {title && <h2>{title}</h2>}
      {subtitle && <h3>{subtitle}</h3>}
      {description && <p>{description}</p>}
      {children}
    </div>
  );
}

