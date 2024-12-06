import React from 'react';
import { FiCopy } from 'react-icons/fi';
import { toast } from "react-toastify";
import DifficultyQuizStars from './GlobalQuizDifficultyStars';
import ProgressBar from './ProgressBar';

export default function QuestionHUD({ party_parameters }) {
  const token = localStorage.getItem('token');

  const handleCopyGameIdToClipboard = () => {
    navigator.clipboard.writeText(party_parameters.idparty).then(() => {
      toast.success("Game ID copied to clipboard!");
    }).catch(() => {
      toast.error("Error copying the game ID");
    });
  };

  return (
    <>
      <div className="flex flex-col  rounded-lg shadow-lg ">

        <ProgressBar progress={(party_parameters.question_index / party_parameters.nb_questions_total) * 100 || 100} />

        <div className="flex justify-around items-baseline flex-wrap pb-4">
          {/* Quiz ID */}
          {!token && (
            <div className="flex  space-x-2 text-gray-700">
              <h3 className="text-sm md:text-lg font-medium">
                ID: <span className="font-semibold text-gray-900">{party_parameters.idparty}</span>
              </h3>
              <FiCopy
                className="text-xl cursor-pointer text-gray-500 hover:text-gray-900"
                onClick={handleCopyGameIdToClipboard}
              />
            </div>
          )}
          {/* Categpry */}
          <div className="flex flex-row">
            <h3 className="text-sm md:text-lg font-medium text-gray-700">Category: {party_parameters.category}</h3>

          </div>
          {/* Difficulty */}
          <div className="flex items-baseline flex-row">
            <h3 className="text-sm md:text-lg font-medium text-gray-700">Difficulty:</h3>
            <DifficultyQuizStars initialDifficulty={party_parameters.difficulty} />
          </div>

          {/* Score */}
          <div>
            <h3 className="text-sm md:text-lg font-medium text-gray-700">
              Score: <span className="font-semibold text-gray-900">{party_parameters.score}</span>
            </h3>
          </div>
        </div>

      </div>
    </>
  );
}
