import React, { useEffect, useState } from 'react';
import CreateQuizService from '../services/CreateQuizService';
import Modal from 'react-modal';
import CreateQuizzQuestionEditing from './CreateQuizQuestionEditing';
import { toast } from "react-toastify";
import QuestionInContainer, { QuestionInContainerDefault } from './CreateQuizQuestionInContainer';
import ImportQuestionTrivia from './CreateQuizImportQuestionTrivia';
import CreateQuizNavbar from './CreateQuizNavbar';
import ProgressBar from './ProgressBar';
import Navbar from './Navbar';

Modal.setAppElement('#root');

export default function CreateQuizRegisteredPage({ quizIdParameter, setQuizIdRedicted }) {

  const [questionInfo, setQuestionInfo] = useState({
    questionText: 'Write your question',
    questionOptions: ["", "", "", ""],
    questionType: 'text',
    questionDifficulty: 'easy',
    questionCategory: '',
    questionCorrectAnswer: 0,
  });

  const [quizId, setQuizId] = useState(quizIdParameter || '');

  const [isTriviaModalOpen, setTrivialModalOpen] = useState(false);

  const [TypeOfScreen, setTypeOfScreen] = useState('create');
  //diffilcies fetching from the API
  //#######   API      ######## 
  const [quizQuestions, setQuizQuestions] = useState([]);

  //########   LOCAL    ########
  //Public or private (local -> API)

  //Id of the question selected, for passing data
  const [idQuestionSelected, setIdQuestionSelected] = useState('');
  const [idQuestionSelectedForProgress, setIdQuestionSelectedForProgress] = useState(0);
  const [progress, setProgress] = useState(0);

  //NAVBAR
  const [quiz, setQuiz] = useState({
    difficulty: 'easy',
    isPublic: false,
    title: '',
    description: '',
    isPublic: false,
  });

  const [refreshQuizQuestionEditing, setRefreshQuizQuestions] = useState('false');

  let initialized = false;

  //Permet d'init la page globale (catégories et init le quiz si il n'existe pas)
  useEffect(() => {
    if (initialized) return;
    initialized = true;

    if (quizId === '') {

      CreateQuizService.initQuiz()
        .then(data => setQuizId(data.quiz_id))
        .catch(error => toast.info('Error initializing quiz:', error));
    }
  }, []);

  //Récupère les données du quiz si c'est une modification de quiz/lorsqu'on crée le quiz
  useEffect(() => {
    if (quizId) {
      CreateQuizService.fetchQuizDetails(quizId)
        .then(data => {
          setQuizQuestions(data.quiz.questions || []);



          setQuiz((prevQuiz) => ({
            ...prevQuiz,
            description: data.quiz.description,
            title: data.quiz.title,
            isPublic: data.quiz.is_public,
            difficulty: data.quiz.difficulty,
          }));
        })
        .catch(error => toast.info('Error fetching quiz details:', error));
    }
  }, [quizId]);

  //Met à jour la barre de progression
  useEffect(() => {
    if (quizQuestions.length > 0) {
      const progressValue = ((idQuestionSelectedForProgress + 1) / quizQuestions.length) * 100;
      setProgress(progressValue);
    }
    else {
      setProgress(100);
    }
  }, [idQuestionSelectedForProgress, quizQuestions]);




  const refreshQuizQuestions = () => {
    if (quizId) {
      CreateQuizService.fetchQuizDetails(quizId)
        .then(data => {
          setQuizQuestions(data.quiz.questions || []);
        })
        .catch(error => toast.info('Error refreshing quiz details:', error));
    }
  };


  const handleSelectedQuestionAfterCreate = (questionId) => {
    setTypeOfScreen('edit');
    setIdQuestionSelected(questionId);
  };

  const handleSelectedQuestionProgressBar = (questionId) => {
    setIdQuestionSelectedForProgress(questionId);
  };

  const handleSubmitCreateQuestion = (event) => {
    setTypeOfScreen('create');
    setRefreshQuizQuestions(true);
    setIdQuestionSelected('');
  };

  const handleSubmitImportTrivia = (event) => {
    setTrivialModalOpen(true);
  };


  //Submit de la question
  const handleSubmitActualQuestion = async () => {
    if (!questionInfo.questionCategory) {
      toast.error("Please select a category.");
      return;
    }
    if (!questionInfo.questionText) {
      toast.error("Please enter a question.");
      return;

    }
    if (!questionInfo.questionDifficulty) {
      toast.error("Please select a difficulty.");
      return;
    }
    if (questionInfo.questionOptions.some(choice => !choice || !choice.trim())) {
      toast.error("Please ensure all choices are filled out.");
      return;
    }

    try {
      const options = [];
      options.push(
        ...questionInfo.questionOptions.map((choice, index) => ({
          option_content: choice,
          is_correct_answer: questionInfo.questionCorrectAnswer === index,
          option_index: index,

        }))
      );

      const requestBody = {
        question_text: questionInfo.questionText,
        question_difficulty: questionInfo.questionDifficulty,
        question_category: questionInfo.questionCategory,
        question_type: questionInfo.questionType,
        options: options,
      };

      const action = TypeOfScreen === "edit"
        ? CreateQuizService.updateQuestion
        : CreateQuizService.createQuestion;

      const data = await action(requestBody, quizId, idQuestionSelected);

      toast.success(
        `Question successfully ${TypeOfScreen ? "updated" : "created"}!`
      );
      handleSelectedQuestionAfterCreate(data.question_id);
      refreshQuizQuestions();
    } catch (error) {

      toast.error(
        `Error ${TypeOfScreen ? "updating" : "creating"} question: ${error.message || "Unknown error"
        }`
      );
    }
  };

  //Met à jour le quiz & la question en cours 
  const handleSubmitSaveQuiz = () => {
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
      type: quiz.isPublic ? 1 : 0,
    };

    CreateQuizService.createQuiz(quizData, quizId)
      .then(() => {
        toast.info('Quiz created successfully! ');
        if (quiz.isPublic) { setQuizIdRedicted(quizId) };
      })
      .catch(error => {
        toast.info(error.message);
      });

  };

  const handleSubmitSave = async () => {
    try {
      // Attendez que handleSubmitActualQuestion soit terminé
      await handleSubmitActualQuestion();

      // Ensuite, appelez handleSubmitSaveQuiz après la première fonction
      await handleSubmitSaveQuiz();

    } catch (error) {
      // Gérez les erreurs, si nécessaire
      console.error('Erreur lors de la soumission des deux fonctions:', error);
    }
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
      <Navbar />
      <div className="CreateQuiz-container flex flex-col gap-2">
        <CreateQuizNavbar handleSubmitSave={handleSubmitSave} quiz={quiz} setQuiz={setQuiz} />
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




        <div className=" flex flex-row pl-4 ">
          <div className="flex flex-col gap-4 max-w-min">
            <div
              className="flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500  bg-white rounded-md p-4 shadow-lg h-[60vh] ">
              <div
                className="flex items-center flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-500 p-0 max-w-min">
                <div className="flex flex-col w-[35vh]">
                  {quizQuestions.map((question) => (
                    <QuestionInContainer
                      key={question.question_id}
                      question_text={question.question_text}
                      question_id={question.question_id}
                      question_index={question.question_index || 0}
                      setIdQuestionSelected={setIdQuestionSelected}
                      setTypeOfScreen={setTypeOfScreen}
                      handleSubmitDeleteQuestion={() => handleSubmitDeleteQuestion(question.question_id)}
                      handleSelectedQuestionProgressBar={handleSelectedQuestionProgressBar}
                    />
                  ))}
                  {TypeOfScreen === 'create' ?
                    <QuestionInContainerDefault />
                    : <div></div>}
                </div></div>
            </div>
            <div className="flex max-h-max align-items-center flex-col gap-4">
              <div className="flex  flex-col justify-center w-[40vh] gap-y-2 bg-white rounded-md  p-4 shadow-lg">
                <button
                  onClick={handleSubmitCreateQuestion}
                  className="px-4 py-2  text-gray-800 rounded-lg bg-black text-white hover:bg-white hover:text-black hover:border-black border"
                >
                  Create question
                </button>
                <button
                  onClick={handleSubmitImportTrivia}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-white hover:border-black border "
                >
                  Import questions from Trivia
                </button>

              </div>
            </div>
          </div>

          {/*  CreateQuizQuestionEditing */}

          <div className="flex w-full flex-col rounded-lg px-5 ">
            <div className=" flex align-items-center justify-center my-2">
              <ProgressBar progress={progress} />
            </div>
            <div className="s-full">
              <CreateQuizzQuestionEditing

                questionInfo={questionInfo}
                setQuestionInfo={setQuestionInfo}
                TypeOfScreen={TypeOfScreen}
                quizId={quizId}
                questionId={idQuestionSelected}
                refreshQuizQuestions={refreshQuizQuestions}
                refreshQuizQuestionEditing={refreshQuizQuestionEditing}
                setRefreshQuizQuestions={setRefreshQuizQuestions}
                handleSelectedQuestionAfterCreate={handleSelectedQuestionAfterCreate}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}