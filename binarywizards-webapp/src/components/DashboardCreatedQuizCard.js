import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TimeModal from './TimeModal';
import { FaPlay, FaInfo } from 'react-icons/fa';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePlayClick = () => {
    setIsModalOpen(true);
  };

  const handleInfoClick = () => {
    navigate(route);
  };

  return (
    <div className="created-quiz-card bg-white shadow-lg rounded-3xl border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-between w-[16rem] h-[18rem] p-6 m-3">
      <div className="quiz-title bg-[#8B2DF1] text-white font-semibold rounded-lg px-4 py-2 mb-4 text-center w-full">
        <h3 className="text-2xl font-semibold">{quiz.title}</h3>
      </div>
      <div className='flex flex-col h-full justify-center'>
        <p className="text-lg mb-2 text-gray-700">
          Difficulty: <span>{renderDifficultyStars(quiz.difficulty)}</span>
        </p>
        <p className="text-lg mb-4 text-gray-700">{quiz.total_questions} Questions</p>
      </div>
      <div className="flex justify-between items-center w-full mt-auto">
        <button
          onClick={handleInfoClick}
          className="text-3xl text-blue-500 hover:text-blue-700 transition-colors duration-200"
          title="More Info"
        >
          <FaInfo />
        </button>
        {quiz.is_public ? (
          <button
          onClick={handlePlayClick}
          className="text-3xl hover:text-green-700 transition-colors duration-200"
          title="Play Quiz"
          >
            <FaPlay />
          </button>
        ) : null}
      </div>
      {isModalOpen && (
        <TimeModal closeModal={closeModal} quiz_id={quiz.id} />
      )}
    </div>
  );
}