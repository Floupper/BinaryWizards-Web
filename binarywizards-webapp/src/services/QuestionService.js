import config from '../config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export async function GetQuestion(id_quizz) {
    return fetch(`${config.API_BASE_URL}quiz/${id_quizz}/question`)
      .then(response => {
        if (!response.ok) {
          toast.error('Data recovery error');
        }
        return response.json();
      })
      .catch(error => {
        throw error;
      });
  }
  

  export async function PostAnswers(id_quizz, index_question, index_reponse) {
    const quizQuestionPost = {
      question_index: index_question,
      option_index: index_reponse,
    };
  
    return fetch(`${config.API_BASE_URL}quiz/${id_quizz}/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizQuestionPost),
    })
      .then(response => {
        if (!response.ok) {
          toast.error('Error sending responses');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error sending response:', error);
        throw error;
      });
  }