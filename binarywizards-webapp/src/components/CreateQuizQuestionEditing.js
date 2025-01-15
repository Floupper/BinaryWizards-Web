import CreateQuizService from '../services/CreateQuizService';
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultipleChoiceQuestion } from './CreateQuizQuestionEditingMultipleChoiceQuestion';
import DifficultyQuizStars from './GlobalQuizDifficultyStars';

export default function CreateQuizzQuestion({ TypeOfScreen, questionId, quizId, refreshQuizQuestions, refreshQuizQuestionEditing, setRefreshQuizQuestions, handleSelectedQuestionAfterCreate }) {
  const [questionInfo, setQuestionInfo] = useState({
    questionText: 'Write your question',
    questionOptions: ["", "", "", ""],
    questionType: 'text',
    questionDifficulty: 'easy',
    questionCategory: '',
    questionCorrectAnswer: 0,
  });


  //Catégories disponibles
  const [categories, setCategories] = useState([]);
  //Si la question est une édition
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (refreshQuizQuestionEditing) {
      setRefreshQuizQuestions(false);


      setIsEditing(false);

      setQuestionInfo((prevState) => ({
        ...prevState,
        questionDifficulty: 'easy',
        questionCategory: '',
        questionText: 'Write your question',
        questionType: 'text',
        questionCorrectAnswer: 0,
        questionOptions: ["", "", "", ""],
      }));



    }
  }, [refreshQuizQuestionEditing]);
  useEffect(() => {
    CreateQuizService.fetchCategories()
      .then(data => setCategories(data))
      .catch(error => toast.info('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    if (!questionId) return;

    CreateQuizService.fetchQuestionDetails(quizId, questionId)
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


        // Mise à jour de questionInfo
        setQuestionInfo((prevState) => ({
          ...prevState,
          questionText: question.question_text,
          questionDifficulty: question.question_difficulty,
          questionCategory: question.question_category,
          questionType: question.question_type,
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
  }, [questionId]);



  const handleEditClick = () => setIsEditing(true);

  const handleBlur = () => {
    if (!questionInfo.questionText.trim()) {
      setQuestionInfo((prevState) => ({ ...prevState, questionText: 'Write your question' }));
    }
    setIsEditing(false);
  };




  //Submit de la question
  const handleSubmit = async () => {
    if (!questionInfo.questionCategory) {
      toast.error("Please select a category.");
      return;
    }
    if (!questionInfo.questionText) {
      toast.error("Please enter a question.");
      return;

    }
    if (!questionInfo.questionDifficulty) {
      toast.error("Please select a difficulty.");
      return;
    }
    if (questionInfo.questionOptions.some(choice => !choice || !choice.trim())) {
      toast.error("Please ensure all choices are filled out.");
      return;
    }

    try {
      const options = [];
      options.push(
        ...questionInfo.questionOptions.map((choice, index) => ({
          option_content: choice,
          is_correct_answer: questionInfo.questionCorrectAnswer === index,
          option_index: index,

        }))
      );

      const requestBody = {
        question_text: questionInfo.questionText,
        question_difficulty: questionInfo.questionDifficulty,
        question_category: questionInfo.questionCategory,
        question_type: questionInfo.questionType,
        options: options,
      };

      const action = TypeOfScreen === "edit"
        ? CreateQuizService.updateQuestion
        : CreateQuizService.createQuestion;

      const data = await action(requestBody, quizId, questionId);

      toast.success(
        `Question successfully ${TypeOfScreen ? "updated" : "created"}!`
      );
      handleSelectedQuestionAfterCreate(data.question_id);
      refreshQuizQuestions();
    } catch (error) {

      toast.error(
        `Error ${TypeOfScreen ? "updating" : "creating"} question: ${error.message || "Unknown error"
        }`
      );
    }
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
    <div>
      <div className="flex items-baseline justify-center space-x-6 mt-6">
        <span className=" text-2xl text-gray-500">|</span>
        {/* Difficulty Selection */}
        <div className="flex items-baseline space-x-4">
          <label htmlFor="difficulty" className="text-lg font-medium text-gray-700 whitespace-nowrap">
            Difficulty question
          </label>
          <DifficultyQuizStars
            className="flex-grow"
            initialDifficulty={questionInfo.questionDifficulty}
            onDifficultyChange={handleOnDifficultyChange}
          />
        </div>
        <span className="text-2xl text-gray-500">|</span>
        {/* Category Selection */}
        <div className="flex items-baseline space-x-4">
          <label htmlFor="category" className="text-lg font-medium text-gray-700 whitespace-nowrap">
            Category
          </label>
          <select
            id="category"
            value={questionInfo.questionCategory}
            onChange={(e) => setQuestionInfo((prevState) => ({ ...prevState, questionCategory: e.target.value }))}
            className="p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
        <span className="text-2xl text-gray-500">|</span>
        {/* Save Button */}
        <div>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Save Question
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-r to-[#377DC9] via-[#8A2BF2] from-[#E7DAB4] p-2 rounded-lg  ">
        <div className="flex flex-col flex-nowrap justify-center p-6 bg-cover bg-center bg-[#F4F2EE] rounded-lg shadow-md  h-[50vh] ">
          {/* Editable Question */}
          <div className="flex items-center items-center justify-center text-center mb-6">
            {!isEditing ? (
              <h1
                className="text-2xl font-semibold text-gray-800 cursor-pointer hover:underline "
                onClick={handleEditClick}
              >
                {questionInfo.questionText}
              </h1>
            ) : (
              <input
                type="text"
                value={questionInfo.questionText}
                onChange={(e) => setQuestionInfo((prevState) => ({ ...prevState, questionText: e.target.value }))}
                onBlur={handleBlur}
                autoFocus
                className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none focus:ring-0 text-center w-full"
              />
            )}
          </div>

          <div className="display:flex text-center justify-center">
            <button className='m-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 '
              onClick={() => handleOnTypeQuestionChange("text")}>Texte</button>

            <button className='m-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 '
              onClick={() => handleOnTypeQuestionChange("image")}>Image</button>

            <button className='m-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 '
              onClick={() => handleOnTypeQuestionChange("audio")}>Audio</button>
          </div>
          <div className="flex  justify-center">
            <MultipleChoiceQuestion

              questionInfo={questionInfo}
              setQuestionInfo={setQuestionInfo}
            />
          </div>
        </div >
      </div>
    </div >
  );
};