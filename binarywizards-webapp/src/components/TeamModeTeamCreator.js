import React, { useState } from "react";

const TeamCreator = ({ onTeamsChange }) => {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");

  const handleAddTeam = () => {
    if (teamName.trim() !== "") {
      const newTeams = [...teams, teamName.trim()];
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
    <div className="p-6 rounded-lg shadow-lg w-full max-w-lg bg-white">
      <h2 className="text-lg font-semibold mb-4 text-center">Teams</h2>
      <div className="mb-4">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter team name"
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <button
        onClick={handleAddTeam}
        className="bg-green-500 text-white py-2 px-4 rounded-lg w-full hover:bg-green-600 disabled:opacity-50"
        disabled={!teamName.trim()}
      >
        Add Team
      </button>

      <ul className="mt-6">
        {teams.map((team, index) => (
          <li
            key={index}
            className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-2"
          >
            <span>{team}</span>
            <button
              onClick={() => handleRemoveTeam(index)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamCreator;
