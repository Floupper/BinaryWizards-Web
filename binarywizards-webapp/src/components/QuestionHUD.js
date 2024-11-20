import React from 'react';
import { FiCopy } from 'react-icons/fi';
import { toast } from "react-toastify";

export default function QuestionHUD({ party_parameters }) {
  // Function to copy the quiz ID to clipboard
  const handleCopyIdToClipboard = () => {
    navigator.clipboard.writeText(party_parameters.idquizz).then(() => {
      toast.success("Quiz ID copied to clipboard!");
    }).catch(() => {
      toast.error("Error copying the quiz ID");
    });
  };

  return (
    <div>
      <h3>
        Quiz ID: {party_parameters.idquizz}
        <FiCopy className="copy-icon" onClick={handleCopyIdToClipboard} />
      </h3>
      <h3>Score: {party_parameters.score}</h3>
      <h3>Question: {party_parameters.question_index} / {party_parameters.nb_questions_total}</h3>
    </div>
  );
}
