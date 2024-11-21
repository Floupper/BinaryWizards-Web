import axiosInstance from '../utils/axiosInstance';

const DashboardService = {
  getUserQuizzes: async (userId) => {
    return axiosInstance.get(`/user/${userId}/quizzes`).then((response) => response.data);
  },

  getPlayedQuizzes: async (userId) => {
    return axiosInstance.get(`/user/${userId}/playedQuizzes`).then((response) => response.data);
  },

  searchPublicQuizzes: async (title) => {
    return axiosInstance.get(`/quiz/search?title=${encodeURIComponent(title)}`).then((response) => response.data);
  },
};

export default DashboardService;
