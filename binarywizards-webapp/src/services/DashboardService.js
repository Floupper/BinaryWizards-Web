import config from '../config';

const DashboardService = {
  getUserQuizzes: (userId) => {
    return fetch(`${config.API_BASE_URL}/user/${userId}/quizzes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json());
  },

  getPlayedQuizzes: (userId) => {
    return fetch(`${config.API_BASE_URL}/user/${userId}/playedQuizzes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json());
  },

  searchPublicQuizzes: (title) => {
    return fetch(`${config.API_BASE_URL}/quiz/search?title=${encodeURIComponent(title)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json());
  }
};

export default DashboardService;
