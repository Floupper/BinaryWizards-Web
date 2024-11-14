import config from '../config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export async function resetQuiz(quizId) {
    try {
        const url = `${config.API_BASE_URL}quiz/${quizId}`;
        await fetch(`${url}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        toast.info("Quiz reset successfully");
    } catch (error) {
        toast.error("Failed to reset quiz: "+ error);
    }
}