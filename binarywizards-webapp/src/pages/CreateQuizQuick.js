import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateQuizService from '../services/CreateQuizService';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGameWithQuizId } from '../services/JoinQuizService';
import Navbar from '../components/Navbar';

export default function CreateQuizQuick() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [amount, setAmount] = useState(10);

  useEffect(() => {
    CreateQuizService.fetchCategories()
      .then(data => setCategories(data))
      .catch(error => toast.info('Error fetching categories:', error));

    CreateQuizService.fetchDifficulties()
      .then(data => setDifficulties(data))
      .catch(error => toast.info('Error fetching difficulties:', error));
  }, []);

  const handleSubmit = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.info('Please enter a valid number of questions (greater than 0).');
      return;
    }
    if (selectedCategory === '') {
      toast.info('Please select a category.');
      return;
    }

    if (difficulty === '') {
      toast.info('Please select a difficulty.');
      return;
    }

    let selectedCat = selectedCategory;
    if (selectedCat === '') {
      const randomIndex = Math.floor(Math.random() * categories.length);
      selectedCat = categories[randomIndex].id;
    }

    const quizData = {
      category: selectedCat,
      amount: Number(amount),
      difficulty,
    };
    CreateQuizService.createAnonymeQuiz(quizData)
      .then(data => {
        const quizId = data.quiz_id;
        createGameWithQuizId(quizId)
          .then(data => {
            const gameId = data.game_id;
            navigate(`/question/${gameId}`);
          })
      })
      .catch(error => {
        toast.info(error.message);
      });
  };

  const handleAmountInput = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
  };

  const handleKeyDown = (e) => {
    if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/backgrounds/CreateQuizCuickBackground.svg')" }}
    >
      <Navbar />
      <div className="flex flex-col items-center justify-center"
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <div className="bg-white bg-opacity-0 rounded-lg max-w-lg w-full p-8 space-y-6 text-center">
          <h1 className="text-4xl font-bold text-white font-mixed">Create a Quiz</h1>
          <form className="space-y-4">
            <div className="form-group">
              <label htmlFor="category" className="block text-sm font-medium text-white">Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(Number(e.target.value))}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="number" className="block text-sm font-medium text-white">Number of questions</label>
              <input
                type="number"
                id="number"
                value={amount}
                onInput={handleAmountInput}
                onKeyDown={handleKeyDown}
                placeholder="Enter the number of questions"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              />
            </div>
            <div className="form-group">
              <label htmlFor="difficulty" className="block text-sm font-medium text-white">Difficulty</label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="" disabled>
                  Select a difficulty
                </option>
                {difficulties.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300"
            >
              Start
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
