export default function QuestionChoiceMultiple({ question_choice, correctOptionIndex, selectedQuestionId, isAnswered, onQuestionSelect }) {
  return (
    <div className="QuestionChoiceMultiple  place-items-center grid justify-items-center grid-cols-2 gap-4">
      {question_choice.map((choice) => {
        const { option_index, option_text } = choice;


        let buttonClass = '';

        if (option_index === correctOptionIndex) {
          buttonClass = 'bg-green-100 border-green-500 text-green-700  ';
        }

        if (
          selectedQuestionId !== null &&
          correctOptionIndex !== null &&
          selectedQuestionId === option_index &&
          selectedQuestionId !== correctOptionIndex
        ) {
          buttonClass = 'bg-red-100 border-red-500 text-red-700';
        }

        return (
          <div key={option_index} className="flex items-center place-items-center min-w-[30vh]">
            <button
              onClick={() => onQuestionSelect(option_index)}
              className={`
                w-full px-6 py-3 text-center rounded-lg 
                border-2 bg-white text-black 
                hover:bg-gray-100 
                transition-all duration-300 
                ${selectedQuestionId === option_index ? ' font-bold' : ''}
                ${buttonClass}
              `}
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
