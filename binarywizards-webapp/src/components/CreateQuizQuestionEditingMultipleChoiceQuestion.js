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
      <div className="grid justify-items-center grid-cols-2 gap-4 ">
        {[0, 1, 2, 3].map((id) => (
          <div key={id} className="flex items-center">
            <input
              type="radio"
              name="multipleChoice"
              className="text-green-600 focus:ring-green-500"
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
              className={` p-3 ml-4 border border-gray-300 rounded-md  focus:ring-blue-500 focus:border-blue-500 
                ${selectedOptionInput.correctAnswerMultiple === id ? 'border-4 border-[#417336] bg-white' : 'border-4 border-[#417336] bg-white'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );

}