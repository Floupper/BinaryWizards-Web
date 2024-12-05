import { toFormData } from 'axios';
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

export const fetchSearchedQuiz = async ({ text = '', difficulty = '', minQuestions, maxQuestions, page = 1 }) => {
  try {
    // Dynamically build query parameters
    const params = new URLSearchParams();

    // Add text only if it has a value
    if (text.trim()) {
      params.append('text', text);
    }

    // Add difficulty if provided
    if (difficulty.trim() && difficulty != 'all') {
      params.append('difficulty', difficulty);
    }

    params.append('minQuestions', minQuestions > 0 ? minQuestions : 0);
    params.append('maxQuestions', maxQuestions > 0 ? maxQuestions : 50);

    // Add standard parameters
    params.append('pageSize', 3);
    params.append('page', page);

    // Build the full URL
    const url = `/quiz/search?${params.toString()}`;

    // Make the request
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    toast.error("An error occurred while fetching quizzes.");
    console.error('Error fetching quizzes:', error);
    return null;
  }
};