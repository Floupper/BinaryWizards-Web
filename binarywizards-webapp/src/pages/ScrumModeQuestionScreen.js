import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import QuestionHUD from "../components/QuestionHUD";
import QuestionChoiceMultiple from "../components/QuestionChoiceMultiple";

const SERVER_URL = process.env.REACT_APP_API_BASE_URL;

export default function ScrumModeQuestionScreen() {
  const { gameId } = useParams();
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [nbQuestionsTotal, setNbQuestionsTotal] = useState(null);
  const [score, setScore] = useState(0);
  const [quizId, setQuizId] = useState(null);
  const [questionType, setQuestionType] = useState("");
  const [questionDifficulty, setQuestionDifficulty] = useState("");
  const [questionCategory, setQuestionCategory] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [socket, setSocket] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [timeAnswer, setTimeAnswer] = useState(null);  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const newSocket = io(SERVER_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    newSocket.on("connect", () => {
      newSocket.emit("getQuestionInformations", { game_id: gameId });
    });

    newSocket.on("currentQuestion", handleNewQuestion);
    newSocket.on("newQuestion", handleNewQuestion);

    newSocket.on("gameFinished", (data) => {
      navigate(`/scrum-end`, {
        state: { ranking: data.ranking },
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [gameId, navigate]);

  const handleNewQuestion = (data) => {
    setQuestionText(data.question_text);
    setOptions(data.options);
    setQuestionIndex(data.question_index);
    setNbQuestionsTotal(data.nb_questions_total);
    setScore(data.correct_answers_nb);
    setQuizId(data.quiz_id);
    setQuestionType(data.question_type);
    setQuestionDifficulty(data.question_difficulty);
    setQuestionCategory(data.question_category);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectOptionIndex(null);
    setCorrectAnswer(null);
  };

  const handleAnswerSelect = (selectedOptionIndex) => {
    console.log(selectedOptionIndex)
    if (!socket || isAnswered) return;
  
    setSelectedAnswer(selectedOptionIndex);
    setIsAnswered(true);
  
    socket.emit("sendAnswer", {
      game_id: gameId,
      question_index: questionIndex,
      option_index: selectedOptionIndex,
    });
  
    socket.selectedOptionIndex = selectedOptionIndex; 
  };
  
  useEffect(() => {
    if (socket) {
      socket.on("answerResult", (data) => {
        setCorrectOptionIndex(data.correct_option_index);
        setCorrectAnswer(socket.selectedOptionIndex === data.correct_option_index);
        setIsAnswered(true);
      });
    }
  }, [socket]);

  const hudParams = {
    idparty: gameId,
    idquizz: quizId,
    score,
    question_index: questionIndex,
    nb_questions_total: nbQuestionsTotal,
    difficulty: questionDifficulty,
    category: questionCategory,
  };

  useEffect(() => {
      if (timeAnswer === null || timeAnswer <= 0) return;
  
      const interval = setInterval(() => {
        setTimeAnswer((prevTimeAnswer) => Math.max(prevTimeAnswer - 0.46, 0));
      }, 0.9);
  
      return () => clearInterval(interval);
    }, [timeAnswer]);
  
  const answerBgClass = correctAnswer === true
    ? "bg-green-500"
    : correctAnswer === false
    ? "bg-red-500"
    : "bg-gradient-to-r from-orange-400 to-green-400";

  return (
    <div className="min-h-screen bg-cover bg-center bg-[#F4F2EE] flex flex-col items-center"
      style={{ backgroundImage: "url('/backgrounds/ScrumQuiz.svg')" }}  
    >
      <Navbar />
      <div className="mb-6 w-full sm:w-10/12 md:w-8/12 lg:w-6/12">
        <QuestionHUD party_parameters={hudParams} />
      </div>
      <div
        className={`p-2 rounded-lg w-full sm:w-[90%] md:w-[80%] lg:w-[60%] mb-10 ${answerBgClass}`}
      >
        <div className="flex flex-col items-center space-y-6 p-6 bg-[#F4F2EE] rounded-lg shadow-md w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black">
            {questionText}
          </h1>
          <div className="flex justify-center w-full">
            <QuestionChoiceMultiple
              question_choice={options}
              onQuestionSelect={handleAnswerSelect}
              selectedOptionIndex={selectedAnswer}
              isAnswered={isAnswered}
              correctOptionIndex={correctOptionIndex}
              type={questionType}
            />
          </div>
          <div style={{ width: "100%" }}>
            {correctAnswer !== null && (
              <div
                style={{
                  width: `${Math.min(120 - timeAnswer / 50, 100)}%`,
                }}
                className="h-3 bg-[#8B2DF1] rounded-xl"
              />)
            }
          </div>
        </div>
      </div>
    </div>
  );
}