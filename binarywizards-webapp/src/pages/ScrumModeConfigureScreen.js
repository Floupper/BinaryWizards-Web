import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import JoinQuizSearchQuiz from "../components/JoinQuizSearchQuiz";
import ScrumModeService from "../services/ScrumModeService";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import JoinQuizCard from "../components/JoinQuizCard";

import Spinner from "../components/Spinner";

const queryClient = new QueryClient();

export default function ScrumModeConfigureScreen() {
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [maxPlayers, setMaxPlayers] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleInitializeGame = async () => {
    if (!selectedQuiz) {
      alert("Please select a quiz first.");
      return;
    }

    setIsInitializing(true);
    const gameData = {
      mode: "scrum",
      max_players: maxPlayers,
    };

    try {
      const response = await ScrumModeService.initializeGame(selectedQuiz.quiz_id, gameData);
      navigate(`/scrum-mode-lobby/${response.game_id}`);
    } catch (error) {
      console.error("Error initializing Scrum game:", error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner size="8" className="text-black mb-4" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br"
      style={{ backgroundImage: "url('/backgrounds/ScrumQuiz.svg')" }}
    >
      <Navbar />
      <div className="flex flex-col justify-center items-center flex-grow p-4">
        <div className="flex flex-col bg-white p-20 rounded-xl gap-y-6">
          <label className="block mb-2 font-semibold text-3xl text-center pb-4">Max Players</label>
          <input
            type="number"
            min="1"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(parseInt(e.target.value, 10))}
            className="w-6/12 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  self-center"
          />
          {selectedQuiz && (
            <div className="mt-4 sm:mt-6">
              <JoinQuizCard quiz={selectedQuiz} enableModal={false} />
            </div>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white py-2 px-6 rounded-lg hover:bg-white hover:text-black border-2 border-black mt-14 transition"
            disabled={isInitializing}
          >
            Select Quiz
          </button>

          <button
            onClick={handleInitializeGame}
            disabled={!selectedQuiz || isInitializing}
            className={`py-2 px-6 rounded-lg border-2 border-black transition flex items-center justify-center
              ${!selectedQuiz || isInitializing
                ? "bg-gray-400 text-gray-700 cursor-not-allowed opacity-50 hover:bg-gray-400 hover:text-gray-700"
                : "bg-black text-white hover:bg-white hover:text-black"}`}
          >
            {isInitializing ? (
              <>
                <Spinner size="5" className="mr-2" />
              </>
            ) : (
              "Initialize Game"
            )}
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