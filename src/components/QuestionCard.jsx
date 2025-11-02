import React from 'react';
import './QuestionCard.css';

export default function QuestionCard({ question, index, options, selectedValue, onSelect, required = false }) {
  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-number">{index + 1}</span>
        <h3 className="question-text">{question}</h3>
        {required && <span className="required-mark">*</span>}
      </div>
      <div className="question-options">
        {options.map((option, optIndex) => (
          <label key={optIndex} className="option-label">
            <input
              type="radio"
              name={`question-${index}`}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onSelect(index, e.target.value)}
            />
            <span className="option-text">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

