import React from 'react';

export default function QuestionRangeSelector({ minQuestions, maxQuestions, onMinChange, onMaxChange }) {
  return (
    <div className="bg-white text-black p-5 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Select the number of questions</h3>
      <div className="flex space-x-4">
        <div className="flex flex-col">
          <label htmlFor="minQuestions" className="mb-2">Min</label>
          <input
            id="minQuestions"
            type="number"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={minQuestions}
            min={1}
            max={50}
            onChange={(e) => onMinChange(Number(e.target.value))}
            placeholder="Min"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="maxQuestions" className="mb-2">Max</label>
          <input
            id="maxQuestions"
            type="number"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
