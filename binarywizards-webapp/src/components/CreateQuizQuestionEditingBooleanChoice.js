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
    <>  <div>
      <input
        type="radio"
        name="toggle"
        id='False'
        checked={selectedOptionInput.correctAnswerBoolean === 0}
        onChange={handleChangeResponseSelected} />
      <a id='False' onClick={handleChangeResponseSelected}>False</a>
    </div>
      <div>
        <input
          type="radio"
          name="toggle"
          id='True'
          checked={selectedOptionInput.correctAnswerBoolean === 1}
          onChange={handleChangeResponseSelected} />
        <a id='True' onClick={handleChangeResponseSelected}>True</a>
      </div>
    </>

  );

}
