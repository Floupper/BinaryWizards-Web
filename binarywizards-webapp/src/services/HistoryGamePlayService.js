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

  getStartedGames: async () => {
    try {
      const response = await axiosInstance.get(`game/user/started_games`);
      return response.data;
    } catch (error) {
      toast.error('Error fetching started games:', error);
    }
  },
};

export default HistoryGamePlayService;