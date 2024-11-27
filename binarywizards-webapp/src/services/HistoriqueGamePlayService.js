import axiosInstance from '../utils/axiosInstance';

const HistoriqueGamePlayService = {
  getPlayedGames: async (userId, quizId) => {
    return axiosInstance.get(`/user/${userId}/${quizId}/playedQuizzes`).then((response) => response.data);
  },
};

export default HistoriqueGamePlayService;