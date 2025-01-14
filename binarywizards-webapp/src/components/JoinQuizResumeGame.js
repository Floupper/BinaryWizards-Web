import React, { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import HistoryGamePlayService from "../services/HistoryGamePlayService";
import ResumGameCard from "./ResumGameCard";

export default function JoinQuizResumeGame() {
  const gameListRef = useRef(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['unfinished_games'],
    queryFn: ({ pageParam = 1 }) => HistoryGamePlayService.getStartedGames({ page: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    enabled: false, // Disabled until you call handleSearch()
  });

  useEffect(() => {
    refetch(); // Trigger refetch on mount
  }, [refetch]);

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
    <div className="mx-auto px-4 xl:px-20 py-6 w-full">
      {/* Game List */}
      <div
        className="rounded-lg overflow-y-auto my-6 bg-gray-100 p-6 border-4 border-[#8B2DF1] h-[30rem]"
        ref={gameListRef}
      >
        {/* Loader */}
        {isLoading && (
          <div className="flex justify-center items-center h-20">
            <span className="text-lg text-gray-500 animate-pulse">
              Loading...
            </span>
          </div>
        )}

        {data?.pages?.flatMap((page) => page.unfinished_games || []).map((item) => (
          <ResumGameCard
            key={item.game_id}
            quiz={item}
            route={`/question/${item.game_id}`}
          />
        ))}

        {/* Loading More */}
        {isFetchingNextPage && (
          <div className="flex justify-center items-center h-20">
            <span className="text-lg text-gray-500 animate-pulse">
              Loading more...
            </span>
          </div>
        )}

        {/* No Games Found */}
        {!isLoading &&
          (!data?.pages ||
            data.pages.flatMap((page) => page.unfinished_games || []).length === 0) && (
            <div className="flex justify-center items-center h-20">
              <span className="text-lg text-gray-500">
                No games found.
              </span>
            </div>
          )}
      </div>
    </div>
  );
}