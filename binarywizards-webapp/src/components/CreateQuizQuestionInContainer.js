export default function QuestionInContainer({ setTypeOfScreen, question_id, question_text, question_difficulty, question_category, setIdQuestionSelected, setModalOpen, handleSubmitDeleteQuestion }) {
  const handleSubmitEditQuestion = (event) => {
    setTypeOfScreen('edit');
    setIdQuestionSelected(question_id);
    setModalOpen(true);

  };


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


  return (
    <div className="question-container">
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