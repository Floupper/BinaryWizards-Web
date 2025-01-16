import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Navbar from "../components/Navbar";
import { fetchUsername } from "../services/JoinQuizService";
import Spinner from "../components/Spinner";

const SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export default function ScrumModeJoinGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState(() => {
    const savedPlayers = localStorage.getItem(`players_${gameId}`);
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  const [quizDetails, setQuizDetails] = useState(null);
  const [isGameOwner, setIsGameOwner] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate(`/signin?redirect=/scrum-mode-lobby/${gameId}`);
          return;
        }

        await fetchUsername();
        const newSocket = io(SERVER_URL, {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        newSocket.on("connect", () => {
          if (localStorage.getItem("hasJoined") !== gameId) {
            newSocket.emit("joinGame", { game_id: gameId });
            localStorage.setItem("hasJoined", gameId);
          }
          newSocket.emit("getGameInformations", { game_id: gameId });
        });

        newSocket.on("gameInformations", (data) => {
          setQuizDetails(data.quizzes || null);
          setIsGameOwner(data.is_game_owner || false);
          setIsLoading(false);
        });

        newSocket.on("playerJoined", (data) => {
          if (data?.playerList) {
            setPlayers(data.playerList);
            localStorage.setItem(`players_${gameId}`, JSON.stringify(data.playerList));
          }
        });

        newSocket.on("gameStarted", () => {
          setIsStarting(true);
          setTimeout(() => {
            navigate(`/scrum-mode-question/${gameId}`);
          }, 500);
        });

        setSocket(newSocket);
        return () => newSocket.disconnect();
      } catch (error) {
        console.error("Error initializing game:", error);
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [gameId, navigate]);

  const handleStartGame = () => {
    if (socket) {
      setIsStarting(true);
      socket.emit("startGame", { game_id: gameId });
    }
  };

  const handleCopyGameCode = () => {
    navigator.clipboard.writeText(gameId).then(() => alert("Game code copied!"));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner size="8" className="text-black mb-4" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/backgrounds/ScrumQuiz.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />
      <div className="flex flex-wrap justify-center items-center space-y-8 lg:space-y-0 lg:space-x-8 overflow-hidden" style={{ minHeight: 'calc(90vh - 64px)' }}>
        <div className="w-full lg:w-2/5 flex flex-col items-center">
          <p className="text-4xl mb-4">Game Code:</p>
          <div className="flex items-center text-3xl text-[#8B2DF1]">
            <span>{gameId}</span>
            <button onClick={handleCopyGameCode} className="ml-4 text-2xl">
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
          <div className="mt-8">
            <QRCodeCanvas value={`${window.location.origin}/scrum-mode-lobby/${gameId}`} size={184} className="shadow-lg rounded-lg" />
            <p className="mt-4 text-xl text-gray-700">Scan this code to join!</p>
          </div>
          {isGameOwner && (
            <button
              onClick={handleStartGame}
              disabled={isStarting}
              className={`mt-10 bg-[#8B2DF1] text-white py-6 px-12 rounded-lg text-xl transition
                ${isStarting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#7A24E1]'}`}
            >
              {isStarting ? (
                <div className="flex items-center">
                  <Spinner size="5" className="mr-2" />
                </div>
              ) : (
                "Start Game"
              )}
            </button>
          )}
        </div>

        <div className="w-full lg:w-2/5">
          <p className="text-4xl mb-4">Game Details :</p>
          {quizDetails && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2">Quiz Details</h2>
              <p><span className="font-semibold">Title:</span> {quizDetails.title}</p>
              <p><span className="font-semibold">Difficulty:</span> {quizDetails.difficulty}</p>
            </div>
          )}

          <div className="mt-12 p-6 border-2 border-[#8B2DF1] rounded-lg bg-opacity-70 bg-transparent max-h-[500px] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl">Players</h2>
              <div className="flex items-center space-x-4">
                <span className="text-2xl">👤</span>
                <span className="text-2xl">{players.length}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {players.length > 0 ? (
                players.map((player, index) => {
                  const isCurrentUser = player === localStorage.getItem("username");
                  return (
                    <div
                      key={index}
                      className={`border ${isCurrentUser ? "border-4" : "border"} border-black rounded-lg overflow-hidden p-4 bg-white text-black text-xl`}
                      style={isCurrentUser ? { borderWidth: "0.30rem" } : {}}
                    >
                      {player}
                    </div>
                  );
                })
              ) : (
                <p className="text-xl text-gray-500">No players have joined yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: white; }
        ::-webkit-scrollbar-thumb { background: #8B2DF1; border-radius: 4px; }
      `}</style>
    </div>
  );
}