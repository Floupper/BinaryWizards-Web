import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EmojiData from 'react-apple-emojis/src/data.json'
import { Emoji, EmojiProvider } from 'react-apple-emojis';
export default function HomeScreen() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    return (
        <div
            className="min-h-screen flex flex-col items-center bg-cover bg-center"
            style={{ backgroundImage: "url('/backgrounds/JoinQuizBackground.svg')" }}
        >
            <Navbar />
            <div className="flex flex-col items-center justify-center flex-grow w-full px-6">
                <h1 className="text-3xl font-bold mb-20">Play Game</h1>
                <div className="flex px-20 w-full text-center h-[20rem] gap-x-10">
                    <button
                        onClick={() => navigate('/join-quiz')}
                        className="flex flex-col items-center justify-between w-8/12 bg-white py-4 rounded-lg mb-4 transition duration-300 pt-20"
                    >
                        <EmojiProvider data={EmojiData}>
                            <Emoji name='smiling-face-with-halo' width={60} />
                        </EmojiProvider>
                        <h1 className="mt-auto text-center text-xl">Singleplayer</h1>
                    </button>
                    <button
                        onClick={() => (token ? navigate('/scrum-mode-configure') : navigate('/signin'))}
                        className="flex justify-center w-full bg-purple-600 text-white hover:bg-purple-700 py-4 rounded-lg mb-4 transition duration-300"
                    >
                        Scrum
                    </button>
                    <button
                        onClick={() => (token ? navigate('/team-mode-configure') : navigate('/signin'))}
                        className="flex justify-center w-full bg-purple-600 text-white hover:bg-purple-700 py-4 rounded-lg transition duration-300"
                    >
                        Team
                    </button>
                </div>
            </div>
        </div>
    );
}