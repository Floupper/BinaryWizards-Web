import React from 'react';
import '../assets/QuestionRangeSelector.css';

export default function QuestionRangeSelector({ minQuestions, maxQuestions, onMinChange, onMaxChange }) {
  return (
    <div className="question-range-container">
      <h3 className="question-range-title">Select the number of questions</h3>
      <div className="range-inputs">
        <div className="input-group">
          <label htmlFor="minQuestions" className="input-label">Min</label>
          <input
            id="minQuestions"
            type="number"
            className="input-range"
            value={minQuestions}
            min={1}
            max={50}
            onChange={(e) => onMinChange(Number(e.target.value))}
            placeholder="Min"
          />
        </div>
        <div className="input-group">
          <label htmlFor="maxQuestions" className="input-label">Max</label>
          <input
            id="maxQuestions"
            type="number"
            className="input-range"
            value={maxQuestions}
            min={minQuestions || 0}
            max={50}
            onChange={(e) => onMaxChange(Number(e.target.value))}
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  );
};