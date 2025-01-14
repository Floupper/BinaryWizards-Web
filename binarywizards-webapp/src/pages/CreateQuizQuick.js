import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateQuizService from '../services/CreateQuizService';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGameWithQuizId } from '../services/JoinQuizService';
import Navbar from '../components/Navbar';

export default function CreateQuizQuick() {
  const navigate = useNavigate();
  const [isTimeCheck, setIsTimeCheck] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState("none");
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [amount, setAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const timers = [
    { value: "easy", label: "30s", color: "bg-green-200" },
    { value: "medium", label: "15s", color: "bg-yellow-200" },
    { value: "hard", label: "5s", color: "bg-red-200" },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const categories = await CreateQuizService.fetchCategories();
        setCategories(categories);

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
          <h1 className="text-3xl sm:text-4xl font-bold text-black">Quick Quiz</h1>
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
            <div>
              <div
                onClick={() => setIsTimeCheck(!isTimeCheck)}
                className={`flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-xl border-2 transition-all duration-200 ease-in-out ${
                  isTimeCheck ? "bg-blue-500 border-blue-500 text-white" : "bg-gray-200 border-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    isTimeCheck ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"
                  } flex justify-center items-center`}
                >
                  {isTimeCheck && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span>Time</span>
              </div>
              {isTimeCheck && (
                <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 mt-4">
                  <h2 className="font-bold mb-4 text-center">Select a Timer</h2>
                  <div className="flex justify-around items-center mb-6">
                    {timers.map((timer) => (
                      <button
                        key={timer.value}
                        type="button"
                        onClick={() => handleSetTimer(timer.value)}
                        className={`w-20 h-20 rounded-lg flex items-center justify-center text-lg font-medium ${timer.color} ${
                          selectedTimer === timer.value
                            ? "ring-4 ring-offset-2 ring-red-500 ring-offset-white"
                            : "border border-gray-300"
                        }`}
                      >
                        {timer.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className={`w-full bg-black text-white py-2 rounded-md transition duration-300 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Loading...
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