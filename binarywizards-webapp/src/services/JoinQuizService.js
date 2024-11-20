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
<<<<<<< f6c9d2c501beeaa80e299e579f9b8aed0678052a
    throw new Error('Error checking quiz:');
    //throw error;
=======
    toast.info('Quizz not found');
    throw error;
>>>>>>> dbcbbab99aacb60e8a0684a559ffc3b6d93688e5
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

