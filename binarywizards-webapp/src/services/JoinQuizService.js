import config from '../config';

export const checkQuizExists = async (gameCode) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}quiz/${gameCode}/question`);
    if (!response.ok) {
      throw new Error('Quiz not found');
    }
    return response.json();
  } catch (error) {
    console.error('Error checking quiz:', error);
    throw error;
  }
};