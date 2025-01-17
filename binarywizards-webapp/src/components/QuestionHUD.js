import React from "react";
import { FiCopy } from "react-icons/fi";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";
import { renderDifficultyStars } from "./DashboardCreatedQuizCard";

export default function QuestionHUD({ party_parameters }) {
  const token = localStorage.getItem("token");
  const index = Math.max(party_parameters.question_index - 1, 0);

  const handleCopyGameIdToClipboard = () => {
    navigator.clipboard
      .writeText(party_parameters.idparty)
      .then(() => {
        toast.success("Game ID copied to clipboard!");
      })
      .catch(() => {
        toast.error("Error copying the Game ID");
      });
  };

  return (
    <div className="flex flex-col rounded-lg shadow-lg p-4 sm:p-6">
      {/* Progress Bar */}
      <ProgressBar
        progress={(index / party_parameters.nb_questions_total) * 100 || 0}
      />

      <div className="flex flex-col sm:flex-row sm:justify-between items-baseline flex-wrap pb-4">
        {/* Game ID (shown only if no token is present) */}
        {!token && (
          <div className="flex space-x-2 text-gray-700 mb-2 sm:mb-0">
            <h3 className="text-sm md:text-lg font-medium">
              ID: <span className="font-semibold text-gray-900">{party_parameters.idparty}</span>
            </h3>
            <FiCopy
              className="text-xl cursor-pointer text-gray-500 hover:text-gray-900"
              onClick={handleCopyGameIdToClipboard}
              aria-label="Copy Game ID"
            />
          </div>
        )}

        {/* Category */}
        <div className="flex flex-row mb-2 sm:mb-0">
          <h3 className="text-sm md:text-lg font-medium text-gray-700">
            Category: {party_parameters.category}
          </h3>
        </div>

        {/* Difficulty */}
        <div className="flex items-baseline flex-row mb-2 sm:mb-0">
          <h3 className="text-sm md:text-lg font-medium text-gray-700">
            Difficulty:
          </h3>
          <p>{renderDifficultyStars(party_parameters.difficulty)}</p>
        </div>

        {/* Score */}
        <div className="sm:ml-4">
          <h3 className="text-sm md:text-lg font-medium text-gray-700">
            Score:{" "}
            <span className="font-semibold text-gray-900">
              {party_parameters.score} / {party_parameters.nb_questions_total}
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}