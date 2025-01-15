import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchSearchedQuiz } from '../services/JoinQuizService';
import CreateQuizService from '../services/CreateQuizService';
import JoinQuizCard from './JoinQuizCard';

export default function JoinQuizSearchQuiz({ onQuizSelect, enableModal }) {
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
    }, [hasNextPage, fetchNextPage, isFetchingNextPage, handleScroll]);

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
        <div className="flex flex-col items-center p-8 mx-auto">
            <label htmlFor="title" className="mb-2 font-medium">Title or Description</label>
            <input
                type="text"
                className="p-4 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-[30rem] transition-all duration-200"
                placeholder="Enter the text to search for a quiz"
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-x-4 mt-4 sm:mt-2 w-full sm:w-auto">
                <div className="flex flex-col w-full sm:w-1/2">
                    <label htmlFor="minQuestions" className="ml-2 mb-2 font-medium">Min Questions</label>
                    <input
                        id="minQuestions"
                        type="number"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                        value={minQuestions}
                        onChange={(e) => handleMinChange(e.target.value)}
                        placeholder="Min"
                    />
                </div>
                <div className="flex flex-col w-full sm:w-1/2 mt-4 sm:mt-0">
                    <label htmlFor="maxQuestions" className="ml-2 mb-2 font-medium">Max Questions</label>
                    <input
                        id="maxQuestions"
                        type="number"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                        value={maxQuestions}
                        onChange={(e) => handleMaxChange(e.target.value)}
                        placeholder="Max"
                    />
                </div>
            </div>
            <div className="w-full sm:w-1/2 flex flex-col justify-center mt-4 sm:mt-0">
                <label htmlFor="difficulty" className="text-center mb-2 font-medium">Difficulty</label>
                <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="p-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-indigo-500 transition-all duration-200 text-black"
                >
                    <option value="" disabled>Select difficulty</option>
                    {difficulties.map((difficulty) => (
                        <option key={difficulty} value={difficulty} className="text-gray-700">{difficulty}</option>
                    ))}
                </select>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-lg text-gray-400 my-6 animate-pulse">
                    Loading...
                </div>
            )}

            {/* Quiz List */}
            <div
                className="rounded-lg overflow-y-auto max-h-60 my-6 bg-gray-100 p-6 border-4 border-[#8B2DF1]"
                ref={quizListRef}
            >
                {data?.pages?.flatMap((page) => page?.quizzes || []).map((item) => (
                    <JoinQuizCard
                        enableModal={enableModal}
                        key={item.quiz_id}
                        quiz={item}
                        onQuizSelect={onQuizSelect}
                    />
                ))}

                {isFetchingNextPage && (
                    <div className="text-lg text-gray-400 mt-3 text-center animate-pulse">
                        Load more...
                    </div>
                )}

                {!isLoading && (!data?.pages || data.pages.flatMap((page) => page?.quizzes || []).length === 0) && (
                    <div className="text-lg text-gray-400 text-center mt-3">
                        No quiz found.
                    </div>
                )}
            </div>
        </div>
    );
}