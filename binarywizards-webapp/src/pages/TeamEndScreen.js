import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

export default function TeamEndScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const { ranking } = location.state || {};

  if (!ranking) {
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

      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div
          className="EndScreenContainer bg-white p-8 text-center w-full max-w-4xl"
          style={{
            borderRadius: "2rem", // 32px
          }}
        >
          <EmojiProvider data={emojiData}>
            <div className="flex items-center justify-center mb-8">
              <Emoji name="party-popper" width={60} />
              <h1
                className="text-4xl font-bold mx-4"
                style={{
                  color: "#7A00FF",
                  fontFamily: "Sifonn, sans-serif",
                }}
              >
                Quiz Completed!
              </h1>
              <Emoji name="party-popper" width={60} />
            </div>
          </EmojiProvider>
          <h2
            className="text-2xl mb-6"
            style={{
              color: "#000000",
              fontFamily: "Helvetica, Arial, sans-serif",
              textAlign: "center",
            }}
          >
            Résultats par équipe :
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(ranking).map(([teamName, teamData]) => (
              <div key={teamName} className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-bold mb-2" style={{ color: "#7A00FF" }}>
                  {teamName}
                </h3>
                <p className="text-base mb-2">Score total : {teamData.total_score}</p>
                <p className="text-base mb-2">
                  Score moyen : {teamData.average_score !== null ? teamData.average_score.toFixed(2) : "N/A"}
                </p>
                <ul className="list-disc list-inside">
                  {teamData.members.length > 0 ? (
                    teamData.members.map((member) => (
                      <li key={member.username} className="text-sm">
                        {member.username} : {member.score} points
                      </li>
                    ))
                  ) : (
                    <li className="text-sm">Aucun membre dans cette équipe</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              className="text-white font-bold py-3 px-6 bg-black rounded-lg text-lg"
              onClick={() => navigate("/")}
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
