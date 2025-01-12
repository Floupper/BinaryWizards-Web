import React from "react";

export function MultipleChoiceQuestion({ selectedOptionInput, setSelectedOptionInput }) {

  console.log(selectedOptionInput);
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
    console.log("d", selectedOptionInput);
  };


  const handleAddOption = () => {
    if (selectedOptionInput.choices.length < 8) {
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        choices: [...prevState.choices, { type: "text", content: "" }],
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


            {selectedOptionInput.type_of_question === "text" ? (
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
                {/* Votre script pour le type "text" */}
                <p>{choice.text}</p>
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
