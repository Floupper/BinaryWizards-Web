import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createGameWithQuizId } from '../services/JoinQuizService';

export const renderDifficultyStars = (difficulty) => {
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

export default function CreatedQuizCard({ quiz, route }) {
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
    <div className="created-quiz-card p-4 bg-white border-2 border-gray-300 rounded-[32px] cursor-pointer hover:bg-gray-100 w-[90rem] h-[10.063rem] flex items-end" onClick={handleCardClick}>
      <div className="quiz-info flex items-end justify-between w-full h-full">
        <div className="flex quiz-title bg-white/50 rounded-[32px] p-2 border-2 border-black w-[25%] h-full items-center justify-center">
          <h3 className="text-lg font-bold text-black text-center break-all">Title: {quiz.title}</h3>
        </div>
        <p className="text-sm">Difficulty: {renderDifficultyStars(quiz.difficulty)}</p>
        <p className="text-sm"> {quiz.nb_questions} Questions</p>
      </div>
    </div>
  );
}
