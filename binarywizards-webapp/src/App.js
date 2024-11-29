import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import JoinQuiz from './pages/JoinQuiz';
import CreateQuiz from './pages/CreateQuiz';
import ConnectScreen from './pages/ConnectScreen.js';
import SignupScreen from './pages/SignupScreen.js';
import QuestionScreen from './pages/QuestionScreen.js';
import Dashboard from './pages/Dashboard.js';
import HistoriqueGamePlay from './pages/HistoriqueGamePlay';
import QuizRecapScreen from './pages/QuizRecapScreen.js';

import EndScreen from './pages/EndScreen';
import Navbar from './components/Navbar';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinQuiz />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/signin" element={<ConnectScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/historique-game-play/:quizId" element={<HistoriqueGamePlay />} />
        <Route path="/dashboard/detail-create-quiz/:quizId" element={<QuizRecapScreen />} />
        <Route path="/question" element={<Navigate to="/" replace />}/>
        <Route path="/question/:id" element={<QuestionScreen />}/>

        <Route path="/end" element={<EndScreen />} />

      </Routes>
    </Router>
  );
}

export default App;
