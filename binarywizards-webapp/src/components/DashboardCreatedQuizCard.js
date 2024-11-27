import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/CreatedQuizCard.css';

export default function CreatedQuizCard({ quiz }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/dashboard/detail-create-quiz/${quiz.id}`);
  };

  return (
    <div className="created-quiz-card" onClick={handleCardClick}>
      <div className="quiz-info">
        <h3>Title: {quiz.title}</h3>
        <p>Questions: {quiz.nb_questions}</p>
        <p>Difficulty: {quiz.difficulty}</p>
      </div>
    </div>
  );
}