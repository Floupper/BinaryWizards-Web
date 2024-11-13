import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/HomeScreen.css';

export default function HomeScreen() {
    const navigate = useNavigate();

    return (
        <div className="App">
            <h1>Quiz</h1>
            <div className="button-group">
                <button onClick={() => navigate('/join-quiz')}>Rejoindre un quiz</button>
                <button onClick={() => navigate('/create-quiz')}>Créer un quiz</button>
            </div>
        </div>
    );
}
