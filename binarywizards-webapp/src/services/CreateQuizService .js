import config from '../config';

const CreateQuizService = {
  fetchCategories: () => {
    return fetch(`${config.API_BASE_URL}categories`)
      .then(response => response.json());
  },
  
  fetchDifficulties: () => {
    return fetch(`${config.API_BASE_URL}difficulties`)
      .then(response => response.json());
  },

  createQuiz: (quizData) => {
    return fetch(`${config.API_BASE_URL}quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  }
};

export default CreateQuizService;
