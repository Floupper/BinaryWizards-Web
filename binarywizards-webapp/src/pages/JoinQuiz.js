import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from '../components/Navbar';
import { checkGameExists } from '../services/JoinQuizService';
import JoinQuizSearchQuiz from '../components/JoinQuizSearchQuiz';
import JoinQuizResumeGame from '../components/JoinQuizResumeGame';
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

const queryClient = new QueryClient();

export default function JoinQuiz() {
  const token = localStorage.getItem('token');
  const [gameCode, setGameCode] = useState('');
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  const [activeTab, setActiveTab] = useState('resume');
  const navigate = useNavigate();

  const handleJoinGame = async () => {
    if (gameCode.trim() === '') {
      toast.info('Please enter a valid quiz code.');
      return;
    }
    setIsLoadingGame(true);

    try {
      await checkGameExists(gameCode);
      navigate(`/question/${gameCode}`);
    } catch (error) {
      toast.error(error.message || 'Failed to join game');
    } finally {
      setIsLoadingGame(false);
    }
  };

  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-cover bg-center items-center"
        style={{ backgroundImage: "url('/backgrounds/SinglePlayerQuiz.svg')" }}
      >
        <Navbar />
        <div className="flex items-center justify-center mt-5 bg-white w-7/12 pt-10 rounded-xl">
          {token ? (
            <div className="flex flex-col items-center">
              <div className="flex space-x-8"> 
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`text-3xl ${activeTab === 'resume' ? 'border-b-4 border-[#8B2DF1] font-semibold' : ''}`}
                >
                  Resume Game
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`text-3xl ${activeTab === 'search' ? 'font-semibold border-b-4 border-[#8B2DF1]' : ''}`}
                >
                  Search Quiz
                </button>
              </div>
              {activeTab === 'search' ?(
                <JoinQuizSearchQuiz
                    enableModal={true}
                /> )
                : (<JoinQuizResumeGame />)}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="p-8 rounded-lg w-full text-center">
                <h1 className="text-4xl font-bold mb-6 text-white">Play Quiz</h1>
                <div className="form-group mb-4">
                  <input
                    type="text"
                    id="gameCode"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    placeholder="Enter the quiz id"
                    className="p-2 rounded-lg border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                  />
                </div>
                <button
                  onClick={handleJoinGame}
                  disabled={isLoadingGame}
                  className="w-[30%] bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 mb-8"
                >
                  {isLoadingGame ? 'Playing...' : 'Play'}
                </button>
              </div>

              <div className="p-6 rounded-lg text-center w-full mt-40">
                <div className="w-full h-1 bg-[#8B2DF1] mb-4 px-2"></div>
                <button
                  onClick={handleCreateQuiz}
                  className="flex justify-center w-full bg-black  text-white hover:bg-black hover:text-white py-4 rounded-2xl  transition duration-300"
                >
                  Create Quiz
                  <EmojiProvider data={emojiData}>
                    <Emoji name="paintbrush" width={20} />
                  </EmojiProvider>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}
