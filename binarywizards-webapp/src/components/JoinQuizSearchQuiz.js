import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { fetchSearchedQuiz, createGameWithQuizId } from '../services/JoinQuizService';
import CreateQuizService from '../services/CreateQuizService';
import JoinQuizCard from './JoinQuizCard';
import QuestionRangeSelector from './JoinQuizQuestionRangeSelector';

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
            .catch(error => toast.error(`Erreur lors de la récupération des difficultés : ${error.message}`));
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
    };

    const handleMinQuestionsChange = (value) => {
        setMinQuestions(value);
    };

    const handleMaxQuestionsChange = (value) => {
        setMaxQuestions(value);
    };

    return (
        <div className="flex flex-col items-center p-8 w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Rechercher un Quiz</h2>
            <input
                type="text"
                className="p-4 text-lg border-2 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                placeholder="Entrez le texte pour rechercher un quiz"
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
            />
            <QuestionRangeSelector
                minQuestions={minQuestions}
                maxQuestions={maxQuestions}
                onMinChange={handleMinQuestionsChange}
                onMaxChange={handleMaxQuestionsChange}
                className="w-full p-2 text-lg border-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="mt-4 p-2 text-lg border-2 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            >
                <option value="" disabled>
                    Sélectionnez une difficulté
                </option>
                {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                        {difficulty}
                    </option>
                ))}
            </select>

            {isLoading && <div className="text-lg text-gray-600 mb-4">Chargement...</div>}
            
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
                    <div className="text-lg text-gray-600 mt-3">Chargement de plus...</div>
                )}

                {!isLoading &&
                    (!data?.pages || data.pages.flatMap((page) => page?.quizzes || []).length === 0) && (
                        <div className="text-lg text-gray-600 text-center mt-3">Aucun quiz trouvé.</div>
                    )}
            </div>
            
            {!isFetchingNextPage && hasNextPage && (
                <button
                    onClick={() => fetchNextPage()}
                    className="mt-3 px-6 py-2 bg-[#8B2DF1] text-white rounded-md hover:bg-[#7322c3] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    Charger Plus
                </button>
            )}
        </div>
    );
}
