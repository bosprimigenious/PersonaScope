import React from 'react';
import './FormPanel.css';

export default function FormPanel({ title, children, actions, onCancel, className = '' }) {
  return (
    <div className={`form-panel ${className}`}>
      {title && <h3 className="form-panel-title">{title}</h3>}
      <div className="form-panel-content">{children}</div>
      {actions && <div className="form-panel-actions">{actions}</div>}
    </div>
  );
}

