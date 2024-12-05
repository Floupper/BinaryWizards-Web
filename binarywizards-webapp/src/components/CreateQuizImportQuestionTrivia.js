
import CreateQuizService from '../services/CreateQuizService';
import React, { useEffect, useState } from 'react';

import { toast } from "react-toastify";

//Component showed when the user wants to import questions from the trivia API
export default function ImportQuestionTrivia({ setTrivialModalOpen, quizId, refreshQuizQuestions }) {
  //stock the categories fetched from the API
  const [categories, setCategories] = useState([]);
  //contain the selected category (locally) by the user. It will be sent to the API one the button validate is pressed
  const [selectedCategory, setSelectedCategory] = useState('');
  //stock the difficulties fetched from the API
  const [difficulties, setDifficulties] = useState([]);
  // contain the selected difficulty (locally) by the user. It will be sent to the API one the button validate is pressed
  const [difficulty, setDifficulty] = useState('');
  //Amount of questions to import
  const [amount, setAmount] = useState(10);

  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {

    CreateQuizService.fetchCategories()
      .then(data => setCategories(data))
    // .catch(error => toast.info('Error fetching categories:', error));

    CreateQuizService.fetchDifficulties()
      .then(data => setDifficulties(data))
    //  .catch(error => toast.info('Error fetching difficulties:', error));

  }, []);

  //Function to handle the input of the amount of questions
  const handleAmountInput = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
  };

  //Function to prevent the user to enter anything else than a number
  const handleKeyDown = (e) => {
    if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };

  //Function to handle the change of the category
  const handleCategoryChange = (event) => {
    setSelectedCategory(parseInt(event.target.value, 10));
  };

  //Function to handle the submit of the form
  const handleSubmitImport = () => {

    //Check if the amount is a number and is greater than 0
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.info('Please enter a valid number of questions (greater than 0).');
      return;
    }
    //Check if the category is selected
    if (selectedCategory === '') {
      toast.info('Please select a category.');
      return;
    }
    // Check if the difficulty is selected
    if (difficulty === '') {
      toast.info('Please select a difficulty.');
      return;
    }

    setIsDisabled(true);


    //Data to send to the API
    const triviaData = {
      amount: parseInt(amount, 10),
      difficulty: difficulty,
      category: selectedCategory,
    };


    //Call the API to import the questions
    CreateQuizService.importQuestionTrivia(triviaData, quizId)
      .then(() => {
        refreshQuizQuestions();
        toast.info("Questions imported successfully!")
        setTrivialModalOpen(false);
      })
      .catch((error) => {
        toast.info(error.message);
        setIsDisabled(false);
      });

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-50">
      {/* Background overlay (optional) */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Modal container */}
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg z-10">
        <div className="text-center text-2xl font-bold text-purple-700 mb-4">
          Import generated questions into your quiz
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-lg font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
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
          <label htmlFor="difficulty" className="block text-lg font-medium text-gray-700">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
            <option value="" disabled>Select a difficulty</option>
            {difficulties.map((level) => (
              <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-between items-center">
          <button
            disabled={isDisabled}
            onClick={handleSubmitImport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300">
            Import Questions
          </button>
          <button
            onClick={() => setTrivialModalOpen(false)}
            className="text-gray-600 hover:text-gray-800">
            <span className="text-xl">&times;</span>
          </button>
        </div>
      </div>
    </div>
  );
}