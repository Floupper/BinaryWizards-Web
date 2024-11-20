import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/JoinQuiz.css';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { checkGameExists, createGameWithQuizId } from '../services/JoinQuizService';


export default function JoinQuiz() {
  const [gameCode, setGameCode] = useState('');
  const [quizCode, setQuizCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  const navigate = useNavigate();

  const handleCreateQuiz = async () => {
    if (quizCode.trim() === '') {
      toast.info('Please enter a valid quiz code.');
      return;
    }
    setIsLoadingQuiz(true);

    try {
      const data = await createGameWithQuizId(quizCode);
      setGameCode(data.game_id);
      navigate(`/question/${gameCode}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoadingQuiz(false);
    }
  };

  const handleJoinGame = async () => {
    if (gameCode.trim() === '') {
      toast.info('Please enter a valid game code.');
      return;
    }
    setIsLoadingGame(true);

    try {
      await checkGameExists(gameCode);
      navigate(`/question/${gameCode}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoadingGame(false);
    }
  };

  return (
    <div className="JoinQuizContainer">
      <ToastContainer />
      <div className="JoinQuizForm">
        <h1>Create a game <br/>with a quiz ID</h1>
        <div className="form-group">
          <label htmlFor="quizCode">Quiz Code</label>
          <input
            type="text"
            id="quizzCode"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value)}
            placeholder="Enter a quiz code"
          />
        </div>
        <button onClick={handleCreateQuiz} disabled={isLoadingQuiz}>
          {isLoadingQuiz ? 'Joining...' : 'Join'}
        </button>

      </div>

      <div className="JoinGameContainer">
        <h1>Join a game</h1>
        <div className="form-group">
          <label htmlFor="gameCode">Game Code</label>
          <input
            type="text"
            id="gameCode"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            placeholder="Enter the game code"
          />
        </div>
        <button onClick={handleJoinGame} disabled={isLoadingGame}>
          {isLoadingGame ? 'Joining...' : 'Join'}
        </button>

      </div>
    </div>
  );
}