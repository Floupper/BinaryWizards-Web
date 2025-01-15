import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import JoinQuizSearchQuiz from "../components/JoinQuizSearchQuiz";
import ScrumModeService from "../services/ScrumModeService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

export default function ScrumModeConfigureScreen() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  const handleInitializeGame = async () => {
    if (!selectedQuiz || maxPlayers < 2) {
      alert("Please select a quiz and set at least 2 players.");
      return;
    }

    const gameData = {
      mode: "scrum",
      max_players: maxPlayers,
    };

    try {
      const response = await ScrumModeService.initializeGame(selectedQuiz.quiz_id, gameData);
      navigate(`/scrum-mode-lobby/${response.game_id}`);
    } catch (error) {
      console.error("Error initializing Scrum game:", error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <div className="flex flex-col justify-center items-center flex-grow p-4"
        style={{ backgroundImage: "url('/backgrounds/ScrumQuiz.svg')" }}
      >
        <div className="flex flex-col bg-white p-20 rounded-xl gap-y-6">
            <label className="block mb-2 font-semibold text-3xl text-center pb-4">Max Players</label>
            <input
              type="number"
              min="2"
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(parseInt(e.target.value, 10))}
              className="w-6/12 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  self-center"
            />
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-black text-white py-2 px-6 rounded-lg hover:bg-white hover:text-black border-2 border-black mt-14"
            >
              Select Quiz
            </button>

            <button
              onClick={handleInitializeGame}
              className="bg-black text-white py-2 px-6 rounded-lg hover:bg-white hover:text-black border-2 border-black"
            >
              Initialize Game
            </button>
          </div>
        </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 focus:outline-none"
            >
              Close
            </button>
            <QueryClientProvider client={queryClient}>
              <JoinQuizSearchQuiz
                onQuizSelect={(quiz) => {
                  setSelectedQuiz(quiz);
                  setIsModalOpen(false);
                }}
                enableModal={false}
              />
            </QueryClientProvider>
          </div>
        </div>
      )}
    </div>
  );
}