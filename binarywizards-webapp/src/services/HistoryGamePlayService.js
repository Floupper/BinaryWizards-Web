import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const HistoryGamePlayService = {
  getPlayedGames: async (userId, quizId) => {
    try {
      const response = await axiosInstance.get(`/user/${userId}/${quizId}/playedQuizzes`);
      return response.data;
    } catch (error) {
      throw new error('Error fetching played games:', error);
    }
  },
  getStartedGames: async ({page = 1}) => {
    try {
      const params = new URLSearchParams();
      params.append('pageSize', 6);
      params.append('page', page);
      const url = `game/user/started_games?${params.toString()}`;
  
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      throw new error("An error occurred while fetching games.");
    }
  }
}
export default HistoryGamePlayService;