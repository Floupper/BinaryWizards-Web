import axiosInstance from "../utils/axiosInstance";

const TeamModeService = {
  // Initialiser une partie
  initializeGame: async (quizId, gameData) => {
    try {
      const response = await axiosInstance.post(`/game/${quizId}/init`, gameData);
      return response.data;
    } catch (error) {
      console.error("Error initializing the game:", error);
      throw new Error("Unable to initialize game. Please check your input and try again.");
    }
  },

  // Rejoindre une partie
  joinGame: async (gameId, teamName = null) => {
    const data = { game_id: gameId };
    if (teamName) {
      data.team_name = teamName;
    }
    try {
      const response = await axiosInstance.post(`/game/join`, data);
      return response.data;
    } catch (error) {
      console.error("Error joining the game:", error);
      throw new Error("Unable to join game. Please check the team and try again.");
    }
  },

  // Obtenir les informations d'une partie
  getGameInformations: async (gameId) => {
    try {
      const response = await axiosInstance.post(`/game/informations`, { game_id: gameId });
      console.log("Game informations fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching game information:", error);
      throw new Error("Unable to fetch game information. Please try again later.");
    }
  },
};

export default TeamModeService;
