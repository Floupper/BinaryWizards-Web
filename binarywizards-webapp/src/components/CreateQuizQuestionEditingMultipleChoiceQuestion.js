import React from "react";
import { toast } from "react-toastify";
import CreateQuizService from "../services/CreateQuizService";
import { useEffect } from "react";

export function MultipleChoiceQuestion({ selectedOptionInput, setSelectedOptionInput }) {
  useEffect(() => {
    if (!selectedOptionInput.choices || selectedOptionInput.choices.length === 0) {
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        choices: [{ type: "text", content: "" }, { type: "text", content: "" }],
        type_of_question: "text",
        correctAnswerMultiple: 0,
      }));
    }
  }, [selectedOptionInput, setSelectedOptionInput]);

  const handleChangeAnswerText = (event, index) => {
    const value = event.target.value;
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: prevState.choices.map((choice, i) =>
        i === index ? { ...choice, content: value } : choice
      ),
    }));
  };

  const handleAddOption = () => {
    if (selectedOptionInput.choices.length < 8) {
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        choices: [...prevState.choices, { type: prevState.type_of_question || "text", content: "" }],
      }));
    }
  };

  const handleRemoveOption = (index) => {
    if (selectedOptionInput.choices.length > 2) {
      setSelectedOptionInput((prevState) => {
        const updatedChoices = prevState.choices.filter((_, i) => i !== index);

        const updatedCorrectAnswer =
          prevState.correctAnswerMultiple === index
            ? Math.max(0, prevState.correctAnswerMultiple - 1)
            : prevState.correctAnswerMultiple > index
            ? prevState.correctAnswerMultiple - 1
            : prevState.correctAnswerMultiple;

        return {
          ...prevState,
          choices: updatedChoices,
          correctAnswerMultiple: updatedCorrectAnswer,
        };
      });
    }
  };

  const handleUpload = async (id, file, type) => {
    if (!file) {
      toast.error(`Veuillez sélectionner un fichier ${type === "audio" ? "audio" : "image"}.`);
      return;
    }

    const formData = new FormData();
    formData.append(type, file);

    try {
      const data =
        type === "audio"
          ? await CreateQuizService.updateAudio(formData)
          : await CreateQuizService.updateImage(formData);

      setSelectedOptionInput((prevState) => {
        const updatedChoices = [...prevState.choices];
        updatedChoices[id].content = data.url;

        return { ...prevState, choices: updatedChoices };
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
              checked={selectedOptionInput.correctAnswerMultiple === id}
              onChange={() =>
                setSelectedOptionInput({ ...selectedOptionInput, correctAnswerMultiple: id })
              }
              className="text-green-600 focus:ring-green-500"
            />
            {choice.type === "text" ? (
              <input
                type="text"
                value={choice.content}
                onChange={(e) => handleChangeAnswerText(e, id)}
                placeholder={`Option ${id + 1}`}
                className={`p-3 border rounded-md focus:ring-blue-500 ${
                  selectedOptionInput.correctAnswerMultiple === id
                    ? "border-4 border-[#417336]"
                    : "border-2 border-gray-300"
                }`}
              />
            ) : choice.type === "image" ? (
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(id, e.target.files[0], "image")}
                  className="hidden"
                />
                <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                  Import a picture
                </label>
                {choice.content && (
                  <img src={choice.content} alt="Aperçu" className="w-20 h-20 rounded border" />
                )}
              </div>
            ) : choice.type === "audio" ? (
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleUpload(id, e.target.files[0], "audio")}
                  className="hidden"
                />
                <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                  Import audio file
                </label>
                {choice.content && <audio controls src={choice.content} />}
              </div>
            ) : (
              <p>Error.</p>
            )}
            
            <button
              onClick={() => handleRemoveOption(id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
          className={`px-4 py-2 rounded ${
            selectedOptionInput.choices.length >= 8
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={selectedOptionInput.choices.length >= 8}
        >
          Add an option
        </button>
      </div>
    </div>
  );
}