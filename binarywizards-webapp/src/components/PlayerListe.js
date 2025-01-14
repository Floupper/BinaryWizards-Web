import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import axiosInstance from "../utils/axiosInstance";
import { MdRefresh } from "react-icons/md";

const SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export default function PlayersList({ game_mode }) {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState({});
  const [socket, setSocket] = useState(null);
  const [teams, setTeams] = useState([]);
  const [quizDetails, setQuizDetails] = useState(null);
  const [timer, setTimer] = useState(null);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isGameOwner, setIsGameOwner] = useState(null);

  useEffect(() => {
    const savedTeam = localStorage.getItem(`team_${gameId}`);
    if (savedTeam) {
      setSelectedTeam(savedTeam);
      setShowTeamPopup(false);
    } else {
      setShowTeamPopup(true);
    }
  }, [gameId]);

  useEffect(() => {
    const connectToSocket = () => {
      const userToken = localStorage.getItem("token");
      if (!userToken) {
        console.error("User token is missing.");
        return;
      }

      const newSocket = io(SERVER_URL, {
        extraHeaders: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      newSocket.on("connect", () => {
        newSocket.emit("getGameInformations", { game_id: gameId });
      });

      newSocket.on("gameInformations", (data) => {
        setIsGameOwner(data.is_game_owner || false);
        setTeams(data.teams || []);
        setQuizDetails(data.quizzes || null);
        setTimer(data.time_limit || null);

        const updatedPlayers = {};
        (data.teams || []).forEach((team) => {
          updatedPlayers[team.name] = team.players || [];
        });
        setPlayers(updatedPlayers);
      });

      newSocket.on("playerJoined", (data) => {
        if (data && data.teams) {
          const updatedPlayers = {};
          data.teams.forEach((team) => {
            updatedPlayers[team.name] = team.players || [];
          });
          setPlayers(updatedPlayers);
          setTeams(data.teams);
        } else {
          console.error("Unexpected format for 'playerJoined' event:", data);
        }
      });

      newSocket.on("gameStarted", () => {
        navigate(`/team-question/${gameId}`);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server.");
      });

      setSocket(newSocket);
    };

    connectToSocket();

    return () => {
      if (socket) {
        console.log("Disconnecting from WebSocket server...");
        socket.disconnect();
      }
    };
  }, [showTeamPopup]);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axiosInstance.get(`/game/${gameId}/get_teams`);
        if (response.status === 200) {
          setTeams(response.data.teams || []);
        } else {
          console.error("Error fetching teams.");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [gameId]);

  const handleJoinTeam = (teamName) => {
    if (socket) {
      socket.emit("joinGame", { game_id: gameId, team_name: teamName });
      setSelectedTeam(teamName);
      setShowTeamPopup(false);
      localStorage.setItem(`team_${gameId}`, teamName);
    }
  };

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
    <div className="p-8">
      {showTeamPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Join a Team</h2>
            {teams.length > 0 ? (
              teams.map((teamName, index) => (
                <button
                  key={index}
                  onClick={() => handleJoinTeam(teamName)}
                  className="bg-blue-500 text-white p-2 rounded mb-2 w-full"
                >
                  {teamName}
                </button>
              ))
            ) : (
              <p>No teams available at the moment.</p>
            )}
          </div>
        </div>
      )}

      {!showTeamPopup && (
        <>
          <h1 className="text-2xl font-bold mb-4">Game Details</h1>

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

          <div className="mb-4">
            <QRCodeCanvas value={`${window.location.origin}/team-mode-join-team/${gameId}`} size={128} />
          </div>

          {quizDetails && (
            <div className="mb-4">
              <p>
                <span className="font-semibold">Quiz:</span> {quizDetails.title}
              </p>
            </div>
          )}

          {timer && (
            <div className="mb-4">
              <p>
                <span className="font-semibold">Time:</span> {timer} minutes
              </p>
            </div>
          )}

          <div className="mt-4">
            
              {isGameOwner ? (
                <button
                  onClick={handleStartGame}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Start Game
                </button>
              ) : (
                <p className="text-gray-500">Waiting for game owner...</p>
              )}
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Teams</h2>
            {teams.length > 0 ? (
              teams.map((team, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-2xl font-semibold text-blue-600 mb-4">{team.name}</h3>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Player Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players[team.name] && players[team.name].length > 0 ? (
                        players[team.name].map((player, playerIndex) => (
                          <tr key={playerIndex}>
                            <td className="border border-gray-300 px-4 py-2">{player.username}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="border border-gray-300 px-4 py-2 text-gray-500">No players in this team.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ))
            ) : (
              <p>No teams available at the moment.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
