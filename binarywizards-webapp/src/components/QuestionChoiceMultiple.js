import CustomAudioPlayer from './CustomAudioPlayer';
import { useState } from 'react';

export default function QuestionChoiceMultiple({
  question_choice,
  correctOptionIndex,
  selectedQuestionId,
  isAnswered,
  onQuestionSelect,
}) {

  const [audioOnSelected, setAudioOnSelected] = useState(false);

  return (
    <div className="QuestionChoiceMultiple place-items-center grid justify-items-center grid-cols-1 sm:grid-cols-2 gap-4">
      {question_choice.map((choice) => {
        const { option_index, option_content } = choice;
        const { type, content } = option_content;
        let buttonClass = '';

        if (option_index === correctOptionIndex) {
          buttonClass = 'bg-green-100 border-green-500 text-green-700';
        } else if (
          selectedQuestionId !== null &&
          correctOptionIndex !== null &&
          selectedQuestionId === option_index &&
          selectedQuestionId !== correctOptionIndex
        ) {
          buttonClass = 'bg-red-100 border-red-500 text-red-700';
        }

        // Render different types of content
        const renderOptionContent = () => {
          switch (type) {
            case 'text':
              return <span className="text-center">{content}</span>;
            case 'image':
              return <img src={content} alt={`Option ${option_index}`} className="w-full h-auto max-h-24 object-contain" />;
            case 'audio':
              return (
                <CustomAudioPlayer src={content} isAnswered={isAnswered} option_id={option_index} setOnSelected={onQuestionSelect} />
              );
            default:
              return <span className="text-center">Unsupported content</span>;
          }
        };

        return (
          <div key={option_index} className="flex items-center justify-center min-w-[30vh]">
            <button
              onClick={() => { (type !== "audio" && (onQuestionSelect(option_index))) }}
              className={`
                w-full px-6 py-3 text-center rounded-lg 
                border-2 bg-white text-black 
                hover:bg-gray-100 
                transition-all duration-300 
                ${selectedQuestionId === option_index ? 'font-semibold' : ''}
                ${buttonClass}
              `}
              style={{
                cursor: isAnswered ? 'not-allowed' : 'pointer',
              }}
              disabled={isAnswered}
            >
              {renderOptionContent()}
            </button>
          </div>
        );
      })}
    </div>
  );
}