import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/EndScreen.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGameWithQuizId } from '../services/JoinQuizService';
import Navbar from "../components/Navbar";

export default function EndScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const {correct_answers_nb,nb_questions_total, quizId } = location.state || {
    
    correct_answers_nb: null,
    nb_questions_total: null,
    quizId: null,
  };

  useEffect(() => {
    if (correct_answers_nb === null || nb_questions_total === null|| quizId === null) {
      navigate("/");
    }
  }, [correct_answers_nb,nb_questions_total, quizId,navigate]);

  const handleRestartQuiz = async () => {
    if (quizId) {
      const data = await createGameWithQuizId(quizId);
      navigate(`/question/${data.game_id}`);
    }
  };

  return (
    <div className="EndScreen">
      <Navbar />
      <ToastContainer />
      <div className="EndScreenContainer">
        {correct_answers_nb !== null && nb_questions_total !== null ? (
          <>
            <h1>Quiz Completed!</h1>
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