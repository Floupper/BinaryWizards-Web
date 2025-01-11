import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import QuestionHUD from "../components/QuestionHUD";
import QuestionChoiceMultipleTeamMode from "../components/QuestionChoiceMultipleTeamMode";
import Chrono from "../components/Chrono";
import Navbar from "../components/Navbar";
import "react-toastify/dist/ReactToastify.css";

const SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}`;

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
  const [loading, setLoading] = useState(true);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [idCorrectAnswers, setIdCorrectAnswers] = useState(null);
  const [timeAvailable, setTimeAvailable] = useState(null);
  const chronoRef = useRef();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (!userToken) {
      navigate("/connect");
      return;
    }

    const newSocket = io(SERVER_URL, {
      extraHeaders: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    newSocket.on("connect", () => {
      newSocket.emit("getQuestionInformations", { game_id: gameId });
    });

    newSocket.on("currentQuestion", (data) => {
      handleNewQuestion(data);
    });

    newSocket.on("newQuestion", (data) => {
      handleNewQuestion(data);
    });

    newSocket.on("gameFinished", (data) => {
      const { ranking } = data;
      console.log("rank",ranking);
      console.log("data",data);
      navigate("/team-end", {
        state: {
          ranking,
        },
      });
    });

    newSocket.on("answerResult", (data) => {
      setIdCorrectAnswers(data.correct_option_index);
      setIsAnswered(true);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [gameId, navigate]);

  useEffect(() => {
    if (timeAvailable !== null && chronoRef.current) {
      chronoRef.current.resetTimer(timeAvailable);
    }
  }, [timeAvailable]);

  const handleNewQuestion = (data) => {
    const answeredQuestions = JSON.parse(localStorage.getItem(`answeredQuestions_${gameId}`)) || {};
    if (answeredQuestions[data.question_index] !== undefined) {
      setIsAnswered(true);
      setSelectedQuestionId(answeredQuestions[data.question_index]);
    } else {
      setIsAnswered(false);
      setSelectedQuestionId(null);
    }

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
  };

  const handleQuestionSelect = (selectedId) => {
    if (!socket || isAnswered) return;

    setSelectedQuestionId(selectedId);
    setIsAnswered(true);

    const answeredQuestions = JSON.parse(localStorage.getItem(`answeredQuestions_${gameId}`)) || {};
    answeredQuestions[questionIndex] = selectedId;
    localStorage.setItem(`answeredQuestions_${gameId}`, JSON.stringify(answeredQuestions));

    socket.emit("sendAnswer", {
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

  return (
    <div className="min-h-screen bg-cover bg-center bg-[#F4F2EE] flex flex-col items-center">
      <Navbar />
      <div className="mb-6 w-11/12">
        <QuestionHUD party_parameters={paramHUD} />
      </div>

      <div className="bg-gradient-to-r from-orange-400 to-green-400 p-2 rounded-lg">
        <div className="flex flex-col items-center space-y-6 p-6 bg-[#F4F2EE] rounded-lg shadow-md w-[110vh] h-[60vh]">
          <h1 className="Question text-3xl font-bold text-center text-black">{questionText}</h1>
          <div className="flex justify-center">
            <QuestionChoiceMultipleTeamMode
              question_choice={options}
              correctOptionIndex={idCorrectAnswers}
              onQuestionSelect={handleQuestionSelect}
              selectedQuestionId={selectedQuestionId}
              isAnswered={isAnswered}
            />
          </div>
          {timeAvailable !== null && (
            <Chrono ref={chronoRef} sendResponse={handleQuestionSelect} id_quiz={quizId} />
          )}
        </div>
      </div>
    </div>
  );
}
