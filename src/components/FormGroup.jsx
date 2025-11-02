import React from 'react';
import './FormGroup.css';

export default function FormGroup({ label, required, error, children, className = '' }) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <div className="form-control">{children}</div>
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}

