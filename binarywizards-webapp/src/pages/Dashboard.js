import React, { useEffect, useState } from 'react';
import DashboardService from '../services/DashboardService.js';
import PlayedQuizCard from '../components/DashboardPlayedQuizCard.js';
import CreatedQuizCard from '../components/DashboardCreatedQuizCard.js';
import Navbar from '../components/Navbar.js';
import Spinner from '../components/Spinner.js';

export default function Dashboard() {
  const [userQuizzes, setUserQuizzes] = useState([]);
  const [playedQuizzes, setPlayedQuizzes] = useState([]);
  const [activeTab, setActiveTab] = useState('created');
  const [isLoadingCreated, setIsLoadingCreated] = useState(true);
  const [isLoadingPlayed, setIsLoadingPlayed] = useState(true);
  const userId = localStorage.getItem('token');

  useEffect(() => {
    if (userId) {
      setIsLoadingCreated(true);
      setIsLoadingPlayed(true);

      DashboardService.getUserQuizzes(userId)
        .then(data => setUserQuizzes(data))
        .catch(error => console.error('Error fetching user quizzes:', error))
        .finally(() => setIsLoadingCreated(false));

      DashboardService.getPlayedQuizzes(userId)
        .then(data => setPlayedQuizzes(data))
        .catch(error => console.error('Error fetching played quizzes:', error))
        .finally(() => setIsLoadingPlayed(false));
    }
  }, [userId]);

  return (
    <div className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/backgrounds/JoinQuizBackground.svg')" }}
    >
      <Navbar />
      <div className="p-6">
        <div className="flex space-x-4 mb-4 text-xl lg:text-2xl">
          <button
            className={`px-6 py-3 rounded-md hover:bg-black hover:text-white ${activeTab === 'created' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('created')}
            style={{ outline: 'none', boxShadow: 'none' }}
          >
            Your Created Quizzes
          </button>
          <button
            className={`px-6 py-3 rounded-md hover:bg-black hover:text-white ${activeTab === 'played' ? 'bg-black text-white' : 'bg-white text-black'}`}
            onClick={() => setActiveTab('played')}
            style={{ outline: 'none', boxShadow: 'none' }}
          >
            Your Played Quizzes
          </button>
        </div>
        <div className="quiz-list max-h-[43.75rem] w-full overflow-y-auto">
          {activeTab === 'created' && (
            <>
              {isLoadingCreated ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="8" className="text-black" />
                </div>
              ) : (
                <div className="justify-items-center items-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {userQuizzes.map((quiz) => (
                    <CreatedQuizCard key={quiz.id} quiz={quiz} route={`/dashboard/detail-create-quiz/${quiz.id}`} />
                  ))}
                </div>
              )}
            </>
          )}
          {activeTab === 'played' && (
            <>
              {isLoadingPlayed ? (
                <div className="flex justify-center items-center h-64">
                  <Spinner size="8" className="text-black" />
                </div>
              ) : (
                <div className="justify-items-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {playedQuizzes.map((quiz) => (
                    <PlayedQuizCard key={quiz.game_id} quiz={quiz} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}