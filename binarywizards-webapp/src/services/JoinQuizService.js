import axiosInstance from '../utils/axiosInstance';
import { toast } from "react-toastify";

export const checkGameExists = async (gameCode) => {
  const response = await axiosInstance.get(`/game/${gameCode}/question`);
  return response.data;
};

export const createGameWithQuizId = async (quizId) => {
  const response = await axiosInstance.get(`/game/${quizId}/create`);
  return response.data;
};
