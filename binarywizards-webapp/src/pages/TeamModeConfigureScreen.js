import Navbar from "../components/Navbar";
import TimeSelector from "../components/TeamModeTime";
import TeamCreator from "../components/TeamModeTeamCreator";
import JoinQuizSearchQuiz from "../components/JoinQuizSearchQuiz";
import JoinQuizCard from "../components/JoinQuizCard";
import TeamModeService from "../services/TeamModeService";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const queryClient = new QueryClient();

export default function TeamModeConfigureScreen() {
  const navigate = useNavigate();
  const [selectedTimer, setSelectedTimer] = useState("none");
  const [teams, setTeams] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTimerWarning, setShowTimerWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitializeGame = async () => {
    if (!selectedQuiz || teams.length === 0) {
      alert("Please select a quiz and add at least one team.");
      return;
    }

    if (selectedTimer === "none") {
      setShowTimerWarning(true);
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const isGameReady = selectedQuiz && teams.length > 0 && selectedTimer !== "none";

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/backgrounds/team_background.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />
      <div className="flex flex-col items-center flex-grow text-center px-4">
        <h1 className="text-2xl sm:text-4xl underline decoration-[#8B2DF1] decoration-4 text-black mt-4">
          Team
        </h1>
        <div className="w-full max-w-lg p-2">
          <TeamCreator onTeamsChange={(newTeams) => setTeams(newTeams)} />
          <div className="mt-4 sm:mt-6">
            <TimeSelector onTimerSelect={(timer) => setSelectedTimer(timer)} />
            {showTimerWarning && selectedTimer === "none" && (
              <p className="text-red-500 mt-2 text-sm">Please select a timer before starting the game.</p>
            )}
          </div>
        </div>

        {selectedQuiz && (
          <div className="mt-4 sm:mt-6">
            <JoinQuizCard quiz={selectedQuiz} enableModal={false} />
          </div>
        )}

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-gray-800 text-sm sm:text-base"
          >
            Select Quiz
          </button>

          <button
            onClick={handleInitializeGame}
            disabled={!isGameReady || isLoading}
            className={`py-2 px-3 sm:px-4 rounded-lg text-sm sm:text-base flex items-center justify-center
              ${isGameReady && !isLoading ? "bg-black text-white hover:bg-gray-800" : "bg-gray-400 text-gray-700 cursor-not-allowed opacity-50"}
            `}
          >
            {isLoading ? (
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