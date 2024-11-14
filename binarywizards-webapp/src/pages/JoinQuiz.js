import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/JoinQuiz.css';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { checkQuizExists } from '../services/JoinQuizService';


export default function JoinQuiz() {
  const [gameCode, setGameCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (gameCode.trim() === '') {
      toast.info('Please enter a valid game code.');

      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await checkQuizExists(gameCode);
      navigate(`/question/${gameCode}`);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="JoinQuizContainer">
      <ToastContainer />
      <div className="JoinQuizForm">
        <h1>Join a Game</h1>
        <div className="form-group">
          <label htmlFor="gameCode">Game Code:</label>
          <input
            type="text"
            id="gameCode"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            placeholder="Enter the game code"
          />
        </div>
        <button onClick={handleJoin} disabled={isLoading}>
          {isLoading ? 'Joining...' : 'Join'}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
}