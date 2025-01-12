import axiosInstance from "../utils/axiosInstance";

const ScrumModeService = {
  // Initialiser une partie Scrum
  initializeGame: async (quizId, gameData) => {
    try {
      const response = await axiosInstance.post(`/game/${quizId}/init`, gameData);
      return response.data;
    } catch (error) {
      console.error("Error initializing the game:", error);
      throw new Error("Unable to initialize game. Please check your input and try again.");
    }
  },

};

export default ScrumModeService;
