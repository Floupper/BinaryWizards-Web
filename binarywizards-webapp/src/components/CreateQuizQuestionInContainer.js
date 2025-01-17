export default function QuestionInContainer({
  question_id,
  question_text = "No text",
  question_index,
  handleSubmitDeleteQuestion,
  selectQuestion,
}) {
  const color = "from-[#EFDEB3] via-[#8A2BF2] to-[#377DC9]";

  const handleSelectQuestion = () => {
    selectQuestion(question_id);
  };

  return (
    <div className="flex flex-col pt-5 items-center gap-4">
      {/* Header */}
      <div className="flex flex-row items-center gap-2 text-lg font-semibold text-gray-800">
        <button
          id={question_id}
          className="text-gray-500 text-2xl transition-transform bg-transparent border-none hover:bg-transparent"
          onClick={() => handleSubmitDeleteQuestion(question_id)}
        >
          🗑️
        </button>
        <span className="text-center">Question {question_index + 1}</span>
      </div>

      {/* Question Box */}
      <div className="flex items-start gap-2">
        <div
          className={`flex flex-col w-8/12 sm:w-[70vw] md:w-[40vw] lg:w-[30vh] h-[15vh] items-center justify-center bg-gradient-to-b ${color} rounded-lg p-2 shadow-lg cursor-pointer border-[#8B2DF1] border-2`}
          onClick={() => handleSelectQuestion()}
        >
          <div className="text-base sm:text-lg text-white text-center">{question_text}</div>
        </div>
      </div>
    </div>
  );
}

export function QuestionInContainerDefault({
  handleSubmitDeleteNewQuestion,
  selectQuestion,
}) {
  const color = "from-[#EFDEB3] via-[#8A2BF2] to-[#377DC9]";

  return (
    <div className="flex flex-col pt-5 items-center gap-4">
      {/* Header */}
      <div className="flex flex-row items-center gap-2 text-lg font-semibold text-gray-800">
        <button
          className="text-gray-500 text-2xl transition-transform bg-transparent border-none hover:bg-transparent"
          onClick={() => handleSubmitDeleteNewQuestion()}
        >
          🗑️
        </button>
        <span className="text-center">New Question</span>
      </div>

      {/* New Question Box */}
      <div className="flex items-start gap-2">
        <div
          className={`flex flex-col w-[90vw] sm:w-[70vw] md:w-[40vw] lg:w-[30vh] h-[15vh] items-center justify-center bg-gradient-to-b ${color} cursor-pointer rounded-lg p-2 shadow-lg border-[#8B2DF1] border-2`}
          onClick={() => selectQuestion('')}
        >
          <div className="text-base sm:text-lg text-white text-center">Your question</div>
          <div className="flex justify-center items-center w-full h-12 overflow-hidden">
            <div className="text-4xl transform scale-90">✍️</div>
          </div>
        </div>
      </div>
    </div>
  );
}