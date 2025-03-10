import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';
import EmojiData from 'react-apple-emojis/src/data.json';
import { Emoji, EmojiProvider } from 'react-apple-emojis';

export default function HomeScreen() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = async (path, requiresAuth = false) => {
    setIsLoading(true);
    try {
      if (requiresAuth && !token) {
        navigate('/signin');
      } else {
        navigate(path);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F2EE]">
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/backgrounds/JoinQuizBackground.svg')" }}
    >
      <Navbar />
      <h1 className="text-4xl font-semibold mt-20 mb-24 text-white">Play Game</h1>
      <div className="flex flex-col items-center justify-center w-full md:w-10/12 px-6">
        <div className="flex flex-wrap justify-center gap-16 w-full h-[22rem] xl:h-[32rem] h-max">
          {/* Singleplayer Button */}
          <button
            onClick={() => handleNavigation('/join-quiz')}
            className="flex flex-col items-center w-full sm:w-4/12 md:w-1/5 justify-between bg-white py-8 rounded-3xl mb-6 transition duration-300 transform hover:scale-105 border-transparent border-[0.7rem] hover:border-[#FDD05C] shadow-md"
          >
            <div className="p-3 mt-[3rem]">
              <EmojiProvider data={EmojiData}>
                <Emoji name="beaming-face-with-smiling-eyes" width={70} />
              </EmojiProvider>
            </div>
            <h1 className="mt-auto text-center text-xl mb-5">Singleplayer</h1>
          </button>

          {/* Scrum Button */}
          <button
            onClick={() => handleNavigation('/scrum-mode-configure', true)}
            className="flex flex-col items-center w-full sm:w-4/12 md:w-1/5 justify-between bg-white py-8 rounded-3xl mb-6 transition duration-300 transform hover:scale-105 border-transparent border-[0.7rem] hover:border-[#417336] shadow-md"
          >
            <div className="flex gap-2 mt-[3rem]">
              <div className="p-3">
                <EmojiProvider data={EmojiData}>
                  <Emoji name="beaming-face-with-smiling-eyes" width={70} />
                </EmojiProvider>
              </div>
              <div className="p-3">
                <EmojiProvider data={EmojiData}>
                  <Emoji name="grinning-squinting-face" width={70} />
                </EmojiProvider>
              </div>
            </div>
            <h1 className="mt-auto text-center text-xl mb-5">Scrum</h1>
          </button>

          {/* Team Button */}
          <button
            onClick={() => handleNavigation('/team-mode-configure', true)}
            className="flex flex-col items-center w-full sm:w-4/12 md:w-1/5 justify-between bg-white py-8 rounded-3xl mb-6 transition duration-300 transform hover:scale-105 border-transparent border-[0.7rem] hover:border-[#F22828B2] shadow-md"
          >
            <div className="flex gap-2 mt-[3rem]">
              <div className="bg-[#F8766D] p-3 rounded-full">
                <EmojiProvider data={EmojiData}>
                  <Emoji name="beaming-face-with-smiling-eyes" width={70} />
                </EmojiProvider>
              </div>
              <div className="bg-[#597DDC] p-3 rounded-full">
                <EmojiProvider data={EmojiData}>
                  <Emoji name="grinning-squinting-face" width={70} />
                </EmojiProvider>
              </div>
            </div>
            <h1 className="mt-auto text-center text-xl mb-5">Team</h1>
          </button>
        </div>
      </div>
    </div>
  );
}