import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGameWithQuizId } from "../services/JoinQuizService";
import Navbar from "../components/Navbar";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";
import ConfettiComponent from "../animations/ConfettiComponent";
import Spinner from "../components/Spinner";

export default function EndScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    difficulty_level,
    correct_answers_nb,
    nb_questions_total,
    quizId
  } = location.state || {};

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!nb_questions_total || !quizId) {
      navigate("/");
    }
  }, [correct_answers_nb, nb_questions_total, quizId]);

  const handleRestartQuiz = async () => {
    if (!quizId) return;

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
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/backgrounds/EndScreenBackground.svg')" }}
    >
      <Navbar />
      <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="EndScreenContainer bg-white p-6 sm:p-16 text-center rounded-3xl w-full max-w-3xl">
          {correct_answers_nb != null && nb_questions_total ? (
            <>
              <EmojiProvider data={emojiData}>
                <div className="flex items-baseline justify-center mb-8">
                  <div className="hidden md:block">
                    <Emoji name="party-popper" width={80} />
                  </div>
                  <h1
                    className="text-4xl sm:text-5xl font-semibold mx-4"
                    style={{
                      color: "#7A00FF",
                    }}
                  >
                    Quiz Completed!
                  </h1>
                  <div className="hidden md:block">
                    <Emoji name="party-popper" width={80} />
                  </div>
                </div>
              </EmojiProvider>
              <h2
                className="text-3xl sm:text-5xl mb-10"
                style={{
                  color: "#000000",
                  textAlign: "center",
                }}
              >
                Score: {correct_answers_nb}/{nb_questions_total}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center">
                {/* Bouton retour à l'accueil */}
                <button
                  className="text-white font-semibold py-4 px-8 transition hover:bg-gray-800 bg-black rounded-xl text-lg sm:text-2xl"
                  onClick={() => navigate("/")}
                  aria-label="Back to Home Page"
                >
                  Back to home page
                </button>

                {/* Bouton redémarrer le quiz */}
                <button
                  className={`text-white font-semibold py-4 px-8 flex items-center justify-center transition ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"} bg-black rounded-xl text-lg sm:text-2xl`}
                  onClick={handleRestartQuiz}
                  disabled={isLoading}
                  aria-label="Restart Quiz"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Spinner size="5" className="mr-2" />
                    </div>
                  ) : (
                    "Restart Quiz"
                  )}
                </button>
              </div>
            </>
          ) : (
            <p className="errorMessage text-red-500 text-2xl">
              Error: The result could not be retrieved.
            </p>
          )}
        </div>
      </div>
      <div>
        <ConfettiComponent width={window.innerWidth} height={window.innerHeight} />
      </div>
    </div>
  );
}