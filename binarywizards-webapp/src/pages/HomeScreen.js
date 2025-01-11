import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function HomeScreen() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    return (
        <div
            className="min-h-screen flex flex-col items-center bg-cover bg-center text-white"
            style={{ backgroundImage: "url('/backgrounds/JoinQuizBackground.svg')" }}
        >
            <Navbar />
            <div className="flex flex-col items-center justify-center flex-grow w-full px-6">
                <div className="bg-opacity-90 bg-gray-900 p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <h1 className="text-3xl font-bold mb-6">Play</h1>
                    <button
                        onClick={() => navigate('/join-quiz')}
                        className="flex justify-center w-full bg-purple-600 text-white hover:bg-purple-700 py-4 rounded-lg mb-4 transition duration-300"
                    >
                        Singleplayer
                    </button>
                    <div className="w-full h-[2px] bg-purple-500 mb-6"></div>
                    <button
                        onClick={() => (token ? navigate('/scrum') : navigate('/signin'))}
                        className="flex justify-center w-full bg-purple-600 text-white hover:bg-purple-700 py-4 rounded-lg mb-4 transition duration-300"
                    >
                        Scrum
                    </button>
                    <button
                        onClick={() => (token ? navigate('/team') : navigate('/signin'))}
                        className="flex justify-center w-full bg-purple-600 text-white hover:bg-purple-700 py-4 rounded-lg transition duration-300"
                    >
                        Team
                    </button>
                </div>
            </div>
        </div>
    );
}