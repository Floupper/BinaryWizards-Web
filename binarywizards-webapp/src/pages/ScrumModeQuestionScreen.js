import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import QuestionHUD from "../components/QuestionHUD";
import QuestionChoiceMultiple from "../components/QuestionChoiceMultiple";

const SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}`;

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

    newSocket.on("currentQuestion", (data) => {
      handleNewQuestion(data);
    });

    newSocket.on("newQuestion", (data) => {
      handleNewQuestion(data);
    });

    newSocket.on("gameFinished", (data) => {
      navigate(`/scrum-end`, {
        state: {
          ranking: data.ranking,
        },
      });
    });

    newSocket.on("answerResult", (data) => {
      setCorrectOptionIndex(data.correct_option_index);
      setIsAnswered(true);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
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
  };

  const handleAnswerSelect = (selectedOptionIndex) => {
    if (!socket || isAnswered) return;

    setSelectedAnswer(selectedOptionIndex);
    setIsAnswered(true);

    socket.emit("sendAnswer", {
      game_id: gameId,
      question_index: questionIndex,
      option_index: selectedOptionIndex,
    });
  };

  const hudParams = {
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
        <QuestionHUD party_parameters={hudParams} />
      </div>

      <div className="bg-gradient-to-r from-orange-400 to-green-400 p-2 rounded-lg">
        <div className="flex flex-col items-center space-y-6 p-6 bg-[#F4F2EE] rounded-lg shadow-md w-[110vh] h-[60vh]">
          <h1 className="Question text-3xl font-semibold text-center text-black">{questionText}</h1>
          <div className="flex justify-center">
            <QuestionChoiceMultiple
              question_choice={options}
              onQuestionSelect={handleAnswerSelect}
              selectedOptionIndex={selectedAnswer}
              isAnswered={isAnswered}
              correctOptionIndex={correctOptionIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
