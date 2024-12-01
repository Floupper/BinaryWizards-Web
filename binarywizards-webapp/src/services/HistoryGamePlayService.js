import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const HistoryGamePlayService = {
  getPlayedGames: async (userId, quizId) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}/${quizId}/playedQuizzes`);
      return response.data;
    } catch (error) {
      toast.error('Error fetching played games:', error);
    }
  },
  getStartedGames: async ({page = 1}) => {
    try {
      // Dynamically build query parameters
      const params = new URLSearchParams();
      params.append('pageSize', 3);
      params.append('page', page);
      const url = `game/user/started_games?${params.toString()}`;
  
      // Make the request
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      toast.error("An error occurred while fetching games.");
      console.error('Error fetching games:', error);
      return null;
    }
  }
}
export default HistoryGamePlayService;