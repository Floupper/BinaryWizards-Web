import React, { useState } from "react";




export function MultipleChoiceQuestion({ selectedOptionInput, setSelectedOptionInput }) {
  const [selectedOption, setSelectedOption] = useState(null);

  if (selectedOptionInput.correctAnswerMultiple === null) {
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      correctAnswerMultiple: 0,
    }));

  };

  const handleChangeResponseSelected = (event) => {
    const id = parseInt(event.target.id, 10);
    setSelectedOption(id);


    setSelectedOptionInput((prevState) => ({
      ...prevState,
      correctAnswerMultiple: id,
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
      {[0, 1, 2, 3].map((id) => (
        <div key={id} style={{ marginBottom: '10px' }}>
          <input
            type="radio"
            name="toggle"
            id={id.toString()}
            checked={selectedOptionInput.correctAnswerMultiple === id}
            onChange={handleChangeResponseSelected}
          />
          <textarea
            id={`question_text_${id}`}
            name={`question_text_${id}`}
            value={selectedOptionInput?.choices ? selectedOptionInput.choices[id] : ''}
            rows="2"
            cols="50"
            placeholder={`Enter answer ${id + 1}`}
            className="large-input"
            onChange={(event) => handleChangeAnswerText(event, id)}
          />
        </div>
      ))}
    </div>
  );
}