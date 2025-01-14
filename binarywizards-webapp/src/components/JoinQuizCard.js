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

export default function JoinQuizCard({ quiz, enableModal, onQuizSelect }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
      if (enableModal) {
          setIsModalOpen(true);
      } else if (onQuizSelect) {
          onQuizSelect(quiz);
      }
  };

  const closeModal = () => {
      setIsModalOpen(false);
  };

  return (
      <div className="w-full max-w-[30rem] mx-auto">
          <button
              onClick={handleCardClick}
              className="join-quiz-card p-4 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 flex items-center w-full h-auto mb-5 transition-all duration-200"
              tabIndex="0"
          >
              <div className="quiz-info flex flex-col sm:flex-row justify-between items-center w-full space-y-2 sm:space-y-0 sm:space-x-4">
                  <h3 className="text-sm font-semibold text-black text-center break-all sm:text-left">
                      {quiz.title}
                  </h3>
                  <p className="text-xs text-center sm:text-left">
                      Difficulty: {renderDifficultyStars(quiz.difficulty)}
                  </p>
                  <p className="text-xs text-center sm:text-left">{quiz.nb_questions} Questions</p>
              </div>
          </button>
          {isModalOpen && enableModal && (
              <TimeModal closeModal={closeModal} quiz={quiz} />
          )}
      </div>
  );
}