import React, { useState } from "react";

const TeamCreator = ({ onTeamsChange }) => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");

  const handleAddTeam = () => {
    const trimmedName = teamName.trim();
    if (trimmedName !== "" && !teams.includes(trimmedName)) {
      const newTeams = [...teams, trimmedName];
      setTeams(newTeams);
      onTeamsChange(newTeams);
      setTeamName("");
    }
  };

  const handleRemoveTeam = (index) => {
    const updatedTeams = teams.filter((_, i) => i !== index);
    setTeams(updatedTeams);
    onTeamsChange(updatedTeams);
  };

  return (
    <div className="p-6 w-full max-w-lg">
      <div className="flex items-center mb-4 p-4 rounded-lg">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="w-full p-2 border-2 border-black rounded-lg focus:outline-none text-black bg-white"
        />
        <button
          onClick={handleAddTeam}
          className="w-36 ml-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 border"
          disabled={!teamName.trim() || teams.includes(teamName.trim())}
        >
          Add Team
        </button>
      </div>

      <div
        className={`p-6 rounded-lg w-full max-w-lg overflow-y-auto ${teams.length > 0 ? 'border-2' : ''}`}
        style={{
          borderColor: teams.length > 0 ? "#8B2DF1" : "transparent",
          backgroundColor: "transparent",
          maxHeight: "200px",
        }}
      >
        <ul>
          {teams.map((team, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white p-2 rounded-lg mb-2 border border-gray-300"
            >
              <span className="text-black">{team}</span>
              <button
                onClick={() => handleRemoveTeam(index)}
                className="text-red-500 hover:text-red-700"
              >
                &#10005;
              </button>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: white;
        }
        ::-webkit-scrollbar-thumb {
          background: #8B2DF1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default TeamCreator;
