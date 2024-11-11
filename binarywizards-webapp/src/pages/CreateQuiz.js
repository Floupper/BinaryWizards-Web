import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/CreateQuiz.css';

const API_BASE_URL = 'http://klebert-host.com:33012/';
const QUESTION_AMOUNTS = [10, 20, 30, 40, 50];

export default function CreateQuiz() {
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}categories`)
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));

    fetch(`${API_BASE_URL}difficulties`)
      .then(response => response.json())
      .then(data => setDifficulties(data))
      .catch(error => console.error('Error fetching difficulties:', error));
  }, []);

  const handleSubmit = () => {
    let selectedCat = selectedCategory;
    if (selectedCat === '') {
      const randomIndex = Math.floor(Math.random() * categories.length);
      selectedCat = categories[randomIndex].id;
    }

    let selectedAmount = amount;
    if (selectedAmount === '') {
      const randomIndex = Math.floor(Math.random() * QUESTION_AMOUNTS.length);
      selectedAmount = QUESTION_AMOUNTS[randomIndex];
    }

    const quizData = {
      category: selectedCat,
      amount: selectedAmount,
      difficulty,
    };
    console.log('Quiz data:', quizData);
    fetch(`${API_BASE_URL}quiz`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const quizId = data.quiz_id; 
        navigate(`/question/${quizId}`);
      })
      .catch(error => console.error('Error creating quiz:', error));
  };

  return (
    <div className="CreateQuiz">
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
        <select
          id="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        >
          <option value="">Please select a number of questions</option>
          {QUESTION_AMOUNTS.map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {difficulties.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit}>Start</button>
    </div>
  );
}
