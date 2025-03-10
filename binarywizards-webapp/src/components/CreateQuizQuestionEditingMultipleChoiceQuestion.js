import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import CreateQuizService from '../services/CreateQuizService';
import CustomAudioPlayer from './CustomAudioPlayer';
import Spinner from './Spinner';


export function MultipleChoiceQuestion({ setQuestionInfo, questionInfo }) {

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);


  if (!questionInfo.questionOptions || questionInfo.questionOptions.length === 0) {
    setQuestionInfo((prevState) => ({
      ...prevState,
      questionType: "text",
      questionCorrectAnswer: 0,
      questionOptions: ["", ""],
    }));
  }



  const handleChangeAnswerText = (event, index) => {
    const value = event.target.value || "";
    setQuestionInfo((prevState) => ({
      ...prevState,
      questionOptions: prevState.questionOptions.map((questionOptions, i) =>
        i === index ? value : questionOptions // Remplace uniquement à l'index spécifié
      ),
    }));
  };


  const handleAddOption = () => {
    if (questionInfo.questionOptions.length < 8) {
      setQuestionInfo((prevState) => ({
        ...prevState,
        questionOptions: [...prevState.questionOptions, ""],
      }));
    }
  };

  const handleRemoveOption = (index) => {
    if (questionInfo.questionOptions.length > 2) {
      setQuestionInfo((prevState) => {
        const updatedChoices = prevState.questionOptions.filter((_, i) => i !== index);
        let updatedCorrectAnswer = prevState.correctAnswerMultiple;

        if (prevState.correctAnswerMultiple === index) {
          updatedCorrectAnswer = Math.max(0, index - 1);
        } else if (prevState.correctAnswerMultiple > index) {
          updatedCorrectAnswer -= 1;
        }

        return {
          ...prevState,
          questionOptions: updatedChoices,
          correctAnswerMultiple: updatedCorrectAnswer,
        };
      });
    }
  };

  const handleDeleteImageAudio = (id) => {

    setQuestionInfo((prevState) => ({
      ...prevState,
      questionOptions: prevState.questionOptions.map((item, index) =>
        index === id ? "" : item
      ),
    }));
  }

  const handleAiChoices = async (option) => {

    const requestBody = {
      question_text: questionInfo.questionText,
      options_type: option,
      nb_options: questionInfo.questionOptions.length,

    };
    let data;
    try {
      setAiGenerating(true);
      data = await CreateQuizService.AICreateChoices(requestBody);
      setAiGenerating(false);
      setQuestionInfo((prevState) => ({
        ...prevState,
        questionOptions: [
          data.generatedAnswers.correct_answer, // Ajouter la réponse correcte
          ...data.generatedAnswers.incorrect_answers // Ajouter les réponses incorrectes
        ],
        questionType: "text", // Type de la question (par exemple, texte)
        questionCorrectAnswer: 0, // L'index de la réponse correcte (ici 0, car c'est la première réponse)
      }));
      setAiModalOpen(false);


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

      setQuestionInfo((prevState) => {
        const updatedChoices = [...prevState.questionOptions];
        updatedChoices[id] = data.url;
        return {
          ...prevState,
          questionOptions: updatedChoices,
        };
      });

    } catch (error) {
      toast.error(`Erreur lors de l'upload du fichier ${type}.`);
      console.error(error);
    }
  };



  return (
    <div>
      {/* Difficulty Selection */}
      <div className="grid justify-items-center grid-cols-1 md:grid-cols-2 gap-4">
        {questionInfo.questionOptions.map((option, id) => (
          <div key={id} className="flex flex-col md:flex-row items-center gap-4 w-full">
            <input
              type="radio"
              name="multipleChoice"
              className="text-green-600 focus:ring-green-500"
              checked={questionInfo.questionCorrectAnswer === id}
              onChange={() =>
                setQuestionInfo({ ...questionInfo, questionCorrectAnswer: id })
              }
            />
  
            {questionInfo.questionType === "text" ? (
              <input
                type="text"
                value={option || ""}
                onChange={(e) => handleChangeAnswerText(e, id)}
                placeholder={`Option ${id + 1}`}
                className={`p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${questionInfo.questionCorrectAnswer === id
                  ? "border-4 border-[#417336] "
                  : "border-2 border-gray-300"
                  }`}
              />
            ) : questionInfo.questionType === "image" ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                {!option ? (
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
                      className={`px-4 py-2 bg-white text-black rounded cursor-pointer hover:text-white hover:bg-[#8B2DF1] ${questionInfo.questionCorrectAnswer === id
                        ? "border-4 border-[#417336] "
                        : "border-2 border-gray-300"
                        }`}
                    >
                      Import image
                    </label>
                  </>
                ) : (
                  <img
                    src={option}
                    alt="Image preview"
                    className={`md:w-10 w-20 h-20 object-cover rounded border ${questionInfo.questionCorrectAnswer === id
                      ? "border-4 border-[#417336] "
                      : "border-2 border-gray-300"
                      }`}
                    onClick={() => { handleDeleteImageAudio(id) }}
                  />
                )}
              </div>
            ) : questionInfo.questionType === "audio" ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                {!option ? (
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
                      className={`px-4 py-2 bg-white text-black rounded cursor-pointer hover:text-white hover:bg-[#8B2DF1] ${questionInfo.questionCorrectAnswer === id
                        ? "border-4 border-[#417336] "
                        : "border-2 border-gray-300"
                        }`}
                    >
                      Import audio
                    </label>
                  </>
                ) : (
                  <div
                    className={`bg-gray-800 rounded-lg ${questionInfo.questionCorrectAnswer === id
                      ? "border-4 border-[#417336] "
                      : "border-2 border-gray-300"
                      }`}
                  >
                    <CustomAudioPlayer src={option} deleteAudio={() => handleDeleteImageAudio(id)} />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>ERROR: {option}</p>
              </div>
            )}
  
            <button
              onClick={() => handleRemoveOption(id)}
              className="font-bold px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
              disabled={questionInfo.questionOptions.length <= 2}
            >
              ⨯
            </button>
          </div>
        ))}
      </div>
  
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <button
          onClick={handleAddOption}
          className={`px-4 py-2 text-black bg-[#CDCCCC] rounded ${questionInfo.questionOptions.length >= 8
            ? "cursor-not-allowed"
            : "hover:bg-[#DFDFDF]"
            }`}
          disabled={questionInfo.questionOptions.length >= 8}
        >
          Add choice
        </button>
        {questionInfo.questionType === "text" && (
          <div className="flexflex-row items-center gap-x-2">
            <div className="flex items-center justify-center text-3xl h-12 w-12 bg-white rounded-xl border-black border-2">
              <button
                className="text-3xl"
                onClick={() => { setAiModalOpen(!aiModalOpen) }}
              >
                🪄
              </button>
            </div>
  
            {aiModalOpen && (
              <div className="flex gap-2 mt-4 md:mt-0 bg-white rounded-xl border-black border-2 p-2">
                <button
                  disabled={aiGenerating}
                  onClick={() => { handleAiChoices('realistic'); }}
                  className={`p-1 shadow-sm shadow-black rounded-lg ${aiGenerating
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-black hover:shadow-lg'
                    }`}
                >
                  Realistic
                </button>
                <button
                  disabled={aiGenerating}
                  onClick={() => { handleAiChoices('humouristic'); }}
                  className={`p-1 shadow-sm shadow-black rounded-lg ${aiGenerating
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-black hover:shadow-lg'
                    }`}
                >
                  Humouristic
                </button>
                <button
                  disabled={aiGenerating}
                  onClick={() => { handleAiChoices('mixt'); }}
                  className={`p-1 shadow-sm shadow-black rounded-lg ${aiGenerating
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-black hover:shadow-lg'
                    }`}
                >
                  Mixt
                </button>
              </div>
            )}
            {aiGenerating && (
              <div className="flex items-center justify-center mt-2">
                <Spinner size="5" className="mr-3" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
