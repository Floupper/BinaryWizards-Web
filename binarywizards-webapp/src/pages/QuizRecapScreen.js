import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RecapQuizService from '../services/RecapQuizService';
import RecapQuizQuestion from '../components/RecapQuizQuestion';
import '../assets/QuizRecapScreen.css';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from '../components/Navbar';

const QuizRecapScreen = () => {
  const [quizDetails, setQuizDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quiz = await RecapQuizService.getQuizDetails(quizId);
        setQuizDetails(quiz);
        setQuestions(quiz.questions);
      } catch (error) {
        console.error('Error fetching quiz details or questions:', error);
      }
    };

    fetchQuizData();

    return () => {};
  }, [quizId]);

  if (!quizDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="QuizRecapScreen">
      <Navbar />
      <button className="return-button" onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
      <div className="recap-container">
        <div className="quiz-details">
          <h2>{quizDetails.title}</h2>

          <p>Difficulty: {quizDetails.difficulty}</p>
          <p>Number of Questions: {quizDetails.nb_questions}</p>
          <p>Times Played: {quizDetails.nb_played}</p>
          <p>Average Score: {quizDetails.average_score}</p>
          <button className="editquiz-button" onClick={() => navigate('/edit-quiz',  { state: { quizId } })}>Edit quiz</button>
        </div>
        <div className="questions-panel">
          <div className="questions-list">
            {questions.map((question, index) => (
              <RecapQuizQuestion
                key={question.question_id}
                questionNumber={index + 1}
                questionText={question.question_text}
                questionId={question.question_id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizRecapScreen;
