import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h1>Quiz</h1>
      <button onClick={() => navigate('/join-quiz')}>Rejoindre un quiz</button>
      <button onClick={() => navigate('/create-quiz')}>Créer un quiz</button>
    </div>
  );
}
