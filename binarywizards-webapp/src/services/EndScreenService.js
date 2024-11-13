import config from '../config';
export async function resetQuiz(quizId) {
    try {
        const url = `${config.API_BASE_URL}quiz/${quizId}`;
        await fetch(`${url}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Quiz reset successfully");
        console.log(url);
    } catch (error) {
        console.error("Failed to reset quiz: ", error);
    }
}