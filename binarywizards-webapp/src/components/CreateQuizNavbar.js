import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import DifficultyQuizStars from './GlobalQuizDifficultyStars';
import { toast } from 'react-toastify';

export default function CreateQuizNavbar({ handleSubmitSave, quiz, setQuiz }) {
    const [isOpen, setIsOpen] = useState(false);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const handleOnDifficultyChange = (newDifficulty) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            difficulty: newDifficulty,
        }));
    };

    const handleChangeIsPublicQuiz = (event) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            isPublic: event.target.checked,
        }));
    };
    const handleChangeQuizTitle = (event) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            title: event.target.value,
        }));
    };

    const handleChangeQuizDescription = (event) => {
        setQuiz((prevQuiz) => ({
            ...prevQuiz,
            description: event.target.value,
        }));
    };

    const handleSignout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    const handleSaveQuiz = () => {
        handleSubmitSave();
    };

    const handleBlur = () => {
        if (!quiz.title.trim()) {
            toast.info("Title cannot be empty.");
        }
    };

    return (
        <nav className="w-full flex flex-wrap items-center justify-between p-5 bg-[#FFFFFF] text-black drop-shadow-md pb-8">
            {/* Logo */}
            <div className="flex pl-6 items-baseline text-[2rem] sm:text-[3.09rem] font-bold font-mogula">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'text-black' : '')}>
                    Mogula
                </NavLink>
            </div>
            <div className="flex flex-col sm:flex-row items-baseline flex-wrap w-full sm:w-auto space-y-4 sm:space-y-0">
                {/* Inputs and controls */}
                <div className="flex flex-col sm:flex-row items-baseline space-y-4 sm:space-x-14 sm:space-y-0 flex-wrap w-full sm:w-auto">
                    {/* Title */}
                    <div className="flex flex-col sm:flex-row items-baseline space-y-2 sm:space-y-0 sm:space-x-4 flex-wrap">
                        <label htmlFor="quiz_title" className="text-lg font-medium">Title</label>

                        <input
                            id="quiz_title"
                            name="quiz_title"
                            value={quiz.title}
                            onChange={handleChangeQuizTitle}
                            onBlur={handleBlur}
                            placeholder="Quiz title"
                            className="border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                        />

                    </div>

                    {/* Difficulty */}
                    <div className="flex flex-col sm:flex-row items-baseline space-y-2 sm:space-y-0 sm:space-x-2">
                        <span className="text-lg font-medium">Difficulty quiz</span>
                        <DifficultyQuizStars
                            initialDifficulty={quiz.difficulty}
                            onDifficultyChange={handleOnDifficultyChange}
                        />
                    </div>

                    {/* Publish */}
                    <div className="flex flex-col sm:flex-row items-baseline space-y-2 sm:space-y-0 sm:space-x-3">
                        <label htmlFor="quiz_checkbox" className="text-lg items-center font-medium">Make quiz public</label>
                        <input

                            type="checkbox"
                            id="quiz_checkbox"
                            name="quiz_checkbox"
                            checked={quiz.isPublic || false}
                            onChange={handleChangeIsPublicQuiz}
                            className="p-2 m-0 w-5 h-4"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col sm:flex-row items-baseline space-y-2 sm:space-y-0 sm:space-x-4">
                        <label htmlFor="quiz_description" className="text-lg font-medium">Description</label>
                        <input
                            id="quiz_description"
                            name="quiz_description"
                            value={quiz.description}
                            onChange={handleChangeQuizDescription}
                            placeholder="Quiz description"
                            className="border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                        />
                    </div>
                </div>

                {/* Menu Buttons */}

            </div>
            <ul className="flex flex-col sm:flex-row items-baseline space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <li>
                    <button
                        onClick={() => { navigate('/') }}
                        className="text-black font-helvetica p-2 text-[1.2rem] sm:text-[1.401rem] bg-transparent hover:bg-transparent border-none hover:text-black focus:outline-none w-full sm:w-36 h-16"
                    >
                        Exit
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleSaveQuiz}
                        className="text-white w-full sm:w-36 h-16 bg-black p-1.5 rounded-full hover:bg-black hover:text-white focus:outline-none"
                        style={{ fontFamily: 'Helvetica', fontSize: '1.2rem' }}
                    >
                        Save
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleSignout}
                        className="bg-black text-white p-1.5 w-full sm:w-36 h-16 rounded-full hover:bg-black hover:text-white focus:outline-none"
                        style={{ fontFamily: 'Helvetica', fontSize: '1.2rem' }}
                    >
                        Sign out
                    </button>
                </li>
            </ul>
        </nav>

    );
}
