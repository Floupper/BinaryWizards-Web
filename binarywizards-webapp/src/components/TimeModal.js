import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGameWithQuizId } from "../services/JoinQuizService";

const TimeModal = ({ closeModal, quiz_id }) => {
  const [selectedTimer, setSelectedTimer] = useState("none");
  const navigate = useNavigate();
  
  const timers = [
    { value: "none", label: "None", color: "bg-gray-200" },
    { value: "easy", label: "30s", color: "bg-green-200" },
    { value: "medium", label: "15s", color: "bg-yellow-200" },
    { value: "hard", label: "5s", color: "bg-red-200" },
  ];

  const handleCreateGame = async () => {
    try {
      const data = await createGameWithQuizId(quiz_id, selectedTimer);
      if (data?.game_id) {
        navigate(`/question/${data.game_id}`);
      } else {
        console.error("Failed to create the game. No game ID returned.");
      }
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4 text-center">Select a Timer</h2>
        <div className="flex justify-around items-center mb-6">
          {timers.map((timer, index) => (
            <button
              key={index}
              onClick={() => setSelectedTimer(timer.value)}
              className={`w-20 h-20 rounded-lg flex items-center justify-center text-lg font-medium ${timer.color} ${
                selectedTimer === timer.value
                  ? "ring-4 ring-offset-2 ring-red-500 ring-offset-white"
                  : "border border-gray-300"
              }`}
            >
              {timer.label}
            </button>
          ))}
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600 disabled:opacity-50"
          onClick={() => {
            if (selectedTimer) {
              handleCreateGame();
              closeModal();
            } else {
              console.warn("No timer selected. Please choose a timer.");
            }
          }}
          disabled={!selectedTimer}
        >
          Play
        </button>

        <button
          onClick={() => closeModal()} 
          className="mt-4 text-red-500 hover:text-red-700 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default TimeModal;