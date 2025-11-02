import React from 'react';
import HealthIcon from './HealthIcon';
import ToggleSwitch from './ToggleSwitch';
import './ListItem.css';

export default function ListItem({ 
  icon, 
  iconType, 
  title, 
  subtitle, 
  details, 
  status, 
  actions, 
  onToggle,
  checked,
  className = '' 
}) {
  return (
    <div className={`list-item ${className}`}>
      {iconType && (
        <div className="list-item-icon">
          <HealthIcon type={iconType} size={32} />
        </div>
      )}
      {icon && <div className="list-item-icon">{icon}</div>}
      <div className="list-item-content">
        {title && <div className="list-item-title">{title}</div>}
        {subtitle && <div className="list-item-subtitle">{subtitle}</div>}
        {details && <div className="list-item-details">{details}</div>}
      </div>
      {status && <div className={`list-item-status ${status}`}>{status}</div>}
      {onToggle !== undefined && (
        <ToggleSwitch checked={checked} onChange={(e) => onToggle(e.target.checked)} />
      )}
      {actions && <div className="list-item-actions">{actions}</div>}
    </div>
  );
}

