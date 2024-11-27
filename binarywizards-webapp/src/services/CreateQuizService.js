import axiosInstance from '../utils/axiosInstance';

const CreateQuizService = {
  fetchCategories: async () => {
    return axiosInstance.get('/categories').then((response) => response.data);
  },

    
  fetchDifficulties: async () => {
    return axiosInstance.get('/difficulties').then((response) => response.data);
  },

  createAnonymeQuiz: async (quizData) => {
    return axiosInstance.post('/quiz', quizData).then((response) => response.data);
  },

  createQuiz: (quizData, quizId) => {
    return fetch(`${config.API_BASE_URL}quiz/${quizId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    })
    .then(async response => {
      if (!response.ok) {
        // Recovers response data even in the event of an error
        const errorData = await response.json();
        
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  },

  updateQuestion: (questionDat, quizId, questionId) => {
    return fetch(`${config.API_BASE_URL}quiz/${quizId}/${questionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionDat),
    })
    .then(async response => {
      if (!response.ok) {
        // Recovers response data even in the event of an error
        const errorData = await response.json();
        
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  },

  
  createQuestion: (questionDat, quizId) => {
    return fetch(`${config.API_BASE_URL}quiz/${quizId}/create_question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionDat),
    })
    .then(async response => {
      if (!response.ok) {
        // Recovers response data even in the event of an error
        const errorData = await response.json();
        
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  },


  deleteQuestion:(quizId, questionId) => {

    return fetch(`${config.API_BASE_URL}quiz/${quizId}/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      
    })
    .then(async response => {
      if (!response.ok) {
        // Recovers response data even in the event of an error
        const errorData = await response.json();
        
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });

  },
  initQuiz: () => {
    return fetch(`${config.API_BASE_URL}quiz/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async response => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  },

  fetchQuizDetails: (quizId) => {
    return fetch(`${config.API_BASE_URL}quiz/${quizId}`)
    .then(async response => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  },

  fetchQuestionDetails: (quizId, questionId) => {
    return fetch(`${config.API_BASE_URL}quiz/${quizId}/${questionId}`)
    .then(async response => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  },

  importQuestionTrivia: (questionDat, quizId) => {
    return fetch(`${config.API_BASE_URL}quiz/${quizId}/import_questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionDat),
    })
    .then(async response => {
      if (!response.ok) {
        // Recovers response data even in the event of an error
        const errorData = await response.json();
        
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  },
};

export default CreateQuizService;