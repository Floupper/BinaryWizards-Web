import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/Navbar.css';

export default function Navbar() {
  return (
    <nav className="Navbar">
      <div className="Navbar-logo">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Quiz</NavLink>
      </div>
      <ul className="Navbar-links">
        <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink></li>
        <li><NavLink to="/join-quiz" className={({ isActive }) => (isActive ? 'active-link' : '')}>Join Quiz</NavLink></li>
        <li><NavLink to="/create-quiz" className={({ isActive }) => (isActive ? 'active-link' : '')}>Create Quiz</NavLink></li>
      </ul>
    </nav>
  );
}
