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
        <nav className=" w-full h-full flex  items-baseline justify-between p-5 bg-[#FFFFFF] text-black drop-shadow-md pb-8">
            {/* Logo */}
            <div className="flex pl-6 items-baseline  text-[3.09rem] font-bold font-mogula ">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'text-black' : '')}>
                    Quiz
                </NavLink>
            </div>
            <div className="flex items-baseline flex-wrap">
                {/* Inputs and controls */}
                <div className="flex items-baseline  space-x-14 flex-wrap">
                    {/* Title */}
                    <div className="flex items-baseline space-x-4 flex-wrap">
                        <label htmlFor="quiz_title" className="text-lg font-medium">Title</label>

                        <input
                            id="quiz_title"
                            name="quiz_title"
                            value={quiz.title}
                            onChange={handleChangeQuizTitle}
                            onBlur={handleBlur}
                            placeholder="Quiz title"
                            className="border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />

                    </div>

                    {/* Difficulty */}
                    <div className="flex items-baseline flex-wrap space-x-2">
                        <span className="text-lg font-medium">Difficulty quiz</span>
                        <DifficultyQuizStars
                            initialDifficulty={quiz.difficulty}
                            onDifficultyChange={handleOnDifficultyChange}
                        />
                    </div>

                    {/* Publish */}
                    <div className="flex items-baseline space-x-3">
                        <label htmlFor="quiz_checkbox" className="text-lg items-center font-medium">Make quiz public</label>
                        <input

                            type="checkbox"
                            id="quiz_checkbox"
                            name="quiz_checkbox"
                            checked={quiz.isPublic || false}
                            onChange={handleChangeIsPublicQuiz}
                            className="p-2 m-0 w-5 h-4 "
                        />
                    </div>

                    {/* Description */}
                    <div className="flex items-baseline space-x-4">
                        <label htmlFor="quiz_description" className="text-lg font-medium">Description</label>
                        <input
                            id="quiz_description"
                            name="quiz_description"
                            value={quiz.description}
                            onChange={handleChangeQuizDescription}
                            placeholder="Quiz description"
                            className="border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Menu Buttons */}

            </div>
            <ul className={`flex items-baseline space-x-4`}>
                <li>
                    <button
                        onClick={() => { navigate('/') }}
                        className="text-black font-helvetica p-2 text-[1.401rem] bg-transparent hover:bg-transparent border-none hover:text-black focus:outline-none"
                    >
                        Exit
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleSaveQuiz}
                        className="text-white bg-black p-1.5 rounded-full hover:bg-black hover:text-white focus:outline-none"
                        style={{ fontFamily: 'Helvetica', fontSize: '1.401rem' }}
                    >
                        Save
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleSignout}
                        className="bg-black text-white p-1.5 rounded-full hover:bg-black hover:text-white focus:outline-none"
                        style={{ fontFamily: 'Helvetica', fontSize: '1.401rem' }}
                    >
                        Sign out
                    </button>
                </li>
            </ul>
        </nav>

    );
}
