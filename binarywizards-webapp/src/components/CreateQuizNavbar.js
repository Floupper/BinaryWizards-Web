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
    <nav className="flex flex-wrap items-center justify-between py-4 px-4 bg-white text-black mx-2 border-2 rounded-2xl border-[#8A2BF2] gap-4">
      {/* Left Section */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto">
        {/* Title Input */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 w-full sm:w-auto">
          <label htmlFor="quiz_title" className="text-lg font-medium">
            Title
          </label>
          <input
            id="quiz_title"
            name="quiz_title"
            value={quiz.title}
            onChange={handleChangeQuizTitle}
            onBlur={handleBlur}
            placeholder="Quiz title"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-auto"
          />
        </div>
  
        {/* Description Input */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 w-full sm:w-auto">
          <label htmlFor="quiz_description" className="text-lg font-medium">
            Description
          </label>
          <input
            id="quiz_description"
            name="quiz_description"
            value={quiz.description}
            onChange={handleChangeQuizDescription}
            placeholder="Quiz description"
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-auto"
          />
        </div>
      </div>
  
      {/* Right Section */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 w-full sm:w-auto">
        {/* Difficulty Selector */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 w-full sm:w-auto">
          <label className="text-lg font-medium">Difficulty</label>
          <DifficultyQuizStars
            initialDifficulty={quiz.difficulty}
            onDifficultyChange={handleOnDifficultyChange}
          />
        </div>
  
        {/* Separator */}
        <span className="hidden sm:block text-4xl">|</span>
  
        {/* Public Checkbox */}
        <div className="flex flex-col sm:flex-row items-center sm:space-x-2 w-full sm:w-auto">
          <label htmlFor="quiz_checkbox" className="text-lg font-medium">
            Publish
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
  
        {/* Separator */}
        <span className="hidden sm:block text-4xl">|</span>
  
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate('/')}
            className="text-black text-lg font-semibold px-6 py-2 bg-white border-white rounded-3xl border hover:border-black transition-colors duration-200 w-full sm:w-auto"
          >
            Exit
          </button>
  
          <button
            onClick={handleSaveQuiz}
            className="text-white text-lg font-semibold px-6 py-2 bg-[#8B2DF1] rounded-3xl hover:bg-[#6214B6] transition-colors duration-200 w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
    </nav>
  );
}