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
            <h1 className="text-3xl font-bold mt-[5rem] mb-[6rem]">Play Game</h1>
            <div className="flex flex-col items-center justify-center w-full px-6">
                <div className="flex px-20 w-8/12 text-center h-[24rem] gap-x-10">
                    <button
                        onClick={() => navigate('/join-quiz')}
                        className="flex flex-col items-center w-full justify-between bg-white py-4 rounded-lg mb-4 transition duration-300 pt-[8rem] hover:border-[0.5rem] hover:border-[#FDD05C]"
                    >
                        <div className='p-3'>
                            <EmojiProvider data={EmojiData}>
                                <Emoji name='beaming-face-with-smiling-eyes' width={50} />
                            </EmojiProvider>
                        </div>
                        <h1 className="mt-auto text-center text-xl mb-5">Singleplayer</h1>
                    </button>
                    <button
                        onClick={() => (token ? navigate('/scrum-mode-configure') : navigate('/signin'))}
                        className="flex flex-col items-center w-full justify-between bg-white py-4 rounded-lg mb-4 transition duration-300 pt-[8rem] hover:border-[0.5rem] hover:border-[#417336]"                    >
                        <div className='flex'>
                            <div className='p-3'>
                                <EmojiProvider data={EmojiData}>
                                    <Emoji name='beaming-face-with-smiling-eyes' width={50} />
                                </EmojiProvider>
                            </div>
                            <div className='p-3'>
                                <EmojiProvider data={EmojiData}>
                                    <Emoji name='grinning-squinting-face' width={50} />
                                </EmojiProvider>
                            </div>
                        </div>
                        <h1 className="mt-auto text-center text-xl mb-5">Scrum</h1>
                    </button>
                    <button
                        onClick={() => (token ? navigate('/team-mode-configure') : navigate('/signin'))}
                        className="flex flex-col items-center w-full justify-between bg-white py-4 rounded-lg mb-4 transition duration-300 pt-[8rem] hover:border-[0.5rem] hover:border-[#F22828B2]"                    >
                        <div className='flex gap-x-2'>
                            <div className='bg-[#F8766D] p-3 rounded-full'>
                                <EmojiProvider data={EmojiData}>
                                    <Emoji name='beaming-face-with-smiling-eyes' width={50} />
                                </EmojiProvider>
                            </div>
                            <div className='bg-[#597DDC] p-3 rounded-full'>
                                <EmojiProvider data={EmojiData}>
                                    <Emoji name='grinning-squinting-face' width={50} />
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