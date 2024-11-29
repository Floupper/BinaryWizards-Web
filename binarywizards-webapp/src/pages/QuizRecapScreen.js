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
  const { quizId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const quiz = await RecapQuizService.getQuizDetails(quizId);
        setQuizDetails(quiz);
        setQuestions(quiz.questions);
      } catch (error) {
        console.error('Error fetching quiz details or questions:', error);
      }
    };

    fetchQuizData();

    return () => { };
  }, [quizId]);

  if (!quizDetails) {
    return <div>Loading...</div>;
  }

  const renderDifficultyStars = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '⭐';
      case 'medium':
        return '⭐⭐';
      case 'hard':
        return '⭐⭐⭐';
      default:
        return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE]">
      <Navbar />

      <EmojiProvider data={emojiData}>
        <button
          className="return-button flex items-center bg-transparent border border-gray-400 text-gray-700 py-2 px-4 rounded-[1.75rem] mt-4 ml-4 hover:bg-gray-100"
          onClick={() => navigate('/dashboard')}
        >
          <Emoji name="left-arrow" width={20} className="mr-2" />
          Return to Dashboard
        </button>
      </EmojiProvider>

      <div className="recap-container flex flex-col lg:flex-row items-start justify-center mt-8 space-y-8 lg:space-y-0 lg:space-x-20 w-full px-4">
        <div className="quiz-details p-6 rounded-[1.75rem] w-full lg:w-auto border border-black relative">
          <EmojiProvider data={emojiData}>
            <button
              className="absolute top-0 right-0 mt-2 mr-2 bg-none border-none"
              onClick={() => navigate('/')}
            >
              <Emoji name="paintbrush" width={30} />
            </button>
          </EmojiProvider>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-black break-words mr-4">{quizDetails.title}</h2>
          </div>
          <p className="mb-2">Difficulty: {renderDifficultyStars(quizDetails.difficulty)}</p>
          <p className="mb-2">Number of Questions: {quizDetails.nb_questions}</p>
          <p className="mb-2">Times Played: {quizDetails.nb_played}</p>
          <p>Average Score: {quizDetails.average_score}</p>
        </div>
        <div className="questions-panel w-full lg:w-fit h-[700px] overflow-y-auto">
          <div className="questions-list space-y-4">
            {questions.map((question, index) => (
              <RecapQuizQuestion
                key={question.question_id}
                questionNumber={index + 1}
                questionText={question.question_text}
                questionId={question.question_id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizRecapScreen;
