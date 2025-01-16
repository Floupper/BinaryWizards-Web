export default function QuestionInContainer({
  setTypeOfScreen,
  question_id,
  question_text = "Write your question",
  question_index,
  setIdQuestionSelected,
  handleSubmitDeleteQuestion,
  handleSelectedQuestionProgressBar,
}) {
  const colors = [
    "from-[#EFDEB3] to-[#8A2BF2] to-[#377DC9]",
    "from-[#EFDEB3] to-[#8A2BF2] to-[#377DC9]",
    "from-[#EFDEB3] to-[#8A2BF2] to-[#377DC9]",
    "from-[#EFDEB3] to-[#8A2BF2] to-[#377DC9]",
    "from-[#EFDEB3] to-[#8A2BF2] to-[#377DC9]",
  ];

  const backgroundClass = colors[question_index % colors.length];

  const handleEdit = () => {
    setTypeOfScreen("edit");
    setIdQuestionSelected(question_id);
    handleSelectedQuestionProgressBar(question_index);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-row items-center gap-2 text-lg font-semibold text-gray-800">
        <button
          id={question_id}
          className="text-gray-500 text-2xl transition-transform bg-transparent border-none hover:bg-transparent"
          onClick={handleSubmitDeleteQuestion}
        >
          🗑️
        </button>
        Question {question_index + 1}
      </div>

      <div className="flex items-start gap-2">
        <div
          className={`flex flex-col w-[30vh] h-[15vh] items-center justify-center bg-gradient-to-r ${backgroundClass} rounded-lg p-2 shadow-lg cursor-pointer border-[#8B2DF1] border-2`}
          onClick={handleEdit}
        >
          <div className="text-l text-white text-center">{question_text}</div>
          <div className="flex justify-center items-center w-full h-12 overflow-hidden">
            <div className="text-4xl transform scale-90">🌍</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function QuestionInContainerDefault() {
  const colors = "from-[#EFDEB3] to-[#8A2BF2] to-[#377DC9]";
  const color1 = "[#EFDEB3]";
  const color2 = "[#8A2BF2]";
  const color3 = "[#377DC9]";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-semibold text-gray-800">Question</div>
      <div className="flex items-start gap-2">
        <div
          className={`flex flex-col w-[30vh] h-[15vh] items-center justify-center bg-gradient-to-r from-${color1}  via-${color2} to-${color3} rounded-lg p-2 shadow-lg border-[#8B2DF1] border-2`}
        >
          <div className="text-l text-white text-center">Your question</div>
          <div className="flex justify-center items-center w-full h-12 overflow-hidden">
            <div className="text-4xl transform scale-90">✍️</div>
          </div>
        </div>
      </div>
    </div>
  );
}