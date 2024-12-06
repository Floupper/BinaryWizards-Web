import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { MdReplay } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { createGameWithQuizId } from '../services/JoinQuizService';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export default function PlayedQuizCard({ quiz }) {
  const formattedDate = dayjs(quiz.date_game_creation).format("DD/MM/YYYY");
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (quiz.nb_questions_total === quiz.current_question_index) {
      createGameWithQuizId(quiz.quiz_id)
        .then(data => navigate(`/question/${data.game_id}`))
        .catch(error => toast.error('Error creating game:', error));
    } else {
      return navigate(`/question/${quiz.game_id}`);
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition duration-300"
      onClick={handleCardClick}
    >
      <div className="flex flex-col items-start">
        <h3 className="text-lg font-semibold mb-2">Title: {quiz.quiz_title}</h3>
        <p className="text-sm text-gray-700 mb-1">
          {quiz.current_question_index}/{quiz.nb_questions_total}
        </p>
        <p className="text-sm text-gray-600 mb-4">Date: {formattedDate}</p>
        <p className="text-xl text-gray-800">
          {quiz.nb_questions_total === quiz.current_question_index ? (
            <MdReplay className="inline-block text-blue-500" />
          ) : (
            <FaPlay className="inline-block text-green-500" />
          )}
        </p>
      </div>
    </div>
  );
}
