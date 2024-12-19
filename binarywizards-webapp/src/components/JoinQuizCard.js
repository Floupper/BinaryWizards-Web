import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TimeModal from "./TimeModal"; // Correct import name

const renderDifficultyStars = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "⭐";
    case "medium":
      return "⭐⭐";
    case "hard":
      return "⭐⭐⭐";
    default:
      return difficulty;
  }
};

export default function JoinQuizCard({ quiz, route }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (route === "/question/") {
      setIsModalOpen(true);
    } else {
      navigate(route);
    }
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={handleCardClick}
        className="join-quiz-card p-2 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 flex items-center w-[40rem] h-[4rem] mb-5"
        tabIndex="0"
      >
        <div className="quiz-info flex justify-between items-center w-full">
          <h3 className="text-sm font-semibold text-black text-center break-all">
            {quiz.title}
          </h3>
          <p className="text-xs text-center">
            Difficulty: {renderDifficultyStars(quiz.difficulty)}
          </p>
          <p className="text-xs text-center">{quiz.nb_questions} Questions</p>
        </div>
        
      </button>
      {isModalOpen && (
        <TimeModal
          closeModal={closeModal}
          route={route}
          quiz={quiz}
        />
      )}
    </div>
  );
}