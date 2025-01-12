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
import QuizCreated from './pages/CreateQuizCreated.js';
import CreateQuizQuick from './pages/CreateQuizQuick.js';
import HomeScreen from './pages/HomeScreen.js';
import TeamModeConfigureScreen from './pages/TeamModeConfigureScreen.js';
import TeamModeJoinTeam from './pages/TeamModeJoinTeam.js';
import MultiplayerQuestionScreen from './pages/MultiplayerQuestionScreen.js';
import TeamEndScreen from './pages/TeamEndScreen.js';
import ScrumModeConfigureScreen from './pages/ScrumModeConfigureScreen.js';
import ScrumModeJoinGame from './pages/ScrumModeJoinGame.js';
import ScrumModeQuestionScreen from './pages/ScrumModeQuestionScreen.js';
import ScrumEndScreen from './pages/ScrumEndScreen.js';


function App() {

  return (
    <>
      <Router>

        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/join-quiz" element={<JoinQuiz />} />
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
          <Route path="/team-mode-configure" element={<TeamModeConfigureScreen />} />
          <Route path="/team-mode-join-team/:gameId" element={<TeamModeJoinTeam />} />
          <Route path="/team-question/:gameId" element={<MultiplayerQuestionScreen />} /> 
          <Route path="/team-end" element={<TeamEndScreen />} />
          <Route path="/scrum-mode-configure" element={<ScrumModeConfigureScreen />} />
          <Route path="/scrum-mode-lobby/:gameId" element={<ScrumModeJoinGame />} />
          <Route path="/scrum-mode-question/:gameId" element={<ScrumModeQuestionScreen />} />
          <Route path="/scrum-end" element={<ScrumEndScreen />} />

        </Routes>

      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
