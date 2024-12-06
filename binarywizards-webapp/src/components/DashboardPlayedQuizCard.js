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
    }
    else {
      return navigate(`/question/${quiz.game_id}`);
    }
  };

  return (
    <div className="played-quiz-card" onClick={handleCardClick}>
      <div className="quiz-info">
        <h3>Title: {quiz.title}</h3>
        {quiz.current_question_index}/{quiz.nb_questions_total}
        <p>Date: {formattedDate}</p>
        <p className="quiz-status">
          {quiz.nb_questions_total === quiz.current_question_index ? (
            <MdReplay className="quiz-icon" />
          ) : (
            <FaPlay className="quiz-icon" />
          )}
        </p>
      </div>
    </div>
  );
}