import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/Navbar.css';

export default function Navbar() {
  return (
    <nav className="Navbar">
      <div className="Navbar-logo">
        <Link to="/">MyQuizApp</Link>
      </div>
      <ul className="Navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/join-quiz">Join Quiz</Link></li>
        <li><Link to="/create-quiz">Create Quiz</Link></li>
      </ul>
    </nav>
  );
}
