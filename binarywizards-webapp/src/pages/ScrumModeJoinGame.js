import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import { QRCodeCanvas } from "qrcode.react";

const SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export default function ScrumModeJoinGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState(() => {
    // Initialiser les joueurs depuis le localStorage
    const savedPlayers = localStorage.getItem(`players_${gameId}`);
    return savedPlayers ? JSON.parse(savedPlayers) : [];
  });
  const [quizDetails, setQuizDetails] = useState(null);
  const [isGameOwner, setIsGameOwner] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Redirecting to signin.");
      navigate(`/signin?redirect=/scrum-mode-join-game/${gameId}`);
      return;
    }

    const newSocket = io(SERVER_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    newSocket.on("connect", () => {
      if (localStorage.getItem("hasJoined")!==gameId) {
        newSocket.emit("joinGame", { game_id: gameId }, (response) => {
            
          
        });
        localStorage.setItem("hasJoined", gameId); 

        newSocket.emit("getGameInformations", { game_id: gameId });

      } else {
        newSocket.emit("getGameInformations", { game_id: gameId });
      }
    });

    newSocket.on("gameInformations", (data) => {
      setQuizDetails(data.quizzes || null);
      setIsGameOwner(data.is_game_owner || false);
    });

    newSocket.on("playerJoined", (data) => {
      if (data?.playerList) {
        setPlayers(data.playerList);
        localStorage.setItem(`players_${gameId}`, JSON.stringify(data.playerList)); // Sauvegarde dans localStorage
      }
    });

    newSocket.on("gameStarted", () => {
      navigate(`/scrum-mode-question/${gameId}`);
    });

    newSocket.on("disconnect", () => {
    });

    newSocket.on("error", (error) => {
      console.error("WebSocket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [gameId, navigate]);

  const handleStartGame = () => {
    if (socket) {
      socket.emit("startGame", { game_id: gameId });
    }
  };

  const handleCopyGameCode = () => {
    navigator.clipboard.writeText(gameId).then(() => {
      alert("Game code copied!");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <div className="flex flex-col items-center p-8">
        <h1 className="text-2xl font-bold mb-4">Join Scrum Game</h1>

        {/* Game Code and QR Code */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="font-semibold mr-2">Game Code:</span>
            <span className="text-blue-600 font-mono">{gameId}</span>
            <button
              onClick={handleCopyGameCode}
              className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
            >
              Copy
            </button>
          </div>
          <QRCodeCanvas value={`${window.location.origin}/scrum-mode-join-game/${gameId}`} size={128} />
        </div>

        {/* Quiz Details */}
        {quizDetails && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">Quiz Details</h2>
            <p>
              <span className="font-semibold">Title:</span> {quizDetails.title}
            </p>
            <p>
              <span className="font-semibold">Difficulty:</span> {quizDetails.difficulty}
            </p>
          </div>
        )}

        {/* Player List */}
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-bold mb-2">Players</h2>
          <ul>
            {players.length > 0 ? (
              players.map((player, index) => (
                <li key={index} className="border-b py-2">
                  {player}
                </li>
              ))
            ) : (
              <p className="text-gray-500">No players have joined yet.</p>
            )}
          </ul>
        </div>

        {/* Start Game Button */}
        {isGameOwner && (
          <button
            onClick={handleStartGame}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Start Game
          </button>
        )}
        {!isGameOwner && (
          <p className="text-gray-500">Waiting for the game owner to start...</p>
        )}
      </div>
    </div>
  );
}
