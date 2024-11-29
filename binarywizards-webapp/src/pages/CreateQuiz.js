import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../assets/CreateQuiz.css';
import CreateQuizService from '../services/CreateQuizService';

import Modal from 'react-modal';
import CreateQuizzQuestion from '../components/CreateQuizQuestionEditing';

import Navbar from '../components/Navbar';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionInContainer from '../components/CreateQuizQuestionInContainer';
import ImportQuestionTrivia from '../components/CreateQuizImportQuestionTrivia';
import CreateQuizAnonyme from '../components/CreateQuizAnonyme';
import QuizCreated from './CreateQuizCreated';
import { MdDescription } from 'react-icons/md';
import CreateQuizRegisteredPage from '../components/CreateQuizRegistered';

Modal.setAppElement('#root');

export default function CreateQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = location.state || { quizId: '' };
  const userId = localStorage.getItem('token');
  const [quizIdRedicted, setQuizIdRedicted] = useState('any');

  if (quizIdRedicted !== 'any') {
    if (quizId) {
      navigate('/dashboard');
    } else {
      navigate('/quiz-created/' + quizIdRedicted);

    }
<<<<<<< binarywizards-webapp/src/pages/CreateQuiz.js
    return null;
  }
  return (
    <div>
      {quizIdRedicted === 'any' ? (
        userId ? (
          <CreateQuizRegisteredPage quizIdParameter={quizId} setQuizIdRedicted={setQuizIdRedicted} />
        ) : (
          <CreateQuizAnonyme />
        )
      ) : (
        <div>

        </div>
      )}
=======
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
    CreateQuizService.createQuiz(quizData)
      .then(data => {
        const quizId = data.quiz_id;
        navigate(`/question/${quizId}`);
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
    <div>
      <Navbar />
      <div className="CreateQuiz-container">
        <ToastContainer />
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
>>>>>>> binarywizards-webapp/src/pages/CreateQuiz.js
    </div>
  );
}



