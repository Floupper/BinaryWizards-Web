import CreateQuizService from '../services/CreateQuizService';
import React, { useEffect, useState } from 'react';
import DifficultyQuizStars from './GlobalQuizDifficultyStars';
import { toast } from "react-toastify";

// Component showed when the user wants to import questions from the trivia API
export default function ImportQuestionTrivia({ setTrivialModalOpen, quizId, refreshQuizQuestions }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulties, setDifficulties] = useState([]);
  const [difficulty, setDifficulty] = useState('easy');
  const [amount, setAmount] = useState(10);
  const [isDisabled, setIsDisabled] = useState(false);

  // Fetch categories and difficulties when component mounts
  useEffect(() => {
    const fetchCategoriesAndDifficulties = async () => {
      try {
        const fetchedCategories = await CreateQuizService.fetchCategories();
        setCategories(fetchedCategories);

        const fetchedDifficulties = await CreateQuizService.fetchDifficulties();
        setDifficulties(fetchedDifficulties);
      } catch (error) {
        toast.error('Failed to fetch categories or difficulties');
      }
    };

    fetchCategoriesAndDifficulties();
  }, []);

  // Handle input of the number of questions
  const handleAmountInput = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
  };

  // Prevent non-numeric input
  const handleKeyDown = (e) => {
    if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };

  // Handle category selection
  const handleCategoryChange = (event) => {
    setSelectedCategory(parseInt(event.target.value, 10));
  };

  // Submit the form to import questions
  const handleSubmitImport = () => {
    // Validate the amount
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.info('Please enter a valid number of questions (greater than 0).');
      return;
    }

    // Validate category selection
    if (selectedCategory === '') {
      toast.info('Please select a category.');
      return;
    }

    // Validate difficulty selection
    if (difficulty === '') {
      toast.info('Please select a difficulty.');
      return;
    }

    setIsDisabled(true);

    const triviaData = {
      amount: parseInt(amount, 10),
      difficulty: difficulty,
      category: selectedCategory,
    };

    // Call API to import the questions
    CreateQuizService.importQuestionTrivia(triviaData, quizId)
      .then(() => {
        refreshQuizQuestions();
        toast.success("Questions imported successfully!");
        setTrivialModalOpen(false);
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`);
        setIsDisabled(false);
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="bg-white w-[50vh] rounded-lg p-6 shadow-lg z-10">
        <div className="flex flex-row-reverse items-center justify-around">
          <button
            onClick={() => setTrivialModalOpen(false)}
            className="text-black text-l hover:bg-transparent bg-gray-200"
          >
            <span className="text-3xl">×</span>
          </button>
          <div className="text-center text-2xl font-bold text-purple-700 mb-4 pr-4">
            Import generated questions into your quiz
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="number" className="block text-lg font-medium text-gray-700">Number of questions</label>
          <input
            type="number"
            id="number"
            value={amount}
            onInput={handleAmountInput}
            onKeyDown={handleKeyDown}
            placeholder="Enter the number of questions"
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="difficulty" className="text-lg font-medium text-gray-700 whitespace-nowrap">
            Difficulty question
          </label>
          <DifficultyQuizStars
            className="flex-grow"
            initialDifficulty={difficulty}
            onDifficultyChange={(newDifficulty) => setDifficulty(newDifficulty)}
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            disabled={isDisabled}
            onClick={handleSubmitImport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            Import Questions
          </button>
        </div>
      </div>
    </div>
  );
}