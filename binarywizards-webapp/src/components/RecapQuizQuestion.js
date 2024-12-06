import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import RecapQuizService from '../services/RecapQuizService';

const RecapQuizQuestion = ({ questionNumber, questionText, questionId }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [questionDetails, setQuestionDetails] = useState(null);
  const { quizId } = useParams();

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      try {
        const details = await RecapQuizService.getGameQuestionsAndAnswers(quizId, questionId);
        setQuestionDetails(details);
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

  return (
    <div className="p-4 mb-6">
      <div className="Question-header flex justify-between items-center">
        <h3 className="text-black font-sifonn text-xl">Question {questionNumber}: {questionText}</h3>
        <NavLink to="#" onClick={toggleShowAnswers} className="text-black font-medium text-lg ml-4">
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </NavLink>
      </div>
      {showAnswers && questionDetails && (
        <div className="mt-4 p-6 border border-gray-300 rounded-[2rem] bg-white shadow-inner">
          <ul className="Answers-list space-y-2">
            {questionDetails.option_selection_stats.map((option, index) => (
              <li key={option.option_id} className={`p-3 border-[0.125rem] rounded-lg ${option.is_correct_answer ? 'border-green-500' : 'border-red-500'} flex justify-between items-center`}> 
                <span>{option.option_text}</span>
                <span className="ml-2 text-gray-500">({option.selection_percentage}%)</span>
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
