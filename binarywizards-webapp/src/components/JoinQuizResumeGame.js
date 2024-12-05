import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import HistoryGamePlayService from "../services/HistoryGamePlayService";
import ResumGameCard from "./ResumGameCard";

export default function JoinQuizResumeGame() {
  const gameListRef = useRef(null);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = () => {
    refetch();
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['unfinished_games'],
    queryFn: ({ pageParam = 1 }) => HistoryGamePlayService.getStartedGames({page: pageParam}),
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    enabled: false,
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
      listElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (listElement) {
        listElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Resume Game</h2>

      {isLoading && (
        <div className="flex justify-center items-center h-20">
          <span className="text-gray-500">Loading...</span>
        </div>
      )}

      <div
        className="game-list overflow-y-auto border border-gray-300 rounded-lg p-4 mx-auto w-[37.5rem]"
        ref={gameListRef}
      >
        {data?.pages
          ?.flatMap((page) => page.unfinished_games || [])
          .map((item) => (
            <ResumGameCard
              key={item.game_id}
              quiz={item}
              route={`/question/${item.game_id}`}
            />
          ))}

        {isFetchingNextPage && (
          <div className="flex justify-center items-center h-20">
            <span className="text-gray-500">Loading more...</span>
          </div>
        )}

        {!isLoading &&
          (!data?.pages ||
            data.pages.flatMap((page) => page.unfinished_games || []).length ===
              0) && (
            <div className="flex justify-center items-center h-20">
              <span className="text-gray-500">No games found.</span>
            </div>
          )}
      </div>
    </div>
  );
}
