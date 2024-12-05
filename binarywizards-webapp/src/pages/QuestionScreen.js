import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionHUD from '../components/QuestionHUD';
import QuestionChoiceMultiple from '../components/QuestionChoiceMultiple';
import { GetQuestion, PostAnswers } from '../services/QuestionService';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../components/Navbar';
// Function for retrieving API data

export default function QuestionScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  // States to store quiz data
  const [questionText, setQuestionText] = useState(''); // Question text
  const [options, setOptions] = useState([]);           // Array containing available answers
  const [questionIndex, setQuestionIndex] = useState(); // Index of the current question
  const [nbQuestionsTotal, setNbQuestionsTotal] = useState();   // Total number of questions
  const [score, setScore] = useState();                 // Current player's score
  const [quizId, setQuizId] = useState();               // Quiz ID
  const [questionType, setQuestionType] = useState(''); // Question type (unused)
  const [questionDifficulty, setQuestionDifficulty] = useState(''); // Question difficulty
  const [questionCategory, setQuestionCategory] = useState('');    // Question category
  const [loading, setLoading] = useState(true); // State to show loading status
  const [error, setError] = useState(null); // State to display errors
  const [selectedQuestionId, setSelectedQuestionId] = useState(null); // State to store the selected answer
  const [isAnswered, setIsAnswered] = useState(false); // State to block multiple answer submissions
  const [idCorrectAnswers, setIdCorrectAnswers] = useState(); // State to store the correct answer(s)

  // Function to retrieve and update quiz data
  const handleFetchQuiz = async () => {
    try {
      // Retrieves the question & answer
      const data = await GetQuestion(id);

      // Checks if the quiz is finished
      if (data.game_finished) {
        setScore(data.correct_answers_nb);

        if (data.game_finished) {
          navigate('/end', {
            state: { correct_answers_nb: data.correct_answers_nb, nb_questions_total: data.nb_questions_total, quizId: data.quiz_id },
          });
          return;
        }
      }

      // Updates states with received data if the quiz is not finished
      setQuestionText(data.question_text);
      setOptions(data.options);
      setQuestionIndex(data.question_index);
      setNbQuestionsTotal(data.nb_questions_total);
      setScore(data.correct_answers_nb);
      setQuestionType(data.question_type);
      setQuestionDifficulty(data.question_difficulty);
      setQuestionCategory(data.question_category);
      setQuizId(data.quiz_id);
      setSelectedQuestionId(null); // Resets the selection
      setIsAnswered(false); // Resets the submission status for the new question
      setIdCorrectAnswers(null); // Resets the correct answer state
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchQuiz();
  }, []);

  // Submit the answer when selecting an option
  const handleQuestionSelect = async (selectedId) => {
    if (!isAnswered) { // Checks if an answer has not already been submitted
      setSelectedQuestionId(selectedId); // Updates the selected answer
      setIsAnswered(true); // Marks that the answer has been submitted

      try {
        const result = await PostAnswers(id, questionIndex, selectedId); // Sends the answer via POST and retrieves the server's response
        setIdCorrectAnswers(result.correct_option_index); // Saves the index of the correct answer
      } catch (error) {
        if (error.message == "Question's index invalid") {
          toast.success('Actualization of the current question');
          await handleFetchQuiz();
        } else {
          toast.error('Error sending answers');
        }
      }
    }
  };

  // Load the next question when clicking "Next Question"
  const handleReload = () => {
    setLoading(true);
    handleFetchQuiz(); // Load the next question
  };

  const paramHUD = {
    idparty: id,
    idquizz: quizId,
    score: score,
    question_index: questionIndex,
    nb_questions_total: nbQuestionsTotal,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar />

      <div className="QuestionScreen">
        <ToastContainer />
        <div className="HUD">
          <QuestionHUD party_parameters={paramHUD} />
        </div>

        <h1 className="Question">{questionText}</h1>

        <div className="Answers">
          <QuestionChoiceMultiple
            question_choice={options}
            correctOptionIndex={idCorrectAnswers}
            onQuestionSelect={handleQuestionSelect}
            selectedQuestionId={selectedQuestionId}
            isAnswered={isAnswered}  // Pass the state of the answer submission
          />

          <button
            className={`validate-button ${!isAnswered ? 'disabled' : ''}`}
            onClick={handleReload}
            disabled={!isAnswered}  // Disables the button if no answer is selected
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}