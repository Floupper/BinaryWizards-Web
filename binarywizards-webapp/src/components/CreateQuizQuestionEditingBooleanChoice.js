import React, { useEffect, useState } from 'react';


export default function BooleanChoiceQuestion({ selectedOptionInput, setSelectedOptionInput }) {
  // correctAnserBoolean 0 -> False, else if 1-> True




  useEffect(() => {
    if (selectedOptionInput.correctAnswerBoolean === null) {
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        correctAnswerBoolean: 0,
      }));
    }
  }, [selectedOptionInput, setSelectedOptionInput]); // Dependencies ensure this runs when `selectedOptionInput` changes



  const handleChangeResponseSelected = (event) => {
    const id = parseInt(event.target.id, 10);

    if (event.target.id === 'False') {
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        correctAnswerBoolean: 0,
      }))
    }
    else {
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        correctAnswerBoolean: 1,
      }))
    };
  };


  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      {/* Option False */}
      <label className="flex items-center">
        <input
          type="radio"
          name="trueFalse"
          checked={selectedOptionInput.correctAnswerBoolean === 0}
          onChange={() =>
            setSelectedOptionInput({ ...selectedOptionInput, correctAnswerBoolean: 0 })
          }
          className="hidden" // Cache le bouton radio
        />
        <div
          className={`w-full p-3 border rounded-md text-center cursor-pointer ${selectedOptionInput.correctAnswerBoolean === 0
            ? "border-4 border-[#417336] bg-white"
            : "border-gray-300 bg-white"
            }`}
          onClick={() =>
            setSelectedOptionInput({ ...selectedOptionInput, correctAnswerBoolean: 0 })
          }
        >
          False
        </div>
      </label>

      {/* Option True */}
      <label className="flex items-center">
        <input
          type="radio"
          name="trueFalse"
          checked={selectedOptionInput.correctAnswerBoolean === 1}
          onChange={() =>
            setSelectedOptionInput({ ...selectedOptionInput, correctAnswerBoolean: 1 })
          }
          className="hidden" // Cache le bouton radio
        />
        <div
          className={`w-full p-3 border rounded-md text-center cursor-pointer ${selectedOptionInput.correctAnswerBoolean === 1
            ? "border-4 border-[#417336] bg-white"
            : "border-gray-300 bg-white"
            }`}
          onClick={() =>
            setSelectedOptionInput({ ...selectedOptionInput, correctAnswerBoolean: 1 })
          }
        >
          True
        </div>
      </label>
    </div>

  );

}
