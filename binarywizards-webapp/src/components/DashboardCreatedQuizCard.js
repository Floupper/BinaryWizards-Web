import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createGameWithQuizId } from '../services/JoinQuizService';
import { toast } from 'react-toastify';

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
            toast.error('Game creation failed.');
          }
        })
        .catch(error => {
          toast.error('Error creating game:', error);
        });
    } else {
      navigate(route);
    }
  };

  return (
    <div className="created-quiz-card p-6 bg-white rounded-3xl border-2 border-[#000000] cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-between w-[24rem] h-[28rem] m-3" onClick={handleCardClick}>
      <div className="quiz-title bg-white text-[#8B2DF1] border-2 border-[#8B2DF1] rounded-lg px-4 py-2 mb-3 text-center w-full">
        <h3 className="text-2xl font-bold truncate">{quiz.title}</h3>
      </div>
      <p className="text-lg mb-2">Difficulty: {renderDifficultyStars(quiz.difficulty)}</p>
      <p className="text-lg mb-2">{quiz.total_questions} Questions</p>
      <div className="flex justify-end items-center w-full">
        <span className="text-yellow-500 text-2xl">⭐</span>
      </div>
    </div>
  );
}
