import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";
import { wait } from '@testing-library/user-event/dist/utils';
import DifficultyQuizStars from './GlobalQuizDifficultyStars';




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



    return (
        <nav className="relative w-full flex justify-between items-center p-5 text-black ">
            <div className="text-[3.09rem] font-bold font-mogula">
                <NavLink to="/" className={({ isActive }) => (isActive ? 'text-black' : '')}>Quiz</NavLink>
            </div>

            <div className="title">
                <label htmlFor="quiz_title">Titre du quiz :</label>
                <h2>  <input
                    id="quiz_title"
                    name="quiz_title"
                    value={quiz.title}
                    onChange={handleChangeQuizTitle}
                    rows="4"
                    cols="50"
                    placeholder="Enter the title of the quiz"
                    className="large-input"
                /> </h2>
            </div>
            <div className="difficulty">
                <a>Difficulty quiz</a>
                <DifficultyQuizStars initialDifficulty={quiz.difficulty}
                    onDifficultyChange={handleOnDifficultyChange} />
            </div>

            <div className="public">
                <label htmlFor="quiz_checkbox">

                    <input
                        type="checkbox"
                        id="quiz_checkbox"
                        name="quiz_checkbox"
                        checked={quiz.isPublic || false}
                        onChange={handleChangeIsPublicQuiz}
                    />
                    Publish this quiz
                </label>
            </div>


            <div className="description">
                <label htmlFor="quiz_description">Description du quiz :</label>
                <h2>  <input
                    id="quiz_description"
                    name="quiz_description"
                    value={quiz.description}
                    onChange={handleChangeQuizDescription}
                    rows="10"
                    cols="50"
                    placeholder="Enter a description for the quiz"
                    className="large-input"
                /> </h2>
                <button
                    className="md:hidden text-2xl bg-black text-white p-2 w-14 rounded focus:outline-none focus:ring-0 hover:bg-black hover:text-white"
                    onClick={toggleMenu}>
                    ☰
                </button>
            </div>

            <ul className={`md:flex md:items-center md:gap-5 list-none ${isOpen ? 'flex flex-col items-center justify-center absolute top-full left-0 w-full p-5 bg-white' : 'hidden md:flex'}`}>
                <li className="flex items-center">
                    <button
                        onClick={handleSaveQuiz}
                        className="text-black font-helvetica text-[1.401rem] bg-transparent border-none p-0 m-0 hover:text-black focus:outline-none"
                    >
                        Exit
                    </button>
                </li>
                <li className="flex items-center">
                    <button
                        onClick={handleSaveQuiz}
                        className="text-white bg-black p-2 rounded hover:bg-black hover:text-white focus:outline-none focus:ring-0"
                        style={{ fontFamily: 'Helvetica', fontSize: '1.401rem' }}>
                        Save
                    </button>
                </li>
                <li>
                    <button
                        onClick={handleSignout}
                        className="bg-black text-white p-2 rounded hover:bg-black hover:text-white focus:outline-none focus:ring-0"
                        style={{ fontFamily: 'Helvetica', fontSize: '1.401rem', borderRadius: '1.778rem' }}
                    >
                        Sign out
                    </button>
                </li>

            </ul>
        </nav >
    );
}
