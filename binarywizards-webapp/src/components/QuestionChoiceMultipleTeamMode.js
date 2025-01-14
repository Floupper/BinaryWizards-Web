export default function QuestionChoiceMultipleTeamMode({
  question_choice,
  correctOptionIndex,
  selectedQuestionId,
  isAnswered,
  onQuestionSelect,
  teamSelections = {}, // Objet qui contient les sélections par équipe
  skiped,
}) {
  return (
    <div className="QuestionChoiceMultipleTeamMode place-items-center grid justify-items-center grid-cols-2 gap-4">
      {question_choice.map((choice) => {
        const { option_index, option_content } = choice;
        const { type, content } = option_content || {};
        let buttonClass = "";

        if (option_index === correctOptionIndex) {
          buttonClass = "bg-green-100 border-green-500 text-green-700";
        } else if (skiped && option_index !== correctOptionIndex) {
          buttonClass = "bg-red-100 border-red-500 text-red-700";
        } else if (
          selectedQuestionId !== null &&
          correctOptionIndex !== null &&
          selectedQuestionId === option_index &&
          selectedQuestionId !== correctOptionIndex
        ) {
          buttonClass = "bg-red-100 border-red-500 text-red-700";
        }

        // Ajouter une classe pour désactiver visuellement l'option sélectionnée
        const isDisabled = isAnswered && selectedQuestionId === option_index;
        if (isDisabled) {
          buttonClass += " opacity-50"; // Rend l'option sélectionnée semi-transparente
        }

        // Rendu du contenu de l'option (texte, image, audio)
        const renderOptionContent = () => {
          switch (type) {
            case "text":
              return <span className="text-center">{content}</span>;
            case "image":
              return (
                <img
                  src={content}
                  alt={`Option ${option_index}`}
                  className="w-full h-auto max-h-24 object-contain"
                />
              );
            case "audio":
              return (
                <audio controls>
                  <source src={content} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              );
            default:
              return <span className="text-center">Unsupported content</span>;
          }
        };

        // Affichage des sélections des équipes
        const renderTeamSelections = () => {
          if (teamSelections[option_index]) {
            return (
              <div className="text-sm mt-2 text-blue-500">
                Sélectionné par : {teamSelections[option_index].join(", ")}
              </div>
            );
          }
          return null;
        };

        return (
          <div key={option_index} className="flex items-center place-items-center min-w-[30vh]">
            <button
              onClick={() => onQuestionSelect(option_index)}
              className={`
                w-full px-6 py-3 text-center rounded-lg 
                border-2 bg-white text-black 
                hover:bg-gray-100 
                transition-all duration-300 
                ${selectedQuestionId === option_index ? "font-semibold" : ""}
                ${buttonClass}
              `}
              style={{
                cursor: isAnswered ? "not-allowed" : "pointer",
              }}
              disabled={isAnswered}
            >
              {renderOptionContent()}
            </button>
            {renderTeamSelections()}
          </div>
        );
      })}
    </div>
  );
}
