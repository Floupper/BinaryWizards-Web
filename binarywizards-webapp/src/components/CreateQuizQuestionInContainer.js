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
    "from-[#ff7f50] to-[#87cefa]", 
    "from-[#f39c12] to-[#d35400]", 
    "from-[#8e44ad] to-[#2980b9]", 
    "from-[#1abc9c] to-[#16a085]", 
    "from-[#e74c3c] to-[#c0392b]",
  ];

  const backgroundClass = colors[question_index % colors.length];

  const handleEdit = () => {
    setTypeOfScreen("edit");
    setIdQuestionSelected(question_id);
    handleSelectedQuestionProgressBar(question_index);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-row items-center gap-2 text-lg font-bold text-gray-800">
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
  const colors = "from-[#ff7f50] to-[#87cefa]";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-bold text-gray-800">Question</div>
      <div className="flex items-start gap-2">
        <div
          className={`flex flex-col w-[30vh] h-[15vh] items-center justify-center bg-gradient-to-r ${colors} rounded-lg p-2 shadow-lg border-[#8B2DF1] border-2`}
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