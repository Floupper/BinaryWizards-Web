
import CreateQuizService from '../services/CreateQuizService';
import React, { useEffect, useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { MultipleChoiceQuestion, MultipleChoiceQuestion2 } from './CreateQuizQuestionEditingMultipleChoiceQuestion';
import BooleanChoiceQuestion from './CreateQuizQuestionEditingBooleanChoice';
import DifficultyQuizStars from './GlobalQuizDifficultyStars';

export default function CreateQuizzQuestion({ TypeOfScreen, setModalOpen, questionId, quizId, refreshQuizQuestions, resetCreateQuestionForm }) {


  const [selectedOptionInput, setSelectedOptionInput] = useState({
    type: 'boolean',
    choices: ['', '', '', ''],
    correctAnswerBoolean: 0,
    correctAnswerMultiple: 0
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('easy');
  const [difficulties, setDifficulties] = useState([]);
  const [difficulty, setDifficulty] = useState('');

  const [answerText, setAnswerText] = useState([]);
  const [responceIndex, setResponseIndex] = useState(null);

  const [questionData, setQuestionData] = useState();


  const [questionType, setQuestionType] = useState('boolean');
  const [questionOptions, setQuestionOptions] = useState();

  const [questionText, setQuestionText] = useState('Write your question');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (resetCreateQuestionForm) {
      setQuestionText('Write your question');  // Réinitialise le texte de la question
      setSelectedOptionInput({
        type: 'boolean',
        choices: ['', '', '', ''],
        correctAnswerBoolean: 0,
        correctAnswerMultiple: 0
      });  // Réinitialise les options de réponse
      setIsEditing(false);
      setQuestionData();
      setQuizDifficulty('easy');
      setSelectedCategory('');
    }
  }, [resetCreateQuestionForm]); // Le formulaire se réinitialise lorsque resetCreateQuestionForm est appelé


  useEffect(() => {

    CreateQuizService.fetchCategories()
      .then(data => setCategories(data))
      .catch(error => toast.info('Error fetching categories:', error));

    CreateQuizService.fetchDifficulties()
      .then(data => setDifficulties(data))
      .catch(error => toast.info('Error fetching difficulties:', error));

  }, []);

  useEffect(() => {
    if (questionId) {
      CreateQuizService.fetchQuestionDetails(quizId, questionId)
        .then(data => {
          setQuestionData(data.question);
          setQuestionOptions(data.question.options);
          setQuestionType(data.question.question_type);
          setQuestionText(data.question.question_text);
          setQuizDifficulty(data.question.question_difficulty);
          setSelectedCategory(data.question.question_category);

          setSelectedOptionInput((prevState) => {
            const isMultiple = data.question.question_type === 'multiple';


            const choices = isMultiple
              ? data.question.options.map((option) => option.option_text)
              : ['', '', '', ''];


            const correctAnswerBoolean = !isMultiple
              ? data.question.options.find((option) => option.is_correct_answer)?.option_text === 'True'
                ? 1
                : 0
              : null;

            return {
              ...prevState,
              type: data.question.question_type,
              choices: choices,
              correctAnswerMultiple: isMultiple
                ? data.question.options.findIndex((option) => option.is_correct_answer)
                : null,
              correctAnswerBoolean,
            };
          });
        })

        .catch(error => toast.info('Error fetching question details:', error));
    }
  }, [questionId]);

  const handleEditClick = () => setIsEditing(true);

  const handleBlur = () => {
    if (!questionText.trim()) {
      setQuestionText("Write your question"); // Remet le texte par défaut si vide
    }
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category.");
      return;
    }

    if (!questionText) {
      toast.error("Please enter a question.");
      return;

    }

    if (!quizDifficulty) {
      toast.error("Please select a difficulty.");
      return;
    }
    if (questionType === "multiple" && selectedOptionInput.choices.some(choice => !choice.trim())) {
      toast.error("Please ensure all choices are filled out.");
      return;
    }

    try {

      const options = [];

      if (questionType === 'boolean') {

        options.push(
          {
            option_text: "True",
            is_correct_answer: selectedOptionInput.correctAnswerBoolean === 1,
          },
          {
            option_text: "False",
            is_correct_answer: selectedOptionInput.correctAnswerBoolean === 0,
          }
        );
      } else if (questionType === 'multiple') {

        options.push(
          ...selectedOptionInput.choices.map((choice, index) => ({
            option_text: choice,
            is_correct_answer: selectedOptionInput.correctAnswerMultiple === index,
          }))
        );
      } else {
        throw new Error("Invalid question type");
      }

      const requestBody = {
        question_text: questionText,
        question_difficulty: quizDifficulty,
        question_category: selectedCategory,
        question_type: questionType,
        options: options,
      };



      const action = TypeOfScreen === "edit"
        ? CreateQuizService.updateQuestion
        : CreateQuizService.createQuestion;


      await action(requestBody, quizId, questionId);


      toast.success(
        `Question successfully ${TypeOfScreen ? "updated" : "created"}!`
      );
      refreshQuizQuestions();
    } catch (error) {

      toast.error(
        `Error ${TypeOfScreen ? "updating" : "creating"} question: ${error.message || "Unknown error"
        }`
      );

    }
  };

  const handleOnDifficultyChange = (newDifficulty) => {
    setQuizDifficulty(newDifficulty)

  };


  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md max-w-4xl mx-auto">
      {/* Editable Question */}
      <div className="text-center mb-6">
        {!isEditing ? (
          <h1
            className="text-2xl font-bold text-gray-800 cursor-pointer hover:underline"
            onClick={handleEditClick}
          >
            {questionText}
          </h1>
        ) : (
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none focus:ring-0 text-center w-full"
          />
        )}
      </div>

      {/* Options */}
      {questionType === "multiple" ? (
        <MultipleChoiceQuestion
          selectedOptionInput={selectedOptionInput}
          setSelectedOptionInput={setSelectedOptionInput}
        />
      ) : (
        <BooleanChoiceQuestion
          selectedOptionInput={selectedOptionInput}
          setSelectedOptionInput={setSelectedOptionInput}
        />
      )}

      {/* Actions */}
      <div className="flex justify-end mt-6 space-x-4">

        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Save Question
        </button>
      </div>

      {/* Question Type, Difficulty, Category in Horizontal Layout */}
      <div className="flex space-x-6 mt-6">
        {/* Question Type */}
        <div className="mb-6">
          <span className="block text-lg font-medium text-gray-700">Question Type</span>
          <div className="flex items-center mt-2 space-x-4">
            <button
              onClick={() => setQuestionType("boolean")}
              className={`px-4 py-2 rounded-md font-medium bg-white border-2 ${questionType === "boolean"
                ? "border-[#8B2DF1] text-gray-800 shadow-md shadow-[#8B2DF1] focus:ring-0 focus:outline-none"
                : "border-gray-300 text-gray-800 hover:bg-transparent hover:border-[#8B2DF1] hover:shadow-md hover:shadow-[#8B2DF1] hover:outline-none"
                }`}
            >
              True/False
            </button>

            <button
              onClick={() => setQuestionType("multiple")}
              className={`px-4 py-2 rounded-md font-medium bg-white border-2 ${questionType === "multiple"
                ? "border-[#8B2DF1] text-gray-800 shadow-md shadow-[#8B2DF1] focus:ring-0 focus:outline-none"
                : "border-gray-300 text-gray-800 hover:bg-transparent hover:border-[#8B2DF1] hover:shadow-md hover:shadow-[#8B2DF1] hover:outline-none"
                }`}
            >
              Multiple Choice
            </button>
          </div>

        </div>
        <a>|</a>

        {/* Difficulty Selection */}
        <div className="flex items-center mb-6 space-x-4">
          <label
            htmlFor="difficulty"
            className="block text-lg font-medium text-gray-700 whitespace-nowrap"
          >
            Difficulty question
          </label>

          <DifficultyQuizStars
            className="flex-grow"
            initialDifficulty={quizDifficulty}
            onDifficultyChange={handleOnDifficultyChange}
          />
        </div>
        <a>|</a>
        {/* Category Selection */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-lg font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
      </div >
    </div >

  );
};