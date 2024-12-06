import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { MdReplay } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { createGameWithQuizId } from '../services/JoinQuizService';
import dayjs from 'dayjs';

export default function ResumGameCard({ quiz }) {
  const formattedDate = dayjs(quiz.date_game_creation).format("DD/MM/YYYY");
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (quiz.nb_questions_total === quiz.current_question_index) {
      createGameWithQuizId(quiz.quiz_id)
        .then((data) => navigate(`/question/${data.game_id}`))
        .catch((error) => console.error('Error creating game:', error));
    } else {
      return navigate(`/question/${quiz.game_id}`);
    }
  };

  return (
    <div
      className="w-full max-w-xl bg-white shadow-md rounded-lg p-4 cursor-pointer hover:bg-gray-100 mt-4"
      onClick={handleCardClick}
    >
      <div className="quiz-info flex items-center space-x-4 mt-4">
        <h3 className="text-lg font-semibold flex-1 truncate">
          Title: {quiz.title}
        </h3>
        <p className="text-sm text-gray-700">
          {quiz.current_question_index} / {quiz.nb_questions_total}
        </p>
        <p className="text-sm text-gray-700">
          Date: {formattedDate}
        </p>
        <p className="quiz-status">
          {quiz.nb_questions_total === quiz.current_question_index ? (
            <MdReplay className="text-xl text-gray-600" />
          ) : (
            <FaPlay className="text-xl text-gray-600" />
          )}
        </p>
      </div>
    </div>
  );
}
