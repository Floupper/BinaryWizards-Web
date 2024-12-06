import axiosInstance from '../utils/axiosInstance';

const CreateQuizService = {
  fetchCategories: async () => {
    return axiosInstance.get('/categories').then((response) => response.data);
  },

  fetchDifficulties: async () => {
    return axiosInstance.get('/difficulties').then((response) => response.data);
  },

  createAnonymeQuiz: async (quizData) => {
    try {
      return axiosInstance.post('/quiz', quizData).then((response) => response.data);
    } catch (error) {
      throw new Error('Error creating the quiz');
    }
  },

  createQuiz: async (quizData, quizId) => {
    try {

      return axiosInstance.post(`/quiz/${quizId}`, quizData).then((response) => response.data);
    } catch (error) {
      throw new Error('Error creating the quiz');
    }
  },

  updateQuestion: (questionData, quizId, questionId) => {
    try {
      return axiosInstance.post(`/quiz/${quizId}/${questionId}`, questionData).then((response) => response.data);
    } catch (error) {
      throw new Error('Error updating the question');
    }
  },

  createQuestion: (questionData, quizId) => {
    try {
      return axiosInstance.post(`/quiz/${quizId}/create_question`, questionData).then((response) => response.data);
    } catch (error) {
      throw new Error('Error creating the question');
    }
  },

  deleteQuestion: (quizId, questionId) => {
    try {
      return axiosInstance.delete(`/quiz/${quizId}/${questionId}`).then((response) => response.data);
    } catch (error) {
      throw new Error('Error deleting the question');
    }
  },

  initQuiz: () => {
    try {
      return axiosInstance.post(`/quiz/init`).then((response) => response.data);
    } catch (error) {
      throw new Error('Error initializing the quiz');
    }
  },

  fetchQuizDetails: (quizId) => {
    try {
      return axiosInstance.get(`quiz/${quizId}`).then((response) => response.data);
    } catch (error) {
      throw new Error('Error fetching the quiz details');
    }
  },

  fetchQuestionDetails: (quizId, questionId) => {
    try {
      return axiosInstance.get(`quiz/${quizId}/${questionId}`).then((response) => response.data);
    } catch (error) {
      throw new Error('Error fetching the question details');
    }
  },

  importQuestionTrivia: (questionData, quizId) => {
    try {
      return axiosInstance.post(`quiz/${quizId}/import_questions`, questionData).then((response) => response.data);
    } catch (error) {
      throw new Error('Error importing the questions');
    }
  },
};

export default CreateQuizService;
