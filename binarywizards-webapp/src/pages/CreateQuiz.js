import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import { toast } from "react-toastify";
import QuizCreated from './CreateQuizCreated';
import CreateQuizRegisteredPage from '../components/CreateQuizRegistered';

Modal.setAppElement('#root');

export default function CreateQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { quizId } = location.state || { quizId: '' };
  const userId = localStorage.getItem('token');
  const [quizIdRedicted, setQuizIdRedicted] = useState('any');

  useEffect(() => {
    if (!userId) {
      navigate('/quick-quiz');
    }
  }, []);

  if (quizIdRedicted !== 'any') {
    navigate('/dashboard');
  }
  return (
    <div
      className="items-center bg-cover bg-center w-screen min-h-screen"
      style={{ backgroundImage: "url('/backgrounds/JoinQuizBackground.svg')" }}>
      {quizIdRedicted === 'any' ? (
        <CreateQuizRegisteredPage quizIdParameter={quizId} setQuizIdRedicted={setQuizIdRedicted} />
      )
        : (
          <div>
            <QuizCreated></QuizCreated>
          </div>
        )}
    </ div>
  );
}