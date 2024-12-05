import React, { useEffect, useState } from 'react';
import CreateQuizService from '../services/CreateQuizService';
import Modal from 'react-modal';
import CreateQuizzQuestion from './CreateQuizQuestionEditing';
import { toast } from "react-toastify";
import QuestionInContainer from './CreateQuizQuestionInContainer';
import ImportQuestionTrivia from './CreateQuizImportQuestionTrivia';
import CreateQuizNavbar from './CreateQuizNavbar';
import ProgressBar from './ProgressBar';

Modal.setAppElement('#root');



export default function CreateQuizRegisteredPage({ quizIdParameter, setQuizIdRedicted }) {


  const [quizId, setQuizId] = useState(quizIdParameter || '');
  //Modal of editing/creating question
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTriviaModalOpen, setTrivialModalOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Change a Quiz');
  const [TypeOfScreen, setTypeOfScreen] = useState('create');
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
  const [idQuestionSelectedForProgress, setIdQuestionSelectedForProgress] = useState(0);
  const [progress, setProgress] = useState(0);


  //NAVBAR
  const [quiz, setQuiz] = useState({
    difficulty: 'easy',
    isPublic: false,
    title: '',
    description: ''
  });



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

    if (quizQuestions.length > 0) {
      const progressValue = ((idQuestionSelectedForProgress + 1) / quizQuestions.length) * 100;
      setProgress(progressValue);
    }
    else {
      setProgress(100);
    }

  }, [idQuestionSelectedForProgress, quizQuestions]);


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



  const handleSelectedQuestionProgressBar = (questionId) => {

    setIdQuestionSelectedForProgress(questionId);
  };
  const resetCreateQuestionForm = () => {
    setTypeOfScreen('create');
    setIdQuestionSelected('');
  }
  const handleSubmitCreateQuestion = (event) => {
    setTypeOfScreen('create');
    resetCreateQuestionForm();
    setIdQuestionSelected('');
  };
  const handleSubmitImportTrivia = (event) => {
    setTrivialModalOpen(true);

  };

  const handleChangeIsPublicQuiz = (event) => {
    setIsPublicQuiz(event.target.checked);
  };


  const handleSubmitSave = () => {

    if (!quiz.title) {
      toast.info('Please select a title.');

      return;
    }


    if (!quiz.difficulty) {
      toast.info('Please select a difficulty.');
      return;
    }

    const quizData = {
      title: quiz.title,
      difficulty: quiz.difficulty,
      description: quiz.description,
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
    <div className="CreateQuiz p-0 m-0">
      {/*  */}

      <CreateQuizNavbar handleSubmitSave={handleSubmitSave} quiz={quiz} setQuiz={setQuiz} />
      <div className="CreateQuiz-container  flex flex-col gap-4 ">
        <div className="trivia modal">
          <Modal
            isOpen={isTriviaModalOpen}
            onRequestClose={() => setTrivialModalOpen(false)}
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <ImportQuestionTrivia
              setTrivialModalOpen={setTrivialModalOpen}
              quizId={quizId}
              refreshQuizQuestions={refreshQuizQuestions}
            />
          </Modal>
        </div>


        <div className=" grid min-grid-rows-[70vh_1fr_2fr] grid-flow-col max-h-[70vh] pl-4">

          <div className=" flex flex-col max-h-30 
           gap-4 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-500 mr-5 ">
            <div className="flex items-center  flex-col gap-4  scrollbar-thin scrollbar-thumb-gray-500 p-0">

              <div className="flex flex-col gap-4 w-[35vh]">
                {quizQuestions.map((question) => (
                  <QuestionInContainer

                    key={question.question_id}
                    question_text={question.question_text}
                    question_difficulty={question.question_difficulty}
                    question_category={question.question_category}
                    question_id={question.question_id}
                    question_index={question.question_index || 0}
                    setIdQuestionSelected={setIdQuestionSelected}
                    setModalOpen={setModalOpen}
                    setTypeOfScreen={setTypeOfScreen}
                    handleSubmitDeleteQuestion={() => handleSubmitDeleteQuestion(question.question_id)}
                    handleSelectedQuestionProgressBar={handleSelectedQuestionProgressBar}
                  />
                ))}
              </div>
            </div>

          </div>
          <div className="size-full flex justify-center items-center pr-4 mr-5 ">
            <div className="flex flex-col justify-center  w-[30vh] row-span-1 row-start-2 col-end-1 ">


              <button
                onClick={handleSubmitCreateQuestion}
                className="text-white bg-black px-4 py-2 rounded-lg hover:bg-black"
              >
                Create question
              </button>
              <button
                onClick={handleSubmitImportTrivia}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-blue-600"
              >
                Import questions from Trivia
              </button>

            </div>
          </div>
          {/*  CreateQuizQuestionEditing */}

          <div className="flex flex-col  row-span-2 col-start-2 col-span-2 rounded-lg pr-10">
            <ProgressBar progress={progress} />

            <div>

              <CreateQuizzQuestion
                TypeOfScreen={TypeOfScreen}
                quizId={quizId}
                questionId={idQuestionSelected}
                refreshQuizQuestions={refreshQuizQuestions}
                resetCreateQuestionForm={resetCreateQuestionForm}
              />
            </div>
          </div>
        </div>



      </div>

    </div>
  );
}