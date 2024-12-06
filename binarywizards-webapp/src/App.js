import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import JoinQuiz from './pages/JoinQuiz';
import CreateQuiz from './pages/CreateQuiz';
import ConnectScreen from './pages/ConnectScreen.js';
import SignupScreen from './pages/SignupScreen.js';
import QuestionScreen from './pages/QuestionScreen.js';
import Dashboard from './pages/Dashboard.js';
import HistoryGamePlay from './pages/HistoryGamePlay';
import QuizRecapScreen from './pages/QuizRecapScreen.js';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EndScreen from './pages/EndScreen';
import Navbar from './components/Navbar';
import QuizCreated from './pages/CreateQuizCreated.js';
import CreateQuizQuick from './pages/CreateQuizQuick.js';


function App() {

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<JoinQuiz />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/edit-quiz" element={<CreateQuiz />} />
        <Route path="/signin" element={<ConnectScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/history-game-play/:quizId" element={<HistoryGamePlay />} />
        <Route path="/dashboard/detail-create-quiz/:quizId" element={<QuizRecapScreen />} />
        <Route path="/question" element={<Navigate to="/" replace />} />
        <Route path="/question/:id" element={<QuestionScreen />} />
        <Route path="/end" element={<EndScreen />} />
        <Route path="/quiz-created/:quizId" element={<QuizCreated />} />
        <Route path="/quick-quiz" element={< CreateQuizQuick />} />
      </Routes>

    </Router>

  );
}

export default App;
