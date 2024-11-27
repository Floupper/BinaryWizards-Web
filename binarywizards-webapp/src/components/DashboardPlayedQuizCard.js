import React from 'react';
import { FaPlay } from 'react-icons/fa';
import { MdReplay } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {createGameWithQuizId} from '../services/JoinQuizService';
import '../assets/PlayedQuizCard.css';

export default function PlayedQuizCard({ quiz }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    
    if (quiz.nb_questions_total === quiz.current_question_index) {
        createGameWithQuizId(quiz.quiz_id)
        .then(data => navigate(`/question/${data.game_id}`))
        .catch(error => console.error('Error creating game:', error));
    }
    else{
      return navigate(`/question/${quiz.game_id}`);
    }
  };

  return (
    <div className="played-quiz-card" onClick={handleCardClick}>
      <div className="quiz-info">
        <h3>Score: {quiz.correct_answers_nb}/{quiz.current_question_index}</h3>
        <p>Date: {new Date(quiz.date_game_creation).toLocaleDateString()}</p>
        <p>Quiz ID: {quiz.quiz_id}</p>
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