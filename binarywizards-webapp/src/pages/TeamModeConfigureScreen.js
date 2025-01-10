import Navbar from "../components/Navbar";
import TimeSelector from "../components/TeamModeTime";
import TeamCreator from "../components/TeamModeTeamCreator";
import JoinQuizSearchQuiz from "../components/JoinQuizSearchQuiz";
import TeamModeService from "../services/TeamModeService";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

export default function TeamModeConfigureScreen() {
  const navigate = useNavigate();
  const [selectedTimer, setSelectedTimer] = useState("none");
  const [teams, setTeams] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInitializeGame = async () => {
    if (!selectedQuiz || teams.length === 0) {
      alert("Please select a quiz and add at least one team.");
      return;
    }

    const gameData = {
      mode: "team",
      difficulty_level: selectedTimer,
      teams: teams,
    };

    try {
      const response = await TeamModeService.initializeGame(
        selectedQuiz.quiz_id,
        gameData
      );
      navigate(`/team-mode-join-team/${response.game_id}`);
    } catch (error) {
      console.error("Error initializing game:", error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar />
      <div className="flex flex-col items-center flex-grow">
        <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
          <TimeSelector onTimerSelect={(timer) => setSelectedTimer(timer)} />
          <div className="mt-6">
            <TeamCreator onTeamsChange={(newTeams) => setTeams(newTeams)} />
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Select Quiz
          </button>

          <button
            onClick={handleInitializeGame}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Initialize Game
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700"
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
