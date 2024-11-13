import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../assets/EndScreen.css";

export default function EndScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { score, totalScore } = location.state || { score: 0, totalScore: 0 };

    return (
        <div className="EndScreen">
            <div className="EndScreenContainer">
                <h1>Quiz Completed!</h1>
                <h2>Your Score: {score}/{totalScore}</h2>
                <button onClick={() => navigate('/')}>Back to home page</button>
            </div>
        </div>
    );
}
