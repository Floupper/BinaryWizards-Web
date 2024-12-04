import React, { useEffect, useState } from 'react';

import CreateQuizService from '../services/CreateQuizService';
import Modal from 'react-modal';
import CreateQuizzQuestion from './CreateQuizQuestionEditing';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionInContainer from './CreateQuizQuestionInContainer';
import ImportQuestionTrivia from './CreateQuizImportQuestionTrivia';



Modal.setAppElement('#root');



export default function CreateQuizRegisteredPage({ quizIdParameter, setQuizIdRedicted }) {


  const [quizId, setQuizId] = useState(quizIdParameter || '');
  //Modal of editing/creating question
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTriviaModalOpen, setTrivialModalOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Change a Quiz');
  const [TypeOfScreen, setTypeOfScreen] = useState('edit');
  //diffilcies fetching from the API
  //#######   API      ########
  const [difficulties, setDifficulties] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('');
  const [quizIsPublic, setQuizIsPublic] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);

  //########   LOCAL    ########
  //Public or private (local -> API)
  const [isPublicQuiz, setIsPublicQuiz] = useState(false);
  //Id of the question selected, for passing data
  const [idQuestionSelected, setIdQuestionSelected] = useState('');



  let initialized = false;

  useEffect(() => {


    if (initialized) return;
    initialized = true;


    CreateQuizService.fetchDifficulties()
      .then(data => setDifficulties(data))
      .catch(error => toast.info('Error fetching difficulties:', error));

    if (quizId === '') {
      setPageTitle('Create a Quiz');
      CreateQuizService.initQuiz()
        .then(data => setQuizId(data.quiz_id))
        .catch(error => toast.info('Error initializing quiz:', error));
    }
  }, []);


  useEffect(() => {
    if (quizId) {
      CreateQuizService.fetchQuizDetails(quizId)
        .then(data => {
          setQuizQuestions(data.quiz.questions || []);
          setQuizTitle(data.quiz.title || '');
          setQuizIsPublic(data.quiz.is_public || false);
          setQuizDifficulty(data.quiz.difficulty || '');
        })
        .catch(error => toast.info('Error fetching quiz details:', error));
    }
  }, [quizId]);

  const refreshQuizQuestions = () => {
    if (quizId) {
      CreateQuizService.fetchQuizDetails(quizId)
        .then(data => {
          setQuizQuestions(data.quiz.questions || []);
        })
        .catch(error => toast.info('Error refreshing quiz details:', error));
    }
  };

  useEffect(() => {
    if (quizIsPublic) {
      setIsPublicQuiz(quizIsPublic)
    }
  }, [quizIsPublic]);



  const handleChangeQuizTitle = (event) => {
    setQuizTitle(event.target.value);
  };

  const handleChangeQuizDescription = (event) => {
    setQuizDescription(event.target.value);
  };

  const handleSubmitCreateQuestion = (event) => {
    setTypeOfScreen('create');
    setIdQuestionSelected('');
    setModalOpen(true);
  };
  const handleSubmitImportTrivia = (event) => {
    setTrivialModalOpen(true);

  };

  const handleChangeIsPublicQuiz = (event) => {
    setIsPublicQuiz(event.target.checked);
  };


  const handleSubmitSave = () => {

    if (!quizTitle) {
      toast.info('Please select a title.');

      return;
    }


    if (!quizDifficulty) {
      toast.info('Please select a difficulty.');
      return;
    }

    const quizData = {
      title: quizTitle,
      difficulty: quizDifficulty,
      description: quizDescription,
      type: isPublicQuiz ? 1 : 0,
    };

    CreateQuizService.createQuiz(quizData, quizId)
      .then(() => {
        toast.info('Quiz created successfully! ');
        setQuizIdRedicted(quizId);
      })
      .catch(error => {
        toast.info(error.message);
      });
  };

  const handleSubmitDeleteQuestion = (questionId) => {
    CreateQuizService.deleteQuestion(quizId, questionId)
      .then(() => {
        toast.info('Question deleted successfully!');
        refreshQuizQuestions();
      })
      .catch(error => {
        toast.error('Error deleting question:', error.message);
      });
  };

  return (
    <div className="CreateQuiz-container">


      <div className="CreateQuiz-box">
        <div className='trivia modal'>
          <Modal isOpen={isTriviaModalOpen}
            onRequestClose={() => setTrivialModalOpen(false)}
            style={{
              overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
              content: { padding: '20px', borderRadius: '10px' },
            }}>

            <ImportQuestionTrivia
              setTrivialModalOpen={setTrivialModalOpen}
              quizId={quizId}
              refreshQuizQuestions={refreshQuizQuestions}
            ></ImportQuestionTrivia>

          </Modal>
        </div>
        <div className="modal">
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setModalOpen(false)}
            style={{
              overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
              content: { padding: '20px', borderRadius: '10px' },
            }}
          >
            <CreateQuizzQuestion

              TypeOfScreen={TypeOfScreen}
              setModalOpen={setModalOpen}
              quizId={quizId}
              questionId={idQuestionSelected}
              refreshQuizQuestions={refreshQuizQuestions}
            />
          </Modal>
        </div>

        <h1>{pageTitle}</h1>
        <label htmlFor="quiz_title">Titre du quiz :</label>
        <h2>  <input
          id="quiz_title"
          name="quiz_title"
          value={quizTitle}
          onChange={handleChangeQuizTitle}
          rows="4"
          cols="50"
          placeholder="Enter the title of the quiz"
          className="large-input"
        /> </h2>
        <div className="description">
          <label htmlFor="quiz_description">Description du quiz :</label>
          <h2>  <input
            id="quiz_description"
            name="quiz_description"
            value={quizDescription}
            onChange={handleChangeQuizDescription}
            rows="10"
            cols="50"
            placeholder="Enter a description for the quiz"
            className="large-input"
          /> </h2>

        </div>

        <div className="form-group">


          <label htmlFor="difficulty">Difficulty</label>
          <select
            id="difficulty"
            value={quizDifficulty}
            onChange={(e) => setQuizDifficulty(e.target.value)}
          >
            { }
            <option value="" disabled>
              Select a difficulty
            </option>
            {difficulties.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <label htmlFor="quiz_checkbox">
          <input
            type="checkbox"
            id="quiz_checkbox"
            name="quiz_checkbox"
            checked={isPublicQuiz}
            onChange={handleChangeIsPublicQuiz}
          />
          Publish this quiz
        </label>
        <h2>
          {quizQuestions.length} {quizQuestions.length < 2 ? 'question' : 'questions'}
        </h2>

        <div className="question_list">
          {quizQuestions.map((question) => (
            <QuestionInContainer
              key={question.question_id}
              question_text={question.question_text}
              question_difficulty={question.question_difficulty}
              question_category={question.question_category}
              question_id={question.question_id}
              setIdQuestionSelected={setIdQuestionSelected}
              setModalOpen={setModalOpen}
              setTypeOfScreen={setTypeOfScreen}
              handleSubmitDeleteQuestion={() => handleSubmitDeleteQuestion(question.question_id)}
            />
          ))}
        </div>





        <div className="end_button">
          <button onClick={handleSubmitImportTrivia}>Import questions from Trivia</button>
          <button onClick={handleSubmitCreateQuestion}>Create question</button>
          <button onClick={handleSubmitSave}>Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}