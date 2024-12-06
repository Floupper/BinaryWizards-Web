import axiosInstance from '../utils/axiosInstance';
import { toast } from "react-toastify";

export async function GetQuestion(id_quizz) {
  try {
    const response = await axiosInstance.get(`/game/${id_quizz}/question`);
    return response.data;
  } catch (error) {
    toast.error('Data recovery error');
    throw error;
  }
}

export async function PostAnswers(id_game, index_question, index_reponse) {
  const quizQuestionPost = {
    question_index: index_question,
    option_index: index_reponse,
  };
  const response = await axiosInstance.post(`/game/${id_game}/question`, quizQuestionPost);
  return response.data;
}