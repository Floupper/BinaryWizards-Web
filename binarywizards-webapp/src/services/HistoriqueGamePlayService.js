import config from '../config';

const HistoriqueGamePlayService = {
  getPlayedGames: (userId, quizId) => {
    return fetch(`${config.API_BASE_URL}/user/${userId}/${quizId}/playedQuizzes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => response.json());
  }
};

export default HistoriqueGamePlayService;
