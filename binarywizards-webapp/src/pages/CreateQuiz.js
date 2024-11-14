import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/CreateQuiz.css';
import CreateQuizService from '../services/CreateQuizService ';

export default function CreateQuiz() {
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    CreateQuizService.fetchCategories()
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));

    CreateQuizService.fetchDifficulties()
      .then(data => setDifficulties(data))
      .catch(error => console.error('Error fetching difficulties:', error));
  }, []);

  const handleSubmit = () => {
    setErrorMessage('');

    if (!amount || isNaN(amount) || amount <= 0) {
      setErrorMessage('Please enter a valid number of questions (greater than 0).');
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
    console.log('Quiz data:', quizData);
    CreateQuizService.createQuiz(quizData)
      .then(data => {
        const quizId = data.quiz_id; 
        navigate(`/question/${quizId}`);
      })
      .catch(error => console.error('Error creating quiz:', error));
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
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
          >
            <option value="">Please select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="number">Number of questions:</label>
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
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value={""}>any</option>
            {difficulties.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handleSubmit}>Start</button>
      </div>
    </div>
  );
}