import config from '../config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const checkGameExists = async (gameCode) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}quiz/${gameCode}/question`);
    console.log(response);
    if (!response.ok) {
      throw new Error('Quiz not found');
    }
    return response.json();
  } catch (error) {
    throw new Error('Error checking quiz:');
    //throw error;
  }
};

export const createGameWithQuizId = async (quizId) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}game/${quizId}/create`);
    if (!response.ok) {
      throw new Error('QuizId not found');
    }
    return response.json();
  } catch (error) {
    throw new Error('Error during the creation of the game:');
    //throw error;
  }
};

