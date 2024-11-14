import config from '../config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateQuizService = {
  fetchCategories: () => {
    return fetch(`${config.API_BASE_URL}categories`)
      .then(response => response.json());
  },
  
  fetchDifficulties: () => {
    return fetch(`${config.API_BASE_URL}difficulties`)
      .then(response => response.json());
  },

  createQuiz: (quizData) => {
    return fetch(`${config.API_BASE_URL}quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quizData),
    })
    .then(async response => {
      if (!response.ok) {
        // Recovers response data even in the event of an error
        const errorData = await response.json();
        
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  }
};

export default CreateQuizService;
