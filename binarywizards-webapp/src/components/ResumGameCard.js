import React from 'react';
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
      <div className="quiz-info flex flex-col sm:flex-row items-start sm:items-center sm:space-x-4 mt-4">
        <h3 className="text-lg font-semibold truncate w-full sm:w-1/2">
          Title: {quiz.title}
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-1/2">
          <p className="text-sm text-gray-700">
            {quiz.current_question_index} / {quiz.nb_questions_total}
          </p>
          <p className="text-sm text-gray-700">
            Date: {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
}