import '../assets/QuestionChoiceMultiple.css';

export default function QuestionChoiceMultiple({ question_choice, onQuestionSelect, selectedQuestionId, isAnswered }) {
  return (
    <div className="QuestionChoiceMultiple">
      {question_choice.map((choice, index) => (
        <div key={index} className="choice">
          <button 
            onClick={() => onQuestionSelect(index)}
            className={selectedQuestionId === index ? 'selected-button' : ''}
            style={{
              cursor: isAnswered ? 'not-allowed' : 'pointer', // Applique cursor: not-allowed si la réponse est envoyée
            }}
            disabled={isAnswered} // Désactive les boutons après sélection
          >
            {choice}
          </button>
        </div>
      ))}
    </div>
  );
}