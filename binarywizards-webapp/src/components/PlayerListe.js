import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { QRCodeCanvas } from "qrcode.react";
import axiosInstance from "../utils/axiosInstance";
import { MdRefresh } from "react-icons/md";
import JoinQuizCard from "../components/JoinQuizCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import Navbar from "./Navbar";
import { fetchUsername } from "../services/JoinQuizService";

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchUsername();
    const savedTeam = localStorage.getItem(`team`);
    const gameIdStorage = localStorage.getItem("hasJoined");

    if (savedTeam && gameIdStorage === gameId) {
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

      newSocket.on("teamSwitch", (data) => {
        if (data && data.teams) {
          const updatedPlayers = {};
          data.teams.forEach((team) => {
            updatedPlayers[team.name] = team.players || [];
          });
          setPlayers(updatedPlayers);
          setTeams(data.teams);
        }
      });

      newSocket.on("joinedGame", () => {
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

      newSocket.on("disconnect", () => { });

      setSocket(newSocket);
    };

    connectToSocket();

    return () => {
      if (socket) {
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

      if (localStorage.getItem("hasJoined") && localStorage.getItem("hasJoined") !== gameId) {
        socket.emit("leaveGame", { game_id: localStorage.getItem("hasJoined") });
      }

      socket.emit("joinGame", { game_id: gameId, team_name: teamName });
      setSelectedTeam(teamName);
      setShowTeamPopup(false);
      localStorage.setItem("hasJoined", gameId);
      localStorage.setItem(`team`, teamName);
    }
  };

  const handleStartGame = () => {
    if (socket) {
      socket.emit("startGame", { game_id: gameId });
    }
  };

  const handleCopyGameCode = () => {
    const gameUrl = `${window.location.origin}/team-mode-join-team/${gameId}`;
    navigator.clipboard.writeText(gameUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 600);
    });
  };

  const handleSwitchTeam = (newTeamName) => {
    if (socket && newTeamName) {
      socket.emit("switchTeam", { game_id: gameId, new_team_name: newTeamName });

      setSelectedTeam(newTeamName);
      localStorage.setItem(`team`, newTeamName);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/backgrounds/TeamBackground.svg')",
      }}
    >
      <Navbar />

      {showTeamPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl underline decoration-[#8B2DF1] mb-6 text-center">
              Join a Team
            </h2>
            <div className="border-2 border-[#8B2DF1] p-4 rounded-lg">
              {teams.length > 0 ? (
                teams.map((teamName, index) => (
                  <button
                    key={index}
                    onClick={() => handleJoinTeam(teamName)}
                    className="bg-white text-black p-2 rounded-lg mb-4 shadow-md w-full hover:bg-gray-100 border border-gray-300"
                  >
                    {teamName}
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500">No teams available at the moment.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!showTeamPopup && (
        <div className="flex flex-wrap justify-center items-center space-y-8 lg:space-y-0 lg:space-x-8 overflow-hidden" style={{ minHeight: 'calc(90vh - 64px)' }}>
          {/* Left Section */}
          <div className="w-full lg:w-2/5 flex flex-col items-center">
            <p className="text-4xl mb-4">Game Code:</p>
            <div className="flex items-center text-3xl text-[#8B2DF1]">
              <span>{gameId}</span>
              <button
                onClick={handleCopyGameCode}
                className={`ml-4 text-2xl transition-transform duration-300 ${copied ? "text-[#761EC7] scale-150" : "text-[#8B2DF1] scale-100"
                  }`}
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
            </div>
            <div className="mt-8">
              <QRCodeCanvas
                value={`${window.location.origin}/team-mode-join-team/${gameId}`}
                size={184}
                className="shadow-lg rounded-lg"
              />
              <p className="mt-4 text-xl text-gray-700">Scan this code to join!</p>
            </div>

            {isGameOwner && (
              <button
                onClick={handleStartGame}
                className="mt-10 bg-[#8B2DF1] text-white py-6 px-12 rounded-lg text-xl hover:bg-[#7A24E1]"
              >
                Start Game
              </button>
            )}
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-2/5">
            <p className="text-4xl mb-4">Game Details :</p>

            {quizDetails && <JoinQuizCard quiz={quizDetails} enableModal={false} className="w-full" />}



            <div className="mt-12 p-6 border-2 border-[#8B2DF1] rounded-lg bg-opacity-70 bg-transparent max-h-[500px] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl">Teams</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">👤</span>
                  <span className="text-2xl">{Object.values(players).flat().length}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {teams.length > 0 ? (
                  teams.map((team, index) => {
                    const isUserTeam = team.name === localStorage.getItem(`team`);
                    return (
                      <div
                        key={index}
                        className={`border border-black rounded-lg overflow-hidden p-4 ${isUserTeam ? "border-4" : ""}`}
                        style={isUserTeam ? { borderWidth: "0.30rem" } : {}}
                      >
                        <h3
                          className="text-2xl bg-white text-black p-4 border-b border-black cursor-pointer hover:underline"
                          onClick={() => handleSwitchTeam(team.name)}
                        >
                          {team.name}
                        </h3>
                        <table className="w-full border-collapse">
                          <tbody>
                            {players[team.name] && players[team.name].length > 0 ? (
                              players[team.name].map((player, playerIndex) => (
                                <tr key={playerIndex} className="border-b border-black">
                                  <td className="p-4 border-black bg-transparent text-black text-xl">
                                    {player.username}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td className="p-4 text-gray-500 text-xl">No players in this team.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xl">No teams available at the moment.</p>
                )}
              </div>

            </div>

            <style>{`
                    ::-webkit-scrollbar {
                       width: 8px;
                     }
                    ::-webkit-scrollbar-track {
                       background: white;
                     }
                     ::-webkit-scrollbar-thumb {
                      background: #8B2DF1;
                      border-radius: 4px;
                       }
                   `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
