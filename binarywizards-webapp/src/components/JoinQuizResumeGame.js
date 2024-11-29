import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import HistoryGamePlayService from '../services/HistoryGamePlayService';
import DashboardPlayQuizCard from './DashboardPlayedQuizCard';
import '../assets/JoinQuizSearchQuiz.css';

export default function JoinQuizResumeGame() {
    const gameListRef = useRef(null); 

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryFn: ({ pageParam = 1 }) =>
            HistoryGamePlayService.getStartedGames(pageParam),
        getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
        enabled: true, 
    });

    const handleScroll = () => {
        if (gameListRef.current) {
            const isBottom =
                gameListRef.current.scrollHeight ===
                gameListRef.current.scrollTop + gameListRef.current.clientHeight;
            if (isBottom && hasNextPage) {
                fetchNextPage();
            }
        }
    };

    useEffect(() => {
        const listElement = gameListRef.current;
        if (listElement) {
            listElement.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (listElement) {
                listElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, [hasNextPage, fetchNextPage]);

    return (
        <div className="search-quiz-container">
            <h2>Resume Game</h2>

            {isLoading && <div className="loading-indicator">Loading...</div>}

            <div
                className="game-list"
                ref={gameListRef}
                style={{ overflowY: 'auto', maxHeight: '20rem' }}
            >
                {data?.pages?.flatMap((page) => page?.games || []).map((item) => (
                    <DashboardPlayQuizCard
                        key={item?.game_id}
                        quiz={item}
                        route={`/question/${item?.game_id}`} 
                    />
                ))}

                {isFetchingNextPage && (
                    <div className="loading-indicator">Loading more...</div>
                )}

                {!isLoading && (!data?.pages || data.pages.flatMap((page) => page?.games || []).length === 0) && (
                    <div className="empty-message">No games found.</div>
                )}
            </div>
        </div>
    );
}