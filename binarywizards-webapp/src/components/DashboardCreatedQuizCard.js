import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/CreatedQuizCard.css';
import { createGameWithQuizId } from '../services/JoinQuizService';

export default function CreatedQuizCard({ quiz, route }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (route === `/question/`) {
      createGameWithQuizId(quiz.quiz_id)
        .then(data => {
          // Assurez-vous que la réponse de createGameWithQuizId contient bien game_id
          if (data?.game_id) {
            navigate(`${route}${data.game_id}`); // Forme l'URL complète avec game_id
          } else {
            console.error('Game creation failed.');
          }
        })
        .catch(error => {
          console.error('Error creating game:', error);
        });
    } else {
      navigate(route); // Navigation vers une autre route si ce n'est pas /question/
    }
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