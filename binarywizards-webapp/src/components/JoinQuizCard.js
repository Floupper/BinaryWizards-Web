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

export default function JoinQuizCard({ quiz, route}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
          setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
  };

  return (
      <div>
          <button
              onClick={handleCardClick}
              className="p-2 bg-white rounded-xl cursor-pointer hover:bg-gray-100 flex items-center h-[4rem] mb-5 w-[30rem]"
          >
              <div className="quiz-info flex justify-between items-center w-full">
                  <h3 className="text-lg font-semibold">
                      {quiz.title}
                  </h3>
                  <p>
                      Difficulty: {renderDifficultyStars(quiz.difficulty)}
                  </p>
                  <p>{quiz.nb_questions} Questions</p>
              </div>
          </button>
          {isModalOpen && (
              <TimeModal closeModal={closeModal} quiz_id={quiz.quiz_id} />
          )}
      </div>
  );
}
