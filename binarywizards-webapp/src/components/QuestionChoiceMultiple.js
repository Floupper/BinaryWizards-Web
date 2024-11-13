import '../assets/QuestionChoiceMultiple.css';

export default function QuestionChoiceMultiple({ question_choice, correctOptionIndex, selectedQuestionId, isAnswered, onQuestionSelect }) {
  return (
    <div className="QuestionChoiceMultiple">
      {question_choice.map((choice, index) => {
        // Initialiser une variable pour la classe du bouton
        let buttonClass = '';

        // Appliquer la classe 'correct-answer' à la bonne réponse
        console.log('correctOptionIndex', correctOptionIndex);
        console.log('index', index);
        if (index === correctOptionIndex) {
          buttonClass = 'correct-answer'; // Appliquer la classe à la bonne réponse
        }

        return (
          <div key={index} className="choice">
            <button
              onClick={() => onQuestionSelect(index)}
              className={`${selectedQuestionId === index ? 'selected-button' : ''} ${buttonClass}`}
              style={{
                cursor: isAnswered ? 'not-allowed' : 'pointer', // Appliquer cursor: not-allowed si la réponse est envoyée
              }}
              disabled={isAnswered} // Désactiver le bouton une fois la réponse envoyée
            >
              {choice}
            </button>
          </div>
        );
      })}
    </div>
  );
}
