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
  const [error, setError] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [idCorrectAnswers, setIdCorrectAnswers] = useState(null);
  const [timeAvailable, setTimeAvailable] = useState(null);

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
      if ((mode === "standard" && selectedId != -1) || mode === "time") {
        result = await PostAnswers(id, questionIndex, selectedId);
      }
      setIdCorrectAnswers(result.correct_option_index);
    } catch (error) {
      if (error.message === "Question's index invalid") {
        toast.success("Updating the current question...");
        await handleFetchQuiz();
      } else {
        if (selectedId != -1) {
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

      if (data.game_finished) {
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
      setError(error.message);
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
    <div className="min-h-screen bg-cover bg-center bg-[#F4F2EE] flex flex-col items-center">
      <Navbar />
      <div className="mb-6 w-11/12">
        <QuestionHUD handleFetchQuiz={handleFetchQuiz} party_parameters={paramHUD} />
      </div>

      <div className="bg-gradient-to-r from-orange-400 to-green-400 p-2 rounded-lg">
        <div className="flex flex-col items-center space-y-6 p-6 bg-[#F4F2EE] rounded-lg shadow-md w-[110vh] h-[60vh]">
          <h1 className="Question text-3xl font-semibold text-center text-black">{questionText}</h1>
          <div className="flex justify-center">
            <QuestionChoiceMultiple
              question_choice={options}
              correctOptionIndex={idCorrectAnswers}
              onQuestionSelect={handleQuestionSelect}
              selectedQuestionId={selectedQuestionId}
              isAnswered={isAnswered}
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