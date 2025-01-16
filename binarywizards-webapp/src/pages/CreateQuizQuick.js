import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateQuizService from '../services/CreateQuizService';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGameWithQuizId } from '../services/JoinQuizService';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

export default function CreateQuizQuick() {
  const navigate = useNavigate();
  const [selectedTimer, setSelectedTimer] = useState("none");
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [amount, setAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const timers = [
    { value: "none", label: "None", color: "bg-gray-200" },
    { value: "easy", label: "30s", color: "bg-green-200" },
    { value: "medium", label: "15s", color: "bg-yellow-200" },
    { value: "hard", label: "5s", color: "bg-red-200" },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const categories = await CreateQuizService.fetchCategories();
        setCategories(categories);
        handleSetTimer("none");
        const difficulties = await CreateQuizService.fetchDifficulties();
        setDifficulties(difficulties);
      } catch (error) {
        toast.error("Error fetching data. Please try again.");
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.info('Please enter a valid number of questions (greater than 0).');
      return;
    }
    if (!selectedCategory) {
      toast.info('Please select a category.');
      return;
    }
    if (!difficulty) {
      toast.info('Please select a difficulty.');
      return;
    }

    setIsLoading(true);

    try {
      const quizData = {
        category: Number(selectedCategory),
        amount: Number(amount),
        difficulty,
      };

      const data = await CreateQuizService.createAnonymeQuiz(quizData);
      const quizId = data.quiz_id;
      const gameData = await createGameWithQuizId(quizId, selectedTimer);
      const gameId = gameData.game_id;
      navigate(`/question/${gameId}`);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountInput = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
  };

  const handleSetTimer = (value) => {
    setSelectedTimer(value);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/backgrounds/CreateQuizCuickBackground.svg')" }}
    >
      <Navbar />
      <div
        className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-1 lg:px-4"
      >
        <div className="bg-white rounded-lg p-8 space-y-6 text-center w-[150%] lg:w-full">
          <h1 className="text-3xl sm:text-4xl font-semibold text-black">Quick Quiz</h1>
          <form className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-black">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="number" className="block text-sm font-medium text-black">
                Number of questions
              </label>
              <input
                type="number"
                id="number"
                value={amount}
                onInput={handleAmountInput}
                placeholder="Enter the number of questions"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
              />
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-black">
                Difficulty
              </label>
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
            <div className="">
              <h2 className="font-semibold mb-4 text-center">Select a Timer</h2>
              <div className="flex items-center mb-6">
                {timers.map((timer) => (
                  <button
                    key={timer.value}
                    type="button"
                    onClick={() => handleSetTimer(timer.value)}
                    className={`w-full h-20 rounded-lg mx-2 flex items-center justify-center text-lg font-medium ${timer.color} ${selectedTimer === timer.value
                        ? "ring-4 ring-offset-2 ring-red-500 ring-offset-white"
                        : "border border-gray-300"
                      }`}
                  >
                    {timer.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className={`w-full bg-black text-white py-2 rounded-md transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                  <span>Loading...</span>
                </div>
              ) : (
                'Start'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}