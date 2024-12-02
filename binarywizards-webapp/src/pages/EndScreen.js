import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createGameWithQuizId } from '../services/JoinQuizService';
import Navbar from "../components/Navbar";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

export default function EndScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { correct_answers_nb, nb_questions_total, quizId } = location.state || {
    correct_answers_nb: null,
    nb_questions_total: null,
    quizId: null,
  };

  useEffect(() => {
    if (correct_answers_nb === null || nb_questions_total === null || quizId === null) {
      navigate("/");
    }
  }, [correct_answers_nb, nb_questions_total, quizId, navigate]);

  const handleRestartQuiz = async () => {
    if (quizId) {
      const data = await createGameWithQuizId(quizId);
      navigate(`/question/${data.game_id}`);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center"
    style={{ backgroundImage: "url('/backgrounds/EndScreenBackground.svg')" }}
    >
      <Navbar />

      <div className="flex flex-col items-center justify-center"
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <ToastContainer />
        <div className="EndScreenContainer bg-white p-16 text-center"
          style={{
            borderRadius: "3.125rem", // 50px in rem
            width: "60.5625rem", // 969px in rem
            height: "27.5625rem", // 441px in rem
          }}
        >
          {correct_answers_nb !== null && nb_questions_total !== null ? (
            <>
              <EmojiProvider data={emojiData}>
                <div className="flex items-baseline justify-center mb-8">
                  <Emoji name="party-popper" width={80} />
                  <h1 className="text-5xl font-bold mx-4"
                    style={{
                      color: "#7A00FF",
                      fontFamily: "Sifonn, sans-serif"
                    }}
                  >
                    Quiz Completed!
                  </h1>
                  <Emoji name="party-popper" width={80} />
                </div>
              </EmojiProvider>
              <h2 className="text-5xl mb-10"
                style={{
                  color: "#000000",
                  fontFamily: "Helvetica, Arial, sans-serif",
                  textAlign: "center"
                }}
              >
                Score: {correct_answers_nb}/{nb_questions_total}
              </h2>
              <div className="flex gap-8 justify-center">
                <button
                  className="text-white font-bold py-4 px-8"
                  style={{
                    backgroundColor: "#000000",
                    borderRadius: "1.09875rem", // 17.58px in rem
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "1.5rem"
                  }}
                  onClick={() => navigate("/")}
                >
                  Back to home page
                </button>
                <button
                  className="text-white font-bold py-4 px-8"
                  style={{
                    backgroundColor: "#000000",
                    borderRadius: "1.09875rem", // 17.58px in rem
                    fontFamily: "Helvetica, Arial, sans-serif",
                    fontSize: "1.5rem"
                  }}
                  onClick={handleRestartQuiz}
                >
                  Restart Quiz
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
