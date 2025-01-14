import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGameWithQuizId } from "../services/JoinQuizService";
import Navbar from "../components/Navbar";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

export default function EndScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { difficulty_level, correct_answers_nb, nb_questions_total, quizId } = location.state || {
    correct_answers_nb: null,
    nb_questions_total: null,
    quizId: null,
  };
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (correct_answers_nb === null || nb_questions_total === null || quizId === null) {
      navigate("/");
    }
  }, [correct_answers_nb, nb_questions_total, quizId, navigate]);

  const handleRestartQuiz = async () => {
    if (quizId) {
      setIsLoading(true);
      try {
        const data = await createGameWithQuizId(quizId, difficulty_level);
        navigate(`/question/${data.game_id}`);
      } catch (error) {
        console.error("Error restarting quiz:", error);
        toast.error(error.message || "Failed to restart quiz. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/backgrounds/EndScreenBackground.svg')" }}
    >
      <Navbar />
      <div
        className="flex flex-col items-center justify-center"
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <div
          className="EndScreenContainer bg-white p-16 text-center"
          style={{
            borderRadius: "3.125rem",
            width: "60.5625rem",
            height: "27.5625rem",
          }}
        >
          {correct_answers_nb !== null && nb_questions_total !== null ? (
            <>
              <EmojiProvider data={emojiData}>
                <div className="flex items-baseline justify-center mb-8">
                  <Emoji name="party-popper" width={80} />
                  <h1
                    className="text-5xl font-semibold mx-4"
                    style={{
                      color: "#7A00FF",
                      fontFamily: "Sifonn, sans-serif",
                    }}
                  >
                    Quiz Completed!
                  </h1>
                  <Emoji name="party-popper" width={80} />
                </div>
              </EmojiProvider>
              <h2
                className="text-5xl mb-10"
                style={{
                  color: "#000000",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  textAlign: "center",
                }}
              >
                Score: {correct_answers_nb}/{nb_questions_total}
              </h2>
              <div className="flex gap-8 justify-center">
                <button
                  className="text-white font-semibold py-4 px-8 transition hover:bg-gray-800"
                  style={{
                    backgroundColor: "#000000",
                    borderRadius: "1.09875rem",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "1.5rem",
                  }}
                  onClick={() => navigate("/")}
                >
                  Back to home page
                </button>
                <button
                  className={`text-white font-semibold py-4 px-8 flex items-center justify-center transition ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
                  style={{
                    backgroundColor: "#000000",
                    borderRadius: "1.09875rem",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "1.5rem",
                  }}
                  onClick={handleRestartQuiz}
                  disabled={isLoading}
                  aria-label="Restart Quiz"
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    "Restart Quiz"
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="errorMessage text-red-500 text-2xl">Error: The result could not be retrieved.</p>
          )}
        </div>
      </div>
    </div>
  );
}