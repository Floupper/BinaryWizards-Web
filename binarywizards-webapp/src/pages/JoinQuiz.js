import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/JoinQuiz.css';

export default function JoinQuiz() {
  const [gameCode, setGameCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (gameCode.trim() === '') {
      alert('Please enter a valid game code.');
      return;
    }
    navigate(`/question/${gameCode}`);
  };

  return (
    <div className="JoinQuizContainer">
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
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  );
}
