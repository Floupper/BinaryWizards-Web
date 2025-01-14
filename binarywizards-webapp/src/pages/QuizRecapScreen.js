import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RecapQuizService from '../services/RecapQuizService';
import RecapQuizQuestion from '../components/RecapQuizQuestion';
import Navbar from '../components/Navbar';
import { EmojiProvider, Emoji } from "react-apple-emojis";
import emojiData from "react-apple-emojis/src/data.json";

const QuizRecapScreen = () => {
  const [quizDetails, setQuizDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quiz = await RecapQuizService.getQuizDetails(quizId);
        setQuizDetails(quiz);
        setQuestions(quiz.questions);
      } catch (err) {
        console.error('Error fetching quiz details or questions:', err);
        setError('Failed to load quiz data. Please try again later.');
      }
    };

    fetchQuizData();
  }, [quizId]);

  const renderDifficultyStars = (difficulty) => {
    const starMap = {
      easy: '⭐',
      medium: '⭐⭐',
      hard: '⭐⭐⭐',
    };
    return starMap[difficulty.toLowerCase()] || difficulty;
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F2EE]">
        <p className="text-red-500 text-xl font-semibold mb-4">{error}</p>
        <button
          className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300"
          onClick={() => navigate('/dashboard')}
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  if (!quizDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F2EE]">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-start justify-center mt-8 space-y-8 lg:space-y-0 lg:space-x-20 w-full px-4">
        {/* Quiz Details */}
        <div className="p-6 rounded-xl w-full lg:w-1/3 border border-gray-300 shadow-lg bg-white relative">
          <EmojiProvider data={emojiData}>
            <button
              className="absolute top-4 right-4 bg-transparent p-2 rounded-full hover:bg-gray-200 transition-all duration-300"
              onClick={() => navigate('/create-quiz', { state: { quizId } })}
              aria-label="Edit Quiz"
            >
              <Emoji name="paintbrush" width={30} />
            </button>
          </EmojiProvider>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 break-words">{quizDetails.title}</h2>
          <p className="text-gray-700 mb-2">Difficulty: {renderDifficultyStars(quizDetails.difficulty)}</p>
          <p className="text-gray-700 mb-2">Number of Questions: {quizDetails.nb_questions}</p>
          <p className="text-gray-700 mb-2">Times Played: {quizDetails.nb_played}</p>
          <p className="text-gray-700">Average Score: {quizDetails.average_score}</p>
        </div>

        {/* Questions Panel */}
        <div className="w-full lg:w-2/3 h-[700px] overflow-y-auto bg-white border border-gray-300 shadow-lg rounded-xl p-4">
          <div className="space-y-4">
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <RecapQuizQuestion
                  key={question.question_id}
                  questionNumber={index + 1}
                  questionText={question.question_text}
                  questionId={question.question_id}
                />
              ))
            ) : (
              <p className="text-gray-500">No questions available for this quiz.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizRecapScreen;