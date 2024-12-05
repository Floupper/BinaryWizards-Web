import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HistoryGamePlayService from '../services/HistoryGamePlayService.js';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.js';

export default function HistoryGameHistory() {
    const { quizId } = useParams();
    const [playedGames, setPlayedGames] = useState([]);
    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (userId && quizId) {
            HistoryGamePlayService.getPlayedGames(userId, quizId)
                .then(data => setPlayedGames(data))
                .catch(error => toast.error('Error fetching played games:', error));
        }
    }, [userId, quizId]);

    return (
        <div className="GameHistoryContainer">
            <Navbar />
            <h1>Game History</h1>
            <p>Quiz ID: {quizId}</p>
            <div className="played-games-list">
                <ul>
                    {playedGames.length > 0 ? (
                        playedGames.map((game, index) => (
                            <li key={index}>
                                <div className="game-details">
                                    <span>Date: {game.date}</span>
                                    <span>Score: {game.score}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>No games played for this quiz.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
