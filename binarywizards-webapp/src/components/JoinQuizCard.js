import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createGameWithQuizId } from '../services/JoinQuizService';

const renderDifficultyStars = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return '⭐';
    case 'medium':
      return '⭐⭐';
    case 'hard':
      return '⭐⭐⭐';
    default:
      return difficulty;
  }
};

export default function JoinQuizCard({ quiz, route }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (route === `/question/`) {
      createGameWithQuizId(quiz.quiz_id)
        .then(data => {
          if (data?.game_id) {
            navigate(`${route}${data.game_id}`); 
          } else {
            console.error('Game creation failed.');
          }
        })
        .catch(error => {
          console.error('Error creating game:', error);
        });
    } else {
      navigate(route);
    }
  };

  return (
    <div className="join-quiz-card p-2 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 flex items-center w-[40rem] h-[4rem] mb-5" onClick={handleCardClick}>
      <div className="quiz-info flex justify-between items-center w-full ">
          <h3 className="text-sm font-semibold text-black text-center break-all">{quiz.title}</h3>
          <p className="text-xs text-center">Difficulty: {renderDifficultyStars(quiz.difficulty)}</p>
          <p className="text-xs text-center">{quiz.nb_questions} Questions</p>
      </div>
    </div>
  );
}
