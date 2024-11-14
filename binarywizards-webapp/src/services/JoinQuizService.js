import config from '../config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const checkQuizExists = async (gameCode) => {
  try {
    const response = await fetch(`${config.API_BASE_URL}quiz/${gameCode}/question`);
    if (!response.ok) {
      toast.error('Quiz not found');
    }
    return response.json();
  } catch (error) {
    toast.error('Error checking quiz:', error);
    //throw error;
  }
};