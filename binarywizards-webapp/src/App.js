import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import JoinQuiz from './pages/JoinQuiz';
import CreateQuiz from './pages/CreateQuiz';
import QuestionScreen from './pages/QuestionScreen.js';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/join-quiz" element={<JoinQuiz />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/question" element={<Navigate to="/" replace />}/>
        <Route path="/question/:id" element={<QuestionScreen />}/>
      </Routes>
    </Router>
  );
}

export default App;
