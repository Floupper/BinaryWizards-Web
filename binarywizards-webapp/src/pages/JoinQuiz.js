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
        <div className="flex items-center justify-center mt-5 bg-white shadow-md w-full sm:w-10/12 lg:w-7/12 py-7 mt-[5rem] rounded-xl">
          {token ? (
            <div className="flex flex-col items-center w-full">
              <div className="flex space-x-8 mb-5">
                <button
                  onClick={() => setActiveTab('resume')}
                  className={`text-2xl sm:text-xl ${activeTab === 'resume' ? 'border-b-4 border-[#8B2DF1] font-semibold' : ''}`}
                >
                  Resume Game
                </button>
                <button
                  onClick={() => setActiveTab('search')}
                  className={`text-2xl sm:text-xl ${activeTab === 'search' ? 'font-semibold border-b-4 border-[#8B2DF1]' : ''}`}
                >
                  Search Quiz
                </button>
              </div>
              {activeTab === 'search' ? (
                <JoinQuizSearchQuiz enableModal={true} />
              ) : (
                <JoinQuizResumeGame />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center w-11/12">
              <div className="p-8 rounded-lg w-8/12 text-center">
                <h1 className="text-4xl font-semibold mb-10 ">Resume Game</h1>
                <div className="form-group mb-4">
                  <input
                    type="text"
                    id="gameCode"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    placeholder="Enter the quiz id"
                    className="p-3 sm:p-2 rounded-lg border border-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-800 w-full sm:w-3/4 mb-6"
                  />
                </div>
                <button
                  onClick={handleJoinGame}
                  disabled={isLoadingGame}
                  className="w-full sm:w-[30%] bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 mb-8"
                >
                  {isLoadingGame ? 'Playing...' : 'Play'}
                </button>
              </div>

              <div className="p-6 rounded-lg text-center w-8/12">
                <div className="mx-auto w-8/12 h-1 bg-[#8B2DF1] mb-4 px-2"></div>
                <button
                  onClick={handleCreateQuiz}
                  className="flex mx-auto justify-center w-8/12 bg-black  text-white hover:bg-black hover:text-white py-4 rounded-2xl  transition duration-300 gap-x-4"
                >
                  <div>
                    <span className='text-2xl'>                
                        Quick Quiz
                    </span>
                  </div>
                  <EmojiProvider data={emojiData}>
                    <Emoji name="bomb" width={30} />
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