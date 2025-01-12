import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlayersList from "../components/PlayerListe";

export default function TeamModeJoinTeam() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const gameMode = "team";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/signin?redirect=/team-mode-join-team/${gameId}`);
    }
  }, [navigate, gameId]);

  return (
    <div>
      <PlayersList gameMode={gameMode} />
    </div>
  );
}
