import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import RecapQuizService from '../services/RecapQuizService';
import CustomAudioPlayer from '../components/CustomAudioPlayer';

const RecapQuizQuestion = ({ questionNumber, questionText, questionId }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [questionDetails, setQuestionDetails] = useState(null);
  const { quizId } = useParams();
  const [type, setType] = useState(null);

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const details = await RecapQuizService.getGameQuestionsAndAnswers(quizId, questionId);
        setQuestionDetails(details);
        setType(details.question_type)
      } catch (error) {
        console.error('Error fetching question details:', error);
      }
    };

    if (showAnswers && !questionDetails) {
      fetchQuestionDetails();
    }
  }, [showAnswers, quizId, questionId]);

  const toggleShowAnswers = () => {
    setShowAnswers((prev) => !prev);
  };

  const renderOptionContent = (option) => {
    const { option_content } = option;
    switch (type) {
      case 'text':
        return <span>{option_content}</span>;

      case 'audio':
        return (
          <CustomAudioPlayer
            src={option_content}
          />
        );

      case 'image':
        return <img src={option_content} alt="Quiz option" className="max-w-full h-auto rounded-md" />;

      default:
        return <span>Unsupported content type</span>;
    }
  };

  return (
    <div className="p-4 mb-6">
      <div className="Question-header flex justify-between items-center flex-wrap">
        <h3 className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl">{`Question ${questionNumber}: ${questionText}`}</h3>
        <NavLink
          to="#"
          onClick={toggleShowAnswers}
          className="text-[#8B2DF1] font-medium text-lg mt-3 ml-4 sm:text-xl"
        >
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </NavLink>
      </div>
      {showAnswers && questionDetails && (
        <div className="mt-4 p-6 border border-gray-300 rounded-[2rem] bg-white shadow-inner">
          <ul className="Answers-list space-y-2">
            {questionDetails.option_selection_stats.map((option, index) => (
              <li
                key={option.option_id}
                className={`p-3 border-[0.125rem] rounded-lg ${
                  option.is_correct_answer ? 'border-green-500' : 'border-red-500'
                } flex justify-between items-center space-x-2`}
              >
                <div className="flex flex-col space-y-1">
                  {renderOptionContent(option)}
                  <span className="text-gray-500">{option.selection_percentage}%</span>
                </div>
                <span className="ml-2">{option.is_correct_answer ? '✔️' : '❌'}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-sm text-gray-700">
            <p>Total Answers: {questionDetails.total_answers}</p>
            <p>Correct Answers Count: {questionDetails.correct_answers_count}</p>
            <p>Accuracy Rate: {questionDetails.accuracy_rate}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecapQuizQuestion;