import CustomAudioPlayer from './CustomAudioPlayer';

export default function QuestionChoiceMultiple({
  question_choice,
  correctOptionIndex,
  selectedQuestionId,
  isAnswered,
  onQuestionSelect,
  type
}) {

  const renderOptionContent = (option_content, option_index) => {
    switch (type) {
      case 'text':
        return <span className="text-center">{option_content}</span>;
      case 'image':
        return (
          <img
            src={option_content}
            alt={`Option ${option_index}`}
            className="w-full h-auto max-h-24 object-contain"
          />
        );
      case 'audio':
        return (
          <CustomAudioPlayer
            src={option_content}
            isAnswered={isAnswered}
            option_id={option_index}
            setOnSelected={onQuestionSelect}
          />
        );
      default:
        return <span className="text-center">Unsupported content</span>;
    }
  };

  return (
    <div className="QuestionChoiceMultiple grid place-items-center justify-items-center grid-cols-1 sm:grid-cols-2 gap-4">
      {question_choice.map((choice) => {
        const { option_index, option_content } = choice;
        let buttonClass = `${isAnswered ? 'bg-gray-100 cursor-not-allowed' : ''}`;

        if (option_index === correctOptionIndex) {
          buttonClass = 'bg-green-100 border-green-500 text-green-700';
        } else if (
          selectedQuestionId !== null &&
          correctOptionIndex !== null &&
          selectedQuestionId === option_index
        ) {
          buttonClass = 'bg-red-100 border-red-500 text-red-700';
        }

        return (
          <div>
             <div
              key={option_index}
              className="flex items-center justify-center min-w-[30vh]"
            >
              <button
                onClick={() => type !== 'audio' && onQuestionSelect(option_index)}
                className={`w-full px-6 py-3 text-center rounded-lg border-[0.25rem] bg-white text-black 
                  hover:bg-gray-100 transition-all duration-300 
                  ${selectedQuestionId === option_index ? 'border-[0.25rem] border-black' : ''}
                  ${buttonClass}`}
                style={{ cursor: isAnswered ? 'not-allowed' : 'pointer' }}
                disabled={isAnswered}
              >
                {renderOptionContent(option_content, option_index)}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}