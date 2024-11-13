import '../assets/QuestionChoiceMultiple.css';

export default function QuestionChoiceMultiple({ question_choice, correctOptionIndex, selectedQuestionId, isAnswered, onQuestionSelect }) {
  return (
    <div className="QuestionChoiceMultiple">
      {question_choice.map((choice, index) => {
        // Initialize a variable for the button's class
        let buttonClass = '';

        // Apply the 'correct-answer' class to the correct answer
        if (index === correctOptionIndex) {
          buttonClass = 'correct-answer'; // Apply the class to the correct answer
        }

        // If the answer is incorrect, apply the 'incorrect-answer' class
        if (selectedQuestionId !== null && correctOptionIndex !== null && selectedQuestionId === index && selectedQuestionId !== correctOptionIndex) {
          buttonClass = 'incorrect-answer'; // Apply the 'incorrect-answer' class for an incorrect answer
        }

        return (
          <div key={index} className="choice">
            <button
              onClick={() => onQuestionSelect(index)}
              className={`${selectedQuestionId === index ? 'selected-button' : ''} ${buttonClass}`}
              style={{
                cursor: isAnswered ? 'not-allowed' : 'pointer', // Apply 'cursor: not-allowed' if the answer has been submitted
              }}
              disabled={isAnswered} // Disable the button once the answer is submitted
            >
              {choice}
            </button>
          </div>
        );
      })}
    </div>
  );
}
