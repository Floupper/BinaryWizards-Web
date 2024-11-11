import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/Navbar.css';

export default function Navbar() {
  return (
    <nav className="Navbar">
      <div className="Navbar-logo">
        <NavLink to="/" activeClassName="active-link">MyQuizApp</NavLink>
      </div>
      <ul className="Navbar-links">
        <li><NavLink to="/" activeClassName="active-link">Home</NavLink></li>
        <li><NavLink to="/join-quiz" activeClassName="active-link">Join Quiz</NavLink></li>
        <li><NavLink to="/create-quiz" activeClassName="active-link">Create Quiz</NavLink></li>
      </ul>
    </nav>
  );
}