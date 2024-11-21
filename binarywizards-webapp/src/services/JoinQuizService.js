import axiosInstance from '../utils/axiosInstance';
import { toast } from "react-toastify";

export const checkGameExists = async (gameCode) => {
  try {
    const response = await axiosInstance.get(`/game/${gameCode}/question`);
    return response.data;
  } catch (error) {
    throw new Error('Error checking quiz:');
  }
};

export const createGameWithQuizId = async (quizId) => {
  try {
    const response = await axiosInstance.get(`/game/${quizId}/create`);
    return response.data;
  } catch (error) {
    throw new Error('Error during the creation of the game:');
  }
};
