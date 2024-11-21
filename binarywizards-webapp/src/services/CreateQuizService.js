import axiosInstance from '../utils/axiosInstance';

const CreateQuizService = {
  fetchCategories: async () => {
    return axiosInstance.get('/categories').then((response) => response.data);
  },

  fetchDifficulties: async () => {
    return axiosInstance.get('/difficulties').then((response) => response.data);
  },

  createQuiz: async (quizData) => {
    return axiosInstance.post('/quiz', quizData).then((response) => response.data);
  },
};

export default CreateQuizService;