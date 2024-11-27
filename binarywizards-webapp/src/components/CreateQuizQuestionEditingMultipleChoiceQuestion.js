import React, { useState } from "react";




export function MultipleChoiceQuestion({ selectedOptionInput, setSelectedOptionInput }) {
  const [selectedOption, setSelectedOption] = useState(null);

  if(selectedOptionInput.correctAnswerMultiple === null){
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      correctAnswerMultiple : 0, 
    }));
  
  };

  // Gère la sélection de la réponse (radio button)
  const handleChangeResponseSelected = (event) => {
    const id = parseInt(event.target.id, 10); // Récupère l'ID numérique
    setSelectedOption(id);

    // Mise à jour de l'état du parent seulement quand la sélection change
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      correctAnswerMultiple: id, // On met à jour la bonne réponse
    }));
  };

  // Gère la modification du texte des réponses
  const handleChangeAnswerText = (event, id) => {
    const value = event.target.value;

    // Mise à jour de la réponse dans les options
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: prevState.choices.map((choice, index) =>
        index === id ? value : choice
      ),
    }));
  };
  console.log(selectedOptionInput);
  return (
    <div>
      {[0, 1, 2, 3].map((id) => (
        <div key={id} style={{ marginBottom: '10px' }}>
          <input
            type="radio"
            name="toggle"
            id={id.toString()} // ID unique pour chaque radio
            checked={selectedOptionInput.correctAnswerMultiple === id}
            onChange={handleChangeResponseSelected} // Déclenche la mise à jour de la bonne réponse
          />
          <textarea
            id={`question_text_${id}`}
            name={`question_text_${id}`}
            value={selectedOptionInput?.choices ? selectedOptionInput.choices[id] : ''}
            rows="2"
            cols="50"
            placeholder={`Enter answer ${id + 1}`}
            className="large-input"
            onChange={(event) => handleChangeAnswerText(event, id)} // Mise à jour du texte de la réponse
          />
        </div>
      ))}
    </div>
  );
}