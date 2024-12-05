import React, { useState } from "react";

export function MultipleChoiceQuestion({ selectedOptionInput, setSelectedOptionInput }) {
  const [selectedOption, setSelectedOption] = useState(null);

  if (selectedOptionInput.correctAnswerMultiple === null) {
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      correctAnswerMultiple: 0,
    }));

  };



  const handleChangeAnswerText = (event, id) => {
    const value = event.target.value;

    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: prevState.choices.map((choice, index) =>
        index === id ? value : choice
      ),
    }));
  };
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map((id) => (
          <div key={id} className="flex items-center">
            <input
              type="radio"
              name="multipleChoice"
              className="text-blue-600 focus:ring-blue-500"
              checked={selectedOptionInput.correctAnswerMultiple === id}
              onChange={() =>
                setSelectedOptionInput({ ...selectedOptionInput, correctAnswerMultiple: id })
              }
            />
            <input
              type="text"
              value={selectedOptionInput.choices[id]}
              onChange={(e) => handleChangeAnswerText(e, id)}
              placeholder={`Option ${id + 1}`}
              className={`w-full p-3 ml-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 
                ${selectedOptionInput.correctAnswerMultiple === id ? 'border-green-500 bg-green-100' : ''}`}
            />
          </div>
        ))}
      </div>
    </div>
  );

}