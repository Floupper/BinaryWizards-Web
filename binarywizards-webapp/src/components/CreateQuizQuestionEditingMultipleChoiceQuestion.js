import React from "react";

export function MultipleChoiceQuestion({ selectedOptionInput, setSelectedOptionInput }) {
  // Initialisation si aucune réponse n'existe
  console.log(selectedOptionInput);
  if (!selectedOptionInput.choices || selectedOptionInput.choices.length === 0) {
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: ["", ""], // Commencer avec deux réponses vides
      correctAnswerMultiple: 0, // Sélectionner automatiquement la première option
    }));
  }

  // Gérer le changement de texte des réponses
  const handleChangeAnswerText = (event, index) => {
    const value = event.target.value || ""; // Toujours une valeur définie

    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: prevState.choices.map((choice, i) =>
        i === index ? value : choice
      ),
    }));
  };

  // Ajouter une nouvelle réponse (max 8)
  const handleAddOption = () => {
    if (selectedOptionInput.choices.length < 8) {
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        choices: [...prevState.choices, ""], // Nouvelle option par défaut vide
      }));
    }
  };

  // Supprimer une réponse (min 2)
  const handleRemoveOption = (index) => {
    if (selectedOptionInput.choices.length > 2) {
      setSelectedOptionInput((prevState) => {
        const updatedChoices = prevState.choices.filter((_, i) => i !== index);

        // Ajuster la bonne réponse si nécessaire
        let updatedCorrectAnswer = prevState.correctAnswerMultiple;

        if (prevState.correctAnswerMultiple === index) {
          // Si l'option sélectionnée est supprimée, choisir une autre option
          updatedCorrectAnswer = Math.max(0, index - 1);
        } else if (prevState.correctAnswerMultiple > index) {
          // Ajuster l'index si une réponse précédente est supprimée
          updatedCorrectAnswer -= 1;
        }

        return {
          ...prevState,
          choices: updatedChoices,
          correctAnswerMultiple: updatedCorrectAnswer,
        };
      });
    }
  };

  return (
    <div>
      <div className="grid justify-items-center grid-cols-2 gap-4 ">
        {selectedOptionInput.choices.map((choice, id) => (
          <div key={id} className="flex items-center">
            {/* Radio button pour sélectionner la bonne réponse */}
            <input
              type="radio"
              name="multipleChoice"
              className="text-green-600 focus:ring-green-500"
              checked={selectedOptionInput.correctAnswerMultiple === id}
              onChange={() =>
                setSelectedOptionInput({ ...selectedOptionInput, correctAnswerMultiple: id })
              }
            />

            {/* Input pour le texte de la réponse */}
            <input
              type="text"
              value={choice || ""} // Toujours une valeur définie
              onChange={(e) => handleChangeAnswerText(e, id)}
              placeholder={`Option ${id + 1}`}
              className={`p-3 ml-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${selectedOptionInput.correctAnswerMultiple === id
                ? "border-4 border-[#417336] bg-white"
                : "border-2 border-gray-300"
                }`}
            />

            {/* Bouton pour supprimer une réponse */}
            <button
              onClick={() => handleRemoveOption(id)}
              className="ml-2 px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
              disabled={selectedOptionInput.choices.length <= 2} // Désactiver si 2 réponses
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Bouton pour ajouter une nouvelle option */}
      <div className="mt-4">
        <button
          onClick={handleAddOption}
          className={`px-4 py-2 text-white rounded ${selectedOptionInput.choices.length >= 8
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={selectedOptionInput.choices.length >= 8} // Désactiver si 8 réponses
        >
          Add Option
        </button>
      </div>
    </div>
  );
}
