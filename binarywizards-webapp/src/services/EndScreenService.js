import config from '../config';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export async function resetQuiz(gameId) {
    try {
        const url = `${config.API_BASE_URL}game/${gameId}/reset`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Failed to reset quiz");
        }

        const data = await response.json();

        //toast.info("Quiz reset successfully");

        return data;
    } catch (error) {
        toast.error(error.message || "Failed to reset quiz");
        throw error; 
    }
}