import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/CreateQuiz.css';
import CreateQuizService from '../services/CreateQuizService';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoinQuiz from './JoinQuiz';
import { createGameWithQuizId } from '../services/JoinQuizService';

/*
Create a quiz as in V0 (when not logged in)
Thsi is the old create quiz page
*/
export default function CreateQuizQuick() {
  const navigate = useNavigate();
  //List of categories
  const [categories, setCategories] = useState([]);
  //List of difficulties
  const [difficulties, setDifficulties] = useState([]);

  //Selected category on the page
  const [selectedCategory, setSelectedCategory] = useState('');

  //Difficulty selected on the page
  const [difficulty, setDifficulty] = useState('');

  //Amount of questions
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
    <div className="CreateQuiz-container">

      <div className="CreateQuiz-box">
        <h1>Create a Quiz</h1>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
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
          <label htmlFor="number">Number of questions</label>
          <input
            type="number"
            id="number"
            value={amount}
            onInput={handleAmountInput}
            onKeyDown={handleKeyDown}
            placeholder="Enter the number of questions"
          />
        </div>
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            { }
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
        <button onClick={handleSubmit}>Start</button>
      </div>
    </div>
  );
}