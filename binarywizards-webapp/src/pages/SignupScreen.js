import React, { useState, useEffect } from 'react';
import { SignupUser, checkUsernameAvailability } from '../services/SignupService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Spinner from '../components/Spinner';

function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const usernameAvailable = await checkUsernameAvailability(username);
      if (!usernameAvailable) {
        setError('Username is already taken');
        return;
      }
      const token = await SignupUser(username, password);
      if (token) {
        localStorage.setItem('token', token);
        const redirectPath = searchParams.get('redirect') || '/dashboard';
        navigate(redirectPath);
        return;
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      setError('Failed to create an account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-gradient-to-b from-[rgba(228,187,145,0.5)] via-[rgba(138,43,242,0.5)] to-[rgba(41,96,240,0.5)] min-h-screen overflow-hidden'>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className={`w-full bg-black text-white py-3 rounded-lg mb-4 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner size="5" className="mr-2" />
              </div>
            ) : (
              'Sign Up'
            )}
          </button>
          <button
            type="button"
            onClick={() => (searchParams.get('redirect') ? navigate('/signin?redirect=' + searchParams.get('redirect')) : navigate('/signin'))}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            disabled={isLoading}
          >
            Already have an account? Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupScreen;