import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/CreateQuiz.css';
import CreateQuizService from '../services/CreateQuizService';
import Modal from 'react-modal';
import CreateQuizzQuestion from '../components/CreateQuizQuestionEditing';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionInContainer from '../components/CreateQuizQuestionInContainer';
import ImportQuestionTrivia from '../components/CreateQuizImportQuestionTrivia';

Modal.setAppElement('#root');

export default function CreateQuiz(quizIdParameter) {
  const [categories, setCategories] = useState([]);
  const [difficulties, setDifficulties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState(10);
  const [difficulty, setDifficulty] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);

  const [isTriviaModalOpen, setTrivialModalOpen] = useState(false);

  const [isPublicQuiz, setIsPublicQuiz] = useState(false);
  const [idQuestionSelected, setIdQuestionSelected] = useState('');

  const [TypeOfScreen, setTypeOfScreen] = useState('edit');
  const [pageTitle, setPageTitle]=useState('Change a Quiz');

  const [quizTitle, setQuizTitle] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('');
  const [quizIsPublic, setQuizIsPublic] = useState('');
  const [quizId, setQuizId] = useState(quizIdParameter.quizId || '');
  const [quizQuestions, setQuizQuestions] = useState([]);


  useEffect(() => {
    CreateQuizService.fetchCategories()
      .then(data => setCategories(data))
      .catch(error => toast.info('Error fetching categories:', error));

    CreateQuizService.fetchDifficulties()
      .then(data => setDifficulties(data))
      .catch(error => toast.info('Error fetching difficulties:', error));

    if(quizId==''){
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
          setQuizQuestions(data.quiz.questions || [] ); 
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
          setQuizQuestions(data.quiz.questions || []); // Actualiser les questions
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


  const handleSubmitStart = () => {

    if (quizTitle === '') {
      toast.info('Please select a title.');
      return;
    }


    if (quizDifficulty === '') {
      toast.info('Please select a difficulty.');
      return;
    }

    toast.info(quizDifficulty);

/*
    if (!amount || isNaN(amount) || amount <= 0) {
      toast.info('Please enter a valid number of questions (greater than 0).');
      return;
    }
          if (selectedCategory === '') {
      toast.info('Please select a category.');
      return;
    }
    let selectedCat = selectedCategory;
    if (selectedCat === '') {
      const randomIndex = Math.floor(Math.random() * categories.length);
      selectedCat = categories[randomIndex].id;
    }
*/

    const quizData = {
      title: quizTitle,
      difficulty: quizDifficulty,
      is_public: isPublicQuiz,
    };
  
    console.log(quizData);
    CreateQuizService.createQuiz(quizData, quizId)
    .then(data => {
      toast.info('Quiz created successfully!');
      const quizId = data.quiz_id;
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/'); 
      }
    })
    .catch(error => {
      
      toast.info(error.message);
      console.log(error);
    });
  };

  const handleAmountInput = (e) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setAmount(value);
  };

  const handleKeyDown = (e) => {
    if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Delete') {
      e.preventDefault();
    }
  };


  const handleSubmitDeleteQuestion = (questionId) => {
    CreateQuizService.deleteQuestion(quizId, questionId)
      .then(() => {
        toast.info('Question deleted successfully!');
        refreshQuizQuestions(); // Actualiser la liste après suppression
      })
      .catch(error => {
        toast.error('Error deleting question:', error.message);
      });
  };

  return (
    <div className="CreateQuiz-container">
      
      <ToastContainer />
      <div className="CreateQuiz-box">
        <div className='trivia modal'>
          <Modal   isOpen={isTriviaModalOpen}
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
      <h2>Quiz ID: {quizId}</h2>
      <h1>{pageTitle}</h1>
      <label htmlFor="quiz_title">Titre du quiz :</label>
      <h2>  <input
          id="quiz_title"
          name="quiz_title"
          value={quizTitle}
          onChange={handleChangeQuizTitle} // Met à jour l'état à chaque modification
          rows="4"
          cols="50"
          placeholder="Enter the title of the quiz"
            className="large-input"
        /> </h2>
        <div className="form-group">
  <label htmlFor="difficulty">Difficulty</label>
  <select
    id="difficulty"
    value={quizDifficulty}
    onChange={(e) => setQuizDifficulty(e.target.value)}
  >
    {}
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
          checked={isPublicQuiz} // Lie la valeur de la case à l'état
          onChange={handleChangeIsPublicQuiz} // Appelle la fonction de gestion lors des changements
        />
        Make this quiz public
      </label>

      <h2>{quizQuestions.length} questions</h2>

      <div className="question_list">
      {quizQuestions.map((question) => (
  <QuestionInContainer 
    key={question.question_id} // Propriété "key" ajoutée ici
    question_text={question.question_text}
    question_difficulty={question.question_difficulty}
    question_category={question.question_category}
    question_id={question.question_id}
    setIdQuestionSelected={setIdQuestionSelected}
    setModalOpen={setModalOpen}
    setTypeOfScreen={setTypeOfScreen}
    handleSubmitDeleteQuestion={() => handleSubmitDeleteQuestion(question.question_id)} // Lien avec l'ID
  />
))}
      </div>





        <div className="end_button">
        <button onClick={handleSubmitImportTrivia}>Import questions from Trivia</button>
        <button onClick={handleSubmitCreateQuestion}>Create question</button>
        <button onClick={handleSubmitStart}>Create quiz</button>
        </div>
      </div>
    </div>
  );
}