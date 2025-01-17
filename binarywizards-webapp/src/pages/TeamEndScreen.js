import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";
import ConfettiComponent from "../animations/ConfettiComponent";
import Spinner from "../components/Spinner";

export default function TeamEndScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { ranking } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner size="8" className="text-black mb-4" />
      </div>
    );
  }

  if (!ranking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Missing data</h1>
        <button
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          onClick={() => navigate("/")}
        >
          Back to home
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
            borderRadius: "2rem",
          }}
        >
          <EmojiProvider data={emojiData}>
            <div className="flex items-center justify-center mb-8">
              <Emoji name="party-popper" width={60} />
              <h1
                className="text-4xl font-semibold mx-4"
                style={{
                  color: "#7A00FF",
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
              textAlign: "center",
            }}
          >
            Team results :
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(ranking).map(([teamName, teamData]) => (
              <div key={teamName} className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#7A00FF" }}>
                  {teamName}
                </h3>
                <p className="text-base mb-2">Score total : {teamData.total_score}</p>
                <p className="text-base mb-2">
                  Average score : {teamData.average_score !== null ? teamData.average_score.toFixed(2) : "0"}
                </p>
                <ul className="list-disc list-inside">
                  {teamData.members.length > 0 ? (
                    teamData.members.map((member) => (
                      <li key={member.username} className="text-sm">
                        {member.username} : {member.score} points
                      </li>
                    ))
                  ) : (
                    <li className="text-sm">No member in this team</li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              className="text-white font-semibold py-3 px-6 bg-black rounded-lg text-lg hover:bg-gray-800 transition"
              onClick={() => navigate("/")}
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
      <div>
        <ConfettiComponent width={window.innerWidth} height={window.innerHeight} />
      </div>
    </div>
  );
}