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
  const [quizId, setQuizId] = useState(quizIdParameter || ''); //Quiz Id 
  const [isTriviaModalOpen, setTrivialModalOpen] = useState(false);  //Trivia Modal
  const [progress, setProgress] = useState(0); //Progress bar data

  const [questionInfo, setQuestionInfo] = useState({
    questionText: 'Write your question',
    questionOptions: ["", "", "", ""],
    questionType: 'text',
    questionDifficulty: 'easy',
    questionCategory: '',
    questionCorrectAnswer: 0,
    questionId: '',
    isEditing: false
  });

  const [editingQuestionInfo, setEditingQuestionInfo] = useState(
    {
      questionText: 'Write your question',
      questionOptions: ["", "", "", ""],
      questionType: 'text',
      questionDifficulty: 'easy',
      questionCategory: '',
      questionCorrectAnswer: 0,
      isEditing: true,
    }
  );

  const [reloadQuestionInfo, setReloadQuestionInfo] = useState(false);
  const [TypeOfScreen, setTypeOfScreen] = useState('create');
  const [questionListReload, setQuestionListReload] = useState(true);


  //diffilcies fetching from the API
  //#######   API      ######## 
  const [quizQuestions, setQuizQuestions] = useState([]);

  //########   LOCAL    ########
  //Public or private (local -> API)

  //Id of the question selected, for passing data
  const [idQuestionSelected, setIdQuestionSelected] = useState('');
  const [idQuestionSelectedForProgress, setIdQuestionSelectedForProgress] = useState(0);




  //NAVBAR
  const [quiz, setQuiz] = useState({
    difficulty: 'easy',
    isPublic: false,
    title: '',
    description: '',
    isPublic: false,
  });

  const [newQuestion, setNewQuestion] = useState(false);

  const [refreshQuizQuestionEditing, setRefreshQuizQuestions] = useState('false');

  let initialized = false;



  //Init du quizz et des catégories
  useEffect(() => {
    if (initialized) return;
    initialized = true;

    if (quizId === '') {
      CreateQuizService.initQuiz()
        .then(data => setQuizId(data.quiz_id))
        .catch(error => toast.info('Error initializing quiz:', error));
    }
  }, []
  );



  //Récupère les données du quiz si c'est une modification de quiz/lorsqu'on crée le quiz
  useEffect(() => {
    if (quizId) {
      CreateQuizService.fetchQuizDetails(quizId)
        .then(data => {
          const questions = data.quiz.questions || [];

          setQuizQuestions(questions);

          if (questions.length === 0) {
            setNewQuestion(true);
            selectQuestion('');
          }

          setQuiz(prevQuiz => ({
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


  useEffect(() => {
    if (questionInfo.isEditing) {
      setProgress(100);
    }
    else if (quizQuestions.length > 0) {
      const currentIndex = quizQuestions.findIndex(
        (q) => q.question_id === questionInfo.questionId
      );

      // Étape 2 : Calculer la progression
      // Si la question actuelle n'est pas trouvée, currentIndex sera -1 (on ignore dans ce cas)
      const totalQuestions = quizQuestions.length + (newQuestion ? 1 : 0);
      const progressValue =
        currentIndex >= 0
          ? ((currentIndex + 1) / totalQuestions) * 100
          : 0; // Si pas trouvé, progression = 0
      setProgress(progressValue);
    }

  }, [questionInfo.questionId]);

  const handleDeleteQuestionInContainerDefault = () => {
    selectLastQuestion();
    closeQuestionInContainerDefault();
    resetQuestionInfo();
  }

  const selectLastQuestion = () => {
    if (quizQuestions.length > 0) {
      const lastQuestion = quizQuestions[quizQuestions.length - 1];
      setIdQuestionSelected(lastQuestion.question_id);
    }
    else {
      setIdQuestionSelected('');
    }
    setReloadQuestionInfo(true);
  }

  const closeQuestionInContainerDefault = () => {
    setNewQuestion(false);
    setQuestionListReload(true);
  };
  const createQuestionInContainerDefault = () => {
    setNewQuestion(true);
    setQuestionListReload(true);
  };

  const refreshQuizQuestions = () => {
    if (quizId) {
      CreateQuizService.fetchQuizDetails(quizId)
        .then(data => {
          setQuizQuestions(data.quiz.questions || []);
        })
        .catch(error => toast.info('Error refreshing quiz details:', error));
    }
  };

  const handleSelectedQuestionProgressBar = (questionId) => {
    setIdQuestionSelectedForProgress(questionId);
  };

  const selectQuestion = async (questionId) => {


    if (questionInfo.questionId) {

      if (await handleSubmitActualQuestion()) {

      }
      else {

        return;
      }

    }
    if (!questionInfo.questionId && questionId) {

      /*setQuestionInfo({
        ...editingQuestionInfo, // Copie toutes les propriétés de editingQuestionInfo
        questionId: questionId, // Remplace la propriété questionId
        isEditing: true, // Remplace la propriété isEditing
      });
      */

      setEditingQuestionInfo({
        ...questionInfo, // Copie toutes les propriétés de editingQuestionInfo
        questionId: '', // Remplace la propriété questionId
        isEditing: true, // Remplace la propriété isEditing
      });
    }

    if (!questionId) {
      console.log("here");
      setQuestionInfo(editingQuestionInfo);
    }
    else {

      setQuestionInfo((prevState) => {
        return {
          ...prevState,
          questionId: questionId,
          isEditing: false,
        }
      });

    }
    setReloadQuestionInfo(true);

  }


  const handleSubmitImportTrivia = (event) => {
    setTrivialModalOpen(true);
  };

  //Submit de la question
  const handleSubmitActualQuestion = async () => {
    // questionInfo.questionId ;

    if (quiz.isPublic) {
      if (!questionInfo.questionCategory || !questionInfo.questionText || !questionInfo.questionDifficulty || questionInfo.questionOptions.some(choice => !choice || !choice.trim())) {
        toast.error("Finish the question before publish quizz.");
        return false;
      }
    }


    else {
      if (!questionInfo.questionText) {
        toast.error("Please enter a question.");
        return false;
      }
      if (questionInfo.questionOptions.some(choice => !choice || !choice.trim())) {
        toast.error("Please ensure all choices are filled out.");
        return false;
      }
      if (!questionInfo.questionDifficulty) {
        toast.error("Please select a difficulty.");
        return false;
      }
      if (!questionInfo.questionCategory) {
        toast.error("Please select a category.");
        return false;
      }
    }

    try {
      const options = [];
      options.push(
        ...questionInfo.questionOptions.map((choice, index) => ({
          option_content: questionInfo.questionOptions[index],
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

      const action = questionInfo.questionId
        ? CreateQuizService.updateQuestion
        : CreateQuizService.createQuestion;

      const data = await action(requestBody, quizId, questionInfo.questionId);

      if (!questionInfo.questionId) {
        closeQuestionInContainerDefault();

      }

      resetQuestionInfo();


      refreshQuizQuestions();
      return true;
    } catch (error) {

      toast.error(
        `Error ${TypeOfScreen ? "updating" : "creating"} question: ${error.message || "Unknown error"
        }`
      );
    }
  };


  const resetQuestionInfo = () => {
    setQuestionInfo({
      questionText: 'Write your question',
      questionOptions: ["", "", "", ""],
      questionType: 'text',
      questionDifficulty: 'easy',
      questionCategory: '',
      questionCorrectAnswer: 0,
      questionId: '',
    });
  }

  const handleSubmitCreateQuestion = async (event) => {
    try {

      if (questionInfo.isEditing || questionInfo.questionId) {

        await handleSubmitActualQuestion();
      }
      setTypeOfScreen('create');
      setRefreshQuizQuestions(true);
      setIdQuestionSelected('');
      setQuestionListReload(true);
      setNewQuestion(true);


      setEditingQuestionInfo({
        questionText: 'Write your question',
        questionOptions: ["", "", "", ""],
        questionType: 'text',
        questionDifficulty: 'easy',
        questionCategory: '',
        questionCorrectAnswer: 0,
        isEditing: true,
      })

      selectQuestion('');
    } catch (error) {
    }

  };
  //Met à jour le quiz & la question en cours 
  const handleSubmitSaveQuiz = () => {
    if (!quiz.title) {
      toast.info('Please select a quiz title.');
      return;
    }

    if (!quiz.difficulty) {
      toast.info('Please select a quiz difficulty.');
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

        if (quiz.isPublic) { toast.info('Quiz created successfully! '); setQuizIdRedicted(quizId) };
      })
      .catch(error => {
        toast.info(error.message);
      });

  };

  const handleSubmitSave = async () => {
    try {

      if (idQuestionSelected || newQuestion) {

        if (await handleSubmitActualQuestion()) {

          await handleSubmitSaveQuiz();
        }
      }
      else {

        await handleSubmitSaveQuiz();
      }

    } catch (error) {
      // Gérez les erreurs, si nécessaire
      console.error('Erreur lors de la soumission des deux fonctions:', error);
    }
  };


  const handleSubmitDeleteQuestion = (questionId) => {
    CreateQuizService.deleteQuestion(quizId, questionId)
      .then(() => {

        setIdQuestionSelected('');
        setQuestionListReload(true);
        refreshQuizQuestions();
      })
      .catch(error => {
        toast.error('Error deleting question:', error.message);
      });
    resetQuestionInfo();
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
                      question_text={question.question_text}
                      question_id={question.question_id}
                      question_index={question.question_index || 0}
                      selectQuestion={selectQuestion}
                      handleSubmitDeleteQuestion={() => handleSubmitDeleteQuestion(question.question_id)}
                    />
                  ))}
                  {(newQuestion) ?
                    <QuestionInContainerDefault
                      handleSubmitDeleteNewQuestion={handleDeleteQuestionInContainerDefault}
                      selectQuestion={selectQuestion}

                    />
                    : <div></div>}
                </div></div>
            </div>
            <div className="flex max-h-max align-items-center flex-col gap-4">
              <div className="flex  flex-col justify-center w-[40vh] gap-y-2 bg-white rounded-md  p-4 shadow-lg">
                <button
                  onClick={() => { handleSubmitCreateQuestion() }}
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

            {(questionInfo.isEditing || questionInfo.questionId) && (
              <>
                <div className=" flex align-items-center justify-center my-2">
                  <ProgressBar progress={progress} />
                </div>
                <div className="s-full">

                  <CreateQuizzQuestionEditing
                    setReloadQuestionInfo={setReloadQuestionInfo}
                    reloadQuestionInfo={reloadQuestionInfo}
                    questionInfo={questionInfo}
                    setQuestionInfo={setQuestionInfo}
                    setQuestionListReload={setQuestionListReload}
                    TypeOfScreen={TypeOfScreen}
                    quizId={quizId}
                    questionId={idQuestionSelected}
                    refreshQuizQuestions={refreshQuizQuestions}
                    refreshQuizQuestionEditing={refreshQuizQuestionEditing}
                    setRefreshQuizQuestions={setRefreshQuizQuestions}
                  />

                </div>


              </>

            )}
          </div>
        </div>
      </div>
    </div>
  );
}