import React, { useEffect, useState } from 'react';
import DashboardService from '../services/DashboardService.js';
import '../assets/Dashboard.css';
import PlayedQuizCard from '../components/PlayedQuizCard';
import CreatedQuizCard from '../components/CreatedQuizCard.js';

export default function Dashboard() {
    const [userQuizzes, setUserQuizzes] = useState([]);
    const [playedQuizzes, setPlayedQuizzes] = useState([]);
    const userId = localStorage.getItem('token');
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
              <div className="quiz-list scrollable">
                {userQuizzes.map((quiz) => (
                  <CreatedQuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            </div>
            <div className="played-quizzes">
              <h2>Your Played Quizzes</h2>
              <div className="quiz-list scrollable">
                {playedQuizzes.map((quiz) => (
                  <PlayedQuizCard key={quiz.game_id} quiz={quiz} />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
}
