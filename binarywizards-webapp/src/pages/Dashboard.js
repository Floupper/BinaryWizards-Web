import React, { useEffect, useState } from 'react';
import DashboardService from '../services/DashboardService.js';
import PlayedQuizCard from '../components/DashboardPlayedQuizCard.js';
import CreatedQuizCard from '../components/CreatedQuizCard.js';
import Navbar from '../components/Navbar.js';

export default function Dashboard() {
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [playedQuizzes, setPlayedQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('created');
  const userId = localStorage.getItem('token');

  useEffect(() => {
    if (userId) {
      DashboardService.getUserQuizzes(userId)
        .then(data => setUserQuizzes(data))
        .catch(error => console.error('Error fetching user quizzes:', error));

      DashboardService.getPlayedQuizzes(userId)
        .then(data => setPlayedQuizzes(data))
        .catch(error => console.error('Error fetching played quizzes:', error));
    }
  }, [userId]);

  return (
    <div className="bg-[#F4F2EE] min-h-screen ">
      <Navbar />
      <div className="p-6">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded-md font-semibold font-helvetica hover:bg-black hover:text-white ${activeTab === 'created' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('created')}
            style={{ outline: 'none', boxShadow: 'none' }}
          >
            Your Created Quizzes
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold font-helvetica hover:bg-black hover:text-white ${activeTab === 'played' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('played')}
            style={{ outline: 'none', boxShadow: 'none' }}
          >
            Your Played Quizzes
          </button>
        </div>
        <div className="quiz-list max-h-[43.75rem] max-w-[100rem] overflow-y-auto">
          {activeTab === 'created' && (
            <div className="flex flex-col gap-4">
              {userQuizzes.map((quiz) => (
                <CreatedQuizCard key={quiz.id} quiz={quiz} route={`/dashboard/detail-create-quiz/${quiz.id}`} />
              ))}
            </div>
          )}
          {activeTab === 'played' && (
            <div className="flex flex-col gap-4">
              {playedQuizzes.map((quiz) => (
                <PlayedQuizCard key={quiz.game_id} quiz={quiz} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
