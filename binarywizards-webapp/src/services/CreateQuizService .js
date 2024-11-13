const API_BASE_URL = 'http://klebert-host.com:33012/';

const CreateQuizService = {
  fetchCategories: () => {
    return fetch(`${API_BASE_URL}categories`)
      .then(response => response.json());
  },
  
  fetchDifficulties: () => {
    return fetch(`${API_BASE_URL}difficulties`)
      .then(response => response.json());
  },

  createQuiz: (quizData) => {
    return fetch(`${API_BASE_URL}quiz`, {
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
