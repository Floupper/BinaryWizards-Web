import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../assets/Navbar.css';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleSignout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <nav className="Navbar">
      <div className="Navbar-logo">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Quiz</NavLink>
      </div>
      <ul className="Navbar-links">
        <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active-link' : '')}>Home</NavLink></li>
        <li><NavLink to="/join-quiz" className={({ isActive }) => (isActive ? 'active-link' : '')}>Join Quiz</NavLink></li>
        <li><NavLink to="/create-quiz" className={({ isActive }) => (isActive ? 'active-link' : '')}>Create Quiz</NavLink></li>
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
