import CreateQuizService from '../services/CreateQuizService';
import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MultipleChoiceQuestion } from './CreateQuizQuestionEditingMultipleChoiceQuestion';
import DifficultyQuizStars from './GlobalQuizDifficultyStars';

export default function CreateQuizzQuestion({ TypeOfScreen, questionId, quizId, refreshQuizQuestions, refreshQuizQuestionEditing, setRefreshQuizQuestions, handleSelectedQuestionAfterCreate }) {
  const [selectedOptionInput, setSelectedOptionInput] = useState({
    type: 'boolean',
    choices: [{ type: "text", content: "" }, { type: "text", content: "" }, { type: "text", content: "" }, { type: "text", content: "" }],
    type_of_question: 'text',
    correctAnswerBoolean: 0,
    correctAnswerMultiple: 0
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('easy');
  const [difficulties, setDifficulties] = useState([]);
  const [questionData, setQuestionData] = useState();
  const questionType = 'multiple';
  const [questionOptions, setQuestionOptions] = useState();
  const [questionText, setQuestionText] = useState('Write your question');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (refreshQuizQuestionEditing) {
      setRefreshQuizQuestions(false);

      setQuestionText('Write your question');
      setSelectedOptionInput({
        type: 'boolean',
        choices: [{ type: "text", content: "" }, { type: "text", content: "" }, { type: "text", content: "" }, { type: "text", content: "" }],
        correctAnswerBoolean: 0,
        correctAnswerMultiple: 0
      });
      setIsEditing(false);
      setQuestionData();
      setQuizDifficulty('easy');
      setSelectedCategory('');

    }
  }, [refreshQuizQuestionEditing]);


  useEffect(() => {

    CreateQuizService.fetchCategories()
      .then(data => setCategories(data))
      .catch(error => toast.info('Error fetching categories:', error));

    CreateQuizService.fetchDifficulties()
      .then(data => setDifficulties(data))
      .catch(error => toast.info('Error fetching difficulties:', error));

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

        setQuestionData(question);
        setQuestionOptions(question.options);
        setQuestionText(question.question_text);
        setQuizDifficulty(question.question_difficulty);
        setSelectedCategory(question.question_category);

        setSelectedOptionInput((prevState) => {
          const isMultiple = question.question_type === 'multiple';

          const choices = isMultiple
            ? question.options.map((option) => ({
              type: option.option_content?.type || 'text',
              content: option.option_content?.content || '',
            }))
            : [
              { type: 'text', content: '' },
              { type: 'text', content: '' },
              { type: 'text', content: '' },
              { type: 'text', content: '' },
            ];

          const correctAnswerBoolean = !isMultiple
            ? question.options.find((option) => option.is_correct_answer)?.option_content?.content === 'True'
              ? 1
              : 0
            : null;

          const correctAnswerMultiple = isMultiple
            ? question.options.findIndex((option) => option.is_correct_answer)
            : null;

          console.log(
            'correctAnswerMultiple',
            question.question_type,
            choices,
            correctAnswerMultiple,
            correctAnswerBoolean
          );

          return {
            ...prevState,
            type: question.question_type,
            choices,
            type_of_question: choices[0].type || 'text',
            correctAnswerMultiple,
            correctAnswerBoolean,
          };
        });
      })
      .catch((error) => {
        console.error('Error fetching question details:', error);
        toast.error('An error occurred while fetching question details.');
      });
  }, [questionId]);


  const handleEditClick = () => setIsEditing(true);

  const handleBlur = () => {
    if (!questionText.trim()) {
      setQuestionText("Write your question");
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
    if (
      questionType === "multiple" &&
      selectedOptionInput.choices.some(choice => !choice.content || !choice.content.trim())
    ) {
      toast.error("Please ensure all choices are filled out.");
      return;
    }
    try {
      const options = [];
        options.push(

          ...selectedOptionInput.choices.map((choice, index) => ({
            option_content: {
              type: choice.type,
              content: choice.content
            },
            is_correct_answer: selectedOptionInput.correctAnswerMultiple === index,
            option_index: index
          }))
        );

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
    setQuizDifficulty(newDifficulty)

  };

  const handleOnTypeQuestionChange = (newType) => {
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      choices: prevState.choices.map(() => ({ type: newType, content: "" })),
      type_of_question: newType,
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
            initialDifficulty={quizDifficulty}
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
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
      <div className="bg-gradient-to-r from-orange-400 to-green-400 p-2 rounded-lg  ">
        <div className="flex flex-col flex-nowrap justify-center p-6 bg-cover bg-center bg-[#F4F2EE] rounded-lg shadow-md  h-[50vh] ">
          {/* Editable Question */}
          <div className="flex items-center items-center justify-center text-center mb-6">
            {!isEditing ? (
              <h1
                className="text-2xl font-bold text-gray-800 cursor-pointer hover:underline "
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
          {questionType === "multiple" ? (
            <div className="display:flex text-center justify-center">
              <button className='m-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 '
                onClick={() => handleOnTypeQuestionChange("text")}>Texte</button>

              <button className='m-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 '
                onClick={() => handleOnTypeQuestionChange("image")}>Image</button>

              <button className='m-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 '
                onClick={() => handleOnTypeQuestionChange("audio")}>Audio</button>
            </div>
          ) : (<></>)}
          {/* Options */}
          <div className="flex  justify-center">
              <MultipleChoiceQuestion
                selectedOptionInput={selectedOptionInput}
                setSelectedOptionInput={setSelectedOptionInput}
              />
          </div>
        </div >
      </div>
    </div >
  );
};