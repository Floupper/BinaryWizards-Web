import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayersList from "../components/PlayerListe";
import Spinner from "../components/Spinner";

export default function TeamModeJoinTeam() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const gameMode = "team";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate(`/signin?redirect=/team-mode-join-team/${gameId}`);
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate, gameId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner size="8" className="text-black mb-4" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PlayersList gameMode={gameMode} />
    </div>
  );
}