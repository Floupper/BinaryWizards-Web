import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createGameWithQuizId } from '../services/JoinQuizService';
import { toast } from "react-toastify";

export default function QuizCreated() {
  const navigate = useNavigate();
  const { quizId } = useParams();


  const handleJoinQuiz = async () => {
    try {
      const data = await createGameWithQuizId(quizId);
      navigate(`/question/${data.game_id}`);
    }
    catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="App">
      <h1>Quiz created succesfully</h1>

      <div className="button-group">
        <button onClick={handleJoinQuiz}>Join the quizz</button>
        <button onClick={() => navigate('/')}>Go Home</button>
        <button onClick={() => navigate('/dashboard')}>Dashboard</button>
      </div>
    </div>
  );
}
