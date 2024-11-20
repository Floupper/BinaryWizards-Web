import '../assets/QuestionChoiceMultiple.css';

import '../assets/QuestionChoiceMultiple.css';

export default function QuestionChoiceMultiple({ question_choice, correctOptionIndex, selectedQuestionId, isAnswered, onQuestionSelect }) {
  return (
    <div className="QuestionChoiceMultiple">
      {question_choice.map((choice) => {
        const { option_index, option_text } = choice;

        // Initialize a variable for the button's class
        let buttonClass = '';

        // Apply the 'correct-answer' class to the correct answer
        if (option_index === correctOptionIndex) {
          buttonClass = 'correct-answer';
        }

        // Apply the 'incorrect-answer' class if the selected answer is wrong
        if (
          selectedQuestionId !== null &&
          correctOptionIndex !== null &&
          selectedQuestionId === option_index &&
          selectedQuestionId !== correctOptionIndex
        ) {
          buttonClass = 'incorrect-answer';
        }

        return (
          <div key={option_index} className="choice">
            <button
              onClick={() => onQuestionSelect(option_index)}
              className={`${selectedQuestionId === option_index ? 'selected-button' : ''} ${buttonClass}`}
              style={{
                cursor: isAnswered ? 'not-allowed' : 'pointer',
              }}
              disabled={isAnswered}
            >
              {option_text}
            </button>
          </div>
        );
      })}
    </div>
  );
}
