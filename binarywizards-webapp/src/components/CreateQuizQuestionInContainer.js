import '../assets/CreateQuizQuestionInContainer.css';

export default function QuestionInContainer({ setTypeOfScreen, question_id, question_text, question_index, question_difficulty, question_category, setIdQuestionSelected, setModalOpen, handleSubmitDeleteQuestion, handleSelectedQuestionProgressBar }) {
  const handleSubmitEditQuestion = (event) => {
    setTypeOfScreen('edit');
    setIdQuestionSelected(question_id);
    setModalOpen(true);

  };
  const handleClickQuestion = () => {
    handleSelectedQuestionProgressBar(question_index); // Appel de la fonction avec l'ID de la question
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  return (
    <div className="question-container" onClick={handleClickQuestion}>
      <div className="question-details">
        <a>{capitalizeFirstLetter(question_text)}</a>
        <a>{capitalizeFirstLetter(question_difficulty)}</a>
        <a>{capitalizeFirstLetter(question_category)}</a>
      </div>
      <div className="question-buttons">
        <button onClick={handleSubmitEditQuestion}>Edit</button>
        <button id={question_id} onClick={handleSubmitDeleteQuestion}>Delete</button>
      </div>
    </div>
  );
}