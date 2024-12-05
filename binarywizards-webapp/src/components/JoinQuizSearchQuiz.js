import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchSearchedQuiz } from '../services/JoinQuizService';
import CreateQuizService from '../services/CreateQuizService';
import DashboardCreatedQuizCard from './DashboardCreatedQuizCard';
import '../assets/JoinQuizSearchQuiz.css';
import QuestionRangeSelector from './JoinQuizQuestionRangeSelector';
import JoinQuizCard from './JoinQuizCard';

export default function JoinQuizSearchQuiz() {
    const [text, setText] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [difficulties, setDifficulties] = useState([]);
    const quizListRef = useRef(null);
    const [minQuestions, setMinQuestions] = useState(0);
    const [maxQuestions, setMaxQuestions] = useState(50);

    useEffect(() => {
        CreateQuizService.fetchDifficulties()
            .then((data) => {
                setDifficulties(['all', ...data]);
            })
            .catch(error => toast.error(`Error fetching difficulties : ${error.message}`));
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

    useEffect(() => {
        refetch();
    }, [text, selectedDifficulty, minQuestions, maxQuestions, refetch]);

    const handleScroll = () => {
        if (quizListRef.current) {
            const { scrollHeight, scrollTop, clientHeight } = quizListRef.current;
            if (scrollHeight - scrollTop <= clientHeight + 50 && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    };

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
    }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

    const handleTextChange = (value) => {
        setText(value);
        refetch();
    };

    const handleMinChange = (value) => {
        const parsedValue = Math.max(0, parseInt(value, 10) || 0);
        setMinQuestions(parsedValue);
        if (parsedValue > maxQuestions) {
            setMaxQuestions(parsedValue);
        }
        refetch();
    };

    const handleMaxChange = (value) => {
        const parsedValue = Math.min(50, parseInt(value, 10) || 50);
        setMaxQuestions(parsedValue);
        if (parsedValue < minQuestions) {
            setMinQuestions(parsedValue);
        }
        refetch();
    };

    return (
        <div className="flex flex-col items-center p-8 w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Browse Quiz</h2>
            <input
                type="text"
                className="p-4 text-lg border-2 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                placeholder="Enter the text to search for a quiz"
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
            />
            <h2 className="text-lg text-white font-semibold mb-2">Select the number of questions</h2>
            <div className="flex space-x-4">
                <div className="flex flex-col">
                    <label htmlFor="minQuestions" className="mb-2 text-white">Min</label>
                    <input
                        id="minQuestions"
                        type="number"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={minQuestions}
                        onChange={(e) => handleMinChange(e.target.value)}
                        placeholder="Min"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="maxQuestions" className="mb-2 text-white">Max</label>
                    <input
                        id="maxQuestions"
                        type="number"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={maxQuestions}
                        onChange={(e) => handleMaxChange(e.target.value)}
                        placeholder="Max"
                    />
                </div>
            </div>
            <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="mt-4 p-2 text-lg border-2 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
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

            {isLoading && <div className="text-lg text-gray-600 mb-4">Loading...</div>}

            <div
                className="w-full p-2 rounded-lg overflow-y-auto max-h-60"
                ref={quizListRef}
            >
                {data?.pages?.flatMap((page) => page?.quizzes || []).map((item) => (
                    <JoinQuizCard
                        key={item.id}
                        quiz={item}
                        route={'/question/'}
                        className="mb-4"
                    />
                ))}

                {isFetchingNextPage && (
                    <div className="text-lg text-gray-600 mt-3">Load more...</div>
                )}

                {!isLoading &&
                    (!data?.pages || data.pages.flatMap((page) => page?.quizzes || []).length === 0) && (
                        <div className="text-lg text-gray-600 text-center mt-3">No quiz found.</div>
                    )}
            </div>

            {!isFetchingNextPage && hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    className="mt-3 px-6 py-2 bg-[#8B2DF1] text-white rounded-md hover:bg-[#7322c3] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Load more
                </button>
            )}
        </div>
    );
}