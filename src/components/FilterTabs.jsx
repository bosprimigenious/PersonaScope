import React from 'react';
import './FilterTabs.css';

export default function FilterTabs({ filters, activeFilter, onFilterChange, className = '' }) {
  return (
    <div className={`filter-tabs ${className}`}>
      {filters.map((filter) => (
        <button
          key={filter.value}
          className={`filter-tab ${activeFilter === filter.value ? 'active' : ''}`}
          onClick={() => onFilterChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

