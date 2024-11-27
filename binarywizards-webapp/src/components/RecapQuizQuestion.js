import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import '../assets/RecapQuizQuestion.css';
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
    <div className="Question">
      <div className="Question-header">
        <h3>Question {questionNumber}: {questionText}</h3>
        <NavLink to="#" onClick={toggleShowAnswers} className="show-answers-link">
          {showAnswers ? 'Hide Answers' : 'Show Answers'}
        </NavLink>
      </div>
      {showAnswers && questionDetails && (
        <div className="question-stats">
          <p>Total Answers: {questionDetails.total_answers}</p>
          <p>Correct Answers Count: {questionDetails.correct_answers_count}</p>
          <p>Accuracy Rate: {questionDetails.accuracy_rate}%</p>
          <ul className="Answers-list">
            {questionDetails.option_selection_stats.map((option, index) => (
              <li key={option.option_id} className={`Answer ${option.is_correct_answer ? 'correct' : 'incorrect'}`}>
                {option.option_text} <span className="icon">{option.is_correct_answer ? '✔️' : '❌'}</span>
                <span className="selection-percentage"> ({option.selection_percentage}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecapQuizQuestion;
