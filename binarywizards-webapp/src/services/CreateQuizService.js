import axiosInstance from '../utils/axiosInstance';
import config from '../config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
    }
    catch (error) {
      throw new Error('Erreur lors de la création du quizz');
    }
  },

  createQuiz: async (quizData, quizId) => {
    try {
      return axiosInstance.post(`/quiz/${quizId}`, quizData).then((response) => response.data);
    }
    catch (error) {
      throw new Error('Erreur lors de la création du quizz');
    }
  },


  updateQuestion: (questionData, quizId, questionId) => {
    try {
      return axiosInstance.post(`/quiz/${quizId}/${questionId}`, questionData).then((response) => response.data);
    }
    catch (error) {
      throw new Error('Erreur lors de la mise à jour de la question');
    }
  },




  createQuestion: (questionData, quizId) => {
    try {
      return axiosInstance.post(`/quiz/${quizId}/create_question`, questionData).then((response) => response.data);
    }
    catch (error) {
      throw new Error('Erreur lors de la création de la question');
    }
  },



  deleteQuestion: (quizId, questionId) => {
    try {
      return axiosInstance.delete(`/quiz/${quizId}/${questionId}}`).then((response) => response.data);
    }
    catch (error) {
      throw new Error('Erreur lors de la suppression de la question');
    }
  },

  initQuiz: () => {
    try {
      return axiosInstance.post(`/quiz/init`).then((response) => response.data);
    }
    catch (error) {
      throw new Error('Erreur lors de l\'initialisation du quizz');
    }
  },

  fetchQuizDetails: (quizId) => {
    try {
      return axiosInstance.get(`quiz/${quizId}`).then((response) => response.data);
    }
    catch (error) {
      throw new Error('Erreur lors de la récupération du quizz');
    }
  },


  fetchQuestionDetails: (quizId, questionId) => {
    try {
      return axiosInstance.get(`quiz/${quizId}/${questionId}`).then((response) => response.data);
    }
    catch (error) {
      throw new Error('Erreur lors de la récupération de la question');
    }
  },


  importQuestionTrivia: (questionData, quizId) => {
    try {
      return axiosInstance.post(`quiz/${quizId}/import_questions`, questionData).then((response) => response.data);
    }
    catch (error) {
      throw new Error('Erreur lors de l\'importation des questions');
    }
  },
};

export default CreateQuizService;