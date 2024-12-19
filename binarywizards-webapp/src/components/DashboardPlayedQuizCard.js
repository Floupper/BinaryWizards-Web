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
        .then(data => {
          if (data?.game_id) {
            navigate(`/question/${data.game_id}`);
          } else {
            toast.error('Game creation failed.');
          }
        })
        .catch(error => {
          toast.error('Error creating game:', error);
        });
    } else {
      navigate(`/question/${quiz.game_id}`);
    }
  };

  return (
    <div
      className="played-quiz-card p-6 bg-white rounded-3xl border-2 border-[#000000] cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-between w-[24rem] h-[28rem] m-3"
      onClick={handleCardClick}
    >
      <div className="quiz-title bg-white text-[#8B2DF1] border-2 border-[#8B2DF1] rounded-lg px-4 py-2 mb-3 text-center w-full">
        <h3 className="text-2xl font-bold truncate">{quiz.quiz_title}</h3>
      </div>
      <p className="text-lg mb-2 font-bold">
        Progress: {quiz.current_question_index}/{quiz.nb_questions_total}
      </p>
      <p className="text-lg mb-2 font-bold">Date: {formattedDate}</p>
      <div className="flex justify-end items-center w-full">
        {quiz.nb_questions_total === quiz.current_question_index ? (
          <MdReplay className="text-blue-500 text-2xl" />
        ) : (
          <FaPlay className="text-green-500 text-2xl" />
        )}
      </div>
    </div>
  );
}
