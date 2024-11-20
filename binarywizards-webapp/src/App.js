import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomeScreen from './pages/HomeScreen';
import JoinQuiz from './pages/JoinQuiz';
import CreateQuiz from './pages/CreateQuiz';
import ConnectScreen from './pages/ConnectScreen.js';

import QuestionScreen from './pages/QuestionScreen.js';

import EndScreen from './pages/EndScreen';
import Navbar from './components/Navbar';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/join-quiz" element={<JoinQuiz />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/connect" element={<ConnectScreen />} />

        <Route path="/question" element={<Navigate to="/" replace />}/>
        <Route path="/question/:id" element={<QuestionScreen />}/>

        <Route path="/end" element={<EndScreen />} />

      </Routes>
    </Router>
  );
}

export default App;
