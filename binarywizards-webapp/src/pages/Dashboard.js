import React, { useEffect, useState } from 'react';
import DashboardService from '../services/DashboardService';
import '../assets/Dashboard.css';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const [userQuizzes, setUserQuizzes] = useState([]);
    const [playedQuizzes, setPlayedQuizzes] = useState([]);
    const userId = localStorage.getItem('user_id');
    useEffect(() => {
        if (userId) {
            DashboardService.getUserQuizzes(userId)
                .then(data => setUserQuizzes(data))
                .catch(error => console.error('Error fetching user quizzes:', error));

            DashboardService.getPlayedQuizzes(userId)
                .then(data => setPlayedQuizzes(data))
                .catch(error => console.error('Error fetching played quizzes:', error));
        }
    }, [userId]);

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>

            <div className="quizzes-container">
                <div className="created-quizzes">
                    <h2>Your Created Quizzes</h2>
                    <div className="quiz-list">
                        <ul>
                            {userQuizzes.map((quiz) => (
                                <li key={quiz.id}>
                                    <Link to={`/dashboard/historique-game-play/${quiz.id}`}>
                                    Title: {quiz.title}, Difficulty: {quiz.difficulty}, Questions: {quiz.nb_questions}, Played: {quiz.nb_played}, Average Score: {quiz.average_score}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="played-quizzes">
                    <h2>Your Played Quizzes</h2>
                    <div className="quiz-list">
                        <ul>
                            {playedQuizzes.map((quiz) => (
                                <li key={quiz.quiz_id}>
                                    <Link to={`/dashboard/historique-game-play/${quiz.quiz_id}`}>
                                        Quiz ID: {quiz.quiz_id}, Date: {quiz.date}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
