import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/HomeScreen.css';
import Navbar from '../components/Navbar';

export default function HomeScreen() {
    const navigate = useNavigate();

    return (
        <div className="App">
            <Navbar />
            <h1>Quiz</h1>
            <div className="button-group">
                <button onClick={() => navigate('/create-quiz')}>Create quiz</button>
                <button onClick={() => navigate('/join-quiz')}>Join quiz</button>
            </div>
        </div>
    );
}
