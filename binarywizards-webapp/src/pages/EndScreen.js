import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/EndScreen.css";
import { resetQuiz } from "../services/EndScreenService";

export default function EndScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, correct_answers_nb,nb_questions_total, quizId } = location.state || {
    score: null,
    correct_answers_nb: null,
    nb_questions_total: null,
    quizId: null,
  };

  useEffect(() => {
    if (score === null || correct_answers_nb === null || nb_questions_total === null|| quizId === null) {
      navigate("/");
    }
  }, [score, correct_answers_nb,nb_questions_total, quizId,navigate]);

  const handleRestartQuiz = async () => {
    if (quizId) {
      await resetQuiz(quizId);
      navigate(`/question/${quizId}`);
    }
  };

  return (
    <div className="EndScreen">
      <div className="EndScreenContainer">
        {score !== null && correct_answers_nb !== null && nb_questions_total !== null ? (
          <>
            <h1>Quiz Completed!</h1>
            <h2>Your Score: {score}</h2>
            <h2>Correct answer : {correct_answers_nb}/{nb_questions_total}</h2>
           

            <button onClick={() => navigate("/")}>Back to home page</button>
            <button onClick={handleRestartQuiz}>Restart Quiz</button>
          </>
        ) : (
          <p className="errorMessage">Error: The result could not be retrieved.</p>
        )}
      </div>
    </div>
  );
}