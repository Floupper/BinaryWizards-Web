import React, { useState } from 'react'; // Importation de useState
import { NavLink, useNavigate } from 'react-router-dom';
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";
import '../assets/Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); 
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <nav className="Navbar">
      <div className="Navbar-logo">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Quiz</NavLink>
      </div>
      <button className="Navbar-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <ul className={`Navbar-links ${isOpen ? 'open' : ''}`}>
        <li>
          <EmojiProvider data={emojiData}>
            <Emoji name="house" width={20} />
          </EmojiProvider>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink>
        </li>
        <li>
          <EmojiProvider data={emojiData}>
            <Emoji name="waving-hand" width={20} />
          </EmojiProvider>
          <NavLink to="/join-quiz" className={({ isActive }) => (isActive ? 'active-link' : '')}>Join Quiz</NavLink>
        </li>
        <li>
          <EmojiProvider data={emojiData}>
            <Emoji name="paintbrush" width={20} />
          </EmojiProvider>
          <NavLink to="/create-quiz" className={({ isActive }) => (isActive ? 'active-link' : '')}>Create Quiz</NavLink>
        </li>
        {token ? (
          <div className="Navbar-links">
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>Dashboard</NavLink>
            </li>
            <li>
              <button onClick={handleSignout}>Sign out</button>
            </li>
          </div>
        ) : (
          <li>
            <NavLink to="/signin" className={({ isActive }) => (isActive ? 'active-link' : '')}>Sign in</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
