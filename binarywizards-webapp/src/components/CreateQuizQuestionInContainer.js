import '../assets/CreateQuizQuestionInContainer.css';

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
    <div className="flex flex-col items-start gap-2 w-full">
      <div className="text-lg font-bold text-gray-800">Question {question_index}</div>
      <div className="flex items-start gap-2 w-full">
        {/* Conteneur principal */}
        <div
          className={`flex flex-col items-center justify-center w-full max-w-[320px] h-[150px] bg-gradient-to-r ${backgroundClass} rounded-lg p-2 shadow-lg cursor-pointer`}
          onClick={handleSubmitEditQuestion}
        >
          <div className="text-l text-gray-800 text-center mb-2">
            {question_text || 'Write your question'}
          </div>
          <div className="flex justify-center items-center w-full h-12 overflow-hidden">
            <div className="text-4xl transform scale-90">🌍</div>
          </div>
        </div>

        {/* Poubelle */}
        <div className="flex items-end ml-2">
          <button
            id={question_id}
            className="text-red-500 text-lg transition-transform hover:scale-110 bg-transparent border-none"
            onClick={handleSubmitDeleteQuestion}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}