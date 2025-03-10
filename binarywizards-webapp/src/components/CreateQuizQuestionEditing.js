import CreateQuizService from '../services/CreateQuizService';
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultipleChoiceQuestion } from './CreateQuizQuestionEditingMultipleChoiceQuestion';
import DifficultyQuizStars from './GlobalQuizDifficultyStars';

export default function CreateQuizzQuestion({ reloadQuestionInfo, setReloadQuestionInfo,

  questionInfo, setQuestionInfo,
  quizId }) {

  const [categories, setCategories] = useState([]);


  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    CreateQuizService.fetchCategories()
      .then(data => setCategories(data))
      .catch(error => toast.info('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    if (!reloadQuestionInfo) return;
    setReloadQuestionInfo(false);


    if (!questionInfo.isEditing && questionInfo.questionId) {

      CreateQuizService.fetchQuestionDetails(quizId, questionInfo.questionId)
        .then((data) => {

          const question = data.question;
          if (!question) {
            toast.error('Error: Question not found.');
            return;
          }
          if (!question.options || !Array.isArray(question.options)) {
            toast.error('Error: Question options are missing or invalid.');
            return;
          }
          setQuestionInfo((prevState) => ({
            ...prevState,
            questionText: question.question_text,
            questionDifficulty: question.question_difficulty,
            questionCategory: question.question_category,
            questionType: question.question_type,
            questionId: question.question_id,

          }));

          setQuestionInfo((prevState) => {
            const questionOptions = question.options.map((option) => option.option_content || "");
            const questionCorrectAnswer = question.options.findIndex((option) => option.is_correct_answer) || 0;
            return {
              ...prevState,
              questionCorrectAnswer: questionCorrectAnswer,
              questionOptions: questionOptions,
            }
          });

        })
        .catch((error) => {
          console.error('Error fetching question details:', error);
          toast.error('An error occurred while fetching question details.');
        });
    }
  }, [reloadQuestionInfo]);

  const handleEditClick = () => setIsEditing(true);

  const handleBlur = () => {
    if (!questionInfo.questionText.trim()) {
      setQuestionInfo((prevState) => ({ ...prevState, questionText: 'Write your question' }));
    }
    setIsEditing(false);
  };

  const handleOnDifficultyChange = (newDifficulty) => {
    setQuestionInfo((prevState) => ({ ...prevState, questionDifficulty: newDifficulty }));

  };

  const handleOnTypeQuestionChange = (newType) => {
    setQuestionInfo((prevState) => ({
      ...prevState, questionType: newType,
      questionOptions: prevState.questionOptions.map(() => (""))
    }));

  };

  return (
    <div className="p-4">
      <div className="bg-gradient-to-r to-[#377DC9] via-[#8A2BF2] from-[#E7DAB4] p-4 md:m-4 rounded-lg">
        <div className="flex flex-col justify-center p-4 sm:p-8 lg:p-12 bg-cover bg-center bg-[#F4F2EE] rounded-lg shadow-md h-full lg:h-[60vh]">
          {/* Question Title */}
          <div className="flex items-center justify-center text-center mb-6">
            {!isEditing ? (
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 cursor-pointer hover:underline"
                onClick={handleEditClick}
              >
                {questionInfo.questionText}
              </h1>
            ) : (
              <input
                type="text"
                value={questionInfo.questionText}
                onChange={(e) =>
                  setQuestionInfo((prevState) => ({
                    ...prevState,
                    questionText: e.target.value,
                  }))
                }
                onBlur={handleBlur}
                autoFocus
                className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none focus:ring-0 text-center w-full"
              />
            )}
          </div>
  
          {/* Question Type Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              className={`px-4 py-2 text-sm sm:text-base bg-white hover:text-white hover:bg-[#8B2DF1] rounded-lg ${
                questionInfo.questionType === "text" ? "border-2 border-[#8B2DF1]" : ""
              }`}
              onClick={() => handleOnTypeQuestionChange("text")}
            >
              Texte
            </button>
            <button
              className={`px-4 py-2 text-sm sm:text-base bg-white hover:text-white hover:bg-[#8B2DF1] rounded-lg ${
                questionInfo.questionType === "image" ? "border-2 border-[#8B2DF1]" : ""
              }`}
              onClick={() => handleOnTypeQuestionChange("image")}
            >
              Image
            </button>
            <button
              className={`px-4 py-2 text-sm sm:text-base bg-white hover:text-white hover:bg-[#8B2DF1] rounded-lg ${
                questionInfo.questionType === "audio" ? "border-2 border-[#8B2DF1]" : ""
              }`}
              onClick={() => handleOnTypeQuestionChange("audio")}
            >
              Audio
            </button>
          </div>
  
          {/* Multiple Choice Question */}
          <div className="flex overflow-auto justify-center max-h-64">
            <MultipleChoiceQuestion
              questionInfo={questionInfo}
              setQuestionInfo={setQuestionInfo}
            />
          </div>
  
          {/* Difficulty and Category */}
          <div className="pt-8">
            <div className="flex flex-col sm:flex-row items-center sm:justify-center gap-4">
              {/* Difficulty */}
              <div className="flex items-baseline space-x-2">
                <label htmlFor="difficulty" className="text-sm sm:text-lg font-medium text-gray-700">
                  Difficulty
                </label>
                <DifficultyQuizStars
                  className="flex-grow"
                  initialDifficulty={questionInfo.questionDifficulty}
                  onDifficultyChange={handleOnDifficultyChange}
                />
              </div>
  
              <span className="hidden sm:inline-block text-2xl text-gray-500">|</span>
  
              {/* Category */}
              <div className="flex flex-col md:flex-row items-baseline space-x-2">
                <label htmlFor="category" className="text-sm sm:text-lg font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  value={questionInfo.questionCategory}
                  onChange={(e) =>
                    setQuestionInfo((prevState) => ({
                      ...prevState,
                      questionCategory: e.target.value,
                    }))
                  }
                  className="p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};