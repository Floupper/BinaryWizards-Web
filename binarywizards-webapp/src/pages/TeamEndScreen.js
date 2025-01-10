import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

export default function TeamEndScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const { correctAnswersNb, totalQuestions, quizId } = location.state || {};

  if (!quizId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Données manquantes</h1>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/")}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

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
            borderRadius: "3.125rem", // 50px in rem
            width: "60.5625rem", // 969px in rem
            height: "27.5625rem", // 441px in rem
          }}
        >
          <EmojiProvider data={emojiData}>
            <div className="flex items-baseline justify-center mb-8">
              <Emoji name="party-popper" width={80} />
              <h1
                className="text-5xl font-bold mx-4"
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
            Score: {correctAnswersNb}/{totalQuestions}
          </h2>
          <div className="flex gap-8 justify-center">
            <button
              className="text-white font-bold py-4 px-8"
              style={{
                backgroundColor: "#000000",
                borderRadius: "1.09875rem", // 17.58px in rem
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: "1.5rem",
              }}
              onClick={() => navigate("/")}
            >
              Back to home page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
