import React from 'react';
import { useState } from 'react';
import { MdReplay } from 'react-icons/md';
import { parseISO } from 'date-fns';
import TimeModal from './TimeModal';

export default function PlayedQuizCard({ quiz }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const date = new parseISO(quiz.date_game_creation);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePlayClick = () => { 
    setIsModalOpen(true);
  };

  return (
    <div className="created-quiz-card bg-white shadow-lg rounded-3xl border border-gray-200 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-between w-[18rem] h-[20rem] p-6 m-3">
      <div className="quiz-title bg-[#8B2DF1] text-white font-semibold rounded-lg px-4 py-2 mb-4 text-center w-full">
        <h3 className="text-2xl font-bold">{quiz.quiz_title}</h3>
      </div>
      <div className='flex flex-col h-full justify-center'>
        <p className="text-lg mb-4 text-gray-700">
          Date of creation: {date.toLocaleString()}
        </p>
        <p className="text-lg mb-4 text-gray-700">
          Progress: {quiz.current_question_index}/{quiz.nb_questions_total}
        </p>
        <p className="text-lg mb-4 text-gray-700">
          Score: {quiz.correct_answers_nb}/{quiz.nb_questions_total}
        </p>
      </div>
      <div className="flex justify-between items-center w-full mt-auto">
        <button
          onClick={handlePlayClick}
          className="text-3xl text-green-500 hover:text-green-700 transition-colors duration-200"
          title="Play Quiz"
        >
          <MdReplay />
        </button>
      </div>
      {isModalOpen && (
        <TimeModal closeModal={closeModal} quiz_id={quiz.quiz_id} />
      )}
    </div>
  );
}