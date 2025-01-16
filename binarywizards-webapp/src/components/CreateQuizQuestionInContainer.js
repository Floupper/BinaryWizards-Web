export default function QuestionInContainer({
  setTypeOfScreen,
  question_id,
  question_text = "Write your question",
  question_index,
  editQuestionIdSelected,

  handleSubmitDeleteQuestion,
  handleSelectedQuestionProgressBar,
}) {
  const colors = "from-[#EFDEB3] via-[#8A2BF2] to-[#377DC9]";

  const backgroundClass = colors[question_index % colors.length];

  const handleEdit = () => {
    setTypeOfScreen("edit");
    editQuestionIdSelected(question_id);
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
          className={`flex flex-col w-[30vh] h-[15vh] items-center justify-center bg-gradient-to-b ${colors} rounded-lg p-2 shadow-lg cursor-pointer border-[#8B2DF1] border-2`}
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

export function QuestionInContainerDefault({ deleteNewQuestion, editQuestionIdSelected, handleSelectedQuestionProgressBar, setTypeOfScreen }) {
  const colors = "from-[#EFDEB3] via-[#8A2BF2] to-[#377DC9]";

  const handleEdit = () => {
    setTypeOfScreen("create");

    editQuestionIdSelected('');
    handleSelectedQuestionProgressBar(-1);
  };


  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-row items-center gap-2 text-lg font-semibold text-gray-800">
        {deleteNewQuestion && (
          <button
            className="text-gray-500 text-2xl transition-transform bg-transparent border-none hover:bg-transparent"
            onClick={() => deleteNewQuestion()}
          >
            🗑️
          </button>)}
        New Question</div>

      <div className="flex items-start gap-2">
        <div
          className={`flex flex-col w-[30vh] h-[15vh] items-center justify-center bg-gradient-to-b ${colors} cursor-pointer rounded-lg p-2 shadow-lg border-[#8B2DF1] border-2`}
          onClick={() => handleEdit('')}
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