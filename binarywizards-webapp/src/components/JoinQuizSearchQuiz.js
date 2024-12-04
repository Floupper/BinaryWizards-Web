import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchSearchedQuiz, createGameWithQuizId } from '../services/JoinQuizService';
import CreateQuizService from '../services/CreateQuizService';
import DashboardCreatedQuizCard from './DashboardCreatedQuizCard';
import '../assets/JoinQuizSearchQuiz.css';
import QuestionRangeSelector from './JoinQuizQuestionRangeSelector';

export default function JoinQuizSearchQuiz() {
    const [text, setText] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [difficulties, setDifficulties] = useState([]);
    const quizListRef = useRef(null);
    const [minQuestions, setMinQuestions] = useState(0);
    const [maxQuestions, setMaxQuestions] = useState(50);

    useEffect(() => {
        // Fetch difficulties
        CreateQuizService.fetchDifficulties()
            .then((data) => {
                const updatedData = ['all', ...data];
                setDifficulties(updatedData);
            })
            .catch(error => toast.error(`Error fetching difficulties: ${error.message}`));
    }, []);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['quizzes', text, selectedDifficulty, minQuestions, maxQuestions],
        queryFn: ({ pageParam = 1 }) =>
            fetchSearchedQuiz({
                text,
                difficulty: selectedDifficulty,
                page: pageParam,
                maxQuestions,
                minQuestions,
            }),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        enabled: false,
    });

    // Trigger refetch on parameter updates
    useEffect(() => {
        refetch();
    }, [text, selectedDifficulty, minQuestions, maxQuestions, refetch]);

    const handleScroll = () => {
        if (quizListRef.current) {
            const { scrollHeight, scrollTop, clientHeight } = quizListRef.current;
            if (scrollHeight === scrollTop + clientHeight && hasNextPage) {
                fetchNextPage();
            }
        }
    };

    // Attach and detach scroll event listener
    useEffect(() => {
        const listElement = quizListRef.current;
        if (listElement) {
            listElement.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (listElement) {
                listElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasNextPage, fetchNextPage]);

    const handleTextChange = (value) => {
        setText(value);
    };

    return (
        <div className="search-quiz-container">
            <h2>Browse Quiz</h2>
            <input
                type="text"
                className="search-input"
                placeholder="Enter the text to search for a quiz"
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
            />
            <QuestionRangeSelector
                minQuestions={minQuestions}
                maxQuestions={maxQuestions}
                onMinChange={setMinQuestions}
                onMaxChange={setMaxQuestions}
            />
            <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="dropdown"
            >
                <option value="" disabled>
                    Select difficulty
                </option>
                {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                        {difficulty}
                    </option>
                ))}
            </select>

            {isLoading && <div className="loading-indicator">Loading...</div>}
            <div
                className="quiz-list"
                ref={quizListRef}
                style={{ overflowY: 'auto', maxHeight: '20rem' }}
            >
                {data?.pages?.flatMap((page) => page?.quizzes || []).map((item) => (
                    <DashboardCreatedQuizCard
                        key={item.id}
                        quiz={item}
                        route={'/question/'}
                    />
                ))}

                {isFetchingNextPage && (
                    <div className="loading-indicator">Loading more...</div>
                )}

                {!isLoading &&
                    (!data?.pages || data.pages.flatMap((page) => page?.quizzes || []).length === 0) && (
                        <div className="empty-message">No quizzes found.</div>
                    )}
            </div>
        </div>
    );
}