import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import CreateQuizService from '../services/CreateQuizService';
export function MultipleChoiceQuestion({ selectedOptionInput, setSelectedOptionInput }) {
  const [image, setImage] = useState(null);

  if (!selectedOptionInput.choices || selectedOptionInput.choices.length === 0) {
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: [{ type: "text", content: "" }, { type: "text", content: "" }],
      type_of_question: "text",
      correctAnswerMultiple: 0,
    }));
  }

  const handleChangeAnswerText = (event, index) => {

    const value = event.target.value || { type: "text", content: "" };

    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: prevState.choices.map((choice, i) =>
        i === index ? { ...choice, content: value } : choice
      ),

    }
    ));
  };


  const handleAddOption = () => {
    if (selectedOptionInput.choices.length < 8) {
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        choices: [...prevState.choices, { type: selectedOptionInput.type_of_question, content: "" }],
      }));
    }
  };


  const handleRemoveOption = (index) => {
    if (selectedOptionInput.choices.length > 2) {
      setSelectedOptionInput((prevState) => {
        const updatedChoices = prevState.choices.filter((_, i) => i !== index);


        let updatedCorrectAnswer = prevState.correctAnswerMultiple;

        if (prevState.correctAnswerMultiple === index) {

          updatedCorrectAnswer = Math.max(0, index - 1);
        } else if (prevState.correctAnswerMultiple > index) {

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


  // Gestion de la sélection de fichier
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Récupérer le premier fichier sélectionné
    setImage(file); // Stocker l'image dans l'état
  };

  // Fonction pour envoyer l'image
  const handleUpload = async (id, file) => {
    if (!file) {
      alert('Veuillez sélectionner une image avant de continuer.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file); // Ajouter l'image au FormData

    try {
      const data = await CreateQuizService.updateImage(formData); // Envoyer la requête et attendre la réponse

      setSelectedOptionInput((prevState) => {
        const updatedChoices = [...prevState.choices]; // Créer une copie des choix
        updatedChoices[id].content = data.url; // Mettre à jour le `content` du choix ciblé

        return {
          ...prevState,
          choices: updatedChoices, // Remplacer par les choix mis à jour
        };
      });

      toast.success('Image uploadée avec succès !');
    } catch (error) {
      toast.error('Erreur lors de l\'upload de l\'image.');
      console.error(error);
    }
  };

  return (
    <div>
      <div className="grid justify-items-center grid-cols-2 gap-4 ">
        {selectedOptionInput.choices.map((choice, id) => (
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


            {choice.type === "text" ? (
              <input
                type="text"
                value={choice.content || ""}
                onChange={(e) => handleChangeAnswerText(e, id)}
                placeholder={`Option ${id + 1}`}
                className={`p-3 ml-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${selectedOptionInput.correctAnswerMultiple === id
                  ? "border-4 border-[#417336] bg-white"
                  : "border-2 border-gray-300"
                  }`}
              />
            ) : choice.type === "image" ? (
              <div>
                <input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0]; // Récupérer directement le fichier
                    if (!file) return; // Si aucun fichier n'est sélectionné, ne rien faire

                    // Appeler directement handleUpload avec le fichier
                    handleUpload(id, file);
                  }}
                  style={{ display: "block", cursor: "pointer" }}
                />

                <img src={choice.content} alt="Aperçu de l'image" />
              </div>
            ) : choice.type === "audio" ? (
              <div>
                {/* Votre script pour le type "audio" */}
                <audio controls>
                  <source src={choice.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <div>
                <p>ERREUR {choice.type}</p>
              </div>
            )}





            <button
              onClick={() => handleRemoveOption(id)}
              className="ml-2 px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
              disabled={selectedOptionInput.choices.length <= 2}
            >
              X
            </button>
          </div>
        ))}
      </div>


      <div className="mt-4">
        <button
          onClick={handleAddOption}
          className={`px-4 py-2 text-white rounded ${selectedOptionInput.choices.length >= 8
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={selectedOptionInput.choices.length >= 8}
        >
          Add Option
        </button>
      </div>
    </div>
  );
}
