import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import CreateQuizService from '../services/CreateQuizService';
import CustomAudioPlayer from './CustomAudioPlayer';
export function MultipleChoiceQuestion({ selectedOptionInput, setSelectedOptionInput, questionText }) {
  const [file, setFile] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  if (!selectedOptionInput.choices || selectedOptionInput.choices.length === 0) {
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: ["", ""],
      type: "text",
      correctAnswer: 0,
    }));
  }

  const handleChangeAnswerText = (event, index) => {
    const value = event.target.value || "";
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: prevState.choices.map((choice, i) =>
        i === index ? value : choice // Remplace uniquement à l'index spécifié
      ),
    }));
  };


  const handleAddOption = () => {
    if (selectedOptionInput.choices.length < 8) {
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        choices: [...prevState.choices, ""],
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

  const handleDeleteImageAudio = (id) => {

    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: prevState.choices.map((item, index) =>
        index === id ? "" : item
      ),
    }));
  }

  const handleAiChoices = async (option) => {
    console.log(selectedOptionInput);
    const requestBody = {
      question_text: questionText,
      options_type: option,
      nb_options: 4//selectedOptionInput.choices.length,

    };
    let data;
    try {
      setAiGenerating(true);
      data = await CreateQuizService.AICreateChoices(requestBody);
      setAiGenerating(false);
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        choices: [
          data.generatedAnswers.correct_answer, // Ajouter la réponse correcte
          ...data.generatedAnswers.incorrect_answers // Ajouter les réponses incorrectes
        ],
        type: "text", // Type de la question (par exemple, texte)
        correctAnswer: 0, // L'index de la réponse correcte (ici 0, car c'est la première réponse)
      }));


      console.log(data);
    }
    catch (error) {
      setAiGenerating(false);
      console.log(error);
    }

  }

  const handleUpload = async (id, file, type) => {
    if (!file) {
      alert(`Veuillez sélectionner un fichier ${type === "audio" ? "audio" : "image"} avant de continuer.`);
      return;
    }

    const formData = new FormData();
    formData.append(type, file);

    try {
      let data;
      if (type === "audio") {
        data = await CreateQuizService.updateAudio(formData); // Utilisation de updateAudio pour les fichiers audio
      } else {
        data = await CreateQuizService.updateImage(formData); // Utilisation de updateImage pour les fichiers image
      }

      setSelectedOptionInput((prevState) => {
        const updatedChoices = [...prevState.choices];
        updatedChoices[id] = data.url;

        return {
          ...prevState,
          choices: updatedChoices,
        };
      });

      toast.success(`${type === "audio" ? "Audio" : "Image"} uploadé avec succès !`);
    } catch (error) {
      toast.error(`Erreur lors de l'upload du fichier ${type}.`);
      console.error(error);
    }
  };



  return (
    <div>
      <div className="grid justify-items-center grid-cols-2 gap-4">
        {selectedOptionInput.choices.map((choice, id) => (
          <div key={id} className="flex items-center gap-4">
            <input
              type="radio"
              name="multipleChoice"
              className="text-green-600 focus:ring-green-500"
              checked={selectedOptionInput.correctAnswer === id}
              onChange={() =>
                setSelectedOptionInput({ ...selectedOptionInput, correctAnswer: id })
              }
            />

            {selectedOptionInput.type === "text" ? (
              <input
                type="text"
                value={choice || ""}
                onChange={(e) => handleChangeAnswerText(e, id)}
                placeholder={`Option ${id + 1}`}
                className={`p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${selectedOptionInput.correctAnswerMultiple === id
                  ? "border-4 border-[#417336] bg-white"
                  : "border-2 border-gray-300"
                  }`}
              />
            ) : selectedOptionInput.type === "image" ? (
              <div className="flex items-center gap-4">
                {!choice ? (
                  <>
                    <input
                      type="file"
                      id={`fileInput-${id}`}
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        handleUpload(id, file, "image");
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={`fileInput-${id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                    >
                      Importer une image
                    </label>
                  </>
                ) : (
                  <img
                    src={choice}
                    alt="Aperçu de l'image"
                    className="w-20 h-20 object-cover rounded border"
                    onClick={() => { handleDeleteImageAudio(id) }}
                  />

                )}
              </div>
            ) : selectedOptionInput.type === "audio" ? (
              <div className="flex items-center gap-4">
                {!choice ? (
                  <>
                    <input
                      type="file"
                      id={`audioInput-${id}`}
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        handleUpload(id, file, "audio");
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor={`audioInput-${id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
                    >
                      Importer un fichier audio
                    </label>
                  </>
                ) : (
                  <CustomAudioPlayer src={choice} deleteAudio={() => handleDeleteImageAudio(id)} />



                )}
              </div>
            ) : (
              <div>
                <p>ERREUR {choice}</p>
              </div>
            )}

            <button
              onClick={() => handleRemoveOption(id)}
              className="font-bold ml-2 px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
              disabled={selectedOptionInput.choices.length <= 2}
            >
              ⨯
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-1">
        <button
          onClick={handleAddOption}
          className={`px-4 py-2 text-white rounded ${selectedOptionInput.choices.length >= 8
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
            }`}
          disabled={selectedOptionInput.choices.length >= 8}
        >
          Add choice
        </button>
        {selectedOptionInput.type == "text" && (
          <>
            <div className="flex items-center justify-center text-3xl h-12 w-12 bg-white rounded-xl border-black border-2">
              <button
                className="m-0 p-0 text-3xl h-10 w-10"
                onClick={() => { setAiModalOpen(!aiModalOpen) }}
              >
                🪄
              </button>
            </div>



            {aiModalOpen && (
              <div className="flex gap-2  bg-white rounded-xl border-black border-2" >
                <button disabled={aiGenerating} onClick={() => { console.log("here"); handleAiChoices('realistic'); }} className={`ml-1 my-1 p-1 shadow-sm shadow-black rounded-lg ${aiGenerating
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-black hover:shadow-lg'
                  }`}>Realistic</button>
                <button disabled={aiGenerating} onClick={() => { console.log("here"); handleAiChoices('humouristic'); }} className={` my-1 p-1 shadow-sm shadow-black rounded-lg ${aiGenerating
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-black hover:shadow-lg'
                  }`}>Humouristic</button>
                <button disabled={aiGenerating} onClick={() => { console.log("here"); handleAiChoices('mixt'); }} className={`mr-1 my-1 p-1 shadow-sm shadow-black rounded-lg ${aiGenerating
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-black hover:shadow-lg'
                  }`}>Mixt</button>
              </div>
            )}
            {aiGenerating && (
              <a>Generating...</a>
            )}
          </>

        )}
      </div>
    </div>
  );
}
