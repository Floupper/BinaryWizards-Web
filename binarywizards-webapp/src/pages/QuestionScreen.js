import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionHUD from "../components/QuestionHUD";
import QuestionChoiceMultiple from "../components/QuestionChoiceMultiple";
import { GetQuestion, PostAnswers } from "../services/QuestionService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chrono from "../components/Chrono";
import Navbar from "../components/Navbar";

export default function QuestionScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [difficultyLevel, setDifficultyLevel] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [nbQuestionsTotal, setNbQuestionsTotal] = useState(null);
  const [score, setScore] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [questionType, setQuestionType] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [questionCategory, setQuestionCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [idCorrectAnswers, setIdCorrectAnswers] = useState(null);
  const [timeAvailable, setTimeAvailable] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const chronoRef = useRef();

  const mode = difficultyLevel === "none" ? "standard" : "time";

  useEffect(() => {
    handleFetchQuiz();
  }, []);

  const handleQuestionSelect = async (selectedId) => {
    if (isAnswered) return;
    if (mode === "time") chronoRef.current?.stopTimer();
    setSelectedQuestionId(selectedId);
    setIsAnswered(true);
    try {
      let result;
      if ((mode === "standard" && selectedId !== -1) || mode === "time") {
        result = await PostAnswers(id, questionIndex, selectedId);
      }
      setIdCorrectAnswers(result.correct_option_index);
      if (selectedId === result.correct_option_index) {
        setCorrectAnswer(true);
      } else {
        setCorrectAnswer(false);
      }
    } catch (error) {
      if (error.message === "Question's index invalid") {
        toast.success("Updating the current question...");
        await handleFetchQuiz();
      } else {
        if (selectedId !== -1) {
          toast.error("Error sending answer.");
        }
        setIsAnswered(false);
      }
    }
  };

  const handleFetchQuiz = async () => {
    try {
      setLoading(true);
      const data = await GetQuestion(id);
      console.log('presque à la fin')
      if (data.game_finished) {
        console.log('à la fin')
        setScore(data.correct_answers_nb);
        navigate("/end", {
          state: {
            difficulty_level: difficultyLevel,
            correct_answers_nb: data.correct_answers_nb,
            nb_questions_total: data.nb_questions_total,
            quizId: data.quiz_id,
          },
        });
        return;
      }

      const difficultyMap = {
        "5": "hard",
        "15": "medium",
        "30": "easy",
      };

      setCorrectAnswer(null)
      setDifficultyLevel(difficultyMap[data.time_limit] || "none");
      setQuestionText(data.question_text);
      setOptions(data.options);
      setQuestionIndex(data.question_index);
      setNbQuestionsTotal(data.nb_questions_total);
      setScore(data.correct_answers_nb);
      setQuestionType(data.question_type);
      setQuestionDifficulty(data.question_difficulty);
      setQuestionCategory(data.question_category);
      setQuizId(data.quiz_id);
      setTimeAvailable(data.time_available);
      setSelectedQuestionId(null);
      setIsAnswered(false);
      setIdCorrectAnswers(null);

      if (difficultyLevel !== "none") {
        chronoRef.current?.resetTimer(data.time_available);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReload = () => {
    if (!isAnswered) return;
    handleFetchQuiz();
  };

  const paramHUD = {
    idparty: id,
    idquizz: quizId,
    score,
    question_index: questionIndex,
    nb_questions_total: nbQuestionsTotal,
    difficulty: questionDifficulty,
    category: questionCategory,
    difficulty_level: difficultyLevel,
  };

  useEffect(() => {
    if (timeAvailable !== null && !isAnswered) {
      chronoRef.current?.resetTimer(timeAvailable);
    }
  }, [timeAvailable, isAnswered]);

  return (
    <div className="min-h-screen bg-cover bg-center bg-[#F4F2EE] flex flex-col items-center"
      style={{ backgroundImage: "url('/backgrounds/SinglePlayerQuiz.svg')" }}
    >
      <Navbar />
      <div className="mb-6 w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
        <QuestionHUD handleFetchQuiz={handleFetchQuiz} party_parameters={paramHUD} />
      </div>
      {loading && (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </div>
      )}
      <div className={`${correctAnswer === false ? 'bg-red-500' : ''} ${correctAnswer === true ? 'bg-green-500' : ''} ${correctAnswer === null ? 'bg-gradient-to-r to-[#377DC9] via-[#8A2BF2] from-[#E7DAB4]' : ''} p-2 rounded-lg w-full sm:w-[90%] md:w-[80%] lg:w-[60%] mb-10`}>
        <div className="flex flex-col items-center space-y-6 p-6 bg-[#F4F2EE] rounded-lg shadow-md w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black">{questionText}</h1>
          <div className="flex justify-center w-full">
            <QuestionChoiceMultiple
              type={questionType}
              question_choice={options}
              correctOptionIndex={idCorrectAnswers}
              onQuestionSelect={handleQuestionSelect}
              selectedOptionIndex={selectedQuestionId}
              isAnswered={isAnswered}
              isCorrect={correctAnswer}
            />
          </div>
          <button
            className={`px-6 py-3 rounded-lg text-white text-lg font-medium ${isAnswered ? "bg-black hover:bg-gray-800" : "bg-gray-400 cursor-not-allowed"
              }`}
            onClick={handleReload}
            disabled={!isAnswered}
          >
            Next Question
          </button>
          {mode === "time" && (
            <Chrono ref={chronoRef} sendResponse={handleQuestionSelect} id_quiz={quizId} />
          )}
        </div>
      </div>
    </div>
  );
}