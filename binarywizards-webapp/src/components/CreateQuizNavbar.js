import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DifficultyQuizStars from './GlobalQuizDifficultyStars';
import { toast } from 'react-toastify';

export default function CreateQuizNavbar({ handleSubmitSave, quiz, setQuiz }) {
  const navigate = useNavigate();

  const handleOnDifficultyChange = (newDifficulty) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      difficulty: newDifficulty,
    }));
  };

  const handleChangeIsPublicQuiz = (event) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      isPublic: event.target.checked,
    }));
  };

  const handleChangeQuizTitle = (event) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      title: event.target.value,
    }));
  };

  const handleChangeQuizDescription = (event) => {
    setQuiz((prevQuiz) => ({
      ...prevQuiz,
      description: event.target.value,
    }));
  };

  const handleSaveQuiz = () => {
    handleSubmitSave();
  };

  const handleBlur = () => {
    if (!quiz.title.trim()) {
      toast.info('Title cannot be empty.');
    }
  };

  return (
    <nav className="flex flex-col items-center p-6 bg-white text-black m-4">
        <div>
            {/* Quiz Inputs */}
            <div className="flex flex-col sm:flex-row gap-x-5 items-center w-full sm:w-auto">
                {/* Title */}
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full sm:w-auto">
                <label htmlFor="quiz_title" className="text-lg font-medium">
                    Title
                </label>
                <input
                    id="quiz_title"
                    name="quiz_title"
                    value={quiz.title}
                    onChange={handleChangeQuizTitle}
                    onBlur={handleBlur}
                    placeholder="Enter quiz title"
                    className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-auto"
                />
                </div>

                {/* Difficulty */}
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full sm:w-auto">
                <label className="text-lg font-medium">Difficulty</label>
                <DifficultyQuizStars
                    initialDifficulty={quiz.difficulty}
                    onDifficultyChange={handleOnDifficultyChange}
                />
                </div>

                {/* Public Checkbox */}
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full sm:w-auto">
                <label htmlFor="quiz_checkbox" className="text-lg font-medium">
                    Public
                </label>
                <input
                    type="checkbox"
                    id="quiz_checkbox"
                    name="quiz_checkbox"
                    checked={quiz.isPublic || false}
                    onChange={handleChangeIsPublicQuiz}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                </div>

                {/* Description */}
                <div className="flex flex-col sm:flex-row items-center sm:space-x-4 w-full sm:w-auto">
                <label htmlFor="quiz_description" className="text-lg font-medium">
                    Description
                </label>
                <input
                    id="quiz_description"
                    name="quiz_description"
                    value={quiz.description}
                    onChange={handleChangeQuizDescription}
                    placeholder="Enter quiz description"
                    className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-auto"
                />
                </div>
            </div>
        </div>
        <div>
            {/* Menu Buttons */}
            <div className="flex items-center sm:space-x-4 space-y-4 sm:space-y-0 w-full sm:w-auto p-4">
                <button
                onClick={() => navigate('/')}
                className="text-black text-lg font-semibold px-6 py-2 bg-white border border-black rounded-lg hover:bg-black hover:text-white transition-colors duration-200"
                >
                Exit
                </button>
                <button
                onClick={handleSaveQuiz}
                className="text-white text-lg font-semibold px-6 py-2 bg-black border border-black rounded-lg hover:bg-white hover:text-black transition-colors duration-200"
                >
                Save
                </button>
            </div>
        </div>
    </nav>
  );
}