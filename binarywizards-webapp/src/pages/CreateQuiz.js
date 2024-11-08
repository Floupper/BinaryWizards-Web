import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/CreateQuiz.css';

export default function CreateQuiz() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(9);
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState('easy');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleSubmit = () => {
    const quizData = {
      category: selectedCategory,
      amount,
      difficulty,
    };
  
  
    fetch('http://localhost:3000/quiz', { 
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
      <h1>Créer un Quiz</h1>
      <div className="form-group">
        <label htmlFor="category">Catégorie :</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="number">Nombre de questions :</label>
        <select
          id="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="difficulty">Difficulté :</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {['easy', 'medium', 'hard'].map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      <button onClick={handleSubmit}>Démarrer</button>
    </div>
  );
}
