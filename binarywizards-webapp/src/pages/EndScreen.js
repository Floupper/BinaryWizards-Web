import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/EndScreen.css";
import { resetQuiz } from "../services/EndScreenService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function EndScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, totalScore, quizId } = location.state || {
    score: null,
    totalScore: null,
    quizId: null,
  };

  useEffect(() => {
    if (score === null || totalScore === null || quizId === null) {
      navigate("/");
    }
  }, [score, totalScore, quizId, navigate]);

  const handleRestartQuiz = async () => {
    if (quizId) {
      await resetQuiz(quizId);
      navigate(`/question/${quizId}`);
    }
  };

  return (
    <div className="EndScreen">
            <ToastContainer />
      <div className="EndScreenContainer">
        {score !== null && totalScore !== null ? (
          <>
            <h1>Quiz Completed!</h1>
            <h2>Your Score: {score}/{totalScore}</h2>
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