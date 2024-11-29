import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import '../assets/JoinQuiz.css';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { checkGameExists, createGameWithQuizId } from '../services/JoinQuizService';
import SearchQuiz from '../components/JoinQuizSearchQuiz';

const queryClient = new QueryClient();

export default function JoinQuiz() {
  const token = localStorage.getItem('token');
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
      navigate(`/question/${data.game_id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create game');
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
      toast.error(error.message || 'Failed to join game');
    } finally {
      setIsLoadingGame(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
    <div>
      <ToastContainer />           
      {token ? (
      <div className="JoinQuizContainer">
        <SearchQuiz />
      </div>
      ) : 
      <div className="JoinGameContainer">
        <h1>Play</h1>
        <div className="form-group">
          <input
            type="text"
            id="gameCode"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            placeholder="Enter the game code"
          />
        </div>
        <button onClick={handleJoinGame} disabled={isLoadingGame}>
          {isLoadingGame ? 'Playing...' : 'Play'}
        </button>
      </div>
      }
    </div>
    </QueryClientProvider>
  );
}