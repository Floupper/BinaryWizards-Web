import React, { useState, useEffect } from 'react';
import { ConnectService } from '../services/ConnectService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ConnectScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    setIsLoading(true);
    setError('');

    try {
      const token = await ConnectService(username, password);
      if (token) {
        localStorage.setItem('token', token);
        console.log('token:', token);
        const redirectPath = searchParams.get('redirect') || '/dashboard';
        navigate(redirectPath);
      }
    } catch (error) {
      console.error('Error during submission:', error);
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[rgba(228,187,145,0.5)] via-[rgba(138,43,242,0.5)] to-[rgba(41,96,240,0.5)] min-h-screen overflow-hidden">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Username:</label>
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
            <label className="block text-gray-700 font-bold mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-black rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className={`w-full bg-black text-white py-3 rounded-lg mb-4 transition ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            disabled={isLoading}
          >
            Don't have an account? Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
