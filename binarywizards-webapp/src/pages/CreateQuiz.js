import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import CreateQuizService from '../services/CreateQuizService';

import Modal from 'react-modal';
import CreateQuizzQuestion from '../components/CreateQuizQuestionEditing';

import Navbar from '../components/Navbar';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionInContainer from '../components/CreateQuizQuestionInContainer';
import ImportQuestionTrivia from '../components/CreateQuizImportQuestionTrivia';
import CreateQuizQuick from './CreateQuizQuick';
import QuizCreated from './CreateQuizCreated';
import { MdDescription } from 'react-icons/md';
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
      toast.info("no user id");
      navigate('/quick-quiz');
    }
  }, []);

  if (quizIdRedicted !== 'any') {
    if (quizId) {
      navigate('/dashboard');
    } else {
      navigate('/quiz-created/' + quizIdRedicted);

    }
    return null;
  }
  return (
    <div>
      {quizIdRedicted === 'any' ? (

        <CreateQuizRegisteredPage quizIdParameter={quizId} setQuizIdRedicted={setQuizIdRedicted} />

      )
        : (
          <div>
            <QuizCreated></QuizCreated>
          </div>
        )}
    </div>
  );
}



