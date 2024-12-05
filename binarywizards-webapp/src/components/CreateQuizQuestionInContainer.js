

export default function QuestionInContainer({ setTypeOfScreen, question_id, question_text, question_index, question_difficulty, question_category, setIdQuestionSelected, setModalOpen, handleSubmitDeleteQuestion, handleSelectedQuestionProgressBar }) {
  const handleSubmitEditQuestion = () => {
    setTypeOfScreen('edit');
    setIdQuestionSelected(question_id);
    handleSelectedQuestionProgressBar(question_index);
    setModalOpen(true);

  };


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  const colors = [
    'from-[#ff7f50] to-[#87cefa]',  // Couleur 1
    'from-[#f39c12] to-[#d35400]',  // Couleur 2
    'from-[#8e44ad] to-[#2980b9]',  // Couleur 3
    'from-[#1abc9c] to-[#16a085]',  // Couleur 4
    'from-[#e74c3c] to-[#c0392b]',  // Couleur 5
  ];

  // Utilisation de l'index pour récupérer la couleur appropriée
  const backgroundClass = colors[question_index % colors.length];



  return (
    <div className="flex flex-col items-center gap-2 ">
      <div className="text-lg font-bold text-gray-800">Question {question_index}</div>
      <div className="flex items-start gap-2">
        {/* Conteneur principal */}
        <div
          className={`flex flex-col items-center justify-center w-full max-w-[320px] h-[150px] bg-gradient-to-r ${backgroundClass} rounded-lg p-2 shadow-lg cursor-pointer border-[#8B2DF1] border-2`}
          onClick={handleSubmitEditQuestion}
        >
          <div className="text-l text-white text-center ">
            {question_text || 'Write your question'}
          </div>
          <div className="flex justify-center items-center w-full h-12 overflow-hidden">
            <div className="text-4xl transform scale-90">🌍</div>
          </div>
        </div>

        {/* Poubelle */}
        <div className="flex items-center ml-0">
          <button
            id={question_id}
            className="flex items-center m-0 p-0 text-grey-500 text-2xl transition-transform bg-transparent border-none hover:bg-transparent"
            onClick={handleSubmitDeleteQuestion}
          >
            🗑️
          </button>
        </div>

      </div>
    </div>
  );
}