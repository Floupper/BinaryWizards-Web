import React, { useState } from 'react';
import { connectUser } from '../services/connectService';
import { useNavigate } from 'react-router-dom';
import '../assets/Auth.css';
import bcrypt from 'bcryptjs';

function ConnectScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const token = await connectUser(username, hashedPassword);
      if (token) {
        localStorage.setItem('token', token);
        navigate('/dashboard'); 
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setError('Invalid username or password');
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Log In</button>
        <button type="button" onClick={() => navigate('/signup')}>Don't have an account? Sign Up</button>
      </form>
    </div>
  );
}

export default ConnectScreen;