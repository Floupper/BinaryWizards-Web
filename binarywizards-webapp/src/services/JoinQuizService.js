import axiosInstance from '../utils/axiosInstance';
import { toast } from "react-toastify";

export const checkGameExists = async (gameCode) => {
  const response = await axiosInstance.get(`/game/${gameCode}/question`);
  return response.data;
};

export const createGameWithQuizId = async (quizId, difficulty) => {
  const mode = difficulty === 'none' ? 'standard' : 'time';
  const body = {
    ...(difficulty !== 'none' && { difficulty_level: difficulty }),
    mode: mode
  };
  const response = await axiosInstance.post(`/game/${quizId}/init`, body);
  return response.data;
};

export const deleteQuiz = async (quizId) => {
  const response = await axiosInstance.delete(`/quiz/${quizId}/`);
  return response.data;
};

export const fetchSearchedQuiz = async ({ text = '', difficulty = '', minQuestions, maxQuestions, page = 1 }) => {
  try {
    const params = new URLSearchParams();

    if (text.trim()) {
      params.append('text', text);
    }
    if (difficulty.trim() && difficulty !== 'all') {
      params.append('difficulty', difficulty);
    }

    params.append('minQuestions', minQuestions > 0 ? minQuestions : 0);
    params.append('maxQuestions', maxQuestions > 0 ? maxQuestions : 50);
    params.append('pageSize', 3);
    params.append('page', page);

    const url = `/quiz/search?${params.toString()}`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    toast.error("An error occurred while fetching quizzes.");
    console.error('Error fetching quizzes:', error);
    return null;
  }
};

export const fetchUsername = async () => {
  try {
    const response = await axiosInstance.get(`/user/username`);
    console.log('Username fetched:', response.data);
    if (response.data) {
      localStorage.setItem("username", response.data);
      console.log("Username fetched:", response.data);
      return response.data.username;
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    toast.error("Failed to retrieve username.");
    return null;
  }
};
