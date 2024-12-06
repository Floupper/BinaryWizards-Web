import axiosInstance from '../utils/axiosInstance';

const RecapQuizService = {
  getGameQuestionsAndAnswers: async (quizId,questionId) => {
    return await axiosInstance.get(`/user/${quizId}/${questionId}`).then((response) => response.data);
  },

  getQuizDetails: async (quizId) => {
    return await axiosInstance.get(`/user/${quizId}`).then((response) => response.data);
  },
};

export default RecapQuizService;