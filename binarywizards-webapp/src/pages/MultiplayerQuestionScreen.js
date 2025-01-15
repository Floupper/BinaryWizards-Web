import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import QuestionHUD from "../components/QuestionHUD";
import QuestionChoiceMultiple from "../components/QuestionChoiceMultiple";
import Navbar from "../components/Navbar";
import "react-toastify/dist/ReactToastify.css";

const SERVER_URL = process.env.REACT_APP_API_BASE_URL;

export default function MultiplayerQuestionScreen() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [nbQuestionsTotal, setNbQuestionsTotal] = useState(null);
  const [score, setScore] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [questionType, setQuestionType] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [questionCategory, setQuestionCategory] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [idCorrectAnswers, setIdCorrectAnswers] = useState(null);
  const [timeAvailable, setTimeAvailable] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const chronoInterval = useRef(null);
  const socketRef = useRef(null);

  // Initialisation et configuration du socket
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/connect");
      return;
    }

    const socket = io(SERVER_URL, {
      extraHeaders: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    socket.on("connect", () => {
      socket.emit("getQuestionInformations", { game_id: gameId });
    });

    socket.on("currentQuestion", handleNewQuestion);
    socket.on("newQuestion", handleNewQuestion);

    socket.on("gameFinished", ({ ranking }) =>
      navigate("/team-end", { state: { ranking } })
    );

    socket.on("answerResult", (data) => {
      setIdCorrectAnswers(data.correct_option_index);
      setIsAnswered(true);

      setCorrectAnswer(selectedId === data.correct_option_index);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      clearInterval(chronoInterval.current);
    };
  }, [gameId, navigate, selectedId]);

  // Gestion du chronomètre
  useEffect(() => {
    if (timeAvailable === null) return;

    const now = Date.now();
    const endTime = now + timeAvailable * 1000;
    const savedEndTime = localStorage.getItem(`endTime_${gameId}`);
    const finalEndTime =
      savedEndTime && parseInt(savedEndTime, 10) > now
        ? parseInt(savedEndTime, 10)
        : endTime;

    localStorage.setItem(`endTime_${gameId}`, finalEndTime);
    updateRemainingTime(finalEndTime);

    clearInterval(chronoInterval.current);
    chronoInterval.current = setInterval(() => {
      updateRemainingTime(finalEndTime);
    }, 1000);

    return () => clearInterval(chronoInterval.current);
  }, [timeAvailable, gameId]);

  const updateRemainingTime = (endTime) => {
    const timeLeft = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    setRemainingTime(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(chronoInterval.current);
    }
  };

  // Gestion d'une nouvelle question
  const handleNewQuestion = (data) => {
    const answeredQuestions =
      JSON.parse(localStorage.getItem(`answeredQuestions_${gameId}`)) || {};

    if (answeredQuestions[data.question_index] !== undefined) {
      setIsAnswered(true);
      setSelectedQuestionId(answeredQuestions[data.question_index]);
    } else {
      setIsAnswered(false);
      setSelectedQuestionId(null);
    }

  console.log(data.time_available)
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
    setIdCorrectAnswers(null);
    setCorrectAnswer(null);
  };

  // Gestion de la sélection d'une option
  const handleQuestionSelect = (selectedId) => {
    if (!socketRef.current || isAnswered) return;

    setSelectedQuestionId(selectedId);
    setIsAnswered(true);
    setSelectedId(selectedId);

    const answeredQuestions =
      JSON.parse(localStorage.getItem(`answeredQuestions_${gameId}`)) || {};
    answeredQuestions[questionIndex] = selectedId;
    localStorage.setItem(
      `answeredQuestions_${gameId}`,
      JSON.stringify(answeredQuestions)
    );

    socketRef.current.emit("sendAnswer", {
      game_id: gameId,
      question_index: questionIndex,
      option_index: selectedId,
    });
  };

  const paramHUD = {
    idparty: gameId,
    idquizz: quizId,
    score,
    question_index: questionIndex,
    nb_questions_total: nbQuestionsTotal,
    difficulty: questionDifficulty,
    category: questionCategory,
  };

  const getChronoColor = () =>
    remainingTime <= 5 ? "text-red-600" : "text-[#8B2DF1]";

  return (
    <div className="min-h-screen bg-cover bg-center bg-[#F4F2EE] flex flex-col items-center">
      <Navbar />
      <div className="mb-6 w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
        <QuestionHUD party_parameters={paramHUD} />
      </div>

      <div
        className={`${correctAnswer === false ? "bg-red-500" : ""} ${
          correctAnswer === true ? "bg-green-500" : ""
        } ${
          correctAnswer === null ? "bg-gradient-to-r from-orange-400 to-green-400" : ""
        } p-2 rounded-lg w-full sm:w-[90%] md:w-[80%] lg:w-[60%] mb-10`}
      >
        <div className="flex flex-col items-center space-y-6 p-6 bg-[#F4F2EE] rounded-lg shadow-md w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black">
            {questionText}
          </h1>
          <div className="flex justify-center w-full">
            <QuestionChoiceMultiple
              question_choice={options}
              correctOptionIndex={idCorrectAnswers}
              onQuestionSelect={handleQuestionSelect}
              selectedQuestionId={selectedQuestionId}
              isAnswered={isAnswered}
              type={questionType}
            />
          </div>
          {remainingTime !== null && (
            <div className={`text-5xl font-semibold ${getChronoColor()}`}>
              {remainingTime}s
            </div>
          )}
          <div>
            {/* {setCorrectAnswer ? (
              
              ) : (
              {isAnswered ? (
                <span>Waiting for other players...</span>
              ) : (
                <span>Choose an option...</span>
              )})
            } */}
          </div>
        </div>
      </div>
    </div>
  );
}