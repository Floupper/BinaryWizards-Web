import React, { useState } from 'react';
import { signupUser, checkUsernameAvailability } from '../services/signupService';
import { useNavigate } from 'react-router-dom';
import '../assets/Auth.css';
import bcrypt from 'bcryptjs';

function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const usernameAvailable = await checkUsernameAvailability(username);
      if (!usernameAvailable) {
        setError('Username is already taken');
        return;
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      const userId = await signupUser(username, hashedPassword);
      if (userId) {
        localStorage.setItem('user_id', userId);
        navigate('/dashboard'); // Redirect to the dashboard or another page after sign up
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      setError('Failed to create an account');
    }
  };

  return (
    <div className="AuthFormContainer">
      <form className="AuthForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Sign Up</button>
        <button type="button" onClick={() => navigate('/login')}>Already have an account? Log In</button>
      </form>
    </div>
  );
}

export default SignupScreen;